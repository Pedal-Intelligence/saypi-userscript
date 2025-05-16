import EventBus from '../events/EventBus';
import { logger } from '../LoggingModule';
import { VADStatusIndicator } from '../ui/VADStatusIndicator';

console.log("[SayPi OffscreenVADClient] Client loaded.");

/**
 * Logs transfer delays based on threshold values
 * @param captureTimestamp - When the audio was originally captured
 * @param receiveTimestamp - When the client received the data
 * @param description - Description of what's being measured
 */
function logTransferDelay(captureTimestamp: number, receiveTimestamp: number, description: string = "transfer"): void {
  const delay = receiveTimestamp - captureTimestamp;
  
  if (delay > 500) {
    logger.warn(`[SayPi OffscreenVADClient] High ${description} delay: ${delay}ms from capture to client receipt`);
  } else if (delay > 200) {
    logger.info(`[SayPi OffscreenVADClient] Elevated ${description} delay: ${delay}ms from capture to client receipt`);
  }
}

interface VADClientCallbacks {
  onSpeechStart?: () => void;
  onSpeechEnd?: (data: { duration: number; audioBuffer: ArrayBuffer; captureTimestamp: number; clientReceiveTimestamp: number }) => void;
  onVADMisfire?: () => void;
  onError?: (error: string) => void;
  onFrameProcessed?: (probabilities: { isSpeech: number; notSpeech: number }) => void;
  onInitialized?: (success: boolean, error?: string, mode?: string) => void;
  onStarted?: (success: boolean, error?: string) => void;
  onStopped?: (success: boolean, error?: string) => void;
}

export class OffscreenVADClient {
  private port: chrome.runtime.Port;
  private callbacks: VADClientCallbacks = {};
  private isPortConnected: boolean = true;
  private statusIndicator: VADStatusIndicator;

  constructor() {
    console.log("[SayPi OffscreenVADClient] Constructor called.");
    this.port = chrome.runtime.connect({ name: "vad-content-script-connection" });
    console.log("[SayPi OffscreenVADClient] Port established?", this.port);
    this.statusIndicator = new VADStatusIndicator();
    this.setupListeners();
  }

  private setupListeners(): void {
    this.port.onMessage.addListener((message: any) => {
      const receiveTimestamp = Date.now();
      
      if(message.type !== "VAD_FRAME_PROCESSED") {
        // frame processed messages are too chatty, so we don't log them
        console.debug("[SayPi OffscreenVADClient] Received message from background:", message);
      }
      if (message.origin !== "offscreen-document") {
        // console.warn("[SayPi OffscreenVADClient] Ignoring message not from offscreen document via background:", message);
        return;
      }

      switch (message.type) {
        case "VAD_SPEECH_START":
          this.statusIndicator.updateStatus("Listening", "Speech detected");
          this.callbacks.onSpeechStart?.();
          break;
        case "VAD_SPEECH_END":
          this.statusIndicator.updateStatus("Processing", `Speech ended (duration: ${message.duration}ms)`);
          setTimeout(() => this.statusIndicator.updateStatus("Ready", "Waiting for speech"), 1500);
          
          const speechDuration = message.duration;
          const captureTimestamp = message.captureTimestamp || 0;
          const transferDelay = receiveTimestamp - captureTimestamp;
          
          // Convert the array back to Float32Array
          const rawAudioData = new Float32Array(message.audioData || []);
          const frameCount = message.frameCount || rawAudioData.length;
          const frameRate = 16000;
          const duration = frameCount / frameRate;
          
          // Only log basic information at debug level
          console.debug(`[SayPi OffscreenVADClient] Speech duration: ${speechDuration}ms, Frame count: ${frameCount}, Frame rate: ${frameRate}, Duration: ${duration}s`);
          
          // Log transfer delays only if they exceed thresholds
          logTransferDelay(captureTimestamp, receiveTimestamp);

          // Pass the reconstructed Float32Array's buffer as ArrayBuffer
          this.callbacks.onSpeechEnd?.({ 
            duration: message.duration, 
            audioBuffer: rawAudioData.buffer,
            captureTimestamp: captureTimestamp,
            clientReceiveTimestamp: receiveTimestamp
          });
          break;
        case "VAD_MISFIRE":
          this.statusIndicator.updateStatus("Misfire", "Non-speech audio detected");
          setTimeout(() => this.statusIndicator.updateStatus("Ready", "Waiting for speech"), 1500);
          this.callbacks.onVADMisfire?.();
          break;
        case "VAD_FRAME_PROCESSED":
          this.callbacks.onFrameProcessed?.(message.probabilities);
          break;
        case "VAD_ERROR":
          this.statusIndicator.updateStatus("Error", message.error || "Unknown VAD error");
          this.callbacks.onError?.(message.error || "Unknown VAD error from offscreen");
          break;
        case "OFFSCREEN_VAD_INITIALIZE_REQUEST_RESPONSE":
          if (message.payload.success) {
            this.statusIndicator.updateStatus("Ready", `Initialized (Mode: ${message.payload.mode || 'N/A'})`);
          } else {
            this.statusIndicator.updateStatus("Failed", `Init Error: ${message.payload.error || 'Unknown'}`);
          }
          this.callbacks.onInitialized?.(message.payload.success, message.payload.error, message.payload.mode);
          break;
        case "OFFSCREEN_VAD_INITIALIZE_REQUEST_ERROR":
            this.statusIndicator.updateStatus("Failed", `Init Error: ${message.payload.error || 'Promise error'}`);
            this.callbacks.onInitialized?.(false, message.payload.error || "Initialization promise error");
            break;
        case "OFFSCREEN_VAD_START_REQUEST_RESPONSE":
          if (message.payload.success) {
            // Status will be updated to Listening by VAD_SPEECH_START if successful
            // this.statusIndicator.updateStatus("Starting..."); 
            this.statusIndicator.updateStatus("Ready", "Waiting for speech");
          } else {
            this.statusIndicator.updateStatus("Failed", `Start Error: ${message.payload.error || 'Unknown'}`);
          }
          this.callbacks.onStarted?.(message.payload.success, message.payload.error);
          break;
        case "OFFSCREEN_VAD_START_REQUEST_ERROR":
            this.statusIndicator.updateStatus("Failed", `Start Error: ${message.payload.error || 'Promise error'}`);
            this.callbacks.onStarted?.(false, message.payload.error || "Start promise error");
            break;
        case "OFFSCREEN_VAD_STOP_REQUEST_RESPONSE":
          if (message.payload.success) {
            this.statusIndicator.updateStatus("Stopped", "VAD processing stopped.");
            setTimeout(() => this.statusIndicator.updateStatus("Ready", "Waiting for speech"), 1500);
          } else {
            this.statusIndicator.updateStatus("Failed", `Stop Error: ${message.payload.error || 'Unknown'}`);
          }
          this.callbacks.onStopped?.(message.payload.success, message.payload.error);
          break;
        case "OFFSCREEN_VAD_STOP_REQUEST_ERROR":
            this.statusIndicator.updateStatus("Failed", `Stop Error: ${message.payload.error || 'Promise error'}`);
            this.callbacks.onStopped?.(false, message.payload.error || "Stop promise error");
            break;
        case "OFFSCREEN_VAD_DESTROY_REQUEST_RESPONSE":
          this.statusIndicator.updateStatus("Destroyed", "VAD service shut down.");
          console.log("[SayPi OffscreenVADClient] VAD destroyed in offscreen:", message.payload);
          break;
        default:
          console.warn("[SayPi OffscreenVADClient] Received unknown message type:", message.type);
      }
    });

    this.port.onDisconnect.addListener(() => {
      console.warn("[SayPi OffscreenVADClient] Port disconnected from background script.");
      this.statusIndicator.updateStatus("Error", "VAD service disconnected. Try reloading.");
      this.isPortConnected = false;
      this.callbacks.onError?.("VAD service disconnected. Please try reloading.");
    });
  }

  private sendMessage(message: any): void {
    if (this.isPortConnected && this.port) {
      try {
        this.port.postMessage(message);
      } catch (error: any) {
        console.error("[SayPi OffscreenVADClient] Error posting message to port:", error, message);
        this.statusIndicator.updateStatus("Error", "Communication link failed.");
        this.callbacks.onError?.("Error communicating with VAD service.");
        if (error.message.includes("Attempting to use a disconnected port object")) {
            this.isPortConnected = false;
        }
      }
    } else {
      console.error("[SayPi OffscreenVADClient] Port not connected. Cannot send message:", message);
      this.statusIndicator.updateStatus("Error", "VAD service not connected. Try reloading.");
      this.callbacks.onError?.("VAD service not connected. Please try reloading.");
    }
  }

  public initialize(options: any = {}): Promise<{ success: boolean, error?: string, mode?: string }> {
    this.statusIndicator.updateStatus("Initializing", "Requesting VAD setup...");
    return new Promise((resolve) => {
      this.callbacks.onInitialized = (success, error, mode) => resolve({ success, error, mode });
      this.sendMessage({ type: "VAD_INITIALIZE_REQUEST", options });
    });
  }

  public start(): Promise<{ success: boolean, error?: string }> {
    this.statusIndicator.updateStatus("Starting", "Activating microphone...");
    return new Promise((resolve) => {
      this.callbacks.onStarted = (success, error) => resolve({ success, error });
      this.sendMessage({ type: "VAD_START_REQUEST" });
    });
  }

  public stop(): Promise<{ success: boolean, error?: string }> {
    this.statusIndicator.updateStatus("Stopping", "Deactivating microphone...");
    return new Promise((resolve) => {
      this.callbacks.onStopped = (success, error) => resolve({ success, error });
      this.sendMessage({ type: "VAD_STOP_REQUEST" });
    });
  }

  public destroy(): void {
    this.statusIndicator.updateStatus("Shutting down", "Releasing VAD resources...");
    this.sendMessage({ type: "VAD_DESTROY_REQUEST" });
    if (this.isPortConnected && this.port) {
        try {
            this.port.disconnect();
        } catch (e) {
            console.warn("[SayPi OffscreenVADClient] Error during explicit port disconnect:", e);
        }
    }
    this.isPortConnected = false;
    setTimeout(() => this.statusIndicator.hide(), 2000);
  }

  // Register VAD event callbacks
  public on(eventName: keyof VADClientCallbacks, callback: Function): void {
    // Register VAD event callback unconditionally
    // @ts-ignore
    this.callbacks[eventName] = callback;
  }
} 