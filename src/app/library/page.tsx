"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Library,
  Clock,
  CheckCircle2,
  Bookmark,
  Search,
  X,
  RotateCcw,
  ArrowUpDown,
  ChevronDown,
  Check,
  Star,
  Compass,
  SlidersHorizontal,
  Plus,
  BookOpen,
  Sparkles,
  Clapperboard,
  Tv,
  BookText,
  Ban,
  Layers,
} from "lucide-react";
import Container from "@/components/Container";
import EditLogModal from "@/components/EditLogModal";
import { SAMPLE_LIBRARY_ENTRIES } from "@/data/sampleLibrary";
import { LibraryEntry, LibraryStatus, LibrarySortOption, MediaCategory } from "@/types/library";

const STATUS_TABS: { key: "All" | LibraryStatus; label: string; icon: typeof Library }[] = [
  { key: "All", label: "All Titles", icon: Library },
  { key: "In Progress", label: "In Progress", icon: Clock },
  { key: "Planned", label: "Planned", icon: Bookmark },
  { key: "Completed", label: "Completed", icon: CheckCircle2 },
  { key: "Dropped", label: "Dropped", icon: Ban },
];

const SORT_OPTIONS: { value: LibrarySortOption; label: string }[] = [
  { value: "recent", label: "Recently Added" },
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

const CATEGORY_STYLES: Record<MediaCategory, { badge: string; style: string }> = {
  Anime: { badge: "ANIME", style: "border-accent-anime/40 bg-accent-anime/15 text-accent-anime" },
  Comics: { badge: "COMIC", style: "border-accent-comic/40 bg-accent-comic/15 text-accent-comic" },
  Movies: { badge: "MOVIE", style: "border-accent-movie/40 bg-accent-movie/15 text-accent-movie" },
  Series: { badge: "SERIES", style: "border-accent-series/40 bg-accent-series/15 text-accent-series" },
  Novels: { badge: "NOVEL", style: "border-accent-novel/40 bg-accent-novel/15 text-accent-novel" },
};

const STATUS_BADGE_STYLES: Record<LibraryStatus, string> = {
  "In Progress": "border-primary/40 bg-primary-subtle text-primary-subtle-foreground font-semibold",
  "Completed": "border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold",
  "Planned": "border-sky-500/40 bg-sky-500/15 text-sky-600 dark:text-sky-400 font-semibold",
  "Dropped": "border-border bg-muted text-muted-foreground font-medium",
};

export default function LibraryPage() {
  const [entries, setEntries] = useState<LibraryEntry[]>(SAMPLE_LIBRARY_ENTRIES);
  const [selectedStatus, setSelectedStatus] = useState<"All" | LibraryStatus>("All");
  const [selectedCategory, setSelectedCategory] = useState<"All" | MediaCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<LibrarySortOption>("recent");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const [editingEntry, setEditingEntry] = useState<LibraryEntry | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(target)
      ) {
        setIsSortOpen(false);
      }
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(target)
      ) {
        setIsCategoryOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsSortOpen(false);
        setIsCategoryOpen(false);
      }
    }

    if (isSortOpen || isCategoryOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSortOpen, isCategoryOpen]);

  // Overall statistics for the personal dashboard header
  const stats = useMemo(() => {
    const total = entries.length;
    const inProgress = entries.filter((item) => item.status === "In Progress").length;
    const completed = entries.filter((item) => item.status === "Completed").length;
    const planned = entries.filter((item) => item.status === "Planned").length;
    const dropped = entries.filter((item) => item.status === "Dropped").length;

    const ratedEntries = entries.filter((item) => item.userRating !== null);
    const avgRating =
      ratedEntries.length > 0
        ? (
          ratedEntries.reduce((acc, curr) => acc + (curr.userRating || 0), 0) /
          ratedEntries.length
        ).toFixed(1)
        : null;

    return { total, inProgress, completed, planned, dropped, avgRating };
  }, [entries]);

  // Filtered & Sorted library entries
  const filteredEntries = useMemo(() => {
    let result = entries;

    // Filter by Status Tab
    if (selectedStatus !== "All") {
      result = result.filter((item) => item.status === selectedStatus);
    }

    // Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.studio.toLowerCase().includes(q) ||
          item.format.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          (item.notes && item.notes.toLowerCase().includes(q))
      );
    }

    // Sort entries
    return [...result].sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "progress") {
        const aPercent = a.totalProgress ? (a.currentProgress / a.totalProgress) : 0;
        const bPercent = b.totalProgress ? (b.currentProgress / b.totalProgress) : 0;
        if (bPercent !== aPercent) return bPercent - aPercent;
        return b.currentProgress - a.currentProgress;
      }
      if (sortBy === "rating") {
        const aScore = a.userRating ?? parseFloat(a.communityRating);
        const bScore = b.userRating ?? parseFloat(b.communityRating);
        return bScore - aScore;
      }
      return 0;
    });
  }, [entries, selectedStatus, selectedCategory, searchQuery, sortBy]);

  const handleOpenLogModal = (entry: LibraryEntry) => {
    setEditingEntry(entry);
    setIsLogModalOpen(true);
  };

  const handleSaveEntry = (updatedEntry: LibraryEntry) => {
    const normalizedEntry: LibraryEntry = {
      ...updatedEntry,
      status:
        updatedEntry.status === "Dropped"
          ? "Dropped"
          : updatedEntry.currentProgress === 0
            ? "Planned"
            : updatedEntry.status,
    };
    setEntries((prev) =>
      prev.map((item) => (item.id === normalizedEntry.id ? normalizedEntry : item))
    );
  };

  const handleRemoveEntry = (entryId: string) => {
    setEntries((prev) => prev.filter((item) => item.id !== entryId));
  };

  const resetFilters = () => {
    setSelectedStatus("All");
    setSelectedCategory("All");
    setSearchQuery("");
    setSortBy("recent");
  };

  const isFiltered =
    selectedStatus !== "All" ||
    selectedCategory !== "All" ||
    searchQuery.trim() !== "" ||
    sortBy !== "recent";

  const currentCategoryLabel =
    CATEGORY_FILTER_OPTIONS.find((opt) => opt.value === selectedCategory)?.label || "All Categories";
  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label || "Recently Added";

  return (
    <div className="py-8 sm:py-12">
      <Container>
        {/* =========================================================================
            1. PAGE HEADER & QUICK STATS DASHBOARD
            ========================================================================= */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                My Library
              </h1>
              <p className="mt-1.5 text-sm sm:text-base text-muted-foreground">
                Track your active reading and watchlist progress, manage backlogs, and log personal ratings.
              </p>
            </div>

            <Link
              href="/discover"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-xs hover:bg-muted hover:border-border-strong transition-colors self-start sm:self-auto"
            >
              <Compass className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>Browse Discover</span>
            </Link>
          </div>

          {/* Metric Summary Cards Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {/* Total Tracked */}
            <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
              <div className="flex items-center justify-between text-subtle-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Tracked</span>
                <Library className="h-4 w-4 text-primary" aria-hidden="true" />
              </div>
              <div className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">
                {stats.total}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                Across 5 media formats
              </div>
            </div>

            {/* In Progress */}
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 shadow-xs">
              <div className="flex items-center justify-between text-primary">
                <span className="text-xs font-semibold uppercase tracking-wider">In Progress</span>
                <Clock className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="mt-2 text-2xl font-extrabold text-primary sm:text-3xl">
                {stats.inProgress}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                Actively watching & reading
              </div>
            </div>

            {/* Completed */}
            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-4 shadow-xs">
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="mt-2 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 sm:text-3xl">
                {stats.completed}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                Finished stories
              </div>
            </div>

            {/* Planned Backlog */}
            <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
              <div className="flex items-center justify-between text-subtle-foreground">
                <span className="text-xs font-semibold uppercase tracking-wider">Planned Queue</span>
                <Bookmark className="h-4 w-4 text-sky-500" aria-hidden="true" />
              </div>
              <div className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">
                {stats.planned}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                Waiting in queue
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. STATUS TABS & UTILITY TOOLBAR
            ========================================================================= */}
        <div className="mt-10 flex flex-col gap-4 border-b border-border-subtle pb-4">
          {/* Status Segmentation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {STATUS_TABS.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = selectedStatus === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSelectedStatus(tab.key)}
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${isActive
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

          {/* Search, Sort, and Status Controls Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search within Library */}
            <div className="relative flex-1 max-w-md">
              <div className="group relative flex items-center rounded-xl border border-border bg-card p-1 shadow-2xs transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                <div className="pointer-events-none flex items-center pl-3 text-subtle-foreground">
                  <Search className="h-3.5 w-3.5" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search within library"
                  placeholder="Filter by title, creator, studio, or notes..."
                  className="w-full bg-transparent px-2.5 py-1 text-xs text-foreground placeholder:text-subtle-foreground focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="p-1 text-subtle-foreground hover:text-foreground transition-colors rounded-md mr-1"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Controls: Category, Sort, and Counter */}
            <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 sm:gap-2.5 text-xs">
              <div className="flex items-center gap-2 text-subtle-foreground mr-auto sm:mr-0">
                <span className="font-semibold text-foreground">
                  {filteredEntries.length} {filteredEntries.length === 1 ? "title" : "titles"}
                </span>
                {isFiltered && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline ml-1"
                  >
                    <RotateCcw className="h-3 w-3" aria-hidden="true" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Category Dropdown Filter */}
              <div ref={categoryDropdownRef} className="relative inline-block text-left">
                <button
                  type="button"
                  id="library-category-button"
                  aria-haspopup="listbox"
                  aria-expanded={isCategoryOpen}
                  aria-label={`Filter by category, currently ${currentCategoryLabel}`}
                  onClick={() => {
                    setIsCategoryOpen((prev) => !prev);
                    setIsSortOpen(false);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${selectedCategory !== "All"
                      ? "border-primary bg-primary-subtle text-primary-subtle-foreground font-semibold"
                      : "border-border bg-card text-foreground hover:bg-muted hover:border-border-strong"
                    }`}
                >
                  <Layers className="h-3.5 w-3.5 text-subtle-foreground" aria-hidden="true" />
                  <span className="text-subtle-foreground">Category:</span>
                  <span className="font-semibold text-foreground">
                    {selectedCategory === "All" ? "All" : selectedCategory}
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-subtle-foreground transition-transform duration-200 ${isCategoryOpen ? "rotate-180 text-foreground" : ""
                      }`}
                    aria-hidden="true"
                  />
                </button>

                {/* Dropdown Window Popover */}
                {isCategoryOpen && (
                  <div
                    role="listbox"
                    aria-labelledby="library-category-button"
                    className="absolute right-0 top-full mt-1.5 z-40 w-44 origin-top-right rounded-xl border border-border bg-card p-1.5 shadow-lg shadow-black/10 backdrop-blur-md"
                  >
                    <div className="space-y-0.5">
                      {CATEGORY_FILTER_OPTIONS.map((option) => {
                        const isSelected = selectedCategory === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => {
                              setSelectedCategory(option.value);
                              setIsCategoryOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${isSelected
                                ? "bg-primary/15 text-primary font-semibold"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                              }`}
                          >
                            <span>{option.label}</span>
                            {isSelected && (
                              <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Styled Sort Dropdown Menu */}
              <div ref={sortDropdownRef} className="relative inline-block text-left">
                <button
                  type="button"
                  id="library-sort-button"
                  aria-haspopup="listbox"
                  aria-expanded={isSortOpen}
                  aria-label={`Sort library, currently sorted by ${currentSortLabel}`}
                  onClick={() => {
                    setIsSortOpen((prev) => !prev);
                    setIsCategoryOpen(false);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${isSortOpen
                    ? "border-primary bg-primary-subtle text-primary-subtle-foreground font-semibold"
                    : "border-border bg-card text-foreground hover:bg-muted hover:border-border-strong"
                    }`}
                >
                  <ArrowUpDown className="h-3.5 w-3.5 text-subtle-foreground" aria-hidden="true" />
                  <span className="text-subtle-foreground">Sort:</span>
                  <span className="font-semibold text-foreground">{currentSortLabel}</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-subtle-foreground transition-transform duration-200 ${isSortOpen ? "rotate-180 text-foreground" : ""
                      }`}
                    aria-hidden="true"
                  />
                </button>

                {/* Dropdown Window Popover */}
                {isSortOpen && (
                  <div
                    role="listbox"
                    aria-labelledby="library-sort-button"
                    className="absolute right-0 top-full mt-1.5 z-40 w-44 origin-top-right rounded-xl border border-border bg-card p-1.5 shadow-lg shadow-black/10 backdrop-blur-md"
                  >
                    <div className="space-y-0.5">
                      {SORT_OPTIONS.map((option) => {
                        const isSelected = sortBy === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => {
                              setSortBy(option.value);
                              setIsSortOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${isSelected
                              ? "bg-primary/15 text-primary font-semibold"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                              }`}
                          >
                            <span>{option.label}</span>
                            {isSelected && (
                              <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. LIBRARY COLLECTION GRID & EMPTY STATE
            ========================================================================= */}
        {filteredEntries.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-subtle-foreground">
              <Search className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-base font-bold text-foreground">No matching titles in your library</h2>
            <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground leading-relaxed">
              No entries found in your collection
              {searchQuery ? ` matching "${searchQuery}"` : ""}
              {selectedStatus !== "All" ? ` under status "${selectedStatus}"` : ""}
              {selectedCategory !== "All" ? ` in category "${selectedCategory}"` : ""}. Try adjusting your keywords or clearing
              active filters.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary-hover transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-5">
            {filteredEntries.map((item) => {
              const categoryStyle = CATEGORY_STYLES[item.category];
              const statusBadgeStyle = STATUS_BADGE_STYLES[item.status];

              const progressPercentage = item.totalProgress
                ? Math.min(100, Math.round((item.currentProgress / item.totalProgress) * 100))
                : null;

              return (
                <article
                  key={item.id}
                  className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-3 shadow-xs transition duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md"
                >
                  <div>
                    {/* 2:3 Vertical Poster Container */}
                    <Link
                      href={`/title/${item.id}`}
                      className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-xl"
                      aria-label={`View details for ${item.title}`}
                    >
                      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-muted shadow-inner">
                        <Image
                          src={item.poster}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Gradient shade at bottom for contrast */}
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/65 to-transparent"
                        />

                        {/* Category Badge (Top-Left) */}
                        <div className="absolute top-2 left-2">
                          <span
                            className={`rounded-md border px-1.5 py-0.5 text-[10px] font-bold tracking-wider backdrop-blur-md shadow-xs ${categoryStyle.style}`}
                          >
                            {categoryStyle.badge}
                          </span>
                        </div>

                        {/* Year / Format Badge (Top-Right) */}
                        <div className="absolute top-2 right-2">
                          <span className="rounded-md bg-black/65 px-1.5 py-0.5 text-[10px] font-semibold text-white/95 backdrop-blur-xs shadow-xs">
                            {item.year.slice(0, 4)}
                          </span>
                        </div>

                        {/* Bottom Overlay Status Tag */}
                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                          <span
                            className={`rounded-md border px-2 py-0.5 text-[10px] tracking-wide backdrop-blur-md shadow-xs ${statusBadgeStyle}`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>
                    </Link>

                    {/* Metadata & Progress Content */}
                    <div className="mt-3">
                      <Link
                        href={`/title/${item.id}`}
                        className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded"
                      >
                        <h2
                          className="line-clamp-1 text-sm font-semibold text-foreground group-hover:text-primary transition-colors"
                          title={item.title}
                        >
                          {item.title}
                        </h2>
                      </Link>
                      <p className="mt-0.5 text-xs text-subtle-foreground truncate">
                        {item.studio} &bull; {item.format}
                      </p>

                      {/* Progress Bar & Numerical Counter */}
                      <div className="mt-3 space-y-1.5 rounded-xl border border-border-subtle bg-muted/40 p-2">
                        {item.totalProgress !== null ? (
                          <>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-semibold text-foreground">
                                {item.currentProgress} / {item.totalProgress} {item.progressUnit}
                              </span>
                              <span className="text-[10px] font-bold text-muted-foreground">
                                {progressPercentage}%
                              </span>
                            </div>

                            {/* Progress Bar Track */}
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${item.status === "Completed"
                                    ? "bg-emerald-500"
                                    : item.status === "Dropped"
                                      ? "bg-muted-foreground"
                                      : "bg-primary"
                                  }`}
                                style={{
                                  width: `${progressPercentage}%`,
                                }}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-semibold text-foreground">
                                {item.currentProgress} {item.progressUnit} logged
                              </span>
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                Ongoing
                              </span>
                            </div>

                            <div className="flex items-center justify-between pt-0.5 text-[10px] text-muted-foreground">
                              <span>Serialized release &bull; No fixed total</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Notes / Remarks if present */}
                      {item.notes && (
                        <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground italic">
                          &ldquo;{item.notes}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: User Rating & Static Action Affordance */}
                  <div className="mt-3 flex items-center justify-between border-t border-border-subtle pt-2.5 text-xs">
                    {/* User Rating */}
                    <div className="flex items-center gap-1" title={item.userRating ? `Rated ${item.userRating}/10` : "Community score"}>
                      <Star
                        className={`h-3.5 w-3.5 ${item.userRating
                          ? "fill-rating text-rating"
                          : "fill-subtle-foreground/30 text-subtle-foreground"
                          }`}
                        aria-hidden="true"
                      />
                      <span className="font-bold text-foreground">
                        {item.userRating ? item.userRating.toFixed(1) : item.communityRating}
                      </span>
                      {item.userRating && (
                        <span className="text-[10px] text-subtle-foreground font-normal">
                          (Yours)
                        </span>
                      )}
                    </div>

                    {/* Functional Log Action Affordance */}
                    <button
                      type="button"
                      onClick={() => handleOpenLogModal(item)}
                      aria-label={`Update log for ${item.title}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-2xs hover:border-primary hover:bg-primary-subtle hover:text-primary-subtle-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
                    >
                      <SlidersHorizontal className="h-3 w-3 text-subtle-foreground" aria-hidden="true" />
                      <span>Log</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Client-side Log / Edit Modal */}
        <EditLogModal
          entry={editingEntry}
          isOpen={isLogModalOpen}
          onClose={() => setIsLogModalOpen(false)}
          onSave={handleSaveEntry}
          onRemove={handleRemoveEntry}
        />
      </Container>
    </div>
  );
}
