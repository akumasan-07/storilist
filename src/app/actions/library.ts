"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { libraryEntryInputSchema, type LibraryEntryInput } from "@/lib/validation/library";
import { getMediaById } from "@/lib/db/media";
import { upsertLibraryEntry, deleteLibraryEntry } from "@/lib/db/library";
import { normalizeEntry } from "@/lib/library";
import { LibraryEntry } from "@/types/library";

export interface LibraryActionResult<T = undefined> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function saveLibraryEntryAction(
  input: LibraryEntryInput
): Promise<LibraryActionResult<LibraryEntry>> {
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

  const media = await getMediaById(parsed.data.mediaId);
  if (!media) {
    return {
      success: false,
      error: "Media item does not exist in the catalogue.",
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
    mediaId: parsed.data.mediaId,
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
    revalidatePath(`/title/${normalized.mediaId}`);
    revalidatePath("/discover");

    return {
      success: true,
      data: entry,
    };
  } catch (error) {
    console.error("saveLibraryEntryAction error:", error);
    return {
      success: false,
      error: "Unable to save your library entry. Please try again.",
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
    revalidatePath(`/title/${trimmed}`);
    revalidatePath("/discover");

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
