import { MicVAD, RealTimeVADOptions } from "@ricky0123/vad-web";
import { convertToWavBlob } from "../audio/AudioEncoder"; // Assuming this is needed for onSpeechEnd
import { logger } from "../LoggingModule.js"; // Import the enhanced logger
// If getResourceUrl or similar is needed from another module, import it.
// For now, we assume paths will be relative or constructed via chrome.runtime.getURL()

logger.log("[SayPi VAD Offscreen] Script loaded.");

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

// Function to get resource URLs within the extension package
function getExtensionFileUrl(relativePath: string): string {
  return chrome.runtime.getURL(relativePath);
}

const commonMicVADOptions: Partial<RealTimeVADOptions> & MyRealTimeVADCallbacks = {
  // model: "v5", // This will be default if not specified, or can be explicit
  ortConfig: (ort: any) => {
    // Paths need to be accessible from the extension's root
    // The files are in `public/` folder as per manifest.json web_accessible_resources
    ort.env.wasm.wasmPaths = {
      'ort-wasm.wasm': getExtensionFileUrl('public/ort-wasm.wasm'),
      'ort-wasm-simd.wasm': getExtensionFileUrl('public/ort-wasm-simd.wasm'),
      'ort-wasm-threaded.wasm': getExtensionFileUrl('public/ort-wasm-threaded.wasm'),
      'ort-wasm-simd-threaded.wasm': getExtensionFileUrl('public/ort-wasm-simd-threaded.wasm'),
    };
    ort.env.wasm.numThreads = 1;
    ort.env.wasm.simd = false; // Start with SIMD false for broader compatibility, can be true if issues are resolved.
    logger.debug("[SayPi VAD Offscreen] ORT config applied:", ort.env.wasm.wasmPaths);
  },
  positiveSpeechThreshold: 0.8,
  minSpeechFrames: 3,
  preSpeechPadFrames: 10,
  model: "v5",
  //workletURL: getExtensionFileUrl('public/vad.worklet.bundle.min.js'), // Consider browser detection for .js vs .min.js if needed
  // modelURL: getExtensionFileUrl('public/silero_vad.onnx'), // Ensure this path is correct and model is web_accessible

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
    const audioBlob = convertToWavBlob(rawAudioData);
    logger.debug(`[SayPi VAD Offscreen] Speech ended. Duration: ${speechDuration}ms, Size: ${audioBlob.size} bytes`);
    if (currentActiveTabId !== null) {
      // Sending the blob directly might be too large for runtime.sendMessage.
      // Consider alternative for large data or just send notification.
      // For now, just sending the event and duration.
      chrome.runtime.sendMessage({
        type: "VAD_SPEECH_END",
        duration: speechDuration,
        // blob: audioBlob, // Potentially too large, handle appropriately
        targetTabId: currentActiveTabId,
        origin: "offscreen-document",
      });
      // TODO: If blob needs to be sent, use a different mechanism or confirm size limits.
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
  onFrameProcessed(probabilities: { isSpeech: number; notSpeech: number }) {
    // This can be chatty, enable for debugging if necessary
    // console.log("[SayPi VAD Offscreen] Frame processed:", probabilities);
    if (currentActiveTabId !== null) {
       chrome.runtime.sendMessage({
         type: "VAD_FRAME_PROCESSED",
         probabilities,
         targetTabId: currentActiveTabId,
         origin: "offscreen-document",
       });
     }
  },
};

async function tryInitializeVAD(attemptName: string, customOptions: Partial<RealTimeVADOptions>, currentStream: MediaStream): Promise<MicVAD> {
  logger.log(`[SayPi VAD Offscreen] Attempting VAD initialization: ${attemptName}`);
  const baseOptions: Partial<RealTimeVADOptions> = {
    ortConfig: (ort: any) => {
      ort.env.wasm.wasmPaths = {
        'ort-wasm.wasm': getExtensionFileUrl('public/ort-wasm.wasm'),
        'ort-wasm-simd.wasm': getExtensionFileUrl('public/ort-wasm-simd.wasm'),
        'ort-wasm-threaded.wasm': getExtensionFileUrl('public/ort-wasm-threaded.wasm'),
        'ort-wasm-simd-threaded.wasm': getExtensionFileUrl('public/ort-wasm-simd-threaded.wasm'),
      };
      // Apply simd/numThreads from customOptions or use defaults
      ort.env.wasm.simd = (customOptions.ortConfig as any)?.simd ?? false;
      ort.env.wasm.numThreads = (customOptions.ortConfig as any)?.numThreads ?? 1;
      logger.debug(`[SayPi VAD Offscreen] ${attemptName} - ORT config applied:`, ort.env.wasm);
    },
    positiveSpeechThreshold: commonMicVADOptions.positiveSpeechThreshold,
    minSpeechFrames: commonMicVADOptions.minSpeechFrames,
    preSpeechPadFrames: commonMicVADOptions.preSpeechPadFrames,
    onSpeechStart: commonMicVADOptions.onSpeechStart,
    onSpeechEnd: commonMicVADOptions.onSpeechEnd,
    onVADMisfire: commonMicVADOptions.onVADMisfire,
    onFrameProcessed: commonMicVADOptions.onFrameProcessed,
    stream: currentStream,
    model: "v5",
    //workletURL: getExtensionFileUrl('public/vad.worklet.bundle.min.js'), // Consider browser detection for .js vs .min.js if needed
  };

  // Merge customOptions deeply, especially for ortConfig parts if provided separately
  const finalOptions = { ...baseOptions, ...customOptions };
  if (customOptions.ortConfig && baseOptions.ortConfig) { // Need to merge ortConfig properties
    finalOptions.ortConfig = (ort: any) => { 
        baseOptions.ortConfig!(ort); // Apply base wasmPaths etc.
        // Then let customOptions override specifics like simd/numThreads if they were meant for ortConfig directly
        const customOrtSimd = (customOptions.ortConfig as any)?.simd;
        const customOrtNumThreads = (customOptions.ortConfig as any)?.numThreads;
        if (typeof customOrtSimd === 'boolean') ort.env.wasm.simd = customOrtSimd;
        if (typeof customOrtNumThreads === 'number') ort.env.wasm.numThreads = customOrtNumThreads;
        logger.debug(`[SayPi VAD Offscreen] ${attemptName} - Merged ORT config - SIMD: ${ort.env.wasm.simd}, Threads: ${ort.env.wasm.numThreads}`);
    };
  } else if (customOptions.ortConfig) {
    finalOptions.ortConfig = customOptions.ortConfig;
  }

  logger.debug(`[SayPi VAD Offscreen] ${attemptName} - Final VAD Options:`, finalOptions);
  return MicVAD.new(finalOptions);
}

async function initializeVAD(options: Partial<RealTimeVADOptions> = {}) {
  if (vadInstance) {
    logger.log("[SayPi VAD Offscreen] VAD already initialized.");
    return { success: true, mode: "existing" };
  }
  try {
    logger.log("[SayPi VAD Offscreen] Acquiring microphone stream for VAD initialization...");
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true, // Recommended for VAD
        autoGainControl: true,  // Recommended for VAD
        noiseSuppression: true, // Recommended for VAD
      }
    });
    logger.log("[SayPi VAD Offscreen] Microphone stream acquired.");
  } catch (error: any) {
    logger.reportError(error, { function: 'initializeVAD', step: 'getUserMedia' }, "Mic stream acquisition failed");
    return { success: false, error: `Mic stream error: ${error.message || "Unknown error"}`, mode: "failed_mic" };
  }

  let lastError: any = null;

  // Attempt 1: Optimistic (SIMD, some threading)
  try {
    const threads = navigator.hardwareConcurrency && navigator.hardwareConcurrency > 1 ? Math.min(2, navigator.hardwareConcurrency) : 1;
    vadInstance = await tryInitializeVAD("Attempt 1: SIMD/Threaded", { ortConfig: (ort:any) => { ort.env.wasm.simd = true; ort.env.wasm.numThreads = threads; } }, stream!);
    logger.log("[SayPi VAD Offscreen] MicVAD instance created (Attempt 1).");
    return { success: true, mode: "simd_threaded" };
  } catch (error) {
    logger.warn("[SayPi VAD Offscreen] Attempt 1 (SIMD/Threaded) failed:", error);
    lastError = error;
  }

  // Attempt 2: Safe Fallback (No SIMD, Single Thread - as per original commonMicVADOptions)
  try {
    vadInstance = await tryInitializeVAD("Attempt 2: No SIMD/Single Thread", { ortConfig: (ort:any) => { ort.env.wasm.simd = false; ort.env.wasm.numThreads = 1; } }, stream!);
    logger.log("[SayPi VAD Offscreen] MicVAD instance created (Attempt 2).");
    return { success: true, mode: "no_simd_single_thread" };
  } catch (error) {
    logger.warn("[SayPi VAD Offscreen] Attempt 2 (No SIMD/Single Thread) failed:", error);
    lastError = error;
  }
  
  // Attempt 3: Minimal Config (No SIMD, Single Thread, adjusted VAD params)
  try {
    vadInstance = await tryInitializeVAD("Attempt 3: Minimal Params", { 
        ortConfig: (ort:any) => { ort.env.wasm.simd = false; ort.env.wasm.numThreads = 1; },
        positiveSpeechThreshold: 0.75, // Slightly more lenient
        minSpeechFrames: 2,          // Fewer frames
        preSpeechPadFrames: 5,       // Less padding
     }, stream!);
    logger.log("[SayPi VAD Offscreen] MicVAD instance created (Attempt 3).");
    return { success: true, mode: "minimal_params" };
  } catch (error) {
    logger.reportError(error, { function: 'initializeVAD', step: 'Attempt 3 Minimal Params', previousError: lastError }, "All VAD init attempts failed");
    if (stream) { // Clean up stream if all attempts failed
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    const finalErrorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: finalErrorMessage || "Unknown VAD initialization error after all fallbacks", mode: "failed_all" };
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

  logger.debug("[SayPi VAD Offscreen] Received message from background:", message);
  const { type, options, sourceTabId } = message; // `sourceTabId` is the original tabId from content script
  let promise: Promise<any> | null = null;

  switch (type) {
    case "VAD_INITIALIZE_REQUEST":
      promise = initializeVAD(options);
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