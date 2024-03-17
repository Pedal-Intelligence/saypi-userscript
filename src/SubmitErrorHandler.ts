import { setFinalPrompt } from "./TranscriptionModule";
import AudioControlsModule from "./audio/AudioControlsModule";

interface RestorePoint {
  prompt: string;
  audioInputEnabled: boolean;
  audioOutputEnabled: boolean;
  creationTime: string;
}

interface RestorePointAutoDate {
  prompt: string;
  audioInputEnabled: boolean;
  audioOutputEnabled: boolean;
}

export default class SubmitErrorHandler {
  private restorePointKey: string;
  private audioOutputStatus: boolean = false;
  private audioControls: AudioControlsModule = new AudioControlsModule();

  constructor() {
    // Initialise properties if needed
    this.restorePointKey = "restorePoint";
  }

  initAudioOutputListener(): void {
    const audioOutputButton = document.getElementById(
      "saypi-audio-output-button"
    );
    if (audioOutputButton) {
      audioOutputButton.addEventListener(
        "click",
        this.handleAudioOutputClick.bind(this)
      );
    }
  }

  // Event handler
  private handleAudioOutputClick(): void {
    this.audioOutputStatus = !this.audioOutputStatus; // Toggle the state
  }

  // 1. Detect when a submit error occurs
  detectSubmitError(): boolean {
    const submitButton = document.getElementById(
      "saypi-submitButton"
    ) as HTMLButtonElement | null;
    const textarea = document.getElementById(
      "saypi-prompt"
    ) as HTMLTextAreaElement | null;
    if (submitButton && textarea) {
      if (submitButton.disabled && textarea.value.length > 0) {
        return true;
      }
    }
    return false;
  }

  // 2. Create a "restore point" capturing application state
  createRestorePoint({
    prompt: message,
    audioInputEnabled: audioInputStatus,
    audioOutputEnabled: audioOutputStatus,
  }: RestorePointAutoDate): void {
    const restorePoint: RestorePoint = {
      prompt: message,
      audioInputEnabled: audioInputStatus,
      audioOutputEnabled: audioOutputStatus,
      creationTime: new Date().toISOString(),
    };
    localStorage.setItem(this.restorePointKey, JSON.stringify(restorePoint));
  }

  // 3. Programmatically reload the page
  reloadPage(): void {
    window.location.reload();
  }

  handleSubmitError(): void {
    const textarea = document.getElementById(
      "saypi-prompt"
    ) as HTMLTextAreaElement | null;
    const prompt = textarea ? textarea.value : "";

    let audioInputStatus = true;
    const callButton = document.getElementById("saypi-callButton");
    if (callButton) {
      audioInputStatus = callButton.classList.contains("active");
    }

    console.log("Creating restore point");
    this.createRestorePoint({
      prompt: prompt,
      audioInputEnabled: audioInputStatus,
      audioOutputEnabled: this.audioOutputStatus,
    });
    console.log("Reloading page");
    this.reloadPage();
  }

  // 4. On load, check for a restore point
  checkForRestorePoint(): void {
    const storedData = localStorage.getItem(this.restorePointKey);
    if (storedData) {
      const restorePoint: RestorePoint = JSON.parse(storedData);
      const currentTime = new Date();
      const restoreTime = new Date(restorePoint.creationTime);

      const timeDifference =
        (currentTime.getTime() - restoreTime.getTime()) / (1000 * 60); // in minutes

      if (timeDifference <= 5) {
        console.log("Restoring application state", restorePoint);
        setFinalPrompt(restorePoint.prompt);
        setTimeout(() => {
          this.audioControls.activateAudioInput(restorePoint.audioInputEnabled);
        }, 0); // activation of the audio input needs to happen asynchronously to avoid race condition
        this.audioControls.activateAudioOutput(restorePoint.audioOutputEnabled);
        // Delete the executed restore point
        localStorage.removeItem(this.restorePointKey);
      }
    }
  }
}

// Singleton
export const submitErrorHandler = new SubmitErrorHandler();
