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
