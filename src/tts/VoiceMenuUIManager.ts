import { Chatbot } from "../chatbots/Chatbot";
import { Observation } from "../dom/Observation";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import { VoiceSelector } from "./VoiceMenu";

/**
 * Manages the UI aspects of finding, creating, and decorating the voice selection menu.
 */
export class VoiceMenuUIManager {
  private voiceMenuInstance: VoiceSelector | null = null;

  constructor(
    private chatbot: Chatbot,
    private userPreferences: UserPreferenceModule
  ) {}

  /**
   * Finds the voice menu element within the given container, creates it if necessary,
   * decorates it, and instantiates the appropriate VoiceSelector.
   *
   * @param audioControlsContainer The HTMLElement expected to contain the voice menu.
   * @returns An Observation indicating the status of the voice menu element.
   */
  public findAndDecorateVoiceMenu(
    audioControlsContainer: HTMLElement
  ): Observation {
    // Check if the menu already exists via ID (if previously decorated by this manager perhaps)
    // Note: VoiceSelector implementations might assign IDs, but we search within the container first.

    let voiceMenuElement = audioControlsContainer.querySelector(
      this.chatbot.getVoiceMenuSelector()
    ) as HTMLElement | null;

    if (voiceMenuElement && voiceMenuElement instanceof HTMLElement) {
      // Found an existing element matching the selector
      const obs = Observation.foundUndecorated(
        "saypi-voice-menu", // Tentative ID, VoiceSelector constructor will set it properly
        voiceMenuElement
      );
      this.voiceMenuInstance = this.chatbot.getVoiceMenu(
        this.userPreferences,
        voiceMenuElement // Pass the found element
      );
      // VoiceSelector constructor handles ID assignment and decoration
      return Observation.foundAndDecorated(obs);
    }

    // Idempotency guard (#321): a menu we created on a previous call carries its
    // assigned id (e.g. "saypi-voice-menu") but NOT the host's
    // getVoiceMenuSelector() class, so the query above can never re-find it.
    // bootstrap re-invokes findAndDecorateVoiceMenu on every ready audio-controls
    // mutation, so without this guard the create branch below would insert a
    // SECOND menu each time. Re-find our own element by its id and report it as
    // already decorated rather than creating a duplicate. Keyed on the live
    // instance's getId() so it stays correct across chatbots (Pi, Claude, …).
    if (this.voiceMenuInstance) {
      const existing = document.getElementById(this.voiceMenuInstance.getId());
      if (existing && audioControlsContainer.contains(existing)) {
        return Observation.foundAlreadyDecorated(
          this.voiceMenuInstance.getId(),
          existing
        );
      }
    }

    // --- Element not found, create it ---
    console.debug("Voice menu element not found via selector, creating...");
    voiceMenuElement = document.createElement("div");
    // ID will be set by the VoiceSelector constructor

    // Instantiate the VoiceSelector, which handles decoration and ID assignment
    this.voiceMenuInstance = this.chatbot.getVoiceMenu(
      this.userPreferences,
      voiceMenuElement // Pass the newly created element
    );

    const positionFromEnd = this.voiceMenuInstance?.getPositionFromEnd() ?? 0;

    // Calculate insertion position from the end
    const childrenCount = audioControlsContainer.children.length;
    const insertionIndex = Math.max(0, childrenCount - positionFromEnd);

    // Insert the new element at the calculated position
    if (insertionIndex >= childrenCount) {
      audioControlsContainer.appendChild(voiceMenuElement);
    } else {
      audioControlsContainer.insertBefore(
        voiceMenuElement,
        audioControlsContainer.children[insertionIndex]
      );
    }

    const obs = Observation.foundUndecorated(
      this.voiceMenuInstance.getId(), // Get the ID set by the constructor
      voiceMenuElement
    );
    console.debug(
      `Created and inserted voice menu element with ID: ${obs.id}`
    );
    return Observation.foundAndDecorated(obs); // It's decorated by the VoiceSelector constructor
  }

  // Add other potential UI management methods related to the voice menu here if needed later.
} 