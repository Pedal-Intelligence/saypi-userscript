import type { MicVAD, RealTimeVADOptions } from "@ricky0123/vad-web";
import { createWarmMicVad, destroyMicVad, openVadAudio, releaseVadAudio, type VadAudio } from "./micStreamLifecycle";
import { configureSingleThreadedOrt } from "./ortRuntime";
import { logger } from '../LoggingModule';
import { VADStatusIndicator } from '../ui/VADStatusIndicator';
import getMessage from '../i18n';
import { debounce } from "../utils/debounce";
import { VADClientInterface, VADClientCallbacks } from './VADClientInterface';
import { getBrowserInfo, isFirefox } from '../UserAgentModule';
import { ChatbotIdentifier } from '../chatbots/ChatbotIdentifier';
import { VAD_CONFIGS, VADPreset } from "./VADConfigs";
import {
  SegmentStatsTracker,
  admitSegment,
  DEFAULT_ADMISSION_CONFIG,
} from "./segmentAdmission";

logger.debug("[SayPi OnscreenVADClient] Client loaded.");

/**
 * Logs processing delays based on threshold values
 * @param captureTimestamp - When the audio was originally captured
 * @param receiveTimestamp - When the client received the data
 * @param description - Description of what's being measured
 */
function logProcessingDelay(captureTimestamp: number, receiveTimestamp: number, description: string = "processing"): void {
  const delay = receiveTimestamp - captureTimestamp;
  
  if (delay > 500) {
    logger.warn(`[SayPi OnscreenVADClient] High ${description} delay: ${delay}ms from capture to client receipt`);
  } else if (delay > 200) {
    logger.info(`[SayPi OnscreenVADClient] Elevated ${description} delay: ${delay}ms from capture to client receipt`);
  }
}

/**
 * Creates a user-friendly error message for known incompatible browser/chatbot combinations
 * @param technicalError - The original technical error message
 * @param useShortVersion - Whether to return a short version suitable for transient notifications
 * @returns A user-friendly error message
 */
function createUserFriendlyVADError(technicalError: string, useShortVersion: boolean = false): string {
  const browserInfo = getBrowserInfo();
  const chatbotType = ChatbotIdentifier.identifyChatbot();
  const chatbotName = chatbotType === 'claude' ? 'Claude' : chatbotType === 'pi' ? 'Pi' : 'this chatbot';
  
  // Check for the known problematic combination: Mobile Chromium (like Kiwi) + Claude + "no available backend found"
  const isKnownIncompatibility = (
    browserInfo.name === 'Mobile Chromium' && 
    chatbotType === 'claude' && 
    technicalError.toLowerCase().includes('no available backend found')
  );
  
  if (isKnownIncompatibility) {
    // More specific browser name detection for the error message
    let browserName = browserInfo.name;
    if (browserInfo.name === 'Mobile Chromium' && browserInfo.isMobile) {
      // Check if it's specifically Kiwi Browser
      if (navigator.userAgent.includes('Kiwi')) {
        browserName = 'Kiwi Browser';
      } else {
        browserName = 'this mobile browser';
      }
    }
    
    const messageKey = useShortVersion ? 'vadErrorBrowserChatbotIncompatibleShort' : 'vadErrorBrowserChatbotIncompatible';
    return getMessage(messageKey, [browserName, chatbotName]);
  }
  
  // Check for other potential mobile compatibility issues
  if (browserInfo.isMobile && technicalError.toLowerCase().includes('backend')) {
    const messageKey = useShortVersion ? 'vadErrorMobileBrowserLimitedShort' : 'vadErrorMobileBrowserLimited';
    return getMessage(messageKey, useShortVersion ? undefined : chatbotName);
  }
  
  // Fallback to a more generic but still user-friendly message
  const messageKey = useShortVersion ? 'vadErrorBrowserNotSupportedShort' : 'vadErrorBrowserNotSupported';
  return getMessage(messageKey);
}

interface MyRealTimeVADCallbacks {
  onSpeechStart?: () => any;
  onSpeechEnd?: (audio: Float32Array) => any;
  onVADMisfire?: () => any;
  onFrameProcessed?: (probabilities: { isSpeech: number; notSpeech: number }) => any;
}

export class OnscreenVADClient implements VADClientInterface {
  private vadInstance: MicVAD | null = null;
  // Mic stream + AudioContext, opened at initialize and held until destroy, as before
  // vad-web 0.0.27 (see micStreamLifecycle).
  private vadAudio: VadAudio | null = null;
  private callbacks: VADClientCallbacks = {};
  private statusIndicator: VADStatusIndicator;
  private speechStartTime: number = 0;
  private isInitialized: boolean = false;
  private isStarted: boolean = false;
  private preset: VADPreset = "balanced";

  // #420 — accumulates each segment's speech-probability stats so the admission gate
  // (shared with the offscreen handler) can drop near-threshold non-speech.
  private statsTracker = new SegmentStatsTracker(VAD_CONFIGS.balanced.positiveSpeechThreshold!);

  // Debounced sender for VAD frame events, max once per 100ms
  private debouncedSendFrameProcessed = debounce(
    (probabilities: { isSpeech: number; notSpeech: number }) => {
      this.callbacks.onFrameProcessed?.(probabilities);
    },
    100
  );

  constructor() {
    logger.debug("[SayPi OnscreenVADClient] Constructor called.");
    this.statusIndicator = new VADStatusIndicator();
  }

  /**
   * The VAD event callbacks, shared by all three init strategies (primary / fallback /
   * minimal) which previously each carried an identical copy — the triplication was a
   * standing drift hazard and, after #420, the one place per-segment accumulation +
   * the admission gate must live. The strategies now differ ONLY in their asset-path /
   * model options.
   */
  private buildSegmentCallbacks(): MyRealTimeVADCallbacks {
    return {
      onSpeechStart: () => {
        logger.debug("[SayPi OnscreenVADClient] Speech started.");
        this.speechStartTime = Date.now();
        this.statsTracker.beginSegment();
        this.statusIndicator.updateStatus(getMessage('vadStatusListening'), getMessage('vadDetailSpeechDetected'));
        this.callbacks.onSpeechStart?.();
      },
      onSpeechEnd: (rawAudioData: Float32Array) => {
        const speechStopTime = Date.now();
        const speechDuration = speechStopTime - this.speechStartTime;
        // #420 — summarise the segment and run the admission gate before uploading.
        const stats = this.statsTracker.endSegment();
        const decision = admitSegment(stats, DEFAULT_ADMISSION_CONFIG);

        if (!decision.admit) {
          // A segment that never cleared the speech bar: treat it exactly like a VAD
          // misfire (non-speech) so it is never sent for transcription.
          logger.info(
            `[SayPi OnscreenVADClient] Admission gate dropped a segment (${decision.reason}): ` +
            `peak=${stats.peakSpeechProb.toFixed(3)}, mean=${stats.meanSpeechProb.toFixed(3)}, ` +
            `speechFrames=${stats.speechFrameCount}. Not uploading.`
          );
          // #420 — the audio WAS speech-like, just too faint to transcribe; show a
          // distinct detail rather than the self-contradictory "Non-speech audio detected".
          this.statusIndicator.updateStatus(getMessage('vadStatusMisfire'), getMessage('vadDetailAudioTooFaint'));
          setTimeout(() => this.statusIndicator.updateStatus(getMessage('vadStatusReady'), getMessage('vadDetailWaitingForSpeech')), 1500);
          this.callbacks.onVADMisfire?.({
            reason: `admission-gate:${decision.reason}`,
            peakSpeechProb: stats.peakSpeechProb,
            meanSpeechProb: stats.meanSpeechProb,
            speechFrameCount: stats.speechFrameCount,
          });
          return;
        }

        logger.debug(`[SayPi OnscreenVADClient] Speech ended. Duration: ${speechDuration}ms`);
        this.statusIndicator.updateStatus(getMessage('vadStatusProcessing'), getMessage('vadDetailSpeechEndedDuration', speechDuration.toString()));
        setTimeout(() => this.statusIndicator.updateStatus(getMessage('vadStatusReady'), getMessage('vadDetailWaitingForSpeech')), 1500);

        // In onscreen mode capture and receive timestamps are essentially the same.
        const captureTimestamp = speechStopTime;
        const clientReceiveTimestamp = Date.now();
        logProcessingDelay(captureTimestamp, clientReceiveTimestamp);

        // Ensure we pass a concrete ArrayBuffer (handle potential SharedArrayBuffer)
        const audioArrayBuffer = rawAudioData.buffer instanceof ArrayBuffer
          ? rawAudioData.buffer
          : rawAudioData.slice().buffer;
        this.callbacks.onSpeechEnd?.({
          duration: speechDuration,
          audioBuffer: audioArrayBuffer,
          captureTimestamp: captureTimestamp,
          clientReceiveTimestamp: clientReceiveTimestamp,
          // #420 — forward the per-segment speech-probability stats for observability.
          peakSpeechProb: stats.peakSpeechProb,
          meanSpeechProb: stats.meanSpeechProb,
          speechFrameCount: stats.speechFrameCount,
        });
      },
      onVADMisfire: () => {
        logger.debug("[SayPi OnscreenVADClient] VAD misfire.");
        this.statsTracker.reset();
        this.statusIndicator.updateStatus(getMessage('vadStatusMisfire'), getMessage('vadDetailNonSpeechAudioDetected'));
        setTimeout(() => this.statusIndicator.updateStatus(getMessage('vadStatusReady'), getMessage('vadDetailWaitingForSpeech')), 1500);
        this.callbacks.onVADMisfire?.();
      },
      onFrameProcessed: (probabilities: { isSpeech: number; notSpeech: number }) => {
        this.statsTracker.observe(probabilities.isSpeech);
        this.debouncedSendFrameProcessed(probabilities);
      },
    };
  }

  private getVADOptions(): Partial<RealTimeVADOptions> & MyRealTimeVADCallbacks {
    const presetConfig = VAD_CONFIGS[this.preset] || {};
    return {
      ...this.buildSegmentCallbacks(),
      ...presetConfig,
      // Assets sit at the extension root (WXT copies public/ there). ORT loads its `.mjs`
      // glue with import(), which RequestInterceptor's fetch rewrite can't redirect, so
      // this base must be right on its own (#655).
      baseAssetPath: chrome.runtime.getURL(""),
      onnxWASMBasePath: chrome.runtime.getURL(""),
      // Firefox can't run vad-web's AudioWorklet from a content script (addModule aborts,
      // and cross-realm frames fail its `instanceof ArrayBuffer` check). vad-web 0.0.24
      // caught that and fell back to ScriptProcessor, so that is what Firefox has always
      // used; 0.0.27+ no longer falls back, so ask for it explicitly (#655).
      processorType: isFirefox() ? "ScriptProcessor" : "auto",
      ortConfig: configureSingleThreadedOrt,
    } as Partial<RealTimeVADOptions> & MyRealTimeVADCallbacks;
  }

  public async initialize(options: { preset?: VADPreset } = {}): Promise<{ success: boolean, error?: string, errorLong?: string, mode?: string }> {
    if (this.isInitialized && this.vadInstance) {
      logger.debug("[SayPi OnscreenVADClient] VAD already initialized.");
      return { success: true, mode: "existing" };
    }

    this.statusIndicator.updateStatus(getMessage('vadStatusInitializing'), getMessage('vadDetailRequestingVADSetup'));
    
    if (options.preset && VAD_CONFIGS[options.preset]) {
      this.preset = options.preset;
    }

    // #420 — count speech frames against the active preset's positive threshold
    // (presets with no override fall back to vad-web's default bar).
    this.statsTracker.setPositiveSpeechThreshold(
      VAD_CONFIGS[this.preset].positiveSpeechThreshold!
    );

    const mode = "onscreen";
    try {
      logger.log("[SayPi OnscreenVADClient] Initializing VAD...");
      this.vadAudio = await openVadAudio();
      this.vadInstance = await createWarmMicVad(this.getVADOptions(), this.vadAudio);
      this.statsTracker.reset(); // drop any frames observed while warming the audio graph
      this.isInitialized = true;
      logger.log("[SayPi OnscreenVADClient] MicVAD instance created.");

      this.statusIndicator.updateStatus(getMessage('vadStatusReady'), getMessage('vadDetailInitializedMode', mode));
      this.callbacks.onInitialized?.(true, undefined, mode);
      return { success: true, mode };
    } catch (error: any) {
      this.releaseInstance();
      logger.reportError(error, { function: 'OnscreenVADClient.initialize' }, "VAD initialization failed");

      // Create user-friendly error messages for known compatibility issues
      const userFriendlyErrorLong = createUserFriendlyVADError(error.message || "Unknown error", false);
      const userFriendlyErrorShort = createUserFriendlyVADError(error.message || "Unknown error", true);
      const detail = getMessage('vadDetailInitError', userFriendlyErrorLong);
      this.statusIndicator.updateStatus(getMessage('vadStatusFailed'), detail);

      // Use the long version for the VAD status; the short one is for notifications.
      this.callbacks.onInitialized?.(false, userFriendlyErrorLong);
      return { success: false, error: userFriendlyErrorShort, errorLong: userFriendlyErrorLong, mode: "failed" };
    }
  }

  public async start(): Promise<{ success: boolean, error?: string }> {
    if (!this.vadInstance || !this.isInitialized) {
      const error = "VAD not initialized. Call initialize() first.";
      this.callbacks.onStarted?.(false, error);
      return { success: false, error };
    }

    if (this.isStarted) {
      logger.debug("[SayPi OnscreenVADClient] VAD already started.");
      this.callbacks.onStarted?.(true);
      return { success: true };
    }

    this.statusIndicator.updateStatus(getMessage('vadStatusStarting'), getMessage('vadDetailActivatingMicrophone'));
    
    try {
      logger.log("[SayPi OnscreenVADClient] Starting VAD...");
      // The graph was built at initialize (createWarmMicVad), so this only reconnects the held
      // stream; it is async since vad-web 0.0.27, so await it to catch a failure.
      await this.vadInstance.start();
      this.isStarted = true;
      
      this.statusIndicator.updateStatus(getMessage('vadStatusReady'), getMessage('vadDetailWaitingForSpeech'));
      
      // Call the callback if it exists
      this.callbacks.onStarted?.(true);
      
      return { success: true };
    } catch (error: any) {
      logger.reportError(error, { function: 'OnscreenVADClient.start' }, "Error starting VAD");
      // Don't keep an instance that failed to start; the next initialize() rebuilds it.
      this.releaseInstance();
      
      const detail = getMessage('vadDetailStartError', error.message || "Unknown error");
      this.statusIndicator.updateStatus(getMessage('vadStatusFailed'), detail);
      
      // Call the callback if it exists
      this.callbacks.onStarted?.(false, error.message || "Unknown VAD start error");
      
      return { success: false, error: error.message || "Unknown VAD start error" };
    }
  }

  public async stop(): Promise<{ success: boolean, error?: string }> {
    if (!this.vadInstance) {
      const error = "VAD not initialized.";
      this.callbacks.onStopped?.(false, error);
      return { success: false, error };
    }

    if (!this.isStarted) {
      logger.debug("[SayPi OnscreenVADClient] VAD already stopped.");
      this.callbacks.onStopped?.(true);
      return { success: true };
    }

    this.statusIndicator.updateStatus(getMessage('vadStatusStopping'), getMessage('vadDetailDeactivatingMicrophone'));
    
    try {
      logger.log("[SayPi OnscreenVADClient] Stopping VAD...");
      await this.vadInstance.pause(); // keeps the mic open (heldAudioOptions); destroy releases it
      // #420 — pause() with submitUserSpeechOnPause:false fires no callback, so an
      // in-flight segment's tracker state would otherwise persist; reset it so the
      // "idle between segments" invariant holds even if a call stops mid-utterance.
      this.statsTracker.reset();
      this.isStarted = false;
      
      this.statusIndicator.updateStatus(getMessage('vadStatusStopped'), getMessage('vadDetailVADProcessingStopped'));
      setTimeout(() => this.statusIndicator.updateStatus(getMessage('vadStatusReady'), getMessage('vadDetailWaitingForSpeech')), 1500);
      
      // Call the callback if it exists
      this.callbacks.onStopped?.(true);
      
      return { success: true };
    } catch (error: any) {
      logger.reportError(error, { function: 'OnscreenVADClient.stop' }, "Error stopping VAD");
      
      const detail = getMessage('vadDetailStopError', error.message || "Unknown error");
      this.statusIndicator.updateStatus(getMessage('vadStatusFailed'), detail);
      
      // Call the callback if it exists
      this.callbacks.onStopped?.(false, error.message || "Unknown VAD stop error");
      
      return { success: false, error: error.message || "Unknown VAD stop error" };
    }
  }

  /** Destroy the VAD instance and release the mic and AudioContext it ran on. */
  private releaseInstance(): void {
    if (this.vadInstance) {
      void destroyMicVad(this.vadInstance, (error) =>
        logger.warn("[SayPi OnscreenVADClient] MicVAD.destroy failed", error)
      );
      this.vadInstance = null;
    }
    releaseVadAudio(this.vadAudio);
    this.vadAudio = null;
    this.statsTracker.reset(); // #420 — don't carry segment state across a destroy
    this.isInitialized = false;
    this.isStarted = false;
  }

  public destroy(): void {
    this.statusIndicator.updateStatus(getMessage('vadStatusShuttingDown'), getMessage('vadDetailReleasingVADResources'));
    
    logger.log("[SayPi OnscreenVADClient] Destroying VAD...");
    
    this.releaseInstance();
    
    this.statusIndicator.updateStatus(getMessage('vadStatusDestroyed'), getMessage('vadDetailVADServiceShutdown'));
    setTimeout(() => this.statusIndicator.hide(), 2000);
  }

  // Register VAD event callbacks - same interface as OffscreenVADClient
  public on(eventName: keyof VADClientCallbacks, callback: Function): void {
    // @ts-ignore
    this.callbacks[eventName] = callback;
  }
} 
