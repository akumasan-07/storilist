export type LibraryStatus = "In Progress" | "Planned" | "Completed" | "Dropped";

export type MediaCategory = "Anime" | "Comics" | "Movies" | "Series" | "Novels";

export type LibrarySortOption = "recent" | "progress" | "rating" | "title";

export interface LibraryEntry {
  id: string;
  title: string;
  category: MediaCategory;
  format: string;
  studio: string;
  poster: string;
  year: string;
  status: LibraryStatus;
  currentProgress: number;
  totalProgress: number | null; // null if ongoing without announced total
  progressUnit: string; // "episodes" | "chapters" | "volumes" | "mins"
  userRating: number | null; // User's personal rating out of 10, or null if unrated
  communityRating: string;
  notes?: string;
  lastUpdated: string; // ISO date string
  addedAt: string; // ISO date string
}
