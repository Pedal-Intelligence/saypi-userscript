import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// Mock TTSControlsModule early to avoid the SpeechSynthesisModule/config chain
// when we import the real ChatGPTResponse module (mirrors ChatGPTAutoReadAloud.spec).
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

// Avoid the VoiceMenu -> Pi circular import pulled in via MessageElements.
vi.mock('../../src/chatbots/Pi', () => ({
  PiAIChatbot: class {},
  PiTextStream: class {},
}));

// Keep ElementTextStream's constructor (getLanguage) off the network.
vi.mock('../../src/prefs/PreferenceModule', () => ({
  UserPreferenceModule: {
    getInstance: () => ({
      getLanguage: () => Promise.resolve('en-US'),
      reloadCache: () => undefined,
      getStoredValue: (_key: string, defaultValue: unknown) => Promise.resolve(defaultValue),
    }),
  },
}));

// Import the real classes lazily so the mocks above take effect first.
async function importChatGPTStream() {
  const responseModule = await import('../../src/chatbots/chatgpt/ChatGPTResponse');
  const inputModule = await import('../../src/tts/InputStream');
  return {
    ChatGPTTextBlockCapture: (responseModule as any).ChatGPTTextBlockCapture,
    AddedText: (inputModule as any).AddedText,
  };
}

// A streaming ChatGPT assistant turn: the .markdown content node fills with
// tokens *before* the post-turn action bar appears (live DOM per #362/#384).
function buildStreamingAssistantTurn() {
  const list = document.createElement('div');
  list.className = 'present-messages';
  const turn = document.createElement('section');
  turn.setAttribute('data-turn', 'assistant');
  turn.setAttribute('data-testid', 'conversation-turn-2');
  const content = document.createElement('div');
  content.className = 'markdown';
  turn.appendChild(content);
  list.appendChild(turn);
  document.body.appendChild(list);
  return { turn, content };
}

// The signal block-capture waits for: ChatGPT's post-completion action bar.
function appendActionBar(turn: HTMLElement) {
  const bar = document.createElement('div');
  const copy = document.createElement('button');
  copy.setAttribute('data-testid', 'copy-turn-action-button');
  bar.appendChild(copy);
  turn.appendChild(bar);
}

const flushMutations = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('ChatGPT piWriting window (#399)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('signals writing-started on the first streamed content, before the response completes', async () => {
    const { ChatGPTTextBlockCapture } = await importChatGPTStream();
    const { turn, content } = buildStreamingAssistantTurn();

    // Construct while still streaming (no action bar yet) -> block-capture
    // registers its action-bar observer and otherwise stays quiet.
    const stream = new ChatGPTTextBlockCapture(content, { includeInitialText: false });

    const chunks: string[] = [];
    let completed = false;
    const subscription = stream.getStream().subscribe({
      next: (value: any) => chunks.push(value.text),
      complete: () => {
        completed = true;
      },
    });

    // ChatGPT streams tokens into the .markdown node over several seconds,
    // long before the action bar appears.
    content.textContent = 'Not a whole lot on my end —';
    await flushMutations();

    // The conversation machine derives saypi:piWriting from the stream's first
    // chunk (ChatHistory.observeChatMessageElement). It must learn the assistant
    // started writing NOW so it leaves piThinking and isn't bailed out by the
    // 15s piThinking timeout on long replies. Before the fix, block-capture
    // emits nothing until the action bar, so no chunk has arrived here yet.
    expect(chunks.length).toBeGreaterThanOrEqual(1);
    expect(completed).toBe(false);

    // Streaming finishes and the action bar appears -> block-capture emits the
    // authoritative full text and completes (saypi:piStoppedWriting).
    content.textContent = 'Not a whole lot on my end — just here and ready to help.';
    appendActionBar(turn);
    await flushMutations();

    expect(completed).toBe(true);

    // Billing/TTS integrity: the captured transcript is the full final text,
    // uncorrupted by the writing-started marker (the marker contributes nothing).
    expect(chunks.join('')).toBe(
      'Not a whole lot on my end — just here and ready to help.'
    );

    subscription.unsubscribe();
  });

  it('keeps the collapsed window for an already-complete turn (no false writing window)', async () => {
    const { ChatGPTTextBlockCapture } = await importChatGPTStream();
    const { turn, content } = buildStreamingAssistantTurn();

    // A turn that is already finished at decoration time (history / pre-rendered):
    // text present AND action bar present. The window *should* collapse here —
    // nothing is being written live.
    content.textContent = 'Already finished reply.';
    appendActionBar(turn);

    const stream = new ChatGPTTextBlockCapture(content, { includeInitialText: false });

    const chunks: string[] = [];
    let completed = false;
    const subscription = stream.getStream().subscribe({
      next: (value: any) => chunks.push(value.text),
      complete: () => {
        completed = true;
      },
    });
    await flushMutations();

    expect(completed).toBe(true);
    expect(chunks.join('')).toBe('Already finished reply.');

    subscription.unsubscribe();
  });
});

describe('ChatGPT Text Block Capture Logic', () => {
  beforeEach(() => {
    // Clear the DOM before each test
    document.body.innerHTML = '';
    
    // Mock console methods
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('DOM element fallback strategies', () => {
    it('should prefer original element when connected and has content', () => {
      // Setup: create connected elements with content
      const turnContainer = document.createElement('article');
      turnContainer.setAttribute('data-turn', 'assistant');
      turnContainer.textContent = 'Turn container content';
      
      const contentElement = document.createElement('div');
      contentElement.classList.add('prose');
      contentElement.textContent = 'Original element content';
      turnContainer.appendChild(contentElement);
      document.body.appendChild(turnContainer);

      // Test the fallback logic
      let text = "";
      
      // Strategy 1: Try original element first
      if (contentElement.isConnected && document.contains(contentElement)) {
        text = (contentElement.textContent || "").trimEnd();
      }
      
      // Strategy 2: Try turnContainer if original element failed
      if (!text && turnContainer && document.contains(turnContainer)) {
        text = (turnContainer.textContent || "").trimEnd();
      }

      expect(text).toBe('Original element content');
    });

    it('should fallback to turnContainer when original element has no content', () => {
      // Setup: original element empty, turnContainer has content
      const turnContainer = document.createElement('article');
      turnContainer.setAttribute('data-turn', 'assistant');
      turnContainer.textContent = 'Turn container content';
      
      const contentElement = document.createElement('div');
      contentElement.classList.add('prose');
      // contentElement intentionally empty
      turnContainer.appendChild(contentElement);
      document.body.appendChild(turnContainer);

      // Test the fallback logic
      let text = "";
      
      // Strategy 1: Try original element first
      if (contentElement.isConnected && document.contains(contentElement)) {
        text = (contentElement.textContent || "").trimEnd();
      }
      
      // Strategy 2: Try turnContainer if original element failed
      if (!text && turnContainer && document.contains(turnContainer)) {
        text = (turnContainer.textContent || "").trimEnd();
      }

      expect(text).toBe('Turn container content');
    });

    it('should search for replacement by data-testid when both original and turnContainer are empty', () => {
      // Setup: empty original and turn container
      const turnContainer = document.createElement('article');
      turnContainer.setAttribute('data-turn', 'assistant');
      turnContainer.setAttribute('data-testid', 'conversation-turn-42');
      // turnContainer intentionally empty
      
      const contentElement = document.createElement('div');
      contentElement.classList.add('prose');
      // contentElement intentionally empty
      turnContainer.appendChild(contentElement);
      document.body.appendChild(turnContainer);

      // Create replacement element with same data-testid but different from turnContainer
      const replacement = document.createElement('article');
      replacement.setAttribute('data-testid', 'conversation-turn-42');
      replacement.textContent = 'Replacement content';
      replacement.setAttribute('data-replacement', 'true'); // Make it clearly different
      document.body.appendChild(replacement);

      // Test the fallback logic
      let text = "";
      
      // Strategy 1: Try original element first
      if (contentElement.isConnected && document.contains(contentElement)) {
        text = (contentElement.textContent || "").trimEnd();
      }
      
      // Strategy 2: Try turnContainer if original element failed
      if (!text && turnContainer && document.contains(turnContainer)) {
        text = (turnContainer.textContent || "").trimEnd();
      }
      
      // Strategy 3: Search for replacement element by data attributes
      if (!text && turnContainer) {
        const testId = turnContainer.getAttribute('data-testid');
        const turnAttr = turnContainer.getAttribute('data-turn');
        
        let replacementEl = null;
        
        // Try to find by exact data-testid first
        if (testId) {
          const candidates = document.querySelectorAll(`[data-testid="${testId}"]`);
          // Find the first candidate that's not the turnContainer itself
          for (const candidate of candidates) {
            if (candidate !== turnContainer && candidate.textContent?.trim()) {
              replacementEl = candidate;
              break;
            }
          }
        }
        
        // Fallback to data-turn attribute
        if (!replacementEl && turnAttr) {
          const candidates = document.querySelectorAll(`article[data-turn="${turnAttr}"]`);
          // Find the first candidate that's not the turnContainer itself  
          for (const candidate of candidates) {
            if (candidate !== turnContainer && candidate.textContent?.trim()) {
              replacementEl = candidate;
              break;
            }
          }
        }
        
        if (replacementEl && replacementEl !== turnContainer) {
          text = (replacementEl.textContent || "").trimEnd();
        }
      }

      expect(text).toBe('Replacement content');
    });
  });

  describe('duplicate processing prevention', () => {
    it('should detect when text has already been captured', () => {
      const turnContainer = document.createElement('article');
      turnContainer.setAttribute('data-turn', 'assistant');
      turnContainer.setAttribute('data-saypi-text-captured', 'true');
      turnContainer.textContent = 'Test content';
      document.body.appendChild(turnContainer);

      // Test the duplicate processing check
      const alreadyCaptured = turnContainer.getAttribute('data-saypi-text-captured') === 'true';
      
      expect(alreadyCaptured).toBe(true);
    });

    it('should mark turn container after text capture', () => {
      const turnContainer = document.createElement('article');
      turnContainer.setAttribute('data-turn', 'assistant');
      turnContainer.textContent = 'Test content';
      document.body.appendChild(turnContainer);

      // Simulate the marking logic
      turnContainer.setAttribute('data-saypi-text-captured', 'true');

      expect(turnContainer.getAttribute('data-saypi-text-captured')).toBe('true');
    });
  });

  describe('edge cases', () => {
    it('should handle disconnected elements gracefully', () => {
      // Create element not attached to DOM
      const contentElement = document.createElement('div');
      contentElement.textContent = 'Test content';
      
      // Test that isConnected and document.contains work as expected
      expect(contentElement.isConnected).toBe(false);
      expect(document.contains(contentElement)).toBe(false);
    });

    it('should handle missing attributes gracefully', () => {
      const turnContainer = document.createElement('article');
      // No data-testid or data-turn attributes set
      
      const testId = turnContainer.getAttribute('data-testid');
      const turnAttr = turnContainer.getAttribute('data-turn');
      
      expect(testId).toBeNull();
      expect(turnAttr).toBeNull();
    });

    it('should handle empty text content gracefully', () => {
      const element = document.createElement('div');
      // No text content set
      
      const text = (element.textContent || "").trimEnd();
      
      expect(text).toBe("");
    });
  });

  describe('findTurnContainer logic', () => {
    it('should find turn container by data-turn attribute', () => {
      const turnContainer = document.createElement('article');
      turnContainer.setAttribute('data-turn', 'assistant');
      
      const contentElement = document.createElement('div');
      contentElement.classList.add('prose');
      turnContainer.appendChild(contentElement);
      document.body.appendChild(turnContainer);

      // Test findTurnContainer logic
      const found = (
        contentElement.closest('article[data-turn="assistant"]') as HTMLElement | null ||
        contentElement.closest('[data-message-author-role="assistant"]') as HTMLElement | null ||
        contentElement.closest('.assistant-message') as HTMLElement | null ||
        contentElement.parentElement
      );

      expect(found).toBe(turnContainer);
    });

    it('should find turn container by message author role', () => {
      const turnContainer = document.createElement('div');
      turnContainer.setAttribute('data-message-author-role', 'assistant');
      
      const contentElement = document.createElement('div');
      contentElement.classList.add('prose');
      turnContainer.appendChild(contentElement);
      document.body.appendChild(turnContainer);

      // Test findTurnContainer logic
      const found = (
        contentElement.closest('article[data-turn="assistant"]') as HTMLElement | null ||
        contentElement.closest('[data-message-author-role="assistant"]') as HTMLElement | null ||
        contentElement.closest('.assistant-message') as HTMLElement | null ||
        contentElement.parentElement
      );

      expect(found).toBe(turnContainer);
    });

    it('should fallback to parent element when no specific container found', () => {
      const parentElement = document.createElement('div');
      const contentElement = document.createElement('div');
      contentElement.classList.add('prose');
      parentElement.appendChild(contentElement);
      document.body.appendChild(parentElement);

      // Test findTurnContainer logic
      const found = (
        contentElement.closest('article[data-turn="assistant"]') as HTMLElement | null ||
        contentElement.closest('[data-message-author-role="assistant"]') as HTMLElement | null ||
        contentElement.closest('.assistant-message') as HTMLElement | null ||
        contentElement.parentElement
      );

      expect(found).toBe(parentElement);
    });
  });
});