import { isFirefox } from "../UserAgentModule";
import { config } from "../ConfigModule";

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
  const { cookie, removed } = changeInfo;
  
  // Only interested in our auth cookie
  if (cookie.name === 'auth_session' && config.authServerUrl && cookie.domain === new URL(config.authServerUrl).hostname) {
    if (!removed) {
      // Cookie was added/updated - exchange it for JWT
      try {
        const response = await fetch(`${config.authServerUrl}/api/auth/refresh`, {
          method: 'POST',
          credentials: 'include',  // Important: Send cookies with request
        });

        if (!response.ok) {
          throw new Error('Failed to exchange cookie for JWT');
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
    } else {
      // Cookie was removed - clear the token
      await chrome.storage.local.remove(['token', 'tokenExpiresAt']);
    }
  }
});