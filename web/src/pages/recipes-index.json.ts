import type { APIRoute } from 'astro';
import { client } from '../lib/sanity';
import { ALL_RECIPES_QUERY } from '../lib/queries';
import { urlFor } from '../lib/urlFor';

export const GET: APIRoute = async () => {
  try {
    const recipes = await client.fetch(ALL_RECIPES_QUERY);
    
    // Transform or select exactly what the search client needs to minimize bundle size
    const searchData = recipes.map((recipe: any) => ({
      id: recipe._id,
      title: recipe.title,
      slug: recipe.slug,
      excerpt: recipe.excerpt,
      badges: recipe.badges || [],
      intentTags: recipe.intentTags || [],
      season: recipe.season,
      parentCluster: recipe.parentCluster ? recipe.parentCluster.title : '',
      parentClusterSlug: recipe.parentCluster ? recipe.parentCluster.slug : '',
      imageUrl: urlFor(recipe.mainImage).width(400).height(600).auto('format').url(),
      cardAspectRatio: recipe.cardAspectRatio || 'tall',
      publicationType: recipe.publicationType || 'single'
    }));

    return new Response(JSON.stringify(searchData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Enable CDN caching on Cloudflare
        'Cache-Control': 'public, max-age=3600, s-maxage=86400'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to generate index' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
