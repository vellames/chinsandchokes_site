import Link from "next/link";
import type { ReactNode } from "react";

/** Lime label with the brand's short rule: "— BREAKDOWN". */
export function Kicker({ children, href, rule = true }: { children: ReactNode; href?: string; rule?: boolean }) {
  const content = (
    <>
      {rule && <span aria-hidden className="inline-block h-0.5 w-6 bg-lime" />}
      {children}
    </>
  );
  const className = "kicker inline-flex items-center gap-2.5 text-lime";
  return href ? (
    <Link href={href} className={`${className} hover:text-bone`}>
      {content}
    </Link>
  ) : (
    <span className={className}>{content}</span>
  );
}
