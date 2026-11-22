import { describe, expect, it } from "vitest";
import { InMemoryNewsRepository, anArticle } from "../testing/in-memory-news-repository";
import { HOME_LATEST_COUNT, LIST_PAGE_SIZE, createNewsService } from "./news-service";

const NOW = new Date("2026-11-22T12:00:00Z");
const minutesAgo = (m: number) => new Date(NOW.getTime() - m * 60_000);

function service(...args: ConstructorParameters<typeof InMemoryNewsRepository>) {
  return createNewsService({ repository: new InMemoryNewsRepository(...args), clock: () => NOW });
}

describe("getHome", () => {
  it("is empty when nothing is published", async () => {
    await expect(service().getHome()).resolves.toEqual({ lead: null, latest: [], hasMore: false });
  });

  it("leads with the newest article when none is featured", async () => {
    const older = anArticle({ publishedAt: minutesAgo(20) });
    const newer = anArticle({ publishedAt: minutesAgo(10) });
    const home = await service([older, newer]).getHome();
    expect(home.lead?.id).toBe(newer.id);
    expect(home.latest.map((a) => a.id)).toEqual([older.id]);
  });

  it("leads with the newest featured article and does not repeat it", async () => {
    const featured = anArticle({ featured: true, publishedAt: minutesAgo(60) });
    const newest = anArticle({ publishedAt: minutesAgo(1) });
    const home = await service([featured, newest]).getHome();
    expect(home.lead?.id).toBe(featured.id);
    expect(home.latest.map((a) => a.id)).toEqual([newest.id]);
  });

  it("hides drafts, archived and scheduled articles", async () => {
    const visible = anArticle({ publishedAt: minutesAgo(5) });
    const home = await service([
      visible,
      anArticle({ status: "draft" }),
      anArticle({ status: "archived" }),
      anArticle({ publishedAt: new Date(NOW.getTime() + 60_000) }),
    ]).getHome();
    expect(home.lead?.id).toBe(visible.id);
    expect(home.latest).toEqual([]);
  });

  it("says when there is more than the home page shows", async () => {
    const articles = Array.from({ length: HOME_LATEST_COUNT + 2 }, (_, i) =>
      anArticle({ publishedAt: minutesAgo(i + 1) }),
    );
    const home = await service(articles).getHome();
    expect(home.latest).toHaveLength(HOME_LATEST_COUNT);
    expect(home.hasMore).toBe(true);

    const exact = await service(articles.slice(0, HOME_LATEST_COUNT + 1)).getHome();
    expect(exact.hasMore).toBe(false);
  });
});

describe("getCategoryPage", () => {
  const categories = [{ slug: "news", name: "News", description: null, position: 0 }];

  it("returns null for an unknown or malformed slug", async () => {
    await expect(service([], categories).getCategoryPage("missing", 1)).resolves.toBeNull();
    await expect(service([], categories).getCategoryPage("../etc", 1)).resolves.toBeNull();
  });

  it("returns an empty first page for a category with no articles", async () => {
    const result = await service([], categories).getCategoryPage("news", 1);
    expect(result?.articles).toEqual({ items: [], page: 1, pageCount: 1, total: 0 });
  });

  it("paginates and refuses pages past the end", async () => {
    const articles = Array.from({ length: LIST_PAGE_SIZE + 1 }, (_, i) =>
      anArticle({ publishedAt: minutesAgo(i + 1) }),
    );
    const svc = service(articles, categories);
    const second = await svc.getCategoryPage("news", 2);
    expect(second?.articles.items).toHaveLength(1);
    expect(second?.articles.pageCount).toBe(2);
    await expect(svc.getCategoryPage("news", 3)).resolves.toBeNull();
  });
});

describe("getArticle", () => {
  it("returns the article with related ones from the same category first", async () => {
    const article = anArticle({ category: { slug: "bjj", name: "BJJ" } });
    const sameCategory = anArticle({ category: { slug: "bjj", name: "BJJ" }, publishedAt: minutesAgo(100) });
    const other = anArticle({ publishedAt: minutesAgo(1) });
    const result = await service([article, sameCategory, other]).getArticle(article.slug);
    expect(result?.article.id).toBe(article.id);
    expect(result?.related.map((a) => a.id)).toEqual([sameCategory.id, other.id]);
  });

  it("returns null for drafts and malformed slugs", async () => {
    const draft = anArticle({ status: "draft" });
    await expect(service([draft]).getArticle(draft.slug)).resolves.toBeNull();
    await expect(service().getArticle("Not A Slug")).resolves.toBeNull();
  });
});
