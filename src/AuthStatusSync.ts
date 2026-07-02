import { browser } from "wxt/browser";
import { getJwtManager } from "./JwtManager";
import EventBus from "./events/EventBus";
import { logger } from "./LoggingModule";

/**
 * Storage keys the background deliberately preserves across a transient auth
 * failure so it can recover the session later: refresh()'s silent-401 branch
 * nulls only jwtToken/tokenExpiresAt and keeps these two as the way back in.
 */
const RECOVERY_CREDENTIAL_KEYS = [
  "authCookieValue",
  "oauthRefreshToken",
] as const;

/**
 * Reconciles the content script's in-memory JwtManager with an
 * AUTH_STATUS_CHANGED broadcast from the background service worker, then
 * re-emits the change on the EventBus for UI consumers (voice menus, auth
 * prompts, etc.).
 *
 * The reconciliation must complete BEFORE "saypi:auth:status-changed" is
 * emitted: listeners — and anything they synchronously call, like the voice
 * menu's getVoices() during its re-render — read auth state straight from the
 * JwtManager singleton, so the singleton has to reflect the broadcast state
 * by the time they run (#456).
 *
 * Sign-out needs more than loadFromStorage(): that method only copies values
 * OUT of storage and never nulls in-memory state when storage is empty, so
 * after the background wipes storage on sign-out the content script would
 * keep a live token for up to its ~15-minute TTL — still authenticating API
 * calls as the previous user and keeping the voice cache's auth fingerprint
 * (SpeechSynthesisModule) and the voice menu's sign-in gate (VoiceMenu's
 * ttsRequiresSignIn) on them. When the background says signed-out but the
 * in-memory token still looks live, drop it with clear().
 *
 * clear() wipes more than the guard needs, though: it also removes the STORED
 * recovery credentials (authCookieValue / oauthRefreshToken) that the
 * background deliberately preserves across a transient auth failure. And a
 * signed-out broadcast CAN reach a tab whose in-memory token is still live
 * without a genuine sign-out: pollAuthCookie force-refreshes on every
 * service-worker wake while any auth_session cookie exists — at an arbitrary
 * point in the token's ~15m life — and a dead website cookie sends
 * JwtManager.refresh() down its silent-401 branch, which nulls jwtToken in
 * storage while keeping authCookieValue/oauthRefreshToken as the way back in.
 * For PKCE users the preserved oauthRefreshToken is still valid, and after
 * MV3 service-worker eviction the fresh worker recovers the session from it
 * (loadFromStorage → refreshWithOAuth); destroying it here would turn a
 * transient 401 into a silent permanent sign-out (PR #457 round 3). So the
 * guard snapshots those two keys before clear() and restores whichever
 * existed afterwards — a no-op on a genuine sign-out (the background's own
 * clear() already emptied storage), credential-preserving on the transient
 * paths. The alarms call inside clear() is try/catch-guarded for contexts
 * without the alarms API (i.e. content scripts).
 */
export async function handleAuthStatusUpdate(
  isAuthenticated: boolean
): Promise<void> {
  const jwtManager = await getJwtManager();
  if (!isAuthenticated && jwtManager.isAuthenticated()) {
    // Snapshot the recovery credentials the background may have deliberately
    // preserved (transient-401 broadcast), so clear() can't destroy them.
    const recovered: Partial<
      Record<(typeof RECOVERY_CREDENTIAL_KEYS)[number], string>
    > = {};
    try {
      const stored = await browser.storage.local.get([
        ...RECOVERY_CREDENTIAL_KEYS,
      ]);
      for (const key of RECOVERY_CREDENTIAL_KEYS) {
        if (stored[key]) {
          recovered[key] = stored[key];
        }
      }
    } catch (error) {
      logger.warn(
        "[AuthStatusSync] Could not snapshot recovery credentials before clear()",
        error
      );
    }

    await jwtManager.clear();

    if (Object.keys(recovered).length > 0) {
      try {
        await browser.storage.local.set(recovered);
        logger.debug(
          "[AuthStatusSync] Restored preserved recovery credentials after clear()"
        );
      } catch (error) {
        logger.error(
          "[AuthStatusSync] Failed to restore recovery credentials after clear()",
          error
        );
      }
    }
    logger.debug(
      "[AuthStatusSync] Dropped stale in-memory auth state on sign-out broadcast"
    );
  } else {
    // Pick up whatever the background wrote (fresh token on sign-in, etc.)
    await jwtManager.loadFromStorage();
    logger.debug("[AuthStatusSync] JWT manager updated with latest token");
  }
  EventBus.emit("saypi:auth:status-changed", isAuthenticated);
}
