// Segmentation replay for the #655 fragmentation benchmark.
//
// The #420 harness (runner.ts) answers "did the VAD open on this clip?"; it cannot see a
// sentence being cut into three uploads, because it scores one verdict per clip. This
// module answers the other question — *where* does the VAD cut continuous speech — and does
// it cheaply enough to sweep many candidate configs:
//
//   1. `computeFrameProbs` runs the real Silero ONNX model ONCE per clip and keeps the
//      per-frame speech probabilities (the expensive part).
//   2. `segmentProbs` replays those probabilities through vad-web's REAL FrameProcessor
//      under any option set, via a stub model that returns the cached value. So every
//      threshold/redemption/min-speech rule is the shipped code, not a reimplementation.
//
// Clip durations are measured the way the server sees them: vad-web's SpeechEnd audio is
// the pre-speech pad + every frame through the last redemption frame, so a segment's
// uploaded length includes the silence tail.
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const ort = require("onnxruntime-web");
const { SileroV5 } = require("@ricky0123/vad-web/dist/models/v5.js");
const { FrameProcessor, defaultV5FrameProcessorOptions } = require(
  "@ricky0123/vad-web/dist/frame-processor.js"
);
const { Resampler } = require("@ricky0123/vad-web/dist/resampler.js");
const { Message } = require("@ricky0123/vad-web/dist/messages.js");

export const FRAME_SAMPLES = 512; // Silero v5 frame @ 16 kHz
export const FRAME_MS = (FRAME_SAMPLES / 16000) * 1000; // 32 ms

export interface SegmenterConfig {
  positiveSpeechThreshold: number;
  negativeSpeechThreshold: number;
  redemptionFrames: number;
  minSpeechFrames: number;
  preSpeechPadFrames: number;
}

export interface Segment {
  /** First frame of the uploaded clip (includes pre-speech pad). */
  clipStartFrame: number;
  /** Frame the VAD first judged speech (SpeechStart). */
  speechStartFrame: number;
  /** Frame index at which SpeechEnd fired (last redemption frame). */
  endFrame: number;
  /** Last frame judged speech (>= positive threshold) inside the segment. */
  lastSpeechFrame: number;
  /** Uploaded clip length in ms (pad + speech + redemption tail). */
  clipMs: number;
  speechFrames: number;
  peakProb: number;
}

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

/**
 * Load a Silero model with the v5 I/O contract (input [1,512], state [2,1,128], sr).
 * Defaults to the v5 file vad-web ships; pass another path to benchmark a drop-in model
 * with the same interface (e.g. Silero v6).
 */
export async function loadSileroModel(onnxPath?: string, { withContext = false } = {}) {
  const ortDist = require.resolve("onnxruntime-web/package.json").replace(/package\.json$/, "dist/");
  ort.env.wasm.wasmPaths = ortDist;
  ort.env.wasm.numThreads = 1;
  ort.env.wasm.proxy = false;
  ort.env.logLevel = "error";
  const path = onnxPath ?? require.resolve("@ricky0123/vad-web/dist/silero_vad_v5.onnx");
  const modelFetcher = async () => readFileSync(path).buffer;
  const model = await quietOrt(() => SileroV5.new(ort, modelFetcher));
  return withContext ? withSileroContext(model) : model;
}

export const SILERO_CONTEXT_SAMPLES = 64;

/**
 * Feed the model the way upstream Silero (v5 and v6) expects: each 512-sample frame
 * prefixed with the last 64 samples of the previous frame. vad-web 0.0.24's SileroV5
 * wrapper passes the bare 512-sample frame, so the model never sees that context; vad-web
 * 0.0.31 fixed this (ricky0123/vad#263). Wraps a loaded vad-web model in place.
 */
export function withSileroContext(model: any) {
  let context = new Float32Array(SILERO_CONTEXT_SAMPLES);
  const bareProcess = model.process;
  const bareReset = model.reset_state;
  model.reset_state = () => {
    context = new Float32Array(SILERO_CONTEXT_SAMPLES);
    bareReset();
  };
  model.process = async (frame: Float32Array) => {
    const input = new Float32Array(SILERO_CONTEXT_SAMPLES + frame.length);
    input.set(context, 0);
    input.set(frame, SILERO_CONTEXT_SAMPLES);
    context = frame.slice(frame.length - SILERO_CONTEXT_SAMPLES);
    return bareProcess(input);
  };
  return model;
}

/** Run the model over a whole clip once; returns one speech probability per 32 ms frame. */
export async function computeFrameProbs(
  model: any,
  samples: Float32Array,
  sampleRate: number
): Promise<Float32Array> {
  model.reset_state();
  const resampler = new Resampler({
    nativeSampleRate: sampleRate,
    targetSampleRate: 16000,
    targetFrameSize: FRAME_SAMPLES,
  });
  const out: number[] = [];
  for await (const frame of resampler.stream(samples)) {
    const probs = await model.process(frame);
    out.push(probs.isSpeech);
  }
  return Float32Array.from(out);
}

const DUMMY_FRAME = new Float32Array(FRAME_SAMPLES);

/**
 * Replay cached frame probabilities through vad-web's real FrameProcessor under `config`.
 * Returns every segment that would have been uploaded (misfires excluded — they never
 * reach the server).
 */
export async function segmentProbs(probs: Float32Array, config: SegmenterConfig): Promise<Segment[]> {
  let i = 0;
  const stubModel = async () => ({ isSpeech: probs[i], notSpeech: 1 - probs[i] });
  const fp = new FrameProcessor(stubModel, () => {}, {
    ...defaultV5FrameProcessorOptions,
    ...config,
    frameSamples: FRAME_SAMPLES,
    submitUserSpeechOnPause: false,
  });
  fp.resume();

  const segments: Segment[] = [];
  let speechStartFrame = -1;
  let lastSpeechFrame = -1;
  let peak = 0;
  let flushing = false;

  const onEvent = (event: any) => {
    switch (event.msg) {
      case Message.FrameProcessed:
        if (speechStartFrame >= 0 || event.probs.isSpeech >= config.positiveSpeechThreshold) {
          peak = Math.max(peak, event.probs.isSpeech);
        }
        if (event.probs.isSpeech >= config.positiveSpeechThreshold) lastSpeechFrame = i;
        break;
      case Message.SpeechStart:
        speechStartFrame = i;
        break;
      case Message.SpeechEnd: {
        const clipFrames = event.audio.length / FRAME_SAMPLES;
        const endFrame = flushing ? probs.length - 1 : i;
        segments.push({
          clipStartFrame: endFrame - clipFrames + 1,
          speechStartFrame,
          endFrame,
          lastSpeechFrame,
          clipMs: clipFrames * FRAME_MS,
          speechFrames: 0,
          peakProb: peak,
        });
        speechStartFrame = -1;
        peak = 0;
        break;
      }
      case Message.VADMisfire:
        speechStartFrame = -1;
        peak = 0;
        break;
    }
  };

  for (i = 0; i < probs.length; i++) {
    await fp.process(DUMMY_FRAME, onEvent);
  }
  flushing = true;
  i = probs.length - 1;
  fp.endSegment(onEvent);
  return segments;
}
