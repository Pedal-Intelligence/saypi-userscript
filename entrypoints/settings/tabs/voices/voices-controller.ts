import getMessage from "../../../../src/i18n";
import { SpeechSynthesisVoiceRemote } from "../../../../src/tts/SpeechModel";
import { SpeechSynthesisModule } from "../../../../src/tts/SpeechSynthesisModule";
import { UserPreferenceModule } from "../../../../src/prefs/PreferenceModule";
import { getJwtManagerSync } from "../../../../src/JwtManager";
import type { ChatbotId } from "../../../../src/chatbots/ChatbotIdentifier";
import {
  HostPinOverlay,
  loadHostOverlay,
  resolvePinnedIds,
  serverFeaturedIds,
  setVoicePinned,
  togglePin,
} from "../../../../src/tts/VoicePins";
import {
  CLAUDE_MENU_CAP,
  PI_MENU_CAP,
  curateShortlist,
  getVoiceTier,
  visibleCatalog,
} from "../../../../src/tts/VoiceCuration";
import { getVoiceIdentity } from "../../../../src/tts/VoiceIdentity";

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
const VOICE_HOSTS: ReadonlyArray<{
  id: VoiceHostId;
  label: string;
  logo: string;
  menuCap: number;
}> = [
  { id: "pi", label: "Pi", logo: "/icons/logos/pi.png", menuCap: PI_MENU_CAP },
  {
    id: "claude",
    label: "Claude",
    logo: "/icons/logos/claude.png",
    menuCap: CLAUDE_MENU_CAP,
  },
];

/** Last-viewed studio host, so reopening settings lands where you left off. */
const LAST_HOST_KEY = "saypi.settings.voicesHost";

export interface VoiceStudioDeps {
  getVoices(host: VoiceHostId): Promise<SpeechSynthesisVoiceRemote[]>;
  getVoice(host: VoiceHostId): Promise<SpeechSynthesisVoiceRemote | null>;
  setVoice(voice: SpeechSynthesisVoiceRemote, host: VoiceHostId): Promise<void>;
  isAuthenticated(): boolean;
  /**
   * Play the voice's free canned sample clip (design §4). Reports playback
   * state through `onState` so every orb of that voice can animate. No-op
   * for voices without a sample.
   */
  playPreview(
    voice: SpeechSynthesisVoiceRemote,
    onState: (playing: boolean) => void
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
// machine, no live TTS, no active call to collide with — so a preview here
// plays straight through a single reused <audio> element. Reusing one element
// gives single-preview semantics for free: starting a new sample stops any
// in-flight one. The state-callback line is handed to the newest requester so
// exactly one voice ever shows as playing.
let previewAudio: HTMLAudioElement | null = null;
let previewOnState: ((playing: boolean) => void) | null = null;
function playPreviewClip(
  url: string,
  onState: (playing: boolean) => void
): void {
  if (!previewAudio) previewAudio = new Audio();
  previewAudio.pause();
  previewOnState?.(false);
  previewOnState = onState;
  const audio = previewAudio;
  audio.onplay = () => previewOnState?.(true);
  audio.onpause = () => previewOnState?.(false);
  audio.onended = () => previewOnState?.(false);
  audio.onerror = () => previewOnState?.(false);
  audio.src = url;
  // A blocked/failed preview is a non-event, not an error the user must see.
  void audio.play().catch(() => previewOnState?.(false));
}

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
      if (voice.sample_url) playPreviewClip(voice.sample_url, onState);
    },
    loadPins: (host) => loadHostOverlay(host),
    setPinned: (host, voiceId, featuredIds, pin) =>
      setVoicePinned(host, voiceId, featuredIds, pin),
  };
}

interface HostStudioData {
  voices: SpeechSynthesisVoiceRemote[];
  current: SpeechSynthesisVoiceRemote | null;
  overlay: HostPinOverlay | null;
  /** The voices fetch itself failed (network/API) — distinct from empty. */
  failed: boolean;
}

/** Everything one paint needs, derived fresh from a host's cached data. */
interface StudioViewModel {
  host: (typeof VOICE_HOSTS)[number];
  /** Selectable catalog: visible (deprecation-aware), minus host built-ins. */
  catalog: SpeechSynthesisVoiceRemote[];
  /** Host-owned built-ins exist (e.g. Pi's) — they get a note, not cards. */
  hasBuiltins: boolean;
  currentId: string | null;
  featuredIds: string[];
  /** The resolved pin set (server defaults ⊕ user overlay). */
  pinned: Set<string>;
  /** The literal in-chat menu, in true order. */
  seated: SpeechSynthesisVoiceRemote[];
  /** Pins that exist but don't fit the menu cap (legacy overflow). */
  overflowCount: number;
  /** current + pins have consumed every seat — no room to pin more. */
  menuFull: boolean;
  /** Display names appearing more than once (the twin-Paola problem, #474). */
  dupNames: Set<string>;
}

const escapeCss = (value: string) =>
  typeof CSS !== "undefined" && CSS.escape
    ? CSS.escape(value)
    : value.replace(/["\\]/g, "\\$&");

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

  // --- view model -----------------------------------------------------------

  private viewModel(
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

    const featuredIds = serverFeaturedIds(catalog);
    const customized = data.overlay !== null;
    const pinned = customized
      ? resolvePinnedIds(featuredIds, data.overlay)
      : new Set(featuredIds);
    const shortlist = curateShortlist(
      catalog,
      currentId,
      host.menuCap,
      customized ? pinned : null
    );
    const seatedIds = new Set(shortlist.voices.map((voice) => voice.id));
    const catalogIds = new Set(catalog.map((voice) => voice.id));
    const overflowCount = [...pinned].filter(
      (id) => catalogIds.has(id) && !seatedIds.has(id)
    ).length;
    // "Full" counts committed seats only (current + pins) — fill-to-cap
    // suggestions on an un-customized host must never block pinning.
    const committedSeats = shortlist.voices.filter(
      (voice) => voice.id === currentId || pinned.has(voice.id)
    ).length;
    const menuFull = committedSeats >= host.menuCap;

    const nameCounts = new Map<string, number>();
    catalog.forEach((voice) => {
      const name = String(voice.name ?? "").toLowerCase();
      nameCounts.set(name, (nameCounts.get(name) ?? 0) + 1);
    });
    const dupNames = new Set(
      [...nameCounts.entries()].filter(([, n]) => n > 1).map(([name]) => name)
    );

    return {
      host,
      catalog,
      hasBuiltins,
      currentId,
      featuredIds,
      pinned,
      seated: shortlist.voices,
      overflowCount,
      menuFull,
      dupNames,
    };
  }

  // --- painting -------------------------------------------------------------

  private paintBody(hostId: VoiceHostId, data: HostStudioData): void {
    if (!this.body) return;
    const body = this.body;
    body.classList.remove("voice-studio-loading");
    body.dataset.host = hostId;
    body.innerHTML = "";

    const vm = this.viewModel(hostId, data);

    if (vm.catalog.length === 0 && !vm.hasBuiltins) {
      body.appendChild(this.renderEmptyState(vm, data));
      return;
    }

    body.appendChild(this.renderStage(data.current, vm));
    body.appendChild(this.renderSlotsSection(vm));
    body.appendChild(this.renderShelves(vm));
  }

  private renderEmptyState(
    vm: StudioViewModel,
    data: HostStudioData
  ): HTMLElement {
    // Signed out → the /voices call 401s to []: prompt sign-in. Signed in,
    // a *failed* fetch is a transient error; a genuinely empty catalog is
    // its own (rarer) message — telling either user to sign in would be wrong.
    const empty = document.createElement("div");
    empty.classList.add("voice-studio-empty", "description");
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
    empty.setAttribute("data-i18n", key);
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

    if (!current) {
      stage.classList.add("voice-stage-empty");
      stage.setAttribute("data-i18n", "voicesNoStageVoice");
      stage.textContent = getMessage("voicesNoStageVoice");
      return stage;
    }

    const identity = getVoiceIdentity(current);
    stage.style.setProperty("--stage-from", identity.gradient[0]);
    stage.style.setProperty("--stage-to", identity.gradient[1]);

    stage.appendChild(this.renderOrb(current, "lg"));

    const meta = document.createElement("div");
    meta.classList.add("voice-stage-meta");

    const eyebrow = document.createElement("div");
    eyebrow.classList.add("voice-stage-eyebrow");
    eyebrow.setAttribute("data-i18n", "voicesSpeaksWith");
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
    const langs = this.languagesSubtitle(current);
    if (langs) {
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
   * The menu slots: the literal in-chat menu, in true order — rendered from
   * the same curateShortlist call the in-host menu makes, so what you see
   * here is exactly what chat shows. The current voice's seat is guaranteed
   * (grandfathering) and carries no remove control; fill-to-cap suggestions
   * on an un-customized host aren't pins, so they get no remove either
   * (unpinning them would be a dead no-op in the overlay model).
   */
  private renderSlotsSection(vm: StudioViewModel): HTMLElement {
    const section = document.createElement("div");
    section.classList.add("voice-slots-section");

    const head = document.createElement("div");
    head.classList.add("voice-slots-head");
    const title = document.createElement("span");
    title.classList.add("voice-slots-title");
    title.setAttribute("data-i18n", "voicesInHostMenu");
    title.textContent = getMessage("voicesInHostMenu", [vm.host.label]);
    head.appendChild(title);
    const hint = document.createElement("span");
    hint.classList.add("voice-slots-hint", "description");
    hint.setAttribute("data-i18n", "voicesMenuHint");
    hint.textContent = getMessage("voicesMenuHint");
    head.appendChild(hint);
    section.appendChild(head);

    const list = document.createElement("ul");
    list.classList.add("voice-slots");
    vm.seated.forEach((voice) => {
      list.appendChild(this.renderSlot(voice, vm));
    });
    section.appendChild(list);

    if (vm.overflowCount > 0) {
      const overflow = document.createElement("div");
      overflow.classList.add("voice-slots-overflow", "description");
      overflow.setAttribute("data-i18n", "voicesMenuOverflow");
      overflow.textContent = getMessage("voicesMenuOverflow", [
        String(vm.overflowCount),
        String(vm.host.menuCap),
      ]);
      section.appendChild(overflow);
    }

    if (vm.hasBuiltins) {
      const builtins = document.createElement("div");
      builtins.classList.add("voice-slots-builtins", "description");
      builtins.setAttribute("data-i18n", "voicesBuiltinsNote");
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
      shelves.appendChild(
        this.renderShelf("hd", "voicesShelfHd", "hdVoicesAllowanceNote", hd, vm)
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
    blurb.classList.add("voice-shelf-blurb", "description");
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
    card.appendChild(tagline);

    const actions = document.createElement("div");
    actions.classList.add("voice-card-actions");
    actions.appendChild(this.renderPinToggle(voice, vm));
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
    const disabled = !pressed && vm.menuFull;
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
    this.deps.playPreview(voice, (playing) => {
      this.container
        .querySelectorAll(`[data-orb-voice="${escapeCss(voice.id)}"]`)
        .forEach((orb) => orb.classList.toggle("playing", playing));
    });
  }

  /**
   * Metadata fallback for voices without an authored tagline — and the
   * tiebreaker for twin display names (#474): when a name appears twice,
   * metadata (description/languages) differentiates where a shared persona
   * tagline can't.
   */
  private subtitleFor(
    voice: SpeechSynthesisVoiceRemote,
    dupNames: Set<string>
  ): { text: string; i18nKey?: string } {
    const meta = voice.description || this.languagesSubtitle(voice);
    if (dupNames.has(String(voice.name ?? "").toLowerCase()) && meta) {
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
    const count = voice.languages?.length ?? 0;
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
    const vm = this.viewModel(host, data);
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
    const vm = this.viewModel(this.activeHost, data);
    const slots = this.body.querySelector(".voice-slots-section");
    if (slots) slots.replaceWith(this.renderSlotsSection(vm));
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

function resolveInitialHost(hint?: string | null): VoiceHostId {
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
