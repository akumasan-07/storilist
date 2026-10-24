import type { MediaCategory } from "./library";

export type MediaSource = "tmdb" | "mal" | "openlibrary";

export interface MediaItem {
  id: string;
  title: string;
  category: MediaCategory;
  format: string;
  studio: string;
  startYear: number;
  endYear: number | null; // null for ongoing or single-year
  rating: number;
  genres: string[];
  poster: string;
  synopsis: string;
  totalProgress: number | null; // null for ongoing serialization without fixed total
  progressUnit: string; // "episodes" | "chapters" | "mins" | "volumes"
  releaseStatus: "Completed" | "Ongoing";
  creators?: string[];
  tagline?: string;
  source?: MediaSource | null;
  externalId?: string | null;
  fetchedAt?: string | null;
}
