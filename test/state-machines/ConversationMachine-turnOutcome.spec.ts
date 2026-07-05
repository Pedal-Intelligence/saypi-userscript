import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTestActor } from './support/testActor';

// ---------------------------------------------------------------------------
// Turn-outcome emission wiring (issue #505).
//
// The resume window lives entirely in ConversationMachine: it OPENS when the
// endpointing auto-submit fires (converting.submitting) and CLOSES on the single
// transition that leaves responding.piThinking:
//   - piThinking -> piWriting / piSpeaking : the response started (response_started_at = now)
//   - piThinking -> userInterrupting        : the user resumed first (user_resumed, resumed_at)
//   - PI_THINKING_TIMEOUT_MS fallback         : response never started (response_started_at = null)
// piThinking is entered/left exactly once per turn, so exactly one event fires.
//
// These tests assert the machine hands the right observation to postTurnOutcome
// (mocked). The correlation data (session id, last sequence number, score,
// speech-offset) is snapshotted from context at submit time.
// ---------------------------------------------------------------------------

// Mutable knobs so a single spec file can exercise both the normal (respond)
// path and the maintenance-message (suppressed) path.
const knobs = vi.hoisted(() => ({
  discretionary: false,
  allowInterruptions: true,
  capacity: 1_000_000,
}));

const postTurnOutcomeMock = vi.hoisted(() => vi.fn());
vi.mock('../../src/TurnOutcomeModule', () => ({
  postTurnOutcome: postTurnOutcomeMock,
}));

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
  }
  class NoopTextual { showNotification() {}; hideNotification() {}; }
  class NoopVisual { listeningStopped() {}; listeningTimeRemaining() {}; }
  return {
    AudibleNotificationsModule: NoopAudible,
    TextualNotificationsModule: NoopTextual,
    VisualNotificationsModule: NoopVisual,
  };
});

vi.mock('../../src/audio/AudioControlsModule', () => ({
  default: vi.fn().mockImplementation(() => ({ activateAudioOutput: vi.fn() })),
}));

vi.mock('../../src/WakeLockModule', () => ({
  requestWakeLock: vi.fn(),
  releaseWakeLock: vi.fn(),
}));

vi.mock('../../src/i18n', () => ({ default: vi.fn(() => 'MSG') }));

const fixedDelayMs = 200;
vi.mock('../../src/TimerModule', () => ({
  calculateDelay: vi.fn(() => fixedDelayMs),
}));

vi.mock('../../src/TranscriptionModule', () => ({
  uploadAudioWithRetry: vi.fn(() => Promise.resolve(1)),
  isTranscriptionPending: vi.fn(() => false),
  clearPendingTranscriptions: vi.fn(),
  getCurrentSequenceNumber: vi.fn(() => 1),
}));

vi.mock('../../src/TranscriptMergeService', () => ({
  TranscriptMergeService: vi.fn().mockImplementation(() => ({
    mergeTranscriptsLocal: (t: Record<number, string>) => Object.values(t).join(' '),
  })),
}));

vi.mock('../../src/prefs/PreferenceModule', () => ({
  UserPreferenceModule: {
    getInstance: () => ({
      getLanguage: () => Promise.resolve('en'),
      getDiscretionaryMode: () => Promise.resolve(knobs.discretionary),
      getCachedDiscretionaryMode: () => knobs.discretionary,
      getCachedAutoSubmit: () => true,
      getCachedAllowInterruptions: () => knobs.allowInterruptions,
      getCachedNickname: () => null,
    }),
  },
}));

import { createConversationMachine } from '../../src/state-machines/ConversationMachine';

const spyPrompt = {
  setMessage(_: string) {},
  setDraft(_: string) {},
  setFinal(_: string) {},
  getDraft() { return ''; },
  getDefaultPlaceholderText() { return ''; },
};
const StubChatbot = {
  getName: () => 'Pi',
  getPrompt: (_el?: HTMLElement) => spyPrompt,
  getContextWindowCapacityCharacters: () => knobs.capacity,
};

// Drive: place a call, speak one clip, transcribe it, then let the submission
// delay elapse so the machine auto-submits into responding.piThinking.
function driveToPiThinking(service: any) {
  service.send('saypi:call');
  service.send('saypi:callReady');
  // session:assigned is only handled once the machine is listening (it lives in
  // the listening parallel region's `on`), mirroring the real session lifecycle.
  service.send({ type: 'saypi:session:assigned', session_id: 'sess-1' });
  service.send('saypi:userSpeaking');
  const blob = new Blob(['a'], { type: 'audio/webm' });
  service.send({ type: 'saypi:userStoppedSpeaking', duration: 800, blob });
  vi.advanceTimersByTime(50);
  service.send({
    type: 'saypi:transcribed',
    text: 'Good evening.',
    sequenceNumber: 1,
    pFinishedSpeaking: 0.2,
    tempo: 0.86,
  });
  vi.advanceTimersByTime(fixedDelayMs + 5);
}

describe('ConversationMachine: turn-outcome emission', () => {
  let service: any;

  beforeEach(() => {
    knobs.discretionary = false;
    knobs.allowInterruptions = true;
    knobs.capacity = 1_000_000;
    postTurnOutcomeMock.mockClear();
    document.body.innerHTML = '<textarea id="saypi-prompt"></textarea>';
    vi.useFakeTimers();
    vi.setSystemTime(new Date(1_000_000));
    const machine = createConversationMachine(StubChatbot as any);
    service = createTestActor(machine);
    service.start();
  });

  afterEach(() => {
    try { service?.stop(); } catch {}
    vi.useRealTimers();
  });

  it('emits response-started with the turn snapshot when the reply text appears (piWriting)', () => {
    driveToPiThinking(service);
    expect(service.state.matches({ responding: 'piThinking' })).toBe(true);

    service.send('saypi:piWriting');

    expect(postTurnOutcomeMock).toHaveBeenCalledTimes(1);
    const arg = postTurnOutcomeMock.mock.calls[0][0];
    expect(arg.trigger).toBe('auto');
    expect(arg.userResumed).toBe(false);
    expect(arg.resumedAt).toBeNull();
    expect(typeof arg.responseStartedAt).toBe('number');
    // correlation snapshot from context
    expect(arg.sessionId).toBe('sess-1');
    expect(arg.lastSequenceNumber).toBe(1);
    expect(arg.pFinishedSpeaking).toBe(0.2);
    expect(typeof arg.submittedAt).toBe('number');
    expect(typeof arg.lastSpeechEndedAt).toBe('number');
    expect(arg.lastSpeechEndedAt).toBeGreaterThan(0);
  });

  it('emits response-started when TTS begins (piSpeaking)', () => {
    driveToPiThinking(service);
    service.send('saypi:piSpeaking');

    expect(postTurnOutcomeMock).toHaveBeenCalledTimes(1);
    const arg = postTurnOutcomeMock.mock.calls[0][0];
    expect(arg.userResumed).toBe(false);
    expect(typeof arg.responseStartedAt).toBe('number');
  });

  it('emits a resume (false-finish) when the user speaks again before the response starts', () => {
    driveToPiThinking(service);
    expect(service.state.matches({ responding: 'piThinking' })).toBe(true);

    // The user resumes mid-window. This is the load-bearing assumption:
    // saypi:userSpeaking is observable in piThinking and captured as a resume.
    service.send('saypi:userSpeaking');

    expect(service.state.matches({ responding: 'userInterrupting' })).toBe(true);
    expect(postTurnOutcomeMock).toHaveBeenCalledTimes(1);
    const arg = postTurnOutcomeMock.mock.calls[0][0];
    expect(arg.userResumed).toBe(true);
    expect(typeof arg.resumedAt).toBe('number');
    expect(arg.responseStartedAt).toBeNull();
  });

  it('emits with no response_started_at when piThinking times out (response never starts)', () => {
    driveToPiThinking(service);
    expect(service.state.matches({ responding: 'piThinking' })).toBe(true);

    vi.advanceTimersByTime(20_000); // exceed PI_THINKING_TIMEOUT_MS

    expect(service.state.matches({ responding: 'piThinking' })).toBe(false);
    expect(postTurnOutcomeMock).toHaveBeenCalledTimes(1);
    const arg = postTurnOutcomeMock.mock.calls[0][0];
    expect(arg.userResumed).toBe(false);
    expect(arg.responseStartedAt).toBeNull();
  });

  it('does NOT re-emit a stale snapshot when piThinking is entered outside the auto-submit path', () => {
    // Turn 1: a real auto-submit -> response starts -> one emit, then back to listening.
    driveToPiThinking(service);
    service.send('saypi:piWriting');
    expect(postTurnOutcomeMock).toHaveBeenCalledTimes(1);
    service.send('saypi:piStoppedWriting');
    expect(service.state.matches('listening')).toBe(true);

    // A later, non-SayPi-submit thinking episode (e.g. the assistant starts
    // responding to a manually-typed message) enters responding.piThinking via
    // the listening `saypi:piThinking` handler — NOT via converting.submitting, so
    // no fresh snapshot is taken. The prior turn's snapshot must not be re-emitted.
    service.send('saypi:piThinking');
    expect(service.state.matches({ responding: 'piThinking' })).toBe(true);
    service.send('saypi:piWriting');

    expect(postTurnOutcomeMock).toHaveBeenCalledTimes(1); // still only turn 1's emit
  });

  it('does NOT emit for maintenance messages (suppressed, forced buffer flush)', () => {
    // discretionary mode -> shouldRespond false; tiny context window -> mustRespond
    // via capacity. Together: mustRespond && !shouldRespond == maintenance.
    knobs.discretionary = true;
    knobs.capacity = 1;

    driveToPiThinking(service);
    expect(service.state.matches({ responding: 'piThinking' })).toBe(true);

    service.send('saypi:piWriting');

    expect(postTurnOutcomeMock).not.toHaveBeenCalled();
  });
});
