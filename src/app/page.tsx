import Link from "next/link";
import { Kicker } from "@/components/atoms/kicker";
import { ArticleCard } from "@/components/molecules/article-card";
import { SectionHeading } from "@/components/molecules/section-heading";
import { ArticleGrid } from "@/components/organisms/article-grid";
import { EmptyState } from "@/components/organisms/empty-state";
import { LeadStory } from "@/components/organisms/lead-story";
import { getHome } from "@/modules/news";
import { paths, site } from "@/lib/site";

const GRID_COUNT = 6;

export default async function HomePage() {
  const { lead, latest, hasMore } = await getHome();

  if (!lead) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <EmptyState title="First stories are on the way">
          {site.description}
        </EmptyState>
      </div>
    );
  }

  const grid = latest.slice(0, GRID_COUNT);
  const more = latest.slice(GRID_COUNT);

  return (
    <>
      <LeadStory article={lead} />

      {grid.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
          <SectionHeading>Latest</SectionHeading>
          <ArticleGrid articles={grid} />
        </section>
      )}

      <FollowBand />

      {more.length > 0 && (
        <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
          <SectionHeading>More stories</SectionHeading>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {more.map((article) => (
              <ArticleCard key={article.id} article={article} variant="compact" />
            ))}
          </div>
        </section>
      )}

      {hasMore && (
        <div className="mx-auto mt-14 max-w-7xl px-4 sm:px-6">
          <Link href={paths.latest()} className="kicker inline-block border border-lime px-6 py-4 text-lime hover:bg-lime hover:text-charcoal">
            All stories →
          </Link>
        </div>
      )}
    </>
  );
}

function FollowBand() {
  return (
    <section className="mt-20 border-y border-line bg-graphite-2">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Kicker>Watch the breakdowns</Kicker>
          <p className="headline mt-3 text-4xl text-bone sm:text-5xl">
            The fight in <span className="text-lime">60 seconds</span>
          </p>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Short videos on what changed in the fight and why it mattered.
          </p>
        </div>
        <ul className="flex flex-wrap gap-3">
          {site.socials.map((s) => (
            <li key={s.href}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="kicker block border border-line px-5 py-3 text-bone hover:border-lime hover:text-lime">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
