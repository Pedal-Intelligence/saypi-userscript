/**
 * TTS playback volume (#117), including quiet/whisper mode (#437).
 *
 * One resolver for both playback paths (in-page and offscreen): the user's
 * chosen level (0–100, from the Voice playback settings) mapped onto the media
 * element's 0–1 scale, with quiet mode attenuating whatever level was chosen
 * rather than a hardcoded full volume. At the defaults this is exactly the
 * behaviour #437 shipped: full volume normally, half volume in quiet mode.
 */

/** How much quieter the assistant speaks in quiet/whisper mode. */
export const QUIET_TTS_VOLUME_FACTOR = 0.5;

/** Volume levels are stored as percentages, so the UI and storage agree. */
export const MIN_TTS_VOLUME = 0;
export const MAX_TTS_VOLUME = 100;
export const DEFAULT_TTS_VOLUME = MAX_TTS_VOLUME;

export interface TtsVolumeInputs {
  /** The stored 0–100 preference; anything unusable falls back to the default. */
  volume?: unknown;
  /** Quiet/whisper mode (#437). */
  quietMode?: boolean;
}

/**
 * Normalise a stored/entered volume to a 0–100 level (the unit the settings
 * slider and storage use). Non-numeric values fall back to full volume; a
 * chosen 0 is a real level (mute), not an absent value.
 */
export function resolveTtsVolumeLevel(preference: unknown): number {
  const requested =
    typeof preference === "number"
      ? preference
      : typeof preference === "string" && preference.trim() !== ""
        ? Number(preference)
        : Number.NaN;

  if (!Number.isFinite(requested)) {
    return DEFAULT_TTS_VOLUME;
  }
  return Math.min(MAX_TTS_VOLUME, Math.max(MIN_TTS_VOLUME, Math.round(requested)));
}

/** Resolves the media element's playback volume (0..1) for the current prefs. */
export function resolveTtsVolume({ volume, quietMode = false }: TtsVolumeInputs = {}): number {
  const level = resolveTtsVolumeLevel(volume) / MAX_TTS_VOLUME;
  return level * (quietMode ? QUIET_TTS_VOLUME_FACTOR : 1);
}
