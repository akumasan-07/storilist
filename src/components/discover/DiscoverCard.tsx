import Image from "next/image";
import Link from "next/link";
import { Star, BookmarkPlus, Check } from "lucide-react";
import { MediaItem } from "@/types/media";
import { getCategoryMeta, formatYear } from "@/lib/media";

interface DiscoverCardProps {
  item: MediaItem;
  isTracked: boolean;
  onToggleTrack: (item: MediaItem) => void;
  onSelectGenre: (genre: string) => void;
}

export default function DiscoverCard({
  item,
  isTracked,
  onToggleTrack,
  onSelectGenre,
}: DiscoverCardProps) {
  const categoryStyle = getCategoryMeta(item.category);

  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-3 shadow-xs transition duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md">
      <div>
        {/* 2:3 Vertical Poster Container */}
        <Link
          href={`/title/${item.id}`}
          className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-xl"
          aria-label={`View details for ${item.title}`}
        >
          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-muted shadow-inner">
            <Image
              src={item.poster}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Gradient shade at bottom for contrast */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent"
            />

            {/* Year Tag (Top-Left) */}
            <div className="absolute top-2 left-2">
              <span className="rounded-md bg-black/65 px-1.5 py-0.5 text-[10px] font-semibold text-white/95 backdrop-blur-xs shadow-xs">
                {formatYear(item)}
              </span>
            </div>

            {/* Category Badge (Top-Right) */}
            <div className="absolute top-2 right-2">
              <span
                className={`rounded-md border px-1.5 py-0.5 text-[10px] font-bold tracking-wider backdrop-blur-md shadow-xs ${categoryStyle.style}`}
              >
                {categoryStyle.badge}
              </span>
            </div>
          </div>
        </Link>

        {/* Metadata & Synopsis */}
        <div className="mt-3">
          <Link
            href={`/title/${item.id}`}
            className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded"
          >
            <h2
              className="line-clamp-1 text-sm font-semibold text-foreground group-hover:text-primary transition-colors"
              title={item.title}
            >
              {item.title}
            </h2>
          </Link>
          <p className="mt-0.5 text-xs text-subtle-foreground truncate">
            {item.studio} &bull; {item.format}
          </p>

          {/* Genre Chips */}
          <div className="mt-2 flex flex-wrap items-center gap-1">
            {item.genres.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => onSelectGenre(genre)}
                className="rounded border border-border-subtle bg-muted/60 px-1.5 py-0.2 text-[10px] font-medium text-muted-foreground hover:border-border hover:text-foreground transition-colors cursor-pointer"
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Concise Synopsis */}
          <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
            {item.synopsis}
          </p>
        </div>
      </div>

      {/* Card Footer: Rating & Quick Save Affordance */}
      <div className="mt-3 flex items-center justify-between border-t border-border-subtle pt-2.5 text-xs">
        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-rating text-rating" aria-hidden="true" />
          <span className="font-bold text-foreground">{item.rating.toFixed(1)}</span>
        </div>

        <button
          type="button"
          onClick={() => onToggleTrack(item)}
          title={isTracked ? `Remove ${item.title} from library` : `Add ${item.title} to library`}
          aria-label={isTracked ? `Remove ${item.title} from library` : `Add ${item.title} to library`}
          className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer ${isTracked
              ? "border-primary bg-primary text-primary-foreground shadow-xs"
              : "border-border bg-card text-foreground shadow-2xs hover:border-primary hover:text-primary"
            }`}
        >
          {isTracked ? (
            <>
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Tracked</span>
            </>
          ) : (
            <>
              <BookmarkPlus className="h-3.5 w-3.5 text-subtle-foreground group-hover:text-primary" aria-hidden="true" />
              <span>Track</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}
