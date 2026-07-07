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

import { PiVoiceMenu } from "../../src/chatbots/PiVoiceMenu";

/**
 * A faithful fixture of pi.ai's CURRENT in-chat voice menu DOM (captured live via
 * Layer-4 CDP, 2026-07-04 — see #491). Pi lazily builds the whole popover on expand
 * and tears it down on collapse. The two shapes:
 *
 *   collapsed → a pill (`inline-flex … rounded-[100px]`) holding the on/off + toggle buttons.
 *   expanded  → a card (`… rounded-xl bg-secondary-default`) holding the voice list
 *               (`div.flex.flex-col.gap-1.pt-1` of `div.cursor-pointer` rows — NOT buttons)
 *               and a controls row that still carries the "Toggle voice menu" button.
 *
 * The door injector anchors on the stable "Toggle voice menu" aria-label → the
 * rounded-xl card → the flex-col-gap-1 list, so the fixture keeps those exact classes.
 */
function buildAudioControls(opts: { expanded: boolean }): HTMLElement {
  const ac = document.createElement("div");
  ac.className = "order-2 w-auto saypi-audio-controls";

  const wrapper = document.createElement("div");
  wrapper.className = "relative flex flex-col-reverse";
  ac.appendChild(wrapper);

  if (!opts.expanded) {
    // Collapsed: the pill. rounded-[100px], NOT rounded-xl.
    const pillOuter = document.createElement("div");
    pillOuter.className = "relative z-10 flex justify-end self-end";
    const pill = document.createElement("div");
    pill.className =
      "inline-flex h-9 min-h-9 items-stretch overflow-hidden rounded-[100px] bg-fill-default";
    pill.appendChild(iconButton("Turn voice off"));
    pill.appendChild(iconButton("Toggle voice menu"));
    pillOuter.appendChild(pill);
    wrapper.appendChild(pillOuter);
  } else {
    // Expanded: the card with the voice list + controls row.
    const card = document.createElement("div");
    card.className =
      "flex w-auto min-w-fit max-w-[200px] flex-col-reverse overflow-hidden rounded-xl bg-secondary-default";

    const listWrapper = document.createElement("div");
    listWrapper.className =
      "flex w-auto min-w-fit max-w-[200px] flex-col overflow-visible bg-transparent p-2";
    const list = document.createElement("div");
    list.className = "flex flex-col gap-1 pt-1";
    for (let i = 1; i <= 8; i++) {
      const row = document.createElement("div");
      row.className =
        "flex min-h-11 cursor-pointer items-center gap-2 rounded-[8px] p-2 transition-colors bg-menu-background text-text-secondary hover:bg-menu-bg-hover py-3 !bg-secondary-default";
      const span = document.createElement("span");
      span.className =
        "text-body-s min-h-px min-w-0 flex-[1_0_0] truncate text-left not-italic";
      span.textContent = `Pi ${i}`;
      row.appendChild(span);
      list.appendChild(row);
    }
    listWrapper.appendChild(list);
    card.appendChild(listWrapper);

    const controls = document.createElement("div");
    controls.className =
      "relative flex items-center justify-between overflow-visible bg-secondary-default p-2 self-stretch";
    controls.appendChild(iconButton("")); // "Voice on" button (no aria-label)
    controls.appendChild(iconButton("Toggle voice menu"));
    card.appendChild(controls);

    wrapper.appendChild(card);
  }

  // SayPi's fallback empty div, appended by findAndDecorateVoiceMenu (id set in ctor).
  const fallback = document.createElement("div");
  fallback.id = "saypi-voice-menu";
  ac.appendChild(fallback);

  return ac;
}

function iconButton(ariaLabel: string): HTMLButtonElement {
  const b = document.createElement("button");
  if (ariaLabel) b.setAttribute("aria-label", ariaLabel);
  const span = document.createElement("span");
  b.appendChild(span);
  return b;
}

// Object.create bypasses the heavy DOM-observer constructor; the door methods only
// read `this` for nothing (they take the audio-controls root explicitly).
function makeMenu(): any {
  const menu = Object.create(PiVoiceMenu.prototype);
  return menu;
}

function listOf(ac: HTMLElement): HTMLElement {
  return ac.querySelector(".rounded-xl .flex.flex-col.gap-1") as HTMLElement;
}

beforeEach(() => {
  openSettingsMock.mockReset();
  document.body.innerHTML = "";
});

describe("PiVoiceMenu — 'More voices' door in Pi's live in-chat menu (#491, door-first)", () => {
  it("injects the door into Pi's live voice list when the menu is expanded", () => {
    const menu = makeMenu();
    const ac = buildAudioControls({ expanded: true });
    document.body.appendChild(ac);

    menu.ensureMoreVoicesDoor(ac);

    const door = listOf(ac).querySelector(".saypi-more-voices");
    expect(door).not.toBeNull();
    // Appended at the end — after Pi's native rows (Pi 1..8, then More voices).
    expect(listOf(ac).lastElementChild).toBe(door);
    // Label renders (its text is the resolved `moreVoices` message; real i18n
    // returns the raw key under JSDOM, so assert a non-empty label, not exact copy).
    expect(
      (door as HTMLElement).querySelector("span")?.textContent?.length
    ).toBeGreaterThan(0);
  });

  it("does nothing when the menu is collapsed (no list to inject into)", () => {
    const menu = makeMenu();
    const ac = buildAudioControls({ expanded: false });
    document.body.appendChild(ac);

    expect(() => menu.ensureMoreVoicesDoor(ac)).not.toThrow();
    expect(ac.querySelector(".saypi-more-voices")).toBeNull();
  });

  it("is idempotent: repeated calls on the same open menu never duplicate the door", () => {
    const menu = makeMenu();
    const ac = buildAudioControls({ expanded: true });
    document.body.appendChild(ac);

    menu.ensureMoreVoicesDoor(ac);
    menu.ensureMoreVoicesDoor(ac);
    menu.ensureMoreVoicesDoor(ac);

    expect(ac.querySelectorAll(".saypi-more-voices").length).toBe(1);
  });

  it("clicking the door opens the extension's Voices settings", () => {
    const menu = makeMenu();
    const ac = buildAudioControls({ expanded: true });
    document.body.appendChild(ac);

    menu.ensureMoreVoicesDoor(ac);
    const door = ac.querySelector(".saypi-more-voices") as HTMLElement;
    door.click();

    expect(openSettingsMock).toHaveBeenCalledWith("voices/pi");
  });

  it("Enter/Space activate the door (it matches Pi's div-rows, so needs keyboard a11y)", () => {
    const menu = makeMenu();
    const ac = buildAudioControls({ expanded: true });
    document.body.appendChild(ac);

    menu.ensureMoreVoicesDoor(ac);
    const door = ac.querySelector(".saypi-more-voices") as HTMLElement;
    expect(door.getAttribute("role")).toBe("button");
    expect(door.tabIndex).toBe(0);
    // KeyboardEvent is on window (not a bare global) in this JSDOM env.
    door.dispatchEvent(
      new window.KeyboardEvent("keydown", { key: "Enter", bubbles: true })
    );

    expect(openSettingsMock).toHaveBeenCalledWith("voices/pi");
  });

  it("clones a native row's styling so it renders as a Pi-native option, not foreign chrome", () => {
    const menu = makeMenu();
    const ac = buildAudioControls({ expanded: true });
    document.body.appendChild(ac);

    const nativeRow = listOf(ac).firstElementChild as HTMLElement;
    menu.ensureMoreVoicesDoor(ac);
    const door = ac.querySelector(".saypi-more-voices") as HTMLElement;

    // Carries Pi's own row classes (already compiled by Pi → no arbitrary-Tailwind gap).
    expect(door.classList.contains("cursor-pointer")).toBe(true);
    expect(door.classList.contains("min-h-11")).toBe(true);
    // The label span mirrors the native span so text sizing matches.
    const span = door.querySelector("span") as HTMLElement;
    const nativeSpan = nativeRow.querySelector("span") as HTMLElement;
    expect(span.className).toBe(nativeSpan.className);
  });

  it("re-injects the door after Pi tears the menu down and rebuilds it (recreate-on-expand)", () => {
    const menu = makeMenu();
    // First expand.
    let ac = buildAudioControls({ expanded: true });
    document.body.appendChild(ac);
    menu.ensureMoreVoicesDoor(ac);
    expect(ac.querySelectorAll(".saypi-more-voices").length).toBe(1);

    // Collapse then re-expand: Pi rebuilds a fresh card+list with no SayPi door.
    document.body.innerHTML = "";
    ac = buildAudioControls({ expanded: true });
    document.body.appendChild(ac);
    expect(ac.querySelector(".saypi-more-voices")).toBeNull(); // fresh list, no door yet
    menu.ensureMoreVoicesDoor(ac);
    expect(ac.querySelectorAll(".saypi-more-voices").length).toBe(1);
  });
});
