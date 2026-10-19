import Container from "@/components/Container";

export default function TitleLoading() {
  return (
    <div className="py-8 sm:py-12 animate-pulse">
      <Container>
        {/* Navigation Bar Skeleton */}
        <div className="mb-6 flex items-center justify-between">
          <div className="h-4 w-28 rounded-md bg-muted" />
        </div>

        {/* Hero Card Skeleton */}
        <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 md:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row gap-5 sm:gap-8 md:gap-10">
            {/* Poster Skeleton */}
            <div className="w-40 sm:w-56 md:w-64 shrink-0 mx-auto md:mx-0">
              <div className="aspect-[2/3] w-full rounded-2xl bg-muted" />
            </div>

            {/* Details Skeleton */}
            <div className="flex flex-1 flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-16 rounded-md bg-muted" />
                  <div className="h-4 w-20 rounded-md bg-muted" />
                </div>
                <div className="h-8 w-3/4 rounded-lg bg-muted" />
                <div className="h-4 w-1/2 rounded-md bg-muted" />
                <div className="h-10 w-full rounded-xl bg-muted/60" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 rounded-lg bg-muted" />
                  <div className="h-6 w-20 rounded-lg bg-muted" />
                  <div className="h-6 w-14 rounded-lg bg-muted" />
                </div>
              </div>

              {/* Action Box Skeleton */}
              <div className="h-20 w-full rounded-2xl bg-muted/40" />
            </div>
          </div>
        </div>

        {/* Body Content Skeleton */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 space-y-3">
              <div className="h-5 w-24 rounded-md bg-muted" />
              <div className="h-4 w-full rounded-md bg-muted" />
              <div className="h-4 w-5/6 rounded-md bg-muted" />
              <div className="h-4 w-4/6 rounded-md bg-muted" />
            </div>
          </div>
          <div>
            <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 space-y-4">
              <div className="h-5 w-28 rounded-md bg-muted" />
              <div className="h-4 w-full rounded-md bg-muted" />
              <div className="h-4 w-full rounded-md bg-muted" />
              <div className="h-4 w-3/4 rounded-md bg-muted" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
