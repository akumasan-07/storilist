import type { Metadata } from "next";
import Container from "@/components/Container";
import LoginForm from "@/components/auth/LoginForm";
import { sanitizeRedirectPath } from "@/lib/supabase/redirect";

export const metadata: Metadata = {
  title: "Log In — StoriList",
  description: "Log in to your StoriList account to track your media library.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; reset?: string }>;
}) {
  const { next, reset } = await searchParams;
  const safeNext = sanitizeRedirectPath(next);
  const resetSuccess = reset === "success";

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
      <Container>
        <LoginForm next={safeNext} resetSuccess={resetSuccess} />
      </Container>
    </div>
  );
}
