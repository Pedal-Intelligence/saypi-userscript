import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * #655 — vad-web 0.0.27 moved mic ownership and audio-graph setup into the library's first
 * `start()`: `pause()` stops the mic tracks, `start()` re-runs getUserMedia, and a failure
 * while building the graph leaves the library stuck in "initializing" (later starts resolve
 * as if they worked; `destroy()` throws before releasing anything). These tests pin the
 * contract that keeps vad-web 0.0.24's behaviour: we open the mic and the AudioContext at
 * initialize, build the graph there (one start→pause), hold the mic across pause/resume,
 * release everything on destroy or failure, and carry the preset on START so a re-created
 * offscreen document doesn't fall back to library defaults.
 */

const { micVadNew, fakeVad, track, getUserMedia, contexts } = vi.hoisted(() => {
  (globalThis as any).chrome = {
    runtime: { getURL: (p: string) => `chrome-extension://test/${p}`, sendMessage: vi.fn() },
  };
  const track = { stop: vi.fn() };
  const micStream = { getTracks: () => [track] };
  const getUserMedia = vi.fn(async (_constraints?: MediaStreamConstraints) => micStream);
  Object.defineProperty(globalThis.navigator, "mediaDevices", {
    configurable: true,
    value: { getUserMedia },
  });
  const contexts: Array<{ close: ReturnType<typeof vi.fn> }> = [];
  (globalThis as any).AudioContext = class {
    close = vi.fn(async () => {});
    constructor() {
      contexts.push(this);
    }
  };
  const fakeVad = { start: vi.fn(async () => {}), pause: vi.fn(async () => {}), destroy: vi.fn(async () => {}) };
  return { micVadNew: vi.fn(async (_opts?: any) => fakeVad), fakeVad, track, getUserMedia, contexts };
});

vi.mock("@ricky0123/vad-web", () => ({ MicVAD: { new: micVadNew } }));
vi.mock("../../src/LoggingModule.js", () => ({
  logger: { log: vi.fn(), debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn(), reportError: vi.fn() },
}));
vi.mock("../../src/offscreen/media_coordinator", () => ({
  incrementUsage: vi.fn(),
  decrementUsage: vi.fn(),
  resetUsageCounter: vi.fn(),
  registerMessageHandler: vi.fn(),
}));

import { startVAD, stopVAD, destroyVAD } from "../../src/offscreen/vad_handler";

const lastOptions = () => micVadNew.mock.calls.at(-1)![0] as any;

describe("#655 offscreen VAD owns its mic + AudioContext and builds the graph at initialize", () => {
  beforeEach(() => {
    destroyVAD();
    vi.clearAllMocks();
    contexts.length = 0;
  });

  it("opens the mic (vad-web's constraints) and an AudioContext, and hands both to MicVAD", async () => {
    await startVAD(1);

    expect(getUserMedia).toHaveBeenCalledTimes(1);
    expect(getUserMedia.mock.calls[0][0]).toEqual({
      audio: { channelCount: 1, echoCancellation: true, autoGainControl: true, noiseSuppression: true },
    });
    const opts = lastOptions();
    expect(opts.startOnLoad).toBe(false);
    expect(opts.audioContext).toBe(contexts[0]);
    const stream = await opts.getStream();
    expect(await opts.resumeStream(stream)).toBe(stream);
  });

  it("builds the audio graph at initialize: start→pause before the real start", async () => {
    await startVAD(1);

    const calls = [...fakeVad.start.mock.invocationCallOrder.map((n) => [n, "start"]),
      ...fakeVad.pause.mock.invocationCallOrder.map((n) => [n, "pause"])]
      .sort((a, b) => (a[0] as number) - (b[0] as number))
      .map((c) => c[1]);
    expect(calls).toEqual(["start", "pause", "start"]);
  });

  it("keeps the mic open across pause/resume and releases mic + context only on destroy", async () => {
    await startVAD(1);
    const opts = lastOptions();

    await opts.pauseStream(await opts.getStream());
    await stopVAD(1);
    expect(track.stop).not.toHaveBeenCalled();
    expect(contexts[0].close).not.toHaveBeenCalled();

    destroyVAD(1);
    expect(track.stop).toHaveBeenCalledTimes(1);
    expect(contexts[0].close).toHaveBeenCalledTimes(1);
    expect(fakeVad.destroy).toHaveBeenCalledTimes(1);
  });

  it("reports a failure to build the audio graph at initialize, and releases everything", async () => {
    fakeVad.start.mockRejectedValueOnce(new Error("worklet blocked"));

    const result = await startVAD(1);

    expect(result).toMatchObject({ success: false, error: "worklet blocked" });
    expect(fakeVad.destroy).toHaveBeenCalledTimes(1);
    expect(track.stop).toHaveBeenCalledTimes(1);
    expect(contexts[0].close).toHaveBeenCalledTimes(1);
  });

  it("drops an instance whose start failed, so the next start builds a fresh one", async () => {
    fakeVad.start
      .mockResolvedValueOnce(undefined) // warm-up start
      .mockRejectedValueOnce(new Error("start failed")); // the real start

    expect((await startVAD(1)).success).toBe(false);
    expect(track.stop).toHaveBeenCalledTimes(1);

    expect((await startVAD(1)).success).toBe(true);
    expect(micVadNew).toHaveBeenCalledTimes(2);
  });

  it("releases the mic if the model fails to load", async () => {
    micVadNew.mockRejectedValueOnce(new Error("model failed to load"));

    const result = await startVAD(1);

    expect(result.success).toBe(false);
    expect(track.stop).toHaveBeenCalledTimes(1);
    expect(contexts[0].close).toHaveBeenCalledTimes(1);
  });

  it("builds a re-created VAD with the preset carried on START, and falls back to balanced", async () => {
    await startVAD(1, { preset: "highSensitivity" });
    expect(lastOptions()).toMatchObject({ positiveSpeechThreshold: 0.35, redemptionMs: 384 });

    destroyVAD(1);
    await startVAD(1);
    expect(lastOptions()).toMatchObject({ positiveSpeechThreshold: 0.4, redemptionMs: 320 });
  });
});
