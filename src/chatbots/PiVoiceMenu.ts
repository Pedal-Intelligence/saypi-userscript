import { Observation } from "../dom/Observation";
import EventBus from "../events/EventBus";
import getMessage from "../i18n";
import { openSettings } from "../popup/popupopener";
import { audioProviders } from "../tts/SpeechModel";
import { GridVoiceSelector } from "../tts/GridVoiceSelector";
import { PI_MENU_CAP } from "../tts/VoiceCuration";
import { Chatbot } from "./Chatbot";
import { UserPreferenceModule } from "../prefs/PreferenceModule";

/**
 * Build a "More voices" door for Pi's live voice surfaces. It visually CLONES a
 * Pi native row/card (`template`) by copying its class list — Pi's own utilities
 * are already compiled, so its arbitrary classes (`min-h-11`, `h-[56px]`,
 * `!bg-secondary-default`) apply to the clone; SayPi can't author those itself
 * (host-injected-arbitrary-Tailwind). A REAL template is required (callers wait
 * for Pi to populate its rows/cards) — cloning nothing would leave a permanently
 * unstyled foreign door that the idempotence guard then never re-styles. `tag`
 * matches the host's native element — Pi's in-chat rows are `<div>`s, its
 * settings cards are `<button>`s — so the door reads as one of them; div doors
 * get the keyboard operability Pi's own role-less divs lack. Click → the
 * extension's full Voices catalog.
 */
function buildMoreVoicesDoor(
  template: HTMLElement,
  tag: "div" | "button"
): HTMLElement {
  // Annotate as HTMLElement so addEventListener("keydown") keeps its typed
  // KeyboardEvent overload (a union createElement return would widen it to Event).
  const door: HTMLElement = document.createElement(tag);
  if (tag === "button") (door as HTMLButtonElement).type = "button";
  door.className = template.className;
  door.classList.add("saypi-more-voices");
  if (tag === "div") {
    door.setAttribute("role", "button");
    door.tabIndex = 0;
  }

  const label = document.createElement("span");
  const templateSpan = template.querySelector("span");
  if (templateSpan) label.className = templateSpan.className;
  label.textContent = getMessage("moreVoices");
  door.appendChild(label);

  const open = () => openSettings("voices");
  door.addEventListener("click", open);
  if (tag === "div") {
    door.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
  }
  return door;
}

export class PiVoiceMenu extends GridVoiceSelector {
  constructor(
    chatbot: Chatbot,
    userPreferences: UserPreferenceModule,
    element: HTMLElement
  ) {
    super(chatbot, userPreferences, element);

    this.addIdVoiceMenu(element);
    this.restyleVoiceMenuControls(element);
    this.observeForMoreVoicesDoor();
  }

  getId(): string {
    return "saypi-voice-menu";
  }

  // The in-chat dropdown is Pi's most minimal surface: cap the SayPi block
  // and route the rest through "More voices" (Pi's own settings-page grid,
  // PiVoiceSettings, stays uncapped).
  protected override getCustomVoiceCap(): number {
    return PI_MENU_CAP;
  }

  getButtonClasses(): string[] {
    return [
      "mb-1",
      "rounded",
      "px-2",
      "py-3",
      "text-center",
      "hover:bg-neutral-300",
    ];
  }

  restyleVoiceMenuControls(voiceMenu: HTMLElement): Observation {
    let obs: Observation;
    const voiceMenuControls = voiceMenu.nextSibling;
    if (!voiceMenuControls || !(voiceMenuControls instanceof HTMLElement)) {
      obs = Observation.notFound("saypi-voice-menu-controls");
      return obs;
    }
    voiceMenuControls.id = "saypi-voice-menu-controls";
    obs = Observation.foundUndecorated(
      "saypi-voice-menu-controls",
      voiceMenuControls
    );

    // add a class to the voice menu controls if the user has selected a SayPi voice
    let voiceProvidedBySayPi = false;
    this.userPreferences.hasVoice().then((hasVoice) => {
      if (hasVoice) {
        voiceMenuControls.classList.add("saypi-provided-voice");
        voiceProvidedBySayPi = true;
      }
    });
    EventBus.on("userPreferenceChanged", (detail: { audioProvider?: typeof audioProviders.SayPi }) => {
      if (detail.audioProvider) {
        if (detail.audioProvider === audioProviders.SayPi) {
          voiceMenuControls.classList.add("saypi-provided-voice");
          voiceProvidedBySayPi = true;
        } else {
          voiceMenuControls.classList.remove("saypi-provided-voice");
          voiceProvidedBySayPi = false;
        }
      }
    });

    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class" &&
          voiceMenuControls.classList.contains("self-end")
        ) {
          voiceMenuControls.classList.remove("self-end");
        }
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "style"
        ) {
          // menu has changed between a circle and a rectangle (border-radius style), as happens when audio is toggled on pi.ai
          if (voiceProvidedBySayPi) {
            voiceMenuControls.classList.add("saypi-provided-voice");
          }
        }
      }
    });

    observer.observe(voiceMenuControls, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    return Observation.foundAndDecorated(obs);
  }

  /**
   * Keep a "More voices" door present in Pi's live in-chat voice menu (#491,
   * door-first). Pi redesigned the menu into a popover it LAZILY BUILDS on
   * expand and tears down on collapse (verified live 2026-07-04, Layer-4 CDP):
   * collapsed there is only a pill; expanded, Pi swaps in a `rounded-xl` card
   * holding the voice list (`div.flex.flex-col.gap-1` of `div.cursor-pointer`
   * rows — no longer `<button>`s). The old firstChild-`<button>` expansion
   * heuristic watched the wrong depth (a direct-child childList) and matched a
   * shape Pi no longer produces, so it never fired and the SayPi block/door
   * stayed dark. We instead observe the audio-controls SUBTREE and, whenever
   * the menu is open, ensure the door is the last row of Pi's list. Inline
   * SayPi voice rows are deferred; the door reaches the full catalog + ▶
   * previews in the extension's Voices settings.
   */
  observeForMoreVoicesDoor(): Observation {
    const className = "saypi-audio-controls";
    const audioControls = document.querySelector(
      "." + className
    ) as HTMLElement | null;
    if (!audioControls) {
      return Observation.notFound(className);
    }
    // The menu may already be open when we attach (re-decoration mid-open).
    this.ensureMoreVoicesDoor(audioControls);
    const observer = new MutationObserver(() =>
      this.ensureMoreVoicesDoor(audioControls)
    );
    // Pi swaps the pill↔card DEEP in the subtree, not as a direct child of the
    // audio-controls container, so the old direct-child childList observer
    // never saw it — subtree is required.
    observer.observe(audioControls, { childList: true, subtree: true });
    return Observation.foundAndDecorated(
      Observation.foundUndecorated(className, audioControls)
    );
  }

  /**
   * Inject the door into Pi's live voice list when the menu is open and it is
   * not already there. Idempotent (guarded on `.saypi-more-voices`), so it is
   * safe to call on every subtree mutation and re-injects after Pi rebuilds the
   * list on the next expand.
   */
  ensureMoreVoicesDoor(audioControls: HTMLElement): void {
    const list = this.findLiveVoiceList(audioControls);
    if (!list) return; // collapsed / no list to host the door
    if (list.querySelector(".saypi-more-voices")) return; // already present
    // Pi's in-chat rows are `<div>`s — clone the first one so the door matches.
    // If the list has no rows yet, wait: the subtree observer re-fires once Pi
    // populates it (never inject an unstyled, un-cloned door).
    const template = list.firstElementChild as HTMLElement | null;
    if (!template) return;
    list.appendChild(buildMoreVoicesDoor(template, "div"));
  }

  /**
   * Locate Pi's live voice-list container. Anchors on the stable "Toggle voice
   * menu" aria-label (present in both states) → the expanded `rounded-xl` card
   * (the collapsed pill is `rounded-[100px]`, so this is null when collapsed) →
   * the row list. Positional class-literal chains would be brittle against Pi's
   * churn; these three anchors are the load-bearing, most-stable ones.
   */
  private findLiveVoiceList(audioControls: HTMLElement): HTMLElement | null {
    const toggle = audioControls.querySelector(
      'button[aria-label="Toggle voice menu"]'
    );
    if (!toggle) return null;
    const card = toggle.closest(".rounded-xl");
    if (!card) return null; // collapsed — the pill, not the card
    return card.querySelector<HTMLElement>(".flex.flex-col.gap-1");
  }

}

/**
 * Pi's own Voice settings page (pi.ai/profile/settings). Door-first (#491
 * sibling): Pi redesigned this into a static `div.grid` of `<button>` voice
 * cards, and SayPi's old full-grid render never decorated it (stale selector).
 * SayPi now adds only the "More voices" door → the extension's full Voices
 * catalog. Inline SayPi voice rows on this surface are deferred (companion to
 * the in-chat #497). Unlike the in-chat menu this grid is static, but Pi's
 * React can still re-render it (e.g. on selection), so the door is re-injected
 * on grid mutations.
 */
export class PiVoiceSettings extends GridVoiceSelector {
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
   * cloned from a native card so it renders Pi-native (cards are `<button>`s
   * here). Idempotent (guarded on `.saypi-more-voices`).
   */
  private ensureSettingsDoor(): void {
    const grid = this.element;
    if (grid.querySelector(".saypi-more-voices")) return;
    // Clone a native card for styling. If Pi hasn't rendered its card buttons
    // yet (empty grid), wait: observeSettingsGrid re-fires when they arrive, so
    // we never inject an unstyled door that the guard above would then freeze.
    const template = grid.querySelector<HTMLElement>(":scope > button");
    if (!template) return;
    grid.appendChild(buildMoreVoicesDoor(template, "button"));
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
