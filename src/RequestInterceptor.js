import { config } from "./ConfigModule";

const filesToRedirect = [
  "silero_vad.onnx",
  "ort-wasm-simd.wasm",
  "ort.min.js.map",
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
      arguments[1] = `${config.appServerUrl}/${filename}`;
    }
    open.apply(this, arguments);
  };
}

// Function to redirect specific fetch requests
function redirectFetch(_fetch) {
  window.fetch = function (url, opts) {
    const filename = url.split("/").pop();
    if (filename && filesToRedirect.includes(filename)) {
      arguments[0] = `${config.appServerUrl}/${filename}`;
    }
    return _fetch.apply(this, arguments);
  };
}

// Function to set up the interceptors
export function setupInterceptors() {
  redirectXMLHttpRequest(XMLHttpRequest.prototype.open);
  redirectFetch(window.fetch);
}
