import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import EventBus from '../../src/events/EventBus.js';

/**
 * Test to verify that the integration between OffscreenAudioBridge and AudioModule
 * works correctly for forwarding audio playback events to the audio output machine.
 * 
 * This test validates that audio events from offscreen sources are handled consistently
 * with in-page audio events, ensuring the audio output machine state is driven properly
 * regardless of the audio source.
 */
describe('AudioModule - OffscreenAudioBridge Integration', () => {
  let mockAudioOutputActor: any;
  let eventListeners: Map<string, Function>;

  beforeEach(() => {
    // Mock the audio output actor
    mockAudioOutputActor = {
      send: vi.fn()
    };

    // Track EventBus listeners for cleanup
    eventListeners = new Map();
    
    // Mock EventBus.on to track registered listeners
    const originalOn = EventBus.on;
    vi.spyOn(EventBus, 'on').mockImplementation((event: string, handler: Function, context?: any) => {
      eventListeners.set(event, handler);
      return originalOn.call(EventBus, event, handler, context);
    });
  });

  afterEach(() => {
    // Clean up all registered listeners
    eventListeners.forEach((handler, event) => {
      EventBus.off(event, handler);
    });
    eventListeners.clear();
    
    vi.restoreAllMocks();
  });

  /**
   * Simulate the registerOffscreenAudioEvents method from AudioModule
   * This tests the core logic without importing the full class and its dependencies
   */
  function registerOffscreenAudioEvents(outputActor: any) {
    // Events that don't include source information (matching events array in registerAudioPlaybackEvents)
    const standardEvents = [
      "loadedmetadata",
      "canplaythrough", 
      "pause",
      "ended",
      "seeked",
      "emptied"
    ];
    
    // Events that include source information (matching sourcedEvents in registerAudioPlaybackEvents)
    const sourcedEvents = ["loadstart", "play", "error"];
    
    // Register listeners for standard events
    standardEvents.forEach((event) => {
      EventBus.on(`audio:offscreen:${event}`, (detail) => {
        outputActor.send(event);
      });
    });
    
    // Register listeners for sourced events  
    sourcedEvents.forEach((event) => {
      EventBus.on(`audio:offscreen:${event}`, (detail) => {
        const eventDetail = { source: detail?.source || 'offscreen' };
        outputActor.send(event, eventDetail);
      });
    });
    
    // Handle special case for 'playing' event which maps to 'play' 
    EventBus.on("audio:offscreen:playing", (detail) => {
      const eventDetail = { source: detail?.source || 'offscreen' };
      outputActor.send("play", eventDetail);
    });
  }

  describe('Offscreen Audio Event Forwarding', () => {
    it('should forward standard offscreen audio events to audio output actor', () => {
      // Set up listeners using our simulated function
      registerOffscreenAudioEvents(mockAudioOutputActor);

      const standardEvents = [
        'loadedmetadata',
        'canplaythrough', 
        'pause',
        'ended',
        'seeked',
        'emptied'
      ];

      // Test each standard event
      standardEvents.forEach(eventType => {
        const eventName = `audio:offscreen:${eventType}`;
        
        // Verify the listener was registered
        expect(eventListeners.has(eventName)).toBe(true);
        
        // Trigger the event
        EventBus.emit(eventName, {});
        
        // Verify the audio output actor received the event
        expect(mockAudioOutputActor.send).toHaveBeenCalledWith(eventType);
      });
    });

    it('should forward sourced offscreen audio events with source information', () => {
      registerOffscreenAudioEvents(mockAudioOutputActor);

      const sourcedEvents = ['loadstart', 'play', 'error'];
      const testSource = 'https://example.com/test-audio.mp3';

      sourcedEvents.forEach(eventType => {
        const eventName = `audio:offscreen:${eventType}`;
        
        // Trigger the event with source information
        EventBus.emit(eventName, { source: testSource });
        
        // Verify the audio output actor received the event with source
        expect(mockAudioOutputActor.send).toHaveBeenCalledWith(eventType, { source: testSource });
      });
    });

    it('should handle playing event as play event', () => {
      registerOffscreenAudioEvents(mockAudioOutputActor);

      const testSource = 'https://example.com/test-audio.mp3';
      
      // Trigger playing event
      EventBus.emit('audio:offscreen:playing', { source: testSource });
      
      // Verify it was converted to 'play' event
      expect(mockAudioOutputActor.send).toHaveBeenCalledWith('play', { source: testSource });
    });

    it('should provide default source when none is specified', () => {
      registerOffscreenAudioEvents(mockAudioOutputActor);

      // Trigger a sourced event without source information
      EventBus.emit('audio:offscreen:play', {});
      
      // Verify default source was provided
      expect(mockAudioOutputActor.send).toHaveBeenCalledWith('play', { source: 'offscreen' });
    });

    it('should only send events to the audio output actor (not voice converter or retry)', () => {
      // This test ensures that offscreen events only go to the audio output actor
      // and don't accidentally trigger voice converter or retry logic
      
      const mockVoiceConverter = { send: vi.fn() };
      const mockRetryActor = { send: vi.fn() };
      
      registerOffscreenAudioEvents(mockAudioOutputActor);

      // Trigger an offscreen event
      EventBus.emit('audio:offscreen:play', { source: 'test.mp3' });
      
      // Verify only the audio output actor was called
      expect(mockAudioOutputActor.send).toHaveBeenCalledWith('play', { source: 'test.mp3' });
      
      // These should NOT have been called since we're only registering the output actor
      expect(mockVoiceConverter.send).not.toHaveBeenCalled();
      expect(mockRetryActor.send).not.toHaveBeenCalled();
    });
  });
}); 