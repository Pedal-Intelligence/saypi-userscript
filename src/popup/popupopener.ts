/**
 * Storage key carrying a one-shot deep-link target for the settings page.
 * Written here (content-script context) and consumed + cleared by the
 * settings page on boot — content scripts can't reach the settings page's
 * localStorage, but both share chrome.storage.local.
 */
export const SETTINGS_DEEP_LINK_KEY = "saypi.settings.deepLinkTab";

/**
 * Opens the extension's settings popup by sending a message to the background script.
 * The background script will handle opening the popup in the native way.
 * @param tab Optional settings tab to open on (e.g. "chat" for the AI Chat
 *            tab's voice catalog); defaults to the user's last-viewed tab.
 */
export function openSettings(tab?: string): void {
  if (tab) {
    try {
      const stored = chrome.storage.local.set({ [SETTINGS_DEEP_LINK_KEY]: tab });
      if (stored && typeof (stored as Promise<void>).catch === "function") {
        (stored as Promise<void>).catch(() => {});
      }
    } catch (e) {
      // Non-fatal: settings still opens, just on the default tab
    }
  }
  try {
    const result = chrome.runtime.sendMessage({ action: 'openPopup' });
    // In some browsers, sendMessage returns a Promise; handle failures
    if (result && typeof result.then === 'function') {
      result.catch(() => {
        try {
          const url = chrome.runtime.getURL('settings.html');
          window.open(url, '_blank');
        } catch (e) {
          // ignore
        }
      });
    }
  } catch (e) {
    // Fallback: open the settings page directly in a new tab
    try {
      const url = chrome.runtime.getURL('settings.html');
      window.open(url, '_blank');
    } catch (e2) {
      // ignore
    }
  }
}
