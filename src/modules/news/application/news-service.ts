import type { Article, ArticleSummary, Category, CategoryRef, TagRef } from "../domain/article";
import { isValidSlug } from "../domain/slug";
import { type Page, pageCount } from "../domain/pagination";
import type { NewsRepository } from "./news-repository";

export const HOME_LATEST_COUNT = 9;
export const LIST_PAGE_SIZE = 12;
export const RELATED_COUNT = 3;
export const FEED_SIZE = 30;

export interface HomePage {
  /** Lead story: the newest featured article, else the newest article. */
  readonly lead: ArticleSummary | null;
  /** The next articles after the lead (never repeats it). */
  readonly latest: readonly ArticleSummary[];
  /** True when there are more articles than the home page shows. */
  readonly hasMore: boolean;
}

export interface ArticlePage {
  readonly article: Article;
  readonly related: readonly ArticleSummary[];
}

export interface Deps {
  readonly repository: NewsRepository;
  readonly clock: () => Date;
}

/** Use cases of the public portal. Pure orchestration; data access goes through the port. */
export function createNewsService({ repository, clock }: Deps) {
  return {
    async getHome(): Promise<HomePage> {
      const now = clock();
      const featured = await repository.findFeatured(now);
      const excludeIds = featured ? [featured.id] : [];
      // One extra row tells whether there is more to read.
      const wanted = HOME_LATEST_COUNT + (featured ? 0 : 1);
      const { items } = await repository.listLatest({ now, limit: wanted + 1, offset: 0, excludeIds });
      const lead = featured ?? items[0] ?? null;
      const rest = featured ? items : items.slice(1);
      return {
        lead,
        latest: rest.slice(0, HOME_LATEST_COUNT),
        hasMore: rest.length > HOME_LATEST_COUNT,
      };
    },

    async getLatestPage(page: number): Promise<Page<ArticleSummary> | null> {
      const now = clock();
      const result = await repository.listLatest({ now, ...window(page) });
      return toPage(result, page);
    },

    async getCategoryPage(
      slug: string,
      page: number,
    ): Promise<{ category: Category; articles: Page<ArticleSummary> } | null> {
      if (!isValidSlug(slug)) return null;
      const category = await repository.findCategory(slug);
      if (!category) return null;
      const result = await repository.listByCategory(slug, { now: clock(), ...window(page) });
      const articles = toPage(result, page);
      return articles ? { category, articles } : null;
    },

    async getTagPage(slug: string, page: number): Promise<{ tag: TagRef; articles: Page<ArticleSummary> } | null> {
      if (!isValidSlug(slug)) return null;
      const tag = await repository.findTag(slug);
      if (!tag) return null;
      const result = await repository.listByTag(slug, { now: clock(), ...window(page) });
      const articles = toPage(result, page);
      return articles ? { tag, articles } : null;
    },

    async getArticle(slug: string): Promise<ArticlePage | null> {
      if (!isValidSlug(slug)) return null;
      const now = clock();
      const article = await repository.findArticle(slug, now);
      if (!article) return null;
      const related = await repository.listRelated(article, now, RELATED_COUNT);
      return { article, related };
    },

    getNavigation(): Promise<CategoryRef[]> {
      return repository.listNavigationCategories();
    },

    async getFeed(): Promise<ArticleSummary[]> {
      const { items } = await repository.listLatest({ now: clock(), limit: FEED_SIZE, offset: 0 });
      return items;
    },

    getArticleIndex(): Promise<{ slug: string; updatedAt: Date }[]> {
      return repository.listArticleIndex(clock());
    },
  };
}

export type NewsService = ReturnType<typeof createNewsService>;

function window(page: number) {
  return { limit: LIST_PAGE_SIZE, offset: (page - 1) * LIST_PAGE_SIZE };
}

/** Page 1 always exists (possibly empty); a page past the end is "not found". */
function toPage(
  { items, total }: { items: ArticleSummary[]; total: number },
  page: number,
): Page<ArticleSummary> | null {
  const count = pageCount(total, LIST_PAGE_SIZE);
  if (page > count) return null;
  return { items, page, pageCount: count, total };
}
