import { config } from "./ConfigModule.js";

// used by browser extensions
function getExtensionResourceUrl(filename: string) {
    const web_accessible_resources_dir = "public";
    const filepath = web_accessible_resources_dir + "/" + filename;
    return chrome.runtime.getURL(filepath);
}

// used by userscripts
function getAppServerResourceUrl(filename: string) {
    return `${config.appServerUrl}/${filename}`;
}

// cross-platform way to get a resource URL
export function getResourceUrl(filename: string) {
    if (chrome.runtime && chrome.runtime.id) {
        return getExtensionResourceUrl(filename);
    } else {
        return getAppServerResourceUrl(filename);
    }
}