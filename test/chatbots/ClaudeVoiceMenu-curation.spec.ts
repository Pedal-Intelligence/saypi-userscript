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
import { CLAUDE_MENU_CAP } from "../../src/tts/VoiceCuration";
import { claudeMockVoices, openAiMockVoices } from "../data/Voices";
import { SpeechSynthesisVoiceRemote } from "../../src/tts/SpeechModel";

const flipDayCatalog: SpeechSynthesisVoiceRemote[] = [
  ...claudeMockVoices,
  ...openAiMockVoices,
]; // 20 voices — the claude.ai payload once OPENAI_TTS_ENABLED flips

// Bypass the heavy constructor; populateVoices only needs prototype methods
// plus the fields it reads (pattern from VoiceMenu.spec.ts).
function makeMenu(currentVoice: SpeechSynthesisVoiceRemote | null = null): any {
  const menu = Object.create(ClaudeVoiceMenu.prototype);
  menu.chatbot = {} as any;
  menu.userPreferences = {
    getVoice: vi.fn(async () => currentVoice),
    setVoice: vi.fn(async () => {}),
    unsetVoice: vi.fn(async () => {}),
  };
  menu.element = document.createElement("div");
  menu.element.id = "claude-voice-selector";
  document.body.appendChild(menu.element);
  menu.menuButton = document.createElement("button");
  menu.menuContent = document.createElement("div");
  menu.toggleMenu = vi.fn();
  return menu;
}

function voiceRows(menu: any): HTMLElement[] {
  return Array.from(
    menu.menuContent.querySelectorAll("[role='menuitem']")
  ).filter(
    (el) =>
      (el as HTMLElement).dataset.voiceName &&
      (el as HTMLElement).dataset.voiceName !== "voice-off" &&
      !(el as HTMLElement).dataset.action
  ) as HTMLElement[];
}

function flushAsync(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

beforeEach(() => {
  openSettingsMock.mockReset();
  document.body.innerHTML = "";
});

describe("ClaudeVoiceMenu shortlist cap + door (flip-day catalog)", () => {
  it("renders at most CLAUDE_MENU_CAP voice rows from a 20-voice catalog", () => {
    const menu = makeMenu();
    menu.populateVoices(flipDayCatalog, menu.element);
    expect(voiceRows(menu).length).toBe(CLAUDE_MENU_CAP);
  });

  it("renders a 'More voices…' door row when voices are hidden", () => {
    const menu = makeMenu();
    menu.populateVoices(flipDayCatalog, menu.element);
    const door = menu.menuContent.querySelector("[data-action='more-voices']");
    expect(door).not.toBeNull();
  });

  it("opens the extension settings when the door row is clicked", () => {
    const menu = makeMenu();
    menu.populateVoices(flipDayCatalog, menu.element);
    const door = menu.menuContent.querySelector(
      "[data-action='more-voices']"
    ) as HTMLElement;
    door.click();
    expect(openSettingsMock).toHaveBeenCalled();
  });

  it("omits the door row when the whole catalog fits the cap", () => {
    const menu = makeMenu();
    menu.populateVoices(flipDayCatalog.slice(0, 3), menu.element);
    const door = menu.menuContent.querySelector("[data-action='more-voices']");
    expect(door).toBeNull();
  });

  it("keeps the Voice off item", () => {
    const menu = makeMenu();
    menu.populateVoices(flipDayCatalog, menu.element);
    const off = menu.menuContent.querySelector("[data-voice-name='voice-off']");
    expect(off).not.toBeNull();
  });
});

describe("ClaudeVoiceMenu tier signalling", () => {
  it("marks HD rows with an HD chip when tiers coexist, and never shows raw prices", () => {
    const menu = makeMenu();
    menu.populateVoices(flipDayCatalog, menu.element);
    const rows = voiceRows(menu);
    const jarnathan = rows.find((r) => r.dataset.voiceName === "Jarnathan")!;
    const coral = rows.find((r) => r.dataset.voiceName === "Coral")!;
    expect(jarnathan.textContent).toContain("HD");
    expect(coral.textContent).not.toContain("HD");
    expect(menu.menuContent.textContent).not.toMatch(/1k/);
  });

  it("shows a single footer note about HD allowance burn when tiers coexist", () => {
    const menu = makeMenu();
    menu.populateVoices(flipDayCatalog, menu.element);
    const footer = menu.menuContent.querySelector(".saypi-voice-footnote");
    expect(footer).not.toBeNull();
  });

  it("shows no HD chips and no footer for a single-tier catalog (pre-flip)", () => {
    const menu = makeMenu();
    menu.populateVoices(claudeMockVoices, menu.element);
    expect(menu.menuContent.textContent).not.toContain("HD");
    expect(menu.menuContent.querySelector(".saypi-voice-footnote")).toBeNull();
  });

  it("still caps and offers the door for the single-tier pre-flip catalog", () => {
    const menu = makeMenu();
    menu.populateVoices(claudeMockVoices, menu.element); // 10 ElevenLabs voices
    expect(voiceRows(menu).length).toBe(CLAUDE_MENU_CAP);
    expect(
      menu.menuContent.querySelector("[data-action='more-voices']")
    ).not.toBeNull();
  });
});

describe("ClaudeVoiceMenu current-voice pinning", () => {
  it("re-renders with the stored voice pinned first when it was not in the shortlist", async () => {
    const lucy = claudeMockVoices.find((v) => v.name === "Lucy")!;
    const menu = makeMenu(lucy);
    menu.populateVoices(flipDayCatalog, menu.element);
    await flushAsync();
    const rows = voiceRows(menu);
    expect(rows[0].dataset.voiceName).toBe("Lucy");
    expect(rows.length).toBe(CLAUDE_MENU_CAP);
  });

  it("does not re-render when the stored voice is already featured", async () => {
    const jarnathan = claudeMockVoices.find((v) => v.name === "Jarnathan")!;
    const menu = makeMenu(jarnathan);
    menu.populateVoices(flipDayCatalog, menu.element);
    await flushAsync();
    const rows = voiceRows(menu);
    const jarnathans = rows.filter((r) => r.dataset.voiceName === "Jarnathan");
    expect(jarnathans.length).toBe(1);
    expect(rows.length).toBe(CLAUDE_MENU_CAP);
  });

  it("persists the pin so the next populate renders the stored voice synchronously", async () => {
    const lucy = claudeMockVoices.find((v) => v.name === "Lucy")!;
    const menu = makeMenu(lucy);
    menu.populateVoices(flipDayCatalog, menu.element);
    await flushAsync(); // async pin + one re-render
    // A fresh populate (e.g. menu reopened) must include Lucy immediately,
    // without waiting for another async round-trip.
    menu.populateVoices(flipDayCatalog, menu.element);
    const rows = voiceRows(menu);
    expect(rows[0].dataset.voiceName).toBe("Lucy");
  });

  it("defers the pin re-render while the menu is open instead of tearing it down", async () => {
    const lucy = claudeMockVoices.find((v) => v.name === "Lucy")!;
    const menu = makeMenu(lucy);
    menu.populateVoices(flipDayCatalog, menu.element);
    // Simulate the menu being open when the async pin lands.
    menu.menuButton.setAttribute("aria-expanded", "true");
    const openMenuContent = menu.menuContent;
    await flushAsync();
    // The open menu must not be destroyed out from under the user…
    expect(menu.menuContent).toBe(openMenuContent);
    // …but the pin is remembered for the next populate.
    menu.menuButton.setAttribute("aria-expanded", "false");
    menu.populateVoices(flipDayCatalog, menu.element);
    const rows = voiceRows(menu);
    expect(rows[0].dataset.voiceName).toBe("Lucy");
  });

  it("passes the AI Chat tab as the door's settings destination", () => {
    const menu = makeMenu();
    menu.populateVoices(flipDayCatalog, menu.element);
    const door = menu.menuContent.querySelector(
      "[data-action='more-voices']"
    ) as HTMLElement;
    door.click();
    expect(openSettingsMock).toHaveBeenCalledWith("chat");
  });
});
