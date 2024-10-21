/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.utils = void 0;
const _utils = __importStar(__webpack_require__(2));
exports.utils = {
    minFramesForTargetMS: _utils.minFramesForTargetMS,
    arrayBufferToBase64: _utils.arrayBufferToBase64,
    encodeWAV: _utils.encodeWAV,
};
__exportStar(__webpack_require__(3), exports);
__exportStar(__webpack_require__(4), exports);
__exportStar(__webpack_require__(5), exports);
__exportStar(__webpack_require__(6), exports);
__exportStar(__webpack_require__(7), exports);
__exportStar(__webpack_require__(8), exports);
//# sourceMappingURL=index.js.map

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.minFramesForTargetMS = minFramesForTargetMS;
exports.arrayBufferToBase64 = arrayBufferToBase64;
exports.encodeWAV = encodeWAV;
function minFramesForTargetMS(targetDuration, frameSamples, sr = 16000) {
    return Math.ceil((targetDuration * sr) / 1000 / frameSamples);
}
function arrayBufferToBase64(buffer) {
    var binary = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}
/*
This rest of this was mostly copied from https://github.com/linto-ai/WebVoiceSDK
*/
function encodeWAV(samples, format = 3, sampleRate = 16000, numChannels = 1, bitDepth = 32) {
    var bytesPerSample = bitDepth / 8;
    var blockAlign = numChannels * bytesPerSample;
    var buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);
    var view = new DataView(buffer);
    /* RIFF identifier */
    writeString(view, 0, "RIFF");
    /* RIFF chunk length */
    view.setUint32(4, 36 + samples.length * bytesPerSample, true);
    /* RIFF type */
    writeString(view, 8, "WAVE");
    /* format chunk identifier */
    writeString(view, 12, "fmt ");
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, format, true);
    /* channel count */
    view.setUint16(22, numChannels, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * blockAlign, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, blockAlign, true);
    /* bits per sample */
    view.setUint16(34, bitDepth, true);
    /* data chunk identifier */
    writeString(view, 36, "data");
    /* data chunk length */
    view.setUint32(40, samples.length * bytesPerSample, true);
    if (format === 1) {
        // Raw PCM
        floatTo16BitPCM(view, 44, samples);
    }
    else {
        writeFloat32(view, 44, samples);
    }
    return buffer;
}
function interleave(inputL, inputR) {
    var length = inputL.length + inputR.length;
    var result = new Float32Array(length);
    var index = 0;
    var inputIndex = 0;
    while (index < length) {
        result[index++] = inputL[inputIndex];
        result[index++] = inputR[inputIndex];
        inputIndex++;
    }
    return result;
}
function writeFloat32(output, offset, input) {
    for (var i = 0; i < input.length; i++, offset += 4) {
        output.setFloat32(offset, input[i], true);
    }
}
function floatTo16BitPCM(output, offset, input) {
    for (var i = 0; i < input.length; i++, offset += 2) {
        var s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
}
function writeString(view, offset, string) {
    for (var i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}
//# sourceMappingURL=utils.js.map

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlatformAgnosticNonRealTimeVAD = exports.defaultNonRealTimeVADOptions = void 0;
const frame_processor_1 = __webpack_require__(4);
const messages_1 = __webpack_require__(5);
const models_1 = __webpack_require__(7);
const resampler_1 = __webpack_require__(8);
exports.defaultNonRealTimeVADOptions = {
    ...frame_processor_1.defaultFrameProcessorOptions,
    ortConfig: undefined,
};
class PlatformAgnosticNonRealTimeVAD {
    static async _new(modelFetcher, ort, options = {}) {
        const fullOptions = {
            ...exports.defaultNonRealTimeVADOptions,
            ...options,
        };
        if (fullOptions.ortConfig !== undefined) {
            fullOptions.ortConfig(ort);
        }
        const vad = new this(modelFetcher, ort, fullOptions);
        await vad.init();
        return vad;
    }
    constructor(modelFetcher, ort, options) {
        this.modelFetcher = modelFetcher;
        this.ort = ort;
        this.options = options;
        this.init = async () => {
            const model = await models_1.Silero.new(this.ort, this.modelFetcher);
            this.frameProcessor = new frame_processor_1.FrameProcessor(model.process, model.reset_state, {
                frameSamples: this.options.frameSamples,
                positiveSpeechThreshold: this.options.positiveSpeechThreshold,
                negativeSpeechThreshold: this.options.negativeSpeechThreshold,
                redemptionFrames: this.options.redemptionFrames,
                preSpeechPadFrames: this.options.preSpeechPadFrames,
                minSpeechFrames: this.options.minSpeechFrames,
                submitUserSpeechOnPause: this.options.submitUserSpeechOnPause,
            });
            this.frameProcessor.resume();
        };
        this.run = async function* (inputAudio, sampleRate) {
            const resamplerOptions = {
                nativeSampleRate: sampleRate,
                targetSampleRate: 16000,
                targetFrameSize: this.options.frameSamples,
            };
            const resampler = new resampler_1.Resampler(resamplerOptions);
            let start = 0;
            let end = 0;
            let frameIndex = 0;
            for await (const frame of resampler.stream(inputAudio)) {
                const { msg, audio } = await this.frameProcessor.process(frame);
                switch (msg) {
                    case messages_1.Message.SpeechStart:
                        start = (frameIndex * this.options.frameSamples) / 16;
                        break;
                    case messages_1.Message.SpeechEnd:
                        end = ((frameIndex + 1) * this.options.frameSamples) / 16;
                        yield { audio, start, end };
                        break;
                    default:
                        break;
                }
                frameIndex++;
            }
            const { msg, audio } = this.frameProcessor.endSegment();
            if (msg == messages_1.Message.SpeechEnd) {
                yield {
                    audio,
                    start,
                    end: (frameIndex * this.options.frameSamples) / 16,
                };
            }
        };
        (0, frame_processor_1.validateOptions)(options);
    }
}
exports.PlatformAgnosticNonRealTimeVAD = PlatformAgnosticNonRealTimeVAD;
//# sourceMappingURL=non-real-time-vad.js.map

/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
Some of this code, together with the default options found in index.ts,
were taken (or took inspiration) from https://github.com/snakers4/silero-vad
*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FrameProcessor = exports.defaultFrameProcessorOptions = void 0;
exports.validateOptions = validateOptions;
const messages_1 = __webpack_require__(5);
const logging_1 = __webpack_require__(6);
const RECOMMENDED_FRAME_SAMPLES = [512, 1024, 1536];
exports.defaultFrameProcessorOptions = {
    positiveSpeechThreshold: 0.5,
    negativeSpeechThreshold: 0.5 - 0.15,
    preSpeechPadFrames: 1,
    redemptionFrames: 8,
    frameSamples: 1536,
    minSpeechFrames: 3,
    submitUserSpeechOnPause: false,
};
function validateOptions(options) {
    if (!RECOMMENDED_FRAME_SAMPLES.includes(options.frameSamples)) {
        logging_1.log.warn("You are using an unusual frame size");
    }
    if (options.positiveSpeechThreshold < 0 ||
        options.negativeSpeechThreshold > 1) {
        logging_1.log.error("postiveSpeechThreshold should be a number between 0 and 1");
    }
    if (options.negativeSpeechThreshold < 0 ||
        options.negativeSpeechThreshold > options.positiveSpeechThreshold) {
        logging_1.log.error("negativeSpeechThreshold should be between 0 and postiveSpeechThreshold");
    }
    if (options.preSpeechPadFrames < 0) {
        logging_1.log.error("preSpeechPadFrames should be positive");
    }
    if (options.redemptionFrames < 0) {
        logging_1.log.error("preSpeechPadFrames should be positive");
    }
}
const concatArrays = (arrays) => {
    const sizes = arrays.reduce((out, next) => {
        out.push(out.at(-1) + next.length);
        return out;
    }, [0]);
    const outArray = new Float32Array(sizes.at(-1));
    arrays.forEach((arr, index) => {
        const place = sizes[index];
        outArray.set(arr, place);
    });
    return outArray;
};
class FrameProcessor {
    constructor(modelProcessFunc, modelResetFunc, options) {
        this.modelProcessFunc = modelProcessFunc;
        this.modelResetFunc = modelResetFunc;
        this.options = options;
        this.speaking = false;
        this.redemptionCounter = 0;
        this.active = false;
        this.reset = () => {
            this.speaking = false;
            this.audioBuffer = [];
            this.modelResetFunc();
            this.redemptionCounter = 0;
        };
        this.pause = () => {
            this.active = false;
            if (this.options.submitUserSpeechOnPause) {
                return this.endSegment();
            }
            else {
                this.reset();
                return {};
            }
        };
        this.resume = () => {
            this.active = true;
        };
        this.endSegment = () => {
            const audioBuffer = this.audioBuffer;
            this.audioBuffer = [];
            const speaking = this.speaking;
            this.reset();
            const speechFrameCount = audioBuffer.reduce((acc, item) => {
                return acc + +item.isSpeech;
            }, 0);
            if (speaking) {
                if (speechFrameCount >= this.options.minSpeechFrames) {
                    const audio = concatArrays(audioBuffer.map((item) => item.frame));
                    return { msg: messages_1.Message.SpeechEnd, audio };
                }
                else {
                    return { msg: messages_1.Message.VADMisfire };
                }
            }
            return {};
        };
        this.process = async (frame) => {
            if (!this.active) {
                return {};
            }
            const probs = await this.modelProcessFunc(frame);
            this.audioBuffer.push({
                frame,
                isSpeech: probs.isSpeech >= this.options.positiveSpeechThreshold,
            });
            if (probs.isSpeech >= this.options.positiveSpeechThreshold &&
                this.redemptionCounter) {
                this.redemptionCounter = 0;
            }
            if (probs.isSpeech >= this.options.positiveSpeechThreshold &&
                !this.speaking) {
                this.speaking = true;
                return { probs, msg: messages_1.Message.SpeechStart };
            }
            if (probs.isSpeech < this.options.negativeSpeechThreshold &&
                this.speaking &&
                ++this.redemptionCounter >= this.options.redemptionFrames) {
                this.redemptionCounter = 0;
                this.speaking = false;
                const audioBuffer = this.audioBuffer;
                this.audioBuffer = [];
                const speechFrameCount = audioBuffer.reduce((acc, item) => {
                    return acc + +item.isSpeech;
                }, 0);
                if (speechFrameCount >= this.options.minSpeechFrames) {
                    const audio = concatArrays(audioBuffer.map((item) => item.frame));
                    return { probs, msg: messages_1.Message.SpeechEnd, audio };
                }
                else {
                    return { probs, msg: messages_1.Message.VADMisfire };
                }
            }
            if (!this.speaking) {
                while (this.audioBuffer.length > this.options.preSpeechPadFrames) {
                    this.audioBuffer.shift();
                }
            }
            return { probs };
        };
        this.audioBuffer = [];
        this.reset();
    }
}
exports.FrameProcessor = FrameProcessor;
//# sourceMappingURL=frame-processor.js.map

/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Message = void 0;
var Message;
(function (Message) {
    Message["AudioFrame"] = "AUDIO_FRAME";
    Message["SpeechStart"] = "SPEECH_START";
    Message["VADMisfire"] = "VAD_MISFIRE";
    Message["SpeechEnd"] = "SPEECH_END";
    Message["SpeechStop"] = "SPEECH_STOP";
})(Message || (exports.Message = Message = {}));
//# sourceMappingURL=messages.js.map

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.log = exports.LOG_PREFIX = void 0;
exports.LOG_PREFIX = "[VAD]";
const levels = ["error", "debug", "warn"];
function getLog(level) {
    return (...args) => {
        console[level](exports.LOG_PREFIX, ...args);
    };
}
const _log = levels.reduce((acc, level) => {
    acc[level] = getLog(level);
    return acc;
}, {});
exports.log = _log;
//# sourceMappingURL=logging.js.map

/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Silero = void 0;
// @ts-ignore
const logging_1 = __webpack_require__(6);
class Silero {
    constructor(ort, modelFetcher) {
        this.ort = ort;
        this.modelFetcher = modelFetcher;
        this.init = async () => {
            logging_1.log.debug("initializing vad");
            const modelArrayBuffer = await this.modelFetcher();
            this._session = await this.ort.InferenceSession.create(modelArrayBuffer);
            this._sr = new this.ort.Tensor("int64", [16000n]);
            this.reset_state();
            logging_1.log.debug("vad is initialized");
        };
        this.reset_state = () => {
            const zeroes = Array(2 * 64).fill(0);
            this._h = new this.ort.Tensor("float32", zeroes, [2, 1, 64]);
            this._c = new this.ort.Tensor("float32", zeroes, [2, 1, 64]);
        };
        this.process = async (audioFrame) => {
            const t = new this.ort.Tensor("float32", audioFrame, [1, audioFrame.length]);
            const inputs = {
                input: t,
                h: this._h,
                c: this._c,
                sr: this._sr,
            };
            const out = await this._session.run(inputs);
            this._h = out.hn;
            this._c = out.cn;
            const [isSpeech] = out.output.data;
            const notSpeech = 1 - isSpeech;
            return { notSpeech, isSpeech };
        };
    }
}
exports.Silero = Silero;
_a = Silero;
Silero.new = async (ort, modelFetcher) => {
    const model = new _a(ort, modelFetcher);
    await model.init();
    return model;
};
//# sourceMappingURL=models.js.map

/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Resampler = void 0;
const logging_1 = __webpack_require__(6);
class Resampler {
    constructor(options) {
        this.options = options;
        this.process = (audioFrame) => {
            const outputFrames = [];
            this.fillInputBuffer(audioFrame);
            while (this.hasEnoughDataForFrame()) {
                const outputFrame = this.generateOutputFrame();
                outputFrames.push(outputFrame);
            }
            return outputFrames;
        };
        this.stream = async function* (audioFrame) {
            this.fillInputBuffer(audioFrame);
            while (this.hasEnoughDataForFrame()) {
                const outputFrame = this.generateOutputFrame();
                yield outputFrame;
            }
        };
        if (options.nativeSampleRate < 16000) {
            logging_1.log.error("nativeSampleRate is too low. Should have 16000 = targetSampleRate <= nativeSampleRate");
        }
        this.inputBuffer = [];
    }
    fillInputBuffer(audioFrame) {
        for (const sample of audioFrame) {
            this.inputBuffer.push(sample);
        }
    }
    hasEnoughDataForFrame() {
        return ((this.inputBuffer.length * this.options.targetSampleRate) /
            this.options.nativeSampleRate >=
            this.options.targetFrameSize);
    }
    generateOutputFrame() {
        const outputFrame = new Float32Array(this.options.targetFrameSize);
        let outputIndex = 0;
        let inputIndex = 0;
        while (outputIndex < this.options.targetFrameSize) {
            let sum = 0;
            let num = 0;
            while (inputIndex <
                Math.min(this.inputBuffer.length, ((outputIndex + 1) * this.options.nativeSampleRate) /
                    this.options.targetSampleRate)) {
                const value = this.inputBuffer[inputIndex];
                if (value !== undefined) {
                    sum += value;
                    num++;
                }
                inputIndex++;
            }
            outputFrame[outputIndex] = sum / num;
            outputIndex++;
        }
        this.inputBuffer = this.inputBuffer.slice(inputIndex);
        return outputFrame;
    }
}
exports.Resampler = Resampler;
//# sourceMappingURL=resampler.js.map

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const _common_1 = __webpack_require__(1);
class Processor extends AudioWorkletProcessor {
    constructor(options) {
        super();
        this._initialized = false;
        this._stopProcessing = false;
        this.init = async () => {
            _common_1.log.debug("initializing worklet");
            this.resampler = new _common_1.Resampler({
                nativeSampleRate: sampleRate,
                targetSampleRate: 16000,
                targetFrameSize: 1536,
            });
            this._initialized = true;
            _common_1.log.debug("initialized worklet");
        };
        this.options = options.processorOptions;
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
registerProcessor("vad-helper-worklet", Processor);
//# sourceMappingURL=worklet.js.map
})();

/******/ })()
;