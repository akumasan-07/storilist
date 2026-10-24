import Link from "next/link";
import { Search, Compass, Library, ArrowRight } from "lucide-react";
import Container from "@/components/Container";

const POPULAR_SEARCHES = [
  { label: "Frieren", q: "Frieren" },
  { label: "Solo Leveling", q: "Solo Leveling" },
  { label: "Dune", q: "Dune" },
  { label: "Severance", q: "Severance" },
  { label: "ORV", q: "Omniscient Reader" },
];

export default function HomeHero() {
  return (
    <section className="relative">
      {/* Controlled ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-20 -z-10 flex justify-center"
      >
        <div className="h-[360px] w-[720px] max-w-full rounded-full bg-primary/10 blur-[100px] dark:bg-primary/15" />
      </div>

      <Container>
        <div className="mx-auto max-w-4xl text-center">
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.12] break-words">
            One place to track everything you{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-hover">
              watch, read, and follow.
            </span>
          </h1>

          {/* Concise Supporting Description */}
          <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground">
            Say goodbye to juggling multiple disjointed tracker apps. StoriList brings your anime watchlists,
            manga chapters, cinema diaries, television queues, and reading logs together into one calm, organized space.
          </p>

          {/* Search Bar with Direct Navigation */}
          <div className="mx-auto mt-6 sm:mt-8 max-w-xl">
            <form
              action="/discover"
              method="GET"
              className="group relative flex items-center rounded-2xl border border-border bg-card p-1.5 shadow-sm transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 min-h-[44px]"
            >
              <div className="pointer-events-none flex items-center pl-3 text-subtle-foreground">
                <Search className="h-4 w-4" aria-hidden="true" />
              </div>
              <input
                type="text"
                name="q"
                aria-label="Search media catalog"
                placeholder="Search across anime, comics, movies, series, novels..."
                className="w-full bg-transparent px-2.5 py-2 text-xs sm:text-sm text-foreground placeholder:text-subtle-foreground focus:outline-none"
              />
              <div className="flex items-center gap-1.5 pr-1 shrink-0">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-3.5 sm:px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary-hover shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer min-h-[36px]"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Quick-Search Pills */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs text-subtle-foreground">
              <span className="font-medium text-muted-foreground mr-0.5">Popular:</span>
              {POPULAR_SEARCHES.map((item) => (
                <Link
                  key={item.label}
                  href={`/discover?q=${encodeURIComponent(item.q)}`}
                  className="rounded-md border border-border-subtle bg-card px-2 py-1 text-[11px] text-muted-foreground transition hover:border-border hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Primary & Secondary CTAs - Full-width on mobile */}
          <div className="mt-8 sm:mt-9 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-3.5 max-w-md mx-auto sm:max-w-none">
            <Link
              href="/discover"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 min-h-[44px] text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Compass className="h-4 w-4" aria-hidden="true" />
              <span>Explore Media Catalog</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <Link
              href="/library"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-strong bg-card px-5 py-3 min-h-[44px] text-sm font-semibold text-foreground transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Library className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span>Open Personal Library</span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
