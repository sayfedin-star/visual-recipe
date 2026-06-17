import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://visualrecipes.com',
  output: 'hybrid',
  adapter: cloudflare({
    imageService: 'passthrough'
  }),
  build: {
    inlineStylesheets: 'always'
  }
});
