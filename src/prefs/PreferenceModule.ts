type Preference = "speed" | "balanced" | "accuracy" | null;

export module UserPreferenceModule {
  // Define an interface for the structure you expect to receive from storage.sync.get
  interface StorageResult {
    prefer?: Preference;
    soundEffects?: boolean;
    autoSubmit?: boolean;
    language?: string; // e.g. 'en', 'en_US', 'en_GB', 'fr', 'fr_FR', 'fr_CA', etc.
    theme?: string; // 'light' or 'dark'
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

  export function getTheme(): Promise<string> {
    return new Promise((resolve) => {
      if (
        typeof chrome !== "undefined" &&
        chrome.storage &&
        chrome.storage.sync
      ) {
        chrome.storage.sync.get(["theme"], (result: StorageResult) => {
          if (result.theme) {
            resolve(result.theme);
          } else {
            resolve("light");
          }
        });
      } else {
        // If Chrome storage API is not supported, return light theme
        resolve("light");
      }
    });
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
}
