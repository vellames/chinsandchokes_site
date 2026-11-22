import type { Article, Category } from "../domain/article";
import type { ListQuery, NewsRepository } from "../application/news-repository";

export interface StoredArticle extends Article {
  readonly status: "draft" | "published" | "archived";
  readonly featured: boolean;
}

/** Test double for the NewsRepository port, with the same visibility rules as the Prisma adapter. */
export class InMemoryNewsRepository implements NewsRepository {
  constructor(
    private readonly articles: StoredArticle[] = [],
    private readonly categories: (Category & { position: number | null })[] = [],
  ) {}

  private visible(now: Date) {
    return this.articles
      .filter((a) => a.status === "published" && a.publishedAt <= now)
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }

  private slice(list: StoredArticle[], { limit, offset, excludeIds = [] }: ListQuery) {
    const filtered = list.filter((a) => !excludeIds.includes(a.id));
    return { items: filtered.slice(offset, offset + limit), total: filtered.length };
  }

  async findFeatured(now: Date) {
    return this.visible(now).find((a) => a.featured) ?? null;
  }
  async listLatest(query: ListQuery) {
    return this.slice(this.visible(query.now), query);
  }
  async listByCategory(slug: string, query: ListQuery) {
    return this.slice(this.visible(query.now).filter((a) => a.category.slug === slug), query);
  }
  async listByTag(slug: string, query: ListQuery) {
    return this.slice(this.visible(query.now).filter((a) => a.tags.some((t) => t.slug === slug)), query);
  }
  async findArticle(slug: string, now: Date) {
    return this.visible(now).find((a) => a.slug === slug) ?? null;
  }
  async listRelated(article: Pick<Article, "id" | "category">, now: Date, limit: number) {
    const others = this.visible(now).filter((a) => a.id !== article.id);
    const same = others.filter((a) => a.category.slug === article.category.slug);
    const rest = others.filter((a) => a.category.slug !== article.category.slug);
    return [...same, ...rest].slice(0, limit);
  }
  async listNavigationCategories() {
    return this.categories
      .filter((c) => c.position !== null)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map(({ slug, name }) => ({ slug, name }));
  }
  async findCategory(slug: string) {
    const found = this.categories.find((c) => c.slug === slug);
    return found ? { slug: found.slug, name: found.name, description: found.description } : null;
  }
  async findTag(slug: string) {
    return this.articles.flatMap((a) => a.tags).find((t) => t.slug === slug) ?? null;
  }
  async listArticleIndex(now: Date) {
    return this.visible(now).map(({ slug, updatedAt }) => ({ slug, updatedAt }));
  }
}

let sequence = 0;

export function anArticle(overrides: Partial<StoredArticle> = {}): StoredArticle {
  sequence += 1;
  const publishedAt = overrides.publishedAt ?? new Date(Date.UTC(2026, 10, 1, 12, sequence));
  return {
    id: `00000000-0000-4000-8000-${String(sequence).padStart(12, "0")}`,
    slug: `article-${sequence}`,
    title: `Article ${sequence}`,
    dek: "Dek",
    body: "Body",
    cover: null,
    category: { slug: "news", name: "News" },
    authorName: null,
    author: null,
    tags: [],
    sources: [],
    readingMinutes: 1,
    seoTitle: null,
    seoDescription: null,
    status: "published",
    featured: false,
    updatedAt: publishedAt,
    ...overrides,
    publishedAt,
  };
}
