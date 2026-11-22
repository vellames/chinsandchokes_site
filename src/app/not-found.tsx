import Link from "next/link";
import { Kicker } from "@/components/atoms/kicker";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
      <Kicker rule={false}>404</Kicker>
      <h1 className="headline mt-4 text-6xl text-bone sm:text-8xl">
        Tapped <span className="text-lime">out</span>
      </h1>
      <p className="mt-4 text-muted">This page doesn&apos;t exist, or the story was taken down.</p>
      <Link href="/" className="kicker mt-10 inline-block bg-lime px-6 py-4 text-charcoal hover:bg-bone">
        Back to the front page
      </Link>
    </div>
  );
}
