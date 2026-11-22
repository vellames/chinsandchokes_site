import { getFeed } from "@/modules/news";
import { paths, site, siteUrl } from "@/lib/site";

/** RSS 2.0 feed of the newest stories. */
export async function GET() {
  const articles = await getFeed();
  const base = siteUrl();
  const link = (path: string) => escapeXml(new URL(path, base).toString());

  const items = articles
    .map(
      (a) => `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${link(paths.article(a.slug))}</link>
      <guid isPermaLink="true">${link(paths.article(a.slug))}</guid>
      <description>${escapeXml(a.dek)}</description>
      <category>${escapeXml(a.category.name)}</category>
      <pubDate>${a.publishedAt.toUTCString()}</pubDate>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <link>${link(paths.home())}</link>
    <description>${escapeXml(site.description)}</description>
    <language>en-us</language>
    <atom:link href="${link(paths.feed())}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c] ?? c);
}
