import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the heavy module-level dependencies so CallButton imports cleanly in jsdom
// (mirrors CallButton-arc-rebuild.spec.ts).
vi.mock("../../src/i18n", () => ({ default: (key: string) => key }));
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
 * #460 — createButton assigns `this.element` before the (async) callInactive/
 * callActive render mounts the SVG. When the call button is (re)created during an
 * active flow — e.g. the bootstrap restore path re-inserting a button the host
 * re-render destroyed — state-machine transitions can invoke updateButtonSegments
 * inside that gap. That is a normal transient (createButton redraws the segments
 * right after the SVG mounts), not an error condition.
 */
describe("CallButton — updateButtonSegments before the SVG mounts (#460)", () => {
  let btn: HTMLButtonElement;
  let cb: any;

  beforeEach(() => {
    btn = document.createElement("button"); // no SVG inside yet
    document.body.appendChild(btn);
    cb = Object.create(CallButton.prototype);
    cb.element = btn;
    cb.sayPiActor = { send: vi.fn() };
    cb.segments = [];
    cb.currentSegment = null;
    cb.callIsActive = false;
    cb.glowColorUpdater = { updateGlowColor: vi.fn() };
    cb.chatbot = { getNickname: async () => "Pi", getID: () => "pi" };
  });

  it("returns quietly without logging a console error", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    cb.updateButtonSegments();

    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
