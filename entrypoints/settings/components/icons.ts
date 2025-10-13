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
    console.info('[Icons] ✅ Initialized globally');
  } else {
    console.error('[Icons] ❌ Cannot initialize - window.lucide not available');
  }
}

/**
 * Refresh icons in a specific container without destroying others
 * @param container Optional container to scope icon refresh
 */
export function refreshIcons(container?: HTMLElement): void {
  if (!window.lucide?.icons) return;
  
  const scope = container || document.body;
  const iconElements = scope.querySelectorAll<HTMLElement>('[data-lucide]');
  
  iconElements.forEach(el => {
    const iconName = el.getAttribute('data-lucide');
    if (iconName && window.lucide?.icons[iconName]) {
      el.innerHTML = window.lucide?.icons[iconName].toSvg();
      el.classList.add('lucide', `lucide-${iconName}`);
    }
  });
}

