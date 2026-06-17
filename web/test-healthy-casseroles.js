import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'k8dfrtog',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2026-06-16',
});

const QUERY = `
  *[_type == "recipe" && slug.current == $slug][0] {
    _id,
    title,
    parentCluster->{ _id, title, "slug": slug.current },
    relatedRecipesManual[]->{
      _id,
      title,
      parentCluster->{ title }
    }
  }
`;

async function test() {
  try {
    const res = await client.fetch(QUERY, { slug: 'healthy-casserole-recipes' });
    console.log('RECIPE:', JSON.stringify(res, null, 2));
  } catch (err) {
    console.error('ERROR:', err);
  }
}

test();
