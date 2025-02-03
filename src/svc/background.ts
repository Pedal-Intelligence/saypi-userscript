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

// Initialize: check for existing auth cookie
checkAuthCookie().then(cookie => {
  if (cookie) {
    console.log('Found existing auth cookie, initializing JWT manager...');
    jwtManager.initialize();
  }
});

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
  }
  return false;  // synchronous response pattern
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
    console.log('Auth session cookie changed:', {
      removed,
      cause,
      domain: cookie.domain
    });
    
    if (!removed) {
      // Cookie was added/updated - refresh JWT
      await jwtManager.refresh();
    } else {
      // Cookie was removed - clear the token
      jwtManager.clear();
    }
  }
});