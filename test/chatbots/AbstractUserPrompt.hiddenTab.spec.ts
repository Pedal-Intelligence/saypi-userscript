import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AbstractUserPrompt } from '../../src/chatbots/AbstractChatbots';
import EventBus from '../../src/events/EventBus.js';

/**
 * Issue #101: browsers suspend requestAnimationFrame in a hidden tab, so the
 * sentence-by-sentence typing animation in `typeText` never advances and the
 * `saypi:autoSubmit` that ends it never fires. The user switches tabs mid-turn,
 * comes back, and finds their transcript sitting unsent in the composer.
 *
 * These specs model a hidden tab the only honest way: rAF is stubbed to *never*
 * call back, exactly as a real browser behaves while the tab is in the
 * background.
 */

class FakePrompt extends AbstractUserPrompt {
  PROMPT_CHARACTER_LIMIT = 100000;
  constructor(el: HTMLElement) { super(el as any); }
  setText(text: string): void { (this.element as any).textContent = text; }
  getText(): string { return (this.element as any).textContent || ''; }
  setPlaceholderText(_text: string): void {}
  getPlaceholderText(): string { return ''; }
  getDefaultPlaceholderText(): string { return ''; }
}

describe('AbstractUserPrompt.typeText in a background tab', () => {
  let el: HTMLElement;
  let prompt: FakePrompt;
  let rafOrig: any;
  let pendingFrames: FrameRequestCallback[];
  let hidden: boolean;
  let emitSpy: ReturnType<typeof vi.spyOn>;

  const autoSubmitCount = () =>
    emitSpy.mock.calls.filter((call) => call[0] === 'saypi:autoSubmit').length;

  const setHidden = (value: boolean) => {
    hidden = value;
    document.dispatchEvent(new Event('visibilitychange'));
  };

  beforeEach(() => {
    document.body.innerHTML = '';
    el = document.createElement('div');
    el.contentEditable = 'true';
    document.body.appendChild(el);
    prompt = new FakePrompt(el);

    hidden = false;
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => hidden,
    });

    // A hidden tab queues animation frames and never runs them.
    pendingFrames = [];
    rafOrig = globalThis.requestAnimationFrame;
    // @ts-ignore
    globalThis.requestAnimationFrame = (cb: FrameRequestCallback) => {
      pendingFrames.push(cb);
      return pendingFrames.length as any;
    };

    emitSpy = vi.spyOn(EventBus, 'emit');
  });

  afterEach(() => {
    // @ts-ignore
    globalThis.requestAnimationFrame = rafOrig;
    // @ts-ignore
    delete (document as any).hidden;
    emitSpy.mockRestore();
  });

  it('types the whole transcript and submits once when the tab is already hidden', () => {
    hidden = true;

    (prompt as any).typeText('Hello world. How are you? ', true);

    expect(el.textContent).toBe('Hello world. How are you? ');
    expect(autoSubmitCount()).toBe(1);
  });

  it('does not submit a hidden-tab draft when submit is false', () => {
    hidden = true;

    (prompt as any).typeText('Just a draft. Nothing more. ', false);

    expect(el.textContent).toBe('Just a draft. Nothing more. ');
    expect(autoSubmitCount()).toBe(0);
  });

  it('finishes the turn when the tab is hidden mid-animation', () => {
    (prompt as any).typeText('One. Two. Three. ', true);

    // Foreground start: the first sentence is typed, the rest awaits a frame.
    expect(el.textContent).toBe('One.');
    expect(autoSubmitCount()).toBe(0);

    setHidden(true);

    expect(el.textContent).toBe('One. Two. Three. ');
    expect(autoSubmitCount()).toBe(1);
  });

  it('does not submit twice if a suspended frame runs after the takeover', () => {
    (prompt as any).typeText('One. Two. ', true);
    setHidden(true);
    expect(autoSubmitCount()).toBe(1);

    // Returning to the foreground flushes the frames the browser had parked.
    hidden = false;
    pendingFrames.splice(0).forEach((cb) => cb(0 as any));

    expect(el.textContent).toBe('One. Two. ');
    expect(autoSubmitCount()).toBe(1);
  });
});
