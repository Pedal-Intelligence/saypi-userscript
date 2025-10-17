import { browser } from "wxt/browser";

/**
 * Browser API utility functions for usage analytics and extension functionality.
 * Provides consistent and safe access to browser extension APIs across different contexts.
 */

const extensionApi = ((): typeof browser | typeof chrome | undefined => {
  if (typeof browser !== "undefined") {
    return browser;
  }
  if (typeof chrome !== "undefined") {
    return chrome;
  }
  return undefined;
})();

/**
 * Checks if the Chrome extension runtime API is available and functional
 * @returns true if chrome.runtime is available with basic methods
 */
export function isChromeRuntimeAvailable(): boolean {
  return Boolean(extensionApi?.runtime);
}

/**
 * Checks if the Chrome extension manifest API is available
 * @returns true if chrome.runtime.getManifest is available
 */
export function isChromeManifestAvailable(): boolean {
  return isChromeRuntimeAvailable() && 
         typeof extensionApi?.runtime?.getManifest === 'function';
}

/**
 * Checks if the Chrome storage API is available
 * @returns true if chrome.storage.local is available
 */
export function isChromeStorageAvailable(): boolean {
  return Boolean(
    extensionApi?.storage &&
    extensionApi.storage.local
  );
}

/**
 * Safely gets the extension manifest, with error handling
 * @returns The extension manifest or null if unavailable
 */
export function getExtensionManifest(): chrome.runtime.Manifest | null {
  if (!isChromeManifestAvailable()) {
    return null;
  }

  try {
    return extensionApi!.runtime!.getManifest();
  } catch (error) {
    console.warn('[BrowserApiUtils] Failed to get extension manifest:', error);
    return null;
  }
}

/**
 * Safely gets the extension ID
 * @returns The extension ID or null if unavailable
 */
export function getExtensionId(): string | null {
  if (!isChromeRuntimeAvailable()) {
    return null;
  }

  try {
    return extensionApi!.runtime!.id || null;
  } catch (error) {
    console.warn('[BrowserApiUtils] Failed to get extension ID:', error);
    return null;
  }
}

/**
 * Gets the extension context type (content script, service worker, popup, etc.)
 * @returns A string describing the current context or 'unknown'
 */
export function getExtensionContext(): string {
  if (!isChromeRuntimeAvailable()) {
    return 'non-extension';
  }

  // Check if we're in a service worker context
  if (typeof window === 'undefined' && typeof self !== 'undefined') {
    return 'service-worker';
  }

  // Check if we're in a content script context
  if (typeof window !== 'undefined' && window.location) {
    const url = window.location.href;
    if (url.startsWith('chrome-extension://') || url.startsWith('moz-extension://')) {
      return 'extension-page';
    } else {
      return 'content-script';
    }
  }

  return 'unknown';
}
