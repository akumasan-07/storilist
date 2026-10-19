import Image from "next/image";
import Link from "next/link";
import { Star, SlidersHorizontal } from "lucide-react";
import { LibraryItem, LibraryStatus } from "@/types/library";
import { getCategoryMeta } from "@/lib/media";
import { getProgressPercent } from "@/lib/library";

const STATUS_BADGE_STYLES: Record<LibraryStatus, string> = {
  "In Progress": "border-primary/40 bg-primary-subtle text-primary-subtle-foreground font-semibold",
  "Completed": "border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold",
  "Planned": "border-sky-500/40 bg-sky-500/15 text-sky-600 dark:text-sky-400 font-semibold",
  "Dropped": "border-border bg-muted text-muted-foreground font-medium",
};

interface LibraryCardProps {
  item: LibraryItem;
  onOpenLogModal: (item: LibraryItem) => void;
}

export default function LibraryCard({ item, onOpenLogModal }: LibraryCardProps) {
  const categoryStyle = getCategoryMeta(item.media.category);
  const statusBadgeStyle = STATUS_BADGE_STYLES[item.status];
  const progressPercentage = getProgressPercent(item.currentProgress, item.media.totalProgress);

  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-2.5 sm:p-3 shadow-xs transition duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md min-w-0">
      <div>
        {/* 2:3 Vertical Poster Container */}
        <Link
          href={`/title/${item.mediaId}`}
          className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-xl"
          aria-label={`View details for ${item.media.title}`}
        >
          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-muted shadow-inner">
            <Image
              src={item.media.poster}
              alt={item.media.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Gradient shade at bottom for contrast */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/65 to-transparent"
            />

            {/* Category Badge (Top-Left) */}
            <div className="absolute top-2 left-2 max-w-[48%]">
              <span
                className={`block truncate rounded-md border px-1.5 py-0.5 text-[10px] font-bold tracking-wider backdrop-blur-md shadow-xs ${categoryStyle.style}`}
              >
                {categoryStyle.badge}
              </span>
            </div>

            {/* Year Badge (Top-Right) */}
            <div className="absolute top-2 right-2 max-w-[48%]">
              <span className="block truncate rounded-md bg-black/65 px-1.5 py-0.5 text-[10px] font-semibold text-white/95 backdrop-blur-xs shadow-xs">
                {item.media.startYear}
              </span>
            </div>

            {/* Bottom Overlay Status Tag */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
              <span
                className={`truncate rounded-md border px-2 py-0.5 text-[10px] tracking-wide backdrop-blur-md shadow-xs ${statusBadgeStyle}`}
              >
                {item.status}
              </span>
            </div>
          </div>
        </Link>

        {/* Metadata & Progress Content */}
        <div className="mt-2.5 sm:mt-3">
          <Link
            href={`/title/${item.mediaId}`}
            className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded"
          >
            <h2
              className="line-clamp-1 text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors"
              title={item.media.title}
            >
              {item.media.title}
            </h2>
          </Link>
          <p className="mt-0.5 text-[11px] sm:text-xs text-subtle-foreground truncate">
            {item.media.studio} &bull; {item.media.format}
          </p>

          {/* Progress Bar & Numerical Counter */}
          <div className="mt-2 sm:mt-3 space-y-1 rounded-xl border border-border-subtle bg-muted/40 p-2">
            {item.media.totalProgress !== null ? (
              <>
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] gap-1">
                  <span className="font-semibold text-foreground truncate">
                    {item.currentProgress}/{item.media.totalProgress} {item.media.progressUnit}
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground shrink-0">
                    {progressPercentage}%
                  </span>
                </div>

                {/* Progress Bar Track */}
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${item.status === "Completed"
                        ? "bg-emerald-500"
                        : item.status === "Dropped"
                          ? "bg-muted-foreground"
                          : "bg-primary"
                      }`}
                    style={{
                      width: `${progressPercentage}%`,
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between text-[10px] sm:text-[11px]">
                  <span className="font-semibold text-foreground truncate">
                    {item.currentProgress} {item.media.progressUnit}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    Ongoing
                  </span>
                </div>

                <div className="flex items-center justify-between pt-0.5 text-[10px] text-muted-foreground">
                  <span className="truncate">Serialized release</span>
                </div>
              </>
            )}
          </div>

          {/* Notes / Remarks if present */}
          {item.notes && (
            <p className="mt-1.5 sm:mt-2 line-clamp-1 sm:line-clamp-2 text-[10px] sm:text-[11px] leading-relaxed text-muted-foreground italic">
              &ldquo;{item.notes}&rdquo;
            </p>
          )}
        </div>
      </div>

      {/* Card Footer: User Rating & Action Button */}
      <div className="mt-2.5 sm:mt-3 flex items-center justify-between border-t border-border-subtle pt-2 sm:pt-2.5 text-xs gap-1.5">
        {/* User Rating */}
        <div className="flex items-center gap-1 min-w-0" title={item.userRating ? `Rated ${item.userRating}/10` : "Community score"}>
          <Star
            className={`h-3.5 w-3.5 shrink-0 ${item.userRating
              ? "fill-rating text-rating"
              : "fill-subtle-foreground/30 text-subtle-foreground"
              }`}
            aria-hidden="true"
          />
          <span className="font-bold text-foreground text-xs">
            {item.userRating ? item.userRating.toFixed(1) : item.media.rating.toFixed(1)}
          </span>
          {item.userRating && (
            <span className="hidden sm:inline text-[10px] text-subtle-foreground font-normal">
              (Yours)
            </span>
          )}
        </div>

        {/* Functional Log Action Button with comfortable touch target */}
        <button
          type="button"
          onClick={() => onOpenLogModal(item)}
          aria-label={`Update log for ${item.media.title}`}
          className="inline-flex items-center justify-center gap-1 rounded-lg border border-border bg-card px-2.5 sm:px-3 py-1.5 min-h-[36px] sm:min-h-[32px] text-xs sm:text-[11px] font-semibold text-foreground shadow-2xs hover:border-primary hover:bg-primary-subtle hover:text-primary-subtle-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer shrink-0"
        >
          <SlidersHorizontal className="h-3 w-3 text-subtle-foreground" aria-hidden="true" />
          <span>Log</span>
        </button>
      </div>
    </article>
  );
}
