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

vi.mock("../../src/JwtManager", () => ({
  getJwtManagerSync: () => ({
    isAuthenticated: () => true,
    getClaims: () => ({ ttsQuotaRemaining: 1000 }),
  }),
}));

vi.mock("../../src/popup/popupopener", () => ({
  openSettings: vi.fn(),
}));

// Spy the EventBus so we can assert the preview audition is emitted.
const emit = vi.fn();
vi.mock("../../src/events/EventBus.js", () => ({
  default: {
    emit: (...args: any[]) => emit(...args),
    on: vi.fn(),
    off: vi.fn(),
    once: vi.fn(),
  },
}));

import { ClaudeVoiceMenu } from "../../src/chatbots/ClaudeVoiceMenu";
import { ElevenLabsVoice } from "../data/Voices";
import { SpeechSynthesisVoiceRemote } from "../../src/tts/SpeechModel";

const SAMPLE = "https://api.saypi.ai/voices/nova/sample.mp3";

function withSample(
  id: string,
  name: string,
  sampleUrl?: string
): SpeechSynthesisVoiceRemote {
  const v = new ElevenLabsVoice(id, name);
  v.sample_url = sampleUrl;
  return v;
}

// Bypass the heavy constructor (pattern from ClaudeVoiceMenu-curation.spec.ts).
function makeMenu(): any {
  const menu = Object.create(ClaudeVoiceMenu.prototype);
  menu.chatbot = {} as any;
  menu.userPreferences = {
    getVoice: vi.fn(async () => null),
    setVoice: vi.fn(async () => {}),
    unsetVoice: vi.fn(async () => {}),
  };
  menu.element = document.createElement("div");
  document.body.appendChild(menu.element);
  menu.menuButton = document.createElement("button");
  menu.menuContent = document.createElement("div");
  menu.toggleMenu = vi.fn();
  return menu;
}

function rowFor(menu: any, voiceName: string): HTMLElement | undefined {
  return Array.from(
    menu.menuContent.querySelectorAll("[role='menuitem']")
  ).find(
    (el) => (el as HTMLElement).dataset.voiceName === voiceName
  ) as HTMLElement | undefined;
}

beforeEach(() => {
  emit.mockClear();
  document.body.innerHTML = "";
});

describe("ClaudeVoiceMenu voice preview (▶)", () => {
  it("renders a ▶ preview button only on rows whose voice has a sample_url", () => {
    const menu = makeMenu();
    menu.populateVoices(
      [withSample("a", "Nova", SAMPLE), withSample("b", "Ash", undefined)],
      menu.element
    );
    expect(
      rowFor(menu, "Nova")!.querySelector("button.saypi-voice-preview")
    ).toBeTruthy();
    expect(
      rowFor(menu, "Ash")!.querySelector("button.saypi-voice-preview")
    ).toBeNull();
  });

  it("never renders a ▶ on the Voice off row", () => {
    const menu = makeMenu();
    menu.populateVoices([withSample("a", "Nova", SAMPLE)], menu.element);
    const off = menu.menuContent.querySelector(
      "[data-voice-name='voice-off']"
    ) as HTMLElement | null;
    expect(off?.querySelector("button.saypi-voice-preview")).toBeFalsy();
  });

  it("auditions the sample (audio:preview) without selecting the voice when ▶ is clicked", () => {
    const menu = makeMenu();
    menu.populateVoices([withSample("a", "Nova", SAMPLE)], menu.element);
    const btn = rowFor(menu, "Nova")!.querySelector(
      "button.saypi-voice-preview"
    ) as HTMLElement;
    btn.click();
    expect(emit).toHaveBeenCalledWith("audio:preview", { url: SAMPLE });
    // Separate target: the row's select handler (setVoice + toggleMenu) must
    // NOT fire — stopPropagation keeps play and select distinct.
    expect(menu.userPreferences.setVoice).not.toHaveBeenCalled();
    expect(menu.toggleMenu).not.toHaveBeenCalled();
  });
});
