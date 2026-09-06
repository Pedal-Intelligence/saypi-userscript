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

vi.mock("../../src/events/EventBus.js", () => ({
  default: { emit: vi.fn(), on: vi.fn(), off: vi.fn(), once: vi.fn() },
}));

import { ClaudeVoiceMenu } from "../../src/chatbots/ClaudeVoiceMenu";
import { ElevenLabsVoice } from "../data/Voices";
import { SpeechSynthesisVoiceRemote } from "../../src/tts/SpeechModel";

/**
 * `availability` in Claude's in-chat menu (#568).
 *
 * The other half of the client-side residue: the server already keeps a
 * hard-down voice out of `featured`, but the menu's fill-to-cap padding and
 * user pins could still seat one — and, for the user whose SAVED voice is the
 * one that went down, grandfathering puts it in this menu on purpose. That row
 * is the only place they will find out their voice has gone quiet, so it has
 * to say so.
 */

function voice(
  id: string,
  name: string,
  availability?: "available" | "degraded" | "unavailable" | null
): SpeechSynthesisVoiceRemote {
  const v = new ElevenLabsVoice(id, name, "F", "American", `${name} sounds nice`);
  (v as SpeechSynthesisVoiceRemote).availability = availability ?? undefined;
  return v;
}

// Bypass the heavy constructor (pattern from ClaudeVoiceMenu-preview.spec.ts).
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

/** Voice rows only: the "Voice off" and "More voices…" rows are menuitems too. */
const rowNames = (menu: any): string[] =>
  Array.from(menu.menuContent.querySelectorAll("[role='menuitem']"))
    .map((el) => (el as HTMLElement).dataset.voiceName)
    .filter((name): name is string => !!name && name !== "voice-off");

/**
 * The row's subtitle. The menu writes it with `innerText`, which jsdom does not
 * implement as a live DOM property (it lands as an expando, invisible to
 * `textContent`), so it has to be read back the same way it was written.
 */
const subtitleOf = (row: HTMLElement): string =>
  ((row.querySelector("div > div.text-ellipsis") as any)?.innerText ?? "") as string;

const rowFor = (menu: any, voiceName: string): HTMLElement | undefined =>
  Array.from(menu.menuContent.querySelectorAll("[role='menuitem']")).find(
    (el) => (el as HTMLElement).dataset.voiceName === voiceName,
  ) as HTMLElement | undefined;

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("ClaudeVoiceMenu — a voice whose provider is down (#568)", () => {
  it("does not offer a hard-down voice to a user who hasn't chosen it", () => {
    const menu = makeMenu();
    menu.renderMenu(
      [voice("a", "Nova"), voice("b", "Paola", "unavailable"), voice("c", "Ash")],
      null,
    );
    expect(rowNames(menu)).toEqual(["Nova", "Ash"]);
  });

  it("still offers a degraded voice — it is erroring, not down", () => {
    const menu = makeMenu();
    menu.renderMenu([voice("a", "Nova"), voice("b", "Ash", "degraded")], null);
    expect(rowNames(menu)).toEqual(["Nova", "Ash"]);
  });

  it("changes nothing when the server sends no health signal", () => {
    const menu = makeMenu();
    menu.renderMenu([voice("a", "Nova", null), voice("b", "Ash")], null);
    expect(rowNames(menu)).toEqual(["Nova", "Ash"]);
  });

  it("keeps the user's own down voice in the menu, and says it cannot speak", () => {
    // Grandfathering puts it here; without the label the row is a trap — it
    // looks selected and working, and simply produces silence.
    const paola = voice("b", "Paola", "unavailable");
    const menu = makeMenu();
    menu.renderMenu([voice("a", "Nova"), paola, voice("c", "Ash")], paola);

    const row = rowFor(menu, "Paola")!;
    expect(row).toBeTruthy();
    expect(row.classList.contains("saypi-voice-unavailable")).toBe(true);
    expect(row.title).toBe("voicesSavedUnavailable");
    expect(row.getAttribute("title")).toBe("voicesSavedUnavailable");
    // The status replaces the blurb rather than sitting beside it: one row,
    // one sentence, and the sentence that matters right now is this one.
    expect(subtitleOf(row)).toBe("voicesSavedUnavailable");
    expect(subtitleOf(row)).not.toContain("Paola sounds nice");
  });

  it("leaves healthy rows describing themselves as usual", () => {
    const menu = makeMenu();
    menu.renderMenu([voice("a", "Nova")], null);
    const row = rowFor(menu, "Nova")!;
    expect(row.classList.contains("saypi-voice-unavailable")).toBe(false);
    expect(subtitleOf(row)).toBe("Nova sounds nice");
  });

  it("puts the down voice first and healthy alternatives right under it", () => {
    // The way out has to be one click away, in the same menu.
    const paola = voice("b", "Paola", "unavailable");
    const menu = makeMenu();
    menu.renderMenu([voice("a", "Nova"), paola, voice("c", "Ash")], paola);
    expect(rowNames(menu)).toEqual(["Paola", "Nova", "Ash"]);
  });
});
