"use client";

import { useState, useMemo, Suspense, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  Star,
  BookmarkPlus,
  Compass,
  ArrowUpDown,
  ChevronDown,
  Sparkles,
  BookOpen,
  Clapperboard,
  Tv,
  BookText,
  X,
  Check,
  RotateCcw,
} from "lucide-react";
import Container from "@/components/Container";
import { MediaItem } from "@/types/media";
import { SAMPLE_MEDIA_ITEMS } from "@/data/sampleMedia";

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

type SortOption = "rating" | "title" | "year-desc" | "year-asc";

interface SortOptionConfig {
  value: SortOption;
  label: string;
}

const SORT_OPTIONS: SortOptionConfig[] = [
  { value: "rating", label: "Top Rated" },
  { value: "title", label: "Title (A–Z)" },
  { value: "year-desc", label: "Newest First" },
  { value: "year-asc", label: "Oldest First" },
];

function DiscoverContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [trackedIds, setTrackedIds] = useState<Set<string>>(new Set());

  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Close sort dropdown on click outside or escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSortOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsSortOpen(false);
      }
    }

    if (isSortOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSortOpen]);

  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label || "Top Rated";

  // Filter and sort items based on user inputs
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

    // Sort items
    return [...items].sort((a, b) => {
      if (sortBy === "rating") {
        return parseFloat(b.rating) - parseFloat(a.rating);
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "year-desc") {
        return parseInt(b.year.slice(0, 4)) - parseInt(a.year.slice(0, 4));
      }
      if (sortBy === "year-asc") {
        return parseInt(a.year.slice(0, 4)) - parseInt(b.year.slice(0, 4));
      }
      return 0;
    });
  }, [selectedCategory, selectedGenre, searchQuery, sortBy]);

  const toggleTrack = (id: string) => {
    setTrackedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedGenre("All Genres");
    setSortBy("rating");
  };

  const isFiltered =
    searchQuery.trim() !== "" || selectedCategory !== "all" || selectedGenre !== "All Genres";

  return (
    <div className="py-8 sm:py-12">
      <Container>
        {/* =========================================================================
            1. PAGE HEADER & PROMINENT SEARCH
            ========================================================================= */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Discover Stories
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            Explore curated highlights across anime, comics, movies, series, and novels.
          </p>

          {/* Prominent Search Bar */}
          <div className="mt-6">
            <div className="group relative flex items-center rounded-2xl border border-border bg-card p-1.5 shadow-sm transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
              <div className="pointer-events-none flex items-center pl-3.5 text-subtle-foreground">
                <Search className="h-4 w-4" aria-hidden="true" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search media catalog"
                placeholder="Search by title, creator, studio, or genre..."
                className="w-full bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-subtle-foreground focus:outline-none"
              />
              <div className="flex items-center gap-1.5 pr-1">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search query"
                    className="p-1.5 text-subtle-foreground hover:text-foreground transition-colors rounded-md"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary-hover shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. FORMAT FILTERS & UTILITY BAR
            ========================================================================= */}
        <div className="mt-8 flex flex-col gap-4 border-b border-border-subtle pb-4">
          {/* Format Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORY_TABS.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = selectedCategory === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSelectedCategory(tab.key)}
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

          {/* Secondary Sorting & Status Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-subtle-foreground">
              <span className="font-semibold text-foreground">
                Showing {filteredItems.length} {filteredItems.length === 1 ? "title" : "titles"}
              </span>
              <span>&bull;</span>
              <span>
                {selectedCategory === "all"
                  ? "All 5 mediums"
                  : CATEGORY_TABS.find((t) => t.key === selectedCategory)?.label}
              </span>
              {isFiltered && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 ml-1 text-xs font-medium text-primary hover:underline"
                >
                  <RotateCcw className="h-3 w-3" aria-hidden="true" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Styled Sort Dropdown Menu */}
              <div ref={sortDropdownRef} className="relative inline-block text-left">
                <button
                  type="button"
                  id="sort-menu-button"
                  aria-haspopup="listbox"
                  aria-expanded={isSortOpen}
                  aria-label={`Sort stories, currently sorted by ${currentSortLabel}`}
                  onClick={() => setIsSortOpen((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${isSortOpen
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
                    aria-labelledby="sort-menu-button"
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

              {/* Genre Filter Toggle */}
              <button
                type="button"
                onClick={() => setShowFilters((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${showFilters || selectedGenre !== "All Genres"
                  ? "border-primary bg-primary-subtle text-primary-subtle-foreground font-semibold"
                  : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Genres {selectedGenre !== "All Genres" ? `(${selectedGenre})` : ""}</span>
              </button>
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
                    onClick={() => setSelectedGenre(genre)}
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

        {/* =========================================================================
            3. MEDIA CARDS GRID & EMPTY STATE
            ========================================================================= */}
        {filteredItems.length === 0 ? (
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
              onClick={resetFilters}
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary-hover transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-5">
            {filteredItems.map((item) => {
              const isTracked = trackedIds.has(item.id);

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
                          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent"
                        />

                        {/* Year Tag (Top-Left) */}
                        <div className="absolute top-2 left-2">
                          <span className="rounded-md bg-black/65 px-1.5 py-0.5 text-[10px] font-semibold text-white/95 backdrop-blur-xs shadow-xs">
                            {item.year}
                          </span>
                        </div>

                        {/* Category Badge (Top-Right) */}
                        <div className="absolute top-2 right-2">
                          <span
                            className={`rounded-md border px-1.5 py-0.5 text-[10px] font-bold tracking-wider backdrop-blur-md shadow-xs ${item.badgeStyle}`}
                          >
                            {item.badge}
                          </span>
                        </div>
                      </div>
                    </Link>

                    {/* Metadata & Synopsis */}
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

                      {/* Genre Chips */}
                      <div className="mt-2 flex flex-wrap items-center gap-1">
                        {item.genres.map((genre) => (
                          <button
                            key={genre}
                            type="button"
                            onClick={() => {
                              setSelectedGenre(genre);
                              setShowFilters(true);
                            }}
                            className="rounded border border-border-subtle bg-muted/60 px-1.5 py-0.2 text-[10px] font-medium text-muted-foreground hover:border-border hover:text-foreground transition-colors"
                          >
                            {genre}
                          </button>
                        ))}
                      </div>

                      {/* Concise Synopsis */}
                      <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                        {item.synopsis}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer: Rating & Quick Save Affordance */}
                  <div className="mt-3 flex items-center justify-between border-t border-border-subtle pt-2.5 text-xs">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-rating text-rating" aria-hidden="true" />
                      <span className="font-bold text-foreground">{item.rating}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleTrack(item.id)}
                      title={isTracked ? `Remove ${item.title} from library` : `Add ${item.title} to library`}
                      aria-label={isTracked ? `Remove ${item.title} from library` : `Add ${item.title} to library`}
                      className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${isTracked
                        ? "border-primary bg-primary text-primary-foreground shadow-xs"
                        : "border-border bg-card text-foreground shadow-2xs hover:border-primary hover:text-primary"
                        }`}
                    >
                      {isTracked ? (
                        <>
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Tracked</span>
                        </>
                      ) : (
                        <>
                          <BookmarkPlus className="h-3.5 w-3.5 text-subtle-foreground group-hover:text-primary" aria-hidden="true" />
                          <span>Track</span>
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* =========================================================================
            4. DISCOVERY FOOTER NOTE
            ========================================================================= */}
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
