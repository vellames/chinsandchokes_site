import Link from "next/link";
import { paths, site } from "@/lib/site";
import { Logo } from "../atoms/logo";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-graphite-2">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[2fr_1fr]">
        <div>
          <Logo className="h-10 w-auto" />
          <p className="kicker mt-4 text-lime">{site.tagline}</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">{site.description}</p>
        </div>
        <div>
          <p className="kicker text-muted">Follow</p>
          <ul className="mt-4 space-y-2">
            {site.socials.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-sm text-bone hover:text-lime">
                  {s.label} <span className="text-muted">@chinsandchokes</span>
                </a>
              </li>
            ))}
            <li>
              <Link href={paths.feed()} className="text-sm text-bone hover:text-lime">
                RSS feed
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-muted sm:px-6">
          © {site.name}. Photos are credited on each story.
        </p>
      </div>
    </footer>
  );
}
