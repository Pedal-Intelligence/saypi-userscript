import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SpeechSynthesisVoiceRemote } from '../../src/tts/SpeechModel';
import { VOICE_DEFAULT_PENDING_KEY } from '../../src/onboarding/voiceDefaults';

const store: Record<string, any> = {};
let originalChrome: any;

// getVoice() resolves non-Pi voice ids through SpeechSynthesisModule; stub it
// so tests can make the lookup fail on demand (#456).
const speechSynthesisMock = vi.hoisted(() => ({
  getVoiceById: vi.fn(),
  getVoices: vi.fn(),
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
  speechSynthesisMock.getVoices.mockReset();
  speechSynthesisMock.getVoices.mockResolvedValue([]);

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

// New installs (only) adopt the server-`recommended` voice on first use per host.
// Existing users — including a deliberate "Voice off", stored identically to
// "never chose" — are never touched (no pending marker), so their voice is never
// silently swapped. See doc/plans/2026-07-05-voice-shortlist-pins-design.md.
describe('UserPreferenceModule new-install default voice (Marin, 2026-07-05)', () => {
  const createRecommendedVoice = (
    id: string,
    name: string
  ): SpeechSynthesisVoiceRemote => ({
    id,
    name,
    lang: 'en-US',
    price: 0,
    price_per_thousand_chars_in_usd: 0,
    price_per_thousand_chars_in_credits: 50,
    powered_by: 'OpenAI',
    default: false,
    localService: false,
    voiceURI: '',
    recommended: true,
  });
  const marin = createRecommendedVoice('marin-openai', 'Marin');

  it('adopts the server-recommended voice on a fresh install (pending + signed in)', async () => {
    store[VOICE_DEFAULT_PENDING_KEY] = ['claude', 'pi'];
    fakeAuth.authenticated = true;
    speechSynthesisMock.getVoices.mockResolvedValue([
      { ...createRecommendedVoice('x', 'X'), recommended: false },
      marin,
    ]);

    const prefs = prefsModule.UserPreferenceModule.getInstance();
    const voice = await prefs.getVoice('claude');

    expect(voice?.id).toBe('marin-openai');
    expect(store.voicePreferences).toEqual({ claude: 'marin-openai' });
    // host drained so it never re-adopts
    expect(store[VOICE_DEFAULT_PENDING_KEY]).toEqual(['pi']);
  });

  it('does not adopt while signed out (catalog empty / default unknowable)', async () => {
    store[VOICE_DEFAULT_PENDING_KEY] = ['claude', 'pi'];
    fakeAuth.authenticated = false;

    const prefs = prefsModule.UserPreferenceModule.getInstance();
    expect(await prefs.getVoice('claude')).toBeNull();
    expect(store.voicePreferences ?? {}).toEqual({}); // nothing adopted
    expect(store[VOICE_DEFAULT_PENDING_KEY]).toEqual(['claude', 'pi']); // stays pending
  });

  it('does not adopt when the server has nominated no recommended voice', async () => {
    store[VOICE_DEFAULT_PENDING_KEY] = ['claude'];
    fakeAuth.authenticated = true;
    speechSynthesisMock.getVoices.mockResolvedValue([
      { ...marin, recommended: false },
    ]);

    const prefs = prefsModule.UserPreferenceModule.getInstance();
    expect(await prefs.getVoice('claude')).toBeNull();
    expect(store[VOICE_DEFAULT_PENDING_KEY]).toEqual(['claude']); // still pending, retries later
  });

  it('does not adopt for an existing user (no pending marker)', async () => {
    fakeAuth.authenticated = true;
    speechSynthesisMock.getVoices.mockResolvedValue([marin]);

    const prefs = prefsModule.UserPreferenceModule.getInstance();
    expect(await prefs.getVoice('claude')).toBeNull();
    expect(store.voicePreferences ?? {}).toEqual({}); // nothing adopted
    expect(speechSynthesisMock.getVoices).not.toHaveBeenCalled();
  });

  it('a deliberate "Voice off" (unsetVoice) drains pending so it is never re-defaulted', async () => {
    store[VOICE_DEFAULT_PENDING_KEY] = ['claude', 'pi'];
    fakeAuth.authenticated = true;
    speechSynthesisMock.getVoices.mockResolvedValue([marin]);

    const prefs = prefsModule.UserPreferenceModule.getInstance();
    await prefs.unsetVoice('claude'); // user turns voice off before any adopt
    expect(store[VOICE_DEFAULT_PENDING_KEY]).toEqual(['pi']);

    expect(await prefs.getVoice('claude')).toBeNull(); // stays off, not re-defaulted
    expect(store.voicePreferences ?? {}).toEqual({});
  });

  it('an explicit voice choice drains pending', async () => {
    store[VOICE_DEFAULT_PENDING_KEY] = ['claude', 'pi'];
    const prefs = prefsModule.UserPreferenceModule.getInstance();
    await prefs.setVoice(createPiVoice('voice2', 'Pi 2'), 'claude');
    expect(store[VOICE_DEFAULT_PENDING_KEY]).toEqual(['pi']);
  });

  it('does NOT clobber a "Voice off" made while adoption is mid-flight (TOCTOU)', async () => {
    // A slow /voices fetch leaves adoption in flight; the user turns voice off in
    // another tab meanwhile. The in-flight adoption must re-check and bail, not
    // silently swap Marin back on. (Reviewer-found race, 2026-07-05.)
    store[VOICE_DEFAULT_PENDING_KEY] = ['claude', 'pi'];
    fakeAuth.authenticated = true;
    let resolveVoices: (v: SpeechSynthesisVoiceRemote[]) => void = () => {};
    speechSynthesisMock.getVoices.mockReturnValue(
      new Promise((resolve) => {
        resolveVoices = resolve;
      })
    );

    const prefs = prefsModule.UserPreferenceModule.getInstance();
    const adopt = prefs.getVoice('claude'); // starts the /voices fetch, in flight
    await new Promise((r) => setTimeout(r, 0)); // let adoption park on getVoices()
    await prefs.unsetVoice('claude'); // user turns voice off mid-fetch
    resolveVoices([marin]);
    const voice = await adopt;

    expect(voice).toBeNull(); // adoption bailed
    expect(store.voicePreferences ?? {}).toEqual({}); // stays off, not Marin
    expect(store[VOICE_DEFAULT_PENDING_KEY]).toEqual(['pi']); // drained by the off
  });
});
