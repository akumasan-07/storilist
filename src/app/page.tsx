import Link from "next/link";
import {
  Sparkles,
  BookImage,
  Clapperboard,
  Tv,
  BookText,
  SlidersHorizontal,
  CheckCircle2,
  Library,
  FileEdit,
  Heart,
  ArrowDownToLine,
  Search,
  Star,
} from "lucide-react";
import Container from "@/components/Container";

const MEDIA_CATEGORIES = [
  {
    title: "Anime",
    description: "Track series, movies, OVAs, and seasonal releases.",
    badge: "ANIME",
    accent: "border-sky-500/20 bg-sky-500/5 text-sky-400",
  },
  {
    title: "Movies",
    description: "Feature films, documentaries, and cinema favorites.",
    badge: "MOVIE",
    accent: "border-rose-500/20 bg-rose-500/5 text-rose-400",
  },
  {
    title: "Series",
    description: "Television series, dramas, and multi-season shows.",
    badge: "SERIES",
    accent: "border-purple-500/20 bg-purple-500/5 text-purple-400",
  },
  {
    title: "Comics",
    description: "Manga, Manhwa, Manhua, and Western comics.",
    badge: "COMIC",
    accent: "border-amber-500/20 bg-amber-500/5 text-amber-400",
  },
  {
    title: "Novels",
    description: "Light novels, web novels, and written stories.",
    badge: "NOVEL",
    accent: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
  },
];

const POPULAR_MEDIA = [
  {
    id: "1",
    title: "Frieren: Beyond Journey's End",
    category: "Anime",
    badge: "ANIME",
    badgeStyle: "border-sky-500/20 bg-sky-500/10 text-sky-400",
    format: "TV Series",
    year: "2023",
    rating: "9.1",
    posterGradient: "from-sky-950/60 via-zinc-900 to-zinc-950",
    icon: <Sparkles className="h-6 w-6 text-sky-400" aria-hidden="true" />,
  },
  {
    id: "2",
    title: "Solo Leveling",
    category: "Comics",
    badge: "COMIC",
    badgeStyle: "border-amber-500/20 bg-amber-500/10 text-amber-400",
    format: "Manhwa",
    year: "2018",
    rating: "8.7",
    posterGradient: "from-amber-950/60 via-zinc-900 to-zinc-950",
    icon: <BookImage className="h-6 w-6 text-amber-400" aria-hidden="true" />,
  },
  {
    id: "3",
    title: "Interstellar",
    category: "Movies",
    badge: "MOVIE",
    badgeStyle: "border-rose-500/20 bg-rose-500/10 text-rose-400",
    format: "Movie",
    year: "2014",
    rating: "8.7",
    posterGradient: "from-rose-950/60 via-zinc-900 to-zinc-950",
    icon: <Clapperboard className="h-6 w-6 text-rose-400" aria-hidden="true" />,
  },
  {
    id: "4",
    title: "Severance",
    category: "Series",
    badge: "SERIES",
    badgeStyle: "border-purple-500/20 bg-purple-500/10 text-purple-400",
    format: "TV Series",
    year: "2022",
    rating: "8.7",
    posterGradient: "from-purple-950/60 via-zinc-900 to-zinc-950",
    icon: <Tv className="h-6 w-6 text-purple-400" aria-hidden="true" />,
  },
  {
    id: "5",
    title: "Omniscient Reader's Viewpoint",
    category: "Novels",
    badge: "NOVEL",
    badgeStyle: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    format: "Web Novel",
    year: "2018",
    rating: "9.0",
    posterGradient: "from-emerald-950/60 via-zinc-900 to-zinc-950",
    icon: <BookText className="h-6 w-6 text-emerald-400" aria-hidden="true" />,
  },
];

const CORE_FEATURES = [
  {
    title: "Progress Tracking",
    description:
      "Log watched episodes, read chapters, or finished volumes. Simple controls make updating your daily progress fast and effortless.",
    icon: <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: "Status Management",
    description:
      "Organize stories into Watching, Reading, Completed, Planning, Paused, or Dropped to keep your media queues organized.",
    icon: <CheckCircle2 className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: "Unified Library",
    description:
      "Bring anime, comics, movies, series, and novels together in one personal library, without juggling multiple separate apps.",
    icon: <Library className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: "Personal Notes",
    description:
      "Save private impressions, volume notes, thoughts, and reviews for any narrative directly within your library.",
    icon: <FileEdit className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: "Favorites",
    description:
      "Pin your all-time favorite anime, films, series, comics, and novels front-and-center in your library catalogue.",
    icon: <Heart className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: "Importing Existing Lists",
    description:
      "Effortlessly bring in your existing watchlists and reading history from external services to keep everything in one place.",
    icon: <ArrowDownToLine className="h-5 w-5" aria-hidden="true" />,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 py-12 sm:py-20">
      <Container>
        {/* Hero Section */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            One Library for Everything You{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              Watch &amp; Read
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-zinc-400">
            A unified tracker for anime, comics, movies, series, and novels.
            Manage all your watchlists and reading lists in one distraction-free personal space.
          </p>

          {/* Hero Search UI (UI-only preview) */}
          <div className="mx-auto mt-8 max-w-xl">
            <div className="relative flex items-center">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500">
                <Search className="h-5 w-5" aria-hidden="true" />
              </div>
              <input
                type="text"
                readOnly
                placeholder="Search anime, comics, movies, series, or novels..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 py-3.5 pl-11 pr-24 text-sm text-zinc-200 placeholder-zinc-500 shadow-inner focus:outline-none cursor-default"
              />
              <div className="absolute inset-y-0 right-1.5 flex items-center">
                <span className="rounded-lg bg-zinc-800/80 px-3 py-1.5 text-xs font-medium text-zinc-400 border border-zinc-700/60">
                  Search
                </span>
              </div>
            </div>
          </div>

          {/* Primary & Secondary CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/discover"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Explore Discover
            </Link>
            <Link
              href="/library"
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800 hover:text-white"
            >
              Go to My Library
            </Link>
          </div>
        </div>

        {/* Media Categories */}
        <div className="mt-20">
          <div className="mb-6 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Supported Media
              </h2>
              <p className="text-sm text-zinc-400">
                Keep everything you watch and read in one place.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {MEDIA_CATEGORIES.map((media) => (
              <div
                key={media.title}
                className="group relative flex flex-col justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 transition hover:border-zinc-700 hover:bg-zinc-900/70"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-xs font-semibold tracking-wider ${media.accent}`}
                    >
                      {media.badge}
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-zinc-100">
                    {media.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                    {media.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular / Trending Section */}
        <div className="mt-20">
          <div className="mb-6 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Featured Titles
              </h2>
              <p className="text-sm text-zinc-400">
                Explore representative titles across different narrative formats.
              </p>
            </div>
            <Link
              href="/discover"
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View all in Discover &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {POPULAR_MEDIA.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3 transition hover:border-zinc-700 hover:bg-zinc-900/70"
              >
                {/* Thematic Media Cover */}
                <div
                  className={`relative aspect-[2/3] w-full overflow-hidden rounded-lg border border-zinc-800/90 bg-gradient-to-b ${item.posterGradient} p-3 flex flex-col justify-between shadow-inner`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-zinc-500">
                      {item.year}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wider ${item.badgeStyle}`}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <div className="flex items-center justify-center py-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-zinc-950/60 shadow-md backdrop-blur-xs transition-transform duration-200 group-hover:scale-110">
                      {item.icon}
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-1.5">
                    <span className="h-px w-3.5 bg-zinc-700/50" />
                    <span className="text-[9px] font-medium uppercase tracking-widest text-zinc-400">
                      {item.category}
                    </span>
                    <span className="h-px w-3.5 bg-zinc-700/50" />
                  </div>
                </div>

                {/* Media Info */}
                <div className="mt-3 flex flex-1 flex-col justify-between">
                  <div>
                    <h3
                      className="line-clamp-1 text-sm font-semibold text-zinc-200 group-hover:text-white"
                      title={item.title}
                    >
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {item.format}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-zinc-800/60 pt-2 text-xs">
                    <span className="text-zinc-500 text-[11px]">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star
                        className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                        aria-hidden="true"
                      />
                      <span className="font-semibold text-zinc-200">{item.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Features */}
        <div className="mt-20 rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-8 sm:p-10">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Everything You Need in One Personal Tracker
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Purpose-built to manage watching and reading habits without bloat or friction.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CORE_FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5 transition hover:border-zinc-700/80"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                    {feature.icon}
                  </div>
                  <h3 className="text-base font-semibold text-zinc-200">
                    {feature.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
