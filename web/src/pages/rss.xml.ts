import type { Recipe } from '../lib/types';
export const prerender = true;

import type { APIRoute } from 'astro';
import { client } from '../lib/sanity';
import { ALL_RECIPES_QUERY } from '../lib/queries';

export const GET: APIRoute = async ({ site }) => {
  try {
    const recipes = await client.fetch(ALL_RECIPES_QUERY);

    const rssItems = recipes.map((recipe: Recipe) => {
      const url = new URL(`recipe/${recipe.slug}`, site).toString();
      const pubDate = new Date(recipe.publishedAt || Date.now()).toUTCString();
      return `
    <item>
      <title><![CDATA[${recipe.title}]]></title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${recipe.excerpt || ''}]]></description>
    </item>`;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Visual Recipes Feed</title>
  <link>${site}</link>
  <description>Latest premium visual recipes and interest cluster discovery paths.</description>
  <language>en-us</language>
  <atom:link href="${new URL('rss.xml', site).toString()}" rel="self" type="application/rss+xml" />
  ${rssItems.join('')}
</channel>
</rss>`;

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400'
      }
    });
  } catch (error) {
    return new Response('<error>Failed to build RSS feed</error>', {
      status: 500,
      headers: { 'Content-Type': 'application/xml' }
    });
  }
};
