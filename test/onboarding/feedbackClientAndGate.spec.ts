import { describe, it, expect, vi } from "vitest";
import { submitPostWinFeedback, parseRetryAfter } from "../../src/onboarding/feedbackClient";
import { decideSurvey, SURVEY_MIN_INTERACTIONS } from "../../src/onboarding/postWinSurvey";
import { FEEDBACK_URL } from "../../src/onboarding/feedbackPayload";

function res(status: number, headers: Record<string, string> = {}): Response {
  return new Response(status === 204 ? null : JSON.stringify({ success: status < 400 }), {
    status,
    headers,
  });
}

describe("submitPostWinFeedback (#437)", () => {
  it("POSTs the built body to the feedback endpoint and reports success", async () => {
    const callApi = vi.fn().mockResolvedValue(res(200));
    const r = await submitPostWinFeedback({ rating: 5, app: "pi" }, { callApi });

    expect(r.ok).toBe(true);
    const [url, opts] = callApi.mock.calls[0];
    expect(url).toBe(FEEDBACK_URL);
    expect(opts.method).toBe("POST");
    const sent = JSON.parse(opts.body);
    expect(sent.source).toBe("extension_post_win");
    expect(sent.rating).toBe(5);
    expect("teamId" in sent).toBe(false);
  });

  it("surfaces a 429 with the parsed Retry-After", async () => {
    const callApi = vi.fn().mockResolvedValue(res(429, { "Retry-After": "30" }));
    const r = await submitPostWinFeedback({ rating: 4 }, { callApi });
    expect(r.ok).toBe(false);
    expect(r.status).toBe(429);
    expect(r.retryAfterMs).toBe(30000);
  });

  it("swallows network errors (never throws, never disrupts the call)", async () => {
    const callApi = vi.fn().mockRejectedValue(new Error("offline"));
    await expect(submitPostWinFeedback({ rating: 1 }, { callApi })).resolves.toEqual({ ok: false });
  });

  it("reports a non-ok status without throwing", async () => {
    const callApi = vi.fn().mockResolvedValue(res(401));
    const r = await submitPostWinFeedback({ rating: 2 }, { callApi });
    expect(r.ok).toBe(false);
    expect(r.status).toBe(401);
  });
});

describe("parseRetryAfter (#437)", () => {
  it("converts delta-seconds to ms; null/garbage -> undefined", () => {
    expect(parseRetryAfter("15")).toBe(15000);
    expect(parseRetryAfter(null)).toBeUndefined();
    expect(parseRetryAfter("soon")).toBeUndefined();
  });
});

describe("decideSurvey (#437)", () => {
  it("shows once, only when authenticated and engaged", () => {
    expect(decideSurvey({ surveyShown: false, authenticated: true, interactionCount: SURVEY_MIN_INTERACTIONS })).toBe(true);
  });
  it("does not show before the interaction threshold", () => {
    expect(decideSurvey({ surveyShown: false, authenticated: true, interactionCount: SURVEY_MIN_INTERACTIONS - 1 })).toBe(false);
  });
  it("does not show when unauthenticated (sink needs the JWT identity)", () => {
    expect(decideSurvey({ surveyShown: false, authenticated: false, interactionCount: 10 })).toBe(false);
  });
  it("does not show again once shown", () => {
    expect(decideSurvey({ surveyShown: true, authenticated: true, interactionCount: 10 })).toBe(false);
  });
});
