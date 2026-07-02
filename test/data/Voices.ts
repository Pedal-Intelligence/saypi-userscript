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
  gender?: string;
  accent?: string;
  description?: string;
  languages?: string[];

  constructor(id: string, name: string, gender?: string, accent?: string, description?: string, languages?: string[]) {
    super(id, name, 0.3, 1000, "ElevenLabs");
    this.gender = gender;
    this.accent = accent;
    this.description = description;
    this.languages = languages;
  }
  default: boolean = false;
  localService: boolean = false;
  voiceURI: string = `https://api.saypi.ai/voices/${this.id}`;
}

// Mirrors the saypi-api OpenAIVoice serialization (tts/models.py): value tier,
// 50 credits/1k, powered_by "OpenAI", lowercase id doubling as the provider
// voice name.
class OpenAIVoice extends Voice implements SpeechSynthesisVoiceRemote {
  lang: string = "en";
  gender?: string;
  accent?: string;
  description?: string;

  constructor(id: string, name: string, gender?: string, accent?: string, description?: string) {
    super(id, name, 0.015, 50, "OpenAI");
    this.gender = gender;
    this.accent = accent;
    this.description = description;
  }
  default: boolean = false;
  localService: boolean = false;
  voiceURI: string = `https://api.saypi.ai/voices/${this.id}`;
}

const mockVoices: ElevenLabsVoice[] = [
  new ElevenLabsVoice("ig1TeITnnNlsJtfHxJlW", "Paola"),
];

// The live Claude catalog (server order per saypi-api tts/claude.json).
const claudeMockVoices: ElevenLabsVoice[] = [
  new ElevenLabsVoice("c6SfcYrb2t09NHXiT80T", "Jarnathan", "M", "en-US", "Warm, versatile; confident and expressive."),
  new ElevenLabsVoice("gs0tAILXbY5DNrJrsM6F", "Jeff", "M", "en-US", "Classy and resonant."),
  new ElevenLabsVoice("1SM7GgM6IMuvQlz2BwM3", "Mark", "M", "en-US", "Casual and natural."),
  new ElevenLabsVoice("DTKMou8ccj1ZaWGBiotd", "Jamahal", "M", "en-US", "Chill, youthful; relaxed tone."),
  new ElevenLabsVoice("vBKc2FfBKJfcZNyEt1n6", "Finn", "M", "en-US", "Upbeat and friendly."),
  new ElevenLabsVoice("aMSt68OGf4xUZAnLpTU8", "Juniper", "F", "en-US", "Grounded and professional."),
  new ElevenLabsVoice("56AoDkrOh6qfVPDXZ7Pt", "Cassidy", "F", "en-US", "Confident with polished presence."),
  new ElevenLabsVoice("eR40ATw9ArzDf9h3v7t7", "Addison", "F", "en-AU", "Relaxed and easygoing."),
  new ElevenLabsVoice("g6xIsTj2HwM6VR4iXFCw", "Jessica", "F", "en-US", "Friendly and articulate."),
  new ElevenLabsVoice("lcMyyd2HUfFzxdCaC4Ta", "Lucy", "F", "en-GB", "Energetic, natural."),
];

// The 10 OpenAI voices served once OPENAI_TTS_ENABLED flips (saypi-api tts/voice.py).
const openAiMockVoices: OpenAIVoice[] = [
  new OpenAIVoice("alloy", "Alloy", "F", "en-US", "Warm, balanced and conversational"),
  new OpenAIVoice("ash", "Ash", "M", "en-US", "Clear and confident with an upbeat energy"),
  new OpenAIVoice("ballad", "Ballad", "M", "en-US", "Calm, melodic and expressive"),
  new OpenAIVoice("coral", "Coral", "F", "en-US", "Bright, friendly and animated"),
  new OpenAIVoice("echo", "Echo", "M", "en-US", "Measured and articulate"),
  new OpenAIVoice("fable", "Fable", "Other", "en-GB", "Story-telling tone with a British accent"),
  new OpenAIVoice("nova", "Nova", "F", "en-US", "Energetic, youthful and engaging"),
  new OpenAIVoice("onyx", "Onyx", "M", "en-US", "Deep, authoritative and resonant"),
  new OpenAIVoice("sage", "Sage", "F", "en-US", "Soft-spoken, thoughtful and soothing"),
  new OpenAIVoice("shimmer", "Shimmer", "F", "en-US", "Crisp, cheerful and expressive"),
];

export { ElevenLabsVoice, OpenAIVoice, mockVoices, claudeMockVoices, openAiMockVoices };
