import { UserPreferenceModule } from "../prefs/PreferenceModule";
import { config } from "../ConfigModule";
import AudioControlsModule from "../audio/AudioControlsModule";
import { AudioStreamManager } from "./AudioStreamManager";
import { TextToSpeechService } from "./TextToSpeechService";
import EventBus from "../events/EventBus";
import { audioProviders } from "./SpeechModel";

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

interface SpeechSynthesisUtteranceRemote {
  /* based on SpeechSynthesisUtterance */
  id: string;
  text: string;
  lang: string;
  voice: SpeechSynthesisVoiceRemote;
  uri: string;
}

interface SpeechSynthesisVoiceRemote extends SpeechSynthesisVoice {
  id: string;
  price: number; // price per 1000 characters
  powered_by: string;
}

function getUtteranceURI(utterance: SpeechSynthesisUtteranceRemote): string {
  if (utterance.uri.includes("?")) {
    return utterance.uri;
  } else {
    return `${utterance.uri}?voice_id=${utterance.voice.id}&lang=${utterance.lang}`;
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
    this.initProvider();
  }

  initProvider(): void {
    const audioControls = new AudioControlsModule();
    this.isEnabled().then((enabled) => {
      if (enabled) {
        audioControls.useAudioOutputProvider(audioProviders.SayPi);
      } else {
        audioControls.useAudioOutputProvider(audioProviders.Pi);
      }
    });
  }

  private voicesCache: SpeechSynthesisVoiceRemote[] = [];
  /**
   * Visible only for testing
   * @param voices
   */
  _cacheVoices(voices: SpeechSynthesisVoiceRemote[]) {
    this.voicesCache = voices;
  }

  async getVoices(): Promise<SpeechSynthesisVoiceRemote[]> {
    if (this.voicesCache.length > 0) {
      return this.voicesCache;
    } else {
      this.voicesCache = await this.ttsService.getVoices();
      return this.voicesCache;
    }
  }

  async getVoiceById(id: string): Promise<SpeechSynthesisVoiceRemote> {
    const cachedVoice = this.voicesCache.find((voice) => voice.id === id);
    if (cachedVoice) {
      return cachedVoice;
    } else {
      return await this.ttsService.getVoiceById(id);
    }
  }

  async createSpeech(
    text: string,
    stream: boolean = false
  ): Promise<SpeechSynthesisUtteranceRemote> {
    const preferedVoice: SpeechSynthesisVoiceRemote | null =
      await this.userPreferences.getVoice();
    if (!preferedVoice) {
      throw new Error("No voice selected");
    }
    const preferedLang = await this.userPreferences.getLanguage();
    const uuid = generateUUID();
    return this.ttsService.createSpeech(
      uuid,
      text,
      preferedVoice,
      preferedLang,
      stream
    );
  }

  async createSpeechStream(): Promise<SpeechSynthesisUtteranceRemote> {
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

  async endSpeechStream(
    utterance: SpeechSynthesisUtteranceRemote
  ): Promise<void> {
    await this.audioStreamManager.endStream(utterance.id);
    // doesn't capture all stream ended cases (see audioStreamManager.endStream for more), but good enough for now
    EventBus.emit("saypi:tts:speechStreamEnded", utterance);
  }

  speak(utterance: SpeechSynthesisUtteranceRemote): void {
    // Start audio playback with utterance.uri as the audio source
    const audioSource = getUtteranceURI(utterance);
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

  async isEnabled(): Promise<boolean> {
    return await this.userPreferences.hasVoice();
  }
}

export {
  SpeechSynthesisUtteranceRemote,
  SpeechSynthesisVoiceRemote,
  SpeechSynthesisModule,
};
