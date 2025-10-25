import { AssistantResponse, UserMessage } from "../dom/MessageElements";
import { Observation } from "../dom/Observation";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import { TTSControlsModule } from "../tts/TTSControlsModule";
import { VoiceSelector } from "../tts/VoiceMenu";
import { AbstractChatbot, AbstractUserPrompt } from "./AbstractChatbots";
import { UserPrompt, SidebarConfig } from "./Chatbot";
import { ClaudeVoiceMenu } from "./ClaudeVoiceMenu";
import { ClaudeResponse } from "./claude/ClaudeResponse";

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

  getSidebarSelector(): string {
    // Match Claude's primary navigation sidebar. Prefer the nav element, but allow for non-English labels.
    return [
      'nav[aria-label="Sidebar"]',
      '.z-sidebar nav[aria-label]'
    ].join(", ");
  }

  getChatPath(): string {
    return "/chat";
  }

  isChatablePath(path: string): boolean {
    if (path.startsWith("/code")) return false; // chat not supported for Claude Code coding agents
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
    // note: depends on the sidebar having already been identified
    return "#saypi-sidebar + div, #saypi-side-panel + div";
  }

  getAssistantResponseSelector(): string {
    return 'div[data-is-streaming]:has(> div[class*="font-claude-response"])';
  }

  getUserPromptSelector(): string {
    return 'div.mb-1.mt-1';
  }

  getUserMessageContentSelector(): string {
    return "div[class*='font-user-message']";
  }

  getAssistantResponseContentSelector(): string {
    return "div[class*='font-claude-response']";
  }

  getAssistantResponse(
    element: HTMLElement,
    includeInitialText?: boolean
  ): AssistantResponse {
    return super.getAssistantResponse(element, includeInitialText);
  }

  protected createAssistantResponse(
    element: HTMLElement,
    includeInitialText?: boolean,
    isStreaming?: boolean
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

  simulateFormSubmit(): boolean {
    // Claude.ai uses the standard SayPi submit button, so fallback to keyboard events
    const promptComposer = document.getElementById("saypi-prompt");
    if (promptComposer) {
      const enterEvent = new KeyboardEvent("keydown", {
        bubbles: true,
        key: "Enter",
        keyCode: 13,
        which: 13,
      });
      promptComposer.dispatchEvent(enterEvent);
      console.debug("Dispatched Enter keydown event to Claude at", Date.now());
      return true;
    }

    console.error("Cannot submit prompt for Claude: No prompt composer found.");
    return false;
  }

  getSidebarConfig(sidebar: HTMLElement): SidebarConfig | null {
    const actionSelectors = [
      '[data-testid="new-chat-button"]',
      '[data-testid="navigation-link-new-chat"]',
      '[data-testid="create-new-chat-button"]',
      '[aria-label="New chat"]',
      'a[href="/new"]',
      'a[href="/chat/new"]',
    ];

    const newChatButton = actionSelectors
      .map((selector) => sidebar.querySelector(selector) as HTMLElement | null)
      .find((element) => element !== null) as HTMLElement | null;

    const collectCandidateContainers = () => {
      const candidates: HTMLElement[] = [];
      if (newChatButton) {
        let ancestor = newChatButton.parentElement as HTMLElement | null;
        while (ancestor && ancestor !== sidebar) {
          candidates.push(ancestor);
          ancestor = ancestor.parentElement as HTMLElement | null;
        }
      }
      const allDivs = Array.from(sidebar.querySelectorAll('div')).map((div) => div as HTMLElement);
      return [...candidates, ...allDivs];
    };

    const menuContainer = collectCandidateContainers().find((candidate) => {
      const actions = Array.from(candidate.querySelectorAll('a, button, div[role="button"]')).filter((action) => !action.closest('[data-testid="user-profile"]'));
      return actions.length >= 3;
    }) || null;

    if (!menuContainer) {
      console.warn('[Claude] sidebar: Could not find menu container');
      return null;
    }

    let header: HTMLElement | null = menuContainer;
    while (header && header.parentElement && header.parentElement !== sidebar) {
      header = header.parentElement as HTMLElement;
    }

    if (!header || header.parentElement !== sidebar) {
      console.warn('[Claude] sidebar: Could not find header element');
      return null;
    }

    return {
      buttonContainer: menuContainer,
      buttonStyle: 'menu',
      insertPosition: 3,
    };
  }
}

// Claude response parsing moved to ./claude/ClaudeResponse.ts

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
    // ensure attribute exists for ::before content rendering
    if (!placeholder.hasAttribute("data-placeholder")) {
      placeholder.setAttribute("data-placeholder", "");
    }
    // add custom placeholder element as a sibling to the prompt element (sic)
    prompt.insertAdjacentElement("afterend", placeholder);
    return new Observation(placeholder, placeholder.id, true, true, true);
  }
}

class ClaudePrompt extends AbstractUserPrompt {
  private placeholderInitialized = false;
  private promptElement: HTMLDivElement;
  private placeholderManager!: PlaceholderManager;
  readonly PROMPT_CHARACTER_LIMIT = 200000;

  constructor(element: HTMLElement) {
    super(element);
    this.promptElement = element as HTMLDivElement;
    this.initializePlaceholderManager(this.promptElement);
  }

  /**
   * Initialize the placeholder manager for the prompt element
   * This method is self-healing, in that it will reinitialize the placeholder manager
   * if the custom placeholder element is removed from the DOM for any reason.
   */
  initializePlaceholderManager(promptElement: HTMLElement): void {
    if (this.placeholderInitialized) {
      console.debug("Placeholder manager already initialized; skipping");
      return;
    }
    this.placeholderInitialized = true;
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
              "Custom placeholder element removed. Skipping reinitialize due to guard."
            );
            observer.disconnect();
          }
        }
      });
    });
  }

  setText(text: string): void {
    this.promptElement.innerText = text;
    this.placeholderManager.updatePlaceholderVisibility();
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
    // If placeholderManager not yet initialized, fall back to standard placeholder attribute
    const managerText = this.placeholderManager
      ? this.placeholderManager.getPlaceholder()
      : undefined;
    return (
      managerText ||
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
    this.setText(""); // clear the text
    this.placeholderManager.setPlaceholder(this.getDefaultPlaceholderText()); // restore default placeholder
    const promptParagraphs = this.promptElement.querySelectorAll("p:not([data-placeholder])");
    promptParagraphs.forEach((p) => p.remove()); // remove any other paragraphs
  }
}

class PlaceholderManager {
  private input: HTMLElement;
  private customPlaceholder: HTMLElement | null;
  private placeholderText: string;

  constructor(
    inputElement: HTMLElement,
    placeholderElement: HTMLElement,
    initialPlaceholder: string
  ) {
    this.input = inputElement;
    this.customPlaceholder = placeholderElement;
    this.placeholderText = initialPlaceholder;
    this.initializePlaceholder();
  }

  initializePlaceholder() {
    // set initial placeholder text and bind event listeners for all edit operations
    this.setPlaceholder(this.placeholderText);

    // any keyboard input
    this.input.addEventListener("input", this.handleInput.bind(this));
    // paste from clipboard
    this.input.addEventListener("paste", () => setTimeout(() => this.handleInput(), 0));
    // cut to clipboard
    this.input.addEventListener("cut", () => setTimeout(() => this.handleInput(), 0));
    // note: undo/redo is not covered

    // set initial visibility
    this.updatePlaceholderVisibility();
  }

  handleInput() {
    // Defer evaluation to after DOM updates (handles select-all + cut/undo cases)
    setTimeout(() => this.updatePlaceholderVisibility(), 0);
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
      const el = this.getOrCreateCustomPlaceholder();
      el.setAttribute("data-placeholder", this.placeholderText);
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
    this.customPlaceholder.setAttribute("data-placeholder", this.placeholderText);
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
