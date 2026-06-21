import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTestActor } from './support/testActor';

// ---------------------------------------------------------------------------
// Regression guard for the "Pi is thinking…" STUCK PLACEHOLDER bug.
//
// The `responding.piThinking` state sets the host prompt placeholder to the
// "$chatbot$ is thinking..." message on entry and restores the native
// placeholder (`clearPrompt` -> defaultPlaceholderText) on exit. Its ONLY exits
// are `saypi:piWriting` and `saypi:piSpeaking`. With TTS output off, audio never
// plays so `saypi:piSpeaking` never fires; and if pi.ai's streamed-response DOM
// drifts out from under PiTextStream's detection, `saypi:piWriting` never fires
// either. The machine then sits in piThinking forever — Pi's reply is rendered
// by Pi itself, but SayPi's placeholder is frozen on "Pi is thinking…".
//
// This test reproduces that: drive the machine into responding.piThinking, then
// let real wall-clock-equivalent time pass WITHOUT sending piWriting/piSpeaking,
// and assert the machine recovers (leaves piThinking and restores the
// placeholder) via a timeout fallback. Before the fix it stays stuck and this
// fails; after adding the `after` fallback it passes.
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

// i18n returns a distinct sentinel for the "thinking" message so we can tell it
// apart from the restored (default) placeholder, which is "".
vi.mock('../../src/i18n', () => ({
  default: vi.fn(() => 'THINKING_MSG'),
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

// Records every placeholder write so we can assert the restore happened.
const setMessageCalls: string[] = [];
const spyPrompt = {
  setMessage(text: string) { setMessageCalls.push(text); },
  setDraft(_: string) {},
  setFinal(_: string) {},
  getDraft() { return ''; },
  getDefaultPlaceholderText() { return ''; },
};
// getPromptOrNull() resolves the prompt as chatbot.getPrompt(#saypi-prompt), so
// return the single shared spy regardless of the element passed.
const StubChatbot = {
  getName: () => 'Pi',
  getPrompt: (_el?: HTMLElement) => spyPrompt,
  getContextWindowCapacityCharacters: () => 1_000_000,
};

function driveToPiThinking(service: any) {
  service.send('saypi:call');
  service.send('saypi:callReady');
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
  // Elapse the submission delay so the machine submits -> responding.piThinking
  vi.advanceTimersByTime(fixedDelayMs + 5);
}

describe('ConversationMachine: piThinking never gets stuck (stuck-placeholder guard)', () => {
  let service: any;

  beforeEach(() => {
    setMessageCalls.length = 0;
    // getPromptOrNull() looks up #saypi-prompt in the DOM before delegating to
    // the chatbot, so the element must exist for the prompt actions to run.
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

  it('leaves piThinking and restores the placeholder when neither piWriting nor piSpeaking ever fires', () => {
    driveToPiThinking(service);
    expect(service.state.matches({ responding: 'piThinking' })).toBe(true);
    // The thinking placeholder was written on entry.
    expect(setMessageCalls).toContain('THINKING_MSG');

    // Simulate a missed completion signal: Pi answers in the DOM but SayPi never
    // observes piWriting/piSpeaking. Let a generous amount of time pass.
    setMessageCalls.length = 0;
    vi.advanceTimersByTime(20_000);

    // The machine must NOT still be stuck thinking…
    expect(service.state.matches({ responding: 'piThinking' })).toBe(false);
    // …it should fall back to the call's listening state (the call was active).
    expect(service.state.matches('listening')).toBe(true);
    // …and the native placeholder must be restored (clearPrompt ran on exit).
    expect(setMessageCalls).toContain('');
  });
});
