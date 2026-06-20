import { MicVAD, RealTimeVADOptions } from "@ricky0123/vad-web";
import * as ort from "onnxruntime-web";
import { logger } from "../LoggingModule.js";
import { debounce } from "../utils/debounce";
import { incrementUsage, decrementUsage, resetUsageCounter, registerMessageHandler } from "./media_coordinator";
import { VAD_CONFIGS, VADPreset } from "../vad/VADConfigs";
import { resolveVadStream, type SyntheticAudioLatch } from "./synthetic-audio";

const globalScope = globalThis as Record<PropertyKey, unknown>;
const ORT_LOG_CONFIGURED = Symbol.for("saypi.vad.ortLogConfigured");
const HANDLER_LOADED = Symbol.for("saypi.vad.handlerLoaded");
const HANDLERS_REGISTERED = Symbol.for("saypi.vad.handlersRegistered");

if (!globalScope[ORT_LOG_CONFIGURED]) {
  try {
    ort.env.logLevel = 'error';
    globalScope[ORT_LOG_CONFIGURED] = true;
  } catch (error) {
    logger.warn("[SayPi VAD Handler] Failed to configure ONNX runtime log level", error);
  }
}

if (globalScope[HANDLER_LOADED]) {
  logger.debug("[SayPi VAD Handler] Script already loaded; reusing singletons.");
} else {
  logger.log("[SayPi VAD Handler] Script loaded.");
  globalScope[HANDLER_LOADED] = true;
}

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
let lastFrameProbabilities: { isSpeech: number; notSpeech: number } | null = null;
let activePreset: VADPreset = "none";

// DEV-only: when armed (via VAD_USE_SYNTHETIC_AUDIO), the next VAD init is fed a
// bundled WAV instead of the live mic, so the agent can drive a voice turn with
// no human speaking. See src/offscreen/synthetic-audio.ts.
let syntheticAudioLatch: SyntheticAudioLatch = { enabled: false, clipUrl: "", loop: false };

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

// Callback-only portion of the VAD options (no tuning parameters)
const vadCallbackOptions: Partial<RealTimeVADOptions> & MyRealTimeVADCallbacks = {
  onSpeechStart: () => {
    logger.debug("[SayPi VAD Handler] Speech started.");
    speechStartTime = Date.now();
    if (currentVadTabId !== null) {
      const confidence = lastFrameProbabilities?.isSpeech ?? null;
      chrome.runtime.sendMessage({
        type: "VAD_SPEECH_START",
        targetTabId: currentVadTabId,
        origin: "offscreen-document",
        confidence,
        preset: activePreset,
        thresholds: {
          positive: VAD_CONFIGS[activePreset]?.positiveSpeechThreshold,
          negative: VAD_CONFIGS[activePreset]?.negativeSpeechThreshold
        }
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
      const confidence = lastFrameProbabilities?.isSpeech ?? null;
      
      chrome.runtime.sendMessage({
        type: "VAD_SPEECH_END",
        duration: speechDuration,
        audioData: audioArray,
        frameCount: frameCount,
        captureTimestamp: captureTimestamp,
        confidence,
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
    lastFrameProbabilities = probabilities;
    debouncedSendFrameProcessed(probabilities);
  },
};

// https://docs.vad.ricky0123.com/user-guide/browser/#bundling
const EXTENSION_ASSET_BASE = (() => {
  const url = chrome.runtime.getURL("");
  return url.endsWith("/") ? url : `${url}/`;
})();

const vadBundleOptions: Partial<RealTimeVADOptions> & MyRealTimeVADCallbacks = {
  baseAssetPath: EXTENSION_ASSET_BASE,
  onnxWASMBasePath: EXTENSION_ASSET_BASE,
};

function configureOrtRuntime(runtime: typeof ort, existingOrtConfig?: RealTimeVADOptions['ortConfig']) {
  try {
    runtime.env.logLevel = 'error';
  } catch (error) {
    logger.warn("[SayPi VAD Handler] Failed to configure ONNX runtime log level", error);
  }

  if (typeof existingOrtConfig === 'function') {
    try {
      existingOrtConfig(runtime);
    } catch (error) {
      logger.warn("[SayPi VAD Handler] Custom ortConfig threw", error);
    }
  }

  try {
    if (runtime?.env?.wasm) {
      // Force single-threaded execution so ORT skips the blob-backed worker that MV3 CSP forbids.
      runtime.env.wasm.proxy = false;
      runtime.env.wasm.numThreads = 1;
    }
  } catch (error) {
    logger.warn("[SayPi VAD Handler] Failed to disable ORT wasm proxy", error);
  }
}

async function withOrtWarningRollup<T>(operation: () => Promise<T>): Promise<T> {
  const warningPattern = /\[W:onnxruntime:[^\]]+\]\s*(.+)/;
  const summary = {
    total: 0,
    unique: new Map<string, number>(),
    samples: [] as string[],
  };

  const intercept = (originalFn: (...args: unknown[]) => void) => {
    return (...args: unknown[]) => {
      const firstArg = args[0];
      const message = typeof firstArg === 'string' ? firstArg : '';
      const match = warningPattern.exec(message);

      if (match) {
        const detail = match[1];
        summary.total += 1;
        summary.unique.set(detail, (summary.unique.get(detail) ?? 0) + 1);
        if (summary.samples.length < 3 && !summary.samples.includes(detail)) {
          summary.samples.push(detail);
        }
        return;
      }

      originalFn(...(args as any[]));
    };
  };

  const originalWarn = console.warn;
  const originalLog = console.log;
  const originalError = console.error;

  console.warn = intercept(originalWarn);
  console.log = intercept(originalLog);
  console.error = intercept(originalError);

  try {
    return await operation();
  } finally {
    console.warn = originalWarn;
    console.log = originalLog;
    console.error = originalError;

    if (summary.total > 0) {
      const uniqueCount = summary.unique.size;
      const sampleText = summary.samples.length > 0
        ? ` Sample initializers: ${summary.samples.join('; ')}`
        : '';
      logger.info(
        `[SayPi VAD Handler] ONNX runtime pruned ${summary.total} unused initializers (${uniqueCount} unique).${sampleText}`
      );
    }
  }
}

async function initializeVAD(initOptions: { preset?: VADPreset } = {}) {
  if (vadInstance) {
    logger.log("[SayPi VAD Handler] VAD already initialized.");
    return { success: true, mode: "existing" };
  }
  try {
    logger.log("[SayPi VAD Handler] Initializing VAD with default options...");
    const preset: VADPreset = initOptions.preset && VAD_CONFIGS[initOptions.preset] ? initOptions.preset : "none";
    const mergedOptions = { ...vadCallbackOptions, ...VAD_CONFIGS[preset], ...vadBundleOptions };

    const existingOrtConfig = mergedOptions.ortConfig;
    mergedOptions.ortConfig = (runtime: typeof ort) => {
      configureOrtRuntime(runtime, existingOrtConfig);
    };

    // DEV-only: when armed, feed a synthetic stream so MicVAD.new skips getUserMedia.
    const syntheticStream = await resolveVadStream(syntheticAudioLatch);
    if (syntheticStream) {
      (mergedOptions as Partial<RealTimeVADOptions>).stream = syntheticStream;
      logger.log("[SayPi VAD Handler] Using synthetic audio stream (DEV — no live mic)");
    }

    const optionSummary = Object.fromEntries(
      Object.entries({
        preset,
        model: mergedOptions.model,
        baseAssetPath: mergedOptions.baseAssetPath,
        onnxWASMBasePath: mergedOptions.onnxWASMBasePath,
        positiveSpeechThreshold: mergedOptions.positiveSpeechThreshold,
        negativeSpeechThreshold: mergedOptions.negativeSpeechThreshold,
        redemptionFrames: mergedOptions.redemptionFrames,
        minSpeechFrames: mergedOptions.minSpeechFrames,
        preSpeechPadFrames: mergedOptions.preSpeechPadFrames,
        submitUserSpeechOnPause: mergedOptions.submitUserSpeechOnPause,
      }).filter(([, value]) => value !== undefined)
    );

    logger.debug("[SayPi VAD Handler] VAD option summary", optionSummary);
    vadInstance = await withOrtWarningRollup(() => MicVAD.new(mergedOptions));
    logger.log("[SayPi VAD Handler] MicVAD instance created with preset: " + preset);
    activePreset = preset;
    return { success: true, mode: preset };
  } catch (error: any) {
    logger.reportError(error, { function: 'initializeVAD' }, "VAD initialization failed");
    return { success: false, error: error.message || "VAD initialization error", mode: "failed" };
  }
}

/**
 * Decide whether starting VAD for `newTabId` should preempt a different tab that
 * currently owns the single shared VAD instance. Returns the tab to notify, or
 * null. Pure (no side effects) so the routing-overwrite contract is unit-testable. (#320)
 */
export function computePreemption(
  previousTabId: number | null,
  newTabId: number,
  instanceActive: boolean
): { targetTabId: number } | null {
  if (previousTabId !== null && previousTabId !== newTabId && instanceActive) {
    return { targetTabId: previousTabId };
  }
  return null;
}

/**
 * A stop/destroy of the single shared VAD should be honored only when it comes
 * from the tab that currently owns it. A request from a preempted (non-owner) tab
 * must NOT tear down the instance the new owner is using. When there is no current
 * owner (or no source tab id) there is no ambiguity, so honor it (legacy behavior). (#320)
 */
export function isTeardownFromOwner(
  sourceTabId: number | undefined,
  currentOwner: number | null
): boolean {
  if (sourceTabId === undefined || currentOwner === null) {
    return true;
  }
  return sourceTabId === currentOwner;
}

export async function startVAD(tabId: number) {
  // Last-tab-wins: if a DIFFERENT tab currently owns the shared VAD, it is being
  // displaced. Notify it (VAD_PREEMPTED) so it can cleanly exit its call instead
  // of silently losing voice input. (#320)
  //
  // Usage-counting note: this takeover still increments below, while the displaced
  // tab's owner-guarded stop/destroy no-op (no matching decrement) — a deliberate
  // asymmetry. It is safe: the count can only stay too HIGH (which never triggers
  // auto-shutdown early), and the new owner's destroyVAD resetUsageCounter('vad')
  // zeroes it, so the imbalance can't accumulate across calls.
  const preemption = computePreemption(currentVadTabId, tabId, vadInstance !== null);
  if (preemption) {
    logger.log(
      `[SayPi VAD Handler] Tab ${tabId} is taking over voice input from tab ${preemption.targetTabId}; notifying the displaced tab.`
    );
    chrome.runtime.sendMessage({
      type: "VAD_PREEMPTED",
      targetTabId: preemption.targetTabId,
      origin: "offscreen-document",
    });
  }

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

export async function stopVAD(sourceTabId?: number) {
  // A preempted (non-owner) tab must not stop the shared VAD the new owner uses. (#320)
  if (!isTeardownFromOwner(sourceTabId, currentVadTabId)) {
    logger.debug(
      `[SayPi VAD Handler] Ignoring VAD_STOP_REQUEST from non-owner tab ${sourceTabId} (current owner: ${currentVadTabId}).`
    );
    return { success: true, ignored: true };
  }
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

export function destroyVAD(sourceTabId?: number) {
  // A preempted (non-owner) tab must not destroy the shared VAD the new owner uses. (#320)
  if (!isTeardownFromOwner(sourceTabId, currentVadTabId)) {
    logger.debug(
      `[SayPi VAD Handler] Ignoring VAD_DESTROY_REQUEST from non-owner tab ${sourceTabId} (current owner: ${currentVadTabId}).`
    );
    return { success: true, ignored: true };
  }
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

function registerVadHandlersOnce() {
  if (globalScope[HANDLERS_REGISTERED]) {
    logger.debug("[SayPi VAD Handler] Handlers already registered; skipping duplicate setup.");
    return;
  }

  registerMessageHandler("VAD_INITIALIZE_REQUEST", (message, sourceTabId) => {
    return initializeVAD(message.options || {});
  });

  registerMessageHandler("VAD_START_REQUEST", (message, sourceTabId) => {
    return startVAD(sourceTabId);
  });

  registerMessageHandler("VAD_STOP_REQUEST", (message, sourceTabId) => {
    return stopVAD(sourceTabId);
  });

  registerMessageHandler("VAD_DESTROY_REQUEST", (message, sourceTabId) => {
    return destroyVAD(sourceTabId);
  });

  // DEV-only: arm/disarm the synthetic audio source. Drops any mic-bound VAD
  // instance so the next start() rebuilds with (or without) the synthetic stream.
  registerMessageHandler("VAD_USE_SYNTHETIC_AUDIO", (message) => {
    syntheticAudioLatch = {
      enabled: message.enabled !== false,
      clipUrl: message.clipUrl,
      loop: message.loop === true, // default one-shot (#349); loop:true never yields a transcript
    };
    if (vadInstance) {
      destroyVAD();
    }
    logger.log(`[SayPi VAD Handler] Synthetic audio ${syntheticAudioLatch.enabled ? "armed" : "disarmed"}`);
    return { success: true, armed: syntheticAudioLatch.enabled };
  });

  globalScope[HANDLERS_REGISTERED] = true;
  logger.log("[SayPi VAD Handler] Message handlers registered.");
}

registerVadHandlersOnce();
