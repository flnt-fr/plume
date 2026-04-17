# spec: /projects

> Scope: content model, page structure, and rendering rules for the projects page.

---

## 1. Purpose

`/projects` lists personal projects. It serves as a demonstration of technical work and approach. A preview of the most recent projects is also surfaced on the home page.

---

## 2. Content model

Projects are MDX files in an Astro content collection. The MDX body is the primary authoring surface for the project description. It may include rich content (lists, highlights, etc.).

The frontmatter schema defines a baseline set of fields. Additional fields may be added as the content evolves — the schema is not considered closed.

### Baseline frontmatter

| Field       | Type       | Required | Description                                      |
|-------------|------------|----------|--------------------------------------------------|
| `title`     | `string`   | yes      | Project name                                     |
| `date`      | `string`   | yes      | Creation date, `YYYY-MM` format                  |
| `stack`     | `string[]` | yes      | Technologies used                                |
| `links`     | `Link[]`   | no       | External links — see Link type below             |

### Link type

| Field   | Type                                        | Required | Description          |
|---------|---------------------------------------------|----------|----------------------|
| `label` | `'GitHub' \| 'Live' \| 'Article' \| string` | yes      | Display label        |
| `url`   | `string`                                    | yes      | URL of the link      |

The `label` field accepts a predefined set of values (`GitHub`, `Live`, `Article`) or any custom string for other link types.

### Body

The MDX body is required — it is the project description. No length constraint, but the spirit of the format is concise.

---

## 3. Page structure

`/projects` renders a paginated list of all projects, sorted by `date` descending.

### Pagination

Entries are paginated statically. Each page displays **`PROJECTS_PAGE_SIZE`** entries (defined in `src/config.ts`).

- Page 1: `/projects`
- Page N: `/projects/${n}` (N ≥ 2)

If the total number of projects is ≤ `PROJECTS_PAGE_SIZE`, no pagination UI is rendered.

---

## 4. Project rendering

Each project is rendered using the shared `Card` component (DaisyUI `card`, `card-bordered` variant, no shadow). The card contains:

- **Title** — project name
- **Date** — formatted as `MMM YYYY` (e.g. `Jan 2025`)
- **Stack** — flat list of technology labels, not interactive
- **Body** — MDX content rendered below the metadata
- **Links** — rendered as a flat list of external links, each displaying its `label`. Each link opens in a new tab with `rel="noopener noreferrer"` and the external link icon (see accessibility spec)

---

## 5. Home page preview

The `PROJECTS_PREVIEW_COUNT` most recent projects (sorted by `date` descending) are surfaced on the home page. `PROJECTS_PREVIEW_COUNT` is defined in `src/config.ts` and adjusted based on visual fit.

The preview renders for each project:

- **Title** — plain text, not a link
- **Date** — formatted as `MMM YYYY`
- **Stack** — flat list of labels
- **Description** — body rendered as plain text (no MDX processing)
- **Links** — same as the full card: flat list of external links with `rel="noopener noreferrer"`

The section includes a link to `/projects` to access the full list.

---

## 6. Out of scope

- Project detail pages — the card is the only surface
- Filtering by stack or type
- Featured / pinned projects
- Client or freelance projects
