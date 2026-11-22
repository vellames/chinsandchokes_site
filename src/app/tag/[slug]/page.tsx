import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ListingPage } from "@/components/templates/listing-page";
import { ListingSkeleton } from "@/components/templates/listing-skeleton";
import { getTagPage, parsePageNumber } from "@/modules/news";
import { paths } from "@/lib/site";

type Props = PageProps<"/tag/[slug]">;

export function generateStaticParams() {
  // Tags are rendered on first visit; Cache Components needs at least one entry.
  return [{ slug: "ufc" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getTagPage(slug, 1);
  if (!result) return {};
  return { title: result.tag.name, alternates: { canonical: paths.tag(slug) } };
}

async function Tag({ params, searchParams }: Props) {
  const { slug } = await params;
  const page = parsePageNumber((await searchParams).page);
  const result = page === null ? null : await getTagPage(slug, page);
  if (!result) notFound();
  return (
    <ListingPage kicker="Topic" title={result.tag.name} articles={result.articles} pageHref={(p) => paths.tag(slug, p)} />
  );
}

export default function TagPage(props: Props) {
  return (
    <Suspense fallback={<ListingSkeleton />}>
      <Tag {...props} />
    </Suspense>
  );
}
