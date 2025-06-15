import { MicVAD, RealTimeVADOptions } from "@ricky0123/vad-web";
import { logger } from '../LoggingModule';
import { VADStatusIndicator } from '../ui/VADStatusIndicator';
import getMessage from '../i18n';
import { debounce } from "lodash";
import { VADClientInterface, VADClientCallbacks } from './VADClientInterface';
import { getBrowserInfo } from '../UserAgentModule';
import { ChatbotIdentifier } from '../chatbots/ChatbotIdentifier';
import { VAD_CONFIGS, VADPreset } from "./VADConfigs";

console.log("[SayPi OnscreenVADClient] Client loaded.");

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
  private callbacks: VADClientCallbacks = {};
  private statusIndicator: VADStatusIndicator;
  private speechStartTime: number = 0;
  private isInitialized: boolean = false;
  private isStarted: boolean = false;
  private preset: VADPreset = "balanced";

  // Debounced sender for VAD frame events, max once per 100ms
  private debouncedSendFrameProcessed = debounce(
    (probabilities: { isSpeech: number; notSpeech: number }) => {
      this.callbacks.onFrameProcessed?.(probabilities);
    },
    100
  );

  constructor() {
    console.log("[SayPi OnscreenVADClient] Constructor called.");
    this.statusIndicator = new VADStatusIndicator();
  }

  private getVADOptions(): Partial<RealTimeVADOptions> & MyRealTimeVADCallbacks {
    // Base VAD options without asset paths (similar to offscreen implementation)
    const presetConfig = VAD_CONFIGS[this.preset] || {};
    const baseOptions = {
      model: "v5" as const,
      onSpeechStart: () => {
        logger.debug("[SayPi OnscreenVADClient] Speech started.");
        this.speechStartTime = Date.now();
        this.statusIndicator.updateStatus(getMessage('vadStatusListening'), getMessage('vadDetailSpeechDetected'));
        this.callbacks.onSpeechStart?.();
      },
      onSpeechEnd: (rawAudioData: Float32Array) => {
        const speechStopTime = Date.now();
        const speechDuration = speechStopTime - this.speechStartTime;
        const frameCount = rawAudioData.length;
        const frameRate = 16000;
        const duration = frameCount / frameRate;
        
        console.debug(`[SayPi OnscreenVADClient] Speech duration: ${speechDuration}ms, Frame count: ${frameCount}, Frame rate: ${frameRate}, Duration: ${duration}s`);
        logger.debug(`[SayPi OnscreenVADClient] Speech ended. Duration: ${speechDuration}ms`);
        
        this.statusIndicator.updateStatus(getMessage('vadStatusProcessing'), getMessage('vadDetailSpeechEndedDuration', speechDuration.toString()));
        setTimeout(() => this.statusIndicator.updateStatus(getMessage('vadStatusReady'), getMessage('vadDetailWaitingForSpeech')), 1500);
        
        // Add precise timestamp of when audio was captured
        const captureTimestamp = speechStopTime;
        const clientReceiveTimestamp = Date.now(); // In onscreen mode, this is essentially the same
        
        // Log processing delays only if they exceed thresholds
        logProcessingDelay(captureTimestamp, clientReceiveTimestamp);

        // Pass the Float32Array's buffer as ArrayBuffer (same as OffscreenVADClient)
        this.callbacks.onSpeechEnd?.({ 
          duration: speechDuration, 
          audioBuffer: rawAudioData.buffer,
          captureTimestamp: captureTimestamp,
          clientReceiveTimestamp: clientReceiveTimestamp
        });
      },
      onVADMisfire: () => {
        logger.debug("[SayPi OnscreenVADClient] VAD misfire.");
        this.statusIndicator.updateStatus(getMessage('vadStatusMisfire'), getMessage('vadDetailNonSpeechAudioDetected'));
        setTimeout(() => this.statusIndicator.updateStatus(getMessage('vadStatusReady'), getMessage('vadDetailWaitingForSpeech')), 1500);
        this.callbacks.onVADMisfire?.();
      },
      onFrameProcessed: (probabilities: { isSpeech: number; notSpeech: number }) => {
        this.debouncedSendFrameProcessed(probabilities);
      },
    };

    // Bundle options for asset paths (separate like in offscreen implementation)
    const bundleOptions = {
      baseAssetPath: chrome.runtime.getURL("public/"),
      onnxWASMBasePath: chrome.runtime.getURL("public/"),
    };

    // Merge options (same pattern as offscreen implementation)
    return {
      ...baseOptions,
      ...presetConfig,
      ...bundleOptions,
    } as Partial<RealTimeVADOptions> & MyRealTimeVADCallbacks;
  }

  private getFallbackVADOptions(): Partial<RealTimeVADOptions> & MyRealTimeVADCallbacks {
    // Fallback options with minimal configuration but still with asset paths
    const presetConfig = VAD_CONFIGS[this.preset] || {};
    return {
      model: "v5" as const,
      baseAssetPath: chrome.runtime.getURL("public/"),
      ...presetConfig,
      onSpeechStart: () => {
        logger.debug("[SayPi OnscreenVADClient] Speech started (fallback)");
        this.speechStartTime = Date.now();
        this.statusIndicator.updateStatus(getMessage('vadStatusListening'), getMessage('vadDetailSpeechDetected'));
        this.callbacks.onSpeechStart?.();
      },
      onSpeechEnd: (rawAudioData: Float32Array) => {
        const speechStopTime = Date.now();
        const speechDuration = speechStopTime - this.speechStartTime;
        
        logger.debug(`[SayPi OnscreenVADClient] Speech ended (fallback). Duration: ${speechDuration}ms`);
        
        this.statusIndicator.updateStatus(getMessage('vadStatusProcessing'), getMessage('vadDetailSpeechEndedDuration', speechDuration.toString()));
        setTimeout(() => this.statusIndicator.updateStatus(getMessage('vadStatusReady'), getMessage('vadDetailWaitingForSpeech')), 1500);
        
        const captureTimestamp = speechStopTime;
        const clientReceiveTimestamp = Date.now();
        
        logProcessingDelay(captureTimestamp, clientReceiveTimestamp);

        this.callbacks.onSpeechEnd?.({ 
          duration: speechDuration, 
          audioBuffer: rawAudioData.buffer,
          captureTimestamp: captureTimestamp,
          clientReceiveTimestamp: clientReceiveTimestamp
        });
      },
      onVADMisfire: () => {
        logger.debug("[SayPi OnscreenVADClient] VAD misfire (fallback)");
        this.statusIndicator.updateStatus(getMessage('vadStatusMisfire'), getMessage('vadDetailNonSpeechAudioDetected'));
        setTimeout(() => this.statusIndicator.updateStatus(getMessage('vadStatusReady'), getMessage('vadDetailWaitingForSpeech')), 1500);
        this.callbacks.onVADMisfire?.();
      },
      onFrameProcessed: (probabilities: { isSpeech: number; notSpeech: number }) => {
        this.debouncedSendFrameProcessed(probabilities);
      },
    } as Partial<RealTimeVADOptions> & MyRealTimeVADCallbacks;
  }

  private getMinimalVADOptions(): Partial<RealTimeVADOptions> & MyRealTimeVADCallbacks {
    // Minimal options - no custom paths, legacy model, let VAD use defaults
    const presetConfig = VAD_CONFIGS[this.preset] || {};
    return {
      ...presetConfig,
      onSpeechStart: () => {
        logger.debug("[SayPi OnscreenVADClient] Speech started (minimal)");
        this.speechStartTime = Date.now();
        this.statusIndicator.updateStatus(getMessage('vadStatusListening'), getMessage('vadDetailSpeechDetected'));
        this.callbacks.onSpeechStart?.();
      },
      onSpeechEnd: (rawAudioData: Float32Array) => {
        const speechStopTime = Date.now();
        const speechDuration = speechStopTime - this.speechStartTime;
        
        logger.debug(`[SayPi OnscreenVADClient] Speech ended (minimal). Duration: ${speechDuration}ms`);
        
        this.statusIndicator.updateStatus(getMessage('vadStatusProcessing'), getMessage('vadDetailSpeechEndedDuration', speechDuration.toString()));
        setTimeout(() => this.statusIndicator.updateStatus(getMessage('vadStatusReady'), getMessage('vadDetailWaitingForSpeech')), 1500);
        
        const captureTimestamp = speechStopTime;
        const clientReceiveTimestamp = Date.now();
        
        logProcessingDelay(captureTimestamp, clientReceiveTimestamp);

        this.callbacks.onSpeechEnd?.({ 
          duration: speechDuration, 
          audioBuffer: rawAudioData.buffer,
          captureTimestamp: captureTimestamp,
          clientReceiveTimestamp: clientReceiveTimestamp
        });
      },
      onVADMisfire: () => {
        logger.debug("[SayPi OnscreenVADClient] VAD misfire (minimal)");
        this.statusIndicator.updateStatus(getMessage('vadStatusMisfire'), getMessage('vadDetailNonSpeechAudioDetected'));
        setTimeout(() => this.statusIndicator.updateStatus(getMessage('vadStatusReady'), getMessage('vadDetailWaitingForSpeech')), 1500);
        this.callbacks.onVADMisfire?.();
      },
      onFrameProcessed: (probabilities: { isSpeech: number; notSpeech: number }) => {
        this.debouncedSendFrameProcessed(probabilities);
      },
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
    
    // Progressive fallback strategy for VAD initialization
    const fallbackStrategies = [
      {
        name: "primary",
        options: this.getVADOptions()
      },
      {
        name: "fallback",
        options: this.getFallbackVADOptions()
      },
      {
        name: "minimal",
        options: this.getMinimalVADOptions()
      }
    ];

    for (const strategy of fallbackStrategies) {
      try {
        logger.log(`[SayPi OnscreenVADClient] Attempting VAD initialization with ${strategy.name} strategy...`);
        this.vadInstance = await MicVAD.new(strategy.options);
        this.isInitialized = true;
        
        logger.log(`[SayPi OnscreenVADClient] MicVAD instance created using ${strategy.name} strategy.`);
        
        const mode = `onscreen-${strategy.name}`;
        const detailMessage = getMessage('vadDetailInitializedMode', mode);
        this.statusIndicator.updateStatus(getMessage('vadStatusReady'), detailMessage);
        
        // Call the callback if it exists
        this.callbacks.onInitialized?.(true, undefined, mode);
        
        return { success: true, mode };
      } catch (error: any) {
        logger.warn(`[SayPi OnscreenVADClient] ${strategy.name} strategy failed: ${error.message}`);
        
        // If this is the last strategy, report the error
        if (strategy === fallbackStrategies[fallbackStrategies.length - 1]) {
          logger.reportError(error, { function: 'OnscreenVADClient.initialize' }, "All VAD initialization strategies failed");
          
          // Create user-friendly error messages for known compatibility issues
          const userFriendlyErrorLong = createUserFriendlyVADError(error.message || "Unknown error", false);
          const userFriendlyErrorShort = createUserFriendlyVADError(error.message || "Unknown error", true);
          const detail = getMessage('vadDetailInitError', userFriendlyErrorLong);
          this.statusIndicator.updateStatus(getMessage('vadStatusFailed'), detail);
          
          // Call the callback if it exists (use long version for VAD status)
          this.callbacks.onInitialized?.(false, userFriendlyErrorLong);
          
          // Return both versions - the short one will be used for
          //  notifications
          return { success: false, error: userFriendlyErrorShort, errorLong: userFriendlyErrorLong, mode: "failed" };
        }
        
        // Continue to next strategy
        continue;
      }
    }

    // This should never be reached, but just in case
    return { success: false, error: "All initialization strategies exhausted", mode: "failed" };
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
      this.vadInstance.start();
      this.isStarted = true;
      
      this.statusIndicator.updateStatus(getMessage('vadStatusReady'), getMessage('vadDetailWaitingForSpeech'));
      
      // Call the callback if it exists
      this.callbacks.onStarted?.(true);
      
      return { success: true };
    } catch (error: any) {
      logger.reportError(error, { function: 'OnscreenVADClient.start' }, "Error starting VAD");
      
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
      this.vadInstance.pause(); // Use pause, same as offscreen implementation
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

  public destroy(): void {
    this.statusIndicator.updateStatus(getMessage('vadStatusShuttingDown'), getMessage('vadDetailReleasingVADResources'));
    
    logger.log("[SayPi OnscreenVADClient] Destroying VAD...");
    
    if (this.vadInstance) {
      this.vadInstance.destroy();
      this.vadInstance = null;
    }
    
    this.isInitialized = false;
    this.isStarted = false;
    
    this.statusIndicator.updateStatus(getMessage('vadStatusDestroyed'), getMessage('vadDetailVADServiceShutdown'));
    setTimeout(() => this.statusIndicator.hide(), 2000);
  }

  // Register VAD event callbacks - same interface as OffscreenVADClient
  public on(eventName: keyof VADClientCallbacks, callback: Function): void {
    // @ts-ignore
    this.callbacks[eventName] = callback;
  }
} 