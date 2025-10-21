import { browser } from "wxt/browser";

export function sendMessageToActiveTab(message: any): void {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    if (tabs.length > 0 && tabs[0].id) {
      browser.tabs.sendMessage(tabs[0].id, message).catch((error) => {
        console.warn('Error sending message to active tab:', error.message);
      });
    }
  });
}

