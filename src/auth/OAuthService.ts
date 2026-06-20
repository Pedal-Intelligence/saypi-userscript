/**
 * OAuthService - OAuth 2.1 + PKCE authentication flow for browser extensions
 *
 * Handles the complete OAuth authorization flow:
 * - Chrome/Kiwi: Uses browser.identity.launchWebAuthFlow with PKCE
 * - Firefox: Uses tab-based PKCE flow with browser.tabs.onUpdated
 *
 * @see https://developer.chrome.com/docs/extensions/reference/identity/
 * @see ./TabBasedPKCEAuth.ts for Firefox implementation
 */

import { browser } from 'wxt/browser';
import type { PublicPath } from 'wxt/browser';
import { config } from '../ConfigModule';
import { logger } from '../LoggingModule';
import {
  generatePKCEPair,
  generateState,
  storePKCEState,
  retrievePKCEState,
  clearPKCEState,
  type PKCEState,
} from './PKCEManager';
import {
  authenticateWithTabBasedPKCE,
  shouldUseTabBasedPKCE,
} from './TabBasedPKCEAuth';

/**
 * OAuth client ID for the SayPi extension
 */
const CLIENT_ID = 'saypi-extension';

/**
 * Token response from the OAuth server
 */
export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

/**
 * OAuth error response
 */
export interface OAuthError {
  error: string;
  error_description?: string;
}

/**
 * Result of an OAuth authentication attempt
 */
export type OAuthResult =
  | { success: true; tokens: TokenResponse }
  | { success: false; error: string; errorDescription?: string };

/**
 * Check if browser.identity API is available
 */
function hasIdentityAPI(): boolean {
  return typeof browser.identity?.launchWebAuthFlow === 'function';
}

/**
 * Get the redirect URI for the current browser
 * Uses browser.identity.getRedirectURL() for Chrome MV3
 */
function getRedirectUri(): string {
  if (hasIdentityAPI() && typeof browser.identity.getRedirectURL === 'function') {
    // Chrome MV3: Use the identity API redirect URL
    return browser.identity.getRedirectURL();
  }

  // Fallback: Construct from extension ID
  const extensionUrl = browser.runtime.getURL('');
  const extensionId = new URL(extensionUrl).host;

  // Chrome format
  if (extensionUrl.startsWith('chrome-extension://')) {
    return `https://${extensionId}.chromiumapp.org/`;
  }

  // Firefox format
  if (extensionUrl.startsWith('moz-extension://')) {
    return `https://${extensionId}.extensions.allizom.org/`;
  }

  // Unknown - use extension URL as fallback
  return `${extensionUrl}oauth-callback`;
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
 * Refresh tokens using a refresh token
 */
export async function refreshTokens(refreshToken: string): Promise<TokenResponse> {
  const tokenUrl = `${config.authServerUrl}/api/oauth/token`;

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error_description ||
        errorData.error ||
        `Token refresh failed: ${response.status}`
    );
  }

  return response.json();
}

/**
 * Perform OAuth 2.1 + PKCE authentication using browser.identity API
 * This is the primary flow for Chrome MV3 extensions
 */
async function authenticateWithIdentityAPI(): Promise<OAuthResult> {
  if (!config.authServerUrl) {
    return {
      success: false,
      error: 'configuration_error',
      errorDescription: 'Auth server URL not configured',
    };
  }

  try {
    // Generate PKCE pair
    const { codeVerifier, codeChallenge } = await generatePKCEPair();
    const state = generateState();
    const redirectUri = getRedirectUri();

    logger.debug('[OAuthService] Starting PKCE auth flow', { redirectUri });

    // Store PKCE state for verification
    await storePKCEState({
      codeVerifier,
      state,
      redirectUri,
      createdAt: Date.now(),
    });

    // Build authorization URL
    const authUrl = buildAuthorizationUrl(codeChallenge, state, redirectUri);

    logger.debug('[OAuthService] Launching web auth flow');

    // Launch the OAuth flow using identity API
    const resultUrl = await browser.identity.launchWebAuthFlow({
      url: authUrl,
      interactive: true,
    });

    if (!resultUrl) {
      await clearPKCEState();
      return {
        success: false,
        error: 'auth_cancelled',
        errorDescription: 'Authentication was cancelled',
      };
    }

    logger.debug('[OAuthService] Auth flow completed, parsing response');

    // Parse the response
    const response = parseAuthorizationResponse(resultUrl);

    // Check for OAuth errors
    if (response.error) {
      await clearPKCEState();
      return {
        success: false,
        error: response.error,
        errorDescription: response.errorDescription,
      };
    }

    if (!response.code || !response.state) {
      await clearPKCEState();
      return {
        success: false,
        error: 'invalid_response',
        errorDescription: 'Missing code or state in response',
      };
    }

    // Retrieve and validate PKCE state
    const pkceState = await retrievePKCEState(response.state);

    if (!pkceState) {
      return {
        success: false,
        error: 'state_mismatch',
        errorDescription: 'Invalid or expired state parameter',
      };
    }

    logger.debug('[OAuthService] Exchanging code for tokens');

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(
      response.code,
      pkceState.codeVerifier,
      pkceState.redirectUri
    );

    logger.info('[OAuthService] Authentication successful');

    return { success: true, tokens };
  } catch (error: any) {
    await clearPKCEState();

    // Handle user cancellation
    if (
      error.message?.includes('canceled') ||
      error.message?.includes('cancelled') ||
      error.message?.includes('user closed')
    ) {
      return {
        success: false,
        error: 'auth_cancelled',
        errorDescription: 'Authentication was cancelled by user',
      };
    }

    logger.error('[OAuthService] Authentication failed:', error);

    return {
      success: false,
      error: 'auth_failed',
      errorDescription: error.message || 'Authentication failed',
    };
  }
}

/**
 * Perform OAuth authentication using tab-based flow
 * This is the fallback for browsers without identity API (Firefox)
 */
async function authenticateWithTabFlow(): Promise<OAuthResult> {
  if (!config.authServerUrl) {
    return {
      success: false,
      error: 'configuration_error',
      errorDescription: 'Auth server URL not configured',
    };
  }

  // For Firefox, we still use the cookie-based flow for now
  // PKCE tab flow would require setting up a listener for the redirect
  // which is more complex and may not be necessary if cookie flow works
  logger.info('[OAuthService] Using tab-based auth flow (Firefox)');

  // Store return URL for after authentication
  const returnUrl = browser.runtime.getURL('settings.html' as PublicPath);
  await browser.storage.local.set({ authReturnUrl: returnUrl });

  // Open login page in a new tab
  const loginUrl = `${config.authServerUrl}/auth/login`;
  await browser.tabs.create({ url: loginUrl });

  // The cookie-based flow will handle the rest via cookies.onChanged listener
  // Return a pending state - the actual auth completion happens asynchronously
  return {
    success: false,
    error: 'pending_tab_flow',
    errorDescription: 'Authentication in progress in new tab',
  };
}

/**
 * Start the OAuth authentication flow
 * Uses identity API for Chrome/Kiwi, tab-based PKCE for Firefox
 */
export async function authenticate(): Promise<OAuthResult> {
  if (hasIdentityAPI()) {
    logger.debug('[OAuthService] Using identity API for authentication');
    return authenticateWithIdentityAPI();
  }

  if (shouldUseTabBasedPKCE()) {
    logger.debug('[OAuthService] Using tab-based PKCE for authentication');
    return authenticateWithTabBasedPKCE();
  }

  // Ultimate fallback to cookie-based flow (should rarely be needed)
  logger.debug('[OAuthService] Falling back to cookie-based authentication');
  return authenticateWithTabFlow();
}

/**
 * Check if PKCE authentication is supported on this browser
 * Returns true for both identity API (Chrome) and tab-based PKCE (Firefox)
 */
export function isPKCESupported(): boolean {
  return hasIdentityAPI() || shouldUseTabBasedPKCE();
}

/**
 * Get the OAuth client ID
 */
export function getClientId(): string {
  return CLIENT_ID;
}
