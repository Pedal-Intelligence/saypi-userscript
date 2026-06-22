import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * #420 — The offscreen VAD handler now runs the admission gate at the cheapest
 * possible point: BEFORE serialising the audio across the offscreen→content IPC.
 *
 *  - A confident segment is forwarded as VAD_SPEECH_END carrying the new per-segment
 *    stats (peakSpeechProb / meanSpeechProb / speechFrameCount), so downstream
 *    observers and future calibration can see them.
 *  - A low-confidence segment (one that opened on a permissive preset but never
 *    cleared the 0.5 speech bar) is dropped as VAD_MISFIRE — the audio array is never
 *    even sent, which is the whole point of gating here rather than server-side.
 */

const { sendMessage, micVadNew } = vi.hoisted(() => {
  const sendMessage = vi.fn();
  (globalThis as any).chrome = {
    runtime: {
      getURL: (p: string) => `chrome-extension://test/${p}`,
      sendMessage,
    },
  };
  const fakeVad = { start: vi.fn(), pause: vi.fn(), destroy: vi.fn() };
  return {
    fakeVad,
    sendMessage,
    micVadNew: vi.fn(async (_opts?: any) => fakeVad),
  };
});

vi.mock("@ricky0123/vad-web", () => ({ MicVAD: { new: micVadNew } }));
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

import { startVAD, destroyVAD } from "../../src/offscreen/vad_handler";

/** Capture the callbacks vad_handler handed to MicVAD.new for the current instance. */
function activeCallbacks(): {
  onSpeechStart: () => void;
  onSpeechEnd: (audio: Float32Array) => void;
  onVADMisfire: () => void;
  onFrameProcessed: (p: { isSpeech: number; notSpeech: number }) => void;
} {
  const opts = micVadNew.mock.calls.at(-1)![0] as any;
  return opts;
}

const frame = (isSpeech: number) => ({ isSpeech, notSpeech: 1 - isSpeech });

function messagesOfType(type: string) {
  return sendMessage.mock.calls.map((c) => c[0]).filter((m) => m.type === type);
}

describe("#420 vad_handler admission gate", () => {
  beforeEach(async () => {
    destroyVAD(); // clear any instance from a prior test
    sendMessage.mockClear();
    micVadNew.mockClear();
    await startVAD(1);
    sendMessage.mockClear(); // drop start-time chatter; keep only the segment events
  });

  it("forwards a confident segment as VAD_SPEECH_END with per-segment stats", () => {
    const cb = activeCallbacks();
    cb.onFrameProcessed(frame(0.8)); // triggering frame
    cb.onSpeechStart();
    cb.onFrameProcessed(frame(0.95));
    cb.onFrameProcessed(frame(0.2)); // redemption-tail frame
    cb.onSpeechEnd(new Float32Array([0.1, -0.1, 0.2]));

    const speechEnds = messagesOfType("VAD_SPEECH_END");
    expect(speechEnds).toHaveLength(1);
    const msg = speechEnds[0];
    expect(msg.peakSpeechProb).toBeCloseTo(0.95, 5);
    expect(msg.speechFrameCount).toBe(2); // 0.8 + 0.95 clear 0.5; 0.2 does not
    expect(msg.meanSpeechProb).toBeCloseTo((0.8 + 0.95 + 0.2) / 3, 5);
    // No misfire for a real utterance.
    expect(messagesOfType("VAD_MISFIRE")).toHaveLength(0);
  });

  it("drops a low-confidence segment as VAD_MISFIRE without ever sending the audio", () => {
    const cb = activeCallbacks();
    // A segment that opened on a permissive preset but only ever reached 0.45.
    cb.onFrameProcessed(frame(0.42));
    cb.onSpeechStart();
    cb.onFrameProcessed(frame(0.45));
    cb.onFrameProcessed(frame(0.1));
    cb.onSpeechEnd(new Float32Array([0.1, -0.1, 0.2]));

    expect(messagesOfType("VAD_SPEECH_END")).toHaveLength(0); // audio never serialised
    const misfires = messagesOfType("VAD_MISFIRE");
    expect(misfires).toHaveLength(1);
    expect(misfires[0].reason).toMatch(/admission-gate/);
  });
});
