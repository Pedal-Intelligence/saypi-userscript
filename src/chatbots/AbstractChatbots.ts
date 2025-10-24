import { Chatbot, UserPrompt, SidebarConfig } from "./Chatbot";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import EventBus from "../events/EventBus";
import { shortenTranscript } from "../TextModule";
import { ImmersionStateChecker } from "../ImmersionServiceLite";
import { AssistantResponse, UserMessage } from "../dom/MessageElements";
import { VoiceSelector } from "../tts/VoiceMenu";
import type { ChatbotService } from "./ChatbotService";

export abstract class AbstractChatbot implements Chatbot {
    protected readonly preferences = UserPreferenceModule.getInstance();
    private assistantResponseCache = new WeakMap<HTMLElement, AssistantResponse>();
  
  
    public getCachedAssistantResponse(element: HTMLElement): AssistantResponse | undefined {
      return this.assistantResponseCache.get(element);
    }

    public clearCachedAssistantResponse(element: HTMLElement): boolean {
      return this.assistantResponseCache.delete(element);
    }

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
    
    abstract simulateFormSubmit(): boolean;
    abstract getSidebarConfig(sidePanel: HTMLElement): SidebarConfig | null;

    protected abstract createAssistantResponse(element: HTMLElement, includeInitialText?: boolean, isStreaming?: boolean): AssistantResponse;

    getAssistantResponse(element: HTMLElement, includeInitialText?: boolean, isStreaming?: boolean): AssistantResponse {
      if (this.assistantResponseCache.has(element)) {
        // TODO: Consider if includeInitialText should affect a cached instance.
        // For now, returning cached instance directly as per user agreement.
        // console.debug(`Cache hit for element (xpathHash: ${this.simpleHash(this.getElementXPath(element))}, utteranceId: ${element.dataset.utteranceId || "N/A"})`);
        return this.assistantResponseCache.get(element)!;
      }
      const newResponse = this.createAssistantResponse(element, includeInitialText, isStreaming);
      this.assistantResponseCache.set(element, newResponse);
      // console.debug(`Cache miss for element (xpathHash: ${this.simpleHash(this.getElementXPath(element))}, utteranceId: ${element.dataset.utteranceId || "N/A"})`);
      return newResponse;
    }
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
    async setFinal(
      transcript: string,
      isMaintainanceMessage?: boolean
    ): Promise<void> {
      const textarea = document.getElementById(
        "saypi-prompt"
      ) as HTMLTextAreaElement;

      let isFocused = document.activeElement === textarea;
      if (!isFocused) {
        textarea.readOnly = true;
      }

      // Add custom instruction for maintainance messages
      if (isMaintainanceMessage) {
        const { ChatbotService } = await import("./ChatbotService"); // lazy import ChatbotService to avoid circular dependency
        const chatbot = await ChatbotService.getChatbot();
        let preamble = "";
        const hasNickname = await chatbot.hasNickname();
        if (hasNickname) {
          const nickname = await chatbot.getNickname();
          const groupSuppressionInstruction = `Your nickname is ${nickname}. Respond only when addressed by your nickname. Stay in character. State your name when responding so that others know who is speaking. Do not respond to messages addressed to other people.`;
          preamble = groupSuppressionInstruction + "\n\n";
        }
        const internalMonologueInstruction =
          "This is a maintenance message to help you stay aware of the conversation. Your response will not be shown or heard by users. Process this information as internal thoughts, referring to speakers in the third person and maintaining empathy. Feel free to reflect on their situation and consider ways you might help, but keep these thoughts to yourself for now. Focus on understanding both the facts and emotions being shared.";
        const instruction = `<instruction>
${preamble}
${internalMonologueInstruction}
</instruction>`;

        // Only include instruction if it won't overflow the prompt
        const combinedLength = instruction.length + transcript.length;
        if (combinedLength <= this.PROMPT_CHARACTER_LIMIT - 10) {
          // 10 char buffer
          transcript = `${instruction}\n\n${transcript}`;
        }

        this.submitFinalTranscript(transcript, isFocused, textarea);
      } else {
        // If no nickname is set, just submit the transcript as is
        this.submitFinalTranscript(transcript, isFocused, textarea);
      }
    }

    private submitFinalTranscript(
      transcript: string,
      isFocused: boolean,
      textarea: HTMLTextAreaElement
    ): void {
      if (this.preferences.getCachedAutoSubmit()) {
        // overflowing the prompt textarea will cause the auto submit to fail
        const PROMPT_LIMIT_BUFFER = 10; // margin of error
        transcript = shortenTranscript(
          transcript,
          this.PROMPT_CHARACTER_LIMIT - PROMPT_LIMIT_BUFFER
        );
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
      // Avoid reading from the live DOM each frame; build locally to prevent duplication
      let typedSoFar = "";
      const typeNextSentenceOrSubmit = () => {
        if (sentences.length === 0) {
          if (submit) EventBus.emit("saypi:autoSubmit");
          return;
        }
        const nextSentence = sentences.shift() || "";
        typedSoFar += nextSentence;
        // Replace all content with the accumulated text to avoid racing with external edits
        this.setText(typedSoFar);
        requestAnimationFrame(typeNextSentenceOrSubmit);
      };
      if (sentences.length === 0) {
        this.enterTextAndSubmit(text, submit);
      } else {
        typeNextSentenceOrSubmit();
      }
    }
  }
