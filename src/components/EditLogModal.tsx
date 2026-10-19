"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Star,
  Plus,
  Minus,
  CheckCircle2,
  Clock,
  Bookmark,
  Ban,
  Sparkles,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { LibraryEntry, LibraryStatus, MediaCategory } from "@/types/library";

interface EditLogModalProps {
  entry: LibraryEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedEntry: LibraryEntry) => void;
  onRemove: (entryId: string) => void;
}

const STATUS_OPTIONS: { status: LibraryStatus; label: string; icon: typeof Clock; activeClass: string }[] = [
  {
    status: "In Progress",
    label: "In Progress",
    icon: Clock,
    activeClass: "border-primary bg-primary text-primary-foreground shadow-xs",
  },
  {
    status: "Planned",
    label: "Planned",
    icon: Bookmark,
    activeClass: "border-sky-500 bg-sky-500 text-white shadow-xs",
  },
  {
    status: "Completed",
    label: "Completed",
    icon: CheckCircle2,
    activeClass: "border-emerald-500 bg-emerald-500 text-white shadow-xs",
  },
  {
    status: "Dropped",
    label: "Dropped",
    icon: Ban,
    activeClass: "border-rose-500 bg-rose-500 text-white shadow-xs",
  },
];

const RATING_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const CATEGORY_STYLES: Record<MediaCategory, { badge: string; style: string }> = {
  Anime: { badge: "ANIME", style: "border-accent-anime/40 bg-accent-anime/15 text-accent-anime" },
  Comics: { badge: "COMIC", style: "border-accent-comic/40 bg-accent-comic/15 text-accent-comic" },
  Movies: { badge: "MOVIE", style: "border-accent-movie/40 bg-accent-movie/15 text-accent-movie" },
  Series: { badge: "SERIES", style: "border-accent-series/40 bg-accent-series/15 text-accent-series" },
  Novels: { badge: "NOVEL", style: "border-accent-novel/40 bg-accent-novel/15 text-accent-novel" },
};

export default function EditLogModal({
  entry,
  isOpen,
  onClose,
  onSave,
  onRemove,
}: EditLogModalProps) {
  const [status, setStatus] = useState<LibraryStatus>("In Progress");
  const [currentProgress, setCurrentProgress] = useState(0);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [isConfirmingRemove, setIsConfirmingRemove] = useState(false);

  useEffect(() => {
    if (entry) {
      const initialStatus =
        entry.status === "Dropped"
          ? "Dropped"
          : entry.currentProgress === 0
            ? "Planned"
            : entry.status;
      setStatus(initialStatus);
      setCurrentProgress(entry.currentProgress);
      setUserRating(entry.userRating);
      setNotes(entry.notes || "");
      setIsConfirmingRemove(false);
    }
  }, [entry, isOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !entry) return null;

  const categoryStyle = CATEGORY_STYLES[entry.category];
  const isCompleted = status === "Completed";
  const hasTotal = entry.totalProgress !== null;

  const updateProgress = (nextProgress: number) => {
    let clampedProgress = nextProgress;
    if (clampedProgress < 0) clampedProgress = 0;
    if (entry.totalProgress !== null && clampedProgress > entry.totalProgress) {
      clampedProgress = entry.totalProgress;
    }

    setCurrentProgress(clampedProgress);

    // Apply automatic transitions specifically when progress is changed
    setStatus((prevStatus) => {
      // Once an item is Dropped, it remains Dropped regardless of progress changes
      if (prevStatus === "Dropped") {
        return "Dropped";
      }

      const hasTotal = entry.totalProgress !== null;

      // When progress reaches 0, switch to Planned from other statuses
      if (clampedProgress === 0) {
        return "Planned";
      }

      // When progress reaches the known total, switch to Completed
      if (hasTotal && clampedProgress >= entry.totalProgress!) {
        return "Completed";
      }

      // When progress is > 0 and below known total (or ongoing):
      // - Planned with progress > 0 switches to In Progress
      // - Completed with progress reduced below total switches to In Progress
      if (prevStatus === "Planned" || prevStatus === "Completed") {
        return "In Progress";
      }

      if (prevStatus === "In Progress") {
        return "In Progress";
      }

      return prevStatus;
    });
  };

  const handleStatusChange = (newStatus: LibraryStatus) => {
    setStatus(newStatus);
    // Auto-adjust progress if moving to Completed with known total
    if (newStatus === "Completed" && entry.totalProgress !== null) {
      setCurrentProgress(entry.totalProgress);
    } else if (newStatus === "Planned") {
      setCurrentProgress(0);
    } else if (newStatus === "In Progress" && currentProgress === 0) {
      setCurrentProgress(1);
    }
  };

  const handleStepProgress = (delta: number) => {
    updateProgress(currentProgress + delta);
  };

  const handleProgressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    if (rawVal === "") {
      updateProgress(0);
      return;
    }
    const val = parseInt(rawVal, 10);
    if (isNaN(val) || val <= 0) {
      updateProgress(0);
      return;
    }
    updateProgress(val);
  };

  const handleConfirmRemove = () => {
    if (!entry) return;
    onRemove(entry.id);
    setIsConfirmingRemove(false);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalStatus =
      status === "Dropped"
        ? "Dropped"
        : currentProgress === 0
          ? "Planned"
          : status;
    onSave({
      ...entry,
      status: finalStatus,
      currentProgress,
      userRating,
      notes: notes.trim() || undefined,
      lastUpdated: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-log-title"
        className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Modal Header with Title & Poster preview */}
        <div className="flex items-start justify-between border-b border-border bg-muted/30 p-4 sm:p-5">
          <div className="flex items-center gap-3.5">
            <div className="relative aspect-[2/3] w-12 shrink-0 overflow-hidden rounded-lg bg-muted shadow-sm">
              <Image
                src={entry.poster}
                alt={entry.title}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`rounded px-1.5 py-0.2 text-[10px] font-bold tracking-wider border ${categoryStyle.style}`}
                >
                  {categoryStyle.badge}
                </span>
                <span className="text-xs text-subtle-foreground">
                  {entry.studio} &bull; {entry.format}
                </span>
              </div>
              <h2 id="edit-log-title" className="text-base font-bold text-foreground line-clamp-1">
                {entry.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1.5 text-subtle-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-5">
          {/* Status Selection */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">
              Status
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {STATUS_OPTIONS.map((opt) => {
                const IconComp = opt.icon;
                const isSelected = status === opt.status;
                return (
                  <button
                    key={opt.status}
                    type="button"
                    onClick={() => handleStatusChange(opt.status)}
                    className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${isSelected
                        ? opt.activeClass
                        : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                  >
                    <IconComp className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Progress Stepper & Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-foreground">
                Progress ({entry.progressUnit})
              </label>
              <div className="text-xs font-medium text-muted-foreground">
                {hasTotal ? (
                  <span>
                    {currentProgress} / {entry.totalProgress} (
                    {Math.round((currentProgress / (entry.totalProgress || 1)) * 100)}%)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-primary-subtle-foreground font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    Ongoing publication
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleStepProgress(-1)}
                disabled={currentProgress <= 0}
                aria-label="Decrease progress by 1"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </button>

              <div className="relative flex-1">
                <input
                  type="number"
                  min={0}
                  max={entry.totalProgress ?? undefined}
                  value={currentProgress}
                  onChange={handleProgressInputChange}
                  aria-label="Current progress unit"
                  className="no-spinner [appearance:textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-center text-sm font-bold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <button
                type="button"
                onClick={() => handleStepProgress(1)}
                disabled={hasTotal && currentProgress >= (entry.totalProgress || 0)}
                aria-label="Increase progress by 1"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>

              {hasTotal && (
                <button
                  type="button"
                  onClick={() => updateProgress(entry.totalProgress || 0)}
                  disabled={currentProgress === entry.totalProgress}
                  className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Set to max completed"
                >
                  Max
                </button>
              )}
            </div>
          </div>

          {/* Personal Rating */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-foreground">
                Personal Rating
              </label>
              <span className="text-xs font-bold text-foreground flex items-center gap-1">
                <Star className={`h-3.5 w-3.5 ${userRating ? "fill-rating text-rating" : "text-subtle-foreground"}`} />
                {userRating ? `${userRating.toFixed(1)} / 10` : "Unrated"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setUserRating(null)}
                className={`rounded-lg border px-2 py-1 text-xs font-medium transition-colors ${userRating === null
                    ? "border-primary bg-primary-subtle text-primary font-bold"
                    : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                None
              </button>
              {RATING_VALUES.map((score) => {
                const isSelected = userRating === score;
                return (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setUserRating(isSelected ? null : score)}
                    className={`h-8 w-8 rounded-lg border text-xs font-bold transition-colors ${isSelected
                        ? "border-primary bg-primary text-primary-foreground shadow-2xs"
                        : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                  >
                    {score}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Personal Notes */}
          <div>
            <label htmlFor="log-notes" className="block text-xs font-semibold text-foreground mb-2">
              Personal Notes &amp; Thoughts
            </label>
            <textarea
              id="log-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your reflections, thoughts, or reminder notes..."
              className="w-full rounded-xl border border-border bg-muted/40 p-2.5 text-xs text-foreground placeholder:text-subtle-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          {/* Visually Separated Action: Untrack / Remove from Library */}
          <div className="border-t border-border-subtle pt-4">
            {!isConfirmingRemove ? (
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-semibold text-foreground">
                    Remove from Library
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Stop tracking this title. Your progress, status, and personal ratings will be removed.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsConfirmingRemove(true)}
                  aria-label={`Remove ${entry.title} from library`}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/40 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Remove</span>
                </button>
              </div>
            ) : (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 animate-in fade-in zoom-in-98 duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
                      Remove &ldquo;{entry.title}&rdquo; from your library?
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      This will remove your tracking entry. The title will remain available in Discover.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setIsConfirmingRemove(false)}
                      className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmRemove}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                    >
                      <Trash2 className="h-3 w-3" aria-hidden="true" />
                      <span>Confirm</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
