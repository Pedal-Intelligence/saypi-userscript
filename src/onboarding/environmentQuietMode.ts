/**
 * Onboarding environment question → quiet mode mapping (#437 slice 4d).
 *
 * Asks where the user will usually talk, and pre-sets quiet/whisper mode for the
 * one case where speaking aloud is most awkward — around others. Pure so it's
 * unit-tested; the page wiring reads the answer and flips the `quietMode` pref.
 */

export const VOICE_ENVIRONMENTS = ["private", "mixed", "around-others"] as const;

export type VoiceEnvironment = (typeof VOICE_ENVIRONMENTS)[number];

/** Whether the chosen environment should enable quiet/whisper mode by default. */
export function environmentToQuietMode(env: VoiceEnvironment): boolean {
  return env === "around-others";
}
