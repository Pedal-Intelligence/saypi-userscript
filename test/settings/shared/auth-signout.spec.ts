import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { SettingsHeader } from '../../../entrypoints/settings/components/header';
import {
  createTestContainer,
  cleanupTestContainer,
  setupChromeMock,
} from '../setup';

/**
 * Issue #454: settings/popup sign-out must not orphan `oauthRefreshToken`.
 *
 * The settings page loads auth-shared.js and then auth.js (see
 * entrypoints/settings/index.ts). Sign-out must route through the background
 * SIGN_OUT handler (src/svc/background.ts), whose `jwtManager.clear()` is the
 * single source of truth for the credential wipe — including
 * `oauthRefreshToken`, which otherwise silently re-authenticates the user on
 * the next service-worker start (JwtManager.loadFromStorage → refreshWithOAuth).
 */

// The storage keys `JwtManager.clear()` wipes (src/JwtManager.ts) — the
// contract implemented by the background SIGN_OUT handler.
const JWT_MANAGER_CLEARED_KEYS = [
  'jwtToken',
  'tokenExpiresAt',
  'authCookieValue',
  'oauthRefreshToken',
];

// A well-formed (unsigned) JWT so auth.js's initializeAuth() can parse claims.
const fakeJwt = [
  'header',
  Buffer.from(JSON.stringify({ name: 'Ada Lovelace' })).toString('base64'),
  'signature',
].join('.');

describe('settings sign-out (issue #454)', () => {
  let container: HTMLElement;
  let headerRoot: HTMLElement | null;
  let chromeMocks: ReturnType<typeof setupChromeMock>;

  beforeEach(async () => {
    vi.resetModules();
    container = createTestContainer('<header class="settings-header"></header>');
    headerRoot = container.querySelector('.settings-header');
    if (!headerRoot) {
      throw new Error('Failed to find header root for auth sign-out test');
    }

    const header = new SettingsHeader(headerRoot);
    header.render();

    chromeMocks = setupChromeMock();
    chromeMocks.i18n.getMessage.mockImplementation((key: string, substitutions?: string[]) => {
      switch (key) {
        case 'signIn':
          return 'Sign In';
        case 'signOut':
          return 'Sign Out';
        case 'greeting':
          return substitutions && substitutions.length > 0
            ? `Hello, ${substitutions[0]}`
            : 'Hello';
        default:
          return key;
      }
    });

    // Seed a signed-in OAuth/PKCE session: JWT + refresh token in storage.
    (chromeMocks.storage as any)._setState({
      jwtToken: fakeJwt,
      tokenExpiresAt: Date.now() + 15 * 60 * 1000,
      oauthRefreshToken: 'refresh-token-454',
    });

    // Stand-in for the background SIGN_OUT handler (src/svc/background.ts):
    // it awaits jwtManager.clear(), which removes JWT_MANAGER_CLEARED_KEYS.
    chromeMocks.runtime.sendMessage.mockImplementation(
      (message: any, callback?: (response: any) => void) => {
        if (message && message.type === 'SIGN_OUT') {
          chromeMocks.storage.remove(JWT_MANAGER_CLEARED_KEYS, () => {
            if (callback) callback({ success: true });
          });
        } else if (callback) {
          callback(undefined);
        }
      }
    );

    // Match the real settings-page load order (entrypoints/settings/index.ts):
    // auth-shared.js first, then auth.js.
    await import('../../../src/popup/auth-shared.js');
    // In a real page window === globalThis, so auth.js's bare `updateAuthUI`
    // references resolve to the global exported by auth-shared.js. Mirror that
    // here (the Vitest Node env keeps window and globalThis distinct).
    (globalThis as any).updateAuthUI = (window as any).updateAuthUI;
    await import('../../../src/popup/auth.js');
  });

  afterEach(() => {
    cleanupTestContainer(container);
    chromeMocks.cleanup();
    delete (globalThis as any).updateAuthUI;
    delete (window as any).updateAuthUI;
    delete (window as any).handleSignIn;
    delete (window as any).handleSignOut;
    delete (window as any).refreshAuthUI;
    delete (window as any).logoutFromSaas;
    delete (window as any).updateUIAfterSignOut;
    delete (window as any).performLocalSignOut;
    delete (window as any).setAuthButtonLoading;
    delete (window as any).showAuthSuccess;
    delete (window as any).fallbackToTabAuth;
    delete (window as any).signOut;
  });

  it('leaves no stored credential that can re-authenticate the user', async () => {
    await (window as any).performLocalSignOut();

    const storedState = (chromeMocks.storage as any)._getState();
    // oauthRefreshToken is the re-auth credential: if it survives sign-out,
    // JwtManager.loadFromStorage() silently signs the user back in on the
    // next service-worker start.
    expect(storedState.oauthRefreshToken).toBeUndefined();
    expect(storedState.jwtToken).toBeUndefined();
    expect(storedState.tokenExpiresAt).toBeUndefined();
    expect(storedState.authCookieValue).toBeUndefined();
  });

  it('routes sign-out through the background SIGN_OUT handler', async () => {
    await (window as any).performLocalSignOut();

    // The background handler is the single source of truth: it clears the
    // in-memory jwtManager singleton, cancels the refresh alarm, removes the
    // auth cookie, and broadcasts the signed-out status to content scripts.
    expect(chromeMocks.runtime.sendMessage).toHaveBeenCalledWith(
      { type: 'SIGN_OUT' },
      expect.any(Function)
    );
  });
});
