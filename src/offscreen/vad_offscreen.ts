import { MicVAD, RealTimeVADOptions } from "@ricky0123/vad-web";
import { logger } from "../LoggingModule.js"; // Import the enhanced logger
import { debounce } from "lodash";
// If getResourceUrl or similar is needed from another module, import it.
// For now, we assume paths will be relative or constructed via chrome.runtime.getURL()

logger.log("[SayPi VAD Offscreen] Script loaded.");

/**
 * Logs message delays based on threshold values
 * @param captureTimestamp - When the audio was originally captured
 * @param description - Description of what's being measured
 */
function logMessageDelay(captureTimestamp: number, description: string = "message send"): void {
  const currentTime = Date.now();
  const delay = currentTime - captureTimestamp;
  
  if (delay > 500) {
    logger.warn(`[SayPi VAD Offscreen] High ${description} delay: ${delay}ms from capture to send`);
  } else if (delay > 200) {
    logger.info(`[SayPi VAD Offscreen] Elevated ${description} delay: ${delay}ms from capture to send`);
  }
}

interface MyRealTimeVADCallbacks {
  onSpeechStart?: () => any;
  onSpeechEnd?: (audio: Float32Array) => any;
  onVADMisfire?: () => any;
  onFrameProcessed?: (probabilities: { isSpeech: number; notSpeech: number }) => any;
}

let currentActiveTabId: number | null = null;
let vadInstance: MicVAD | null = null;
let stream: MediaStream | null = null;
let speechStartTime = 0;

// Debounced sender for VAD frame events, max once per 100ms
const debouncedSendFrameProcessed = debounce(
  (probabilities: { isSpeech: number; notSpeech: number }) => {
    if (currentActiveTabId !== null) {
      chrome.runtime.sendMessage({
        type: "VAD_FRAME_PROCESSED",
        probabilities,
        targetTabId: currentActiveTabId,
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
    logger.debug("[SayPi VAD Offscreen] Speech started.");
    speechStartTime = Date.now();
    if (currentActiveTabId !== null) {
      chrome.runtime.sendMessage({
        type: "VAD_SPEECH_START",
        targetTabId: currentActiveTabId,
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
    console.debug(`[SayPi VAD Offscreen] Speech duration: ${speechDuration}ms, Frame count: ${frameCount}, Frame rate: ${frameRate}, Duration: ${duration}s`);
    logger.debug(`[SayPi VAD Offscreen] Speech ended. Duration: ${speechDuration}ms`);
    if (currentActiveTabId !== null) {
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
        targetTabId: currentActiveTabId,
        origin: "offscreen-document",
      });
      
      // Log message sending delays if they exceed thresholds
      logMessageDelay(captureTimestamp);
    }
  },
  onVADMisfire: () => {
    logger.debug("[SayPi VAD Offscreen] VAD misfire.");
    if (currentActiveTabId !== null) {
      chrome.runtime.sendMessage({
        type: "VAD_MISFIRE",
        targetTabId: currentActiveTabId,
        origin: "offscreen-document",
      });
    }
  },
  onFrameProcessed: (probabilities: { isSpeech: number; notSpeech: number }) => {
    debouncedSendFrameProcessed(probabilities);
  },
};

async function initializeVAD() {
  if (vadInstance) {
    logger.log("[SayPi VAD Offscreen] VAD already initialized.");
    return { success: true, mode: "existing" };
  }
  try {
    logger.log("[SayPi VAD Offscreen] Initializing VAD with default options...");
    vadInstance = await MicVAD.new(vadOptions);
    logger.log("[SayPi VAD Offscreen] MicVAD instance created.");
    return { success: true, mode: "default" };
  } catch (error: any) {
    logger.reportError(error, { function: 'initializeVAD' }, "VAD initialization failed");
    return { success: false, error: error.message || "VAD initialization error", mode: "failed" };
  }
}

async function startVAD(tabId: number) {
  currentActiveTabId = tabId;
  if (!vadInstance) {
    const initResult = await initializeVAD();
    if (!initResult.success) {
      return initResult;
    }
  }
  try {
    if (vadInstance) {
      logger.log("[SayPi VAD Offscreen] Starting VAD...");
      vadInstance.start();
      return { success: true };
    }
    return { success: false, error: "VAD instance not available after init attempt." };
  } catch (error: any) {
    logger.reportError(error, { function: 'startVAD', tabId }, "Error starting VAD");
    return { success: false, error: error.message || "Unknown VAD start error" };
  }
}

async function stopVAD() {
  if (vadInstance) {
    try {
      logger.log("[SayPi VAD Offscreen] Stopping VAD...");
      vadInstance.pause(); // Use pause, or destroy if it's a full stop
      return { success: true };
    } catch (error: any) {
      logger.reportError(error, { function: 'stopVAD' }, "Error stopping VAD");
      return { success: false, error: error.message || "Unknown VAD stop error" };
    }
  }
  return { success: false, error: "VAD not initialized or already stopped." };
}

function destroyVAD() {
  logger.log("[SayPi VAD Offscreen] Destroying VAD...");
  if (vadInstance) {
    vadInstance.destroy();
    vadInstance = null;
  }
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
  currentActiveTabId = null;
  return { success: true };
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Ensure messages are from the background script or an expected internal source if any
  // sender.id is the extension ID. For messages from background, sender.url might be undefined or background script URL
  // We are expecting messages forwarded by background.js which will have `message.origin === 'content-script'`
  // and `message.sourceTabId`
  if (message.origin !== "content-script" || message.sourceTabId === undefined) {
    // console.debug("[SayPi VAD Offscreen] Ignoring message not from content script via background:", message);
    return;
  }

  if(message.type !== "VAD_FRAME_PROCESSED") {
    // frame processed messages are too chatty, so we don't log them
    logger.debug("[SayPi VAD Offscreen] Received message from background:", message);
  }
  const { type, options, sourceTabId } = message; // `sourceTabId` is the original tabId from content script
  let promise: Promise<any> | null = null;

  switch (type) {
    case "VAD_INITIALIZE_REQUEST":
      promise = initializeVAD();
      break;
    case "VAD_START_REQUEST":
      promise = startVAD(sourceTabId);
      break;
    case "VAD_STOP_REQUEST":
      promise = stopVAD();
      break;
    case "VAD_DESTROY_REQUEST":
      // No async operation here, just a direct call
      sendResponse(destroyVAD()); 
      return false; // Indicate synchronous response for this specific case if sendResponse is used directly
    default:
      logger.warn("[SayPi VAD Offscreen] Unknown message type received:", type);
      sendResponse({ success: false, error: "Unknown message type" });
      return false;
  }

  if (promise) {
    promise.then(response => {
      // Send response back to the originating content script via background
      chrome.runtime.sendMessage({
        type: `OFFSCREEN_${type}_RESPONSE`,
        payload: response,
        targetTabId: sourceTabId, // ensure this is the original tabId
        origin: "offscreen-document",
      });
    }).catch(error => {
      logger.reportError(error, { function: 'onMessage Listener', messageType: type, tabId: sourceTabId }, "Error processing VAD request");
      chrome.runtime.sendMessage({
        type: `OFFSCREEN_${type}_ERROR`,
        payload: { success: false, error: error.message || "Unhandled promise rejection" },
        targetTabId: sourceTabId,
        origin: "offscreen-document",
      });
    });
    return true; // Indicate that sendResponse will be called asynchronously
  }
  return false; // Default to synchronous if no promise was handled
}); 