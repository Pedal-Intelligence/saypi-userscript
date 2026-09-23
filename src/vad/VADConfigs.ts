import type { RealTimeVADOptions } from "@ricky0123/vad-web";

/**
 * Preset names for tuning the Silero VAD.
 *
 * Model: every preset runs **Silero v6** (vad-web 0.0.31, #655). vad-web 0.0.24, which we
 * shipped before, fed the v5 model bare 512-sample frames without the 64-sample context
 * window Silero expects (ricky0123/vad#263), so the model saw degraded input. On the #420
 * real corpus, moving to v6 with the context fix, at *unchanged* thresholds, took clipped
 * short words from 8% to 0% and noise/music false-accepts from 41% to 15%. On
 * conversational speech it also cut the share of thoughts split into several uploads from
 * 30% to 22% (bench/vad/README.md, "Fragmentation").
 *
 * Units: durations are milliseconds (vad-web ≥0.0.27). The library converts each to frames
 * with `Math.floor(ms / 32)`, since a v5/v6 frame is 512 samples @ 16 kHz = **32 ms**, so
 * keep every value a multiple of 32 (the spec enforces it). The library's own frame
 * defaults, which the `none` preset inherits, are: positive 0.3, negative 0.25, redemption
 * 1400 ms, minSpeech 400 ms, preSpeechPad 800 ms. Our tuned presets are far tighter: a short
 * silence tail and a low minimum-speech bar, for short, latency-sensitive conversational
 * clips. The #420 admission gate (`segmentAdmission.ts`) backstops the extra false-accept
 * risk.
 *
 * Wiring status (which presets a code path actually selects) — see `selectVADPreset`:
 *  - `balanced`: the preset every context uses by default (#420 item 4). The VAD-quality
 *    benchmark (bench/vad/README.md) put it at the knee of the false-reject/false-accept
 *    trade-off, so it is the host-agnostic default.
 *  - `highSensitivity`: selected only when the user turns on quiet/whisper mode (#437).
 *    It was previously bound to dictation/generic pages too, but the benchmark showed it
 *    false-accepts ~59% of real non-speech there (100% of music) for only a marginal
 *    false-reject edge, so it is no longer any context's default (the gap-#3 fix).
 *  - `none`: the no-override fallback `initializeVAD` resolves to when no (or an
 *    unknown) preset is requested. It inherits the library's frame defaults verbatim but
 *    pins the model, because the library's default model ("legacy") is a file we no
 *    longer ship.
 *
 * Every tuned preset above is reachable, and `test/vad/VADConfigs.spec.ts` locks that
 * as an invariant. A preset no context can select is dead configuration that still
 * reads as an available option to whoever tunes this file next — #571 removed one such
 * (`conservative`, tuned for noisy rooms and wired to nothing for months). If you add a
 * preset, wire it in the same change.
 *
 * When you do, treat **opening** and **closing** as opposed axes rather than one
 * sensitivity dial: raising `positiveSpeechThreshold` makes the VAD harder to trigger on
 * background noise, whereas *lowering* `negativeSpeechThreshold` and lengthening
 * `redemptionMs` is what stops it cutting a sentence short mid-utterance (#572, #655). A
 * single preset that is stricter about opening is strictly worse for chopping.
 */
export type VADPreset = "highSensitivity" | "balanced" | "none";

/**
 * Parameter presets for different use-cases.
 * Only the model choice and the FrameProcessorOptions subset of RealTimeVADOptions are included here.
 * These objects are spread on top of the base MicVAD options when a preset is selected.
 *
 * NOTE: these exact values are locked by `test/vad/VADConfigs.spec.ts` (#420 item 2) —
 * changing any of them is a deliberate, reviewed decision, not an accidental drift.
 */
export const VAD_CONFIGS: Record<VADPreset, Partial<RealTimeVADOptions>> = {
  highSensitivity: {
    model: "v6",
    // Highly responsive: quiet/whispered speech (quiet mode, #437).
    positiveSpeechThreshold: 0.35, // opens on quieter speech than balanced
    negativeSpeechThreshold: 0.2,
    redemptionMs: 384, //             12 frames of silence tail
    minSpeechMs: 64, //               2 frames: accepts very short phrases
    preSpeechPadMs: 96, //            3 frames of pre-roll
    submitUserSpeechOnPause: false,
  },
  balanced: {
    model: "v6",
    // Default: every host and dictation (selectVADPreset).
    positiveSpeechThreshold: 0.4,
    negativeSpeechThreshold: 0.25,
    redemptionMs: 320, //             10 frames of silence tail
    minSpeechMs: 96, //               3 frames
    preSpeechPadMs: 64, //            2 frames of pre-roll
    submitUserSpeechOnPause: false,
  },
  none: {
    // No-override fallback: the library's frame defaults, on the model we ship.
    model: "v6",
  },
};

/** The context that drives VAD preset selection. */
export interface VADSelectionContext {
  /** True on generic / universal-dictation pages; false on dedicated chat sites. */
  isDictation: boolean;
  /**
   * Quiet/whisper mode (#437): the user is speaking quietly (e.g. around others),
   * so trade the benchmark-tuned defaults for the most sensitive preset to catch
   * whispered speech. Off/unset preserves the normal mapping.
   */
  quietMode?: boolean;
}

/**
 * Choose the VAD preset for a context — #420 item 4, driven by the VAD-quality benchmark
 * (`bench/vad/README.md`), not a guess.
 *
 * Both contexts map to `balanced` today:
 *  - Generic / universal-dictation pages were `highSensitivity`, but on the real corpus it
 *    false-accepts ~59% of non-speech there (100% of music) for only a marginal, mostly
 *    isolated-"up" false-reject edge — so the noisiest, least-controlled context no longer
 *    gets the trigger-happiest preset (the issue's gap #3).
 *  - Dedicated chat sites stay `balanced` — the core product and the quietest context, with
 *    no data-backed reason to make them *more* trigger-happy.
 *
 * Quiet/whisper mode (#437) overrides the host mapping with `highSensitivity` so
 * quietly-spoken/whispered speech still opens the gate. Otherwise the host context
 * is unused today but kept as the seam for a future noise/SNR- or device-adaptive
 * split (item 4's remaining refinement), which would re-diverge the mapping.
 */
export function selectVADPreset(context: VADSelectionContext): VADPreset {
  if (context.quietMode) return "highSensitivity";
  return "balanced";
}
