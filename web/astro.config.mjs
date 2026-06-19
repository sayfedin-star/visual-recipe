import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://visualrecipes.com',
  output: 'hybrid',
  adapter: cloudflare(),
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
