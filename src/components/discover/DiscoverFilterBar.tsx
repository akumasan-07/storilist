"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import DiscoverFilters from "./DiscoverFilters";
import {
  isSortAllowedForCategory,
  isGenreAllowedForCategory,
  type DiscoverSortOption,
} from "@/lib/discover";

interface DiscoverFilterBarProps {
  initialQuery?: string;
  initialCategory?: string;
  initialGenre?: string;
  initialSort?: DiscoverSortOption;
}

export default function DiscoverFilterBar({
  initialQuery = "",
  initialCategory = "all",
  initialGenre = "All Genres",
  initialSort = "popular",
}: DiscoverFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(
    initialGenre !== "All Genres"
  );

  // Synchronize local search input if URL search query changes externally (e.g. Back/Forward button)
  const currentUrlQ = searchParams.get("q") || "";
  const [prevUrlQ, setPrevUrlQ] = useState(currentUrlQ);

  if (prevUrlQ !== currentUrlQ) {
    setPrevUrlQ(currentUrlQ);
    setSearchQuery(currentUrlQ);
  }

  const updateParam = useCallback(
    (key: string, value: string, defaultValue?: string) => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== defaultValue) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
        // Always reset pagination to page 1 on filter/sort change
        params.delete("page");

        const qs = params.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [searchParams, pathname, router]
  );

  // Debounce search query sync to URL (minimum 3 characters required).
  // Clearing or deleting back below 3 chars removes q from the URL.
  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmed = searchQuery.trim();
      const currentQ = searchParams.get("q") || "";
      const effectiveQ = trimmed.length >= 3 ? trimmed : "";
      if (effectiveQ !== currentQ) {
        updateParam("q", effectiveQ, "");
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery, searchParams, updateParam]);

  const selectedCategory = searchParams.get("category") || initialCategory;
  const rawGenre = searchParams.get("genre") || initialGenre;
  const selectedGenre = isGenreAllowedForCategory(selectedCategory, rawGenre)
    ? rawGenre
    : "All Genres";

  const rawSort = (searchParams.get("sort") as DiscoverSortOption) || initialSort;
  const sortBy: DiscoverSortOption = isSortAllowedForCategory(selectedCategory, rawSort)
    ? rawSort
    : "popular";

  const handleSelectCategory = (cat: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (cat && cat !== "all") {
        params.set("category", cat);
      } else {
        params.delete("category");
      }

      // When the category changes and the current sort isn't available, reset to Popular
      const currentSort = params.get("sort");
      if (currentSort && !isSortAllowedForCategory(cat, currentSort)) {
        params.delete("sort");
      }

      // When the category changes and the current genre isn't available, reset to All Genres
      const currentGenre = params.get("genre");
      if (currentGenre && !isGenreAllowedForCategory(cat, currentGenre)) {
        params.delete("genre");
      }

      params.delete("page");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  };

  const handleSelectGenre = (genre: string) => {
    updateParam("genre", genre, "All Genres");
  };

  const handleSelectSort = (sort: DiscoverSortOption) => {
    updateParam("sort", sort, "popular");
  };

  const resetFilters = () => {
    setSearchQuery("");
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  };

  const isFiltered =
    searchQuery.trim() !== "" ||
    selectedCategory !== "all" ||
    selectedGenre !== "All Genres" ||
    sortBy !== "popular";

  return (
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
      isPending={isPending}
    />
  );
}
