import { describe, it, expect, vi, beforeEach } from 'vitest';
// Mirror the mocks used by ChatGPTAutoReadAloud.spec.ts so the chatbot/message
// controls can be constructed in isolation.
vi.mock('../../src/tts/TTSControlsModule', () => ({
  TTSControlsModule: {
    getInstance: () => ({
      createGenerateSpeechButton: () => document.createElement('button'),
      createCopyButton: () => document.createElement('button'),
      addCostBasis: () => undefined,
      updateCostBasis: () => undefined,
    }),
  },
}));

const setCallActive = () => {
  (globalThis as any).StateMachineService = {
    conversationActor: {
      getSnapshot: () => ({
        matches: (s: string) => s === 'listening' || String(s).startsWith('responding'),
      }),
    },
  };
};

vi.mock('../../src/prefs/PreferenceModule', async (orig) => {
  const actual = await vi.importActual<any>('../../src/prefs/PreferenceModule');
  return {
    ...actual,
    UserPreferenceModule: {
      getInstance: () => ({ getCachedAutoReadAloudChatGPT: () => true }),
    },
  };
});

vi.mock('../../src/chatbots/Pi', () => ({ PiAIChatbot: class {} }));

import ChatGPTChatbot from '../../src/chatbots/ChatGPT';

/**
 * Faithful reproduction of the live chatgpt.com DOM (verified 2026-06-21):
 *  - The assistant turn is a <section data-turn="assistant"> (already handled by #384).
 *  - The action bar holds copy / share / "Switch model" / "More actions" buttons.
 *  - There is NO direct read-aloud button — read-aloud lives ONLY in the overflow menu.
 *  - The "Read aloud" menu item is a <div role="menuitem"
 *    data-testid="voice-play-turn-action-button"> (NOT a <button>, and with NO
 *    aria-label). It is portaled to <body> inside a Radix menu and only exists in the
 *    DOM while the menu is open.
 */
describe('ChatGPT auto Read Aloud — live overflow-menu DOM (div role=menuitem)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    setCallActive();
  });

  function buildAssistantSection() {
    const list = document.createElement('div');
    list.className = 'chat-history present-messages';
    document.body.appendChild(list);

    const section = document.createElement('section');
    section.setAttribute('data-turn', 'assistant');
    section.setAttribute('data-testid', 'conversation-turn-2');
    section.setAttribute('data-turn-id', 'bb42e1c9-6b0d-4677-8a48-60e756717a5a');
    const content = document.createElement('div');
    content.className = 'markdown';
    content.textContent = 'Good morning, Ross.';
    section.appendChild(content);
    list.appendChild(section);
    return { list, section };
  }

  function buildActionBar(section: HTMLElement) {
    // Single flex row whose direct children are all the action buttons (matches live).
    const bar = document.createElement('div');

    const copy = document.createElement('button');
    copy.setAttribute('data-testid', 'copy-turn-action-button');
    copy.setAttribute('aria-label', 'Copy response');
    bar.appendChild(copy);

    const share = document.createElement('button');
    share.setAttribute('aria-label', 'Share');
    bar.appendChild(share);

    const switchModel = document.createElement('button');
    switchModel.setAttribute('aria-haspopup', 'menu');
    switchModel.setAttribute('aria-expanded', 'false');
    switchModel.setAttribute('aria-label', 'Switch model');
    bar.appendChild(switchModel);

    const more = document.createElement('button');
    more.setAttribute('aria-haspopup', 'menu');
    more.setAttribute('aria-expanded', 'false');
    more.setAttribute('data-state', 'closed');
    more.setAttribute('aria-label', 'More actions');
    bar.appendChild(more);

    section.appendChild(bar);

    // Radix-style portaled menu, rendered to <body> when the trigger opens.
    const menu = document.createElement('div');
    menu.setAttribute('role', 'menu');
    menu.setAttribute('data-radix-menu-content', '');
    menu.setAttribute('data-state', 'open');

    const mkItem = (text: string, testid?: string) => {
      const el = document.createElement('div');
      el.setAttribute('role', 'menuitem');
      // Radix menu items are programmatically focusable via tabindex="-1" (verified live).
      el.setAttribute('tabindex', '-1');
      if (testid) el.setAttribute('data-testid', testid);
      el.textContent = text;
      return el;
    };
    menu.appendChild(mkItem('View sources'));
    menu.appendChild(mkItem('Branch in new chat'));
    const readAloud = mkItem('Read aloud', 'voice-play-turn-action-button');
    menu.appendChild(readAloud);

    const readAloudClickSpy = vi.spyOn(readAloud, 'click');
    vi.spyOn(more, 'click').mockImplementation(() => {
      more.setAttribute('aria-expanded', 'true');
      more.setAttribute('data-state', 'open');
      if (!menu.parentElement) document.body.appendChild(menu);
    });

    return { more, switchModel, readAloud, readAloudClickSpy };
  }

  it('opens the overflow menu and clicks the Read aloud <div role=menuitem>', async () => {
    const { section } = buildAssistantSection();

    const chatbot = new ChatGPTChatbot();
    chatbot.getAssistantResponse(section as HTMLElement, true, true); // streaming

    // Action bar + portaled menu appear after observers attach (streaming completes).
    const { readAloud, readAloudClickSpy, switchModel } = buildActionBar(section);
    const switchClickSpy = vi.spyOn(switchModel, 'click');

    await new Promise((r) => setTimeout(r, 700));

    expect(readAloudClickSpy.mock.calls.length).toBeGreaterThanOrEqual(1);
    // The div menu item is focused before activation (mirrors the live focusable item).
    expect(document.activeElement === readAloud).toBe(true);
    // The activated turn is recorded so it is not clicked again.
    expect(section.getAttribute('data-saypi-read-aloud-clicked')).toBe('true');
    // Must not have activated the contextual "Switch model" menu.
    expect(switchClickSpy).not.toHaveBeenCalled();
  });

  it('does not expose a direct read-aloud button on the turn (control lives only in the overflow menu)', () => {
    const { section } = buildAssistantSection();
    buildActionBar(section);
    // The live action bar has copy/share/switch/more — but NO direct read-aloud
    // control; the only voice-play element is the portaled <div role="menuitem">.
    expect(
      section.querySelector('button[data-testid="voice-play-turn-action-button"]')
    ).toBeNull();
    expect(
      section.querySelector('[data-testid="copy-turn-action-button"]')
    ).not.toBeNull();
  });
});
