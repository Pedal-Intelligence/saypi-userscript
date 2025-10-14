// DOM elements
const authButton = document.getElementById('auth-button');
const profileStatus = document.getElementById('profile-status');

// State
let isAuthenticated = false;

// Cross-browser compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

// JWT handling
function parseJwt(token) {
  try {
    // Split token and get payload
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // Decode and parse
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to parse JWT:', error);
    return null;
  }
}

// Event handlers
// The updateAuthUI function is now in auth-shared.js

// Sign out functionality - used by the shared handleSignOut function
async function signOut() {
  // Clear stored token
  await browserAPI.storage.local.remove([
    'token',
    'jwtToken',
    'tokenExpiresAt',
    'authCookieValue',
    'authReturnUrl',
  ]);
  
  // Update UI using the shared function
  updateAuthUI(false);
}

// Make signOut available to the shared module
window.signOut = signOut;

const initializeAuth = async () => {
  // Check current auth state
  try {
    const storageValues = (await browserAPI.storage.local.get([
      'jwtToken',
      'token',
    ])) || {};
    const token = storageValues.jwtToken || storageValues.token;
    if (token) {
      const claims = parseJwt(token);
      if (claims) {
        // Extract user data from JWT claims
        const userData = {
          name: claims.name,
          userId: claims.userId,
          teamId: claims.teamId,
          planId: claims.planId,
          ttsQuotaRemaining: claims.ttsQuotaRemaining,
          ttsQuotaMonthly: claims.ttsQuotaMonthly
        };
        // Use the shared updateAuthUI function
        updateAuthUI(true, userData);
        isAuthenticated = true;
      } else {
        // Token exists but couldn't be parsed
        updateAuthUI(false);
        isAuthenticated = false;
      }
    } else {
      // No token - user is not authenticated
      updateAuthUI(false);
      isAuthenticated = false;
    }
  } catch (error) {
    console.error('Failed to initialize auth UI:', error);
    updateAuthUI(false);
    isAuthenticated = false;
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAuth, { once: true });
} else {
  void initializeAuth();
}

// Listen for auth status changes from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'AUTH_STATUS_CHANGED') {
    console.log('Auth status changed, refreshing UI');
    // Refresh the auth UI when auth status changes
    void initializeAuth();
  }
});

export {};
