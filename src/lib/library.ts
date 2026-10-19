import { LibraryEntry } from "@/types/library";
import { MediaItem } from "@/types/media";

/**
 * Normalizes a library entry preserving established status transition rules:
 * - Dropped status is strictly preserved.
 * - Current progress of 0 normalizes to "Planned".
 * - Otherwise, retains current status.
 */
export function normalizeEntry(entry: LibraryEntry): LibraryEntry {
  return {
    ...entry,
    status:
      entry.status === "Dropped"
        ? "Dropped"
        : entry.currentProgress === 0
          ? "Planned"
          : entry.status,
  };
}

/**
 * Creates a default Planned library entry from a media item.
 */
export function createEntryFromMedia(media: MediaItem): LibraryEntry {
  const now = new Date().toISOString();
  return {
    mediaId: media.id,
    status: "Planned",
    currentProgress: 0,
    userRating: null,
    lastUpdated: now,
    addedAt: now,
  };
}

/**
 * Calculates an integer progress percentage (0–100). Returns 0 for ongoing / unannounced totals.
 */
export function getProgressPercent(current: number, total: number | null): number {
  if (!total || total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((current / total) * 100)));
}
