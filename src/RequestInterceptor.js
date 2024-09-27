import { getResourceUrl } from "./ResourceModule.ts";

const filesToRedirect = [
  "silero_vad.onnx",
  "ort-wasm-simd.wasm",
  "ort.min.js.map",
  "vad.worklet.bundle.min.js",
  "ort-wasm.wasm",
];

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
      arguments[1] = getResourceUrl(filename);
    }
    open.apply(this, arguments);
  };
}

// Function to redirect specific fetch requests
function redirectFetch(_fetch) {
  window.fetch = function (url, opts) {
    const filename = url.split("/").pop();
    if (filename && filesToRedirect.includes(filename)) {
      arguments[0] = getResourceUrl(filename);
    }
    return _fetch.apply(this, arguments);
  };
}

// Function to set up the interceptors
export function setupInterceptors() {
  redirectXMLHttpRequest(XMLHttpRequest.prototype.open);
  redirectFetch(window.fetch);
}
