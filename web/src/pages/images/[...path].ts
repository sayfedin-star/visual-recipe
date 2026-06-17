import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
  const { path } = params;
  if (!path) {
    return new Response('Not Found', { status: 404 });
  }

  // Get the query string from the incoming request (w, h, q, fm, etc.)
  const url = new URL(request.url);
  const searchParams = url.search;

  // Construct Sanity CDN URL
  const sanityUrl = `https://cdn.sanity.io/images/${path}${searchParams}`;

  // 1. Determine client format capabilities from Accept header
  const acceptHeader = request.headers.get('accept') || '';
  let clientFormat = 'fallback';
  if (acceptHeader.includes('image/avif')) {
    clientFormat = 'avif';
  } else if (acceptHeader.includes('image/webp')) {
    clientFormat = 'webp';
  }

  // 2. Setup Cloudflare Cache API (if available in Cloudflare Workers runtime)
  const isCloudflare = typeof caches !== 'undefined';
  let cacheKey: Request | null = null;
  let cache: any = null;

  if (isCloudflare) {
    try {
      cache = (caches as any).default;
      // Construct a unique cache key URL by appending clientFormat parameter
      const cacheKeyUrl = new URL(request.url);
      cacheKeyUrl.searchParams.set('cf-format', clientFormat);
      cacheKey = new Request(cacheKeyUrl.toString(), {
        headers: request.headers,
        method: request.method,
      });

      // Try matching the request in Cloudflare cache
      const cachedResponse = await cache.match(cacheKey);
      if (cachedResponse) {
        return cachedResponse;
      }
    } catch (e) {
      console.error("Cache match error:", e);
    }
  }

  try {
    // Forward the Accept header from the browser to Sanity for content negotiation (AVIF/WebP)
    const forwardHeaders = new Headers();
    if (acceptHeader) {
      forwardHeaders.set('accept', acceptHeader);
    }

    const response = await fetch(sanityUrl, {
      headers: forwardHeaders
    });
    
    if (!response.ok) {
      return new Response('Failed to fetch image from source', { status: response.status });
    }

    // Create a new Headers object and set caching policy
    const newHeaders = new Headers();
    
    const contentType = response.headers.get('content-type') || '';
    if (contentType) {
      newHeaders.set('content-type', contentType);
    }
    
    const contentLength = response.headers.get('content-length');
    if (contentLength) {
      newHeaders.set('content-length', contentLength);
    }

    // 3. Determine Caching Strategy
    // Sanity generates formats lazily. If we request AVIF but get webp/png back,
    // we should NOT cache it aggressively, because we want subsequent
    // requests to hit Sanity again and get the newly generated AVIF.
    let cacheControl = 'public, max-age=10'; // Low TTL fallback if format doesn't match
    let shouldCache = true;

    if (clientFormat === 'avif') {
      if (contentType.includes('image/avif')) {
        cacheControl = 'public, max-age=31536000, immutable';
      } else {
        // Requested AVIF but got WebP or PNG (still generating).
        // Let's set a very low max-age (or no-store) so we try again soon.
        cacheControl = 'public, no-cache, no-store, must-revalidate';
        shouldCache = false;
      }
    } else if (clientFormat === 'webp') {
      if (contentType.includes('image/webp') || contentType.includes('image/avif')) {
        cacheControl = 'public, max-age=31536000, immutable';
      } else {
        cacheControl = 'public, no-cache, no-store, must-revalidate';
        shouldCache = false;
      }
    } else {
      // For other formats (fallback), cache aggressively if we got the original format back
      cacheControl = 'public, max-age=31536000, immutable';
    }

    newHeaders.set('Cache-Control', cacheControl);
    if (shouldCache) {
      newHeaders.set('CDN-Cache-Control', 'public, max-age=31536000');
    } else {
      newHeaders.set('CDN-Cache-Control', 'no-store');
    }
    newHeaders.set('Vary', 'Accept');
    newHeaders.set('Access-Control-Allow-Origin', '*');

    const proxyResponse = new Response(response.body, {
      status: 200,
      headers: newHeaders,
    });

    // 4. Save to Cloudflare Cache if appropriate
    if (isCloudflare && cache && cacheKey && shouldCache) {
      try {
        // We clone the response to write to cache while returning the original
        await cache.put(cacheKey, proxyResponse.clone());
      } catch (e) {
        console.error("Cache put error:", e);
      }
    }

    return proxyResponse;
  } catch (error) {
    console.error("Image proxy error:", error);
    return new Response('Internal Server Error', { status: 500 });
  }
};
