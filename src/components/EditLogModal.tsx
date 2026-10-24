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
  Trash2,
} from "lucide-react";
import { LibraryEntry, LibraryItem, LibraryStatus } from "@/types/library";
import { getCategoryMeta } from "@/lib/media";
import { getProgressPercent } from "@/lib/library";

interface EditLogModalProps {
  item?: LibraryItem | null;
  entry?: LibraryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedEntry: LibraryEntry) => void;
  onRemove: (mediaId: string) => void;
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

interface EditLogModalDialogProps {
  target: LibraryItem;
  onClose: () => void;
  onSave: (updatedEntry: LibraryEntry) => void;
  onRemove: (mediaId: string) => void;
}

function EditLogModalDialog({
  target,
  onClose,
  onSave,
  onRemove,
}: EditLogModalDialogProps) {
  const [status, setStatus] = useState<LibraryStatus>(() =>
    target.status === "Dropped"
      ? "Dropped"
      : target.currentProgress === 0
        ? "Planned"
        : target.status
  );
  const [currentProgress, setCurrentProgress] = useState(target.currentProgress);
  const [userRating, setUserRating] = useState<number | null>(target.userRating);
  const [notes, setNotes] = useState(target.notes || "");
  const [isConfirmingRemove, setIsConfirmingRemove] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const { media } = target;
  const categoryStyle = getCategoryMeta(media.category);
  const hasTotal = media.totalProgress !== null;

  const updateProgress = (nextProgress: number) => {
    let clamped = nextProgress < 0 ? 0 : nextProgress;
    if (media.totalProgress !== null && clamped > media.totalProgress) {
      clamped = media.totalProgress;
    }

    setCurrentProgress(clamped);

    setStatus((prevStatus) => {
      if (prevStatus === "Dropped") return "Dropped";
      if (clamped === 0) return "Planned";
      if (media.totalProgress !== null && clamped >= media.totalProgress) return "Completed";
      if (prevStatus === "Planned" || prevStatus === "Completed") return "In Progress";
      return prevStatus;
    });
  };

  const handleStatusChange = (newStatus: LibraryStatus) => {
    setStatus(newStatus);
    if (newStatus === "Completed" && media.totalProgress !== null) {
      setCurrentProgress(media.totalProgress);
    } else if (newStatus === "Planned") {
      setCurrentProgress(0);
    } else if (newStatus === "In Progress" && currentProgress === 0) {
      setCurrentProgress(1);
    }
  };

  const handleProgressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    if (rawVal === "") {
      updateProgress(0);
      return;
    }
    const val = parseInt(rawVal, 10);
    updateProgress(isNaN(val) || val <= 0 ? 0 : val);
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
      mediaId: target.mediaId,
      status: finalStatus,
      currentProgress,
      userRating,
      notes: notes.trim() || undefined,
      lastUpdated: new Date().toISOString(),
      addedAt: target.addedAt,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog Window with max height & internal scrolling */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-log-title"
        className="relative z-10 w-full max-w-lg rounded-t-3xl sm:rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-150 max-h-[92dvh] sm:max-h-[88dvh] flex flex-col"
      >
        {/* Header - Fixed at top */}
        <div className="shrink-0 flex items-start justify-between border-b border-border bg-muted/30 p-4 sm:p-5">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative aspect-[2/3] w-11 sm:w-12 shrink-0 overflow-hidden rounded-lg bg-muted shadow-sm">
              {media.poster ? (
                <Image
                  src={media.poster}
                  alt={media.title}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted/80 text-[10px] text-muted-foreground">
                  No Poster
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wider border ${categoryStyle.style}`}
                >
                  {categoryStyle.badge}
                </span>
                <span className="text-xs text-subtle-foreground truncate">
                  {media.studio} &bull; {media.format}
                </span>
              </div>
              <h2 id="edit-log-title" className="text-sm sm:text-base font-bold text-foreground truncate">
                {media.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-2 min-h-[40px] min-w-[40px] flex items-center justify-center text-subtle-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="edit-log-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 sm:space-y-5 overscroll-contain">
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
                    className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-2.5 py-2.5 sm:py-2 text-xs font-semibold transition-colors min-h-[42px] sm:min-h-[38px] cursor-pointer ${isSelected
                        ? opt.activeClass
                        : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                  >
                    <IconComp className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Progress Stepper & Input */}
          <div>
            <div className="flex items-center justify-between mb-2 gap-2">
              <label className="text-xs font-semibold text-foreground">
                Progress ({media.progressUnit})
              </label>
              <div className="text-xs font-medium text-muted-foreground truncate">
                {hasTotal ? (
                  <span>
                    {currentProgress} / {media.totalProgress} (
                    {getProgressPercent(currentProgress, media.totalProgress)}%)
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
                onClick={() => updateProgress(currentProgress - 1)}
                disabled={currentProgress <= 0}
                aria-label="Decrease progress by 1"
                className="inline-flex h-11 w-11 sm:h-10 sm:w-10 min-h-[44px] min-w-[44px] sm:min-h-[40px] sm:min-w-[40px] items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </button>

              <div className="relative flex-1">
                <input
                  type="number"
                  min={0}
                  max={media.totalProgress ?? undefined}
                  value={currentProgress}
                  onChange={handleProgressInputChange}
                  aria-label="Current progress unit"
                  className="no-spinner w-full h-11 sm:h-10 rounded-xl border border-border bg-muted/40 px-3 py-2 text-center text-sm sm:text-base font-bold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <button
                type="button"
                onClick={() => updateProgress(currentProgress + 1)}
                disabled={hasTotal && currentProgress >= (media.totalProgress || 0)}
                aria-label="Increase progress by 1"
                className="inline-flex h-11 w-11 sm:h-10 sm:w-10 min-h-[44px] min-w-[44px] sm:min-h-[40px] sm:min-w-[40px] items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>

              {hasTotal && (
                <button
                  type="button"
                  onClick={() => updateProgress(media.totalProgress || 0)}
                  disabled={currentProgress === media.totalProgress}
                  className="h-11 sm:h-10 rounded-xl border border-border bg-card px-3 sm:px-3.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
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

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setUserRating(null)}
                className={`h-9 sm:h-8 px-2.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${userRating === null
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
                    className={`h-9 w-9 sm:h-8 sm:w-8 min-h-[36px] min-w-[36px] sm:min-h-[32px] sm:min-w-[32px] rounded-lg border text-xs font-bold transition-colors cursor-pointer ${isSelected
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

          {/* Untrack / Remove from Library */}
          <div className="border-t border-border-subtle pt-3.5">
            {!isConfirmingRemove ? (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                <div>
                  <h3 className="text-xs font-semibold text-foreground">
                    Remove from Library
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Stop tracking this title. Your progress and ratings will be removed.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsConfirmingRemove(true)}
                  aria-label={`Remove ${media.title} from library`}
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-rose-500/25 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/40 transition-colors min-h-[38px] cursor-pointer self-start sm:self-auto"
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
                      Remove &ldquo;{media.title}&rdquo; from your library?
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      This removes your log entry. The title remains available in Discover.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setIsConfirmingRemove(false)}
                      className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer min-h-[36px]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onRemove(target.mediaId);
                        setIsConfirmingRemove(false);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 shadow-xs transition-colors cursor-pointer min-h-[36px]"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Confirm</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Sticky Modal Footer Actions - Always visible on screen */}
        <div className="shrink-0 border-t border-border bg-card p-4 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 sm:flex-none rounded-xl border border-border bg-card px-4 py-2.5 sm:py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer min-h-[42px] sm:min-h-[38px] text-center justify-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-log-form"
            className="flex-1 sm:flex-none rounded-xl bg-primary px-5 py-2.5 sm:py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer min-h-[42px] sm:min-h-[38px] text-center justify-center"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EditLogModal(props: EditLogModalProps) {
  const target = props.item || props.entry;
  if (!props.isOpen || !target) return null;

  return (
    <EditLogModalDialog
      key={`${target.mediaId}-${target.lastUpdated}`}
      target={target}
      onClose={props.onClose}
      onSave={props.onSave}
      onRemove={props.onRemove}
    />
  );
}
