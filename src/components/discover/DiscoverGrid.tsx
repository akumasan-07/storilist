"use client";

import { useMemo, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MediaItem } from "@/types/media";
import { useLibrary } from "@/context/LibraryContext";
import DiscoverCard from "./DiscoverCard";

interface DiscoverGridProps {
  items: MediaItem[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export default function DiscoverGrid({
  items,
  page,
  totalPages,
  totalResults,
}: DiscoverGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const { entries, quickTrack, removeEntry } = useLibrary();

  const trackedIds = useMemo(
    () => new Set(entries.map((e) => e.mediaId)),
    [entries]
  );

  const handleToggleTrack = (item: MediaItem) => {
    if (trackedIds.has(item.id)) {
      removeEntry(item.id);
    } else {
      quickTrack(item);
    }
  };

  const handleSelectGenre = (genre: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("genre", genre);
      params.delete("page");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  };

  const navigateToPage = (newPage: number) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (newPage > 1) {
        params.set("page", String(newPage));
      } else {
        params.delete("page");
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  };

  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="mt-8 space-y-8">
      {/* Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-5">
        {items.map((item) => (
          <DiscoverCard
            key={item.id}
            item={item}
            isTracked={trackedIds.has(item.id)}
            onToggleTrack={handleToggleTrack}
            onSelectGenre={handleSelectGenre}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground">
        <div>
          <span>
            Page <strong className="text-foreground">{page}</strong> of{" "}
            <strong className="text-foreground">{totalPages}</strong>
          </span>
          {totalResults > 0 && (
            <span className="ml-1.5 hidden sm:inline text-subtle-foreground">
              ({totalResults.toLocaleString()} total titles)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasPrevious && (
            <button
              type="button"
              onClick={() => navigateToPage(page - 1)}
              className="inline-flex items-center gap-1 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground shadow-2xs hover:bg-muted transition-colors cursor-pointer min-h-[36px]"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              <span>Previous</span>
            </button>
          )}

          {hasNext && (
            <button
              type="button"
              onClick={() => navigateToPage(page + 1)}
              className="inline-flex items-center gap-1 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground shadow-2xs hover:bg-muted transition-colors cursor-pointer min-h-[36px]"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
