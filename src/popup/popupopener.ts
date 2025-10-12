/**
 * Opens the extension's settings popup by sending a message to the background script.
 * The background script will handle opening the popup in the native way.
 */
export function openSettings(): void {
  try {
    const result = chrome.runtime.sendMessage({ action: 'openPopup' });
    // In some browsers, sendMessage returns a Promise; handle failures
    if (result && typeof result.then === 'function') {
      result.catch(() => {
        try {
          const url = chrome.runtime.getURL('popup.html');
          window.open(url, '_blank');
        } catch (e) {
          // ignore
        }
      });
    }
  } catch (e) {
    // Fallback: open the settings page directly in a new tab
    try {
      const url = chrome.runtime.getURL('popup.html');
      window.open(url, '_blank');
    } catch (e2) {
      // ignore
    }
  }
} 
