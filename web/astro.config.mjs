import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://nremi.com',
  output: 'static',
  build: {
    inlineStylesheets: 'always'
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'viewport'
  }
});
