import getMessage from "../../../../src/i18n";
import { SpeechSynthesisVoiceRemote } from "../../../../src/tts/SpeechModel";
import { SpeechSynthesisModule } from "../../../../src/tts/SpeechSynthesisModule";
import { UserPreferenceModule } from "../../../../src/prefs/PreferenceModule";
import { getJwtManagerSync } from "../../../../src/JwtManager";
import type { ChatbotId } from "../../../../src/chatbots/ChatbotIdentifier";
import {
  HostPinOverlay,
  loadHostOverlay,
  serverFeaturedIds,
  setVoicePinned,
} from "../../../../src/tts/VoicePins";
import {
  HostCatalog,
  HostVoiceState,
  UnifiedVoiceRow,
  unifyHostCatalogs,
} from "../../../../src/tts/VoiceCatalogUnify";

/**
 * The hosts with a SayPi voice picker. ChatGPT is a deliberate non-goal (it
 * uses OpenAI's native read-aloud — doc/plans/2026-07-02-voice-selection-ux.md §3).
 */
export type VoiceHostId = Extract<ChatbotId, "pi" | "claude">;

/**
 * The pinnable hosts, in display order. Host-generic: a third host (once SayPi
 * TTS reaches it) is one more line here, not a schema change — pins, unify, and
 * the row model all key on the host id.
 */
const VOICE_HOSTS: ReadonlyArray<{
  id: VoiceHostId;
  label: string;
  logo: string;
}> = [
  { id: "pi", label: "Pi", logo: "/icons/logos/pi.png" },
  { id: "claude", label: "Claude", logo: "/icons/logos/claude.png" },
];

export interface VoiceCatalogDeps {
  getVoices(host: VoiceHostId): Promise<SpeechSynthesisVoiceRemote[]>;
  getVoice(host: VoiceHostId): Promise<SpeechSynthesisVoiceRemote | null>;
  setVoice(voice: SpeechSynthesisVoiceRemote, host: VoiceHostId): Promise<void>;
  isAuthenticated(): boolean;
  /** Play the voice's free canned sample clip (design §4). No-op without one. */
  playPreview(voice: SpeechSynthesisVoiceRemote): void;
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
// in-flight one.
let previewAudio: HTMLAudioElement | null = null;
function playPreviewClip(url: string): void {
  if (!previewAudio) previewAudio = new Audio();
  previewAudio.pause();
  previewAudio.src = url;
  // A blocked/failed preview is a non-event, not an error the user must see.
  void previewAudio.play().catch(() => {});
}

// The settings page runs outside any host tab, so every preference call MUST
// carry an explicit chatbot id — the no-arg default resolves to "web" here.
function defaultDeps(): VoiceCatalogDeps {
  const speech = SpeechSynthesisModule.getInstance();
  const prefs = UserPreferenceModule.getInstance();
  return {
    getVoices: (host) => speech.getVoices(host),
    getVoice: (host) =>
      prefs.getVoice(host) as Promise<SpeechSynthesisVoiceRemote | null>,
    setVoice: (voice, host) => prefs.setVoice(voice, host).then(() => {}),
    isAuthenticated: () => getJwtManagerSync().isAuthenticated(),
    playPreview: (voice) => {
      if (voice.sample_url) playPreviewClip(voice.sample_url);
    },
    loadPins: (host) => loadHostOverlay(host),
    setPinned: (host, voiceId, featuredIds, pin) =>
      setVoicePinned(host, voiceId, featuredIds, pin),
  };
}

/**
 * Renders ONE unified cross-host voice catalog in the settings Voices tab. Each
 * row carries per-host pin toggles (which define the in-host shortlist) and a
 * per-host Use action; host-serveability is derived from catalog membership.
 * The in-page menus stay short; this surface absorbs the catalog's growth.
 */
export class VoicesController {
  private deps!: VoiceCatalogDeps;
  private readonly injectedDeps?: VoiceCatalogDeps;
  private renderToken = 0;
  /** host id → that host's default pin set (server `featured`), for toggles. */
  private featuredByHost = new Map<string, string[]>();

  constructor(private container: HTMLElement, deps?: VoiceCatalogDeps) {
    this.injectedDeps = deps;
  }

  async init(): Promise<void> {
    // Resolved lazily so constructing the controller is side-effect-free.
    this.deps = this.injectedDeps ?? defaultDeps();
    await this.render();
  }

  /**
   * Gather every host's catalog + current voice + pin overlay, unify them, and
   * paint. Per-host resilient: one host's fetch failing degrades to that host
   * contributing nothing, never blanking the other.
   */
  private async render(): Promise<void> {
    const token = ++this.renderToken;
    const catalogs = await Promise.all(
      VOICE_HOSTS.map(async ({ id }): Promise<HostCatalog> => {
        const [voices, current, overlay] = await Promise.all([
          this.deps.getVoices(id).catch(() => []),
          this.deps.getVoice(id).catch(() => null),
          this.deps.loadPins(id).catch(() => null),
        ]);
        return { hostId: id, voices, currentId: current?.id ?? null, overlay };
      })
    );
    if (token !== this.renderToken) return; // a newer render superseded us

    this.featuredByHost = new Map(
      catalogs.map((c) => [c.hostId, serverFeaturedIds(c.voices)])
    );
    this.renderCatalog(unifyHostCatalogs(catalogs));
  }

  private renderCatalog(rows: UnifiedVoiceRow[]): void {
    const catalog = this.container.querySelector<HTMLElement>("#voice-catalog");
    if (!catalog) return;
    catalog.innerHTML = "";

    if (rows.length === 0) {
      // Signed out → both /voices calls 401 → []: prompt sign-in. Signed in
      // with nothing selectable means the fetch failed (or the whole catalog
      // retired) — telling an authenticated user to sign in would be wrong.
      const emptyKey = this.deps.isAuthenticated()
        ? "voicesNoneAvailable"
        : "signInForTTS";
      const empty = document.createElement("div");
      empty.classList.add("voice-catalog-empty", "description");
      empty.setAttribute("data-i18n", emptyKey);
      empty.textContent = getMessage(emptyKey);
      catalog.appendChild(empty);
      return;
    }

    const hd = rows.filter((row) => row.tier === "hd");
    const everyday = rows.filter((row) => row.tier === "everyday");

    if (hd.length > 0 && everyday.length > 0) {
      catalog.appendChild(
        this.renderShelf("hd", "voicesShelfHd", "hdVoicesAllowanceNote", hd)
      );
      catalog.appendChild(
        this.renderShelf(
          "everyday",
          "voicesShelfEveryday",
          "voicesShelfEverydayBlurb",
          everyday
        )
      );
    } else {
      // Single-tier catalog (today's state): a flat list, no shelf chrome.
      catalog.appendChild(this.renderList(rows));
    }
  }

  private renderShelf(
    tierKey: string,
    titleKey: string,
    blurbKey: string,
    rows: UnifiedVoiceRow[]
  ): HTMLElement {
    const shelf = document.createElement("div");
    shelf.classList.add("voice-shelf", `voice-shelf-${tierKey}`);

    const header = document.createElement("div");
    header.classList.add("voice-shelf-header");
    const title = document.createElement("span");
    title.classList.add("voice-shelf-title");
    title.setAttribute("data-i18n", titleKey);
    title.textContent = getMessage(titleKey);
    header.appendChild(title);
    const blurb = document.createElement("span");
    blurb.classList.add("voice-shelf-blurb", "description");
    blurb.setAttribute("data-i18n", blurbKey);
    blurb.textContent = getMessage(blurbKey);
    header.appendChild(blurb);
    shelf.appendChild(header);

    shelf.appendChild(this.renderList(rows));
    return shelf;
  }

  private renderList(rows: UnifiedVoiceRow[]): HTMLElement {
    const list = document.createElement("ul");
    list.classList.add("voice-list");
    rows.forEach((row) => list.appendChild(this.renderRow(row)));
    return list;
  }

  private renderRow(row: UnifiedVoiceRow): HTMLElement {
    const voice = row.voice;
    const li = document.createElement("li");
    li.classList.add("voice-row");
    li.dataset.voiceId = voice.id;

    const main = document.createElement("div");
    main.classList.add("voice-row-main");
    const name = document.createElement("span");
    name.classList.add("voice-row-name");
    name.textContent = voice.name;
    main.appendChild(name);
    const subtitle = voice.description || this.languagesSubtitle(voice);
    if (subtitle) {
      const description = document.createElement("span");
      description.classList.add("voice-row-desc", "description");
      description.textContent = subtitle;
      main.appendChild(description);
    }
    li.appendChild(main);

    // Choice by ear (design §4): a free ▶ preview, its own target separate from
    // "Use this voice", rendered only when the server serves a sample clip.
    if (voice.sample_url) {
      const preview = document.createElement("button");
      preview.type = "button";
      preview.classList.add("voice-preview");
      preview.setAttribute("aria-label", getMessage("voicesPreview", [voice.name]));
      preview.innerHTML =
        '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path fill="currentColor" d="M8 5v14l11-7z"></path></svg>';
      preview.addEventListener("click", () => this.deps.playPreview(voice));
      li.appendChild(preview);
    }

    const hosts = document.createElement("div");
    hosts.classList.add("voice-row-hosts");
    row.hosts.forEach((state) => {
      if (state.serveable) hosts.appendChild(this.renderHostControls(voice, state));
    });
    li.appendChild(hosts);

    return li;
  }

  /**
   * Per-host controls for one voice: a pin toggle (defines the in-host
   * shortlist for that host) plus a Use action — or an "in use" badge when the
   * voice is already that host's current selection. Grouped and labelled by
   * host so the two hosts stay legible on one row.
   */
  private renderHostControls(
    voice: SpeechSynthesisVoiceRemote,
    state: HostVoiceState
  ): HTMLElement {
    const meta = VOICE_HOSTS.find((h) => h.id === state.hostId)!;
    const group = document.createElement("div");
    group.classList.add("voice-host-controls");
    group.dataset.host = state.hostId;

    const label = document.createElement("span");
    label.classList.add("voice-host-label");
    const logo = document.createElement("img");
    logo.classList.add("voice-host-logo");
    logo.src = meta.logo;
    logo.alt = "";
    logo.setAttribute("aria-hidden", "true");
    label.appendChild(logo);
    label.appendChild(document.createTextNode(meta.label));
    group.appendChild(label);

    const pin = document.createElement("button");
    pin.type = "button";
    pin.classList.add("voice-pin");
    pin.classList.toggle("pinned", state.pinned);
    pin.setAttribute("aria-pressed", String(state.pinned));
    pin.setAttribute(
      "aria-label",
      getMessage("voicesPinToHost", [voice.name, meta.label])
    );
    pin.innerHTML =
      '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path fill="currentColor" d="M14 4v5l2 3v2h-5v5l-1 1-1-1v-5H4v-2l2-3V4a2 2 0 0 1-1-2h10a2 2 0 0 1-1 2z"></path></svg>';
    pin.addEventListener("click", () =>
      this.togglePin(pin, voice, meta.id, state.hostId)
    );
    group.appendChild(pin);

    if (state.isCurrent) {
      const badge = document.createElement("span");
      badge.classList.add("voice-current-badge");
      badge.setAttribute("data-i18n", "voicesCurrent");
      badge.textContent = getMessage("voicesCurrent");
      group.appendChild(badge);
    } else {
      const use = document.createElement("button");
      use.type = "button";
      use.classList.add("voice-use");
      use.setAttribute(
        "aria-label",
        getMessage("voicesUseOnHost", [voice.name, meta.label])
      );
      use.setAttribute("data-i18n", "voicesUseShort");
      use.textContent = getMessage("voicesUseShort");
      use.addEventListener("click", () => this.useVoice(voice, meta.id));
      group.appendChild(use);
    }
    return group;
  }

  /**
   * Metadata fallback for rows whose voice carries no server description.
   * Language coverage is what genuinely separates otherwise identically-named
   * variants — the pi catalog serves two "Paola"s (#474).
   */
  private languagesSubtitle(voice: SpeechSynthesisVoiceRemote): string {
    const count = voice.languages?.length ?? 0;
    return count > 1
      ? getMessage("voiceSpeaksNLanguages", [String(count)])
      : "";
  }

  /**
   * Pinning has no cross-row effect and never regroups the shelves, so the
   * toggle flips IN PLACE — no re-render, so keyboard focus and scroll survive
   * the interaction. Optimistic: revert the visual if the write fails.
   */
  private async togglePin(
    pinBtn: HTMLButtonElement,
    voice: SpeechSynthesisVoiceRemote,
    host: VoiceHostId,
    hostId: string
  ): Promise<void> {
    const nowPinned = pinBtn.getAttribute("aria-pressed") !== "true";
    pinBtn.setAttribute("aria-pressed", String(nowPinned));
    pinBtn.classList.toggle("pinned", nowPinned);
    try {
      await this.deps.setPinned(
        host,
        voice.id,
        this.featuredByHost.get(hostId) ?? [],
        nowPinned
      );
    } catch (error) {
      pinBtn.setAttribute("aria-pressed", String(!nowPinned));
      pinBtn.classList.toggle("pinned", !nowPinned);
      console.error("Failed to update voice pin", error);
    }
  }

  /**
   * Selecting a voice moves the "in use" badge between two rows, so this one
   * re-renders (re-reading the stored voice) rather than patching in place.
   */
  private async useVoice(
    voice: SpeechSynthesisVoiceRemote,
    host: VoiceHostId
  ): Promise<void> {
    await this.deps.setVoice(voice, host);
    await this.render();
  }
}
