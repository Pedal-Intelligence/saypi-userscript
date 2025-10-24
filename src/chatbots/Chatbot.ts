import { AssistantResponse } from "../dom/MessageElements";
import { UserMessage } from "../dom/MessageElements";
import { VoiceSelector } from "../tts/VoiceMenu";
import { UserPreferenceModule } from "../prefs/PreferenceModule";

export interface Chatbot {
  getChatHistory(searchRoot: HTMLElement): HTMLElement;
  getAudioControls(searchRoot: Element): HTMLElement;
  getPromptInput(searchRoot: Element): HTMLElement;
  getPromptContainer(prompt: HTMLElement): HTMLElement; // get the element that contains the prompt text area
  getPromptControlsContainer(promptContainer: HTMLElement): HTMLElement; // get the element that contains the submit button and other prompt controls
  getChatHistorySelector(): string;
  getPastChatHistorySelector(): string; // can be identical to chat history
  getRecentChatHistorySelector(): string; // can be identical to chat history
  getVoiceMenuSelector(): string;
  getVoiceSettingsSelector(): string;
  getDiscoveryPanelSelector(): string;
  getAudioOutputButtonSelector(): string;
  getAudioControlsSelector(): string;
  getControlPanelSelector(): string;
  /**
   * Returns a selector that matches the chatbot's sidebar/root navigation container.
   */
  getSidebarSelector(): string;
  getPromptTextInputSelector(): string;
  getPromptSubmitButtonSelector(): string;
  getAssistantResponseSelector(): string;
  getAssistantResponseContentSelector(): string;
  getUserPromptSelector(): string; // Selector to find user's chat messages
  getUserMessageContentSelector(): string; // Selector to find content within user messages
  getChatPath(): string;
  isChatablePath(path: string): boolean; // can the chatbot chat on this URL path?
  // ... other methods for different selectors
  getExtraCallButtonClasses(): string[];
  getContextWindowCapacityCharacters(): number; // Returns the context window capacity in characters

  getPrompt(element: HTMLElement): UserPrompt;
  getAssistantResponse(
    element: HTMLElement,
    includeInitialText?: boolean,
    isStreaming?: boolean
  ): AssistantResponse;
  getUserMessage(element: HTMLElement): UserMessage; // Get a user message from an element
  getName(): string; // the display name of the chatbot, e.g. "Pi", "Claude"
  getID(): string; // the name of the chatbot as it appears in URLs, etc., e.g. "pi", "claude"
  getNickname(): Promise<string>; // Returns the user's preferred nickname for the AI assistant, or the default name if not set
  hasNickname(): Promise<boolean>;
  getVoiceMenu(preferences: UserPreferenceModule, element: HTMLElement): VoiceSelector;

  // Submit method - chatbot-specific submission logic
  simulateFormSubmit(): boolean;

  // Feature capability helpers
  supportsFocusMode(): boolean;

  // Sidebar configuration - chatbot-specific logic for sidebar button placement
  // The sidebar element is found via getSidebarSelector(), then this method
  // returns a SidebarConfig describing where and how to add buttons
  // Follows the pattern of getPrompt(), getUserMessage(), etc.
  getSidebarConfig(sidePanel: HTMLElement): SidebarConfig | null;

  // Cache and utility methods - implementations are in AbstractChatbot
  getCachedAssistantResponse(element: HTMLElement): AssistantResponse | undefined;
  clearCachedAssistantResponse(element: HTMLElement): boolean;
}

export interface SidebarConfig {
  // The container element where buttons should be added
  buttonContainer: HTMLElement;

  // Button style variant - determines which button creation method to use
  // 'control' = large control panel buttons (a.maxi with h-16 w-16)
  // 'menu' = compact menu buttons (div[role=button] with h-[2.5rem])
  buttonStyle: 'control' | 'menu';

  // Position where the first button should be inserted (0 = prepend, etc.)
  insertPosition?: number;

  // Optional: chatbot-specific button creation function
  // If provided, this will be used instead of the default ButtonModule methods
  // This allows chatbots to create buttons with their own DOM structure and classes
  createButton?: (options: { label: string; icon: string | SVGElement; onClick: () => void }) => HTMLElement;
}

export interface UserPrompt {
  getDraft(): string;
  setDraft(transcript: string): void;
  clear(): void;
  setText(text: string): void;
  getText(): string;
  setPlaceholderText(text: string): void;
  getPlaceholderText(): string;
  getDefaultPlaceholderText(): string;
  PROMPT_CHARACTER_LIMIT: number;
  setMessage(label: string): void;
  setFinal(transcript: string, isMaintainanceMessage?: boolean): void;
}
