import { defineCollection, getCollection, z } from "astro:content";

import { glob } from "astro/loaders";

export type CollectionName =
  | "pages"
  | "blog";

const header = defineCollection({
  loader: glob({ pattern: "header.md", base: "./src/content/components/" }),
  schema: z.object({
    author: z.string(),
  }),
});

const footer = defineCollection({
  loader: glob({ pattern: "footer.md", base: "./src/content/components/" }),
});

const pages = defineCollection({
  loader: glob({
    pattern: ["*.md", "!index.md"],
    base: "./src/content/pages/",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    type: z.enum(["website", "article"]).optional(),
  }),
});

const index = defineCollection({
  loader: glob({ pattern: ["index.md"], base: "./src/content/pages/" }),
  schema: z.object({
    title: z.string(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    created: z.date(),
    lastUpdate: z.optional(z.date()),
  }),
});

export const collections = {
  index,
  header,
  footer,
  pages,
  blog,
};

export const isCollectionEmpty = async (
  name: CollectionName,
): Promise<boolean> => (await getCollection(name)).length === 0;
