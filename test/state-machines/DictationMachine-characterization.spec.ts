import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';
import { createTestActor } from './support/testActor';
import EventBus from '../../src/events/EventBus.js';

/**
 * CHARACTERIZATION suite for DictationMachine.
 *
 * Pins the CURRENT behavior of states/transitions/guards/context/side-effects
 * that the existing DictationMachine-*.spec.ts files do NOT cover:
 *   - the `starting` 10s timeout and `stopDictation` cancel
 *   - the `errors.transcribeFailed` / `errors.micError` 3s auto-recovery
 *   - the `notSpeaking` exits (`userFinishedSpeaking` -> idle)
 *   - the `hasNoAudio` (VAD misfire) branch and provisional-target discard
 *   - target-switch-during-speech recording
 *   - recording-level + listening-level `stopDictation` (stopRecording + finalize)
 *   - the `ready` state `transcribeFailed` -> errors.transcribeFailed branch
 *   - events with no handler (no-op) at various states
 *
 * Mock setup is modeled on DictationMachine-EmptyTranscription.spec.ts and
 * DictationMachine-Refinement.spec.ts. Timer-based transitions use fake timers
 * for determinism.
 */

vi.mock('../../src/TranscriptionModule', () => ({
  uploadAudioWithRetry: vi.fn((...args: any[]) => {
    const callback = args[9];
    if (typeof callback === 'function') {
      callback(1);
    }
    return Promise.resolve(1);
  }),
  uploadAudioForRefinement: vi.fn(() => Promise.resolve('refined transcription')),
  isTranscriptionPending: vi.fn(() => false),
  clearPendingTranscriptions: vi.fn(),
  getCurrentSequenceNumber: vi.fn(() => 1),
}));

vi.mock('../../src/audio/AudioSegmentPersistence', () => ({
  persistAudioSegment: vi.fn(),
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
        .map((key) => transcripts[key])
        .join(' ');
    }),
  })),
}));

vi.mock('../../src/audio/AudioEncoder', () => ({
  convertToWavBlob: vi.fn(
    (frames: Float32Array) =>
      new Blob([new ArrayBuffer((frames?.length || 1) * 4)], { type: 'audio/wav' })
  ),
}));

vi.mock('../../src/TimerModule', () => ({
  calculateDelay: vi.fn(() => 100),
}));

// Mock EventBus
vi.spyOn(EventBus, 'emit');

// Import the machine after mocks are set up
import { createDictationMachine } from '../../src/state-machines/DictationMachine';
import * as TranscriptionModule from '../../src/TranscriptionModule';

const emitted = (eventName: string) =>
  vi.mocked(EventBus.emit).mock.calls.filter((c) => c[0] === eventName);

describe('DictationMachine - characterization (uncovered transitions)', () => {
  let service: any;
  let inputElement: HTMLInputElement;
  let inputElement2: HTMLInputElement;

  beforeAll(() => {
    inputElement = document.createElement('input');
    inputElement.id = 'char-input';
    inputElement.name = 'charField';
    inputElement.placeholder = 'Test input';

    inputElement2 = document.createElement('input');
    inputElement2.id = 'char-input-2';
    inputElement2.name = 'charField2';
    inputElement2.placeholder = 'Test input 2';
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockClear();
    vi.mocked(TranscriptionModule.isTranscriptionPending).mockReturnValue(false);
    vi.mocked(TranscriptionModule.clearPendingTranscriptions).mockClear();
    vi.mocked(TranscriptionModule.getCurrentSequenceNumber).mockReturnValue(1);
    vi.mocked(EventBus.emit).mockClear();

    inputElement.value = '';
    inputElement2.value = '';

    const machine = createDictationMachine();
    service = createTestActor(machine);
    service.start();
  });

  afterEach(() => {
    if (service) {
      service.stop();
    }
    vi.useRealTimers();
  });

  // ---------------------------------------------------------------------------
  // starting state
  // ---------------------------------------------------------------------------
  describe('starting state', () => {
    it('emits audio:setupRecording on entry to starting', () => {
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      expect(service.state.value).toBe('starting');
      expect(emitted('audio:setupRecording').length).toBeGreaterThan(0);
    });

    it('cancels back to idle when stopDictation arrives before the mic is ready', () => {
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send('saypi:stopDictation');
      expect(service.state.value).toBe('idle');
      // Returning to idle resets the target element via resetDictationState.
      expect(service.state.context.targetElement).toBeUndefined();
    });

    it('falls into errors.micError after the 10s startup timeout', () => {
      vi.useFakeTimers();
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      expect(service.state.value).toBe('starting');

      vi.advanceTimersByTime(10000);

      expect(service.state.value).toEqual({ errors: 'micError' });
    });

    it('emits audio:startRecording when callReady fires from starting', () => {
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      vi.mocked(EventBus.emit).mockClear();
      service.send('saypi:callReady');
      expect(emitted('audio:startRecording').length).toBeGreaterThan(0);
      expect(service.state.value).toEqual({
        listening: { recording: 'notSpeaking', converting: 'ready' },
      });
    });
  });

  // ---------------------------------------------------------------------------
  // errors states auto-recovery
  // ---------------------------------------------------------------------------
  describe('error states auto-recovery (3s)', () => {
    it('errors.micError returns to listening.recording.notSpeaking after 3s', () => {
      vi.useFakeTimers();
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send('saypi:callFailed');
      expect(service.state.value).toEqual({ errors: 'micError' });

      vi.advanceTimersByTime(3000);

      expect(service.state.value).toEqual({
        listening: { recording: 'notSpeaking', converting: 'ready' },
      });
    });

    it('errors.transcribeFailed returns to listening.recording.notSpeaking after 3s', () => {
      vi.useFakeTimers();
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send('saypi:callReady');
      // ready -> transcribeFailed (no audio sent first) goes to errors.transcribeFailed
      service.send('saypi:transcribeFailed');
      expect(service.state.value).toEqual({ errors: 'transcribeFailed' });

      vi.advanceTimersByTime(3000);

      expect(service.state.value).toEqual({
        listening: { recording: 'notSpeaking', converting: 'ready' },
      });
    });
  });

  // ---------------------------------------------------------------------------
  // ready (converting) state error branches
  // ---------------------------------------------------------------------------
  describe('converting.ready error branches', () => {
    beforeEach(() => {
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send('saypi:callReady');
    });

    it('ready + transcribeFailed -> errors.transcribeFailed', () => {
      expect(service.state.value).toEqual({
        listening: { recording: 'notSpeaking', converting: 'ready' },
      });
      service.send('saypi:transcribeFailed');
      expect(service.state.value).toEqual({ errors: 'transcribeFailed' });
    });

    it('ready + transcribedEmpty -> errors.micError', () => {
      service.send('saypi:transcribedEmpty');
      expect(service.state.value).toEqual({ errors: 'micError' });
    });

    it('ready + transcribed -> accumulating (and records the transcript)', () => {
      // Provide a target mapping so the response is actually stored.
      service.state.context.transcriptionTargets[1] = inputElement;
      service.send({
        type: 'saypi:transcribed',
        text: 'hello world',
        sequenceNumber: 1,
      });
      expect(service.state.value).toEqual({
        listening: { recording: 'notSpeaking', converting: 'accumulating' },
      });
      expect(service.state.context.transcriptions[1]).toBe('hello world');
    });
  });

  // ---------------------------------------------------------------------------
  // recording.notSpeaking exits
  // ---------------------------------------------------------------------------
  describe('recording.notSpeaking', () => {
    beforeEach(() => {
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send('saypi:callReady');
    });

    it('userFinishedSpeaking from notSpeaking returns to idle (resets context)', () => {
      expect(service.state.value).toEqual({
        listening: { recording: 'notSpeaking', converting: 'ready' },
      });
      service.send('saypi:userFinishedSpeaking');
      expect(service.state.value).toBe('idle');
      expect(service.state.context.targetElement).toBeUndefined();
    });

    it('userSpeaking from notSpeaking enters userSpeaking and sets userIsSpeaking', () => {
      service.send('saypi:userSpeaking');
      expect(service.state.value).toEqual({
        listening: { recording: 'userSpeaking', converting: 'ready' },
      });
      expect(service.state.context.userIsSpeaking).toBe(true);
      // speechStartTarget is captured from the current target on entry.
      expect(service.state.context.speechStartTarget).toBe(inputElement);
    });
  });

  // ---------------------------------------------------------------------------
  // recording.userSpeaking: hasNoAudio (VAD misfire) branch
  // ---------------------------------------------------------------------------
  describe('recording.userSpeaking - VAD misfire (hasNoAudio)', () => {
    beforeEach(() => {
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send('saypi:callReady');
      service.send('saypi:userSpeaking');
    });

    it('userStoppedSpeaking with no blob returns to notSpeaking and discards provisional target', () => {
      // userSpeaking entry records a provisional transcription target.
      expect(service.state.context.provisionalTranscriptionTarget).toBeDefined();

      service.send({ type: 'saypi:userStoppedSpeaking', duration: 0 });

      expect(service.state.value).toEqual({
        listening: { recording: 'notSpeaking', converting: 'ready' },
      });
      // discardProvisionalTranscriptionTarget clears it.
      expect(service.state.context.provisionalTranscriptionTarget).toBeUndefined();
      // userIsSpeaking is cleared on exit of userSpeaking.
      expect(service.state.context.userIsSpeaking).toBe(false);
      // No audio means no upload attempt.
      expect(TranscriptionModule.uploadAudioWithRetry).not.toHaveBeenCalled();
    });

    it('userStoppedSpeaking with zero-size blob is treated as no audio (hasNoAudio)', () => {
      // A zero-size blob is not real audio even with a positive duration: it must
      // follow the VAD-misfire path (hasNoAudio) — stay notSpeaking, no upload —
      // and agree with hasNoAudio (which already checks blob.size === 0).
      // Regression test for #403: hasAudio previously ignored blob.size, so this
      // event satisfied BOTH guards and hasAudio (listed first) wrongly won,
      // uploading a zero-byte segment.
      const emptyBlob = new Blob([], { type: 'audio/wav' });
      service.send({
        type: 'saypi:userStoppedSpeaking',
        duration: 1000,
        blob: emptyBlob,
      });
      expect(service.state.value).toEqual({
        listening: { recording: 'notSpeaking', converting: 'ready' },
      });
      expect(TranscriptionModule.uploadAudioWithRetry).not.toHaveBeenCalled();
    });

    it('userStoppedSpeaking with blob but zero duration is hasNoAudio -> stays notSpeaking', () => {
      const blob = new Blob(['audio'], { type: 'audio/wav' });
      service.send({
        type: 'saypi:userStoppedSpeaking',
        duration: 0,
        blob,
      });
      expect(service.state.value).toEqual({
        listening: { recording: 'notSpeaking', converting: 'ready' },
      });
      expect(TranscriptionModule.uploadAudioWithRetry).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // recording.userSpeaking: hasAudio branch + handleAudioStopped side effects
  // ---------------------------------------------------------------------------
  describe('recording.userSpeaking - hasAudio branch', () => {
    beforeEach(() => {
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send('saypi:callReady');
      service.send('saypi:userSpeaking');
    });

    it('userStoppedSpeaking with audio enters converting.transcribing and uploads', () => {
      const blob = new Blob(['audio'], { type: 'audio/wav' });
      service.send({
        type: 'saypi:userStoppedSpeaking',
        duration: 1500,
        blob,
        frames: new Float32Array([0.1, 0.2]),
      });

      expect(service.state.value).toEqual({
        listening: { recording: 'notSpeaking', converting: 'transcribing' },
      });
      expect(service.state.context.isTranscribing).toBe(true);
      expect(service.state.context.timeUserStoppedSpeaking).toBeGreaterThan(0);
      expect(TranscriptionModule.uploadAudioWithRetry).toHaveBeenCalledTimes(1);
    });

    it('handleAudioStopped with no target element warns and does not upload', () => {
      // Clear target so handleAudioStopped hits the "no target" fallback branch.
      service.state.context.targetElement = undefined;
      const blob = new Blob(['audio'], { type: 'audio/wav' });
      service.send({
        type: 'saypi:userStoppedSpeaking',
        duration: 1000,
        blob,
      });
      // Still transitions on hasAudio, but no upload happens.
      expect(service.state.value).toEqual({
        listening: { recording: 'notSpeaking', converting: 'transcribing' },
      });
      expect(TranscriptionModule.uploadAudioWithRetry).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // recording.userSpeaking: target switch during speech
  // ---------------------------------------------------------------------------
  describe('recording.userSpeaking - switchTarget during speech', () => {
    beforeEach(() => {
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send('saypi:callReady');
      service.send('saypi:userSpeaking');
    });

    it('records the switch in targetSwitchesDuringSpeech and updates targetElement', () => {
      expect(service.state.context.targetSwitchesDuringSpeech).toBeUndefined();

      service.send({ type: 'saypi:switchTarget', targetElement: inputElement2 });

      const switches = service.state.context.targetSwitchesDuringSpeech;
      expect(Array.isArray(switches)).toBe(true);
      expect(switches).toHaveLength(1);
      expect(switches[0].target).toBe(inputElement2);
      expect(typeof switches[0].timestamp).toBe('number');
      // switchTargetElement also updates the active target.
      expect(service.state.context.targetElement).toBe(inputElement2);
      // Still speaking.
      expect(service.state.value).toEqual({
        listening: { recording: 'userSpeaking', converting: 'ready' },
      });
    });

    it('clears switch info on a subsequent VAD misfire (clearTargetSwitchInfo)', () => {
      service.send({ type: 'saypi:switchTarget', targetElement: inputElement2 });
      expect(service.state.context.targetSwitchesDuringSpeech).toHaveLength(1);

      // No-audio stop should clear the recorded switches.
      service.send({ type: 'saypi:userStoppedSpeaking', duration: 0 });

      expect(service.state.context.targetSwitchesDuringSpeech).toBeUndefined();
      expect(service.state.value).toEqual({
        listening: { recording: 'notSpeaking', converting: 'ready' },
      });
    });
  });

  // ---------------------------------------------------------------------------
  // stopDictation from listening (recording-level + listening-level) -> idle + finalize
  // ---------------------------------------------------------------------------
  describe('stopDictation from listening', () => {
    it('stopDictation while userSpeaking stops recording, finalizes, and resets to idle', () => {
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send('saypi:callReady');
      service.send('saypi:userSpeaking');
      vi.mocked(EventBus.emit).mockClear();

      service.send('saypi:stopDictation');

      expect(service.state.value).toBe('idle');
      // stopRecording emits both stop + tearDown.
      expect(emitted('audio:stopRecording').length).toBeGreaterThan(0);
      expect(emitted('audio:tearDownRecording').length).toBeGreaterThan(0);
      // finalizeDictation emits dictation:complete.
      expect(emitted('dictation:complete').length).toBeGreaterThan(0);
      // resetDictationState (entry of idle) clears target.
      expect(service.state.context.targetElement).toBeUndefined();
    });

    it('stopDictation while in converting.transcribing also finalizes to idle', () => {
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send('saypi:callReady');
      service.send('saypi:userSpeaking');
      const blob = new Blob(['audio'], { type: 'audio/wav' });
      service.send({ type: 'saypi:userStoppedSpeaking', duration: 1000, blob });
      expect(service.state.value).toEqual({
        listening: { recording: 'notSpeaking', converting: 'transcribing' },
      });
      vi.mocked(EventBus.emit).mockClear();

      service.send('saypi:stopDictation');

      expect(service.state.value).toBe('idle');
      expect(emitted('dictation:complete').length).toBeGreaterThan(0);
    });
  });

  // ---------------------------------------------------------------------------
  // global switchTarget while listening (not speaking)
  // ---------------------------------------------------------------------------
  describe('global switchTarget while not speaking', () => {
    it('switches the target element without recording it as a speech-time switch', () => {
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send('saypi:callReady');
      expect(service.state.value).toEqual({
        listening: { recording: 'notSpeaking', converting: 'ready' },
      });

      service.send({ type: 'saypi:switchTarget', targetElement: inputElement2 });

      expect(service.state.context.targetElement).toBe(inputElement2);
      // Not recorded as a during-speech switch (that only happens in userSpeaking).
      expect(service.state.context.targetSwitchesDuringSpeech).toBeUndefined();
      // Stays in listening.
      expect(service.state.value).toEqual({
        listening: { recording: 'notSpeaking', converting: 'ready' },
      });
    });
  });

  // ---------------------------------------------------------------------------
  // session assignment (global event)
  // ---------------------------------------------------------------------------
  describe('global saypi:session:assigned', () => {
    it('stores the session id in context from idle (no state change)', () => {
      expect(service.state.value).toBe('idle');
      service.send({ type: 'saypi:session:assigned', session_id: 'sess-123' });
      expect(service.state.context.sessionId).toBe('sess-123');
      expect(service.state.value).toBe('idle');
    });

    it('passes the stored session id to the audio upload', () => {
      service.send({ type: 'saypi:session:assigned', session_id: 'sess-xyz' });
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send('saypi:callReady');
      service.send('saypi:userSpeaking');
      const blob = new Blob(['audio'], { type: 'audio/wav' });
      service.send({ type: 'saypi:userStoppedSpeaking', duration: 1000, blob });

      const calls = vi.mocked(TranscriptionModule.uploadAudioWithRetry).mock.calls;
      expect(calls.length).toBeGreaterThan(0);
      // signature: (blob, duration, transcriptions, sessionId, ...)
      expect(calls[0][3]).toBe('sess-xyz');
    });
  });

  // ---------------------------------------------------------------------------
  // events with no handler at a given state (no-op characterization)
  // ---------------------------------------------------------------------------
  describe('unhandled / no-op events', () => {
    it('saypi:visible in idle is a no-op (no transition, no crash)', () => {
      expect(service.state.value).toBe('idle');
      service.send('saypi:visible');
      expect(service.state.value).toBe('idle');
    });

    it('saypi:audio:connected in idle is a no-op', () => {
      service.send({
        type: 'saypi:audio:connected',
        deviceId: 'dev-1',
        deviceLabel: 'Mic',
      });
      expect(service.state.value).toBe('idle');
    });

    it('saypi:callReady in idle is a no-op (only handled from starting)', () => {
      service.send('saypi:callReady');
      expect(service.state.value).toBe('idle');
    });

    it('saypi:transcribed in idle is a no-op', () => {
      service.send({ type: 'saypi:transcribed', text: 'x', sequenceNumber: 1 });
      expect(service.state.value).toBe('idle');
    });
  });

  // ---------------------------------------------------------------------------
  // listening exit cleanup side-effects
  // ---------------------------------------------------------------------------
  describe('listening exit cleanup', () => {
    it('clears pending transcriptions when leaving listening (stopDictation)', () => {
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send('saypi:callReady');
      vi.mocked(TranscriptionModule.clearPendingTranscriptions).mockClear();

      service.send('saypi:stopDictation');

      expect(TranscriptionModule.clearPendingTranscriptions).toHaveBeenCalled();
      // clearTranscriptsAction wipes transcript context.
      expect(service.state.context.transcriptions).toEqual({});
      expect(service.state.context.transcriptionsByTarget).toEqual({});
    });
  });

  // ---------------------------------------------------------------------------
  // converting.transcribing error/empty branches (distinct from ready/accumulating)
  // ---------------------------------------------------------------------------
  describe('converting.transcribing branches', () => {
    // Helper: drive the machine into converting.transcribing via a real audio stop.
    const enterTranscribing = () => {
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send('saypi:callReady');
      service.send('saypi:userSpeaking');
      const blob = new Blob(['audio'], { type: 'audio/wav' });
      service.send({
        type: 'saypi:userStoppedSpeaking',
        duration: 1000,
        blob,
        frames: new Float32Array([0.1, 0.2]),
      });
      expect(service.state.value).toEqual({
        listening: { recording: 'notSpeaking', converting: 'transcribing' },
      });
    };

    it('entry to transcribing sets isTranscribing true', () => {
      enterTranscribing();
      expect(service.state.context.isTranscribing).toBe(true);
    });

    it('transcribing + transcribeFailed returns to converting.ready (NOT errors)', () => {
      enterTranscribing();
      service.send('saypi:transcribeFailed');
      // Unlike ready/accumulating, the transcribing failure goes back to ready,
      // and exiting transcribing clears isTranscribing.
      expect(service.state.value).toEqual({
        listening: { recording: 'notSpeaking', converting: 'ready' },
      });
      expect(service.state.context.isTranscribing).toBe(false);
    });

    it('transcribing + transcribedEmpty returns to converting.ready (NOT errors)', () => {
      enterTranscribing();
      service.send('saypi:transcribedEmpty');
      expect(service.state.value).toEqual({
        listening: { recording: 'notSpeaking', converting: 'ready' },
      });
      expect(service.state.context.isTranscribing).toBe(false);
    });

    it('transcribing + transcribed -> accumulating and stores the transcript', () => {
      enterTranscribing();
      // uploadAudioSegment maps the provisional target to sequence 2 (getCurrentSequenceNumber()+1),
      // but the callback fires with seq 1, so the target ends up mapped under seq 1.
      service.send({
        type: 'saypi:transcribed',
        text: 'spoken words',
        sequenceNumber: 1,
      });
      expect(service.state.value).toEqual({
        listening: { recording: 'notSpeaking', converting: 'accumulating' },
      });
      expect(service.state.context.transcriptions[1]).toBe('spoken words');
      // isTranscribing cleared on leaving transcribing.
      expect(service.state.context.isTranscribing).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // converting.accumulating branches
  // ---------------------------------------------------------------------------
  describe('converting.accumulating branches', () => {
    // Get into accumulating with one stored transcript for inputElement.
    const enterAccumulating = () => {
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send('saypi:callReady');
      // From ready, a transcribed event moves to accumulating directly.
      service.state.context.transcriptionTargets[1] = inputElement;
      service.send({ type: 'saypi:transcribed', text: 'first', sequenceNumber: 1 });
      expect(service.state.value).toEqual({
        listening: { recording: 'notSpeaking', converting: 'accumulating' },
      });
    };

    it('accumulating + additional transcribed stays accumulating and records it', () => {
      enterAccumulating();
      service.state.context.transcriptionTargets[2] = inputElement;
      service.send({ type: 'saypi:transcribed', text: 'second', sequenceNumber: 2 });
      expect(service.state.value).toEqual({
        listening: { recording: 'notSpeaking', converting: 'accumulating' },
      });
      expect(service.state.context.transcriptions[1]).toBe('first');
      expect(service.state.context.transcriptions[2]).toBe('second');
    });

    it('accumulating + transcribeFailed -> errors.transcribeFailed', () => {
      enterAccumulating();
      service.send('saypi:transcribeFailed');
      expect(service.state.value).toEqual({ errors: 'transcribeFailed' });
    });

    it('accumulating + transcribedEmpty -> errors.micError', () => {
      enterAccumulating();
      service.send('saypi:transcribedEmpty');
      expect(service.state.value).toEqual({ errors: 'micError' });
    });

    it('accumulating auto-advances to refining after refinementDelay when conditions met', () => {
      vi.useFakeTimers();
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send('saypi:callReady');
      service.send('saypi:userSpeaking');
      // Real audio stop stores a segment (refinementPendingForTargets gets the target),
      // and transitions into converting.transcribing.
      const blob = new Blob(['audio'], { type: 'audio/wav' });
      service.send({
        type: 'saypi:userStoppedSpeaking',
        duration: 1000,
        blob,
        frames: new Float32Array([0.1, 0.2, 0.3]),
      });
      // The transcribed response moves transcribing -> accumulating and clears isTranscribing.
      service.send({ type: 'saypi:transcribed', text: 'hello', sequenceNumber: 1 });
      expect(service.state.value).toEqual({
        listening: { recording: 'notSpeaking', converting: 'accumulating' },
      });
      // refinementConditionsMet: refinementPendingForTargets non-empty && !isTranscribing.
      expect(service.state.context.refinementPendingForTargets.size).toBeGreaterThan(0);
      expect(service.state.context.isTranscribing).toBe(false);

      // calculateDelay is mocked to 100ms.
      vi.advanceTimersByTime(200);

      expect(service.state.value).toEqual({
        listening: { recording: 'notSpeaking', converting: 'refining' },
      });
    });

    it('accumulating does NOT advance to refining when no pending refinements', () => {
      vi.useFakeTimers();
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send('saypi:callReady');
      // Reach accumulating WITHOUT storing any audio segment (no frames stored),
      // so refinementPendingForTargets stays empty.
      service.state.context.transcriptionTargets[1] = inputElement;
      service.send({ type: 'saypi:transcribed', text: 'hello', sequenceNumber: 1 });
      expect(service.state.value).toEqual({
        listening: { recording: 'notSpeaking', converting: 'accumulating' },
      });
      expect(service.state.context.refinementPendingForTargets.size).toBe(0);

      vi.advanceTimersByTime(500);

      // Guard refinementConditionsMet is false, so it stays in accumulating.
      expect(service.state.value).toEqual({
        listening: { recording: 'notSpeaking', converting: 'accumulating' },
      });
    });
  });

  // ---------------------------------------------------------------------------
  // converting.refining branches
  // ---------------------------------------------------------------------------
  describe('converting.refining branches', () => {
    // Drive: speak with frames -> transcribe -> accumulate -> add a second segment so
    // there are >=2 unrefined segments -> auto-advance to refining via delay.
    const enterRefining = () => {
      vi.useFakeTimers();
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send('saypi:callReady');
      // Segment 1
      service.send('saypi:userSpeaking');
      service.send({
        type: 'saypi:userStoppedSpeaking',
        duration: 1000,
        blob: new Blob(['a'], { type: 'audio/wav' }),
        frames: new Float32Array([0.1, 0.2]),
      });
      service.send({ type: 'saypi:transcribed', text: 'one', sequenceNumber: 1 });
      // Segment 2 (so unrefinedSegments.length >= 2 -> refinement actually uploads)
      service.send('saypi:userSpeaking');
      service.send({
        type: 'saypi:userStoppedSpeaking',
        duration: 1000,
        blob: new Blob(['b'], { type: 'audio/wav' }),
        frames: new Float32Array([0.3, 0.4]),
      });
      service.send({ type: 'saypi:transcribed', text: 'two', sequenceNumber: 1 });
      expect(service.state.value).toEqual({
        listening: { recording: 'notSpeaking', converting: 'accumulating' },
      });
      vi.advanceTimersByTime(200);
      expect(service.state.value).toEqual({
        listening: { recording: 'notSpeaking', converting: 'refining' },
      });
    };

    it('entry to refining calls uploadAudioForRefinement (performContextualRefinement)', () => {
      enterRefining();
      expect(TranscriptionModule.uploadAudioForRefinement).toHaveBeenCalled();
    });

    it('refining + transcribeFailed falls back to accumulating (NOT errors)', () => {
      enterRefining();
      service.send('saypi:transcribeFailed');
      // Refinement failure is non-fatal: keep the Phase 1 text, return to accumulating.
      expect(service.state.value).toEqual({
        listening: { recording: 'notSpeaking', converting: 'accumulating' },
      });
    });

    it('refining + transcribed returns to accumulating', () => {
      enterRefining();
      service.state.context.transcriptionTargets[3] = inputElement;
      service.send({ type: 'saypi:transcribed', text: 'three', sequenceNumber: 3 });
      expect(service.state.value).toEqual({
        listening: { recording: 'notSpeaking', converting: 'accumulating' },
      });
    });
  });

  // ---------------------------------------------------------------------------
  // explicit refineTranscription event + hasSegmentsForRefinement guard
  // ---------------------------------------------------------------------------
  describe('explicit saypi:refineTranscription', () => {
    it('moves accumulating -> refining when the target has stored audio segments', () => {
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send('saypi:callReady');
      // Speak with frames so a segment is stored for inputElement, then transcribe.
      service.send('saypi:userSpeaking');
      service.send({
        type: 'saypi:userStoppedSpeaking',
        duration: 1000,
        blob: new Blob(['a'], { type: 'audio/wav' }),
        frames: new Float32Array([0.1, 0.2]),
      });
      service.send({ type: 'saypi:transcribed', text: 'one', sequenceNumber: 1 });
      expect(service.state.value).toEqual({
        listening: { recording: 'notSpeaking', converting: 'accumulating' },
      });

      service.send({ type: 'saypi:refineTranscription', targetElement: inputElement });

      expect(service.state.value).toEqual({
        listening: { recording: 'notSpeaking', converting: 'refining' },
      });
    });

    it('is a no-op in accumulating when the target has NO stored audio segments', () => {
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send('saypi:callReady');
      // Reach accumulating without storing audio (transcribed straight from ready).
      service.state.context.transcriptionTargets[1] = inputElement;
      service.send({ type: 'saypi:transcribed', text: 'one', sequenceNumber: 1 });
      expect(service.state.value).toEqual({
        listening: { recording: 'notSpeaking', converting: 'accumulating' },
      });

      // hasSegmentsForRefinement is false -> guarded transition does not fire.
      service.send({ type: 'saypi:refineTranscription', targetElement: inputElement2 });

      expect(service.state.value).toEqual({
        listening: { recording: 'notSpeaking', converting: 'accumulating' },
      });
    });
  });

  // ---------------------------------------------------------------------------
  // handleAudioStopped: target-switch-during-speech splits audio into segments
  // ---------------------------------------------------------------------------
  describe('handleAudioStopped - audio splitting on mid-speech target switch', () => {
    it('uploads two segments when a target switch was recorded during speech', () => {
      // Freeze time so the recorded switch timestamp lands inside the audio window.
      vi.useFakeTimers();
      vi.setSystemTime(100000);

      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send('saypi:callReady');
      service.send('saypi:userSpeaking');

      // Switch target mid-speech; recorded with timestamp Date.now() = 100000.
      service.send({ type: 'saypi:switchTarget', targetElement: inputElement2 });
      expect(service.state.context.targetSwitchesDuringSpeech).toHaveLength(1);

      vi.mocked(TranscriptionModule.uploadAudioWithRetry).mockClear();

      // Stop speaking with frames + a captureTimestamp such that the switch at
      // 100000 falls strictly inside [audioStart, audioStart+duration].
      // audioStartTs = captureTimestamp - duration = 100500 - 1000 = 99500.
      // splitTimeMs = 100000 - 99500 = 500 (0 < 500 < 1000) -> a real split.
      service.send({
        type: 'saypi:userStoppedSpeaking',
        duration: 1000,
        blob: new Blob(['audio'], { type: 'audio/wav' }),
        frames: new Float32Array(32000), // 2s of 16kHz samples (>= split offset)
        captureTimestamp: 100500,
      });

      // Two segments => two uploads (before-switch + after-switch).
      expect(TranscriptionModule.uploadAudioWithRetry).toHaveBeenCalledTimes(2);
      // Switch tracking is cleared after the split.
      expect(service.state.context.targetSwitchesDuringSpeech).toBeUndefined();
      expect(service.state.context.speechStartTarget).toBeUndefined();
      expect(service.state.value).toEqual({
        listening: { recording: 'notSpeaking', converting: 'transcribing' },
      });
    });
  });

  // ---------------------------------------------------------------------------
  // finalizeDictation clears audio buffers
  // ---------------------------------------------------------------------------
  describe('finalizeDictation buffer cleanup', () => {
    it('clears stored audio segments when dictation is finalized via stopDictation', () => {
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send('saypi:callReady');
      service.send('saypi:userSpeaking');
      service.send({
        type: 'saypi:userStoppedSpeaking',
        duration: 1000,
        blob: new Blob(['a'], { type: 'audio/wav' }),
        frames: new Float32Array([0.1, 0.2]),
      });
      // A segment was stored for the target.
      expect(Object.keys(service.state.context.audioSegmentsByTarget).length).toBeGreaterThan(0);

      service.send('saypi:stopDictation');

      expect(service.state.value).toBe('idle');
      // resetDictationState (idle entry) clears the buffers.
      expect(service.state.context.audioSegmentsByTarget).toEqual({});
      expect(service.state.context.refinementPendingForTargets.size).toBe(0);
    });
  });

  // ---------------------------------------------------------------------------
  // manual edit while in starting (global handler) -> idle
  // ---------------------------------------------------------------------------
  describe('global manual edit', () => {
    it('saypi:manualEdit terminates dictation from listening and returns to idle', () => {
      service.send({ type: 'saypi:startDictation', targetElement: inputElement });
      service.send('saypi:callReady');
      vi.mocked(EventBus.emit).mockClear();

      service.send({
        type: 'saypi:manualEdit',
        targetElement: inputElement,
        newContent: 'edited',
        oldContent: '',
      });

      expect(service.state.value).toBe('idle');
      expect(emitted('dictation:terminatedByManualEdit').length).toBeGreaterThan(0);
      // handleManualEdit also stops recording.
      expect(emitted('audio:stopRecording').length).toBeGreaterThan(0);
    });
  });
});
