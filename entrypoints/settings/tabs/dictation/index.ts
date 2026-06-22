import { h } from 'preact';
import { TabController } from '../../shared/types';
import { getStoredValue, setStoredValue } from '../../shared/storage';
import { sendMessageToActiveTab } from '../../shared/messaging';
import { mountInto, unmountFrom } from '../../../../src/ui/preact/mount';
import { DictationPanel } from './DictationPanel';
import './dictation.css';

declare global {
  interface Window {
    ModeSelector: any;
    LanguagePicker: any;
  }
}

export class DictationTab implements TabController {
  private modeSelector: any;
  
  constructor(public container: HTMLElement) {}
  
  async init(): Promise<void> {
    // Render the panel with Preact, then wire the controls imperatively —
    // behaviour unchanged: ModeSelector / LanguagePicker and the toggle setup
    // methods operate on the rendered DOM by id/selector.
    mountInto(this.container, h(DictationPanel, {}));

    await this.setupModeSelector();
    await this.setupLanguagePicker();
    await this.setupVADIndicator();
    await this.setupFillerWords();
  }

  /**
   * Clean up when the tab is destroyed. Defensive — the orchestrator keeps tabs
   * mounted (init runs once), but unmount the Preact tree if it is ever called.
   */
  destroy(): void {
    this.modeSelector = null;
    unmountFrom(this.container);
  }
  
  private async setupModeSelector(): Promise<void> {
    // Initialize ModeSelector component from mode-selector.js
    if (window.ModeSelector) {
      this.modeSelector = new window.ModeSelector({
        containerId: 'preference-selector',
        sliderId: 'customRange',
        labelId: 'sliderValue',
        storageKey: 'prefer',
        values: [
          { id: 'speed', i18nLabelKey: 'mode_speed', i18nDescriptionKey: 'mode_speed_description' },
          { id: 'balanced', i18nLabelKey: 'mode_balanced', i18nDescriptionKey: 'mode_balanced_description' },
          { id: 'accuracy', i18nLabelKey: 'mode_accuracy', i18nDescriptionKey: 'mode_accuracy_description' }
        ]
      });
      this.modeSelector.init();
    }
  }

  private async setupLanguagePicker(): Promise<void> {
    // Manually initialize language picker after HTML is injected
    const pickerElement = this.container.querySelector('.js-language-picker');
    if (pickerElement && window.LanguagePicker) {
      new window.LanguagePicker(pickerElement);

      // Set up change listener for storage
      const select = pickerElement.querySelector('select');
      if (select) {
        select.addEventListener('change', function() {
          chrome.storage.local.set({ language: (this as HTMLSelectElement).value }, function(this: any) {
            console.log('Preference saved: Language is set to ' + (this as any).value);
          });
        });
      }
    }
  }
  
  private async setupVADIndicator(): Promise<void> {
    const input = this.container.querySelector<HTMLInputElement>('#vad-status-indicator-enabled');
    if (!input) return;
    
    const value = await getStoredValue('vadStatusIndicatorEnabled', true);
    input.checked = value;
    if (value) input.parentElement?.classList.add('checked');
    
    input.addEventListener('change', async () => {
      await setStoredValue('vadStatusIndicatorEnabled', input.checked);
      input.parentElement?.classList.toggle('checked', input.checked);
      sendMessageToActiveTab({ vadStatusIndicatorEnabled: input.checked });
    });
  }
  
  private async setupFillerWords(): Promise<void> {
    const input = this.container.querySelector<HTMLInputElement>('#remove-filler-words');
    if (!input) return;
    
    const value = await getStoredValue('removeFillerWords', false);
    input.checked = value;
    if (value) input.parentElement?.classList.add('checked');
    
    input.addEventListener('change', async () => {
      await setStoredValue('removeFillerWords', input.checked);
      input.parentElement?.classList.toggle('checked', input.checked);
      sendMessageToActiveTab({ removeFillerWords: input.checked });
    });
  }
}

