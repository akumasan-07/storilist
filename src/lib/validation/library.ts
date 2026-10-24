import { z } from "zod";

export const mediaIdSchema = z
  .string()
  .trim()
  .min(1, "Media ID is required")
  .max(100, "Media ID is too long");

export const libraryEntryInputSchema = z.object({
  mediaId: mediaIdSchema,
  status: z.enum(["Planned", "In Progress", "Completed", "Dropped"]),
  currentProgress: z
    .number()
    .int("Progress must be an integer")
    .min(0, "Progress cannot be negative"),
  userRating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(10, "Rating cannot exceed 10")
    .nullable()
    .optional(),
  notes: z
    .string()
    .max(2000, "Notes cannot exceed 2000 characters")
    .optional()
    .nullable(),
});

export type LibraryEntryInput = z.infer<typeof libraryEntryInputSchema>;
