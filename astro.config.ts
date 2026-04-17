import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import compress from 'astro-compress';
import site from './src/data/site.json';

export default defineConfig({
  site: site.siteUrl,
  integrations: [
    sitemap({
      filter: (page) => !/\/(watch|projects)\/\d+\/?$/.test(page),
    }),
    mdx(),
    compress({
      Logger: 2,
      Action: {
        Accomplished: async ({
          Input,
          Before,
          After,
        }: {
          Input: string;
          Before: number;
          After: number;
        }) => {
          const path = Input.split('/dist').pop() ?? Input;
          const saved = Before - After;
          const pct = Before > 0 ? Math.round((saved / Before) * 100) : 0;
          return `  ${path}: ${Before}B → ${After}B (-${pct}%)`;
        },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
