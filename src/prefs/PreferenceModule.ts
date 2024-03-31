import { config } from "../ConfigModule";
import {
  SpeechSynthesisModule,
  SpeechSynthesisVoiceRemote,
} from "../tts/SpeechSynthesisModule";
import AudioControlsModule from "../audio/AudioControlsModule";

type Preference = "speed" | "balanced" | "accuracy" | null;
type VoicePreference = SpeechSynthesisVoiceRemote | null;

// Define an interface for the structure you expect to receive from storage.sync.get
interface StorageResult {
  prefer?: Preference; // prefered mode, i.e. 'speed', 'balanced', 'accuracy'
  soundEffects?: boolean;
  autoSubmit?: boolean;
  language?: string; // e.g. 'en', 'en_US', 'en_GB', 'fr', 'fr_FR', 'fr_CA', etc.
  voiceId?: string; // prefered speech synthesis voice
  theme?: string; // 'light' or 'dark'
  shareData?: boolean; // has the user consented to data sharing?
}

class UserPreferenceModule {
  private static instance: UserPreferenceModule;
  public static getInstance(): UserPreferenceModule {
    if (!UserPreferenceModule.instance) {
      UserPreferenceModule.instance = new UserPreferenceModule();
    }
    return UserPreferenceModule.instance;
  }

  /**
   * Get the stored value from the chrome storage
   * @param {string} key
   * @param {any} defaultValue
   * @returns any
   */
  private getStoredValue(key: string, defaultValue: any): Promise<any> {
    return new Promise((resolve) => {
      chrome.storage.sync.get([key], function (result) {
        if (result[key] === undefined) {
          resolve(defaultValue);
        } else {
          resolve(result[key]);
        }
      });
    });
  }

  public getTranscriptionMode(): Promise<Preference> {
    return this.getStoredValue("prefer", "balanced");
  }

  public getSoundEffects(): Promise<boolean> {
    return this.getStoredValue("soundEffects", true);
  }

  public getAutoSubmit(): Promise<boolean> {
    return this.getStoredValue("autoSubmit", true);
  }

  public getLanguage(): Promise<string> {
    return this.getStoredValue("language", navigator.language);
  }

  public getTheme(): Promise<string> {
    return this.getStoredValue("theme", "light");
  }

  public setTheme(theme: string): Promise<void> {
    return new Promise((resolve) => {
      if (
        typeof chrome !== "undefined" &&
        chrome.storage &&
        chrome.storage.sync
      ) {
        chrome.storage.sync.set({ theme }, () => {
          resolve();
        });
      } else {
        // If Chrome storage API is not supported, do nothing
        resolve();
      }
    });
  }

  public getDataSharing(): Promise<boolean> {
    return this.getStoredValue("shareData", false);
  }

  public getPrefersImmersiveView(): Promise<boolean> {
    let userViewPreference = null;

    try {
      // we use localStorage here because view preference is device specific
      userViewPreference = localStorage.getItem("userViewPreference");
    } catch (e) {
      console.warn("Could not access localStorage: ", e);
    }

    let prefersMobile = false;
    if (userViewPreference) {
      prefersMobile = userViewPreference === "immersive";
    }
    return Promise.resolve(prefersMobile);
  }

  public hasVoice(): Promise<boolean> {
    return new Promise((resolve) => {
      if (
        typeof chrome !== "undefined" &&
        chrome.storage &&
        chrome.storage.sync
      ) {
        chrome.storage.sync.get(["voiceId"], (result: StorageResult) => {
          resolve(!!result.voiceId);
        });
      } else {
        // If Chrome storage API is not supported, return false
        resolve(false);
      }
    });
  }

  public getVoice(): Promise<VoicePreference> {
    const apiServerUrl = config.apiServerUrl;
    if (!apiServerUrl) {
      throw new Error("API server URL is not set");
    }
    const tts = SpeechSynthesisModule.getInstance(apiServerUrl);
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

  public setVoice(voice: SpeechSynthesisVoiceRemote): Promise<void> {
    if (
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.sync
    ) {
      chrome.storage.sync.set({ voiceId: voice.id });
      const audioControls = new AudioControlsModule();
      audioControls.useSayPiForAudioOutput();
    }
    return Promise.resolve();
  }

  public unsetVoice(): Promise<void> {
    if (
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.sync
    ) {
      chrome.storage.sync.get(["voiceId"]).then((result: StorageResult) => {
        if (result.voiceId) {
          chrome.storage.sync.remove("voiceId");
          const audioControls = new AudioControlsModule();
          audioControls.useDefaultForAudioOutput();
        }
      });
    }
    return Promise.resolve();
  }
}

export { UserPreferenceModule, Preference, VoicePreference };
