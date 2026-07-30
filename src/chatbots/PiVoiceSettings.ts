import getMessage from "../i18n";
import { openSettings } from "../popup/popupopener";
import { VoiceSelector } from "../tts/VoiceMenu";
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
  }

  getId(): string {
    return "saypi-voice-settings";
  }

  // Also reached on auth changes via the base refreshMenu → re-ensure the door,
  // never draw inline voice rows (door-first).
  protected override renderMenu(): void {
    this.ensureSettingsDoor();
  }

  // Door-only surface: no per-row selection to reflect.
  protected override applySelectedVoice(): void {}

  /**
   * Inject the "More voices" door as the last card of Pi's settings grid,
   * cloned from a native card so it renders Pi-native. Idempotent (guarded on
   * `.saypi-more-voices`).
   */
  private ensureSettingsDoor(): void {
    const grid = this.element;
    if (grid.querySelector(".saypi-more-voices")) return;
    // Clone a native card for styling. If Pi hasn't rendered its card buttons
    // yet (empty grid), wait: observeSettingsGrid re-fires when they arrive, so
    // we never inject an unstyled door that the guard above would then freeze.
    const template = grid.querySelector<HTMLElement>(":scope > button");
    if (!template) return;
    grid.appendChild(buildMoreVoicesDoor(template));
  }

  /**
   * Pi's React may re-render the grid (e.g. selecting a voice) and drop our
   * foreign door child. Re-inject on any grid childList change; idempotent, so
   * the door's own append never loops.
   */
  private observeSettingsGrid(): void {
    const observer = new MutationObserver(() => this.ensureSettingsDoor());
    observer.observe(this.element, { childList: true });
  }

  getButtonClasses(): string[] {
    // Required by the abstract base; unused on this door-first surface — the
    // door clones Pi's native card styling rather than authoring its own.
    return [];
  }
}
