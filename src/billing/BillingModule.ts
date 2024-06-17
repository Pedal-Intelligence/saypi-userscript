import { md5 } from "js-md5";
import { SpeechUtterance } from "../tts/SpeechModel";

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
  }

  static getInstance() {
    if (!BillingModule.instance) {
      BillingModule.instance = new BillingModule();
    }
    return BillingModule.instance;
  }

  charge(utterance: SpeechUtterance, text: string): UtteranceCharge {
    text = text.trim(); // strip leading/trailing whitespace introduced by createStream
    const cost = (text.length * utterance.voice.price) / 1000; // voice price is per 1000 characters
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
