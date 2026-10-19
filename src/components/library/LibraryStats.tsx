import Link from "next/link";
import { Library, Clock, CheckCircle2, Star, Compass } from "lucide-react";

export interface LibraryStatsData {
  total: number;
  inProgress: number;
  completed: number;
  planned: number;
  dropped: number;
  avgRating: string | null;
}

interface LibraryStatsProps {
  stats: LibraryStatsData;
}

export default function LibraryStats({ stats }: LibraryStatsProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            My Library
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm md:text-base text-muted-foreground">
            Track your active reading and watchlist progress, manage backlogs, and log personal ratings.
          </p>
        </div>

        <Link
          href="/discover"
          className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 min-h-[40px] text-xs font-semibold text-foreground shadow-xs hover:bg-muted hover:border-border-strong transition-colors"
        >
          <Compass className="h-4 w-4 text-primary" aria-hidden="true" />
          <span>Browse Discover</span>
        </Link>
      </div>

      {/* Metric Summary Cards Grid */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-4">
        {/* Total Tracked */}
        <div className="min-w-0 rounded-2xl border border-border bg-card p-3 sm:p-4 shadow-xs">
          <div className="flex items-center justify-between text-subtle-foreground">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate">Total Tracked</span>
            <Library className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0 ml-1" aria-hidden="true" />
          </div>
          <div className="mt-1.5 text-xl font-extrabold text-foreground sm:text-2xl lg:text-3xl">
            {stats.total}
          </div>
          <div className="mt-1 text-[10px] sm:text-[11px] text-muted-foreground truncate">
            Across 5 formats
          </div>
        </div>

        {/* In Progress */}
        <div className="min-w-0 rounded-2xl border border-primary/30 bg-primary/5 p-3 sm:p-4 shadow-xs">
          <div className="flex items-center justify-between text-primary">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate">In Progress</span>
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 ml-1" aria-hidden="true" />
          </div>
          <div className="mt-1.5 text-xl font-extrabold text-primary sm:text-2xl lg:text-3xl">
            {stats.inProgress}
          </div>
          <div className="mt-1 text-[10px] sm:text-[11px] text-muted-foreground truncate">
            Watching & reading
          </div>
        </div>

        {/* Completed */}
        <div className="min-w-0 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-3 sm:p-4 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate">Completed</span>
            <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 ml-1" aria-hidden="true" />
          </div>
          <div className="mt-1.5 text-xl font-extrabold text-emerald-600 dark:text-emerald-400 sm:text-2xl lg:text-3xl">
            {stats.completed}
          </div>
          <div className="mt-1 text-[10px] sm:text-[11px] text-muted-foreground truncate">
            Finished stories
          </div>
        </div>

        {/* Average Rating */}
        <div className="min-w-0 rounded-2xl border border-border bg-card p-3 sm:p-4 shadow-xs">
          <div className="flex items-center justify-between text-subtle-foreground">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate">Avg Rating</span>
            <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-rating text-rating shrink-0 ml-1" aria-hidden="true" />
          </div>
          <div className="mt-1.5 text-xl font-extrabold text-foreground sm:text-2xl lg:text-3xl">
            {stats.avgRating ? `${stats.avgRating}` : "—"}
          </div>
          <div className="mt-1 text-[10px] sm:text-[11px] text-muted-foreground truncate">
            Personal scores
          </div>
        </div>
      </div>
    </div>
  );
}
