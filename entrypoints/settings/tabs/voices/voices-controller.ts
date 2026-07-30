import getMessage from "../../../../src/i18n";
import {
  audioProviders,
  SpeechSynthesisVoiceRemote,
} from "../../../../src/tts/SpeechModel";
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
  AuditionState,
  IDLE_AUDITION,
  PreviewSequencer,
} from "./previewSequencer";

export type { VoiceHostId } from "./voices-view-model";

export interface VoiceStudioDeps {
  getVoices(host: VoiceHostId): Promise<SpeechSynthesisVoiceRemote[]>;
  getVoice(host: VoiceHostId): Promise<SpeechSynthesisVoiceRemote | null>;
  setVoice(voice: SpeechSynthesisVoiceRemote, host: VoiceHostId): Promise<void>;
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
    onState: (state: AuditionState) => void
  ): void;
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

// The settings page runs outside any host tab, so every preference call MUST
// carry an explicit chatbot id — the no-arg default resolves to "web" here.
function defaultDeps(): VoiceStudioDeps {
  const speech = SpeechSynthesisModule.getInstance();
  const prefs = UserPreferenceModule.getInstance();
  return {
    getVoices: (host) => speech.getVoices(host),
    getVoice: (host) =>
      prefs.getVoice(host) as Promise<SpeechSynthesisVoiceRemote | null>,
    setVoice: (voice, host) => prefs.setVoice(voice, host).then(() => {}),
    isAuthenticated: () => getJwtManagerSync().isAuthenticated(),
    playPreview: (voice, onState) => {
      if (!voice.sample_url) return;
      if (!previewSequencer) previewSequencer = new PreviewSequencer();
      // One state line, handed to the newest requester. Safe now that the
      // line carries a snapshot naming the voice rather than a bare boolean.
      previewSubscription?.();
      previewSubscription = previewSequencer.subscribe(onState);
      // gain 1 until the soundprint pass measures voiced RMS (design §5.1).
      previewSequencer.play([
        { voiceId: voice.id, url: voice.sample_url, gain: 1 },
      ]);
    },
    loadPins: (host) => loadHostOverlay(host),
    setPinned: (host, voiceId, featuredIds, pin) =>
      setVoicePinned(host, voiceId, featuredIds, pin),
  };
}

/**
 * Renders the host-scoped voice "studio" in the settings Voices tab
 * (doc/plans/2026-07-07-voices-host-studio-design.md): host switcher → stage
 * (the current voice, tinted with its identity gradient) → menu slots (the
 * literal in-chat menu, from the same curateShortlist the in-host menu calls)
 * → explore shelves. The in-page menus stay short; this surface absorbs the
 * catalog's growth one host at a time.
 */
export class VoicesController {
  private deps!: VoiceStudioDeps;
  private readonly injectedDeps?: VoiceStudioDeps;
  private renderToken = 0;
  private activeHost: VoiceHostId;
  private body: HTMLElement | null = null;
  /** The last audition snapshot — the studio's only playback truth. */
  private auditionState: AuditionState = IDLE_AUDITION;
  private cache = new Map<VoiceHostId, HostStudioData>();
  private loading = new Map<VoiceHostId, Promise<HostStudioData>>();

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
    studio.innerHTML = "";
    studio.appendChild(this.renderSwitcher());
    this.body = document.createElement("div");
    this.body.classList.add("voice-studio-body");
    studio.appendChild(this.body);
    await this.render();
  }

  // --- host scope -----------------------------------------------------------

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
    void this.render();
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
    const [voices, current, overlay] = await Promise.all([
      this.deps.getVoices(host).catch(() => {
        failed = true;
        return [] as SpeechSynthesisVoiceRemote[];
      }),
      this.deps.getVoice(host).catch(() => null),
      this.deps.loadPins(host).catch(() => null),
    ]);
    return { voices, current, overlay, failed };
  }

  // --- painting -------------------------------------------------------------

  private paintBody(hostId: VoiceHostId, data: HostStudioData): void {
    if (!this.body) return;
    const body = this.body;
    body.classList.remove("voice-studio-loading");
    body.dataset.host = hostId;
    body.innerHTML = "";

    const vm = viewModel(hostId, data);

    if (vm.catalog.length === 0 && !vm.hasBuiltins) {
      body.appendChild(this.renderEmptyState(vm, data));
      return;
    }

    body.appendChild(this.renderStage(vm.stagedCurrent, vm));
    if (vm.menu) body.appendChild(this.renderSlotsSection(vm, vm.menu));
    body.appendChild(this.renderShelves(vm));

    // Playback state lives OUTSIDE the DOM — the sequencer owns it, and it
    // survives this repaint (choosing the voice you are listening to must not
    // stop the audio, design §5.2). Re-derive the marks from the snapshot, or
    // a clip goes on sounding with nothing on screen saying so.
    this.applyAuditionState();
  }

  private renderEmptyState(
    vm: StudioViewModel,
    data: HostStudioData
  ): HTMLElement {
    // Signed out → the /voices call 401s to []: prompt sign-in. Signed in,
    // a *failed* fetch is a transient error; a genuinely empty catalog is
    // its own (rarer) message — telling either user to sign in would be wrong.
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

  /**
   * The stage: the host's current voice, announced with real presence. The
   * voice's own identity gradient tints the room via CSS custom properties
   * (voices.css mixes them toward near-black to keep the text readable on
   * any voice color).
   */
  private renderStage(
    current: SpeechSynthesisVoiceRemote | null,
    vm: StudioViewModel
  ): HTMLElement {
    const stage = document.createElement("div");
    stage.classList.add("voice-stage");

    if (!current) return this.renderEmptyStage(stage, vm);

    const identity = getVoiceIdentity(current);
    stage.style.setProperty("--stage-from", identity.gradient[0]);
    stage.style.setProperty("--stage-to", identity.gradient[1]);

    stage.appendChild(this.renderOrb(current, "lg"));

    const meta = document.createElement("div");
    meta.classList.add("voice-stage-meta");

    const eyebrow = document.createElement("div");
    eyebrow.classList.add("voice-stage-eyebrow");
    // No data-i18n: substituted text (replaceI18n would strip the host name).
    eyebrow.textContent = getMessage("voicesSpeaksWith", [vm.host.label]);
    meta.appendChild(eyebrow);

    const name = document.createElement("div");
    name.classList.add("voice-stage-name");
    name.textContent = current.name;
    meta.appendChild(name);

    const subtitle = this.subtitleFor(current, vm.dupNames);
    if (subtitle.text) {
      const tagline = document.createElement("div");
      tagline.classList.add("voice-stage-tagline");
      if (subtitle.i18nKey) tagline.setAttribute("data-i18n", subtitle.i18nKey);
      tagline.textContent = subtitle.text;
      meta.appendChild(tagline);
    }

    const chips = document.createElement("div");
    chips.classList.add("voice-stage-chips");
    if (current.sample_url) {
      const play = document.createElement("button");
      play.type = "button";
      play.classList.add("voice-stage-play");
      play.setAttribute("data-i18n", "voicesStagePlay");
      play.textContent = getMessage("voicesStagePlay");
      play.addEventListener("click", () => this.audition(current));
      chips.appendChild(play);
    }
    if (getVoiceTier(current) === "hd") {
      chips.appendChild(this.renderTierChip());
    }
    // The chip is a second facet of the voice, not an echo of the first: on a
    // twin the subtitle IS the language sentence (#474), and printing it again
    // 15px lower makes the hero repeat itself.
    const langs = this.languagesSubtitle(current);
    if (langs && langs !== subtitle.text) {
      const lang = document.createElement("span");
      lang.classList.add("voice-stage-lang");
      lang.textContent = langs;
      chips.appendChild(lang);
    }
    if (chips.childNodes.length > 0) meta.appendChild(chips);

    stage.appendChild(meta);
    return stage;
  }

  /**
   * The stage with nothing on it — a hero that recruits, not a placeholder
   * that apologises. Two lines: an imperative headline (host-generic) and one
   * supporting line that MUST differ per host, because "no voice selected"
   * means opposite things.
   *
   * The choice is a HOST PROPERTY, not an id list: a host that serves its own
   * audio keeps speaking in its own voice until a Say, Pi voice replaces it; a
   * host with no voice of its own reads nothing aloud until one is chosen. A
   * third host therefore needs no new copy and no new branch here.
   *
   * The headline is the call to action — no button. The cards are already in
   * the same viewport of the settings window, so a control whose only job is
   * to scroll one screen would be chrome; "below" does the orienting work.
   */
  private renderEmptyStage(
    stage: HTMLElement,
    vm: StudioViewModel
  ): HTMLElement {
    stage.classList.add("voice-stage-empty");
    const meta = document.createElement("div");
    meta.classList.add("voice-stage-meta");

    const title = document.createElement("div");
    title.classList.add("voice-stage-empty-title");
    // No data-i18n on substituted text (replaceI18n clobber — see renderEmptyState).
    title.textContent = getMessage("voicesStageEmptyTitle", [vm.host.label]);
    meta.appendChild(title);

    const note = document.createElement("div");
    note.classList.add("voice-stage-empty-note");
    const hostServesItsOwnAudio =
      audioProviders.getDefaultForChatbot(vm.host.id) !== audioProviders.SayPi;
    note.textContent = getMessage(
      hostServesItsOwnAudio
        ? "voicesStageEmptyNoteReplace"
        : "voicesStageEmptyNoteSilent",
      [vm.host.label]
    );
    meta.appendChild(note);

    stage.appendChild(meta);
    return stage;
  }

  /**
   * The menu slots: the literal in-chat menu, in true order — rendered from
   * the same curateShortlist call the in-host menu makes, so what you see
   * here is exactly what chat shows. The current voice's seat is guaranteed
   * (grandfathering) and carries no remove control; fill-to-cap suggestions
   * on an un-customized host aren't pins, so they get no remove either
   * (unpinning them would be a dead no-op in the overlay model).
   */
  private renderSlotsSection(
    vm: StudioViewModel,
    menu: NonNullable<StudioViewModel["menu"]>
  ): HTMLElement {
    const section = document.createElement("div");
    section.classList.add("voice-slots-section");

    const head = document.createElement("div");
    head.classList.add("voice-slots-head");
    const title = document.createElement("span");
    title.classList.add("voice-slots-title");
    // No data-i18n on substituted text (replaceI18n clobber — see renderEmptyState).
    title.textContent = getMessage("voicesInHostMenu", [vm.host.label]);
    head.appendChild(title);
    const hint = document.createElement("span");
    hint.classList.add("voice-slots-hint");
    hint.setAttribute("data-i18n", "voicesMenuHint");
    hint.textContent = getMessage("voicesMenuHint");
    head.appendChild(hint);
    section.appendChild(head);

    const list = document.createElement("ul");
    list.classList.add("voice-slots");
    menu.seated.forEach((voice) => {
      list.appendChild(this.renderSlot(voice, vm));
    });
    section.appendChild(list);

    if (menu.overflowCount > 0) {
      const overflow = document.createElement("div");
      overflow.classList.add("voice-slots-overflow");
      // Chrome i18n has no plural forms, so the singular is its own key —
      // otherwise this reads "1 more pinned voices are waiting".
      overflow.textContent =
        menu.overflowCount === 1
          ? getMessage("voicesMenuOverflowOne", [String(menu.cap)])
          : getMessage("voicesMenuOverflow", [
              String(menu.overflowCount),
              String(menu.cap),
            ]);
      section.appendChild(overflow);
    }

    if (vm.hasBuiltins) {
      const builtins = document.createElement("div");
      builtins.classList.add("voice-slots-builtins");
      builtins.textContent = getMessage("voicesBuiltinsNote", [vm.host.label]);
      section.appendChild(builtins);
    }

    return section;
  }

  private renderSlot(
    voice: SpeechSynthesisVoiceRemote,
    vm: StudioViewModel
  ): HTMLElement {
    const slot = document.createElement("li");
    slot.classList.add("voice-slot");
    slot.dataset.voiceId = voice.id;

    slot.appendChild(this.renderOrb(voice, "sm"));

    const name = document.createElement("span");
    name.classList.add("voice-slot-name");
    name.textContent = voice.name;
    slot.appendChild(name);

    if (voice.id === vm.currentId) {
      slot.classList.add("voice-slot-current");
      const state = document.createElement("span");
      state.classList.add("voice-slot-state");
      state.setAttribute("data-i18n", "voicesSpeakingNow");
      state.textContent = getMessage("voicesSpeakingNow");
      slot.appendChild(state);
    } else if (vm.pinned.has(voice.id)) {
      const remove = document.createElement("button");
      remove.type = "button";
      remove.classList.add("voice-slot-remove");
      remove.setAttribute(
        "aria-label",
        getMessage("voicesRemoveVoiceFromMenu", [voice.name, vm.host.label])
      );
      remove.textContent = "×";
      remove.addEventListener("click", () => this.togglePinFor(voice));
      slot.appendChild(remove);
    }
    return slot;
  }

  private renderShelves(vm: StudioViewModel): HTMLElement {
    const shelves = document.createElement("div");
    shelves.classList.add("voice-shelves");

    const hd = vm.catalog.filter((voice) => getVoiceTier(voice) === "hd");
    const everyday = vm.catalog.filter(
      (voice) => getVoiceTier(voice) === "everyday"
    );

    if (hd.length > 0 && everyday.length > 0) {
      // Studio-only blurbs. `hdVoicesAllowanceNote` is deliberately NOT reused
      // here: it is also the HD chip tooltip and Claude's in-chat menu
      // footnote, where no Everyday shelf sits beside it to carry the ratio.
      // Here the HD shelf leads with what you get and the trade is stated once,
      // one line below, where it reads as a gain.
      shelves.appendChild(
        this.renderShelf("hd", "voicesShelfHd", "voicesShelfHdBlurb", hd, vm)
      );
      shelves.appendChild(
        this.renderShelf(
          "everyday",
          "voicesShelfEveryday",
          "voicesShelfEverydayBlurb",
          everyday,
          vm
        )
      );
    } else {
      // Single-tier catalog: a flat grid, no shelf chrome.
      shelves.appendChild(this.renderCardGrid(vm.catalog, vm));
    }
    return shelves;
  }

  private renderShelf(
    tierKey: string,
    titleKey: string,
    blurbKey: string,
    voices: SpeechSynthesisVoiceRemote[],
    vm: StudioViewModel
  ): HTMLElement {
    const shelf = document.createElement("section");
    shelf.classList.add("voice-shelf");
    shelf.dataset.tier = tierKey;

    const head = document.createElement("div");
    head.classList.add("voice-shelf-head");
    const title = document.createElement("span");
    title.classList.add("voice-shelf-title");
    title.setAttribute("data-i18n", titleKey);
    title.textContent = getMessage(titleKey);
    head.appendChild(title);
    const blurb = document.createElement("span");
    blurb.classList.add("voice-shelf-blurb");
    blurb.setAttribute("data-i18n", blurbKey);
    blurb.textContent = getMessage(blurbKey);
    head.appendChild(blurb);
    shelf.appendChild(head);

    shelf.appendChild(this.renderCardGrid(voices, vm));
    return shelf;
  }

  private renderCardGrid(
    voices: SpeechSynthesisVoiceRemote[],
    vm: StudioViewModel
  ): HTMLElement {
    const grid = document.createElement("ul");
    grid.classList.add("voice-card-grid");
    voices.forEach((voice) => grid.appendChild(this.renderCard(voice, vm)));
    return grid;
  }

  private renderCard(
    voice: SpeechSynthesisVoiceRemote,
    vm: StudioViewModel
  ): HTMLElement {
    const card = document.createElement("li");
    card.classList.add("voice-card");
    card.dataset.voiceId = voice.id;
    const isCurrent = voice.id === vm.currentId;
    if (isCurrent) card.classList.add("voice-card-current");

    if (getVoiceTier(voice) === "hd") {
      card.appendChild(this.renderTierChip());
    }

    card.appendChild(this.renderOrb(voice, "md"));

    const name = document.createElement("span");
    name.classList.add("voice-card-name");
    name.textContent = voice.name;
    card.appendChild(name);

    const subtitle = this.subtitleFor(voice, vm.dupNames);
    const tagline = document.createElement("span");
    tagline.classList.add("voice-card-tagline");
    if (subtitle.i18nKey) tagline.setAttribute("data-i18n", subtitle.i18nKey);
    tagline.textContent = subtitle.text;
    // The card clamps this to two lines (voices.css), and on a twin the clipped
    // text is the ONLY thing telling two same-named cards apart — nothing else
    // in the card carries it. `title` is not touched by replaceI18n, so it
    // survives a re-localization pass; a long locale gets it for free too.
    if (subtitle.text) tagline.title = subtitle.text;
    card.appendChild(tagline);

    const actions = document.createElement("div");
    actions.classList.add("voice-card-actions");
    // No menu, no pinning: on a host with nowhere to pin TO, the control would
    // write an overlay nothing ever reads.
    if (vm.menu) actions.appendChild(this.renderPinToggle(voice, vm));
    if (isCurrent) {
      const state = document.createElement("span");
      state.classList.add("voice-card-state");
      state.setAttribute("data-i18n", "voicesSpeakingNow");
      state.textContent = getMessage("voicesSpeakingNow");
      actions.appendChild(state);
    } else {
      const use = document.createElement("button");
      use.type = "button";
      use.classList.add("voice-use");
      use.setAttribute(
        "aria-label",
        getMessage("voicesUseOnHost", [voice.name, vm.host.label])
      );
      use.setAttribute("data-i18n", "voicesUseShort");
      use.textContent = getMessage("voicesUseShort");
      use.addEventListener("click", () => this.useVoice(voice));
      actions.appendChild(use);
    }
    card.appendChild(actions);
    return card;
  }

  private renderPinToggle(
    voice: SpeechSynthesisVoiceRemote,
    vm: StudioViewModel
  ): HTMLButtonElement {
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.classList.add("voice-pin-toggle");
    this.applyPinToggleState(toggle, voice, vm);
    toggle.addEventListener("click", () => this.togglePinFor(voice));
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

  private renderTierChip(): HTMLElement {
    const chip = document.createElement("span");
    chip.classList.add("voice-tier-chip");
    chip.textContent = "HD";
    return chip;
  }

  /**
   * The identity mark. With a sample clip it IS the play button (sound first
   * — design §4); without one it renders as a static mark, never a dead
   * control. `data-orb-voice` links every mark of one voice so they animate
   * together while its sample plays.
   */
  private renderOrb(
    voice: SpeechSynthesisVoiceRemote,
    size: "sm" | "md" | "lg"
  ): HTMLElement {
    const identity = getVoiceIdentity(voice);
    const playable = Boolean(voice.sample_url);
    const orb = document.createElement(playable ? "button" : "div");
    orb.classList.add("voice-orb", `voice-orb-${size}`);
    orb.style.background = `linear-gradient(135deg, ${identity.gradient[0]}, ${identity.gradient[1]})`;
    if (!playable) {
      orb.classList.add("voice-orb-static");
      return orb;
    }
    const button = orb as HTMLButtonElement;
    button.type = "button";
    button.dataset.orbVoice = voice.id;
    button.setAttribute(
      "aria-label",
      getMessage("voicesPreview", [voice.name])
    );
    button.innerHTML =
      '<span class="voice-orb-tri" aria-hidden="true"></span>' +
      '<span class="voice-orb-eq" aria-hidden="true"><i></i><i></i><i></i></span>';
    button.addEventListener("click", () => this.audition(voice));
    return button;
  }

  // --- behaviour ------------------------------------------------------------

  private audition(voice: SpeechSynthesisVoiceRemote): void {
    this.deps.playPreview(voice, (state) => {
      this.auditionState = state;
      this.applyAuditionState();
    });
  }

  /**
   * Paint the audition snapshot onto whatever marks are currently in the DOM.
   *
   * Clear-all-then-mark-one rather than a per-voice toggle: the snapshot's
   * whole point is that exactly one voice can be playing, so the DOM is
   * derived from it wholesale instead of patched per caller.
   */
  private applyAuditionState(): void {
    this.container
      .querySelectorAll("[data-orb-voice].playing")
      .forEach((orb) => orb.classList.remove("playing"));
    const playing = this.auditionState.playingVoiceId;
    if (!playing) return;
    this.container
      .querySelectorAll(`[data-orb-voice="${escapeCss(playing)}"]`)
      .forEach((orb) => orb.classList.add("playing"));
  }

  /**
   * Metadata fallback for voices without an authored tagline — and the
   * tiebreaker for twin display names (#474), where a shared persona tagline
   * can't tell two cards apart.
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

  /**
   * Pinning updates in place — the slots section re-renders and every card's
   * pin button is patched, but the shelves aren't rebuilt, so keyboard focus
   * and scroll survive the headline interaction. Optimistic: the cached
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

  /** Re-derive slots + pin-button states from the cached data, in place. */
  private refreshCuration(data: HostStudioData): void {
    if (!this.body) return;
    const vm = viewModel(this.activeHost, data);
    const slots = this.body.querySelector(".voice-slots-section");
    if (slots && vm.menu) slots.replaceWith(this.renderSlotsSection(vm, vm.menu));
    this.body.querySelectorAll<HTMLElement>(".voice-card").forEach((card) => {
      const toggle = card.querySelector<HTMLButtonElement>(".voice-pin-toggle");
      if (!toggle) return;
      const id = card.dataset.voiceId ?? "";
      const name = card.querySelector(".voice-card-name")?.textContent ?? "";
      this.applyPinToggleState(toggle, { id, name }, vm);
    });
  }

  /**
   * Selecting a voice moves the stage, the slots, and the card states, so
   * this one repaints the studio body (from cache — instant).
   */
  private async useVoice(voice: SpeechSynthesisVoiceRemote): Promise<void> {
    const host = this.activeHost;
    await this.deps.setVoice(voice, host);
    const data = this.cache.get(host);
    if (data) data.current = voice;
    await this.render();
  }
}
