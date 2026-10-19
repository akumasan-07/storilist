import Link from "next/link";
import { Compass, Library } from "lucide-react";
import Container from "@/components/Container";

export default function HomeCta() {
  return (
    <section className="relative">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-12 text-center shadow-md">
          {/* Ambient CTA glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 -z-10 h-56 w-80 rounded-full bg-primary/10 blur-[80px]"
          />

          <div className="mx-auto max-w-2xl">
            {/* Brand emblem */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-extrabold shadow-sm shadow-primary/30">
              SL
            </div>

            <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Ready to organize your entire media universe?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground">
              Start logging your anime, comics, movies, series, and novels in one calm, unified personal space.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Compass className="h-4 w-4" aria-hidden="true" />
                <span>Explore Catalog</span>
              </Link>
              <Link
                href="/library"
                className="inline-flex items-center gap-2 rounded-xl border border-border-strong bg-muted-surface px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Library className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span>Go to My Library</span>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
