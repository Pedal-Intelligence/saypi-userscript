import * as ortInstance from "onnxruntime-web";
import { Message, SpeechProbabilities, FrameProcessor, FrameProcessorOptions, OrtOptions } from "./_common";
interface RealTimeVADCallbacks {
    /** Callback to run after each frame. The size (number of samples) of a frame is given by `frameSamples`. */
    onFrameProcessed: (probabilities: SpeechProbabilities) => any;
    /** Callback to run if speech start was detected but `onSpeechEnd` will not be run because the
     * audio segment is smaller than `minSpeechFrames`.
     */
    onVADMisfire: () => any;
    /** Callback to run when speech start is detected */
    onSpeechStart: () => any;
    /**
     * Callback to run when speech end is detected.
     * Takes as arg a Float32Array of audio samples between -1 and 1, sample rate 16000.
     * This will not run if the audio segment is smaller than `minSpeechFrames`.
     */
    onSpeechEnd: (audio: Float32Array) => any;
}
/**
 * Customizable audio constraints for the VAD.
 * Excludes certain constraints that are set for the user by default.
 */
type AudioConstraints = Omit<MediaTrackConstraints, "channelCount" | "echoCancellation" | "autoGainControl" | "noiseSuppression">;
type AssetOptions = {
    workletURL: string;
    modelURL: string;
    modelFetcher: (path: string) => Promise<ArrayBuffer>;
};
interface RealTimeVADOptionsWithoutStream extends FrameProcessorOptions, RealTimeVADCallbacks, OrtOptions, AssetOptions {
    additionalAudioConstraints?: AudioConstraints;
    workletOptions: any;
    stream: undefined;
}
interface RealTimeVADOptionsWithStream extends FrameProcessorOptions, RealTimeVADCallbacks, OrtOptions, AssetOptions {
    stream: MediaStream;
    workletOptions: any;
}
export declare const ort: typeof ortInstance;
export type RealTimeVADOptions = RealTimeVADOptionsWithStream | RealTimeVADOptionsWithoutStream;
export declare const defaultRealTimeVADOptions: RealTimeVADOptions;
export declare class MicVAD {
    options: RealTimeVADOptions;
    private audioContext;
    private stream;
    private audioNodeVAD;
    private sourceNode;
    private listening;
    static new(options?: Partial<RealTimeVADOptions>): Promise<MicVAD>;
    private constructor();
    pause: () => void;
    start: () => void;
    destroy: () => void;
}
export declare class AudioNodeVAD {
    ctx: AudioContext;
    options: RealTimeVADOptions;
    private frameProcessor;
    private entryNode;
    static new(ctx: AudioContext, options?: Partial<RealTimeVADOptions>): Promise<AudioNodeVAD>;
    constructor(ctx: AudioContext, options: RealTimeVADOptions, frameProcessor: FrameProcessor, entryNode: AudioWorkletNode);
    pause: () => void;
    start: () => void;
    receive: (node: AudioNode) => void;
    processFrame: (frame: Float32Array) => Promise<void>;
    handleFrameProcessorEvent: (ev: Partial<{
        probs: SpeechProbabilities;
        msg: Message;
        audio: Float32Array;
    }>) => void;
    destroy: () => void;
}
export {};
//# sourceMappingURL=real-time-vad.d.ts.map