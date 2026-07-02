import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { browser } from "wxt/browser";
import EventBus from "../src/events/EventBus";
import { handleAuthStatusUpdate } from "../src/AuthStatusSync";
import { getJwtManagerSync } from "../src/JwtManager";
import { SpeechSynthesisModule } from "../src/tts/SpeechSynthesisModule";
import type { TextToSpeechService } from "../src/tts/TextToSpeechService";
import type { AudioStreamManager } from "../src/tts/AudioStreamManager";
import type { UserPreferenceModule } from "../src/prefs/PreferenceModule";
import type { SpeechSynthesisVoiceRemote } from "../src/tts/SpeechModel";
import { mockVoices } from "./data/Voices";

// This spec deliberately exercises the REAL JwtManager singleton (only
// chrome/wxt storage is mocked, via test/vitest.setup.js): the round-1 tests
// for #456 faked getJwtManagerSync with a truthful stand-in, which hid the
// fact that JwtManager.loadFromStorage never nulls its in-memory token when
// storage is empty — so a sign-out broadcast left the content script
// authenticated as the previous user until the token's ~15m TTL.
//
// authServerUrl is deliberately absent from the config mock: every
// JwtManager refresh path bails out without it, keeping this spec fully
// offline (no fetch mock needed) while still running the real load/clear
// logic against the mocked extension storage.
vi.mock("../src/ConfigModule", () => ({
  config: {
    appServerUrl: "https://app.example.com",
    apiServerUrl: "https://api.saypi.ai",
  },
}));

const AUTH_STORAGE_KEYS = [
  "jwtToken",
  "tokenExpiresAt",
  "authCookieValue",
  "oauthRefreshToken",
];

const b64url = (obj: object) =>
  Buffer.from(JSON.stringify(obj))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

/** A structurally valid (unsigned) JWT whose claims getClaims() can parse. */
const makeJwt = (claims: object) =>
  `${b64url({ alg: "HS256", typ: "JWT" })}.${b64url(claims)}.sig`;

const storageState = () => (browser.storage.local as any)._getState();
const seedStorage = (state: Record<string, unknown>) =>
  (browser.storage.local as any)._setState(state);

describe("handleAuthStatusUpdate (content-script AUTH_STATUS_CHANGED handler, #456)", () => {
  let speechSynthesisModule: SpeechSynthesisModule;
  let textToSpeechServiceMock: TextToSpeechService;

  beforeEach(() => {
    // Freeze timers so JwtManager's scheduleRefresh setTimeout fallback (the
    // alarms API is absent here, as in a real content script) never fires.
    vi.useFakeTimers();
    seedStorage({});

    textToSpeechServiceMock = {
      getVoiceById: vi.fn(() => Promise.resolve(mockVoices[0])),
      getVoices: vi.fn(() => Promise.resolve(mockVoices)),
      createSpeech: vi.fn(),
      addTextToSpeechStream: vi.fn(),
    } as unknown as TextToSpeechService;

    speechSynthesisModule = new SpeechSynthesisModule(
      textToSpeechServiceMock,
      {
        createStream: vi.fn(),
        addSpeechToStream: vi.fn(),
        endStream: vi.fn(),
        isOpen: vi.fn().mockReturnValue(false),
      } as unknown as AudioStreamManager,
      {
        hasVoice: vi.fn().mockResolvedValue(true),
        getVoice: vi.fn().mockResolvedValue(mockVoices[0]),
        getLanguage: vi.fn().mockResolvedValue("en-US"),
      } as unknown as UserPreferenceModule
    );
  });

  afterEach(async () => {
    EventBus.removeAllListeners("saypi:auth:status-changed");
    // Fully reset the shared JwtManager singleton (in-memory + storage) so
    // credentials seeded by one test can't leak into the next.
    await getJwtManagerSync().clear();
    seedStorage({});
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  /** Simulate a sign-in as the background produces it: token lands in
   * extension storage, then AUTH_STATUS_CHANGED {isAuthenticated:true}. */
  async function signInAs(userId: string) {
    seedStorage({
      ...storageState(),
      jwtToken: makeJwt({ userId }),
      tokenExpiresAt: Date.now() + 15 * 60_000,
    });
    await handleAuthStatusUpdate(true);
  }

  it("refetches voices instead of serving the previous user's cache after a sign-out broadcast (#456)", async () => {
    // --- Signed-in session: user A's voice list is fetched and cached.
    await signInAs("user-a");
    expect(getJwtManagerSync().isAuthenticated()).toBe(true); // sanity
    const userAVoices = [mockVoices[0]];
    textToSpeechServiceMock.getVoices = vi.fn(() => Promise.resolve(userAVoices));
    expect(await speechSynthesisModule.getVoices(undefined, "claude")).toEqual(
      userAVoices
    );

    // The voice menu re-renders on the auth event and re-reads the voice list
    // — this is the consumer that showed user A's voices after sign-out.
    let voicesSeenByMenu:
      | Promise<SpeechSynthesisVoiceRemote[]>
      | undefined;
    EventBus.on("saypi:auth:status-changed", () => {
      voicesSeenByMenu = speechSynthesisModule.getVoices(undefined, "claude");
    });

    // --- Sign-out, exactly as production produces it: the background's
    // JwtManager.clear() wipes the auth keys from extension storage...
    await browser.storage.local.remove(AUTH_STORAGE_KEYS);
    // ...a signed-out /voices request now 401s (mapped to [])...
    textToSpeechServiceMock.getVoices = vi.fn(() => Promise.resolve([]));
    // ...and the content script receives AUTH_STATUS_CHANGED {false}.
    await handleAuthStatusUpdate(false);

    // The menu's re-render must get the signed-out list, not user A's cache.
    expect(await voicesSeenByMenu).toEqual([]);
    expect(textToSpeechServiceMock.getVoices).toHaveBeenCalled();
    // Later reads agree, and ttsRequiresSignIn's input (VoiceMenu.ts) now
    // reflects reality instead of the stale in-memory token.
    expect(await speechSynthesisModule.getVoices(undefined, "claude")).toEqual([]);
    expect(getJwtManagerSync().isAuthenticated()).toBe(false);
  });

  it("serves the new account's voices after an account switch (sign-out then sign-in, #456)", async () => {
    await signInAs("user-a");
    textToSpeechServiceMock.getVoices = vi.fn(() =>
      Promise.resolve([mockVoices[0]])
    );
    await speechSynthesisModule.getVoices(undefined, "claude");

    // Switch accounts: background clears storage + broadcasts false, then
    // stores user B's token + broadcasts true.
    await browser.storage.local.remove(AUTH_STORAGE_KEYS);
    await handleAuthStatusUpdate(false);
    const userBVoices = [
      { ...mockVoices[0], id: "user-b-voice", name: "User B's Voice" },
    ];
    textToSpeechServiceMock.getVoices = vi.fn(() => Promise.resolve(userBVoices));
    await signInAs("user-b");

    expect(await speechSynthesisModule.getVoices(undefined, "claude")).toEqual(
      userBVoices
    );
  });

  it("preserves stored recovery credentials when a signed-out broadcast arrives while no live token is held", async () => {
    // Transient-failure broadcasts (initial load with a not-yet-refreshed
    // cookie, or a failed refresh of an expired token) reach the content
    // script with isAuthenticated:false while storage still holds the
    // credentials the background needs to recover the session. The handler
    // must not destroy them.
    seedStorage({
      authCookieValue: "cookie-123",
      oauthRefreshToken: "refresh-456",
    });

    await handleAuthStatusUpdate(false);

    expect(storageState().authCookieValue).toBe("cookie-123");
    expect(storageState().oauthRefreshToken).toBe("refresh-456");
  });

  it("preserves an expired token's recovery credentials on a signed-out broadcast (transient refresh failure)", async () => {
    // Token expired and the background's refresh failed transiently: it
    // broadcasts false but has NOT wiped storage — the stored credential is
    // the way back into the session and must survive. (The cookie credential
    // is used here; the OAuth refresh token takes the same guard branch but
    // its failed-refresh path rejects out-of-band in this offline setup.)
    seedStorage({
      jwtToken: makeJwt({ userId: "user-a" }),
      tokenExpiresAt: Date.now() - 1_000, // already expired
      authCookieValue: "cookie-123",
    });

    await handleAuthStatusUpdate(false);

    expect(storageState().authCookieValue).toBe("cookie-123");
  });

  it("preserves recovery credentials when a transient-401 broadcast arrives while the in-memory token is still live (#456 / PR #457 round 3)", async () => {
    // pollAuthCookie force-refreshes on every service-worker wake whenever an
    // auth_session cookie exists — at an arbitrary point in the token's ~15m
    // life. If the website cookie has died, refresh()'s silent-401 branch
    // nulls jwtToken in storage WITHOUT clear(), deliberately preserving
    // authCookieValue/oauthRefreshToken as recovery credentials, and the
    // background broadcasts isAuthenticated:false off that storage write. A
    // tab whose in-memory token is still LIVE then takes the clear() guard —
    // which must not destroy the preserved credentials: for PKCE users the
    // oauthRefreshToken is still valid, and after MV3 SW eviction the fresh
    // service worker recovers the session from it (loadFromStorage →
    // refreshWithOAuth). Wiping it turns a transient 401 into a silent
    // permanent sign-out.

    // Signed-in session with both recovery credentials alongside the token.
    seedStorage({
      jwtToken: makeJwt({ userId: "user-a" }),
      tokenExpiresAt: Date.now() + 15 * 60_000,
      authCookieValue: "cookie-123",
      oauthRefreshToken: "refresh-456",
    });
    await handleAuthStatusUpdate(true);
    expect(getJwtManagerSync().isAuthenticated()).toBe(true); // sanity

    // The background's silent-401 storage write (JwtManager.refresh):
    // jwtToken nulled, recovery credentials deliberately kept.
    await browser.storage.local.set({ jwtToken: null, tokenExpiresAt: null });

    const broadcasts: boolean[] = [];
    EventBus.on("saypi:auth:status-changed", (auth: boolean) =>
      broadcasts.push(auth)
    );

    await handleAuthStatusUpdate(false);

    // Both recovery credentials survive in storage...
    expect(storageState().authCookieValue).toBe("cookie-123");
    expect(storageState().oauthRefreshToken).toBe("refresh-456");
    // ...the stale in-memory token is dropped...
    expect(getJwtManagerSync().isAuthenticated()).toBe(false);
    // ...no token is resurrected into storage...
    expect(storageState().jwtToken ?? null).toBeNull();
    // ...and UI consumers were still notified of the sign-out.
    expect(broadcasts).toEqual([false]);
  });

  it("does not resurrect credentials on a genuine sign-out (restore is a no-op when storage was already wiped)", async () => {
    // Genuine sign-out: the background's own JwtManager.clear() removes ALL
    // auth keys before broadcasting false. The snapshot taken before the
    // content-side clear() is empty, so the restore must not bring the dead
    // credentials back.
    seedStorage({
      jwtToken: makeJwt({ userId: "user-a" }),
      tokenExpiresAt: Date.now() + 15 * 60_000,
      authCookieValue: "cookie-123",
      oauthRefreshToken: "refresh-456",
    });
    await handleAuthStatusUpdate(true);
    expect(getJwtManagerSync().isAuthenticated()).toBe(true); // sanity

    await browser.storage.local.remove(AUTH_STORAGE_KEYS);
    await handleAuthStatusUpdate(false);

    expect(storageState().authCookieValue).toBeUndefined();
    expect(storageState().oauthRefreshToken).toBeUndefined();
    expect(getJwtManagerSync().isAuthenticated()).toBe(false);
  });
});
