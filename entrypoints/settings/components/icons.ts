import { createIcons, icons } from 'lucide';

let iconsInitialized = false;

/**
 * Reset icon initialization state (for testing)
 */
export function _resetIconState(): void {
  iconsInitialized = false;
}

/**
 * Initialize Lucide icons globally once
 * Call this after all DOM content is loaded
 */
export function initIcons(): void {
  if (iconsInitialized) {
    return;
  }

  if (window.lucide?.createIcons) {
    window.lucide.createIcons({
      icons: window.lucide.icons,
      nameAttr: 'data-lucide'
    });
    iconsInitialized = true;
  } else {
    console.error('Cannot initialize icons - window.lucide not available');
  }
}

/**
 * Refresh icons in a specific container without destroying others
 * Uses Lucide's native createIcons() which properly handles icon path data
 * @param container Optional container to scope icon refresh
 */
export function refreshIcons(container?: HTMLElement): void {
  if (!window.lucide?.createIcons || !window.lucide?.icons) {
    return;
  }

  // Use Lucide's native createIcons() which properly converts icon path data to SVG
  // This will find and render all [data-lucide] elements in the entire document
  // We can't scope it easily, but calling it multiple times is safe
  window.lucide.createIcons({
    icons: window.lucide.icons,
    nameAttr: 'data-lucide'
  });
}

