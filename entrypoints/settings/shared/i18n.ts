export function getMessage(key: string, substitutions?: string[]): string {
  return chrome.i18n.getMessage(key, substitutions) || key;
}

export function replaceI18n(): void {
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    if (el.hasAttribute('data-i18n-skip')) return;
    const messageKey = el.getAttribute('data-i18n');
    if (messageKey) {
      el.textContent = getMessage(messageKey);
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

