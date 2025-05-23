import { logger } from "../LoggingModule.js";
import { incrementUsage, decrementUsage, registerMessageHandler } from "./media_coordinator";

logger.log("[SayPi Audio Handler] Script loaded.");

let audioElement: HTMLAudioElement | null = null;
let currentAudioTabId: number | null = null;

function initializeAudio() {
  if (audioElement) {
    logger.debug("[SayPi Audio Handler] Audio already initialized");
    return;
  }
  
  audioElement = document.getElementById('saypi-audio-offscreen') as HTMLAudioElement;
  
  if (!audioElement) {
    logger.error("[SayPi Audio Handler] Could not find audio element");
    return;
  }
  
  // Register lifecycle and error event listeners
  registerAudioEventForwarding(audioElement);
  registerLifecycleDebug(audioElement);
  
  logger.debug("[SayPi Audio Handler] Audio element initialized");
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
      `[SayPi Audio Handler] Error playing audio from ${audio.currentSrc}`,
      event
    );
  });

  audio.addEventListener('loadstart', () => {
    logger.debug(`[SayPi Audio Handler] Loading audio from ${audio.currentSrc}`);
    starttime = Date.now();
  });

  audio.addEventListener('loadeddata', () => {
    const endtime = Date.now();
    const elapsedtime = (endtime - starttime) / 1000;
    logger.debug(
      `[SayPi Audio Handler] Audio is loaded after ${elapsedtime.toFixed(1)}s from ${
        audio.currentSrc
      }`
    );
  });

  audio.addEventListener('canplay', () => {
    const endtime = Date.now();
    const elapsedtime = (endtime - starttime) / 1000;
    logger.debug(
      `[SayPi Audio Handler] Audio is ready to play after ${elapsedtime.toFixed(1)}s from ${
        audio.currentSrc
      }`
    );
  });
  
  audio.addEventListener('ended', () => {
    const endtime = Date.now();
    const elapsedtime = (endtime - starttime) / 1000;
    logger.debug(`[SayPi Audio Handler] Audio playback ended after ${elapsedtime.toFixed(1)}s`);
    decrementUsage('audio');
  });
}

function loadAudio(url: string, tabId: number, playImmediately: boolean = true) {
  if (!audioElement) {
    initializeAudio();
  }
  
  if (!audioElement) {
    logger.error("[SayPi Audio Handler] Could not initialize audio element");
    return { success: false, error: "Audio element initialization failed" };
  }
  
  if (!url) {
    logger.error("[SayPi Audio Handler] No URL provided for audio playback");
    return { success: false, error: "No audio URL provided" };
  }
  
  logger.debug(`[SayPi Audio Handler] Loading audio from URL: ${url} for tab ${tabId}`);
  
  currentAudioTabId = tabId;
  incrementUsage('audio');
  
  try {
    // Clear any previous errors
    audioElement.onerror = ((e: Event) => {
      const target = e.target as HTMLAudioElement;
      logger.error(`[SayPi Audio Handler] Audio error:`, {
        type: e.type,
        error: target.error,
        src: target.src,
        code: target.error?.code
      });
      decrementUsage('audio');
    }) as OnErrorEventHandler;
    
    // Set the source
    audioElement.src = url;
    
    if (playImmediately) {
      logger.debug(`[SayPi Audio Handler] Attempting to play audio from: ${url}`);
      audioElement.play()
        .then(() => {
          logger.debug(`[SayPi Audio Handler] Audio playback started successfully`);
        })
        .catch(error => {
          logger.error(`[SayPi Audio Handler] Error playing audio: ${error.message}`, {
            url,
            errorName: error.name,
            errorMessage: error.message
          });
          decrementUsage('audio');
        });
    } else {
      audioElement.load();
    }
    
    return { success: true };
  } catch (error: any) {
    logger.error(`[SayPi Audio Handler] Error setting audio source: ${error.message}`, {
      url,
      errorName: error.name,
      errorStack: error.stack
    });
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

// Register audio message handlers with the coordinator
registerMessageHandler("AUDIO_LOAD_REQUEST", (message, sourceTabId) => {
  if (message.url) {
    logger.debug(`[SayPi Audio Handler] Processing AUDIO_LOAD_REQUEST with URL: ${message.url}`);
    const autoPlay = message.autoPlay !== false; // Default to true if not specified
    return loadAudio(message.url, sourceTabId, autoPlay);
  } else {
    logger.warn(`[SayPi Audio Handler] Missing URL in AUDIO_LOAD_REQUEST`);
    return { success: false, error: "No URL provided for loading audio" };
  }
});

registerMessageHandler("AUDIO_PLAY_REQUEST", (message, sourceTabId) => {
  if (message.url) {
    // Legacy support - if URL is provided, call loadAudio
    logger.debug(`[SayPi Audio Handler] Processing AUDIO_PLAY_REQUEST with URL: ${message.url}`);
    return loadAudio(message.url, sourceTabId, true);
  } else {
    // Standard usage - no URL means play current audio
    logger.debug(`[SayPi Audio Handler] Processing AUDIO_PLAY_REQUEST (resume playback)`);
    return playAudio();
  }
});

registerMessageHandler("AUDIO_PAUSE_REQUEST", (message, sourceTabId) => {
  return pauseAudio();
});

registerMessageHandler("AUDIO_RESUME_REQUEST", (message, sourceTabId) => {
  return playAudio();
});

registerMessageHandler("AUDIO_STOP_REQUEST", (message, sourceTabId) => {
  return stopAudio();
});

// Initialize audio on load
initializeAudio();

logger.log("[SayPi Audio Handler] Message handlers registered."); 