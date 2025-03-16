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
import telemetryModule, { TelemetryData } from "../TelemetryModule";
import { IconModule } from "../icons/IconModule";

// Add this interface definition near the top of the file after imports
interface MetricDefinition {
  key: string;
  label: string;
  color: string;
  value: number;
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
      observer.observe(this._element, { childList: true, subtree: true });
    });
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
    
    // Listen for telemetry updates
    EventBus.on("telemetry:updated", this.handleTelemetryUpdate);
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
   * Fetch telemetry data for the message
   * @returns The telemetry data or null if not available
   */
  private fetchTelemetryData(): Record<string, number> | null {
    // Use the singleton telemetryModule instance to get the data
    const telemetryData = telemetryModule.getCurrentTelemetry();
    if (!telemetryData) return null;
    
    // Convert TelemetryData to Record<string, number> format
    const result: Record<string, number> = {};
    
    // Add properties that exist and are numbers
    if (telemetryData.gracePeriod !== undefined) 
      result.voiceActivityDetection = telemetryData.gracePeriod;
    
    if (telemetryData.transcriptionTime !== undefined) 
      result.transcriptionDuration = telemetryData.transcriptionTime;
    
    if (telemetryData.streamingDuration !== undefined) 
      result.streamingDuration = telemetryData.streamingDuration;
    
    if (telemetryData.timeToTalk !== undefined) 
      result.timeToTalk = telemetryData.timeToTalk;
    
    if (telemetryData.completionResponse !== undefined) 
      result.completionResponse = telemetryData.completionResponse;
    
    // Calculate a total time if we have streaming and transcription durations
    if (telemetryData.streamingDuration !== undefined && 
        telemetryData.transcriptionTime !== undefined &&
        telemetryData.completionResponse !== undefined) {
      result.totalTime = telemetryData.transcriptionTime + 
                          telemetryData.completionResponse + 
                          telemetryData.streamingDuration;
    }
    
    return Object.keys(result).length > 0 ? result : null;
  }

  /**
   * Creates a visualization of the telemetry data
   */
  private async createTelemetryVisualization() {
    const telemetryData = this.fetchTelemetryData();
    if (!telemetryData) {
      console.warn("No telemetry data found for this message");
      return;
    }

    // Create container for telemetry data
    const barsContainer = document.createElement("div");
    barsContainer.className = "saypi-telemetry-container";
    
    // Create metrics with explanations
    const metrics: MetricDefinition[] = [];
    
    if (telemetryData.voiceActivityDetection) {
      metrics.push({
        key: "voiceActivityDetection",
        label: "Voice Activity Detection",
        color: "#4285F4", // Google Blue
        value: telemetryData.voiceActivityDetection,
        explanation: "Time taken to detect voice activity in the audio"
      });
    }
    
    if (telemetryData.transcriptionDuration) {
      metrics.push({
        key: "transcriptionDuration",
        label: "Transcription",
        color: "#EA4335", // Google Red
        value: telemetryData.transcriptionDuration,
        explanation: "Time taken to transcribe the audio to text"
      });
    }
    
    if (telemetryData.streamingDuration) {
      metrics.push({
        key: "streamingDuration",
        label: "Streaming Duration",
        color: "#FBBC05", // Google Yellow
        value: telemetryData.streamingDuration,
        explanation: "Time taken to stream the assistant's response"
      });
    }
    
    if (telemetryData.timeToTalk) {
      metrics.push({
        key: "timeToTalk",
        label: "Time to Talk",
        color: "#34A853", // Google Green
        value: telemetryData.timeToTalk,
        explanation: "Total time from message sent until audio started playing"
      });
    }
    
    if (telemetryData.totalTime) {
      metrics.push({
        key: "totalTime",
        label: "Total Time",
        color: "#9e9e9e", // Grey
        value: telemetryData.totalTime,
        explanation: "Total time for the entire conversation turn"
      });
    }
    
    if (metrics.length === 0) {
      console.warn("No metrics to display");
      return;
    }

    // Add title
    const title = document.createElement("h4");
    title.textContent = "Performance Metrics";
    title.style.margin = "0 0 10px 0";
    title.style.fontSize = "14px";
    title.style.fontWeight = "bold";
    barsContainer.appendChild(title);

    // Calculate total time for percentages
    const totalTime = Math.max(...metrics.map(m => m.value));

    // Add visualization type selector
    const vizTypeContainer = document.createElement("div");
    vizTypeContainer.style.display = "flex";
    vizTypeContainer.style.marginBottom = "10px";
    vizTypeContainer.style.justifyContent = "center";

    const barChartButton = document.createElement("button");
    barChartButton.textContent = "Bar Chart";
    barChartButton.style.marginRight = "10px";
    barChartButton.style.padding = "3px 8px";
    barChartButton.style.border = "none";
    barChartButton.style.borderRadius = "4px";
    barChartButton.style.backgroundColor = "#ddd";
    barChartButton.style.cursor = "pointer";
    barChartButton.classList.add("active");

    const timelineButton = document.createElement("button");
    timelineButton.textContent = "Timeline";
    timelineButton.style.padding = "3px 8px";
    timelineButton.style.border = "none";
    timelineButton.style.borderRadius = "4px";
    timelineButton.style.backgroundColor = "#ddd";
    timelineButton.style.cursor = "pointer";

    vizTypeContainer.appendChild(barChartButton);
    vizTypeContainer.appendChild(timelineButton);
    barsContainer.appendChild(vizTypeContainer);

    // Create chart container
    const chartContainer = document.createElement("div");
    chartContainer.style.padding = "10px 0";
    barsContainer.appendChild(chartContainer);

    // Create a bar chart first (default view)
    this.createBarChart(chartContainer, metrics, totalTime);

    // Add event listeners to toggle between chart types
    barChartButton.addEventListener("click", () => {
      barChartButton.classList.add("active");
      timelineButton.classList.remove("active");
      chartContainer.innerHTML = "";
      this.createBarChart(chartContainer, metrics, totalTime);
    });

    timelineButton.addEventListener("click", () => {
      timelineButton.classList.add("active");
      barChartButton.classList.remove("active");
      chartContainer.innerHTML = "";
      this.createTimelineChart(chartContainer, metrics);
    });

    // Insert the telemetry visualization into the DOM
    this.message.element.appendChild(barsContainer);
    this.telemetryContainer = barsContainer;
  }

  /**
   * Create a bar chart visualization
   */
  private createBarChart(container: HTMLElement, metrics: MetricDefinition[], totalTime: number): void {
    // Create a bar for each metric
    metrics.forEach(metric => {
      const value = metric.value || 0;
      const percentage = (value / totalTime) * 100;
      
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.marginBottom = "5px";
      row.style.position = "relative";
      
      const label = document.createElement("div");
      label.textContent = `${metric.label}: ${(value / 1000).toFixed(2)}s`;
      label.style.marginRight = "10px";
      label.style.width = "200px";
      label.style.cursor = "help";
      label.title = metric.explanation;
      
      const barContainer = document.createElement("div");
      barContainer.style.height = "16px";
      barContainer.style.flexGrow = "1";
      barContainer.style.backgroundColor = "#e0e0e0";
      barContainer.style.borderRadius = "5px";
      barContainer.style.overflow = "hidden";
      barContainer.style.position = "relative";
      
      const bar = document.createElement("div");
      bar.style.width = `${percentage}%`;
      bar.style.height = "100%";
      bar.style.backgroundColor = metric.color;
      
      // Add question mark icon for explanation
      const infoIcon = document.createElement("div");
      infoIcon.style.position = "absolute";
      infoIcon.style.right = "5px";
      infoIcon.style.top = "0";
      infoIcon.style.bottom = "0";
      infoIcon.style.display = "flex";
      infoIcon.style.alignItems = "center";
      infoIcon.style.justifyContent = "center";
      infoIcon.style.fontSize = "10px";
      infoIcon.style.color = "#555";
      infoIcon.style.cursor = "help";
      infoIcon.title = metric.explanation;
      infoIcon.innerHTML = "?";
      
      barContainer.appendChild(bar);
      barContainer.appendChild(infoIcon);
      row.appendChild(label);
      row.appendChild(barContainer);
      container.appendChild(row);
    });
  }

  /**
   * Create a timeline chart visualization that shows overlapping processes
   */
  private createTimelineChart(container: HTMLElement, metrics: MetricDefinition[]): void {
    // Sort metrics by key based on a predefined order
    const orderArray = ['voiceActivityDetection', 'transcriptionDuration', 'streamingDuration', 'timeToTalk', 'totalTime'];
    metrics.sort((a, b) => {
      return orderArray.indexOf(a.key) - orderArray.indexOf(b.key);
    });

    // Get timeline data with proper positioning
    const { segments, timelineEnd } = this.calculateTimelinePositions(metrics);
    
    // Find maximum row number to determine chart height
    const maxRow = segments.reduce((max, segment) => Math.max(max, segment.row || 0), 0);
    
    // Create timeline chart container
    const chartContainer = document.createElement("div");
    chartContainer.className = "saypi-timeline-chart";
    container.appendChild(chartContainer);
    
    // Calculate chart properties
    const totalWidth = 100; // percentage width
    const rowHeight = 30; // px
    const tickInterval = Math.ceil(timelineEnd / 5) * 100; // round to nearest 100ms
    
    // Group segments by row
    const rowsMap = new Map<number, TimelineSegment[]>();
    segments.forEach(segment => {
      const row = segment.row || 0;
      if (!rowsMap.has(row)) {
        rowsMap.set(row, []);
      }
      rowsMap.get(row)?.push(segment);
    });
    
    // Create rows for each process group
    rowsMap.forEach((rowSegments, rowIndex) => {
      // Find the metric for this row (use the first segment's metric)
      const firstSegment = rowSegments[0];
      const metric = metrics.find(m => m.key === firstSegment.metricKey);
      if (!metric) return;
      
      const rowContainer = document.createElement("div");
      rowContainer.className = "timeline-row";
      rowContainer.style.position = "relative";
      rowContainer.style.height = `${rowHeight}px`;
      rowContainer.style.marginBottom = "4px";
      
      // Add row label
      const rowLabel = document.createElement("div");
      rowLabel.className = "timeline-row-label";
      rowLabel.textContent = metric.label;
      rowLabel.style.position = "absolute";
      rowLabel.style.left = "0";
      rowLabel.style.top = "0";
      rowLabel.style.width = "120px";
      rowLabel.style.height = `${rowHeight}px`;
      rowLabel.style.display = "flex";
      rowLabel.style.alignItems = "center";
      rowLabel.style.fontSize = "12px";
      rowLabel.style.fontWeight = "500";
      rowContainer.appendChild(rowLabel);
      
      // Add segments for this row
      rowSegments.forEach(segment => {
        const segmentElem = document.createElement("div");
        segmentElem.className = "timeline-segment";
        segmentElem.style.position = "absolute";
        segmentElem.style.left = `calc(120px + ${(segment.start / timelineEnd) * totalWidth}%)`;
        segmentElem.style.width = `${(segment.duration / timelineEnd) * totalWidth}%`;
        segmentElem.style.top = "0";
        segmentElem.style.height = `${rowHeight}px`;
        segmentElem.style.backgroundColor = segment.color;
        segmentElem.style.borderRadius = "3px";
        
        // Add tooltip on hover
        const tooltip = document.createElement("div");
        tooltip.className = "segment-tooltip";
        tooltip.innerHTML = `${segment.label}: ${segment.duration.toFixed(0)}ms`;
        if (segment.explanation) {
          tooltip.innerHTML += `<br><small>${segment.explanation}</small>`;
        }
        tooltip.style.position = "absolute";
        tooltip.style.display = "none";
        tooltip.style.backgroundColor = "#333";
        tooltip.style.color = "white";
        tooltip.style.padding = "4px 8px";
        tooltip.style.borderRadius = "4px";
        tooltip.style.fontSize = "12px";
        tooltip.style.zIndex = "1000";
        tooltip.style.whiteSpace = "nowrap";
        
        segmentElem.appendChild(tooltip);
        
        segmentElem.addEventListener("mouseenter", () => {
          tooltip.style.display = "block";
          tooltip.style.bottom = `${rowHeight}px`;
          tooltip.style.left = "0";
        });
        
        segmentElem.addEventListener("mouseleave", () => {
          tooltip.style.display = "none";
        });
        
        rowContainer.appendChild(segmentElem);
      });
      
      chartContainer.appendChild(rowContainer);
    });
    
    // Add time axis at the bottom
    const timeAxis = document.createElement("div");
    timeAxis.className = "timeline-axis";
    timeAxis.style.position = "relative";
    timeAxis.style.height = "20px";
    timeAxis.style.marginTop = "10px";
    timeAxis.style.marginLeft = "120px";
    timeAxis.style.borderTop = "1px solid #ccc";
    
    // Add tick marks
    for (let i = 0; i <= timelineEnd; i += tickInterval) {
      const tick = document.createElement("div");
      tick.className = "timeline-tick";
      tick.style.position = "absolute";
      tick.style.left = `${(i / timelineEnd) * totalWidth}%`;
      tick.style.width = "1px";
      tick.style.height = "5px";
      tick.style.top = "0";
      tick.style.backgroundColor = "#888";
      
      const tickLabel = document.createElement("div");
      tickLabel.className = "timeline-tick-label";
      tickLabel.textContent = `${i}ms`;
      tickLabel.style.position = "absolute";
      tickLabel.style.left = `${(i / timelineEnd) * totalWidth}%`;
      tickLabel.style.transform = "translateX(-50%)";
      tickLabel.style.top = "6px";
      tickLabel.style.fontSize = "10px";
      tickLabel.style.color = "#888";
      
      timeAxis.appendChild(tick);
      timeAxis.appendChild(tickLabel);
    }
    
    chartContainer.appendChild(timeAxis);
    
    // Add legend
    const legend = document.createElement("div");
    legend.className = "timeline-legend";
    legend.style.display = "flex";
    legend.style.flexWrap = "wrap";
    legend.style.marginTop = "20px";
    legend.style.justifyContent = "center";
    
    // Use unique metrics for the legend to avoid duplicates
    const uniqueMetrics = metrics.filter(m => m.value !== undefined);
    
    uniqueMetrics.forEach(metric => {
      const legendItem = document.createElement("div");
      legendItem.className = "legend-item";
      legendItem.style.display = "flex";
      legendItem.style.alignItems = "center";
      legendItem.style.marginRight = "15px";
      legendItem.style.marginBottom = "5px";
      
      const colorBox = document.createElement("div");
      colorBox.style.width = "12px";
      colorBox.style.height = "12px";
      colorBox.style.backgroundColor = metric.color;
      colorBox.style.marginRight = "5px";
      colorBox.style.borderRadius = "2px";
      
      const label = document.createElement("span");
      label.textContent = `${metric.label}: ${metric.value.toFixed(0)}ms`;
      label.style.fontSize = "12px";
      
      legendItem.appendChild(colorBox);
      legendItem.appendChild(label);
      legend.appendChild(legendItem);
    });
    
    chartContainer.appendChild(legend);
    
    // Add explanation text
    const explanation = document.createElement("div");
    explanation.className = "timeline-explanation";
    explanation.style.fontSize = "12px";
    explanation.style.color = "#666";
    explanation.style.marginTop = "10px";
    explanation.style.textAlign = "center";
    explanation.innerHTML = "This timeline shows how different processes overlap during message processing.<br>Hover over segments for details.";
    
    if (uniqueMetrics.find(m => m.key === 'timeToTalk')) {
      explanation.innerHTML += "<br><i>Note: Time to talk measures how long it took from when the message was sent until the assistant started speaking.</i>";
    }
    
    chartContainer.appendChild(explanation);
  }

  /**
   * Calculate timeline positions considering overlaps between processes
   */
  private calculateTimelinePositions(metrics: MetricDefinition[]): { segments: TimelineSegment[], timelineEnd: number } {
    // Initialize segments array and timelineEnd
    const segments: TimelineSegment[] = [];
    let timelineEnd = 0;
    
    // First, convert the metrics into segments with default start time of 0
    metrics.forEach(metric => {
      // Skip metrics with undefined values
      if (metric.value === undefined) return;
      
      const segment: TimelineSegment = {
        metricKey: metric.key,
        label: metric.label,
        start: 0,
        end: metric.value,
        duration: metric.value,
        color: metric.color,
        explanation: metric.explanation
      };
      
      segments.push(segment);
      
      // Update total timeline duration
      if (segment.end > timelineEnd) {
        timelineEnd = segment.end;
      }
    });
    
    // Adjust for overlapping processes
    segments.forEach(segment => {
      if (segment.metricKey === "timeToTalk") {
        // Find streaming duration segment
        const streamingSegment = segments.find(s => s.metricKey === "streamingDuration");
        if (streamingSegment) {
          segment.start = streamingSegment.start;
          // The end time stays the same, it represents when audio actually started
        }
      }
    });
    
    // Assign segments to rows to minimize overlaps
    const rows: TimelineSegment[][] = [];
    
    segments.forEach(segment => {
      let placed = false;
      
      // Try to place in an existing row
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        
        // Check if this segment overlaps with any segment in this row
        const overlaps = row.some(existingSegment => 
          (segment.start < existingSegment.end && segment.end > existingSegment.start)
        );
        
        if (!overlaps) {
          row.push(segment);
          segment.row = i;
          placed = true;
          break;
        }
      }
      
      // If not placed in any existing row, create a new row
      if (!placed) {
        const newRow: TimelineSegment[] = [segment];
        segment.row = rows.length;
        rows.push(newRow);
      }
    });
    
    return { segments, timelineEnd };
  }

  /**
   * Update telemetry data for this message
   */
  updateTelemetryData(data: Record<string, number>): void {
    // Convert from Record<string, number> to TelemetryData format
    const telemetryData: Partial<TelemetryData> = {};
    
    if (data.voiceActivityDetection !== undefined)
      telemetryData.gracePeriod = data.voiceActivityDetection;
      
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
