import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the heavy module-level dependencies so CallButton imports cleanly in jsdom.
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
 * #203 — the countdown arc never renders. Root cause (confirmed via live DOM
 * monitoring on pi.ai): the call button's state subscription re-invokes the
 * render methods many times during a call, and each call tore down + rebuilt the
 * whole SVG — destroying #progress-ring (and the .active countdown animation
 * applied to it) before it could show. The fix makes a redundant SAME-state
 * render skip the SVG rebuild so the ring (and its countdown) persists.
 */
describe("CallButton — arc rebuild churn (#203)", () => {
  let btn: HTMLButtonElement;
  let cb: any;

  beforeEach(() => {
    btn = document.createElement("button");
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

  it("preserves the #progress-ring (and its .active countdown) across a redundant same-state render", () => {
    cb.callActive(btn);
    const ring1 = btn.querySelector("#progress-ring") as SVGElement | null;
    expect(ring1).toBeTruthy();

    // Simulate the countdown being activated on the ring.
    ring1!.classList.add("active");
    (ring1 as any).dataset.marker = "m1";

    // A redundant same-state render (the churn that wiped the arc).
    cb.callActive(btn);

    const ring2 = btn.querySelector("#progress-ring") as SVGElement | null;
    expect(ring2).toBe(ring1); // same element, not recreated
    expect(ring2!.classList.contains("active")).toBe(true); // countdown survives
    expect((ring2 as any).dataset.marker).toBe("m1");
  });

  it("still rebuilds the SVG on a genuine state change (active -> inactive)", async () => {
    cb.callActive(btn);
    expect(btn.querySelector("#progress-ring")).toBeTruthy();
    expect(btn.dataset.callState).toBe("active");

    await cb.callInactive(btn);

    expect(btn.dataset.callState).toBe("inactive");
    // call.svg (inactive icon) has no progress ring.
    expect(btn.querySelector("#progress-ring")).toBeFalsy();
  });
});
