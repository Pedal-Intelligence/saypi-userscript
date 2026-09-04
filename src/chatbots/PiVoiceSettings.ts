import getMessage from "../i18n";
import { openSettings } from "../popup/popupopener";
import { VoiceSelector } from "../tts/VoiceMenu";
import { audioProviders, SpeechSynthesisVoiceRemote } from "../tts/SpeechModel";
import { Chatbot } from "./Chatbot";
import { UserPreferenceModule } from "../prefs/PreferenceModule";

/**
 * Build a "More voices" door for Pi's Voice settings grid. It visually CLONES a
 * Pi native card (`template`) by copying its class list — Pi's own utilities are
 * already compiled, so its arbitrary classes (`min-h-11`, `h-[56px]`,
 * `!bg-secondary-default`) apply to the clone; SayPi can't author those itself
 * (host-injected-arbitrary-Tailwind). A REAL template is required (the caller
 * waits for Pi to populate its cards) — cloning nothing would leave a
 * permanently unstyled foreign door that the idempotence guard then never
 * re-styles. Click → the extension's full Voices catalog.
 */
function buildMoreVoicesDoor(template: HTMLElement): HTMLElement {
  const door = document.createElement("button");
  door.type = "button";
  door.className = template.className;
  door.classList.add("saypi-more-voices");

  const label = document.createElement("span");
  const templateSpan = template.querySelector("span");
  if (templateSpan) label.className = templateSpan.className;
  label.textContent = getMessage("moreVoices");
  door.appendChild(label);

  door.addEventListener("click", () => openSettings("voices/pi"));
  return door;
}

/**
 * Pi's own Voice settings page (pi.ai/profile/settings) — since 2026-07-30 the
 * ONLY place Pi lets a user choose a voice. Pi retired its in-chat voice menu (a
 * pill that expanded into a voice list) and replaced that whole surface with a
 * "Chat options" kebab holding nothing but an auto-read toggle, so this grid
 * inherited the entire job and `PiVoiceMenu` was retired alongside it.
 *
 * Door-first (#491 sibling): the grid is a static `div.grid` of `<button>` voice
 * cards, and SayPi adds only the "More voices" door → the extension's full
 * Voices catalog. Inline SayPi voice rows on this surface remain deferred.
 * Though the grid is static, Pi's React can still re-render it (e.g. on
 * selection), so the door is re-injected on grid mutations.
 *
 * Extends `VoiceSelector` directly. It used to extend `GridVoiceSelector` — the
 * row-rendering base built for Pi's in-chat menu — but overrode both of that
 * base's render methods to nothing, so none of its machinery ever ran. When Pi
 * retired the in-chat menu (#573) the base lost its last real consumer and was
 * removed (#578); this surface only ever needed `VoiceSelector`'s id assignment
 * and auth/preference wiring.
 */
export class PiVoiceSettings extends VoiceSelector {
  constructor(
    chatbot: Chatbot,
    userPreferences: UserPreferenceModule,
    element: HTMLElement
  ) {
    super(chatbot, userPreferences, element);
    this.addIdVoiceMenu(element);
    this.ensureSettingsDoor();
    this.observeSettingsGrid();
    // The door needs no data, so it paints immediately — but the override
    // notice does, and nothing else fetches it on this surface. The base only
    // renders on an auth or preference CHANGE, so without this the notice was
    // absent on every first load: measured on the live host with a voice
    // selected, door present, notice missing.
    void this.refreshOverrideNotice();
  }

  /**
   * The SayPi voice currently overriding Pi's own, as last rendered.
   *
   * A render cache, not the state of record — the stored preference is still
   * the only source of truth, fetched by the base's `refreshMenu`. It exists
   * because Pi's React drops our foreign children and the re-injection runs
   * from a MutationObserver callback, which is synchronous and has no chance to
   * re-read storage: without this, a healed notice would come back blank.
   */
  private overridingVoice: SpeechSynthesisVoiceRemote | null = null;

  getId(): string {
    return "saypi-voice-settings";
  }

  // Also reached on auth changes via the base refreshMenu → re-ensure SayPi's
  // marks on the grid, never draw inline voice rows (door-first).
  protected override renderMenu(
    _voices: SpeechSynthesisVoiceRemote[],
    storedVoice: SpeechSynthesisVoiceRemote | null
  ): void {
    this.applySelectedVoice(storedVoice);
  }

  // No per-row selection to reflect on a door-only surface — but the grid's
  // whole meaning changes when a SayPi voice takes over, so that much is.
  protected override applySelectedVoice(
    voice: SpeechSynthesisVoiceRemote | null
  ): void {
    // A persisted Pi voice is a native choice too. Use the same provider
    // resolution as playback, rather than treating every stored object as an
    // override (or mistaking `default`, which is catalog metadata, for one).
    this.overridingVoice = voice &&
      audioProviders.retreiveProviderByVoice(voice) === audioProviders.SayPi
      ? voice
      : null;
    this.ensureSettingsDoor();
  }

  /**
   * Read the stored voice and paint the notice from it. Only the preference is
   * needed — not the catalog — so this asks for that alone rather than going
   * through the base's full gather-then-render. Never rejects: a surface that
   * can't say what's speaking should still show its door.
   */
  private async refreshOverrideNotice(): Promise<void> {
    try {
      const voice = await this.userPreferences.getVoice(this.chatbot);
      this.applySelectedVoice(voice ?? null);
    } catch (error) {
      console.debug("[SayPi] Could not read the voice in use for Pi", error);
    }
  }

  /**
   * Inject the "More voices" door as the last card of Pi's settings grid,
   * cloned from a native card so it renders Pi-native. Idempotent (guarded on
   * `.saypi-more-voices`).
   */
  private ensureSettingsDoor(): void {
    const grid = this.element;
    this.ensureOverrideNotice();
    if (grid.querySelector(".saypi-more-voices")) return;
    // Clone a native card for styling. If Pi hasn't rendered its card buttons
    // yet (empty grid), wait: observeSettingsGrid re-fires when they arrive, so
    // we never inject an unstyled door that the guard above would then freeze.
    const template = grid.querySelector<HTMLElement>(":scope > button");
    if (!template) return;
    grid.appendChild(buildMoreVoicesDoor(template));
  }

  /**
   * State, in a sentence, above Pi's cards: which SayPi voice has taken over,
   * and that the cards below aren't the ones speaking (#600).
   *
   * Lives INSIDE the grid, as its first cell spanning every column, rather than
   * as a sibling above it — a sibling is outside what `observeSettingsGrid`
   * watches, so a React re-render would drop it for good, while a child heals
   * on the same mutation that heals the door.
   *
   * Pi's own highlighted card remains a real preference. Keep every native
   * card enabled and normally styled: choosing one now returns playback to Pi.
   */
  private ensureOverrideNotice(): void {
    const grid = this.element;
    const existing = grid.querySelector<HTMLElement>(
      ".saypi-voice-override-notice"
    );
    if (!this.overridingVoice) {
      existing?.remove();
      return;
    }
    const text = getMessage("voiceOverriddenBySayPi", [
      this.overridingVoice.name,
    ]);
    if (existing) {
      // No data-i18n anywhere on it: the text is substituted, and replaceI18n
      // would erase the voice name on the next settings paint.
      const copy = existing.querySelector(".saypi-voice-override-copy");
      if (copy && copy.textContent !== text) copy.textContent = text;
      return;
    }
    const notice = document.createElement("div");
    // Pi compiles this theme-aware utility on the native voice cards. The
    // grid itself has no foreground color, so inheriting it yields black
    // text even in Pi's dark theme.
    notice.className = "saypi-voice-override-notice text-text-secondary";
    const copy = document.createElement("span");
    copy.className = "saypi-voice-override-copy";
    copy.textContent = text;
    const change = document.createElement("button");
    change.type = "button";
    change.className = "saypi-change-voice";
    change.textContent = getMessage("voicesChangeVoice");
    change.addEventListener("click", () => openSettings("voices/pi"));
    notice.append(copy, change);
    grid.prepend(notice);
  }

  private async useNativeVoice(): Promise<void> {
    try {
      // Pi owns which native card was chosen. Clearing our preference also
      // changes the audio provider back to Pi and releases the host mute.
      // Clear stored native ids too, so the converter cannot restore an older
      // Pi voice over the card the user just selected.
      await this.userPreferences.unsetVoice(this.chatbot);
      this.applySelectedVoice(null);
    } catch (error) {
      // Keep the notice honest if storage fails: SayPi is still the provider.
      console.debug("[SayPi] Could not return to Pi's own voice", error);
    }
  }

  /**
   * Pi's React may re-render the grid (e.g. selecting a voice) and drop our
   * foreign door child. Re-inject on any grid childList change; idempotent, so
   * the door's own append never loops.
   */
  private observeSettingsGrid(): void {
    this.element.addEventListener("click", (event) => {
      const card = event.target instanceof Element
        ? event.target.closest("button")
        : null;
      // Delegation survives native card replacement. Only direct-child native
      // cards release the override; both SayPi navigation buttons keep it.
      if (card?.parentElement === this.element &&
          !card.classList.contains("saypi-more-voices") && !card.disabled) {
        void this.useNativeVoice();
      }
    }, { capture: true }); // classify before Pi's handler can replace the card
    const observer = new MutationObserver(() => this.ensureSettingsDoor());
    observer.observe(this.element, { childList: true });
  }

  getButtonClasses(): string[] {
    // Required by the abstract base; unused on this door-first surface — the
    // door clones Pi's native card styling rather than authoring its own.
    return [];
  }
}
