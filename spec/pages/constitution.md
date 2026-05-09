# constitution.md

> Non-negotiable principles for this project. Every technical and design decision defers to this document. It supersedes momentary preferences.

---

## 1. Identity and intent

This site is the online identity of a craft developer. It serves two distinct purposes:

- **Portfolio** — demonstrate a way of working, not just a list of things built
- **Watch** — share commented links on dev and AI, without friction

The site must reflect the same values as the code it presents: clarity, restraint, care.

---

## 2. Scope

Seven sections, no more:

- `/` — home / hero, includes contact information and links
- `/about` — short bio
- `/experiences` — professional experience and skills
- `/watch` — link feed with optional comments
- `/projects` — technical portfolio
- `/now` — current focus and activities, in the spirit of [nownownow.com](https://nownownow.com)
- `/legal` — legal notice

`/about`, `/now`, and `/legal` are plain Markdown pages — no custom data model, no collection.

Contact is handled on the home page. No dedicated contact section. Any new section must be justified against these seven. Scope does not grow by default.

---

## 3. Design

### Minimalism as constraint, not aesthetic

Every element must earn its place. If removing it does not break meaning, remove it.

### Styling

DaisyUI on top of Tailwind CSS. The active theme is **Flexoki**, in monochromatic mode — the accent palette is used sparingly, if at all. Colour conveys structure, not decoration.

Two theme variants are defined — `flexoki-light` and `flexoki-dark` — and the active variant is selected automatically via `prefers-color-scheme`. No JavaScript is involved: the switch is pure CSS, handled by DaisyUI's `default`/`prefersdark` theme mechanism. No `data-theme` attribute is set on `<html>`.

Use DaisyUI semantic tokens (`base-100`, `primary`, `neutral`, etc.) rather than raw Tailwind color utilities wherever possible — this keeps theming consistent and changes contained.

#### Flexoki color palette

Theme colors are defined in `src/styles/global.css` using the **official Flexoki hex values** directly (source: [stephango.com/flexoki](https://stephango.com/flexoki)). No conversion to OKLCH — hex is used as-is.

The Flexoki base scale:

| Name       | Hex       |
|------------|-----------|
| `paper`    | `#FFFCF0` |
| `base-50`  | `#F2F0E5` |
| `base-100` | `#E6E4D9` |
| `base-150` | `#DAD8CE` |
| `base-200` | `#CECDC3` |
| `base-300` | `#B7B5AC` |
| `base-400` | `#9F9D96` |
| `base-500` | `#878580` |
| `base-600` | `#6F6E69` |
| `base-700` | `#575653` |
| `base-800` | `#403E3C` |
| `base-850` | `#343331` |
| `base-900` | `#282726` |
| `base-950` | `#1C1B1A` |
| `black`    | `#100F0F` |

#### DaisyUI token mapping

| DaisyUI token       | Light (`flexoki-light`) | Dark (`flexoki-dark`) |
|---------------------|-------------------------|-----------------------|
| `base-100`          | `#FFFCF0` (paper)       | `#100F0F` (black)     |
| `base-200`          | `#F2F0E5` (base-50)     | `#1C1B1A` (base-950)  |
| `base-300`          | `#E6E4D9` (base-100)    | `#282726` (base-900)  |
| `base-content`      | `#100F0F` (black)       | `#CECDC3` (base-200)  |
| `primary`           | `#100F0F` (black)       | `#CECDC3` (base-200)  |
| `primary-content`   | `#FFFCF0` (paper)       | `#100F0F` (black)     |
| `secondary`         | `#CECDC3` (base-200)    | `#403E3C` (base-800)  |
| `secondary-content` | `#100F0F` (black)       | `#CECDC3` (base-200)  |
| `accent`            | `#D14D41` (red-400)     | `#AF3029` (red-600)   |
| `accent-content`    | `#FFFCF0` (paper)       | `#FFFCF0` (paper)     |
| `neutral`           | `#1C1B1A` (base-950)    | `#403E3C` (base-800)  |
| `neutral-content`   | `#FFFCF0` (paper)       | `#FFFCF0` (paper)     |
| `info`              | `#4385BE` (blue-400)    | `#4385BE` (blue-400)  |
| `success`           | `#879A39` (green-400)   | `#879A39` (green-400) |
| `warning`           | `#D0A215` (yellow-400)  | `#D0A215` (yellow-400)|
| `error`             | `#D14D41` (red-400)     | `#D14D41` (red-400)   |

`neutral` is dark in both modes — it is used for the hero CTA button (`btn-neutral`) and the demo banner (`bg-neutral`), both of which need strong contrast against their backgrounds.

Custom CSS is plain CSS. No SCSS, no preprocessor. The preferred location is a component-scoped `<style>` block. When styling MDX-rendered markup (which Astro's scoping cannot reach), a dedicated CSS file in `src/styles/` is acceptable, provided all selectors are prefixed with a wrapper class that acts as a manual scope.

The base font size is `18px`, set on `:root` in `src/styles/global.css`. All rem-based sizing scales from this value.

### Typography scale

Markdown pages use `MarkdownLayout.astro`, which wraps content in the `prose` class (`@tailwindcss/typography`). This is the typographic reference — do not modify it.

`.astro` pages must match the prose heading scale manually:

| Element | Classes |
|---|---|
| Page h1 | `text-4xl font-bold` |
| Section h2 | `text-2xl font-bold` |

Card and component headings (item titles, preview headings) are not document headings and are exempt from this scale.

**Exception — Hero:** the `Hero` component renders the author name as `h1` with `text-3xl font-semibold`. This is intentional: the hero is an identity display, not a document section title, so it is exempt from the page h1 scale.

### No decorative complexity

No gradients, no animations unless they carry meaning, no shadows unless they encode depth. Typography and whitespace do the work.

---

## 4. Technical constraints

### Framework

Astro — static site generation only. No server-side rendering, no edge functions.

### Integrations

- `@astrojs/sitemap` — sitemap generation, required for Playwright link validation in CI. Configured with a `filter` that excludes pagination routes (`/watch/N`, `/projects/N`)
- `@astrojs/mdx` — MDX support for richer content authoring
- `astro-compress` — HTML/CSS/SVG minification at build time
- `@tailwindcss/vite` — Tailwind CSS v4 via Vite plugin

The `site` option in `astro.config.ts` is set from `site.siteUrl` in `src/data/site.json`.

### JavaScript

The site must be fully functional with JavaScript disabled. JS is permitted only when it provides a genuine enhancement (e.g. theme toggle) and only under these conditions:

- The feature is invisible when JS is disabled — not broken, not degraded, invisible
- The enhancement is impossible to achieve with CSS alone
- It ships with no runtime framework (no React, no Vue islands)
- It is written in **TypeScript** — no plain `.js` files. Type checking acts as a lightweight verification layer on client-side code.

### Dependencies

Every dependency must be justified. Before adding a package, the question is: does the value outweigh the cost in maintenance, bundle size, and conceptual overhead? Prefer Astro built-ins and web platform APIs.

Current allowed dependencies:

| Package | Type | Justification |
|---|---|---|
| `astro` | prod | framework |
| `tailwindcss` + `@tailwindcss/vite` | prod | styling |
| `daisyui` | prod | component layer on Tailwind |
| `@tailwindcss/typography` | prod | `prose` class for Markdown page layouts |
| `@astrojs/mdx` | prod | MDX support for content collections |
| `@astrojs/sitemap` | prod | sitemap generation |
| `@astrojs/rss` | prod | RSS feed for `/watch/rss.xml` |
| `zod` | prod | schema validation for content collections |
| `@biomejs/biome` | dev | linting and formatting |
| `@astrojs/check` + `typescript` | dev | `astro check` type checking |
| `playwright` + `@axe-core/playwright` | dev | end-to-end and accessibility tests |
| `astro-compress` | prod | HTML/CSS/SVG minification at build time |

---

---

## 5. Code architecture

### Separation of concerns

Pages own their data-fetching and transformation logic. Components are purely presentational: they receive typed props, they render markup.

```
src/
├── components/             # .astro templates only — typed props, no logic
│   ├── watch/              # watch feature: WatchCard, WatchPreview, WatchPreviewCard + their .ts types
│   ├── project/            # project feature: ProjectCard, ProjectPreviewCard, ProjectsPreview + their .ts types
│   ├── experience/         # experience feature: ExperienceCard, SkillsTable + their .ts types
│   └── types/              # TypeScript types for shared/root-level components (Hero, Pagination, SocialLinks)
├── content/      # Astro content collections
├── data/         # static data files
│   ├── site.json       # global configuration (see below)
│   ├── home.json       # social links for the home page
│   ├── hero.md         # author identity and pitch
│   ├── footer.mdx      # footer content (MDX)
│   └── skills.json     # skills table data for /experiences
├── i18n/         # UI labels and static strings
│   ├── index.ts  # re-exports the active language — the only file to change when switching language
│   └── en.ts     # English labels
├── layouts/
├── pages/        # data fetching and transformation live here
└── styles/       # global CSS: theme tokens, base font size, footer.css scope
```

All static UI labels (navigation, section titles, buttons, fallback text) are defined in `src/i18n/en.ts` and imported everywhere via `src/i18n/index.ts`. No hardcoded strings in components or pages.

Import convention throughout the project:

```ts
import { ui } from '@/i18n'
```

### `src/data/site.json`

`site.json` is the single source of truth for global configuration. It is imported by `src/config.ts` (which re-exports each value as a named constant) and directly by `astro.config.ts` for the `site` URL.

| Key                    | Exported as                | Description                                        |
|------------------------|----------------------------|----------------------------------------------------|
| `isDemo`               | `IS_DEMO`                  | When `true`, renders `DemoBanner` in `BaseLayout`  |
| `siteUrl`              | `siteUrl`                  | Canonical base URL (e.g. `https://example.com`)    |
| `siteName`             | `siteName`                 | Site / author name displayed in nav and `<title>`  |
| `defaultTitle`         | `defaultTitle`             | Fallback `<title>` if no page-level title          |
| `defaultDescription`   | `defaultDescription`       | Fallback meta description                          |
| `defaultOgImage`       | `defaultOgImage`           | Path to OG image (e.g. `/og-default.png`)          |
| `veillePreviewCount`   | `VEILLE_PREVIEW_COUNT`     | Number of watch entries shown on home page         |
| `veillePageSize`       | `VEILLE_PAGE_SIZE`         | Entries per page on `/watch`                       |
| `projectsPreviewCount` | `PROJECTS_PREVIEW_COUNT`   | Number of projects shown on home page              |
| `projectsPageSize`     | `PROJECTS_PAGE_SIZE`       | Projects per page on `/projects`                   |

### Component rules

- No data fetching inside components
- No conditional logic beyond simple prop-driven rendering
- All props are explicitly typed via interfaces co-located with the component (same directory, `.ts` extension)
- Shared/root-level component types live in `components/types/`
- `Card` is the shared visual unit for all list-based content (experiences, projects, watch entries). It wraps the DaisyUI `card` component and is the only place where card styling is defined. It lives at the root of `components/` and is imported via `@/components/Card.astro`.

### Component grouping

Feature-specific components are grouped in subdirectories:

| Directory | Components | Used by |
|---|---|---|
| `components/watch/` | `WatchCard`, `WatchPreview`, `WatchPreviewCard` | `/watch`, `/` |
| `components/project/` | `ProjectCard`, `ProjectPreviewCard`, `ProjectsPreview` | `/projects`, `/` |
| `components/experience/` | `ExperienceCard`, `SkillsTable` | `/experiences` |
| `components/` (root) | `Card`, `DemoBanner`, `Footer`, `Hero`, `Pagination`, `SocialLinks` | multiple pages |

New feature-specific components must go into the corresponding subdirectory. Truly shared components (used by two or more features) stay at the root level.

### Demo banner

`DemoBanner` is rendered in `BaseLayout` when `isDemo: true` in `src/data/site.json` (exported as `IS_DEMO` from `src/config.ts`). Set it to `false`, or remove the component from `BaseLayout`, to hide the banner on a real deployment.

### Base layout — header and navigation

`BaseLayout.astro` renders the page shell: `<html>`, `<head>`, `<header>`, `<main>`, and `<footer>`. The `<header>` is delegated to `Nav.astro`.

`Nav.astro` contains:
- A link to `/` displaying `siteName` in monospace — the site identity anchor
- On desktop (`sm:` and above): a `<nav aria-label="Main navigation">` with links rendered inline via `NavItem.astro`
- On mobile (below `sm:`): a CSS-only hamburger (`<details>`/`<summary>`, DaisyUI `dropdown`) with links rendered via `NavMenuItem.astro`

Both variants expose the same five links in order:
  1. `/about`
  2. `/experiences`
  3. `/projects`
  4. `/watch`
  5. `/now`

The active link receives `aria-current="page"` based on `Astro.url.pathname`, resolved inside each leaf component (`NavItem`, `NavMenuItem`). The desktop nav is hidden on mobile (`hidden sm:block`) and the hamburger is hidden on desktop (`sm:hidden`) — both via `display: none`, which removes them from the accessibility tree.

Props accepted by `BaseLayout`:

| Prop | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | yes | Page title (used in `<title>` and OG tags) |
| `description` | `string` | yes | Page description |
| `canonicalPath` | `string` | no | Overrides the canonical path (default: `Astro.url.pathname`) |
| `appendSiteName` | `boolean` | no | When `true` (default), appends `— {siteName}` to `<title>` |

### Base layout — footer

`Footer.astro` renders `<footer>` below `<main>`. Its content is sourced from `src/data/footer.mdx` — a short MDX file holding legal notice link and license information.

Because Astro's scoped styles cannot reach into imported MDX components, footer-specific styles live in `src/styles/footer.css`. All selectors are prefixed with `.footer-content` (the wrapper class applied in `Footer.astro`).

---

## 6. What this project is not

- A blog platform — long-form writing is out of scope
- A dashboard — no dynamic data, no auth, no user state
- A design showcase — the design serves the content, not the reverse
