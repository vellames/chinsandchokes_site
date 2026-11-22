import type { ArticleSummary } from "@/modules/news";
import { ArticleCard } from "../molecules/article-card";

export function ArticleGrid({ articles }: { articles: readonly ArticleSummary[] }) {
  return (
    <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
