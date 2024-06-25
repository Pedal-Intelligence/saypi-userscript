import { SpeechSynthesisVoiceRemote } from "../../src/tts/SpeechModel";

/*
 * This module provides a class for a voice that can be used with the SpeechSynthesisModule.
 * For a list of voices, or to retrieve a voice by its id, see SpeechSynthesisModule.ts
 */

class Voice {
  id: string;
  name: string;
  price: number; // price in USD per 1k characters
  powered_by: string; // name of the company providing the voice

  calculateCost(text: string): number {
    const numCharacters = text.length;
    const cost = (numCharacters / 1000) * this.price;
    return cost;
  }
}

class ElevenLabsVoice extends Voice implements SpeechSynthesisVoiceRemote {
  price: number = 0.3; // price in USD per 1k characters is fixed at 0.3
  powered_by: string = "ElevenLabs";
  lang: string = "en";

  constructor(id: string, name: string) {
    super();
    this.id = id;
    this.name = name;
  }
  default: boolean = false;
  localService: boolean = false;
  voiceURI: string = `https://api.saypi.ai/voices/${this.id}`;
}

const mockVoices: ElevenLabsVoice[] = [
  new ElevenLabsVoice("ig1TeITnnNlsJtfHxJlW", "Paola"),
];

export { ElevenLabsVoice, mockVoices };
