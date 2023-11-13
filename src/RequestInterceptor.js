import { config } from "./ConfigModule.js";

const filesToRedirect = [
  "silero_vad.onnx",
  "ort-wasm-simd.wasm",
  "ort.min.js.map",
  "vad.worklet.bundle.min.js",
];

// Function to construct the URL for local extension resources
function getExtensionResourceUrl(filename) {
  const web_accessible_resources_dir = "public";
  const filepath = web_accessible_resources_dir + "/" + filename;
  return chrome.runtime.getURL(filepath);
}

// Function to redirect specific XMLHttpRequests
function redirectXMLHttpRequest(open) {
  XMLHttpRequest.prototype.open = function (
    method,
    url,
    async,
    user,
    password
  ) {
    const filename = url.split("/").pop();
    if (filename && filesToRedirect.includes(filename)) {
      // Check if running as a Chrome extension
      if (chrome.runtime && chrome.runtime.id) {
        arguments[1] = getExtensionResourceUrl(filename);
      } else {
        arguments[1] = `${config.appServerUrl}/${filename}`;
      }
    }
    open.apply(this, arguments);
  };
}

// Function to redirect specific fetch requests
function redirectFetch(_fetch) {
  window.fetch = function (url, opts) {
    const filename = url.split("/").pop();
    if (filename && filesToRedirect.includes(filename)) {
      // Check if running as a Chrome extension
      if (chrome.runtime && chrome.runtime.id) {
        arguments[0] = getExtensionResourceUrl(filename);
      } else {
        arguments[0] = `${config.appServerUrl}/${filename}`;
      }
    }
    return _fetch.apply(this, arguments);
  };
}

// Function to set up the interceptors
export function setupInterceptors() {
  redirectXMLHttpRequest(XMLHttpRequest.prototype.open);
  redirectFetch(window.fetch);
}
