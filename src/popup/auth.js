// DOM elements
const signInButton = document.getElementById('sign-in-button');
const profileStatus = document.getElementById('profile-status');

// State
let isAuthenticated = false;

// Cross-browser compatibility
const browserAPI = chrome || browser;

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
signInButton.addEventListener('click', async () => {
  if (isAuthenticated) {
    // Handle sign out
    await signOut();
  } else {
    // Handle sign in (existing code)
    const loginUrl = `${config.authServerUrl}/auth/login`;
    const returnUrl = window.location.href;
    browserAPI.storage.local.set({ authReturnUrl: returnUrl });
    browserAPI.tabs.create({ url: loginUrl });
  }
});

// Sign out functionality
async function signOut() {
  // Clear stored token
  await browserAPI.storage.local.remove(['token', 'authReturnUrl']);
  
  // Update UI
  updateAuthUI(false);
}

// Update UI based on auth state
function updateAuthUI(authenticated, userData = null) {
  isAuthenticated = authenticated;
  
  if (authenticated && userData) {
    signInButton.textContent = chrome.i18n.getMessage('signOut');
    signInButton.dataset.i18n = 'signOut';
    profileStatus.textContent = chrome.i18n.getMessage('signedIn');
    profileStatus.dataset.i18n = 'signedIn';
  } else {
    signInButton.textContent = chrome.i18n.getMessage('signIn');
    signInButton.dataset.i18n = 'signIn';
    profileStatus.textContent = chrome.i18n.getMessage('notSignedIn');
    profileStatus.dataset.i18n = 'notSignedIn';
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  // Check current auth state
  try {
    const { token } = await browserAPI.storage.local.get('token');
    if (token) {
      const claims = parseJwt(token);
      if (claims) {
        // Extract user data from JWT claims
        const userData = {
          userId: claims.userId,
          teamId: claims.teamId,
          planId: claims.planId,
          ttsQuotaRemaining: claims.ttsQuotaRemaining,
          ttsQuotaMonthly: claims.ttsQuotaMonthly
        };
        updateAuthUI(true, userData);
      } else {
        // Invalid or expired token
        updateAuthUI(false);
      }
    } else {
      updateAuthUI(false);
    }
  } catch (error) {
    console.error('Failed to initialize auth UI:', error);
    updateAuthUI(false);
  }
}); 