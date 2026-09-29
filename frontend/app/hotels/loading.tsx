const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 animate-pulse">
    {/* Image */}
    <div className="h-52 bg-gray-200 w-full" />

    <div className="p-5">
      {/* Title + stars */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="h-5 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-16" />
      </div>

      {/* Location + score */}
      <div className="flex items-center justify-between mb-3">
        <div className="h-3.5 bg-gray-200 rounded w-28" />
        <div className="h-5 bg-gray-200 rounded w-20" />
      </div>

      {/* Amenity tags */}
      <div className="flex gap-1.5 mb-4">
        <div className="h-5 bg-gray-200 rounded-full w-16" />
        <div className="h-5 bg-gray-200 rounded-full w-20" />
        <div className="h-5 bg-gray-200 rounded-full w-14" />
      </div>

      {/* Price + button */}
      <div className="flex items-center justify-between">
        <div className="h-7 bg-gray-200 rounded w-24" />
        <div className="h-8 bg-gray-200 rounded-md w-24" />
      </div>
    </div>
  </div>
);

const HotelsLoading = () => {
  return (
    <section className="min-h-[80vh]">
      {/* Search bar placeholder */}
      <div className="bg-slate-900 py-8">
        <div className="container mx-auto px-4 flex justify-center">
          <div className="h-14 bg-white/10 rounded-xl w-full max-w-3xl animate-pulse" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Results summary */}
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-40 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar skeleton */}
          <div className="lg:w-60 shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-24" />
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-20" />
                </div>
              ))}
              <div className="h-px bg-gray-100 my-2" />
              <div className="h-5 bg-gray-200 rounded w-28" />
              <div className="flex gap-2">
                <div className="h-9 bg-gray-200 rounded w-full" />
                <div className="h-9 bg-gray-200 rounded w-full" />
              </div>
            </div>
          </div>

          {/* Cards grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotelsLoading;
