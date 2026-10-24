import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Container from "@/components/Container";
import { getMediaById, getRelatedMedia, upsertMediaFromProvider } from "@/lib/db/media";
import { getUserLibraryItems } from "@/lib/db/library";
import { createClient } from "@/lib/supabase/server";
import { parseMediaId, fetchMediaFromProvider } from "@/lib/providers";
import { MediaItem } from "@/types/media";
import LibrarySync from "@/components/LibrarySync";
import TitleHero from "@/components/title/TitleHero";
import TitleSidebar from "@/components/title/TitleSidebar";
import TitleRelated from "@/components/title/TitleRelated";
import TitleInteractive, { TitleLibraryLink } from "@/components/title/TitleInteractive";

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Resolves media by ID:
 * 1. Database catalogue first.
 * 2. If database row exists with source and is older than 30 days, refreshes best-effort in the background.
 * 3. If missing from DB and ID conforms to a valid provider format, fetches from provider for display (read-only, no write).
 * 4. Returns null on invalid ID or provider failure (no leaked provider errors).
 */
async function resolveTitleMedia(id: string): Promise<MediaItem | null> {
  const dbMedia = await getMediaById(id);

  if (dbMedia) {
    if (dbMedia.source && dbMedia.fetchedAt) {
      const fetchedTime = new Date(dbMedia.fetchedAt).getTime();
      const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
      if (Date.now() - fetchedTime > thirtyDaysMs) {
        // Best-effort background refresh (never fail or slow down the response)
        fetchMediaFromProvider(dbMedia.id)
          .then((fresh) => {
            if (fresh) return upsertMediaFromProvider(fresh);
          })
          .catch((err) => {
            console.error("Best-effort media refresh failed:", err);
          });
      }
    }
    return dbMedia;
  }

  const parsed = parseMediaId(id);
  if (!parsed) {
    return null;
  }

  try {
    const providerMedia = await fetchMediaFromProvider(id);
    return providerMedia;
  } catch (error) {
    console.error("Failed to fetch provider media:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const media = await resolveTitleMedia(id);

  if (!media) {
    return {
      title: "Title Not Found | StoriList",
      description: "The requested media title could not be found in the StoriList catalog.",
    };
  }

  const description = media.synopsis ? media.synopsis.slice(0, 160) : undefined;

  return {
    title: `${media.title} (${media.category}) | StoriList`,
    description,
    openGraph: {
      title: `${media.title} | StoriList`,
      description,
      images: media.poster ? [media.poster] : [],
    },
  };
}

export default async function TitleDetailPage({ params }: PageProps) {
  const { id } = await params;
  const media = await resolveTitleMedia(id);

  if (!media) {
    notFound();
  }

  const relatedMedia = await getRelatedMedia(media.category, media.id, 4);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userLibraryItems = user ? await getUserLibraryItems(user.id) : [];

  return (
    <div className="py-8 sm:py-12">
      <LibrarySync items={userLibraryItems} />
      <Container>
        {/* Back Navigation Bar */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/discover"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to Discover</span>
          </Link>

          <TitleLibraryLink mediaId={media.id} />
        </div>

        {/* Hero Section */}
        <TitleHero
          media={media}
          trackingSlot={<TitleInteractive media={media} />}
        />

        {/* Synopsis & Information Details */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
              <h2 className="text-base font-bold text-foreground">Synopsis</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {media.synopsis || "No synopsis available for this title."}
              </p>
            </div>

            {/* Creators & Credits */}
            {media.creators && media.creators.length > 0 && (
              <div className="rounded-3xl border border-border bg-card p-6 shadow-xs">
                <h2 className="text-base font-bold text-foreground">Key Credits</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {media.creators.map((credit) => (
                    <span
                      key={credit}
                      className="rounded-xl border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-foreground"
                    >
                      {credit}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Metadata Sidebar */}
          <TitleSidebar media={media} />
        </div>

        {/* Related Titles */}
        <TitleRelated media={media} relatedMedia={relatedMedia} />
      </Container>
    </div>
  );
}
