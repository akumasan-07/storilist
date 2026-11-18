/**
 * Shared discover constants, types, and labels.
 *
 * Client-safe: no server-only guards, no provider API calls, no database access.
 * Single source of truth for catalogue discovery filtering and sorting.
 */

export const MIN_SEARCH_QUERY_LENGTH = 3;

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

export const MAL_UNSUPPORTED_GENRES = new Set(["Animation", "Documentary", "Western"]);

export function getAllowedGenresForCategory(category: string): readonly DiscoverGenre[] {
  const cat = category.toLowerCase();
  if (cat === "anime" || cat === "comics") {
    return DISCOVER_GENRES.filter((g) => !MAL_UNSUPPORTED_GENRES.has(g));
  }
  return DISCOVER_GENRES;
}

export function isGenreAllowedForCategory(category: string, genre: string): boolean {
  if (!genre || genre === "All Genres" || genre === "all") return true;
  const allowed = getAllowedGenresForCategory(category);
  return allowed.some((g) => g.toLowerCase() === genre.toLowerCase());
}

export function normalizeGenreForCategory(
  category: string,
  genre: string | undefined | null
): DiscoverGenre | undefined {
  if (!genre || genre === "All Genres" || genre === "all") return undefined;
  if (!isGenreAllowedForCategory(category, genre)) return undefined;
  const match = DISCOVER_GENRES.find((g) => g.toLowerCase() === genre.toLowerCase());
  return match && match !== "All Genres" ? match : undefined;
}

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

export const POPULAR_AND_RATING_SORTS: readonly DiscoverSortOptionItem[] = [
  { value: "popular", label: "Popular" },
  { value: "rating", label: "Top Rated" },
];

export const CATEGORY_SORT_OPTIONS: Record<string, readonly DiscoverSortOptionItem[]> = {
  all: POPULAR_AND_RATING_SORTS,
  anime: POPULAR_AND_RATING_SORTS,
  comics: POPULAR_AND_RATING_SORTS,
  movies: DISCOVER_SORT_OPTIONS,
  series: DISCOVER_SORT_OPTIONS,
  novels: POPULAR_AND_RATING_SORTS,
};

export function getAllowedSortOptions(category: string): readonly DiscoverSortOptionItem[] {
  const key = category.toLowerCase();
  return CATEGORY_SORT_OPTIONS[key] || POPULAR_AND_RATING_SORTS;
}

export function isSortAllowedForCategory(category: string, sort: string): boolean {
  const allowed = getAllowedSortOptions(category);
  return allowed.some((opt) => opt.value === sort);
}

export function normalizeSortForCategory(
  category: string,
  sort: string | undefined | null
): DiscoverSortOption {
  if (!sort) return "popular";
  return isSortAllowedForCategory(category, sort)
    ? (sort as DiscoverSortOption)
    : "popular";
}
