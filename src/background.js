// Cross-browser compatibility
const browserAPI = chrome || browser;

// Config (duplicated from popup-config.js since background scripts can't access popup scripts)
const config = {
  authServerUrl: process.env.NODE_ENV === 'development' 
    ? "https://localhost:3443"
    : "https://www.saypi.ai"
};

// Import the JWT manager
import { jwtManager } from './JwtManager';

// Listen for changes to the auth cookie
browserAPI.cookies.onChanged.addListener(async (changeInfo) => {
  const { cookie, removed } = changeInfo;
  
  // Only interested in our auth cookie
  if (cookie.name === 'auth_session' && cookie.domain === new URL(config.authServerUrl).hostname) {
    if (!removed) {
      // Cookie was added/updated - store the session token value
      try {
        // Store the session token value for later use
        await jwtManager.storeSessionToken(cookie.value);
        
        // Exchange it for JWT
        const response = await fetch(`${config.authServerUrl}/api/auth/refresh`, {
          method: 'POST',
          credentials: 'include',  // Important: Send cookies with request
        });

        if (!response.ok) {
          throw new Error('Failed to exchange cookie for JWT');
        }

        const { token, expiresIn } = await response.json();
        
        // Store the token
        await browserAPI.storage.local.set({ 
          token,
          tokenExpiresAt: Date.now() + (parseInt(expiresIn) * 1000)
        });

        // Get the return URL if it exists
        const { authReturnUrl } = await browserAPI.storage.local.get('authReturnUrl');
        if (authReturnUrl) {
          // Clear the return URL
          await browserAPI.storage.local.remove('authReturnUrl');
          // Close the auth tab and return to the popup
          const tabs = await browserAPI.tabs.query({ url: `${config.authServerUrl}/*` });
          for (const tab of tabs) {
            await browserAPI.tabs.remove(tab.id);
          }
          if (authReturnUrl.startsWith('chrome-extension://')) {
            await browserAPI.tabs.create({ url: authReturnUrl });
          }
        }
      } catch (error) {
        console.error('Failed to exchange cookie for JWT:', error);
      }
    } else {
      // Cookie was removed - clear the token and session token
      await browserAPI.storage.local.remove(['token', 'tokenExpiresAt', 'sessionToken']);
      jwtManager.clear();
    }
  }
}); 