import { defineConfig } from 'astro/config';
// astro integrations
import react from '@astrojs/react';
// vite plugins
import svgr from 'vite-plugin-svgr';

// https://astro.build/config
export default defineConfig({
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
