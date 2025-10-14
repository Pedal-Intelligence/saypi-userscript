import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TabNavigator } from '../../../entrypoints/settings/components/tabs';
import { createTestContainer, cleanupTestContainer } from '../setup';

describe('TabNavigator', () => {
  let container: HTMLElement;
  let navigator: TabNavigator;

  beforeEach(() => {
    container = createTestContainer();
    // Mock localStorage
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn(),
      length: 0
    };
  });

  afterEach(() => {
    cleanupTestContainer(container);
  });

  function setupTabButtons() {
    container.innerHTML = `
      <div class="tab-buttons">
        <button class="tab-button" data-tab="general">General</button>
        <button class="tab-button" data-tab="chat">Chat</button>
        <button class="tab-button" data-tab="dictation">Dictation</button>
        <button class="tab-button" data-tab="about">About</button>
      </div>
      <div class="tab-panels">
        <div class="tab-panel" id="tab-general"></div>
        <div class="tab-panel hidden" id="tab-chat"></div>
        <div class="tab-panel hidden" id="tab-dictation"></div>
        <div class="tab-panel hidden" id="tab-about"></div>
      </div>
    `;
  }

  describe('initialization', () => {
    it('should find and setup tab buttons', () => {
      setupTabButtons();

      navigator = new TabNavigator();

      const buttons = container.querySelectorAll('.tab-button');
      expect(buttons.length).toBe(4);
    });

    it('should add icons to tab buttons', () => {
      setupTabButtons();

      navigator = new TabNavigator();

      const buttons = container.querySelectorAll('.tab-button');
      buttons.forEach(btn => {
        const iconCircle = btn.querySelector('.icon-circle');
        const icon = btn.querySelector('[data-lucide]');
        expect(iconCircle).toBeTruthy();
        expect(icon).toBeTruthy();
      });
    });

    it('should add correct icon for each tab', () => {
      setupTabButtons();

      navigator = new TabNavigator();

      const generalIcon = container.querySelector('[data-tab="general"] [data-lucide]');
      const chatIcon = container.querySelector('[data-tab="chat"] [data-lucide]');
      const dictationIcon = container.querySelector('[data-tab="dictation"] [data-lucide]');
      const aboutIcon = container.querySelector('[data-tab="about"] [data-lucide]');

      expect(generalIcon?.getAttribute('data-lucide')).toBe('settings');
      expect(chatIcon?.getAttribute('data-lucide')).toBe('bot-message-square');
      expect(dictationIcon?.getAttribute('data-lucide')).toBe('mic');
      expect(aboutIcon?.getAttribute('data-lucide')).toBe('info');
    });

    it('should preserve button label text', () => {
      setupTabButtons();

      navigator = new TabNavigator();

      const buttons = container.querySelectorAll('.tab-button');
      expect(buttons[0].querySelector('.tab-label')?.textContent).toBe('General');
      expect(buttons[1].querySelector('.tab-label')?.textContent).toBe('Chat');
      expect(buttons[2].querySelector('.tab-label')?.textContent).toBe('Dictation');
      expect(buttons[3].querySelector('.tab-label')?.textContent).toBe('About');
    });

    it('should attach click listeners to buttons', () => {
      setupTabButtons();

      navigator = new TabNavigator();

      const button = container.querySelector('[data-tab="chat"]') as HTMLButtonElement;
      button.click();

      expect(button.classList.contains('active')).toBe(true);
    });

    it('should not re-add icons if already present', () => {
      container.innerHTML = `
        <button class="tab-button" data-tab="general">
          <span class="icon-circle">
            <i data-lucide="settings"></i>
          </span>
          <span class="tab-label">General</span>
        </button>
      `;

      navigator = new TabNavigator();

      const iconCircles = container.querySelectorAll('.icon-circle');
      expect(iconCircles.length).toBe(1); // Should still be just 1
    });

    it('should handle callback option', () => {
      setupTabButtons();
      const callback = vi.fn();

      navigator = new TabNavigator({ onTabChange: callback });

      navigator.selectTab('chat');

      expect(callback).toHaveBeenCalledWith('chat');
    });
  });

  describe('selectTab', () => {
    beforeEach(() => {
      setupTabButtons();
      navigator = new TabNavigator();
    });

    it('should activate selected button', () => {
      navigator.selectTab('chat');

      const chatButton = container.querySelector('[data-tab="chat"]');
      expect(chatButton?.classList.contains('active')).toBe(true);
    });

    it('should deactivate other buttons', () => {
      navigator.selectTab('chat');

      const generalButton = container.querySelector('[data-tab="general"]');
      const dictationButton = container.querySelector('[data-tab="dictation"]');
      const aboutButton = container.querySelector('[data-tab="about"]');

      expect(generalButton?.classList.contains('active')).toBe(false);
      expect(dictationButton?.classList.contains('active')).toBe(false);
      expect(aboutButton?.classList.contains('active')).toBe(false);
    });

    it('should show selected panel', () => {
      navigator.selectTab('dictation');

      const panel = container.querySelector('#tab-dictation');
      expect(panel?.classList.contains('hidden')).toBe(false);
    });

    it('should hide other panels', () => {
      navigator.selectTab('dictation');

      const generalPanel = container.querySelector('#tab-general');
      const chatPanel = container.querySelector('#tab-chat');
      const aboutPanel = container.querySelector('#tab-about');

      expect(generalPanel?.classList.contains('hidden')).toBe(true);
      expect(chatPanel?.classList.contains('hidden')).toBe(true);
      expect(aboutPanel?.classList.contains('hidden')).toBe(true);
    });

    it('should save selection to localStorage', () => {
      navigator.selectTab('about');

      expect(localStorage.setItem).toHaveBeenCalledWith('saypi.settings.selectedTab', 'about');
    });

    it('should handle localStorage errors gracefully', () => {
      (localStorage.setItem as any).mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      expect(() => navigator.selectTab('chat')).not.toThrow();
    });

    it('should invoke callback when provided', () => {
      const callback = vi.fn();
      navigator = new TabNavigator({ onTabChange: callback });

      navigator.selectTab('dictation');

      expect(callback).toHaveBeenCalledWith('dictation');
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should update currentTab property', () => {
      navigator.selectTab('about');

      // Can't directly access private property, but can test side effects
      const aboutButton = container.querySelector('[data-tab="about"]');
      expect(aboutButton?.classList.contains('active')).toBe(true);
    });

    it('should handle rapid tab switching', () => {
      navigator.selectTab('chat');
      navigator.selectTab('dictation');
      navigator.selectTab('about');
      navigator.selectTab('general');

      const generalButton = container.querySelector('[data-tab="general"]');
      const generalPanel = container.querySelector('#tab-general');

      expect(generalButton?.classList.contains('active')).toBe(true);
      expect(generalPanel?.classList.contains('hidden')).toBe(false);
    });
  });

  describe('button click handling', () => {
    beforeEach(() => {
      setupTabButtons();
      navigator = new TabNavigator();
    });

    it('should switch tabs when button clicked', () => {
      const chatButton = container.querySelector('[data-tab="chat"]') as HTMLButtonElement;

      chatButton.click();

      expect(chatButton.classList.contains('active')).toBe(true);
      const chatPanel = container.querySelector('#tab-chat');
      expect(chatPanel?.classList.contains('hidden')).toBe(false);
    });

    it('should handle clicking the same tab twice', () => {
      const generalButton = container.querySelector('[data-tab="general"]') as HTMLButtonElement;

      generalButton.click();
      generalButton.click();

      expect(generalButton.classList.contains('active')).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledTimes(2);
    });

    it('should handle clicking all tabs in sequence', () => {
      const buttons = container.querySelectorAll('.tab-button') as NodeListOf<HTMLButtonElement>;

      buttons.forEach(btn => btn.click());

      // Last clicked should be active (About)
      const aboutButton = container.querySelector('[data-tab="about"]');
      expect(aboutButton?.classList.contains('active')).toBe(true);
    });
  });

  describe('icon structure', () => {
    it('should create proper icon structure', () => {
      setupTabButtons();

      navigator = new TabNavigator();

      const button = container.querySelector('[data-tab="general"]') as HTMLElement;
      const iconCircle = button.querySelector('.icon-circle');
      const icon = iconCircle?.querySelector('[data-lucide]');
      const label = button.querySelector('.tab-label');

      expect(iconCircle?.tagName).toBe('SPAN');
      expect(icon?.tagName).toBe('I');
      expect(label?.tagName).toBe('SPAN');

      // Structure: button > icon-circle > i[data-lucide] + tab-label
      expect(button.children.length).toBe(2); // icon-circle and tab-label
      expect(iconCircle?.children.length).toBe(1); // just the icon
    });

    it('should handle buttons with no label text', () => {
      container.innerHTML = '<button class="tab-button" data-tab="test"></button>';

      navigator = new TabNavigator();

      const button = container.querySelector('[data-tab="test"]') as HTMLElement;
      const label = button.querySelector('.tab-label');

      expect(label).toBeFalsy(); // No label added when no text
    });

    it('should handle buttons with no data-tab attribute', () => {
      container.innerHTML = '<button class="tab-button">No Tab ID</button>';

      expect(() => new TabNavigator()).not.toThrow();

      const button = container.querySelector('.tab-button') as HTMLElement;
      const icon = button.querySelector('[data-lucide]');

      // Should default to 'info' icon
      expect(icon?.getAttribute('data-lucide')).toBe('info');
    });
  });

  describe('edge cases', () => {
    it('should handle no tab buttons present', () => {
      container.innerHTML = '<div>No buttons here</div>';

      expect(() => new TabNavigator()).not.toThrow();
    });

    it('should handle no tab panels present', () => {
      container.innerHTML = `
        <button class="tab-button" data-tab="general">General</button>
      `;

      navigator = new TabNavigator();

      expect(() => navigator.selectTab('general')).not.toThrow();
    });

    it('should handle selecting non-existent tab', () => {
      setupTabButtons();
      navigator = new TabNavigator();

      expect(() => navigator.selectTab('nonexistent')).not.toThrow();
    });

    it('should handle empty string tab ID', () => {
      setupTabButtons();
      navigator = new TabNavigator();

      expect(() => navigator.selectTab('')).not.toThrow();
    });

    it('should handle special characters in tab ID', () => {
      container.innerHTML = `
        <button class="tab-button" data-tab="tab-with-dashes">Tab</button>
        <div class="tab-panel" id="tab-tab-with-dashes"></div>
      `;

      navigator = new TabNavigator();

      expect(() => navigator.selectTab('tab-with-dashes')).not.toThrow();
    });
  });
});
