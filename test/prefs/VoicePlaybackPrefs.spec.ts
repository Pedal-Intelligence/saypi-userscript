import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

/**
 * #96 / #117 — the two new playback preferences must be wired through all five
 * sites a SayPi preference needs (caution map, cluster G): the local-storage
 * key list, the cache priming, the runtime-message listener, the
 * storage.onChanged listener, and the getter/cached-getter/setter trio.
 * Missing one of these fails silently: the setting saves but never reaches the
 * tab that is speaking.
 */
const store: Record<string, any> = {};
const messageListeners: Function[] = [];
const changeListeners: Function[] = [];

// @ts-ignore - a chrome mock with capturable listeners (the shared setup's
// listener mocks are vi.fn() no-ops, so nothing would be invokable).
global.chrome = {
  storage: {
    sync: {
      get: (_keys: any, cb: (res: Record<string, any>) => void) => cb({}),
      set: (_obj: any, cb?: () => void) => cb && cb(),
    },
    local: {
      get: (keys: string[] | Record<string, any>, cb: (res: Record<string, any>) => void) => {
        if (Array.isArray(keys)) {
          const res: Record<string, any> = {};
          keys.forEach((k) => (res[k] = store[k]));
          cb(res);
        } else {
          cb({ ...store });
        }
      },
      set: (obj: Record<string, any>, cb?: () => void) => {
        Object.assign(store, obj);
        cb && cb();
      },
      remove: (k: string, cb?: () => void) => {
        delete store[k];
        cb && cb();
      },
    },
    onChanged: {
      addListener: (fn: Function) => changeListeners.push(fn),
    },
  },
  runtime: {
    lastError: null,
    onMessage: { addListener: (fn: Function) => messageListeners.push(fn) },
  },
} as any;

import EventBus from "../../src/events/EventBus";
import { UserPreferenceModule } from "../../src/prefs/PreferenceModule";
import { DEFAULT_TTS_PLAYBACK_RATE } from "../../src/tts/playbackRate";
import { DEFAULT_TTS_VOLUME } from "../../src/tts/quietVolume";

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

async function prefsModule() {
  const prefs = UserPreferenceModule.getInstance();
  // The constructor registers its listeners after the storage migration settles.
  for (let i = 0; i < 5; i++) await flush();
  return prefs;
}

describe("voice playback preferences (#96 / #117)", () => {
  let events: any[];

  beforeEach(() => {
    for (const k of Object.keys(store)) delete store[k];
    events = [];
    EventBus.on("userPreferenceChanged", (detail: any) => events.push(detail));
  });

  afterEach(() => {
    EventBus.removeAllListeners("userPreferenceChanged");
  });

  it("defaults to 1.0x and full volume", async () => {
    const prefs = await prefsModule();

    expect(await prefs.getTtsPlaybackRate()).toBe(DEFAULT_TTS_PLAYBACK_RATE);
    expect(await prefs.getTtsVolume()).toBe(DEFAULT_TTS_VOLUME);
    expect(prefs.getCachedTtsPlaybackRate()).toBe(DEFAULT_TTS_PLAYBACK_RATE);
    expect(prefs.getCachedTtsVolume()).toBe(DEFAULT_TTS_VOLUME);
  });

  it("persists and caches a chosen speed and volume", async () => {
    const prefs = await prefsModule();

    await prefs.setTtsPlaybackRate(1.5);
    await prefs.setTtsVolume(40);

    expect(store.ttsPlaybackRate).toBe(1.5);
    expect(store.ttsVolume).toBe(40);
    expect(prefs.getCachedTtsPlaybackRate()).toBe(1.5);
    expect(prefs.getCachedTtsVolume()).toBe(40);
    expect(events).toContainEqual({ ttsPlaybackRate: 1.5 });
    expect(events).toContainEqual({ ttsVolume: 40 });
  });

  it("never lets a corrupt stored value reach the audio element", async () => {
    const prefs = await prefsModule();

    await prefs.setTtsPlaybackRate("very fast" as any);
    await prefs.setTtsVolume("loud" as any);

    expect(prefs.getCachedTtsPlaybackRate()).toBe(DEFAULT_TTS_PLAYBACK_RATE);
    expect(prefs.getCachedTtsVolume()).toBe(DEFAULT_TTS_VOLUME);
  });

  it("applies a change broadcast from the settings page to this tab", async () => {
    const prefs = await prefsModule();
    expect(messageListeners.length).toBeGreaterThan(0);

    for (const listener of messageListeners) {
      listener({ ttsPlaybackRate: 1.2, ttsVolume: 70 }, {}, () => {});
    }
    await flush();

    expect(prefs.getCachedTtsPlaybackRate()).toBe(1.2);
    expect(prefs.getCachedTtsVolume()).toBe(70);
    expect(store.ttsPlaybackRate).toBe(1.2);
    expect(store.ttsVolume).toBe(70);
    expect(events).toContainEqual({ ttsPlaybackRate: 1.2 });
    expect(events).toContainEqual({ ttsVolume: 70 });
  });

  it("syncs the cache when another context writes the preference (storage.onChanged)", async () => {
    const prefs = await prefsModule();
    expect(changeListeners.length).toBeGreaterThan(0);

    for (const listener of changeListeners) {
      listener({ ttsPlaybackRate: { newValue: 0.8 }, ttsVolume: { newValue: 30 } }, "local");
    }

    expect(prefs.getCachedTtsPlaybackRate()).toBe(0.8);
    expect(prefs.getCachedTtsVolume()).toBe(30);
    expect(events).toContainEqual({ ttsPlaybackRate: 0.8 });
    expect(events).toContainEqual({ ttsVolume: 30 });
  });

  // Kept last: it rebuilds the module registry to get a fresh singleton.
  it("primes its cache from storage at startup (a value written before this tab loaded)", async () => {
    vi.resetModules();
    store.ttsPlaybackRate = 1.4;
    store.ttsVolume = 55;

    const { UserPreferenceModule: Fresh } = await import("../../src/prefs/PreferenceModule");
    const prefs = Fresh.getInstance();
    for (let i = 0; i < 5; i++) await flush();

    expect(prefs.getCachedTtsPlaybackRate()).toBe(1.4);
    expect(prefs.getCachedTtsVolume()).toBe(55);
  });
});
