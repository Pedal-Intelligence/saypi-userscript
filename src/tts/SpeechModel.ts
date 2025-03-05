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

  // function to get the provider from the text to speech engine name
  retrieveProviderByEngine: (powered_by: string): AudioProvider => {
    switch (powered_by) {
      case "ElevenLabs":
        return audioProviders.SayPi;
      case "inflection.ai":
        return audioProviders.Pi;
      default:
        throw new Error(`Provider powered by ${powered_by} not found.`);
    }
  },
  retreiveProviderByVoice: (
    voice: SpeechSynthesisVoiceRemote
  ): AudioProvider => {
    return audioProviders.retrieveProviderByEngine(voice.powered_by);
  },
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
  price_per_thousand_chars_in_usd: 0,
  price_per_thousand_chars_in_credits: 0,
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
  price: number; // price per 1000 characters (legacy field)
  price_per_thousand_chars_in_usd: number; // price in USD per 1k characters
  price_per_thousand_chars_in_credits: number; // price in credits per 1k characters
  powered_by: string;
}

interface MatchableVoice {
  matchesSource(source: string): boolean;
  matchesId(id: string): boolean;
}

class VoiceFactory {
  static matchableFromVoiceRemote(
    v: SpeechSynthesisVoiceRemote
  ): MatchableVoice {
    const provider = audioProviders.retrieveProviderByEngine(v.powered_by);
    switch (provider) {
      case audioProviders.SayPi:
        return new SayPiVoice(v.id, v.lang, v, v.voiceURI);
      case audioProviders.Pi:
        return PiAIVoice.fromVoice(v);
      default:
        throw new Error(`Provider ${provider.name} not found.`);
    }
  }
}

abstract class AIVoice implements SpeechSynthesisVoiceRemote, MatchableVoice {
  id: string;
  price: number;
  price_per_thousand_chars_in_usd: number;
  price_per_thousand_chars_in_credits: number;
  powered_by: string;
  default: boolean;
  lang: string;
  localService: boolean;
  name: string;
  voiceURI: string;
  constructor(
    id: string,
    name: string,
    lang: string,
    price: number,
    price_per_thousand_chars_in_usd: number,
    price_per_thousand_chars_in_credits: number,
    powered_by: string,
    defaultVoice: boolean,
    localService: boolean,
    voiceURI: string
  ) {
    this.id = id;
    this.name = name;
    this.lang = lang;
    this.price = price;
    this.price_per_thousand_chars_in_usd = price_per_thousand_chars_in_usd;
    this.price_per_thousand_chars_in_credits = price_per_thousand_chars_in_credits;
    this.powered_by = powered_by;
    this.default = defaultVoice;
    this.localService = localService;
    this.voiceURI = voiceURI;
  }
  matchesSource(source: string): boolean {
    throw new Error("Method not implemented.");
  }
  matchesId(id: string): boolean {
    return id === this.id;
  }
}

class PiAIVoice extends AIVoice {
  constructor(voiceNumber: number) {
    super(
      `voice${voiceNumber}`,
      `Pi ${voiceNumber}`,
      "en",
      0,
      0,
      0,
      "inflection.ai",
      false,
      false,
      ""
    );
  }

  matchesSource(source: string): boolean {
    const url = new URL(source);
    const voiceId = url.searchParams.get("voice");
    const matchingSpeechRequest = voiceId === this.id;

    // or source is an introduction speech of the type https://pi.ai/public/media/voice-previews/voice-8.mp3
    const voiceNumber = Number(this.id.slice(-1));
    const matchingIntroSpeech = source.endsWith(`voice-${voiceNumber}.mp3`);

    return matchingSpeechRequest || matchingIntroSpeech;
  }

  static fromVoice(v: SpeechSynthesisVoiceRemote): PiAIVoice {
    const voiceNumber = Number(v.id.slice(-1));
    return new PiAIVoice(voiceNumber);
  }
  static isPiVoiceId(voiceId: string): boolean {
    return voiceId.startsWith("voice");
  }
  static fromVoiceId(voiceId: string): PiAIVoice {
    // defense against invalid voiceId
    if (!PiAIVoice.isPiVoiceId(voiceId)) {
      throw new Error(`Invalid voice id: ${voiceId}`);
    }
    const voiceNumber = Number(voiceId.slice(-1));
    return new PiAIVoice(voiceNumber);
  }
}

class SayPiVoice extends AIVoice {
  constructor(
    id: string,
    lang: string,
    voice: SpeechSynthesisVoiceRemote,
    uri: string
  ) {
    super(
      id,
      voice.name,
      lang,
      voice.price,
      voice.price_per_thousand_chars_in_usd,
      voice.price_per_thousand_chars_in_credits,
      voice.powered_by,
      voice.default,
      voice.localService,
      uri
    );
  }

  matchesSource(source: string): boolean {
    // voice_id query parameter in the URL should match the voice id
    const url = new URL(source);
    const voiceId = url.searchParams.get("voice_id");
    return voiceId === this.id;
  }
}

class ChangeVoiceEvent {
  voice: MatchableVoice | null;

  constructor(voice: MatchableVoice | null) {
    this.voice = voice;
  }
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
  MatchableVoice,
  VoiceFactory,
  AIVoice,
  PiAIVoice,
  ChangeVoiceEvent,
  SpeechPlaceholder,
  SayPiSpeech,
  PiSpeech,
  isPlaceholderUtterance,
  UtteranceFactory,
};
