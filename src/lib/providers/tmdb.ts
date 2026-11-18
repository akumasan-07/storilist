/**
 * TMDB External Catalogue Provider
 *
 * Server-only module for fetching, discovering, and mapping movies and television series
 * from The Movie Database (TMDB) API.
 */

import { MediaItem } from "@/types/media";
import {
  providerFetch,
  TmdbNotFoundError,
  TmdbUnavailableError,
} from "./http";

export { TmdbNotFoundError, TmdbUnavailableError };

if (typeof window !== "undefined") {
  throw new Error("tmdb.ts may only be executed on the server.");
}

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

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

  return providerFetch<T>({
    providerName: "TMDB",
    url: `${TMDB_BASE_URL}${endpoint}`,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    revalidateSeconds,
    createUnavailableError: (msg, cause) => new TmdbUnavailableError(msg, cause),
  });
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

export interface DiscoverTmdbSourceOptions {
  type: "movie" | "tv";
  q?: string;
  genre?: string;
  sort?: DiscoverSortOption;
  page?: number;
  limit?: number; // 20 for single-category, 5 for all tab
}

export interface DiscoverTmdbSourceResult {
  items: MediaItem[];
  page: number;
  totalPages: number;
  totalResults: number;
  hasNext: boolean;
}

/**
 * Modular discover and search fetcher for TMDB Movies or TV.
 * In search mode, results are returned in relevance order.
 * In browse mode, sort applies via TMDB API parameters.
 */
export async function discoverTmdbSource(
  options: DiscoverTmdbSourceOptions
): Promise<DiscoverTmdbSourceResult | null> {
  const isMovie = options.type === "movie";
  const limit = options.limit || 20;
  const page = Math.max(1, options.page || 1);
  const query = options.q?.trim();
  const sort = options.sort || "popular";

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
  const genreMap = isMovie ? movieGenres : tvGenres;

  let targetGenreId: number | undefined;
  if (options.genre && options.genre !== "All Genres" && options.genre !== "all") {
    targetGenreId = isMovie
      ? GENRE_NAME_TO_MOVIE_ID[options.genre]
      : GENRE_NAME_TO_TV_ID[options.genre];
  }

  // Calculate TMDB page and local slicing when limit is 5 (for All tab)
  const isSizedForAll = limit === 5;
  const tmdbPage = isSizedForAll
    ? Math.floor((page - 1) / 4) + 1
    : page;
  const sliceStart = isSizedForAll ? ((page - 1) % 4) * 5 : 0;
  const sliceEnd = sliceStart + limit;

  // 1. Text Search Mode (Relevance order from TMDB, no artificial sort)
  if (query && query.length >= 3) {
    const rawRes = isMovie
      ? await searchTmdbMovies(query, tmdbPage)
      : await searchTmdbTv(query, tmdbPage);

    if (!rawRes || !rawRes.results) {
      return null;
    }

    let mapped = rawRes.results.map((raw) =>
      mapTmdbListItemToMedia(raw, options.type, genreMap)
    );

    if (targetGenreId) {
      mapped = mapped.filter((item) =>
        rawRes.results.find((raw) => String(raw.id) === item.externalId)?.genre_ids?.includes(targetGenreId!)
      );
    }

    const items = mapped.slice(sliceStart, sliceEnd);
    const hasNext = isSizedForAll
      ? tmdbPage < rawRes.total_pages || sliceEnd < mapped.length
      : tmdbPage < rawRes.total_pages;

    return {
      items,
      page,
      totalPages: isSizedForAll
        ? hasNext ? page + 1 : page
        : Math.min(500, rawRes.total_pages),
      totalResults: rawRes.total_results,
      hasNext,
    };
  }

  // 2. Browse / Discover Mode
  const rawRes = isMovie
    ? await discoverTmdbMovies({
        genreId: targetGenreId,
        sortBy: sort,
        page: tmdbPage,
      })
    : await discoverTmdbTv({
        genreId: targetGenreId,
        sortBy: sort,
        page: tmdbPage,
      });

  if (!rawRes || !rawRes.results) {
    return null;
  }

  const mapped = rawRes.results.map((raw) =>
    mapTmdbListItemToMedia(raw, options.type, genreMap)
  );

  const items = mapped.slice(sliceStart, sliceEnd);
  const hasNext = isSizedForAll
    ? tmdbPage < rawRes.total_pages || sliceEnd < mapped.length
    : tmdbPage < rawRes.total_pages;

  return {
    items,
    page,
    totalPages: isSizedForAll
      ? hasNext ? page + 1 : page
      : Math.min(500, rawRes.total_pages),
    totalResults: rawRes.total_results,
    hasNext,
  };
}
