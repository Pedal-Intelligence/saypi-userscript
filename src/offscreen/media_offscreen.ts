import { MicVAD, RealTimeVADOptions } from "@ricky0123/vad-web";
import { logger } from "../LoggingModule.js";
import { debounce } from "lodash";

logger.log("[SayPi Media Offscreen] Script loaded.");

// ----- Reference counting for usage tracking -----
interface UsageCounter {
  vad: number;
  audio: number;
}

const usageCounter: UsageCounter = {
  vad: 0,
  audio: 0
};

// Auto-shutdown timer
let autoShutdownTimer: number | null = null;
const AUTO_SHUTDOWN_DELAY = 30000; // 30 seconds of complete inactivity

function incrementUsage(type: keyof UsageCounter) {
  usageCounter[type]++;
  
  // Clear any existing shutdown timer since we're now active
  if (autoShutdownTimer !== null) {
    clearTimeout(autoShutdownTimer);
    autoShutdownTimer = null;
  }
  
  logger.debug(`[SayPi Media Offscreen] ${type} usage incremented to ${usageCounter[type]}`);
}

function decrementUsage(type: keyof UsageCounter) {
  if (usageCounter[type] > 0) {
    usageCounter[type]--;
  }
  
  logger.debug(`[SayPi Media Offscreen] ${type} usage decremented to ${usageCounter[type]}`);
  
  // Check if both VAD and audio are inactive
  if (usageCounter.vad === 0 && usageCounter.audio === 0) {
    startAutoShutdownTimer();
  }
}

function startAutoShutdownTimer() {
  // Don't start a new timer if one is already running
  if (autoShutdownTimer !== null) {
    return;
  }
  
  logger.debug(`[SayPi Media Offscreen] Starting auto-shutdown timer for ${AUTO_SHUTDOWN_DELAY}ms`);
  
  autoShutdownTimer = window.setTimeout(() => {
    if (usageCounter.vad === 0 && usageCounter.audio === 0) {
      logger.debug('[SayPi Media Offscreen] Auto-shutdown triggered after inactivity');
      // Tell the background script to close the offscreen document
      chrome.runtime.sendMessage({
        type: 'OFFSCREEN_AUTO_SHUTDOWN',
        origin: 'offscreen-document'
      });
    }
    autoShutdownTimer = null;
  }, AUTO_SHUTDOWN_DELAY);
}

// ----- AUDIO PLAYBACK FUNCTIONALITY -----

let audioElement: HTMLAudioElement | null = null;
let currentAudioTabId: number | null = null;

function initializeAudio() {
  if (audioElement) {
    logger.debug("[SayPi Media Offscreen] Audio already initialized");
    return;
  }
  
  audioElement = document.getElementById('saypi-audio-offscreen') as HTMLAudioElement;
  
  if (!audioElement) {
    logger.error("[SayPi Media Offscreen] Could not find audio element");
    return;
  }
  
  // Register lifecycle and error event listeners
  registerAudioEventForwarding(audioElement);
  registerLifecycleDebug(audioElement);
  
  logger.debug("[SayPi Media Offscreen] Audio element initialized");
}

function registerAudioEventForwarding(audio: HTMLAudioElement) {
  // Events to forward to content script
  const events = [
    "loadedmetadata",
    "canplaythrough",
    "play",
    "pause",
    "ended",
    "seeked",
    "emptied",
    "playing",
    "error"
  ];
  
  events.forEach(eventName => {
    audio.addEventListener(eventName, () => {
      if (currentAudioTabId !== null) {
        // For events that should include the source information
        const detail = ["play", "loadstart", "error"].includes(eventName) 
          ? { source: audio.currentSrc }
          : undefined;
        
        chrome.runtime.sendMessage({
          type: `AUDIO_${eventName.toUpperCase()}`,
          detail,
          targetTabId: currentAudioTabId,
          origin: "offscreen-document"
        });
      }
    });
  });
}

function registerLifecycleDebug(audio: HTMLAudioElement) {
  let starttime: number;
  
  audio.addEventListener('error', (event) => {
    logger.error(
      `[SayPi Media Offscreen] Error playing audio from ${audio.currentSrc}`,
      event
    );
  });

  audio.addEventListener('loadstart', () => {
    logger.debug(`[SayPi Media Offscreen] Loading audio from ${audio.currentSrc}`);
    starttime = Date.now();
  });

  audio.addEventListener('loadeddata', () => {
    const endtime = Date.now();
    const elapsedtime = (endtime - starttime) / 1000;
    logger.debug(
      `[SayPi Media Offscreen] Audio is loaded after ${elapsedtime.toFixed(1)}s from ${
        audio.currentSrc
      }`
    );
  });

  audio.addEventListener('canplay', () => {
    const endtime = Date.now();
    const elapsedtime = (endtime - starttime) / 1000;
    logger.debug(
      `[SayPi Media Offscreen] Audio is ready to play after ${elapsedtime.toFixed(1)}s from ${
        audio.currentSrc
      }`
    );
  });
  
  audio.addEventListener('ended', () => {
    const endtime = Date.now();
    const elapsedtime = (endtime - starttime) / 1000;
    logger.debug(`[SayPi Media Offscreen] Audio playback ended after ${elapsedtime.toFixed(1)}s`);
    decrementUsage('audio');
  });
}

function loadAudio(url: string, tabId: number, playImmediately: boolean = true) {
  if (!audioElement) {
    initializeAudio();
  }
  
  if (!audioElement) {
    logger.error("[SayPi Media Offscreen] Could not initialize audio element");
    return { success: false, error: "Audio element initialization failed" };
  }
  
  currentAudioTabId = tabId;
  incrementUsage('audio');
  
  try {
    audioElement.src = url;
    
    if (playImmediately) {
      audioElement.play()
        .catch(error => {
          logger.error(`[SayPi Media Offscreen] Error playing audio: ${error.message}`);
          decrementUsage('audio');
        });
    } else {
      audioElement.load();
    }
    
    return { success: true };
  } catch (error: any) {
    logger.error(`[SayPi Media Offscreen] Error setting audio source: ${error.message}`);
    decrementUsage('audio');
    return { success: false, error: error.message };
  }
}

function playAudio() {
  if (!audioElement) {
    return { success: false, error: "Audio element not initialized" };
  }
  
  try {
    audioElement.play();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

function pauseAudio() {
  if (!audioElement) {
    return { success: false, error: "Audio element not initialized" };
  }
  
  try {
    audioElement.pause();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

function stopAudio() {
  if (!audioElement) {
    return { success: false, error: "Audio element not initialized" };
  }
  
  try {
    audioElement.pause();
    audioElement.currentTime = 0;
    audioElement.src = '';
    decrementUsage('audio');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ----- VAD FUNCTIONALITY -----

/**
 * Logs message delays based on threshold values
 * @param captureTimestamp - When the audio was originally captured
 * @param description - Description of what's being measured
 */
function logMessageDelay(captureTimestamp: number, description: string = "message send"): void {
  const currentTime = Date.now();
  const delay = currentTime - captureTimestamp;
  
  if (delay > 500) {
    logger.warn(`[SayPi Media Offscreen] High ${description} delay: ${delay}ms from capture to send`);
  } else if (delay > 200) {
    logger.info(`[SayPi Media Offscreen] Elevated ${description} delay: ${delay}ms from capture to send`);
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
    logger.debug("[SayPi Media Offscreen] Speech started.");
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
    console.debug(`[SayPi Media Offscreen] Speech duration: ${speechDuration}ms, Frame count: ${frameCount}, Frame rate: ${frameRate}, Duration: ${duration}s`);
    logger.debug(`[SayPi Media Offscreen] Speech ended. Duration: ${speechDuration}ms`);
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
    logger.debug("[SayPi Media Offscreen] VAD misfire.");
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
    logger.log("[SayPi Media Offscreen] VAD already initialized.");
    return { success: true, mode: "existing" };
  }
  try {
    logger.log("[SayPi Media Offscreen] Initializing VAD with default options...");
    const mergedOptions = { ...vadOptions, ...vadBundleOptions };
    vadInstance = await MicVAD.new(mergedOptions);
    logger.log("[SayPi Media Offscreen] MicVAD instance created.");
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
      logger.log("[SayPi Media Offscreen] Starting VAD...");
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
      logger.log("[SayPi Media Offscreen] Stopping VAD...");
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
  logger.log("[SayPi Media Offscreen] Destroying VAD...");
  if (vadInstance) {
    vadInstance.destroy();
    vadInstance = null;
  }
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
  currentVadTabId = null;
  usageCounter.vad = 0; // Reset the counter completely
  
  // Check if we should start the auto-shutdown timer
  if (usageCounter.audio === 0) {
    startAutoShutdownTimer();
  }
  
  return { success: true };
}

// ----- INITIALIZE AUDIO ON LOAD -----
initializeAudio();

// ----- MESSAGE HANDLING -----

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.origin !== "content-script" || message.sourceTabId === undefined) {
    return;
  }

  if(message.type !== "VAD_FRAME_PROCESSED") {
    // frame processed messages are too chatty, so we don't log them
    logger.debug("[SayPi Media Offscreen] Received message from background:", message);
  }
  
  const { type, options, sourceTabId } = message; // `sourceTabId` is the original tabId from content script
  let promise: Promise<any> | null = null;
  let response: any = null;

  // VAD messages
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
      response = destroyVAD(); 
      break;
      
    // Audio playback messages
    case "AUDIO_PLAY_REQUEST":
      if (message.url) {
        response = loadAudio(message.url, sourceTabId, true);
      } else {
        response = playAudio();
      }
      break;
    case "AUDIO_PAUSE_REQUEST":
      response = pauseAudio();
      break;
    case "AUDIO_RESUME_REQUEST":
      response = playAudio();
      break;
    case "AUDIO_STOP_REQUEST":
      response = stopAudio();
      break;
    default:
      logger.warn("[SayPi Media Offscreen] Unknown message type received:", type);
      sendResponse({ success: false, error: "Unknown message type" });
      return false;
  }

  // Handle synchronous responses
  if (response) {
    chrome.runtime.sendMessage({
      type: `OFFSCREEN_${type}_RESPONSE`,
      payload: response,
      targetTabId: sourceTabId,
      origin: "offscreen-document",
    });
    return false;
  }

  // Handle asynchronous responses
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
      logger.reportError(error, { function: 'onMessage Listener', messageType: type, tabId: sourceTabId }, "Error processing request");
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