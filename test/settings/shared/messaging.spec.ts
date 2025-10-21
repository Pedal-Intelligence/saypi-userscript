import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { sendMessageToActiveTab } from '../../../entrypoints/settings/shared/messaging';
import { setupChromeMock } from '../setup';

describe('messaging utilities', () => {
  let chromeMock: ReturnType<typeof setupChromeMock>;

  beforeEach(() => {
    chromeMock = setupChromeMock();
  });

  afterEach(() => {
    chromeMock.cleanup();
  });

  describe('sendMessageToActiveTab', () => {
    it('should send message to active tab', async () => {
      const message = { type: 'TEST_MESSAGE', data: 'test' };

      sendMessageToActiveTab(message);

      expect(chromeMock.tabs.query).toHaveBeenCalledWith(
        { active: true, currentWindow: true }
      );

      // Wait for microtasks to complete
      await Promise.resolve();

      expect(chromeMock.tabs.sendMessage).toHaveBeenCalledWith(
        123, // mock tab ID
        message
      );
    });

    it('should send nickname message to active tab', async () => {
      const message = { nickname: 'TestBot' };

      sendMessageToActiveTab(message);

      expect(chromeMock.tabs.query).toHaveBeenCalled();

      await Promise.resolve();

      expect(chromeMock.tabs.sendMessage).toHaveBeenCalledWith(
        123,
        message
      );
    });

    it('should send boolean settings to active tab', async () => {
      const message = { allowInterruptions: false };

      sendMessageToActiveTab(message);

      expect(chromeMock.tabs.query).toHaveBeenCalled();

      await Promise.resolve();

      expect(chromeMock.tabs.sendMessage).toHaveBeenCalledWith(
        123,
        message
      );
    });

    it('should handle case when no active tabs exist', async () => {
      // Mock empty tabs array
      chromeMock.tabs.query.mockImplementationOnce((queryInfo: any, callback?: Function) => {
        if (callback) callback([]);
        return Promise.resolve([]);
      });

      sendMessageToActiveTab({ test: 'message' });

      expect(chromeMock.tabs.query).toHaveBeenCalled();

      // Wait for microtasks to complete
      await Promise.resolve();

      // Should not try to send message
      expect(chromeMock.tabs.sendMessage).not.toHaveBeenCalled();
    });

    it('should handle case when active tab has no id', async () => {
      // Mock tab without id
      chromeMock.tabs.query.mockImplementationOnce((queryInfo: any, callback?: Function) => {
        if (callback) callback([{ active: true, id: undefined }]);
        return Promise.resolve([{ active: true, id: undefined }]);
      });

      sendMessageToActiveTab({ test: 'message' });

      expect(chromeMock.tabs.query).toHaveBeenCalled();

      // Wait for microtasks to complete
      await Promise.resolve();

      // Should not try to send message
      expect(chromeMock.tabs.sendMessage).not.toHaveBeenCalled();
    });

    it('should handle chrome.runtime.lastError gracefully', async () => {
      // Mock runtime error during sendMessage
      chromeMock.tabs.sendMessage.mockImplementationOnce((tabId: number, message: any, callback?: Function) => {
        chromeMock.runtime.lastError = { message: 'Tab not found' };
        if (callback) callback(undefined);
        return Promise.resolve(undefined);
      });

      // Should not throw
      expect(() => {
        sendMessageToActiveTab({ test: 'message' });
      }).not.toThrow();

      // Wait for microtasks to complete
      await Promise.resolve();

      // Cleanup
      chromeMock.runtime.lastError = null;
    });

    it('should handle complex message objects', async () => {
      const complexMessage = {
        type: 'COMPLEX_MESSAGE',
        settings: {
          soundEffects: true,
          nickname: 'TestBot',
          preferences: {
            voice: 'en-US',
            speed: 1.5
          }
        },
        timestamp: Date.now()
      };

      sendMessageToActiveTab(complexMessage);

      expect(chromeMock.tabs.query).toHaveBeenCalled();

      await Promise.resolve();

      expect(chromeMock.tabs.sendMessage).toHaveBeenCalledWith(
        123,
        complexMessage
      );
    });

    it('should handle null message', async () => {
      sendMessageToActiveTab(null);

      expect(chromeMock.tabs.query).toHaveBeenCalled();

      await Promise.resolve();

      expect(chromeMock.tabs.sendMessage).toHaveBeenCalledWith(
        123,
        null
      );
    });

    it('should handle undefined message', async () => {
      sendMessageToActiveTab(undefined);

      expect(chromeMock.tabs.query).toHaveBeenCalled();

      await Promise.resolve();

      expect(chromeMock.tabs.sendMessage).toHaveBeenCalledWith(
        123,
        undefined
      );
    });
  });

  describe('message flow integration', () => {
    it('should complete full query -> sendMessage flow', async () => {
      const testMessage = { action: 'UPDATE_SETTING', value: true };

      // Verify the full flow
      chromeMock.tabs.query.mockImplementationOnce((queryInfo: any, callback?: Function) => {
        expect(queryInfo).toEqual({ active: true, currentWindow: true });

        const mockTabs = [{ id: 456, active: true }];
        if (callback) {
          callback(mockTabs);
        }
        return Promise.resolve(mockTabs);
      });

      sendMessageToActiveTab(testMessage);

      // Wait for microtasks to complete
      await Promise.resolve();

      expect(chromeMock.tabs.sendMessage).toHaveBeenCalledWith(
        456,
        testMessage
      );
    });
  });
});
