import imageUrlBuilder from '@sanity/image-url';
import { client } from './sanity';

const builder = imageUrlBuilder(client);

// Mock builder to prevent crashing on missing or incomplete assets
const mockBuilder = {
  width: () => mockBuilder,
  height: () => mockBuilder,
  auto: () => mockBuilder,
  format: () => mockBuilder,
  url: () => '/favicon.svg',
} as any;

export function urlFor(source: any) {
  if (!source || (typeof source === 'object' && !source.asset)) {
    return mockBuilder;
  }
  try {
    // Returns the builder instance. Callers can customize (e.g., for OG images),
    // but default uses the raw CDN url to avoid double-transformation when passed to Astro's <Image>.
    return builder.image(source);
  } catch (e) {
    return mockBuilder;
  }
}

