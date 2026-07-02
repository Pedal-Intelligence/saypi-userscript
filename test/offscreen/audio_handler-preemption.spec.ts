import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * #452 — audio-side mirror of #320 (last-tab-wins + clean handoff). The single
 * offscreen document holds ONE shared <audio> element and a single
 * `currentAudioTabId`. When a second tab loads audio while a first tab's playback
 * is active, the second tab wins the (one) element and the first tab must be
 * NOTIFIED with a terminal AUDIO_ENDED so its AudioOutputMachine exits the
 * playing state instead of hanging. Critically, the displaced tab's own
 * pause/resume/stop requests must NOT control the audio the new owner is using,
 * nor decrement the shared usage counter (owner-guarded control requests).
 *
 * These tests pin the two pure decisions at L1 (the routing-overwrite contract
 * and the owner-guard safety contract) and verify they are actually wired into
 * the registered AUDIO_* message handlers end-to-end.
 */

const { sendMessage, handlers, audioEl, playSpy, pauseSpy } = vi.hoisted(() => {
  const sendMessage = vi.fn();
  (globalThis as any).chrome = {
    runtime: {
      getURL: (p: string) => `chrome-extension://test/${p}`,
      sendMessage,
    },
  };

  // audio_handler self-initializes at import time and looks this element up by
  // id, so it must exist in the JSDOM before the module is imported.
  const audioEl = document.createElement("audio");
  audioEl.id = "saypi-audio-offscreen";
  document.body.appendChild(audioEl);

  // JSDOM does not implement HTMLMediaElement playback — stub the methods the
  // handler calls (and spy on them so ownership guards are observable).
  const playSpy = vi.fn().mockResolvedValue(undefined);
  const pauseSpy = vi.fn();
  Object.defineProperty(audioEl, "play", { value: playSpy });
  Object.defineProperty(audioEl, "pause", { value: pauseSpy });
  Object.defineProperty(audioEl, "load", { value: vi.fn() });
  Object.defineProperty(audioEl, "currentTime", { value: 0, writable: true });
  Object.defineProperty(audioEl, "ended", { value: false, writable: true });

  const handlers = new Map<string, (message: any, sourceTabId: number) => any>();
  return { sendMessage, handlers, audioEl, playSpy, pauseSpy };
});

vi.mock("../../src/LoggingModule.js", () => ({
  logger: { log: vi.fn(), debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn(), reportError: vi.fn() },
}));
vi.mock("../../src/offscreen/media_coordinator", () => ({
  incrementUsage: vi.fn(),
  decrementUsage: vi.fn(),
  resetUsageCounter: vi.fn(),
  registerMessageHandler: vi.fn((type: string, handler: any) => handlers.set(type, handler)),
}));

import { decrementUsage } from "../../src/offscreen/media_coordinator";
import {
  computeAudioPreemption,
  isAudioRequestFromOwner,
} from "../../src/offscreen/audio_handler";

describe("#452 computeAudioPreemption (routing-overwrite contract)", () => {
  it("flags the PREVIOUS tab for preemption when a different tab takes over active playback", () => {
    expect(computeAudioPreemption(1, 2, true)).toEqual({ targetTabId: 1 });
  });

  it("does NOT preempt when the same tab re-loads audio (next utterance)", () => {
    expect(computeAudioPreemption(1, 1, true)).toBeNull();
  });

  it("does NOT preempt when there was no previous owner", () => {
    expect(computeAudioPreemption(null, 2, true)).toBeNull();
  });

  it("does NOT preempt when no playback is active (nothing to take over)", () => {
    expect(computeAudioPreemption(1, 2, false)).toBeNull();
  });
});

describe("#452 isAudioRequestFromOwner (owner-guard safety contract)", () => {
  it("honors a control request from the current owner", () => {
    expect(isAudioRequestFromOwner(2, 2)).toBe(true);
  });

  it("REJECTS a control request from a non-owner (a displaced tab must not control the new owner's audio)", () => {
    expect(isAudioRequestFromOwner(1, 2)).toBe(false);
  });

  it("honors a control request when there is no current owner (no ambiguity — preserves legacy behavior)", () => {
    expect(isAudioRequestFromOwner(1, null)).toBe(true);
  });

  it("honors a control request with no source tab id (legacy callers)", () => {
    expect(isAudioRequestFromOwner(undefined, 2)).toBe(true);
  });
});

describe("#452 audio_handler wiring: preemption notice + owner-guarded control", () => {
  const invoke = (type: string, message: any, sourceTabId: number) => {
    const handler = handlers.get(type);
    expect(handler, `handler registered for ${type}`).toBeDefined();
    return handler!(message, sourceTabId);
  };

  beforeEach(() => {
    sendMessage.mockClear();
    playSpy.mockClear();
    pauseSpy.mockClear();
    vi.mocked(decrementUsage).mockClear();
  });

  it("notifies the displaced tab with a terminal AUDIO_ENDED when another tab takes over", () => {
    // Tab 1 starts playback — no previous owner, so nobody to notify.
    invoke("AUDIO_LOAD_REQUEST", { url: "https://example.com/tab1.mp3" }, 1);
    expect(sendMessage).not.toHaveBeenCalled();

    // Tab 2 loads audio while tab 1's playback is active → last-tab-wins on the
    // single shared element; tab 1 must receive a terminal AUDIO_ENDED so its
    // output state machine exits the playing state instead of hanging.
    invoke("AUDIO_LOAD_REQUEST", { url: "https://example.com/tab2.mp3" }, 2);
    expect(sendMessage).toHaveBeenCalledWith({
      type: "AUDIO_ENDED",
      detail: { timestamp: expect.any(Number) },
      targetTabId: 1,
      origin: "offscreen-document",
    });
  });

  it("a non-owner's pause/resume/stop does NOT control the owner's audio or corrupt the usage counter", () => {
    // State carried from the previous test: tab 2 owns active playback.
    // Tab 1 (displaced) issues every control request — none may touch the shared
    // element the new owner is using, and stop must not decrement usage.
    invoke("AUDIO_PAUSE_REQUEST", {}, 1);
    expect(pauseSpy).not.toHaveBeenCalled();

    invoke("AUDIO_RESUME_REQUEST", {}, 1);
    invoke("AUDIO_PLAY_REQUEST", {}, 1); // URL-less play == resume
    expect(playSpy).not.toHaveBeenCalled();

    invoke("AUDIO_STOP_REQUEST", {}, 1);
    expect(pauseSpy).not.toHaveBeenCalled();
    expect(decrementUsage).not.toHaveBeenCalled();
    expect(audioEl.getAttribute("src")).toBe("https://example.com/tab2.mp3");

    // The current owner (tab 2) can still control its own audio.
    invoke("AUDIO_PAUSE_REQUEST", {}, 2);
    expect(pauseSpy).toHaveBeenCalledTimes(1);
    invoke("AUDIO_RESUME_REQUEST", {}, 2);
    expect(playSpy).toHaveBeenCalledTimes(1);
    invoke("AUDIO_STOP_REQUEST", {}, 2);
    expect(decrementUsage).toHaveBeenCalledWith("audio");
    expect(audioEl.getAttribute("src")).toBe("");
  });

  it("does NOT notify on a same-tab reload or when no playback is active", () => {
    // State carried from the previous test: tab 2 owns, playback stopped (src cleared).
    // Same tab loading the next utterance is the normal single-tab flow — silent.
    invoke("AUDIO_LOAD_REQUEST", { url: "https://example.com/tab2-next.mp3" }, 2);
    invoke("AUDIO_LOAD_REQUEST", { url: "https://example.com/tab2-again.mp3" }, 2);
    expect(sendMessage).not.toHaveBeenCalled();

    // Owner stops cleanly, then a new tab takes over idle audio — nothing to preempt.
    invoke("AUDIO_STOP_REQUEST", {}, 2);
    invoke("AUDIO_LOAD_REQUEST", { url: "https://example.com/tab3.mp3" }, 3);
    expect(sendMessage).not.toHaveBeenCalled();
  });
});
