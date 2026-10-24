"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Container from "@/components/Container";

interface ErrorProps {
  error: Error & { digest?: string };
  reset?: () => void;
  retry?: () => void;
}

export default function GlobalError({ error, reset, retry }: ErrorProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  const handleRetry = () => {
    if (typeof retry === "function") {
      retry();
    } else if (typeof reset === "function") {
      reset();
    }
  };

  return (
    <div className="py-12 sm:py-24">
      <Container>
        <div className="w-full max-w-md mx-auto">
          <div className="mb-6 flex justify-center">
            <Link
              href="/"
              aria-label="Return to StoriList home"
              className="transition-transform hover:scale-105"
            >
              <Image
                src="/lettermark.png"
                alt="StoriList"
                width={40}
                height={40}
                className="h-10 w-10 rounded-xl object-contain shadow-xs"
              />
            </Link>
          </div>
          <div className="rounded-2xl border border-destructive/20 bg-card/60 p-6 sm:p-12 text-center shadow-xs">
            <div className="mx-auto flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <AlertCircle className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
            </div>
          <h1 className="mt-4 text-xl sm:text-2xl font-bold text-foreground">Something went wrong</h1>
          <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            An unexpected error occurred while loading this view. You can try recovering or return to the overview.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 min-h-[42px] text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary-hover transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Try Again</span>
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 min-h-[42px] text-xs font-semibold text-foreground hover:bg-muted transition-colors"
            >
              <Home className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>Back Home</span>
            </Link>
          </div>
        </div>
        </div>
      </Container>
    </div>
  );
}
