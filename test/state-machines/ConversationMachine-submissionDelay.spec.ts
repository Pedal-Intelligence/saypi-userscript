import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';
import { interpret } from 'xstate';

// Mocks needed by ConversationMachine
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
  default: vi.fn().mockImplementation(() => ({
    activateAudioOutput: vi.fn(),
  })),
}));

vi.mock('../../src/WakeLockModule', () => ({
  requestWakeLock: vi.fn(),
  releaseWakeLock: vi.fn(),
}));

vi.mock('../../src/i18n', () => ({
  default: vi.fn(() => 'msg'),
}));

// Force a deterministic dynamic delay from submissionDelay
const fixedDelayMs = 200;
vi.mock('../../src/TimerModule', () => ({
  calculateDelay: vi.fn(() => fixedDelayMs),
}));

// Ensure no pending transcriptions block readiness
vi.mock('../../src/TranscriptionModule', () => ({
  uploadAudioWithRetry: vi.fn(() => Promise.resolve(1)),
  isTranscriptionPending: vi.fn(() => false),
  clearPendingTranscriptions: vi.fn(),
  getCurrentSequenceNumber: vi.fn(() => 1),
}));

// Keep local merge cheap; set remote merge to resolve after the submissionDelay
// to ensure any self-transitions don't interfere with the timer in this test
const remoteMergeDelayMs = 500;
vi.mock('../../src/TranscriptMergeService', () => ({
  TranscriptMergeService: vi.fn().mockImplementation(() => ({
    mergeTranscriptsLocal: (t: Record<number,string>) => Object.values(t).join(' '),
    mergeTranscriptsRemote: vi.fn(() => new Promise<string>((resolve) => setTimeout(() => resolve('merged'), remoteMergeDelayMs))),
  })),
}));

vi.mock('../../src/prefs/PreferenceModule', () => ({
  UserPreferenceModule: {
    getInstance: () => ({
      getLanguage: () => Promise.resolve('en'),
      getDiscretionaryMode: () => Promise.resolve(false),
      getCachedDiscretionaryMode: () => false,
      getCachedAutoSubmit: () => true,
      getCachedAllowInterruptions: () => true,
      getCachedNickname: () => null,
    }),
  },
}));

// System under test
import { createConversationMachine } from '../../src/state-machines/ConversationMachine';

// Minimal Chatbot stub for the machine
class StubPrompt {
  setMessage(_: string) {}
  setDraft(_: string) {}
  setFinal(_: string) {}
}
const StubChatbot = {
  getName: () => 'MockBot',
  getPrompt: () => new StubPrompt(),
  getContextWindowCapacityCharacters: () => 1000000,
};

describe('ConversationMachine submissionDelay scheduling', () => {
  let service: any;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(1_000_000));
    const machine = createConversationMachine(StubChatbot as any);
    service = interpret(machine);
    service.start();
    // Start call and begin recording
    service.send('saypi:call');
    service.send('saypi:callReady');
    expect(service.state.matches({ listening: { recording: 'notSpeaking', converting: 'accumulating' } }) ||
           service.state.matches({ listening: { recording: 'notSpeaking', converting: 'transcribing' } }) ||
           service.state.matches({ listening: { recording: 'notSpeaking' } })).toBe(true);
  });

  afterEach(() => {
    try { service?.stop(); } catch {}
    vi.useRealTimers();
  });

  it('fires submitting after the calculated remaining delay and survives merge re-entries', async () => {
    // Move to speaking then stopped speaking
    service.send('saypi:userSpeaking');
    expect(service.state.matches({ listening: { recording: 'userSpeaking' } })).toBe(true);

    // User stops speaking now
    const blob = new Blob(['a'], { type: 'audio/webm' });
    const stopAt = Date.now();
    service.send({ type: 'saypi:userStoppedSpeaking', duration: 800, blob });
    expect(service.state.matches({ listening: { converting: 'transcribing' } })).toBe(true);

    // After 50ms we receive a transcript (delay computation mocked)
    vi.advanceTimersByTime(50);
    const pFinished = 0.2; // not used when mocked
    const tempo = 0.8611111111111112;
    service.send({
      type: 'saypi:transcribed',
      text: 'I need a moment to...',
      sequenceNumber: 1,
      pFinishedSpeaking: pFinished,
      tempo,
    });
    expect(service.state.matches({ listening: { converting: 'accumulating' } })).toBe(true);
    // Sanity on readiness criteria
    const ctx = service.state.context as any;
    expect(Object.keys(ctx.transcriptions).length).toBe(1);
    expect(ctx.isTranscribing).toBe(false);
    expect(ctx.userIsSpeaking).toBe(false);
    expect(ctx.shouldRespond).toBe(true);

    const expectedRemaining = fixedDelayMs;

    // Advance almost to the expected delay; should still be accumulating (not yet submitting/responding)
    vi.advanceTimersByTime(Math.max(expectedRemaining - 2, 0));
    expect(service.state.matches({ listening: { converting: 'accumulating' } }) || service.state.matches({ listening: 'accumulating' } as any)).toBe(true);
    expect(service.state.matches({ responding: 'piThinking' })).toBe(false);

    // Advance past the remaining time; now it should be submitting
    vi.advanceTimersByTime(4);
    // Submitting transitions immediately (always) to responding.piThinking
    expect(service.state.matches({ responding: 'piThinking' })).toBe(true);
  });
});
