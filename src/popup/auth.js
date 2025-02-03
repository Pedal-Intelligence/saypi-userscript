// DOM elements
const signInButton = document.getElementById('sign-in-button');
const profileStatus = document.getElementById('profile-status');

// State
let isAuthenticated = false;

// Event handlers
signInButton.addEventListener('click', () => {
  // config.authServerUrl is defined in src/popup/popup-config.js
  const loginUrl = `${config.authServerUrl}/auth/login`;
  // Store current URL as return URL
  const returnUrl = window.location.href;
  browser.storage.local.set({ authReturnUrl: returnUrl });
  // Open login page in new tab
  browser.tabs.create({ url: loginUrl });
});

// Update UI based on auth state
function updateAuthUI(authenticated, userData = null) {
  isAuthenticated = authenticated;
  
  if (authenticated && userData) {
    signInButton.textContent = 'Sign Out';
    signInButton.dataset.i18n = 'signOut';
    profileStatus.textContent = userData.email || 'Signed in';
    profileStatus.dataset.i18n = 'signedIn';
  } else {
    signInButton.textContent = 'Sign In';
    signInButton.dataset.i18n = 'signIn';
    profileStatus.textContent = 'Not signed in';
    profileStatus.dataset.i18n = 'notSignedIn';
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  // Check current auth state
  try {
    const { token } = await browser.storage.local.get('token');
    if (token) {
      // TODO: Validate token and get user data
      updateAuthUI(true, { email: 'user@example.com' });
    } else {
      updateAuthUI(false);
    }
  } catch (error) {
    console.error('Failed to initialize auth UI:', error);
    updateAuthUI(false);
  }
}); 