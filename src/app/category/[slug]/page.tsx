import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ListingPage } from "@/components/templates/listing-page";
import { ListingSkeleton } from "@/components/templates/listing-skeleton";
import { getCategoryPage, getNavigation, parsePageNumber } from "@/modules/news";
import { paths } from "@/lib/site";

type Props = PageProps<"/category/[slug]">;

export async function generateStaticParams() {
  const categories = await getNavigation();
  // Cache Components needs at least one entry; an unknown slug simply renders the 404.
  return categories.length > 0 ? categories.map(({ slug }) => ({ slug })) : [{ slug: "news" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getCategoryPage(slug, 1);
  if (!result) return {};
  return {
    title: result.category.name,
    description: result.category.description ?? undefined,
    alternates: { canonical: paths.category(slug) },
  };
}

async function Category({ params, searchParams }: Props) {
  const { slug } = await params;
  const page = parsePageNumber((await searchParams).page);
  const result = page === null ? null : await getCategoryPage(slug, page);
  if (!result) notFound();
  return (
    <ListingPage
      kicker="Section"
      title={result.category.name}
      description={result.category.description}
      articles={result.articles}
      pageHref={(p) => paths.category(slug, p)}
    />
  );
}

export default function CategoryPage(props: Props) {
  return (
    <Suspense fallback={<ListingSkeleton />}>
      <Category {...props} />
    </Suspense>
  );
}
