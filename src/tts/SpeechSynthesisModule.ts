import axios from "axios";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import { config } from "../ConfigModule";
import AudioControlsModule from "../audio/AudioControlsModule";

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
  return `${utterance.uri}?voice_id=${utterance.voice.id}`;
}

class SpeechSynthesisModule {
  private static instance: SpeechSynthesisModule; // singleton instance

  public static getInstance(serviceUrl?: string): SpeechSynthesisModule {
    if (!SpeechSynthesisModule.instance) {
      SpeechSynthesisModule.instance = new SpeechSynthesisModule(serviceUrl);
    }
    return SpeechSynthesisModule.instance;
  }

  private serviceUrl: string;
  private audio: HTMLAudioElement;

  // private constructor to enforce singleton pattern
  private constructor(serviceUrl?: string) {
    const apiServerUrl = config.apiServerUrl;
    if (!apiServerUrl) {
      throw new Error("No API server URL defined. Check app configuration.");
    }
    this.serviceUrl = serviceUrl || apiServerUrl;
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

  async getVoices(): Promise<SpeechSynthesisVoiceRemote[]> {
    if (this.voicesCache.length > 0) {
      return this.voicesCache;
    } else {
      const response = await axios.get(`${this.serviceUrl}/voices`);
      this.voicesCache = response.data;
      return this.voicesCache;
    }
  }

  async getVoiceById(id: string): Promise<SpeechSynthesisVoiceRemote> {
    const cachedVoice = this.voicesCache.find((voice) => voice.id === id);
    if (cachedVoice) {
      return cachedVoice;
    } else {
      const response = await axios.get(`${this.serviceUrl}/voices/${id}`);
      return response.data;
    }
  }

  async createSpeech(
    text: string,
    stream: boolean = false
  ): Promise<SpeechSynthesisUtteranceRemote> {
    const preferedVoice: SpeechSynthesisVoiceRemote | null =
      await UserPreferenceModule.getVoice();
    if (!preferedVoice) {
      throw new Error("No voice selected");
    }
    const preferedLang = await UserPreferenceModule.getLanguage();
    const uuid = generateUUID();
    // data should include the voice id and the text to be synthesized
    const data = { voice: preferedVoice.id, text: text, lang: preferedLang };
    const baseUri = `${this.serviceUrl}/speak/${uuid}`;
    const uri = stream ? `${baseUri}/stream` : `${baseUri}`;
    const utterance: SpeechSynthesisUtteranceRemote = {
      id: uuid,
      text: text,
      lang: preferedLang,
      voice: preferedVoice,
      uri: uri,
    };
    return axios.post(uri, data).then((response) => {
      if (![200, 201].includes(response.status)) {
        throw new Error("Failed to synthesize speech");
      }
      return utterance;
    });
  }

  private speechStreamTimeouts: { [uuid: string]: NodeJS.Timeout } = {};
  private START_OF_SPEECH_MARKER = "Well now."; // In the first message, the text should be a space " " to indicate the start of speech
  private END_OF_SPEECH_MARKER = ""; // In the last message, the text should be an empty string to indicate the end of speech

  async createSpeechStream(): Promise<SpeechSynthesisUtteranceRemote> {
    const utterance = await this.createSpeech(
      this.START_OF_SPEECH_MARKER,
      true
    );

    // Start a timeout that will end the stream if not reset in 10 seconds
    this.speechStreamTimeouts[utterance.id] = setTimeout(() => {
      this.endSpeechStream(utterance.id);
    }, 10000);

    return utterance;
  }

  private speechBuffers: { [uuid: string]: string } = {};
  private speechBufferTimeouts: { [uuid: string]: NodeJS.Timeout } = {};

  async addSpeechToStream(uuid: string, text: string): Promise<void> {
    // Add text to buffer
    if (!this.speechBuffers[uuid]) {
      this.speechBuffers[uuid] = "";
    }
    this.speechBuffers[uuid] += text;

    // Send buffer if text ends with a sentence break
    if ([".", "!", "?"].some((end) => text.endsWith(end))) {
      await this.sendBuffer(uuid);
    }

    // Set/reset timeout to send buffer after 5 seconds
    if (this.speechBufferTimeouts[uuid]) {
      clearTimeout(this.speechBufferTimeouts[uuid]);
    }
    this.speechBufferTimeouts[uuid] = setTimeout(() => {
      this.sendBuffer(uuid);
    }, 5000);
  }

  private async sendBuffer(uuid: string): Promise<void> {
    const data = { text: this.speechBuffers[uuid] };
    const uri = `${this.serviceUrl}/speak/${uuid}/stream`;
    const response = await axios.put(uri, data);
    if (response.status !== 200) {
      throw new Error("Failed to stream input text to speech");
    }

    // Clear buffer
    this.speechBuffers[uuid] = "";

    // Reset the timeout
    if (this.speechStreamTimeouts[uuid]) {
      clearTimeout(this.speechStreamTimeouts[uuid]);
      this.speechStreamTimeouts[uuid] = setTimeout(() => {
        this.endSpeechStream(uuid);
      }, 10000);
    }
  }

  async endSpeechStream(uuid: string): Promise<void> {
    // Clear the timeout
    if (this.speechStreamTimeouts[uuid]) {
      clearTimeout(this.speechStreamTimeouts[uuid]);
      delete this.speechStreamTimeouts[uuid];
      console.log("Ending speech stream");
      this.addSpeechToStream(uuid, this.END_OF_SPEECH_MARKER);
    } else {
      console.log("Speech stream already ended");
    }
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
    // tts is enabled only for non-English languages where a custom voice is selected
    return await UserPreferenceModule.hasVoice();
  }
}

export {
  SpeechSynthesisUtteranceRemote,
  SpeechSynthesisVoiceRemote,
  SpeechSynthesisModule,
};
