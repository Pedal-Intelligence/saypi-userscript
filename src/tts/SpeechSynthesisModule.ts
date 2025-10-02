import { UserPreferenceModule } from "../prefs/PreferenceModule";
import { config } from "../ConfigModule";
import AudioControlsModule from "../audio/AudioControlsModule";
import { AudioStreamManager } from "./AudioStreamManager";
import { TextToSpeechService } from "./TextToSpeechService";
import EventBus from "../events/EventBus";
import {
  AudioProvider,
  SpeechUtterance,
  SpeechSynthesisVoiceRemote,
  audioProviders,
  SpeechPlaceholder,
  AIVoice,
  PiAIVoice,
  MatchableVoice,
  VoiceFactory,
  isFailedUtterance,
  isPlaceholderUtterance
} from "./SpeechModel";
import { BillingModule, UtteranceCharge } from "../billing/BillingModule";
import { Chatbot } from "../chatbots/Chatbot";
import { ChatbotIdentifier } from "../chatbots/ChatbotIdentifier";

const UNKNOWN_CHATBOT_CACHE_KEY = "__unknown__";

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

async function getUtteranceURI(speech: SpeechUtterance, appId?: string): Promise<string> {
  if (speech.uri.includes("?")) {
    return speech.uri;
  } else {
    // Use appId only if provided
    if (appId) {
      return `${speech.uri}?voice_id=${speech.voice.id}&lang=${speech.lang}&app=${appId}`;
    } else {
      return `${speech.uri}?voice_id=${speech.voice.id}&lang=${speech.lang}`;
    }
  }
}

class SpeechSynthesisModule {
  private static instance: SpeechSynthesisModule; // singleton instance

  public static getInstance(serviceUrl?: string): SpeechSynthesisModule {
    if (!SpeechSynthesisModule.instance) {
      const apiServerUrl = config.apiServerUrl;
      if (!apiServerUrl) {
        throw new Error("No API server URL defined. Check app configuration.");
      }
      const theServiceUrl = serviceUrl || apiServerUrl;
      const ttsService = new TextToSpeechService(theServiceUrl);

      const audioStreamManager = new AudioStreamManager(ttsService);
      const userPreferenceModule = UserPreferenceModule.getInstance();
      const billingModule = BillingModule.getInstance();

      SpeechSynthesisModule.instance = new SpeechSynthesisModule(
        ttsService,
        audioStreamManager,
        userPreferenceModule,
        billingModule
      );
    }
    return SpeechSynthesisModule.instance;
  }

  private ttsService: TextToSpeechService;
  private audioStreamManager: AudioStreamManager;
  private userPreferences: UserPreferenceModule;

  /**
   * This class uses the singleton pattern to ensure that only one instance is created.
   * Unless you're a unit test, you should use the static `getInstance` method to get the instance.
   * @param ttsService
   * @param audioStreamManager
   */
  constructor(
    ttsService: TextToSpeechService,
    audioStreamManager: AudioStreamManager,
    userPreferenceModule: UserPreferenceModule,
    private billingModule: BillingModule
  ) {
    this.ttsService = ttsService;
    this.audioStreamManager = audioStreamManager;
    this.userPreferences = userPreferenceModule;
    this.registerEventListeners();
    this.initProvider();
  }

  initProvider(): void {
    const audioControls = new AudioControlsModule();
    this.getActiveAudioProvider().then((provider) => {
      audioControls.notifyAudioProviderSelection(provider);
    });
  }

  private voicesCache: Map<string, SpeechSynthesisVoiceRemote[]> = new Map();
  private voicesLoading: Map<string, Promise<void>> = new Map();

  private resolveChatbotKey(chatbot?: Chatbot | string, override?: string): string | undefined {
    if (override) {
      return override;
    }
    if (typeof chatbot === "string") {
      return chatbot;
    }
    if (chatbot) {
      return chatbot.getID();
    }
    return ChatbotIdentifier.getAppId();
  }

  async getVoices(
    chatbot?: Chatbot | string,
    chatbotIdOverride?: string
  ): Promise<SpeechSynthesisVoiceRemote[]> {
    const appId = this.resolveChatbotKey(chatbot, chatbotIdOverride);
    const cacheKey = appId ?? UNKNOWN_CHATBOT_CACHE_KEY;
    const cached = this.voicesCache.get(cacheKey);
    if (cached && cached.length > 0) {
      return cached;
    }
    if (!this.voicesLoading.has(cacheKey)) {
      const loadPromise = this.ttsService
        .getVoices(typeof chatbot === "string" ? undefined : chatbot, appId)
        .then((voices) => {
          this.voicesCache.set(cacheKey, voices);
          this.voicesLoading.delete(cacheKey);
        })
        .catch((error) => {
          this.voicesLoading.delete(cacheKey);
          throw error;
        });
      this.voicesLoading.set(cacheKey, loadPromise);
    }
    await this.voicesLoading.get(cacheKey);
    return this.voicesCache.get(cacheKey) ?? [];
  }

  async getVoiceById(
    id: string,
    chatbot?: Chatbot | string,
    chatbotIdOverride?: string
  ): Promise<SpeechSynthesisVoiceRemote> {
    const voices = await this.getVoices(chatbot, chatbotIdOverride); // populate cache

    const foundVoice = voices.find((voice) => voice.id === id);
    if (!foundVoice) {
      throw new Error(`Voice with id ${id} not found`);
    }
    
    // Convert plain voice object to proper voice instance with methods
    if (foundVoice && !("matchesId" in foundVoice) && "powered_by" in foundVoice) {
      try {
        // Since AIVoice implements both MatchableVoice and SpeechSynthesisVoiceRemote,
        // the result from VoiceFactory will be compatible with both
        const matchableVoice = VoiceFactory.matchableFromVoiceRemote(foundVoice);
        // TypeScript needs reassurance that this is a SpeechSynthesisVoiceRemote
        return matchableVoice as unknown as SpeechSynthesisVoiceRemote;
      } catch (e) {
        console.error(`Error converting voice ${id} to matchable voice:`, e);
        // Return the plain object if conversion fails
        return foundVoice;
      }
    }
    
    return foundVoice;
  }

  /**
   * Visible only for testing
   * @param voices
   */
  _cacheVoices(voices: SpeechSynthesisVoiceRemote[], chatbotId?: string) {
    const appId = chatbotId ?? ChatbotIdentifier.getAppId();
    const cacheKey = appId ?? UNKNOWN_CHATBOT_CACHE_KEY;
    this.voicesCache.set(cacheKey, voices);
  }

  async createSpeech(
    text: string,
    stream: boolean = false,
    lang?: string,
    chatbot?: Chatbot
  ): Promise<SpeechUtterance> {
    const preferedVoice: SpeechSynthesisVoiceRemote | null =
      await this.userPreferences.getVoice(chatbot);
    if (!preferedVoice) {
      throw new Error("No voice selected");
    }
    const preferedLang = lang || (await this.userPreferences.getLanguage());
    const uuid = generateUUID();
    return this.ttsService.createSpeech(
      uuid,
      text,
      preferedVoice,
      preferedLang,
      stream,
      chatbot
    );
  }

  async createSpeechPlaceholder(
    provider: AudioProvider
  ): Promise<SpeechUtterance> {
    const preferedLang = await this.userPreferences.getLanguage();
    return new SpeechPlaceholder(preferedLang, provider);
  }

  async createSpeechStreamOrPlaceholder(
    provider: AudioProvider,
    chatbot?: Chatbot
  ): Promise<SpeechUtterance> {
    if (provider === audioProviders.SayPi) {
      return this.createSpeechStream(chatbot);
    } else {
      return this.createSpeechPlaceholder(provider);
    }
  }

  async createSpeechStream(chatbot?: Chatbot): Promise<SpeechUtterance> {
    const preferedVoice: SpeechSynthesisVoiceRemote | null =
      await this.userPreferences.getVoice(chatbot);
    if (!preferedVoice) {
      throw new Error("No voice selected");
    }
    const preferedLang = await this.userPreferences.getLanguage();
    const uuid = generateUUID();
    const utterance = this.audioStreamManager.createStream(
      uuid,
      preferedVoice,
      preferedLang,
      chatbot
    );

    return utterance;
  }

  async addSpeechToStream(uuid: string, text: string): Promise<void> {
    return await this.audioStreamManager.addSpeechToStream(uuid, text);
  }

  async replaceSpeechInStream(
    uuid: string,
    from: string,
    to: string
  ): Promise<boolean> {
    return await this.audioStreamManager.replaceSpeechInStream(uuid, from, to);
  }

  async endSpeechStream(utterance: SpeechUtterance): Promise<void> {
    await this.audioStreamManager.endStream(utterance.id);
    // doesn't capture all stream ended cases (see audioStreamManager.endStream for more), but good enough for now
    EventBus.emit("saypi:tts:speechStreamEnded", utterance);
  }

  speak(speech: SpeechUtterance, chatbot?: Chatbot): void {
    if (isPlaceholderUtterance(speech)) {
      console.warn("Cannot speak a placeholder");
      return;
    }
    if (isFailedUtterance(speech)) {
      console.warn(`Cannot speak a failed utterance: ${speech.toString()}`);
      return;
    }
    console.debug(`Speaking: ${speech.toString()}`);
    // Start audio playback with utterance.uri as the audio source
    const appId = chatbot ? chatbot.getID() : ChatbotIdentifier.getAppId();
    getUtteranceURI(speech, appId).then((uri) => {
      EventBus.emit("audio:load", { url: uri }); // indirectly calls AudioModule.loadAudio
    });
  }

  cancel(): Promise<void> {
    // nothing for now
    return Promise.resolve();
  }

  pause(): Promise<void> {
    // nothing for now
    return Promise.resolve();
  }

  resume(): Promise<void> {
    // nothing for now
    return Promise.resolve();
  }

  /**
   * Get the active audio provider based on user preferences
   * @returns {Promise<AudioProvider>}
   */
  async getActiveAudioProvider(chatbot?: Chatbot | string): Promise<AudioProvider> {
    const chatbotId = this.resolveChatbotKey(chatbot);

    if (!chatbotId) {
      return audioProviders.None;
    }

    if (chatbotId === "web") {
      return audioProviders.None;
    }

    const hasVoice = await this.userPreferences.hasVoice(chatbot ?? chatbotId);
    const voice = await this.userPreferences.getVoice(chatbot ?? chatbotId);
    if (hasVoice && voice) {
      return audioProviders.retreiveProviderByVoice(voice);
    }

    return audioProviders.getDefaultForChatbot(chatbotId);
  }

  private isStreamOpen(utteranceId: string): boolean {
    return this.audioStreamManager.isOpen(utteranceId);
  }

  private addSpeechToStreamIfOpen(utteranceId: string, text: string): void {
    if (this.isStreamOpen(utteranceId)) {
      this.addSpeechToStream(utteranceId, text);
    }
  }

  private replaceSpeechInStreamIfOpen(
    utteranceId: string,
    from: string,
    to: string
  ): Promise<boolean> {
    if (this.isStreamOpen(utteranceId)) {
      return this.replaceSpeechInStream(utteranceId, from, to);
    }
    return Promise.resolve(false);
  }

  private endSpeechStreamIfOpen(utterance: SpeechUtterance): void {
    if (this.isStreamOpen(utterance.id)) {
      this.endSpeechStream(utterance);
    }
  }

  registerEventListeners(): void {
    EventBus.on("saypi:tts:text:added", (text: TextAddedEvent) => {
      this.addSpeechToStreamIfOpen(text.utterance.id, text.text);
    });
    EventBus.on("saypi:tts:text:changed", (text: TextChangedEvent) => {
      this.replaceSpeechInStreamIfOpen(
        text.utterance.id,
        text.changedFrom!,
        text.text
      ).then((replaced) => {
        if (replaced) {
          console.debug(
            `Replaced text in stream: "${text.changedFrom}" -> "${text.text}"`
          );
        } else {
          console.warn(
            `Failed to replace text in stream before being flushed: "${text.changedFrom}" -> "${text.text}"`
          );
          EventBus.emit("saypi:tts:text:error", {
            text: text.text,
            utterance: text.utterance,
          });
        }
      });
    });
    EventBus.on("saypi:tts:text:completed", (text: TextCompletedEvent) => {
      this.endSpeechStreamIfOpen(text.utterance);
    });
    EventBus.on(
      "saypi:tts:tool-use:start",
      (event: ToolUseKeepAliveEvent) => {
        this.audioStreamManager.startKeepAlive(event.utterance.id, event.toolName);
      }
    );
    EventBus.on(
      "saypi:tts:tool-use:end",
      (event: ToolUseKeepAliveEvent) => {
        this.audioStreamManager.stopKeepAlive(event.utterance.id);
      }
    );
  }
}

type TextAddedEvent = {
  text: string;
  utterance: SpeechUtterance;
};
type TextChangedEvent = {
  changedFrom: string;
  text: string;
  utterance: SpeechUtterance;
};
type TextCompletedEvent = {
  text: string;
  utterance: SpeechUtterance;
};
type TextErrorEvent = {
  error: any;
  utterance: SpeechUtterance;
};

type ToolUseKeepAliveEvent = {
  utterance: SpeechUtterance;
  toolName?: string;
  element?: Element | null;
};

export {
  SpeechSynthesisModule,
  TextAddedEvent,
  TextChangedEvent,
  TextCompletedEvent,
  TextErrorEvent,
};
