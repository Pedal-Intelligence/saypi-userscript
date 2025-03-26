import { SpeechSynthesisVoiceRemote } from "../../src/tts/SpeechModel";

/*
 * This module provides a class for a voice that can be used with the SpeechSynthesisModule.
 * For a list of voices, or to retrieve a voice by its id, see SpeechSynthesisModule.ts
 */

class Voice {
  id: string;
  name: string;
  price: number; // price in USD per 1k characters (legacy field)
  price_per_thousand_chars_in_usd: number; // price in USD per 1k characters
  price_per_thousand_chars_in_credits: number; // price in credits per 1k characters
  powered_by: string; // name of the company providing the voice

  constructor(id: string, name: string, priceUsd: number, priceCredits: number, poweredBy: string) {
    this.id = id;
    this.name = name;
    this.price = priceUsd; // legacy field
    this.price_per_thousand_chars_in_usd = priceUsd;
    this.price_per_thousand_chars_in_credits = priceCredits;
    this.powered_by = poweredBy;
  }

  calculateCost(text: string): number {
    const numCharacters = text.length;
    const costInCredits = (numCharacters / 1000) * this.price_per_thousand_chars_in_credits;
    return Math.round(costInCredits);
  }
}

class ElevenLabsVoice extends Voice implements SpeechSynthesisVoiceRemote {
  price: number = 0.3; // price in USD per 1k characters is fixed at 0.3 (legacy field)
  price_per_thousand_chars_in_usd: number = 0.3; // price in USD per 1k characters is fixed at 0.3
  price_per_thousand_chars_in_credits: number = 1000; // price in credits per 1k characters
  powered_by: string = "ElevenLabs";
  lang: string = "en";

  constructor(id: string, name: string) {
    super(id, name, 0.3, 1000, "ElevenLabs");
  }
  default: boolean = false;
  localService: boolean = false;
  voiceURI: string = `https://api.saypi.ai/voices/${this.id}`;
}

const mockVoices: ElevenLabsVoice[] = [
  new ElevenLabsVoice("ig1TeITnnNlsJtfHxJlW", "Paola"),
];

export { ElevenLabsVoice, mockVoices };
