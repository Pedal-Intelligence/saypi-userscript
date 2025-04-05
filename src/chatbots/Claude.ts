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
    const selector = this.getAudioControlsSelector();
    const localAudioControls = searchRoot.querySelector(selector) as HTMLElement;
    if (localAudioControls) {
      return localAudioControls;
    }
    return searchRoot.ownerDocument.querySelector(selector) as HTMLElement;
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
    return ["claude-call-button", "rounded-full"];
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
        const streamingText = this.getNestedText(element);
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
    return '.top-10.block';
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

        // Observer to detect when the menu is opened
        const bodyObserver = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
              // Look for the tools menu that appears when the button is clicked
              const toolsMenu = promptContainer?.querySelector(this.getToolsMenuDialogSelector());
              if (toolsMenu && !toolsMenu.querySelector('.saypi-settings-menu-item')) {
                this.insertSettingsMenuItem(toolsMenu);
              }
            }
          });
        });

        // Start observing the body for the menu to appear
        bodyObserver.observe(document.body, { childList: true, subtree: true });

        // Click handler for the tools button to ensure we can find the menu when it opens
        toolsButton.addEventListener('click', () => {
          // Look for the menu after a short delay to ensure it's in the DOM
          setTimeout(() => {
            const toolsMenu = document.body.querySelector(this.getToolsMenuDialogSelector());
            if (toolsMenu && !toolsMenu.querySelector('.saypi-settings-menu-item')) {
              this.insertSettingsMenuItem(toolsMenu);
            }
          }, 100);
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
      
      // Create settings icon SVG
      const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      iconSvg.setAttribute('width', '18');
      iconSvg.setAttribute('height', '18');
      iconSvg.setAttribute('viewBox', '0 0 20 20');
      iconSvg.setAttribute('fill', 'currentColor');
      iconSvg.classList.add('shrink-0', '-m-[1px]');
      
      // Settings icon path
      const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      iconPath.setAttribute('fill-rule', 'evenodd');
      iconPath.setAttribute('clip-rule', 'evenodd');
      iconPath.setAttribute('d', 'M10 2C9.44772 2 9 2.44772 9 3V3.10512C9 3.82331 8.47054 4.42871 7.76907 4.58865C7.5227 4.64335 7.27961 4.71169 7.04146 4.79336C6.37524 5.00312 5.62509 4.78925 5.17299 4.23579L5.10512 4.15199C4.74858 3.7171 4.12563 3.66193 3.70708 4.04417L3.04417 4.62882C2.62563 5.01106 2.57045 5.63401 2.95199 6.05256L3.03841 6.15584C3.50524 6.72188 3.60191 7.52051 3.22631 8.19613C3.16252 8.3156 3.10274 8.43738 3.04713 8.56124C2.79791 9.10256 2.26794 9.46863 1.68279 9.46863H1.5C0.947715 9.46863 0.5 9.91635 0.5 10.4686V11.4059C0.5 11.9582 0.947715 12.4059 1.5 12.4059H1.68279C2.26794 12.4059 2.79791 12.772 3.04713 13.3133C3.10274 13.4372 3.16252 13.559 3.22631 13.6784C3.60192 14.354 3.50524 15.1527 3.03841 15.7187L2.95199 15.822C2.57045 16.2405 2.62563 16.8635 3.04417 17.2457L3.70708 17.8304C4.12563 18.2126 4.74858 18.1574 5.10512 17.7226L5.17299 17.6388C5.62509 17.0853 6.37524 16.8714 7.04146 17.0812C7.27961 17.1629 7.5227 17.2312 7.76907 17.2859C8.47054 17.4458 9 18.0512 9 18.7694V18.875C9 19.4273 9.44772 19.875 10 19.875H11C11.5523 19.875 12 19.4273 12 18.875V18.7694C12 18.0512 12.5295 17.4458 13.2309 17.2859C13.4773 17.2312 13.7204 17.1629 13.9585 17.0812C14.6248 16.8714 15.3749 17.0853 15.827 17.6388L15.8949 17.7226C16.2514 18.1574 16.8744 18.2126 17.2929 17.8304L17.9558 17.2457C18.3744 16.8635 18.4295 16.2405 18.048 15.822L17.9616 15.7187C17.4948 15.1527 17.3981 14.354 17.7737 13.6784C17.8375 13.559 17.8973 13.4372 17.9529 13.3133C18.2021 12.772 18.7321 12.4059 19.3172 12.4059H19.5C20.0523 12.4059 20.5 11.9582 20.5 11.4059V10.4686C20.5 9.91635 20.0523 9.46863 19.5 9.46863H19.3172C18.7321 9.46863 18.2021 9.10256 17.9529 8.56124C17.8973 8.43738 17.8375 8.3156 17.7737 8.19613C17.3981 7.52051 17.4948 6.72188 17.9616 6.15584L18.048 6.05256C18.4295 5.63401 18.3744 5.01106 17.9558 4.62882L17.2929 4.04417C16.8744 3.66193 16.2514 3.7171 15.8949 4.15199L15.827 4.23579C15.3749 4.78925 14.6248 5.00312 13.9585 4.79336C13.7204 4.71169 13.4773 4.64335 13.2309 4.58865C12.5295 4.42871 12 3.82331 12 3.10512V3C12 2.44772 11.5523 2 11 2H10ZM9.15447 14.0001C7.28538 13.5948 5.94527 11.8303 6.10478 9.89571C6.26428 7.96115 7.9289 6.4855 9.99999 6.50017C12.0711 6.51484 13.7357 8.01119 13.8952 9.94574C14.0547 11.8803 12.7146 13.6449 10.8455 14.0501C10.5732 14.0999 10.2936 14.1246 10.0124 14.1241C9.7216 14.1235 9.4323 14.0956 9.15447 14.0001ZM13.4451 11.0797C13.7974 10.1855 13.6955 9.14749 13.1235 8.3359C12.5515 7.52432 11.6338 7.00024 10.6403 7.00024C9.64687 7.00024 8.72912 7.52432 8.15712 8.3359C7.58512 9.14749 7.48318 10.1855 7.83553 11.0797C8.18789 11.9739 8.98398 12.6435 9.96067 12.8732C10.9374 13.103 11.9727 12.8669 12.7493 12.2313C13.5259 11.5958 13.9717 10.6401 13.8905 9.70024');
      iconSvg.appendChild(iconPath);
      iconContainer.appendChild(iconSvg);
      
      // Create text container
      const textContainer = document.createElement('div');
      textContainer.className = 'flex flex-row items-center flex-1 min-w-0';
      
      // Create text paragraph
      const textParagraph = document.createElement('p');
      textParagraph.className = 'text-[0.9375rem] text-text-300 text-ellipsis break-words whitespace-nowrap leading-tight min-w-0 overflow-hidden group-hover:text-text-100';
      textParagraph.textContent = getMessage("extensionSettings");
      
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
