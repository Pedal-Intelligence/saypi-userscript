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
  VoiceFactory,
  isFailedUtterance,
  isPlaceholderUtterance
} from "./SpeechModel";
import { BillingModule } from "../billing/BillingModule";
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

      // Load-bearing side effect — do NOT remove. Eagerly constructs the
      // BillingModule singleton so its `saypi:piStoppedWriting` charge listener
      // is registered at bootstrap, before the first conversation turn. This
      // module is instantiated early (ChatHistoryManager / TTSControlsModule /
      // AudioOutputMachine); the lazy BillingModule.getInstance() calls in
      // MessageElements run too late for the streaming charge path.
      BillingModule.getInstance();

      SpeechSynthesisModule.instance = new SpeechSynthesisModule(
        ttsService,
        audioStreamManager,
        userPreferenceModule
      );
    }
    return SpeechSynthesisModule.instance;
  }

  private ttsService: TextToSpeechService;
  private audioStreamManager: AudioStreamManager;
  private userPreferences: UserPreferenceModule;
  private activeStreamsByMessageId: Map<string, SpeechUtterance> = new Map();
  private messageIdByUtteranceId: Map<string, string> = new Map();

  /**
   * This class uses the singleton pattern to ensure that only one instance is created.
   * Unless you're a unit test, you should use the static `getInstance` method to get the instance.
   * @param ttsService
   * @param audioStreamManager
   */
  constructor(
    ttsService: TextToSpeechService,
    audioStreamManager: AudioStreamManager,
    userPreferenceModule: UserPreferenceModule
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
    provider: AudioProvider,
    _messageId?: string
  ): Promise<SpeechUtterance> {
    const preferedLang = await this.userPreferences.getLanguage();
    return new SpeechPlaceholder(preferedLang, provider);
  }

  async createSpeechStreamOrPlaceholder(
    provider: AudioProvider,
    chatbot?: Chatbot,
    messageId?: string
  ): Promise<SpeechUtterance> {
    if (provider === audioProviders.SayPi) {
      return this.createSpeechStream(chatbot, messageId);
    } else {
      return this.createSpeechPlaceholder(provider, messageId);
    }
  }

  async createSpeechStream(
    chatbot?: Chatbot,
    messageId?: string
  ): Promise<SpeechUtterance> {
    if (messageId) {
      const existing = this.activeStreamsByMessageId.get(messageId);
      if (existing) {
        if (this.audioStreamManager.isOpen(existing.id)) {
          return existing;
        }
        this.activeStreamsByMessageId.delete(messageId);
        this.messageIdByUtteranceId.delete(existing.id);
      }
    }

    const preferedVoice: SpeechSynthesisVoiceRemote | null =
      await this.userPreferences.getVoice(chatbot);
    const preferedLang = await this.userPreferences.getLanguage();
    if (!preferedVoice) {
      // Voice off, or the voice was cleared between the provider check and here
      // (a race when toggling voice mid-response): degrade to a silent placeholder
      // rather than throwing. The auto-TTS path must treat "no voice" as a no-op,
      // not an uncaught rejection that aborts message decoration / submission.
      return new SpeechPlaceholder(preferedLang, audioProviders.None);
    }
    const uuid = generateUUID();
    const utterance = await this.audioStreamManager.createStream(
      uuid,
      preferedVoice,
      preferedLang,
      chatbot
    );

    if (messageId) {
      this.activeStreamsByMessageId.set(messageId, utterance);
      this.messageIdByUtteranceId.set(utterance.id, messageId);
    }

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
    const messageId = this.messageIdByUtteranceId.get(utterance.id);
    if (messageId) {
      this.activeStreamsByMessageId.delete(messageId);
      this.messageIdByUtteranceId.delete(utterance.id);
    }
    await this.audioStreamManager.endStream(utterance.id);
    // doesn't capture all stream ended cases (see audioStreamManager.endStream for more), but good enough for now
    EventBus.emit("saypi:tts:speechStreamEnded", utterance);
  }

  /**
   * Synthesize a known-complete string (e.g. a voice-selection introduction) as a
   * single, fully-finalized speech stream, ready to hand to `speak()`.
   *
   * Uses the SAME streaming contract as conversation-turn TTS — open the stream
   * (POST), send the full text (PUT), finalize (PUT final-chunk) — so the resulting
   * `…/speak/<id>/stream` source plays through the audio-output path. (#375)
   *
   * Why not the simpler calls: `createSpeech(text, false)` yields a non-streaming
   * `…/speak/<id>` URL that the source parser rejects ("is not a streaming speech
   * URL"); `createSpeech(text, true)` opens a stream URL the parser accepts but never
   * sends the text via the PUT-chunk protocol, so the audio GET returns 405 and
   * nothing plays. Both leave the intro silent.
   *
   * Returns a silent placeholder/failed utterance unchanged when voice is off or
   * synthesis can't start (no text is sent, nothing to finalize).
   */
  async createCompletedSpeechStream(
    text: string,
    chatbot?: Chatbot
  ): Promise<SpeechUtterance> {
    const utterance = await this.createSpeechStream(chatbot);
    if (isPlaceholderUtterance(utterance) || isFailedUtterance(utterance)) {
      return utterance;
    }
    await this.addSpeechToStream(utterance.id, text);
    await this.endSpeechStream(utterance);
    return utterance;
  }

  speak(speech: SpeechUtterance, chatbot?: Chatbot): void {
    if (isPlaceholderUtterance(speech)) {
      // Expected whenever voice is off (the auto-TTS path yields a placeholder):
      // a no-op, not a warning. Debug-level so it doesn't spam the console
      // on every voice-off turn. See #241.
      console.debug("Skipping speak for placeholder utterance (voice off)");
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

    const preferenceScope = chatbot ?? chatbotId;
    const voice = await this.userPreferences.getVoice(preferenceScope);
    if (voice) {
      return audioProviders.retreiveProviderByVoice(voice);
    }

    const defaultProvider = audioProviders.getDefaultForChatbot(chatbotId);
    if (defaultProvider === audioProviders.SayPi) {
      return audioProviders.None;
    }

    return defaultProvider;
  }

  private isStreamOpen(utteranceId: string): boolean {
    return this.audioStreamManager.isOpen(utteranceId);
  }

  private addSpeechToStreamIfOpen(utteranceId: string, text: string): void {
    // An empty string is InputBuffer's end-of-speech sentinel
    // (END_OF_SPEECH_MARKER): appending it to an open stream closes the stream.
    // A non-final empty text:added is never legitimate (real end-of-speech flows
    // through endSpeechStream), so drop it here — otherwise ChatGPT's empty
    // writing-started marker (#399) would silently end the stream and swallow
    // the rest of the reply for a SayPi-voice-on-ChatGPT user.
    if (!text) return;
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
    // The voice list is auth-dependent (401 → [], plus per-user custom voices),
    // so invalidate the cache on sign-out / sign-in / account switch. The
    // VoiceSelector re-renders on this same event and refetches, landing in
    // the correct state for the new auth state (#456).
    EventBus.on("saypi:auth:status-changed", () => {
      this.voicesCache.clear();
      this.voicesLoading.clear();
    });
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
