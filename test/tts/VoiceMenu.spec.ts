import { describe, it, expect, vi, beforeEach } from "vitest";

// ConfigModule reads injected env at import time; stub it (mirrors other specs).
vi.mock("../../src/ConfigModule", () => ({
  config: {
    appServerUrl: "https://app.example.com",
    apiServerUrl: "https://api.saypi.ai",
    GA_MEASUREMENT_ID: "x",
    GA_API_SECRET: "x",
    GA_ENDPOINT: "x",
  },
}));

// Break the VoiceMenu -> Pi -> PiVoiceMenu -> VoiceMenu import cycle in the test
// env (the base class imports a concrete chatbot). We don't use PiAIChatbot here.
vi.mock("../../src/chatbots/Pi", () => ({ PiAIChatbot: class {} }));

const isAuthenticatedMock = vi.fn();
vi.mock("../../src/JwtManager", () => ({
  getJwtManagerSync: () => ({
    isAuthenticated: isAuthenticatedMock,
    getClaims: () => null,
  }),
}));

import { VoiceSelector } from "../../src/tts/VoiceMenu";

// Minimal concrete selector to exercise base-class logic.
class TestVoiceSelector extends VoiceSelector {
  getId(): string {
    return "test-voice-selector";
  }
  getButtonClasses(): string[] {
    return [];
  }
}

describe("VoiceSelector.ttsRequiresSignIn", () => {
  let selector: TestVoiceSelector;

  beforeEach(() => {
    isAuthenticatedMock.mockReset();
    const el = document.createElement("div");
    selector = new TestVoiceSelector({} as any, {} as any, el);
  });

  it("requires sign-in when signed out AND no voices are available (Say, Pi premium TTS)", () => {
    isAuthenticatedMock.mockReturnValue(false);
    expect((selector as any).ttsRequiresSignIn(true)).toBe(true);
  });

  it("does NOT require sign-in when voices are available even if signed out (e.g. Pi.ai native voices)", () => {
    isAuthenticatedMock.mockReturnValue(false);
    expect((selector as any).ttsRequiresSignIn(false)).toBe(false);
  });

  it("does NOT require sign-in when authenticated, even before voices have loaded", () => {
    isAuthenticatedMock.mockReturnValue(true);
    expect((selector as any).ttsRequiresSignIn(true)).toBe(false);
  });
});
