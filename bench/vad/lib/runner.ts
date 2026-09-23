// Offline VAD runner for the #420 benchmark. Drives the EXACT pieces the extension
// ships — the Silero model (loaded by lib/segmenter.ts), @ricky0123/vad-web's FrameProcessor + Resampler,
// and SayPi's own SegmentStatsTracker + admitSegment gate (src/vad/segmentAdmission)
// with the real VAD_CONFIGS presets — so the numbers reflect the client that runs in
// users' browsers, not a reimplementation. Run via `node --experimental-strip-types`.
import { createRequire } from "node:module";
import {
  SegmentStatsTracker,
  admitSegment,
  DEFAULT_ADMISSION_CONFIG,
} from "../../../src/vad/segmentAdmission.ts";
import { VAD_CONFIGS } from "../../../src/vad/VADConfigs.ts";

const require = createRequire(import.meta.url);
const { FrameProcessor, defaultFrameProcessorOptions } = require(
  "@ricky0123/vad-web/dist/frame-processor.js"
);
const { Resampler } = require("@ricky0123/vad-web/dist/resampler.js");
const { Message } = require("@ricky0123/vad-web/dist/messages.js");

const FRAME_SAMPLES = 512; // Silero v5/v6 frame @ 16 kHz = 32 ms
const FRAME_MS = (FRAME_SAMPLES / 16000) * 1000;

/** Merge a preset's overrides onto vad-web's frame defaults (the "none" baseline). */
export function frameProcessorOptionsFor(preset: string) {
  const overrides = (VAD_CONFIGS as any)[preset] ?? {};
  const pick = (k: string) => overrides[k] ?? defaultFrameProcessorOptions[k];
  return {
    positiveSpeechThreshold: pick("positiveSpeechThreshold"),
    negativeSpeechThreshold: pick("negativeSpeechThreshold"),
    redemptionMs: pick("redemptionMs"),
    minSpeechMs: pick("minSpeechMs"),
    preSpeechPadMs: pick("preSpeechPadMs"),
    submitUserSpeechOnPause: false,
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
  const frameProcessor = new FrameProcessor(model.process, model.reset_state, options, FRAME_MS);
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
