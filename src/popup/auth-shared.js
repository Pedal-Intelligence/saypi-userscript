import { config } from '../ConfigModule';

// auth-shared.js - Shared authentication functionality for popup UI

// Track auth button state
let isAuthInProgress = false;

/**
 * Sets the auth button to loading state
 * @param {boolean} loading - Whether to show loading state
 */
function setAuthButtonLoading(loading) {
  const authButton = document.getElementById('auth-button');
  if (!authButton) return;

  isAuthInProgress = loading;

  if (loading) {
    authButton.disabled = true;
    authButton.classList.add('auth-loading');
    // Store original text
    authButton.dataset.originalText = authButton.textContent;
    authButton.innerHTML = `
      <span class="auth-spinner"></span>
      <span>${chrome.i18n.getMessage('signingIn') || 'Signing in...'}</span>
    `;
  } else {
    authButton.disabled = false;
    authButton.classList.remove('auth-loading');
    // Restore original text if available
    if (authButton.dataset.originalText) {
      authButton.textContent = authButton.dataset.originalText;
      delete authButton.dataset.originalText;
    }
  }
}

/**
 * Shows a brief success message on the auth button
 */
function showAuthSuccess() {
  const authButton = document.getElementById('auth-button');
  if (!authButton) return;

  authButton.classList.add('auth-success');
  authButton.innerHTML = `
    <span>✓</span>
    <span>${chrome.i18n.getMessage('signedIn') || 'Signed in!'}</span>
  `;

  // The UI will be properly updated by refreshAuthUI shortly after
}

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

  // Clear loading state
  if (isAuthInProgress) {
    setAuthButtonLoading(false);
    isAuthInProgress = false;
  }

  // First, remove any existing click handlers to prevent duplicates
  authButton.removeEventListener('click', handleSignIn);
  authButton.removeEventListener('click', handleSignOut);

  // Clear any success/loading classes
  authButton.classList.remove('auth-loading', 'auth-success');

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
  // Show loading state immediately for user feedback
  setAuthButtonLoading(true);

  if (config.authServerUrl) {
    const loginUrl = `${config.authServerUrl}/auth/login`;
    // Return to the extension's settings page after login
    // This enables the return-to-context flow where the auth tab closes
    // and the settings page reopens automatically
    const returnUrl = chrome.runtime.getURL('settings.html');
    redirectToLogin(loginUrl, returnUrl);
  } else {
    // Fallback to using the message API
    chrome.runtime.sendMessage({ type: 'REDIRECT_TO_LOGIN' }, function(response) {
      if (response && response.authenticated) {
        // Token was refreshed successfully, update the UI
        showAuthSuccess();
        setTimeout(() => refreshAuthUI(), 500);
      } else {
        // Reset loading state on failure
        setAuthButtonLoading(false);
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
window.setAuthButtonLoading = setAuthButtonLoading;
window.showAuthSuccess = showAuthSuccess;

export {};
