import { getResourceUrl } from "./ResourceModule";

export interface INotificationsModule {
    listeningStopped: () => void;
    listeningTimeRemaining?: (timeRemaining: number) => void;
  }
  
  export class AudibleNotificationsModule implements INotificationsModule {
    private listeningSound: HTMLAudioElement = new Audio(getResourceUrl('audio/guitar-pluck.mp3'));  
    public listeningStopped(): void {
      this.listeningSound.play().catch(e => {
        console.error("Unable to play audio notification:", e);
      });
    }
  }
  
  export class VisualNotificationsModule implements INotificationsModule {
    private ring: SVGCircleElement | null = document.getElementById('progress-ring') as SVGCircleElement | null;

    private startCountdown(secondsRemaining: number) {
      if (!this.ring) {
        this.ring = document.getElementById('progress-ring') as SVGCircleElement | null;
      }
      if (!this.ring) {
        console.error("Unable to find progress ring element");
        return;
      }
      const circumference = this.ring?.getTotalLength();
      this.ring.style.strokeDasharray = `${circumference} ${circumference}`;
      this.ring.style.strokeDashoffset = `${circumference}`;
      this.ring.style.animation = `fillup ${secondsRemaining}s linear forwards, changeColor ${secondsRemaining}s linear forwards`;

      // Add the active class to start the animation
      this.ring.classList.add('active');
    }
    
    private cancelCountdown() {
      if (!this.ring) {
        this.ring = document.getElementById('progress-ring') as SVGCircleElement | null;
      }
      if (!this.ring) {
        console.error("Unable to find progress ring element");
        return;
      }
      // Stop the progress ring animation and reset it
      this.ring.classList.remove('active');
      void this.ring.style.strokeDasharray
      void this.ring.style.strokeDashoffset;
      this.ring.style.animation = 'none';
    }
    
    public listeningStopped(): void {
      this.cancelCountdown();
    }

    public listeningTimeRemaining(timeRemaining: number) {
      this.cancelCountdown();
      this.startCountdown(timeRemaining);
    }
  }
  
