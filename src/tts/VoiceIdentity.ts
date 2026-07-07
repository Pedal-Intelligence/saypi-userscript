import type { SpeechSynthesisVoiceRemote } from "./SpeechModel";

/**
 * Client-side voice identity map (doc/plans/2026-07-07-voices-host-studio-design.md).
 *
 * A voice is a persona, not a config value: each curated voice carries a
 * gradient pair (its visual mark — the settings studio renders it as the
 * play-button "orb" and tints the stage with it) and a tagline i18n key
 * ("Velvet late-night baritone" does what "Jarnathan" never will).
 *
 * The map is deliberately client-owned for now — the same place-to-iterate
 * argument as VoiceCuration's shortlist heuristics. Upstreaming identities
 * into the server curation manifest (saypi-api #293 family) is a later phase.
 *
 * Voices outside the map (the server catalog can grow without a client
 * release) get a deterministic hash-derived gradient and no tagline — the
 * studio then falls back to server metadata for subtitles. Uncurated voices
 * are unstyled, never broken.
 */

export interface VoiceVisualIdentity {
  /** CSS colors, gradient start → end. */
  gradient: [string, string];
  /** i18n key of the authored tagline; absent for uncurated voices. */
  taglineKey?: string;
}

/**
 * Keyed by lowercase voice id AND lowercase display name (OpenAI ids are the
 * names; ElevenLabs ids are opaque UUIDs, so their names do the matching).
 * The Pi catalog's twin "Paola" variants (#474) intentionally share one
 * persona identity — metadata subtitles differentiate them.
 */
const CURATED: Record<string, [string, string]> = {
  // Everyday (OpenAI)
  alloy: ["#D4D4D8", "#71717A"],
  ash: ["#94A3B8", "#475569"],
  ballad: ["#FDA4AF", "#BE185D"],
  cedar: ["#84CC16", "#166534"],
  coral: ["#FB7185", "#F97316"],
  echo: ["#67E8F9", "#0891B2"],
  fable: ["#F0ABFC", "#A21CAF"],
  marin: ["#2DD4BF", "#0E7490"],
  nova: ["#A78BFA", "#4F46E5"],
  onyx: ["#52525B", "#101014"],
  sage: ["#A3B18A", "#588157"],
  shimmer: ["#FDE68A", "#F59E0B"],
  // HD (ElevenLabs — matched by name)
  paola: ["#FCA5A5", "#DC2626"],
  joey: ["#FDBA74", "#EA580C"],
  jarnathan: ["#C4B5FD", "#4C1D95"],
  jeff: ["#A8A29E", "#44403C"],
  mark: ["#7DD3FC", "#0369A1"],
  jamahal: ["#F9A8D4", "#9D174D"],
  finn: ["#99F6E4", "#0D9488"],
  juniper: ["#86EFAC", "#059669"],
  cassidy: ["#93C5FD", "#1D4ED8"],
  addison: ["#FCD34D", "#B45309"],
  jessica: ["#F5D0FE", "#C026D3"],
  lucy: ["#BFDBFE", "#3B82F6"],
};

/** djb2 — tiny, stable, good-enough spread for hue derivation. */
function hashString(value: string): number {
  let hash = 5381;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return hash >>> 0;
}

export function getVoiceIdentity(
  voice: Pick<SpeechSynthesisVoiceRemote, "id" | "name">
): VoiceVisualIdentity {
  const id = String(voice.id ?? "").toLowerCase();
  const name = String(voice.name ?? "").toLowerCase();
  const key = id in CURATED ? id : name in CURATED ? name : null;
  if (key) {
    return { gradient: CURATED[key], taglineKey: `voiceTagline_${key}` };
  }
  const hue = hashString(id || name) % 360;
  return {
    gradient: [
      `hsl(${hue}, 62%, 52%)`,
      `hsl(${(hue + 40) % 360}, 68%, 34%)`,
    ],
  };
}
