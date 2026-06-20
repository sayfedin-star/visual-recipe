export const prerender = true;

import type { APIRoute } from 'astro';
import { client } from '../lib/sanity';
import { ALL_RECIPES_QUERY, ALL_CLUSTERS_QUERY } from '../lib/queries';

export const GET: APIRoute = async ({ site }) => {
  try {
    const [recipes, clusters] = await Promise.all([
      client.fetch(ALL_RECIPES_QUERY),
      client.fetch(ALL_CLUSTERS_QUERY)
    ]);

    const recipeUrls = recipes.map((r: any) => new URL(`recipe/${r.slug}`, site).toString());
    const clusterUrls = clusters.map((c: any) => new URL(`hub/${c.slug}`, site).toString());
    const homeUrl = new URL('', site).toString();
    const searchUrl = new URL('search', site).toString();

    const allUrls = [homeUrl, searchUrl, ...clusterUrls, ...recipeUrls];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls
    .map(
      (url) => `
  <url>
    <loc>${url}</loc>
    <changefreq>daily</changefreq>
    <priority>${url === homeUrl ? '1.0' : url.includes('/hub/') ? '0.8' : '0.6'}</priority>
  </url>`
    )
    .join('')}
</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400'
      }
    });
  } catch (error) {
    return new Response('<error>Failed to build sitemap</error>', {
      status: 500,
      headers: { 'Content-Type': 'application/xml' }
    });
  }
};
