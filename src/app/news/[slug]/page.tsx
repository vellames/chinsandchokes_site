import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CoverImage } from "@/components/atoms/cover-image";
import { Kicker } from "@/components/atoms/kicker";
import { ArticleMeta } from "@/components/molecules/article-meta";
import { SectionHeading } from "@/components/molecules/section-heading";
import { ArticleBody } from "@/components/organisms/article-body";
import { ArticleGrid } from "@/components/organisms/article-grid";
import { ShareBar } from "@/components/organisms/share-bar";
import { SourcesBox } from "@/components/organisms/sources-box";
import { type Article, getArticle, getFeed } from "@/modules/news";
import { formatDateTime } from "@/lib/dates";
import { paths, site, siteUrl } from "@/lib/site";

type Props = PageProps<"/news/[slug]">;

export async function generateStaticParams() {
  const latest = await getFeed();
  // Prerender the newest stories; older ones render on first visit and are then cached.
  // Cache Components needs at least one entry; an unknown slug simply renders the 404.
  return latest.length > 0 ? latest.map(({ slug }) => ({ slug })) : [{ slug: "welcome" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getArticle(slug);
  if (!result) return {};
  const { article } = result;
  const description = article.seoDescription ?? article.dek;
  return {
    title: article.seoTitle ?? article.title,
    description,
    alternates: { canonical: paths.article(article.slug) },
    authors: article.author ? [{ name: article.author.name }] : undefined,
    openGraph: {
      type: "article",
      title: article.seoTitle ?? article.title,
      description,
      publishedTime: article.publishedAt.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      section: article.category.name,
      tags: article.tags.map((t) => t.name),
      images: article.cover ? [{ url: article.cover.url, alt: article.cover.alt }] : undefined,
    },
  };
}

async function ArticleView({ params }: Pick<Props, "params">) {
  const { slug } = await params;
  const result = await getArticle(slug);
  if (!result) notFound();
  const { article, related } = result;
  const url = new URL(paths.article(article.slug), siteUrl()).toString();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(article, url) }} />
      <article>
        <header className="mx-auto max-w-4xl px-4 pt-12 sm:px-6 sm:pt-16">
          <Kicker href={paths.category(article.category.slug)}>{article.category.name}</Kicker>
          <h1 className="headline mt-4 text-5xl text-bone sm:text-7xl">{article.title}</h1>
          <p className="mt-5 text-xl leading-relaxed text-muted sm:text-2xl">{article.dek}</p>
          <div className="mt-6 flex flex-col gap-5 border-y border-line py-5 sm:flex-row sm:items-center sm:justify-between">
            <ArticleMeta
              publishedAt={article.publishedAt}
              readingMinutes={article.readingMinutes}
              authorName={article.author?.name}
              className="text-sm"
            />
            <ShareBar url={url} title={article.title} />
          </div>
        </header>

        {article.cover && (
          <figure className="mx-auto mt-10 max-w-6xl sm:px-6">
            <div className="relative aspect-[16/9] overflow-hidden bg-graphite">
              <CoverImage src={article.cover.url} alt={article.cover.alt} sizes="(min-width: 1152px) 1104px, 100vw" priority />
            </div>
            {article.cover.credit && (
              <figcaption className="mt-2 px-4 text-xs text-muted sm:px-0">{article.cover.credit}</figcaption>
            )}
          </figure>
        )}

        <div className="mx-auto mt-12 max-w-3xl px-4 sm:px-6">
          <ArticleBody markdown={article.body} />
          <SourcesBox sources={article.sources} />

          {article.updatedAt.getTime() - article.publishedAt.getTime() > 60 * 60_000 && (
            <p className="mt-8 text-xs text-muted">Updated {formatDateTime(article.updatedAt)}</p>
          )}

          {article.tags.length > 0 && (
            <ul className="mt-10 flex flex-wrap gap-2" aria-label="Topics">
              {article.tags.map((tag) => (
                <li key={tag.slug}>
                  <Link href={paths.tag(tag.slug)} className="kicker block border border-line px-3 py-2 text-muted hover:border-lime hover:text-lime">
                    {tag.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-12 flex flex-col gap-4 bg-lime px-6 py-6 text-charcoal sm:flex-row sm:items-center sm:justify-between">
            <p className="headline text-3xl">Know someone who argued about this?</p>
            <ShareBarOnLime url={url} title={article.title} />
          </div>

          {article.author?.bio && (
            <aside className="mt-12 border-t border-line pt-6">
              <p className="kicker text-muted">About the author</p>
              <p className="mt-2 font-semibold text-bone">{article.author.name}</p>
              <p className="mt-1 text-sm text-muted">{article.author.bio}</p>
            </aside>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="mx-auto mt-24 max-w-7xl px-4 sm:px-6">
          <SectionHeading>Read next</SectionHeading>
          <ArticleGrid articles={related} />
        </section>
      )}
    </>
  );
}

function ShareBarOnLime({ url, title }: { url: string; title: string }) {
  return (
    <a
      href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="kicker shrink-0 bg-charcoal px-5 py-3 text-lime hover:text-bone"
    >
      Send it to them →
    </a>
  );
}

function jsonLd(article: Article, url: string): string {
  const data = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.dek,
    mainEntityOfPage: url,
    datePublished: article.publishedAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    articleSection: article.category.name,
    keywords: article.tags.map((t) => t.name).join(", ") || undefined,
    image: article.cover ? [article.cover.url] : undefined,
    author: article.author ? { "@type": "Person", name: article.author.name } : { "@type": "Organization", name: site.name },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: new URL("/brand/mark.png", siteUrl()).toString() },
    },
  };
  // Escape "<" so a title can never close the script tag.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function ArticleSkeleton() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse px-4 pt-16 sm:px-6" aria-busy="true" aria-label="Loading">
      <div className="h-3 w-24 bg-graphite" />
      <div className="mt-5 h-14 w-full bg-graphite" />
      <div className="mt-3 h-14 w-2/3 bg-graphite" />
      <div className="mt-6 h-5 w-5/6 bg-graphite-2" />
      <div className="mt-10 aspect-[16/9] w-full bg-graphite" />
    </div>
  );
}

export default function ArticlePage({ params }: Props) {
  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <ArticleView params={params} />
    </Suspense>
  );
}
