import { config } from "../ConfigModule.js";
import { UtteranceCharge } from "../billing/BillingModule.js";
import { SpeechSynthesisUtteranceRemote } from "./SpeechSynthesisModule.js";

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

interface StreamedSpeech {
  utterance: SpeechSynthesisUtteranceRemote;
  charge?: UtteranceCharge;
}

export { audioProviders, AudioProvider, StreamedSpeech };
