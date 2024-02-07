type Preference = "speed" | "balanced" | "accuracy" | null;

export module UserPreferenceModule {
  // Define an interface for the structure you expect to receive from storage.sync.get
  interface StorageResult {
    prefer?: Preference;
    soundEffects?: boolean;
    autoSubmit?: boolean;
    language?: string; // e.g. 'en', 'en_US', 'en_GB', 'fr', 'fr_FR', 'fr_CA', etc.
    theme?: string; // 'light' or 'dark'
    shareData?: boolean; // has the user consented to data sharing?
  }

  /**
   * Get the stored value from the chrome storage
   * @param {string} key
   * @param {any} defaultValue
   * @returns any
   */
  function getStoredValue(key: string, defaultValue: any): Promise<any> {
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

  export function getTranscriptionMode(): Promise<Preference> {
    return getStoredValue("prefer", "balanced");
  }

  export function getSoundEffects(): Promise<boolean> {
    return getStoredValue("soundEffects", true);
  }

  export function getAutoSubmit(): Promise<boolean> {
    return getStoredValue("autoSubmit", true);
  }

  export function getLanguage(): Promise<string> {
    return getStoredValue("language", navigator.language);
  }

  export function getTheme(): Promise<string> {
    return getStoredValue("theme", "light");
  }

  export function setTheme(theme: string): Promise<void> {
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

  export function getDataSharing(): Promise<boolean> {
    return getStoredValue("shareData", false);
  }
}
