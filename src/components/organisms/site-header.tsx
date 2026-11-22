import Link from "next/link";
import { getNavigation } from "@/modules/news";
import { paths, site } from "@/lib/site";
import { Logo } from "../atoms/logo";

export async function SiteHeader() {
  const categories = await getNavigation();
  const links = [{ href: paths.latest(), label: "Latest" }, ...categories.map((c) => ({ href: paths.category(c.slug), label: c.name }))];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-charcoal/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
        <Logo className="h-8 w-auto sm:h-10" />
        <p className="kicker hidden text-lime lg:block">{site.tagline}</p>
      </div>
      <nav aria-label="Sections" className="border-t border-line">
        <ul className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-4 py-3 [scrollbar-width:none] sm:px-6">
          {links.map((link) => (
            <li key={link.href} className="shrink-0">
              <Link href={link.href} className="kicker text-muted transition-colors hover:text-lime">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
