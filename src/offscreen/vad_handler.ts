import type { MicVAD, RealTimeVADOptions } from "@ricky0123/vad-web";
import { logger } from "../LoggingModule.js";
import { debounce } from "../utils/debounce";
import { incrementUsage, decrementUsage, resetUsageCounter, registerMessageHandler } from "./media_coordinator";
import { VAD_CONFIGS, VADPreset } from "../vad/VADConfigs";
import {
  SegmentStatsTracker,
  admitSegment,
  DEFAULT_ADMISSION_CONFIG,
  VAD_LIBRARY_DEFAULT_POSITIVE_THRESHOLD,
} from "../vad/segmentAdmission";
import { resolveVadStream, type SyntheticAudioLatch } from "./synthetic-audio";
import { createWarmMicVad, destroyMicVad, openVadAudio, releaseVadAudio, type VadAudio } from "../vad/micStreamLifecycle";
import { configureSingleThreadedOrt } from "../vad/ortRuntime";

const globalScope = globalThis as Record<PropertyKey, unknown>;
const HANDLER_LOADED = Symbol.for("saypi.vad.handlerLoaded");
const HANDLERS_REGISTERED = Symbol.for("saypi.vad.handlersRegistered");

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
// The mic (or DEV synthetic) stream and AudioContext the VAD runs on. We open and release
// them ourselves so the mic stays open across pause/resume, as it did before vad-web 0.0.27
// (see micStreamLifecycle).
let vadAudio: VadAudio | null = null;
let speechStartTime = 0;
let lastFrameProbabilities: { isSpeech: number; notSpeech: number } | null = null;
let activePreset: VADPreset = "balanced";

// #420 — accumulates each segment's peak/mean speech probability + speech-frame count
// from the per-frame VAD callbacks, so the admission gate can drop near-threshold
// non-speech BEFORE the audio is serialised across the offscreen→content IPC.
const segmentStats = new SegmentStatsTracker(VAD_LIBRARY_DEFAULT_POSITIVE_THRESHOLD);

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
    segmentStats.beginSegment();
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
    // #420 — summarise the segment's speech-probability before deciding to upload.
    const stats = segmentStats.endSegment();
    const decision = admitSegment(stats, DEFAULT_ADMISSION_CONFIG);
    console.debug(`[SayPi VAD Handler] Speech duration: ${speechDuration}ms, Frame count: ${frameCount}, Frame rate: ${frameRate}, Duration: ${duration}s`);
    logger.debug(`[SayPi VAD Handler] Speech ended. Duration: ${speechDuration}ms`);
    if (currentVadTabId !== null) {
      const captureTimestamp = speechStopTime;
      const confidence = lastFrameProbabilities?.isSpeech ?? null;

      // #420 — gate at the cheapest point: a segment that never cleared the speech
      // bar is dropped as a misfire so its audio is NEVER serialised across the IPC.
      // (Reuses the existing non-speech/misfire path end-to-end.)
      if (!decision.admit) {
        logger.info(
          `[SayPi VAD Handler] Admission gate dropped a segment (${decision.reason}): ` +
          `peak=${stats.peakSpeechProb.toFixed(3)}, mean=${stats.meanSpeechProb.toFixed(3)}, ` +
          `speechFrames=${stats.speechFrameCount}. Not uploading.`
        );
        chrome.runtime.sendMessage({
          type: "VAD_MISFIRE",
          reason: `admission-gate:${decision.reason}`,
          peakSpeechProb: stats.peakSpeechProb,
          meanSpeechProb: stats.meanSpeechProb,
          speechFrameCount: stats.speechFrameCount,
          targetTabId: currentVadTabId,
          origin: "offscreen-document",
        });
        return;
      }

      // Convert Float32Array to regular Array for proper serialization
      const audioArray = Array.from(rawAudioData);

      chrome.runtime.sendMessage({
        type: "VAD_SPEECH_END",
        duration: speechDuration,
        audioData: audioArray,
        frameCount: frameCount,
        captureTimestamp: captureTimestamp,
        confidence,
        // #420 — per-segment speech-probability stats forwarded for observability and
        // future threshold calibration (the gate that admitted this segment used them).
        peakSpeechProb: stats.peakSpeechProb,
        meanSpeechProb: stats.meanSpeechProb,
        speechFrameCount: stats.speechFrameCount,
        targetTabId: currentVadTabId,
        origin: "offscreen-document",
      });

      // Log message sending delays if they exceed thresholds
      logMessageDelay(captureTimestamp);
    }
  },
  onVADMisfire: () => {
    logger.debug("[SayPi VAD Handler] VAD misfire.");
    segmentStats.reset();
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
    segmentStats.observe(probabilities.isSpeech);
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

/**
 * Build the shared VAD instance for `initOptions.preset`. A missing or unknown preset falls
 * back to `balanced`, the default `selectVADPreset` gives every context; the in-page client
 * does the same. That fallback is reachable: an offscreen document that auto-shut-down while
 * idle is re-created by the next VAD_START_REQUEST, which is why that request carries the
 * preset too (#655).
 */
async function initializeVAD(initOptions: { preset?: VADPreset } = {}) {
  if (vadInstance) {
    logger.log("[SayPi VAD Handler] VAD already initialized.");
    return { success: true, mode: "existing" };
  }
  try {
    logger.log("[SayPi VAD Handler] Initializing VAD with default options...");
    const preset: VADPreset = initOptions.preset && VAD_CONFIGS[initOptions.preset] ? initOptions.preset : "balanced";
    const mergedOptions = { ...vadCallbackOptions, ...VAD_CONFIGS[preset], ...vadBundleOptions };
    // #420 — count speech frames against the active preset's positive threshold.
    segmentStats.setPositiveSpeechThreshold(
      VAD_CONFIGS[preset].positiveSpeechThreshold ?? VAD_LIBRARY_DEFAULT_POSITIVE_THRESHOLD
    );

    mergedOptions.ortConfig = configureSingleThreadedOrt;

    // DEV-only: when armed, a synthetic stream stands in for the mic.
    const syntheticStream = await resolveVadStream(syntheticAudioLatch);
    if (syntheticStream) {
      logger.log("[SayPi VAD Handler] Using synthetic audio stream (DEV — no live mic)");
    }
    vadAudio = await openVadAudio(syntheticStream);

    const optionSummary = Object.fromEntries(
      Object.entries({
        preset,
        model: mergedOptions.model,
        baseAssetPath: mergedOptions.baseAssetPath,
        onnxWASMBasePath: mergedOptions.onnxWASMBasePath,
        positiveSpeechThreshold: mergedOptions.positiveSpeechThreshold,
        negativeSpeechThreshold: mergedOptions.negativeSpeechThreshold,
        redemptionMs: mergedOptions.redemptionMs,
        minSpeechMs: mergedOptions.minSpeechMs,
        preSpeechPadMs: mergedOptions.preSpeechPadMs,
        submitUserSpeechOnPause: mergedOptions.submitUserSpeechOnPause,
      }).filter(([, value]) => value !== undefined)
    );

    logger.debug("[SayPi VAD Handler] VAD option summary", optionSummary);
    const audio = vadAudio;
    vadInstance = await withOrtWarningRollup(() => createWarmMicVad(mergedOptions, audio));
    segmentStats.reset(); // drop any frames observed while warming the audio graph
    logger.log("[SayPi VAD Handler] MicVAD instance created with preset: " + preset);
    activePreset = preset;
    return { success: true, mode: preset };
  } catch (error: any) {
    releaseVadAudio(vadAudio);
    vadAudio = null;
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

export async function startVAD(tabId: number, initOptions: { preset?: VADPreset } = {}) {
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
    const initResult = await initializeVAD(initOptions);
    if (!initResult.success) {
      decrementUsage('vad');
      return initResult;
    }
  }
  try {
    if (vadInstance) {
      logger.log("[SayPi VAD Handler] Starting VAD...");
      // The graph was built at initialize (createWarmMicVad), so this only reconnects the
      // held stream; it is async since vad-web 0.0.27, so await it to catch a failure.
      await vadInstance.start();
      return { success: true };
    }
    decrementUsage('vad');
    return { success: false, error: "VAD instance not available after init attempt." };
  } catch (error: any) {
    logger.reportError(error, { function: 'startVAD', tabId }, "Error starting VAD");
    // Don't keep an instance that failed to start: the next start re-initializes it.
    releaseVadInstance();
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
      await vadInstance.pause(); // keeps the mic open (heldAudioOptions); destroy releases it
      // #420 — pause() with submitUserSpeechOnPause:false fires no callback, so reset
      // the tracker here to keep it idle between segments if a call stops mid-utterance.
      segmentStats.reset();
      decrementUsage('vad');
      return { success: true };
    } catch (error: any) {
      logger.reportError(error, { function: 'stopVAD' }, "Error stopping VAD");
      return { success: false, error: error.message || "Unknown VAD stop error" };
    }
  }
  return { success: false, error: "VAD not initialized or already stopped." };
}

/** Destroy the VAD instance and release the mic and AudioContext it ran on. */
function releaseVadInstance() {
  segmentStats.reset(); // #420 — don't carry segment state across a destroy
  if (vadInstance) {
    void destroyMicVad(vadInstance, (error) =>
      logger.warn("[SayPi VAD Handler] MicVAD.destroy failed", error)
    );
    vadInstance = null;
  }
  releaseVadAudio(vadAudio);
  vadAudio = null;
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
  releaseVadInstance();
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
    return startVAD(sourceTabId, message.options || {});
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
