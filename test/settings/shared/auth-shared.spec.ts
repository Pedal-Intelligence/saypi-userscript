import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { SettingsHeader } from '../../../entrypoints/settings/components/header';
import {
  createTestContainer,
  cleanupTestContainer,
  setupChromeMock,
} from '../setup';

describe('auth-shared updateAuthUI', () => {
  let container: HTMLElement;
  let headerRoot: HTMLElement | null;
  let cleanupChrome: () => void;

  beforeEach(async () => {
    vi.resetModules();
    container = createTestContainer('<header class="settings-header"></header>');
    headerRoot = container.querySelector('.settings-header');
    if (!headerRoot) {
      throw new Error('Failed to find header root for auth-shared test');
    }

    const header = new SettingsHeader(headerRoot);
    header.render();

    const chromeMocks = setupChromeMock();
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

    cleanupChrome = () => {
      chromeMocks.cleanup();
      delete (global as any).chrome;
    };

    await import('../../../src/popup/auth-shared.js');
  });

  afterEach(() => {
    cleanupTestContainer(container);
    cleanupChrome();
    delete (window as any).updateAuthUI;
    delete (window as any).handleSignIn;
    delete (window as any).handleSignOut;
    delete (window as any).refreshAuthUI;
    delete (window as any).logoutFromSaas;
    delete (window as any).updateUIAfterSignOut;
    delete (window as any).performLocalSignOut;
  });

  it('shows unauthenticated state with sign-in button', () => {
    const updateAuthUI = (window as any).updateAuthUI;
    expect(typeof updateAuthUI).toBe('function');

    updateAuthUI(false);

    const authButton = headerRoot!.querySelector('#auth-button');
    const profileStatus = headerRoot!.querySelector('#profile-status');
    const profileName = headerRoot!.querySelector('#profile-name');

    expect(authButton?.textContent?.trim()).toBe('Sign In');
    expect(authButton?.getAttribute('data-i18n')).toBe('signIn');
    expect(profileStatus?.classList.contains('hidden')).toBe(false);
    expect(profileName?.classList.contains('hidden')).toBe(true);
  });

  it('shows authenticated state with greeting and sign-out button', () => {
    const updateAuthUI = (window as any).updateAuthUI;
    expect(typeof updateAuthUI).toBe('function');

    updateAuthUI(true, { name: 'Ada Lovelace' });

    const authButton = headerRoot!.querySelector('#auth-button');
    const profileStatus = headerRoot!.querySelector('#profile-status');
    const profileName = headerRoot!.querySelector('#profile-name');

    expect(authButton?.textContent?.trim()).toBe('Sign Out');
    expect(authButton?.getAttribute('data-i18n')).toBe('signOut');
    expect(profileStatus?.classList.contains('hidden')).toBe(true);
    expect(profileName?.classList.contains('hidden')).toBe(false);
    expect(profileName?.textContent?.trim()).toBe('Hello, Ada Lovelace');
  });
});
