import { config } from './ConfigModule';

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
  private refreshTimeout: NodeJS.Timeout | null = null;
  // Value of the auth_session cookie - used as fallback when cookies can't be sent
  private authCookieValue: string | null = null;

  constructor() {
    // Load token from storage on initialization
    this.loadFromStorage();
  }

  public async loadFromStorage(): Promise<void> {
    try {
      const { jwtToken, tokenExpiresAt, authCookieValue } = await chrome.storage.local.get(['jwtToken', 'tokenExpiresAt', 'authCookieValue']);
      if (jwtToken && tokenExpiresAt) {
        this.jwtToken = jwtToken;
        this.expiresAt = tokenExpiresAt;
        this.authCookieValue = authCookieValue;
        this.scheduleRefresh();
      }
    } catch (error) {
      console.error('Failed to load token from storage:', error);
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
    console.debug('Storing auth cookie value for fallback authentication');
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
      console.debug('Skipping token refresh - current token still valid');
      return;
    }

    try {
      // The correct endpoint path is /api/auth/refresh
      const refreshUrl = `${config.authServerUrl}/api/auth/refresh`;
      console.debug(`Refreshing token from ${refreshUrl}`);
      
      // Build the request options
      const requestOptions: RequestInit = {
        method: 'POST',
        credentials: 'include', // Primary: Send cookies automatically
        headers: {
          'Content-Type': 'application/json',
          'Origin': chrome.runtime?.getURL?.('') || window.location.origin,
        }
      };
      
      // Add auth cookie value to request body as fallback, but only if we're not in Firefox
      // Firefox should rely on credentials:include since we've fixed CORS
      const isFirefoxBrowser = navigator.userAgent.includes('Firefox') || 
                               (typeof (window as any).browser !== 'undefined');
      
      if (this.authCookieValue && !isFirefoxBrowser) {
        console.debug('Including auth cookie value in request body as fallback');
        requestOptions.body = JSON.stringify({
          auth_session: this.authCookieValue // Server expects 'auth_session' parameter
        });
      } else if (isFirefoxBrowser) {
        console.debug('Firefox detected: relying on credentials:include for cookie transmission');
        // Firefox will automatically include cookies with credentials:include
        // No additional body needed
        requestOptions.body = JSON.stringify({}); // Empty body but still valid JSON
      }
      
      const response = await fetch(refreshUrl, requestOptions);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'No error details');
        
        // Special handling for 403 responses during onboarding
        if (response.status === 403) {
          console.info('User has a valid session but profile is not fully populated yet (likely during onboarding)');
          
          // Don't clear the authentication state
          // Schedule another refresh attempt after 1 minute
          setTimeout(() => this.refresh(), 60000);
          
          return; // Exit without throwing an error
        }
        
        // Special handling for 401 responses during polling
        if (response.status === 401 && silent401) {
          console.debug('Auth check during polling: not authenticated (expected)');
          
          // Clear the token but don't log an error
          this.jwtToken = null;
          this.expiresAt = null;
          await this.saveToStorage();
          
          return; // Exit without throwing an error
        }
        
        throw new Error(`Failed to refresh token: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const { token, expiresIn } = await response.json();
      
      console.debug('Token refreshed successfully, expires in:', expiresIn);
      
      this.jwtToken = token;
      this.expiresAt = Date.now() + this.parseDuration(expiresIn);
      
      await this.saveToStorage();
      this.scheduleRefresh();
    } catch (error) {
      console.error('Failed to refresh token:', error);
      this.clear();
    }
  }

  public getAuthHeader(): string | null {
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
}

// Export the singleton instance as default
export const jwtManager = new JwtManager();
export default jwtManager; 