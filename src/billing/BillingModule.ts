import { md5 } from "js-md5";
import {
  SpeechSynthesisVoiceRemote,
  SpeechUtterance,
} from "../tts/SpeechModel";
import EventBus from "../events/EventBus";

export class UtteranceCharge {
  utteranceId: string;
  utteranceHash: string;
  cost: number;

  static none = {
    utteranceId: "", // empty string
    utteranceHash: md5(""), // hash of empty string
    cost: 0, // zero cost
  } as UtteranceCharge;

  static free(utterance: SpeechUtterance, text: string) {
    return new UtteranceCharge(utterance, 0, md5(text.trim()));
  }

  constructor(utterance: SpeechUtterance, cost: number, hash: string) {
    this.utteranceId = utterance.id;
    this.utteranceHash = hash;
    this.cost = cost;
  }
}

export class BillingModule {
  private static instance: BillingModule;
  private charges: number = 0;
  private utterances: UtteranceCharge[] = [];

  private constructor() {
    // Load charges and utterances from storage when instantiated
    chrome.storage.local.get(["charges", "utterances"], (data) => {
      // Billing is stored locally because it won't fit in sync storage (8KB limit per item)
      // TODO: Store billing data on the server with user accounts
      if (data.charges) {
        this.charges = data.charges;
      }
    });

    this.registerEventListeners();
  }

  static getInstance() {
    if (!BillingModule.instance) {
      BillingModule.instance = new BillingModule();
    }
    return BillingModule.instance;
  }

  registerEventListeners() {
    EventBus.on("saypi:piStoppedWriting", ({ utterance, text }) => {
      const charge = this.charge(utterance, text);
      EventBus.emit("saypi:billing:utteranceCharged", charge);
    });
  }

  quote(voice: SpeechSynthesisVoiceRemote, text: string): number {
    // Use price_per_thousand_chars_in_credits if available, otherwise fall back to price for backward compatibility
    const priceInCredits = voice.price_per_thousand_chars_in_credits;
    const cost = (text.length * priceInCredits) / 1000;
    return Math.round(cost);
  }

  charge(utterance: SpeechUtterance, text: string): UtteranceCharge {
    text = text.trim(); // strip leading/trailing whitespace introduced by createStream
    const cost = this.quote(utterance.voice, text);
    this.charges += cost;
    const charge = new UtteranceCharge(utterance, cost, md5(text));
    this.utterances.push(charge);

    // Save charges and utterances to storage after charging
    chrome.storage.local.set(
      {
        charges: this.charges,
        utterances: this.utterances,
      },
      () => {
        if (chrome.runtime.lastError) {
          // If storage limit is exceeded, remove the oldest utterance and try again
          this.utterances.shift();
          chrome.storage.local.set({
            charges: this.charges,
            utterances: this.utterances,
          });
        }
      }
    );
    return charge;
  }

  getTotalCharges(): number {
    return this.charges;
  }
}
