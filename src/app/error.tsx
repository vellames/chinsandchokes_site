"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
      <p className="kicker text-lime">Something went wrong</p>
      <h1 className="headline mt-4 text-6xl text-bone">Stand-up called</h1>
      <p className="mt-4 text-muted">We couldn&apos;t load this page. Try again in a moment.</p>
      <button type="button" onClick={reset} className="kicker mt-10 bg-lime px-6 py-4 text-charcoal hover:bg-bone">
        Try again
      </button>
    </div>
  );
}
