import { TabController } from '../../shared/types';
import { getStoredValue, setStoredValue } from '../../shared/storage';
import { sendMessageToActiveTab } from '../../shared/messaging';
import { SubmitModeController } from './submit-mode-controller';
import chatHTML from './chat.html?raw';
import './chat.css';

export class ChatTab implements TabController {
  private submitModeController: SubmitModeController | null = null;
  
  constructor(public container: HTMLElement) {}
  
  async init(): Promise<void> {
    console.info('[ChatTab] Initializing...', { 
      hasContainer: !!this.container,
      htmlLength: chatHTML?.length || 0,
      htmlType: typeof chatHTML,
      htmlPreview: chatHTML?.substring(0, 100)
    });
    
    this.container.innerHTML = chatHTML;
    
    console.info('[ChatTab] HTML injected');
    
    await this.setupNickname();
    await this.setupInterruptions();
    await this.setupAutoReadAloud();
    await this.setupSubmitMode();
    
    console.info('[ChatTab] ✅ Initialized');
  }
  
  private async setupNickname(): Promise<void> {
    const input = this.container.querySelector<HTMLInputElement>('#assistant-nickname');
    if (!input) return;
    
    const nickname = await getStoredValue<string | null>('nickname', null);
    if (nickname) input.value = nickname;
    
    // Update agent mode description with current nickname
    if (this.submitModeController) {
      this.submitModeController.updateAgentModeDescription(nickname);
    }
    
    input.addEventListener('change', async () => {
      const value = input.value.trim();
      if (value) {
        await setStoredValue('nickname', value);
        sendMessageToActiveTab({ nickname: value });
        // Update agent mode description
        if (this.submitModeController) {
          this.submitModeController.updateAgentModeDescription(value);
        }
      } else {
        await chrome.storage.local.remove('nickname');
        sendMessageToActiveTab({ nickname: null });
        // Update agent mode description with default
        if (this.submitModeController) {
          this.submitModeController.updateAgentModeDescription(null);
        }
      }
    });
    
    // Handle Enter key
    input.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        input.blur(); // Trigger change event
      }
    });
  }
  
  private async setupInterruptions(): Promise<void> {
    const input = this.container.querySelector<HTMLInputElement>('#allow-interruptions');
    if (!input) return;
    
    const label = input.closest('.wraper');
    
    if (/Firefox/.test(navigator.userAgent)) {
      input.disabled = true;
      label?.classList.add('disabled');
      label?.setAttribute('title', chrome.i18n.getMessage('interruptionsFirefoxDisabled'));
      input.checked = false;
    } else {
      const value = await getStoredValue('allowInterruptions', true);
      input.checked = value;
      if (value) input.parentElement?.classList.add('checked');
    }
    
    input.addEventListener('change', async () => {
      await setStoredValue('allowInterruptions', input.checked);
      input.parentElement?.classList.toggle('checked', input.checked);
      sendMessageToActiveTab({ allowInterruptions: input.checked });
    });
  }
  
  private async setupAutoReadAloud(): Promise<void> {
    const input = this.container.querySelector<HTMLInputElement>('#chatgpt-auto-read-aloud');
    if (!input) return;
    
    const value = await getStoredValue('autoReadAloudChatGPT', true);
    input.checked = value;
    if (value) input.parentElement?.classList.add('checked');
    
    input.addEventListener('change', async () => {
      await setStoredValue('autoReadAloudChatGPT', input.checked);
      input.parentElement?.classList.toggle('checked', input.checked);
      sendMessageToActiveTab({ autoReadAloudChatGPT: input.checked });
    });
  }
  
  private async setupSubmitMode(): Promise<void> {
    this.submitModeController = new SubmitModeController();
    await this.submitModeController.init();
    
    // Update agent mode description with current nickname
    const nickname = await getStoredValue<string | null>('nickname', null);
    this.submitModeController.updateAgentModeDescription(nickname);
  }
}

