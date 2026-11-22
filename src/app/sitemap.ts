import type { MetadataRoute } from "next";
import { getArticleIndex, getNavigation } from "@/modules/news";
import { paths, siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, categories] = await Promise.all([getArticleIndex(), getNavigation()]);
  const url = (path: string) => new URL(path, siteUrl()).toString();
  return [
    { url: url(paths.home()), changeFrequency: "hourly", priority: 1 },
    { url: url(paths.latest()), changeFrequency: "hourly", priority: 0.8 },
    ...categories.map((c) => ({ url: url(paths.category(c.slug)), changeFrequency: "daily" as const, priority: 0.6 })),
    ...articles.map((a) => ({ url: url(paths.article(a.slug)), lastModified: a.updatedAt, priority: 0.7 })),
  ];
}
