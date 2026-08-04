import type { SpeechSynthesisVoiceRemote } from "./SpeechModel";

/**
 * Client-side voice identity: which authored tagline belongs to which voice.
 * "Velvet late-night baritone" does what "Jarnathan" never will.
 *
 * This module used to carry a second half — a 28-entry curated colour table
 * plus a `djb2` hash that invented a gradient for every uncurated voice. It is
 * gone (2026-07-31 audition-room design §6.3). A hash-derived gradient *looks*
 * like it encodes something about a voice and encodes nothing, which is worse
 * than plain; the studio now draws each voice from its own sample clip
 * instead, where every pixel comes from the audio you are about to judge.
 * Deleting it also removed an `innerHTML` sink from a privileged extension
 * page, and the per-voice colour that made 22 marks read as a wall of Skittles.
 *
 * The map is deliberately client-owned for now — the same place-to-iterate
 * argument as VoiceCuration's shortlist heuristics. Upstreaming identities
 * into the server curation manifest (saypi-api #293 family) is a later phase.
 * A voice outside the map (the catalog can grow without a client release) has
 * no tagline, and the studio falls back to server metadata for its subtitle.
 */

export interface VoiceVisualIdentity {
  /** i18n key of the authored tagline; absent for uncurated voices. */
  taglineKey?: string;
}

/**
 * Voices with an authored tagline, keyed by lowercase voice id AND lowercase
 * display name (OpenAI ids are the names; ElevenLabs ids are opaque UUIDs, so
 * their names do the matching). The Pi catalog's twin "Paola" variants (#474)
 * intentionally share one persona identity — metadata subtitles differentiate
 * them.
 */
const CURATED = new Set([
  // Everyday (OpenAI)
  "alloy",
  "ash",
  "ballad",
  "cedar",
  "coral",
  "echo",
  "fable",
  "marin",
  "nova",
  "onyx",
  "sage",
  "shimmer",
  // HD (ElevenLabs — matched by name)
  "paola",
  "joey",
  "jarnathan",
  "jeff",
  "mark",
  "jamahal",
  "finn",
  "juniper",
  "cassidy",
  "addison",
  "jessica",
  "lucy",
]);

export function getVoiceIdentity(
  voice: Pick<SpeechSynthesisVoiceRemote, "id" | "name">
): VoiceVisualIdentity {
  const id = String(voice.id ?? "").toLowerCase();
  const name = String(voice.name ?? "").toLowerCase();
  const key = CURATED.has(id) ? id : CURATED.has(name) ? name : null;
  return key ? { taglineKey: `voiceTagline_${key}` } : {};
}
