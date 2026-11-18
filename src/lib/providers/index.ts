/**
 * External Catalogue Providers Dispatcher
 *
 * Provides media ID parsing and dispatching across catalogue providers.
 * Coordinates multi-provider discovery (TMDB, MAL) and featured showcases.
 */

import { MediaItem } from "@/types/media";
import {
  fetchTmdbMovie,
  fetchTmdbTv,
  fetchTmdbRecommendations,
  discoverTmdbSource,
  getMovieGenreMap,
  getTvGenreMap,
  getPopularTmdbMovies,
  getPopularTmdbTv,
  mapTmdbListItemToMedia,
  TmdbUnavailableError,
  TmdbNotFoundError,
} from "./tmdb";
import {
  fetchMalAnime,
  fetchMalManga,
  discoverMalCatalogue,
  fetchMalAnimeRanking,
  fetchMalMangaRanking,
  mapMalListItemToMedia,
  MalNotFoundError,
  MalUnavailableError,
} from "./mal";
import {
  ProviderNotFoundError,
  ProviderUnavailableError,
} from "./http";
import {
  DISCOVER_GENRES,
  normalizeSortForCategory,
  type DiscoverSortOption,
} from "@/lib/discover";

if (typeof window !== "undefined") {
  throw new Error("providers/index.ts may only be executed on the server.");
}

export type ProviderSource = "tmdb" | "mal" | "openlibrary";

export interface ParsedMediaId {
  source: ProviderSource;
  type: string;
  externalId: string;
}

const TMDB_ID_REGEX = /^tmdb-(movie|tv)-(\d{1,9})$/;
const MAL_ID_REGEX = /^mal-(anime|manga)-(\d{1,9})$/;

/**
 * Strict parser for external media IDs.
 * Rejects any ID that does not conform to known provider ID patterns.
 */
export function parseMediaId(id: string): ParsedMediaId | null {
  if (typeof id !== "string") return null;

  const tmdbMatch = id.match(TMDB_ID_REGEX);
  if (tmdbMatch) {
    return {
      source: "tmdb",
      type: tmdbMatch[1] as "movie" | "tv",
      externalId: tmdbMatch[2],
    };
  }

  const malMatch = id.match(MAL_ID_REGEX);
  if (malMatch) {
    return {
      source: "mal",
      type: malMatch[1] as "anime" | "manga",
      externalId: malMatch[2],
    };
  }

  return null;
}

/**
 * Dispatches a fetch request to the appropriate external provider by media ID.
 * Returns null if the ID is invalid or the provider cannot find the title.
 */
export async function fetchMediaFromProvider(
  id: string
): Promise<MediaItem | null> {
  const parsed = parseMediaId(id);
  if (!parsed) {
    return null;
  }

  if (parsed.source === "tmdb") {
    if (parsed.type === "movie") {
      return fetchTmdbMovie(parsed.externalId);
    }
    if (parsed.type === "tv") {
      return fetchTmdbTv(parsed.externalId);
    }
  }

  if (parsed.source === "mal") {
    if (parsed.type === "anime") {
      return fetchMalAnime(parsed.externalId);
    }
    if (parsed.type === "manga") {
      return fetchMalManga(parsed.externalId);
    }
  }

  return null;
}

/**
 * Resolves recommendations/related titles for a media item.
 * For MAL, uses the recommendations already attached to the item during details fetch.
 * For TMDB, delegates to fetchTmdbRecommendations.
 */
export async function fetchRelatedMedia(
  media: MediaItem,
  limit: number = 6
): Promise<MediaItem[]> {
  const parsed = parseMediaId(media.id);
  if (!parsed) return [];

  // If recommendations were already attached to the item (MAL details response), use them
  if (media.related && media.related.length > 0) {
    return media.related.slice(0, limit);
  }

  if (parsed.source === "tmdb" && (parsed.type === "movie" || parsed.type === "tv")) {
    return fetchTmdbRecommendations(parsed.type, parsed.externalId, limit);
  }

  if (parsed.source === "mal") {
    try {
      const fresh =
        parsed.type === "anime"
          ? await fetchMalAnime(parsed.externalId)
          : await fetchMalManga(parsed.externalId);
      return fresh?.related?.slice(0, limit) || [];
    } catch {
      return [];
    }
  }

  return [];
}

export interface DiscoverResult {
  items: MediaItem[];
  page: number;
  totalPages: number;
  totalResults: number;
  partialNotice?: string;
  failedProvider?: "TMDB" | "MyAnimeList" | "The catalogue";
}

export interface FetchDiscoverCatalogueOptions {
  q?: string;
  category?: "all" | "movies" | "series" | "anime" | "comics" | "novels";
  genre?: string;
  sort?: DiscoverSortOption;
  page?: number;
}

/**
 * Server-side catalogue engine for Discover across TMDB and MyAnimeList.
 */
export async function fetchDiscoverCatalogue(
  options: FetchDiscoverCatalogueOptions
): Promise<DiscoverResult | null> {
  const category = options.category || "all";
  const sort = normalizeSortForCategory(category, options.sort);
  const page = Math.max(1, Math.min(500, options.page || 1));
  const query = options.q?.trim();
  const cleanQuery = query && query.length >= 3 ? query : undefined;
  const genre = options.genre;

  // 1. Single Category: Movies (TMDB)
  if (category === "movies") {
    try {
      const res = await discoverTmdbSource({
        type: "movie",
        q: cleanQuery,
        genre,
        sort,
        page,
        limit: 20,
      });
      if (!res) return { items: [], page: 1, totalPages: 1, totalResults: 0, failedProvider: "TMDB" };
      return {
        items: res.items,
        page: res.page,
        totalPages: res.totalPages,
        totalResults: res.totalResults,
      };
    } catch (err) {
      if (err instanceof TmdbUnavailableError || err instanceof ProviderUnavailableError) {
        return { items: [], page: 1, totalPages: 1, totalResults: 0, failedProvider: "TMDB" };
      }
      throw err;
    }
  }

  // 2. Single Category: Series (TMDB)
  if (category === "series") {
    try {
      const res = await discoverTmdbSource({
        type: "tv",
        q: cleanQuery,
        genre,
        sort,
        page,
        limit: 20,
      });
      if (!res) return { items: [], page: 1, totalPages: 1, totalResults: 0, failedProvider: "TMDB" };
      return {
        items: res.items,
        page: res.page,
        totalPages: res.totalPages,
        totalResults: res.totalResults,
      };
    } catch (err) {
      if (err instanceof TmdbUnavailableError || err instanceof ProviderUnavailableError) {
        return { items: [], page: 1, totalPages: 1, totalResults: 0, failedProvider: "TMDB" };
      }
      throw err;
    }
  }

  // 3. Single Category: Anime (MyAnimeList)
  if (category === "anime") {
    try {
      const res = await discoverMalCatalogue({
        type: "anime",
        q: cleanQuery,
        genre,
        sort,
        page,
        limit: 20,
      });
      return {
        items: res.items,
        page: res.page,
        totalPages: res.totalPages,
        totalResults: res.totalResults,
      };
    } catch (err) {
      if (err instanceof MalUnavailableError || err instanceof ProviderUnavailableError) {
        return { items: [], page: 1, totalPages: 1, totalResults: 0, failedProvider: "MyAnimeList" };
      }
      throw err;
    }
  }

  // 4. Single Category: Comics (MyAnimeList manga/manhwa/manhua)
  if (category === "comics") {
    try {
      const res = await discoverMalCatalogue({
        type: "manga",
        q: cleanQuery,
        genre,
        sort,
        page,
        limit: 20,
      });
      return {
        items: res.items,
        page: res.page,
        totalPages: res.totalPages,
        totalResults: res.totalResults,
      };
    } catch (err) {
      if (err instanceof MalUnavailableError || err instanceof ProviderUnavailableError) {
        return { items: [], page: 1, totalPages: 1, totalResults: 0, failedProvider: "MyAnimeList" };
      }
      throw err;
    }
  }

  // 5. Category "all": Interleave TMDB Movies + TMDB Series + MAL Anime + MAL Manga
  // Fetch up to 5 items per source to keep the total page size (~20 items) aligned with single tabs.
  const [moviesSettled, seriesSettled, animeSettled, mangaSettled] = await Promise.allSettled([
    discoverTmdbSource({ type: "movie", q: cleanQuery, genre, sort, page, limit: 5 }),
    discoverTmdbSource({ type: "tv", q: cleanQuery, genre, sort, page, limit: 5 }),
    discoverMalCatalogue({ type: "anime", q: cleanQuery, genre, sort, page, limit: 5 }),
    discoverMalCatalogue({ type: "manga", q: cleanQuery, genre, sort, page, limit: 5 }),
  ]);

  const moviesRes = moviesSettled.status === "fulfilled" ? moviesSettled.value : null;
  const seriesRes = seriesSettled.status === "fulfilled" ? seriesSettled.value : null;
  const animeRes = animeSettled.status === "fulfilled" ? animeSettled.value : null;
  const mangaRes = mangaSettled.status === "fulfilled" ? mangaSettled.value : null;

  const allFailed = !moviesRes && !seriesRes && !animeRes && !mangaRes;
  if (allFailed) {
    return { items: [], page: 1, totalPages: 1, totalResults: 0, failedProvider: "The catalogue" };
  }

  // Interleave round-robin: Movie -> Anime -> TV Series -> Manga
  const lists: MediaItem[][] = [
    moviesRes?.items || [],
    animeRes?.items || [],
    seriesRes?.items || [],
    mangaRes?.items || [],
  ];

  const combined: MediaItem[] = [];
  const maxLen = Math.max(0, ...lists.map((l) => l.length));
  for (let i = 0; i < maxLen; i++) {
    for (const list of lists) {
      if (list[i]) combined.push(list[i]);
    }
  }

  const hasAnyMore =
    Boolean(moviesRes?.hasNext) ||
    Boolean(seriesRes?.hasNext) ||
    Boolean(animeRes?.hasNext) ||
    Boolean(mangaRes?.hasNext);

  const totalPages = hasAnyMore ? page + 1 : page;

  const tmdbMoviesFailed = moviesSettled.status === "rejected" || !moviesRes;
  const tmdbSeriesFailed = seriesSettled.status === "rejected" || !seriesRes;
  const malAnimeFailed = animeSettled.status === "rejected" || !animeRes;
  const malMangaFailed = mangaSettled.status === "rejected" || !mangaRes;

  const tmdbAnyFailed = tmdbMoviesFailed || tmdbSeriesFailed;
  const malAnyFailed = malAnimeFailed || malMangaFailed;
  const tmdbSucceeded = !tmdbMoviesFailed || !tmdbSeriesFailed;
  const malSucceeded = !malAnimeFailed || !malMangaFailed;

  let partialNotice: string | undefined;
  if (malAnyFailed && tmdbSucceeded && !tmdbAnyFailed) {
    partialNotice = "MyAnimeList is unavailable right now, showing TMDB results.";
  } else if (tmdbAnyFailed && malSucceeded && !malAnyFailed) {
    partialNotice = "TMDB is unavailable right now, showing MyAnimeList results.";
  } else if (tmdbAnyFailed || malAnyFailed) {
    partialNotice = "Some results couldn't be loaded right now. Showing available titles.";
  }

  return {
    items: combined,
    page,
    totalPages,
    totalResults:
      (moviesRes?.totalResults || 0) +
      (seriesRes?.totalResults || 0) +
      (animeRes?.totalResults || 0) +
      (mangaRes?.totalResults || 0),
    partialNotice,
  };
}

/**
 * Top popular items across providers for homepage featured showcase (top 5, cached 24h).
 * Composition: 2 from TMDB (1 movie, 1 tv) and 3 from MAL (2 anime, 1 manga).
 */
export async function fetchHomeFeaturedTitles(limit: number = 5): Promise<MediaItem[]> {
  const [moviesSettled, tvSettled, animeSettled, mangaSettled] = await Promise.allSettled([
    getPopularTmdbMovies(1),
    getPopularTmdbTv(1),
    fetchMalAnimeRanking("bypopularity", 6, 0),
    fetchMalMangaRanking("bypopularity", 4, 0),
  ]);

  const movieGenres = await getMovieGenreMap().catch(() => new Map<number, string>());
  const tvGenres = await getTvGenreMap().catch(() => new Map<number, string>());

  const moviesRes = moviesSettled.status === "fulfilled" ? moviesSettled.value : null;
  const tvRes = tvSettled.status === "fulfilled" ? tvSettled.value : null;
  const animeRes = animeSettled.status === "fulfilled" ? animeSettled.value : null;
  const mangaRes = mangaSettled.status === "fulfilled" ? mangaSettled.value : null;

  const movies = (moviesRes?.results || [])
    .slice(0, 2)
    .map((m) => mapTmdbListItemToMedia(m, "movie", movieGenres));

  const tv = (tvRes?.results || [])
    .slice(0, 2)
    .map((t) => mapTmdbListItemToMedia(t, "tv", tvGenres));

  const anime = (animeRes?.data || [])
    .map((e) => mapMalListItemToMedia(e.node, "anime"))
    .filter((i): i is MediaItem => Boolean(i))
    .slice(0, 2);

  const manga = (mangaRes?.data || [])
    .map((e) => mapMalListItemToMedia(e.node, "manga"))
    .filter((i): i is MediaItem => Boolean(i))
    .slice(0, 1);

  // Preferred distribution: 1 Movie, 1 Anime, 1 TV Series, 1 Manga, 1 Anime
  const slots: (MediaItem | undefined)[] = [
    movies[0],
    anime[0],
    tv[0],
    manga[0],
    anime[1],
  ];

  const featured: MediaItem[] = slots.filter((item): item is MediaItem => Boolean(item));

  // If one source failed, supplement from the remaining pool
  if (featured.length < limit) {
    const backupPool = [
      ...movies.slice(1),
      ...tv.slice(1),
      ...anime.slice(2),
      ...manga.slice(1),
    ];
    for (const item of backupPool) {
      if (featured.length >= limit) break;
      if (!featured.some((f) => f.id === item.id)) {
        featured.push(item);
      }
    }
  }

  return featured.slice(0, limit);
}

export {
  fetchTmdbRecommendations,
  fetchMalAnime,
  fetchMalManga,
  discoverMalCatalogue,
  ProviderNotFoundError,
  ProviderUnavailableError,
  TmdbUnavailableError,
  TmdbNotFoundError,
  MalNotFoundError,
  MalUnavailableError,
  DISCOVER_GENRES,
  type DiscoverSortOption,
};
