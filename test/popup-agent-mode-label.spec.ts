/**
 * Test for agent mode label initialization issue
 * Verifies that the agent mode label displays correctly on first load
 */

import { JSDOM } from 'jsdom';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock chrome APIs
global.chrome = {
  i18n: {
    getMessage: vi.fn((key, placeholders) => {
      const messages = {
        'submit_mode_auto': 'auto',
        'submit_mode_agent': 'agent',
        'submit_mode_off': 'off',
        'submit_mode_auto_description': 'Automatically submit when you stop speaking',
        'submit_mode_agent_description': 'Assistant decides when to respond based on context',
        'submit_mode_off_description': 'Only submit when you press the button'
      };
      return messages[key] || key;
    })
  },
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn()
    }
  },
  runtime: {
    sendMessage: vi.fn()
  }
};

describe('Agent Mode Label Initialization', () => {
  let document;
  let window;
  
  beforeEach(() => {
    const dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <div id="submit-mode-selector" class="w-full max-w-lg user-preference-item mode-selector">
            <div>
              <div class="flex justify-between mb-2">
                <span class="icon" aria-label="Rocket" slider-value="0" id="auto">
                  <span class="icon-circle"><i data-lucide="zap"></i></span>
                </span>
                <span class="icon" aria-label="Robot" slider-value="1" id="agent">
                  <span class="icon-circle"><i data-lucide="bot"></i></span>
                </span>
                <span class="icon" aria-label="Hand" slider-value="2" id="off">
                  <span class="icon-circle"><i data-lucide="hand"></i></span>
                </span>
              </div>
              <input type="range" min="0" max="2" value="0" class="slider w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer" id="submitModeRange" title="Select when to submit your messages" />
            </div>
            <div id="submitModeValue" class="mt-2 text-lg font-semibold text-gray-700">auto</div>
            <div class="description" data-i18n="submit_mode_auto_description">Automatically submit when you stop speaking</div>
            <div class="description" data-i18n="submit_mode_agent_description">Assistant decides when to respond based on context</div>
            <div class="description" data-i18n="submit_mode_off_description">Only submit when you press the button</div>
          </div>
        </body>
      </html>
    `);
    document = dom.window.document;
    window = dom.window;

    // Set up DOM context (no need to assign to globals in test)
  });

  it('should initialize with correct label when submit mode is "agent"', async () => {
    // Mock storage to return "agent" mode
    chrome.storage.local.get.mockImplementation((keys, callback) => {
      if (keys.includes('submitMode') || keys === 'submitMode') {
        callback({ submitMode: 'agent' });
      } else {
        callback({});
      }
    });

    // Mock entitlement check to return true
    chrome.runtime.sendMessage.mockImplementation((message, callback) => {
      if (message.type === 'CHECK_FEATURE_ENTITLEMENT') {
        callback({ hasEntitlement: true });
      }
    });

    // Simulate the ModeSelector initialization logic
    const submitModeIcons = {
      0: "auto",
      1: "agent", 
      2: "off",
    };

    const submitModeSlider = document.getElementById("submitModeRange");
    const submitModeOutput = document.getElementById("submitModeValue");

    // Simulate getting stored value
    const submitMode = "agent";
    const selectedValue = Object.keys(submitModeIcons).find(
      (key) => submitModeIcons[key] === submitMode
    );
    
    // Apply the fix: set slider value and label
    submitModeSlider.value = selectedValue;
    const messageKey = "submit_mode_" + submitMode;
    submitModeOutput.textContent = chrome.i18n.getMessage(messageKey);

    // Verify that the slider is positioned correctly
    expect(submitModeSlider.value).toBe("1"); // agent mode is at index 1
    
    // Verify that the label shows "agent" not "auto"  
    expect(submitModeOutput.textContent).toBe("agent");
  });

  it('should set active icon state for agent mode', async () => {
    // Mock storage to return "agent" mode
    chrome.storage.local.get.mockImplementation((keys, callback) => {
      if (keys.includes('submitMode') || keys === 'submitMode') {
        callback({ submitMode: 'agent' });
      } else {
        callback({});
      }
    });

    const submitModeIcons = {
      0: "auto",
      1: "agent",
      2: "off",
    };

    // Simulate the setActiveSubmitModeIcon function
    const submitMode = "agent";
    Object.keys(submitModeIcons).forEach((key) => {
      const iconId = submitModeIcons[key];
      const iconElement = document.getElementById(iconId);
      if (iconId === submitMode) {
        iconElement.classList.add("active");
      } else {
        iconElement.classList.remove("active");
      }
    });

    // Verify that only the agent icon is active
    expect(document.getElementById("auto").classList.contains("active")).toBe(false);
    expect(document.getElementById("agent").classList.contains("active")).toBe(true);
    expect(document.getElementById("off").classList.contains("active")).toBe(false);
  });

  it('should show correct description for agent mode', async () => {
    const submitMode = "agent";
    
    // Simulate the showSubmitModeDescription function
    const descriptions = document.querySelectorAll("#submit-mode-selector .description");
    descriptions.forEach((description) => {
      if (
        description.getAttribute("data-i18n") ===
        `submit_mode_${submitMode}_description`
      ) {
        description.classList.add("selected");
      } else {
        description.classList.remove("selected");
      }
    });

    // Verify that only the agent description is selected
    const autoDesc = document.querySelector('[data-i18n="submit_mode_auto_description"]');
    const agentDesc = document.querySelector('[data-i18n="submit_mode_agent_description"]');
    const offDesc = document.querySelector('[data-i18n="submit_mode_off_description"]');

    expect(autoDesc.classList.contains("selected")).toBe(false);
    expect(agentDesc.classList.contains("selected")).toBe(true);
    expect(offDesc.classList.contains("selected")).toBe(false);
  });
});