import { resolveTtsPlaybackRate } from "../tts/playbackRate";

/**
 * The one place a TTS source is handed to a media element (#96 / #117).
 *
 * Shared by the in-page path (`AudioModule.loadAudio`) and the offscreen path
 * (`audio_handler.loadAudio`) because both have to get the same two things
 * right:
 *
 *  1. **Order.** The HTML media load algorithm resets `playbackRate` to
 *     `defaultPlaybackRate` when a new `src` is set, so the speed has to be
 *     applied *after* the source — and `defaultPlaybackRate` set as well, or a
 *     later `load()` (e.g. the cache-busting reload) silently drops it.
 *  2. **No inheritance.** The offscreen document owns ONE <audio> element for
 *     every tab (caution map, cluster C), so a load that says nothing about
 *     speed must reset it to normal rather than inherit the previous tab's.
 */
export interface TtsPlaybackSettings {
  /** Media-element volume (0..1). Omitted leaves the element's volume as-is. */
  volume?: number;
  /** Playback speed. Omitted (or unusable) means normal speed. */
  playbackRate?: number;
}

export function applyTtsPlaybackSettings(
  element: HTMLMediaElement,
  { volume, playbackRate }: TtsPlaybackSettings = {}
): void {
  if (typeof volume === "number" && Number.isFinite(volume)) {
    element.volume = Math.min(1, Math.max(0, volume));
  }

  // Always resolved, never conditional: an absent rate is a request for normal
  // speed, not permission to keep another tab's.
  const rate = resolveTtsPlaybackRate(playbackRate);
  element.defaultPlaybackRate = rate;
  element.playbackRate = rate;

  // Speech, not chipmunks: keep the pitch when the speed isn't 1.0x.
  const media = element as HTMLMediaElement & {
    preservesPitch?: boolean;
    webkitPreservesPitch?: boolean;
  };
  media.preservesPitch = true;
  if ("webkitPreservesPitch" in media) {
    media.webkitPreservesPitch = true;
  }
}

/** Point a media element at a TTS source, then apply the user's playback settings. */
export function loadTtsSource(
  element: HTMLMediaElement,
  url: string,
  settings: TtsPlaybackSettings = {}
): void {
  element.src = url;
  applyTtsPlaybackSettings(element, settings);
}
