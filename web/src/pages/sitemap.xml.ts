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

    const today = new Date().toISOString().split('T')[0];

    const recipeEntries = recipes.map((r: any) => ({
      url: new URL(`recipe/${r.slug}`, site).toString(),
      lastmod: r.publishedAt ? new Date(r.publishedAt).toISOString().split('T')[0] : today,
      priority: '0.6',
      changefreq: 'weekly'
    }));

    const clusterEntries = clusters.map((c: any) => ({
      url: new URL(`hub/${c.slug}`, site).toString(),
      lastmod: today,
      priority: '0.8',
      changefreq: 'daily'
    }));

    const staticEntries = [
      { url: new URL('', site).toString(), lastmod: today, priority: '1.0', changefreq: 'daily' },
      { url: new URL('search', site).toString(), lastmod: today, priority: '0.5', changefreq: 'weekly' },
    ];

    const allEntries = [...staticEntries, ...clusterEntries, ...recipeEntries];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allEntries
    .map(
      (entry) => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
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
