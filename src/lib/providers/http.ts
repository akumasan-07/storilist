/**
 * Shared Provider HTTP Helper
 *
 * Server-only module providing resilient HTTP fetching with retries, backoff,
 * timeout controls, and structured error classification for catalogue providers.
 */

if (typeof window !== "undefined") {
  throw new Error("http.ts may only be executed on the server.");
}

export class ProviderNotFoundError extends Error {
  constructor(message: string = "Resource not found") {
    super(message);
    this.name = "ProviderNotFoundError";
  }
}

export class ProviderUnavailableError extends Error {
  constructor(
    message: string = "Provider service is currently unavailable",
    public readonly providerName?: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "ProviderUnavailableError";
  }
}

export class TmdbNotFoundError extends ProviderNotFoundError {
  constructor(message: string = "Title not found") {
    super(message);
    this.name = "TmdbNotFoundError";
  }
}

export class TmdbUnavailableError extends ProviderUnavailableError {
  constructor(message: string = "TMDB is currently unavailable", cause?: unknown) {
    super(message, "TMDB", cause);
    this.name = "TmdbUnavailableError";
  }
}

export class MalNotFoundError extends ProviderNotFoundError {
  constructor(message: string = "Title not found") {
    super(message);
    this.name = "MalNotFoundError";
  }
}

export class MalUnavailableError extends ProviderUnavailableError {
  constructor(message: string = "MyAnimeList is currently unavailable", cause?: unknown) {
    super(message, "MyAnimeList", cause);
    this.name = "MalUnavailableError";
  }
}

const MAX_RETRIES = 2; // Up to 2 retries (total 3 attempts)
const DEFAULT_BACKOFFS = [300, 800]; // ms backoff for retry 1 and retry 2
const PER_ATTEMPT_TIMEOUT_MS = 8000; // ~8s per-attempt timeout

function extractErrorCode(error: unknown): string {
  if (error && typeof error === "object") {
    const err = error as {
      name?: string;
      code?: string;
      cause?: { code?: string; name?: string };
    };
    return (
      err.cause?.code ||
      err.code ||
      err.cause?.name ||
      err.name ||
      "UnknownError"
    );
  }
  return "UnknownError";
}

function parseRetryAfter(headerValue: string | null): number | null {
  if (!headerValue) return null;
  const parsedSeconds = parseFloat(headerValue);
  if (!Number.isNaN(parsedSeconds) && parsedSeconds > 0) {
    return Math.min(parsedSeconds * 1000, 2000); // honor Retry-After capped at ~2s
  }
  return null;
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export interface ProviderFetchOptions {
  providerName: string;
  url: string;
  headers?: Record<string, string>;
  revalidateSeconds?: number;
  createUnavailableError?: (message: string, cause?: unknown) => Error;
}

/**
 * Resilient JSON fetcher for catalogue providers.
 * Returns T on 200 OK, null on 404 Not Found, or throws an unavailable error on failure.
 */
export async function providerFetch<T>(
  options: ProviderFetchOptions
): Promise<T | null> {
  const {
    providerName,
    url,
    headers = {},
    revalidateSeconds = 86400,
    createUnavailableError,
  } = options;

  const makeUnavailable = (msg: string, cause?: unknown) =>
    createUnavailableError
      ? createUnavailableError(msg, cause)
      : new ProviderUnavailableError(msg, providerName, cause);

  let endpointPath = url;
  try {
    const parsedUrl = new URL(url);
    endpointPath = parsedUrl.pathname;
  } catch {
    endpointPath = url.split("?")[0];
  }

  let lastError: unknown = null;

  for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
    const attemptStart = performance.now();
    try {
      const res = await fetch(url, {
        headers,
        next: { revalidate: revalidateSeconds },
        signal: AbortSignal.timeout(PER_ATTEMPT_TIMEOUT_MS),
      });

      const elapsedMs = Math.round(performance.now() - attemptStart);

      if (res.status === 404) {
        return null;
      }

      if (res.ok) {
        return (await res.json()) as T;
      }

      // Non-ok response logging (path only, never headers or token)
      console.warn(
        `[${providerName}] ${endpointPath} failed (status: ${res.status}, attempt: ${attempt}, elapsed: ${elapsedMs}ms)`
      );

      const isRetryable =
        res.status === 429 || (res.status >= 500 && res.status <= 599);
      if (!isRetryable) {
        throw makeUnavailable(`${providerName} returned HTTP ${res.status}`);
      }

      if (attempt <= MAX_RETRIES) {
        const retryAfterMs = parseRetryAfter(res.headers.get("retry-after"));
        const delay = retryAfterMs ?? DEFAULT_BACKOFFS[attempt - 1] ?? 800;
        await sleep(delay);
        continue;
      }

      throw makeUnavailable(
        `${providerName} returned HTTP ${res.status} after ${attempt} attempts`
      );
    } catch (error) {
      if (
        error instanceof ProviderUnavailableError ||
        (createUnavailableError && error instanceof Error && error.name.includes("Unavailable"))
      ) {
        throw error;
      }

      const elapsedMs = Math.round(performance.now() - attemptStart);
      const errorCode = extractErrorCode(error);
      console.warn(
        `[${providerName}] ${endpointPath} failed (error: ${errorCode}, attempt: ${attempt}, elapsed: ${elapsedMs}ms)`
      );

      lastError = error;

      if (attempt <= MAX_RETRIES) {
        const delay = DEFAULT_BACKOFFS[attempt - 1] ?? 800;
        await sleep(delay);
        continue;
      }
    }
  }

  throw makeUnavailable(
    `${providerName} request failed for ${endpointPath} after ${MAX_RETRIES + 1} attempts`,
    lastError
  );
}

