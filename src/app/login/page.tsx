import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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
        <div className="w-full max-w-md mx-auto">
          <div className="mb-6 flex justify-center">
            <Link
              href="/"
              aria-label="Return to StoriList home"
              className="transition-transform hover:scale-105"
            >
              <Image
                src="/lettermark.png"
                alt="StoriList"
                width={48}
                height={48}
                className="h-12 w-12 rounded-2xl object-contain shadow-xs"
                priority
              />
            </Link>
          </div>
          <LoginForm next={safeNext} resetSuccess={resetSuccess} />
        </div>
      </Container>
    </div>
  );
}
