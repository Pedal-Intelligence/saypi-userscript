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
    console.debug("Raw telemetry data:", JSON.stringify(telemetryData));
    
    if (!telemetryData) return null;
    
    // Convert TelemetryData to Record<string, number> format
    const result: Record<string, number> = {};
    
    // Add properties that exist and are numbers
    if (telemetryData.gracePeriod !== undefined) {
      result.voiceActivityDetection = telemetryData.gracePeriod;
      console.debug(`Mapped gracePeriod ${telemetryData.gracePeriod}ms to voiceActivityDetection`);
    }
    
    if (telemetryData.transcriptionTime !== undefined) {
      result.transcriptionDuration = telemetryData.transcriptionTime;
      console.debug(`Mapped transcriptionTime ${telemetryData.transcriptionTime}ms to transcriptionDuration`);
    }
    
    if (telemetryData.streamingDuration !== undefined) {
      result.streamingDuration = telemetryData.streamingDuration;
      console.debug(`Mapped streamingDuration ${telemetryData.streamingDuration}ms`);
    }
    
    if (telemetryData.timeToTalk !== undefined) {
      result.timeToTalk = telemetryData.timeToTalk;
      console.debug(`Mapped timeToTalk ${telemetryData.timeToTalk}ms`);
    }
    
    if (telemetryData.completionResponse !== undefined) {
      result.completionResponse = telemetryData.completionResponse;
      console.debug(`Mapped completionResponse ${telemetryData.completionResponse}ms`);
    }
    
    // Calculate a total time if we have streaming and transcription durations
    if (telemetryData.streamingDuration !== undefined && 
        telemetryData.transcriptionTime !== undefined) {
      
      let totalTime = 0;
      
      // Add transcription time
      totalTime += telemetryData.transcriptionTime;
      
      // Add completion response time if available
      if (telemetryData.completionResponse !== undefined) {
        totalTime += telemetryData.completionResponse;
      }
      
      // Add streaming duration
      totalTime += telemetryData.streamingDuration;
      
      result.totalTime = totalTime;
      console.debug(`Calculated totalTime: ${totalTime}ms`);
    }
    
    console.debug("Mapped telemetry metrics:", Object.keys(result).join(", "));
    
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
        label: "Grace Period",
        color: "#4285F4", // Google Blue
        value: telemetryData.voiceActivityDetection,
        explanation: "Waiting time between receiving the last transcription and submitting the prompt to the LLM"
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
    
    if (telemetryData.completionResponse) {
      metrics.push({
        key: "completionResponse",
        label: "LLM Wait Time",
        color: "#8E24AA", // Purple
        value: telemetryData.completionResponse,
        explanation: "Time between prompt submission and start of Pi's response (thinking time)"
      });
    }
    
    if (telemetryData.streamingDuration) {
      metrics.push({
        key: "streamingDuration",
        label: "Streaming Duration",
        color: "#FBBC05", // Google Yellow
        value: telemetryData.streamingDuration,
        explanation: "Time taken for Pi to generate and stream the entire written response"
      });
    }
    
    if (telemetryData.timeToTalk) {
      metrics.push({
        key: "timeToTalk",
        label: "Time to Talk",
        color: "#34A853", // Google Green
        value: telemetryData.timeToTalk,
        explanation: "Time from response start until speech audio begins playing"
      });
    }
    
    if (telemetryData.totalTime) {
      metrics.push({
        key: "totalTime",
        label: "Total Time",
        color: "#9e9e9e", // Grey
        value: telemetryData.totalTime,
        explanation: "Total time from the end of transcription until Pi completes the response"
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
   * Create a timeline chart visualization that shows overlapping processes in Gantt chart style
   */
  private createTimelineChart(container: HTMLElement, metrics: MetricDefinition[]): void {
    // Sort metrics by key based on a predefined order
    const orderArray = ['voiceActivityDetection', 'transcriptionDuration', 'completionResponse', 'streamingDuration', 'timeToTalk', 'totalTime'];
    metrics.sort((a, b) => {
      return orderArray.indexOf(a.key) - orderArray.indexOf(b.key);
    });

    // Log available metrics for debugging
    console.debug("Available metrics for timeline:", metrics.map(m => `${m.key}: ${m.value}ms`).join(", "));

    // Get timeline data with proper positioning
    const { segments, timelineEnd } = this.calculateTimelinePositions(metrics);
    
    // Debug: log all segments to see what's being calculated
    console.debug("Timeline segments:", segments.map(s => 
      `${s.metricKey}: start=${(s.start/1000).toFixed(2)}s, end=${(s.end/1000).toFixed(2)}s, duration=${(s.duration/1000).toFixed(2)}s`
    ).join("\n"));
    
    // Check if important segments are missing
    const hasTranscription = segments.some(s => s.metricKey === 'transcriptionDuration');
    const hasCompletionResponse = segments.some(s => s.metricKey === 'completionResponse');
    const hasStreaming = segments.some(s => s.metricKey === 'streamingDuration');
    console.debug(`Key segments present - Transcription: ${hasTranscription}, LLM Wait: ${hasCompletionResponse}, Streaming: ${hasStreaming}`);
    
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
    
    // Add second markers
    for (let i = 0; i <= timelineEndSeconds; i++) {
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
    
    // Add 'Timeline (seconds)' label
    const scaleLabel = document.createElement("div");
    scaleLabel.textContent = "Timeline (seconds)";
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
      
      // Add label with value
      const formattedValue = metric.value !== undefined ? 
        (metric.value > 1000 ? `${(metric.value/1000).toFixed(2)}s` : `${metric.value.toFixed(0)}ms`) : 
        '0ms';
      labelColumn.innerHTML = `<span>${metric.label}:</span> <span style="font-weight:bold;margin-left:4px;">${formattedValue}</span>`;
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
        
        // Add start/end time labels if segment is wide enough
        if (segment.duration / timelineEnd > 0.05) {
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
          segmentElem.appendChild(endTime);
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
      label.textContent = `${metric.label}: ${(metric.value/1000).toFixed(2)}s`;
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
    
    // Find the earliest timestamp to use as a reference point
    const allTimestamps = Object.values(timestamps).filter(t => t !== undefined) as number[];
    const earliestTimestamp = allTimestamps.length > 0 ? Math.min(...allTimestamps) : 0;
    
    // If we don't have timestamps, fall back to the old calculation method
    if (earliestTimestamp === 0) {
      return this.calculateTimelinePositionsFromDurations(metrics);
    }
    
    // Create a segment for each process using actual timestamps
    metrics.forEach(metric => {
      if (metric.value === undefined) return;
      
      let start = 0;
      let end = 0;
      
      switch (metric.key) {
        case 'voiceActivityDetection':
          // For grace period, use transcription end to prompt submission time
          if (timestamps.transcriptionEnd && timestamps.promptSubmission) {
            start = timestamps.transcriptionEnd - earliestTimestamp;
            end = timestamps.promptSubmission - earliestTimestamp;
          } else if (timestamps.transcriptionEnd) {
            // Fallback if we only have transcription end
            start = timestamps.transcriptionEnd - earliestTimestamp;
            end = start + metric.value;
          }
          break;
          
        case 'transcriptionDuration':
          if (timestamps.transcriptionStart && timestamps.transcriptionEnd) {
            start = timestamps.transcriptionStart - earliestTimestamp;
            end = timestamps.transcriptionEnd - earliestTimestamp;
          } else if (timestamps.transcriptionStart) {
            // If we have start but no end, use the duration
            start = timestamps.transcriptionStart - earliestTimestamp;
            end = start + metric.value;
          } else if (timestamps.speechEnd) {
            // If no transcription timestamps, position it after speech ended
            start = (timestamps.speechEnd - earliestTimestamp) || 0;
            end = start + metric.value;
          } else {
            // Fallback - just use the duration starting from 0
            start = 0;
            end = metric.value;
          }
          break;
          
        case 'completionResponse':
          if (timestamps.promptSubmission && timestamps.completionStart) {
            start = timestamps.promptSubmission - earliestTimestamp;
            end = timestamps.completionStart - earliestTimestamp;
          } else if (timestamps.promptSubmission) {
            // If we only have the start, use the duration
            start = timestamps.promptSubmission - earliestTimestamp;
            end = start + metric.value;
          } else if (timestamps.transcriptionEnd) {
            // Position after transcription if no explicit timestamps
            start = timestamps.transcriptionEnd - earliestTimestamp;
            end = start + metric.value;
          }
          break;
          
        case 'streamingDuration':
          if (timestamps.completionStart && timestamps.completionEnd) {
            start = timestamps.completionStart - earliestTimestamp;
            end = timestamps.completionEnd - earliestTimestamp;
          } else if (timestamps.completionStart) {
            // If we only have the start, use the duration
            start = timestamps.completionStart - earliestTimestamp;
            end = start + metric.value;
          }
          break;
          
        case 'timeToTalk':
          if (timestamps.completionStart && timestamps.audioPlaybackStart) {
            start = timestamps.completionStart - earliestTimestamp;
            end = timestamps.audioPlaybackStart - earliestTimestamp;
          } else if (timestamps.completionStart) {
            start = timestamps.completionStart - earliestTimestamp;
            end = start + metric.value;
          }
          break;
          
        case 'totalTime':
          start = 0;
          // Use audioPlaybackStart as the end time 
          if (timestamps.audioPlaybackStart) {
            end = timestamps.audioPlaybackStart - earliestTimestamp;
          } else {
            // Fall back to the value if audioPlaybackStart is not available
            end = metric.value;
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
      { key: 'streamingDuration', label: 'Streaming' }
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
    
    // If we have audioPlaybackStart, use that as the end of the timeline instead
    if (timestamps.audioPlaybackStart) {
      const audioStartTime = timestamps.audioPlaybackStart - earliestTimestamp;
      // Only use audioPlaybackStart if it's not zero (which would indicate it's missing)
      if (audioStartTime > 0) {
        timelineEnd = audioStartTime;
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
        processEndTimes['voiceActivityDetection'] = nextTime + gracePeriodDuration;
        nextTime += gracePeriodDuration;
      }
      
      // Calculate completion response times (Pi's thinking time)
      if (metrics.find(m => m.key === 'completionResponse')) {
        const completionResponseDuration = metrics.find(m => m.key === 'completionResponse')!.value;
        processStartTimes['completionResponse'] = nextTime;
        processEndTimes['completionResponse'] = nextTime + completionResponseDuration;
        nextTime += completionResponseDuration;
      }
      
      // For speech-to-speech measurement, end the timeline at the audio playback start
      // Streaming happens before audio playback
      if (metrics.find(m => m.key === 'streamingDuration')) {
        const streamingDuration = metrics.find(m => m.key === 'streamingDuration')!.value;
        processStartTimes['streamingDuration'] = nextTime;
        processEndTimes['streamingDuration'] = nextTime + streamingDuration;
        nextTime += streamingDuration;
      }
      
      // Calculate time to talk (which ends at audio playback start)
      // This is what we use to determine the end of our timeline
      if (metrics.find(m => m.key === 'timeToTalk')) {
        const timeToTalkDuration = metrics.find(m => m.key === 'timeToTalk')!.value;
        processStartTimes['timeToTalk'] = processStartTimes['streamingDuration'] || nextTime;
        processEndTimes['timeToTalk'] = processStartTimes['timeToTalk'] + timeToTalkDuration;
        
        // Set timeline end at the audio playback start (end of timeToTalk)
        timelineEnd = processEndTimes['timeToTalk'];
      } else {
        // If no timeToTalk metric, end at streaming
        timelineEnd = nextTime;
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
