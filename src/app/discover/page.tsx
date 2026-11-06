import type { Metadata } from "next";
import { Suspense } from "react";
import { z } from "zod";
import Container from "@/components/Container";
import LibrarySync from "@/components/LibrarySync";
import { getUserLibraryItems } from "@/lib/db/library";
import { createClient } from "@/lib/supabase/server";
import { DISCOVER_GENRES, type DiscoverSortOption } from "@/lib/discover";
import DiscoverFilterBar from "@/components/discover/DiscoverFilterBar";
import DiscoverSkeletonGrid from "@/components/discover/DiscoverSkeletonGrid";
import DiscoverResults, {
  type ParsedDiscoverParams,
} from "@/components/discover/DiscoverResults";

export const metadata: Metadata = {
  title: "Discover Stories | StoriList",
  description:
    "Explore live titles across cinema, television, and upcoming formats on StoriList.",
};

const VALID_CATEGORIES = [
  "all",
  "movies",
  "series",
  "anime",
  "comics",
  "novels",
] as const;

const VALID_SORTS = [
  "popular",
  "rating",
  "year-desc",
  "year-asc",
] as const;

const discoverQuerySchema = z.object({
  q: z
    .unknown()
    .optional()
    .transform((val) => {
      if (typeof val !== "string") return undefined;
      const trimmed = val.trim();
      return trimmed.length >= 2 && trimmed.length <= 100 ? trimmed : undefined;
    }),
  category: z
    .unknown()
    .optional()
    .transform((val) => {
      if (typeof val !== "string") return "all";
      const lower = val.toLowerCase();
      return (VALID_CATEGORIES as readonly string[]).includes(lower)
        ? (lower as ParsedDiscoverParams["category"])
        : "all";
    }),
  genre: z
    .unknown()
    .optional()
    .transform((val) => {
      if (typeof val !== "string") return undefined;
      const match = DISCOVER_GENRES.find(
        (g) => g.toLowerCase() === val.toLowerCase()
      );
      return match && match !== "All Genres" ? match : undefined;
    }),
  sort: z
    .unknown()
    .optional()
    .transform((val) => {
      if (typeof val !== "string") return "popular";
      return (VALID_SORTS as readonly string[]).includes(val)
        ? (val as DiscoverSortOption)
        : "popular";
    }),
  page: z
    .unknown()
    .optional()
    .transform((val) => {
      if (typeof val !== "string") return 1;
      const parsed = parseInt(val, 10);
      return !Number.isNaN(parsed) && parsed >= 1 && parsed <= 500 ? parsed : 1;
    }),
});

interface DiscoverPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const resolvedParams = await searchParams;

  // Flatten single-element arrays if present in query params
  const normalizedParams: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(resolvedParams)) {
    normalizedParams[key] = Array.isArray(value) ? value[0] : value;
  }

  const parsed: ParsedDiscoverParams = discoverQuerySchema.parse(normalizedParams);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userLibraryItems = user ? await getUserLibraryItems(user.id) : [];

  const paramsKey = `${parsed.q ?? ""}-${parsed.category}-${parsed.genre ?? ""}-${parsed.sort}-${parsed.page}`;

  return (
    <div className="py-8 sm:py-12">
      <LibrarySync items={userLibraryItems} />
      <Container>
        {/* Page Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Discover Stories
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            Explore live highlights across cinema and television, with anime, comics, and novels on the horizon.
          </p>
        </div>

        {/* Filter & Search Bar (interactive while results load) */}
        <DiscoverFilterBar
          initialQuery={parsed.q}
          initialCategory={parsed.category}
          initialGenre={parsed.genre || "All Genres"}
          initialSort={parsed.sort}
        />

        {/* Results with Suspense keyed to search params */}
        <Suspense key={paramsKey} fallback={<DiscoverSkeletonGrid />}>
          <DiscoverResults params={parsed} />
        </Suspense>
      </Container>
    </div>
  );
}
