export default function ProductoLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="h-5 w-36 bg-stone-100 rounded animate-pulse mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Imagen skeleton */}
        <div className="aspect-square rounded-2xl bg-stone-100 animate-pulse" />

        {/* Info skeleton */}
        <div className="space-y-4">
          <div className="h-4 w-24 bg-orange-100 rounded animate-pulse" />
          <div className="h-9 w-full bg-stone-200 rounded animate-pulse" />
          <div className="h-9 w-2/3 bg-stone-200 rounded animate-pulse" />
          <div className="h-12 w-36 bg-orange-100 rounded animate-pulse" />
          <div className="space-y-2 pt-4">
            <div className="h-4 w-full bg-stone-100 rounded animate-pulse" />
            <div className="h-4 w-full bg-stone-100 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-stone-100 rounded animate-pulse" />
          </div>
          <div className="h-12 w-full bg-orange-200 rounded-lg animate-pulse mt-8" />
        </div>
      </div>
    </div>
  );
}
