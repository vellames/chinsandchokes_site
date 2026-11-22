import Link from "next/link";

export function Pagination({ page, pageCount, href }: { page: number; pageCount: number; href: (page: number) => string }) {
  if (pageCount <= 1) return null;
  const linkClass = "kicker border border-line px-4 py-3 text-bone hover:border-lime hover:text-lime";
  return (
    <nav aria-label="Pagination" className="mt-16 flex items-center justify-between gap-4 border-t border-line pt-8">
      {page > 1 ? (
        <Link href={href(page - 1)} className={linkClass} rel="prev">
          ← Newer
        </Link>
      ) : (
        <span />
      )}
      <span className="kicker text-muted">
        Page {page} of {pageCount}
      </span>
      {page < pageCount ? (
        <Link href={href(page + 1)} className={linkClass} rel="next">
          Older →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
