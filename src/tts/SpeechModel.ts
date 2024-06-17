import { config } from "../ConfigModule.js";
import { UtteranceCharge } from "../billing/BillingModule.js";

const saypiAudioDomain = config.apiServerUrl
  ? new URL(config.apiServerUrl).hostname
  : "api.saypi.ai";

interface AudioProvider {
  name: string;
  domain: string;
  matches: (source: string) => boolean;
}

class BaseAudioProvider implements AudioProvider {
  name: string;
  domain: string;

  constructor(name: string, domain: string) {
    this.name = name;
    this.domain = domain;
  }

  matches(source: string): boolean {
    let domain: string;
    try {
      domain = new URL(source).hostname;
    } catch (_) {
      throw new Error(`Invalid source: ${source} is not a valid URL.`);
    }

    return domain === this.domain;
  }
}

const audioProviders = {
  SayPi: new BaseAudioProvider("Say, Pi", saypiAudioDomain),
  Pi: new BaseAudioProvider("Pi", "pi.ai"),
  // Add more providers as needed
};

interface SpeechUtterance {
  /* based on SpeechSynthesisUtterance */
  id: string;
  lang: string;
  voice: SpeechSynthesisVoiceRemote;
  uri: string;
  provider: AudioProvider;
}

class SayPiSpeech implements SpeechUtterance {
  id: string;
  lang: string;
  voice: SpeechSynthesisVoiceRemote;
  uri: string;
  provider: AudioProvider;

  constructor(
    id: string,
    lang: string,
    voice: SpeechSynthesisVoiceRemote,
    uri: string
  ) {
    this.id = id;
    this.lang = lang;
    this.voice = voice;
    this.uri = uri;
    this.provider = audioProviders.SayPi;
  }
}

class PiSpeech implements SpeechUtterance {
  id: string;
  lang: string;
  voice: SpeechSynthesisVoiceRemote;
  uri: string;
  provider: AudioProvider;

  constructor(
    id: string,
    lang: string,
    voice: SpeechSynthesisVoiceRemote,
    uri: string
  ) {
    this.id = id;
    this.lang = lang;
    this.voice = voice;
    this.uri = uri;
    this.provider = audioProviders.Pi;
  }
}

interface SpeechSynthesisVoiceRemote extends SpeechSynthesisVoice {
  id: string;
  price: number; // price per 1000 characters
  powered_by: string;
}

interface StreamedSpeech {
  utterance: SpeechUtterance;
  charge?: UtteranceCharge;
}

class AssistantSpeech implements StreamedSpeech {
  utterance: SpeechUtterance;
  charge?: UtteranceCharge;
  constructor(utterance: SpeechUtterance, charge?: UtteranceCharge) {
    this.utterance = utterance;
    this.charge = charge;
  }
}

export {
  audioProviders,
  AudioProvider,
  StreamedSpeech,
  AssistantSpeech,
  SpeechUtterance,
  SpeechSynthesisVoiceRemote,
  SayPiSpeech,
  PiSpeech,
};
