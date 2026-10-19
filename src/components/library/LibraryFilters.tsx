"use client";

import { useState } from "react";
import {
  Library,
  Clock,
  Bookmark,
  CheckCircle2,
  Ban,
  Search,
  X,
  ChevronDown,
  ArrowUpDown,
  Check,
  RotateCcw,
} from "lucide-react";
import { LibrarySortOption, LibraryStatus, MediaCategory } from "@/types/library";
import { LibraryStatsData } from "./LibraryStats";
import { useClickOutside } from "@/hooks/useClickOutside";

const STATUS_TABS: { key: "All" | LibraryStatus; label: string; icon: typeof Library }[] = [
  { key: "All", label: "All Titles", icon: Library },
  { key: "In Progress", label: "In Progress", icon: Clock },
  { key: "Planned", label: "Planned", icon: Bookmark },
  { key: "Completed", label: "Completed", icon: CheckCircle2 },
  { key: "Dropped", label: "Dropped", icon: Ban },
];

const SORT_OPTIONS: { value: LibrarySortOption; label: string }[] = [
  { value: "recent", label: "Recently Updated" },
  { value: "progress", label: "Highest Progress" },
  { value: "rating", label: "Highest Rated" },
  { value: "title", label: "Title (A–Z)" },
];

const CATEGORY_FILTER_OPTIONS: { value: "All" | MediaCategory; label: string }[] = [
  { value: "All", label: "All Categories" },
  { value: "Anime", label: "Anime" },
  { value: "Comics", label: "Comics" },
  { value: "Movies", label: "Movies" },
  { value: "Series", label: "Series" },
  { value: "Novels", label: "Novels" },
];

interface LibraryFiltersProps {
  selectedStatus: "All" | LibraryStatus;
  onSelectStatus: (status: "All" | LibraryStatus) => void;
  selectedCategory: "All" | MediaCategory;
  onSelectCategory: (category: "All" | MediaCategory) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: LibrarySortOption;
  onSortChange: (sort: LibrarySortOption) => void;
  stats: LibraryStatsData;
  isFiltered: boolean;
  onResetFilters: () => void;
}

export default function LibraryFilters({
  selectedStatus,
  onSelectStatus,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  stats,
  isFiltered,
  onResetFilters,
}: LibraryFiltersProps) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const sortDropdownRef = useClickOutside<HTMLDivElement>(() => setIsSortOpen(false), isSortOpen);
  const categoryDropdownRef = useClickOutside<HTMLDivElement>(() => setIsCategoryOpen(false), isCategoryOpen);

  const currentCategoryLabel =
    CATEGORY_FILTER_OPTIONS.find((opt) => opt.value === selectedCategory)?.label || "All Categories";
  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label || "Recently Updated";

  return (
    <>
      {/* Status Tabs Navigation */}
      <div className="mt-8 border-b border-border">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-px no-scrollbar" aria-label="Library Status Tabs">
          {STATUS_TABS.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = selectedStatus === tab.key;
            const count =
              tab.key === "All"
                ? stats.total
                : tab.key === "In Progress"
                  ? stats.inProgress
                  : tab.key === "Completed"
                    ? stats.completed
                    : tab.key === "Planned"
                      ? stats.planned
                      : stats.dropped;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onSelectStatus(tab.key)}
                className={`inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:border-border-strong hover:text-foreground"
                  }`}
              >
                <TabIcon className="h-4 w-4" aria-hidden="true" />
                <span>{tab.label}</span>
                <span
                  className={`ml-1 rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-bold ${isActive
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground"
                    }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Filter Bar & Controls */}
      <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-subtle-foreground">
            <Search className="h-4 w-4" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, creator, studio, notes..."
            aria-label="Search your library"
            className="w-full rounded-xl border border-border bg-card py-2 pl-9 pr-9 text-xs sm:text-sm text-foreground placeholder:text-subtle-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search text"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-subtle-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Controls: Category Filter & Sort dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <div className="relative" ref={categoryDropdownRef}>
            <button
              type="button"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold shadow-2xs transition-colors cursor-pointer ${selectedCategory !== "All"
                  ? "border-primary bg-primary-subtle text-primary-subtle-foreground"
                  : "border-border bg-card text-foreground hover:bg-muted"
                }`}
            >
              <span>Category: {currentCategoryLabel}</span>
              <ChevronDown className="h-3.5 w-3.5 text-subtle-foreground" aria-hidden="true" />
            </button>

            {isCategoryOpen && (
              <div className="absolute right-0 sm:left-0 z-20 mt-1.5 w-48 rounded-xl border border-border bg-card p-1 shadow-lg animate-in fade-in zoom-in-95 duration-100">
                {CATEGORY_FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onSelectCategory(opt.value);
                      setIsCategoryOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    <span>{opt.label}</span>
                    {selectedCategory === opt.value && (
                      <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

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

          {/* Reset Filter Button if active */}
          {isFiltered && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 rounded-xl border border-border bg-card px-2.5 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              title="Reset filters"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
