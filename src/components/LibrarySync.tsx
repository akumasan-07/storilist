"use client";

import { useEffect, useRef } from "react";
import { useLibrary } from "@/context/LibraryContext";
import { LibraryItem } from "@/types/library";

interface LibrarySyncProps {
  items: LibraryItem[];
}

export default function LibrarySync({ items }: LibrarySyncProps) {
  const { syncLibrary } = useLibrary();
  const prevItemsRef = useRef<LibraryItem[] | null>(null);

  useEffect(() => {
    if (prevItemsRef.current !== items) {
      prevItemsRef.current = items;
      syncLibrary(items);
    }
  }, [items, syncLibrary]);

  return null;
}
