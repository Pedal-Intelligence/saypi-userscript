import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/ConfigModule", () => ({
  config: { appServerUrl: "https://app.example.com", apiServerUrl: "https://api.saypi.ai" },
}));

vi.mock("../../src/JwtManager", () => ({
  getJwtManagerSync: () => ({ isAuthenticated: () => true, getClaims: () => null }),
}));

vi.mock("../../src/dom/ChatHistory", () => ({ getMostRecentAssistantMessage: () => undefined }));
vi.mock("../../src/i18n", () => ({ default: (key: string) => key }));

// refreshMenu gathers via getVoices() + getVoice(); return [] so the test
// isolates the render-with-nested-buttons-present path.
const getVoicesMock = vi.fn().mockResolvedValue([]);
vi.mock("../../src/tts/SpeechSynthesisModule", () => ({
  SpeechSynthesisModule: {
    getInstance: () => ({
      getVoices: getVoicesMock,
      createCompletedSpeechStream: vi.fn(),
      createSpeech: vi.fn(),
      speak: vi.fn(),
    }),
  },
}));

vi.mock("../../src/events/EventBus", () => ({
  default: { emit: vi.fn(), on: vi.fn(), off: vi.fn() },
}));

import { GridVoiceSelector } from "../../src/tts/GridVoiceSelector";

class TestGrid extends GridVoiceSelector {
  getId(): string {
    return "test-grid-refresh";
  }
  getButtonClasses(): string[] {
    return [];
  }
}

/**
 * Tombstone for #485 (surfaced by #482's nested ▶ preview buttons): the old
 * base `refreshMenu` began with a bulk teardown that fed a DESCENDANT
 * `querySelectorAll("button")` into direct-child-only `removeChild`. The
 * nested ▶ matched but was not a direct child, so `removeChild` threw
 * `NotFoundError`, aborting the rebuild — the menu "vanished" on open.
 *
 * That teardown no longer exists ANYWHERE: renders reconcile SayPi-owned rows
 * by id and never bulk-remove buttons, so the crash is structurally
 * impossible, not guarded against. These tests pin the surviving contract:
 * a refresh with nested/unknown buttons present must resolve and leave them
 * untouched.
 */
describe("refreshMenu with nested (preview) buttons present (#485 tombstone)", () => {
  beforeEach(() => {
    getVoicesMock.mockClear().mockResolvedValue([]);
  });

  function buildElementWithNestedButton(): {
    element: HTMLDivElement;
    directHostBtn: HTMLButtonElement;
    preview: HTMLButtonElement;
  } {
    const element = document.createElement("div");
    // A host-native direct-child voice button (adopted, never removed by us).
    const directHostBtn = document.createElement("button");
    directHostBtn.textContent = "Pi 1";
    element.appendChild(directHostBtn);
    // A menu item div whose trailing controls hold a NESTED ▶ preview button
    // (the #482 structure that surfaced only once sample_url went live).
    const item = document.createElement("div");
    item.setAttribute("role", "menuitem");
    const trailing = document.createElement("div");
    trailing.classList.add("saypi-voice-trailing");
    const preview = document.createElement("button");
    preview.classList.add("saypi-voice-preview");
    trailing.appendChild(preview);
    item.appendChild(trailing);
    element.appendChild(item);
    return { element, directHostBtn, preview };
  }

  function makeGrid(element: HTMLElement): TestGrid {
    const grid: any = Object.create(TestGrid.prototype);
    grid.chatbot = { getID: () => "claude" };
    grid.userPreferences = {
      getVoice: vi.fn(async () => null),
      setVoice: vi.fn(async () => {}),
      unsetVoice: vi.fn(async () => {}),
    };
    grid.element = element;
    return grid as TestGrid;
  }

  it("resolves without throwing when a menu item contains a nested <button> that is not a direct child", async () => {
    const { element } = buildElementWithNestedButton();
    const grid = makeGrid(element);

    // Pre-refactor: rejected with NotFoundError from removeChild on the
    // nested button.
    await expect(grid.refreshMenu()).resolves.toBeUndefined();
  });

  it("leaves both the host's direct-child button and the nested ▶ in place — renders reconcile, they never bulk-remove", async () => {
    const { element, directHostBtn, preview } = buildElementWithNestedButton();
    const grid = makeGrid(element);

    await grid.refreshMenu();

    // The host's own button survives (it is adopted, not torn down)...
    expect(element.contains(directHostBtn)).toBe(true);
    // ...and the nested preview button is untouched and unclassified as a row.
    expect(element.contains(preview)).toBe(true);
    expect(preview.hasAttribute("data-saypi-host-voice")).toBe(false);
  });
});

// refreshMenu is the gather-then-render seam. Phase 2 has it also resolve the
// host's voice pins (from chrome.storage) alongside the catalog + stored voice,
// and hand the resolved set to renderMenu as a third argument. When the host is
// un-customized it hands null, so the menu keeps its default shortlist.
describe("refreshMenu resolves user pins and forwards them to renderMenu", () => {
  beforeEach(() => {
    getVoicesMock.mockReset();
    (chrome.storage.local as any)._reset();
  });

  function makeGrid(): TestGrid {
    const grid: any = Object.create(TestGrid.prototype);
    grid.chatbot = { getID: () => "claude", getID_: undefined };
    grid.userPreferences = {
      getVoice: vi.fn(async () => null),
      setVoice: vi.fn(async () => {}),
      unsetVoice: vi.fn(async () => {}),
    };
    grid.element = document.createElement("div");
    return grid as TestGrid;
  }

  it("passes the resolved pinned set (defaults ± the user's overlay) into renderMenu", async () => {
    getVoicesMock.mockResolvedValue([
      { id: "a", featured: true },
      { id: "b", featured: true },
      { id: "z" },
    ]);
    (chrome.storage.local as any)._setState({
      voicePins: { claude: { pinned: ["z"], unpinned: ["b"] } },
    });
    const grid = makeGrid();
    const renderSpy = vi
      .spyOn(grid as any, "renderMenu")
      .mockImplementation(() => {});

    await grid.refreshMenu();

    expect(renderSpy).toHaveBeenCalledTimes(1);
    // defaults {a,b} − unpinned {b} + pinned {z} = {a,z}
    expect(renderSpy.mock.calls[0][2]).toEqual(new Set(["a", "z"]));
  });

  it("passes null (keep the default shortlist) when the host has no pin overlay", async () => {
    getVoicesMock.mockResolvedValue([{ id: "a", featured: true }]);
    const grid = makeGrid();
    const renderSpy = vi
      .spyOn(grid as any, "renderMenu")
      .mockImplementation(() => {});

    await grid.refreshMenu();

    expect(renderSpy.mock.calls[0][2]).toBeNull();
  });
});
