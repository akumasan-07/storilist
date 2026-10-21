/**
 * Validates and sanitizes internal redirect target paths.
 * Enforces that paths begin with a single "/" and are not protocol-relative or external schemes.
 * Defaults safely to "/library" on any invalid, relative, or external path.
 */
export function sanitizeRedirectPath(path: string | null | undefined): string {
  if (!path) return "/library";

  const trimmed = path.trim();

  // Must begin with a single '/' and not start with '//' or '/\'
  if (
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    trimmed.startsWith("/\\")
  ) {
    return "/library";
  }

  try {
    const dummyOrigin = "http://localhost";
    const parsed = new URL(trimmed, dummyOrigin);

    // Validate that the host didn't change and protocol is http
    if (parsed.origin !== dummyOrigin) {
      return "/library";
    }

    // Double-check the pathname is strictly internal
    if (!parsed.pathname.startsWith("/") || parsed.pathname.startsWith("//")) {
      return "/library";
    }

    return parsed.pathname + parsed.search;
  } catch {
    return "/library";
  }
}
