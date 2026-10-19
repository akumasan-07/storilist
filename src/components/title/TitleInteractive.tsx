"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Star,
  BookmarkPlus,
  Clock,
  Bookmark,
  CheckCircle2,
  Ban,
  SlidersHorizontal,
  Library,
} from "lucide-react";
import { MediaItem } from "@/types/media";
import { LibraryEntry, LibraryItem, LibraryStatus } from "@/types/library";
import { useLibrary } from "@/context/LibraryContext";
import { createEntryFromMedia, getProgressPercent } from "@/lib/library";
import EditLogModal from "@/components/EditLogModal";

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

export function TitleLibraryLink({ mediaId }: { mediaId: string }) {
  const { getEntry } = useLibrary();
  const isTracked = !!getEntry(mediaId);

  if (!isTracked) return null;

  return (
    <Link
      href="/library"
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline transition-colors py-1"
    >
      <Library className="h-3.5 w-3.5" aria-hidden="true" />
      <span>View in My Library</span>
    </Link>
  );
}

interface TitleInteractiveProps {
  media: MediaItem;
}

export default function TitleInteractive({ media }: TitleInteractiveProps) {
  const { getEntry, saveEntry, removeEntry } = useLibrary();
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const trackedEntry: LibraryEntry | undefined = getEntry(media.id);
  const isTracked = !!trackedEntry;

  const trackedItem: LibraryItem | null = useMemo(() => {
    if (!trackedEntry) return null;
    return {
      ...trackedEntry,
      media,
    };
  }, [trackedEntry, media]);

  const progressPercentage =
    trackedEntry && media.totalProgress
      ? getProgressPercent(trackedEntry.currentProgress, media.totalProgress)
      : null;

  const handleQuickTrack = () => {
    saveEntry(createEntryFromMedia(media));
  };

  return (
    <>
      <div className="mt-6 rounded-2xl border border-border-subtle bg-muted/30 p-3.5 sm:p-4">
        {isTracked ? (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
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
                {media.totalProgress !== null ? (
                  <span>
                    Progress: {trackedEntry.currentProgress} / {media.totalProgress}{" "}
                    {media.progressUnit} ({progressPercentage}%)
                  </span>
                ) : (
                  <span>
                    Progress: {trackedEntry.currentProgress} {media.progressUnit} logged (Ongoing)
                  </span>
                )}
              </div>

              {trackedEntry.notes && (
                <p className="mt-1.5 text-xs text-muted-foreground italic line-clamp-2 sm:line-clamp-1">
                  &ldquo;{trackedEntry.notes}&rdquo;
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                type="button"
                onClick={() => setIsLogModalOpen(true)}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 sm:py-2 text-xs font-semibold text-foreground shadow-2xs hover:border-primary hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer min-h-[42px] sm:min-h-[38px]"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-subtle-foreground" aria-hidden="true" />
                <span>Edit Log &amp; Progress</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xs font-bold text-foreground">Not in your library yet</h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Track your progress, record episode and chapter benchmarks, and save personal notes.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                type="button"
                onClick={handleQuickTrack}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 sm:py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary-hover transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer min-h-[42px] sm:min-h-[38px]"
              >
                <BookmarkPlus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Track as Planned</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {trackedItem && (
        <EditLogModal
          item={trackedItem}
          isOpen={isLogModalOpen}
          onClose={() => setIsLogModalOpen(false)}
          onSave={saveEntry}
          onRemove={removeEntry}
        />
      )}
    </>
  );
}
