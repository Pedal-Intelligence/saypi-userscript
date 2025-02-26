import { config } from './ConfigModule';

interface JwtClaims {
  userId: string;
  name: string;
  teamId: string;
  planId: string;
  ttsQuotaRemaining: number;
  ttsQuotaMonthly: number;
  iat: number;
  exp: number;
}

export interface QuotaDetails {
  remaining: number;
  total: number;
  hasQuota: boolean;
}

// Export the class for testing
export class JwtManager {
  private token: string | null = null;
  private expiresAt: number | null = null;
  private refreshTimeout: NodeJS.Timeout | null = null;
  private sessionToken: string | null = null;

  constructor() {
    // Load token from storage on initialization
    this.loadFromStorage();
  }

  private async loadFromStorage(): Promise<void> {
    try {
      const { token, tokenExpiresAt, sessionToken } = await chrome.storage.local.get(['token', 'tokenExpiresAt', 'sessionToken']);
      if (token && tokenExpiresAt) {
        this.token = token;
        this.expiresAt = tokenExpiresAt;
        this.sessionToken = sessionToken;
        this.scheduleRefresh();
      }
    } catch (error) {
      console.error('Failed to load token from storage:', error);
    }
  }

  private async saveToStorage(): Promise<void> {
    try {
      await chrome.storage.local.set({
        token: this.token,
        tokenExpiresAt: this.expiresAt,
        sessionToken: this.sessionToken
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

  // Add method to store session token
  public async storeSessionToken(sessionToken: string): Promise<void> {
    console.debug('Storing session token');
    this.sessionToken = sessionToken;
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
          // If the cookie exists, attempt to refresh the token
          await this.refresh();
        }
      }
    } catch (error) {
      console.error('Failed to check auth cookie during initialization:', error);
    }
  }

  public async refresh(force: boolean = false): Promise<void> {
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
      
      // Include both approaches: cookies and session token in body
      const requestOptions: RequestInit = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Origin': chrome.runtime?.getURL?.('') || window.location.origin,
        }
      };
      
      // Add session token to request body if available
      if (this.sessionToken) {
        console.debug('Including session token in request body');
        requestOptions.body = JSON.stringify({
          sessionToken: this.sessionToken
        });
      }
      
      const response = await fetch(refreshUrl, requestOptions);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'No error details');
        throw new Error(`Failed to refresh token: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const { token, expiresIn } = await response.json();
      
      console.debug('Token refreshed successfully, expires in:', expiresIn);
      
      this.token = token;
      this.expiresAt = Date.now() + this.parseDuration(expiresIn);
      
      await this.saveToStorage();
      this.scheduleRefresh();
    } catch (error) {
      console.error('Failed to refresh token:', error);
      this.clear();
    }
  }

  public getAuthHeader(): string | null {
    if (!this.token) return null;
    return `Bearer ${this.token}`;
  }

  public getClaims(): JwtClaims | null {
    if (!this.token) return null;
    
    try {
      const base64Url = this.token.split('.')[1];
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

  public isAuthenticated(): boolean {
    return !!this.token && !!this.expiresAt && this.expiresAt > Date.now();
  }

  public clear(): void {
    this.token = null;
    this.expiresAt = null;
    this.sessionToken = null;
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }
    chrome.storage.local.remove(['token', 'tokenExpiresAt', 'sessionToken']).catch(error => {
      console.error('Failed to clear token from storage:', error);
    });
  }

  public getQuotaDetails(): QuotaDetails {
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
      hasQuota: claims.ttsQuotaMonthly > 0
    };
  }
}

// Export the singleton instance as default
export const jwtManager = new JwtManager();
export default jwtManager; 