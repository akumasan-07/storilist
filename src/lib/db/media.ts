import { createClient } from "@/lib/supabase/server";
import { MediaItem } from "@/types/media";
import { MediaCategory } from "@/types/library";

export interface MediaRow {
  id: string;
  title: string;
  category: string;
  format: string;
  studio: string;
  poster: string;
  synopsis: string;
  genres: string[] | null;
  rating: number | string | null;
  start_year: number;
  end_year: number | null;
  total_progress: number | null;
  progress_unit: string;
  release_status: string;
  creators: string[] | null;
  tagline: string | null;
  created_at: string;
}

export function mapMediaRowToItem(row: MediaRow): MediaItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category as MediaCategory,
    format: row.format,
    studio: row.studio,
    startYear: row.start_year,
    endYear: row.end_year,
    rating: row.rating !== null ? Number(row.rating) : 0,
    genres: row.genres ?? [],
    poster: row.poster,
    synopsis: row.synopsis ?? "",
    totalProgress: row.total_progress,
    progressUnit: row.progress_unit,
    releaseStatus: row.release_status as "Completed" | "Ongoing",
    creators: row.creators ?? undefined,
    tagline: row.tagline ?? undefined,
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
