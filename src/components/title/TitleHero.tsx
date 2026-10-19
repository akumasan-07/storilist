import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Building2,
  Sparkles,
  BookOpen,
  Clapperboard,
  Tv,
  BookText,
} from "lucide-react";
import { MediaItem } from "@/types/media";
import { MediaCategory } from "@/types/library";
import { getCategoryMeta, formatYear } from "@/lib/media";

const CATEGORY_ICONS: Record<MediaCategory, typeof Sparkles> = {
  Anime: Sparkles,
  Comics: BookOpen,
  Movies: Clapperboard,
  Series: Tv,
  Novels: BookText,
};

interface TitleHeroProps {
  media: MediaItem;
  trackingSlot?: React.ReactNode;
}

export default function TitleHero({ media, trackingSlot }: TitleHeroProps) {
  const CategoryIcon = CATEGORY_ICONS[media.category];
  const categoryStyle = getCategoryMeta(media.category);

  return (
    <div className="relative rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs overflow-hidden">
      {/* Subtle Ambient Background Gradient using Format Tone */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative flex flex-col md:flex-row gap-6 sm:gap-8 md:gap-10">
        {/* 2:3 Vertical Poster */}
        <div className="w-44 sm:w-56 md:w-64 shrink-0 mx-auto md:mx-0">
          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-md">
            <Image
              src={media.poster}
              alt={media.title}
              fill
              priority
              sizes="(max-width: 640px) 176px, (max-width: 768px) 224px, 256px"
              className="object-cover"
            />

            {/* Top-Right Category Badge */}
            <div className="absolute top-2.5 right-2.5">
              <span
                className={`rounded-md border px-2 py-0.5 text-[11px] font-bold tracking-wider backdrop-blur-md shadow-xs ${categoryStyle.style}`}
              >
                {categoryStyle.badge}
              </span>
            </div>

            {/* Top-Left Release Status */}
            <div className="absolute top-2.5 left-2.5">
              <span className="rounded-md bg-black/65 px-2 py-0.5 text-[10px] font-semibold text-white/95 backdrop-blur-xs shadow-xs">
                {media.releaseStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Title Identity, Metadata & Primary Action */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            {/* Header & Tagline */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                <CategoryIcon className="h-3.5 w-3.5" aria-hidden="true" />
                {media.category}
              </span>
              <span className="text-subtle-foreground">&bull;</span>
              <span className="text-xs text-muted-foreground">{media.format}</span>
              <span className="text-subtle-foreground">&bull;</span>
              <span className="text-xs text-muted-foreground">{formatYear(media)}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              {media.title}
            </h1>

            {media.tagline && (
              <p className="mt-2 text-sm sm:text-base italic text-muted-foreground">
                &ldquo;{media.tagline}&rdquo;
              </p>
            )}

            {/* Studio / Creator & Ratings Bar */}
            <div className="mt-4 flex flex-wrap items-center gap-4 border-y border-border-subtle py-3 text-xs">
              <div className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-subtle-foreground" aria-hidden="true" />
                <span className="font-semibold text-foreground">{media.studio}</span>
              </div>

              <div className="h-3 w-px bg-border-subtle" />

              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-rating text-rating" aria-hidden="true" />
                <span className="font-bold text-foreground text-sm">{media.rating.toFixed(1)}</span>
                <span className="text-subtle-foreground">(Community score)</span>
              </div>

              <div className="h-3 w-px bg-border-subtle" />

              <div className="text-subtle-foreground">
                {media.totalProgress !== null
                  ? `${media.totalProgress} ${media.progressUnit}`
                  : "Ongoing serialization"}
              </div>
            </div>

            {/* Genre Pills */}
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              {media.genres.map((genre) => (
                <Link
                  key={genre}
                  href={`/discover?genre=${encodeURIComponent(genre)}`}
                  className="rounded-lg border border-border-subtle bg-muted/50 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:border-border hover:text-foreground transition-colors"
                >
                  {genre}
                </Link>
              ))}
            </div>
          </div>

          {/* Tracking Slot for Client-side interactive controls */}
          {trackingSlot}
        </div>
      </div>
    </div>
  );
}
