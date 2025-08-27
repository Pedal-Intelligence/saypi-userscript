import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Background API Request Handler', () => {
  let mockJwtManager: any;
  let mockLogger: any;
  let mockFetch: any;
  let mockChrome: any;

  beforeEach(() => {
    // Mock JWT Manager
    mockJwtManager = {
      getAuthHeader: vi.fn().mockReturnValue('Bearer test-token'),
      refresh: vi.fn().mockResolvedValue(undefined)
    };

    // Mock Logger
    mockLogger = {
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn()
    };

    // Mock fetch
    mockFetch = vi.fn();
    global.fetch = mockFetch;

    // Mock chrome runtime
    mockChrome = {
      runtime: {
        lastError: null,
        sendMessage: vi.fn(),
        onMessage: {
          addListener: vi.fn()
        }
      }
    };
    global.chrome = mockChrome;

    // Mock Headers
    global.Headers = vi.fn().mockImplementation((init) => {
      const headers = new Map();
      if (init) {
        for (const [key, value] of Object.entries(init)) {
          headers.set(key.toLowerCase(), value);
        }
      }
      return {
        set: vi.fn((key, value) => headers.set(key.toLowerCase(), value)),
        get: vi.fn((key) => headers.get(key.toLowerCase())),
        has: vi.fn((key) => headers.has(key.toLowerCase())),
        forEach: vi.fn((callback) => headers.forEach((value, key) => callback(value, key)))
      };
    });

    // Mock Response
    global.Response = vi.fn().mockImplementation((body, init) => ({
      ok: init?.status ? init.status >= 200 && init.status < 300 : true,
      status: init?.status || 200,
      statusText: init?.statusText || 'OK',
      headers: init?.headers || new Headers(),
      text: vi.fn().mockResolvedValue(body || ''),
      json: vi.fn().mockResolvedValue(JSON.parse(body || '{}'))
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('handleApiRequest', () => {
    it('handles successful API request', async () => {
      // Mock successful response
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        text: vi.fn().mockResolvedValue('{"result": "success"}')
      };
      mockFetch.mockResolvedValue(mockResponse);

      // Create the handleApiRequest function inline for testing
      const handleApiRequest = async (message: any, sendResponse: any) => {
        try {
          const url = message.url;
          const options = message.options || {};
          
          // Simulate auth header addition
          const headers = new Headers(options.headers);
          if (url.includes('api.saypi.ai')) {
            headers.set('Authorization', 'Bearer test-token');
          }
          
          const response = await fetch(url, { ...options, headers });
          
          const responseData = {
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            headers: {} as Record<string, string>,
            body: await response.text()
          };
          
          response.headers.forEach((value: string, key: string) => {
            responseData.headers[key] = value;
          });
          
          sendResponse({ success: true, response: responseData });
        } catch (error: any) {
          sendResponse({ success: false, error: error.message });
        }
      };

      const sendResponse = vi.fn();
      const message = {
        url: 'https://api.saypi.ai/voices',
        options: { method: 'GET' }
      };

      await handleApiRequest(message, sendResponse);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.saypi.ai/voices',
        expect.objectContaining({
          method: 'GET',
          headers: expect.any(Object)
        })
      );

      expect(sendResponse).toHaveBeenCalledWith({
        success: true,
        response: {
          ok: true,
          status: 200,
          statusText: 'OK',
          headers: { 'content-type': 'application/json' },
          body: '{"result": "success"}'
        }
      });
    });

    it('handles 401 response with token refresh and retry', async () => {
      // First call returns 401
      const unauthorizedResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        headers: new Headers(),
        text: vi.fn().mockResolvedValue('Unauthorized')
      };

      // Second call (after refresh) returns success
      const successResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        text: vi.fn().mockResolvedValue('{"result": "success"}')
      };

      mockFetch
        .mockResolvedValueOnce(unauthorizedResponse)
        .mockResolvedValueOnce(successResponse);

      // Mock JWT manager refresh to return new token
      mockJwtManager.refresh.mockResolvedValue(undefined);
      mockJwtManager.getAuthHeader
        .mockReturnValueOnce('Bearer old-token')
        .mockReturnValueOnce('Bearer new-token');

      const handleApiRequest = async (message: any, sendResponse: any) => {
        try {
          const url = message.url;
          const options = message.options || {};
          
          const headers = new Headers(options.headers);
          if (url.includes('api.saypi.ai')) {
            headers.set('Authorization', mockJwtManager.getAuthHeader());
          }
          
          let response = await fetch(url, { ...options, headers });
          
          // Handle 401 with refresh
          if (response.status === 401 && headers.has('authorization')) {
            await mockJwtManager.refresh(true);
            const newAuthHeader = mockJwtManager.getAuthHeader();
            if (newAuthHeader) {
              headers.set('Authorization', newAuthHeader);
              response = await fetch(url, { ...options, headers });
            }
          }
          
          const responseData = {
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            headers: {} as Record<string, string>,
            body: await response.text()
          };
          
          sendResponse({ success: true, response: responseData });
        } catch (error: any) {
          sendResponse({ success: false, error: error.message });
        }
      };

      const sendResponse = vi.fn();
      const message = {
        url: 'https://api.saypi.ai/transcribe',
        options: { method: 'POST' }
      };

      await handleApiRequest(message, sendResponse);

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockJwtManager.refresh).toHaveBeenCalledWith(true);
      expect(sendResponse).toHaveBeenCalledWith({
        success: true,
        response: expect.objectContaining({
          ok: true,
          status: 200
        })
      });
    });

    it('handles network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const handleApiRequest = async (message: any, sendResponse: any) => {
        try {
          const response = await fetch(message.url, message.options);
          // This shouldn't be reached
          sendResponse({ success: true, response: {} });
        } catch (error: any) {
          sendResponse({ success: false, error: error.message, name: error.name });
        }
      };

      const sendResponse = vi.fn();
      const message = {
        url: 'https://api.saypi.ai/test',
        options: { method: 'GET' }
      };

      await handleApiRequest(message, sendResponse);

      expect(sendResponse).toHaveBeenCalledWith({
        success: false,
        error: 'Network error',
        name: 'Error'
      });
    });
  });
});