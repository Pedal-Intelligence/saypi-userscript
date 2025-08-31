import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AbstractUserPrompt } from '../../src/chatbots/AbstractChatbots';
import EventBus from '../../src/events/EventBus.js';

class FakePrompt extends AbstractUserPrompt {
  PROMPT_CHARACTER_LIMIT = 100000;
  constructor(el: HTMLElement) { super(el as any); }
  setText(text: string): void { (this.element as any).textContent = text; }
  getText(): string { return (this.element as any).textContent || ''; }
  setPlaceholderText(_text: string): void {}
  getPlaceholderText(): string { return ''; }
  getDefaultPlaceholderText(): string { return ''; }
}

describe('AbstractUserPrompt.typeText', () => {
  let el: HTMLElement;
  let prompt: FakePrompt;
  let rafOrig: any;

  beforeEach(() => {
    document.body.innerHTML = '';
    el = document.createElement('div');
    el.contentEditable = 'true';
    document.body.appendChild(el);
    prompt = new FakePrompt(el);
    // Make rAF synchronous to advance the typing loop immediately
    rafOrig = globalThis.requestAnimationFrame;
    // @ts-ignore
    globalThis.requestAnimationFrame = (cb: FrameRequestCallback) => { cb(0 as any); return 0 as any; };
  });

  it('types sentences without duplicating existing content', () => {
    // Pre-existing draft content should be replaced
    el.textContent = 'DRAFT TEXT';
    (prompt as any).typeText('Hello world. How are you?', false);
    expect(el.textContent).toBe('Hello world. How are you?');
  });

  it('splits on sentence punctuation and accumulates correctly', () => {
    (prompt as any).typeText('A? B! C.', false);
    expect(el.textContent).toBe('A? B! C.');
  });

  it('emits autoSubmit once when submit=true', () => {
    const emitSpy = vi.spyOn(EventBus, 'emit');
    (prompt as any).typeText('Done.', true);
    expect(emitSpy).toHaveBeenCalledWith('saypi:autoSubmit');
    emitSpy.mockRestore();
  });

  afterEach(() => {
    // @ts-ignore
    globalThis.requestAnimationFrame = rafOrig;
  });
});

