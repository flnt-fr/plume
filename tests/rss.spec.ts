import { expect, test } from '@playwright/test';

test('RSS feed is valid', async ({ request, baseURL }) => {
  const response = await request.get(`${baseURL}/watch/rss.xml`);

  expect(response.status()).toBe(200);

  const contentType = response.headers()['content-type'] ?? '';
  expect(contentType).toMatch(/application\/xml|text\/xml/);

  const xml = await response.text();

  expect(xml).toContain('<rss');

  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
  expect(items.length).toBeGreaterThan(0);

  for (const item of items) {
    const body = item[1] as string;

    const title = body.match(/<title>([^<]*)<\/title>/)?.[1]?.trim();
    expect(title, 'Item must have a non-empty title').toBeTruthy();

    const link = body.match(/<link>([^<]*)<\/link>/)?.[1]?.trim();
    expect(link, 'Item must have a link').toBeTruthy();
    expect(() => new URL(link!), `Item link must be a valid URL: ${link}`).not.toThrow();

    const pubDate = body.match(/<pubDate>([^<]*)<\/pubDate>/)?.[1]?.trim();
    expect(pubDate, 'Item must have a pubDate').toBeTruthy();
    expect(isNaN(Date.parse(pubDate!)), `Item pubDate must be a valid date: ${pubDate}`).toBe(
      false,
    );
  }
});
