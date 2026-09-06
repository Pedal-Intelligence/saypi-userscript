import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * #96 / #117 — the offscreen playback path.
 *
 * The offscreen document holds ONE <audio> element shared by every tab
 * (caution map, cluster C), so the per-load playback settings that ride on
 * AUDIO_LOAD_REQUEST have to be applied defensively:
 *
 *  - the speed must be applied AFTER the src (the HTML media load algorithm
 *    resets `playbackRate` to `defaultPlaybackRate` on a new source), and
 *  - a load that carries NO speed must reset the element to 1.0x, or a tab
 *    that never asked for a custom speed inherits the last tab's.
 */
const { handlers, audioEl, writes, playSpy } = vi.hoisted(() => {
  (globalThis as any).chrome = {
    runtime: {
      getURL: (p: string) => `chrome-extension://test/${p}`,
      sendMessage: vi.fn(),
    },
  };

  // audio_handler self-initializes at import time and looks this element up by
  // id, so it must exist in the JSDOM before the module is imported.
  const audioEl = document.createElement("audio");
  audioEl.id = "saypi-audio-offscreen";
  document.body.appendChild(audioEl);

  const writes: string[] = [];
  const playSpy = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(audioEl, "play", { value: playSpy });
  Object.defineProperty(audioEl, "pause", { value: vi.fn() });
  Object.defineProperty(audioEl, "load", { value: vi.fn() });
  Object.defineProperty(audioEl, "ended", { value: false, writable: true });

  // Instrument the media properties: JSDOM implements no playback, and we need
  // both the write ORDER and the load algorithm's playbackRate reset.
  const state = { src: "", volume: 1, defaultPlaybackRate: 1, playbackRate: 1 };
  Object.defineProperty(audioEl, "src", {
    configurable: true,
    get: () => state.src,
    set: (value: string) => {
      state.src = value;
      audioEl.setAttribute("src", value);
      writes.push("src");
      state.playbackRate = state.defaultPlaybackRate; // media load algorithm
    },
  });
  for (const prop of ["volume", "defaultPlaybackRate", "playbackRate"] as const) {
    Object.defineProperty(audioEl, prop, {
      configurable: true,
      get: () => state[prop],
      set: (value: number) => {
        state[prop] = value;
        writes.push(prop);
      },
    });
  }

  const handlers = new Map<string, (message: any, sourceTabId: number) => any>();
  return { handlers, audioEl, writes, playSpy };
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

import "../../src/offscreen/audio_handler";

const load = (message: any, sourceTabId = 1) => {
  const handler = handlers.get("AUDIO_LOAD_REQUEST");
  expect(handler, "handler registered for AUDIO_LOAD_REQUEST").toBeDefined();
  return handler!(message, sourceTabId);
};

describe("offscreen AUDIO_LOAD_REQUEST playback settings", () => {
  beforeEach(() => {
    writes.length = 0;
    playSpy.mockClear();
    (audioEl as any).defaultPlaybackRate = 1;
    (audioEl as any).playbackRate = 1;
    (audioEl as any).volume = 1;
    writes.length = 0;
  });

  it("applies the requested speed, after the src", () => {
    load({ url: "https://example.com/a.mp3", autoPlay: false, playbackRate: 1.5 });

    expect((audioEl as any).playbackRate).toBe(1.5);
    expect((audioEl as any).defaultPlaybackRate).toBe(1.5);
    expect(writes.indexOf("src")).toBeLessThan(writes.indexOf("playbackRate"));
  });

  it("resets the shared element to 1.0x when a load omits the speed", () => {
    load({ url: "https://example.com/fast.mp3", autoPlay: false, playbackRate: 1.8 }, 1);
    expect((audioEl as any).playbackRate).toBe(1.8);

    // A second tab (or an older client) loads without asking for a speed.
    load({ url: "https://example.com/plain.mp3", autoPlay: false }, 2);

    expect((audioEl as any).playbackRate).toBe(1);
    expect((audioEl as any).defaultPlaybackRate).toBe(1);
  });

  it("still applies the quiet-mode volume it is sent (#437 regression)", () => {
    load({ url: "https://example.com/quiet.mp3", autoPlay: false, volume: 0.5 });

    expect((audioEl as any).volume).toBe(0.5);
  });

  it("leaves the volume alone when a load omits it", () => {
    load({ url: "https://example.com/quiet.mp3", autoPlay: false, volume: 0.5 });
    load({ url: "https://example.com/next.mp3", autoPlay: false });

    expect((audioEl as any).volume).toBe(0.5);
  });
});
