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

// Stable spy so we can assert the theme toggle is/was created across a decorate call.
const { createThemeToggleButtonMock } = vi.hoisted(() => ({
  createThemeToggleButtonMock: vi.fn(),
}));
vi.mock("../../src/themes/ThemeManagerModule", () => ({
  ThemeManager: {
    getInstance: () => ({
      createThemeToggleButton: createThemeToggleButtonMock,
    })
  }
}));

describe('Pi Chatbot Path Validation', () => {
  const chatbot = new PiAIChatbot();

  it('should correctly identify chatable paths', () => {
    expect(chatbot.isChatablePath('/talk')).toBe(true);
    expect(chatbot.isChatablePath('/discover')).toBe(true);
    expect(chatbot.isChatablePath('/threads')).toBe(true);
    expect(chatbot.isChatablePath('/onboarding')).toBe(false);
    expect(chatbot.isChatablePath('/settings')).toBe(false);
    expect(chatbot.isChatablePath('/profile/settings')).toBe(true);
    expect(chatbot.isChatablePath('/profile')).toBe(true);
    expect(chatbot.isChatablePath('/talk/conversation/123')).toBe(true);
    expect(chatbot.isChatablePath('/discover/featured')).toBe(true);
  });
});

describe('DOMObserver Path-based Decoration', () => {
  let chatbot: PiAIChatbot;

  beforeEach(() => {
    // Clear the DOM
    document.body.innerHTML = '';
    // Reset button-creation call history between tests so .not.toHaveBeenCalled() is reliable
    vi.clearAllMocks();
    chatbot = new PiAIChatbot();
  });

  it("does not duplicate the sidebar's Focus / Voice-settings buttons in Pi's main control panel", async () => {
    const { DOMObserver } = await import("../../src/chatbots/bootstrap");
    const { buttonModule } = await import("../../src/ButtonModule.js");

    const domObserver = new DOMObserver(chatbot);
    vi.spyOn(domObserver as any, 'shouldDecorateUI').mockReturnValue(true);

    const controlPanel = document.createElement('div');
    controlPanel.className = 'flex items-center grow';
    document.body.appendChild(controlPanel);

    const obs = domObserver.findAndDecorateControlPanel(document.body);
    expect(obs.decorated).toBe(true);

    // Focus (enter) and Voice settings (mini settings) live in Pi's sidebar menu,
    // so they must NOT be duplicated onto the main content control panel.
    expect(buttonModule.createEnterButton).not.toHaveBeenCalled();
    expect(buttonModule.createMiniSettingsButton).not.toHaveBeenCalled();

    // Exit + theme toggle MUST stay: in immersive mode the sidebar is hidden and the
    // main control panel is the only visible SayPi surface, so the exit button is Pi's
    // sole way out of focus mode (and the theme toggle is the only theme control). Both
    // are hidden by CSS in standard view, so they don't reappear as stray main-area icons.
    expect(buttonModule.createExitButton).toHaveBeenCalled();
    expect(createThemeToggleButtonMock).toHaveBeenCalled();
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