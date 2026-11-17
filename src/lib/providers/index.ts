/**
 * External Catalogue Providers Dispatcher
 *
 * Provides media ID parsing and dispatching across catalogue providers.
 * Structured so MAL and OpenLibrary can be added as sibling modules with the same shapes.
 */

import { MediaItem } from "@/types/media";
import {
  fetchTmdbMovie,
  fetchTmdbTv,
  fetchDiscoverCatalogue,
  fetchTmdbRecommendations,
  fetchHomeFeaturedTitles,
  TmdbUnavailableError,
  TmdbNotFoundError,
  DISCOVER_GENRES,
  type DiscoverSortOption,
  type DiscoverResult,
} from "./tmdb";
import {
  fetchMalAnime,
  fetchMalManga,
  MalNotFoundError,
  MalUnavailableError,
} from "./mal";
import {
  ProviderNotFoundError,
  ProviderUnavailableError,
} from "./http";

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

export {
  fetchDiscoverCatalogue,
  fetchTmdbRecommendations,
  fetchHomeFeaturedTitles,
  fetchMalAnime,
  fetchMalManga,
  ProviderNotFoundError,
  ProviderUnavailableError,
  TmdbUnavailableError,
  TmdbNotFoundError,
  MalNotFoundError,
  MalUnavailableError,
  DISCOVER_GENRES,
  type DiscoverSortOption,
  type DiscoverResult,
};
