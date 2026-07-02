import { SpeechSynthesisVoiceRemote } from "./SpeechModel";

/**
 * Client-side voice curation (doc/plans/2026-07-02-voice-selection-ux.md §3, §5).
 *
 * The in-host voice menus stay capped at a constant size while the server
 * catalog grows; the full catalog lives one click deeper (extension settings).
 * Until GET /voices carries curation metadata (featured/section/recommended),
 * tier and featured-set are derived locally from fields the API already serves
 * (powered_by + price), per the rollout plan's confirmed contract.
 */

export type VoiceTier = "hd" | "everyday";

/** Max voice rows in the in-host menus ("Voice off" and "More voices…" excluded). */
export const CLAUDE_MENU_CAP = 6;
export const PI_MENU_CAP = 5;

/**
 * Credits/1k chars boundary between value voices (OpenAI: 50) and premium
 * voices (ElevenLabs: 1000+). Sits far from both so neither drifts across.
 */
const HD_CREDITS_THRESHOLD = 300;

/** How many premium voices the shortlist features ahead of the value picks. */
const HD_FEATURED_COUNT = 2;

/**
 * Featured order for value-tier voices, most-preferred first (2026-07
 * popularity research: Coral fronts OpenAI's own demos, Nova is the enduring
 * community favourite, Ash/Onyx are the standout male voices; Alloy reads as
 * the bland default and is deliberately last).
 */
const EVERYDAY_RANK = [
  "coral",
  "nova",
  "ash",
  "onyx",
  "sage",
  "echo",
  "shimmer",
  "ballad",
  "fable",
  "alloy",
];

export function getVoiceTier(voice: SpeechSynthesisVoiceRemote): VoiceTier {
  const credits = voice.price_per_thousand_chars_in_credits;
  if (typeof credits === "number" && !isNaN(credits)) {
    return credits >= HD_CREDITS_THRESHOLD ? "hd" : "everyday";
  }
  return voice.powered_by === "ElevenLabs" ? "hd" : "everyday";
}

export interface CuratedShortlist {
  /** The rows to render, in order: current voice first, then featured picks. */
  voices: SpeechSynthesisVoiceRemote[];
  /** Catalog voices not shown — drives the "More voices…" door row. */
  hiddenCount: number;
  /** Both tiers exist in the full catalog — drives the HD chip + footer. */
  tiersCoexist: boolean;
}

/**
 * Rank by id first (stable across server re-skins of display names — plan
 * §7.3), falling back to name for catalogs whose ids aren't the voice names.
 * Curation must never throw on a malformed catalog entry, so both reads are
 * null-safe.
 */
function everydayRank(voice: SpeechSynthesisVoiceRemote): number {
  const byId = EVERYDAY_RANK.indexOf(String(voice.id ?? "").toLowerCase());
  if (byId !== -1) return byId;
  const byName = EVERYDAY_RANK.indexOf(String(voice.name ?? "").toLowerCase());
  return byName === -1 ? EVERYDAY_RANK.length : byName;
}

/**
 * Featured premium pair: first in server order, then the next voice of a
 * different gender (server order is already founder-curated; gender diversity
 * keeps the pair from reading as one flavour). Duplicate display names are
 * skipped (the Pi catalog carries two "Paola" variants), and any shortfall
 * fills from the front in server order.
 */
function pickHdFeatured(
  hdVoices: SpeechSynthesisVoiceRemote[]
): SpeechSynthesisVoiceRemote[] {
  const featured: SpeechSynthesisVoiceRemote[] = [];
  const genders = new Set<string>();
  const names = new Set<string>();

  const nameOf = (voice: SpeechSynthesisVoiceRemote) =>
    String(voice.name ?? "").toLowerCase();

  const add = (voice: SpeechSynthesisVoiceRemote) => {
    featured.push(voice);
    genders.add(String(voice.gender ?? "").toUpperCase());
    names.add(nameOf(voice));
  };

  for (const voice of hdVoices) {
    if (featured.length >= HD_FEATURED_COUNT) break;
    if (names.has(nameOf(voice))) continue;
    const gender = String(voice.gender ?? "").toUpperCase();
    if (featured.length === 0 || !genders.has(gender)) {
      add(voice);
    }
  }
  for (const voice of hdVoices) {
    if (featured.length >= HD_FEATURED_COUNT) break;
    if (names.has(nameOf(voice))) continue;
    add(voice);
  }
  return featured;
}

/**
 * Order and cap a voice catalog for an in-host menu: pin the user's current
 * voice first (it must never vanish from the menu), then the featured premium
 * pair, then value voices by popularity rank, then fill any spare capacity in
 * server order (covers single-tier catalogs).
 */
export function curateShortlist(
  voices: SpeechSynthesisVoiceRemote[],
  currentVoiceId: string | null,
  cap: number
): CuratedShortlist {
  const tiersCoexist = new Set(voices.map(getVoiceTier)).size > 1;

  const shortlist: SpeechSynthesisVoiceRemote[] = [];
  const taken = new Set<string>();
  const take = (voice: SpeechSynthesisVoiceRemote) => {
    if (shortlist.length < cap && !taken.has(voice.id)) {
      shortlist.push(voice);
      taken.add(voice.id);
    }
  };

  const current = currentVoiceId
    ? voices.find((voice) => voice.id === currentVoiceId)
    : undefined;
  if (current) take(current);

  pickHdFeatured(voices.filter((v) => getVoiceTier(v) === "hd")).forEach(take);

  voices
    .map((voice, serverIndex) => ({ voice, serverIndex }))
    .filter(({ voice }) => getVoiceTier(voice) === "everyday")
    .sort(
      (a, b) =>
        everydayRank(a.voice) - everydayRank(b.voice) ||
        a.serverIndex - b.serverIndex
    )
    .forEach(({ voice }) => take(voice));

  voices.forEach(take);

  return {
    voices: shortlist,
    hiddenCount: voices.length - shortlist.length,
    tiersCoexist,
  };
}
