import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Container from "@/components/Container";
import { getMediaById, getRelatedMedia } from "@/lib/db/media";
import { getUserLibraryItems } from "@/lib/db/library";
import { createClient } from "@/lib/supabase/server";
import LibrarySync from "@/components/LibrarySync";
import TitleHero from "@/components/title/TitleHero";
import TitleSidebar from "@/components/title/TitleSidebar";
import TitleRelated from "@/components/title/TitleRelated";
import TitleInteractive, { TitleLibraryLink } from "@/components/title/TitleInteractive";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const media = await getMediaById(id);

  if (!media) {
    return {
      title: "Title Not Found | StoriList",
      description: "The requested media title could not be found in the StoriList catalog.",
    };
  }

  return {
    title: `${media.title} (${media.category}) | StoriList`,
    description: media.synopsis.slice(0, 160),
    openGraph: {
      title: `${media.title} | StoriList`,
      description: media.synopsis.slice(0, 160),
      images: [media.poster],
    },
  };
}

export default async function TitleDetailPage({ params }: PageProps) {
  const { id } = await params;
  const media = await getMediaById(id);

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
                {media.synopsis}
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
