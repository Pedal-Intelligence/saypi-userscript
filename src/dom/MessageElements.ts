import { md5 } from "js-md5";
import { ElementTextStream, InputStreamOptions } from "../tts/InputStream";
import {
  AssistantSpeech,
  SpeechPlaceholder,
  SpeechUtterance,
} from "../tts/SpeechModel";
import { TTSControlsModule } from "../tts/TTSControlsModule";
import { SpeechSynthesisModule } from "../tts/SpeechSynthesisModule";
import { BillingModule, UtteranceCharge } from "../billing/BillingModule";
import { Observation } from "./Observation";
import { Chatbot } from "../chatbots/Chatbot";
import { PiAIChatbot } from "../chatbots/Pi";
import EventBus from "../events/EventBus";
import { isMobileDevice } from "../UserAgentModule";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import { SpeechHistoryModule } from "../tts/SpeechHistoryModule";
import { MessageState } from "../tts/MessageHistoryModule";
import telemetryModule, { TelemetryData } from "../TelemetryModule";
import { IconModule } from "../icons/IconModule";

// Add this interface definition near the top of the file after imports
interface MetricDefinition {
  key: string;
  label: string;
  color: string;
  value: number;
  actualValue?: number; // Actual value before any display adjustments
  explanation: string;
}

// Add this interface definition before the class
interface TimelineSegment {
  metricKey: string;
  label: string;
  start: number;
  end: number;
  duration: number;
  color: string;
  explanation?: string;
  row?: number;
}

// Add the window interface augmentation at the top of the file
declare global {
  interface Window {
    saypi?: {
      telemetry?: {
        getMessageTelemetry: (messageId: string) => Record<string, number> | null;
      };
    };
  }
}

class PopupMenu {
  private _element: HTMLElement;

  constructor(
    private message: AssistantResponse,
    element: HTMLElement,
    private speech: SpeechUtterance | null,
    private ttsControls: TTSControlsModule
  ) {
    this._element = element;
  }

  get element(): HTMLElement {
    return this._element;
  }

  decorate(): void {
    this._element.classList.add("popup-menu");
    this.ttsControls.addCopyButton(this.message, this._element, true);
    if (this.speech) {
      this.decorateSpeech(this.speech);
    }
  }
  decorateSpeech(speech: SpeechUtterance) {
    this.ttsControls.addSpeechButton(speech, this._element, null, true);
  }

  static find(chatbot: Chatbot, searchRoot: HTMLElement): Observation {
    let popupMenu = searchRoot.querySelector(".popup-menu");
    if (popupMenu) {
      return Observation.foundAlreadyDecorated(".popup-menu", popupMenu);
    }
    popupMenu = searchRoot.querySelector(".shadow-input") as HTMLElement | null; // TODO: generalize with Chatbot parameter
    if (popupMenu) {
      return Observation.foundUndecorated(".popup-menu", popupMenu);
    }
    return Observation.notFound(".popup-menu");
  }
}

abstract class AssistantResponse {
  private _element: HTMLElement;
  private stable: boolean = false;
  // visible for testing
  static PARAGRAPH_SEPARATOR = ""; // should match ElementInputStream's delimiter argument
  protected includeInitialText = true; // stable text may be called on completed messages, so include the initial text unless streaming
  protected ttsControlsModule: TTSControlsModule;
  protected messageControls: MessageControls;

  abstract get contentSelector(): string;
  abstract createTextStream(
    content: HTMLElement,
    options?: InputStreamOptions
  ): ElementTextStream;
  abstract decorateControls(): MessageControls;

  constructor(element: HTMLElement, includeInitialText = true) {
    this._element = element;
    this.includeInitialText = includeInitialText;
    this.ttsControlsModule = TTSControlsModule.getInstance();
    this.decorate();
    this.messageControls = this.decorateControls();
  }

  private async decorate(): Promise<void> {
    this._element.classList.add("chat-message", "assistant-message");
    await this.decoratedContent();
  }

  /**
   * Waits for the content of the chat message to load and returns it
   * The content is the main text of the chat message, excluding any metadata or buttons
   * @returns Promise<HTMLElement> - the content of the chat message
   */
  async decoratedContent(): Promise<HTMLElement> {
    const content = this._element.querySelector(".content");
    if (content) {
      // content already found and decorated
      return content as HTMLElement;
    }
    const wfull = this._element.querySelector(this.contentSelector);
    if (wfull) {
      // content found but not decorated yet
      wfull.classList.add("content");
      return wfull as HTMLElement;
    }
    // content not found, wait for it to load
    return new Promise((resolve) => {
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const node of [...mutation.addedNodes]) {
            if (node instanceof HTMLElement) {
              const addedElement = node as HTMLElement;
              const classNameFromContentSelector =
                this.contentSelector.split(".")[1];
              if (
                addedElement.classList.contains(classNameFromContentSelector)
              ) {
                addedElement.classList.add("content");
                observer.disconnect();
                resolve(addedElement);
              }
            }
          }
        }
      });
    });
  }

  /**
   * Check if this is the last, i.e. most recent message in the chat history
   * @returns true if this is the most recent message, false otherwise
   */
  isLastMessage(): boolean {
    const lastMessage = document.querySelector("#saypi-chat-history .present-messages .assistant-message:last-of-type");
    return lastMessage === this._element;
  }

  /**
   * Get the text content of the chat message,
   * as it is at the time of calling this method, which may not be completely loaded if the response is still streaming
   * Get stableText() to get the finished text content of the chat message
   */
  get text(): string {
    const contentNode = this._element.querySelector(".content");
    if (contentNode) {
      const content = contentNode as HTMLElement;
      const textContent = content.innerText || content.textContent || "";
      return textContent.replace(/\n/g, AssistantResponse.PARAGRAPH_SEPARATOR);
    }
    return "";
  }

  /**
   * Get the final text content of the chat message
   * This method waits for the text content to be completely loaded
   */
  async stableText(): Promise<string> {
    if (this.stable) {
      return this.text;
    }
    const content = await this.decoratedContent();
    const options = { includeInitialText: this.includeInitialText };
    const textStream = this.createTextStream(content, options);
    return new Promise((resolve) => {
      textStream.getStream().subscribe({
        complete: () => {
          this.stable = true;
          resolve(this.text);
        },
      });
    });
  }

  /**
   * Get the md5 hash of the text content of the chat message
   * Use this function only if you know the text content is already stable,
   * otherwise get stableHash() to get the hash of the final text content
   */
  get hash(): string {
    // return a md5 hash of the text content
    return md5(this.text);
  }

  async stableHash(): Promise<string> {
    // return a md5 hash of the text content
    const stableText = await this.stableText();
    return md5(stableText);
  }

  get element(): HTMLElement {
    return this._element;
  }

  get utteranceId(): string | null {
    return this._element.dataset.utteranceId || null;
  }

  get isTTSEnabled(): boolean {
    return this.utteranceId !== null;
  }

  /**
   * Apply speech to this chat message
   * @param utterance
   */
  async decorateSpeech(utterance: SpeechUtterance): Promise<void> {
    if (utterance instanceof SpeechPlaceholder) {
      return;
    }
    
    // Update the utteranceId in the dataset with the real utterance ID
    this._element.dataset.utteranceId = utterance.id;
    
    // Add speech-enabled class to the message element
    this._element.classList.add("speech-enabled");
  }

  async decorateIncompleteSpeech(replace: boolean = false): Promise<void> {
    this._element.classList.add("speech-incomplete");

    const price = await UserPreferenceModule.getInstance()
      .getVoice()
      .then((voice) => {
        if (!voice) {
          return 0;
        }
        return BillingModule.getInstance().quote(voice!, this.text);
      });
    const regenButton = this.ttsControlsModule.createGenerateSpeechButton(price);

    const readAloudButton = this._element.querySelector(
      ".saypi-speak-button"
    );
    if (readAloudButton && replace) {
      readAloudButton.replaceWith(regenButton);
    } else {
      const messageControlsElement = this._element.querySelector(
        ".saypi-tts-controls"
      ) as HTMLDivElement | null;
      if (messageControlsElement) {
        messageControlsElement.appendChild(regenButton);
      }
    }

    // add event listener to regenerate speech
    regenButton.addEventListener("click", async () => {
      regenButton.disabled = true;
      const speechSynthesis = SpeechSynthesisModule.getInstance();
      const speechHistory = SpeechHistoryModule.getInstance();
      speechSynthesis
        .createSpeech(this.text, false)
        .then((utterance) => {
          speechSynthesis.speak(utterance);
          this.decorateSpeech(utterance);
          const charge = BillingModule.getInstance().charge(
            utterance,
            this.text
          );
          this.decorateCost(charge);
          const speech = new AssistantSpeech(utterance, charge);
          speechHistory.addSpeechToHistory(charge.utteranceHash, speech);
          regenButton.remove();
          this._element.classList.remove("speech-incomplete");
        });
    });
  }

  async decorateCost(charge: UtteranceCharge): Promise<void> {
    this.messageControls.decorateCost(charge);
  }

  async decorateState(state: MessageState): Promise<void> {
    if (state.isMaintenanceMessage) {
      const element = this.element;
      element.classList.add("maintenance-message", "silenced");
      
      // Generate a friendly label from a set of options
      const friendlyLabels = [
        chrome.i18n.getMessage("maintenanceLabel_saving"),
        chrome.i18n.getMessage("maintenanceLabel_processing"),
        chrome.i18n.getMessage("maintenanceLabel_holding"),
        chrome.i18n.getMessage("maintenanceLabel_mental_note"),
        chrome.i18n.getMessage("maintenanceLabel_tracking"),
        chrome.i18n.getMessage("maintenanceLabel_tucking"),
        chrome.i18n.getMessage("maintenanceLabel_remembering")
      ];
      const randomLabel = friendlyLabels[Math.floor(Math.random() * friendlyLabels.length)];
      
      // Find the content element and add the label as a data attribute
      const contentElement = await this.decoratedContent();
      if (contentElement) {
        // Create a label that includes both icon and text
        const brainIcon = IconModule.brain ? IconModule.brain.cloneNode(true) as SVGElement : null;
        
        // Set the label with the icon marker that will be replaced with actual SVG in CSS
        contentElement.dataset.messageLabel = `${randomLabel} (${chrome.i18n.getMessage("clickToExpand")})`;
        
        // If we have a brain icon from IconModule, add it to the content element
        if (brainIcon) {
          brainIcon.classList.add("thinking-icon");
          contentElement.dataset.hasThinkingIcon = "true";
          
          // Create a container for the icon if it doesn't exist
          let iconContainer = contentElement.querySelector(".thinking-icon-container");
          if (!iconContainer) {
            iconContainer = document.createElement("div");
            iconContainer.className = "thinking-icon-container";
            contentElement.insertBefore(iconContainer, contentElement.firstChild);
          }
          
          // Add the icon to the container
          iconContainer.appendChild(brainIcon);
        }
      }
      
      // Add touchend event for mobile support, using a separate handler to ensure proper event behavior
      element.addEventListener("click", () => {
        element.classList.toggle("silenced");
      });
      
      // Add touchend event for mobile devices
      element.addEventListener("touchend", (e) => {
        // Prevent default only for touchend to avoid interfering with scrolling
        e.preventDefault();
        element.classList.toggle("silenced");
      });
    }
  }

  toString(): string {
    const text = this.text
      ? `"${this.text.substring(0, 9)}..."` // show first 9 characters
      : `AssistantResponse: { id: ${this.element.id}, utteranceId: ${this.utteranceId}, hash: ${this.hash} }`;
    return text;
  }
}

abstract class MessageControls {
  protected hoverMenu: HTMLElement | null; // hover menu is the container for the message controls
  protected messageControlsElement: HTMLElement | null; // message controls is the container for Say, Pi buttons etc.
  protected telemetryData: TelemetryData | null = null;
  protected telemetryContainer: HTMLElement | null = null;

  constructor(
    protected message: AssistantResponse,
    protected ttsControls: TTSControlsModule
  ) {
    this.hoverMenu = this.messageControlsElement = null; // will be initialized in decorateControls()
    this.decorateControls(message);
    
    if (this.message.isLastMessage()) {
      // Listen for telemetry updates
      EventBus.on("telemetry:updated", this.handleTelemetryUpdate);
    }
  }

  protected getExtraControlClasses(): string[] {
    return [];
  }

  /**
   * Get a CSS selector for the hover menu element, relative to the message element
   */
  abstract getHoverMenuSelector(): string;

  findHoverMenu(): HTMLElement | null {
    return this.message.element.querySelector(".message-hover-menu");
  }

  protected async decorateControls(message: AssistantResponse): Promise<void> {
    return new Promise((resolve) => {
      const findAndDecorateHoverMenu = () => {
        let hoverMenu = this.findHoverMenu();
        if (!hoverMenu) {
          hoverMenu = message.element.querySelector(
            this.getHoverMenuSelector()
          );
          if (hoverMenu) {
            hoverMenu.classList.add("message-hover-menu");
            this.hoverMenu = hoverMenu;
            // pi-specific thread button (TODO: move to PiAIChatbot)
            if (hoverMenu.children.length > 0) {
              const createThreadButton = hoverMenu
                .children[0] as HTMLDivElement;
              createThreadButton.classList.add("create-thread-button");
            }
          } else {
            console.debug(
              "Hover menu not ready, wait until the message is fully loaded"
            );
            this.watchForHoverMenu(message, findAndDecorateHoverMenu);
            return;
          }
        }

        let msgCtrlsElement = message.element.querySelector(
          ".saypi-tts-controls"
        ) as HTMLDivElement;
        if (!msgCtrlsElement) {
          msgCtrlsElement = document.createElement("div");
          msgCtrlsElement.classList.add(
            "saypi-tts-controls",
            ...this.getExtraControlClasses()
          );
          hoverMenu?.appendChild(msgCtrlsElement);
        }
        this.messageControlsElement = msgCtrlsElement;

        const copyButtonElement =
          msgCtrlsElement.querySelector(".saypi-copy-button");
        if (!copyButtonElement) {
          this.ttsControls.addCopyButton(this.message, msgCtrlsElement);
        }

        // Add telemetry button at the end
        const telemetryButtonElement = 
          msgCtrlsElement.querySelector(".saypi-telemetry-button");
        if (!telemetryButtonElement) {
          // We'll add it after all other controls are added
          setTimeout(() => {
            const telemetryButton = this.createTelemetryButton();
            msgCtrlsElement.appendChild(telemetryButton);
          }, 0);
        }

        resolve();
      };

      findAndDecorateHoverMenu();
    });
  }

  private watchForHoverMenu(
    message: AssistantResponse,
    callback: () => void
  ): void {
    // setup an observer to wait for the hover menu to load
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of [...mutation.addedNodes]) {
          if (node instanceof HTMLElement) {
            const addedElement = node as HTMLElement;
            if (addedElement.querySelector(this.getHoverMenuSelector())) {
              observer.disconnect();
              callback();
              return;
            }
          }
        }
      }
    });
    observer.observe(message.element, { childList: true, subtree: true });
  }

  /**
   * Apply speech to this chat message
   * @param utterance
   */
  async decorateSpeech(utterance: SpeechUtterance): Promise<void> {
    if (utterance instanceof SpeechPlaceholder) {
      return;
    }
    
    // Update the utteranceId in the dataset with the real utterance ID
    this.message.element.dataset.utteranceId = utterance.id;
    
    // Add speech-enabled class to the message element
    this.message.element.classList.add("speech-enabled");
  }

  private watchForPopupMenu(
    hoverMenu: HTMLElement,
    speech: SpeechUtterance
  ): void {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of [...mutation.addedNodes]) {
          if (node instanceof HTMLElement) {
            const addedElement = node as HTMLElement;
            const obs = PopupMenu.find(new PiAIChatbot(), addedElement);
            if (obs.found && !obs.decorated) {
              const popupMenu = new PopupMenu(
                this.message,
                obs.target as HTMLElement,
                speech,
                this.ttsControls
              );
              popupMenu.decorate();
              EventBus.emit("saypi:tts:menuPop", {
                utteranceId: speech.id,
                menu: popupMenu,
              });
            }
          }
        }
      }
    });
    observer.observe(hoverMenu, { childList: true, subtree: false });
  }

  async decorateIncompleteSpeech(replace: boolean = false): Promise<void> {
    this.message.element.classList.add("speech-incomplete");

    const price = await UserPreferenceModule.getInstance()
      .getVoice()
      .then((voice) => {
        if (!voice) {
          return 0;
        }
        return BillingModule.getInstance().quote(voice!, this.message.text);
      });
    const regenButton = this.ttsControls.createGenerateSpeechButton(price);

    const readAloudButton = this.message.element.querySelector(
      ".saypi-speak-button"
    );
    if (readAloudButton && replace) {
      readAloudButton.replaceWith(regenButton);
    } else {
      const messageControlsElement = this.message.element.querySelector(
        ".saypi-tts-controls"
      ) as HTMLDivElement | null;
      if (messageControlsElement) {
        messageControlsElement.appendChild(regenButton);
      }
    }

    // add event listener to regenerate speech
    regenButton.addEventListener("click", async () => {
      regenButton.disabled = true;
      const speechSynthesis = SpeechSynthesisModule.getInstance();
      const speechHistory = SpeechHistoryModule.getInstance();
      speechSynthesis
        .createSpeech(this.message.text, false)
        .then((utterance) => {
          speechSynthesis.speak(utterance);
          this.decorateSpeech(utterance);
          const charge = BillingModule.getInstance().charge(
            utterance,
            this.message.text
          );
          this.decorateCost(charge);
          const speech = new AssistantSpeech(utterance, charge);
          speechHistory.addSpeechToHistory(charge.utteranceHash, speech);
          regenButton.remove();
          this.message.element.classList.remove("speech-incomplete");
        });
    });
  }

  /**
   * Apply a charge to this chat message
   * Can be called multiple times to update the charge
   * @param charge The cost of the speech
   */
  decorateCost(charge: UtteranceCharge): void {
    const ttsControlsElement = this.message.element.querySelector(
      ".saypi-tts-controls"
    ) as HTMLDivElement | null;
    const costElement = this.message.element.querySelector(".saypi-cost");
    if (ttsControlsElement && !costElement) {
      this.ttsControls.addCostBasis(ttsControlsElement, charge);
    } else if (costElement) {
      this.ttsControls.updateCostBasis(
        ttsControlsElement as HTMLElement,
        charge
      );
    }

    const messageContentElement =
      this.message.element.querySelector(".content");
    if (messageContentElement) {
      messageContentElement.id = `saypi-message-content-${this.message.utteranceId}`;
    }

    if (isMobileDevice()) {
      // TODO: we need a way to deregister this listener when the message is removed - perhaps a teardown method?
      EventBus.on(
        "saypi:tts:menuPop",
        (event: { utteranceId: string; menu: PopupMenu }) => {
          const id = this.message.element.dataset.utteranceId;
          if (
            !id ||
            id !== event.utteranceId ||
            id !== charge.utteranceId ||
            !charge.cost
          ) {
            return;
          }
          const menuElement = event.menu.element;
          const menuCostElement = menuElement.querySelector(".saypi-cost");
          if (menuCostElement) {
            this.ttsControls.updateCostBasis(menuElement, charge);
          } else {
            this.ttsControls.addCostBasis(menuElement, charge, true);
          }
        }
      );
    }
  }

  /**
   * Create a button to show telemetry visualization
   */
  private createTelemetryButton(): HTMLButtonElement {
    const button = document.createElement("button");
    button.className = "saypi-telemetry-button";
    button.title = "View performance metrics";
    
    // Use the stopwatch icon from IconModule
    button.appendChild(IconModule.stopwatch);
    
    button.addEventListener("click", () => {
      this.toggleTelemetryVisualization();
    });
    
    return button;
  }

  /**
   * Toggle the telemetry visualization
   */
  private toggleTelemetryVisualization(): void {
    // Check if we already have a telemetry container
    let telemetryContainer = this.message.element.querySelector(".saypi-telemetry-container") as HTMLElement;
    
    if (telemetryContainer) {
      // Toggle visibility
      if (telemetryContainer.style.display === "none") {
        telemetryContainer.style.display = "block";
      } else {
        telemetryContainer.style.display = "none";
      }
    } else {
      // Otherwise, create it
      this.createTelemetryVisualization().then(() => {
        // The container is now created and stored in this.telemetryContainer
        if (this.telemetryContainer) {
          this.telemetryContainer.style.display = "block";
        }
      });
    }
  }

  /**
   * Handle telemetry updates from the TelemetryModule
   */
  private handleTelemetryUpdate = (event: { data: TelemetryData }): void => {
    // Update visualization if it's currently shown
    const container = this.message.element.querySelector(".saypi-telemetry-container") as HTMLElement;
    if (container && container.style.display !== "none") {
      container.remove();
      this.createTelemetryVisualization();
    }
  }

  /**
   * Get performance metrics for display
   */
  private fetchTelemetryData(): { metrics: MetricDefinition[], totalTime: number } {
    const telemetryData = telemetryModule.getCurrentTelemetry();
    console.debug("Fetched raw telemetry data:", JSON.stringify(telemetryData, null, 2));
    
    const metrics: MetricDefinition[] = [];
    
    // Get timestamps for additional calculations
    const timestamps = telemetryData.timestamps || {};
    
    // Map telemetry data to display metrics
    if (telemetryData.transcriptionDelay) {
      console.debug("Mapped transcriptionDelay", telemetryData.transcriptionDelay + "ms", "to voiceActivityDetection");
      metrics.push({
        key: 'voiceActivityDetection',
        label: 'Grace Period',
        value: telemetryData.transcriptionDelay,
        color: '#2979FF', // Brighter blue to make it more noticeable
        explanation: 'Intentional delay between receiving final transcription and submitting prompt to LLM - allows for detecting if user is truly finished speaking'
      });
    } else {
      console.warn("No transcriptionDelay found in telemetry data:", telemetryData);
      
      // Calculate the grace period from timestamps if available
      if (timestamps.transcriptionEnd && timestamps.promptSubmission) {
        const calculatedGracePeriod = timestamps.promptSubmission - timestamps.transcriptionEnd;
        console.debug("Calculated grace period from timestamps:", calculatedGracePeriod + "ms");
        metrics.push({
          key: 'voiceActivityDetection',
          label: 'Grace Period',
          value: calculatedGracePeriod,
          color: '#2979FF', // Brighter blue to make it more noticeable
          explanation: 'Intentional delay between receiving final transcription and submitting prompt to LLM - allows for detecting if user is truly finished speaking'
        });
      } else {
        // If no timestamps either, add a placeholder with zero duration to ensure visibility
        console.debug("Adding placeholder grace period with zero duration");
        metrics.push({
          key: 'voiceActivityDetection',
          label: 'Grace Period',
          value: 0,
          color: '#2979FF', // Brighter blue to make it more noticeable
          explanation: 'Intentional delay between receiving final transcription and submitting prompt to LLM - allows for detecting if user is truly finished speaking'
        });
      }
    }
    
    // Check for transcription data, either in the direct property or calculate from timestamps
    if (telemetryData.transcriptionTime) {
      console.debug("Mapped transcriptionTime", telemetryData.transcriptionTime + "ms", "to transcriptionDuration");
      metrics.push({
        key: 'transcriptionDuration',
        label: 'Transcription',
        value: telemetryData.transcriptionTime,
        color: '#DB4437', // Red
        explanation: 'Time taken to transcribe speech to text'
      });
    } else if (timestamps.transcriptionStart && timestamps.transcriptionEnd) {
      // Calculate transcription time from timestamps
      const calculatedTranscriptionTime = timestamps.transcriptionEnd - timestamps.transcriptionStart;
      console.debug("Calculated transcriptionTime from timestamps:", calculatedTranscriptionTime + "ms");
      metrics.push({
        key: 'transcriptionDuration',
        label: 'Transcription',
        value: calculatedTranscriptionTime,
        color: '#DB4437', // Red
        explanation: 'Time taken to transcribe speech to text (calculated from timestamps)'
      });
    }
    
    if (telemetryData.streamingDuration) {
      console.debug("Mapped streamingDuration", telemetryData.streamingDuration + "ms");
      metrics.push({
        key: 'streamingDuration',
        label: 'Pi writes',
        value: telemetryData.streamingDuration,
        color: '#F4B400', // Yellow/Gold
        explanation: 'Time taken to stream the text response'
      });
    }
    
    // Add a new metric for speech playback
    if (timestamps.audioPlaybackStart) {
      console.debug("Added Pi's speech playback marker");
      metrics.push({
        key: 'speechPlayback',
        label: 'Pi Speaks: 5+s',
        value: 5000, // Just a small duration to make it visible - this is just a marker
        color: '#0F9D58', // Green
        explanation: 'Point when Pi begins speaking the response (continues beyond timeline)'
      });
    }
    
    if (telemetryData.completionResponse) {
      console.debug("Mapped completionResponse", telemetryData.completionResponse + "ms");
      metrics.push({
        key: 'completionResponse',
        label: 'LLM Wait Time',
        value: telemetryData.completionResponse,
        color: '#673AB7', // Purple
        explanation: 'Time waiting for Pi to formulate a response'
      });
    }
    
    if (telemetryData.timeToTalk) {
      console.debug("Mapped timeToTalk", telemetryData.timeToTalk + "ms");
      metrics.push({
        key: 'timeToTalk',
        label: 'Time to Talk',
        value: telemetryData.timeToTalk,
        color: '#3F51B5', // Indigo
        explanation: 'Time from start of response to start of audio playback'
      });
    }
    
    // Calculate total end-to-end time
    let totalTime = 0;
    
    // If we have timestamps, calculate from speechEnd to audioPlaybackStart
    if (telemetryData.timestamps?.speechEnd && telemetryData.timestamps?.audioPlaybackStart) {
      totalTime = telemetryData.timestamps.audioPlaybackStart - telemetryData.timestamps.speechEnd;
    } else {
      // Otherwise sum up the component times
      totalTime = (telemetryData.transcriptionTime || 0) + 
                 (telemetryData.transcriptionDelay || 0) + 
                 (telemetryData.completionResponse || 0);
    }
    
    console.debug("Calculated totalTime:", totalTime + "ms");
    
    metrics.push({
      key: 'totalTime',
      label: 'Speech to Speech',
      value: totalTime,
      color: '#9E9E9E', // Gray
      explanation: 'Total time from end of user speech to beginning of Pi\'s audio response'
    });
    
    console.debug("Mapped telemetry metrics:", metrics.map(m => m.key).join(", "));
    
    return { metrics, totalTime };
  }

  /**
   * Creates a visualization of the telemetry data
   */
  private async createTelemetryVisualization() {
    const { metrics, totalTime } = this.fetchTelemetryData();
    if (!metrics.length) {
      console.warn("No metrics to display");
      return;
    }

    // Create container for telemetry data
    const container = document.createElement("div");
    container.className = "saypi-telemetry-container";
    
    // Add title
    const title = document.createElement("h4");
    title.textContent = "Performance Metrics";
    title.style.margin = "0 0 10px 0";
    title.style.fontSize = "14px";
    title.style.fontWeight = "bold";
    container.appendChild(title);

    // Create chart container
    const chartContainer = document.createElement("div");
    chartContainer.style.padding = "10px 0";
    container.appendChild(chartContainer);

    // Create the timeline chart (Gantt chart)
    this.createTimelineChart(chartContainer, metrics);

    // Insert the telemetry visualization into the DOM
    this.message.element.appendChild(container);
    this.telemetryContainer = container;
  }

  /**
   * Create a timeline chart visualization that shows overlapping processes in Gantt chart style
   */
  private createTimelineChart(container: HTMLElement, metrics: MetricDefinition[]): void {
    // Sort metrics by key based on a predefined order for consistency
    const orderArray = ['transcriptionDuration', 'voiceActivityDetection', 'completionResponse', 'streamingDuration', 'speechPlayback', 'timeToTalk', 'totalTime'];
    metrics.sort((a, b) => {
      return orderArray.indexOf(a.key) - orderArray.indexOf(b.key);
    });

    // Log available metrics for debugging
    console.debug("Available metrics for timeline:", metrics.map(m => `${m.key}: ${m.value}ms`).join(", "));

    // Get telemetry data with proper positioning
    const { segments, timelineEnd } = this.calculateTimelinePositions(metrics);
    
    // No longer adding synthetic segments - only use actual data
    
    // Debug: log all segments to see what's being calculated
    console.debug("Timeline segments:", segments.map(s => 
      `${s.metricKey}: start=${(s.start/1000).toFixed(2)}s, end=${(s.end/1000).toFixed(2)}s, duration=${(s.duration/1000).toFixed(2)}s`
    ).join("\n"));
    
    // Calculate time scale - round up to the nearest second for better tick marks
    const timelineEndSeconds = Math.ceil(timelineEnd / 1000);
    
    // Create timeline chart container
    const chartContainer = document.createElement("div");
    chartContainer.className = "saypi-timeline-chart";
    chartContainer.style.fontFamily = "system-ui, -apple-system, sans-serif";
    chartContainer.style.fontSize = "12px";
    chartContainer.style.position = "relative";
    chartContainer.style.padding = "10px 0";
    container.appendChild(chartContainer);
    
    // Create time scale at the top
    const timeScale = document.createElement("div");
    timeScale.className = "timeline-scale";
    timeScale.style.position = "relative";
    timeScale.style.height = "24px";
    timeScale.style.marginLeft = "160px"; // Space for labels
    timeScale.style.marginBottom = "5px";
    timeScale.style.borderBottom = "1px solid #ccc";
    
    // Determine appropriate tick interval based on timeline length
    let tickInterval = 1; // Default: show every second
    if (timelineEndSeconds > 60) {
      tickInterval = 10; // For very long timelines (>60s), show every 10 seconds
    } else if (timelineEndSeconds > 30) {
      tickInterval = 5; // For long timelines (>30s), show every 5 seconds
    } else if (timelineEndSeconds > 15) {
      tickInterval = 2; // For medium timelines (>15s), show every 2 seconds
    }
    
    // Add second markers with dynamic intervals
    for (let i = 0; i <= timelineEndSeconds; i += tickInterval) {
      const tickMark = document.createElement("div");
      tickMark.className = "tick-mark";
      tickMark.style.position = "absolute";
      tickMark.style.left = `${(i * 1000 / timelineEnd) * 100}%`;
      tickMark.style.bottom = "0";
      tickMark.style.width = "1px";
      tickMark.style.height = "6px";
      tickMark.style.backgroundColor = "#888";
      
      const tickLabel = document.createElement("div");
      tickLabel.className = "tick-label";
      tickLabel.textContent = `${i}s`;
      tickLabel.style.position = "absolute";
      tickLabel.style.left = `${(i * 1000 / timelineEnd) * 100}%`;
      tickLabel.style.bottom = "8px";
      tickLabel.style.transform = "translateX(-50%)";
      tickLabel.style.fontSize = "10px";
      tickLabel.style.color = "#555";
      
      timeScale.appendChild(tickMark);
      timeScale.appendChild(tickLabel);
    }
    
    // Add 'Timeline (seconds)' label with interval information
    const scaleLabel = document.createElement("div");
    scaleLabel.textContent = tickInterval > 1 ? 
      `Timeline (seconds, marks at ${tickInterval}s intervals)` : 
      "Timeline (seconds)";
    scaleLabel.style.position = "absolute";
    scaleLabel.style.left = "0";
    scaleLabel.style.top = "0";
    scaleLabel.style.fontSize = "11px";
    scaleLabel.style.fontWeight = "500";
    scaleLabel.style.color = "#555";
    timeScale.appendChild(scaleLabel);
    
    chartContainer.appendChild(timeScale);
    
    // Create a row for each metric
    const ganttRows = document.createElement("div");
    ganttRows.className = "gantt-rows";
    ganttRows.style.position = "relative";
    
    // Group segments by metric key
    const metricSegments = new Map<string, TimelineSegment[]>();
    segments.forEach(segment => {
      // Handle gap segments separately
      if (segment.metricKey.startsWith('gap_')) {
        if (!metricSegments.has('gaps')) {
          metricSegments.set('gaps', []);
        }
        metricSegments.get('gaps')?.push(segment);
      } else {
        if (!metricSegments.has(segment.metricKey)) {
          metricSegments.set(segment.metricKey, []);
        }
        metricSegments.get(segment.metricKey)?.push(segment);
      }
    });
    
    // Check if we have any gap segments
    const hasGaps = metricSegments.has('gaps');
    
    // Create a row for each metric (even if it has multiple segments)
    metrics.forEach(metric => {
      const rowSegments = metricSegments.get(metric.key) || [];
      
      if (rowSegments.length === 0) {
        console.debug(`No segments found for metric ${metric.key}, skipping row`);
        return;
      }
      
      // Calculate the total actual duration for the displayed segments
      const actualDuration = rowSegments.reduce((total, segment) => total + segment.duration, 0);
      
      const rowContainer = document.createElement("div");
      rowContainer.className = "gantt-row";
      rowContainer.style.position = "relative";
      rowContainer.style.height = "30px";
      rowContainer.style.marginBottom = "6px";
      rowContainer.style.display = "flex";
      
      // Create label column
      const labelColumn = document.createElement("div");
      labelColumn.className = "row-label";
      labelColumn.style.width = "160px";
      labelColumn.style.paddingRight = "10px";
      labelColumn.style.boxSizing = "border-box";
      labelColumn.style.textAlign = "right";
      labelColumn.style.display = "flex";
      labelColumn.style.alignItems = "center";
      labelColumn.style.justifyContent = "flex-end";
      labelColumn.style.fontWeight = "500";
      
      // Add label with actual calculated duration from segments
      const labelText = metric.key === 'speechPlayback' ? 
        metric.label : // For speechPlayback, use the predefined label that includes "5+s"
        `${metric.label.split(':')[0]}: ${(actualDuration/1000).toFixed(2)}s`; // For other metrics, use calculated duration
      
      labelColumn.innerHTML = `<span>${labelText}</span>`;
      labelColumn.title = metric.explanation;
      
      // Create timeline column
      const timelineColumn = document.createElement("div");
      timelineColumn.className = "row-timeline";
      timelineColumn.style.flex = "1";
      timelineColumn.style.position = "relative";
      timelineColumn.style.height = "100%";
      timelineColumn.style.backgroundColor = "#f5f5f5";
      timelineColumn.style.border = "1px solid #e0e0e0";
      timelineColumn.style.borderRadius = "4px";
      
      // Add segments within this row
      rowSegments.forEach(segment => {
        const segmentElem = document.createElement("div");
        segmentElem.className = "gantt-segment";
        segmentElem.style.position = "absolute";
        segmentElem.style.left = `${(segment.start / timelineEnd) * 100}%`;
        segmentElem.style.width = `${(segment.duration / timelineEnd) * 100}%`;
        segmentElem.style.top = "4px";
        segmentElem.style.bottom = "4px";
        segmentElem.style.backgroundColor = segment.color;
        segmentElem.style.borderRadius = "3px";
        segmentElem.style.boxShadow = "0 1px 2px rgba(0,0,0,0.1)";
        
        // For Pi Speaks segment, extend to the right edge
        if (segment.metricKey === 'speechPlayback') {
          // Make the segment extend to the right edge of the chart
          segmentElem.style.width = `calc(100% - ${(segment.start / timelineEnd) * 100}%)`;
        }
        
        // Add start/end time labels if segment is wide enough
        if (segment.duration / timelineEnd > 0.05) {
          // For the Pi Speaks segment, just show a single "(ongoing)" label since it extends to the right edge
          if (segment.metricKey === 'speechPlayback') {
            const endTimeLabel = document.createElement("span");
            endTimeLabel.className = "segment-time end-time";
            endTimeLabel.textContent = `${(segment.start/1000).toFixed(2)}s+`;
            endTimeLabel.style.position = "absolute";
            endTimeLabel.style.left = "4px";
            endTimeLabel.style.top = "50%";
            endTimeLabel.style.transform = "translateY(-50%)";
            endTimeLabel.style.fontSize = "9px";
            endTimeLabel.style.color = "#fff";
            endTimeLabel.style.textShadow = "0 0 2px rgba(0,0,0,0.5)";
            segmentElem.appendChild(endTimeLabel);
          } else {
            // For regular segments, check if there's enough width for both labels
            // If segment is less than 15% of timeline width, only show one label in the middle
            if (segment.duration / timelineEnd < 0.15) {
              const middleLabel = document.createElement("span");
              middleLabel.className = "segment-time middle-time";
              middleLabel.textContent = `${(segment.duration/1000).toFixed(2)}s`;
              middleLabel.style.position = "absolute";
              middleLabel.style.left = "50%";
              middleLabel.style.top = "50%";
              middleLabel.style.transform = "translate(-50%, -50%)";
              middleLabel.style.fontSize = "9px";
              middleLabel.style.color = "#fff";
              middleLabel.style.textShadow = "0 0 2px rgba(0,0,0,0.5)";
              middleLabel.style.whiteSpace = "nowrap"; // Prevent text wrapping
              
              // For very small segments, show label outside the segment instead of inside
              if (segment.duration / timelineEnd < 0.05) {
                middleLabel.style.color = "#333";
                middleLabel.style.textShadow = "none";
                middleLabel.style.top = "-15px"; // Position above the segment
              }
              
              segmentElem.appendChild(middleLabel);
            } else {
              // For wider segments, show both start and end times with enough space
              const startTime = document.createElement("span");
              startTime.className = "segment-time start-time";
              startTime.textContent = `${(segment.start/1000).toFixed(2)}s`;
              startTime.style.position = "absolute";
              startTime.style.left = "4px";
              startTime.style.top = "50%";
              startTime.style.transform = "translateY(-50%)";
              startTime.style.fontSize = "9px";
              startTime.style.color = "#fff";
              startTime.style.textShadow = "0 0 2px rgba(0,0,0,0.5)";
              startTime.style.whiteSpace = "nowrap"; // Prevent text wrapping
              segmentElem.appendChild(startTime);
              
              const endTime = document.createElement("span");
              endTime.className = "segment-time end-time";
              endTime.textContent = `${(segment.end/1000).toFixed(2)}s`;
              endTime.style.position = "absolute";
              endTime.style.right = "4px";
              endTime.style.top = "50%";
              endTime.style.transform = "translateY(-50%)";
              endTime.style.fontSize = "9px";
              endTime.style.color = "#fff";
              endTime.style.textShadow = "0 0 2px rgba(0,0,0,0.5)";
              endTime.style.whiteSpace = "nowrap"; // Prevent text wrapping
              segmentElem.appendChild(endTime);
            }
          }
        }
        
        // Add tooltip on hover
        segmentElem.title = `${segment.label}: ${(segment.duration/1000).toFixed(2)}s\n${segment.explanation || ''}`;
        
        timelineColumn.appendChild(segmentElem);
      });
      
      rowContainer.appendChild(labelColumn);
      rowContainer.appendChild(timelineColumn);
      ganttRows.appendChild(rowContainer);
    });
    
    // Add a row for gaps if any
    if (hasGaps) {
      const gapSegments = metricSegments.get('gaps') || [];
      
      const rowContainer = document.createElement("div");
      rowContainer.className = "gantt-row";
      rowContainer.style.position = "relative";
      rowContainer.style.height = "30px";
      rowContainer.style.marginBottom = "6px";
      rowContainer.style.display = "flex";
      
      // Create label column
      const labelColumn = document.createElement("div");
      labelColumn.className = "row-label";
      labelColumn.style.width = "160px";
      labelColumn.style.paddingRight = "10px";
      labelColumn.style.boxSizing = "border-box";
      labelColumn.style.textAlign = "right";
      labelColumn.style.display = "flex";
      labelColumn.style.alignItems = "center";
      labelColumn.style.justifyContent = "flex-end";
      labelColumn.style.fontWeight = "500";
      labelColumn.innerHTML = `<span>Wait Times:</span>`;
      labelColumn.title = "Periods of time between processes";
      
      // Create timeline column
      const timelineColumn = document.createElement("div");
      timelineColumn.className = "row-timeline";
      timelineColumn.style.flex = "1";
      timelineColumn.style.position = "relative";
      timelineColumn.style.height = "100%";
      timelineColumn.style.backgroundColor = "#f5f5f5";
      timelineColumn.style.border = "1px solid #e0e0e0";
      timelineColumn.style.borderRadius = "4px";
      
      // Add gap segments
      gapSegments.forEach(segment => {
        const segmentElem = document.createElement("div");
        segmentElem.className = "gantt-segment";
        segmentElem.style.position = "absolute";
        segmentElem.style.left = `${(segment.start / timelineEnd) * 100}%`;
        segmentElem.style.width = `${(segment.duration / timelineEnd) * 100}%`;
        segmentElem.style.top = "4px";
        segmentElem.style.bottom = "4px";
        segmentElem.style.backgroundColor = segment.color;
        segmentElem.style.borderRadius = "3px";
        segmentElem.style.border = "1px dashed #aaa";
        
        // Add start/end time labels if segment is wide enough
        if (segment.duration / timelineEnd > 0.05) {
          const duration = document.createElement("span");
          duration.className = "segment-time duration";
          duration.textContent = `${(segment.duration/1000).toFixed(2)}s`;
          duration.style.position = "absolute";
          duration.style.left = "50%";
          duration.style.top = "50%";
          duration.style.transform = "translate(-50%, -50%)";
          duration.style.fontSize = "9px";
          duration.style.color = "#666";
          segmentElem.appendChild(duration);
        }
        
        // Add tooltip on hover
        segmentElem.title = `${segment.explanation}: ${(segment.duration/1000).toFixed(2)}s`;
        
        timelineColumn.appendChild(segmentElem);
      });
      
      rowContainer.appendChild(labelColumn);
      rowContainer.appendChild(timelineColumn);
      ganttRows.appendChild(rowContainer);
    }
    
    chartContainer.appendChild(ganttRows);
    
    // Add legend below the chart
    const legend = document.createElement("div");
    legend.className = "timeline-legend";
    legend.style.display = "flex";
    legend.style.flexWrap = "wrap";
    legend.style.marginTop = "15px";
    legend.style.justifyContent = "center";
    
    // Create a map of actual durations
    const metricDurations = new Map<string, number>();
    segments.forEach(segment => {
      if (!segment.metricKey.startsWith('gap_')) {
        const currentTotal = metricDurations.get(segment.metricKey) || 0;
        metricDurations.set(segment.metricKey, currentTotal + segment.duration);
      }
    });
    
    metrics.forEach(metric => {
      if (metric.value === undefined) return;
      
      const legendItem = document.createElement("div");
      legendItem.className = "legend-item";
      legendItem.style.display = "flex";
      legendItem.style.alignItems = "center";
      legendItem.style.marginRight = "15px";
      legendItem.style.marginBottom = "8px";
      
      const colorBox = document.createElement("div");
      colorBox.style.width = "12px";
      colorBox.style.height = "12px";
      colorBox.style.backgroundColor = metric.color;
      colorBox.style.marginRight = "5px";
      colorBox.style.borderRadius = "2px";
      
      const label = document.createElement("span");
      
      // Use the actual duration from segments for the label
      const actualDuration = metricDurations.get(metric.key) || metric.value;
      
      // For speech playback, use a special label format
      if (metric.key === 'speechPlayback') {
        label.textContent = `Pi Speaks: 5+s`;
      } else {
        label.textContent = `${metric.label.split(':')[0]}: ${(actualDuration/1000).toFixed(2)}s`;
      }
      
      label.style.fontSize = "12px";
      
      legendItem.appendChild(colorBox);
      legendItem.appendChild(label);
      legendItem.title = metric.explanation;
      
      legend.appendChild(legendItem);
    });
    
    // Add a legend item for gap segments if any
    if (hasGaps) {
      const legendItem = document.createElement("div");
      legendItem.className = "legend-item";
      legendItem.style.display = "flex";
      legendItem.style.alignItems = "center";
      legendItem.style.marginRight = "15px";
      legendItem.style.marginBottom = "8px";
      
      const colorBox = document.createElement("div");
      colorBox.style.width = "12px";
      colorBox.style.height = "12px";
      colorBox.style.backgroundColor = "#E0E0E0";
      colorBox.style.marginRight = "5px";
      colorBox.style.borderRadius = "2px";
      colorBox.style.border = "1px dashed #aaa";
      
      const label = document.createElement("span");
      label.textContent = "Wait Times";
      label.style.fontSize = "12px";
      
      legendItem.appendChild(colorBox);
      legendItem.appendChild(label);
      legendItem.title = "Periods of waiting between processes";
      
      legend.appendChild(legendItem);
    }
    
    chartContainer.appendChild(legend);
    
    // Add explanation
    const explanation = document.createElement("div");
    explanation.className = "timeline-explanation";
    explanation.style.fontSize = "11px";
    explanation.style.color = "#666";
    explanation.style.marginTop = "10px";
    explanation.style.textAlign = "center";
    explanation.innerHTML = "This timeline shows the speech-to-speech response time, from the end of user speech to the start of Pi's audio response.<br>Gaps between processes represent waiting periods.<br>Hover over segments for additional details.";
    
    chartContainer.appendChild(explanation);
    
    // The telemetry visualization is already inserted into the DOM in createTelemetryVisualization
  }

  /**
   * Calculate timeline positions for proper visualization of process timings
   */
  private calculateTimelinePositions(metrics: MetricDefinition[]): { segments: TimelineSegment[], timelineEnd: number } {
    // Initialize segments array and overall timeline end
    const segments: TimelineSegment[] = [];
    
    // Get telemetry data with timestamps
    const telemetryData = telemetryModule.getCurrentTelemetry();
    const timestamps = telemetryData.timestamps || {};
    
    // NOTE: The timeline starts at the end of the user's speech, which is captured at the
    // LAST saypi:userStoppedSpeaking event. The TelemetryModule overwrites timestamps.speechEnd
    // each time this event fires, so we're always using the most recent (final) speech end time.
    
    // Log all raw timestamps to understand the timing issues
    console.debug("RAW TIMESTAMPS:", JSON.stringify(timestamps, null, 2));
    
    // Check for inconsistencies between stored durations and actual timestamp differences
    console.debug("DURATION VERIFICATION:");
    console.debug("Telemetry stored durations:", {
      transcriptionTime: telemetryData.transcriptionTime,
      transcriptionDelay: telemetryData.transcriptionDelay,
      completionResponse: telemetryData.completionResponse,
      streamingDuration: telemetryData.streamingDuration,
      timeToTalk: telemetryData.timeToTalk
    });
    
    // Calculate durations from timestamps for comparison
    const calculatedDurations = {
      transcriptionTime: timestamps.transcriptionStart && timestamps.transcriptionEnd ? 
        timestamps.transcriptionEnd - timestamps.transcriptionStart : undefined,
      transcriptionDelay: timestamps.transcriptionEnd && timestamps.promptSubmission ? 
        timestamps.promptSubmission - timestamps.transcriptionEnd : undefined,
      completionResponse: timestamps.promptSubmission && timestamps.completionStart ? 
        timestamps.completionStart - timestamps.promptSubmission : undefined,
      streamingDuration: timestamps.completionStart && timestamps.completionEnd ? 
        timestamps.completionEnd - timestamps.completionStart : undefined,
      timeToTalk: timestamps.completionStart && timestamps.audioPlaybackStart ? 
        timestamps.audioPlaybackStart - timestamps.completionStart : undefined
    };
    console.debug("Calculated durations from timestamps:", calculatedDurations);
    
    // Check for inconsistencies
    for (const [key, value] of Object.entries(calculatedDurations)) {
      if (value !== undefined && telemetryData[key as keyof TelemetryData] !== undefined) {
        const storedValue = telemetryData[key as keyof TelemetryData] as number;
        const diff = Math.abs(storedValue - value);
        if (diff > 100) { // More than 100ms difference is probably significant
          console.warn(`INCONSISTENCY DETECTED: ${key} stored=${storedValue}ms, calculated=${value}ms, diff=${diff}ms`);
        }
      }
    }
    
    // Check and log timing analysis for debugging
    if (timestamps.transcriptionStart && timestamps.promptSubmission && 
        timestamps.completionStart && timestamps.audioPlaybackStart) {
      console.debug("TIMING ANALYSIS:");
      
      if (timestamps.speechEnd) {
        console.debug(`Speech end to transcription start: ${timestamps.transcriptionStart - timestamps.speechEnd}ms`);
      }
      
      if (timestamps.transcriptionEnd) {
        console.debug(`Transcription start to end: ${timestamps.transcriptionEnd - timestamps.transcriptionStart}ms`);
        console.debug(`Transcription end to prompt submission: ${timestamps.promptSubmission - timestamps.transcriptionEnd}ms`);
      }
      
      console.debug(`Prompt submission to completion start: ${timestamps.completionStart - timestamps.promptSubmission}ms`);
      console.debug(`Completion start to audio playback: ${timestamps.audioPlaybackStart - timestamps.completionStart}ms`);
      
      if (timestamps.completionEnd) {
        console.debug(`CRITICAL CHECK - Audio playback vs completion end: ${timestamps.audioPlaybackStart - timestamps.completionEnd}ms`);
      }
    }
    
    // Find the earliest timestamp to use as a reference point
    const allTimestamps = Object.values(timestamps).filter(t => t !== undefined) as number[];
    const earliestTimestamp = allTimestamps.length > 0 ? Math.min(...allTimestamps) : 0;
    
    // If we don't have timestamps, fall back to the old calculation method
    if (earliestTimestamp === 0) {
      return this.calculateTimelinePositionsFromDurations(metrics);
    }
    
    // Instead of using the earliest timestamp as reference, use speechEnd
    // This ensures the timeline starts at the end of user speech, not the beginning
    const referenceTimestamp = timestamps.speechEnd || earliestTimestamp;
    console.debug(`Using reference timestamp: ${referenceTimestamp} (speech end: ${timestamps.speechEnd}, earliest: ${earliestTimestamp})`);
    
    // Create a segment for each process using actual timestamps
    metrics.forEach(metric => {
      if (metric.value === undefined) return;
      
      let start = 0;
      let end = 0;
      
      switch (metric.key) {
        case 'voiceActivityDetection':
          // For transcriptionDelay, use transcription end to prompt submission time
          if (timestamps.transcriptionEnd && timestamps.promptSubmission) {
            start = timestamps.transcriptionEnd - referenceTimestamp;
            end = timestamps.promptSubmission - referenceTimestamp;
            console.debug(`Grace Period: Using actual timestamps - start: ${start}ms, end: ${end}ms, duration: ${end-start}ms`);
          } else if (timestamps.transcriptionEnd) {
            // Fallback if we only have transcription end
            start = timestamps.transcriptionEnd - referenceTimestamp;
            end = start + Math.max(metric.value, 100); // Ensure at least 100ms visibility
            console.debug(`Grace Period: Using fallback - start: ${start}ms, end: ${end}ms, duration: ${end-start}ms`);
          } else {
            // Last resort fallback - position after transcription (if any) or at start
            const transcriptionSegment = segments.find(s => s.metricKey === 'transcriptionDuration');
            if (transcriptionSegment) {
              start = transcriptionSegment.end;
              end = start + Math.max(metric.value, 100); // Ensure at least 100ms visibility
              console.debug(`Grace Period: Using position after transcription - start: ${start}ms, end: ${end}ms`);
            } else {
              // If no transcription segment, just position at beginning
              start = 0;
              end = Math.max(metric.value, 100);
              console.debug(`Grace Period: No reference points, using beginning - start: ${start}ms, end: ${end}ms`);
            }
          }
          break;
          
        case 'transcriptionDuration':
          if (timestamps.transcriptionStart && timestamps.transcriptionEnd) {
            start = timestamps.transcriptionStart - referenceTimestamp;
            end = timestamps.transcriptionEnd - referenceTimestamp;
            console.debug(`Transcription: Using actual timestamps - start: ${start}ms, end: ${end}ms`);
          } else if (timestamps.transcriptionStart) {
            // If we have start but no end, use the duration
            start = timestamps.transcriptionStart - referenceTimestamp;
            end = start + metric.value;
            console.debug(`Transcription: Using start + duration - start: ${start}ms, end: ${end}ms`);
          } else if (timestamps.speechEnd) {
            // If no transcription timestamps, position it after speech ended
            start = (timestamps.speechEnd - referenceTimestamp) || 0;
            end = start + metric.value;
            console.debug(`Transcription: Using speechEnd + duration - start: ${start}ms, end: ${end}ms`);
          } else {
            // Fallback - just use the duration starting from 0
            start = 0;
            end = metric.value;
            console.debug(`Transcription: Using fallback - start: ${start}ms, end: ${end}ms`);
          }
          break;
          
        case 'completionResponse':
          if (timestamps.promptSubmission && timestamps.completionStart) {
            start = timestamps.promptSubmission - referenceTimestamp;
            // End at completion start, unless audio playback starts earlier 
            // (rare but possible edge case where Pi starts speaking before text appears)
            if (timestamps.audioPlaybackStart && timestamps.audioPlaybackStart < timestamps.completionStart) {
              end = timestamps.audioPlaybackStart - referenceTimestamp;
              console.debug(`LLM Wait Time: Ending at audioPlaybackStart instead of completionStart because it came first: ${end}ms`);
            } else {
              end = timestamps.completionStart - referenceTimestamp;
            }
            console.debug(`LLM Wait Time: Using actual timestamps - start: ${start}ms, end: ${end}ms (raw: ${timestamps.promptSubmission} to ${end + referenceTimestamp})`);
          } else if (timestamps.promptSubmission) {
            // If we only have the start, use the duration
            start = timestamps.promptSubmission - referenceTimestamp;
            end = start + metric.value;
            console.debug(`LLM Wait Time: Using promptSubmission + duration - start: ${start}ms, end: ${end}ms`);
          } else if (timestamps.transcriptionEnd) {
            // Position after transcription if no explicit timestamps
            start = timestamps.transcriptionEnd - referenceTimestamp;
            end = start + metric.value;
            console.debug(`LLM Wait Time: Using transcriptionEnd + duration - start: ${start}ms, end: ${end}ms`);
          }
          break;
          
        case 'streamingDuration':
          if (timestamps.completionStart && timestamps.completionEnd) {
            start = timestamps.completionStart - referenceTimestamp;
            end = timestamps.completionEnd - referenceTimestamp;
            console.debug(`Streaming: Using actual timestamps - start: ${start}ms, end: ${end}ms (raw: ${timestamps.completionStart} to ${timestamps.completionEnd})`);
          } else if (timestamps.completionStart) {
            // If we only have the start, use the duration
            start = timestamps.completionStart - referenceTimestamp;
            end = start + metric.value;
            console.debug(`Streaming: Using completionStart + duration - start: ${start}ms, end: ${end}ms`);
          }
          break;
          
        case 'speechPlayback':
          // Speech playback is a specific point in time - make it a short segment
          if (timestamps.audioPlaybackStart) {
            const audioStartTime = timestamps.audioPlaybackStart - referenceTimestamp;
            start = audioStartTime;
            end = audioStartTime + 5000; // Make it 5s long for visibility
            console.debug(`Speech Playback: Marking at time - start: ${start}ms, end: ${end}ms (raw: ${timestamps.audioPlaybackStart})`);
          }
          break;
          
        case 'timeToTalk':
          if (timestamps.completionStart && timestamps.audioPlaybackStart) {
            start = timestamps.completionStart - referenceTimestamp;
            end = timestamps.audioPlaybackStart - referenceTimestamp;
            console.debug(`Time to Talk: Using actual timestamps - start: ${start}ms, end: ${end}ms (raw: ${timestamps.completionStart} to ${timestamps.audioPlaybackStart})`);
          } else if (timestamps.completionStart) {
            start = timestamps.completionStart - referenceTimestamp;
            end = start + metric.value;
            console.debug(`Time to Talk: Using completionStart + duration - start: ${start}ms, end: ${end}ms`);
          }
          break;
          
        case 'totalTime':
          start = 0;
          // Use audioPlaybackStart as the end time 
          if (timestamps.audioPlaybackStart) {
            end = timestamps.audioPlaybackStart - referenceTimestamp;
            console.debug(`Total Time: Using 0 to audioPlaybackStart - start: ${start}ms, end: ${end}ms`);
          } else {
            // Fall back to the value if audioPlaybackStart is not available
            end = metric.value;
            console.debug(`Total Time: Using duration - start: ${start}ms, end: ${end}ms`);
          }
          break;
          
        default:
          // Fall back to simple calculation for unknown metric types
          start = 0;
          end = metric.value;
      }
      
      // Only create a segment if we have valid start and end times
      if (end > start) {
        const segment: TimelineSegment = {
          metricKey: metric.key,
          label: metric.label,
          start: start,
          end: end,
          duration: end - start,
          color: metric.color,
          explanation: metric.explanation
        };
        
        segments.push(segment);
      }
    });
    
    // Add "gap segments" to show waiting periods between processes
    const orderedProcesses = [
      { key: 'transcriptionDuration', label: 'Transcription' },
      { key: 'voiceActivityDetection', label: 'Grace Period' }, // Updated order to match actual flow
      { key: 'completionResponse', label: 'LLM Wait Time' },
      { key: 'streamingDuration', label: 'Pi writes' },
      { key: 'speechPlayback', label: 'Pi Speaks' }, // Add speech playback as last process
    ];
    
    // Check for gaps between consecutive processes and add gap segments
    for (let i = 0; i < orderedProcesses.length - 1; i++) {
      const currentProcess = orderedProcesses[i];
      const nextProcess = orderedProcesses[i + 1];
      
      const currentSegment = segments.find(s => s.metricKey === currentProcess.key);
      const nextSegment = segments.find(s => s.metricKey === nextProcess.key);
      
      if (currentSegment && nextSegment && nextSegment.start > currentSegment.end) {
        // There's a gap between processes, add a gap segment
        const gapSegment: TimelineSegment = {
          metricKey: `gap_${currentProcess.key}_${nextProcess.key}`,
          label: `Waiting`,
          start: currentSegment.end,
          end: nextSegment.start,
          duration: nextSegment.start - currentSegment.end,
          color: '#E0E0E0', // Light gray
          explanation: `Time between end of ${currentProcess.label} and start of ${nextProcess.label}`
        };
        
        segments.push(gapSegment);
      }
    }
    
    // Find the latest ending time for the timeline end - but cap it at audioPlaybackStart if available
    let timelineEnd = segments.reduce((max, segment) => Math.max(max, segment.end), 0);
    
    // If we have audioPlaybackStart, use that as the reference but extend the timeline beyond it
    if (timestamps.audioPlaybackStart) {
      const audioStartTime = timestamps.audioPlaybackStart - referenceTimestamp;
      // Only adjust if audioPlaybackStart is not zero (which would indicate it's missing)
      if (audioStartTime > 0) {
        // Extend timeline to show more processes beyond speech start
        // Find the maximum end time of any segment
        const maxSegmentEnd = segments.reduce((max, segment) => Math.max(max, segment.end), 0);
        // Use whichever is greater - max segment end or audioPlaybackStart + 5 seconds
        timelineEnd = Math.max(maxSegmentEnd, audioStartTime + 5000);
      }
    }
    
    // Add a 10% margin to the end of the timeline for readability
    return { segments, timelineEnd: timelineEnd * 1.1 };
  }
  
  /**
   * Fall back method to calculate timeline positions from durations when timestamps aren't available
   */
  private calculateTimelinePositionsFromDurations(metrics: MetricDefinition[]): { segments: TimelineSegment[], timelineEnd: number } {
    // Initialize segments array and overall timeline end
    const segments: TimelineSegment[] = [];
    let timelineEnd = 0;
    
    // Log available metrics
    console.debug("Available metrics for duration-based timeline:", metrics.map(m => 
      `${m.key}: ${m.value}ms (${m.label})`
    ).join(", "));
    
    // Check specifically for the grace period
    const gracePeriod = metrics.find(m => m.key === 'voiceActivityDetection');
    if (gracePeriod) {
      console.debug(`Grace period metric found: ${gracePeriod.value}ms`);
    } else {
      console.warn("No grace period metric found in metrics array");
    }
    
    // Calculate the timing of each process based on relationships
    // First, create a map to hold process start times
    const processStartTimes: Record<string, number> = {};
    const processEndTimes: Record<string, number> = {};
    
    // Estimate initial processing time (approximately 1.8s based on observation)
    const estimatedInitialDelay = 1800; // 1.8 seconds in ms
    
    // We'll keep this initial delay as empty space but won't create a segment for it
    
    // Adjust process start times to account for initial delay
    // Start with transcription at time initialDelay
    if (metrics.find(m => m.key === 'transcriptionDuration')) {
      const transcriptionDuration = metrics.find(m => m.key === 'transcriptionDuration')!.value;
      processStartTimes['transcriptionDuration'] = estimatedInitialDelay; 
      processEndTimes['transcriptionDuration'] = estimatedInitialDelay + transcriptionDuration;
      
      // Grace period follows transcription
      let nextTime = estimatedInitialDelay + transcriptionDuration;
      
      // Calculate grace period (comes after transcription)
      if (metrics.find(m => m.key === 'voiceActivityDetection')) {
        const gracePeriodDuration = metrics.find(m => m.key === 'voiceActivityDetection')!.value;
        processStartTimes['voiceActivityDetection'] = nextTime;
        // Ensure grace period has a minimum visible duration
        const visibleDuration = Math.max(gracePeriodDuration, 100);
        processEndTimes['voiceActivityDetection'] = nextTime + visibleDuration;
        nextTime += visibleDuration;
        console.debug(`Grace Period positioned at ${processStartTimes['voiceActivityDetection']}ms with duration ${visibleDuration}ms`);
      } else {
        console.debug("No grace period metric found in metrics array for duration-based timeline");
      }
      
      // Calculate completion response times (Pi's thinking time)
      if (metrics.find(m => m.key === 'completionResponse')) {
        const completionResponseDuration = metrics.find(m => m.key === 'completionResponse')!.value;
        processStartTimes['completionResponse'] = nextTime;
        processEndTimes['completionResponse'] = nextTime + completionResponseDuration;
        nextTime += completionResponseDuration;
      }
      
      // Calculate streaming duration (text response)
      if (metrics.find(m => m.key === 'streamingDuration')) {
        const streamingDuration = metrics.find(m => m.key === 'streamingDuration')!.value;
        processStartTimes['streamingDuration'] = nextTime;
        processEndTimes['streamingDuration'] = nextTime + streamingDuration;
        nextTime += streamingDuration;
      }
      
      // Calculate time to talk (preparation for audio playback)
      // Must logically finish at the same time as or before audio playback start
      if (metrics.find(m => m.key === 'timeToTalk')) {
        const timeToTalkDuration = metrics.find(m => m.key === 'timeToTalk')!.value;
        
        // Time to talk starts at the same time as streaming begins
        // This represents the parallel processing of generating text and preparing audio
        processStartTimes['timeToTalk'] = processStartTimes['streamingDuration'] || nextTime;
        
        // Since we're measuring to audio playback start, the end time becomes our timeline end
        // Make sure time to talk doesn't extend beyond when streaming completes (if it does, audio must start after text completes)
        const streamingEnd = processEndTimes['streamingDuration'] || 0;
        const predictedTTTEnd = processStartTimes['timeToTalk'] + timeToTalkDuration;
        
        // Audio playback can't start before text streaming is complete
        processEndTimes['timeToTalk'] = Math.max(predictedTTTEnd, streamingEnd);
        
        // Set timeline end at the audio playback start (end of timeToTalk)
        timelineEnd = processEndTimes['timeToTalk'];
        
        // Add speech playback marker at the audio playback start time
        if (metrics.find(m => m.key === 'speechPlayback')) {
          processStartTimes['speechPlayback'] = timelineEnd;
          processEndTimes['speechPlayback'] = timelineEnd + 5000; // 5s for visibility
        }
      } else {
        // If no timeToTalk metric, end at streaming completion
        timelineEnd = nextTime;
        
        // Still add speech playback marker at the end of the timeline
        if (metrics.find(m => m.key === 'speechPlayback')) {
          processStartTimes['speechPlayback'] = timelineEnd;
          processEndTimes['speechPlayback'] = timelineEnd + 5000; // 5s for visibility
        }
      }
    }
    
    // Calculate total time (spans from beginning to audio playback start)
    if (metrics.find(m => m.key === 'totalTime')) {
      processStartTimes['totalTime'] = 0;
      // End at audio playback start for speech-to-speech measurement
      processEndTimes['totalTime'] = timelineEnd;
    }
    
    // Create segments based on calculated times
    metrics.forEach(metric => {
      if (metric.value === undefined) return;
      
      const start = processStartTimes[metric.key] || 0;
      const end = processEndTimes[metric.key] || metric.value;
      
      // Adjust the displayed duration to reflect the potentially capped time
      const actualDuration = end - start;
      
      const segment: TimelineSegment = {
        metricKey: metric.key,
        label: metric.label,
        start: start,
        end: end,
        duration: actualDuration,
        color: metric.color,
        explanation: metric.explanation
      };
      
      segments.push(segment);
    });
    
    // Add a 10% margin to the end of the timeline for readability
    timelineEnd = timelineEnd * 1.1;
    
    return { segments, timelineEnd };
  }

  /**
   * Update telemetry data for this message
   */
  updateTelemetryData(data: Record<string, number>): void {
    // Convert from Record<string, number> to TelemetryData format
    const telemetryData: Partial<TelemetryData> = {};
    
    if (data.voiceActivityDetection !== undefined)
      telemetryData.transcriptionDelay = data.voiceActivityDetection;
      
    if (data.transcriptionDuration !== undefined)
      telemetryData.transcriptionTime = data.transcriptionDuration;
      
    if (data.streamingDuration !== undefined)
      telemetryData.streamingDuration = data.streamingDuration;
      
    if (data.timeToTalk !== undefined)
      telemetryData.timeToTalk = data.timeToTalk;
      
    if (data.completionResponse !== undefined)
      telemetryData.completionResponse = data.completionResponse;
    
    // Update via telemetry module
    telemetryModule.updateTelemetryData(telemetryData);
  }

  /**
   * Add controls to a message
   */
  private addControls(container: HTMLElement): void {
    const controlsContainer = document.createElement("div");
    controlsContainer.className = "saypi-tts-controls";
    
    // Create telemetry button and add it to controls
    const telemetryButton = this.createTelemetryButton();
    controlsContainer.appendChild(telemetryButton);
    
    // Add any additional controls here
    
    container.appendChild(controlsContainer);
  }
}

export { AssistantResponse, MessageControls, PopupMenu };

/**
 * Represents a user message in the chat history
 */
class UserMessage {
  private _element: HTMLElement;
  private _contentElement: HTMLElement | null = null;
  private chatbot: Chatbot;

  constructor(element: HTMLElement, chatbot: Chatbot) {
    this._element = element;
    this.chatbot = chatbot;
    this.decorate();
  }

  private decorate(): void {
    this._element.classList.add("chat-message", "user-prompt");
  }

  /**
   * Gets the CSS selector for content within this user message
   */
  get contentSelector(): string {
    return this.chatbot.getUserMessageContentSelector();
  }

  /**
   * Gets the actual content container element within the message
   * @returns The content element or null if not found
   */
  get contentElement(): HTMLElement | null {
    if (this._contentElement) {
      return this._contentElement;
    }

    // Use the chatbot-provided selector to find the content element
    const contentElement = this._element.querySelector(this.contentSelector);
    if (contentElement) {
      this._contentElement = contentElement as HTMLElement;
      contentElement.classList.add("user-message-content");
      return this._contentElement;
    }

    // Fallback to the first div if the specific selector fails
    const firstDiv = this._element.querySelector("div > div");
    if (firstDiv) {
      this._contentElement = firstDiv as HTMLElement;
      return this._contentElement;
    }

    return null;
  }

  /**
   * Get the full element for this message
   */
  get element(): HTMLElement {
    return this._element;
  }

  /**
   * Get the text content of the user message
   */
  get text(): string {
    const content = this.contentElement;
    if (content) {
      return content.innerText || content.textContent || "";
    }
    return "";
  }

  /**
   * Checks if this message contains maintenance instructions
   */
  hasInstructions(): boolean {
    const content = this.contentElement;
    if (!content) return false;
    
    // Check for both unescaped and escaped instruction tags
    const html = content.innerHTML;
    return (
      /<instruction>([\s\S]*?)<\/instruction>/.test(html) || 
      /&lt;instruction&gt;([\s\S]*?)&lt;\/instruction&gt;/.test(html)
    );
  }

  /**
   * Process and collapse instruction blocks in the message
   */
  processInstructions(): void {
    const content = this.contentElement;
    if (!content) return;
    
    const html = content.innerHTML;
    
    // Check for both unescaped and escaped instruction tags
    const unescapedRegex = /<instruction>([\s\S]*?)<\/instruction>/;
    const escapedRegex = /&lt;instruction&gt;([\s\S]*?)&lt;\/instruction&gt;/;
    
    let instructionMatch = html.match(unescapedRegex);
    let isEscaped = false;
    
    // If no match with unescaped tags, try with escaped tags
    if (!instructionMatch) {
      instructionMatch = html.match(escapedRegex);
      isEscaped = true;
    }
    
    if (instructionMatch) {
      // Mark the message as having instructions
      this._element.classList.add("with-instructions");
      
      // Generate a friendly label from a set of options
      const friendlyLabels = [
        chrome.i18n.getMessage("instructionLabel_steering"),
        chrome.i18n.getMessage("instructionLabel_nudge"),
        chrome.i18n.getMessage("instructionLabel_guiding"),
        chrome.i18n.getMessage("instructionLabel_guardrails"),
        chrome.i18n.getMessage("instructionLabel_context"),
        chrome.i18n.getMessage("instructionLabel_focusing"),
        chrome.i18n.getMessage("instructionLabel_expectations")
      ];
      const randomLabel = friendlyLabels[Math.floor(Math.random() * friendlyLabels.length)];
      
      // Create a wrapper for the instruction block - keep the HTML as is for proper rendering
      const instructionHTML = instructionMatch[1];
      
      // Replace the instruction block with our custom elements while preserving other content
      const newHTML = isEscaped ? 
        html.replace(
          escapedRegex,
          `<div class="instruction-label" data-label="${randomLabel}" data-expand-text="${chrome.i18n.getMessage("clickToExpand")}" data-collapse-text="${chrome.i18n.getMessage("clickToCollapse")}"></div>
           <div class="instruction-block">${instructionHTML}</div>`
        ) :
        html.replace(
          unescapedRegex,
          `<div class="instruction-label" data-label="${randomLabel}" data-expand-text="${chrome.i18n.getMessage("clickToExpand")}" data-collapse-text="${chrome.i18n.getMessage("clickToCollapse")}"></div>
           <div class="instruction-block">${instructionHTML}</div>`
        );
      
      content.innerHTML = newHTML;
      
      // Add the steering wheel icon
      const steerIcon = IconModule.steer ? IconModule.steer.cloneNode(true) as SVGElement : null;
      
      if (steerIcon) {
        steerIcon.classList.add("steer-icon");
        
        // Create a container for the icon
        const iconContainer = document.createElement("div");
        iconContainer.className = "steer-icon-container";
        
        // Add the icon to the container
        iconContainer.appendChild(steerIcon);
        
        // Insert the container before the instruction label
        const instructionLabel = content.querySelector('.instruction-label');
        if (instructionLabel) {
          instructionLabel.insertBefore(iconContainer, instructionLabel.firstChild);
        }
      }
      
      // Add collapsed class by default
      this._element.classList.add("collapsed");
      
      // Add click handler to toggle visibility
      this._element.addEventListener("click", (e) => {
        // Only toggle if clicking on the message itself, not on links or other interactive elements
        if (e.target === this._element || 
            (e.target as HTMLElement).classList.contains('instruction-label') ||
            this._element.contains(e.target as HTMLElement)) {
          this._element.classList.toggle("collapsed");
          e.stopPropagation(); // Prevent event bubbling
        }
      });
    }
  }

  toString(): string {
    return `UserMessage: "${this.text.substring(0, 20)}..."`;
  }
}

export { UserMessage };
