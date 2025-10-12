import { createIcons, icons } from 'lucide';

let iconsInitialized = false;

/**
 * Initialize Lucide icons globally once
 * Call this after all DOM content is loaded
 */
export function initIcons(): void {
  if (iconsInitialized) return;
  
  if (window.lucide?.createIcons) {
    window.lucide.createIcons({ 
      icons: window.lucide.icons,
      nameAttr: 'data-lucide' 
    });
    iconsInitialized = true;
    console.info('[Icons] Initialized globally');
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

