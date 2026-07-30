/**
 * The Voices studio's audio layer (design §5).
 *
 * A single audition is a one-item sequence, so "play" and "stop-then-play"
 * are the same operation and there is exactly one code path between a click
 * and a clip.
 */

/** One clip in an audition sequence. */
export interface AuditionItem {
  voiceId: string;
  url: string;
  /**
   * Per-clip level match, attenuate-only (design §5.1). 1.0 until the
   * soundprint pass measures voiced RMS; `<audio>.volume` cannot exceed 1.0,
   * so this can quieten a loud clip but never rescue a quiet one.
   */
  gain: number;
}

/**
 * What the whole page knows about playback, as one snapshot.
 *
 * A snapshot, not a per-voice boolean: the shipped player handed each caller a
 * `(playing: boolean)` line scoped to ONE voice, which meant (a) a superseded
 * clip's late callback could write "not playing" into the voice that replaced
 * it, and (b) a repaint had no way to ask what was playing. A snapshot names
 * the voice, so a late write is either fenced out or harmlessly true, and any
 * repaint can restore itself from the last one.
 */
export interface AuditionState {
  running: boolean;
  playingVoiceId: string | null;
  loadingVoiceId: string | null;
  position: { index: number; total: number } | null;
  error: { voiceId: string; kind: "blocked" | "failed" } | null;
}

export const IDLE_AUDITION: AuditionState = Object.freeze({
  running: false,
  playingVoiceId: null,
  loadingVoiceId: null,
  position: null,
  error: null,
});
