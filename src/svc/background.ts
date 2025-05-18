import { isFirefox } from "../UserAgentModule";
import { config } from "../ConfigModule";
import { jwtManager } from "../JwtManager";
import { offscreenManager, OFFSCREEN_DOCUMENT_PATH } from "../offscreen/offscreen_manager";
import { logger } from "../LoggingModule.js";

const PERMISSIONS_PROMPT_PATH_HTML = 'src/permissions/permissions-prompt.html';

// Expose instances globally for popup access
(self as any).jwtManager = jwtManager;

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
        .catch(err => {
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
chrome.runtime.onConnect.addListener((port) => {
  // Handle connections from content scripts for VAD
  if (port.name === "vad-content-script-connection") {
    offscreenManager.registerContentScriptConnection(port);
  }
  // Potentially other onConnect handlers could go here or be merged if names conflict
});

function replyToRequester(
  sender: chrome.runtime.MessageSender,
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

async function handleCheckAndRequestMicPermission(originalRequestId: string, originalSender: chrome.runtime.MessageSender) {
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

    const messageListenerFromPromptTab = (msg: any, senderFromPrompt: chrome.runtime.MessageSender) => {
      if (senderFromPrompt.tab?.id === newTabId && msg.type === 'PERMISSION_PROMPT_RESULT') {
        logger.debug(`[Background] Received PERMISSION_PROMPT_RESULT from tab ${newTabId} for request ${originalRequestId}: granted=${msg.granted}`);
        sendFinalResponseToRequester(msg.granted, msg.error);
        // The permissions-prompt.js will close its own tab.
      }
    };

    const removedListenerForPromptTab = (tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => {
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

// Handle popup opening AND messages from Offscreen Document AND Error Reports AND Mic Permissions
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  logger.debug("[Background] onMessage received:", message, "from sender:", sender);

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

  // Log details for the getURL call
  logger.debug(
    "[Background] Pre-getURL check. Path type:", 
    typeof OFFSCREEN_DOCUMENT_PATH,
    "Path value:", 
    OFFSCREEN_DOCUMENT_PATH,
    "Sender URL:",
    sender.url,
    "Runtime URL:",
    chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH),
    "Message:",
    message
  );

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
    
    // Forward events to content script
    if (message.targetTabId !== undefined) {
      logger.debug("[Background] Received event from offscreen document:", message);
      offscreenManager.forwardMessageToContentScript(message.targetTabId, message);
      return; // Stop processing if handled as an offscreen event
    }
  }

  // Handle error reports from any part of the extension using the logger
  if (message.type === "LOG_ERROR_REPORT" && message.origin === "logger-reportError") {
    logger.error("[Background] Error reported from extension module:", message.error.message, message.error);
    sendResponse({ status: "error_logged" });
    return; // Synchronous, error logged.
  }

  if (message.action === 'openPopup') {
    try {
      const isNotFirefox = !isFirefox();
      if (isNotFirefox && chrome.action?.openPopup) {
        // Default popup for Chrome on desktop
        chrome.action.openPopup();
      } else {
        // Fallback for Firefox and mobile browsers
        const popupURL = chrome.runtime.getURL('src/popup/popup.html');
        chrome.windows.create({
          url: popupURL,
          type: 'popup',
          width: 400,
          height: 720,
          focused: true
        });
      }
    } catch (error) {
      console.error('Failed to open popup:', error);
    }
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
      sendResponse({ isAuthenticated });
    } catch (error: any) {
      logger.error('Failed to get auth status:', error);
      sendResponse({ isAuthenticated: false });
    }
    return false; // Synchronous response
  }
  
  // Return true if we're handling the response asynchronously for other message types
  // This ensures that the sendResponse function remains valid for async operations
  // like REDIRECT_TO_LOGIN, GET_JWT_CLAIMS, etc.
  const asyncMessageTypes = [
    'GET_JWT_CLAIMS', 
    'CHECK_FEATURE_ENTITLEMENT', 
    'REDIRECT_TO_LOGIN',
    // Add any other async message types here
  ];
  if (asyncMessageTypes.includes(message.type)) {
    return true;
  }
  
  // If no specific handler matched or it was synchronous and didn't return true,
  // we don't need to keep the message channel open.
  logger.debug("[Background] Message type not explicitly handled or was synchronous:", message.type);
  // sendResponse({}); // Optional: send a default empty response if required by some senders
  return false; // Ensure channel is closed if not handled asynchronously
});

// Handle authentication cookie changes
chrome.cookies.onChanged.addListener(async (changeInfo) => {
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