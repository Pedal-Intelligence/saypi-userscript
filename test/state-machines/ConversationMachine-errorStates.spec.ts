import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { interpret } from 'xstate';

// ---------------------------------------------------------------------------
// Regression guard for #311: the two non-fatal in-call error conditions must be
// MUTUALLY EXCLUSIVE.
//
//   saypi:transcribeFailed  -> the /transcribe API errored (error animation)
//   saypi:transcribedEmpty  -> no speech detected            (mic-error hint)
//
// They were modelled as the two regions of a `type: "parallel"` state
// (`errorStatus.errors`). In XState, entering any descendant of a parallel
// state enters ALL regions, so a pure /transcribe failure ALSO activated
// `micError` (showing the misleading "check your microphone" toast), and an
// empty transcription ALSO fired the transcribeFailed animation. The two error
// UIs could never be shown independently.
//
// This drives a call to the `transcribing` state and sends ONE error event,
// then asserts exactly one of the two error leaves is active. Before the fix
// (parallel) the sibling leaf is also active and the `...micError === false`
// / `...transcribeFailed === false` assertions fail.
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
  default: vi.fn(() => 'MSG'),
}));

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
    mergeTranscriptsRemote: vi.fn(() => Promise.resolve('merged')),
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
  getContextWindowCapacityCharacters: () => 1_000_000,
};

const transcribeFailedLeaf = { listening: { errorStatus: { errors: 'transcribeFailed' } } };
const micErrorLeaf = { listening: { errorStatus: { errors: 'micError' } } };

function driveToTranscribing(service: any) {
  service.send('saypi:call');
  service.send('saypi:callReady');
  service.send('saypi:userSpeaking');
  const blob = new Blob(['a'], { type: 'audio/webm' });
  service.send({ type: 'saypi:userStoppedSpeaking', duration: 800, blob });
  vi.advanceTimersByTime(50);
}

describe('ConversationMachine #311: transcribe vs mic errors are mutually exclusive', () => {
  let service: any;

  beforeEach(() => {
    document.body.innerHTML = '<textarea id="saypi-prompt"></textarea>';
    vi.useFakeTimers();
    vi.setSystemTime(new Date(1_000_000));
    const machine = createConversationMachine(StubChatbot as any);
    service = interpret(machine);
    service.start();
  });

  afterEach(() => {
    try { service?.stop(); } catch {}
    vi.useRealTimers();
  });

  it('saypi:transcribeFailed activates ONLY transcribeFailed, not micError', () => {
    driveToTranscribing(service);
    expect(service.state.matches({ listening: { errorStatus: 'normal' } })).toBe(true);

    service.send({ type: 'saypi:transcribeFailed', sequenceNumber: 1 });

    expect(service.state.matches(transcribeFailedLeaf)).toBe(true);
    // The sibling mic-error must NOT be active (it was, under type:"parallel").
    expect(service.state.matches(micErrorLeaf)).toBe(false);
  });

  it('saypi:transcribedEmpty activates ONLY micError, not transcribeFailed', () => {
    driveToTranscribing(service);
    expect(service.state.matches({ listening: { errorStatus: 'normal' } })).toBe(true);

    service.send({ type: 'saypi:transcribedEmpty', sequenceNumber: 1 });

    expect(service.state.matches(micErrorLeaf)).toBe(true);
    expect(service.state.matches(transcribeFailedLeaf)).toBe(false);
  });
});
