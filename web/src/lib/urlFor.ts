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

export function getImageSrcSet(src: any, width?: number, height?: number) {
  if (!src) {
    return { src: '', srcset: '' };
  }
  
  // Primary optimized URL
  let imageUrl = urlFor(src).auto('format').quality(70);
  if (width) {
    imageUrl = imageUrl.width(width);
  }
  if (height) {
    imageUrl = imageUrl.height(height);
  }
  const mainUrl = imageUrl.url().replace('https://cdn.sanity.io/images/', '/images/');

  // Responsive srcset
  const widths = [150, 300, 350, 400, 450, 500, 600, 750, 900, 1050, 1200];
  const srcset = widths
    .map((w) => {
      let urlBuilder = urlFor(src).auto('format').quality(70).width(w);
      if (height && width) {
        const calculatedHeight = Math.round((w / width) * height);
        urlBuilder = urlBuilder.height(calculatedHeight);
      }
      const url = urlBuilder.url().replace('https://cdn.sanity.io/images/', '/images/');
      return `${url} ${w}w`;
    })
    .join(', ');

  return {
    src: mainUrl,
    srcset
  };
}
