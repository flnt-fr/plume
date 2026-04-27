# spec: testing

> Scope: end-to-end testing strategy for the portfolio. This spec defines what is tested, how, and under what conditions.

---

## 1. Philosophy

This is a static portfolio. The risk of regression is low, so the test surface is narrow by design.

The single meaningful failure mode before a deployment is a broken internal link — a page that no longer exists, a slug that changed, a route that was never created. Everything else is either caught at build time (TypeScript, Astro) or trivially visible on screen.

No unit tests. No component snapshot tests. No visual regression tests.

---

## 2. Tooling

**Playwright** — targets the production build, not the dev server.

Required workflow before any test run:

```bash
astro build       # generate the static site and sitemap.xml
astro preview &   # serve the build locally
playwright test   # run against the preview server
```

The test suite must never run against `astro dev`. It must target what will actually be deployed.

---

## 3. Test: internal link validation

**File:** `tests/links.spec.ts`

**Goal:** assert that every internal link on every page of the site resolves to a 200 status.

**Strategy:**

1. Fetch `sitemap-0.xml` (falling back to `sitemap.xml`) to get the full list of pages — `@astrojs/sitemap` generates a `sitemap-index.xml` + `sitemap-0.xml` pair; tests try the numbered file first
2. For each page, navigate to it and collect all `<a href>` attributes
3. Filter to internal links only (same origin, exclude `mailto:`, `tel:`, anchors)
4. For each internal link, assert the response status is 200

**Failure condition:** any internal link returning a non-200 status fails the test. The test output must identify the source page and the broken URL.

**What this does not cover:**

- External links — not validated (availability is outside our control)
- Visual correctness — not in scope
- JavaScript-dependent interactions — the site is fully functional without JS; if a link requires JS to be present in the DOM, it is an architecture violation, not a test gap

---

## 4. CI integration

The test runs as the final step before deployment. No deployment proceeds if the test fails.

```yaml
# example CI steps
- run: npm run build        # astro build
- run: npm run preview &    # astro preview in background
- run: npx playwright test
```

The preview server must be given time to start before Playwright runs. Use Playwright's `webServer` config option to handle this:

```ts
// playwright.config.ts
webServer: {
    command: 'npm run preview -- --port 4322',
    url: 'http://localhost:4322',
    reuseExistingServer: false,
}
```

Port 4322 is used to avoid conflicts with the dev server (`astro dev`) running on 4321.

---

## 5. Test: RSS feed validation

**File:** `tests/rss.spec.ts`

**Goal:** assert that the RSS feed is valid and consistent with the content collection.

**Strategy:**

1. Fetch `/watch/rss.xml` and assert the response status is 200
2. Assert the response `Content-Type` is `application/xml` or `text/xml`
3. Parse the feed and assert the following for each item:
    - `title` is present and non-empty
    - `link` is present and a valid URL
    - `pubDate` is present and a valid date

**Failure condition:** a missing feed, an unparseable feed, or any item failing the above assertions fails the test.

---

## 6. Test: page semantic structure

**File:** `tests/structure.spec.ts`

**Goal:** assert that every page exposes a consistent and meaningful HTML structure.

**Strategy:**

1. Fetch `sitemap-0.xml` (falling back to `sitemap.xml`) to get the full list of pages — excludes `/watch/rss.xml` and `/sitemap.xml` by definition since they are not HTML pages
2. For each page, assert the presence of the following elements:
    - exactly one `<header>` containing a `<nav>`
    - exactly one `<main>`
    - exactly one `<footer>`

**Failure condition:** any missing or duplicated structural element on any page fails the test. The output must identify the page and the missing element.

This test runs in CI against the production build via `astro preview`.

---

## 7. Extending the test suite

New tests may be added only if they meet both conditions:

- They validate a behaviour that cannot be caught at build time
- They validate a behaviour that cannot be verified by visual inspection in under a minute

If a new user interaction is introduced that requires JS (e.g. theme toggle), a targeted Playwright test for that interaction is acceptable.