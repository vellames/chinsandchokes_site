export function ListingSkeleton() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 pt-12 sm:px-6 sm:pt-16" aria-busy="true" aria-label="Loading">
      <div className="mb-12 border-b border-line pb-10">
        <div className="h-3 w-24 bg-graphite" />
        <div className="mt-4 h-16 w-2/3 bg-graphite" />
      </div>
      <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i}>
            <div className="aspect-[16/10] bg-graphite" />
            <div className="mt-4 h-8 w-5/6 bg-graphite" />
            <div className="mt-2 h-4 w-full bg-graphite-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
