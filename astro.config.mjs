// @ts-check
import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";
import rehypeExternalLinks from "rehype-external-links";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [],
    test: {
      environment: "happy-dom",
    },
  },
  site: "http://localhost:4321",
  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          rel: ["noreferrer", "external"],
          target: "_blank",
        },
      ],
    ],
  },
  integrations: [sitemap()],
});
