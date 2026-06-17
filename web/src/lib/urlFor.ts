import imageUrlBuilder from '@sanity/image-url';
import { client } from './sanity';

const builder = imageUrlBuilder(client);

// Mock builder to prevent crashing on missing or incomplete assets
const mockBuilder = {
  width: () => mockBuilder,
  height: () => mockBuilder,
  auto: () => mockBuilder,
  url: () => '/favicon.svg',
} as any;

export function urlFor(source: any) {
  if (!source || (typeof source === 'object' && !source.asset)) {
    return mockBuilder;
  }
  try {
    return builder.image(source);
  } catch (e) {
    return mockBuilder;
  }
}
