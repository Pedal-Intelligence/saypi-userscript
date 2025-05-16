// src/permissions/permissions-prompt.ts
document.addEventListener('DOMContentLoaded', async () => {
  const statusElement = document.getElementById('status');
  if (!statusElement) {
    console.error("[PermissionsPrompt] Status element not found in the DOM.");
    chrome.runtime.sendMessage({
      type: 'PERMISSION_PROMPT_RESULT',
      granted: false,
      error: "Permissions prompt page DOM failed to load correctly."
    }, () => { chrome.runtime.lastError && console.error("[PermissionsPrompt] Error sending critical DOM failure message:", chrome.runtime.lastError.message); });
    return;
  }

  console.log("[PermissionsPrompt] Requesting microphone permission...");
  statusElement.textContent = "Waiting for your go-ahead…";

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log("[PermissionsPrompt] Microphone permission GRANTED.");
    statusElement.textContent = "Thanks! Permission granted. Wrapping things up...";

    stream.getTracks().forEach(track => track.stop());

    chrome.runtime.sendMessage({
      type: 'PERMISSION_PROMPT_RESULT',
      granted: true
    }, () => {
      if (chrome.runtime.lastError) {
        console.error("[PermissionsPrompt] Error sending GRANT message:", chrome.runtime.lastError.message);
      }
      setTimeout(() => window.close(), 1500);
    });

  } catch (err: any) {
    console.error("[PermissionsPrompt] Microphone permission DENIED or error:", err.name, err.message);
    statusElement.textContent = `Hmm, couldn’t get mic access: ${err.name || 'Unknown Error'}. Closing this tab in a moment…`;
    
    chrome.runtime.sendMessage({
      type: 'PERMISSION_PROMPT_RESULT',
      granted: false,
      error: err.message || err.name || "Unknown error during permission request"
    }, () => {
      if (chrome.runtime.lastError) {
        console.error("[PermissionsPrompt] Error sending DENY/ERROR message:", chrome.runtime.lastError.message);
      }
      setTimeout(() => window.close(), 2500);
    });
  }
}); 