import Link from "next/link";
import type { ArticleSummary } from "@/modules/news";
import { paths } from "@/lib/site";
import { CoverImage, CoverPlaceholder } from "../atoms/cover-image";
import { Kicker } from "../atoms/kicker";
import { ArticleMeta } from "../molecules/article-meta";

/** The home page's top story: full-bleed B&W photo, giant headline over a charcoal fade. */
export function LeadStory({ article }: { article: ArticleSummary }) {
  return (
    <article className="group relative isolate overflow-hidden bg-graphite">
      <div className="relative aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]">
        {article.cover ? (
          <CoverImage src={article.cover.url} alt={article.cover.alt} sizes="100vw" priority />
        ) : (
          <CoverPlaceholder />
        )}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/0" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-charcoal/80 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-8 sm:px-6 sm:pb-12">
        <Kicker>{article.category.name}</Kicker>
        <h1 className="headline mt-3 max-w-4xl text-5xl text-bone sm:text-6xl lg:text-8xl">
          <Link href={paths.article(article.slug)} className="after:absolute after:inset-0 group-hover:text-lime">
            {article.title}
          </Link>
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-bone/85 sm:text-lg">{article.dek}</p>
        <ArticleMeta
          publishedAt={article.publishedAt}
          readingMinutes={article.readingMinutes}
          authorName={article.authorName}
          className="mt-4"
        />
      </div>
    </article>
  );
}
