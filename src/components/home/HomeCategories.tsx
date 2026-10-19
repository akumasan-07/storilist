import {
  Sparkles,
  BookOpen,
  Clapperboard,
  Tv,
  BookText,
  Check,
} from "lucide-react";
import Container from "@/components/Container";

const MEDIA_CATEGORIES = [
  {
    key: "anime",
    title: "Anime",
    tagline: "TV Series • Films • OVAs",
    description: "Track seasonal broadcasts, film premieres, and episode-by-episode watch progress.",
    badge: "ANIME",
    icon: Sparkles,
    accentBorder: "border-accent-anime/30",
    accentBg: "bg-accent-anime/10",
    accentText: "text-accent-anime",
    hoverBorder: "hover:border-accent-anime/50",
    hoverBg: "group-hover:bg-accent-anime/15",
    highlight: "Episode logs & season archives",
  },
  {
    key: "comics",
    title: "Comics",
    tagline: "Manga • Manhwa • Graphic Novels",
    description: "Keep tabs on released chapters, volume collections, and weekly serialized reading.",
    badge: "COMIC",
    icon: BookOpen,
    accentBorder: "border-accent-comic/30",
    accentBg: "bg-accent-comic/10",
    accentText: "text-accent-comic",
    hoverBorder: "hover:border-accent-comic/50",
    hoverBg: "group-hover:bg-accent-comic/15",
    highlight: "Chapter & volume steppers",
  },
  {
    key: "movies",
    title: "Movies",
    tagline: "Cinema • Indies • Documentaries",
    description: "Log feature films, personal cinema viewings, rewatch counts, and private ratings.",
    badge: "MOVIE",
    icon: Clapperboard,
    accentBorder: "border-accent-movie/30",
    accentBg: "bg-accent-movie/10",
    accentText: "text-accent-movie",
    hoverBorder: "hover:border-accent-movie/50",
    hoverBg: "group-hover:bg-accent-movie/15",
    highlight: "Runtime diaries & personal reviews",
  },
  {
    key: "series",
    title: "Series",
    tagline: "Television • Dramas • Miniseries",
    description: "Organize multi-season shows, up-next episode queues, and season premiere dates.",
    badge: "SERIES",
    icon: Tv,
    accentBorder: "border-accent-series/30",
    accentBg: "bg-accent-series/10",
    accentText: "text-accent-series",
    hoverBorder: "hover:border-accent-series/50",
    hoverBg: "group-hover:bg-accent-series/15",
    highlight: "Multi-season queue organization",
  },
  {
    key: "novels",
    title: "Novels",
    tagline: "Light Novels • Web Novels • Fiction",
    description: "Bookmark chapter progression, read percentages, volume releases, and book notes.",
    badge: "NOVEL",
    icon: BookText,
    accentBorder: "border-accent-novel/30",
    accentBg: "bg-accent-novel/10",
    accentText: "text-accent-novel",
    hoverBorder: "hover:border-accent-novel/50",
    hoverBg: "group-hover:bg-accent-novel/15",
    highlight: "Reading progress & chapter bookmarks",
  },
];

export default function HomeCategories() {
  return (
    <section className="relative">
      <Container>
        <div className="mb-8 sm:mb-12 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Five narrative formats. One unified system.
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
              Each storytelling medium has unique pacing and structures. StoriList is crafted specifically for all five.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {MEDIA_CATEGORIES.map((media) => {
            const IconComp = media.icon;
            return (
              <div
                key={media.key}
                className={`group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${media.hoverBorder}`}
              >
                <div>
                  {/* Icon + Badge Header */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border ${media.accentBorder} ${media.accentBg} ${media.accentText} transition-colors ${media.hoverBg}`}
                    >
                      <IconComp className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold tracking-wider ${media.accentText} border ${media.accentBorder} ${media.accentBg}`}
                    >
                      {media.badge}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="mt-4 text-base font-bold text-foreground">
                    {media.title}
                  </h3>
                  <p className="text-xs font-medium text-subtle-foreground">
                    {media.tagline}
                  </p>

                  {/* Description */}
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {media.description}
                  </p>
                </div>

                {/* Feature Highlight Indicator */}
                <div className="mt-4 pt-3 border-t border-border-subtle">
                  <span className="text-[11px] font-medium text-subtle-foreground flex items-center gap-1.5">
                    <Check className="h-3 w-3 text-primary" aria-hidden="true" />
                    <span>{media.highlight}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
