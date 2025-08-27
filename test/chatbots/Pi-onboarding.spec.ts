import { describe, expect, it, vi, beforeEach } from "vitest";
import { PiAIChatbot } from "../../src/chatbots/Pi";

// Mock dependencies that the DOMObserver imports
vi.mock("../../src/prefs/PreferenceModule", () => ({
  UserPreferenceModule: {
    getInstance: () => ({
      reloadCache: vi.fn(),
      getLanguage: vi.fn().mockResolvedValue("en-US"),
    })
  }
}));

vi.mock("../../src/tts/VoiceMenuUIManager", () => ({
  VoiceMenuUIManager: class {
    constructor() {}
    findAndDecorateVoiceMenu() {}
  }
}));

vi.mock("../../src/ButtonModule.js", () => ({
  buttonModule: {
    createEnterButton: vi.fn(),
    createExitButton: vi.fn(),
    createMiniSettingsButton: vi.fn(),
    createImmersiveModeButton: vi.fn(),
    createSettingsButton: vi.fn(),
    createCallButton: vi.fn(),
  }
}));

vi.mock("../../src/themes/ThemeManagerModule", () => ({
  ThemeManager: {
    getInstance: () => ({
      createThemeToggleButton: vi.fn(),
    })
  }
}));

describe('Pi Chatbot Path Validation', () => {
  const chatbot = new PiAIChatbot();

  it('should correctly identify chatable paths', () => {
    expect(chatbot.isChatablePath('/talk')).toBe(true);
    expect(chatbot.isChatablePath('/discover')).toBe(true);
    expect(chatbot.isChatablePath('/onboarding')).toBe(false);
    expect(chatbot.isChatablePath('/settings')).toBe(false);
    expect(chatbot.isChatablePath('/profile')).toBe(false);
    expect(chatbot.isChatablePath('/talk/conversation/123')).toBe(true);
    expect(chatbot.isChatablePath('/discover/featured')).toBe(true);
  });
});

describe('DOMObserver Path-based Decoration', () => {
  let chatbot: PiAIChatbot;

  beforeEach(() => {
    // Clear the DOM
    document.body.innerHTML = '';
    chatbot = new PiAIChatbot();
  });

  it('should respect the shouldDecorateUI method result', async () => {
    // Import DOMObserver
    const { DOMObserver } = await import("../../src/chatbots/bootstrap");
    
    // Create a DOMObserver instance
    const domObserver = new DOMObserver(chatbot);
    
    // Mock shouldDecorateUI to return false (non-chatable path)
    const shouldDecorateUISpy = vi.spyOn(domObserver as any, 'shouldDecorateUI').mockReturnValue(false);

    // Create a mock control panel element
    const controlPanel = document.createElement('div');
    controlPanel.className = 'flex items-center grow';
    document.body.appendChild(controlPanel);

    // Attempt to find and decorate the control panel
    const ctrlPanelObs = domObserver.findAndDecorateControlPanel(document.body);
    
    // Should not be decorated when shouldDecorateUI returns false
    expect(shouldDecorateUISpy).toHaveBeenCalled();
    expect(ctrlPanelObs.decorated).toBe(false);
    expect(document.getElementById('saypi-control-panel-main')).toBeNull();

    // Change mock to return true (chatable path)
    shouldDecorateUISpy.mockReturnValue(true);

    // Create another control panel element
    const controlPanel2 = document.createElement('div');
    controlPanel2.className = 'flex items-center grow';
    document.body.appendChild(controlPanel2);

    // Attempt to find and decorate the second control panel
    const ctrlPanelObs2 = domObserver.findAndDecorateControlPanel(document.body);
    
    // Should be decorated when shouldDecorateUI returns true
    expect(ctrlPanelObs2.decorated).toBe(true);
    expect(document.getElementById('saypi-control-panel-main')).not.toBeNull();

    shouldDecorateUISpy.mockRestore();
  });
});