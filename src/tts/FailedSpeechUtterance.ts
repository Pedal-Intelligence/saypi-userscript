import { SpeechUtterance, SpeechSynthesisVoiceRemote, audioProviders } from "./SpeechModel";
import { SpeechFailureReason } from "./SpeechFailureReason";

export class FailedSpeechUtterance implements SpeechUtterance {
  readonly id: string;
  readonly lang: string;
  readonly voice: SpeechSynthesisVoiceRemote;
  /** no usable audio URL */
  readonly uri: string = "";
  readonly provider = audioProviders.SayPi;
  readonly kind = "failed" as const;

  constructor(
    uuid: string,
    lang: string,
    voice: SpeechSynthesisVoiceRemote,
    public readonly reason: SpeechFailureReason
  ) {
    this.id = uuid;
    this.lang = lang;
    this.voice = voice;
  }

  toString() {
    return `[failed utterance: ${this.reason}]`;
  }
} 