import { RealTimeVADOptions } from "@ricky0123/vad-web";

/**
 * Preset names for tuning Silero VAD v5 parameters.
 *
 * Frame timing: at the v5 frame size of 512 samples @ 16 kHz, **1 frame = 32 ms**, so
 * every frame-count below is annotated with its wall-clock equivalent. The Silero v5
 * defaults each value departs from (`defaultV5FrameProcessorOptions`) are: positive
 * 0.5, negative 0.35, redemptionFrames 24 (768 ms), minSpeechFrames 9 (288 ms),
 * preSpeechPadFrames 3 (96 ms). Our tuned presets are uniformly MORE aggressive
 * (lower thresholds, shorter redemption, far fewer min-speech-frames) — the right
 * direction for short, latency-sensitive conversational clips, at the cost of more
 * false-accepts. The #420 admission gate (`segmentAdmission.ts`) backstops that
 * false-accept risk; a VAD-quality benchmark to re-tune these numbers is #420 item 3.
 *
 * Wiring status (which presets a code path actually selects):
 *  - `highSensitivity` / `balanced`: selected by AudioInputMachine from the host —
 *    dictation/generic pages get `highSensitivity`, dedicated chat sites get `balanced`
 *    (revisiting that mapping is #420 item 4).
 *  - `conservative`: a valid noisy-environment preset that **no code path selects yet**.
 *    Kept (not deleted) because #420 item 4 plans to wire it to a noise/SNR estimate;
 *    its values are locked by test so it can't rot in the meantime.
 *  - `none`: the no-override fallback `initializeVAD` resolves to when no (or an
 *    unknown) preset is requested — it inherits the library's v5 defaults verbatim.
 */
export type VADPreset = "highSensitivity" | "balanced" | "conservative" | "none";

/**
 * Parameter presets for different use-cases.
 * Only a subset of RealTimeVADOptions dealing with FrameProcessorOptions are included here.
 * These objects are spread on top of the base MicVAD options when a preset is selected.
 *
 * NOTE: these exact values are locked by `test/vad/VADConfigs.spec.ts` (#420 item 2) —
 * changing any of them is a deliberate, reviewed decision, not an accidental drift.
 */
export const VAD_CONFIGS: Record<VADPreset, Partial<RealTimeVADOptions>> = {
  highSensitivity: {
    model: "v5",
    // Highly responsive – ideal for dictation / very short utterances.
    positiveSpeechThreshold: 0.35, // vs v5 default 0.5 — opens on quieter speech
    negativeSpeechThreshold: 0.2, //  vs v5 default 0.35
    redemptionFrames: 12, //          384 ms tail (vs v5 768 ms) — ends sooner
    minSpeechFrames: 2, //            64 ms min (vs v5 288 ms) — accepts very short phrases
    preSpeechPadFrames: 3, //         96 ms pre-roll (= v5 default)
    submitUserSpeechOnPause: false,
  },
  balanced: {
    model: "v5",
    // Default – good general-purpose trade-off.
    positiveSpeechThreshold: 0.4, //  vs v5 default 0.5
    negativeSpeechThreshold: 0.25, // vs v5 default 0.35
    redemptionFrames: 10, //          320 ms tail (vs v5 768 ms)
    minSpeechFrames: 3, //            96 ms min (vs v5 288 ms)
    preSpeechPadFrames: 2, //         64 ms pre-roll (vs v5 96 ms)
    submitUserSpeechOnPause: false,
  },
  conservative: {
    model: "v5",
    // Noisy environments – lower sensitivity (reserved; not yet selected — see header).
    positiveSpeechThreshold: 0.6, //  vs v5 default 0.5 — needs clearer speech to open
    negativeSpeechThreshold: 0.45, // vs v5 default 0.35
    redemptionFrames: 8, //           256 ms tail (vs v5 768 ms)
    minSpeechFrames: 4, //            128 ms min (vs v5 288 ms)
    preSpeechPadFrames: 1, //         32 ms pre-roll (vs v5 96 ms)
    submitUserSpeechOnPause: false,
  },
  none: {
    // No-override fallback: inherit all base options from Silero VAD v5.
  },
};
