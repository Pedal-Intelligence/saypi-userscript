import { config } from "../ConfigModule";
import {
  SpeechSynthesisModule,
  SpeechSynthesisVoiceRemote,
} from "../tts/SpeechSynthesisModule";

type Preference = "speed" | "balanced" | "accuracy" | null;
export type VoicePreference = SpeechSynthesisVoiceRemote | null;

export module UserPreferenceModule {
  // Define an interface for the structure you expect to receive from storage.sync.get
  interface StorageResult {
    prefer?: Preference; // prefered mode, i.e. 'speed', 'balanced', 'accuracy'
    soundEffects?: boolean;
    autoSubmit?: boolean;
    language?: string; // e.g. 'en', 'en_US', 'en_GB', 'fr', 'fr_FR', 'fr_CA', etc.
    voiceId?: string; // prefered speech synthesis voice
  }

  export function getPreferedMode(): Promise<Preference> {
    return new Promise((resolve) => {
      if (
        typeof chrome !== "undefined" &&
        chrome.storage &&
        chrome.storage.sync
      ) {
        chrome.storage.sync.get(["prefer"], (result: StorageResult) => {
          if (result.prefer) {
            resolve(result.prefer);
          } else {
            resolve(null);
          }
        });
      } else {
        // If Chrome storage API is not supported, return null
        resolve(null);
      }
    });
  }

  export function getSoundEffects(): Promise<boolean> {
    return new Promise((resolve) => {
      if (
        typeof chrome !== "undefined" &&
        chrome.storage &&
        chrome.storage.sync
      ) {
        chrome.storage.sync.get(["soundEffects"], (result: StorageResult) => {
          if (result.soundEffects !== undefined) {
            resolve(result.soundEffects);
          } else {
            resolve(true);
          }
        });
      } else {
        // If Chrome storage API is not supported, return true
        resolve(true);
      }
    });
  }

  export function getAutoSubmit(): Promise<boolean> {
    return new Promise((resolve) => {
      if (
        typeof chrome !== "undefined" &&
        chrome.storage &&
        chrome.storage.sync
      ) {
        chrome.storage.sync.get(["autoSubmit"], (result: StorageResult) => {
          if (result.autoSubmit !== undefined) {
            resolve(result.autoSubmit);
          } else {
            resolve(true);
          }
        });
      } else {
        // If Chrome storage API is not supported, return true
        resolve(true);
      }
    });
  }

  export function getLanguage(): Promise<string> {
    return new Promise((resolve) => {
      if (
        typeof chrome !== "undefined" &&
        chrome.storage &&
        chrome.storage.sync
      ) {
        chrome.storage.sync.get(["language"], (result: StorageResult) => {
          if (result.language) {
            resolve(result.language);
          } else {
            resolve(navigator.language);
          }
        });
      } else {
        // If Chrome storage API is not supported, return system language
        resolve(navigator.language);
      }
    });
  }

  export function getVoice(): Promise<VoicePreference> {
    const apiServerUrl = config.apiServerUrl;
    if (!apiServerUrl) {
      throw new Error("API server URL is not set");
    }
    const tts = new SpeechSynthesisModule(apiServerUrl);
    return new Promise((resolve) => {
      if (
        typeof chrome !== "undefined" &&
        chrome.storage &&
        chrome.storage.sync
      ) {
        chrome.storage.sync.get(["voiceId"], async (result: StorageResult) => {
          if (result.voiceId) {
            const voice = await tts.getVoiceById(result.voiceId);
            resolve(voice);
          } else {
            resolve(null); // user preference not set
          }
        });
      } else {
        // If Chrome storage API is not supported, return null
        resolve(null);
      }
    });
  }

  export function setVoice(voice: SpeechSynthesisVoiceRemote): Promise<void> {
    if (
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.sync
    ) {
      chrome.storage.sync.set({ voiceId: voice.id });
    }
    return Promise.resolve();
  }

  export function unsetVoice(): Promise<void> {
    if (
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.sync
    ) {
      chrome.storage.sync.remove("voiceId");
    }
    return Promise.resolve();
  }
}
