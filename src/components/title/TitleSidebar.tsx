import { Star } from "lucide-react";
import { MediaItem } from "@/types/media";
import { formatYear } from "@/lib/media";

interface TitleSidebarProps {
  media: MediaItem;
}

export default function TitleSidebar({ media }: TitleSidebarProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4 text-xs">
        <h2 className="text-sm font-bold text-foreground border-b border-border-subtle pb-2">
          Information
        </h2>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Category</span>
          <span className="font-semibold text-foreground">{media.category}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Format</span>
          <span className="font-semibold text-foreground">{media.format}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Release Status</span>
          <span className="font-semibold text-foreground">{media.releaseStatus}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Release Year</span>
          <span className="font-semibold text-foreground">{formatYear(media)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Studio / Author</span>
          <span className="font-semibold text-foreground">{media.studio}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Total Content</span>
          <span className="font-semibold text-foreground">
            {media.totalProgress !== null
              ? `${media.totalProgress} ${media.progressUnit}`
              : "Ongoing"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Community Score</span>
          <span className="font-semibold text-foreground flex items-center gap-1">
            <Star className="h-3 w-3 fill-rating text-rating" aria-hidden="true" />
            <span>{media.rating.toFixed(1)} / 10</span>
          </span>
        </div>
      </div>
    </div>
  );
}
