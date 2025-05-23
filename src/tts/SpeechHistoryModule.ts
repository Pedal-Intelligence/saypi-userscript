import {
  isPlaceholderUtterance,
  SpeechUtterance,
  StreamedSpeech,
  UtteranceFactory,
} from "../tts/SpeechModel";
import { UtteranceCharge } from "../billing/BillingModule";

export class SpeechRecord implements StreamedSpeech {
  constructor(
    public hash: string,
    public utterance: SpeechUtterance,
    public charge?: UtteranceCharge
  ) {}
}
export class SpeechHistoryModule {
  private static instance: SpeechHistoryModule;

  private constructor() {}

  public static getInstance(): SpeechHistoryModule {
    if (!SpeechHistoryModule.instance) {
      SpeechHistoryModule.instance = new SpeechHistoryModule();
    }
    return SpeechHistoryModule.instance;
  }

  // visible for testing
  public async getStorageData(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([key], (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result[key]);
        }
      });
    });
  }

  // visible for testing
  public async setStorageData(data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set(data, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }

  public async addSpeechToHistory(
    hash: string,
    speech: StreamedSpeech
  ): Promise<SpeechRecord> {
    try {
      const speechHistory = (await this.getStorageData("speechHistory")) || {};
      let utterance = speechHistory[hash];
      if (!utterance && !isPlaceholderUtterance(speech.utterance)) {
        speechHistory[hash] = speech.utterance;
        await this.setStorageData({ speechHistory: speechHistory });
        console.debug(
          `Saved speech with hash ${hash} to history.`,
          speech.utterance.toString()
        );
      }
      if (speech.charge) {
        await this.addChargeToHistory(hash, speech.charge);
        console.debug(
          `Saved charge with hash ${hash} to history.`,
          speech.charge.cost
        );
      }
    } catch (error) {
      console.error(`Error adding speech to history: ${error}`);
    }
    return new SpeechRecord(hash, speech.utterance, speech.charge);
  }

  /**
   * Get a speech record from the history.
   * @param hash A hash of the message text.
   * @returns The speech record with the given hash, or null if not found.
   */
  public async getSpeechFromHistory(
    hash: string
  ): Promise<SpeechRecord | null> {
    try {
      const speechHistory = (await this.getStorageData("speechHistory")) || {};
      const utteranceObj = speechHistory[hash] || null;
      const chargeHistory = (await this.getStorageData("chargeHistory")) || {};
      if (utteranceObj && !isPlaceholderUtterance(utteranceObj)) {
        console.debug(
          `Found utterance with hash ${hash} in speech history.`,
          utteranceObj
        );

        // Use the factory to create an instance of the appropriate class
        const utterance = UtteranceFactory.createUtterance(utteranceObj);

        const charge = chargeHistory[hash]; // the charge is optional for a speech record
        if (charge) {
          console.debug(`Found charge with hash ${hash} in charge history.`);
          return new SpeechRecord(hash, utterance, charge);
        }
        return new SpeechRecord(hash, utterance);
      }
    } catch (error) {
      console.error(`Error getting speech from history: ${error}`);
    }
    return null;
  }

  public async getAllSpeechHistory(): Promise<{
    [key: string]: SpeechRecord;
  }> {
    try {
      return (await this.getStorageData("speechHistory")) || {};
    } catch (error) {
      console.error(`Error getting all speech history: ${error}`);
      return {};
    }
  }

  public async removeSpeechFromHistory(hash: string): Promise<void> {
    try {
      const speechHistory = (await this.getStorageData("speechHistory")) || {};
      delete speechHistory[hash];
      await this.setStorageData({ speechHistory });
      console.log(`Removed utterance with hash ${hash} from speech history.`);
    } catch (error) {
      console.error(`Error removing speech from history: ${error}`);
    }
  }

  public async clearSpeechHistory(): Promise<void> {
    try {
      await this.setStorageData({ speechHistory: {} });
      await this.setStorageData({ chargeHistory: {} });
      console.log("Cleared all speech history.");
    } catch (error) {
      console.error(`Error clearing speech history: ${error}`);
    }
  }

  /**
   * Add or update the charge for a speech in the history.
   * @param hash
   * @param charge
   */
  public async addChargeToHistory(
    hash: string,
    charge: UtteranceCharge
  ): Promise<UtteranceCharge> {
    try {
      const chargeHistory = (await this.getStorageData("chargeHistory")) || {};
      chargeHistory[hash] = charge;
      await this.setStorageData({ chargeHistory: chargeHistory });
      console.log(`Saved charge to history with hash ${hash}.`);
    } catch (error) {
      console.error(`Error saving charge to history: ${error}`);
    }
    return charge;
  }
}
