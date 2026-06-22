import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * #420 — The offscreen handler now attaches per-segment speech-probability stats to
 * VAD_SPEECH_END. The client must FORWARD them through its onSpeechEnd callback (they
 * were computed, put on the wire, then dropped at this boundary — the gap the issue
 * calls out). Verified here against a fake port.
 */

vi.mock("../../src/LoggingModule", () => ({
  logger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));
vi.mock("../../src/i18n", () => ({ default: (key: string) => key }));
vi.mock("../../src/offscreen/media_coordinator", () => ({
  sanitizeMessageForLogs: (m: any) => m,
}));
vi.mock("../../src/ui/VADStatusIndicator", () => ({
  VADStatusIndicator: class {
    updateStatus = vi.fn();
    hide = vi.fn();
    show = vi.fn();
    destroy = vi.fn();
  },
}));

import { OffscreenVADClient } from "../../src/vad/OffscreenVADClient";

describe("#420 OffscreenVADClient forwards admission stats", () => {
  let ports: any[];

  beforeEach(() => {
    ports = [];
    (global as any).chrome = {
      runtime: {
        connect: vi.fn(() => {
          const port = {
            onMessage: { addListener: vi.fn() },
            onDisconnect: { addListener: vi.fn() },
            postMessage: vi.fn(),
            disconnect: vi.fn(),
          };
          ports.push(port);
          return port;
        }),
      },
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
    delete (global as any).chrome;
  });

  const deliver = (message: any, portIndex = 0) => {
    const listener = ports[portIndex].onMessage.addListener.mock.calls[0][0];
    listener(message);
  };

  it("passes peakSpeechProb / meanSpeechProb / speechFrameCount to onSpeechEnd", () => {
    const client = new OffscreenVADClient();
    const onSpeechEnd = vi.fn();
    client.on("onSpeechEnd", onSpeechEnd);

    deliver({
      origin: "offscreen-document",
      type: "VAD_SPEECH_END",
      duration: 800,
      audioData: [0.1, -0.1, 0.2],
      frameCount: 3,
      captureTimestamp: 1000,
      confidence: 0.6,
      peakSpeechProb: 0.93,
      meanSpeechProb: 0.71,
      speechFrameCount: 12,
    });

    expect(onSpeechEnd).toHaveBeenCalledTimes(1);
    const data = onSpeechEnd.mock.calls[0][0];
    expect(data.peakSpeechProb).toBeCloseTo(0.93, 5);
    expect(data.meanSpeechProb).toBeCloseTo(0.71, 5);
    expect(data.speechFrameCount).toBe(12);
    // Existing fields still forwarded.
    expect(data.duration).toBe(800);
    expect(data.captureTimestamp).toBe(1000);
  });

  it("forwards admission-gate-drop detail through onVADMisfire (distinguishable from a library misfire)", () => {
    const client = new OffscreenVADClient();
    const onVADMisfire = vi.fn();
    client.on("onVADMisfire", onVADMisfire);

    deliver({
      origin: "offscreen-document",
      type: "VAD_MISFIRE",
      reason: "admission-gate:low-peak-confidence",
      peakSpeechProb: 0.41,
      meanSpeechProb: 0.39,
      speechFrameCount: 2,
    });

    expect(onVADMisfire).toHaveBeenCalledTimes(1);
    const info = onVADMisfire.mock.calls[0][0];
    expect(info.reason).toBe("admission-gate:low-peak-confidence");
    expect(info.peakSpeechProb).toBeCloseTo(0.41, 5);
    expect(info.speechFrameCount).toBe(2);
  });

  it("a plain library misfire forwards undefined gate detail", () => {
    const client = new OffscreenVADClient();
    const onVADMisfire = vi.fn();
    client.on("onVADMisfire", onVADMisfire);

    deliver({ origin: "offscreen-document", type: "VAD_MISFIRE" });

    expect(onVADMisfire).toHaveBeenCalledTimes(1);
    const info = onVADMisfire.mock.calls[0][0];
    expect(info.reason).toBeUndefined();
  });
});
