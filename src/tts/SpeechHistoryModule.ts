import { SpeechSynthesisUtteranceRemote } from "./SpeechSynthesisModule";

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

  public async addSpeechToHistory(
    hash: string,
    utterance: SpeechSynthesisUtteranceRemote
  ): Promise<void> {
    try {
      const speechHistory = (await this.getStorageData("speechHistory")) || {};
      speechHistory[hash] = utterance;
      await this.setStorageData({ speechHistory });
    } catch (error) {
      console.error(`Error adding speech to history: ${error}`);
    }
  }

  public async getSpeechFromHistory(
    hash: string
  ): Promise<SpeechSynthesisUtteranceRemote | undefined> {
    try {
      const speechHistory = (await this.getStorageData("speechHistory")) || {};
      return speechHistory[hash];
    } catch (error) {
      console.error(`Error getting speech from history: ${error}`);
      return undefined;
    }
  }

  public async getAllSpeechHistory(): Promise<{
    [key: string]: SpeechSynthesisUtteranceRemote;
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
}
