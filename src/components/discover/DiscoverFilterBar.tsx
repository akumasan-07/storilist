"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import DiscoverFilters from "./DiscoverFilters";
import type { DiscoverSortOption } from "@/lib/discover";

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

  // Debounce search query sync to URL
  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmed = searchQuery.trim();
      const currentQ = searchParams.get("q") || "";
      if (trimmed !== currentQ) {
        updateParam("q", trimmed, "");
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery, searchParams, updateParam]);

  const selectedCategory = searchParams.get("category") || initialCategory;
  const selectedGenre = searchParams.get("genre") || initialGenre;
  const sortBy = (searchParams.get("sort") as DiscoverSortOption) || initialSort;

  const handleSelectCategory = (cat: string) => {
    updateParam("category", cat, "all");
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
