import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

async function getSitemapUrls(baseURL: string): Promise<string[]> {
  const response = await fetch(`${baseURL}/sitemap-0.xml`).catch(() =>
    fetch(`${baseURL}/sitemap.xml`),
  );
  const xml = await response.text();
  const matches = xml.matchAll(/<loc>([^<]+)<\/loc>/g);
  const base = new URL(baseURL);
  return [...matches].map((m) => {
    const url = new URL(m[1] as string);
    url.host = base.host;
    url.protocol = base.protocol;
    url.port = base.port;
    return url.toString();
  });
}

test('every page passes WCAG 2.1 AA', async ({ page, baseURL }) => {
  const sitemapUrls = await getSitemapUrls(baseURL!);

  for (const url of sitemapUrls) {
    await page.goto(url);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(
      results.violations,
      `${url}: ${results.violations.map((v) => `[${v.id}] ${v.description} — ${v.nodes.map((n) => n.target).join(', ')}`).join('\n')}`,
    ).toEqual([]);
  }
});
