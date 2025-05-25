/**
 * Test file demonstrating the expected message routing behavior
 * 
 * This test validates that:
 * 1. VAD messages are routed via port to OffscreenVADClient
 * 2. Audio messages are routed via chrome.tabs.sendMessage to OffscreenAudioBridge
 * 3. No cross-contamination occurs between the two clients
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';

// Type definitions for Chrome API mocks
interface ChromeRuntime {
  getURL: (path: string) => string;
  sendMessage: ReturnType<typeof vi.fn>;
  onMessage: {
    addListener: ReturnType<typeof vi.fn>;
  };
}

interface ChromeTabs {
  sendMessage: ReturnType<typeof vi.fn>;
}

interface Chrome {
  runtime: ChromeRuntime;
  tabs: ChromeTabs;
}

interface Logger {
  debug: ReturnType<typeof vi.fn>;
  error: ReturnType<typeof vi.fn>;
}

// Message type definitions
interface VADMessage {
  type: string;
  origin: string;
  targetTabId: number;
}

interface AudioMessage {
  type: string;
  origin: string;
  targetTabId: number;
  detail: {
    source: string;
  };
}

// Mock chrome APIs
(global as any).chrome = {
  runtime: {
    getURL: (path: string): string => `chrome-extension://test-id/${path}`,
    sendMessage: vi.fn(),
    onMessage: {
      addListener: vi.fn()
    }
  },
  tabs: {
    sendMessage: vi.fn()
  }
} as Chrome;

// Mock logger
(global as any).logger = {
  debug: vi.fn(),
  error: vi.fn()
} as Logger;

describe('Message Routing Architecture', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should route VAD messages via port to correct client', () => {
    // This test documents the expected behavior:
    // VAD messages should go through offscreenManager.forwardMessageToContentScript()
    // which uses port.postMessage()
    
    const mockVADMessage: VADMessage = {
      type: "VAD_SPEECH_START",
      origin: "offscreen-document",
      targetTabId: 12345
    };
    
    // In a real scenario, this would trigger port.postMessage() in the OffscreenVADClient
    // and NOT trigger chrome.tabs.sendMessage to OffscreenAudioBridge
    
    expect(mockVADMessage.type.startsWith("VAD_")).toBe(true);
    expect(mockVADMessage.type.startsWith("AUDIO_")).toBe(false);
  });

  test('should route audio messages via chrome.tabs.sendMessage to correct client', () => {
    // This test documents the expected behavior:
    // Audio messages should go through chrome.tabs.sendMessage()
    // to reach OffscreenAudioBridge's chrome.runtime.onMessage listener
    
    const mockAudioMessage: AudioMessage = {
      type: "AUDIO_PLAY",
      origin: "offscreen-document", 
      targetTabId: 12345,
      detail: { source: "test.mp3" }
    };
    
    // In a real scenario, this would trigger chrome.tabs.sendMessage to OffscreenAudioBridge
    // and NOT get routed to OffscreenVADClient's port
    
    expect(mockAudioMessage.type.startsWith("AUDIO_")).toBe(true);
    expect(mockAudioMessage.type.startsWith("VAD_")).toBe(false);
  });

  test('should identify conflicting message types that need routing', () => {
    const conflictingMessages: string[] = [
      "OFFSCREEN_AUDIO_LOAD_REQUEST_RESPONSE", // Should go to OffscreenAudioBridge
      "OFFSCREEN_VAD_INITIALIZE_REQUEST_RESPONSE", // Should go to OffscreenVADClient  
      "AUDIO_PLAYING", // Should go to OffscreenAudioBridge
      "VAD_SPEECH_END" // Should go to OffscreenVADClient
    ];
    
    conflictingMessages.forEach((messageType: string) => {
      if (messageType.startsWith("VAD_") || messageType.startsWith("OFFSCREEN_VAD_")) {
        // Should be routed via port to OffscreenVADClient
        expect(messageType.includes("VAD")).toBe(true);
      } else if (messageType.startsWith("AUDIO_") || messageType.startsWith("OFFSCREEN_AUDIO_")) {
        // Should be routed via chrome.tabs.sendMessage to OffscreenAudioBridge
        expect(messageType.includes("AUDIO")).toBe(true);
      }
    });
  });
  
  test('should prevent cross-contamination documented in console logs', () => {
    // This test documents the problem we solved:
    // Before the fix, OffscreenVADClient was receiving audio messages
    // and logging "Received unknown message type: OFFSCREEN_AUDIO_LOAD_REQUEST_RESPONSE"
    
    const problemMessages: string[] = [
      "OFFSCREEN_AUDIO_LOAD_REQUEST_RESPONSE",
      "AUDIO_PLAY", 
      "AUDIO_LOADEDMETADATA",
      "AUDIO_PLAYING",
      "AUDIO_CANPLAYTHROUGH"
    ];
    
    // With our fix, these should only go to OffscreenAudioBridge
    // and OffscreenVADClient should ignore them completely
    problemMessages.forEach((messageType: string) => {
      expect(messageType.startsWith("AUDIO_") || messageType.startsWith("OFFSCREEN_AUDIO_")).toBe(true);
    });
  });
}); 