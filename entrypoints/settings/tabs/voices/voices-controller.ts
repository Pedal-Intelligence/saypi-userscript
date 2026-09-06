import getMessage from "../../../../src/i18n";
import { audioProviders, SpeechSynthesisVoiceRemote } from "../../../../src/tts/SpeechModel";
import { SpeechSynthesisModule } from "../../../../src/tts/SpeechSynthesisModule";
import { UserPreferenceModule } from "../../../../src/prefs/PreferenceModule";
import { getJwtManagerSync } from "../../../../src/JwtManager";
import {
  HostPinOverlay,
  loadHostOverlay,
  setVoicePinned,
  togglePin,
} from "../../../../src/tts/VoicePins";
import { getVoiceTier } from "../../../../src/tts/VoiceCuration";
import { getVoiceIdentity } from "../../../../src/tts/VoiceIdentity";
import { pitchOf } from "../../../../src/tts/VoicePitch";
import {
  isHeard,
  loadHeardStore,
  markHeardAt,
  recordVoiceHeard,
  type VoiceHeardStore,
} from "../../../../src/tts/VoiceHeard";
import { defaultLocalStorage } from "../../../../src/storage/localKeyStorage";
import {
  DupStrategy,
  escapeCss,
  HostStudioData,
  languageCount,
  LAST_HOST_KEY,
  resolveInitialHost,
  StudioViewModel,
  viewModel,
  VOICE_HOSTS,
  VoiceHostId,
} from "./voices-view-model";
import {
  AuditionItem,
  AuditionState,
  AUDITION_BEAT_MS,
  IDLE_AUDITION,
  PreviewSequencer,
} from "./previewSequencer";
import {
  gainFor,
  prefersReducedData,
  VoicePrint,
  VoicePrintLoader,
} from "../../../../src/tts/voicePrint";
import {
  createPrintSvg,
  paintPrintTrace,
  printInk,
  PRINT_WIDTHS,
} from "./voicePrintRender";

export type { VoiceHostId } from "./voices-view-model";

/**
 * The permanent escape hatch for anyone who finds focus-plays hostile
 * (design §3). `chrome.storage.local`, absence means ON.
 */
export const VOICES_ARROW_AUDITION_KEY = "voicesArrowAudition";

/** How long a type-ahead buffer survives between keystrokes. */
const TYPE_AHEAD_MS = 800;

/**
 * The id every HD row's `aria-describedby` points at — one hidden sentence for
 * the whole rail rather than one per row, because it is the same fact about the
 * same tier and duplicating it 10 times is 10 nodes a reader can land on.
 */
const HD_NOTE_ID = "voice-hd-note";

/**
 * Which slice of the catalog the rail is showing — the `Show:` control
 * (design §4/§10). Deliberately not persisted: a filter you cannot see the
 * effect of is a list that lies about being the catalog, and unlike the arrow-
 * audition toggle this one has no permanent-preference character. It resets
 * with the tab, exactly like the sweep.
 */
export type VoiceFilter = "all" | "unheard" | "hd" | "everyday";

/**
 * `Play all` refuses above this many voices (design §10). Not a technical
 * limit — the sequencer would happily walk 100 — but the point past which
 * "listen to all of them" stops being a gesture and becomes a commitment, and
 * the moment the `Show:` filter is the better answer.
 */
export const PLAY_ALL_MAX = 25;

/**
 * How long one voice occupies a sweep: the catalog's median sample clip
 * (measured 1.11–2.90 s, design §0) plus the beat the sequencer leaves between
 * clips. Only ever used to say roughly how long a refused sweep WOULD take, so
 * a median beats a mean — one long clip must not inflate the estimate.
 */
export const SWEEP_CLIP_SECONDS = 2.0;

/**
 * Roughly how many minutes a sweep of `count` voices would take, floored at 1.
 *
 * Whole minutes, and never zero: the refusal only fires above PLAY_ALL_MAX, so
 * the smallest number this can be asked about is 26 voices ≈ 1 minute. The
 * string it feeds says "min", not "minutes", precisely because that case is the
 * common one and Chrome i18n has no plural forms.
 */
export function sweepMinutes(count: number): number {
  const seconds = count * (SWEEP_CLIP_SECONDS + AUDITION_BEAT_MS / 1000);
  return Math.max(1, Math.round(seconds / 60));
}

export interface VoiceStudioDeps {
  getVoices(host: VoiceHostId): Promise<SpeechSynthesisVoiceRemote[]>;
  getVoice(host: VoiceHostId): Promise<SpeechSynthesisVoiceRemote | null>;
  setVoice(voice: SpeechSynthesisVoiceRemote, host: VoiceHostId): Promise<void>;
  unsetVoice?(host: VoiceHostId): Promise<void>;
  hasVoice?(host: VoiceHostId): Promise<boolean>;
  onVoiceChange?(fn: () => void): () => void;
  isAuthenticated(): boolean;
  /**
   * Play the voice's free canned sample clip (design §4), replacing whatever
   * is playing. No-op for voices without a sample.
   *
   * `onState` is a SUBSCRIPTION, not a one-shot: it receives every audition
   * snapshot until the next `playPreview` call supersedes it. Widened from the
   * shipped `(playing: boolean)` per-voice line, which could only say "this
   * voice, on/off" — so a superseded clip's terminal event wrote into the new
   * voice's UI, and a repaint had nothing to restore itself from.
   */
  playPreview(
    voice: SpeechSynthesisVoiceRemote,
    onState: (state: AuditionState) => void,
    /**
     * Per-clip level match, `<audio>.volume`, attenuate-only (design §5.1).
     * The rail computes it from the voice's measured print, and passes 1 when
     * the print has not resolved yet — a level match must never delay the
     * audio.
     */
    gain?: number
  ): void;
  /**
   * Walk a whole queue of clips at the sequencer's beat — `▶ Play all`
   * (design §4).
   *
   * Its own entry point rather than a widened `playPreview`, because the two
   * are different gestures the page reports differently: one audition is
   * silent about its position and leaves the compare pair alone, a sweep shows
   * `6 of 22` and a `Stop`. Both land on the same sequencer, which is what
   * makes "click a row mid-sweep cancels the sweep" free — the session token
   * does the cancelling.
   *
   * Optional: a studio with no player wired renders no `Play all` at all
   * rather than a control that would do nothing.
   */
  playSequence?(
    items: AuditionItem[],
    onState: (state: AuditionState) => void
  ): void;
  /**
   * Silence whatever is sounding. `Space` on the playing row and `Esc` both
   * need it; optional, because a studio with no player wired (most unit tests)
   * has nothing to stop.
   */
  stopPreview?(): void;
  /**
   * Measure (or recall) the voice's soundprint — the mark drawn from its own
   * sample clip. Optional, and absent means "this rail draws no prints":
   * jsdom cannot decode audio at all, so the tests that do not care simply
   * leave it out rather than mocking a decoder.
   */
  loadPrint?(voice: SpeechSynthesisVoiceRemote): Promise<VoicePrint | null>;
  /**
   * What this profile has already listened to (design §8). Optional: a studio
   * with no store wired draws every print at the never-heard density, which is
   * exactly what a first visit looks like.
   */
  loadHeard?(): Promise<VoiceHeardStore>;
  /**
   * Subscribe to QUALIFYING PLAYS — a clip that actually sounded for long
   * enough, as opposed to a button that was clicked.
   *
   * The sequencer is the only honest emitter of this (design §8), which is why
   * it is a subscription rather than something the rail decides for itself:
   * the state line fires identically for pause, ended and error, so a caller
   * watching playback literally cannot tell why a clip stopped — and clicking
   * a row is not hearing a voice. Persisting the mark belongs to the same
   * seam, so the rail never touches storage for it.
   */
  onHeard?(fn: (voiceId: string) => void): () => void;
  /** Does walking the rail with the arrow keys audition? (design §3) */
  loadArrowAudition?(): Promise<boolean>;
  setArrowAudition?(on: boolean): Promise<void>;
  /** The user's pin overlay for a host, or null when un-customized. */
  loadPins(host: VoiceHostId): Promise<HostPinOverlay | null>;
  /** Pin/unpin a voice for a host (featuredIds = that host's default pins). */
  setPinned(
    host: VoiceHostId,
    voiceId: string,
    featuredIds: string[],
    pin: boolean
  ): Promise<void>;
}

// The settings page is its own document — no content-script audio-output
// machine, no live TTS, no active call to collide with — so auditions play
// through one page-level sequencer. Built lazily, so importing this module
// never creates media elements, and kept at module scope so a re-created
// studio (host switch, tab remount) doesn't orphan audio that is sounding.
let previewSequencer: PreviewSequencer | null = null;
let previewSubscription: (() => void) | null = null;
// Module-scoped for the same reason, plus one of its own: the print cache is
// the expensive thing on this page, and a host switch must not throw away the
// decodes it already paid for.
let printLoader: VoicePrintLoader | null = null;

/**
 * Hand a queue to the page's one sequencer, replacing whatever it was doing.
 *
 * One state line, handed to the newest requester. Safe now that the line
 * carries a snapshot naming the voice rather than a bare boolean — and it is
 * what makes an interruption free: `play()` bumps the session token, so the
 * cancelled sequence's outstanding continuations are already fenced out.
 */
function ensureSequencer(): PreviewSequencer {
  if (!previewSequencer) previewSequencer = new PreviewSequencer();
  return previewSequencer;
}

function auditionThrough(
  items: AuditionItem[],
  onState: (state: AuditionState) => void
): void {
  if (items.length === 0) return;
  previewSequencer = ensureSequencer();
  previewSubscription?.();
  previewSubscription = previewSequencer.subscribe(onState);
  previewSequencer.play(items);
}

// The settings page runs outside any host tab, so every preference call MUST
// carry an explicit chatbot id — the no-arg default resolves to "web" here.
function defaultDeps(): VoiceStudioDeps {
  const speech = SpeechSynthesisModule.getInstance();
  const prefs = UserPreferenceModule.getInstance();
  const storage = defaultLocalStorage();
  return {
    getVoices: (host) => speech.getVoices(host),
    getVoice: (host) =>
      prefs.getVoice(host) as Promise<SpeechSynthesisVoiceRemote | null>,
    setVoice: (voice, host) => prefs.setVoice(voice, host).then(() => {}),
    unsetVoice: (host) => prefs.unsetVoice(host),
    hasVoice: (host) => prefs.hasVoice(host),
    onVoiceChange: (fn) => {
      const listener = (changes: Record<string, chrome.storage.StorageChange>, area: string) => {
        if (area === "local" && changes.voicePreferences) fn();
      };
      chrome.storage.onChanged.addListener(listener);
      return () => chrome.storage.onChanged.removeListener(listener);
    },
    isAuthenticated: () => getJwtManagerSync().isAuthenticated(),
    // A single audition IS a one-item sequence — same queue, same beat, same
    // cancellation — so both entry points are this one call.
    playPreview: (voice, onState, gain = 1) => {
      if (!voice.sample_url) return;
      auditionThrough(
        [{ voiceId: voice.id, url: voice.sample_url, gain }],
        onState
      );
    },
    playSequence: (items, onState) => auditionThrough(items, onState),
    stopPreview: () => previewSequencer?.stop(),
    loadPrint: (voice) => {
      if (!voice.sample_url) return Promise.resolve(null);
      if (!printLoader) printLoader = new VoicePrintLoader();
      return printLoader.get(voice.id, voice.sample_url);
    },
    loadHeard: () => loadHeardStore(),
    // Straight off the sequencer, because it is the one thing that knows a
    // clip PLAYED. Persisted here rather than in the rail, and never awaited:
    // the ink is owed to the ear, not to storage, so the row inks in on the
    // same tick and a failed write costs nothing but a mark (VoiceHeard.ts).
    onHeard: (fn) =>
      ensureSequencer().onHeard((voiceId) => {
        void recordVoiceHeard(voiceId);
        fn(voiceId);
      }),
    // Absence means ON: the toggle only ever writes `false`, so a fresh
    // profile arrows-and-auditions without a storage round trip deciding it.
    loadArrowAudition: () =>
      storage.get(VOICES_ARROW_AUDITION_KEY).then((raw) => raw !== false),
    setArrowAudition: (on) =>
      storage.set(VOICES_ARROW_AUDITION_KEY, on).catch(() => {}),
    loadPins: (host) => loadHostOverlay(host),
    setPinned: (host, voiceId, featuredIds, pin) =>
      setVoicePinned(host, voiceId, featuredIds, pin),
  };
}

/** One painted row, and the little the keyboard needs to know about it. */
interface RailRow {
  voice: SpeechSynthesisVoiceRemote;
  /** DOM id — the `aria-activedescendant` target. */
  domId: string;
  /** Has a sample clip: auditionable, pitched, and inside the rail's counts. */
  playable: boolean;
  el: HTMLElement;
  /**
   * The fixed head of the row's accessible name: the voice, plus a twin's
   * disambiguator when it has one. Everything after it can change without a
   * repaint (a clip becomes heard mid-listen), so the name is composed rather
   * than written once — and this half is deliberately first, because two rows
   * announcing "Paola" is the regression this page has already had twice.
   */
  labelHead: string;
  /** The half that outlives a repaint but not a commit: `In use`. */
  labelTail: string[];
}

/**
 * The rail (doc/plans/2026-07-31-voices-audition-room-design.md).
 *
 * One host-scoped `role="listbox"` of 42 px rows, ordered deepest to
 * brightest by measured pitch, each drawn as its own soundprint against one
 * shared reference line. The page is four things: a heading row with the host
 * switcher, a sticky control bar, the rail, and one summary line.
 *
 * The keyboard is the primary interface, not a fallback: `Space` plays the
 * focused row, arrows walk (silently until the user has explicitly played
 * something — the arming rule), `⇧Space` plays the other half of the compare
 * pair without moving focus, `Enter` commits, `Esc` stops and disarms.
 */
export class VoicesController {
  private deps!: VoiceStudioDeps;
  private readonly injectedDeps?: VoiceStudioDeps;
  private renderToken = 0;
  private activeHost: VoiceHostId;
  private body: HTMLElement | null = null;
  /** The last audition snapshot — the rail's only playback truth. */
  private auditionState: AuditionState = IDLE_AUDITION;
  private cache = new Map<VoiceHostId, HostStudioData>();
  private loading = new Map<VoiceHostId, Promise<HostStudioData>>();

  // --- the rail's own state -------------------------------------------------

  private rows: RailRow[] = [];
  private rail: HTMLElement | null = null;
  private controls: HTMLElement | null = null;
  private focusIndex = 0;
  private currentReadToken = 0;
  private savingChoice = false;
  private choiceRefreshPending = false;
  private choiceMessage = "";
  private optionsOpen = false;
  private destroyed = false;
  private unsubscribeVoice: (() => void) | null = null;
  /**
   * Which voice focus is on, carried ACROSS repaints. `useVoice` rebuilds the
   * body from scratch, and landing the reader back at the top of a 22-row rail
   * because they chose a voice is the whole reason this is not derived.
   */
  private focusedVoiceId: string | null = null;
  /**
   * Has the reader gone anywhere on THIS host's rail yet?
   *
   * The settings page is the scroll container, so scrolling a row into view
   * scrolls the whole document — including the heading and the host switcher,
   * which §9 kept top-level precisely so "which assistant am I configuring" is
   * never a footnote. Centring the current voice on arrival (Marin is row 19
   * of 22, the shipped default) takes the tab heading, the subtitle, the
   * switcher and the app header off-screen before the user has touched
   * anything. So the first paint of a host places focus without travelling to
   * it; the `Your voice ↗` control, the first `Space` and the first arrow all
   * scroll it into view the moment the reader asks to go there.
   */
  private landed = false;
  /**
   * The reader has asked for this tab, and the rail owes them the keyboard.
   *
   * A CLAIM rather than a call, because `onShown()` almost always arrives
   * before there is a rail to focus: the settings shell activates the tab
   * synchronously, and `init()` is network-bound and deliberately not awaited.
   * So the claim is banked and honoured by the next paint — and dropped by
   * `onHidden`, or a late paint would reach across and pull focus out of the
   * tab the reader moved on to.
   */
  private wantsRailFocus = false;
  private renderedAuthenticated: boolean | null = null;
  /**
   * The arming rule (design §3). Arrow keys move focus silently until the user
   * has explicitly played something in this session; after that, focus
   * auditions. Buys screen-reader safety, autoplay sticky activation, and no
   * surprise audio on tab open.
   *
   * Note what does NOT arm it: taking DOM focus. Arriving on the tab is not
   * playing, and a rail that armed itself on arrival would ambush a screen
   * reader user with audio for doing nothing but opening a settings tab.
   */
  private armed = false;
  /** The persisted half of the same rule: off means arrows NEVER audition. */
  private arrowAudition = true;
  /**
   * Whether the rail has told the reader that ↑↓ have become audible.
   *
   * Arming is otherwise invisible except for a chip lighting up in a control
   * bar the reader may not be looking at — and what it changes is that the
   * arrow keys now make sound. That is worth one sentence, once: `unsaid` →
   * `due` the moment arrows actually go live, `due` → `said` on the first
   * status line that can carry it.
   */
  private armedNotice: "unsaid" | "due" | "said" = "unsaid";
  /**
   * Which playing voice's status line is carrying that sentence.
   *
   * LATCHED to a voice rather than announced and forgotten, because the live
   * region is re-derived on every repaint: a one-shot append would be undone
   * by the next unrelated pin toggle, and `announce()` writes on change — so
   * the reader would hear "Playing Onyx" a second time for no reason. While
   * the same voice is sounding, the line is a constant.
   */
  private armedNoticeFor: string | null = null;
  /**
   * The compare pair (design §4): the last two DISTINCT voices auditioned,
   * most recent first, seeded `[currentVoiceId, null]` so the first `↓`
   * `⇧Space` is incumbent-vs-challenger with zero setup.
   */
  private pair: [string | null, string | null] = [null, null];
  private pairHost: VoiceHostId | null = null;
  private typeAhead = "";
  private typeAheadAt = 0;
  /**
   * Is a `Play all` walking the list right now?
   *
   * Held here rather than inferred from the snapshot, because the snapshot
   * cannot tell the two apart: a single audition is a one-item sequence, so it
   * reports `running` and a `position` of `1 of 1` exactly as a sweep's first
   * step does. This flag is the difference between showing `6 of 22` + `Stop`
   * and showing nothing at all.
   */
  private sweeping = false;
  /** The sweep voice the page has already scrolled to — see `followSweep`. */
  private sweepFollowedId: string | null = null;
  /**
   * A `Play all` that was refused for being too long (design §10), remembered
   * only long enough to say so. Cleared by the next play or filter change —
   * the message is a reply to one press, not a state of the page.
   */
  private refusal: { count: number; minutes: number } | null = null;
  /** Which slice of the catalog the rail is showing (the `Show:` control). */
  private filter: VoiceFilter = "all";
  /**
   * What this profile has already heard (design §8) — the print's ink density,
   * the counter, the `Not yet heard` option and `Play new (N)` all read it.
   *
   * Held whole rather than as a set of ids so the rail and the persisted map
   * are updated through the same pure helper, cap and all.
   */
  private heardStore: VoiceHeardStore = {};
  private unsubscribeHeard: (() => void) | null = null;
  /**
   * Ids of the in-scope catalog's AUDITIONABLE voices, from the last paint.
   *
   * Catalog-wide on purpose: it is the population the heard filter's own
   * availability is decided over, and deciding that from the painted rows
   * would be circular — they are already narrowed by the answer.
   */
  private clipVoiceIds: string[] = [];
  /** Does this catalog carry both tiers? Only then is price an axis at all. */
  private tierFilter = false;
  /** Display names for everything the control bar might have to name. */
  private nameById = new Map<string, string>();
  /** The id order currently painted — the input to the reorder check. */
  private paintedOrder: string[] = [];
  private orderDirty = false;
  private settleTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Measured soundprints, by voice id. Host-independent on purpose: a voice is
   * literally the same clip file on both hosts, so switching host must not
   * re-decode a thing.
   */
  private prints = new Map<string, VoicePrint>();
  /**
   * Voices already asked for. A voice survives any number of repaints; it is
   * measured once. A voice that came back without a print stays in here
   * deliberately — a 404 clip must not be re-fetched every time its row is
   * redrawn.
   */
  private printsRequested = new Set<string>();
  /** Only near-viewport rows are measured; rebuilt with the body. */
  private printObserver: IntersectionObserver | null = null;
  /**
   * Which voice each observed row draws. The observer callback gets a DOM node
   * and needs the voice back; carrying the object avoids re-deriving it from
   * the catalog by id on every intersection. Weak, so a detached row from a
   * previous paint is collected with the node.
   */
  private readonly printTargets = new WeakMap<
    Element,
    SpeechSynthesisVoiceRemote
  >();

  constructor(
    private container: HTMLElement,
    deps?: VoiceStudioDeps,
    opts?: { initialHost?: string | null }
  ) {
    this.injectedDeps = deps;
    this.activeHost = resolveInitialHost(opts?.initialHost);
  }

  async init(): Promise<void> {
    // Resolved lazily so constructing the controller is side-effect-free.
    this.deps = this.injectedDeps ?? defaultDeps();
    const studio = this.container.querySelector<HTMLElement>("#voice-studio");
    if (!studio) return;
    this.mountSwitcher();
    studio.innerHTML = "";
    this.body = document.createElement("div");
    this.body.classList.add("voice-studio-body");
    studio.appendChild(this.body);
    document.addEventListener("visibilitychange", this.onVisibilityChange);
    document.addEventListener("keydown", this.onDocumentKeyDown);
    window.addEventListener("pagehide", this.onPageHide);
    // Both read before the first paint, and together: the chip is rendered by
    // the control bar, and a chip that flips a beat after the rail appears is a
    // chip nobody trusts — and the heard marks ARE the ink, so landing them
    // after the paint would darken half the rail under the reader's eyes.
    const [arrowAudition, heard] = await Promise.all([
      this.deps.loadArrowAudition?.() ?? Promise.resolve(true),
      this.deps.loadHeard?.() ?? Promise.resolve<VoiceHeardStore>({}),
    ]);
    this.arrowAudition = arrowAudition;
    this.heardStore = heard;
    this.unsubscribeHeard =
      this.deps.onHeard?.((voiceId) => this.onVoiceHeard(voiceId)) ?? null;
    await this.render();
    this.unsubscribeVoice = this.deps.onVoiceChange?.(this.onVoiceChange) ?? null;
    window.addEventListener("focus", this.onVoiceChange);
  }

  // --- leaving (design §5.2's interruption matrix) --------------------------

  /**
   * The Voices tab left the screen. Stop EVERYTHING — sequence or lone clip.
   *
   * The harder rule of the two, and deliberately so: unlike a hidden window,
   * where letting a 1.5 s clip finish is less startling than cutting it, a tab
   * switch takes the whole control bar with it. There is no longer a `Stop` on
   * screen, and no row inking to say what is sounding, so anything still
   * playing is audio with no controls — which is the complaint.
   */
  onHidden(): void {
    // Cancel any focus the rail was still owed. Click Voices, change your mind
    // and click About, and the paint that lands a second later must not pull
    // the keyboard out of the tab you are now reading.
    this.wantsRailFocus = false;
    this.stopAudition();
    this.updateControlBar();
  }

  // --- arriving -------------------------------------------------------------

  /**
   * The Voices tab is the one on screen, because the reader asked for it.
   *
   * This is what makes the design's headline claim true. The rail is a
   * `role="listbox"` with a roving `aria-activedescendant`, so it LOOKS
   * focused from its first paint — a `.focused` row, an active descendant, a
   * `tabIndex` of 0 — while DOM focus sits on the sidebar button that opened
   * the tab. `Space` then goes to the button and nothing sounds. Nothing in a
   * class-toggling tab switcher moves focus, and an inactive panel is
   * `display: none`, so the rail could not have taken focus earlier even if
   * it had tried.
   *
   * Idempotent and re-entrant: coming back to the tab claims focus again, and
   * lands wherever the reader left off rather than at the top, because
   * `focusedVoiceId` survives.
   */
  onShown(): void {
    this.wantsRailFocus = true;
    this.claimRailFocus();
    void this.refreshCurrentVoice();
  }

  private readonly onVoiceChange = (): void => {
    void this.refreshCurrentVoice();
  };

  /** Refresh the choice, keeping the expensive catalog and sample cache. */
  private async refreshCurrentVoice(): Promise<void> {
    const host = this.activeHost;
    const data = this.cache.get(host);
    if (!data || this.destroyed) return;
    if (this.savingChoice) {
      this.choiceRefreshPending = true;
      return;
    }
    const token = ++this.currentReadToken;
    try {
      const [current, saved] = await Promise.all([
        this.deps.getVoice(host), this.deps.hasVoice?.(host) ?? Promise.resolve(false),
      ]);
      if (token !== this.currentReadToken || this.destroyed) return;
      const unavailable = saved && !current;
      if ((data.current?.id ?? null) === (current?.id ?? null) && !!data.unavailable === unavailable &&
        this.renderedAuthenticated === this.deps.isAuthenticated()) return;
      data.current = current;
      data.unavailable = unavailable;
      if (host === this.activeHost) {
        this.choiceMessage = "";
        this.paintBody(host, data);
      }
    } catch {
      // A temporary read failure gives no new information about the choice.
    }
  }

  /**
   * Hand the rail the keyboard, if it is still owed and there is a rail.
   *
   * `preventScroll`, plus the row's own `nearest` scroll: focusing the listbox
   * would otherwise scroll the page to the TOP of a 22-row element, which is
   * both a jump and the wrong place. `applyFocus` moves the minimum that makes
   * the row the reader is standing on visible — nothing at all when it already
   * is. That is the one difference between arriving and repainting: a repaint
   * (`landed`) never travels, because the reader did not ask to go anywhere,
   * and activating the tab is them asking.
   *
   * Only ever reached after a paint, since it needs a rail — which is why it
   * has nothing to say about `landed`.
   */
  private claimRailFocus(): void {
    if (!this.wantsRailFocus || !this.rail) return;
    this.wantsRailFocus = false;
    this.applyFocus({ block: "nearest" });
    this.rail.focus({ preventScroll: true });
  }

  /**
   * The window went to the background (minimised, or its space switched away).
   *
   * Stops the SEQUENCE and lets a lone clip finish: a minute of unattended
   * audio into a window nobody can see is the surprise-audio complaint, while
   * chopping one 1.5 s clip mid-word is more startling than letting it end.
   * The control bar is still on screen and still says `Stop`, which is exactly
   * what a tab switch takes away.
   *
   * Note what is NOT here: `blur`. On macOS the settings popup blurs on almost
   * any click — including clicks back into the chat window you are choosing a
   * voice for — so stopping on blur would make the feature feel broken.
   */
  private readonly onVisibilityChange = (): void => {
    if (document.visibilityState === "hidden") this.stopSequence();
    else void this.refreshCurrentVoice();
  };

  /** Belt and braces for settings-in-a-tab, where visibilitychange may not fire. */
  private readonly onPageHide = (): void => {
    this.stopAudition();
  };

  /**
   * `Esc` stops the audio (design §4) — from wherever focus happens to be.
   *
   * The rail owns the key while the listbox holds focus, and that is the only
   * keyboard the rail has. But `▶ Play all` is a SIBLING of the rail inside
   * the control bar, so a sweep started with the mouse leaves DOM focus on the
   * button — or, on the platforms that don't focus buttons on click, nowhere
   * at all — and Escape never traverses the listbox. A minute of audio with no
   * keyboard way to stop it is exactly what the design rules out, so the page
   * listens as well.
   *
   * The same `disarm()` the rail's own Esc runs — one meaning for the key —
   * but narrow about when it runs at all: only while something is actually
   * sounding, and only when the rail has not already claimed the press (its
   * handler calls preventDefault, so an Esc on the listbox never reaches
   * here). With nothing playing, Escape belongs to the rest of the settings
   * page and this listener leaves it alone.
   */
  private readonly onDocumentKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== "Escape" || event.defaultPrevented) return;
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (!this.auditionState.running && !this.sweeping) return;
    event.preventDefault();
    this.disarm();
  };

  /** Release the page-level listeners this studio installed. */
  destroy(): void {
    this.destroyed = true;
    this.currentReadToken++;
    this.unsubscribeVoice?.();
    this.unsubscribeVoice = null;
    window.removeEventListener("focus", this.onVoiceChange);
    this.wantsRailFocus = false;
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
    document.removeEventListener("keydown", this.onDocumentKeyDown);
    window.removeEventListener("pagehide", this.onPageHide);
    // The sequencer outlives this studio (module-scoped, so a host switch or a
    // tab remount never orphans sounding audio) — so a heard subscription left
    // behind would keep inking rows that no longer exist.
    this.unsubscribeHeard?.();
    this.unsubscribeHeard = null;
    this.stopAudition();
  }

  // --- host scope -----------------------------------------------------------

  /**
   * The switcher lives in the panel's heading row, not in the studio: host is
   * the scope for pins, the current voice and the deep link, so it stays a
   * top-level control rather than becoming a footnote (design §9).
   */
  private mountSwitcher(): void {
    const slot =
      this.container.querySelector<HTMLElement>("#voice-host-switcher") ??
      this.container.querySelector<HTMLElement>("#voice-studio");
    if (!slot) return;
    slot.innerHTML = "";
    slot.appendChild(this.renderSwitcher());
  }

  private renderSwitcher(): HTMLElement {
    const nav = document.createElement("div");
    nav.classList.add("voice-host-switcher");
    VOICE_HOSTS.forEach((host) => {
      const tab = document.createElement("button");
      tab.type = "button";
      tab.classList.add("voice-host-tab");
      tab.dataset.host = host.id;
      tab.setAttribute("aria-pressed", String(host.id === this.activeHost));
      const logo = document.createElement("img");
      logo.classList.add("voice-host-logo");
      logo.src = host.logo;
      logo.alt = "";
      logo.setAttribute("aria-hidden", "true");
      tab.appendChild(logo);
      tab.appendChild(document.createTextNode(host.label));
      tab.addEventListener("click", () => this.showHost(host.id));
      nav.appendChild(tab);
    });
    return nav;
  }

  private showHost(host: VoiceHostId): void {
    if (host === this.activeHost) return;
    this.activeHost = host;
    this.choiceMessage = "";
    this.container
      .querySelectorAll<HTMLButtonElement>(".voice-host-tab")
      .forEach((tab) =>
        tab.setAttribute("aria-pressed", String(tab.dataset.host === host))
      );
    try {
      localStorage.setItem(LAST_HOST_KEY, host);
    } catch {
      // Last-viewed host is a nicety; never let storage break the studio.
    }
    // The sequence's items are about to leave the screen (design §5.2), and
    // the new host has its own incumbent to focus and to seed the pair with.
    this.stopAudition();
    this.focusedVoiceId = null;
    this.landed = false;
    const revisit = this.cache.has(host);
    void this.render().then(() => {
      if (revisit && host === this.activeHost) return this.refreshCurrentVoice();
    });
  }

  /**
   * Gather the in-scope host's catalog + current voice + pin overlay and
   * paint. Per-host resilient: this host failing shows an error state here
   * and never touches another host's studio. A render token guards stale
   * async paints (switch hosts mid-fetch and the slow paint is dropped).
   */
  private async render(): Promise<void> {
    const token = ++this.renderToken;
    const host = this.activeHost;
    this.body?.classList.add("voice-studio-loading");
    const data = await this.ensureData(host);
    if (token !== this.renderToken || host !== this.activeHost) return;
    this.paintBody(host, data);
  }

  private async ensureData(host: VoiceHostId): Promise<HostStudioData> {
    const cached = this.cache.get(host);
    if (cached) return cached;
    let inFlight = this.loading.get(host);
    if (!inFlight) {
      inFlight = this.fetchHost(host);
      this.loading.set(host, inFlight);
    }
    const data = await inFlight;
    this.loading.delete(host);
    this.cache.set(host, data);
    return data;
  }

  private async fetchHost(host: VoiceHostId): Promise<HostStudioData> {
    let failed = false;
    const [voices, current, overlay, saved] = await Promise.all([
      this.deps.getVoices(host).catch(() => {
        failed = true;
        return [] as SpeechSynthesisVoiceRemote[];
      }),
      this.deps.getVoice(host).catch(() => null),
      this.deps.loadPins(host).catch(() => null),
      this.deps.hasVoice?.(host).catch(() => false) ?? Promise.resolve(false),
    ]);
    return { voices, current, overlay, failed, unavailable: saved && !current };
  }

  // --- painting -------------------------------------------------------------

  private paintBody(hostId: VoiceHostId, data: HostStudioData): void {
    if (!this.body) return;
    this.renderedAuthenticated = this.deps.isAuthenticated();
    const body = this.body;
    body.classList.remove("voice-studio-loading");
    body.dataset.host = hostId;
    // Everything in here is about to be destroyed, including whatever holds
    // DOM focus — and a rail you can no longer arrow is a rail that broke
    // when you pressed Enter on it.
    const active = document.activeElement;
    const keepFocus = !!active && body.contains(active);
    // …with one control that must get itself back rather than hand focus to
    // the rail: changing the `Show:` filter repaints the body, and a select
    // that jumps focus elsewhere the moment you use it cannot be used twice.
    const keepFilterFocus =
      keepFocus && !!active?.classList?.contains("voice-filter-select");
    // An observer still watching these rows would hold the detached nodes and
    // fire for a page that is gone.
    this.printObserver?.disconnect();
    this.printObserver = null;
    body.innerHTML = "";
    this.rows = [];
    this.rail = null;
    this.controls = null;

    const vm = viewModel(hostId, data);
    this.nameById = new Map(vm.catalog.map((voice) => [voice.id, voice.name]));
    if (vm.stagedCurrent) {
      this.nameById.set(vm.stagedCurrent.id, vm.stagedCurrent.name);
    }

    if (vm.catalog.length === 0 && !vm.hasBuiltins) {
      this.paintedOrder = [];
      this.controls = this.renderControlBar(vm);
      body.appendChild(this.controls);
      body.appendChild(this.renderEmptyState(vm, data));
      return;
    }

    this.seedPair(hostId, vm);

    // What the `Show:` control can offer, decided from the catalog rather than
    // from the rows (which are about to be narrowed by the answer).
    this.clipVoiceIds = vm.catalog
      .filter((voice) => !!voice.sample_url)
      .map((voice) => voice.id);
    // The same test VoiceCuration uses to decide whether price is even an axis
    // on this host: one tier alone is not a distinction.
    this.tierFilter = new Set(vm.catalog.map(getVoiceTier)).size > 1;

    // A filter the catalog no longer supports (a host switch to a single-tier
    // catalog, a server change, or `Not yet heard` once nothing is left
    // unheard) would leave the rail narrowed by a control that is no longer on
    // screen to widen it again — or, worse, empty.
    const chosen = this.filterOptions().find(
      (option) => option.value === this.filter
    );
    if (!chosen || chosen.disabled) this.filter = "all";

    // The HD description goes in before anything points at it: the rows are
    // built carrying `aria-describedby`, and a description that resolves to
    // nothing is a description a screen reader silently drops.
    const hdNote = this.renderHdNote(vm);

    // The rail is built FIRST, even though it paints second: the control bar
    // offers to jump to the current voice, and it can only honestly offer that
    // once it knows the current voice has a row (a host built-in does not).
    const rail = this.renderRail(vm);
    this.controls = this.renderControlBar(vm);
    if (hdNote) this.controls.appendChild(hdNote);
    body.appendChild(this.controls);
    body.appendChild(rail);
    const summary = this.renderMenuSummary(vm);
    if (summary) body.appendChild(summary);

    // Focus lands on the current voice — in its own pitch position, NOT pinned
    // to the top, because pinning it would break the chart the pitch order
    // creates — and stays wherever the reader left it across a repaint.
    const wanted = this.focusedVoiceId ?? vm.currentId;
    const at = this.rows.findIndex((row) => row.voice.id === wanted);
    this.focusIndex = at >= 0 ? at : 0;
    // `nearest`, never `center`, and not at all on arrival: a repaint is not a
    // navigation, and every one of them (choosing a voice, a late measurement
    // settling the order) would otherwise re-centre the page under the reader.
    this.applyFocus({ block: "nearest", scroll: this.landed });
    this.landed = true;

    // Playback state lives OUTSIDE the DOM — the sequencer owns it, and it
    // survives this repaint (choosing the voice you are listening to must not
    // stop the audio, design §5.2). Re-derive the rows from the snapshot, or
    // a clip goes on sounding with nothing on screen saying so.
    this.applyAuditionState();

    if (keepFilterFocus) {
      body
        .querySelector<HTMLSelectElement>(".voice-filter-select")
        ?.focus({ preventScroll: true });
    } else if (keepFocus) {
      rail.focus({ preventScroll: true });
    }
    // An arrival that got here before the catalog did — the usual case, since
    // the shell activates the tab long before this paint.
    this.claimRailFocus();
  }

  private renderEmptyState(
    vm: StudioViewModel,
    data: HostStudioData
  ): HTMLElement {
    // The catalog is PUBLIC (design §0: 22 voices with samples, no
    // credentials), so being signed out is not what empties this page — the
    // rail renders in full signed out, and `Use` writes a local preference.
    // This branch is only reached by a genuinely empty response, where a
    // signed-out user's most likely cause really is the 401 → [] path.
    const empty = document.createElement("div");
    empty.classList.add("voice-studio-empty");
    let key: string;
    let substitutions: string[] | undefined;
    if (!this.deps.isAuthenticated()) {
      key = "signInForTTS";
    } else if (data.failed) {
      key = "voicesLoadError";
      substitutions = [vm.host.label];
    } else {
      key = "voicesNoneAvailable";
    }
    // data-i18n ONLY on substitution-free text: the bootstrap's replaceI18n()
    // rewrites [data-i18n] textContent from the bare key, which would wipe
    // the host name out of substituted strings (the "In 's menu" defect).
    if (!substitutions) empty.setAttribute("data-i18n", key);
    empty.textContent = getMessage(key, substitutions);
    return empty;
  }

  // --- the control bar ------------------------------------------------------

  /** The choice leads; browsing options stay available without leading it. */
  private renderControlBar(vm: StudioViewModel): HTMLElement {
    const bar = document.createElement("div");
    bar.classList.add("voice-rail-controls");
    const current = document.createElement("div");
    current.className = "voice-current-choice voice-rail-controls-row";
    const scope = document.createElement("span");
    scope.className = "voice-current-host";
    scope.textContent = this.deps.isAuthenticated()
      ? getMessage("voicesSpeaksWith", [vm.host.label])
      : getMessage("signInForTTS");
    current.appendChild(scope);
    const currentHasRow = this.rows.some((row) => row.voice.id === vm.currentId);
    const selectedRemote = vm.stagedCurrent &&
      audioProviders.retreiveProviderByVoice(vm.stagedCurrent) === audioProviders.SayPi
      ? vm.stagedCurrent : null;
    if (selectedRemote && currentHasRow) {
      const jump = document.createElement("button");
      jump.type = "button";
      jump.className = "voice-your-voice";
      jump.textContent = selectedRemote.name;
      jump.setAttribute("aria-label", getMessage("voicesYourVoice", [selectedRemote.name]));
      jump.addEventListener("click", () => this.jumpToCurrent());
      current.appendChild(jump);
    } else if (selectedRemote) {
      const name = document.createElement("span");
      name.className = "voice-current-name";
      name.textContent = selectedRemote.name;
      current.appendChild(name);
    } else {
      scope.remove();
      current.appendChild(this.renderFallbackVoice(vm));
    }
    // The saved voice still resolves, but its provider is hard-down (#568).
    // Say so next to the name rather than removing the row: the user needs to
    // know why their voice has gone quiet, and that the fix is one pick away.
    if (selectedRemote && vm.currentUnavailable) {
      const note = document.createElement("span");
      note.className = "voice-current-unavailable";
      note.setAttribute("role", "status");
      note.dataset.i18n = "voicesSavedUnavailable";
      note.textContent = getMessage("voicesSavedUnavailable");
      current.appendChild(note);
    }
    if (vm.host.hasOwnVoice && this.deps.unsetVoice && (selectedRemote || vm.unavailable)) {
      const native = document.createElement("button");
      native.type = "button";
      native.className = "voice-native-return";
      native.textContent = getMessage("voicesUseNativeHost", [vm.host.label]);
      native.disabled = this.savingChoice;
      native.addEventListener("click", () => { void this.saveChoice(null); });
      current.appendChild(native);
    }
    bar.appendChild(current);

    const status = document.createElement("div");
    status.className = "voice-choice-status";
    status.textContent = this.choiceMessage;
    bar.appendChild(status);
    if (this.rows.length === 0) return bar;

    const hint = document.createElement("div");
    hint.className = "voice-rail-hint";
    bar.appendChild(hint);
    const playback = document.createElement("div");
    playback.className = "voice-rail-controls-row";
    if (this.deps.playSequence && this.playableRows().length > 0) {
      playback.appendChild(this.renderSweepButton());
      const position = document.createElement("span");
      position.className = "voice-sweep-position";
      playback.appendChild(position);
    }
    const compare = document.createElement("span");
    compare.className = "voice-compare";
    playback.appendChild(compare);
    const filterSlot = document.createElement("span");
    filterSlot.className = "voice-filter-slot";
    playback.appendChild(filterSlot);
    bar.appendChild(playback);

    const options = document.createElement("details");
    options.className = "voice-listening-options";
    options.open = this.optionsOpen;
    options.addEventListener("toggle", () => { this.optionsOpen = options.open; });
    const summary = document.createElement("summary");
    summary.textContent = getMessage("voicesListeningOptions");
    summary.dataset.i18n = "voicesListeningOptions";
    options.appendChild(summary);
    const tools = document.createElement("div");
    tools.className = "voice-rail-controls-row";
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "voice-arrow-chip";
    chip.dataset.i18n = "voicesArrowAudition";
    chip.textContent = getMessage("voicesArrowAudition");
    chip.addEventListener("click", () => this.toggleArrowAudition());
    tools.appendChild(chip);
    const heard = document.createElement("span");
    heard.className = "voice-heard-count";
    tools.appendChild(heard);
    options.appendChild(tools);
    const keys = document.createElement("p");
    keys.className = "voice-keyboard-help";
    keys.dataset.i18n = "voicesKeyboardHint";
    keys.textContent = getMessage("voicesKeyboardHint");
    options.appendChild(keys);
    bar.appendChild(options);
    return bar;
  }

  /**
   * `▶ Play all (N)` / `Stop` — one button, because it is one state with two
   * faces, and a separate Stop would be a dead control 99 % of the time.
   *
   * The label lives in an inner span: `replaceI18n()` sets `textContent` on
   * whatever carries `data-i18n`, which on the button itself would delete the
   * glyph beside it.
   */
  private renderSweepButton(): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("voice-play-all");
    const glyph = document.createElement("span");
    glyph.classList.add("voice-play-glyph");
    glyph.setAttribute("aria-hidden", "true");
    button.appendChild(glyph);
    const label = document.createElement("span");
    label.classList.add("voice-play-label");
    button.appendChild(label);
    button.addEventListener("click", () => this.toggleSweep());
    return button;
  }

  /**
   * The `Show:` filter. Only the options that would actually select something:
   * a "HD only" on a catalog with no HD voices is a control that empties the
   * page, and with fewer than two live options there is nothing to choose
   * between, so the whole control stays away.
   *
   * `Not yet heard` follows the same rule from both ends. It appears only once
   * something HAS been heard — before that it selects the entire rail, which
   * is what `All voices` already does — and once everything has been heard it
   * stays, disabled, because that is the page saying you are finished rather
   * than the option quietly vanishing (design §8).
   */
  private filterOptions(): {
    value: VoiceFilter;
    key: string;
    disabled?: boolean;
  }[] {
    const options: { value: VoiceFilter; key: string; disabled?: boolean }[] = [
      { value: "all", key: "voicesShowAll" },
    ];
    const heardIds = this.clipVoiceIds.filter((id) =>
      isHeard(this.heardStore, id)
    );
    if (heardIds.length > 0) {
      options.push({
        value: "unheard",
        key: "voicesShowUnheard",
        disabled: heardIds.length === this.clipVoiceIds.length,
      });
    }
    if (this.tierFilter) {
      options.push({ value: "hd", key: "voicesShowHd" });
      options.push({ value: "everyday", key: "voicesShowEveryday" });
    }
    return options;
  }

  /**
   * Put the current option set in the bar's filter slot, replacing whatever is
   * there — but never while the reader is holding the control open, which
   * would drop the menu out from under them. The next repaint picks it up.
   */
  private syncFilter(bar: HTMLElement): void {
    const slot = bar.querySelector<HTMLElement>(".voice-filter-slot");
    if (!slot) return;
    const options = this.filterOptions();
    const signature = options
      .map((option) => `${option.value}${option.disabled ? "-off" : ""}`)
      .join("|");
    if (slot.dataset.filterSignature === signature) return;
    const select = slot.querySelector<HTMLSelectElement>(
      ".voice-filter-select"
    );
    if (select && document.activeElement === select) return;
    slot.dataset.filterSignature = signature;
    slot.textContent = "";
    const control = this.renderFilter(options);
    if (control) slot.appendChild(control);
  }

  private renderFilter(
    options: { value: VoiceFilter; key: string; disabled?: boolean }[]
  ): HTMLElement | null {
    if (options.length < 2) return null;
    const label = document.createElement("label");
    label.classList.add("voice-filter");
    // ONE flex item for `Show:`, not two. `.voice-filter` is an inline-flex
    // with a 4px gap, and CSS wraps a bare ":" text node in an anonymous flex
    // item of its own — so the gap lands on both sides of it and an English UI
    // ships French spacing: `Show : All voices`. Wrapping keeps the colon
    // OUTSIDE the [data-i18n] element (whose textContent replaceI18n rewrites
    // from the bare key, punctuation and all) and inside one flex item.
    const wrap = document.createElement("span");
    wrap.classList.add("voice-filter-label");
    const text = document.createElement("span");
    text.setAttribute("data-i18n", "voicesShowLabel");
    text.textContent = getMessage("voicesShowLabel");
    wrap.appendChild(text);
    wrap.appendChild(document.createTextNode(":"));
    label.appendChild(wrap);
    const select = document.createElement("select");
    select.classList.add("voice-filter-select");
    options.forEach(({ value, key, disabled }) => {
      const option = document.createElement("option");
      option.value = value;
      if (disabled) option.disabled = true;
      option.setAttribute("data-i18n", key);
      option.textContent = getMessage(key);
      select.appendChild(option);
    });
    select.value = this.filter;
    select.addEventListener("change", () =>
      this.changeFilter(select.value as VoiceFilter)
    );
    label.appendChild(select);
    return label;
  }

  /**
   * Everything in the bar that changes without the rail changing: the chip's
   * lit state, the sweep's face and position, the hint line (which doubles as
   * the page's one non-modal message slot), and the compare readout, which
   * fills in as the reader walks.
   */
  private updateControlBar(): void {
    const bar = this.controls;
    if (!bar) return;
    const chip = bar.querySelector<HTMLButtonElement>(".voice-arrow-chip");
    if (chip) {
      chip.setAttribute("aria-pressed", String(this.arrowAudition));
      chip.classList.toggle("lit", this.arrowAudition && this.armed);
    }
    this.updateSweepControls(bar);
    this.updateHeardCount(bar);
    this.syncFilter(bar);
    this.updateHint(bar);
    const compare = bar.querySelector<HTMLElement>(".voice-compare");
    if (compare) this.updateCompareReadout(compare);
    const note = bar.querySelector<HTMLElement>(`#${HD_NOTE_ID}`);
    const focused = this.rows[this.focusIndex]?.voice;
    note?.classList.toggle("voice-filter-note", this.filter === "hd");
    note?.classList.toggle("voice-visually-hidden", this.filter !== "hd" && (!focused || getVoiceTier(focused) !== "hd"));
  }

  /**
   * How much of the rail you have actually listened to.
   *
   * Counted over the PAINTED, auditionable rows — the same population
   * `Play all (N)` walks — so narrowing with `Show:` narrows both together and
   * the two numbers beside each other on the bar can never contradict one
   * another. Voices with no clip are excluded from both, which is what stops
   * `6 of 12` from lying about a catalog with built-ins in it.
   */
  private heardTally(): { heard: number; total: number; unheard: RailRow[] } {
    const rows = this.playableRows();
    const unheard = rows.filter(
      (row) => !isHeard(this.heardStore, row.voice.id)
    );
    return { heard: rows.length - unheard.length, total: rows.length, unheard };
  }

  private updateHeardCount(bar: HTMLElement): void {
    const counter = bar.querySelector<HTMLElement>(".voice-heard-count");
    if (!counter) return;
    const { heard, total } = this.heardTally();
    // Nothing auditionable is not "0 of 0 heard" — it is a page with no
    // listening on it, and a zero-of-zero counter is a dead control.
    // No data-i18n: substituted text, which replaceI18n would erase.
    const text =
      total === 0
        ? ""
        : getMessage("voicesHeardCount", [String(heard), String(total)]);
    if (counter.textContent !== text) counter.textContent = text;
  }

  private updateSweepControls(bar: HTMLElement): void {
    const button = bar.querySelector<HTMLButtonElement>(".voice-play-all");
    if (button) {
      button.classList.toggle("sweeping", this.sweeping);
      const glyph = button.querySelector<HTMLElement>(".voice-play-glyph");
      if (glyph) glyph.textContent = this.sweeping ? "■" : "▶";
      const label = button.querySelector<HTMLElement>(".voice-play-label");
      if (label) {
        if (this.sweeping) {
          label.setAttribute("data-i18n", "voicesStopPlayback");
          label.textContent = getMessage("voicesStopPlayback");
        } else {
          const plan = this.sweepPlan();
          // Substituted text carries NO data-i18n: replaceI18n() would rewrite
          // it from the bare key on the next tab load and erase the count.
          label.removeAttribute("data-i18n");
          label.textContent = getMessage(
            plan.mode === "new" ? "voicesPlayNewN" : "voicesPlayAllN",
            [String(plan.rows.length)]
          );
        }
      }
    }
    const position = bar.querySelector<HTMLElement>(".voice-sweep-position");
    if (!position) return;
    // Only a sweep has a position worth showing. A single audition is a
    // one-item sequence and reports `1 of 1`, which is true and useless.
    const at = this.sweeping ? this.auditionState.position : null;
    position.textContent = at
      ? getMessage("voicesSweepPosition", [String(at.index), String(at.total)])
      : "";
  }

  /**
   * The bottom line of the bar: normally the keyboard hint, and otherwise the
   * page's ONE non-modal message slot (design §10).
   *
   * One slot rather than a toast, a banner or a dialog, because every message
   * it carries is about playback and the controls for playback are right here.
   * Blocked outranks a failed clip outranks a refused sweep: the first means
   * nothing will sound at all until you act, the second is about one voice,
   * and the third is about a button you already know you pressed.
   */
  private hintLine(): { text: string; i18nKey?: string; alert: boolean } {
    const error = this.auditionState.error;
    if (error?.kind === "blocked") {
      return {
        text: getMessage("voicesPlaybackBlocked"),
        i18nKey: "voicesPlaybackBlocked",
        alert: true,
      };
    }
    if (error?.kind === "failed") {
      return {
        text: getMessage("voicesSampleFailed", [this.nameOf(error.voiceId)]),
        alert: true,
      };
    }
    if (this.refusal) {
      return {
        text: getMessage("voicesTooManyToPlay", [
          String(this.refusal.count),
          String(this.refusal.minutes),
        ]),
        alert: true,
      };
    }
    return {
      text: getMessage("voicesListenHint"),
      i18nKey: "voicesListenHint",
      alert: false,
    };
  }

  private updateHint(bar: HTMLElement): void {
    const hint = bar.querySelector<HTMLElement>(".voice-rail-hint");
    if (!hint) return;
    const line = this.hintLine();
    if (line.i18nKey) hint.setAttribute("data-i18n", line.i18nKey);
    else hint.removeAttribute("data-i18n");
    // Only when it changes: `textContent =` replaces the text node, and this
    // runs on every arrow key. Rewriting an identical line 22 times down a
    // walk is churn a screen reader watching the subtree would have to filter.
    if (hint.textContent !== line.text) hint.textContent = line.text;
    hint.classList.toggle("voice-rail-hint-alert", line.alert);
  }

  /**
   * The live `⇄ Onyx ⟷ Coral` readout, PATCHED rather than rebuilt.
   *
   * Rebuilding it is the obvious implementation and it breaks the gesture the
   * readout exists to advertise: pressing the button calls `switchBack()`,
   * which auditions, which comes straight back here — so a rebuild removes the
   * element the user is standing on mid-activation, DOM focus falls to
   * `<body>`, and the next Tab restarts from the top of the settings document
   * instead of ping-ponging A/B/A/B. (`⇧Space` never noticed, because focus
   * stays on the listbox.) Patching in place keeps the node, so the button
   * flips its own label under the user's finger and stays focused.
   */
  private updateCompareReadout(compare: HTMLElement): void {
    const [near, far] = this.pair;
    let swap = compare.querySelector<HTMLButtonElement>(".voice-compare-swap");
    // Nothing to switch back TO yet — and a control that would do nothing is
    // worse than one that has not appeared.
    //
    // Both halves are checked against the PAINTED rail, not just against the
    // pair, because `Show:` can take either of them off the screen: narrowing
    // to `HD only` (or to `Not yet heard`, once both have been heard) leaves
    // two perfectly good ids in the pair and no row for switchBack() to find,
    // so the bar would go on offering "Switch back to Onyx" over a gesture
    // that bails silently — the exact dead control seedPair guards its own
    // entry point against. The pair itself is untouched: widen the filter and
    // the offer comes straight back.
    const nearRow = this.playableRowFor(near);
    const farRow = this.playableRowFor(far);
    if (!nearRow || !farRow) {
      swap?.remove();
      return;
    }
    if (!swap) {
      swap = document.createElement("button");
      swap.type = "button";
      swap.classList.add("voice-compare-swap");
      // Glyph text, deliberately untranslated: names are proper nouns and
      // `⇄`/`⟷` are glyphs (design §13).
      const glyph = document.createElement("span");
      glyph.setAttribute("aria-hidden", "true");
      glyph.classList.add("voice-compare-glyph");
      glyph.textContent = "⇄";
      swap.appendChild(glyph);
      const names = document.createElement("span");
      names.classList.add("voice-compare-names");
      swap.appendChild(names);
      swap.addEventListener("click", () => this.switchBack());
      compare.appendChild(swap);
    }
    swap.setAttribute(
      "aria-label",
      getMessage("voicesSwitchBackTo", [this.nameOf(farRow.voice.id)])
    );
    const names = swap.querySelector<HTMLElement>(".voice-compare-names");
    if (names) {
      names.textContent = `${this.nameOf(nearRow.voice.id)} ⟷ ${this.nameOf(
        farRow.voice.id
      )}`;
    }
  }

  private nameOf(voiceId: string): string {
    return this.nameById.get(voiceId) ?? voiceId;
  }

  /**
   * The painted row a voice can actually be auditioned from — the one test
   * every play gesture has to pass, and therefore the one test the controls
   * that offer it have to pass too.
   */
  private playableRowFor(voiceId: string | null): RailRow | undefined {
    if (!voiceId) return undefined;
    return this.rows.find((row) => row.voice.id === voiceId && row.playable);
  }

  // --- the rail -------------------------------------------------------------

  /**
   * Sorted ascending by median F0 — the listener's axis, not the vendor's —
   * with voices that have no clip collected at the end (design §7, §10).
   *
   * Pitch resolves measured print → build-time seed → the 155 Hz reference
   * line, so a known voice sorts instantly and only a voice the server added
   * since the last release can ever move.
   */
  private orderCatalog(
    catalog: SpeechSynthesisVoiceRemote[]
  ): SpeechSynthesisVoiceRemote[] {
    const byName = (a: SpeechSynthesisVoiceRemote, b: SpeechSynthesisVoiceRemote) =>
      String(a.name ?? "").localeCompare(String(b.name ?? "")) ||
      a.id.localeCompare(b.id);
    const pitched = catalog
      .filter((voice) => !!voice.sample_url)
      .sort((a, b) => {
        const delta =
          pitchOf(a, this.prints.get(a.id)) - pitchOf(b, this.prints.get(b.id));
        return delta !== 0 ? delta : byName(a, b);
      });
    const unpitched = catalog
      .filter((voice) => !voice.sample_url)
      .sort(byName);
    return [...pitched, ...unpitched];
  }

  /**
   * What the rail actually shows, in order: the pitch chart, narrowed by the
   * `Show:` control.
   *
   * Called on the way to PAINTING only. `settleOrder` deliberately does not
   * come through here — it asks about pitch order alone, over the rows already
   * painted, because `Not yet heard` makes this list a function of the heard
   * store and a mark landing mid-listen would otherwise read as a re-sort.
   */
  private railOrder(
    catalog: SpeechSynthesisVoiceRemote[]
  ): SpeechSynthesisVoiceRemote[] {
    const ordered = this.orderCatalog(catalog);
    if (this.filter === "all") return ordered;
    if (this.filter === "unheard") {
      // A voice with no clip cannot have been heard, and is not something
      // "not yet heard" offers to fix — it would pile the un-auditionable tail
      // into a list whose whole point is what is left to listen to.
      return ordered.filter(
        (voice) => !!voice.sample_url && !isHeard(this.heardStore, voice.id)
      );
    }
    const tier = this.filter;
    return ordered.filter((voice) => getVoiceTier(voice) === tier);
  }

  private renderRail(vm: StudioViewModel): HTMLElement {
    const rail = document.createElement("ul");
    rail.classList.add("voice-rail");
    rail.setAttribute("role", "listbox");
    // `data-i18n-attr`, never `data-i18n`: replaceI18n() sets TEXTCONTENT on a
    // [data-i18n] element, which on the rail would delete every row.
    rail.setAttribute("data-i18n-attr", "aria-label:voicesRailLabel");
    rail.setAttribute("aria-label", getMessage("voicesRailLabel"));
    // Roving tabindex + aria-activedescendant: Tab crosses the whole rail in
    // ONE stop, not 22, and then reaches the focused row's two buttons.
    rail.tabIndex = 0;
    rail.addEventListener("keydown", (event) => this.onRailKeyDown(event));
    this.rail = rail;

    const ordered = this.railOrder(vm.catalog);
    this.paintedOrder = ordered.map((voice) => voice.id);
    // orderCatalog puts every clipless voice last, so one index is the whole
    // boundary: from here on is the "No sample yet" group.
    const groupAt = ordered.findIndex((voice) => !voice.sample_url);
    const hasGroup = groupAt >= 0;

    ordered.forEach((voice, index) => {
      if (index === groupAt) {
        rail.appendChild(this.renderTailDivider(vm, ordered.length - groupAt));
      }
      const row = this.renderRow(voice, vm, index, hasGroup && index >= groupAt);
      rail.appendChild(row.el);
      this.rows.push(row);
    });
    // Host built-ins are the same case with nothing to list — real, usable,
    // un-auditionable — so they still want the rule and the note.
    if (!hasGroup && vm.hasBuiltins) {
      rail.appendChild(this.renderTailDivider(vm, 0));
    }
    return rail;
  }

  /**
   * The one rule below the control bar (design §11): the "No sample yet" group
   * header, and the host-built-ins note, which is exactly the same case —
   * voices that are real, usable and un-auditionable.
   */
  private renderTailDivider(vm: StudioViewModel, count: number): HTMLElement {
    const divider = document.createElement("li");
    divider.classList.add("voice-rail-divider");
    divider.setAttribute("role", "presentation");
    if (count > 0) {
      const label = document.createElement("span");
      label.classList.add("voice-rail-group-label");
      label.id = "voice-nosample-label";
      // No data-i18n: substituted ($count$) text.
      label.textContent = getMessage("voicesNoSampleGroup", [String(count)]);
      divider.appendChild(label);
    }
    if (vm.hasBuiltins) {
      const note = document.createElement("span");
      note.classList.add("voice-rail-builtins");
      // The shipped note ends "…always appear in its menu too" — written to
      // follow a list of menu slots, on a page that had one. On a menu-less
      // host it promises a surface that no longer exists (Pi retired its
      // in-chat voice menu on 2026-07-30, #573, which is why `vm.menu` is
      // null there and why the same paint renders no pin toggles at all), and
      // the trailing "too" dangles with nothing above it. `vm.menu` is the one
      // menu-less signal, so it picks the sentence as well.
      // No data-i18n on either: substituted ($host$) text.
      note.textContent = vm.menu
        ? getMessage("voicesBuiltinsNote", [vm.host.label])
        : getMessage("voicesBuiltinsNoteNoMenu", [vm.host.label]);
      divider.appendChild(note);
    }
    return divider;
  }

  /**
   * One 42 px row: the print IS the play target, and so is the rest of the
   * row — ~860 × 42 px against the 56 px orb it replaced. `Use` and `Menu` sit
   * at the right edge and stop the click from reaching the row.
   *
   * `data-print-voice` is on the ROW, not on an inner button: nesting a button
   * inside a `role="option"` for the play affordance is what the whole-row
   * target exists to avoid, and it keeps one selector for "everything that
   * reads as this voice playing".
   */
  private renderRow(
    voice: SpeechSynthesisVoiceRemote,
    vm: StudioViewModel,
    index: number,
    inNoSampleGroup: boolean
  ): RailRow {
    const el = document.createElement("li");
    el.classList.add("voice-row");
    el.id = `voice-row-${index}`;
    el.setAttribute("role", "option");
    el.dataset.voiceId = voice.id;
    const isCurrent = voice.id === vm.currentId;
    // THE SELECTION IS THE COMMITMENT, not the cursor.
    //
    // `aria-selected` used to track where the arrow keys had got to, so a
    // screen reader announced "Onyx, selected" because Onyx happens to be the
    // deepest voice and the reader had chosen nothing. That is the APG's
    // "selection follows focus" pattern used where it does not apply: it is for
    // listboxes where moving the cursor IS choosing (a font picker applying as
    // you walk), and here walking the rail changes nothing — `Use` does, and
    // only `Use`. Meanwhile the real selection was being reported by a second,
    // quieter attribute (`aria-current`), so the page said one thing twice and
    // the louder half pointed at the wrong row.
    //
    // Now: exactly one option is selected, and it is the voice in use; none is,
    // on a host whose voice has never been chosen. The cursor is carried by
    // `aria-activedescendant` alone, which is what it is for. `aria-current` is
    // gone — the fact is on the row once, in the attribute a listbox owns.
    el.setAttribute("aria-selected", String(isCurrent));
    if (isCurrent) el.classList.add("voice-row-current");
    // The tagline is no longer a 2.7 em reserved block on 22 cards; it is one
    // 12 px line on the focused row, still via subtitleFor so the #474
    // twin-name logic survives untouched.
    const subtitle = this.subtitleFor(voice, vm.dupNames);
    // …with one exception the demotion cannot swallow. When two voices share a
    // display name (Pi ships two Paolas), subtitleFor's line is not a blurb —
    // it is the ONLY thing that tells the rows apart. Hiding it until focus
    // would put two identical rows on the rail and undo #474, so a twin's
    // subtitle is always rendered and always in the row's accessible name.
    // Keyed off dupNames, so it generalises to whatever pair the server grows
    // into next; the catalog is server-driven and this file never names Paola.
    const isTwin = vm.dupNames.has(String(voice.name ?? "").toLowerCase());

    // The option's name is the voice, not the concatenation of its print, its
    // badges and its two buttons. Composed rather than written once, because
    // the heard mark can land mid-listen without a repaint (see applyRowLabel).
    const head = [voice.name];
    if (isTwin && subtitle.text) head.push(subtitle.text);
    const labelTail = isCurrent ? [getMessage("voicesInUse")] : [];

    // What a row is DESCRIBED by, as opposed to named: secondary, spoken after
    // the name, and only for the things the reader could not otherwise find
    // out. HD's cost is one of them — the note used to render only while
    // `Show: HD only` was chosen, so anyone picking an HD voice out of `All
    // voices` (the default) never met it. It belongs to the voice, not to the
    // filter, so it hangs off every HD row on every filter.
    const describedBy: string[] = [];
    if (getVoiceTier(voice) === "hd") describedBy.push(HD_NOTE_ID);
    if (inNoSampleGroup) describedBy.push("voice-nosample-label");
    if (describedBy.length > 0) {
      el.setAttribute("aria-describedby", describedBy.join(" "));
    }

    const playable = !!voice.sample_url;
    if (playable) {
      el.dataset.printVoice = voice.id;
      // The ink density IS the heard state (design §8) — one class on the row,
      // because the print draws in `currentColor`. Heard gets MORE ink, never
      // less: dimming what you have listened to is semantically backwards, and
      // NN/g Guideline 37 warns specifically off grey for a visited state
      // because it reads as unavailable.
      if (isHeard(this.heardStore, voice.id)) el.classList.add("heard");
      el.dataset.printWidth = String(PRINT_WIDTHS.lg);
      // …and the HUE is the pitch, on the same axis the print's height and the
      // rail's order already use. Applied from `pitchOf`, so a seeded voice is
      // the right colour on the first paint and only a voice the server added
      // since the last release ever changes hue (once, when its own audio
      // lands — the same single move the ordering makes).
      this.applyRowInk(el, pitchOf(voice, this.prints.get(voice.id)));
      const print = document.createElement("span");
      print.classList.add("voice-row-print");
      print.appendChild(createPrintSvg(PRINT_WIDTHS.lg));
      el.appendChild(print);
      el.addEventListener("click", () => {
        this.focusRow(index, { block: "nearest" });
        this.rail?.focus({ preventScroll: true });
        this.audition(voice);
      });
    } else {
      // No clip → no print, no play affordance, and never a placeholder shape
      // pretending to be data. The row keeps its name and its controls.
      const gap = document.createElement("span");
      gap.classList.add("voice-row-print");
      gap.setAttribute("aria-hidden", "true");
      el.appendChild(gap);
      el.addEventListener("click", () => {
        this.focusRow(index, { block: "nearest" });
        this.rail?.focus({ preventScroll: true });
      });
    }

    const name = document.createElement("span");
    name.classList.add("voice-row-name");
    name.textContent = voice.name;
    el.appendChild(name);

    const desc = document.createElement("span");
    desc.classList.add("voice-row-desc");
    // Quiet, not loud: the modifier only lifts the line out of the focus-only
    // reveal and drops it an ink step, so it disambiguates without becoming
    // the loudest thing on a deliberately calm page.
    if (isTwin) desc.classList.add("voice-row-desc-dup");
    if (subtitle.i18nKey) desc.setAttribute("data-i18n", subtitle.i18nKey);
    desc.textContent = subtitle.text;
    if (subtitle.text) desc.title = subtitle.text;
    el.appendChild(desc);

    // Badges live in their OWN nodes, never inside .voice-row-name: the pin
    // button's accessible label is built from the voice, and a badge smuggled
    // into the name element used to end up inside it.
    const badges = document.createElement("span");
    badges.classList.add("voice-row-badges");
    if (getVoiceTier(voice) === "hd") badges.appendChild(this.renderTierChip());
    if (isCurrent) {
      // IN USE, not "Speaking now" (design §1/§11 draw this badge as `IN USE`).
      // Reusing the shipped `voicesSpeakingNow` was tempting — 31 locales
      // already carry it — but it was accurate on `.voice-card-state`, a page
      // with no per-row playing state to collide with. Here rows literally
      // speak: press Space on Onyx and the Marin row would announce itself as
      // "Marin — Speaking now" in the accent that means *now*, while `#voice-
      // status` says "Playing Onyx". Two rows claiming to speak, one of them
      // silent, and in the resting state — which is nearly all of the time —
      // the badge claims speech when nothing is playing at all. It is also
      // ~2× the width the 96px actions row was drawn around, which is what
      // truncated the current voice's tagline mid-word.
      const inUse = document.createElement("span");
      inUse.classList.add("voice-row-inuse");
      inUse.setAttribute("data-i18n", "voicesInUse");
      inUse.textContent = getMessage("voicesInUse");
      badges.appendChild(inUse);
    }
    el.appendChild(badges);

    const actions = document.createElement("span");
    actions.classList.add("voice-row-actions");
    // No menu, no pinning: on a host with nowhere to pin TO, the control would
    // write an overlay nothing ever reads.
    if (vm.menu) actions.appendChild(this.renderPinToggle(voice, vm));
    if (!isCurrent) {
      const use = document.createElement("button");
      use.type = "button";
      use.classList.add("voice-use");
      use.tabIndex = -1;
      use.setAttribute(
        "aria-label",
        getMessage("voicesUseOnHost", [voice.name, vm.host.label])
      );
      use.textContent = getMessage("voicesUseForHost", [vm.host.label]);
      use.disabled = this.savingChoice;
      use.addEventListener("click", (event) => {
        event.stopPropagation();
        // Committing to a row IS standing on it. The actions are revealed on
        // :hover as well as .focused, and this handler stops the click from
        // reaching the row's own listener — so without this, clicking Use on a
        // merely-hovered row leaves focus on wherever it was, and the repaint
        // that follows carries THAT row's focus and scrolls the page back to
        // it: the new IN USE marker you just created ends up off-screen and
        // the keyboard is on a different voice than the one you chose.
        this.focusRow(index, { block: "nearest" });
        void this.useVoice(voice);
      });
      actions.appendChild(use);
    }
    el.appendChild(actions);

    if (playable) this.trackPrint(el, voice);
    const row: RailRow = {
      voice,
      domId: el.id,
      playable,
      el,
      labelHead: head.join(" — "),
      labelTail,
    };
    this.applyRowLabel(row);
    return row;
  }

  /**
   * The row's accessible name — the disambiguator first, then the states.
   *
   * Heard state is in here because the rail expresses it as INK, and ink is
   * the one encoding a screen reader cannot read. `9 of 22 heard` in the
   * control bar says how far along you are; without this, nothing says which
   * of the rows under your cursor you have already listened to, so the whole
   * "never re-audition by accident" half of the page was sighted-only.
   *
   * Only the positive state is named. Twenty-two rows announcing that they are
   * in their default state is noise, and it is the same asymmetry the visual
   * makes — an unheard print is simply the resting drawing.
   */
  private applyRowLabel(row: RailRow): void {
    const parts = [row.labelHead];
    if (row.playable && isHeard(this.heardStore, row.voice.id)) {
      parts.push(getMessage("voicesHeardMark"));
    }
    parts.push(...row.labelTail);
    row.el.setAttribute("aria-label", parts.join(" — "));
  }

  private renderPinToggle(
    voice: SpeechSynthesisVoiceRemote,
    vm: StudioViewModel
  ): HTMLButtonElement {
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.classList.add("voice-pin-toggle");
    toggle.tabIndex = -1;
    this.applyPinToggleState(toggle, voice, vm);
    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      void this.togglePinFor(voice);
    });
    return toggle;
  }

  /** Shared by first paint and in-place refresh — one source of pin-button truth. */
  private applyPinToggleState(
    toggle: HTMLButtonElement,
    voice: Pick<SpeechSynthesisVoiceRemote, "id" | "name">,
    vm: StudioViewModel
  ): void {
    const pressed = vm.pinned.has(voice.id);
    toggle.setAttribute("aria-pressed", String(pressed));
    toggle.classList.toggle("pinned", pressed);
    const labelKey = pressed ? "voicesInMenuShort" : "voicesAddToMenuShort";
    toggle.setAttribute("data-i18n", labelKey);
    toggle.textContent = getMessage(labelKey);
    toggle.setAttribute(
      "aria-label",
      getMessage(
        pressed ? "voicesRemoveVoiceFromMenu" : "voicesAddVoiceToMenu",
        [voice.name, vm.host.label]
      )
    );
    const disabled = !pressed && (vm.menu?.full ?? false);
    toggle.disabled = disabled;
    if (disabled) toggle.title = getMessage("voicesMenuFull");
    else toggle.removeAttribute("title");
  }

  /**
   * The HD tier's one consequence, in the ARIA slot for secondary information.
   *
   * Visually hidden, and referenced rather than read inline: a description is
   * spoken after the option's name, after a pause, and can be turned off — so
   * it is the exact shape of "secondary information at the point of
   * commitment". The alternative, folding it into the accessible NAME, would
   * make ten rows announce a sentence about billing before they announce which
   * voice they are, which is the tier shelves' mistake in a new costume: they
   * led the premium tier with a penalty, and PR #585 was right to delete them.
   *
   * Rendered only when the catalog has HD in it. A note about a tier the host
   * does not serve is a description nothing points at.
   */
  private renderHdNote(vm: StudioViewModel): HTMLElement | null {
    if (!vm.catalog.some((voice) => getVoiceTier(voice) === "hd")) return null;
    const note = document.createElement("div");
    note.id = HD_NOTE_ID;
    note.classList.add("voice-hd-allowance", "voice-visually-hidden");
    note.setAttribute("data-i18n", "hdVoicesAllowanceNote");
    note.textContent = getMessage("hdVoicesAllowanceNote");
    return note;
  }

  /**
   * The visible half of the same fact. `title` rather than inline text,
   * matching what ClaudeVoiceMenu already does on its own HD chip — one chip,
   * one hover, one sentence, wherever in the product you meet it. The chip is
   * inside a row whose `aria-label` overrides its contents, so this is a
   * sighted-hover affordance only; the row's description is what carries it to
   * assistive tech.
   */
  private renderTierChip(): HTMLElement {
    const chip = document.createElement("span");
    chip.classList.add("voice-tier-chip");
    chip.textContent = "HD";
    chip.title = getMessage("hdVoicesAllowanceNote");
    return chip;
  }

  /**
   * One 12 px line under the rail: membership in the host's in-chat menu,
   * summarised. It replaces a whole slots SECTION whose two jobs have split —
   * membership is now the row's `Menu` toggle, and this is the summary.
   */
  private renderMenuSummary(vm: StudioViewModel): HTMLElement | null {
    if (!vm.menu) return null;
    const line = document.createElement("div");
    line.classList.add("voice-menu-summary");
    const text = document.createElement("span");
    // No data-i18n: substituted ($host$/$used$/$cap$) text.
    text.textContent = getMessage("voicesMenuSummary", [
      vm.host.label,
      String(vm.menu.seated.length),
      String(vm.menu.cap),
    ]);
    line.appendChild(text);
    if (vm.menu.seated.length > 0) {
      const names = document.createElement("span");
      names.classList.add("voice-menu-summary-names");
      // Untranslated: a comma-joined list of proper nouns (design §13).
      names.textContent = ` — ${vm.menu.seated
        .map((voice) => voice.name)
        .join(", ")}`;
      line.appendChild(names);
    }
    // The one line that makes "✓ In menu" honest, and the reason these two
    // keys come back off §13's retired list.
    //
    // A row's pin button is labelled from `vm.pinned`, not from `vm.menu
    // .seated`, and it has to be: it is the control that flips the pin, so it
    // must report the pin. But pins can outnumber the seats — the server marks
    // four voices `featured` and the user's current voice takes the first seat,
    // or the user pins four on Claude and then uses a fifth — and then a row
    // reads "✓ In menu" while the summary directly beneath it lists four other
    // names. `overflowCount` was still computed and had no consumer anywhere;
    // on `main` it rendered exactly this sentence, which is what explained the
    // gap. No data-i18n: substituted text.
    if (vm.menu.overflowCount > 0) {
      const overflow = document.createElement("span");
      overflow.classList.add("voice-menu-overflow");
      overflow.textContent =
        vm.menu.overflowCount === 1
          ? getMessage("voicesMenuOverflowOne", [String(vm.menu.cap)])
          : getMessage("voicesMenuOverflow", [
              String(vm.menu.overflowCount),
              String(vm.menu.cap),
            ]);
      line.appendChild(overflow);
    }
    return line;
  }

  // --- soundprints ----------------------------------------------------------

  /**
   * Paint whatever we already know, then arrange to measure what we don't.
   *
   * Measurement is driven by an IntersectionObserver so a 100-voice catalog
   * decodes only what is on screen, and skipped entirely on a metered
   * connection — where a clip the user actually plays still resolves its print
   * on demand, because playing it downloads it anyway.
   */
  private trackPrint(
    row: HTMLElement,
    voice: SpeechSynthesisVoiceRemote
  ): void {
    const known = this.prints.get(voice.id);
    if (known) {
      this.paintPrint(row, known);
      return;
    }
    if (!this.deps.loadPrint) return;
    // Metered connection: warm nothing. The print still resolves for any voice
    // the user actually plays (`audition`), whose clip is downloaded anyway.
    if (prefersReducedData()) return;
    if (typeof IntersectionObserver === "undefined") {
      // No observer to lean on (jsdom, and any browser old enough to lack it):
      // measure straight away rather than never.
      void this.measurePrint(voice);
      return;
    }
    if (!this.printObserver) {
      this.printObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            this.printObserver?.unobserve(entry.target);
            const target = this.printTargets.get(entry.target);
            if (target) void this.measurePrint(target);
          }
        },
        // A screen's worth of lead time: prints land before the row arrives.
        { rootMargin: "300px" }
      );
    }
    this.printTargets.set(row, voice);
    this.printObserver.observe(row);
  }

  private async measurePrint(voice: SpeechSynthesisVoiceRemote): Promise<void> {
    if (!this.deps.loadPrint || this.printsRequested.has(voice.id)) return;
    this.printsRequested.add(voice.id);
    const print = await this.deps.loadPrint(voice);
    // No print is a legitimate outcome (no clip, a 404, an undecodable file):
    // the voice keeps its reference line and never gets a fake mark.
    if (!print) return;
    this.prints.set(voice.id, print);
    const hz = pitchOf(voice, print);
    this.container
      .querySelectorAll<HTMLElement>(
        `[data-print-voice="${escapeCss(voice.id)}"]`
      )
      .forEach((row) => {
        this.paintPrint(row, print);
        this.applyRowInk(row, hz);
      });
    // A live measurement can disagree with the seed — only ever for a voice
    // the server added since the last release, and only once.
    this.requestSettle();
  }

  private paintPrint(row: HTMLElement, print: VoicePrint): void {
    const svg = row.querySelector<SVGSVGElement>(".voice-print");
    if (!svg) return;
    paintPrintTrace(svg, print, Number(row.dataset.printWidth) || undefined);
  }

  /**
   * The row's three inks — never heard / heard / playing — at this voice's
   * pitch position on the ramp.
   *
   * Three custom properties rather than three classes, because the STATE is
   * still exactly one class on the row (`.heard`, `.playing`) and the print
   * still fills from `currentColor`. The stylesheet picks which of the three
   * a row is painting in; this only says what the three are for this voice.
   */
  private applyRowInk(row: HTMLElement, hz: number): void {
    const ink = printInk(hz);
    row.style.setProperty("--print-ink-rest", ink.rest);
    row.style.setProperty("--print-ink-heard", ink.heard);
    row.style.setProperty("--print-ink-play", ink.playing);
  }

  /**
   * Re-sort when a measurement moves a voice — batched, and NEVER while audio
   * is playing (design §7): re-ordering the rail under a listener mid-clip is
   * the one thing the build-time seed exists to prevent.
   */
  private requestSettle(): void {
    if (this.settleTimer !== null) return;
    this.settleTimer = setTimeout(() => {
      this.settleTimer = null;
      this.settleOrder();
    }, 0);
  }

  private settleOrder(): void {
    if (this.auditionState.running) {
      this.orderDirty = true;
      return;
    }
    this.orderDirty = false;
    const data = this.cache.get(this.activeHost);
    if (!data || !this.body || this.rows.length === 0) return;
    const vm = viewModel(this.activeHost, data);
    // PITCH order only, over the rows that are actually on screen.
    //
    // Comparing the FILTERED list folds membership into a test that is only
    // about order — and `Not yet heard` changes membership the moment a clip
    // passes the heard threshold. So a mark the reader had just earned read as
    // a re-sort: the rail was rebuilt without the voice they were listening
    // to, focus fell back to the top, and the counter went BACKWARDS, which is
    // the page appearing to forget the mark it had just made. The filter is
    // applied at the next real repaint (a host switch, a `Show:` change, a
    // commit), which is the same rule design §8 states for the rail itself.
    const painted = new Set(this.paintedOrder);
    const next = this.orderCatalog(vm.catalog)
      .map((voice) => voice.id)
      .filter((id) => painted.has(id));
    const same =
      next.length === this.paintedOrder.length &&
      next.every((id, i) => id === this.paintedOrder[i]);
    if (same) return;
    this.paintBody(this.activeHost, data);
  }

  // --- keyboard -------------------------------------------------------------

  /**
   * The rail's whole keyboard (design §3). One listener on the listbox,
   * because the rail is one tab stop.
   */
  private onRailKeyDown(event: KeyboardEvent): void {
    // Only when the LISTBOX itself holds focus. Tab moves on to the focused
    // row's Menu and Use buttons, whose own keydowns bubble through here —
    // and swallowing Space on a button would stop it activating.
    if (event.target !== event.currentTarget) return;
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        this.moveFocus(1);
        return;
      case "ArrowUp":
        event.preventDefault();
        this.moveFocus(-1);
        return;
      case "Home":
        event.preventDefault();
        this.focusRow(0, { block: "nearest", audition: true });
        return;
      case "End":
        event.preventDefault();
        this.focusRow(this.brightestIndex(), {
          block: "nearest",
          audition: true,
        });
        return;
      case "Enter":
        event.preventDefault();
        this.useFocused();
        return;
      case "Escape":
        event.preventDefault();
        this.disarm();
        return;
      case " ":
      case "Spacebar":
        event.preventDefault();
        if (event.shiftKey) this.switchBack();
        else this.toggleFocusedAudition();
        return;
      default:
        break;
    }
    if (event.shiftKey) return;
    // Type-ahead: worth more at 100 voices than a letter accelerator, which is
    // why pin has none (M/P collide with Marin and Paola).
    if (/^[a-z0-9]$/i.test(event.key)) {
      event.preventDefault();
      this.typeAheadTo(event.key);
    }
  }

  private moveFocus(delta: number): void {
    if (this.rows.length === 0) return;
    // Clamped, no wrap: the rail is a chart, and walking off the bright end
    // back onto the deepest voice is a jump, not a step.
    const next = Math.min(
      this.rows.length - 1,
      Math.max(0, this.focusIndex + delta)
    );
    if (next === this.focusIndex) return;
    this.focusRow(next, { block: "nearest", audition: true });
  }

  /** The last voice with a clip — "brightest" means measured, not last row. */
  private brightestIndex(): number {
    for (let i = this.rows.length - 1; i >= 0; i--) {
      if (this.rows[i].playable) return i;
    }
    return Math.max(0, this.rows.length - 1);
  }

  private typeAheadTo(key: string): void {
    const now = Date.now();
    this.typeAhead =
      now - this.typeAheadAt > TYPE_AHEAD_MS
        ? key.toLowerCase()
        : this.typeAhead + key.toLowerCase();
    this.typeAheadAt = now;
    const total = this.rows.length;
    if (total === 0) return;
    // The APG rule: a buffer of one repeated character CYCLES through the
    // voices starting with it, while any other buffer re-matches in place — so
    // "c" "c" walks Cedar → Coral, and "c" "o" refines to Coral rather than
    // skipping past it to the next C.
    const repeated = [...this.typeAhead].every(
      (char) => char === this.typeAhead[0]
    );
    const needle = repeated ? this.typeAhead[0] : this.typeAhead;
    const from = repeated ? this.focusIndex + 1 : this.focusIndex;
    for (let step = 0; step < total; step++) {
      const index = (from + step + total) % total;
      const name = String(this.rows[index].voice.name ?? "").toLowerCase();
      if (name.startsWith(needle)) {
        this.focusRow(index, { block: "nearest", audition: true });
        return;
      }
    }
  }

  private focusRow(
    index: number,
    opts: {
      block?: ScrollLogicalPosition;
      audition?: boolean;
      scroll?: boolean;
    } = {}
  ): void {
    if (index < 0 || index >= this.rows.length) return;
    this.focusIndex = index;
    this.applyFocus(opts);
    // The arming rule: focus auditions ONLY once the reader has explicitly
    // played something this session, and only while the escape hatch is on.
    if (opts.audition && this.armed && this.arrowAudition) {
      const row = this.rows[index];
      if (row.playable) this.audition(row.voice);
    }
  }

  private applyFocus(
    opts: { block?: ScrollLogicalPosition; scroll?: boolean } = {}
  ): void {
    this.rows.forEach((row, index) => {
      const focused = index === this.focusIndex;
      row.el.classList.toggle("focused", focused);
      // NB no `aria-selected` here. The cursor is `aria-activedescendant`'s
      // job; `aria-selected` belongs to the voice the reader committed to.
      // Exactly two extra tab stops, always on the row you are looking at.
      row.el
        .querySelectorAll<HTMLButtonElement>(".voice-row-actions button")
        .forEach((button) => {
          button.tabIndex = focused ? 0 : -1;
        });
    });
    const row = this.rows[this.focusIndex];
    this.focusedVoiceId = row?.voice.id ?? null;
    if (this.rail) {
      if (row) this.rail.setAttribute("aria-activedescendant", row.domId);
      else this.rail.removeAttribute("aria-activedescendant");
    }
    // jsdom has no layout and therefore no scrollIntoView.
    if (opts.scroll !== false) {
      row?.el.scrollIntoView?.({ block: opts.block ?? "nearest" });
    }
    this.updateControlBar();
  }

  /**
   * What speaks when no row is in use — the sentence that stands where
   * `Your voice: … ↗` would be (#599).
   *
   * The two cases are genuinely different outcomes, not two phrasings of one:
   * a host that ships its own voices answers in one of them, and a host that
   * doesn't stays silent. Which host this is comes from `host.hasOwnVoice`, NOT
   * from `hasBuiltins`: the API doesn't mark Pi's built-ins `default` in
   * practice, so the catalog-derived signal is false even on Pi — measured on
   * the live host, where it produced exactly the wrong sentence.
   */
  private renderFallbackVoice(vm: StudioViewModel): HTMLElement {
    const line = document.createElement("span");
    line.classList.add("voice-fallback");
    if (vm.unavailable) {
      line.classList.add("voice-fallback-unavailable");
      const key = this.deps.isAuthenticated() ? "voicesSavedUnavailable" : "signInForTTS";
      line.dataset.i18n = key;
      line.textContent = getMessage(key);
    } else if (vm.host.hasOwnVoice) {
      line.classList.add("voice-fallback-host");
      // No data-i18n: substituted ($host$) text, which replaceI18n would strip.
      line.textContent = getMessage("voicesFallbackHostVoice", [vm.host.label]);
    } else {
      line.classList.add("voice-fallback-none");
      line.setAttribute("data-i18n", "voicesFallbackNoVoice");
      line.textContent = getMessage("voicesFallbackNoVoice");
    }
    return line;
  }

  private jumpToCurrent(): void {
    const data = this.cache.get(this.activeHost);
    const currentId = data?.current?.id;
    if (!currentId) return;
    const at = this.rows.findIndex((row) => row.voice.id === currentId);
    if (at < 0) return;
    this.focusRow(at, { block: "center" });
    this.rail?.focus({ preventScroll: true });
  }

  private useFocused(): void {
    const row = this.rows[this.focusIndex];
    if (!row) return;
    const data = this.cache.get(this.activeHost);
    if (data?.current?.id === row.voice.id) return;
    void this.useVoice(row.voice);
  }

  private toggleFocusedAudition(): void {
    const row = this.rows[this.focusIndex];
    if (!row?.playable) return;
    // The first thing the reader does is the first time they ask to travel:
    // arrival deliberately left focus off-screen rather than scrolling the
    // heading away, so playing a voice you cannot see is the one case to
    // close. Idempotent — the row is already focused.
    this.applyFocus({ block: "nearest" });
    // Space ARMS the rail either way — the reader has said "play things".
    this.arm();
    if (this.auditionState.playingVoiceId === row.voice.id) {
      this.stopAudition();
      this.updateControlBar();
      return;
    }
    this.audition(row.voice);
  }

  /**
   * `⇧Space` (design §4): play the voice you are NOT on, and swap the pair, so
   * repeated presses ping-pong A, B, A, B forever. Focus never moves. Scroll
   * never moves. That is what "without losing your place" means concretely.
   */
  private switchBack(): void {
    const row = this.playableRowFor(this.pair[1]);
    if (!row) return;
    this.arm();
    this.audition(row.voice);
  }

  /**
   * The rail becomes audible (design §3) — the one seam every explicit play
   * goes through, so there is exactly one place that decides the rail has just
   * changed what the arrow keys do.
   *
   * The notice is queued only when the arrows are ACTUALLY going live: with
   * the escape hatch off, arming licenses the browser's autoplay policy and
   * nothing else, and announcing a change that did not happen is worse than
   * saying nothing.
   */
  private arm(): void {
    if (this.armed) return;
    this.armed = true;
    if (this.arrowAudition && this.armedNotice === "unsaid") {
      this.armedNotice = "due";
    }
  }

  private disarm(): void {
    this.stopAudition();
    this.armed = false;
    this.updateControlBar();
  }

  private toggleArrowAudition(): void {
    this.arrowAudition = !this.arrowAudition;
    // Turning the hatch back on while the rail is already armed is the other
    // way the arrows go live for the first time.
    if (this.arrowAudition && this.armed && this.armedNotice === "unsaid") {
      this.armedNotice = "due";
    }
    this.updateControlBar();
    void this.deps.setArrowAudition?.(this.arrowAudition);
  }

  /**
   * Narrow (or widen) the rail. Repaints from cache, so it is instant.
   *
   * Stops a running SWEEP, because the queue it was walking is what just left
   * the screen — but leaves a lone clip alone, the same asymmetry a hidden
   * window gets. Cutting the voice you are in the middle of judging, because
   * you reached for the filter, would be the filter breaking the comparison it
   * exists to make possible.
   */
  private changeFilter(next: VoiceFilter): void {
    if (next === this.filter) return;
    this.filter = next;
    this.stopSequence();
    this.refusal = null;
    const data = this.cache.get(this.activeHost);
    if (data) this.paintBody(this.activeHost, data);
  }

  // --- audition -------------------------------------------------------------

  private audition(voice: SpeechSynthesisVoiceRemote): void {
    // Any explicit play arms the rail (design §3): the first play always
    // descends from a real gesture, which is what licenses every later one.
    this.arm();
    // Direct manipulation gets exactly one meaning (design §4): touching a row
    // mid-sweep cancels the sweep and plays THAT row. The sequencer does the
    // actual cancelling — `play()` bumps its session token — so all this has
    // to do is stop the page claiming a sweep is under way.
    this.sweeping = false;
    this.refusal = null;
    // Level-matched from this voice's own measured RMS, or unattenuated when
    // the print has not landed yet (design §5.1).
    const gain = gainFor(this.prints.get(voice.id)?.voicedRmsDb);
    // The on-demand half of the measurement schedule: a voice the user chose
    // to hear earns its print even on a metered connection, because playing it
    // fetches the clip regardless.
    void this.measurePrint(voice);
    this.pushPair(voice.id);
    this.deps.playPreview(
      voice,
      (state) => {
        this.auditionState = state;
        this.applyAuditionState();
      },
      gain
    );
    this.updateControlBar();
  }

  /**
   * A clip PLAYED (design §8) — long enough to count, which is a fact only the
   * sequencer holds. Everything here is a repaint of what is already on
   * screen: the row inks in, the counter ticks, and `Play all` may become
   * `Play new`. The rail is never rebuilt for it, so a mark landing mid-sweep
   * cannot move a row under the listener.
   */
  private onVoiceHeard(voiceId: string): void {
    const known = isHeard(this.heardStore, voiceId);
    // A replay refreshes the timestamp — the only reader of which is the
    // store's own eviction order — and changes nothing on screen.
    this.heardStore = markHeardAt(this.heardStore, voiceId, Date.now());
    if (known) return;
    this.markRows(voiceId, "heard");
    // The ink and the name are the same fact in two encodings, so they land on
    // the same tick — a mark a screen reader only learns about at the next
    // repaint is a mark it usually never learns about at all.
    this.rows
      .filter((row) => row.voice.id === voiceId)
      .forEach((row) => this.applyRowLabel(row));
    this.updateControlBar();
  }

  private stopAudition(): void {
    this.deps.stopPreview?.();
    this.sweeping = false;
    // The sequencer's snapshot is the truth when there is one; with no player
    // wired the rail still has to stop reading as playing.
    this.auditionState = IDLE_AUDITION;
    this.applyAuditionState();
  }

  // --- the sweep (design §4's `Play all`) -----------------------------------

  /**
   * The queue `Play all` would walk: the currently painted, currently
   * FILTERED, currently ordered rows that have a clip.
   *
   * Derived from the painted rows rather than the catalog, which is the whole
   * point — narrowing the list with `Show:` narrows the sweep, and the
   * refusal above 25 is then something the reader can actually act on.
   */
  private playableRows(): RailRow[] {
    return this.rows.filter((row) => row.playable && !!row.voice.sample_url);
  }

  /**
   * What `Play all` would walk, and what to call it.
   *
   * On a return visit with SOME — but not all — of the rail heard, the offer
   * narrows to what is left: `▶ Play new (13)`. That is the gesture the whole
   * feature is for. Re-playing the fourteen voices you already rejected is
   * exactly the tax heard memory exists to remove, and the moment either
   * extreme is true (nothing heard, or everything heard) "new" would be a
   * distinction without a difference, so it goes back to `▶ Play all`.
   */
  private sweepPlan(): { rows: RailRow[]; mode: "all" | "new" } {
    const { unheard, total } = this.heardTally();
    const partial = unheard.length > 0 && unheard.length < total;
    return partial
      ? { rows: unheard, mode: "new" }
      : { rows: this.playableRows(), mode: "all" };
  }

  private sweepItems(): AuditionItem[] {
    return this.sweepPlan().rows.map((row) => ({
      voiceId: row.voice.id,
      url: row.voice.sample_url as string,
      gain: gainFor(this.prints.get(row.voice.id)?.voicedRmsDb),
    }));
  }

  private toggleSweep(): void {
    if (this.sweeping) {
      this.stopSequence();
      return;
    }
    this.playAll();
  }

  /**
   * Walk the filtered list once, at the sequencer's fixed beat.
   *
   * ONCE: it never loops, never persists, and never auto-starts. The page's
   * invitation is to hear one voice — this is the option, not the opening
   * gesture.
   */
  private playAll(): void {
    const items = this.sweepItems();
    if (items.length === 0) return;
    if (items.length > PLAY_ALL_MAX) {
      this.refuseSweep(items.length);
      return;
    }
    this.refusal = null;
    // Pressing it is an explicit play, so it arms the rail exactly as Space
    // does — and it is a real user gesture, which is what licenses every
    // programmatic play() that follows under Chrome's sticky-activation rule.
    this.arm();
    this.sweeping = true;
    // Focus is NOT moved, and is not moved as the queue advances either: the
    // pair, the focus and the queue index are three independent things, which
    // is what lets you keep your place while the rail plays itself.
    this.deps.playSequence?.(items, (state) => {
      this.auditionState = state;
      this.applyAuditionState();
    });
    this.updateControlBar();
  }

  /**
   * Stop the SEQUENCE. Used by the button, by `Esc` via `disarm`, by a filter
   * change and by a hidden window — all cases where the queue is what has
   * stopped making sense, and where a lone clip a second from ending is better
   * left to end.
   */
  private stopSequence(): void {
    if (!this.sweeping) return;
    this.stopAudition();
    this.updateControlBar();
  }

  /**
   * Too many to sit through (design §10). A refusal, not a disabled button:
   * a greyed-out `Play all` explains nothing, and the sentence that does
   * explain it points straight at the control that fixes it, one row above.
   */
  private refuseSweep(count: number): void {
    this.refusal = { count, minutes: sweepMinutes(count) };
    this.updateControlBar();
    this.syncStatus();
  }

  /** The last two DISTINCT voices auditioned, most recent first. */
  private pushPair(voiceId: string): void {
    if (this.pair[0] === voiceId) return;
    this.pair = [voiceId, this.pair[0]];
  }

  /**
   * Seeded with the incumbent, once per host: the first `↓` `⇧Space` is then
   * incumbent-vs-challenger — the actual decision — with zero setup.
   *
   * Only ever with an AUDITIONABLE incumbent, and that guard is the whole
   * difference between the design's headline gesture and a dead control. The
   * pair's other slot is only ever filled by `pushPair` from a voice that just
   * played, so it can't be unplayable; the seed is the one entry point that
   * does not go through playback. A host built-in, a stale stored preference
   * and a `sample_url`-less voice are all current voices with no playable row
   * — and seeding any of them renders `⇄ Onyx ⟷ Aria` with a "Switch back to
   * Aria" label over a `switchBack()` that bails silently.
   */
  private seedPair(hostId: VoiceHostId, vm: StudioViewModel): void {
    if (this.pairHost === hostId) return;
    this.pairHost = hostId;
    const incumbent = vm.catalog.find(
      (voice) => voice.id === vm.currentId && !!voice.sample_url
    );
    this.pair = [incumbent?.id ?? null, null];
  }

  /**
   * Paint the audition snapshot onto whatever rows are currently in the DOM.
   *
   * Clear-all-then-mark-one rather than a per-voice toggle: the snapshot's
   * whole point is that exactly one voice can be playing, so the DOM is
   * derived from it wholesale instead of patched per caller.
   */
  private applyAuditionState(): void {
    // The queue ran out (or stopped itself on a run of failures). The button
    // has to stop offering to stop something that already has.
    if (this.sweeping && !this.auditionState.running) this.sweeping = false;

    this.container
      .querySelectorAll("[data-print-voice].playing, [data-print-voice].loading")
      .forEach((row) => row.classList.remove("playing", "loading"));
    // A clip that isn't buffered yet stretches the gap between voices. Saying
    // so — the next voice's print pulses — is the difference between a beat
    // that is late and a page that looks like it has stopped working.
    this.markRows(this.auditionState.loadingVoiceId, "loading");
    const playing = this.auditionState.playingVoiceId;
    this.markRows(playing, "playing");
    this.followSweep(playing);
    this.syncStatus();
    this.updateControlBar();
    // A reorder that waited for the audio to stop can land now.
    if (!playing && this.orderDirty) this.requestSettle();
  }

  /**
   * Keep a running sweep's voice on screen.
   *
   * `Play all` is the half of the feature you WATCH — the print inks in and
   * the playhead crosses the trace — and on the 22-voice catalog, in the
   * 1120 × 900 window the extension opens for Voices, the last five rows sit
   * below the fold: without this they sound with no row lit, no playhead and
   * no ink, leaving `20 of 22` as the only sign anything is happening.
   *
   * ONLY while a sweep runs. A single audition must move neither focus nor
   * scroll — that is what `⇧Space` "without losing your place" means — and
   * focus is not moved here either: the queue index and the focus stay
   * independent. `nearest` scrolls the minimum, so a rail that fits never
   * moves at all, and only a row that has actually left the viewport pulls the
   * page. Once per voice, because every repaint re-derives from the snapshot.
   */
  private followSweep(playing: string | null): void {
    if (!this.sweeping) {
      this.sweepFollowedId = null;
      return;
    }
    if (!playing || playing === this.sweepFollowedId) return;
    this.sweepFollowedId = playing;
    // jsdom has no layout and therefore no scrollIntoView.
    this.rows
      .find((row) => row.voice.id === playing)
      ?.el.scrollIntoView?.({ block: "nearest" });
  }

  private markRows(voiceId: string | null, className: string): void {
    if (!voiceId) return;
    this.container
      .querySelectorAll(`[data-print-voice="${escapeCss(voiceId)}"]`)
      .forEach((row) => row.classList.add(className));
  }

  /**
   * What the live region says. `#voice-status` carries no `data-i18n`: every
   * string here is substituted, and `replaceI18n` would erase the name.
   *
   * Deliberately silent DURING a sweep. Naming each of 22 voices into a
   * polite queue is the same collision the arming rule exists to prevent — the
   * reader's speech landing on top of the sample it is describing — and by the
   * time the queue drained it would be minutes behind the audio. A sweep is a
   * listening exercise; the audio is the output. What still gets announced is
   * everything that is NOT the audio: blocked playback, a failed clip, and a
   * refused sweep, none of which the ear can discover on its own.
   */
  private syncStatus(): void {
    if (this.auditionState.error || this.refusal) {
      this.announce(this.hintLine().text);
      return;
    }
    const playing = this.auditionState.playingVoiceId;
    if (!playing || this.sweeping) {
      this.armedNoticeFor = null;
      this.announce("");
      return;
    }
    // The first clip that arms the rail carries the news that ↑↓ are now live,
    // on the same line rather than as a second announcement — a polite queue
    // would deliver two writes as two interruptions, and the second would land
    // over the sample it is talking about.
    if (this.armedNotice === "due") {
      this.armedNotice = "said";
      this.armedNoticeFor = playing;
    }
    const line = getMessage("voicesNowPlaying", [this.nameOf(playing)]);
    // The latch lasts exactly as long as that one clip. Anything else sounding
    // — or nothing sounding — drops it for good, so coming back to the voice
    // you started on later does not hear the confirmation a second time.
    if (playing !== this.armedNoticeFor) {
      this.armedNoticeFor = null;
      this.announce(line);
      return;
    }
    this.announce(`${line} ${getMessage("voicesArrowsLive")}`);
  }

  /**
   * Write the live region ONLY when what it says changes.
   *
   * `textContent =` removes the existing text node and inserts a new one, which
   * is a childList mutation inside `aria-live="polite"` — so an unconditional
   * write re-announces "Playing Ash" every time anything repaints, including a
   * pin toggle on an unrelated row and the optimistic-revert that follows a
   * failed one. This is the same defect §9 moved the live region off
   * `#voice-studio` to avoid; moving it shrank the payload without making the
   * write conditional.
   */
  private announce(text: string): void {
    const status = this.container.querySelector<HTMLElement>("#voice-status");
    if (!status || status.textContent === text) return;
    status.textContent = text;
  }

  // --- subtitles ------------------------------------------------------------

  /**
   * Metadata fallback for voices without an authored tagline — and the
   * tiebreaker for twin display names (#474), where a shared persona tagline
   * can't tell two rows apart.
   *
   * Which differentiator a twin group uses is decided once, for the whole
   * group, by dupStrategyFor — a per-voice rule can land one twin on a number
   * and the other on prose, which is the non-parallelism that made the two
   * Paolas read as a mistake rather than a choice.
   */
  private subtitleFor(
    voice: SpeechSynthesisVoiceRemote,
    dupNames: Map<string, DupStrategy>
  ): { text: string; i18nKey?: string } {
    const strategy = dupNames.get(String(voice.name ?? "").toLowerCase());
    if (strategy === "languages") {
      // Substituted ($count$) → no i18nKey, so replaceI18n can't strip the number.
      return { text: this.languagesSubtitle(voice) };
    }
    const meta = voice.description || this.languagesSubtitle(voice);
    if (strategy === "description" && meta) {
      return { text: meta };
    }
    const identity = getVoiceIdentity(voice);
    if (identity.taglineKey) {
      return {
        text: getMessage(identity.taglineKey),
        i18nKey: identity.taglineKey,
      };
    }
    return { text: meta };
  }

  private languagesSubtitle(voice: SpeechSynthesisVoiceRemote): string {
    const count = languageCount(voice);
    return count > 1
      ? getMessage("voiceSpeaksNLanguages", [String(count)])
      : "";
  }

  // --- commit ---------------------------------------------------------------

  /**
   * Pinning updates in place — every row's pin button is patched and the menu
   * summary re-derived, but the rail isn't rebuilt, so focus, scroll and the
   * playing row all survive the headline interaction. Optimistic: the cached
   * overlay flips first and reverts if the write fails.
   */
  private async togglePinFor(voice: SpeechSynthesisVoiceRemote): Promise<void> {
    const host = this.activeHost;
    const data = this.cache.get(host);
    if (!data) return;
    const vm = viewModel(host, data);
    const pin = !vm.pinned.has(voice.id);
    const previousOverlay = data.overlay;
    data.overlay = togglePin(data.overlay, voice.id, vm.featuredIds, pin);
    this.refreshCuration(data);
    try {
      await this.deps.setPinned(host, voice.id, vm.featuredIds, pin);
    } catch (error) {
      data.overlay = previousOverlay;
      this.refreshCuration(data);
      console.error("Failed to update voice pin", error);
    }
  }

  /** Re-derive pin-button states + the menu summary from cached data, in place. */
  private refreshCuration(data: HostStudioData): void {
    if (!this.body) return;
    const vm = viewModel(this.activeHost, data);
    // Names come from the VIEW MODEL, never read back out of the DOM. The
    // shipped studio reconstructed a voice's name from `.voice-card-name`
    // textContent, so any badge placed inside that element silently corrupted
    // the pin button's aria-label — a defect that passes tsc and every test
    // and is wrong only for screen-reader users.
    const byId = new Map(vm.catalog.map((voice) => [voice.id, voice]));
    this.rows.forEach((row) => {
      const toggle = row.el.querySelector<HTMLButtonElement>(
        ".voice-pin-toggle"
      );
      if (!toggle) return;
      const voice = byId.get(row.voice.id) ?? row.voice;
      this.applyPinToggleState(toggle, voice, vm);
    });
    const summary = this.body.querySelector(".voice-menu-summary");
    const next = this.renderMenuSummary(vm);
    if (summary && next) summary.replaceWith(next);
    // Nothing above rebuilt a row, so the playing state is intact — but the
    // summary swap is a DOM mutation, and re-deriving from the snapshot is
    // cheap insurance that "playing" is never left to a caller's memory.
    this.applyAuditionState();
  }

  /**
   * Selecting a voice moves the IN USE marker, the accent rule and the row's
   * actions, so this one repaints the body (from cache — instant). Focus is
   * carried, because a repaint that dumps the reader back at the deepest voice
   * would punish them for choosing.
   */
  private async useVoice(voice: SpeechSynthesisVoiceRemote): Promise<void> {
    await this.saveChoice(voice);
  }

  private async saveChoice(voice: SpeechSynthesisVoiceRemote | null): Promise<void> {
    if (this.savingChoice || (!voice && !this.deps.unsetVoice)) return;
    const host = this.activeHost;
    this.savingChoice = true;
    ++this.currentReadToken;
    this.body?.querySelectorAll<HTMLButtonElement>(".voice-use, .voice-native-return")
      .forEach((button) => { button.disabled = true; });
    let message: string;
    try {
      if (voice) await this.deps.setVoice(voice, host);
      else await this.deps.unsetVoice!(host);
      const data = this.cache.get(host);
      if (data) { data.current = voice; data.unavailable = false; }
      message = voice
        ? getMessage("voicesSelectedOnHost", [voice.name, VOICE_HOSTS.find((item) => item.id === host)!.label])
        : getMessage("voicesFallbackHostVoice", [VOICE_HOSTS.find((item) => item.id === host)!.label]);
    } catch {
      message = getMessage("voicesSaveFailed");
    } finally {
      this.savingChoice = false;
    }
    if (this.destroyed) return;
    if (host === this.activeHost) this.choiceMessage = message;
    await this.render();
    if (this.choiceRefreshPending) {
      this.choiceRefreshPending = false;
      await this.refreshCurrentVoice();
    }
    if (host === this.activeHost && this.choiceMessage === message) this.announce(message);
  }
}
