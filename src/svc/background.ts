chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openPopup') {
    // Try the preferred method first
    if (chrome.action?.openPopup) {
      chrome.action.openPopup();
    } else {
      // Fallback: create a popup window
      const popupURL = chrome.runtime.getURL('src/popup/popup.html');
      chrome.windows.create({
        url: popupURL,
        type: 'popup',
        width: 400,
        height: 600,
        focused: true
      });
    }
  }
}); 