/**
 * Internationalization (i18n) module for browser extension.
 * Uses the native chrome.i18n API which automatically handles locale selection
 * based on browser settings and loads messages from _locales/ directory.
 *
 * This eliminates the need to bundle locale files into the JavaScript bundle,
 * significantly reducing bundle size (~1.7MB savings).
 */

function getMessage(
  messageName: string,
  substitutions?: string | string[] | undefined
): string {
  // Use Chrome's native i18n API
  // This API is available in all modern browsers (Chrome, Firefox, Edge)
  // and automatically loads the correct locale from _locales/ directory
  if (typeof chrome !== "undefined" && chrome.i18n) {
    return chrome.i18n.getMessage(messageName, substitutions);
  }

  // Fallback: return message name if API is unavailable
  // This should rarely happen in a properly installed extension
  console.warn(`chrome.i18n API unavailable, returning message name: ${messageName}`);
  return messageName;
}

export default getMessage;
