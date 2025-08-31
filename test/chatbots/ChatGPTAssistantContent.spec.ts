import { describe, it, expect, beforeEach } from 'vitest';
import { getAssistantContentSelector } from '../../src/chatbots/chatgpt/MessageSelectors';

describe('ChatGPT assistant content selector', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('matches .prose content blocks', () => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<div class="message"><div class="prose"><p>Hello ChatGPT</p></div></div>`;
    document.body.appendChild(wrapper);
    const sel = getAssistantContentSelector();
    const matches = document.querySelectorAll(sel);
    expect(matches.length).toBe(1);
    expect((matches[0] as HTMLElement).classList.contains('prose')).toBe(true);
  });

  it('matches [data-message-id] content blocks', () => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<div class="message"><div data-message-id="m1">Tokens stream here</div></div>`;
    document.body.appendChild(wrapper);
    const sel = getAssistantContentSelector();
    const matches = document.querySelectorAll(sel);
    expect(matches.length).toBe(1);
    expect((matches[0] as HTMLElement).getAttribute('data-message-id')).toBe('m1');
  });
});

