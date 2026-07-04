# Voice Menu Row/Model Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the `VoiceSelector` base (src/tts/VoiceMenu.ts) and its host subclasses so a voice row is a first-class unit with positive classification, selection/pin state is derived from the stored preference (not recovered from the DOM), and there is one idempotent render path — making the next menu affordance (#483's ▶ on Pi, per-voice delete, etc.) a JSDOM-unit-testable afternoon instead of a real-host-verified half-day.

**Architecture:** Split the current three-jobs-in-one base into (1) a slim generic `VoiceSelector` (auth/preference wiring + a gather-then-render `refreshMenu`), (2) a new `GridVoiceSelector` layer owning the button-grid rendering for Pi's two surfaces (row factory, reconciler, host-row adoption, selection render), and (3) a tiny `VoiceMenuControls` taxonomy module (positive, exhaustive classification of every interactive element). `ClaudeVoiceMenu` migrates to the slim base contract (renderMenu receives the stored voice; the pin field and the read-selection-from-button-label fallback die) but its rendering is NOT redesigned. `VoiceCuration.ts` is untouched. No Preact — host-injected widgets stay imperative per doc/preact-component-conventions.md.

**Tech Stack:** TypeScript, Vitest + JSDOM (existing harness style: `vi.mock` for ConfigModule/JwtManager/i18n/EventBus/SpeechSynthesisModule; `Object.create(Proto)` to bypass heavy constructors).

**Worktree:** `.worktrees/voice-menu-row-refactor` (branch `refactor/voice-menu-rows`). ALL file paths below are relative to the worktree root — never edit the main checkout (memory: worktree-edit-path-trap).

---

## Design invariants this refactor must not drop (test-pinned)

1. **Current-voice-never-vanishes:** the stored voice always renders on a capped surface. Mechanism changes from async pin-recursion to passing the stored id into `curateShortlist` (which already pins current first) at every render.
2. **Never a silent swap / stale mark:** selection marks are a pure render of the stored preference. *Deliberate improvement:* when the stored voice is not visible in the menu, NO row is marked (today a stale row can keep its highlight).
3. **Deprecated grandfathering:** `curateShortlist`/`visibleCatalog` behavior unchanged (file untouched); assert through the render.
4. **Unknown elements are inert:** a nested ▶ (or any future control) is never adopted, never counted as a Pi voice, never given a select handler, never torn down by a re-render (#485, the ▶-deselects trap).
5. **Pi7/Pi8 extras survive re-renders; pins are not wiped** (the Patch A regression class).
6. **Door: exactly one, after the SayPi block, always present on surfaces that show it (#472).**
7. **Preserved quirks (behavior-preserving on purpose):** extras render with today's appearance (custom-voice class + flair, inserted at top); the uncapped Pi settings grid does not filter deprecated voices (pre-existing gap, not this refactor's job); `unmarkRowSelected` still wipes inline styles (`setAttribute("style","")`) exactly as today.

## Element taxonomy (the positive classification)

| Kind | Marker | Meaning |
|---|---|---|
| `custom-voice` | `.saypi-custom-voice` | SayPi catalog voice row (select target) |
| `restored-voice` | `.saypi-restored-voice` | default-flagged catalog voice row SayPi re-adds |
| `door` | `.saypi-more-voices` | "More voices" → settings catalog |
| `preview` | `.saypi-voice-preview` | ▶ free-sample playback (#482) |
| `host-voice` | `data-saypi-host-voice` | host-native button ADOPTED at the single adoption site |
| `unknown` | none of the above | **inert** — SayPi code never acts on it |

Adoption (the only place unmarked elements are touched): direct-child `<button>`s of a grid container classify as `unknown` → stamped `data-saypi-host-voice` + given the unset-voice click handler ONCE (the attribute doubles as the idempotence guard — fixes today's duplicate-listener-per-expand in `registerVoiceChangeHandler`).

CSS coupling to preserve: row roots keep `.saypi-voice-button` (`voices.scss` visibility rules key on it under `#saypi-voice-menu`), the door keeps `.saypi-more-voices`, ▶ keeps `.saypi-voice-preview`.

## Known deletions (collapse vestigial structure)

From `src/tts/VoiceMenu.ts`: `selectedVoiceButton`, `pinnedCustomVoiceId`, `isBuiltInVoiceButton`, `registerVoiceChangeHandler`, `markButtonAsSelectedVoice`/`unmarkButtonAsSelectedVoice` (move to grid as row helpers), the teardown half of `refreshMenu` (+ its 100 ms sleep), `addVoicesToSelector`, `populateVoices`, `populateDefaultVoices`, `populateCustomVoices`, `removeCustomVoiceRows`, `addMoreVoicesDoor`, `addVoiceButtonAdditionListener`/`handleButtonAddition` (move to grid, taxonomy-routed), `addMissingPiVoices` (folded into the grid render), `getCustomVoiceCap`/`showsMoreVoicesDoor` (move to grid).
From `src/chatbots/ClaudeVoiceMenu.ts`: the read-selection-from-button-label block, the async getVoice-else-repopulate fallback + pin writeback in `populateVoices`, all `pinnedCustomVoiceId` uses.
From `src/chatbots/PiVoiceMenu.ts`: `PiVoiceSettings.handleExistingVoiceButtons` (adoption in render covers it), the 3-call expand sequence.

---

### Task 0: Baseline — prove the worktree is green

**Files:** none (verification only)

- [ ] **Step 0.1: Install deps + run the voice-related suite in the worktree**

```bash
cd /Users/rosscado/SayPi/saypi-userscript/.worktrees/voice-menu-row-refactor
npm ci 2>&1 | tail -3
npx vitest run test/tts/ test/chatbots/ 2>&1 | tail -15
```
Expected: all existing specs PASS. Record the pass/test counts as the characterization baseline.

- [ ] **Step 0.2: Type-check baseline**

```bash
npx wxt prepare && npm run typecheck
```
Expected: exit 0 (`.wxt/` is tracked but `wxt prepare` regenerates safely in the worktree; do NOT `git add -A` — memory: worktree-wxt-is-tracked).

### Task 1: `VoiceMenuControls` taxonomy module (TDD)

**Files:**
- Create: `src/tts/VoiceMenuControls.ts`
- Test: `test/tts/VoiceMenuControls.spec.ts`

- [ ] **Step 1.1: Write the failing spec**

```ts
import { describe, it, expect } from "vitest";
import {
  classifyControl,
  markAdopted,
  HOST_VOICE_ATTR,
} from "../../src/tts/VoiceMenuControls";

function button(...classes: string[]): HTMLButtonElement {
  const b = document.createElement("button");
  b.classList.add(...classes);
  return b;
}

describe("VoiceMenuControls.classifyControl — positive, exhaustive taxonomy", () => {
  it("classifies each SayPi control kind by its positive marker", () => {
    expect(classifyControl(button("saypi-voice-button", "saypi-custom-voice"))).toBe("custom-voice");
    expect(classifyControl(button("saypi-voice-button", "saypi-restored-voice"))).toBe("restored-voice");
    expect(classifyControl(button("saypi-voice-button", "saypi-more-voices"))).toBe("door");
    expect(classifyControl(button("saypi-voice-preview"))).toBe("preview");
  });

  it("classifies an adopted host button as host-voice", () => {
    const b = button();
    markAdopted(b);
    expect(b.getAttribute(HOST_VOICE_ATTR)).toBe("true");
    expect(classifyControl(b)).toBe("host-voice");
  });

  it("returns unknown for anything unmarked — new elements are inert until opted in", () => {
    expect(classifyControl(button())).toBe("unknown");
    expect(classifyControl(button("some-host-class"))).toBe("unknown");
    expect(classifyControl(document.createElement("div"))).toBe("unknown");
  });

  it("gives the nested ▶ preview priority over row-level markers (a preview inside a marked row is still a preview)", () => {
    expect(classifyControl(button("saypi-voice-preview", "saypi-voice-button"))).toBe("preview");
  });
});
```

- [ ] **Step 1.2: Run to verify failure** — `npx vitest run test/tts/VoiceMenuControls.spec.ts` → FAIL (module not found).

- [ ] **Step 1.3: Implement**

```ts
/**
 * Positive, exhaustive classification of every interactive element SayPi's
 * voice menus may encounter. The old model classified by ABSENCE ("lacks
 * saypi-voice-button ⇒ built-in host voice"), which made every new element
 * guilty until proven innocent — a nested ▶ read as a host voice would unset
 * the user's voice on click (#483's blocker) and miscount Pi's native voices.
 * Here every kind is declared by a marker it CARRIES; `unknown` is inert.
 */
export type VoiceMenuControlKind =
  | "custom-voice"
  | "restored-voice"
  | "door"
  | "preview"
  | "host-voice"
  | "unknown";

/** Stamped at the single adoption site; doubles as the attached-once guard. */
export const HOST_VOICE_ATTR = "data-saypi-host-voice";

export function classifyControl(el: Element): VoiceMenuControlKind {
  if (el.classList.contains("saypi-voice-preview")) return "preview";
  if (el.classList.contains("saypi-more-voices")) return "door";
  if (el.classList.contains("saypi-custom-voice")) return "custom-voice";
  if (el.classList.contains("saypi-restored-voice")) return "restored-voice";
  if (el.hasAttribute(HOST_VOICE_ATTR)) return "host-voice";
  return "unknown";
}

export function markAdopted(el: Element): void {
  el.setAttribute(HOST_VOICE_ATTR, "true");
}
```

- [ ] **Step 1.4: Run to verify pass** — same command → PASS.
- [ ] **Step 1.5: Commit** — `git add src/tts/VoiceMenuControls.ts test/tts/VoiceMenuControls.spec.ts && git commit -m "refactor(voices): positive element taxonomy for voice-menu controls"`

### Task 2: `GridVoiceSelector` — row factory + idempotent reconciling render (TDD)

**Files:**
- Create: `src/tts/GridVoiceSelector.ts`
- Modify: `src/tts/VoiceMenu.ts` (slim the base; new `refreshMenu` contract)
- Test: `test/tts/GridVoiceSelector.spec.ts`

The base and grid change together (the grid needs the new abstract contract), so this task lands them as one commit with the new spec; existing-spec updates follow in Task 3.

- [ ] **Step 2.1: Write the failing GridVoiceSelector spec** (`test/tts/GridVoiceSelector.spec.ts`)

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../src/ConfigModule", () => ({
  config: { appServerUrl: "https://app.example.com", apiServerUrl: "https://api.saypi.ai",
    GA_MEASUREMENT_ID: "x", GA_API_SECRET: "x", GA_ENDPOINT: "x" },
}));
vi.mock("../../src/JwtManager", () => ({
  getJwtManagerSync: () => ({ isAuthenticated: () => true, getClaims: () => null }),
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
  getId() { return "test-grid"; }
  getButtonClasses() { return ["mb-1"]; }
  protected override getCustomVoiceCap() { return this.cap; }
}

const piCustoms = [
  new ElevenLabsVoice("ig1TeITnnNlsJtfHxJlW", "Paola"),
  new ElevenLabsVoice("bWJPewAagbymiJXZcxnh", "Joey"),
  new ElevenLabsVoice("paola-v3", "Paola", "F"),
  ...openAiMockVoices,
]; // 13 custom voices, tiers coexist

function extraVoice(id: string, name: string): SpeechSynthesisVoiceRemote {
  return new OpenAIVoice(id, name);
}

function makeGrid(opts: {
  stored?: SpeechSynthesisVoiceRemote | null;
  provider?: boolean;
  cap?: number | null;
} = {}): { grid: any; el: HTMLElement } {
  const grid: any = Object.create(TestGrid.prototype);
  grid.cap = opts.cap === undefined ? 5 : opts.cap;
  grid.chatbot = opts.provider
    ? { getID: () => "pi",
        getExtraVoices: () => [extraVoice("voice7", "Pi 7"), extraVoice("voice8", "Pi 8")],
        getVoiceIntroductionUrl: () => "https://pi.ai/intro.mp3" }
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

const rowsOf = (el: HTMLElement) => Array.from(el.querySelectorAll<HTMLElement>(".saypi-custom-voice"));
const idsOf = (el: HTMLElement) => rowsOf(el).map(r => r.dataset.voiceId);

beforeEach(() => { openSettingsMock.mockReset(); document.body.innerHTML = ""; });

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
    const shimmer = openAiMockVoices.find(v => v.name === "Shimmer")!;
    const { grid, el } = makeGrid({ stored: shimmer });
    grid.renderMenu(piCustoms, shimmer);          // no flushAsync, no recursion
    expect(idsOf(el)).toContain("shimmer");
    expect(rowsOf(el).length).toBe(5);
    expect((el.querySelector('[data-voice-id="shimmer"]') as HTMLButtonElement).disabled).toBe(true);
  });

  it("renders the stored voice's row selected and no other", () => {
    const coral = openAiMockVoices.find(v => v.name === "Coral")!;
    const { grid, el } = makeGrid({ stored: coral });
    grid.renderMenu(piCustoms, coral);
    const selected = el.querySelectorAll(".selected");
    expect(selected.length).toBe(1);
    expect((selected[0] as HTMLElement).dataset.voiceId).toBe("coral");
  });

  it("switching the stored voice on re-render moves the mark and un-hides the new voice (no stale mark, no vanish)", () => {
    const shimmer = openAiMockVoices.find(v => v.name === "Shimmer")!;
    const coral = openAiMockVoices.find(v => v.name === "Coral")!;
    const { grid, el } = makeGrid();
    grid.renderMenu(piCustoms, shimmer);
    grid.renderMenu(piCustoms, coral);
    expect(idsOf(el)).toContain("coral");
    expect(idsOf(el)).not.toContain("shimmer");   // stale pin gone, stateless
    const selected = el.querySelectorAll(".selected");
    expect(selected.length).toBe(1);
    expect((selected[0] as HTMLElement).dataset.voiceId).toBe("coral");
  });

  it("uncapped surfaces render the whole catalog with no tier badges", () => {
    const { grid, el } = makeGrid({ cap: null });
    grid.renderMenu(piCustoms, null);
    expect(rowsOf(el).length).toBe(piCustoms.length);
    expect(el.querySelector(".voice-tier")).toBeNull();
    expect(el.querySelector(".saypi-more-voices")).toBeNull(); // showsMoreVoicesDoor()=false at cap null
  });
});

describe("GridVoiceSelector — host-row adoption (positive classification)", () => {
  it("adopts pre-existing host buttons: marks them and wires unset-on-click exactly once across renders", async () => {
    const { grid, el } = makeGrid();
    const hostBtn = document.createElement("button");
    hostBtn.textContent = "Pi 1";
    el.appendChild(hostBtn);
    grid.renderMenu(piCustoms, null);
    grid.renderMenu(piCustoms, null);            // second render must not double-bind
    expect(hostBtn.getAttribute(HOST_VOICE_ATTR)).toBe("true");
    hostBtn.click();
    await new Promise(r => setTimeout(r, 0));
    expect(grid.userPreferences.unsetVoice).toHaveBeenCalledTimes(1);
    expect(hostBtn.classList.contains("selected")).toBe(true);
  });

  it("voice-off selection leaves host rows untouched but clears SayPi rows", () => {
    const coral = openAiMockVoices.find(v => v.name === "Coral")!;
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
    const shimmer = openAiMockVoices.find(v => v.name === "Shimmer")!;
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
    await new Promise(r => setTimeout(r, 0));
    expect(grid.userPreferences.unsetVoice).not.toHaveBeenCalled();
    expect(grid.userPreferences.setVoice).not.toHaveBeenCalled();
  });

  it("a DIRECT-CHILD ▶ (door-style SayPi control) is still not adopted — positive marks win over position", () => {
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
    await new Promise(r => setTimeout(r, 0));
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
```

- [ ] **Step 2.2: Run to verify failure** — `npx vitest run test/tts/GridVoiceSelector.spec.ts` → FAIL (module not found).

- [ ] **Step 2.3: Slim the base `src/tts/VoiceMenu.ts`**

Keep lines 1–146 (imports, `BuiltInVoiceProvider` + guard, class head, constructor, the two `register*Handler`s, `ttsRequiresSignIn`) with these changes, then REPLACE everything from `registerVoiceChangeHandler` (line 149) through `getPositionFromEnd` with the block below, keeping `introduceVoice` and `getPositionFromEnd` verbatim and keeping `parseSvgRoot`/`addSvgToButton` at the bottom. Remove now-unused imports (`getResourceUrl`, `openSettings`, `curateShortlist`, `getVoiceTier`) — `getMessage`, `getMostRecentAssistantMessage`, `SpeechSynthesisModule`, `EventBus`, `getJwtManagerSync` remain used.

```ts
export abstract class VoiceSelector {
  protected chatbot: Chatbot;
  protected userPreferences: UserPreferenceModule;
  protected element: HTMLElement;
  // (selectedVoiceButton and pinnedCustomVoiceId are GONE: selection/pin state
  // is derived from the stored preference at render time, never mirrored.)

  // constructor unchanged

  abstract getId(): string;
  abstract getButtonClasses(): string[];

  /**
   * THE single render path: given the fetched catalog + the stored voice,
   * make this selector's DOM reflect them. Must be idempotent — callable
   * repeatedly with the same inputs and converging on the same DOM.
   * Implementations: GridVoiceSelector (Pi's button grids), ClaudeVoiceMenu
   * (dropdown). Everything renders from state; nothing recovers state from
   * the DOM.
   */
  protected abstract renderMenu(
    voices: SpeechSynthesisVoiceRemote[],
    storedVoice: SpeechSynthesisVoiceRemote | null
  ): void;

  /**
   * Reflect an externally-changed stored voice on this surface without a
   * repopulate (and therefore without disturbing an open menu).
   */
  protected abstract applySelectedVoice(
    voice: SpeechSynthesisVoiceRemote | null
  ): void;

  /**
   * Gather-then-render: fetch the catalog and the stored voice TOGETHER, then
   * render once. Passing the stored voice into the render is what lets
   * curateShortlist pin the current voice synchronously — the old
   * render-then-detect-then-re-render pin recursion (and the pin field) died
   * with this. Also gone: the old teardown half, which fed a descendant
   * `querySelectorAll("button")` to direct-child-only `removeChild` — the
   * #485 crash. Renders reconcile; nothing bulk-removes buttons.
   */
  async refreshMenu(): Promise<void> {
    const speechSynthesis = SpeechSynthesisModule.getInstance();
    const [voices, storedVoice] = await Promise.all([
      speechSynthesis.getVoices(this.chatbot),
      this.userPreferences.getVoice(this.chatbot),
    ]);
    this.renderMenu(voices ?? [], storedVoice ?? null);
  }

  protected addIdVoiceMenu(element: HTMLElement): void {
    element.id = this.getId();
  }

  // ttsRequiresSignIn unchanged (already above)
  // introduceVoice unchanged (verbatim from current file)
  // getPositionFromEnd unchanged
}
```

In `registerAuthenticationChangeHandler`, replace the body's repopulate call:

```ts
      const voiceSelector = document.getElementById(this.getId());
      if (voiceSelector) {
        this.refreshMenu();
      }
```

`registerVoicePreferenceChangeHandler` is unchanged (it already routes through `applySelectedVoice`, now abstract).

- [ ] **Step 2.4: Create `src/tts/GridVoiceSelector.ts`**

```ts
import { getResourceUrl } from "../ResourceModule";
import getMessage from "../i18n";
import { openSettings } from "../popup/popupopener";
import { SpeechSynthesisVoiceRemote } from "./SpeechModel";
import { curateShortlist, getVoiceTier } from "./VoiceCuration";
import { VoiceSelector, isBuiltInVoiceProvider } from "./VoiceMenu";
import {
  classifyControl,
  markAdopted,
  HOST_VOICE_ATTR,
} from "./VoiceMenuControls";

/** Pi ships 8 native voices; below this we top up with account-gated extras. */
const HOST_NATIVE_VOICE_COUNT = 8;

/**
 * Button-grid voice surfaces (Pi's in-chat menu and Pi's settings grid): the
 * host owns the container (and re-creates it at will — Pi rebuilds its menu on
 * every expand), SayPi owns its rows within it. renderMenu is a
 * RECONCILIATION against that host-owned container, not a wipe-and-rebuild:
 * SayPi rows are inserted/moved/removed by id, host rows are adopted (marked +
 * wired) exactly once, and unknown elements are never touched (#485).
 *
 * A row is currently rendered as a single <button> (the row root IS the
 * select target). When a row grows a trailing affordance (#483's ▶), ONLY
 * createVoiceRow/createRestoredRow and selectTargetOf change — every other
 * consumer addresses rows via [data-voice-id] roots and the taxonomy.
 */
export abstract class GridVoiceSelector extends VoiceSelector {
  /**
   * Max SayPi (custom) voice rows this surface shows before tucking the rest
   * behind the "More voices" door. null = uncapped (Pi's settings grid).
   */
  protected getCustomVoiceCap(): number | null {
    return null;
  }

  /**
   * Whether this surface renders the "More voices" door. Capped surfaces
   * always do (it is the navigation path to the catalog, not an overflow
   * marker — #472); uncapped surfaces opt in (PiVoiceSettings).
   */
  protected showsMoreVoicesDoor(): boolean {
    return this.getCustomVoiceCap() !== null;
  }

  protected renderMenu(
    voices: SpeechSynthesisVoiceRemote[],
    storedVoice: SpeechSynthesisVoiceRemote | null
  ): void {
    const container = this.element;
    const defaults = voices.filter((voice) => voice.default);
    const customs = voices.filter((voice) => !voice.default);

    // 1. Adopt host-native rows (positive mark + unset handler, exactly once).
    this.adoptHostRows(container);

    // 2. SayPi catalog rows. The stored voice id goes straight into
    //    curateShortlist, whose first rule is current-voice-first — the
    //    "stored voice never vanishes" invariant, synchronously.
    const cap = this.getCustomVoiceCap();
    const curated =
      cap === null
        ? { voices: customs, hiddenCount: 0, tiersCoexist: false }
        : curateShortlist(customs, storedVoice?.id ?? null, cap);
    this.reconcileCustomRows(
      container,
      curated.voices,
      new Set(customs.map((voice) => voice.id)),
      curated.tiersCoexist
    );

    // 3. Default-flagged catalog voices render as restored rows at the end.
    this.renderRestoredRows(container, defaults);

    // 4. Pi's account-gated extras: top up when the host shows fewer native
    //    rows than its full set. Their ids are not in the SayPi catalog id
    //    set, so reconciliation never removes them (Pi 7/8 must survive).
    if (
      isBuiltInVoiceProvider(this.chatbot) &&
      this.countHostRows(container) < HOST_NATIVE_VOICE_COUNT
    ) {
      this.ensureExtraRows(
        container,
        this.chatbot.getExtraVoices(),
        curated.tiersCoexist
      );
    }

    // 5. The door.
    if (this.showsMoreVoicesDoor()) {
      this.ensureDoor(container);
    }

    // 6. Selection is a pure render of the stored preference.
    this.renderSelection(storedVoice);
  }

  /**
   * External voice change (settings page, another surface): re-mark rows from
   * the new value. If the voice's row is not visible (shortlist-hidden), no
   * row is marked — a deliberate improvement over the old stale-highlight —
   * and the next renderMenu shows it via curateShortlist's current-first rule.
   */
  protected applySelectedVoice(
    voice: SpeechSynthesisVoiceRemote | null
  ): void {
    this.renderSelection(voice);
  }

  // ---- rows -----------------------------------------------------------

  private rowFor(container: HTMLElement, voiceId: string): HTMLElement | null {
    return container.querySelector<HTMLElement>(
      `[data-voice-id="${voiceId}"]`
    );
  }

  private allRows(): HTMLElement[] {
    return Array.from(
      this.element.querySelectorAll<HTMLElement>(
        `.saypi-custom-voice, .saypi-restored-voice, [${HOST_VOICE_ATTR}]`
      )
    );
  }

  /**
   * The one seam that knows a row root is (today) the select button itself.
   * A wrapper-row future changes this to `row.querySelector("button.…")`.
   */
  private selectTargetOf(row: HTMLElement): HTMLButtonElement {
    return row as HTMLButtonElement;
  }

  /** SayPi catalog voice row. Today's exact DOM: button > name span [+ tier] + flair. */
  protected createVoiceRow(
    voice: SpeechSynthesisVoiceRemote,
    showTier: boolean
  ): HTMLElement {
    const row = document.createElement("button");
    row.type = "button";
    row.classList.add(
      ...this.getButtonClasses(),
      "saypi-voice-button",
      "saypi-custom-voice",
      voice.name.toLowerCase().replace(" ", "-")
    );
    const name = document.createElement("span");
    name.classList.add("voice-name");
    name.innerText = voice.name;
    row.appendChild(name);
    this.syncTierBadge(row, voice, showTier);
    const flair = document.createElement("img");
    flair.classList.add("flair");
    flair.src = getResourceUrl("icons/logos/saypi.png");
    flair.alt = "Say, Pi logo";
    flair.title = getMessage("enhancedVoice", ["Say, Pi"]);
    row.appendChild(flair);
    row.dataset.voiceId = voice.id;
    row.addEventListener("click", () => {
      this.userPreferences.setVoice(voice, this.chatbot).then(() => {
        console.log(`Selected voice: ${voice.name}`);
        this.renderSelection(voice);
        this.introduceVoice(voice);
      });
    });
    return row;
  }

  /** Default-flagged catalog voice re-added by SayPi (plain label, no flair). */
  protected createRestoredRow(voice: SpeechSynthesisVoiceRemote): HTMLElement {
    const row = document.createElement("button");
    row.type = "button";
    row.classList.add(
      ...this.getButtonClasses(),
      "saypi-voice-button",
      "saypi-restored-voice",
      voice.name.toLowerCase().replace(" ", "-")
    );
    row.innerText = voice.name;
    row.dataset.voiceId = voice.id;
    row.addEventListener("click", () => {
      this.userPreferences.setVoice(voice, this.chatbot).then(() => {
        console.log(`Selected voice: ${voice.name}`);
        this.renderSelection(voice);
        this.introduceVoice(voice);
      });
    });
    return row;
  }

  /** Quiet HD suffix, added or removed so re-renders converge (idempotence). */
  private syncTierBadge(
    row: HTMLElement,
    voice: SpeechSynthesisVoiceRemote,
    showTier: boolean
  ): void {
    const existing = row.querySelector(".voice-tier");
    const wanted = showTier && getVoiceTier(voice) === "hd";
    if (wanted && !existing) {
      const tier = document.createElement("span");
      tier.classList.add("voice-tier");
      tier.textContent = "HD";
      tier.title = getMessage("hdVoicesAllowanceNote");
      const name = row.querySelector(".voice-name");
      if (name) {
        name.insertAdjacentElement("afterend", tier);
      } else {
        row.appendChild(tier);
      }
    } else if (!wanted && existing) {
      existing.remove();
    }
  }

  // ---- reconciliation --------------------------------------------------

  /**
   * Make the SayPi catalog block match the plan: remove catalog rows that
   * fell out of it (scoped to this catalog's ids so extras and other
   * sources' rows survive), then walk the plan bottom-up inserting each row
   * at the top — existing rows are MOVED, not recreated, so DOM identity and
   * listeners survive; the result is plan order at the top of the container.
   */
  private reconcileCustomRows(
    container: HTMLElement,
    plan: SpeechSynthesisVoiceRemote[],
    catalogIds: Set<string>,
    showTier: boolean
  ): void {
    const planIds = new Set(plan.map((voice) => voice.id));
    Array.from(
      container.querySelectorAll<HTMLElement>(".saypi-custom-voice")
    ).forEach((row) => {
      const id = row.dataset.voiceId;
      if (id && catalogIds.has(id) && !planIds.has(id)) {
        row.remove();
      }
    });
    for (let i = plan.length - 1; i >= 0; i--) {
      const voice = plan[i];
      let row = this.rowFor(container, voice.id);
      if (row) {
        this.syncTierBadge(row, voice, showTier);
      } else {
        row = this.createVoiceRow(voice, showTier);
      }
      container.insertBefore(row, container.firstChild);
    }
  }

  private renderRestoredRows(
    container: HTMLElement,
    defaults: SpeechSynthesisVoiceRemote[]
  ): void {
    defaults.forEach((voice) => {
      const existing = this.rowFor(container, voice.id);
      if (existing) {
        container.appendChild(existing); // keep the block at the end (today's move-to-end)
        return;
      }
      container.appendChild(this.createRestoredRow(voice));
    });
  }

  /**
   * Account-gated extras render exactly like catalog rows (today's shipped
   * appearance: custom class + flair, inserted at the top) but are ensured
   * present rather than reconciled — the cap never applies to them.
   */
  private ensureExtraRows(
    container: HTMLElement,
    extras: SpeechSynthesisVoiceRemote[],
    showTier: boolean
  ): void {
    extras
      .slice()
      .reverse()
      .forEach((voice) => {
        if (!this.rowFor(container, voice.id)) {
          container.insertBefore(
            this.createVoiceRow(voice, showTier),
            container.firstChild
          );
        }
      });
  }

  /** Exactly one door, parked after the last SayPi row. Idempotent. */
  private ensureDoor(container: HTMLElement): void {
    let door = container.querySelector<HTMLButtonElement>(
      "button.saypi-more-voices"
    );
    if (!door) {
      door = document.createElement("button");
      door.type = "button";
      // saypi-voice-button keeps it under the menu's expand/collapse
      // visibility rules (voices.scss); saypi-more-voices classifies it as
      // the door (never a voice row).
      door.classList.add(
        ...this.getButtonClasses(),
        "saypi-voice-button",
        "saypi-more-voices"
      );
      door.textContent = getMessage("moreVoices");
      door.addEventListener("click", () => {
        openSettings("voices");
      });
    }
    const customRows = container.querySelectorAll(".saypi-custom-voice");
    const lastCustom = customRows[customRows.length - 1];
    if (lastCustom) {
      lastCustom.insertAdjacentElement("afterend", door);
    } else {
      container.appendChild(door);
    }
  }

  // ---- selection -------------------------------------------------------

  /**
   * Pure render of "which voice is selected" across every known row kind.
   * null (voice off / host default): SayPi rows are cleared; host rows keep
   * whatever state the host renders natively.
   */
  protected renderSelection(voice: SpeechSynthesisVoiceRemote | null): void {
    const rows = this.allRows();
    if (!voice) {
      rows
        .filter((row) => classifyControl(row) !== "host-voice")
        .forEach((row) => this.unmarkRowSelected(row));
      return;
    }
    rows.forEach((row) => this.unmarkRowSelected(row));
    const target = this.rowFor(this.element, voice.id);
    if (target) {
      this.markRowSelected(target);
    }
  }

  protected markRowSelected(row: HTMLElement): void {
    const button = this.selectTargetOf(row);
    button.disabled = true;
    button.classList.add("selected", "bg-neutral-300", "text-primary-700");
    button.classList.remove("hover:bg-neutral-300");
  }

  protected unmarkRowSelected(row: HTMLElement): void {
    const button = this.selectTargetOf(row);
    button.disabled = false;
    button.classList.remove("selected", "bg-neutral-300", "text-primary-700");
    button.classList.add("hover:bg-neutral-300", "border-neutral-500");
    button.setAttribute("style", ""); // strip inline styles from host/builtin buttons (settings page)
  }

  // ---- host adoption -----------------------------------------------------

  /**
   * THE single site that may act on unmarked elements: a direct-child
   * <button> classifying as "unknown" is a host-native voice row — stamp it
   * (positive from here on) and wire unset-voice. The stamp doubles as the
   * bound-once guard, so repeated renders (Pi re-expands) never double-bind.
   */
  private adoptHostRows(container: HTMLElement): void {
    Array.from(container.children).forEach((child) => {
      if (
        child instanceof HTMLButtonElement &&
        classifyControl(child) === "unknown"
      ) {
        this.adoptHostRow(child);
      }
    });
  }

  private adoptHostRow(button: HTMLButtonElement): void {
    markAdopted(button);
    button.addEventListener("click", () => {
      this.userPreferences.unsetVoice(this.chatbot).then(() => {
        this.allRows().forEach((row) => this.unmarkRowSelected(row));
        this.markRowSelected(button);
      });
    });
  }

  private countHostRows(container: HTMLElement): number {
    return container.querySelectorAll(`[${HOST_VOICE_ATTR}]`).length;
  }

  // ---- late host mutations ----------------------------------------------

  /**
   * Pi inserts its native voice buttons asynchronously; adopt them as they
   * arrive and re-render selection so a host row never shows selected while
   * a SayPi voice is stored. Additions of SayPi's own rows re-run the same
   * idempotent selection render (harmless).
   */
  addVoiceButtonAdditionListener(voiceMenu: HTMLElement): void {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type !== "childList") continue;
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLButtonElement) {
            this.handleRowAddition(node);
          }
        }
      }
    });
    observer.observe(voiceMenu, { childList: true });
  }

  protected handleRowAddition(button: HTMLButtonElement): void {
    if (
      button.parentElement === this.element &&
      classifyControl(button) === "unknown"
    ) {
      this.adoptHostRow(button);
    }
    this.userPreferences.getVoice(this.chatbot).then((voice) => {
      if (voice) {
        this.renderSelection(voice);
      }
    });
  }
}
```

- [ ] **Step 2.5: Run the new spec** — `npx vitest run test/tts/GridVoiceSelector.spec.ts test/tts/VoiceMenuControls.spec.ts` → PASS. (Other suites are expected red until Tasks 3–4; do not run the full suite yet.)

- [ ] **Step 2.6: Commit** — `git add src/tts/VoiceMenu.ts src/tts/GridVoiceSelector.ts test/tts/GridVoiceSelector.spec.ts && git commit -m "refactor(voices): slim VoiceSelector base + reconciling GridVoiceSelector"`

### Task 3: Rewire Pi surfaces + update the Pi/base specs

**Files:**
- Modify: `src/chatbots/PiVoiceMenu.ts`
- Modify: `test/chatbots/PiVoiceMenu-curation.spec.ts`, `test/chatbots/VoiceMenu-preference-sync.spec.ts`, `test/tts/VoiceMenu.spec.ts`, `test/tts/VoiceMenuRefresh.spec.ts`

- [ ] **Step 3.1: PiVoiceMenu / PiVoiceSettings**

`PiVoiceMenu extends GridVoiceSelector` (import from `../tts/GridVoiceSelector`; drop the `VoiceSelector` import). Constructor, `getId`, `getCustomVoiceCap`, `getButtonClasses`, `restyleVoiceMenuControls` unchanged. Replace the expand branch of `addVoiceMenuExpansionListener`'s observer callback:

```ts
            if (
              node instanceof HTMLElement &&
              node.nodeName === "BUTTON" &&
              node.getAttribute("aria-label") &&
              node === audioControlsContainer.firstChild
            ) {
              voiceMenu.classList.add("expanded");
              // Pi recreates its native menu on every expand: re-adopt the
              // fresh host rows and re-render SayPi's block from state. When
              // TTS is off we still adopt + top up Pi's extras (and the
              // door), just with no SayPi catalog rows.
              this.userPreferences.getTextToSpeechEnabled().then((enabled) => {
                if (enabled) {
                  this.refreshMenu();
                } else {
                  this.renderMenu([], null);
                }
              });
            }
```

`PiVoiceSettings extends GridVoiceSelector`; constructor becomes:

```ts
  constructor(
    chatbot: Chatbot,
    userPreferences: UserPreferenceModule,
    element: HTMLElement
  ) {
    super(chatbot, userPreferences, element);
    this.addIdVoiceMenu(element);
    // One gather-then-render covers what four calls did: catalog rows,
    // Pi top-ups, adoption of Pi's pre-existing buttons, and selection.
    this.refreshMenu();
  }
```

Delete `handleExistingVoiceButtons`. Remove the now-unused `SpeechSynthesisModule` import if nothing else uses it.

- [ ] **Step 3.2: Update `test/chatbots/PiVoiceMenu-curation.spec.ts`** — mechanical transform, invariants preserved:
  - `makeMenu(currentVoice)` keeps constructing via `Object.create(PiVoiceMenu.prototype)`; add `menu.introduceVoice = vi.fn();`.
  - Every `menu.populateVoices(voices, selector)` becomes `menu.element = selector; menu.renderMenu(voices, stored)` where `stored` is the voice previously wired through the `getVoice` mock (pass `null` where none). Drop the `flushAsync()` calls that existed only to let the pin recursion settle (keep any that flush click handlers).
  - The "keeps the pin when a partial built-ins-only populate runs" test becomes the extras-survival form: give `menu.chatbot = { getID: () => "pi", getExtraVoices: () => [voice7, voice8], getVoiceIntroductionUrl: () => "" }` and assert after `renderMenu(full, shimmer)` ×2 that ids contain `shimmer`, `voice7`, `voice8` (mirrors the GridVoiceSelector spec; keep it here as the Pi-surface regression pin).
  - The "clears a stale pin" test becomes: `renderMenu(full, shimmer)` then `renderMenu(full, coral)` on the same element → ids contain `coral`, not `shimmer` (stateless now, but keep as the regression tombstone).
- [ ] **Step 3.3: Update `test/chatbots/VoiceMenu-preference-sync.spec.ts`** — `makePiMenu` unchanged; `menu.populateVoices(piVoices, menu.element)` → `menu.renderMenu(piVoices, stored())` with `menu.cap`-irrelevant (PiVoiceMenu cap 5 > 2 voices). Claude half is updated in Task 4 (keep it failing until then if running file-by-file).
- [ ] **Step 3.4: Update `test/tts/VoiceMenu.spec.ts`** — `TestVoiceSelector` gains no-op `renderMenu`/`applySelectedVoice` implementations. The two `addMissingPiVoices` capability tests move onto a minimal `TestGrid extends GridVoiceSelector` (cap null): provider chatbot + `renderMenu([], null)` → `getExtraVoices` called; Claude-ish chatbot → a spy on `createVoiceRow` (or absence of `[data-voice-id="voice7"]`) shows no top-up. ClaudeVoiceMenu #268 tests unchanged.
- [ ] **Step 3.5: Rewrite `test/tts/VoiceMenuRefresh.spec.ts`** — the #485 invariant now lives structurally in the reconciler; replace the teardown-focused tests with: (a) base `refreshMenu()` on a `TestGrid` whose container holds a menuitem div + nested ▶ resolves without throwing and leaves the ▶ in place (`getVoices` mock returns `[]`); (b) a tombstone comment explaining the old crash and why bulk teardown no longer exists.
- [ ] **Step 3.6: Run** — `npx vitest run test/tts/ test/chatbots/PiVoiceMenu-curation.spec.ts test/chatbots/VoiceMenu-preference-sync.spec.ts` → all PASS except the Claude half of preference-sync (updated next task); if anything Pi-side fails, fix before proceeding.
- [ ] **Step 3.7: Commit** — `git add -u src test && git commit -m "refactor(voices): Pi surfaces render through GridVoiceSelector"` (explicit paths; never `git add -A` in a worktree).

### Task 4: Migrate ClaudeVoiceMenu to the slim contract

**Files:**
- Modify: `src/chatbots/ClaudeVoiceMenu.ts`
- Modify: `test/chatbots/ClaudeVoiceMenu-curation.spec.ts`, `test/chatbots/ClaudeVoiceMenu-preview.spec.ts`, `test/chatbots/ClaudeVoiceMenu-button-alignment.spec.ts`, `test/chatbots/VoiceMenu-preference-sync.spec.ts` (Claude half), `test/tts/VoiceMenu.spec.ts` (if signatures pinch)

- [ ] **Step 4.1: `populateVoices` → `renderMenu(voices, storedVoice)`**

Rename the override to `protected override renderMenu(voices: SpeechSynthesisVoiceRemote[], storedVoice: SpeechSynthesisVoiceRemote | null): void` (return type void). Inside:
  - DELETE the `currentSelectedVoice`-from-button-label block (lines reading `.voice-name` textContent) — `storedVoice` replaces it.
  - `curateShortlist(voices, storedVoice?.id ?? null, CLAUDE_MENU_CAP)` — the pin field read dies.
  - `this.menuButton = this.createVoiceButton(storedVoice, this.ttsRequiresSignIn(noVoicesAvailable))` — correct label on FIRST render, no off-then-update flash.
  - Replace the entire trailing `if (currentSelectedVoice) … else { getVoice().then(pin-writeback / conditional re-populate) }` block with one line: `this.updateSelectedVoice(storedVoice);`
  - Keep everything else (heuristics, cleanupExistingElements, voice-off item, shortlist items, footnote, door, separators) verbatim.
- [ ] **Step 4.2: `applySelectedVoice` override** shrinks to:

```ts
  protected override applySelectedVoice(
    voice: SpeechSynthesisVoiceRemote | null
  ): void {
    // Dropdown surface: reflect the change on the trigger + checkmarks. If
    // the shortlist is hiding the voice, no pin is needed — the menu re-renders
    // from refreshMenu() on every open, and curateShortlist puts the stored
    // voice first. Never tears the menu down, so safe while it is open.
    this.updateSelectedVoice(voice);
  }
```
- [ ] **Step 4.3: `initializeVoiceSelector`** — replace `speechSynthesis.getVoices(chatbot).then((voices) => { this.populateVoices(voices, this.element); … })` with `this.refreshMenu().then(() => { … })` keeping the click-outside listener + initialized-flag wiring inside the `.then`. Drop the now-unused `SpeechSynthesisModule` import and the `chatbot` parameter if unused. `toggleMenu` needs no change (already `this.refreshMenu().then(position)`; note the base no longer sleeps 100 ms — flag for the Layer-4 check).
- [ ] **Step 4.4: Update Claude specs** — read each; transform `menu.populateVoices(voices, el)` → `menu.renderMenu(voices, stored)` with the stored voice passed explicitly (was via `userPreferences.getVoice` mock + flush). `handleVoiceSelection`/`createMenuItem`/preview tests are signature-stable. Preference-sync Claude half: `menu.populateVoices(claudeMockVoices, menu.element)` → `menu.renderMenu(claudeMockVoices, stored())`.
- [ ] **Step 4.5: Run** — `npx vitest run test/tts/ test/chatbots/` → ALL PASS.
- [ ] **Step 4.6: Commit** — `git add -u src test && git commit -m "refactor(voices): ClaudeVoiceMenu renders from gathered state (pin + label-read fallback die)"`

### Task 5: Cross-surface invariant suite

**Files:**
- Create: `test/tts/VoiceMenuInvariants.spec.ts`

- [ ] **Step 5.1: Write the suite** (harness identical to GridVoiceSelector.spec; TestGrid cap 5). Cases — each with a one-line comment naming the shipped incident it pins:
  1. **Grandfathering:** a `deprecated: true` stored voice still renders + can be marked selected; a deprecated non-stored voice does not render.
  2. **Current-voice-never-vanishes across N re-renders** with shuffled catalog order.
  3. **No silent swap:** after `renderSelection(voiceA)` then external `applySelectedVoice(voiceB)`, exactly voiceB's row is marked; with voiceB hidden, NO row is marked (the deliberate stale-mark fix).
  4. **Door singularity + placement:** after 3 renders with varying stored voices, exactly one door, positioned after the last `.saypi-custom-voice`.
  5. **Adoption idempotence under the MutationObserver path:** simulate Pi re-adding a host button + `handleRowAddition` twice → one listener (unsetVoice called once per click).
  6. **Taxonomy completeness:** every interactive element the grid ever creates (`createVoiceRow`, `createRestoredRow`, door) classifies as non-`unknown` — guards "new row type forgot its marker" (walk `element.querySelectorAll("button")` after a full provider render; assert no `unknown`).
- [ ] **Step 5.2: Run + commit** — `npx vitest run test/tts/VoiceMenuInvariants.spec.ts` → PASS; `git add test/tts/VoiceMenuInvariants.spec.ts && git commit -m "test(voices): pin the voice-menu invariants (grandfathering, no-vanish, no-silent-swap, inert-unknowns)"`

### Task 6: Full gates

- [ ] **Step 6.1:** `npm test` (tsc + Jest + Vitest) in the worktree → exit 0. Fix any type fallout (likely: removed exports still imported somewhere — `grep -rn "isBuiltInVoiceButton\|addMissingPiVoices\|populateCustomVoices\|addVoicesToSelector" src test`).
- [ ] **Step 6.2:** Layer 3 E2E: `npm run e2e:build && npm run test:e2e` → green (content-script bootstrap untouched, but the suite is the required gate).
- [ ] **Step 6.3: Commit any fixups** — `git add -u && git commit -m "refactor(voices): fixups from full test gate"` (only if changes).

### Task 7: Layer-4 real-host look-check (the one this refactor earns)

Voice-menu code is reserve-zone (caution map cluster: host-DOM + billed TTS). Tests prove logic; only the real hosts prove pixels + host-recreated-DOM timing.

- [ ] **Step 7.1:** `node scripts/layer4cdp.mjs verify https://pi.ai` (headed real Chrome; loads the dev extension). Expect: clean voice turn, no console errors.
- [ ] **Step 7.2:** Pi menu probe via CDP: open the voice menu (click the audio-controls toggle), assert `#saypi-voice-menu.expanded` has SayPi rows + exactly one door + selected mark on the stored voice; screenshot. Then click a SayPi voice; reopen; assert the mark moved. Screenshot both states.
- [ ] **Step 7.3:** `node scripts/layer4cdp.mjs verify https://claude.ai` + probe: open the voice dropdown twice in a row (the rebuild-on-open path, #485's stage), assert rows + ▶ previews render, no `NotFoundError`/console errors; screenshot. Check the trigger label shows the stored voice immediately on page load (the label-fallback deletion).
- [ ] **Step 7.4:** If the founder's machine/browser is unavailable, stop and report exactly which checks ran and which are pending — do NOT claim real-host verification that didn't happen.

### Task 8: PR

- [ ] **Step 8.1:** Push branch, open PR titled `refactor(voices): row taxonomy + model-driven idempotent render for the voice menus`, body: the one-outcome framing (row as first-class unit), the five properties → where each landed, the two deliberate behavior changes (stale-mark clears; extras carry restored semantics in classification but today's appearance), the deleted-machinery list, and the Layer-4 evidence (screenshots). Reference #483 (unblocked), #485 (structural fix), the caution-map §6 refactor candidate.
- [ ] **Step 8.2:** Per memory `auto-merge-ready-prs`: enable auto-merge (squash) once CI is green.

---

## Self-review notes

- **Spec coverage:** row-as-unit → GridVoiceSelector row factory + `selectTargetOf` seam (Task 2); positive taxonomy → Task 1 + adoption site; state-model → gather-then-render `refreshMenu`, pin field deleted (Tasks 2–4); one idempotent render → `renderMenu` + reconciler (Task 2); host contract → base/grid split + Claude on slim base (Tasks 2, 4); tested invariants → Task 5. Scope exclusions honored: VoiceCuration untouched, Claude rendering not redesigned, no Preact.
- **Type consistency check:** `renderMenu(voices, storedVoice)` protected abstract on base; grid + Claude implement; Pi expansion listener calls `this.renderMenu([], null)` (protected-within-subclass OK); `refreshMenu(): Promise<void>` public (Claude `toggleMenu` + tests call it).
- **Known judgment calls (flag in PR):** extras keep custom-row appearance (pixels) while gaining reconciliation exemption via catalog-id scoping; `renderSelection(null)` leaves host rows alone; dropped 100 ms post-refresh sleep (watch Claude menu positioning at L4); stale-mark now clears when stored voice is hidden.
