import { getJwtManager } from "./JwtManager";
import EventBus from "./events/EventBus";
import { logger } from "./LoggingModule";

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
 * That clear() is safe at every background broadcast site (see the
 * broadcastAuthStatus call-site analysis on PR #457): a live in-memory token
 * that the broadcast contradicts can only mean the background wiped storage
 * via its own JwtManager.clear() (sign-out message, auth-cookie removal, or
 * refresh exhaustion), so clear()'s storage removal is an idempotent no-op.
 * In the transient broadcasts that must preserve recovery credentials
 * (initial load with an unrefreshed cookie, a failed refresh of an expired
 * token), the in-memory token is absent or expired, the guard doesn't fire,
 * and the stored authCookieValue/oauthRefreshToken survive. The alarms call
 * inside clear() is try/catch-guarded for contexts without the alarms API
 * (i.e. content scripts).
 */
export async function handleAuthStatusUpdate(
  isAuthenticated: boolean
): Promise<void> {
  const jwtManager = await getJwtManager();
  if (!isAuthenticated && jwtManager.isAuthenticated()) {
    await jwtManager.clear();
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
