// Type-only: vad-web hands its own ORT instance (`onnxruntime-web/wasm`) to `ortConfig`, and
// that is the instance to configure. A value import here would bundle a second ORT.
import type * as ort from "onnxruntime-web/wasm";
import { logger } from "../LoggingModule";

/**
 * The `ortConfig` both VAD clients pass to MicVAD.
 *
 * Single-threaded, no proxy worker: threading and the proxy both spawn a blob-backed worker,
 * which MV3's extension CSP forbids in the offscreen document and a host page's CSP may
 * forbid for the in-page (Firefox) client. ORT only threads when SharedArrayBuffer is
 * available, i.e. on a cross-origin-isolated page, so without this a host that happens to be
 * isolated would break in-page VAD. Also quiets ORT's logging.
 */
export function configureSingleThreadedOrt(runtime: typeof ort): void {
  try {
    runtime.env.logLevel = "error";
    runtime.env.wasm.proxy = false;
    runtime.env.wasm.numThreads = 1;
  } catch (error) {
    logger.warn("[SayPi VAD] Failed to configure ONNX runtime", error);
  }
}
