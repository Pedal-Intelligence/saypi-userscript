/**
 * Tests for TabBasedPKCEAuth - Tab-based PKCE authentication for Firefox
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock wxt/browser before importing
const mockStorage: Record<string, any> = {};
const mockTabs: Map<number, { id: number; url: string }> = new Map();
let tabIdCounter = 1;
let onUpdatedListeners: Array<(tabId: number, changeInfo: any, tab: any) => void> = [];
let onRemovedListeners: Array<(tabId: number) => void> = [];

vi.mock('wxt/browser', () => ({
  browser: {
    storage: {
      local: {
        get: vi.fn((key: string) => Promise.resolve({ [key]: mockStorage[key] })),
        set: vi.fn((data: Record<string, any>) => {
          Object.assign(mockStorage, data);
          return Promise.resolve();
        }),
        remove: vi.fn((key: string) => {
          delete mockStorage[key];
          return Promise.resolve();
        }),
      },
    },
    runtime: {
      getURL: vi.fn(() => 'moz-extension://test-addon-id/'),
    },
    tabs: {
      create: vi.fn(async (options: { url: string; active?: boolean }) => {
        const id = tabIdCounter++;
        const tab = { id, url: options.url };
        mockTabs.set(id, tab);
        return tab;
      }),
      remove: vi.fn(async (tabId: number) => {
        mockTabs.delete(tabId);
      }),
      onUpdated: {
        addListener: vi.fn((listener: any) => {
          onUpdatedListeners.push(listener);
        }),
        removeListener: vi.fn((listener: any) => {
          onUpdatedListeners = onUpdatedListeners.filter(l => l !== listener);
        }),
      },
      onRemoved: {
        addListener: vi.fn((listener: any) => {
          onRemovedListeners.push(listener);
        }),
        removeListener: vi.fn((listener: any) => {
          onRemovedListeners = onRemovedListeners.filter(l => l !== listener);
        }),
      },
    },
    identity: undefined, // Simulate Firefox without identity API
  },
}));

// Mock config
vi.mock('../../src/ConfigModule', () => ({
  config: {
    authServerUrl: 'https://test.saypi.ai',
  },
}));

// Mock logger
vi.mock('../../src/LoggingModule', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

import {
  getTabBasedRedirectUri,
  authenticateWithTabBasedPKCE,
  shouldUseTabBasedPKCE,
} from '../../src/auth/TabBasedPKCEAuth';
import { browser } from 'wxt/browser';

describe('TabBasedPKCEAuth', () => {
  beforeEach(() => {
    // Clear mock storage
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
    // Clear mock tabs
    mockTabs.clear();
    tabIdCounter = 1;
    // Clear listeners
    onUpdatedListeners = [];
    onRemovedListeners = [];
    // Reset call counts but keep implementations
    vi.resetAllMocks();
    // Ensure runtime.getURL returns Firefox URL by default
    (browser.runtime.getURL as any).mockReturnValue('moz-extension://test-addon-id/');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getTabBasedRedirectUri', () => {
    it('returns Firefox extensions.allizom.org URI for moz-extension', () => {
      (browser.runtime.getURL as any).mockReturnValue('moz-extension://test-addon-id/');

      const uri = getTabBasedRedirectUri();

      expect(uri).toBe('https://test-addon-id.extensions.allizom.org/');
    });

    it('returns Chrome chromiumapp.org URI for chrome-extension', () => {
      (browser.runtime.getURL as any).mockReturnValue('chrome-extension://test-extension-id/');

      const uri = getTabBasedRedirectUri();

      expect(uri).toBe('https://test-extension-id.chromiumapp.org/');
    });

    it('returns fallback URI for unknown protocol', () => {
      (browser.runtime.getURL as any).mockReturnValue('unknown://test-id/');

      const uri = getTabBasedRedirectUri();

      expect(uri).toBe('unknown://test-id/oauth-callback');
    });
  });

  describe('shouldUseTabBasedPKCE', () => {
    it('returns true when identity API is not available', () => {
      // browser.identity is undefined in our mock
      expect(shouldUseTabBasedPKCE()).toBe(true);
    });

    it('returns false when identity API is available', () => {
      // Temporarily add identity API
      const originalIdentity = (browser as any).identity;
      (browser as any).identity = {
        launchWebAuthFlow: vi.fn(),
      };

      expect(shouldUseTabBasedPKCE()).toBe(false);

      // Restore
      (browser as any).identity = originalIdentity;
    });
  });

  describe('authenticateWithTabBasedPKCE', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      // Mock fetch for token exchange
      global.fetch = vi.fn();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('creates a tab with authorization URL', async () => {
      // Start authentication (don't await, we'll simulate the redirect)
      const authPromise = authenticateWithTabBasedPKCE();

      // Wait for tab to be created
      await vi.waitFor(() => expect(browser.tabs.create).toHaveBeenCalled());

      // Verify tab was created with correct URL
      expect(browser.tabs.create).toHaveBeenCalledWith(
        expect.objectContaining({
          url: expect.stringContaining('/api/oauth/authorize'),
          active: true,
        })
      );

      // Verify URL contains PKCE parameters
      const createCall = (browser.tabs.create as any).mock.calls[0][0];
      expect(createCall.url).toContain('code_challenge=');
      expect(createCall.url).toContain('code_challenge_method=S256');
      expect(createCall.url).toContain('state=');
      expect(createCall.url).toContain('client_id=saypi-extension');

      // Simulate timeout to complete the test
      vi.advanceTimersByTime(5 * 60 * 1000 + 1000);
      await vi.runAllTimersAsync();

      const result = await authPromise;
      expect(result.success).toBe(false);
      expect(result.error).toBe('auth_timeout');
    });

    it('stores PKCE state before opening tab', async () => {
      const authPromise = authenticateWithTabBasedPKCE();

      // Wait for tab to be created (which happens after PKCE state is stored)
      await vi.waitFor(() => expect(browser.tabs.create).toHaveBeenCalled());

      // Verify PKCE state was stored with Firefox redirect URI
      expect(browser.storage.local.set).toHaveBeenCalledWith(
        expect.objectContaining({
          'saypi-pkce-state': expect.objectContaining({
            codeVerifier: expect.any(String),
            state: expect.any(String),
            redirectUri: expect.stringContaining('extensions.allizom.org'),
            createdAt: expect.any(Number),
          }),
        })
      );

      // Cleanup - advance past timeout
      vi.advanceTimersByTime(5 * 60 * 1000 + 1000);
      await vi.runAllTimersAsync();
      await authPromise;
    });

    it('detects redirect URL and extracts authorization code', async () => {
      // Mock successful token exchange
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          access_token: 'test-access-token',
          token_type: 'Bearer',
          expires_in: 3600,
          refresh_token: 'test-refresh-token',
          scope: 'openid profile',
        }),
      });

      // Start authentication
      const authPromise = authenticateWithTabBasedPKCE();

      // Wait for tab to be created (happens after PKCE state is stored)
      await vi.waitFor(() => expect(browser.tabs.create).toHaveBeenCalled());

      // Get the stored state
      const storedState = mockStorage['saypi-pkce-state'];
      expect(storedState).toBeDefined();

      // Simulate redirect by triggering onUpdated listener
      const tabId = 1;
      const redirectUrl = `https://test-addon-id.extensions.allizom.org/?code=test-auth-code&state=${storedState.state}`;

      // Trigger the onUpdated listener
      for (const listener of onUpdatedListeners) {
        listener(tabId, { url: redirectUrl }, { id: tabId, url: redirectUrl });
      }

      await vi.runAllTimersAsync();
      const result = await authPromise;

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.tokens.access_token).toBe('test-access-token');
        expect(result.tokens.refresh_token).toBe('test-refresh-token');
      }
    });

    it('handles OAuth error in redirect URL', async () => {
      const authPromise = authenticateWithTabBasedPKCE();

      // Wait for tab to be created
      await vi.waitFor(() => expect(browser.tabs.create).toHaveBeenCalled());

      // Simulate error redirect
      const tabId = 1;
      const errorUrl = 'https://test-addon-id.extensions.allizom.org/?error=access_denied&error_description=User%20denied%20access';

      for (const listener of onUpdatedListeners) {
        listener(tabId, { url: errorUrl }, { id: tabId, url: errorUrl });
      }

      await vi.runAllTimersAsync();
      const result = await authPromise;

      expect(result.success).toBe(false);
      expect(result.error).toBe('access_denied');
      expect(result.errorDescription).toBe('User denied access');
    });

    it('handles state mismatch (CSRF protection)', async () => {
      const authPromise = authenticateWithTabBasedPKCE();

      // Wait for tab to be created
      await vi.waitFor(() => expect(browser.tabs.create).toHaveBeenCalled());

      // Simulate redirect with wrong state
      const tabId = 1;
      const wrongStateUrl = 'https://test-addon-id.extensions.allizom.org/?code=test-code&state=wrong-state';

      for (const listener of onUpdatedListeners) {
        listener(tabId, { url: wrongStateUrl }, { id: tabId, url: wrongStateUrl });
      }

      await vi.runAllTimersAsync();
      const result = await authPromise;

      expect(result.success).toBe(false);
      expect(result.error).toBe('state_mismatch');
    });

    it('handles token exchange failure', async () => {
      // Mock failed token exchange
      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({
          error: 'invalid_grant',
          error_description: 'Authorization code expired',
        }),
      });

      const authPromise = authenticateWithTabBasedPKCE();

      // Wait for tab to be created
      await vi.waitFor(() => expect(browser.tabs.create).toHaveBeenCalled());

      const storedState = mockStorage['saypi-pkce-state'];
      const tabId = 1;
      const redirectUrl = `https://test-addon-id.extensions.allizom.org/?code=test-code&state=${storedState.state}`;

      for (const listener of onUpdatedListeners) {
        listener(tabId, { url: redirectUrl }, { id: tabId, url: redirectUrl });
      }

      await vi.runAllTimersAsync();
      const result = await authPromise;

      expect(result.success).toBe(false);
      expect(result.error).toBe('token_exchange_failed');
    });

    it('handles timeout', async () => {
      const authPromise = authenticateWithTabBasedPKCE();

      // Wait for tab to be created
      await vi.waitFor(() => expect(browser.tabs.create).toHaveBeenCalled());

      // Advance time past timeout
      vi.advanceTimersByTime(5 * 60 * 1000 + 1000);
      await vi.runAllTimersAsync();

      const result = await authPromise;

      expect(result.success).toBe(false);
      expect(result.error).toBe('auth_timeout');
    });

    it('cleans up listeners and closes tab after success', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          access_token: 'test-token',
          token_type: 'Bearer',
          expires_in: 3600,
          refresh_token: 'test-refresh',
          scope: 'openid profile',
        }),
      });

      const authPromise = authenticateWithTabBasedPKCE();

      // Wait for tab to be created
      await vi.waitFor(() => expect(browser.tabs.create).toHaveBeenCalled());

      const storedState = mockStorage['saypi-pkce-state'];
      const tabId = 1;
      const redirectUrl = `https://test-addon-id.extensions.allizom.org/?code=test-code&state=${storedState.state}`;

      for (const listener of [...onUpdatedListeners]) {
        listener(tabId, { url: redirectUrl }, { id: tabId, url: redirectUrl });
      }

      await vi.runAllTimersAsync();
      await authPromise;

      // Verify cleanup
      expect(browser.tabs.onUpdated.removeListener).toHaveBeenCalled();
      expect(browser.tabs.remove).toHaveBeenCalledWith(tabId);
    });

    it('clears PKCE state after authentication', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          access_token: 'test-token',
          token_type: 'Bearer',
          expires_in: 3600,
          refresh_token: 'test-refresh',
          scope: 'openid profile',
        }),
      });

      const authPromise = authenticateWithTabBasedPKCE();

      // Wait for tab to be created
      await vi.waitFor(() => expect(browser.tabs.create).toHaveBeenCalled());

      const storedState = mockStorage['saypi-pkce-state'];
      const tabId = 1;
      const redirectUrl = `https://test-addon-id.extensions.allizom.org/?code=test-code&state=${storedState.state}`;

      for (const listener of [...onUpdatedListeners]) {
        listener(tabId, { url: redirectUrl }, { id: tabId, url: redirectUrl });
      }

      await vi.runAllTimersAsync();
      await authPromise;

      // PKCE state should be cleared (retrievePKCEState clears it on retrieval)
      expect(browser.storage.local.remove).toHaveBeenCalledWith('saypi-pkce-state');
    });
  });
});
