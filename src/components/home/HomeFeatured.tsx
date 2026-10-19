import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight, Sparkles, BookOpen, Clapperboard, Tv, BookText } from "lucide-react";
import Container from "@/components/Container";

const FEATURED_TITLES = [
  {
    id: "feat-1",
    title: "Frieren: Beyond Journey's End",
    category: "Anime",
    badge: "ANIME",
    badgeClass: "border-accent-anime/30 bg-accent-anime/10 text-accent-anime",
    format: "TV Series",
    meta: "Madhouse • Fantasy",
    year: "2023",
    rating: "9.6",
    synopsis: "An elf mage journeys to the resting place of souls, coming to terms with human mortality and past companionship.",
    poster: "/posters/frieren.jpg",
    icon: Sparkles,
  },
  {
    id: "feat-2",
    title: "Solo Leveling",
    category: "Comics",
    badge: "COMIC",
    badgeClass: "border-accent-comic/30 bg-accent-comic/10 text-accent-comic",
    format: "Manhwa",
    meta: "Redice Studio • Action",
    year: "2018",
    rating: "9.0",
    synopsis: "The world's weakest hunter receives an exclusive mystical interface that allows him to level up without limits.",
    poster: "/posters/solo-leveling.jpg",
    icon: BookOpen,
  },
  {
    id: "feat-3",
    title: "Interstellar",
    category: "Movies",
    badge: "MOVIE",
    badgeClass: "border-accent-movie/30 bg-accent-movie/10 text-accent-movie",
    format: "Feature Film",
    meta: "Syncopy • Sci-Fi",
    year: "2014",
    rating: "8.9",
    synopsis: "A team of space explorers travels through a wormhole beyond Saturn to locate a viable new home for humanity.",
    poster: "/posters/interstellar.jpg",
    icon: Clapperboard,
  },
  {
    id: "feat-4",
    title: "Severance",
    category: "Series",
    badge: "SERIES",
    badgeClass: "border-accent-series/30 bg-accent-series/10 text-accent-series",
    format: "TV Series",
    meta: "Apple Studios • Thriller",
    year: "2022",
    rating: "9.2",
    synopsis: "Office employees undergo a surgical procedure that strictly divides work memories from personal life.",
    poster: "/posters/severance.jpg",
    icon: Tv,
  },
  {
    id: "feat-5",
    title: "Omniscient Reader's Viewpoint",
    category: "Novels",
    badge: "NOVEL",
    badgeClass: "border-accent-novel/30 bg-accent-novel/10 text-accent-novel",
    format: "Web Novel",
    meta: "Sing Shong • Supernatural",
    year: "2018",
    rating: "9.4",
    synopsis: "The sole dedicated reader of an obscure apocalyptic web novel suddenly discovers its terrifying scenarios unfolding in real life.",
    poster: "/posters/orv.jpg",
    icon: BookText,
  },
];

export default function HomeFeatured() {
  return (
    <section className="relative">
      <Container>
        <div className="mb-6 sm:mb-12 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Representative highlights across the catalog.
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
              A curated glimpse across mediums. Extensive search, filters, and genres live in Discover.
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
          {FEATURED_TITLES.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col justify-between h-full rounded-2xl border border-border bg-card p-3 shadow-xs transition hover:border-border-strong hover:bg-card-hover"
            >
              {/* Real Vertical Poster */}
              <div>
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-muted shadow-inner">
                  <Image
                    src={item.poster}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Bottom gradient shade */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent"
                  />

                  {/* Header: Year + Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="rounded-md bg-black/65 px-1.5 py-0.5 text-[10px] font-semibold text-white/95 backdrop-blur-xs shadow-xs">
                      {item.year}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span
                      className={`rounded-md border px-1.5 py-0.5 text-[10px] font-bold tracking-wider backdrop-blur-md shadow-xs ${item.badgeClass}`}
                    >
                      {item.badge}
                    </span>
                  </div>
                </div>

                {/* Card Metadata */}
                <div className="mt-3">
                  <h3
                    className="line-clamp-1 text-sm font-semibold text-foreground group-hover:text-primary transition-colors"
                    title={item.title}
                  >
                    {item.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-subtle-foreground truncate">
                    {item.meta}
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
                  <span className="font-bold text-foreground">{item.rating}</span>
                </div>
                <Link
                  href={`/discover?q=${encodeURIComponent(item.title)}`}
                  aria-label={`View details for ${item.title}`}
                  className="text-[11px] font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-xs"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
