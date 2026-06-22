import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * #420 — The in-page VAD client (Firefox / mobile, no offscreen document) runs the
 * same admission gate as the offscreen handler, via the shared SegmentStatsTracker +
 * admitSegment. Confident segments forward their stats through onSpeechEnd; segments
 * that never clear the speech bar are dropped as a misfire (never uploaded).
 *
 * This is also the first unit coverage of OnscreenVADClient — it drives the callbacks
 * OnscreenVADClient hands to MicVAD.new directly.
 */

const { fakeVad, micVadNew } = vi.hoisted(() => {
  const fakeVad = { start: vi.fn(), pause: vi.fn(), destroy: vi.fn() };
  return { fakeVad, micVadNew: vi.fn(async (_opts?: any) => fakeVad) };
});

vi.mock("@ricky0123/vad-web", () => ({ MicVAD: { new: micVadNew } }));
vi.mock("../../src/LoggingModule", () => ({
  logger: { log: vi.fn(), debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn(), reportError: vi.fn() },
}));
vi.mock("../../src/i18n", () => ({ default: (key: string) => key }));
vi.mock("../../src/ui/VADStatusIndicator", () => ({
  VADStatusIndicator: class {
    updateStatus = vi.fn();
    hide = vi.fn();
    show = vi.fn();
    destroy = vi.fn();
  },
}));
vi.mock("../../src/UserAgentModule", () => ({
  getBrowserInfo: () => ({ name: "Chrome", isMobile: false }),
}));
vi.mock("../../src/chatbots/ChatbotIdentifier", () => ({
  ChatbotIdentifier: { identifyChatbot: () => "pi", isInDictationMode: () => false },
}));

import { OnscreenVADClient } from "../../src/vad/OnscreenVADClient";

const lastOptions = () => micVadNew.mock.calls.at(-1)![0] as any;
const frame = (isSpeech: number) => ({ isSpeech, notSpeech: 1 - isSpeech });

describe("#420 OnscreenVADClient admission gate + stat forwarding", () => {
  beforeEach(() => {
    (global as any).chrome = {
      runtime: { getURL: (p: string) => `chrome-extension://test/${p}` },
    };
    micVadNew.mockClear();
    fakeVad.start.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
    delete (global as any).chrome;
  });

  it("forwards peak/mean/speechFrameCount on a confident segment", async () => {
    const client = new OnscreenVADClient();
    await client.initialize({ preset: "balanced" });
    const opts = lastOptions();
    const onSpeechEnd = vi.fn();
    const onVADMisfire = vi.fn();
    client.on("onSpeechEnd", onSpeechEnd);
    client.on("onVADMisfire", onVADMisfire);

    opts.onFrameProcessed(frame(0.8)); // triggering frame
    opts.onSpeechStart();
    opts.onFrameProcessed(frame(0.95));
    opts.onFrameProcessed(frame(0.2)); // redemption tail
    opts.onSpeechEnd(new Float32Array([0.1, -0.1, 0.2]));

    expect(onVADMisfire).not.toHaveBeenCalled();
    expect(onSpeechEnd).toHaveBeenCalledTimes(1);
    const data = onSpeechEnd.mock.calls[0][0];
    expect(data.peakSpeechProb).toBeCloseTo(0.95, 5);
    expect(data.speechFrameCount).toBe(2); // 0.8 + 0.95 clear 0.4; 0.2 does not
    expect(data.meanSpeechProb).toBeCloseTo((0.8 + 0.95 + 0.2) / 3, 5);
  });

  it("drops a low-confidence segment as a misfire (no onSpeechEnd, no upload)", async () => {
    const client = new OnscreenVADClient();
    await client.initialize({ preset: "balanced" });
    const opts = lastOptions();
    const onSpeechEnd = vi.fn();
    const onVADMisfire = vi.fn();
    client.on("onSpeechEnd", onSpeechEnd);
    client.on("onVADMisfire", onVADMisfire);

    // balanced opens at 0.4; floor = 0.4 + 0.05 = 0.45. This blip peaks 0.42 — below it.
    opts.onFrameProcessed(frame(0.41));
    opts.onSpeechStart();
    opts.onFrameProcessed(frame(0.42));
    opts.onSpeechEnd(new Float32Array([0.1, -0.1]));

    expect(onSpeechEnd).not.toHaveBeenCalled();
    expect(onVADMisfire).toHaveBeenCalledTimes(1);
    // The misfire carries gate-drop detail so it's distinguishable from a library misfire.
    const info = onVADMisfire.mock.calls[0][0];
    expect(info.reason).toMatch(/admission-gate/);
    expect(info.peakSpeechProb).toBeCloseTo(0.42, 5);
  });
});
