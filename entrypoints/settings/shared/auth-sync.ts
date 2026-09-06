import { browser } from "wxt/browser";
import EventBus from "../../../src/events/EventBus";
import { handleAuthStatusUpdate } from "../../../src/AuthStatusSync";
import { getJwtManagerSync } from "../../../src/JwtManager";

/**
 * Keeps the settings page's own view of authentication in step with the rest
 * of the extension — without letting a settings tab mutate extension-wide
 * credential state that the background service worker owns (#227).
 *
 * ## Why the page needs this at all
 *
 * `src/popup/auth.js` already re-renders the HEADER on the two signals the
 * background produces — the `AUTH_STATUS_CHANGED` runtime message and a
 * `jwtToken` change in `chrome.storage.local` — but it only updates a
 * module-local flag. Nothing reconciles the settings page's own `JwtManager`
 * singleton, which loaded from storage once at page load and has no storage
 * listener of its own. So a sign-in, sign-out or account switch elsewhere
 * flipped the header while every consumer of the singleton went on reading the
 * previous session, until the user reloaded the tab.
 *
 * ## Why this is NOT the content script's reconciler
 *
 * `handleAuthStatusUpdate` in `src/AuthStatusSync.ts` reconciles a CONTENT
 * SCRIPT, and its signed-out branch calls `JwtManager.clear()`. `clear()`
 * calls `clearRefreshAlarm()`, whose `browser.alarms.clear()` is a no-op in a
 * content script (no alarms API — hence the try/catch there) but is very much
 * NOT a no-op here: the settings page is an extension page, `alarms` is in the
 * manifest, and alarms are extension-wide. Clearing `saypi-jwt-refresh` from
 * this tab would delete the schedule the BACKGROUND owns.
 *
 * That matters because a signed-out broadcast does not always mean a real
 * sign-out. `pollAuthCookie` force-refreshes on every service-worker wake, and
 * a dead website cookie sends `JwtManager.refresh()` down its silent-401
 * branch: it nulls `jwtToken` in storage while deliberately preserving
 * `authCookieValue` / `oauthRefreshToken` as the way back in, and the
 * background broadcasts `false` off that write (see the long rationale at the
 * top of `src/AuthStatusSync.ts` and PR #457). A failed refresh likewise
 * schedules its own backoff RETRY on that same alarm (`JwtManager.refresh()`'s
 * catch block). Letting a settings tab clear it would turn a transient 401
 * into a session that never recovers — silent, and invisible in every test
 * that does not mock the alarms API.
 *
 * So the sign-out path here records the signed-out state in SETTINGS-SCOPED
 * state and emits the same EventBus event, leaving the singleton's in-memory
 * token — and the background's alarm and recovery credentials — alone.
 * Consumers read {@link isSettingsAuthenticated} instead of
 * `getJwtManagerSync().isAuthenticated()`, so a token the page has been told
 * is dead can never make a tab render or fetch as the previous user.
 *
 * The becoming-authenticated path DOES reuse `handleAuthStatusUpdate(true)`:
 * its authenticated branch is only `loadFromStorage()` plus the EventBus emit.
 * Storage already holds the new token, and the refresh it reschedules matches
 * what the background scheduled anyway.
 *
 * ## Ordering is load-bearing
 *
 * Reconciliation completes BEFORE `saypi:auth:status-changed` is emitted:
 * listeners — and anything they synchronously call during their re-render —
 * read auth state straight through, so the state has to be right by the time
 * they run (#456).
 */

const AUTH_EVENT = "saypi:auth:status-changed";

/**
 * The background told this page it is signed out, and we deliberately did not
 * drop the singleton's in-memory token (see above). Settings-scoped: it
 * describes what THIS page has been told, never what the extension holds.
 */
let toldSignedOut = false;

/**
 * The SESSION the last reconciliation settled on — `user:<id>`, or
 * `signed-out`, which has no identity to carry.
 *
 * Identity rather than the raw token, and for three reasons. Both signals can
 * describe the same change — the background broadcasts AND writes storage —
 * and it re-broadcasts on every service-worker wake, so without this one
 * sign-in would repaint the Voices tab (and re-fetch its catalog) two or three
 * times. The background swaps the token every ~15 minutes on a routine
 * refresh, which is a new token but the same session. And a sign-out arrives
 * as up to two events (the broadcast, then the storage wipe), which is one
 * sign-out however it is spelled.
 */
let lastSignature: string | null = null;

/** Reconciliations run one at a time: each one reads storage and awaits. */
let queue: Promise<void> = Promise.resolve();

let uninstall: (() => void) | null = null;

/**
 * Is the settings page authenticated, as far as this page has been told?
 *
 * Read this rather than `getJwtManagerSync().isAuthenticated()` anywhere on
 * the settings page: after a signed-out broadcast the singleton knowingly
 * still holds a live token (it is not this page's to clear), and the whole
 * point of the settings-scoped state is that no tab renders or fetches as the
 * previous user on the strength of it.
 */
export function isSettingsAuthenticated(): boolean {
  return !toldSignedOut && getJwtManagerSync().isAuthenticated();
}

/**
 * Subscribe to settings-page auth changes. The callback runs after the page's
 * auth state has been reconciled, so it may read {@link isSettingsAuthenticated}
 * (and the JwtManager singleton, on the authenticated path) synchronously.
 */
export function onSettingsAuthChange(
  fn: (isAuthenticated: boolean) => void
): () => void {
  EventBus.on(AUTH_EVENT, fn);
  return () => {
    EventBus.off(AUTH_EVENT, fn);
  };
}

/** Resolves once every reconciliation queued so far has run. */
export function settingsAuthSyncSettled(): Promise<void> {
  return queue.then(() => {});
}

async function storedToken(): Promise<string | null> {
  try {
    const { jwtToken } = await browser.storage.local.get(["jwtToken"]);
    return typeof jwtToken === "string" && jwtToken ? jwtToken : null;
  } catch {
    return null;
  }
}

const SIGNED_OUT = "signed-out";

/**
 * WHICH SESSION the stored token belongs to — the only part of it a settings
 * tab cares about. Falls back to the raw token when the claims cannot be read,
 * which errs towards treating an opaque change as a new session.
 */
function sessionOf(token: string | null): string {
  if (!token) return SIGNED_OUT;
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return `user:${JSON.parse(json).userId ?? token}`;
  } catch {
    return `user:${token}`;
  }
}

async function reconcileNow(isAuthenticated: boolean): Promise<void> {
  // Signed out carries no identity: the broadcast and the storage wipe that
  // follows it are one sign-out, whichever order they land in.
  const signature = isAuthenticated
    ? sessionOf(await storedToken())
    : SIGNED_OUT;
  const sessionChanged = signature !== lastSignature;
  lastSignature = signature;

  if (isAuthenticated) {
    // Order matters: the flag is settings-scoped state that listeners read,
    // and handleAuthStatusUpdate emits the event itself once the singleton has
    // loaded the new token.
    toldSignedOut = false;
    if (sessionChanged) {
      await handleAuthStatusUpdate(true);
      return;
    }
    // Same session, new token — the background's routine ~15-minute refresh.
    // The page's singleton still has to pick it up, or the token it holds
    // expires under an open settings page and every consumer starts reading a
    // signed-in user as signed out. But nothing about the SESSION changed, so
    // the tabs are not told: an announcement here would silently re-fetch the
    // voice catalog and repaint the rail every quarter of an hour.
    await getJwtManagerSync().loadFromStorage();
    return;
  }

  // Signed out: record it HERE and announce it — never handleAuthStatusUpdate(
  // false), which would clear() the singleton and with it the background's
  // refresh alarm and stored recovery credentials.
  toldSignedOut = true;
  if (sessionChanged) EventBus.emit(AUTH_EVENT, false);
}

function reconcile(isAuthenticated: boolean): Promise<void> {
  queue = queue
    .then(() => reconcileNow(isAuthenticated))
    .catch((error) => {
      console.warn("[Settings] Auth reconciliation failed", error);
    });
  return queue;
}

/**
 * Seed the signature from what the page already holds, so the background's
 * routine re-broadcast of an unchanged state on its next wake does not read as
 * a change.
 */
async function seed(): Promise<void> {
  lastSignature = sessionOf(await storedToken());
}

/**
 * Start listening. Install this before the tabs render — a broadcast that
 * lands during bootstrap should still reach them.
 *
 * @returns a function that stops listening (idempotent).
 */
export function installSettingsAuthSync(): () => void {
  if (uninstall) return uninstall;

  const onMessage = (message: any): void => {
    if (message?.type === "AUTH_STATUS_CHANGED") {
      void reconcile(!!message.isAuthenticated);
    }
    // Deliberately returns undefined: this listener answers nothing, and
    // returning true would hold the background's message channel open.
  };

  const onStorageChanged = (
    changes: Record<string, { oldValue?: unknown; newValue?: unknown }>,
    areaName: string
  ): void => {
    if (areaName !== "local") return;
    const change = changes?.jwtToken;
    // A VALUE change, not just a presence flip: swapping one account's token
    // for another's keeps presence identical, and that is still a new session
    // whose catalog and quota this page must re-read.
    if (!change || change.oldValue === change.newValue) return;
    void reconcile(!!change.newValue);
  };

  browser.runtime.onMessage.addListener(onMessage);
  browser.storage.onChanged.addListener(onStorageChanged);
  queue = queue.then(seed).catch(() => {});

  uninstall = () => {
    browser.runtime.onMessage.removeListener(onMessage);
    browser.storage.onChanged.removeListener(onStorageChanged);
    uninstall = null;
  };
  return uninstall;
}

/**
 * Visible only for testing: drop the listeners and the module-scoped state so
 * one spec's session cannot leak into the next.
 */
export function resetSettingsAuthSyncForTests(): void {
  uninstall?.();
  toldSignedOut = false;
  lastSignature = null;
  queue = Promise.resolve();
}
