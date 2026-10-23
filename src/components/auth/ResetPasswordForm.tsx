"use client";

import { useActionState } from "react";
import { resetPassword, type AuthActionState } from "@/app/actions/auth";
import { AlertCircle, Loader2 } from "lucide-react";
import PasswordInput from "./PasswordInput";

const initialState: AuthActionState = {};

export default function ResetPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    resetPassword,
    initialState
  );

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Set new password
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your new password below to regain access to your account.
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
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
            >
              New password
            </label>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              required
              placeholder="At least 8 characters"
              aria-describedby={state.errors?.password ? "password-error" : undefined}
              aria-invalid={Boolean(state.errors?.password)}
            />
            {state.errors?.password ? (
              <p id="password-error" className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                {state.errors.password[0]}
              </p>
            ) : (
              <p className="mt-1.5 text-[11px] text-subtle-foreground">
                At least 8 characters.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            <span>{isPending ? "Updating password..." : "Update password"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
