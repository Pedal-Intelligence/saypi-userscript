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
  VoiceFactory
} from "./SpeechModel";
import { BillingModule, UtteranceCharge } from "../billing/BillingModule";
import { Chatbot } from "../chatbots/Chatbot";

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getUtteranceURI(speech: SpeechUtterance): string {
  if (speech.uri.includes("?")) {
    return speech.uri;
  } else {
    return `${speech.uri}?voice_id=${speech.voice.id}&lang=${speech.lang}`;
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

  private voicesCache: SpeechSynthesisVoiceRemote[] = [];
  private voicesLoading: Promise<void> | null = null;

  async getVoices(chatbot?: Chatbot): Promise<SpeechSynthesisVoiceRemote[]> {
    if (this.voicesCache.length > 0) {
      return this.voicesCache;
    }
    if (!this.voicesLoading) {
      this.voicesLoading = this.ttsService.getVoices(chatbot).then((voices) => {
        this.voicesCache = voices;
        this.voicesLoading = null;
      });
    }
    await this.voicesLoading;
    return this.voicesCache;
  }

  async getVoiceById(id: string): Promise<SpeechSynthesisVoiceRemote> {
    const voices = await this.getVoices(); // populate cache

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
  _cacheVoices(voices: SpeechSynthesisVoiceRemote[]) {
    this.voicesCache = voices;
  }

  async createSpeech(
    text: string,
    stream: boolean = false,
    lang?: string
  ): Promise<SpeechUtterance> {
    const preferedVoice: SpeechSynthesisVoiceRemote | null =
      await this.userPreferences.getVoice();
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
      stream
    );
  }

  async createSpeechPlaceholder(
    provider: AudioProvider
  ): Promise<SpeechUtterance> {
    const preferedLang = await this.userPreferences.getLanguage();
    return new SpeechPlaceholder(preferedLang, provider);
  }

  async createSpeechStreamOrPlaceholder(
    provider: AudioProvider
  ): Promise<SpeechUtterance> {
    if (provider === audioProviders.SayPi) {
      return this.createSpeechStream();
    } else {
      return this.createSpeechPlaceholder(provider);
    }
  }

  async createSpeechStream(): Promise<SpeechUtterance> {
    const preferedVoice: SpeechSynthesisVoiceRemote | null =
      await this.userPreferences.getVoice();
    if (!preferedVoice) {
      throw new Error("No voice selected");
    }
    const preferedLang = await this.userPreferences.getLanguage();
    const uuid = generateUUID();
    const utterance = this.audioStreamManager.createStream(
      uuid,
      preferedVoice,
      preferedLang
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

  speak(speech: SpeechUtterance): void {
    if (speech instanceof SpeechPlaceholder) {
      console.warn("Cannot speak a placeholder");
      return;
    }
    console.debug(`Speaking: ${speech.toString()}`);
    // Start audio playback with utterance.uri as the audio source
    const audioSource = getUtteranceURI(speech);
    EventBus.emit("audio:load", { url: audioSource }); // indirectly calls AudioModule.loadAudio
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
  async getActiveAudioProvider(): Promise<AudioProvider> {
    const customVoiceIsSelected = await this.userPreferences.hasVoice();
    if (customVoiceIsSelected) {
      // custom voice can be a multi-language voice by SayPi (e.g. Paola and Joey), or an "extra" voice by Pi (i.e. Pi 7 and Pi 8)
      const voice = await this.userPreferences.getVoice();
      return audioProviders.retreiveProviderByVoice(voice!); // voice is not null if customVoiceIsSelected is true
    }
    return audioProviders.Pi;
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

export {
  SpeechSynthesisModule,
  TextAddedEvent,
  TextChangedEvent,
  TextCompletedEvent,
  TextErrorEvent,
};
