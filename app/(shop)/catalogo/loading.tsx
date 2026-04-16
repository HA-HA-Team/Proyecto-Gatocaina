export default function CatalogoLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-8 w-56 bg-stone-200 rounded-lg animate-pulse mb-2" />
        <div className="h-4 w-32 bg-stone-100 rounded animate-pulse" />
      </div>

      {/* Filtros skeleton */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-9 rounded-full bg-stone-100 animate-pulse"
            style={{ width: `${60 + i * 10}px` }}
          />
        ))}
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="aspect-square bg-stone-100 animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-3 w-16 bg-orange-100 rounded animate-pulse" />
              <div className="h-4 w-full bg-stone-100 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-stone-100 rounded animate-pulse" />
              <div className="h-5 w-20 bg-stone-200 rounded animate-pulse mt-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
