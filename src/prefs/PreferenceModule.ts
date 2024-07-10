import { config } from "../ConfigModule";
import { SpeechSynthesisModule } from "../tts/SpeechSynthesisModule";
import AudioControlsModule from "../audio/AudioControlsModule";
import EventBus from "../events/EventBus";
import { audioProviders, SpeechSynthesisVoiceRemote } from "../tts/SpeechModel";

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
  private cache: UserPreferenceCache = UserPreferenceCache.getInstance();

  private static instance: UserPreferenceModule;
  public static getInstance(): UserPreferenceModule {
    if (!UserPreferenceModule.instance) {
      UserPreferenceModule.instance = new UserPreferenceModule();
    }
    return UserPreferenceModule.instance;
  }

  private constructor() {
    this.reloadCache();
    this.registerMessageListeners();
  }

  private reloadCache(): void {
    this.getAutoSubmit().then((value) => {
      this.cache.setCachedValue("autoSubmit", value);
    });
    this.getAllowInterruptions().then((value) => {
      this.cache.setCachedValue("allowInterruptions", value);
    });
    this.isTTSBetaPaused().then((value) => {
      this.cache.setCachedValue("isTTSBetaPaused", value);
    });
  }

  /**
   * Register message listeners for changes in user preferences (autoSubmit, allowInterruptions, etc.) by popup or options page
   */
  private registerMessageListeners(): void {
    if (
      typeof chrome !== "undefined" &&
      chrome.runtime &&
      chrome.runtime.onMessage
    ) {
      // Listen for changes in autoSubmit preference (by popup or options page)
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if ("autoSubmit" in request) {
          this.cache.setCachedValue("autoSubmit", request.autoSubmit);
        }
        if ("allowInterruptions" in request) {
          this.cache.setCachedValue(
            "allowInterruptions",
            request.allowInterruptions
          );
        }
      });
    }

    return;
    // the following code is not used in the current implementation
    // but may be a more efficient way to listen for changes in user preferences
    if (
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.onChanged
    ) {
      chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === "sync") {
          for (const key in changes) {
            if (changes.hasOwnProperty(key)) {
              if (key === "autoSubmit") {
                this.cache.setCachedValue("autoSubmit", changes[key].newValue);
              } else if (key === "allowInterruptions") {
                this.cache.setCachedValue(
                  "allowInterruptions",
                  changes[key].newValue
                );
              } else if (key === "voiceId") {
                EventBus.emit("userPreferenceChanged", {
                  voiceId: changes[key].newValue,
                });
              }
            }
          }
        }
      });
    }
  }

  /**
   * Get the stored value from the chrome storage
   * @param {string} key
   * @param {any} defaultValue
   * @returns any
   */
  private getStoredValue(key: string, defaultValue: any): Promise<any> {
    return new Promise((resolve) => {
      if (
        typeof chrome !== "undefined" &&
        chrome.storage &&
        chrome.storage.sync
      ) {
        chrome.storage.sync.get([key], function (result) {
          if (result[key] === undefined) {
            resolve(defaultValue);
          } else {
            resolve(result[key]);
          }
        });
      } else {
        // If Chrome storage API is not supported, return the default value
        resolve(defaultValue);
      }
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
      EventBus.emit("userPreferenceChanged", { theme: theme });
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
      audioControls.useAudioOutputProvider(audioProviders.SayPi); // TODO: replace with voice.provided_by
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
          audioControls.useAudioOutputProvider(audioProviders.Pi);
        }
      });
    }
    return Promise.resolve();
  }
  public getAllowInterruptions(): Promise<boolean> {
    return this.getStoredValue("allowInterruptions", true);
  }

  /**
   * This function checks if the TTS beta is paused
   * It is necessary only during the beta period and should be removed after the beta period
   * This is a fairly slow operation as it requires a network request, so use the cached value if possible
   * @returns {Promise<boolean>} - true if TTS beta is paused, false otherwise
   */
  public async isTTSBetaPaused(): Promise<boolean> {
    const defaultStatus = false;
    const statusEndpoint = `${config.apiServerUrl}/status/tts`;

    try {
      const response = await fetch(statusEndpoint);
      const data = await response.json();
      return data.beta.status === "paused";
    } catch (error) {
      console.warn(
        "Unable to check TTS beta status. API server may be unavailable.",
        error
      );
      return defaultStatus;
    }
  }

  public getCachedIsTTSBetaPaused(): boolean {
    return this.cache.getCachedValue("isTTSBetaPaused", false);
  }

  public getTextToSpeechEnabled(): Promise<boolean> {
    return Promise.all([
      this.getStoredValue("enableTTS", true),
      this.getCachedIsTTSBetaPaused(),
    ]).then(([enableTTS, ttsBetaPaused]) => enableTTS && !ttsBetaPaused);
  }

  public getCachedAutoSubmit(): boolean {
    const cachedResult = this.cache.getCachedValue("autoSubmit", true);
    return cachedResult;
  }

  public getCachedAllowInterruptions(): boolean {
    const cachedResult = this.cache.getCachedValue("allowInterruptions", true);
    return cachedResult;
  }
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

export { UserPreferenceModule, Preference, VoicePreference };
