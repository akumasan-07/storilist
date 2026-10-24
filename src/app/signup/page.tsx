import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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
          <SignupForm next={safeNext} />
        </div>
      </Container>
    </div>
  );
}
