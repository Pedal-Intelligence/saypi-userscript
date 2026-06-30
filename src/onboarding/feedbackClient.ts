/**
 * Submits post-win survey feedback to the saypi-saas sink (#437).
 *
 * Auth is the user's Bearer JWT, attached by `callApi` (which also handles the
 * 401-refresh-and-retry for SayPi hosts). `callApi` is injected so the
 * request/response handling is unit-testable; failures are swallowed so a
 * feedback error never disrupts the conversation.
 */
import {
  buildPostWinFeedback,
  FEEDBACK_URL,
  type PostWinFeedbackInput,
} from "./feedbackPayload";

export interface SubmitResult {
  ok: boolean;
  status?: number;
  /** Present on a 429, in ms, from the Retry-After header. */
  retryAfterMs?: number;
}

export interface FeedbackDeps {
  callApi: (url: string, options: RequestInit) => Promise<Response>;
}

/** Parses an HTTP Retry-After (delta-seconds) header into milliseconds. */
export function parseRetryAfter(value: string | null): number | undefined {
  if (!value) return undefined;
  const seconds = Number(value);
  if (isFinite(seconds) && seconds >= 0) return seconds * 1000;
  return undefined;
}

export async function submitPostWinFeedback(
  input: PostWinFeedbackInput,
  deps: FeedbackDeps
): Promise<SubmitResult> {
  const body = buildPostWinFeedback(input);
  try {
    const res = await deps.callApi(FEEDBACK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.status === 429) {
      return { ok: false, status: 429, retryAfterMs: parseRetryAfter(res.headers.get("Retry-After")) };
    }
    return { ok: res.ok, status: res.status };
  } catch (error) {
    console.debug("[PostWinSurvey] Feedback submission failed:", error);
    return { ok: false };
  }
}
