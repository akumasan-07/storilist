import { Search, RotateCcw } from "lucide-react";

interface DiscoverEmptyStateProps {
  searchQuery: string;
  onResetFilters: () => void;
}

export default function DiscoverEmptyState({
  searchQuery,
  onResetFilters,
}: DiscoverEmptyStateProps) {
  return (
    <div className="mt-12 rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-subtle-foreground">
        <Search className="h-6 w-6" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-base font-bold text-foreground">No matching stories found</h2>
      <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground leading-relaxed">
        No titles matched your current filters
        {searchQuery ? ` for "${searchQuery}"` : ""}. Try adjusting your keywords or clearing
        active filters.
      </p>
      <button
        type="button"
        onClick={onResetFilters}
        className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary-hover transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
      >
        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Reset All Filters</span>
      </button>
    </div>
  );
}
