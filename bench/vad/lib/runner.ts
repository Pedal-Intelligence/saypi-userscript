// Offline VAD runner for the #420 benchmark. Drives the EXACT pieces the extension
// ships — the Silero v5 ONNX model, @ricky0123/vad-web's FrameProcessor + Resampler,
// and SayPi's own SegmentStatsTracker + admitSegment gate (src/vad/segmentAdmission)
// with the real VAD_CONFIGS presets — so the numbers reflect the client that runs in
// users' browsers, not a reimplementation. Run via `node --experimental-strip-types`.
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import {
  SegmentStatsTracker,
  admitSegment,
  DEFAULT_ADMISSION_CONFIG,
  SILERO_V5_DEFAULT_POSITIVE_THRESHOLD,
} from "../../../src/vad/segmentAdmission.ts";
import { VAD_CONFIGS } from "../../../src/vad/VADConfigs.ts";

const require = createRequire(import.meta.url);
const ort = require("onnxruntime-web");
const { SileroV5 } = require("@ricky0123/vad-web/dist/models/v5.js");
const { FrameProcessor, defaultV5FrameProcessorOptions } = require(
  "@ricky0123/vad-web/dist/frame-processor.js"
);
const { Resampler } = require("@ricky0123/vad-web/dist/resampler.js");
const { Message } = require("@ricky0123/vad-web/dist/messages.js");

const FRAME_SAMPLES = 512; // Silero v5 frame @ 16 kHz = 32 ms
const FRAME_MS = (FRAME_SAMPLES / 16000) * 1000;

// Silence the noisy "Removing initializer" warnings ORT prints when loading the model.
async function quietOrt<T>(fn: () => Promise<T>): Promise<T> {
  const real = { warn: console.warn, log: console.log, error: console.error };
  const drop = (orig: (...a: any[]) => void) => (...a: any[]) => {
    if (typeof a[0] === "string" && /onnxruntime|initializer|Removing/.test(a[0])) return;
    orig(...a);
  };
  console.warn = drop(real.warn);
  console.log = drop(real.log);
  console.error = drop(real.error);
  try {
    return await fn();
  } finally {
    Object.assign(console, real);
  }
}

export async function loadV5Model() {
  const ortDist = require
    .resolve("onnxruntime-web/package.json")
    .replace(/package\.json$/, "dist/");
  ort.env.wasm.wasmPaths = ortDist;
  ort.env.wasm.numThreads = 1;
  ort.env.wasm.proxy = false;
  ort.env.logLevel = "error";
  const onnxPath = require.resolve("@ricky0123/vad-web/dist/silero_vad_v5.onnx");
  const modelFetcher = async () => readFileSync(onnxPath).buffer;
  return quietOrt(() => SileroV5.new(ort, modelFetcher));
}

/** Merge a preset's overrides onto the vad-web v5 defaults (the "none" baseline). */
export function frameProcessorOptionsFor(preset: string) {
  const overrides = (VAD_CONFIGS as any)[preset] ?? {};
  return {
    ...defaultV5FrameProcessorOptions,
    frameSamples: FRAME_SAMPLES,
    submitUserSpeechOnPause: false,
    positiveSpeechThreshold: overrides.positiveSpeechThreshold ?? defaultV5FrameProcessorOptions.positiveSpeechThreshold,
    negativeSpeechThreshold: overrides.negativeSpeechThreshold ?? defaultV5FrameProcessorOptions.negativeSpeechThreshold,
    redemptionFrames: overrides.redemptionFrames ?? defaultV5FrameProcessorOptions.redemptionFrames,
    minSpeechFrames: overrides.minSpeechFrames ?? defaultV5FrameProcessorOptions.minSpeechFrames,
    preSpeechPadFrames: overrides.preSpeechPadFrames ?? defaultV5FrameProcessorOptions.preSpeechPadFrames,
  };
}

export interface BenchSegment {
  startMs: number;
  endMs: number;
  peakSpeechProb: number;
  meanSpeechProb: number;
  speechFrameCount: number;
  admitted: boolean; // survived SayPi's #420 admission gate
  admissionReason: string;
}

/**
 * Run one clip through one preset. Returns every segment the VAD opened, each tagged
 * with whether the #420 gate would admit it — mirroring vad_handler / OnscreenVADClient
 * (observe per frame, beginSegment on speech-start, endSegment+admitSegment on speech-end).
 */
export async function runClip(
  model: any,
  samples: Float32Array,
  sampleRate: number,
  preset: string
): Promise<{ preset: string; frames: number; segments: BenchSegment[] }> {
  const options = frameProcessorOptionsFor(preset);
  model.reset_state();
  const frameProcessor = new FrameProcessor(model.process, model.reset_state, options);
  frameProcessor.resume();

  const tracker = new SegmentStatsTracker(options.positiveSpeechThreshold);
  const segments: BenchSegment[] = [];
  let processed = 0; // frames processed so far
  let segmentStartFrame = 0;
  let maxFrameProb = 0; // highest per-frame speech prob anywhere (even if no segment opened)
  // True only during the end-of-clip flush, where `processed` already counts the whole
  // clip — so the trailing segment ends at frame `processed`, not `processed + 1`
  // (matches vad-web NonRealTimeVAD's `end = frameIndex*frameSamples/16` at flush).
  let flushing = false;

  const handleEvent = (event: any) => {
    switch (event.msg) {
      case Message.FrameProcessed:
        tracker.observe(event.probs.isSpeech);
        maxFrameProb = Math.max(maxFrameProb, event.probs.isSpeech);
        break;
      case Message.SpeechStart:
        // SpeechStart fires during the current frame's process(); processed is the
        // index of that frame (not yet incremented).
        segmentStartFrame = processed;
        tracker.beginSegment();
        break;
      case Message.SpeechEnd: {
        const stats = tracker.endSegment();
        const decision = admitSegment(stats, DEFAULT_ADMISSION_CONFIG);
        segments.push({
          startMs: segmentStartFrame * FRAME_MS,
          endMs: (flushing ? processed : processed + 1) * FRAME_MS,
          peakSpeechProb: stats.peakSpeechProb,
          meanSpeechProb: stats.meanSpeechProb,
          speechFrameCount: stats.speechFrameCount,
          admitted: decision.admit,
          admissionReason: decision.reason,
        });
        break;
      }
      case Message.VADMisfire:
        tracker.reset();
        break;
      default:
        break;
    }
  };

  const resampler = new Resampler({
    nativeSampleRate: sampleRate,
    targetSampleRate: 16000,
    targetFrameSize: FRAME_SAMPLES,
  });

  for await (const frame of resampler.stream(samples)) {
    await frameProcessor.process(frame, handleEvent);
    processed++;
  }
  // Flush any segment still open when the clip ends.
  flushing = true;
  frameProcessor.endSegment(handleEvent);

  return { preset, frames: processed, segments, maxFrameProb };
}

export const RUNNER_FRAME_MS = FRAME_MS;
export const V5_BASELINE_POSITIVE_THRESHOLD = SILERO_V5_DEFAULT_POSITIVE_THRESHOLD;
