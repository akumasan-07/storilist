import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { MediaItem } from "@/types/media";
import { formatYear } from "@/lib/media";

interface TitleRelatedProps {
  media: MediaItem;
  relatedMedia: MediaItem[];
}

export default function TitleRelated({ media, relatedMedia }: TitleRelatedProps) {
  if (relatedMedia.length === 0) return null;

  return (
    <div className="mt-12 border-t border-border pt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            More in {media.category}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Similar popular selections from our curated index.
          </p>
        </div>

        <Link
          href={`/discover?category=${media.category.toLowerCase()}`}
          className="text-xs font-semibold text-primary hover:underline transition-colors"
        >
          Browse all {media.category} &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
        {relatedMedia.map((rel) => (
          <Link
            key={rel.id}
            href={`/title/${rel.id}`}
            className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-3 shadow-xs transition duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md"
          >
            <div>
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-muted shadow-inner">
                <Image
                  src={rel.poster}
                  alt={rel.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/60 to-transparent"
                />
                <div className="absolute top-2 left-2">
                  <span className="rounded-md bg-black/65 px-1.5 py-0.5 text-[10px] font-semibold text-white/95 backdrop-blur-xs shadow-xs">
                    {formatYear(rel)}
                  </span>
                </div>
              </div>

              <div className="mt-2.5">
                <h3 className="line-clamp-1 text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                  {rel.title}
                </h3>
                <p className="mt-0.5 text-[11px] text-subtle-foreground truncate">
                  {rel.studio} &bull; {rel.format}
                </p>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between border-t border-border-subtle pt-2 text-[11px]">
              <div className="flex items-center gap-1 font-bold text-foreground">
                <Star className="h-3 w-3 fill-rating text-rating" aria-hidden="true" />
                <span>{rel.rating.toFixed(1)}</span>
              </div>
              <span className="text-[10px] text-subtle-foreground">{rel.format}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
