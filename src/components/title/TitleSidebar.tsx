import { Star } from "lucide-react";
import { MediaItem } from "@/types/media";
import { formatYear } from "@/lib/media";

interface TitleSidebarProps {
  media: MediaItem;
}

export default function TitleSidebar({ media }: TitleSidebarProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-3.5 text-xs">
        <h2 className="text-sm font-bold text-foreground border-b border-border-subtle pb-2">
          Information
        </h2>

        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground shrink-0">Category</span>
          <span className="font-semibold text-foreground text-right">{media.category}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground shrink-0">Format</span>
          <span className="font-semibold text-foreground text-right">{media.format}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground shrink-0">Release Status</span>
          <span className="font-semibold text-foreground text-right">{media.releaseStatus}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground shrink-0">Release Year</span>
          <span className="font-semibold text-foreground text-right">{formatYear(media)}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground shrink-0">Studio / Author</span>
          <span className="font-semibold text-foreground text-right truncate" title={media.studio}>{media.studio}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground shrink-0">Total Content</span>
          <span className="font-semibold text-foreground text-right">
            {media.totalProgress !== null
              ? `${media.totalProgress} ${media.progressUnit}`
              : "Ongoing"}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground shrink-0">Community Score</span>
          <span className="font-semibold text-foreground flex items-center gap-1 shrink-0">
            <Star className="h-3 w-3 fill-rating text-rating" aria-hidden="true" />
            <span>{media.rating.toFixed(1)} / 10</span>
          </span>
        </div>
      </div>
    </div>
  );
}
