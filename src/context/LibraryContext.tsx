"use client";

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, X } from "lucide-react";
import { LibraryEntry, LibraryItem } from "@/types/library";
import { MediaItem } from "@/types/media";
import { normalizeEntry } from "@/lib/library";
import {
  saveLibraryEntryAction,
  removeLibraryEntryAction,
} from "@/app/actions/library";
import { sanitizeRedirectPath } from "@/lib/supabase/redirect";

interface LibraryContextType {
  entries: LibraryEntry[];
  libraryItems: LibraryItem[];
  saveEntry: (entry: LibraryEntry, media?: MediaItem) => Promise<boolean>;
  removeEntry: (mediaId: string) => Promise<boolean>;
  getEntry: (mediaId: string) => LibraryEntry | undefined;
  getItem: (mediaId: string) => LibraryItem | undefined;
  syncLibrary: (serverItems: LibraryItem[]) => void;
  isAuthenticated: boolean;
  error: string | null;
  clearError: () => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

interface LibraryProviderProps {
  children: React.ReactNode;
  initialItems?: LibraryItem[];
  isAuthenticated?: boolean;
}

export function LibraryProvider({
  children,
  initialItems = [],
  isAuthenticated = false,
}: LibraryProviderProps) {
  const router = useRouter();
  const [items, setItems] = useState<LibraryItem[]>(initialItems);
  const [error, setError] = useState<string | null>(null);

  const syncLibrary = useCallback((serverItems: LibraryItem[]) => {
    setItems(serverItems);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const saveEntry = useCallback(
    async (entry: LibraryEntry, media?: MediaItem): Promise<boolean> => {
      if (!isAuthenticated) {
        const currentPath =
          typeof window !== "undefined"
            ? window.location.pathname + window.location.search
            : "/library";
        const target = sanitizeRedirectPath(currentPath);
        router.push(`/login?next=${encodeURIComponent(target)}`);
        return false;
      }

      const normalized = normalizeEntry(entry);
      const existing = items.find((item) => item.mediaId === normalized.mediaId);
      const itemMedia = media || existing?.media;

      if (!itemMedia) {
        console.error("Cannot save entry: media item missing");
        return false;
      }

      const optimisticItem: LibraryItem = {
        ...normalized,
        media: itemMedia,
        addedAt: existing?.addedAt || normalized.addedAt || new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };

      const previousItems = items;

      // Optimistic update
      setItems((prev) => {
        const exists = prev.some((i) => i.mediaId === normalized.mediaId);
        if (exists) {
          return prev.map((i) =>
            i.mediaId === normalized.mediaId ? optimisticItem : i
          );
        }
        return [optimisticItem, ...prev];
      });
      setError(null);

      try {
        const result = await saveLibraryEntryAction({
          mediaId: normalized.mediaId,
          status: normalized.status,
          currentProgress: normalized.currentProgress,
          userRating: normalized.userRating,
          notes: normalized.notes,
        });

        if (!result.success) {
          // Rollback to previous state
          setItems(previousItems);
          setError(result.error || "Failed to save entry. Please try again.");
          return false;
        }

        if (result.data) {
          setItems((prev) =>
            prev.map((i) =>
              i.mediaId === result.data!.mediaId
                ? { ...i, ...result.data!, media: itemMedia }
                : i
            )
          );
        }
        return true;
      } catch {
        setItems(previousItems);
        setError("An unexpected error occurred while saving your entry.");
        return false;
      }
    },
    [isAuthenticated, items, router]
  );

  const removeEntry = useCallback(
    async (mediaId: string): Promise<boolean> => {
      if (!isAuthenticated) {
        const currentPath =
          typeof window !== "undefined"
            ? window.location.pathname + window.location.search
            : "/library";
        const target = sanitizeRedirectPath(currentPath);
        router.push(`/login?next=${encodeURIComponent(target)}`);
        return false;
      }

      const previousItems = items;

      // Optimistic removal
      setItems((prev) => prev.filter((item) => item.mediaId !== mediaId));
      setError(null);

      try {
        const result = await removeLibraryEntryAction(mediaId);

        if (!result.success) {
          // Rollback to previous state
          setItems(previousItems);
          setError(result.error || "Failed to remove entry. Please try again.");
          return false;
        }

        return true;
      } catch {
        setItems(previousItems);
        setError("An unexpected error occurred while removing your entry.");
        return false;
      }
    },
    [isAuthenticated, items, router]
  );

  const getEntry = useCallback(
    (mediaId: string): LibraryEntry | undefined => {
      const item = items.find((i) => i.mediaId === mediaId);
      if (!item) return undefined;
      return {
        mediaId: item.mediaId,
        status: item.status,
        currentProgress: item.currentProgress,
        userRating: item.userRating,
        notes: item.notes,
        addedAt: item.addedAt,
        lastUpdated: item.lastUpdated,
      };
    },
    [items]
  );

  const getItem = useCallback(
    (mediaId: string): LibraryItem | undefined => {
      return items.find((i) => i.mediaId === mediaId);
    },
    [items]
  );

  const entries = useMemo<LibraryEntry[]>(() => {
    return items.map((item) => ({
      mediaId: item.mediaId,
      status: item.status,
      currentProgress: item.currentProgress,
      userRating: item.userRating,
      notes: item.notes,
      addedAt: item.addedAt,
      lastUpdated: item.lastUpdated,
    }));
  }, [items]);

  const value = useMemo(
    () => ({
      entries,
      libraryItems: items,
      saveEntry,
      removeEntry,
      getEntry,
      getItem,
      syncLibrary,
      isAuthenticated,
      error,
      clearError,
    }),
    [
      entries,
      items,
      saveEntry,
      removeEntry,
      getEntry,
      getItem,
      syncLibrary,
      isAuthenticated,
      error,
      clearError,
    ]
  );

  return (
    <LibraryContext.Provider value={value}>
      {children}
      {error && (
        <div
          role="alert"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-card p-4 shadow-xl text-sm text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-bottom-2 max-w-sm sm:max-w-md"
        >
          <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span className="flex-1 font-medium">{error}</span>
          <button
            type="button"
            onClick={clearError}
            className="p-1 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </LibraryContext.Provider>
  );
}

export function useLibrary(): LibraryContextType {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error("useLibrary must be used within a LibraryProvider");
  }
  return context;
}
