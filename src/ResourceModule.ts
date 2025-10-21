import { config } from "./ConfigModule.js";

// used by browser extensions
function getExtensionResourceUrl(filename: string) {
  return chrome.runtime.getURL(filename);
}

// used by userscripts
function getAppServerResourceUrl(filename: string) {
  return `${config.appServerUrl}/${filename}`;
}

// cross-platform way to get a resource URL
export function getResourceUrl(filename: string) {
  if (
    typeof chrome !== "undefined" &&
    typeof chrome.runtime === "object" &&
    chrome.runtime.id
  ) {
    return getExtensionResourceUrl(filename);
  } else {
    return getAppServerResourceUrl(filename);
  }
}
