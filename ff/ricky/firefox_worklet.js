"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _common_1 = require("./_common");
class Processor extends AudioWorkletProcessor {
    constructor(options) {
        super();
        this._initialized = false;
        this._stopProcessing = false;
        this.init = async () => {
            console.log("initializing firefox worklet");
            _common_1.log.debug("initializing worklet");
            this.resampler = new _common_1.Resampler({
                nativeSampleRate: sampleRate,
                targetSampleRate: 16000,
                targetFrameSize: 1536,
            });
            this._initialized = true;
            _common_1.log.debug("initialized worklet");
        };
        this.port.onmessage = (ev) => {
            if (ev.data.message === _common_1.Message.SpeechStop) {
                this._stopProcessing = true;
            }
        };
        this.init();
    }
    process(inputs, outputs, parameters) {
        if (this._stopProcessing) {
            return false;
        }
        // @ts-ignore
        const arr = inputs[0][0];
        if (this._initialized && arr instanceof Float32Array) {
            const frames = this.resampler.process(arr);
            for (const frame of frames) {
                this.port.postMessage({ message: _common_1.Message.AudioFrame, data: frame.buffer }, [frame.buffer]);
            }
        }
        return true;
    }
}
registerProcessor("vad-firefox-helper-worklet", Processor);
//# sourceMappingURL=worklet.js.map