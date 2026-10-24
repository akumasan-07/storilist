import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Heart, ShieldCheck } from "lucide-react";
import Container from "@/components/Container";

export const metadata: Metadata = {
  title: "About & Credits | StoriList",
  description:
    "Information about StoriList, external catalogue sources, and API attribution notices.",
};

export default function AboutPage() {
  return (
    <div className="py-8 sm:py-16">
      <Container>
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="mx-auto max-w-3xl space-y-10">
          {/* Main heading */}
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              About &amp; Attribution
            </h1>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground">
              StoriList is a unified personal tracking application designed for cataloguing
              stories across mediums — Anime, Comics, Movies, Series, and Novels — in one cohesive place.
            </p>
          </div>

          {/* Project nature statement */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
            <div className="flex items-start gap-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Heart className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-sm font-bold text-foreground">Personal Project Notice</h2>
                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  StoriList is a non-commercial, personal open project created for individual media
                  organization and tracking. It is not monetized, runs no advertisements, and does
                  not sell user data.
                </p>
              </div>
            </div>
          </div>

          {/* External Data Providers Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Data Providers &amp; Credits
            </h2>

            {/* TMDB Attribution Card */}
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border-subtle pb-5">
                <div className="flex items-center gap-3">
                  {/* TMDB Official Logo: smaller and less prominent than our branding, natural colors preserved */}
                  <div className="rounded-lg bg-card-hover/40 px-3 py-2 border border-border">
                    <Image
                      src="/tmdb-logo.svg"
                      alt="The Movie Database (TMDB)"
                      width={120}
                      height={16}
                      className="h-4 w-auto object-contain"
                    />
                  </div>
                  <span className="text-xs font-semibold text-subtle-foreground">
                    Movies &amp; Series Metadata
                  </span>
                </div>

                <a
                  href="https://www.themoviedb.org"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <span>Visit themoviedb.org</span>
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>

              <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                <p>
                  This product uses the TMDB API but is not endorsed or certified by TMDB.
                </p>
                <p className="text-xs text-subtle-foreground">
                  Movie and series information, posters, release dates, runtime minutes, and credit details
                  are provided through the TMDB REST API.
                </p>
              </div>
            </div>

            {/* Data integrity card */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-anime/10 text-accent-anime">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-foreground">Attribution &amp; Fair Use</h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    All titles, cover art, and related media metadata remain the property of their respective
                    creators, copyright holders, and source databases.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
