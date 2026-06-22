import { encodeWAV } from "./WavEncoder";

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
