import { formatDate } from "@/lib/dates";

export function ArticleMeta({
  publishedAt,
  readingMinutes,
  authorName,
  className = "",
}: {
  publishedAt: Date;
  readingMinutes: number;
  authorName?: string | null;
  className?: string;
}) {
  return (
    <p className={`flex flex-wrap items-center gap-x-2 text-xs text-muted ${className}`}>
      {authorName && (
        <>
          <span className="font-medium text-bone">{authorName}</span>
          <span aria-hidden>·</span>
        </>
      )}
      <time dateTime={publishedAt.toISOString()}>{formatDate(publishedAt)}</time>
      <span aria-hidden>·</span>
      <span>{readingMinutes} min read</span>
    </p>
  );
}
