import { Observation } from "../dom/Observation";
import EventBus from "../events/EventBus";
import getMessage from "../i18n";
import { openSettings } from "../popup/popupopener";
import { audioProviders } from "../tts/SpeechModel";
import { GridVoiceSelector } from "../tts/GridVoiceSelector";
import { PI_MENU_CAP } from "../tts/VoiceCuration";
import { Chatbot } from "./Chatbot";
import { UserPreferenceModule } from "../prefs/PreferenceModule";

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
    list.appendChild(this.createLiveMenuDoor(list));
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

  /**
   * Build the door as a Pi-native-looking row by CLONING a native row's class
   * list (Pi's own utilities are already compiled, so its arbitrary classes —
   * `min-h-11`, `!bg-secondary-default` — apply to the clone; SayPi can't author
   * those itself, per the host-injected-arbitrary-Tailwind constraint). Pi's
   * rows are role-less `<div>` clickables, so we match with a keyboard-operable
   * div (marginally better a11y than Pi's own rows).
   */
  private createLiveMenuDoor(list: HTMLElement): HTMLElement {
    const template = list.firstElementChild as HTMLElement | null;
    const door = document.createElement("div");
    if (template) door.className = template.className;
    door.classList.add("saypi-more-voices");
    door.setAttribute("role", "button");
    door.tabIndex = 0;

    const label = document.createElement("span");
    const templateSpan = template?.querySelector("span");
    if (templateSpan) label.className = templateSpan.className;
    label.textContent = getMessage("moreVoices");
    door.appendChild(label);

    const open = () => openSettings("voices");
    door.addEventListener("click", open);
    door.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
    return door;
  }
}

export class PiVoiceSettings extends GridVoiceSelector {
  constructor(
    chatbot: Chatbot,
    userPreferences: UserPreferenceModule,
    element: HTMLElement
  ) {
    super(chatbot, userPreferences, element);
    this.addIdVoiceMenu(element);
    // One gather-then-render covers what four calls did before: catalog rows,
    // Pi's extra-voice top-up, adoption of Pi's pre-existing native buttons,
    // and selection marking.
    this.refreshMenu();
  }

  getId(): string {
    return "saypi-voice-settings";
  }

  // Pi's own settings grid is uncapped, but still gets the door — it is the
  // only path from this surface to the extension's full voice catalog (#472).
  protected override showsMoreVoicesDoor(): boolean {
    return true;
  }

  getButtonClasses(): string[] {
    return [
      "flex",
      "items-center",
      "justify-between",
      "rounded-lg",
      "border",
      "px-3",
      "py-5",
      "font-sans",
      "text-body-m-mobile",
      "text-primary-700",
      "border-neutral-500",
    ];
  }
}
