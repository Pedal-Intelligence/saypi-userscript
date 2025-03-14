import { isFirefox } from "../UserAgentModule";
import { config } from "../ConfigModule";
import { jwtManager } from "../JwtManager";

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
      // Trigger a refresh and check if it succeeds
      await jwtManager.refresh(true);
      
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

async function pollAuthCookie() {
  if (!config.authServerUrl) return;
  try {
    const cookie = await chrome.cookies.get({
      name: 'auth_session',
      url: config.authServerUrl
    });
    if (cookie) {
      if (cookie.value !== lastAuthCookieValue) {
        console.debug('Cookie change detected via polling:', cookie.value);
        lastAuthCookieValue = cookie.value;
        await jwtManager.storeAuthCookieValue(cookie.value);
        await jwtManager.refresh(true);
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

// Poll every 5 seconds
setInterval(pollAuthCookie, 5000);

// Handle popup opening
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
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
          height: 600,
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
    } catch (error) {
      console.error('Failed to get quota details:', error);
      sendResponse(null);
    }
  } else if (message.type === 'GET_STT_QUOTA_DETAILS') {
    // Handle STT quota details request
    try {
      const sttQuotaDetails = jwtManager.getSTTQuotaDetails();
      sendResponse(sttQuotaDetails);
    } catch (error) {
      console.error('Failed to get STT quota details:', error);
      sendResponse(null);
    }
  } else if (message.type === 'GET_JWT_CLAIMS') {
    // Handle JWT claims request
    try {
      const claims = jwtManager.getClaims();
      sendResponse({ claims });
    } catch (error) {
      console.error('Failed to get JWT claims:', error);
      sendResponse({ claims: null });
    }
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
    // Handle sign out request
    try {
      // Clear the auth cookie
      if (config.authServerUrl) {
        chrome.cookies.remove({
          name: 'auth_session',
          url: config.authServerUrl
        });
      }
      // Clear the JWT token
      jwtManager.clear();
      
      // Broadcast auth status change
      broadcastAuthStatus();
      
      sendResponse({ success: true });
    } catch (error) {
      console.error('Failed to sign out:', error);
      sendResponse({ success: false });
    }
  } else if (message.type === 'GET_AUTH_STATUS') {
    // New handler for direct auth status requests from content scripts
    try {
      const isAuthenticated = jwtManager.isAuthenticated();
      sendResponse({ isAuthenticated });
    } catch (error) {
      console.error('Failed to get auth status:', error);
      sendResponse({ isAuthenticated: false });
    }
  }
  
  // Return true if we're handling the response asynchronously
  return message.type === 'REDIRECT_TO_LOGIN';
});

// Handle authentication cookie changes
chrome.cookies.onChanged.addListener(async (changeInfo) => {
  const { cookie, removed, cause } = changeInfo;
  
  // Debug logging for all cookie changes
  console.debug('Cookie change detected:', {
    name: cookie.name,
    domain: cookie.domain,
    removed,
    cause,
    expectedDomain: config.authServerUrl ? new URL(config.authServerUrl).hostname : 'not configured'
  });
  
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