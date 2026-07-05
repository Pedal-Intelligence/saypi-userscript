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
import { getJwtManager, getJwtManagerSync } from "../JwtManager";
import { Chatbot } from "../chatbots/Chatbot";
import { ChatbotIdentifier } from "../chatbots/ChatbotIdentifier";
import {
  VOICE_DEFAULT_PENDING_KEY,
  isDefaultPending,
  withHostDrained,
} from "../onboarding/voiceDefaults";

type Preference = "speed" | "balanced" | "accuracy" | null;
type VoicePreference = SpeechSynthesisVoiceRemote | null;
type VoicePreferenceMap = Record<string, string>;

// Define feature codes
export const FEATURE_CODES = {
  AGENT_MODE: "agent_mode"
};

// List of keys that are managed by chrome.storage.local after migration
const VOICE_PREFERENCES_KEY = "voicePreferences";

const LOCAL_STORAGE_KEYS = [
  "prefer", "language", "discretionaryMode", "nickname",
  "autoSubmit", "allowInterruptions", "soundEffects", "theme",
  "shareData", "voiceId", VOICE_PREFERENCES_KEY, "enableTTS", "vadStatusIndicatorEnabled", "removeFillerWords",
  "autoReadAloudChatGPT", "quietMode"
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
      if (key === "voiceId" || key === VOICE_PREFERENCES_KEY) {
        continue;
      }
      if (syncData[key] !== undefined && localData[key] === undefined) {
        toMigrate[key] = syncData[key];
      }
    }

    if (localData[VOICE_PREFERENCES_KEY] === undefined) {
      toMigrate[VOICE_PREFERENCES_KEY] = {} satisfies VoicePreferenceMap;
    }

    const shouldRemoveLegacyVoiceId = syncData.voiceId !== undefined || localData.voiceId !== undefined;
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
    if (shouldRemoveLegacyVoiceId) {
      await new Promise<void>((resolve) => {
        chrome.storage.local.remove("voiceId", () => {
          if (chrome.runtime && chrome.runtime.lastError) {
            console.warn('Error removing legacy voiceId preference:', chrome.runtime.lastError);
          }
          resolve();
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
    this.loadVoicePreferencesIntoCache().then((preferences) => {
      const chatbotId = ChatbotIdentifier.getAppId();
      const activeVoiceId = chatbotId ? preferences[chatbotId] ?? null : null;
      EventBus.emit("userPreferenceChanged", {
        voiceId: activeVoiceId ?? null,
        voicePreferences: preferences,
      });
    }).catch((error) => {
      // Init side-effects must not surface as unhandled rejections (e.g. if the
      // chatbot identity isn't resolvable yet); the cache simply stays unprimed.
      console.debug("[PreferenceModule] Failed to prime voice preferences:", error);
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

    // Quiet/whisper mode (default false) — #437
    this.getStoredValue("quietMode", false, 'local').then((value) => {
      this.cache.setCachedValue("quietMode", value);
      EventBus.emit("userPreferenceChanged", { quietMode: value });
    });

    // Auto Read Aloud for ChatGPT (default true)
    this.getStoredValue("autoReadAloudChatGPT", true, 'local').then((value) => {
      this.cache.setCachedValue("autoReadAloudChatGPT", value);
      EventBus.emit("userPreferenceChanged", { autoReadAloudChatGPT: value });
    });

    // keepSegments removed (dev-only via env)
  }

  private sanitizeVoicePreferences(preferences?: VoicePreferenceMap): VoicePreferenceMap {
    const sanitized: VoicePreferenceMap = {};
    if (!preferences) {
      return sanitized;
    }
    for (const [chatbotId, voiceId] of Object.entries(preferences)) {
      if (typeof voiceId === "string" && voiceId.trim().length > 0) {
        sanitized[chatbotId] = voiceId;
      }
    }
    return sanitized;
  }

  private async loadVoicePreferencesIntoCache(): Promise<VoicePreferenceMap> {
    const stored = await this.getStoredValue(VOICE_PREFERENCES_KEY, {}, 'local') as VoicePreferenceMap | undefined;
    const sanitized = this.sanitizeVoicePreferences(stored);
    this.cache.setCachedValue(VOICE_PREFERENCES_KEY, sanitized);
    return { ...sanitized };
  }

  private async getVoicePreferences(): Promise<VoicePreferenceMap> {
    const cached = this.cache.getCachedValue(VOICE_PREFERENCES_KEY, null) as VoicePreferenceMap | null;
    if (cached) {
      return { ...cached };
    }
    return await this.loadVoicePreferencesIntoCache();
  }

  private async persistVoicePreferences(preferences: VoicePreferenceMap): Promise<void> {
    const sanitized = this.sanitizeVoicePreferences(preferences);
    this.cache.setCachedValue(VOICE_PREFERENCES_KEY, sanitized);
    await this.setStoredValue(VOICE_PREFERENCES_KEY, sanitized, 'local');
  }

  private resolveChatbotId(chatbot?: Chatbot | string): string | undefined {
    if (typeof chatbot === "string") {
      return chatbot;
    }
    if (chatbot) {
      return chatbot.getID();
    }
    return ChatbotIdentifier.getAppId();
  }

  private async resolveVoiceById(
    voiceId: string,
    chatbotId: string
  ): Promise<SpeechSynthesisVoiceRemote | null> {
    if (PiAIVoice.isPiVoiceId(voiceId)) {
      return PiAIVoice.fromVoiceId(voiceId);
    }
    const apiServerUrl = config.apiServerUrl;
    if (!apiServerUrl) {
      return null;
    }
    try {
      const tts = SpeechSynthesisModule.getInstance(apiServerUrl);
      return await tts.getVoiceById(voiceId, undefined, chatbotId);
    } catch (error) {
      console.info(
        `Voice with ID ${voiceId} could not be resolved for ${chatbotId}.`,
        error
      );
      return null;
    }
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
          const chatbotId = this.resolveChatbotId();
          if (!chatbotId) {
            console.warn("[PreferenceModule] Unable to resolve chatbot id when applying voice preference.");
          } else if (request.voiceId === null) {
            actions.push(this.unsetVoice(chatbotId));
          } else {
            const voiceId = request.voiceId as string;
            const applyVoice = this.resolveVoiceById(voiceId, chatbotId).then(async (voice) => {
              if (voice) {
                await this.setVoice(voice, chatbotId);
              } else {
                const preferences = await this.getVoicePreferences();
                const updatedPreferences: VoicePreferenceMap = {
                  ...preferences,
                  [chatbotId]: voiceId,
                };
                await this.persistVoicePreferences(updatedPreferences);
                EventBus.emit("userPreferenceChanged", {
                  voiceId,
                  voice: null,
                  voicePreferences: updatedPreferences,
                  voiceChatbotId: chatbotId,
                });
              }
            });
            actions.push(applyVoice);
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

        if ("quietMode" in request) {
          this.cache.setCachedValue("quietMode", request.quietMode);
          actions.push(this.setStoredValue("quietMode", request.quietMode, 'local'));
          EventBus.emit("userPreferenceChanged", { quietMode: request.quietMode });
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
                  case VOICE_PREFERENCES_KEY:
                    const sanitized = this.sanitizeVoicePreferences(newValue as VoicePreferenceMap);
                    this.cache.setCachedValue(VOICE_PREFERENCES_KEY, sanitized);
                    const voiceChatbotId = this.resolveChatbotId();
                    eventData = {
                      voicePreferences: sanitized,
                      voiceId: voiceChatbotId ? sanitized[voiceChatbotId] ?? null : null,
                      voiceChatbotId: voiceChatbotId ?? null,
                    };
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
                  case "quietMode":
                    this.cache.setCachedValue("quietMode", newValue);
                    eventData = { quietMode: newValue };
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

  // Quiet/whisper mode (LOCAL) — #437: more sensitive VAD + quieter TTS playback
  public async getQuietMode(): Promise<boolean> {
    const cached = this.cache.getCachedValue("quietMode", null);
    if (cached !== null) {
      return Promise.resolve(cached as boolean);
    }
    const stored = await this.getStoredValue("quietMode", false, 'local') as boolean;
    this.cache.setCachedValue("quietMode", stored);
    return stored;
  }

  public getCachedQuietMode(): boolean {
    return this.cache.getCachedValue("quietMode", false) as boolean;
  }

  public setQuietMode(enabled: boolean): Promise<void> {
    this.cache.setCachedValue("quietMode", enabled);
    EventBus.emit("userPreferenceChanged", { quietMode: enabled });
    return this.setStoredValue("quietMode", enabled, 'local');
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
  
  // Voice preferences scoped per chatbot
  public async hasVoice(chatbot?: Chatbot | string): Promise<boolean> {
    const chatbotId = this.resolveChatbotId(chatbot);
    if (!chatbotId) {
      return false;
    }
    const preferences = await this.getVoicePreferences();
    const voiceId = preferences[chatbotId];
    return typeof voiceId === "string" && voiceId.trim().length > 0;
  }

  public async getVoice(chatbot?: Chatbot | string): Promise<VoicePreference> {
    const chatbotId = this.resolveChatbotId(chatbot);
    if (!chatbotId) {
      return null;
    }
    const preferences = await this.getVoicePreferences();
    const voiceIdToFetch = preferences[chatbotId] ?? null;

    if (!voiceIdToFetch) {
      // No stored voice. On a fresh install this host may still be awaiting its
      // default — adopt the server-recommended voice once (see maybeAdoptDefaultVoice).
      return await this.maybeAdoptDefaultVoice(chatbotId, chatbot);
    }

    if (PiAIVoice.isPiVoiceId(voiceIdToFetch)) {
      return PiAIVoice.fromVoiceId(voiceIdToFetch);
    }

    const apiServerUrl = config.apiServerUrl;
    if (!apiServerUrl) {
      throw new Error("API server URL is not set");
    }

    const tts = SpeechSynthesisModule.getInstance(apiServerUrl);
    const chatbotInstance = typeof chatbot === "string" ? undefined : chatbot;
    try {
      return await tts.getVoiceById(voiceIdToFetch, chatbotInstance, chatbotId);
    } catch (error: any) {
      if (!getJwtManagerSync().isAuthenticated()) {
        // While signed out, /voices returns [] (401 shape), so the failed
        // lookup says nothing about whether the voice still exists on the
        // user's account. Keep the stored preference so it survives a
        // sign-out → sign-in cycle (#456).
        console.info(`Voice with ID ${voiceIdToFetch} unavailable while signed out; keeping stored preference for ${chatbotId}.`);
        return null;
      }
      console.info(`Voice with ID ${voiceIdToFetch} not found for ${chatbotId}. Clearing stored voice preference.`);
      const updatedPreferences = { ...preferences };
      delete updatedPreferences[chatbotId];
      await this.persistVoicePreferences(updatedPreferences);
      return null;
    }
  }

  /**
   * In-flight guard so rapid first-render getVoice calls for the same host don't
   * each fetch the catalog and adopt (writes are idempotent, but this avoids
   * duplicate network calls + userPreferenceChanged emits).
   */
  private adoptingDefaultHosts = new Set<string>();

  /** Read the raw first-install "pending default" host set from local storage. */
  private async getVoiceDefaultPendingRaw(): Promise<unknown> {
    return await this.getStoredValue(VOICE_DEFAULT_PENDING_KEY, [], "local");
  }

  /** Remove a host from the first-install pending-default set (idempotent). */
  private async drainVoiceDefault(chatbotId: string): Promise<void> {
    const raw = await this.getVoiceDefaultPendingRaw();
    if (!isDefaultPending(raw, chatbotId)) return;
    await this.setStoredValue(
      VOICE_DEFAULT_PENDING_KEY,
      withHostDrained(raw, chatbotId),
      "local"
    );
  }

  /**
   * On a fresh install (this host still "pending"), adopt the server-`recommended`
   * voice the first time it's needed — once signed in, so /voices is populated.
   * Returns the adopted voice, or null when there's nothing to adopt (host not
   * pending, signed out, or the server has nominated no recommended voice — in
   * which case the host stays pending and a later call retries). Never throws.
   */
  private async maybeAdoptDefaultVoice(
    chatbotId: string,
    chatbot?: Chatbot | string
  ): Promise<VoicePreference> {
    const raw = await this.getVoiceDefaultPendingRaw();
    if (!isDefaultPending(raw, chatbotId)) return null;
    // /voices needs auth; while signed out the catalog is empty and no default is
    // knowable — leave the host pending and retry after sign-in.
    if (!getJwtManagerSync().isAuthenticated()) return null;
    if (this.adoptingDefaultHosts.has(chatbotId)) return null;
    this.adoptingDefaultHosts.add(chatbotId);
    try {
      const apiServerUrl = config.apiServerUrl;
      if (!apiServerUrl) return null;
      const tts = SpeechSynthesisModule.getInstance(apiServerUrl);
      const chatbotInstance = typeof chatbot === "string" ? undefined : chatbot;
      const voices = await tts.getVoices(chatbotInstance, chatbotId);
      const recommended = (voices ?? []).find((voice) => voice.recommended);
      if (!recommended) return null; // server hasn't nominated a default yet
      // setVoice persists the choice, drains this host, and notifies listeners.
      await this.setVoice(recommended, chatbot);
      return recommended;
    } catch (e) {
      console.debug(
        `[PreferenceModule] default-voice adoption for ${chatbotId} failed:`,
        e
      );
      return null;
    } finally {
      this.adoptingDefaultHosts.delete(chatbotId);
    }
  }

  public async setVoice(voice: SpeechSynthesisVoiceRemote, chatbot?: Chatbot | string): Promise<void> {
    const provider = audioProviders.retrieveProviderByEngine(voice.powered_by);
    const chatbotId = this.resolveChatbotId(chatbot);
    if (!chatbotId) {
      console.warn("[PreferenceModule] Unable to resolve chatbot id when setting voice preference.");
      return;
    }
    const preferences = await this.getVoicePreferences();
    const updatedPreferences: VoicePreferenceMap = {
      ...preferences,
      [chatbotId]: voice.id,
    };

    await this.persistVoicePreferences(updatedPreferences);
    // An explicit voice choice seals this host from first-install auto-defaulting.
    await this.drainVoiceDefault(chatbotId);
    EventBus.emit("userPreferenceChanged", {
      voiceId: voice.id,
      voice,
      audioProvider: provider,
      voicePreferences: updatedPreferences,
      voiceChatbotId: chatbotId,
    });

    const audioControls = new AudioControlsModule();
    audioControls.notifyAudioVoiceSelection(voice);
  }

  public async unsetVoice(chatbot?: Chatbot | string): Promise<void> {
    const chatbotId = this.resolveChatbotId(chatbot);
    if (!chatbotId) {
      return;
    }
    // A deliberate "Voice off" must never be re-defaulted on a fresh install.
    await this.drainVoiceDefault(chatbotId);
    const preferences = await this.getVoicePreferences();
    if (!(chatbotId in preferences)) {
      EventBus.emit("userPreferenceChanged", {
        voiceId: null,
        voice: null,
        audioProvider: audioProviders.getDefaultForChatbot(chatbotId),
        voicePreferences: preferences,
        voiceChatbotId: chatbotId,
      });
      const audioControls = new AudioControlsModule();
      audioControls.notifyAudioVoiceDeselection();
      return;
    }

    const updatedPreferences = { ...preferences };
    delete updatedPreferences[chatbotId];
    await this.persistVoicePreferences(updatedPreferences);
    EventBus.emit("userPreferenceChanged", {
      voiceId: null,
      voice: null,
      audioProvider: audioProviders.getDefaultForChatbot(chatbotId),
      voicePreferences: updatedPreferences,
      voiceChatbotId: chatbotId,
    });

    const audioControls = new AudioControlsModule();
    audioControls.notifyAudioVoiceDeselection();
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

  public async getTextToSpeechEnabled(): Promise<boolean> {
    if (isSafari()) {
      return Promise.resolve(false);
    }
    // TTS is gated solely by the user's enableTTS preference. The historical
    // "TTS beta paused" network check (GET /status/tts) was removed in #325: the
    // beta ended over a year ago and the server no longer reports status "paused"
    // (it can only return "active" or "unavailable"), so the gate had become a
    // permanent no-op that polled the API on every page load.
    return this.getStoredValue("enableTTS", true, 'local');
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
