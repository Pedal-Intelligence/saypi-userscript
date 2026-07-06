import { describe, it, expect, vi, beforeEach } from "vitest";

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

const openSettingsMock = vi.fn();
vi.mock("../../src/popup/popupopener", () => ({
  openSettings: (...args: unknown[]) => openSettingsMock(...args),
}));

import { PiVoiceSettings } from "../../src/chatbots/PiVoiceMenu";

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
    setVoice: vi.fn(async () => {}),
    unsetVoice: vi.fn(async () => {}),
  };
  settings.element = grid;
  return settings;
}

const door = (grid: HTMLElement) =>
  grid.querySelector<HTMLElement>("button.saypi-more-voices");

beforeEach(() => {
  openSettingsMock.mockReset();
  document.body.innerHTML = "";
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

  it("renderMenu (the auth-change path) just re-ensures the door — never draws voice rows", () => {
    const grid = buildSettingsGrid();
    const settings = makeSettings(grid);
    settings.renderMenu([], null);
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
