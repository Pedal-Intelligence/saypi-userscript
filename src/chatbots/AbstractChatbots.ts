import { Chatbot, UserPrompt } from "./Chatbot";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import EventBus from "../events/EventBus";
import { shortenTranscript } from "../TextModule";
import { ImmersionStateChecker } from "../ImmersionServiceLite";
import { AssistantResponse, UserMessage } from "../dom/MessageElements";
import { VoiceSelector } from "../tts/VoiceMenu";

export abstract class AbstractChatbot implements Chatbot {
    protected readonly preferences = UserPreferenceModule.getInstance();
  
    abstract getChatHistory(searchRoot: HTMLElement): HTMLElement;
    abstract getChatHistorySelector(): string;
    abstract getPastChatHistorySelector(): string;
    abstract getRecentChatHistorySelector(): string;
    abstract getVoiceMenuSelector(): string;
    abstract getVoiceSettingsSelector(): string;
    abstract getDiscoveryPanelSelector(): string;
    abstract getAudioOutputButtonSelector(): string;
    abstract getAudioControls(searchRoot: Element): HTMLElement;
    abstract getAudioControlsSelector(): string;
    abstract getControlPanelSelector(): string;
    abstract getSidePanelSelector(): string;
    abstract getPromptTextInputSelector(): string;
    abstract getPromptSubmitButtonSelector(): string;
    abstract getAssistantResponseSelector(): string;
    abstract getAssistantResponseContentSelector(): string;
    abstract getUserPromptSelector(): string;
    abstract getUserMessageContentSelector(): string;
    abstract getChatPath(): string;
    abstract isChatablePath(path: string): boolean;
    abstract getExtraCallButtonClasses(): string[];
    abstract getContextWindowCapacityCharacters(): number;
    abstract getPrompt(element: HTMLElement): UserPrompt;
    abstract getPromptInput(searchRoot: Element): HTMLElement; // search for the prompt input element
    abstract getPromptContainer(prompt: HTMLElement): HTMLElement;
    abstract getPromptControlsContainer(promptContainer: HTMLElement): HTMLElement;
    abstract getAssistantResponse(element: HTMLElement, includeInitialText?: boolean): AssistantResponse;
    abstract getUserMessage(element: HTMLElement): UserMessage;
    abstract getName(): string;
    abstract getVoiceMenu(preferences: UserPreferenceModule, element: HTMLElement): VoiceSelector;

    getID(): string {
      return this.getName().toLowerCase();
    }
  
    async getNickname(): Promise<string> {
      const nickname = await this.preferences.getNickname();
      return nickname || this.getName();
    }
  
    async hasNickname(): Promise<boolean> {
      const nickname = await this.getNickname();
      return nickname !== this.getName();
    }
  }
  
  export abstract class AbstractUserPrompt implements UserPrompt {
    protected readonly element: HTMLElement;
    protected readonly preferences = UserPreferenceModule.getInstance();
  
    constructor(element: HTMLElement) {
      this.element = element;
    }
  
    /**
     * Get the prompt textarea's current placeholder text
     */
    getDraft(): string {
      return this.getPlaceholderText() || "";
    }
  
    /**
     * Set the prompt textarea to the given transcript, but do not submit it
     * @param transcript The prompt to be displayed in the prompt textarea
     */
    setDraft(transcript: string): void {
      this.preferences.getAutoSubmit().then((autoSubmit) => {
        if (autoSubmit) {
          console.debug(`Setting placeholder text of ${transcript.length} characters`);
          this.setPlaceholderText(`${transcript}`);
        } else {
          this.setPlaceholderText("");
          this.clear();
          this.typeText(`${transcript} `, false);
        }
      });
    }
  
    /**
     * Clear the prompt textarea
     */
    clear(): void {
      this.setText("");
      this.setPlaceholderText("");
    }
  
    abstract setText(text: string): void;
    abstract getText(): string;
    abstract setPlaceholderText(text: string): void;
    abstract getPlaceholderText(): string;
    abstract getDefaultPlaceholderText(): string;
    abstract PROMPT_CHARACTER_LIMIT: number;
  
    /**
     * Set a descriptive message for the user in the prompt textarea
     * Used to inform the user of the current state of the application
     * @param label The placeholder text to be displayed in the prompt textarea
     */
    setMessage(label: string): void {
      this.setPlaceholderText(label);
    }
  
    /**
     * Enter the given transcript into the prompt field and submit it if so configured
     * @param transcript The completed transcript. If autoSubmit is enabled, the transcript will be submitted
     * @param isMaintainanceMessage Whether this is a maintainance message that should include custom instructions
     */
    async setFinal(transcript: string, isMaintainanceMessage?: boolean): Promise<void> {
      const textarea = document.getElementById(
        "saypi-prompt"
      ) as HTMLTextAreaElement;
  
      let isFocused = document.activeElement === textarea;
      if (!isFocused) {
        textarea.readOnly = true;
      }
  
      if (isMaintainanceMessage) {
        // Since we can't use ChatbotService due to circular dependency,
        // we'll use a more generic approach without nickname customization
        this.submitFinalTranscript(transcript, isFocused, textarea);
      } else {
        this.submitFinalTranscript(transcript, isFocused, textarea);
      }
    }
  
    private submitFinalTranscript(transcript: string, isFocused: boolean, textarea: HTMLTextAreaElement): void {
      if (this.preferences.getCachedAutoSubmit()) {
        // overflowing the prompt textarea will cause the auto submit to fail
        const PROMPT_LIMIT_BUFFER = 10; // margin of error
        transcript = shortenTranscript(transcript, this.PROMPT_CHARACTER_LIMIT - PROMPT_LIMIT_BUFFER);
      }
      if (ImmersionStateChecker.isViewImmersive()) {
        this.enterTextAndSubmit(transcript, true);
      } else {
        this.typeText(`${transcript} `, true); // types and submits the prompt
      }
      if (!isFocused) {
        textarea.blur();
        textarea.readOnly = false;
      }
    }
  
    private enterTextAndSubmit(text: string, submit: boolean): void {
      this.setText(text);
      if (submit) EventBus.emit("saypi:autoSubmit");
    }
  
    private typeText(text: string, submit = false) {
      this.element.focus();
      const sentenceRegex = /([.!?。？！]+)/g;
      const tokens = text.split(sentenceRegex).filter(Boolean);
      const sentences: string[] = [];
      for (let i = 0; i < tokens.length; i += 2) {
        const sentence = tokens[i] + (tokens[i + 1] || "");
        sentences.push(sentence);
      }
      const typeNextSentenceOrSubmit = () => {
        if (sentences.length === 0) {
          if (submit) EventBus.emit("saypi:autoSubmit");
        } else {
          // Emit the event only after all sentences have been typed
          const nextSentence = sentences.shift();
          this.setText(this.getText() + nextSentence);
          requestAnimationFrame(typeNextSentenceOrSubmit);
        }
      };
      if (sentences.length === 0) {
        this.enterTextAndSubmit(text, submit);
      } else {
        typeNextSentenceOrSubmit();
      }
    }
  }