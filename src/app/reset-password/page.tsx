import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { AlertCircle } from "lucide-react";
import Container from "@/components/Container";
import { createClient } from "@/lib/supabase/server";
import { RECOVERY_COOKIE_NAME } from "@/lib/supabase/recovery";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | StoriList",
  description: "Set a new password for your StoriList account.",
};

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const [{ data: { user } }, cookieStore] = await Promise.all([
    supabase.auth.getUser(),
    cookies(),
  ]);

  const hasRecoveryMarker = Boolean(cookieStore.get(RECOVERY_COOKIE_NAME)?.value);
  const isValidRecovery = Boolean(user && hasRecoveryMarker);

  return (
    <div className="py-12 sm:py-16">
      <Container>
        {!isValidRecovery ? (
          <div className="w-full max-w-md mx-auto">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-6 w-6" aria-hidden="true" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Reset link expired
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                This reset link is invalid or has expired.
              </p>
              <div className="mt-6">
                <Link
                  href="/forgot-password"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors min-h-[44px]"
                >
                  Request a new link
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <ResetPasswordForm />
        )}
      </Container>
    </div>
  );
}
