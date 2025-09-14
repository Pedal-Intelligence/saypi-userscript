import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DOMObserver } from '../../src/chatbots/bootstrap';
import { AgentModeNoticeModule } from '../../src/ui/AgentModeNoticeModule';

// Mock all dependencies
vi.mock('../../src/ButtonModule.js', () => ({
  buttonModule: {
    createCallButton: vi.fn(),
  },
}));

vi.mock('../../src/events/EventBus.js', () => ({
  default: {
    on: vi.fn(),
    emit: vi.fn(),
  },
}));

vi.mock('../../src/tts/ChatHistoryManager', () => ({
  ChatHistorySpeechManager: vi.fn(),
}));

vi.mock('../../src/prefs/PreferenceModule', () => ({
  UserPreferenceModule: {
    getInstance: () => ({
      getCachedDiscretionaryMode: vi.fn(() => true), // Agent mode active for integration test
    }),
  },
}));

vi.mock('../../src/themes/ThemeManagerModule', () => ({
  ThemeManager: vi.fn(),
}));

vi.mock('../../src/tts/VoiceMenuUIManager', () => ({
  VoiceMenuUIManager: vi.fn().mockImplementation(() => ({
    findAndDecorateVoiceMenu: vi.fn(),
  })),
}));

vi.mock('../../src/LoggingModule', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../../src/ui/AgentModeNoticeModule', () => ({
  AgentModeNoticeModule: {
    getInstance: vi.fn(() => ({
      showNoticeIfNeeded: vi.fn(),
    })),
  },
}));

vi.mock('../../src/i18n', () => ({
  default: vi.fn((key: string) => key),
}));

vi.mock('../../src/popup/popupopener', () => ({
  openSettings: vi.fn(),
}));

vi.mock('../../src/icons/IconModule', () => ({
  IconModule: {
    createIcon: vi.fn(() => document.createElement('div')),
  },
}));

// Mock chatbot
const mockChatbot = {
  getID: () => 'pi',
  getName: () => 'Pi',
  getPromptInput: vi.fn(),
  getPromptContainer: vi.fn((prompt: HTMLElement) => prompt.parentElement),
  getPromptControlsContainer: vi.fn((container: HTMLElement) => container),
  getPromptTextInputSelector: () => 'textarea',
  getPromptSubmitButtonSelector: () => 'button[type="submit"]',
  getChatHistory: vi.fn(),
  getChatHistorySelector: () => '.chat-history',
  getPastChatHistorySelector: () => '.past-messages',
  getRecentChatHistorySelector: () => '.recent-messages',
  getControlPanelSelector: () => '.control-panel',
  getAudioControls: vi.fn(),
  getAudioControlsSelector: () => '.audio-controls',
  getAudioOutputButtonSelector: () => '.audio-output',
  shouldDecorateUI: () => true,
  decorateAudioOutputButton: vi.fn(),
};

describe('AgentModeNotice Bootstrap Integration', () => {
  let domObserver: DOMObserver;
  let mockAgentNotice: any;

  beforeEach(() => {
    // Clear DOM
    document.body.innerHTML = '';
    
    // Clear mocks
    vi.clearAllMocks();
    
    // Get the mocked agent notice module
    mockAgentNotice = vi.mocked(AgentModeNoticeModule.getInstance());
    
    // Create DOM observer
    domObserver = new DOMObserver(mockChatbot as any);
  });

  it('should integrate AgentModeNoticeModule in constructor', () => {
    expect(AgentModeNoticeModule.getInstance).toHaveBeenCalled();
    expect(domObserver.agentNoticeModule).toBeDefined();
  });

  it('should trigger agent notice when decorating prompt', () => {
    // Set up DOM structure
    const promptContainer = document.createElement('div');
    promptContainer.className = 'prompt-container';
    
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'controls-container';
    promptContainer.appendChild(controlsContainer);
    
    const prompt = document.createElement('textarea');
    controlsContainer.appendChild(prompt);
    
    document.body.appendChild(promptContainer);
    
    // Mock the chatbot methods to return our elements
    mockChatbot.getPromptContainer.mockReturnValue(promptContainer);
    mockChatbot.getPromptControlsContainer.mockReturnValue(controlsContainer);
    
    // Call decoratePrompt
    domObserver.decoratePrompt(prompt);
    
    // Verify that agent notice was triggered
    expect(mockAgentNotice.showNoticeIfNeeded).toHaveBeenCalledWith(mockChatbot);
    
    // Verify other decorations happened
    expect(prompt.id).toBe('saypi-prompt');
    expect(promptContainer.classList.contains('saypi-prompt-container')).toBe(true);
    expect(controlsContainer.id).toBe('saypi-prompt-controls-container');
  });

  it('should not fail when prompt container is missing', () => {
    const prompt = document.createElement('textarea');
    document.body.appendChild(prompt);
    
    // Mock to return null
    mockChatbot.getPromptContainer.mockReturnValue(null);
    
    expect(() => {
      domObserver.decoratePrompt(prompt);
    }).not.toThrow();
    
    // Should still trigger agent notice
    expect(mockAgentNotice.showNoticeIfNeeded).toHaveBeenCalledWith(mockChatbot);
  });

  it('should handle ChatGPT-specific cleanup correctly', () => {
    // Create a mock ChatGPT chatbot
    const chatgptChatbot = {
      ...mockChatbot,
      getID: () => 'chatgpt',
      getName: () => 'ChatGPT',
    };
    
    const chatgptObserver = new DOMObserver(chatgptChatbot as any);
    
    const promptContainer = document.createElement('div');
    promptContainer.id = 'saypi-control-panel-main';
    promptContainer.className = 'saypi-control-panel';
    
    const controlsContainer = document.createElement('div');
    promptContainer.appendChild(controlsContainer);
    
    const prompt = document.createElement('textarea');
    controlsContainer.appendChild(prompt);
    
    document.body.appendChild(promptContainer);
    
    // Mock the chatbot methods
    chatgptChatbot.getPromptContainer = vi.fn().mockReturnValue(promptContainer);
    chatgptChatbot.getPromptControlsContainer = vi.fn().mockReturnValue(controlsContainer);
    
    chatgptObserver.decoratePrompt(prompt);
    
    // Verify ChatGPT cleanup happened
    expect(promptContainer.id).toBe(''); // Should be cleared
    expect(promptContainer.classList.contains('saypi-control-panel')).toBe(false);
    
    // Should still add standard classes and trigger notice
    expect(promptContainer.classList.contains('saypi-prompt-container')).toBe(true);
    expect(mockAgentNotice.showNoticeIfNeeded).toHaveBeenCalled();
  });
});