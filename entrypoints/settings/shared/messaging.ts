export function sendMessageToActiveTab(message: any): void {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0 && tabs[0].id) {
      chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
        if (chrome.runtime.lastError) {
          console.warn('Error sending message to active tab:', 
            chrome.runtime.lastError.message);
        }
      });
    }
  });
}

