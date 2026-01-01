/**
 * PKCEManager - PKCE (Proof Key for Code Exchange) utilities for OAuth 2.1
 *
 * Generates cryptographically secure code verifiers and challenges
 * for the OAuth authorization flow in browser extensions.
 *
 * @see https://tools.ietf.org/html/rfc7636
 */

import { logger } from '../LoggingModule';

/**
 * Minimum length for code verifier (RFC 7636 recommends 43-128 characters)
 */
const CODE_VERIFIER_LENGTH = 64;

/**
 * Characters allowed in code verifier (unreserved characters per RFC 7636)
 */
const CODE_VERIFIER_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';

/**
 * Generate a cryptographically random code verifier
 * @returns A random string suitable for use as a PKCE code verifier
 */
export function generateCodeVerifier(): string {
  const array = new Uint8Array(CODE_VERIFIER_LENGTH);
  crypto.getRandomValues(array);

  let verifier = '';
  for (let i = 0; i < array.length; i++) {
    verifier += CODE_VERIFIER_CHARSET[array[i] % CODE_VERIFIER_CHARSET.length];
  }

  return verifier;
}

/**
 * Generate a code challenge from a code verifier using SHA-256
 * @param verifier The code verifier to hash
 * @returns Base64URL-encoded SHA-256 hash of the verifier
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(new Uint8Array(hash));
}

/**
 * Generate a random state parameter for CSRF protection
 * @returns A random string for use as the OAuth state parameter
 */
export function generateState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

/**
 * Base64URL encode a byte array (RFC 4648)
 * @param buffer The bytes to encode
 * @returns Base64URL-encoded string
 */
function base64UrlEncode(buffer: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < buffer.length; i++) {
    binary += String.fromCharCode(buffer[i]);
  }

  // Standard base64 encode
  const base64 = btoa(binary);

  // Convert to base64url: replace + with -, / with _, remove padding =
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * PKCE flow state stored during authorization
 */
export interface PKCEState {
  codeVerifier: string;
  state: string;
  redirectUri: string;
  createdAt: number;
}

/**
 * Storage key for PKCE state
 */
const PKCE_STATE_KEY = 'saypi-pkce-state';

/**
 * PKCE state expiry time (10 minutes)
 */
const PKCE_STATE_EXPIRY_MS = 10 * 60 * 1000;

/**
 * Store PKCE state for later verification
 * @param state The PKCE state to store
 */
export async function storePKCEState(state: PKCEState): Promise<void> {
  try {
    const { browser } = await import('wxt/browser');
    await browser.storage.local.set({ [PKCE_STATE_KEY]: state });
    logger.debug('[PKCEManager] Stored PKCE state');
  } catch (error) {
    logger.error('[PKCEManager] Failed to store PKCE state:', error);
    throw error;
  }
}

/**
 * Retrieve and clear PKCE state
 * @param expectedState The state parameter to verify
 * @returns The stored PKCE state if valid, null otherwise
 */
export async function retrievePKCEState(expectedState: string): Promise<PKCEState | null> {
  try {
    const { browser } = await import('wxt/browser');
    const result = await browser.storage.local.get(PKCE_STATE_KEY);
    const storedState = result[PKCE_STATE_KEY] as PKCEState | undefined;

    // Clear the state regardless of validity (single use)
    await browser.storage.local.remove(PKCE_STATE_KEY);

    if (!storedState) {
      logger.warn('[PKCEManager] No PKCE state found');
      return null;
    }

    // Verify state matches
    if (storedState.state !== expectedState) {
      logger.warn('[PKCEManager] State mismatch - possible CSRF attack');
      return null;
    }

    // Check expiry
    if (Date.now() - storedState.createdAt > PKCE_STATE_EXPIRY_MS) {
      logger.warn('[PKCEManager] PKCE state expired');
      return null;
    }

    logger.debug('[PKCEManager] Retrieved valid PKCE state');
    return storedState;
  } catch (error) {
    logger.error('[PKCEManager] Failed to retrieve PKCE state:', error);
    return null;
  }
}

/**
 * Clear any existing PKCE state
 */
export async function clearPKCEState(): Promise<void> {
  try {
    const { browser } = await import('wxt/browser');
    await browser.storage.local.remove(PKCE_STATE_KEY);
    logger.debug('[PKCEManager] Cleared PKCE state');
  } catch (error) {
    logger.error('[PKCEManager] Failed to clear PKCE state:', error);
  }
}

/**
 * Generate a complete PKCE pair (verifier + challenge)
 * @returns Object containing code_verifier and code_challenge
 */
export async function generatePKCEPair(): Promise<{ codeVerifier: string; codeChallenge: string }> {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  return { codeVerifier, codeChallenge };
}
