import { TabController } from '../../shared/types';
import { getStoredValue, setStoredValue } from '../../shared/storage';
import { sendMessageToActiveTab } from '../../shared/messaging';
import chatHTML from './chat.html?raw';
import './chat.css';

export class ChatTab implements TabController {
  constructor(public container: HTMLElement) {}
  
  async init(): Promise<void> {
    this.container.innerHTML = chatHTML;
    
    await this.setupNickname();
    await this.setupInterruptions();
    await this.setupAutoReadAloud();
    // Submit mode logic remains in popup.js for now (Phase 3 will extract it)
    
    // Icons will be initialized globally after all tabs are set up
    // replaceI18n() will be called globally as well
  }
  
  private async setupNickname(): Promise<void> {
    const input = this.container.querySelector<HTMLInputElement>('#assistant-nickname');
    if (!input) return;
    
    const nickname = await getStoredValue<string | null>('nickname', null);
    if (nickname) input.value = nickname;
    
    input.addEventListener('change', async () => {
      const value = input.value.trim();
      if (value) {
        await setStoredValue('nickname', value);
        sendMessageToActiveTab({ nickname: value });
      } else {
        await chrome.storage.local.remove('nickname');
        sendMessageToActiveTab({ nickname: null });
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
}

