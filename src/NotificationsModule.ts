import { UserPreferenceModule } from "./prefs/PreferenceModule";
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
  private notificationElement: HTMLElement | null = document.getElementById(
    "saypi-notification"
  ) as HTMLElement | null;

  public autoSubmitEnabled = () => {
    this.showNotification(getMessage("autoSubmitEnabled"));
  };

  public autoSubmitDisabled = () => {
    this.showNotification(getMessage("autoSubmitDisabled"));
  };

  public showNotification(message: string, iconName?: string) {
    this.showNotificationForSeconds(message, 5, iconName);
  }

  private init() {
    if (
      !this.notificationElement ||
      !document.body.contains(this.notificationElement)
    ) {
      this.notificationElement = document.getElementById(
        "saypi-notification"
      ) as HTMLElement | null;
    }
    if (!this.notificationElement) {
      const notificationElement = document.createElement("p");
      notificationElement.id = "saypi-notification";
      notificationElement.classList.add("text-notification");
      document.body.appendChild(notificationElement);
      this.notificationElement = notificationElement;

      // hide notification when clicked
      this.notificationElement.addEventListener("click", () => {
        this.hideNotification();
      });
    }
  }

  private _showNotification(message: string, iconName?: string) {
    this.init();
    // dismiss any existing notification
    this.hideNotification();
    // show new notification
    this.notificationElement!.classList.add("active");
    if (iconName) {
      const iconElement = document.createElement("img");
      iconElement.classList.add("icon");
      const iconImageUrl = getResourceUrl(`icons/${iconName}.svg`);
      iconElement.src = iconImageUrl;
      this.notificationElement?.appendChild(iconElement);
    }
    const notificationText = document.createElement("span");
    notificationText.textContent = message;
    this.notificationElement!.appendChild(notificationText);
  }

  public hideNotification() {
    this.init();
    this.notificationElement!.classList.remove("active");
    // remove any child elements
    while (this.notificationElement!.firstChild) {
      this.notificationElement!.removeChild(
        this.notificationElement!.firstChild
      );
    }
  }

  private showNotificationForSeconds(
    message: string,
    seconds: number,
    iconName?: string
  ) {
    this._showNotification(message, iconName);
    setTimeout(() => {
      this.hideNotification();
    }, seconds * 1000);
  }
}

export class AudibleNotificationsModule implements INotificationsModule {
  private static instance: AudibleNotificationsModule;
  private listeningSound: HTMLAudioElement;
  private callStartedSound: HTMLAudioElement;
  private callFailedSound: HTMLAudioElement;
  private callEndedSound: HTMLAudioElement;
  private lockSound: HTMLAudioElement;
  private unlockSound: HTMLAudioElement;
  private themeOnSound: HTMLAudioElement;
  private themeOffSound: HTMLAudioElement;

  private userPreferences: UserPreferenceModule;

  private constructor(userPreferences: UserPreferenceModule) {
    // Load audio resources in the constructor
    this.listeningSound = new Audio(
      getResourceUrl("audio/send-round-short.mp3")
    );
    this.listeningSound.preload = "auto"; // short track, so load the audio file as soon as possible
    this.callStartedSound = new Audio(
      getResourceUrl("audio/startup-synth.mp3")
    );
    this.callFailedSound = new Audio(getResourceUrl("audio/call-failed.mp3"));
    this.callEndedSound = new Audio(getResourceUrl("audio/turn-off.mp3"));
    this.lockSound = new Audio(getResourceUrl("audio/beep-on.mp3"));
    this.unlockSound = new Audio(getResourceUrl("audio/beep-off.mp3"));
    this.themeOnSound = new Audio(getResourceUrl("audio/switch-on.mp3"));
    this.themeOffSound = new Audio(getResourceUrl("audio/switch-off.mp3"));

    this.userPreferences = userPreferences;
  }

  public static getInstance(): AudibleNotificationsModule {
    if (!AudibleNotificationsModule.instance) {
      AudibleNotificationsModule.instance = new AudibleNotificationsModule(
        UserPreferenceModule.getInstance()
      );
    }
    return AudibleNotificationsModule.instance;
  }

  private async playSound(sound: HTMLAudioElement) {
    const soundEnabled = await this.userPreferences.getSoundEffects();
    if (soundEnabled) {
      sound.play().catch((e) => {
        if (e.name === "NotAllowedError") {
          // Inform the user to enable audio permissions or trigger from a click
          console.error(
            `Audio playback blocked on ${sound.src} notification. Please initiate audio from a user interaction.`
          );
        } else {
          console.error("Unable to play audio notification:", e);
        }
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

  public callFailed(): void {
    this.playSound(this.callFailedSound);
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

  public themeOn(): void {
    this.playSound(this.themeOnSound);
  }

  public themeOff(): void {
    this.playSound(this.themeOffSound);
  }
}

export class VisualNotificationsModule implements INotificationsModule {
  private ring: SVGCircleElement | null = document.getElementById(
    "progress-ring"
  ) as SVGCircleElement | null;
  private callButton: HTMLElement | null = document.getElementById(
    "saypi-callButton"
  ) as HTMLElement | null;

  /**
   * The ring and call button elements may not be available until after the extension is loaded.
   * This method will attempt to find them and set them if they are not already set.
   */
  private init() {
    if (!this.ring || !document.body.contains(this.ring)) {
      this.ring = document.getElementById(
        "progress-ring"
      ) as SVGCircleElement | null;
    }
    if (!this.callButton || !document.body.contains(this.callButton)) {
      this.callButton = document.getElementById(
        "saypi-callButton"
      ) as HTMLElement | null;
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
    this.ring.classList.add("active");
  }

  private stopRingAnimation() {
    if (!this.ring) {
      console.error("Unable to find progress ring element");
      return;
    }
    this.ring.classList.remove("active");
    //      void this.ring.style.strokeDasharray;
    //      void this.ring.style.strokeDashoffset;
    //      this.ring.style.animation = 'none';
  }

  private startGlowFade(secondsRemaining: number) {
    if (!this.callButton) {
      console.error("Unable to find call button element");
      return;
    }
    this.callButton.classList.remove("glow");
    this.callButton.classList.add("glow-fade-out");
    this.callButton.style.animationDuration = `${secondsRemaining}s`;
    //this.callButton.style.animationTimingFunction = 'ease-out !important';
  }

  private stopGlowFade() {
    if (!this.callButton) {
      console.error("Unable to find call button element");
      return;
    }
    this.callButton.classList.remove("glow-fade-out");
    this.callButton.style.animationDuration = "1.5s"; // reset to default glow duration - see neon.scss for source definition
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
