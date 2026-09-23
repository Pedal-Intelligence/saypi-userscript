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
  // The VAD clients open the mic themselves (micStreamLifecycle); JSDOM has no getUserMedia.
  Object.defineProperty(globalThis.navigator, "mediaDevices", {
    configurable: true,
    value: { getUserMedia: vi.fn(async () => ({ getTracks: () => [] })) },
  });
  // ...and no AudioContext; the clients create one per VAD (micStreamLifecycle).
  (globalThis as any).AudioContext = class { close = async () => {}; };
  const fakeVad = { start: vi.fn(), pause: vi.fn(), destroy: vi.fn() };
  return { fakeVad, micVadNew: vi.fn(async (_opts?: any) => fakeVad) };
});

vi.mock("@ricky0123/vad-web", () => ({ MicVAD: { new: micVadNew } }));
vi.mock("../../src/LoggingModule", () => ({
  logger: { log: vi.fn(), debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn(), reportError: vi.fn() },
}));
vi.mock("../../src/i18n", () => ({ default: (key: string) => key }));
const { indicatorInstances } = vi.hoisted(() => ({ indicatorInstances: [] as any[] }));
vi.mock("../../src/ui/VADStatusIndicator", () => ({
  VADStatusIndicator: class {
    updateStatus = vi.fn();
    hide = vi.fn();
    show = vi.fn();
    destroy = vi.fn();
    constructor() {
      indicatorInstances.push(this);
    }
  },
}));
const { browser } = vi.hoisted(() => ({ browser: { firefox: false } }));
vi.mock("../../src/UserAgentModule", () => ({
  getBrowserInfo: () => ({ name: browser.firefox ? "Firefox" : "Chrome", isMobile: false }),
  isFirefox: () => browser.firefox,
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
    indicatorInstances.length = 0;
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

    // And it shows the distinct "too faint" status detail, not the misleading
    // "Non-speech audio detected" (the audio WAS speech-like, just below the bar).
    const indicator = indicatorInstances[0];
    expect(indicator.updateStatus).toHaveBeenCalledWith(
      "vadStatusMisfire",
      "vadDetailAudioTooFaint"
    );
  });
});

/**
 * #655 — the in-page client is the Firefox path, and vad-web 0.0.31 broke it twice over:
 *  - ORT 1.30 loads its `.mjs` glue with import(), which RequestInterceptor's fetch rewrite
 *    can't redirect, so the old `public/` asset base (a directory the build doesn't have)
 *    stopped being rescued. Assets must be addressed at the extension root.
 *  - vad-web ≥0.0.27 no longer falls back from AudioWorklet to ScriptProcessor when the
 *    worklet fails, which it always does in a Firefox content script. 0.0.24's silent
 *    fallback is what Firefox actually ran, so Firefox must now ask for ScriptProcessor.
 * The e2e-firefox smoke proves both in a real Firefox; these pin the options.
 */
describe("#655 OnscreenVADClient asset paths + audio processor", () => {
  beforeEach(() => {
    (global as any).chrome = {
      runtime: { getURL: (p: string) => `moz-extension://test/${p}` },
    };
    micVadNew.mockClear();
  });

  afterEach(() => {
    browser.firefox = false;
    delete (global as any).chrome;
  });

  it("loads the model, ORT and the worklet from the extension root, not public/", async () => {
    await new OnscreenVADClient().initialize({ preset: "balanced" });
    expect(lastOptions().baseAssetPath).toBe("moz-extension://test/");
    expect(lastOptions().onnxWASMBasePath).toBe("moz-extension://test/");
  });

  it("uses ScriptProcessor on Firefox, where the AudioWorklet can't run from a content script", async () => {
    browser.firefox = true;
    await new OnscreenVADClient().initialize({ preset: "balanced" });
    expect(lastOptions().processorType).toBe("ScriptProcessor");
  });

  it("runs ORT single-threaded, like the offscreen handler", async () => {
    await new OnscreenVADClient().initialize({ preset: "balanced" });
    const runtime = { env: { logLevel: "warning", wasm: { proxy: true, numThreads: 4 } } };
    lastOptions().ortConfig(runtime);
    expect(runtime.env.wasm).toEqual({ proxy: false, numThreads: 1 });
  });

  it("lets vad-web pick (AudioWorklet) in other in-page browsers", async () => {
    await new OnscreenVADClient().initialize({ preset: "balanced" });
    expect(lastOptions().processorType).toBe("auto");
  });
});
