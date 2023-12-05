import { getResourceUrl } from "./ResourceModule";

export interface INotificationsModule {
    listeningStopped: () => void;
  }
  
  class AudibleNotificationsModule implements INotificationsModule {
    private listeningSound: HTMLAudioElement = new Audio(getResourceUrl('audio/guitar-pluck.mp3'));  
    public listeningStopped(): void {
      this.listeningSound.play().catch(e => {
        console.error("Unable to play audio notification:", e);
      });
    }
  }
  
  export default AudibleNotificationsModule;
  