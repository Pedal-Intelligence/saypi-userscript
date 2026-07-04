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
import { HOST_VOICE_ATTR } from "../../src/tts/VoiceMenuControls";
import { ElevenLabsVoice, OpenAIVoice, openAiMockVoices } from "../data/Voices";
import { SpeechSynthesisVoiceRemote } from "../../src/tts/SpeechModel";

class TestGrid extends GridVoiceSelector {
  cap: number | null = 5;
  getId() {
    return "test-grid";
  }
  getButtonClasses() {
    return ["mb-1"];
  }
  protected override getCustomVoiceCap() {
    return this.cap;
  }
}

const piCustoms = [
  new ElevenLabsVoice("ig1TeITnnNlsJtfHxJlW", "Paola"),
  new ElevenLabsVoice("bWJPewAagbymiJXZcxnh", "Joey"),
  new ElevenLabsVoice("paola-v3", "Paola", "F"),
  ...openAiMockVoices,
]; // 13 custom voices, HD + everyday tiers coexist

function extraVoice(id: string, name: string): SpeechSynthesisVoiceRemote {
  return new OpenAIVoice(id, name);
}

function makeGrid(
  opts: {
    stored?: SpeechSynthesisVoiceRemote | null;
    provider?: boolean;
    cap?: number | null;
  } = {}
): { grid: any; el: HTMLElement } {
  const grid: any = Object.create(TestGrid.prototype);
  grid.cap = opts.cap === undefined ? 5 : opts.cap;
  grid.chatbot = opts.provider
    ? {
        getID: () => "pi",
        getExtraVoices: () => [
          extraVoice("voice7", "Pi 7"),
          extraVoice("voice8", "Pi 8"),
        ],
        getVoiceIntroductionUrl: () => "https://pi.ai/intro.mp3",
      }
    : { getID: () => "pi" };
  grid.userPreferences = {
    getVoice: vi.fn(async () => opts.stored ?? null),
    setVoice: vi.fn(async () => {}),
    unsetVoice: vi.fn(async () => {}),
  };
  grid.element = document.createElement("div");
  grid.introduceVoice = vi.fn();
  return { grid, el: grid.element };
}

const rowsOf = (el: HTMLElement) =>
  Array.from(el.querySelectorAll<HTMLElement>(".saypi-custom-voice"));
const idsOf = (el: HTMLElement) => rowsOf(el).map((r) => r.dataset.voiceId);

beforeEach(() => {
  openSettingsMock.mockReset();
  document.body.innerHTML = "";
});

describe("GridVoiceSelector.renderMenu — one idempotent render path", () => {
  it("caps SayPi rows and always renders exactly one door", () => {
    const { grid, el } = makeGrid();
    grid.renderMenu(piCustoms, null);
    expect(rowsOf(el).length).toBe(5);
    expect(el.querySelectorAll(".saypi-more-voices").length).toBe(1);
  });

  it("is idempotent: rendering the same inputs twice yields identical DOM", () => {
    const { grid, el } = makeGrid();
    grid.renderMenu(piCustoms, null);
    const first = el.innerHTML;
    grid.renderMenu(piCustoms, null);
    expect(el.innerHTML).toBe(first);
    expect(el.querySelectorAll(".saypi-more-voices").length).toBe(1);
  });

  it("keeps DOM identity of surviving rows across re-renders (no listener churn)", () => {
    const { grid, el } = makeGrid();
    grid.renderMenu(piCustoms, null);
    const before = rowsOf(el)[0];
    grid.renderMenu(piCustoms, null);
    expect(rowsOf(el)[0]).toBe(before);
  });

  it("always shows the stored voice, synchronously, even when the cap would hide it", () => {
    const shimmer = openAiMockVoices.find((v) => v.name === "Shimmer")!;
    const { grid, el } = makeGrid({ stored: shimmer });
    grid.renderMenu(piCustoms, shimmer); // no flushAsync, no pin recursion
    expect(idsOf(el)).toContain("shimmer");
    expect(rowsOf(el).length).toBe(5);
    expect(
      (el.querySelector('[data-voice-id="shimmer"]') as HTMLButtonElement)
        .disabled
    ).toBe(true);
  });

  it("renders the stored voice's row selected and no other", () => {
    const coral = openAiMockVoices.find((v) => v.name === "Coral")!;
    const { grid, el } = makeGrid({ stored: coral });
    grid.renderMenu(piCustoms, coral);
    const selected = el.querySelectorAll(".selected");
    expect(selected.length).toBe(1);
    expect((selected[0] as HTMLElement).dataset.voiceId).toBe("coral");
  });

  it("switching the stored voice on re-render moves the mark and un-hides the new voice (no stale mark, no vanish)", () => {
    const shimmer = openAiMockVoices.find((v) => v.name === "Shimmer")!;
    const coral = openAiMockVoices.find((v) => v.name === "Coral")!;
    const { grid, el } = makeGrid();
    grid.renderMenu(piCustoms, shimmer);
    grid.renderMenu(piCustoms, coral);
    expect(idsOf(el)).toContain("coral");
    expect(idsOf(el)).not.toContain("shimmer"); // stale pin gone, stateless
    const selected = el.querySelectorAll(".selected");
    expect(selected.length).toBe(1);
    expect((selected[0] as HTMLElement).dataset.voiceId).toBe("coral");
  });

  it("uncapped surfaces render the whole catalog with no tier badges and no door by default", () => {
    const { grid, el } = makeGrid({ cap: null });
    grid.renderMenu(piCustoms, null);
    expect(rowsOf(el).length).toBe(piCustoms.length);
    expect(el.querySelector(".voice-tier")).toBeNull();
    expect(el.querySelector(".saypi-more-voices")).toBeNull();
  });
});

describe("GridVoiceSelector — host-row adoption (positive classification)", () => {
  it("adopts pre-existing host buttons: marks them and wires unset-on-click exactly once across renders", async () => {
    const { grid, el } = makeGrid();
    const hostBtn = document.createElement("button");
    hostBtn.textContent = "Pi 1";
    el.appendChild(hostBtn);
    grid.renderMenu(piCustoms, null);
    grid.renderMenu(piCustoms, null); // second render must not double-bind
    expect(hostBtn.getAttribute(HOST_VOICE_ATTR)).toBe("true");
    hostBtn.click();
    await new Promise((r) => setTimeout(r, 0));
    expect(grid.userPreferences.unsetVoice).toHaveBeenCalledTimes(1);
    expect(hostBtn.classList.contains("selected")).toBe(true);
  });

  it("voice-off selection leaves host rows untouched but clears SayPi rows", () => {
    const coral = openAiMockVoices.find((v) => v.name === "Coral")!;
    const { grid, el } = makeGrid();
    const hostBtn = document.createElement("button");
    el.appendChild(hostBtn);
    grid.renderMenu(piCustoms, coral);
    grid.renderMenu(piCustoms, null);
    expect(el.querySelectorAll(".saypi-custom-voice.selected").length).toBe(0);
  });
});

describe("GridVoiceSelector — Pi extras top-up (was addMissingPiVoices)", () => {
  it("tops up Pi's account-gated extras for provider chatbots when fewer than 8 host rows", () => {
    const { grid, el } = makeGrid({ provider: true });
    grid.renderMenu(piCustoms, null);
    expect(idsOf(el)).toContain("voice7");
    expect(idsOf(el)).toContain("voice8");
  });

  it("extras survive re-renders alongside a shortlist-hidden stored voice (the Patch A regression)", () => {
    const shimmer = openAiMockVoices.find((v) => v.name === "Shimmer")!;
    const { grid, el } = makeGrid({ provider: true });
    grid.renderMenu(piCustoms, shimmer);
    grid.renderMenu(piCustoms, shimmer);
    grid.renderMenu(piCustoms, shimmer);
    const ids = idsOf(el);
    expect(ids).toContain("shimmer");
    expect(ids).toContain("voice7");
    expect(ids).toContain("voice8");
  });

  it("does not top up for chatbots without built-in voices", () => {
    const { grid, el } = makeGrid({ provider: false });
    grid.renderMenu(piCustoms, null);
    expect(idsOf(el)).not.toContain("voice7");
  });
});

describe("GridVoiceSelector — unknown elements are inert (#485 / ▶-deselects trap)", () => {
  function nestedPreviewFixture(el: HTMLElement): HTMLButtonElement {
    // A future Pi row: wrapper div holding a ▶ — the #483 shape.
    const rowWrapper = document.createElement("div");
    const preview = document.createElement("button");
    preview.classList.add("saypi-voice-preview");
    rowWrapper.appendChild(preview);
    el.appendChild(rowWrapper);
    return preview;
  }

  it("re-render never throws on, removes, adopts, or counts a nested ▶", () => {
    const { grid, el } = makeGrid({ provider: true });
    const preview = nestedPreviewFixture(el);
    expect(() => grid.renderMenu(piCustoms, null)).not.toThrow();
    expect(el.contains(preview)).toBe(true);
    expect(preview.hasAttribute(HOST_VOICE_ATTR)).toBe(false);
    expect(idsOf(el)).toContain("voice7"); // ▶ not miscounted as a host voice
  });

  it("clicking a ▶ never unsets or sets the voice", async () => {
    const { grid, el } = makeGrid();
    const preview = nestedPreviewFixture(el);
    grid.renderMenu(piCustoms, null);
    preview.click();
    await new Promise((r) => setTimeout(r, 0));
    expect(grid.userPreferences.unsetVoice).not.toHaveBeenCalled();
    expect(grid.userPreferences.setVoice).not.toHaveBeenCalled();
  });

  it("a DIRECT-CHILD ▶ (SayPi-marked control) is still not adopted — positive marks win over position", () => {
    const { grid, el } = makeGrid();
    const preview = document.createElement("button");
    preview.classList.add("saypi-voice-preview");
    el.appendChild(preview);
    grid.renderMenu(piCustoms, null);
    expect(preview.hasAttribute(HOST_VOICE_ATTR)).toBe(false);
  });
});

describe("GridVoiceSelector — selection via rows (click paths)", () => {
  it("clicking a SayPi row persists the voice, marks exactly that row, and introduces the voice", async () => {
    const { grid, el } = makeGrid();
    grid.renderMenu(piCustoms, null);
    const row = el.querySelector('[data-voice-id="coral"]') as HTMLButtonElement;
    row.click();
    await new Promise((r) => setTimeout(r, 0));
    expect(grid.userPreferences.setVoice).toHaveBeenCalled();
    expect(row.classList.contains("selected")).toBe(true);
    expect(el.querySelectorAll(".selected").length).toBe(1);
    expect(grid.introduceVoice).toHaveBeenCalled();
  });

  it("tier badge appears on HD rows only while tiers coexist", () => {
    const { grid, el } = makeGrid();
    grid.renderMenu(piCustoms, null);
    const paola = el.querySelector('[data-voice-id="ig1TeITnnNlsJtfHxJlW"]');
    // Paola is HD and featured, so present under the cap; badge because tiers coexist.
    expect(paola?.querySelector(".voice-tier")?.textContent).toBe("HD");
  });
});
