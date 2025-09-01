import { config } from './ConfigModule';
import { serializeApiRequest, shouldRouteViaBackground } from './utils/ApiRequestSerializer';
import { isFirefox as isFirefoxBrowser } from './UserAgentModule';
import EventBus from './events/EventBus';
import { logger } from './LoggingModule';

interface JwtClaims {
  userId: string;
  name: string;
  teamId: string;
  planId: string;
  ttsQuotaRemaining: number;
  ttsQuotaMonthly: number;
  sttQuotaRemaining: number;
  sttQuotaMonthly: number;
  nextQuotaReset: number; // Unix timestamp for quota reset date
  features?: string[]; // Array of feature codes the user is entitled to
  iat: number;
  exp: number;
}

export interface QuotaDetails {
  remaining: number;
  total: number;
  hasQuota: boolean;
  resetDate?: number; // Unix timestamp for quota reset date
}

// Export the class for testing
export class JwtManager {
  // The JWT token used for API authorization
  private jwtToken: string | null = null;
  // When the JWT token expires (in milliseconds since epoch)
  private expiresAt: number | null = null;
  // Timer for refreshing the JWT before expiration
  private refreshTimeout: ReturnType<typeof setTimeout> | null = null;
  // Value of the auth_session cookie - used as fallback when cookies can't be sent
  private authCookieValue: string | null = null;
  // Promise that resolves when initialization is complete
  private initializationPromise: Promise<void>;
  // Track if initialization has completed
  private isInitialized: boolean = false;

  constructor() {
    // Load token from storage on initialization
    this.initializationPromise = this.loadFromStorage().then(() => {
      this.isInitialized = true;
      logger.debug('[status] JwtManager initialized');
    });
  }

  /**
   * Ensures the JwtManager is fully initialized before proceeding
   * @returns Promise that resolves when initialization is complete
   */
  public async ensureInitialized(): Promise<void> {
    if (this.isInitialized) {
      return Promise.resolve();
    }
    return this.initializationPromise;
  }

  /**
   * Check if the JwtManager has completed initialization
   * @returns true if initialization is complete, false otherwise
   */
  public isReady(): boolean {
    return this.isInitialized;
  }

  public async loadFromStorage(): Promise<void> {
    try {
      logger.debug('[status] Loading token from storage');
      const { jwtToken, tokenExpiresAt, authCookieValue } = await chrome.storage.local.get(['jwtToken', 'tokenExpiresAt', 'authCookieValue']);
      
      // Always load authCookieValue if present
      if (authCookieValue) {
        this.authCookieValue = authCookieValue;
      }
      
      if (jwtToken && tokenExpiresAt) {
        logger.debug('[status] Token loaded from storage');
        this.jwtToken = jwtToken;
        this.expiresAt = tokenExpiresAt;
        this.scheduleRefresh();
      } else {
        logger.debug('[status] No token found in storage');
        
        // If we have authCookieValue but no JWT token, attempt to refresh
        // This handles extension reload scenarios where JWT data is lost but auth cookie remains
        if (authCookieValue) {
          logger.debug('[status] Found auth cookie but no JWT token - attempting refresh to recover authentication');
          try {
            await this.refresh(true, true); // Force refresh with silent 401 handling
            if (this.isAuthenticated()) {
              logger.debug('[status] Successfully recovered authentication state from auth cookie');
            } else {
              logger.debug('[status] Failed to recover authentication - auth cookie may be invalid');
            }
          } catch (error) {
            logger.debug('[status] Failed to refresh token using stored auth cookie:', error);
            // Don't throw here - we want initialization to complete even if refresh fails
          }
        }
      }
    } catch (error) {
      console.error('[status] Failed to load token from storage:', error);
    }
  }

  private async saveToStorage(): Promise<void> {
    try {
      await chrome.storage.local.set({
        jwtToken: this.jwtToken,
        tokenExpiresAt: this.expiresAt,
        authCookieValue: this.authCookieValue
      });
    } catch (error) {
      console.error('Failed to save token to storage:', error);
    }
  }

  private scheduleRefresh(): void {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }

    if (!this.expiresAt) return;

    // Schedule refresh 1 minute before expiration
    const refreshTime = this.expiresAt - Date.now() - 60000;
    if (refreshTime <= 0) {
      this.refresh();
      return;
    }

    this.refreshTimeout = setTimeout(() => this.refresh(), refreshTime);
  }

  /**
   * Stores the value of the auth_session cookie
   * This is used as a fallback authentication method when cookies can't be sent
   * due to browser security restrictions
   */
  public async storeAuthCookieValue(cookieValue: string): Promise<void> {
    logger.debug('Storing auth cookie value for fallback authentication');
    this.authCookieValue = cookieValue;
    await this.saveToStorage();
  }

  private parseDuration(duration: string): number {
    const match = duration.match(/^(\d+)(m|h|d|s)$/);
    if (!match) {
      throw new Error(`Invalid duration format: ${duration}`);
    }
    
    const value = parseInt(match[1]);
    const unit = match[2];
    
    switch (unit) {
      case 's': return value * 1000;
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      default: throw new Error(`Unknown duration unit: ${unit}`);
    }
  }

  public async initialize(): Promise<void> {
    // Check if the user is already authenticated with the auth server
    // by verifying if the auth_session cookie exists
    try {
      if (chrome.cookies && config.authServerUrl) {
        const cookie = await chrome.cookies.get({
          name: 'auth_session',
          url: config.authServerUrl
        });
        
        if (cookie) {
          // Store the cookie value for fallback authentication
          await this.storeAuthCookieValue(cookie.value);
          
          // If the cookie exists, attempt to refresh the token
          await this.refresh();
        }
      }
    } catch (error) {
      console.error('Failed to check auth cookie during initialization:', error);
    }
  }

  /**
   * Refreshes the JWT token using the auth_session cookie
   * Uses a dual approach:
   * 1. Sends the cookie via credentials: 'include' (primary)
   * 2. Sends the cookie value in the request body (fallback)
   */
  public async refresh(force: boolean = false, silent401: boolean = true): Promise<void> {
    if (!config.authServerUrl) {
      console.warn('Auth server URL not configured');
      return;
    }

    // Skip refresh if we have a valid token and this isn't a forced refresh
    if (!force && this.isAuthenticated() && this.expiresAt && this.expiresAt > Date.now() + 60000) {
      logger.debug('Skipping token refresh - current token still valid');
      return;
    }

    try {
      // The correct endpoint path is /api/auth/refresh
      const refreshUrl = `${config.authServerUrl}/api/auth/refresh`;
      logger.debug(`Refreshing token from ${refreshUrl}`);
      
      // Build the request options
      const requestOptions: RequestInit = {
        method: 'POST',
        credentials: 'include', // Primary: Send cookies automatically
        headers: {
          'Content-Type': 'application/json',
          // Use extension origin if available, otherwise fallback to a safe default
          // This avoids issues with window.location.origin in service worker contexts
          'Origin': this.getExtensionOrigin(),
        }
      };
      
      // Add auth cookie value to request body as fallback, but only if we're not in Firefox
      // Firefox should rely on credentials:include since we've fixed CORS
      const isFirefoxBrowser = this.isFirefoxBrowser();
      
      if (this.authCookieValue && !isFirefoxBrowser) {
        logger.debug('Including auth cookie value in request body as fallback');
        requestOptions.body = JSON.stringify({
          auth_session: this.authCookieValue // Server expects 'auth_session' parameter
        });
      } else if (isFirefoxBrowser) {
        logger.debug('Firefox detected: relying on credentials:include for cookie transmission');
        // Firefox will automatically include cookies with credentials:include
        // No additional body needed
        requestOptions.body = JSON.stringify({}); // Empty body but still valid JSON
      }
      
      // Decide whether to route via background to avoid CSP issues
      let respOk = false;
      let respStatus = 0;
      let respStatusText = '';
      let respBody: any = null;

      if (
        typeof window !== 'undefined' &&
        typeof chrome !== 'undefined' &&
        typeof (chrome as any).runtime !== 'undefined' &&
        typeof (chrome as any).runtime.sendMessage === 'function' &&
        shouldRouteViaBackground(refreshUrl)
      ) {
        const serialized = await serializeApiRequest(
          refreshUrl,
          { ...(requestOptions as any), responseType: 'json' as const }
        );
        const bg = await new Promise<any>((resolve, reject) => {
          chrome.runtime.sendMessage({ type: 'API_REQUEST', ...serialized }, (response) => {
            if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
            resolve(response);
          });
        });
        if (!bg?.success) {
          throw new Error(bg?.error || 'Background API request failed');
        }
        const data = bg.response;
        respOk = !!data.ok;
        respStatus = data.status;
        respStatusText = data.statusText;
        respBody = data.body;
      } else {
        const response = await fetch(refreshUrl, requestOptions);
        respOk = response.ok;
        respStatus = response.status;
        respStatusText = response.statusText;
        try {
          respBody = await response.json();
        } catch {
          respBody = null;
        }
      }

      if (!respOk) {
        const errorText = typeof respBody === 'string' ? respBody : 'No error details';

        // Special handling for 403 responses during onboarding
        if (respStatus === 403) {
          logger.info('User has a valid session but profile is not fully populated yet (likely during onboarding)');

          // Don't clear the authentication state
          // Schedule another refresh attempt after 1 minute
          setTimeout(() => this.refresh(), 60000);

          return; // Exit without throwing an error
        }

        // Special handling for 401 responses during polling
        if (respStatus === 401 && silent401) {
          logger.debug('Auth check during polling: not authenticated (expected)');

          // Clear the token but don't log an error
          this.jwtToken = null;
          this.expiresAt = null;
          await this.saveToStorage();

          return; // Exit without throwing an error
        }

        throw new Error(`Failed to refresh token: ${respStatus} ${respStatusText} - ${errorText}`);
      }

      const { token, expiresIn } = respBody || {};
      
      logger.debug('Token refreshed successfully, expires in:', expiresIn);
      
      // Get the old claims to compare
      const oldClaims = this.getClaims();
      
      this.jwtToken = token;
      this.expiresAt = Date.now() + this.parseDuration(expiresIn);
      
      await this.saveToStorage();
      this.scheduleRefresh();
      
      // Get the new claims
      const newClaims = this.getClaims();
      
      // Check if features have changed
      if (this.haveClaimsChanged(oldClaims, newClaims)) {
        logger.debug('JWT claims have changed, emitting event');
        EventBus.emit('jwt:claims:changed', { newClaims });
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      this.clear();
    }
  }

  /**
   * Compare old and new claims to detect changes, especially in features
   */
  private haveClaimsChanged(oldClaims: JwtClaims | null, newClaims: JwtClaims | null): boolean {
    // If either is null, consider it a change
    if (!oldClaims || !newClaims) return true;
    
    // Check if features have changed
    const oldFeatures = oldClaims.features || [];
    const newFeatures = newClaims.features || [];
    
    // Different features length indicates a change
    if (oldFeatures.length !== newFeatures.length) return true;
    
    // Check if any feature is different
    return oldFeatures.some(feature => !newFeatures.includes(feature)) ||
           newFeatures.some(feature => !oldFeatures.includes(feature));
  }

  public getAuthHeader(): string | null {
    console.debug('[status] Getting auth header');
    if (!this.jwtToken) return null;
    return `Bearer ${this.jwtToken}`;
  }

  public getClaims(): JwtClaims | null {
    if (!this.jwtToken) return null;
    
    try {
      const base64Url = this.jwtToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Failed to parse JWT claims:', error);
      return null;
    }
  }

  public isTokenExpired(): boolean {
    return !!this.expiresAt && this.expiresAt < Date.now();
  }

  /**
   * Do we have a valid JWT token?
   * @returns true if we have obtained a valid JWT token from the auth server, and it is not expired
   */
  public isAuthenticated(): boolean {
    return !!this.jwtToken && !this.isTokenExpired();
  }

  public clear(): void {
    this.jwtToken = null;
    this.expiresAt = null;
    this.authCookieValue = null;
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }
    chrome.storage.local.remove(['jwtToken', 'tokenExpiresAt', 'authCookieValue']).catch(error => {
      console.error('Failed to clear token from storage:', error);
    });
  }

  public getTTSQuotaDetails(): QuotaDetails {
    const claims = this.getClaims();
    if (!claims || typeof claims.ttsQuotaRemaining !== 'number' || typeof claims.ttsQuotaMonthly !== 'number') {
      return {
        remaining: 0,
        total: 0,
        hasQuota: false
      };
    }

    return {
      remaining: claims.ttsQuotaRemaining,
      total: claims.ttsQuotaMonthly,
      hasQuota: claims.ttsQuotaMonthly > 0,
      resetDate: claims.nextQuotaReset
    };
  }

  public getSTTQuotaDetails(): QuotaDetails {
    const claims = this.getClaims();
    if (!claims || typeof claims.sttQuotaRemaining !== 'number' || typeof claims.sttQuotaMonthly !== 'number') {
      return {
        remaining: 0,
        total: 0,
        hasQuota: false
      };
    }

    return {
      remaining: claims.sttQuotaRemaining,
      total: claims.sttQuotaMonthly,
      hasQuota: claims.sttQuotaMonthly > 0,
      resetDate: claims.nextQuotaReset
    };
  }

  /**
   * Gets a safe extension origin value that works in both content scripts and service workers
   */
  private getExtensionOrigin(): string {
    // First try to use the extension's URL
    if (typeof chrome !== 'undefined' && chrome.runtime?.getURL) {
      return new URL(chrome.runtime.getURL('')).origin;
    }
    
    // Fallback for content scripts if chrome API is not available
    if (typeof window !== 'undefined' && window.location) {
      return window.location.origin;
    }
    
    // Final fallback - use null which is a valid Origin value
    // This indicates "no particular origin" to the server
    return 'null';
  }

  /**
   * Safely detects if the browser is Firefox, works in both content scripts and service workers
   */
  private isFirefoxBrowser(): boolean {
    try {
      // Try to use the imported function first
      return isFirefoxBrowser();
    } catch (error) {
      // If that fails (e.g., in service worker where navigator might be unavailable),
      // use our fallback detection
      
      // Check if we're in a context with navigator
      if (typeof navigator !== 'undefined' && navigator.userAgent) {
        if (navigator.userAgent.includes('Firefox')) {
          return true;
        }
      }
      
      // Check for browser object (Firefox-specific)
      if (typeof window !== 'undefined' && (window as any).browser !== undefined) {
        return true;
      }
      
      // In service worker context, we can't reliably detect Firefox without navigator
      // If we can't determine, default to false
      // This means we'll include the auth cookie in the body, which is the safer approach
      return false;
    }
  }

  /**
   * Checks if the user is entitled to a specific feature
   * @param featureCode The feature code to check for entitlement
   * @returns boolean True if the user is entitled to the feature, false otherwise
   */
  public hasFeatureEntitlement(featureCode: string): boolean {
    const claims = this.getClaims();
    if (!claims || !claims.features) {
      return false;
    }
    return claims.features.includes(featureCode);
  }
}

// Create the singleton instance (private to this module)
const jwtManagerInstance = new JwtManager();

/**
 * Factory function that returns a fully initialized JwtManager instance
 * This is the recommended way to access the JWT manager
 * @returns Promise that resolves to the initialized JwtManager instance
 */
export async function getJwtManager(): Promise<JwtManager> {
  await jwtManagerInstance.ensureInitialized();
  return jwtManagerInstance;
}

/**
 * Synchronous access to JWT manager (use only when you're sure it's initialized)
 * Prefer getJwtManager() for most use cases
 * @returns The JwtManager instance (may not be fully initialized)
 */
export function getJwtManagerSync(): JwtManager {
  return jwtManagerInstance;
}

export default getJwtManager; 
