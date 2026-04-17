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

test('every page has correct semantic structure', async ({ page, baseURL }) => {
  const sitemapUrls = await getSitemapUrls(baseURL!);

  for (const url of sitemapUrls) {
    await page.goto(url);

    const headers = page.locator('header');
    expect(await headers.count(), `${url}: must have exactly one <header>`).toBe(1);

    const navInHeader = page.locator('header nav');
    expect(await navInHeader.count(), `${url}: <header> must contain a <nav>`).toBe(1);

    const mains = page.locator('main');
    expect(await mains.count(), `${url}: must have exactly one <main>`).toBe(1);

    const footers = page.locator('footer');
    expect(await footers.count(), `${url}: must have exactly one <footer>`).toBe(1);
  }
});
