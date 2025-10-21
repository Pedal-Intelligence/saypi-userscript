import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { replaceI18n } from '../../../entrypoints/settings/shared/i18n';
import { setupChromeMock, createTestContainer, cleanupTestContainer } from '../setup';

describe('i18n utilities', () => {
  let chromeMock: ReturnType<typeof setupChromeMock>;
  let container: HTMLElement;

  beforeEach(() => {
    chromeMock = setupChromeMock();
    container = createTestContainer();
  });

  afterEach(() => {
    cleanupTestContainer(container);
    chromeMock.cleanup();
  });

  describe('replaceI18n', () => {
    it('should replace text content for simple elements', () => {
      container.innerHTML = '<div data-i18n="aboutSayPiHeading"></div>';

      replaceI18n();

      const element = container.querySelector('[data-i18n="aboutSayPiHeading"]');
      expect(element?.textContent).toBe('About SayPi');
    });

    it('should replace multiple elements with different keys', () => {
      container.innerHTML = `
        <div data-i18n="aboutSayPiHeading"></div>
        <p data-i18n="aboutSayPiDescription"></p>
        <span data-i18n="soundEffects"></span>
      `;

      replaceI18n();

      expect(container.querySelector('[data-i18n="aboutSayPiHeading"]')?.textContent).toBe('About SayPi');
      expect(container.querySelector('[data-i18n="aboutSayPiDescription"]')?.textContent).toBe('Voice assistant for Pi.ai');
      expect(container.querySelector('[data-i18n="soundEffects"]')?.textContent).toBe('Sound Effects');
    });

    it('should preserve icon children in elements', () => {
      container.innerHTML = `
        <button data-i18n="soundEffects">
          <i data-lucide="volume-2"></i>
          <span class="tab-label"></span>
        </button>
      `;

      replaceI18n();

      const button = container.querySelector('button');
      const icon = button?.querySelector('[data-lucide="volume-2"]');
      const label = button?.querySelector('.tab-label');

      expect(icon).toBeTruthy(); // Icon preserved
      expect(label?.textContent).toBe('Sound Effects'); // Label updated
    });

    it('should preserve .icon-circle children', () => {
      container.innerHTML = `
        <div data-i18n="aboutSayPiHeading">
          <div class="icon-circle">
            <i data-lucide="info"></i>
          </div>
          <span class="tab-label"></span>
        </div>
      `;

      replaceI18n();

      const element = container.querySelector('[data-i18n="aboutSayPiHeading"]');
      const iconCircle = element?.querySelector('.icon-circle');
      const label = element?.querySelector('.tab-label');

      expect(iconCircle).toBeTruthy(); // Icon circle preserved
      expect(label?.textContent).toBe('About SayPi');
    });

    it('should skip elements with data-i18n-skip attribute', () => {
      container.innerHTML = '<div data-i18n="aboutSayPiHeading" data-i18n-skip>Original Text</div>';

      replaceI18n();

      const element = container.querySelector('[data-i18n-skip]');
      expect(element?.textContent).toBe('Original Text');
    });

    it('should handle missing translation keys gracefully', () => {
      container.innerHTML = '<div data-i18n="nonexistentKey">Fallback Text</div>';

      replaceI18n();

      const element = container.querySelector('[data-i18n="nonexistentKey"]');
      // Mock returns the key itself when not found, which gets used as translation
      // In real usage, getMessage returns empty string for missing keys
      expect(element?.textContent).toBe('nonexistentKey');
    });

    it('should handle empty data-i18n attribute', () => {
      container.innerHTML = '<div data-i18n="">Some Text</div>';

      replaceI18n();

      const element = container.querySelector('[data-i18n]');
      expect(element?.textContent).toBe('Some Text');
    });

    it('should replace attribute values with data-i18n-attr', () => {
      container.innerHTML = '<input data-i18n-attr="placeholder:soundEffects" />';

      replaceI18n();

      const input = container.querySelector('input');
      expect(input?.getAttribute('placeholder')).toBe('Sound Effects');
    });

    it('should handle multiple attribute replacements', () => {
      container.innerHTML = `
        <input data-i18n-attr="placeholder:soundEffects" />
        <button data-i18n-attr="title:aboutSayPiHeading">Button</button>
        <a data-i18n-attr="aria-label:shareData">Link</a>
      `;

      replaceI18n();

      const input = container.querySelector('input');
      const button = container.querySelector('button');
      const link = container.querySelector('a');

      expect(input?.getAttribute('placeholder')).toBe('Sound Effects');
      expect(button?.getAttribute('title')).toBe('About SayPi');
      expect(link?.getAttribute('aria-label')).toBe('Share Analytics');
    });

    it('should handle malformed data-i18n-attr gracefully', () => {
      container.innerHTML = `
        <input data-i18n-attr="invalid" />
        <button data-i18n-attr="">Button</button>
        <a data-i18n-attr="missing-colon-soundEffects">Link</a>
      `;

      // Should not throw
      expect(() => replaceI18n()).not.toThrow();
    });

    it('should not replace when element has icon children and no .tab-label', () => {
      container.innerHTML = `
        <div data-i18n="soundEffects">
          <i data-lucide="volume-2"></i>
          Original Text
        </div>
      `;

      replaceI18n();

      const element = container.querySelector('[data-i18n="soundEffects"]');
      // Should skip because it has icon children but no .tab-label
      expect(element?.textContent?.trim()).not.toBe('Sound Effects');
    });

    it('should handle nested elements correctly', () => {
      container.innerHTML = `
        <div>
          <section>
            <div data-i18n="aboutSayPiHeading"></div>
          </section>
        </div>
      `;

      replaceI18n();

      const element = container.querySelector('[data-i18n="aboutSayPiHeading"]');
      expect(element?.textContent).toBe('About SayPi');
    });

    it('should work when called multiple times (idempotent)', () => {
      container.innerHTML = '<div data-i18n="aboutSayPiHeading"></div>';

      replaceI18n();
      const firstResult = container.querySelector('[data-i18n="aboutSayPiHeading"]')?.textContent;

      replaceI18n();
      const secondResult = container.querySelector('[data-i18n="aboutSayPiHeading"]')?.textContent;

      expect(firstResult).toBe(secondResult);
      expect(firstResult).toBe('About SayPi');
    });

    it('should handle elements with mixed content types', () => {
      container.innerHTML = `
        <div data-i18n="aboutSayPiHeading">
          Text node
          <span>Nested span</span>
          More text
        </div>
      `;

      replaceI18n();

      // Should replace since no icon children
      const element = container.querySelector('[data-i18n="aboutSayPiHeading"]');
      expect(element?.textContent?.trim()).toBe('About SayPi');
    });
  });

  describe('edge cases', () => {
    it('should handle empty container', () => {
      container.innerHTML = '';

      expect(() => replaceI18n()).not.toThrow();
    });

    it('should handle container with no i18n elements', () => {
      container.innerHTML = '<div>No i18n here</div><p>Just regular content</p>';

      expect(() => replaceI18n()).not.toThrow();
    });

    it('should handle special characters in translation', () => {
      // Add a translation with special characters
      chromeMock.i18n.getMessage.mockReturnValueOnce('Test & "Special" <Characters>');

      container.innerHTML = '<div data-i18n="specialKey"></div>';

      replaceI18n();

      const element = container.querySelector('[data-i18n="specialKey"]');
      expect(element?.textContent).toBe('Test & "Special" <Characters>');
    });
  });
});
