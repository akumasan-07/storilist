import { headers } from "next/headers";

/**
 * Validates and normalizes the site origin from NEXT_PUBLIC_SITE_URL.
 * Ensures it is a proper http(s) URL and strips any trailing slashes.
 */
function getEnvOrigin(): string | null {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!envUrl) {
    return null;
  }

  try {
    const parsed = new URL(envUrl);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return envUrl.replace(/\/+$/, "");
    }
  } catch {
    // Invalid URL format, fall back
  }

  return null;
}

/**
 * Derives the canonical site origin for auth callbacks and redirects.
 * Prioritizes NEXT_PUBLIC_SITE_URL whenever it is set, falling back to
 * request headers (x-forwarded-proto + x-forwarded-host / host), then http://localhost:3000.
 */
export async function getSiteOrigin(): Promise<string> {
  const envOrigin = getEnvOrigin();
  if (envOrigin) {
    return envOrigin;
  }

  try {
    const headerList = await headers();
    const forwardedHost = headerList.get("x-forwarded-host");
    const host = forwardedHost || headerList.get("host");
    const forwardedProto = headerList.get("x-forwarded-proto");
    const proto =
      forwardedProto ||
      (process.env.NODE_ENV === "production" ? "https" : "http");

    if (host) {
      return `${proto}://${host}`;
    }
  } catch {
    // In case called outside a dynamic request context
  }

  return "http://localhost:3000";
}

/**
 * Extracts the site origin synchronously from a standard Request object (e.g. in Route Handlers).
 * Prioritizes NEXT_PUBLIC_SITE_URL whenever set, falling back to request headers,
 * then the request URL origin or http://localhost:3000.
 */
export function getSiteOriginFromRequest(request: Request): string {
  const envOrigin = getEnvOrigin();
  if (envOrigin) {
    return envOrigin;
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost || request.headers.get("host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const proto =
    forwardedProto ||
    (process.env.NODE_ENV === "production" ? "https" : "http");

  if (host) {
    return `${proto}://${host}`;
  }

  try {
    return new URL(request.url).origin;
  } catch {
    return "http://localhost:3000";
  }
}
