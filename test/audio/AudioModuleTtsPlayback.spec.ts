// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";

/**
 * #96 / #117 — the in-page playback path.
 *
 * AudioModule.loadAudio is where SayPi's TTS reaches the page's <audio>
 * element (on pi.ai, the host's own element). It must apply the user's chosen
 * speed and volume, and it must do so AFTER assigning the src: the HTML media
 * load algorithm resets `playbackRate` to `defaultPlaybackRate` on a new
 * source, so the obvious ordering silently drops the setting.
 */
const prefs = {
  quietMode: false,
  ttsVolume: 100,
  ttsPlaybackRate: 1,
};

vi.mock("../../src/state-machines/AudioInputMachine", () => ({ audioInputMachine: {} }));
vi.mock("../../src/state-machines/VoiceConverter", () => ({ voiceConverterMachine: {} }));
vi.mock("../../src/state-machines/AudioRetryMachine", () => ({ machine: {} }));
vi.mock("../../src/chatbots/ChatbotService", () => ({ ChatbotService: {} }));
vi.mock("../../src/compat/BrowserCompatibilityModule", () => ({
  BrowserCompatibilityModule: { getInstance: () => ({ checkTTSCompatibility() {} }) },
}));
vi.mock("../../src/audio/OffscreenAudioBridge.js", () => ({ default: {} }));
vi.mock("../../src/prefs/PreferenceModule", () => ({
  UserPreferenceModule: {
    getInstance: () => ({
      getCachedQuietMode: () => prefs.quietMode,
      getCachedTtsVolume: () => prefs.ttsVolume,
      getCachedTtsPlaybackRate: () => prefs.ttsPlaybackRate,
    }),
  },
}));
vi.mock("../../src/tts/SpeechSynthesisModule", () => ({ SpeechSynthesisModule: {} }));
vi.mock("../../src/ConfigModule", () => ({ config: { apiServerUrl: "https://api.saypi.ai" } }));
vi.mock("../../src/chatbots/ChatbotIdentifier", () => ({
  ChatbotIdentifier: { isChatbotType: () => true, identifyChatbot: () => "pi", isInChatMode: () => false },
}));

import AudioModule from "../../src/audio/AudioModule.js";

/** A media element that emulates the load algorithm's playbackRate reset. */
function fakeAudioElement() {
  const state = { src: "", volume: 1, defaultPlaybackRate: 1, playbackRate: 1 };
  const writes: string[] = [];
  const element: any = {
    writes,
    preservesPitch: false,
    load: vi.fn(),
    play: vi.fn().mockResolvedValue(undefined),
    pause: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    currentSrc: "",
  };
  Object.defineProperty(element, "src", {
    get: () => state.src,
    set: (value: string) => {
      state.src = value;
      element.currentSrc = value;
      writes.push("src");
      state.playbackRate = state.defaultPlaybackRate;
    },
  });
  for (const prop of ["volume", "defaultPlaybackRate", "playbackRate"] as const) {
    Object.defineProperty(element, prop, {
      get: () => state[prop],
      set: (value: number) => {
        state[prop] = value;
        writes.push(prop);
      },
    });
  }
  return element;
}

function audioModule() {
  const audio: any = Object.create(AudioModule.prototype);
  Object.assign(audio, {
    useOffscreenAudio: false,
    pendingPlaybackController: null,
    cancelPendingPlayback() {},
  });
  return audio;
}

describe("AudioModule.loadAudio playback settings", () => {
  beforeEach(() => {
    prefs.quietMode = false;
    prefs.ttsVolume = 100;
    prefs.ttsPlaybackRate = 1;
  });

  it("applies the user's speed to the element, after the src", async () => {
    prefs.ttsPlaybackRate = 1.5;
    const element = fakeAudioElement();

    await audioModule().loadAudio(element, "https://example.com/reply.mp3", false);

    expect(element.playbackRate).toBe(1.5);
    expect(element.defaultPlaybackRate).toBe(1.5);
    expect(element.writes.indexOf("src")).toBeLessThan(
      element.writes.indexOf("playbackRate"),
    );
  });

  it("applies the user's volume", async () => {
    prefs.ttsVolume = 40;
    const element = fakeAudioElement();

    await audioModule().loadAudio(element, "https://example.com/reply.mp3", false);

    expect(element.volume).toBeCloseTo(0.4, 10);
  });

  it("keeps quiet mode halving whatever volume the user chose (#437)", async () => {
    prefs.ttsVolume = 60;
    prefs.quietMode = true;
    const element = fakeAudioElement();

    await audioModule().loadAudio(element, "https://example.com/reply.mp3", false);

    expect(element.volume).toBeCloseTo(0.3, 10);
  });

  it("plays at full volume and 1.0x with no preferences stored", async () => {
    const element = fakeAudioElement();

    await audioModule().loadAudio(element, "https://example.com/reply.mp3", false);

    expect(element.volume).toBe(1);
    expect(element.playbackRate).toBe(1);
    expect(element.preservesPitch).toBe(true);
  });
});
