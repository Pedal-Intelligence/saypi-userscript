import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the heavy module-level dependencies so CallButton imports cleanly in jsdom.
vi.mock("../../src/i18n", () => ({
  default: (key: string, sub?: string) => (sub ? `${key}:${sub}` : key),
}));
vi.mock("../../src/AnimationModule", () => ({
  default: { startAnimation: vi.fn(), stopAnimation: vi.fn() },
}));
vi.mock("../../src/StateMachineService", () => ({ default: { actor: null } }));
vi.mock("../../src/buttons/GlowColorUpdater", () => ({
  GlowColorUpdater: class {
    updateGlowColor() {}
  },
}));

import { CallButton } from "../../src/buttons/CallButton";

/**
 * #593 — the call button must be in the DOM before createButton yields.
 *
 * createButton used to `await this.callInactive(button)` — a chrome.storage
 * round-trip for the user's nickname — BEFORE addChild(). That left a window in
 * which a create was in flight but `document.getElementById("saypi-callButton")`
 * still returned null, which is exactly the guard every recovery path wants to
 * use. Worse, if the await rejected (e.g. "Extension context invalidated") the
 * button was never inserted at all, and nobody was listening for the rejection.
 *
 * The nickname only refines the button's LABEL. The icon, the click handler and
 * the element itself do not depend on it, so none of them should wait for it.
 */
function buildCallButton(overrides: Record<string, any> = {}) {
  const cb: any = Object.create(CallButton.prototype);
  cb.sayPiActor = { send: vi.fn() };
  cb.segments = [];
  cb.currentSegment = null;
  cb.callIsActive = false;
  cb.element = null;
  cb.glowColorUpdater = { updateGlowColor: vi.fn() };
  cb.chatbot = {
    getName: () => "Pi",
    getID: () => "pi",
    getNickname: async () => "Pi",
    getExtraCallButtonClasses: () => [],
    ...overrides,
  };
  return cb;
}

describe("CallButton.createButton — synchronous mount (#593)", () => {
  let container: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = "";
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  it("attaches the button before awaiting the nickname", () => {
    // A nickname lookup that never settles — the pathological cold-start case.
    const cb = buildCallButton({ getNickname: () => new Promise<string>(() => {}) });

    void cb.createButton(container, 0);

    // No awaits here on purpose: the button must be in the document already.
    const button = document.getElementById("saypi-callButton");
    expect(button).not.toBeNull();
    expect(button!.isConnected).toBe(true);
    expect(container.contains(button)).toBe(true);
  });

  it("is clickable before the nickname resolves", () => {
    const cb = buildCallButton({ getNickname: () => new Promise<string>(() => {}) });

    void cb.createButton(container, 0);

    const button = document.getElementById("saypi-callButton") as HTMLButtonElement;
    button.click();
    expect(cb.sayPiActor.send).toHaveBeenCalledWith({ type: "saypi:call" });
  });

  it("refines the label once the nickname resolves", async () => {
    let resolveNickname: (value: string) => void = () => {};
    const cb = buildCallButton({
      getNickname: () => new Promise<string>((resolve) => { resolveNickname = resolve; }),
    });

    const created = cb.createButton(container, 0);
    const button = document.getElementById("saypi-callButton") as HTMLButtonElement;
    expect(button.getAttribute("aria-label")).toBe("callNotStarted:Pi");

    resolveNickname("Sunshine");
    await created;
    await Promise.resolve();

    expect(button.getAttribute("aria-label")).toBe("callNotStarted:Sunshine");
  });

  it("leaves exactly one connected button when the nickname lookup rejects", async () => {
    const cb = buildCallButton({
      getNickname: () => Promise.reject(new Error("Extension context invalidated")),
    });

    await expect(cb.createButton(container, 0)).resolves.toBeInstanceOf(HTMLButtonElement);

    const buttons = document.querySelectorAll("#saypi-callButton");
    expect(buttons.length).toBe(1);
    expect((buttons[0] as HTMLElement).isConnected).toBe(true);
    expect(buttons[0].querySelector("svg")).not.toBeNull();
  });
});
