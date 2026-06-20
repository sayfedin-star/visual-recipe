export const prerender = true;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ site }) => {
  const sitemapUrl = new URL('sitemap.xml', site).toString();
  
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`;

  return new Response(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400'
    }
  });
};
