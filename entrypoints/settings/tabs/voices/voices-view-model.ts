import type { SpeechSynthesisVoiceRemote } from "../../../../src/tts/SpeechModel";
import type { ChatbotId } from "../../../../src/chatbots/ChatbotIdentifier";
import {
  HostPinOverlay,
  resolvePinnedIds,
  serverFeaturedIds,
} from "../../../../src/tts/VoicePins";
import {
  CLAUDE_MENU_CAP,
  curateShortlist,
  visibleCatalog,
} from "../../../../src/tts/VoiceCuration";

/**
 * The Voices studio's DOM-free half: host scope, and everything one paint of a
 * host's studio needs, derived from that host's cached data.
 *
 * Extracted from voices-controller.ts unchanged. It was always pure — it takes
 * a host id and a data bag and returns a plain object — but living inside the
 * controller meant every assertion about pin resolution, twin-name strategy or
 * menu seating had to be made through rendered DOM. Here it can be exercised
 * directly, and the controller shrinks to painting + behaviour.
 */

/**
 * The hosts with a SayPi voice picker. ChatGPT is a deliberate non-goal (it
 * uses OpenAI's native read-aloud — doc/plans/2026-07-02-voice-selection-ux.md §3).
 */
export type VoiceHostId = Extract<ChatbotId, "pi" | "claude">;

/**
 * The studio's hosts, in switcher order. Host-generic: a third host (once
 * SayPi TTS reaches it) is one more line here, not a schema change — pins,
 * curation, and the deep link all key on the host id.
 */
export const VOICE_HOSTS: ReadonlyArray<{
  id: VoiceHostId;
  label: string;
  logo: string;
  /**
   * How many voices the host's IN-CHAT menu seats, or undefined when the host
   * has no in-chat voice menu at all.
   *
   * This is what makes the shortlist meaningful: the section exists to curate
   * scarcity — a small, fixed number of seats the user must choose between.
   * Pi retired its in-chat voice menu on 2026-07-30 (#573), moving voice choice
   * to its settings page, so on Pi there is no scarcity to manage and nowhere
   * for a pin to show up. Omitting the cap hides the whole shortlist concept
   * (section, pin toggles, overflow note) rather than relabelling a control
   * that would do nothing.
   */
  menuCap?: number;
  /**
   * Does this assistant speak on its own, with no voice of ours selected?
   *
   * Decides what the control bar says when nothing here is in use: Pi answers
   * in her own voice, Claude says nothing at all. Declared rather than derived
   * from the catalog — the API does not mark a host's built-ins `default` in
   * practice, so `hasBuiltins` is false even on Pi and reading it here got the
   * sentence backwards on the live host. `voices-view-model.spec` pins this
   * against `audioProviders.getDefaultForChatbot`, which is the audio layer's
   * own answer to the same question.
   */
  hasOwnVoice: boolean;
}> = [
  { id: "pi", label: "Pi", logo: "/icons/logos/pi.png", hasOwnVoice: true },
  {
    id: "claude",
    label: "Claude",
    logo: "/icons/logos/claude.png",
    menuCap: CLAUDE_MENU_CAP,
    hasOwnVoice: false,
  },
];

/** Last-viewed studio host, so reopening settings lands where you left off. */
export const LAST_HOST_KEY = "saypi.settings.voicesHost";

export interface HostStudioData {
  voices: SpeechSynthesisVoiceRemote[];
  current: SpeechSynthesisVoiceRemote | null;
  overlay: HostPinOverlay | null;
  /** The voices fetch itself failed (network/API) — distinct from empty. */
  failed: boolean;
  /** A saved choice exists but cannot currently be resolved from the catalog. */
  unavailable?: boolean;
}

/** Everything one paint needs, derived fresh from a host's cached data. */
export interface StudioViewModel {
  host: (typeof VOICE_HOSTS)[number];
  /** Selectable catalog: visible (deprecation-aware), minus host built-ins. */
  catalog: SpeechSynthesisVoiceRemote[];
  /** Host-owned built-ins exist (e.g. Pi's) — they get a note, not cards. */
  hasBuiltins: boolean;
  unavailable: boolean;
  currentId: string | null;
  /**
   * The voice the stage announces: the FRESH catalog entry for the current
   * id when one exists (the stored preference can be a stale snapshot from
   * before sample_url/languages existed), else the stored voice itself
   * (built-ins and grandfathered voices aren't in the catalog).
   */
  stagedCurrent: SpeechSynthesisVoiceRemote | null;
  featuredIds: string[];
  /** The resolved pin set (server defaults ⊕ user overlay). */
  pinned: Set<string>;
  /**
   * The host's in-chat menu, or null when the host has none (Pi). Null is the
   * single signal every menu-dependent affordance keys off, so a menu-less host
   * can't render half a shortlist.
   */
  menu: {
    cap: number;
    /** The literal in-chat menu, in true order. */
    seated: SpeechSynthesisVoiceRemote[];
    /** Pins that exist but don't fit the menu cap (legacy overflow). */
    overflowCount: number;
    /** current + pins have consumed every seat — no room to pin more. */
    full: boolean;
  } | null;
  /**
   * Display names appearing more than once (the twin-Paola problem, #474),
   * mapped to how the studio differentiates that whole GROUP. Group-level, not
   * per-voice: a per-voice rule can land one twin on a language count and the
   * other on a server description — non-parallel again, just differently.
   */
  dupNames: Map<string, DupStrategy>;
}

/**
 * How a set of same-named voices is told apart (#474).
 * - "description": every twin carries its own distinct server description —
 *   parallel AND the most informative pair the payload can give.
 * - "languages": no such descriptions, but every twin has a DIFFERENT language
 *   count — the same sentence with a different number, parallel in a weaker
 *   register.
 * - "description" is also the fallback when neither holds: description-first
 *   per voice, which is non-parallel but at least tells the rows apart.
 */
export type DupStrategy = "languages" | "description";

/** How many languages the server says a voice speaks (0 when it didn't say). */
export const languageCount = (voice: SpeechSynthesisVoiceRemote): number =>
  voice.languages?.length ?? 0;

const describedAs = (voice: SpeechSynthesisVoiceRemote): string =>
  (voice.description ?? "").trim();

const allDistinct = (values: (string | number)[]): boolean =>
  new Set(values).size === values.length;

/**
 * Pick the differentiator for one group of same-named voices (#474).
 *
 * Order matters, and it is an order of usefulness, not of preference for a
 * data shape: distinct descriptions say something about how the voices differ;
 * distinct counts merely differ. A tie in either is disqualifying — two cards
 * printing the identical sentence differentiate nothing, which is worse than
 * the non-parallel fallback.
 */
function dupStrategyFor(
  name: string,
  group: SpeechSynthesisVoiceRemote[]
): DupStrategy {
  const descriptions = group.map(describedAs);
  if (descriptions.every(Boolean) && allDistinct(descriptions))
    return "description";

  const counts = group.map(languageCount);
  if (counts.every((n) => n > 1) && allDistinct(counts)) return "languages";

  // Neither axis separates the twins in the same register: the payload has
  // gone thinner than #474 assumed (a missing `languages`, or twins the server
  // reports identically). Say so rather than silently going non-parallel.
  console.warn(
    `Voice name "${name}" is shared by ${group.length} voices with no parallel differentiator (descriptions: ${JSON.stringify(descriptions)}, language counts: ${JSON.stringify(counts)}); falling back to description-first subtitles (#474).`
  );
  return "description";
}

export const escapeCss = (value: string) =>
  typeof CSS !== "undefined" && CSS.escape
    ? CSS.escape(value)
    : value.replace(/["\\]/g, "\\$&");

export function viewModel(
  hostId: VoiceHostId,
  data: HostStudioData
): StudioViewModel {
  const host = VOICE_HOSTS.find((h) => h.id === hostId)!;
  const currentId = data.current?.id ?? null;
  const visible = visibleCatalog(data.voices, currentId);
  // Host-owned built-ins (e.g. Pi's native voices) are always in that
  // host's menu and never pinnable — the studio notes them, not cards them.
  const catalog = visible.filter((voice) => !voice.default);
  const hasBuiltins = visible.length > catalog.length;
  const stagedCurrent = currentId
    ? visible.find((voice) => voice.id === currentId) ?? data.current
    : null;

  const featuredIds = serverFeaturedIds(catalog);
  const customized = data.overlay !== null;
  const pinned = customized
    ? resolvePinnedIds(featuredIds, data.overlay)
    : new Set(featuredIds);
  // Hosts with no in-chat menu skip the shortlist entirely. Any stale pins in
  // the overlay stay untouched — inert data, restorable if the host ever
  // reinstates a menu — they simply have nowhere to be shown.
  const menu =
    host.menuCap === undefined
      ? null
      : (() => {
          const cap = host.menuCap;
          const shortlist = curateShortlist(
            catalog,
            currentId,
            cap,
            customized ? pinned : null
          );
          const seatedIds = new Set(shortlist.voices.map((v) => v.id));
          const catalogIds = new Set(catalog.map((v) => v.id));
          const overflowCount = [...pinned].filter(
            (id) => catalogIds.has(id) && !seatedIds.has(id)
          ).length;
          // "Full" counts committed seats only (current + pins) — fill-to-cap
          // suggestions on an un-customized host must never block pinning.
          const committedSeats = shortlist.voices.filter(
            (voice) => voice.id === currentId || pinned.has(voice.id)
          ).length;
          return {
            cap,
            seated: shortlist.voices,
            overflowCount,
            full: committedSeats >= cap,
          };
        })();

  // Twin display names (#474). The names themselves stay identical — the
  // only suffix the payload would support is a model name, which /voices
  // never serves — so the subtitle is the sole differentiator, and it is
  // decided once per name group so both twins read in the same register.
  const byName = new Map<string, SpeechSynthesisVoiceRemote[]>();
  catalog.forEach((voice) => {
    const name = String(voice.name ?? "").toLowerCase();
    const group = byName.get(name);
    if (group) group.push(voice);
    else byName.set(name, [voice]);
  });
  const dupNames = new Map<string, DupStrategy>();
  byName.forEach((group, name) => {
    if (group.length < 2) return;
    dupNames.set(name, dupStrategyFor(name, group));
  });

  return {
    host,
    catalog,
    hasBuiltins,
    unavailable: data.unavailable ?? false,
    currentId,
    stagedCurrent,
    featuredIds,
    pinned,
    menu,
    dupNames,
  };
}

export function resolveInitialHost(hint?: string | null): VoiceHostId {
  const valid = (value: unknown): value is VoiceHostId =>
    VOICE_HOSTS.some((host) => host.id === value);
  if (valid(hint)) return hint;
  try {
    const stored = localStorage.getItem(LAST_HOST_KEY);
    if (valid(stored)) return stored;
  } catch {
    // fall through to the default host
  }
  return VOICE_HOSTS[0].id;
}
