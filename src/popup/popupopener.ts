/**
 * Storage key carrying a one-shot deep-link target for the settings page.
 * Written here (content-script context) and consumed + cleared by the
 * settings page on boot — content scripts can't reach the settings page's
 * localStorage, but both share chrome.storage.local.
 */
export const SETTINGS_DEEP_LINK_KEY = "saypi.settings.deepLinkTab";

/**
 * A deep-link value is `tab` or `tab/detail` — e.g. "voices/pi" opens the
 * Voices tab already scoped to Pi's studio. Parsed on the settings page's
 * side of the storage handoff; kept here so writer and reader share one shape.
 */
export function parseSettingsDeepLink(
  value: unknown
): { tab: string; detail?: string } | null {
  if (typeof value !== "string" || !value) return null;
  const [tab, detail] = value.split("/");
  if (!tab) return null;
  return detail ? { tab, detail } : { tab };
}

/**
 * Opens the extension's settings popup by sending a message to the background script.
 * The background script will handle opening the popup in the native way.
 * @param tab Optional settings tab to open on, with an optional `/detail`
 *            suffix (e.g. "voices/pi" opens the Voices tab scoped to Pi);
 *            defaults to the user's last-viewed tab.
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
