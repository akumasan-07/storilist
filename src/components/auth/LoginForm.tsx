"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { login, type AuthActionState } from "@/app/actions/auth";
import { AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";
import PasswordInput from "./PasswordInput";

const initialState: AuthActionState = {};

interface LoginFormProps {
  next?: string;
  resetSuccess?: boolean;
}

export default function LoginForm({
  next,
  resetSuccess = false,
}: LoginFormProps) {
  const [showResetNotice, setShowResetNotice] = useState(resetSuccess);
  const [state, formAction, isPending] = useActionState(login, initialState);

  const signupHref = next
    ? `/signup?next=${encodeURIComponent(next)}`
    : "/signup";

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Log in to StoriList
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email and password to access your personal library.
          </p>
        </div>

        {showResetNotice && (
          <div
            role="status"
            className="mb-6 flex items-start justify-between gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3.5 text-sm text-emerald-800 dark:text-emerald-300"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2
                className="h-5 w-5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400"
                aria-hidden="true"
              />
              <span>Password updated. Log in with your new password.</span>
            </div>
            <button
              type="button"
              onClick={() => setShowResetNotice(false)}
              className="shrink-0 -mr-1 -mt-1 rounded-lg p-1 text-emerald-700/70 hover:text-emerald-900 hover:bg-emerald-500/15 dark:text-emerald-400/70 dark:hover:text-emerald-200 cursor-pointer transition-colors"
              aria-label="Dismiss notice"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}

        {state.errors?.general && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/25 bg-red-500/10 p-3.5 text-sm text-red-700 dark:text-red-400"
          >
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{state.errors.general[0]}</span>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="next" value={next || "/library"} />

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              defaultValue={state.values?.email || ""}
              placeholder="you@example.com"
              aria-describedby={state.errors?.email ? "email-error" : undefined}
              aria-invalid={Boolean(state.errors?.email)}
              className="w-full rounded-xl border border-border bg-muted/40 px-3.5 py-2.5 text-sm text-foreground placeholder:text-subtle-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
            />
            {state.errors?.email && (
              <p id="email-error" className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                {state.errors.email[0]}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-primary hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              aria-describedby={state.errors?.password ? "password-error" : undefined}
              aria-invalid={Boolean(state.errors?.password)}
            />
            {state.errors?.password && (
              <p id="password-error" className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                {state.errors.password[0]}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            <span>{isPending ? "Logging in..." : "Log in"}</span>
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href={signupHref}
            className="font-semibold text-primary hover:underline transition-colors"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
