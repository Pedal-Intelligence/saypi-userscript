import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { GeneralTab } from '../../../entrypoints/settings/tabs/general';
import { setupChromeMock, createTestContainer, cleanupTestContainer, mockUserAgent, restoreUserAgent, setupLocationMock } from '../setup';

describe('GeneralTab', () => {
  let chromeMock: ReturnType<typeof setupChromeMock>;
  let container: HTMLElement;
  let generalTab: GeneralTab;
  let locationMock: ReturnType<typeof setupLocationMock>;

  beforeEach(() => {
    chromeMock = setupChromeMock();
    container = createTestContainer();
    locationMock = setupLocationMock();
    generalTab = new GeneralTab(container);
  });

  afterEach(() => {
    cleanupTestContainer(container);
    chromeMock.cleanup();
    restoreUserAgent();
  });

  describe('initialization', () => {
    it('should initialize with container', async () => {
      expect(generalTab.container).toBe(container);
    });

    it('should inject HTML template on init', async () => {
      await generalTab.init();

      expect(container.innerHTML).toContain('sound-effects');
      expect(container.innerHTML).toContain('share-data');
    });

    it('should setup all components on init', async () => {
      await generalTab.init();

      const soundEffectsInput = container.querySelector<HTMLInputElement>('#sound-effects');
      const shareDataInput = container.querySelector<HTMLInputElement>('#share-data');
      const clearBtn = container.querySelector('#clear-preferences');

      expect(soundEffectsInput).toBeTruthy();
      expect(shareDataInput).toBeTruthy();
      expect(clearBtn).toBeTruthy();
    });
  });

  describe('sound effects toggle', () => {
    it('should load saved sound effects preference', async () => {
      await chromeMock.storage.set({ soundEffects: true });

      await generalTab.init();

      const input = container.querySelector<HTMLInputElement>('#sound-effects');
      expect(input?.checked).toBe(true);
      expect(input?.parentElement?.classList.contains('checked')).toBe(true);
    });

    it('should default to true when no preference saved', async () => {
      await generalTab.init();

      const input = container.querySelector<HTMLInputElement>('#sound-effects');
      expect(input?.checked).toBe(true);
    });

    it('should save preference when toggled', async () => {
      await generalTab.init();

      const input = container.querySelector<HTMLInputElement>('#sound-effects');
      if (input) {
        input.checked = false;
        input.dispatchEvent(new Event('change'));
      }

      // Wait for async storage operation
      await new Promise(resolve => setTimeout(resolve, 10));

      const stored = chromeMock.storage._getState();
      expect(stored.soundEffects).toBe(false);
    });

    it('should update checked class on toggle', async () => {
      await generalTab.init();

      const input = container.querySelector<HTMLInputElement>('#sound-effects');
      if (input) {
        input.checked = false;
        input.dispatchEvent(new Event('change'));

        await new Promise(resolve => setTimeout(resolve, 10));

        expect(input.parentElement?.classList.contains('checked')).toBe(false);
      }
    });

    it('should disable sound effects in Firefox', async () => {
      mockUserAgent('Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0');

      await generalTab.init();

      const input = container.querySelector<HTMLInputElement>('#sound-effects');
      const wrapper = input?.closest('.wraper');

      expect(input?.disabled).toBe(true);
      expect(wrapper?.classList.contains('disabled')).toBe(true);
      expect(input?.checked).toBe(false);
    });

    it('should not disable sound effects in Chrome', async () => {
      mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

      await generalTab.init();

      const input = container.querySelector<HTMLInputElement>('#sound-effects');

      expect(input?.disabled).toBe(false);
    });
  });

  describe('analytics toggle', () => {
    it('should load saved analytics preference', async () => {
      await chromeMock.storage.set({ shareData: true });

      await generalTab.init();

      const input = container.querySelector<HTMLInputElement>('#share-data');
      expect(input?.checked).toBe(true);
      expect(input?.parentElement?.classList.contains('checked')).toBe(true);
    });

    it('should default to false when no preference saved', async () => {
      await generalTab.init();

      const input = container.querySelector<HTMLInputElement>('#share-data');
      expect(input?.checked).toBe(false);
    });

    it('should save preference when toggled', async () => {
      await generalTab.init();

      const input = container.querySelector<HTMLInputElement>('#share-data');
      if (input) {
        input.checked = true;
        input.dispatchEvent(new Event('change'));
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      const stored = chromeMock.storage._getState();
      expect(stored.shareData).toBe(true);
    });

    it('should update checked class on toggle', async () => {
      await generalTab.init();

      const input = container.querySelector<HTMLInputElement>('#share-data');
      if (input) {
        input.checked = true;
        input.dispatchEvent(new Event('change'));

        await new Promise(resolve => setTimeout(resolve, 10));

        expect(input.parentElement?.classList.contains('checked')).toBe(true);
      }
    });
  });

  describe('analytics consent', () => {
    it('should show consent dialog when shareData is undefined', async () => {
      // Don't set shareData in storage

      await generalTab.init();

      const consentSection = container.querySelector('#analytics-consent');
      expect(consentSection?.classList.contains('hidden')).toBe(false);
    });

    it('should hide other sections when showing consent', async () => {
      await generalTab.init();

      const premiumStatus = container.querySelector('#premium-status');
      const upgrade = container.querySelector('#upgrade');
      const devtools = container.querySelector('#devtools');

      expect(premiumStatus?.classList.contains('hidden')).toBe(true);
      expect(upgrade?.classList.contains('hidden')).toBe(true);
      expect(devtools?.classList.contains('hidden')).toBe(true);
    });

    it('should not show consent when shareData is set to true', async () => {
      await chromeMock.storage.set({ shareData: true });

      await generalTab.init();

      const consentSection = container.querySelector('#analytics-consent');
      // Consent section might not be in HTML if not needed, or should be hidden
      if (consentSection) {
        expect(consentSection.classList.contains('hidden')).toBe(true);
      }
    });

    it('should not show consent when shareData is set to false', async () => {
      await chromeMock.storage.set({ shareData: false });

      await generalTab.init();

      const consentSection = container.querySelector('#analytics-consent');
      if (consentSection) {
        expect(consentSection.classList.contains('hidden')).toBe(true);
      }
    });

    it('should save true and hide consent when opt-in clicked', async () => {
      await generalTab.init();

      const optInBtn = container.querySelector('#opt-in');
      if (optInBtn) {
        optInBtn.dispatchEvent(new Event('click'));
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      const stored = chromeMock.storage._getState();
      expect(stored.shareData).toBe(true);

      const consentSection = container.querySelector('#analytics-consent');
      expect(consentSection?.classList.contains('hidden')).toBe(true);
    });

    it('should save false and hide consent when opt-out clicked', async () => {
      await generalTab.init();

      const optOutBtn = container.querySelector('#opt-out');
      if (optOutBtn) {
        optOutBtn.dispatchEvent(new Event('click'));
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      const stored = chromeMock.storage._getState();
      expect(stored.shareData).toBe(false);

      const consentSection = container.querySelector('#analytics-consent');
      expect(consentSection?.classList.contains('hidden')).toBe(true);
    });

    it('should show other sections after opting in', async () => {
      await generalTab.init();

      const optInBtn = container.querySelector('#opt-in');
      if (optInBtn) {
        optInBtn.dispatchEvent(new Event('click'));
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      const premiumStatus = container.querySelector('#premium-status');
      const upgrade = container.querySelector('#upgrade');
      const devtools = container.querySelector('#devtools');

      expect(premiumStatus?.classList.contains('hidden')).toBe(false);
      expect(upgrade?.classList.contains('hidden')).toBe(false);
      expect(devtools?.classList.contains('hidden')).toBe(false);
    });
  });

  describe('clear preferences', () => {
    it('should clear storage when button clicked', async () => {
      // Set some preferences
      await chromeMock.storage.set({
        soundEffects: true,
        shareData: true,
        nickname: 'TestBot'
      });

      await generalTab.init();

      const clearBtn = container.querySelector('#clear-preferences');
      if (clearBtn) {
        clearBtn.dispatchEvent(new Event('click'));
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(chromeMock.storage.clear).toHaveBeenCalled();
    });

    it('should handle clear button when not present in DOM', async () => {
      await generalTab.init();

      // Remove button
      const btn = container.querySelector('#clear-preferences');
      btn?.remove();

      // Should not throw
      expect(() => {
        const testBtn = container.querySelector('#clear-preferences');
        testBtn?.dispatchEvent(new Event('click'));
      }).not.toThrow();
    });
  });

  describe('missing elements handling', () => {
    it('should handle missing sound-effects input gracefully', async () => {
      // Don't inject HTML to simulate missing element
      container.innerHTML = '';

      await expect(generalTab.init()).resolves.not.toThrow();
    });

    it('should handle missing share-data input gracefully', async () => {
      container.innerHTML = '<input id="sound-effects" type="checkbox" />';

      await expect(generalTab.init()).resolves.not.toThrow();
    });

    it('should handle missing consent buttons gracefully', async () => {
      container.innerHTML = `
        <input id="sound-effects" type="checkbox" />
        <input id="share-data" type="checkbox" />
      `;

      await expect(generalTab.init()).resolves.not.toThrow();
    });
  });
});
