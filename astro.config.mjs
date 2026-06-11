import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  site: 'https://js.gripe',
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/404.html')
    })
  ]
});
