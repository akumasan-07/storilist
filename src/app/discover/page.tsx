"use client";

import { useState, useMemo, useEffect, Suspense, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Container from "@/components/Container";
import { MediaItem } from "@/types/media";
import { SAMPLE_MEDIA_ITEMS } from "@/data/sampleMedia";
import { useLibrary } from "@/context/LibraryContext";
import { createEntryFromMedia } from "@/lib/library";
import DiscoverFilters, { DiscoverSortOption } from "@/components/discover/DiscoverFilters";
import DiscoverCard from "@/components/discover/DiscoverCard";
import DiscoverEmptyState from "@/components/discover/DiscoverEmptyState";

function parseSortOption(val: string | null): DiscoverSortOption {
  if (val === "title" || val === "year-desc" || val === "year-asc" || val === "rating") {
    return val;
  }
  return "rating";
}

function DiscoverContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const urlQ = searchParams.get("q") || "";
  const selectedCategory = searchParams.get("category")?.toLowerCase() || "all";
  const selectedGenre = searchParams.get("genre") || "All Genres";
  const sortBy = parseSortOption(searchParams.get("sort"));

  const { entries, saveEntry, removeEntry } = useLibrary();

  // Local state for search query to ensure instant typing response
  const [searchQuery, setSearchQuery] = useState(urlQ);
  const [prevUrlQ, setPrevUrlQ] = useState(urlQ);
  const [showFilters, setShowFilters] = useState(() => selectedGenre !== "All Genres");

  // Sync local search input if URL search param changes from external navigation (e.g. Back/Forward)
  if (prevUrlQ !== urlQ) {
    setPrevUrlQ(urlQ);
    setSearchQuery(urlQ);
  }

  // Update URL helper that preserves other query params and omits default values
  const updateQueryParam = useCallback(
    (key: string, value: string, defaultValue: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== defaultValue) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  // Debounce search query sync to URL (prevents history spam and typing stutter)
  useEffect(() => {
    const handler = setTimeout(() => {
      const currentUrlQ = searchParams.get("q") || "";
      const trimmed = searchQuery.trim();
      if (trimmed !== currentUrlQ) {
        const params = new URLSearchParams(searchParams.toString());
        if (trimmed) {
          params.set("q", trimmed);
        } else {
          params.delete("q");
        }
        const qs = params.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery, searchParams, pathname, router]);

  const handleSelectCategory = (cat: string) => {
    updateQueryParam("category", cat, "all");
  };

  const handleSelectGenre = (genre: string) => {
    updateQueryParam("genre", genre, "All Genres");
  };

  const handleSelectSort = (sort: DiscoverSortOption) => {
    updateQueryParam("sort", sort, "rating");
  };

  const handleSelectGenreFromCard = (genre: string) => {
    setShowFilters(true);
    handleSelectGenre(genre);
  };

  const resetFilters = () => {
    setSearchQuery("");
    router.replace(pathname, { scroll: false });
  };

  // Derive trackedIds from the shared library context
  const trackedIds = useMemo(() => new Set(entries.map((e) => e.mediaId)), [entries]);

  // Filter and sort items based on active inputs
  const filteredItems = useMemo(() => {
    let items = SAMPLE_MEDIA_ITEMS;

    // Filter by category
    if (selectedCategory !== "all") {
      items = items.filter((item) => item.category.toLowerCase() === selectedCategory);
    }

    // Filter by genre
    if (selectedGenre !== "All Genres") {
      items = items.filter((item) =>
        item.genres.some((g) => g.toLowerCase() === selectedGenre.toLowerCase())
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.studio.toLowerCase().includes(q) ||
          item.format.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.genres.some((g) => g.toLowerCase().includes(q)) ||
          item.synopsis.toLowerCase().includes(q)
      );
    }

    // Sort items using typed numbers
    return [...items].sort((a, b) => {
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "year-desc") {
        return b.startYear - a.startYear;
      }
      if (sortBy === "year-asc") {
        return a.startYear - b.startYear;
      }
      return 0;
    });
  }, [selectedCategory, selectedGenre, searchQuery, sortBy]);

  const toggleTrack = (item: MediaItem) => {
    if (trackedIds.has(item.id)) {
      removeEntry(item.id);
    } else {
      saveEntry(createEntryFromMedia(item));
    }
  };

  const isFiltered =
    searchQuery.trim() !== "" || selectedCategory !== "all" || selectedGenre !== "All Genres";

  return (
    <div className="py-8 sm:py-12">
      <Container>
        {/* Page Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Discover Stories
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            Explore curated highlights across anime, comics, movies, series, and novels.
          </p>
        </div>

        {/* Filter & Controls Bar */}
        <DiscoverFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          selectedGenre={selectedGenre}
          onSelectGenre={handleSelectGenre}
          sortBy={sortBy}
          onSortChange={handleSelectSort}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          isFiltered={isFiltered}
          onResetFilters={resetFilters}
        />

        {/* Cards Grid or Empty State */}
        {filteredItems.length === 0 ? (
          <DiscoverEmptyState searchQuery={searchQuery} onResetFilters={resetFilters} />
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-5">
            {filteredItems.map((item) => (
              <DiscoverCard
                key={item.id}
                item={item}
                isTracked={trackedIds.has(item.id)}
                onToggleTrack={toggleTrack}
                onSelectGenre={handleSelectGenreFromCard}
              />
            ))}
          </div>
        )}

        {/* Discovery Footer Note */}
        <div className="mt-12 rounded-2xl border border-border bg-card p-6 text-center sm:p-8">
          <h2 className="text-base font-bold text-foreground">
            Looking for something specific?
          </h2>
          <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
            StoriList catalogs narrative works across five mediums. Advanced multi-database search and full library synchronization are coming soon.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl border border-border-strong bg-muted-surface px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Back to Overview
            </Link>
            <Link
              href="/library"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Open My Library
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center text-sm text-muted-foreground">
          Loading catalog...
        </div>
      }
    >
      <DiscoverContent />
    </Suspense>
  );
}
