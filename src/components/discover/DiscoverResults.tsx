import { AlertCircle } from "lucide-react";
import { fetchDiscoverCatalogue } from "@/lib/providers/tmdb";
import type { DiscoverSortOption } from "@/lib/discover";
import DiscoverComingSoon from "./DiscoverComingSoon";
import DiscoverErrorState from "./DiscoverErrorState";
import DiscoverEmptyState from "./DiscoverEmptyState";
import DiscoverGrid from "./DiscoverGrid";

export interface ParsedDiscoverParams {
  q?: string;
  category: "all" | "movies" | "series" | "anime" | "comics" | "novels";
  genre?: string;
  sort: DiscoverSortOption;
  page: number;
}

export default async function DiscoverResults({
  params,
}: {
  params: ParsedDiscoverParams;
}) {
  if (
    params.category === "anime" ||
    params.category === "comics" ||
    params.category === "novels"
  ) {
    return <DiscoverComingSoon category={params.category} />;
  }

  const result = await fetchDiscoverCatalogue({
    q: params.q,
    category: params.category,
    genre: params.genre,
    sort: params.sort,
    page: params.page,
  });

  if (!result) {
    return <DiscoverErrorState />;
  }

  if (result.items.length === 0) {
    return <DiscoverEmptyState searchQuery={params.q} />;
  }

  return (
    <div>
      {result.partialNotice && (
        <div
          role="status"
          className="mt-6 flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-xs font-medium text-amber-700 dark:text-amber-300"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
          <span>{result.partialNotice}</span>
        </div>
      )}
      <DiscoverGrid
        items={result.items}
        page={result.page}
        totalPages={result.totalPages}
        totalResults={result.totalResults}
      />
    </div>
  );
}
