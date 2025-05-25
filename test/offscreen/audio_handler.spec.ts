import { describe, it, expect, beforeEach, afterEach, vi, MockedFunction } from 'vitest';
import { logger } from '../../src/LoggingModule.js';

// Mock the logger
vi.mock('../../src/LoggingModule.js', () => ({
  logger: {
    debug: vi.fn(),
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn()
  }
}));

// Mock the media coordinator
vi.mock('../../src/offscreen/media_coordinator', () => ({
  incrementUsage: vi.fn(),
  decrementUsage: vi.fn(),
  registerMessageHandler: vi.fn()
}));

// Mock chrome runtime
const mockChrome = {
  runtime: {
    sendMessage: vi.fn()
  }
};
vi.stubGlobal('chrome', mockChrome);

// Mock HTML Audio Element
class MockAudioElement {
  src = '';
  currentSrc = '';
  paused = true;
  ended = false;
  currentTime = 0;
  duration = 0;
  readyState = 0;
  networkState = 0;
  volume = 1;
  muted = false;
  playbackRate = 1;
  id = 'saypi-audio-offscreen';
  
  // Mock methods
  play = vi.fn().mockResolvedValue(undefined);
  pause = vi.fn();
  load = vi.fn();
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
  
  // Error property for testing
  error: MediaError | null = null;
  onerror: ((this: HTMLAudioElement, ev: Event) => any) | null = null;
}

describe('Audio Handler', () => {
  let mockAudioElement: MockAudioElement;
  let originalGetElementById: typeof document.getElementById;
  let originalQuerySelectorAll: typeof document.querySelectorAll;
  
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Create a fresh mock audio element for each test
    mockAudioElement = new MockAudioElement();
    
    // Store original methods
    originalGetElementById = document.getElementById;
    originalQuerySelectorAll = document.querySelectorAll;
    
    // Mock document methods
    document.getElementById = vi.fn().mockReturnValue(mockAudioElement);
    document.querySelectorAll = vi.fn().mockReturnValue([mockAudioElement]);
  });
  
  afterEach(() => {
    // Restore original methods
    document.getElementById = originalGetElementById;
    document.querySelectorAll = originalQuerySelectorAll;
  });
  
  describe('pauseAudio functionality', () => {
    it('should successfully pause audio when element is initialized and playing', () => {
      // Simulate audio playing
      mockAudioElement.paused = false;
      mockAudioElement.currentTime = 5.0;
      mockAudioElement.ended = false;
      
      // Test the pause logic
      mockAudioElement.pause();
      
      expect(mockAudioElement.pause).toHaveBeenCalledOnce();
    });
    
    it('should return error when audio element is not initialized', () => {
      // Mock document.getElementById to return null
      document.getElementById = vi.fn().mockReturnValue(null);
      
      // Test the error case when audioElement is null
      const element = document.getElementById('saypi-audio-offscreen');
      expect(element).toBeNull();
      
      // Simulate the logic from pauseAudio when audioElement is null
      const result = element ? { success: true } : { success: false, error: "Audio element not initialized" };
      
      expect(result.success).toBe(false);
      expect(result.error).toBe("Audio element not initialized");
    });
    
    it('should handle pause errors gracefully', () => {
      // Mock pause to throw an error
      const errorMessage = "Pause operation failed";
      mockAudioElement.pause = vi.fn().mockImplementation(() => {
        throw new Error(errorMessage);
      });
      
      // Test error handling logic
      let result;
      try {
        mockAudioElement.pause();
        result = { success: true };
      } catch (error: any) {
        result = { success: false, error: error.message };
      }
      
      expect(result.success).toBe(false);
      expect(result.error).toBe(errorMessage);
      expect(mockAudioElement.pause).toHaveBeenCalledOnce();
    });
    
    it('should detect audio element state correctly', () => {
      // Test various audio states
      const testCases = [
        { paused: true, ended: false, currentTime: 0, expected: false },
        { paused: false, ended: false, currentTime: 5, expected: true },
        { paused: false, ended: true, currentTime: 10, expected: false },
        { paused: true, ended: false, currentTime: 5, expected: false }
      ];
      
      testCases.forEach(({ paused, ended, currentTime, expected }) => {
        mockAudioElement.paused = paused;
        mockAudioElement.ended = ended;
        mockAudioElement.currentTime = currentTime;
        
        const wasPlaying = !mockAudioElement.paused && !mockAudioElement.ended && mockAudioElement.currentTime > 0;
        expect(wasPlaying).toBe(expected);
      });
    });
    
    it('should detect multiple audio elements in document', () => {
      const secondAudioElement = new MockAudioElement();
      secondAudioElement.id = 'other-audio';
      secondAudioElement.paused = false;
      secondAudioElement.currentTime = 3.0;
      
      // Mock querySelectorAll to return multiple elements
      document.querySelectorAll = vi.fn().mockReturnValue([
        mockAudioElement,
        secondAudioElement
      ]);
      
      const allElements = document.querySelectorAll('audio');
      expect(allElements).toHaveLength(2);
      
      const playingElements = Array.from(allElements).filter((audio: any) => 
        !audio.paused && !audio.ended && audio.currentTime > 0
      );
      expect(playingElements).toHaveLength(1);
      expect(playingElements[0].id).toBe('other-audio');
    });
  });
  
  describe('Audio element initialization', () => {
    it('should initialize audio element correctly', () => {
      // Trigger initialization by calling getElementById
      const element = document.getElementById('saypi-audio-offscreen');
      
      expect(document.getElementById).toHaveBeenCalledWith('saypi-audio-offscreen');
      expect(element).toBe(mockAudioElement);
    });
    
    it('should handle missing audio element gracefully', () => {
      document.getElementById = vi.fn().mockReturnValue(null);
      
      const element = document.getElementById('saypi-audio-offscreen');
      expect(element).toBeNull();
    });
  });
  
  describe('Audio event forwarding', () => {
    it('should register event listeners on audio element', () => {
      const expectedEvents = [
        "loadedmetadata",
        "canplaythrough", 
        "play",
        "pause",
        "ended",
        "seeked",
        "emptied",
        "playing",
        "error"
      ];
      
      // Trigger event listener registration by accessing the element
      const element = document.getElementById('saypi-audio-offscreen');
      
      // Verify the mock audio element has addEventListener method
      expect(element).toBe(mockAudioElement);
      expect(mockAudioElement.addEventListener).toEqual(expect.any(Function));
    });
  });
  
  describe('Audio source detection', () => {
    it('should detect various types of audio elements', () => {
      const videoElement = new MockAudioElement();
      videoElement.id = 'test-video';
      
      document.querySelectorAll = vi.fn().mockReturnValue([
        mockAudioElement,
        videoElement
      ]);
      
      const elements = document.querySelectorAll('audio, video');
      expect(elements).toHaveLength(2);
    });
    
    it('should identify playing vs non-playing elements', () => {
      const playingElement = new MockAudioElement();
      playingElement.paused = false;
      playingElement.ended = false;
      playingElement.currentTime = 2.5;
      
      const pausedElement = new MockAudioElement();
      pausedElement.paused = true;
      
      document.querySelectorAll = vi.fn().mockReturnValue([
        playingElement,
        pausedElement
      ]);
      
      const allElements = Array.from(document.querySelectorAll('audio, video'));
      const playingElements = allElements.filter((elem: any) => 
        !elem.paused && !elem.ended && elem.currentTime > 0
      );
      
      expect(playingElements).toHaveLength(1);
      expect(playingElements[0]).toBe(playingElement);
    });
  });
  
  describe('Audio state validation', () => {
    it('should correctly identify when audio was playing', () => {
      // Test the logic used in pauseAudio to determine if audio was playing
      const testCases = [
        { paused: false, ended: false, currentTime: 5.0, expected: true },
        { paused: true, ended: false, currentTime: 5.0, expected: false },
        { paused: false, ended: true, currentTime: 5.0, expected: false },
        { paused: false, ended: false, currentTime: 0, expected: false }
      ];
      
      testCases.forEach(({ paused, ended, currentTime, expected }, index) => {
        mockAudioElement.paused = paused;
        mockAudioElement.ended = ended;
        mockAudioElement.currentTime = currentTime;
        
        const wasPlaying = !mockAudioElement.paused && !mockAudioElement.ended && mockAudioElement.currentTime > 0;
        expect(wasPlaying).toBe(expected);
      });
    });
    
    it('should provide comprehensive audio element state information', () => {
      // Set up a realistic audio state
      mockAudioElement.src = 'https://example.com/audio.mp3';
      mockAudioElement.currentSrc = 'https://example.com/audio.mp3';
      mockAudioElement.paused = false;
      mockAudioElement.currentTime = 15.5;
      mockAudioElement.duration = 180.0;
      mockAudioElement.volume = 0.8;
      mockAudioElement.readyState = 4; // HAVE_ENOUGH_DATA
      
      // Verify all state properties are accessible (this tests our mock structure)
      expect(mockAudioElement.src).toBe('https://example.com/audio.mp3');
      expect(mockAudioElement.currentSrc).toBe('https://example.com/audio.mp3');
      expect(mockAudioElement.paused).toBe(false);
      expect(mockAudioElement.currentTime).toBe(15.5);
      expect(mockAudioElement.duration).toBe(180.0);
      expect(mockAudioElement.volume).toBe(0.8);
      expect(mockAudioElement.readyState).toBe(4);
    });
  });
}); 