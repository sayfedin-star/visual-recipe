import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://nremi.com',
  output: 'static',
  image: {
    domains: ['cdn.sanity.io'],
  },
  build: {
    inlineStylesheets: 'always'
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('astro') && id.includes('type=script')) {
              return 'hoisted';
            }
          }
        }
      }
    }
  }
});
