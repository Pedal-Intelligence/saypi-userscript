import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AgentModeNoticeModule } from '../../src/ui/AgentModeNoticeModule';
import * as PreferenceModule from '../../src/prefs/PreferenceModule';

// Mock dependencies
const mockGetCachedDiscretionaryMode = vi.fn(() => false);
vi.mock('../../src/prefs/PreferenceModule', () => ({
  UserPreferenceModule: {
    getInstance: () => ({
      getCachedDiscretionaryMode: mockGetCachedDiscretionaryMode,
    }),
  },
}));

vi.mock('../../src/events/EventBus', () => ({
  default: {
    on: vi.fn(),
    emit: vi.fn(),
  },
}));

vi.mock('../../src/i18n', () => ({
  default: vi.fn((key: string, params?: string[]) => {
    const messages: Record<string, string> = {
      'agentModeNoticeMessage': '$chatbot$ is listening in {agentModeLink}, and will respond only when needed. You can change this behaviour in {settingsLink}.',
      'agentMode': 'agent mode',
      'settings': 'settings',
      'dismissNotice': 'Dismiss',
    };
    let message = messages[key] || key;
    if (params && params.length > 0) {
      message = message.replace('$1', params[0]);
    }
    return message;
  }),
}));

vi.mock('../../src/popup/popupopener', () => ({
  openSettings: vi.fn(),
}));

vi.mock('../../src/icons/IconModule', () => ({
  IconModule: {
    bot: {
      cloneNode: vi.fn(() => {
        const icon = document.createElement('div');
        icon.className = 'mock-icon';
        return icon;
      }),
    },
  },
}));

vi.mock('../../src/chatbots/ChatbotService', () => ({
  ChatbotService: {
    getChatbot: vi.fn().mockResolvedValue({
      getID: () => 'pi',
      getName: () => 'Pi',
      getNickname: vi.fn().mockResolvedValue('Pi'),
    }),
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();
Object.defineProperty(window, 'localStorage', { 
  value: localStorageMock, 
  writable: true,
  configurable: true
});
Object.defineProperty(global, 'localStorage', { 
  value: localStorageMock, 
  writable: true,
  configurable: true
});

// Mock window.location
vi.stubGlobal('location', { hostname: 'pi.ai' });

describe('AgentModeNoticeModule', () => {
  let noticeModule: AgentModeNoticeModule;

  beforeEach(() => {
    // Clear DOM
    document.body.innerHTML = '';
    
    // Clear localStorage
    localStorageMock.clear();
    
    // Reset all mocks
    vi.clearAllMocks();
    
    // Reset singleton instance to ensure clean state
    (AgentModeNoticeModule as any).instance = null;
    noticeModule = AgentModeNoticeModule.getInstance();
    
    // Ensure the instance starts with clean dismissed state
    noticeModule.resetDismissedState();
  });

  afterEach(() => {
    // Clean up any notices
    const notices = document.querySelectorAll('.saypi-agent-notice');
    notices.forEach(notice => notice.remove());
  });

  describe('getInstance', () => {
    it('should return singleton instance', () => {
      const instance1 = AgentModeNoticeModule.getInstance();
      const instance2 = AgentModeNoticeModule.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('showNoticeIfNeeded', () => {
    it('should not show notice when agent mode is not active', () => {
      noticeModule.showNoticeIfNeeded();
      
      const notices = document.querySelectorAll('.saypi-agent-notice');
      expect(notices).toHaveLength(0);
    });

    it('should not show notice if already dismissed for chatbot', () => {
      // Mock agent mode as active
      mockGetCachedDiscretionaryMode.mockReturnValue(true);
      
      // Mark as dismissed
      noticeModule.resetDismissedState();
      localStorageMock.setItem('saypi-agent-notice-dismissed', JSON.stringify({ pi: true }));
      
      // Create fresh instance to reload dismissed state
      (AgentModeNoticeModule as any).instance = null;
      noticeModule = AgentModeNoticeModule.getInstance();
      
      noticeModule.showNoticeIfNeeded();
      
      const notices = document.querySelectorAll('.saypi-agent-notice');
      expect(notices).toHaveLength(0);
    });

    it('should show notice when agent mode is active and not dismissed', () => {
      // Mock agent mode as active
      mockGetCachedDiscretionaryMode.mockReturnValue(true);
      
      // Create injection point
      const chatAncestor = document.createElement('div');
      chatAncestor.id = 'saypi-chat-ancestor';
      document.body.appendChild(chatAncestor);
      
      noticeModule.showNoticeIfNeeded();
      
      // Give time for async operations
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const notices = document.querySelectorAll('.saypi-agent-notice');
          expect(notices).toHaveLength(1);
          
          const notice = notices[0] as HTMLElement;
          expect(notice.getAttribute('data-chatbot')).toBe('pi');
          expect(notice.querySelector('.saypi-agent-notice-text')).toBeTruthy();
          expect(notice.querySelector('.saypi-agent-notice-close')).toBeTruthy();
          resolve();
        }, 100);
      });
    });
  });

  describe('findInjectionPoint', () => {
    it('should find #saypi-chat-ancestor when available', () => {
      const chatAncestor = document.createElement('div');
      chatAncestor.id = 'saypi-chat-ancestor';
      document.body.appendChild(chatAncestor);
      
      const injectionPoint = (noticeModule as any).findInjectionPoint('pi');
      expect(injectionPoint).toBe(chatAncestor);
    });

    it('should fall back to chatbot-specific selectors', () => {
      // Test ChatGPT fallback
      const composerForm = document.createElement('form');
      composerForm.setAttribute('data-type', 'unified-composer');
      document.body.appendChild(composerForm);
      
      const injectionPoint = (noticeModule as any).findInjectionPoint('chatgpt');
      expect(injectionPoint).toBe(composerForm);
    });

    it('should return null when no injection point found', () => {
      const injectionPoint = (noticeModule as any).findInjectionPoint('unknown');
      expect(injectionPoint).toBeNull();
    });
  });

  describe('dismiss functionality', () => {
    it('should dismiss notice and save state when close button clicked', () => {
      // Mock agent mode as active
      mockGetCachedDiscretionaryMode.mockReturnValue(true);
      
      // Create injection point
      const chatAncestor = document.createElement('div');
      chatAncestor.id = 'saypi-chat-ancestor';
      document.body.appendChild(chatAncestor);
      
      noticeModule.showNoticeIfNeeded();
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const closeButton = document.querySelector('.saypi-agent-notice-close') as HTMLElement;
          expect(closeButton).toBeTruthy();
          
          closeButton.click();
          
          // Check that dismissed state was saved
          const dismissedState = localStorageMock.getItem('saypi-agent-notice-dismissed');
          expect(dismissedState).toBeTruthy();
          
          const parsed = JSON.parse(dismissedState!);
          expect(parsed.pi).toBe(true);
          
          resolve();
        }, 100);
      });
    });
  });

  describe('message formatting', () => {
    it('should format message with links correctly', () => {
      const rawMessage = 'Pi is listening in {agentModeLink}, and will respond only when needed. You can change this behaviour in {settingsLink}.';
      const formatted = (noticeModule as any).formatNoticeMessage(rawMessage);
      
      expect(formatted).toContain('<a href="https://www.saypi.ai/agents"');
      expect(formatted).toContain('target="_blank"');
      expect(formatted).toContain('rel="noopener noreferrer"');
      expect(formatted).toContain('agent mode');
      expect(formatted).toContain('saypi-settings-link');
      expect(formatted).toContain('settings');
    });
  });

  describe('resetDismissedState', () => {
    it('should reset dismissed state for specific chatbot', () => {
      localStorageMock.setItem('saypi-agent-notice-dismissed', JSON.stringify({ pi: true, claude: true }));
      
      // Reload the dismissed state to pick up the localStorage data
      (noticeModule as any).loadDismissedState();
      
      noticeModule.resetDismissedState('pi');
      
      const dismissedState = localStorageMock.getItem('saypi-agent-notice-dismissed');
      const parsed = JSON.parse(dismissedState!);
      expect(parsed.pi).toBeUndefined();
      expect(parsed.claude).toBe(true);
    });

    it('should reset all dismissed state when no chatbot specified', () => {
      localStorageMock.setItem('saypi-agent-notice-dismissed', JSON.stringify({ pi: true, claude: true }));
      
      // Reload the dismissed state to pick up the localStorage data
      (noticeModule as any).loadDismissedState();
      
      noticeModule.resetDismissedState();
      
      const dismissedState = localStorageMock.getItem('saypi-agent-notice-dismissed');
      const parsed = JSON.parse(dismissedState!);
      expect(Object.keys(parsed)).toHaveLength(0);
    });
  });
});