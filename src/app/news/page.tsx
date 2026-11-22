import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ListingPage } from "@/components/templates/listing-page";
import { ListingSkeleton } from "@/components/templates/listing-skeleton";
import { getLatestPage, parsePageNumber } from "@/modules/news";
import { paths } from "@/lib/site";

export const metadata: Metadata = {
  title: "Latest",
  description: "Every story, newest first.",
  alternates: { canonical: paths.latest() },
};

async function Latest({ searchParams }: Pick<PageProps<"/news">, "searchParams">) {
  const page = parsePageNumber((await searchParams).page);
  const articles = page === null ? null : await getLatestPage(page);
  if (!articles) notFound();
  return <ListingPage kicker="All stories" title="Latest" articles={articles} pageHref={paths.latest} />;
}

export default function LatestPage(props: PageProps<"/news">) {
  return (
    <Suspense fallback={<ListingSkeleton />}>
      <Latest searchParams={props.searchParams} />
    </Suspense>
  );
}
