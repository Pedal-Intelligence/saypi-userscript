/**
 * Submit Mode Controller
 * Manages agent mode, submit mode UI, and related settings
 * 
 * Agent Mode: Users with agent_mode entitlement see a 3-way slider (auto/agent/off)
 * Auto-Submit Only: Users without entitlement see a simple auto-submit toggle
 */

import { sendMessageToActiveTab } from '../../shared/messaging';

// Use chrome APIs directly within class methods to avoid import issues in tests

export type SubmitMode = 'auto' | 'agent' | 'off';

export interface SubmitModeState {
  submitMode: SubmitMode;
  autoSubmit: boolean;
  discretionaryMode: boolean;
}

/**
 * Submit Mode Controller Class
 * Handles UI and state management for submit mode preferences
 */
export class SubmitModeController {
  private hasEntitlement: boolean = false;
  private currentNickname: string | null = null;

  private submitModeSlider: HTMLInputElement | null = null;
  private submitModeOutput: HTMLElement | null = null;
  private submitModeSelector: HTMLElement | null = null;

  // Helper methods that use chrome APIs directly
  private async getStoredValue<T>(key: string, defaultValue: T): Promise<T> {
    if (!chrome?.storage?.local) {
      console.warn(`chrome.storage.local not available. Returning default for ${key}.`);
      return defaultValue;
    }

    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result) => {
        if (chrome.runtime?.lastError) {
          console.error(`Error getting ${key}:`, chrome.runtime.lastError.message);
          resolve(defaultValue);
        } else {
          resolve(result[key] !== undefined ? result[key] : defaultValue);
        }
      });
    });
  }

  private async setStoredValue<T>(key: string, value: T): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [key]: value }, () => {
        if (chrome.runtime?.lastError) {
          console.error(`Failed to save ${key}:`, chrome.runtime.lastError.message);
          reject(chrome.runtime.lastError);
        } else {
          console.log(`Preference saved: ${key}`, value);
          resolve();
        }
      });
    });
  }

  private readonly SUBMIT_MODE_ICONS: Record<number, SubmitMode> = {
    0: 'auto',
    1: 'agent',
    2: 'off',
  };

  constructor() {
    // Elements will be initialized in init()
  }

  /**
   * Initialize the controller
   * Checks entitlement and sets up UI accordingly
   */
  async init(): Promise<void> {
    this.submitModeSlider = document.getElementById('submitModeRange') as HTMLInputElement | null;
    this.submitModeOutput = document.getElementById('submitModeValue') as HTMLElement | null;
    this.submitModeSelector = document.getElementById('submit-mode-selector') as HTMLElement | null;

    if (!this.submitModeSlider) {
      console.warn('[SubmitModeController] submitModeRange element not found');
    }
    if (!this.submitModeOutput) {
      console.warn('[SubmitModeController] submitModeValue element not found');
    }

    // Check entitlement and setup UI
    this.hasEntitlement = await this.checkAgentModeEntitlement();
    await this.updateUI();
  }

  /**
   * Check if user has agent mode entitlement
   */
  private async checkAgentModeEntitlement(): Promise<boolean> {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        { type: 'CHECK_FEATURE_ENTITLEMENT', feature: 'agent_mode' },
        (response) => {
          resolve(!!response && response.hasEntitlement);
        }
      );
    });
  }

  /**
   * Update UI based on entitlement
   * Agent mode users see 3-way slider, others see auto-submit toggle
   */
  private async updateUI(): Promise<void> {
    if (this.hasEntitlement) {
      await this.setupAgentModeUI();
    } else {
      await this.setupAutoSubmitOnlyUI();
    }
  }

  /**
   * Setup UI for users with agent mode entitlement (3-way slider)
   */
  private async setupAgentModeUI(): Promise<void> {
    // Show the 3-way slider
    if (this.submitModeSelector) {
      this.submitModeSelector.classList.remove('hidden');
      this.submitModeSelector.style.removeProperty('display');
    }

    // Remove any existing auto-submit toggle
    const existingToggle = document.getElementById('auto-submit-preference');
    if (existingToggle) {
      existingToggle.remove();
    }

    // Initialize slider event handlers
    this.initializeSliderHandlers();

    // Load state from storage
    await this.loadSubmitModeFromStorage();
  }

  /**
   * Setup UI for users without agent mode (simple auto-submit toggle)
   */
  private async setupAutoSubmitOnlyUI(): Promise<void> {
    // Hide the 3-way slider
    if (this.submitModeSelector) {
      this.submitModeSelector.classList.add('hidden');
      this.submitModeSelector.style.display = 'none';
    }

    // Only create toggle if it doesn't exist
    if (!document.getElementById('auto-submit-preference')) {
      this.createAutoSubmitToggle();
    }
  }

  /**
   * Create auto-submit toggle for users without agent mode
   */
  private createAutoSubmitToggle(): void {
    const autoSubmitToggle = document.createElement('div');
    autoSubmitToggle.className = 'user-preference-item w-full max-w-lg';
    autoSubmitToggle.id = 'auto-submit-preference';

    const label = document.createElement('label');
    label.className = 'wraper';
    label.setAttribute('for', 'auto-submit');

    const labelText = document.createElement('span');
    labelText.className = 'label-text';
    labelText.setAttribute('data-i18n', 'autoSubmit');
    labelText.textContent = chrome.i18n.getMessage('autoSubmit') || 'Auto-submit';

    const switchWrap = document.createElement('div');
    switchWrap.className = 'switch-wrap control';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = 'auto-submit';
    input.name = 'autoSubmit';

    const switchDiv = document.createElement('div');
    switchDiv.className = 'switch';

    switchWrap.appendChild(input);
    switchWrap.appendChild(switchDiv);
    label.appendChild(labelText);
    label.appendChild(switchWrap);
    autoSubmitToggle.appendChild(label);

    // Insert into the AI Chat tab
    const chatTab = document.getElementById('tab-chat');
    if (chatTab) {
      // Try to insert after the submit mode selector, or append to end
      if (this.submitModeSelector && this.submitModeSelector.parentNode === chatTab) {
        chatTab.insertBefore(autoSubmitToggle, this.submitModeSelector.nextSibling);
      } else {
        chatTab.appendChild(autoSubmitToggle);
      }
    }

    // Setup toggle state and handler
    this.setupAutoSubmitToggle(input);
  }

  /**
   * Setup auto-submit toggle state and event handler
   */
  private async setupAutoSubmitToggle(input: HTMLInputElement): Promise<void> {
    const autoSubmit = await this.getStoredValue('autoSubmit', true);
    this.selectInput(input, autoSubmit);

    input.addEventListener('change', async () => {
      const checked = input.checked;
      
      // Save multiple values
      await this.setStoredValue('autoSubmit', checked);
      await this.setStoredValue('discretionaryMode', false);
      await this.setStoredValue('submitMode', checked ? 'auto' : 'off');

      if (checked) {
        input.parentElement?.classList.add('checked');
      } else {
        input.parentElement?.classList.remove('checked');
      }

      sendMessageToActiveTab({
        autoSubmit: checked,
        discretionaryMode: false,
      });
    });
  }

  /**
   * Initialize 3-way slider event handlers
   */
  private initializeSliderHandlers(): void {
    if (!this.submitModeSlider || !this.submitModeOutput) {
      return;
    }

    // Slider input handler
    this.submitModeSlider.oninput = () => {
      if (!this.submitModeSlider || !this.submitModeOutput) return;
      
      const sliderValue = parseInt(this.submitModeSlider.value, 10);
      const submitMode = this.SUBMIT_MODE_ICONS[sliderValue];
      
      this.updateSubmitModeUI(submitMode);
      this.saveSubmitMode(submitMode);
    };

    // Icon click handlers
    const submitModeIcons = document.querySelectorAll('#submit-mode-selector .icon');
    submitModeIcons.forEach((icon) => {
      icon.addEventListener('click', () => {
        this.handleIconClick(icon.id as SubmitMode);
      });
    });
  }

  /**
   * Handle icon click (move slider to selected position)
   */
  private handleIconClick(iconId: string): void {
    if (!this.submitModeSlider) return;

    const position = Object.keys(this.SUBMIT_MODE_ICONS).find(
      (key) => this.SUBMIT_MODE_ICONS[Number(key)] === iconId
    );

    if (position !== undefined) {
      this.submitModeSlider.value = position;
      this.submitModeSlider.dispatchEvent(new Event('input'));
    }
  }

  /**
   * Update UI to reflect selected submit mode
   */
  private updateSubmitModeUI(submitMode: SubmitMode): void {
    if (!this.submitModeOutput) return;

    // Update label text
    const messageKey = `submit_mode_${submitMode}`;
    this.submitModeOutput.textContent = chrome.i18n.getMessage(messageKey);

    // Update active icon
    this.setActiveIcon(submitMode);

    // Show corresponding description
    this.showDescription(submitMode);
  }

  /**
   * Save submit mode to storage
   */
  private async saveSubmitMode(submitMode: SubmitMode): Promise<void> {
    const state: SubmitModeState = {
      submitMode,
      autoSubmit: submitMode !== 'off',
      discretionaryMode: submitMode === 'agent',
    };

    // Save all three values
    await this.setStoredValue('submitMode', state.submitMode);
    await this.setStoredValue('autoSubmit', state.autoSubmit);
    await this.setStoredValue('discretionaryMode', state.discretionaryMode);

    // Notify content script
    sendMessageToActiveTab({
      autoSubmit: state.autoSubmit,
      discretionaryMode: state.discretionaryMode,
    });
  }

  /**
   * Load submit mode from storage and update UI
   */
  private async loadSubmitModeFromStorage(): Promise<void> {
    if (!this.submitModeSlider || !this.submitModeOutput) {
      return;
    }

    let submitMode = await this.getStoredValue<SubmitMode>('submitMode', null);

    // Migrate from old schema if needed
    if (submitMode === null) {
      const autoSubmit = await this.getStoredValue('autoSubmit', true);
      submitMode = autoSubmit ? 'auto' : 'off';
      
      // Save migrated values
      await this.setStoredValue('submitMode', submitMode);
      await this.setStoredValue('autoSubmit', autoSubmit);

      console.log('[SubmitModeController] Migrated autoSubmit to submitMode:', submitMode);
    }

    // Update UI with loaded state
    const sliderValue = Object.keys(this.SUBMIT_MODE_ICONS).find(
      (key) => this.SUBMIT_MODE_ICONS[Number(key)] === submitMode
    );

    if (sliderValue !== undefined) {
      this.submitModeSlider.value = sliderValue;
      this.updateSubmitModeUI(submitMode);
    }
  }

  /**
   * Set active icon based on submit mode
   */
  private setActiveIcon(submitMode: SubmitMode): void {
    Object.values(this.SUBMIT_MODE_ICONS).forEach((mode) => {
      const iconElement = document.getElementById(mode);
      if (iconElement) {
        if (mode === submitMode) {
          iconElement.classList.add('active');
        } else {
          iconElement.classList.remove('active');
        }
      }
    });
  }

  /**
   * Show description for selected submit mode
   */
  private showDescription(submitMode: SubmitMode): void {
    const descriptions = document.querySelectorAll('#submit-mode-selector .description');
    descriptions.forEach((description) => {
      const descriptionKey = description.getAttribute('data-i18n');
      if (descriptionKey === `submit_mode_${submitMode}_description`) {
        description.classList.add('selected');
      } else {
        description.classList.remove('selected');
      }
    });
  }

  /**
   * Update agent mode description with current nickname
   */
  updateAgentModeDescription(nickname: string | null): void {
    this.currentNickname = nickname;
    
    const agentDescription = document.querySelector('[data-i18n="submit_mode_agent_description"]');
    if (agentDescription) {
      const chatbotName = nickname && nickname.trim() ? nickname.trim() : 'assistant';
      const message = chrome.i18n.getMessage('submit_mode_agent_description', [chatbotName]);
      agentDescription.textContent = message;
    }
  }

  /**
   * Helper to apply boolean value to input and its parent label
   */
  private selectInput(input: HTMLInputElement, value: boolean): void {
    input.checked = value;
    if (value) {
      input.parentElement?.classList.add('checked');
    }
  }

  /**
   * Get current submit mode state
   */
  async getState(): Promise<SubmitModeState> {
    const submitMode = await this.getStoredValue<SubmitMode>('submitMode', 'auto');
    const autoSubmit = await this.getStoredValue('autoSubmit', true);
    const discretionaryMode = await this.getStoredValue('discretionaryMode', false);

    return {
      submitMode,
      autoSubmit,
      discretionaryMode,
    };
  }
}

