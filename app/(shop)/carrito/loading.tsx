export default function CarritoLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="h-9 w-48 bg-stone-200 rounded animate-pulse mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-5 flex gap-4">
              <div className="w-24 h-24 rounded-xl bg-stone-100 animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-stone-100 rounded animate-pulse" />
                <div className="h-4 w-1/4 bg-orange-100 rounded animate-pulse" />
                <div className="h-8 w-32 bg-stone-100 rounded animate-pulse mt-4" />
              </div>
            </div>
          ))}
        </div>
        <div className="card p-6 h-72 animate-pulse bg-stone-50" />
      </div>
    </div>
  );
}
