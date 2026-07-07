import { browser, Browser } from "wxt/browser";
import { isFirefox, isMobileDevice } from "../UserAgentModule";
import { deserializeApiRequest, type SerializedApiRequest } from "../utils/ApiRequestSerializer";
import { authenticate, isPKCESupported } from "../auth/OAuthService";
import { sendOnboardingHint, voiceGoalFromUrl } from "../auth/OnboardingHint";
import { registerDevReloadHandler, DEV_FEED_SPEECH_MESSAGE } from "../dev/devReload";
import { pickSyntheticSpeechClip } from "../offscreen/syntheticSpeechPool";
import { maybeOpenFirstRunTab } from "../onboarding/firstRun";
import { seedVoiceDefaultsOnFreshInstall } from "../onboarding/voiceDefaults";
import { detectPermissionLoss, buildPermissionsUrl, MIC_GRANTED_FLAG } from "../permissions/permissionLossDetection";
import { SETTINGS_DEEP_LINK_KEY, parseSettingsDeepLink } from "../popup/popupopener";
import { STUDIO_WINDOW, isRoomySettingsTab } from "../popup/settingsWindowSize";

// Track when PKCE authentication is in progress to prevent cookie listener interference
let isPKCEAuthInProgress = false;

// Helper function to get extension URL with fallback for WXT compatibility
function getExtensionURL(path: string): string {
  // Use WXT's typed getURL API directly (it's available at runtime)
  // The TypeScript error was due to type definitions, but the function exists
  if (browser.runtime && typeof (browser.runtime as any).getURL === 'function') {
    return (browser.runtime as any).getURL(path);
  }
  
  // Fallback to Chrome API
  if (typeof chrome !== 'undefined' && chrome.runtime?.getURL) {
    return chrome.runtime.getURL(path);
  }
  
  // Final fallback - construct URL manually
  const protocol = isFirefox() ? 'moz-extension://' : 'chrome-extension://';
  return `${protocol}${browser.runtime.id}/${path}`;
}

const POPUP_MIN_CONTENT_WIDTH = 736;
const POPUP_DESKTOP_WIDTH = POPUP_MIN_CONTENT_WIDTH + 6; // The buffer value 6 accounts for window chrome (browser borders and controls) to ensure the content area stays above the 735px mobile breakpoint.

async function openSettingsWindow() {
  try {
    const popupURL = getExtensionURL('settings.html');

    // Check if settings window/tab already exists
    const existingTab = await findExistingSettingsTab(popupURL);
    if (existingTab) {
      // Focus existing window/tab instead of opening a new one
      if (existingTab.windowId !== undefined) {
        await browser.windows.update(existingTab.windowId, { focused: true });
      }
      if (existingTab.id !== undefined) {
        await browser.tabs.update(existingTab.id, { active: true });
      }
      return;
    }

    // Decide initial height based on whether we need to show consent overlay
    // We check local storage flag 'shareData'. If it's undefined, consent will show.
    const { shareData } = await browser.storage.local.get('shareData');
    const needsConsent = typeof shareData === 'undefined';
    let width = POPUP_DESKTOP_WIDTH;
    let height = needsConsent ? 640 : 512; // taller for consent (640px to match illustration), compact for settings (512px)

    // A deep link into a roomy pane (the Voices studio) opens at full size
    // directly, so the user never sees a compact window jolt larger. The
    // page-side ensureRoomFor covers every other path (e.g. clicking the
    // Voices tab later); Chrome clamps oversized windows to the screen.
    try {
      const stored = await browser.storage.local.get(SETTINGS_DEEP_LINK_KEY);
      const link = parseSettingsDeepLink(stored?.[SETTINGS_DEEP_LINK_KEY]);
      if (link && isRoomySettingsTab(link.tab)) {
        width = STUDIO_WINDOW.width;
        height = STUDIO_WINDOW.height;
      }
    } catch (e) {
      // Best-effort sizing; the compact default is always safe.
    }

    // Firefox on Android does not support opening popup windows; open a tab instead
    if (isFirefox() && isMobileDevice()) {
      await browser.tabs.create({ url: popupURL, active: true });
      return;
    }

    await browser.windows.create({
      url: popupURL,
      type: 'popup',
      width,
      height,
      focused: true
    });
  } catch (error) {
    console.error('Failed to open popup:', error);
  }
}

/**
 * Find an existing settings tab if one is already open
 */
async function findExistingSettingsTab(settingsUrl: string): Promise<Browser.tabs.Tab | null> {
  try {
    // Query all tabs for our settings URL
    const tabs = await browser.tabs.query({ url: settingsUrl });
    if (tabs.length > 0) {
      return tabs[0];
    }

    // Also check with wildcard in case URL has query params or hash
    const baseUrl = settingsUrl.replace(/\?.*$/, '').replace(/#.*$/, '');
    const tabsWithWildcard = await browser.tabs.query({ url: baseUrl + '*' });
    if (tabsWithWildcard.length > 0) {
      return tabsWithWildcard[0];
    }

    return null;
  } catch (error) {
    // tabs.query may fail in some contexts, fall back to creating new window
    console.debug('Could not query tabs:', error);
    return null;
  }
}

// Open settings when the toolbar icon is clicked (no default_popup)
const actionNamespaces: Array<
  | {
      onClicked?: {
        addListener(callback: (tab?: unknown) => void): void;
      };
    }
  | undefined
> = [
  browser?.action,
  (browser as any)?.browserAction,
  typeof chrome !== 'undefined' ? (chrome.action as any) : undefined,
  typeof chrome !== 'undefined' ? (chrome as any).browserAction : undefined
];

for (const actionNamespace of actionNamespaces) {
  if (actionNamespace?.onClicked?.addListener) {
    actionNamespace.onClicked.addListener(() => {
      void openSettingsWindow();
    });
    break;
  }
}

import { config } from "../ConfigModule";
import { getJwtManagerSync, JwtManager } from "../JwtManager";
import { offscreenManager, OFFSCREEN_DOCUMENT_PATH } from "../offscreen/offscreen_manager";
import { logger } from "../LoggingModule.js";

// Handle JWT refresh alarm
browser.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === JwtManager.getRefreshAlarmName()) {
    logger.debug('[background] JWT refresh alarm triggered');
    const jwtManager = getJwtManagerSync();
    // Use performRefresh to prefer OAuth refresh token when available
    jwtManager.performRefresh().catch((error) => {
      logger.error('[background] JWT refresh from alarm failed:', error);
    });
  }
});
import getMessage from "../i18n";

const PERMISSIONS_PROMPT_PATH_HTML = 'permissions.html';

// Get the JWT manager instance at startup
const jwtManager = getJwtManagerSync();

// Expose instances globally for popup access
(self as any).jwtManager = jwtManager;

// Dev-only Layer-3 test hooks for the #308 offscreen-auto-shutdown regression net.
// The idle auto-shutdown is normally triggered by a guarded message FROM the
// offscreen document (the sender.url check in the message router below), which a
// test cannot forge — and the offscreen document is a `background_page` CDP target
// Playwright cannot reach as a Page. So we expose: (1) the exact method the
// OFFSCREEN_AUTO_SHUTDOWN handler invokes, to drive the shutdown deterministically
// (no 30s wall-clock wait); and (2) a read-only count of live content-script ports,
// to assert the shutdown does NOT evict them (the #308 invariant). Dead-code-
// eliminated from production builds (import.meta.env.DEV === false), mirroring the
// build-stamp seam added in #312.
if (import.meta.env.DEV) {
  // Arm the offscreen synthetic audio source for a tab, so a voice turn runs with
  // no human at the mic. sendMessageToOffscreenDocument ensures the offscreen doc
  // exists and stamps the tab id before forwarding.
  const armSyntheticSpeech = (tabId: number, opts: { loop?: boolean } = {}) =>
    offscreenManager.sendMessageToOffscreenDocument(
      {
        type: "VAD_USE_SYNTHETIC_AUDIO",
        enabled: true,
        loop: opts.loop === true, // default one-shot (#349) so end-of-speech fires → STT submits
        // Pick a clip at random so the transcript submitted to the assistant varies
        // run-to-run (and addresses the assistant, not the SayPi input layer). The
        // hermetic transcript is mocked, so selection can't affect CI assertions.
        clipUrl: getExtensionURL(pickSyntheticSpeechClip()),
        origin: "background",
      },
      tabId,
    );

  (self as any).__saypiOffscreenTestHooks = {
    closeOffscreenDocument: () => offscreenManager.closeOffscreenDocument(),
    connectedTabCount: () => offscreenManager.getConnectedTabCount(),
    // Layer 3 (Playwright) calls this on the SW directly with a known tab id.
    feedSyntheticSpeech: (tabId: number, opts: { loop?: boolean } = {}) => {
      armSyntheticSpeech(tabId, opts);
      return { ok: true };
    },
  };
  // Let the autonomous Layer-4 loop reload the unpacked extension without the
  // founder visiting chrome://extensions (the MCP cannot reach browser chrome).
  registerDevReloadHandler();
  // Layer 4 (MCP) page bridge: the content script forwards saypi:dev-feed-speech;
  // here we know the sender's tab id and arm synthetic speech for it.
  chrome.runtime.onMessage.addListener((message, sender) => {
    if (message?.type !== DEV_FEED_SPEECH_MESSAGE) return false;
    const tabId = sender?.tab?.id;
    if (typeof tabId === "number") {
      armSyntheticSpeech(tabId, { loop: message.loop });
    }
    return false;
  });
}

// Track dictation state across tabs
const dictationStates = new Map<number, boolean>(); // tabId -> isDictationActive

interface PendingAudioDispatch {
  type: string;
  tabId: number;
  url?: string;
  dispatchedAt: number;
}

interface QueuedAudioMessage {
  message: any;
  context: ReturnType<typeof buildAudioContextForLog>;
  key?: string;
}

interface AudioBridgeState {
  ready: boolean;
  queue: QueuedAudioMessage[];
  frameId?: number;
}

const pendingAudioDispatches: Map<string, PendingAudioDispatch> = new Map();
const AUDIO_BRIDGE_QUEUE_LIMIT = 25;
const audioBridgeStates: Map<number, AudioBridgeState> = new Map();

function buildAudioContextForLog(message: any, fallback?: PendingAudioDispatch) {
  const payload = message?.payload || {};
  const requestId = message?.requestMessageId || message?.messageId;
  const meta = fallback || (requestId ? pendingAudioDispatches.get(requestId) : undefined);
  return {
    requestId,
    requestType: meta?.type || message?.type,
    targetTabId: message?.targetTabId,
    url: meta?.url || message?.url,
    dispatchedAt: meta?.dispatchedAt,
    latencyMs: meta ? Date.now() - meta.dispatchedAt : undefined,
    payloadSuccess: payload.success,
    payloadError: payload.error
  };
}

function getAudioBridgeState(tabId: number): AudioBridgeState {
  let state = audioBridgeStates.get(tabId);
  if (!state) {
    state = { ready: false, queue: [] };
    audioBridgeStates.set(tabId, state);
  }
  return state;
}

function queueAudioMessage(
  tabId: number,
  message: any,
  context: ReturnType<typeof buildAudioContextForLog>,
  { front = false }: { front?: boolean } = {}
) {
  const state = getAudioBridgeState(tabId);
  const key = message?.requestMessageId || message?.messageId;

  if (key) {
    const existingIndex = state.queue.findIndex(entry => entry.key === key);
    if (existingIndex !== -1) {
      state.queue.splice(existingIndex, 1);
    }
  }

  const entry: QueuedAudioMessage = { message, context, key };

  if (front) {
    state.queue.unshift(entry);
  } else {
    state.queue.push(entry);
  }

  if (state.queue.length > AUDIO_BRIDGE_QUEUE_LIMIT) {
    const dropped = state.queue.pop();
    if (dropped) {
      logger.warn(`[Background] Dropping oldest queued audio message for tab ${tabId} after exceeding queue limit`, {
        requestType: dropped.message?.type,
        targetTabId: tabId
      });
    }
  }

  logger.debug(`[Background] Queued audio message ${message?.type} for tab ${tabId} awaiting bridge readiness`, {
    ...context,
    queuedCount: state.queue.length
  });
}

function flushQueuedAudioMessages(tabId: number) {
  const state = audioBridgeStates.get(tabId);
  if (!state || state.queue.length === 0) {
    return;
  }

  const queued = [...state.queue];
  state.queue = [];

  logger.debug(`[Background] Flushing ${queued.length} queued audio message(s) for tab ${tabId}`);
  for (const entry of queued) {
    sendAudioMessageToContent(tabId, entry.message, entry.context);
  }
}

function deliverAudioMessageToContent(
  tabId: number,
  message: any,
  audioContext: ReturnType<typeof buildAudioContextForLog>
) {
  const state = getAudioBridgeState(tabId);
  if (!state.ready) {
    queueAudioMessage(tabId, message, audioContext);
    return;
  }

  sendAudioMessageToContent(tabId, message, audioContext);
}

function markAudioBridgeReady(tabId: number, frameId?: number) {
  const state = getAudioBridgeState(tabId);
  const wasReady = state.ready;
  state.ready = true;

  if (typeof frameId === 'number') {
    state.frameId = frameId;
  }

  logger.debug(`[Background] Audio bridge reported ready for tab ${tabId}`, {
    queuedMessages: state.queue.length,
    wasReady,
    frameId: state.frameId,
    reportedFrameId: frameId
  });

  flushQueuedAudioMessages(tabId);
}

function sendAudioMessageToContent(
  tabId: number,
  message: any,
  audioContext: ReturnType<typeof buildAudioContextForLog>
) {
  try {
    const state = getAudioBridgeState(tabId);
    logger.debug('[Background] Dispatching audio message to content script', {
      tabId,
      frameId: state.frameId,
      requestType: message?.type,
      requestId: message?.requestMessageId || message?.messageId,
      queuedBeforeSend: state.queue.length,
    });

    const sendPromise =
      state.frameId !== undefined
        ? browser.tabs.sendMessage(tabId, message, { frameId: state.frameId })
        : browser.tabs.sendMessage(tabId, message);

    sendPromise
      .then(() => {
        logger.debug(`[Background] Successfully forwarded audio message to tab ${tabId}`, audioContext);
      })
      .catch((error: any) => {
        const errMsg = error?.message || String(error);
        const isNoResponse = errMsg.includes("The message port closed before a response was received");
        const isBridgeMissing =
          !isNoResponse &&
          (errMsg.includes("Receiving end does not exist") ||
            errMsg.includes("No tab with id") ||
            errMsg.includes("No frame with id"));

        if (isBridgeMissing) {
          state.ready = false;
          logger.warn(`[Background] Audio bridge unavailable; queuing message ${message.type} for tab ${tabId}`, {
            ...audioContext,
            error: errMsg,
          });
          queueAudioMessage(tabId, message, audioContext, { front: true });
        } else if (isNoResponse) {
          logger.debug(`[Background] Audio message ${message.type} delivered without explicit response`, {
            ...audioContext,
            error: errMsg,
          });
        } else {
          logger.error(`[Background] Error forwarding audio message: ${errMsg}`, audioContext);
        }
      });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`[Background] Exception forwarding audio message: ${errorMessage}`, audioContext);
  }
}

// Function to update context menu title based on dictation state
function updateContextMenuTitle(tabId: number, isDictationActive: boolean) {
  dictationStates.set(tabId, isDictationActive);
  
  const appName = getMessage("appName");
  const title = isDictationActive 
    ? getMessage("contextMenuStopDictation", appName)
    : getMessage("contextMenuStartDictation", appName);
    
  try {
    if (browser.contextMenus && typeof browser.contextMenus.update === 'function') {
      browser.contextMenus
        .update("start-dictation", {
          title,
        })
        .catch((error: any) => {
          console.debug("Failed to update context menu title:", error?.message || error);
        });
    }
  } catch {}
}

// Context menu setup for dictation + first-run onboarding tab
browser.runtime.onInstalled.addListener((details) => {
  try {
    if (!browser.contextMenus || typeof browser.contextMenus.create !== 'function') return;
    const appName = getMessage("appName");
    browser.contextMenus.create({
      id: "start-dictation",
      title: getMessage("contextMenuStartDictation", appName),
      contexts: ["editable"],
      documentUrlPatterns: [
        "file://*/*",
        "http://*/*",
        "https://*/*"
      ]
    });
  } catch {}

  // On a fresh install, open the onboarding tab once to guide the user to
  // their first spoken exchange (#437). Never fires on update; never re-nags.
  void maybeOpenFirstRunTab(details, {
    openTab: (url: string) => browser.tabs.create({ url, active: true }),
    getUrl: getExtensionURL,
    storage: {
      get: async (key: string) => (await browser.storage.local.get(key))[key],
      set: async (key: string, value: unknown) =>
        browser.storage.local.set({ [key]: value }),
    },
  });

  // On a fresh install (never an update), mark the chat hosts as pending a
  // default voice; the content script then adopts the server-recommended voice
  // on first use. Existing users are never touched (grandfathering).
  void seedVoiceDefaultsOnFreshInstall(details.reason, {
    get: async (key: string) => (await browser.storage.local.get(key))[key],
    set: async (key: string, value: unknown) => {
      await browser.storage.local.set({ [key]: value });
    },
  });
});

// Handle context menu clicks
try {
  if (browser.contextMenus && typeof browser.contextMenus.onClicked?.addListener === 'function') {
    browser.contextMenus.onClicked.addListener((info: any, tab: any) => {
      if (info.menuItemId === "start-dictation" && tab?.id) {
        const tabId = tab.id;
        const isDictationActive = dictationStates.get(tabId) || false;
        const messageType = isDictationActive
          ? "stop-dictation-from-context-menu"
          : "start-dictation-from-context-menu";
        browser.tabs.sendMessage(tabId, {
          type: messageType,
          frameId: info.frameId || 0
        }).catch((error: any) => {
          console.debug("Failed to send dictation message to content script:", error);
        });
      }
    });
  }
} catch {}

// Helper function to sanitize messages for logging by removing/truncating large data
function sanitizeMessageForLogs(message: any): any {
  if (!message || typeof message !== 'object') {
    return message;
  }
  
  // Create a sanitized copy
  const sanitizedMessage = { ...message };
  
  // Specifically handle audio data which is typically very large
  if (sanitizedMessage.audioData && Array.isArray(sanitizedMessage.audioData)) {
    sanitizedMessage.audioData = `[Array(${sanitizedMessage.audioData.length}) omitted from logs]`;
  }
  
  // Handle any other large arrays
  for (const key in sanitizedMessage) {
    if (
      sanitizedMessage[key] && 
      Array.isArray(sanitizedMessage[key]) && 
      sanitizedMessage[key].length > 100
    ) {
      sanitizedMessage[key] = `[Array(${sanitizedMessage[key].length}) omitted from logs]`;
    }
    
    // Handle nested objects (but avoid circular references)
    if (
      sanitizedMessage[key] && 
      typeof sanitizedMessage[key] === 'object' && 
      !Array.isArray(sanitizedMessage[key])
    ) {
      sanitizedMessage[key] = sanitizeMessageForLogs(sanitizedMessage[key]);
    }
  }
  
  return sanitizedMessage;
}

// Helper function to check auth cookie
async function checkAuthCookie() {
  if (!config.authServerUrl) {
    console.warn('Auth server URL not configured');
    return null;
  }
  
  const domain = new URL(config.authServerUrl).hostname;
  console.debug('Checking for auth cookie on domain:', domain);
  
  // For Firefox, we'll try a direct JWT refresh since we've fixed CORS on the server
  // This allows us to use the cookie without directly accessing it
  if (isFirefox()) {
    console.debug('Firefox detected - attempting direct JWT refresh');
    try {
      // During initial check, we still want to see errors, so no silent401
      await jwtManager.refresh(true, false);
      
      if (jwtManager.isAuthenticated()) {
        console.debug('Successfully authenticated via direct refresh in Firefox');
        // Return a synthetic cookie object to keep things working with existing code
        return {
          name: 'auth_session',
          value: 'firefox-synthetic-value',
          domain: domain
        };
      }
    } catch (error) {
      console.debug('Firefox direct refresh failed, will fall back to standard cookie check');
    }
  }
  
  // Standard method - try to get cookie directly (works in Chrome)
  try {
    const cookie = await browser.cookies.get({
      name: 'auth_session',
      url: config.authServerUrl
    });
    
    console.debug('Auth cookie status:', cookie ? 'found' : 'not found');
    return cookie;
  } catch (error) {
    console.error('Failed to check auth cookie:', error);
    return null;
  }
}

// New function to broadcast authentication status to all content scripts
async function broadcastAuthStatus() {
  const isAuthenticated = jwtManager.isAuthenticated();
  // Just log a single message about the broadcast
  console.log(`Broadcasting auth status (authenticated: ${isAuthenticated}) to content scripts`);
  
  try {
    // Query all tabs - we'll filter and handle errors silently
    const tabs = await browser.tabs.query({});
    
    // Track tabs where we successfully send messages
    let successCount = 0;
    
    // Send message to all tabs but handle errors silently
    for (const tab of tabs) {
      if (tab.id) {
        // Only log success or unexpected errors, not connection errors
        browser.tabs.sendMessage(tab.id, { 
          type: 'AUTH_STATUS_CHANGED',
          isAuthenticated,
          timestamp: Date.now()
        })
        .then(() => {
          // Message was delivered successfully - increment counter but don't log individually
          successCount++;
        })
        .catch((err: any) => {
          // Most errors will be "Could not establish connection" which we can ignore
          // Only log truly unexpected errors
          if (!err.message?.includes("Could not establish connection")) {
            console.error(`Unexpected error sending auth status to tab ${tab.id}: ${err.message}`);
          }
        });
      }
    }
    
    // After all promises settle, log success count (as info level, not debug)
    setTimeout(() => {
      console.log(`Auth status broadcast complete: ${successCount} tab(s) updated`);
    }, 500);
    
  } catch (error) {
    console.error('Failed to broadcast auth status:', error);
  }
}

// Initialize: check for existing auth cookie
checkAuthCookie().then(cookie => {
  if (cookie) {
    console.log('Found existing auth cookie, initializing JWT manager...');
    jwtManager.initialize().then(() => {
      // Broadcast initial auth status after initialization
      broadcastAuthStatus();
    });
  }
});

// Fallback polling mechanism for cookie changes
let lastAuthCookieValue: string | null = null;
// Track last direct refresh attempt time for Firefox to avoid hammering
let lastFirefoxRefreshAttempt = 0;
// Longer interval for Firefox since we now refresh on popup open
const FIREFOX_REFRESH_MIN_INTERVAL = 300000; // 5 minutes minimum between polling attempts (increased from 30 seconds)

async function pollAuthCookie() {
  if (!config.authServerUrl) return;
  
  try {
    // Special handling for Firefox extensions
    if (isFirefox()) {
      const now = Date.now();
      
      // If we're already authenticated via JWT, we don't need to check the cookie
      if (jwtManager.isAuthenticated()) {
        // We're already authenticated, so we don't need to do anything special
        // The JWT manager's internal refresh schedule will handle token renewals
        return;
      }
      
      // If not authenticated, try a direct refresh but with rate limiting
      // to avoid hammering the server
      if (now - lastFirefoxRefreshAttempt >= FIREFOX_REFRESH_MIN_INTERVAL) {
        console.debug('Firefox polling: attempting direct refresh');
        lastFirefoxRefreshAttempt = now;
        
        try {
          // Pass silent401=true to suppress error logging for expected 401 responses
          await jwtManager.refresh(true, true);
          
          if (jwtManager.isAuthenticated()) {
            console.debug('Firefox polling: authentication successful');
            // Create a synthetic cookie value for state tracking
            lastAuthCookieValue = 'firefox-synthetic-value';
          } else {
            // This is an expected state during polling, so just debug log
            console.debug('Firefox polling: not authenticated (expected during polling)');
          }
        } catch (error) {
          // Should only get here for non-401 errors
          console.warn('Firefox polling: unexpected error during refresh', error);
        }
      }
      
      return; // Skip standard cookie checking for Firefox
    }
    
    // Standard approach for Chrome and other browsers
    const cookie = await browser.cookies.get({
      name: 'auth_session',
      url: config.authServerUrl
    });
    
    if (cookie) {
      if (cookie.value !== lastAuthCookieValue) {
        console.debug('Cookie change detected via polling:', cookie.value);
        lastAuthCookieValue = cookie.value;
        await jwtManager.storeAuthCookieValue(cookie.value);
        // Use silent401=true for polling to avoid error logging
        await jwtManager.refresh(true, true);
      }
    } else {
      if (lastAuthCookieValue !== null) {
        console.debug('Cookie removal detected via polling. Clearing JWT.');
        lastAuthCookieValue = null;
        jwtManager.clear();
      }
    }
  } catch (error) {
    console.error('Error polling auth cookie:', error);
  }
}

// Auth state change listener - reacts immediately when JWT token changes in storage
// This replaces the old polling mechanism for much faster, event-driven updates
browser.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'local') return;

  // React to JWT token changes
  if (changes.jwtToken) {
    const hadToken = !!changes.jwtToken.oldValue;
    const hasToken = !!changes.jwtToken.newValue;

    if (hadToken !== hasToken) {
      console.log(`Auth state changed via storage: ${hadToken ? 'signed out' : 'signed in'}`);
      // Broadcast immediately to all tabs
      broadcastAuthStatus();
    }
  }
});

// Keep a minimal polling interval as a fallback for edge cases (e.g., cookie set without JWT update)
// This is much less frequent since we now have event-driven updates
const pollingInterval = isFirefox() ? 300000 : 60000; // 5 minutes for Firefox, 1 minute for others (was 5 seconds)
setInterval(pollAuthCookie, pollingInterval);

// Handle VAD communication via Offscreen Document
browser.runtime.onConnect.addListener((port: any) => {
  // Handle connections from content scripts for VAD and audio
  if (port.name === "vad-content-script-connection" || port.name === "media-content-script-connection") {
    logger.debug(`[Background] Port connection established: ${port.name} from tab ${port.sender?.tab?.id}`);
    offscreenManager.registerContentScriptConnection(port);
  } else {
    logger.debug(`[Background] Unhandled port connection type: ${port.name}`);
  }
});

function replyToRequester(
  sender: any,
  payload: any
) {
  if (sender.tab?.id !== undefined) {
    // Came from a content script – send directly to that tab
    browser.tabs.sendMessage(sender.tab.id, payload);
  } else {
    // Came from another extension page (popup, off-screen, etc.)
    browser.runtime.sendMessage(payload).catch(() => undefined);   // fallback broadcast
  }
}

async function handleCheckAndRequestMicPermission(originalRequestId: string, originalSender: any) {
  logger.debug(`[Background] Handling CHECK_AND_REQUEST_MICROPHONE_PERMISSION for request ID ${originalRequestId} from sender: ${originalSender}`);
  try {
    const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
    logger.debug(`[Background] Microphone permission state for extension origin: ${permissionStatus.state}`);

    if (permissionStatus.state === 'granted') {
      // Remember the mic was granted, so a later revocation (e.g. after an OS
      // update) can be recognised as a loss rather than a first-time prompt (#437).
      try { await browser.storage.local.set({ [MIC_GRANTED_FLAG]: true }); } catch { /* non-fatal */ }
      replyToRequester(originalSender, {
        type: 'MICROPHONE_PERMISSION_RESPONSE',
        requestId: originalRequestId,
        granted: true
      });
      return;
    }

    // If 'denied' or 'prompt', proceed to open the permissions tab. If the mic
    // was previously granted, this is a revocation — flag the page so it shows
    // tailored "your access was turned off" recovery copy (#437).
    let micPreviouslyGranted = false;
    try {
      micPreviouslyGranted = !!(await browser.storage.local.get(MIC_GRANTED_FLAG))[MIC_GRANTED_FLAG];
    } catch { /* default false */ }
    const isPermissionLoss = detectPermissionLoss(micPreviouslyGranted, permissionStatus.state);
    const permissionsPageUrl = buildPermissionsUrl(getExtensionURL(PERMISSIONS_PROMPT_PATH_HTML), isPermissionLoss);
    let newTabId: number | undefined;
    let handlingPrompt = true; // Flag to manage listeners correctly

    const cleanupPromptListeners = () => {
      if (!handlingPrompt) return;
      handlingPrompt = false; // Prevent re-entry or duplicate cleanups
      logger.debug(`[Background] Cleaning up listeners for permission request ${originalRequestId}`);
      browser.runtime.onMessage.removeListener(messageListenerFromPromptTab);
      if (newTabId !== undefined) {
        browser.tabs.onRemoved.removeListener(removedListenerForPromptTab);
      }
    };

    const sendFinalResponseToRequester = (granted: boolean, error?: string) => {
      if (!handlingPrompt) { // If listeners already cleaned up (e.g. tab closed by user first)
        logger.debug(`[Background] Attempted to send final response for ${originalRequestId}, but already handled.`);
        return;
      }
      logger.debug(`[Background] Sending final MICROPHONE_PERMISSION_RESPONSE for ${originalRequestId}: granted=${granted}, error=${error}`);
      // Record a (re)grant so a future revocation is detected as a loss (#437).
      if (granted) {
        browser.storage.local.set({ [MIC_GRANTED_FLAG]: true }).catch(() => undefined);
      }
      replyToRequester(originalSender, {
        type: 'MICROPHONE_PERMISSION_RESPONSE',
        requestId: originalRequestId,
        granted: granted,
        error: error
      });
      cleanupPromptListeners();
    };

    const messageListenerFromPromptTab = (msg: any, senderFromPrompt: any) => {
      if (senderFromPrompt.tab?.id === newTabId && msg.type === 'PERMISSION_PROMPT_RESULT') {
        logger.debug(`[Background] Received PERMISSION_PROMPT_RESULT from tab ${newTabId} for request ${originalRequestId}: granted=${msg.granted}`);
        sendFinalResponseToRequester(msg.granted, msg.error);
        // The permissions-prompt.js will close its own tab.
      }
    };

    const removedListenerForPromptTab = (tabId: number, removeInfo: any) => {
      if (tabId === newTabId) {
        logger.debug(`[Background] Permissions tab ${newTabId} for request ${originalRequestId} was removed by user or closed.`);
        // If the tab is removed before the prompt page sends its message, consider it a denial or interruption.
        sendFinalResponseToRequester(false, 'Permission prompt closed by user or failed to respond.');
      }
    };
    
    browser.runtime.onMessage.addListener(messageListenerFromPromptTab);

    try {
      logger.debug(`[Background] Creating permissions tab for request ${originalRequestId} with URL: ${permissionsPageUrl}`);
      const tab = await browser.tabs.create({ url: permissionsPageUrl, active: true });
      newTabId = tab.id;
      if (newTabId === undefined) { 
        throw new Error("Failed to create permissions tab (no ID returned).");
      }
      browser.tabs.onRemoved.addListener(removedListenerForPromptTab);
      logger.debug(`[Background] Permissions tab ${newTabId} created and listeners attached for request ${originalRequestId}`);
    } catch (tabError: any) {
      logger.error(`[Background] Error creating permissions tab for request ${originalRequestId}:`, tabError);
      sendFinalResponseToRequester(false, `Failed to open permissions tab: ${tabError.message || tabError.toString()}`);
    }

  } catch (queryError: any) {
    logger.error(`[Background] Error querying microphone permission for request ${originalRequestId}:`, queryError);
    replyToRequester(originalSender, {
      type: 'MICROPHONE_PERMISSION_RESPONSE',
      requestId: originalRequestId,
      granted: false,
      error: `Failed to query microphone permission status: ${queryError.message || queryError.toString()}`
    });
  }
}

/**
 * Handles API requests from content scripts by performing the fetch in the background
 * service worker context to bypass CSP restrictions.
 */
async function handleApiRequest(message: any, sendResponse: (response: any) => void) {
  try {
    logger.debug(`[Background] Handling API request to: ${message.url}`);
    
    // Deserialize the API request
    const { url, options } = deserializeApiRequest(message as SerializedApiRequest);
    
    // Get JWT manager and add auth headers if needed
    const headers = new Headers(options.headers);

    // Determine if this is an auth refresh request; avoid attaching bearer to refresh calls
    const isAuthRefreshRequest = (() => {
      try {
        const u = new URL(url);
        return u.pathname.includes('/auth/refresh');
      } catch { return false; }
    })();

    // Add authorization header only for whitelisted SayPi hosts, excluding auth refresh
    try {
      const hostname = new URL(url).hostname;
      const allowedHosts = new Set<string>(['api.saypi.ai', 'www.saypi.ai']);
      try { if (config?.apiServerUrl) allowedHosts.add(new URL(config.apiServerUrl).hostname); } catch {}
      try { if (config?.authServerUrl) allowedHosts.add(new URL(config.authServerUrl).hostname); } catch {}
      if (allowedHosts.has(hostname) && !isAuthRefreshRequest) {
        const authHeader = jwtManager.getAuthHeader();
        if (authHeader) {
          headers.set('Authorization', authHeader);
        }
      }
    } catch {}
    
    // Update request options with auth headers
    const requestOptions: RequestInit = {
      ...options,
      headers
    };
    
    logger.debug(`[Background] Making API request`, { 
      method: options.method || 'GET',
      hasAuthHeader: headers.has('Authorization'),
      url: url
    });
    
    // Perform the fetch request
    let response = await fetch(url, requestOptions);
    
    // Handle 401/403 responses with token refresh and retry (not for auth refresh requests)
    if (!isAuthRefreshRequest && (response.status === 401 || response.status === 403) && headers.has('Authorization')) {
      logger.debug('[Background] Received 401/403, attempting to refresh token...');
      await jwtManager.refresh(true);
      
      const newAuthHeader = jwtManager.getAuthHeader();
      if (newAuthHeader) {
        // Update headers with new token
        headers.set('Authorization', newAuthHeader);
        const retryOptions: RequestInit = {
          ...options,
          headers
        };
        
        logger.debug('[Background] Token refreshed, retrying request with new token...');
        response = await fetch(url, retryOptions);
      } else {
        logger.warn('[Background] Token refresh failed, returning original response');
      }
    }
    
    // Convert response to serializable format
    const responseData: {
      ok: boolean;
      status: number;
      statusText: string;
      headers: Record<string, string>;
      body: any;
    } = {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: {},
      body: null
    };
    
    // Serialize response headers
    response.headers.forEach((value, key) => {
      responseData.headers[key] = value;
    });
    
    // Read response body according to requested responseType (default: text)
    const responseType = (options as any).responseType as ('json'|'text'|'arrayBuffer') | undefined;
    try {
      if (responseType === 'json') {
        // Attempt JSON parse; if fails, fall back to text
        try {
          responseData.body = await response.json();
        } catch {
          responseData.body = await response.text();
        }
      } else if (responseType === 'arrayBuffer') {
        const buf = await response.arrayBuffer();
        // Structured clone can carry ArrayBuffer directly
        responseData.body = buf;
      } else {
        responseData.body = await response.text();
      }
    } catch (error) {
      logger.warn('[Background] Failed to read response body:', error);
      responseData.body = null;
    }
    
    logger.debug(`[Background] API request completed with status: ${response.status}`);
    sendResponse({ success: true, response: responseData });
    
  } catch (error) {
    logger.error('[Background] API request failed:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    sendResponse({ 
      success: false, 
      error: errorMessage,
      name: error instanceof Error ? error.name : 'UnknownError'
    });
  }
}

// Handle popup opening AND messages from Offscreen Document AND Error Reports AND Mic Permissions
browser.runtime.onMessage.addListener((message: any, sender: any, sendResponse: any) => {
  // Sanitize the message for logging
  const sanitizedMessage = sanitizeMessageForLogs(message);
  logger.debug(`[Background] onMessage received ${sanitizedMessage.type} from ${sender.tab?.title || sender.url}`);

  if (message?.type === "AUDIO_BRIDGE_READY") {
    const tabId = sender?.tab?.id ?? message?.tabId ?? message?.sourceTabId;
    if (typeof tabId === "number") {
      const frameId = typeof sender?.frameId === 'number' ? sender.frameId : undefined;
      logger.debug('[Background] AUDIO_BRIDGE_READY handshake context', {
        tabId,
        frameId,
        messageFrameId: message?.frameId,
        senderFrameId: typeof sender?.frameId === 'number' ? sender.frameId : undefined,
      });
      markAudioBridgeReady(tabId, frameId);
      sendResponse?.({ status: "bridge_acknowledged" });
    } else {
      logger.warn('[Background] Received AUDIO_BRIDGE_READY without tab context');
    }
    return false;
  }

  // --- START: Microphone Permission Handling ---
  if (message.type === 'CHECK_AND_REQUEST_MICROPHONE_PERMISSION' && message.requestId) {
    // Ensure the sender is from the extension itself (e.g., AudioInputMachine)
    // content scripts will have sender.id as undefined, extension pages will have browser.runtime.id
    if (sender.id === browser.runtime.id || sender.url?.startsWith(getExtensionURL(''))) {
      logger.debug("[Background] Received CHECK_AND_REQUEST_MICROPHONE_PERMISSION from valid sender.");
      handleCheckAndRequestMicPermission(message.requestId, sender);
      // Acknowledge the request. The actual result is sent asynchronously by handleCheckAndRequestMicPermission.
      sendResponse({ status: 'processing_permission_check_acknowledged' }); 
    } else {
      logger.warn("[Background] CHECK_AND_REQUEST_MICROPHONE_PERMISSION from unexpected sender:", sender);
      sendResponse({ status: 'error_before_prompt', error: 'Unauthorized sender for permission check' });
    }
    return false;
  }
  // --- END: Microphone Permission Handling ---

  // --- START: Save Segmented WAV to Downloads ---
  if (message.type === 'SAVE_SEGMENT_WAV' && typeof message.base64 === 'string' && typeof message.filename === 'string') {
    try {
      const url = `data:audio/wav;base64,${message.base64}`;
      browser.downloads
        .download({
          url,
          filename: message.filename,
          saveAs: false,
          conflictAction: 'uniquify',
        })
        .then((downloadId: any) => {
          logger.debug(`[Background] Queued segment download: ${downloadId} -> ${message.filename}`);
          sendResponse({ ok: true, id: downloadId });
        })
        .catch((error: any) => {
          logger.error('[Background] Failed to queue segment download:', error);
          sendResponse({ ok: false, error: error?.message || 'download_failed' });
        });
      return true; // async
    } catch (error: any) {
      logger.error('[Background] Exception while saving segment:', error);
      sendResponse({ ok: false, error: error?.message || 'unknown' });
      return false;
    }
  }
  // --- END: Save Segmented WAV to Downloads ---

  // --- START: Offscreen API Support Check ---
  if (message.type === 'CHECK_OFFSCREEN_SUPPORT') {
    try {
      // Check if browser.offscreen is available
      const isOffscreenSupported = typeof browser.offscreen !== 'undefined';
      logger.debug(`[Background] Checking offscreen support: ${isOffscreenSupported}`);
      
      // Send the result back to the content script
      sendResponse({ 
        supported: isOffscreenSupported,
        hasHasDocument: typeof browser.offscreen?.hasDocument === 'function'
      });
    } catch (error: any) {
      logger.error("[Background] Error checking offscreen support:", error);
      sendResponse({ supported: false, error: error.message });
    }
    return false;
  }
  // --- END: Offscreen API Support Check ---

  // --- START: Audio Request Debug Logging ---
  if (message.type === "AUDIO_PLAY_REQUEST" || 
      (typeof message.type === "string" && message.type.includes("AUDIO_"))) {
    logger.debug(`[Background] 🔊 Received audio message: ${message.type}`, {
      url: message.url,
      sender: sender.tab ? `Tab ${sender.tab.id}` : "Extension",
      timestamp: Date.now()
    });
    
    // --- START: Direct Audio Message Handling ---
    // If this is a direct message from the content script (not from offscreen)
    if (sender.tab && message.source === "content-script") {
      const messageId = typeof message.messageId === 'string'
        ? message.messageId
        : `audio-${sender.tab.id}-${Date.now()}`;

      const messageForOffscreen = {
        ...message,
        messageId,
        sourceTabId: sender.tab.id,  // Ensure sourceTabId is explicit
        tabId: sender.tab.id         // Also set tabId for compatibility
      };

      logger.debug(`[Background] Forwarding direct audio message to offscreen document: ${messageForOffscreen.type}`, {
        messageId,
        tabId: sender.tab.id,
        url: messageForOffscreen.url
      });

      pendingAudioDispatches.set(messageId, {
        type: messageForOffscreen.type,
        tabId: sender.tab.id,
        url: messageForOffscreen.url,
        dispatchedAt: Date.now()
      });

      offscreenManager
        .sendMessageToOffscreenDocument(messageForOffscreen, sender.tab.id)
        .catch((error: unknown) => {
          const errorMessage = error instanceof Error ? error.message : String(error);
          const context = buildAudioContextForLog({
            messageId,
            type: messageForOffscreen.type,
            url: messageForOffscreen.url,
            targetTabId: sender.tab?.id
          });
          pendingAudioDispatches.delete(messageId);
          offscreenManager.resolveAudioDispatch(messageId);
          logger.error(`[Background] Failed to forward audio message to offscreen: ${errorMessage}`, context);
        });
      
      // Acknowledge receipt of the message
      sendResponse({ 
        status: "audio_message_forwarded", 
        messageId,
        timestamp: Date.now()
      });
      
      return false;
    }
    // --- END: Direct Audio Message Handling ---
  }
  // --- END: Audio Request Debug Logging ---

  // --- START: Offscreen Document Message Routing ---
  /**
   * IMPORTANT: Message Routing Architecture
   * 
   * This extension has two clients in the content script that handle offscreen communication:
   * 
   * 1. OffscreenVADClient (src/vad/OffscreenVADClient.ts):
   *    - Uses browser.runtime.connect() with port-based messaging
   *    - Handles VAD_* and OFFSCREEN_VAD_* messages
   *    - Receives messages via offscreenManager.forwardMessageToContentScript() -> port.postMessage()
   * 
   * 2. OffscreenAudioBridge (src/audio/OffscreenAudioBridge.js):
   *    - Uses browser.runtime.onMessage.addListener() for direct messaging
   *    - Handles AUDIO_* and OFFSCREEN_AUDIO_* messages
   *    - Receives messages via browser.tabs.sendMessage()
   * 
   * The routing logic below prevents message cross-contamination by routing messages
   * based on their type prefix to the appropriate client communication channel.
   */
  // Prioritize messages from the offscreen document (VAD events)
  if (
    typeof OFFSCREEN_DOCUMENT_PATH === 'string' &&
    sender.url === getExtensionURL(OFFSCREEN_DOCUMENT_PATH) &&
    message.origin === "offscreen-document"
  ) {
    // Handle auto-shutdown request
    if (message.type === "OFFSCREEN_AUTO_SHUTDOWN") {
      logger.debug("[Background] Received auto-shutdown request from offscreen document");
      offscreenManager.closeOffscreenDocument();
      return;
    }
    
    // Route messages based on type to the appropriate client
    if (message.targetTabId !== undefined) {
      logger.debug("[Background] Received event from offscreen document:", sanitizedMessage);
      
      // Route VAD messages via port to OffscreenVADClient
      if (message.type.startsWith("VAD_") || message.type.startsWith("OFFSCREEN_VAD_")) {
        logger.debug(`[Background] Routing VAD message via port: ${message.type}`);
        offscreenManager.forwardMessageToContentScript(message.targetTabId, message);
        return; // Stop processing - message handled via port
      }
      
      // Route audio messages via browser.tabs.sendMessage to OffscreenAudioBridge
      if (message.type.startsWith("AUDIO_") || message.type.startsWith("OFFSCREEN_AUDIO_")) {
        logger.debug(`[Background] Routing audio message via tabs.sendMessage: ${message.type}`);

        let dispatchMeta: PendingAudioDispatch | undefined;
        if (typeof message.requestMessageId === 'string') {
          dispatchMeta = pendingAudioDispatches.get(message.requestMessageId);
          if (dispatchMeta) {
            pendingAudioDispatches.delete(message.requestMessageId);
          }
          const resolved = offscreenManager.resolveAudioDispatch(message.requestMessageId);
          if (!dispatchMeta && resolved) {
            dispatchMeta = resolved as PendingAudioDispatch;
          }
        }

        const audioContext = buildAudioContextForLog(message, dispatchMeta);
        if (message.payload?.error) {
          logger.warn(`[Background] Offscreen audio response indicates failure: ${message.type}`, audioContext);
        } else if (message.type.startsWith("OFFSCREEN_AUDIO_")) {
          logger.info(`[Background] Offscreen audio response received: ${message.type}`, audioContext);
        }

        deliverAudioMessageToContent(message.targetTabId, message, audioContext);
        return; // Stop processing - message handled via tabs.sendMessage
      }
      
      // For other message types, use the default port routing
      logger.debug(`[Background] Routing other message via port: ${message.type}`);
      offscreenManager.forwardMessageToContentScript(message.targetTabId, message);
      return; // Stop processing if handled as an offscreen event
    }
  }
  // --- END: Offscreen Document Message Routing ---

  // Handle error reports from any part of the extension using the logger
  if (message.type === "LOG_ERROR_REPORT" && message.origin === "logger-reportError") {
    logger.error("[Background] Error reported from extension module:", message.error.message, message.error);
    sendResponse({ status: "error_logged" });
    return; // Synchronous, error logged.
  }

  if (message.action === 'openPopup' || message.type === 'openPopup') {
    openSettingsWindow();
  } else if (message.type === 'GET_TTS_QUOTA_DETAILS') {
    // Handle TTS quota details request
    try {
      const quotaDetails = jwtManager.getTTSQuotaDetails();
      sendResponse(quotaDetails);
    } catch (error: any) {
      logger.error('Failed to get quota details:', error);
      sendResponse(null);
    }
    return false; // Synchronous response
  } else if (message.type === 'GET_STT_QUOTA_DETAILS') {
    // Handle STT quota details request
    try {
      const sttQuotaDetails = jwtManager.getSTTQuotaDetails();
      sendResponse(sttQuotaDetails);
    } catch (error: any) {
      logger.error('Failed to get STT quota details:', error);
      sendResponse(null);
    }
    return false; // Synchronous response
  } else if (message.type === 'GET_JWT_CLAIMS') {
    // Handle JWT claims request - async handler
    (async () => {
      try {
        // For Firefox, try to refresh the token whenever the popup opens
        if (isFirefox()) {
          console.debug('Firefox detected: refreshing token on popup open');
          
          // Use silent refresh to avoid errors for expected 401 responses
          try {
            await jwtManager.refresh(false, true);
          } catch (refreshError) {
            console.debug('Refresh attempt on popup open failed:', refreshError);
            // Continue with getting claims even if refresh fails
          }
        }
        
        // Now get the claims (which will reflect the refreshed state if refresh succeeded)
        const claims = jwtManager.getClaims();
        sendResponse({ claims });
      } catch (error) {
        console.error('Failed to get JWT claims:', error);
        sendResponse({ claims: null });
      }
    })();
    return true; // Async sendResponse executes inside IIFE
  } else if (message.type === 'CHECK_FEATURE_ENTITLEMENT') {
    // Check if user is entitled to a specific feature
    (async () => {
      try {
        const hasEntitlement = jwtManager.hasFeatureEntitlement(message.feature);
        sendResponse({ hasEntitlement });
      } catch (error: any) {
        logger.error('Failed to check feature entitlement:', error);
        sendResponse({ hasEntitlement: false });
      }
    })();
    return true; // Async sendResponse executes inside IIFE
  } else if (message.type === 'AUTHENTICATE_WITH_PKCE') {
    // Handle PKCE authentication request
    (async () => {
      try {
        // Detailed logging for PKCE support check
        logger.debug('[Background] AUTHENTICATE_WITH_PKCE received, checking identity API:', {
          browserIdentityExists: typeof browser.identity !== 'undefined',
          launchWebAuthFlowExists: typeof browser.identity?.launchWebAuthFlow,
          getRedirectURLExists: typeof browser.identity?.getRedirectURL,
        });

        const pkceSupported = isPKCESupported();
        logger.debug('[Background] isPKCESupported() returned:', pkceSupported);

        if (!pkceSupported) {
          logger.debug('[Background] PKCE not supported, falling back to tab flow');
          sendResponse({ success: false, error: 'pkce_not_supported', useFallback: true });
          return;
        }

        logger.debug('[Background] Starting PKCE authentication');
        isPKCEAuthInProgress = true;

        try {
          const result = await authenticate();
          logger.debug('[Background] authenticate() returned:', {
            success: result.success,
            error: result.success ? undefined : (result as any).error,
            errorDescription: result.success ? undefined : (result as any).errorDescription,
          });

          if (result.success) {
            // Store tokens in JwtManager
            await jwtManager.setOAuthTokens(
              result.tokens.access_token,
              result.tokens.expires_in,
              result.tokens.refresh_token
            );

            // Broadcast auth status change
            broadcastAuthStatus();

            sendResponse({
              success: true,
              claims: jwtManager.getClaims()
            });

            // Best-effort onboarding hint for wizard-skippers: capture voiceGoal
            // (from the site the user connected from) and UI locale so the SaaS
            // can populate User.voiceGoal / signupLocale for the ~89% who never
            // complete the web wizard (#490 / saypi-saas#225). Fire-and-forget:
            // it runs after sendResponse and never affects the connect flow.
            try {
              const voiceGoal = voiceGoalFromUrl(sender?.tab?.url);
              const locale =
                typeof browser.i18n?.getUILanguage === "function"
                  ? browser.i18n.getUILanguage()
                  : undefined;
              void sendOnboardingHint(result.tokens.access_token, {
                voiceGoal,
                locale,
              });
            } catch (hintError) {
              logger.debug(
                "[Background] onboarding hint dispatch skipped:",
                hintError
              );
            }
          } else {
            logger.warn('[Background] PKCE authentication failed:', result.error);
            sendResponse({
              success: false,
              error: result.error,
              errorDescription: result.errorDescription
            });
          }
        } finally {
          isPKCEAuthInProgress = false;
        }
      } catch (error: any) {
        isPKCEAuthInProgress = false;
        logger.error('[Background] PKCE authentication error:', error);
        sendResponse({
          success: false,
          error: 'auth_error',
          errorDescription: error.message || 'Authentication failed'
        });
      }
    })();
    return true; // Async sendResponse executes inside IIFE
  } else if (message.type === 'REDIRECT_TO_LOGIN') {
    // Handle login redirect request - async handler (legacy cookie-based flow)
    (async () => {
      try {
        if (config.authServerUrl) {
          // Check cookie first
          const cookie = await browser.cookies.get({
            name: 'auth_session',
            url: config.authServerUrl
          });

          if (!cookie) {
            // No cookie present, redirect to login immediately
            browser.tabs.create({
              url: `${config.authServerUrl}/auth/login`
            });
            sendResponse({ authenticated: false });
            return;
          }

          // Cookie exists, try to refresh
          try {
            await jwtManager.refresh(true);

            if (jwtManager.isAuthenticated()) {
              // Refresh succeeded, notify popup
              sendResponse({ authenticated: true });
            } else {
              // Refresh failed or token invalid, redirect to login
              browser.tabs.create({
                url: `${config.authServerUrl}/auth/login`
              });
              sendResponse({ authenticated: false });
            }
          } catch (error) {
            console.error('Failed to refresh token:', error);
            // On refresh failure, redirect to login
            browser.tabs.create({
              url: `${config.authServerUrl}/auth/login`
            });
            sendResponse({ authenticated: false });
          }
        } else {
          console.error('Auth server URL not configured');
          sendResponse({ authenticated: false });
        }
      } catch (error) {
        console.error('Failed to check auth state:', error);
        // On any error, try redirect to login
        if (config.authServerUrl) {
          browser.tabs.create({
            url: `${config.authServerUrl}/auth/login`
          });
        }
        sendResponse({ authenticated: false });
      }
    })();
    return true; // Async sendResponse executes inside IIFE
  } else if (message.type === 'SIGN_OUT') {
    // Handle sign out request - make this block async
    (async () => {
      try {
        // Clear the JWT token first (this sets isClearing flag to prevent race conditions)
        await jwtManager.clear();

        // Clear the auth cookie
        if (config.authServerUrl) {
          await browser.cookies.remove({
            name: 'auth_session',
            url: config.authServerUrl
          });
        }

        // Broadcast auth status change (already called by overridden clear(), but ensure final state)
        broadcastAuthStatus();

        sendResponse({ success: true });
      } catch (error: any) {
        logger.error('Failed to sign out:', error);
        sendResponse({ success: false });
      }
    })();
    return true; // Async sendResponse executes inside IIFE
  } else if (message.type === 'GET_AUTH_STATUS') {
    // New handler for direct auth status requests from content scripts
    try {
      const isAuthenticated = jwtManager.isAuthenticated();
      logger.debug(`[Background] Auth status: ${isAuthenticated}`);
      sendResponse({ isAuthenticated });
    } catch (error: any) {
      logger.error('Failed to get auth status:', error);
      sendResponse({ isAuthenticated: false });
    }
    return false; // Synchronous response
  } else if (message.type === 'DICTATION_STATE_CHANGED') {
    // Handle dictation state changes from content scripts
    if (sender.tab?.id) {
      const isDictationActive = message.isDictationActive || false;
      updateContextMenuTitle(sender.tab.id, isDictationActive);
      logger.debug(`[Background] Dictation state updated for tab ${sender.tab.id}: ${isDictationActive}`);
    }
    sendResponse({ success: true });
    return false; // Synchronous response
  }
  
  // --- START: API Request Proxy Handler ---
  if (message.type === 'API_REQUEST') {
    handleApiRequest(message, sendResponse);
    return true; // Async sendResponse executed in handleApiRequest
  }
  // --- END: API Request Proxy Handler ---

  
  // Return true if we're handling the response asynchronously for other message types
  // This ensures that the sendResponse function remains valid for async operations
  // like REDIRECT_TO_LOGIN, GET_JWT_CLAIMS, etc.
  // Default: do not keep the channel open unless a handler above already returned true
  
  // If no specific handler matched or it was synchronous and didn't return true,
  // we don't need to keep the message channel open.
  logger.debug("[Background] Message type not explicitly handled or was synchronous:", message.type);
  // sendResponse({}); // Optional: send a default empty response if required by some senders
  return false; // Ensure channel is closed if not handled asynchronously
});

// Clean up dictation state when tabs are closed
browser.tabs.onRemoved.addListener((tabId: any) => {
  if (dictationStates.has(tabId)) {
    dictationStates.delete(tabId);
    logger.debug(`[Background] Cleaned up dictation state for closed tab ${tabId}`);
  }
  if (audioBridgeStates.delete(tabId)) {
    logger.debug(`[Background] Cleared audio bridge state for closed tab ${tabId}`);
  }
});

/**
 * Handles return-to-context after successful authentication.
 * Closes the auth tab and reopens the settings page.
 */
async function handleAuthReturnToContext() {
  try {
    const { authReturnUrl } = await browser.storage.local.get('authReturnUrl');
    if (!authReturnUrl) return;

    console.log('Auth completed - handling return to context:', authReturnUrl);

    // Clear the return URL immediately to prevent duplicate handling
    await browser.storage.local.remove('authReturnUrl');

    // Close all auth server tabs
    if (config.authServerUrl) {
      const authTabs = await browser.tabs.query({ url: `${config.authServerUrl}/*` });
      for (const tab of authTabs) {
        if (tab.id !== undefined) {
          try {
            await browser.tabs.remove(tab.id);
            console.debug(`Closed auth tab ${tab.id}`);
          } catch (e) {
            console.debug('Failed to close auth tab:', e);
          }
        }
      }
    }

    // Open the return URL if it's an extension URL
    if (authReturnUrl.startsWith('chrome-extension://') ||
        authReturnUrl.startsWith('moz-extension://')) {
      // Check if the settings page is already open
      const extensionTabs = await browser.tabs.query({ url: authReturnUrl });
      if (extensionTabs.length > 0 && extensionTabs[0].id !== undefined) {
        // Focus existing tab
        await browser.tabs.update(extensionTabs[0].id, { active: true });
        console.debug('Focused existing settings tab');
      } else {
        // Open new settings tab
        await browser.tabs.create({ url: authReturnUrl, active: true });
        console.debug('Opened new settings tab');
      }
    }
  } catch (error) {
    console.error('Failed to handle return to context:', error);
  }
}

// Handle authentication cookie changes
browser.cookies.onChanged.addListener(async (changeInfo: any) => {
  const { cookie, removed, cause } = changeInfo;

  // Only interested in our auth cookie
  if (cookie.name === 'auth_session' && config.authServerUrl && cookie.domain === new URL(config.authServerUrl).hostname) {
    console.debug('Auth session cookie changed:', {
      removed,
      cause,
      domain: cookie.domain
    });

    // Only refresh on explicit cookie additions or updates
    if (!removed && (cause === 'explicit' || cause === 'overwrite')) {
      // Store the cookie value for fallback authentication
      await jwtManager.storeAuthCookieValue(cookie.value);

      // Attempt to refresh token
      const wasAuthenticated = jwtManager.isAuthenticated();

      if (!wasAuthenticated) {
        await jwtManager.refresh();

        // Broadcast auth status change after refresh
        broadcastAuthStatus();
      }

      // Handle return-to-context after successful auth
      // Skip this when PKCE auth is in progress - PKCE flow manages its own completion
      // Only do this for tab-based auth flow (Firefox or fallback)
      if (jwtManager.isAuthenticated() && !isPKCEAuthInProgress) {
        await handleAuthReturnToContext();
      }
    } else if (removed) {
      // If cookie was removed, clear JWT and broadcast status change
      await jwtManager.clear();
      // broadcastAuthStatus() is already called by the overridden clear()
    }
  }
});

// Override the refresh method to broadcast auth status after refreshing
const originalRefresh = jwtManager.refresh.bind(jwtManager);
jwtManager.refresh = async (force = false) => {
  const wasAuthenticated = jwtManager.isAuthenticated();
  await originalRefresh(force);
  const isAuthenticated = jwtManager.isAuthenticated();
  
  // If auth status changed, broadcast it
  if (wasAuthenticated !== isAuthenticated) {
    broadcastAuthStatus();
  }
};

// Override the clear method to broadcast auth status after clearing
const originalClear = jwtManager.clear.bind(jwtManager);
jwtManager.clear = async () => {
  await originalClear();
  broadcastAuthStatus();
};
