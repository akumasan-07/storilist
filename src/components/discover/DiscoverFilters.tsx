"use client";

import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronDown,
  X,
  Check,
  RotateCcw,
  Compass,
  Sparkles,
  BookOpen,
  Clapperboard,
  Tv,
  BookText,
} from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";

export type DiscoverSortOption = "rating" | "title" | "year-desc" | "year-asc";

const CATEGORY_TABS = [
  { key: "all", label: "All Formats", icon: Compass },
  { key: "anime", label: "Anime", icon: Sparkles },
  { key: "comics", label: "Comics", icon: BookOpen },
  { key: "movies", label: "Movies", icon: Clapperboard },
  { key: "series", label: "Series", icon: Tv },
  { key: "novels", label: "Novels", icon: BookText },
];

const GENRE_OPTIONS = [
  "All Genres",
  "Action",
  "Fantasy",
  "Sci-Fi",
  "Drama",
  "Supernatural",
  "Adventure",
  "Mystery",
];

const SORT_OPTIONS: { value: DiscoverSortOption; label: string }[] = [
  { value: "rating", label: "Top Rated" },
  { value: "title", label: "Title (A–Z)" },
  { value: "year-desc", label: "Newest First" },
  { value: "year-asc", label: "Oldest First" },
];

interface DiscoverFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedGenre: string;
  onSelectGenre: (genre: string) => void;
  sortBy: DiscoverSortOption;
  onSortChange: (sort: DiscoverSortOption) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  isFiltered: boolean;
  onResetFilters: () => void;
}

export default function DiscoverFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  selectedGenre,
  onSelectGenre,
  sortBy,
  onSortChange,
  showFilters,
  onToggleFilters,
  isFiltered,
  onResetFilters,
}: DiscoverFiltersProps) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = useClickOutside<HTMLDivElement>(() => setIsSortOpen(false), isSortOpen);

  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label || "Top Rated";

  return (
    <>
      {/* Prominent Search Bar */}
      <div className="mt-6">
        <div className="group relative flex items-center rounded-2xl border border-border bg-card p-1.5 shadow-sm transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
          <div className="pointer-events-none flex items-center pl-3.5 text-subtle-foreground">
            <Search className="h-4 w-4" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search media catalog"
            placeholder="Search by title, creator, studio, or genre..."
            className="w-full bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-subtle-foreground focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search input"
              className="rounded-lg p-1.5 text-subtle-foreground hover:bg-muted hover:text-foreground transition-colors mr-1"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            onClick={onToggleFilters}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${showFilters
                ? "border-primary bg-primary text-primary-foreground shadow-xs"
                : "border-border bg-card text-foreground hover:bg-muted"
              }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Filters</span>
            {selectedGenre !== "All Genres" && (
              <span className="flex h-1.5 w-1.5 rounded-full bg-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Format Tabs & Controls Bar */}
      <div className="mt-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-3">
          {/* Format Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORY_TABS.map((tab) => {
              const TabIcon = tab.icon;
              const isSelected = selectedCategory === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => onSelectCategory(tab.key)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${isSelected
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                >
                  <TabIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sort & Quick Reset Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Sort Dropdown */}
            <div className="relative" ref={sortDropdownRef}>
              <button
                type="button"
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground shadow-2xs hover:bg-muted transition-colors cursor-pointer"
              >
                <ArrowUpDown className="h-3.5 w-3.5 text-subtle-foreground" aria-hidden="true" />
                <span>Sort: {currentSortLabel}</span>
                <ChevronDown className="h-3.5 w-3.5 text-subtle-foreground" aria-hidden="true" />
              </button>

              {isSortOpen && (
                <div className="absolute right-0 z-20 mt-1.5 w-44 rounded-xl border border-border bg-card p-1 shadow-lg animate-in fade-in zoom-in-95 duration-100">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onSortChange(opt.value);
                        setIsSortOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      <span>{opt.label}</span>
                      {sortBy === opt.value && (
                        <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reset filter affordance */}
            {isFiltered && (
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex items-center gap-1 rounded-xl border border-border bg-card px-2.5 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                title="Reset all filters"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Expandable Genre Chips */}
        {showFilters && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border-subtle">
            <span className="text-xs font-medium text-muted-foreground mr-1">Filter Genre:</span>
            {GENRE_OPTIONS.map((genre) => {
              const isSelected = selectedGenre === genre;
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => onSelectGenre(genre)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${isSelected
                      ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                      : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
