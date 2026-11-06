/**
 * Shared discover constants, types, and labels.
 *
 * Client-safe: no server-only guards, no provider API calls, no database access.
 * Single source of truth for catalogue discovery filtering and sorting.
 */

export const DISCOVER_GENRES = [
  "All Genres",
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "War",
  "Western",
] as const;

export type DiscoverGenre = (typeof DISCOVER_GENRES)[number];

export const DISCOVER_SORT_OPTIONS = [
  { value: "popular", label: "Popular" },
  { value: "rating", label: "Top Rated" },
  { value: "year-desc", label: "Newest First" },
  { value: "year-asc", label: "Oldest First" },
] as const;

export type DiscoverSortOption = (typeof DISCOVER_SORT_OPTIONS)[number]["value"];

export interface DiscoverSortOptionItem {
  value: DiscoverSortOption;
  label: string;
}

export const SORT_OPTIONS: readonly DiscoverSortOptionItem[] = DISCOVER_SORT_OPTIONS;
