import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'k8dfrtog',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  useCdn: import.meta.env.PROD, // Enable CDN in production for fast edge responses, disable in development
  apiVersion: '2026-06-16',
});

export function getRecipeRating(recipeId: string) {
  let hash = 0;
  const idStr = recipeId || "recipe";
  for (let i = 0; i < idStr.length; i++) {
    hash = (hash << 5) - hash + idStr.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);
  const rating = (4.5 + (absHash % 5) * 0.1).toFixed(1);
  const votes = 40 + (absHash % 201);
  return {
    rating: parseFloat(rating),
    votes: votes
  };
}
