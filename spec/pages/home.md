# spec: /

> Scope: structure, content model, and rendering rules for the home page.

---

## 1. Purpose

The home page establishes identity at a glance and provides immediate access to contact and social links. It also surfaces the most recent veille entries to signal active curation.

All content on this page is written in French.

---

## 2. Content model

The home page has no content collection. Content is split across two static source files.

### `src/data/hero.md`

Markdown file. The frontmatter holds identity fields; the body holds the description, authored as plain prose.

| Field   | Type     | Required | Description                                        |
|---------|----------|----------|----------------------------------------------------|
| `name`  | `string` | yes      | Full name                                          |
| `title` | `string` | yes      | Professional title (e.g. `Développeur craft & IA`) |
| `email` | `string` | yes      | Contact email address                              |

The Markdown body is required. It is the short pitch displayed in the hero — a few sentences. It is rendered as HTML via the Astro `Content` component passed as a slot to `Hero`.

### `src/data/home.json`

| Field    | Type                                | Required | Description                                                                                                                                                   |
|----------|-------------------------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `social` | `{ label: string; href: string }[]` | yes      | Ordered list of social and contact links. Order is significant. External links use absolute URLs (`https://…`); internal links use root-relative paths (`/…`). |

---

## 3. Page structure

The page renders three sections in order:

1. **Hero** — identity and contact
2. **Liens** — social and contact links
3. **Veille** — preview of the most recent entries

---

## 4. Hero rendering

The hero is rendered by the `Hero` component (`src/components/Hero.astro`). The page fetches `src/data/hero.md`, passes `name`, `title`, and `email` as typed props, and passes the rendered Markdown body as a slot.

The hero renders:

- **Name** — primary heading, from `hero.md` frontmatter
- **Title** — professional title, visually secondary to the name, from `hero.md` frontmatter
- **Description** — rendered from the `hero.md` body via the `Content` slot
- **CTA** — a mailto link to `email`, labelled `Me contacter`

No image, no background, no decorative elements.

---

## 5. Social links rendering

A flat list of icon-free links. Each link opens in a new tab with `rel="noopener noreferrer"`.

Links rendered in the order defined in `social` from `home.json`. Each link uses its `label` as visible text. Whether a link opens in a new tab is derived from its `href`: absolute URLs (`https://…`) are external and open with `target="_blank" rel="noopener noreferrer"`; root-relative paths (`/…`) are internal and open in the same tab.

No icons unless they can be rendered in pure CSS or inline SVG without an icon library dependency.

---

## 6. Veille preview rendering

Displays the **`VEILLE_PREVIEW_COUNT`** most recent veille entries, sorted by `date` descending. Fetched at build time from the veille content collection. `VEILLE_PREVIEW_COUNT` is defined in `src/config.ts` and adjusted based on visual fit.

Each entry renders:

- **Title** — links to the external `url`, opens in a new tab, `rel="noopener noreferrer"`
- **Source** — `source.name` as a link to `source.url`
- **Date** — formatted as `DD MMM YYYY`

Tags and comments are not shown in the preview. The section includes a link to `/veille` to access the full feed.

---

## 7. Out of scope

- Contact form — a mailto link is sufficient
- Featured or pinned veille entries
- Animation or scroll-triggered effects