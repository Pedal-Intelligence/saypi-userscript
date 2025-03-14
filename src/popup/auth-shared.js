// auth-shared.js - Shared authentication functionality for popup UI

/**
 * Updates the authentication UI elements based on the current authentication state
 * @param {boolean} isAuthenticated - Whether the user is authenticated
 * @param {Object} userData - User data from JWT claims (if authenticated)
 */
function updateAuthUI(isAuthenticated, userData = null) {
  const profileStatus = document.getElementById('profile-status');
  const profileName = document.getElementById('profile-name');
  const authButton = document.getElementById('auth-button');

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
  } else {
    // User is not signed in
    profileStatus.classList.remove('hidden');
    profileName.classList.add('hidden');
    // Update button to show Sign In
    authButton.setAttribute('data-i18n', 'signIn');
    authButton.textContent = chrome.i18n.getMessage('signIn');
    // Add sign in handler
    authButton.addEventListener('click', handleSignIn);
  }
}

/**
 * Handler for sign in button click
 */
function handleSignIn() {
  // Try to use config from the global scope
  if (typeof config !== 'undefined' && config.authServerUrl) {
    const loginUrl = `${config.authServerUrl}/auth/login`;
    const returnUrl = window.location.href;
    chrome.storage.local.set({ authReturnUrl: returnUrl });
    chrome.tabs.create({ url: loginUrl });
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
 * Handler for sign out button click
 */
function handleSignOut() {
  // First, call the SaaS logout endpoint to invalidate the server session
  logoutFromSaas().then((success) => {
    // Then use the signOut function from auth.js if available
    if (typeof window.signOut === 'function') {
      window.signOut().then(() => {
        updateAuthUI(false);
      });
    } else {
      // Fallback if signOut is not available
      chrome.runtime.sendMessage({ type: 'SIGN_OUT' }, function() {
        updateAuthUI(false);
      });
    }
  }).catch(error => {
    console.error('Error during logout:', error);
    // Continue with local logout even if server logout fails
    if (typeof window.signOut === 'function') {
      window.signOut().then(() => updateAuthUI(false));
    } else {
      chrome.runtime.sendMessage({ type: 'SIGN_OUT' }, function() {
        updateAuthUI(false);
      });
    }
  });
}

/**
 * Calls the SaaS server logout endpoint to invalidate the session
 * @returns {Promise<boolean>} Whether the logout was successful
 */
async function logoutFromSaas() {
  try {
    // Use config if available, otherwise fall back to default URL
    const baseUrl = (typeof config !== 'undefined' && config.authServerUrl) 
      ? config.authServerUrl 
      : 'https://www.saypi.ai';
    
    const logoutUrl = `${baseUrl}/api/auth/logout`;
    
    const response = await fetch(logoutUrl, {
      method: 'POST',
      credentials: 'include', // Important: This sends cookies with the request
    });
    
    const result = await response.json();
    console.log('Logout result:', result);
    
    return result.success;
  } catch (error) {
    console.error('Logout from SaaS failed:', error);
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