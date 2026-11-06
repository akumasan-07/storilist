"use client";

import { Sparkles, BookOpen, BookText, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface DiscoverComingSoonProps {
  category: "anime" | "comics" | "novels";
}

const CATEGORY_DETAILS: Record<
  "anime" | "comics" | "novels",
  { label: string; icon: typeof Sparkles; provider: string }
> = {
  anime: {
    label: "Anime",
    icon: Sparkles,
    provider: "AniList",
  },
  comics: {
    label: "Comics & Manga",
    icon: BookOpen,
    provider: "MangaUpdates / ComicVine",
  },
  novels: {
    label: "Light Novels & Books",
    icon: BookText,
    provider: "Open Library & Google Books",
  },
};

export default function DiscoverComingSoon({ category }: DiscoverComingSoonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const details = CATEGORY_DETAILS[category] || CATEGORY_DETAILS.anime;
  const CategoryIcon = details.icon;

  const handleSwitchToMovies = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", "all");
    params.delete("page");
    router.replace(`/discover?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="mt-12 rounded-2xl border border-dashed border-border bg-card/40 p-8 sm:p-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <CategoryIcon className="h-7 w-7" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-lg font-bold text-foreground">
        {details.label} integration is coming soon
      </h2>
      <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-muted-foreground leading-relaxed">
        Live catalogue browsing is currently powered by TMDB for Movies and Series.
        We are actively preparing dedicated metadata connections (via {details.provider}) to bring full coverage for {details.label.toLowerCase()}.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleSwitchToMovies}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary-hover transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
        >
          <span>Explore All Formats</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
