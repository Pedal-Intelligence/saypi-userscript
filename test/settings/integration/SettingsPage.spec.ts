import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setupChromeMock, createTestContainer, cleanupTestContainer, setupLocationMock } from '../setup';
import { TabNavigator } from '../../../entrypoints/settings/components/tabs';
import { GeneralTab } from '../../../entrypoints/settings/tabs/general';
import { ChatTab } from '../../../entrypoints/settings/tabs/chat';
import { initIcons, refreshIcons, _resetIconState } from '../../../entrypoints/settings/components/icons';
import { replaceI18n } from '../../../entrypoints/settings/shared/i18n';

describe('Settings Page Integration', () => {
  let chromeMock: ReturnType<typeof setupChromeMock>;
  let container: HTMLElement;
  let mockLucide: any;
  let locationMock: ReturnType<typeof setupLocationMock>;

  beforeEach(() => {
    chromeMock = setupChromeMock();
    container = createTestContainer();
    locationMock = setupLocationMock();

    // Reset icon state before each test
    _resetIconState();

    // Mock localStorage
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn(),
      length: 0
    };

    // Mock agent mode entitlement check to return false (no entitlement) by default
    chromeMock.runtime.sendMessage.mockImplementation((message: any, callback: any) => {
      if (message.type === 'CHECK_FEATURE_ENTITLEMENT' && message.feature === 'agent_mode') {
        callback({ hasEntitlement: false });
      }
    });

    // Mock window.lucide
    mockLucide = {
      createIcons: vi.fn(),
      icons: {
        settings: {},
        'bot-message-square': {},
        mic: {},
        info: {}
      }
    };
    (window as any).lucide = mockLucide;
  });

  afterEach(() => {
    cleanupTestContainer(container);
    chromeMock.cleanup();
    delete (window as any).lucide;
    vi.resetModules();
  });

  function setupFullSettingsPage() {
    container.innerHTML = `
      <div class="settings-page">
        <div class="tab-buttons">
          <button class="tab-button active" data-tab="general" data-i18n="tabGeneral">
            General
          </button>
          <button class="tab-button" data-tab="chat" data-i18n="tabChat">
            Chat
          </button>
        </div>
        <div class="tab-panels">
          <div class="tab-panel" id="tab-general"></div>
          <div class="tab-panel hidden" id="tab-chat"></div>
        </div>
      </div>
    `;
  }

  describe('full initialization flow', () => {
    it('should initialize all components in correct order', async () => {
      setupFullSettingsPage();

      // 1. Initialize tabs
      const generalTab = new GeneralTab(container.querySelector('#tab-general')!);
      const chatTab = new ChatTab(container.querySelector('#tab-chat')!);

      await generalTab.init();
      await chatTab.init();

      // 2. Initialize tab navigator
      const navigator = new TabNavigator();

      // 3. Apply i18n
      replaceI18n();

      // 4. Initialize icons
      initIcons();

      // Verify everything worked
      expect(container.querySelector('#sound-effects')).toBeTruthy();
      expect(container.querySelector('#assistant-nickname')).toBeTruthy();
      expect(mockLucide.createIcons).toHaveBeenCalled();
    });

    it('should preserve icons after i18n replacement', async () => {
      setupFullSettingsPage();

      const navigator = new TabNavigator();

      // Icons should be added to buttons
      const generalButton = container.querySelector('[data-tab="general"]');
      expect(generalButton?.querySelector('[data-lucide]')).toBeTruthy();

      // Apply i18n
      replaceI18n();

      // Icons should still be there
      expect(generalButton?.querySelector('[data-lucide]')).toBeTruthy();
      expect(generalButton?.querySelector('.tab-label')?.textContent).toBe('tabGeneral');

      // Initialize icons
      initIcons();

      expect(mockLucide.createIcons).toHaveBeenCalled();
    });
  });

  describe('tab switching with persistence', () => {
    it('should switch tabs and persist settings', async () => {
      setupFullSettingsPage();

      const generalTab = new GeneralTab(container.querySelector('#tab-general')!);
      const chatTab = new ChatTab(container.querySelector('#tab-chat')!);

      await generalTab.init();
      await chatTab.init();

      const navigator = new TabNavigator();

      // User switches to chat tab
      navigator.selectTab('chat');

      expect(localStorage.setItem).toHaveBeenCalledWith('saypi.settings.selectedTab', 'chat');

      const chatPanel = container.querySelector('#tab-chat');
      expect(chatPanel?.classList.contains('hidden')).toBe(false);
    });

    it('should maintain settings across tab switches', async () => {
      setupFullSettingsPage();

      const generalTab = new GeneralTab(container.querySelector('#tab-general')!);
      const chatTab = new ChatTab(container.querySelector('#tab-chat')!);

      await generalTab.init();
      await chatTab.init();

      // Set sound effects on general tab
      const soundEffectsInput = container.querySelector<HTMLInputElement>('#sound-effects');
      if (soundEffectsInput) {
        soundEffectsInput.checked = false;
        soundEffectsInput.dispatchEvent(new Event('change'));
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      // Switch to chat tab
      const navigator = new TabNavigator();
      navigator.selectTab('chat');

      // Set nickname on chat tab
      const nicknameInput = container.querySelector<HTMLInputElement>('#assistant-nickname');
      if (nicknameInput) {
        nicknameInput.value = 'TestBot';
        nicknameInput.dispatchEvent(new Event('change'));
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      // Switch back to general
      navigator.selectTab('general');

      // Settings should be preserved
      const stored = chromeMock.storage._getState();
      expect(stored.soundEffects).toBe(false);
      expect(stored.nickname).toBe('TestBot');
    });
  });

  describe('settings persistence', () => {
    it('should save and restore multiple settings', async () => {
      setupFullSettingsPage();

      // Pre-populate storage
      await chromeMock.storage.set({
        soundEffects: true,
        shareData: true,
        nickname: 'SavedBot',
        allowInterruptions: false,
        autoReadAloudChatGPT: true
      });

      const generalTab = new GeneralTab(container.querySelector('#tab-general')!);
      const chatTab = new ChatTab(container.querySelector('#tab-chat')!);

      await generalTab.init();
      await chatTab.init();

      // Verify settings were loaded
      const soundEffects = container.querySelector<HTMLInputElement>('#sound-effects');
      const shareData = container.querySelector<HTMLInputElement>('#share-data');
      const nickname = container.querySelector<HTMLInputElement>('#assistant-nickname');
      const interruptions = container.querySelector<HTMLInputElement>('#allow-interruptions');
      const autoRead = container.querySelector<HTMLInputElement>('#chatgpt-auto-read-aloud');

      expect(soundEffects?.checked).toBe(true);
      expect(shareData?.checked).toBe(true);
      expect(nickname?.value).toBe('SavedBot');
      expect(interruptions?.checked).toBe(false);
      expect(autoRead?.checked).toBe(true);
    });

    it('should handle clearing all preferences', async () => {
      setupFullSettingsPage();

      await chromeMock.storage.set({
        soundEffects: true,
        nickname: 'TestBot'
      });

      const generalTab = new GeneralTab(container.querySelector('#tab-general')!);
      await generalTab.init();

      const clearBtn = container.querySelector('#clear-preferences');
      if (clearBtn) {
        clearBtn.dispatchEvent(new Event('click'));
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(chromeMock.storage.clear).toHaveBeenCalled();
    });
  });

  describe('cross-tab messaging', () => {
    it('should send messages to active tab when settings change', async () => {
      setupFullSettingsPage();

      const chatTab = new ChatTab(container.querySelector('#tab-chat')!);
      await chatTab.init();

      // Change nickname
      const nicknameInput = container.querySelector<HTMLInputElement>('#assistant-nickname');
      if (nicknameInput) {
        nicknameInput.value = 'MessageBot';
        nicknameInput.dispatchEvent(new Event('change'));
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(chromeMock.tabs.query).toHaveBeenCalled();
    });

    it('should send multiple messages for multiple setting changes', async () => {
      setupFullSettingsPage();

      const chatTab = new ChatTab(container.querySelector('#tab-chat')!);
      await chatTab.init();

      // Change multiple settings
      const nickname = container.querySelector<HTMLInputElement>('#assistant-nickname');
      const interruptions = container.querySelector<HTMLInputElement>('#allow-interruptions');
      const autoRead = container.querySelector<HTMLInputElement>('#chatgpt-auto-read-aloud');

      if (nickname) {
        nickname.value = 'Bot1';
        nickname.dispatchEvent(new Event('change'));
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      if (interruptions) {
        interruptions.checked = false;
        interruptions.dispatchEvent(new Event('change'));
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      if (autoRead) {
        autoRead.checked = false;
        autoRead.dispatchEvent(new Event('change'));
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(chromeMock.tabs.query).toHaveBeenCalledTimes(3);
    });
  });

  describe('icon lifecycle', () => {
    it('should initialize icons after DOM is ready', async () => {
      setupFullSettingsPage();

      const generalTab = new GeneralTab(container.querySelector('#tab-general')!);
      await generalTab.init();

      const navigator = new TabNavigator();
      replaceI18n();

      // Icons should be in DOM but not yet initialized
      expect(container.querySelector('[data-lucide]')).toBeTruthy();

      initIcons();

      expect(mockLucide.createIcons).toHaveBeenCalledTimes(1);
    });

    it('should not destroy icons on subsequent refreshes', async () => {
      setupFullSettingsPage();

      const navigator = new TabNavigator();
      initIcons();

      const iconsBefore = container.querySelectorAll('[data-lucide]');

      refreshIcons();

      const iconsAfter = container.querySelectorAll('[data-lucide]');

      expect(iconsAfter.length).toBe(iconsBefore.length);
      expect(mockLucide.createIcons).toHaveBeenCalledTimes(2);
    });
  });

  describe('error resilience', () => {
    it('should handle missing tab containers gracefully', async () => {
      container.innerHTML = `
        <div class="tab-buttons">
          <button class="tab-button" data-tab="general">General</button>
        </div>
      `;

      // Tab panels missing
      const generalTab = new GeneralTab(document.createElement('div'));

      await expect(generalTab.init()).resolves.not.toThrow();
    });

    it('should handle storage errors gracefully', async () => {
      setupFullSettingsPage();

      const generalTab = new GeneralTab(container.querySelector('#tab-general')!);
      await generalTab.init();

      // Simulate storage error AFTER init
      chromeMock.storage.set.mockImplementationOnce((items: any, callback?: Function) => {
        // Return rejected promise but don't throw synchronously
        if (callback) callback();
        return Promise.reject(new Error('Storage quota exceeded'));
      });

      const input = container.querySelector<HTMLInputElement>('#sound-effects');
      if (input) {
        input.checked = false;
        // This will try to save and fail, but shouldn't throw synchronously
        expect(() => input.dispatchEvent(new Event('change'))).not.toThrow();

        // Wait for async rejection to be handled (the error is logged but not propagated to UI)
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    });

    it('should handle missing i18n translations', () => {
      setupFullSettingsPage();

      // Remove a translation
      chromeMock.i18n.getMessage.mockReturnValue('');

      expect(() => replaceI18n()).not.toThrow();
    });

    it('should handle lucide not being available', () => {
      delete (window as any).lucide;

      expect(() => initIcons()).not.toThrow();
      expect(() => refreshIcons()).not.toThrow();
    });
  });

  describe('real user workflows', () => {
    it('should handle complete user session', async () => {
      setupFullSettingsPage();

      // 1. Page loads
      const generalTab = new GeneralTab(container.querySelector('#tab-general')!);
      const chatTab = new ChatTab(container.querySelector('#tab-chat')!);

      await generalTab.init();
      await chatTab.init();

      const navigator = new TabNavigator();
      replaceI18n();
      initIcons();

      // 2. User disables sound effects
      const soundEffects = container.querySelector<HTMLInputElement>('#sound-effects');
      if (soundEffects) {
        soundEffects.checked = false;
        soundEffects.dispatchEvent(new Event('change'));
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      // 3. User switches to chat tab
      navigator.selectTab('chat');

      // 4. User sets nickname
      const nickname = container.querySelector<HTMLInputElement>('#assistant-nickname');
      if (nickname) {
        nickname.value = 'MyBot';
        nickname.dispatchEvent(new Event('change'));
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      // 5. User enables auto-read-aloud
      const autoRead = container.querySelector<HTMLInputElement>('#chatgpt-auto-read-aloud');
      if (autoRead) {
        autoRead.checked = true;
        autoRead.dispatchEvent(new Event('change'));
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      // Verify all changes persisted
      const stored = chromeMock.storage._getState();
      expect(stored.soundEffects).toBe(false);
      expect(stored.nickname).toBe('MyBot');
      expect(stored.autoReadAloudChatGPT).toBe(true);

      // Verify tab switching worked
      expect(localStorage.setItem).toHaveBeenCalledWith('saypi.settings.selectedTab', 'chat');

      // Verify messages sent to active tab
      expect(chromeMock.tabs.query).toHaveBeenCalled();
    });
  });
});
