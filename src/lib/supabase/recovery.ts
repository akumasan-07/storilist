/**
 * Configuration and constants for the short-lived password recovery marker cookie.
 * Restricts access to /reset-password strictly to sessions initiated via
 * a verified recovery email link.
 */

export const RECOVERY_COOKIE_NAME = "pw_recovery";

export const RECOVERY_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
  maxAge: 10 * 60, // ~10 minutes
};
