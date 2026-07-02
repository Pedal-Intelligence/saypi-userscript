import getMessage from "../../../../src/i18n";
import { SpeechSynthesisVoiceRemote } from "../../../../src/tts/SpeechModel";
import { getVoiceTier } from "../../../../src/tts/VoiceCuration";
import { SpeechSynthesisModule } from "../../../../src/tts/SpeechSynthesisModule";
import { UserPreferenceModule } from "../../../../src/prefs/PreferenceModule";
import { getJwtManagerSync } from "../../../../src/JwtManager";
import type { ChatbotId } from "../../../../src/chatbots/ChatbotIdentifier";

/**
 * The hosts with a SayPi voice picker. ChatGPT is a deliberate non-goal (it
 * uses OpenAI's native read-aloud — doc/plans/2026-07-02-voice-selection-ux.md §3).
 */
export type VoiceHostId = Extract<ChatbotId, "pi" | "claude">;

export interface VoiceCatalogDeps {
  getVoices(host: VoiceHostId): Promise<SpeechSynthesisVoiceRemote[]>;
  getVoice(host: VoiceHostId): Promise<SpeechSynthesisVoiceRemote | null>;
  setVoice(voice: SpeechSynthesisVoiceRemote, host: VoiceHostId): Promise<void>;
  isAuthenticated(): boolean;
}

// The settings page runs outside any host tab, so every preference call MUST
// carry an explicit chatbot id — the no-arg default resolves to "web" here.
function defaultDeps(): VoiceCatalogDeps {
  const speech = SpeechSynthesisModule.getInstance();
  const prefs = UserPreferenceModule.getInstance();
  return {
    getVoices: (host) => speech.getVoices(host),
    getVoice: (host) => prefs.getVoice(host) as Promise<SpeechSynthesisVoiceRemote | null>,
    setVoice: (voice, host) => prefs.setVoice(voice, host).then(() => {}),
    isAuthenticated: () => getJwtManagerSync().isAuthenticated(),
  };
}

/**
 * Renders the full per-host voice catalog in the settings Voices tab — the
 * "shelf" layer of the voice-selection architecture: HD and Everyday groups,
 * every catalog voice listed, selection per host. The in-page menus stay
 * capped; this surface absorbs the catalog's growth.
 */
export class VoicesController {
  private deps!: VoiceCatalogDeps;
  private readonly injectedDeps?: VoiceCatalogDeps;
  private host: VoiceHostId = "pi";
  private renderToken = 0;

  constructor(private container: HTMLElement, deps?: VoiceCatalogDeps) {
    this.injectedDeps = deps;
  }

  async init(): Promise<void> {
    // Resolved lazily so constructing the controller is side-effect-free —
    // the default deps touch app config, and any failure lands in init()'s
    // rejection (which the tab catches) rather than tab construction.
    this.deps = this.injectedDeps ?? defaultDeps();
    const pills: Array<[string, VoiceHostId]> = [
      ["#voice-host-pi", "pi"],
      ["#voice-host-claude", "claude"],
    ];
    for (const [selector, host] of pills) {
      this.container
        .querySelector<HTMLButtonElement>(selector)
        ?.addEventListener("click", () => {
          void this.selectHost(host);
        });
    }
    await this.selectHost(this.host);
  }

  private async selectHost(host: VoiceHostId): Promise<void> {
    this.host = host;
    const token = ++this.renderToken;
    this.container
      .querySelectorAll<HTMLButtonElement>(".voice-host-pill")
      .forEach((pill) => {
        pill.classList.toggle("active", pill.id === `voice-host-${host}`);
      });

    const [voices, current] = await Promise.all([
      this.deps.getVoices(host),
      this.deps.getVoice(host),
    ]);
    if (token !== this.renderToken) return; // a newer selection superseded us
    this.renderCatalog(voices, current);
  }

  private renderCatalog(
    voices: SpeechSynthesisVoiceRemote[],
    current: SpeechSynthesisVoiceRemote | null
  ): void {
    const catalog = this.container.querySelector<HTMLElement>("#voice-catalog");
    if (!catalog) return;
    catalog.innerHTML = "";

    if (voices.length === 0) {
      // Signed out → /voices legitimately returns [] (401): prompt sign-in.
      // Signed in with an empty catalog means the fetch failed — telling an
      // authenticated user to sign in would be wrong and confusing.
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

    const hd = voices.filter((voice) => getVoiceTier(voice) === "hd");
    const everyday = voices.filter(
      (voice) => getVoiceTier(voice) === "everyday"
    );

    if (hd.length > 0 && everyday.length > 0) {
      catalog.appendChild(
        this.renderShelf("hd", "voicesShelfHd", "hdVoicesAllowanceNote", hd, current)
      );
      catalog.appendChild(
        this.renderShelf(
          "everyday",
          "voicesShelfEveryday",
          "voicesShelfEverydayBlurb",
          everyday,
          current
        )
      );
    } else {
      // Single-tier catalog (today's state): a flat list, no shelf chrome.
      catalog.appendChild(this.renderList(voices, current));
    }
  }

  private renderShelf(
    tierKey: string,
    titleKey: string,
    blurbKey: string,
    voices: SpeechSynthesisVoiceRemote[],
    current: SpeechSynthesisVoiceRemote | null
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

    shelf.appendChild(this.renderList(voices, current));
    return shelf;
  }

  private renderList(
    voices: SpeechSynthesisVoiceRemote[],
    current: SpeechSynthesisVoiceRemote | null
  ): HTMLElement {
    const list = document.createElement("ul");
    list.classList.add("voice-list");
    voices.forEach((voice) => {
      list.appendChild(this.renderRow(voice, current?.id === voice.id));
    });
    return list;
  }

  private renderRow(
    voice: SpeechSynthesisVoiceRemote,
    isCurrent: boolean
  ): HTMLElement {
    const row = document.createElement("li");
    row.classList.add("voice-row");
    row.dataset.voiceId = voice.id;

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
    row.appendChild(main);

    if (isCurrent) {
      row.classList.add("current");
      const badge = document.createElement("span");
      badge.classList.add("voice-current-badge");
      badge.setAttribute("data-i18n", "voicesCurrent");
      badge.textContent = getMessage("voicesCurrent");
      row.appendChild(badge);
    } else {
      const use = document.createElement("button");
      use.type = "button";
      use.classList.add("voice-use");
      use.setAttribute("data-i18n", "voicesUse");
      use.textContent = getMessage("voicesUse");
      use.addEventListener("click", () => {
        void this.useVoice(voice);
      });
      row.appendChild(use);
    }
    return row;
  }

  /**
   * Metadata fallback for rows whose voice carries no server description.
   * Language coverage is what genuinely separates otherwise identically-named
   * variants — the pi catalog serves two "Paola"s (#474) — and it is honest,
   * useful copy on any description-less row.
   */
  private languagesSubtitle(voice: SpeechSynthesisVoiceRemote): string {
    const count = voice.languages?.length ?? 0;
    return count > 1
      ? getMessage("voiceSpeaksNLanguages", [String(count)])
      : "";
  }

  private async useVoice(voice: SpeechSynthesisVoiceRemote): Promise<void> {
    const host = this.host;
    await this.deps.setVoice(voice, host);
    if (host !== this.host) return; // host switched while persisting
    await this.selectHost(host); // one render path; re-reads the stored voice
  }
}
