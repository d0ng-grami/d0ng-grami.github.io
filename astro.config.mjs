// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// Local-only admin panel (/admin + /api/*, filesystem writes). Its routes are
// registered only under `astro dev`, so the deployed static site never
// includes them.
const localAdmin = {
  name: 'local-admin',
  hooks: {
    'astro:config:setup': ({ command, injectRoute, updateConfig }) => {
      if (command !== 'dev') return;
      updateConfig({ output: 'server' });
      injectRoute({ pattern: '/admin', entrypoint: './src/admin/admin.astro' });
      injectRoute({ pattern: '/api/cities', entrypoint: './src/admin/api/cities.js' });
      injectRoute({ pattern: '/api/geocode', entrypoint: './src/admin/api/geocode.js' });
      injectRoute({ pattern: '/api/photos', entrypoint: './src/admin/api/photos.js' });
    },
  },
};

// https://astro.build/config
export default defineConfig({
  site: 'https://d0ng-grami.github.io',
  output: 'static',
  integrations: [mdx(), sitemap(), localAdmin],

  fonts: [
      {
          provider: fontProviders.local(),
          name: 'Atkinson',
          cssVariable: '--font-atkinson',
          fallbacks: ['sans-serif'],
          options: {
              variants: [
                  {
                      src: ['./src/assets/fonts/atkinson-regular.woff'],
                      weight: 400,
                      style: 'normal',
                      display: 'swap',
                  },
                  {
                      src: ['./src/assets/fonts/atkinson-bold.woff'],
                      weight: 700,
                      style: 'normal',
                      display: 'swap',
                  },
              ],
          },
      },
	],

  vite: {
    plugins: [tailwindcss()],
  },
});