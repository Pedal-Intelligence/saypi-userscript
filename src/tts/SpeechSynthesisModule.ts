import axios from "axios";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import { config } from "../ConfigModule";

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

interface SpeechSynthesisVoiceRemote {
  /* based on SpeechSynthesisVoice */
  id: string;
  name: string;
}

class SpeechSynthesisModule {
  private serviceUrl: string;
  private audio: HTMLAudioElement;

  constructor(serviceUrl?: string) {
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
  }

  private voicesCache: SpeechSynthesisVoiceRemote[] = [];

  getVoices(): Promise<SpeechSynthesisVoiceRemote[]> {
    if (this.voicesCache.length > 0) {
      return Promise.resolve(this.voicesCache);
    } else {
      return axios.get(`${this.serviceUrl}/voices`).then((response) => {
        this.voicesCache = response.data;
        return this.voicesCache;
      });
    }
  }

  getVoiceById(id: string): Promise<SpeechSynthesisVoiceRemote> {
    const cachedVoice = this.voicesCache.find((voice) => voice.id === id);
    if (cachedVoice) {
      return Promise.resolve(cachedVoice);
    } else {
      return axios
        .get(`${this.serviceUrl}/voices/${id}`)
        .then((response) => response.data);
    }
  }

  async createSpeech(text: string): Promise<SpeechSynthesisUtteranceRemote> {
    const preferedVoice: SpeechSynthesisVoiceRemote | null =
      await UserPreferenceModule.getPreferedVoice();
    if (!preferedVoice) {
      throw new Error("No voice selected");
    }
    const preferedLang = await UserPreferenceModule.getLanguage();
    const uuid = generateUUID();
    // data should include the voice id and the text to be synthesized
    const data = { voice: preferedVoice.id, text: text, lang: preferedLang };
    const uri = `${this.serviceUrl}/speak/${uuid}`;
    const utterance: SpeechSynthesisUtteranceRemote = {
      id: uuid,
      text: text,
      lang: preferedLang,
      voice: preferedVoice,
      uri: uri,
    };
    return axios.post(uri, data).then((response) => {
      if (response.status !== 201) {
        throw new Error("Failed to synthesize speech");
      }
      return utterance;
    });
  }

  speak(utterance: SpeechSynthesisUtteranceRemote): Promise<void> {
    // start audio playback with utterance.uri as the audio source
    this.audio.src = utterance.uri;
    this.audio.play();
    return Promise.resolve();
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
}

export {
  SpeechSynthesisUtteranceRemote,
  SpeechSynthesisVoiceRemote,
  SpeechSynthesisModule,
};
