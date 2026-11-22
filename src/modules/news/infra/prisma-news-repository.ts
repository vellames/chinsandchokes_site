import type { Prisma, PrismaClient } from "@/generated/prisma/client";
import type { Article, ArticleSummary } from "../domain/article";
import { readingMinutes } from "../domain/reading-time";
import type { ListQuery, NewsRepository } from "../application/news-repository";
import { parseSources } from "./sources";

const summarySelect = {
  id: true,
  slug: true,
  title: true,
  dek: true,
  body: true,
  coverImageUrl: true,
  coverImageAlt: true,
  coverImageCredit: true,
  youtubeVideoId: true,
  videoOrientation: true,
  publishedAt: true,
  category: { select: { slug: true, name: true } },
  author: { select: { name: true } },
} satisfies Prisma.ArticleSelect;

const articleSelect = {
  ...summarySelect,
  updatedAt: true,
  sources: true,
  seoTitle: true,
  seoDescription: true,
  author: { select: { slug: true, name: true, bio: true, avatarUrl: true } },
  tags: { select: { tag: { select: { slug: true, name: true } } }, orderBy: { tag: { name: "asc" } } },
} satisfies Prisma.ArticleSelect;

type SummaryRow = Prisma.ArticleGetPayload<{ select: typeof summarySelect }>;
type ArticleRow = Prisma.ArticleGetPayload<{ select: typeof articleSelect }>;

const newestFirst = [{ publishedAt: "desc" }, { id: "asc" }] satisfies Prisma.ArticleOrderByWithRelationInput[];

function visibleAt(now: Date): Prisma.ArticleWhereInput {
  return { status: "published", publishedAt: { lte: now } };
}

/** Adapter: NewsRepository on Postgres through Prisma. */
export class PrismaNewsRepository implements NewsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findFeatured(now: Date) {
    const row = await this.prisma.article.findFirst({
      where: { ...visibleAt(now), featured: true },
      orderBy: newestFirst,
      select: summarySelect,
    });
    return row ? toSummary(row) : null;
  }

  listLatest(query: ListQuery) {
    return this.list({}, query);
  }

  listByCategory(categorySlug: string, query: ListQuery) {
    return this.list({ category: { slug: categorySlug } }, query);
  }

  listByTag(tagSlug: string, query: ListQuery) {
    return this.list({ tags: { some: { tag: { slug: tagSlug } } } }, query);
  }

  async findArticle(slug: string, now: Date) {
    const row = await this.prisma.article.findFirst({ where: { ...visibleAt(now), slug }, select: articleSelect });
    return row ? toArticle(row) : null;
  }

  async listRelated(article: Pick<Article, "id" | "category">, now: Date, limit: number) {
    const base = { ...visibleAt(now), id: { not: article.id } };
    const same = await this.prisma.article.findMany({
      where: { ...base, category: { slug: article.category.slug } },
      orderBy: newestFirst,
      take: limit,
      select: summarySelect,
    });
    const missing = limit - same.length;
    const fill =
      missing > 0
        ? await this.prisma.article.findMany({
            where: { ...base, category: { slug: { not: article.category.slug } } },
            orderBy: newestFirst,
            take: missing,
            select: summarySelect,
          })
        : [];
    return [...same, ...fill].map(toSummary);
  }

  listNavigationCategories() {
    return this.prisma.category.findMany({
      where: { position: { not: null } },
      orderBy: [{ position: "asc" }, { name: "asc" }],
      select: { slug: true, name: true },
    });
  }

  findCategory(slug: string) {
    return this.prisma.category.findUnique({ where: { slug }, select: { slug: true, name: true, description: true } });
  }

  findTag(slug: string) {
    return this.prisma.tag.findUnique({ where: { slug }, select: { slug: true, name: true } });
  }

  listArticleIndex(now: Date) {
    return this.prisma.article.findMany({
      where: visibleAt(now),
      orderBy: newestFirst,
      select: { slug: true, updatedAt: true },
    });
  }

  private async list(filter: Prisma.ArticleWhereInput, { now, limit, offset, excludeIds = [] }: ListQuery) {
    const where: Prisma.ArticleWhereInput = {
      ...visibleAt(now),
      ...filter,
      ...(excludeIds.length > 0 ? { id: { notIn: [...excludeIds] } } : {}),
    };
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.article.findMany({ where, orderBy: newestFirst, skip: offset, take: limit, select: summarySelect }),
      this.prisma.article.count({ where }),
    ]);
    return { items: rows.map(toSummary), total };
  }
}

function toSummary(row: SummaryRow): ArticleSummary {
  if (!row.publishedAt) throw new Error(`Published article ${row.id} has no publishedAt`);
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    dek: row.dek,
    cover: row.coverImageUrl
      ? { url: row.coverImageUrl, alt: row.coverImageAlt ?? "", credit: row.coverImageCredit }
      : null,
    video: row.youtubeVideoId ? { youtubeId: row.youtubeVideoId, orientation: row.videoOrientation } : null,
    category: row.category,
    authorName: row.author?.name ?? null,
    publishedAt: row.publishedAt,
    readingMinutes: readingMinutes(row.body),
  };
}

function toArticle(row: ArticleRow): Article {
  return {
    ...toSummary(row),
    body: row.body,
    author: row.author,
    tags: row.tags.map(({ tag }) => tag),
    sources: parseSources(row.sources),
    updatedAt: row.updatedAt,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
  };
}
