import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

export const collections = {
  experiences: defineCollection({
    loader: glob({ pattern: '**/*.mdx', base: './src/content/experiences' }),
    schema: z.object({
      role: z.string(),
      company: z.string(),
      startDate: z.string(),
      endDate: z.string().optional(),
      tags: z.array(z.string()).optional(),
    }),
  }),
  projects: defineCollection({
    loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
    schema: z.object({
      title: z.string(),
      date: z.string(),
      stack: z.array(z.string()),
      links: z.array(z.object({ label: z.string(), url: z.url() })).optional(),
    }),
  }),
  watch: defineCollection({
    loader: glob({ pattern: '**/*.mdx', base: './src/content/watch' }),
    schema: z.object({
      title: z.string(),
      url: z.url(),
      date: z.coerce.date(),
      tags: z.array(z.string()).default([]),
      source: z.object({
        name: z.string(),
        url: z.url(),
      }),
    }),
  }),
};
