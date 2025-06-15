import { RealTimeVADOptions } from "@ricky0123/vad-web";

/**
 * Preset names for tuning Silero VAD v5 parameters.
 */
export type VADPreset = "highSensitivity" | "balanced" | "conservative" | "none";

/**
 * Parameter presets for different use-cases.
 * Only a subset of RealTimeVADOptions dealing with FrameProcessorOptions are included here.
 * These objects are spread on top of the base MicVAD options when a preset is selected.
 */
export const VAD_CONFIGS: Record<VADPreset, Partial<RealTimeVADOptions>> = {
  highSensitivity: {
    // Highly responsive – ideal for dictation / very short utterances
    positiveSpeechThreshold: 0.35,
    negativeSpeechThreshold: 0.2,
    redemptionFrames: 12,
    minSpeechFrames: 2,
    preSpeechPadFrames: 3,
    submitUserSpeechOnPause: false,
  },
  balanced: {
    // Default – good general-purpose trade-off
    positiveSpeechThreshold: 0.4,
    negativeSpeechThreshold: 0.25,
    redemptionFrames: 10,
    minSpeechFrames: 3,
    preSpeechPadFrames: 2,
    submitUserSpeechOnPause: false,
  },
  conservative: {
    // Noisy environments – lower sensitivity
    positiveSpeechThreshold: 0.6,
    negativeSpeechThreshold: 0.45,
    redemptionFrames: 8,
    minSpeechFrames: 4,
    preSpeechPadFrames: 1,
    submitUserSpeechOnPause: false,
  },
  none: {
    // inherit all base options from Silero VAD v5
  },
}; 