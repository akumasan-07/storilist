export default function DiscoverSkeletonGrid() {
  return (
    <div
      aria-label="Loading catalog results"
      className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-5 animate-pulse"
    >
      {Array.from({ length: 15 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card/60 p-2.5 sm:p-3 shadow-xs"
        >
          <div>
            {/* 2:3 Vertical Poster Skeleton */}
            <div className="relative aspect-[2/3] w-full rounded-xl bg-muted/80 overflow-hidden" />

            {/* Metadata Skeletons */}
            <div className="mt-2.5 sm:mt-3 space-y-2">
              {/* Title Skeleton */}
              <div className="h-4 w-3/4 rounded bg-muted/80" />

              {/* Studio & Format Skeleton */}
              <div className="h-3 w-1/2 rounded bg-muted/60" />

              {/* Genre Chips Skeleton */}
              <div className="flex gap-1 pt-1">
                <div className="h-4 w-12 rounded bg-muted/60" />
                <div className="h-4 w-10 rounded bg-muted/60" />
              </div>

              {/* Synopsis Skeleton */}
              <div className="space-y-1 pt-1">
                <div className="h-2.5 w-full rounded bg-muted/50" />
                <div className="h-2.5 w-5/6 rounded bg-muted/50" />
              </div>
            </div>
          </div>

          {/* Footer Skeleton */}
          <div className="mt-3 flex items-center justify-between border-t border-border-subtle pt-2.5">
            <div className="h-4 w-8 rounded bg-muted/70" />
            <div className="h-7 w-16 rounded-lg bg-muted/70" />
          </div>
        </div>
      ))}
    </div>
  );
}
