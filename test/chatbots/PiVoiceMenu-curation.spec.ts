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

import { PiVoiceMenu, PiVoiceSettings } from "../../src/chatbots/PiVoiceMenu";
import { PI_MENU_CAP } from "../../src/tts/VoiceCuration";
import { ElevenLabsVoice, OpenAIVoice, openAiMockVoices } from "../data/Voices";
import { SpeechSynthesisVoiceRemote } from "../../src/tts/SpeechModel";

// The Pi catalog: Paola/Joey (flash) + the pricier Paola v3 variant, all
// custom (default=false), plus the OpenAI value voices on flip day.
const piElevenLabs = [
  new ElevenLabsVoice("ig1TeITnnNlsJtfHxJlW", "Paola"),
  new ElevenLabsVoice("bWJPewAagbymiJXZcxnh", "Joey"),
  new ElevenLabsVoice("paola-v3", "Paola", "F"),
];
const piFlipDay: SpeechSynthesisVoiceRemote[] = [
  ...piElevenLabs,
  ...openAiMockVoices,
]; // 13 custom voices

// A couple of Pi built-ins (voice.default=true) — these are native rows the
// cap must never touch.
function builtInVoice(id: string, name: string): SpeechSynthesisVoiceRemote {
  const voice = new OpenAIVoice(id, name) as any;
  voice.powered_by = "inflection.ai";
  voice.default = true;
  return voice;
}
const piBuiltIns = [builtInVoice("voice1", "Pi 1"), builtInVoice("voice2", "Pi 2")];

// Bypass the heavy constructor (DOM observers); populateVoices only needs
// prototype methods plus the fields it reads.
function makeMenu(currentVoice: SpeechSynthesisVoiceRemote | null = null): any {
  const menu = Object.create(PiVoiceMenu.prototype);
  menu.chatbot = {} as any;
  menu.userPreferences = {
    getVoice: vi.fn(async () => currentVoice),
    setVoice: vi.fn(async () => {}),
    unsetVoice: vi.fn(async () => {}),
  };
  menu.element = document.createElement("div");
  return menu;
}

function customRows(selector: HTMLElement): HTMLButtonElement[] {
  return Array.from(selector.querySelectorAll("button.saypi-custom-voice"));
}

function flushAsync(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

beforeEach(() => {
  openSettingsMock.mockReset();
  document.body.innerHTML = "";
});

describe("PiVoiceMenu shortlist cap + door", () => {
  it("caps SayPi (custom) rows at PI_MENU_CAP on the flip-day catalog", () => {
    const menu = makeMenu();
    const selector = document.createElement("div");
    menu.populateVoices([...piBuiltIns, ...piFlipDay], selector);
    expect(customRows(selector).length).toBe(PI_MENU_CAP);
  });

  it("never caps Pi's own built-in voice rows", () => {
    const menu = makeMenu();
    const selector = document.createElement("div");
    menu.populateVoices([...piBuiltIns, ...piFlipDay], selector);
    const builtInRows = Array.from(
      selector.querySelectorAll("button.saypi-restored-voice")
    );
    expect(builtInRows.length).toBe(piBuiltIns.length);
  });

  it("adds a muted 'More voices' button after the SayPi block when voices are hidden", () => {
    const menu = makeMenu();
    const selector = document.createElement("div");
    menu.populateVoices([...piBuiltIns, ...piFlipDay], selector);
    const door = selector.querySelector(
      "button.saypi-more-voices"
    ) as HTMLButtonElement;
    expect(door).not.toBeNull();
    door.click();
    expect(openSettingsMock).toHaveBeenCalledWith("voices");
  });

  it("still shows the door when the catalog fits the cap — it's the path to the catalog, not an overflow marker (#472)", () => {
    const menu = makeMenu();
    const selector = document.createElement("div");
    menu.populateVoices([...piBuiltIns, ...piElevenLabs], selector);
    expect(customRows(selector).length).toBe(piElevenLabs.length);
    const door = selector.querySelector(
      "button.saypi-more-voices"
    ) as HTMLButtonElement;
    expect(door).not.toBeNull();
    door.click();
    expect(openSettingsMock).toHaveBeenCalledWith("voices");
  });
});

describe("PiVoiceSettings door (#472)", () => {
  function makeSettings(): any {
    const settings = Object.create(PiVoiceSettings.prototype);
    settings.chatbot = {} as any;
    settings.userPreferences = {
      getVoice: vi.fn(async () => null),
      setVoice: vi.fn(async () => {}),
      unsetVoice: vi.fn(async () => {}),
    };
    settings.element = document.createElement("div");
    return settings;
  }

  it("appends a 'More voices' door to the uncapped settings grid", () => {
    const settings = makeSettings();
    const grid = document.createElement("div");
    settings.populateVoices([...piElevenLabs], grid);
    expect(customRows(grid).length).toBe(piElevenLabs.length); // grid stays uncapped
    const door = grid.querySelector(
      "button.saypi-more-voices"
    ) as HTMLButtonElement;
    expect(door).not.toBeNull();
    door.click();
    expect(openSettingsMock).toHaveBeenCalledWith("voices");
  });

  it("does not duplicate the door on repeated populates", () => {
    const settings = makeSettings();
    const grid = document.createElement("div");
    settings.populateVoices([...piElevenLabs], grid);
    settings.populateVoices([...piElevenLabs], grid);
    expect(grid.querySelectorAll("button.saypi-more-voices").length).toBe(1);
  });
});

describe("PiVoiceMenu tier badge", () => {
  it("suffixes premium rows with a quiet HD badge only when tiers coexist", () => {
    const menu = makeMenu();
    const selector = document.createElement("div");
    menu.populateVoices([...piBuiltIns, ...piFlipDay], selector);
    const rows = customRows(selector);
    const paola = rows.find(
      (r) => r.dataset.voiceId === "ig1TeITnnNlsJtfHxJlW"
    )!;
    const coral = rows.find((r) => r.dataset.voiceId === "coral")!;
    expect(paola.querySelector(".voice-tier")?.textContent).toBe("HD");
    expect(coral.querySelector(".voice-tier")).toBeNull();
  });

  it("shows no badge for today's single-tier catalog", () => {
    const menu = makeMenu();
    const selector = document.createElement("div");
    menu.populateVoices([...piBuiltIns, ...piElevenLabs], selector);
    expect(selector.querySelector(".voice-tier")).toBeNull();
  });
});

describe("PiVoiceMenu current-voice pinning", () => {
  it("re-renders with the stored voice visible when the cap would have hidden it", async () => {
    const shimmer = openAiMockVoices.find((v) => v.name === "Shimmer")!;
    const menu = makeMenu(shimmer);
    const selector = document.createElement("div");
    menu.populateVoices([...piBuiltIns, ...piFlipDay], selector);
    await flushAsync();
    const rows = customRows(selector);
    const ids = rows.map((r) => r.dataset.voiceId);
    expect(ids).toContain("shimmer");
    expect(rows.length).toBe(PI_MENU_CAP);
  });

  it("does not duplicate the door row when populateVoices runs again on the same menu", async () => {
    const menu = makeMenu();
    const selector = document.createElement("div");
    menu.populateVoices([...piBuiltIns, ...piFlipDay], selector);
    await flushAsync();
    menu.populateVoices([...piBuiltIns, ...piFlipDay], selector);
    await flushAsync();
    expect(selector.querySelectorAll("button.saypi-more-voices").length).toBe(1);
  });

  it("keeps the pin when a partial built-ins-only populate runs (addMissingPiVoices path)", async () => {
    const shimmer = openAiMockVoices.find((v) => v.name === "Shimmer")!;
    const menu = makeMenu(shimmer);
    const selector = document.createElement("div");
    menu.populateVoices([...piBuiltIns, ...piFlipDay], selector);
    await flushAsync(); // pin applied, Shimmer visible
    // Pi tops the menu up with its own extra voices (voice7/voice8 are
    // default=false, so they arrive as a customs-only partial list).
    const extras = [builtInVoice("voice7", "Pi 7"), builtInVoice("voice8", "Pi 8")];
    extras.forEach((v) => ((v as any).default = false));
    menu.populateVoices(extras, selector);
    await flushAsync();
    menu.populateVoices([...piBuiltIns, ...piFlipDay], selector);
    await flushAsync();
    const ids = customRows(selector).map((r) => r.dataset.voiceId);
    expect(ids).toContain("shimmer");
    // ...and the pin re-render must not have deleted the extra built-ins.
    expect(ids).toContain("voice7");
    expect(ids).toContain("voice8");
  });

  it("clears a stale pin after the user switches to a featured voice", async () => {
    const shimmer = openAiMockVoices.find((v) => v.name === "Shimmer")!;
    const coral = openAiMockVoices.find((v) => v.name === "Coral")!;
    let stored: any = shimmer;
    const menu = makeMenu();
    menu.userPreferences.getVoice = vi.fn(async () => stored);
    const selector = document.createElement("div");
    menu.populateVoices([...piBuiltIns, ...piFlipDay], selector);
    await flushAsync(); // pin = shimmer
    stored = coral; // user picked a featured voice
    menu.populateVoices([...piBuiltIns, ...piFlipDay], selector);
    await flushAsync(); // stale pin detected and cleared
    const rebuilt = document.createElement("div");
    menu.populateVoices([...piBuiltIns, ...piFlipDay], rebuilt);
    await flushAsync();
    const ids = customRows(rebuilt).map((r) => r.dataset.voiceId);
    expect(ids).not.toContain("shimmer");
    expect(ids).toContain("coral");
  });
});
