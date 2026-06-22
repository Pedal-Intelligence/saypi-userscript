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

const OPUS_CONFIG: AudioEncoderConfig = {
  codec: "opus",
  sampleRate: SAMPLE_RATE,
  numberOfChannels: NUM_CHANNELS,
  bitrate: OPUS_BITRATE,
};

let opusSupportPromise: Promise<boolean> | undefined;

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
 * @throws if WebCodecs Opus is unavailable or encoding fails — callers fall back
 *   to PCM WAV rather than failing the upload.
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

  await new Promise<void>((resolve, reject) => {
    const encoder = new AudioEncoder({
      // `meta` carries the OpusHead (decoderConfig.description) webm-muxer needs.
      output: (chunk, meta) => muxer.addAudioChunk(chunk, meta),
      error: (e) => reject(e),
    });
    try {
      encoder.configure(OPUS_CONFIG);
      const frame = new AudioData({
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
      frame.close();
      encoder.flush().then(() => {
        encoder.close();
        resolve();
      }, reject);
    } catch (e) {
      reject(e);
    }
  });

  muxer.finalize();
  return new Blob([target.buffer], { type: "audio/webm" });
}
