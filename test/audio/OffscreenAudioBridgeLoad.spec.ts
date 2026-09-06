import { describe, it, expect, beforeEach, vi } from "vitest";

/**
 * #96 / #117 — the offscreen playback path's client half.
 *
 * The bridge is the only sender of AUDIO_LOAD_REQUEST, and the offscreen
 * element is shared across tabs, so every load must carry this tab's resolved
 * volume AND speed rather than relying on whatever the element already has.
 */
const prefs = { quietMode: false, ttsVolume: 100, ttsPlaybackRate: 1 };

vi.mock("../../src/prefs/PreferenceModule", () => ({
  UserPreferenceModule: {
    getInstance: () => ({
      getCachedQuietMode: () => prefs.quietMode,
      getCachedTtsVolume: () => prefs.ttsVolume,
      getCachedTtsPlaybackRate: () => prefs.ttsPlaybackRate,
    }),
  },
}));

import OffscreenAudioBridge from "../../src/audio/OffscreenAudioBridge.js";

function bridge() {
  const instance: any = Object.create(OffscreenAudioBridge.prototype);
  instance.sent = [];
  instance._sendMessageToOffscreen = vi.fn((type: string, detail: any) => {
    instance.sent.push({ type, detail });
    return Promise.resolve(true);
  });
  return instance;
}

describe("OffscreenAudioBridge.loadAudio message contract", () => {
  beforeEach(() => {
    prefs.quietMode = false;
    prefs.ttsVolume = 100;
    prefs.ttsPlaybackRate = 1;
  });

  it("sends the user's resolved speed and volume with the load request", async () => {
    prefs.ttsPlaybackRate = 1.3;
    prefs.ttsVolume = 80;
    const instance = bridge();

    await instance.loadAudio("https://example.com/reply.mp3", true);

    expect(instance.sent).toHaveLength(1);
    expect(instance.sent[0].type).toBe("AUDIO_LOAD_REQUEST");
    expect(instance.sent[0].detail).toMatchObject({
      url: "https://example.com/reply.mp3",
      autoPlay: true,
      playbackRate: 1.3,
    });
    expect(instance.sent[0].detail.volume).toBeCloseTo(0.8, 10);
  });

  it("sends the 1.0x default and full volume when nothing is configured", async () => {
    const instance = bridge();

    await instance.loadAudio("https://example.com/reply.mp3", true);

    expect(instance.sent[0].detail.playbackRate).toBe(1);
    expect(instance.sent[0].detail.volume).toBe(1);
  });

  it("keeps quiet mode halving the chosen volume (#437)", async () => {
    prefs.quietMode = true;
    prefs.ttsVolume = 50;
    const instance = bridge();

    await instance.loadAudio("https://example.com/reply.mp3", true);

    expect(instance.sent[0].detail.volume).toBeCloseTo(0.25, 10);
  });
});
