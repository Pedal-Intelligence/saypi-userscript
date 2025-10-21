import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SettingsHeader } from '../../../entrypoints/settings/components/header';
import { createTestContainer, cleanupTestContainer } from '../setup';

describe('SettingsHeader', () => {
  let container: HTMLElement;
  let headerRoot: HTMLElement | null;
  let header: SettingsHeader;

  beforeEach(() => {
    container = createTestContainer('<header class="settings-header"></header>');
    headerRoot = container.querySelector('.settings-header');
    if (!headerRoot) {
      throw new Error('Failed to find header root in test setup');
    }
    header = new SettingsHeader(headerRoot);
  });

  afterEach(() => {
    cleanupTestContainer(container);
  });

  it('renders the profile banner markup', () => {
    header.render();

    const profile = headerRoot!.querySelector('#profile');
    const authButton = headerRoot!.querySelector('#auth-button');
    const profileStatus = headerRoot!.querySelector('#profile-status');
    const profileName = headerRoot!.querySelector('#profile-name');

    expect(profile).toBeTruthy();
    expect(authButton).toBeTruthy();
    expect(profileStatus).toBeTruthy();
    expect(profileName).toBeTruthy();
  });

  it('is idempotent when render is called multiple times', () => {
    header.render();
    header.render();

    const profiles = headerRoot!.querySelectorAll('#profile');
    const authButtons = headerRoot!.querySelectorAll('#auth-button');

    expect(profiles.length).toBe(1);
    expect(authButtons.length).toBe(1);
  });

  it('clears markup on destroy', () => {
    header.render();
    header.destroy();

    expect(headerRoot!.innerHTML).toBe('');
  });
});
