import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  BookOpen,
  Clapperboard,
  Tv,
  BookText,
  SlidersHorizontal,
  BookmarkPlus,
  Star,
  Search,
  ArrowRight,
  Compass,
  Layers,
  Check,
  TrendingUp,
  Clock,
  ArrowDownToLine,
  Bookmark,
  Library,
  Repeat,
} from "lucide-react";
import Container from "@/components/Container";

// --- Supported Media Categories ---
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

// --- Product Preview: Simulated Active Library Dashboard ---
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

// --- Curated Featured Media (Discovery Preview) ---
const FEATURED_TITLES = [
  {
    id: "feat-1",
    title: "Frieren: Beyond Journey's End",
    category: "Anime",
    badge: "ANIME",
    badgeClass: "border-accent-anime/30 bg-accent-anime/10 text-accent-anime",
    format: "TV Series",
    meta: "Madhouse • Fantasy",
    year: "2023",
    rating: "9.6",
    synopsis: "An elf mage journeys to the resting place of souls, coming to terms with human mortality and past companionship.",
    poster: "/posters/frieren.jpg",
    icon: Sparkles,
  },
  {
    id: "feat-2",
    title: "Solo Leveling",
    category: "Comics",
    badge: "COMIC",
    badgeClass: "border-accent-comic/30 bg-accent-comic/10 text-accent-comic",
    format: "Manhwa",
    meta: "Redice Studio • Action",
    year: "2018",
    rating: "9.0",
    synopsis: "The world's weakest hunter receives an exclusive mystical interface that allows him to level up without limits.",
    poster: "/posters/solo-leveling.jpg",
    icon: BookOpen,
  },
  {
    id: "feat-3",
    title: "Interstellar",
    category: "Movies",
    badge: "MOVIE",
    badgeClass: "border-accent-movie/30 bg-accent-movie/10 text-accent-movie",
    format: "Feature Film",
    meta: "Syncopy • Sci-Fi",
    year: "2014",
    rating: "8.9",
    synopsis: "A team of space explorers travels through a wormhole beyond Saturn to locate a viable new home for humanity.",
    poster: "/posters/interstellar.jpg",
    icon: Clapperboard,
  },
  {
    id: "feat-4",
    title: "Severance",
    category: "Series",
    badge: "SERIES",
    badgeClass: "border-accent-series/30 bg-accent-series/10 text-accent-series",
    format: "TV Series",
    meta: "Apple Studios • Thriller",
    year: "2022",
    rating: "9.2",
    synopsis: "Office employees undergo a surgical procedure that strictly divides work memories from personal life.",
    poster: "/posters/severance.jpg",
    icon: Tv,
  },
  {
    id: "feat-5",
    title: "Omniscient Reader's Viewpoint",
    category: "Novels",
    badge: "NOVEL",
    badgeClass: "border-accent-novel/30 bg-accent-novel/10 text-accent-novel",
    format: "Web Novel",
    meta: "Sing Shong • Supernatural",
    year: "2018",
    rating: "9.4",
    synopsis: "The sole dedicated reader of an obscure apocalyptic web novel suddenly discovers its terrifying scenarios unfolding in real life.",
    poster: "/posters/orv.jpg",
    icon: BookText,
  },
];

// --- How StoriList Works (User Journey) ---
const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Find Across Formats",
    description: "Search anime seasons, ongoing manga, cinema releases, TV shows, and novels in a single query.",
    icon: Search,
    detail: "No toggling between five niche databases.",
  },
  {
    step: "02",
    title: "Organize Your Shelves",
    description: "Add titles to Watching, Reading, Completed, or Planning shelves with custom tags and private status.",
    icon: BookmarkPlus,
    detail: "Keep current queues separate from backlogs.",
  },
  {
    step: "03",
    title: "Update in One Tap",
    description: "Increment episodes or chapters with single-tap steppers right from your mobile or desktop view.",
    icon: SlidersHorizontal,
    detail: "Designed for fast daily logging.",
  },
  {
    step: "04",
    title: "Log Scores & Thoughts",
    description: "Keep private impressions, chapter notes, and volume ratings without social feed noise or pressure.",
    icon: Star,
    detail: "Your media diary, permanently preserved.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-20 sm:gap-28 py-6 sm:py-14 overflow-x-hidden">
      {/* =========================================================================
          1. HERO SECTION
          ========================================================================= */}
      <section className="relative">
        {/* Controlled ambient background glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-20 -z-10 flex justify-center"
        >
          <div className="h-[360px] w-[720px] rounded-full bg-primary/10 blur-[100px] dark:bg-primary/15" />
        </div>

        <Container>
          <div className="mx-auto max-w-4xl text-center">
            {/* Main Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl leading-[1.12]">
              One place to track everything you{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-hover">
                watch, read, and follow.
              </span>
            </h1>

            {/* Concise Supporting Description */}
            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">
              Say goodbye to juggling multiple disjointed tracker apps. StoriList brings your anime watchlists,
              manga chapters, cinema diaries, television queues, and reading logs together into one calm, organized space.
            </p>

            {/* Search Bar with Direct Navigation */}
            <div className="mx-auto mt-8 max-w-xl">
              <form
                action="/discover"
                method="GET"
                className="group relative flex items-center rounded-2xl border border-border bg-card p-1.5 shadow-sm transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
              >
                <div className="pointer-events-none flex items-center pl-3.5 text-subtle-foreground">
                  <Search className="h-4 w-4" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="q"
                  aria-label="Search media catalog"
                  placeholder="Search across anime, comics, movies, series, or novels..."
                  className="w-full bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-subtle-foreground focus:outline-none"
                />
                <div className="flex items-center gap-1.5 pr-1">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary-hover shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Functional Quick-Search Pills */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs text-subtle-foreground">
                <span className="font-medium text-muted-foreground">Popular:</span>
                {[
                  { label: "Frieren", q: "Frieren" },
                  { label: "Solo Leveling", q: "Solo Leveling" },
                  { label: "Dune", q: "Dune" },
                  { label: "Severance", q: "Severance" },
                  { label: "ORV", q: "Omniscient Reader" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={`/discover?q=${encodeURIComponent(item.q)}`}
                    className="rounded-md border border-border-subtle bg-card px-2 py-0.5 text-muted-foreground transition hover:border-border hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Primary & Secondary CTAs */}
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                href="/discover"
                className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Compass className="h-4 w-4" aria-hidden="true" />
                <span>Explore Media Catalog</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
              <Link
                href="/library"
                className="inline-flex items-center gap-2 rounded-xl border border-border-strong bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Library className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span>Open Personal Library</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          2. PERSONAL LIBRARY PRODUCT PREVIEW (DASHBOARD MOCKUP)
          ========================================================================= */}
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

      {/* =========================================================================
          3. SUPPORTED MEDIA CATEGORIES
          ========================================================================= */}
      <section className="relative">
        <Container>
          <div className="mb-8 sm:mb-12 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Five narrative formats. One unified system.
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
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

      {/* =========================================================================
          4. CURATED FEATURED TITLES (DISCOVERY TEASER)
          ========================================================================= */}
      <section className="relative">
        <Container>
          <div className="mb-8 sm:mb-12 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Representative highlights across the catalog.
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                A curated glimpse across mediums. Extensive search, filters, and genres live in Discover.
              </p>
            </div>
            <Link
              href="/discover"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border-strong bg-card px-4 py-2 text-xs font-semibold text-foreground transition hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span>Explore full catalog</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {FEATURED_TITLES.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col justify-between h-full rounded-2xl border border-border bg-card p-3 shadow-xs transition hover:border-border-strong hover:bg-card-hover"
              >
                {/* Real Vertical Poster */}
                <div>
                  <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-muted shadow-inner">
                    <Image
                      src={item.poster}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Bottom gradient shade */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent"
                    />

                    {/* Header: Year + Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="rounded-md bg-black/65 px-1.5 py-0.5 text-[10px] font-semibold text-white/95 backdrop-blur-xs shadow-xs">
                        {item.year}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span
                        className={`rounded-md border px-1.5 py-0.5 text-[10px] font-bold tracking-wider backdrop-blur-md shadow-xs ${item.badgeClass}`}
                      >
                        {item.badge}
                      </span>
                    </div>
                  </div>

                  {/* Card Metadata */}
                  <div className="mt-3">
                    <h3
                      className="line-clamp-1 text-sm font-semibold text-foreground group-hover:text-primary transition-colors"
                      title={item.title}
                    >
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-subtle-foreground truncate">
                      {item.meta}
                    </p>
                    <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                      {item.synopsis}
                    </p>
                  </div>
                </div>

                {/* Bottom Rating & Action */}
                <div className="mt-3 flex items-center justify-between border-t border-border-subtle pt-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-rating text-rating" aria-hidden="true" />
                    <span className="font-bold text-foreground">{item.rating}</span>
                  </div>
                  <Link
                    href={`/discover?q=${encodeURIComponent(item.title)}`}
                    aria-label={`View details for ${item.title}`}
                    className="text-[11px] font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-xs"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* =========================================================================
          5. HOW STORILIST WORKS (VISUAL WORKFLOW)
          ========================================================================= */}
      <section className="relative">
        <Container>
          <div className="rounded-3xl border border-border bg-muted-surface/50 p-6 sm:p-10 lg:p-12">
            <div className="mx-auto max-w-2xl text-center mb-8 sm:mb-12">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                How StoriList fits into your routine.
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Low friction by design so you spend time enjoying stories, not managing databases.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {WORKFLOW_STEPS.map((step) => {
                const StepIcon = step.icon;
                return (
                  <div
                    key={step.step}
                    className="relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs"
                  >
                    <div>
                      {/* Step Number + Icon Header */}
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-extrabold text-subtle-foreground/40">
                          {step.step}
                        </span>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary-subtle-border bg-primary-subtle text-primary-subtle-foreground">
                          <StepIcon className="h-4 w-4" aria-hidden="true" />
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="mt-4 text-base font-bold text-foreground">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>

                    {/* Step Footnote */}
                    <div className="mt-4 pt-3 border-t border-border-subtle text-[11px] font-medium text-subtle-foreground">
                      {step.detail}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          6. CORE FEATURE BENEFITS (ASYMMETRICAL BENTO COMPOSITION)
          ========================================================================= */}
      <section className="relative">
        <Container>
          <div className="mx-auto max-w-2xl text-center mb-8 sm:mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Built for people who love stories, not social algorithms.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A purposeful tracker that values your reading and viewing habits over endless feeds and engagement metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Highlighted Benefit 1 (Wide span 2) */}
            <div className="md:col-span-2 flex flex-col justify-between rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary-subtle-border bg-primary-subtle text-primary-subtle-foreground">
                  <Layers className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-foreground">
                  Stories Move Across Mediums. Your Tracker Should Too.
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Modern storytelling doesn’t stay in one silo. A web novel becomes a serialized webcomic, which gets adapted into
                  a hit television anime or cinema blockbuster. StoriList lets you follow every step of your favorite narratives
                  in one unified personal account without duplicate clutter.
                </p>
              </div>

              {/* Visual Demo Micro-tags */}
              <div className="mt-6 flex flex-wrap items-center gap-2 pt-4 border-t border-border-subtle text-xs">
                <span className="font-semibold text-foreground">Track together:</span>
                <span className="rounded-md border border-accent-anime/30 bg-accent-anime/10 px-2 py-0.5 text-accent-anime font-medium">
                  Anime Series
                </span>
                <span className="rounded-md border border-accent-comic/30 bg-accent-comic/10 px-2 py-0.5 text-accent-comic font-medium">
                  Manga Chapters
                </span>
                <span className="rounded-md border border-accent-movie/30 bg-accent-movie/10 px-2 py-0.5 text-accent-movie font-medium">
                  Feature Films
                </span>
                <span className="rounded-md border border-accent-series/30 bg-accent-series/10 px-2 py-0.5 text-accent-series font-medium">
                  TV Dramas
                </span>
                <span className="rounded-md border border-accent-novel/30 bg-accent-novel/10 px-2 py-0.5 text-accent-novel font-medium">
                  Web Novels
                </span>
              </div>
            </div>

            {/* Benefit 2: Calm & Distraction-Free */}
            <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary-subtle-border bg-primary-subtle text-primary-subtle-foreground">
                  <Bookmark className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-foreground">
                  A Private Space, Not a Feed
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  No unsolicited algorithm feeds, no toxic comment wars, and no sponsored noise. Your library is a clean personal space devoted entirely to your media progress.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 pt-4 border-t border-border-subtle text-xs font-semibold text-primary">
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                <span>100% focused on your personal media tracking</span>
              </div>
            </div>

            {/* Benefit 3: Single-Tap Progress Steppers */}
            <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary-subtle-border bg-primary-subtle text-primary-subtle-foreground">
                  <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-foreground">
                  Single-Tap Steppers
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Updating your daily progress shouldn&apos;t take multiple page loads. Instant steppers let you tap +1 directly from your queue on mobile or desktop.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 pt-4 border-t border-border-subtle text-xs font-semibold text-primary">
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Fast inline increment controls built-in</span>
              </div>
            </div>

            {/* Benefit 4: Portability & Imports (Span 2) */}
            <div className="md:col-span-2 flex flex-col justify-between rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary-subtle-border bg-primary-subtle text-primary-subtle-foreground">
                  <ArrowDownToLine className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-foreground">
                  Easy Import from Existing Trackers
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Already have years of watchlist history on other platforms? StoriList is architected to allow straightforward imports from popular trackers and CSV backups so you never have to start from scratch.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-border-subtle text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Compatible formats:</span>
                <span>MyAnimeList &bull; AniList &bull; Letterboxd &bull; CSV Backups</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================================
          7. FINAL CALL TO ACTION
          ========================================================================= */}
      <section className="relative">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-12 text-center shadow-md">
            {/* Ambient CTA glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 -z-10 h-56 w-80 rounded-full bg-primary/10 blur-[80px]"
            />

            <div className="mx-auto max-w-2xl">
              {/* Brand emblem */}
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-extrabold shadow-sm shadow-primary/30">
                SL
              </div>

              <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Ready to organize your entire media universe?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground">
                Start logging your anime, comics, movies, series, and novels in one calm, unified personal space.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
                <Link
                  href="/discover"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <Compass className="h-4 w-4" aria-hidden="true" />
                  <span>Explore Catalog</span>
                </Link>
                <Link
                  href="/library"
                  className="inline-flex items-center gap-2 rounded-xl border border-border-strong bg-muted-surface px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <Library className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span>Go to My Library</span>
                </Link>
              </div>

            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
