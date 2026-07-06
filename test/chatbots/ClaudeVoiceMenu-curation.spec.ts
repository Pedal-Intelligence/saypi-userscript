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

// Bypass the heavy constructor; renderMenu only needs prototype methods
// plus the fields it reads (pattern from VoiceMenu.spec.ts). The stored
// voice is passed straight into renderMenu (gather-then-render).
function makeMenu(): any {
  const menu = Object.create(ClaudeVoiceMenu.prototype);
  menu.chatbot = {} as any;
  menu.userPreferences = {
    getVoice: vi.fn(async () => null),
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

beforeEach(() => {
  openSettingsMock.mockReset();
  document.body.innerHTML = "";
});

describe("ClaudeVoiceMenu shortlist cap + door (flip-day catalog)", () => {
  it("renders at most CLAUDE_MENU_CAP voice rows from a 20-voice catalog", () => {
    const menu = makeMenu();
    menu.renderMenu(flipDayCatalog, null);
    expect(voiceRows(menu).length).toBe(CLAUDE_MENU_CAP);
  });

  it("renders a 'More voices…' door row when voices are hidden", () => {
    const menu = makeMenu();
    menu.renderMenu(flipDayCatalog, null);
    const door = menu.menuContent.querySelector("[data-action='more-voices']");
    expect(door).not.toBeNull();
  });

  it("opens the extension settings when the door row is clicked", () => {
    const menu = makeMenu();
    menu.renderMenu(flipDayCatalog, null);
    const door = menu.menuContent.querySelector(
      "[data-action='more-voices']"
    ) as HTMLElement;
    door.click();
    expect(openSettingsMock).toHaveBeenCalledWith("voices");
  });

  it("keeps the door row even when the whole catalog fits the cap (#472)", () => {
    const menu = makeMenu();
    menu.renderMenu(flipDayCatalog.slice(0, 3), null);
    const door = menu.menuContent.querySelector("[data-action='more-voices']");
    expect(door).not.toBeNull();
  });

  it("keeps the Voice off item", () => {
    const menu = makeMenu();
    menu.renderMenu(flipDayCatalog, null);
    const off = menu.menuContent.querySelector("[data-voice-name='voice-off']");
    expect(off).not.toBeNull();
  });
});

describe("ClaudeVoiceMenu tier signalling", () => {
  it("marks HD rows with an HD chip when tiers coexist, and never shows raw prices", () => {
    const menu = makeMenu();
    menu.renderMenu(flipDayCatalog, null);
    const rows = voiceRows(menu);
    const jarnathan = rows.find((r) => r.dataset.voiceName === "Jarnathan")!;
    const coral = rows.find((r) => r.dataset.voiceName === "Coral")!;
    expect(jarnathan.textContent).toContain("HD");
    expect(coral.textContent).not.toContain("HD");
    expect(menu.menuContent.textContent).not.toMatch(/1k/);
  });

  it("shows a single footer note about HD allowance burn when tiers coexist", () => {
    const menu = makeMenu();
    menu.renderMenu(flipDayCatalog, null);
    const footer = menu.menuContent.querySelector(".saypi-voice-footnote");
    expect(footer).not.toBeNull();
  });

  it("shows no HD chips and no footer for a single-tier catalog (pre-flip)", () => {
    const menu = makeMenu();
    menu.renderMenu(claudeMockVoices, null);
    expect(menu.menuContent.textContent).not.toContain("HD");
    expect(menu.menuContent.querySelector(".saypi-voice-footnote")).toBeNull();
  });

  it("still caps and offers the door for the single-tier pre-flip catalog", () => {
    const menu = makeMenu();
    menu.renderMenu(claudeMockVoices, null); // 10 ElevenLabs voices
    expect(voiceRows(menu).length).toBe(CLAUDE_MENU_CAP);
    expect(
      menu.menuContent.querySelector("[data-action='more-voices']")
    ).not.toBeNull();
  });
});

describe("ClaudeVoiceMenu current-voice visibility (was: pinning)", () => {
  it("renders the stored voice first, synchronously, when the shortlist would have hidden it", () => {
    const lucy = claudeMockVoices.find((v) => v.name === "Lucy")!;
    const menu = makeMenu();
    menu.renderMenu(flipDayCatalog, lucy); // no flushAsync — no pin round-trip
    const rows = voiceRows(menu);
    expect(rows[0].dataset.voiceName).toBe("Lucy");
    expect(rows.length).toBe(CLAUDE_MENU_CAP);
  });

  it("does not duplicate a stored voice that is already featured", () => {
    const jarnathan = claudeMockVoices.find((v) => v.name === "Jarnathan")!;
    const menu = makeMenu();
    menu.renderMenu(flipDayCatalog, jarnathan);
    const rows = voiceRows(menu);
    const jarnathans = rows.filter((r) => r.dataset.voiceName === "Jarnathan");
    expect(jarnathans.length).toBe(1);
    expect(rows.length).toBe(CLAUDE_MENU_CAP);
  });

  it("every re-render includes the stored voice — no pin state to persist or wipe", () => {
    const lucy = claudeMockVoices.find((v) => v.name === "Lucy")!;
    const menu = makeMenu();
    menu.renderMenu(flipDayCatalog, lucy);
    menu.renderMenu(flipDayCatalog, lucy); // e.g. menu reopened
    const rows = voiceRows(menu);
    expect(rows[0].dataset.voiceName).toBe("Lucy");
  });

  it("an external voice change never tears down an open menu (applySelectedVoice only re-marks)", () => {
    const lucy = claudeMockVoices.find((v) => v.name === "Lucy")!;
    const menu = makeMenu();
    menu.renderMenu(flipDayCatalog, null);
    // Simulate the menu being open when a settings-page change lands.
    menu.menuButton.setAttribute("aria-expanded", "true");
    const openMenuContent = menu.menuContent;
    menu.applySelectedVoice(lucy);
    // The open menu must not be destroyed out from under the user…
    expect(menu.menuContent).toBe(openMenuContent);
    // …and the next render (menu reopened → refreshMenu) shows Lucy first.
    menu.renderMenu(flipDayCatalog, lucy);
    const rows = voiceRows(menu);
    expect(rows[0].dataset.voiceName).toBe("Lucy");
  });

  it("passes the Voices tab as the door's settings destination (#471)", () => {
    const menu = makeMenu();
    menu.renderMenu(flipDayCatalog, null);
    const door = menu.menuContent.querySelector(
      "[data-action='more-voices']"
    ) as HTMLElement;
    door.click();
    expect(openSettingsMock).toHaveBeenCalledWith("voices");
  });
});

// --- §Phase-2 user pins -----------------------------------------------------
// The resolved pin set (from settings) is threaded into renderMenu as a third
// argument and drives dropdown membership directly: current voice first, then
// the pins in catalog order, no fill-to-cap padding. Absent → today's
// behaviour (every test above passes two arguments).
describe("ClaudeVoiceMenu with user pins", () => {
  it("renders exactly the pinned voices (catalog order, no fill-to-cap)", () => {
    const menu = makeMenu();
    menu.renderMenu(flipDayCatalog, null, new Set(["onyx", "sage"]));
    const names = voiceRows(menu).map((r) => r.dataset.voiceName);
    expect(names).toEqual(["Onyx", "Sage"]);
  });

  it("keeps the current voice first even when it is not in the pin set (grandfathering)", () => {
    const lucy = claudeMockVoices.find((v) => v.name === "Lucy")!;
    const menu = makeMenu();
    menu.renderMenu(flipDayCatalog, lucy, new Set(["onyx"]));
    const names = voiceRows(menu).map((r) => r.dataset.voiceName);
    expect(names[0]).toBe("Lucy");
    expect(names).toContain("Onyx");
  });

  it("shows only the current voice — plus the ever-present door — when the pin set is empty", () => {
    const lucy = claudeMockVoices.find((v) => v.name === "Lucy")!;
    const menu = makeMenu();
    menu.renderMenu(flipDayCatalog, lucy, new Set());
    const names = voiceRows(menu).map((r) => r.dataset.voiceName);
    expect(names).toEqual(["Lucy"]);
    expect(
      menu.menuContent.querySelector("[data-action='more-voices']")
    ).not.toBeNull();
  });
});
