import type { MediaItem } from "./media";

export type LibraryStatus = "In Progress" | "Planned" | "Completed" | "Dropped";

export type MediaCategory = "Anime" | "Comics" | "Movies" | "Series" | "Novels";

export type LibrarySortOption = "recent" | "progress" | "rating" | "title";

export interface LibraryEntry {
  mediaId: string;
  status: LibraryStatus;
  currentProgress: number;
  userRating: number | null; // User's personal rating out of 10, or null if unrated
  notes?: string;
  lastUpdated: string; // ISO date string
  addedAt: string; // ISO date string
}

export interface LibraryItem extends LibraryEntry {
  media: MediaItem;
}
