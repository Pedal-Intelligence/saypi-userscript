import { describe, it, expect, beforeEach } from 'vitest';

// Mock chrome.storage.local for preference reads/writes
const store: Record<string, any> = {} as any;
// @ts-ignore
global.chrome = {
  storage: {
    sync: {
      get: (keys: string[] | Record<string, any>, cb: (res: Record<string, any>) => void) => {
        // No sync-stored values in this test environment; return empty
        cb({});
      }
    },
    local: {
      get: (keys: string[] | Record<string, any>, cb: (res: Record<string, any>) => void) => {
        if (Array.isArray(keys)) {
          const res: Record<string, any> = {};
          keys.forEach(k => res[k] = store[k]);
          cb(res);
        } else {
          cb(store);
        }
      },
      set: (obj: Record<string, any>, cb?: () => void) => { Object.assign(store, obj); cb && cb(); },
      remove: (k: string, cb?: () => void) => { delete store[k]; cb && cb(); }
    }
  },
  runtime: { lastError: null }
} as any;

import { UserPreferenceModule } from '../../src/prefs/PreferenceModule';

describe('Preference: autoReadAloudChatGPT', () => {
  beforeEach(() => {
    // Clear mock store
    for (const k of Object.keys(store)) delete store[k];
  });

  it('defaults to true when not set', async () => {
    const prefs = UserPreferenceModule.getInstance();
    const enabled = await prefs.getAutoReadAloudChatGPT();
    expect(enabled).toBe(true);
  });

  it('persists toggled value', async () => {
    const prefs = UserPreferenceModule.getInstance();
    await prefs.setAutoReadAloudChatGPT(false);
    const value = await prefs.getAutoReadAloudChatGPT();
    expect(value).toBe(false);
  });
});

