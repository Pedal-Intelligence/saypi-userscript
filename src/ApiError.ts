/**
 * Structured errors from the Say, Pi API.
 *
 * The API answers a failed request with a JSON body describing what happened:
 *
 *   { "detail": { "error": "rate_limited",
 *                 "message": "Too many transcription requests; retry after 30 seconds.",
 *                 "retry_after_seconds": 30 } }
 *
 * Until now the client discarded all of it — every non-2xx became
 * `throw new Error("HTTP 429: Too Many Requests")`, so the server's own
 * explanation never reached the user and `Retry-After` was never honoured. A
 * user whose request was refused saw dictation stop working with no reason
 * given, and the client retried immediately, which is the worst possible
 * response to being told to slow down.
 *
 * `ApiError` keeps that detail so callers can react to *why* a request failed
 * rather than only that it did.
 */

/** Machine-readable error codes the API is known to send. */
export type ApiErrorCode =
  | "forbidden"
  | "rate_limited"
  | "payload_too_large"
  | "transcription_timeout"
  | "unknown";

export class ApiError extends Error {
  public readonly status: number;
  public readonly code: ApiErrorCode;
  /** Human-readable text from the server, safe to show to the user. */
  public readonly detail: string | null;
  /** Seconds to wait before retrying, from the body or the Retry-After header. */
  public readonly retryAfterSeconds: number | null;

  constructor(
    status: number,
    statusText: string,
    code: ApiErrorCode = "unknown",
    detail: string | null = null,
    retryAfterSeconds: number | null = null,
  ) {
    super(detail ? `HTTP ${status}: ${detail}` : `HTTP ${status}: ${statusText}`);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.detail = detail;
    this.retryAfterSeconds = retryAfterSeconds;
  }

  /** Whether retrying this exact request could plausibly succeed later. */
  public get isRetryable(): boolean {
    return this.status === 429 || this.status >= 500;
  }

  /**
   * Whether signing in is the remedy.
   *
   * Free usage is available without an account, so a limit reached while
   * anonymous is resolved by signing in rather than by waiting.
   */
  public get isResolvedBySigningIn(): boolean {
    return this.status === 429 || this.status === 403;
  }
}

const KNOWN_CODES: ReadonlySet<string> = new Set([
  "forbidden",
  "rate_limited",
  "payload_too_large",
  "transcription_timeout",
]);

function parseRetryAfterHeader(value: string | null): number | null {
  if (!value) return null;
  // RFC 9110 allows either delta-seconds or an HTTP-date.
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return Math.ceil(seconds);
  const date = Date.parse(value);
  if (Number.isNaN(date)) return null;
  return Math.max(0, Math.ceil((date - Date.now()) / 1000));
}

/**
 * Build an {@link ApiError} from a failed response, reading the body when it
 * has one.
 *
 * Never throws and never rejects: a malformed or absent body degrades to the
 * status line, which is exactly what the caller used to get. Consuming the body
 * is safe here because the caller has already established `!response.ok` and
 * will not read it again.
 */
export async function apiErrorFromResponse(response: Response): Promise<ApiError> {
  let retryAfterHeader: number | null = null;
  try {
    retryAfterHeader = parseRetryAfterHeader(
      response.headers?.get?.("Retry-After") ?? null,
    );
  } catch {
    // A header accessor that throws must not cost us the whole error object.
  }

  let code: ApiErrorCode = "unknown";
  let detail: string | null = null;
  let retryAfterBody: number | null = null;

  try {
    const body = await response.json();
    // FastAPI nests our payload under `detail`; a plain string detail is what
    // its own default handlers produce, so both shapes are accepted.
    const payload = body?.detail ?? body;
    if (typeof payload === "string") {
      detail = payload;
    } else if (payload && typeof payload === "object") {
      if (typeof payload.error === "string" && KNOWN_CODES.has(payload.error)) {
        code = payload.error as ApiErrorCode;
      }
      if (typeof payload.message === "string") {
        detail = payload.message;
      }
      if (typeof payload.retry_after_seconds === "number") {
        retryAfterBody = payload.retry_after_seconds;
      }
    }
  } catch {
    // No body, not JSON, or already consumed — the status line still stands.
  }

  return new ApiError(
    response.status,
    response.statusText,
    code,
    detail,
    retryAfterBody ?? retryAfterHeader,
  );
}
