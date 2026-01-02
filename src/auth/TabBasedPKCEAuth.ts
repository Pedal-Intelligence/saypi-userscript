/**
 * TabBasedPKCEAuth - Tab-based PKCE authentication for browsers without identity API
 *
 * This module implements OAuth 2.1 + PKCE using browser tabs instead of
 * browser.identity.launchWebAuthFlow(). Used for Firefox (desktop and Android)
 * where the identity API is not available or doesn't work reliably.
 *
 * Flow:
 * 1. Generate PKCE pair (code_verifier, code_challenge)
 * 2. Open authorization URL in a new tab
 * 3. Listen for tab URL changes via browser.tabs.onUpdated
 * 4. Detect redirect to extensions.allizom.org (Firefox redirect URI)
 * 5. Extract authorization code from URL
 * 6. Exchange code for tokens
 * 7. Close the auth tab
 */

import { browser } from 'wxt/browser';
import { config } from '../ConfigModule';
import { logger } from '../LoggingModule';
import {
  generatePKCEPair,
  generateState,
  storePKCEState,
  retrievePKCEState,
  clearPKCEState,
} from './PKCEManager';
import type { OAuthResult, TokenResponse } from './OAuthService';

/**
 * OAuth client ID for the SayPi extension
 */
const CLIENT_ID = 'saypi-extension';

/**
 * Timeout for waiting for auth redirect (5 minutes)
 */
const AUTH_TIMEOUT_MS = 5 * 60 * 1000;

/**
 * Pattern to match Firefox extension redirect URIs
 * Matches: https://<addon-id>.extensions.allizom.org/...
 */
const FIREFOX_REDIRECT_PATTERN = /\.extensions\.allizom\.org\//;

/**
 * Pattern to match Chrome extension redirect URIs (for Kiwi Browser fallback)
 */
const CHROME_REDIRECT_PATTERN = /\.chromiumapp\.org\//;

/**
 * Get the redirect URI for tab-based PKCE flow
 * For Firefox, constructs the extensions.allizom.org URL
 */
export function getTabBasedRedirectUri(): string {
  const extensionUrl = browser.runtime.getURL('');
  const extensionId = new URL(extensionUrl).host;

  if (extensionUrl.startsWith('moz-extension://')) {
    return `https://${extensionId}.extensions.allizom.org/`;
  }

  if (extensionUrl.startsWith('chrome-extension://')) {
    return `https://${extensionId}.chromiumapp.org/`;
  }

  // Fallback
  return `${extensionUrl}oauth-callback`;
}

/**
 * Check if a URL matches a redirect URI pattern
 */
function isRedirectUrl(url: string): boolean {
  return FIREFOX_REDIRECT_PATTERN.test(url) || CHROME_REDIRECT_PATTERN.test(url);
}

/**
 * Build the authorization URL with PKCE parameters
 */
function buildAuthorizationUrl(
  codeChallenge: string,
  state: string,
  redirectUri: string
): string {
  const authUrl = new URL('/api/oauth/authorize', config.authServerUrl);

  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('code_challenge', codeChallenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('scope', 'openid profile');

  return authUrl.toString();
}

/**
 * Parse the authorization response from the redirect URL
 */
function parseAuthorizationResponse(redirectUrl: string): {
  code?: string;
  state?: string;
  error?: string;
  errorDescription?: string;
} {
  const url = new URL(redirectUrl);
  const params = url.searchParams;

  return {
    code: params.get('code') || undefined,
    state: params.get('state') || undefined,
    error: params.get('error') || undefined,
    errorDescription: params.get('error_description') || undefined,
  };
}

/**
 * Exchange authorization code for tokens
 */
async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string,
  redirectUri: string
): Promise<TokenResponse> {
  const tokenUrl = `${config.authServerUrl}/api/oauth/token`;

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      code_verifier: codeVerifier,
      client_id: CLIENT_ID,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error_description ||
        errorData.error ||
        `Token exchange failed: ${response.status}`
    );
  }

  return response.json();
}

/**
 * Perform OAuth 2.1 + PKCE authentication using tab-based flow
 *
 * This is used for Firefox (desktop and Android) where browser.identity
 * API is not available.
 */
export async function authenticateWithTabBasedPKCE(): Promise<OAuthResult> {
  if (!config.authServerUrl) {
    return {
      success: false,
      error: 'configuration_error',
      errorDescription: 'Auth server URL not configured',
    };
  }

  let authTabId: number | undefined;
  let tabListener: ((
    tabId: number,
    changeInfo: browser.Tabs.OnUpdatedChangeInfoType,
    tab: browser.Tabs.Tab
  ) => void) | undefined;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const cleanup = async () => {
    if (tabListener) {
      browser.tabs.onUpdated.removeListener(tabListener);
      tabListener = undefined;
    }
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
    if (authTabId !== undefined) {
      try {
        await browser.tabs.remove(authTabId);
      } catch {
        // Tab may already be closed
      }
      authTabId = undefined;
    }
  };

  try {
    // Generate PKCE pair
    const { codeVerifier, codeChallenge } = await generatePKCEPair();
    const state = generateState();
    const redirectUri = getTabBasedRedirectUri();

    logger.debug('[TabBasedPKCE] Starting tab-based PKCE auth flow', {
      redirectUri,
    });

    // Store PKCE state for verification
    await storePKCEState({
      codeVerifier,
      state,
      redirectUri,
      createdAt: Date.now(),
    });

    // Build authorization URL
    const authUrl = buildAuthorizationUrl(codeChallenge, state, redirectUri);

    // Create a promise that resolves when we detect the redirect
    const authPromise = new Promise<OAuthResult>((resolve) => {
      // Set up tab listener
      tabListener = (tabId, changeInfo, tab) => {
        // Only watch our auth tab
        if (tabId !== authTabId) return;

        // Check for URL changes
        if (changeInfo.url && isRedirectUrl(changeInfo.url)) {
          logger.debug('[TabBasedPKCE] Detected redirect URL', {
            url: changeInfo.url,
          });

          // Parse the response
          const response = parseAuthorizationResponse(changeInfo.url);

          // Handle OAuth errors
          if (response.error) {
            cleanup();
            clearPKCEState();
            resolve({
              success: false,
              error: response.error,
              errorDescription: response.errorDescription,
            });
            return;
          }

          if (!response.code || !response.state) {
            cleanup();
            clearPKCEState();
            resolve({
              success: false,
              error: 'invalid_response',
              errorDescription: 'Missing code or state in response',
            });
            return;
          }

          // Exchange code for tokens
          retrievePKCEState(response.state)
            .then(async (pkceState) => {
              if (!pkceState) {
                return {
                  success: false as const,
                  error: 'state_mismatch',
                  errorDescription: 'Invalid or expired state parameter',
                };
              }

              const tokens = await exchangeCodeForTokens(
                response.code!,
                pkceState.codeVerifier,
                pkceState.redirectUri
              );

              logger.info('[TabBasedPKCE] Authentication successful');
              return { success: true as const, tokens };
            })
            .then((result) => {
              cleanup();
              resolve(result);
            })
            .catch((error) => {
              cleanup();
              resolve({
                success: false,
                error: 'token_exchange_failed',
                errorDescription: error.message || 'Failed to exchange code for tokens',
              });
            });
        }

        // Check if tab was closed by user
        if (changeInfo.status === 'complete' && tab.url === 'about:blank') {
          // Tab was likely closed and replaced
          cleanup();
          clearPKCEState();
          resolve({
            success: false,
            error: 'auth_cancelled',
            errorDescription: 'Authentication tab was closed',
          });
        }
      };

      browser.tabs.onUpdated.addListener(tabListener);

      // Set up timeout
      timeoutId = setTimeout(() => {
        cleanup();
        clearPKCEState();
        resolve({
          success: false,
          error: 'auth_timeout',
          errorDescription: 'Authentication timed out',
        });
      }, AUTH_TIMEOUT_MS);
    });

    // Also listen for tab removal (user closes tab)
    const removeListener = (tabId: number) => {
      if (tabId === authTabId) {
        browser.tabs.onRemoved.removeListener(removeListener);
        cleanup();
        clearPKCEState();
      }
    };
    browser.tabs.onRemoved.addListener(removeListener);

    // Open the auth tab
    logger.debug('[TabBasedPKCE] Opening auth tab');
    const tab = await browser.tabs.create({ url: authUrl, active: true });
    authTabId = tab.id;

    if (authTabId === undefined) {
      await cleanup();
      await clearPKCEState();
      return {
        success: false,
        error: 'tab_creation_failed',
        errorDescription: 'Failed to create authentication tab',
      };
    }

    return authPromise;
  } catch (error: any) {
    await cleanup();
    await clearPKCEState();

    logger.error('[TabBasedPKCE] Authentication failed:', error);

    return {
      success: false,
      error: 'auth_failed',
      errorDescription: error.message || 'Authentication failed',
    };
  }
}

/**
 * Check if tab-based PKCE should be used
 * Returns true for Firefox browsers where identity API is not available
 */
export function shouldUseTabBasedPKCE(): boolean {
  // Check if identity API is available
  const hasIdentityAPI = typeof browser.identity?.launchWebAuthFlow === 'function';

  if (hasIdentityAPI) {
    // Identity API is available, prefer it
    return false;
  }

  // Identity API not available, use tab-based PKCE
  return true;
}
