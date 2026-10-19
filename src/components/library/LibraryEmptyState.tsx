import Link from "next/link";
import { Library, RotateCcw, Compass } from "lucide-react";

interface LibraryEmptyStateProps {
  isFiltered: boolean;
  onResetFilters: () => void;
}

export default function LibraryEmptyState({
  isFiltered,
  onResetFilters,
}: LibraryEmptyStateProps) {
  return (
    <div className="mt-12 rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-subtle-foreground">
        <Library className="h-6 w-6" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-base font-bold text-foreground">No matching titles found</h2>
      <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground leading-relaxed">
        {isFiltered
          ? "No entries in your library matched the selected filters. Try broadening your keywords or resetting filters."
          : "Your library is currently empty. Explore the discover catalog to add anime, comics, movies, series, or novels to your tracker."}
      </p>
      <div className="mt-5 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary-hover transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Reset All Filters</span>
        </button>
        <Link
          href="/discover"
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
        >
          <Compass className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          <span>Explore Discover</span>
        </Link>
      </div>
    </div>
  );
}
