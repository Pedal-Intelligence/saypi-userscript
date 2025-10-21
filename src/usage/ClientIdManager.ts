import { browser } from 'wxt/browser';
import { isChromeStorageAvailable } from './BrowserApiUtils';
import { logger } from '../LoggingModule';

/**
 * ClientIdManager handles the generation and storage of a stable client identifier
 * for usage analytics as specified in the SayPi usage analytics PRD.
 * 
 * The clientId is a raw UUIDv4 that:
 * - Persists across browser restarts and extension updates
 * - Is generated once on first run and stored in chrome.storage.local
 * - Is not user-specific and does not reset on login/logout
 * - Only resets on extension uninstall or explicit user reset
 */
export class ClientIdManager {
  private static readonly STORAGE_KEY = 'saypi_client_id';
  private static instance: ClientIdManager;
  private clientId: string | null = null;
  private initializationPromise: Promise<void> | null = null;

  private constructor() {}

  public static getInstance(): ClientIdManager {
    if (!ClientIdManager.instance) {
      ClientIdManager.instance = new ClientIdManager();
    }
    return ClientIdManager.instance;
  }

  /**
   * Ensures the ClientIdManager is initialized and returns the client ID
   */
  public async getClientId(): Promise<string> {
    if (this.clientId) {
      return this.clientId;
    }

    // If initialization is already in progress, wait for it
    if (this.initializationPromise) {
      await this.initializationPromise;
      if (!this.clientId) {
        throw new Error('[ClientIdManager] Failed to initialize client ID: clientId is null after initialization');
      }
      return this.clientId;
    }

    // Start initialization
    this.initializationPromise = this.initialize();
    await this.initializationPromise;
    
    if (!this.clientId) {
      throw new Error('[ClientIdManager] Failed to initialize client ID: clientId is null after initialization');
    }
    
    return this.clientId;
  }

  /**
   * Synchronously returns the client ID if already initialized, null otherwise
   */
  public getClientIdSync(): string | null {
    return this.clientId;
  }

  private async initialize(): Promise<void> {
    try {
      // Prefer chrome.storage.local when available; otherwise use localStorage as a persistent fallback
      if (!isChromeStorageAvailable()) {
        // Try localStorage for persistence across sessions
        try {
          if (typeof localStorage !== 'undefined') {
            const existing = localStorage.getItem(ClientIdManager.STORAGE_KEY);
            if (existing && this.isValidUuidV4(existing)) {
              this.clientId = existing;
              logger.debug('[ClientIdManager] Loaded existing client ID from localStorage');
              return;
            }
            const newId = this.generateUuidV4();
            localStorage.setItem(ClientIdManager.STORAGE_KEY, newId);
            this.clientId = newId;
            logger.debug('[ClientIdManager] Generated and stored new client ID in localStorage');
            return;
          }
        } catch (e) {
          logger.warn('[ClientIdManager] localStorage unavailable; falling back to temporary client ID', e);
        }
        logger.warn('[ClientIdManager] Chrome storage API not available and no persistent storage accessible, using temporary client ID');
        this.clientId = this.generateUuidV4();
        return;
      }

      // Try to load existing client ID from storage
      const result = await browser.storage.local.get(ClientIdManager.STORAGE_KEY);
      const existingId = result[ClientIdManager.STORAGE_KEY];

      if (existingId && this.isValidUuidV4(existingId)) {
        this.clientId = existingId;
        logger.debug('[ClientIdManager] Loaded existing client ID from storage');
        return;
      }

      // Generate new client ID if none exists or invalid
      const newClientId = this.generateUuidV4();
      await browser.storage.local.set({ [ClientIdManager.STORAGE_KEY]: newClientId });
      this.clientId = newClientId;
      logger.debug('[ClientIdManager] Generated and stored new client ID');
    } catch (error) {
      logger.error('[ClientIdManager] Failed to initialize client ID:', error);
      // Fallback path: attempt localStorage, then temporary
      try {
        if (typeof localStorage !== 'undefined') {
          const existing = localStorage.getItem(ClientIdManager.STORAGE_KEY);
          if (existing && this.isValidUuidV4(existing)) {
            this.clientId = existing;
            logger.debug('[ClientIdManager] Loaded existing client ID from localStorage (storage error path)');
            return;
          }
          const newId = this.generateUuidV4();
          localStorage.setItem(ClientIdManager.STORAGE_KEY, newId);
          this.clientId = newId;
          logger.debug('[ClientIdManager] Generated and stored new client ID in localStorage (storage error path)');
          return;
        }
      } catch (e) {
        logger.warn('[ClientIdManager] localStorage unavailable during storage error handling', e);
      }
      this.clientId = this.generateUuidV4();
      logger.warn('[ClientIdManager] Using temporary client ID due to storage error');
    }
  }

  /**
   * Validates that a string is a properly formatted UUIDv4
   */
  private isValidUuidV4(value: string): boolean {
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidV4Regex.test(value);
  }

  /**
   * Generates a UUIDv4 string using crypto.randomUUID() or fallback method
   */
  private generateUuidV4(): string {
    // Modern browsers support crypto.randomUUID()
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    // Fallback using crypto.getRandomValues()
    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
      return this.generateUuidV4Fallback();
    }

    // Final fallback using Math.random() (less secure but functional)
    logger.warn('[ClientIdManager] Using Math.random() fallback for UUID generation - less secure');
    return this.generateUuidV4MathRandom();
  }

  /**
   * Generates UUIDv4 using crypto.getRandomValues()
   */
  private generateUuidV4Fallback(): string {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);

    // Set version (4) and variant bits according to RFC 4122
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10

    // Convert to hex string with hyphens
    const hex = Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20, 32)
    ].join('-');
  }

  /**
   * Generates UUIDv4 using Math.random() (fallback for environments without crypto)
   */
  private generateUuidV4MathRandom(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Resets the client ID (generates a new one and stores it)
   * This should only be called in specific scenarios like user-initiated reset
   */
  public async resetClientId(): Promise<string> {
    const newClientId = this.generateUuidV4();
    
    if (!isChromeStorageAvailable()) {
      // Try to persist in localStorage
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(ClientIdManager.STORAGE_KEY, newClientId);
          this.clientId = newClientId;
          logger.debug('[ClientIdManager] Client ID reset and persisted to localStorage');
          return newClientId;
        }
      } catch (e) {
        logger.warn('[ClientIdManager] Failed to persist client ID to localStorage; using in-memory only', e);
      }
      logger.warn('[ClientIdManager] Chrome storage API not available, client ID will not persist');
      this.clientId = newClientId;
      return newClientId;
    }

    try {
      await browser.storage.local.set({ [ClientIdManager.STORAGE_KEY]: newClientId });
      this.clientId = newClientId;
      logger.debug('[ClientIdManager] Client ID reset successfully');
      return newClientId;
    } catch (error) {
      logger.error('[ClientIdManager] Failed to reset client ID:', error);
      throw new Error(`[ClientIdManager] Failed to reset client ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export convenience function for easy access
export async function getClientId(): Promise<string> {
  return ClientIdManager.getInstance().getClientId();
}
