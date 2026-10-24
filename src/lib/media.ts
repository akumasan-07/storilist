import { MediaCategory } from "@/types/library";

export interface CategoryMeta {
  badge: string;
  style: string;
}

export const CATEGORY_META: Record<MediaCategory, CategoryMeta> = {
  Anime: {
    badge: "ANIME",
    style: "border-accent-anime/40 bg-accent-anime/15 text-accent-anime",
  },
  Comics: {
    badge: "COMIC",
    style: "border-accent-comic/40 bg-accent-comic/15 text-accent-comic",
  },
  Movies: {
    badge: "MOVIE",
    style: "border-accent-movie/40 bg-accent-movie/15 text-accent-movie",
  },
  Series: {
    badge: "SERIES",
    style: "border-accent-series/40 bg-accent-series/15 text-accent-series",
  },
  Novels: {
    badge: "NOVEL",
    style: "border-accent-novel/40 bg-accent-novel/15 text-accent-novel",
  },
};

export function getCategoryMeta(category?: string | null): CategoryMeta {
  if (!category) return CATEGORY_META.Anime;
  if (category in CATEGORY_META) {
    return CATEGORY_META[category as MediaCategory];
  }
  const normalized = (category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()) as MediaCategory;
  if (normalized in CATEGORY_META) {
    return CATEGORY_META[normalized];
  }
  return {
    badge: category.toUpperCase(),
    style: "border-border bg-muted text-muted-foreground",
  };
}

export function formatYear(media: {
  startYear: number;
  endYear: number | null;
  releaseStatus?: string;
}): string {
  if (!media.startYear || media.startYear === 0) {
    return "";
  }
  if (media.endYear === null) {
    return media.releaseStatus === "Ongoing"
      ? `${media.startYear}–Present`
      : `${media.startYear}`;
  }
  if (media.endYear === media.startYear) {
    return `${media.startYear}`;
  }
  return `${media.startYear}–${media.endYear}`;
}
