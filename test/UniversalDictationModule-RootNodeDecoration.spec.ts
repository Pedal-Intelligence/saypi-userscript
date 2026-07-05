import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * Regression test for issue #502: on chat.mistral.ai the ProseMirror composer is
 * inserted into the DOM as a single, already-complete `[contenteditable="true"]`
 * root node (not nested inside a wrapper that itself gets added). The
 * MutationObserver hands that node straight to `findAndDecorateInputs()`, which
 * only ran `searchRoot.querySelectorAll(...)` — a query that by definition matches
 * *descendants* of `searchRoot`, never `searchRoot` itself. So a matching root
 * node was never decorated and no `.saypi-dictation-button` ever appeared.
 *
 * These tests drive the *real* module (not a re-implementation) through the real
 * MutationObserver so the decoration path exercised is production's.
 */

// Return real SVG nodes so createDictationButton's clone/setAttribute/appendChild work.
const makeSvg = () =>
  document.createElementNS("http://www.w3.org/2000/svg", "svg") as SVGElement;

// Mock the machine layer: this test only exercises the decoration path
// (findAndDecorateInputs → decorateInput → createDictationButton), never
// startDictation. Mocking it here also severs the heavy transitive import chain
// (DictationMachine → TranscriptionModule → StateMachineService → ThemeManager).
vi.mock("../src/state-machines/DictationMachine", () => ({
  createDictationMachine: vi.fn(),
}));

vi.mock("../src/events/EventBus.js", () => ({
  default: { emit: vi.fn(), on: vi.fn() },
}));

vi.mock("../src/icons/IconModule", () => ({
  IconModule: {
    bubbleBw: { cloneNode: vi.fn(() => makeSvg()) },
    bubble: vi.fn(() => makeSvg()),
  },
}));

vi.mock("../src/i18n", () => ({
  default: vi.fn((key: string) => `mocked-${key}`),
}));

import { UniversalDictationModule } from "../src/UniversalDictationModule";

// JSDOM lacks these; positionButton() uses them during decoration. Stub minimally
// so full decoration (including button creation) runs without throwing.
class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const flushMutations = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("UniversalDictationModule — root-node decoration (issue #502)", () => {
  let module: UniversalDictationModule;

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = "";

    (global as any).ResizeObserver = NoopObserver;
    (global as any).IntersectionObserver = NoopObserver;
    // isPositionOccupied() calls this; jsdom doesn't implement it.
    (document as any).elementsFromPoint = () => [];

    // Fresh singleton per test.
    (UniversalDictationModule as any).instance = undefined;
    module = UniversalDictationModule.getInstance();
    module.initialize(); // starts observing document.body + scans existing elements
  });

  afterEach(() => {
    module.destroy();
    (UniversalDictationModule as any).instance = undefined;
    document.body.innerHTML = "";
  });

  it("decorates a contenteditable composer inserted as a bare root node (Mistral Le Chat)", async () => {
    // Mirrors Mistral: the composer arrives as a single already-complete node,
    // added directly to <body> with no matching descendants of its own.
    const composer = document.createElement("div");
    composer.setAttribute("contenteditable", "true");
    composer.className = "ProseMirror";
    document.body.appendChild(composer);

    await flushMutations();

    expect(document.querySelectorAll(".saypi-dictation-button").length).toBe(1);
  });

  it("still decorates a field nested inside an added wrapper (descendant path unchanged)", async () => {
    const wrapper = document.createElement("div");
    const textarea = document.createElement("textarea");
    wrapper.appendChild(textarea);
    document.body.appendChild(wrapper);

    await flushMutations();

    expect(document.querySelectorAll(".saypi-dictation-button").length).toBe(1);
  });

  it("decorates an element that BECOMES contenteditable via an attribute mutation (Mistral's real mechanism)", async () => {
    // A Layer-4 DOM probe (3/3 runs) showed Mistral's ProseMirror composer div is
    // present early (no childList insertion) and gets contenteditable="true" set on
    // it later via an ATTRIBUTES mutation. A childList-only observer never re-checks
    // that node, so it's only decorated if it happened to be editable at the initial
    // scan — a race that leaves the button missing on the slow path (#502).
    const composer = document.createElement("div");
    composer.className = "ProseMirror";
    document.body.appendChild(composer); // not contenteditable yet
    await flushMutations();
    // Not decoratable while it lacks contenteditable="true".
    expect(document.querySelectorAll(".saypi-dictation-button").length).toBe(0);

    // ProseMirror turns the existing node into an editor.
    composer.setAttribute("contenteditable", "true");
    await flushMutations();

    expect(document.querySelectorAll(".saypi-dictation-button").length).toBe(1);
  });
});
