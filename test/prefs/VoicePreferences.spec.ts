import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SpeechSynthesisVoiceRemote } from '../../src/tts/SpeechModel';

const store: Record<string, any> = {};
let originalChrome: any;

// getVoice() resolves non-Pi voice ids through SpeechSynthesisModule; stub it
// so tests can make the lookup fail on demand (#456).
const speechSynthesisMock = vi.hoisted(() => ({
  getVoiceById: vi.fn(),
}));
vi.mock('../../src/tts/SpeechSynthesisModule', () => ({
  SpeechSynthesisModule: { getInstance: () => speechSynthesisMock },
}));

// getVoice() consults the auth state before treating a failed lookup as a
// deleted voice (#456).
const fakeAuth = vi.hoisted(() => ({ authenticated: false }));
vi.mock('../../src/JwtManager', () => {
  const fakeJwtManager = { isAuthenticated: () => fakeAuth.authenticated };
  return {
    JwtManager: class {},
    getJwtManagerSync: () => fakeJwtManager,
    getJwtManager: () => Promise.resolve(fakeJwtManager),
    default: () => Promise.resolve(fakeJwtManager),
  };
});

vi.mock('../../src/ConfigModule', () => ({
  config: { apiServerUrl: 'https://api.saypi.test', appServerUrl: 'https://app.saypi.test' },
}));

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

  // Save original chrome mock
  originalChrome = (globalThis as any).chrome;

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

  fakeAuth.authenticated = false;
  speechSynthesisMock.getVoiceById.mockReset();

  prefsModule = await import('../../src/prefs/PreferenceModule');
  // Allow async initialization to settle
  await new Promise((resolve) => setTimeout(resolve, 0));
});

afterEach(() => {
  // Restore original chrome mock instead of deleting
  (globalThis as any).chrome = originalChrome;
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

// While signed out, /voices returns [] (401 shape), so a failed voice lookup
// says nothing about whether the voice still exists on the user's account.
// Deleting the stored preference there would silently erase the user's chosen
// voice across a sign-out → sign-in cycle (#456).
describe('UserPreferenceModule voice preference across auth changes (#456)', () => {
  it('keeps the stored voice preference when the lookup fails while signed out', async () => {
    store.voicePreferences = { claude: 'custom-voice-abc' };
    fakeAuth.authenticated = false;
    speechSynthesisMock.getVoiceById.mockRejectedValue(
      new Error('Voice with id custom-voice-abc not found')
    );

    const prefs = prefsModule.UserPreferenceModule.getInstance();
    const voice = await prefs.getVoice('claude');

    expect(voice).toBeNull();
    expect(store.voicePreferences).toEqual({ claude: 'custom-voice-abc' });
  });

  it('still clears a genuinely missing voice preference while signed in', async () => {
    store.voicePreferences = { claude: 'deleted-voice' };
    fakeAuth.authenticated = true;
    speechSynthesisMock.getVoiceById.mockRejectedValue(
      new Error('Voice with id deleted-voice not found')
    );

    const prefs = prefsModule.UserPreferenceModule.getInstance();
    const voice = await prefs.getVoice('claude');

    expect(voice).toBeNull();
    expect(store.voicePreferences).toEqual({});
  });
});
