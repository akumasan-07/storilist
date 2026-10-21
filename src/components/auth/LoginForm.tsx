"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type AuthActionState } from "@/app/actions/auth";
import { AlertCircle, Loader2 } from "lucide-react";

const initialState: AuthActionState = {};

interface LoginFormProps {
  next?: string;
}

export default function LoginForm({ next }: LoginFormProps) {
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
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              aria-describedby={state.errors?.password ? "password-error" : undefined}
              aria-invalid={Boolean(state.errors?.password)}
              className="w-full rounded-xl border border-border bg-muted/40 px-3.5 py-2.5 text-sm text-foreground placeholder:text-subtle-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
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
