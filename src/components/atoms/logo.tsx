import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

export function Logo({ className = "h-7 w-auto" }: { className?: string }) {
  return (
    <Link href="/" aria-label={`${site.name} — home`} className="inline-flex shrink-0 items-center">
      <Image src="/brand/wordmark.png" alt={site.name} width={800} height={190} priority className={className} />
    </Link>
  );
}
