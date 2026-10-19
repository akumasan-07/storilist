"use client";

import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import { LibraryEntry, LibraryItem } from "@/types/library";
import { SAMPLE_LIBRARY_ENTRIES } from "@/data/sampleLibrary";
import { getMediaById } from "@/data/sampleMedia";
import { normalizeEntry } from "@/lib/library";

interface LibraryContextType {
  entries: LibraryEntry[];
  saveEntry: (entry: LibraryEntry) => void;
  removeEntry: (mediaId: string) => void;
  getEntry: (mediaId: string) => LibraryEntry | undefined;
  libraryItems: LibraryItem[];
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<LibraryEntry[]>(SAMPLE_LIBRARY_ENTRIES);

  const saveEntry = useCallback((entry: LibraryEntry) => {
    const normalized = normalizeEntry(entry);
    setEntries((prev) => {
      const exists = prev.some((item) => item.mediaId === normalized.mediaId);
      if (exists) {
        return prev.map((item) =>
          item.mediaId === normalized.mediaId ? normalized : item
        );
      }
      return [normalized, ...prev];
    });
  }, []);

  const removeEntry = useCallback((mediaId: string) => {
    setEntries((prev) => prev.filter((item) => item.mediaId !== mediaId));
  }, []);

  const getEntry = useCallback(
    (mediaId: string): LibraryEntry | undefined => {
      return entries.find((item) => item.mediaId === mediaId);
    },
    [entries]
  );

  const libraryItems = useMemo<LibraryItem[]>(() => {
    return entries
      .map((entry) => {
        const media = getMediaById(entry.mediaId);
        if (!media) return null;
        return {
          ...entry,
          media,
        };
      })
      .filter((item): item is LibraryItem => item !== null);
  }, [entries]);

  const value = useMemo(
    () => ({
      entries,
      saveEntry,
      removeEntry,
      getEntry,
      libraryItems,
    }),
    [entries, saveEntry, removeEntry, getEntry, libraryItems]
  );

  return (
    <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
  );
}

export function useLibrary(): LibraryContextType {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error("useLibrary must be used within a LibraryProvider");
  }
  return context;
}
