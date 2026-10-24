import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { MediaItem, MediaSource } from "@/types/media";
import { MediaCategory } from "@/types/library";

export interface MediaRow {
  id: string;
  title: string;
  category: string;
  format: string | null;
  studio: string | null;
  poster: string | null;
  synopsis: string | null;
  genres: string[] | null;
  rating: number | string | null;
  start_year: number | null;
  end_year: number | null;
  total_progress: number | null;
  progress_unit: string;
  release_status: string;
  creators: string[] | null;
  tagline: string | null;
  source: string | null;
  external_id: string | null;
  fetched_at: string | null;
  created_at: string;
}

export function mapMediaRowToItem(row: MediaRow): MediaItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category as MediaCategory,
    format: row.format ?? "Standard",
    studio: row.studio ?? "",
    startYear: row.start_year ?? 0,
    endYear: row.end_year,
    rating: row.rating !== null ? Number(row.rating) : 0,
    genres: row.genres ?? [],
    poster: row.poster ?? "",
    synopsis: row.synopsis ?? "",
    totalProgress: row.total_progress,
    progressUnit: row.progress_unit,
    releaseStatus: (row.release_status as "Completed" | "Ongoing") || "Completed",
    creators: row.creators ?? undefined,
    tagline: row.tagline ?? undefined,
    source: (row.source as MediaSource) ?? null,
    externalId: row.external_id ?? null,
    fetchedAt: row.fetched_at ?? null,
  };
}

export async function getAllMedia(): Promise<MediaItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .order("rating", { ascending: false });

  if (error || !data) {
    console.error("Failed to fetch media catalogue:", error);
    return [];
  }

  return (data as MediaRow[]).map(mapMediaRowToItem);
}

export async function getMediaById(id: string): Promise<MediaItem | null> {
  if (!id) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapMediaRowToItem(data as MediaRow);
}

export async function getRelatedMedia(
  category: MediaCategory,
  excludeId: string,
  limit: number = 4
): Promise<MediaItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .eq("category", category)
    .neq("id", excludeId)
    .order("rating", { ascending: false })
    .limit(limit);

  if (error || !data) {
    console.error("Failed to fetch related media:", error);
    return [];
  }

  return (data as MediaRow[]).map(mapMediaRowToItem);
}

/**
 * Upserts a media item imported from an external provider (TMDB, etc.).
 * PRIVILEGED: Uses the service-role admin client to write to the media catalogue.
 */
export async function upsertMediaFromProvider(item: MediaItem): Promise<MediaItem> {
  const admin = createAdminClient();

  const fetchedAt = item.fetchedAt || new Date().toISOString();
  const row = {
    id: item.id,
    title: item.title,
    category: item.category,
    format: item.format,
    studio: item.studio || "",
    poster: item.poster || null,
    synopsis: item.synopsis || "",
    genres: item.genres || [],
    rating: item.rating,
    start_year: item.startYear,
    end_year: item.endYear,
    total_progress: item.totalProgress,
    progress_unit: item.progressUnit,
    release_status: item.releaseStatus,
    creators: item.creators || [],
    tagline: item.tagline || null,
    source: item.source || null,
    external_id: item.externalId || null,
    fetched_at: fetchedAt,
  };

  const { data, error } = await admin
    .from("media")
    .upsert(row, { onConflict: "source,external_id" })
    .select("*")
    .single();

  if (error || !data) {
    console.error("Failed to upsert media from provider:", error);
    throw new Error(error?.message || "Failed to upsert media from provider");
  }

  return mapMediaRowToItem(data as MediaRow);
}
