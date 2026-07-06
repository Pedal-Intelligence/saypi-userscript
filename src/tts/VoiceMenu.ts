// The generic/abstract base for voice selectors. Rendering machinery lives in
// the surface-specific layers: GridVoiceSelector (Pi's button grids) and
// ClaudeVoiceMenu (dropdown). This base owns only the cross-surface concerns:
// event wiring (auth, external preference changes), the gather-then-render
// refresh cycle, and voice introduction playback.
import { Chatbot } from "../chatbots/Chatbot";
import { getMostRecentAssistantMessage } from "../dom/ChatHistory";
import EventBus from "../events/EventBus";
import getMessage from "../i18n";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import { SpeechSynthesisVoiceRemote } from "./SpeechModel";
import { SpeechSynthesisModule } from "./SpeechSynthesisModule";
import { getJwtManagerSync } from "../JwtManager";
import {
  loadHostOverlay,
  resolvePinnedIds,
  serverFeaturedIds,
} from "./VoicePins";

/**
 * A chatbot that ships its own set of built-in voices, with introduction audio
 * for the default voice (currently only Pi.ai). Declared structurally so the
 * generic {@link VoiceSelector} base class can detect the capability without
 * importing the concrete `PiAIChatbot` — that import created a
 * `VoiceMenu -> Pi -> PiVoiceMenu -> VoiceMenu` cycle.
 */
export interface BuiltInVoiceProvider {
  getExtraVoices(): SpeechSynthesisVoiceRemote[];
  getVoiceIntroductionUrl(voiceId: string): string;
}

/** Structural type guard for {@link BuiltInVoiceProvider}. */
export function isBuiltInVoiceProvider(
  chatbot: Chatbot
): chatbot is Chatbot & BuiltInVoiceProvider {
  const candidate = chatbot as Partial<BuiltInVoiceProvider>;
  return (
    typeof candidate.getExtraVoices === "function" &&
    typeof candidate.getVoiceIntroductionUrl === "function"
  );
}

export abstract class VoiceSelector {
  protected chatbot: Chatbot;
  protected userPreferences: UserPreferenceModule;
  protected element: HTMLElement;
  // No selection or pin fields: "which voice is selected" is the stored
  // preference, fetched at render time. The DOM is a render of that state,
  // never the place it is recovered from.

  constructor(
    chatbot: Chatbot,
    userPreferences: UserPreferenceModule,
    element: HTMLElement
  ) {
    this.chatbot = chatbot;
    this.userPreferences = userPreferences;
    this.element = element;
    this.registerAuthenticationChangeHandler();
    this.registerVoicePreferenceChangeHandler();
  }

  abstract getId(): string;
  abstract getButtonClasses(): string[];

  /**
   * THE single render path: given the fetched catalog + the stored voice,
   * make this selector's DOM reflect them. Must be idempotent — callable
   * repeatedly with the same inputs and converging on the same DOM.
   * Implementations: GridVoiceSelector (Pi's button grids), ClaudeVoiceMenu
   * (dropdown).
   */
  protected abstract renderMenu(
    voices: SpeechSynthesisVoiceRemote[],
    storedVoice: SpeechSynthesisVoiceRemote | null,
    pinnedIds?: ReadonlySet<string> | null
  ): void;

  /**
   * Reflect an externally-changed stored voice on this surface without a
   * repopulate (and therefore without disturbing an open menu).
   */
  protected abstract applySelectedVoice(
    voice: SpeechSynthesisVoiceRemote | null
  ): void;

  /**
   * Gather-then-render: fetch the catalog and the stored voice TOGETHER, then
   * render once. Handing the stored voice to the render is what lets
   * curateShortlist pin the current voice synchronously — the old
   * render-then-detect-then-re-render pin recursion (and the pin field) died
   * with this. Also gone: the old teardown half, which fed a descendant
   * `querySelectorAll("button")` to direct-child-only `removeChild` — the
   * #485 crash. Renders reconcile; nothing bulk-removes buttons.
   */
  async refreshMenu(): Promise<void> {
    const speechSynthesis = SpeechSynthesisModule.getInstance();
    const [voices, storedVoice, pinOverlay] = await Promise.all([
      speechSynthesis.getVoices(this.chatbot),
      this.userPreferences.getVoice(this.chatbot),
      // The host's voice-pin overlay (Phase 2). Loaded alongside the catalog so
      // pins are resolved synchronously at render — the current voice still
      // pins first on the first paint. Pin resolution must NEVER break a menu
      // render: any storage failure falls back to the default shortlist.
      loadHostOverlay(this.chatbot.getID()).catch(() => null),
    ]);
    const catalog = voices ?? [];
    // A null overlay (un-customized host) yields a null pinned set, which keeps
    // renderMenu on its default server-featured/heuristic path unchanged.
    const pinnedIds = pinOverlay
      ? resolvePinnedIds(serverFeaturedIds(catalog), pinOverlay)
      : null;
    this.renderMenu(catalog, storedVoice ?? null, pinnedIds);
  }

  /**
   * Registers an event listener to handle authentication status changes.
   * This allows the voice menu to update dynamically when a user signs in.
   */
  protected registerAuthenticationChangeHandler(): void {
    EventBus.on("saypi:auth:status-changed", (isAuthenticated: boolean) => {
      // Authentication status changed, refresh the voice selector
      console.log(
        `User has logged ${isAuthenticated ? "in" : "out"}, refreshing voice selector`
      );
      const voiceSelector = document.getElementById(this.getId());
      if (voiceSelector) {
        this.refreshMenu();
      }
    });
  }

  /**
   * Registers a listener for voice-preference changes that originate outside
   * this menu. Picking a voice in the settings-page catalog persists to
   * chrome.storage, which PreferenceModule relays into the host tab as a
   * "userPreferenceChanged" event carrying `voicePreferences`. TTS switches
   * voices the moment that write lands, so the selector must follow in the
   * same beat rather than waiting for its next repopulate (#475).
   */
  protected registerVoicePreferenceChangeHandler(): void {
    EventBus.on(
      "userPreferenceChanged",
      (detail: {
        voicePreferences?: unknown;
        voiceChatbotId?: string | null;
      }) => {
        if (!detail || detail.voicePreferences === undefined) {
          return; // not a voice-preference event
        }
        if (
          detail.voiceChatbotId &&
          detail.voiceChatbotId !== this.chatbot.getID()
        ) {
          return; // another host's selection
        }
        // Re-read through the preference module (its cache is already
        // updated) so we apply a resolved voice object, not a bare id.
        this.userPreferences.getVoice(this.chatbot).then((voice) => {
          this.applySelectedVoice(voice ?? null);
        });
      }
    );
  }

  /**
   * Text-to-speech via Say, Pi requires authentication. When the user is signed
   * out AND there are no voices to offer (the /voices request returns [] on a
   * 401), the selector should present as unavailable / sign-in-required.
   * Providers that don't require Say, Pi auth (e.g. Pi.ai's own voices) still
   * return voices, so this stays false there — they must not be disabled.
   */
  protected ttsRequiresSignIn(noVoicesAvailable: boolean): boolean {
    return noVoicesAvailable && !getJwtManagerSync().isAuthenticated();
  }

  protected addIdVoiceMenu(element: HTMLElement): void {
    element.id = this.getId();
  }

  introduceVoice(voice: SpeechSynthesisVoiceRemote): void {
    // Prefer the free, server-served canned clip (design §4) whenever the catalog
    // provides one. Playing it costs NO TTS quota — the whole point of "choice by
    // ear should be free" — and it routes through the GATED preview channel so a
    // mid-turn voice change is suppressed rather than talking over live TTS / an
    // active call. This retires the metered live-TTS audition (below) for every
    // voice the catalog can pre-render; the metered path now survives only as the
    // fallback for voices with no clip (e.g. a user's private custom clone). It is
    // also the same sound the ▶ preview button plays, so both auditions agree.
    if (voice.sample_url) {
      EventBus.emit("audio:preview", { url: voice.sample_url });
      return;
    }

    // Built-in providers (Pi) supply their own free static intro clip per voice.
    if (voice.default && isBuiltInVoiceProvider(this.chatbot)) {
      const introductionUrl = this.chatbot.getVoiceIntroductionUrl(voice.id);
      if (introductionUrl) {
        // Play the introduction through the GATED preview channel so a mid-turn
        // voice change never talks over live TTS / an active call (it is
        // suppressed instead) — was an ungated audio:load.
        EventBus.emit("audio:preview", { url: introductionUrl });
      }
      return;
    }

    // Fallback — metered live-TTS synthesis, only for voices with no canned clip.
    // Introduce the custom voice through the SAME finalized streaming path the
    // conversation-turn TTS uses (open → send text → finalize), so the resulting
    // `…/speak/<id>/stream` source plays. A plain non-streaming createSpeech yields
    // a `…/speak/<id>` URL the audio-output parser rejects ("is not a streaming
    // speech URL"); an un-finalized stream 405s on playback — both left the intro
    // silent (#375). introduceVoice runs after setVoice persists, so the stream's
    // preferred voice is the just-selected voice.
    const lastMessage = getMostRecentAssistantMessage(this.chatbot);
    const name = voice.name.toLowerCase().replace(" ", "_");
    // Most SayPi voices have no voice-specific `voiceIntroduction_<name>` script
    // (only a couple do). On a fresh chat (no recent message to read back),
    // chrome.i18n.getMessage returns "" for the missing key, leaving the intro text
    // EMPTY — which synthesizes nothing (a blank stream the server 405s) and was a
    // root cause of the silent intro alongside the non-streaming URL (#375). Fall
    // back to a generic spoken introduction so every voice actually says something.
    const introduction =
      lastMessage?.text ||
      getMessage(`voiceIntroduction_${name}`) ||
      getMessage("voiceIntroductionGeneric", [voice.name]);
    if (!introduction || !introduction.trim()) {
      // Nothing to say — don't synthesize an empty stream (no audio + a 405).
      return;
    }
    const speechSynthesis = SpeechSynthesisModule.getInstance();
    speechSynthesis
      .createCompletedSpeechStream(introduction, this.chatbot)
      .then((utterance) => {
        utterance.voice = voice;
        // preview=true routes playback through the gated audio:preview channel
        // so this audition never talks over live TTS / an active call.
        speechSynthesis.speak(utterance, this.chatbot, true);
      });
  }

  /**
   * Returns the position from the end where the voice menu should be inserted in its parent container
   * @returns 0: append at the end of the container
   * @returns 1: insert as the second-to-last element
   * @returns 2: insert as the third-to-last element
   * etc.
   */
  getPositionFromEnd(): number {
    return 0;
  }
}

function parseSvgRoot(svgContent: string): SVGSVGElement {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
  return svgDoc.documentElement as unknown as SVGSVGElement;
}

export function addSvgToButton(
  button: HTMLElement,
  svgContent: string,
  ...classNames: string[]
): void {
  const sourceRoot = parseSvgRoot(svgContent);
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  // Move children from the source SVG into the new SVG to preserve attributes
  const children = Array.from(sourceRoot.childNodes);
  children.forEach((child) => svg.appendChild(child.cloneNode(true)));

  // Copy relevant attributes from the source root
  const attrs = [
    "viewBox",
    "fill",
    "stroke",
    "stroke-width",
    "stroke-linecap",
    "stroke-linejoin",
  ];
  attrs.forEach((attr) => {
    const value = sourceRoot.getAttribute(attr);
    if (value) svg.setAttribute(attr, value);
  });

  // If neither fill nor stroke were specified, default to currentColor fill
  if (!svg.getAttribute("fill") && !svg.getAttribute("stroke")) {
    svg.setAttribute("fill", "currentColor");
  }

  // Provide a sensible default viewBox for minimalist icons
  if (!svg.getAttribute("viewBox")) {
    svg.setAttribute("viewBox", "0 0 24 24");
  }

  classNames.forEach((className) => svg.classList.add(className));
  button.appendChild(svg);
}
