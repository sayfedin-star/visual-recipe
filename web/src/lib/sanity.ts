import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'k8dfrtog',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  useCdn: false, // Disabled to ensure fresh compilation and live development data
  apiVersion: '2026-06-16',
});
