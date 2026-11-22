/** Public site settings. Audience-facing copy stays in English (AGENTS.md). */
export const site = {
  name: "Chins & Chokes",
  tagline: "From striking to grappling",
  description:
    "Fight news and breakdowns for curious fans — what happened in the cage, on the mat and in the ring, and why it mattered.",
  /** Audience is mostly in the US: times are shown in Eastern Time (persona/guideline.md). */
  timeZone: "America/New_York",
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/chinsandchokes" },
    { label: "YouTube", href: "https://www.youtube.com/@chinsandchokes" },
    { label: "TikTok", href: "https://www.tiktok.com/@chinsandchokes" },
  ],
} as const;

/** Absolute origin of the site, for canonical URLs, the sitemap, the feed and Open Graph. */
export function siteUrl(): URL {
  const explicit = process.env["NEXT_PUBLIC_SITE_URL"];
  if (explicit) return new URL(explicit);
  const vercel = process.env["VERCEL_PROJECT_PRODUCTION_URL"];
  if (vercel) return new URL(`https://${vercel}`);
  return new URL("http://localhost:3000");
}

export const paths = {
  home: () => "/",
  latest: (page = 1) => (page > 1 ? `/news?page=${page}` : "/news"),
  article: (slug: string) => `/news/${slug}`,
  category: (slug: string, page = 1) => (page > 1 ? `/category/${slug}?page=${page}` : `/category/${slug}`),
  tag: (slug: string, page = 1) => (page > 1 ? `/tag/${slug}?page=${page}` : `/tag/${slug}`),
  feed: () => "/feed.xml",
};
