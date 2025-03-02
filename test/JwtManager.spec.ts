import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { JwtManager } from '../src/JwtManager';
import { config } from '../src/ConfigModule';

describe('JwtManager', () => {
  let jwtManager: JwtManager;
  
  beforeEach(() => {
    // Mock chrome API
    global.chrome = {
      storage: {
        local: {
          get: vi.fn().mockResolvedValue({}),
          set: vi.fn().mockResolvedValue(undefined),
          remove: vi.fn().mockResolvedValue(undefined)
        }
      },
      cookies: {
        get: vi.fn().mockImplementation(() => Promise.resolve(null))
      },
      runtime: {
        getURL: vi.fn().mockReturnValue('chrome-extension://id')
      }
    } as any;

    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ token: 'test-token', expiresIn: '15m' })
    });

    // Mock config
    vi.mock('../src/ConfigModule', () => ({
      config: {
        authServerUrl: 'https://test.saypi.ai'
      }
    }));

    // Mock setTimeout
    vi.spyOn(global, 'setTimeout');

    // Reset timer mocks
    vi.useFakeTimers();
    
    jwtManager = new JwtManager();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.resetModules();
  });

  describe('parseDuration', () => {
    const testCases = [
      { input: '30s', expected: 30 * 1000 },
      { input: '15m', expected: 15 * 60 * 1000 },
      { input: '2h', expected: 2 * 60 * 60 * 1000 },
      { input: '1d', expected: 24 * 60 * 60 * 1000 }
    ];

    testCases.forEach(({ input, expected }) => {
      it(`correctly parses ${input}`, () => {
        // @ts-expect-error: accessing private method for testing
        expect(jwtManager.parseDuration(input)).toBe(expected);
      });
    });

    it('throws error for invalid format', () => {
      // @ts-expect-error: accessing private method for testing
      expect(() => jwtManager.parseDuration('invalid')).toThrow('Invalid duration format');
      // @ts-expect-error: accessing private method for testing
      expect(() => jwtManager.parseDuration('15x')).toThrow('Invalid duration format');
    });
  });

  describe('refresh', () => {
    it('schedules next refresh correctly for 15m token', async () => {
      const now = new Date('2024-01-01T12:00:00Z').getTime();
      vi.setSystemTime(now);

      // Mock cookie existence
      (global.chrome.cookies.get as any).mockResolvedValueOnce({ value: 'test-cookie' });

      await jwtManager.refresh();

      // Verify token was saved with correct expiration
      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        jwtToken: 'test-token',
        tokenExpiresAt: now + (15 * 60 * 1000), // 15 minutes in ms
        authCookieValue: null
      });

      // Verify next refresh is scheduled 1 minute before expiration
      const expectedRefreshDelay = (14 * 60 * 1000); // 14 minutes in ms
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), expectedRefreshDelay);
    });

    it('skips refresh when token is still valid', async () => {
      const now = new Date('2024-01-01T12:00:00Z').getTime();
      vi.setSystemTime(now);

      // Setup initial token
      // @ts-expect-error: accessing private properties for testing
      jwtManager.jwtToken = 'existing-token';
      // @ts-expect-error: accessing private properties for testing
      jwtManager.expiresAt = now + (10 * 60 * 1000); // expires in 10 minutes

      await jwtManager.refresh();

      // Verify no API call was made
      expect(fetch).not.toHaveBeenCalled();
    });

    it('forces refresh when force=true, even with valid token', async () => {
      const now = new Date('2024-01-01T12:00:00Z').getTime();
      vi.setSystemTime(now);

      // Setup initial token
      // @ts-expect-error: accessing private properties for testing
      jwtManager.jwtToken = 'existing-token';
      // @ts-expect-error: accessing private properties for testing
      jwtManager.expiresAt = now + (10 * 60 * 1000); // expires in 10 minutes

      // Mock cookie existence
      (global.chrome.cookies.get as any).mockResolvedValueOnce({ value: 'test-cookie' });

      await jwtManager.refresh(true);

      // Verify API call was made despite valid token
      expect(fetch).toHaveBeenCalled();
    });
  });

  describe('storeAuthCookieValue', () => {
    it('stores the auth cookie value in memory and storage', async () => {
      const cookieValue = 'test-cookie-value';
      
      await jwtManager.storeAuthCookieValue(cookieValue);
      
      // Check it was saved to storage
      expect(chrome.storage.local.set).toHaveBeenCalledWith(
        expect.objectContaining({
          authCookieValue: cookieValue
        })
      );
      
      // Verify cookie value is stored in memory
      // @ts-expect-error: accessing private property for testing
      expect(jwtManager.authCookieValue).toBe(cookieValue);
    });
  });

  describe('refresh with auth cookie value', () => {
    it('includes auth cookie value in request body when available', async () => {
      const cookieValue = 'test-cookie-value';
      // @ts-expect-error: accessing private property for testing
      jwtManager.authCookieValue = cookieValue;
      
      await jwtManager.refresh(true);
      
      // Verify fetch was called with the session token parameter in the body
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ auth_session: cookieValue })
        })
      );
    });
  });

  describe('getQuotaDetails', () => {
    it('returns zero quotas when no token exists', () => {
      const quotaDetails = jwtManager.getTTSQuotaDetails();
      expect(quotaDetails).toEqual({
        remaining: 0,
        total: 0,
        hasQuota: false
      });
    });

    it('returns correct quota details from valid token', () => {
      // Create a test token with quota claims
      const claims = {
        userId: 'test-user',
        teamId: 'test-team',
        planId: 'test-plan',
        ttsQuotaRemaining: 50,
        ttsQuotaMonthly: 100,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600
      };
      
      const token = 'header.' + btoa(JSON.stringify(claims)) + '.signature';
      
      // @ts-expect-error: accessing private property for testing
      jwtManager.jwtToken = token;

      const quotaDetails = jwtManager.getTTSQuotaDetails();
      expect(quotaDetails).toEqual({
        remaining: 50,
        total: 100,
        hasQuota: true
      });
    });

    it('returns zero quotas for token with missing quota claims', () => {
      // Create a test token without quota claims
      const claims = {
        userId: 'test-user',
        teamId: 'test-team',
        planId: 'test-plan',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600
      };
      
      const token = 'header.' + btoa(JSON.stringify(claims)) + '.signature';
      
      // @ts-expect-error: accessing private property for testing
      jwtManager.jwtToken = token;

      const quotaDetails = jwtManager.getTTSQuotaDetails();
      expect(quotaDetails).toEqual({
        remaining: 0,
        total: 0,
        hasQuota: false
      });
    });

    it('indicates no quota when monthly quota is zero', () => {
      // Create a test token with zero quota
      const claims = {
        userId: 'test-user',
        teamId: 'test-team',
        planId: 'test-plan',
        ttsQuotaRemaining: 0,
        ttsQuotaMonthly: 0,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600
      };
      
      const token = 'header.' + btoa(JSON.stringify(claims)) + '.signature';
      
      // @ts-expect-error: accessing private property for testing
      jwtManager.jwtToken = token;

      const quotaDetails = jwtManager.getTTSQuotaDetails();
      expect(quotaDetails).toEqual({
        remaining: 0,
        total: 0,
        hasQuota: false
      });
    });
  });

  describe('clear', () => {
    it('clears token, authCookieValue, and expiresAt', () => {
      const now = new Date('2024-01-01T12:00:00Z').getTime();
      vi.setSystemTime(now);
      
      // Setup initial values
      // @ts-expect-error: accessing private properties for testing
      jwtManager.jwtToken = 'test-token';
      // @ts-expect-error: accessing private properties for testing
      jwtManager.expiresAt = now + 3600000;
      // @ts-expect-error: accessing private properties for testing
      jwtManager.authCookieValue = 'test-cookie-value';
      
      jwtManager.clear();
      
      // Check memory values are cleared
      // @ts-expect-error: accessing private properties for testing
      expect(jwtManager.jwtToken).toBeNull();
      // @ts-expect-error: accessing private properties for testing
      expect(jwtManager.expiresAt).toBeNull();
      // @ts-expect-error: accessing private properties for testing
      expect(jwtManager.authCookieValue).toBeNull();
      
      // Check storage values are cleared
      expect(chrome.storage.local.remove).toHaveBeenCalledWith(['jwtToken', 'tokenExpiresAt', 'authCookieValue']);
    });
  });
}); 