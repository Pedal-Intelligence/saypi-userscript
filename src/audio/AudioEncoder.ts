import { encodeWAV } from "./WavEncoder";

/**
 * Convert a Float32Array of audio samples to a WAV array buffer
 * @param audioData - The audio samples
 * @returns - The audio in WAV format as an ArrayBuffer
 */
export function convertToWavBuffer(audioData: Float32Array): ArrayBuffer {
  const arrayBuffer = encodeWAV(audioData);
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
