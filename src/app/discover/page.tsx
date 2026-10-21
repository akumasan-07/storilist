import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllMedia } from "@/lib/db/media";
import { getUserLibraryItems } from "@/lib/db/library";
import { createClient } from "@/lib/supabase/server";
import DiscoverClient from "@/components/discover/DiscoverClient";

export const metadata: Metadata = {
  title: "Discover Stories | StoriList",
  description:
    "Explore curated highlights across anime, comics, movies, series, and novels.",
};

export default async function DiscoverPage() {
  const mediaItems = await getAllMedia();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userLibraryItems = user ? await getUserLibraryItems(user.id) : [];

  return (
    <Suspense
      fallback={
        <div className="py-16 text-center text-sm text-muted-foreground">
          Loading catalog...
        </div>
      }
    >
      <DiscoverClient
        mediaItems={mediaItems}
        initialLibraryItems={userLibraryItems}
      />
    </Suspense>
  );
}
