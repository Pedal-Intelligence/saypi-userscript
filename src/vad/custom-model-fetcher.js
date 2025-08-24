"use strict";
/**
 * custom-model-fetcher.js
 *
 * What this is for
 * -----------------
 * Firefox treats objects created in different JavaScript realms (page vs. content script)
 * as distinct prototypes. When ONNX Runtime (ORT) validates the model bytes with
 * `instanceof ArrayBuffer` or `instanceof SharedArrayBuffer`, a cross‑realm ArrayBuffer
 * will fail the check even though its tag is `[object ArrayBuffer]` and it has valid bytes.
 *
 * This fetcher forces the resulting buffer into the current realm by copying the bytes
 * into a new `ArrayBuffer` created in the same realm. This makes ORT's `instanceof` guard
 * pass in Firefox.
 *
 * How to use it (if needed)
 * -------------------------
 * Pass this function as the `modelFetcher` option when creating MicVAD. Example:
 *
 *   import { customModelFetcher } from "./vad/custom-model-fetcher";
 *   const options = {
 *     baseAssetPath: chrome.runtime.getURL("public/"),
 *     onnxWASMBasePath: chrome.runtime.getURL("public/"),
 *     model: "v5",
 *     modelFetcher: (url) => customModelFetcher(url)
 *   };
 *   const vad = await MicVAD.new(options);
 *
 * Why we are NOT using it by default
 * ----------------------------------
 * We currently solve the Firefox cross‑realm issue through a minimal shim that wraps
 * `Response.prototype.arrayBuffer()` only for our model file URLs in `RequestInterceptor.js`.
 * That approach keeps the library defaults intact and avoids thread‑local changes to VAD
 * option wiring in multiple places. If the shim is removed in the future, you can switch
 * to this explicit fetcher.
 */

const CustomModelFetcher = async (path) => {
    const arrayBuf = await fetchModel(path);
    return copyArrayBuffer(arrayBuf);
};

const fetchModel = (path) => {
    return fetch(path).then((model) => model.arrayBuffer());
};

const copyArrayBuffer = (original) => {
    const arrayBuffer = new ArrayBuffer(original.byteLength);
    new Uint8Array(arrayBuffer).set(new Uint8Array(original));
    return arrayBuffer;
};

export const customModelFetcher = CustomModelFetcher;