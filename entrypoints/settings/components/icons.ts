import { createIcons, icons } from 'lucide';

let iconsInitialized = false;

/**
 * Initialize Lucide icons globally once
 * Call this after all DOM content is loaded
 */
export function initIcons(): void {
  if (iconsInitialized) {
    console.info('[Icons] Already initialized, skipping');
    return;
  }
  
  console.info('[Icons] Attempting to initialize...', {
    hasLucide: !!window.lucide,
    hasCreateIcons: !!window.lucide?.createIcons,
    hasIcons: !!window.lucide?.icons,
    iconCount: window.lucide?.icons ? Object.keys(window.lucide.icons).length : 0
  });
  
  if (window.lucide?.createIcons) {
    const iconElements = document.querySelectorAll('[data-lucide]');
    console.info(`[Icons] Found ${iconElements.length} icon elements to initialize`);
    
    window.lucide.createIcons({ 
      icons: window.lucide.icons,
      nameAttr: 'data-lucide' 
    });
    iconsInitialized = true;
    console.debug('[Icons] ✅ Initialized globally with ', Object.keys(window.lucide.icons).length, ' icons');
  } else {
    console.error('[Icons] ❌ Cannot initialize - window.lucide not available');
  }
}

/**
 * Refresh icons in a specific container without destroying others
 * Uses Lucide's native createIcons() which properly handles icon path data
 * @param container Optional container to scope icon refresh
 */
export function refreshIcons(container?: HTMLElement): void {
  if (!window.lucide?.createIcons || !window.lucide?.icons) {
    console.warn('[Icons] Cannot refresh - Lucide not fully loaded');
    return;
  }

  const scope = container || document.body;
  const iconElements = scope.querySelectorAll<HTMLElement>('[data-lucide]');

  if (iconElements.length === 0) {
    console.debug('[Icons] No icons to refresh in scope');
    return;
  }

  console.debug(`[Icons] Refreshing ${iconElements.length} icons`);

  // Use Lucide's native createIcons() which properly converts icon path data to SVG
  // This will find and render all [data-lucide] elements in the entire document
  // We can't scope it easily, but calling it multiple times is safe
  window.lucide.createIcons({
    icons: window.lucide.icons,
    nameAttr: 'data-lucide'
  });

  console.debug('[Icons] ✅ Refresh complete');
}

