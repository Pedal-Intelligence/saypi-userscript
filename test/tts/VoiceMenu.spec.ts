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

const isAuthenticatedMock = vi.fn();
vi.mock("../../src/JwtManager", () => ({
  getJwtManagerSync: () => ({
    isAuthenticated: isAuthenticatedMock,
    getClaims: () => null,
  }),
}));

import { VoiceSelector } from "../../src/tts/VoiceMenu";
import { ClaudeVoiceMenu } from "../../src/chatbots/ClaudeVoiceMenu";

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

describe("VoiceSelector built-in-voice-provider capability detection", () => {
  // The base class adds a chatbot's own built-in voices (e.g. Pi.ai's native
  // voices + introduction audio) when the chatbot can provide them. This used
  // to be gated on `instanceof PiAIChatbot`, which forced VoiceMenu to import
  // the concrete Pi chatbot and created a VoiceMenu -> Pi -> PiVoiceMenu ->
  // VoiceMenu import cycle. The gate is now a structural capability check, so
  // any chatbot exposing getExtraVoices()/getVoiceIntroductionUrl() qualifies.
  function makeSelector(chatbot: unknown): TestVoiceSelector {
    return new TestVoiceSelector(
      chatbot as any,
      {} as any,
      document.createElement("div"),
    );
  }

  it("requests extra voices from a chatbot that provides its own built-in voices", () => {
    const getExtraVoices = vi.fn(() => []);
    const chatbot = {
      getExtraVoices,
      getVoiceIntroductionUrl: vi.fn(() => ""),
    };
    const selector = makeSelector(chatbot);
    // An empty menu has 0 built-in voices, i.e. below the 8-voice threshold.
    selector.addMissingPiVoices(document.createElement("div"));
    expect(getExtraVoices).toHaveBeenCalled();
  });

  it("does nothing for a chatbot without built-in voices (e.g. Claude)", () => {
    const chatbot = { getName: () => "Claude" };
    const selector = makeSelector(chatbot);
    const populateSpy = vi.spyOn(selector as any, "populateVoices");
    selector.addMissingPiVoices(document.createElement("div"));
    expect(populateSpy).not.toHaveBeenCalled();
  });
});

describe("ClaudeVoiceMenu voice selector availability (#268)", () => {
  // Bypass the heavy constructor (initializeVoiceSelector); createVoiceButton
  // only needs prototype methods (getButtonClasses, toggleMenu).
  function makeMenu(): any {
    const menu = Object.create(ClaudeVoiceMenu.prototype);
    menu.toggleMenu = vi.fn();
    return menu;
  }

  it("greys the selector and names it for sign-in, but keeps it a clickable (NOT aria-disabled) button", () => {
    const menu = makeMenu();
    const button: HTMLButtonElement = menu.createVoiceButton(null, true);

    expect(button.classList.contains("saypi-voice-unavailable")).toBe(true);
    expect(button.getAttribute("aria-label")).toBeTruthy();
    // a real, actionable control — not announced as disabled (would hide sign-in)
    expect(button.getAttribute("aria-disabled")).toBeNull();
    button.click();
    expect(menu.toggleMenu).toHaveBeenCalledTimes(1); // sign-in path stays reachable
  });

  it("renders a normal selector with no unavailable treatment when TTS is available (e.g. signed in, or Pi)", () => {
    const menu = makeMenu();
    const button: HTMLButtonElement = menu.createVoiceButton(null, false);

    expect(button.classList.contains("saypi-voice-unavailable")).toBe(false);
    expect(button.getAttribute("aria-disabled")).toBeNull();
    expect(button.getAttribute("aria-label")).toBeNull();
  });
});
