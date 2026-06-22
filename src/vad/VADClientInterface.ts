/**
 * Common interface for VAD clients (both onscreen and offscreen implementations)
 * This ensures both clients provide the same API for the AudioInputMachine
 */

/**
 * #420 — Detail attached to a VAD misfire when it was the admission gate (not the
 * library) that dropped the segment. `reason` is prefixed `admission-gate:` so a
 * consumer can count gate drops separately from genuine non-speech misfires.
 */
export interface VADMisfireInfo {
  reason?: string;
  peakSpeechProb?: number;
  meanSpeechProb?: number;
  speechFrameCount?: number;
}

export interface VADClientCallbacks {
  onSpeechStart?: () => void;
  onSpeechEnd?: (data: {
    duration: number;
    audioBuffer: ArrayBuffer;
    captureTimestamp: number;
    clientReceiveTimestamp: number;
    // #420 — per-segment speech-probability stats from the VAD. Optional because not
    // every code path (older offscreen builds, some tests) supplies them.
    peakSpeechProb?: number;
    meanSpeechProb?: number;
    speechFrameCount?: number;
  }) => void;
  // #420 — onVADMisfire fires for both a library misfire (sub-minSpeechFrames blip,
  // no info) AND an admission-gate drop (info present: reason + the segment's stats),
  // so a dropped-real-speech regression is distinguishable from genuine non-speech.
  onVADMisfire?: (info?: VADMisfireInfo) => void;
  onError?: (error: string) => void;
  // Fired when another tab claims the single shared offscreen mic, displacing
  // this tab's VAD session. Offscreen VAD only — onscreen VAD is per-tab. (#320)
  onPreempted?: () => void;
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
  initialize(options?: any): Promise<{ success: boolean, error?: string, errorLong?: string, mode?: string }>;

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