import { describe, it, expect } from "vitest";
import {
  buildPostWinFeedback,
  FEEDBACK_URL,
  POST_WIN_SOURCE,
} from "../../src/onboarding/feedbackPayload";

// Contract: POST https://www.saypi.ai/api/feedback (saypi-saas#202/#214)
describe("buildPostWinFeedback (#437)", () => {
  it("always tags the source and posts to the agreed endpoint", () => {
    expect(FEEDBACK_URL).toBe("https://www.saypi.ai/api/feedback");
    expect(buildPostWinFeedback({}).source).toBe(POST_WIN_SOURCE);
  });

  it("clamps + rounds rating into the 0-10 range and omits a non-numeric rating", () => {
    expect(buildPostWinFeedback({ rating: 4 }).rating).toBe(4);
    expect(buildPostWinFeedback({ rating: 11 }).rating).toBe(10);
    expect(buildPostWinFeedback({ rating: -2 }).rating).toBe(0);
    expect(buildPostWinFeedback({ rating: 3.6 }).rating).toBe(4);
    expect(buildPostWinFeedback({}).rating).toBeUndefined();
    expect(buildPostWinFeedback({ rating: NaN }).rating).toBeUndefined();
  });

  it("trims + caps a message and omits an empty one", () => {
    expect(buildPostWinFeedback({ message: "  hi  " }).message).toBe("hi");
    expect(buildPostWinFeedback({ message: "   " }).message).toBeUndefined();
    expect(buildPostWinFeedback({ message: "x".repeat(5000) }).message!.length).toBe(4000);
  });

  it("lowercases app and forwards optional ids, omitting empties", () => {
    const body = buildPostWinFeedback({ app: "Pi", version: "1.2.3", clientId: "abc" });
    expect(body.app).toBe("pi");
    expect(body.version).toBe("1.2.3");
    expect(body.clientId).toBe("abc");
    expect(buildPostWinFeedback({}).app).toBeUndefined();
  });

  it("does NOT include teamId (derived server-side from the token)", () => {
    const body = buildPostWinFeedback({ app: "claude" }) as unknown as Record<string, unknown>;
    expect("teamId" in body).toBe(false);
  });
});
