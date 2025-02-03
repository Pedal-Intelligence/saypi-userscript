import { isFirefox } from "../UserAgentModule";
import { config } from "../ConfigModule";

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

// Helper function to exchange cookie for JWT
async function exchangeCookieForJWT() {
  if (!config.authServerUrl) {
    console.warn('Auth server URL not configured');
    return;
  }

  try {
    // First get the cookie value
    const cookie = await checkAuthCookie();
    if (!cookie) {
      throw new Error('No auth cookie found');
    }

    // Make the exchange request with explicit cookie
    const response = await fetch(`${config.authServerUrl}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Cookie': `auth_session=${cookie.value}`,
        'Origin': chrome.runtime.getURL(''),
      }
    });

    if (!response.ok) {
      console.error('JWT exchange failed:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      throw new Error(`Failed to exchange cookie for JWT: ${response.status} ${response.statusText}`);
    }

    const { token, expiresIn } = await response.json();
    
    // Store the token
    await chrome.storage.local.set({ 
      token,
      tokenExpiresAt: Date.now() + (parseInt(expiresIn) * 1000)
    });

    // Get the return URL if it exists
    const { authReturnUrl } = await chrome.storage.local.get('authReturnUrl');
    if (authReturnUrl) {
      // Clear the return URL
      await chrome.storage.local.remove('authReturnUrl');
      // Close the auth tab and return to the popup
      const tabs = await chrome.tabs.query({ url: `${config.authServerUrl}/*` });
      for (const tab of tabs) {
        if (tab.id !== undefined) {
          await chrome.tabs.remove(tab.id);
        }
      }
      if (authReturnUrl.startsWith('chrome-extension://')) {
        await chrome.tabs.create({ url: authReturnUrl });
      }
    }
  } catch (error) {
    console.error('Failed to exchange cookie for JWT:', error);
  }
}

// Expose helper functions for debugging
(self as any).checkAuthCookie = checkAuthCookie;
(self as any).exchangeCookieForJWT = exchangeCookieForJWT;

// Initialize: check for existing auth cookie
checkAuthCookie().then(cookie => {
  if (cookie) {
    console.log('Found existing auth cookie, exchanging for JWT...');
    exchangeCookieForJWT();
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
      // Cookie was added/updated - exchange it for JWT
      await exchangeCookieForJWT();
    } else {
      // Cookie was removed - clear the token
      await chrome.storage.local.remove(['token', 'tokenExpiresAt']);
    }
  }
});