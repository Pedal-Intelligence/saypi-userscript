import { config } from "../ConfigModule.js";
import { UtteranceCharge } from "../billing/BillingModule";
import { PiSpeechSourceParser } from "./SpeechSourceParsers";

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
  toString(): string;
}

class BaseSpeechUtterance implements SpeechUtterance {
  id: string;
  lang: string;
  voice: SpeechSynthesisVoiceRemote;
  uri: string;
  provider: AudioProvider;

  constructor(
    id: string,
    lang: string,
    voice: SpeechSynthesisVoiceRemote,
    uri: string,
    provider: AudioProvider
  ) {
    this.id = id;
    this.lang = lang;
    this.voice = voice;
    this.uri = uri;
    this.provider = provider;
  }

  toString(): string {
    return `Speech: { Voice: ${this.voice.name}, ID: ${this.id} }`;
  }

  static fromPlainObject(obj: any): BaseSpeechUtterance {
    return new BaseSpeechUtterance(
      obj.id,
      obj.lang,
      obj.voice,
      obj.uri,
      obj.provider
    );
  }
}

const placeholderVoice: SpeechSynthesisVoiceRemote = {
  id: "unassigned",
  lang: "en",
  price: 0,
  powered_by: "unassigned",
  default: false,
  localService: false,
  name: "Placeholder Voice",
  voiceURI: "",
};

function isPlaceholderUtterance(utterance: SpeechUtterance | string): boolean {
  if (typeof utterance === "string") {
    return utterance.startsWith("placeholder-");
  }
  return utterance instanceof SpeechPlaceholder;
}

class SpeechPlaceholder extends BaseSpeechUtterance {
  constructor(lang: string, provider: AudioProvider) {
    super(
      "placeholder-" + Math.random().toString(36).substr(2, 9),
      lang,
      placeholderVoice,
      "",
      provider
    );
  }

  fromPlainObject(obj: any): SpeechPlaceholder {
    return new SpeechPlaceholder(obj.lang, obj.provider);
  }
}

class SayPiSpeech extends BaseSpeechUtterance {
  constructor(
    id: string,
    lang: string,
    voice: SpeechSynthesisVoiceRemote,
    uri: string
  ) {
    super(id, lang, voice, uri, audioProviders.SayPi);
  }

  fromPlainObject(obj: any): SayPiSpeech {
    return new SayPiSpeech(obj.id, obj.lang, obj.voice, obj.uri);
  }
}

class PiSpeech extends BaseSpeechUtterance {
  // contains all the original voices available for Pi
  static voices: { [key: string]: SpeechSynthesisVoiceRemote } = {};

  constructor(
    id: string,
    lang: string,
    voice: SpeechSynthesisVoiceRemote,
    uri: string
  ) {
    super(id, lang, voice, uri, audioProviders.Pi);
  }

  static initializeVoices(parser: PiSpeechSourceParser) {
    PiSpeech.voices.voice1 = parser.getVoice("voice1");
    PiSpeech.voices.voice2 = parser.getVoice("voice2");
    PiSpeech.voices.voice3 = parser.getVoice("voice3");
    PiSpeech.voices.voice4 = parser.getVoice("voice4");
    PiSpeech.voices.voice5 = parser.getVoice("voice5");
    PiSpeech.voices.voice6 = parser.getVoice("voice6");
  }

  fromPlainObject(obj: any): PiSpeech {
    return new PiSpeech(obj.id, obj.lang, obj.voice, obj.uri);
  }
}

class UtteranceFactory {
  static createUtterance(obj: any): BaseSpeechUtterance {
    switch (obj.provider.name) {
      case "Say, Pi":
        return SayPiSpeech.fromPlainObject(obj);
      case "Pi":
        return PiSpeech.fromPlainObject(obj);
      default:
        return BaseSpeechUtterance.fromPlainObject(obj);
    }
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
  SpeechPlaceholder,
  SayPiSpeech,
  PiSpeech,
  isPlaceholderUtterance,
  UtteranceFactory,
};
