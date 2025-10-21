import { TabController } from '../../shared/types';
import { getStoredValue, setStoredValue } from '../../shared/storage';
import generalHTML from './general.html?raw';
import dataSharingPortraitUrl from '../../../../src/popup/data-sharing-portrait.jpg';
import './general.css';

export class GeneralTab implements TabController {
  constructor(public container: HTMLElement) {}
  
  async init(): Promise<void> {
    // Inject HTML template
    this.container.innerHTML = generalHTML;

    // Resolve consent imagery before user may see it
    this.setConsentHeroImage();

    // Initialize components
    await this.setupSoundEffects();
    await this.setupAnalytics();
    await this.setupConsent();
    this.setupClearPreferences();
  }

  private setConsentHeroImage(): void {
    const hero = this.container.querySelector<HTMLElement>('#analytics-consent .consent-hero');
    if (!hero) return;
    hero.style.setProperty('--consent-hero-url', `url("${dataSharingPortraitUrl}")`);
  }
  
  private async setupSoundEffects(): Promise<void> {
    const input = this.container.querySelector<HTMLInputElement>('#sound-effects');
    if (!input) return;
    
    // Check Firefox
    if (/Firefox/.test(navigator.userAgent)) {
      input.disabled = true;
      input.closest('.wraper')?.classList.add('disabled');
      input.checked = false;
    } else {
      const value = await getStoredValue('soundEffects', true);
      input.checked = value;
      if (value) input.parentElement?.classList.add('checked');
    }
    
    input.addEventListener('change', async () => {
      try {
        await setStoredValue('soundEffects', input.checked);
        input.parentElement?.classList.toggle('checked', input.checked);
      } catch (error) {
        // Error already logged by setStoredValue, just prevent unhandled rejection
      }
    });
  }
  
  private async setupAnalytics(): Promise<void> {
    const input = this.container.querySelector<HTMLInputElement>('#share-data');
    if (!input) return;
    
    const value = await getStoredValue('shareData', false);
    input.checked = value;
    if (value) input.parentElement?.classList.add('checked');
    
    input.addEventListener('change', async () => {
      await setStoredValue('shareData', input.checked);
      input.parentElement?.classList.toggle('checked', input.checked);
    });
  }
  
  private async setupConsent(): Promise<void> {
    const optInBtn = this.container.querySelector('#opt-in');
    const optOutBtn = this.container.querySelector('#opt-out');
    
    // Check if consent needed
    const shareData = await getStoredValue<boolean | undefined>('shareData', undefined);
    if (shareData === undefined) {
      this.container.querySelector('#analytics-consent')?.classList.remove('hidden');
      // Hide other sections when showing consent
      this.container.querySelector('#premium-status')?.classList.add('hidden');
      this.container.querySelector('#upgrade')?.classList.add('hidden');
      this.container.querySelector('#devtools')?.classList.add('hidden');
    }
    
    optInBtn?.addEventListener('click', async () => {
      await setStoredValue('shareData', true);
      this.container.querySelector('#analytics-consent')?.classList.add('hidden');
      this.container.querySelector('#premium-status')?.classList.remove('hidden');
      this.container.querySelector('#upgrade')?.classList.remove('hidden');
      this.container.querySelector('#devtools')?.classList.remove('hidden');
    });
    
    optOutBtn?.addEventListener('click', async () => {
      await setStoredValue('shareData', false);
      this.container.querySelector('#analytics-consent')?.classList.add('hidden');
      this.container.querySelector('#premium-status')?.classList.remove('hidden');
      this.container.querySelector('#upgrade')?.classList.remove('hidden');
      this.container.querySelector('#devtools')?.classList.remove('hidden');
    });
  }
  
  private setupClearPreferences(): void {
    const btn = this.container.querySelector('#clear-preferences');
    btn?.addEventListener('click', () => {
      chrome.storage.local.clear(() => {
        console.log('Preferences cleared');
        location.reload();
      });
    });
  }
}
