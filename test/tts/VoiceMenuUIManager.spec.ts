import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// VoiceMenuUIManager -> VoiceMenu -> Pi forms an import cycle; ConfigModule reads
// injected env at import time; JwtManager is touched when a selector constructs.
// Mirror test/tts/VoiceMenu.spec.ts so the module graph imports cleanly.
vi.mock("../../src/ConfigModule", () => ({
  config: {
    appServerUrl: "https://app.example.com",
    apiServerUrl: "https://api.saypi.ai",
    GA_MEASUREMENT_ID: "x",
    GA_API_SECRET: "x",
    GA_ENDPOINT: "x",
  },
}));
vi.mock("../../src/chatbots/Pi", () => ({ PiAIChatbot: class {} }));
vi.mock("../../src/JwtManager", () => ({
  getJwtManagerSync: () => ({
    isAuthenticated: () => false,
    getClaims: () => null,
  }),
}));

import { VoiceMenuUIManager } from "../../src/tts/VoiceMenuUIManager";

const VOICE_MENU_ID = "saypi-voice-menu";

/**
 * A stand-in for PiVoiceMenu: it assigns the menu ID to its element (as
 * PiVoiceMenu's constructor does via addIdVoiceMenu) but NOT the host's
 * getVoiceMenuSelector() class. That is the exact shape behind #321 — the
 * selector re-query can never re-find the element SayPi created, so a repeat
 * call falls through to the create branch and inserts a second menu.
 */
class FakeVoiceSelector {
  constructor(public element: HTMLElement) {
    this.element.id = VOICE_MENU_ID;
  }
  getId(): string {
    return VOICE_MENU_ID;
  }
  getPositionFromEnd(): number {
    return 0;
  }
}

class FakeChatbot {
  // A host selector that a bare <div id="saypi-voice-menu"> never matches.
  getVoiceMenuSelector(): string {
    return "div.t-action-m";
  }
  getVoiceMenu(_prefs: any, element: HTMLElement): any {
    return new FakeVoiceSelector(element);
  }
}

describe("VoiceMenuUIManager.findAndDecorateVoiceMenu idempotency (#321)", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    // document.getElementById only searches the live document tree.
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("inserts exactly one menu even when called repeatedly on the same container", () => {
    const mgr = new VoiceMenuUIManager(new FakeChatbot() as any, {} as any);

    mgr.findAndDecorateVoiceMenu(container);
    mgr.findAndDecorateVoiceMenu(container);
    mgr.findAndDecorateVoiceMenu(container);

    expect(container.querySelectorAll(`#${VOICE_MENU_ID}`).length).toBe(1);
  });

  it("reuses the same element on the repeat call (no duplicate, reported as found+decorated)", () => {
    const mgr = new VoiceMenuUIManager(new FakeChatbot() as any, {} as any);

    const first = mgr.findAndDecorateVoiceMenu(container);
    const second = mgr.findAndDecorateVoiceMenu(container);

    expect(first.target).not.toBeNull();
    expect(second.target).toBe(first.target);
    expect(second.found).toBe(true);
    expect(second.decorated).toBe(true);
  });
});
