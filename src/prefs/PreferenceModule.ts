import { config } from "../ConfigModule";
import { callApi } from "../ApiClient";
import { SpeechSynthesisModule } from "../tts/SpeechSynthesisModule";
import AudioControlsModule from "../audio/AudioControlsModule";
import EventBus from "../events/EventBus";
import {
  audioProviders,
  PiAIVoice,
  SpeechSynthesisVoiceRemote,
} from "../tts/SpeechModel";
import { isFirefox, isSafari } from "../UserAgentModule";
import { getJwtManager, getJwtManagerSync } from "../JwtManager";
import { Chatbot } from "../chatbots/Chatbot";

type Preference = "speed" | "balanced" | "accuracy" | null;
type VoicePreference = SpeechSynthesisVoiceRemote | null;

// Define an interface for the structure you expect to receive from storage.sync.get OR storage.local.get
interface StorageResult {
  prefer?: Preference; // prefered mode, i.e. 'speed', 'balanced', 'accuracy'
  soundEffects?: boolean;
  autoSubmit?: boolean;
  language?: string; // e.g. 'en', 'en_US', 'en_GB', 'fr', 'fr_FR', 'fr_CA', etc.
  voiceId?: string; // prefered speech synthesis voice (remains in sync)
  theme?: string; // 'light' or 'dark' (remains in sync)
  shareData?: boolean; // has the user consented to data sharing? (remains in sync)
  discretionaryMode?: boolean; // new beta feature for discretionary responses
  nickname?: string; // user's preferred nickname for the AI assistant
  enableTTS?: boolean; // Added for migration
  allowInterruptions?: boolean; // Added for migration
  vadStatusIndicatorEnabled?: boolean; // To control VAD status indicator visibility
  removeFillerWords?: boolean; // Prefer cleaned transcripts (LLM-powered)
  autoReadAloudChatGPT?: boolean; // Auto click ChatGPT Read Aloud during voice calls
}

// Define feature codes
export const FEATURE_CODES = {
  AGENT_MODE: "agent_mode"
};

// List of keys that are managed by chrome.storage.local after migration
const LOCAL_STORAGE_KEYS = [
  "prefer", "language", "discretionaryMode", "nickname",
  "autoSubmit", "allowInterruptions", "soundEffects", "theme", 
  "shareData", "voiceId", "enableTTS", "vadStatusIndicatorEnabled", "removeFillerWords",
  "autoReadAloudChatGPT"
];

// Add a flag to mark that sync-to-local migration has completed
export const MIGRATION_FLAG = 'prefs_migration_completed';

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
   * One-time migration from chrome.storage.sync to local storage for user preferences
   */
  public async migrateStorage(): Promise<void> {
    const flagKey = MIGRATION_FLAG;
    // Check if migration already done
    const flagResult: Record<string, any> = await new Promise(resolve => {
      chrome.storage.local.get([flagKey], resolve);
    });
    if (flagResult[flagKey]) {
      return;
    }
    // Retrieve all sync-stored preferences
    const syncData: Record<string, any> = await new Promise(resolve => {
      chrome.storage.sync.get(LOCAL_STORAGE_KEYS, resolve);
    });
    // Retrieve existing local data
    const localData: Record<string, any> = await new Promise(resolve => {
      chrome.storage.local.get(LOCAL_STORAGE_KEYS, resolve);
    });
    // Prepare items to migrate
    const toMigrate: Record<string, any> = {};
    for (const key of LOCAL_STORAGE_KEYS) {
      if (syncData[key] !== undefined && localData[key] === undefined) {
        toMigrate[key] = syncData[key];
      }
    }
    // Perform migration if needed
    if (Object.keys(toMigrate).length > 0) {
      await new Promise<void>((resolve, reject) => {
        chrome.storage.local.set(toMigrate, () => {
          if (chrome.runtime && chrome.runtime.lastError) {
            console.error('Error migrating preferences:', chrome.runtime.lastError);
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
    }
    // Mark migration complete
    await new Promise<void>(resolve => {
      chrome.storage.local.set({ [flagKey]: true }, resolve);
    });
  }

  /**
   * Constructor for UserPreferenceModule
   * Note: cache may not be fully populated immediately after construction (takes a few milliseconds)
   */
  private constructor() {
    // Run migration before loading cached preferences and setting listeners
    this.migrateStorage().then(() => {
      this.reloadCache();
      this.registerMessageListeners();
      this.registerJwtClaimsListener();
    });
  }

  private reloadCache(): void {
    // All these preferences are now intended to be in local storage.
    // getStoredValue will handle migration from sync if local is empty.
    this.getStoredValue("autoSubmit", true, 'local').then((value) => {
      this.cache.setCachedValue("autoSubmit", value);
      EventBus.emit("userPreferenceChanged", { autoSubmit: value });
    });
    this.getStoredValue("allowInterruptions", true, 'local').then((value) => {
      this.cache.setCachedValue("allowInterruptions", value);
      EventBus.emit("userPreferenceChanged", { allowInterruptions: value });
    });
    this.getStoredValue("soundEffects", true, 'local').then((value) => {
      this.cache.setCachedValue("soundEffects", value);
      EventBus.emit("userPreferenceChanged", { soundEffects: value });
    });
    this.getStoredValue("theme", "light", 'local').then((value) => {
      this.cache.setCachedValue("theme", value);
      EventBus.emit("userPreferenceChanged", { theme: value });
    });
    this.getStoredValue("shareData", false, 'local').then((value) => {
      this.cache.setCachedValue("shareData", value);
      EventBus.emit("userPreferenceChanged", { shareData: value });
    });
    this.getStoredValue("voiceId", null, 'local').then((value) => {
      this.cache.setCachedValue("voiceId", value);
      EventBus.emit("userPreferenceChanged", { voiceId: value });
    });
    this.getStoredValue("enableTTS", true, 'local').then((value) => {
      this.cache.setCachedValue("enableTTS", value);
      EventBus.emit("userPreferenceChanged", { enableTTS: value });
    });
    this.getStoredValue("discretionaryMode", false, 'local').then((value) => {
      this.cache.setCachedValue("discretionaryMode", value);
      EventBus.emit("userPreferenceChanged", { discretionaryMode: value });
    });
    this.getStoredValue("prefer", "balanced", 'local').then((value: Preference) => {
      this.cache.setCachedValue("transcriptionMode", value);
      EventBus.emit("userPreferenceChanged", { transcriptionMode: value });
    });
    this.getStoredValue("language", navigator.language, 'local').then((value: string) => {
      this.cache.setCachedValue("language", value);
      EventBus.emit("userPreferenceChanged", { language: value });
    });
    this.getStoredValue("nickname", null, 'local').then((value: string | null) => {
        this.cache.setCachedValue("nickname", value);
        EventBus.emit("userPreferenceChanged", { nickname: value });
    });
    this.getStoredValue("vadStatusIndicatorEnabled", true, 'local').then((value) => {
      this.cache.setCachedValue("vadStatusIndicatorEnabled", value);
      EventBus.emit("userPreferenceChanged", { vadStatusIndicatorEnabled: value });
    });

    // Remove filler words (default false)
    this.getStoredValue("removeFillerWords", false, 'local').then((value) => {
      this.cache.setCachedValue("removeFillerWords", value);
      EventBus.emit("userPreferenceChanged", { removeFillerWords: value });
    });

    // Auto Read Aloud for ChatGPT (default true)
    this.getStoredValue("autoReadAloudChatGPT", true, 'local').then((value) => {
      this.cache.setCachedValue("autoReadAloudChatGPT", value);
      EventBus.emit("userPreferenceChanged", { autoReadAloudChatGPT: value });
    });

    // keepSegments removed (dev-only via env)

    // Network-dependent settings (not in chrome.storage)
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
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        const actions: Promise<void>[] = [];
        
        if ("autoSubmit" in request) {
          this.cache.setCachedValue("autoSubmit", request.autoSubmit);
          actions.push(this.setStoredValue("autoSubmit", request.autoSubmit, 'local'));
        }
        if ("allowInterruptions" in request) {
          this.cache.setCachedValue("allowInterruptions", request.allowInterruptions);
          actions.push(this.setStoredValue("allowInterruptions", request.allowInterruptions, 'local'));
        }
        if ("soundEffects" in request) {
          this.cache.setCachedValue("soundEffects", request.soundEffects);
          actions.push(this.setStoredValue("soundEffects", request.soundEffects, 'local'));
        }
        if ("theme" in request) {
          this.cache.setCachedValue("theme", request.theme);
          actions.push(this.setStoredValue("theme", request.theme, 'local'));
          EventBus.emit("userPreferenceChanged", { theme: request.theme });
        }
        if ("shareData" in request) {
          this.cache.setCachedValue("shareData", request.shareData);
          actions.push(this.setStoredValue("shareData", request.shareData, 'local'));
          EventBus.emit("userPreferenceChanged", { shareData: request.shareData });
        }
        if ("voiceId" in request) {
            this.cache.setCachedValue("voiceId", request.voiceId);
            if (request.voiceId === null) {
                actions.push(this.unsetVoice()); // unsetVoice now handles local storage
            } else {
                // Assuming request.voiceId is the ID, and setVoice needs a full object
                // This part is tricky as setVoice expects a SpeechSynthesisVoiceRemote object.
                // For now, we'll just store the ID. getVoice will need to resolve it.
                actions.push(this.setStoredValue("voiceId", request.voiceId, 'local'));
                EventBus.emit("userPreferenceChanged", { voiceId: request.voiceId });
            }
        }
        if ("enableTTS" in request) {
          this.cache.setCachedValue("enableTTS", request.enableTTS);
          actions.push(this.setStoredValue("enableTTS", request.enableTTS, 'local'));
          EventBus.emit("userPreferenceChanged", { enableTTS: request.enableTTS });
        }
        if ("discretionaryMode" in request) {
          this.cache.setCachedValue("discretionaryMode", request.discretionaryMode);
          actions.push(this.setStoredValue("discretionaryMode", request.discretionaryMode, 'local'));
          EventBus.emit("userPreferenceChanged", { discretionaryMode: request.discretionaryMode });
        }
        if ("transcriptionMode" in request || "prefer" in request) {
          const mode = request.transcriptionMode || request.prefer;
          this.cache.setCachedValue("transcriptionMode", mode);
          actions.push(this.setStoredValue("prefer", mode, 'local'));
          EventBus.emit("userPreferenceChanged", { transcriptionMode: mode });
        }
        if ("language" in request) {
          this.cache.setCachedValue("language", request.language);
          actions.push(this.setStoredValue("language", request.language, 'local'));
          EventBus.emit("userPreferenceChanged", { language: request.language });
        }
        if ("nickname" in request) {
            this.cache.setCachedValue("nickname", request.nickname);
            actions.push(this.setStoredValue("nickname", request.nickname, 'local'));
            EventBus.emit("userPreferenceChanged", { nickname: request.nickname });
        }
        if ("vadStatusIndicatorEnabled" in request) {
          this.cache.setCachedValue("vadStatusIndicatorEnabled", request.vadStatusIndicatorEnabled);
          actions.push(this.setStoredValue("vadStatusIndicatorEnabled", request.vadStatusIndicatorEnabled, 'local'));
          EventBus.emit("userPreferenceChanged", { vadStatusIndicatorEnabled: request.vadStatusIndicatorEnabled });
        }

        if ("removeFillerWords" in request) {
          this.cache.setCachedValue("removeFillerWords", request.removeFillerWords);
          actions.push(this.setStoredValue("removeFillerWords", request.removeFillerWords, 'local'));
          EventBus.emit("userPreferenceChanged", { removeFillerWords: request.removeFillerWords });
        }

        if ("autoReadAloudChatGPT" in request) {
          this.cache.setCachedValue("autoReadAloudChatGPT", request.autoReadAloudChatGPT);
          actions.push(this.setStoredValue("autoReadAloudChatGPT", request.autoReadAloudChatGPT, 'local'));
          EventBus.emit("userPreferenceChanged", { autoReadAloudChatGPT: request.autoReadAloudChatGPT });
        }

        // keepSegments removed (dev-only via env)

        if (actions.length > 0) {
          Promise.all(actions).catch(error => console.error("Error processing preference updates from message listener:", error));
        }
      });
    }

    // Update chrome.storage.onChanged listener
    if (
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.onChanged
    ) {
      chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === "local") {
          for (const key in changes) {
            if (changes.hasOwnProperty(key)) {
              const newValue = changes[key].newValue;
              if (LOCAL_STORAGE_KEYS.includes(key)) {
                let eventData: any = {};
                switch (key) {
                  case "prefer": 
                    this.cache.setCachedValue("transcriptionMode", newValue);
                    eventData = { transcriptionMode: newValue }; 
                    break;
                  case "language": 
                    this.cache.setCachedValue("language", newValue);
                    eventData = { language: newValue }; 
                    break;
                  case "discretionaryMode": 
                    this.cache.setCachedValue("discretionaryMode", newValue);
                    eventData = { discretionaryMode: newValue }; 
                    break;
                  case "nickname": 
                    this.cache.setCachedValue("nickname", newValue);
                    eventData = { nickname: newValue }; 
                    break;
                  case "autoSubmit": 
                    this.cache.setCachedValue("autoSubmit", newValue);
                    eventData = { autoSubmit: newValue }; 
                    break;
                  case "allowInterruptions": 
                    this.cache.setCachedValue("allowInterruptions", newValue);
                    eventData = { allowInterruptions: newValue }; 
                    break;
                  case "soundEffects": 
                    this.cache.setCachedValue("soundEffects", newValue);
                    eventData = { soundEffects: newValue }; 
                    break;
                  case "theme": 
                    this.cache.setCachedValue("theme", newValue);
                    eventData = { theme: newValue }; 
                    break;
                  case "shareData": 
                    this.cache.setCachedValue("shareData", newValue);
                    eventData = { shareData: newValue }; 
                    break;
                  case "voiceId": 
                    this.cache.setCachedValue("voiceId", newValue);
                    eventData = { voiceId: newValue }; 
                    break;
                  case "enableTTS": 
                    this.cache.setCachedValue("enableTTS", newValue);
                    eventData = { enableTTS: newValue }; 
                    break;
                  case "vadStatusIndicatorEnabled":
                    this.cache.setCachedValue("vadStatusIndicatorEnabled", newValue);
                    eventData = { vadStatusIndicatorEnabled: newValue };
                    break;
                  case "removeFillerWords":
                    this.cache.setCachedValue("removeFillerWords", newValue);
                    eventData = { removeFillerWords: newValue };
                    break;
                  case "autoReadAloudChatGPT":
                    this.cache.setCachedValue("autoReadAloudChatGPT", newValue);
                    eventData = { autoReadAloudChatGPT: newValue };
                    break;
                  // keepSegments removed (dev-only via env)
                  default: continue; // Should not happen if LOCAL_STORAGE_KEYS is correct
                }
                EventBus.emit("userPreferenceChanged", eventData);
              }
            }
          }
        }
        // Listener for 'sync' can be removed if no other sync settings are managed by this module
        // or kept minimal for any truly sync-dependent settings not migrated.
        // For now, assuming all relevant ones are moved.
      });
    }
  }

  /**
   * Register a listener for JWT claims changes to update the cache
   */
  private registerJwtClaimsListener(): void {
    EventBus.on('jwt:claims:changed', () => {
      console.debug('JWT claims changed, reloading discretionary mode setting (now fully local based + entitlement)');
      this.getDiscretionaryMode().then((effectiveMode) => {
        // getDiscretionaryMode reads the local setting and applies entitlement.
        // We need to ensure the cache for the raw local setting is also up-to-date if it could change by other means,
        // but JWT change primarily affects the entitlement part.
        // The event should reflect the *effective* mode.
        this.getStoredValue("discretionaryMode", false, 'local').then(localSetting => {
            this.cache.setCachedValue("discretionaryMode", localSetting);
            EventBus.emit("userPreferenceChanged", { discretionaryMode: effectiveMode });
        });
      });
    });
  }

  /**
   * Generic getter for stored values from either chrome.storage.sync or chrome.storage.local
   * @param {string} key
   * @param {any} defaultValue
   * @param {'sync' | 'local'} storageType - Specify which storage to use
   * @returns Promise<any>
   */
  private getStoredValue(key: string, defaultValue: any, storageType: 'sync' | 'local'): Promise<any> {
    return new Promise((resolve) => {
      if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
        console.warn(`chrome.storage.local not available. Returning default for ${key}.`);
        resolve(defaultValue);
        return;
      }
      chrome.storage.local.get([key], (result) => {
        if (chrome.runtime && chrome.runtime.lastError) {
          console.error(`Error getting ${key} from chrome.storage.local:`, chrome.runtime.lastError.message);
          resolve(defaultValue);
        } else if (result && result[key] !== undefined) {
          resolve(result[key]);
        } else {
          resolve(defaultValue);
        }
      });
    });
  }

  /**
   * Generic setter for stored values to either chrome.storage.sync or chrome.storage.local
   * @param {string} key
   * @param {any} value
   * @param {'sync' | 'local'} storageType - Specify which storage to use
   * @returns Promise<void>
   */
  private setStoredValue(key: string, value: any, storageType: 'sync' | 'local'): Promise<void> {
    // simplified local-only storage
    return new Promise((resolve, reject) => {
      if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
        console.warn(`chrome.storage.local not available. Did not set ${key}.`);
        resolve();
        return;
      }
      chrome.storage.local.set({ [key]: value }, () => {
        if (chrome.runtime && chrome.runtime.lastError) {
          console.error(`Error setting ${key} in chrome.storage.local:`, chrome.runtime.lastError.message);
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }
  
  // --- Preference Getters/Setters ---

  // Transcription Mode (LOCAL)
  public async getTranscriptionMode(): Promise<Preference> {
    const cachedMode = this.cache.getCachedValue("transcriptionMode", null);
    if (cachedMode !== null) {
      return Promise.resolve(cachedMode as Preference);
    }
    const storedMode = await this.getStoredValue("prefer", "balanced", 'local') as Preference;
    this.cache.setCachedValue("transcriptionMode", storedMode);
    return storedMode;
  }

  public getCachedTranscriptionMode(): Preference {
    return this.cache.getCachedValue("transcriptionMode", "balanced") as Preference;
  }

  public setTranscriptionMode(mode: Preference): Promise<void> {
    this.cache.setCachedValue("transcriptionMode", mode);
    EventBus.emit("userPreferenceChanged", { transcriptionMode: mode });
    return this.setStoredValue("prefer", mode, 'local');
  }

  // Language (LOCAL)
  public async getLanguage(): Promise<string> {
    const cachedLanguage = this.cache.getCachedValue("language", null);
    if (cachedLanguage !== null) {
      return Promise.resolve(cachedLanguage as string);
    }
    const storedLanguage = await this.getStoredValue("language", navigator.language, 'local') as string;
    this.cache.setCachedValue("language", storedLanguage);
    return storedLanguage;
  }

  public getCachedLanguage(): string {
    return this.cache.getCachedValue("language", navigator.language) as string;
  }

  public setLanguage(language: string): Promise<void> {
    this.cache.setCachedValue("language", language);
    EventBus.emit("userPreferenceChanged", { language: language });
    return this.setStoredValue("language", language, 'local');
  }

  // Discretionary Mode (LOCAL for setting, but getter combines with SYNCED entitlement)
  public async getDiscretionaryMode(checkEntitlement: boolean = true): Promise<boolean> {
    // The setting itself is stored locally
    const discretionaryModeSetting = await this.getStoredValue("discretionaryMode", false, 'local') as boolean;
    if (!checkEntitlement) {
      return discretionaryModeSetting;
    }
    const hasEntitlement = await this.hasAgentModeEntitlement(); // Entitlement check might involve JWT (potentially cached)
    return discretionaryModeSetting && hasEntitlement;
  }
  
  public getCachedDiscretionaryMode(): boolean {
    // The cache stores the raw local setting for "discretionaryMode"
    const cachedSetting = this.cache.getCachedValue("discretionaryMode", false) as boolean;
    const hasEntitlement = getJwtManagerSync().hasFeatureEntitlement(FEATURE_CODES.AGENT_MODE); // Sync check
    return cachedSetting && hasEntitlement;
  }

  public setDiscretionaryMode(enabled: boolean): Promise<void> {
    this.cache.setCachedValue("discretionaryMode", enabled);
    // Effective mode might change due to entitlement, so emit the effective value
    this.getDiscretionaryMode().then(effectiveMode => {
        EventBus.emit("userPreferenceChanged", { discretionaryMode: effectiveMode });
    });
    return this.setStoredValue("discretionaryMode", enabled, 'local');
  }

  // Nickname (LOCAL)
  public async getNickname(): Promise<string | null> {
    const cachedNickname = this.cache.getCachedValue("nickname", undefined); // Use undefined to differentiate null from not-cached
    if (cachedNickname !== undefined) {
      return Promise.resolve(cachedNickname as string | null);
    }
    const storedNickname = await this.getStoredValue("nickname", null, 'local') as string | null;
    this.cache.setCachedValue("nickname", storedNickname);
    return storedNickname;
  }

  public getCachedNickname(): string | null {
      return this.cache.getCachedValue("nickname", null) as string | null;
  }

  public setNickname(nickname: string | null): Promise<void> {
    this.cache.setCachedValue("nickname", nickname);
    EventBus.emit("userPreferenceChanged", { nickname });
    return this.setStoredValue("nickname", nickname, 'local');
  }

  // VAD Status Indicator Enabled (LOCAL)
  public async getVadStatusIndicatorEnabled(): Promise<boolean> {
    const cached = this.cache.getCachedValue("vadStatusIndicatorEnabled", null);
    if (cached !== null) {
      return Promise.resolve(cached as boolean);
    }
    const stored = await this.getStoredValue("vadStatusIndicatorEnabled", true, 'local') as boolean;
    this.cache.setCachedValue("vadStatusIndicatorEnabled", stored);
    return stored;
  }

  public getCachedVadStatusIndicatorEnabled(): boolean {
    return this.cache.getCachedValue("vadStatusIndicatorEnabled", true) as boolean;
  }

  public setVadStatusIndicatorEnabled(enabled: boolean): Promise<void> {
    this.cache.setCachedValue("vadStatusIndicatorEnabled", enabled);
    EventBus.emit("userPreferenceChanged", { vadStatusIndicatorEnabled: enabled });
    return this.setStoredValue("vadStatusIndicatorEnabled", enabled, 'local');
  }

  // Remove Filler Words (LOCAL)
  public async getRemoveFillerWords(): Promise<boolean> {
    const cached = this.cache.getCachedValue("removeFillerWords", null);
    if (cached !== null) {
      return Promise.resolve(cached as boolean);
    }
    const stored = await this.getStoredValue("removeFillerWords", false, 'local') as boolean;
    this.cache.setCachedValue("removeFillerWords", stored);
    return stored;
  }

  public getCachedRemoveFillerWords(): boolean {
    return this.cache.getCachedValue("removeFillerWords", false) as boolean;
  }

  public setRemoveFillerWords(enabled: boolean): Promise<void> {
    this.cache.setCachedValue("removeFillerWords", enabled);
    EventBus.emit("userPreferenceChanged", { removeFillerWords: enabled });
    return this.setStoredValue("removeFillerWords", enabled, 'local');
  }

  // keepSegments removed (dev-only via env)

  // --- Preferences that were previously in chrome.storage.sync, now moved to local or handled by cache ---
  
  public async getSoundEffects(): Promise<boolean> {
    if (isFirefox()) {
      return Promise.resolve(false);
    }
    const cached = this.cache.getCachedValue("soundEffects", null);
    if (cached !== null) {
        return Promise.resolve(cached as boolean);
    }
    // Fetch from local storage, then cache it.
    const stored = await this.getStoredValue("soundEffects", true, 'local') as boolean;
    this.cache.setCachedValue("soundEffects", stored);
    return stored;
  }

  public getCachedSoundEffects(): boolean {
    if (isFirefox()) { // Keep Firefox-specific logic
      return false;
    }
    return this.cache.getCachedValue("soundEffects", true) as boolean;
  }
  
  public setSoundEffects(enabled: boolean): Promise<void> {
    this.cache.setCachedValue("soundEffects", enabled);
    EventBus.emit("userPreferenceChanged", { soundEffects: enabled });
    return this.setStoredValue("soundEffects", enabled, 'local'); // Ensure it uses 'local'
  }

  // Auto Read Aloud (ChatGPT)
  public async getAutoReadAloudChatGPT(): Promise<boolean> {
    const cached = this.cache.getCachedValue("autoReadAloudChatGPT", null);
    if (cached !== null) return Promise.resolve(cached as boolean);
    const stored = await this.getStoredValue("autoReadAloudChatGPT", true, 'local') as boolean;
    this.cache.setCachedValue("autoReadAloudChatGPT", stored);
    return stored;
  }

  public getCachedAutoReadAloudChatGPT(): boolean {
    return this.cache.getCachedValue("autoReadAloudChatGPT", true) as boolean;
  }

  public setAutoReadAloudChatGPT(enabled: boolean): Promise<void> {
    this.cache.setCachedValue("autoReadAloudChatGPT", enabled);
    EventBus.emit("userPreferenceChanged", { autoReadAloudChatGPT: enabled });
    return this.setStoredValue("autoReadAloudChatGPT", enabled, 'local');
  }

  public async getAutoSubmit(): Promise<boolean> {
     const cached = this.cache.getCachedValue("autoSubmit", null);
     if (cached !== null) return Promise.resolve(cached as boolean);
     const stored = await this.getStoredValue("autoSubmit", true, 'local') as boolean; // Changed to 'local'
     this.cache.setCachedValue("autoSubmit", stored);
     return stored;
  }
  
  public setAutoSubmit(enabled: boolean): Promise<void> {
    this.cache.setCachedValue("autoSubmit", enabled);
    EventBus.emit("userPreferenceChanged", { autoSubmit: enabled });
    return this.setStoredValue("autoSubmit", enabled, 'local'); // Changed to 'local'
  }


  public async getTheme(): Promise<string> {
    const cachedTheme = this.cache.getCachedValue("theme", null);
    if (cachedTheme !== null) return Promise.resolve(cachedTheme as string);
    const stored = await this.getStoredValue("theme", "light", 'local') as string; // Changed to 'local'
    this.cache.setCachedValue("theme", stored);
    return stored;
  }

  public setTheme(theme: string): Promise<void> {
    this.cache.setCachedValue("theme", theme);
    EventBus.emit("userPreferenceChanged", { theme: theme });
    return this.setStoredValue("theme", theme, 'local'); // Changed to 'local'
  }

  public async getDataSharing(): Promise<boolean> {
    const cachedDataSharing = this.cache.getCachedValue("shareData", null);
    if (cachedDataSharing !== null) return Promise.resolve(cachedDataSharing as boolean);
    const stored = await this.getStoredValue("shareData", false, 'local') as boolean; // Changed to 'local'
    this.cache.setCachedValue("shareData", stored);
    return stored;
  }
  
  public setDataSharing(enabled: boolean): Promise<void> {
    this.cache.setCachedValue("shareData", enabled);
    EventBus.emit("userPreferenceChanged", { shareData: enabled });
    return this.setStoredValue("shareData", enabled, 'local'); // Changed to 'local'
  }
  
  // Voice ID (now also local, was sync)
  public async hasVoice(): Promise<boolean> {
    const voiceId = await this.getStoredValue("voiceId", null, 'local'); // Changed to 'local'
    return !!voiceId;
  }

  public async getVoice(chatbot?: Chatbot): Promise<VoicePreference> {
    const apiServerUrl = config.apiServerUrl;
    if (!apiServerUrl) {
      throw new Error("API server URL is not set");
    }
    const tts = SpeechSynthesisModule.getInstance(apiServerUrl);
    // Check cache first
    const cachedVoiceId = this.cache.getCachedValue("voiceId", null) as string | null;
    let voiceIdToFetch = cachedVoiceId;

    if (voiceIdToFetch === null) {
      voiceIdToFetch = await this.getStoredValue("voiceId", null, 'local') as string | null; // Changed to 'local'
      if (voiceIdToFetch !== null) {
        this.cache.setCachedValue("voiceId", voiceIdToFetch);
      }
    }
    
    if (voiceIdToFetch) {
      if (PiAIVoice.isPiVoiceId(voiceIdToFetch)) {
        return PiAIVoice.fromVoiceId(voiceIdToFetch);
      }
      try {
        return await tts.getVoiceById(voiceIdToFetch, chatbot);
      } catch (error: any) {
        console.info(`Voice with ID ${voiceIdToFetch} not found for ${chatbot?.getName() || "current chatbot"}. Clearing stored voiceId.`);
        // If voice not found, clear the invalid ID from storage and cache
        await this.setStoredValue("voiceId", null, 'local');
        this.cache.setCachedValue("voiceId", null);
        return null;
      }
    }
    return null;
  }

  public setVoice(voice: SpeechSynthesisVoiceRemote): Promise<void> {
    const provider = audioProviders.retrieveProviderByEngine(voice.powered_by);
    this.cache.setCachedValue("voiceId", voice.id);
    EventBus.emit("userPreferenceChanged", {
      voiceId: voice.id,
      voice: voice,
      audioProvider: provider,
    });
    return this.setStoredValue("voiceId", voice.id, 'local').then(() => { // Changed to 'local'
        const audioControls = new AudioControlsModule();
        audioControls.notifyAudioVoiceSelection(voice);
    });
  }

  public unsetVoice(): Promise<void> {
    this.cache.setCachedValue("voiceId", null);
    EventBus.emit("userPreferenceChanged", {
      voiceId: null,
      voice: null,
      audioProvider: audioProviders.Pi,
    });
    return this.setStoredValue("voiceId", null, 'local').then(() => { // Changed to 'local'
        const audioControls = new AudioControlsModule();
        audioControls.notifyAudioVoiceDeselection();
    });
  }
  
  // Allow Interruptions (now local, was sync)
  public async getAllowInterruptions(): Promise<boolean> {
    if (isFirefox()) {
      return Promise.resolve(false);
    }
    const cached = this.cache.getCachedValue("allowInterruptions", null);
    if (cached !== null) return Promise.resolve(cached as boolean);
    const stored = await this.getStoredValue("allowInterruptions", true, 'local') as boolean; // Changed to 'local'
    this.cache.setCachedValue("allowInterruptions", stored);
    return stored;
  }

  public setAllowInterruptions(enabled: boolean): Promise<void> {
    this.cache.setCachedValue("allowInterruptions", enabled);
    EventBus.emit("userPreferenceChanged", { allowInterruptions: enabled });
    return this.setStoredValue("allowInterruptions", enabled, 'local'); // Changed to 'local'
  }

  // --- Methods primarily using cache or other logic ---

  public async isTTSBetaPaused(): Promise<boolean> { // This hits a network endpoint, not chrome.storage
    const defaultStatus = false;
    const statusEndpoint = `${config.apiServerUrl}/status/tts`;
    try {
      // Use ApiClient to encapsulate background routing and response handling
      const response = await callApi(statusEndpoint, { method: 'GET', responseType: 'json' } as any);
      const data = await response.json();
      return data.beta.status === "paused";
    } catch (error) {
      console.warn("Unable to check TTS beta status. API server may be unavailable.", error);
      return defaultStatus;
    }
  }

  public getCachedIsTTSBetaPaused(): boolean {
    return this.cache.getCachedValue("isTTSBetaPaused", false);
  }

  public async getTextToSpeechEnabled(): Promise<boolean> {
    if (isSafari()) {
      return Promise.resolve(false);
    }
    return Promise.all([
      this.getStoredValue("enableTTS", true, 'local'), // Changed to 'local'
      this.getCachedIsTTSBetaPaused(), 
    ]).then(([enableTTS, ttsBetaPaused]) => enableTTS && !ttsBetaPaused);
  }
  
  public setEnableTTS(enabled: boolean): Promise<void> {
    this.cache.setCachedValue("enableTTS", enabled); 
    EventBus.emit("userPreferenceChanged", { enableTTS: enabled });
    return this.setStoredValue("enableTTS", enabled, 'local'); // Changed to 'local'
  }

  public getCachedAutoSubmit(): boolean {
    return this.cache.getCachedValue("autoSubmit", true);
  }

  public getCachedAllowInterruptions(): boolean {
    if (isFirefox()) {
      return false;
    }
    return this.cache.getCachedValue("allowInterruptions", true);
  }

  isTTSEnabled() {
    return Promise.resolve(true);
  }

  public async hasFeatureEntitlement(featureCode: string): Promise<boolean> {
    const jwtManager = await getJwtManager();
    return jwtManager.hasFeatureEntitlement(featureCode);
  }

  public hasAgentModeEntitlement(): Promise<boolean> {
    return this.hasFeatureEntitlement(FEATURE_CODES.AGENT_MODE);
  }
  
  // Prefers Immersive View (uses localStorage directly, not chrome.storage)
  public getPrefersImmersiveView(): Promise<boolean> {
    let userViewPreference = null;
    try {
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
   public setPrefersImmersiveView(prefersImmersive: boolean): void {
    try {
      localStorage.setItem("userViewPreference", prefersImmersive ? "immersive" : "standard");
      EventBus.emit("userPreferenceChanged", { prefersImmersiveView: prefersImmersive });
    } catch (e) {
      console.warn("Could not access localStorage to set view preference: ", e);
    }
  }

  /**
   * Synchronous read interface for preference clients
   */
  public getPreference<T>(key: string, defaultValue: T): T {
    return this.cache.getCachedValue(key, defaultValue) as T;
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
    // Use undefined for checking presence to allow null/false to be valid cached values
    return this.cache[key] !== undefined ? this.cache[key] : defaultValue;
  }

  public setCachedValue(key: string, value: any): void {
    this.cache[key] = value;
  }
}

export { UserPreferenceModule, Preference, VoicePreference };
