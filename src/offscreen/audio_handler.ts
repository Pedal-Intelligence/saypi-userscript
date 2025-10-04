import { logger } from "../LoggingModule.js";
import { incrementUsage, decrementUsage, registerMessageHandler } from "./media_coordinator";

const audioHandlerGlobal = window as any;
if (!audioHandlerGlobal.__saypiAudioHandlerLoaded) {
  logger.log("[SayPi Audio Handler] Script loaded.");
  audioHandlerGlobal.__saypiAudioHandlerLoaded = true;
} else {
  logger.debug("[SayPi Audio Handler] Script already loaded; skipping duplicate initialization logs.");
}

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
    audio.addEventListener(eventName, (event) => {
      const timestamp = Date.now();
      
      // Enhanced logging for audio state changes
      if (["play", "pause", "playing", "ended"].includes(eventName)) {
        logger.debug(`[SayPi Audio Handler] Audio event '${eventName}' fired:`, {
          timestamp,
          currentTime: audio.currentTime,
          paused: audio.paused,
          ended: audio.ended,
          src: audio.currentSrc,
          readyState: audio.readyState,
          volume: audio.volume,
          muted: audio.muted
        });
      }
      
      if (currentAudioTabId !== null) {
        // For events that should include the source information
        const detail = ["play", "loadstart", "error"].includes(eventName) 
          ? { source: audio.currentSrc, timestamp }
          : { timestamp };
        
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
  logger.debug("[SayPi Audio Handler] pauseAudio() called - starting diagnostics");
  
  if (!audioElement) {
    logger.error("[SayPi Audio Handler] pauseAudio failed: Audio element not initialized");
    return { success: false, error: "Audio element not initialized" };
  }
  
  // Pre-pause diagnostics
  logger.debug("[SayPi Audio Handler] Pre-pause audio element state:", {
    src: audioElement.src,
    currentSrc: audioElement.currentSrc,
    paused: audioElement.paused,
    ended: audioElement.ended,
    currentTime: audioElement.currentTime,
    duration: audioElement.duration,
    readyState: audioElement.readyState,
    networkState: audioElement.networkState,
    volume: audioElement.volume,
    muted: audioElement.muted,
    playbackRate: audioElement.playbackRate
  });
  
  // Check for other audio elements in the document
  const allAudioSources = detectAllAudioSources();
  logger.debug("[SayPi Audio Handler] Comprehensive audio source detection:", allAudioSources);
  
  const playingElements = allAudioSources.htmlAudioElements.filter(elem => elem.isPlaying);
  if (playingElements.length > 0) {
    logger.warn(`[SayPi Audio Handler] Found ${playingElements.length} actively playing HTML audio/video elements:`, playingElements);
  }
  
  // Check if our audio element was actually playing
  const wasPlaying = !audioElement.paused && !audioElement.ended && audioElement.currentTime > 0;
  logger.debug(`[SayPi Audio Handler] Audio was actively playing before pause: ${wasPlaying}`);
  
  try {
    // Record timestamp before pause
    const pauseStartTime = Date.now();
    
    // Perform the pause
    audioElement.pause();
    
    // Immediate post-pause verification
    const pauseEndTime = Date.now();
    const pauseDuration = pauseEndTime - pauseStartTime;
    
    logger.debug("[SayPi Audio Handler] Post-pause audio element state (immediate):", {
      pauseDurationMs: pauseDuration,
      paused: audioElement.paused,
      ended: audioElement.ended,
      currentTime: audioElement.currentTime,
      src: audioElement.currentSrc
    });
    
    // Schedule a delayed verification to catch any async issues
    setTimeout(() => {
      if (!audioElement) {
        logger.warn("[SayPi Audio Handler] audioElement became null during delayed verification");
        return;
      }
      
      logger.debug("[SayPi Audio Handler] Post-pause audio element state (100ms delayed):", {
        paused: audioElement.paused,
        ended: audioElement.ended,
        currentTime: audioElement.currentTime,
        src: audioElement.currentSrc
      });
      
      // Check if any other audio elements started playing
      const updatedAudioSources = detectAllAudioSources();
      const activeAudioElements = updatedAudioSources.htmlAudioElements.filter(elem => elem.isPlaying);
      
      if (activeAudioElements.length > 0) {
        logger.warn(`[SayPi Audio Handler] Warning: ${activeAudioElements.length} other audio elements are still playing after pause:`, 
          activeAudioElements.map(audio => ({
            id: audio.id,
            src: audio.currentSrc,
            currentTime: audio.currentTime
          }))
        );
      }
    }, 100);
    
    logger.debug("[SayPi Audio Handler] audioElement.pause() completed successfully");
    return { success: true };
  } catch (error: any) {
    logger.error("[SayPi Audio Handler] Error during pause operation:", {
      errorMessage: error.message,
      errorName: error.name,
      errorStack: error.stack,
      audioElementState: {
        src: audioElement.src,
        paused: audioElement.paused,
        readyState: audioElement.readyState
      }
    });
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

function detectAllAudioSources() {
  const audioSources = {
    htmlAudioElements: [] as any[],
    webAudioContexts: [] as any[],
    mediaStreamSources: [] as any[]
  };
  
  // Check all HTML audio elements
  const allAudioElements = document.querySelectorAll('audio, video');
  allAudioElements.forEach((element, index) => {
    const htmlElement = element as HTMLAudioElement | HTMLVideoElement;
    audioSources.htmlAudioElements.push({
      index,
      tagName: element.tagName,
      id: element.id,
      src: htmlElement.src,
      currentSrc: htmlElement.currentSrc,
      paused: htmlElement.paused,
      ended: htmlElement.ended,
      currentTime: htmlElement.currentTime,
      duration: htmlElement.duration,
      volume: htmlElement.volume,
      muted: htmlElement.muted,
      readyState: htmlElement.readyState,
      isPlaying: !htmlElement.paused && !htmlElement.ended && htmlElement.currentTime > 0
    });
  });
  
  // Check Web Audio API contexts (if available)
  try {
    // Check if there are any active AudioContext instances
    // Note: We can't directly enumerate all contexts, but we can check for common patterns
    const hasAudioContext = typeof window.AudioContext !== 'undefined';
    const hasWebkitAudioContext = typeof (window as any).webkitAudioContext !== 'undefined';
    
    if (hasAudioContext || hasWebkitAudioContext) {
      audioSources.webAudioContexts.push({
        available: true,
        hasAudioContext,
        hasWebkitAudioContext,
        note: "Web Audio API is available - active contexts cannot be directly enumerated"
      });
    }
  } catch (error) {
    // Web Audio API not available or blocked
  }
  
  // Check for MediaStream sources
  try {
    if (typeof navigator.mediaDevices !== 'undefined') {
      audioSources.mediaStreamSources.push({
        available: true,
        note: "MediaStream API is available - active streams cannot be directly enumerated without references"
      });
    }
  } catch (error) {
    // MediaStream API not available
  }
  
  return audioSources;
}

// Register audio message handlers with the coordinator
if (!audioHandlerGlobal.__saypiAudioHandlerRegistered) {
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
    const result = pauseAudio();
    if (result.success) {
      logger.debug(`[SayPi Audio Handler] AUDIO_PAUSE_REQUEST successful at ${new Date().toISOString()}`);
    } else {
      logger.error(`[SayPi Audio Handler] AUDIO_PAUSE_REQUEST failed: ${result.error}`);
    }
    return result;
  });

  registerMessageHandler("AUDIO_RESUME_REQUEST", (message, sourceTabId) => {
    const result = playAudio();
    if (result.success) {
      logger.debug(`[SayPi Audio Handler] AUDIO_RESUME_REQUEST successful at ${new Date().toISOString()}`);
    } else {
      logger.error(`[SayPi Audio Handler] AUDIO_RESUME_REQUEST failed: ${result.error}`);
    }
    return result;
  });

  registerMessageHandler("AUDIO_STOP_REQUEST", (message, sourceTabId) => {
    return stopAudio();
  });

  // Initialize audio on load
  initializeAudio();

  logger.log("[SayPi Audio Handler] Message handlers registered.");
  audioHandlerGlobal.__saypiAudioHandlerRegistered = true;
} else {
  logger.debug("[SayPi Audio Handler] Message handlers already registered; skipping duplicate setup.");
}
