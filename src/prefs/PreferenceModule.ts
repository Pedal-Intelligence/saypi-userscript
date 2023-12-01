type Preference = 'speed' | 'balanced' | 'accuracy' | null;

export module PreferenceModule {
  // Define an interface for the structure you expect to receive from storage.sync.get
  interface StorageResult {
    prefer?: Preference;
  }

  export function getPreference(): Promise<Preference> {
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
}
