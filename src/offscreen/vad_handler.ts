import { MicVAD, RealTimeVADOptions } from "@ricky0123/vad-web";
import { logger } from "../LoggingModule.js";
import { debounce } from "lodash";
import { incrementUsage, decrementUsage, resetUsageCounter, registerMessageHandler } from "./media_coordinator";

logger.log("[SayPi VAD Handler] Script loaded.");

/**
 * Logs message delays based on threshold values
 * @param captureTimestamp - When the audio was originally captured
 * @param description - Description of what's being measured
 */
function logMessageDelay(captureTimestamp: number, description: string = "message send"): void {
  const currentTime = Date.now();
  const delay = currentTime - captureTimestamp;
  
  if (delay > 500) {
    logger.warn(`[SayPi VAD Handler] High ${description} delay: ${delay}ms from capture to send`);
  } else if (delay > 200) {
    logger.info(`[SayPi VAD Handler] Elevated ${description} delay: ${delay}ms from capture to send`);
  }
}

interface MyRealTimeVADCallbacks {
  onSpeechStart?: () => any;
  onSpeechEnd?: (audio: Float32Array) => any;
  onVADMisfire?: () => any;
  onFrameProcessed?: (probabilities: { isSpeech: number; notSpeech: number }) => any;
}

let currentVadTabId: number | null = null;
let vadInstance: MicVAD | null = null;
let stream: MediaStream | null = null;
let speechStartTime = 0;

// Debounced sender for VAD frame events, max once per 100ms
const debouncedSendFrameProcessed = debounce(
  (probabilities: { isSpeech: number; notSpeech: number }) => {
    if (currentVadTabId !== null) {
      chrome.runtime.sendMessage({
        type: "VAD_FRAME_PROCESSED",
        probabilities,
        targetTabId: currentVadTabId,
        origin: "offscreen-document",
      });
    }
  },
  100
);

// Simplified VAD options: only event handlers and model
const vadOptions: Partial<RealTimeVADOptions> & MyRealTimeVADCallbacks = {
  model: "v5",
  onSpeechStart: () => {
    logger.debug("[SayPi VAD Handler] Speech started.");
    speechStartTime = Date.now();
    if (currentVadTabId !== null) {
      chrome.runtime.sendMessage({
        type: "VAD_SPEECH_START",
        targetTabId: currentVadTabId,
        origin: "offscreen-document",
      });
    }
  },
  onSpeechEnd: (rawAudioData: Float32Array) => {
    const speechStopTime = Date.now();
    const speechDuration = speechStopTime - speechStartTime;
    const frameCount = rawAudioData.length;
    const frameRate = 16000;
    const duration = frameCount / frameRate;
    console.debug(`[SayPi VAD Handler] Speech duration: ${speechDuration}ms, Frame count: ${frameCount}, Frame rate: ${frameRate}, Duration: ${duration}s`);
    logger.debug(`[SayPi VAD Handler] Speech ended. Duration: ${speechDuration}ms`);
    if (currentVadTabId !== null) {
      // Convert Float32Array to regular Array for proper serialization
      const audioArray = Array.from(rawAudioData);
      
      // Add precise timestamp of when audio was captured
      const captureTimestamp = speechStopTime;
      
      chrome.runtime.sendMessage({
        type: "VAD_SPEECH_END",
        duration: speechDuration,
        audioData: audioArray,
        frameCount: frameCount,
        captureTimestamp: captureTimestamp,
        targetTabId: currentVadTabId,
        origin: "offscreen-document",
      });
      
      // Log message sending delays if they exceed thresholds
      logMessageDelay(captureTimestamp);
    }
  },
  onVADMisfire: () => {
    logger.debug("[SayPi VAD Handler] VAD misfire.");
    if (currentVadTabId !== null) {
      chrome.runtime.sendMessage({
        type: "VAD_MISFIRE",
        targetTabId: currentVadTabId,
        origin: "offscreen-document",
      });
    }
  },
  onFrameProcessed: (probabilities: { isSpeech: number; notSpeech: number }) => {
    debouncedSendFrameProcessed(probabilities);
  },
};

// https://docs.vad.ricky0123.com/user-guide/browser/#bundling
const vadBundleOptions: Partial<RealTimeVADOptions> & MyRealTimeVADCallbacks = {
  baseAssetPath: chrome.runtime.getURL("public/"),
  onnxWASMBasePath: chrome.runtime.getURL("public/"),
};

async function initializeVAD() {
  if (vadInstance) {
    logger.log("[SayPi VAD Handler] VAD already initialized.");
    return { success: true, mode: "existing" };
  }
  try {
    logger.log("[SayPi VAD Handler] Initializing VAD with default options...");
    const mergedOptions = { ...vadOptions, ...vadBundleOptions };
    vadInstance = await MicVAD.new(mergedOptions);
    logger.log("[SayPi VAD Handler] MicVAD instance created.");
    return { success: true, mode: "default" };
  } catch (error: any) {
    logger.reportError(error, { function: 'initializeVAD' }, "VAD initialization failed");
    return { success: false, error: error.message || "VAD initialization error", mode: "failed" };
  }
}

async function startVAD(tabId: number) {
  currentVadTabId = tabId;
  incrementUsage('vad');
  
  if (!vadInstance) {
    const initResult = await initializeVAD();
    if (!initResult.success) {
      decrementUsage('vad');
      return initResult;
    }
  }
  try {
    if (vadInstance) {
      logger.log("[SayPi VAD Handler] Starting VAD...");
      vadInstance.start();
      return { success: true };
    }
    decrementUsage('vad');
    return { success: false, error: "VAD instance not available after init attempt." };
  } catch (error: any) {
    logger.reportError(error, { function: 'startVAD', tabId }, "Error starting VAD");
    decrementUsage('vad');
    return { success: false, error: error.message || "Unknown VAD start error" };
  }
}

async function stopVAD() {
  if (vadInstance) {
    try {
      logger.log("[SayPi VAD Handler] Stopping VAD...");
      vadInstance.pause(); // Use pause, or destroy if it's a full stop
      decrementUsage('vad');
      return { success: true };
    } catch (error: any) {
      logger.reportError(error, { function: 'stopVAD' }, "Error stopping VAD");
      return { success: false, error: error.message || "Unknown VAD stop error" };
    }
  }
  return { success: false, error: "VAD not initialized or already stopped." };
}

function destroyVAD() {
  logger.log("[SayPi VAD Handler] Destroying VAD...");
  if (vadInstance) {
    vadInstance.destroy();
    vadInstance = null;
  }
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
  currentVadTabId = null;
  resetUsageCounter('vad'); // Reset the counter completely
  
  return { success: true };
}

// Register VAD message handlers with the coordinator
registerMessageHandler("VAD_INITIALIZE_REQUEST", (message, sourceTabId) => {
  return initializeVAD();
});

registerMessageHandler("VAD_START_REQUEST", (message, sourceTabId) => {
  return startVAD(sourceTabId);
});

registerMessageHandler("VAD_STOP_REQUEST", (message, sourceTabId) => {
  return stopVAD();
});

registerMessageHandler("VAD_DESTROY_REQUEST", (message, sourceTabId) => {
  return destroyVAD();
});

logger.log("[SayPi VAD Handler] Message handlers registered."); 