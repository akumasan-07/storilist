/**
 * MyAnimeList (MAL) External Catalogue Provider
 *
 * Server-only module for fetching and mapping anime and manga
 * from the MyAnimeList API v2.
 */

import { MediaItem, ReleaseStatus } from "@/types/media";
import { providerFetch, MalNotFoundError, MalUnavailableError } from "./http";

export { MalNotFoundError, MalUnavailableError };

if (typeof window !== "undefined") {
  throw new Error("mal.ts may only be executed on the server.");
}

const MAL_BASE_URL = "https://api.myanimelist.net/v2";

export interface MalPicture {
  medium?: string;
  large?: string;
}

export interface MalGenre {
  id: number;
  name: string;
}

export interface MalStudio {
  id: number;
  name: string;
}

export interface MalAuthorNode {
  id: number;
  first_name?: string;
  last_name?: string;
}

export interface MalAuthor {
  node: MalAuthorNode;
  role?: string;
}

export interface MalSerializationNode {
  id: number;
  name: string;
}

export interface MalSerialization {
  node: MalSerializationNode;
}

export interface MalRecommendationNode {
  id: number;
  title: string;
  main_picture?: MalPicture;
}

export interface MalRecommendation {
  node: MalRecommendationNode;
  num_recommendations?: number;
}

export interface MalAnimeDetail {
  id: number;
  title: string;
  main_picture?: MalPicture;
  start_date?: string;
  end_date?: string;
  synopsis?: string;
  mean?: number;
  genres?: MalGenre[];
  media_type?: string;
  status?: string;
  nsfw?: string;
  num_episodes?: number;
  studios?: MalStudio[];
  recommendations?: MalRecommendation[];
}

export interface MalMangaDetail {
  id: number;
  title: string;
  main_picture?: MalPicture;
  start_date?: string;
  end_date?: string;
  synopsis?: string;
  mean?: number;
  genres?: MalGenre[];
  media_type?: string;
  status?: string;
  nsfw?: string;
  num_chapters?: number;
  num_volumes?: number;
  authors?: MalAuthor[];
  serialization?: MalSerialization[];
  recommendations?: MalRecommendation[];
}

const ANIME_MEDIA_TYPE_MAP: Record<string, string> = {
  tv: "TV Series",
  movie: "Movie",
  ova: "OVA",
  ona: "ONA",
  special: "Special",
  tv_special: "TV Special",
};

const MANGA_MEDIA_TYPE_MAP: Record<string, string> = {
  manga: "Manga",
  manhwa: "Manhwa",
  manhua: "Manhua",
  one_shot: "One-shot",
  oel: "OEL Manga",
};

function parseMalYear(dateStr?: string | null): number {
  if (!dateStr) return 0;
  const match = dateStr.match(/^(\d{4})/);
  if (match) {
    return parseInt(match[1], 10) || 0;
  }
  return 0;
}

export function mapMalAnimeToItem(data: MalAnimeDetail): MediaItem | null {
  // Family-friendly: non-white NSFW entries are treated as not found
  if (data.nsfw !== "white") {
    return null;
  }

  const format = data.media_type ? ANIME_MEDIA_TYPE_MAP[data.media_type] : undefined;
  if (!format) {
    // Unsupported formats (music, pv, cm, unknown) are treated as not found
    return null;
  }

  const startYear = parseMalYear(data.start_date);

  let releaseStatus: ReleaseStatus = "Ongoing";
  if (data.status === "finished_airing") {
    releaseStatus = "Completed";
  } else if (data.status === "not_yet_aired") {
    releaseStatus = "Upcoming";
  } else {
    // currently_airing, on_hiatus, or default
    releaseStatus = "Ongoing";
  }

  let endYear: number | null = null;
  if (releaseStatus === "Completed") {
    endYear = parseMalYear(data.end_date) || startYear;
  }

  const totalProgress =
    typeof data.num_episodes === "number" && data.num_episodes > 0
      ? data.num_episodes
      : null;

  const studio = data.studios?.[0]?.name || "";
  const rating =
    typeof data.mean === "number" && data.mean > 0
      ? Math.round(data.mean * 10) / 10
      : 0;

  const genres = (data.genres || [])
    .map((g) => g.name)
    .filter(Boolean);

  const poster =
    data.main_picture?.large || data.main_picture?.medium || "";

  const related: MediaItem[] = (data.recommendations || [])
    .slice(0, 6)
    .map((rec) => ({
      id: `mal-anime-${rec.node.id}`,
      title: rec.node.title,
      category: "Anime",
      format: "Anime",
      studio: "",
      startYear: 0,
      endYear: null,
      rating: 0,
      genres: [],
      poster: rec.node.main_picture?.large || rec.node.main_picture?.medium || "",
      synopsis: "",
      totalProgress: null,
      progressUnit: "episodes",
      releaseStatus: "Completed",
      source: "mal",
      externalId: String(rec.node.id),
      fetchedAt: new Date().toISOString(),
    }));

  return {
    id: `mal-anime-${data.id}`,
    title: data.title,
    category: "Anime",
    format,
    studio,
    startYear,
    endYear,
    rating,
    genres,
    poster,
    synopsis: data.synopsis || "",
    totalProgress,
    progressUnit: "episodes",
    releaseStatus,
    creators: [],
    source: "mal",
    externalId: String(data.id),
    fetchedAt: new Date().toISOString(),
    related,
  };
}

export function mapMalMangaToItem(data: MalMangaDetail): MediaItem | null {
  // Family-friendly: non-white NSFW entries are treated as not found
  if (data.nsfw !== "white") {
    return null;
  }

  const format = data.media_type ? MANGA_MEDIA_TYPE_MAP[data.media_type] : undefined;
  if (!format) {
    // Unsupported formats (novel, light_novel, doujinshi, unknown) treated as not found
    return null;
  }

  const startYear = parseMalYear(data.start_date);

  let releaseStatus: ReleaseStatus = "Ongoing";
  if (data.status === "finished") {
    releaseStatus = "Completed";
  } else if (data.status === "not_yet_published") {
    releaseStatus = "Upcoming";
  } else {
    // currently_publishing, on_hiatus, or default
    releaseStatus = "Ongoing";
  }

  let endYear: number | null = null;
  if (releaseStatus === "Completed") {
    endYear = parseMalYear(data.end_date) || startYear;
  }

  const hasChapters = typeof data.num_chapters === "number" && data.num_chapters > 0;
  const hasVolumes = typeof data.num_volumes === "number" && data.num_volumes > 0;

  let progressUnit = "chapters";
  let totalProgress: number | null = null;

  if (hasChapters) {
    progressUnit = "chapters";
    totalProgress = data.num_chapters!;
  } else if (hasVolumes) {
    progressUnit = "volumes";
    totalProgress = data.num_volumes!;
  } else {
    progressUnit = "chapters";
    totalProgress = null;
  }

  const studio = data.serialization?.[0]?.node?.name || "";

  const creators = (data.authors || [])
    .map((a) =>
      [a.node?.first_name, a.node?.last_name]
        .filter(Boolean)
        .join(" ")
        .trim()
    )
    .filter((name) => name.length > 0);

  const rating =
    typeof data.mean === "number" && data.mean > 0
      ? Math.round(data.mean * 10) / 10
      : 0;

  const genres = (data.genres || [])
    .map((g) => g.name)
    .filter(Boolean);

  const poster =
    data.main_picture?.large || data.main_picture?.medium || "";

  const related: MediaItem[] = (data.recommendations || [])
    .slice(0, 6)
    .map((rec) => ({
      id: `mal-manga-${rec.node.id}`,
      title: rec.node.title,
      category: "Comics",
      format: "Manga",
      studio: "",
      startYear: 0,
      endYear: null,
      rating: 0,
      genres: [],
      poster: rec.node.main_picture?.large || rec.node.main_picture?.medium || "",
      synopsis: "",
      totalProgress: null,
      progressUnit: "chapters",
      releaseStatus: "Completed",
      source: "mal",
      externalId: String(rec.node.id),
      fetchedAt: new Date().toISOString(),
    }));

  return {
    id: `mal-manga-${data.id}`,
    title: data.title,
    category: "Comics",
    format,
    studio,
    startYear,
    endYear,
    rating,
    genres,
    poster,
    synopsis: data.synopsis || "",
    totalProgress,
    progressUnit,
    releaseStatus,
    creators: creators.length > 0 ? creators : undefined,
    source: "mal",
    externalId: String(data.id),
    fetchedAt: new Date().toISOString(),
    related,
  };
}

const ANIME_FIELDS = [
  "id",
  "title",
  "main_picture",
  "start_date",
  "end_date",
  "synopsis",
  "mean",
  "genres",
  "media_type",
  "status",
  "nsfw",
  "num_episodes",
  "studios",
  "recommendations",
].join(",");

const MANGA_FIELDS = [
  "id",
  "title",
  "main_picture",
  "start_date",
  "end_date",
  "synopsis",
  "mean",
  "genres",
  "media_type",
  "status",
  "nsfw",
  "num_chapters",
  "num_volumes",
  "authors{first_name,last_name}",
  "serialization",
  "recommendations",
].join(",");

export async function fetchMalAnime(externalId: string): Promise<MediaItem | null> {
  const clientId = process.env.MAL_CLIENT_ID;
  if (!clientId) {
    console.warn("[MAL] MAL_CLIENT_ID is not configured.");
    throw new MalUnavailableError("MAL_CLIENT_ID is not configured.");
  }

  const data = await providerFetch<MalAnimeDetail>({
    providerName: "MAL",
    url: `${MAL_BASE_URL}/anime/${externalId}?fields=${ANIME_FIELDS}`,
    headers: {
      "X-MAL-CLIENT-ID": clientId,
    },
    revalidateSeconds: 86400,
    createUnavailableError: (msg, cause) => new MalUnavailableError(msg, cause),
  });

  if (!data || !data.id || !data.title) {
    return null;
  }

  return mapMalAnimeToItem(data);
}

export async function fetchMalManga(externalId: string): Promise<MediaItem | null> {
  const clientId = process.env.MAL_CLIENT_ID;
  if (!clientId) {
    console.warn("[MAL] MAL_CLIENT_ID is not configured.");
    throw new MalUnavailableError("MAL_CLIENT_ID is not configured.");
  }

  const data = await providerFetch<MalMangaDetail>({
    providerName: "MAL",
    url: `${MAL_BASE_URL}/manga/${externalId}?fields=${MANGA_FIELDS}`,
    headers: {
      "X-MAL-CLIENT-ID": clientId,
    },
    revalidateSeconds: 86400,
    createUnavailableError: (msg, cause) => new MalUnavailableError(msg, cause),
  });

  if (!data || !data.id || !data.title) {
    return null;
  }

  return mapMalMangaToItem(data);
}

