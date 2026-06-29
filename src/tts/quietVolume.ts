/**
 * TTS playback volume for quiet/whisper mode (#437).
 *
 * In quiet mode the assistant should reply softly so the whole exchange stays
 * discreet (e.g. around others). Single source of truth for the scalar, used by
 * both the in-page and offscreen playback paths.
 */

/** Playback volume (0..1) applied to TTS audio when quiet mode is on. */
export const QUIET_TTS_VOLUME = 0.5;

/** Resolves the TTS playback volume (0..1) for the current quiet-mode state. */
export function ttsVolumeForQuietMode(quietMode: boolean): number {
  return quietMode ? QUIET_TTS_VOLUME : 1;
}
