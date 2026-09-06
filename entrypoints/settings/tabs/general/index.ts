import { h } from 'preact';
import { TabController } from '../../shared/types';
import { getStoredValue, setStoredValue } from '../../shared/storage';
import { sendMessageToActiveTab } from '../../shared/messaging';
import { mountInto, unmountFrom } from '../../../../src/ui/preact/mount';
import {
  DEFAULT_TTS_PLAYBACK_RATE,
  resolveTtsPlaybackRate,
} from '../../../../src/tts/playbackRate';
import {
  DEFAULT_TTS_VOLUME,
  resolveTtsVolumeLevel,
} from '../../../../src/tts/quietVolume';
import { GeneralPanel } from './GeneralPanel';
import dataSharingPortraitUrl from '../../../../src/popup/data-sharing-portrait.jpg';
import './general.css';

export class GeneralTab implements TabController {
  constructor(public container: HTMLElement) {}
  
  async init(): Promise<void> {
    // Render the panel with Preact, then wire the controls imperatively —
    // behaviour unchanged: the setup methods operate on the rendered DOM by id.
    mountInto(this.container, h(GeneralPanel, {}));

    // Resolve consent imagery before user may see it
    this.setConsentHeroImage();

    // Initialize components
    await this.setupSoundEffects();
    await this.setupQuietMode();
    await this.setupVoicePlayback();
    await this.setupAnalytics();
    await this.setupConsent();
    this.setupClearPreferences();
  }

  /**
   * Clean up when the tab is destroyed. Defensive — the orchestrator keeps tabs
   * mounted (init runs once), but unmount the Preact tree if it is ever called.
   */
  destroy(): void {
    unmountFrom(this.container);
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
  
  /**
   * Quiet/whisper mode (#437): a more sensitive VAD preset plus quieter TTS
   * playback, so the user can speak softly (e.g. around others). The content
   * script reacts live via the broadcast preference message.
   */
  private async setupQuietMode(): Promise<void> {
    const input = this.container.querySelector<HTMLInputElement>('#quiet-mode');
    if (!input) return;

    const value = await getStoredValue('quietMode', false);
    input.checked = value;
    if (value) input.parentElement?.classList.add('checked');

    input.addEventListener('change', async () => {
      try {
        await setStoredValue('quietMode', input.checked);
        input.parentElement?.classList.toggle('checked', input.checked);
        sendMessageToActiveTab({ quietMode: input.checked });
      } catch (error) {
        // Error already logged by setStoredValue; prevent unhandled rejection.
      }
    });
  }

  /**
   * Voice playback (#96 speed / #117 volume). Two sliders over the same
   * preference plumbing as the toggles: persist on `change` (not on every
   * `input` frame, which would hammer storage while dragging) and broadcast to
   * the open chat tab so it applies from its next utterance.
   */
  private async setupVoicePlayback(): Promise<void> {
    await this.setupRangePreference({
      inputId: 'tts-playback-rate',
      readoutId: 'tts-playback-rate-value',
      storageKey: 'ttsPlaybackRate',
      defaultValue: DEFAULT_TTS_PLAYBACK_RATE,
      resolve: resolveTtsPlaybackRate,
      format: (rate) =>
        `${new Intl.NumberFormat(undefined, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }).format(rate)}\u00d7`,
    });

    await this.setupRangePreference({
      inputId: 'tts-volume',
      readoutId: 'tts-volume-value',
      storageKey: 'ttsVolume',
      defaultValue: DEFAULT_TTS_VOLUME,
      resolve: resolveTtsVolumeLevel,
      format: (level) => `${level}%`,
    });
  }

  /**
   * Wire one numeric range preference: load, show, normalise, persist, publish.
   * Everything the slider emits goes through `resolve`, so neither the readout
   * nor storage can ever hold a value the audio path would reject.
   */
  private async setupRangePreference(options: {
    inputId: string;
    readoutId: string;
    storageKey: string;
    defaultValue: number;
    resolve: (value: unknown) => number;
    format: (value: number) => string;
  }): Promise<void> {
    const { inputId, readoutId, storageKey, defaultValue, resolve, format } = options;
    const input = this.container.querySelector<HTMLInputElement>(`#${inputId}`);
    if (!input) return;
    const readout = this.container.querySelector<HTMLElement>(`#${readoutId}`);

    const show = (value: number) => {
      input.value = String(value);
      if (readout) readout.textContent = format(value);
    };

    show(resolve(await getStoredValue(storageKey, defaultValue)));

    // Live feedback while dragging; storage only settles on release.
    input.addEventListener('input', () => {
      if (readout) readout.textContent = format(resolve(input.value));
    });

    input.addEventListener('change', async () => {
      const value = resolve(input.value);
      show(value);
      try {
        await setStoredValue(storageKey, value);
        sendMessageToActiveTab({ [storageKey]: value });
      } catch (error) {
        // Error already logged by setStoredValue; prevent unhandled rejection.
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
