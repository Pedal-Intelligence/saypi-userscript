import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  serializeApiRequest,
  deserializeApiRequest,
  serializeFormData,
  deserializeFormData,
  serializeBlob,
  deserializeBlob,
  shouldRouteViaBackground
} from '../../src/utils/ApiRequestSerializer';

describe('ApiRequestSerializer', () => {
  beforeEach(() => {
    // Mock global objects
    global.Blob = vi.fn().mockImplementation((parts, options) => ({
      size: (parts && parts[0] && (parts[0].byteLength || parts[0].length)) || 0,
      type: options?.type || '',
      arrayBuffer: () => Promise.resolve(
        parts && parts[0]
          ? (parts[0] instanceof ArrayBuffer ? parts[0] : new TextEncoder().encode(String(parts[0])).buffer)
          : new ArrayBuffer(0)
      )
    }));

    global.FormData = vi.fn().mockImplementation(() => {
      const data = new Map();
      return {
        append: vi.fn((key, value) => data.set(key, value)),
        entries: vi.fn(() => Array.from(data.entries())),
        forEach: vi.fn((cb) => data.forEach((v, k) => cb(v, k))),
        get: vi.fn((key) => data.get(key)),
        has: vi.fn((key) => data.has(key))
      };
    });

    global.Headers = vi.fn().mockImplementation((init) => {
      const headers = new Map();
      if (init) {
        for (const [key, value] of Object.entries(init)) {
          headers.set(key, value);
        }
      }
      return {
        set: vi.fn((key, value) => headers.set(key, value)),
        get: vi.fn((key) => headers.get(key)),
        has: vi.fn((key) => headers.has(key)),
        forEach: vi.fn((callback) => headers.forEach(callback))
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('shouldRouteViaBackground', () => {
    it('returns true for api.saypi.ai URLs', () => {
      expect(shouldRouteViaBackground('https://api.saypi.ai/transcribe')).toBe(true);
    });

    it('returns true for www.saypi.ai URLs', () => {
      expect(shouldRouteViaBackground('https://www.saypi.ai/auth/refresh')).toBe(true);
    });

    it('returns false for other URLs', () => {
      expect(shouldRouteViaBackground('https://claude.ai/api/chat')).toBe(false);
      expect(shouldRouteViaBackground('https://pi.ai/api/message')).toBe(false);
      expect(shouldRouteViaBackground('https://example.com/api')).toBe(false);
    });
  });

  describe('Blob serialization', () => {
    it('serializes and deserializes Blob correctly', async () => {
      const testData = new ArrayBuffer(10);
      const testBlob = new Blob([testData], { type: 'audio/wav' });
      
      const serialized = await serializeBlob(testBlob);
      expect(serialized.type).toBe('Blob');
      expect(serialized.mimeType).toBe('audio/wav');
      // Now serialized.data is base64 string; just ensure we can deserialize
      expect(typeof serialized.data).toBe('string');

      const deserialized = deserializeBlob(serialized);
      expect(deserialized).toEqual(expect.objectContaining({
        type: 'audio/wav'
      }));
    });
  });

  describe('FormData serialization', () => {
    it('serializes and deserializes FormData with string values', async () => {
      const formData = new FormData();
      formData.append('text', 'hello world');
      formData.append('number', '42');

      const serialized = await serializeFormData(formData);
      expect(serialized.type).toBe('FormData');
      
      // Check the entries array structure
      const textEntry = serialized.entries.find(([key]) => key === 'text');
      const numberEntry = serialized.entries.find(([key]) => key === 'number');
      expect(textEntry).toEqual(['text', 'hello world']);
      expect(numberEntry).toEqual(['number', '42']);

      const deserialized = deserializeFormData(serialized);
      expect(deserialized.append).toHaveBeenCalledWith('text', 'hello world');
      expect(deserialized.append).toHaveBeenCalledWith('number', '42');
    });

    it('serializes and deserializes FormData with Blob values', async () => {
      const testData = new ArrayBuffer(10);
      
      // Create a proper Blob mock 
      const mockBlob = Object.create(Blob.prototype);
      Object.assign(mockBlob, {
        type: 'audio/wav',
        arrayBuffer: () => Promise.resolve(testData)
      });
      
      // Create a proper FormData mock
      const mockFormData = Object.create(FormData.prototype);
      const entries = [['audio', mockBlob], ['metadata', 'test']];
      Object.assign(mockFormData, {
        append: vi.fn(),
        entries: vi.fn(() => entries),
        forEach: vi.fn((cb) => entries.forEach(([k, v]) => cb(v, k))),
        get: vi.fn(),
        has: vi.fn()
      });

      const serialized = await serializeFormData(mockFormData);
      expect(serialized.type).toBe('FormData');
      
      // Check that blob was serialized
      const deserialized = deserializeFormData(serialized);
      expect(deserialized.append).toHaveBeenCalledWith('metadata', 'test');
      // Validate that a Blob is reconstructed and passed
      const appendCalls = (deserialized.append as any).mock.calls;
      const audioCall = appendCalls.find((c: any[]) => c[0] === 'audio');
      expect(audioCall).toBeTruthy();
      expect(audioCall[1]).toBeTruthy();
      // No filename provided in this case
      expect(audioCall[2]).toBeUndefined();
    });
  });

  describe('API request serialization', () => {
    it('serializes simple GET request', async () => {
      const url = 'https://api.saypi.ai/voices';
      const options = { method: 'GET' };

      const serialized = await serializeApiRequest(url, options);
      expect(serialized.url).toBe(url);
      expect(serialized.options.method).toBe('GET');
    });

    it('serializes POST request with headers', async () => {
      const url = 'https://api.saypi.ai/transcribe';
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include' as RequestCredentials
      };

      const serialized = await serializeApiRequest(url, options);
      expect(serialized.url).toBe(url);
      expect(serialized.options.method).toBe('POST');
      expect(serialized.options.headers).toEqual({ 'Content-Type': 'application/json' });
      expect(serialized.options.credentials).toBe('include');
    });

    it('serializes request with FormData body', async () => {
      // Create a real-ish FormData mock that will trigger instanceof
      const mockFormData = Object.create(FormData.prototype);
      Object.assign(mockFormData, {
        append: vi.fn(),
        entries: vi.fn(() => [['test', 'value']]),
        forEach: vi.fn((cb) => cb('value', 'test')),
        get: vi.fn(),
        has: vi.fn()
      });
      
      const url = 'https://api.saypi.ai/upload';
      const options = { method: 'POST', body: mockFormData };

      const serialized = await serializeApiRequest(url, options);
      expect(serialized.options.body).toEqual(expect.objectContaining({
        type: 'FormData',
        entries: expect.arrayContaining([['test', 'value']])
      }));
    });

    it('deserializes API request correctly', () => {
      const serialized = {
        url: 'https://api.saypi.ai/test',
        options: {
          method: 'POST',
          headers: { 'Authorization': 'Bearer token' },
          credentials: 'include' as RequestCredentials,
          body: 'test data'
        }
      };

      const { url, options } = deserializeApiRequest(serialized);
      expect(url).toBe('https://api.saypi.ai/test');
      expect(options.method).toBe('POST');
      expect(options.credentials).toBe('include');
      expect(options.body).toBe('test data');
    });
  });

  it('preserves filename when serializing/deserializing File in FormData', async () => {
    const testData = new ArrayBuffer(8);
    const mockFile = Object.create(Blob.prototype);
    Object.assign(mockFile, {
      type: 'audio/webm',
      name: 'audio.webm',
      arrayBuffer: () => Promise.resolve(testData)
    });
    const mockFormData = Object.create(FormData.prototype);
    const entries = [['audio', mockFile]];
    const appendSpy = vi.fn();
    Object.assign(mockFormData, {
      append: appendSpy,
      entries: vi.fn(() => entries),
      forEach: vi.fn((cb) => entries.forEach(([k, v]) => cb(v, k))),
      get: vi.fn(),
      has: vi.fn()
    });

    const serialized = await serializeFormData(mockFormData);
    const deserialized = deserializeFormData(serialized);
    const calls = appendSpy.mock.calls;
    const audioCall = calls.find((c: any[]) => c[0] === 'audio');
    expect(audioCall).toBeTruthy();
    expect(audioCall[1]).toBeTruthy();
    expect(audioCall[2]).toBe('audio.webm');
  });

  it('passes through ArrayBuffer and TypedArray bodies', async () => {
    const ab = new ArrayBuffer(16);
    const u8 = new Uint8Array([1,2,3,4]);

    const s1 = await serializeApiRequest('https://api.saypi.ai/a', { method: 'POST', body: ab });
    expect(s1.options.body).toBeInstanceOf(ArrayBuffer);

    const s2 = await serializeApiRequest('https://api.saypi.ai/b', { method: 'POST', body: u8 });
    expect(s2.options.body).toBeInstanceOf(ArrayBuffer);

    const d1 = deserializeApiRequest(s1);
    expect(d1.options.body).toBeInstanceOf(ArrayBuffer);

    const d2 = deserializeApiRequest(s2);
    expect(d2.options.body).toBeInstanceOf(ArrayBuffer);
  });
});