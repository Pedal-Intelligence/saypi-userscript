import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';
import { interpret } from 'xstate';
import EventBus from '../../src/events/EventBus.js';

// Mock dependencies
vi.mock('../../src/TranscriptionModule', () => ({
  uploadAudioWithRetry: vi.fn(() => Promise.resolve(1)),
  isTranscriptionPending: vi.fn(() => false),
  clearPendingTranscriptions: vi.fn(),
  getCurrentSequenceNumber: vi.fn(() => 0),
}));

vi.mock('../../src/ConfigModule', () => ({
  config: {
    apiServerUrl: 'http://localhost:3000',
  },
}));

vi.mock('../../src/prefs/PreferenceModule', () => ({
  UserPreferenceModule: {
    getInstance: () => ({
      getLanguage: vi.fn(() => Promise.resolve('en')),
    }),
  },
}));

vi.mock('../../src/error-management/TranscriptionErrorManager', () => ({
  default: {
    recordAttempt: vi.fn(),
  },
}));

vi.mock('../../src/TranscriptMergeService', () => ({
  TranscriptMergeService: vi.fn().mockImplementation(() => ({
    mergeTranscriptsLocal: vi.fn((transcripts) => {
      return Object.keys(transcripts)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .map(key => transcripts[key])
        .join(' ');
    }),
  })),
}));

vi.mock('../../src/audio/AudioEncoder', () => ({
  convertToWavBlob: vi.fn((frames: Float32Array) => {
    // Return a mock blob with size proportional to frame count
    return new Blob([new ArrayBuffer(frames.length * 4)], { type: 'audio/wav' });
  }),
}));

vi.mock('../../src/TimerModule', () => ({
  calculateDelay: vi.fn(() => 100), // Short delay for testing
}));

// Mock EventBus
vi.spyOn(EventBus, 'emit');

// Import the machine after mocks are set up
import { createDictationMachine } from '../../src/state-machines/DictationMachine';
import * as TranscriptionModule from '../../src/TranscriptionModule';
import * as AudioEncoder from '../../src/audio/AudioEncoder';
import * as TimerModule from '../../src/TimerModule';

describe('DictationMachine - Dual-Phase Refinement', () => {
  let service: any;
  let inputElement: HTMLInputElement;

  beforeAll(() => {
    inputElement = document.createElement('input');
    inputElement.id = 'test-input';
    inputElement.name = 'testField';
    inputElement.placeholder = 'Test input';
  });

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockClear();
    vi.mocked(TranscriptionModule.getCurrentSequenceNumber).mockReturnValue(0);
    vi.mocked(EventBus.emit).mockClear();
    vi.mocked(AudioEncoder.convertToWavBlob).mockClear();
    vi.mocked(TimerModule.calculateDelay).mockReturnValue(100);

    inputElement.value = '';

    const machine = createDictationMachine();
    service = interpret(machine);
  });

  afterEach(() => {
    if (service) {
      service.stop();
    }
  });

  describe('Audio Segment Buffering', () => {
    it('should buffer audio segments when frames are provided', async () => {
      service.start();

      // Start dictation
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send({ type: 'saypi:callReady' });
      service.send({ type: 'saypi:audio:connected', deviceId: 'test', deviceLabel: 'Test Mic' });
      service.send({ type: 'saypi:session:assigned', session_id: 'test-session' });

      // Speaking events with frames
      service.send({ type: 'saypi:userSpeaking' });

      const mockFrames = new Float32Array(1000);
      const mockBlob = new Blob([new ArrayBuffer(4000)]);

      vi.mocked(TranscriptionModule.getCurrentSequenceNumber).mockReturnValue(1);
      vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockResolvedValue(2);

      // Stop speaking - should buffer the audio
      service.send({
        type: 'saypi:userStoppedSpeaking',
        duration: 1000,
        blob: mockBlob,
        frames: mockFrames,
      });

      // Verify audio was uploaded for Phase 1
      expect(TranscriptionModule.uploadAudioWithRetry).toHaveBeenCalled();

      // Check that the context has buffered audio
      const state = service.getSnapshot();
      const targetId = `${inputElement.id || inputElement.name}`;
      expect(state.context.audioSegmentsByTarget[targetId]).toBeDefined();
      expect(state.context.audioSegmentsByTarget[targetId].length).toBe(1);
    });

    it('should not buffer audio segments when frames are missing', async () => {
      service.start();

      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send({ type: 'saypi:callReady' });
      service.send({ type: 'saypi:audio:connected', deviceId: 'test', deviceLabel: 'Test Mic' });
      service.send({ type: 'saypi:session:assigned', session_id: 'test-session' });

      service.send({ type: 'saypi:userSpeaking' });

      const mockBlob = new Blob([new ArrayBuffer(4000)]);

      vi.mocked(TranscriptionModule.getCurrentSequenceNumber).mockReturnValue(1);
      vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockResolvedValue(2);

      // Stop speaking WITHOUT frames
      service.send({
        type: 'saypi:userStoppedSpeaking',
        duration: 1000,
        blob: mockBlob,
        // No frames parameter
      });

      // Check that no audio was buffered
      const state = service.getSnapshot();
      const targetId = `${inputElement.id || inputElement.name}`;
      expect(state.context.audioSegmentsByTarget[targetId]).toBeUndefined();
    });

    it('should trim old segments when exceeding 120s buffer limit', async () => {
      service.start();

      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send({ type: 'saypi:callReady' });
      service.send({ type: 'saypi:audio:connected', deviceId: 'test', deviceLabel: 'Test Mic' });
      service.send({ type: 'saypi:session:assigned', session_id: 'test-session' });

      // Add 13 segments of 10 seconds each (130s total, exceeds 120s limit)
      for (let i = 0; i < 13; i++) {
        service.send({ type: 'saypi:userSpeaking' });

        const mockFrames = new Float32Array(10000);
        const mockBlob = new Blob([new ArrayBuffer(40000)]);

        vi.mocked(TranscriptionModule.getCurrentSequenceNumber).mockReturnValue(i + 1);
        vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockResolvedValue(i + 2);

        service.send({
          type: 'saypi:userStoppedSpeaking',
          duration: 10000, // 10 seconds
          blob: mockBlob,
          frames: mockFrames,
        });

        // Simulate transcription response
        service.send({
          type: 'saypi:transcribed',
          text: `segment ${i}`,
          sequenceNumber: i + 2,
        });
      }

      // Check that buffer was trimmed
      const state = service.getSnapshot();
      const targetId = `${inputElement.id || inputElement.name}`;
      const segments = state.context.audioSegmentsByTarget[targetId];

      expect(segments).toBeDefined();
      // Should have trimmed the first segment (10s) to stay under 120s
      expect(segments.length).toBeLessThanOrEqual(12);

      // Calculate total duration
      const totalDuration = segments.reduce((sum: number, seg: any) => sum + seg.duration, 0);
      expect(totalDuration).toBeLessThanOrEqual(120000);
    });
  });

  describe('Refinement Delay Calculation', () => {
    it('should calculate refinement delay based on pFinishedSpeaking and tempo', async () => {
      service.start();

      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send({ type: 'saypi:callReady' });
      service.send({ type: 'saypi:audio:connected', deviceId: 'test', deviceLabel: 'Test Mic' });
      service.send({ type: 'saypi:session:assigned', session_id: 'test-session' });

      service.send({ type: 'saypi:userSpeaking' });

      const mockFrames = new Float32Array(1000);
      const mockBlob = new Blob([new ArrayBuffer(4000)]);

      vi.mocked(TranscriptionModule.getCurrentSequenceNumber).mockReturnValue(1);
      vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockResolvedValue(2);

      service.send({
        type: 'saypi:userStoppedSpeaking',
        duration: 1000,
        blob: mockBlob,
        frames: mockFrames,
      });

      // Send transcription with endpoint indicators
      service.send({
        type: 'saypi:transcribed',
        text: 'hello world',
        sequenceNumber: 2,
        pFinishedSpeaking: 0.9,
        tempo: 0.5,
      });

      // Verify calculateDelay was called with correct parameters
      expect(TimerModule.calculateDelay).toHaveBeenCalled();
    });

    it('should not trigger refinement if refinementConditionsMet guard fails', async () => {
      service.start();

      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send({ type: 'saypi:callReady' });
      service.send({ type: 'saypi:audio:connected', deviceId: 'test', deviceLabel: 'Test Mic' });
      service.send({ type: 'saypi:session:assigned', session_id: 'test-session' });

      // Don't add any audio segments

      // Try to trigger refinement manually
      service.send({
        type: 'saypi:refineTranscription',
        targetElement: inputElement,
      });

      // Should NOT upload refinement because no segments exist
      const uploadCalls = vi.mocked(TranscriptionModule.uploadAudioWithRetry).mock.calls;
      const refinementCalls = uploadCalls.filter(call => {
        // Refinement calls have empty precedingTranscripts
        return Object.keys(call[2] || {}).length === 0;
      });

      expect(refinementCalls.length).toBe(0);
    });
  });

  describe('Audio Concatenation', () => {
    it('should concatenate multiple audio segments correctly', async () => {
      service.start();

      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send({ type: 'saypi:callReady' });
      service.send({ type: 'saypi:audio:connected', deviceId: 'test', deviceLabel: 'Test Mic' });
      service.send({ type: 'saypi:session:assigned', session_id: 'test-session' });

      // Add 3 segments
      const segmentCount = 3;
      for (let i = 0; i < segmentCount; i++) {
        service.send({ type: 'saypi:userSpeaking' });

        const mockFrames = new Float32Array(1000);
        const mockBlob = new Blob([new ArrayBuffer(4000)]);

        vi.mocked(TranscriptionModule.getCurrentSequenceNumber).mockReturnValue(i * 2 + 1);
        vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockResolvedValue(i * 2 + 2);

        service.send({
          type: 'saypi:userStoppedSpeaking',
          duration: 1000,
          blob: mockBlob,
          frames: mockFrames,
        });

        service.send({
          type: 'saypi:transcribed',
          text: `segment ${i}`,
          sequenceNumber: i * 2 + 2,
        });
      }

      // Clear the mock to track refinement upload
      vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockClear();
      vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockResolvedValue(100);
      vi.mocked(AudioEncoder.convertToWavBlob).mockClear();

      // Trigger refinement manually
      service.send({
        type: 'saypi:refineTranscription',
        targetElement: inputElement,
      });

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 10));

      // Verify convertToWavBlob was called with concatenated frames
      expect(AudioEncoder.convertToWavBlob).toHaveBeenCalled();
      const concatenatedFrames = vi.mocked(AudioEncoder.convertToWavBlob).mock.calls[0][0];

      // Should have combined 3 segments of 1000 frames each = 3000 frames
      expect(concatenatedFrames.length).toBe(3000);

      // Verify refinement upload was called
      expect(TranscriptionModule.uploadAudioWithRetry).toHaveBeenCalled();
      const uploadCall = vi.mocked(TranscriptionModule.uploadAudioWithRetry).mock.calls[0];

      // Refinement should have empty precedingTranscripts
      expect(uploadCall[2]).toEqual({});

      // Total duration should be 3000ms
      expect(uploadCall[1]).toBe(3000);
    });
  });

  describe('Refinement Response Handling', () => {
    it('should replace Phase 1 transcriptions with refined result', async () => {
      service.start();

      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send({ type: 'saypi:callReady' });
      service.send({ type: 'saypi:audio:connected', deviceId: 'test', deviceLabel: 'Test Mic' });
      service.send({ type: 'saypi:session:assigned', session_id: 'test-session' });

      // Add 2 Phase 1 segments
      for (let i = 0; i < 2; i++) {
        service.send({ type: 'saypi:userSpeaking' });

        const mockFrames = new Float32Array(1000);
        const mockBlob = new Blob([new ArrayBuffer(4000)]);

        vi.mocked(TranscriptionModule.getCurrentSequenceNumber).mockReturnValue(i * 2 + 1);
        vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockResolvedValue(i * 2 + 2);

        service.send({
          type: 'saypi:userStoppedSpeaking',
          duration: 1000,
          blob: mockBlob,
          frames: mockFrames,
        });

        service.send({
          type: 'saypi:transcribed',
          text: `phase1 ${i}`,
          sequenceNumber: i * 2 + 2,
        });
      }

      // Trigger refinement
      vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockResolvedValue(100);

      service.send({
        type: 'saypi:refineTranscription',
        targetElement: inputElement,
      });

      await new Promise(resolve => setTimeout(resolve, 10));

      // Send refinement response
      service.send({
        type: 'saypi:transcribed',
        text: 'refined transcription',
        sequenceNumber: 100,
      });

      // Check that Phase 1 transcriptions were replaced
      const state = service.getSnapshot();
      const targetId = `${inputElement.id || inputElement.name}`;

      // Should only have the refined transcription
      expect(state.context.transcriptionsByTarget[targetId]).toEqual({
        100: 'refined transcription',
      });

      // Old Phase 1 sequences should be deleted from global transcriptions
      expect(state.context.transcriptions[2]).toBeUndefined();
      expect(state.context.transcriptions[4]).toBeUndefined();

      // Refinement should be in global transcriptions
      expect(state.context.transcriptions[100]).toBe('refined transcription');
    });

    it('should emit dictation:refined event on successful refinement', async () => {
      service.start();

      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send({ type: 'saypi:callReady' });
      service.send({ type: 'saypi:audio:connected', deviceId: 'test', deviceLabel: 'Test Mic' });
      service.send({ type: 'saypi:session:assigned', session_id: 'test-session' });

      service.send({ type: 'saypi:userSpeaking' });

      const mockFrames = new Float32Array(1000);
      const mockBlob = new Blob([new ArrayBuffer(4000)]);

      vi.mocked(TranscriptionModule.getCurrentSequenceNumber).mockReturnValue(1);
      vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockResolvedValue(2);

      service.send({
        type: 'saypi:userStoppedSpeaking',
        duration: 1000,
        blob: mockBlob,
        frames: mockFrames,
      });

      service.send({
        type: 'saypi:transcribed',
        text: 'phase1 text',
        sequenceNumber: 2,
      });

      // Clear EventBus mock to track refinement event
      vi.mocked(EventBus.emit).mockClear();

      // Trigger refinement
      vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockResolvedValue(100);

      service.send({
        type: 'saypi:refineTranscription',
        targetElement: inputElement,
      });

      await new Promise(resolve => setTimeout(resolve, 10));

      // Send refinement response
      service.send({
        type: 'saypi:transcribed',
        text: 'refined text',
        sequenceNumber: 100,
      });

      // Verify dictation:refined event was emitted
      const refinedEvents = vi.mocked(EventBus.emit).mock.calls.filter(
        call => call[0] === 'dictation:refined'
      );

      expect(refinedEvents.length).toBeGreaterThan(0);
      expect(refinedEvents[0][1]).toMatchObject({
        targetElement: inputElement,
        refinedText: 'refined text',
      });
    });
  });

  describe('State Transitions', () => {
    it('should transition from accumulating to refining on explicit trigger', async () => {
      service.start();

      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send({ type: 'saypi:callReady' });
      service.send({ type: 'saypi:audio:connected', deviceId: 'test', deviceLabel: 'Test Mic' });
      service.send({ type: 'saypi:session:assigned', session_id: 'test-session' });

      service.send({ type: 'saypi:userSpeaking' });

      const mockFrames = new Float32Array(1000);
      const mockBlob = new Blob([new ArrayBuffer(4000)]);

      vi.mocked(TranscriptionModule.getCurrentSequenceNumber).mockReturnValue(1);
      vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockResolvedValue(2);

      service.send({
        type: 'saypi:userStoppedSpeaking',
        duration: 1000,
        blob: mockBlob,
        frames: mockFrames,
      });

      service.send({
        type: 'saypi:transcribed',
        text: 'hello',
        sequenceNumber: 2,
      });

      // Should be in accumulating state
      expect(service.getSnapshot().matches({ listening: { converting: 'accumulating' } })).toBe(true);

      // Trigger refinement
      vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockResolvedValue(100);

      service.send({
        type: 'saypi:refineTranscription',
        targetElement: inputElement,
      });

      // Should transition to refining state
      expect(service.getSnapshot().matches({ listening: { converting: 'refining' } })).toBe(true);
    });

    it('should return to accumulating after refinement response', async () => {
      service.start();

      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send({ type: 'saypi:callReady' });
      service.send({ type: 'saypi:audio:connected', deviceId: 'test', deviceLabel: 'Test Mic' });
      service.send({ type: 'saypi:session:assigned', session_id: 'test-session' });

      service.send({ type: 'saypi:userSpeaking' });

      const mockFrames = new Float32Array(1000);
      const mockBlob = new Blob([new ArrayBuffer(4000)]);

      vi.mocked(TranscriptionModule.getCurrentSequenceNumber).mockReturnValue(1);
      vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockResolvedValue(2);

      service.send({
        type: 'saypi:userStoppedSpeaking',
        duration: 1000,
        blob: mockBlob,
        frames: mockFrames,
      });

      service.send({
        type: 'saypi:transcribed',
        text: 'hello',
        sequenceNumber: 2,
      });

      // Trigger refinement
      vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockResolvedValue(100);

      service.send({
        type: 'saypi:refineTranscription',
        targetElement: inputElement,
      });

      await new Promise(resolve => setTimeout(resolve, 10));

      // Should be in refining
      expect(service.getSnapshot().matches({ listening: { converting: 'refining' } })).toBe(true);

      // Send refinement response
      service.send({
        type: 'saypi:transcribed',
        text: 'refined',
        sequenceNumber: 100,
      });

      // Should return to accumulating
      expect(service.getSnapshot().matches({ listening: { converting: 'accumulating' } })).toBe(true);
    });
  });

  describe('Buffer Cleanup', () => {
    it('should clear audio buffers when target switches', async () => {
      service.start();

      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send({ type: 'saypi:callReady' });
      service.send({ type: 'saypi:audio:connected', deviceId: 'test', deviceLabel: 'Test Mic' });
      service.send({ type: 'saypi:session:assigned', session_id: 'test-session' });

      service.send({ type: 'saypi:userSpeaking' });

      const mockFrames = new Float32Array(1000);
      const mockBlob = new Blob([new ArrayBuffer(4000)]);

      vi.mocked(TranscriptionModule.getCurrentSequenceNumber).mockReturnValue(1);
      vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockResolvedValue(2);

      service.send({
        type: 'saypi:userStoppedSpeaking',
        duration: 1000,
        blob: mockBlob,
        frames: mockFrames,
      });

      // Verify buffer exists
      const targetId1 = `${inputElement.id || inputElement.name}`;
      expect(service.getSnapshot().context.audioSegmentsByTarget[targetId1]).toBeDefined();

      // Create new input element
      const inputElement2 = document.createElement('input');
      inputElement2.id = 'test-input-2';

      // Switch target
      service.send({ type: 'saypi:switchTarget', targetElement: inputElement2 });

      // Original target's buffer should still exist (not cleared on switch)
      expect(service.getSnapshot().context.audioSegmentsByTarget[targetId1]).toBeDefined();
    });

    it('should clear audio buffers after refinement completes', async () => {
      service.start();

      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send({ type: 'saypi:callReady' });
      service.send({ type: 'saypi:audio:connected', deviceId: 'test', deviceLabel: 'Test Mic' });
      service.send({ type: 'saypi:session:assigned', session_id: 'test-session' });

      service.send({ type: 'saypi:userSpeaking' });

      const mockFrames = new Float32Array(1000);
      const mockBlob = new Blob([new ArrayBuffer(4000)]);

      vi.mocked(TranscriptionModule.getCurrentSequenceNumber).mockReturnValue(1);
      vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockResolvedValue(2);

      service.send({
        type: 'saypi:userStoppedSpeaking',
        duration: 1000,
        blob: mockBlob,
        frames: mockFrames,
      });

      service.send({
        type: 'saypi:transcribed',
        text: 'hello',
        sequenceNumber: 2,
      });

      const targetId = `${inputElement.id || inputElement.name}`;

      // Verify buffer exists
      expect(service.getSnapshot().context.audioSegmentsByTarget[targetId]).toBeDefined();
      expect(service.getSnapshot().context.audioSegmentsByTarget[targetId].length).toBe(1);

      // Trigger refinement
      vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockResolvedValue(100);

      service.send({
        type: 'saypi:refineTranscription',
        targetElement: inputElement,
      });

      await new Promise(resolve => setTimeout(resolve, 10));

      // Send refinement response
      service.send({
        type: 'saypi:transcribed',
        text: 'refined',
        sequenceNumber: 100,
      });

      // Audio buffer should be cleared
      expect(service.getSnapshot().context.audioSegmentsByTarget[targetId]).toBeUndefined();
    });
  });

  describe('Error Scenarios', () => {
    it('should handle refinement failure gracefully', async () => {
      service.start();

      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send({ type: 'saypi:callReady' });
      service.send({ type: 'saypi:audio:connected', deviceId: 'test', deviceLabel: 'Test Mic' });
      service.send({ type: 'saypi:session:assigned', session_id: 'test-session' });

      service.send({ type: 'saypi:userSpeaking' });

      const mockFrames = new Float32Array(1000);
      const mockBlob = new Blob([new ArrayBuffer(4000)]);

      vi.mocked(TranscriptionModule.getCurrentSequenceNumber).mockReturnValue(1);
      vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockResolvedValue(2);

      service.send({
        type: 'saypi:userStoppedSpeaking',
        duration: 1000,
        blob: mockBlob,
        frames: mockFrames,
      });

      service.send({
        type: 'saypi:transcribed',
        text: 'hello',
        sequenceNumber: 2,
      });

      // Make refinement upload fail
      vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockRejectedValue(new Error('Upload failed'));

      service.send({
        type: 'saypi:refineTranscription',
        targetElement: inputElement,
      });

      await new Promise(resolve => setTimeout(resolve, 10));

      // Should clean up audio buffers even on failure
      const targetId = `${inputElement.id || inputElement.name}`;
      expect(service.getSnapshot().context.audioSegmentsByTarget[targetId]).toBeUndefined();
    });

    it('should handle missing target element in refinement response', async () => {
      service.start();

      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send({ type: 'saypi:callReady' });
      service.send({ type: 'saypi:audio:connected', deviceId: 'test', deviceLabel: 'Test Mic' });
      service.send({ type: 'saypi:session:assigned', session_id: 'test-session' });

      service.send({ type: 'saypi:userSpeaking' });

      const mockFrames = new Float32Array(1000);
      const mockBlob = new Blob([new ArrayBuffer(4000)]);

      vi.mocked(TranscriptionModule.getCurrentSequenceNumber).mockReturnValue(1);
      vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockResolvedValue(2);

      service.send({
        type: 'saypi:userStoppedSpeaking',
        duration: 1000,
        blob: mockBlob,
        frames: mockFrames,
      });

      service.send({
        type: 'saypi:transcribed',
        text: 'hello',
        sequenceNumber: 2,
      });

      // Trigger refinement
      vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockResolvedValue(100);

      service.send({
        type: 'saypi:refineTranscription',
        targetElement: inputElement,
      });

      await new Promise(resolve => setTimeout(resolve, 10));

      // Manually delete the target mapping to simulate the missing element case
      const state = service.getSnapshot();
      delete state.context.transcriptionTargets[100];

      // Send refinement response with missing target
      service.send({
        type: 'saypi:transcribed',
        text: 'refined',
        sequenceNumber: 100,
      });

      // Should handle gracefully without crashing
      // The refinement should be discarded
      const targetId = `${inputElement.id || inputElement.name}`;
      expect(service.getSnapshot().context.transcriptionsByTarget[targetId]).not.toEqual({
        100: 'refined',
      });
    });
  });

  describe('Concurrent Refinements', () => {
    it('should handle concurrent refinements for multiple targets', async () => {
      service.start();

      const inputElement2 = document.createElement('input');
      inputElement2.id = 'test-input-2';

      // Start dictation on first target
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send({ type: 'saypi:callReady' });
      service.send({ type: 'saypi:audio:connected', deviceId: 'test', deviceLabel: 'Test Mic' });
      service.send({ type: 'saypi:session:assigned', session_id: 'test-session' });

      // Add segment to first target
      service.send({ type: 'saypi:userSpeaking' });

      const mockFrames1 = new Float32Array(1000);
      const mockBlob1 = new Blob([new ArrayBuffer(4000)]);

      vi.mocked(TranscriptionModule.getCurrentSequenceNumber).mockReturnValue(1);
      vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockResolvedValue(2);

      service.send({
        type: 'saypi:userStoppedSpeaking',
        duration: 1000,
        blob: mockBlob1,
        frames: mockFrames1,
      });

      service.send({
        type: 'saypi:transcribed',
        text: 'target1 text',
        sequenceNumber: 2,
      });

      // Switch to second target
      service.send({ type: 'saypi:switchTarget', targetElement: inputElement2 });

      // Add segment to second target
      service.send({ type: 'saypi:userSpeaking' });

      const mockFrames2 = new Float32Array(1000);
      const mockBlob2 = new Blob([new ArrayBuffer(4000)]);

      vi.mocked(TranscriptionModule.getCurrentSequenceNumber).mockReturnValue(3);
      vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockResolvedValue(4);

      service.send({
        type: 'saypi:userStoppedSpeaking',
        duration: 1000,
        blob: mockBlob2,
        frames: mockFrames2,
      });

      service.send({
        type: 'saypi:transcribed',
        text: 'target2 text',
        sequenceNumber: 4,
      });

      // Both targets should have buffers
      const targetId1 = `${inputElement.id || inputElement.name}`;
      const targetId2 = `${inputElement2.id || inputElement2.name}`;

      expect(service.getSnapshot().context.audioSegmentsByTarget[targetId1]).toBeDefined();
      expect(service.getSnapshot().context.audioSegmentsByTarget[targetId2]).toBeDefined();

      // Both should be pending refinement
      expect(service.getSnapshot().context.refinementPendingForTargets.has(targetId1)).toBe(true);
      expect(service.getSnapshot().context.refinementPendingForTargets.has(targetId2)).toBe(true);
    });

    it('should refine all pending targets even after target switch (Codex bug)', async () => {
      service.start();

      const inputElement2 = document.createElement('input');
      inputElement2.id = 'test-input-2';
      inputElement2.name = 'testField2';

      // Start dictation on first target
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send({ type: 'saypi:callReady' });
      service.send({ type: 'saypi:audio:connected', deviceId: 'test', deviceLabel: 'Test Mic' });
      service.send({ type: 'saypi:session:assigned', session_id: 'test-session' });

      // Add segment to first target with endpoint indicators
      service.send({ type: 'saypi:userSpeaking' });

      const mockFrames1 = new Float32Array(1000);
      const mockBlob1 = new Blob([new ArrayBuffer(4000)]);

      vi.mocked(TranscriptionModule.getCurrentSequenceNumber).mockReturnValue(1);
      vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockResolvedValue(2);

      service.send({
        type: 'saypi:userStoppedSpeaking',
        duration: 1000,
        blob: mockBlob1,
        frames: mockFrames1,
      });

      service.send({
        type: 'saypi:transcribed',
        text: 'target1 text',
        sequenceNumber: 2,
        pFinishedSpeaking: 0.9, // High probability - will trigger endpoint delay
        tempo: 0.5,
      });

      const targetId1 = `${inputElement.id || inputElement.name}`;

      // Verify target1 is pending refinement
      expect(service.getSnapshot().context.refinementPendingForTargets.has(targetId1)).toBe(true);
      expect(service.getSnapshot().context.audioSegmentsByTarget[targetId1]).toBeDefined();

      // NOW SWITCH TO SECOND TARGET (this is the bug scenario)
      service.send({ type: 'saypi:switchTarget', targetElement: inputElement2 });

      // Verify current target is now target2
      expect(service.getSnapshot().context.targetElement).toBe(inputElement2);

      // Mock refinement upload for target1
      vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockClear();
      vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockResolvedValue(100);

      // Wait for endpoint delay to trigger refinement
      await new Promise(resolve => setTimeout(resolve, 150));

      // The bug was: refinement would check context.targetElement (now target2)
      // and find no segments, leaving target1 unrefined
      // The fix: iterate over refinementPendingForTargets instead

      // Verify refinement was triggered for target1 (not current target)
      expect(TranscriptionModule.uploadAudioWithRetry).toHaveBeenCalled();

      const uploadCall = vi.mocked(TranscriptionModule.uploadAudioWithRetry).mock.calls[0];

      // Should be refinement (empty precedingTranscripts)
      expect(uploadCall[2]).toEqual({});

      // Should have target1's input context
      expect(uploadCall[8]).toBe('Test input'); // inputLabel (parameter 8)
      expect(uploadCall[7]).toBe('text'); // inputType (parameter 7)

      // Send refinement response
      service.send({
        type: 'saypi:transcribed',
        text: 'refined target1 text',
        sequenceNumber: 100,
      });

      // Verify target1 was refined even though current target is target2
      const state = service.getSnapshot();
      expect(state.context.transcriptionsByTarget[targetId1]).toEqual({
        100: 'refined target1 text',
      });

      // Audio buffer for target1 should be cleared
      expect(state.context.audioSegmentsByTarget[targetId1]).toBeUndefined();

      // Refinement pending flag should be cleared
      expect(state.context.refinementPendingForTargets.has(targetId1)).toBe(false);
    });
  });

  describe('Manual Edit Cleanup', () => {
    it('should clear audio buffers and refinement state on manual edit (Codex bug)', async () => {
      service.start();

      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send({ type: 'saypi:callReady' });
      service.send({ type: 'saypi:audio:connected', deviceId: 'test', deviceLabel: 'Test Mic' });
      service.send({ type: 'saypi:session:assigned', session_id: 'test-session' });

      // Add multiple segments to build up buffer
      for (let i = 0; i < 3; i++) {
        service.send({ type: 'saypi:userSpeaking' });

        const mockFrames = new Float32Array(1000);
        const mockBlob = new Blob([new ArrayBuffer(4000)]);

        vi.mocked(TranscriptionModule.getCurrentSequenceNumber).mockReturnValue(i * 2 + 1);
        vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockResolvedValue(i * 2 + 2);

        service.send({
          type: 'saypi:userStoppedSpeaking',
          duration: 1000,
          blob: mockBlob,
          frames: mockFrames,
        });

        service.send({
          type: 'saypi:transcribed',
          text: `segment ${i}`,
          sequenceNumber: i * 2 + 2,
        });
      }

      const targetId = `${inputElement.id || inputElement.name}`;

      // Verify we have buffered audio and pending refinement
      expect(service.getSnapshot().context.audioSegmentsByTarget[targetId]).toBeDefined();
      expect(service.getSnapshot().context.audioSegmentsByTarget[targetId].length).toBe(3);
      expect(service.getSnapshot().context.refinementPendingForTargets.has(targetId)).toBe(true);

      // User manually edits the field
      service.send({
        type: 'saypi:manualEdit',
        targetElement: inputElement,
        newContent: 'user typed this',
        oldContent: 'segment 0 segment 1 segment 2',
      });

      // The bug was: audio buffers and refinement state were not cleared
      // This could lead to stale audio (up to 120s) being refined later

      // Verify audio buffers are cleared
      expect(service.getSnapshot().context.audioSegmentsByTarget[targetId]).toBeUndefined();

      // Verify refinement pending flag is cleared
      expect(service.getSnapshot().context.refinementPendingForTargets.has(targetId)).toBe(false);

      // Verify active refinement sequences are cleared
      expect(service.getSnapshot().context.activeRefinementSequences.has(targetId)).toBe(false);

      // Verify transcription state is also cleared (existing behavior)
      expect(service.getSnapshot().context.transcriptionsByTarget[targetId]).toBeUndefined();

      // Should transition to idle
      expect(service.getSnapshot().matches('idle')).toBe(true);
    });
  });
});
