import { describe, it, expect, vi, beforeEach } from 'vitest';
// Mock TTSControlsModule early to avoid SpeechSynthesisModule/config dependency
vi.mock('../../src/tts/TTSControlsModule', () => ({
  TTSControlsModule: {
    getInstance: () => ({
      // Minimal surface used by MessageControls/AssistantResponse in these tests
      createGenerateSpeechButton: () => document.createElement('button'),
      createCopyButton: () => document.createElement('button'),
      addCostBasis: () => undefined,
      updateCostBasis: () => undefined,
    }),
  },
}));

// Provide a global StateMachineService so ChatGPT.ts can detect active call
const setCallActive = () => {
  (globalThis as any).StateMachineService = {
    conversationActor: {
      getSnapshot: () => ({
        matches: (s: string) => s === 'listening' || String(s).startsWith('responding')
      })
    }
  };
};

// Mock UserPreferenceModule to enable auto read aloud
vi.mock('../../src/prefs/PreferenceModule', async (orig) => {
  const actual = await vi.importActual<any>('../../src/prefs/PreferenceModule');
  return {
    ...actual,
    UserPreferenceModule: {
      getInstance: () => ({
        getCachedAutoReadAloudChatGPT: () => true,
      })
    }
  };
});

// Avoid circular import by mocking Pi module used by MessageElements
vi.mock('../../src/chatbots/Pi', () => ({
  PiAIChatbot: class {}
}));

// Import after mocks so they take effect
import ChatGPTChatbot from '../../src/chatbots/ChatGPT';


describe('ChatGPT auto Read Aloud', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    setCallActive();
  });

  it('clicks native Read Aloud for newest assistant turn when enabled and in call', async () => {
    const list = document.createElement('div');
    list.className = 'present-messages';
    document.body.appendChild(list);

    const msg = document.createElement('article');
    msg.setAttribute('data-turn', 'assistant');
    const content = document.createElement('div');
    content.className = 'markdown';
    msg.appendChild(content);
    list.appendChild(msg);

    // Use chatbot API to create and decorate the assistant response, which
    // will internally attach ChatGPT's message controls and observers
    const chatbot = new ChatGPTChatbot();
    chatbot.getAssistantResponse(msg as HTMLElement, true);

    // Append native button after observers are attached
    const actionBar = document.createElement('div');
    msg.appendChild(actionBar);
    const btn = document.createElement('button');
    btn.setAttribute('data-testid', 'voice-play-turn-action-button');
    const clickSpy = vi.spyOn(btn, 'click');
    actionBar.appendChild(btn);

    // Allow mutation observer microtask to run
    await new Promise((r) => setTimeout(r, 10));

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('does not click for older assistant turns; only newest gets auto-click', async () => {
    const list = document.createElement('div');
    list.className = 'present-messages';
    document.body.appendChild(list);

    // First assistant message (older)
    const oldMsg = document.createElement('article');
    oldMsg.setAttribute('data-turn', 'assistant');
    const oldContent = document.createElement('div');
    oldContent.className = 'markdown';
    oldMsg.appendChild(oldContent);
    list.appendChild(oldMsg);

    // Decorate old message
    const chatbot = new ChatGPTChatbot();
    chatbot.getAssistantResponse(oldMsg as HTMLElement, true);

    // Append native button to old message AFTER decoration
    const oldActionBar = document.createElement('div');
    oldMsg.appendChild(oldActionBar);
    const oldBtn = document.createElement('button');
    oldBtn.setAttribute('data-testid', 'voice-play-turn-action-button');
    const oldClickSpy = vi.spyOn(oldBtn, 'click');
    oldActionBar.appendChild(oldBtn);

    // Now append a newer assistant message (newest)
    const newMsg = document.createElement('article');
    newMsg.setAttribute('data-turn', 'assistant');
    const newContent = document.createElement('div');
    newContent.className = 'markdown';
    newMsg.appendChild(newContent);
    list.appendChild(newMsg);

    // Decorate new message
    chatbot.getAssistantResponse(newMsg as HTMLElement, true);

    // Append native button to new message AFTER decoration
    const newActionBar = document.createElement('div');
    newMsg.appendChild(newActionBar);
    const newBtn = document.createElement('button');
    newBtn.setAttribute('data-testid', 'voice-play-turn-action-button');
    const newClickSpy = vi.spyOn(newBtn, 'click');
    newActionBar.appendChild(newBtn);

    // Allow mutation observers to react
    await new Promise((r) => setTimeout(r, 10));

    // Expect only the newest message to be auto-clicked
    expect(oldClickSpy).toHaveBeenCalledTimes(0);
    expect(newClickSpy).toHaveBeenCalledTimes(1);
  });

  it('clicks when only a Replay-labeled button exists (no data-testid)', async () => {
    const list = document.createElement('div');
    list.className = 'present-messages';
    document.body.appendChild(list);

    const msg = document.createElement('article');
    msg.setAttribute('data-turn', 'assistant');
    const content = document.createElement('div');
    content.className = 'markdown';
    msg.appendChild(content);
    list.appendChild(msg);

    const chatbot = new ChatGPTChatbot();
    chatbot.getAssistantResponse(msg as HTMLElement, true);

    const actionBar = document.createElement('div');
    msg.appendChild(actionBar);
    const btn = document.createElement('button');
    // Simulate Replay variant after exiting voice mode
    btn.setAttribute('aria-label', 'Replay');
    const clickSpy = vi.spyOn(btn, 'click');
    actionBar.appendChild(btn);

    await new Promise((r) => setTimeout(r, 10));

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('opens the ellipsis menu and clicks Read Aloud (non‑English UI)', async () => {
    const list = document.createElement('div');
    list.className = 'present-messages';
    document.body.appendChild(list);

    const msg = document.createElement('article');
    msg.setAttribute('data-turn', 'assistant');
    const content = document.createElement('div');
    content.className = 'markdown';
    msg.appendChild(content);
    list.appendChild(msg);

    const chatbot = new ChatGPTChatbot();
    chatbot.getAssistantResponse(msg as HTMLElement, true);

    // Action bar with only an ellipsis trigger (menu), labeled in French
    const actionBar = document.createElement('div');
    msg.appendChild(actionBar);
    const ellipsis = document.createElement('button');
    ellipsis.setAttribute('type', 'button');
    ellipsis.setAttribute('aria-haspopup', 'menu');
    ellipsis.setAttribute('aria-expanded', 'false');
    ellipsis.setAttribute('data-state', 'closed');
    ellipsis.setAttribute('aria-label', 'Plus d’actions');
    actionBar.appendChild(ellipsis);

    // When the trigger is clicked, simulate Radix menu portal with the item
    const menu = document.createElement('div');
    menu.setAttribute('role', 'menu');
    const menuItem = document.createElement('button');
    menuItem.setAttribute('data-testid', 'voice-play-turn-action-button');
    // Also provide a non-English label to ensure we are not relying on English
    menuItem.setAttribute('aria-label', 'Lire à voix haute');
    const itemClickSpy = vi.spyOn(menuItem, 'click');
    menu.appendChild(menuItem);

    vi.spyOn(ellipsis, 'click').mockImplementation(() => {
      ellipsis.setAttribute('aria-expanded', 'true');
      ellipsis.setAttribute('data-state', 'open');
      // Portal-style: append to body, not within the message
      if (!menu.parentElement) document.body.appendChild(menu);
    });

    // Allow the auto-click fallback to run (scheduled ~250ms)
    await new Promise((r) => setTimeout(r, 600));

    // Implementation may retry on heuristic failure; ensure at least one click
    expect(itemClickSpy.mock.calls.length).toBeGreaterThanOrEqual(1);
    expect(itemClickSpy.mock.calls.length).toBeLessThanOrEqual(3);
    // The read-aloud item should receive focus before/after click
    expect(document.activeElement === menuItem).toBe(true);
  });

  it('ignores contextual retry / switch model trigger when opening overflow menu', async () => {
    const list = document.createElement('div');
    list.className = 'present-messages';
    document.body.appendChild(list);

    const msg = document.createElement('article');
    msg.setAttribute('data-turn', 'assistant');
    const content = document.createElement('div');
    content.className = 'markdown';
    msg.appendChild(content);
    list.appendChild(msg);

    const chatbot = new ChatGPTChatbot();
    chatbot.getAssistantResponse(msg as HTMLElement, true);

    const actionBar = document.createElement('div');
    msg.appendChild(actionBar);

    const switchModel = document.createElement('button');
    switchModel.setAttribute('type', 'button');
    switchModel.setAttribute('aria-haspopup', 'menu');
    switchModel.setAttribute('aria-expanded', 'false');
    switchModel.setAttribute('aria-label', 'Switch model');
    actionBar.appendChild(switchModel);
    const switchClickSpy = vi.spyOn(switchModel, 'click').mockImplementation(() => {
      switchModel.setAttribute('aria-expanded', 'true');
      switchModel.setAttribute('data-state', 'open');
    });

    const overflow = document.createElement('button');
    overflow.setAttribute('type', 'button');
    overflow.setAttribute('aria-haspopup', 'menu');
    overflow.setAttribute('aria-expanded', 'false');
    overflow.setAttribute('aria-label', 'More actions');
    actionBar.appendChild(overflow);

    const menu = document.createElement('div');
    menu.setAttribute('role', 'menu');
    menu.setAttribute('data-state', 'open');
    const readAloud = document.createElement('button');
    readAloud.setAttribute('data-testid', 'voice-play-turn-action-button');
    const readAloudClickSpy = vi.spyOn(readAloud, 'click');
    menu.appendChild(readAloud);

    const overflowClickSpy = vi.spyOn(overflow, 'click').mockImplementation(() => {
      overflow.setAttribute('aria-expanded', 'true');
      overflow.setAttribute('data-state', 'open');
      if (!menu.parentElement) {
        document.body.appendChild(menu);
      }
    });

    await new Promise((r) => setTimeout(r, 600));

    expect(readAloudClickSpy.mock.calls.length).toBeGreaterThanOrEqual(1);
    expect(overflowClickSpy.mock.calls.length).toBeGreaterThanOrEqual(1);
    expect(switchClickSpy).not.toHaveBeenCalled();
  });

  it.skip('cleans up/shuts down prior shielded menu when a newer message starts playback', async () => {
    const list = document.createElement('div');
    list.className = 'present-messages';
    document.body.appendChild(list);

    const chatbot = new ChatGPTChatbot();

    // Older assistant turn
    const oldMsg = document.createElement('article');
    oldMsg.setAttribute('data-turn', 'assistant');
    oldMsg.appendChild(Object.assign(document.createElement('div'), { className: 'markdown' }));
    list.appendChild(oldMsg);
    chatbot.getAssistantResponse(oldMsg as HTMLElement, true);

    const oldBar = document.createElement('div');
    oldMsg.appendChild(oldBar);
    const oldEllipsis = document.createElement('button');
    oldEllipsis.setAttribute('aria-haspopup', 'menu');
    oldEllipsis.setAttribute('aria-expanded', 'false');
    oldEllipsis.setAttribute('data-state', 'closed');
    oldBar.appendChild(oldEllipsis);

    // Portal-like menu for the old turn
    const oldMenu = document.createElement('div');
    oldMenu.setAttribute('role', 'menu');
    oldMenu.setAttribute('data-state', 'open');
    const oldItem = document.createElement('button');
    oldItem.setAttribute('data-testid', 'voice-play-turn-action-button');
    oldMenu.appendChild(oldItem);
    vi.spyOn(oldEllipsis, 'click').mockImplementation(() => {
      oldEllipsis.setAttribute('aria-expanded', 'true');
      oldEllipsis.setAttribute('data-state', 'open');
      if (!oldMenu.parentElement) document.body.appendChild(oldMenu);
    });

    // Give the observer time to open/click and apply shielding
    await new Promise((r) => setTimeout(r, 600));
    expect(document.body.contains(oldMenu)).toBe(true);
    // Should be shielded while playback is active
    expect(oldMenu.getAttribute('data-saypi-shielded')).toBe('true');

    // Newest assistant turn appears
    const newMsg = document.createElement('article');
    newMsg.setAttribute('data-turn', 'assistant');
    newMsg.appendChild(Object.assign(document.createElement('div'), { className: 'markdown' }));
    list.appendChild(newMsg);
    chatbot.getAssistantResponse(newMsg as HTMLElement, true);

    const newBar = document.createElement('div');
    newMsg.appendChild(newBar);
    const newEllipsis = document.createElement('button');
    newEllipsis.setAttribute('aria-haspopup', 'menu');
    newEllipsis.setAttribute('aria-expanded', 'false');
    newEllipsis.setAttribute('data-state', 'closed');
    newBar.appendChild(newEllipsis);

    // Portal-like menu for the new turn
    const newMenu = document.createElement('div');
    newMenu.setAttribute('role', 'menu');
    newMenu.setAttribute('data-state', 'open');
    const newItem = document.createElement('button');
    newItem.setAttribute('data-testid', 'voice-play-turn-action-button');
    newMenu.appendChild(newItem);
    vi.spyOn(newEllipsis, 'click').mockImplementation(() => {
      newEllipsis.setAttribute('aria-expanded', 'true');
      newEllipsis.setAttribute('data-state', 'open');
      if (!newMenu.parentElement) document.body.appendChild(newMenu);
    });

    // Allow second auto-activation to run and replace shield
    await new Promise((r) => setTimeout(r, 650));

    // Robust: exactly one shielded menu (or wrapper) remains, belonging to the new turn
    const shielded = Array.from(document.querySelectorAll('[data-saypi-shielded="true"]')) as HTMLElement[];
    expect(shielded.length).toBe(1);
    const onlyShielded = shielded[0];
    const attachedToNew = onlyShielded === newMenu || newMenu.contains(onlyShielded);
    expect(attachedToNew).toBe(true);
  });
});
