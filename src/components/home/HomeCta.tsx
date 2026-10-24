import Link from "next/link";
import Image from "next/image";
import { Compass, Library } from "lucide-react";
import Container from "@/components/Container";

export default function HomeCta() {
  return (
    <section className="relative">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-12 text-center shadow-md">
          {/* Ambient CTA glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 -z-10 h-56 w-80 rounded-full bg-primary/10 blur-[80px]"
          />

          <div className="mx-auto max-w-2xl">
            {/* Brand logo */}
            <Image
              src="/logo.png"
              alt="StoriList"
              width={112}
              height={112}
              className="mx-auto h-24 w-24 sm:h-28 sm:w-28 rounded-3xl object-contain shadow-md"
            />

            <h2 className="mt-5 text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground break-words">
              Ready to organize your entire media universe?
            </h2>
            <p className="mt-2.5 text-xs sm:text-sm md:text-base text-muted-foreground">
              Start logging your anime, comics, movies, series, and novels in one calm, unified personal space.
            </p>

            <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-3.5 max-w-sm mx-auto sm:max-w-none">
              <Link
                href="/discover"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 min-h-[44px] text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Compass className="h-4 w-4" aria-hidden="true" />
                <span>Explore Catalog</span>
              </Link>
              <Link
                href="/library"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-strong bg-muted-surface px-5 py-3 min-h-[44px] text-sm font-semibold text-foreground transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
