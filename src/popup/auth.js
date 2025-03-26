// DOM elements
const authButton = document.getElementById('auth-button');
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
// The updateAuthUI function is now in auth-shared.js

// Sign out functionality - used by the shared handleSignOut function
async function signOut() {
  // Clear stored token
  await browserAPI.storage.local.remove(['token', 'authReturnUrl']);
  
  // Update UI using the shared function
  updateAuthUI(false);
}

// Make signOut available to the shared module
window.signOut = signOut;

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
        // Invalid or expired token
        updateAuthUI(false);
        isAuthenticated = false;
      }
    } else {
      updateAuthUI(false);
      isAuthenticated = false;
    }
  } catch (error) {
    console.error('Failed to initialize auth UI:', error);
    updateAuthUI(false);
    isAuthenticated = false;
  }
}); 