import { Layers, Bookmark, SlidersHorizontal, ArrowDownToLine, Check } from "lucide-react";
import Container from "@/components/Container";

export default function HomeBenefits() {
  return (
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
  );
}
