"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Star,
  BookmarkPlus,
  CheckCircle2,
  Clock,
  Bookmark,
  Ban,
  SlidersHorizontal,
  ArrowLeft,
  Compass,
  Sparkles,
  BookOpen,
  Clapperboard,
  Tv,
  BookText,
  Calendar,
  Layers,
  Building2,
  Library,
} from "lucide-react";
import Container from "@/components/Container";
import EditLogModal from "@/components/EditLogModal";
import { getMediaById, getRelatedMedia } from "@/data/sampleMedia";
import { SAMPLE_LIBRARY_ENTRIES } from "@/data/sampleLibrary";
import { LibraryEntry, LibraryStatus, MediaCategory } from "@/types/library";

const CATEGORY_ICONS: Record<MediaCategory, typeof Sparkles> = {
  Anime: Sparkles,
  Comics: BookOpen,
  Movies: Clapperboard,
  Series: Tv,
  Novels: BookText,
};

const STATUS_CONFIG: Record<
  LibraryStatus,
  { label: string; icon: typeof Clock; badgeStyle: string }
> = {
  "In Progress": {
    label: "In Progress",
    icon: Clock,
    badgeStyle: "border-primary bg-primary text-primary-foreground",
  },
  Planned: {
    label: "Planned",
    icon: Bookmark,
    badgeStyle: "border-sky-500 bg-sky-500 text-white",
  },
  Completed: {
    label: "Completed",
    icon: CheckCircle2,
    badgeStyle: "border-emerald-500 bg-emerald-500 text-white",
  },
  Dropped: {
    label: "Dropped",
    icon: Ban,
    badgeStyle: "border-rose-500 bg-rose-500 text-white",
  },
};

export default function TitleDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";

  const media = useMemo(() => getMediaById(id), [id]);

  // Track local library entries for interactive demonstration
  const [libraryEntries, setLibraryEntries] = useState<LibraryEntry[]>(SAMPLE_LIBRARY_ENTRIES);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Find if current media item is tracked in library
  const trackedEntry = useMemo(() => {
    if (!media) return undefined;
    return libraryEntries.find((entry) => entry.id === media.id);
  }, [media, libraryEntries]);

  // Related titles in same medium category
  const relatedMedia = useMemo(() => {
    if (!media) return [];
    return getRelatedMedia(media.category, media.id, 4);
  }, [media]);

  // Handle saving updates from EditLogModal
  const handleSaveEntry = (updatedEntry: LibraryEntry) => {
    const normalizedEntry: LibraryEntry = {
      ...updatedEntry,
      status:
        updatedEntry.status === "Dropped"
          ? "Dropped"
          : updatedEntry.currentProgress === 0
            ? "Planned"
            : updatedEntry.status,
    };

    setLibraryEntries((prev) => {
      const exists = prev.some((item) => item.id === normalizedEntry.id);
      if (exists) {
        return prev.map((item) => (item.id === normalizedEntry.id ? normalizedEntry : item));
      }
      return [normalizedEntry, ...prev];
    });
  };

  // Handle removing title from library
  const handleRemoveEntry = (entryId: string) => {
    setLibraryEntries((prev) => prev.filter((item) => item.id !== entryId));
  };

  // Quick add to library as Planned
  const handleQuickTrack = () => {
    if (!media) return;
    const newEntry: LibraryEntry = {
      id: media.id,
      title: media.title,
      category: media.category,
      format: media.format,
      studio: media.studio,
      poster: media.poster,
      year: media.year,
      status: "Planned",
      currentProgress: 0,
      totalProgress: media.totalProgress,
      progressUnit: media.progressUnit,
      userRating: null,
      communityRating: media.rating,
      lastUpdated: new Date().toISOString(),
      addedAt: new Date().toISOString(),
    };
    handleSaveEntry(newEntry);
  };

  // 404 / Title Not Found State
  if (!media) {
    return (
      <div className="py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border bg-card/50 p-8 sm:p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-subtle-foreground">
              <Compass className="h-7 w-7" aria-hidden="true" />
            </div>
            <h1 className="mt-4 text-xl font-bold text-foreground">Title Not Found</h1>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              We couldn&apos;t find a media entry matching this identifier in the StoriList catalog.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link
                href="/discover"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary-hover transition-colors"
              >
                <Compass className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Return to Discover</span>
              </Link>
              <Link
                href="/library"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <Library className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                <span>Go to Library</span>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const CategoryIcon = CATEGORY_ICONS[media.category];
  const isTracked = !!trackedEntry;
  const progressPercentage =
    trackedEntry && trackedEntry.totalProgress
      ? Math.min(100, Math.round((trackedEntry.currentProgress / trackedEntry.totalProgress) * 100))
      : null;

  return (
    <div className="py-8 sm:py-12">
      <Container>
        {/* =========================================================================
            1. BACK NAVIGATION AFFORDANCE
            ========================================================================= */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/discover"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to Discover</span>
          </Link>

          {isTracked && (
            <Link
              href="/library"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline transition-colors"
            >
              <Library className="h-3.5 w-3.5" aria-hidden="true" />
              <span>View in My Library</span>
            </Link>
          )}
        </div>

        {/* =========================================================================
            2. HERO SECTION: POSTER, TITLE IDENTITY, RATINGS & TRACKING CTA
            ========================================================================= */}
        <div className="relative rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs overflow-hidden">
          {/* Subtle Ambient Background Gradient using Format Tone */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
          />

          <div className="relative flex flex-col md:flex-row gap-6 sm:gap-8 md:gap-10">
            {/* 2:3 Vertical Poster */}
            <div className="w-44 sm:w-56 md:w-64 shrink-0 mx-auto md:mx-0">
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-md">
                <Image
                  src={media.poster}
                  alt={media.title}
                  fill
                  priority
                  sizes="(max-width: 640px) 176px, (max-width: 768px) 224px, 256px"
                  className="object-cover"
                />

                {/* Top-Right Category Badge */}
                <div className="absolute top-2.5 right-2.5">
                  <span
                    className={`rounded-md border px-2 py-0.5 text-[11px] font-bold tracking-wider backdrop-blur-md shadow-xs ${media.badgeStyle}`}
                  >
                    {media.badge}
                  </span>
                </div>

                {/* Top-Left Release Status */}
                <div className="absolute top-2.5 left-2.5">
                  <span className="rounded-md bg-black/65 px-2 py-0.5 text-[10px] font-semibold text-white/95 backdrop-blur-xs shadow-xs">
                    {media.releaseStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Title Identity, Metadata & Primary Action */}
            <div className="flex flex-1 flex-col justify-between">
              <div>
                {/* Header & Tagline */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                    <CategoryIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    {media.category}
                  </span>
                  <span className="text-subtle-foreground">&bull;</span>
                  <span className="text-xs text-muted-foreground">{media.format}</span>
                  <span className="text-subtle-foreground">&bull;</span>
                  <span className="text-xs text-muted-foreground">{media.year}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                  {media.title}
                </h1>

                {media.tagline && (
                  <p className="mt-2 text-sm sm:text-base italic text-muted-foreground">
                    &ldquo;{media.tagline}&rdquo;
                  </p>
                )}

                {/* Studio / Creator & Ratings Bar */}
                <div className="mt-4 flex flex-wrap items-center gap-4 border-y border-border-subtle py-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-subtle-foreground" aria-hidden="true" />
                    <span className="font-semibold text-foreground">{media.studio}</span>
                  </div>

                  <div className="h-3 w-px bg-border-subtle" />

                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-rating text-rating" aria-hidden="true" />
                    <span className="font-bold text-foreground text-sm">{media.rating}</span>
                    <span className="text-subtle-foreground">(Community score)</span>
                  </div>

                  <div className="h-3 w-px bg-border-subtle" />

                  <div className="text-subtle-foreground">
                    {media.totalProgress !== null
                      ? `${media.totalProgress} ${media.progressUnit}`
                      : "Ongoing serialization"}
                  </div>
                </div>

                {/* Genre Pills */}
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  {media.genres.map((genre) => (
                    <Link
                      key={genre}
                      href={`/discover?genre=${encodeURIComponent(genre)}`}
                      className="rounded-lg border border-border-subtle bg-muted/50 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:border-border hover:text-foreground transition-colors"
                    >
                      {genre}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tracking Status Card / Call to Action */}
              <div className="mt-6 rounded-2xl border border-border-subtle bg-muted/30 p-4">
                {isTracked ? (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold shadow-2xs ${
                            STATUS_CONFIG[trackedEntry.status].badgeStyle
                          }`}
                        >
                          {(() => {
                            const StatusIcon = STATUS_CONFIG[trackedEntry.status].icon;
                            return <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />;
                          })()}
                          <span>{trackedEntry.status}</span>
                        </span>

                        {trackedEntry.userRating && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-foreground">
                            <Star className="h-3.5 w-3.5 fill-rating text-rating" aria-hidden="true" />
                            <span>Rated {trackedEntry.userRating.toFixed(1)}/10</span>
                          </span>
                        )}
                      </div>

                      <div className="mt-2 text-xs font-medium text-muted-foreground">
                        {trackedEntry.totalProgress !== null ? (
                          <span>
                            Progress: {trackedEntry.currentProgress} / {trackedEntry.totalProgress}{" "}
                            {trackedEntry.progressUnit} ({progressPercentage}%)
                          </span>
                        ) : (
                          <span>
                            Progress: {trackedEntry.currentProgress} {trackedEntry.progressUnit} logged
                            (Ongoing)
                          </span>
                        )}
                      </div>

                      {trackedEntry.notes && (
                        <p className="mt-1.5 text-xs text-muted-foreground italic line-clamp-1">
                          &ldquo;{trackedEntry.notes}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setIsLogModalOpen(true)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground shadow-2xs hover:border-primary hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        <SlidersHorizontal className="h-3.5 w-3.5 text-subtle-foreground" aria-hidden="true" />
                        <span>Edit Log &amp; Progress</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h2 className="text-xs font-bold text-foreground">
                        Not in your library yet
                      </h2>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Track your progress, record episode and chapter benchmarks, and save personal notes.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleQuickTrack}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary-hover transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        <BookmarkPlus className="h-4 w-4" aria-hidden="true" />
                        <span>Track Title</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. SYNOPSIS & STORY OVERVIEW
            ========================================================================= */}
        <div className="mt-10 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            Synopsis
          </h2>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground max-w-4xl">
            {media.synopsis}
          </p>
        </div>

        {/* =========================================================================
            4. METADATA & PRODUCTION DETAILS
            ========================================================================= */}
        <div className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            Information
          </h2>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-border-subtle bg-muted/20 p-4">
              <div className="flex items-center gap-1.5 text-subtle-foreground text-xs font-semibold">
                <Layers className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>Format</span>
              </div>
              <div className="mt-1.5 text-sm font-bold text-foreground">
                {media.format}
              </div>
              <div className="text-[11px] text-muted-foreground">{media.category}</div>
            </div>

            <div className="rounded-2xl border border-border-subtle bg-muted/20 p-4">
              <div className="flex items-center gap-1.5 text-subtle-foreground text-xs font-semibold">
                <Building2 className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>Production</span>
              </div>
              <div className="mt-1.5 text-sm font-bold text-foreground line-clamp-1" title={media.studio}>
                {media.studio}
              </div>
              <div className="text-[11px] text-muted-foreground">Studio / Author</div>
            </div>

            <div className="rounded-2xl border border-border-subtle bg-muted/20 p-4">
              <div className="flex items-center gap-1.5 text-subtle-foreground text-xs font-semibold">
                <Calendar className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>Release</span>
              </div>
              <div className="mt-1.5 text-sm font-bold text-foreground">
                {media.year}
              </div>
              <div className="text-[11px] text-muted-foreground">{media.releaseStatus}</div>
            </div>

            <div className="rounded-2xl border border-border-subtle bg-muted/20 p-4">
              <div className="flex items-center gap-1.5 text-subtle-foreground text-xs font-semibold">
                <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>Total Scope</span>
              </div>
              <div className="mt-1.5 text-sm font-bold text-foreground">
                {media.totalProgress !== null
                  ? `${media.totalProgress} ${media.progressUnit}`
                  : "Ongoing"}
              </div>
              <div className="text-[11px] text-muted-foreground">
                {media.totalProgress !== null ? "Known complete count" : "Serialized release"}
              </div>
            </div>
          </div>

          {/* Creators Listing if present */}
          {media.creators && media.creators.length > 0 && (
            <div className="mt-5 border-t border-border-subtle pt-4">
              <span className="text-xs font-semibold text-foreground">Key Contributors:</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {media.creators.map((creator) => (
                  <span
                    key={creator}
                    className="rounded-lg border border-border-subtle bg-muted/30 px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    {creator}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            5. RELATED TITLES IN CATEGORY
            ========================================================================= */}
        {relatedMedia.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                More {media.category} Titles
              </h2>
              <Link
                href={`/discover?format=${media.category.toLowerCase()}`}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Browse all {media.category} &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
              {relatedMedia.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/title/${rel.id}`}
                  className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-3 shadow-xs transition duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md"
                >
                  <div>
                    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-muted shadow-inner">
                      <Image
                        src={rel.poster}
                        alt={rel.title}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/60 to-transparent"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="rounded-md bg-black/65 px-1.5 py-0.5 text-[10px] font-semibold text-white/95 backdrop-blur-xs shadow-xs">
                          {rel.year.slice(0, 4)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5">
                      <h3 className="line-clamp-1 text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                        {rel.title}
                      </h3>
                      <p className="mt-0.5 text-[11px] text-subtle-foreground truncate">
                        {rel.studio} &bull; {rel.format}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between border-t border-border-subtle pt-2 text-[11px]">
                    <div className="flex items-center gap-1 font-bold text-foreground">
                      <Star className="h-3 w-3 fill-rating text-rating" aria-hidden="true" />
                      <span>{rel.rating}</span>
                    </div>
                    <span className="text-[10px] text-subtle-foreground">{rel.format}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            6. CLIENT-SIDE EDIT/LOG MODAL
            ========================================================================= */}
        {trackedEntry && (
          <EditLogModal
            entry={trackedEntry}
            isOpen={isLogModalOpen}
            onClose={() => setIsLogModalOpen(false)}
            onSave={handleSaveEntry}
            onRemove={handleRemoveEntry}
          />
        )}
      </Container>
    </div>
  );
}
