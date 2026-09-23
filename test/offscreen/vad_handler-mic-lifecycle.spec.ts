import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * #655 — vad-web 0.0.27 moved mic ownership into the library: `pause()` stops the mic
 * tracks, `start()` re-runs getUserMedia, and `new()` starts listening unless told not to.
 * The conversation pauses the VAD every time the assistant speaks, so taking that default
 * would re-open the mic every turn (first-word clipping, indicator flicker, and possible
 * Firefox re-prompts). These tests pin the contract that keeps vad-web 0.0.24's behaviour:
 * we open the mic once at initialize, hold it across pause/resume, and release it on destroy.
 */

const { micVadNew, fakeVad, track, getUserMedia } = vi.hoisted(() => {
  const sendMessage = vi.fn();
  (globalThis as any).chrome = {
    runtime: { getURL: (p: string) => `chrome-extension://test/${p}`, sendMessage },
  };
  const track = { stop: vi.fn() };
  const micStream = { getTracks: () => [track] };
  const getUserMedia = vi.fn(async (_constraints?: MediaStreamConstraints) => micStream);
  Object.defineProperty(globalThis.navigator, "mediaDevices", {
    configurable: true,
    value: { getUserMedia },
  });
  const fakeVad = { start: vi.fn(async () => {}), pause: vi.fn(async () => {}), destroy: vi.fn(async () => {}) };
  return { micVadNew: vi.fn(async (_opts?: any) => fakeVad), fakeVad, track, getUserMedia };
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

describe("#655 offscreen VAD holds one mic stream for its lifetime", () => {
  beforeEach(() => {
    destroyVAD();
    vi.clearAllMocks();
  });

  it("opens the mic itself, with vad-web's constraints, and hands that stream to MicVAD", async () => {
    await startVAD(1);

    expect(getUserMedia).toHaveBeenCalledTimes(1);
    expect(getUserMedia.mock.calls[0][0]).toEqual({
      audio: { channelCount: 1, echoCancellation: true, autoGainControl: true, noiseSuppression: true },
    });
    const opts = lastOptions();
    expect(opts.startOnLoad).toBe(false);
    const stream = await opts.getStream();
    expect(await opts.resumeStream(stream)).toBe(stream);
  });

  it("keeps the mic open across pause/resume and releases it only on destroy", async () => {
    await startVAD(1);
    const opts = lastOptions();

    await opts.pauseStream(await opts.getStream());
    await stopVAD(1);
    expect(track.stop).not.toHaveBeenCalled();

    destroyVAD(1);
    expect(track.stop).toHaveBeenCalledTimes(1);
    expect(fakeVad.destroy).toHaveBeenCalledTimes(1);
  });

  it("awaits start(), so a failure building the audio graph is reported, not left unhandled", async () => {
    fakeVad.start.mockRejectedValueOnce(new Error("worklet blocked"));

    const result = await startVAD(1);

    expect(result).toMatchObject({ success: false, error: "worklet blocked" });
  });

  it("releases the mic if initialization fails after it was opened", async () => {
    micVadNew.mockRejectedValueOnce(new Error("model failed to load"));

    const result = await startVAD(1);

    expect(result.success).toBe(false);
    expect(track.stop).toHaveBeenCalledTimes(1);
  });
});
