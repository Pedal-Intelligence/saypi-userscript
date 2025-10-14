import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ChatTab } from '../../../entrypoints/settings/tabs/chat';
import { setupChromeMock, createTestContainer, cleanupTestContainer, mockUserAgent, restoreUserAgent } from '../setup';

describe('ChatTab', () => {
  let chromeMock: ReturnType<typeof setupChromeMock>;
  let container: HTMLElement;
  let chatTab: ChatTab;

  beforeEach(() => {
    chromeMock = setupChromeMock();
    container = createTestContainer();
    chatTab = new ChatTab(container);

    // Mock agent mode entitlement check to return false (no entitlement) by default
    chromeMock.runtime.sendMessage.mockImplementation((message: any, callback: any) => {
      if (message.type === 'CHECK_FEATURE_ENTITLEMENT' && message.feature === 'agent_mode') {
        callback({ hasEntitlement: false });
      }
    });

    // Storage mocks are cleared by chromeMock.cleanup() in afterEach
  });

  afterEach(() => {
    cleanupTestContainer(container);
    chromeMock.cleanup();
    restoreUserAgent();
  });

  describe('initialization', () => {
    it('should initialize with container', () => {
      expect(chatTab.container).toBe(container);
    });

    it('should inject HTML template on init', async () => {
      await chatTab.init();

      expect(container.innerHTML).toContain('assistant-nickname');
      expect(container.innerHTML).toContain('allow-interruptions');
      expect(container.innerHTML).toContain('chatgpt-auto-read-aloud');
    });

    it('should setup all components on init', async () => {
      await chatTab.init();

      const nicknameInput = container.querySelector<HTMLInputElement>('#assistant-nickname');
      const interruptionsInput = container.querySelector<HTMLInputElement>('#allow-interruptions');
      const autoReadAloudInput = container.querySelector<HTMLInputElement>('#chatgpt-auto-read-aloud');

      expect(nicknameInput).toBeTruthy();
      expect(interruptionsInput).toBeTruthy();
      expect(autoReadAloudInput).toBeTruthy();
    });
  });

  describe('nickname input', () => {
    it('should load saved nickname', async () => {
      // Set storage value directly
      await chromeMock.storage.set({ nickname: 'TestBot' });

      await chatTab.init();

      const input = container.querySelector<HTMLInputElement>('#assistant-nickname');
      expect(input?.value).toBe('TestBot');

      // Verify storage was called
      expect(chromeMock.storage.get).toHaveBeenCalledWith(['nickname'], expect.any(Function));
    });

    it('should default to empty when no nickname saved', async () => {
      await chatTab.init();

      const input = container.querySelector<HTMLInputElement>('#assistant-nickname');
      expect(input?.value).toBe('');
    });

    it('should save nickname on change', async () => {
      await chatTab.init();

      const input = container.querySelector<HTMLInputElement>('#assistant-nickname');
      if (input) {
        input.value = 'NewBot';
        input.dispatchEvent(new Event('change'));
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      const stored = chromeMock.storage._getState();
      expect(stored.nickname).toBe('NewBot');
    });

    it('should send message to active tab on change', async () => {
      await chatTab.init();

      const input = container.querySelector<HTMLInputElement>('#assistant-nickname');
      if (input) {
        input.value = 'MessengerBot';
        input.dispatchEvent(new Event('change'));
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(chromeMock.tabs.query).toHaveBeenCalled();
    });

    it('should remove nickname when cleared', async () => {
      await chromeMock.storage.set({ nickname: 'OldBot' });
      await chatTab.init();

      const input = container.querySelector<HTMLInputElement>('#assistant-nickname');
      if (input) {
        input.value = '   '; // whitespace only
        input.dispatchEvent(new Event('change'));
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(chromeMock.storage.remove).toHaveBeenCalledWith('nickname');
    });

    it('should send null message when nickname cleared', async () => {
      await chatTab.init();

      const input = container.querySelector<HTMLInputElement>('#assistant-nickname');
      if (input) {
        input.value = '';
        input.dispatchEvent(new Event('change'));
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(chromeMock.tabs.query).toHaveBeenCalled();
    });

    it('should trigger change on Enter key', async () => {
      await chatTab.init();

      const input = container.querySelector<HTMLInputElement>('#assistant-nickname');
      const blurSpy = vi.spyOn(input as HTMLInputElement, 'blur');

      if (input) {
        input.value = 'EnterBot';
        const event = new Event('keyup');
        Object.defineProperty(event, 'key', { value: 'Enter', writable: false });
        input.dispatchEvent(event);
      }

      expect(blurSpy).toHaveBeenCalled();
    });

    it('should trim whitespace from nickname', async () => {
      await chatTab.init();

      const input = container.querySelector<HTMLInputElement>('#assistant-nickname');
      if (input) {
        input.value = '  SpaceyBot  ';
        input.dispatchEvent(new Event('change'));
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      const stored = chromeMock.storage._getState();
      expect(stored.nickname).toBe('SpaceyBot');
    });
  });

  describe('interruptions toggle', () => {
    it('should load saved interruptions preference', async () => {
      // Set storage value directly
      await chromeMock.storage.set({ allowInterruptions: false });

      await chatTab.init();

      const input = container.querySelector<HTMLInputElement>('#allow-interruptions');
      expect(input?.checked).toBe(false);
    });

    it('should default to true when no preference saved', async () => {
      await chatTab.init();

      const input = container.querySelector<HTMLInputElement>('#allow-interruptions');
      expect(input?.checked).toBe(true);
    });

    it('should save preference when toggled', async () => {
      await chatTab.init();

      const input = container.querySelector<HTMLInputElement>('#allow-interruptions');
      if (input) {
        input.checked = false;
        input.dispatchEvent(new Event('change'));
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      const stored = chromeMock.storage._getState();
      expect(stored.allowInterruptions).toBe(false);
    });

    it('should send message to active tab on change', async () => {
      await chatTab.init();

      const input = container.querySelector<HTMLInputElement>('#allow-interruptions');
      if (input) {
        input.checked = false;
        input.dispatchEvent(new Event('change'));
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(chromeMock.tabs.query).toHaveBeenCalled();
    });

    it('should update checked class on toggle', async () => {
      await chatTab.init();

      const input = container.querySelector<HTMLInputElement>('#allow-interruptions');
      if (input) {
        input.checked = false;
        input.dispatchEvent(new Event('change'));

        await new Promise(resolve => setTimeout(resolve, 10));

        expect(input.parentElement?.classList.contains('checked')).toBe(false);
      }
    });

    it('should disable interruptions in Firefox', async () => {
      mockUserAgent('Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0');

      await chatTab.init();

      const input = container.querySelector<HTMLInputElement>('#allow-interruptions');
      const label = input?.closest('.wraper');

      expect(input?.disabled).toBe(true);
      expect(label?.classList.contains('disabled')).toBe(true);
      expect(input?.checked).toBe(false);
      expect(label?.getAttribute('title')).toBe('Interruptions not available in Firefox');
    });

    it('should not disable interruptions in Chrome', async () => {
      mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

      await chatTab.init();

      const input = container.querySelector<HTMLInputElement>('#allow-interruptions');

      expect(input?.disabled).toBe(false);
    });
  });

  describe('auto-read-aloud toggle', () => {
    it('should load saved auto-read-aloud preference', async () => {
      await chromeMock.storage.set({ autoReadAloudChatGPT: false });

      await chatTab.init();

      const input = container.querySelector<HTMLInputElement>('#chatgpt-auto-read-aloud');
      expect(input?.checked).toBe(false);
    });

    it('should default to true when no preference saved', async () => {
      await chatTab.init();

      const input = container.querySelector<HTMLInputElement>('#chatgpt-auto-read-aloud');
      expect(input?.checked).toBe(true);
    });

    it('should save preference when toggled', async () => {
      await chatTab.init();

      const input = container.querySelector<HTMLInputElement>('#chatgpt-auto-read-aloud');
      if (input) {
        input.checked = false;
        input.dispatchEvent(new Event('change'));
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      const stored = chromeMock.storage._getState();
      expect(stored.autoReadAloudChatGPT).toBe(false);
    });

    it('should send message to active tab on change', async () => {
      await chatTab.init();

      const input = container.querySelector<HTMLInputElement>('#chatgpt-auto-read-aloud');
      if (input) {
        input.checked = false;
        input.dispatchEvent(new Event('change'));
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(chromeMock.tabs.query).toHaveBeenCalled();
    });

    it('should update checked class on toggle', async () => {
      await chatTab.init();

      const input = container.querySelector<HTMLInputElement>('#chatgpt-auto-read-aloud');
      if (input) {
        input.checked = false;
        input.dispatchEvent(new Event('change'));

        await new Promise(resolve => setTimeout(resolve, 10));

        expect(input.parentElement?.classList.contains('checked')).toBe(false);
      }
    });
  });

  describe('missing elements handling', () => {
    it('should handle missing nickname input gracefully', async () => {
      container.innerHTML = '';

      await expect(chatTab.init()).resolves.not.toThrow();
    });

    it('should handle missing interruptions input gracefully', async () => {
      container.innerHTML = '<input id="assistant-nickname" type="text" />';

      await expect(chatTab.init()).resolves.not.toThrow();
    });

    it('should handle missing auto-read-aloud input gracefully', async () => {
      container.innerHTML = `
        <input id="assistant-nickname" type="text" />
        <input id="allow-interruptions" type="checkbox" />
      `;

      await expect(chatTab.init()).resolves.not.toThrow();
    });
  });

  describe('integration tests', () => {
    it('should handle multiple setting changes in sequence', async () => {
      await chatTab.init();

      // Change nickname
      const nicknameInput = container.querySelector<HTMLInputElement>('#assistant-nickname');
      if (nicknameInput) {
        nicknameInput.value = 'SequentialBot';
        nicknameInput.dispatchEvent(new Event('change'));
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      // Toggle interruptions
      const interruptionsInput = container.querySelector<HTMLInputElement>('#allow-interruptions');
      if (interruptionsInput) {
        interruptionsInput.checked = false;
        interruptionsInput.dispatchEvent(new Event('change'));
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      // Toggle auto-read-aloud
      const autoReadInput = container.querySelector<HTMLInputElement>('#chatgpt-auto-read-aloud');
      if (autoReadInput) {
        autoReadInput.checked = false;
        autoReadInput.dispatchEvent(new Event('change'));
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      const stored = chromeMock.storage._getState();
      expect(stored.nickname).toBe('SequentialBot');
      expect(stored.allowInterruptions).toBe(false);
      expect(stored.autoReadAloudChatGPT).toBe(false);
    });
  });
});
