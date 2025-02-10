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
        token: 'test-token',
        tokenExpiresAt: now + (15 * 60 * 1000) // 15 minutes in ms
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
      jwtManager.token = 'existing-token';
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
      jwtManager.token = 'existing-token';
      // @ts-expect-error: accessing private properties for testing
      jwtManager.expiresAt = now + (10 * 60 * 1000); // expires in 10 minutes

      // Mock cookie existence
      (global.chrome.cookies.get as any).mockResolvedValueOnce({ value: 'test-cookie' });

      await jwtManager.refresh(true);

      // Verify API call was made despite valid token
      expect(fetch).toHaveBeenCalled();
    });
  });
}); 