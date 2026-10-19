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
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            My Library
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-muted-foreground">
            Track your active reading and watchlist progress, manage backlogs, and log personal ratings.
          </p>
        </div>

        <Link
          href="/discover"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-xs hover:bg-muted hover:border-border-strong transition-colors self-start sm:self-auto"
        >
          <Compass className="h-4 w-4 text-primary" aria-hidden="true" />
          <span>Browse Discover</span>
        </Link>
      </div>

      {/* Metric Summary Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {/* Total Tracked */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-subtle-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Tracked</span>
            <Library className="h-4 w-4 text-primary" aria-hidden="true" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">
            {stats.total}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            Across 5 media formats
          </div>
        </div>

        {/* In Progress */}
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 shadow-xs">
          <div className="flex items-center justify-between text-primary">
            <span className="text-xs font-semibold uppercase tracking-wider">In Progress</span>
            <Clock className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-primary sm:text-3xl">
            {stats.inProgress}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            Actively watching & reading
          </div>
        </div>

        {/* Completed */}
        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-4 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 sm:text-3xl">
            {stats.completed}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            Finished stories
          </div>
        </div>

        {/* Average Rating */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-subtle-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg User Rating</span>
            <Star className="h-4 w-4 fill-rating text-rating" aria-hidden="true" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">
            {stats.avgRating ? `${stats.avgRating}` : "—"}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            Based on personal scores
          </div>
        </div>
      </div>
    </div>
  );
}
