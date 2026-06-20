import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * #320 — Option A (last-tab-wins + clean handoff). The single offscreen document
 * holds ONE shared VAD instance and a single `currentVadTabId`. When a second tab
 * starts a call while a first tab's call is active, the second tab wins the (one)
 * mic and the first tab must be NOTIFIED (VAD_PREEMPTED) so it can cleanly exit —
 * not go silently dead. Critically, the displaced tab's own teardown must NOT tear
 * down the shared VAD instance the new owner is now using (owner-guarded stop/destroy).
 *
 * These tests pin the two pure decisions at L1 (the routing-overwrite contract and
 * the owner-guard safety contract) and verify they are actually wired into
 * startVAD / destroyVAD end-to-end.
 */

const { fakeVad, sendMessage } = vi.hoisted(() => {
  const sendMessage = vi.fn();
  (globalThis as any).chrome = {
    runtime: {
      getURL: (p: string) => `chrome-extension://test/${p}`,
      sendMessage,
    },
  };
  return {
    fakeVad: { start: vi.fn(), pause: vi.fn(), destroy: vi.fn() },
    sendMessage,
  };
});

vi.mock("@ricky0123/vad-web", () => ({
  MicVAD: { new: vi.fn(async () => fakeVad) },
}));
vi.mock("onnxruntime-web", () => ({ env: { logLevel: "error", wasm: {} } }));
vi.mock("../../src/LoggingModule.js", () => ({
  logger: { log: vi.fn(), debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn(), reportError: vi.fn() },
}));
vi.mock("../../src/offscreen/media_coordinator", () => ({
  incrementUsage: vi.fn(),
  decrementUsage: vi.fn(),
  resetUsageCounter: vi.fn(),
  registerMessageHandler: vi.fn(),
}));

import {
  computePreemption,
  isTeardownFromOwner,
  startVAD,
  stopVAD,
  destroyVAD,
} from "../../src/offscreen/vad_handler";

describe("#320 computePreemption (routing-overwrite contract)", () => {
  it("flags the PREVIOUS tab for preemption when a different tab takes over an active session", () => {
    expect(computePreemption(1, 2, true)).toEqual({ targetTabId: 1 });
  });

  it("does NOT preempt when the same tab re-starts (mid-call stop/start)", () => {
    expect(computePreemption(1, 1, true)).toBeNull();
  });

  it("does NOT preempt when there was no previous owner", () => {
    expect(computePreemption(null, 2, true)).toBeNull();
  });

  it("does NOT preempt when no VAD instance is active (nothing to take over)", () => {
    expect(computePreemption(1, 2, false)).toBeNull();
  });
});

describe("#320 isTeardownFromOwner (owner-guard safety contract)", () => {
  it("honors a teardown from the current owner", () => {
    expect(isTeardownFromOwner(2, 2)).toBe(true);
  });

  it("REJECTS a teardown from a non-owner (a preempted tab must not kill the new owner's mic)", () => {
    expect(isTeardownFromOwner(1, 2)).toBe(false);
  });

  it("honors a teardown when there is no current owner (no ambiguity — preserves legacy behavior)", () => {
    expect(isTeardownFromOwner(1, null)).toBe(true);
  });

  it("honors a teardown with no source tab id (legacy callers)", () => {
    expect(isTeardownFromOwner(undefined, 2)).toBe(true);
  });
});

describe("#320 vad_handler wiring: preemption + owner-guarded teardown", () => {
  beforeEach(() => {
    sendMessage.mockClear();
    fakeVad.start.mockClear();
    fakeVad.pause.mockClear();
    fakeVad.destroy.mockClear();
  });

  it("notifies the displaced tab on takeover, and a non-owner's stop/destroy does NOT tear down the shared VAD", async () => {
    // Tab 1 starts a call.
    await startVAD(1);

    // Tab 2 starts a call → it wins the shared mic; tab 1 must be notified.
    await startVAD(2);
    expect(sendMessage).toHaveBeenCalledWith({
      type: "VAD_PREEMPTED",
      targetTabId: 1,
      origin: "offscreen-document",
    });

    // Tab 1 (now displaced) tears down its call. Neither its stop nor its destroy
    // may touch the shared VAD instance that tab 2 (the new owner) is using — that
    // would silently break tab 2's call (the whole point of the owner-guard).
    await stopVAD(1);
    expect(fakeVad.pause).not.toHaveBeenCalled();
    destroyVAD(1);
    expect(fakeVad.destroy).not.toHaveBeenCalled();

    // The current owner (tab 2) can still tear down cleanly.
    destroyVAD(2);
    expect(fakeVad.destroy).toHaveBeenCalledTimes(1);
  });
});
