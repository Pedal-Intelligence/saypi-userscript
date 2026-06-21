import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createTestActor } from './support/testActor';
import EventBus from '../../src/events/EventBus.js';

// Mock dependencies (mirrors DictationMachine-OutOfOrder.spec.ts so the machine
// can run headless without real audio/network/preferences).
vi.mock('../../src/TranscriptionModule', () => ({
  uploadAudioWithRetry: vi.fn(() => Promise.resolve(1)),
  isTranscriptionPending: vi.fn(() => false),
  clearPendingTranscriptions: vi.fn(),
  getCurrentSequenceNumber: vi.fn(() => 1),
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
      // Smart join identical to the production fallback for whitespace-free inputs.
      const sortedKeys = Object.keys(transcripts)
        .map(Number)
        .sort((a, b) => a - b);

      let result = '';
      for (let i = 0; i < sortedKeys.length; i++) {
        const segment = transcripts[sortedKeys[i]];
        if (i === 0) {
          result += segment;
        } else {
          const previousEndsWS = result.match(/\s$/);
          const currentStartsWS = segment.match(/^\s/);
          result += previousEndsWS || currentStartsWS ? segment : ' ' + segment;
        }
      }
      return result;
    }),
  })),
}));

vi.spyOn(EventBus, 'emit');

import { createDictationMachine } from '../../src/state-machines/DictationMachine';

/**
 * #178 — Dictation should insert transcribed text at the caret position, preserving
 * text before and after, rather than always appending at the end of the field.
 *
 * Scope of this suite: <input> and <textarea> (selectionStart/selectionEnd). The
 * worked example from the issue is: "Hello |world" + dictate "beautiful" ->
 * "Hello beautiful |world".
 *
 * Note on the regression-safety property these tests also lock in: when the caret
 * sits at the END of the field (the default after a programmatic value assignment,
 * matching real browsers), insert-at-caret is byte-identical to the previous
 * append-at-end behavior.
 */
describe('DictationMachine - Insert at Caret (#178)', () => {
  let service: any;

  const startOn = (element: HTMLElement) => {
    service.start();
    service.send('saypi:startDictation', { targetElement: element });
    service.send('saypi:callReady');
  };

  const transcribe = (
    element: HTMLElement,
    text: string,
    sequenceNumber: number = 1,
    merged?: number[]
  ) => {
    service.state.context.transcriptionTargets[sequenceNumber] = element;
    service.send('saypi:transcribed', {
      text,
      sequenceNumber,
      ...(merged ? { merged } : {}),
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    const machine = createDictationMachine();
    service = createTestActor(machine);
  });

  afterEach(() => {
    if (service) service.stop();
  });

  it('inserts dictated text at a collapsed caret in a textarea (the issue example)', () => {
    const textarea = document.createElement('textarea');
    textarea.id = 'caret-textarea';
    textarea.value = 'Hello world';
    // Caret between "Hello " and "world" (offset 6).
    textarea.setSelectionRange(6, 6);
    document.body.appendChild(textarea);

    startOn(textarea);
    transcribe(textarea, 'beautiful');

    expect(textarea.value).toBe('Hello beautiful world');
    // Caret should advance to just after the inserted text, before the preserved "world".
    expect(textarea.selectionStart).toBe('Hello beautiful '.length);
    expect(textarea.selectionEnd).toBe('Hello beautiful '.length);

    document.body.removeChild(textarea);
  });

  it('inserts at the start of the field when the caret is at offset 0', () => {
    const textarea = document.createElement('textarea');
    textarea.id = 'caret-start-textarea';
    textarea.value = 'world';
    textarea.setSelectionRange(0, 0);
    document.body.appendChild(textarea);

    startOn(textarea);
    transcribe(textarea, 'Hello');

    expect(textarea.value).toBe('Hello world');
    // Caret sits at the start of the preserved trailing text ("world"), after the
    // smart-inserted separator — matching the issue's "Hello beautiful |world" example.
    expect(textarea.selectionStart).toBe('Hello '.length);

    document.body.removeChild(textarea);
  });

  it('replaces the selected range when a selection (not just a caret) is active', () => {
    const textarea = document.createElement('textarea');
    textarea.id = 'caret-selection-textarea';
    textarea.value = 'Hello cruel world';
    // Select "cruel" (offsets 6..11).
    textarea.setSelectionRange(6, 11);
    document.body.appendChild(textarea);

    startOn(textarea);
    transcribe(textarea, 'kind');

    expect(textarea.value).toBe('Hello kind world');
    expect(textarea.selectionStart).toBe('Hello kind'.length);

    document.body.removeChild(textarea);
  });

  it('inserts at the caret in an <input> element too', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'caret-input';
    input.value = 'ab cd';
    // Caret after "ab " (offset 3).
    input.setSelectionRange(3, 3);
    document.body.appendChild(input);

    startOn(input);
    transcribe(input, 'XX');

    expect(input.value).toBe('ab XX cd');
    expect(input.selectionStart).toBe('ab XX '.length);

    document.body.removeChild(input);
  });

  it('preserves text before and after across out-of-order transcriptions', () => {
    const textarea = document.createElement('textarea');
    textarea.id = 'caret-ooo-textarea';
    textarea.value = 'start end';
    // Caret after "start " (offset 6), before "end".
    textarea.setSelectionRange(6, 6);
    document.body.appendChild(textarea);

    startOn(textarea);

    // Two dictated segments arrive out of order (seq 2 before seq 1).
    transcribe(textarea, 'two', 2);
    transcribe(textarea, 'one', 1);

    // Final composed dictation is "one two", inserted at the caret.
    expect(textarea.value).toBe('start one two end');
    expect(textarea.selectionStart).toBe('start one two '.length);

    document.body.removeChild(textarea);
  });

  it('preserves text before and after when the server merges sequences', () => {
    // Acceptance criterion: "Out-of-order responses and server merges still produce
    // correct final text" with before/after preserved. The server-merge branch must
    // not discard the text before the caret.
    const textarea = document.createElement('textarea');
    textarea.id = 'caret-merge-textarea';
    textarea.value = 'Hello world';
    textarea.setSelectionRange(6, 6); // "Hello |world"
    document.body.appendChild(textarea);

    startOn(textarea);

    // First fragment, then a server-merged correction that subsumes seq 1 into seq 2.
    transcribe(textarea, 'foo', 1);
    expect(textarea.value).toBe('Hello foo world');

    transcribe(textarea, 'foo bar', 2, [1]);

    expect(textarea.value).toBe('Hello foo bar world');
    expect(textarea.selectionStart).toBe('Hello foo bar '.length);

    document.body.removeChild(textarea);
  });

  it('keeps the caret at the insertion point across each live update', () => {
    // The live phase replaces all content on every update; the caret must be
    // re-restored to the insertion point each time, not jump to the end.
    const textarea = document.createElement('textarea');
    textarea.id = 'caret-live-textarea';
    textarea.value = 'A Z';
    textarea.setSelectionRange(2, 2); // "A |Z"
    document.body.appendChild(textarea);

    startOn(textarea);

    transcribe(textarea, 'one', 1);
    expect(textarea.value).toBe('A one Z');
    expect(textarea.selectionStart).toBe('A one '.length);

    transcribe(textarea, 'two', 2);
    expect(textarea.value).toBe('A one two Z');
    expect(textarea.selectionStart).toBe('A one two '.length);

    document.body.removeChild(textarea);
  });

  it('appends at the end (unchanged behavior) when the caret is at the end of the field', () => {
    const textarea = document.createElement('textarea');
    textarea.id = 'caret-end-textarea';
    textarea.value = 'Hello world';
    // Default caret after a value assignment is the end; assert that explicitly.
    expect(textarea.selectionStart).toBe('Hello world'.length);
    document.body.appendChild(textarea);

    startOn(textarea);
    transcribe(textarea, 'again');

    // Same result the pre-#178 append-at-end path produced.
    expect(textarea.value).toBe('Hello world again');
    expect(textarea.selectionStart).toBe('Hello world again'.length);

    document.body.removeChild(textarea);
  });
});
