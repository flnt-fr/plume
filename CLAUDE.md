# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm install       # Install dependencies
npm run dev       # Start dev server at localhost:4321
npm run build     # Build production site to ./dist/
npm run preview   # Preview production build locally
npm run astro ... # Run Astro CLI commands (e.g. astro add, astro check)
npm run lint      # Biome lint
npm run format    # Biome format
npm run check     # Biome lint + format (canonical — used in CI)
npm run lighthouse # Build + preview + unlighthouse UI
```

## Architecture

This is an [Astro](https://astro.build) site (v6) — static generation only, no SSR, no edge functions. Node >=22.12.0 is required.

- `src/pages/` — file-based routing; `.astro` and `.md` files become pages
- `src/components/` — purely presentational `.astro` components, typed props, no data fetching
  - `src/components/watch/` — watch feature components (`WatchCard`, `WatchPreview`, `WatchPreviewCard`) + their TypeScript type files
  - `src/components/project/` — project feature components (`ProjectCard`, `ProjectPreviewCard`, `ProjectsPreview`) + their TypeScript type files
  - `src/components/experience/` — experience feature components (`ExperienceCard`, `SkillsTable`) + their TypeScript type files
  - `src/components/types/` — TypeScript interfaces for shared/root-level components (`Hero`, `Pagination`, `SocialLinks`)
- `src/content/` — Astro content collections (watch entries, experience entries, project entries)
- `src/layouts/` — base layout with SEO meta tags
- `src/data/` — static data files (`home.json`, `skills.json`, `hero.md`, `footer.mdx`)
- `src/config.ts` — global constants (`siteUrl`, `siteName`, SEO defaults, `VEILLE_PREVIEW_COUNT`)
- `src/styles/` — global CSS: theme tokens, base font size, and component-specific files scoped by class name
- `public/` — static assets served at the root
- `tests/` — Playwright tests (run against production build, never dev server)
- `spec/` — project specifications (source of truth for all design and technical decisions)

TypeScript is configured in strict mode via `astro/tsconfigs/strict` with `strictNullChecks` and `noUncheckedIndexedAccess`.

## Specs

All specifications live in `spec/`. Read the relevant spec before implementing any feature.

- `spec/pages/constitution.md` — **non-negotiable principles**, supersedes everything
- `spec/pages/home.md` — home page (`/`)
- `spec/pages/watch.md` — watch feed (`/watch`)
- `spec/pages/experience.md` — experience and skills (`/experiences`)
- `spec/pages/projects.md` — projects (`/projects`)
- `spec/tooling.md` — Biome, TypeScript, EditorConfig
- `spec/seo.md` — meta tags, Open Graph, sitemap, robots
- `spec/accessibility.md` — WCAG 2.1 AA, external link icon, axe-core tests
- `spec/testing.md` — Playwright test strategy (links, structure, RSS, a11y)
- `spec/cicd.md` — GitHub Actions workflows, Dependabot, Coolify deployment

## Key design rules (from constitution.md)

- Styling: **DaisyUI + Tailwind CSS**, theme **Flexoki** in monochromatic mode — two variants (`flexoki-light` default, `flexoki-dark` via `prefers-color-scheme`). Use DaisyUI semantic tokens, not raw Tailwind color utilities.
- No decorative complexity: no gradients, no animations unless meaningful, no shadows unless encoding depth.
- Custom CSS: plain CSS, no SCSS. Prefer component-scoped `<style>` blocks. When styling MDX-rendered content (outside Astro's scoping reach), use a dedicated file in `src/styles/` with all selectors prefixed by a wrapper class.
- JavaScript: only when the feature is invisible without JS, not broken. No runtime framework. TypeScript only (no `.js` files).
- Components: no data fetching, no business logic — props in, markup out.
- Pages own all data fetching and transformation logic.

## Pages in scope

| Route | Type | Notes |
|---|---|---|
| `/` | static | hero, social links, projects preview, watch preview |
| `/about` | Markdown | plain page, no collection |
| `/experiences` | collection | MDX entries + `skills.json` |
| `/projects` | collection | MDX entries, preview on home |
| `/watch` | collection | paginated feed, RSS at `/watch/rss.xml` |
| `/now` | Markdown | plain page, no collection |
| `/legal` | Markdown | plain page, no collection |

## Testing

Tests run against the **production build** via `astro preview` — never against `astro dev`.

```sh
npx playwright test
```

Playwright `webServer` config handles starting the preview server automatically.

Test files:
- `tests/links.spec.ts` — internal link validation
- `tests/structure.spec.ts` — semantic HTML structure per page
- `tests/rss.spec.ts` — RSS feed validity
- `tests/a11y.spec.ts` — WCAG 2.1 AA via axe-core
