import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/core/db";
import { createNewsService, type NewsService } from "./application/news-service";
import { PrismaNewsRepository } from "./infra/prisma-news-repository";

/**
 * Composition root of the news module + the cache boundary.
 *
 * Every read is cached ('use cache') with the `news` tag and the `minutes` profile: content typed
 * straight into the database shows up within about a minute, or at once via POST /api/revalidate.
 * Scheduled articles (publishedAt in the future) appear when the cache next refreshes.
 */
export const NEWS_CACHE_TAG = "news";

let instance: NewsService | undefined;
function news(): NewsService {
  instance ??= createNewsService({ repository: new PrismaNewsRepository(db()), clock: () => new Date() });
  return instance;
}

function cached() {
  cacheLife("minutes");
  cacheTag(NEWS_CACHE_TAG);
}

export async function getHome() {
  "use cache";
  cached();
  return news().getHome();
}

export async function getLatestPage(page: number) {
  "use cache";
  cached();
  return news().getLatestPage(page);
}

export async function getCategoryPage(slug: string, page: number) {
  "use cache";
  cached();
  return news().getCategoryPage(slug, page);
}

export async function getTagPage(slug: string, page: number) {
  "use cache";
  cached();
  return news().getTagPage(slug, page);
}

export async function getArticle(slug: string) {
  "use cache";
  cached();
  return news().getArticle(slug);
}

export async function getNavigation() {
  "use cache";
  cached();
  return news().getNavigation();
}

export async function getFeed() {
  "use cache";
  cached();
  return news().getFeed();
}

export async function getArticleIndex() {
  "use cache";
  cached();
  return news().getArticleIndex();
}

export type { Article, ArticleSummary, Category, CategoryRef, Source, TagRef } from "./domain/article";
export type { Page } from "./domain/pagination";
export { parsePageNumber } from "./domain/pagination";
