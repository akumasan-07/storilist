import type { Metadata } from "next";
import Container from "@/components/Container";
import SignupForm from "@/components/auth/SignupForm";
import { sanitizeRedirectPath } from "@/lib/supabase/redirect";

export const metadata: Metadata = {
  title: "Sign Up — StoriList",
  description: "Create a StoriList account to start tracking anime, comics, movies, series, and novels.",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const safeNext = sanitizeRedirectPath(next);

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
      <Container>
        <SignupForm next={safeNext} />
      </Container>
    </div>
  );
}
