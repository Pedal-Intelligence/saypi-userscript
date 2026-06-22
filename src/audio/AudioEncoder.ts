import { encodeWAV, decodePcm16Wav } from "./WavEncoder";
import { isOpusUploadSupported, encodeToOpusWebM } from "./OpusEncoder";
import { logger } from "../LoggingModule";

/**
 * Convert a Float32Array of audio samples to a WAV array buffer
 * @param audioData - The audio samples
 * @returns - The audio in WAV format as an ArrayBuffer
 */
export function convertToWavBuffer(audioData: Float32Array): ArrayBuffer {
  // Encode as 16-bit PCM (format 1) rather than encodeWAV's 32-bit-float
  // default (format 3). This halves the bytes uploaded to POST /transcribe and
  // is speech-lossless for the 16 kHz mono samples the VAD produces — the
  // single biggest lever on transcription upload latency. See #414.
  const arrayBuffer = encodeWAV(
    audioData,
    /* format: PCM */ 1,
    /* sampleRate */ 16000,
    /* numChannels */ 1,
    /* bitDepth */ 16
  );
  return arrayBuffer;
}

/**
 * Convert a Float32Array of audio samples to a WAV Blob
 * @param audioData - The audio samples
 * @returns - The audio in WAV format
 */
export function convertToWavBlob(audioData: Float32Array): Blob {
  const arrayBuffer = convertToWavBuffer(audioData);
  return new Blob([arrayBuffer], { type: "audio/wav" });
}

/**
 * Transcode a 16-bit PCM WAV upload blob to WebM/Opus where WebCodecs supports
 * it, for the /transcribe POST (#414). Opus (~24 kbps, native WebCodecs) is
 * ~8-11x smaller than the PCM WAV baseline (#417) — the highest-leverage cut on
 * transcription upload latency.
 *
 * This runs at the network boundary (FormData construction), NOT in the audio
 * event pipeline: that pipeline emits `saypi:userStoppedSpeaking` twice — raw
 * then re-emitted *synchronously* with the WAV blob — and the call-button /
 * conversation machines depend on that synchronous nesting, which an async encode
 * upstream would break. Transcoding the finished WAV blob here keeps the pipeline
 * untouched and localizes Opus to the one async place that matters: the upload.
 *
 * Progressive enhancement: a non-WAV blob, an unsupported context (Firefox <130,
 * etc.), or any encode error returns the original blob unchanged, so the upload
 * never fails. Duration is sent as a separate sample-count-derived field, so the
 * format switch can't perturb billing or accuracy.
 *
 * @param audioBlob - the upload blob (an `audio/wav` 16-bit PCM blob to transcode)
 * @returns an `audio/webm` (Opus) blob, or the original blob unchanged
 */
export async function transcodeForUpload(audioBlob: Blob): Promise<Blob> {
  if (audioBlob.type !== "audio/wav") return audioBlob;
  if (!(await isOpusUploadSupported())) return audioBlob;
  try {
    const samples = decodePcm16Wav(await audioBlob.arrayBuffer());
    if (!samples || samples.length === 0) return audioBlob;
    return await encodeToOpusWebM(samples);
  } catch (e) {
    logger.warn(
      "[AudioEncoder] Opus transcode failed; uploading 16-bit PCM WAV",
      e
    );
    return audioBlob;
  }
}
