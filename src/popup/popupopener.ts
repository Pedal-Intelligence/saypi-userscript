/**
 * Opens the extension's settings popup by sending a message to the background script.
 * The background script will handle opening the popup in the native way.
 */
export function openSettings(): void {
  chrome.runtime.sendMessage({ action: 'openPopup' });
} 