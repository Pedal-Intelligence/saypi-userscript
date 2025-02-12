import { config } from './ConfigModule';

interface JwtClaims {
  userId: string;
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

  constructor() {
    // Load token from storage on initialization
    this.loadFromStorage();
  }

  private async loadFromStorage(): Promise<void> {
    try {
      const { token, tokenExpiresAt } = await chrome.storage.local.get(['token', 'tokenExpiresAt']);
      if (token && tokenExpiresAt) {
        this.token = token;
        this.expiresAt = tokenExpiresAt;
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
        tokenExpiresAt: this.expiresAt
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

  private async checkAuthCookie(): Promise<chrome.cookies.Cookie | null> {
    if (!config.authServerUrl) {
      console.warn('Auth server URL not configured');
      return null;
    }
    
    try {
      return await chrome.cookies.get({
        name: 'auth_session',
        url: config.authServerUrl
      });
    } catch (error) {
      console.error('Failed to check auth cookie:', error);
      return null;
    }
  }

  public async initialize(): Promise<void> {
    const cookie = await this.checkAuthCookie();
    if (cookie) {
      await this.refresh();
    }
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
      const cookie = await this.checkAuthCookie();
      if (!cookie) {
        throw new Error('No auth cookie found');
      }

      const response = await fetch(`${config.authServerUrl}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Cookie': `auth_session=${cookie.value}`,
          'Origin': chrome.runtime.getURL(''),
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to refresh token: ${response.status} ${response.statusText}`);
      }

      const { token, expiresIn } = await response.json();
      
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
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }
    chrome.storage.local.remove(['token', 'tokenExpiresAt']).catch(error => {
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