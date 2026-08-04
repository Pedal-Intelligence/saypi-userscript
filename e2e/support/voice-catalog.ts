/**
 * The mock `GET /voices` catalog — the Voices tab's whole world inside the
 * Layer 3 harness.
 *
 * Why this file exists at all: the rail has ~2650 unit/contract tests and, until
 * this catalog, zero end-to-end coverage, because the mock API served no
 * `/voices` route and the tab rendered its empty state in CI. Everything the
 * design leans on — focus on arrival, the arming rule, the pitch ordering, one
 * shared reference line, twins that stay distinguishable — was verified by hand
 * in a real browser and guarded by nothing.
 *
 * The catalog is small on purpose (seven voices, six of them auditionable) but
 * every entry is here to make one designed behaviour observable end to end:
 *
 * | Voice            | Tier     | Clip    | Why it exists |
 * | ---------------- | -------- | ------- | ------------- |
 * | Onyx             | everyday | onyx    | The deep end, and a SEEDED id (`VoicePitch.ts`) — sorts instantly, never moves |
 * | Rowan            | everyday | onyx    | UNSEEDED: starts at the 155 Hz placeholder and must be *measured* down to the deep end |
 * | Alloy            | everyday | alloy   | The middle, seeded |
 * | Paola (33 langs) | HD       | alloy   | Twin, and unseeded — measured just below the seeded Alloy it shares a clip with |
 * | Paola (12 langs) | HD       | addison | The other twin, at the far end of the rail from the first |
 * | Addison          | HD       | addison | The bright end, seeded |
 * | Nimbus           | everyday | —       | No `sample_url`: the "No sample yet" group, excluded from every counter |
 *
 * What that buys, in the order the design doc argues them:
 *
 * - **Both tiers, with something to do.** Three HD (1000 credits) and four
 *   everyday (50) — so the `HD` chip renders, the cost description has rows to
 *   hang off, and `Show: HD only` / `Everyday` both narrow to a non-empty rail.
 *   A single-tier catalog switches the tier filter off entirely, which would
 *   silently delete that half of the page from the tests.
 * - **The twin-"Paola" case, which has regressed twice** (#474). Both twins
 *   carry the *same* server description, so the differentiator falls to their
 *   language counts (33 vs 12) — the "languages" strategy — and each row must
 *   show `Speaks N languages` *at rest*, not on hover. A disambiguator that
 *   hides does not disambiguate.
 * - **Ordering that is genuinely measured.** Two of the six auditionable voices
 *   have ids the build-time pitch seed has never heard of, so nothing but a
 *   real decode in a real `OfflineAudioContext` can place them. They start at
 *   the reference line and settle into position — deepest to brightest — once
 *   their prints resolve. The seeded four bracket them, proving the seed and
 *   the measurement agree rather than fight (see `SEED_AGREEMENT_SEMITONES`).
 * - **A voice with no clip.** Un-auditionable but real: it renders below the
 *   rule in the "No sample yet" group and must stay out of `N of M heard`,
 *   `Play all` and `Not yet heard`, or the counters lie.
 *
 * Field names and value shapes mirror a real `GET /voices` response captured
 * 2026-07-31 (57-language OpenAI everyday voices at 50 credits,
 * 33-language ElevenLabs HD voices at 1000, `section`/`featured`/`recommended`
 * curation manifest, `sample_url` with a `?v=` cache-buster). Anything the
 * client reads is real; nothing here is invented convenience.
 */

/**
 * One catalog entry, as the *server* sends it.
 *
 * Deliberately NOT typed as `SpeechSynthesisVoiceRemote`: that interface
 * extends the DOM's `SpeechSynthesisVoice` and so demands `lang`,
 * `localService` and `voiceURI`, none of which the real payload carries. Typing
 * the fixture against the client's optimistic view would force three invented
 * fields into a file whose entire job is to be faithful to the wire.
 */
export interface MockVoice {
  id: string;
  name: string;
  provider_voice_id: string;
  price: number;
  price_per_thousand_chars_in_usd: number;
  price_per_thousand_chars_in_credits: number;
  powered_by: string;
  default: boolean;
  model: string | null;
  languages: string[];
  gender: string;
  accent: string;
  description: string;
  /** Absent (not null) on a voice the server has rendered no preview for. */
  sample_url?: string;
  featured: boolean;
  section: "hd" | "everyday";
  recommended: boolean;
  language: string | null;
  sibling_id: string | null;
  deprecated: boolean;
  availability: string;
  chars_per_minute: number | null;
}

/** The three committed clips, by file name. See `e2e/fixtures/voices/README.md`. */
export type SampleClip = "onyx" | "alloy" | "addison";

/** OpenAI's everyday-tier language list, verbatim from the live catalog. */
const EVERYDAY_LANGUAGES = [
  "af", "ar", "az", "be", "bg", "bs", "ca", "cs", "cy", "da", "de", "el",
  "en", "es", "et", "fa", "fi", "fr", "gl", "he", "hi", "hr", "hu", "hy",
  "id", "is", "it", "ja", "kk", "kn", "ko", "lt", "lv", "mi", "mk", "mr",
  "ms", "ne", "nl", "no", "pl", "pt", "ro", "ru", "sk", "sl", "sr", "sv",
  "sw", "ta", "th", "tl", "tr", "uk", "ur", "vi", "zh",
];

/** ElevenLabs' HD-tier list (multilingual v2), verbatim from the live catalog. */
const HD_LANGUAGES = [
  "en", "ja", "zh", "de", "hi", "fr", "ko", "pt", "it", "es", "ru", "id",
  "nl", "tr", "fil", "tl", "pl", "sv", "bg", "ro", "ar", "cs", "el", "fi",
  "hr", "ms", "sk", "da", "ta", "uk", "vi", "no", "hu",
];

/**
 * …and a shorter list for the second twin. The twins differ ONLY in how many
 * languages they speak, because that is the axis #474 forced the studio onto
 * once their server descriptions turned out to be identical.
 */
const HD_LANGUAGES_LEGACY = HD_LANGUAGES.slice(0, 12);

const SAMPLE_ORIGIN = "https://api.saypi.ai";

/**
 * The `?v=` a real `sample_url` carries. It is not decoration: `sampleVersion`
 * folds it into the print cache key, so a re-rendered clip invalidates a cached
 * soundprint. Fixed strings here — a changing version would defeat the cache
 * the harness is otherwise free to exercise.
 */
const sampleUrl = (id: string, version: string) =>
  `${SAMPLE_ORIGIN}/voices/${id}/sample?v=${version}`;

/** Ids the fixtures refer to by name, so specs never spell them twice. */
export const MOCK_VOICE_IDS = {
  /** Seeded at 92.2 Hz; its clip measures 91 Hz. The deep end. */
  onyx: "onyx",
  /** Unseeded — placed by measurement alone, on Onyx's clip. */
  rowan: "e2e-rowan",
  /** Seeded at 134.5 Hz; its clip measures 132.5 Hz. The middle. */
  alloy: "alloy",
  /** Twin A: 33 languages, unseeded, on Alloy's clip. */
  paolaMultilingual: "e2e-paola-multilingual",
  /** Twin B: 12 languages, unseeded, on Addison's clip. */
  paolaLegacy: "e2e-paola-legacy",
  /** Seeded at 260.2 Hz; its clip measures 259 Hz. The bright end. */
  addison: "eR40ATw9ArzDf9h3v7t7",
  /** No clip at all — the "No sample yet" group. */
  nimbus: "e2e-nimbus",
} as const;

/**
 * Which committed clip each voice's `sample_url` resolves to. The mock server
 * reads this; nothing else needs to know that two voices can share a file.
 */
export const SAMPLE_CLIP_BY_VOICE: Record<string, SampleClip> = {
  [MOCK_VOICE_IDS.onyx]: "onyx",
  [MOCK_VOICE_IDS.rowan]: "onyx",
  [MOCK_VOICE_IDS.alloy]: "alloy",
  [MOCK_VOICE_IDS.paolaMultilingual]: "alloy",
  [MOCK_VOICE_IDS.paolaLegacy]: "addison",
  [MOCK_VOICE_IDS.addison]: "addison",
};

const everyday = (
  voice: Pick<MockVoice, "id" | "name" | "gender" | "description"> &
    Partial<MockVoice>
): MockVoice => ({
  provider_voice_id: voice.id,
  price: 0.015,
  price_per_thousand_chars_in_usd: 0.015,
  price_per_thousand_chars_in_credits: 50,
  powered_by: "OpenAI",
  default: false,
  model: "gpt-4o-mini-tts",
  languages: EVERYDAY_LANGUAGES,
  accent: "en-US",
  featured: false,
  section: "everyday",
  recommended: false,
  language: null,
  sibling_id: null,
  deprecated: false,
  availability: "available",
  chars_per_minute: null,
  ...voice,
});

const hd = (
  voice: Pick<MockVoice, "id" | "name" | "gender" | "description"> &
    Partial<MockVoice>
): MockVoice => ({
  provider_voice_id: voice.id,
  price: 0.3,
  price_per_thousand_chars_in_usd: 0.3,
  price_per_thousand_chars_in_credits: 1000,
  powered_by: "ElevenLabs",
  default: false,
  model: null,
  languages: HD_LANGUAGES,
  accent: "en-US",
  featured: false,
  section: "hd",
  recommended: false,
  language: null,
  sibling_id: null,
  deprecated: false,
  availability: "available",
  chars_per_minute: null,
  ...voice,
});

/**
 * Server order, which is NOT rail order: the rail sorts by pitch, so serving
 * the catalog in a deliberately unsorted order is what makes the ordering
 * assertion mean something. HD first, then everyday — exactly how the live
 * endpoint returns it.
 */
export const MOCK_VOICE_CATALOG: MockVoice[] = [
  hd({
    id: MOCK_VOICE_IDS.addison,
    name: "Addison",
    gender: "F",
    description: "Bright, quick and upbeat",
    sample_url: sampleUrl(MOCK_VOICE_IDS.addison, "e2e0001"),
    featured: true,
    recommended: true,
  }),
  // The twins. Same name, same description — so the studio cannot tell them
  // apart by prose and must fall back to the language count (#474). Keep the
  // descriptions identical if you edit them, or this case silently stops
  // covering what it exists to cover.
  hd({
    id: MOCK_VOICE_IDS.paolaMultilingual,
    name: "Paola",
    gender: "F",
    description: "Expressive and warm.",
    languages: HD_LANGUAGES,
    sample_url: sampleUrl(MOCK_VOICE_IDS.paolaMultilingual, "e2e0002"),
    featured: true,
  }),
  hd({
    id: MOCK_VOICE_IDS.paolaLegacy,
    name: "Paola",
    gender: "F",
    description: "Expressive and warm.",
    languages: HD_LANGUAGES_LEGACY,
    sample_url: sampleUrl(MOCK_VOICE_IDS.paolaLegacy, "e2e0003"),
  }),
  everyday({
    id: MOCK_VOICE_IDS.onyx,
    name: "Onyx",
    gender: "M",
    description: "Deep, unhurried and grounded",
    sample_url: sampleUrl(MOCK_VOICE_IDS.onyx, "e2e0004"),
  }),
  everyday({
    id: MOCK_VOICE_IDS.alloy,
    name: "Alloy",
    gender: "F",
    description: "Warm, balanced and conversational",
    sample_url: sampleUrl(MOCK_VOICE_IDS.alloy, "e2e0005"),
  }),
  // Uncurated names (no client-side tagline in VoiceIdentity.ts), so their
  // SERVER description is what renders on the row — which makes them the only
  // rows whose subtitle length this file controls, and therefore the subjects
  // of any "descriptions are never truncated" assertion.
  //
  // Length is calibrated, not arbitrary. The description column is ~227 px at
  // the settings page's fixed content width, which fits ~36 characters of this
  // 12 px face; the longest English tagline is 29 ("Easy, conversational
  // American") and the longest description the live catalog serves is 42, which
  // already ellipsises. These two sit at 27 and 29 — long enough that a
  // regression narrowing the column (the IN USE badge once did exactly that)
  // truncates them, short enough that a wider font on a CI runner does not.
  everyday({
    id: MOCK_VOICE_IDS.rowan,
    name: "Rowan",
    gender: "M",
    description: "Low, gravelly and unhurried",
    sample_url: sampleUrl(MOCK_VOICE_IDS.rowan, "e2e0006"),
  }),
  everyday({
    id: MOCK_VOICE_IDS.nimbus,
    name: "Nimbus",
    gender: "F",
    description: "Airy and light, softly spoken",
    // No sample_url at all — the whole point of this entry.
  }),
];

/**
 * The rail's order once every print has resolved: ascending by pitch, then the
 * clipless tail. Exported so a spec asserts against a stated expectation rather
 * than re-deriving the sort it is meant to be testing.
 *
 * Measured (browser `OfflineAudioContext`, matching this repo's extractor):
 * Rowan 91.0 → Onyx 92.2 (seed kept) → Paola/33 132.5 → Alloy 134.5 (seed
 * kept) → Paola/12 259.0 → Addison 260.2 (seed kept). Each unseeded voice
 * lands just below the seeded voice it shares a clip with, because a seed
 * within one semitone of the measurement wins — which is the anti-reorder rule
 * doing exactly what it was built for.
 */
export const EXPECTED_RAIL_ORDER: string[] = [
  MOCK_VOICE_IDS.rowan,
  MOCK_VOICE_IDS.onyx,
  MOCK_VOICE_IDS.paolaMultilingual,
  MOCK_VOICE_IDS.alloy,
  MOCK_VOICE_IDS.paolaLegacy,
  MOCK_VOICE_IDS.addison,
  // Below the rule: no clip, no pitch, no place in the chart.
  MOCK_VOICE_IDS.nimbus,
];

/** Voices with a clip — the denominator of `N of M heard`, `Play all` and the sweep. */
export const AUDITIONABLE_VOICE_IDS: string[] = MOCK_VOICE_CATALOG.filter(
  (voice) => !!voice.sample_url
).map((voice) => voice.id);
