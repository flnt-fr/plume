# spec: /experiences

> Scope: content model, page structure, and rendering rules for the experience and skills page.

---

## 1. Purpose

`/experiences` presents a professional overview in two parts: a reverse-chronological timeline of work experience, followed by a flat list of skills and tools. The page targets potential clients or collaborators evaluating a freelance profile.

All content on this page is written in French.

---

## 2. Content model

### Experience entries

Experiences are MDX files in an Astro content collection. The MDX body is the primary authoring surface — it holds the description of responsibilities and context, and may include any rich content (lists, highlights, etc.).

The frontmatter schema defines a baseline set of fields. Additional fields may be added to the schema as the content evolves — the schema is not considered closed.

#### Baseline frontmatter

| Field       | Type       | Required | Description                                      |
|-------------|------------|----------|--------------------------------------------------|
| `role`      | `string`   | yes      | Job title                                        |
| `company`   | `string`   | yes      | Company or client name                           |
| `startDate` | `string`   | yes      | Start date, `YYYY-MM` format                     |
| `endDate`   | `string`   | no       | End date, `YYYY-MM` format. Absent means current |
| `tags`      | `string[]` | no       | Technologies or tools used                       |

#### Body

The MDX body is optional. When present, it describes the role — responsibilities, context, notable contributions. No length constraint.

### Skills

Skills are stored in `src/data/skills.json` as an array of groups. Each group has a name and a list of skills. Order of groups and order of skills within a group are both significant.

```json
[
  {
    "category": "Langages",
    "skills": ["TypeScript", "HTML", "CSS", "..."]
  },
  {
    "category": "Frameworks",
    "skills": ["Astro", "..."]
  },
  {
    "category": "Technologies",
    "skills": ["Docker", "n8n", "..."]
  },
  {
    "category": "Méthodologies",
    "skills": ["Clean Architecture", "TDD", "..."]
  }
]
```

Skills are not MDX — they are labels, not authored content.

---

## 3. Page structure

The page renders two sections in order:

1. **Expériences** — timeline of work entries
2. **Compétences** — flat list of tools and technologies

No tabs, no toggles, no JS. Both sections are always visible.

---

## 4. Experience rendering

Entries are sorted by `startDate` descending at build time in the page.

Each entry is rendered using the shared `Card` component (DaisyUI `card`, `card-bordered` variant, no shadow). The card contains:

- **Role** — job title
- **Company** — company or client name
- **Period** — formatted as `MMM YYYY – MMM YYYY` (e.g. `Jan 2022 – Mar 2024`). If `endDate` is absent, renders as `MMM YYYY – Aujourd'hui`
- **Body** — rendered only if present
- **Tags** — rendered only if present, as a flat list of labels, not interactive

Entries are visually separated to suggest a timeline. No decorative timeline line or dot unless achievable in pure CSS without added markup.

---

## 5. Skills rendering

Skills are displayed as a table. Each row represents a category. The first column contains the category name, the second column contains the skills as a flat inline list.

| Catégorie      | Compétences                        |
|----------------|------------------------------------|
| Langages       | TypeScript, HTML, CSS, …           |
| Frameworks     | Astro, …                           |
| Technologies   | Docker, n8n, …                     |
| Méthodologies  | Clean Architecture, TDD, …         |

No proficiency level, no icons, no interactive filtering.

---

## 6. Out of scope

- Downloadable PDF résumé
- Proficiency levels or skill ratings
- Grouping skills by category
- Filtering or sorting
