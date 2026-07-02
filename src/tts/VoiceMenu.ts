// Pi-specific voice menu classes have been moved to src/chatbots/PiVoiceMenu.ts
// This file now contains only the generic/abstract base for voice controls.
import { getResourceUrl } from "../ResourceModule";
import { Chatbot } from "../chatbots/Chatbot";
import { getMostRecentAssistantMessage } from "../dom/ChatHistory";
import EventBus from "../events/EventBus";
import getMessage from "../i18n";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import { SpeechSynthesisVoiceRemote } from "./SpeechModel";
import { SpeechSynthesisModule } from "./SpeechSynthesisModule";
import { getJwtManagerSync } from "../JwtManager";
import { openSettings } from "../popup/popupopener";
import { curateShortlist, getVoiceTier } from "./VoiceCuration";

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
  protected selectedVoiceButton: HTMLButtonElement | null = null;
  /** Set when the stored voice would otherwise be hidden by the shortlist cap. */
  protected pinnedCustomVoiceId: string | null = null;

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
   * Registers an event listener to handle authentication status changes.
   * This allows the voice menu to update dynamically when a user signs in.
   */
  protected registerAuthenticationChangeHandler(): void {
    EventBus.on('saypi:auth:status-changed', (isAuthenticated: boolean) => {
      // Authentication status changed, refresh the voice selector
      console.log(`User has logged ${isAuthenticated ? "in" : "out"}, refreshing voice selector`);
      const id = this.getId();
      const voiceSelector = document.getElementById(id);
      if (voiceSelector) {
        this.addVoicesToSelector(voiceSelector as HTMLElement);
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
   * Reflect an externally-changed stored voice on this surface without a
   * repopulate (and therefore without disturbing an open menu). The base
   * covers button-grid surfaces (Pi's menus); dropdown-style selectors
   * override (ClaudeVoiceMenu).
   */
  protected applySelectedVoice(voice: SpeechSynthesisVoiceRemote | null): void {
    if (!voice) {
      this.element
        .querySelectorAll<HTMLButtonElement>("button.saypi-custom-voice")
        .forEach((button) => this.unmarkButtonAsSelectedVoice(button));
      return;
    }
    const target = this.element.querySelector<HTMLButtonElement>(
      `button[data-voice-id="${voice.id}"]`
    );
    if (!target) {
      // Hidden by the shortlist cap: pin it so the next populate shows it.
      this.pinnedCustomVoiceId = voice.id;
      return;
    }
    this.element.querySelectorAll("button").forEach((button) => {
      this.unmarkButtonAsSelectedVoice(button as HTMLButtonElement);
    });
    this.markButtonAsSelectedVoice(target);
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

  // Voice selection management
  registerVoiceChangeHandler(menu: HTMLElement): boolean {
    const voiceButtons = Array.from(menu.querySelectorAll("button"));
    if (!voiceButtons || voiceButtons.length === 0) {
      return false;
    }
    const builtInPiVoiceButtons = voiceButtons.filter((button) =>
      this.isBuiltInVoiceButton(button)
    );
    builtInPiVoiceButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.userPreferences.unsetVoice(this.chatbot).then(() => {
          if (this.selectedVoiceButton) {
            this.unmarkButtonAsSelectedVoice(this.selectedVoiceButton);
          }
          this.markButtonAsSelectedVoice(button);
        });
      });
    });
    return true;
  }
  protected addIdVoiceMenu(element: HTMLElement): void {
    element.id = this.getId();
  }
  protected markButtonAsSelectedVoice(button: HTMLButtonElement): void {
    button.disabled = true;
    button.classList.add("selected", "bg-neutral-300", "text-primary-700");
    button.classList.remove("hover:bg-neutral-300");

    if (this.selectedVoiceButton) {
      this.unmarkButtonAsSelectedVoice(this.selectedVoiceButton);
    }
    this.selectedVoiceButton = button;
  }

  protected unmarkButtonAsSelectedVoice(button: HTMLButtonElement): void {
    button.disabled = false;
    button.classList.remove("selected", "bg-neutral-300", "text-primary-700");
    button.classList.add("hover:bg-neutral-300", "border-neutral-500");
    button.setAttribute("style", ""); // remove inline styles from builtin voice buttons on voice settings page
  }

  protected isBuiltInVoiceButton(button: HTMLButtonElement): boolean {
    // Every SayPi-injected row carries the positive marker; anything without
    // it is a host-native (built-in) button. Safer than enumerating SayPi
    // row types — new rows are excluded by construction.
    return !button.classList.contains("saypi-voice-button");
  }

  /**
   * Max SayPi (custom) voice rows this surface shows before tucking the rest
   * behind a "More voices" door. null = uncapped (the default — e.g. Pi's own
   * settings-page grid); in-host menus override
   * (doc/plans/2026-07-02-voice-selection-ux.md §3).
   */
  protected getCustomVoiceCap(): number | null {
    return null;
  }

  /**
   * Whether this surface renders the "More voices" door to the settings
   * catalog. The door is the navigation path to the full catalog, not an
   * overflow marker, so capped surfaces always show it; uncapped surfaces
   * opt in (Pi's settings grid does — #472).
   */
  protected showsMoreVoicesDoor(): boolean {
    return this.getCustomVoiceCap() !== null;
  }

  async refreshMenu(): Promise<void> {
    // remove all voices from the selector
    const voiceButtons = Array.from(this.element.querySelectorAll("button"));
    voiceButtons.forEach((button) => {
      this.unmarkButtonAsSelectedVoice(button as HTMLButtonElement);
      this.element.removeChild(button);
    });
    // add voices to the selector
    await this.addVoicesToSelector(this.element);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  addVoicesToSelector(voiceSelector: HTMLElement): void {
    const speechSynthesis = SpeechSynthesisModule.getInstance();
    speechSynthesis.getVoices(this.chatbot).then((voices) => {
      this.populateVoices(voices, voiceSelector);
    });
  }

  populateVoices(
    voices: SpeechSynthesisVoiceRemote[],
    voiceSelector: HTMLElement
  ): boolean {
    if (!voices || voices.length === 0) {
      console.log("No voices found");
      return false;
    }

    // filter voices into default and custom voices based on the voice.default property
    const defaultVoices = voices.filter((voice) => voice.default);
    const customVoices = voices.filter((voice) => !voice.default);

    this.populateDefaultVoices(defaultVoices, voiceSelector);

    const cap = this.getCustomVoiceCap();
    if (cap === null) {
      this.populateCustomVoices(customVoices, voiceSelector);
      if (this.showsMoreVoicesDoor()) {
        this.addMoreVoicesDoor(voiceSelector);
      }
      return true;
    }

    // Capped surface: show a curated shortlist of SayPi voices (built-in host
    // voices above are never capped), with a door to the full catalog.
    const curated = curateShortlist(
      customVoices,
      this.pinnedCustomVoiceId,
      cap
    );
    this.populateCustomVoices(
      curated.voices,
      voiceSelector,
      curated.tiersCoexist
    );
    if (this.showsMoreVoicesDoor()) {
      this.addMoreVoicesDoor(voiceSelector);
    }

    // The stored voice must never vanish from the menu: if the cap hid it,
    // pin it and re-render the SayPi block once. Runs only when this call
    // could actually hide something — partial lists (addMissingPiVoices
    // passes Pi's built-in top-ups alone) must not disturb the pin state.
    if (customVoices.length > cap) {
      this.userPreferences.getVoice(this.chatbot).then((voice) => {
        const storedCustomId =
          voice && customVoices.some((v) => v.id === voice.id)
            ? voice.id
            : null;
        if (!storedCustomId) {
          this.pinnedCustomVoiceId = null;
          return;
        }
        if (curated.voices.some((v) => v.id === storedCustomId)) {
          // Visible without help; drop a pin left over from a previous voice.
          if (
            this.pinnedCustomVoiceId &&
            this.pinnedCustomVoiceId !== storedCustomId
          ) {
            this.pinnedCustomVoiceId = null;
          }
          return;
        }
        if (this.pinnedCustomVoiceId !== storedCustomId) {
          this.pinnedCustomVoiceId = storedCustomId;
          this.removeCustomVoiceRows(
            voiceSelector,
            new Set(customVoices.map((v) => v.id))
          );
          this.populateVoices(voices, voiceSelector);
        }
      });
    }

    return true;
  }

  /**
   * Remove this catalog's SayPi voice rows (and the door) ahead of a
   * re-render. Scoped to the given ids so rows from other sources — Pi's
   * extra built-ins arrive via a separate populate call — survive.
   */
  private removeCustomVoiceRows(
    voiceSelector: HTMLElement,
    catalogIds: Set<string>
  ): void {
    voiceSelector
      .querySelectorAll<HTMLButtonElement>("button.saypi-custom-voice")
      .forEach((button) => {
        const id = button.dataset.voiceId;
        if (id && catalogIds.has(id)) {
          button.remove();
        }
      });
    voiceSelector
      .querySelectorAll("button.saypi-more-voices")
      .forEach((button) => button.remove());
  }

  /**
   * The muted final row of the SayPi block, linking to the full voice catalog
   * in the extension settings. Styled like the host's own rows. Idempotent:
   * an existing door is moved back into place rather than duplicated.
   */
  private addMoreVoicesDoor(voiceSelector: HTMLElement): void {
    let door = voiceSelector.querySelector<HTMLButtonElement>(
      "button.saypi-more-voices"
    );
    if (!door) {
      door = document.createElement("button");
      door.type = "button";
      // saypi-voice-button keeps it under the menu's expand/collapse visibility
      // rules (voices.scss); saypi-more-voices exempts it from voice-selection
      // handling (isBuiltInVoiceButton).
      door.classList.add(
        ...this.getButtonClasses(),
        "saypi-voice-button",
        "saypi-more-voices"
      );
      door.textContent = getMessage("moreVoices");
      door.addEventListener("click", () => {
        openSettings("chat");
      });
    }
    const customButtons = voiceSelector.querySelectorAll(
      "button.saypi-custom-voice"
    );
    const lastCustom = customButtons[customButtons.length - 1];
    if (lastCustom) {
      lastCustom.insertAdjacentElement("afterend", door);
    } else {
      voiceSelector.appendChild(door);
    }
  }

  populateDefaultVoices(
    defaultVoices: SpeechSynthesisVoiceRemote[],
    voiceSelector: HTMLElement
  ): void {
    const defaultVoiceButtons = Array(defaultVoices.length);

    defaultVoices.forEach((voice) => {
      // if not already in the menu, add the voice
      if (voiceSelector.querySelector(`button[data-voice-id="${voice.id}"]`)) {
        // voice already in menu, move voice to end of menu and skip to next voice
        const button = voiceSelector.querySelector(
          `button[data-voice-id="${voice.id}"]`
        );
        voiceSelector.appendChild(button as HTMLElement);

        return;
      }
      const button = document.createElement("button");
      // template: <button type="button" class="mb-1 rounded px-2 py-3 text-center hover:bg-neutral-300">Pi 6</button>
      button.type = "button";
      const additionalClasses = ["saypi-voice-button", "saypi-restored-voice"];
      const combinedClasses = [
        ...this.getButtonClasses(),
        ...additionalClasses,
        voice.name.toLowerCase().replace(" ", "-"),
      ];
      button.classList.add(...combinedClasses);
      button.innerText = voice.name;
      button.addEventListener("click", () => {
        this.userPreferences.setVoice(voice, this.chatbot).then(() => {
          console.log(`Selected voice: ${voice.name}`);
          defaultVoiceButtons.forEach((button) => {
            this.unmarkButtonAsSelectedVoice(button);
          });
          const voiceButtons = voiceSelector.querySelectorAll("button");
          voiceButtons.forEach((button) => {
            this.unmarkButtonAsSelectedVoice(button as HTMLButtonElement);
          });
          this.markButtonAsSelectedVoice(button);
          this.introduceVoice(voice);
        });
      });
      button.dataset.voiceId = voice.id;
      defaultVoiceButtons.push(button);
    });

    defaultVoiceButtons.forEach((button) => {
      voiceSelector.appendChild(button);
    });
  }

  populateCustomVoices(
    customVoices: SpeechSynthesisVoiceRemote[],
    voiceSelector: HTMLElement,
    showTier: boolean = false
  ): void {
    const customVoiceButtons = Array(customVoices.length);

    customVoices.forEach((voice) => {
      // if not already in the menu, add the voice
      if (voiceSelector.querySelector(`button[data-voice-id="${voice.id}"]`)) {
        // voice already in menu, skip to next voice
        return;
      }
      const button = document.createElement("button");
      // template: <button type="button" class="mb-1 rounded px-2 py-3 text-center hover:bg-neutral-300">Pi 6</button>
      button.type = "button";
      const additionalClasses = ["saypi-voice-button", "saypi-custom-voice"];
      const combinedClasses = [
        ...this.getButtonClasses(),
        ...additionalClasses,
        voice.name.toLowerCase().replace(" ", "-"),
      ];
      button.classList.add(...combinedClasses);
      const name = document.createElement("span");
      name.classList.add("voice-name");
      name.innerText = voice.name;
      button.appendChild(name);
      // Quiet tier suffix on premium rows, only while tiers coexist
      // (doc/plans/2026-07-02-voice-selection-ux.md §3 — no chips, no prices on Pi).
      if (showTier && getVoiceTier(voice) === "hd") {
        const tier = document.createElement("span");
        tier.classList.add("voice-tier");
        tier.textContent = "HD";
        tier.title = getMessage("hdVoicesAllowanceNote");
        button.appendChild(tier);
      }
      const flair = document.createElement("img");
      flair.classList.add("flair");
      flair.src = getResourceUrl("icons/logos/saypi.png");
      flair.alt = "Say, Pi logo";
      flair.title = getMessage("enhancedVoice", ["Say, Pi"]);
      button.appendChild(flair);
      button.addEventListener("click", () => {
        this.userPreferences.setVoice(voice, this.chatbot).then(() => {
          console.log(`Selected voice: ${voice.name}`);
          customVoiceButtons.forEach((button) => {
            this.unmarkButtonAsSelectedVoice(button);
          });
          const voiceButtons = voiceSelector.querySelectorAll("button");
          voiceButtons.forEach((button) => {
            if (this.isBuiltInVoiceButton(button as HTMLButtonElement)) {
              this.unmarkButtonAsSelectedVoice(button as HTMLButtonElement);
            }
          });
          this.markButtonAsSelectedVoice(button);
          this.introduceVoice(voice);
        });
      });
      button.dataset.voiceId = voice.id;
      customVoiceButtons.push(button);
    });

    customVoiceButtons.reverse().forEach((button) => {
      voiceSelector.insertBefore(button, voiceSelector.firstChild);
    });
  }

  introduceVoice(voice: SpeechSynthesisVoiceRemote): void {
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
    if (voice.default && isBuiltInVoiceProvider(this.chatbot)) {
      const introductionUrl = this.chatbot.getVoiceIntroductionUrl(voice.id);
      if (introductionUrl) {
        // play the introduction audio
        EventBus.emit("audio:load", { url: introductionUrl });
      }
    } else {
      // Introduce the custom voice through the SAME finalized streaming path the
      // conversation-turn TTS uses (open → send text → finalize), so the resulting
      // `…/speak/<id>/stream` source plays. A plain non-streaming createSpeech yields
      // a `…/speak/<id>` URL the audio-output parser rejects ("is not a streaming
      // speech URL"); an un-finalized stream 405s on playback — both left the intro
      // silent (#375). introduceVoice runs after setVoice persists, so the stream's
      // preferred voice is the just-selected voice.
      if (!introduction || !introduction.trim()) {
        // Nothing to say — don't synthesize an empty stream (no audio + a 405).
        return;
      }
      const speechSynthesis = SpeechSynthesisModule.getInstance();
      speechSynthesis
        .createCompletedSpeechStream(introduction, this.chatbot)
        .then((utterance) => {
          utterance.voice = voice;
          speechSynthesis.speak(utterance);
        });
    }
  }

  // Listen for additions of custom voice buttons and update selections
  addVoiceButtonAdditionListener(voiceMenu: HTMLElement): void {
    const observerCallback = (
      mutationsList: MutationRecord[],
      observer: MutationObserver
    ) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          for (let node of mutation.addedNodes) {
            if (
              node.nodeName === "BUTTON" &&
              node instanceof HTMLButtonElement
            ) {
              const button = node as HTMLButtonElement;
              this.handleButtonAddition(button);
            }
          }
        }
      }
    };
    const observer = new MutationObserver(observerCallback);
    observer.observe(voiceMenu, { childList: true });
  }

  handleButtonAddition(button: HTMLButtonElement): void {
    // a voice button was added to the menu that is not a custom voice button
    // if a voice is selected, mark the button as selected
    this.userPreferences.getVoice(this.chatbot).then((voice) => {
      const customVoiceIsSelected = voice !== null;
      if (customVoiceIsSelected) {
        if (this.isBuiltInVoiceButton(button)) {
          this.unmarkButtonAsSelectedVoice(button);
        } else if (button.dataset.voiceId === voice.id) {
          // unmark all other buttons and mark this one as selected
          const voiceButtons = Array.from(
            this.element.querySelectorAll("button")
          );
          voiceButtons.forEach((btn) => {
            this.unmarkButtonAsSelectedVoice(btn as HTMLButtonElement);
          });
          this.markButtonAsSelectedVoice(button);
        }
      }
    });
  }

  addMissingPiVoices(voiceSelector: HTMLElement) {
    // only for chatbots that ship their own built-in voices (Pi.ai)
    if (!isBuiltInVoiceProvider(this.chatbot)) {
      return;
    }
    // count the number of original Pi voices in the menu
    let piVoices = 0;
    const voiceButtons = Array.from(voiceSelector.querySelectorAll("button"));
    voiceButtons.forEach((button) => {
      if (this.isBuiltInVoiceButton(button as HTMLButtonElement)) {
        piVoices++;
      }
    });
    // if fewer than 8 Pi voices, add the missing Pi voices to the menu
    if (piVoices < 8) {
      this.populateVoices(this.chatbot.getExtraVoices(), voiceSelector);
    }
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
