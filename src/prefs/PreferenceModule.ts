import { config } from "../ConfigModule";
import { SpeechSynthesisModule } from "../tts/SpeechSynthesisModule";
import AudioControlsModule from "../audio/AudioControlsModule";
import EventBus from "../events/EventBus";
import {
  audioProviders,
  PiAIVoice,
  SpeechSynthesisVoiceRemote,
} from "../tts/SpeechModel";
import { isFirefox, isSafari } from "../UserAgentModule";
import { jwtManager } from "../JwtManager";
import { Chatbot } from "../chatbots/Chatbot";

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
  discretionaryMode?: boolean; // new beta feature for discretionary responses
  nickname?: string; // user's preferred nickname for the AI assistant
}

// Define feature codes
export const FEATURE_CODES = {
  AGENT_MODE: "agent_mode"
};

class UserPreferenceModule {
  private cache: UserPreferenceCache = UserPreferenceCache.getInstance();

  private static instance: UserPreferenceModule;
  public static getInstance(): UserPreferenceModule {
    if (!UserPreferenceModule.instance) {
      UserPreferenceModule.instance = new UserPreferenceModule();
    }
    return UserPreferenceModule.instance;
  }

  /**
   * Constructor for UserPreferenceModule
   * Note: cache may not be fully populated immediately after construction (takes a few milliseconds)
   */
  private constructor() {
    this.reloadCache();
    this.registerMessageListeners();
    this.registerJwtClaimsListener();
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
    this.getDiscretionaryMode(false).then((value) => {
      this.cache.setCachedValue("discretionaryMode", value);
      EventBus.emit("userPreferenceChanged", { discretionaryMode: value }); // propagate the change to other modules - this is a bit of a hack for the cache not being ready immediately after construction
    });
    // Add transcriptionMode to cache reloading
    this.getStoredValue("prefer", "balanced").then((value: Preference) => {
      this.cache.setCachedValue("transcriptionMode", value);
      EventBus.emit("userPreferenceChanged", { transcriptionMode: value });
    });
    // Add language to cache reloading
    this.getStoredValue("language", navigator.language).then((value: string) => {
      this.cache.setCachedValue("language", value);
      EventBus.emit("userPreferenceChanged", { language: value });
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
        if ("discretionaryMode" in request) {
          this.cache.setCachedValue("discretionaryMode", request.discretionaryMode);
          EventBus.emit("userPreferenceChanged", { discretionaryMode: request.discretionaryMode }); // propagate the change to other modules
        }
        // Listen for changes in transcriptionMode preference
        if ("transcriptionMode" in request) {
          this.cache.setCachedValue("transcriptionMode", request.transcriptionMode);
          EventBus.emit("userPreferenceChanged", { transcriptionMode: request.transcriptionMode });
        }
        if ("prefer" in request) { // Also listen for 'prefer' key if used by options/popup
          this.cache.setCachedValue("transcriptionMode", request.prefer);
          EventBus.emit("userPreferenceChanged", { transcriptionMode: request.prefer });
        }
        // Listen for changes in language preference
        if ("language" in request) {
          this.cache.setCachedValue("language", request.language);
          EventBus.emit("userPreferenceChanged", { language: request.language });
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
              } else if (key === "prefer") { // Update cache if 'prefer' changes in storage.sync
                this.cache.setCachedValue("transcriptionMode", changes[key].newValue);
                EventBus.emit("userPreferenceChanged", { transcriptionMode: changes[key].newValue });
              } else if (key === "language") { // Update cache if 'language' changes in storage.sync
                this.cache.setCachedValue("language", changes[key].newValue);
                EventBus.emit("userPreferenceChanged", { language: changes[key].newValue });
              }
            }
          }
        }
      });
    }
  }

  /**
   * Register a listener for JWT claims changes to update the cache
   */
  private registerJwtClaimsListener(): void {
    EventBus.on('jwt:claims:changed', () => {
      console.debug('JWT claims changed, reloading discretionary mode setting');
      this.getDiscretionaryMode().then((value) => {
        this.cache.setCachedValue("discretionaryMode", value);
        EventBus.emit("userPreferenceChanged", { discretionaryMode: value });
      });
    });
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
          if (chrome.runtime.lastError) {
            // Log error and resolve with default value if storage access fails
            console.error(`Error getting value for ${key} from chrome.storage.sync:`, chrome.runtime.lastError.message);
            resolve(defaultValue);
            return;
          }
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

  /**
   * Gets the transcription mode from the user's preferences
   * This is a slow operation as it requires a network request, so use the cached value if possible
   * @returns {Promise<Preference>} The transcription mode: "speed", "balanced", "accuracy"
   */
  public async getTranscriptionMode(): Promise<Preference> {
    const cachedMode = this.cache.getCachedValue("transcriptionMode", null);
    if (cachedMode !== null) {
      return Promise.resolve(cachedMode as Preference);
    }
    // If not in cache, fetch from storage and cache it
    const storedMode = await this.getStoredValue("prefer", "balanced") as Preference;
    this.cache.setCachedValue("transcriptionMode", storedMode);
    return storedMode;
  }

  /**
   * Gets the cached transcription mode from the cache
   * Always prefer this method over getTranscriptionMode() as it is faster
   * @returns {Preference} The cached transcription mode: "speed", "balanced", "accuracy"
   */
  public getCachedTranscriptionMode(): Preference {
    return this.cache.getCachedValue("transcriptionMode", "balanced") as Preference;
  }

  public getSoundEffects(): Promise<boolean> {
    // If Firefox, always return false regardless of user preference
    if (isFirefox()) {
      return Promise.resolve(false);
    }
    return this.getStoredValue("soundEffects", true);
  }

  public getAutoSubmit(): Promise<boolean> {
    return this.getStoredValue("autoSubmit", true);
  }

  public async getLanguage(): Promise<string> {
    const cachedLanguage = this.cache.getCachedValue("language", null);
    if (cachedLanguage !== null) {
      return Promise.resolve(cachedLanguage as string);
    }
    const storedLanguage = await this.getStoredValue("language", navigator.language) as string;
    this.cache.setCachedValue("language", storedLanguage);
    return storedLanguage;
  }

  public getCachedLanguage(): string {
    return this.cache.getCachedValue("language", navigator.language) as string;
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

  public getVoice(chatbot?: Chatbot): Promise<VoicePreference> {
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
          let voice;
          if (result.voiceId) {
            if (PiAIVoice.isPiVoiceId(result.voiceId)) {
              voice = PiAIVoice.fromVoiceId(result.voiceId);
            } else {
              try {
                voice = await tts.getVoiceById(result.voiceId, chatbot);
              } catch (error: any) {
                // Voice not found for the current chatbot or other error occurred - can happen if the voice belongs to a different chatbot
                console.info(`Voice with ID ${result.voiceId} not found for ${chatbot?.getName() || "current chatbot"}`);
                voice = null;
              }
            }
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
    const provider = audioProviders.retrieveProviderByEngine(voice.powered_by); // should powered_by be distinct from provided_by?
    if (
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.sync
    ) {
      chrome.storage.sync.set({ voiceId: voice.id });
      const audioControls = new AudioControlsModule();
      audioControls.notifyAudioVoiceSelection(voice);
    }
    EventBus.emit("userPreferenceChanged", {
      voiceId: voice.id,
      voice: voice,
      audioProvider: provider,
    });
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
        }
        const audioControls = new AudioControlsModule();
        audioControls.notifyAudioVoiceDeselection();
      });
    }
    EventBus.emit("userPreferenceChanged", {
      voiceId: null,
      voice: null,
      audioProvider: audioProviders.Pi,
    });
    return Promise.resolve();
  }
  public getAllowInterruptions(): Promise<boolean> {
    // If Firefox, always return false regardless of user preference
    if (isFirefox()) {
      return Promise.resolve(false);
    }
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
    if (isSafari()) {
      return Promise.resolve(false);
    }
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
    if (isFirefox()) {
      return false;
    }
    const cachedResult = this.cache.getCachedValue("allowInterruptions", true);
    return cachedResult;
  }

  isTTSEnabled() {
    // TTS is now implicitly enabled when the user has credits
    return Promise.resolve(true);
  }

  /**
   * Checks if the user is entitled to a specific feature
   * @param featureCode The feature code to check for entitlement
   * @returns Promise<boolean> True if the user is entitled to the feature, false otherwise
   */
  public hasFeatureEntitlement(featureCode: string): Promise<boolean> {
    return Promise.resolve(jwtManager.hasFeatureEntitlement(featureCode));
  }

  /**
   * Checks if the user is entitled to use agent mode
   * @returns Promise<boolean> True if user is entitled to agent mode
   */
  public hasAgentModeEntitlement(): Promise<boolean> {
    return this.hasFeatureEntitlement(FEATURE_CODES.AGENT_MODE);
  }

  /**
   * Gets the current discretionary mode setting, but only returns true if the user
   * is entitled to use agent mode
   * @param checkEntitlement - if true, check if the user has entitlement to use agent mode
   */
  public getDiscretionaryMode(checkEntitlement: boolean = true): Promise<boolean> {
    return Promise.all([
      this.getStoredValue("discretionaryMode", false),
      this.hasAgentModeEntitlement()
    ]).then(([discretionaryMode, hasEntitlement]) => {
      if (checkEntitlement) {
        // Only return true if both the setting is enabled AND the user has entitlement
        return discretionaryMode && hasEntitlement;
      }
      return discretionaryMode;
    });
  }

  /**
   * Gets the cached discretionary mode value, but only returns true if the user
   * is entitled to use agent mode
   */
  public getCachedDiscretionaryMode(): boolean {
    const cachedSetting = this.cache.getCachedValue("discretionaryMode", false);
    const hasEntitlement = jwtManager.hasFeatureEntitlement(FEATURE_CODES.AGENT_MODE);
    
    // Only return true if both the setting is enabled AND the user has entitlement
    const result = cachedSetting && hasEntitlement;
    //console.debug(`getCachedDiscretionaryMode: cachedSetting=${cachedSetting}, hasEntitlement=${hasEntitlement}, result=${result}`);
    return result;
  }

  public getNickname(): Promise<string | null> {
    return this.getStoredValue("nickname", null);
  }

  public setNickname(nickname: string | null): Promise<void> {
    return new Promise((resolve) => {
      if (
        typeof chrome !== "undefined" &&
        chrome.storage &&
        chrome.storage.sync
      ) {
        if (nickname === null) {
          chrome.storage.sync.remove("nickname", () => {
            resolve();
          });
        } else {
          chrome.storage.sync.set({ nickname }, () => {
            resolve();
          });
        }
      } else {
        // If Chrome storage API is not supported, do nothing
        resolve();
      }
      EventBus.emit("userPreferenceChanged", { nickname });
    });
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
