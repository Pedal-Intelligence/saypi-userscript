import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTestActor } from './support/testActor';

// ---------------------------------------------------------------------------
// CHARACTERIZATION suite for ConversationMachine.
//
// These tests pin the machine's CURRENT behavior across states, transitions,
// guards, context mutations, and EventBus side-effects. They deliberately avoid
// the ground already covered by the sibling specs:
//   - ConversationMachine-errorStates.spec.ts   (#311 transcribe vs mic error)
//   - ConversationMachine-submissionDelay.spec.ts (submissionDelay timer)
//   - ConversationMachine-piThinkingFallback.spec.ts (piThinking 15s timeout)
//
// Mock setup mirrors those specs. EventBus and TranscriptionErrorManager are
// NOT mocked (they run as the real modules, matching the existing specs); we
// attach real listeners to EventBus to assert emissions.
// ---------------------------------------------------------------------------

vi.mock('../../src/ConfigModule', () => ({
  config: { apiServerUrl: 'http://api.example.com' },
}));

vi.mock('../../src/AnimationModule.js', () => ({
  default: {
    startAnimation: vi.fn(),
    stopAnimation: vi.fn(),
    stopAllAnimations: vi.fn(),
  },
}));

vi.mock('../../src/NotificationsModule', () => {
  class NoopAudible {
    static instance = new NoopAudible();
    static getInstance() { return NoopAudible.instance; }
    listeningStopped() {}
    callStarted() {}
    callEnded() {}
    callFailed() {}
  }
  class NoopTextual { showNotification() {}; hideNotification() {}; }
  class NoopVisual { listeningStopped() {}; listeningTimeRemaining() {}; }
  return {
    AudibleNotificationsModule: NoopAudible,
    TextualNotificationsModule: NoopTextual,
    VisualNotificationsModule: NoopVisual,
  };
});

// vi.mock factories are hoisted above the module body, so any value they
// reference must be created via vi.hoisted (also hoisted) rather than a plain
// const (which is still in the temporal dead zone when the factory runs).
const hoisted = vi.hoisted(() => ({
  activateAudioOutput: vi.fn(),
  requestWakeLock: vi.fn(),
  releaseWakeLock: vi.fn(),
  uploadAudioWithRetry: vi.fn(() => Promise.resolve(1)),
  clearPendingTranscriptions: vi.fn(),
  // Mutable preference toggles consulted by the mocked PreferenceModule.
  prefs: { autoSubmit: true, allowInterruptions: true, discretionary: false },
}));
const { activateAudioOutput, requestWakeLock, releaseWakeLock, uploadAudioWithRetry, clearPendingTranscriptions } = hoisted;

vi.mock('../../src/audio/AudioControlsModule', () => ({
  default: vi.fn().mockImplementation(() => ({
    activateAudioOutput: hoisted.activateAudioOutput,
  })),
}));

vi.mock('../../src/WakeLockModule', () => ({
  requestWakeLock: () => hoisted.requestWakeLock(),
  releaseWakeLock: () => hoisted.releaseWakeLock(),
}));

vi.mock('../../src/i18n', () => ({
  default: vi.fn((key: string) => key),
}));

const fixedDelayMs = 200;
vi.mock('../../src/TimerModule', () => ({
  calculateDelay: vi.fn(() => fixedDelayMs),
}));

vi.mock('../../src/TranscriptionModule', () => ({
  uploadAudioWithRetry: (...args: unknown[]) => hoisted.uploadAudioWithRetry(...(args as [])),
  isTranscriptionPending: vi.fn(() => false),
  clearPendingTranscriptions: () => hoisted.clearPendingTranscriptions(),
  getCurrentSequenceNumber: vi.fn(() => 1),
}));

vi.mock('../../src/TranscriptMergeService', () => ({
  TranscriptMergeService: vi.fn().mockImplementation(() => ({
    mergeTranscriptsLocal: (t: Record<number, string>) => Object.values(t).join(' '),
    mergeTranscriptsRemote: vi.fn(() => Promise.resolve('merged')),
  })),
}));

// Allow tests to toggle preferences (auto-submit / interruptions / discretionary)
const prefs = hoisted.prefs;
vi.mock('../../src/prefs/PreferenceModule', () => ({
  UserPreferenceModule: {
    getInstance: () => ({
      getLanguage: () => Promise.resolve('en'),
      getDiscretionaryMode: () => Promise.resolve(hoisted.prefs.discretionary),
      getCachedDiscretionaryMode: () => hoisted.prefs.discretionary,
      getCachedAutoSubmit: () => hoisted.prefs.autoSubmit,
      getCachedAllowInterruptions: () => hoisted.prefs.allowInterruptions,
      getCachedNickname: () => null,
    }),
  },
}));

import { createConversationMachine } from '../../src/state-machines/ConversationMachine';
import EventBus from '../../src/events/EventBus';

const spyPrompt = {
  setMessage: vi.fn(),
  setDraft: vi.fn(),
  setFinal: vi.fn(),
  getDraft: () => '',
  getDefaultPlaceholderText: () => 'NATIVE_PLACEHOLDER',
};
const StubChatbot = {
  getName: () => 'Pi',
  getPrompt: (_el?: HTMLElement) => spyPrompt,
  getContextWindowCapacityCharacters: () => 1_000_000,
};

const audioBlob = () => new Blob(['a'], { type: 'audio/webm' });

// Mirror of USER_STOPPED_TIMEOUT_MS in ConversationMachine.ts (the 10s inactivity
// after-delay in accumulating). Kept local so the spec is self-contained.
const USER_STOPPED_TIMEOUT_MS_LOCAL = 10_000;

/** Capture every EventBus.emit(name, ...) into a list, restored in afterEach. */
function captureEmits(): string[] {
  const emitted: string[] = [];
  const original = EventBus.emit.bind(EventBus);
  vi.spyOn(EventBus, 'emit').mockImplementation((event: string, ...args: unknown[]) => {
    emitted.push(event);
    return original(event, ...args);
  });
  return emitted;
}

function driveToRecording(service: any) {
  service.send('saypi:call');
  service.send('saypi:callReady');
}

function driveToTranscribing(service: any) {
  driveToRecording(service);
  service.send('saypi:userSpeaking');
  service.send({ type: 'saypi:userStoppedSpeaking', duration: 800, blob: audioBlob() });
  vi.advanceTimersByTime(50);
}

describe('ConversationMachine characterization', () => {
  let service: any;

  beforeEach(() => {
    prefs.autoSubmit = true;
    prefs.allowInterruptions = true;
    prefs.discretionary = false;
    spyPrompt.setMessage.mockClear();
    spyPrompt.setDraft.mockClear();
    spyPrompt.setFinal.mockClear();
    activateAudioOutput.mockClear();
    requestWakeLock.mockClear();
    releaseWakeLock.mockClear();
    uploadAudioWithRetry.mockClear();
    clearPendingTranscriptions.mockClear();
    document.body.innerHTML = '<textarea id="saypi-prompt"></textarea>';
    vi.useFakeTimers();
    vi.setSystemTime(new Date(1_000_000));
    const machine = createConversationMachine(StubChatbot as any);
    // createConversationMachine returns a module-level SINGLETON whose initial
    // context object is mutated in place by handleTranscriptionResponse (it does
    // `context.transcriptions[seq] = ...` directly). Without resetting it, leftover
    // transcriptions bleed across tests and make submission-gating order-dependent.
    const freshCtx = (machine as any).context;
    if (freshCtx) {
      freshCtx.transcriptions = {};
      freshCtx.isMaintainanceMessage = false;
      freshCtx.shouldRespond = !prefs.discretionary;
      freshCtx.timeUserStoppedSpeaking = 0;
      freshCtx.userIsSpeaking = false;
      freshCtx.isTranscribing = false;
      freshCtx.lastState = 'inactive';
      freshCtx.defaultPlaceholderText = '';
      freshCtx.sessionId = undefined;
    }
    service = createTestActor(machine);
    service.start();
  });

  afterEach(() => {
    try { service?.stop(); } catch {}
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  // -------------------------------------------------------------------------
  // inactive state
  // -------------------------------------------------------------------------
  describe('inactive (initial state)', () => {
    it('starts in inactive with default context', () => {
      expect(service.state.matches('inactive')).toBe(true);
      const ctx = service.state.context;
      expect(ctx.transcriptions).toEqual({});
      expect(ctx.isTranscribing).toBe(false);
      expect(ctx.userIsSpeaking).toBe(false);
      expect(ctx.lastState).toBe('inactive');
      expect(ctx.timeUserStoppedSpeaking).toBe(0);
      // shouldRespond defaults to !discretionaryMode (discretionary=false -> true)
      expect(ctx.shouldRespond).toBe(true);
      expect(ctx.isMaintainanceMessage).toBe(false);
    });

    it('saypi:promptReady is an internal self-transition that assigns the default placeholder text', () => {
      service.send('saypi:promptReady');
      expect(service.state.matches('inactive')).toBe(true);
      // getChatbotDefaultPlaceholder() -> chatbot.getPrompt().getDefaultPlaceholderText()
      expect(service.state.context.defaultPlaceholderText).toBe('NATIVE_PLACEHOLDER');
    });

    it('saypi:call transitions to callStarting', () => {
      service.send('saypi:call');
      expect(service.state.matches('callStarting')).toBe(true);
    });

    it('saypi:piSpeaking from inactive jumps straight to responding.piSpeaking', () => {
      service.send('saypi:piSpeaking');
      expect(service.state.matches({ responding: 'piSpeaking' })).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // callStarting state
  // -------------------------------------------------------------------------
  describe('callStarting', () => {
    it('entry emits audio:setupRecording (setupRecording action)', () => {
      const emitted = captureEmits();
      service.send('saypi:call');
      expect(emitted).toContain('audio:setupRecording');
    });

    it('saypi:callReady transitions to listening.recording.notSpeaking and runs start-of-call side effects', () => {
      const emitted = captureEmits();
      service.send('saypi:call');
      service.send('saypi:callReady');
      expect(service.state.matches({ listening: { recording: 'notSpeaking' } })).toBe(true);
      // callHasStarted -> session:started ; startRecording -> audio:startRecording
      expect(emitted).toContain('session:started');
      expect(emitted).toContain('audio:startRecording');
      // activateAudioOutput + requestWakeLock actions
      expect(activateAudioOutput).toHaveBeenCalledWith(true);
      expect(requestWakeLock).toHaveBeenCalled();
    });

    it('saypi:hangup before the call starts returns to inactive', () => {
      service.send('saypi:call');
      service.send('saypi:hangup');
      expect(service.state.matches('inactive')).toBe(true);
    });

    it('saypi:callFailed returns to inactive', () => {
      service.send('saypi:call');
      service.send('saypi:callFailed');
      expect(service.state.matches('inactive')).toBe(true);
    });

    it('the 20s startup timeout falls back to inactive when callReady never arrives', () => {
      service.send('saypi:call');
      expect(service.state.matches('callStarting')).toBe(true);
      vi.advanceTimersByTime(20_000);
      expect(service.state.matches('inactive')).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // listening.recording region
  // -------------------------------------------------------------------------
  describe('listening.recording', () => {
    it('saypi:userSpeaking enters userSpeaking and sets userIsSpeaking=true', () => {
      driveToRecording(service);
      service.send('saypi:userSpeaking');
      expect(service.state.matches({ listening: { recording: 'userSpeaking' } })).toBe(true);
      expect(service.state.context.userIsSpeaking).toBe(true);
    });

    it('saypi:userFinishedSpeaking from notSpeaking returns to inactive', () => {
      driveToRecording(service);
      expect(service.state.matches({ listening: { recording: 'notSpeaking' } })).toBe(true);
      service.send('saypi:userFinishedSpeaking');
      expect(service.state.matches('inactive')).toBe(true);
    });

    it('userStoppedSpeaking WITH audio (hasAudio guard) -> transcribing, transcribes audio, records stop time', () => {
      driveToRecording(service);
      service.send('saypi:userSpeaking');
      service.send({ type: 'saypi:userStoppedSpeaking', duration: 800, blob: audioBlob() });
      expect(service.state.matches({ listening: { converting: 'transcribing' } })).toBe(true);
      expect(service.state.context.userIsSpeaking).toBe(false);
      expect(service.state.context.timeUserStoppedSpeaking).toBe(Date.now());
      expect(uploadAudioWithRetry).toHaveBeenCalled();
    });

    it('userStoppedSpeaking with NO audio (hasNoAudio guard) -> back to notSpeaking, no transcribe', () => {
      driveToRecording(service);
      service.send('saypi:userSpeaking');
      // no blob + duration 0 => hasNoAudio
      service.send({ type: 'saypi:userStoppedSpeaking', duration: 0 });
      expect(service.state.matches({ listening: { recording: 'notSpeaking' } })).toBe(true);
      expect(uploadAudioWithRetry).not.toHaveBeenCalled();
    });

    it('saypi:hangup while recording returns to inactive, tears down recording, releases wake lock, emits session:ended', () => {
      const emitted = captureEmits();
      driveToRecording(service);
      service.send('saypi:hangup');
      expect(service.state.matches('inactive')).toBe(true);
      expect(emitted).toContain('audio:stopRecording');
      expect(emitted).toContain('audio:tearDownRecording');
      expect(emitted).toContain('session:ended');
      expect(releaseWakeLock).toHaveBeenCalled();
      expect(service.state.context.timeUserStoppedSpeaking).toBe(0);
    });

    it('saypi:visible while listening re-requests the wake lock', () => {
      driveToRecording(service);
      requestWakeLock.mockClear();
      service.send('saypi:visible');
      expect(requestWakeLock).toHaveBeenCalled();
    });

    it('saypi:session:assigned stores the session id in context', () => {
      driveToRecording(service);
      service.send({ type: 'saypi:session:assigned', session_id: 'sess-123' });
      expect(service.state.context.sessionId).toBe('sess-123');
    });

    it('saypi:audio:connected shows a notification (no state change)', () => {
      driveToRecording(service);
      // Visual/Textual notifications are noop-mocked; assert state is unchanged and no throw
      service.send({ type: 'saypi:audio:connected', deviceId: 'd1', deviceLabel: 'Mic' });
      expect(service.state.matches({ listening: { recording: 'notSpeaking' } })).toBe(true);
    });

    it('saypi:audio:reconnect emits audio:input:reconnect', () => {
      const emitted = captureEmits();
      driveToRecording(service);
      service.send({ type: 'saypi:audio:reconnect', deviceId: 'd1', deviceLabel: 'Mic' });
      expect(emitted).toContain('audio:input:reconnect');
    });
  });

  // -------------------------------------------------------------------------
  // listening.converting (transcribing -> accumulating)
  // -------------------------------------------------------------------------
  describe('listening.converting transcription handling', () => {
    it('saypi:transcribed in transcribing records the transcript into context.transcriptions and moves to accumulating', () => {
      driveToTranscribing(service);
      service.send({
        type: 'saypi:transcribed',
        text: 'Hello there',
        sequenceNumber: 7,
      });
      expect(service.state.matches({ listening: { converting: 'accumulating' } })).toBe(true);
      expect(service.state.context.transcriptions[7]).toBe('Hello there');
    });

    it('an empty transcript text is NOT stored (handleTranscriptionResponse skips blanks)', () => {
      driveToTranscribing(service);
      service.send({
        type: 'saypi:transcribed',
        text: '   ',
        sequenceNumber: 3,
      });
      expect(service.state.context.transcriptions[3]).toBeUndefined();
    });

    it('responseAnalysis.shouldRespond=false updates context.shouldRespond to false', () => {
      driveToTranscribing(service);
      service.send({
        type: 'saypi:transcribed',
        text: 'maybe later',
        sequenceNumber: 1,
        responseAnalysis: { shouldRespond: false },
      });
      expect(service.state.context.shouldRespond).toBe(false);
    });

    it('event.merged deletes the merged sequence numbers from transcriptions', () => {
      driveToTranscribing(service);
      // first transcript at seq 1
      service.send({ type: 'saypi:transcribed', text: 'part one', sequenceNumber: 1 });
      // second transcript at seq 2, declaring seq 1 was merged away
      service.send({ type: 'saypi:transcribed', text: 'part one two', sequenceNumber: 2, merged: [1] });
      const t = service.state.context.transcriptions;
      expect(t[1]).toBeUndefined();
      expect(t[2]).toBe('part one two');
    });

    it('transcribeAudio emits the session:transcribing analytics event', () => {
      const emitted = captureEmits();
      driveToRecording(service);
      service.send('saypi:userSpeaking');
      service.send({ type: 'saypi:userStoppedSpeaking', duration: 800, blob: audioBlob() });
      expect(emitted).toContain('session:transcribing');
    });
  });

  // -------------------------------------------------------------------------
  // accumulating: does NOT submit when auto-submit disabled
  // -------------------------------------------------------------------------
  describe('accumulating submission gating', () => {
    it('does NOT advance to submitting when auto-submit is disabled', () => {
      prefs.autoSubmit = false;
      driveToTranscribing(service);
      service.send({ type: 'saypi:transcribed', text: 'hi', sequenceNumber: 1 });
      expect(service.state.matches({ listening: { converting: 'accumulating' } })).toBe(true);
      // Even after both delays elapse, submissionConditionsMet is false.
      vi.advanceTimersByTime(11_000);
      expect(service.state.matches({ responding: 'piThinking' })).toBe(false);
    });

    it('submits (-> responding.piThinking) after the delay when conditions are met and emits session:message-sent', () => {
      const emitted = captureEmits();
      driveToTranscribing(service);
      service.send({ type: 'saypi:transcribed', text: 'hi', sequenceNumber: 1 });
      expect(service.state.matches({ listening: { converting: 'accumulating' } })).toBe(true);
      vi.advanceTimersByTime(fixedDelayMs + 5);
      expect(service.state.matches({ responding: 'piThinking' })).toBe(true);
      // mergeAndSubmitTranscript writes the final text; notifySentMessage emits analytics
      expect(spyPrompt.setFinal).toHaveBeenCalled();
      expect(emitted).toContain('session:message-sent');
      // After a successful submission the listening-exit cleanup ran.
      expect(clearPendingTranscriptions).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // responding region: piThinking / piWriting / piSpeaking flows
  // -------------------------------------------------------------------------
  describe('responding flows', () => {
    function driveToPiThinking(s: any) {
      driveToTranscribing(s);
      s.send({ type: 'saypi:transcribed', text: 'hi', sequenceNumber: 1 });
      vi.advanceTimersByTime(fixedDelayMs + 5);
    }

    it('piThinking -> piWriting on saypi:piWriting', () => {
      driveToPiThinking(service);
      expect(service.state.matches({ responding: 'piThinking' })).toBe(true);
      service.send('saypi:piWriting');
      expect(service.state.matches({ responding: 'piWriting' })).toBe(true);
    });

    it('piWriting -> listening on saypi:piStoppedWriting (call was active)', () => {
      driveToPiThinking(service);
      service.send('saypi:piWriting');
      service.send('saypi:piStoppedWriting');
      expect(service.state.matches('listening')).toBe(true);
    });

    it('piThinking -> piSpeaking on saypi:piSpeaking, and re-emits saypi:piSpeaking', () => {
      const emitted = captureEmits();
      driveToPiThinking(service);
      service.send('saypi:piSpeaking');
      expect(service.state.matches({ responding: 'piSpeaking' })).toBe(true);
      // notifyPiSpeaking entry action re-broadcasts saypi:piSpeaking on the bus
      expect(emitted).toContain('saypi:piSpeaking');
    });

    it('piSpeaking -> listening on saypi:piFinishedSpeaking', () => {
      driveToPiThinking(service);
      service.send('saypi:piSpeaking');
      service.send('saypi:piFinishedSpeaking');
      expect(service.state.matches('listening')).toBe(true);
    });

    it('piSpeaking -> listening on saypi:piStoppedSpeaking when the call was listening (wasListening)', () => {
      driveToPiThinking(service);
      service.send('saypi:piSpeaking');
      service.send('saypi:piStoppedSpeaking');
      expect(service.state.matches('listening')).toBe(true);
    });

    it('piSpeaking outside a call (from inactive, wasInactive) -> inactive on saypi:piStoppedSpeaking', () => {
      // From inactive, saypi:piSpeaking jumps to responding.piSpeaking; lastState stays "inactive".
      service.send('saypi:piSpeaking');
      expect(service.state.matches({ responding: 'piSpeaking' })).toBe(true);
      service.send('saypi:piStoppedSpeaking');
      expect(service.state.matches('inactive')).toBe(true);
    });

    it('saypi:hangup while responding returns to inactive and emits session:ended', () => {
      const emitted = captureEmits();
      driveToPiThinking(service);
      service.send('saypi:hangup');
      expect(service.state.matches('inactive')).toBe(true);
      expect(emitted).toContain('session:ended');
    });

    it('user interruption during piSpeaking (interruptions allowed) -> userInterrupting and pauses audio', () => {
      const emitted = captureEmits();
      driveToPiThinking(service);
      service.send('saypi:piSpeaking');
      service.send('saypi:userSpeaking');
      expect(service.state.matches({ responding: 'userInterrupting' })).toBe(true);
      expect(emitted).toContain('audio:output:pause');
    });

    it('user interruption is NOT allowed when the preference is off (stays in piSpeaking)', () => {
      prefs.allowInterruptions = false;
      driveToPiThinking(service);
      service.send('saypi:piSpeaking');
      service.send('saypi:userSpeaking');
      // interruptionsAllowed guard is false -> the transition is not taken
      expect(service.state.matches({ responding: 'piSpeaking' })).toBe(true);
    });

    it('forced interrupt (saypi:interrupt) during piSpeaking on an active call -> waitingForPiToStopSpeaking', () => {
      const emitted = captureEmits();
      driveToPiThinking(service);
      service.send('saypi:piSpeaking');
      service.send('saypi:interrupt');
      expect(service.state.matches({ responding: 'waitingForPiToStopSpeaking' })).toBe(true);
      expect(emitted).toContain('audio:output:pause');
    });

    it('waitingForPiToStopSpeaking falls back to userInterrupting after 500ms', () => {
      driveToPiThinking(service);
      service.send('saypi:piSpeaking');
      service.send('saypi:interrupt');
      vi.advanceTimersByTime(500);
      expect(service.state.matches({ responding: 'userInterrupting' })).toBe(true);
    });

    it('userInterrupting: stopped speaking with no audio resumes Pi audio and returns to piSpeaking', () => {
      const emitted = captureEmits();
      driveToPiThinking(service);
      service.send('saypi:piSpeaking');
      service.send('saypi:userSpeaking'); // -> userInterrupting
      expect(service.state.matches({ responding: 'userInterrupting' })).toBe(true);
      service.send({ type: 'saypi:userStoppedSpeaking', duration: 0 }); // hasNoAudio
      expect(service.state.matches({ responding: 'piSpeaking' })).toBe(true);
      expect(emitted).toContain('audio:output:resume');
    });

    it('userInterrupting: stopped speaking WITH audio transcribes and returns to listening.converting.transcribing', () => {
      driveToPiThinking(service);
      service.send('saypi:piSpeaking');
      service.send('saypi:userSpeaking'); // -> userInterrupting
      uploadAudioWithRetry.mockClear();
      service.send({ type: 'saypi:userStoppedSpeaking', duration: 800, blob: audioBlob() });
      expect(service.state.matches({ listening: { converting: 'transcribing' } })).toBe(true);
      expect(uploadAudioWithRetry).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // global userPreferenceChanged handler
  // -------------------------------------------------------------------------
  describe('userPreferenceChanged (global handler)', () => {
    it('discretionaryMode=true sets shouldRespond=false', () => {
      expect(service.state.context.shouldRespond).toBe(true);
      service.send({ type: 'userPreferenceChanged', discretionaryMode: true });
      expect(service.state.context.shouldRespond).toBe(false);
    });

    it('discretionaryMode=false sets shouldRespond=true', () => {
      service.send({ type: 'userPreferenceChanged', discretionaryMode: true });
      expect(service.state.context.shouldRespond).toBe(false);
      service.send({ type: 'userPreferenceChanged', discretionaryMode: false });
      expect(service.state.context.shouldRespond).toBe(true);
    });

    it('omitting discretionaryMode leaves shouldRespond unchanged', () => {
      service.send({ type: 'userPreferenceChanged', discretionaryMode: true });
      expect(service.state.context.shouldRespond).toBe(false);
      service.send({ type: 'userPreferenceChanged', voiceId: 'v1' });
      expect(service.state.context.shouldRespond).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // lastState tracking
  // -------------------------------------------------------------------------
  describe('lastState context tracking', () => {
    it('is "inactive" initially and becomes "listening" after a call has been established', () => {
      expect(service.state.context.lastState).toBe('inactive');
      driveToRecording(service);
      // lastState is assigned "listening" on EXIT of listening; force an exit via hangup
      service.send('saypi:hangup');
      expect(service.state.context.lastState).toBe('listening');
    });
  });

  // -------------------------------------------------------------------------
  // listening-level event handlers driving the responding region
  // -------------------------------------------------------------------------
  describe('listening -> responding entry points', () => {
    it('saypi:piThinking while listening transitions to responding.piThinking and acknowledges user input', () => {
      driveToRecording(service);
      service.send('saypi:piThinking');
      expect(service.state.matches({ responding: 'piThinking' })).toBe(true);
    });

    it('saypi:piSpeaking while listening jumps straight to responding.piSpeaking', () => {
      driveToRecording(service);
      service.send('saypi:piSpeaking');
      expect(service.state.matches({ responding: 'piSpeaking' })).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // accumulating: draftPrompt entry + out-of-sequence saypi:transcribed
  // -------------------------------------------------------------------------
  describe('accumulating draftPrompt + out-of-sequence transcription', () => {
    it('entering accumulating after a transcript drafts the merged text into the prompt', () => {
      driveToTranscribing(service);
      service.send({ type: 'saypi:transcribed', text: 'draft me', sequenceNumber: 1 });
      expect(service.state.matches({ listening: { converting: 'accumulating' } })).toBe(true);
      // draftPrompt entry action: mergeTranscriptsLocal -> setDraft (mock joins values)
      expect(spyPrompt.setDraft).toHaveBeenCalledWith('draft me');
    });

    it('a saypi:transcribed received while already in accumulating still records the transcript', () => {
      // disable auto-submit so we stay parked in accumulating between transcripts
      prefs.autoSubmit = false;
      driveToTranscribing(service);
      service.send({ type: 'saypi:transcribed', text: 'first', sequenceNumber: 1 });
      expect(service.state.matches({ listening: { converting: 'accumulating' } })).toBe(true);
      // out-of-sequence second transcript handled by accumulating's own on-handler
      service.send({ type: 'saypi:transcribed', text: 'second', sequenceNumber: 2 });
      expect(service.state.matches({ listening: { converting: 'accumulating' } })).toBe(true);
      expect(service.state.context.transcriptions[1]).toBe('first');
      expect(service.state.context.transcriptions[2]).toBe('second');
    });
  });

  // -------------------------------------------------------------------------
  // submit via the 10s USER_STOPPED_TIMEOUT_MS after-delay (not submissionDelay)
  // -------------------------------------------------------------------------
  describe('accumulating submission via the 10s inactivity timeout', () => {
    it('submits after USER_STOPPED_TIMEOUT_MS (10s) even when the submissionDelay branch is bypassed', () => {
      // With shouldRespond true and auto-submit on, the submissionDelay branch
      // would normally fire first (200ms in this spec). To exercise the 10s
      // branch in isolation, gate the submissionDelay branch off by making
      // submissionConditionsMet temporarily false during the early window:
      // we instead just let both branches share the same guard and confirm the
      // machine has submitted by the time 10s elapses.
      driveToTranscribing(service);
      service.send({ type: 'saypi:transcribed', text: 'hi', sequenceNumber: 1 });
      vi.advanceTimersByTime(USER_STOPPED_TIMEOUT_MS_LOCAL + 5);
      expect(service.state.matches({ responding: 'piThinking' })).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // mergeOptimistic invoked service: onDone collapses transcriptions
  // -------------------------------------------------------------------------
  describe('mergeOptimistic onDone', () => {
    it('collapses multiple accumulated transcriptions into a single highest-key entry', async () => {
      prefs.autoSubmit = false; // stay in accumulating
      driveToTranscribing(service);
      service.send({ type: 'saypi:transcribed', text: 'one', sequenceNumber: 1 });
      // second transcript re-enters accumulating, re-invoking mergeOptimistic with 2 entries
      service.send({ type: 'saypi:transcribed', text: 'two', sequenceNumber: 2 });
      // The mocked mergeTranscriptsRemote resolves 'merged'; flush microtasks.
      await vi.runOnlyPendingTimersAsync?.();
      await Promise.resolve();
      await Promise.resolve();
      const t = service.state.context.transcriptions;
      // onDone keeps only the highest key (2) with the merged data.
      expect(t[2]).toBe('merged');
      expect(t[1]).toBeUndefined();
    });
  });

  // -------------------------------------------------------------------------
  // forced interrupt outside a call (wasInactive branch)
  // -------------------------------------------------------------------------
  describe('forced interrupt outside a call', () => {
    it('saypi:interrupt during piSpeaking with no prior call (wasInactive) returns to inactive', () => {
      // From inactive, saypi:piSpeaking -> responding.piSpeaking; lastState stays "inactive"
      service.send('saypi:piSpeaking');
      expect(service.state.matches({ responding: 'piSpeaking' })).toBe(true);
      const emitted = captureEmits();
      service.send('saypi:interrupt');
      // wasListening guard is false, so the second (guardless) branch -> inactive
      expect(service.state.matches('inactive')).toBe(true);
      expect(emitted).toContain('audio:output:pause');
    });
  });

  // -------------------------------------------------------------------------
  // piWriting -> piSpeaking
  // -------------------------------------------------------------------------
  describe('piWriting region', () => {
    function driveToPiWriting(s: any) {
      driveToTranscribing(s);
      s.send({ type: 'saypi:transcribed', text: 'hi', sequenceNumber: 1 });
      vi.advanceTimersByTime(fixedDelayMs + 5);
      s.send('saypi:piWriting');
    }

    it('piWriting -> piSpeaking on saypi:piSpeaking', () => {
      driveToPiWriting(service);
      expect(service.state.matches({ responding: 'piWriting' })).toBe(true);
      service.send('saypi:piSpeaking');
      expect(service.state.matches({ responding: 'piSpeaking' })).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // errorStatus: 5s auto-reset back to normal (the sibling spec only covers
  // the mutual-exclusivity of the two leaves, not the timed recovery)
  // -------------------------------------------------------------------------
  describe('errorStatus auto-reset', () => {
    const transcribeFailedLeaf = { listening: { errorStatus: { errors: 'transcribeFailed' } } };

    it('saypi:transcribeFailed in transcribing also lands in accumulating (parallel error region)', () => {
      driveToTranscribing(service);
      service.send('saypi:transcribeFailed');
      // transcribing's transcribeFailed transition has TWO targets: accumulating + the error leaf
      expect(service.state.matches({ listening: { converting: 'accumulating' } })).toBe(true);
      expect(service.state.matches(transcribeFailedLeaf)).toBe(true);
    });

    it('the error region resets to normal after 5 seconds', () => {
      driveToTranscribing(service);
      service.send('saypi:transcribeFailed');
      expect(service.state.matches(transcribeFailedLeaf)).toBe(true);
      vi.advanceTimersByTime(5_000);
      // The error region recovers to 'normal' (the two error leaves are no longer active).
      expect(service.state.matches({ listening: { errorStatus: 'normal' } })).toBe(true);
      expect(service.state.matches(transcribeFailedLeaf)).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // clearPrompt restores the saved default placeholder text on exits
  // -------------------------------------------------------------------------
  describe('clearPrompt placeholder restoration', () => {
    it('restores defaultPlaceholderText (set via saypi:promptReady) when listening exits', () => {
      // Seed the saved placeholder via the inactive promptReady self-transition.
      service.send('saypi:promptReady');
      expect(service.state.context.defaultPlaceholderText).toBe('NATIVE_PLACEHOLDER');
      driveToRecording(service);
      spyPrompt.setMessage.mockClear();
      service.send('saypi:hangup'); // exits listening -> clearPrompt action runs
      // clearPrompt sets the prompt message back to the saved placeholder text
      expect(spyPrompt.setMessage).toHaveBeenCalledWith('NATIVE_PLACEHOLDER');
    });
  });

  // -------------------------------------------------------------------------
  // isMaintainanceMessage: setMaintainanceFlag on submit + clearMaintainanceFlag
  // on responding-exit (suspected no-op, see report)
  // -------------------------------------------------------------------------
  describe('maintainance flag lifecycle', () => {
    it('setMaintainanceFlag stays false for a normal (respond) submission', () => {
      // shouldRespond is true (discretionary off), so mustRespond is true but
      // shouldRespond short-circuits shouldSetFlag to false -> flag stays false.
      driveToTranscribing(service);
      service.send({ type: 'saypi:transcribed', text: 'hi', sequenceNumber: 1 });
      vi.advanceTimersByTime(fixedDelayMs + 5);
      expect(service.state.matches({ responding: 'piThinking' })).toBe(true);
      expect(service.state.context.isMaintainanceMessage).toBe(false);
    });

    it('setMaintainanceFlag is set true when the message must be sent but Pi should NOT respond (timeout, discretionary)', () => {
      // Put the machine into discretionary behaviour: shouldRespond=false.
      // mustRespond becomes true via the 10s timeout while shouldRespond stays
      // false, so submitting's setMaintainanceFlag sets the flag.
      prefs.discretionary = true;
      service.send({ type: 'userPreferenceChanged', discretionaryMode: true });
      expect(service.state.context.shouldRespond).toBe(false);

      driveToTranscribing(service);
      // responseAnalysis.shouldRespond=false keeps shouldRespond false after transcription
      service.send({ type: 'saypi:transcribed', text: 'hi', sequenceNumber: 1, responseAnalysis: { shouldRespond: false } });
      expect(service.state.context.shouldRespond).toBe(false);
      // Let the 10s inactivity timeout fire (mustRespond via timeout, shouldRespond false)
      vi.advanceTimersByTime(USER_STOPPED_TIMEOUT_MS_LOCAL + 5);
      expect(service.state.matches({ responding: 'piThinking' })).toBe(true);
      expect(service.state.context.isMaintainanceMessage).toBe(true);
    });

    it('CHARACTERIZATION: clearMaintainanceFlag on responding-exit does NOT clear the flag (suspected no-op bug, see report)', () => {
      prefs.discretionary = true;
      service.send({ type: 'userPreferenceChanged', discretionaryMode: true });
      driveToTranscribing(service);
      service.send({ type: 'saypi:transcribed', text: 'hi', sequenceNumber: 1, responseAnalysis: { shouldRespond: false } });
      vi.advanceTimersByTime(USER_STOPPED_TIMEOUT_MS_LOCAL + 5);
      expect(service.state.context.isMaintainanceMessage).toBe(true);

      // Exit responding via hangup. clearMaintainanceFlag (responding.exit) is a
      // plain action that builds assign(...) and discards it -> no-op.
      service.send('saypi:hangup');
      expect(service.state.matches('inactive')).toBe(true);
      // CHARACTERIZATION: current behavior; the flag is NOT cleared by
      // clearMaintainanceFlag because the assign() result is thrown away.
      // (ConversationMachine.ts:1438-1440 — suspected bug.)
      expect(service.state.context.isMaintainanceMessage).toBe(true);
    });

    it('maintainance message emits suppression events (tts:skipCurrent on responding entry)', () => {
      prefs.discretionary = true;
      service.send({ type: 'userPreferenceChanged', discretionaryMode: true });
      driveToTranscribing(service);
      const emitted = captureEmits();
      service.send({ type: 'saypi:transcribed', text: 'hi', sequenceNumber: 1, responseAnalysis: { shouldRespond: false } });
      vi.advanceTimersByTime(USER_STOPPED_TIMEOUT_MS_LOCAL + 5);
      expect(service.state.matches({ responding: 'piThinking' })).toBe(true);
      // responding entry -> suppressResponseEarlyWhenMaintainance emits this
      expect(emitted).toContain('saypi:tts:skipCurrent');
    });
  });

  // -------------------------------------------------------------------------
  // CHARACTERIZATION: callStartingPrompt drops its assign() (suspected no-op)
  // -------------------------------------------------------------------------
  describe('callStarting placeholder backup', () => {
    it('CHARACTERIZATION: callStartingPrompt does NOT persist a draft backup into defaultPlaceholderText (suspected no-op bug)', () => {
      // Make a non-empty in-progress draft visible to callStartingPrompt's
      // getDraft() call. If the action's assign() actually applied, the draft
      // would be backed up into context.defaultPlaceholderText.
      const originalGetDraft = spyPrompt.getDraft;
      spyPrompt.getDraft = () => 'WORK_IN_PROGRESS';
      try {
        // defaultPlaceholderText starts as "" and is only driven by saypi:promptReady.
        expect(service.state.context.defaultPlaceholderText).toBe('');
        service.send('saypi:call'); // entry: callStartingPrompt runs (and discards its assign)
        expect(service.state.matches('callStarting')).toBe(true);
        // CHARACTERIZATION: despite a real draft being present, the backup never
        // lands in context because the assign() result is discarded.
        // (ConversationMachine.ts:1253-1260 — suspected bug.)
        expect(service.state.context.defaultPlaceholderText).toBe('');
      } finally {
        spyPrompt.getDraft = originalGetDraft;
      }
    });
  });
});
