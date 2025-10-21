import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getStoredValue, setStoredValue } from '../../../entrypoints/settings/shared/storage';
import { setupChromeMock } from '../setup';

describe('storage utilities', () => {
  let chromeMock: ReturnType<typeof setupChromeMock>;

  beforeEach(() => {
    chromeMock = setupChromeMock();
  });

  afterEach(() => {
    chromeMock.cleanup();
  });

  describe('getStoredValue', () => {
    it('should return stored value when key exists', async () => {
      await chromeMock.storage.set({ testKey: 'testValue' });

      const result = await getStoredValue('testKey', 'default');

      expect(result).toBe('testValue');
      expect(chromeMock.storage.get).toHaveBeenCalledWith(['testKey']);
    });

    it('should return default value when key does not exist', async () => {
      const result = await getStoredValue('nonexistent', 'defaultValue');

      expect(result).toBe('defaultValue');
    });

    it('should handle boolean values correctly', async () => {
      await chromeMock.storage.set({ boolKey: true });

      const result = await getStoredValue('boolKey', false);

      expect(result).toBe(true);
      expect(typeof result).toBe('boolean');
    });

    it('should handle number values correctly', async () => {
      await chromeMock.storage.set({ numKey: 42 });

      const result = await getStoredValue('numKey', 0);

      expect(result).toBe(42);
      expect(typeof result).toBe('number');
    });

    it('should handle object values correctly', async () => {
      const obj = { foo: 'bar', nested: { value: 123 } };
      await chromeMock.storage.set({ objKey: obj });

      const result = await getStoredValue('objKey', {});

      expect(result).toEqual(obj);
    });

    it('should handle null values', async () => {
      await chromeMock.storage.set({ nullKey: null });

      const result = await getStoredValue('nullKey', 'default');

      expect(result).toBeNull();
    });

    it('should return default when chrome.storage.local is unavailable', async () => {
      // Remove chrome.storage.local temporarily
      const originalStorage = (global as any).chrome.storage;
      delete (global as any).chrome.storage;

      const result = await getStoredValue('anyKey', 'fallback');

      expect(result).toBe('fallback');

      // Restore
      (global as any).chrome.storage = originalStorage;
    });

    it('should handle chrome.runtime.lastError gracefully', async () => {
      // Simulate runtime error
      chromeMock.runtime.lastError = { message: 'Storage error' };

      const result = await getStoredValue('errorKey', 'fallbackValue');

      expect(result).toBe('fallbackValue');

      // Cleanup
      chromeMock.runtime.lastError = null;
    });
  });

  describe('setStoredValue', () => {
    it('should save string values to storage', async () => {
      await setStoredValue('strKey', 'strValue');

      const stored = chromeMock.storage._getState();
      expect(stored.strKey).toBe('strValue');
      expect(chromeMock.storage.set).toHaveBeenCalledWith(
        { strKey: 'strValue' }
      );
    });

    it('should save boolean values to storage', async () => {
      await setStoredValue('boolKey', true);

      const stored = chromeMock.storage._getState();
      expect(stored.boolKey).toBe(true);
    });

    it('should save number values to storage', async () => {
      await setStoredValue('numKey', 999);

      const stored = chromeMock.storage._getState();
      expect(stored.numKey).toBe(999);
    });

    it('should save object values to storage', async () => {
      const obj = { complex: true, data: [1, 2, 3] };
      await setStoredValue('objKey', obj);

      const stored = chromeMock.storage._getState();
      expect(stored.objKey).toEqual(obj);
    });

    it('should save null values to storage', async () => {
      await setStoredValue('nullKey', null);

      const stored = chromeMock.storage._getState();
      expect(stored.nullKey).toBeNull();
    });

    it('should overwrite existing values', async () => {
      await setStoredValue('key', 'oldValue');
      await setStoredValue('key', 'newValue');

      const stored = chromeMock.storage._getState();
      expect(stored.key).toBe('newValue');
    });

    it('should reject when chrome.runtime.lastError occurs', async () => {
      // Simulate runtime error during set
      chromeMock.storage.set.mockImplementationOnce((items: any, callback?: Function) => {
        chromeMock.runtime.lastError = { message: 'Write error' };
        if (callback) callback();
        return Promise.reject(chromeMock.runtime.lastError);
      });

      await expect(setStoredValue('errorKey', 'value')).rejects.toEqual({
        message: 'Write error'
      });

      // Cleanup
      chromeMock.runtime.lastError = null;
    });
  });

  describe('integration: get after set', () => {
    it('should retrieve the same value that was set', async () => {
      const testData = { name: 'Test User', id: 123, active: true };

      await setStoredValue('userData', testData);
      const retrieved = await getStoredValue('userData', null);

      expect(retrieved).toEqual(testData);
    });

    it('should handle multiple keys independently', async () => {
      await setStoredValue('key1', 'value1');
      await setStoredValue('key2', 'value2');
      await setStoredValue('key3', 'value3');

      const val1 = await getStoredValue('key1', null);
      const val2 = await getStoredValue('key2', null);
      const val3 = await getStoredValue('key3', null);

      expect(val1).toBe('value1');
      expect(val2).toBe('value2');
      expect(val3).toBe('value3');
    });
  });
});
