import Link from "next/link";
import type { ArticleSummary } from "@/modules/news";
import { paths } from "@/lib/site";
import { CoverImage, CoverPlaceholder } from "../atoms/cover-image";
import { Kicker } from "../atoms/kicker";
import { ArticleMeta } from "./article-meta";

type Variant = "grid" | "compact";

/** A story in a list. "grid" = photo on top; "compact" = small photo beside the headline. */
export function ArticleCard({ article, variant = "grid" }: { article: ArticleSummary; variant?: Variant }) {
  const href = paths.article(article.slug);

  if (variant === "compact") {
    return (
      <article className="group relative flex gap-4">
        <div className="relative aspect-square w-24 shrink-0 overflow-hidden bg-graphite sm:w-28">
          {article.cover ? (
            <CoverImage src={article.cover.url} alt={article.cover.alt} sizes="112px" />
          ) : (
            <CoverPlaceholder />
          )}
        </div>
        <div className="min-w-0">
          <Kicker rule={false}>{article.category.name}</Kicker>
          <h3 className="headline mt-1.5 text-2xl text-bone group-hover:text-lime">
            <Link href={href} className="after:absolute after:inset-0">
              {article.title}
            </Link>
          </h3>
          <ArticleMeta publishedAt={article.publishedAt} readingMinutes={article.readingMinutes} className="mt-2" />
        </div>
      </article>
    );
  }

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[16/10] overflow-hidden bg-graphite">
        {article.cover ? (
          <CoverImage
            src={article.cover.url}
            alt={article.cover.alt}
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <CoverPlaceholder />
        )}
        <span aria-hidden className="absolute bottom-0 left-0 h-1 w-0 bg-lime transition-all duration-300 group-hover:w-full" />
      </div>
      <div className="mt-4">
        <Kicker>{article.category.name}</Kicker>
        <h3 className="headline mt-2 text-3xl text-bone group-hover:text-lime">
          <Link href={href} className="after:absolute after:inset-0">
            {article.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{article.dek}</p>
        <ArticleMeta
          publishedAt={article.publishedAt}
          readingMinutes={article.readingMinutes}
          authorName={article.authorName}
          className="mt-3"
        />
      </div>
    </article>
  );
}
