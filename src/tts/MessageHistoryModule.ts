import { AssistantResponse } from "../dom/MessageElements";

export interface MessageState {
  isMaintenanceMessage: boolean;
  hash: string;
}

export class MessageHistoryModule {
  private static instance: MessageHistoryModule;

  private constructor() {}

  public static getInstance(): MessageHistoryModule {
    if (!MessageHistoryModule.instance) {
      MessageHistoryModule.instance = new MessageHistoryModule();
    }
    return MessageHistoryModule.instance;
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

  /**
   * Save or update a message's state in history
   * @param hash The hash of the message text
   * @param state The state to save
   */
  public async saveMessageState(hash: string, state: MessageState): Promise<void> {
    try {
      const messageHistory = (await this.getStorageData("messageHistory")) || {};
      messageHistory[hash] = state;
      await this.setStorageData({ messageHistory });
      console.debug(`Saved message state for hash ${hash}`, state);
    } catch (error) {
      console.error(`Error saving message state to history: ${error}`);
    }
  }

  /**
   * Get a message's state from history
   * @param hash The hash of the message text
   * @returns The message state if found, null otherwise
   */
  public async getMessageState(hash: string): Promise<MessageState | null> {
    try {
      const messageHistory = (await this.getStorageData("messageHistory")) || {};
      const state = messageHistory[hash] || null;
      if (state) {
        console.debug(`Found message state for hash ${hash}`, state);
      }
      return state;
    } catch (error) {
      console.error(`Error getting message state from history: ${error}`);
      return null;
    }
  }

  /**
   * Mark a message as a maintenance message
   * @param message The assistant response to mark
   */
  public async markAsMaintenanceMessage(message: AssistantResponse): Promise<void> {
    console.debug("Marking message as maintenance message", message);
    const hash = await message.stableHash();
    await this.saveMessageState(hash, {
      isMaintenanceMessage: true,
      hash
    });
    console.debug("Marked message as maintenance message", message);
  }

  /**
   * Check if a message is marked as a maintenance message
   * @param message The assistant response to check
   */
  public async isMaintenanceMessage(message: AssistantResponse): Promise<boolean> {
    const hash = message.hash;
    const state = await this.getMessageState(hash);
    return state?.isMaintenanceMessage || false;
  }

  public async clearMessageHistory(): Promise<void> {
    try {
      await this.setStorageData({ messageHistory: {} });
      console.log("Cleared message history.");
    } catch (error) {
      console.error(`Error clearing message history: ${error}`);
    }
  }
} 