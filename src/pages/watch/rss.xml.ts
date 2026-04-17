import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { defaultDescription, siteName } from '@/config';
import { ui } from '@/i18n';

export async function GET(context: APIContext) {
  const entries = await getCollection('watch');
  const sorted = entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: `${siteName} — ${ui.rss.feedTitle}`,
    description: defaultDescription,
    site: context.site ?? new URL(siteUrl),
    items: sorted.map((entry) => ({
      title: entry.data.title,
      link: entry.data.url,
      pubDate: entry.data.date,
      description: entry.body ?? '',
      customData: `<source url="${entry.data.source.url}">${entry.data.source.name}</source>`,
    })),
  });
}
