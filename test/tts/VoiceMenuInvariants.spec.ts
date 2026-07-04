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
    getClaims: () => null,
  }),
}));
const openSettingsMock = vi.fn();
vi.mock("../../src/popup/popupopener", () => ({
  openSettings: (...args: unknown[]) => openSettingsMock(...args),
}));
vi.mock("../../src/i18n", () => ({ default: (key: string) => key }));
vi.mock("../../src/events/EventBus", () => ({
  default: { emit: vi.fn(), on: vi.fn(), off: vi.fn() },
}));

import { GridVoiceSelector } from "../../src/tts/GridVoiceSelector";
import { classifyControl } from "../../src/tts/VoiceMenuControls";
import { ElevenLabsVoice, OpenAIVoice, openAiMockVoices } from "../data/Voices";
import { SpeechSynthesisVoiceRemote } from "../../src/tts/SpeechModel";

/**
 * The shipped guarantees of the voice menus, pinned as tests so a future
 * restructure of this code cannot quietly drop one. Each case names the
 * incident (or trap) it guards against.
 */

class TestGrid extends GridVoiceSelector {
  getId() {
    return "invariants-grid";
  }
  getButtonClasses() {
    return ["mb-1"];
  }
  protected override getCustomVoiceCap(): number | null {
    return 5;
  }
}

const catalog: SpeechSynthesisVoiceRemote[] = [
  new ElevenLabsVoice("ig1TeITnnNlsJtfHxJlW", "Paola"),
  new ElevenLabsVoice("bWJPewAagbymiJXZcxnh", "Joey"),
  ...openAiMockVoices,
]; // 12 custom voices, tiers coexist

function makeGrid(): { grid: any; el: HTMLElement } {
  const grid: any = Object.create(TestGrid.prototype);
  grid.chatbot = {
    getID: () => "pi",
    getExtraVoices: () => [
      new OpenAIVoice("voice7", "Pi 7"),
      new OpenAIVoice("voice8", "Pi 8"),
    ],
    getVoiceIntroductionUrl: () => "https://pi.ai/intro.mp3",
  };
  grid.userPreferences = {
    getVoice: vi.fn(async () => null),
    setVoice: vi.fn(async () => {}),
    unsetVoice: vi.fn(async () => {}),
  };
  grid.element = document.createElement("div");
  grid.introduceVoice = vi.fn();
  return { grid, el: grid.element };
}

const idsOf = (el: HTMLElement) =>
  Array.from(el.querySelectorAll<HTMLElement>(".saypi-custom-voice")).map(
    (r) => r.dataset.voiceId
  );

beforeEach(() => {
  openSettingsMock.mockReset();
  document.body.innerHTML = "";
});

describe("Voice menu invariants", () => {
  it("grandfathering: a deprecated voice keeps rendering (and selectable) iff it is the stored voice", () => {
    // Design §5: the server retires voices via `deprecated`, but a user who
    // already chose one must never lose it (voice-choice-ux plan).
    const deprecated = new OpenAIVoice("ballad", "Ballad") as any;
    deprecated.deprecated = true;
    const others = catalog.filter((v) => v.id !== "ballad");
    const { grid, el } = makeGrid();

    // Not stored → dropped from the menu entirely.
    grid.renderMenu([...others, deprecated], null);
    expect(idsOf(el)).not.toContain("ballad");

    // Stored → renders (first) and carries the selected mark.
    grid.renderMenu([...others, deprecated], deprecated);
    expect(idsOf(el)).toContain("ballad");
    const row = el.querySelector('[data-voice-id="ballad"]') as HTMLButtonElement;
    expect(row.classList.contains("selected")).toBe(true);
  });

  it("current-voice-never-vanishes: survives repeated re-renders with shuffled catalog order", () => {
    // The Patch A regression class: re-renders on shared state used to be
    // able to drop the stored (shortlist-hidden) voice.
    const shimmer = openAiMockVoices.find((v) => v.name === "Shimmer")!;
    const { grid, el } = makeGrid();
    const shuffles = [
      catalog,
      [...catalog].reverse(),
      [...catalog.slice(4), ...catalog.slice(0, 4)],
    ];
    for (const order of shuffles) {
      grid.renderMenu(order, shimmer);
      expect(idsOf(el)).toContain("shimmer");
    }
  });

  it("no silent swap: an external voice change marks exactly the new row; a hidden new voice leaves NO row marked", () => {
    // The ▶-deselects trap's cousin: a stale highlight lying about which
    // voice will actually speak. If the stored voice is not visible, showing
    // nothing selected is the truth (the old code left the previous row lit).
    const coral = openAiMockVoices.find((v) => v.name === "Coral")!;
    const nova = openAiMockVoices.find((v) => v.name === "Nova")!;
    const { grid, el } = makeGrid();
    grid.renderMenu(catalog, coral);
    expect(
      (el.querySelector(".selected") as HTMLElement).dataset.voiceId
    ).toBe("coral");

    // External switch to another visible voice: the mark moves.
    grid.applySelectedVoice(nova);
    const selected = el.querySelectorAll(".selected");
    expect(selected.length).toBe(1);
    expect((selected[0] as HTMLElement).dataset.voiceId).toBe("nova");

    // External switch to a voice the shortlist is hiding: nothing is marked
    // (the next full render will surface it via curateShortlist).
    const hidden = openAiMockVoices.find((v) => v.name === "Ballad")!;
    if (idsOf(el).includes("ballad")) throw new Error("fixture: expected ballad hidden");
    grid.applySelectedVoice(hidden);
    expect(el.querySelectorAll(".selected").length).toBe(0);
  });

  it("door singularity: exactly one door, after the last SayPi row, across renders with changing stored voices", () => {
    const coral = openAiMockVoices.find((v) => v.name === "Coral")!;
    const shimmer = openAiMockVoices.find((v) => v.name === "Shimmer")!;
    const { grid, el } = makeGrid();
    grid.renderMenu(catalog, null);
    grid.renderMenu(catalog, shimmer);
    grid.renderMenu(catalog, coral);
    const doors = el.querySelectorAll(".saypi-more-voices");
    expect(doors.length).toBe(1);
    const customRows = el.querySelectorAll(".saypi-custom-voice");
    const lastCustom = customRows[customRows.length - 1];
    expect(lastCustom.nextElementSibling).toBe(doors[0]);
  });

  it("adoption idempotence: a host button seen by render AND the mutation observer path is wired exactly once", async () => {
    // registerVoiceChangeHandler used to add a fresh click listener on every
    // Pi menu expand; the adoption stamp is the wired-once guard now.
    const { grid, el } = makeGrid();
    const hostBtn = document.createElement("button");
    hostBtn.textContent = "Pi 1";
    el.appendChild(hostBtn);
    grid.renderMenu(catalog, null);
    grid.handleRowAddition(hostBtn); // observer sees it again
    grid.renderMenu(catalog, null); // and another expand re-renders
    hostBtn.click();
    await new Promise((r) => setTimeout(r, 0));
    expect(grid.userPreferences.unsetVoice).toHaveBeenCalledTimes(1);
  });

  it("taxonomy completeness: every interactive element the grid creates classifies as non-unknown", () => {
    // Guards "new row type forgot its positive marker" — an unknown SayPi
    // control would be adopted as a host voice and unset the user's voice
    // on click (the original ▶ trap).
    const coral = openAiMockVoices.find((v) => v.name === "Coral")!;
    const { grid, el } = makeGrid();
    // Include a default-flagged voice so restored rows are exercised too.
    const builtIn = new OpenAIVoice("voice1", "Pi 1") as any;
    builtIn.default = true;
    grid.renderMenu([builtIn, ...catalog], coral);
    const buttons = Array.from(el.querySelectorAll("button"));
    expect(buttons.length).toBeGreaterThan(0);
    for (const button of buttons) {
      expect(classifyControl(button)).not.toBe("unknown");
    }
  });
});
