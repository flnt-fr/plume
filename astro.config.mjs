// @ts-check
import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";
import rehypeExternalLinks from "rehype-external-links";

// https://astro.build/config
export default defineConfig({
  vite: {
    test: {
      environment: "happy-dom",
    },
  },
  site: process.env.SITE_URL || "http://localhost:4321",
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
