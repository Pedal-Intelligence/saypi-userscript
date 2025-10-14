import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initIcons, refreshIcons, _resetIconState } from '../../../entrypoints/settings/components/icons';
import { createTestContainer, cleanupTestContainer } from '../setup';

describe('icon management', () => {
  let container: HTMLElement;
  let mockLucide: any;

  beforeEach(() => {
    container = createTestContainer();

    // Reset icon state before each test
    _resetIconState();

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
    delete (window as any).lucide;
  });

  describe('initIcons', () => {
    it('should call window.lucide.createIcons', () => {
      initIcons();

      expect(mockLucide.createIcons).toHaveBeenCalledWith({
        icons: mockLucide.icons,
        nameAttr: 'data-lucide'
      });
    });

    it('should only initialize once', () => {
      initIcons();
      initIcons();
      initIcons();

      expect(mockLucide.createIcons).toHaveBeenCalledTimes(1);
    });

    it('should handle missing window.lucide gracefully', () => {
      delete (window as any).lucide;

      // Should not throw
      expect(() => initIcons()).not.toThrow();
    });

    it('should handle window.lucide without createIcons', () => {
      (window as any).lucide = { icons: {} };

      expect(() => initIcons()).not.toThrow();
    });

    it('should log error when lucide not available', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      delete (window as any).lucide;

      initIcons();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Cannot initialize')
      );

      consoleErrorSpy.mockRestore();
    });

    it('should work with icon elements in DOM', () => {
      container.innerHTML = `
        <i data-lucide="settings"></i>
        <i data-lucide="mic"></i>
      `;

      initIcons();

      expect(mockLucide.createIcons).toHaveBeenCalled();
    });
  });

  describe('refreshIcons', () => {
    it('should call window.lucide.createIcons', () => {
      refreshIcons();

      expect(mockLucide.createIcons).toHaveBeenCalledWith({
        icons: mockLucide.icons,
        nameAttr: 'data-lucide'
      });
    });

    it('should work with container parameter', () => {
      refreshIcons(container);

      expect(mockLucide.createIcons).toHaveBeenCalled();
    });

    it('should handle missing window.lucide gracefully', () => {
      delete (window as any).lucide;

      expect(() => refreshIcons()).not.toThrow();
    });

    it('should handle window.lucide without createIcons', () => {
      (window as any).lucide = { icons: {} };

      expect(() => refreshIcons()).not.toThrow();
    });

    it('should handle window.lucide without icons', () => {
      (window as any).lucide = { createIcons: vi.fn() };

      expect(() => refreshIcons()).not.toThrow();
    });

    it('should be callable multiple times', () => {
      refreshIcons();
      refreshIcons();
      refreshIcons();

      expect(mockLucide.createIcons).toHaveBeenCalledTimes(3);
    });

    it('should work after initIcons was called', () => {
      initIcons();
      mockLucide.createIcons.mockClear();

      refreshIcons();

      expect(mockLucide.createIcons).toHaveBeenCalledTimes(1);
    });

    it('should work with newly added icons', () => {
      container.innerHTML = '<i data-lucide="settings"></i>';

      refreshIcons(container);

      expect(mockLucide.createIcons).toHaveBeenCalled();

      // Add new icon
      const newIcon = document.createElement('i');
      newIcon.setAttribute('data-lucide', 'info');
      container.appendChild(newIcon);

      mockLucide.createIcons.mockClear();
      refreshIcons(container);

      expect(mockLucide.createIcons).toHaveBeenCalled();
    });
  });

  describe('icon initialization flow', () => {
    it('should initialize then allow refresh', () => {
      initIcons();
      expect(mockLucide.createIcons).toHaveBeenCalledTimes(1);

      mockLucide.createIcons.mockClear();

      refreshIcons();
      expect(mockLucide.createIcons).toHaveBeenCalledTimes(1);
    });

    it('should handle refresh before init', () => {
      refreshIcons();

      expect(mockLucide.createIcons).toHaveBeenCalled();
    });

    it('should work with mixed init and refresh calls', () => {
      refreshIcons();
      initIcons();
      refreshIcons();
      initIcons(); // Should not call again
      refreshIcons();

      // initIcons called once, refreshIcons called 3 times
      expect(mockLucide.createIcons).toHaveBeenCalledTimes(4);
    });
  });

  describe('real-world scenarios', () => {
    it('should handle tab switching scenario', () => {
      // Initial page load
      container.innerHTML = `
        <button data-tab="general">
          <i data-lucide="settings"></i>
        </button>
      `;

      initIcons();
      expect(mockLucide.createIcons).toHaveBeenCalledTimes(1);

      // User switches to chat tab (new content loaded)
      container.innerHTML += `
        <div id="tab-chat">
          <i data-lucide="bot-message-square"></i>
        </div>
      `;

      mockLucide.createIcons.mockClear();
      refreshIcons();

      expect(mockLucide.createIcons).toHaveBeenCalledTimes(1);
    });

    it('should handle i18n replacement scenario', () => {
      // Initial DOM with icons
      container.innerHTML = `
        <button data-i18n="settings">
          <i data-lucide="settings"></i>
          <span class="tab-label"></span>
        </button>
      `;

      initIcons();

      // i18n runs and updates text (but preserves icons)
      const label = container.querySelector('.tab-label');
      if (label) label.textContent = 'Settings';

      mockLucide.createIcons.mockClear();

      // Icons should still be there, refresh shouldn't be needed
      // but if called, should work
      refreshIcons();

      expect(mockLucide.createIcons).toHaveBeenCalled();
    });

    it('should handle dynamic content injection', () => {
      initIcons();

      // Simulate loading a tab's content
      const newContent = document.createElement('div');
      newContent.innerHTML = `
        <div class="settings-section">
          <i data-lucide="info"></i>
          <span>Info text</span>
        </div>
      `;
      container.appendChild(newContent);

      mockLucide.createIcons.mockClear();
      refreshIcons(container);

      expect(mockLucide.createIcons).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle createIcons throwing error', () => {
      mockLucide.createIcons.mockImplementation(() => {
        throw new Error('Icon creation failed');
      });

      expect(() => initIcons()).toThrow();
    });

    it('should handle null container', () => {
      expect(() => refreshIcons(null as any)).not.toThrow();
    });

    it('should handle undefined container', () => {
      expect(() => refreshIcons(undefined)).not.toThrow();
    });
  });

  describe('configuration', () => {
    it('should use correct nameAttr', () => {
      initIcons();

      expect(mockLucide.createIcons).toHaveBeenCalledWith(
        expect.objectContaining({
          nameAttr: 'data-lucide'
        })
      );
    });

    it('should pass correct icons object', () => {
      initIcons();

      expect(mockLucide.createIcons).toHaveBeenCalledWith(
        expect.objectContaining({
          icons: mockLucide.icons
        })
      );
    });

    it('should use same configuration for refresh', () => {
      refreshIcons();

      expect(mockLucide.createIcons).toHaveBeenCalledWith({
        icons: mockLucide.icons,
        nameAttr: 'data-lucide'
      });
    });
  });
});
