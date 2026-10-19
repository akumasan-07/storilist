"use client";

import { useState, useMemo } from "react";
import Container from "@/components/Container";
import EditLogModal from "@/components/EditLogModal";
import { useLibrary } from "@/context/LibraryContext";
import { LibraryItem, LibraryStatus, LibrarySortOption, MediaCategory } from "@/types/library";
import LibraryStats, { LibraryStatsData } from "@/components/library/LibraryStats";
import LibraryFilters from "@/components/library/LibraryFilters";
import LibraryCard from "@/components/library/LibraryCard";
import LibraryEmptyState from "@/components/library/LibraryEmptyState";

export default function LibraryPage() {
  const { libraryItems, saveEntry, removeEntry } = useLibrary();

  const [selectedStatus, setSelectedStatus] = useState<"All" | LibraryStatus>("All");
  const [selectedCategory, setSelectedCategory] = useState<"All" | MediaCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<LibrarySortOption>("recent");

  const [editingItem, setEditingItem] = useState<LibraryItem | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Overall statistics for the personal dashboard header
  const stats: LibraryStatsData = useMemo(() => {
    const total = libraryItems.length;
    const inProgress = libraryItems.filter((item) => item.status === "In Progress").length;
    const completed = libraryItems.filter((item) => item.status === "Completed").length;
    const planned = libraryItems.filter((item) => item.status === "Planned").length;
    const dropped = libraryItems.filter((item) => item.status === "Dropped").length;

    const ratedEntries = libraryItems.filter((item) => item.userRating !== null);
    const avgRating =
      ratedEntries.length > 0
        ? (
          ratedEntries.reduce((acc, curr) => acc + (curr.userRating || 0), 0) /
          ratedEntries.length
        ).toFixed(1)
        : null;

    return { total, inProgress, completed, planned, dropped, avgRating };
  }, [libraryItems]);

  // Filtered & Sorted library entries
  const filteredEntries = useMemo(() => {
    let result = libraryItems;

    // Filter by Status Tab
    if (selectedStatus !== "All") {
      result = result.filter((item) => item.status === selectedStatus);
    }

    // Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter((item) => item.media.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.media.title.toLowerCase().includes(q) ||
          item.media.studio.toLowerCase().includes(q) ||
          item.media.format.toLowerCase().includes(q) ||
          item.media.category.toLowerCase().includes(q) ||
          (item.notes && item.notes.toLowerCase().includes(q))
      );
    }

    // Sort entries:
    // - "recent" sorts by lastUpdated (newest first)
    // - "rating" sorts by user's rating only; unrated entries go last, ties broken by title
    // - "progress" sorts by percentage completed
    // - "title" sorts alphabetically A-Z
    return [...result].sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      }
      if (sortBy === "title") {
        return a.media.title.localeCompare(b.media.title);
      }
      if (sortBy === "progress") {
        const aPercent = a.media.totalProgress ? a.currentProgress / a.media.totalProgress : 0;
        const bPercent = b.media.totalProgress ? b.currentProgress / b.media.totalProgress : 0;
        if (bPercent !== aPercent) return bPercent - aPercent;
        return b.currentProgress - a.currentProgress;
      }
      if (sortBy === "rating") {
        const aRated = a.userRating !== null;
        const bRated = b.userRating !== null;
        if (aRated && !bRated) return -1;
        if (!aRated && bRated) return 1;
        if (aRated && bRated && b.userRating! !== a.userRating!) {
          return b.userRating! - a.userRating!;
        }
        return a.media.title.localeCompare(b.media.title);
      }
      return 0;
    });
  }, [libraryItems, selectedStatus, selectedCategory, searchQuery, sortBy]);

  const handleOpenLogModal = (item: LibraryItem) => {
    setEditingItem(item);
    setIsLogModalOpen(true);
  };

  const resetFilters = () => {
    setSelectedStatus("All");
    setSelectedCategory("All");
    setSearchQuery("");
    setSortBy("recent");
  };

  const isFiltered =
    selectedStatus !== "All" ||
    selectedCategory !== "All" ||
    searchQuery.trim() !== "" ||
    sortBy !== "recent";

  return (
    <div className="py-8 sm:py-12">
      <Container>
        {/* Header & Quick Stats */}
        <LibraryStats stats={stats} />

        {/* Status Tabs & Controls */}
        <LibraryFilters
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          stats={stats}
          isFiltered={isFiltered}
          onResetFilters={resetFilters}
        />

        {/* Entries Grid or Empty State */}
        {filteredEntries.length === 0 ? (
          <LibraryEmptyState isFiltered={isFiltered} onResetFilters={resetFilters} />
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-5">
            {filteredEntries.map((item) => (
              <LibraryCard
                key={item.mediaId}
                item={item}
                onOpenLogModal={handleOpenLogModal}
              />
            ))}
          </div>
        )}

        {/* Client-side Log / Edit Modal */}
        <EditLogModal
          item={editingItem}
          isOpen={isLogModalOpen}
          onClose={() => setIsLogModalOpen(false)}
          onSave={saveEntry}
          onRemove={removeEntry}
        />
      </Container>
    </div>
  );
}
