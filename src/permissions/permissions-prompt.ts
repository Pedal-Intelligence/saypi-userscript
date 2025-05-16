// src/permissions/permissions-prompt.ts
import getMessage from '../i18n';

document.addEventListener('DOMContentLoaded', async () => {
  // Localize static HTML content
  document.title = getMessage('permissions_promptTitle');
  const headingElement = document.getElementById('prompt-heading');
  if (headingElement) {
    headingElement.textContent = getMessage('permissions_promptHeading');
  }
  const infoElement = document.getElementById('prompt-info');
  if (infoElement) {
    // The productName placeholder will be $1, which is "Say, Pi" from the appName key
    infoElement.innerHTML = getMessage('permissions_promptInfo', getMessage('appName'));
  }
  const actionElement = document.getElementById('prompt-action');
  if (actionElement) {
    actionElement.innerHTML = getMessage('permissions_promptAction'); // This message contains HTML
  }
  const footerElement = document.getElementById('prompt-footer');
  if (footerElement) {
    footerElement.textContent = getMessage('permissions_promptFooter');
  }

  const statusElement = document.getElementById('status');
  if (!statusElement) {
    console.error(getMessage('permissions_logStatusElementNotFound'));
    chrome.runtime.sendMessage({
      type: 'PERMISSION_PROMPT_RESULT',
      granted: false,
      error: getMessage('permissions_errorDomLoadFailure')
    }, () => { 
      if (chrome.runtime.lastError) {
        console.error(getMessage('permissions_logErrorSendingDomFailure'), chrome.runtime.lastError.message);
      }
    });
    return;
  }

  console.log(getMessage('permissions_logRequestingPermission'));
  // Set initial status message using the key from HTML part, as it's the same
  statusElement.innerHTML = `<em>${getMessage('permissions_promptStatusWaiting')}</em>`; 

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log(getMessage('permissions_logPermissionGranted'));
    statusElement.textContent = getMessage('permissions_statusPermissionGranted');

    stream.getTracks().forEach(track => track.stop());

    chrome.runtime.sendMessage({
      type: 'PERMISSION_PROMPT_RESULT',
      granted: true
    }, () => {
      if (chrome.runtime.lastError) {
        console.error(getMessage('permissions_logErrorSendingGrant'), chrome.runtime.lastError.message);
      }
      setTimeout(() => window.close(), 1500);
    });

  } catch (err: any) {
    console.error(getMessage('permissions_logPermissionDeniedOrError'), err.name, err.message);
    const errorName = err.name || getMessage('permissions_textUnknownError');
    statusElement.textContent = getMessage('permissions_statusPermissionDenied', errorName);
    
    chrome.runtime.sendMessage({
      type: 'PERMISSION_PROMPT_RESULT',
      granted: false,
      error: err.message || err.name || getMessage('permissions_errorUnknownDuringRequest')
    }, () => {
      if (chrome.runtime.lastError) {
        console.error(getMessage('permissions_logErrorSendingDeny'), chrome.runtime.lastError.message);
      }
      setTimeout(() => window.close(), 2500);
    });
  }
}); 