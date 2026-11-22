import type { Article, ArticleSummary, Category, CategoryRef, TagRef } from "../domain/article";

/**
 * Port: where published news comes from. Every read only returns articles that are visible at
 * `now` (status published and publishedAt <= now), newest first.
 */
export interface NewsRepository {
  /** The newest featured article, or null if none is featured. */
  findFeatured(now: Date): Promise<ArticleSummary | null>;
  listLatest(query: ListQuery): Promise<{ items: ArticleSummary[]; total: number }>;
  listByCategory(categorySlug: string, query: ListQuery): Promise<{ items: ArticleSummary[]; total: number }>;
  listByTag(tagSlug: string, query: ListQuery): Promise<{ items: ArticleSummary[]; total: number }>;
  findArticle(slug: string, now: Date): Promise<Article | null>;
  /** Other articles of the same category (falls back to the latest ones), excluding the given id. */
  listRelated(article: Pick<Article, "id" | "category">, now: Date, limit: number): Promise<ArticleSummary[]>;
  /** Categories shown in the navigation (position not null), in position order. */
  listNavigationCategories(): Promise<CategoryRef[]>;
  findCategory(slug: string): Promise<Category | null>;
  findTag(slug: string): Promise<TagRef | null>;
  /** Slugs and last update of every visible article, for the sitemap. */
  listArticleIndex(now: Date): Promise<{ slug: string; updatedAt: Date }[]>;
}

export interface ListQuery {
  readonly now: Date;
  readonly limit: number;
  readonly offset: number;
  readonly excludeIds?: readonly string[];
}
