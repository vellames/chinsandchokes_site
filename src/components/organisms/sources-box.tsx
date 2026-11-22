import type { Source } from "@/modules/news";

/** "How we know": the sources behind the reporting (persona: show how you know). */
export function SourcesBox({ sources }: { sources: readonly Source[] }) {
  if (sources.length === 0) return null;
  return (
    <aside className="mt-12 border-l-2 border-lime bg-graphite px-6 py-5">
      <p className="kicker text-lime">How we know</p>
      <ul className="mt-3 space-y-2 text-sm">
        {sources.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="text-bone underline decoration-line underline-offset-4 hover:text-lime hover:decoration-lime">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
