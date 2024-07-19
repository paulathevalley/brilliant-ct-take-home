import { defineConfig } from 'astro/config';
// astro integrations
import react from '@astrojs/react';
// vite plugins
import svgr from 'vite-plugin-svgr';

const isProd = process.env.NODE_ENV === 'production' ? true : false;

// https://astro.build/config
export default defineConfig({
  base: isProd ? '/ct-take-home' : '',
  integrations: [react()],
  vite: {
    ssr: { noExternal: ['mafs'] },
    plugins: [
      svgr({
        svgrOptions: {
          // https://react-svgr.com/docs/options/#ref
          ref: true,
        },
      }),
    ],
  },
});
