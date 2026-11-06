/**
 * TMDB External Catalogue Provider
 *
 * Server-only module for fetching, discovering, and mapping movies and television series
 * from The Movie Database (TMDB) API.
 */

import { MediaItem } from "@/types/media";

if (typeof window !== "undefined") {
  throw new Error("tmdb.ts may only be executed on the server.");
}

export class TmdbNotFoundError extends Error {
  constructor(message: string = "Title not found") {
    super(message);
    this.name = "TmdbNotFoundError";
  }
}

export class TmdbUnavailableError extends Error {
  constructor(message: string = "TMDB is currently unavailable", public readonly cause?: unknown) {
    super(message);
    this.name = "TmdbUnavailableError";
  }
}

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const MAX_RETRIES = 2; // Up to 2 retries (total 3 attempts)
const DEFAULT_BACKOFFS = [300, 800]; // ms backoff for retry 1 and retry 2
const PER_ATTEMPT_TIMEOUT_MS = 8000; // ~8s per-attempt timeout

function extractErrorCode(error: unknown): string {
  if (error && typeof error === "object") {
    const err = error as {
      name?: string;
      code?: string;
      cause?: { code?: string; name?: string };
    };
    return (
      err.cause?.code ||
      err.code ||
      err.cause?.name ||
      err.name ||
      "UnknownError"
    );
  }
  return "UnknownError";
}

function parseRetryAfter(headerValue: string | null): number | null {
  if (!headerValue) return null;
  const parsedSeconds = parseFloat(headerValue);
  if (!Number.isNaN(parsedSeconds) && parsedSeconds > 0) {
    return Math.min(parsedSeconds * 1000, 2000); // honor Retry-After capped at ~2s
  }
  return null;
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

import {
  DISCOVER_GENRES,
  DISCOVER_SORT_OPTIONS,
  type DiscoverSortOption,
} from "@/lib/discover";

export {
  DISCOVER_GENRES,
  DISCOVER_SORT_OPTIONS,
  type DiscoverSortOption,
};

const GENRE_NAME_TO_MOVIE_ID: Record<string, number> = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Family: 10751,
  Fantasy: 14,
  History: 36,
  Horror: 27,
  Music: 10402,
  Mystery: 9648,
  Romance: 10749,
  "Sci-Fi": 878,
  "Science Fiction": 878,
  Thriller: 53,
  War: 10752,
  Western: 37,
};

const GENRE_NAME_TO_TV_ID: Record<string, number> = {
  Action: 10759,
  "Action & Adventure": 10759,
  Adventure: 10759,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Family: 10751,
  Fantasy: 10765,
  Kids: 10762,
  Mystery: 9648,
  News: 10763,
  Reality: 10764,
  "Sci-Fi": 10765,
  "Sci-Fi & Fantasy": 10765,
  "Science Fiction": 10765,
  Soap: 10766,
  Talk: 10767,
  War: 10768,
  "War & Politics": 10768,
  Western: 37,
};

export interface TmdbListItem {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string | null;
  release_date?: string | null;
  first_air_date?: string | null;
  vote_average?: number | null;
  vote_count?: number | null;
  genre_ids?: number[] | null;
  overview?: string | null;
  popularity?: number | null;
}

export interface TmdbListResponse {
  page: number;
  results: TmdbListItem[];
  total_pages: number;
  total_results: number;
}

interface TmdbMovieDetail {
  id: number;
  title: string;
  overview?: string | null;
  poster_path?: string | null;
  release_date?: string | null;
  runtime?: number | null;
  status?: string | null;
  tagline?: string | null;
  vote_average?: number | null;
  genres?: { id: number; name: string }[] | null;
  production_companies?: { id: number; name: string }[] | null;
  credits?: {
    crew?: { job?: string; name: string }[];
  } | null;
}

interface TmdbTvDetail {
  id: number;
  name: string;
  overview?: string | null;
  poster_path?: string | null;
  first_air_date?: string | null;
  last_air_date?: string | null;
  number_of_episodes?: number | null;
  status?: string | null;
  tagline?: string | null;
  vote_average?: number | null;
  genres?: { id: number; name: string }[] | null;
  networks?: { id: number; name: string }[] | null;
  production_companies?: { id: number; name: string }[] | null;
  created_by?: { id: number; name: string }[] | null;
  credits?: {
    crew?: { job?: string; name: string }[];
  } | null;
}

interface TmdbGenreListResponse {
  genres: { id: number; name: string }[];
}

async function tmdbFetch<T>(
  endpoint: string,
  revalidateSeconds: number = 86400
): Promise<T | null> {
  const token = process.env.TMDB_READ_ACCESS_TOKEN;
  if (!token) {
    console.warn("[TMDB] TMDB_READ_ACCESS_TOKEN is not configured.");
    throw new TmdbUnavailableError("TMDB_READ_ACCESS_TOKEN is not configured.");
  }

  const url = `${TMDB_BASE_URL}${endpoint}`;
  const endpointPath = endpoint.split("?")[0];

  let lastError: unknown = null;

  for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
    const attemptStart = performance.now();
    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        next: { revalidate: revalidateSeconds },
        signal: AbortSignal.timeout(PER_ATTEMPT_TIMEOUT_MS),
      });

      const elapsedMs = Math.round(performance.now() - attemptStart);

      if (res.status === 404) {
        return null;
      }

      if (res.ok) {
        return (await res.json()) as T;
      }

      console.warn(
        `[TMDB] ${endpointPath} failed (status: ${res.status}, attempt: ${attempt}, elapsed: ${elapsedMs}ms)`
      );

      const isRetryable = res.status === 429 || (res.status >= 500 && res.status <= 599);
      if (!isRetryable) {
        throw new TmdbUnavailableError(`TMDB returned HTTP ${res.status}`);
      }

      if (attempt <= MAX_RETRIES) {
        const retryAfterMs = parseRetryAfter(res.headers.get("retry-after"));
        const delay = retryAfterMs ?? DEFAULT_BACKOFFS[attempt - 1] ?? 800;
        await sleep(delay);
        continue;
      }

      throw new TmdbUnavailableError(`TMDB returned HTTP ${res.status} after ${attempt} attempts`);
    } catch (error) {
      if (error instanceof TmdbUnavailableError) {
        throw error;
      }

      const elapsedMs = Math.round(performance.now() - attemptStart);
      const errorCode = extractErrorCode(error);
      console.warn(
        `[TMDB] ${endpointPath} failed (error: ${errorCode}, attempt: ${attempt}, elapsed: ${elapsedMs}ms)`
      );

      lastError = error;

      if (attempt <= MAX_RETRIES) {
        const delay = DEFAULT_BACKOFFS[attempt - 1] ?? 800;
        await sleep(delay);
        continue;
      }
    }
  }

  throw new TmdbUnavailableError(
    `TMDB request failed for ${endpointPath} after ${MAX_RETRIES + 1} attempts`,
    lastError
  );
}

/**
 * Returns cached movie genre ID -> Name mapping (~24 hours).
 * Falls back to empty map on failure to avoid blocking catalogue results.
 */
export async function getMovieGenreMap(): Promise<Map<number, string>> {
  try {
    const res = await tmdbFetch<TmdbGenreListResponse>(
      "/genre/movie/list?language=en-US",
      86400
    );
    const map = new Map<number, string>();
    if (res?.genres) {
      res.genres.forEach((g) => map.set(g.id, g.name));
    }
    return map;
  } catch {
    return new Map<number, string>();
  }
}

/**
 * Returns cached TV genre ID -> Name mapping (~24 hours).
 * Falls back to empty map on failure to avoid blocking catalogue results.
 */
export async function getTvGenreMap(): Promise<Map<number, string>> {
  try {
    const res = await tmdbFetch<TmdbGenreListResponse>(
      "/genre/tv/list?language=en-US",
      86400
    );
    const map = new Map<number, string>();
    if (res?.genres) {
      res.genres.forEach((g) => map.set(g.id, g.name));
    }
    return map;
  } catch {
    return new Map<number, string>();
  }
}

/**
 * Lightweight mapper from TMDB list results to MediaItem for DISPLAY ONLY.
 * Never performs N+1 detail queries.
 */
export function mapTmdbListItemToMedia(
  item: TmdbListItem,
  type: "movie" | "tv",
  genreMap: Map<number, string>
): MediaItem {
  const title = (type === "movie" ? item.title : item.name) || "Untitled";
  const dateStr = type === "movie" ? item.release_date : item.first_air_date;
  const startYear = dateStr ? parseInt(dateStr.slice(0, 4), 10) || 0 : 0;
  const rating =
    item.vote_count && item.vote_count > 0 && item.vote_average
      ? Math.round(item.vote_average * 10) / 10
      : 0;

  const genres = (item.genre_ids || [])
    .map((id) => genreMap.get(id))
    .filter((name): name is string => Boolean(name));

  const category = type === "movie" ? "Movies" : "Series";
  const format = type === "movie" ? "Feature Film" : "TV Series";
  const progressUnit = type === "movie" ? "mins" : "episodes";

  return {
    id: `tmdb-${type}-${item.id}`,
    title,
    category,
    format,
    studio: "",
    startYear,
    endYear: type === "movie" ? startYear : null,
    rating,
    genres,
    poster: item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : "",
    synopsis: item.overview || "",
    totalProgress: null,
    progressUnit,
    releaseStatus: type === "movie" ? "Completed" : "Ongoing",
    source: "tmdb",
    externalId: String(item.id),
    fetchedAt: new Date().toISOString(),
  };
}

export function mapTmdbMovieToItem(data: TmdbMovieDetail): MediaItem {
  const startYear = data.release_date
    ? parseInt(data.release_date.slice(0, 4), 10) || 0
    : 0;

  const directors = data.credits?.crew
    ? data.credits.crew
        .filter((c) => c.job === "Director" && c.name)
        .map((c) => c.name)
    : [];

  const studio = data.production_companies?.[0]?.name || "";
  const releaseStatus: "Completed" | "Ongoing" =
    data.status === "Released" ? "Completed" : "Ongoing";

  return {
    id: `tmdb-movie-${data.id}`,
    title: data.title,
    category: "Movies",
    format: "Feature Film",
    studio,
    startYear,
    endYear: startYear,
    rating: data.vote_average ? Math.round(data.vote_average * 10) / 10 : 0,
    genres: data.genres ? data.genres.map((g) => g.name) : [],
    poster: data.poster_path ? `${TMDB_IMAGE_BASE}${data.poster_path}` : "",
    synopsis: data.overview || "",
    totalProgress: data.runtime && data.runtime > 0 ? data.runtime : null,
    progressUnit: "mins",
    releaseStatus,
    creators: directors.length > 0 ? directors : undefined,
    tagline: data.tagline || undefined,
    source: "tmdb",
    externalId: String(data.id),
    fetchedAt: new Date().toISOString(),
  };
}

export function mapTmdbTvToItem(data: TmdbTvDetail): MediaItem {
  const startYear = data.first_air_date
    ? parseInt(data.first_air_date.slice(0, 4), 10) || 0
    : 0;

  const isCompleted = data.status === "Ended" || data.status === "Canceled";
  const endYear =
    isCompleted && data.last_air_date
      ? parseInt(data.last_air_date.slice(0, 4), 10) || startYear
      : null;

  const creators = data.created_by?.length
    ? data.created_by.map((c) => c.name)
    : data.credits?.crew
    ? data.credits.crew
        .filter((c) => (c.job === "Executive Producer" || c.job === "Director") && c.name)
        .map((c) => c.name)
        .slice(0, 3)
    : [];

  const studio =
    data.networks?.[0]?.name ||
    data.production_companies?.[0]?.name ||
    "";

  return {
    id: `tmdb-tv-${data.id}`,
    title: data.name,
    category: "Series",
    format: "TV Series",
    studio,
    startYear,
    endYear: endYear,
    rating: data.vote_average ? Math.round(data.vote_average * 10) / 10 : 0,
    genres: data.genres ? data.genres.map((g) => g.name) : [],
    poster: data.poster_path ? `${TMDB_IMAGE_BASE}${data.poster_path}` : "",
    synopsis: data.overview || "",
    totalProgress:
      data.number_of_episodes && data.number_of_episodes > 0
        ? data.number_of_episodes
        : null,
    progressUnit: "episodes",
    releaseStatus: isCompleted ? "Completed" : "Ongoing",
    creators: creators.length > 0 ? creators : undefined,
    tagline: data.tagline || undefined,
    source: "tmdb",
    externalId: String(data.id),
    fetchedAt: new Date().toISOString(),
  };
}

export async function fetchTmdbMovie(externalId: string): Promise<MediaItem | null> {
  const data = await tmdbFetch<TmdbMovieDetail>(
    `/movie/${externalId}?append_to_response=credits&language=en-US`,
    86400
  );
  if (!data || !data.id || !data.title) {
    return null;
  }
  return mapTmdbMovieToItem(data);
}

export async function fetchTmdbTv(externalId: string): Promise<MediaItem | null> {
  const data = await tmdbFetch<TmdbTvDetail>(
    `/tv/${externalId}?append_to_response=credits&language=en-US`,
    86400
  );
  if (!data || !data.id || !data.name) {
    return null;
  }
  return mapTmdbTvToItem(data);
}

export async function searchTmdbMovies(
  query: string,
  page: number = 1
): Promise<TmdbListResponse | null> {
  const clean = query.trim();
  if (!clean) return null;
  return tmdbFetch<TmdbListResponse>(
    `/search/movie?query=${encodeURIComponent(clean)}&include_adult=false&language=en-US&page=${page}`,
    3600
  );
}

export async function searchTmdbTv(
  query: string,
  page: number = 1
): Promise<TmdbListResponse | null> {
  const clean = query.trim();
  if (!clean) return null;
  return tmdbFetch<TmdbListResponse>(
    `/search/tv?query=${encodeURIComponent(clean)}&include_adult=false&language=en-US&page=${page}`,
    3600
  );
}

export async function getPopularTmdbMovies(
  page: number = 1
): Promise<TmdbListResponse | null> {
  return tmdbFetch<TmdbListResponse>(
    `/movie/popular?language=en-US&page=${page}`,
    3600
  );
}

export async function getPopularTmdbTv(
  page: number = 1
): Promise<TmdbListResponse | null> {
  return tmdbFetch<TmdbListResponse>(
    `/tv/popular?language=en-US&page=${page}`,
    3600
  );
}

export async function discoverTmdbMovies(options: {
  genreId?: number;
  sortBy?: DiscoverSortOption;
  page?: number;
}): Promise<TmdbListResponse | null> {
  const page = options.page || 1;
  const sort = options.sortBy || "popular";
  const today = new Date().toISOString().slice(0, 10);

  let sortQuery = "sort_by=popularity.desc";
  if (sort === "rating") {
    sortQuery = "sort_by=vote_average.desc&vote_count.gte=200";
  } else if (sort === "year-desc") {
    sortQuery = `sort_by=primary_release_date.desc&primary_release_date.lte=${today}&vote_count.gte=10`;
  } else if (sort === "year-asc") {
    sortQuery = "sort_by=primary_release_date.asc&primary_release_date.gte=1880-01-01&vote_count.gte=10";
  }

  const genreQuery = options.genreId ? `&with_genres=${options.genreId}` : "";
  return tmdbFetch<TmdbListResponse>(
    `/discover/movie?language=en-US&include_adult=false&${sortQuery}${genreQuery}&page=${page}`,
    3600
  );
}

export async function discoverTmdbTv(options: {
  genreId?: number;
  sortBy?: DiscoverSortOption;
  page?: number;
}): Promise<TmdbListResponse | null> {
  const page = options.page || 1;
  const sort = options.sortBy || "popular";
  const today = new Date().toISOString().slice(0, 10);

  let sortQuery = "sort_by=popularity.desc";
  if (sort === "rating") {
    sortQuery = "sort_by=vote_average.desc&vote_count.gte=100";
  } else if (sort === "year-desc") {
    sortQuery = `sort_by=first_air_date.desc&first_air_date.lte=${today}&vote_count.gte=5`;
  } else if (sort === "year-asc") {
    sortQuery = "sort_by=first_air_date.asc&first_air_date.gte=1940-01-01&vote_count.gte=5";
  }

  const genreQuery = options.genreId ? `&with_genres=${options.genreId}` : "";
  return tmdbFetch<TmdbListResponse>(
    `/discover/tv?language=en-US&include_adult=false&${sortQuery}${genreQuery}&page=${page}`,
    3600
  );
}

/**
 * Recommendations for title detail page. Limited to `limit` items (default 6).
 * Falls back to similar titles if recommendations returns empty.
 */
export async function fetchTmdbRecommendations(
  type: "movie" | "tv",
  externalId: string,
  limit: number = 6
): Promise<MediaItem[]> {
  try {
    const [genreMap, recsRes] = await Promise.all([
      type === "movie" ? getMovieGenreMap() : getTvGenreMap(),
      tmdbFetch<TmdbListResponse>(
        `/${type}/${externalId}/recommendations?language=en-US&page=1`,
        86400
      ),
    ]);

    let results = recsRes?.results || [];

    if (results.length === 0) {
      const simRes = await tmdbFetch<TmdbListResponse>(
        `/${type}/${externalId}/similar?language=en-US&page=1`,
        86400
      );
      results = simRes?.results || [];
    }

    return results
      .slice(0, limit)
      .map((item) => mapTmdbListItemToMedia(item, type, genreMap));
  } catch {
    return [];
  }
}

/**
 * Top popular items for homepage featured showcase (top 5, cached 24h).
 */
export async function fetchHomeFeaturedTitles(limit: number = 5): Promise<MediaItem[]> {
  try {
    const [movieGenres, tvGenres, moviesRes, tvRes] = await Promise.all([
      getMovieGenreMap(),
      getTvGenreMap(),
      getPopularTmdbMovies(1),
      getPopularTmdbTv(1),
    ]);

    if (!moviesRes?.results || !tvRes?.results) {
      return [];
    }

    const movies = moviesRes.results
      .slice(0, 3)
      .map((m) => mapTmdbListItemToMedia(m, "movie", movieGenres));
    const tv = tvRes.results
      .slice(0, 2)
      .map((t) => mapTmdbListItemToMedia(t, "tv", tvGenres));

    // Interleave movie and tv titles for medium variety
    const interleaved: MediaItem[] = [];
    const maxLen = Math.max(movies.length, tv.length);
    for (let i = 0; i < maxLen; i++) {
      if (movies[i]) interleaved.push(movies[i]);
      if (tv[i]) interleaved.push(tv[i]);
    }

    return interleaved.slice(0, limit);
  } catch {
    return [];
  }
}

export interface DiscoverResult {
  items: MediaItem[];
  page: number;
  totalPages: number;
  totalResults: number;
  partialNotice?: string;
}

/**
 * Sort comparator prioritizing valid release years over unknown/0 years.
 */
function sortItems(
  items: MediaItem[],
  sortBy: DiscoverSortOption
): MediaItem[] {
  return [...items].sort((a, b) => {
    if (sortBy === "rating") {
      return b.rating - a.rating;
    }
    if (sortBy === "year-desc") {
      const aYear = a.startYear || 0;
      const bYear = b.startYear || 0;
      if (aYear === 0 && bYear === 0) return 0;
      if (aYear === 0) return 1;
      if (bYear === 0) return -1;
      return bYear - aYear;
    }
    if (sortBy === "year-asc") {
      const aYear = a.startYear || 0;
      const bYear = b.startYear || 0;
      if (aYear === 0 && bYear === 0) return 0;
      if (aYear === 0) return 1;
      if (bYear === 0) return -1;
      return aYear - bYear;
    }
    return 0;
  });
}

/**
 * Server-side catalogue engine for Discover.
 */
export async function fetchDiscoverCatalogue(options: {
  q?: string;
  category?: "all" | "movies" | "series";
  genre?: string;
  sort?: DiscoverSortOption;
  page?: number;
}): Promise<DiscoverResult | null> {
  const category = options.category || "all";
  const sort = options.sort || "popular";
  const page = Math.max(1, Math.min(500, options.page || 1));
  const query = options.q?.trim();

  // Failed genre-list fetch must not block results (fallback to empty maps)
  const [movieGenresSettled, tvGenresSettled] = await Promise.allSettled([
    getMovieGenreMap(),
    getTvGenreMap(),
  ]);
  const movieGenres =
    movieGenresSettled.status === "fulfilled"
      ? movieGenresSettled.value
      : new Map<number, string>();
  const tvGenres =
    tvGenresSettled.status === "fulfilled"
      ? tvGenresSettled.value
      : new Map<number, string>();

  // Determine genre IDs if specified
  let movieGenreId: number | undefined;
  let tvGenreId: number | undefined;

  if (options.genre && options.genre !== "All Genres" && options.genre !== "all") {
    movieGenreId = GENRE_NAME_TO_MOVIE_ID[options.genre];
    tvGenreId = GENRE_NAME_TO_TV_ID[options.genre];
  }

  // 1. Text Search Mode
  if (query) {
    if (category === "movies") {
      try {
        const res = await searchTmdbMovies(query, page);
        if (!res) return null;
        let items = res.results.map((m) =>
          mapTmdbListItemToMedia(m, "movie", movieGenres)
        );
        if (movieGenreId) {
          items = items.filter((item) =>
            res.results.find((raw) => String(raw.id) === item.externalId)?.genre_ids?.includes(movieGenreId!)
          );
        }
        return {
          items: sort === "popular" ? items : sortItems(items, sort),
          page: res.page,
          totalPages: Math.min(500, res.total_pages),
          totalResults: res.total_results,
        };
      } catch (err) {
        if (err instanceof TmdbUnavailableError) return null;
        throw err;
      }
    }

    if (category === "series") {
      try {
        const res = await searchTmdbTv(query, page);
        if (!res) return null;
        let items = res.results.map((t) =>
          mapTmdbListItemToMedia(t, "tv", tvGenres)
        );
        if (tvGenreId) {
          items = items.filter((item) =>
            res.results.find((raw) => String(raw.id) === item.externalId)?.genre_ids?.includes(tvGenreId!)
          );
        }
        return {
          items: sort === "popular" ? items : sortItems(items, sort),
          page: res.page,
          totalPages: Math.min(500, res.total_pages),
          totalResults: res.total_results,
        };
      } catch (err) {
        if (err instanceof TmdbUnavailableError) return null;
        throw err;
      }
    }

    // Category "all": search both independently with Promise.allSettled
    const [movieSettled, tvSettled] = await Promise.allSettled([
      searchTmdbMovies(query, page),
      searchTmdbTv(query, page),
    ]);

    const movieRes = movieSettled.status === "fulfilled" ? movieSettled.value : null;
    const tvRes = tvSettled.status === "fulfilled" ? tvSettled.value : null;

    if (!movieRes && !tvRes) return null;

    let movieItems = (movieRes?.results || []).map((m) =>
      mapTmdbListItemToMedia(m, "movie", movieGenres)
    );
    if (movieGenreId && movieRes) {
      movieItems = movieItems.filter((item) =>
        movieRes.results.find((raw) => String(raw.id) === item.externalId)?.genre_ids?.includes(movieGenreId!)
      );
    }

    let tvItems = (tvRes?.results || []).map((t) =>
      mapTmdbListItemToMedia(t, "tv", tvGenres)
    );
    if (tvGenreId && tvRes) {
      tvItems = tvItems.filter((item) =>
        tvRes.results.find((raw) => String(raw.id) === item.externalId)?.genre_ids?.includes(tvGenreId!)
      );
    }

    // Interleave or combine results
    const combined: MediaItem[] = [];
    if (movieRes && tvRes) {
      const maxLen = Math.max(movieItems.length, tvItems.length);
      for (let i = 0; i < maxLen; i++) {
        if (movieItems[i]) combined.push(movieItems[i]);
        if (tvItems[i]) combined.push(tvItems[i]);
      }
    } else if (movieRes) {
      combined.push(...movieItems);
    } else if (tvRes) {
      combined.push(...tvItems);
    }

    const totalPages = Math.min(
      500,
      Math.max(movieRes?.total_pages || 0, tvRes?.total_pages || 0)
    );
    const totalResults = (movieRes?.total_results || 0) + (tvRes?.total_results || 0);

    const hasPartialFailure = (!movieRes && Boolean(tvRes)) || (Boolean(movieRes) && !tvRes);

    return {
      items: sort === "popular" ? combined : sortItems(combined, sort),
      page,
      totalPages: Math.max(1, totalPages),
      totalResults,
      partialNotice: hasPartialFailure
        ? "Some results couldn't be loaded right now. Showing available titles."
        : undefined,
    };
  }

  // 2. Discover / Browse Mode (No search query)
  if (category === "movies") {
    try {
      const res = await discoverTmdbMovies({
        genreId: movieGenreId,
        sortBy: sort,
        page,
      });
      if (!res) return null;
      const items = res.results.map((m) =>
        mapTmdbListItemToMedia(m, "movie", movieGenres)
      );
      return {
        items,
        page: res.page,
        totalPages: Math.min(500, res.total_pages),
        totalResults: res.total_results,
      };
    } catch (err) {
      if (err instanceof TmdbUnavailableError) return null;
      throw err;
    }
  }

  if (category === "series") {
    try {
      const res = await discoverTmdbTv({
        genreId: tvGenreId,
        sortBy: sort,
        page,
      });
      if (!res) return null;
      const items = res.results.map((t) =>
        mapTmdbListItemToMedia(t, "tv", tvGenres)
      );
      return {
        items,
        page: res.page,
        totalPages: Math.min(500, res.total_pages),
        totalResults: res.total_results,
      };
    } catch (err) {
      if (err instanceof TmdbUnavailableError) return null;
      throw err;
    }
  }

  // Category "all" in discover mode: independent requests with Promise.allSettled
  const [movieSettled, tvSettled] = await Promise.allSettled([
    discoverTmdbMovies({ genreId: movieGenreId, sortBy: sort, page }),
    discoverTmdbTv({ genreId: tvGenreId, sortBy: sort, page }),
  ]);

  const movieRes = movieSettled.status === "fulfilled" ? movieSettled.value : null;
  const tvRes = tvSettled.status === "fulfilled" ? tvSettled.value : null;

  if (!movieRes && !tvRes) return null;

  const movieItems = (movieRes?.results || []).map((m) =>
    mapTmdbListItemToMedia(m, "movie", movieGenres)
  );
  const tvItems = (tvRes?.results || []).map((t) =>
    mapTmdbListItemToMedia(t, "tv", tvGenres)
  );

  let combined: MediaItem[] = [];
  if (movieRes && tvRes) {
    if (sort === "popular") {
      const maxLen = Math.max(movieItems.length, tvItems.length);
      for (let i = 0; i < maxLen; i++) {
        if (movieItems[i]) combined.push(movieItems[i]);
        if (tvItems[i]) combined.push(tvItems[i]);
      }
    } else {
      combined = sortItems([...movieItems, ...tvItems], sort);
    }
  } else if (movieRes) {
    combined = sort === "popular" ? movieItems : sortItems(movieItems, sort);
  } else if (tvRes) {
    combined = sort === "popular" ? tvItems : sortItems(tvItems, sort);
  }

  const totalPages = Math.min(
    500,
    Math.max(movieRes?.total_pages || 0, tvRes?.total_pages || 0)
  );
  const totalResults = (movieRes?.total_results || 0) + (tvRes?.total_results || 0);

  const hasPartialFailure = (!movieRes && Boolean(tvRes)) || (Boolean(movieRes) && !tvRes);

  return {
    items: combined,
    page,
    totalPages: Math.max(1, totalPages),
    totalResults,
    partialNotice: hasPartialFailure
      ? "Some results couldn't be loaded right now. Showing available titles."
      : undefined,
  };
}
