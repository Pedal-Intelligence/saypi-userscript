import { describe, it, expect, vi, beforeEach } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// ConfigModule reads injected env at import time; stub it (mirrors the sibling specs).
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

// The shared chrome.i18n mock returns the KEY and drops substitutions, which
// would hide the one thing the notice has to get right: the voice's name
// reaching the sentence. Render key + substitutions instead; the English
// wording itself is pinned by the locale-backed copy contract specs.
vi.mock("../../src/i18n", () => ({
  default: (key: string, subs: string[] = []) =>
    subs.length ? `${key}:${subs.join("|")}` : key,
}));

const openSettingsMock = vi.fn();
vi.mock("../../src/popup/popupopener", () => ({
  openSettings: (...args: unknown[]) => openSettingsMock(...args),
}));

import { PiVoiceSettings } from "../../src/chatbots/PiVoiceSettings";
import { PiAIVoice } from "../../src/tts/SpeechModel";
import EventBus from "../../src/events/EventBus";

/**
 * A faithful fixture of pi.ai's CURRENT Voice settings grid (captured live via
 * Layer-4 CDP, 2026-07-04 — see #491 follow-up). The page renders a `div.grid`
 * of `<button>` voice cards (each `> span`), unlike the in-chat menu's div rows.
 * The door is a native-styled `<button>` cloned from a card, appended last.
 */
function buildSettingsGrid(): HTMLElement {
  const grid = document.createElement("div");
  grid.className = "grid grid-cols-1 gap-4 sm:grid-cols-2";
  for (let i = 1; i <= 8; i++) {
    const card = document.createElement("button");
    card.className =
      "inline-flex items-center whitespace-nowrap transition-colors h-[56px] w-full min-w-0 max-w-[22.0625rem] rounded-[10px] border border-divider-stroke px-[24px] py-0 bg-secondary-default text-text-secondary";
    const span = document.createElement("span");
    span.className = "text-action-m relative min-w-0 flex-1 truncate text-left";
    span.textContent = `Pi ${i}`;
    card.appendChild(span);
    grid.appendChild(card);
  }
  return grid;
}

// Object.create bypasses the heavy DOM-observer constructor; drive the door
// methods directly with `element` set to the grid fixture.
function makeSettings(grid: HTMLElement): any {
  const settings = Object.create(PiVoiceSettings.prototype);
  settings.chatbot = { getID: () => "pi" };
  settings.userPreferences = {
    getVoice: vi.fn(async () => null),
    hasVoice: vi.fn(async () => false),
    setVoice: vi.fn(async () => {}),
    unsetVoice: vi.fn(async () => {}),
  };
  settings.element = grid;
  settings.selectionRevision = 0;
  return settings;
}

const door = (grid: HTMLElement) =>
  grid.querySelector<HTMLElement>("button.saypi-more-voices");

beforeEach(() => {
  openSettingsMock.mockReset();
  document.body.innerHTML = "";
  EventBus.removeAllListeners();
});

describe("PiVoiceSettings — 'More voices' door on Pi's Voice settings page (#491 follow-up, door-first)", () => {
  it("injects the door as the last card of Pi's settings grid", () => {
    const grid = buildSettingsGrid();
    const settings = makeSettings(grid);
    settings.ensureSettingsDoor();
    expect(door(grid)).not.toBeNull();
    expect(grid.lastElementChild).toBe(door(grid));
    expect(door(grid)!.querySelector("span")?.textContent?.length).toBeGreaterThan(0);
  });

  it("renders ONLY the door — no inline SayPi voice rows on this surface (door-first)", () => {
    const grid = buildSettingsGrid();
    const settings = makeSettings(grid);
    settings.ensureSettingsDoor();
    expect(grid.querySelectorAll(".saypi-custom-voice").length).toBe(0);
    expect(grid.querySelectorAll(".saypi-restored-voice").length).toBe(0);
    // Pi's own 8 cards are untouched; the door is the only SayPi addition.
    expect(grid.querySelectorAll("button.saypi-more-voices").length).toBe(1);
    expect(grid.children.length).toBe(9);
  });

  it("clones a native card's styling (button + Pi's compiled classes), not foreign chrome", () => {
    const grid = buildSettingsGrid();
    const nativeCard = grid.firstElementChild as HTMLElement;
    const settings = makeSettings(grid);
    settings.ensureSettingsDoor();
    const d = door(grid)!;
    expect(d.tagName).toBe("BUTTON");
    expect(d.classList.contains("rounded-[10px]")).toBe(true);
    expect(d.classList.contains("h-[56px]")).toBe(true);
    expect(d.querySelector("span")!.className).toBe(
      nativeCard.querySelector("span")!.className
    );
  });

  it("is idempotent: re-ensuring never duplicates the door", () => {
    const grid = buildSettingsGrid();
    const settings = makeSettings(grid);
    settings.ensureSettingsDoor();
    settings.ensureSettingsDoor();
    settings.ensureSettingsDoor();
    expect(grid.querySelectorAll(".saypi-more-voices").length).toBe(1);
  });

  it("clicking the door opens the extension's Voices settings", () => {
    const grid = buildSettingsGrid();
    const settings = makeSettings(grid);
    settings.ensureSettingsDoor();
    door(grid)!.click();
    expect(openSettingsMock).toHaveBeenCalledWith("voices/pi");
  });

  it("refreshMenu (the auth-change path) re-ensures the door without fetching a catalog", async () => {
    const grid = buildSettingsGrid();
    const settings = makeSettings(grid);
    await settings.refreshMenu();
    expect(door(grid)).not.toBeNull();
    expect(grid.querySelectorAll(".saypi-custom-voice").length).toBe(0);
  });

  it("re-injects the door if Pi's grid re-render drops it (React removing a foreign child)", () => {
    const grid = buildSettingsGrid();
    const settings = makeSettings(grid);
    settings.ensureSettingsDoor();
    // Simulate Pi re-rendering: the door child is removed.
    door(grid)!.remove();
    expect(door(grid)).toBeNull();
    settings.ensureSettingsDoor();
    expect(grid.querySelectorAll(".saypi-more-voices").length).toBe(1);
  });

  it("observeSettingsGrid re-injects through a REAL MutationObserver when Pi drops the door", async () => {
    const grid = buildSettingsGrid();
    const settings = makeSettings(grid);
    settings.observeSettingsGrid();
    settings.ensureSettingsDoor();
    expect(door(grid)).not.toBeNull();
    door(grid)!.remove(); // the removal is itself a childList mutation
    await new Promise((r) => setTimeout(r, 0)); // let the observer callback run
    expect(grid.querySelectorAll(".saypi-more-voices").length).toBe(1);
  });

  it("never injects an unstyled door: waits for Pi's cards, then clones one (empty-grid race)", async () => {
    // The grid can match the selector before Pi hydrates its <button> cards.
    const grid = document.createElement("div");
    grid.className = "grid grid-cols-1 gap-4 sm:grid-cols-2";
    const settings = makeSettings(grid);
    settings.observeSettingsGrid();
    settings.ensureSettingsDoor();
    expect(door(grid)).toBeNull(); // no template → NO door (never an unstyled one)

    // Pi hydrates a card in a later commit.
    const card = document.createElement("button");
    card.className = "h-[56px] rounded-[10px] border";
    const span = document.createElement("span");
    span.className = "text-action-m";
    span.textContent = "Pi 1";
    card.appendChild(span);
    grid.appendChild(card); // childList mutation → observer fires
    await new Promise((r) => setTimeout(r, 0));

    const d = door(grid);
    expect(d).not.toBeNull(); // now injected...
    expect(d!.classList.contains("rounded-[10px]")).toBe(true); // ...and native-styled (cloned)
  });
});

/**
 * Pi's grid is the surface Pi now sends people to for voice choice, so it is
 * where a user checks what they sound like. When a SayPi voice has overridden
 * that choice, saying nothing here leaves the highlighted native card claiming
 * a job it isn't doing (#600).
 */
describe("PiVoiceSettings — what's actually speaking", () => {
  const notice = (grid: HTMLElement) =>
    grid.querySelector<HTMLElement>(".saypi-voice-override-notice");

  const voice = (name: string) =>
    ({ id: name.toLowerCase(), name, powered_by: "OpenAI" }) as any;

  it("says which SayPi voice is speaking, and that Pi's cards aren't in use", () => {
    const grid = buildSettingsGrid();
    const settings = makeSettings(grid);
    settings.renderMenu([], voice("Shimmer"));
    expect(notice(grid)).not.toBeNull();
    expect(notice(grid)!.textContent).toContain("Shimmer");
  });

  it("stays out of the way when Pi's own voice is the one speaking", async () => {
    const grid = buildSettingsGrid();
    const settings = makeSettings(grid);
    await settings.applySelectedVoice(null);
    expect(notice(grid)).toBeNull();
    // The door is SayPi's only mark on an un-overridden grid.
    expect(door(grid)).not.toBeNull();
  });

  it("does not claim a stored native Pi voice is a SayPi override", () => {
    const grid = buildSettingsGrid();
    const settings = makeSettings(grid);
    settings.renderMenu([], new PiAIVoice(4));
    expect(notice(grid)).toBeNull();

    settings.applySelectedVoice(voice("Shimmer"));
    settings.applySelectedVoice(new PiAIVoice(2));
    expect(notice(grid)).toBeNull();
  });

  it("uses Pi's readable theme color for the current-voice notice", () => {
    const style = document.createElement("style");
    style.textContent = ".text-text-secondary { color: rgb(193, 191, 181); }";
    document.body.appendChild(style);
    const grid = buildSettingsGrid();
    document.body.appendChild(grid);
    makeSettings(grid).renderMenu([], voice("Shimmer"));
    expect(window.getComputedStyle(notice(grid)!).color).toBe("rgb(193, 191, 181)");
  });

  it("offers Change voice alongside the voice in use, including after a change", () => {
    const grid = buildSettingsGrid();
    const settings = makeSettings(grid);
    settings.renderMenu([], voice("Shimmer"));
    settings.applySelectedVoice(voice("Marin"));
    const change = notice(grid)?.querySelector<HTMLButtonElement>("button");
    expect(change?.textContent).toBe("voicesChangeVoice");
    change!.click();
    expect(openSettingsMock).toHaveBeenCalledWith("voices/pi");
    expect(settings.userPreferences.unsetVoice).not.toHaveBeenCalled();
  });

  it("returns to Pi when a native card is clicked, preserving Pi's own click handler", async () => {
    const grid = buildSettingsGrid();
    const settings = makeSettings(grid);
    settings.observeSettingsGrid();
    settings.renderMenu([], voice("Shimmer"));
    const native = grid.querySelector<HTMLButtonElement>(":scope > button")!;
    const selectPiVoice = vi.fn();
    native.addEventListener("click", selectPiVoice);
    native.querySelector("span")!.click();
    await vi.waitFor(() => expect(notice(grid)).toBeNull());
    expect(settings.userPreferences.unsetVoice).toHaveBeenCalledWith(settings.chatbot);
    expect(selectPiVoice).toHaveBeenCalledOnce();
  });

  it("clears a stored native voice too, so it cannot override the newly clicked Pi card", async () => {
    const grid = buildSettingsGrid();
    const settings = makeSettings(grid);
    settings.observeSettingsGrid();
    settings.renderMenu([], new PiAIVoice(4));
    grid.querySelector<HTMLButtonElement>(":scope > button")!.click();
    await vi.waitFor(() => expect(settings.userPreferences.unsetVoice).toHaveBeenCalledOnce());
  });

  it("returns to Pi even if its selection handler replaces the clicked card", async () => {
    const grid = buildSettingsGrid();
    const settings = makeSettings(grid);
    settings.observeSettingsGrid();
    settings.renderMenu([], voice("Shimmer"));
    const native = grid.querySelector<HTMLButtonElement>(":scope > button")!;
    native.addEventListener("click", () => native.remove());
    native.click();
    await vi.waitFor(() => expect(notice(grid)).toBeNull());
    expect(settings.userPreferences.unsetVoice).toHaveBeenCalledOnce();
  });

  it("keeps the active SayPi notice if releasing the stored preference fails", async () => {
    const grid = buildSettingsGrid();
    const settings = makeSettings(grid);
    settings.userPreferences.unsetVoice.mockRejectedValue(new Error("Storage unavailable"));
    const debug = vi.spyOn(console, "debug").mockImplementation(() => {});
    settings.observeSettingsGrid();
    settings.renderMenu([], voice("Shimmer"));
    grid.querySelector<HTMLButtonElement>(":scope > button")!.click();
    await vi.waitFor(() => expect(settings.userPreferences.unsetVoice).toHaveBeenCalledOnce());
    expect(notice(grid)?.textContent).toContain("Shimmer");
    debug.mockRestore();
  });

  it("does not relinquish the current voice when opening More voices", () => {
    const grid = buildSettingsGrid();
    const settings = makeSettings(grid);
    settings.observeSettingsGrid();
    settings.renderMenu([], voice("Shimmer"));
    door(grid)!.click();
    expect(settings.userPreferences.unsetVoice).not.toHaveBeenCalled();
  });

  it("keeps an unavailable notice when a saved remote voice cannot resolve", async () => {
    const grid = buildSettingsGrid();
    const settings = makeSettings(grid);
    settings.userPreferences.hasVoice.mockResolvedValue(true);
    await settings.applySelectedVoice(null);
    expect(notice(grid)).not.toBeNull();
    expect(notice(grid)!.textContent).toContain("voicesSavedUnavailable");
    expect(notice(grid)?.textContent).not.toContain("voiceOverriddenBySayPi");
    expect(notice(grid)?.querySelector("button")?.textContent).toBe("voicesChangeVoice");
    settings.observeSettingsGrid();
    settings.userPreferences.unsetVoice.mockImplementation(async () => {
      settings.userPreferences.hasVoice.mockResolvedValue(false);
    });
    grid.querySelector<HTMLButtonElement>(":scope > button")!.click();
    await vi.waitFor(() => expect(notice(grid)).toBeNull());
  });

  it.each(["initial", "external"])("ignores a late %s read after a native choice", async (source) => {
    const grid = buildSettingsGrid();
    const settings = makeSettings(grid);
    let resolveVoice!: (voice: unknown) => void;
    const pending = new Promise((resolve) => { resolveVoice = resolve; });
    settings.userPreferences.getVoice.mockReturnValueOnce(pending);
    settings.observeSettingsGrid();
    settings.ensureSettingsDoor();
    let refresh: Promise<void> | undefined;
    if (source === "initial") {
      refresh = settings.refreshOverrideNotice();
    } else {
      settings.registerVoicePreferenceChangeHandler();
      EventBus.emit("userPreferenceChanged", { voicePreferences: { pi: "shimmer" }, voiceChatbotId: "pi" });
    }
    await settings.useNativeVoice();
    resolveVoice(voice("Shimmer"));
    await pending;
    await refresh;
    expect(notice(grid)).toBeNull();
  });

  it("follows a voice chosen elsewhere, without a repopulate", async () => {
    const grid = buildSettingsGrid();
    const settings = makeSettings(grid);
    settings.renderMenu([], null);
    settings.applySelectedVoice(voice("Marin"));
    expect(notice(grid)!.textContent).toContain("Marin");
    await settings.applySelectedVoice(null);
    expect(notice(grid)).toBeNull();
  });

  it("is idempotent, and re-appears if Pi's re-render drops it", () => {
    const grid = buildSettingsGrid();
    const settings = makeSettings(grid);
    settings.renderMenu([], voice("Shimmer"));
    settings.renderMenu([], voice("Shimmer"));
    expect(grid.querySelectorAll(".saypi-voice-override-notice").length).toBe(1);

    notice(grid)!.remove(); // React drops the foreign child
    settings.ensureSettingsDoor(); // the same mutation path that heals the door
    expect(grid.querySelectorAll(".saypi-voice-override-notice").length).toBe(1);
  });
});

describe("PiVoiceSettings — painting the notice on first load", () => {
  it("reads the voice in use when the surface is built, not only on a change", () => {
    // The base renders on an auth or preference CHANGE. Neither happens on an
    // ordinary page load, so a surface that waits for one shows its door and
    // nothing else — which is exactly what the live host showed with a voice
    // selected. Verified against the real construction path.
    const source = readFileSync(
      resolve(__dirname, "..", "..", "src/chatbots/PiVoiceSettings.ts"),
      "utf8"
    );
    const constructorBody = source.match(/constructor\([\s\S]*?\n {2}\}/)?.[0];
    expect(constructorBody).toMatch(/refreshOverrideNotice\(\)/);
    const refresh = source.match(
      /refreshOverrideNotice\(\): Promise<void> \{[\s\S]*?\n {2}\}/
    )?.[0];
    expect(refresh).toMatch(/getVoice\(this\.chatbot\)/);
    expect(refresh).toMatch(/applySelectedVoice\(/);
  });
});
