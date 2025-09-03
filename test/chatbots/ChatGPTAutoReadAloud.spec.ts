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

  it('clicks read aloud button immediately when it exists during route change scenario', async () => {
    // Mock DOMObserver to simulate recent route change
    (globalThis as any).DOMObserver = {
      isRecentRouteChange: () => true
    };

    const list = document.createElement('div');
    list.className = 'present-messages';
    document.body.appendChild(list);

    const msg = document.createElement('article');
    msg.setAttribute('data-turn', 'assistant');
    const content = document.createElement('div');
    content.className = 'markdown';
    msg.appendChild(content);
    list.appendChild(msg);

    // Create read aloud button BEFORE decoration (simulating route change timing)
    const actionBar = document.createElement('div');
    msg.appendChild(actionBar);
    const btn = document.createElement('button');
    btn.setAttribute('data-testid', 'voice-play-turn-action-button');
    const clickSpy = vi.spyOn(btn, 'click');
    actionBar.appendChild(btn);

    // Now decorate the assistant response (this is when observers would be set up)
    const chatbot = new ChatGPTChatbot();
    chatbot.getAssistantResponse(msg as HTMLElement, true);

    // Allow any async operations to complete
    await new Promise((r) => setTimeout(r, 10));

    // Should click immediately since button exists and we're in route change scenario
    expect(clickSpy).toHaveBeenCalledTimes(1);

    // Cleanup
    (globalThis as any).DOMObserver = undefined;
  });

  it('does not click existing read aloud button when NOT in route change scenario', async () => {
    // Mock DOMObserver to simulate NO recent route change
    (globalThis as any).DOMObserver = {
      isRecentRouteChange: () => false
    };

    const list = document.createElement('div');
    list.className = 'present-messages';
    document.body.appendChild(list);

    const msg = document.createElement('article');
    msg.setAttribute('data-turn', 'assistant');
    const content = document.createElement('div');
    content.className = 'markdown';
    msg.appendChild(content);
    list.appendChild(msg);

    // Create read aloud button BEFORE decoration (simulating existing button)
    const actionBar = document.createElement('div');
    msg.appendChild(actionBar);
    const btn = document.createElement('button');
    btn.setAttribute('data-testid', 'voice-play-turn-action-button');
    const clickSpy = vi.spyOn(btn, 'click');
    actionBar.appendChild(btn);

    // Now decorate the assistant response
    const chatbot = new ChatGPTChatbot();
    chatbot.getAssistantResponse(msg as HTMLElement, true);

    // Allow any async operations to complete
    await new Promise((r) => setTimeout(r, 10));

    // Should NOT click since button exists and we're NOT in route change scenario
    expect(clickSpy).toHaveBeenCalledTimes(0);

    // Cleanup
    (globalThis as any).DOMObserver = undefined;
  });
});
