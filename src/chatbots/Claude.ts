import { AssistantResponse, MessageControls, UserMessage } from "../dom/MessageElements";
import { Observation } from "../dom/Observation";
import EventBus from "../events/EventBus";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import {
  AddedText,
  ChangedText,
  ElementTextStream,
  InputStreamOptions,
} from "../tts/InputStream";
import { TTSControlsModule } from "../tts/TTSControlsModule";
import { VoiceSelector } from "../tts/VoiceMenu";
import { AbstractChatbot, AbstractUserPrompt } from "./AbstractChatbots";
import { UserPrompt } from "./Chatbot";
import { ClaudeVoiceMenu } from "./ClaudeVoiceMenu";
import { openSettings } from "../popup/popupopener";
import getMessage from "../i18n";
import { IconModule } from "../icons/IconModule";

class ClaudeChatbot extends AbstractChatbot {
  private promptCache: Map<HTMLElement, ClaudePrompt> = new Map();

  getName(): string {
    return "Claude";
  }

  getID(): string {
    return "claude";
  }

  getVoiceMenu(
    preferences: UserPreferenceModule,
    element: HTMLElement
  ): VoiceSelector {
    return new ClaudeVoiceMenu(this, preferences, element);
  }

  getPrompt(element: HTMLElement): UserPrompt {
    if (!this.promptCache.has(element)) {
      this.promptCache.set(element, new ClaudePrompt(element));
    }
    return this.promptCache.get(element) as ClaudePrompt;
  }

  /**
   * Get the prompt input editor element
   * @param searchRoot Search is optimised to start in the search root element, but will fall back to the document if not found
   * @returns The prompt input element, or null if not found
   */
  getPromptInput(searchRoot: Element): HTMLElement {
    const selector = this.getPromptTextInputSelector();
    const localPromptInput = searchRoot.querySelector(selector) as HTMLElement;
    if (localPromptInput) {
      return localPromptInput;
    }
    return document.querySelector(selector) as HTMLElement;
  }

   getPromptContainer(prompt: HTMLElement): HTMLElement {
    return prompt.ownerDocument.querySelector("fieldset.w-full") as HTMLElement;
  }

  static getPromptContainer(prompt: HTMLElement): HTMLElement {
    return prompt.ownerDocument.querySelector("fieldset.w-full") as HTMLElement;
  }

  PROMPT_CONTROLS_CONTAINER_SELECTOR = "div.flex.gap-2\\.5.w-full.items-center";
  getPromptControlsContainer(promptContainer: HTMLElement): HTMLElement {
    return promptContainer.querySelector(this.PROMPT_CONTROLS_CONTAINER_SELECTOR) as HTMLElement;
  }

  getPromptTextInputSelector(): string {
    return "div[enterkeyhint]";
  }

  getPromptSubmitButtonSelector(): string {
    return "fieldset div[data-state] button[type=\"button\"].font-medium";
  }

  getAudioControls(searchRoot: Element): HTMLElement {
    const document = searchRoot.ownerDocument;
    const existingAudioControls = document.querySelector('.saypi-audio-controls') as HTMLElement;
    if (existingAudioControls) {
      return existingAudioControls;
    }

    const selector = this.getAudioControlsSelector();
    const localAudioControls = searchRoot.querySelector(selector) as HTMLElement;
    if (localAudioControls) {
      return localAudioControls;
    }

    return document.querySelector(selector) as HTMLElement;
  }

  getAudioControlsSelector(): string {
    return "#saypi-prompt-ancestor " + this.PROMPT_CONTROLS_CONTAINER_SELECTOR; // for Claude, the audio controls are the same as the prompt editor controls
  }

  getAudioOutputButtonSelector(): string {
    // audio button is the last button element in the audio controls container
    return ".saypi-audio-controls > div > div.relative.flex.items-center.justify-end.self-end.p-2 > button";
  }

  getControlPanelSelector(): string {
    return ".flex.items-center.grow";
  }

  getSidePanelSelector(): string {
    return "div.hidden.w-22.flex-col.items-center.gap-1.border-r";
  }

  getChatPath(): string {
    return "/chat";
  }

  isChatablePath(path: string): boolean {
    // routes on which Claude can chat
    return (
      path.includes("/new") ||
      path.includes("/chat") ||
      path.includes("/project")
    );
  }

  getVoiceMenuSelector(): string {
    return ".voice-menu"; // we define our own voice menu for Claude
  }

  getVoiceSettingsSelector(): string {
    return "div.mx-auto.w-full.px-6.py-10 > div.grid.grid-cols-2.gap-4";
  }

  getChatHistory(searchRoot: HTMLElement): HTMLElement {
    const selector = this.getChatHistorySelector();
    const localChatHistory = searchRoot.querySelector(selector) as HTMLElement;
    if (localChatHistory) {
      return localChatHistory;
    }
    //return searchRoot.ownerDocument.querySelector(selector) as HTMLElement;
    return null as unknown as HTMLElement;
  }

  getChatHistorySelector(): string {
    return ".flex-1.flex.flex-col.gap-3.px-4.max-w-3xl.mx-auto.w-full.pt-1";
  }

  getPastChatHistorySelector(): string {
    return "#saypi-chat-history"; // identical to chat history
  }

  getRecentChatHistorySelector(): string {
    return "#saypi-chat-history"; // identical to chat history
  }

  getDiscoveryPanelSelector(): string {
    // note: depends on the side panel having already been identified
    return "#saypi-side-panel + div";
  }

  getAssistantResponseSelector(): string {
    return 'div[data-is-streaming]:has(div[class*="font-claude-message"])';
  }

  getUserPromptSelector(): string {
    return 'div.mb-1.mt-1';
  }

  getUserMessageContentSelector(): string {
    return "div[class*='font-user-message']";
  }

  getAssistantResponseContentSelector(): string {
    return "div[class*='font-claude-message']";
  }

  getAssistantResponse(
    element: HTMLElement,
    includeInitialText?: boolean
  ): AssistantResponse {
    return new ClaudeResponse(element, includeInitialText);
  }

  getUserMessage(element: HTMLElement): UserMessage {
    return new UserMessage(element, this);
  }

  getExtraCallButtonClasses(): string[] {
    return ["claude-call-button", "rounded-full", "claude-mobile-call-button"];
  }

  getContextWindowCapacityCharacters(): number {
    return 200000; // Claude has a 200k token limit
  }
}

class ClaudeResponse extends AssistantResponse {
  constructor(element: HTMLElement, includeInitialText?: boolean) {
    super(element, includeInitialText);
  }

  get contentSelector(): string {
    return "div[class*='font-claude-message']";
  }

  createTextStream(
    content: HTMLElement,
    options: InputStreamOptions
  ): ElementTextStream {
    return new ClaudeTextStream(content, options);
  }

  decorateControls(): MessageControls {
    return new ClaudeMessageControls(this, this.ttsControlsModule);
  }
}

class ClaudeMessageControls extends MessageControls {
  constructor(message: AssistantResponse, ttsControls: TTSControlsModule) {
    super(message, ttsControls);
  }

  protected getExtraControlClasses(): string[] {
    return ["text-sm"];
  }

  getHoverMenuSelector(): string {
    return "div.flex.items-stretch";
  }
}

/**
 * A ClaudeTextBlockCapture is a simplified ElementTextStream that captures Claude's response
 * as a single block of text, rather than as individual paragraphs or list items.
 * This approach is slower than the ClaudeTextStream, but is more reliable and straightforward.
 */
class ClaudeTextBlockCapture extends ElementTextStream {
  handleMutationEvent(mutation: MutationRecord): void {
    // no-op
  }
  constructor(
    element: HTMLElement,
    options: InputStreamOptions = { includeInitialText: false }
  ) {
    super(element, options);

    const messageElement = element.parentElement;
    if (this.isClaudeTextStream(messageElement)) {
      const claudeMessage = messageElement as HTMLElement;
      let wasStreaming = false;
      const messageObserver = new MutationObserver((mutations) => {
        const streamingInProgress = this.dataIsStreaming(claudeMessage);
        const streamingStarted = !wasStreaming && streamingInProgress;
        const streamingStopped = wasStreaming && !streamingInProgress;
        const streamingText = this.getNestedText(element).trimEnd(); // trim any trailing newline character from the text
        if (streamingStarted) {
          console.log("Claude started streaming.");
          // fire a new event to indicate that the streaming has started - this should not be necessary when streaming all data with subject.next(), but it's here since we only stream all data when the message is complete
          EventBus.emit("saypi:llm:first-token", {text: streamingText, time: Date.now()});
          this.handleTextAddition(streamingText);
        } else if (streamingStopped) {
          this.handleTextAddition(streamingText, true);
          this.subject.complete();
          console.log("Claude stopped streaming.");
        } else if (streamingInProgress) {
          this.handleTextAddition(streamingText);
        }
        wasStreaming = streamingInProgress;
      });
      messageObserver.observe(claudeMessage, {
        childList: false,
        subtree: false,
        characterData: false,
        attributes: true,
      });
    }
  }

  getNestedText(node: HTMLElement): string {
    return node.textContent ?? node.innerText ?? "";
  }

  dataIsStreaming(element: HTMLElement | null): boolean {
    return element !== null && element.hasAttribute("data-is-streaming") && element.getAttribute("data-is-streaming") === "true";
  }

  isClaudeTextStream(element: HTMLElement | null): boolean {
    return element !== null && element.hasAttribute("data-is-streaming");
  }

  handleTextAddition(allText: string, isFinal: boolean = false): void {
    if (isFinal) {
      this.subject.next(new AddedText(allText));
    }
  }
}

class ClaudeTextStream extends ClaudeTextBlockCapture {
  private _textProcessedSoFar: string = "";
  constructor(element: HTMLElement, options: InputStreamOptions = { includeInitialText: false }) {
    super(element, options);
  }

  override handleTextAddition(allText: string, isFinal: boolean = false): void {
    const unseenText = allText.replace(this._textProcessedSoFar, "");
    if (!unseenText) { return; } // some chunks may be empty, in which case we don't need to process them

    console.log(`[ClaudeTextStream] sending text to buffer: "${unseenText}"`);
    this.subject.next(new AddedText(unseenText));
    this._textProcessedSoFar = allText;
  }

}

function findAndDecorateCustomPlaceholderElement(
  prompt: HTMLElement
): Observation {
  const existing = prompt.parentElement?.querySelector("#claude-placeholder");
  if (existing) {
    return Observation.foundAlreadyDecorated("claude-placeholder", existing);
  } else {
    // find and copy the existing placeholder element
    const originalPlaceholder = prompt.querySelector("p[data-placeholder]");
    const placeholder = originalPlaceholder
      ? (originalPlaceholder.cloneNode(true) as HTMLElement)
      : document.createElement("p");
    placeholder.classList.add("custom-placeholder");
    placeholder.id = "claude-placeholder";
    // add custom placeholder element as a sibling to the prompt element (sic)
    prompt.insertAdjacentElement("afterend", placeholder);
    return new Observation(placeholder, placeholder.id, true, true, true);
  }
}

class ClaudePrompt extends AbstractUserPrompt {
  private promptElement: HTMLDivElement;
  private placeholderManager!: PlaceholderManager; // initialized from the constructor
  readonly PROMPT_CHARACTER_LIMIT = 200000; // max prompt length is the same as context window length, 200k tokens

  constructor(element: HTMLElement) {
    super(element);
    this.promptElement = element as HTMLDivElement;
    this.initializePlaceholderManager(this.promptElement);
    this.addSettingsButtonToToolsMenu();
  }

  /**
   * Get the selector for the tools menu button in Claude's UI
   * Centralizing this makes it easier to update if Claude's UI changes
   */
  private getToolsMenuButtonSelector(): string {
    return '[data-testid="input-menu-tools"]';
  }

  /**
   * Get the selector for the tools menu dialog in Claude's UI
   */
  private getToolsMenuDialogSelector(): string {
    return '.top-10.block, .bottom-10.block';
  }

  /**
   * Add a settings button to Claude's search and tools menu
   * This adds a shortcut to the SayPi extension settings within Claude's UI
   */
  private addSettingsButtonToToolsMenu(): void {
    // Wait for the DOM to be fully loaded
    setTimeout(() => {
      try {
        // Find the tools menu button within the prompt editor's container
        const promptContainer = ClaudeChatbot.getPromptContainer(this.promptElement);
        const toolsButton = promptContainer?.querySelector(this.getToolsMenuButtonSelector());
        if (!toolsButton) {
          console.debug("Claude tools menu button not found, settings button not added");
          return;
        }

        // Flag to track when the tools button is clicked
        let toolsButtonClicked = false;
        let lastToolsButtonClickTime = 0;
        
        // Observer to detect when the menu is opened
        const bodyObserver = new MutationObserver((mutations) => {
          // Wait a heartbeat before checking if button was clicked
          // This prevents race conditions between click and mutation events
          setTimeout(() => {
            // Only proceed if the tools button was clicked recently (within last 800ms)
            const currentTime = Date.now();
            const isRecentClick = (currentTime - lastToolsButtonClickTime) < 800;
            
            if (!toolsButtonClicked && !isRecentClick) return;
            
            mutations.forEach((mutation) => {
              if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Look for the tools menu that appears when the button is clicked
                const toolsMenu = promptContainer?.querySelector(this.getToolsMenuDialogSelector());
                if (toolsMenu && !toolsMenu.querySelector('.saypi-settings-menu-item')) {
                  this.insertSettingsMenuItem(toolsMenu);
                  // Reset the flag after we've added the menu item
                  toolsButtonClicked = false;
                }
              }
            });
          }, 10); // Small delay to allow click event to process first
        });

        // Start observing the body for the menu to appear
        bodyObserver.observe(document.body, { childList: true, subtree: true });

        // Click handler for the tools button
        toolsButton.addEventListener('click', () => {
          // Set the flag when the tools button is clicked
          toolsButtonClicked = true;
          lastToolsButtonClickTime = Date.now();
          
          // Reset the flag after a timeout in case the menu doesn't appear
          setTimeout(() => {
            toolsButtonClicked = false;
          }, 500);
        });
      } catch (error) {
        console.error("Error adding settings button to Claude tools menu:", error);
      }
    }, 1000); // Wait for Claude's UI to initialize
  }

  /**
   * Insert the settings menu item into the tools menu
   * @param toolsMenu The tools menu element
   */
  private insertSettingsMenuItem(toolsMenu: Element): void {
    try {
      // Find the specific menu items container
      const menuItemsContainer = toolsMenu.querySelector('.flex.flex-col > div:first-child > div.p-1\\.5 > div.flex.flex-col');
      if (!menuItemsContainer) {
        console.debug("Menu items container not found in tools menu");
        return;
      }

      // Create the button element using exact classes from existing items
      const button = document.createElement('button');
      button.className = 'saypi-settings-menu-item group flex w-full items-center text-left gap-2.5 h-[2rem] py-auto px-1.5 text-[0.875rem] text-text-200 rounded-md transition-colors select-none active:!scale-100 active:scale-[0.995] hover:bg-bg-200/50 hover:text-text-000';
      
      // Create icon container
      const iconContainer = document.createElement('div');
      iconContainer.className = 'group/icon h-4 w-4 flex items-center justify-center text-text-300 shrink-0 group-hover:text-text-100';
      
      // Use the bubble icon from IconModule
      const bubbleIcon = IconModule.bubbleBw.cloneNode(true) as SVGElement;
      bubbleIcon.setAttribute('width', '18');
      bubbleIcon.setAttribute('height', '18');
      bubbleIcon.classList.add('shrink-0', '-m-[1px]');
      
      // Change the fill color of black paths to dark gray
      const blackPaths = bubbleIcon.querySelectorAll('path[fill="#000000"]');
      blackPaths.forEach(path => {
        path.setAttribute('fill', 'rgb(61, 61, 58)');
      });
      
      iconContainer.appendChild(bubbleIcon);
      
      // Create text container
      const textContainer = document.createElement('div');
      textContainer.className = 'flex flex-row items-center flex-1 min-w-0';
      
      // Create text paragraph with "Voice settings" label
      const textParagraph = document.createElement('p');
      textParagraph.className = 'text-[0.9375rem] text-text-300 text-ellipsis break-words whitespace-nowrap leading-tight min-w-0 overflow-hidden group-hover:text-text-100';
      textParagraph.textContent = getMessage("voiceSettings");
      
      // Assemble the elements
      textContainer.appendChild(textParagraph);
      button.appendChild(iconContainer);
      button.appendChild(textContainer);
      
      // Add click handler to open settings
      button.addEventListener('click', () => {
        // Close the menu by simulating a click outside
        document.body.click();
        // Open settings popup
        openSettings();
      });
      
      // Create a wrapper div like the other menu items have
      const wrapper = document.createElement('div');
      wrapper.className = '';
      wrapper.appendChild(button);
      
      // Add to the menu after the existing items
      menuItemsContainer.appendChild(wrapper);
    } catch (error) {
      console.error("Error inserting settings menu item:", error);
    }
  }

  /**
   * Initialize the placeholder manager for the prompt element
   * This method is self-healing, in that it will reinitialize the placeholder manager
   * if the custom placeholder element is removed from the DOM for any reason.
   */
  initializePlaceholderManager(promptElement: HTMLElement): void {
    const observation = findAndDecorateCustomPlaceholderElement(promptElement);
    if (!observation.found) {
      console.error(
        "Failed to find or decorate the custom placeholder element for Claude's prompt."
      );
      return;
    }

    // Create new placeholder manager
    this.placeholderManager = new PlaceholderManager(
      promptElement,
      observation.target as HTMLElement,
      this.getDefaultPlaceholderText()
    );
    console.debug("Placeholder manager initialized");

    // Add mutation observer to detect when target is removed
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          const removedNodes = Array.from(mutation.removedNodes);
          if (removedNodes.includes(observation.target as Node)) {
            console.debug(
              "Custom placeholder element removed, reinitializing..."
            );
            // Target was removed, reinitialize
            observer.disconnect();
            this.initializePlaceholderManager(promptElement);
          }
        }
      });
    });

    // Observe the parent element for child removals (can be null if removed from DOM)
    const promptContainer = promptElement.parentElement
      ? promptElement.parentElement
      : document.getElementsByClassName("saypi-prompt-container")[0];
    if (promptContainer) {
      observer.observe(promptContainer as Node, {
        childList: true,
        subtree: false,
      });
    } else {
      console.error(
        "Prompt element parent element not found, cannot observe for placeholder removals."
      );
    }
  }

  setText(text: string): void {
    this.promptElement.innerText = text;
  }
  getText(): string {
    return this.promptElement.innerText;
  }

  /**
   * Set the placeholder text for the prompt element, which is displayed when the prompt is empty
   * @param text
   */
  setPlaceholderText(text: string): void {
    this.placeholderManager.setPlaceholder(text);
  }

  /**
   * Get the placeholder text for the prompt element, which is displayed when the prompt is empty
   * @returns placeholder text or empty string if the prompt is not empty
   */
  getPlaceholderText(): string {
    const placeholder = this.promptElement.querySelector(
      "p[data-placeholder]"
    ) as HTMLParagraphElement;
    return (
      this.placeholderManager.getPlaceholder() ||
      placeholder?.getAttribute("data-placeholder") ||
      ""
    );
  }

  getDefaultPlaceholderText(): string {
    const placeholder = this.promptElement.querySelector(
      "p[data-placeholder]"
    ) as HTMLParagraphElement;
    return placeholder?.getAttribute("data-placeholder") || "Talk to Claude...";
  }

  /**
   * Clear the prompt element
   */
  clear(): void {
    this.placeholderManager.setPlaceholder("");
    const promptParagraphs = this.promptElement.querySelectorAll(
      "p:not([data-placeholder])"
    );
    promptParagraphs.forEach((p) => {
      p.remove();
    });
  }
}

class PlaceholderManager {
  private input: HTMLElement;
  private customPlaceholder: HTMLElement | null;
  private placeholderText: string;
  private inputHandler: EventListener;

  constructor(
    inputElement: HTMLElement,
    placeholderElement: HTMLElement,
    initialPlaceholder: string
  ) {
    this.input = inputElement;
    this.customPlaceholder = placeholderElement;
    this.placeholderText = initialPlaceholder;
    this.inputHandler = this.handleInput.bind(this);
    this.initializePlaceholder();
  }

  initializePlaceholder() {
    this.setPlaceholder(this.placeholderText);
    this.input.addEventListener("input", this.inputHandler);
    this.updatePlaceholderVisibility();
  }

  handleInput() {
    this.updatePlaceholderVisibility();
  }

  isPromptEmpty() {
    return this.input.textContent === "";
  }

  promptEmptied() {
    this.showCustomPlaceholder();
    this.hideStandardPlaceholder();
  }

  promptFilled() {
    this.hideCustomPlaceholder();
  }

  updatePlaceholderVisibility() {
    if (this.isPromptEmpty()) {
      this.promptEmptied();
    } else {
      this.promptFilled();
    }
  }

  setPlaceholder(newPlaceholder: string) {
    this.placeholderText = newPlaceholder;
    // only set the placeholder text if the prompt is empty
    if (this.isPromptEmpty()) {
      this.getOrCreateCustomPlaceholder().textContent = this.placeholderText;
      this.updatePlaceholderVisibility();
    }
  }

  getPlaceholder() {
    return this.placeholderText;
  }

  /**
   * Get Claude's own placeholder element, which is hidden when the prompt is not empty
   */
  protected getStandardPlaceholder(): HTMLParagraphElement | null {
    return this.input.querySelector("p[data-placeholder]");
  }
  private showStandardPlaceholder() {
    const placeholder = this.getStandardPlaceholder();
    if (placeholder) {
      placeholder.style.visibility = "visible";
    }
  }
  private hideStandardPlaceholder() {
    const placeholder = this.getStandardPlaceholder();
    if (placeholder) {
      placeholder.style.visibility = "hidden";
    }
  }

  private getOrCreateCustomPlaceholder(): HTMLElement {
    if (this.customPlaceholder) {
      return this.customPlaceholder;
    }
    const placeholder = findAndDecorateCustomPlaceholderElement(this.input);
    if (placeholder.found) {
      this.customPlaceholder = placeholder.target as HTMLElement;
      return this.customPlaceholder;
    }
    throw new Error(
      "Failed to find or create the custom placeholder element. Ensure the prompt is empty."
    );
  }

  private showCustomPlaceholder() {
    this.customPlaceholder = this.getOrCreateCustomPlaceholder();
  }

  private hideCustomPlaceholder() {
    if (this.customPlaceholder) {
      // remove the custom placeholder element from the DOM
      this.customPlaceholder.parentNode?.removeChild(this.customPlaceholder);
      this.customPlaceholder = null;
    }
  }
}

export { ClaudeChatbot, ClaudePrompt };
