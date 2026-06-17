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

  try {
    const response = await fetch(sanityUrl);
    
    if (!response.ok) {
      return new Response('Failed to fetch image from source', { status: response.status });
    }

    // Create a new Headers object and set caching policy
    const newHeaders = new Headers();
    
    const contentType = response.headers.get('content-type');
    if (contentType) {
      newHeaders.set('content-type', contentType);
    }
    
    const contentLength = response.headers.get('content-length');
    if (contentLength) {
      newHeaders.set('content-length', contentLength);
    }

    // Set aggressive Cloudflare and Browser caching headers
    newHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
    newHeaders.set('CDN-Cache-Control', 'public, max-age=31536000');
    newHeaders.set('Access-Control-Allow-Origin', '*');

    return new Response(response.body, {
      status: 200,
      headers: newHeaders,
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return new Response('Internal Server Error', { status: 500 });
  }
};
