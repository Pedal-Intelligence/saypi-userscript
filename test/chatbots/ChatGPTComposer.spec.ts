import { describe, it, expect, beforeEach } from 'vitest';
import { findPromptInputInComposer, findControlsContainerInComposer, getScopedSubmitSelector } from '../../src/chatbots/chatgpt/ComposerSelectors';

/**
 * Minimal DOM fixture approximating ChatGPT's unified composer structure.
 * Default: fallback-only (no ProseMirror), to verify we do NOT select fallback anymore.
 */
function buildComposerFixture(): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div class="composer-parent">
      <form class="group/composer w-full" data-type="unified-composer">
        <div class="">
          <div class="grid" style="grid-template-areas:'header header header' 'leading primary trailing' ' . footer . '">
            <div class="-my-2.5 flex min-h-14 items-center overflow-x-hidden px-1.5" style="grid-area:primary">
              <div class="_prosemirror-parent_ebv8s_2 text-token-text-primary">
                <textarea class="_fallbackTextarea_ebv8s_2" name="prompt-textarea" placeholder="Ask anything"></textarea>
              </div>
            </div>
            <div class="flex items-center gap-2" style="grid-area:trailing">
              <div class="ms-auto flex items-center gap-1.5">
                <button aria-label="Start voice mode" class="composer-secondary-button-color" type="button"></button>
                <button type="submit" aria-label="Send message" class="composer-secondary-button-color"></button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  `;
  return wrapper;
}

function buildComposerWithProseMirrorFixture(): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div class="composer-parent">
      <form class="group/composer w-full" data-type="unified-composer">
        <div class="">
          <div class="grid" style="grid-template-areas:'header header header' 'leading primary trailing' ' . footer . '">
            <div class="-my-2.5 flex min-h-14 items-center overflow-x-hidden px-1.5" style="grid-area:primary">
              <div class="_prosemirror-parent_ebv8s_2 text-token-text-primary">
                <textarea class="_fallbackTextarea_ebv8s_2" name="prompt-textarea" placeholder="Ask anything"></textarea>
                <div id="prompt-textarea" class="ProseMirror" contenteditable="true"></div>
              </div>
            </div>
            <div class="flex items-center gap-2" style="grid-area:trailing">
              <div class="ms-auto flex items-center gap-1.5">
                <button aria-label="Start voice mode" class="composer-secondary-button-color" type="button"></button>
                <button type="submit" aria-label="Send message" class="composer-secondary-button-color"></button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  `;
  return wrapper;
}

describe('ChatGPTChatbot unified composer detection', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('does not select the fallback textarea and waits for ProseMirror', () => {
    const root = buildComposerFixture();
    document.body.appendChild(root);
    const input = findPromptInputInComposer(root);
    expect(input).toBeNull();
  });

  it('selects the ProseMirror editor when present', () => {
    const root = buildComposerWithProseMirrorFixture();
    document.body.appendChild(root);
    const input = findPromptInputInComposer(root);
    expect(input).toBeTruthy();
    expect((input as HTMLElement).classList.contains('ProseMirror')).toBe(true);
  });

  it('resolves trailing controls container inside composer', () => {
    const root = buildComposerFixture();
    document.body.appendChild(root);
    const container = findControlsContainerInComposer(root);
    expect(container).toBeTruthy();
    // Should be the ms-auto group
    expect(container.classList.contains('ms-auto')).toBe(true);
  });

  it('submit button selector is scoped and matches the send button only', () => {
    const root = buildComposerFixture();
    document.body.appendChild(root);
    const sel = getScopedSubmitSelector();
    const matches = root.querySelectorAll(sel);
    // One match: the type=submit button, not the voice button
    expect(matches.length).toBe(1);
    const btn = matches[0] as HTMLButtonElement;
    expect(btn.getAttribute('type')).toBe('submit');
  });
});
