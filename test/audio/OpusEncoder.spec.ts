import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * Capability-probe tests for the native-WebCodecs Opus encoder (#414).
 *
 * JSDOM has no WebCodecs, so we drive the probe with a stubbed global
 * `AudioEncoder`/`AudioData`. The real encode (producing a valid WebM/Opus the
 * server can decode) needs a real browser and is covered at Layer 3.
 *
 * Each test re-imports the module (`vi.resetModules`) so the module-level
 * capability cache starts fresh.
 */
describe("OpusEncoder — WebCodecs capability probe (#414)", () => {
  const g = globalThis as any;
  const originalAudioEncoder = g.AudioEncoder;
  const originalAudioData = g.AudioData;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    g.AudioEncoder = originalAudioEncoder;
    g.AudioData = originalAudioData;
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("reports unsupported when WebCodecs AudioEncoder is absent (JSDOM / Firefox <130)", async () => {
    delete g.AudioEncoder;
    delete g.AudioData;
    const { isOpusUploadSupported } = await import("../../src/audio/OpusEncoder");
    expect(await isOpusUploadSupported()).toBe(false);
  });

  it("reports supported when isConfigSupported approves the opus config", async () => {
    const isConfigSupported = vi.fn().mockResolvedValue({ supported: true, config: {} });
    g.AudioEncoder = { isConfigSupported };
    g.AudioData = function () {};
    const { isOpusUploadSupported } = await import("../../src/audio/OpusEncoder");
    expect(await isOpusUploadSupported()).toBe(true);
    expect(isConfigSupported).toHaveBeenCalledWith(
      expect.objectContaining({ codec: "opus", sampleRate: 16000, numberOfChannels: 1 })
    );
  });

  it("reports unsupported when the opus config is rejected", async () => {
    g.AudioEncoder = { isConfigSupported: vi.fn().mockResolvedValue({ supported: false }) };
    g.AudioData = function () {};
    const { isOpusUploadSupported } = await import("../../src/audio/OpusEncoder");
    expect(await isOpusUploadSupported()).toBe(false);
  });

  it("caches the probe result rather than re-probing on every clip", async () => {
    const isConfigSupported = vi.fn().mockResolvedValue({ supported: true });
    g.AudioEncoder = { isConfigSupported };
    g.AudioData = function () {};
    const { isOpusUploadSupported } = await import("../../src/audio/OpusEncoder");
    await isOpusUploadSupported();
    await isOpusUploadSupported();
    await isOpusUploadSupported();
    expect(isConfigSupported).toHaveBeenCalledTimes(1);
  });

  it("treats a throwing capability probe as unsupported", async () => {
    g.AudioEncoder = { isConfigSupported: vi.fn().mockRejectedValue(new Error("boom")) };
    g.AudioData = function () {};
    const { isOpusUploadSupported } = await import("../../src/audio/OpusEncoder");
    expect(await isOpusUploadSupported()).toBe(false);
  });

  it("encodeToOpusWebM rejects when WebCodecs Opus is unavailable", async () => {
    delete g.AudioEncoder;
    delete g.AudioData;
    const { encodeToOpusWebM } = await import("../../src/audio/OpusEncoder");
    await expect(encodeToOpusWebM(new Float32Array([0, 0.1, -0.1]))).rejects.toThrow();
  });

  it("encodeToOpusWebM rejects on timeout if the codec stalls (never resolves, never errors)", async () => {
    vi.useFakeTimers();
    g.AudioEncoder = class {
      static isConfigSupported = vi.fn().mockResolvedValue({ supported: true });
      configure() {}
      encode() {}
      flush() {
        return new Promise<void>(() => {}); // never settles, never fires error()
      }
      close() {}
    };
    g.AudioData = class {
      close() {}
    };
    const { encodeToOpusWebM } = await import("../../src/audio/OpusEncoder");
    const p = encodeToOpusWebM(new Float32Array([0.1, 0.2, 0.3]));
    p.catch(() => {}); // avoid an unhandled rejection while advancing timers
    await vi.advanceTimersByTimeAsync(5001);
    await expect(p).rejects.toThrow(/timed out/);
  });
});
