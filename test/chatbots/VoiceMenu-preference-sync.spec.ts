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

const openSettingsMock = vi.fn();
vi.mock("../../src/popup/popupopener", () => ({
  openSettings: (...args: unknown[]) => openSettingsMock(...args),
}));

import { ClaudeVoiceMenu } from "../../src/chatbots/ClaudeVoiceMenu";
import EventBus from "../../src/events/EventBus";
import { claudeMockVoices } from "../data/Voices";
import { SpeechSynthesisVoiceRemote } from "../../src/tts/SpeechModel";

// Selecting a voice in the settings catalog reaches the host tab as a
// chrome.storage.onChanged → EventBus "userPreferenceChanged" event carrying
// {voicePreferences, voiceId, voiceChatbotId} (PreferenceModule). The voice
// selectors must apply it immediately — the founder-reported defect (#475) was
// the Claude button label lagging while TTS had already switched voices.

function flushAsync(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function emitVoiceChange(voiceId: string | null, chatbotId: string): void {
  EventBus.emit("userPreferenceChanged", {
    voicePreferences: voiceId ? { [chatbotId]: voiceId } : {},
    voiceId,
    voiceChatbotId: chatbotId,
  });
}

function makeClaudeMenu(stored: () => SpeechSynthesisVoiceRemote | null): any {
  const menu = Object.create(ClaudeVoiceMenu.prototype);
  menu.chatbot = { getID: () => "claude" } as any;
  menu.userPreferences = {
    getVoice: vi.fn(async () => stored()),
    setVoice: vi.fn(async () => {}),
    unsetVoice: vi.fn(async () => {}),
  };
  menu.element = document.createElement("div");
  menu.element.id = "claude-voice-selector";
  document.body.appendChild(menu.element);
  menu.menuButton = document.createElement("button");
  menu.menuContent = document.createElement("div");
  menu.toggleMenu = vi.fn();
  (menu as any).registerVoicePreferenceChangeHandler();
  return menu;
}

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("ClaudeVoiceMenu reacts to settings-page voice changes (#475)", () => {
  it("updates the button label and checkmark as soon as the preference event arrives", async () => {
    const cassidy = claudeMockVoices.find((v) => v.name === "Cassidy")!;
    const jarnathan = claudeMockVoices.find((v) => v.name === "Jarnathan")!;
    let stored: SpeechSynthesisVoiceRemote | null = cassidy;
    const menu = makeClaudeMenu(() => stored);
    menu.renderMenu(claudeMockVoices, cassidy);
    await flushAsync();
    expect(
      menu.menuButton.querySelector(".voice-name")?.textContent
    ).toBe("Cassidy");

    stored = jarnathan; // the settings page persisted a new voice...
    emitVoiceChange(jarnathan.id, "claude"); // ...and storage.onChanged relayed it
    await flushAsync();

    expect(
      menu.menuButton.querySelector(".voice-name")?.textContent
    ).toBe("Jarnathan");
    const row = menu.menuContent.querySelector(
      "[data-voice-name='Jarnathan'] .checkmark-container"
    ) as HTMLElement;
    expect(row.innerHTML).not.toBe("");
  });

  it("ignores voice changes addressed to another chatbot", async () => {
    const cassidy = claudeMockVoices.find((v) => v.name === "Cassidy")!;
    let stored: SpeechSynthesisVoiceRemote | null = cassidy;
    const menu = makeClaudeMenu(() => stored);
    menu.renderMenu(claudeMockVoices, cassidy);
    await flushAsync();

    emitVoiceChange("some-pi-voice", "pi");
    await flushAsync();

    expect(
      menu.menuButton.querySelector(".voice-name")?.textContent
    ).toBe("Cassidy");
  });

  it("shows Voice off when the preference is cleared elsewhere", async () => {
    const cassidy = claudeMockVoices.find((v) => v.name === "Cassidy")!;
    let stored: SpeechSynthesisVoiceRemote | null = cassidy;
    const menu = makeClaudeMenu(() => stored);
    menu.renderMenu(claudeMockVoices, cassidy);
    await flushAsync();

    stored = null;
    emitVoiceChange(null, "claude");
    await flushAsync();

    expect(
      menu.menuButton.querySelector(".voice-name")?.textContent
    ).not.toBe("Cassidy");
  });
});
