"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  libraryEntryInputSchema,
  mediaIdSchema,
  type LibraryEntryInput,
} from "@/lib/validation/library";
import { getMediaById, upsertMediaFromProvider } from "@/lib/db/media";
import { upsertLibraryEntry, deleteLibraryEntry } from "@/lib/db/library";
import { normalizeEntry } from "@/lib/library";
import {
  parseMediaId,
  fetchMediaFromProvider,
  TmdbUnavailableError,
} from "@/lib/providers";
import { LibraryItem } from "@/types/library";
import { MediaItem } from "@/types/media";

export interface LibraryActionResult<T = undefined> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Ensures media exists in the database catalogue.
 * If not present in DB and ID matches a valid provider, fetches details
 * and inserts via the privileged admin client.
 */
async function ensureMediaInCatalogue(mediaId: string): Promise<MediaItem | null> {
  const existing = await getMediaById(mediaId);
  if (existing) {
    return existing;
  }

  const parsed = parseMediaId(mediaId);
  if (!parsed) {
    return null;
  }

  const providerMedia = await fetchMediaFromProvider(mediaId);
  if (!providerMedia) {
    return null;
  }

  return upsertMediaFromProvider(providerMedia);
}

export async function saveLibraryEntryAction(
  input: LibraryEntryInput
): Promise<LibraryActionResult<LibraryItem>> {
  const parsed = libraryEntryInputSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
    return {
      success: false,
      error: firstError || "Invalid input data",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "You must be signed in to update your library.",
    };
  }

  let media: MediaItem | null = null;
  try {
    media = await ensureMediaInCatalogue(parsed.data.mediaId);
  } catch (err) {
    if (err instanceof TmdbUnavailableError) {
      return {
        success: false,
        error: "Couldn't reach TMDB right now. Please try again.",
      };
    }
    throw err;
  }

  if (!media) {
    return {
      success: false,
      error: "This title could not be found.",
    };
  }

  if (
    media.totalProgress !== null &&
    parsed.data.currentProgress > media.totalProgress
  ) {
    return {
      success: false,
      error: `Progress cannot exceed ${media.totalProgress} ${media.progressUnit}.`,
    };
  }

  // Apply existing normalizeEntry rules on the server
  const normalized = normalizeEntry({
    mediaId: media.id,
    status: parsed.data.status,
    currentProgress: parsed.data.currentProgress,
    userRating: parsed.data.userRating ?? null,
    notes: parsed.data.notes ?? undefined,
    addedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  });

  try {
    const entry = await upsertLibraryEntry(user.id, {
      mediaId: normalized.mediaId,
      status: normalized.status,
      currentProgress: normalized.currentProgress,
      userRating: normalized.userRating,
      notes: normalized.notes,
    });

    revalidatePath("/library");

    return {
      success: true,
      data: {
        ...entry,
        media,
      },
    };
  } catch (error) {
    console.error("saveLibraryEntryAction error:", error);
    return {
      success: false,
      error: "Unable to save your library entry. Please try again.",
    };
  }
}

export async function quickTrackAction(
  mediaId: string
): Promise<LibraryActionResult<LibraryItem>> {
  const parsed = mediaIdSchema.safeParse(mediaId);
  if (!parsed.success) {
    return {
      success: false,
      error: "A valid media ID is required.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "You must be signed in to update your library.",
    };
  }

  let media: MediaItem | null = null;
  try {
    media = await ensureMediaInCatalogue(parsed.data);
  } catch (err) {
    if (err instanceof TmdbUnavailableError) {
      return {
        success: false,
        error: "Couldn't reach TMDB right now. Please try again.",
      };
    }
    throw err;
  }

  if (!media) {
    return {
      success: false,
      error: "This title could not be found.",
    };
  }

  const normalized = normalizeEntry({
    mediaId: media.id,
    status: "Planned",
    currentProgress: 0,
    userRating: null,
    notes: undefined,
    addedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  });

  try {
    const entry = await upsertLibraryEntry(user.id, {
      mediaId: normalized.mediaId,
      status: normalized.status,
      currentProgress: normalized.currentProgress,
      userRating: normalized.userRating,
      notes: normalized.notes,
    });

    revalidatePath("/library");

    return {
      success: true,
      data: {
        ...entry,
        media,
      },
    };
  } catch (error) {
    console.error("quickTrackAction error:", error);
    return {
      success: false,
      error: "Unable to track this title. Please try again.",
    };
  }
}

export async function removeLibraryEntryAction(
  mediaId: string
): Promise<LibraryActionResult> {
  const trimmed = typeof mediaId === "string" ? mediaId.trim() : "";
  if (!trimmed) {
    return {
      success: false,
      error: "Media ID is required.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "You must be signed in to update your library.",
    };
  }

  try {
    await deleteLibraryEntry(user.id, trimmed);

    revalidatePath("/library");

    return {
      success: true,
    };
  } catch (error) {
    console.error("removeLibraryEntryAction error:", error);
    return {
      success: false,
      error: "Unable to remove your library entry. Please try again.",
    };
  }
}
