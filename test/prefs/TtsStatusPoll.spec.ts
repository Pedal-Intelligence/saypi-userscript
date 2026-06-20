import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import EventBus from '../../src/events/EventBus';

// The vestigial "TTS beta paused" gate fired GET ${apiServerUrl}/status/tts from
// UserPreferenceModule's constructor (via reloadCache) on every content-script
// load (issue #325). The server can only ever report beta.status "active" or
// "unavailable" — never "paused" — so the gate was provably a no-op and the poll
// pure waste. These tests pin: (1) construction must not poll /status/tts, and
// (2) getTextToSpeechEnabled stays a pure function of the enableTTS preference.

// Mock the API client so we can observe (and would-be-record) any /status/tts call.
// vi.hoisted lets the mock fn exist before vi.mock's hoisted factory runs.
const { callApiMock } = vi.hoisted(() => ({
  callApiMock: vi.fn(() =>
    Promise.resolve(
      new Response(JSON.stringify({ beta: { status: 'active' } }), {
        headers: { 'content-type': 'application/json' },
      })
    )
  ),
}));
vi.mock('../../src/ApiClient', () => ({ callApi: callApiMock }));

// Mock chrome.storage.local/sync for preference reads/writes (synchronous callbacks).
// Include the runtime/storage listener surfaces the constructor touches so the test
// does not lean on a production guard to stay quiet.
const store: Record<string, any> = {} as any;
// @ts-ignore
global.chrome = {
  storage: {
    sync: {
      get: (_keys: any, cb: (res: Record<string, any>) => void) => cb({}),
    },
    local: {
      get: (keys: string[] | Record<string, any>, cb: (res: Record<string, any>) => void) => {
        if (Array.isArray(keys)) {
          const res: Record<string, any> = {};
          keys.forEach((k) => (res[k] = store[k]));
          cb(res);
        } else {
          cb(store);
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
    onChanged: { addListener: vi.fn(), removeListener: vi.fn() },
  },
  runtime: {
    lastError: null,
    onMessage: { addListener: vi.fn(), removeListener: vi.fn() },
  },
} as any;

import { UserPreferenceModule } from '../../src/prefs/PreferenceModule';

describe('TTS status poll (#325): no vestigial /status/tts on load', () => {
  let reloadCacheRan: boolean;
  const markReloadCacheRan = () => {
    reloadCacheRan = true;
  };

  beforeEach(() => {
    for (const k of Object.keys(store)) delete store[k];
    callApiMock.mockClear();
    reloadCacheRan = false;
    // reloadCache() emits userPreferenceChanged as it loads each cached pref; it is
    // also exactly where the removed poll used to fire. Observing this event proves
    // the constructor's async chain reached the poll site, so "no poll" is a real
    // assertion rather than a premature/vacuous one.
    EventBus.on('userPreferenceChanged', markReloadCacheRan);
    // Force the singleton constructor to re-run under observation.
    (UserPreferenceModule as any).instance = undefined;
  });

  afterEach(() => {
    EventBus.off('userPreferenceChanged', markReloadCacheRan);
  });

  it('does not poll /status/tts when the preference module is constructed', async () => {
    UserPreferenceModule.getInstance();

    // Positive control: wait until the constructor's reloadCache() actually ran
    // (so the absence of the poll below is meaningful, not a too-early read).
    await vi.waitFor(() => expect(reloadCacheRan).toBe(true));

    const polledUrls = callApiMock.mock.calls.map((c) => String((c as any[])[0]));
    expect(polledUrls.some((u) => u.includes('/status/tts'))).toBe(false);
  });

  it('getTextToSpeechEnabled reflects the enableTTS preference (no network gate)', async () => {
    const prefs = UserPreferenceModule.getInstance();
    await vi.waitFor(() => expect(reloadCacheRan).toBe(true));

    // Default: TTS enabled.
    expect(await prefs.getTextToSpeechEnabled()).toBe(true);

    // Disabling the preference disables TTS.
    await prefs.setEnableTTS(false);
    expect(await prefs.getTextToSpeechEnabled()).toBe(false);

    // And it never consulted /status/tts to decide.
    const polledUrls = callApiMock.mock.calls.map((c) => String((c as any[])[0]));
    expect(polledUrls.some((u) => u.includes('/status/tts'))).toBe(false);
  });
});
