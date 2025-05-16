import EventBus from '../events/EventBus';
import { logger } from '../LoggingModule';
import { VADStatusIndicator } from '../ui/VADStatusIndicator';
import getMessage from '../i18n';

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
          this.statusIndicator.updateStatus(getMessage('vadStatusListening'), getMessage('vadDetailSpeechDetected'));
          this.callbacks.onSpeechStart?.();
          break;
        case "VAD_SPEECH_END":
          this.statusIndicator.updateStatus(getMessage('vadStatusProcessing'), getMessage('vadDetailSpeechEndedDuration', message.duration.toString()));
          setTimeout(() => this.statusIndicator.updateStatus(getMessage('vadStatusReady'), getMessage('vadDetailWaitingForSpeech')), 1500);
          
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
          this.statusIndicator.updateStatus(getMessage('vadStatusMisfire'), getMessage('vadDetailNonSpeechAudioDetected'));
          setTimeout(() => this.statusIndicator.updateStatus(getMessage('vadStatusReady'), getMessage('vadDetailWaitingForSpeech')), 1500);
          this.callbacks.onVADMisfire?.();
          break;
        case "VAD_FRAME_PROCESSED":
          this.callbacks.onFrameProcessed?.(message.probabilities);
          break;
        case "VAD_ERROR":
          this.statusIndicator.updateStatus(getMessage('vadStatusError'), message.error || getMessage('vadDetailUnknownVADError'));
          this.callbacks.onError?.(message.error || getMessage('vadDetailUnknownVADError'));
          break;
        case "OFFSCREEN_VAD_INITIALIZE_REQUEST_RESPONSE":
          if (message.payload.success) {
            const mode = message.payload.mode;
            const detailMessage = mode && mode !== 'N/A' ? getMessage('vadDetailInitializedMode', mode) : getMessage('vadDetailInitializedModeNA');
            this.statusIndicator.updateStatus(getMessage('vadStatusReady'), detailMessage);
          } else {
            const detail = message.payload.error ? getMessage('vadDetailInitError', message.payload.error) : getMessage('vadDetailInitErrorUnknown');
            this.statusIndicator.updateStatus(getMessage('vadStatusFailed'), detail);
          }
          this.callbacks.onInitialized?.(message.payload.success, message.payload.error, message.payload.mode);
          break;
        case "OFFSCREEN_VAD_INITIALIZE_REQUEST_ERROR":
            const initPromiseErrorDetail = message.payload.error ? getMessage('vadDetailInitError', message.payload.error) : getMessage('vadDetailInitErrorPromise');
            this.statusIndicator.updateStatus(getMessage('vadStatusFailed'), initPromiseErrorDetail);
            this.callbacks.onInitialized?.(false, message.payload.error || getMessage('vadDetailInitErrorPromise'));
            break;
        case "OFFSCREEN_VAD_START_REQUEST_RESPONSE":
          if (message.payload.success) {
            this.statusIndicator.updateStatus(getMessage('vadStatusReady'), getMessage('vadDetailWaitingForSpeech'));
          } else {
            const detail = message.payload.error ? getMessage('vadDetailStartError', message.payload.error) : getMessage('vadDetailStartErrorUnknown');
            this.statusIndicator.updateStatus(getMessage('vadStatusFailed'), detail);
          }
          this.callbacks.onStarted?.(message.payload.success, message.payload.error);
          break;
        case "OFFSCREEN_VAD_START_REQUEST_ERROR":
            const startPromiseErrorDetail = message.payload.error ? getMessage('vadDetailStartError', message.payload.error) : getMessage('vadDetailStartErrorPromise');
            this.statusIndicator.updateStatus(getMessage('vadStatusFailed'), startPromiseErrorDetail);
            this.callbacks.onStarted?.(false, message.payload.error || getMessage('vadDetailStartErrorPromise'));
            break;
        case "OFFSCREEN_VAD_STOP_REQUEST_RESPONSE":
          if (message.payload.success) {
            this.statusIndicator.updateStatus(getMessage('vadStatusStopped'), getMessage('vadDetailVADProcessingStopped'));
            setTimeout(() => this.statusIndicator.updateStatus(getMessage('vadStatusReady'), getMessage('vadDetailWaitingForSpeech')), 1500);
          } else {
            const detail = message.payload.error ? getMessage('vadDetailStopError', message.payload.error) : getMessage('vadDetailStopErrorUnknown');
            this.statusIndicator.updateStatus(getMessage('vadStatusFailed'), detail);
          }
          this.callbacks.onStopped?.(message.payload.success, message.payload.error);
          break;
        case "OFFSCREEN_VAD_STOP_REQUEST_ERROR":
            const stopPromiseErrorDetail = message.payload.error ? getMessage('vadDetailStopError', message.payload.error) : getMessage('vadDetailStopErrorPromise');
            this.statusIndicator.updateStatus(getMessage('vadStatusFailed'), stopPromiseErrorDetail);
            this.callbacks.onStopped?.(false, message.payload.error || getMessage('vadDetailStopErrorPromise'));
            break;
        case "OFFSCREEN_VAD_DESTROY_REQUEST_RESPONSE":
          this.statusIndicator.updateStatus(getMessage('vadStatusDestroyed'), getMessage('vadDetailVADServiceShutdown'));
          console.log("[SayPi OffscreenVADClient] VAD destroyed in offscreen:", message.payload);
          break;
        default:
          console.warn("[SayPi OffscreenVADClient] Received unknown message type:", message.type);
      }
    });

    this.port.onDisconnect.addListener(() => {
      console.warn("[SayPi OffscreenVADClient] Port disconnected from background script.");
      this.statusIndicator.updateStatus(getMessage('vadStatusError'), getMessage('vadDetailVADServiceDisconnected'));
      this.isPortConnected = false;
      this.callbacks.onError?.(getMessage('vadDetailVADServiceDisconnected'));
    });
  }

  private sendMessage(message: any): void {
    if (this.isPortConnected && this.port) {
      try {
        this.port.postMessage(message);
      } catch (error: any) {
        console.error("[SayPi OffscreenVADClient] Error posting message to port:", error, message);
        this.statusIndicator.updateStatus(getMessage('vadStatusError'), getMessage('vadDetailCommLinkFailed'));
        this.callbacks.onError?.(getMessage('vadDetailCommLinkFailed'));
        if (error.message.includes("Attempting to use a disconnected port object")) {
            this.isPortConnected = false;
        }
      }
    } else {
      console.error("[SayPi OffscreenVADClient] Port not connected. Cannot send message:", message);
      this.statusIndicator.updateStatus(getMessage('vadStatusError'), getMessage('vadDetailVADServiceNotConnected'));
      this.callbacks.onError?.(getMessage('vadDetailVADServiceNotConnected'));
    }
  }

  public initialize(options: any = {}): Promise<{ success: boolean, error?: string, mode?: string }> {
    // If port is not connected or doesn't exist, establish a new connection
    if (!this.port || !this.isPortConnected) {
      console.log("[SayPi OffscreenVADClient] Port was disconnected or not initialized. Reconnecting...");
      try {
        this.port = chrome.runtime.connect({ name: "vad-content-script-connection" });
        this.isPortConnected = true;
        this.setupListeners(); // Re-attach listeners to the new port
        console.log("[SayPi OffscreenVADClient] New port established and listeners set up.");
      } catch (e) {
        console.error("[SayPi OffscreenVADClient] Failed to re-establish port connection:", e);
        this.statusIndicator.updateStatus(getMessage('vadStatusError'), getMessage('vadDetailFailedToReconnectVADService'));
        // Immediately reject the promise if port cannot be re-established
        return Promise.resolve({ success: false, error: getMessage('vadDetailFailedToReconnectVADService') });
      }
    }

    this.statusIndicator.updateStatus(getMessage('vadStatusInitializing'), getMessage('vadDetailRequestingVADSetup'));
    return new Promise((resolve) => {
      this.callbacks.onInitialized = (success, error, mode) => resolve({ success, error, mode });
      this.sendMessage({ type: "VAD_INITIALIZE_REQUEST", options });
    });
  }

  public start(): Promise<{ success: boolean, error?: string }> {
    this.statusIndicator.updateStatus(getMessage('vadStatusStarting'), getMessage('vadDetailActivatingMicrophone'));
    return new Promise((resolve) => {
      this.callbacks.onStarted = (success, error) => resolve({ success, error });
      this.sendMessage({ type: "VAD_START_REQUEST" });
    });
  }

  public stop(): Promise<{ success: boolean, error?: string }> {
    this.statusIndicator.updateStatus(getMessage('vadStatusStopping'), getMessage('vadDetailDeactivatingMicrophone'));
    return new Promise((resolve) => {
      this.callbacks.onStopped = (success, error) => resolve({ success, error });
      this.sendMessage({ type: "VAD_STOP_REQUEST" });
    });
  }

  public destroy(): void {
    this.statusIndicator.updateStatus(getMessage('vadStatusShuttingDown'), getMessage('vadDetailReleasingVADResources'));
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