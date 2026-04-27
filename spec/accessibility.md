# spec: accessibility

> Scope: accessibility standards, design rules for interactive elements and external links, and automated testing strategy.

---

## 1. Standard

The site targets **WCAG 2.1 AA** compliance. This covers the minimum required for broad accessibility and aligns with current European regulatory expectations.

---

## 2. Design rules

### Interactive elements

Every interactive element must be unambiguously identifiable as such. This means:

- Focusable elements must have a visible focus indicator (not relying on the browser default alone)
- Links and buttons must be visually distinct from surrounding text and static content
- Hover and focus states must be explicitly defined — not inherited or implicit
- No interactive behaviour on elements that are not semantically interactive (`div`, `span` with click handlers are forbidden — use `<a>` or `<button>`)

### Colour contrast and opacity

On the Flexoki dark theme, `text-base-content` at reduced opacity is the standard way to express muted text. The minimum opacities that pass WCAG AA (4.5:1 for normal text) against the `base-100` background are:

- `/65` — minimum for muted text (dates, secondary labels) — ~5.3:1
- `/70` — recommended for interactive muted elements (links, footer, secondary CTAs) — ~5.9:1
- `/60` — acceptable only for large text (≥ 24px regular or ≥ 18.67px bold) — ~4.6:1

Never use `/50` or below for readable text. Disabled states (non-interactive) may use `/65` minimum.

---

### External links

Every external link must display an icon indicating it opens outside the site. The icon is rendered via CSS using the following SVG from **Remix Icon** (`ri-external-link-line`):

```
Source: https://remixicon.com
License: Apache 2.0
Author: Remix Design
```

The icon is injected via a CSS pseudo-element on any anchor with `target="_blank"`, avoiding markup duplication:

```css
a[target="_blank"]::after {
  content: '';
  display: inline-block;
  width: 1em;
  height: 1em;
  margin-left: 0.25em;
  vertical-align: middle;
  background-color: currentColor;
  mask-image: url("data:image/svg+xml,..."); /* inline SVG */
  mask-repeat: no-repeat;
  mask-size: contain;
}
```

The SVG used:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <path d="M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V11H19L18.9999 6.413L11.2071 14.2071L9.79289 12.7929L17.5849 5H13V3H21Z"/>
</svg>
```

The icon inherits `currentColor` — it adapts to any text colour without additional CSS.

All external links must also carry `rel="noopener noreferrer"` and an `aria-label` or sufficient text context to describe the destination.

---

## 3. Tooling

Accessibility tests run via **`@axe-core/playwright`**, the official Deque integration for Playwright. It injects the axe-core engine into each page and reports WCAG violations.

axe-core detects approximately 50% of WCAG issues automatically. It does not replace manual review for semantics, reading order, or contextual clarity.

---

## 4. Test: axe scan per page

**File:** `tests/a11y.spec.ts`

**Goal:** assert that every page of the site has no automatically detectable WCAG 2.1 A or AA violations.

**Strategy:**

1. Fetch `sitemap-0.xml` (falling back to `sitemap.xml`) to get the full list of pages
2. For each page, run an axe scan scoped to WCAG 2.1 A and AA tags: `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`
3. Assert that the violations array is empty

**Failure condition:** any violation on any page fails the test. The output must identify the page, the violated rule, and the offending element.

```ts
import AxeBuilder from '@axe-core/playwright'

const results = await new AxeBuilder({ page })
  .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
  .analyze()

expect(results.violations).toEqual([])
```

This test runs in CI alongside the internal link validation test, against the production build via `astro preview`.

---

## 5. Limits of automated testing

axe-core does not catch:

- Logical reading order issues
- Ambiguous link labels that pass syntax checks (`click here`, `read more`)
- Colour contrast issues in dynamic or CSS-generated content
- Keyboard navigation flow and focus trap correctness

These require manual review before any significant content or layout change.

---

## 6. Dependencies

Add to `package.json` devDependencies:

- `@axe-core/playwright`