
import { UserPreferenceModule } from './prefs/PreferenceModule';
import { getResourceUrl } from "./ResourceModule";
import getMessage from "./i18n";

export interface INotificationsModule {
    listeningStopped?: () => void;
    listeningTimeRemaining?: (timeRemaining: number) => void;
    callStarted?: () => void;
    callEnded?: () => void;
    lockScreen?: () => void;
    unlockScreen?: () => void;
    autoSubmitEnabled?: () => void;
    autoSubmitDisabled?: () => void;
  }

  export class TextualNotificationsModule implements INotificationsModule {
    private notificationElement: HTMLElement | null = document.getElementById('saypi-notification-text') as HTMLElement | null;

    public autoSubmitEnabled = () => {
      this.showNotification(
        getMessage("autoSubmitEnabled")
      );
    }

    public autoSubmitDisabled = () => {
      this.showNotification(
        getMessage("autoSubmitDisabled")
      );
    }

    private init() {
      if (!this.notificationElement || !document.body.contains(this.notificationElement)) {
        this.notificationElement = document.getElementById('saypi-notification-text') as HTMLElement | null;
      }
      if (!this.notificationElement) {
        const notificationElement = document.createElement('p');
        notificationElement.id = 'saypi-notification';
        notificationElement.classList.add('saypi-notification-text');
        document.body.appendChild(notificationElement);
        this.notificationElement = notificationElement;
      }
    }

    private showNotification(message: string) {
      this.init();
      this.notificationElement!.textContent = message;
      this.notificationElement!.classList.add('active');
    }
  }
  
  export class AudibleNotificationsModule implements INotificationsModule {
    private listeningSound: HTMLAudioElement = new Audio(getResourceUrl('audio/guitar-pluck.mp3'));
    private callStartedSound: HTMLAudioElement = new Audio(getResourceUrl('audio/startup-synth.mp3'));
    private callEndedSound: HTMLAudioElement = new Audio(getResourceUrl('audio/turn-off.mp3'));
    private lockSound: HTMLAudioElement = new Audio(getResourceUrl('audio/beep-on.mp3'));
    private unlockSound: HTMLAudioElement = new Audio(getResourceUrl('audio/beep-off.mp3'));
    
    private async playSound(sound: HTMLAudioElement) {
      const soundEnabled = await UserPreferenceModule.getSoundEffects();
      if (soundEnabled) {
        sound.play().catch(e => {
          console.error("Unable to play audio notification:", e);
        });
      } else {
        console.debug("Sound effects disabled");
      }

    }

    public listeningStopped(): void {
      this.playSound(this.listeningSound);
    }

    public callStarted(): void {
      this.playSound(this.callStartedSound);
    }

    public callEnded(): void {
      this.playSound(this.callEndedSound);
    }

    public lockScreen(): void {
      this.playSound(this.lockSound);
    }

    public unlockScreen(): void {
      this.playSound(this.unlockSound);
    }
  }
  
  export class VisualNotificationsModule implements INotificationsModule {
    private ring: SVGCircleElement | null = document.getElementById('progress-ring') as SVGCircleElement | null;
    private callButton: HTMLElement | null = document.getElementById('saypi-callButton') as HTMLElement | null;
  
    /**
     * The ring and call button elements may not be available until after the extension is loaded.
     * This method will attempt to find them and set them if they are not already set.
     */
    private init() {
      if (!this.ring || !document.body.contains(this.ring)) {
        this.ring = document.getElementById('progress-ring') as SVGCircleElement | null;
      }
      if (!this.callButton || !document.body.contains(this.callButton)) {
        this.callButton = document.getElementById('saypi-callButton') as HTMLElement | null;
      }
    }

    private startCountdown(secondsRemaining: number) {
      this.startRingAnimation(secondsRemaining);
      this.startGlowFade(secondsRemaining);
    }
  
    private cancelCountdown() {
      this.stopRingAnimation();
      this.stopGlowFade();
    }
  
    private startRingAnimation(secondsRemaining: number) {
      if (!this.ring) {
        console.error("Unable to find progress ring element");
        return;
      }
      const circumference = this.ring.getTotalLength();
      this.ring.style.strokeDasharray = `${circumference} ${circumference}`;
      this.ring.style.strokeDashoffset = `${circumference}`;
      this.ring.style.animationDuration = `${secondsRemaining}s`;
      //this.ring.style.animation = `fillup ${secondsRemaining}s linear forwards, changeColor ${secondsRemaining}s linear forwards`;
      this.ring.classList.add('active');
    }
  
    private stopRingAnimation() {
      if (!this.ring) {
        console.error("Unable to find progress ring element");
        return;
      }
      this.ring.classList.remove('active');
//      void this.ring.style.strokeDasharray;
//      void this.ring.style.strokeDashoffset;
//      this.ring.style.animation = 'none';
    }
  
    private startGlowFade(secondsRemaining: number) {
      if (!this.callButton) {
        console.error("Unable to find call button element");
        return;
      }
      this.callButton.classList.remove('glow')
      this.callButton.classList.add('glow-fade-out');
      this.callButton.style.animationDuration = `${secondsRemaining}s`;
      //this.callButton.style.animationTimingFunction = 'ease-out !important';
    }
  
    private stopGlowFade() {
      if (!this.callButton) {
        console.error("Unable to find call button element");
        return;
      }
      this.callButton.classList.remove('glow-fade-out');
      this.callButton.style.animationDuration = '1.5s'; // reset to default glow duration - see neon.scss for source definition
      //void this.callButton.style.animationTimingFunction;
    }
  
    public listeningStopped(): void {
      this.init();
      this.cancelCountdown();
    }
  
    public listeningTimeRemaining(timeRemaining: number) {
      this.init();
      this.cancelCountdown();
      this.startCountdown(timeRemaining);
    }
  }
  
