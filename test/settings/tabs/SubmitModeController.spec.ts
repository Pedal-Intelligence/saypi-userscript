import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setupChromeMock, createTestContainer, cleanupTestContainer } from '../setup';
import { SubmitModeController } from '../../../entrypoints/settings/tabs/chat/submit-mode-controller';

describe('SubmitModeController', () => {
  let chromeMock: ReturnType<typeof setupChromeMock>;
  let container: HTMLElement;
  let controller: SubmitModeController;

  beforeEach(() => {
    chromeMock = setupChromeMock();
    container = createTestContainer();
  });

  afterEach(() => {
    cleanupTestContainer(container);
    chromeMock.cleanup();
    vi.clearAllMocks();
  });

  describe('Agent Mode UI (with entitlement)', () => {
    beforeEach(() => {
      // Setup DOM for agent mode (3-way slider)
      container.innerHTML = `
        <div id="submit-mode-selector" class="hidden">
          <input type="range" id="submitModeRange" min="0" max="2" value="0" />
          <div id="submitModeValue"></div>
          <div class="icon" id="auto"></div>
          <div class="icon" id="agent"></div>
          <div class="icon" id="off"></div>
          <div class="description" data-i18n="submit_mode_auto_description"></div>
          <div class="description" data-i18n="submit_mode_agent_description"></div>
          <div class="description" data-i18n="submit_mode_off_description"></div>
        </div>
        <div id="tab-chat"></div>
      `;

      // Mock agent mode entitlement check to return true
      chromeMock.runtime.sendMessage.mockImplementation((message: any, callback: any) => {
        if (message.type === 'CHECK_FEATURE_ENTITLEMENT' && message.feature === 'agent_mode') {
          callback({ hasEntitlement: true });
        }
      });

      // Storage mocks are reset by chromeMock.cleanup() in afterEach

      controller = new SubmitModeController();
    });

    it('should show 3-way slider for entitled users', async () => {
      await controller.init();

      const selector = document.getElementById('submit-mode-selector');
      expect(selector?.classList.contains('hidden')).toBe(false);
    });

    it('should remove auto-submit toggle if it exists', async () => {
      // Pre-create an auto-submit toggle
      const toggle = document.createElement('div');
      toggle.id = 'auto-submit-preference';
      container.appendChild(toggle);

      await controller.init();

      expect(document.getElementById('auto-submit-preference')).toBeNull();
    });

    it('should initialize slider with stored submitMode', async () => {
      // Mock storage to return agent mode
      chromeMock.storage.local.get.mockImplementation((keys, callback) => {
        callback({ submitMode: 'agent' });
      });

      await controller.init();

      const slider = document.getElementById('submitModeRange') as HTMLInputElement;
      expect(slider.value).toBe('1'); // agent = position 1
      expect(chromeMock.storage.local.get).toHaveBeenCalledWith(['submitMode'], expect.any(Function));
    });

    it('should migrate from old autoSubmit schema', async () => {
      // Mock storage calls for migration
      chromeMock.storage.local.get
        .mockImplementationOnce((keys, callback) => {
          // First call returns null for submitMode
          callback({ submitMode: null });
        })
        .mockImplementationOnce((keys, callback) => {
          // Second call returns autoSubmit value
          callback({ autoSubmit: false });
        });

      await controller.init();

      // Should save migrated values
      expect(chromeMock.storage.local.set).toHaveBeenCalledWith(
        { submitMode: 'off' },
        expect.any(Function)
      );
      expect(chromeMock.storage.local.set).toHaveBeenCalledWith(
        { autoSubmit: false },
        expect.any(Function)
      );
    });

    it('should save submitMode when slider changes', async () => {
      await controller.init();

      const slider = document.getElementById('submitModeRange') as HTMLInputElement;
      slider.value = '2'; // off
      slider.dispatchEvent(new Event('input'));

      await Promise.resolve(); // Wait for async operations

      expect(chromeMock.storage.local.set).toHaveBeenCalledWith(
        {
          submitMode: 'off',
          autoSubmit: false,
          discretionaryMode: false,
        },
        expect.any(Function)
      );
    });

    it('should notify content script when mode changes', async () => {
      await controller.init();

      const slider = document.getElementById('submitModeRange') as HTMLInputElement;
      slider.value = '1'; // agent
      slider.dispatchEvent(new Event('input'));

      await Promise.resolve();

      expect(chromeMock.tabs.query).toHaveBeenCalled();
      expect(chromeMock.tabs.sendMessage).toHaveBeenCalledWith(
        expect.any(Number),
        expect.objectContaining({
          autoSubmit: true,
          discretionaryMode: true,
        }),
        expect.any(Function)
      );
    });

    it('should handle icon clicks', async () => {
      await controller.init();

      const agentIcon = document.getElementById('agent');
      agentIcon?.dispatchEvent(new Event('click'));

      await Promise.resolve();

      const slider = document.getElementById('submitModeRange') as HTMLInputElement;
      expect(slider.value).toBe('1');
    });

    it('should update active icon when mode changes', async () => {
      await controller.init();

      const slider = document.getElementById('submitModeRange') as HTMLInputElement;
      slider.value = '1'; // agent
      slider.dispatchEvent(new Event('input'));

      const autoIcon = document.getElementById('auto');
      const agentIcon = document.getElementById('agent');
      const offIcon = document.getElementById('off');

      expect(autoIcon?.classList.contains('active')).toBe(false);
      expect(agentIcon?.classList.contains('active')).toBe(true);
      expect(offIcon?.classList.contains('active')).toBe(false);
    });

    it('should show correct description for selected mode', async () => {
      await controller.init();

      const slider = document.getElementById('submitModeRange') as HTMLInputElement;
      slider.value = '0'; // auto
      slider.dispatchEvent(new Event('input'));

      const descriptions = document.querySelectorAll('.description');
      const autoDesc = document.querySelector('[data-i18n="submit_mode_auto_description"]');
      const agentDesc = document.querySelector('[data-i18n="submit_mode_agent_description"]');

      expect(autoDesc?.classList.contains('selected')).toBe(true);
      expect(agentDesc?.classList.contains('selected')).toBe(false);
    });

    it('should update agent mode description with nickname', async () => {
      await controller.init();

      const agentDescription = document.createElement('span');
      agentDescription.setAttribute('data-i18n', 'submit_mode_agent_description');
      container.appendChild(agentDescription);

      chromeMock.i18n.getMessage.mockReturnValue('Test mode description for $1');

      controller.updateAgentModeDescription('TestBot');

      expect(agentDescription.textContent).toBe('Test mode description for TestBot');
    });

    it('should use default chatbot name when nickname is null', async () => {
      await controller.init();

      const agentDescription = document.createElement('span');
      agentDescription.setAttribute('data-i18n', 'submit_mode_agent_description');
      container.appendChild(agentDescription);

      chromeMock.i18n.getMessage.mockReturnValue('Test mode description for $1');

      controller.updateAgentModeDescription(null);

      expect(agentDescription.textContent).toBe('Test mode description for assistant');
    });
  });

  describe('Auto-Submit Only UI (no entitlement)', () => {
    beforeEach(() => {
      // Setup DOM
      container.innerHTML = `
        <div id="submit-mode-selector">
          <input type="range" id="submitModeRange" min="0" max="2" value="0" />
          <div id="submitModeValue"></div>
        </div>
        <div id="tab-chat"></div>
      `;

      // Mock agent mode entitlement check to return false
      chromeMock.runtime.sendMessage.mockImplementation((message: any, callback: any) => {
        if (message.type === 'CHECK_FEATURE_ENTITLEMENT' && message.feature === 'agent_mode') {
          callback({ hasEntitlement: false });
        }
      });

      controller = new SubmitModeController();
    });

    it('should hide 3-way slider for non-entitled users', async () => {
      await controller.init();

      const selector = document.getElementById('submit-mode-selector');
      expect(selector?.classList.contains('hidden')).toBe(true);
      expect(selector?.style.display).toBe('none');
    });

    it('should create auto-submit toggle', async () => {
      await controller.init();

      const toggle = document.getElementById('auto-submit-preference');
      expect(toggle).not.toBeNull();
      expect(toggle?.querySelector('#auto-submit')).not.toBeNull();
    });

    it('should not create duplicate toggles', async () => {
      // Create toggle manually first
      const existingToggle = document.createElement('div');
      existingToggle.id = 'auto-submit-preference';
      container.appendChild(existingToggle);

      await controller.init();

      const toggles = document.querySelectorAll('#auto-submit-preference');
      expect(toggles.length).toBe(1);
    });

    it('should initialize toggle with stored autoSubmit value', async () => {
      chromeMock.storage.local.get.mockImplementation((keys, callback) => {
        callback({ autoSubmit: false });
      });

      await controller.init();

      const toggle = document.getElementById('auto-submit') as HTMLInputElement;
      expect(toggle.checked).toBe(false);
    });

    it('should save preferences when toggle changes', async () => {
      await controller.init();

      const toggle = document.getElementById('auto-submit') as HTMLInputElement;
      toggle.checked = false;
      toggle.dispatchEvent(new Event('change'));

      await Promise.resolve();

      expect(chromeMock.storage.local.set).toHaveBeenCalledWith(
        {
          autoSubmit: false,
          discretionaryMode: false,
          submitMode: 'off',
        },
        expect.any(Function)
      );
    });

    it('should update checked class on toggle', async () => {
      await controller.init();

      const toggle = document.getElementById('auto-submit') as HTMLInputElement;
      toggle.checked = true;
      toggle.dispatchEvent(new Event('change'));

      expect(toggle.parentElement?.classList.contains('checked')).toBe(true);

      toggle.checked = false;
      toggle.dispatchEvent(new Event('change'));

      expect(toggle.parentElement?.classList.contains('checked')).toBe(false);
    });

    it('should notify content script when toggle changes', async () => {
      await controller.init();

      const toggle = document.getElementById('auto-submit') as HTMLInputElement;
      toggle.checked = true;
      toggle.dispatchEvent(new Event('change'));

      await Promise.resolve();

      expect(chromeMock.tabs.sendMessage).toHaveBeenCalledWith(
        expect.any(Number),
        expect.objectContaining({
          autoSubmit: true,
          discretionaryMode: false,
        }),
        expect.any(Function)
      );
    });
  });

  describe('getState', () => {
    beforeEach(() => {
      container.innerHTML = `
        <div id="submit-mode-selector">
          <input type="range" id="submitModeRange" min="0" max="2" value="0" />
          <div id="submitModeValue"></div>
        </div>
      `;

      chromeMock.runtime.sendMessage.mockImplementation((message: any, callback: any) => {
        callback({ hasEntitlement: true });
      });

      controller = new SubmitModeController();
    });

    it('should return current submit mode state', async () => {
      chromeMock.storage.local.get.mockImplementation((keys, callback) => {
        callback({
          submitMode: 'agent',
          autoSubmit: true,
          discretionaryMode: true,
        });
      });

      const state = await controller.getState();

      expect(state).toEqual({
        submitMode: 'agent',
        autoSubmit: true,
        discretionaryMode: true,
      });
    });

    it('should return defaults if no state stored', async () => {
      chromeMock.storage.local.get.mockImplementation((keys, callback) => {
        callback({});
      });

      const state = await controller.getState();

      expect(state).toEqual({
        submitMode: 'auto',
        autoSubmit: true,
        discretionaryMode: false,
      });
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      container.innerHTML = `
        <div id="submit-mode-selector">
          <input type="range" id="submitModeRange" min="0" max="2" value="0" />
          <div id="submitModeValue"></div>
        </div>
      `;

      chromeMock.runtime.sendMessage.mockImplementation((message: any, callback: any) => {
        callback({ hasEntitlement: true });
      });

      controller = new SubmitModeController();
    });

    it('should handle missing slider element gracefully', async () => {
      // Remove slider
      document.getElementById('submitModeRange')?.remove();

      await expect(controller.init()).resolves.not.toThrow();
    });

    it('should handle missing output element gracefully', async () => {
      // Remove output
      document.getElementById('submitModeValue')?.remove();

      await expect(controller.init()).resolves.not.toThrow();
    });

    it('should handle entitlement check failure', async () => {
      chromeMock.runtime.sendMessage.mockImplementation((message: any, callback: any) => {
        callback(null); // Simulate failure
      });

      await expect(controller.init()).resolves.not.toThrow();
    });
  });
});

