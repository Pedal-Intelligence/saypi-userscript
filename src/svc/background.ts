import { isFirefox, isMobileDevice } from "../UserAgentModule";
import { deserializeApiRequest, type SerializedApiRequest } from "../utils/ApiRequestSerializer";
// Declare Chrome extension API for TypeScript
declare const chrome: any;
function openSettingsWindow() {
  try {
    const popupURL = chrome.runtime.getURL('src/popup/popup.html');
    // Decide initial height based on whether we need to show consent overlay
    // We check local storage flag 'shareData'. If it's undefined, consent will show.
    chrome.storage.local.get('shareData', (result: any) => {
      const needsConsent = typeof result.shareData === 'undefined';
      const height = needsConsent ? 600 : 512; // fallback taller for consent, otherwise compact
      // Firefox on Android does not support opening popup windows; open a tab instead
      if (isFirefox() && isMobileDevice()) {
        chrome.tabs.create({ url: popupURL, active: true });
        return;
      }

      chrome.windows.create({
        url: popupURL,
        type: 'popup',
        width: 736, // 720px + 16px padding
        height,
        focused: true
      });
    });
  } catch (error) {
    console.error('Failed to open popup:', error);
  }
}

// Open settings when the toolbar icon is clicked (no default_popup)
chrome.action?.onClicked.addListener(() => {
  openSettingsWindow();
});

import { config } from "../ConfigModule";
import { getJwtManagerSync } from "../JwtManager";
import { offscreenManager, OFFSCREEN_DOCUMENT_PATH } from "../offscreen/offscreen_manager";
import { logger } from "../LoggingModule.js";
import getMessage from "../i18n";

const PERMISSIONS_PROMPT_PATH_HTML = 'public/permissions/permissions-prompt.html';

// Get the JWT manager instance at startup
const jwtManager = getJwtManagerSync();

// Expose instances globally for popup access
(self as any).jwtManager = jwtManager;

// Track dictation state across tabs
const dictationStates = new Map<number, boolean>(); // tabId -> isDictationActive

// Function to update context menu title based on dictation state
function updateContextMenuTitle(tabId: number, isDictationActive: boolean) {
  dictationStates.set(tabId, isDictationActive);
  
  const appName = getMessage("appName");
  const title = isDictationActive 
    ? getMessage("contextMenuStopDictation", appName)
    : getMessage("contextMenuStartDictation", appName);
    
  try {
    if (chrome.contextMenus && typeof chrome.contextMenus.update === 'function') {
      chrome.contextMenus.update("start-dictation", {
        title: title
      }, () => {
        if (chrome.runtime.lastError) {
          console.debug("Failed to update context menu title:", chrome.runtime.lastError.message);
        }
      });
    }
  } catch {}
}

// Context menu setup for dictation
chrome.runtime.onInstalled.addListener(() => {
  try {
    if (!chrome.contextMenus || typeof chrome.contextMenus.create !== 'function') return;
    const appName = getMessage("appName");
    chrome.contextMenus.create({
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
});

// Handle context menu clicks
try {
  if (chrome.contextMenus && typeof chrome.contextMenus.onClicked?.addListener === 'function') {
    chrome.contextMenus.onClicked.addListener((info: any, tab: any) => {
      if (info.menuItemId === "start-dictation" && tab?.id) {
        const tabId = tab.id;
        const isDictationActive = dictationStates.get(tabId) || false;
        const messageType = isDictationActive
          ? "stop-dictation-from-context-menu"
          : "start-dictation-from-context-menu";
        chrome.tabs.sendMessage(tabId, {
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
    const cookie = await chrome.cookies.get({
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
    const tabs = await chrome.tabs.query({});
    
    // Track tabs where we successfully send messages
    let successCount = 0;
    
    // Send message to all tabs but handle errors silently
    for (const tab of tabs) {
      if (tab.id) {
        // Only log success or unexpected errors, not connection errors
        chrome.tabs.sendMessage(tab.id, { 
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
    const cookie = await chrome.cookies.get({
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

// Poll every 5 seconds for standard browsers, but much less frequently for Firefox
const pollingInterval = isFirefox() ? 300000 : 5000; // 5 minutes for Firefox, 5 seconds for others
setInterval(pollAuthCookie, pollingInterval);

// Handle VAD communication via Offscreen Document
chrome.runtime.onConnect.addListener((port: any) => {
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
    chrome.tabs.sendMessage(sender.tab.id, payload);
  } else {
    // Came from another extension page (popup, off-screen, etc.)
    chrome.runtime.sendMessage(payload);   // fallback broadcast
  }
}

async function handleCheckAndRequestMicPermission(originalRequestId: string, originalSender: any) {
  logger.debug(`[Background] Handling CHECK_AND_REQUEST_MICROPHONE_PERMISSION for request ID ${originalRequestId} from sender: ${originalSender}`);
  try {
    const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
    logger.debug(`[Background] Microphone permission state for extension origin: ${permissionStatus.state}`);

    if (permissionStatus.state === 'granted') {
      replyToRequester(originalSender, {
        type: 'MICROPHONE_PERMISSION_RESPONSE',
        requestId: originalRequestId,
        granted: true
      });
      return;
    }

    // If 'denied' or 'prompt', proceed to open the permissions tab.
    const permissionsPageUrl = chrome.runtime.getURL(PERMISSIONS_PROMPT_PATH_HTML);
    let newTabId: number | undefined;
    let handlingPrompt = true; // Flag to manage listeners correctly

    const cleanupPromptListeners = () => {
      if (!handlingPrompt) return;
      handlingPrompt = false; // Prevent re-entry or duplicate cleanups
      logger.debug(`[Background] Cleaning up listeners for permission request ${originalRequestId}`);
      chrome.runtime.onMessage.removeListener(messageListenerFromPromptTab);
      if (newTabId !== undefined) {
        chrome.tabs.onRemoved.removeListener(removedListenerForPromptTab);
      }
    };

    const sendFinalResponseToRequester = (granted: boolean, error?: string) => {
      if (!handlingPrompt) { // If listeners already cleaned up (e.g. tab closed by user first)
        logger.debug(`[Background] Attempted to send final response for ${originalRequestId}, but already handled.`);
        return;
      }
      logger.debug(`[Background] Sending final MICROPHONE_PERMISSION_RESPONSE for ${originalRequestId}: granted=${granted}, error=${error}`);
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
    
    chrome.runtime.onMessage.addListener(messageListenerFromPromptTab);

    try {
      logger.debug(`[Background] Creating permissions tab for request ${originalRequestId} with URL: ${permissionsPageUrl}`);
      const tab = await chrome.tabs.create({ url: permissionsPageUrl, active: true });
      newTabId = tab.id;
      if (newTabId === undefined) { 
        throw new Error("Failed to create permissions tab (no ID returned).");
      }
      chrome.tabs.onRemoved.addListener(removedListenerForPromptTab);
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
    
    // Add authorization header for SayPi API requests
    if (url.includes('api.saypi.ai') || url.includes('www.saypi.ai')) {
      const authHeader = jwtManager.getAuthHeader();
      if (authHeader) {
        headers.set('Authorization', authHeader);
      }
    }
    
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
    
    // Handle 401/403 responses with token refresh and retry
    if ((response.status === 401 || response.status === 403) && headers.has('Authorization')) {
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
    const responseData = {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: {} as Record<string, string>,
      body: null as string | null
    };
    
    // Serialize response headers
    response.headers.forEach((value, key) => {
      responseData.headers[key] = value;
    });
    
    // Read response body
    try {
      responseData.body = await response.text();
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
chrome.runtime.onMessage.addListener((message: any, sender: any, sendResponse: any) => {
  // Sanitize the message for logging
  const sanitizedMessage = sanitizeMessageForLogs(message);
  logger.debug(`[Background] onMessage received ${sanitizedMessage.type} from ${sender.tab?.title || sender.url}`);

  // --- START: Microphone Permission Handling ---
  if (message.type === 'CHECK_AND_REQUEST_MICROPHONE_PERMISSION' && message.requestId) {
    // Ensure the sender is from the extension itself (e.g., AudioInputMachine)
    // content scripts will have sender.id as undefined, extension pages will have chrome.runtime.id
    if (sender.id === chrome.runtime.id || sender.url?.startsWith(chrome.runtime.getURL(''))) {
      logger.debug("[Background] Received CHECK_AND_REQUEST_MICROPHONE_PERMISSION from valid sender.");
      handleCheckAndRequestMicPermission(message.requestId, sender);
      // Acknowledge the request. The actual result is sent asynchronously by handleCheckAndRequestMicPermission.
      sendResponse({ status: 'processing_permission_check_acknowledged' }); 
    } else {
      logger.warn("[Background] CHECK_AND_REQUEST_MICROPHONE_PERMISSION from unexpected sender:", sender);
      sendResponse({ status: 'error_before_prompt', error: 'Unauthorized sender for permission check' });
    }
    return true; // Indicate that the response will be sent asynchronously.
  }
  // --- END: Microphone Permission Handling ---

  // --- START: Save Segmented WAV to Downloads ---
  if (message.type === 'SAVE_SEGMENT_WAV' && typeof message.base64 === 'string' && typeof message.filename === 'string') {
    try {
      const url = `data:audio/wav;base64,${message.base64}`;
      chrome.downloads.download({
        url,
        filename: message.filename,
        saveAs: false,
        conflictAction: 'uniquify'
      }, (downloadId: any) => {
        if (chrome.runtime.lastError) {
          logger.error('[Background] Failed to queue segment download:', chrome.runtime.lastError.message);
          sendResponse({ ok: false, error: chrome.runtime.lastError.message });
        } else {
          logger.debug(`[Background] Queued segment download: ${downloadId} -> ${message.filename}`);
          sendResponse({ ok: true, id: downloadId });
        }
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
      // Check if chrome.offscreen is available
      const isOffscreenSupported = typeof chrome.offscreen !== 'undefined';
      logger.debug(`[Background] Checking offscreen support: ${isOffscreenSupported}`);
      
      // Send the result back to the content script
      sendResponse({ 
        supported: isOffscreenSupported,
        hasHasDocument: typeof chrome.offscreen?.hasDocument === 'function'
      });
    } catch (error: any) {
      logger.error("[Background] Error checking offscreen support:", error);
      sendResponse({ supported: false, error: error.message });
    }
    return true; // Indicate that we're handling the response asynchronously
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
      logger.debug(`[Background] Forwarding direct audio message to offscreen document: ${message.type}`);
      
      // Forward the message to the offscreen document
      offscreenManager.sendMessageToOffscreenDocument({
        ...message,
        sourceTabId: sender.tab.id,  // Ensure sourceTabId is explicit
        tabId: sender.tab.id         // Also set tabId for compatibility
      }, sender.tab.id);
      
      // Acknowledge receipt of the message
      sendResponse({ 
        status: "audio_message_forwarded", 
        messageId: message.messageId,
        timestamp: Date.now()
      });
      
      return true; // We've handled this message
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
   *    - Uses chrome.runtime.connect() with port-based messaging
   *    - Handles VAD_* and OFFSCREEN_VAD_* messages
   *    - Receives messages via offscreenManager.forwardMessageToContentScript() -> port.postMessage()
   * 
   * 2. OffscreenAudioBridge (src/audio/OffscreenAudioBridge.js):
   *    - Uses chrome.runtime.onMessage.addListener() for direct messaging
   *    - Handles AUDIO_* and OFFSCREEN_AUDIO_* messages
   *    - Receives messages via chrome.tabs.sendMessage()
   * 
   * The routing logic below prevents message cross-contamination by routing messages
   * based on their type prefix to the appropriate client communication channel.
   */
  // Prioritize messages from the offscreen document (VAD events)
  if (
    typeof OFFSCREEN_DOCUMENT_PATH === 'string' &&
    sender.url === chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH) &&
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
      
      // Route audio messages via chrome.tabs.sendMessage to OffscreenAudioBridge
      if (message.type.startsWith("AUDIO_") || message.type.startsWith("OFFSCREEN_AUDIO_")) {
        logger.debug(`[Background] Routing audio message via tabs.sendMessage: ${message.type}`);
        try {
          chrome.tabs.sendMessage(message.targetTabId, message, (response: any) => {
            const lastError = chrome.runtime.lastError;
            if (lastError) {
              logger.error(`[Background] Error forwarding audio message: ${lastError.message}`);
            } else {
              logger.debug(`[Background] Successfully forwarded audio message to tab ${message.targetTabId}`);
            }
          });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          logger.error(`[Background] Exception forwarding audio message: ${errorMessage}`);
        }
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
    return true; // Indicate we'll respond asynchronously
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
    return true; // Indicate we'll respond asynchronously
  } else if (message.type === 'REDIRECT_TO_LOGIN') {
    // Handle login redirect request - async handler
    (async () => {
      try {
        if (config.authServerUrl) {
          // Check cookie first
          const cookie = await chrome.cookies.get({
            name: 'auth_session',
            url: config.authServerUrl
          });

          if (!cookie) {
            // No cookie present, redirect to login immediately
            chrome.tabs.create({
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
              chrome.tabs.create({
                url: `${config.authServerUrl}/auth/login`
              });
              sendResponse({ authenticated: false });
            }
          } catch (error) {
            console.error('Failed to refresh token:', error);
            // On refresh failure, redirect to login
            chrome.tabs.create({
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
          chrome.tabs.create({
            url: `${config.authServerUrl}/auth/login`
          });
        }
        sendResponse({ authenticated: false });
      }
    })();
    return true; // indicates we will send a response asynchronously
  } else if (message.type === 'SIGN_OUT') {
    // Handle sign out request - make this block async
    (async () => {
      try {
        // Clear the auth cookie
        if (config.authServerUrl) {
          await chrome.cookies.remove({
            name: 'auth_session',
            url: config.authServerUrl
          });
        }
        // Clear the JWT token
        jwtManager.clear();
        
        // Broadcast auth status change
        broadcastAuthStatus();
        
        sendResponse({ success: true });
      } catch (error: any) {
        logger.error('Failed to sign out:', error);
        sendResponse({ success: false });
      }
    })();
    return true; // Now this handler is async, so return true
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
    return true; // Async response
  }
  // --- END: API Request Proxy Handler ---
  
  // Return true if we're handling the response asynchronously for other message types
  // This ensures that the sendResponse function remains valid for async operations
  // like REDIRECT_TO_LOGIN, GET_JWT_CLAIMS, etc.
  const asyncMessageTypes: string[] = [
    'GET_JWT_CLAIMS',
    'CHECK_FEATURE_ENTITLEMENT',
    'REDIRECT_TO_LOGIN',
    'API_REQUEST',
  ];
  if (asyncMessageTypes.indexOf(message.type) !== -1) {
    return true;
  }
  
  // If no specific handler matched or it was synchronous and didn't return true,
  // we don't need to keep the message channel open.
  logger.debug("[Background] Message type not explicitly handled or was synchronous:", message.type);
  // sendResponse({}); // Optional: send a default empty response if required by some senders
  return false; // Ensure channel is closed if not handled asynchronously
});

// Clean up dictation state when tabs are closed
chrome.tabs.onRemoved.addListener((tabId: any) => {
  if (dictationStates.has(tabId)) {
    dictationStates.delete(tabId);
    logger.debug(`[Background] Cleaned up dictation state for closed tab ${tabId}`);
  }
});

// Handle authentication cookie changes
chrome.cookies.onChanged.addListener(async (changeInfo: any) => {
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

      // Only refresh if we don't have a valid token already
      if (!jwtManager.isAuthenticated()) {
        await jwtManager.refresh();
        
        // Broadcast auth status change after refresh
        broadcastAuthStatus();
        
        // Get and handle return URL if it exists
        try {
          const { authReturnUrl } = await chrome.storage.local.get('authReturnUrl');
          if (authReturnUrl) {
            console.debug('Found return URL, redirecting to:', authReturnUrl);
            
            // Clear the return URL
            await chrome.storage.local.remove('authReturnUrl');
            
            // Close the auth tab and return to the popup
            const tabs = await chrome.tabs.query({ url: `${config.authServerUrl}/*` });
            for (const tab of tabs) {
              if (tab.id !== undefined) {
                await chrome.tabs.remove(tab.id);
              }
            }
            
            // If the return URL is an extension URL, open it
            if (authReturnUrl.startsWith('chrome-extension://') || 
                authReturnUrl.startsWith('moz-extension://')) {
              await chrome.tabs.create({ url: authReturnUrl });
            }
          }
        } catch (error) {
          console.error('Failed to handle return URL:', error);
        }
      }
    } else if (removed) {
      // If cookie was removed, clear JWT and broadcast status change
      jwtManager.clear();
      broadcastAuthStatus();
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
jwtManager.clear = () => {
  originalClear();
  broadcastAuthStatus();
};