import Link from "next/link";
import type { ArticleSummary } from "@/modules/news";
import { paths } from "@/lib/site";
import { CoverImage, CoverPlaceholder } from "../atoms/cover-image";
import { Kicker } from "../atoms/kicker";
import { ArticleMeta } from "../molecules/article-meta";

/**
 * The home page's top story: giant headline beside the 16:9 cover. The headline never sits over
 * the image, because our covers carry their own hook text (see scripts/site/make-site-covers.mjs).
 */
export function LeadStory({ article }: { article: ArticleSummary }) {
  return (
    <article className="group relative isolate border-b border-line bg-charcoal">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 sm:py-10 lg:grid-cols-[5fr_7fr] lg:items-center lg:gap-10">
        <div className="relative aspect-[16/9] overflow-hidden bg-graphite lg:order-2">
          {article.cover ? (
            <CoverImage
              src={article.cover.url}
              alt={article.cover.alt}
              sizes="(min-width: 1280px) 740px, (min-width: 1024px) 58vw, 100vw"
              priority
              className="transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <CoverPlaceholder />
          )}
          <span aria-hidden className="absolute bottom-0 left-0 h-1 w-0 bg-lime transition-all duration-300 group-hover:w-full" />
        </div>
        <div className="lg:order-1">
          <Kicker>{article.category.name}</Kicker>
          <h1 className="headline mt-3 text-4xl text-bone sm:text-6xl lg:text-6xl xl:text-7xl">
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
      </div>
    </article>
  );
}
