import { SpeechSynthesisUtteranceRemote } from "./SpeechSynthesisModule";
import { UtteranceCharge } from "../billing/BillingModule";
import { StreamedSpeech } from "./SpeechModel";
import { merge } from "lodash";

export class SpeechRecord implements StreamedSpeech {
  constructor(
    public utterance: SpeechSynthesisUtteranceRemote,
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

  private async getStorageData(key: string): Promise<any> {
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

  private async setStorageData(data: any): Promise<void> {
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

  private mergeSpeechRecords(record: SpeechRecord, speech: StreamedSpeech) {
    if (record.utterance.id !== speech.utterance.id) {
      console.warn(`Speech records are incompatible for merging.`);
      return record;
    }
    return new SpeechRecord(
      record.utterance,
      merge(record.charge, speech.charge)
    );
  }

  /**
   * Add or update speech in the history.
   **/
  public async addSpeechToHistory(
    hash: string,
    speech: StreamedSpeech
  ): Promise<SpeechRecord | null> {
    try {
      const speechHistory = (await this.getStorageData("speechHistory")) || {};
      let record = speechHistory[hash];
      if (record) {
        record = this.mergeSpeechRecords(record, speech);
      } else {
        record = new SpeechRecord(speech.utterance, speech.charge);
      }
      speechHistory[hash] = record;
      await this.setStorageData({ speechHistory });
      return record;
    } catch (error) {
      console.error(`Error adding speech to history: ${error}`);
    }
    return null;
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
      return speechHistory[hash] || null;
    } catch (error) {
      console.error(`Error getting speech from history: ${error}`);
      return null;
    }
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
  ): Promise<void> {
    try {
      const speechHistory = (await this.getStorageData("speechHistory")) || {};
      const record = speechHistory[hash];
      if (record) {
        record.charge = charge;
        await this.setStorageData({ speechHistory });
        console.log(`Applied charge to speech with hash ${hash}.`);
      } else {
        // create a new speech record with the charge
        const minimalUtterance = {
          id: charge.utteranceId,
        } as SpeechSynthesisUtteranceRemote;
        const newRecord = new SpeechRecord(minimalUtterance, charge);
        speechHistory[hash] = newRecord;
        await this.setStorageData({ speechHistory });
        console.log(`Added charge to speech with hash ${hash}.`);
      }
    } catch (error) {
      console.error(`Error applying charge to speech: ${error}`);
    }
  }
}
