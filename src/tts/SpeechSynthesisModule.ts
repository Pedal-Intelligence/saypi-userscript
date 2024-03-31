import { UserPreferenceModule } from "../prefs/PreferenceModule";
import { config } from "../ConfigModule";
import AudioControlsModule from "../audio/AudioControlsModule";
import { AudioStreamManager } from "./AudioStreamManager";
import { TextToSpeechService } from "./TextToSpeechService";

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
  private audio: HTMLAudioElement;
  private audioStreamManager: AudioStreamManager;
  private userPreferenceModule: UserPreferenceModule;

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
    this.userPreferenceModule = userPreferenceModule;

    this.audio = document.querySelector("audio") as HTMLAudioElement;
    if (!this.audio) {
      this.audio = document.createElement("audio");
      this.audio.id = "saypi-audio";
      document.body.appendChild(this.audio);
    }
    this.initProvider();
  }

  initProvider(): void {
    const audioControls = new AudioControlsModule();
    this.isEnabled().then((enabled) => {
      if (enabled) {
        audioControls.useSayPiForAudioOutput();
      } else {
        audioControls.useDefaultForAudioOutput();
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
      await this.userPreferenceModule.getVoice();
    if (!preferedVoice) {
      throw new Error("No voice selected");
    }
    const preferedLang = await this.userPreferenceModule.getLanguage();
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
      await this.userPreferenceModule.getVoice();
    if (!preferedVoice) {
      throw new Error("No voice selected");
    }
    const preferedLang = await this.userPreferenceModule.getLanguage();
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

  async endSpeechStream(uuid: string): Promise<void> {
    return await this.audioStreamManager.endStream(uuid);
  }

  speak(utterance: SpeechSynthesisUtteranceRemote): Promise<void> {
    return new Promise((resolve, reject) => {
      // Error handling
      this.audio.onerror = (event) => {
        console.error("Error in audio playback", event);
        reject(new Error(`Error playing audio from ${utterance.uri}`));
      };

      // Handle successful loading and playing of the audio
      this.audio.onloadeddata = () => {
        const endtime = Date.now();
        const elapsedtime = (endtime - starttime) / 1000;
        console.log(
          `Audio is loaded after ${elapsedtime}s from ${utterance.uri}`
        );
      };

      this.audio.oncanplay = () => {
        const endtime = Date.now();
        const elapsedtime = (endtime - starttime) / 1000;
        console.log(
          `Audio is ready to play after ${elapsedtime}s from ${utterance.uri}`
        );
        if (this.audio.paused) {
          this.audio.play().then(resolve).catch(reject);
        }
      };

      this.audio.oncanplaythrough = () => {
        const endtime = Date.now();
        const elapsedtime = (endtime - starttime) / 1000;
        console.log(
          `Audio is ready to play through after ${elapsedtime}s from ${utterance.uri}`
        );
        if (this.audio.paused) {
          //this.audio.play().then(resolve).catch(reject);
        }
      };

      // Handle audio playback completion
      this.audio.onended = () => {
        const endtime = Date.now();
        const elapsedtime = (endtime - starttime) / 1000;
        console.log(`Audio playback ended after ${elapsedtime}s`);
        resolve();
      };

      // Start audio playback with utterance.uri as the audio source
      this.audio.src = getUtteranceURI(utterance);
      const starttime = Date.now();
      //this.audio.play().catch(reject);
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

  async isEnabled(): Promise<boolean> {
    return await this.userPreferenceModule.hasVoice();
  }
}

export {
  SpeechSynthesisUtteranceRemote,
  SpeechSynthesisVoiceRemote,
  SpeechSynthesisModule,
};
