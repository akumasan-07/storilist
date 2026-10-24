/**
 * External Catalogue Providers Dispatcher
 *
 * Provides media ID parsing and dispatching across catalogue providers.
 * Structured so MAL and OpenLibrary can be added as sibling modules with the same shapes.
 */

import { MediaItem } from "@/types/media";
import { fetchTmdbMovie, fetchTmdbTv } from "./tmdb";

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

  // Future provider regex patterns (e.g. MAL, OpenLibrary) can be added here cleanly

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

  return null;
}
