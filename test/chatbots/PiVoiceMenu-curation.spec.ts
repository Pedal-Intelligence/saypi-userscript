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

import { PiVoiceMenu } from "../../src/chatbots/PiVoiceMenu";
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

// Bypass the heavy constructor (DOM observers); renderMenu only needs
// prototype methods plus the fields it reads. renderMenu targets
// menu.element — the stored voice is passed in directly (gather-then-render),
// so no getVoice mock choreography or flushAsync is needed.
function makeMenu(): any {
  const menu = Object.create(PiVoiceMenu.prototype);
  menu.chatbot = { getID: () => "pi" } as any;
  menu.userPreferences = {
    getVoice: vi.fn(async () => null),
    setVoice: vi.fn(async () => {}),
    unsetVoice: vi.fn(async () => {}),
  };
  menu.element = document.createElement("div");
  menu.introduceVoice = vi.fn();
  return menu;
}

function customRows(selector: HTMLElement): HTMLButtonElement[] {
  return Array.from(selector.querySelectorAll("button.saypi-custom-voice"));
}

beforeEach(() => {
  openSettingsMock.mockReset();
  document.body.innerHTML = "";
});

describe("PiVoiceMenu shortlist cap + door", () => {
  it("caps SayPi (custom) rows at PI_MENU_CAP on the flip-day catalog", () => {
    const menu = makeMenu();
    menu.renderMenu([...piBuiltIns, ...piFlipDay], null);
    expect(customRows(menu.element).length).toBe(PI_MENU_CAP);
  });

  it("never caps Pi's own built-in voice rows", () => {
    const menu = makeMenu();
    menu.renderMenu([...piBuiltIns, ...piFlipDay], null);
    const builtInRows = Array.from(
      menu.element.querySelectorAll("button.saypi-restored-voice")
    );
    expect(builtInRows.length).toBe(piBuiltIns.length);
  });

  it("adds a muted 'More voices' button after the SayPi block when voices are hidden", () => {
    const menu = makeMenu();
    menu.renderMenu([...piBuiltIns, ...piFlipDay], null);
    const door = menu.element.querySelector(
      "button.saypi-more-voices"
    ) as HTMLButtonElement;
    expect(door).not.toBeNull();
    door.click();
    expect(openSettingsMock).toHaveBeenCalledWith("voices");
  });

  it("still shows the door when the catalog fits the cap — it's the path to the catalog, not an overflow marker (#472)", () => {
    const menu = makeMenu();
    menu.renderMenu([...piBuiltIns, ...piElevenLabs], null);
    expect(customRows(menu.element).length).toBe(piElevenLabs.length);
    const door = menu.element.querySelector(
      "button.saypi-more-voices"
    ) as HTMLButtonElement;
    expect(door).not.toBeNull();
    door.click();
    expect(openSettingsMock).toHaveBeenCalledWith("voices");
  });
});

// PiVoiceSettings is now door-first (Pi's settings grid gets only the "More
// voices" door, not inline SayPi rows) — its coverage lives in
// test/chatbots/PiVoiceSettings-more-voices-door.spec.ts.

describe("PiVoiceMenu tier badge", () => {
  it("suffixes premium rows with a quiet HD badge only when tiers coexist", () => {
    const menu = makeMenu();
    menu.renderMenu([...piBuiltIns, ...piFlipDay], null);
    const rows = customRows(menu.element);
    const paola = rows.find(
      (r) => r.dataset.voiceId === "ig1TeITnnNlsJtfHxJlW"
    )!;
    const coral = rows.find((r) => r.dataset.voiceId === "coral")!;
    expect(paola.querySelector(".voice-tier")?.textContent).toBe("HD");
    expect(coral.querySelector(".voice-tier")).toBeNull();
  });

  it("shows no badge for today's single-tier catalog", () => {
    const menu = makeMenu();
    menu.renderMenu([...piBuiltIns, ...piElevenLabs], null);
    expect(menu.element.querySelector(".voice-tier")).toBeNull();
  });
});

describe("PiVoiceMenu current-voice visibility", () => {
  it("renders the stored voice visible when the cap would have hidden it — synchronously, no pin recursion", () => {
    const shimmer = openAiMockVoices.find((v) => v.name === "Shimmer")!;
    const menu = makeMenu();
    menu.renderMenu([...piBuiltIns, ...piFlipDay], shimmer);
    const rows = customRows(menu.element);
    const ids = rows.map((r) => r.dataset.voiceId);
    expect(ids).toContain("shimmer");
    expect(rows.length).toBe(PI_MENU_CAP);
  });

  it("does not duplicate the door row when renderMenu runs again on the same menu", () => {
    const menu = makeMenu();
    menu.renderMenu([...piBuiltIns, ...piFlipDay], null);
    menu.renderMenu([...piBuiltIns, ...piFlipDay], null);
    expect(
      menu.element.querySelectorAll("button.saypi-more-voices").length
    ).toBe(1);
  });

  it("keeps Pi's extra voices AND the hidden stored voice across re-renders (was: partial-populate pin wipe / Pi7-8 deletion)", () => {
    const shimmer = openAiMockVoices.find((v) => v.name === "Shimmer")!;
    const menu = makeMenu();
    // Pi tops the menu up with its own account-gated extra voices; these are
    // rendered by the same pass now, never via a separate partial populate.
    menu.chatbot = {
      getID: () => "pi",
      getExtraVoices: () => [
        new OpenAIVoice("voice7", "Pi 7"),
        new OpenAIVoice("voice8", "Pi 8"),
      ],
      getVoiceIntroductionUrl: () => "https://pi.ai/intro.mp3",
    } as any;
    menu.renderMenu([...piBuiltIns, ...piFlipDay], shimmer);
    menu.renderMenu([...piBuiltIns, ...piFlipDay], shimmer);
    const ids = customRows(menu.element).map((r) => r.dataset.voiceId);
    expect(ids).toContain("shimmer");
    // ...and the re-render must not have deleted the extras.
    expect(ids).toContain("voice7");
    expect(ids).toContain("voice8");
  });

  it("stops showing a previously-pinned voice once the user switches to a featured voice (was: stale pin)", () => {
    const shimmer = openAiMockVoices.find((v) => v.name === "Shimmer")!;
    const coral = openAiMockVoices.find((v) => v.name === "Coral")!;
    const menu = makeMenu();
    menu.renderMenu([...piBuiltIns, ...piFlipDay], shimmer);
    menu.renderMenu([...piBuiltIns, ...piFlipDay], coral);
    const ids = customRows(menu.element).map((r) => r.dataset.voiceId);
    expect(ids).not.toContain("shimmer");
    expect(ids).toContain("coral");
  });
});
