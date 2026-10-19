import { MediaCategory } from "./library";

export interface MediaItem {
  id: string;
  title: string;
  category: MediaCategory;
  badge: string;
  badgeStyle: string;
  format: string;
  studio: string;
  year: string;
  rating: string;
  genres: string[];
  poster: string;
  synopsis: string;
  totalProgress: number | null; // null for ongoing serialization without fixed total
  progressUnit: string; // "episodes" | "chapters" | "mins" | "volumes"
  releaseStatus: "Completed" | "Ongoing";
  creators?: string[];
  tagline?: string;
}
