import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getUserLibraryItems } from "@/lib/db/library";
import LibraryClient from "@/components/library/LibraryClient";

export const metadata: Metadata = {
  title: "My Library | StoriList",
  description: "Track your personal library, progress, ratings, and notes.",
};

export default async function LibraryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const libraryItems = user ? await getUserLibraryItems(user.id) : [];

  return <LibraryClient initialItems={libraryItems} />;
}
