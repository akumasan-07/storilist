"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DiscoverErrorState() {
  const router = useRouter();

  return (
    <div className="mt-12 rounded-2xl border border-destructive/20 bg-destructive/5 p-8 sm:p-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-base font-bold text-foreground">TMDB is currently unavailable</h2>
      <p className="mx-auto mt-1 max-w-md text-xs sm:text-sm text-muted-foreground leading-relaxed">
        We encountered a temporary issue communicating with the TMDB catalogue service.
        Please check your connection and try again.
      </p>
      <div className="mt-6 flex items-center justify-center">
        <button
          type="button"
          onClick={() => router.refresh()}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary-hover transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
}
