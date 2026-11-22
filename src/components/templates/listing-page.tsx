import type { ReactNode } from "react";
import type { ArticleSummary, Page } from "@/modules/news";
import { Kicker } from "../atoms/kicker";
import { Pagination } from "../molecules/pagination";
import { ArticleGrid } from "../organisms/article-grid";
import { EmptyState } from "../organisms/empty-state";

/** Category, tag and "latest" pages share one layout: title block → grid → pagination. */
export function ListingPage({
  kicker,
  title,
  description,
  articles,
  pageHref,
}: {
  kicker: string;
  title: string;
  description?: ReactNode;
  articles: Page<ArticleSummary>;
  pageHref: (page: number) => string;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16">
      <header className="mb-12 border-b border-line pb-10">
        <Kicker>{kicker}</Kicker>
        <h1 className="headline mt-3 text-6xl text-bone sm:text-8xl">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{description}</p>}
      </header>
      {articles.items.length > 0 ? (
        <ArticleGrid articles={articles.items} />
      ) : (
        <EmptyState title="Nothing here yet">New stories land here as soon as they are published.</EmptyState>
      )}
      <Pagination page={articles.page} pageCount={articles.pageCount} href={pageHref} />
    </div>
  );
}
