import { AssistantResponse, UserMessage } from "../dom/MessageElements";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import { TextInsertionManager } from "../text-insertion/TextInsertionManager";
import { VoiceSelector } from "../tts/VoiceMenu";
import getMessage from "../i18n";
import { AbstractChatbot, AbstractUserPrompt } from "./AbstractChatbots";
import { UserPrompt, SidebarConfig } from "./Chatbot";
import { findControlsContainerInComposer, findPromptInputInComposer, getScopedSubmitSelector } from "./chatgpt/ComposerSelectors";
import { getAssistantContentSelector } from "./chatgpt/MessageSelectors";
import { findThreadRoot } from "./chatgpt/HistorySelectors";
import { ChatGPTResponse } from "./chatgpt/ChatGPTResponse";

export const CHATGPT_FEATURES = {
  enableControlPanel: false,
};

class ChatGPTChatbot extends AbstractChatbot {
  private promptCache: Map<HTMLElement, ChatGPTPrompt> = new Map();

  getName(): string {
    return "ChatGPT";
  }

  getID(): string {
    return "chatgpt";
  }

  getVoiceMenu(
    _preferences: UserPreferenceModule,
    _element: HTMLElement
  ): VoiceSelector {
    return null as any;
  }

  getPrompt(element: HTMLElement): UserPrompt {
    if (!this.promptCache.has(element)) {
      this.promptCache.set(element, new ChatGPTPrompt(element));
    }
    return this.promptCache.get(element) as ChatGPTPrompt;
  }

  getPromptInput(searchRoot: Element): HTMLElement {
    return (findPromptInputInComposer(searchRoot) || undefined) as unknown as HTMLElement;
  }

  getPromptContainer(prompt: HTMLElement): HTMLElement {
    return (
      (prompt.closest('.composer-parent') as HTMLElement) ||
      (prompt.closest('.relative') as HTMLElement) ||
      (prompt.parentElement as HTMLElement)
    );
  }

  getPromptControlsContainer(promptContainer: HTMLElement): HTMLElement {
    return (findControlsContainerInComposer(promptContainer) || promptContainer) as HTMLElement;
  }

  getPromptTextInputSelector(): string {
    return '#prompt-textarea.ProseMirror[contenteditable="true"]';
  }

  getPromptSubmitButtonSelector(): string {
    return getScopedSubmitSelector();
  }

  getAudioControls(_searchRoot: Element): HTMLElement {
    return null as any;
  }

  getAudioControlsSelector(): string {
    return "";
  }

  getAudioOutputButtonSelector(): string {
    return "";
  }

  getControlPanelSelector(): string {
    if (CHATGPT_FEATURES.enableControlPanel) {
      return '.composer-parent';
    }
    return '';
  }

  getSidebarSelector(): string {
    // Prefer the direct descendant of the slideover container,
    // avoiding the slideover container itself so we don't clobber its id attribute
    return '#stage-slideover-sidebar > div';
  }

  getChatPath(): string {
    return "/";
  }

  isChatablePath(path: string): boolean {
    const host = window.location.hostname;
    const supportedHosts = ['chatgpt.com', 'chat.com', 'chat.openai.com'];
    if (!supportedHosts.some(h => host.includes(h))) return false;
    return path === "/" || path.startsWith("/c/") || path.startsWith("/g/") || path.startsWith("/share/");
  }

  getVoiceMenuSelector(): string {
    return "";
  }

  getVoiceSettingsSelector(): string {
    return "";
  }

  getChatHistory(searchRoot: HTMLElement): HTMLElement {
    const thread = findThreadRoot(searchRoot) as HTMLElement | null;
    const scope: ParentNode = (thread as ParentNode) || (searchRoot as ParentNode) || document;
    const firstTurn = (scope as Element | Document).querySelector?.(
      'article[data-testid^="conversation-turn"], article[data-testid^="conversation-turn-"]'
    ) as HTMLElement | null;
    if (firstTurn && firstTurn.parentElement) {
      return firstTurn.parentElement as HTMLElement;
    }
    return null as unknown as HTMLElement;
  }

  getChatHistorySelector(): string {
    const listByArticles = 'div:has(> article[data-testid^="conversation-turn"])';
    return ['#thread ' + listByArticles, listByArticles].join(', ');
  }

  getPastChatHistorySelector(): string {
    return this.getChatHistorySelector();
  }

  getRecentChatHistorySelector(): string {
    return this.getChatHistorySelector();
  }

  getDiscoveryPanelSelector(): string {
    return "";
  }

  getAssistantResponseSelector(): string {
    const sel = 'article[data-turn="assistant"]';
    return ['#thread ' + sel, sel].join(', ');
  }

  getAssistantResponseContentSelector(): string {
    return getAssistantContentSelector();
  }

  getUserPromptSelector(): string {
    return 'article[data-turn="user"]';
  }

  getUserMessageContentSelector(): string {
    return '[data-message-author-role="user"] .whitespace-pre-wrap';
  }

  getExtraCallButtonClasses(): string[] {
    return ["chatgpt-call-button"];
  }

  getContextWindowCapacityCharacters(): number {
    return 100000;
  }

  simulateFormSubmit(): boolean {
    const chatgptSubmitButton = this.findChatGPTSubmitButton();
    if (chatgptSubmitButton) {
      chatgptSubmitButton.click();
      console.debug("Sending message to ChatGPT at", Date.now());
      return true;
    }
    const textarea = document.getElementById("saypi-prompt");
    if (textarea) {
      const enterEvent = new KeyboardEvent("keydown", {
        bubbles: true,
        key: "Enter",
        keyCode: 13,
        which: 13,
      });
      textarea.dispatchEvent(enterEvent);
      console.debug("Dispatched Enter keydown event to ChatGPT at", Date.now());
      return true;
    }
    console.error("Cannot simulate submit for ChatGPT: No submit button or textarea found.");
    return false;
  }

  getSidebarConfig(sidebar: HTMLElement): SidebarConfig | null {
    const menuContainer = sidebar.querySelector('aside');

    if (!menuContainer) {
      console.warn('[ChatGPT] sidebar: Could not find menu container');
      return null;
    }

    return {
      buttonContainer: menuContainer,
      buttonStyle: 'menu',
      insertPosition: 2, // After New chat + Search
      createButton: this.createChatGPTMenuButton.bind(this),
    };
  }

  /**
   * Creates a menu button matching ChatGPT's native sidebar button structure
   */
  private createChatGPTMenuButton(options: { label: string; icon: string | SVGElement; onClick: () => void }): HTMLElement {
    const { label, icon, onClick } = options;

    // Create the main button container matching ChatGPT's native structure
    // Uses ChatGPT's __menu-item and hoverable classes for native integration
    const button = document.createElement('div');
    button.className = 'settings-button group __menu-item hoverable gap-1.5';
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');
    button.setAttribute('aria-label', label);

    // Add click and keyboard handlers
    button.addEventListener('click', onClick);
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    });

    // Create icon container with group-disabled states for accessibility
    const iconContainer = document.createElement('div');
    iconContainer.className = 'flex items-center justify-center group-disabled:opacity-50 group-data-disabled:opacity-50 icon';

    // Add icon
    let svgElement: SVGElement | null = null;
    if (typeof icon === 'string') {
      // Parse SVG string
      const parser = new DOMParser();
      const doc = parser.parseFromString(icon, 'image/svg+xml');
      svgElement = doc.documentElement as unknown as SVGElement;
    } else {
      svgElement = icon.cloneNode(true) as SVGElement;
    }

    if (svgElement) {
      svgElement.setAttribute('width', '20');
      svgElement.setAttribute('height', '20');
      svgElement.setAttribute('aria-hidden', 'true');
      svgElement.classList.add('icon');
      svgElement.style.width = '20px';
      svgElement.style.height = '20px';
      iconContainer.appendChild(svgElement);
    }

    // Create label container matching ChatGPT's structure
    const labelContainer = document.createElement('div');
    labelContainer.className = 'flex min-w-0 grow items-center gap-2.5 group-data-no-contents-gap:gap-0';

    const labelSpan = document.createElement('div');
    labelSpan.className = 'truncate';
    labelSpan.textContent = label;

    labelContainer.appendChild(labelSpan);

    // Assemble button
    button.appendChild(iconContainer);
    button.appendChild(labelContainer);

    return button;
  }

  private findChatGPTSubmitButton(): HTMLElement | null {
    const selectors = [
      'form[data-type="unified-composer"] button[type="submit"]',
      'form[data-type="unified-composer"] [data-testid="send-button"]',
      'form[data-type="unified-composer"] button[aria-label*="Send" i]',
      'form[data-type="unified-composer"] button[title*="Send" i]',
      'button[data-testid="send-button"]',
      'button[aria-label*="Send" i]:not([aria-label*="Stop" i])',
      'button[title*="Send" i]:not([title*="Stop" i])'
    ];
    for (const selector of selectors) {
      try {
        const button = document.querySelector(selector) as HTMLElement;
        if (button && !(button as HTMLButtonElement).disabled) {
          return button;
        }
      } catch (e) {
        console.debug("Failed to query selector:", selector, e);
      }
    }
    return null;
  }

  protected createAssistantResponse(element: HTMLElement, includeInitialText?: boolean, isStreaming?: boolean): AssistantResponse {
    const container = (element.closest('[data-message-author-role="assistant"]') ||
      element.closest('article[data-testid^="conversation-turn-"]') ||
      element.closest('article[data-testid^="conversation-turn"]') ||
      element) as HTMLElement;
    try {
      const nodes = Array.from(document.querySelectorAll('[data-saypi-shielded]')) as HTMLElement[];
      nodes.forEach(n => { try { n.removeAttribute('data-saypi-shielded'); } catch {} });
    } catch {}
    return new ChatGPTResponse(container, includeInitialText, isStreaming);
  }

  getUserMessage(element: HTMLElement): UserMessage {
    return new ChatGPTUserMessage(element);
  }
}

class ChatGPTPrompt extends AbstractUserPrompt {
  readonly PROMPT_CHARACTER_LIMIT = 32000;

  constructor(element: HTMLElement) {
    super(element);
  }

  getText(): string {
    return this.element.textContent || "";
  }

  setText(text: string): void {
    const textInsertionManager = TextInsertionManager.getInstance();
    this.element.focus();
    const success = textInsertionManager.insertText(this.element, text, true);
    if (!success) {
      this.element.textContent = text;
      const inputEvent = new Event('input', { bubbles: true });
      this.element.dispatchEvent(inputEvent);
    }
  }

  setDraft(transcript: string): void {
    this.setPlaceholderText("");
    this.setText(`${transcript} `);
  }

  getPlaceholderText(): string {
    return this.element.getAttribute('data-placeholder') || this.element.getAttribute('placeholder') || "";
  }

  setPlaceholderText(text: string): void {
    if (this.element.setAttribute) {
      this.element.setAttribute('data-placeholder', text);
      this.element.setAttribute('placeholder', text);
    }
  }

  getDefaultPlaceholderText(): string {
    return getMessage("chatgpt_placeholder_default");
  }
}

class ChatGPTUserMessage extends UserMessage {
  constructor(element: HTMLElement) {
    super(element, new ChatGPTChatbot());
  }

  getText(): string {
    const contentElement = this.element.querySelector('.whitespace-pre-wrap');
    return contentElement?.textContent || this.element.textContent || "";
  }
}

export default ChatGPTChatbot;
