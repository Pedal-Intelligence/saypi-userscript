import { getExtensionManifest } from './BrowserApiUtils';

/**
 * VersionManager handles retrieving the extension version for usage analytics
 * as specified in the SayPi usage analytics PRD.
 */
export class VersionManager {
  private static instance: VersionManager;
  private version: string | null = null;

  private constructor() {}

  public static getInstance(): VersionManager {
    if (!VersionManager.instance) {
      VersionManager.instance = new VersionManager();
    }
    return VersionManager.instance;
  }

  /**
   * Gets the extension version from the manifest
   */
  public getVersion(): string {
    if (this.version) {
      return this.version;
    }

    try {
      const manifest = getExtensionManifest();
      if (manifest && manifest.version) {
        this.version = manifest.version;
        return this.version;
      }

      console.warn('[VersionManager] Extension manifest not available, version unknown');
      return 'unknown';
    } catch (error) {
      console.error('[VersionManager] Failed to get extension version:', error);
      return 'unknown';
    }
  }
}

// Export convenience function for easy access
export function getExtensionVersion(): string {
  return VersionManager.getInstance().getVersion();
}