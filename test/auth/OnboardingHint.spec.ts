/**
 * Tests for OnboardingHint - best-effort post-connect voiceGoal/locale hint
 * so the SaaS can populate User.voiceGoal / signupLocale for extension-first
 * users who never complete the web onboarding wizard (#490 / saypi-saas#225).
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("../../src/ConfigModule", () => ({
  config: {
    authServerUrl: "https://api.saypi.ai",
  },
}));

vi.mock("../../src/LoggingModule", () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

import { voiceGoalFromUrl, sendOnboardingHint } from "../../src/auth/OnboardingHint";

describe("voiceGoalFromUrl", () => {
  it("maps each supported chat host to its voiceGoal", () => {
    expect(voiceGoalFromUrl("https://claude.ai/chat/abc")).toBe("claude");
    expect(voiceGoalFromUrl("https://pi.ai/talk")).toBe("pi");
    expect(voiceGoalFromUrl("https://chatgpt.com/")).toBe("chatgpt");
  });

  it("maps any other http(s) site to dictation (universal dictation use-case)", () => {
    expect(voiceGoalFromUrl("https://example.com/notes")).toBe("dictation");
    expect(voiceGoalFromUrl("http://localhost:3000/app")).toBe("dictation");
  });

  it("returns undefined for non-http(s) initiators (extension pages, etc.)", () => {
    expect(voiceGoalFromUrl("chrome-extension://abcdef/settings.html")).toBeUndefined();
    expect(voiceGoalFromUrl("moz-extension://abcdef/settings.html")).toBeUndefined();
    expect(voiceGoalFromUrl("about:blank")).toBeUndefined();
  });

  it("returns undefined for missing or malformed URLs", () => {
    expect(voiceGoalFromUrl(undefined)).toBeUndefined();
    expect(voiceGoalFromUrl("")).toBeUndefined();
    expect(voiceGoalFromUrl("not a url")).toBeUndefined();
  });
});

describe("sendOnboardingHint", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("POSTs the hint to /api/onboarding/hint with a Bearer token and JSON body", async () => {
    await sendOnboardingHint("access-token-123", {
      voiceGoal: "claude",
      locale: "en-US",
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.saypi.ai/api/onboarding/hint");
    expect(init.method).toBe("POST");
    expect(init.headers.Authorization).toBe("Bearer access-token-123");
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(JSON.parse(init.body)).toEqual({ voiceGoal: "claude", locale: "en-US" });
  });

  it("omits absent fields from the body but still sends a present one", async () => {
    await sendOnboardingHint("tok", { locale: "de-DE" });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, init] = fetchMock.mock.calls[0];
    expect(JSON.parse(init.body)).toEqual({ locale: "de-DE" });
  });

  it("does not call fetch when there is nothing worth sending", async () => {
    await sendOnboardingHint("tok", {});
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not call fetch without an access token", async () => {
    await sendOnboardingHint("", { voiceGoal: "pi" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("never throws when the network request rejects (best-effort)", async () => {
    fetchMock.mockRejectedValue(new Error("network down"));
    await expect(
      sendOnboardingHint("tok", { voiceGoal: "pi" }),
    ).resolves.toBeUndefined();
  });

  it("never throws when the server responds non-OK (best-effort)", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500 });
    await expect(
      sendOnboardingHint("tok", { voiceGoal: "chatgpt" }),
    ).resolves.toBeUndefined();
  });
});
