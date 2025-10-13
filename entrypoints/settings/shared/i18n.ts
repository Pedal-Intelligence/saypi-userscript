export function getMessage(key: string, substitutions?: string[]): string {
  return chrome.i18n.getMessage(key, substitutions) || key;
}

export function replaceI18n(): void {
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    if (el.hasAttribute('data-i18n-skip')) return;
    const messageKey = el.getAttribute('data-i18n');
    if (!messageKey) return;
    
    const translatedText = getMessage(messageKey);
    
    // Check if element has important child elements (like icons)
    const hasIconChildren = el.querySelector('.icon-circle, [data-lucide]');
    
    if (hasIconChildren) {
      // Preserve structure - only update text nodes or specific label spans
      const labelSpan = el.querySelector('.tab-label');
      if (labelSpan) {
        labelSpan.textContent = translatedText;
      } else {
        // If no label span, this element's structure needs preserving - skip it
        console.warn(`[i18n] Skipping element with children:`, el);
      }
    } else {
      // No children to preserve, safe to set textContent
      el.textContent = translatedText;
    }
  });
  
  document.querySelectorAll<HTMLElement>('[data-i18n-attr]').forEach((el) => {
    const attrInfo = el.getAttribute('data-i18n-attr')?.split(':');
    if (attrInfo && attrInfo.length === 2) {
      const [attrName, messageKey] = attrInfo;
      el.setAttribute(attrName, getMessage(messageKey));
    }
  });
}

