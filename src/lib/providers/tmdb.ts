/**
 * TMDB External Catalogue Provider
 *
 * Server-only module for fetching and mapping movies and television series
 * from The Movie Database (TMDB) API.
 */

import { MediaItem } from "@/types/media";

if (typeof window !== "undefined") {
  throw new Error("tmdb.ts may only be executed on the server.");
}

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

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

export interface TmdbSearchResultItem {
  id: number;
  media_type?: string;
  title?: string;
  name?: string;
  poster_path?: string | null;
  overview?: string | null;
  release_date?: string | null;
  first_air_date?: string | null;
  vote_average?: number | null;
}

export interface TmdbSearchResponse {
  page: number;
  results: TmdbSearchResultItem[];
  total_pages: number;
  total_results: number;
}

async function tmdbFetch<T>(
  endpoint: string,
  revalidateSeconds: number = 86400
): Promise<T | null> {
  const token = process.env.TMDB_READ_ACCESS_TOKEN;
  if (!token) {
    console.error("TMDB_READ_ACCESS_TOKEN is not configured.");
    return null;
  }

  const url = `${TMDB_BASE_URL}${endpoint}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      next: { revalidate: revalidateSeconds },
      signal: AbortSignal.timeout(8000),
    });

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      console.error(`TMDB API returned error ${res.status} for ${endpoint}`);
      return null;
    }

    return (await res.json()) as T;
  } catch (error) {
    console.error(`TMDB fetch error for ${endpoint}:`, error);
    return null;
  }
}

export function mapTmdbMovieToItem(data: TmdbMovieDetail): MediaItem {
  const startYear = data.release_date
    ? parseInt(data.release_date.slice(0, 4), 10) || null
    : null;

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
    startYear: startYear ?? 0,
    endYear: startYear ?? 0,
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
    ? parseInt(data.first_air_date.slice(0, 4), 10) || null
    : null;

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
    startYear: startYear ?? 0,
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
): Promise<TmdbSearchResponse | null> {
  const clean = query.trim();
  if (!clean) return null;
  return tmdbFetch<TmdbSearchResponse>(
    `/search/movie?query=${encodeURIComponent(clean)}&include_adult=false&language=en-US&page=${page}`,
    3600
  );
}

export async function searchTmdbTv(
  query: string,
  page: number = 1
): Promise<TmdbSearchResponse | null> {
  const clean = query.trim();
  if (!clean) return null;
  return tmdbFetch<TmdbSearchResponse>(
    `/search/tv?query=${encodeURIComponent(clean)}&include_adult=false&language=en-US&page=${page}`,
    3600
  );
}

export async function getPopularTmdbMovies(
  page: number = 1
): Promise<TmdbSearchResponse | null> {
  return tmdbFetch<TmdbSearchResponse>(
    `/movie/popular?language=en-US&page=${page}`,
    3600
  );
}

export async function getPopularTmdbTv(
  page: number = 1
): Promise<TmdbSearchResponse | null> {
  return tmdbFetch<TmdbSearchResponse>(
    `/tv/popular?language=en-US&page=${page}`,
    3600
  );
}
