/**
 * Common interface for VAD clients (both onscreen and offscreen implementations)
 * This ensures both clients provide the same API for the AudioInputMachine
 */

export interface VADClientCallbacks {
  onSpeechStart?: () => void;
  onSpeechEnd?: (data: { 
    duration: number; 
    audioBuffer: ArrayBuffer; 
    captureTimestamp: number; 
    clientReceiveTimestamp: number 
  }) => void;
  onVADMisfire?: () => void;
  onError?: (error: string) => void;
  onFrameProcessed?: (probabilities: { isSpeech: number; notSpeech: number }) => void;
  onInitialized?: (success: boolean, error?: string, mode?: string) => void;
  onStarted?: (success: boolean, error?: string) => void;
  onStopped?: (success: boolean, error?: string) => void;
}

export interface VADClientInterface {
  /**
   * Initialize the VAD client with optional configuration
   * @param options - Configuration options for VAD initialization
   * @returns Promise resolving to initialization result
   */
  initialize(options?: any): Promise<{ success: boolean, error?: string, mode?: string }>;

  /**
   * Start VAD processing (begin listening for speech)
   * @returns Promise resolving to start result
   */
  start(): Promise<{ success: boolean, error?: string }>;

  /**
   * Stop VAD processing (stop listening for speech)
   * @returns Promise resolving to stop result
   */
  stop(): Promise<{ success: boolean, error?: string }>;

  /**
   * Destroy the VAD client and clean up resources
   */
  destroy(): void;

  /**
   * Register event callbacks for VAD events
   * @param eventName - Name of the event to listen for
   * @param callback - Callback function to execute when event occurs
   */
  on(eventName: keyof VADClientCallbacks, callback: Function): void;
} 