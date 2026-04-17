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

test('all internal links resolve to 200', async ({ page, baseURL }) => {
  const base = baseURL!;
  const sitemapUrls = await getSitemapUrls(base);

  const visited = new Set<string>();

  for (const pageUrl of sitemapUrls) {
    await page.goto(pageUrl);

    const hrefs = await page.$$eval('a[href]', (anchors) =>
      anchors.map((a) => (a as HTMLAnchorElement).href),
    );

    const internalLinks = hrefs.filter((href) => {
      if (!href.startsWith('http')) return false;
      const url = new URL(href);
      const baseOrigin = new URL(base).origin;
      if (url.origin !== baseOrigin) return false;
      if (url.protocol === 'mailto:' || url.protocol === 'tel:') return false;
      if (url.hash && url.pathname === new URL(pageUrl).pathname) return false;
      return true;
    });

    for (const link of internalLinks) {
      const normalized = new URL(link).pathname;
      if (visited.has(normalized)) continue;
      visited.add(normalized);

      const response = await page.request.get(link);
      expect(response.status(), `Broken link ${link} found on ${pageUrl}`).toBe(200);
    }
  }
});
