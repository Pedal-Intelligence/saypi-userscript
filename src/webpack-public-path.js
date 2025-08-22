// Ensure dynamic imports and async chunks load from the extension, not the host site
// This must run before any other imports that can trigger chunk loading
try {
  if (typeof chrome !== 'undefined' && chrome?.runtime?.getURL) {
    // Our bundles and copied assets live under the public/ directory
    // e.g., chrome-extension://<id>/public/
    // eslint-disable-next-line no-undef
    __webpack_public_path__ = chrome.runtime.getURL('public/');
  }
} catch (_e) {
  // ignore
}


