import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import Container from "@/components/Container";
import { fetchHomeFeaturedTitles } from "@/lib/providers/tmdb";
import { getCategoryMeta, formatYear } from "@/lib/media";

export default async function HomeFeatured() {
  let items = [];
  try {
    items = await fetchHomeFeaturedTitles(5);
  } catch (error) {
    console.error("HomeFeatured fetch error:", error);
    return null;
  }

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="relative">
      <Container>
        <div className="mb-6 sm:mb-12 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Representative highlights across the catalog.
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
              Live popular selections from TMDB. Extensive search, filters, and genres live in Discover.
            </p>
          </div>
          <Link
            href="/discover"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl border border-border-strong bg-card px-4 py-2.5 min-h-[40px] text-xs font-semibold text-foreground transition hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span>Explore full catalog</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 sm:gap-4">
          {items.map((item) => {
            const categoryMeta = getCategoryMeta(item.category);
            const yearStr = formatYear(item);

            return (
              <div
                key={item.id}
                className="group flex flex-col justify-between h-full rounded-2xl border border-border bg-card p-3 shadow-xs transition hover:border-border-strong hover:bg-card-hover"
              >
                <div>
                  <Link
                    href={`/title/${item.id}`}
                    className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-xl"
                  >
                    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-muted shadow-inner">
                      {item.poster ? (
                        <Image
                          src={item.poster}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted/80 p-2 text-center">
                          <span className="text-[11px] font-medium text-muted-foreground line-clamp-3">
                            {item.title}
                          </span>
                        </div>
                      )}

                      {/* Bottom gradient shade */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent"
                      />

                      {/* Header: Year + Badge */}
                      {yearStr ? (
                        <div className="absolute top-2 left-2">
                          <span className="rounded-md bg-black/65 px-1.5 py-0.5 text-[10px] font-semibold text-white/95 backdrop-blur-xs shadow-xs">
                            {yearStr}
                          </span>
                        </div>
                      ) : null}
                      <div className="absolute top-2 right-2">
                        <span
                          className={`rounded-md border px-1.5 py-0.5 text-[10px] font-bold tracking-wider backdrop-blur-md shadow-xs ${categoryMeta.style}`}
                        >
                          {categoryMeta.badge}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Card Metadata */}
                  <div className="mt-3">
                    <Link
                      href={`/title/${item.id}`}
                      className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded"
                    >
                      <h3
                        className="line-clamp-1 text-sm font-semibold text-foreground group-hover:text-primary transition-colors"
                        title={item.title}
                      >
                        {item.title}
                      </h3>
                    </Link>
                    <p className="mt-0.5 text-xs text-subtle-foreground truncate">
                      {item.studio} &bull; {item.format}
                    </p>
                    <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                      {item.synopsis}
                    </p>
                  </div>
                </div>

                {/* Bottom Rating & Action */}
                <div className="mt-3 flex items-center justify-between border-t border-border-subtle pt-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-rating text-rating" aria-hidden="true" />
                    <span className="font-bold text-foreground">
                      {item.rating > 0 ? item.rating.toFixed(1) : "—"}
                    </span>
                  </div>
                  <Link
                    href={`/title/${item.id}`}
                    aria-label={`View details for ${item.title}`}
                    className="text-[11px] font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-xs"
                  >
                    Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
