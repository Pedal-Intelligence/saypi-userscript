// src/permissions/permissions-prompt.ts
import getMessage from '../i18n';
import { classifyMicError } from './micPermissionRecovery';
import { renderMicRecovery } from './micRecoveryView';
import { parsePermissionReason } from './permissionLossDetection';

document.addEventListener('DOMContentLoaded', async () => {
  // When the background flags this as a revoked-access recovery (mic was granted
  // before, e.g. turned off after an OS/browser update), show tailored copy
  // instead of the first-run prompt wording (#437).
  const isRevoked = parsePermissionReason(window.location.search) !== null;

  // Localize static HTML content
  document.title = getMessage('permissions_promptTitle');
  const headingElement = document.getElementById('prompt-heading');
  if (headingElement) {
    headingElement.textContent = getMessage(
      isRevoked ? 'permissions_revokedHeading' : 'permissions_promptHeading'
    );
  }
  const infoElement = document.getElementById('prompt-info');
  if (infoElement) {
    // The productName placeholder will be $1, which is "Say, Pi" from the appName key
    infoElement.innerHTML = isRevoked
      ? getMessage('permissions_revokedInfo', getMessage('appName'))
      : getMessage('permissions_promptInfo', getMessage('appName'));
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
    console.error("[PermissionsPrompt] Status element not found in the DOM.");
    chrome.runtime.sendMessage({
      type: 'PERMISSION_PROMPT_RESULT',
      granted: false,
      error: getMessage('permissions_errorDomLoadFailure')
    }, () => { 
      if (chrome.runtime.lastError) {
        console.error("[PermissionsPrompt] Error sending critical DOM failure message:", chrome.runtime.lastError.message);
      }
    });
    return;
  }

  const recoveryElement = document.getElementById('recovery');

  async function attemptMicPermission(): Promise<void> {
    // Reset to the waiting state and hide any prior recovery panel so a retry
    // starts clean.
    statusElement!.innerHTML = `<em>${getMessage('permissions_promptStatusWaiting')}</em>`;
    if (recoveryElement) {
      recoveryElement.hidden = true;
      recoveryElement.innerHTML = '';
    }

    console.log("[PermissionsPrompt] Requesting microphone permission...");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("[PermissionsPrompt] Microphone permission GRANTED.");
      statusElement!.textContent = getMessage('permissions_statusPermissionGranted');

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
      console.error("[PermissionsPrompt] Microphone permission DENIED or error:", err?.name, err?.message);
      const errorName = err?.name || getMessage('permissions_textUnknownError');
      statusElement!.textContent = getMessage('permissions_statusPermissionDenied', errorName);

      // Notify the requester so it isn't left hanging, but keep this tab open
      // and present a first-class recovery panel instead of dead-ending (#437).
      chrome.runtime.sendMessage({
        type: 'PERMISSION_PROMPT_RESULT',
        granted: false,
        error: err?.message || err?.name || getMessage('permissions_errorUnknownDuringRequest')
      }, () => {
        if (chrome.runtime.lastError) {
          console.error("[PermissionsPrompt] Error sending DENY/ERROR message:", chrome.runtime.lastError.message);
        }
      });

      if (recoveryElement) {
        renderMicRecovery(recoveryElement, classifyMicError(err?.name), {
          translate: (key, sub) => getMessage(key, sub),
          onRetry: () => { void attemptMicPermission(); },
        });
      } else {
        // No recovery container (older markup) — fall back to the previous
        // auto-close behaviour so we never strand the tab.
        setTimeout(() => window.close(), 2500);
      }
    }
  }

  await attemptMicPermission();
});