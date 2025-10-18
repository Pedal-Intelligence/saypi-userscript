import { config } from '../ConfigModule';

// auth-shared.js - Shared authentication functionality for popup UI

/**
 * Updates the authentication UI elements based on the current authentication state
 * @param {boolean} isAuthenticated - Whether the user is authenticated
 * @param {Object} userData - User data from JWT claims (if authenticated)
 */
function updateAuthUI(isAuthenticated, userData = null) {
  console.log('updateAuthUI', isAuthenticated, userData);

  const profileStatus = document.getElementById('profile-status');
  const profileName = document.getElementById('profile-name');
  const authButton = document.getElementById('auth-button');
  const unauthenticatedMessage = document.getElementById('unauthenticated-message');

  // First, remove any existing click handlers to prevent duplicates
  authButton.removeEventListener('click', handleSignIn);
  authButton.removeEventListener('click', handleSignOut);

  if (isAuthenticated && userData && userData.name) {
    // User is signed in
    profileStatus.classList.add('hidden');
    profileName.classList.remove('hidden');
    // Update button to show Sign Out
    authButton.setAttribute('data-i18n', 'signOut');
    authButton.textContent = chrome.i18n.getMessage('signOut');
    // Use i18n for greeting with name
    profileName.textContent = chrome.i18n.getMessage('greeting', [userData.name]);
    // Add sign out handler
    authButton.addEventListener('click', handleSignOut);
    // Hide unauthenticated inline message if present
    if (unauthenticatedMessage) {
      unauthenticatedMessage.classList.add('hidden');
    }
    // Restore quota display when available
    if (typeof window.restoreAuthenticatedDisplay === 'function') {
      window.restoreAuthenticatedDisplay();
    } else if (typeof window.updateQuotaDisplayForAuthState === 'function') {
      window.updateQuotaDisplayForAuthState();
    }
  } else {
    // User is not signed in
    profileStatus.classList.remove('hidden');
    profileName.classList.add('hidden');
    // Update button to show Sign In
    authButton.setAttribute('data-i18n', 'signIn');
    authButton.textContent = chrome.i18n.getMessage('signIn');
    // Add sign in handler
    authButton.addEventListener('click', handleSignIn);
    if (unauthenticatedMessage) {
      unauthenticatedMessage.classList.remove('hidden');
    }
  }
}

/**
 * Redirects user to login by opening a new tab with the login URL
 * @param {string} loginUrl - The full URL to the login page
 * @param {string} returnUrl - The URL to return to after login
 */
function redirectToLogin(loginUrl, returnUrl) {
  // Save return URL for after authentication
  chrome.storage.local.set({ authReturnUrl: returnUrl });
  
  // Open login page in a new tab
  chrome.tabs.create({ url: loginUrl });
}

/**
 * Handler for sign in button click
 */
function handleSignIn() {
  if (config.authServerUrl) {
    const loginUrl = `${config.authServerUrl}/auth/login`;
    // Use the Pi AI talk page instead of the SaaS dashboard
    const returnUrl = 'https://pi.ai/talk';
    redirectToLogin(loginUrl, returnUrl);
  } else {
    // Fallback to using the message API
    chrome.runtime.sendMessage({ type: 'REDIRECT_TO_LOGIN' }, function(response) {
      if (response && response.authenticated) {
        // Token was refreshed successfully, update the UI
        refreshAuthUI();
      }
    });
  }
}

/**
 * Updates UI after signing out
 * This function handles both auth UI and quota display updates
 */
function updateUIAfterSignOut() {
  // Update auth UI
  updateAuthUI(false);
  
  // Also update quota display if the function is available
  if (typeof window.updateUnauthenticatedDisplay === 'function') {
    window.updateUnauthenticatedDisplay();
  }
}

/**
 * Performs local sign out operations
 * @returns {Promise<void>}
 */
async function performLocalSignOut() {
  if (typeof window.signOut === 'function') {
    await window.signOut();
  } else {
    // Use message API as fallback
    await new Promise(resolve => {
      chrome.runtime.sendMessage({ type: 'SIGN_OUT' }, resolve);
    });
  }
  updateUIAfterSignOut();
}

/**
 * Handler for sign out button click
 */
function handleSignOut() {
  // First, call the SaaS logout endpoint to invalidate the server session
  logoutFromSaas()
    .then(() => performLocalSignOut())
    .catch(error => {
      console.error('Error during logout:', error);
      // Continue with local logout even if server logout fails
      performLocalSignOut();
    });
}

/**
 * Calls the SaaS server logout endpoint to invalidate the session
 * @returns {Promise<boolean>} Whether the logout was successful
 */
async function logoutFromSaas() {
  try {
    // Use configured auth host when available, otherwise fall back to production
    const baseUrl = config.authServerUrl || 'https://www.saypi.ai';
    
    const logoutUrl = `${baseUrl}/api/auth/logout`;
    
    const response = await fetch(logoutUrl, {
      method: 'POST',
      credentials: 'include', // Important: This sends cookies with the request
    });
    
    const result = await response.json();
    console.log('Logout result:', result);
    
    return result.success;
  } catch (error) {
    console.error('Logout failed:', error);
    return false;
  }
}

/**
 * Refreshes the authentication UI by fetching the latest JWT claims
 */
function refreshAuthUI() {
  chrome.runtime.sendMessage({ type: 'GET_JWT_CLAIMS' }, function(response) {
    if (response && response.claims && response.claims.name) {
      updateAuthUI(true, response.claims);
    } else {
      updateAuthUI(false);
    }
  });
}

// Export functions to global scope for use in other scripts
window.updateAuthUI = updateAuthUI;
window.handleSignIn = handleSignIn;
window.handleSignOut = handleSignOut;
window.refreshAuthUI = refreshAuthUI;
window.logoutFromSaas = logoutFromSaas;
window.updateUIAfterSignOut = updateUIAfterSignOut;
window.performLocalSignOut = performLocalSignOut;

export {};
