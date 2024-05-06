import EventBus from "../events/EventBus";

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
      EventBus.emit("userPreferenceChanged", { theme: theme });
    });
  }

  export function getDataSharing(): Promise<boolean> {
    return getStoredValue("shareData", false);
  }

  export function getPrefersImmersiveView(): Promise<boolean> {
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

  export function getAllowInterruptions(): Promise<boolean> {
    return getStoredValue("allowInterruptions", true);
  }

  // Singleton class for caching user preferences
  class UserPreferenceCache {
    private static instance: UserPreferenceCache;
    private cache: Record<string, any>;

    private constructor() {
      this.cache = {}; // Initialize the cache
    }

    public static getInstance(): UserPreferenceCache {
      if (!UserPreferenceCache.instance) {
        UserPreferenceCache.instance = new UserPreferenceCache();
      }
      return UserPreferenceCache.instance;
    }

    public getCachedValue(key: string, defaultValue: any): any {
      return this.cache.hasOwnProperty(key) ? this.cache[key] : defaultValue;
    }

    public setCachedValue(key: string, value: any): void {
      this.cache[key] = value;
      console.debug("Setting cache value: ", key, value);
    }
  }

  // Initialize the cache with UserPreferenceModule
  (function initializeCache() {
    reloadCache();
    // Listen for changes in autoSubmit preference (by popup or options page)
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if ("autoSubmit" in request) {
        const cache = UserPreferenceCache.getInstance();
        cache.setCachedValue("autoSubmit", request.autoSubmit);
      }
      if ("allowInterruptions" in request) {
        const cache = UserPreferenceCache.getInstance();
        cache.setCachedValue("allowInterruptions", request.allowInterruptions);
      }
    });
  })();

  export function getCachedAutoSubmit(): boolean {
    const cache = UserPreferenceCache.getInstance();
    const cachedResult = cache.getCachedValue("autoSubmit", true);
    return cachedResult;
  }

  export function getCachedAllowInterruptions(): boolean {
    const cache = UserPreferenceCache.getInstance();
    const cachedResult = cache.getCachedValue("allowInterruptions", true);
    return cachedResult;
  }

  export function reloadCache(): void {
    const cache = UserPreferenceCache.getInstance();
    getAutoSubmit().then((value) => {
      cache.setCachedValue("autoSubmit", value);
    });
    getAllowInterruptions().then((value) => {
      cache.setCachedValue("allowInterruptions", value);
    });
  }
}
