import { TabController } from '../../shared/types';
import { getStoredValue, setStoredValue } from '../../shared/storage';
import { sendMessageToActiveTab } from '../../shared/messaging';
import dictationHTML from './dictation.html?raw';
import './dictation.css';

declare global {
  interface Window {
    ModeSelector: any;
  }
}

export class DictationTab implements TabController {
  private modeSelector: any;
  
  constructor(public container: HTMLElement) {}
  
  async init(): Promise<void> {
    console.info('[DictationTab] Initializing...', { 
      hasContainer: !!this.container,
      htmlLength: dictationHTML?.length || 0,
      htmlType: typeof dictationHTML
    });
    
    this.container.innerHTML = dictationHTML;
    
    console.info('[DictationTab] HTML injected');
    
    await this.setupModeSelector();
    await this.setupVADIndicator();
    await this.setupFillerWords();
    
    console.info('[DictationTab] ✅ Initialized');
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

