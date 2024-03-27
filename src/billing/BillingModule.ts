import { SpeechSynthesisUtteranceRemote } from "../tts/SpeechSynthesisModule";

class UtteranceCharge {
  utterance: SpeechSynthesisUtteranceRemote;
  cost: number;

  constructor(utterance: SpeechSynthesisUtteranceRemote, cost: number) {
    this.utterance = utterance;
    this.cost = cost;
  }
}

export class BillingModule {
  private static instance: BillingModule;
  private charges: number = 0;
  private utterances: UtteranceCharge[] = [];

  private constructor() {
    // Load charges and utterances from storage when instantiated
    chrome.storage.sync.get(["charges", "utterances"], (data) => {
      if (data.charges) {
        this.charges = data.charges;
      }
      if (data.utterances) {
        this.utterances = data.utterances;
      }
    });
  }

  static getInstance() {
    if (!BillingModule.instance) {
      BillingModule.instance = new BillingModule();
    }
    return BillingModule.instance;
  }

  charge(utterance: SpeechSynthesisUtteranceRemote) {
    const cost = (utterance.text.length * utterance.voice.price) / 1000; // voice price is per 1000 characters
    this.charges += cost;
    this.utterances.push(new UtteranceCharge(utterance, cost));

    // Save charges and utterances to storage after charging
    chrome.storage.sync.set(
      {
        charges: this.charges,
        utterances: this.utterances,
      },
      () => {
        if (chrome.runtime.lastError) {
          // If storage limit is exceeded, remove the oldest utterance and try again
          this.utterances.shift();
          chrome.storage.sync.set({
            charges: this.charges,
            utterances: this.utterances,
          });
        }
      }
    );
  }

  getTotalCharges() {
    return this.charges;
  }
}
