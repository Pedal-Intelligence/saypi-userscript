/**
 * Shared utility for persisting audio segments to disk for debugging purposes.
 * Used by both AudioInputMachine (for VAD-captured segments) and DictationMachine (for refinement chunks).
 */

import { config } from "../ConfigModule";

/**
 * Persists an audio blob to disk via the background script's downloads API.
 * Only saves if the `keepSegments` config is enabled.
 *
 * @param audioBlob - The audio blob to save
 * @param captureTimestamp - When the audio was captured (or refinement started)
 * @param duration - Duration of the audio in milliseconds
 * @param prefix - Filename prefix (e.g., "saypi-segment" or "saypi-refinement")
 */
export function persistAudioSegment(
  audioBlob: Blob,
  captureTimestamp: number,
  duration: number,
  prefix: string = "saypi-segment"
): void {
  try {
    const keep = config.keepSegments === true || config.keepSegments === 'true';
    if (!keep || audioBlob.size === 0) {
      return;
    }

    // Create a unique filename with timestamps
    const startedAt = captureTimestamp - Math.round(duration);
    const startedIso = new Date(startedAt).toISOString().replace(/[:.]/g, "-");
    const endedIso = new Date(captureTimestamp).toISOString().replace(/[:.]/g, "-");
    const filename = `SayPiSegments/${prefix}_${startedIso}_to_${endedIso}_${Math.round(duration)}ms.wav`;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(",")[1];
      // Send to background to save via downloads API
      chrome.runtime.sendMessage({
        type: "SAVE_SEGMENT_WAV",
        filename,
        base64: base64Data
      }, () => void 0);
    };
    reader.readAsDataURL(audioBlob);
  } catch (e) {
    console.warn(`Failed to persist ${prefix} locally:`, e);
  }
}
