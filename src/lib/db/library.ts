import { createClient } from "@/lib/supabase/server";
import { LibraryEntry, LibraryItem, LibraryStatus } from "@/types/library";
import { MediaRow, mapMediaRowToItem } from "./media";

export interface LibraryEntryRow {
  user_id: string;
  media_id: string;
  status: string;
  current_progress: number;
  user_rating: number | string | null;
  notes: string | null;
  added_at: string;
  last_updated: string;
}

interface LibraryJoinedRow extends LibraryEntryRow {
  media: MediaRow | MediaRow[] | null;
}

export function mapLibraryEntryRowToEntry(row: LibraryEntryRow): LibraryEntry {
  return {
    mediaId: row.media_id,
    status: row.status as LibraryStatus,
    currentProgress: row.current_progress,
    userRating: row.user_rating !== null ? Number(row.user_rating) : null,
    notes: row.notes ?? undefined,
    addedAt: row.added_at,
    lastUpdated: row.last_updated,
  };
}

export async function getUserLibraryItems(userId?: string): Promise<LibraryItem[]> {
  const supabase = await createClient();

  let targetUserId = userId;
  if (!targetUserId) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];
    targetUserId = user.id;
  }

  const { data, error } = await supabase
    .from("library_entries")
    .select("*, media:media(*)")
    .eq("user_id", targetUserId)
    .order("last_updated", { ascending: false });

  if (error || !data) {
    console.error("Failed to fetch user library items:", error);
    return [];
  }

  const items: LibraryItem[] = [];

  for (const raw of data as unknown as LibraryJoinedRow[]) {
    const mediaRow = Array.isArray(raw.media) ? raw.media[0] : raw.media;
    if (!mediaRow) continue;

    const entry = mapLibraryEntryRowToEntry(raw);
    const media = mapMediaRowToItem(mediaRow);

    items.push({
      ...entry,
      media,
    });
  }

  return items;
}

export async function upsertLibraryEntry(
  userId: string,
  entry: {
    mediaId: string;
    status: LibraryStatus;
    currentProgress: number;
    userRating?: number | null;
    notes?: string | null;
  }
): Promise<LibraryEntry> {
  const supabase = await createClient();

  const payload: {
    user_id: string;
    media_id: string;
    status: string;
    current_progress: number;
    user_rating: number | null;
    notes: string | null;
    last_updated: string;
  } = {
    user_id: userId,
    media_id: entry.mediaId,
    status: entry.status,
    current_progress: entry.currentProgress,
    user_rating: entry.userRating ?? null,
    notes: entry.notes ?? null,
    last_updated: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("library_entries")
    .upsert(payload, { onConflict: "user_id,media_id" })
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to upsert library entry");
  }

  return mapLibraryEntryRowToEntry(data as LibraryEntryRow);
}

export async function deleteLibraryEntry(
  userId: string,
  mediaId: string
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("library_entries")
    .delete()
    .eq("user_id", userId)
    .eq("media_id", mediaId);

  if (error) {
    throw new Error(error.message || "Failed to delete library entry");
  }
}
