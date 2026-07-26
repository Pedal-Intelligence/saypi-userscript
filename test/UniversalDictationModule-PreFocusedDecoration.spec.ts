import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * Regression test for issue #558 (residual of #502): a field that is ALREADY the
 * focused element when it gets decorated never shows its dictation button.
 *
 * `checkInitialFocusState()` ran once, at `initialize()`. A field decorated later —
 * via the MutationObserver, which is exactly how Mistral Le Chat's ProseMirror
 * composer arrives (#502) — gets no further `focus` event if the host focused it
 * first, so neither visibility path fires and the button stays `display: none`
 * until the user clicks away and back.
 *
 * These tests drive the *real* module through the real MutationObserver, mirroring
 * UniversalDictationModule-RootNodeDecoration.spec.ts.
 */

const makeSvg = () =>
  document.createElementNS("http://www.w3.org/2000/svg", "svg") as SVGElement;

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

class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const flushMutations = () => new Promise((resolve) => setTimeout(resolve, 0));
const buttonDisplay = () =>
  (document.querySelector(".saypi-dictation-button") as HTMLElement | null)?.style.display;

describe("UniversalDictationModule — decoration of an already-focused field (issue #558)", () => {
  let module: UniversalDictationModule;

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = "";

    (global as any).ResizeObserver = NoopObserver;
    (global as any).IntersectionObserver = NoopObserver;
    (document as any).elementsFromPoint = () => [];

    (UniversalDictationModule as any).instance = undefined;
    module = UniversalDictationModule.getInstance();
  });

  afterEach(() => {
    module.destroy();
    (UniversalDictationModule as any).instance = undefined;
    document.body.innerHTML = "";
  });

  it("shows the button when a focused element BECOMES contenteditable after init (Mistral's mechanism)", async () => {
    const composer = document.createElement("div");
    composer.className = "ProseMirror";
    composer.tabIndex = 0; // jsdom needs an explicit focusable hook; contenteditable alone isn't one
    document.body.appendChild(composer);
    module.initialize();

    // ProseMirror turns the node into an editor and focuses it, in that order — the
    // focus event fires before we have a button to show, and never fires again.
    composer.setAttribute("contenteditable", "true");
    composer.focus();
    expect(document.activeElement).toBe(composer);

    await flushMutations();

    expect(document.querySelectorAll(".saypi-dictation-button").length).toBe(1);
    expect(buttonDisplay()).toBe("flex");
  });

  it("shows the button when an already-focused field is decorated on insertion", async () => {
    module.initialize();

    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    textarea.focus();
    expect(document.activeElement).toBe(textarea);

    await flushMutations();

    expect(buttonDisplay()).toBe("flex");
  });

  it("still covers the pre-existing focused field found by the initial scan", async () => {
    const input = document.createElement("input");
    input.type = "text";
    document.body.appendChild(input);
    input.focus();

    module.initialize();
    await flushMutations();

    expect(buttonDisplay()).toBe("flex");
  });

  it("leaves the button hidden for a field that is not focused", async () => {
    module.initialize();

    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);

    await flushMutations();

    expect(document.querySelectorAll(".saypi-dictation-button").length).toBe(1);
    expect(buttonDisplay()).toBe("none");
  });
});
