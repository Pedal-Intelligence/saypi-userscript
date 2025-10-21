import { getResourceUrl } from "./ResourceModule.ts";

const filesToRedirect = [
  "silero_vad.onnx",
  "silero_vad_v5.onnx",
  "silero_vad_legacy.onnx",
  "ort-wasm-simd.wasm",
  "ort.min.js.map",
  "vad.worklet.bundle.js",
  "vad.worklet.bundle.min.js",
  "ort-wasm.wasm",
];

// Shim Response.arrayBuffer to ensure same-realm ArrayBuffer for model files in Firefox
// Only applies to our specific model assets to avoid touching unrelated requests
(() => {
  const originalArrayBuffer = Response.prototype.arrayBuffer;
  Response.prototype.arrayBuffer = async function () {
    try {
      const url = (this && this.url) || "";
      const shouldFix = filesToRedirect.some((f) => url.endsWith(f));
      const ab = await originalArrayBuffer.call(this);
      if (shouldFix && !(ab instanceof ArrayBuffer) && ab && typeof ab.byteLength === 'number') {
        const copy = new ArrayBuffer(ab.byteLength);
        new Uint8Array(copy).set(new Uint8Array(ab));
        return copy;
      }
      return ab;
    } catch (e) {
      // In case of any unexpected error, fall back to the original behavior
      return originalArrayBuffer.call(this);
    }
  };
})();

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

// Function to redirect specific fetch requests without re-wrapping the Response
function redirectFetch(originalFetch) {
  const wrappedFetch = async function (url, opts = {}) {
    const urlString = url.toString();
    
    // Skip interception for API endpoints - check if URL contains API paths
    if (urlString.includes('/transcribe') || urlString.includes('/api/') || urlString.includes('api.')) {
      return originalFetch.apply(this, arguments);
    }
    
    const filename = urlString.split("/").pop()?.split("?")[0]; // Remove query parameters when extracting filename
    
    // Only redirect specific resource files, not API endpoints
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
      } else if (extension === '.onnx') {
        opts = {
          ...opts,
          headers: {
            ...opts.headers,
            'Accept': 'application/x-onnx'
          }
        };
      }

      try {
        // Important: return the original Response to avoid cross-realm issues in Firefox
        return await originalFetch.apply(this, [resourceUrl, opts]);
      } catch (error) {
        console.error(`[RequestInterceptor] Error redirecting ${filename}:`, error);
        // Fallback to original request if redirect fails
        return originalFetch.apply(this, arguments);
      }
    }
    
    // For all other requests (including API calls), use original fetch
    return originalFetch.apply(this, arguments);
  };

  try {
    const descriptor = {
      value: wrappedFetch,
      configurable: true,
      writable: true,
    };

    Reflect.defineProperty(window, "fetch", descriptor);
    if (globalThis !== window) {
      Reflect.defineProperty(globalThis, "fetch", descriptor);
    }
  } catch (error) {
    console.warn("[RequestInterceptor] Failed to override fetch; falling back to original fetch.", error);
  }
}

// Function to set up the interceptors
export function setupInterceptors() {
  redirectXMLHttpRequest(XMLHttpRequest.prototype.open);
  redirectFetch(window.fetch);
}
