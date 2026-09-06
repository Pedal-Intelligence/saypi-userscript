import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { h } from "preact";
import { cleanup, render } from "@testing-library/preact";
import { browser } from "wxt/browser";
import { VoicesPanel } from "../../../entrypoints/settings/tabs/voices/VoicesPanel";
import {
  VoicesController,
  type VoiceStudioDeps,
} from "../../../entrypoints/settings/tabs/voices/voices-controller";
import EventBus from "../../../src/events/EventBus";
import { getJwtManagerSync } from "../../../src/JwtManager";
import { SpeechSynthesisModule } from "../../../src/tts/SpeechSynthesisModule";
import type { TextToSpeechService } from "../../../src/tts/TextToSpeechService";
import type { AudioStreamManager } from "../../../src/tts/AudioStreamManager";
import type { UserPreferenceModule } from "../../../src/prefs/PreferenceModule";
import { mockVoices } from "../../data/Voices";
import {
  installSettingsAuthSync,
  isSettingsAuthenticated,
  onSettingsAuthChange,
  resetSettingsAuthSyncForTests,
  settingsAuthSyncSettled,
} from "../../../entrypoints/settings/shared/auth-sync";

/**
 * The settings page is an EXTENSION PAGE, not a content script, and #227's
 * remaining seam is that nothing there reconciles the page's own JwtManager
 * with a background auth broadcast: the header flips, the Voices tab does not.
 *
 * Like test/AuthStatusSync.spec.ts, this spec drives the REAL JwtManager
 * singleton (only chrome/wxt storage is mocked, via test/vitest.setup.js) —
 * the whole point is what the singleton holds after a broadcast, so a truthful
 * stand-in would hide the bug.
 *
 * Unlike a content script, this context HAS browser.alarms, so the spec
 * installs an alarms mock. That is the regression these tests exist to make
 * visible: JwtManager.clear() clears the extension-wide JWT_REFRESH_ALARM the
 * background service worker owns, and a signed-out broadcast does not always
 * mean a real sign-out.
 *
 * authServerUrl is deliberately absent from the config mock: every JwtManager
 * refresh path bails out without it, keeping the spec fully offline.
 */
vi.mock("../../../src/ConfigModule", () => ({
  config: {
    appServerUrl: "https://app.example.com",
    apiServerUrl: "https://api.saypi.ai",
  },
}));

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

/** The extension-wide alarm the background owns — JwtManager's own name. */
const JWT_REFRESH_ALARM = "saypi-jwt-refresh";

const alarms = {
  create: vi.fn(async () => {}),
  clear: vi.fn(async () => true),
  get: vi.fn(async () => undefined),
  getAll: vi.fn(async () => []),
  onAlarm: { addListener: vi.fn(), removeListener: vi.fn() },
};

type Listeners = {
  onMessage: (message: any) => void;
  onStorage: (
    changes: Record<string, { oldValue?: unknown; newValue?: unknown }>,
    areaName: string
  ) => void;
};

/**
 * The listeners the reconciler installed — captured the way production
 * delivers to them, so the tests exercise the real subscription wiring rather
 * than an internal entry point.
 */
function capturedListeners(): Listeners {
  const messageCalls = (browser.runtime.onMessage.addListener as any).mock.calls;
  const storageCalls = (browser.storage.onChanged.addListener as any).mock.calls;
  return {
    onMessage: messageCalls[messageCalls.length - 1][0],
    onStorage: storageCalls[storageCalls.length - 1][0],
  };
}

/** The background's AUTH_STATUS_CHANGED broadcast, as tabs.sendMessage delivers it. */
async function broadcastAuthStatus(isAuthenticated: boolean): Promise<void> {
  capturedListeners().onMessage({
    type: "AUTH_STATUS_CHANGED",
    isAuthenticated,
    timestamp: Date.now(),
  });
  await settingsAuthSyncSettled();
}

/** A chrome.storage.local change event for the JWT, as the background produces it. */
async function storageChanged(
  oldValue: unknown,
  newValue: unknown
): Promise<void> {
  capturedListeners().onStorage(
    { jwtToken: { oldValue, newValue } },
    "local"
  );
  await settingsAuthSyncSettled();
}

describe("settings-page auth reconciliation (#227)", () => {
  let speechSynthesisModule: SpeechSynthesisModule;
  let textToSpeechServiceMock: TextToSpeechService;

  beforeEach(() => {
    seedStorage({});
    // The settings page is an extension page: the alarms API is present here.
    (globalThis as any).chrome.alarms = alarms;
    alarms.create.mockClear();
    alarms.clear.mockClear();

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
    resetSettingsAuthSyncForTests();
    EventBus.removeAllListeners("saypi:auth:status-changed");
    // Fully reset the shared JwtManager singleton so one test's credentials
    // can't leak into the next.
    await getJwtManagerSync().clear();
    seedStorage({});
    delete (globalThis as any).chrome.alarms;
    vi.clearAllMocks();
  });

  /** A signed-in settings page: token in storage, singleton loaded from it. */
  async function openSettingsSignedInAs(
    userId: string,
    extra: Record<string, unknown> = {}
  ): Promise<string> {
    const token = makeJwt({ userId });
    seedStorage({
      jwtToken: token,
      tokenExpiresAt: Date.now() + 15 * 60_000,
      ...extra,
    });
    await getJwtManagerSync().loadFromStorage();
    installSettingsAuthSync();
    await settingsAuthSyncSettled();
    return token;
  }

  it("flips the page to signed out WITHOUT clearing the extension-wide refresh alarm", async () => {
    await openSettingsSignedInAs("user-a", { oauthRefreshToken: "refresh-456" });
    expect(isSettingsAuthenticated()).toBe(true); // sanity
    alarms.clear.mockClear();

    // A signed-out broadcast does NOT always mean a real sign-out: the
    // background emits one on a transient 401 while deliberately preserving
    // the credentials (and the backoff retry alarm) it needs to recover.
    await broadcastAuthStatus(false);

    // The page's own view of auth flips...
    expect(isSettingsAuthenticated()).toBe(false);
    // ...without touching the alarm the background service worker owns...
    expect(alarms.clear).not.toHaveBeenCalledWith(JWT_REFRESH_ALARM);
    expect(alarms.clear).not.toHaveBeenCalled();
    // ...or the stored recovery credential...
    expect(storageState().oauthRefreshToken).toBe("refresh-456");
    // ...and deliberately without calling JwtManager.clear(): a settings tab
    // must not wipe extension-wide credential state (see auth-sync.ts).
    expect(getJwtManagerSync().isAuthenticated()).toBe(true);
  });

  it("tells the page it is signed out only after the settings-scoped state has flipped", async () => {
    await openSettingsSignedInAs("user-a");
    const seen: boolean[] = [];
    EventBus.on("saypi:auth:status-changed", () => {
      // Listeners read auth state synchronously during their re-render (#456).
      seen.push(isSettingsAuthenticated());
    });

    await broadcastAuthStatus(false);

    expect(seen).toEqual([false]);
  });

  it("loads the new token into the JWT manager BEFORE announcing the sign-in", async () => {
    installSettingsAuthSync();
    await settingsAuthSyncSettled();
    expect(isSettingsAuthenticated()).toBe(false); // sanity: signed out

    const seen: Array<{ header: string | null; settings: boolean }> = [];
    EventBus.on("saypi:auth:status-changed", () => {
      seen.push({
        header: getJwtManagerSync().getAuthHeader(),
        settings: isSettingsAuthenticated(),
      });
    });

    // Sign-in as the background produces it: token lands in storage, then the
    // AUTH_STATUS_CHANGED broadcast.
    const token = makeJwt({ userId: "user-a" });
    seedStorage({ jwtToken: token, tokenExpiresAt: Date.now() + 15 * 60_000 });
    await broadcastAuthStatus(true);

    // A later API call carries the new token, and the announcement came after
    // the singleton already held it.
    expect(getJwtManagerSync().getAuthHeader()).toBe(`Bearer ${token}`);
    expect(seen).toEqual([{ header: `Bearer ${token}`, settings: true }]);
    // The invariant that actually protects the background's schedule: this
    // path DOES clear the alarm (loadFromStorage → scheduleRefresh), and must
    // always put it back. Only the sign-out branch's bare clear() is banned.
    expect(alarms.create).toHaveBeenCalledWith(
      JWT_REFRESH_ALARM,
      expect.anything()
    );
  });

  it("picks up a sign-in seen only as a storage write (no broadcast reached the page)", async () => {
    installSettingsAuthSync();
    await settingsAuthSyncSettled();

    const token = makeJwt({ userId: "user-a" });
    seedStorage({ jwtToken: token, tokenExpiresAt: Date.now() + 15 * 60_000 });
    await storageChanged(undefined, token);

    expect(isSettingsAuthenticated()).toBe(true);
    expect(getJwtManagerSync().getAuthHeader()).toBe(`Bearer ${token}`);
  });

  it("treats an account replacement (token value changes, presence does not) as a new session", async () => {
    const tokenA = await openSettingsSignedInAs("user-a");

    // User A's catalog, cached under user A's auth fingerprint.
    const userAVoices = [mockVoices[0]];
    textToSpeechServiceMock.getVoices = vi.fn(() =>
      Promise.resolve(userAVoices)
    );
    expect(await speechSynthesisModule.getVoices(undefined, "claude")).toEqual(
      userAVoices
    );

    // The page re-reads the catalog when it hears the change.
    const userBVoices = [
      { ...mockVoices[0], id: "user-b-voice", name: "User B's Voice" },
    ];
    let catalogSeenByTab: Promise<unknown> | undefined;
    EventBus.on("saypi:auth:status-changed", () => {
      catalogSeenByTab = speechSynthesisModule.getVoices(undefined, "claude");
    });

    // The background swaps the token in place — no presence flip, so the
    // header's "did presence change?" test would ignore this entirely.
    const tokenB = makeJwt({ userId: "user-b" });
    seedStorage({
      jwtToken: tokenB,
      tokenExpiresAt: Date.now() + 15 * 60_000,
    });
    textToSpeechServiceMock.getVoices = vi.fn(() =>
      Promise.resolve(userBVoices)
    );
    await storageChanged(tokenA, tokenB);

    expect(isSettingsAuthenticated()).toBe(true);
    expect(getJwtManagerSync().getAuthHeader()).toBe(`Bearer ${tokenB}`);
    expect(getJwtManagerSync().getClaims()?.userId).toBe("user-b");
    // The re-read got user B's catalog, not user A's cache.
    expect(await catalogSeenByTab).toEqual(userBVoices);
    expect(await speechSynthesisModule.getVoices(undefined, "claude")).toEqual(
      userBVoices
    );
  });

  it("ignores a storage write that did not change the token", async () => {
    const tokenA = await openSettingsSignedInAs("user-a");
    const seen: boolean[] = [];
    EventBus.on("saypi:auth:status-changed", (auth: boolean) => seen.push(auth));

    await storageChanged(tokenA, tokenA);

    expect(seen).toEqual([]);
  });

  it("does not re-announce a broadcast that says nothing new", async () => {
    await openSettingsSignedInAs("user-a");
    const seen: boolean[] = [];
    EventBus.on("saypi:auth:status-changed", (auth: boolean) => seen.push(auth));

    // The background broadcasts on every service-worker wake; a repeat of the
    // state the page already holds must not churn the tabs that listen.
    await broadcastAuthStatus(true);
    await broadcastAuthStatus(true);

    expect(seen).toEqual([]);
  });

  it("announces one sign-out however many events spell it", async () => {
    const tokenA = await openSettingsSignedInAs("user-a");
    const seen: boolean[] = [];
    EventBus.on("saypi:auth:status-changed", (auth: boolean) => seen.push(auth));

    // The broadcast can reach the page before the storage wipe it describes,
    // so the page sees "signed out, token still there" and then "signed out,
    // token gone". Two events, one sign-out.
    await broadcastAuthStatus(false);
    seedStorage({});
    await storageChanged(tokenA, undefined);

    expect(isSettingsAuthenticated()).toBe(false);
    expect(seen).toEqual([false]);
  });

  it("keeps the page's token current across a routine refresh without repainting the tabs", async () => {
    const tokenA = await openSettingsSignedInAs("user-a");
    const seen: boolean[] = [];
    EventBus.on("saypi:auth:status-changed", (auth: boolean) => seen.push(auth));

    // The background refreshes ~every 15 minutes: a new token for the SAME
    // session. The page's singleton has to pick it up (the one it holds is
    // about to expire under an open settings page, and an expired token reads
    // as signed out to every consumer)...
    const refreshed = makeJwt({ userId: "user-a", iat: 2 });
    seedStorage({
      jwtToken: refreshed,
      tokenExpiresAt: Date.now() + 15 * 60_000,
    });
    await storageChanged(tokenA, refreshed);

    expect(getJwtManagerSync().getAuthHeader()).toBe(`Bearer ${refreshed}`);
    expect(isSettingsAuthenticated()).toBe(true);
    // ...but nothing about the session changed, so the tabs are not asked to
    // re-fetch a catalog and repaint a rail every quarter of an hour.
    expect(seen).toEqual([]);
  });

  it("collapses a broadcast and its storage write that arrive back to back", async () => {
    // The background does both for one sign-in, and neither ordering is
    // guaranteed. Here they land before the first reconciliation has even
    // finished its storage read — the case every other test in this file
    // skips, because they await in between. (The signature check-and-set is
    // what makes this safe, not the queue: the queue is there so two
    // reconciliations can never interleave INSIDE loadFromStorage.)
    installSettingsAuthSync();
    await settingsAuthSyncSettled();
    const seen: boolean[] = [];
    EventBus.on("saypi:auth:status-changed", (auth: boolean) => seen.push(auth));

    const token = makeJwt({ userId: "user-a" });
    seedStorage({ jwtToken: token, tokenExpiresAt: Date.now() + 15 * 60_000 });
    const { onMessage, onStorage } = capturedListeners();
    onMessage({ type: "AUTH_STATUS_CHANGED", isAuthenticated: true });
    onStorage({ jwtToken: { oldValue: undefined, newValue: token } }, "local");
    await settingsAuthSyncSettled();

    expect(isSettingsAuthenticated()).toBe(true);
    expect(seen).toEqual([true]);
  });

  it("stops listening once uninstalled", async () => {
    const uninstall = installSettingsAuthSync();
    await settingsAuthSyncSettled();
    uninstall();

    expect(browser.runtime.onMessage.removeListener).toHaveBeenCalled();
    expect(browser.storage.onChanged.removeListener).toHaveBeenCalled();
  });

  it("stops serving the previous account's catalog after a sign-out (AC 3)", async () => {
    // The page deliberately keeps the singleton's token on sign-out, so the
    // TTS module's auth fingerprint would otherwise stay `user:A` and go on
    // serving user A's cached voice list — including their custom voices —
    // under a "sign in for TTS" label. The settings page hands the module its
    // own view of auth instead.
    speechSynthesisModule.setAuthStateReader(() => isSettingsAuthenticated());
    await openSettingsSignedInAs("user-a");
    const userAVoices = [mockVoices[0]];
    textToSpeechServiceMock.getVoices = vi.fn(() => Promise.resolve(userAVoices));
    expect(await speechSynthesisModule.getVoices(undefined, "claude")).toEqual(
      userAVoices
    );

    // Signed out, a /voices request comes back empty (mapped from 401).
    textToSpeechServiceMock.getVoices = vi.fn(() => Promise.resolve([]));
    await broadcastAuthStatus(false);

    expect(await speechSynthesisModule.getVoices(undefined, "claude")).toEqual([]);
  });

  it("flips the open Voices tab from signed in to signed out, with no reload (AC 1)", async () => {
    // The whole chain, end to end: a real background sign-out broadcast, the
    // real reconciler, and a real VoicesController reading the real
    // settings-scoped state through the real subscription. Only the studio's
    // network-bound deps are stubbed.
    await openSettingsSignedInAs("user-a");
    const { container } = render(h(VoicesPanel, {}));
    const studio = new VoicesController(container as HTMLElement, {
      getVoices: async () => [mockVoices[0] as any],
      getVoice: async () => mockVoices[0] as any,
      setVoice: async () => {},
      hasVoice: async () => true,
      loadPins: async () => null,
      setPinned: async () => {},
      playPreview: () => {},
      // The two under test, wired exactly as defaultDeps() wires them.
      isAuthenticated: () => isSettingsAuthenticated(),
      onAuthChange: (fn: () => void) => onSettingsAuthChange(fn),
    } as unknown as VoiceStudioDeps);
    await studio.init();
    const scope = () =>
      (container as HTMLElement).querySelector(".voice-current-host")
        ?.textContent;
    expect(scope()).toBe("voicesSpeaksWith");

    try {
      await broadcastAuthStatus(false);
      // The controller re-renders asynchronously (it re-reads the catalog).
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(scope()).toBe("signInForTTS");
    } finally {
      studio.destroy();
      cleanup();
    }
  });

  it("keeps the Voices tab off the JwtManager singleton", () => {
    // The whole point of the settings-scoped state: a stale in-memory token
    // must not be able to make the Voices tab render or fetch as the previous
    // user. A direct getJwtManagerSync() read there would bypass it.
    const source = readFileSync(
      fileURLToPath(
        new URL(
          "../../../entrypoints/settings/tabs/voices/voices-controller.ts",
          import.meta.url
        )
      ),
      "utf8"
    );
    expect(source).not.toMatch(/getJwtManagerSync/);
    expect(source).toMatch(/isSettingsAuthenticated/);
  });
});
