import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  BookOpen,
  Clapperboard,
  Tv,
  BookText,
  Star,
  TrendingUp,
  Clock,
  ArrowRight,
  Repeat,
} from "lucide-react";
import Container from "@/components/Container";

const LIBRARY_MOCK_ITEMS = [
  {
    id: "lib-1",
    title: "Frieren: Beyond Journey's End",
    category: "Anime",
    badge: "ANIME",
    badgeStyle: "border-accent-anime/30 bg-accent-anime/10 text-accent-anime",
    format: "TV Series",
    status: "Watching",
    statusColor: "border-accent-anime/40 bg-accent-anime/15 text-accent-anime",
    progressBarColor: "bg-accent-anime",
    currentProgress: 24,
    totalProgress: 28,
    progressUnit: "Episodes",
    progressPercent: 86,
    stepperAction: "+1 Ep",
    score: "9.6",
    lastUpdated: "Yesterday",
    poster: "/posters/frieren.jpg",
    icon: Sparkles,
  },
  {
    id: "lib-2",
    title: "Solo Leveling",
    category: "Comics",
    badge: "COMIC",
    badgeStyle: "border-accent-comic/30 bg-accent-comic/10 text-accent-comic",
    format: "Manhwa",
    status: "Reading",
    statusColor: "border-accent-comic/40 bg-accent-comic/15 text-accent-comic",
    progressBarColor: "bg-accent-comic",
    currentProgress: 168,
    totalProgress: 179,
    progressUnit: "Chapters",
    progressPercent: 94,
    stepperAction: "+1 Ch",
    score: "9.0",
    lastUpdated: "3h ago",
    poster: "/posters/solo-leveling.jpg",
    icon: BookOpen,
  },
  {
    id: "lib-3",
    title: "Dune: Part Two",
    category: "Movies",
    badge: "MOVIE",
    badgeStyle: "border-accent-movie/30 bg-accent-movie/10 text-accent-movie",
    format: "Feature Film",
    status: "Completed",
    statusColor: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    progressBarColor: "bg-emerald-500",
    currentProgress: 166,
    totalProgress: 166,
    progressUnit: "Minutes",
    progressPercent: 100,
    stepperAction: "Rewatch",
    isCompleted: true,
    score: "9.3",
    lastUpdated: "Oct 14",
    poster: "/posters/dune-two.jpg",
    icon: Clapperboard,
  },
  {
    id: "lib-4",
    title: "Severance (Season 2)",
    category: "Series",
    badge: "SERIES",
    badgeStyle: "border-accent-series/30 bg-accent-series/10 text-accent-series",
    format: "TV Series",
    status: "Watching",
    statusColor: "border-accent-series/40 bg-accent-series/15 text-accent-series",
    progressBarColor: "bg-accent-series",
    currentProgress: 6,
    totalProgress: 10,
    progressUnit: "Episodes",
    progressPercent: 60,
    stepperAction: "+1 Ep",
    score: "9.2",
    lastUpdated: "2d ago",
    poster: "/posters/severance.jpg",
    icon: Tv,
  },
  {
    id: "lib-5",
    title: "Omniscient Reader's Viewpoint",
    category: "Novels",
    badge: "NOVEL",
    badgeStyle: "border-accent-novel/30 bg-accent-novel/10 text-accent-novel",
    format: "Web Novel",
    status: "Reading",
    statusColor: "border-accent-novel/40 bg-accent-novel/15 text-accent-novel",
    progressBarColor: "bg-accent-novel",
    currentProgress: 352,
    totalProgress: 551,
    progressUnit: "Chapters",
    progressPercent: 64,
    stepperAction: "+1 Ch",
    score: "9.4",
    lastUpdated: "5d ago",
    poster: "/posters/orv.jpg",
    icon: BookText,
  },
];

export default function HomePreview() {
  return (
    <section id="library-preview" className="relative scroll-mt-20">
      <Container>
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-8 sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Your stories, organized together at last.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A single cohesive interface to update progress, track seasons, log chapters, and view personal scores.
          </p>
        </div>

        {/* Desktop/Tablet Product Frame Mockup */}
        <div className="overflow-hidden rounded-2xl border border-border-strong/80 bg-card shadow-lg shadow-black/5 dark:shadow-black/25">
          {/* Window Chrome Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted-surface/70 px-4 py-3 sm:px-6">
            {/* Window Dots + Hub Title */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="h-3.5 w-px bg-border" aria-hidden="true" />
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Active Media Queue
              </span>
            </div>

            {/* View Filters Pills */}
            <div className="flex items-center gap-1 overflow-x-auto text-xs pb-1 sm:pb-0 scrollbar-none">
              <span className="rounded-lg bg-primary px-3 py-1 font-semibold text-primary-foreground shadow-xs cursor-default">
                All Active (5)
              </span>
              <span className="rounded-lg px-2.5 py-1 font-medium text-muted-foreground hover:bg-muted cursor-default">
                Watching (2)
              </span>
              <span className="rounded-lg px-2.5 py-1 font-medium text-muted-foreground hover:bg-muted cursor-default">
                Reading (2)
              </span>
              <span className="rounded-lg px-2.5 py-1 font-medium text-muted-foreground hover:bg-muted cursor-default">
                Completed (1)
              </span>
            </div>

            {/* Quick Summary Pill */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-subtle-foreground" aria-hidden="true" />
              <span>5 Formats in Progress</span>
            </div>
          </div>

          {/* Library Active Items Grid */}
          <div className="divide-y divide-border/60 p-2 sm:p-4">
            {LIBRARY_MOCK_ITEMS.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between rounded-xl transition hover:bg-muted/40"
              >
                {/* Media Item Info & Identity */}
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Mini Cover Thumbnail with Real Poster */}
                  <div className="relative h-14 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-border shadow-xs bg-muted">
                    <Image
                      src={item.poster}
                      alt={item.title}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>

                  {/* Title & Metadata */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wider ${item.badgeStyle}`}
                      >
                        {item.badge}
                      </span>
                      <span className="text-xs text-subtle-foreground">{item.format}</span>
                      <span
                        className={`rounded-full border px-2 py-0.2 text-[10px] font-semibold ${item.statusColor}`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <h3 className="mt-0.5 truncate text-sm font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-subtle-foreground">
                      Updated {item.lastUpdated}
                    </p>
                  </div>
                </div>

                {/* Progress Bar & Stepper Controls */}
                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 sm:gap-6 w-full sm:w-auto">
                  <div className="flex flex-col gap-1 w-full sm:w-44">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-medium text-foreground">
                        {item.currentProgress} / {item.totalProgress}{" "}
                        <span className="text-subtle-foreground">{item.progressUnit}</span>
                      </span>
                      <span className="font-semibold text-muted-foreground">
                        {item.progressPercent}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${item.progressBarColor} transition-all duration-500`}
                        style={{ width: `${item.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Score Badge */}
                    <div className="flex items-center gap-1 rounded-lg border border-border bg-card px-2 py-1 text-xs">
                      <Star className="h-3 w-3 fill-rating text-rating" aria-hidden="true" />
                      <span className="font-bold text-foreground">{item.score}</span>
                    </div>

                    {/* Functional Action Affordance */}
                    {item.isCompleted ? (
                      <span
                        className="inline-flex h-7 items-center gap-1 rounded-lg border border-border-subtle bg-muted/60 px-2 text-[11px] font-semibold text-muted-foreground cursor-default"
                        title="Story completed"
                      >
                        <Repeat className="h-3 w-3 text-subtle-foreground" aria-hidden="true" />
                        <span>{item.stepperAction}</span>
                      </span>
                    ) : (
                      <span
                        className="inline-flex h-7 items-center justify-center rounded-lg border border-border bg-card px-2.5 text-xs font-semibold text-foreground shadow-2xs hover:bg-muted cursor-default transition-colors"
                        title="Single-tap progress stepper"
                      >
                        {item.stepperAction}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mockup Footer Stats Bar */}
          <div className="flex flex-wrap items-center justify-between border-t border-border bg-muted-surface/50 px-4 py-2.5 sm:px-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                <span className="font-semibold text-foreground">88%</span> on track this week
              </span>
              <span className="hidden sm:inline">&bull;</span>
              <span className="hidden sm:inline">24 items completed all-time</span>
            </div>
            <Link
              href="/library"
              className="text-xs font-medium text-primary hover:text-primary-hover inline-flex items-center gap-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-xs"
            >
              <span>View Full Library</span>
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
