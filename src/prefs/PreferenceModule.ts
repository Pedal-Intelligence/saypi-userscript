type Preference = 'speed' | 'balanced' | 'accuracy' | null;

export module UserPreferenceModule {
  // Define an interface for the structure you expect to receive from storage.sync.get
  interface StorageResult {
    prefer?: Preference;
    soundEffects?: boolean;
    autoSubmit?: boolean;
  }

  export function getPreferedMode(): Promise<Preference> {
    return new Promise((resolve) => {
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.get(['prefer'], (result: StorageResult) => {
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
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.get(['soundEffects'], (result: StorageResult) => {
          if (result.soundEffects) {
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
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.get(['autoSubmit'], (result: StorageResult) => {
          if (result.autoSubmit) {
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
}
