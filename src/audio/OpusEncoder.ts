import { Muxer, ArrayBufferTarget } from "webm-muxer";
import { logger } from "../LoggingModule";

/**
 * Native-WebCodecs Opus encoder for the /transcribe upload (#414).
 *
 * The post-VAD audio is a 16 kHz mono Float32Array of raw PCM. Encoding it to
 * WebM/Opus @ 24 kbps cuts the upload ~8-11x vs the 16-bit PCM WAV baseline
 * (#417). We use the browser-native WebCodecs `AudioEncoder` — which compiles no
 * WebAssembly, so it is NOT gated by host-page `wasm-unsafe-eval` CSP and runs
 * directly in the content script — plus the tiny MIT `webm-muxer` to wrap the
 * encoder's Opus chunks into a container. WebM/Opus matches the server's
 * known-good fixture (`sample_audio.webm`) and the default upload filename.
 *
 * Callers must treat Opus as a progressive enhancement: where WebCodecs/Opus is
 * unavailable (Firefox <130, some extension contexts) or encoding errors, fall
 * back to the PCM WAV path. See `encodeAudioForUpload` in AudioEncoder.ts.
 */

const SAMPLE_RATE = 16000;
const NUM_CHANNELS = 1;
const OPUS_BITRATE = 24000; // 24 kbps — speech-transparent for 16 kHz mono
// A real encode of a few seconds of 16 kHz audio takes ~tens of ms; this only
// trips if the codec stalls and never fires `error` (rare, but it would
// otherwise hang the upload forever — the caller then falls back to WAV).
const ENCODE_TIMEOUT_MS = 5000;

const OPUS_CONFIG: AudioEncoderConfig = {
  codec: "opus",
  sampleRate: SAMPLE_RATE,
  numberOfChannels: NUM_CHANNELS,
  bitrate: OPUS_BITRATE,
};

let opusSupportPromise: Promise<boolean> | undefined;

/**
 * Thrown when an encode did not deliver a complete Opus stream to the muxer —
 * either no chunk arrived at all, or one was dropped part-way through.
 *
 * The muxer finalizes whatever it was given, so neither case fails on its own:
 * no chunks yields a valid-but-audio-less WebM the server can only answer with
 * `invalid_audio` (#630, seen on Firefox 154), and a dropped chunk yields a
 * truncated file that decodes to a partial transcript — a wrong answer, billed
 * the same as a right one. Callers treat this like any other encode failure and
 * upload the PCM WAV instead.
 */
export class OpusIncompleteOutputError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "OpusIncompleteOutputError";
    if (options && "cause" in options) {
      (this as { cause?: unknown }).cause = options.cause;
    }
  }
}

/**
 * Whether this context can encode Opus via native WebCodecs. Probed once and
 * cached (the answer is fixed for the lifetime of the page/document).
 */
export function isOpusUploadSupported(): Promise<boolean> {
  if (!opusSupportPromise) {
    opusSupportPromise = probeOpusSupport();
  }
  return opusSupportPromise;
}

async function probeOpusSupport(): Promise<boolean> {
  try {
    if (
      typeof AudioEncoder === "undefined" ||
      typeof AudioData === "undefined" ||
      typeof AudioEncoder.isConfigSupported !== "function"
    ) {
      return false;
    }
    const support = await AudioEncoder.isConfigSupported(OPUS_CONFIG);
    return support.supported === true;
  } catch (e) {
    logger.debug("[OpusEncoder] WebCodecs Opus capability probe failed", e);
    return false;
  }
}

/**
 * Encode 16 kHz mono Float32 PCM samples to a WebM/Opus Blob.
 *
 * @throws if WebCodecs Opus is unavailable, encoding fails, or the encode did
 *   not deliver a complete stream (#630) — callers fall back to PCM WAV rather
 *   than uploading a file the server cannot decode, or can decode wrongly.
 */
export async function encodeToOpusWebM(audioData: Float32Array): Promise<Blob> {
  if (!(await isOpusUploadSupported())) {
    throw new Error("WebCodecs Opus encoding is not supported in this context");
  }

  const target = new ArrayBufferTarget();
  const muxer = new Muxer({
    target,
    audio: {
      codec: "A_OPUS",
      numberOfChannels: NUM_CHANNELS,
      sampleRate: SAMPLE_RATE,
    },
  });

  // An encoder that emits nothing still yields a well-formed, empty container,
  // so success is measured by chunks actually muxed — not by flush() resolving.
  let chunksMuxed = 0;
  // The browser owns the `output` callback, so anything thrown inside it is
  // swallowed per invocation and would otherwise vanish. Keep the first one:
  // it is both the diagnosis and the signal that this stream lost a chunk.
  let outputError: unknown;

  await new Promise<void>((resolve, reject) => {
    let settled = false;
    let timer: ReturnType<typeof setTimeout>;
    let encoder: AudioEncoder | null = null;
    let frame: AudioData | null = null;

    // Close codec resources on every exit path (success, error, timeout) so a
    // failed encode can't leak an AudioEncoder/AudioData.
    const settle = (err?: unknown) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try { frame?.close(); } catch { /* already closed */ }
      try { encoder?.close(); } catch { /* already closed */ }
      if (err) reject(err instanceof Error ? err : new Error(String(err)));
      else resolve();
    };

    timer = setTimeout(() => settle(new Error("Opus encode timed out")), ENCODE_TIMEOUT_MS);

    try {
      encoder = new AudioEncoder({
        // `meta` carries the OpusHead (decoderConfig.description) webm-muxer needs.
        output: (chunk, meta) => {
          try {
            muxer.addAudioChunk(chunk, meta);
            chunksMuxed++;
          } catch (e) {
            outputError ??= e;
          }
        },
        error: (e) => settle(e),
      });
      encoder.configure(OPUS_CONFIG);
      frame = new AudioData({
        format: "f32",
        sampleRate: SAMPLE_RATE,
        numberOfFrames: audioData.length,
        numberOfChannels: NUM_CHANNELS,
        timestamp: 0,
        // Float32Array<ArrayBufferLike> vs BufferSource is a TS 5.7 typed-array
        // generics quirk; the VAD samples are always ArrayBuffer-backed at runtime.
        data: audioData as unknown as BufferSource,
      });
      encoder.encode(frame);
      encoder.flush().then(() => settle(), (e) => settle(e));
    } catch (e) {
      settle(e);
    }
  });

  // Reject on a dropped chunk too, not just on silence: finalizing a stream
  // that lost a chunk uploads a truncated file, which transcribes to something
  // plausible and wrong. `chunks` in the log tells the two apart.
  if (chunksMuxed === 0 || outputError !== undefined) {
    logger.warn(
      "[OpusEncoder] Opus encode did not produce a complete stream; uploading WAV instead",
      {
        samples: audioData.length,
        chunks: chunksMuxed,
        cause: outputError,
        userAgent:
          typeof navigator === "undefined" ? undefined : navigator.userAgent,
      }
    );
    // Name the swallowed cause in the message too: for an affected install this
    // error is the only signal that reaches a client log.
    const reason =
      outputError instanceof Error
        ? `: ${outputError.message}`
        : outputError !== undefined
          ? `: ${String(outputError)}`
          : "";
    const what =
      chunksMuxed === 0
        ? "produced no audio chunks"
        : `dropped a chunk after muxing ${chunksMuxed}`;
    throw new OpusIncompleteOutputError(
      `Opus encode ${what} for ${audioData.length} samples${reason}`,
      { cause: outputError }
    );
  }

  muxer.finalize();
  return new Blob([target.buffer], { type: "audio/webm" });
}
