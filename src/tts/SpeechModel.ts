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

function isPlaceholderUtterance(utterance: SpeechUtterance): boolean {
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
  // Pi's original voices, english only
  static voice1: SpeechSynthesisVoiceRemote = PiSpeechSourceParser.getVoice(
    "voice1",
    "en"
  );
  static voice2: SpeechSynthesisVoiceRemote = PiSpeechSourceParser.getVoice(
    "voice2",
    "en"
  );
  static voice3: SpeechSynthesisVoiceRemote = PiSpeechSourceParser.getVoice(
    "voice3",
    "en"
  );
  static voice4: SpeechSynthesisVoiceRemote = PiSpeechSourceParser.getVoice(
    "voice4",
    "en"
  );
  static voice5: SpeechSynthesisVoiceRemote = PiSpeechSourceParser.getVoice(
    "voice5",
    "en"
  );
  static voice6: SpeechSynthesisVoiceRemote = PiSpeechSourceParser.getVoice(
    "voice6",
    "en"
  );

  constructor(
    id: string,
    lang: string,
    voice: SpeechSynthesisVoiceRemote,
    uri: string
  ) {
    super(id, lang, voice, uri, audioProviders.Pi);
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
