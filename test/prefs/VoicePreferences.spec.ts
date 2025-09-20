import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SpeechSynthesisVoiceRemote } from '../../src/tts/SpeechModel';

const store: Record<string, any> = {};

const createPiVoice = (id: string, name: string): SpeechSynthesisVoiceRemote => ({
  id,
  name,
  lang: 'en-US',
  price: 0,
  price_per_thousand_chars_in_usd: 0,
  price_per_thousand_chars_in_credits: 0,
  powered_by: 'inflection.ai',
  default: false,
  localService: false,
  voiceURI: '',
});

let prefsModule: typeof import('../../src/prefs/PreferenceModule');
beforeEach(async () => {
  Object.keys(store).forEach((key) => delete store[key]);
  vi.resetModules();

  (globalThis as any).chrome = {
    storage: {
      sync: {
        get: (_keys: string[], cb: (res: Record<string, any>) => void) => cb({}),
      },
      local: {
        get: (keys: string[] | Record<string, any>, cb: (res: Record<string, any>) => void) => {
          if (Array.isArray(keys)) {
            const result: Record<string, any> = {};
            keys.forEach((key) => {
              if (key in store) {
                result[key] = store[key];
              }
            });
            cb(result);
          } else {
            cb(store);
          }
        },
        set: (items: Record<string, any>, cb?: () => void) => {
          Object.assign(store, items);
          cb?.();
        },
        remove: (key: string, cb?: () => void) => {
          delete store[key];
          cb?.();
        },
      },
    },
    runtime: { lastError: null },
  } as any;

  prefsModule = await import('../../src/prefs/PreferenceModule');
  // Allow async initialization to settle
  await new Promise((resolve) => setTimeout(resolve, 0));
});

afterEach(() => {
  delete (globalThis as any).chrome;
});

describe('UserPreferenceModule voice scoping', () => {
  it('scopes voice selections per chatbot', async () => {
    const prefs = prefsModule.UserPreferenceModule.getInstance();
    const claudeVoice = createPiVoice('voice1', 'Pi 1');

    await prefs.setVoice(claudeVoice, 'claude');

    expect(await prefs.hasVoice('claude')).toBe(true);
    expect(await prefs.hasVoice('chatgpt')).toBe(false);
    expect(store.voicePreferences).toEqual({ claude: 'voice1' });
  });

  it('maintains independent selections for each chatbot', async () => {
    const prefs = prefsModule.UserPreferenceModule.getInstance();
    const claudeVoice = createPiVoice('voice1', 'Pi 1');
    const chatgptVoice = createPiVoice('voice2', 'Pi 2');

    await prefs.setVoice(claudeVoice, 'claude');
    await prefs.setVoice(chatgptVoice, 'chatgpt');

    expect(await prefs.hasVoice('claude')).toBe(true);
    expect(await prefs.hasVoice('chatgpt')).toBe(true);
    expect(store.voicePreferences).toEqual({ claude: 'voice1', chatgpt: 'voice2' });

    await prefs.unsetVoice('chatgpt');

    expect(await prefs.hasVoice('chatgpt')).toBe(false);
    expect(store.voicePreferences).toEqual({ claude: 'voice1' });
  });
});
