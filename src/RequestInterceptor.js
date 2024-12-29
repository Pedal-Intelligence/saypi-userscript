import { getResourceUrl } from "./ResourceModule.ts";

const filesToRedirect = [
  "silero_vad.onnx",
  "ort-wasm-simd.wasm",
  "ort.min.js.map",
  "vad.worklet.bundle.js",
  "vad.worklet.bundle.min.js",
  "ort-wasm.wasm",
];

// MIME type mapping for different file extensions
const mimeTypes = {
  '.wasm': 'application/wasm',
  '.onnx': 'application/x-onnx'
};

// Function to redirect specific XMLHttpRequest
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

// Function to redirect specific fetch requests with correct MIME types
function redirectFetch(_fetch) {
  window.fetch = async function (url, opts = {}) {
    const filename = url.toString().split("/").pop();
    if (filename && filesToRedirect.includes(filename)) {
      const resourceUrl = getResourceUrl(filename);
      
      // Get file extension and corresponding MIME type
      const extension = filename.substring(filename.lastIndexOf('.'));
      const mimeType = mimeTypes[extension];

      // If it's a WASM file, we need to set the MIME type in the request
      if (extension === '.wasm') {
        opts = {
          ...opts,
          headers: {
            ...opts.headers,
            'Accept': 'application/wasm',
          }
        };
      }

      const response = await _fetch.apply(this, [resourceUrl, opts]);

      // Set correct MIME type in response if needed
      if (mimeType) {
        const blob = await response.blob();
        return new Response(blob, {
          headers: {
            'Content-Type': mimeType
          },
          status: response.status,
          statusText: response.statusText
        });
      }
      return response;
    }
    return _fetch.apply(this, arguments);
  };
}

// Function to set up the interceptors
export function setupInterceptors() {
  redirectXMLHttpRequest(XMLHttpRequest.prototype.open);
  redirectFetch(window.fetch);
}
