// ==UserScript==
// @name         Say, Pi
// @namespace    http://www.saypi.ai/
// @version      1.4.5
// @description  Speak to Pi with accurate, hands-free conversations powered by OpenAI's Whisper
// @author       Ross Cadogan
// @match        https://pi.ai/talk
// @inject-into  page
// @updateURL    https://app.saypi.ai/saypi.user.js
// @downloadURL  https://app.saypi.ai/saypi.user.js
// @license      MIT
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 2527:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/*
Some of this code, together with the default options found in index.ts,
were taken (or took inspiration) from https://github.com/snakers4/silero-vad
*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FrameProcessor = exports.validateOptions = exports.defaultFrameProcessorOptions = void 0;
const messages_1 = __webpack_require__(5531);
const logging_1 = __webpack_require__(8655);
const RECOMMENDED_FRAME_SAMPLES = [512, 1024, 1536];
exports.defaultFrameProcessorOptions = {
    positiveSpeechThreshold: 0.5,
    negativeSpeechThreshold: 0.5 - 0.15,
    preSpeechPadFrames: 1,
    redemptionFrames: 8,
    frameSamples: 1536,
    minSpeechFrames: 3,
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
exports.validateOptions = validateOptions;
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
            this.reset();
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

/***/ 1978:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
const _utils = __importStar(__webpack_require__(5818));
exports.utils = {
    minFramesForTargetMS: _utils.minFramesForTargetMS,
    arrayBufferToBase64: _utils.arrayBufferToBase64,
    encodeWAV: _utils.encodeWAV,
};
__exportStar(__webpack_require__(4684), exports);
__exportStar(__webpack_require__(2527), exports);
__exportStar(__webpack_require__(5531), exports);
__exportStar(__webpack_require__(8655), exports);
__exportStar(__webpack_require__(2002), exports);
__exportStar(__webpack_require__(8533), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8655:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

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

/***/ 5531:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Message = void 0;
var Message;
(function (Message) {
    Message["AudioFrame"] = "AUDIO_FRAME";
    Message["SpeechStart"] = "SPEECH_START";
    Message["VADMisfire"] = "VAD_MISFIRE";
    Message["SpeechEnd"] = "SPEECH_END";
})(Message = exports.Message || (exports.Message = {}));
//# sourceMappingURL=messages.js.map

/***/ }),

/***/ 2002:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Silero = void 0;
// @ts-ignore
const logging_1 = __webpack_require__(8655);
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
    const model = new Silero(ort, modelFetcher);
    await model.init();
    return model;
};
//# sourceMappingURL=models.js.map

/***/ }),

/***/ 4684:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlatformAgnosticNonRealTimeVAD = exports.defaultNonRealTimeVADOptions = void 0;
const frame_processor_1 = __webpack_require__(2527);
const messages_1 = __webpack_require__(5531);
const models_1 = __webpack_require__(2002);
const resampler_1 = __webpack_require__(8533);
exports.defaultNonRealTimeVADOptions = {
    ...frame_processor_1.defaultFrameProcessorOptions,
};
class PlatformAgnosticNonRealTimeVAD {
    static async _new(modelFetcher, ort, options = {}) {
        const vad = new this(modelFetcher, ort, {
            ...exports.defaultNonRealTimeVADOptions,
            ...options,
        });
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
            const frames = resampler.process(inputAudio);
            let start, end;
            for (const i of [...Array(frames.length)].keys()) {
                const f = frames[i];
                const { msg, audio } = await this.frameProcessor.process(f);
                switch (msg) {
                    case messages_1.Message.SpeechStart:
                        start = (i * this.options.frameSamples) / 16;
                        break;
                    case messages_1.Message.SpeechEnd:
                        end = ((i + 1) * this.options.frameSamples) / 16;
                        // @ts-ignore
                        yield { audio, start, end };
                        break;
                    default:
                        break;
                }
            }
            const { msg, audio } = this.frameProcessor.endSegment();
            if (msg == messages_1.Message.SpeechEnd) {
                yield {
                    audio,
                    // @ts-ignore
                    start,
                    end: (frames.length * this.options.frameSamples) / 16,
                };
            }
        };
        (0, frame_processor_1.validateOptions)(options);
    }
}
exports.PlatformAgnosticNonRealTimeVAD = PlatformAgnosticNonRealTimeVAD;
//# sourceMappingURL=non-real-time-vad.js.map

/***/ }),

/***/ 8533:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Resampler = void 0;
const logging_1 = __webpack_require__(8655);
class Resampler {
    constructor(options) {
        this.options = options;
        this.process = (audioFrame) => {
            const outputFrames = [];
            for (const sample of audioFrame) {
                this.inputBuffer.push(sample);
            }
            while ((this.inputBuffer.length * this.options.targetSampleRate) /
                this.options.nativeSampleRate >
                this.options.targetFrameSize) {
                const outputFrame = new Float32Array(this.options.targetFrameSize);
                let outputIndex = 0;
                let inputIndex = 0;
                while (outputIndex < this.options.targetFrameSize) {
                    let sum = 0;
                    let num = 0;
                    while (inputIndex <
                        Math.min(this.inputBuffer.length, ((outputIndex + 1) * this.options.nativeSampleRate) /
                            this.options.targetSampleRate)) {
                        sum += this.inputBuffer[inputIndex];
                        num++;
                        inputIndex++;
                    }
                    outputFrame[outputIndex] = sum / num;
                    outputIndex++;
                }
                this.inputBuffer = this.inputBuffer.slice(inputIndex);
                outputFrames.push(outputFrame);
            }
            return outputFrames;
        };
        if (options.nativeSampleRate < 16000) {
            logging_1.log.error("nativeSampleRate is too low. Should have 16000 = targetSampleRate <= nativeSampleRate");
        }
        this.inputBuffer = [];
    }
}
exports.Resampler = Resampler;
//# sourceMappingURL=resampler.js.map

/***/ }),

/***/ 5818:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.encodeWAV = exports.arrayBufferToBase64 = exports.minFramesForTargetMS = void 0;
function minFramesForTargetMS(targetDuration, frameSamples, sr = 16000) {
    return Math.ceil((targetDuration * sr) / 1000 / frameSamples);
}
exports.minFramesForTargetMS = minFramesForTargetMS;
function arrayBufferToBase64(buffer) {
    var binary = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}
exports.arrayBufferToBase64 = arrayBufferToBase64;
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
exports.encodeWAV = encodeWAV;
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

/***/ 7709:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.assetPath = void 0;
const currentScript = window.document.currentScript;
let basePath = "";
if (currentScript) {
    basePath = currentScript.src
        .replace(/#.*$/, "")
        .replace(/\?.*$/, "")
        .replace(/\/[^\/]+$/, "/");
}
const assetPath = (file) => {
    return basePath + file;
};
exports.assetPath = assetPath;
//# sourceMappingURL=asset-path.js.map

/***/ }),

/***/ 9762:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.defaultRealTimeVADOptions = exports.AudioNodeVAD = exports.MicVAD = exports.NonRealTimeVAD = exports.Message = exports.FrameProcessor = exports.utils = void 0;
const ort = __importStar(__webpack_require__(9793));
const _common_1 = __webpack_require__(1978);
Object.defineProperty(exports, "FrameProcessor", ({ enumerable: true, get: function () { return _common_1.FrameProcessor; } }));
Object.defineProperty(exports, "Message", ({ enumerable: true, get: function () { return _common_1.Message; } }));
const model_fetcher_1 = __webpack_require__(6756);
const utils_1 = __webpack_require__(2227);
class NonRealTimeVAD extends _common_1.PlatformAgnosticNonRealTimeVAD {
    static async new(options = {}) {
        return await this._new(model_fetcher_1.modelFetcher, ort, options);
    }
}
exports.NonRealTimeVAD = NonRealTimeVAD;
exports.utils = { audioFileToArray: utils_1.audioFileToArray, ..._common_1.utils };
var real_time_vad_1 = __webpack_require__(7759);
Object.defineProperty(exports, "MicVAD", ({ enumerable: true, get: function () { return real_time_vad_1.MicVAD; } }));
Object.defineProperty(exports, "AudioNodeVAD", ({ enumerable: true, get: function () { return real_time_vad_1.AudioNodeVAD; } }));
Object.defineProperty(exports, "defaultRealTimeVADOptions", ({ enumerable: true, get: function () { return real_time_vad_1.defaultRealTimeVADOptions; } }));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6756:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.modelFetcher = void 0;
const asset_path_1 = __webpack_require__(7709);
const modelFetcher = async () => {
    const modelURL = (0, asset_path_1.assetPath)("silero_vad.onnx");
    return await fetch(modelURL).then((r) => r.arrayBuffer());
};
exports.modelFetcher = modelFetcher;
//# sourceMappingURL=model-fetcher.js.map

/***/ }),

/***/ 7759:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AudioNodeVAD = exports.MicVAD = exports.defaultRealTimeVADOptions = void 0;
const ort = __importStar(__webpack_require__(9793));
const _common_1 = __webpack_require__(1978);
const model_fetcher_1 = __webpack_require__(6756);
const asset_path_1 = __webpack_require__(7709);
const _getWorkletURL = () => {
    return (0, asset_path_1.assetPath)("vad.worklet.bundle.min.js");
};
exports.defaultRealTimeVADOptions = {
    ..._common_1.defaultFrameProcessorOptions,
    onFrameProcessed: (probabilities) => { },
    onVADMisfire: () => {
        _common_1.log.debug("VAD misfire");
    },
    onSpeechStart: () => {
        _common_1.log.debug("Detected speech start");
    },
    onSpeechEnd: () => {
        _common_1.log.debug("Detected speech end");
    },
    workletURL: _getWorkletURL(),
    stream: undefined,
};
class MicVAD {
    static async new(options = {}) {
        const vad = new MicVAD({ ...exports.defaultRealTimeVADOptions, ...options });
        await vad.init();
        return vad;
    }
    constructor(options) {
        this.options = options;
        this.listening = false;
        this.init = async () => {
            if (this.options.stream === undefined)
                this.stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        ...this.options.additionalAudioConstraints,
                        channelCount: 1,
                        echoCancellation: true,
                        autoGainControl: true,
                        noiseSuppression: true,
                    },
                });
            else
                this.stream = this.options.stream;
            this.audioContext = new AudioContext();
            const source = new MediaStreamAudioSourceNode(this.audioContext, {
                mediaStream: this.stream,
            });
            this.audioNodeVAD = await AudioNodeVAD.new(this.audioContext, this.options);
            this.audioNodeVAD.receive(source);
        };
        this.pause = () => {
            this.audioNodeVAD.pause();
            this.listening = false;
        };
        this.start = () => {
            this.audioNodeVAD.start();
            this.listening = true;
        };
        (0, _common_1.validateOptions)(options);
    }
}
exports.MicVAD = MicVAD;
class AudioNodeVAD {
    static async new(ctx, options = {}) {
        const vad = new AudioNodeVAD(ctx, {
            ...exports.defaultRealTimeVADOptions,
            ...options,
        });
        await vad.init();
        return vad;
    }
    constructor(ctx, options) {
        this.ctx = ctx;
        this.options = options;
        this.pause = () => {
            this.frameProcessor.pause();
        };
        this.start = () => {
            this.frameProcessor.resume();
        };
        this.receive = (node) => {
            node.connect(this.entryNode);
        };
        this.processFrame = async (frame) => {
            const { probs, msg, audio } = await this.frameProcessor.process(frame);
            if (probs !== undefined) {
                this.options.onFrameProcessed(probs);
            }
            switch (msg) {
                case _common_1.Message.SpeechStart:
                    this.options.onSpeechStart();
                    break;
                case _common_1.Message.VADMisfire:
                    this.options.onVADMisfire();
                    break;
                case _common_1.Message.SpeechEnd:
                    // @ts-ignore
                    this.options.onSpeechEnd(audio);
                    break;
                default:
                    break;
            }
        };
        this.init = async () => {
            await this.ctx.audioWorklet.addModule(this.options.workletURL);
            const vadNode = new AudioWorkletNode(this.ctx, "vad-helper-worklet", {
                processorOptions: {
                    frameSamples: this.options.frameSamples,
                },
            });
            this.entryNode = vadNode;
            const model = await _common_1.Silero.new(ort, model_fetcher_1.modelFetcher);
            this.frameProcessor = new _common_1.FrameProcessor(model.process, model.reset_state, {
                frameSamples: this.options.frameSamples,
                positiveSpeechThreshold: this.options.positiveSpeechThreshold,
                negativeSpeechThreshold: this.options.negativeSpeechThreshold,
                redemptionFrames: this.options.redemptionFrames,
                preSpeechPadFrames: this.options.preSpeechPadFrames,
                minSpeechFrames: this.options.minSpeechFrames,
            });
            vadNode.port.onmessage = async (ev) => {
                switch (ev.data?.message) {
                    case _common_1.Message.AudioFrame:
                        const buffer = ev.data.data;
                        const frame = new Float32Array(buffer);
                        await this.processFrame(frame);
                        break;
                    default:
                        break;
                }
            };
        };
        (0, _common_1.validateOptions)(options);
    }
}
exports.AudioNodeVAD = AudioNodeVAD;
//# sourceMappingURL=real-time-vad.js.map

/***/ }),

/***/ 2227:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.audioFileToArray = void 0;
async function audioFileToArray(audioFileData) {
    const ctx = new OfflineAudioContext(1, 1, 44100);
    const reader = new FileReader();
    let audioBuffer = null;
    await new Promise((res) => {
        reader.addEventListener("loadend", (ev) => {
            const audioData = reader.result;
            ctx.decodeAudioData(audioData, (buffer) => {
                audioBuffer = buffer;
                ctx
                    .startRendering()
                    .then((renderedBuffer) => {
                    console.log("Rendering completed successfully");
                    res();
                })
                    .catch((err) => {
                    console.error(`Rendering failed: ${err}`);
                });
            }, (e) => {
                console.log(`Error with decoding audio data: ${e}`);
            });
        });
        reader.readAsArrayBuffer(audioFileData);
    });
    if (audioBuffer === null) {
        throw Error("some shit");
    }
    let _audioBuffer = audioBuffer;
    let out = new Float32Array(_audioBuffer.length);
    for (let i = 0; i < _audioBuffer.length; i++) {
        for (let j = 0; j < _audioBuffer.numberOfChannels; j++) {
            // @ts-ignore
            out[i] += _audioBuffer.getChannelData(j)[i];
        }
    }
    return { audio: out, sampleRate: _audioBuffer.sampleRate };
}
exports.audioFileToArray = audioFileToArray;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 9793:
/***/ ((module) => {

/*!
* ONNX Runtime Web v1.15.1
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT License.
*/
!function(e,t){ true?module.exports=t():0}(self,(()=>(()=>{var __webpack_modules__={8453:(e,t,n)=>{"use strict";n.r(t),n.d(t,{InferenceSession:()=>f,Tensor:()=>p,env:()=>a,registerBackend:()=>i});const r={},o=[],i=(e,t,n)=>{if(!t||"function"!=typeof t.init||"function"!=typeof t.createSessionHandler)throw new TypeError("not a valid backend");{const i=r[e];if(void 0===i)r[e]={backend:t,priority:n};else{if(i.priority>n)return;if(i.priority===n&&i.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${n}`)}if(n>=0){const t=o.indexOf(e);-1!==t&&o.splice(t,1);for(let t=0;t<o.length;t++)if(r[o[t]].priority<=n)return void o.splice(t,0,e);o.push(e)}}},a=new class{constructor(){this.wasm={},this.webgl={},this.webgpu={},this.logLevelInternal="warning"}set logLevel(e){if(void 0!==e){if("string"!=typeof e||-1===["verbose","info","warning","error","fatal"].indexOf(e))throw new Error(`Unsupported logging level: ${e}`);this.logLevelInternal=e}}get logLevel(){return this.logLevelInternal}},s=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array]]),u=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]);let l=!1;class c{constructor(e,t,n){let r,o,i;if((()=>{if(!l){l=!0;const e="undefined"!=typeof BigInt64Array&&"function"==typeof BigInt64Array.from,t="undefined"!=typeof BigUint64Array&&"function"==typeof BigUint64Array.from;e&&(s.set("int64",BigInt64Array),u.set(BigInt64Array,"int64")),t&&(s.set("uint64",BigUint64Array),u.set(BigUint64Array,"uint64"))}})(),"string"==typeof e)if(r=e,i=n,"string"===e){if(!Array.isArray(t))throw new TypeError("A string tensor's data must be a string array.");o=t}else{const n=s.get(e);if(void 0===n)throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t))o=n.from(t);else{if(!(t instanceof n))throw new TypeError(`A ${r} tensor's data must be type of ${n}`);o=t}}else if(i=t,Array.isArray(e)){if(0===e.length)throw new TypeError("Tensor type cannot be inferred from an empty array.");const t=typeof e[0];if("string"===t)r="string",o=e;else{if("boolean"!==t)throw new TypeError(`Invalid element type of data array: ${t}.`);r="bool",o=Uint8Array.from(e)}}else{const t=u.get(e.constructor);if(void 0===t)throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);r=t,o=e}if(void 0===i)i=[o.length];else if(!Array.isArray(i))throw new TypeError("A tensor's dims must be a number array");const a=(e=>{let t=1;for(let n=0;n<e.length;n++){const r=e[n];if("number"!=typeof r||!Number.isSafeInteger(r))throw new TypeError(`dims[${n}] must be an integer, got: ${r}`);if(r<0)throw new RangeError(`dims[${n}] must be a non-negative integer, got: ${r}`);t*=r}return t})(i);if(a!==o.length)throw new Error(`Tensor's size(${a}) does not match data length(${o.length}).`);this.dims=i,this.type=r,this.data=o,this.size=a}static bufferToTensor(e,t){if(void 0===e)throw new Error("Image buffer must be defined");if(void 0===t.height||void 0===t.width)throw new Error("Image height and width must be defined");if("NHWC"===t.tensorLayout)throw new Error("NHWC Tensor layout is not supported yet");const{height:n,width:r}=t,o=t.norm??{mean:255,bias:0};let i,a;i="number"==typeof o.mean?[o.mean,o.mean,o.mean,o.mean]:[o.mean[0],o.mean[1],o.mean[2],o.mean[3]??255],a="number"==typeof o.bias?[o.bias,o.bias,o.bias,o.bias]:[o.bias[0],o.bias[1],o.bias[2],o.bias[3]??0];const s=void 0!==t.bitmapFormat?t.bitmapFormat:"RGBA",u=void 0!==t.tensorFormat&&void 0!==t.tensorFormat?t.tensorFormat:"RGB",l=n*r,p="RGBA"===u?new Float32Array(4*l):new Float32Array(3*l);let d=4,f=0,h=1,g=2,m=3,b=0,y=l,w=2*l,_=-1;"RGB"===s&&(d=3,f=0,h=1,g=2,m=-1),"RGBA"===u?_=3*l:"RBG"===u?(b=0,w=l,y=2*l):"BGR"===u&&(w=0,y=l,b=2*l);for(let t=0;t<l;t++,f+=d,g+=d,h+=d,m+=d)p[b++]=(e[f]+a[0])/i[0],p[y++]=(e[h]+a[1])/i[1],p[w++]=(e[g]+a[2])/i[2],-1!==_&&-1!==m&&(p[_++]=(e[m]+a[3])/i[3]);return new c("float32",p,"RGBA"===u?[1,4,n,r]:[1,3,n,r])}static async fromImage(e,t){const n="undefined"!=typeof HTMLImageElement&&e instanceof HTMLImageElement,r="undefined"!=typeof ImageData&&e instanceof ImageData,o="undefined"!=typeof ImageBitmap&&e instanceof ImageBitmap,i="string"==typeof e;let a,s=t??{};if(n){const n=document.createElement("canvas");n.width=e.width,n.height=e.height;const r=n.getContext("2d");if(null==r)throw new Error("Can not access image data");{let n=e.height,o=e.width;if(void 0!==t&&void 0!==t.resizedHeight&&void 0!==t.resizedWidth&&(n=t.resizedHeight,o=t.resizedWidth),void 0!==t){if(s=t,void 0!==t.tensorFormat)throw new Error("Image input config format must be RGBA for HTMLImageElement");if(s.tensorFormat="RGBA",void 0!==t.height&&t.height!==n)throw new Error("Image input config height doesn't match HTMLImageElement height");if(s.height=n,void 0!==t.width&&t.width!==o)throw new Error("Image input config width doesn't match HTMLImageElement width");s.width=o}else s.tensorFormat="RGBA",s.height=n,s.width=o;r.drawImage(e,0,0),a=r.getImageData(0,0,o,n).data}}else{if(!r){if(o){if(void 0===t)throw new Error("Please provide image config with format for Imagebitmap");if(void 0!==t.bitmapFormat)throw new Error("Image input config format must be defined for ImageBitmap");const n=document.createElement("canvas").getContext("2d");if(null!=n){const r=e.height,o=e.width;if(n.drawImage(e,0,0,o,r),a=n.getImageData(0,0,o,r).data,void 0!==t){if(void 0!==t.height&&t.height!==r)throw new Error("Image input config height doesn't match ImageBitmap height");if(s.height=r,void 0!==t.width&&t.width!==o)throw new Error("Image input config width doesn't match ImageBitmap width");s.width=o}else s.height=r,s.width=o;return c.bufferToTensor(a,s)}throw new Error("Can not access image data")}if(i)return new Promise(((n,r)=>{const o=document.createElement("canvas"),i=o.getContext("2d");if(!e||!i)return r();const a=new Image;a.crossOrigin="Anonymous",a.src=e,a.onload=()=>{o.width=a.width,o.height=a.height,i.drawImage(a,0,0,o.width,o.height);const e=i.getImageData(0,0,o.width,o.height);if(void 0!==t){if(void 0!==t.height&&t.height!==o.height)throw new Error("Image input config height doesn't match height");if(s.height=o.height,void 0!==t.width&&t.width!==o.width)throw new Error("Image input config width doesn't match width");s.width=o.width}else s.height=o.height,s.width=o.width;n(c.bufferToTensor(e.data,s))}}));throw new Error("Input data provided is not supported - aborted tensor creation")}{const n="RGBA";let r,o;if(void 0!==t&&void 0!==t.resizedWidth&&void 0!==t.resizedHeight?(r=t.resizedHeight,o=t.resizedWidth):(r=e.height,o=e.width),void 0!==t){if(s=t,void 0!==t.bitmapFormat&&t.bitmapFormat!==n)throw new Error("Image input config format must be RGBA for ImageData");s.bitmapFormat="RGBA"}else s.bitmapFormat="RGBA";if(s.height=r,s.width=o,void 0!==t){const t=document.createElement("canvas");t.width=o,t.height=r;const n=t.getContext("2d");if(null==n)throw new Error("Can not access image data");n.putImageData(e,0,0),a=n.getImageData(0,0,o,r).data}else a=e.data}}if(void 0!==a)return c.bufferToTensor(a,s);throw new Error("Input data provided is not supported - aborted tensor creation")}toDataURL(e){const t=document.createElement("canvas");t.width=this.dims[3],t.height=this.dims[2];const n=t.getContext("2d");if(null!=n){let r,o;void 0!==e?.tensorLayout&&"NHWC"===e.tensorLayout?(r=this.dims[2],o=this.dims[3]):(r=this.dims[3],o=this.dims[2]);const i=void 0!==e?.format?e.format:"RGB",a=e?.norm;let s,u;void 0===a||void 0===a.mean?s=[255,255,255,255]:"number"==typeof a.mean?s=[a.mean,a.mean,a.mean,a.mean]:(s=[a.mean[0],a.mean[1],a.mean[2],0],void 0!==a.mean[3]&&(s[3]=a.mean[3])),void 0===a||void 0===a.bias?u=[0,0,0,0]:"number"==typeof a.bias?u=[a.bias,a.bias,a.bias,a.bias]:(u=[a.bias[0],a.bias[1],a.bias[2],0],void 0!==a.bias[3]&&(u[3]=a.bias[3]));const l=o*r;let c=0,p=l,d=2*l,f=-1;"RGBA"===i?(c=0,p=l,d=2*l,f=3*l):"RGB"===i?(c=0,p=l,d=2*l):"RBG"===i&&(c=0,d=l,p=2*l);for(let e=0;e<o;e++)for(let t=0;t<r;t++){const r=(this.data[c++]-u[0])*s[0],o=(this.data[p++]-u[1])*s[1],i=(this.data[d++]-u[2])*s[2],a=-1===f?255:(this.data[f++]-u[3])*s[3];n.fillStyle="rgba("+r+","+o+","+i+","+a+")",n.fillRect(t,e,1,1)}return t.toDataURL()}throw new Error("Can not access image data")}toImageData(e){const t=document.createElement("canvas").getContext("2d");let n;if(null==t)throw new Error("Can not access image data");{let r,o,i;void 0!==e?.tensorLayout&&"NHWC"===e.tensorLayout?(r=this.dims[2],o=this.dims[1],i=this.dims[3]):(r=this.dims[3],o=this.dims[2],i=this.dims[1]);const a=void 0!==e&&void 0!==e.format?e.format:"RGB",s=e?.norm;let u,l;void 0===s||void 0===s.mean?u=[255,255,255,255]:"number"==typeof s.mean?u=[s.mean,s.mean,s.mean,s.mean]:(u=[s.mean[0],s.mean[1],s.mean[2],255],void 0!==s.mean[3]&&(u[3]=s.mean[3])),void 0===s||void 0===s.bias?l=[0,0,0,0]:"number"==typeof s.bias?l=[s.bias,s.bias,s.bias,s.bias]:(l=[s.bias[0],s.bias[1],s.bias[2],0],void 0!==s.bias[3]&&(l[3]=s.bias[3]));const c=o*r;if(void 0!==e){if(void 0!==e.height&&e.height!==o)throw new Error("Image output config height doesn't match tensor height");if(void 0!==e.width&&e.width!==r)throw new Error("Image output config width doesn't match tensor width");if(void 0!==e.format&&4===i&&"RGBA"!==e.format||3===i&&"RGB"!==e.format&&"BGR"!==e.format)throw new Error("Tensor format doesn't match input tensor dims")}const p=4;let d=0,f=1,h=2,g=3,m=0,b=c,y=2*c,w=-1;"RGBA"===a?(m=0,b=c,y=2*c,w=3*c):"RGB"===a?(m=0,b=c,y=2*c):"RBG"===a&&(m=0,y=c,b=2*c),n=t.createImageData(r,o);for(let e=0;e<o*r;d+=p,f+=p,h+=p,g+=p,e++)n.data[d]=(this.data[m++]-l[0])*u[0],n.data[f]=(this.data[b++]-l[1])*u[1],n.data[h]=(this.data[y++]-l[2])*u[2],n.data[g]=-1===w?255:(this.data[w++]-l[3])*u[3]}return n}reshape(e){return new c(this.type,this.data,e)}}const p=c;class d{constructor(e){this.handler=e}async run(e,t,n){const r={};let o={};if("object"!=typeof e||null===e||e instanceof p||Array.isArray(e))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let i=!0;if("object"==typeof t){if(null===t)throw new TypeError("Unexpected argument[1]: cannot be null.");if(t instanceof p)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(t)){if(0===t.length)throw new TypeError("'fetches' cannot be an empty array.");i=!1;for(const e of t){if("string"!=typeof e)throw new TypeError("'fetches' must be a string array or an object.");if(-1===this.outputNames.indexOf(e))throw new RangeError(`'fetches' contains invalid output name: ${e}.`);r[e]=null}if("object"==typeof n&&null!==n)o=n;else if(void 0!==n)throw new TypeError("'options' must be an object.")}else{let e=!1;const a=Object.getOwnPropertyNames(t);for(const n of this.outputNames)if(-1!==a.indexOf(n)){const o=t[n];(null===o||o instanceof p)&&(e=!0,i=!1,r[n]=o)}if(e){if("object"==typeof n&&null!==n)o=n;else if(void 0!==n)throw new TypeError("'options' must be an object.")}else o=t}}else if(void 0!==t)throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(const t of this.inputNames)if(void 0===e[t])throw new Error(`input '${t}' is missing in 'feeds'.`);if(i)for(const e of this.outputNames)r[e]=null;const a=await this.handler.run(e,r,o),s={};for(const e in a)Object.hasOwnProperty.call(a,e)&&(s[e]=new p(a[e].type,a[e].data,a[e].dims));return s}static async create(e,t,n,i){let a,s={};if("string"==typeof e){if(a=e,"object"==typeof t&&null!==t)s=t;else if(void 0!==t)throw new TypeError("'options' must be an object.")}else if(e instanceof Uint8Array){if(a=e,"object"==typeof t&&null!==t)s=t;else if(void 0!==t)throw new TypeError("'options' must be an object.")}else{if(!(e instanceof ArrayBuffer||"undefined"!=typeof SharedArrayBuffer&&e instanceof SharedArrayBuffer))throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");{const r=e;let o=0,u=e.byteLength;if("object"==typeof t&&null!==t)s=t;else if("number"==typeof t){if(o=t,!Number.isSafeInteger(o))throw new RangeError("'byteOffset' must be an integer.");if(o<0||o>=r.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${r.byteLength}).`);if(u=e.byteLength-o,"number"==typeof n){if(u=n,!Number.isSafeInteger(u))throw new RangeError("'byteLength' must be an integer.");if(u<=0||o+u>r.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${r.byteLength-o}].`);if("object"==typeof i&&null!==i)s=i;else if(void 0!==i)throw new TypeError("'options' must be an object.")}else if(void 0!==n)throw new TypeError("'byteLength' must be a number.")}else if(void 0!==t)throw new TypeError("'options' must be an object.");a=new Uint8Array(r,o,u)}}const u=(s.executionProviders||[]).map((e=>"string"==typeof e?e:e.name)),l=await(async e=>{const t=0===e.length?o:e,n=[];for(const e of t){const t=r[e];if(t){if(t.initialized)return t.backend;if(t.aborted)continue;const r=!!t.initPromise;try{return r||(t.initPromise=t.backend.init()),await t.initPromise,t.initialized=!0,t.backend}catch(o){r||n.push({name:e,err:o}),t.aborted=!0}finally{delete t.initPromise}}}throw new Error(`no available backend found. ERR: ${n.map((e=>`[${e.name}] ${e.err}`)).join(", ")}`)})(u),c=await l.createSessionHandler(a,s);return new d(c)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}}const f=d},5716:(e,t,n)=>{"use strict";t.R=void 0;const r=n(6027),o=n(1723);t.R=new class{async init(){}async createSessionHandler(e,t){const n=new r.Session(t);return await n.loadModel(e),new o.OnnxjsSessionHandler(n)}}},2818:(e,t,n)=>{"use strict";t.c8=t.rX=void 0;const r=n(8453),o=n(5381),i=n(9544),a=n(6640);t.rX=()=>{if(("number"!=typeof r.env.wasm.initTimeout||r.env.wasm.initTimeout<0)&&(r.env.wasm.initTimeout=0),"boolean"!=typeof r.env.wasm.simd&&(r.env.wasm.simd=!0),"boolean"!=typeof r.env.wasm.proxy&&(r.env.wasm.proxy=!1),"number"!=typeof r.env.wasm.numThreads||!Number.isInteger(r.env.wasm.numThreads)||r.env.wasm.numThreads<=0){const e="undefined"==typeof navigator?(0,o.cpus)().length:navigator.hardwareConcurrency;r.env.wasm.numThreads=Math.min(4,Math.ceil((e||1)/2))}},t.c8=new class{async init(){(0,t.rX)(),await(0,i.initWasm)()}async createSessionHandler(e,t){const n=new a.OnnxruntimeWebAssemblySessionHandler;return await n.loadModel(e,t),Promise.resolve(n)}}},1057:function(e,t,n){"use strict";var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){void 0===r&&(r=n);var o=Object.getOwnPropertyDescriptor(t,n);o&&!("get"in o?!t.__esModule:o.writable||o.configurable)||(o={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,r,o)}:function(e,t,n,r){void 0===r&&(r=n),e[r]=t[n]}),o=this&&this.__exportStar||function(e,t){for(var n in e)"default"===n||Object.prototype.hasOwnProperty.call(t,n)||r(t,e,n)};Object.defineProperty(t,"__esModule",{value:!0}),o(n(8453),t);const i=n(8453);{const e=n(5716).R;(0,i.registerBackend)("webgl",e,-10)}{const e=n(2818).c8;(0,i.registerBackend)("cpu",e,10),(0,i.registerBackend)("wasm",e,10),(0,i.registerBackend)("xnnpack",e,9)}},4910:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.createAttributeWithCacheKey=void 0;class n{constructor(e){Object.assign(this,e)}get cacheKey(){return this._cacheKey||(this._cacheKey=Object.getOwnPropertyNames(this).sort().map((e=>`${this[e]}`)).join(";")),this._cacheKey}}t.createAttributeWithCacheKey=e=>new n(e)},6874:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Attribute=void 0;const r=n(1446),o=n(1287),i=n(9240),a=n(7273);var s=o.onnxruntime.experimental.fbs;class u{constructor(e){if(this._attributes=new Map,null!=e){for(const t of e)t instanceof r.onnx.AttributeProto?this._attributes.set(t.name,[u.getValue(t),u.getType(t)]):t instanceof s.Attribute&&this._attributes.set(t.name(),[u.getValue(t),u.getType(t)]);if(this._attributes.size<e.length)throw new Error("duplicated attribute names")}}set(e,t,n){this._attributes.set(e,[n,t])}delete(e){this._attributes.delete(e)}getFloat(e,t){return this.get(e,"float",t)}getInt(e,t){return this.get(e,"int",t)}getString(e,t){return this.get(e,"string",t)}getTensor(e,t){return this.get(e,"tensor",t)}getFloats(e,t){return this.get(e,"floats",t)}getInts(e,t){return this.get(e,"ints",t)}getStrings(e,t){return this.get(e,"strings",t)}getTensors(e,t){return this.get(e,"tensors",t)}get(e,t,n){const r=this._attributes.get(e);if(void 0===r){if(void 0!==n)return n;throw new Error(`required attribute not found: ${e}`)}if(r[1]!==t)throw new Error(`type mismatch: expected ${t} but got ${r[1]}`);return r[0]}static getType(e){const t=e instanceof r.onnx.AttributeProto?e.type:e.type();switch(t){case r.onnx.AttributeProto.AttributeType.FLOAT:return"float";case r.onnx.AttributeProto.AttributeType.INT:return"int";case r.onnx.AttributeProto.AttributeType.STRING:return"string";case r.onnx.AttributeProto.AttributeType.TENSOR:return"tensor";case r.onnx.AttributeProto.AttributeType.FLOATS:return"floats";case r.onnx.AttributeProto.AttributeType.INTS:return"ints";case r.onnx.AttributeProto.AttributeType.STRINGS:return"strings";case r.onnx.AttributeProto.AttributeType.TENSORS:return"tensors";default:throw new Error(`attribute type is not supported yet: ${r.onnx.AttributeProto.AttributeType[t]}`)}}static getValue(e){const t=e instanceof r.onnx.AttributeProto?e.type:e.type();if(t===r.onnx.AttributeProto.AttributeType.GRAPH||t===r.onnx.AttributeProto.AttributeType.GRAPHS)throw new Error("graph attribute is not supported yet");const n=this.getValueNoCheck(e);if(t===r.onnx.AttributeProto.AttributeType.INT&&a.LongUtil.isLong(n))return a.LongUtil.longToNumber(n);if(t===r.onnx.AttributeProto.AttributeType.INTS){const e=n,t=new Array(e.length);for(let n=0;n<e.length;n++){const r=e[n];t[n]=a.LongUtil.longToNumber(r)}return t}if(t===r.onnx.AttributeProto.AttributeType.TENSOR)return e instanceof r.onnx.AttributeProto?i.Tensor.fromProto(n):i.Tensor.fromOrtTensor(n);if(t===r.onnx.AttributeProto.AttributeType.TENSORS){if(e instanceof r.onnx.AttributeProto)return n.map((e=>i.Tensor.fromProto(e)));if(e instanceof s.Attribute)return n.map((e=>i.Tensor.fromOrtTensor(e)))}if(t===r.onnx.AttributeProto.AttributeType.STRING&&e instanceof r.onnx.AttributeProto){const e=n;return(0,a.decodeUtf8String)(e)}return t===r.onnx.AttributeProto.AttributeType.STRINGS&&e instanceof r.onnx.AttributeProto?n.map(a.decodeUtf8String):n}static getValueNoCheck(e){return e instanceof r.onnx.AttributeProto?this.getValueNoCheckFromOnnxFormat(e):this.getValueNoCheckFromOrtFormat(e)}static getValueNoCheckFromOnnxFormat(e){switch(e.type){case r.onnx.AttributeProto.AttributeType.FLOAT:return e.f;case r.onnx.AttributeProto.AttributeType.INT:return e.i;case r.onnx.AttributeProto.AttributeType.STRING:return e.s;case r.onnx.AttributeProto.AttributeType.TENSOR:return e.t;case r.onnx.AttributeProto.AttributeType.GRAPH:return e.g;case r.onnx.AttributeProto.AttributeType.FLOATS:return e.floats;case r.onnx.AttributeProto.AttributeType.INTS:return e.ints;case r.onnx.AttributeProto.AttributeType.STRINGS:return e.strings;case r.onnx.AttributeProto.AttributeType.TENSORS:return e.tensors;case r.onnx.AttributeProto.AttributeType.GRAPHS:return e.graphs;default:throw new Error(`unsupported attribute type: ${r.onnx.AttributeProto.AttributeType[e.type]}`)}}static getValueNoCheckFromOrtFormat(e){switch(e.type()){case s.AttributeType.FLOAT:return e.f();case s.AttributeType.INT:return e.i();case s.AttributeType.STRING:return e.s();case s.AttributeType.TENSOR:return e.t();case s.AttributeType.GRAPH:return e.g();case s.AttributeType.FLOATS:return e.floatsArray();case s.AttributeType.INTS:{const t=[];for(let n=0;n<e.intsLength();n++)t.push(e.ints(n));return t}case s.AttributeType.STRINGS:{const t=[];for(let n=0;n<e.stringsLength();n++)t.push(e.strings(n));return t}case s.AttributeType.TENSORS:{const t=[];for(let n=0;n<e.tensorsLength();n++)t.push(e.tensors(n));return t}default:throw new Error(`unsupported attribute type: ${s.AttributeType[e.type()]}`)}}}t.Attribute=u},1975:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.resolveBackend=t.backend=void 0;const r=n(4418),o=new Map;async function i(e){const n=t.backend;if(void 0!==n[e]&&function(e){const t=e;return"initialize"in t&&"function"==typeof t.initialize&&"createSessionHandler"in t&&"function"==typeof t.createSessionHandler&&"dispose"in t&&"function"==typeof t.dispose}(n[e])){const t=n[e];let r=t.initialize();if("object"==typeof r&&"then"in r&&(r=await r),r)return o.set(e,t),t}}t.backend={webgl:new r.WebGLBackend},t.resolveBackend=async function e(t){if(!t)return e(["webgl"]);{const e="string"==typeof t?[t]:t;for(const t of e){const e=o.get(t);if(e)return e;const n=await i(t);if(n)return n}}throw new Error("no available backend to use")}},4418:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.WebGLBackend=void 0;const r=n(8453),o=n(1315),i=n(2171),a=n(3389);t.WebGLBackend=class{get contextId(){return r.env.webgl.contextId}set contextId(e){r.env.webgl.contextId=e}get matmulMaxBatchSize(){return r.env.webgl.matmulMaxBatchSize}set matmulMaxBatchSize(e){r.env.webgl.matmulMaxBatchSize=e}get textureCacheMode(){return r.env.webgl.textureCacheMode}set textureCacheMode(e){r.env.webgl.textureCacheMode=e}get pack(){return r.env.webgl.pack}set pack(e){r.env.webgl.pack=e}get async(){return r.env.webgl.async}set async(e){r.env.webgl.async=e}initialize(){try{return this.glContext=(0,a.createWebGLContext)(this.contextId),"number"!=typeof this.matmulMaxBatchSize&&(this.matmulMaxBatchSize=16),"string"!=typeof this.textureCacheMode&&(this.textureCacheMode="full"),"boolean"!=typeof this.pack&&(this.pack=!1),"boolean"!=typeof this.async&&(this.async=!1),o.Logger.setWithEnv(r.env),o.Logger.verbose("WebGLBackend",`Created WebGLContext: ${typeof this.glContext} with matmulMaxBatchSize: ${this.matmulMaxBatchSize}; textureCacheMode: ${this.textureCacheMode}; pack: ${this.pack}; async: ${this.async}.`),!0}catch(e){return o.Logger.warning("WebGLBackend",`Unable to initialize WebGLBackend. ${e}`),!1}}createSessionHandler(e){return new i.WebGLSessionHandler(this,e)}dispose(){this.glContext.dispose()}}},6859:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.CoordsGlslLib=void 0;const r=n(7273),o=n(1997),i=n(6757),a=n(7618),s=n(432);class u extends o.GlslLib{constructor(e){super(e)}getFunctions(){return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({},this.offsetToCoords()),this.coordsToOffset()),this.toVec()),this.valueFrom()),this.getCommonUtilFuncs()),this.getInputsSamplingSnippets()),this.getOutputSamplingSnippet())}getCustomTypes(){return{}}offsetToCoords(){return{offsetToCoords:new o.GlslLibRoutine("\n      vec2 offsetToCoords(int offset, int width, int height) {\n        int t = offset / width;\n        int s = offset - t*width;\n        vec2 coords = (vec2(s,t) + vec2(0.5,0.5)) / vec2(width, height);\n        return coords;\n      }\n      ")}}coordsToOffset(){return{coordsToOffset:new o.GlslLibRoutine("\n      int coordsToOffset(vec2 coords, int width, int height) {\n        float s = coords.s * float(width);\n        float t = coords.t * float(height);\n        int offset = int(t) * width + int(s);\n        return offset;\n      }\n      ")}}getOutputSamplingSnippet(){const e=this.context.outputTextureLayout;return e.isPacked?this.getPackedOutputSamplingSnippet(e):this.getUnpackedOutputSamplingSnippet(e)}getPackedOutputSamplingSnippet(e){const t=e.unpackedShape,n=[e.width,e.height],r={},a="getOutputCoords";switch(t.length){case 0:r[a]=this.getOutputScalarCoords();break;case 1:r[a]=this.getOutputPacked1DCoords(t,n);break;case 2:r[a]=this.getOutputPacked2DCoords(t,n);break;case 3:r[a]=this.getOutputPacked3DCoords(t,n);break;default:r[a]=this.getOutputPackedNDCoords(t,n)}const s=`\n      void setOutput(vec4 val) {\n        ${(0,i.getGlsl)(this.context.glContext.version).output} = val;\n      }\n    `;return r.floatTextureSetRGBA=new o.GlslLibRoutine(s),r}getUnpackedOutputSamplingSnippet(e){const t=e.unpackedShape,n=[e.width,e.height],r={},a="getOutputCoords";switch(t.length){case 0:r[a]=this.getOutputScalarCoords();break;case 1:r[a]=this.getOutputUnpacked1DCoords(t,n);break;case 2:r[a]=this.getOutputUnpacked2DCoords(t,n);break;case 3:r[a]=this.getOutputUnpacked3DCoords(t,n);break;case 4:r[a]=this.getOutputUnpacked4DCoords(t,n);break;case 5:r[a]=this.getOutputUnpacked5DCoords(t,n);break;case 6:r[a]=this.getOutputUnpacked6DCoords(t,n);break;default:throw new Error(`Unsupported output dimensionality: ${t.length}`)}const s=`\n        void setOutput(float val) {\n          ${(0,i.getGlsl)(this.context.glContext.version).output} = vec4(val, 0, 0, 0);\n        }\n    `;return r.floatTextureSetR=new o.GlslLibRoutine(s),r}getOutputScalarCoords(){return new o.GlslLibRoutine("\n      int getOutputCoords() {\n        return 0;\n      }\n    ")}getOutputPacked1DCoords(e,t){const n=t;let r="";return 1===n[0]?(r=`\n          int getOutputCoords() {\n            return 2 * int(TexCoords.y * ${n[1]}.0);\n          }\n        `,new o.GlslLibRoutine(r)):1===n[1]?(r=`\n          int getOutputCoords() {\n            return 2 * int(TexCoords.x * ${n[0]}.0);\n          }\n        `,new o.GlslLibRoutine(r)):(r=`\n        int getOutputCoords() {\n          ivec2 resTexRC = ivec2(TexCoords.xy *\n                                 vec2(${n[0]}, ${n[1]}));\n          return 2 * (resTexRC.y * ${n[0]} + resTexRC.x);\n        }\n      `,new o.GlslLibRoutine(r))}getOutputPacked2DCoords(e,t){let n="";if(r.ArrayUtil.arraysEqual(e,t))return n=`\n        ivec2 getOutputCoords() {\n          return 2 * ivec2(TexCoords.xy * vec2(${t[0]}, ${t[1]}));\n        }\n      `,new o.GlslLibRoutine(n);const i=t,a=Math.ceil(e[1]/2);return n=`\n        ivec2 getOutputCoords() {\n          ivec2 resTexRC = ivec2(TexCoords.xy *\n                                vec2(${i[0]}, ${i[1]}));\n\n          int index = resTexRC.y * ${i[0]} + resTexRC.x;\n\n          // reverse r and c order for packed texture\n          int r = imod(index, ${a}) * 2;\n          int c = 2 * (index / ${a});\n\n          return ivec2(r, c);\n        }\n      `,new o.GlslLibRoutine(n)}getOutputPacked3DCoords(e,t){const n=[t[0],t[1]],r=Math.ceil(e[2]/2),i=r*Math.ceil(e[1]/2),a=`\n        ivec3 getOutputCoords() {\n          ivec2 resTexRC = ivec2(TexCoords.xy *\n                                vec2(${n[0]}, ${n[1]}));\n          int index = resTexRC.y * ${n[0]} + resTexRC.x;\n\n          int b = index / ${i};\n          index -= b * ${i};\n\n          // reverse r and c order for packed texture\n          int r = imod(index, ${r}) * 2;\n          int c = 2 * (index / ${r});\n\n          return ivec3(b, r, c);\n        }\n      `;return new o.GlslLibRoutine(a)}getOutputPackedNDCoords(e,t){const n=[t[0],t[1]],r=Math.ceil(e[e.length-1]/2),i=r*Math.ceil(e[e.length-2]/2);let a=i,s="",u="b, r, c";for(let t=2;t<e.length-1;t++)a*=e[e.length-t-1],s=`\n      int b${t} = index / ${a};\n      index -= b${t} * ${a};\n    `+s,u=`b${t}, `+u;const l=`\n      ivec${e.length} getOutputCoords() {\n        ivec2 resTexRC = ivec2(TexCoords.xy *\n                              vec2(${n[0]}, ${n[1]}));\n        int index = resTexRC.y * ${n[0]} + resTexRC.x;\n\n        ${s}\n\n        int b = index / ${i};\n        index -= b * ${i};\n\n        // reverse r and c order for packed texture\n        int r = imod(index, ${r}) * 2;\n        int c = 2 * (index / ${r});\n\n        return ivec${e.length}(${u});\n      }\n    `;return new o.GlslLibRoutine(l)}getOutputUnpacked1DCoords(e,t){const n=`\n        int getOutputCoords() {\n          ivec2 resTexRC = ivec2(TexCoords.xy *\n                                vec2(${t[0]}, ${t[1]}));\n          return resTexRC.y * ${t[0]} + resTexRC.x;\n        }\n      `;return new o.GlslLibRoutine(n)}getOutputUnpacked2DCoords(e,t){const n=`\n        ivec2 getOutputCoords() {\n          ivec2 resTexRC = ivec2(TexCoords.xy *\n                                vec2(${t[0]}, ${t[1]}));\n          int index = resTexRC.y * ${t[0]} + resTexRC.x;\n          int r = index / ${e[1]};\n          int c = index - r * ${e[1]};\n          return ivec2(r, c);\n        }\n      `;return new o.GlslLibRoutine(n)}getOutputUnpacked3DCoords(e,t){let n="";const r=e.length;let i=null;r<2&&(i=[]),i=new Array(r-1),i[r-2]=e[r-1];for(let t=r-3;t>=0;--t)i[t]=i[t+1]*e[t+1];const a=["r","c","d"],s=i.map(((e,t)=>`int ${a[t]} = index / ${e}; ${t===i.length-1?`int ${a[t+1]} = index - ${a[t]} * ${e}`:`index -= ${a[t]} * ${e}`};`)).join("");return n=`\n        ivec3 getOutputCoords() {\n          ivec2 resTexRC = ivec2(TexCoords.xy *\n                                vec2(${t[0]}, ${t[1]}));\n          int index = resTexRC.y * ${t[0]} + resTexRC.x;\n          ${s}\n          return ivec3(r, c, d);\n        }\n      `,new o.GlslLibRoutine(n)}getOutputUnpacked4DCoords(e,t){let n="";const r=e.length;let i=null;r<2&&(i=[]),i=new Array(r-1),i[r-2]=e[r-1];for(let t=r-3;t>=0;--t)i[t]=i[t+1]*e[t+1];const a=["r","c","d","d2"],s=i.map(((e,t)=>`int ${a[t]} = index / ${e}; ${t===i.length-1?`int ${a[t+1]} = index - ${a[t]} * ${e}`:`index -= ${a[t]} * ${e}`};`)).join("");return n=`\n      ivec4 getOutputCoords() {\n          ivec2 resTexRC = ivec2(TexCoords.xy *\n                                vec2(${t[0]}, ${t[1]}));\n          int index = resTexRC.y * ${t[0]} + resTexRC.x;\n          ${s}\n          return ivec4(r, c, d, d2);\n        }\n      `,new o.GlslLibRoutine(n)}getOutputUnpacked5DCoords(e,t){let n="";const r=e.length;let i=null;r<2&&(i=[]),i=new Array(r-1),i[r-2]=e[r-1];for(let t=r-3;t>=0;--t)i[t]=i[t+1]*e[t+1];const a=["r","c","d","d2","d3"],s=i.map(((e,t)=>`int ${a[t]} = index / ${e}; ${t===i.length-1?`int ${a[t+1]} = index - ${a[t]} * ${e}`:`index -= ${a[t]} * ${e}`};`)).join("");return n=`\n      ivec5 getOutputCoords() {\n          ivec2 resTexRC = ivec2(TexCoords.xy *\n                                vec2(${t[0]}, ${t[1]}));\n          int index = resTexRC.y * ${t[0]} + resTexRC.x;\n          ${s}\n          return ivec5(r, c, d, d2, d3);\n        }\n      `,new o.GlslLibRoutine(n)}getOutputUnpacked6DCoords(e,t){let n="";const r=e.length;let i=null;r<2&&(i=[]),i=new Array(r-1),i[r-2]=e[r-1];for(let t=r-3;t>=0;--t)i[t]=i[t+1]*e[t+1];const a=["r","c","d","d2","d3","d4"],s=i.map(((e,t)=>`int ${a[t]} = index / ${e}; ${t===i.length-1?`int ${a[t+1]} = index - ${a[t]} * ${e}`:`index -= ${a[t]} * ${e}`};`)).join("");return n=`\n     ivec6 getOutputCoords() {\n         ivec2 resTexRC = ivec2(TexCoords.xy *\n                               vec2(${t[0]}, ${t[1]}));\n         int index = resTexRC.y * ${t[0]} + resTexRC.x;\n         ${s}\n         return ivec6(r, c, d, d2, d3, d4);\n       }\n     `,new o.GlslLibRoutine(n)}getCommonUtilFuncs(){const e={};let t="uvFromFlat";e[t]=new o.GlslLibRoutine("\n    vec2 uvFromFlat(int texNumR, int texNumC, int index) {\n      int texC = index / texNumR;\n      int texR = index - texC * texNumR;\n      // TODO: swap texR, texC order in following function so row is corresponding to u and column is corresponding to\n      //       v.\n      return (vec2(texR, texC) + halfCR) / vec2(texNumR, texNumC);\n    }\n    "),t="packedUVfrom1D",e[t]=new o.GlslLibRoutine("\n      vec2 packedUVfrom1D(int texNumR, int texNumC, int index) {\n        int texelIndex = index / 2;\n        int texR = texelIndex / texNumC;\n        int texC = texelIndex - texR * texNumC;\n        return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);\n      }\n      "),t="packedUVfrom2D",e[t]=new o.GlslLibRoutine("\n      vec2 packedUVfrom2D(int texNumR, int texNumC, int texelsInLogicalRow, int row, int col) {\n        int texelIndex = (row / 2) * texelsInLogicalRow + (col / 2);\n        int texR = texelIndex / texNumC;\n        int texC = texelIndex - texR * texNumC;\n        return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);\n      }\n      "),t="packedUVfrom3D",e[t]=new o.GlslLibRoutine("\n      vec2 packedUVfrom3D(int texNumR, int texNumC,\n          int texelsInBatch, int texelsInLogicalRow, int b,\n          int row, int col) {\n        int index = b * texelsInBatch + (row / 2) * texelsInLogicalRow + (col / 2);\n        int texR = index / texNumC;\n        int texC = index - texR * texNumC;\n        return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);\n      }\n      "),t="sampleTexture";const n=(0,i.getGlsl)(this.context.glContext.version);return e[t]=new o.GlslLibRoutine(`\n        float sampleTexture(sampler2D textureSampler, vec2 uv) {\n            return ${n.texture2D}(textureSampler, uv).r;\n        }`),e}getInputsSamplingSnippets(){const e={},t=this.context.outputTextureLayout;return this.context.programInfo.inputNames.forEach(((n,r)=>{const o=this.context.inputTextureLayouts[r],i=(0,s.generateShaderFuncNameFromInputSamplerName)(n);o.isPacked?e[i]=this.getPackedSamplerFromInput(i,n,o):e[i]=this.getUnpackedSamplerFromInput(i,n,o);const a=(0,s.generateShaderFuncNameFromInputSamplerNameAtOutCoords)(n);o.unpackedShape.length<=t.unpackedShape.length&&(o.isPacked?e[a]=this.getPackedSamplerAtOutputCoords(a,o,t,n):e[a]=this.getUnpackedSamplerAtOutputCoords(a,o,t,n))})),e}getPackedSamplerAtOutputCoords(e,t,n,i){const a=t.unpackedShape,u=n.unpackedShape,l=i,c=(0,s.generateShaderFuncNameFromInputSamplerName)(l),p=a.length,d=u.length,f=r.BroadcastUtil.getBroadcastDims(a,u),h=(0,s.getCoordsDataType)(d),g=d-p;let m;const b=(0,s.getGlChannels)();m=0===p?"":d<2&&f.length>=1?"coords = 0;":f.map((e=>`coords.${b[e+g]} = 0;`)).join("\n");let y="";y=d<2&&p>0?"coords":a.map(((e,t)=>`coords.${b[t+g]}`)).join(", ");let w="return outputValue;";const _=1===r.ShapeUtil.size(a),v=1===r.ShapeUtil.size(u);if(1!==p||_||v){if(_&&!v)w=1===d?"\n          return vec4(outputValue.x, outputValue.x, 0., 0.);\n        ":"\n          return vec4(outputValue.x);\n        ";else if(f.length){const e=p-2,t=p-1;f.indexOf(e)>-1&&f.indexOf(t)>-1?w="return vec4(outputValue.x);":f.indexOf(e)>-1?w="return vec4(outputValue.x, outputValue.y, outputValue.x, outputValue.y);":f.indexOf(t)>-1&&(w="return vec4(outputValue.xx, outputValue.zz);")}}else w="\n        return vec4(outputValue.xy, outputValue.xy);\n      ";const x=`\n      vec4 ${e}() {\n        ${h} coords = getOutputCoords();\n        \n        int lastDim = coords.${b[d-1]};\n        coords.${b[d-1]} = coords.${b[d-2]};\n        coords.${b[d-2]} = lastDim;\n      \n        ${m}\n        vec4 outputValue = ${c}(${y});\n        ${w}\n      }\n    `;return new o.GlslLibRoutine(x,["coordinates.getOutputCoords"])}getUnpackedSamplerAtOutputCoords(e,t,n,i){const a=[n.width,n.height],u=[t.width,t.height],l=t.unpackedShape.length,c=n.unpackedShape.length,p=t.unpackedShape,d=n.unpackedShape,f=(0,s.generateShaderFuncNameFromInputSamplerName)(i);if(l===c&&r.ArrayUtil.arraysEqual(u,a)){const t=`\n          float ${e}() {\n            return sampleTexture(${i}, TexCoords);\n          }\n        `;return new o.GlslLibRoutine(t,["coordinates.sampleTexture"])}const h=(0,s.getCoordsDataType)(c),g=r.BroadcastUtil.getBroadcastDims(p,d),m=c-l;let b;const y=(0,s.getGlChannels)();b=0===l?"":c<2&&g.length>=1?"coords = 0;":g.map((e=>`coords.${y[e+m]} = 0;`)).join("\n");let w="";w=c<2&&l>0?"coords":t.unpackedShape.map(((e,t)=>`coords.${y[t+m]}`)).join(", ");const _=`\n        float ${e}() {\n          ${h} coords = getOutputCoords();\n          ${b}\n          return ${f}(${w});\n        }\n      `;return new o.GlslLibRoutine(_,["coordinates.getOutputCoords"])}getPackedSamplerFromInput(e,t,n){switch(n.unpackedShape.length){case 0:return this.getPackedSamplerScalar(e,t);case 1:return this.getPackedSampler1D(e,t,n);case 2:return this.getPackedSampler2D(e,t,n);case 3:return this.getPackedSampler3D(e,t,n);default:return this.getPackedSamplerND(e,t,n)}}getUnpackedSamplerFromInput(e,t,n){const r=n.unpackedShape;switch(r.length){case 0:return this.getUnpackedSamplerScalar(e,t,n);case 1:return this.getUnpackedSampler1D(e,t,n);case 2:return this.getUnpackedSampler2D(e,t,n);case 3:return this.getUnpackedSampler3D(e,t,n);case 4:return this.getUnpackedSampler4D(e,t,n);case 5:return this.getUnpackedSampler5D(e,t,n);case 6:return this.getUnpackedSampler6D(e,t,n);default:throw new Error(`Unsupported dimension ${r.length}-D`)}}getPackedSamplerScalar(e,t){const n=`\n          vec4 ${e}() {\n            return ${(0,i.getGlsl)(this.context.glContext.version).texture2D}(${t}, halfCR);\n          }\n        `;return new o.GlslLibRoutine(n)}getPackedSampler1D(e,t,n){const r=[n.width,n.height],a=[r[1],r[0]],s=(0,i.getGlsl)(this.context.glContext.version),u=`vec4 ${e}(int index) {\n      vec2 uv = packedUVfrom1D(\n      ${a[0]}, ${a[1]}, index);\n      return ${s.texture2D}(${t}, uv);\n    }`;return new o.GlslLibRoutine(u,["coordinates.packedUVfrom1D"])}getPackedSampler2D(e,t,n){const a=n.unpackedShape,s=[n.width,n.height],u=(0,i.getGlsl)(this.context.glContext.version),l=s[0],c=s[1];if(null!=s&&r.ArrayUtil.arraysEqual(a,s)){const n=`vec4 ${e}(int row, int col) {\n        vec2 uv = (vec2(col, row) + halfCR) / vec2(${c}.0, ${l}.0);\n        return ${u.texture2D}(${t}, uv);\n      }`;return new o.GlslLibRoutine(n)}const p=s,d=Math.ceil(a[1]/2),f=`vec4 ${e}(int row, int col) {\n      vec2 uv = packedUVfrom2D(${p[1]}, ${p[0]}, ${d}, row, col);\n      return ${u.texture2D}(${t}, uv);\n    }`;return new o.GlslLibRoutine(f,["coordinates.packedUVfrom2D"])}getPackedSampler3D(e,t,n){const r=n.unpackedShape,a=[n.width,n.height],u=[a[0],a[1]],l=(0,i.getGlsl)(this.context.glContext.version);if(1===r[0]){const i=r.slice(1),a=[1,2],u=(0,s.squeezeInputShape)(r,i),l=["b","row","col"],c=JSON.parse(JSON.stringify(n));c.unpackedShape=u;const p=this.getPackedSamplerFromInput(e,t,c),d=`${p.routineBody}\n      vec4 ${e}(int b, int row, int col) {\n        return ${e}(${(0,s.getSqueezedParams)(l,a)});\n      } `;return new o.GlslLibRoutine(d,p.dependencies)}const c=u[0],p=u[1],d=Math.ceil(r[2]/2),f=`vec4 ${e}(int b, int row, int col) {\n      vec2 uv = packedUVfrom3D(\n        ${p}, ${c}, ${d*Math.ceil(r[1]/2)}, ${d}, b, row, col);\n      return ${l.texture2D}(${t}, uv);}`;return new o.GlslLibRoutine(f,["coordinates.packedUVfrom3D"])}getPackedSamplerND(e,t,n){const r=n.unpackedShape,a=r.length,s=[n.width,n.height],u=(0,i.getGlsl)(this.context.glContext.version),l=[s[0],s[1]],c=l[1],p=l[0],d=Math.ceil(r[a-1]/2);let f=d*Math.ceil(r[a-2]/2),h="int b, int row, int col",g=`b * ${f} + (row / 2) * ${d} + (col / 2)`;for(let e=2;e<a-1;e++)h=`int b${e}, `+h,f*=r[a-e-1],g=`b${e} * ${f} + `+g;const m=`vec4 ${e}(${h}) {\n      int index = ${g};\n      int texR = index / ${p};\n      int texC = index - texR * ${p};\n      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${p}, ${c});\n      return ${u.texture2D}(${t}, uv);\n    }`;return new o.GlslLibRoutine(m)}getUnpackedSamplerScalar(e,t,n){const[r,i]=[n.width,n.height];if(1===r&&1===i){const n=`\n          float ${e}() {\n            return sampleTexture(${t}, halfCR);\n          }\n        `;return new o.GlslLibRoutine(n,["coordinates.sampleTexture"])}const a=`\n        float ${e}() {\n          int offset_${t} = coordsToOffset(TexCoords, ${r}, ${i});\n          vec2 uv = uvFromFlat(${r}, ${i}, offset_${t});\n          return sampleTexture(${t}, uv);\n        }\n      `;return new o.GlslLibRoutine(a,["coordinates.uvFromFlat","coordinates.sampleTexture","coordinates.coordsToOffset"])}getUnpackedSampler1D(e,t,n){const r=n.width,i=n.height;if(1===i&&1===r){const n=`\n        float ${e}(int index) {\n          return sampleTexture(${t}, halfCR);\n        }\n      `;return new o.GlslLibRoutine(n,["coordinates.sampleTexture"])}if(1===i){const n=`\n          float ${e}(int index) {\n            vec2 uv = vec2((float(index) + 0.5) / ${r}.0, 0.5);\n            return sampleTexture(${t}, uv);\n          }\n        `;return new o.GlslLibRoutine(n,["coordinates.sampleTexture"])}if(1===r){const n=`\n          float ${e}(int index) {\n            vec2 uv = vec2(0.5, (float(index) + 0.5) / ${i}.0);\n            return sampleTexture(${t}, uv);\n          }\n        `;return new o.GlslLibRoutine(n,["coordinates.sampleTexture"])}const a=`\n        float ${e}(int index) {\n          vec2 uv = uvFromFlat(${r}, ${i}, index);\n          return sampleTexture(${t}, uv);\n        }\n      `;return new o.GlslLibRoutine(a,["coordinates.uvFromFlat","coordinates.sampleTexture"])}getUnpackedSampler2D(e,t,n){const i=n.unpackedShape,u=[n.height,n.width];if(null!=u&&r.ArrayUtil.arraysEqual(i,u)){const n=`\n          float ${e}(int row, int col) {\n            vec2 uv = (vec2(row, col) + halfCR) / vec2(${u[1]}.0, ${u[0]}.0);\n            return sampleTexture(${t}, uv);\n          }\n        `;return new o.GlslLibRoutine(n,["coordinates.sampleTexture"])}const{newShape:l,keptDims:c}=(0,a.squeezeShape)(i),p=l;if(p.length<i.length){const r=(0,s.squeezeInputShape)(i,p),a=JSON.parse(JSON.stringify(n));a.unpackedShape=r;const u=["col","row"],l=`\n          ${this.getUnpackedSamplerFromInput(e,t,a).routineBody}\n          float ${e}(int row, int col) {\n            return ${e}(${(0,s.getSqueezedParams)(u,c)});\n          }\n        `;return new o.GlslLibRoutine(l,["coordinates.sampleTexture"])}const d=u[1],f=u[0];if(1===f){const n=`\n          float ${e}(int row, int col) {\n            int offset_${t} = coordsToOffset(TexCoords, ${d}, ${f});\n            float index = dot(vec3(row, col, offset_${t}), vec3(${i[1]}, 1, 1));\n            vec2 uv = vec2(0.5, (index + 0.5) / ${d}.0);\n            return sampleTexture(${t}, uv);\n          }\n        `;return new o.GlslLibRoutine(n,["coordinates.sampleTexture","coordinates.coordsToOffset"])}if(1===d){const n=`\n          float ${e}(int row, int col) {\n            int offset_${t} = coordsToOffset(TexCoords, ${d}, ${f});\n            float index = dot(vec3(row, col, offset_${t}), vec3(${i[1]}, 1, 1));\n            vec2 uv = vec2((index + 0.5) / ${f}.0, 0.5);\n            return sampleTexture(${t}, uv);\n          }\n        `;return new o.GlslLibRoutine(n,["coordinates.sampleTexture","coordinates.coordsToOffset"])}const h=`\n        float ${e}(int row, int col) {\n          int index = col * ${i[1]} + row;\n          vec2 uv = uvFromFlat(${d}, ${f}, index);\n          return sampleTexture(${t}, uv);\n        }\n      `;return new o.GlslLibRoutine(h,["coordinates.uvFromFlat","coordinates.sampleTexture","coordinates.coordsToOffset"])}getUnpackedSampler3D(e,t,n){const r=n.unpackedShape,i=r[1]*r[2],u=r[2],{newShape:l,keptDims:c}=(0,a.squeezeShape)(r),p=l;if(p.length<r.length){const i=(0,s.squeezeInputShape)(r,p),a=["batch","col","row"],u=JSON.parse(JSON.stringify(n));u.unpackedShape=i;const l=this.getUnpackedSamplerFromInput(e,t,u),d=c.reverse(),f=`\n          ${l.routineBody}\n          float ${e}(int batch, int row, int col) {\n            return ${e}(${(0,s.getSqueezedParams)(a,d)});\n          }\n        `;return new o.GlslLibRoutine(f,l.dependencies)}const d=`\n          float ${e}(int depth, int row, int col) {\n            // Explicitly use integer operations as dot() only works on floats.\n            int index = depth * ${i} + col * ${u} + row;\n            vec2 uv = uvFromFlat(${n.width}, ${n.height}, index);\n            return sampleTexture(${t}, uv);\n          }\n      `;return new o.GlslLibRoutine(d,["coordinates.uvFromFlat","coordinates.sampleTexture","coordinates.coordsToOffset"])}getUnpackedSampler4D(e,t,n){const r=n.unpackedShape,i=r[3],a=r[2]*i,s=`\n        float ${e}(int row, int col, int depth, int depth2) {\n          int index = row * ${r[1]*a} + col * ${a} +\n              depth2 * ${i} + depth;\n          vec2 uv = uvFromFlat(${n.width}, ${n.height}, index);\n          return sampleTexture(${t}, uv);\n        }\n      `;return new o.GlslLibRoutine(s,["coordinates.uvFromFlat","coordinates.sampleTexture"])}getUnpackedSampler5D(e,t,n){const r=n.unpackedShape,i=r[4],u=r[3]*i,l=r[2]*u,c=r[1]*l,{newShape:p,keptDims:d}=(0,a.squeezeShape)(r);if(p.length<r.length){const i=(0,s.squeezeInputShape)(r,p),a=["row","col","depth","depth2","depth3"],u=JSON.parse(JSON.stringify(n));u.unpackedShape=i;const l=`\n          ${this.getUnpackedSamplerFromInput(e,t,u).routineBody}\n          float ${e}(int row, int col, int depth, int depth2, int depth3) {\n            return ${e}(${(0,s.getSqueezedParams)(a,d)});\n          }\n        `;return new o.GlslLibRoutine(l,["coordinates.sampleTexture","coordinates.uvFromFlat"])}const f=`\n        float ${e}(int row, int col, int depth, int depth2, int depth3) {\n          int index = row * ${c} + col * ${l} + depth * ${u} +\n          depth3 * ${i} + depth2;\n          vec2 uv = uvFromFlat(${n.width}, ${n.height}, index);\n          return sampleTexture(${t}, uv);\n        }\n      `;return new o.GlslLibRoutine(f,["coordinates.sampleTexture","coordinates.uvFromFlat"])}getUnpackedSampler6D(e,t,n){const r=n.unpackedShape,i=r[5],u=r[4]*i,l=r[3]*u,c=r[2]*l,p=r[1]*c,{newShape:d,keptDims:f}=(0,a.squeezeShape)(r);if(d.length<r.length){const i=(0,s.squeezeInputShape)(r,d),a=["row","col","depth","depth2","depth3","depth4"],u=JSON.parse(JSON.stringify(n));u.unpackedShape=i;const l=`\n            ${this.getUnpackedSamplerFromInput(e,t,u).routineBody}\n            float ${e}(int row, int col, int depth,\n              int depth2, int depth3, int depth4) {\n              return ${e}(${(0,s.getSqueezedParams)(a,f)});\n            }\n          `;return new o.GlslLibRoutine(l,["coordinates.sampleTexture","coordinates.uvFromFlat"])}const h=`\n          float ${e}(int row, int col, int depth,\n            int depth2, int depth3, int depth4) {\n            int index = row * ${p} + col * ${c} + depth * ${l} +\n            depth2 * ${u} + depth3 * ${i} + depth4;\n            vec2 uv = uvFromFlat(${n.width}, ${n.height}, index);\n            return sampleTexture(${t}, uv);\n          }\n        `;return new o.GlslLibRoutine(h,["coordinates.uvFromFlat","coordinates.sampleTexture","coordinates.coordsToOffset"])}toVec(){const e=this.context.outputTextureLayout,t=e.shape.length,n=e.strides,r=e.width,i=e.height,a=[];for(let e=0;e<t-1;++e)a.push(`\n        c[${e}] = offset / ${n[e]};`),a.push(`\n        offset -= c[${e}] * ${n[e]};`);a.push(`\n        c[${t-1}] = offset;`);const s=`\n      void toVec(vec2 texCoords, out int c[${t}]) {\n        int offset = coordsToOffset(texCoords, ${r}, ${i});\n        ${a.join("")}\n      }\n      void toVec(int offset, out int c[${t}]) {\n        ${a.join("")}\n      }\n    `;return{toVec:new o.GlslLibRoutine(s,["coordinates.coordsToOffset"])}}valueFrom(){const e={};return this.context.programInfo.inputNames.forEach(((t,n)=>{const r=this.context.inputTextureLayouts[n],i=(r.unpackedShape.length>0?r.unpackedShape:r.shape).length;let a=`_${t}`;e[a]=new o.GlslLibRoutine(this.getValueFromSingle(t,i,r.width,r.height,!1),[`shapeUtils.indicesToOffset${a}`,"coordinates.offsetToCoords","fragcolor.getColorAsFloat"]),a+="_T",e[a]=new o.GlslLibRoutine(this.getValueFromSingle(t,i,r.width,r.height,!0),[`shapeUtils.indicesToOffset${a}`,"coordinates.offsetToCoords","fragcolor.getColorAsFloat"])})),e}getValueFromSingle(e,t,n,r,o){let a=`_${e}`;return o&&(a+="_T"),`\n        float ${a}(int m[${t}]) {\n          int offset = indicesToOffset${a}(m);\n          vec2 coords = offsetToCoords(offset, ${n}, ${r});\n          float value = getColorAsFloat(${(0,i.getGlsl)(this.context.glContext.version).texture2D}(${e}, coords));\n          return value;\n        }\n        `}getPackedValueFrom(e,t,n,r,o){let a=`_${e}_Pack`;return o&&(a+="_T"),`\n        vec4 ${a}(int m[${t}]) {\n          int offset = indicesToOffset_${e}(m);\n          vec2 coords = offsetToCoords(offset, ${n}, ${r});\n          return ${(0,i.getGlsl)(this.context.glContext.version).texture2D}(${e}, coords);\n        }\n        `}}t.CoordsGlslLib=u},1997:(e,t)=>{"use strict";var n;Object.defineProperty(t,"__esModule",{value:!0}),t.TopologicalSortGlslRoutines=t.GlslLibRoutineNode=t.GlslLibRoutine=t.GlslLib=t.GlslContext=t.FunctionType=void 0,(n=t.FunctionType||(t.FunctionType={}))[n.ValueBased=0]="ValueBased",n[n.Positional=1]="Positional",t.GlslContext=class{constructor(e,t,n,r){this.glContext=e,this.programInfo=t,this.inputTextureLayouts=n,this.outputTextureLayout=r}},t.GlslLib=class{constructor(e){this.context=e}},t.GlslLibRoutine=class{constructor(e,t){this.routineBody=e,this.dependencies=t}},t.GlslLibRoutineNode=class{constructor(e,t,n){this.name=e,this.dependencies=n||[],t&&(this.routineBody=t)}addDependency(e){e&&this.dependencies.push(e)}},t.TopologicalSortGlslRoutines=class{static returnOrderedNodes(e){if(!e||0===e.length)return[];if(1===e.length)return e;const t=new Set,n=new Set,r=new Array;return this.createOrderedNodes(e,t,n,r),r}static createOrderedNodes(e,t,n,r){for(let o=0;o<e.length;++o)this.dfsTraverse(e[o],t,n,r)}static dfsTraverse(e,t,n,r){if(!e||n.has(e.name))return;if(t.has(e.name))throw new Error("Cyclic dependency detected. Can't topologically sort routines needed for shader.");t.add(e.name);const o=e.dependencies;if(o&&o.length>0)for(let e=0;e<o.length;++e)this.dfsTraverse(o[e],t,n,r);r.push(e),n.add(e.name),t.delete(e.name)}}},1371:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.EncodingGlslLib=void 0;const r=n(1997);class o extends r.GlslLib{constructor(e){super(e)}getFunctions(){return Object.assign(Object.assign({},this.encodeFloat32()),this.decodeFloat32())}getCustomTypes(){return{}}encodeFloat32(){return{encode:new r.GlslLibRoutine("highp vec4 encode(highp float f) {\n        return vec4(f, 0.0, 0.0, 0.0);\n      }\n        ")}}decodeFloat32(){return{decode:new r.GlslLibRoutine("highp float decode(highp vec4 rgba) {\n        return rgba.r;\n      }\n        ")}}encodeUint8(){const e=o.isLittleEndian()?"rgba.rgba=rgba.abgr;":"";return{encode:new r.GlslLibRoutine(`\n      highp vec4 encode(highp float f) {\n        highp float F = abs(f);\n        highp float Sign = step(0.0,-f);\n        highp float Exponent = floor(log2(F));\n        highp float Mantissa = (exp2(- Exponent) * F);\n        Exponent = floor(log2(F) + 127.0) + floor(log2(Mantissa));\n        highp vec4 rgba;\n        rgba[0] = 128.0 * Sign  + floor(Exponent*exp2(-1.0));\n        rgba[1] = 128.0 * mod(Exponent,2.0) + mod(floor(Mantissa*128.0),128.0);\n        rgba[2] = floor(mod(floor(Mantissa*exp2(23.0 -8.0)),exp2(8.0)));\n        rgba[3] = floor(exp2(23.0)*mod(Mantissa,exp2(-15.0)));\n        ${e}\n        rgba = rgba / 255.0; // values need to be normalized to [0,1]\n        return rgba;\n    }\n        `)}}decodeUint8(){const e=o.isLittleEndian()?"rgba.rgba=rgba.abgr;":"";return{decode:new r.GlslLibRoutine(`\n        highp float decode(highp vec4 rgba) {\n          rgba = rgba * 255.0; // values need to be de-normalized from [0,1] to [0,255]\n          ${e}\n          highp float Sign = 1.0 - step(128.0,rgba[0])*2.0;\n          highp float Exponent = 2.0 * mod(rgba[0],128.0) + step(128.0,rgba[1]) - 127.0;\n          highp float Mantissa = mod(rgba[1],128.0)*65536.0 + rgba[2]*256.0 +rgba[3] + float(0x800000);\n          highp float Result =  Sign * exp2(Exponent) * (Mantissa * exp2(-23.0 ));\n          return Result;\n      }\n        `)}}static isLittleEndian(){const e=new ArrayBuffer(4),t=new Uint32Array(e),n=new Uint8Array(e);if(t[0]=3735928559,239===n[0])return!0;if(222===n[0])return!1;throw new Error("unknown endianness")}}t.EncodingGlslLib=o},2691:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.FragColorGlslLib=void 0;const r=n(1997),o=n(6757);class i extends r.GlslLib{constructor(e){super(e)}getFunctions(){return Object.assign(Object.assign({},this.setFragColor()),this.getColorAsFloat())}getCustomTypes(){return{}}setFragColor(){const e=(0,o.getGlsl)(this.context.glContext.version);return{setFragColor:new r.GlslLibRoutine(`\n        void setFragColor(float value) {\n            ${e.output} = encode(value);\n        }\n        `,["encoding.encode"])}}getColorAsFloat(){return{getColorAsFloat:new r.GlslLibRoutine("\n        float getColorAsFloat(vec4 color) {\n            return decode(color);\n        }\n        ",["encoding.decode"])}}}t.FragColorGlslLib=i},3878:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.replaceInlines=void 0;const n=/@inline[\s\n\r]+(\w+)[\s\n\r]+([0-9a-zA-Z_]+)\s*\(([^)]*)\)\s*{(([^}]|[\n\r])*)}/gm;t.replaceInlines=function(e){const t={};let r;for(;null!==(r=n.exec(e));){const e=r[3].split(",").map((e=>{const t=e.trim().split(" ");return t&&2===t.length?{type:t[0],name:t[1]}:null})).filter((e=>null!==e));t[r[2]]={params:e,body:r[4]}}for(const n in t){const o="(\\w+)?\\s+([_0-9a-zA-Z]+)\\s+=\\s+__FUNC__\\((.*)\\)\\s*;".replace("__FUNC__",n),i=new RegExp(o,"gm");for(;null!==(r=i.exec(e));){const o=r[1],i=r[2],a=r[3].split(","),s=o?`${o} ${i};`:"";let u=t[n].body,l="";t[n].params.forEach(((e,t)=>{e&&(l+=`${e.type} ${e.name} = ${a[t]};\n`)})),u=`${l}\n ${u}`,u=u.replace("return",`${i} = `);const c=`\n      ${s}\n      {\n        ${u}\n      }\n      `;e=e.replace(r[0],c)}}return e.replace(n,"")}},8897:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.GlslPreprocessor=void 0;const r=n(1997),o=n(3878),i=n(1248),a=n(6757);t.GlslPreprocessor=class{constructor(e,t,n,o){this.libs={},this.glslLibRoutineDependencyGraph={},this.context=new r.GlslContext(e,t,n,o),Object.keys(i.glslRegistry).forEach((e=>{const t=new i.glslRegistry[e](this.context);this.libs[e]=t}));const a=this.glslLibRoutineDependencyGraph;for(const e in this.libs){const t=this.libs[e].getFunctions();for(const n in t){const o=e+"."+n;let i;a[o]?(i=a[o],i.routineBody=t[n].routineBody):(i=new r.GlslLibRoutineNode(o,t[n].routineBody),a[o]=i);const s=t[n].dependencies;if(s)for(let e=0;e<s.length;++e)if(a[s[e]])i.addDependency(a[s[e]]);else{const t=new r.GlslLibRoutineNode(s[e]);a[s[e]]=t,i.addDependency(t)}}}}preprocess(){const e=this.context.programInfo;let t=e.shaderSource;return this.context.programInfo.hasMain||(t=`${t}\n      ${(0,a.getDefaultFragShaderMain)(this.context.glContext.version,this.context.outputTextureLayout.shape.length)}`),t=(0,o.replaceInlines)(t),`${(0,a.getFragShaderPreamble)(this.context.glContext.version)}\n    ${this.getUniforms(e.inputNames,e.variables)}\n    ${this.getImports(t)}\n    ${t}`}getImports(e){const t=this.selectGlslLibRoutinesToBeIncluded(e);if(0===t.length)return"";let n="";for(let e=0;e<t.length;++e){if(!t[e].routineBody)throw new Error(`Missing body for the Glsl Library routine: ${t[e].name}`);n+=t[e].routineBody+"\n"}return n}selectGlslLibRoutinesToBeIncluded(e){const t=[];return Object.keys(this.glslLibRoutineDependencyGraph).forEach((n=>{const r=n.split(".")[1];-1!==e.indexOf(r)&&t.push(this.glslLibRoutineDependencyGraph[n])})),r.TopologicalSortGlslRoutines.returnOrderedNodes(t)}getUniforms(e,t){const n=[];if(e)for(const t of e)n.push(`uniform sampler2D ${t};`);if(t)for(const e of t)n.push(`uniform ${e.type} ${e.name}${e.arrayLength?`[${e.arrayLength}]`:""};`);return n.join("\n")}}},1248:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.glslRegistry=void 0;const r=n(6859),o=n(1371),i=n(2691),a=n(9183),s=n(9314);t.glslRegistry={encoding:o.EncodingGlslLib,fragcolor:i.FragColorGlslLib,vec:s.VecGlslLib,shapeUtils:a.ShapeUtilsGlslLib,coordinates:r.CoordsGlslLib}},9183:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ShapeUtilsGlslLib=void 0;const r=n(1997);class o extends r.GlslLib{constructor(e){super(e)}getFunctions(){return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({},this.bcastIndex()),this.bcastMatmulIndex()),this.offsetToIndices()),this.indicesToOffset()),this.incrementIndices())}getCustomTypes(){return{}}bcastIndex(){const e=this.context.outputTextureLayout.shape.length,t={};return this.context.programInfo.inputNames.forEach(((n,o)=>{const i=this.context.inputTextureLayouts[o].unpackedShape;if(i.length<=e){const o=i.length,a=e-o,s=`bcastIndices_${n}`;let u="";for(let e=0;e<o;++e)u+=`\n          realIndices[${e}] = int( mod(float(bcastedIndices[${a+e}]), ${i[e]}.0) );\n          `;const l=`\n        void ${s} (int bcastedIndices[${e}], out int realIndices[${o}]) {\n          ${u}\n        }\n        `;t[s]=new r.GlslLibRoutine(l)}})),t}bcastMatmulIndex(){const e=this.context.outputTextureLayout.shape.length,t={};return this.context.programInfo.inputNames.forEach(((n,o)=>{const i=this.context.inputTextureLayouts[o].shape;if(!(i.length<2||i.length>e)){const o=i.length,a=e-o,s=`bcastMatmulIndices_${n}`;let u="";for(let e=0;e<o-2;++e)u+=`\n          realIndices[${e}] = int( mod(float(bcastedIndices[${a+e}]), ${i[e]}.0) );\n          `;const l=`\n        void ${s}(int bcastedIndices[${e}], out int realIndices[${o}]) {\n          ${u}\n          realIndices[${o-1}] = bcastedIndices[${e-1}];\n          realIndices[${o-2}] = bcastedIndices[${e-2}];\n        }\n        `;t[s]=new r.GlslLibRoutine(l)}})),t}indicesToOffset(){const e={};return this.context.programInfo.inputNames.forEach(((t,n)=>{const i=this.context.inputTextureLayouts[n].shape,a=this.context.inputTextureLayouts[n].strides,s=i.length;let u=`indicesToOffset_${t}`;e[u]=new r.GlslLibRoutine(o.indexToOffsetSingle(u,s,a)),u=`indicesToOffset_${t}_T`,e[u]=new r.GlslLibRoutine(o.indexToOffsetSingle(u,s,a.slice().reverse()))})),e}static indexToOffsetSingle(e,t,n){let r="";for(let e=t-1;e>=0;--e)r+=`\n        offset += indices[${e}] * ${n[e]};\n        `;return`\n      int ${e}(int indices[${t}]) {\n        int offset = 0;\n        ${r}\n        return offset;\n      }\n      `}offsetToIndices(){const e={};return this.context.programInfo.inputNames.forEach(((t,n)=>{const i=this.context.inputTextureLayouts[n].shape,a=this.context.inputTextureLayouts[n].strides,s=i.length;let u=`offsetToIndices_${t}`;e[u]=new r.GlslLibRoutine(o.offsetToIndicesSingle(u,s,a)),u=`offsetToIndices_${t}_T`,e[u]=new r.GlslLibRoutine(o.offsetToIndicesSingle(u,s,a.slice().reverse()))})),e}static offsetToIndicesSingle(e,t,n){const r=[];for(let e=0;e<t-1;++e)r.push(`\n      indices[${e}] = offset / ${n[e]};`),r.push(`\n        offset -= indices[${e}] * ${n[e]};`);return r.push(`\n      indices[${t-1}] = offset;`),`\n      void ${e}(int offset, out int indices[${t}]) {\n        ${r.join("")}\n      }\n      `}incrementIndices(){const e={};return this.context.programInfo.inputNames.forEach(((t,n)=>{const o=this.context.inputTextureLayouts[n].shape,i=o.length,a=`incrementIndices_${t}`;let s="";for(let e=0;e<i;++e)s+=`\n        shape[${e}] = ${o[e]};`;const u=`\n        void ${a}(int axis, out int indices[${i}]) {\n          int shape[${i}];\n          ${s};\n          for(int i = ${i} -1 ; i >= 0; --i) {\n            if(i > axis) continue;\n            indices[i] += 1;\n            if(indices[i] < shape[i]) {\n              break;\n            }\n            indices[i] = 0;\n          }\n        }\n        `;e[a]=new r.GlslLibRoutine(u)})),e}}t.ShapeUtilsGlslLib=o},6757:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getDefaultFragShaderMain=t.getFragShaderPreamble=t.getVertexShaderSource=t.getGlsl=void 0;const n={version:"",attribute:"attribute",varyingVertex:"varying",varyingFrag:"varying",texture2D:"texture2D",output:"gl_FragColor",outputDeclaration:""},r={version:"#version 300 es",attribute:"in",varyingVertex:"out",varyingFrag:"in",texture2D:"texture",output:"outputColor",outputDeclaration:"out vec4 outputColor;"};function o(e){return 1===e?n:r}t.getGlsl=o,t.getVertexShaderSource=function(e){const t=o(e);return`${t.version}\n      precision highp float;\n      ${t.attribute} vec3 position;\n      ${t.attribute} vec2 textureCoord;\n\n      ${t.varyingVertex} vec2 TexCoords;\n\n      void main()\n      {\n          gl_Position = vec4(position, 1.0);\n          TexCoords = textureCoord;\n      }`},t.getFragShaderPreamble=function(e){const t=o(e);return`${t.version}\n    precision highp float;\n    precision highp int;\n    precision highp sampler2D;\n    ${t.varyingFrag} vec2 TexCoords;\n    ${t.outputDeclaration}\n    const vec2 halfCR = vec2(0.5, 0.5);\n\n    // Custom vector types to handle higher dimenalities.\n    struct ivec5\n    {\n      int x;\n      int y;\n      int z;\n      int w;\n      int u;\n    };\n\n    struct ivec6\n    {\n      int x;\n      int y;\n      int z;\n      int w;\n      int u;\n      int v;\n    };\n\n    int imod(int x, int y) {\n      return x - y * (x / y);\n    }\n\n    `},t.getDefaultFragShaderMain=function(e,t){return`\n  void main() {\n    int indices[${t}];\n    toVec(TexCoords, indices);\n    vec4 result = vec4(process(indices));\n    ${o(e).output} = result;\n  }\n  `}},9314:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.VecGlslLib=void 0;const r=n(1997);class o extends r.GlslLib{constructor(e){super(e)}getCustomTypes(){return{}}getFunctions(){return Object.assign(Object.assign(Object.assign(Object.assign({},this.binaryVecFunctions()),this.copyVec()),this.setVecItem()),this.getVecItem())}binaryVecFunctions(){const e=this.context.outputTextureLayout.shape.length,t={add:"+=",sub:"-=",mul:"*=",div:"/="},n={};for(const o in t){const i=`${o}Vec`;let a="";for(let n=0;n<e;++n)a+=`\n          dest[${n}] ${t[o]} src[${n}];\n          `;const s=`\n        void ${i}(int src[${e}], out int dest[${e}]) {\n          ${a}\n        }\n        `;n[i]=new r.GlslLibRoutine(s)}return n}copyVec(){const e=this.context.outputTextureLayout.shape.length;let t="";for(let n=0;n<e;++n)t+=`\n        dest[${n}] = src[${n}];\n        `;const n=`\n      void copyVec(int src[${e}], out int dest[${e}]) {\n        ${t}\n      }\n      `;return{copyVec:new r.GlslLibRoutine(n)}}setVecItem(){const e=this.context.outputTextureLayout.shape.length;let t=`\n        if(index < 0)\n            index =${e} + index;\n        if (index == 0)\n            m[0] = value;\n        `;for(let n=1;n<e-1;++n)t+=`\n        else if (index == ${n})\n            m[${n}] = value;\n            `;t+=`\n        else\n            m[${e-1}] = value;\n        `;const n=`\n      void setVecItem(out int m[${e}], int index, int value) {\n        ${t}\n      }\n        `;return{setVecItem:new r.GlslLibRoutine(n)}}getVecItem(){const e=this.context.outputTextureLayout.shape.length;let t=`\n        if(index < 0)\n            index = ${e} + index;\n        if (index == 0)\n            return m[0];\n      `;for(let n=1;n<e-1;++n)t+=`\n        else if (index == ${n})\n            return m[${n}];\n      `;t+=`\n        else\n            return m[${e-1}];\n        `;const n=`\n      int getVecItem(int m[${e}], int index) {\n        ${t}\n      }\n    `;return{getVecItem:new r.GlslLibRoutine(n)}}}t.VecGlslLib=o},7860:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.WebGLInferenceHandler=void 0;const r=n(1315),o=n(9240),i=n(7273),a=n(9),s=n(7379),u=n(2488),l=n(540),c=n(3314),p=n(5639);t.WebGLInferenceHandler=class{constructor(e){this.session=e,this.packedTextureDataCache=new Map,this.unpackedTextureDataCache=new Map}calculateTextureWidthAndHeight(e,t){return(0,c.calculateTextureWidthAndHeight)(this.session.layoutStrategy,e,t)}executeProgram(e,t){if(t.length<e.inputNames.length)throw new Error(`Input size mustn't be less than ${e.inputNames.length}.`);if(e.inputNames.length!==e.inputTypes.length)throw new Error("input names size does not match input types");const n=[];for(let r=0;r<e.inputNames.length;++r)n[r]=this.getOrCreateTextureData(t[r],e.inputTypes[r]);const r=((e,t)=>{const n=t.map((e=>`${e.unpackedShape.join(",")};${e.width}x${e.height}`)).join("_");let r=e.name;return e.cacheHint&&(r+="["+e.cacheHint+"]"),r+=":"+n,r})(e,n);let o=this.session.programManager.getArtifact(r);const i=o?o.programInfo:"function"==typeof e.get?e.get():e,a=(0,c.createTextureLayoutFromTextureType)(this.session.layoutStrategy,i.output.dims,i.output.textureType),s=this.createTextureData(a,i.output.type);return o||(o=this.session.programManager.build(i,n,s),this.session.programManager.setArtifact(r,o)),this.runProgram(o,n,s),s}run(e,t){return this.executeProgram(e,t).tensor}runProgram(e,t,n){for(let n=0;n<t.length;++n)if(!!t[n].isPacked!=(e.programInfo.inputTypes[n]===p.TextureType.packed))throw new Error(`input[${n}] property packed inconsistent`);if(!!n.isPacked!=(e.programInfo.output.textureType===p.TextureType.packed))throw new Error("output property packed inconsistent");this.session.programManager.run(e,t,n)}getOrCreateTextureData(e,t){let n=this.getTextureData(e.dataId,t===p.TextureType.packed);if(!n&&(n=this.getTextureData(e.dataId,t!==p.TextureType.packed),n))return t===p.TextureType.packed?this.pack(n):this.unpack(n);if(!n){const r=(0,c.createTextureLayoutFromTextureType)(this.session.layoutStrategy,e.dims,t);if(t===p.TextureType.packedLastDimension){const n=1,r=4,o=e.dims;if(4===o.length){const i=[o[0],Math.ceil(o[1]*o[2]*o[3]/r)],a=(0,c.createTextureLayoutFromTextureType)(this.session.layoutStrategy,i,t);let s=e.numberData;if(o[1]*o[2]*o[3]%r!=0){const t=o[0],i=o[1]*o[2]*o[3],a=Math.ceil(i*n/r)*r;s=new Float32Array(t*a);for(let r=0;r<t;++r){const t=r*i,o=r*a+r%n*i;s.set(e.numberData.subarray(t,t+i),o)}}return this.createTextureData(a,e.type,s,e,1)}}if(t===p.TextureType.packed){const t=(0,c.createTextureLayoutFromShape)(this.session.layoutStrategy,e.dims,1,[],{reverseWH:!0}),r=this.createTextureData(t,e.type,e.numberData,e,1);n=this.pack(r)}else n=this.createTextureData(r,e.type,e.numberData,e,1)}return n}createTextureDataFromLayoutBindTensor(e,t,n,r){return this.createTextureData(e,t,n,r,1)}createTextureData(e,t,n,o,i){r.Logger.verbose("InferenceHandler",`Creating TextureData: layout:[${JSON.stringify(e)}]`);const a=this.session.textureManager.createTextureFromLayout(t,e,n,i);return this.createTextureDataFromTexture(e,t,a,o)}reshapeUnpacked(e,t){const n=this.getOrCreateTextureData(e,p.TextureType.unpacked),r={channels:n.channels,height:n.height,width:n.width,shape:0!==t.length?t:[1],strides:i.ShapeUtil.computeStrides(t),unpackedShape:t};return this.createTextureDataFromTexture(r,e.type,n.texture).tensor}reshapePacked(e,t){const n=this.getOrCreateTextureData(e,p.TextureType.packed);if((0,s.isReshapeCheap)(e.dims,t)){const r={channels:n.channels,height:n.height,width:n.width,shape:0!==t.length?t:[1],strides:i.ShapeUtil.computeStrides(t),unpackedShape:t,isPacked:!0};return this.createTextureDataFromTexture(r,e.type,n.texture).tensor}const r=(0,s.processDims3D)(e.dims),o=(0,s.processDims3D)(t),a=this.reshapePacked(e,r),u=this.run((0,s.createPackedReshape3DProgramInfoLoader)(this,a,o),[a]);return this.reshapePacked(u,t)}cast(e,t){const n=this.getOrCreateTextureData(e,p.TextureType.unpacked);return this.createTextureDataFromTexture(n,t,n.texture).tensor}createTextureDataFromTexture(e,t,n,r,i){const a=Object.assign(Object.assign({},e),{tensor:r||new o.Tensor(e.unpackedShape,t,(e=>this.readTexture(a)),(async e=>this.readTextureAsync(a)),void 0,i),texture:n});return this.setTextureData(a.tensor.dataId,a,e.isPacked),a}getTextureData(e,t=!1){return this.session.isInitializer(e)?this.session.getTextureData(e,t):t?this.packedTextureDataCache.get(e):this.unpackedTextureDataCache.get(e)}setTextureData(e,t,n=!1){this.session.isInitializer(e)?this.session.setTextureData(e,t,n):(n?this.packedTextureDataCache:this.unpackedTextureDataCache).set(e,t)}isTextureLayoutCached(e,t=!1){return!!this.getTextureData(e.dataId,t)}dispose(){this.session.textureManager.clearActiveTextures(),this.packedTextureDataCache.forEach((e=>this.session.textureManager.releaseTexture(e))),this.packedTextureDataCache=new Map,this.unpackedTextureDataCache.forEach((e=>this.session.textureManager.releaseTexture(e))),this.unpackedTextureDataCache=new Map}readTexture(e){return e.isPacked?this.readTexture(this.unpack(e)):this.session.backend.glContext.isFloat32DownloadSupported?this.session.textureManager.readTexture(e,e.tensor.type,e.channels):this.session.textureManager.readUint8TextureAsFloat((0,u.encodeAsUint8)(this,e))}async readTextureAsync(e){return e.isPacked?this.readTextureAsync(this.unpack(e)):this.session.backend.glContext.isFloat32DownloadSupported?this.session.textureManager.readTextureAsync(e,e.tensor.type,e.channels):this.session.textureManager.readUint8TextureAsFloat((0,u.encodeAsUint8)(this,e))}pack(e){return this.executeProgram((0,a.createPackProgramInfoLoader)(this,e.tensor),[e.tensor])}unpack(e){return this.executeProgram((0,l.createUnpackProgramInfoLoader)(this,e.tensor),[e.tensor])}}},4110:function(e,t,n){"use strict";var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){void 0===r&&(r=n);var o=Object.getOwnPropertyDescriptor(t,n);o&&!("get"in o?!t.__esModule:o.writable||o.configurable)||(o={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,r,o)}:function(e,t,n,r){void 0===r&&(r=n),e[r]=t[n]}),o=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),i=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)"default"!==n&&Object.prototype.hasOwnProperty.call(e,n)&&r(t,e,n);return o(t,e),t};Object.defineProperty(t,"__esModule",{value:!0}),t.WEBGL_OP_RESOLVE_RULES=void 0;const a=n(8817),s=i(n(5194)),u=n(4752),l=n(6668),c=n(9754),p=n(5042),d=n(6742),f=n(4125),h=n(6149),g=n(5378),m=n(6981),b=n(7413),y=n(7006),w=n(8276),_=n(5565),v=n(2834),x=n(1010),T=n(8126),S=n(2801),O=n(565),A=n(2444),E=n(815),I=n(564),$=n(5416),P=n(1240),D=n(5944),k=n(5707),C=i(n(9087)),R=n(7862),M=n(3980);t.WEBGL_OP_RESOLVE_RULES=[["Abs","","6+",C.abs],["Acos","","7+",C.acos],["Add","","7+",s.add],["And","","7+",s.and],["Asin","","7+",C.asin],["Atan","","7+",C.atan],["AveragePool","","7+",v.averagePool,v.parseAveragePoolAttributes],["BatchNormalization","","7+",a.batchNormalization,a.parseBatchNormalizationAttributes],["Cast","","6+",u.cast,u.parseCastAttributes],["Ceil","","6+",C.ceil],["Clip","","6-10",C.clip,C.parseClipAttributes],["Clip","","11+",C.clipV11],["Concat","","4+",l.concat,l.parseConcatAttributes],["Conv","","1+",c.conv,c.parseConvAttributes],["ConvTranspose","","1+",p.convTranspose,p.parseConvTransposeAttributes],["Cos","","7+",C.cos],["Div","","7+",s.div],["Dropout","","7+",C.identity],["DepthToSpace","","1+",d.depthToSpace,d.parseDepthToSpaceAttributes],["Equal","","7+",s.equal],["Elu","","6+",C.elu,C.parseEluAttributes],["Exp","","6+",C.exp],["Flatten","","1+",f.flatten,f.parseFlattenAttributes],["Floor","","6+",C.floor],["FusedConv","com.microsoft","1+",c.conv,c.parseConvAttributes],["Gather","","1+",h.gather,h.parseGatherAttributes],["Gemm","","7-10",g.gemm,g.parseGemmAttributesV7],["Gemm","","11+",g.gemm,g.parseGemmAttributesV11],["GlobalAveragePool","","1+",v.globalAveragePool,v.parseGlobalAveragePoolAttributes],["GlobalMaxPool","","1+",v.globalMaxPool],["Greater","","7+",s.greater],["Identity","","1+",C.identity],["ImageScaler","","1+",m.imageScaler,m.parseImageScalerAttributes],["InstanceNormalization","","6+",b.instanceNormalization,b.parseInstanceNormalizationAttributes],["LeakyRelu","","6+",C.leakyRelu,C.parseLeakyReluAttributes],["Less","","7+",s.less],["LRN","","1+",y.lrn,y.parseLrnAttributes],["Log","","6+",C.log],["MatMul","","1+",w.matMul,w.parseMatMulAttributes],["MaxPool","","1+",v.maxPool,v.parseMaxPoolAttributes],["Mul","","7+",s.mul],["Neg","","6+",C.neg],["Not","","1+",C.not],["Or","","7+",s.or],["Pad","","2-10",_.padV2,_.parsePadAttributesV2],["Pad","","11+",_.padV11,_.parsePadAttributesV11],["Pow","","7+",s.pow],["PRelu","","7+",s.pRelu],["ReduceLogSum","","1+",x.reduceLogSum,x.parseReduceAttributes],["ReduceMax","","1+",x.reduceMax,x.parseReduceAttributes],["ReduceMean","","1+",x.reduceMean,x.parseReduceAttributes],["ReduceMin","","1+",x.reduceMin,x.parseReduceAttributes],["ReduceProd","","1+",x.reduceProd,x.parseReduceAttributes],["ReduceSum","","1-12",x.reduceSum,x.parseReduceAttributes],["ReduceSumSquare","","1+",x.reduceLogSumSquare,x.parseReduceAttributes],["Relu","","6+",C.relu],["Reshape","","5+",T.reshape],["Resize","","10",S.resize,S.parseResizeAttributesV10],["Resize","","11+",S.resize,S.parseResizeAttributesV11],["Shape","","1+",O.shape],["Sigmoid","","6+",C.sigmoid],["Sin","","7+",C.sin],["Slice","","10+",A.sliceV10],["Slice","","1-9",A.slice,A.parseSliceAttributes],["Softmax","","1-12",E.softmax,E.parseSoftmaxAttributes],["Softmax","","13+",E.softmaxV13,E.parseSoftmaxAttributesV13],["Split","","2-12",I.split,I.parseSplitAttributes],["Sqrt","","6+",C.sqrt],["Squeeze","","1-12",$.squeeze,$.parseSqueezeAttributes],["Squeeze","","13+",$.squeezeV13],["Sub","","7+",s.sub],["Sum","","6+",P.sum],["Tan","","7+",C.tan],["Tanh","","6+",C.tanh],["Tile","","6+",D.tile],["Transpose","","1+",k.transpose,k.parseTransposeAttributes],["Upsample","","7-8",M.upsample,M.parseUpsampleAttributesV7],["Upsample","","9",M.upsample,M.parseUpsampleAttributesV9],["Unsqueeze","","1-12",R.unsqueeze,R.parseUnsqueezeAttributes],["Unsqueeze","","13+",R.unsqueezeV13],["Xor","","7+",s.xor]]},8817:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.parseBatchNormalizationAttributes=t.batchNormalization=void 0;const r=n(4910),o=n(6757),i=n(5639),a={name:"BatchNormalization",inputNames:["A","Scale","B","Mean","Variance"],inputTypes:[i.TextureType.unpacked,i.TextureType.unpacked,i.TextureType.unpacked,i.TextureType.unpacked,i.TextureType.unpacked]};t.batchNormalization=(e,t,n)=>(u(t),[e.run(Object.assign(Object.assign({},a),{cacheHint:n.cacheKey,get:()=>s(e,t,n)}),t)]),t.parseBatchNormalizationAttributes=e=>{const t=e.attributes.getFloat("epsilon",1e-5),n=e.attributes.getFloat("momentum",.9),o=e.attributes.getInt("spatial",1);return(0,r.createAttributeWithCacheKey)({epsilon:t,momentum:n,spatial:o})};const s=(e,t,n)=>{const r=(0,o.getGlsl)(e.session.backend.glContext.version),s=t[0].dims.length,[u,l]=e.calculateTextureWidthAndHeight(t[1].dims,i.TextureType.unpacked),c=`\n  float process(int[${s}] indices) {\n    vec2 position = offsetToCoords(indices[1], ${u}, ${l});\n    float scale = getColorAsFloat(${r.texture2D}(Scale, position));\n    float mean = getColorAsFloat(${r.texture2D}(Mean, position));\n    float variance = getColorAsFloat(${r.texture2D}(Variance, position));\n    float b = getColorAsFloat(${r.texture2D}(B, position));\n\n    return scale * ( (_A(indices) - mean) / sqrt(variance + float(${n.epsilon})) ) + b;\n  }`;return Object.assign(Object.assign({},a),{output:{dims:t[0].dims,type:t[0].type,textureType:i.TextureType.unpacked},shaderSource:c})},u=e=>{if(!e||5!==e.length)throw new Error("BatchNormalization requires 5 inputs.");const t=e[0],n=e[1],r=e[2],o=e[3],i=e[4];if(t.dims.length<3||1!==n.dims.length||1!==r.dims.length||1!==o.dims.length||1!==i.dims.length)throw new Error("invalid input shape.");if(n.dims[0]!==t.dims[1]||r.dims[0]!==t.dims[1]||o.dims[0]!==t.dims[1]||i.dims[0]!==t.dims[1])throw new Error("invalid input shape.");if("float32"!==t.type&&"float64"!==t.type||"float32"!==n.type&&"float64"!==n.type||"float32"!==r.type&&"float64"!==r.type||"float32"!==o.type&&"float64"!==o.type||"float32"!==i.type&&"float64"!==i.type)throw new Error("invalid input tensor types.")}},5194:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.xor=t.sub=t.pRelu=t.pow=t.or=t.mul=t.less=t.greater=t.equal=t.div=t.and=t.add=t.glslPRelu=t.glslPow=t.glslXor=t.glslOr=t.glslAnd=t.glslLess=t.glslGreater=t.glslEqual=t.glslSub=t.glslMul=t.glslDiv=t.glslAdd=void 0;const r=n(7273),o=n(1997),i=n(6757),a=n(5639);function s(){const e="add_";return{body:`\n  float ${e}(float a, float b) {\n    return a + b;\n  }\n  vec4 ${e}(vec4 v1, vec4 v2) {\n    return v1 + v2;\n  }\n  `,name:e,type:o.FunctionType.ValueBased}}function u(){const e="div_";return{body:`\n  float ${e}(float a, float b) {\n    return a / b;\n  }\n  vec4 ${e}(vec4 v1, vec4 v2) {\n    return v1 / v2;\n  }\n  `,name:e,type:o.FunctionType.ValueBased}}function l(){const e="mul_";return{body:`\n  float ${e}(float a, float b) {\n    return a * b;\n  }\n  vec4 ${e}(vec4 v1, vec4 v2) {\n    return v1 * v2;\n  }\n  `,name:e,type:o.FunctionType.ValueBased}}function c(){const e="sub_";return{body:`\n  float ${e}(float a, float b) {\n    return a - b;\n  }\n  vec4 ${e}(vec4 v1, vec4 v2) {\n    return v1 - v2;\n  }\n  `,name:e,type:o.FunctionType.ValueBased}}function p(){const e="equal_";return{body:`\n  float ${e}(float a, float b) {\n    return float(a == b);\n  }\n  vec4 ${e}(vec4 v1, vec4 v2) {\n    return vec4(equal(v1, v2));\n  }\n  `,name:e,type:o.FunctionType.ValueBased}}function d(){const e="greater_";return{body:`\n  float ${e}(float a, float b) {\n    return float(a > b);\n  }\n  vec4 ${e}(vec4 v1, vec4 v2) {\n    return vec4( v1.r > v2.r ,\n      v1.g > v2.g,\n      v1.b > v2.b,\n      v1.a > v2.a );\n  }\n  `,name:e,type:o.FunctionType.ValueBased}}function f(){const e="less_";return{body:`\n  float ${e}(float a, float b) {\n    return float(a < b);\n  }\n  vec4 ${e}(vec4 v1, vec4 v2) {\n    return vec4( v1.r < v2.r ,\n                v1.g < v2.g,\n                v1.b < v2.b,\n                v1.a < v2.a );\n  }\n  `,name:e,type:o.FunctionType.ValueBased}}function h(){const e="and_";return{body:`\n  float ${e}(float a, float b) {\n    return float( bool(a) && bool(b) );\n  }\n  vec4 ${e}(vec4 v1, vec4 v2) {\n    bvec4 b1 = bvec4(v1);\n    bvec4 b2 = bvec4(v2);\n    return vec4( b1.r && b2.r ,\n                b1.g && b2.g,\n                b1.b && b2.b,\n                b1.a && b2.a );\n  }\n  `,name:e,type:o.FunctionType.ValueBased}}function g(){const e="or_";return{body:`\n  float ${e}(float a, float b) {\n    return float( bool(a) || bool(b) );\n  }\n  vec4 ${e}(vec4 v1, vec4 v2) {\n    bvec4 b1 = bvec4(v1);\n    bvec4 b2 = bvec4(v2);\n    return vec4( b1.r || b2.r ,\n                b1.g || b2.g,\n                b1.b || b2.b,\n                b1.a || b2.a );\n  }\n  `,name:e,type:o.FunctionType.ValueBased}}function m(){const e="xor_";return{body:`\n  float ${e}(float a, float b) {\n    return float( bool(a) ^^ bool(b) );\n  }\n  vec4 ${e}(vec4 v1, vec4 v2) {\n    bvec4 b1 = bvec4(v1);\n    bvec4 b2 = bvec4(v2);\n    return vec4( b1.r ^^ b2.r ,\n                b1.g ^^ b2.g,\n                b1.b ^^ b2.b,\n                b1.a ^^ b2.a );\n  }\n  `,name:e,type:o.FunctionType.ValueBased}}function b(){return function(e){const t=`${e}_`;return{body:`\n  float ${t}(float a, float b) {\n    return ${e}(a, b);\n  }\n  vec4 ${t}(vec4 v1, vec4 v2) {\n    return ${e}(v1, v2);\n  }\n  `,name:t,type:o.FunctionType.ValueBased}}("pow")}function y(){const e="prelu_";return{body:`\n  float ${e}(float a, float b) {\n    return a < 0.0 ? a * b: a;\n  }\n  vec4 ${e}(vec4 v1, vec4 v2) {\n    return vec4(\n      v1.r < 0.0 ? v1.r * v2.r: v1.r,\n      v1.g < 0.0 ? v1.g * v2.g: v1.g,\n      v1.b < 0.0 ? v1.b * v2.b: v1.b,\n      v1.a < 0.0 ? v1.a * v2.a: v1.a\n      );\n  }\n  `,name:e,type:o.FunctionType.ValueBased}}t.glslAdd=s,t.glslDiv=u,t.glslMul=l,t.glslSub=c,t.glslEqual=p,t.glslGreater=d,t.glslLess=f,t.glslAnd=h,t.glslOr=g,t.glslXor=m,t.glslPow=b,t.glslPRelu=y;const w=(e,t,n,r=t[0].type,o)=>{const i=e.session.pack?a.TextureType.packed:a.TextureType.unpacked;return{name:n.name,inputNames:["A","B"],inputTypes:[i,i],cacheHint:o,get:()=>_(e,t,n,r)}},_=(e,t,n,o=t[0].type)=>{const s=e.session.pack?a.TextureType.packed:a.TextureType.unpacked,u=!r.ShapeUtil.areEqual(t[0].dims,t[1].dims);let l=t[0].dims;const c=e.session.pack;if(u){const a=r.BroadcastUtil.calcShape(t[0].dims,t[1].dims,!1);if(!a)throw new Error("Can't perform binary op on the given tensors");l=a;const u=l.length,p=0!==t[0].dims.length?t[0].dims.length:1,d=0!==t[1].dims.length?t[1].dims.length:1,f=0!==t[0].dims.length?"bcastIndices_A(indices, aindices);":"aindices[0] = 0;",h=0!==t[1].dims.length?"bcastIndices_B(indices, bindices);":"bindices[0] = 0;",g=(0,i.getGlsl)(e.session.backend.glContext.version),m=c?`\n      ${n.body}\n      void main() {\n        vec4 a = getAAtOutCoords();\n        vec4 b = getBAtOutCoords();\n        vec4 result = ${n.name}(a, b);\n        ${g.output} = result;\n      }`:`\n      ${n.body}\n      float process(int indices[${u}]) {\n        int aindices[${p}];\n        int bindices[${d}];\n        ${f}\n        ${h}\n        return ${n.name}(_A(aindices), _B(bindices));\n      }`;return{name:n.name,inputNames:["A","B"],inputTypes:[s,s],output:{dims:l,type:o,textureType:s},shaderSource:m,hasMain:c}}const p=(0,i.getGlsl)(e.session.backend.glContext.version),d=`\n    ${n.body}\n    void main() {\n      vec4 v1 = ${p.texture2D}(A, TexCoords);\n      vec4 v2 = ${p.texture2D}(B, TexCoords);\n      vec4 result = ${n.name}(v1, v2);\n      ${p.output} = result;\n    }\n    `;return{name:n.name,inputNames:["A","B"],inputTypes:[s,s],output:{dims:t[0].dims,type:o,textureType:s},shaderSource:d,hasMain:!0}};t.add=(e,t)=>[e.run(w(e,t,s()),t)],t.and=(e,t)=>[e.run(w(e,t,h(),"bool"),t)],t.div=(e,t)=>[e.run(w(e,t,u()),t)],t.equal=(e,t)=>[e.run(w(e,t,p(),"bool"),t)],t.greater=(e,t)=>[e.run(w(e,t,d(),"bool"),t)],t.less=(e,t)=>[e.run(w(e,t,f(),"bool"),t)],t.mul=(e,t)=>[e.run(w(e,t,l()),t)],t.or=(e,t)=>[e.run(w(e,t,g(),"bool"),t)],t.pow=(e,t)=>[e.run(w(e,t,b()),t)],t.pRelu=(e,t)=>[e.run(w(e,t,y()),t)],t.sub=(e,t)=>[e.run(w(e,t,c()),t)],t.xor=(e,t)=>[e.run(w(e,t,m(),"bool"),t)]},4752:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.parseCastAttributes=t.cast=void 0;const r=n(7273);t.cast=(e,t,n)=>(o(t),[e.cast(t[0],n)]),t.parseCastAttributes=e=>r.ProtoUtil.tensorDataTypeFromProto(e.attributes.getInt("to"));const o=e=>{if(!e||1!==e.length)throw new Error("Cast requires 1 input.");if("string"===e[0].type)throw new Error("Invalid input type.")}},4595:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.createPackedConcatProgramInfoLoader=void 0;const r=n(6757),o=n(5639),i=n(432),a=n(5614);t.createPackedConcatProgramInfoLoader=(e,t,n)=>{const u=(l=t.length,c=n.cacheKey,{name:"Concat (packed)",inputNames:Array.from({length:l},((e,t)=>`X${t}`)),inputTypes:Array(l).fill(o.TextureType.packed),cacheHint:c});var l,c;return Object.assign(Object.assign({},u),{get:()=>((e,t,n,u)=>{const l=n[0].dims.slice();if(u>=l.length||u<-1*l.length)throw new Error("axis specified for concat doesn't match input dimensionality");u<0&&(u=l.length+u);const c=l.slice(0);for(let e=1;e<n.length;e++){const t=n[e].dims.slice();for(let e=0;e<l.length;e++)if(e===u)c[u]+=t[e];else if(l[e]!==t[e])throw new Error("non concat dimensions must match")}const p=c.length,d=(0,a.getChannels)("coords",p),f=(0,i.getCoordsDataType)(p),h=(0,a.unpackFromChannel)(),g=n.map((e=>e.dims)),m=(0,i.getGlChannels)(p),b=new Array(g.length-1);b[0]=g[0][u];for(let e=1;e<b.length;e++)b[e]=b[e-1]+g[e][u];const y=m[u],w=m.slice(-2),_=m.join();let v=`if (${y} < ${b[0]}) {\n        return getChannel(\n            getX0(${_}), vec2(${w.join()}));\n        }`;for(let e=1;e<b.length;e++){const t=b[e-1];v+=`\n            if (${y} < ${b[e]}  && ${y} >= ${b[e-1]}) {\n              return getChannel(\n                getX${e}(${s(m,y,t)}),\n                vec2(${s(w,y,t)}));\n            }`}const x=b.length,T=b[b.length-1];v+=`\n            return getChannel(\n              getX${x}(${s(m,y,T)}),\n              vec2(${s(w,y,T)}));`;const S=(0,r.getGlsl)(e.session.backend.glContext.version),O=`\n          ${h}\n          float getValue(${m.map((e=>"int "+e))}) {\n            ${v}\n          }\n\n          void main() {\n            ${f} coords = getOutputCoords();\n            int lastDim = coords.${m[p-1]};\n            coords.${m[p-1]} = coords.${m[p-2]};\n            coords.${m[p-2]} = lastDim;\n\n            vec4 result = vec4(getValue(${d}), 0., 0., 0.);\n\n            ${d[p-1]} = ${d[p-1]} + 1;\n            if (${d[p-1]} < ${c[p-1]}) {\n              result.g = getValue(${d});\n            }\n\n            ${d[p-2]} = ${d[p-2]} + 1;\n            if (${d[p-2]} < ${c[p-2]}) {\n              result.a = getValue(${d});\n            }\n\n            ${d[p-1]} = ${d[p-1]} - 1;\n            if (${d[p-2]} < ${c[p-2]} &&\n                ${d[p-1]} < ${c[p-1]}) {\n              result.b = getValue(${d});\n            }\n            ${S.output} = result;\n          }\n        `;return Object.assign(Object.assign({},t),{output:{dims:c,type:n[0].type,textureType:o.TextureType.packed},shaderSource:O,hasMain:!0})})(e,u,t,n.axis)})};const s=(e,t,n)=>{const r=e.indexOf(t);return e.map(((e,t)=>t===r?`${e} - ${n}`:e)).join()}},6668:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.parseConcatAttributes=t.concat=void 0;const r=n(4910),o=n(5639),i=n(4595);t.concat=(e,t,n)=>(p(t),e.session.pack&&t[0].dims.length>1?[e.run((0,i.createPackedConcatProgramInfoLoader)(e,t,n),t)]:[e.run(a(e,t,n),t)]);const a=(e,t,n)=>{const r=(i=t.length,a=n.cacheKey,{name:"Concat",inputNames:Array.from({length:i},((e,t)=>`X${t}`)),inputTypes:Array(i).fill(o.TextureType.unpacked),cacheHint:a});var i,a;return Object.assign(Object.assign({},r),{get:()=>((e,t,n,r)=>{const i=n[0].dims.slice();if(r>=i.length||r<-1*i.length)throw new Error("axis specified for concat doesn't match input dimensionality");r<0&&(r=i.length+r);const a=i.slice(0);for(let e=1;e<n.length;e++){const t=n[e].dims.slice();for(let e=0;e<i.length;e++)if(e===r)a[r]+=t[e];else if(i[e]!==t[e])throw new Error("non concat dimensions must match")}const p=a.length,d=new Array(n.length);let f=0;for(let e=0;e<d.length;++e)f+=n[e].dims[r],d[e]=f;let h="";h=n.length<5?s(d):u(d);const g=`\n        ${l(n.length,p)}\n        ${c(d)}\n        ${h}\n        float process(int indices[${p}]) {\n          int textureIndex = getTextureWhereDataResides (indices[${r}]);\n\n          if(textureIndex != 0) {\n            indices[${r}] = indices[${r}] - int(getSizeInConcatAxisValueFromIndex(textureIndex-int(1)));\n          }\n\n          return fetchDataFromCorrectTexture(textureIndex, indices);\n        }`;return Object.assign(Object.assign({},t),{output:{dims:a,type:n[0].type,textureType:o.TextureType.unpacked},shaderSource:g})})(0,r,t,n.axis)})},s=e=>`int getTextureWhereDataResides(int index) {\n      ${e.map(((e,t)=>`if(index<${e}) {return ${t};}\n`)).join("")}\n    }`,u=e=>s(e),l=(e,t)=>{const n=[`float fetchDataFromCorrectTexture(int textureIndex, int indices[${t}]) {`];for(let t=0;t<e;++t)0===t?n.push(`\tif (textureIndex == ${t}) { return _X${t}(indices); }`):t===e-1?n.push(`\telse { return _X${t}(indices); }`):n.push(`\telse if (textureIndex == ${t}) { return _X${t}(indices); }`);return n.push("\t}"),n.join("\n")},c=e=>{const t=["int getSizeInConcatAxisValueFromIndex(int index) {"];for(let n=0;n<e.length;++n)0===n?t.push(`\tif (index == ${n}) { return ${e[n]}; }`):n===e.length-1?t.push(`\telse { return ${e[n]}; }`):t.push(`\telse if (index == ${n}) { return ${e[n]}; }`);return t.push("\t}"),t.join("\n")};t.parseConcatAttributes=e=>(0,r.createAttributeWithCacheKey)({axis:e.attributes.getInt("axis")});const p=e=>{if(!e||e.length<1)throw new Error("too few inputs");const t=e[0].type,n=e[0].dims.length;if("string"===t)throw new Error("string tensor is not supported yet");for(const r of e){if(r.type!==t)throw new Error("input tensors should be one type");if(r.dims.length!==n)throw new Error("input tensors should have the same shape")}}},7825:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.createUnpackedGroupedConvProgramInfoLoader=void 0;const r=n(1315),o=n(6757),i=n(5639),a=n(9754),s=n(2150);t.createUnpackedGroupedConvProgramInfoLoader=(e,t,n)=>{const u=(l=t.length>2,c=n.cacheKey,{name:"GroupedConv",inputNames:l?["X","W","Bias"]:["X","W"],inputTypes:l?[i.TextureType.unpacked,i.TextureType.unpacked,i.TextureType.unpacked]:[i.TextureType.unpacked,i.TextureType.unpacked],cacheHint:c});var l,c;return Object.assign(Object.assign({},u),{get:()=>((e,t,n,u)=>{const l=t.length>2?"value += getBias(output_channel);":"",c=t[0].dims.slice(),p=t[1].dims.slice(),d=p[0]/u.group;r.Logger.verbose("GroupedConv",`autpPad:${u.autoPad}, dilations:${u.dilations}, group:${u.group}, kernelShape:${u.kernelShape}, pads:${u.pads}, strides:${u.strides}`);const f=(0,a.calculateOutputShape)(c,p,u.dilations,u.pads,u.strides),h=(0,o.getGlsl)(e.session.backend.glContext.version),{activationFunction:g,applyActivation:m}=(0,s.getActivationSnippet)(u),b=`\n  const ivec2 strides = ivec2(${u.strides[0]}, ${u.strides[1]});\n  const ivec2 pads = ivec2(${u.pads[0]}, ${u.pads[1]});\n  ${g}\n  void main() {\n    ivec4 coords = getOutputCoords();\n    int batch = coords.x;\n    int output_channel = coords.y;\n    ivec2 xRCCorner = coords.zw * strides - pads;\n    int group_id = output_channel / ${d};\n\n    float value = 0.0;\n    for (int wInChannel = 0; wInChannel < ${p[1]}; wInChannel++) {\n      int input_channel = group_id * ${p[1]} + wInChannel;\n      for (int wHeight = 0; wHeight < ${p[2]}; wHeight++) {\n        int xHeight = xRCCorner.x + wHeight * ${u.dilations[0]};\n\n        if (xHeight < 0 || xHeight >= ${c[2]}) {\n          continue;\n        }\n\n        for (int wWidth = 0; wWidth < ${p[3]}; wWidth++) {\n          int xWidth = xRCCorner.y + wWidth * ${u.dilations[1]};\n          if (xWidth < 0 || xWidth >= ${c[3]}) {\n            continue;\n          }\n\n          float xVal = getX(batch, input_channel, xWidth, xHeight);\n          float wVal = getW(output_channel, wInChannel, wWidth, wHeight);\n          value += xVal*wVal;\n        }\n      }\n    }\n    ${l}\n    ${m}\n    ${h.output} = vec4(value, .0, .0, .0);\n  }\n`;return Object.assign(Object.assign({},n),{output:{dims:f,type:t[0].type,textureType:i.TextureType.unpacked},shaderSource:b,hasMain:!0})})(e,t,u,n)})}},7708:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.conv2DPacked=t.conv2DPackedPointwise=void 0;const r=n(9754),o=n(5950),i=n(5632);t.conv2DPackedPointwise=(e,t,n)=>{const o=t[0].dims,a=t[1].dims,s=(0,r.calculateOutputShape)(o,a,n.dilations,n.pads,n.strides),u=e.reshapePacked(t[0],[o[1],o[2]*o[3]]),l=e.reshapePacked(t[1],[a[0],a[1]]),c=t.length>2?[l,u,t[2]]:[l,u],p=e.run((0,i.createPackedMatmulProgramInfoLoader)(e,c,n),c);return e.reshapePacked(p,s)},t.conv2DPacked=(e,t,n)=>{const a=t[0].dims,s=t[1].dims,u=(0,r.calculateOutputShape)(a,s,n.dilations,n.pads,n.strides),l=e.run((0,o.createPackedIm2ColProgramInfoLoader)(e,t[0],t[1],u,n),[t[0]]),c=e.reshapePacked(t[1],[s[0],s[1]*s[2]*s[3]]),p=3===t.length?[c,l,t[2]]:[c,l],d=e.run((0,i.createPackedMatmulProgramInfoLoader)(e,p,n),p);return e.reshapePacked(d,u)}},5042:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.parseConvTransposeAttributes=t.convTranspose=void 0;const r=n(4910),o=n(6757),i=n(5639),a=n(2150),s=(e,t,n,r,o,i)=>(e-1)*t+n+(r-1)*o+1-i,u=(e,t,n,r,o)=>{const i=Math.floor(e/2);"SAME_UPPER"===t?(n[r]=i,n[o]=e-i):"SAME_LOWER"===t&&(n[r]=e-i,n[o]=i)};t.convTranspose=(e,t,n)=>(d(t,n),l(e,t,n));const l=(e,t,n)=>{const r=p(n,t);return[c(e,t,r)]},c=(e,t,n)=>e.run(((e,t,n)=>{const r=(s=t.length>2,u=n.cacheKey,{name:"ConvTranspose",inputNames:s?["X","W","B"]:["X","W"],inputTypes:s?[i.TextureType.unpacked,i.TextureType.unpacked,i.TextureType.unpacked]:[i.TextureType.unpacked,i.TextureType.unpacked],cacheHint:u});var s,u;return Object.assign(Object.assign({},r),{get:()=>((e,t,n,r)=>{const s=t.length>2?"getB(output_channel)":"0.0",u=t[0].dims,l=t[1].dims,c=l[1],p=l[0]/r.group,d=[t[0].dims[0],t[1].dims[1]*r.group,...r.outputShape],f=(0,o.getGlsl)(e.session.backend.glContext.version),{activationFunction:h,applyActivation:g}=(0,a.getActivationSnippet)(r),m=`\n  const ivec2 strides = ivec2(${r.strides[0]}, ${r.strides[1]});\n  const ivec2 pads = ivec2(${r.pads[0]}, ${r.pads[1]});\n  ${h}\n  void main() {\n    ivec4 coords = getOutputCoords();\n    int batch = coords.x;\n    int output_channel = coords.y;\n\n    ivec2 loc = coords.zw + pads;\n\n    int group_id = output_channel / ${c};\n    int wOutChannel = output_channel - group_id * ${c};\n\n    float value = ${s};\n    for (int inChannelOffset = 0; inChannelOffset < ${p}; inChannelOffset++) {\n      int input_channel = group_id * ${p} + inChannelOffset;\n      for (int wWOff = 0; wWOff < ${l[2]}; wWOff++) {\n        for (int wHOff = 0; wHOff < ${l[3]}; wHOff++) {\n          ivec2 wOff = ivec2(wWOff * ${r.dilations[0]}, wHOff * ${r.dilations[1]});\n          ivec2 wLoc = loc - wOff;\n          ivec2 wLocIn = wLoc / strides;\n          if (\n            wLocIn * strides == wLoc &&\n            wLocIn.x >= 0 && wLocIn.x < ${u[2]} &&\n            wLocIn.y >= 0 && wLocIn.y < ${u[3]}\n          ) {\n            float xVal = getX(batch, input_channel, wLocIn.y, wLocIn.x);\n            float wVal = getW(input_channel, wOutChannel, wHOff, wWOff);\n            value += xVal * wVal;\n          }\n        }\n      }\n    }\n    ${g}\n    ${f.output} = vec4(value, .0, .0, .0);\n  }\n`;return Object.assign(Object.assign({},n),{output:{dims:d,type:t[0].type,textureType:i.TextureType.unpacked},shaderSource:m,hasMain:!0})})(e,t,r,n)})})(e,t,n),t),p=(e,t)=>{const n=e.kernelShape.slice();if(0===e.kernelShape.length)for(let e=2;e<t[1].dims.length;++e)n.push(t[1].dims[e]);const r=e.pads.slice(),o=e.outputShape.slice();((e,t,n,r,o,i,a,l)=>{const c=e.length-2,p=0===l.length;for(let d=0;d<c;++d){const f=p?e[d+2]*i[d]:l[d],h=s(e[d+2],i[d],o[d],t[d],n[d],f);u(h,r,o,d,d+c),p&&l.push(i[d]*(e[d+2]-1)+a[d]+(t[d]-1)*n[d]+1-o[d]-o[d+c])}})(t[0].dims,n,e.dilations,e.autoPad,r,e.strides,e.outputPadding,o);const i=Object.assign({},e);return Object.assign(i,{kernelShape:n,pads:r,outputShape:o,cacheKey:e.cacheKey}),i};t.parseConvTransposeAttributes=e=>{const t=e.attributes,n=(0,a.parseInternalActivationAttributes)(t),o=t.getString("auto_pad","NOTSET"),i=t.getInts("dilations",[1,1]),s=t.getInt("group",1),u=t.getInts("kernel_shape",[]),l=t.getInts("output_padding",[0,0]),c=t.getInts("output_shape",[]),p=t.getInts("pads",[0,0,0,0]),d=t.getInts("strides",[1,1]);return(0,r.createAttributeWithCacheKey)(Object.assign({autoPad:o,dilations:i,group:s,kernelShape:u,outputPadding:l,outputShape:c,pads:p,strides:d},n))};const d=(e,t)=>{if(!e||2!==e.length&&3!==e.length)throw new Error("Conv requires 2 or 3 inputs");if(4!==e[0].dims.length||4!==e[1].dims.length)throw new Error("currently only support 2-dimensional conv");if(e[0].dims[1]!==e[1].dims[0])throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");const n=e[1].dims[1]*t.group;if(3===e.length&&(1!==e[2].dims.length||e[2].dims[0]!==n))throw new Error("invalid bias");const r=e[0].dims.length-2;if(t.dilations.length!==r)throw new Error(`dilations should be ${r}D`);if(t.strides.length!==r)throw new Error(`strides should be ${r}D`);if(t.pads.length!==2*r)throw new Error(`pads should be ${2*r}D`);if(t.outputPadding.length!==r)throw new Error(`output_padding should be ${r}D`);if(0!==t.kernelShape.length&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(0!==t.outputShape.length&&t.outputShape.length!==e[0].dims.length-2)throw new Error("invalid output shape");if("float32"!==e[0].type||"float32"!==e[1].type)throw new Error("ConvTranspose input(X,W) should be float tensor");if(3===e.length&&"float32"!==e[2].type)throw new Error("ConvTranspose input(bias) should be float tensor")}},9754:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.parseConvAttributes=t.conv=t.calculateOutputShape=void 0;const r=n(4910),o=n(7273),i=n(7825),a=n(7708),s=n(3281),u=n(2150),l=n(1625),c=n(8276);t.calculateOutputShape=(e,t,n,r,o)=>{const i=e[0],a=e.slice(2),s=a.length,u=t[0],l=t.slice(2).map(((e,t)=>e+(e-1)*(n[t]-1))),c=a.map(((e,t)=>e+r[t]+r[t+s])).map(((e,t)=>Math.floor((e-l[t]+o[t])/o[t])));return[i,u].concat(...c)},t.conv=(e,t,n)=>(g(t,n),p(e,t,n));const p=(e,t,n)=>{const r=h(n,t),o=e.session.pack,s=1===r.kernelShape[0]&&1===r.kernelShape[1];return r.group>1?[e.run((0,i.createUnpackedGroupedConvProgramInfoLoader)(e,t,r),t)]:s&&o?[d(e,t,r)]:o&&4===t[0].dims.length&&1===t[0].dims[0]&&!s?[(0,a.conv2DPacked)(e,t,r)]:[f(e,t,r)]},d=(e,n,r)=>{const o=n[0].dims,i=n[1].dims,a=(0,t.calculateOutputShape)(o,i,r.dilations,r.pads,r.strides),s=e.reshapeUnpacked(n[0],[o[1],o[2]*o[3]]),u=e.reshapeUnpacked(n[1],[i[0],i[1]]),l=n.length>2?[u,s,n[2]]:[u,s],p=e.run((0,c.createMatmulProgramInfoLoader)(l,r),l);return e.reshapeUnpacked(p,a)},f=(e,n,r)=>{const o=n[0].dims,i=n[1].dims,a=(0,t.calculateOutputShape)(o,i,r.dilations,r.pads,r.strides),u=e.run((0,l.createIm2ColProgramInfoLoader)(e,n[0],n[1],a,r),[n[0]]),c=3===n.length?[u,n[1],n[2]]:[u,n[1]];return e.run((0,s.createDotProductProgramInfoLoader)(e,n,a,r),c)},h=(e,t)=>{const n=e.kernelShape.slice();if(0===e.kernelShape.length)for(let e=2;e<t[1].dims.length;++e)n.push(t[1].dims[e]);const r=e.pads.slice();o.PoolConvUtil.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,n,r,e.autoPad);const i=Object.assign({},e);return Object.assign(i,{kernelShape:n,pads:r,cacheKey:e.cacheKey}),i};t.parseConvAttributes=e=>{const t=e.attributes,n=(0,u.parseInternalActivationAttributes)(t),o=t.getString("auto_pad","NOTSET"),i=t.getInts("dilations",[1,1]),a=t.getInt("group",1),s=t.getInts("kernel_shape",[]),l=t.getInts("pads",[0,0,0,0]),c=t.getInts("strides",[1,1]);return(0,r.createAttributeWithCacheKey)(Object.assign({autoPad:o,dilations:i,group:a,kernelShape:s,pads:l,strides:c},n))};const g=(e,t)=>{if(!e||2!==e.length&&3!==e.length)throw new Error("Conv requires 2 or 3 inputs");if(4!==e[0].dims.length||4!==e[1].dims.length)throw new Error("currently only support 2-dimensional conv");if(e[0].dims[1]!==e[1].dims[1]*t.group)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(3===e.length&&(1!==e[2].dims.length||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");const n=e[0].dims.length-2;if(t.dilations.length!==n)throw new Error(`dilations should be ${n}D`);if(t.strides.length!==n)throw new Error(`strides should be ${n}D`);if(t.pads.length!==2*n)throw new Error(`pads should be ${2*n}D`);if(0!==t.kernelShape.length&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if("float32"!==e[0].type||"float32"!==e[1].type)throw new Error("Conv input(X,W) should be float tensor");if(3===e.length&&"float32"!==e[2].type)throw new Error("Conv input(bias) should be float tensor")}},6742:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.parseDepthToSpaceAttributes=t.depthToSpace=void 0;const r=n(5707);t.depthToSpace=(e,t,n)=>{o(t);const i=n.blocksize,a=i*i,s="DCR"===n.mode?[0,3,4,1,5,2]:[0,1,4,2,5,3],u="DCR"===n.mode?[t[0].dims[0],i,i,t[0].dims[1]/a,t[0].dims[2],t[0].dims[3]]:[t[0].dims[0],t[0].dims[1]/a,i,i,t[0].dims[2],t[0].dims[3]],l=e.reshapeUnpacked(t[0],u),c={perm:s,cacheKey:`${s}`},[p]=(0,r.transpose)(e,[l],c),d=[t[0].dims[0],t[0].dims[1]/a,t[0].dims[2]*i,t[0].dims[3]*i];return[e.reshapeUnpacked(p,d)]},t.parseDepthToSpaceAttributes=e=>{const t=e.attributes.getInt("blocksize");if(t<1)throw new Error(`blocksize must be >= 1, but got : ${t} for DepthToSpace`);const n=e.attributes.getString("mode","DCR");if("DCR"!==n&&"CRD"!==n)throw new Error(`unrecognized mode: ${n} for DepthToSpace`);return{mode:n,blocksize:t}};const o=e=>{if(1!==e.length)throw new Error(`DepthToSpace expect 1 inputs, but got ${e.length}`);if("string"===e[0].type||4!==e[0].dims.length)throw new TypeError("DepthToSpace input should be a 4-D numeric tensor")}},3281:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.createDotProductProgramInfoLoader=void 0;const r=n(7273),o=n(6757),i=n(5639),a=n(2150),s=n(1625);t.createDotProductProgramInfoLoader=(e,t,n,u)=>{const l=((e,t)=>({name:"ConvDotProduct",inputNames:e?["Im2Col","K","B"]:["Im2Col","K"],inputTypes:e?[i.TextureType.unpacked,i.TextureType.packedLastDimension,i.TextureType.unpacked]:[i.TextureType.unpacked,i.TextureType.packedLastDimension],cacheKey:t.activationCacheKey}))(t.length>2,u);return Object.assign(Object.assign({},l),{get:()=>((e,t,n,u,l)=>{const c=n[0].dims,p=n[1].dims,d=[p[0],Math.ceil(c[1]*p[2]*p[3]/4)],f=(0,s.calculateIm2ColDims)(c,p,u),[h,g]=e.calculateTextureWidthAndHeight(d,i.TextureType.packedLastDimension),m=r.ShapeUtil.computeStrides(f),[b,y]=e.calculateTextureWidthAndHeight(f,i.TextureType.packedLastDimension),w=u.length,_=n.length<3?"0.0":"_B(b)",v=Math.ceil(c[1]*p[2]*p[3]/4),{activationFunction:x,applyActivation:T}=(0,a.getActivationSnippet)(l),S=(0,o.getGlsl)(e.session.backend.glContext.version),O=`\n${x}\nfloat process(int indices[${w}]) {\n  int b[1];\n  b[0] = indices[1];\n  int im2col[4];\n  im2col[0] = indices[0];\n  im2col[1] = indices[2];\n  im2col[2] = indices[3];\n  int im2colOffset = im2col[0] * ${m[0]} + im2col[1] * ${m[1]} + im2col[2] * ${m[2]};\n  int kernelOffset = indices[1] * ${d[1]};\n  float value = ${_};\n  for (int i = 0; i < ${v}; ++i) {\n    vec2 im2colCoords = offsetToCoords(im2colOffset, ${b}, ${y});\n    vec2 kernelCoords = offsetToCoords(kernelOffset, ${h}, ${g});\n    value += dot(${S.texture2D}(Im2Col, im2colCoords), ${S.texture2D}(K, kernelCoords));\n    ++im2colOffset;\n    ++kernelOffset;\n  }\n  ${T}\n  return value;\n}`;return Object.assign(Object.assign({},t),{output:{dims:u,type:n[0].type,textureType:i.TextureType.unpacked},shaderSource:O})})(e,l,t,n,u)})}},4125:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.parseFlattenAttributes=t.flatten=void 0;const r=n(7273);t.flatten=(e,t,n)=>{o(t,n);const i=r.ShapeUtil.flattenShape(t[0].dims,n);return[e.reshapeUnpacked(t[0],i)]},t.parseFlattenAttributes=e=>e.attributes.getInt("axis",1);const o=(e,t)=>{if(!e||1!==e.length)throw new Error("Flatten requires 1 input.");const n=e[0].dims.length;if(0===n)throw new Error("scalar tensor is not supported.");if(t<-n||t>n)throw new Error("Invalid axis");if("string"===e[0].type)throw new Error("string tensor is not supported.")}},2150:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.parseInternalActivationAttributes=t.getActivationSnippet=void 0;const r=n(7273),o=n(9087);t.getActivationSnippet=function(e){let t;switch(e.activation){case"Relu":t=(0,o.glslRelu)();break;case"Sigmoid":t=(0,o.glslSigmoid)();break;case"Clip":t=(0,o.glslClip)(e.clipMin,e.clipMax);break;default:return{activationFunction:"",applyActivation:""}}const n=t.name;return{activationFunction:t.body,applyActivation:`value = ${n}_(value);`}},t.parseInternalActivationAttributes=e=>{const t=e.getString("activation","");if("Clip"===t){const[n,o]=e.getFloats("activation_params",[r.MIN_CLIP,r.MAX_CLIP]);return{activation:t,clipMax:o,clipMin:n,activationCacheKey:`${t}:${n},${o}`}}return{activation:t,activationCacheKey:t}}},6149:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.parseGatherAttributes=t.gather=void 0;const r=n(4910),o=n(6145),i=n(7273),a=n(5639);t.gather=(e,t,n)=>(l(t,n.axis),[e.run(u(e,t,n),t)]),t.parseGatherAttributes=e=>(0,r.createAttributeWithCacheKey)({axis:e.attributes.getInt("axis",0)});const s={name:"Gather",inputNames:["A","B"],inputTypes:[a.TextureType.unpacked,a.TextureType.unpacked]},u=(e,t,n)=>{const r=Object.assign(Object.assign({},s),{cacheHint:n.cacheKey});return Object.assign(Object.assign({},r),{get:()=>((e,t,n,r)=>{const o=n[0].dims.slice(),s=n[1].dims.slice(),u=new Array(o.length+s.length-1);r=i.ShapeUtil.normalizeAxis(r,o.length);const l=[];for(let e=0;e<u.length;e++)e<r?(u[e]=o[e],l.push(`inputIdx[${e}] = outputIdx[${e}];`)):e<r+s.length?(u[e]=s[e-r],l.push(`indexDataIdx[${e-r}] = outputIdx[${e}];`)):(u[e]=o[e-s.length+1],l.push(`inputIdx[${e-s.length+1}] = outputIdx[${e}];`));const c=`\n      float process(int outputIdx[${u.length||1}]) {\n        int inputIdx[${o.length}];\n        int indexDataIdx[${s.length||1}];\n        indexDataIdx[0] = 0;\n        ${l.join("\n        ")}\n        int idx = int(_B(indexDataIdx));\n        inputIdx[${r}] = idx < 0 ? idx + ${o[r]} : idx;\n        return _A(inputIdx);\n      }`;return Object.assign(Object.assign({},t),{output:{dims:u,type:n[0].type,textureType:a.TextureType.unpacked},shaderSource:c})})(0,r,t,n.axis)})},l=(e,t)=>{if(!e||2!==e.length)throw new Error("Gather requires 2 inputs.");const n=e[0].dims.length;if(n<1)throw new Error("Invalid input shape.");if(t<-n||t>n-1)throw new Error("Invalid axis.");if(-1===o.NUMBER_TYPES.indexOf(e[0].type))throw new Error("Invaid input type.");if("int32"!==e[1].type&&"int16"!==e[1].type)throw new Error("Invaid input type.")}},5378:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.parseGemmAttributesV11=t.parseGemmAttributesV7=t.gemm=void 0;const r=n(4910),o=n(7273),i=n(5639);t.gemm=(e,t,n)=>(l(t,n),[e.run(s(t,n),t)]);const a=(e,t)=>{const n=0!==e.attributes.getInt("transA",0),o=0!==e.attributes.getInt("transB",0),i=e.attributes.getFloat("alpha",1),a=e.attributes.getFloat("beta",1);return(0,r.createAttributeWithCacheKey)({transA:n,transB:o,alpha:i,beta:a,isOptionalC:t})};t.parseGemmAttributesV7=e=>a(e,!1),t.parseGemmAttributesV11=e=>a(e,!0);const s=(e,t)=>{const n={name:"Gemm",inputNames:3===e.length?["A","B","C"]:["A","B"],inputTypes:3===e.length?[i.TextureType.unpacked,i.TextureType.unpacked,i.TextureType.unpacked]:[i.TextureType.unpacked,i.TextureType.unpacked],key:t.cacheKey};return Object.assign(Object.assign({},n),{get:()=>u(n,e,t)})},u=(e,t,n)=>{const r=t[0].dims.slice(),a=t[1].dims.slice(),[s,u]=o.GemmUtil.getShapeOfGemmResult(r,n.transA,a,n.transB,3===t.length?t[2].dims:void 0),l=[s,u];if(!l)throw new Error("Can't use gemm on the given tensors");let c=r[r.length-1],p="";n.transA&&(c=r[0]),n.transA&&n.transB?p="value += _A_T(a) * _B_T(b);":n.transA&&!n.transB?p="value += _A_T(a) * _B(b);":!n.transA&&n.transB?p="value += _A(a) * _B_T(b);":n.transA||n.transB||(p="value += _A(a) * _B(b);");const d=l.length,f=`\n      float process(int indices[${d}]) {\n          int a[${d}];\n          int b[${d}];\n          ${3===t.length?`int c[${t[2].dims.length}];`:""}\n\n          copyVec(indices, a);\n          copyVec(indices, b);\n          ${3===t.length?"bcastIndices_C(indices, c);":""}\n\n          float value = 0.0;\n          for (int k=0; k<${c}; ++k) {\n              a[${d-1}] = k;\n              b[${d-2}] = k;\n              ${p}\n          }\n\n          value = value * alpha;\n          ${3===t.length?"value += beta * _C(c);":""}\n          return value;\n      }`;return Object.assign(Object.assign({},e),{output:{dims:l,type:t[0].type,textureType:i.TextureType.unpacked},variables:[{name:"alpha",type:"float",data:n.alpha},{name:"beta",type:"float",data:n.beta}],shaderSource:f})},l=(e,t)=>{if(!e)throw new Error("Input is missing");if(t.isOptionalC&&(e.length<2||e.length>3))throw new Error("Invaid input shape.");if(!t.isOptionalC&&3!==e.length)throw new Error("Gemm requires 3 inputs");if(3===e.length&&1!==e[2].dims.length&&2!==e[2].dims.length)throw new Error("Invalid input shape of C");if("float32"!==e[0].type&&"float64"!==e[0].type||"float32"!==e[1].type&&"float64"!==e[1].type||3===e.length&&"float32"!==e[2].type&&"float64"!==e[2].type)throw new Error("Invalid input type.");if(e[0].type!==e[1].type||3===e.length&&e[0].type!==e[2].type)throw new Error("Input types are mismatched")}},5950:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.createPackedIm2ColProgramInfoLoader=void 0;const r=n(6757),o=n(5639),i=n(5614);t.createPackedIm2ColProgramInfoLoader=(e,t,n,a,s)=>{const u=(l=s.cacheKey,{name:"Im2Col (packed)",inputNames:["A"],inputTypes:[o.TextureType.packed],cacheHint:l});var l;return Object.assign(Object.assign({},u),{get:()=>((e,t,n,a,s,u)=>{const l=n.dims,c=a.dims,p=s.length,d=[c[1]*c[2]*c[3],s[2]*s[3]],f=c[2]*c[3],h=(0,i.unpackFromChannel)(),g=(0,r.getGlsl)(e.session.backend.glContext.version);let m="";for(let e=0;e<=1;e++)for(let t=0;t<=1;t++)m+=`\n            blockIndex = rc.x + ${t};\n            pos = rc.y + ${e};\n\n            if(blockIndex < ${d[1]} && pos < ${d[0]}) {\n              offsetY = int(blockIndex / (${s[p-1]})) * ${u.strides[0]} -\n                ${u.pads[0]};\n              d0 = offsetY + ${u.dilations[0]} * (imod(pos, ${f}) / ${c[2]});\n\n              if(d0 < ${l[2]} && d0 >= 0) {\n                offsetX = imod(blockIndex, ${s[p-1]}) * ${u.strides[1]} -\n                  ${u.pads[1]};\n                d1 = offsetX + ${u.dilations[1]} * imod(imod(pos, ${f}), ${c[2]});\n\n                if(d1 < ${l[3]} && d1 >= 0) {\n\n                  ch = int(float(pos)/ ${f}.);\n                    innerDims = vec2(d0, d1);\n                    result[${2*e+t}] = getChannel(\n                      getA(0, ch, int(innerDims.x),\n                      int(innerDims.y)), innerDims);\n                }\n              }\n            }\n\n          `;const b=`\n      ${h}\n\n      void main() {\n        ivec2 rc = getOutputCoords();\n          vec4 result = vec4(0.0);\n          int blockIndex, pos, offsetY, d0, offsetX, d1, ch;\n          vec2 innerDims;\n          ${m}\n          ${g.output} = result;\n      }\n            `;return Object.assign(Object.assign({},t),{output:{dims:d,type:n.type,textureType:o.TextureType.packed},shaderSource:b,hasMain:!0})})(e,u,t,n,a,s)})}},1625:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.calculateIm2ColDims=t.createIm2ColProgramInfoLoader=void 0;const r=n(5639);t.createIm2ColProgramInfoLoader=(e,n,o,i,a)=>{const s=(u=a.cacheKey,{name:"Im2Col",inputNames:["X"],inputTypes:[r.TextureType.unpacked],cacheHint:u});var u;return Object.assign(Object.assign({},s),{get:()=>((e,n,o,i,a,s)=>{const u=o.dims,l=i.dims,c=a.length,p=(0,t.calculateIm2ColDims)(u,l,a,4),d=`\n        const int XC = ${u[1]};\n        const int XH = ${u[2]};\n        const int XW = ${u[3]};\n        const int KH = ${s.kernelShape[0]};\n        const int KW = ${s.kernelShape[1]};\n        const int dilationH = ${s.dilations[0]};\n        const int dilationW = ${s.dilations[1]};\n        const int strideH = ${s.strides[0]};\n        const int strideW = ${s.strides[1]};\n        const int padH = ${s.pads[0]};\n        const int padW = ${s.pads[1]};\n        const int KHKW = KH*KW;\n        const int XCKHKW = XC * KHKW;\n        const int outputChannels = 4;\n        vec4 process(int indices[${c}]) {\n          int b  = indices[0]; // batch size\n          int oh = indices[1] * strideH - padH; //output height\n          int ow = indices[2] * strideW - padW; //output width\n          int p = indices[3] * outputChannels; //patch\n          vec4 value = vec4(0.0);\n          for(int i=0; i < outputChannels; ++i) {\n            if(p < XCKHKW) {\n              int patchC = p / KHKW;\n              int patchH = (p - patchC*KHKW) / KW;\n              int patchW = (p - patchC*KHKW) - patchH * KW;\n              int xh2 = oh + patchH * dilationH;\n              int xw2 = ow + patchW * dilationW;\n              int x[${u.length}];\n              x[0] = b;\n              x[1] = patchC;\n              x[2] = xh2;\n              x[3] = xw2;\n              if(xh2 >= 0 &&\n                  xh2 < XH &&\n                  xw2 >= 0 &&\n                  xw2 < XW) {\n                value[i] = _X(x);\n              }\n            }\n            ++p;\n          }\n          return value;\n        }\n        `;return Object.assign(Object.assign({},n),{output:{dims:p,type:o.type,textureType:r.TextureType.packedLastDimension},shaderSource:d})})(0,s,n,o,i,a)})},t.calculateIm2ColDims=(e,t,n,r=4)=>[n[0],n[2],n[3],Math.ceil(e[1]*t[2]*t[3]/r)]},6981:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.parseImageScalerAttributes=t.imageScaler=void 0;const r=n(4910),o=n(5639);t.imageScaler=(e,t,n)=>(u(t),[e.run(a(e,t,n),t)]),t.parseImageScalerAttributes=e=>{const t=e.attributes.getFloat("scale"),n=e.attributes.getFloats("bias");return(0,r.createAttributeWithCacheKey)({scale:t,bias:n})};const i={name:"ImageScaler",inputNames:["X"],inputTypes:[o.TextureType.unpacked]},a=(e,t,n)=>{const r=Object.assign(Object.assign({},i),{cacheHint:n.cacheKey});return Object.assign(Object.assign({},r),{get:()=>((e,t,n,r)=>{const i=n[0].dims.slice(),a=i.length,u=`\n      ${s(r.bias.length)}\n      float process(int indices[${a}]) {\n        return _X(indices) * scale + getBias(bias, indices[1]);\n      }`;return Object.assign(Object.assign({},t),{output:{dims:i,type:n[0].type,textureType:o.TextureType.unpacked},variables:[{name:"bias",type:"float",arrayLength:r.bias.length,data:r.bias},{name:"scale",type:"float",data:r.scale}],shaderSource:u})})(0,r,t,n)})},s=e=>{const t=[`float getBias(float bias[${e}], int channel) {`];for(let n=0;n<e;++n)0===n?t.push(`\tif (channel == ${n}) { return bias[${n}]; }`):n===e-1?t.push(`\telse { return bias[${n}]; }`):t.push(`\telse if (channel == ${n}) { return bias[${n}]; }`);return t.push("\t}"),t.join("\n")},u=e=>{if(!e||1!==e.length)throw new Error("ImageScaler requires 1 input.");if(4!==e[0].dims.length)throw new Error("Invalid input shape.");if("float32"!==e[0].type&&"float64"!==e[0].type)throw new Error("Invalid input type.")}},7413:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.parseInstanceNormalizationAttributes=t.instanceNormalization=void 0;const r=n(6757),o=n(5639);t.instanceNormalization=(e,t,n)=>{l(t);const r=e.run(a(t[0]),t);return[e.run(u(e,t[0],n,r.dims),[t[0],r,t[1],t[2]])]},t.parseInstanceNormalizationAttributes=e=>e.attributes.getFloat("epsilon",1e-5);const i={name:"InstanceNormalization_MeanAndVariance",inputNames:["X"],inputTypes:[o.TextureType.unpacked]},a=e=>Object.assign(Object.assign({},i),{get:()=>((e,t)=>{const n=t.dims.slice(),r=n[1],i=n[2]*n[3],a=[n[0],r],s=`\n      vec4 process(int[2] indices) {\n        vec4 v = vec4(0.0);\n        int a[4];\n        a[0] = indices[0];\n        a[1] = indices[1];\n        float temp = 0.0;\n        for(int a2=0; a2<${n[2]}; a2++) {\n          a[2] = a2;\n          for(int a3=0; a3<${n[3]}; a3++) {\n            a[3] = a3;\n            float x = _X(a);\n            temp += x;\n          }\n        }\n        float mean = temp / float(${i});\n        temp = 0.0;\n        for(int a2=0; a2<${n[2]}; a2++) {\n          a[2] = a2;\n          for(int a3=0; a3<${n[3]}; a3++) {\n            a[3] = a3;\n            float x = _X(a);\n            temp += (x - mean) * (x - mean);\n          }\n        }\n        v.r = mean;\n        v.g = temp / float(${i});\n\n        return v;\n      }`;return Object.assign(Object.assign({},e),{output:{dims:a,type:t.type,textureType:o.TextureType.packedLastDimension},shaderSource:s})})(i,e)}),s={name:"InstanceNormalization_ComputeOutput",inputNames:["X","MeanAndVariance","Scale","B"],inputTypes:[o.TextureType.unpacked,o.TextureType.packedLastDimension,o.TextureType.unpacked,o.TextureType.unpacked]},u=(e,t,n,i)=>{const a=Object.assign(Object.assign({},s),{cacheHint:`${n}`});return Object.assign(Object.assign({},a),{get:()=>((e,t,n,i,a)=>{const s=(0,r.getGlsl)(e.session.backend.glContext.version),[u,l]=e.calculateTextureWidthAndHeight(a,o.TextureType.packedLastDimension),[c,p]=[u/4,l],d=`\n      vec4 get_MeanAndVariance(int[2] mv) {\n        int offset = indicesToOffset_MeanAndVariance(mv);\n        vec2 coords = offsetToCoords(offset, ${c}, ${p});\n        return ${s.texture2D}(MeanAndVariance, coords);\n      }\n\n      float process(int[4] indices) {\n        int mv[2];\n        mv[0] = indices[0];\n        mv[1] = indices[1];\n        vec4 mean_and_variance = get_MeanAndVariance(mv);\n        float mean = mean_and_variance.r;\n        float variance = mean_and_variance.g;\n\n        int sb[1];\n        sb[0] = indices[1];\n        float scale = _Scale(sb);\n        float b = _B(sb);\n\n        return scale * (_X(indices) - mean) / sqrt(variance + epsilon) + b;\n      }`;return Object.assign(Object.assign({},t),{output:{dims:n.dims,type:n.type,textureType:o.TextureType.unpacked},variables:[{name:"epsilon",type:"float",data:i}],shaderSource:d})})(e,a,t,n,i)})},l=e=>{if(!e||3!==e.length)throw new Error("InstanceNormalization requires 3 inputs.");const t=e[0],n=e[1],r=e[2];if(t.dims.length<3||1!==n.dims.length||1!==r.dims.length)throw new Error("Invalid input shape.");if(n.dims[0]!==t.dims[1]||r.dims[0]!==t.dims[1])throw new Error("Input shapes are mismatched.");if("float32"!==t.type&&"float64"!==t.type||"float32"!==n.type&&"float64"!==n.type||"float32"!==r.type&&"float64"!==r.type)throw new Error("Invalid input type.");if(4!==e[0].dims.length)throw new Error("Only support 4-D input shape.")}},7006:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.createLrnProgramInfoLoader=t.parseLrnAttributes=t.lrn=void 0;const r=n(4910),o=n(5639);t.lrn=(e,t,n)=>(s(t),[e.run(a(t,n),t)]),t.parseLrnAttributes=e=>{const t=e.attributes.getFloat("alpha",1e-4),n=e.attributes.getFloat("beta",.75),o=e.attributes.getFloat("bias",1),i=e.attributes.getInt("size");return(0,r.createAttributeWithCacheKey)({alpha:t,beta:n,bias:o,size:i})};const i={name:"LRN",inputNames:["X"],inputTypes:[o.TextureType.unpacked]};function a(e,t){return Object.assign(Object.assign({},i),{cacheHint:t.cacheKey,get:()=>function(e,t){const n=e[0].dims[1],r=e[0].dims.length,a=-Math.floor((t.size-1)/2),s=Math.ceil((t.size-1)/2),u=`float(${t.alpha}) / float(${t.size})`,l=`\n    float process(int indices[${r}]) {\n        int c = indices[1];\n        float x = _X(indices);\n        float square_sum = 0.0;\n\n        for (int i = ${a}; i <= ${s}; i++) {\n          int idx = c + i;\n          if (c >= 0 && c < ${n}) {\n            indices[1] = idx;\n            float j = _X(indices);\n            square_sum += j * j;\n          }\n        }\n        return x / pow(float(${t.bias}) + ${u} * square_sum, float(${t.beta}));\n    }`;return Object.assign(Object.assign({},i),{cacheHint:t.cacheKey,output:{dims:e[0].dims,type:e[0].type,textureType:o.TextureType.unpacked},shaderSource:l})}(e,t)})}t.createLrnProgramInfoLoader=a;const s=e=>{if(!e||1!==e.length)throw new Error("LRN requires 1 input.");if(4!==e[0].dims.length)throw new Error('currently only support LRN for input with "NCHW" format');if("float32"!==e[0].type)throw new Error("input should be float type")}},5632:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.createPackedMatmulProgramInfoLoader=void 0;const r=n(7273),o=n(6757),i=n(5639),a=n(432),s=n(2150),u=n(8276);t.createPackedMatmulProgramInfoLoader=(e,t,n)=>{const l=(c=t.length>2,p=n.activationCacheKey,{name:"MatMul (packed)",inputNames:c?["A","B","Bias"]:["A","B"],inputTypes:c?[i.TextureType.packed,i.TextureType.packed,i.TextureType.packed]:[i.TextureType.packed,i.TextureType.packed],cacheHint:p});var c,p;return Object.assign(Object.assign({},l),{get:()=>((e,t,n,l)=>{const c=n.length>2,p=c?"value += getBiasForMatmul();":"",d=n[0].dims,f=n[1].dims,h=r.BroadcastUtil.calcShape(d,f,!0),g=!r.ShapeUtil.areEqual(n[0].dims,n[1].dims);if(!h)throw new Error("Can't use matmul on the given tensors");const m=d[d.length-1],b=Math.ceil(m/2),y=d.length,w=f.length,_=(0,o.getGlsl)(e.session.backend.glContext.version),v=(0,a.getCoordsDataType)(h.length),x=h.length,T=(0,a.getGlChannels)(),{activationFunction:S,applyActivation:O}=(0,s.getActivationSnippet)(l),A=c?`${(0,u.getBiasForMatmul)(v,T,n[2].dims,h,!0)}`:"",E=g?`${function(e,t,n,o){let i=[],a=[];const s=n[0].dims,u=n[1].dims,l=s.length,c=u.length,p=o.length,d=p-l,f=p-c;i=s.map(((e,n)=>`coords.${t[n+d]}`)),i[l-1]="i*2",i.join(", "),a=u.map(((e,n)=>`coords.${t[n+f]}`)),a[c-2]="i*2",a.join(", ");const h=r.BroadcastUtil.getBroadcastDims(s,o),g=r.BroadcastUtil.getBroadcastDims(u,o),m=h.map((e=>`coords.${t[e+d]} = 0;`)).join("\n"),b=g.map((e=>`coords.${t[e+f]} = 0;`)).join("\n"),y=`int lastDim = coords.${t[p-1]};\n  coords.${t[p-1]} = coords.${t[p-2]};\n  coords.${t[p-2]} = lastDim;`;return`\nvec4 getAAtOutCoordsMatmul(int i) {\n  ${e} coords = getOutputCoords();\n  ${y}\n  ${m}\n  vec4 outputValue = getA(${i});\n  return outputValue;\n}\n\nvec4 getBAtOutCoordsMatmul(int i) {\n  ${e} coords = getOutputCoords();\n  ${y}\n  ${b}\n  vec4 outputValue = getB(${a});\n  return outputValue;\n}`}(v,T,n,h)}`:"",I=g?"getAAtOutCoordsMatmul(i)":`getA(${function(e,t){let n="";for(let r=0;r<t-2;r++)n+=`rc.${e[r]}, `;return n+=`rc.${e[t-2]}, i*2`,n}(T,y)})`,$=g?"getBAtOutCoordsMatmul(i)":`getB(${function(e,t){let n="";for(let r=0;r<t-2;r++)n+=`rc.${e[r]}, `;return n+=`i*2, rc.${e[t-1]}`,n}(T,w)})`,P=`\n            ${E}\n            ${A}\n            ${S}\n            void main() {\n              ${g?"":`${v} rc =\n          getOutputCoords(); int lastDim = rc.${T[x-1]}; rc.${T[x-1]} =\n          rc.${T[x-2]}; rc.${T[x-2]} = lastDim;\n      `}\n\n              vec4 value = vec4(0);\n              for (int i = 0; i < ${b}; i++) {\n                vec4 a = ${I};\n                vec4 b = ${$};\n\n                value += (a.rrbb * b.rgrg);\n                value += (a.ggaa * b.baba);\n              }\n              ${p}\n              ${O}\n              ${_.output} = value;\n            }`;return Object.assign(Object.assign({},t),{output:{dims:h,type:n[0].type,textureType:i.TextureType.packed},shaderSource:P,hasMain:!0})})(e,l,t,n)})}},8276:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getBiasForMatmul=t.createMatmulProgramInfoLoader=t.parseMatMulAttributes=t.matMul=void 0;const r=n(7273),o=n(5639),i=n(432),a=n(2150),s=n(5632);t.matMul=(e,t,n)=>(c(t),e.session.pack?[e.run((0,s.createPackedMatmulProgramInfoLoader)(e,t,n),t)]:[e.run(l(t,n),t)]),t.parseMatMulAttributes=e=>(0,a.parseInternalActivationAttributes)(e.attributes);const u=(e,t)=>({name:"MatMul",inputNames:e?["A","B","Bias"]:["A","B"],inputTypes:e?[o.TextureType.unpacked,o.TextureType.unpacked,o.TextureType.unpacked]:[o.TextureType.unpacked,o.TextureType.unpacked],cacheHint:t});function l(e,t){const n=u(e.length>2,t.activationCacheKey);return Object.assign(Object.assign({},n),{get:()=>function(e,t,n){const s=t[0].dims,u=t[1].dims,l=r.BroadcastUtil.calcShape(s,u,!0);if(!l)throw new Error("Can't use matmul on the given tensors");const c=(0,i.getCoordsDataType)(l.length),d=(0,i.getGlChannels)(),{activationFunction:f,applyActivation:h}=(0,a.getActivationSnippet)(n),g=t.length>2,m=g?"value += getBiasForMatmul();":"",b=g?`${p(c,d,t[2].dims,l,!1)}`:"",y=l.length,w=s.length,_=u.length,v=`\n    ${f}\n    ${b}\n    float process(int indices[${y}]) {\n        int a[${w}];\n        int b[${_}];\n        bcastMatmulIndices_A(indices, a);\n        bcastMatmulIndices_B(indices, b);\n\n        float value;\n        for (int k=0; k<${s[s.length-1]}; ++k) {\n            a[${w-1}] = k;\n            b[${_-2}] = k;\n            value += _A(a) * _B(b);\n        }\n        ${m}\n        ${h}\n        return value;\n    }`;return Object.assign(Object.assign({},e),{output:{dims:l,type:t[0].type,textureType:o.TextureType.unpacked},shaderSource:v})}(n,e,t)})}t.createMatmulProgramInfoLoader=l;const c=e=>{if(!e||2!==e.length)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.");if("float32"!==e[0].type&&"float64"!==e[0].type||"float32"!==e[1].type&&"float64"!==e[1].type)throw new Error("inputs should be float type");if(e[0].type!==e[1].type)throw new Error("inputs types should match")};function p(e,t,n,o,i){let a="";const s=n.length,u=o.length,l=u-s;a=u<2&&s>0?"coords":n.map(((e,n)=>`coords.${t[n+l]}`)).join(", ");const c=r.BroadcastUtil.getBroadcastDims(n,o).map((e=>`coords.${t[e+l]} = 0;`)).join("\n");let p="vec4(outputValue.xx, outputValue.yy)";return 1===r.ShapeUtil.size(n)&&(p="vec4(outputValue.x)"),i?`\nvec4 getBiasForMatmul() {\n  ${e} coords = getOutputCoords();\n  ${c}\n  vec4 outputValue = getBias(${a});\n  return ${p};\n}`:`\nfloat getBiasForMatmul() {\n  ${e} coords = getOutputCoords();\n  ${c}\n  return getBias(coords.x);\n}`}t.getBiasForMatmul=p},9:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.createPackProgramInfoLoader=void 0;const r=n(6757),o=n(5639),i=n(432),a=n(5614),s={name:"pack",inputNames:["A"],inputTypes:[o.TextureType.unpackedReversed]};t.createPackProgramInfoLoader=(e,t)=>Object.assign(Object.assign({},s),{get:()=>((e,t)=>{const n=(0,r.getGlsl)(e.session.backend.glContext.version),u=t.dims,l=u.length,c=t.dims.length,p=(0,i.getCoordsDataType)(c),d=(0,a.getChannels)("rc",c),f=(h=c,g=d,m=u[u.length-2],b=u[u.length-1],0===h||1===h?"":`\n    int r = ${g[h-2]};\n    int c = ${g[h-1]};\n    int rp1 = ${g[h-2]} + 1;\n    int cp1 = ${g[h-1]} + 1;\n    bool rEdge = rp1 >= ${b};\n    bool cEdge = cp1 >= ${m};\n    `);var h,g,m,b;let y;y=0===l?[1,1]:1===l?[u[0],1]:[u[c-1],u[c-2]];const w=function(e,t,n){if(0===e)return"false";if(1===e)return`rc > ${t[0]}`;let r="";for(let o=e-2;o<e;o++)r+=`${n[o]} >= ${t[o-e+2]}`,o<e-1&&(r+="||");return r}(c,y,d),_=function(e,t){const n=e.length;if(0===n)return"getA(), 0, 0, 0";if(1===n)return`getA(rc),\n            rc + 1 >= ${e[0]} ? 0. : getA(rc + 1),\n            0, 0`;let r="";if(n>2)for(let e=0;e<n-2;++e)r+=`${t[e]},`;return`getA(${r}r, c),\n          rEdge ? 0. : getA(${r}rp1, c),\n          cEdge ? 0. : getA(${r}r, cp1),\n          rEdge || cEdge ? 0. : getA(${r}rp1, cp1)`}(u,d),v=`\n        void main() {\n          ${p} rc = getOutputCoords();\n\n          if(${w}) {\n            ${n.output} = vec4(0);\n          } else {\n            ${f}\n\n            ${n.output} = vec4(${_});\n          }\n        }\n      `;return Object.assign(Object.assign({},s),{hasMain:!0,output:{dims:t.dims,type:t.type,textureType:o.TextureType.packed},shaderSource:v})})(e,t)})},5614:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.unpackFromChannel=t.getChannels=t.getVecChannels=void 0;const r=n(432);function o(e,t){return(0,r.getGlChannels)(t).map((t=>`${e}.${t}`))}t.getVecChannels=o,t.getChannels=function(e,t){return 1===t?[e]:o(e,t)},t.unpackFromChannel=function(){return"\n    float getChannel(vec4 frag, int dim) {\n      int modCoord = imod(dim, 2);\n      return modCoord == 0 ? frag.r : frag.g;\n    }\n\n    float getChannel(vec4 frag, vec2 innerDims) {\n      vec2 modCoord = mod(innerDims, 2.);\n      return modCoord.x == 0. ?\n        (modCoord.y == 0. ? frag.r : frag.g) :\n        (modCoord.y == 0. ? frag.b : frag.a);\n    }\n  "}},5565:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.parsePadAttributesV11=t.padV11=t.parsePadAttributesV2=t.padV2=void 0;const r=n(4910),o=n(7273),i=n(6757),a=n(5639),s={name:"Pad",inputNames:["A"],inputTypes:[a.TextureType.unpacked]};t.padV2=(e,t,n)=>(c(t),[e.run(Object.assign(Object.assign({},s),{cacheHint:n.cacheKey,get:()=>l(e,t[0],n)}),t)]),t.parsePadAttributesV2=e=>{const t=e.attributes.getString("mode","constant"),n=e.attributes.getFloat("value",0),o=e.attributes.getInts("pads");return(0,r.createAttributeWithCacheKey)({mode:t,value:n,pads:o})},t.padV11=(e,n,r)=>{p(n);const o=u(e,n,r);return(0,t.padV2)(e,[n[0]],o)},t.parsePadAttributesV11=e=>e.attributes.getString("mode","constant");const u=(e,t,n)=>{if(!e.session.isInitializer(t[1].dataId)||t.length>=3&&!e.session.isInitializer(t[2].dataId))throw new Error("dynamic pad attributes are not allowed");const o=Array.from(t[1].integerData),i=t.length>=3?t[2].floatData[0]:0;return(0,r.createAttributeWithCacheKey)({mode:n,pads:o,value:i})},l=(e,t,n)=>{const r=o.ShapeUtil.padShape(t.dims.slice(),n.pads),i=r.length,s=`\n      ${d(e,t,n)}\n      float process(int[${i}] indices) {\n          return padA(indices);\n      }`;return{name:"Pad",inputNames:["A"],inputTypes:[a.TextureType.unpacked],output:{dims:r,type:t.type,textureType:a.TextureType.unpacked},shaderSource:s}},c=e=>{if(!e||1!==e.length)throw new Error("Pad requires 1 input");if("float32"!==e[0].type&&"float64"!==e[0].type)throw new Error("Invalid input type.")},p=e=>{if(!e||2!==e.length&&3!==e.length)throw new Error("Pad requires 2 or 3 inputs");if("int32"!==e[1].type)throw new Error("Invalid input type.");if(e.length>=3&&"string"===e[2].type)throw new Error("Invalid input type.")},d=(e,t,n)=>{const r=(0,i.getGlsl)(e.session.backend.glContext.version),[s,u]=e.calculateTextureWidthAndHeight(t.dims,a.TextureType.unpacked),l=o.ShapeUtil.computeStrides(t.dims);switch(n.mode){case"constant":return f(r,t.dims,l,s,u,n.pads,n.value);case"reflect":return h(r,t.dims,l,s,u,n.pads);case"edge":return g(r,t.dims,l,s,u,n.pads);default:throw new Error("Invalid mode")}},f=(e,t,n,r,o,i,a)=>{const s=t.length;let u="";for(let e=s-1;e>=0;--e)u+=`\n        k = m[${e}] - ${i[e]};\n        if (k < 0)  return constant;\n        if (k >= ${t[e]}) return constant;\n        offset += k * ${n[e]};\n        `;return`\n      float padA(int m[${s}]) {\n        const float constant = float(${a});\n        int offset = 0;\n        int k = 0;\n        ${u}\n        vec2 coords = offsetToCoords(offset, ${r}, ${o});\n        float value = getColorAsFloat(${e.texture2D}(A, coords));\n        return value;\n      }\n      `},h=(e,t,n,r,o,i)=>{const a=t.length;let s="";for(let e=a-1;e>=0;--e)s+=`\n        k = m[${e}] - ${i[e]};\n        if (k < 0) { k = -k; }\n        {\n          const int _2n_1 = ${2*(t[e]-1)};\n          k = int( mod( float(k), float(_2n_1) ) ) ;\n          if(k >= ${t[e]}) { k = _2n_1 - k; }\n        }\n        offset += k * ${n[e]};\n        `;return`\n      float padA(int m[${a}]) {\n        int offset = 0;\n        int k = 0;\n        ${s}\n        vec2 coords = offsetToCoords(offset, ${r}, ${o});\n        float value = getColorAsFloat(${e.texture2D}(A, coords));\n        return value;\n      }\n      `},g=(e,t,n,r,o,i)=>{const a=t.length;let s="";for(let e=a-1;e>=0;--e)s+=`\n        k = m[${e}] - ${i[e]};\n        if (k < 0)  k = 0;\n        if (k >= ${t[e]}) k = ${t[e]-1};\n        offset += k * ${n[e]};\n      `;return`\n      float padA(int m[${a}]) {\n        int offset = 0;\n        int k = 0;\n        ${s}\n        vec2 coords = offsetToCoords(offset, ${r}, ${o});\n        float value = getColorAsFloat(${e.texture2D}(A, coords));\n        return value;\n      }\n      `}},2834:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.globalMaxPool=t.parseMaxPoolAttributes=t.maxPool=t.parseGlobalAveragePoolAttributes=t.globalAveragePool=t.parseAveragePoolAttributes=t.averagePool=void 0;const r=n(4910),o=n(7273),i=n(5639);t.averagePool=(e,t,n)=>{p(t);const r={name:"AveragePool",inputNames:["X"],inputTypes:[i.TextureType.unpacked],cacheHint:n.cacheKey};return[e.run(Object.assign(Object.assign({},r),{get:()=>a(t,r,!1,n)}),t)]},t.parseAveragePoolAttributes=e=>{const t=e.attributes.getString("auto_pad","NOTSET"),n=e.attributes.getInt("ceil_mode",0),o=0!==e.attributes.getInt("count_include_pad",0),i=e.attributes.getInts("kernel_shape"),a=e.attributes.getInts("strides",[]),s=e.attributes.getInts("pads",[]);if(0!==n)throw new Error("using ceil() in shape computation is not yet supported for AveragePool");return(0,r.createAttributeWithCacheKey)({autoPad:t,ceilMode:n,countIncludePad:o,kernelShape:i,strides:a,pads:s})};const a=(e,t,n,r)=>{const[a,s]=u(e,r,n),l=o.ShapeUtil.size(a.kernelShape);let c="";a.countIncludePad?c+=`value /= float(${l});`:c+=`value /= float(${l} - pad);`;const p=`\n        ${d(e[0].dims,a,"value += _X(x);",c,"0.0")}\n      `;return Object.assign(Object.assign({},t),{output:{dims:s,type:e[0].type,textureType:i.TextureType.unpacked},shaderSource:p})};t.globalAveragePool=(e,t,n)=>{p(t);const r={name:"GlobalAveragePool",inputNames:["X"],inputTypes:[i.TextureType.unpacked],cacheHint:`${n.countIncludePad}`};return[e.run(Object.assign(Object.assign({},r),{get:()=>a(t,r,!0,n)}),t)]},t.parseGlobalAveragePoolAttributes=e=>{const t=0!==e.attributes.getInt("count_include_pad",0);return(0,r.createAttributeWithCacheKey)({autoPad:"",ceilMode:0,countIncludePad:t,kernelShape:[],strides:[],pads:[]})},t.maxPool=(e,t,n)=>{p(t);const r={name:"MaxPool",inputNames:["X"],inputTypes:[i.TextureType.unpacked],cacheHint:n.cacheKey};return[e.run(Object.assign(Object.assign({},r),{get:()=>s(t,r,!1,n)}),t)]},t.parseMaxPoolAttributes=e=>{const t=e.attributes.getString("auto_pad","NOTSET"),n=e.attributes.getInt("ceil_mode",0),o=e.attributes.getInts("kernel_shape"),i=e.attributes.getInts("strides",[]),a=e.attributes.getInts("pads",[]),s=e.attributes.getInt("storage_order",0),u=e.attributes.getInts("dilations",[]);if(0!==s)throw new Error("column major storage order is not yet supported for MaxPool");if(0!==n)throw new Error("using ceil() in shape computation is not yet supported for MaxPool");return(0,r.createAttributeWithCacheKey)({autoPad:t,ceilMode:n,countIncludePad:!1,kernelShape:o,strides:i,pads:a,storageOrder:s,dilations:u})};const s=(e,t,n,r)=>{const[o,a]=u(e,r,n),s=`\n      ${d(e[0].dims,o,"\n      value = max(_X(x), value);\n    ","","-1e5")}\n    `;return Object.assign(Object.assign({},t),{output:{dims:a,type:e[0].type,textureType:i.TextureType.unpacked},shaderSource:s})},u=(e,t,n)=>{const r=e[0].dims.slice(),i=Object.hasOwnProperty.call(t,"dilations"),a=t.kernelShape.slice(),s=t.strides.slice(),u=i?t.dilations.slice():[],l=t.pads.slice();o.PoolConvUtil.adjustPoolAttributes(n,r,a,s,u,l);const c=o.PoolConvUtil.computePoolOutputShape(n,r,s,u,a,l,t.autoPad),p=Object.assign({},t);return i?Object.assign(p,{kernelShape:a,strides:s,pads:l,dilations:u,cacheKey:t.cacheKey}):Object.assign(p,{kernelShape:a,strides:s,pads:l,cacheKey:t.cacheKey}),[p,c]},l={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[],cacheKey:""},c={name:"GlobalMaxPool",inputNames:["X"],inputTypes:[i.TextureType.unpacked]};t.globalMaxPool=(e,t)=>(p(t),[e.run(Object.assign(Object.assign({},c),{get:()=>s(t,c,!0,l)}),t)]);const p=e=>{if(!e||1!==e.length)throw new Error("Pool ops requires 1 input.");if("float32"!==e[0].type&&"float64"!==e[0].type)throw new Error("Invalid input type.")},d=(e,t,n,r,i)=>{const a=e.length;if(t.kernelShape.length<=2){const o=t.kernelShape[t.kernelShape.length-1],s=t.strides[t.strides.length-1],u=t.pads[t.pads.length/2-1],l=t.pads[t.pads.length-1],c=e[a-1];let p="",d="",f="";if(p=u+l!==0?`\n          for (int i = 0; i < ${o}; i++) {\n            x[${a} - 1] = indices[${a} - 1] * ${s} - ${u} + i;\n            if (x[${a} - 1] < 0 || x[${a} - 1] >= ${c}) {\n              pad++;\n              continue;\n            }\n            ${n}\n          }`:`\n          for (int i = 0; i < ${o}; i++) {\n            x[${a} - 1] = indices[${a} - 1] * ${s} - ${u} + i;\n            ${n}\n          }`,2===t.kernelShape.length){const n=t.kernelShape[t.kernelShape.length-2],r=t.strides[t.strides.length-2],i=t.pads[t.pads.length/2-2],s=t.pads[t.pads.length-2],u=e[a-2];d=i+s!==0?`\n            for (int j = 0; j < ${n}; j++) {\n              x[${a} - 2] = indices[${a} - 2] * ${r} - ${i} + j;\n              if (x[${a} - 2] < 0 || x[${a} - 2] >= ${u}) {\n                pad+= ${o};\n                continue;\n              }\n          `:`\n            for (int j = 0; j < ${n}; j++) {\n              x[${a} - 2] = indices[${a} - 2] * ${r} - ${i} + j;\n            `,f="\n          }\n        "}return`\n        float process(int indices[${a}]) {\n          int x[${a}];\n          copyVec(indices, x);\n\n          float value = ${i};\n          int pad = 0;\n          ${d}\n          ${p}\n          ${f}\n          ${r}\n          return value;\n        }\n      `}{const s=o.ShapeUtil.size(t.kernelShape),u=o.ShapeUtil.computeStrides(t.kernelShape),l=u.length,c=t.pads.length,p=h(l),d=f(e,"inputDims"),g=f(t.pads,"pads"),m=f(u,"kernelStrides"),b=f(t.strides,"strides");let y="";return y=t.pads.reduce(((e,t)=>e+t))?`\n            if (x[j] >= inputDims[j] || x[j] < 0) {\n              pad++;\n              isPad = true;\n              break;\n            }\n          }\n          if (!isPad) {\n            ${n}\n          }`:`\n          }\n          ${n}\n        `,`\n        ${p}\n        float process(int indices[${a}]) {\n          int x[${a}];\n          copyVec(indices, x);\n          int offset[${l}];\n          int pads[${c}];\n          int inputDims[${a}];\n          int kernelStrides[${l}];\n          int strides[${l}];\n          ${g}\n          ${d}\n          ${b}\n          ${m}\n\n          float value = ${i};\n          int pad = 0;\n          bool isPad = false;\n          for (int i = 0; i < ${s}; i++) {\n            offsetToIndices(i, kernelStrides, offset);\n            isPad = false;\n            for (int j = ${a} - ${l}; j < ${a}; j++) {\n              x[j] = indices[j] * strides[j - ${a} + ${l}]\n                + offset[j - ${a} + ${l}] - pads[j - 2];\n              ${y}\n          }\n          ${r}\n\n          return value;\n        }\n      `}},f=(e,t)=>{let n="";for(let r=0;r<e.length;r++)n+=`\n      ${t}[${r}] = ${e[r]};\n    `;return n},h=e=>`\n  void offsetToIndices(int offset, int[${e}] strides, out int[${e}] indices) {\n    if (${e} == 0) {\n      return;\n    }\n    for (int i = 0; i < ${e} - 1; ++i) {\n      indices[i] = offset / strides[i];\n      offset -= indices[i] * strides[i];\n    }\n    indices[${e} - 1] = offset;\n  }`},1010:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.reduceLogSumSquare=t.reduceLogSum=t.reduceProd=t.reduceMin=t.reduceMax=t.reduceMean=t.reduceSum=t.parseReduceAttributes=void 0;const r=n(4910),o=n(6145),i=n(7273),a=n(5639),s=(e,t,n,r,o)=>{l(t);const i={name:r,inputNames:["A"],inputTypes:[a.TextureType.unpacked]};return[e.run(Object.assign(Object.assign({},i),{cacheHint:n.cacheKey,get:()=>u(e,t,n,r,o,i)}),t)]};t.parseReduceAttributes=e=>{const t=e.attributes.getInts("axes",[]),n=1===e.attributes.getInt("keepdims",1);return(0,r.createAttributeWithCacheKey)({axes:t,keepDims:n})};const u=(e,t,n,r,o,s)=>{const u=[],l=t[0].dims.length||1,c=[],p=i.ShapeUtil.normalizeAxes(n.axes,t[0].dims.length),d=o(t,p);let f=d[1];for(let e=0;e<t[0].dims.length;e++)p.indexOf(e)>=0||0===p.length?(n.keepDims&&u.push(1),f=`\n          for(int j${e} = 0; j${e} < ${t[0].dims[e]}; j${e}++) {\n            inputIdx[${e}] = j${e};\n            ${f}\n          }`):(c.push(`inputIdx[${e}] = outputIdx[${u.length}];`),u.push(t[0].dims[e]));const h=`\n      float process(int outputIdx[${u.length||1}]) {\n        float value;                 // final result\n        int inputIdx[${l}];      // addressing input data\n        ${c.join("\n")}\n        ${d[0]}       // init ops for reduce max/min\n        ${f}\n        ${d[2]}       // final computation for reduce mean\n        return value;\n      }`;return Object.assign(Object.assign({},s),{output:{dims:u,type:t[0].type,textureType:a.TextureType.unpacked},shaderSource:h})},l=e=>{if(!e||1!==e.length)throw new Error("Reduce op requires 1 input.");if(-1===o.NUMBER_TYPES.indexOf(e[0].type))throw new Error("Invalid input type.")};t.reduceSum=(e,t,n)=>s(e,t,n,"ReduceSum",(()=>["value = 0.0;","value += _A(inputIdx);",""])),t.reduceMean=(e,t,n)=>s(e,t,n,"ReduceMean",((e,t)=>{let n=1;for(let r=0;r<e[0].dims.length;r++)(t.indexOf(r)>=0||0===t.length)&&(n*=e[0].dims[r]);return["value = 0.0;","value += _A(inputIdx);",`value /= ${n}.;`]})),t.reduceMax=(e,t,n)=>s(e,t,n,"ReduceMax",((e,t)=>{const n=[];for(let r=0;r<e[0].dims.length;r++)(t.indexOf(r)>=0||0===t.length)&&n.push(`inputIdx[${r}] = 0;`);return[`${n.join("\n")}\nvalue = _A(inputIdx);`,"value = max(value, _A(inputIdx));",""]})),t.reduceMin=(e,t,n)=>s(e,t,n,"ReduceMin",((e,t)=>{const n=[];for(let r=0;r<e[0].dims.length;r++)(t.indexOf(r)>=0||0===t.length)&&n.push(`inputIdx[${r}] = 0;`);return[`${n.join("\n")}\nvalue = _A(inputIdx);`,"value = min(value, _A(inputIdx));",""]})),t.reduceProd=(e,t,n)=>s(e,t,n,"ReduceProd",(()=>["value = 1.0;","value *= _A(inputIdx);",""])),t.reduceLogSum=(e,t,n)=>s(e,t,n,"ReduceLogSum",(()=>["value = 0.0;","value += _A(inputIdx);","value = log(value);"])),t.reduceLogSumSquare=(e,t,n)=>s(e,t,n,"ReduceLogSumSquare",(()=>["float t; value = 0.0;","t = _A(inputIdx); value += t * t;",""]))},7379:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.isReshapeCheap=t.processDims3D=t.createPackedReshape3DProgramInfoLoader=void 0;const r=n(7273),o=n(6757),i=n(5639),a=n(5614);t.createPackedReshape3DProgramInfoLoader=(e,t,n)=>{const s=(e=>({name:"Reshape (packed)",inputTypes:[i.TextureType.packed],inputNames:["A"],cacheHint:`${e}`}))(n);return Object.assign(Object.assign({},s),{get:()=>((e,t,n,s)=>{const u=t.dims,l=s;let c="";for(let e=0;e<4;e++){let t="";switch(e){case 0:t="outputCoords = rc;";break;case 1:t="outputCoords = ivec3(rc.x, rc.y+1, rc.z);";break;case 2:t="outputCoords = ivec3(rc.x, rc.y, rc.z+1);";break;case 3:t="outputCoords = ivec3(rc.x, rc.y+1, rc.z+1);";break;default:throw new Error}c+=`\n        ${t}\n        ${e>0?"if(outputCoords.y < rows && outputCoords.z < cols){":""}\n          int flattenedIndex = getFlattenedIndex(outputCoords);\n\n          ivec3 inputRC = inputCoordsFromReshapedOutCoords(flattenedIndex);\n          vec2 innerDims = vec2(float(inputRC.y),float(inputRC.z));\n\n          result[${e}] = getChannel(getA(inputRC.x, inputRC.y, inputRC.z), innerDims);\n\n        ${e>0?"}":""}\n      `}const p=(0,o.getGlsl)(e.session.backend.glContext.version),d=`\n      ${function(e){const t=r.ShapeUtil.computeStrides(e),n=["b","r","c"],o="index";return`\n    ivec3 inputCoordsFromReshapedOutCoords(int index) {\n      ${t.map(((e,r)=>`int ${n[r]} = ${o} / ${e}; ${r===t.length-1?`int ${n[r+1]} = ${o} - ${n[r]} * ${e}`:`index -= ${n[r]} * ${e}`};`)).join("")}\n      return ivec3(b, r, c);\n    }\n  `}(u)}\n      ${function(e){const t=r.ShapeUtil.computeStrides(e);return`\n  int getFlattenedIndex(ivec3 coords) {\n    // reverse y, z order\n    return coords.x * ${t[0]} + coords.z * ${t[1]} + coords.y;\n  }\n`}(l)}\n      ${(0,a.unpackFromChannel)()}\n\n      void main() {\n        ivec3 rc = getOutputCoords();\n\n        vec4 result = vec4(0.0);\n\n        ivec3 outputCoords;\n        int rows = ${l[2]};\n        int cols = ${l[1]};\n\n        ${c}\n        ${p.output} = result;\n      }\n    `;return Object.assign(Object.assign({},n),{output:{dims:l,type:t.type,textureType:i.TextureType.packed},shaderSource:d,hasMain:!0})})(e,t,s,n)})},t.processDims3D=function(e){if(0===e.length)return[1,1,1];let t=1;for(let n=0;n<e.length-2;++n)t*=e[n];return[t,e.length>1?e[e.length-2]:1,e[e.length-1]]},t.isReshapeCheap=function(e,t){let n=!1;return n=0===e.length||0===t.length||(e.length<2||t.length<2?e[e.length-1]===t[t.length-1]:e[e.length-1]===t[t.length-1]&&e[e.length-2]===t[t.length-2]),n}},8126:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.reshape=void 0;const r=n(7273);t.reshape=(e,t)=>{const n=r.ShapeUtil.calculateReshapedDims(t[0].dims,t[1].integerData);return e.session.pack?[e.reshapePacked(t[0],n)]:[e.reshapeUnpacked(t[0],n)]}},2801:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.parseResizeAttributesV11=t.parseResizeAttributesV10=t.resize=void 0;const r=n(6757),o=n(5639),i=n(432),a=n(5614),s=n(3980),u={name:"Resize",inputNames:["A"],inputTypes:[o.TextureType.packed]};t.resize=(e,t,n)=>((0,s.validateInputs)(t,n),[e.run(Object.assign(Object.assign({},u),{cacheHint:n.cacheKey,get:()=>l(e,t,n)}),t)]),t.parseResizeAttributesV10=e=>(0,s.parseUpsampleAttributes)(e,10),t.parseResizeAttributesV11=e=>(0,s.parseUpsampleAttributes)(e,11);const l=(e,t,n)=>{const s=(0,r.getGlsl)(e.session.backend.glContext.version),[l,p]=c(t,n);if(l.every((e=>1===e))&&"tf_crop_and_resize"!==n.coordinateTransformMode)return Object.assign(Object.assign({},u),{output:{dims:p,type:t[0].type,textureType:o.TextureType.packed},hasMain:!0,shaderSource:`void main() {\n                    vec4 v = ${s.texture2D}(X, TexCoords);\n                    ${s.output} = v;\n                }`});const d=p.length;if(d<2)throw new Error(`output dimension should be at least 2, but got ${d}`);const f=p[d-2],h=p[d-1],g=t[0].dims;if(d!==g.length)throw new Error(`output dimension should match input ${g.length}, but got ${d}`);const m=g[d-2],b=g[d-1],y=l[d-2],w=l[d-1];let _="";if("linear"!==n.mode)throw new Error(`resize (packed) does not support mode: '${n.mode}'`);switch(n.coordinateTransformMode){case"asymmetric":_="\n                    vec4 getSourceFracIndex(ivec4 coords) {\n                        return vec4(coords) / scaleWHWH;\n                    }\n                ";break;case"half_pixel":_="\n                    vec4 getSourceFracIndex(ivec4 coords) {\n                        return (vec4(coords) + 0.5) / scaleWHWH - 0.5;\n                    }\n                ";break;case"pytorch_half_pixel":_=`\n                    vec4 getSourceFracIndex(ivec4 coords) {\n                        vec4 fcoords = vec4(coords);\n                        return vec4(\n                            ${h}.0 > 1.0 ? (fcoords.x + 0.5) / scaleWHWH.x - 0.5 : 0.0,\n                            ${f}.0 > 1.0 ? (fcoords.y + 0.5) / scaleWHWH.y - 0.5 : 0.0,\n                            ${h}.0 > 1.0 ? (fcoords.z + 0.5) / scaleWHWH.z - 0.5 : 0.0,\n                            ${f}.0 > 1.0 ? (fcoords.w + 0.5) / scaleWHWH.w - 0.5 : 0.0\n                          );\n                    }\n                `;break;case"align_corners":_=`\n                    vec4 getSourceFracIndex(ivec4 coords) {\n                        vec4 resized = vec4(${h}.0 - 1.0, ${f}.0 - 1.0, ${h}.0 - 1.0,\n                            ${f}.0 - 1.0);\n                        vec4 original = vec4(${b}.0 - 1.0, ${m}.0 - 1.0, ${b}.0 - 1.0,\n                            ${m}.0 - 1.0);\n                        vec4 new_scale = original / resized;\n                        return vec4(coords) * new_scale;\n                    }\n                `;break;default:throw new Error(`resize (packed) does not support coordinateTransformMode:                                 '${n.coordinateTransformMode}'`)}const v=(0,i.getCoordsDataType)(d),x=`\n            const vec2 inputWH = vec2(${m}.0, ${b}.0);\n            const vec4 scaleWHWH = vec4(float(${y}), float(${w}), float(${y}), float(${w}));\n            ${(0,a.unpackFromChannel)()}\n            ${_}\n            float getAValue(int x10, int r, int c, int d) {\n                return getChannel(getA(x10, r, c, d), vec2(c, d));\n            }\n            void main() {\n                ${v} rc = getOutputCoords();\n\n                int batch = rc[0];\n                int depth = rc[1];\n\n                // retrieve the 4 coordinates that is used in the 4 packed output values.\n                ivec4 coords = ivec4(rc.wz, rc.w + 1, rc.z + 1);\n\n                // calculate the source index in fraction\n                vec4 sourceFrac = getSourceFracIndex(coords);\n\n                // get the lower and upper bound of the 4 values that will be packed into one texel.\n                ivec4 x00 = ivec4(max(sourceFrac.xy, vec2(0.0)), min(inputWH - 1.0, ceil(sourceFrac.xy)));\n                ivec4 x01 = ivec4(max(sourceFrac.xw, vec2(0.0)), min(inputWH - 1.0, ceil(sourceFrac.xw)));\n                ivec4 x10 = ivec4(max(sourceFrac.zy, vec2(0.0)), min(inputWH - 1.0, ceil(sourceFrac.zy)));\n                ivec4 x11 = ivec4(max(sourceFrac.zw, vec2(0.0)), min(inputWH - 1.0, ceil(sourceFrac.zw)));\n\n                bool hasNextRow = rc.w < ${f-1};\n                bool hasNextCol = rc.z < ${h-1};\n\n                // pack x00, x01, x10, x11's top-left corner into one vec4 structure\n                vec4 topLeft = vec4(\n                    getAValue(batch, depth, x00.x, x00.y),\n                    hasNextCol ? getAValue(batch, depth, x01.x, x01.y) : 0.0,\n                    hasNextRow ? getAValue(batch, depth, x10.x, x10.y) : 0.0,\n                    (hasNextRow && hasNextCol) ? getAValue(batch, depth, x11.x, x11.y) : 0.0);\n\n                // pack x00, x01, x10, x11's top-right corner into one vec4 structure\n                vec4 topRight = vec4(\n                    getAValue(batch, depth, x00.x, x00.w),\n                    hasNextCol ? getAValue(batch, depth, x01.x, x01.w) : 0.0,\n                    hasNextRow ? getAValue(batch, depth, x10.x, x10.w) : 0.0,\n                    (hasNextRow && hasNextCol) ? getAValue(batch, depth, x11.x, x11.w) : 0.0);\n\n                // pack x00, x01, x10, x11's bottom-left corner into one vec4 structure\n                vec4 bottomLeft = vec4(\n                    getAValue(batch, depth, x00.z, x00.y),\n                    hasNextCol ? getAValue(batch, depth, x01.z, x01.y) : 0.0,\n                    hasNextRow ? getAValue(batch, depth, x10.z, x10.y) : 0.0,\n                    (hasNextRow && hasNextCol) ? getAValue(batch, depth, x11.z, x11.y) : 0.0);\n\n                // pack x00, x01, x10, x11's bottom-right corner into one vec4 structure\n                vec4 bottomRight = vec4(\n                    getAValue(batch, depth, x00.z, x00.w),\n                    hasNextCol ? getAValue(batch, depth, x01.z, x01.w) : 0.0,\n                    hasNextRow ? getAValue(batch, depth, x10.z, x10.w) : 0.0,\n                    (hasNextRow && hasNextCol) ? getAValue(batch, depth, x11.z, x11.w) : 0.0);\n\n                // calculate the interpolation fraction on u and v direction\n                vec4 frac = vec4(sourceFrac) - floor(sourceFrac);\n                vec4 clampFrac = clamp(frac, vec4(0.0), vec4(1.0));\n\n                vec4 top = mix(topLeft, topRight, clampFrac.ywyw);\n                vec4 bottom = mix(bottomLeft, bottomRight, clampFrac.ywyw);\n                vec4 newValue = mix(top, bottom, clampFrac.xxzz);\n\n                ${s.output} = vec4(newValue);\n            }\n        `;return Object.assign(Object.assign({},u),{output:{dims:p,type:t[0].type,textureType:o.TextureType.packed},hasMain:!0,shaderSource:x})},c=(e,t)=>{const n=e[0].dims;let r,o=t.scales;if(0===o.length){const i=e[t.scalesInputIdx];if(i&&0!==i.size){if(e[t.sizesInputIdx])throw new Error("Only one of scales or sizes must be provided as input.");o=p(i,t.mode,t.isResize)}else{const i=e[t.sizesInputIdx];if(!i||0===i.size)throw new Error("Either scales or sizes MUST be provided as input.");r=Array.from(i.integerData),o=d(r,n,t.mode,t.isResize)}}else if(e[t.sizesInputIdx])throw new Error("Only one of scales or sizes must be provided as input.");const i=r||n.map(((e,t)=>Math.floor(e*o[t])));return[o,i]},p=(e,t,n)=>{const r=Array.from(e.floatData);return(0,s.scalesValidation)(r,t,n),r},d=(e,t,n,r)=>{const o=t.length,i=new Array(o);for(let n=0,r=o;n<r;n++)if(0===t[n]){if(0!==e[n])throw new Error("Input dim is zero but required output dim is non-zero.");i[n]=1}else i[n]=e[n]/t[n];return(0,s.scalesValidation)(i,n,r),i}},565:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.shape=void 0;const r=n(9240);t.shape=(e,t)=>(o(t),[new r.Tensor([t[0].dims.length],"int32",void 0,void 0,new Int32Array(t[0].dims))]);const o=e=>{if(!e||1!==e.length)throw new Error("Shape requires 1 input.")}},2444:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.sliceV10=t.parseSliceAttributes=t.slice=void 0;const r=n(4910),o=n(6145),i=n(7273),a=n(5639),s={name:"Slice",inputNames:["A"],inputTypes:[a.TextureType.unpacked]};t.slice=(e,t,n)=>(l(t),[e.run(Object.assign(Object.assign({},s),{cacheHint:n.cacheKey,get:()=>u(e,t[0],n)}),t)]),t.parseSliceAttributes=e=>{const t=e.attributes.getInts("starts"),n=e.attributes.getInts("ends"),o=e.attributes.getInts("axes",[]);return(0,r.createAttributeWithCacheKey)({starts:t,ends:n,axes:o})};const u=(e,t,n)=>{const r=0===n.axes.length?t.dims.slice(0).map(((e,t)=>t)):n.axes,o=i.ShapeUtil.normalizeAxes(r,t.dims.length),u=n.starts.map(((e,n)=>e>t.dims[o[n]]-1?t.dims[o[n]]:i.ShapeUtil.normalizeAxis(e,t.dims[o[n]]))),l=n.ends.map(((e,n)=>e>t.dims[o[n]]-1?t.dims[o[n]]:i.ShapeUtil.normalizeAxis(e,t.dims[o[n]]))),c=t.dims.slice(),p=[];for(let e=0;e<o.length;e++)c[o[e]]=l[e]-u[e],u[e]>0&&p.push(`outputIdx[${o[e]}] += ${u[e]};`);const d=`\n      float process(int outputIdx[${c.length}]) {\n        ${p.join("\n      ")}\n        return _A(outputIdx);\n      }`;return Object.assign(Object.assign({},s),{output:{dims:c,type:t.type,textureType:a.TextureType.unpacked},shaderSource:d})},l=e=>{if(!e||1!==e.length)throw new Error("Slice requires 1 input.");if(-1===o.NUMBER_TYPES.indexOf(e[0].type))throw new Error("Invalid input type.")};t.sliceV10=(e,t)=>{p(t);const n=c(e,t);return[e.run(Object.assign(Object.assign({},s),{cacheHint:n.cacheKey,get:()=>u(e,t[0],n)}),[t[0]])]};const c=(e,t)=>{if(!e.session.isInitializer(t[1].dataId)||!e.session.isInitializer(t[2].dataId)||t.length>=4&&!e.session.isInitializer(t[3].dataId)||t.length>=5&&!e.session.isInitializer(t[4].dataId))throw new Error("dynamic slice attributes are not allowed");if(t.length>=5&&t[4].integerData.some((e=>1!==e)))throw new Error("currently non-1 steps is not supported for Slice");const n=Array.from(t[1].integerData),r=Array.from(t[2].integerData),o=t.length>=4?Array.from(t[3].integerData):[];return{starts:n,ends:r,axes:o,cacheKey:`${o};${n};${r}`}},p=e=>{if(!e||e.length<3||e.length>5)throw new Error("Invalid input number.");if("int32"!==e[1].type||1!==e[1].dims.length)throw new Error("Invalid input type.");if("int32"!==e[2].type||1!==e[2].dims.length)throw new Error("Invalid input type.");if(e.length>=4&&("int32"!==e[3].type||1!==e[3].dims.length))throw new Error("Invalid input type.");if(e.length>=5&&("int32"!==e[4].type||1!==e[4].dims.length))throw new Error("Invalid input type.")}},815:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.softmaxV13=t.parseSoftmaxAttributesV13=t.parseSoftmaxAttributes=t.softmax=void 0;const r=n(4910),o=n(7273),i=n(6757),a=n(5639),s=n(5707),u={name:"SoftmaxComputeMax",inputNames:["A"],inputTypes:[a.TextureType.unpacked]},l={name:"SoftmaxComputeScale",inputNames:["A","Max"],inputTypes:[a.TextureType.unpacked,a.TextureType.unpacked]},c={name:"SoftMax",inputNames:["A","Max","Norm"],inputTypes:[a.TextureType.unpacked,a.TextureType.unpacked,a.TextureType.unpacked]};t.softmax=(e,t,n)=>{g(t);const r=t[0].dims.slice(),i=o.ShapeUtil.normalizeAxis(n.axis,r.length),a=o.ShapeUtil.sizeToDimension(r,i),s=o.ShapeUtil.sizeFromDimension(r,i);return p(e,t,n,a,s)},t.parseSoftmaxAttributes=e=>(0,r.createAttributeWithCacheKey)({axis:e.attributes.getInt("axis",1)}),t.parseSoftmaxAttributesV13=e=>(0,r.createAttributeWithCacheKey)({axis:e.attributes.getInt("axis",-1)}),t.softmaxV13=(e,t,n)=>{g(t);const i=t[0].dims.slice(),a=o.ShapeUtil.normalizeAxis(n.axis,i.length),u=i.length,l=a!==u-1,c=[];let d,f=[],h=[];l&&(f=Array.from({length:u}).map(((e,t)=>t)),f[a]=u-1,f[u-1]=a,f.map((e=>c.push(i[e]))),d=(0,r.createAttributeWithCacheKey)({perm:f}),h=(0,s.transpose)(e,t,d));const m=l?o.ShapeUtil.sizeToDimension(c,u-1):o.ShapeUtil.sizeToDimension(i,u-1),b=l?o.ShapeUtil.sizeFromDimension(c,u-1):o.ShapeUtil.sizeFromDimension(i,u-1),y=p(e,l?h:t,n,m,b);return l?(0,s.transpose)(e,y,d):y};const p=(e,t,n,r,o)=>{const i=d(e,t[0],r,o,[r]),a=e.run(Object.assign(Object.assign({},u),{cacheHint:n.cacheKey,get:()=>i}),t),s=f(e,t[0],r,o,i.output.dims,[r]),p=e.run(Object.assign(Object.assign({},l),{cacheHint:n.cacheKey,get:()=>s}),[t[0],a]),g=h(e,t[0],r,o,i.output.dims,s.output.dims);return[e.run(Object.assign(Object.assign({},c),{cacheHint:n.cacheKey,get:()=>g}),[t[0],a,p])]},d=(e,t,n,r,o)=>{const[s,l]=e.calculateTextureWidthAndHeight(t.dims,a.TextureType.unpacked),c=o.length;if(n<1||r<1)throw new Error("Logical row count N and feature count D must be greater than or equal to 1");if(1!==o.length)throw new Error("Dimensionality of the output should be 1");if(o[0]!==n)throw new Error("Shape of the output should be equal to logical row count");const p=(0,i.getGlsl)(e.session.backend.glContext.version),d=`\n      float process(int[${c}] indices) {\n        int logical_row_start_offset = indices[0] * ${r};\n\n        float max = getColorAsFloat(${p.texture2D}(A, offsetToCoords(logical_row_start_offset, ${s},\n        ${l} )));\n        for(int i=1; i<${r}; ++i)\n        {\n          float current = getColorAsFloat(${p.texture2D}(A, offsetToCoords(logical_row_start_offset + i,\n            ${s}, ${l})));\n          if(current > max)\n          max = current;\n        }\n\n        return max;\n      }`;return Object.assign(Object.assign({},u),{output:{dims:o,type:t.type,textureType:a.TextureType.unpacked},shaderSource:d})},f=(e,t,n,r,o,s)=>{const[u,c]=e.calculateTextureWidthAndHeight(t.dims,a.TextureType.unpacked),p=s.length;if(n<1||r<1)throw new Error("Logical row count N and feature count D must be greater than or equal to 1");if(1!==s.length)throw new Error("Dimensionality of the output should be 1");if(s[0]!==n)throw new Error("Shape of the output should be equal to logical row count");if(1!==o.length)throw new Error("Dimensionality of the intermediate results should be 1");if(o[0]!==n)throw new Error("Shape of the intermediate results should be equal to logical row count");const d=`\n      float process(int[${p}] indices) {\n        int logical_row_start_offset = indices[0] * ${r};\n\n        float norm_factor = 0.0;\n        float max = _Max(indices);\n        for(int i=0; i<${r}; ++i)\n        {\n          norm_factor += exp(getColorAsFloat(${(0,i.getGlsl)(e.session.backend.glContext.version).texture2D}(A, offsetToCoords(logical_row_start_offset + i,\n            ${u}, ${c}))) - max);\n        }\n\n        return norm_factor;\n      }`;return Object.assign(Object.assign({},l),{output:{dims:s,type:t.type,textureType:a.TextureType.unpacked},shaderSource:d})},h=(e,t,n,r,o,i)=>{const[s,u]=e.calculateTextureWidthAndHeight(t.dims,a.TextureType.unpacked),l=t.dims.length;if(n<1||r<1)throw new Error("Logical row count N and feature count D must be greater than or equal to 1");if(1!==o.length||1!==i.length)throw new Error("Dimensionality of the intermediate results should be 1");if(o[0]!==n||i[0]!==n)throw new Error("Shape of the intermediate results should be equal to logical row count");const p=`\n      float process(int[${l}] indices) {\n\n      // get offset of current logical tensor index from the 2-D texture coordinates (TexCoords)\n      int offset = coordsToOffset(TexCoords, ${s}, ${u});\n\n      //determine the logical row for this index\n      int logical_row_index[1];\n      logical_row_index[0] = offset / ${r};\n\n      float norm_factor = _Norm(logical_row_index);\n\n      // avoid possible division by 0\n      // if norm_facor is 0, all elements are zero\n      // if so, return 0\n      if(norm_factor == 0.0)\n        return 0.0;\n\n      return exp(_A(indices) - _Max(logical_row_index)) / norm_factor;\n    }`;return Object.assign(Object.assign({},c),{output:{dims:t.dims,type:t.type,textureType:a.TextureType.unpacked},shaderSource:p})},g=e=>{if(!e||1!==e.length)throw new Error("Softmax requires 1 input.");if("float32"!==e[0].type&&"float64"!==e[0].type)throw new Error("Invalid input type")}},564:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.parseSplitAttributes=t.split=void 0;const r=n(4910),o=n(7273),i=n(5639),a={name:"Split",inputNames:["A"],inputTypes:[i.TextureType.unpacked]};t.split=(e,t,n)=>{l(t);const r=o.ShapeUtil.normalizeAxis(n.axis,t[0].dims.length),i=s(e,t,r,n),c=[];for(let o=0;o<i;++o)c.push(e.run(Object.assign(Object.assign({},a),{cacheHint:`${n.cacheKey};${o}`,get:()=>u(e,t[0],n,r,o)}),t));return c},t.parseSplitAttributes=e=>{const t=e.attributes.getInt("axis",0),n=e.attributes.getInts("split",[]),o=e.outputs.length;return(0,r.createAttributeWithCacheKey)({axis:t,split:n,numOutputs:o})};const s=(e,t,n,r)=>{const[,i]=o.SplitUtil.splitShape(t[0].dims,n,r.split,r.numOutputs);return i.length},u=(e,t,n,r,s)=>{const[u,l]=o.SplitUtil.splitShape(t.dims,r,n.split,n.numOutputs),c=l[s],p=u[s],d=`\n      float process(int indices[${p.length}]) {\n        indices[${r}] += ${c};\n        return _A(indices);\n      }\n    `;return Object.assign(Object.assign({},a),{cacheHint:`${n.cacheKey}:${s}`,output:{dims:p,type:t.type,textureType:i.TextureType.unpacked},shaderSource:d})},l=e=>{if(!e||1!==e.length)throw new Error("Split requires one input.");if("int8"!==e[0].type&&"uint8"!==e[0].type&&"int16"!==e[0].type&&"uint16"!==e[0].type&&"int32"!==e[0].type&&"uint32"!==e[0].type&&"float32"!==e[0].type&&"float64"!==e[0].type&&"bool"!==e[0].type)throw new Error("Invalid input type.")}},5416:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.parseSqueezeAttributes=t.squeezeV13=t.squeeze=void 0;const r=n(7273);t.squeeze=(e,t,n)=>{o(t);const i=r.ShapeUtil.squeezeShape(t[0].dims,n);return[e.reshapeUnpacked(t[0],i)]},t.squeezeV13=(e,n)=>(i(n),(0,t.squeeze)(e,[n[0]],Array.from(n[1].integerData))),t.parseSqueezeAttributes=e=>e.attributes.getInts("axes");const o=e=>{if(!e||1!==e.length)throw new Error("Squeeze requires 1 input.");if("string"===e[0].type)throw new Error("invalid input tensor types.")},i=e=>{if(!e||2!==e.length)throw new Error("Squeeze requires 2 inputs.");if("int32"!==e[1].type)throw new Error("Invalid input type.")}},1240:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.sum=void 0;const r=n(6757),o=n(5639);t.sum=(e,t)=>{a(t);const n={name:"Sum",inputNames:t.map(((e,t)=>`X${t}`)),inputTypes:new Array(t.length).fill(o.TextureType.unpacked)};return[e.run(Object.assign(Object.assign({},n),{get:()=>i(e,t,n)}),t)]};const i=(e,t,n)=>{const i=(0,r.getGlsl)(e.session.backend.glContext.version),a=t[0].dims.slice(),s=`\n      void main() {\n        vec4 result = ${t.map(((e,t)=>`${i.texture2D}(X${t},TexCoords)`)).join(" + ")};\n        ${i.output} = result;\n      }\n    `;return Object.assign(Object.assign({},n),{output:{dims:a,type:t[0].type,textureType:o.TextureType.unpacked},hasMain:!0,shaderSource:s})},a=e=>{if(!e||0===e.length)throw new Error("Sum requires inputs.");const t=e[0].dims.length;for(let n=1;n<e.length;n++){if(t!==e[n].dims.length)throw new Error("Input shapes are mismatched.");for(let r=0;r<t;r++)if(e[0].dims[r]!==e[n].dims[r])throw new Error("Input shapes are not matched.")}if("float32"!==e[0].type&&"float64"!==e[0].type)throw new Error("Invalid input type.");for(let t=1;t<e.length;t++)if(e[0].type!==e[t].type)throw new Error("Input types are not matched.")}},5944:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.tile=void 0;const r=n(6145),o=n(5639);t.tile=(e,t)=>{a(t);const n={name:"Tile",inputNames:["A"],inputTypes:[o.TextureType.unpacked]};return[e.run(Object.assign(Object.assign({},n),{get:()=>i(e,t,n)}),t)]};const i=(e,t,n)=>{const r=t[0].dims.slice(),i=new Array(r.length),a=[];for(let e=0;e<r.length;e++)i[e]=r[e]*t[1].numberData[e],a.push(`inputIdx[${e}] = int(mod(float(outputIdx[${e}]), ${r[e]}.));`);const s=i.length,u=`\n      float process(int outputIdx[${s}]) {\n        int inputIdx[${s}];\n        ${a.join("\n")}\n        return _A(inputIdx);\n      }\n    `;return Object.assign(Object.assign({},n),{output:{dims:i,type:t[0].type,textureType:o.TextureType.unpacked},shaderSource:u})},a=e=>{if(!e||2!==e.length)throw new Error("Tile requires 2 input.");if(1!==e[1].dims.length)throw new Error("The second input shape must 1 dimension.");if(e[1].dims[0]!==e[0].dims.length)throw new Error("Invalid input shape.");if(-1===r.NUMBER_TYPES.indexOf(e[0].type))throw new Error("Invalid input type.");if("int32"!==e[1].type&&"int16"!==e[1].type)throw new Error("Invalid repeat type.")}},5707:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.parseTransposeAttributes=t.transpose=void 0;const r=n(4910),o=n(7273),i=n(5639),a={name:"Transpose",inputNames:["A"],inputTypes:[i.TextureType.unpacked]};t.transpose=(e,t,n)=>(p(t),[e.run(Object.assign(Object.assign({},a),{cacheHint:n.cacheKey,get:()=>s(e,t[0],n.perm)}),t)]),t.parseTransposeAttributes=e=>(0,r.createAttributeWithCacheKey)({perm:e.attributes.getInts("perm",[])});const s=(e,t,n)=>{const r=t.dims;n=u(r,n);const o=l(r,n),s=r.length,p=`\n      ${c("perm",n,s)}\n      float process(int indices[${s}]) {\n        int a[${s}];\n        perm(a, indices);\n        return _A(a);\n      }`;return Object.assign(Object.assign({},a),{output:{dims:o,type:t.type,textureType:i.TextureType.unpacked},shaderSource:p})},u=(e,t)=>(t&&t.length!==e.length&&(t=[...e.keys()].reverse()),t),l=(e,t)=>(t=u(e,t),o.ShapeUtil.sortBasedOnPerm(e,t)),c=(e,t,n)=>{const r=[];r.push(`void ${e}(out int a[${n}], int src[${n}]) {`);for(let e=0;e<n;++e)r.push(`\ta[${t[e]}]=src[${e}];`);return r.push("\t}"),r.join("\n")},p=e=>{if(!e||1!==e.length)throw new Error("Transpose requires 1 input.");if("float32"!==e[0].type&&"float64"!==e[0].type)throw new Error("input should be float tensor")}},2488:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.encodeAsUint8=void 0;const r=n(6757),o=n(5639);t.encodeAsUint8=(e,t)=>{const n=t.shape,i=(0,r.getGlsl)(e.session.backend.glContext.version),a=`\n    const float FLOAT_MAX = 1.70141184e38;\n    const float FLOAT_MIN = 1.17549435e-38;\n\n    bool isNaN(float val) {\n      return (val < 1.0 || 0.0 < val || val == 0.0) ? false : true;\n    }\n\n    highp vec4 encodeAsUint8(highp float v) {\n      if (isNaN(v)) {\n        return vec4(255, 255, 255, 255);\n      }\n\n      highp float av = abs(v);\n\n      if(av < FLOAT_MIN) {\n        return vec4(0.0, 0.0, 0.0, 0.0);\n      } else if(v > FLOAT_MAX) {\n        return vec4(0.0, 0.0, 128.0, 127.0) / 255.0;\n      } else if(v < -FLOAT_MAX) {\n        return vec4(0.0, 0.0,  128.0, 255.0) / 255.0;\n      }\n\n      highp vec4 c = vec4(0,0,0,0);\n\n      highp float e = floor(log2(av));\n      highp float m = exp2(fract(log2(av))) - 1.0;\n\n      c[2] = floor(128.0 * m);\n      m -= c[2] / 128.0;\n      c[1] = floor(32768.0 * m);\n      m -= c[1] / 32768.0;\n      c[0] = floor(8388608.0 * m);\n\n      highp float ebias = e + 127.0;\n      c[3] = floor(ebias / 2.0);\n      ebias -= c[3] * 2.0;\n      c[2] += floor(ebias) * 128.0;\n\n      c[3] += 128.0 * step(0.0, -v);\n\n      return c / 255.0;\n    }\n\n    void main() {\n      float value = ${i.texture2D}(X,TexCoords).r;\n      ${i.output} = encodeAsUint8(value);\n    }`,s={name:"Uint8Encode",inputTypes:[o.TextureType.unpacked],inputNames:["X"],output:{dims:n,type:t.tensor.type,textureType:o.TextureType.downloadUint8AsFloat},shaderSource:a,hasMain:!0};return e.executeProgram(s,[t.tensor])}},9087:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.tanh=t.tan=t.sqrt=t.sin=t.sigmoid=t.relu=t.not=t.neg=t.log=t.parseLeakyReluAttributes=t.leakyRelu=t.identity=t.floor=t.exp=t.parseEluAttributes=t.elu=t.cos=t.ceil=t.clipV11=t.parseClipAttributes=t.clip=t.atan=t.asin=t.acos=t.abs=t.glslTanh=t.glslTan=t.glslSqrt=t.glslSigmoid=t.glslRelu=t.glslSin=t.glslNot=t.glslNeg=t.glslLog=t.glslLeakyRelu=t.glslIdentity=t.glslClip=t.glslFloor=t.glslExp=t.glslElu=t.glslCos=t.glslCeil=t.glslAtan=t.glslAsin=t.glslAcos=t.glslAbs=void 0;const r=n(4910),o=n(7273),i=n(1997),a=n(6757),s=n(5639);function u(){return $("abs")}function l(){return $("acos")}function c(){return $("asin")}function p(){return $("atan")}function d(){return $("ceil")}function f(){return $("cos")}function h(e){const t="elu";return{body:`\n  const float alpha = float(${e});\n\n  float ${t}_(float a) {\n    return a >= 0.0 ? a: (exp(a) - 1.0) * alpha;\n  }\n  vec4 ${t}_(vec4 v) {\n    return vec4(${t}_(v.x), ${t}_(v.y), ${t}_(v.z), ${t}_(v.w));\n  }\n  `,name:t,type:i.FunctionType.ValueBased}}function g(){return $("exp")}function m(){return $("floor")}function b(e,t){const n="clip";return{body:`\n  const float min = float(${e});\n  const float max = float(${t});\n\n  float ${n}_(float a) {\n    return clamp(a, min, max);\n  }\n  vec4 ${n}_(vec4 v) {\n    return clamp(v, min, max);\n  }\n  `,name:n,type:i.FunctionType.ValueBased}}function y(){const e="indentity";return{body:`\n  float ${e}_(float a) {\n    return a;\n  }\n  vec4 ${e}_(vec4 v) {\n    return v;\n  }\n  `,name:e,type:i.FunctionType.ValueBased}}function w(e){const t="leakyRelu";return{body:`\n  const float alpha = float(${e});\n\n  float ${t}_(float a) {\n    return a < 0.0 ? a * alpha : a;\n  }\n  vec4 ${t}_(vec4 v) {\n    return vec4(${t}_(v.x), ${t}_(v.y), ${t}_(v.z), ${t}_(v.w));\n  }\n  `,name:t,type:i.FunctionType.ValueBased}}function _(){return $("log")}function v(){const e="neg";return{body:`\n  float ${e}_(float a) {\n    return -a;\n  }\n  vec4 ${e}_(vec4 v) {\n    return -v;\n  }\n  `,name:e,type:i.FunctionType.ValueBased}}function x(){const e="not";return{body:`\n  float ${e}_(float a) {\n    return float( ! bool(a) );\n  }\n  bool ${e}_(bool a) {\n    return !a;\n  }\n  vec4 ${e}_(vec4 v) {\n    return vec4(!bool(v.x), !bool(v.y), !bool(v.z), !bool(v.w));\n  }\n  bvec4 ${e}_(bvec4 v) {\n    return bvec4(!v.x, !v.y, !v.z, !v.w);\n  }\n  `,name:e,type:i.FunctionType.ValueBased}}function T(){return $("sin")}function S(){const e="relu";return{body:`\n  float ${e}_(float a) {\n    return max( a, 0.0 );\n  }\n  vec4 ${e}_(vec4 v) {\n    return max( v, 0.0 );\n  }\n  `,name:e,type:i.FunctionType.ValueBased}}function O(){const e="sigmoid";return{body:`\n  float ${e}_(float a) {\n    return 1.0 / (1.0 + exp(-a));\n  }\n  vec4 ${e}_(vec4 v) {\n    return 1.0 / (1.0 + exp(-v));\n  }\n  `,name:e,type:i.FunctionType.ValueBased}}function A(){return $("sqrt")}function E(){return $("tan")}function I(){const e="tanh";return{body:`\n  float ${e}_(float a) {\n    a = clamp(a, -10., 10.);\n    a = exp(2.*a);\n    return (a - 1.) / (a + 1.);\n  }\n  vec4 ${e}_(vec4 v) {\n    v = clamp(v, -10., 10.);\n    v = exp(2.*v);\n    return (v - 1.) / (v + 1.);\n  }\n  `,name:e,type:i.FunctionType.ValueBased}}function $(e){return{body:`\n  float ${e}_(float a) {\n    return ${e}(a);\n  }\n  vec4 ${e}_(vec4 v) {\n    return ${e}(v);\n  }\n  `,name:e,type:i.FunctionType.ValueBased}}t.glslAbs=u,t.glslAcos=l,t.glslAsin=c,t.glslAtan=p,t.glslCeil=d,t.glslCos=f,t.glslElu=h,t.glslExp=g,t.glslFloor=m,t.glslClip=b,t.glslIdentity=y,t.glslLeakyRelu=w,t.glslLog=_,t.glslNeg=v,t.glslNot=x,t.glslSin=T,t.glslRelu=S,t.glslSigmoid=O,t.glslSqrt=A,t.glslTan=E,t.glslTanh=I;const P=(e,t,n,r)=>{const o=e.session.pack?s.TextureType.packed:s.TextureType.unpacked,i={name:n.name,inputTypes:[o],inputNames:["A"],cacheHint:r};return Object.assign(Object.assign({},i),{get:()=>((e,t,n,r)=>{const o=e.session.pack?s.TextureType.packed:s.TextureType.unpacked,i=(0,a.getGlsl)(e.session.backend.glContext.version);return Object.assign(Object.assign({},t),{output:{dims:n.dims,type:n.type,textureType:o},shaderSource:`\n     ${r.body}\n     void main() {\n       vec4 v = ${i.texture2D}(A, TexCoords);\n       v = ${r.name}_(v);\n       ${i.output} = v;\n     }\n     `,hasMain:!0})})(e,i,t,n)})};t.abs=(e,t)=>[e.run(P(e,t[0],u()),t)],t.acos=(e,t)=>[e.run(P(e,t[0],l()),t)],t.asin=(e,t)=>[e.run(P(e,t[0],c()),t)],t.atan=(e,t)=>[e.run(P(e,t[0],p()),t)],t.clip=(e,t,n)=>[e.run(P(e,t[0],b(n.min,n.max),n.cacheKey),t)],t.parseClipAttributes=e=>(0,r.createAttributeWithCacheKey)({min:e.attributes.getFloat("min",o.MIN_CLIP),max:e.attributes.getFloat("max",o.MAX_CLIP)}),t.clipV11=(e,n)=>{const r=D(e,n);return(0,t.clip)(e,[n[0]],r)};const D=(e,t)=>{if(t.length>=3&&(!e.session.isInitializer(t[1].dataId)||!e.session.isInitializer(t[2].dataId)))throw new Error("dynamic clip attributes are not allowed");const n=t.length>=3?t[1].numberData[0]:o.MIN_CLIP,i=t.length>=3?t[2].numberData[0]:o.MAX_CLIP;return(0,r.createAttributeWithCacheKey)({min:n,max:i})};t.ceil=(e,t)=>[e.run(P(e,t[0],d()),t)],t.cos=(e,t)=>[e.run(P(e,t[0],f()),t)],t.elu=(e,t,n)=>[e.run(P(e,t[0],h(n.alpha),n.cacheKey),t)],t.parseEluAttributes=e=>(0,r.createAttributeWithCacheKey)({alpha:e.attributes.getFloat("alpha",1)}),t.exp=(e,t)=>[e.run(P(e,t[0],g()),t)],t.floor=(e,t)=>[e.run(P(e,t[0],m()),t)],t.identity=(e,t)=>[e.run(P(e,t[0],y()),t)],t.leakyRelu=(e,t,n)=>[e.run(P(e,t[0],w(n.alpha),n.cacheKey),t)],t.parseLeakyReluAttributes=e=>(0,r.createAttributeWithCacheKey)({alpha:e.attributes.getFloat("alpha",.01)}),t.log=(e,t)=>[e.run(P(e,t[0],_()),t)],t.neg=(e,t)=>[e.run(P(e,t[0],v()),t)],t.not=(e,t)=>[e.run(P(e,t[0],x()),t)],t.relu=(e,t)=>[e.run(P(e,t[0],S()),t)],t.sigmoid=(e,t)=>[e.run(P(e,t[0],O()),t)],t.sin=(e,t)=>[e.run(P(e,t[0],T()),t)],t.sqrt=(e,t)=>[e.run(P(e,t[0],A()),t)],t.tan=(e,t)=>[e.run(P(e,t[0],E()),t)],t.tanh=(e,t)=>[e.run(P(e,t[0],I()),t)]},540:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.createUnpackProgramInfoLoader=t.createUnpackProgramInfo=void 0;const r=n(6757),o=n(5639),i=n(432),a=n(5614),s={name:"unpack",inputNames:["A"],inputTypes:[o.TextureType.packed]};t.createUnpackProgramInfo=(e,t)=>{const n=t.dims.length,u=(0,a.getChannels)("rc",n),l=u.slice(-2),c=(0,i.getCoordsDataType)(n),p=(0,a.unpackFromChannel)(),d=0===t.dims.length?"":function(e,t){if(1===e)return"rc";let n="";for(let r=0;r<e;r++)n+=t[r],r<e-1&&(n+=",");return n}(n,u),f=n<=1?"rc":`vec2(${l.join(",")})`,h=`\n    ${p}\n    void main() {\n      ${c} rc = getOutputCoords();\n\n       // Sample the texture with the coords to get the rgba channel value.\n       vec4 packedInput = getA(${d});\n\n       ${(0,r.getGlsl)(e.session.backend.glContext.version).output} = vec4(getChannel(packedInput, ${f}), 0, 0, 0);\n     }\n   `;return Object.assign(Object.assign({},s),{hasMain:!0,output:{dims:t.dims,type:t.type,textureType:o.TextureType.unpacked},shaderSource:h})},t.createUnpackProgramInfoLoader=(e,n)=>Object.assign(Object.assign({},s),{get:()=>(0,t.createUnpackProgramInfo)(e,n)})},7862:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.parseUnsqueezeAttributes=t.unsqueezeV13=t.unsqueeze=void 0;const r=n(7273);t.unsqueeze=(e,t,n)=>{o(t);const i=r.ShapeUtil.unsqueezeShape(t[0].dims,n);return[e.reshapeUnpacked(t[0],i)]},t.unsqueezeV13=(e,n)=>(i(n),(0,t.unsqueeze)(e,[n[0]],Array.from(n[1].integerData))),t.parseUnsqueezeAttributes=e=>e.attributes.getInts("axes");const o=e=>{if(!e||1!==e.length)throw new Error("Unsqueeze requires 1 input.");if("string"===e[0].type)throw new Error("invalid input tensor types.")},i=e=>{if(!e||2!==e.length)throw new Error("Unsqueeze requires 2 inputs.");if("int32"!==e[1].type)throw new Error("Invalid input type.")}},3980:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.scalesValidation=t.validateInputs=t.parseUpsampleAttributes=t.parseUpsampleAttributesV9=t.parseUpsampleAttributesV7=t.upsample=void 0;const r=n(4910),o=n(6757),i=n(5639),a={name:"Upsample",inputNames:["X"],inputTypes:[i.TextureType.unpacked]};t.upsample=(e,n,r)=>((0,t.validateInputs)(n,r),[e.run(Object.assign(Object.assign({},a),{cacheHint:r.cacheKey,get:()=>s(e,n,r)}),n)]),t.parseUpsampleAttributesV7=e=>(0,t.parseUpsampleAttributes)(e,7),t.parseUpsampleAttributesV9=e=>(0,t.parseUpsampleAttributes)(e,9),t.parseUpsampleAttributes=(e,n)=>{const o=n>=10,i=e.attributes.getString("mode","nearest");if("nearest"!==i&&"linear"!==i&&(n<11||"cubic"!==i))throw new Error(`unrecognized mode: ${i}`);let a=[];n<9&&(a=e.attributes.getFloats("scales"),(0,t.scalesValidation)(a,i,o));const s=e.attributes.getFloat("extrapolation_value",0),u=n>10?e.attributes.getString("coordinate_transformation_mode","half_pixel"):"asymmetric";if(-1===["asymmetric","pytorch_half_pixel","tf_half_pixel_for_nn","align_corners","tf_crop_and_resize","half_pixel"].indexOf(u))throw new Error(`coordinate_transform_mode '${u}' is not supported`);const l="tf_crop_and_resize"===u,c=l,p="nearest"===i&&n>=11?e.attributes.getString("nearest_mode","round_prefer_floor"):"";if(-1===["round_prefer_floor","round_prefer_ceil","floor","ceil",""].indexOf(p))throw new Error(`nearest_mode '${p}' is not supported`);const d=e.attributes.getFloat("cubic_coeff_a",-.75),f=0!==e.attributes.getInt("exclude_outside",0);if(f&&"cubic"!==i)throw new Error("exclude_outside can be set to 1 only when mode is CUBIC.");const h=n<11||"nearest"===i&&"asymmetric"===u&&"floor"===p;let g=0,m=0,b=0;return n>10?e.inputs.length>2?(g=1,m=2,b=3):(m=1,b=2):9===n&&(m=1),(0,r.createAttributeWithCacheKey)({opset:n,isResize:o,mode:i,scales:a,extrapolationValue:s,coordinateTransformMode:u,useExtrapolation:c,needRoiInput:l,nearestMode:p,cubicCoefficientA:d,excludeOutside:f,useNearest2xOptimization:h,roiInputIdx:g,scalesInputIdx:m,sizesInputIdx:b})};const s=(e,t,n)=>{const r=(0,o.getGlsl)(e.session.backend.glContext.version),[s,u]=e.calculateTextureWidthAndHeight(t[0].dims,i.TextureType.unpacked),l=t[0].dims.map(((e,t)=>Math.floor(e*n.scales[t]))),[c,p]=e.calculateTextureWidthAndHeight(l,i.TextureType.unpacked),d=l.length,f=new Array(d),h=new Array(d);let g=`\n      int output_pitches[${d}];\n      int input_pitches[${d}];\n      `;for(let e=d-1;e>=0;e--)f[e]=e===d-1?1:f[e+1]*l[e+1],h[e]=e===d-1?1:h[e+1]*t[0].dims[e+1],g+=`\n        output_pitches[${e}] = ${f[e]};\n        input_pitches[${e}] = ${h[e]};\n        `;const m=`\n      float getInputFloat(int index) {\n        vec2 coords = offsetToCoords(index, ${s}, ${u});\n        float value = getColorAsFloat(${r.texture2D}(X, coords));\n        return value;\n      }\n      `,b="nearest"===n.mode?`\n    ${m}\n    float process(int indices[${d}]) {\n      int input_index = 0;\n      int output_index = coordsToOffset(TexCoords, ${c}, ${p});\n\n      ${g}\n\n      int d, m;\n      for (int dim = 0; dim < ${d}; ++dim) {\n        d = output_index / output_pitches[dim];\n        m = output_index - d * output_pitches[dim];\n        output_index = m;\n\n        if (scales[dim] != 1 && d > 0) {\n          int d2 = d / scales[dim];\n          m = d - d2 * scales[dim];\n          d = d2;\n        }\n        input_index += input_pitches[dim] * d;\n      }\n\n      return getInputFloat(input_index);\n    }`:4===d?`\n    ${m}\n    float process(int indices[4]) {\n      int input_index = 0;\n      int output_index = coordsToOffset(TexCoords, ${c}, ${p});\n\n      ${g}\n\n      int m;\n      int index_of_dim0, index_of_dim1, index_of_dim2, index_of_dim3;\n      index_of_dim0 = output_index / output_pitches[0];\n      m = output_index - index_of_dim0 * output_pitches[0];\n      index_of_dim1 = m / output_pitches[1];\n      m = m - index_of_dim1 * output_pitches[1];\n      index_of_dim2 = m / output_pitches[2];\n      m = m - index_of_dim2 * output_pitches[2];\n      index_of_dim3 = m;\n\n      int index_of_input_dim2, index_of_input_dim3, x_offset, y_offset;\n      index_of_input_dim2 = index_of_dim2 / scales[2];\n      y_offset = index_of_dim2 - index_of_input_dim2 * scales[2];\n      index_of_input_dim3 = index_of_dim3 / scales[3];\n      x_offset = index_of_dim3 - index_of_input_dim3 * scales[3];\n\n      input_index = index_of_dim0 * input_pitches[0] +\n            index_of_dim1 * input_pitches[1] +\n            index_of_input_dim2 * input_pitches[2] +\n            index_of_input_dim3;\n\n      float x00 = getInputFloat(input_index);\n      float x10, x01, x11;\n\n      bool end_of_dim2 = false;\n      if (index_of_input_dim2 == (${t[0].dims[2]} - 1)) {\n        // It's the end in dimension 2\n        x01 = x00;\n        end_of_dim2 = true;\n      } else {\n        x01 = getInputFloat(input_index + input_pitches[2]);\n      }\n\n      if (index_of_input_dim3 == (input_pitches[2] - 1)) {\n        // It's the end in dimension 3\n        x10 = x00;\n        x11 = x01;\n      }\n      else {\n        x10 = getInputFloat(input_index + 1);\n        x11 = end_of_dim2 ? x10 : getInputFloat(input_index + input_pitches[2] + 1);\n      }\n\n      float y0 = x00 + float(y_offset) * (x01 - x00) / float(scales[2]);\n      float y1 = x10 + float(y_offset) * (x11 - x10) / float(scales[2]);\n      return y0 + float(x_offset) * (y1 - y0) / float(scales[3]);\n    }`:`\n    ${m}\n    float process(int indices[2]) {\n      int input_index = 0;\n      int output_index = coordsToOffset(TexCoords, ${c}, ${p});\n\n      ${g}\n\n      int m;\n      int index_of_dim0, index_of_dim1;\n      index_of_dim0 = output_index / output_pitches[0];\n      m = output_index - index_of_dim0 * output_pitches[0];\n      index_of_dim1 = m;\n\n      int index_of_input_dim0, index_of_input_dim1, x_offset, y_offset;\n      index_of_input_dim0 = index_of_dim0 / scales[0];\n      y_offset = index_of_dim0 - index_of_input_dim0 * scales[0];\n      index_of_input_dim1 = index_of_dim1 / scales[1];\n      x_offset = index_of_dim1 - index_of_input_dim1 * scales[1];\n\n      input_index = index_of_input_dim0 * input_pitches[0] + index_of_input_dim1;\n\n      float x00 = getInputFloat(input_index);\n      float x10, x01, x11;\n\n      bool end_of_dim0 = false;\n      if (index_of_input_dim0 == (${t[0].dims[0]} - 1)) {\n        // It's the end in dimension 0\n        x01 = x00;\n        end_of_dim0 = true;\n      } else {\n        x01 = getInputFloat(input_index + input_pitches[0]);\n      }\n\n      if (index_of_input_dim1 == (input_pitches[0] - 1)) {\n        // It's the end in dimension 1\n        x10 = x00;\n        x11 = x01;\n      }\n      else {\n        x10 = getInputFloat(input_index + 1);\n        x11 = end_of_dim0 ? x10 : getInputFloat(input_index + input_pitches[0] + 1);\n      }\n\n      float y0 = x00 + float(y_offset) * (x01 - x00) / float(scales[0]);\n      float y1 = x10 + float(y_offset) * (x11 - x10) / float(scales[0]);\n      return y0 + float(x_offset) * (y1 - y0) / float(scales[1]);\n    }`;return Object.assign(Object.assign({},a),{output:{dims:l,type:t[0].type,textureType:i.TextureType.unpacked},shaderSource:b,variables:[{name:"scales",type:"int",arrayLength:n.scales.length,data:n.scales.map((e=>Math.ceil(e)))}]})};t.validateInputs=(e,t)=>{if(!e||t.opset<9&&1!==e.length||t.opset>=9&&t.opset<11&&2!==e.length||t.opset>=11&&e.length<2)throw new Error("invalid inputs.");if(t.scales.length>0&&e[0].dims.length!==t.scales.length)throw new Error("Invalid input shape.");if("string"===e[0].type)throw new Error("Invalid input tensor types.")},t.scalesValidation=(e,t,n)=>{if(n){for(const t of e)if(t<=0)throw new Error("Scale value should be greater than 0.")}else for(const t of e)if(t<1)throw new Error("Scale value should be greater than or equal to 1.");if(!("linear"!==t&&"cubic"!==t||2===e.length||4===e.length&&1===e[0]&&1===e[1]))throw new Error(`'Linear' mode and 'Cubic' mode only support 2-D inputs ('Bilinear', 'Bicubic')         or 4-D inputs with the corresponding outermost 2 scale values being 1         in the ${n?"Resize":"Upsample"} opeartor.`)}},2757:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ProgramManager=void 0;const r=n(8453),o=n(1315),i=n(8897),a=n(6757);t.ProgramManager=class{constructor(e,t,n){this.profiler=e,this.glContext=t,this.textureLayoutStrategy=n,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,n){var r;this.profiler.event("op",`ProgramManager.run ${null!==(r=e.programInfo.name)&&void 0!==r?r:"unknown kernel"}`,(()=>{var r;const i=this.glContext.gl,a=e.program;i.useProgram(a);try{this.bindOutput(n),this.attributesBound||this.bindAttributes(e.attribLocations),this.bindUniforms(e.uniformLocations,null!==(r=e.programInfo.variables)&&void 0!==r?r:[],t)}catch(t){throw o.Logger.error("ProgramManager",e.programInfo.shaderSource),t}this.profiler.event("backend","GlContext.draw()",(()=>{this.glContext.draw()}))}),this.glContext)}dispose(){this.vertexShader&&this.glContext.deleteShader(this.vertexShader),this.repo.forEach((e=>this.glContext.deleteProgram(e.program)))}build(e,t,n){return this.profiler.event("backend","ProgramManager.build",(()=>{const r=new i.GlslPreprocessor(this.glContext,e,t,n),o=r.preprocess(),a=this.compile(o);return{programInfo:e,program:a,uniformLocations:this.getUniformLocations(a,r.context.programInfo.inputNames,r.context.programInfo.variables),attribLocations:this.getAttribLocations(a)}}))}compile(e){if(!this.vertexShader){o.Logger.verbose("ProrgramManager","Compiling and caching Vertex shader for the first time");const e=(0,a.getVertexShaderSource)(this.glContext.version);this.vertexShader=this.glContext.compileShader(e,this.glContext.gl.VERTEX_SHADER)}r.env.debug&&o.Logger.verbose("ProrgramManager",`FragShader:\n${e}\n`);const t=this.glContext.compileShader(e,this.glContext.gl.FRAGMENT_SHADER),n=this.glContext.createProgram(this.vertexShader,t);return this.glContext.deleteShader(t),n}bindOutput(e){const t=e.width,n=e.height;o.Logger.verbose("ProrgramManager",`Binding output texture to Framebuffer: w/h=${t}/${n}, shape=${e.shape}, type=${e.tensor.type}`),this.glContext.attachFramebuffer(e.texture,t,n)}bindAttributes(e){const t=e.position,n=e.textureCoord;this.glContext.setVertexAttributes(t,n),this.attributesBound=!0}bindUniforms(e,t,n){var r;const o=this.glContext.gl;let i=0;for(const{name:a,type:s,location:u,arrayLength:l}of e){const e=null===(r=t.find((e=>e.name===a)))||void 0===r?void 0:r.data;if("sampler2D"!==s&&!e)throw new Error(`variable '${a}' does not have data defined in program info`);switch(s){case"sampler2D":this.bindTexture(n[i],u,i),i++;break;case"float":l?o.uniform1fv(u,e):o.uniform1f(u,e);break;case"int":l?o.uniform1iv(u,e):o.uniform1i(u,e);break;default:throw new Error(`Uniform not implemented: ${s}`)}}}bindTexture(e,t,n){this.glContext.bindTextureToUniform(e.texture,n,t)}getAttribLocations(e){return{position:this.getAttribLocation(e,"position"),textureCoord:this.getAttribLocation(e,"textureCoord")}}getUniformLocations(e,t,n){const r=[];if(t)for(const n of t)r.push({name:n,type:"sampler2D",location:this.getUniformLocation(e,n)});if(n)for(const t of n)r.push(Object.assign(Object.assign({},t),{location:this.getUniformLocation(e,t.name)}));return r}getUniformLocation(e,t){const n=this.glContext.gl.getUniformLocation(e,t);if(null===n)throw new Error(`Uniform ${t} not found.`);return n}getAttribLocation(e,t){return this.glContext.gl.getAttribLocation(e,t)}}},2171:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.WebGLSessionHandler=void 0;const r=n(1315),o=n(5881),i=n(7860),a=n(4110),s=n(2757),u=n(7618),l=n(5243);t.WebGLSessionHandler=class{constructor(e,t){this.backend=e,this.context=t,this.layoutStrategy=new u.PreferLogicalStrategy(e.glContext.maxTextureSize),this.programManager=new s.ProgramManager(this.context.profiler,e.glContext,this.layoutStrategy),this.textureManager=new l.TextureManager(e.glContext,this.layoutStrategy,this.context.profiler,{reuseTextures:"full"===e.textureCacheMode}),this.packedTextureDataCache=new Map,this.unpackedTextureDataCache=new Map,this.pack=e.pack,this.pack2unpackMap=new Map,this.unpack2packMap=new Map}createInferenceHandler(){return new i.WebGLInferenceHandler(this)}onGraphInitialized(e){const t=e.getValues().filter((e=>-1===e.from&&e.tensor)).map((e=>e.tensor.dataId));this.initializers=new Set(t)}isInitializer(e){return!!this.initializers&&this.initializers.has(e)}addInitializer(e){this.initializers.add(e)}getTextureData(e,t){return t?this.packedTextureDataCache.get(e):this.unpackedTextureDataCache.get(e)}setTextureData(e,t,n=!1){r.Logger.verbose("WebGLSessionHandler","Storing Texture data in cache"),n?this.packedTextureDataCache.set(e,t):this.unpackedTextureDataCache.set(e,t)}dispose(){this.programManager.dispose(),this.textureManager.clearActiveTextures(),this.packedTextureDataCache.forEach((e=>this.textureManager.releaseTexture(e,!0))),this.packedTextureDataCache=new Map,this.unpackedTextureDataCache.forEach((e=>this.textureManager.releaseTexture(e,!0))),this.unpackedTextureDataCache=new Map}resolve(e,t,n){const r=(0,o.resolveOperator)(e,t,a.WEBGL_OP_RESOLVE_RULES);return{impl:r.opImpl,context:r.opInit?r.opInit(e,n):e}}}},9622:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Uint8DataEncoder=t.RGBAFloatDataEncoder=t.RedFloat32DataEncoder=void 0;const r=n(1315);t.RedFloat32DataEncoder=class{constructor(e,t=1){if(1===t)this.internalFormat=e.R32F,this.format=e.RED,this.textureType=e.FLOAT,this.channelSize=t;else{if(4!==t)throw new Error(`Invalid number of channels: ${t}`);this.internalFormat=e.RGBA32F,this.format=e.RGBA,this.textureType=e.FLOAT,this.channelSize=t}}encode(e,t){let n,o;return e.constructor!==Float32Array&&(r.Logger.warning("Encoder","data was not of type Float32; creating new Float32Array"),o=new Float32Array(e)),t*this.channelSize>e.length?(r.Logger.warning("Encoder","Source data too small. Allocating larger array"),o=e,n=this.allocate(t*this.channelSize),o.forEach(((e,t)=>n[t]=e))):(o=e,n=o),n}allocate(e){return new Float32Array(4*e)}decode(e,t){return 1===this.channelSize?e.filter(((e,t)=>t%4==0)).subarray(0,t):e.subarray(0,t)}},t.RGBAFloatDataEncoder=class{constructor(e,t=1,n){if(1!==t&&4!==t)throw new Error(`Invalid number of channels: ${t}`);this.internalFormat=e.RGBA,this.format=e.RGBA,this.channelSize=t,this.textureType=n||e.FLOAT}encode(e,t){let n=e;return 1===this.channelSize&&(r.Logger.verbose("Encoder","Exploding into a larger array"),n=this.allocate(t),e.forEach(((e,t)=>n[4*t]=e))),n}allocate(e){return new Float32Array(4*e)}decode(e,t){return 1===this.channelSize?e.filter(((e,t)=>t%4==0)).subarray(0,t):e.subarray(0,t)}},t.Uint8DataEncoder=class{constructor(e,t=1){if(this.channelSize=4,1===t)this.internalFormat=e.ALPHA,this.format=e.ALPHA,this.textureType=e.UNSIGNED_BYTE,this.channelSize=t;else{if(4!==t)throw new Error(`Invalid number of channels: ${t}`);this.internalFormat=e.RGBA,this.format=e.RGBA,this.textureType=e.UNSIGNED_BYTE,this.channelSize=t}}encode(e,t){return new Uint8Array(e.buffer,e.byteOffset,e.byteLength)}allocate(e){return new Uint8Array(e*this.channelSize)}decode(e,t){if(e instanceof Uint8Array)return e.subarray(0,t);throw new Error(`Invalid array type: ${e.constructor}`)}}},7618:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getBatchDim=t.sizeToSquarishShape=t.getRowsCols=t.sizeFromShape=t.isInt=t.parseAxisParam=t.squeezeShape=t.PreferLogicalStrategy=t.AlwaysKeepOriginalSizeStrategy=void 0;const r=n(1315),o=n(7273);function i(e,t){const n=[],r=[],o=null!=t&&Array.isArray(t)&&0===t.length,i=null==t||o?null:a(t,e).sort();let s=0;for(let t=0;t<e.length;++t){if(null!=i){if(i[s]===t&&1!==e[t])throw new Error(`Can't squeeze axis ${t} since its dim '${e[t]}' is not 1`);(null==i[s]||i[s]>t)&&1===e[t]&&(n.push(e[t]),r.push(t)),i[s]<=t&&s++}1!==e[t]&&(n.push(e[t]),r.push(t))}return{newShape:n,keptDims:r}}function a(e,t){const n=t.length;return e=null==e?t.map(((e,t)=>t)):[].concat(e),(0,o.assert)(e.every((e=>e>=-n&&e<n)),(()=>`All values in axis param must be in range [-${n}, ${n}) but got axis ${e}`)),(0,o.assert)(e.every(s),(()=>`All values in axis param must be integers but got axis ${e}`)),e.map((e=>e<0?n+e:e))}function s(e){return e%1==0}function u(e){if(0===e.length)return 1;let t=e[0];for(let n=1;n<e.length;n++)t*=e[n];return t}function l(e){const t=Math.ceil(Math.sqrt(e));return[t,Math.ceil(e/t)]}t.AlwaysKeepOriginalSizeStrategy=class{constructor(e){this.maxTextureSize=e}computeTextureWH(e,t){if(0===e.length)return[1,1];const n=this.maxTextureSize;if(t&&void 0!==t.breakAxis){const o=t.breakAxis>=e.length?1:e.slice(t.breakAxis).reduce(((e,t)=>e*t)),i=t.breakAxis<=0?1:e.slice(0,t.breakAxis).reduce(((e,t)=>e*t));if(!(o>n||i>n))return[o,i];r.Logger.verbose("TextureLayout",`Given width/height preferences were unattainable: shape:${e}, breakAxis:${t.breakAxis}`)}const o=e.reduce(((e,t)=>e*t));let i=Math.floor(Math.sqrt(o));for(;i<n&&i<o&&o%i!=0;i++);if(i>=n||o%i!=0)throw new Error(`The given dimensions are outside this GPU's boundaries: ${e}`);return[i,o/i]}},t.PreferLogicalStrategy=class{constructor(e){this.maxTextureSize=e}computeTextureWH(e,t){const n=this.computeTexture(e,t);return t&&t.isPacked&&(n[0]/=2,n[1]/=2),t&&t.reverseWH?[n[1],n[0]]:n}computeTexture(e,t){const n=t&&t.isPacked;if(0===e.length)return n?[2,2]:[1,1];let o=this.maxTextureSize;if(t&&void 0!==t.breakAxis){const n=t.breakAxis>=e.length?1:e.slice(t.breakAxis).reduce(((e,t)=>e*t)),i=t.breakAxis<=0?1:e.slice(0,t.breakAxis).reduce(((e,t)=>e*t));if(!(n>o||i>o))return[n,i];r.Logger.verbose("TextureLayout",`Given width/height preferences were unattainable: shape:${e}, breakAxis:${t.breakAxis}`)}let a=e.slice(0);if(n&&(o*=2,a=a.map(((e,t)=>t>=a.length-2?a[t]%2==0?a[t]:a[t]+1:a[t])),1===a.length&&(a=[2,a[0]])),2!==a.length){const e=i(a);a=e.newShape}const s=u(a);return a.length<=1&&s<=o?[1,s]:2===a.length&&a[0]<=o&&a[1]<=o?a:3===a.length&&a[0]*a[1]<=o&&a[2]<=o?[a[0]*a[1],a[2]]:3===a.length&&a[0]<=o&&a[1]*a[2]<=o?[a[0],a[1]*a[2]]:4===a.length&&a[0]*a[1]*a[2]<=o&&a[3]<=o?[a[0]*a[1]*a[2],a[3]]:4===a.length&&a[0]<=o&&a[1]*a[2]*a[3]<=o?[a[0],a[1]*a[2]*a[3]]:n?l(s/4).map((e=>2*e)):l(s)}},t.squeezeShape=i,t.parseAxisParam=a,t.isInt=s,t.sizeFromShape=u,t.getRowsCols=function(e){if(0===e.length)throw Error("Cannot get rows and columns of an empty shape array.");return[e.length>1?e[e.length-2]:1,e[e.length-1]]},t.sizeToSquarishShape=l,t.getBatchDim=function(e,t=2){return u(e.slice(0,e.length-t))}},3314:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.createTextureLayoutFromShape=t.calculateTextureWidthAndHeight=t.createTextureLayoutFromTextureType=void 0;const r=n(7273),o=n(5639);t.createTextureLayoutFromTextureType=(e,n,r)=>{const i=r===o.TextureType.unpacked||r===o.TextureType.unpackedReversed?1:4,a=r===o.TextureType.packed,s=r===o.TextureType.unpackedReversed||r===o.TextureType.packed,u=r===o.TextureType.packedLastDimension?n.length-1:void 0,l=r===o.TextureType.packedLastDimension?n.map(((e,t)=>t===n.length-1?4*e:e)):void 0;return(0,t.createTextureLayoutFromShape)(e,n,i,l,{isPacked:a,reverseWH:s,breakAxis:u})},t.calculateTextureWidthAndHeight=(e,n,r)=>{const o=(0,t.createTextureLayoutFromTextureType)(e,n,r);return[o.width,o.height]},t.createTextureLayoutFromShape=(e,t,n=1,o,i)=>{const a=!(!i||!i.isPacked),[s,u]=e.computeTextureWH(a&&o||t,i),l=t.length;let c=t.slice(0);if(0===l&&(c=[1]),1===n)o=t;else if(a){if(4!==n)throw new Error("a packed texture must be 4-channel");o=t,l>0&&(c[l-1]=Math.ceil(c[l-1]/2)),l>1&&(c[l-2]=Math.ceil(c[l-2]/2))}else if(!o)throw new Error("Unpacked shape is needed when using channels > 1");return{width:s,height:u,channels:n,isPacked:a,shape:c,strides:r.ShapeUtil.computeStrides(c),unpackedShape:o,reversedWH:i&&i.reverseWH}}},5243:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.TextureManager=void 0;const r=n(1315);t.TextureManager=class{constructor(e,t,n,r){this.glContext=e,this.layoutStrategy=t,this.profiler=n,this.config=r,this.pendingRead=new Map,r.reuseTextures&&(this.inUseTextures=new Map,this.idleTextures=new Map,this.textureLookup=new Map)}createTextureFromLayout(e,t,n,o){const i=this.toEncoderType(e),a=this.glContext.getEncoder(i,t.channels||1,o);if(t.isPacked&&1===o)throw new Error("not implemented");const s=t.width,u=t.height;let l,c;if(this.config.reuseTextures){l=`${s}x${u}_${a.format}_${a.internalFormat}_${a.textureType}`,c=this.inUseTextures.get(l),c||(c=[],this.inUseTextures.set(l,c));const t=this.idleTextures.get(l);if(t&&t.length>0){const r=t.pop();return c.push(r),1===o&&this.glContext.updateTexture(r,s,u,a,this.toTextureData(e,n)),r}}r.Logger.verbose("TextureManager",`Creating new texture of size ${t.width}x${t.height}`);const p=this.glContext.allocateTexture(s,u,a,this.toTextureData(e,n));return this.config.reuseTextures&&(c.push(p),this.textureLookup.set(p,l)),p}readTexture(e,t,n){return n||(n=1),this.profiler.event("backend","TextureManager.readTexture",(()=>{const r=e.shape.reduce(((e,t)=>e*t))*n,o=this.glContext.readTexture(e.texture,e.width,e.height,r,this.toEncoderType(t),n);return this.toTensorData(t,o)}))}async readTextureAsync(e,t,n){const r=e.tensor.dataId;if(n||(n=1),this.pendingRead.has(r)){const e=this.pendingRead.get(r);return new Promise((t=>null==e?void 0:e.push(t)))}return this.profiler.event("backend","TextureManager.readTextureAsync",(async()=>{this.pendingRead.set(r,[]);const o=e.shape.reduce(((e,t)=>e*t))*n;await this.glContext.createAndWaitForFence();const i=this.glContext.readTexture(e.texture,e.width,e.height,o,this.toEncoderType(t),n),a=this.toTensorData(t,i),s=this.pendingRead.get(r);return this.pendingRead.delete(r),null==s||s.forEach((e=>e(a))),a}))}readUint8TextureAsFloat(e){return this.profiler.event("backend","TextureManager.readUint8TextureAsFloat",(()=>{const t=e.shape.reduce(((e,t)=>e*t)),n=this.glContext.readTexture(e.texture,e.width,e.height,4*t,"byte",4);return new Float32Array(n.buffer,n.byteOffset,t)}))}releaseTexture(e,t){let n;if(this.config.reuseTextures&&(n=this.textureLookup.get(e.texture),n)){t&&this.textureLookup.delete(n);const r=this.inUseTextures.get(n);if(r){const t=r.indexOf(e.texture);if(-1!==t){r.splice(t,1);let o=this.idleTextures.get(n);o||(o=[],this.idleTextures.set(n,o)),o.push(e.texture)}}}n&&!t||(r.Logger.verbose("TextureManager",`Deleting texture of size ${e.width}x${e.height}`),this.glContext.deleteTexture(e.texture))}toTensorData(e,t){switch(e){case"int16":return t instanceof Int16Array?t:Int16Array.from(t);case"int32":return t instanceof Int32Array?t:Int32Array.from(t);case"int8":return t instanceof Int8Array?t:Int8Array.from(t);case"uint16":return t instanceof Uint16Array?t:Uint16Array.from(t);case"uint32":return t instanceof Uint32Array?t:Uint32Array.from(t);case"uint8":case"bool":return t instanceof Uint8Array?t:Uint8Array.from(t);case"float32":return t instanceof Float32Array?t:Float32Array.from(t);case"float64":return t instanceof Float64Array?t:Float64Array.from(t);default:throw new Error(`TensorData type ${e} is not supported`)}}toTextureData(e,t){if(t)return t instanceof Float32Array?t:new Float32Array(t)}toEncoderType(e){return"float"}clearActiveTextures(){this.glContext.clearActiveTextures()}}},5639:(e,t)=>{"use strict";var n;Object.defineProperty(t,"__esModule",{value:!0}),t.TextureType=void 0,(n=t.TextureType||(t.TextureType={}))[n.unpacked=0]="unpacked",n[n.unpackedReversed=1]="unpackedReversed",n[n.packed=2]="packed",n[n.downloadUint8AsFloat=3]="downloadUint8AsFloat",n[n.packedLastDimension=4]="packedLastDimension"},432:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getGlChannels=t.getCoordsDataType=t.getSqueezedParams=t.squeezeInputShape=t.generateShaderFuncNameFromInputSamplerNameAtOutCoords=t.generateShaderFuncNameFromInputSamplerName=t.repeatedTry=t.getPackedShape=void 0;const r=n(7273);t.getPackedShape=function(e){const t=e.length;return e.slice(0,t-1).concat(e[t-1]/4)},t.repeatedTry=async function(e,t=(e=>0),n){return new Promise(((r,o)=>{let i=0;const a=()=>{if(e())return void r();i++;const s=t(i);null!=n&&i>=n?o():setTimeout(a,s)};a()}))},t.generateShaderFuncNameFromInputSamplerName=function(e){return(0,r.assert)(void 0!==e&&0!==e.length,(()=>"empty string found for sampler name")),"get"+e.charAt(0).toUpperCase()+e.slice(1)},t.generateShaderFuncNameFromInputSamplerNameAtOutCoords=function(e){return(0,r.assert)(void 0!==e&&0!==e.length,(()=>"empty string found for sampler name")),"get"+e.charAt(0).toUpperCase()+e.slice(1)+"AtOutCoords"},t.squeezeInputShape=function(e,t){let n=JSON.parse(JSON.stringify(e));return n=t,n},t.getSqueezedParams=function(e,t){return t.map((t=>e[t])).join(", ")},t.getCoordsDataType=function(e){if(e<=1)return"int";if(2===e)return"ivec2";if(3===e)return"ivec3";if(4===e)return"ivec4";if(5===e)return"ivec5";if(6===e)return"ivec6";throw Error(`GPU for rank ${e} is not yet supported`)},t.getGlChannels=function(e=6){return["x","y","z","w","u","v"].slice(0,e)}},3389:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.createNewWebGLContext=t.createWebGLContext=void 0;const r=n(1315),o=n(3524),i={};function a(e){const t=function(){if("undefined"==typeof document){if("undefined"==typeof OffscreenCanvas)throw new TypeError("failed to create canvas: OffscreenCanvas is not supported");return new OffscreenCanvas(1,1)}const e=document.createElement("canvas");return e.width=1,e.height=1,e}();let n;const i={alpha:!1,depth:!1,antialias:!1,stencil:!1,preserveDrawingBuffer:!1,premultipliedAlpha:!1,failIfMajorPerformanceCaveat:!1};if((!e||"webgl2"===e)&&(n=t.getContext("webgl2",i),n))try{return new o.WebGLContext(n,2)}catch(e){r.Logger.warning("GlContextFactory",`failed to create WebGLContext using contextId 'webgl2'. Error: ${e}`)}if((!e||"webgl"===e)&&(n=t.getContext("webgl",i)||t.getContext("experimental-webgl",i),n))try{return new o.WebGLContext(n,1)}catch(e){r.Logger.warning("GlContextFactory",`failed to create WebGLContext using contextId 'webgl' or 'experimental-webgl'. Error: ${e}`)}throw new Error("WebGL is not supported")}t.createWebGLContext=function e(t){let n;t&&"webgl2"!==t||!("webgl2"in i)?t&&"webgl"!==t||!("webgl"in i)||(n=i.webgl):n=i.webgl2,n=n||a(t),t=t||1===n.version?"webgl":"webgl2";const r=n.gl;return i[t]=n,r.isContextLost()?(delete i[t],e(t)):(r.disable(r.DEPTH_TEST),r.disable(r.STENCIL_TEST),r.disable(r.BLEND),r.disable(r.DITHER),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SAMPLE_COVERAGE),r.enable(r.SCISSOR_TEST),r.enable(r.CULL_FACE),r.cullFace(r.BACK),n)},t.createNewWebGLContext=a},3524:function(e,t,n){"use strict";var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){void 0===r&&(r=n);var o=Object.getOwnPropertyDescriptor(t,n);o&&!("get"in o?!t.__esModule:o.writable||o.configurable)||(o={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,r,o)}:function(e,t,n,r){void 0===r&&(r=n),e[r]=t[n]}),o=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),i=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)"default"!==n&&Object.prototype.hasOwnProperty.call(e,n)&&r(t,e,n);return o(t,e),t};Object.defineProperty(t,"__esModule",{value:!0}),t.WebGLContext=t.linearSearchLastTrue=void 0;const a=n(8453),s=i(n(9622)),u=n(432);function l(e){let t=0;for(;t<e.length&&e[t]();++t);return t-1}t.linearSearchLastTrue=l,t.WebGLContext=class{constructor(e,t){this.frameBufferBound=!1,this.itemsToPoll=[],this.gl=e,this.version=t,this.getExtensions(),this.vertexbuffer=this.createVertexbuffer(),this.framebuffer=this.createFramebuffer(),this.queryVitalParameters()}allocateTexture(e,t,n,r){const o=this.gl,i=o.createTexture();o.bindTexture(o.TEXTURE_2D,i),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.NEAREST),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.NEAREST),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE);const a=r?n.encode(r,e*t):null;return o.texImage2D(o.TEXTURE_2D,0,n.internalFormat,e,t,0,n.format,n.textureType,a),this.checkError(),i}updateTexture(e,t,n,r,o){const i=this.gl;i.bindTexture(i.TEXTURE_2D,e);const a=r.encode(o,t*n);i.texSubImage2D(i.TEXTURE_2D,0,0,0,t,n,r.format,r.textureType,a),this.checkError()}attachFramebuffer(e,t,n){const r=this.gl;r.bindTexture(r.TEXTURE_2D,e),r.bindFramebuffer(r.FRAMEBUFFER,this.framebuffer),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,e,0),this.checkError(),r.viewport(0,0,t,n),r.scissor(0,0,t,n)}readTexture(e,t,n,r,o,i){const a=this.gl;i||(i=1),this.frameBufferBound||this.attachFramebuffer(e,t,n);const s=this.getEncoder(o,i),u=s.allocate(t*n);return a.bindTexture(a.TEXTURE_2D,e),a.framebufferTexture2D(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,e,0),a.readPixels(0,0,t,n,a.RGBA,s.textureType,u),this.checkError(),s.decode(u,r)}isFramebufferReady(){return!0}getActiveTexture(){const e=this.gl;return"TEXTURE"+(e.getParameter(this.gl.ACTIVE_TEXTURE)-e.TEXTURE0)}getTextureBinding(){return this.gl.getParameter(this.gl.TEXTURE_BINDING_2D)}getFramebufferBinding(){return this.gl.getParameter(this.gl.FRAMEBUFFER_BINDING)}setVertexAttributes(e,t){const n=this.gl;n.vertexAttribPointer(e,3,n.FLOAT,!1,20,0),n.enableVertexAttribArray(e),-1!==t&&(n.vertexAttribPointer(t,2,n.FLOAT,!1,20,12),n.enableVertexAttribArray(t)),this.checkError()}createProgram(e,t){const n=this.gl,r=n.createProgram();return n.attachShader(r,e),n.attachShader(r,t),n.linkProgram(r),r}compileShader(e,t){const n=this.gl,r=n.createShader(t);if(!r)throw new Error(`createShader() returned null with type ${t}`);if(n.shaderSource(r,e),n.compileShader(r),!1===n.getShaderParameter(r,n.COMPILE_STATUS))throw new Error(`Failed to compile shader: ${n.getShaderInfoLog(r)}\nShader source:\n${e}`);return r}deleteShader(e){this.gl.deleteShader(e)}bindTextureToUniform(e,t,n){const r=this.gl;r.activeTexture(r.TEXTURE0+t),this.checkError(),r.bindTexture(r.TEXTURE_2D,e),this.checkError(),r.uniform1i(n,t),this.checkError()}draw(){this.gl.drawArrays(this.gl.TRIANGLE_STRIP,0,4),this.checkError()}checkError(){if(a.env.debug){const e=this.gl,t=e.getError();let n="";switch(t){case e.NO_ERROR:return;case e.INVALID_ENUM:n="INVALID_ENUM";break;case e.INVALID_VALUE:n="INVALID_VALUE";break;case e.INVALID_OPERATION:n="INVALID_OPERATION";break;case e.INVALID_FRAMEBUFFER_OPERATION:n="INVALID_FRAMEBUFFER_OPERATION";break;case e.OUT_OF_MEMORY:n="OUT_OF_MEMORY";break;case e.CONTEXT_LOST_WEBGL:n="CONTEXT_LOST_WEBGL";break;default:n=`Unknown WebGL Error: ${t.toString(16)}`}throw new Error(n)}}deleteTexture(e){this.gl.deleteTexture(e)}deleteProgram(e){this.gl.deleteProgram(e)}getEncoder(e,t,n=0){if(2===this.version)return new s.RedFloat32DataEncoder(this.gl,t);switch(e){case"float":return 1===n||this.isRenderFloat32Supported?new s.RGBAFloatDataEncoder(this.gl,t):new s.RGBAFloatDataEncoder(this.gl,t,this.textureHalfFloatExtension.HALF_FLOAT_OES);case"int":throw new Error("not implemented");case"byte":return new s.Uint8DataEncoder(this.gl,t);default:throw new Error(`Invalid dataType: ${e}`)}}clearActiveTextures(){const e=this.gl;for(let t=0;t<this.maxTextureImageUnits;++t)e.activeTexture(e.TEXTURE0+t),e.bindTexture(e.TEXTURE_2D,null)}dispose(){if(this.disposed)return;const e=this.gl;e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteFramebuffer(this.framebuffer),e.bindBuffer(e.ARRAY_BUFFER,null),e.deleteBuffer(this.vertexbuffer),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,null),e.finish(),this.disposed=!0}createDefaultGeometry(){return new Float32Array([-1,1,0,0,1,-1,-1,0,0,0,1,1,0,1,1,1,-1,0,1,0])}createVertexbuffer(){const e=this.gl,t=e.createBuffer();if(!t)throw new Error("createBuffer() returned null");const n=this.createDefaultGeometry();return e.bindBuffer(e.ARRAY_BUFFER,t),e.bufferData(e.ARRAY_BUFFER,n,e.STATIC_DRAW),this.checkError(),t}createFramebuffer(){const e=this.gl.createFramebuffer();if(!e)throw new Error("createFramebuffer returned null");return e}queryVitalParameters(){const e=this.gl;if(this.isFloatTextureAttachableToFrameBuffer=this.checkFloatTextureAttachableToFrameBuffer(),this.isRenderFloat32Supported=this.checkRenderFloat32(),this.isFloat32DownloadSupported=this.checkFloat32Download(),1===this.version&&!this.textureHalfFloatExtension&&!this.isRenderFloat32Supported)throw new Error("both float32 and float16 TextureType are not supported");this.isBlendSupported=!this.isRenderFloat32Supported||this.checkFloat32Blend(),this.maxTextureSize=e.getParameter(e.MAX_TEXTURE_SIZE),this.maxTextureImageUnits=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),this.version}getExtensions(){2===this.version?(this.colorBufferFloatExtension=this.gl.getExtension("EXT_color_buffer_float"),this.disjointTimerQueryWebgl2Extension=this.gl.getExtension("EXT_disjoint_timer_query_webgl2")):(this.textureFloatExtension=this.gl.getExtension("OES_texture_float"),this.textureHalfFloatExtension=this.gl.getExtension("OES_texture_half_float"))}checkFloatTextureAttachableToFrameBuffer(){const e=this.gl,t=e.createTexture();e.bindTexture(e.TEXTURE_2D,t);const n=2===this.version?e.RGBA32F:e.RGBA;e.texImage2D(e.TEXTURE_2D,0,n,1,1,0,e.RGBA,e.FLOAT,null);const r=e.createFramebuffer();e.bindFramebuffer(e.FRAMEBUFFER,r),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0);const o=e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE;return e.bindTexture(e.TEXTURE_2D,null),e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteTexture(t),e.deleteFramebuffer(r),o}checkRenderFloat32(){if(2===this.version){if(!this.colorBufferFloatExtension)return!1}else if(!this.textureFloatExtension)return!1;return this.isFloatTextureAttachableToFrameBuffer}checkFloat32Download(){if(2===this.version){if(!this.colorBufferFloatExtension)return!1}else{if(!this.textureFloatExtension)return!1;if(!this.gl.getExtension("WEBGL_color_buffer_float"))return!1}return this.isFloatTextureAttachableToFrameBuffer}checkFloat32Blend(){const e=this.gl;let t,n,r,o,i;try{t=e.createTexture(),n=e.createFramebuffer(),e.bindTexture(e.TEXTURE_2D,t);const a=2===this.version?e.RGBA32F:e.RGBA;return e.texImage2D(e.TEXTURE_2D,0,a,1,1,0,e.RGBA,e.FLOAT,null),e.bindFramebuffer(e.FRAMEBUFFER,n),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0),e.enable(e.BLEND),r=e.createShader(e.VERTEX_SHADER),!!r&&(e.shaderSource(r,"void main(){}"),e.compileShader(r),o=e.createShader(e.FRAGMENT_SHADER),!!o&&(e.shaderSource(o,"precision highp float;void main(){gl_FragColor=vec4(0.5);}"),e.compileShader(o),i=e.createProgram(),!!i&&(e.attachShader(i,r),e.attachShader(i,o),e.linkProgram(i),e.useProgram(i),e.drawArrays(e.POINTS,0,1),e.getError()===e.NO_ERROR)))}finally{e.disable(e.BLEND),i&&e.deleteProgram(i),r&&e.deleteShader(r),o&&e.deleteShader(o),n&&(e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteFramebuffer(n)),t&&(e.bindTexture(e.TEXTURE_2D,null),e.deleteTexture(t))}}beginTimer(){if(2===this.version&&this.disjointTimerQueryWebgl2Extension){const e=this.gl,t=this.disjointTimerQueryWebgl2Extension,n=e.createQuery();return e.beginQuery(t.TIME_ELAPSED_EXT,n),n}throw new Error("WebGL1 profiling currently not supported.")}endTimer(){if(2!==this.version||!this.disjointTimerQueryWebgl2Extension)throw new Error("WebGL1 profiling currently not supported");{const e=this.gl,t=this.disjointTimerQueryWebgl2Extension;e.endQuery(t.TIME_ELAPSED_EXT)}}isTimerResultAvailable(e){let t=!1,n=!1;if(2!==this.version||!this.disjointTimerQueryWebgl2Extension)throw new Error("WebGL1 profiling currently not supported");{const r=this.gl,o=this.disjointTimerQueryWebgl2Extension;t=r.getQueryParameter(e,r.QUERY_RESULT_AVAILABLE),n=r.getParameter(o.GPU_DISJOINT_EXT)}return t&&!n}getTimerResult(e){let t=0;if(2!==this.version)throw new Error("WebGL1 profiling currently not supported");{const n=this.gl;t=n.getQueryParameter(e,n.QUERY_RESULT),n.deleteQuery(e)}return t/1e6}async waitForQueryAndGetTime(e){return await(0,u.repeatedTry)((()=>this.isTimerResultAvailable(e))),this.getTimerResult(e)}async createAndWaitForFence(){const e=this.createFence(this.gl);return this.pollFence(e)}createFence(e){let t;const n=e,r=n.fenceSync(n.SYNC_GPU_COMMANDS_COMPLETE,0);return e.flush(),t=null===r?()=>!0:()=>{const e=n.clientWaitSync(r,0,0);return e===n.ALREADY_SIGNALED||e===n.CONDITION_SATISFIED},{query:r,isFencePassed:t}}async pollFence(e){return new Promise((t=>{this.addItemToPoll((()=>e.isFencePassed()),(()=>t()))}))}pollItems(){const e=l(this.itemsToPoll.map((e=>e.isDoneFn)));for(let t=0;t<=e;++t){const{resolveFn:e}=this.itemsToPoll[t];e()}this.itemsToPoll=this.itemsToPoll.slice(e+1)}async addItemToPoll(e,t){this.itemsToPoll.push({isDoneFn:e,resolveFn:t}),this.itemsToPoll.length>1||await(0,u.repeatedTry)((()=>(this.pollItems(),0===this.itemsToPoll.length)))}}},6496:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ExecutionPlan=void 0;const r=n(1315);class o{constructor(e,t){this.op=e,this.node=t}}t.ExecutionPlan=class{constructor(e,t,n){this.graph=e,this.profiler=n,this.initialize(t)}initialize(e){this.profiler.event("session","ExecutionPlan.initialize",(()=>{const t=this.graph.getNodes();if(t.length!==e.length)throw new Error("The size of nodes and OPs do not match.");this._ops=e.map(((e,n)=>new o(e,t[n]))),this.reset(),this._starter=[],this._ops.forEach(((e,t)=>{let n=!0;for(const t of e.node.inputs)if(!this._values[t]&&-1===this.graph.getInputIndices().indexOf(t)){n=!1;break}n&&this._starter.push(t)}))}))}reset(){this._values=this.graph.getValues().map((e=>e.tensor))}async execute(e,t){return this.profiler.event("session","ExecutionPlan.execute",(async()=>{this.reset();const n=e.createInferenceHandler(),o=this.graph.getInputIndices();if(t.length!==o.length)throw new Error(`number of input tensors don't match the number of inputs to the model: actual: ${t.length} expected: ${o.length}`);t.forEach(((e,t)=>{const n=o[t];this._values[n]=e}));const i=this._starter.slice(0),a=this.graph.getValues(),s=this.graph.getNodes();let u=0;for(;u<i.length;){const e=i[u++],t=this._ops[e],o=t.node.inputs.map((e=>this._values[e]));if(-1!==o.indexOf(void 0))throw new Error(`unresolved input detected: op: ${t.node}`);const l=o;r.Logger.verbose("ExecPlan",`Runing op:${t.node.name} (${l.map(((e,n)=>`'${t.node.inputs[n]}': ${e.type}[${e.dims.join(",")}]`)).join(", ")})`);const c=await this.profiler.event("node",t.node.name,(async()=>t.op.impl(n,l,t.op.context)));if(c.length!==t.node.outputs.length)throw new Error("the size of output does not match model definition.");c.forEach(((e,n)=>{const r=t.node.outputs[n];if(this._values[r])throw new Error(`output [${r}] already has value: op:${t.node.name}`);this._values[r]=e}));const p=new Set;c.forEach(((e,n)=>{const r=t.node.outputs[n];for(const e of a[r].to){const t=s[e];let n=!0;for(const e of t.inputs)if(!this._values[e]){n=!1;break}n&&p.add(e)}})),i.push(...p)}const l=[];for(let e=0;e<this.graph.getOutputIndices().length;e++){const t=this.graph.getOutputIndices()[e],n=this._values[t];if(void 0===n)throw new Error(`required output [${t}] does not have value`);0===t?await n.getData():n.data,l.push(n)}return r.Logger.verbose("ExecPlan","disposing of inferenceHandler"),n.dispose(),l}))}}},4662:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Graph=void 0;const r=n(1446),o=n(6874),i=n(1287),a=n(9240),s=n(7273);var u=i.onnxruntime.experimental.fbs;t.Graph={from:(e,t)=>new p(e,t)};class l{constructor(e){this._from=void 0,this._to=[],this.tensor=void 0,this.type=void 0,e&&(this.type=s.ProtoUtil.tensorValueTypeFromProto(e.type.tensorType))}get from(){return this._from}get to(){return this._to}}class c{constructor(e,t){e instanceof r.onnx.NodeProto?(this.name=e.name,this.opType=e.opType,this.attributes=new o.Attribute(e.attribute)):e instanceof u.Node&&(this.name=null!=t?t:e.name(),this.opType=e.opType(),this.attributes=new o.Attribute(s.ProtoUtil.tensorAttributesFromORTFormat(e))),this.inputs=[],this.outputs=[],this.executeNode=!0}}class p{constructor(e,t){if(!e)throw new TypeError("graph is empty");this.buildGraph(e),this.transformGraph(t),this.checkIsAcyclic()}getInputIndices(){return this._allInputIndices}getInputNames(){return this._allInputNames}getOutputIndices(){return this._allOutputIndices}getOutputNames(){return this._allOutputNames}getValues(){return this._allData}getNodes(){return this._nodes}buildGraph(e){if(e instanceof r.onnx.GraphProto)this.buildGraphFromOnnxFormat(e);else{if(!(e instanceof u.Graph))throw new TypeError("Graph type is not supported.");this.buildGraphFromOrtFormat(e)}}buildGraphFromOnnxFormat(e){const t=new Map;this._allData=[],this._allInputIndices=[],this._allInputNames=[],this._allOutputIndices=[],this._allOutputNames=[],this._nodes=[];const n=new Map;if(!e.input)throw new Error("missing information in graph: input");const r=[];for(const n of e.input){if(t.has(n.name))throw new Error(`duplicated input name: ${n.name}`);const e=this._allData.push(new l(n))-1;t.set(n.name,e),r.push(n.name)}if(!e.initializer)throw new Error("missing information in graph: initializer");for(const n of e.initializer){let e=t.get(n.name);if(void 0===e){const r=new l;r.type={shape:{dims:s.ProtoUtil.tensorDimsFromProto(n.dims)},tensorType:s.ProtoUtil.tensorDataTypeFromProto(n.dataType)},e=this._allData.push(r)-1,t.set(n.name,e)}this._allData[e]._from=-1,this._allData[e].tensor=a.Tensor.fromProto(n)}for(let e=0;e<this._allData.length;e++)this._allData[e].tensor||(this._allInputIndices.push(e),this._allInputNames.push(r[e]));if(!e.output)throw new Error("missing information in graph: output");for(const n of e.output){if(t.has(n.name))throw new Error(`duplicated output name: ${n.name}`);const e=this._allData.push(new l(n))-1;t.set(n.name,e),this._allOutputIndices.push(e),this._allOutputNames.push(n.name)}if(!e.node)throw new Error("missing information in graph: node");for(const t of e.node){if(!t.name)for(let e=0;;e++){const r=`unnamed_${t.opType}_${e}`;if(!n.has(r)){t.name=r;break}}if(n.has(t.name))throw new Error(`duplicated node name: ${t.name}`);const e=this._nodes.push(new c(t))-1;n.set(t.name,e)}for(let n=0;n<this._nodes.length;n++){const r=this._nodes[n],o=e.node[n];if(!o.output)throw new Error(`missing output for node: ${o.name}`);for(const e of o.output){let i=t.get(e);if(void 0===i&&(i=this._allData.push(new l)-1,t.set(e,i)),r.outputs.push(i),void 0!==this._allData[i]._from)throw new Error(`multiple nodes output to one data value: ${i}`);if(this._allData[i]._from=n,"Constant"===o.opType){if(!o.attribute||1!==o.attribute.length||!o.attribute[0].t)throw new Error("missing attributes or missing tensor value in attributes for this Constant operator");if(!o.output||1!==o.output.length)throw new Error("missing output or incorrect number of outputs for this Constant operator");r.outputs.pop(),r.executeNode=!1,this._allData[i]._from=-1,this._allData[i].tensor=a.Tensor.fromProto(o.attribute[0].t)}}}for(let n=0;n<this._nodes.length;n++){const r=this._nodes[n],o=e.node[n];if(!o.input)throw new Error(`missing input for node: ${o.name}`);for(const e of o.input){const i=t.get(e);if(void 0===i){if(""===e&&3===o.input.length&&"Resize"===o.opType)continue;throw new Error(`unrecognized input '${e}' for node: ${o.name}`)}r.inputs.push(i),this._allData[i]._to.push(n)}}return!0}buildGraphFromOrtFormat(e){var t,n,r;const o=new Map;this._allData=[],this._allInputIndices=[],this._allInputNames=[],this._allOutputIndices=[],this._allOutputNames=[],this._nodes=[];const i=new Map,p=[];for(let i=0;i<e.inputsLength();i++){const a=e.inputs(i);if(o.has(a))throw new Error(`duplicated input name: ${a}`);for(let i=0;i<e.nodeArgsLength();i++)if((null===(t=e.nodeArgs(i))||void 0===t?void 0:t.name())===a){const t=new l;if((null===(r=null===(n=e.nodeArgs(i))||void 0===n?void 0:n.type())||void 0===r?void 0:r.valueType())!==u.TypeInfoValue.tensor_type)throw new Error("Unexpected value type for the nodeArg.");const c=e.nodeArgs(i).type().value(new u.TensorTypeAndShape),d=s.ProtoUtil.tensorDataTypeFromProto(c.elemType()),f=c.shape(),h=[];for(let e=0;e<f.dimLength();e++)h.push(s.LongUtil.longToNumber(f.dim(e).value().dimValue()));t.type={shape:{dims:h},tensorType:d};const g=this._allData.push(t)-1;o.set(a,g),p.push(a)}}for(let t=0;t<e.initializersLength();t++){const n=e.initializers(t);let r=o.get(n.name());if(void 0===r){const e=new l,t=s.ProtoUtil.tensorDimsFromORTFormat(n),i=s.ProtoUtil.tensorDataTypeFromProto(n.dataType());e.type={shape:{dims:t},tensorType:i},r=this._allData.push(e)-1,o.set(n.name(),r)}this._allData[r]._from=-1,this._allData[r].tensor=a.Tensor.fromOrtTensor(n)}for(let e=0;e<this._allData.length;e++)this._allData[e].tensor||(this._allInputIndices.push(e),this._allInputNames.push(p[e]));for(let t=0;t<e.outputsLength();t++){const n=e.outputs(t);if(o.has(n))throw new Error(`duplicated output name: ${n}`);const r=this._allData.push(new l)-1;o.set(n,r),this._allOutputIndices.push(r),this._allOutputNames.push(n)}if(!e.nodes)throw new Error("missing information in graph: node");for(let t=0;t<e.nodesLength();t++){const n=e.nodes(t);let r=n.name();if(!r)for(let e=0;r=`unnamed_${n.opType()}_${e}`,i.has(r);e++);if(i.has(r))throw new Error(`duplicated node name: ${r}`);const o=this._nodes.push(new c(n,r))-1;i.set(r,o)}for(let t=0;t<this._nodes.length;t++){const n=this._nodes[t],r=e.nodes(t);if(null==r)throw new Error(`No node exists at index ${t}`);if(0===(null==r?void 0:r.outputsLength()))throw new Error(`missing output for node: ${r.name}`);for(let e=0;e<(null==r?void 0:r.outputsLength());e++){const i=null==r?void 0:r.outputs(e);let s=o.get(i);if(void 0===s&&(s=this._allData.push(new l)-1,o.set(i,s)),n.outputs.push(s),void 0!==this._allData[s]._from)throw new Error(`multiple nodes output to one data value: ${s}`);if(this._allData[s]._from=t,"Constant"===r.opType()){if(1!==r.attributesLength()||!r.attributes(0).t())throw new Error("missing attributes or missing tensor value in attributes for this Constant operator");if(1!==r.outputsLength())throw new Error("missing output or incorrect number of outputs for this Constant operator");n.outputs.pop(),n.executeNode=!1,this._allData[s]._from=-1,this._allData[s].tensor=a.Tensor.fromOrtTensor(r.attributes(0).t())}}}for(let t=0;t<this._nodes.length;t++){const n=this._nodes[t],r=e.nodes(t);if(0===r.inputsLength())throw new Error(`missing input for node: ${r.name}`);for(let e=0;e<r.inputsLength();e++){const i=r.inputs(e),a=o.get(i);if(void 0===a)throw new Error(`unrecognized input '${i}' for node: ${r.name()}`);n.inputs.push(a),this._allData[a]._to.push(t)}}}checkIsAcyclic(){const e=new Set;this._allInputIndices.forEach((t=>{this._allData[t]._to.forEach((t=>{e.add(t)}))}));const t=Array.from(e),n=new Array(this._nodes.length).fill("white");for(;t.length>0;){const e=t.pop();"gray"===n[e]?n[e]="black":(t.push(e),n[e]="gray",this._nodes[e].outputs.forEach((r=>{const o=this._allData[r];if(void 0!==o.tensor)throw new Error("node outputs should not be initialized");if(o._from!==e)throw new Error("from property of the Value object doesn't match index of Node being processed");o._to.forEach((e=>{if("gray"===n[e])throw new Error("model graph is cyclic");"white"===n[e]&&t.push(e)}))})))}}transformGraph(e){this.removeAllIdentityNodes(),this.removeAllDropoutNodes(),this.fuseConvActivationNodes(),e&&e.transformGraph(this),this.finalizeGraph()}finalizeGraph(){let e=0;const t=new Array(this._nodes.length,0);let n=0;for(let e=0;e<this._nodes.length;e++)t[e]=n,this._nodes[e].executeNode?(n!==e&&(this._nodes[n]=this._nodes[e]),n++):this._nodes[e].outputs.forEach((e=>{this._allData[e]._from=-2}));this._nodes.splice(n,this._nodes.length-n);for(let e=0;e<this._allData.length;e++){const n=this._allData[e];void 0!==n._from&&-1!==n._from&&-2!==n._from&&(n._from=t[n._from]);for(let e=0;e<n._to.length;e++){if(!(n._to[e]>=0))throw new Error("Trying to update a removed node");n._to[e]=t[n._to[e]]}}e=0;for(let t=0;t<this._allData.length;t++)if(-2!==this._allData[t].from||-1!==this._allOutputIndices.indexOf(t+e)){if(e>0){let n=-1;void 0!==this._allData[t].from&&-1!==this._allData[t].from?(n=this._nodes[this._allData[t].from].outputs.indexOf(t+e),-1!==n&&(this._nodes[this._allData[t].from].outputs[n]=t)):(n=this._allInputIndices.indexOf(t+e),-1!==n&&(this._allInputIndices[n]=t)),this._allData[t].to.forEach((r=>{n=this._nodes[r].inputs.indexOf(t+e),-1!==n&&(this._nodes[r].inputs[n]=t)})),0===this._allData[t].to.length&&(n=this._allOutputIndices.indexOf(t+e),-1!==n&&(this._allOutputIndices[n]=t))}}else e++,this._allData.splice(t,1),t--}deleteNode(e){const t=this._nodes[e];if(t.outputs.length>1)for(let e=1;e<t.outputs.length;e++)if(this._allData[t.outputs[e]].to.length>0)throw new Error("Node deletion with more than one output connected to other nodes is not supported. ");t.executeNode=!1;const n=t.inputs[0],r=t.outputs[0],o=this._allData[r].to;for(let n=0;n<t.inputs.length;n++){const r=this._allData[t.inputs[n]].to.indexOf(e);if(-1===r)throw new Error("The Value object doesn't have the current Node in it's 'to' property ");this._allData[t.inputs[n]].to.splice(r,1)}this._allData[r]._to=[];const i=this._allOutputIndices.indexOf(r);if(-1!==i&&(this._allOutputIndices[i]=n),o&&o.length>0)for(const e of o){const t=this._nodes[e].inputs.indexOf(r);if(-1===t)throw new Error("The Node object doesn't have the output Value in it's 'inputs' property ");this._nodes[e].inputs[t]=n,this._allData[n].to.push(e)}}removeAllDropoutNodes(){let e=0;for(const t of this._nodes){if("Dropout"===t.opType){if(1!==t.inputs.length)throw new Error("Dropout nodes should only contain one input. ");if(1!==t.outputs.length&&2!==t.outputs.length)throw new Error("Dropout nodes should contain either 1 or 2 output(s)");if(2===t.outputs.length&&0!==this._allData[t.outputs[1]]._to.length)throw new Error("Dropout nodes's second output should not be referenced by other nodes");this.deleteNode(e)}e++}}removeAllIdentityNodes(){let e=0;for(const t of this._nodes)"Identity"===t.opType&&this.deleteNode(e),e++}isActivation(e){switch(e.opType){case"Relu":case"Sigmoid":case"Clip":return!0;default:return!1}}fuseConvActivationNodes(){for(const e of this._nodes)if("Conv"===e.opType){const t=this._allData[e.outputs[0]]._to;if(1===t.length&&this.isActivation(this._nodes[t[0]])){const n=this._nodes[t[0]];if("Clip"===n.opType)if(1===n.inputs.length)try{e.attributes.set("activation_params","floats",[n.attributes.getFloat("min"),n.attributes.getFloat("max")])}catch(t){e.attributes.set("activation_params","floats",[s.MIN_CLIP,s.MAX_CLIP])}else{if(!(n.inputs.length>=3&&void 0!==this._allData[n.inputs[1]].tensor&&void 0!==this._allData[n.inputs[2]].tensor))continue;e.attributes.set("activation_params","floats",[this._allData[n.inputs[1]].tensor.floatData[0],this._allData[n.inputs[2]].tensor.floatData[0]])}e.attributes.set("activation","string",n.opType),this.deleteNode(t[0])}}}}},1315:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.now=t.Profiler=t.Logger=void 0;const n={verbose:1e3,info:2e3,warning:4e3,error:5e3,fatal:6e3},r={none:new class{log(e,t,n){}},console:new class{log(e,t,n){console.log(`${this.color(e)} ${n?"[35m"+n+"[0m ":""}${t}`)}color(e){switch(e){case"verbose":return"[34;40mv[0m";case"info":return"[32mi[0m";case"warning":return"[30;43mw[0m";case"error":return"[31;40me[0m";case"fatal":return"[101mf[0m";default:throw new Error(`unsupported severity: ${e}`)}}}},o={provider:"console",minimalSeverity:"warning",logDateTime:!0,logSourceLocation:!1};let i={"":o};function a(e,t,n,r){if(void 0===t)return o=e,{verbose:a.verbose.bind(null,o),info:a.info.bind(null,o),warning:a.warning.bind(null,o),error:a.error.bind(null,o),fatal:a.fatal.bind(null,o)};if(void 0===n)s(e,t);else if("number"==typeof n&&void 0===r)s(e,t);else if("string"==typeof n&&void 0===r)s(e,n,0,t);else{if("string"!=typeof n||"number"!=typeof r)throw new TypeError("input is valid");s(e,n,0,t)}var o}function s(e,t,o,a){const s=i[a||""]||i[""];n[e]<n[s.minimalSeverity]||(s.logDateTime&&(t=`${(new Date).toISOString()}|${t}`),s.logSourceLocation,r[s.provider].log(e,t,a))}!function(e){function t(e){i={},n("",e||{})}function n(e,n){if("*"===e)t(n);else{const t=i[e]||o;i[e]={provider:n.provider||t.provider,minimalSeverity:n.minimalSeverity||t.minimalSeverity,logDateTime:void 0===n.logDateTime?t.logDateTime:n.logDateTime,logSourceLocation:void 0===n.logSourceLocation?t.logSourceLocation:n.logSourceLocation}}}e.verbose=function(t,n){e("verbose",t,n)},e.info=function(t,n){e("info",t,n)},e.warning=function(t,n){e("warning",t,n)},e.error=function(t,n){e("error",t,n)},e.fatal=function(t,n){e("fatal",t,n)},e.reset=t,e.set=n,e.setWithEnv=function(e){const t={};e.logLevel&&(t.minimalSeverity=e.logLevel),n("",t)}}(a||(a={})),t.Logger=a;class u{constructor(e,t,n,r,o,i){this.category=e,this.name=t,this.startTime=n,this.endCallback=r,this.timer=o,this.ctx=i}async end(){return this.endCallback(this)}async checkTimer(){if(void 0===this.ctx||void 0===this.timer)throw new Error("No webgl timer found");return this.ctx.endTimer(),this.ctx.waitForQueryAndGetTime(this.timer)}}class l{constructor(e,t,n,r){this.category=e,this.name=t,this.startTime=n,this.endTime=r}}t.Profiler=class{static create(e){return void 0===e?new this:new this(e.maxNumberEvents,e.flushBatchSize,e.flushIntervalInMilliseconds)}constructor(e,t,n){this._started=!1,this._flushPointer=0,this._started=!1,this._maxNumberEvents=void 0===e?1e4:e,this._flushBatchSize=void 0===t?10:t,this._flushIntervalInMilliseconds=void 0===n?5e3:n}start(){this._started=!0,this._timingEvents=[],this._flushTime=(0,t.now)(),this._flushPointer=0}stop(){for(this._started=!1;this._flushPointer<this._timingEvents.length;this._flushPointer++)this.logOneEvent(this._timingEvents[this._flushPointer])}event(e,t,n,r){const o=this._started?this.begin(e,t,r):void 0;let i=!1;const a=n();if(a&&"function"==typeof a.then)return i=!0,new Promise(((e,t)=>{a.then((async t=>{o&&await o.end(),e(t)}),(async e=>{o&&await o.end(),t(e)}))}));if(!i&&o){const e=o.end();if(e&&"function"==typeof e.then)return new Promise(((t,n)=>{e.then((()=>{t(a)}),(e=>{n(e)}))}))}return a}begin(e,n,r){if(!this._started)throw new Error("profiler is not started yet");if(void 0===r){const r=(0,t.now)();return this.flush(r),new u(e,n,r,(e=>this.endSync(e)))}{const t=r.beginTimer();return new u(e,n,0,(async e=>this.end(e)),t,r)}}async end(e){const t=await e.checkTimer();this._timingEvents.length<this._maxNumberEvents&&(this._timingEvents.push(new l(e.category,e.name,e.startTime,t)),this.flush(t))}endSync(e){const n=(0,t.now)();this._timingEvents.length<this._maxNumberEvents&&(this._timingEvents.push(new l(e.category,e.name,e.startTime,n)),this.flush(n))}logOneEvent(e){t.Logger.verbose(`Profiler.${e.category}`,`${(e.endTime-e.startTime).toFixed(2)}ms on event '${e.name}' at ${e.endTime.toFixed(2)}`)}flush(e){if(this._timingEvents.length-this._flushPointer>=this._flushBatchSize||e-this._flushTime>=this._flushIntervalInMilliseconds){for(const e=this._flushPointer;this._flushPointer<e+this._flushBatchSize&&this._flushPointer<this._timingEvents.length;this._flushPointer++)this.logOneEvent(this._timingEvents[this._flushPointer]);this._flushTime=(0,t.now)()}}get started(){return this._started}},t.now="undefined"!=typeof performance&&performance.now?()=>performance.now():Date.now},1745:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Model=void 0;const r=n(5686),o=n(1446),i=n(4662),a=n(1287),s=n(7273);var u=a.onnxruntime.experimental.fbs;t.Model=class{constructor(){}load(e,t,n){if(!n)try{return void this.loadFromOnnxFormat(e,t)}catch(e){if(void 0!==n)throw e}this.loadFromOrtFormat(e,t)}loadFromOnnxFormat(e,t){const n=o.onnx.ModelProto.decode(e);if(s.LongUtil.longToNumber(n.irVersion)<3)throw new Error("only support ONNX model with IR_VERSION>=3");this._opsets=n.opsetImport.map((e=>({domain:e.domain,version:s.LongUtil.longToNumber(e.version)}))),this._graph=i.Graph.from(n.graph,t)}loadFromOrtFormat(e,t){const n=new r.flatbuffers.ByteBuffer(e),o=u.InferenceSession.getRootAsInferenceSession(n).model();if(s.LongUtil.longToNumber(o.irVersion())<3)throw new Error("only support ONNX model with IR_VERSION>=3");this._opsets=[];for(let e=0;e<o.opsetImportLength();e++){const t=o.opsetImport(e);this._opsets.push({domain:null==t?void 0:t.domain(),version:s.LongUtil.longToNumber(t.version())})}this._graph=i.Graph.from(o.graph(),t)}get graph(){return this._graph}get opsets(){return this._opsets}}},6145:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.FLOAT_TYPES=t.INT_TYPES=t.NUMBER_TYPES=void 0,t.NUMBER_TYPES=["float32","float64","int32","int16","int8","uint16","uint32","uint8"],t.INT_TYPES=["int32","int16","int8","uint16","uint32","uint8"],t.FLOAT_TYPES=["float32","float64"]},5881:(e,t)=>{"use strict";function n(e,t){if(t.endsWith("+")){const n=Number.parseInt(t.substring(0,t.length-1),10);return!isNaN(n)&&n<=e}if(2===t.split("-").length){const n=t.split("-"),r=Number.parseInt(n[0],10),o=Number.parseInt(n[1],10);return!isNaN(r)&&!isNaN(o)&&r<=e&&e<=o}return Number.parseInt(t,10)===e}Object.defineProperty(t,"__esModule",{value:!0}),t.resolveOperator=void 0,t.resolveOperator=function(e,t,r){for(const o of r){const r=o[0],i=o[1],a=o[2],s=o[3],u=o[4];if(e.opType===r)for(const e of t)if((e.domain===i||"ai.onnx"===e.domain&&""===i)&&n(e.version,a))return{opImpl:s,opInit:u}}throw new TypeError(`cannot resolve operator '${e.opType}' with opsets: ${t.map((e=>`${e.domain||"ai.onnx"} v${e.version}`)).join(", ")}`)}},1287:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.onnxruntime=void 0;const r=n(5686);var o,i;o=t.onnxruntime||(t.onnxruntime={}),function(e){let t;!function(e){e[e.UNDEFINED=0]="UNDEFINED",e[e.FLOAT=1]="FLOAT",e[e.INT=2]="INT",e[e.STRING=3]="STRING",e[e.TENSOR=4]="TENSOR",e[e.GRAPH=5]="GRAPH",e[e.FLOATS=6]="FLOATS",e[e.INTS=7]="INTS",e[e.STRINGS=8]="STRINGS",e[e.TENSORS=9]="TENSORS",e[e.GRAPHS=10]="GRAPHS",e[e.SPARSE_TENSOR=11]="SPARSE_TENSOR",e[e.SPARSE_TENSORS=12]="SPARSE_TENSORS"}(t=e.AttributeType||(e.AttributeType={}))}((i=o.experimental||(o.experimental={})).fbs||(i.fbs={})),function(e){!function(e){!function(e){let t;!function(e){e[e.UNKNOWN=0]="UNKNOWN",e[e.VALUE=1]="VALUE",e[e.PARAM=2]="PARAM"}(t=e.DimensionValueType||(e.DimensionValueType={}))}(e.fbs||(e.fbs={}))}(e.experimental||(e.experimental={}))}(t.onnxruntime||(t.onnxruntime={})),function(e){!function(e){!function(e){let t;!function(e){e[e.UNDEFINED=0]="UNDEFINED",e[e.FLOAT=1]="FLOAT",e[e.UINT8=2]="UINT8",e[e.INT8=3]="INT8",e[e.UINT16=4]="UINT16",e[e.INT16=5]="INT16",e[e.INT32=6]="INT32",e[e.INT64=7]="INT64",e[e.STRING=8]="STRING",e[e.BOOL=9]="BOOL",e[e.FLOAT16=10]="FLOAT16",e[e.DOUBLE=11]="DOUBLE",e[e.UINT32=12]="UINT32",e[e.UINT64=13]="UINT64",e[e.COMPLEX64=14]="COMPLEX64",e[e.COMPLEX128=15]="COMPLEX128",e[e.BFLOAT16=16]="BFLOAT16"}(t=e.TensorDataType||(e.TensorDataType={}))}(e.fbs||(e.fbs={}))}(e.experimental||(e.experimental={}))}(t.onnxruntime||(t.onnxruntime={})),function(e){!function(e){!function(e){let t;!function(e){e[e.Primitive=0]="Primitive",e[e.Fused=1]="Fused"}(t=e.NodeType||(e.NodeType={}))}(e.fbs||(e.fbs={}))}(e.experimental||(e.experimental={}))}(t.onnxruntime||(t.onnxruntime={})),function(e){!function(e){!function(e){let t;!function(e){e[e.NONE=0]="NONE",e[e.tensor_type=1]="tensor_type",e[e.sequence_type=2]="sequence_type",e[e.map_type=3]="map_type"}(t=e.TypeInfoValue||(e.TypeInfoValue={}))}(e.fbs||(e.fbs={}))}(e.experimental||(e.experimental={}))}(t.onnxruntime||(t.onnxruntime={})),function(e){!function(t){!function(t){class n{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsShape(e,t){return(t||new n).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsShape(e,t){return e.setPosition(e.position()+r.flatbuffers.SIZE_PREFIX_LENGTH),(t||new n).__init(e.readInt32(e.position())+e.position(),e)}dim(t,n){let r=this.bb.__offset(this.bb_pos,4);return r?(n||new e.experimental.fbs.Dimension).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+r)+4*t),this.bb):null}dimLength(){let e=this.bb.__offset(this.bb_pos,4);return e?this.bb.__vector_len(this.bb_pos+e):0}static startShape(e){e.startObject(1)}static addDim(e,t){e.addFieldOffset(0,t,0)}static createDimVector(e,t){e.startVector(4,t.length,4);for(let n=t.length-1;n>=0;n--)e.addOffset(t[n]);return e.endVector()}static startDimVector(e,t){e.startVector(4,t,4)}static endShape(e){return e.endObject()}static createShape(e,t){return n.startShape(e),n.addDim(e,t),n.endShape(e)}}t.Shape=n}(t.fbs||(t.fbs={}))}(e.experimental||(e.experimental={}))}(t.onnxruntime||(t.onnxruntime={})),function(e){!function(t){!function(t){class n{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsDimension(e,t){return(t||new n).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsDimension(e,t){return e.setPosition(e.position()+r.flatbuffers.SIZE_PREFIX_LENGTH),(t||new n).__init(e.readInt32(e.position())+e.position(),e)}value(t){let n=this.bb.__offset(this.bb_pos,4);return n?(t||new e.experimental.fbs.DimensionValue).__init(this.bb.__indirect(this.bb_pos+n),this.bb):null}denotation(e){let t=this.bb.__offset(this.bb_pos,6);return t?this.bb.__string(this.bb_pos+t,e):null}static startDimension(e){e.startObject(2)}static addValue(e,t){e.addFieldOffset(0,t,0)}static addDenotation(e,t){e.addFieldOffset(1,t,0)}static endDimension(e){return e.endObject()}static createDimension(e,t,r){return n.startDimension(e),n.addValue(e,t),n.addDenotation(e,r),n.endDimension(e)}}t.Dimension=n}(t.fbs||(t.fbs={}))}(e.experimental||(e.experimental={}))}(t.onnxruntime||(t.onnxruntime={})),function(e){!function(t){!function(t){class n{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsDimensionValue(e,t){return(t||new n).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsDimensionValue(e,t){return e.setPosition(e.position()+r.flatbuffers.SIZE_PREFIX_LENGTH),(t||new n).__init(e.readInt32(e.position())+e.position(),e)}dimType(){let t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt8(this.bb_pos+t):e.experimental.fbs.DimensionValueType.UNKNOWN}dimValue(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.readInt64(this.bb_pos+e):this.bb.createLong(0,0)}dimParam(e){let t=this.bb.__offset(this.bb_pos,8);return t?this.bb.__string(this.bb_pos+t,e):null}static startDimensionValue(e){e.startObject(3)}static addDimType(t,n){t.addFieldInt8(0,n,e.experimental.fbs.DimensionValueType.UNKNOWN)}static addDimValue(e,t){e.addFieldInt64(1,t,e.createLong(0,0))}static addDimParam(e,t){e.addFieldOffset(2,t,0)}static endDimensionValue(e){return e.endObject()}static createDimensionValue(e,t,r,o){return n.startDimensionValue(e),n.addDimType(e,t),n.addDimValue(e,r),n.addDimParam(e,o),n.endDimensionValue(e)}}t.DimensionValue=n}(t.fbs||(t.fbs={}))}(e.experimental||(e.experimental={}))}(t.onnxruntime||(t.onnxruntime={})),function(e){!function(t){!function(t){class n{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsTensorTypeAndShape(e,t){return(t||new n).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsTensorTypeAndShape(e,t){return e.setPosition(e.position()+r.flatbuffers.SIZE_PREFIX_LENGTH),(t||new n).__init(e.readInt32(e.position())+e.position(),e)}elemType(){let t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt32(this.bb_pos+t):e.experimental.fbs.TensorDataType.UNDEFINED}shape(t){let n=this.bb.__offset(this.bb_pos,6);return n?(t||new e.experimental.fbs.Shape).__init(this.bb.__indirect(this.bb_pos+n),this.bb):null}static startTensorTypeAndShape(e){e.startObject(2)}static addElemType(t,n){t.addFieldInt32(0,n,e.experimental.fbs.TensorDataType.UNDEFINED)}static addShape(e,t){e.addFieldOffset(1,t,0)}static endTensorTypeAndShape(e){return e.endObject()}static createTensorTypeAndShape(e,t,r){return n.startTensorTypeAndShape(e),n.addElemType(e,t),n.addShape(e,r),n.endTensorTypeAndShape(e)}}t.TensorTypeAndShape=n}(t.fbs||(t.fbs={}))}(e.experimental||(e.experimental={}))}(t.onnxruntime||(t.onnxruntime={})),function(e){!function(t){!function(t){class n{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsMapType(e,t){return(t||new n).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsMapType(e,t){return e.setPosition(e.position()+r.flatbuffers.SIZE_PREFIX_LENGTH),(t||new n).__init(e.readInt32(e.position())+e.position(),e)}keyType(){let t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readInt32(this.bb_pos+t):e.experimental.fbs.TensorDataType.UNDEFINED}valueType(t){let n=this.bb.__offset(this.bb_pos,6);return n?(t||new e.experimental.fbs.TypeInfo).__init(this.bb.__indirect(this.bb_pos+n),this.bb):null}static startMapType(e){e.startObject(2)}static addKeyType(t,n){t.addFieldInt32(0,n,e.experimental.fbs.TensorDataType.UNDEFINED)}static addValueType(e,t){e.addFieldOffset(1,t,0)}static endMapType(e){return e.endObject()}static createMapType(e,t,r){return n.startMapType(e),n.addKeyType(e,t),n.addValueType(e,r),n.endMapType(e)}}t.MapType=n}(t.fbs||(t.fbs={}))}(e.experimental||(e.experimental={}))}(t.onnxruntime||(t.onnxruntime={})),function(e){!function(t){!function(t){class n{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsSequenceType(e,t){return(t||new n).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsSequenceType(e,t){return e.setPosition(e.position()+r.flatbuffers.SIZE_PREFIX_LENGTH),(t||new n).__init(e.readInt32(e.position())+e.position(),e)}elemType(t){let n=this.bb.__offset(this.bb_pos,4);return n?(t||new e.experimental.fbs.TypeInfo).__init(this.bb.__indirect(this.bb_pos+n),this.bb):null}static startSequenceType(e){e.startObject(1)}static addElemType(e,t){e.addFieldOffset(0,t,0)}static endSequenceType(e){return e.endObject()}static createSequenceType(e,t){return n.startSequenceType(e),n.addElemType(e,t),n.endSequenceType(e)}}t.SequenceType=n}(t.fbs||(t.fbs={}))}(e.experimental||(e.experimental={}))}(t.onnxruntime||(t.onnxruntime={})),function(e){!function(e){(e.fbs||(e.fbs={})).EdgeEnd=class{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}nodeIndex(){return this.bb.readUint32(this.bb_pos)}srcArgIndex(){return this.bb.readInt32(this.bb_pos+4)}dstArgIndex(){return this.bb.readInt32(this.bb_pos+8)}static createEdgeEnd(e,t,n,r){return e.prep(4,12),e.writeInt32(r),e.writeInt32(n),e.writeInt32(t),e.offset()}}}(e.experimental||(e.experimental={}))}(t.onnxruntime||(t.onnxruntime={})),function(e){!function(t){!function(t){class n{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsNodeEdge(e,t){return(t||new n).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsNodeEdge(e,t){return e.setPosition(e.position()+r.flatbuffers.SIZE_PREFIX_LENGTH),(t||new n).__init(e.readInt32(e.position())+e.position(),e)}nodeIndex(){let e=this.bb.__offset(this.bb_pos,4);return e?this.bb.readUint32(this.bb_pos+e):0}inputEdges(t,n){let r=this.bb.__offset(this.bb_pos,6);return r?(n||new e.experimental.fbs.EdgeEnd).__init(this.bb.__vector(this.bb_pos+r)+12*t,this.bb):null}inputEdgesLength(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.__vector_len(this.bb_pos+e):0}outputEdges(t,n){let r=this.bb.__offset(this.bb_pos,8);return r?(n||new e.experimental.fbs.EdgeEnd).__init(this.bb.__vector(this.bb_pos+r)+12*t,this.bb):null}outputEdgesLength(){let e=this.bb.__offset(this.bb_pos,8);return e?this.bb.__vector_len(this.bb_pos+e):0}static startNodeEdge(e){e.startObject(3)}static addNodeIndex(e,t){e.addFieldInt32(0,t,0)}static addInputEdges(e,t){e.addFieldOffset(1,t,0)}static startInputEdgesVector(e,t){e.startVector(12,t,4)}static addOutputEdges(e,t){e.addFieldOffset(2,t,0)}static startOutputEdgesVector(e,t){e.startVector(12,t,4)}static endNodeEdge(e){return e.endObject()}static createNodeEdge(e,t,r,o){return n.startNodeEdge(e),n.addNodeIndex(e,t),n.addInputEdges(e,r),n.addOutputEdges(e,o),n.endNodeEdge(e)}}t.NodeEdge=n}(t.fbs||(t.fbs={}))}(e.experimental||(e.experimental={}))}(t.onnxruntime||(t.onnxruntime={})),function(e){!function(t){!function(t){class n{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsNode(e,t){return(t||new n).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsNode(e,t){return e.setPosition(e.position()+r.flatbuffers.SIZE_PREFIX_LENGTH),(t||new n).__init(e.readInt32(e.position())+e.position(),e)}name(e){let t=this.bb.__offset(this.bb_pos,4);return t?this.bb.__string(this.bb_pos+t,e):null}docString(e){let t=this.bb.__offset(this.bb_pos,6);return t?this.bb.__string(this.bb_pos+t,e):null}domain(e){let t=this.bb.__offset(this.bb_pos,8);return t?this.bb.__string(this.bb_pos+t,e):null}sinceVersion(){let e=this.bb.__offset(this.bb_pos,10);return e?this.bb.readInt32(this.bb_pos+e):0}index(){let e=this.bb.__offset(this.bb_pos,12);return e?this.bb.readUint32(this.bb_pos+e):0}opType(e){let t=this.bb.__offset(this.bb_pos,14);return t?this.bb.__string(this.bb_pos+t,e):null}type(){let t=this.bb.__offset(this.bb_pos,16);return t?this.bb.readInt32(this.bb_pos+t):e.experimental.fbs.NodeType.Primitive}executionProviderType(e){let t=this.bb.__offset(this.bb_pos,18);return t?this.bb.__string(this.bb_pos+t,e):null}inputs(e,t){let n=this.bb.__offset(this.bb_pos,20);return n?this.bb.__string(this.bb.__vector(this.bb_pos+n)+4*e,t):null}inputsLength(){let e=this.bb.__offset(this.bb_pos,20);return e?this.bb.__vector_len(this.bb_pos+e):0}outputs(e,t){let n=this.bb.__offset(this.bb_pos,22);return n?this.bb.__string(this.bb.__vector(this.bb_pos+n)+4*e,t):null}outputsLength(){let e=this.bb.__offset(this.bb_pos,22);return e?this.bb.__vector_len(this.bb_pos+e):0}attributes(t,n){let r=this.bb.__offset(this.bb_pos,24);return r?(n||new e.experimental.fbs.Attribute).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+r)+4*t),this.bb):null}attributesLength(){let e=this.bb.__offset(this.bb_pos,24);return e?this.bb.__vector_len(this.bb_pos+e):0}inputArgCounts(e){let t=this.bb.__offset(this.bb_pos,26);return t?this.bb.readInt32(this.bb.__vector(this.bb_pos+t)+4*e):0}inputArgCountsLength(){let e=this.bb.__offset(this.bb_pos,26);return e?this.bb.__vector_len(this.bb_pos+e):0}inputArgCountsArray(){let e=this.bb.__offset(this.bb_pos,26);return e?new Int32Array(this.bb.bytes().buffer,this.bb.bytes().byteOffset+this.bb.__vector(this.bb_pos+e),this.bb.__vector_len(this.bb_pos+e)):null}implicitInputs(e,t){let n=this.bb.__offset(this.bb_pos,28);return n?this.bb.__string(this.bb.__vector(this.bb_pos+n)+4*e,t):null}implicitInputsLength(){let e=this.bb.__offset(this.bb_pos,28);return e?this.bb.__vector_len(this.bb_pos+e):0}static startNode(e){e.startObject(13)}static addName(e,t){e.addFieldOffset(0,t,0)}static addDocString(e,t){e.addFieldOffset(1,t,0)}static addDomain(e,t){e.addFieldOffset(2,t,0)}static addSinceVersion(e,t){e.addFieldInt32(3,t,0)}static addIndex(e,t){e.addFieldInt32(4,t,0)}static addOpType(e,t){e.addFieldOffset(5,t,0)}static addType(t,n){t.addFieldInt32(6,n,e.experimental.fbs.NodeType.Primitive)}static addExecutionProviderType(e,t){e.addFieldOffset(7,t,0)}static addInputs(e,t){e.addFieldOffset(8,t,0)}static createInputsVector(e,t){e.startVector(4,t.length,4);for(let n=t.length-1;n>=0;n--)e.addOffset(t[n]);return e.endVector()}static startInputsVector(e,t){e.startVector(4,t,4)}static addOutputs(e,t){e.addFieldOffset(9,t,0)}static createOutputsVector(e,t){e.startVector(4,t.length,4);for(let n=t.length-1;n>=0;n--)e.addOffset(t[n]);return e.endVector()}static startOutputsVector(e,t){e.startVector(4,t,4)}static addAttributes(e,t){e.addFieldOffset(10,t,0)}static createAttributesVector(e,t){e.startVector(4,t.length,4);for(let n=t.length-1;n>=0;n--)e.addOffset(t[n]);return e.endVector()}static startAttributesVector(e,t){e.startVector(4,t,4)}static addInputArgCounts(e,t){e.addFieldOffset(11,t,0)}static createInputArgCountsVector(e,t){e.startVector(4,t.length,4);for(let n=t.length-1;n>=0;n--)e.addInt32(t[n]);return e.endVector()}static startInputArgCountsVector(e,t){e.startVector(4,t,4)}static addImplicitInputs(e,t){e.addFieldOffset(12,t,0)}static createImplicitInputsVector(e,t){e.startVector(4,t.length,4);for(let n=t.length-1;n>=0;n--)e.addOffset(t[n]);return e.endVector()}static startImplicitInputsVector(e,t){e.startVector(4,t,4)}static endNode(e){return e.endObject()}static createNode(e,t,r,o,i,a,s,u,l,c,p,d,f,h){return n.startNode(e),n.addName(e,t),n.addDocString(e,r),n.addDomain(e,o),n.addSinceVersion(e,i),n.addIndex(e,a),n.addOpType(e,s),n.addType(e,u),n.addExecutionProviderType(e,l),n.addInputs(e,c),n.addOutputs(e,p),n.addAttributes(e,d),n.addInputArgCounts(e,f),n.addImplicitInputs(e,h),n.endNode(e)}}t.Node=n}(t.fbs||(t.fbs={}))}(e.experimental||(e.experimental={}))}(t.onnxruntime||(t.onnxruntime={})),function(e){!function(t){!function(t){class n{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsValueInfo(e,t){return(t||new n).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsValueInfo(e,t){return e.setPosition(e.position()+r.flatbuffers.SIZE_PREFIX_LENGTH),(t||new n).__init(e.readInt32(e.position())+e.position(),e)}name(e){let t=this.bb.__offset(this.bb_pos,4);return t?this.bb.__string(this.bb_pos+t,e):null}docString(e){let t=this.bb.__offset(this.bb_pos,6);return t?this.bb.__string(this.bb_pos+t,e):null}type(t){let n=this.bb.__offset(this.bb_pos,8);return n?(t||new e.experimental.fbs.TypeInfo).__init(this.bb.__indirect(this.bb_pos+n),this.bb):null}static startValueInfo(e){e.startObject(3)}static addName(e,t){e.addFieldOffset(0,t,0)}static addDocString(e,t){e.addFieldOffset(1,t,0)}static addType(e,t){e.addFieldOffset(2,t,0)}static endValueInfo(e){return e.endObject()}static createValueInfo(e,t,r,o){return n.startValueInfo(e),n.addName(e,t),n.addDocString(e,r),n.addType(e,o),n.endValueInfo(e)}}t.ValueInfo=n}(t.fbs||(t.fbs={}))}(e.experimental||(e.experimental={}))}(t.onnxruntime||(t.onnxruntime={})),function(e){!function(t){!function(t){class n{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsTypeInfo(e,t){return(t||new n).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsTypeInfo(e,t){return e.setPosition(e.position()+r.flatbuffers.SIZE_PREFIX_LENGTH),(t||new n).__init(e.readInt32(e.position())+e.position(),e)}denotation(e){let t=this.bb.__offset(this.bb_pos,4);return t?this.bb.__string(this.bb_pos+t,e):null}valueType(){let t=this.bb.__offset(this.bb_pos,6);return t?this.bb.readUint8(this.bb_pos+t):e.experimental.fbs.TypeInfoValue.NONE}value(e){let t=this.bb.__offset(this.bb_pos,8);return t?this.bb.__union(e,this.bb_pos+t):null}static startTypeInfo(e){e.startObject(3)}static addDenotation(e,t){e.addFieldOffset(0,t,0)}static addValueType(t,n){t.addFieldInt8(1,n,e.experimental.fbs.TypeInfoValue.NONE)}static addValue(e,t){e.addFieldOffset(2,t,0)}static endTypeInfo(e){return e.endObject()}static createTypeInfo(e,t,r,o){return n.startTypeInfo(e),n.addDenotation(e,t),n.addValueType(e,r),n.addValue(e,o),n.endTypeInfo(e)}}t.TypeInfo=n}(t.fbs||(t.fbs={}))}(e.experimental||(e.experimental={}))}(t.onnxruntime||(t.onnxruntime={})),function(e){!function(e){!function(e){class t{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsOperatorSetId(e,n){return(n||new t).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsOperatorSetId(e,n){return e.setPosition(e.position()+r.flatbuffers.SIZE_PREFIX_LENGTH),(n||new t).__init(e.readInt32(e.position())+e.position(),e)}domain(e){let t=this.bb.__offset(this.bb_pos,4);return t?this.bb.__string(this.bb_pos+t,e):null}version(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.readInt64(this.bb_pos+e):this.bb.createLong(0,0)}static startOperatorSetId(e){e.startObject(2)}static addDomain(e,t){e.addFieldOffset(0,t,0)}static addVersion(e,t){e.addFieldInt64(1,t,e.createLong(0,0))}static endOperatorSetId(e){return e.endObject()}static createOperatorSetId(e,n,r){return t.startOperatorSetId(e),t.addDomain(e,n),t.addVersion(e,r),t.endOperatorSetId(e)}}e.OperatorSetId=t}(e.fbs||(e.fbs={}))}(e.experimental||(e.experimental={}))}(t.onnxruntime||(t.onnxruntime={})),function(e){!function(t){!function(t){class n{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsTensor(e,t){return(t||new n).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsTensor(e,t){return e.setPosition(e.position()+r.flatbuffers.SIZE_PREFIX_LENGTH),(t||new n).__init(e.readInt32(e.position())+e.position(),e)}name(e){let t=this.bb.__offset(this.bb_pos,4);return t?this.bb.__string(this.bb_pos+t,e):null}docString(e){let t=this.bb.__offset(this.bb_pos,6);return t?this.bb.__string(this.bb_pos+t,e):null}dims(e){let t=this.bb.__offset(this.bb_pos,8);return t?this.bb.readInt64(this.bb.__vector(this.bb_pos+t)+8*e):this.bb.createLong(0,0)}dimsLength(){let e=this.bb.__offset(this.bb_pos,8);return e?this.bb.__vector_len(this.bb_pos+e):0}dataType(){let t=this.bb.__offset(this.bb_pos,10);return t?this.bb.readInt32(this.bb_pos+t):e.experimental.fbs.TensorDataType.UNDEFINED}rawData(e){let t=this.bb.__offset(this.bb_pos,12);return t?this.bb.readUint8(this.bb.__vector(this.bb_pos+t)+e):0}rawDataLength(){let e=this.bb.__offset(this.bb_pos,12);return e?this.bb.__vector_len(this.bb_pos+e):0}rawDataArray(){let e=this.bb.__offset(this.bb_pos,12);return e?new Uint8Array(this.bb.bytes().buffer,this.bb.bytes().byteOffset+this.bb.__vector(this.bb_pos+e),this.bb.__vector_len(this.bb_pos+e)):null}stringData(e,t){let n=this.bb.__offset(this.bb_pos,14);return n?this.bb.__string(this.bb.__vector(this.bb_pos+n)+4*e,t):null}stringDataLength(){let e=this.bb.__offset(this.bb_pos,14);return e?this.bb.__vector_len(this.bb_pos+e):0}static startTensor(e){e.startObject(6)}static addName(e,t){e.addFieldOffset(0,t,0)}static addDocString(e,t){e.addFieldOffset(1,t,0)}static addDims(e,t){e.addFieldOffset(2,t,0)}static createDimsVector(e,t){e.startVector(8,t.length,8);for(let n=t.length-1;n>=0;n--)e.addInt64(t[n]);return e.endVector()}static startDimsVector(e,t){e.startVector(8,t,8)}static addDataType(t,n){t.addFieldInt32(3,n,e.experimental.fbs.TensorDataType.UNDEFINED)}static addRawData(e,t){e.addFieldOffset(4,t,0)}static createRawDataVector(e,t){e.startVector(1,t.length,1);for(let n=t.length-1;n>=0;n--)e.addInt8(t[n]);return e.endVector()}static startRawDataVector(e,t){e.startVector(1,t,1)}static addStringData(e,t){e.addFieldOffset(5,t,0)}static createStringDataVector(e,t){e.startVector(4,t.length,4);for(let n=t.length-1;n>=0;n--)e.addOffset(t[n]);return e.endVector()}static startStringDataVector(e,t){e.startVector(4,t,4)}static endTensor(e){return e.endObject()}static createTensor(e,t,r,o,i,a,s){return n.startTensor(e),n.addName(e,t),n.addDocString(e,r),n.addDims(e,o),n.addDataType(e,i),n.addRawData(e,a),n.addStringData(e,s),n.endTensor(e)}}t.Tensor=n}(t.fbs||(t.fbs={}))}(e.experimental||(e.experimental={}))}(t.onnxruntime||(t.onnxruntime={})),function(e){!function(t){!function(t){class n{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsSparseTensor(e,t){return(t||new n).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsSparseTensor(e,t){return e.setPosition(e.position()+r.flatbuffers.SIZE_PREFIX_LENGTH),(t||new n).__init(e.readInt32(e.position())+e.position(),e)}values(t){let n=this.bb.__offset(this.bb_pos,4);return n?(t||new e.experimental.fbs.Tensor).__init(this.bb.__indirect(this.bb_pos+n),this.bb):null}indices(t){let n=this.bb.__offset(this.bb_pos,6);return n?(t||new e.experimental.fbs.Tensor).__init(this.bb.__indirect(this.bb_pos+n),this.bb):null}dims(e){let t=this.bb.__offset(this.bb_pos,8);return t?this.bb.readInt64(this.bb.__vector(this.bb_pos+t)+8*e):this.bb.createLong(0,0)}dimsLength(){let e=this.bb.__offset(this.bb_pos,8);return e?this.bb.__vector_len(this.bb_pos+e):0}static startSparseTensor(e){e.startObject(3)}static addValues(e,t){e.addFieldOffset(0,t,0)}static addIndices(e,t){e.addFieldOffset(1,t,0)}static addDims(e,t){e.addFieldOffset(2,t,0)}static createDimsVector(e,t){e.startVector(8,t.length,8);for(let n=t.length-1;n>=0;n--)e.addInt64(t[n]);return e.endVector()}static startDimsVector(e,t){e.startVector(8,t,8)}static endSparseTensor(e){return e.endObject()}static createSparseTensor(e,t,r,o){return n.startSparseTensor(e),n.addValues(e,t),n.addIndices(e,r),n.addDims(e,o),n.endSparseTensor(e)}}t.SparseTensor=n}(t.fbs||(t.fbs={}))}(e.experimental||(e.experimental={}))}(t.onnxruntime||(t.onnxruntime={})),function(e){!function(t){!function(t){class n{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsAttribute(e,t){return(t||new n).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsAttribute(e,t){return e.setPosition(e.position()+r.flatbuffers.SIZE_PREFIX_LENGTH),(t||new n).__init(e.readInt32(e.position())+e.position(),e)}name(e){let t=this.bb.__offset(this.bb_pos,4);return t?this.bb.__string(this.bb_pos+t,e):null}docString(e){let t=this.bb.__offset(this.bb_pos,6);return t?this.bb.__string(this.bb_pos+t,e):null}type(){let t=this.bb.__offset(this.bb_pos,8);return t?this.bb.readInt32(this.bb_pos+t):e.experimental.fbs.AttributeType.UNDEFINED}f(){let e=this.bb.__offset(this.bb_pos,10);return e?this.bb.readFloat32(this.bb_pos+e):0}i(){let e=this.bb.__offset(this.bb_pos,12);return e?this.bb.readInt64(this.bb_pos+e):this.bb.createLong(0,0)}s(e){let t=this.bb.__offset(this.bb_pos,14);return t?this.bb.__string(this.bb_pos+t,e):null}t(t){let n=this.bb.__offset(this.bb_pos,16);return n?(t||new e.experimental.fbs.Tensor).__init(this.bb.__indirect(this.bb_pos+n),this.bb):null}g(t){let n=this.bb.__offset(this.bb_pos,18);return n?(t||new e.experimental.fbs.Graph).__init(this.bb.__indirect(this.bb_pos+n),this.bb):null}floats(e){let t=this.bb.__offset(this.bb_pos,20);return t?this.bb.readFloat32(this.bb.__vector(this.bb_pos+t)+4*e):0}floatsLength(){let e=this.bb.__offset(this.bb_pos,20);return e?this.bb.__vector_len(this.bb_pos+e):0}floatsArray(){let e=this.bb.__offset(this.bb_pos,20);return e?new Float32Array(this.bb.bytes().buffer,this.bb.bytes().byteOffset+this.bb.__vector(this.bb_pos+e),this.bb.__vector_len(this.bb_pos+e)):null}ints(e){let t=this.bb.__offset(this.bb_pos,22);return t?this.bb.readInt64(this.bb.__vector(this.bb_pos+t)+8*e):this.bb.createLong(0,0)}intsLength(){let e=this.bb.__offset(this.bb_pos,22);return e?this.bb.__vector_len(this.bb_pos+e):0}strings(e,t){let n=this.bb.__offset(this.bb_pos,24);return n?this.bb.__string(this.bb.__vector(this.bb_pos+n)+4*e,t):null}stringsLength(){let e=this.bb.__offset(this.bb_pos,24);return e?this.bb.__vector_len(this.bb_pos+e):0}tensors(t,n){let r=this.bb.__offset(this.bb_pos,26);return r?(n||new e.experimental.fbs.Tensor).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+r)+4*t),this.bb):null}tensorsLength(){let e=this.bb.__offset(this.bb_pos,26);return e?this.bb.__vector_len(this.bb_pos+e):0}graphs(t,n){let r=this.bb.__offset(this.bb_pos,28);return r?(n||new e.experimental.fbs.Graph).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+r)+4*t),this.bb):null}graphsLength(){let e=this.bb.__offset(this.bb_pos,28);return e?this.bb.__vector_len(this.bb_pos+e):0}static startAttribute(e){e.startObject(13)}static addName(e,t){e.addFieldOffset(0,t,0)}static addDocString(e,t){e.addFieldOffset(1,t,0)}static addType(t,n){t.addFieldInt32(2,n,e.experimental.fbs.AttributeType.UNDEFINED)}static addF(e,t){e.addFieldFloat32(3,t,0)}static addI(e,t){e.addFieldInt64(4,t,e.createLong(0,0))}static addS(e,t){e.addFieldOffset(5,t,0)}static addT(e,t){e.addFieldOffset(6,t,0)}static addG(e,t){e.addFieldOffset(7,t,0)}static addFloats(e,t){e.addFieldOffset(8,t,0)}static createFloatsVector(e,t){e.startVector(4,t.length,4);for(let n=t.length-1;n>=0;n--)e.addFloat32(t[n]);return e.endVector()}static startFloatsVector(e,t){e.startVector(4,t,4)}static addInts(e,t){e.addFieldOffset(9,t,0)}static createIntsVector(e,t){e.startVector(8,t.length,8);for(let n=t.length-1;n>=0;n--)e.addInt64(t[n]);return e.endVector()}static startIntsVector(e,t){e.startVector(8,t,8)}static addStrings(e,t){e.addFieldOffset(10,t,0)}static createStringsVector(e,t){e.startVector(4,t.length,4);for(let n=t.length-1;n>=0;n--)e.addOffset(t[n]);return e.endVector()}static startStringsVector(e,t){e.startVector(4,t,4)}static addTensors(e,t){e.addFieldOffset(11,t,0)}static createTensorsVector(e,t){e.startVector(4,t.length,4);for(let n=t.length-1;n>=0;n--)e.addOffset(t[n]);return e.endVector()}static startTensorsVector(e,t){e.startVector(4,t,4)}static addGraphs(e,t){e.addFieldOffset(12,t,0)}static createGraphsVector(e,t){e.startVector(4,t.length,4);for(let n=t.length-1;n>=0;n--)e.addOffset(t[n]);return e.endVector()}static startGraphsVector(e,t){e.startVector(4,t,4)}static endAttribute(e){return e.endObject()}static createAttribute(e,t,r,o,i,a,s,u,l,c,p,d,f,h){return n.startAttribute(e),n.addName(e,t),n.addDocString(e,r),n.addType(e,o),n.addF(e,i),n.addI(e,a),n.addS(e,s),n.addT(e,u),n.addG(e,l),n.addFloats(e,c),n.addInts(e,p),n.addStrings(e,d),n.addTensors(e,f),n.addGraphs(e,h),n.endAttribute(e)}}t.Attribute=n}(t.fbs||(t.fbs={}))}(e.experimental||(e.experimental={}))}(t.onnxruntime||(t.onnxruntime={})),function(e){!function(t){!function(t){class n{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsGraph(e,t){return(t||new n).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsGraph(e,t){return e.setPosition(e.position()+r.flatbuffers.SIZE_PREFIX_LENGTH),(t||new n).__init(e.readInt32(e.position())+e.position(),e)}initializers(t,n){let r=this.bb.__offset(this.bb_pos,4);return r?(n||new e.experimental.fbs.Tensor).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+r)+4*t),this.bb):null}initializersLength(){let e=this.bb.__offset(this.bb_pos,4);return e?this.bb.__vector_len(this.bb_pos+e):0}nodeArgs(t,n){let r=this.bb.__offset(this.bb_pos,6);return r?(n||new e.experimental.fbs.ValueInfo).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+r)+4*t),this.bb):null}nodeArgsLength(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.__vector_len(this.bb_pos+e):0}nodes(t,n){let r=this.bb.__offset(this.bb_pos,8);return r?(n||new e.experimental.fbs.Node).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+r)+4*t),this.bb):null}nodesLength(){let e=this.bb.__offset(this.bb_pos,8);return e?this.bb.__vector_len(this.bb_pos+e):0}maxNodeIndex(){let e=this.bb.__offset(this.bb_pos,10);return e?this.bb.readUint32(this.bb_pos+e):0}nodeEdges(t,n){let r=this.bb.__offset(this.bb_pos,12);return r?(n||new e.experimental.fbs.NodeEdge).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+r)+4*t),this.bb):null}nodeEdgesLength(){let e=this.bb.__offset(this.bb_pos,12);return e?this.bb.__vector_len(this.bb_pos+e):0}inputs(e,t){let n=this.bb.__offset(this.bb_pos,14);return n?this.bb.__string(this.bb.__vector(this.bb_pos+n)+4*e,t):null}inputsLength(){let e=this.bb.__offset(this.bb_pos,14);return e?this.bb.__vector_len(this.bb_pos+e):0}outputs(e,t){let n=this.bb.__offset(this.bb_pos,16);return n?this.bb.__string(this.bb.__vector(this.bb_pos+n)+4*e,t):null}outputsLength(){let e=this.bb.__offset(this.bb_pos,16);return e?this.bb.__vector_len(this.bb_pos+e):0}sparseInitializers(t,n){let r=this.bb.__offset(this.bb_pos,18);return r?(n||new e.experimental.fbs.SparseTensor).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+r)+4*t),this.bb):null}sparseInitializersLength(){let e=this.bb.__offset(this.bb_pos,18);return e?this.bb.__vector_len(this.bb_pos+e):0}static startGraph(e){e.startObject(8)}static addInitializers(e,t){e.addFieldOffset(0,t,0)}static createInitializersVector(e,t){e.startVector(4,t.length,4);for(let n=t.length-1;n>=0;n--)e.addOffset(t[n]);return e.endVector()}static startInitializersVector(e,t){e.startVector(4,t,4)}static addNodeArgs(e,t){e.addFieldOffset(1,t,0)}static createNodeArgsVector(e,t){e.startVector(4,t.length,4);for(let n=t.length-1;n>=0;n--)e.addOffset(t[n]);return e.endVector()}static startNodeArgsVector(e,t){e.startVector(4,t,4)}static addNodes(e,t){e.addFieldOffset(2,t,0)}static createNodesVector(e,t){e.startVector(4,t.length,4);for(let n=t.length-1;n>=0;n--)e.addOffset(t[n]);return e.endVector()}static startNodesVector(e,t){e.startVector(4,t,4)}static addMaxNodeIndex(e,t){e.addFieldInt32(3,t,0)}static addNodeEdges(e,t){e.addFieldOffset(4,t,0)}static createNodeEdgesVector(e,t){e.startVector(4,t.length,4);for(let n=t.length-1;n>=0;n--)e.addOffset(t[n]);return e.endVector()}static startNodeEdgesVector(e,t){e.startVector(4,t,4)}static addInputs(e,t){e.addFieldOffset(5,t,0)}static createInputsVector(e,t){e.startVector(4,t.length,4);for(let n=t.length-1;n>=0;n--)e.addOffset(t[n]);return e.endVector()}static startInputsVector(e,t){e.startVector(4,t,4)}static addOutputs(e,t){e.addFieldOffset(6,t,0)}static createOutputsVector(e,t){e.startVector(4,t.length,4);for(let n=t.length-1;n>=0;n--)e.addOffset(t[n]);return e.endVector()}static startOutputsVector(e,t){e.startVector(4,t,4)}static addSparseInitializers(e,t){e.addFieldOffset(7,t,0)}static createSparseInitializersVector(e,t){e.startVector(4,t.length,4);for(let n=t.length-1;n>=0;n--)e.addOffset(t[n]);return e.endVector()}static startSparseInitializersVector(e,t){e.startVector(4,t,4)}static endGraph(e){return e.endObject()}static createGraph(e,t,r,o,i,a,s,u,l){return n.startGraph(e),n.addInitializers(e,t),n.addNodeArgs(e,r),n.addNodes(e,o),n.addMaxNodeIndex(e,i),n.addNodeEdges(e,a),n.addInputs(e,s),n.addOutputs(e,u),n.addSparseInitializers(e,l),n.endGraph(e)}}t.Graph=n}(t.fbs||(t.fbs={}))}(e.experimental||(e.experimental={}))}(t.onnxruntime||(t.onnxruntime={})),function(e){!function(t){!function(t){class n{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsModel(e,t){return(t||new n).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsModel(e,t){return e.setPosition(e.position()+r.flatbuffers.SIZE_PREFIX_LENGTH),(t||new n).__init(e.readInt32(e.position())+e.position(),e)}irVersion(){let e=this.bb.__offset(this.bb_pos,4);return e?this.bb.readInt64(this.bb_pos+e):this.bb.createLong(0,0)}opsetImport(t,n){let r=this.bb.__offset(this.bb_pos,6);return r?(n||new e.experimental.fbs.OperatorSetId).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+r)+4*t),this.bb):null}opsetImportLength(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.__vector_len(this.bb_pos+e):0}producerName(e){let t=this.bb.__offset(this.bb_pos,8);return t?this.bb.__string(this.bb_pos+t,e):null}producerVersion(e){let t=this.bb.__offset(this.bb_pos,10);return t?this.bb.__string(this.bb_pos+t,e):null}domain(e){let t=this.bb.__offset(this.bb_pos,12);return t?this.bb.__string(this.bb_pos+t,e):null}modelVersion(){let e=this.bb.__offset(this.bb_pos,14);return e?this.bb.readInt64(this.bb_pos+e):this.bb.createLong(0,0)}docString(e){let t=this.bb.__offset(this.bb_pos,16);return t?this.bb.__string(this.bb_pos+t,e):null}graph(t){let n=this.bb.__offset(this.bb_pos,18);return n?(t||new e.experimental.fbs.Graph).__init(this.bb.__indirect(this.bb_pos+n),this.bb):null}graphDocString(e){let t=this.bb.__offset(this.bb_pos,20);return t?this.bb.__string(this.bb_pos+t,e):null}static startModel(e){e.startObject(9)}static addIrVersion(e,t){e.addFieldInt64(0,t,e.createLong(0,0))}static addOpsetImport(e,t){e.addFieldOffset(1,t,0)}static createOpsetImportVector(e,t){e.startVector(4,t.length,4);for(let n=t.length-1;n>=0;n--)e.addOffset(t[n]);return e.endVector()}static startOpsetImportVector(e,t){e.startVector(4,t,4)}static addProducerName(e,t){e.addFieldOffset(2,t,0)}static addProducerVersion(e,t){e.addFieldOffset(3,t,0)}static addDomain(e,t){e.addFieldOffset(4,t,0)}static addModelVersion(e,t){e.addFieldInt64(5,t,e.createLong(0,0))}static addDocString(e,t){e.addFieldOffset(6,t,0)}static addGraph(e,t){e.addFieldOffset(7,t,0)}static addGraphDocString(e,t){e.addFieldOffset(8,t,0)}static endModel(e){return e.endObject()}static createModel(e,t,r,o,i,a,s,u,l,c){return n.startModel(e),n.addIrVersion(e,t),n.addOpsetImport(e,r),n.addProducerName(e,o),n.addProducerVersion(e,i),n.addDomain(e,a),n.addModelVersion(e,s),n.addDocString(e,u),n.addGraph(e,l),n.addGraphDocString(e,c),n.endModel(e)}}t.Model=n}(t.fbs||(t.fbs={}))}(e.experimental||(e.experimental={}))}(t.onnxruntime||(t.onnxruntime={})),function(e){!function(e){!function(e){class t{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsKernelCreateInfos(e,n){return(n||new t).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsKernelCreateInfos(e,n){return e.setPosition(e.position()+r.flatbuffers.SIZE_PREFIX_LENGTH),(n||new t).__init(e.readInt32(e.position())+e.position(),e)}nodeIndices(e){let t=this.bb.__offset(this.bb_pos,4);return t?this.bb.readUint32(this.bb.__vector(this.bb_pos+t)+4*e):0}nodeIndicesLength(){let e=this.bb.__offset(this.bb_pos,4);return e?this.bb.__vector_len(this.bb_pos+e):0}nodeIndicesArray(){let e=this.bb.__offset(this.bb_pos,4);return e?new Uint32Array(this.bb.bytes().buffer,this.bb.bytes().byteOffset+this.bb.__vector(this.bb_pos+e),this.bb.__vector_len(this.bb_pos+e)):null}kernelDefHashes(e){let t=this.bb.__offset(this.bb_pos,6);return t?this.bb.readUint64(this.bb.__vector(this.bb_pos+t)+8*e):this.bb.createLong(0,0)}kernelDefHashesLength(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.__vector_len(this.bb_pos+e):0}static startKernelCreateInfos(e){e.startObject(2)}static addNodeIndices(e,t){e.addFieldOffset(0,t,0)}static createNodeIndicesVector(e,t){e.startVector(4,t.length,4);for(let n=t.length-1;n>=0;n--)e.addInt32(t[n]);return e.endVector()}static startNodeIndicesVector(e,t){e.startVector(4,t,4)}static addKernelDefHashes(e,t){e.addFieldOffset(1,t,0)}static createKernelDefHashesVector(e,t){e.startVector(8,t.length,8);for(let n=t.length-1;n>=0;n--)e.addInt64(t[n]);return e.endVector()}static startKernelDefHashesVector(e,t){e.startVector(8,t,8)}static endKernelCreateInfos(e){return e.endObject()}static createKernelCreateInfos(e,n,r){return t.startKernelCreateInfos(e),t.addNodeIndices(e,n),t.addKernelDefHashes(e,r),t.endKernelCreateInfos(e)}}e.KernelCreateInfos=t}(e.fbs||(e.fbs={}))}(e.experimental||(e.experimental={}))}(t.onnxruntime||(t.onnxruntime={})),function(e){!function(t){!function(t){class n{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsSubGraphSessionState(e,t){return(t||new n).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsSubGraphSessionState(e,t){return e.setPosition(e.position()+r.flatbuffers.SIZE_PREFIX_LENGTH),(t||new n).__init(e.readInt32(e.position())+e.position(),e)}graphId(e){let t=this.bb.__offset(this.bb_pos,4);return t?this.bb.__string(this.bb_pos+t,e):null}sessionState(t){let n=this.bb.__offset(this.bb_pos,6);return n?(t||new e.experimental.fbs.SessionState).__init(this.bb.__indirect(this.bb_pos+n),this.bb):null}static startSubGraphSessionState(e){e.startObject(2)}static addGraphId(e,t){e.addFieldOffset(0,t,0)}static addSessionState(e,t){e.addFieldOffset(1,t,0)}static endSubGraphSessionState(e){let t=e.endObject();return e.requiredField(t,4),t}static createSubGraphSessionState(e,t,r){return n.startSubGraphSessionState(e),n.addGraphId(e,t),n.addSessionState(e,r),n.endSubGraphSessionState(e)}}t.SubGraphSessionState=n}(t.fbs||(t.fbs={}))}(e.experimental||(e.experimental={}))}(t.onnxruntime||(t.onnxruntime={})),function(e){!function(t){!function(t){class n{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsSessionState(e,t){return(t||new n).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsSessionState(e,t){return e.setPosition(e.position()+r.flatbuffers.SIZE_PREFIX_LENGTH),(t||new n).__init(e.readInt32(e.position())+e.position(),e)}kernels(t){let n=this.bb.__offset(this.bb_pos,4);return n?(t||new e.experimental.fbs.KernelCreateInfos).__init(this.bb.__indirect(this.bb_pos+n),this.bb):null}subGraphSessionStates(t,n){let r=this.bb.__offset(this.bb_pos,6);return r?(n||new e.experimental.fbs.SubGraphSessionState).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+r)+4*t),this.bb):null}subGraphSessionStatesLength(){let e=this.bb.__offset(this.bb_pos,6);return e?this.bb.__vector_len(this.bb_pos+e):0}static startSessionState(e){e.startObject(2)}static addKernels(e,t){e.addFieldOffset(0,t,0)}static addSubGraphSessionStates(e,t){e.addFieldOffset(1,t,0)}static createSubGraphSessionStatesVector(e,t){e.startVector(4,t.length,4);for(let n=t.length-1;n>=0;n--)e.addOffset(t[n]);return e.endVector()}static startSubGraphSessionStatesVector(e,t){e.startVector(4,t,4)}static endSessionState(e){return e.endObject()}static createSessionState(e,t,r){return n.startSessionState(e),n.addKernels(e,t),n.addSubGraphSessionStates(e,r),n.endSessionState(e)}}t.SessionState=n}(t.fbs||(t.fbs={}))}(e.experimental||(e.experimental={}))}(t.onnxruntime||(t.onnxruntime={})),function(e){!function(t){!function(t){class n{constructor(){this.bb=null,this.bb_pos=0}__init(e,t){return this.bb_pos=e,this.bb=t,this}static getRootAsInferenceSession(e,t){return(t||new n).__init(e.readInt32(e.position())+e.position(),e)}static getSizePrefixedRootAsInferenceSession(e,t){return e.setPosition(e.position()+r.flatbuffers.SIZE_PREFIX_LENGTH),(t||new n).__init(e.readInt32(e.position())+e.position(),e)}static bufferHasIdentifier(e){return e.__has_identifier("ORTM")}ortVersion(e){let t=this.bb.__offset(this.bb_pos,4);return t?this.bb.__string(this.bb_pos+t,e):null}model(t){let n=this.bb.__offset(this.bb_pos,6);return n?(t||new e.experimental.fbs.Model).__init(this.bb.__indirect(this.bb_pos+n),this.bb):null}sessionState(t){let n=this.bb.__offset(this.bb_pos,8);return n?(t||new e.experimental.fbs.SessionState).__init(this.bb.__indirect(this.bb_pos+n),this.bb):null}static startInferenceSession(e){e.startObject(3)}static addOrtVersion(e,t){e.addFieldOffset(0,t,0)}static addModel(e,t){e.addFieldOffset(1,t,0)}static addSessionState(e,t){e.addFieldOffset(2,t,0)}static endInferenceSession(e){return e.endObject()}static finishInferenceSessionBuffer(e,t){e.finish(t,"ORTM")}static finishSizePrefixedInferenceSessionBuffer(e,t){e.finish(t,"ORTM",!0)}static createInferenceSession(e,t,r,o){return n.startInferenceSession(e),n.addOrtVersion(e,t),n.addModel(e,r),n.addSessionState(e,o),n.endInferenceSession(e)}}t.InferenceSession=n}(t.fbs||(t.fbs={}))}(e.experimental||(e.experimental={}))}(t.onnxruntime||(t.onnxruntime={}))},1723:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.OnnxjsSessionHandler=void 0;const r=n(8453),o=n(9240);t.OnnxjsSessionHandler=class{constructor(e){this.session=e,this.inputNames=this.session.inputNames,this.outputNames=this.session.outputNames}async dispose(){}async run(e,t,n){const i=new Map;for(const t in e)if(Object.hasOwnProperty.call(e,t)){const n=e[t];i.set(t,new o.Tensor(n.dims,n.type,void 0,void 0,n.data))}const a=await this.session.run(i),s={};return a.forEach(((e,t)=>{s[t]=new r.Tensor(e.type,e.data,e.dims)})),s}startProfiling(){this.session.startProfiling()}endProfiling(){this.session.endProfiling()}}},6027:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Session=void 0;const r=n(7067),o=n(1296),i=n(1975),a=n(6496),s=n(1315),u=n(1745);t.Session=class{constructor(e={}){this._initialized=!1,this.backendHint=e.backendHint,this.profiler=s.Profiler.create(e.profiler),this.context={profiler:this.profiler,graphInputTypes:[],graphInputDims:[]}}get inputNames(){return this._model.graph.getInputNames()}get outputNames(){return this._model.graph.getOutputNames()}startProfiling(){this.profiler.start()}endProfiling(){this.profiler.stop()}async loadModel(e,t,n){await this.profiler.event("session","Session.loadModel",(async()=>{const a=await(0,i.resolveBackend)(this.backendHint);if(this.sessionHandler=a.createSessionHandler(this.context),this._model=new u.Model,"string"==typeof e){const t=e.endsWith(".ort");if("undefined"==typeof fetch){const n=await(0,o.promisify)(r.readFile)(e);this.initialize(n,t)}else{const n=await fetch(e),r=await n.arrayBuffer();this.initialize(new Uint8Array(r),t)}}else if(ArrayBuffer.isView(e))this.initialize(e);else{const r=new Uint8Array(e,t||0,n||e.byteLength);this.initialize(r)}}))}initialize(e,t){if(this._initialized)throw new Error("already initialized");this.profiler.event("session","Session.initialize",(()=>{const n=this.sessionHandler.transformGraph?this.sessionHandler:void 0;this._model.load(e,n,t),this.sessionHandler.onGraphInitialized&&this.sessionHandler.onGraphInitialized(this._model.graph),this.initializeOps(this._model.graph),this._executionPlan=new a.ExecutionPlan(this._model.graph,this._ops,this.profiler)})),this._initialized=!0}async run(e){if(!this._initialized)throw new Error("session not initialized yet");return this.profiler.event("session","Session.run",(async()=>{const t=this.normalizeAndValidateInputs(e),n=await this._executionPlan.execute(this.sessionHandler,t);return this.createOutput(n)}))}normalizeAndValidateInputs(e){const t=this._model.graph.getInputNames();if(Array.isArray(e)){if(e.length!==t.length)throw new Error(`incorrect input array length: expected ${t.length} but got ${e.length}`)}else{if(e.size!==t.length)throw new Error(`incorrect input map size: expected ${t.length} but got ${e.size}`);const n=new Array(e.size);let r=0;for(let o=0;o<t.length;++o){const i=e.get(t[o]);if(!i)throw new Error(`missing input tensor for: '${name}'`);n[r++]=i}e=n}if(this.context.graphInputTypes&&0!==this.context.graphInputTypes.length&&this.context.graphInputDims&&0!==this.context.graphInputDims.length)this.validateInputTensorDims(this.context.graphInputDims,e,!1);else{const t=this._model.graph.getInputIndices(),n=this._model.graph.getValues(),r=new Array(t.length);for(let o=0;o<t.length;++o){const i=n[t[o]];r[o]=i.type.shape.dims,this.context.graphInputTypes.push(i.type.tensorType),this.context.graphInputDims.push(e[o].dims)}this.validateInputTensorDims(r,e,!0)}return this.validateInputTensorTypes(this.context.graphInputTypes,e),e}validateInputTensorTypes(e,t){for(let n=0;n<t.length;n++){const r=e[n],o=t[n].type;if(r!==o)throw new Error(`input tensor[${n}] check failed: expected type '${r}' but got ${o}`)}}validateInputTensorDims(e,t,n){for(let r=0;r<t.length;r++){const o=e[r],i=t[r].dims;if(!this.compareTensorDims(o,i,n))throw new Error(`input tensor[${r}] check failed: expected shape '[${o.join(",")}]' but got [${i.join(",")}]`)}}compareTensorDims(e,t,n){if(e.length!==t.length)return!1;for(let r=0;r<e.length;++r)if(e[r]!==t[r]&&(!n||0!==e[r]))return!1;return!0}createOutput(e){const t=this._model.graph.getOutputNames();if(e.length!==t.length)throw new Error("expected number of outputs do not match number of generated outputs");const n=new Map;for(let r=0;r<t.length;++r)n.set(t[r],e[r]);return n}initializeOps(e){const t=e.getNodes();this._ops=new Array(t.length);for(let n=0;n<t.length;n++)this._ops[n]=this.sessionHandler.resolve(t[n],this._model.opsets,e)}}},9240:function(e,t,n){"use strict";var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.Tensor=void 0;const o=n(3442),i=r(n(3720)),a=n(1446),s=n(1287),u=n(7273);var l=s.onnxruntime.experimental.fbs;class c{get data(){if(void 0===this.cache){const e=this.dataProvider(this.dataId);if(e.length!==this.size)throw new Error("Length of data provided by the Data Provider is inconsistent with the dims of this Tensor.");this.cache=e}return this.cache}get stringData(){if("string"!==this.type)throw new TypeError("data type is not string");return this.data}get integerData(){switch(this.type){case"uint8":case"int8":case"uint16":case"int16":case"int32":case"uint32":case"bool":return this.data;default:throw new TypeError("data type is not integer (uint8, int8, uint16, int16, int32, uint32, bool)")}}get floatData(){switch(this.type){case"float32":case"float64":return this.data;default:throw new TypeError("data type is not float (float32, float64)")}}get numberData(){if("string"!==this.type)return this.data;throw new TypeError("type cannot be non-number (string)")}get(e){return this.data[u.ShapeUtil.indicesToOffset(e,this.strides)]}set(e,t){this.data[u.ShapeUtil.indicesToOffset(e,this.strides)]=t}async getData(){return void 0===this.cache&&(this.cache=await this.asyncDataProvider(this.dataId)),this.cache}get strides(){return this._strides||(this._strides=u.ShapeUtil.computeStrides(this.dims)),this._strides}constructor(e,t,n,r,i,a=o.Guid.create()){this.dims=e,this.type=t,this.dataProvider=n,this.asyncDataProvider=r,this.cache=i,this.dataId=a,this.size=u.ShapeUtil.validateDimsAndCalcSize(e);const s=this.size,l=void 0===n&&void 0===r&&void 0===i;if(void 0!==i&&i.length!==s)throw new RangeError("Input dims doesn't match data length.");if("string"===t){if(!(void 0===i||Array.isArray(i)&&i.every((e=>"string"==typeof e))))throw new TypeError("cache should be a string array");l&&(this.cache=new Array(s))}else{if(void 0!==i){const e=d(t);if(!(i instanceof e))throw new TypeError(`cache should be type ${e.name}`)}if(l){const e=new ArrayBuffer(s*function(e){switch(e){case"bool":case"int8":case"uint8":return 1;case"int16":case"uint16":return 2;case"int32":case"uint32":case"float32":return 4;case"float64":return 8;default:throw new Error(`cannot calculate sizeof() on type ${e}`)}}(t));this.cache=function(e,t){return new(d(t))(e)}(e,t)}}}static fromProto(e){if(!e)throw new Error("cannot construct Value from an empty tensor");const t=u.ProtoUtil.tensorDataTypeFromProto(e.dataType),n=u.ProtoUtil.tensorDimsFromProto(e.dims),r=new c(n,t);if("string"===t)e.stringData.forEach(((e,t)=>{r.data[t]=(0,u.decodeUtf8String)(e)}));else if(e.rawData&&"number"==typeof e.rawData.byteLength&&e.rawData.byteLength>0){const t=r.data,n=new DataView(e.rawData.buffer,e.rawData.byteOffset,e.rawData.byteLength),o=p(e.dataType),i=e.rawData.byteLength/o;if(e.rawData.byteLength%o!=0)throw new Error("invalid buffer length");if(t.length!==i)throw new Error("buffer length mismatch");for(let r=0;r<i;r++){const i=h(n,e.dataType,r*o);t[r]=i}}else{let t;switch(e.dataType){case a.onnx.TensorProto.DataType.FLOAT:t=e.floatData;break;case a.onnx.TensorProto.DataType.INT32:case a.onnx.TensorProto.DataType.INT16:case a.onnx.TensorProto.DataType.UINT16:case a.onnx.TensorProto.DataType.INT8:case a.onnx.TensorProto.DataType.UINT8:case a.onnx.TensorProto.DataType.BOOL:t=e.int32Data;break;case a.onnx.TensorProto.DataType.INT64:t=e.int64Data;break;case a.onnx.TensorProto.DataType.DOUBLE:t=e.doubleData;break;case a.onnx.TensorProto.DataType.UINT32:case a.onnx.TensorProto.DataType.UINT64:t=e.uint64Data;break;default:throw new Error("unspecific error")}if(null==t)throw new Error("failed to populate data from a tensorproto value");const n=r.data;if(n.length!==t.length)throw new Error("array length mismatch");for(let r=0;r<t.length;r++){const o=t[r];i.default.isLong(o)?n[r]=f(o,e.dataType):n[r]=o}}return r}static fromData(e,t,n){return new c(t,n,void 0,void 0,e)}static fromOrtTensor(e){if(!e)throw new Error("cannot construct Value from an empty tensor");const t=u.ProtoUtil.tensorDimsFromORTFormat(e),n=u.ProtoUtil.tensorDataTypeFromProto(e.dataType()),r=new c(t,n);if("string"===n)for(let t=0;t<e.stringDataLength();t++)r.data[t]=e.stringData(t);else if(e.rawDataArray()&&"number"==typeof e.rawDataLength()&&e.rawDataLength()>0){const t=r.data,n=new DataView(e.rawDataArray().buffer,e.rawDataArray().byteOffset,e.rawDataLength()),o=p(e.dataType()),i=e.rawDataLength()/o;if(e.rawDataLength()%o!=0)throw new Error("invalid buffer length");if(t.length!==i)throw new Error("buffer length mismatch");for(let r=0;r<i;r++){const i=h(n,e.dataType(),r*o);t[r]=i}}return r}}function p(e){switch(e){case a.onnx.TensorProto.DataType.UINT8:case a.onnx.TensorProto.DataType.INT8:case a.onnx.TensorProto.DataType.BOOL:return 1;case a.onnx.TensorProto.DataType.UINT16:case a.onnx.TensorProto.DataType.INT16:return 2;case a.onnx.TensorProto.DataType.FLOAT:case a.onnx.TensorProto.DataType.INT32:case a.onnx.TensorProto.DataType.UINT32:return 4;case a.onnx.TensorProto.DataType.INT64:case a.onnx.TensorProto.DataType.DOUBLE:case a.onnx.TensorProto.DataType.UINT64:return 8;default:throw new Error(`cannot calculate sizeof() on type ${a.onnx.TensorProto.DataType[e]}`)}}function d(e){switch(e){case"bool":case"uint8":return Uint8Array;case"int8":return Int8Array;case"int16":return Int16Array;case"uint16":return Uint16Array;case"int32":return Int32Array;case"uint32":return Uint32Array;case"float32":return Float32Array;case"float64":return Float64Array;default:throw new Error("unspecified error")}}function f(e,t){if(t===a.onnx.TensorProto.DataType.INT64||t===l.TensorDataType.INT64){if(e.greaterThanOrEqual(2147483648)||e.lessThan(-2147483648))throw new TypeError("int64 is not supported")}else{if(t!==a.onnx.TensorProto.DataType.UINT32&&t!==l.TensorDataType.UINT32&&t!==a.onnx.TensorProto.DataType.UINT64&&t!==l.TensorDataType.UINT64)throw new TypeError(`not a LONG type: ${a.onnx.TensorProto.DataType[t]}`);if(e.greaterThanOrEqual(4294967296)||e.lessThan(0))throw new TypeError("uint64 is not supported")}return e.toNumber()}function h(e,t,n){switch(t){case a.onnx.TensorProto.DataType.BOOL:case a.onnx.TensorProto.DataType.UINT8:return e.getUint8(n);case a.onnx.TensorProto.DataType.INT8:return e.getInt8(n);case a.onnx.TensorProto.DataType.UINT16:return e.getUint16(n,!0);case a.onnx.TensorProto.DataType.INT16:return e.getInt16(n,!0);case a.onnx.TensorProto.DataType.FLOAT:return e.getFloat32(n,!0);case a.onnx.TensorProto.DataType.INT32:return e.getInt32(n,!0);case a.onnx.TensorProto.DataType.UINT32:return e.getUint32(n,!0);case a.onnx.TensorProto.DataType.INT64:return f(i.default.fromBits(e.getUint32(n,!0),e.getUint32(n+4,!0),!1),t);case a.onnx.TensorProto.DataType.DOUBLE:return e.getFloat64(n,!0);case a.onnx.TensorProto.DataType.UINT64:return f(i.default.fromBits(e.getUint32(n,!0),e.getUint32(n+4,!0),!0),t);default:throw new Error(`cannot read from DataView for type ${a.onnx.TensorProto.DataType[t]}`)}}t.Tensor=c},7273:function(e,t,n){"use strict";var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.decodeUtf8String=t.MAX_CLIP=t.MIN_CLIP=t.PoolConvUtil=t.ReduceUtil=t.SplitUtil=t.MathUtil=t.ShapeUtil=t.LongUtil=t.ProtoUtil=t.GemmUtil=t.arrayCopyHelper=t.BroadcastUtil=t.MatMulUtil=t.ArrayUtil=t.assert=t.checkInputsShape=void 0;const o=n(5686),i=r(n(3720)),a=n(1446),s=n(9240);t.checkInputsShape=function(e,...t){if(!e||e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(!e[n].dims||e[n].dims.length!==t[n])return!1;return!0},t.assert=function(e,t){if(!e)throw new Error("string"==typeof t?t:t())},t.ArrayUtil=class{static arraysEqual(e,t){if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(e[n]!==t[n])return!1;return!0}};class u{static preprocessInputShapes(e,t){return[1===e.length?[1,e[0]]:e,1===t.length?[t[0],1]:t]}static postprocessOutputShape(e,t,n){1===t&&e.splice(e.length-2,1),1===n&&e.pop()}static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}}t.MatMulUtil=u;class l{static calcShape(e,t,n=!1){const r=e.length,o=t.length;if(0===r)return t;if(0===o)return e;const i=Math.max(e.length,t.length),a=new Array(i);if(n){if(r<2||o<2)return;const n=u.calcMatMulShape([e[r-2],e[r-1]],[t[o-2],t[o-1]]);if(void 0===n)return;[a[i-2],a[i-1]]=n}for(let s=n?3:1;s<=i;s++){const n=r-s<0?1:e[r-s],u=o-s<0?1:t[o-s];if(n!==u&&n>1&&u>1)return;a[i-s]=Math.max(n,u)}return a}static index(e,t){const n=new Array(t.length);return l.fillIndex(e,t,n),n}static fillIndex(e,t,n){const r=e.length-t.length;for(let o=0;o<t.length;o++)n[o]=e[r+o]%t[o]}static calc(e,t,n,r,o){const i=l.calcShape(e.dims,t.dims);if(i){if(r&&!d.areEqual(i,e.dims))return;const a=d.size(i),u=r?e:new s.Tensor(i,o||e.type);if(0===i.length)u.set([],n(e.get([]),t.get([])));else{const r=new Array(i.length),o=new Array(e.dims.length),s=new Array(t.dims.length);let c,p=0,d=0,f=!1,h=!1;0===e.dims.length&&(p=e.get([]),f=!0),0===t.dims.length&&(d=t.get([]),h=!0);for(let g=0;g<a;g++){c=g;for(let e=i.length-1;e>=0;e--)r[e]=c%i[e],c=Math.floor(c/i[e]);f||(l.fillIndex(r,e.dims,o),p=e.get(o)),h||(l.fillIndex(r,t.dims,s),d=t.get(s)),u.set(r,n(p,d))}}return u}}static isValidBroadcast(e,t){const n=e.length,r=t.length;if(n>r)return!1;for(let o=1;o<=n;o++)if(1!==e[n-o]&&e[n-o]!==t[r-o])return!1;return!0}static getBroadcastDims(e,t){const n=e.length,r=[];for(let o=0;o<n;o++){const i=n-1-o,a=e[i]||1;(t[t.length-1-o]||1)>1&&1===a&&r.unshift(i)}return r}}t.BroadcastUtil=l,t.arrayCopyHelper=function(e,t,n,r,o){if(r<0||r>=t.length)throw new Error("sourceIndex out of bounds");if(n<0||n>=e.length)throw new Error("targetIndex out of bounds");if(r+o>t.length)throw new Error("source indices to be copied are outside bounds");if(n+o>e.length)throw new Error("target array is too small to hold result");for(let i=0;i<o;i++)e[n+i]=t[r+i]},t.GemmUtil=class{static getShapeOfGemmResult(e,t,n,r,o){if(2!==e.length||2!==n.length)throw new Error("shape need to be of size 2");let i,a,s;t?(i=e[1],a=e[0]):(i=e[0],a=e[1]);let u=-1;if(r?(s=n[0],u=1):(s=n[1],u=0),n[u]!==a)throw new Error("dimension mismatch");if(i<=0||s<=0||a<=0)throw new Error("invalid shape specified");if(o&&!l.isValidBroadcast(o,[i,s]))throw new Error("gemm: invalid bias shape for broadcast");return[i,s,a]}};class c{static tensorDataTypeFromProto(e){switch(e){case a.onnx.TensorProto.DataType.INT8:return"int8";case a.onnx.TensorProto.DataType.UINT8:return"uint8";case a.onnx.TensorProto.DataType.BOOL:return"bool";case a.onnx.TensorProto.DataType.INT16:return"int16";case a.onnx.TensorProto.DataType.UINT16:return"uint16";case a.onnx.TensorProto.DataType.INT32:return"int32";case a.onnx.TensorProto.DataType.UINT32:return"uint32";case a.onnx.TensorProto.DataType.FLOAT:return"float32";case a.onnx.TensorProto.DataType.DOUBLE:return"float64";case a.onnx.TensorProto.DataType.STRING:return"string";case a.onnx.TensorProto.DataType.INT64:return"int32";case a.onnx.TensorProto.DataType.UINT64:return"uint32";default:throw new Error(`unsupported data type: ${a.onnx.TensorProto.DataType[e]}`)}}static tensorDataTypeStringToEnum(e){switch(e){case"int8":return a.onnx.TensorProto.DataType.INT8;case"uint8":return a.onnx.TensorProto.DataType.UINT8;case"bool":return a.onnx.TensorProto.DataType.BOOL;case"int16":return a.onnx.TensorProto.DataType.INT16;case"uint16":return a.onnx.TensorProto.DataType.UINT16;case"int32":return a.onnx.TensorProto.DataType.INT32;case"uint32":return a.onnx.TensorProto.DataType.UINT32;case"float32":return a.onnx.TensorProto.DataType.FLOAT;case"float64":return a.onnx.TensorProto.DataType.DOUBLE;case"string":return a.onnx.TensorProto.DataType.STRING;case"int64":return a.onnx.TensorProto.DataType.INT64;case"uint64":return a.onnx.TensorProto.DataType.UINT64;default:throw new Error(`unsupported data type: ${e}`)}}static tensorDimsFromProto(e){return e.map((e=>i.default.isLong(e)?e.toNumber():e))}static tensorValueTypeFromProto(e){return{tensorType:c.tensorDataTypeFromProto(e.elemType),shape:{dims:c.tensorDimsFromProto(e.shape.dim.map((e=>e.dimValue)))}}}static tensorDimsFromORTFormat(e){const t=[];for(let n=0;n<e.dimsLength();n++)t.push(p.longToNumber(e.dims(n)));return t}static tensorAttributesFromORTFormat(e){const t=[];for(let n=0;n<e.attributesLength();n++)t.push(e.attributes(n));return t}}t.ProtoUtil=c;class p{static longToNumber(e,t){return i.default.isLong(e)?e.toNumber():e instanceof o.flatbuffers.Long?i.default.fromValue({low:e.low,high:e.high,unsigned:null!=t&&t}).toNumber():e}static isLong(e){return i.default.isLong(e)||e instanceof o.flatbuffers.Long}}t.LongUtil=p;class d{static size(e){return d.getSizeFromDimensionRange(e,0,e.length)}static sizeFromDimension(e,t){if(t<0||t>e.length)throw new Error(`invalid dimension of ${t} for sizeFromDimension as Tensor has ${e.length} dimensions.`);return d.getSizeFromDimensionRange(e,t,e.length)}static sizeToDimension(e,t){if(t<0||t>e.length)throw new Error(`invalid dimension of ${t} for sizeToDimension as Tensor has ${e.length} dimensions.`);return d.getSizeFromDimensionRange(e,0,t)}static getSizeFromDimensionRange(e,t,n){let r=1;for(let o=t;o<n;o++){if(e[o]<=0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains 0 or negative values in them.");r*=e[o]}return r}static computeStrides(e){const t=e.length;if(0===t)return[];if(1===t)return[1];const n=new Array(t);n[t-1]=1,n[t-2]=e[t-1];for(let r=t-3;r>=0;--r)n[r]=n[r+1]*e[r+1];return n}static transpose(e){return e.slice().reverse()}static indicesToOffset(e,t,n){void 0===n&&(n=e.length);let r=0;for(let o=0;o<n;++o)r+=t[o]*e[o];return r}static offsetToIndices(e,t){const n=t.length;if(0===n)return[];if(1===n)return[e*t[0]];const r=new Array(t.length);for(let n=0;n<r.length-1;++n)r[n]=Math.floor(e/t[n]),e-=r[n]*t[n];return r[r.length-1]=e,r}static normalizeAxis(e,t){if(e<-t&&e>=t)throw new Error("unsupported axis for this operation.");return e<0?e+t:e}static normalizeAxes(e,t){return e.map((e=>this.normalizeAxis(e,t)))}static incrementIndex(e,t,n){if(0===t.length||0===e.length)throw new Error("Index incrementing unsupported for scalar Tensor");if(void 0===n)n=t.length;else if(n<=0||n>t.length)throw new Error("Incorrect axis to increment on");for(let r=n-1;r>=0&&(e[r]++,!(e[r]<t[r]));--r)e[r]=0}static calculateReshapedDims(e,t){if(0===t.length){if(0===e.length||1===d.size(e))return[];throw new Error("cannot reshape to a scalar Tensor")}const n=t.length,r=new Array(n);let o=-1,i=1;for(let a=0;a<n;a++){if(t[a]<-1)throw new Error("a dimension in shape hints cannot be less than -1");if(-1===t[a]){if(-1!==o)throw new Error("at most one dimension in shape hints can be -1");o=a}else{if(0===t[a]){if(a>=e.length)throw new Error("the dimension with value zero exceeds the dimension size of the input tensor");r[a]=e[a]}else r[a]=t[a];i*=r[a]}}const a=d.size(e);if(-1!==o){if(a%i!=0)throw new Error(`the input tensor cannot be reshaped to the requested shape. Input shape: [${e}] Output shape: [${t}]`);r[o]=a/i}else if(i!==a)throw new Error("reshapedDims and originalDims don't have matching sizes");return r}static sortBasedOnPerm(e,t){return t?t.map((t=>e[t])):e.slice().reverse()}static padShape(e,t){const n=e.length;return e.map(((e,r)=>e+t[r]+t[r+n]))}static areEqual(e,t){return e.length===t.length&&e.every(((e,n)=>e===t[n]))}static validateDimsAndCalcSize(e){if(e.length>6)throw new TypeError("Only rank 0 to 6 is supported for tensor shape.");let t=1;for(const n of e){if(!Number.isInteger(n))throw new TypeError(`Invalid shape: ${n} is not an integer`);if(n<0||n>2147483647)throw new TypeError(`Invalid shape: length ${n} is not allowed`);t*=n}return t}static flattenShape(e,t){t<0&&(t+=e.length);const n=e.reduce(((e,t)=>e*t),1),r=e.slice(t).reduce(((e,t)=>e*t),1);return[n/r,r]}static squeezeShape(e,t){const n=new Array;t=d.normalizeAxes(t,e.length);for(let r=0;r<e.length;r++){const o=t.indexOf(r)>=0;if(o&&1!==e[r])throw new Error("squeeze an axis of size different than 1");(0===t.length&&e[r]>1||t.length>0&&!o)&&n.push(e[r])}return n}static unsqueezeShape(e,t){const n=new Array(e.length+t.length);n.fill(0);for(let e=0;e<t.length;e++){const r=d.normalizeAxis(t[e],n.length);if(r>=n.length)throw new Error("'axes' has an out of range axis");if(0!==n[r])throw new Error("'axes' has a duplicate axis");n[r]=1}let r=0;for(let t=0;t<n.length;t++)0===n[t]&&(n[t]=e[r++]);if(r!==e.length)throw new Error("the unsqueezed dimension could not be established");return n}}t.ShapeUtil=d,t.MathUtil=class{static sqr(e,t,n,r,o){if(r<0||r>=t.length)throw new Error("sourceIndex out of bounds");if(n<0||n>=e.length)throw new Error("targetIndex out of bounds");if(r+o>t.length)throw new Error("source indices to be copied are outside bounds");if(n+o>e.length)throw new Error("target array is too small to hold result");for(let i=0;i<o;i++)e[n+i]+=Math.pow(t[r+i],2)}static axpy(e,t,n,r,o,i){if(r<0||r>=t.length)throw new Error("sourceIndex out of bounds");if(n<0||n>=e.length)throw new Error("targetIndex out of bounds");if(r+o>t.length)throw new Error("source indices to be copied are outside bounds");if(n+o>e.length)throw new Error("target array is too small to hold result");for(let a=0;a<o;a++)e[n+a]+=i*t[r+a]}static powx(e,t,n,r,o,i){if(r<0||r>=t.length)throw new Error("sourceIndex out of bounds");if(n<0||n>=e.length)throw new Error("targetIndex out of bounds");if(r+o>t.length)throw new Error("source indices to be copied are outside bounds");if(n+o>e.length)throw new Error("target array is too small to hold result");for(let a=0;a<o;a++)e[n+a]=Math.pow(t[r+a],i)}static mul(e,t,n,r,o){if(r<0||r>=t.length)throw new Error("sourceIndex out of bounds");if(n<0||n>=e.length)throw new Error("targetIndex out of bounds");if(r+o>t.length)throw new Error("source indices to be copied are outside bounds");if(n+o>e.length)throw new Error("target array is too small to hold result");for(let i=0;i<o;i++)e[n+i]=t[r+i]*e[n+i]}};class f{static splitShape(e,t,n,r){if(0===n.length){if(!r)throw new Error("need to know number of outputs when the 'split' attribute is not specified");f.determineSplit(e[t],r,n)}const o=[],i=[0];for(let r=0;r<n.length;++r){0!==r&&i.push(i[r-1]+n[r-1]);const a=e.slice();a[t]=n[r],o.push(a)}return[o,i]}static determineSplit(e,t,n){if(e%t!=0)throw new Error("cannot split tensor to equal sized parts");for(let r=0;r<t;++r)n.push(e/t)}}t.SplitUtil=f;class h{static calcReduce(e,t,n,r,o){const i=e.dims.slice(0);0===t.length&&i.forEach(((e,n)=>t.push(n)));const a=h.calcReduceShape(i,t,!0),u=d.size(a),c=new s.Tensor(a,e.type),p=d.computeStrides(a),f=d.computeStrides(i),g=new Array(i.length);for(let n=0;n<u;n++){const a=d.offsetToIndices(n,p);l.fillIndex(a,i,g),c.set(a,h.calcReduceByAxis(e.numberData,t,i,0,d.indicesToOffset(g,f),r,o))}return n?c:new s.Tensor(h.calcReduceShape(i,t,n),c.type,void 0,void 0,c.data,c.dataId)}static calcReduceByAxis(e,t,n,r,o,i,a){let s=0;if(r>=t.length)return i(e[o]);const u=t[r],l=u>=n.length?1:d.size(n.slice(u+1));for(let c=0;c<n[u];c++)s=0===c?h.calcReduceByAxis(e,t,n,r+1,o,i,a):a(s,h.calcReduceByAxis(e,t,n,r+1,o,i,a)),o+=l;return s}static calcReduceShape(e,t,n){const r=e.slice();for(let e=0;e<t.length;e++)r[t[e]]=n?1:0;return r.filter((e=>0!==e))}}t.ReduceUtil=h;class g{static adjustPoolAttributes(e,t,n,r,o,i){if(!e&&n.length!==t.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(e)for(let e=0;e<t.length-2;e++)e>=n.length?n.push(t[e+2]):n[e]=t[e+2];for(let e=0;e<n.length;e++)if(e<r.length){if(r[e]<0)throw new Error("strides should be greater than or equal to 1")}else r.push(1);for(let e=0;e<n.length;e++)if(e<o.length){if(o[e]<0)throw new Error("dilations should be greater than or equal to 1")}else o.push(1);for(let e=0;e<2*n.length;e++)if(e<i.length){if(i[e]<0)throw new Error("pad should be greater than or equal to 1")}else i.push(0);for(let e=0;e<n.length;e++){if(n[e]<=0)throw new Error("kernel shapes need to be greater than 0");if(i[e]>=n[e]||i[e+n.length]>=n[e])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(e,t,n,r,o,i){if(i){if(o.length!==2*(e.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(t.length!==e.length-2)throw new Error("length of strides should be the length of data dimensions");if(r.length!==e.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let a=0;a<e.length-2;a++)g.adjustPadAndReturnShape(e[a+2],t[a],n[a],r[a],o,a,a+e.length-2,i)}}static computePoolOutputShape(e,t,n,r,o,i,a){if(t.length<=0)throw new Error("input shape must be of size greater than 0");const s=[t[0],t[1]];return g.computeShapeHelper(e,t,s,n,r,o,i,a),s}static computeConvOutputShape(e,t,n,r,o,i,a){if(e.length<=0||t.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");const s=[e[0],t[0]];return g.computeShapeHelper(!1,e,s,n,r,o,i,a),s}static computeShapeHelper(e,t,n,r,o,i,a,s){if(e)for(let e=0;e<t.length-2;e++)n.push(1);else for(let e=0;e<t.length-2;e++)n.push(g.adjustPadAndReturnShape(t[e+2],r[e],o[e],i[e],a,e,e+t.length-2,s))}static adjustPadAndReturnShape(e,t,n,r,o,i,a,s){const u=n*(r-1)+1;if(!s||"NOTSET"===s)return Math.floor((e+o[i]+o[a]-u)/t+1);switch(s){case"VALID":return o[i]=0,o[a]=0,Math.floor((e-u)/t+1);case"SAME_LOWER":case"SAME_UPPER":if(1!==n)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{const n=((e+t-1)/t-1)*t+r-e;return o[i]="SAME_LOWER"===s?Math.floor((n+1)/2):Math.floor(n/2),o[a]=n-o[i],Math.floor((e+n-r)/t+1)}default:throw new Error("Unsupported AutoPad type")}}}t.PoolConvUtil=g,t.MIN_CLIP=-34028234663852886e22,t.MAX_CLIP=34028234663852886e22,t.decodeUtf8String=function(e){return(new TextDecoder).decode(e)}},3838:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.WebGpuBackend=void 0;const r=n(8453),o=n(4955),i=n(7771),a=n(8510),s=n(8305);t.WebGpuBackend=class{constructor(){this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.pendingDispatchNumber=0,this.profilingEnabled=!1}get currentKernelCustomData(){if(null===this.currentKernelId)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(){if(!navigator.gpu)throw new Error("WebGpuBackend: WebGPU is not available.");const e=await navigator.gpu.requestAdapter();if(!e)throw new Error("WebGpuBackend: Failed to get GPU adapter.");const t={requiredLimits:{maxComputeWorkgroupStorageSize:e.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:e.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:e.limits.maxStorageBufferBindingSize}};e.features.has("timestamp-query-inside-passes")&&"default"===r.env.webgpu.profilingMode&&(this.profilingEnabled=!0,t.requiredFeatures=["timestamp-query-inside-passes"]),this.device=await e.requestDevice(t),this.gpuDataManager=(0,i.createGpuDataManager)(this),this.programManager=new s.ProgramManager(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,this.device.onuncapturederror=e=>{e.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${e.error.message}`)},this.profilingEnabled&&(this.profilingQuerySet=this.device.createQuerySet({type:"timestamp",count:2}))}dispose(){}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){return this.computePassEncoder||(this.computePassEncoder=this.getCommandEncoder().beginComputePass()),this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){this.endComputePass(),this.device.queue.submit([this.getCommandEncoder().finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0}run(e,t,n,r,i){if(t.length!==e.inputTypes.length)throw new Error(`Input size must be equal to ${e.inputTypes.length}.`);const a=[];for(let e=0;e<t.length;++e){const n=this.gpuDataManager.get(t[e].data);if(!n)throw new Error(`no GPU data for input: ${t[e].data}`);a[e]=n}const s=((e,t,n)=>{const r=t.map((e=>`${e.join(",")}`)).join("_"),o=n.join("_");let i=e.name;return e.cacheHint&&(i+="["+e.cacheHint+"]"),i+=":"+r+";"+o,i})(e,t.map((e=>e.dims)),a.map((e=>e.type)));let u=this.programManager.getArtifact(s);const l=u?u.programInfo:"function"==typeof e.get?e.get():e,c=0===n.length?l.outputs.map(((e,t)=>t)):n;if(c.length!==l.outputs.length)throw new Error(`Output size ${c.length} must be equal to ${l.outputs.length}.`);const p=[],d=[];for(let e=0;e<l.outputs.length;++e){if(!Number.isInteger(c[e])||c[e]<-2||c[e]>=l.outputs.length)throw new Error(`Invalid output index: ${c[e]}`);const t=-1===c[e],n=-2===c[e],o=t||n?i(l.outputs[e].dataType,l.outputs[e].dims):r(c[e],l.outputs[e].dataType,l.outputs[e].dims),a=this.gpuDataManager.get(o.data);if(!a)throw new Error(`no GPU data for output: ${o.data}`);if(t&&this.temporaryData.push(a),n){let e=this.kernelPersistentData.get(this.currentKernelId);e||(e=[],this.kernelPersistentData.set(this.currentKernelId,e)),e.push(a)}p.push(o),d.push(a)}const f=this.programManager.normalizeDispatchGroupSize(l.dispatchGroup(t));return u||(u=this.programManager.build(l,f),this.programManager.setArtifact(s,u)),(0,o.LOG_DEBUG)("info",(()=>`[ProgramManager] run "${l.name}" (key=${s}) with ${f[0]}x${f[1]}x${f[2]}`)),this.programManager.run(u,a,d,f),p}upload(e,t){this.gpuDataManager.upload(e,t)}memcpy(e,t){this.gpuDataManager.memcpy(e,t)}async download(e,t){const n=await this.gpuDataManager.download(e);t().set(new Uint8Array(n))}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,t,n){const r=a.WEBGPU_OP_RESOLVE_RULES.get(e);if(!r)throw new Error(`kernel not implemented: ${e}`);this.kernels.set(t,[e,r[0],[r[1],n]])}releaseKernel(e){const t=this.kernelPersistentData.get(e);if(t){for(const e of t)this.gpuDataManager.release(e.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,t){const n=this.kernels.get(e);if(!n)throw new Error(`kernel not created: ${e}`);const[r,i,a]=n;if(null!==this.currentKernelId)throw new Error(`kernel "${r}" is not allowed to be called recursively`);this.currentKernelId=e,a[0]&&(a[1]=a[0](a[1]),a[0]=void 0),(0,o.LOG_DEBUG)("info",(()=>`[WebGPU] Start to run kernel "${r}"...`)),this.temporaryData=[];try{return i(t,a[1]),0}catch(e){return(0,o.LOG_DEBUG)("warning",`[WebGPU] Kernel "${r}" failed. Error: ${e}`),1}finally{for(const e of this.temporaryData)this.gpuDataManager.release(e.id);this.temporaryData=[],this.currentKernelId=null}}}},7675:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.init=void 0;const r=n(7917),o=n(3838),i=n(4955),a=n(6952);class s{constructor(e,t,n,r){this.module=e,this.dataType=t,this.data=n,this.dims=r}getFloat32Array(){return new Float32Array(this.module.HEAP8.buffer,this.data,a.ShapeUtil.size(this.dims))}reshape(e){if(a.ShapeUtil.size(e)!==a.ShapeUtil.size(this.dims))throw new Error("Invalid new shape");return new s(this.module,this.dataType,this.data,e)}}class u{get customData(){return this.backend.currentKernelCustomData}constructor(e,t,n){this.module=e,this.backend=t;const r=e.HEAPU32;let o=n>>2;this.opKernelContext=r[o++];const i=r[o++],a=[];for(let t=0;t<i;t++){const t=r[o++],n=r[o++],i=r[o++],u=[];for(let e=0;e<i;e++)u.push(r[o++]);a.push(new s(e,t,n,u))}this.inputs=a}compute(e,t){var n,o,i;const u=null!==(o=null===(n=null==t?void 0:t.inputs)||void 0===n?void 0:n.map((e=>"number"==typeof e?this.inputs[e]:e)))&&void 0!==o?o:this.inputs,l=null!==(i=null==t?void 0:t.outputs)&&void 0!==i?i:[];return this.backend.run(e,u,l,((e,t,n)=>new s(this.module,t,this.output(e,n),n)),((e,t)=>{const n=(0,r.getTensorElementSize)(e);if(!n)throw new Error(`Unsupported data type: ${e}`);const o=n*a.ShapeUtil.size(t);return new s(this.module,e,this.backend.gpuDataManager.create(o).id,t)}))}output(e,t){const n=this.module.stackSave();try{const n=this.module.stackAlloc(4*(1+t.length));let r=n>>2;this.module.HEAPU32[r++]=t.length;for(let e=0;e<t.length;e++)this.module.HEAPU32[r++]=t[e];return this.module._JsepOutput(this.opKernelContext,e,n)}finally{this.module.stackRestore(n)}}}t.init=async e=>{const t=e.jsepInit;if(t&&navigator.gpu){const n=new o.WebGpuBackend;await n.initialize(),t({backend:n},(e=>n.alloc(e)),(e=>n.free(e)),((t,r,o,a=!1)=>{if(a)(0,i.LOG_DEBUG)("verbose",(()=>`[WebGPU] jsepCopyGpuToGpu: src=${t}, dst=${r}, size=${o}`)),n.memcpy(t,r);else{(0,i.LOG_DEBUG)("verbose",(()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${t}, gpuDataId=${r}, size=${o}`));const a=e.HEAPU8.subarray(t,t+o);n.upload(r,a)}}),(async(t,r,o)=>{(0,i.LOG_DEBUG)("verbose",(()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${t}, dataOffset=${r}, size=${o}`)),await n.download(t,(()=>e.HEAPU8.subarray(r,r+o)))}),((e,t,r)=>n.createKernel(e,t,r)),(e=>n.releaseKernel(e)),((t,r)=>{(0,i.LOG_DEBUG)("verbose",(()=>`[WebGPU] jsepRun: kernel=${t}, contextDataOffset=${r}`));const o=new u(e,n,r);return n.computeKernel(t,o)}))}}},4955:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.LOG_DEBUG=t.LOG=void 0;const r=n(8453),o=n(7917),i=["V","I","W","E","F"];t.LOG=(e,t)=>{const n=(0,o.logLevelStringToEnum)(e);var a,s;n>=(0,o.logLevelStringToEnum)(r.env.logLevel)&&(a=n,s="function"==typeof t?t():t,console.log(`[${i[a]},${(new Date).toISOString()}]${s}`))},t.LOG_DEBUG=(...e)=>{r.env.debug&&(0,t.LOG)(...e)}},6952:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.MAX_CLIP=t.MIN_CLIP=t.GemmUtil=t.PoolConvUtil=t.ShapeUtil=t.BroadcastUtil=t.MatMulUtil=void 0;class n{static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}}t.MatMulUtil=n;class r{static calcShape(e,t,r=!1){const o=e.length,i=t.length;if(0===o)return t;if(0===i)return e;const a=Math.max(e.length,t.length),s=new Array(a);if(r){if(o<2||i<2)return;const r=n.calcMatMulShape([e[o-2],e[o-1]],[t[i-2],t[i-1]]);if(void 0===r)return;[s[a-2],s[a-1]]=r}for(let n=r?3:1;n<=a;n++){const r=o-n<0?1:e[o-n],u=i-n<0?1:t[i-n];if(r!==u&&r>1&&u>1)return;s[a-n]=Math.max(r,u)}return s}static isValidBroadcast(e,t){const n=e.length,r=t.length;if(n>r)return!1;for(let o=1;o<=n;o++)if(1!==e[n-o]&&e[n-o]!==t[r-o])return!1;return!0}}t.BroadcastUtil=r;class o{static size(e){return o.getSizeFromDimensionRange(e,0,e.length)}static sizeFromDimension(e,t){if(t<0||t>e.length)throw new Error(`invalid dimension of ${t} for sizeFromDimension as Tensor has ${e.length} dimensions.`);return o.getSizeFromDimensionRange(e,t,e.length)}static sizeToDimension(e,t){if(t<0||t>e.length)throw new Error(`invalid dimension of ${t} for sizeToDimension as Tensor has ${e.length} dimensions.`);return o.getSizeFromDimensionRange(e,0,t)}static getSizeFromDimensionRange(e,t,n){let r=1;for(let o=t;o<n;o++){if(e[o]<=0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains 0 or negative values in them.");r*=e[o]}return r}static computeStrides(e){const t=e.length;if(0===t)return[];if(1===t)return[1];const n=new Array(t);n[t-1]=1,n[t-2]=e[t-1];for(let r=t-3;r>=0;--r)n[r]=n[r+1]*e[r+1];return n}static normalizeAxis(e,t){if(e<-t&&e>=t)throw new Error("unsupported axis for this operation.");return e<0?e+t:e}static normalizeAxes(e,t){return e.map((n=>this.normalizeAxis(n,null!=t?t:e.length)))}static sortBasedOnPerm(e,t){return t?t.map((t=>e[t])):e.slice().reverse()}static padShape(e,t){const n=e.length;return e.map(((e,r)=>e+t[r]+t[r+n]))}static areEqual(e,t){return e.length===t.length&&e.every(((e,n)=>e===t[n]))}}t.ShapeUtil=o;class i{static adjustPoolAttributes(e,t,n,r,o,i){if(!e&&n.length!==t.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(e)for(let e=0;e<t.length-2;e++)e>=n.length?n.push(t[e+2]):n[e]=t[e+2];for(let e=0;e<n.length;e++)if(e<r.length){if(r[e]<0)throw new Error("strides should be greater than or equal to 1")}else r.push(1);for(let e=0;e<n.length;e++)if(e<o.length){if(o[e]<0)throw new Error("dilations should be greater than or equal to 1")}else o.push(1);for(let e=0;e<2*n.length;e++)if(e<i.length){if(i[e]<0)throw new Error("pad should be greater than or equal to 1")}else i.push(0);for(let e=0;e<n.length;e++){if(n[e]<=0)throw new Error("kernel shapes need to be greater than 0");if(i[e]>=n[e]||i[e+n.length]>=n[e])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(e,t,n,r,o,a,s){if(s){if(o.length!==2*(e.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(t.length!==e.length-2)throw new Error("length of strides should be the length of data dimensions");if(r.length!==e.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let u=0;u<e.length-2;u++)i.adjustPadAndReturnShape(e[u+(a?1:2)],t[u],n[u],r[u],o,u,u+e.length-2,s)}}static computePoolOutputShape(e,t,n,r,o,a,s){if(t.length<=0)throw new Error("input shape must be of size greater than 0");const u=[t[0],t[1]];return i.computeShapeHelper(e,t,u,n,r,o,a,s),u}static computeConvOutputShape(e,t,n,r,o,a,s){if(e.length<=0||t.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");const u=[e[0],t[0]];return i.computeShapeHelper(!1,e,u,n,r,o,a,s),u}static computeShapeHelper(e,t,n,r,o,a,s,u){if(e)for(let e=0;e<t.length-2;e++)n.push(1);else for(let e=0;e<t.length-2;e++)n.push(i.adjustPadAndReturnShape(t[e+2],r[e],o[e],a[e],s,e,e+t.length-2,u))}static adjustPadAndReturnShape(e,t,n,r,o,i,a,s){const u=n*(r-1)+1;if(!s||"NOTSET"===s)return Math.floor((e+o[i]+o[a]-u)/t+1);switch(s){case"VALID":return o[i]=0,o[a]=0,Math.floor((e-u)/t+1);case"SAME_LOWER":case"SAME_UPPER":if(1!==n)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{const n=((e+t-1)/t-1)*t+r-e;return o[i]="SAME_LOWER"===s?Math.floor((n+1)/2):Math.floor(n/2),o[a]=n-o[i],Math.floor((e+n-r)/t+1)}default:throw new Error("Unsupported AutoPad type")}}}t.PoolConvUtil=i,t.GemmUtil=class{static getShapeOfGemmResult(e,t,n,o,i){if(2!==e.length||2!==n.length)throw new Error("shape need to be of size 2");let a,s,u;t?(a=e[1],s=e[0]):(a=e[0],s=e[1]);let l=-1;if(o?(u=n[0],l=1):(u=n[1],l=0),n[l]!==s)throw new Error("dimension mismatch");if(a<=0||u<=0||s<=0)throw new Error("invalid shape specified");if(i&&!r.isValidBroadcast(i,[a,u]))throw new Error("gemm: invalid bias shape for broadcast");return[a,u,s]}},t.MIN_CLIP=-34028234663852886e22,t.MAX_CLIP=34028234663852886e22},387:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.createAttributeWithCacheKey=void 0;class n{constructor(e){Object.assign(this,e)}get cacheKey(){return this._cacheKey||(this._cacheKey=Object.getOwnPropertyNames(this).sort().map((e=>`${this[e]}`)).join(";")),this._cacheKey}}t.createAttributeWithCacheKey=e=>new n(e)},7771:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.createGpuDataManager=void 0;const r=n(4955),o=n(1163),i=e=>16*Math.ceil(e/16);let a=0;class s{constructor(e){this.backend=e,this.storageCache=new Map,this.downloadCache=new Map,this.buffersForUploadingPending=[],this.buffersPending=[]}upload(e,t){const n=t.buffer,o=t.byteOffset,a=t.byteLength,s=i(a),u=this.storageCache.get(e);if(!u)throw new Error("gpu data for uploading does not exist");if(u.originalSize!==a)throw new Error(`inconsistent data size. gpu data size=${u.originalSize}, data size=${a}`);const l=this.backend.device.createBuffer({mappedAtCreation:!0,size:s,usage:GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC}),c=l.getMappedRange();new Uint8Array(c).set(new Uint8Array(n,o,a)),l.unmap();const p=this.backend.getCommandEncoder();this.backend.endComputePass(),p.copyBufferToBuffer(l,0,u.gpuData.buffer,0,s),(0,r.LOG_DEBUG)("verbose",(()=>`[WebGPU] GpuDataManager.upload(id=${e})`)),this.buffersForUploadingPending.push(l)}memcpy(e,t){const n=this.storageCache.get(e);if(!n)throw new Error("source gpu data for memcpy does not exist");const r=this.storageCache.get(t);if(!r)throw new Error("destination gpu data for memcpy does not exist");if(n.originalSize!==r.originalSize)throw new Error("inconsistent source and destination gpu data size");const o=i(n.originalSize);this.backend.getCommandEncoder().copyBufferToBuffer(n.gpuData.buffer,0,r.gpuData.buffer,0,o)}create(e,t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){const n=i(e),s=this.backend.device.createBuffer({size:n,usage:t}),u={id:a++,type:o.GpuDataType.default,buffer:s};return this.storageCache.set(u.id,{gpuData:u,originalSize:e}),(0,r.LOG_DEBUG)("verbose",(()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${u.id}`)),u}get(e){var t;return null===(t=this.storageCache.get(e))||void 0===t?void 0:t.gpuData}release(e){const t=this.storageCache.get(e);if(!t)throw new Error("releasing data does not exist");return(0,r.LOG_DEBUG)("verbose",(()=>`[WebGPU] GpuDataManager.release(id=${e}), gpuDataId=${t.gpuData.id}`)),this.storageCache.delete(e),this.buffersPending.push(t.gpuData.buffer),this.downloadCache.get(e)&&this.downloadCache.delete(e),t.originalSize}async download(e){const t=this.downloadCache.get(e);if(t)return t.data;const n=this.storageCache.get(e);if(!n)throw new Error("data does not exist");const r=this.backend.getCommandEncoder();this.backend.endComputePass();const o=this.backend.device.createBuffer({size:n.originalSize,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});r.copyBufferToBuffer(n.gpuData.buffer,0,o,0,n.originalSize),this.backend.flush();const i=new Promise((e=>{o.mapAsync(GPUMapMode.READ).then((()=>{const t=o.getMappedRange().slice(0);o.destroy(),e(t)}))}));return this.downloadCache.set(e,{data:i}),i}refreshPendingBuffers(){for(const e of this.buffersForUploadingPending)e.destroy();for(const e of this.buffersPending)e.destroy()}}t.createGpuDataManager=(...e)=>new s(...e)},8510:function(e,t,n){"use strict";var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){void 0===r&&(r=n);var o=Object.getOwnPropertyDescriptor(t,n);o&&!("get"in o?!t.__esModule:o.writable||o.configurable)||(o={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,r,o)}:function(e,t,n,r){void 0===r&&(r=n),e[r]=t[n]}),o=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),i=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)"default"!==n&&Object.prototype.hasOwnProperty.call(e,n)&&r(t,e,n);return o(t,e),t};Object.defineProperty(t,"__esModule",{value:!0}),t.WEBGPU_OP_RESOLVE_RULES=void 0;const a=i(n(504)),s=n(9770),u=n(4271),l=n(1522),c=i(n(5262)),p=n(2625),d=i(n(9302));t.WEBGPU_OP_RESOLVE_RULES=new Map([["Abs",[d.abs]],["Acos",[d.acos]],["Acosh",[d.acosh]],["Add",[a.add]],["Asin",[d.asin]],["Asinh",[d.asinh]],["Atan",[d.atan]],["Atanh",[d.atanh]],["AveragePool",[c.averagePool,c.parseAveragePoolAttributes]],["Ceil",[d.ceil]],["ClipV10",[d.clipV10]],["Clip",[d.clip]],["Conv",[s.conv,s.parseConvAttributes]],["Cos",[d.cos]],["Cosh",[d.cosh]],["Div",[a.div]],["Elu",[d.elu,d.parseAlphaAttributes]],["Erf",[d.erf]],["Exp",[d.exp]],["Floor",[d.floor]],["Gemm",[u.gemm,u.parseGemmAttributes]],["GlobalAveragePool",[c.globalAveragePool,c.parseGlobalAveragePoolAttributes]],["GlobalMaxPool",[c.globalMaxPool,c.parseGlobalMaxPoolAttributes]],["LeakyRelu",[d.leakyRelu,d.parseAlphaAttributes]],["MatMul",[l.matMul]],["MaxPool",[c.maxPool,c.parseMaxPoolAttributes]],["Mul",[a.mul]],["Neg",[d.neg]],["Pow",[a.pow]],["Reciprocal",[d.reciprocal]],["Relu",[d.relu]],["Sigmoid",[d.sigmoid]],["Sin",[d.sin]],["Sinh",[d.sinh]],["Sqrt",[d.sqrt]],["Sub",[a.sub]],["Tan",[d.tan]],["Tanh",[d.tanh]],["ThresholdedRelu",[d.thresholdedRelu,d.parseAlphaAttributes]],["Transpose",[p.transpose,p.parseTransposeAttributes]]])},1427:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.biasActivationSnippet=t.activationFnSnippet=t.typeSnippet=void 0,t.typeSnippet=e=>{switch(e){case 1:return"f32";case 2:return"vec2<f32>";case 3:return"vec3<f32>";case 4:return"vec4<f32>";default:throw new Error(`${e}-component is not supported.`)}},t.activationFnSnippet=(e,t=!1,n=!1,r=3)=>"",t.biasActivationSnippet=(e,t)=>`\n      ${e?"value = value + getBiasByOutputCoords(coords);":""}\n      ${t?"value = activation(value, coords);":""}\n      `},9456:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.createConv2DMatMulProgramInfo=void 0;const r=n(4955),o=n(6952),i=n(1163),a=n(1427),s=n(4085),u=n(158);t.createConv2DMatMulProgramInfo=(e,t,n,l,c,p,d,f,h)=>{const g="NHWC"===n.format,m=g?e[0].dims[3]:e[0].dims[1],b=l[0],y=g?l[2]:l[3],w=g?l[1]:l[2],_=g?l[3]:l[1],v=((m%4==0||m%3==0)&&g||y%4==0&&!g)&&_%4==0,x=g?_:y*w,T=g?y*w:_,S=v?[8,8,1]:[x<=4?4:16,x>4&&T<=4?4:16,1],O=v?[4,4,1]:[x<=4?1:2,x>4&&T<=4?1:2,1],A=[Math.ceil(x/S[0]/O[0]),Math.ceil(T/S[1]/O[1]),Math.ceil(b/S[2]/O[1])];(0,r.LOG_DEBUG)("verbose",(()=>`[conv2d_mm_webgpu] dispatch = ${A}`));const E=v?g&&m%4!=0?3:4:O[0],I=S[1]*O[1],$=S[0]*O[0],P=Math.max(S[0]*E,S[1]),D=c%I==0,k=p%$==0,C=d%P==0,R=v?[E,4,4]:[1,1,1],M=[`@group(0) @binding(0) var<storage, read> x: array<${v&&4===E?"vec4<f32>":"f32"}>;`,`@group(0) @binding(1) var<storage, read> w: array<${v?"vec4<f32>":"f32"}>;`];let N=`\n      fn setOutputAtIndex(flatIndex : i32, value : ${v?"vec4<f32>":"f32"}) {\n        result[flatIndex] = ${v?"vec4<f32>":"f32"}(value);\n      }\n      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${v?"vec4<f32>":"f32"}) {\n        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));\n        setOutputAtIndex(flatIndex ${v?"/ 4":""}, value);\n      }`;return f&&(M.push(`@group(0) @binding(2) var<storage, read> bias: array<${v?"vec4<f32>":"f32"}>;`),N+=`\n        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${v?"vec4<f32>":"f32"} {\n          return bias[coords.${g?"w":"y"}${v?"/ 4":""}];\n        }`),Object.assign(Object.assign({},t),{outputs:[{dims:l,dataType:e[0].dataType,gpuDataType:i.GpuDataType.default}],dispatchGroup:()=>({x:A[0],y:A[1],z:A[2]}),getShaderSource:()=>`\n        ${s.utilFunctions}\n        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,\n        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,\n        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };\n        ${M.join("")}\n        @group(0) @binding(${M.length}) var<storage, read_write> result: array<${v?"vec4<f32>":"f32"}>;\n        //@group(0) @binding(${M.length+1}) var<uniform> uniforms: Uniforms;\n\n        const xShape : vec4<i32> = vec4<i32>(${e[0].dims.join(",")});\n        const wShape : vec4<i32> = vec4<i32>(${e[1].dims.join(",")});\n        const outShape : vec4<i32> = vec4<i32>(${l.join(",")});\n        const outShapeStrides : vec3<i32> = vec3<i32>(${o.ShapeUtil.computeStrides(l).slice(0,3).join(",")});\n        const filterDims : vec2<i32> = vec2<i32>(${n.kernelShape[0]}, ${n.kernelShape[1]});\n        const pad : vec2<i32> = vec2<i32>(${n.pads[0]}, ${n.pads[1]});\n        const stride : vec2<i32> = vec2<i32>(${n.strides[0]}, ${n.strides[1]});\n        const dilation : vec2<i32> = vec2<i32>(${n.dilations[0]}, ${n.dilations[1]});\n        const dimAOuter : i32 = ${c};\n        const dimBOuter : i32 = ${p};\n        const dimInner : i32 = ${d};\n        ${N}\n        ${((e,t,n,r,o=!1,i,s=!1,u=4,l=4,c=4)=>{const p=e?"\n    let coord = vec4<i32>(batch, xRow, xCol, xCh);\n    ":"\n    let coord = vec4<i32>(batch, xCh, xRow, xCol);\n    ",d=e?"\n    let coords = vec4<i32>(\n      batch,\n      row / outWidth,\n      row % outWidth,\n      col);\n    ":"\n    let coords = vec4<i32>(\n      batch,\n      row,\n      col / outWidth,\n      col % outWidth);\n    ",f=e?"xShape[1]":"xShape[2]",h=e?"xShape[2]":"xShape[3]",g=e?"row":"col",m=e?"col":"row",b=`\n    let inChannels = wShape[2];\n    let outWidth = ${e?"outShape[2]":"outShape[3]"};\n    let outRow = ${g} / outWidth;\n    let outCol = ${g} % outWidth;\n\n    let WRow = ${m} / (filterDims[1] * inChannels);\n    let WCol = ${m} / inChannels % filterDims[1];\n    let xRow = outRow * stride[0] + dilation[0] * WRow - pad[0];\n    let xCol = outCol * stride[1] + dilation[1] * WCol - pad[1];\n    let xCh = ${m} % inChannels;\n    var resData = ${(0,a.typeSnippet)(u)}(0.0);\n    // The bounds checking is always needed since we use it to pad zero for\n    // the 'same' padding type.\n    if (xRow >= 0 && xRow < ${f} && xCol >= 0 && xCol < ${h}) {\n      ${p}\n      let xIndex = getIndexFromCoords4D(coord, xShape);\n      ${(e=>{switch(e){case 1:return"resData = x[xIndex];";case 3:return"resData = vec3<f32>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);";case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${e} is not supported.`)}})(u)}\n    }\n    return resData;`,y=e?t&&r?`\n    let col = colIn * ${u};\n    ${b}`:`\n    let col = colIn * ${u};\n    if (row < dimAOuter && col < dimInner) {\n      ${b}\n    }\n    return ${(0,a.typeSnippet)(u)}(0.0);`:r&&n?`\n    let col = colIn * ${u};\n    ${b}`:`\n    let col = colIn * ${u};\n    if (row < dimInner && col < dimBOuter) {\n      ${b}\n    }\n    return ${(0,a.typeSnippet)(u)}(0.0);`,w=`${(e=>{switch(e){case 1:return"return w[row * wShape[3] + colIn];";case 4:return"return w[row * wShape[3] / 4 + colIn];";default:throw new Error(`innerElementSize ${e} is not supported.`)}})(l)}`,_=(0,a.typeSnippet)(c),v=e?(0,a.typeSnippet)(u):(0,a.typeSnippet)(l),x=e?(0,a.typeSnippet)(l):(0,a.typeSnippet)(u);return`\n    ${(0,a.activationFnSnippet)(i,s,4===c,4)}\n    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${v} {\n      ${e?y:w}\n    }\n\n    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${x} {\n      ${e?w:y}\n    }\n\n    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${_}) {\n      let col = colIn * ${c};\n      if (row < dimAOuter && col < dimBOuter)\n      {\n      var value = valueIn;\n      let outWidth = ${e?"outShape[2]":"outShape[3]"};\n      ${d}\n      ${(0,a.biasActivationSnippet)(o,i)}\n      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);\n      }\n    }`})(g,D,k,C,f,void 0,!1,R[0],R[1],R[2])}\n            ${v?(0,u.makeMatMulPackedVec4Source)(O,S,!g,P):(0,u.makeMatMulPackedSource)(O,S,!g,P,!1,void 0,h)}`})}},4085:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.utilFunctions=void 0,t.utilFunctions="\nfn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {\n  return dot(coords, vec4<i32>(\n      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));\n}\nfn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {\n  return dot(coords, vec4<i32>(\n    outShapeStrides.x, outShapeStrides.y, outShapeStrides.z, 1));\n}\n"},158:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.makeMatMulPackedSource=t.makeMatMulPackedVec4Source=void 0,t.makeMatMulPackedVec4Source=(e,t,n=!1,r=32,o=!1,i=32,a=!1)=>{const s=t[1]*e[1],u=t[0]*e[0],l=n?s:r,c=n?r:s,p=l/t[0],d=r/t[1];if((!n||4!==p||4!==e[1])&&(n||3!==p&&4!==p)||l%t[0]!=0||r%t[1]!=0||4!==e[0])throw new Error(`If transposeA ${n} is true, innerElementSize ${p} and workPerThread[1] ${e[1]} must be 4.\n      Otherwise, innerElementSize ${p} must be 3 or 4.\n  tileAWidth ${l} must be divisible by workgroupSize[0]${t[0]}. tileInner ${r} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`\nvar<workgroup> mm_Asub : array<array<vec${p}<f32>, ${l/p}>, ${c}>;\nvar<workgroup> mm_Bsub : array<array<vec4<f32>, ${u/e[0]}>, ${r}>;\n\nconst rowPerThread = ${e[1]};\nconst colPerThread = ${e[0]};\nconst innerElementSize = ${p};\nconst tileInner = ${r};\n\n@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})\nfn main(@builtin(local_invocation_id) localId : vec3<u32>,\n        @builtin(global_invocation_id) globalId : vec3<u32>,\n        @builtin(workgroup_id) workgroupId : vec3<u32>) {\n  let localRow = i32(localId.y);\n  let tileRow = ${a?"0":"localRow * rowPerThread"};\n  let tileCol = i32(localId.x);\n\n  let globalRow = ${a?"0":"i32(globalId.y) * rowPerThread"};\n  let globalCol = i32(globalId.x);\n  let batch = ${o?"0":"i32(globalId.z)"};\n  let globalRowStart = i32(workgroupId.y) * ${s};\n\n  let numTiles = ${o?`${Math.ceil(i/r)}`:"(dimInner - 1) / tileInner + 1"};\n  var kStart = ${o?`i32(globalId.z) * ${i}`:"0"};\n\n  var acc: array<vec4<f32>, rowPerThread>;\n\n  // Loop over shared dimension.\n  let tileRowB = localRow * ${d};\n  for (var t = 0; t < numTiles; t = t + 1) {\n      // Load one tile of A into local memory.\n      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {\n          let inputRow = tileRow + innerRow;\n          let inputCol = tileCol;\n          ${f=n,f?"\n        mm_Asub[inputRow][inputCol] = mm_readA(batch,\n          kStart + inputRow,\n          globalRowStart / innerElementSize + inputCol);\n        ":"\n        mm_Asub[inputRow][inputCol] = mm_readA(batch,\n          globalRow + innerRow,\n          kStart / innerElementSize + inputCol);\n        "}\n      }\n\n      // Load one tile of B into local memory.\n      for (var innerRow = 0; innerRow < ${d}; innerRow = innerRow + 1) {\n          let inputRow = tileRowB + innerRow;\n          let inputCol = tileCol;\n          mm_Bsub[inputRow][inputCol] = mm_readB(batch, kStart + inputRow, globalCol);\n      }\n      kStart = kStart + tileInner;\n      workgroupBarrier();\n\n      // Compute acc values for a single thread.\n      for (var k = 0; k < tileInner / innerElementSize; k = k + 1) {\n          let BCached0 = mm_Bsub[k * innerElementSize][tileCol];\n          let BCached1 = mm_Bsub[k * innerElementSize + 1][tileCol];\n          let BCached2 = mm_Bsub[k * innerElementSize + 2][tileCol];\n          ${3===p?"":"let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}\n\n          ${((e,t)=>e?`\n        let ACached0 = mm_Asub[k * innerElementSize][localRow];\n        let ACached1 = mm_Asub[k * innerElementSize + 1][localRow];\n        let ACached2 = mm_Asub[k * innerElementSize + 2][localRow];\n        ${3===t?"":"let ACached3 = mm_Asub[k * innerElementSize + 3][localRow];"}\n        for (var i = 0; i < rowPerThread; i = i + 1) {\n          acc[i] = BCached0 * ACached0[i] + acc[i];\n          acc[i] = BCached1 * ACached1[i] + acc[i];\n          acc[i] = BCached2 * ACached2[i] + acc[i];\n          ${3===t?"":"acc[i] = BCached3 * ACached3[i] + acc[i];"}\n        }`:`\n        for (var i = 0; i < rowPerThread; i = i + 1) {\n          let ACached = mm_Asub[tileRow + i][k];\n          acc[i] = BCached0 * ACached.x + acc[i];\n          acc[i] = BCached1 * ACached.y + acc[i];\n          acc[i] = BCached2 * ACached.z + acc[i];\n          ${3===t?"":"acc[i] = BCached3 * ACached.w + acc[i];"}\n        }`)(n,p)}\n      }\n\n      workgroupBarrier();\n  }\n\n  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {\n      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);\n  }\n}`;var f};const n=e=>e?"\n            mm_Asub[inputRow][inputCol] = mm_readA(batch,\n              kStart + inputRow,\n              globalRowStart + inputCol);\n            ":"\n            mm_Asub[inputRow][inputCol] = mm_readA(batch,\n              globalRowStart + inputRow,\n              kStart + inputCol);\n            ";t.makeMatMulPackedSource=(e,t,r=!1,o=32,i=!1,a=32,s=!1)=>{const u=e[1]*t[1],l=e[0]*t[0],c=r?u:o,p=r?o:u;if(p%t[1]!=0||c%t[0]!=0||o%t[1]!=0)throw new Error(`tileAHight ${p} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${c} must be divisible by workgroupSize[0]${t[0]}, tileInner ${o} must be divisible by workgroupSize[1]${t[1]}`);const d=p/t[1],f=c/t[0],h=o/t[1],g=s?`\n    let localRow = i32(localId.y);\n    let localCol = i32(localId.x);\n    let globalRowStart = i32(workgroupId.y) * ${u};\n    let globalColStart = i32(workgroupId.x) * ${l};\n\n    // Loop over shared dimension.\n    for (var t = 0; t < numTiles; t = t + 1) {\n      // Load one tile of A into local memory.\n      for (var inputRow = localRow; inputRow < ${p}; inputRow = inputRow + ${t[1]}) {\n        for (var inputCol = localCol; inputCol < ${c}; inputCol = inputCol + ${t[0]}) {\n          ${n(r)}\n        }\n      }\n      // Load one tile of B into local memory.\n      for (var inputRow = localRow; inputRow < ${o}; inputRow = inputRow + ${t[1]}) {\n            for (var inputCol = localCol; inputCol < ${l}; inputCol = inputCol + ${t[0]}) {\n          mm_Bsub[inputRow][inputCol] = mm_readB(batch,\n            kStart + inputRow,\n            globalColStart + inputCol);\n        }\n      }\n      kStart = kStart + tileInner;\n      workgroupBarrier();\n\n      // Compute acc values for a single thread.\n      var BCached : array<f32, colPerThread>;\n      for (var k = 0; k < tileInner; k = k + 1) {\n        for (var inner = 0; inner < colPerThread; inner = inner + 1) {\n          BCached[inner] = mm_Bsub[k][localCol + inner * ${t[0]}];\n        }\n        for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {\n          let ACached = ${r?`mm_Asub[k][localRow + innerRow * ${t[1]}];`:`mm_Asub[localRow + innerRow * ${t[1]}][k];`}\n          for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {\n            acc[innerRow][innerCol] = acc[innerRow][innerCol] +\n                ACached * BCached[innerCol];\n          }\n        }\n      }\n      workgroupBarrier();\n    }\n    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {\n      let gRow = globalRowStart + localRow + innerRow * ${t[1]};\n      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {\n        let gCol = globalColStart + localCol + innerCol * ${t[0]};\n        mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);\n      }\n    }\n    `:`\nlet tileRow = i32(localId.y) * rowPerThread;\nlet tileCol = i32(localId.x) * colPerThread;\n\nlet globalRow = i32(globalId.y) * rowPerThread;\nlet globalCol = i32(globalId.x) * colPerThread;\nlet globalRowStart = i32(workgroupId.y) * ${u};\n\nlet tileRowA = i32(localId.y) * ${d};\nlet tileColA = i32(localId.x) * ${f};\nlet tileRowB = i32(localId.y) * ${h};\n// Loop over shared dimension.\nfor (var t = 0; t < numTiles; t = t + 1) {\n  // Load one tile of A into local memory.\n  for (var innerRow = 0; innerRow < ${d}; innerRow = innerRow + 1) {\n    for (var innerCol = 0; innerCol < ${f}; innerCol = innerCol + 1) {\n      let inputRow = tileRowA + innerRow;\n      let inputCol = tileColA + innerCol;\n      ${n(r)}\n    }\n  }\n\n  // Load one tile of B into local memory.\n  for (var innerRow = 0; innerRow < ${h}; innerRow = innerRow + 1) {\n    for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {\n      let inputRow = tileRowB + innerRow;\n      let inputCol = tileCol + innerCol;\n      mm_Bsub[inputRow][inputCol] = mm_readB(batch,\n        kStart + inputRow,\n        globalCol + innerCol);\n    }\n  }\n  kStart = kStart + tileInner;\n  workgroupBarrier();\n\n  // Compute acc values for a single thread.\n  var BCached : array<f32, colPerThread>;\n  for (var k = 0; k < tileInner; k = k + 1) {\n    for (var inner = 0; inner < colPerThread; inner = inner + 1) {\n      BCached[inner] = mm_Bsub[k][tileCol + inner];\n    }\n\n    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {\n      ${(e=>e?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];")(r)}\n      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {\n        acc[innerRow][innerCol] = acc[innerRow][innerCol] + ACached * BCached[innerCol];\n      }\n    }\n  }\n\n  workgroupBarrier();\n}\n\nfor (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {\n  for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {\n    mm_write(batch, globalRow + innerRow, globalCol + innerCol,\n        acc[innerRow][innerCol]);\n  }\n}\n`;return`\n  var<workgroup> mm_Asub : array<array<f32, ${c}>, ${p}>;\n  var<workgroup> mm_Bsub : array<array<f32, ${l}>, ${o}>;\n  const rowPerThread = ${e[1]};\n  const colPerThread = ${e[0]};\n  const tileInner = ${o};\n\n@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})\nfn main(@builtin(local_invocation_id) localId : vec3<u32>,\n        @builtin(global_invocation_id) globalId : vec3<u32>,\n        @builtin(workgroup_id) workgroupId : vec3<u32>) {\n    let batch = ${i?"0":"i32(globalId.z)"};\n    let numTiles = ${i?`${Math.ceil(a/o)}`:"(dimInner - 1) / tileInner + 1"};\n    var kStart = ${i?`i32(globalId.z) * ${a}`:"0"};\n\n    var acc : array<array<f32, colPerThread>, rowPerThread>;\n\n    // Without this initialization strange values show up in acc.\n    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {\n      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {\n        acc[innerRow][innerCol] = 0.0;\n      }\n    }\n    ${g}\n  }\n`}},504:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.sub=t.pow=t.mul=t.div=t.add=void 0;const r=n(6952),o=n(1163),i=n(2075),a=(e,t,n,a,s)=>{const u={name:t,inputTypes:[o.GpuDataType.default,o.GpuDataType.default],cacheHint:s};return Object.assign(Object.assign({},u),{get:()=>((e,t,n,a,s,u=t.dataType)=>{var l,c;const p=!r.ShapeUtil.areEqual(t.dims,n.dims);let d=t.dims,f=r.ShapeUtil.size(t.dims),h=!1;if(p){const e=r.BroadcastUtil.calcShape(t.dims,n.dims,!1);if(!e)throw new Error("Can't perform binary op on the given tensors");d=e,f=r.ShapeUtil.size(d);let o=1;for(let e=0;e<d.length;e++){const r=null!==(l=t.dims[t.dims.length-e])&&void 0!==l?l:1;if(r!==(null!==(c=n.dims[n.dims.length-e])&&void 0!==c?c:1))break;o*=r}o%4==0&&(h=!0)}else h=!0;return Object.assign(Object.assign({},e),{getShaderSource:e=>((e,t,n,o,a,s,u,l,c="f32",p="f32",d="f32")=>{const f=r.ShapeUtil.size(o),h=Math.ceil(f/4);let g,m;"string"==typeof u?g=m=(e,t)=>`${u}((${e}),(${t}))`:"function"==typeof u?g=m=u:(g=u.scalar,m=u.vector);let b="";const y=(0,i.createIndicesHelper)("output",o);if(s){const e=e=>{const t=r.ShapeUtil.computeStrides(e),n=[];for(let r=e.length-1;r>=0;r--){const i=0===o.length?"0u":1===o.length?"(*outputIndices)":`(*outputIndices)[${r+o.length-e.length}]`;n.push(`${t[r]}u * (${i} % ${e[r]}u)`)}return n.length>0?n.join("+"):"0u"};b=`\n  ${y.o2iImpl}\n\n  fn calcOffsetA(outputIndices: ptr<function, ${y.iType}>) -> u32 {\n    return ${e(t)};\n  }\n\n  fn calcOffsetB(outputIndices: ptr<function, ${y.iType}>) -> u32 {\n    return ${e(n)};\n  }\n  `}let w;if(a)w=s?`\n      ${y.indicesVariableDeclaration("outputIndices")}\n      ${y.o2iCall("global_idx * 4u","outputIndices")}\n      let offsetA = calcOffsetA(&outputIndices);\n      let offsetB = calcOffsetB(&outputIndices);\n      outputData[global_idx] = ${m("aData[offsetA / 4u]","bData[offsetB / 4u]")};`:`outputData[global_idx] = ${m("aData[global_idx]","bData[global_idx]")};`;else{if(!s)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");const e=e=>{const t=`aData[indexA${e}][componentA${e}]`,n=`bData[indexB${e}][componentB${e}]`;return`\n      ${y.o2iCall(`global_idx * 4u + ${e}u`,"outputIndices")}\n      let offsetA${e} = calcOffsetA(&outputIndices);\n      let offsetB${e} = calcOffsetB(&outputIndices);\n      let indexA${e} = offsetA${e} / 4u;\n      let indexB${e} = offsetB${e} / 4u;\n      let componentA${e} = offsetA${e} % 4u;\n      let componentB${e} = offsetB${e} % 4u;\n      outputData[global_idx][${e}] = ${g(t,n)};`};w=`\n      ${y.indicesVariableDeclaration("outputIndices")}\n      ${e(0)}\n      ${e(1)}\n      ${e(2)}\n      ${e(3)}`}return`\n  @group(0) @binding(0) var<storage, read> aData : array<vec4<${c}>>;\n  @group(0) @binding(1) var<storage, read> bData : array<vec4<${p}>>;\n  @group(0) @binding(2) var<storage, read_write> outputData : array<vec4<${d}>>;\n\n  ${null!=l?l:""}\n  ${b}\n\n  ${e.mainStart()}\n    ${e.guardAgainstOutOfBoundsWorkgroupSizes(h)}\n    ${w}\n  }`})(e,t.dims,n.dims,d,h,p,a,s),outputs:[{dims:d,dataType:u,gpuDataType:o.GpuDataType.default}],dispatchGroup:()=>({x:Math.ceil(f/64/(h?4:1))})})})(u,e[0],e[1],n,a)})};t.add=e=>{e.compute(a(e.inputs,"Add",((e,t)=>`${e}+${t}`)))},t.div=e=>{e.compute(a(e.inputs,"Div",((e,t)=>`${e}/${t}`)))},t.mul=e=>{e.compute(a(e.inputs,"Mul",((e,t)=>`${e}*${t}`)))},t.pow=e=>{e.compute(a(e.inputs,"Pow",{scalar:(e,t)=>`pow_f32(${e},${t})`,vector:(e,t)=>`pow_vf32(${e},${t})`},"\n    fn pow_f32(a : f32, b : f32) -> f32 {\n      if (b == 0.0) {\n        return 1.0;\n      } else if (a < 0.0 && b != floor(b)) {\n        return pow(a, b); // NaN\n      }\n      return select(sign(a), 1.0, round(abs(b) % 2.0) != 1.0) * pow(abs(a), b);\n    }\n    fn pow_vf32(a : vec4<f32>, b : vec4<f32>) -> vec4<f32> {\n      // TODO: implement vectorized pow\n      return vec4<f32>(pow_f32(a.x, b.x), pow_f32(a.y, b.y), pow_f32(a.z, b.z), pow_f32(a.w, b.w));\n    }\n      "))},t.sub=e=>{e.compute(a(e.inputs,"Sub",((e,t)=>`${e}-${t}`)))}},2075:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.createShaderHelper=t.createIndicesHelper=t.WORKGROUP_SIZE=void 0;const r=n(6952);t.WORKGROUP_SIZE=64,t.createIndicesHelper=(e,t)=>{const n=t.length<2?"u32":`array<u32, ${t.length}>`,o=r.ShapeUtil.computeStrides(t);let i="";for(let e=0;e<t.length-1;e++)i+=`\n    let dim${e} = current / ${o[e]}u;\n    let rest${e} = current % ${o[e]}u;\n    (*indices)[${e}] = dim${e};\n    current = rest${e};\n    `;i+=`(*indices)[${t.length-1}] = current;`;const a=t.length<2?"":`\n  fn ih_o2i_${e}(offset: u32, indices: ptr<function, ${n}>) {\n    var current = offset;\n    ${i}\n  }`,s=[];if(0===t.length)s.push("0u");else if(t.length<2)s.push("(*indices)");else for(let e=t.length-1;e>=0;e--)s.push(`${o[e]}u * ((*indices)[${e}])`);return{o2iImpl:a,o2iCall:(n,r)=>t.length<2?`${r}=${n};`:`ih_o2i_${e}(${n}, &${r});`,i2oImpl:t.length<2?"":`\n  fn ih_i2o_${e}(indices: ptr<function, ${n}>) -> u32 {\n    return ${s.join("+")};\n  }`,i2oExpression:(n,r)=>t.length<2?`(${r?"*":""}${n})`:`ih_i2o_${e}(${r?"":"&"}${n})`,indicesVariableDeclaration:(e,t)=>`var ${e}:${n}${t?`=${n}(${t.join(",")})`:""};`,iType:n}};class o{constructor(e){this.normalizedDispatchGroup=e}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${"number"==typeof e?`${e}u`:e}) { return; }`}mainStart(e=t.WORKGROUP_SIZE){const n="number"==typeof e?e:e[0],r="number"==typeof e?1:e[1],o="number"==typeof e?1:e[2],i=1===this.normalizedDispatchGroup[1]&&1===this.normalizedDispatchGroup[2];return`@compute @workgroup_size(${n}, ${r}, ${o})\n  fn main(${i?"@builtin(global_invocation_id) global_id : vec3<u32>":"@builtin(local_invocation_index) local_index : u32,\n    @builtin(workgroup_id) workgroup_id : vec3<u32>"}) {\n    ${i?"let global_idx = global_id.x;":`let global_idx = (workgroup_id.z * ${this.normalizedDispatchGroup[0]*this.normalizedDispatchGroup[1]}u +\n          workgroup_id.y * ${this.normalizedDispatchGroup[0]}u + workgroup_id.x) * ${n*r*o}u + local_index;`}\n  `}}t.createShaderHelper=e=>new o(e)},9192:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.createGroupedConvProgramInfoLoader=void 0;const r=n(6952),o=n(1163),i=n(2075),a=n(9770),s=n(3997);t.createGroupedConvProgramInfoLoader=(e,t,n)=>{const u=(l=e.length>2,c=t.cacheKey,{name:"GroupedConv",inputTypes:l?[o.GpuDataType.default,o.GpuDataType.default,o.GpuDataType.default]:[o.GpuDataType.default,o.GpuDataType.default],cacheHint:c});var l,c;return Object.assign(Object.assign({},u),{get:()=>((e,t,n,u)=>{const l=e.length>2,c=l?"value += b[output_channel];":"",p=e[0].dims,d=e[1].dims,f=d[0]/n.group,h="f32",{activationFunction:g,applyActivation:m}=(0,s.getActicationSnippet)(n),b=[`@group(0) @binding(0) var<storage, read> x : array<${h}>;`,`@group(0) @binding(1) var<storage, read> w : array<${h}>;`];l&&b.push(`@group(0) @binding(2) var<storage, read> b : array<${h}>;`);const y="NHWC"===n.format,w=(0,a.calculateOutputShape)(p,d,n.dilations,n.pads,n.strides,y),_=r.ShapeUtil.size(w),v=(0,i.createIndicesHelper)("output",w),x=(0,i.createIndicesHelper)("x",p),T=(0,i.createIndicesHelper)("w",d);return Object.assign(Object.assign({},t),{outputs:[{dims:u?u(w):w,dataType:e[0].dataType,gpuDataType:o.GpuDataType.default}],getShaderSource:e=>`\n  const strides: vec2<u32> = vec2(${n.strides[0]}u, ${n.strides[1]}u);\n  const pads: vec2<u32> = vec2(${n.pads[0]}u, ${n.pads[1]}u);\n\n  ${b.join("\n")}\n  @group(0) @binding(${b.length}) var<storage, read_write> output : array<${h}>;\n\n  ${g}\n  ${v.o2iImpl}\n  ${x.i2oImpl}\n  ${T.i2oImpl}\n\n  ${e.mainStart()}\n    ${e.guardAgainstOutOfBoundsWorkgroupSizes(_)}\n\n    ${v.indicesVariableDeclaration("outputIndices")}\n    ${v.o2iCall("global_idx","outputIndices")}\n    let batch: u32 = outputIndices[0];\n    let output_channel: u32 = outputIndices[${y?3:1}];\n    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${y?1:2}], outputIndices[${y?2:3}]) * strides - pads;\n    let group_id: u32 = output_channel / ${f}u;\n\n    var value: ${h} = ${h}(0);\n    for (var wInChannel: u32 = 0u; wInChannel < ${d[1]}u; wInChannel++) {\n      let input_channel = group_id * ${d[1]}u + wInChannel;\n      for (var wHeight: u32 = 0u; wHeight < ${d[2]}u; wHeight++) {\n        let xHeight = xRCCorner.x + wHeight * ${n.dilations[0]}u;\n\n        if (xHeight < 0u || xHeight >= ${p[y?1:2]}u) {\n          continue;\n        }\n\n        for (var wWidth: u32 = 0u; wWidth < ${d[3]}u; wWidth++) {\n          let xWidth = xRCCorner.y + wWidth * ${n.dilations[1]}u;\n          if (xWidth < 0u || xWidth >= ${p[y?2:3]}u) {\n            continue;\n          }\n\n          ${x.indicesVariableDeclaration("xIndices",y?["batch","xHeight","xWidth","input_channel"]:["batch","input_channel","xHeight","xWidth"])}\n          let xVal = x[${x.i2oExpression("xIndices")}];\n          ${T.indicesVariableDeclaration("wIndices",["output_channel","wInChannel","wHeight","wWidth"])}\n          let wVal = w[${T.i2oExpression("wIndices")}];\n          value += xVal*wVal;\n        }\n      }\n    }\n    ${c}\n    ${m}\n    output[global_idx] = value;\n  }`,dispatchGroup:()=>({x:Math.ceil(_/64)})})})(e,u,t,n)})}},9770:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.conv=t.parseConvAttributes=t.calculateOutputShape=void 0;const r=n(6952),o=n(387),i=n(9192),a=n(3822),s=n(3997),u=n(2625);t.calculateOutputShape=(e,t,n,r,o,i)=>{const a=e[0],s=e.slice(i?1:2,i?3:4),u=s.length,l=t[0],c=t.slice(2).map(((e,t)=>e+(e-1)*(n[t]-1))),p=s.map(((e,t)=>e+r[t]+r[t+u])).map(((e,t)=>Math.floor((e-c[t]+o[t])/o[t])));return p.splice(0,0,a),p.splice(i?3:1,0,l),p};const l=(0,o.createAttributeWithCacheKey)({perm:[2,3,1,0]}),c=(e,t)=>{const n=e.kernelShape.slice();for(let e=2;e<t[1].dims.length;++e)0===n[e-2]&&(n[e-2]=t[1].dims[e]);const o=e.pads.slice();r.PoolConvUtil.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,n,o,"NHWC"===e.format,e.autoPad);const i=Object.assign({},e);return Object.assign(i,{kernelShape:n,pads:o,cacheKey:e.cacheKey}),i};t.parseConvAttributes=e=>{const t=(0,s.parseInternalActivationAttributes)(e),n=e.format,r=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],i=e.dilations,a=e.group,u=e.kernel_shape,l=e.pads,c=e.strides,p=e.w_is_const();return(0,o.createAttributeWithCacheKey)(Object.assign({autoPad:r,format:n,dilations:i,group:a,kernelShape:u,pads:l,strides:c,wIsConst:p},t))},t.conv=(e,n)=>{((e,t)=>{if(!e||2!==e.length&&3!==e.length)throw new Error("Conv requires 2 or 3 inputs");if(4!==e[0].dims.length&&3!==e[0].dims.length)throw new Error("currently only support conv 1D and 2D");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");if(e[0].dims["NHWC"===t.format?e[0].dims.length-1:1]!==e[1].dims[1]*t.group)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(3===e.length&&(1!==e[2].dims.length||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");const n=e[0].dims.length-2;if(t.dilations.length!==n)throw new Error(`dilations should be ${n}D`);if(t.strides.length!==n)throw new Error(`strides should be ${n}D`);if(t.pads.length!==2*n)throw new Error(`pads should be ${2*n}D`);if(0!==t.kernelShape.length&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(1!==e[0].dataType||1!==e[1].dataType)throw new Error("Conv input(X,W) should be float tensor");if(3===e.length&&1!==e[2].dataType)throw new Error("Conv input(bias) should be float tensor")})(e.inputs,n),3===e.inputs[0].dims.length?((e,t)=>{const n="NHWC"===t.format,r=[e.inputs[0].reshape(n?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];3===e.inputs.length&&r.push(e.inputs[2]);const o=[0,t.pads[0],0,t.pads[1]],a=[1].concat(t.strides),s=[1].concat(t.dilations),u=[1].concat(t.kernelShape),l=c(Object.assign(Object.assign({},t),{pads:o,strides:a,dilations:s,kernelShape:u}),r);e.compute((0,i.createGroupedConvProgramInfoLoader)(r,l,(e=>n?[e[0],e[2],e[3]]:[])))})(e,n):((e,n,r)=>{var o;const s=c(r,n),p=3===n.length,d="NHWC"===r.format,f=n[0].dims[d?1:2],h=n[0].dims[d?2:3],g=n[0].dims[d?3:1],m=n[1].dims[2],b=n[1].dims[3],y=(0,t.calculateOutputShape)(n[0].dims,n[1].dims,r.dilations,s.pads,r.strides,d),w=y[d?1:2],_=y[d?2:3],v=y[d?3:1];if(d&&m===f&&b===h&&"VALID"===r.autoPad||1===m&&1===b&&1===r.dilations[0]&&1===r.dilations[1]&&1===r.strides[0]&&1===r.strides[1]&&("SAME_UPPER"===r.autoPad||"SAME_LOWER"===r.autoPad||"VALID"===r.autoPad))return void e.compute((0,i.createGroupedConvProgramInfoLoader)(n,s));if(!d||1!==r.group)return void e.compute((0,i.createGroupedConvProgramInfoLoader)(n,s));const x=d?w*_:v,T=d?v:w*_,S=m*b*g,O=null!==(o=e.customData.wT)&&void 0!==o?o:e.compute(Object.assign(Object.assign({},u.transposeProgramMetadata),{cacheHint:l.cacheKey,get:()=>(0,u.createTransposeProgramInfo)(n[1],l.perm)}),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.customData.wT&&(e.customData.wT=O);const A=[n[0],O];p&&(d||1!==n[2].dims.length?A.push(n[2]):A.push(n[2].reshape([n[2].dims[0],1,1]))),e.compute((0,a.createConv2DMatMulProgramInfoLoader)(A,s,y,x,T,S,p,!0),{inputs:A})})(e,e.inputs,n)}},3822:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.createConv2DMatMulProgramInfoLoader=void 0;const r=n(1163),o=n(9456);t.createConv2DMatMulProgramInfoLoader=(e,t,n,i,a,s,u,l)=>{const c=((e,t)=>({name:"Conv2DMatMul",inputTypes:e?[r.GpuDataType.default,r.GpuDataType.default,r.GpuDataType.default]:[r.GpuDataType.default,r.GpuDataType.default],cacheHint:t}))(u,t.cacheKey);return Object.assign(Object.assign({},c),{get:()=>(0,o.createConv2DMatMulProgramInfo)(e,c,t,n,i,a,s,u,l)})}},3997:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.parseInternalActivationAttributes=t.getActicationSnippet=void 0;const r=n(6952);t.getActicationSnippet=e=>{switch(e.activation){case"Relu":return{activationFunction:"",applyActivation:"value = max(value, 0.0);"};case"Sigmoid":return{activationFunction:"",applyActivation:"value = (1.0 / (1.0 + exp(-value)));"};case"Clip":return{activationFunction:`const clip_min_=f32(${e.clipMin});const clip_max_=f32(${e.clipMax});`,applyActivation:"value = clamp(value, clip_min_, clip_max_);"};default:return{activationFunction:"",applyActivation:""}}},t.parseInternalActivationAttributes=e=>{const t=(null==e?void 0:e.activation)||"";if("Clip"===t){const[n,o]=(null==e?void 0:e.activation_params)||[r.MIN_CLIP,r.MAX_CLIP];return{activation:t,clipMax:o,clipMin:n,activationCacheKey:`${t}:${n},${o}`}}return{activation:t,activationCacheKey:t}}},4271:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.parseGemmAttributes=t.gemm=void 0;const r=n(6952),o=n(387),i=n(1163);t.gemm=(e,t)=>{(e=>{if(!e)throw new Error("Input is missing");if(e.length<2||e.length>3)throw new Error("Invaid input number.");if(3===e.length&&e[2].dims.length>2)throw new Error("Invalid input shape of C");if(1!==e[0].dataType||1!==e[1].dataType||3===e.length&&1!==e[2].dataType)throw new Error("Invalid input type.");if(e[0].dataType!==e[1].dataType||3===e.length&&e[0].dataType!==e[2].dataType)throw new Error("Input types are mismatched")})(e.inputs),e.compute(((e,t)=>{const n={name:"Gemm",inputTypes:3===e.length?[i.GpuDataType.default,i.GpuDataType.default,i.GpuDataType.default]:[i.GpuDataType.default,i.GpuDataType.default],cacheHint:t.cacheKey};return Object.assign(Object.assign({},n),{get:()=>((e,t,n)=>{const o=t[0].dims.slice(),a=t[1].dims.slice(),[s,u,l]=r.GemmUtil.getShapeOfGemmResult(o,n.transA,a,n.transB,3===t.length?t[2].dims:void 0),c=[s,u];if(!c)throw new Error("Can't use gemm on the given tensors");const p=r.ShapeUtil.size(c);let d="";n.transA&&n.transB?d="value += a[k * M + m] * b[n * K + k];":n.transA&&!n.transB?d="value += a[k * M + m] * b[k * N + n];":!n.transA&&n.transB?d="value += a[m * K + k] * b[n * K + k];":n.transA||n.transB||(d="value += a[m * K + k] * b[k * N + n];");const f="f32",h=1===n.alpha?"":"value *= alpha;",g=3===t.length?`value += beta * c[${((e,t,n)=>{if(0===n.length)return"0u";const r=1===n.length&&1!==e||2===n.length&&n[0]!==e,o=n[n.length-1]!==t;let i="0u";return r||(i+=`+ m * ${n[n.length-1]}u`),o||(i+="+n"),i})(s,u,t[2].dims)}];`:"",m=[`@group(0) @binding(0) var<storage, read> a : array<${f}>;`,`@group(0) @binding(1) var<storage, read> b : array<${f}>;`];return 3===t.length&&m.push(`@group(0) @binding(2) var<storage, read> c : array<${f}>;`),Object.assign(Object.assign({},e),{outputs:[{dims:c,dataType:t[0].dataType,gpuDataType:i.GpuDataType.default}],getShaderSource:e=>`\n  const M: u32 = ${s}u;\n  const N: u32 = ${u}u;\n  const K: u32 = ${l}u;\n  const alpha = ${f}(${n.alpha});\n  const beta = ${f}(${n.beta});\n\n  ${m.join("\n")}\n  @group(0) @binding(${t.length}) var<storage, read_write> output : array<${f}>;\n\n  ${e.mainStart()}\n    ${e.guardAgainstOutOfBoundsWorkgroupSizes(p)}\n\n    let m = global_id.x / N;\n    let n = global_id.x % N;\n\n    var value = ${f}(0);\n    for (var k: u32 = 0u; k<${l}u; k++) {\n      ${d}\n    }\n\n    ${h}\n    ${g}\n    output[global_id.x] = value;\n\n  }`,dispatchGroup:()=>({x:Math.ceil(p/64)})})})(n,e,t)})})(e.inputs,t))},t.parseGemmAttributes=e=>(0,o.createAttributeWithCacheKey)(e)},1522:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.matMul=t.createMatmulProgramInfoLoader=void 0;const r=n(6952),o=n(1163),i=n(3997);t.createMatmulProgramInfoLoader=(e,t)=>{const n=(a=e.length>2,s=t.activationCacheKey,{name:"MatMul",inputTypes:a?[o.GpuDataType.default,o.GpuDataType.default,o.GpuDataType.default]:[o.GpuDataType.default,o.GpuDataType.default],cacheHint:s});var a,s;return Object.assign(Object.assign({},n),{get:()=>((e,t,n)=>{const a=t[0].dims,s=t[1].dims,u=r.BroadcastUtil.calcShape(a,s,!0);if(!u)throw new Error("Can't use matmul on the given tensors");const l=r.ShapeUtil.size(u),c="f32",{activationFunction:p,applyActivation:d}=(0,i.getActicationSnippet)(n),f=u[u.length-2],h=a[a.length-1],g=u[u.length-1];return Object.assign(Object.assign({},e),{outputs:[{dims:u,dataType:t[0].dataType,gpuDataType:o.GpuDataType.default}],getShaderSource:e=>`\n  const M: u32 = ${f}u;\n  const N: u32 = ${g}u;\n  const K: u32 = ${h}u;\n\n  @group(0) @binding(0) var<storage, read> a : array<${c}>;\n  @group(0) @binding(1) var<storage, read> b : array<${c}>;\n  @group(0) @binding(2) var<storage, read_write> output : array<${c}>;\n\n  ${p}\n\n  ${e.mainStart()}\n    ${e.guardAgainstOutOfBoundsWorkgroupSizes(l)}\n\n    let stack = global_idx / (M * N);\n    let mn = global_idx % (M * N);\n    let n = global_idx % N;\n    let m = mn / N;\n\n    let offsetA = stack * (M * K);\n    let offsetB = stack * (K * N);\n\n    var value = ${c}(0);\n    for (var k: u32 = 0u; k<${h}u; k++) {\n      value += a[offsetA + m * K + k] * b[offsetB + k * N + n];\n    }\n    ${d}\n    output[global_idx] = value;\n  }`,dispatchGroup:()=>({x:Math.ceil(l/64)})})})(n,e,t)})},t.matMul=e=>{(e=>{if(!e||2!==e.length)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.");if(1!==e[0].dataType||1!==e[1].dataType)throw new Error("inputs should be float type")})(e.inputs),e.compute((0,t.createMatmulProgramInfoLoader)(e.inputs,{activation:"",activationCacheKey:""}))}},5262:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.globalMaxPool=t.parseGlobalMaxPoolAttributes=t.parseMaxPoolAttributes=t.maxPool=t.globalAveragePool=t.parseGlobalAveragePoolAttributes=t.averagePool=t.parseAveragePoolAttributes=void 0;const r=n(6952),o=n(387),i=n(1163),a=n(2075),s=e=>{if(!e||1!==e.length)throw new Error("Pool ops requires 1 input.");if(4!==e[0].dims.length)throw new Error("Pool ops supports 2-D inputs only for now.");if(1!==e[0].dataType)throw new Error("Invalid input type.")},u=(e,t,n)=>{const o="NHWC"===t.format,i=o?[e[0].dims[0],e[0].dims[3],e[0].dims[1],e[0].dims[2]]:e[0].dims.slice(),a=Object.hasOwnProperty.call(t,"dilations"),s=t.kernelShape.slice(),u=t.strides.slice(),l=a?t.dilations.slice():[],c=t.pads.slice();r.PoolConvUtil.adjustPoolAttributes(n,i,s,u,l,c);const p=r.PoolConvUtil.computePoolOutputShape(n,i,u,l,s,c,t.autoPad),d=Object.assign({},t);return a?Object.assign(d,{kernelShape:s,strides:u,pads:c,dilations:l,cacheKey:t.cacheKey}):Object.assign(d,{kernelShape:s,strides:u,pads:c,cacheKey:t.cacheKey}),[d,o?[p[0],p[2],p[3],p[1]]:p]},l=(e,t,n,o,i,s,u,l)=>{const c="NHWC"===o.format,p=t.length,d=r.ShapeUtil.size(n),f=(0,a.createIndicesHelper)("output",n),h=(0,a.createIndicesHelper)("x",t);if(o.kernelShape.length<=2){const n=o.kernelShape[o.kernelShape.length-1],r=o.strides[o.strides.length-1],a=o.pads[o.pads.length/2-1],g=p-(c?2:1);let m="",b="",y="";if(m=a+o.pads[o.pads.length-1]!==0?`\n              for (var i: u32 = 0u; i < ${n}u; i++) {\n                xIndices[${g}] = indices[${g}] * ${r} - ${a} + i;\n                if (xIndices[${g}] < 0 || xIndices[${g}] >= ${t[g]}) {\n                  pad++;\n                  continue;\n                }\n                let x_val = x[${h.i2oExpression("xIndices")}];\n                ${i}\n              }`:`\n              for (var i: u32 = 0u; i < ${n}u; i++) {\n                xIndices[${g}] = indices[${g}] * ${r} - ${a} + i;\n                let x_val = x[${h.i2oExpression("xIndices")}];\n                ${i}\n              }`,2===o.kernelShape.length){const e=o.kernelShape[o.kernelShape.length-2],r=o.strides[o.strides.length-2],i=o.pads[o.pads.length/2-2],a=o.pads[o.pads.length-2],s=p-(c?3:2),u=t[s];b=i+a!==0?`\n                for (var j: u32 = 0u; j < ${e}u; j++) {\n                  xIndices[${s}] = indices[${s}] * ${r} - ${i} + j;\n                  if (xIndices[${s}] < 0 || xIndices[${s}] >= ${u}) {\n                    pad+= ${n};\n                    continue;\n                  }\n              `:`\n                for (var j: u32 = 0u; j < ${e}u; j++) {\n                  xIndices[${s}] = indices[${s}] * ${r} - ${i} + j;\n                `,y="\n              }\n            "}return`\n            @group(0) @binding(0) var<storage, read> x : array<${u}>;\n            @group(0) @binding(1) var<storage, read_write> output : array<${u}>;\n\n            ${f.o2iImpl}\n            ${h.i2oImpl}\n\n            ${e.mainStart()}\n              ${e.guardAgainstOutOfBoundsWorkgroupSizes(d)}\n\n              ${f.indicesVariableDeclaration("indices")}\n              ${f.o2iCall("global_idx","indices")}\n              ${f.indicesVariableDeclaration("xIndices")}\n              ${f.o2iCall("global_idx","xIndices")}\n\n              var value: ${u} = ${u}(${l});\n              var pad = 0;\n              ${b}\n              ${m}\n              ${y}\n              ${s}\n\n              output[global_idx] = value;\n            }`}{if(c)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");const n=r.ShapeUtil.size(o.kernelShape),a=r.ShapeUtil.computeStrides(o.kernelShape),g=a.length,m=o.pads.length;let b="";return b=o.pads.reduce(((e,t)=>e+t))?`\n                if (xIndices[j] >= inputDims[j]) {\n                  pad++;\n                  isPad = true;\n                  break;\n                }\n              }\n              if (!isPad) {\n                let x_val = x[${h.i2oExpression("xIndices")}];\n                ${i}\n              }`:`\n              }\n              let x_val = x[${h.i2oExpression("xIndices")}];\n              ${i}\n            `,`\n            @group(0) @binding(0) var<storage, read> x : array<${u}>;\n            @group(0) @binding(1) var<storage, read_write> output : array<${u}>;\n\n            ${f.o2iImpl}\n            ${h.i2oImpl}\n\n            const pads = array<u32, ${m}>(${o.pads.map((e=>`${e}u`)).join(",")});\n            const inputDims = array<u32, ${p}>(${t.map((e=>`${e}u`)).join(",")});\n            const kernelStrides = array<u32, ${g}>(${a.map((e=>`${e}u`)).join(",")});\n            const strides = array<u32, ${g}>(${o.strides.map((e=>`${e}u`)).join(",")});\n\n            ${e.mainStart()}\n              ${e.guardAgainstOutOfBoundsWorkgroupSizes(d)}\n\n              ${f.indicesVariableDeclaration("indices")}\n              ${f.o2iCall("global_idx","indices")}\n              ${f.indicesVariableDeclaration("xIndices")}\n              ${f.o2iCall("global_idx","xIndices")}\n\n              var offsets: array<u32, ${g}>;\n\n              var value = ${u}(${l});\n              var pad = 0;\n              var isPad = false;\n\n              for (var i: u32 = 0u; i < ${n}u; i++) {\n                var offset = i;\n                for (var j = 0u; j < ${g-1}u; j++) {\n                  offsets[j] = offset / kernelStrides[j];\n                  offset -= offsets[j] * kernelStrides[j];\n                }\n                offsets[${g-1}] = offset;\n\n                isPad = false;\n                for (var j = ${p-g}u; j < ${p}u; j++) {\n                  xIndices[j] = indices[j] * strides[j - ${p-g}u]\n                    + offsets[j - ${p-g}u] - pads[j - 2u];\n                  ${b}\n              }\n              ${s}\n\n              output[global_idx] = value;\n            }`}},c=e=>({format:e.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),p=(e,t,n,o)=>{const[a,s]=u(e,o,n),c=r.ShapeUtil.size(a.kernelShape),p="f32";let d="";return a.countIncludePad?d+=`value /= ${p}(${c});`:d+=`value /= ${p}(${c} - pad);`,Object.assign(Object.assign({},t),{outputs:[{dims:s,dataType:e[0].dataType,gpuDataType:i.GpuDataType.default}],getShaderSource:t=>l(t,e[0].dims,s,a,"value += x_val;",d,p,"0.0"),dispatchGroup:()=>({x:Math.ceil(r.ShapeUtil.size(s)/64)})})};t.parseAveragePoolAttributes=e=>{const t=0!==e.count_include_pad,n=c(e);if(0!==n.ceilMode)throw new Error("using ceil() in shape computation is not yet supported for AveragePool");return(0,o.createAttributeWithCacheKey)(Object.assign({countIncludePad:t},n))},t.averagePool=(e,t)=>{s(e.inputs);const n={name:"AveragePool",inputTypes:[i.GpuDataType.default],cacheHint:t.cacheKey};e.compute(Object.assign(Object.assign({},n),{get:()=>p(e.inputs,n,!1,t)}))};const d={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[],cacheKey:""};t.parseGlobalAveragePoolAttributes=e=>{const t=e.format;return Object.assign(Object.assign({format:t},d),{cacheKey:t})},t.globalAveragePool=(e,t)=>{s(e.inputs);const n={name:"GlobalAveragePool",inputTypes:[i.GpuDataType.default],cacheHint:t.cacheKey};e.compute(Object.assign(Object.assign({},n),{get:()=>p(e.inputs,n,!0,t)}))};const f=(e,t,n,o)=>{const[a,s]=u(e,o,n);return Object.assign(Object.assign({},t),{outputs:[{dims:s,dataType:e[0].dataType,gpuDataType:i.GpuDataType.default}],getShaderSource:t=>l(t,e[0].dims,s,a,"\n      value = max(x_val, value);\n    ","","f32","-1e5"),dispatchGroup:()=>({x:Math.ceil(r.ShapeUtil.size(s)/64)})})};t.maxPool=(e,t)=>{s(e.inputs);const n={name:"MaxPool",inputTypes:[i.GpuDataType.default],cacheHint:t.cacheKey};e.compute(Object.assign(Object.assign({},n),{get:()=>f(e.inputs,n,!1,t)}))},t.parseMaxPoolAttributes=e=>{const t=e.storage_order,n=e.dilations,r=c(e);if(0!==t)throw new Error("column major storage order is not yet supported for MaxPool");if(0!==r.ceilMode)throw new Error("using ceil() in shape computation is not yet supported for MaxPool");return(0,o.createAttributeWithCacheKey)(Object.assign({storageOrder:t,dilations:n},r))},t.parseGlobalMaxPoolAttributes=e=>{const t=e.format;return Object.assign(Object.assign({format:t},d),{cacheKey:t})},t.globalMaxPool=(e,t)=>{s(e.inputs);const n={name:"GlobalMaxPool",inputTypes:[i.GpuDataType.default],cacheHint:t.cacheKey};e.compute(Object.assign(Object.assign({},n),{get:()=>f(e.inputs,n,!0,t)}))}},2625:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.parseTransposeAttributes=t.transpose=t.createTransposeProgramInfo=t.transposeProgramMetadata=void 0;const r=n(6952),o=n(387),i=n(1163),a=n(2075);t.transposeProgramMetadata={name:"Transpose",inputTypes:[i.GpuDataType.default]};const s=(e,t)=>t&&t.length!==e.length?[...e.keys()].reverse():t;t.createTransposeProgramInfo=(e,n)=>{const o=e.dims,u=s(o,n),l=((e,t)=>r.ShapeUtil.sortBasedOnPerm(e,s(e,t)))(o,u),c=o.length,p=r.ShapeUtil.size(l),d=(0,a.createIndicesHelper)("output",l),f=(0,a.createIndicesHelper)("a",o);return Object.assign(Object.assign({},t.transposeProgramMetadata),{outputs:[{dims:l,dataType:e.dataType,gpuDataType:i.GpuDataType.default}],getShaderSource:e=>`\n  @group(0) @binding(0) var<storage, read> a : array<f32>;\n  @group(0) @binding(1) var<storage, read_write> output : array<f32>;\n\n  ${((e,t)=>{const n=[];n.push(`fn perm(a: ptr<function, array<u32, ${t}>>, i: ptr<function, array<u32, ${t}>>) {`);for(let r=0;r<t;++r)n.push(`\t(*a)[${e[r]}]=(*i)[${r}];`);return n.push("\t}"),n.join("\n")})(u,c)}\n  ${d.o2iImpl}\n  ${f.i2oImpl}\n\n  ${e.mainStart()}\n    ${e.guardAgainstOutOfBoundsWorkgroupSizes(p)}\n\n    ${d.indicesVariableDeclaration("indices")}\n    ${d.o2iCall("global_idx","indices")}\n    ${f.indicesVariableDeclaration("aIndices")}\n    perm(&aIndices, &indices);\n\n    output[global_idx] = a[${f.i2oExpression("aIndices")}];\n  }`,dispatchGroup:()=>({x:Math.ceil(p/64)})})},t.transpose=(e,n)=>{(e=>{if(!e||1!==e.length)throw new Error("Transpose requires 1 input.");if(1!==e[0].dataType)throw new Error("input should be float tensor")})(e.inputs),e.compute(Object.assign(Object.assign({},t.transposeProgramMetadata),{cacheHint:n.cacheKey,get:()=>(0,t.createTransposeProgramInfo)(e.inputs[0],n.perm)}))},t.parseTransposeAttributes=e=>(0,o.createAttributeWithCacheKey)({perm:e.perm})},9302:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.thresholdedRelu=t.tanh=t.tan=t.sqrt=t.sinh=t.sin=t.sigmoid=t.relu=t.reciprocal=t.neg=t.leakyRelu=t.floor=t.exp=t.erf=t.elu=t.parseAlphaAttributes=t.cosh=t.cos=t.ceil=t.clip=t.clipV10=t.atanh=t.atan=t.asinh=t.asin=t.acosh=t.acos=t.abs=void 0;const r=n(6952),o=n(387),i=n(1163),a=(e,t,n,o,a)=>{const s={name:t,inputTypes:[i.GpuDataType.default],cacheHint:a};return Object.assign(Object.assign({},s),{get:()=>((e,t,n,o)=>Object.assign(Object.assign({},e),{getShaderSource:e=>((e,t,n,r)=>{const o=Math.ceil(t/4);let i="";return i="string"==typeof n?`${n}(a)`:n("a"),`\n  @group(0) @binding(0) var<storage, read> inputData : array<vec4<f32>>;\n  @group(0) @binding(1) var<storage, read_write> outputData : array<vec4<f32>>;\n\n  ${null!=r?r:""}\n\n  ${e.mainStart()}\n    ${e.guardAgainstOutOfBoundsWorkgroupSizes(o)}\n\n    let a = inputData[global_idx];\n    outputData[global_idx] = ${i};\n  }`})(e,r.ShapeUtil.size(t.dims),n,o),outputs:[{dims:t.dims,dataType:t.dataType,gpuDataType:i.GpuDataType.default}],dispatchGroup:e=>({x:Math.ceil(r.ShapeUtil.size(e[0].dims)/64/4)})}))(s,e,n,o)})};t.abs=e=>{e.compute(a(e.inputs[0],"Abs","abs"))},t.acos=e=>{e.compute(a(e.inputs[0],"Acos","acos"))},t.acosh=e=>{e.compute(a(e.inputs[0],"Acosh","acosh"))},t.asin=e=>{e.compute(a(e.inputs[0],"Asin","asin"))},t.asinh=e=>{e.compute(a(e.inputs[0],"Asinh","asinh"))},t.atan=e=>{e.compute(a(e.inputs[0],"Atan","atan"))},t.atanh=e=>{e.compute(a(e.inputs[0],"Atanh","atanh"))},t.clipV10=(e,t)=>{e.compute(a(e.inputs[0],"Clip",(e=>`clamp(${e}, clip_min_, clip_max_)`),`\n    const clip_min_: vec4<f32> = vec4(f32(${t.min}));\n    const clip_max_: vec4<f32> = vec4(f32(${t.max}));\n`,t.cacheKey),{inputs:[0]})},t.clip=e=>{const n=(e=>{const t=e.length>=2?e[1].getFloat32Array()[0]:r.MIN_CLIP,n=e.length>=3?e[2].getFloat32Array()[0]:r.MAX_CLIP;return(0,o.createAttributeWithCacheKey)({min:t,max:n})})(e.inputs);(0,t.clipV10)(e,n)},t.ceil=e=>{e.compute(a(e.inputs[0],"Ceil","ceil"))},t.cos=e=>{e.compute(a(e.inputs[0],"Cos","cos"))},t.cosh=e=>{e.compute(a(e.inputs[0],"Cosh","cosh"))},t.parseAlphaAttributes=e=>(0,o.createAttributeWithCacheKey)(e),t.elu=(e,t)=>{e.compute(a(e.inputs[0],"Elu",(e=>`elu_vf32(${e})`),`\n  const elu_alpha_: f32 = f32(${t.alpha});\n\n  fn elu_f32(a: f32) -> f32 {\n  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);\n  }\n\n  fn elu_vf32(v: vec4<f32>) -> vec4<f32> {\n  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));\n  }`,t.cacheKey))},t.erf=e=>{e.compute(a(e.inputs[0],"Erf",(e=>`erf_vf32(${e})`),"\n  const r0: f32 = 0.3275911;\n  const r1: f32 = 0.254829592;\n  const r2: f32 = -0.284496736;\n  const r3: f32 = 1.421413741;\n  const r4: f32 = -1.453152027;\n  const r5: f32 = 1.061405429;\n\n  fn erf_vf32(v: vec4<f32>) -> vec4<f32> {\n    let absv = abs(v);\n    let x = 1.0 / (1.0 + r0 * absv);\n    return sign(v) * (1.0 - ((((r5 * x + r4) * x + r3) * x + r2) * x + r1) * x * exp(-absv * absv));\n  }"))},t.exp=e=>{e.compute(a(e.inputs[0],"Exp","exp"))},t.floor=e=>{e.compute(a(e.inputs[0],"Floor","floor"))},t.leakyRelu=(e,t)=>{e.compute(a(e.inputs[0],"LeakyRelu",(e=>`select(leaky_relu_alpha_ * ${e}, ${e}, ${e} >= vec4<f32>(0.0))`),`const leaky_relu_alpha_: f32 = f32(${t.alpha});`,t.cacheKey))},t.neg=e=>{e.compute(a(e.inputs[0],"Neg",(e=>`-${e}`)))},t.reciprocal=e=>{e.compute(a(e.inputs[0],"Reciprocal",(e=>`1.0/${e}`)))},t.relu=e=>{e.compute(a(e.inputs[0],"Relu",(e=>`select(vec4<f32>(0.0), ${e}, ${e} > vec4<f32>(0.0))`)))},t.sigmoid=e=>{e.compute(a(e.inputs[0],"Sigmoid",(e=>`(1.0 / (1.0 + exp(-${e})))`)))},t.sin=e=>{e.compute(a(e.inputs[0],"Sin","sin"))},t.sinh=e=>{e.compute(a(e.inputs[0],"Sinh","sinh"))},t.sqrt=e=>{e.compute(a(e.inputs[0],"Sqrt","sqrt"))},t.tan=e=>{e.compute(a(e.inputs[0],"Tan","tan"))},t.tanh=e=>{e.compute(a(e.inputs[0],"Tanh","tanh"))},t.thresholdedRelu=(e,t)=>(e.compute(a(e.inputs[0],"ThresholdedRelu",(e=>`select(vec4<f32>(0.0), ${e}, ${e} > thresholded_relu_alpha_)`),`const thresholded_relu_alpha_: vec4<f32> = vec4<f32>(${t.alpha});`,t.cacheKey)),0)},8305:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ProgramManager=void 0;const r=n(4955),o=n(2075);t.ProgramManager=class{constructor(e){this.backend=e,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,n,r){const o=this.backend.device,i=this.backend.getComputePassEncoder();this.backend.profilingEnabled&&i.writeTimestamp(this.backend.profilingQuerySet,0),i.setPipeline(e.computePipeline);const a=[];for(const e of t)a.push({binding:a.length,resource:{buffer:e.buffer}});for(const e of n)a.push({binding:a.length,resource:{buffer:e.buffer}});const s=o.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:a});if(i.setBindGroup(0,s),i.dispatchWorkgroups(...r),this.backend.pendingDispatchNumber++,this.backend.profilingEnabled){i.writeTimestamp(this.backend.profilingQuerySet,1);const e=this.backend.gpuDataManager.create(16,GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE),t=this.backend.gpuDataManager.create(16,GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST);this.backend.endComputePass(),this.backend.getCommandEncoder().resolveQuerySet(this.backend.profilingQuerySet,0,2,e.buffer,0),this.backend.getCommandEncoder().copyBufferToBuffer(e.buffer,0,t.buffer,0,16),this.backend.flush();const n=this.backend.currentKernelId,r=this.backend.kernels.get(n)[0];t.buffer.mapAsync(GPUMapMode.READ).then((()=>{const o=new BigUint64Array(t.buffer.getMappedRange()),i=o[0],a=o[1];t.buffer.unmap(),void 0===this.backend.profilingTimeBase&&(this.backend.profilingTimeBase=i);const s=Number(i-this.backend.profilingTimeBase),u=Number(a-this.backend.profilingTimeBase);if(!Number.isSafeInteger(s)||!Number.isSafeInteger(u))throw new RangeError("incorrect timestamp range");this.backend.gpuDataManager.release(e.id),this.backend.gpuDataManager.release(t.id),console.log(`[profiling] kernel "${n}|${r}" execution time: ${u-s} ns`)}))}this.backend.pendingDispatchNumber>=16&&this.backend.flush()}dispose(){}build(e,t){const n=this.backend.device,i=e.getShaderSource((0,o.createShaderHelper)(t)),a=n.createShaderModule({code:i});return(0,r.LOG_DEBUG)("verbose",(()=>`[WebGPU] shader code: ${i}`)),{programInfo:e,computePipeline:n.createComputePipeline({compute:{module:a,entryPoint:"main"},layout:"auto"})}}normalizeDispatchGroupSize(e){const t="number"==typeof e?e:e.x,n="number"==typeof e?1:e.y||1,r="number"==typeof e?1:e.z||1,o=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(t<=o&&n<=o&&r<=o)return[t,n,r];const i=t*n*r;let a=Math.ceil(Math.sqrt(i));if(a>o){if(a=Math.ceil(Math.cbrt(i)),a>o)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[a,a,a]}return[a,a,1]}}},1163:(e,t)=>{"use strict";var n;Object.defineProperty(t,"__esModule",{value:!0}),t.GpuDataType=void 0,(n=t.GpuDataType||(t.GpuDataType={}))[n.default=0]="default",n[n.upload=1]="upload",n[n.profile=2]="profile"},3899:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.iterateExtraOptions=void 0,t.iterateExtraOptions=(e,n,r,o)=>{if("object"==typeof e&&null!==e){if(r.has(e))throw new Error("Circular reference in options");r.add(e)}Object.entries(e).forEach((([e,i])=>{const a=n?n+e:e;if("object"==typeof i)(0,t.iterateExtraOptions)(i,a+".",r,o);else if("string"==typeof i||"number"==typeof i)o(a,i.toString());else{if("boolean"!=typeof i)throw new Error("Can't handle extra config type: "+typeof i);o(a,i?"1":"0")}}))}},9544:function(e,t,n){"use strict";var r,o=this&&this.__createBinding||(Object.create?function(e,t,n,r){void 0===r&&(r=n);var o=Object.getOwnPropertyDescriptor(t,n);o&&!("get"in o?!t.__esModule:o.writable||o.configurable)||(o={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,r,o)}:function(e,t,n,r){void 0===r&&(r=n),e[r]=t[n]}),i=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),a=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)"default"!==n&&Object.prototype.hasOwnProperty.call(e,n)&&o(t,e,n);return i(t,e),t};Object.defineProperty(t,"__esModule",{value:!0}),t.endProfiling=t.run=t.releaseSession=t.createSession=t.createSessionFinalize=t.createSessionAllocate=t.initOrt=t.initWasm=void 0;const s=n(8453),u=n(7675),l=a(n(1259)),c=n(263),p=()=>!!s.env.wasm.proxy&&"undefined"!=typeof document;let d,f,h,g=!1,m=!1,b=!1;const y=[],w=[],_=[],v=[],x=[],T=[],S=()=>{if(g||!m||b||!d)throw new Error("worker not ready")},O=e=>{switch(e.data.type){case"init-wasm":g=!1,e.data.err?(b=!0,f[1](e.data.err)):(m=!0,f[0]());break;case"init-ort":e.data.err?h[1](e.data.err):h[0]();break;case"create_allocate":e.data.err?y.shift()[1](e.data.err):y.shift()[0](e.data.out);break;case"create_finalize":e.data.err?w.shift()[1](e.data.err):w.shift()[0](e.data.out);break;case"create":e.data.err?_.shift()[1](e.data.err):_.shift()[0](e.data.out);break;case"release":e.data.err?v.shift()[1](e.data.err):v.shift()[0]();break;case"run":e.data.err?x.shift()[1](e.data.err):x.shift()[0](e.data.out);break;case"end-profiling":e.data.err?T.shift()[1](e.data.err):T.shift()[0]()}},A="undefined"!=typeof document?null===(r=null===document||void 0===document?void 0:document.currentScript)||void 0===r?void 0:r.src:void 0;t.initWasm=async()=>{if(p()){if(m)return;if(g)throw new Error("multiple calls to 'initWasm()' detected.");if(b)throw new Error("previous call to 'initWasm()' failed.");return g=!0,void 0===s.env.wasm.wasmPaths&&A&&0!==A.indexOf("blob:")&&(s.env.wasm.wasmPaths=A.substr(0,+A.lastIndexOf("/")+1)),new Promise(((e,t)=>{null==d||d.terminate(),d=n(8050).Z(),d.onmessage=O,f=[e,t];const r={type:"init-wasm",in:s.env.wasm};d.postMessage(r)}))}return(0,c.initializeWebAssembly)(s.env.wasm)},t.initOrt=async(e,t)=>{if(p())return S(),new Promise(((n,r)=>{h=[n,r];const o={type:"init-ort",in:{numThreads:e,loggingLevel:t}};d.postMessage(o)}));l.initOrt(e,t),await(0,u.init)((0,c.getInstance)())},t.createSessionAllocate=async e=>p()?(S(),new Promise(((t,n)=>{y.push([t,n]);const r={type:"create_allocate",in:{model:e}};d.postMessage(r,[e.buffer])}))):l.createSessionAllocate(e),t.createSessionFinalize=async(e,t)=>p()?(S(),new Promise(((n,r)=>{w.push([n,r]);const o={type:"create_finalize",in:{modeldata:e,options:t}};d.postMessage(o)}))):l.createSessionFinalize(e,t),t.createSession=async(e,t)=>p()?(S(),new Promise(((n,r)=>{_.push([n,r]);const o={type:"create",in:{model:e,options:t}};d.postMessage(o,[e.buffer])}))):l.createSession(e,t),t.releaseSession=async e=>{if(p())return S(),new Promise(((t,n)=>{v.push([t,n]);const r={type:"release",in:e};d.postMessage(r)}));l.releaseSession(e)},t.run=async(e,t,n,r,o)=>p()?(S(),new Promise(((i,a)=>{x.push([i,a]);const s={type:"run",in:{sessionId:e,inputIndices:t,inputs:n,outputIndices:r,options:o}};d.postMessage(s,l.extractTransferableBuffers(n))}))):l.run(e,t,n,r,o),t.endProfiling=async e=>{if(p())return S(),new Promise(((t,n)=>{T.push([t,n]);const r={type:"end-profiling",in:e};d.postMessage(r)}));l.endProfiling(e)}},7918:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.setRunOptions=void 0;const r=n(3899),o=n(9444),i=n(263);t.setRunOptions=e=>{const t=(0,i.getInstance)();let n=0;const a=[],s=e||{};try{if(void 0===(null==e?void 0:e.logSeverityLevel))s.logSeverityLevel=2;else if("number"!=typeof e.logSeverityLevel||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log serverity level is not valid: ${e.logSeverityLevel}`);if(void 0===(null==e?void 0:e.logVerbosityLevel))s.logVerbosityLevel=0;else if("number"!=typeof e.logVerbosityLevel||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);void 0===(null==e?void 0:e.terminate)&&(s.terminate=!1);let i=0;if(void 0!==(null==e?void 0:e.tag)&&(i=(0,o.allocWasmString)(e.tag,a)),n=t._OrtCreateRunOptions(s.logSeverityLevel,s.logVerbosityLevel,!!s.terminate,i),0===n)throw new Error("Can't create run options");return void 0!==(null==e?void 0:e.extra)&&(0,r.iterateExtraOptions)(e.extra,"",new WeakSet,((e,r)=>{const i=(0,o.allocWasmString)(e,a),s=(0,o.allocWasmString)(r,a);if(0!==t._OrtAddRunConfigEntry(n,i,s))throw new Error(`Can't set a run config entry: ${e} - ${r}`)})),[n,a]}catch(e){throw 0!==n&&t._OrtReleaseRunOptions(n),a.forEach(t._free),e}}},6640:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.OnnxruntimeWebAssemblySessionHandler=void 0;const r=n(2806),o=n(8453),i=n(2850),a=n(9544),s=n(7917);let u;t.OnnxruntimeWebAssemblySessionHandler=class{async createSessionAllocate(e){const t=await fetch(e),n=await t.arrayBuffer();return(0,a.createSessionAllocate)(new Uint8Array(n))}async loadModel(e,t){if(u||(await(0,a.initOrt)(o.env.wasm.numThreads,(0,s.logLevelStringToEnum)(o.env.logLevel)),u=!0),"string"==typeof e)if("undefined"==typeof fetch){const n=await(0,i.promisify)(r.readFile)(e);[this.sessionId,this.inputNames,this.outputNames]=await(0,a.createSession)(n,t)}else{const n=await this.createSessionAllocate(e);[this.sessionId,this.inputNames,this.outputNames]=await(0,a.createSessionFinalize)(n,t)}else[this.sessionId,this.inputNames,this.outputNames]=await(0,a.createSession)(e,t)}async dispose(){return(0,a.releaseSession)(this.sessionId)}async run(e,t,n){const r=[],i=[];Object.entries(e).forEach((e=>{const t=e[0],n=e[1],o=this.inputNames.indexOf(t);if(-1===o)throw new Error(`invalid input '${t}'`);r.push(n),i.push(o)}));const s=[];Object.entries(t).forEach((e=>{const t=e[0],n=this.outputNames.indexOf(t);if(-1===n)throw new Error(`invalid output '${t}'`);s.push(n)}));const u=await(0,a.run)(this.sessionId,i,r.map((e=>[e.type,e.dims,e.data])),s,n),l={};for(let e=0;e<u.length;e++)l[this.outputNames[s[e]]]=new o.Tensor(u[e][0],u[e][2],u[e][1]);return l}startProfiling(){}endProfiling(){(0,a.endProfiling)(this.sessionId)}}},7622:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.setSessionOptions=void 0;const r=n(3899),o=n(9444),i=n(263);t.setSessionOptions=e=>{var t,n,a,s;const u=(0,i.getInstance)();let l=0;const c=[],p=e||{};(e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});const t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some((e=>"webgpu"===("string"==typeof e?e:e.name)))&&(e.enableMemPattern=!1)})(p);try{const e=(e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}})(null!==(t=p.graphOptimizationLevel)&&void 0!==t?t:"all"),d=(e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}})(null!==(n=p.executionMode)&&void 0!==n?n:"sequential"),f="string"==typeof p.logId?(0,o.allocWasmString)(p.logId,c):0,h=null!==(a=p.logSeverityLevel)&&void 0!==a?a:2;if(!Number.isInteger(h)||h<0||h>4)throw new Error(`log serverity level is not valid: ${h}`);const g=null!==(s=p.logVerbosityLevel)&&void 0!==s?s:0;if(!Number.isInteger(g)||g<0||g>4)throw new Error(`log verbosity level is not valid: ${g}`);const m="string"==typeof p.optimizedModelFilePath?(0,o.allocWasmString)(p.optimizedModelFilePath,c):0;if(l=u._OrtCreateSessionOptions(e,!!p.enableCpuMemArena,!!p.enableMemPattern,d,!!p.enableProfiling,0,f,h,g,m),0===l)throw new Error("Can't create session options");return p.executionProviders&&((e,t,n)=>{for(const r of t){let t="string"==typeof r?r:r.name;switch(t){case"xnnpack":t="XNNPACK";break;case"webgpu":t="JS";break;case"wasm":case"cpu":continue;default:throw new Error(`not supported EP: ${t}`)}const a=(0,o.allocWasmString)(t,n);if(0!==(0,i.getInstance)()._OrtAppendExecutionProvider(e,a))throw new Error(`Can't append execution provider: ${t}`)}})(l,p.executionProviders,c),void 0!==p.extra&&(0,r.iterateExtraOptions)(p.extra,"",new WeakSet,((e,t)=>{const n=(0,o.allocWasmString)(e,c),r=(0,o.allocWasmString)(t,c);if(0!==u._OrtAddSessionConfigEntry(l,n,r))throw new Error(`Can't set a session config entry: ${e} - ${t}`)})),[l,c]}catch(e){throw 0!==l&&u._OrtReleaseSessionOptions(l),c.forEach(u._free),e}}},9444:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.allocWasmString=void 0;const r=n(263);t.allocWasmString=(e,t)=>{const n=(0,r.getInstance)(),o=n.lengthBytesUTF8(e)+1,i=n._malloc(o);return n.stringToUTF8(e,i,o),t.push(i),i}},7917:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.logLevelStringToEnum=t.tensorTypeToTypedArrayConstructor=t.getTensorElementSize=t.tensorDataTypeEnumToString=t.tensorDataTypeStringToEnum=void 0,t.tensorDataTypeStringToEnum=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;default:throw new Error(`unsupported data type: ${e}`)}},t.tensorDataTypeEnumToString=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";default:throw new Error(`unsupported data type: ${e}`)}},t.getTensorElementSize=e=>[void 0,4,1,1,2,2,4,8,void 0,1,2,8,4,8,void 0,void 0,void 0][e],t.tensorTypeToTypedArrayConstructor=e=>{switch(e){case"float32":return Float32Array;case"uint8":case"bool":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${e}`)}},t.logLevelStringToEnum=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}}},1259:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.extractTransferableBuffers=t.endProfiling=t.run=t.releaseSession=t.createSession=t.createSessionFinalize=t.createSessionAllocate=t.initOrt=void 0;const r=n(7918),o=n(7622),i=n(9444),a=n(7917),s=n(263);t.initOrt=(e,t)=>{const n=(0,s.getInstance)()._OrtInit(e,t);if(0!==n)throw new Error(`Can't initialize onnxruntime. error code = ${n}`)};const u=new Map;t.createSessionAllocate=e=>{const t=(0,s.getInstance)(),n=t._malloc(e.byteLength);return t.HEAPU8.set(e,n),[n,e.byteLength]},t.createSessionFinalize=(e,t)=>{const n=(0,s.getInstance)();let r=0,i=0,a=[];try{if([i,a]=(0,o.setSessionOptions)(t),r=n._OrtCreateSession(e[0],e[1],i),0===r)throw new Error("Can't create a session")}finally{n._free(e[0]),0!==i&&n._OrtReleaseSessionOptions(i),a.forEach(n._free)}const l=n._OrtGetInputCount(r),c=n._OrtGetOutputCount(r),p=[],d=[],f=[],h=[];for(let e=0;e<l;e++){const t=n._OrtGetInputName(r,e);if(0===t)throw new Error("Can't get an input name");d.push(t),p.push(n.UTF8ToString(t))}for(let e=0;e<c;e++){const t=n._OrtGetOutputName(r,e);if(0===t)throw new Error("Can't get an output name");h.push(t),f.push(n.UTF8ToString(t))}return u.set(r,[r,d,h]),[r,p,f]},t.createSession=(e,n)=>{const r=(0,t.createSessionAllocate)(e);return(0,t.createSessionFinalize)(r,n)},t.releaseSession=e=>{const t=(0,s.getInstance)(),n=u.get(e);if(!n)throw new Error("invalid session id");const r=n[0],o=n[1],i=n[2];o.forEach(t._OrtFree),i.forEach(t._OrtFree),t._OrtReleaseSession(r),u.delete(e)},t.run=async(e,t,n,o,l)=>{const c=(0,s.getInstance)(),p=u.get(e);if(!p)throw new Error("invalid session id");const d=p[0],f=p[1],h=p[2],g=t.length,m=o.length;let b=0,y=[];const w=[],_=[];try{[b,y]=(0,r.setRunOptions)(l);for(let e=0;e<g;e++){const t=n[e][0],r=n[e][1],o=n[e][2];let s,u;if(Array.isArray(o)){u=4*o.length,s=c._malloc(u),_.push(s);let e=s/4;for(let t=0;t<o.length;t++){if("string"!=typeof o[t])throw new TypeError(`tensor data at index ${t} is not a string`);c.HEAPU32[e++]=(0,i.allocWasmString)(o[t],_)}}else u=o.byteLength,s=c._malloc(u),_.push(s),c.HEAPU8.set(new Uint8Array(o.buffer,o.byteOffset,u),s);const l=c.stackSave(),p=c.stackAlloc(4*r.length);try{let e=p/4;r.forEach((t=>c.HEAP32[e++]=t));const n=c._OrtCreateTensor((0,a.tensorDataTypeStringToEnum)(t),s,u,p,r.length);if(0===n)throw new Error("Can't create a tensor");w.push(n)}finally{c.stackRestore(l)}}const e=c.stackSave(),s=c.stackAlloc(4*g),u=c.stackAlloc(4*g),p=c.stackAlloc(4*m),v=c.stackAlloc(4*m);try{let e=s/4,n=u/4,r=p/4,i=v/4;for(let r=0;r<g;r++)c.HEAPU32[e++]=w[r],c.HEAPU32[n++]=f[t[r]];for(let e=0;e<m;e++)c.HEAPU32[r++]=0,c.HEAPU32[i++]=h[o[e]];let l=c._OrtRun(d,u,s,g,v,m,p,b);const y=c.jsepRunPromise;y&&void 0!==y.then&&(l=await y);const _=[];if(0===l)for(let e=0;e<m;e++){const t=c.HEAPU32[p/4+e],n=c.stackSave(),r=c.stackAlloc(16);let o,i=0;try{if(l=c._OrtGetTensorData(t,r,r+4,r+8,r+12),0!==l)throw new Error(`Can't access output tensor data. error code = ${l}`);let e=r/4;const n=c.HEAPU32[e++];i=c.HEAPU32[e++];const s=c.HEAPU32[e++],u=c.HEAPU32[e++],p=[];for(let e=0;e<u;e++)p.push(c.HEAPU32[s/4+e]);c._OrtFree(s);const d=0===p.length?1:p.reduce(((e,t)=>e*t));if(o=(0,a.tensorDataTypeEnumToString)(n),"string"===o){const e=[];let t=i/4;for(let n=0;n<d;n++){const r=c.HEAPU32[t++],o=n===d-1?void 0:c.HEAPU32[t]-r;e.push(c.UTF8ToString(r,o))}_.push([o,p,e])}else{const e=new((0,a.tensorTypeToTypedArrayConstructor)(o))(d);new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(c.HEAPU8.subarray(i,i+e.byteLength)),_.push([o,p,e])}}finally{c.stackRestore(n),"string"===o&&i&&c._free(i),c._OrtReleaseTensor(t)}}if(0===l)return _;throw new Error(`failed to call OrtRun(). error code = ${l}.`)}finally{c.stackRestore(e)}}finally{w.forEach(c._OrtReleaseTensor),_.forEach(c._free),c._OrtReleaseRunOptions(b),y.forEach(c._free)}},t.endProfiling=e=>{const t=(0,s.getInstance)(),n=u.get(e);if(!n)throw new Error("invalid session id");const r=n[0],o=t._OrtEndProfiling(r);if(0===o)throw new Error("Can't get an profile file name");t._OrtFree(o)},t.extractTransferableBuffers=e=>{const t=[];for(const n of e){const e=n[2];!Array.isArray(e)&&e.buffer&&t.push(e.buffer)}return t}},263:function(e,t,n){"use strict";var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){void 0===r&&(r=n);var o=Object.getOwnPropertyDescriptor(t,n);o&&!("get"in o?!t.__esModule:o.writable||o.configurable)||(o={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,r,o)}:function(e,t,n,r){void 0===r&&(r=n),e[r]=t[n]}),o=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),i=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)"default"!==n&&Object.prototype.hasOwnProperty.call(e,n)&&r(t,e,n);return o(t,e),t};Object.defineProperty(t,"__esModule",{value:!0}),t.dispose=t.getInstance=t.initializeWebAssembly=void 0;const a=i(n(6449)),s=n(932),u=n(3474);let l,c=!1,p=!1,d=!1;t.initializeWebAssembly=async e=>{if(c)return Promise.resolve();if(p)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(d)throw new Error("previous call to 'initializeWebAssembly()' failed.");p=!0;const t=e.initTimeout,r=e.numThreads,o=e.simd,i=r>1&&(()=>{try{return"undefined"!=typeof SharedArrayBuffer&&("undefined"!=typeof MessageChannel&&(new MessageChannel).port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11])))}catch(e){return!1}})(),f=o&&(()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch(e){return!1}})(),h=e.wasmPaths,g="string"==typeof h?h:void 0,m=((e,t)=>t?e?"ort-wasm-simd-threaded.wasm":"ort-wasm-threaded.wasm":e?"ort-wasm-simd.wasm":"ort-wasm.wasm")(f,i),b="object"==typeof h?h[m]:void 0;let y=!1;const w=[];if(t>0&&w.push(new Promise((e=>{setTimeout((()=>{y=!0,e()}),t)}))),w.push(new Promise(((e,t)=>{const r=i?u:s,o={locateFile:(e,t)=>i&&e.endsWith(".worker.js")&&"undefined"!=typeof Blob?URL.createObjectURL(new Blob([n(4154)],{type:"text/javascript"})):e.endsWith(".wasm")?b||(null!=g?g:t)+m:t+e};if(i)if("undefined"==typeof Blob)o.mainScriptUrlOrBlob=a.join("/","ort-wasm-threaded.js");else{const e=`var ortWasmThreaded=(function(){var _scriptDir;return ${r.toString()}})();`;o.mainScriptUrlOrBlob=new Blob([e],{type:"text/javascript"})}r(o).then((t=>{p=!1,c=!0,l=t,e()}),(e=>{p=!1,d=!0,t(e)}))}))),await Promise.race(w),y)throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},t.getInstance=()=>{if(c&&l)return l;throw new Error("WebAssembly is not initialized yet.")},t.dispose=()=>{var e;!c||p||d||(p=!0,null===(e=l.PThread)||void 0===e||e.terminateAllThreads(),l=void 0,p=!1,c=!1,d=!0)}},8050:(e,t,n)=>{"use strict";n.d(t,{Z:()=>i});var r=n(6614),o=n.n(r);function i(){return o()('/*!\n* ONNX Runtime Web v1.15.1\n* Copyright (c) Microsoft Corporation. All rights reserved.\n* Licensed under the MIT License.\n*/\n(()=>{var e={899:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.iterateExtraOptions=void 0,t.iterateExtraOptions=(e,n,r,a)=>{if("object"==typeof e&&null!==e){if(r.has(e))throw new Error("Circular reference in options");r.add(e)}Object.entries(e).forEach((([e,o])=>{const i=n?n+e:e;if("object"==typeof o)(0,t.iterateExtraOptions)(o,i+".",r,a);else if("string"==typeof o||"number"==typeof o)a(i,o.toString());else{if("boolean"!=typeof o)throw new Error("Can\'t handle extra config type: "+typeof o);a(i,o?"1":"0")}}))}},918:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.setRunOptions=void 0;const r=n(899),a=n(444),o=n(263);t.setRunOptions=e=>{const t=(0,o.getInstance)();let n=0;const i=[],s=e||{};try{if(void 0===(null==e?void 0:e.logSeverityLevel))s.logSeverityLevel=2;else if("number"!=typeof e.logSeverityLevel||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log serverity level is not valid: ${e.logSeverityLevel}`);if(void 0===(null==e?void 0:e.logVerbosityLevel))s.logVerbosityLevel=0;else if("number"!=typeof e.logVerbosityLevel||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);void 0===(null==e?void 0:e.terminate)&&(s.terminate=!1);let o=0;if(void 0!==(null==e?void 0:e.tag)&&(o=(0,a.allocWasmString)(e.tag,i)),n=t._OrtCreateRunOptions(s.logSeverityLevel,s.logVerbosityLevel,!!s.terminate,o),0===n)throw new Error("Can\'t create run options");return void 0!==(null==e?void 0:e.extra)&&(0,r.iterateExtraOptions)(e.extra,"",new WeakSet,((e,r)=>{const o=(0,a.allocWasmString)(e,i),s=(0,a.allocWasmString)(r,i);if(0!==t._OrtAddRunConfigEntry(n,o,s))throw new Error(`Can\'t set a run config entry: ${e} - ${r}`)})),[n,i]}catch(e){throw 0!==n&&t._OrtReleaseRunOptions(n),i.forEach(t._free),e}}},622:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.setSessionOptions=void 0;const r=n(899),a=n(444),o=n(263);t.setSessionOptions=e=>{var t,n,i,s;const u=(0,o.getInstance)();let c=0;const l=[],f=e||{};(e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});const t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some((e=>"webgpu"===("string"==typeof e?e:e.name)))&&(e.enableMemPattern=!1)})(f);try{const e=(e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}})(null!==(t=f.graphOptimizationLevel)&&void 0!==t?t:"all"),p=(e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}})(null!==(n=f.executionMode)&&void 0!==n?n:"sequential"),d="string"==typeof f.logId?(0,a.allocWasmString)(f.logId,l):0,m=null!==(i=f.logSeverityLevel)&&void 0!==i?i:2;if(!Number.isInteger(m)||m<0||m>4)throw new Error(`log serverity level is not valid: ${m}`);const g=null!==(s=f.logVerbosityLevel)&&void 0!==s?s:0;if(!Number.isInteger(g)||g<0||g>4)throw new Error(`log verbosity level is not valid: ${g}`);const h="string"==typeof f.optimizedModelFilePath?(0,a.allocWasmString)(f.optimizedModelFilePath,l):0;if(c=u._OrtCreateSessionOptions(e,!!f.enableCpuMemArena,!!f.enableMemPattern,p,!!f.enableProfiling,0,d,m,g,h),0===c)throw new Error("Can\'t create session options");return f.executionProviders&&((e,t,n)=>{for(const r of t){let t="string"==typeof r?r:r.name;switch(t){case"xnnpack":t="XNNPACK";break;case"webgpu":t="JS";break;case"wasm":case"cpu":continue;default:throw new Error(`not supported EP: ${t}`)}const i=(0,a.allocWasmString)(t,n);if(0!==(0,o.getInstance)()._OrtAppendExecutionProvider(e,i))throw new Error(`Can\'t append execution provider: ${t}`)}})(c,f.executionProviders,l),void 0!==f.extra&&(0,r.iterateExtraOptions)(f.extra,"",new WeakSet,((e,t)=>{const n=(0,a.allocWasmString)(e,l),r=(0,a.allocWasmString)(t,l);if(0!==u._OrtAddSessionConfigEntry(c,n,r))throw new Error(`Can\'t set a session config entry: ${e} - ${t}`)})),[c,l]}catch(e){throw 0!==c&&u._OrtReleaseSessionOptions(c),l.forEach(u._free),e}}},444:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.allocWasmString=void 0;const r=n(263);t.allocWasmString=(e,t)=>{const n=(0,r.getInstance)(),a=n.lengthBytesUTF8(e)+1,o=n._malloc(a);return n.stringToUTF8(e,o,a),t.push(o),o}},917:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.logLevelStringToEnum=t.tensorTypeToTypedArrayConstructor=t.getTensorElementSize=t.tensorDataTypeEnumToString=t.tensorDataTypeStringToEnum=void 0,t.tensorDataTypeStringToEnum=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;default:throw new Error(`unsupported data type: ${e}`)}},t.tensorDataTypeEnumToString=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";default:throw new Error(`unsupported data type: ${e}`)}},t.getTensorElementSize=e=>[void 0,4,1,1,2,2,4,8,void 0,1,2,8,4,8,void 0,void 0,void 0][e],t.tensorTypeToTypedArrayConstructor=e=>{switch(e){case"float32":return Float32Array;case"uint8":case"bool":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${e}`)}},t.logLevelStringToEnum=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}}},259:(e,t,n)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.extractTransferableBuffers=t.endProfiling=t.run=t.releaseSession=t.createSession=t.createSessionFinalize=t.createSessionAllocate=t.initOrt=void 0;const r=n(918),a=n(622),o=n(444),i=n(917),s=n(263);t.initOrt=(e,t)=>{const n=(0,s.getInstance)()._OrtInit(e,t);if(0!==n)throw new Error(`Can\'t initialize onnxruntime. error code = ${n}`)};const u=new Map;t.createSessionAllocate=e=>{const t=(0,s.getInstance)(),n=t._malloc(e.byteLength);return t.HEAPU8.set(e,n),[n,e.byteLength]},t.createSessionFinalize=(e,t)=>{const n=(0,s.getInstance)();let r=0,o=0,i=[];try{if([o,i]=(0,a.setSessionOptions)(t),r=n._OrtCreateSession(e[0],e[1],o),0===r)throw new Error("Can\'t create a session")}finally{n._free(e[0]),0!==o&&n._OrtReleaseSessionOptions(o),i.forEach(n._free)}const c=n._OrtGetInputCount(r),l=n._OrtGetOutputCount(r),f=[],p=[],d=[],m=[];for(let e=0;e<c;e++){const t=n._OrtGetInputName(r,e);if(0===t)throw new Error("Can\'t get an input name");p.push(t),f.push(n.UTF8ToString(t))}for(let e=0;e<l;e++){const t=n._OrtGetOutputName(r,e);if(0===t)throw new Error("Can\'t get an output name");m.push(t),d.push(n.UTF8ToString(t))}return u.set(r,[r,p,m]),[r,f,d]},t.createSession=(e,n)=>{const r=(0,t.createSessionAllocate)(e);return(0,t.createSessionFinalize)(r,n)},t.releaseSession=e=>{const t=(0,s.getInstance)(),n=u.get(e);if(!n)throw new Error("invalid session id");const r=n[0],a=n[1],o=n[2];a.forEach(t._OrtFree),o.forEach(t._OrtFree),t._OrtReleaseSession(r),u.delete(e)},t.run=async(e,t,n,a,c)=>{const l=(0,s.getInstance)(),f=u.get(e);if(!f)throw new Error("invalid session id");const p=f[0],d=f[1],m=f[2],g=t.length,h=a.length;let y=0,v=[];const b=[],w=[];try{[y,v]=(0,r.setRunOptions)(c);for(let e=0;e<g;e++){const t=n[e][0],r=n[e][1],a=n[e][2];let s,u;if(Array.isArray(a)){u=4*a.length,s=l._malloc(u),w.push(s);let e=s/4;for(let t=0;t<a.length;t++){if("string"!=typeof a[t])throw new TypeError(`tensor data at index ${t} is not a string`);l.HEAPU32[e++]=(0,o.allocWasmString)(a[t],w)}}else u=a.byteLength,s=l._malloc(u),w.push(s),l.HEAPU8.set(new Uint8Array(a.buffer,a.byteOffset,u),s);const c=l.stackSave(),f=l.stackAlloc(4*r.length);try{let e=f/4;r.forEach((t=>l.HEAP32[e++]=t));const n=l._OrtCreateTensor((0,i.tensorDataTypeStringToEnum)(t),s,u,f,r.length);if(0===n)throw new Error("Can\'t create a tensor");b.push(n)}finally{l.stackRestore(c)}}const e=l.stackSave(),s=l.stackAlloc(4*g),u=l.stackAlloc(4*g),f=l.stackAlloc(4*h),_=l.stackAlloc(4*h);try{let e=s/4,n=u/4,r=f/4,o=_/4;for(let r=0;r<g;r++)l.HEAPU32[e++]=b[r],l.HEAPU32[n++]=d[t[r]];for(let e=0;e<h;e++)l.HEAPU32[r++]=0,l.HEAPU32[o++]=m[a[e]];let c=l._OrtRun(p,u,s,g,_,h,f,y);const v=l.jsepRunPromise;v&&void 0!==v.then&&(c=await v);const w=[];if(0===c)for(let e=0;e<h;e++){const t=l.HEAPU32[f/4+e],n=l.stackSave(),r=l.stackAlloc(16);let a,o=0;try{if(c=l._OrtGetTensorData(t,r,r+4,r+8,r+12),0!==c)throw new Error(`Can\'t access output tensor data. error code = ${c}`);let e=r/4;const n=l.HEAPU32[e++];o=l.HEAPU32[e++];const s=l.HEAPU32[e++],u=l.HEAPU32[e++],f=[];for(let e=0;e<u;e++)f.push(l.HEAPU32[s/4+e]);l._OrtFree(s);const p=0===f.length?1:f.reduce(((e,t)=>e*t));if(a=(0,i.tensorDataTypeEnumToString)(n),"string"===a){const e=[];let t=o/4;for(let n=0;n<p;n++){const r=l.HEAPU32[t++],a=n===p-1?void 0:l.HEAPU32[t]-r;e.push(l.UTF8ToString(r,a))}w.push([a,f,e])}else{const e=new((0,i.tensorTypeToTypedArrayConstructor)(a))(p);new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(l.HEAPU8.subarray(o,o+e.byteLength)),w.push([a,f,e])}}finally{l.stackRestore(n),"string"===a&&o&&l._free(o),l._OrtReleaseTensor(t)}}if(0===c)return w;throw new Error(`failed to call OrtRun(). error code = ${c}.`)}finally{l.stackRestore(e)}}finally{b.forEach(l._OrtReleaseTensor),w.forEach(l._free),l._OrtReleaseRunOptions(y),v.forEach(l._free)}},t.endProfiling=e=>{const t=(0,s.getInstance)(),n=u.get(e);if(!n)throw new Error("invalid session id");const r=n[0],a=t._OrtEndProfiling(r);if(0===a)throw new Error("Can\'t get an profile file name");t._OrtFree(a)},t.extractTransferableBuffers=e=>{const t=[];for(const n of e){const e=n[2];!Array.isArray(e)&&e.buffer&&t.push(e.buffer)}return t}},263:function(e,t,n){"use strict";var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){void 0===r&&(r=n);var a=Object.getOwnPropertyDescriptor(t,n);a&&!("get"in a?!t.__esModule:a.writable||a.configurable)||(a={enumerable:!0,get:function(){return t[n]}}),Object.defineProperty(e,r,a)}:function(e,t,n,r){void 0===r&&(r=n),e[r]=t[n]}),a=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),o=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)"default"!==n&&Object.prototype.hasOwnProperty.call(e,n)&&r(t,e,n);return a(t,e),t};Object.defineProperty(t,"__esModule",{value:!0}),t.dispose=t.getInstance=t.initializeWebAssembly=void 0;const i=o(n(449)),s=n(932),u=n(474);let c,l=!1,f=!1,p=!1;t.initializeWebAssembly=async e=>{if(l)return Promise.resolve();if(f)throw new Error("multiple calls to \'initializeWebAssembly()\' detected.");if(p)throw new Error("previous call to \'initializeWebAssembly()\' failed.");f=!0;const t=e.initTimeout,r=e.numThreads,a=e.simd,o=r>1&&(()=>{try{return"undefined"!=typeof SharedArrayBuffer&&("undefined"!=typeof MessageChannel&&(new MessageChannel).port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11])))}catch(e){return!1}})(),d=a&&(()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch(e){return!1}})(),m=e.wasmPaths,g="string"==typeof m?m:void 0,h=((e,t)=>t?e?"ort-wasm-simd-threaded.wasm":"ort-wasm-threaded.wasm":e?"ort-wasm-simd.wasm":"ort-wasm.wasm")(d,o),y="object"==typeof m?m[h]:void 0;let v=!1;const b=[];if(t>0&&b.push(new Promise((e=>{setTimeout((()=>{v=!0,e()}),t)}))),b.push(new Promise(((e,t)=>{const r=o?u:s,a={locateFile:(e,t)=>o&&e.endsWith(".worker.js")&&"undefined"!=typeof Blob?URL.createObjectURL(new Blob([n(154)],{type:"text/javascript"})):e.endsWith(".wasm")?y||(null!=g?g:t)+h:t+e};if(o)if("undefined"==typeof Blob)a.mainScriptUrlOrBlob=i.join("/","ort-wasm-threaded.js");else{const e=`var ortWasmThreaded=(function(){var _scriptDir;return ${r.toString()}})();`;a.mainScriptUrlOrBlob=new Blob([e],{type:"text/javascript"})}r(a).then((t=>{f=!1,l=!0,c=t,e()}),(e=>{f=!1,p=!0,t(e)}))}))),await Promise.race(b),v)throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},t.getInstance=()=>{if(l&&c)return c;throw new Error("WebAssembly is not initialized yet.")},t.dispose=()=>{var e;!l||f||p||(f=!0,null===(e=c.PThread)||void 0===e||e.terminateAllThreads(),c=void 0,f=!1,l=!1,p=!0)}},474:(e,t,n)=>{var _scriptDir,r=(_scriptDir=(_scriptDir="undefined"!=typeof document&&document.currentScript?document.currentScript.src:void 0)||"/index.js",function(e){function t(){return P.buffer!=D&&G(P.buffer),F}function r(){return P.buffer!=D&&G(P.buffer),U}function a(){return P.buffer!=D&&G(P.buffer),I}function o(){return P.buffer!=D&&G(P.buffer),W}function i(){return P.buffer!=D&&G(P.buffer),j}var s,u,c;e=e||{},s||(s=void 0!==e?e:{}),s.ready=new Promise((function(e,t){u=e,c=t}));var l,f,p,d,m,g,h=Object.assign({},s),y="./this.program",v=(e,t)=>{throw t},b="object"==typeof window,w="function"==typeof importScripts,_="object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node,O=s.ENVIRONMENT_IS_PTHREAD||!1,S="";function T(e){return s.locateFile?s.locateFile(e,S):S+e}if(_){let t;S=w?n(908).dirname(S)+"/":"//",g=()=>{m||(d=n(384),m=n(908))},l=function(e,t){return g(),e=m.normalize(e),d.readFileSync(e,t?void 0:"utf8")},p=e=>((e=l(e,!0)).buffer||(e=new Uint8Array(e)),e),f=(e,t,n)=>{g(),e=m.normalize(e),d.readFile(e,(function(e,r){e?n(e):t(r.buffer)}))},1<process.argv.length&&(y=process.argv[1].replace(/\\\\/g,"/")),process.argv.slice(2),process.on("uncaughtException",(function(e){if(!(e instanceof ie))throw e})),process.on("unhandledRejection",(function(e){throw e})),v=(e,t)=>{if(C)throw process.exitCode=e,t;t instanceof ie||x("exiting due to exception: "+t),process.exit(e)},s.inspect=function(){return"[Emscripten Module object]"};try{t=n(925)}catch(e){throw console.error(\'The "worker_threads" module is not supported in this node.js build - perhaps a newer version is needed?\'),e}n.g.Worker=t.Worker}else(b||w)&&(w?S=self.location.href:"undefined"!=typeof document&&document.currentScript&&(S=document.currentScript.src),_scriptDir&&(S=_scriptDir),S=0!==S.indexOf("blob:")?S.substr(0,S.replace(/[?#].*/,"").lastIndexOf("/")+1):"",_||(l=e=>{var t=new XMLHttpRequest;return t.open("GET",e,!1),t.send(null),t.responseText},w&&(p=e=>{var t=new XMLHttpRequest;return t.open("GET",e,!1),t.responseType="arraybuffer",t.send(null),new Uint8Array(t.response)}),f=(e,t,n)=>{var r=new XMLHttpRequest;r.open("GET",e,!0),r.responseType="arraybuffer",r.onload=()=>{200==r.status||0==r.status&&r.response?t(r.response):n()},r.onerror=n,r.send(null)}));_&&"undefined"==typeof performance&&(n.g.performance=n(953).performance);var A=console.log.bind(console),E=console.warn.bind(console);_&&(g(),A=e=>d.writeSync(1,e+"\\n"),E=e=>d.writeSync(2,e+"\\n"));var M,R=s.print||A,x=s.printErr||E;Object.assign(s,h),h=null,s.thisProgram&&(y=s.thisProgram),s.quit&&(v=s.quit),s.wasmBinary&&(M=s.wasmBinary);var C=s.noExitRuntime||!0;"object"!=typeof WebAssembly&&ne("no native wasm support detected");var P,k,D,F,U,I,W,j,H=!1,L="undefined"!=typeof TextDecoder?new TextDecoder("utf8"):void 0;function Y(e,t,n){var r=(t>>>=0)+n;for(n=t;e[n]&&!(n>=r);)++n;if(16<n-t&&e.buffer&&L)return L.decode(e.buffer instanceof SharedArrayBuffer?e.slice(t,n):e.subarray(t,n));for(r="";t<n;){var a=e[t++];if(128&a){var o=63&e[t++];if(192==(224&a))r+=String.fromCharCode((31&a)<<6|o);else{var i=63&e[t++];65536>(a=224==(240&a)?(15&a)<<12|o<<6|i:(7&a)<<18|o<<12|i<<6|63&e[t++])?r+=String.fromCharCode(a):(a-=65536,r+=String.fromCharCode(55296|a>>10,56320|1023&a))}}else r+=String.fromCharCode(a)}return r}function z(e,t){return(e>>>=0)?Y(r(),e,t):""}function B(e,t,n,r){if(!(0<r))return 0;var a=n>>>=0;r=n+r-1;for(var o=0;o<e.length;++o){var i=e.charCodeAt(o);if(55296<=i&&57343>=i&&(i=65536+((1023&i)<<10)|1023&e.charCodeAt(++o)),127>=i){if(n>=r)break;t[n++>>>0]=i}else{if(2047>=i){if(n+1>=r)break;t[n++>>>0]=192|i>>6}else{if(65535>=i){if(n+2>=r)break;t[n++>>>0]=224|i>>12}else{if(n+3>=r)break;t[n++>>>0]=240|i>>18,t[n++>>>0]=128|i>>12&63}t[n++>>>0]=128|i>>6&63}t[n++>>>0]=128|63&i}}return t[n>>>0]=0,n-a}function N(e){for(var t=0,n=0;n<e.length;++n){var r=e.charCodeAt(n);127>=r?t++:2047>=r?t+=2:55296<=r&&57343>=r?(t+=4,++n):t+=3}return t}function G(e){D=e,s.HEAP8=F=new Int8Array(e),s.HEAP16=new Int16Array(e),s.HEAP32=I=new Int32Array(e),s.HEAPU8=U=new Uint8Array(e),s.HEAPU16=new Uint16Array(e),s.HEAPU32=W=new Uint32Array(e),s.HEAPF32=new Float32Array(e),s.HEAPF64=j=new Float64Array(e)}O&&(D=s.buffer);var q=s.INITIAL_MEMORY||16777216;if(O)P=s.wasmMemory,D=s.buffer;else if(s.wasmMemory)P=s.wasmMemory;else if(!((P=new WebAssembly.Memory({initial:q/65536,maximum:65536,shared:!0})).buffer instanceof SharedArrayBuffer))throw x("requested a shared WebAssembly.Memory but the returned buffer is not a SharedArrayBuffer, indicating that while the browser has SharedArrayBuffer it does not have WebAssembly threads support - you may need to set a flag"),_&&console.log("(on node you may need: --experimental-wasm-threads --experimental-wasm-bulk-memory and also use a recent version)"),Error("bad memory");P&&(D=P.buffer),q=D.byteLength,G(D);var $,V=[],J=[],Q=[];function X(){var e=s.preRun.shift();V.unshift(e)}var K,Z=0,ee=null,te=null;function ne(e){throw O?postMessage({cmd:"onAbort",arg:e}):s.onAbort&&s.onAbort(e),x(e="Aborted("+e+")"),H=!0,e=new WebAssembly.RuntimeError(e+". Build with -sASSERTIONS for more info."),c(e),e}function re(){return K.startsWith("data:application/octet-stream;base64,")}function ae(){var e=K;try{if(e==K&&M)return new Uint8Array(M);if(p)return p(e);throw"both async and sync fetching of the wasm failed"}catch(e){ne(e)}}K="ort-wasm-threaded.wasm",re()||(K=T(K));var oe={};function ie(e){this.name="ExitStatus",this.message="Program terminated with exit("+e+")",this.status=e}function se(e){(e=fe.La[e])||ne(),fe.Xa(e)}function ue(e){var t=fe.lb();if(!t)return 6;fe.Ra.push(t),fe.La[e.Ka]=t,t.Ka=e.Ka;var n={cmd:"run",start_routine:e.pb,arg:e.ib,pthread_ptr:e.Ka};return t.Qa=()=>{n.time=performance.now(),t.postMessage(n,e.vb)},t.loaded&&(t.Qa(),delete t.Qa),0}function ce(e){if(O)return He(1,1,e);C||(fe.qb(),s.onExit&&s.onExit(e),H=!0),v(e,new ie(e))}function le(e,t){if(!t&&O)throw de(e),"unwind";ce(e)}var fe={Oa:[],Ra:[],$a:[],La:{},Ua:function(){O&&fe.mb()},xb:function(){},mb:function(){fe.receiveObjectTransfer=fe.ob,fe.threadInitTLS=fe.Za,fe.setExitStatus=fe.Ya,C=!1},Ya:function(){},qb:function(){for(var e of Object.values(fe.La))fe.Xa(e);for(e of fe.Oa)e.terminate();fe.Oa=[]},Xa:function(e){var t=e.Ka;delete fe.La[t],fe.Oa.push(e),fe.Ra.splice(fe.Ra.indexOf(e),1),e.Ka=0,ct(t)},ob:function(){},Za:function(){fe.$a.forEach((e=>e()))},nb:function(e,t){e.onmessage=n=>{var r=(n=n.data).cmd;if(e.Ka&&(fe.kb=e.Ka),n.targetThread&&n.targetThread!=rt()){var a=fe.La[n.yb];a?a.postMessage(n,n.transferList):x(\'Internal error! Worker sent a message "\'+r+\'" to target pthread \'+n.targetThread+", but that thread no longer exists!")}else"processProxyingQueue"===r?De(n.queue):"spawnThread"===r?ue(n):"cleanupThread"===r?se(n.thread):"killThread"===r?(n=n.thread,r=fe.La[n],delete fe.La[n],r.terminate(),ct(n),fe.Ra.splice(fe.Ra.indexOf(r),1),r.Ka=0):"cancelThread"===r?fe.La[n.thread].postMessage({cmd:"cancel"}):"loaded"===r?(e.loaded=!0,t&&t(e),e.Qa&&(e.Qa(),delete e.Qa)):"print"===r?R("Thread "+n.threadId+": "+n.text):"printErr"===r?x("Thread "+n.threadId+": "+n.text):"alert"===r?alert("Thread "+n.threadId+": "+n.text):"setimmediate"===n.target?e.postMessage(n):"onAbort"===r?s.onAbort&&s.onAbort(n.arg):r&&x("worker sent an unknown command "+r);fe.kb=void 0},e.onerror=e=>{throw x("worker sent an error! "+e.filename+":"+e.lineno+": "+e.message),e},_&&(e.on("message",(function(t){e.onmessage({data:t})})),e.on("error",(function(t){e.onerror(t)})),e.on("detachedExit",(function(){}))),e.postMessage({cmd:"load",urlOrBlob:s.mainScriptUrlOrBlob||_scriptDir,wasmMemory:P,wasmModule:k})},hb:function(){var e=T("ort-wasm-threaded.worker.js");fe.Oa.push(new Worker(e))},lb:function(){return 0==fe.Oa.length&&(fe.hb(),fe.nb(fe.Oa[0])),fe.Oa.pop()}};function pe(e){for(;0<e.length;)e.shift()(s)}function de(e){if(O)return He(2,0,e);try{le(e)}catch(e){e instanceof ie||"unwind"==e||v(1,e)}}s.PThread=fe,s.establishStackSpace=function(){var e=rt(),t=a()[e+44>>2>>>0];e=a()[e+48>>2>>>0],ft(t,t-e),dt(t)};var me,ge,he=[];function ye(e){this.Pa=e-24,this.gb=function(e){o()[this.Pa+4>>2>>>0]=e},this.cb=function(e){o()[this.Pa+8>>2>>>0]=e},this.eb=function(){a()[this.Pa>>2>>>0]=0},this.bb=function(){t()[this.Pa+12>>0>>>0]=0},this.fb=function(){t()[this.Pa+13>>0>>>0]=0},this.Ua=function(e,t){this.ab(),this.gb(e),this.cb(t),this.eb(),this.bb(),this.fb()},this.ab=function(){o()[this.Pa+16>>2>>>0]=0}}function ve(e,t,n,r){return O?He(3,1,e,t,n,r):be(e,t,n,r)}function be(e,t,n,r){if("undefined"==typeof SharedArrayBuffer)return x("Current environment does not support SharedArrayBuffer, pthreads are not available!"),6;var a=[];return O&&0===a.length?ve(e,t,n,r):(e={pb:n,Ka:e,ib:r,vb:a},O?(e.wb="spawnThread",postMessage(e,a),0):ue(e))}function we(e,t,n){return O?He(4,1,e,t,n):0}function _e(e,t){if(O)return He(5,1,e,t)}function Oe(e,t){if(O)return He(6,1,e,t)}function Se(e,t,n){if(O)return He(7,1,e,t,n)}function Te(e,t,n){return O?He(8,1,e,t,n):0}function Ae(e,t){if(O)return He(9,1,e,t)}function Ee(e,t,n){if(O)return He(10,1,e,t,n)}function Me(e,t,n,r){if(O)return He(11,1,e,t,n,r)}function Re(e,t,n,r){if(O)return He(12,1,e,t,n,r)}function xe(e,t,n,r){if(O)return He(13,1,e,t,n,r)}function Ce(e){if(O)return He(14,1,e)}function Pe(e,t){if(O)return He(15,1,e,t)}function ke(e,t,n){if(O)return He(16,1,e,t,n)}function De(e){Atomics.store(a(),e>>2,1),rt()&&ut(e),Atomics.compareExchange(a(),e>>2,1,0)}function Fe(e){return o()[e>>>2]+4294967296*a()[e+4>>>2]}function Ue(e,t,n,r,a,o){return O?He(17,1,e,t,n,r,a,o):-52}function Ie(e,t,n,r,a,o){if(O)return He(18,1,e,t,n,r,a,o)}function We(e){var n=N(e)+1,r=at(n);return r&&B(e,t(),r,n),r}function je(e,t,n){function r(e){return(e=e.toTimeString().match(/\\(([A-Za-z ]+)\\)$/))?e[1]:"GMT"}if(O)return He(19,1,e,t,n);var i=(new Date).getFullYear(),s=new Date(i,0,1),u=new Date(i,6,1);i=s.getTimezoneOffset();var c=u.getTimezoneOffset(),l=Math.max(i,c);a()[e>>2>>>0]=60*l,a()[t>>2>>>0]=Number(i!=c),e=r(s),t=r(u),e=We(e),t=We(t),c<i?(o()[n>>2>>>0]=e,o()[n+4>>2>>>0]=t):(o()[n>>2>>>0]=t,o()[n+4>>2>>>0]=e)}function He(e,t){var n=arguments.length-2,r=arguments;return function(e){var t=pt();return e=e(),dt(t),e}((()=>{for(var a=mt(8*n),o=a>>3,s=0;s<n;s++){var u=r[2+s];i()[o+s>>>0]=u}return st(e,n,a,t)}))}s.invokeEntryPoint=function(e,t){var n=he[e];n||(e>=he.length&&(he.length=e+1),he[e]=n=$.get(e)),e=n(t),C?fe.Ya(e):lt(e)},s.executeNotifiedProxyingQueue=De,ge=_?()=>{var e=process.hrtime();return 1e3*e[0]+e[1]/1e6}:O?()=>performance.now()-s.__performance_now_clock_drift:()=>performance.now();var Le,Ye=[],ze={};function Be(){if(!Le){var e,t={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:("object"==typeof navigator&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:y||"./this.program"};for(e in ze)void 0===ze[e]?delete t[e]:t[e]=ze[e];var n=[];for(e in t)n.push(e+"="+t[e]);Le=n}return Le}function Ne(e,n){if(O)return He(20,1,e,n);var r=0;return Be().forEach((function(a,i){var s=n+r;for(i=o()[e+4*i>>2>>>0]=s,s=0;s<a.length;++s)t()[i++>>0>>>0]=a.charCodeAt(s);t()[i>>0>>>0]=0,r+=a.length+1})),0}function Ge(e,t){if(O)return He(21,1,e,t);var n=Be();o()[e>>2>>>0]=n.length;var r=0;return n.forEach((function(e){r+=e.length+1})),o()[t>>2>>>0]=r,0}function qe(e){return O?He(22,1,e):52}function $e(e,t,n,r){return O?He(23,1,e,t,n,r):52}function Ve(e,t,n,r,a){return O?He(24,1,e,t,n,r,a):70}var Je=[null,[],[]];function Qe(e,t,n,a){if(O)return He(25,1,e,t,n,a);for(var i=0,s=0;s<n;s++){var u=o()[t>>2>>>0],c=o()[t+4>>2>>>0];t+=8;for(var l=0;l<c;l++){var f=r()[u+l>>>0],p=Je[e];0===f||10===f?((1===e?R:x)(Y(p,0)),p.length=0):p.push(f)}i+=c}return o()[a>>2>>>0]=i,0}function Xe(e){return 0==e%4&&(0!=e%100||0==e%400)}var Ke=[31,29,31,30,31,30,31,31,30,31,30,31],Ze=[31,28,31,30,31,30,31,31,30,31,30,31];function et(e,n,r,o){function i(e,t,n){for(e="number"==typeof e?e.toString():e||"";e.length<t;)e=n[0]+e;return e}function s(e,t){return i(e,t,"0")}function u(e,t){function n(e){return 0>e?-1:0<e?1:0}var r;return 0===(r=n(e.getFullYear()-t.getFullYear()))&&0===(r=n(e.getMonth()-t.getMonth()))&&(r=n(e.getDate()-t.getDate())),r}function c(e){switch(e.getDay()){case 0:return new Date(e.getFullYear()-1,11,29);case 1:return e;case 2:return new Date(e.getFullYear(),0,3);case 3:return new Date(e.getFullYear(),0,2);case 4:return new Date(e.getFullYear(),0,1);case 5:return new Date(e.getFullYear()-1,11,31);case 6:return new Date(e.getFullYear()-1,11,30)}}function l(e){var t=e.Ma;for(e=new Date(new Date(e.Na+1900,0,1).getTime());0<t;){var n=e.getMonth(),r=(Xe(e.getFullYear())?Ke:Ze)[n];if(!(t>r-e.getDate())){e.setDate(e.getDate()+t);break}t-=r-e.getDate()+1,e.setDate(1),11>n?e.setMonth(n+1):(e.setMonth(0),e.setFullYear(e.getFullYear()+1))}return n=new Date(e.getFullYear()+1,0,4),t=c(new Date(e.getFullYear(),0,4)),n=c(n),0>=u(t,e)?0>=u(n,e)?e.getFullYear()+1:e.getFullYear():e.getFullYear()-1}var f=a()[o+40>>2>>>0];for(var p in o={tb:a()[o>>2>>>0],sb:a()[o+4>>2>>>0],Sa:a()[o+8>>2>>>0],Va:a()[o+12>>2>>>0],Ta:a()[o+16>>2>>>0],Na:a()[o+20>>2>>>0],Ja:a()[o+24>>2>>>0],Ma:a()[o+28>>2>>>0],zb:a()[o+32>>2>>>0],rb:a()[o+36>>2>>>0],ub:f?z(f):""},r=z(r),f={"%c":"%a %b %d %H:%M:%S %Y","%D":"%m/%d/%y","%F":"%Y-%m-%d","%h":"%b","%r":"%I:%M:%S %p","%R":"%H:%M","%T":"%H:%M:%S","%x":"%m/%d/%y","%X":"%H:%M:%S","%Ec":"%c","%EC":"%C","%Ex":"%m/%d/%y","%EX":"%H:%M:%S","%Ey":"%y","%EY":"%Y","%Od":"%d","%Oe":"%e","%OH":"%H","%OI":"%I","%Om":"%m","%OM":"%M","%OS":"%S","%Ou":"%u","%OU":"%U","%OV":"%V","%Ow":"%w","%OW":"%W","%Oy":"%y"})r=r.replace(new RegExp(p,"g"),f[p]);var d="Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),m="January February March April May June July August September October November December".split(" ");for(p in f={"%a":function(e){return d[e.Ja].substring(0,3)},"%A":function(e){return d[e.Ja]},"%b":function(e){return m[e.Ta].substring(0,3)},"%B":function(e){return m[e.Ta]},"%C":function(e){return s((e.Na+1900)/100|0,2)},"%d":function(e){return s(e.Va,2)},"%e":function(e){return i(e.Va,2," ")},"%g":function(e){return l(e).toString().substring(2)},"%G":function(e){return l(e)},"%H":function(e){return s(e.Sa,2)},"%I":function(e){return 0==(e=e.Sa)?e=12:12<e&&(e-=12),s(e,2)},"%j":function(e){for(var t=0,n=0;n<=e.Ta-1;t+=(Xe(e.Na+1900)?Ke:Ze)[n++]);return s(e.Va+t,3)},"%m":function(e){return s(e.Ta+1,2)},"%M":function(e){return s(e.sb,2)},"%n":function(){return"\\n"},"%p":function(e){return 0<=e.Sa&&12>e.Sa?"AM":"PM"},"%S":function(e){return s(e.tb,2)},"%t":function(){return"\\t"},"%u":function(e){return e.Ja||7},"%U":function(e){return s(Math.floor((e.Ma+7-e.Ja)/7),2)},"%V":function(e){var t=Math.floor((e.Ma+7-(e.Ja+6)%7)/7);if(2>=(e.Ja+371-e.Ma-2)%7&&t++,t)53==t&&(4==(n=(e.Ja+371-e.Ma)%7)||3==n&&Xe(e.Na)||(t=1));else{t=52;var n=(e.Ja+7-e.Ma-1)%7;(4==n||5==n&&Xe(e.Na%400-1))&&t++}return s(t,2)},"%w":function(e){return e.Ja},"%W":function(e){return s(Math.floor((e.Ma+7-(e.Ja+6)%7)/7),2)},"%y":function(e){return(e.Na+1900).toString().substring(2)},"%Y":function(e){return e.Na+1900},"%z":function(e){var t=0<=(e=e.rb);return e=Math.abs(e)/60,(t?"+":"-")+String("0000"+(e/60*100+e%60)).slice(-4)},"%Z":function(e){return e.ub},"%%":function(){return"%"}},r=r.replace(/%%/g,"\\0\\0"),f)r.includes(p)&&(r=r.replace(new RegExp(p,"g"),f[p](o)));return p=function(e){var t=Array(N(e)+1);return B(e,t,0,t.length),t}(r=r.replace(/\\0\\0/g,"%")),p.length>n?0:(function(e,n){t().set(e,n>>>0)}(p,e),p.length-1)}fe.Ua();var tt=[null,ce,de,ve,we,_e,Oe,Se,Te,Ae,Ee,Me,Re,xe,Ce,Pe,ke,Ue,Ie,je,Ne,Ge,qe,$e,Ve,Qe],nt={b:function(e){return at(e+24)+24},c:function(e,t,n){throw new ye(e).Ua(t,n),e},L:function(e){ot(e,!w,1,!b),fe.Za()},l:function(e){O?postMessage({cmd:"cleanupThread",thread:e}):se(e)},D:be,i:we,R:_e,z:Oe,B:Se,T:Te,P:Ae,I:Ee,O:Me,p:Re,A:xe,x:Ce,Q:Pe,y:ke,r:function(){},j:function(){ne("To use dlopen, you need enable dynamic linking, see https://github.com/emscripten-core/emscripten/wiki/Linking")},s:function(){ne("To use dlopen, you need enable dynamic linking, see https://github.com/emscripten-core/emscripten/wiki/Linking")},q:function(){return Date.now()},E:function(){return 2097152},V:function(){return!0},F:function(e,t,n,r){if(e==t)setTimeout((()=>De(r)));else if(O)postMessage({targetThread:e,cmd:"processProxyingQueue",queue:r});else{if(!(e=fe.La[e]))return;e.postMessage({cmd:"processProxyingQueue",queue:r})}return 1},K:function(){return-1},W:function(e,t){e=new Date(1e3*Fe(e)),a()[t>>2>>>0]=e.getUTCSeconds(),a()[t+4>>2>>>0]=e.getUTCMinutes(),a()[t+8>>2>>>0]=e.getUTCHours(),a()[t+12>>2>>>0]=e.getUTCDate(),a()[t+16>>2>>>0]=e.getUTCMonth(),a()[t+20>>2>>>0]=e.getUTCFullYear()-1900,a()[t+24>>2>>>0]=e.getUTCDay(),e=(e.getTime()-Date.UTC(e.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,a()[t+28>>2>>>0]=e},X:function(e,t){e=new Date(1e3*Fe(e)),a()[t>>2>>>0]=e.getSeconds(),a()[t+4>>2>>>0]=e.getMinutes(),a()[t+8>>2>>>0]=e.getHours(),a()[t+12>>2>>>0]=e.getDate(),a()[t+16>>2>>>0]=e.getMonth(),a()[t+20>>2>>>0]=e.getFullYear()-1900,a()[t+24>>2>>>0]=e.getDay();var n=new Date(e.getFullYear(),0,1),r=(e.getTime()-n.getTime())/864e5|0;a()[t+28>>2>>>0]=r,a()[t+36>>2>>>0]=-60*e.getTimezoneOffset(),r=new Date(e.getFullYear(),6,1).getTimezoneOffset(),e=0|(r!=(n=n.getTimezoneOffset())&&e.getTimezoneOffset()==Math.min(n,r)),a()[t+32>>2>>>0]=e},Y:function(e){var t=new Date(a()[e+20>>2>>>0]+1900,a()[e+16>>2>>>0],a()[e+12>>2>>>0],a()[e+8>>2>>>0],a()[e+4>>2>>>0],a()[e>>2>>>0],0),n=a()[e+32>>2>>>0],r=t.getTimezoneOffset(),o=new Date(t.getFullYear(),0,1),i=new Date(t.getFullYear(),6,1).getTimezoneOffset(),s=o.getTimezoneOffset(),u=Math.min(s,i);return 0>n?a()[e+32>>2>>>0]=Number(i!=s&&u==r):0<n!=(u==r)&&(i=Math.max(s,i),t.setTime(t.getTime()+6e4*((0<n?u:i)-r))),a()[e+24>>2>>>0]=t.getDay(),n=(t.getTime()-o.getTime())/864e5|0,a()[e+28>>2>>>0]=n,a()[e>>2>>>0]=t.getSeconds(),a()[e+4>>2>>>0]=t.getMinutes(),a()[e+8>>2>>>0]=t.getHours(),a()[e+12>>2>>>0]=t.getDate(),a()[e+16>>2>>>0]=t.getMonth(),t.getTime()/1e3|0},G:Ue,H:Ie,Z:function e(t,n,r){e.jb||(e.jb=!0,je(t,n,r))},d:function(){ne("")},m:function(){if(!_&&!w){var e="Blocking on the main thread is very dangerous, see https://emscripten.org/docs/porting/pthreads.html#blocking-on-the-main-browser-thread";me||(me={}),me[e]||(me[e]=1,_&&(e="warning: "+e),x(e))}},w:function(){return 4294901760},f:ge,S:function(e,t,n){r().copyWithin(e>>>0,t>>>0,t+n>>>0)},g:function(){return _?n(993).cpus().length:navigator.hardwareConcurrency},J:function(e,t,n){Ye.length=t,n>>=3;for(var r=0;r<t;r++)Ye[r]=i()[n+r>>>0];return(0>e?oe[-e-1]:tt[e]).apply(null,Ye)},v:function(e){var t=r().length;if((e>>>=0)<=t||4294901760<e)return!1;for(var n=1;4>=n;n*=2){var a=t*(1+.2/n);a=Math.min(a,e+100663296);var o=Math;a=Math.max(e,a),o=o.min.call(o,4294901760,a+(65536-a%65536)%65536);e:{try{P.grow(o-D.byteLength+65535>>>16),G(P.buffer);var i=1;break e}catch(e){}i=void 0}if(i)return!0}return!1},U:function(){throw"unwind"},M:Ne,N:Ge,k:le,h:qe,o:$e,t:Ve,n:Qe,u:function e(r,a){e.Wa||(e.Wa=function(){if("object"==typeof crypto&&"function"==typeof crypto.getRandomValues){var e=new Uint8Array(1);return()=>(crypto.getRandomValues(e),e[0])}if(_)try{var t=n(760);return()=>t.randomBytes(1)[0]}catch(e){}return()=>ne("randomDevice")}());for(var o=0;o<a;o++)t()[r+o>>0>>>0]=e.Wa();return 0},a:P||s.wasmMemory,C:et,e:function(e,t,n,r){return et(e,t,n,r)}};!function(){function e(e,t){s.asm=e.exports,fe.$a.push(s.asm.wa),$=s.asm.za,J.unshift(s.asm._),k=t,O||(Z--,s.monitorRunDependencies&&s.monitorRunDependencies(Z),0==Z&&(null!==ee&&(clearInterval(ee),ee=null),te&&(e=te,te=null,e())))}function t(t){e(t.instance,t.module)}function n(e){return function(){if(!M&&(b||w)){if("function"==typeof fetch&&!K.startsWith("file://"))return fetch(K,{credentials:"same-origin"}).then((function(e){if(!e.ok)throw"failed to load wasm binary file at \'"+K+"\'";return e.arrayBuffer()})).catch((function(){return ae()}));if(f)return new Promise((function(e,t){f(K,(function(t){e(new Uint8Array(t))}),t)}))}return Promise.resolve().then((function(){return ae()}))}().then((function(e){return WebAssembly.instantiate(e,r)})).then((function(e){return e})).then(e,(function(e){x("failed to asynchronously prepare wasm: "+e),ne(e)}))}var r={a:nt};if(O||(Z++,s.monitorRunDependencies&&s.monitorRunDependencies(Z)),s.instantiateWasm)try{return s.instantiateWasm(r,e)}catch(e){return x("Module.instantiateWasm callback failed with error: "+e),!1}(M||"function"!=typeof WebAssembly.instantiateStreaming||re()||K.startsWith("file://")||_||"function"!=typeof fetch?n(t):fetch(K,{credentials:"same-origin"}).then((function(e){return WebAssembly.instantiateStreaming(e,r).then(t,(function(e){return x("wasm streaming compile failed: "+e),x("falling back to ArrayBuffer instantiation"),n(t)}))}))).catch(c)}(),s.___wasm_call_ctors=function(){return(s.___wasm_call_ctors=s.asm._).apply(null,arguments)},s._OrtInit=function(){return(s._OrtInit=s.asm.$).apply(null,arguments)},s._OrtCreateSessionOptions=function(){return(s._OrtCreateSessionOptions=s.asm.aa).apply(null,arguments)},s._OrtAppendExecutionProvider=function(){return(s._OrtAppendExecutionProvider=s.asm.ba).apply(null,arguments)},s._OrtAddSessionConfigEntry=function(){return(s._OrtAddSessionConfigEntry=s.asm.ca).apply(null,arguments)},s._OrtReleaseSessionOptions=function(){return(s._OrtReleaseSessionOptions=s.asm.da).apply(null,arguments)},s._OrtCreateSession=function(){return(s._OrtCreateSession=s.asm.ea).apply(null,arguments)},s._OrtReleaseSession=function(){return(s._OrtReleaseSession=s.asm.fa).apply(null,arguments)},s._OrtGetInputCount=function(){return(s._OrtGetInputCount=s.asm.ga).apply(null,arguments)},s._OrtGetOutputCount=function(){return(s._OrtGetOutputCount=s.asm.ha).apply(null,arguments)},s._OrtGetInputName=function(){return(s._OrtGetInputName=s.asm.ia).apply(null,arguments)},s._OrtGetOutputName=function(){return(s._OrtGetOutputName=s.asm.ja).apply(null,arguments)},s._OrtFree=function(){return(s._OrtFree=s.asm.ka).apply(null,arguments)},s._OrtCreateTensor=function(){return(s._OrtCreateTensor=s.asm.la).apply(null,arguments)},s._OrtGetTensorData=function(){return(s._OrtGetTensorData=s.asm.ma).apply(null,arguments)},s._OrtReleaseTensor=function(){return(s._OrtReleaseTensor=s.asm.na).apply(null,arguments)},s._OrtCreateRunOptions=function(){return(s._OrtCreateRunOptions=s.asm.oa).apply(null,arguments)},s._OrtAddRunConfigEntry=function(){return(s._OrtAddRunConfigEntry=s.asm.pa).apply(null,arguments)},s._OrtReleaseRunOptions=function(){return(s._OrtReleaseRunOptions=s.asm.qa).apply(null,arguments)},s._OrtRun=function(){return(s._OrtRun=s.asm.ra).apply(null,arguments)},s._OrtEndProfiling=function(){return(s._OrtEndProfiling=s.asm.sa).apply(null,arguments)};var rt=s._pthread_self=function(){return(rt=s._pthread_self=s.asm.ta).apply(null,arguments)},at=s._malloc=function(){return(at=s._malloc=s.asm.ua).apply(null,arguments)};s._free=function(){return(s._free=s.asm.va).apply(null,arguments)},s.__emscripten_tls_init=function(){return(s.__emscripten_tls_init=s.asm.wa).apply(null,arguments)};var ot=s.__emscripten_thread_init=function(){return(ot=s.__emscripten_thread_init=s.asm.xa).apply(null,arguments)};s.__emscripten_thread_crashed=function(){return(s.__emscripten_thread_crashed=s.asm.ya).apply(null,arguments)};var it,st=s._emscripten_run_in_main_runtime_thread_js=function(){return(st=s._emscripten_run_in_main_runtime_thread_js=s.asm.Aa).apply(null,arguments)},ut=s.__emscripten_proxy_execute_task_queue=function(){return(ut=s.__emscripten_proxy_execute_task_queue=s.asm.Ba).apply(null,arguments)},ct=s.__emscripten_thread_free_data=function(){return(ct=s.__emscripten_thread_free_data=s.asm.Ca).apply(null,arguments)},lt=s.__emscripten_thread_exit=function(){return(lt=s.__emscripten_thread_exit=s.asm.Da).apply(null,arguments)},ft=s._emscripten_stack_set_limits=function(){return(ft=s._emscripten_stack_set_limits=s.asm.Ea).apply(null,arguments)},pt=s.stackSave=function(){return(pt=s.stackSave=s.asm.Fa).apply(null,arguments)},dt=s.stackRestore=function(){return(dt=s.stackRestore=s.asm.Ga).apply(null,arguments)},mt=s.stackAlloc=function(){return(mt=s.stackAlloc=s.asm.Ha).apply(null,arguments)};function gt(){function e(){if(!it&&(it=!0,s.calledRun=!0,!H)&&(O||pe(J),u(s),s.onRuntimeInitialized&&s.onRuntimeInitialized(),!O)){if(s.postRun)for("function"==typeof s.postRun&&(s.postRun=[s.postRun]);s.postRun.length;){var e=s.postRun.shift();Q.unshift(e)}pe(Q)}}if(!(0<Z))if(O)u(s),O||pe(J),postMessage({cmd:"loaded"});else{if(s.preRun)for("function"==typeof s.preRun&&(s.preRun=[s.preRun]);s.preRun.length;)X();pe(V),0<Z||(s.setStatus?(s.setStatus("Running..."),setTimeout((function(){setTimeout((function(){s.setStatus("")}),1),e()}),1)):e())}}if(s.___cxa_is_pointer_type=function(){return(s.___cxa_is_pointer_type=s.asm.Ia).apply(null,arguments)},s.UTF8ToString=z,s.stringToUTF8=function(e,t,n){return B(e,r(),t,n)},s.lengthBytesUTF8=N,s.keepRuntimeAlive=function(){return C},s.wasmMemory=P,s.stackSave=pt,s.stackRestore=dt,s.stackAlloc=mt,s.ExitStatus=ie,s.PThread=fe,te=function e(){it||gt(),it||(te=e)},s.preInit)for("function"==typeof s.preInit&&(s.preInit=[s.preInit]);0<s.preInit.length;)s.preInit.pop()();return gt(),e.ready});e.exports=r},932:(e,t,n)=>{var _scriptDir,r=(_scriptDir=(_scriptDir="undefined"!=typeof document&&document.currentScript?document.currentScript.src:void 0)||"/index.js",function(e){var t,r,a;e=e||{},t||(t=void 0!==e?e:{}),t.ready=new Promise((function(e,t){r=e,a=t}));var o,i,s,u,c,l,f=Object.assign({},t),p="./this.program",d=(e,t)=>{throw t},m="object"==typeof window,g="function"==typeof importScripts,h="object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node,y="";h?(y=g?n(908).dirname(y)+"/":"//",l=()=>{c||(u=n(384),c=n(908))},o=function(e,t){return l(),e=c.normalize(e),u.readFileSync(e,t?void 0:"utf8")},s=e=>((e=o(e,!0)).buffer||(e=new Uint8Array(e)),e),i=(e,t,n)=>{l(),e=c.normalize(e),u.readFile(e,(function(e,r){e?n(e):t(r.buffer)}))},1<process.argv.length&&(p=process.argv[1].replace(/\\\\/g,"/")),process.argv.slice(2),process.on("uncaughtException",(function(e){if(!(e instanceof $))throw e})),process.on("unhandledRejection",(function(e){throw e})),d=(e,t)=>{if(_)throw process.exitCode=e,t;t instanceof $||w("exiting due to exception: "+t),process.exit(e)},t.inspect=function(){return"[Emscripten Module object]"}):(m||g)&&(g?y=self.location.href:"undefined"!=typeof document&&document.currentScript&&(y=document.currentScript.src),_scriptDir&&(y=_scriptDir),y=0!==y.indexOf("blob:")?y.substr(0,y.replace(/[?#].*/,"").lastIndexOf("/")+1):"",o=e=>{var t=new XMLHttpRequest;return t.open("GET",e,!1),t.send(null),t.responseText},g&&(s=e=>{var t=new XMLHttpRequest;return t.open("GET",e,!1),t.responseType="arraybuffer",t.send(null),new Uint8Array(t.response)}),i=(e,t,n)=>{var r=new XMLHttpRequest;r.open("GET",e,!0),r.responseType="arraybuffer",r.onload=()=>{200==r.status||0==r.status&&r.response?t(r.response):n()},r.onerror=n,r.send(null)});var v,b=t.print||console.log.bind(console),w=t.printErr||console.warn.bind(console);Object.assign(t,f),f=null,t.thisProgram&&(p=t.thisProgram),t.quit&&(d=t.quit),t.wasmBinary&&(v=t.wasmBinary);var _=t.noExitRuntime||!0;"object"!=typeof WebAssembly&&B("no native wasm support detected");var O,S,T,A,E,M,R=!1,x="undefined"!=typeof TextDecoder?new TextDecoder("utf8"):void 0;function C(e,t,n){var r=(t>>>=0)+n;for(n=t;e[n]&&!(n>=r);)++n;if(16<n-t&&e.buffer&&x)return x.decode(e.subarray(t,n));for(r="";t<n;){var a=e[t++];if(128&a){var o=63&e[t++];if(192==(224&a))r+=String.fromCharCode((31&a)<<6|o);else{var i=63&e[t++];65536>(a=224==(240&a)?(15&a)<<12|o<<6|i:(7&a)<<18|o<<12|i<<6|63&e[t++])?r+=String.fromCharCode(a):(a-=65536,r+=String.fromCharCode(55296|a>>10,56320|1023&a))}}else r+=String.fromCharCode(a)}return r}function P(e,t){return(e>>>=0)?C(A,e,t):""}function k(e,t,n,r){if(!(0<r))return 0;var a=n>>>=0;r=n+r-1;for(var o=0;o<e.length;++o){var i=e.charCodeAt(o);if(55296<=i&&57343>=i&&(i=65536+((1023&i)<<10)|1023&e.charCodeAt(++o)),127>=i){if(n>=r)break;t[n++>>>0]=i}else{if(2047>=i){if(n+1>=r)break;t[n++>>>0]=192|i>>6}else{if(65535>=i){if(n+2>=r)break;t[n++>>>0]=224|i>>12}else{if(n+3>=r)break;t[n++>>>0]=240|i>>18,t[n++>>>0]=128|i>>12&63}t[n++>>>0]=128|i>>6&63}t[n++>>>0]=128|63&i}}return t[n>>>0]=0,n-a}function D(e){for(var t=0,n=0;n<e.length;++n){var r=e.charCodeAt(n);127>=r?t++:2047>=r?t+=2:55296<=r&&57343>=r?(t+=4,++n):t+=3}return t}function F(){var e=O.buffer;S=e,t.HEAP8=T=new Int8Array(e),t.HEAP16=new Int16Array(e),t.HEAP32=E=new Int32Array(e),t.HEAPU8=A=new Uint8Array(e),t.HEAPU16=new Uint16Array(e),t.HEAPU32=M=new Uint32Array(e),t.HEAPF32=new Float32Array(e),t.HEAPF64=new Float64Array(e)}var U=[],I=[],W=[];function j(){var e=t.preRun.shift();U.unshift(e)}var H,L=0,Y=null,z=null;function B(e){throw t.onAbort&&t.onAbort(e),w(e="Aborted("+e+")"),R=!0,e=new WebAssembly.RuntimeError(e+". Build with -sASSERTIONS for more info."),a(e),e}function N(){return H.startsWith("data:application/octet-stream;base64,")}if(H="ort-wasm.wasm",!N()){var G=H;H=t.locateFile?t.locateFile(G,y):y+G}function q(){var e=H;try{if(e==H&&v)return new Uint8Array(v);if(s)return s(e);throw"both async and sync fetching of the wasm failed"}catch(e){B(e)}}function $(e){this.name="ExitStatus",this.message="Program terminated with exit("+e+")",this.status=e}function V(e){for(;0<e.length;)e.shift()(t)}function J(e){this.sa=e-24,this.Ia=function(e){M[this.sa+4>>2>>>0]=e},this.Ba=function(e){M[this.sa+8>>2>>>0]=e},this.Ga=function(){E[this.sa>>2>>>0]=0},this.Aa=function(){T[this.sa+12>>0>>>0]=0},this.Ha=function(){T[this.sa+13>>0>>>0]=0},this.ya=function(e,t){this.za(),this.Ia(e),this.Ba(t),this.Ga(),this.Aa(),this.Ha()},this.za=function(){M[this.sa+16>>2>>>0]=0}}function Q(e){var t=D(e)+1,n=ie(t);return n&&k(e,T,n,t),n}var X={};function K(){if(!Z){var e,t={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:("object"==typeof navigator&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:p||"./this.program"};for(e in X)void 0===X[e]?delete t[e]:t[e]=X[e];var n=[];for(e in t)n.push(e+"="+t[e]);Z=n}return Z}var Z,ee=[null,[],[]];function te(e){return 0==e%4&&(0!=e%100||0==e%400)}var ne=[31,29,31,30,31,30,31,31,30,31,30,31],re=[31,28,31,30,31,30,31,31,30,31,30,31];function ae(e,t,n,r){function a(e,t,n){for(e="number"==typeof e?e.toString():e||"";e.length<t;)e=n[0]+e;return e}function o(e,t){return a(e,t,"0")}function i(e,t){function n(e){return 0>e?-1:0<e?1:0}var r;return 0===(r=n(e.getFullYear()-t.getFullYear()))&&0===(r=n(e.getMonth()-t.getMonth()))&&(r=n(e.getDate()-t.getDate())),r}function s(e){switch(e.getDay()){case 0:return new Date(e.getFullYear()-1,11,29);case 1:return e;case 2:return new Date(e.getFullYear(),0,3);case 3:return new Date(e.getFullYear(),0,2);case 4:return new Date(e.getFullYear(),0,1);case 5:return new Date(e.getFullYear()-1,11,31);case 6:return new Date(e.getFullYear()-1,11,30)}}function u(e){var t=e.qa;for(e=new Date(new Date(e.ra+1900,0,1).getTime());0<t;){var n=e.getMonth(),r=(te(e.getFullYear())?ne:re)[n];if(!(t>r-e.getDate())){e.setDate(e.getDate()+t);break}t-=r-e.getDate()+1,e.setDate(1),11>n?e.setMonth(n+1):(e.setMonth(0),e.setFullYear(e.getFullYear()+1))}return n=new Date(e.getFullYear()+1,0,4),t=s(new Date(e.getFullYear(),0,4)),n=s(n),0>=i(t,e)?0>=i(n,e)?e.getFullYear()+1:e.getFullYear():e.getFullYear()-1}var c=E[r+40>>2>>>0];for(var l in r={Ea:E[r>>2>>>0],Da:E[r+4>>2>>>0],ta:E[r+8>>2>>>0],va:E[r+12>>2>>>0],ua:E[r+16>>2>>>0],ra:E[r+20>>2>>>0],la:E[r+24>>2>>>0],qa:E[r+28>>2>>>0],Ja:E[r+32>>2>>>0],Ca:E[r+36>>2>>>0],Fa:c?P(c):""},n=P(n),c={"%c":"%a %b %d %H:%M:%S %Y","%D":"%m/%d/%y","%F":"%Y-%m-%d","%h":"%b","%r":"%I:%M:%S %p","%R":"%H:%M","%T":"%H:%M:%S","%x":"%m/%d/%y","%X":"%H:%M:%S","%Ec":"%c","%EC":"%C","%Ex":"%m/%d/%y","%EX":"%H:%M:%S","%Ey":"%y","%EY":"%Y","%Od":"%d","%Oe":"%e","%OH":"%H","%OI":"%I","%Om":"%m","%OM":"%M","%OS":"%S","%Ou":"%u","%OU":"%U","%OV":"%V","%Ow":"%w","%OW":"%W","%Oy":"%y"})n=n.replace(new RegExp(l,"g"),c[l]);var f="Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),p="January February March April May June July August September October November December".split(" ");for(l in c={"%a":function(e){return f[e.la].substring(0,3)},"%A":function(e){return f[e.la]},"%b":function(e){return p[e.ua].substring(0,3)},"%B":function(e){return p[e.ua]},"%C":function(e){return o((e.ra+1900)/100|0,2)},"%d":function(e){return o(e.va,2)},"%e":function(e){return a(e.va,2," ")},"%g":function(e){return u(e).toString().substring(2)},"%G":function(e){return u(e)},"%H":function(e){return o(e.ta,2)},"%I":function(e){return 0==(e=e.ta)?e=12:12<e&&(e-=12),o(e,2)},"%j":function(e){for(var t=0,n=0;n<=e.ua-1;t+=(te(e.ra+1900)?ne:re)[n++]);return o(e.va+t,3)},"%m":function(e){return o(e.ua+1,2)},"%M":function(e){return o(e.Da,2)},"%n":function(){return"\\n"},"%p":function(e){return 0<=e.ta&&12>e.ta?"AM":"PM"},"%S":function(e){return o(e.Ea,2)},"%t":function(){return"\\t"},"%u":function(e){return e.la||7},"%U":function(e){return o(Math.floor((e.qa+7-e.la)/7),2)},"%V":function(e){var t=Math.floor((e.qa+7-(e.la+6)%7)/7);if(2>=(e.la+371-e.qa-2)%7&&t++,t)53==t&&(4==(n=(e.la+371-e.qa)%7)||3==n&&te(e.ra)||(t=1));else{t=52;var n=(e.la+7-e.qa-1)%7;(4==n||5==n&&te(e.ra%400-1))&&t++}return o(t,2)},"%w":function(e){return e.la},"%W":function(e){return o(Math.floor((e.qa+7-(e.la+6)%7)/7),2)},"%y":function(e){return(e.ra+1900).toString().substring(2)},"%Y":function(e){return e.ra+1900},"%z":function(e){var t=0<=(e=e.Ca);return e=Math.abs(e)/60,(t?"+":"-")+String("0000"+(e/60*100+e%60)).slice(-4)},"%Z":function(e){return e.Fa},"%%":function(){return"%"}},n=n.replace(/%%/g,"\\0\\0"),c)n.includes(l)&&(n=n.replace(new RegExp(l,"g"),c[l](r)));return l=function(e){var t=Array(D(e)+1);return k(e,t,0,t.length),t}(n=n.replace(/\\0\\0/g,"%")),l.length>t?0:(T.set(l,e>>>0),l.length-1)}var oe={a:function(e){return ie(e+24)+24},b:function(e,t,n){throw new J(e).ya(t,n),e},g:function(){return 0},I:function(){},w:function(){},y:function(){},K:function(){return 0},G:function(){},C:function(){},F:function(){},k:function(){},x:function(){},u:function(){},H:function(){},v:function(){},n:function(){},p:function(){B("To use dlopen, you need enable dynamic linking, see https://github.com/emscripten-core/emscripten/wiki/Linking")},o:function(){B("To use dlopen, you need enable dynamic linking, see https://github.com/emscripten-core/emscripten/wiki/Linking")},l:function(){return Date.now()},L:function(){return!0},M:function(e,t){e=new Date(1e3*(M[e>>>2]+4294967296*E[e+4>>>2])),E[t>>2>>>0]=e.getUTCSeconds(),E[t+4>>2>>>0]=e.getUTCMinutes(),E[t+8>>2>>>0]=e.getUTCHours(),E[t+12>>2>>>0]=e.getUTCDate(),E[t+16>>2>>>0]=e.getUTCMonth(),E[t+20>>2>>>0]=e.getUTCFullYear()-1900,E[t+24>>2>>>0]=e.getUTCDay(),E[t+28>>2>>>0]=(e.getTime()-Date.UTC(e.getUTCFullYear(),0,1,0,0,0,0))/864e5|0},N:function(e,t){e=new Date(1e3*(M[e>>>2]+4294967296*E[e+4>>>2])),E[t>>2>>>0]=e.getSeconds(),E[t+4>>2>>>0]=e.getMinutes(),E[t+8>>2>>>0]=e.getHours(),E[t+12>>2>>>0]=e.getDate(),E[t+16>>2>>>0]=e.getMonth(),E[t+20>>2>>>0]=e.getFullYear()-1900,E[t+24>>2>>>0]=e.getDay();var n=new Date(e.getFullYear(),0,1);E[t+28>>2>>>0]=(e.getTime()-n.getTime())/864e5|0,E[t+36>>2>>>0]=-60*e.getTimezoneOffset();var r=new Date(e.getFullYear(),6,1).getTimezoneOffset();n=n.getTimezoneOffset(),E[t+32>>2>>>0]=0|(r!=n&&e.getTimezoneOffset()==Math.min(n,r))},O:function(e){var t=new Date(E[e+20>>2>>>0]+1900,E[e+16>>2>>>0],E[e+12>>2>>>0],E[e+8>>2>>>0],E[e+4>>2>>>0],E[e>>2>>>0],0),n=E[e+32>>2>>>0],r=t.getTimezoneOffset(),a=new Date(t.getFullYear(),0,1),o=new Date(t.getFullYear(),6,1).getTimezoneOffset(),i=a.getTimezoneOffset(),s=Math.min(i,o);return 0>n?E[e+32>>2>>>0]=Number(o!=i&&s==r):0<n!=(s==r)&&(o=Math.max(i,o),t.setTime(t.getTime()+6e4*((0<n?s:o)-r))),E[e+24>>2>>>0]=t.getDay(),E[e+28>>2>>>0]=(t.getTime()-a.getTime())/864e5|0,E[e>>2>>>0]=t.getSeconds(),E[e+4>>2>>>0]=t.getMinutes(),E[e+8>>2>>>0]=t.getHours(),E[e+12>>2>>>0]=t.getDate(),E[e+16>>2>>>0]=t.getMonth(),t.getTime()/1e3|0},z:function(){return-52},B:function(){},m:function e(t,n,r){e.xa||(e.xa=!0,function(e,t,n){function r(e){return(e=e.toTimeString().match(/\\(([A-Za-z ]+)\\)$/))?e[1]:"GMT"}var a=(new Date).getFullYear(),o=new Date(a,0,1),i=new Date(a,6,1);a=o.getTimezoneOffset();var s=i.getTimezoneOffset();E[e>>2>>>0]=60*Math.max(a,s),E[t>>2>>>0]=Number(a!=s),e=r(o),t=r(i),e=Q(e),t=Q(t),s<a?(M[n>>2>>>0]=e,M[n+4>>2>>>0]=t):(M[n>>2>>>0]=t,M[n+4>>2>>>0]=e)}(t,n,r))},d:function(){B("")},t:function(){return 4294901760},h:h?()=>{var e=process.hrtime();return 1e3*e[0]+e[1]/1e6}:()=>performance.now(),J:function(e,t,n){A.copyWithin(e>>>0,t>>>0,t+n>>>0)},f:function(e){var t=A.length;if(4294901760<(e>>>=0))return!1;for(var n=1;4>=n;n*=2){var r=t*(1+.2/n);r=Math.min(r,e+100663296);var a=Math;r=Math.max(e,r),a=a.min.call(a,4294901760,r+(65536-r%65536)%65536);e:{try{O.grow(a-S.byteLength+65535>>>16),F();var o=1;break e}catch(e){}o=void 0}if(o)return!0}return!1},D:function(e,t){var n=0;return K().forEach((function(r,a){var o=t+n;for(a=M[e+4*a>>2>>>0]=o,o=0;o<r.length;++o)T[a++>>0>>>0]=r.charCodeAt(o);T[a>>0>>>0]=0,n+=r.length+1})),0},E:function(e,t){var n=K();M[e>>2>>>0]=n.length;var r=0;return n.forEach((function(e){r+=e.length+1})),M[t>>2>>>0]=r,0},r:function(e){_||(t.onExit&&t.onExit(e),R=!0),d(e,new $(e))},e:function(){return 52},j:function(){return 52},q:function(){return 70},i:function(e,t,n,r){for(var a=0,o=0;o<n;o++){var i=M[t>>2>>>0],s=M[t+4>>2>>>0];t+=8;for(var u=0;u<s;u++){var c=A[i+u>>>0],l=ee[e];0===c||10===c?((1===e?b:w)(C(l,0)),l.length=0):l.push(c)}a+=s}return M[r>>2>>>0]=a,0},s:function e(t,r){e.wa||(e.wa=function(){if("object"==typeof crypto&&"function"==typeof crypto.getRandomValues){var e=new Uint8Array(1);return()=>(crypto.getRandomValues(e),e[0])}if(h)try{var t=n(760);return()=>t.randomBytes(1)[0]}catch(e){}return()=>B("randomDevice")}());for(var a=0;a<r;a++)T[t+a>>0>>>0]=e.wa();return 0},A:ae,c:function(e,t,n,r){return ae(e,t,n,r)}};!function(){function e(e){t.asm=e.exports,O=t.asm.P,F(),I.unshift(t.asm.Q),L--,t.monitorRunDependencies&&t.monitorRunDependencies(L),0==L&&(null!==Y&&(clearInterval(Y),Y=null),z&&(e=z,z=null,e()))}function n(t){e(t.instance)}function r(e){return function(){if(!v&&(m||g)){if("function"==typeof fetch&&!H.startsWith("file://"))return fetch(H,{credentials:"same-origin"}).then((function(e){if(!e.ok)throw"failed to load wasm binary file at \'"+H+"\'";return e.arrayBuffer()})).catch((function(){return q()}));if(i)return new Promise((function(e,t){i(H,(function(t){e(new Uint8Array(t))}),t)}))}return Promise.resolve().then((function(){return q()}))}().then((function(e){return WebAssembly.instantiate(e,o)})).then((function(e){return e})).then(e,(function(e){w("failed to asynchronously prepare wasm: "+e),B(e)}))}var o={a:oe};if(L++,t.monitorRunDependencies&&t.monitorRunDependencies(L),t.instantiateWasm)try{return t.instantiateWasm(o,e)}catch(e){return w("Module.instantiateWasm callback failed with error: "+e),!1}(v||"function"!=typeof WebAssembly.instantiateStreaming||N()||H.startsWith("file://")||h||"function"!=typeof fetch?r(n):fetch(H,{credentials:"same-origin"}).then((function(e){return WebAssembly.instantiateStreaming(e,o).then(n,(function(e){return w("wasm streaming compile failed: "+e),w("falling back to ArrayBuffer instantiation"),r(n)}))}))).catch(a)}(),t.___wasm_call_ctors=function(){return(t.___wasm_call_ctors=t.asm.Q).apply(null,arguments)},t._OrtInit=function(){return(t._OrtInit=t.asm.R).apply(null,arguments)},t._OrtCreateSessionOptions=function(){return(t._OrtCreateSessionOptions=t.asm.S).apply(null,arguments)},t._OrtAppendExecutionProvider=function(){return(t._OrtAppendExecutionProvider=t.asm.T).apply(null,arguments)},t._OrtAddSessionConfigEntry=function(){return(t._OrtAddSessionConfigEntry=t.asm.U).apply(null,arguments)},t._OrtReleaseSessionOptions=function(){return(t._OrtReleaseSessionOptions=t.asm.V).apply(null,arguments)},t._OrtCreateSession=function(){return(t._OrtCreateSession=t.asm.W).apply(null,arguments)},t._OrtReleaseSession=function(){return(t._OrtReleaseSession=t.asm.X).apply(null,arguments)},t._OrtGetInputCount=function(){return(t._OrtGetInputCount=t.asm.Y).apply(null,arguments)},t._OrtGetOutputCount=function(){return(t._OrtGetOutputCount=t.asm.Z).apply(null,arguments)},t._OrtGetInputName=function(){return(t._OrtGetInputName=t.asm._).apply(null,arguments)},t._OrtGetOutputName=function(){return(t._OrtGetOutputName=t.asm.$).apply(null,arguments)},t._OrtFree=function(){return(t._OrtFree=t.asm.aa).apply(null,arguments)},t._OrtCreateTensor=function(){return(t._OrtCreateTensor=t.asm.ba).apply(null,arguments)},t._OrtGetTensorData=function(){return(t._OrtGetTensorData=t.asm.ca).apply(null,arguments)},t._OrtReleaseTensor=function(){return(t._OrtReleaseTensor=t.asm.da).apply(null,arguments)},t._OrtCreateRunOptions=function(){return(t._OrtCreateRunOptions=t.asm.ea).apply(null,arguments)},t._OrtAddRunConfigEntry=function(){return(t._OrtAddRunConfigEntry=t.asm.fa).apply(null,arguments)},t._OrtReleaseRunOptions=function(){return(t._OrtReleaseRunOptions=t.asm.ga).apply(null,arguments)},t._OrtRun=function(){return(t._OrtRun=t.asm.ha).apply(null,arguments)},t._OrtEndProfiling=function(){return(t._OrtEndProfiling=t.asm.ia).apply(null,arguments)};var ie=t._malloc=function(){return(ie=t._malloc=t.asm.ja).apply(null,arguments)};t._free=function(){return(t._free=t.asm.ka).apply(null,arguments)};var se,ue=t.stackSave=function(){return(ue=t.stackSave=t.asm.ma).apply(null,arguments)},ce=t.stackRestore=function(){return(ce=t.stackRestore=t.asm.na).apply(null,arguments)},le=t.stackAlloc=function(){return(le=t.stackAlloc=t.asm.oa).apply(null,arguments)};function fe(){function e(){if(!se&&(se=!0,t.calledRun=!0,!R)){if(V(I),r(t),t.onRuntimeInitialized&&t.onRuntimeInitialized(),t.postRun)for("function"==typeof t.postRun&&(t.postRun=[t.postRun]);t.postRun.length;){var e=t.postRun.shift();W.unshift(e)}V(W)}}if(!(0<L)){if(t.preRun)for("function"==typeof t.preRun&&(t.preRun=[t.preRun]);t.preRun.length;)j();V(U),0<L||(t.setStatus?(t.setStatus("Running..."),setTimeout((function(){setTimeout((function(){t.setStatus("")}),1),e()}),1)):e())}}if(t.___cxa_is_pointer_type=function(){return(t.___cxa_is_pointer_type=t.asm.pa).apply(null,arguments)},t.UTF8ToString=P,t.stringToUTF8=function(e,t,n){return k(e,A,t,n)},t.lengthBytesUTF8=D,t.stackSave=ue,t.stackRestore=ce,t.stackAlloc=le,z=function e(){se||fe(),se||(z=e)},t.preInit)for("function"==typeof t.preInit&&(t.preInit=[t.preInit]);0<t.preInit.length;)t.preInit.pop()();return fe(),e.ready});e.exports=r},154:e=>{"use strict";e.exports=\'"use strict";var e={},t="object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node;if(t){var r=require("worker_threads"),a=r.parentPort;a.on("message",(e=>onmessage({data:e})));var o=require("fs");Object.assign(global,{self:global,require:require,Module:e,location:{href:__filename},Worker:r.Worker,importScripts:function(e){(0,eval)(o.readFileSync(e,"utf8"))},postMessage:function(e){a.postMessage(e)},performance:global.performance||{now:function(){return Date.now()}}})}var s=!1,n=[],i=function(){var e=Array.prototype.slice.call(arguments).join(" ");t?o.writeSync(2,e+"\\\\n"):console.error(e)};self.alert=function(){var t=Array.prototype.slice.call(arguments).join(" ");postMessage({cmd:"alert",text:t,threadId:e._pthread_self()})},e.instantiateWasm=(t,r)=>{var a=new WebAssembly.Instance(e.wasmModule,t);return r(a),e.wasmModule=null,a.exports},self.onunhandledrejection=e=>{throw e.reason??e},self.onmessage=t=>{try{if("load"===t.data.cmd){if(e.wasmModule=t.data.wasmModule,e.wasmMemory=t.data.wasmMemory,e.buffer=e.wasmMemory.buffer,e.ENVIRONMENT_IS_PTHREAD=!0,"string"==typeof t.data.urlOrBlob)importScripts(t.data.urlOrBlob);else{var r=URL.createObjectURL(t.data.urlOrBlob);importScripts(r),URL.revokeObjectURL(r)}ortWasmThreaded(e).then((function(t){e=t}))}else if("run"===t.data.cmd){e.__performance_now_clock_drift=performance.now()-t.data.time,e.__emscripten_thread_init(t.data.pthread_ptr,0,0,1),e.establishStackSpace(),e.PThread.receiveObjectTransfer(t.data),e.PThread.threadInitTLS(),s||(n.forEach((t=>{e.executeNotifiedProxyingQueue(t)})),n=[],s=!0);try{e.invokeEntryPoint(t.data.start_routine,t.data.arg)}catch(t){if("unwind"!=t){if(!(t instanceof e.ExitStatus))throw t;e.keepRuntimeAlive()||e.__emscripten_thread_exit(t.status)}}}else"cancel"===t.data.cmd?e._pthread_self()&&e.__emscripten_thread_exit(-1):"setimmediate"===t.data.target||("processProxyingQueue"===t.data.cmd?s?e.executeNotifiedProxyingQueue(t.data.queue):n.push(t.data.queue):(i("worker.js received unknown command "+t.data.cmd),i(t.data)))}catch(t){throw i("worker.js onmessage() captured an uncaught exception: "+t),t&&t.stack&&i(t.stack),e.__emscripten_thread_crashed&&e.__emscripten_thread_crashed(),t}};\\n\'},760:()=>{},384:()=>{},993:()=>{},908:()=>{},953:()=>{},925:()=>{},449:()=>{}},t={};function n(r){var a=t[r];if(void 0!==a)return a.exports;var o=t[r]={exports:{}};return e[r].call(o.exports,o,o.exports,n),o.exports}n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),(()=>{"use strict";const e=n(259),t=n(263);self.onmessage=n=>{switch(n.data.type){case"init-wasm":(0,t.initializeWebAssembly)(n.data.in).then((()=>postMessage({type:"init-wasm"})),(e=>postMessage({type:"init-wasm",err:e})));break;case"init-ort":try{const{numThreads:t,loggingLevel:r}=n.data.in;(0,e.initOrt)(t,r),postMessage({type:"init-ort"})}catch(e){postMessage({type:"init-ort",err:e})}break;case"create_allocate":try{const{model:t}=n.data.in,r=(0,e.createSessionAllocate)(t);postMessage({type:"create_allocate",out:r})}catch(e){postMessage({type:"create_allocate",err:e})}break;case"create_finalize":try{const{modeldata:t,options:r}=n.data.in,a=(0,e.createSessionFinalize)(t,r);postMessage({type:"create_finalize",out:a})}catch(e){postMessage({type:"create_finalize",err:e})}break;case"create":try{const{model:t,options:r}=n.data.in,a=(0,e.createSession)(t,r);postMessage({type:"create",out:a})}catch(e){postMessage({type:"create",err:e})}break;case"release":try{const t=n.data.in;(0,e.releaseSession)(t),postMessage({type:"release"})}catch(e){postMessage({type:"release",err:e})}break;case"run":try{const{sessionId:t,inputIndices:r,inputs:a,outputIndices:o,options:i}=n.data.in;(0,e.run)(t,r,a,o,i).then((t=>{postMessage({type:"run",out:t},(0,e.extractTransferableBuffers)(t))}),(e=>{postMessage({type:"run",err:e})}))}catch(e){postMessage({type:"run",err:e})}break;case"end-profiling":try{const t=n.data.in;(0,e.endProfiling)(t),postMessage({type:"end-profiling"})}catch(e){postMessage({type:"end-profiling",err:e})}}}})()})();\n',"Worker",void 0,void 0)}},6614:e=>{"use strict";e.exports=function(e,t,n,r){var o=self||window;try{try{var i;try{i=new o.Blob([e])}catch(t){(i=new(o.BlobBuilder||o.WebKitBlobBuilder||o.MozBlobBuilder||o.MSBlobBuilder)).append(e),i=i.getBlob()}var a=o.URL||o.webkitURL,s=a.createObjectURL(i),u=new o[t](s,n);return a.revokeObjectURL(s),u}catch(r){return new o[t]("data:application/javascript,".concat(encodeURIComponent(e)),n)}}catch(e){if(!r)throw Error("Inline worker is not supported");return new o[t](r,n)}}},3474:(e,t,n)=>{var _scriptDir,r=(_scriptDir=(_scriptDir="undefined"!=typeof document&&document.currentScript?document.currentScript.src:void 0)||"/index.js",function(e){function t(){return D.buffer!=C&&H(D.buffer),R}function r(){return D.buffer!=C&&H(D.buffer),M}function o(){return D.buffer!=C&&H(D.buffer),N}function i(){return D.buffer!=C&&H(D.buffer),F}function a(){return D.buffer!=C&&H(D.buffer),L}var s,u,l;e=e||{},s||(s=void 0!==e?e:{}),s.ready=new Promise((function(e,t){u=e,l=t}));var c,p,d,f,h,g,m=Object.assign({},s),b="./this.program",y=(e,t)=>{throw t},w="object"==typeof window,_="function"==typeof importScripts,v="object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node,x=s.ENVIRONMENT_IS_PTHREAD||!1,T="";function S(e){return s.locateFile?s.locateFile(e,T):T+e}if(v){let t;T=_?n(908).dirname(T)+"/":"//",g=()=>{h||(f=n(1384),h=n(908))},c=function(e,t){return g(),e=h.normalize(e),f.readFileSync(e,t?void 0:"utf8")},d=e=>((e=c(e,!0)).buffer||(e=new Uint8Array(e)),e),p=(e,t,n)=>{g(),e=h.normalize(e),f.readFile(e,(function(e,r){e?n(e):t(r.buffer)}))},1<process.argv.length&&(b=process.argv[1].replace(/\\/g,"/")),process.argv.slice(2),process.on("uncaughtException",(function(e){if(!(e instanceof ae))throw e})),process.on("unhandledRejection",(function(e){throw e})),y=(e,t)=>{if(P)throw process.exitCode=e,t;t instanceof ae||$("exiting due to exception: "+t),process.exit(e)},s.inspect=function(){return"[Emscripten Module object]"};try{t=n(9925)}catch(e){throw console.error('The "worker_threads" module is not supported in this node.js build - perhaps a newer version is needed?'),e}n.g.Worker=t.Worker}else(w||_)&&(_?T=self.location.href:"undefined"!=typeof document&&document.currentScript&&(T=document.currentScript.src),_scriptDir&&(T=_scriptDir),T=0!==T.indexOf("blob:")?T.substr(0,T.replace(/[?#].*/,"").lastIndexOf("/")+1):"",v||(c=e=>{var t=new XMLHttpRequest;return t.open("GET",e,!1),t.send(null),t.responseText},_&&(d=e=>{var t=new XMLHttpRequest;return t.open("GET",e,!1),t.responseType="arraybuffer",t.send(null),new Uint8Array(t.response)}),p=(e,t,n)=>{var r=new XMLHttpRequest;r.open("GET",e,!0),r.responseType="arraybuffer",r.onload=()=>{200==r.status||0==r.status&&r.response?t(r.response):n()},r.onerror=n,r.send(null)}));v&&"undefined"==typeof performance&&(n.g.performance=n(6953).performance);var O=console.log.bind(console),A=console.warn.bind(console);v&&(g(),O=e=>f.writeSync(1,e+"\n"),A=e=>f.writeSync(2,e+"\n"));var E,I=s.print||O,$=s.printErr||A;Object.assign(s,m),m=null,s.thisProgram&&(b=s.thisProgram),s.quit&&(y=s.quit),s.wasmBinary&&(E=s.wasmBinary);var P=s.noExitRuntime||!0;"object"!=typeof WebAssembly&&ne("no native wasm support detected");var D,k,C,R,M,N,F,L,j=!1,U="undefined"!=typeof TextDecoder?new TextDecoder("utf8"):void 0;function B(e,t,n){var r=(t>>>=0)+n;for(n=t;e[n]&&!(n>=r);)++n;if(16<n-t&&e.buffer&&U)return U.decode(e.buffer instanceof SharedArrayBuffer?e.slice(t,n):e.subarray(t,n));for(r="";t<n;){var o=e[t++];if(128&o){var i=63&e[t++];if(192==(224&o))r+=String.fromCharCode((31&o)<<6|i);else{var a=63&e[t++];65536>(o=224==(240&o)?(15&o)<<12|i<<6|a:(7&o)<<18|i<<12|a<<6|63&e[t++])?r+=String.fromCharCode(o):(o-=65536,r+=String.fromCharCode(55296|o>>10,56320|1023&o))}}else r+=String.fromCharCode(o)}return r}function G(e,t){return(e>>>=0)?B(r(),e,t):""}function V(e,t,n,r){if(!(0<r))return 0;var o=n>>>=0;r=n+r-1;for(var i=0;i<e.length;++i){var a=e.charCodeAt(i);if(55296<=a&&57343>=a&&(a=65536+((1023&a)<<10)|1023&e.charCodeAt(++i)),127>=a){if(n>=r)break;t[n++>>>0]=a}else{if(2047>=a){if(n+1>=r)break;t[n++>>>0]=192|a>>6}else{if(65535>=a){if(n+2>=r)break;t[n++>>>0]=224|a>>12}else{if(n+3>=r)break;t[n++>>>0]=240|a>>18,t[n++>>>0]=128|a>>12&63}t[n++>>>0]=128|a>>6&63}t[n++>>>0]=128|63&a}}return t[n>>>0]=0,n-o}function z(e){for(var t=0,n=0;n<e.length;++n){var r=e.charCodeAt(n);127>=r?t++:2047>=r?t+=2:55296<=r&&57343>=r?(t+=4,++n):t+=3}return t}function H(e){C=e,s.HEAP8=R=new Int8Array(e),s.HEAP16=new Int16Array(e),s.HEAP32=N=new Int32Array(e),s.HEAPU8=M=new Uint8Array(e),s.HEAPU16=new Uint16Array(e),s.HEAPU32=F=new Uint32Array(e),s.HEAPF32=new Float32Array(e),s.HEAPF64=L=new Float64Array(e)}x&&(C=s.buffer);var W=s.INITIAL_MEMORY||16777216;if(x)D=s.wasmMemory,C=s.buffer;else if(s.wasmMemory)D=s.wasmMemory;else if(!((D=new WebAssembly.Memory({initial:W/65536,maximum:65536,shared:!0})).buffer instanceof SharedArrayBuffer))throw $("requested a shared WebAssembly.Memory but the returned buffer is not a SharedArrayBuffer, indicating that while the browser has SharedArrayBuffer it does not have WebAssembly threads support - you may need to set a flag"),v&&console.log("(on node you may need: --experimental-wasm-threads --experimental-wasm-bulk-memory and also use a recent version)"),Error("bad memory");D&&(C=D.buffer),W=C.byteLength,H(C);var q,K=[],X=[],Y=[];function J(){var e=s.preRun.shift();K.unshift(e)}var Z,Q=0,ee=null,te=null;function ne(e){throw x?postMessage({cmd:"onAbort",arg:e}):s.onAbort&&s.onAbort(e),$(e="Aborted("+e+")"),j=!0,e=new WebAssembly.RuntimeError(e+". Build with -sASSERTIONS for more info."),l(e),e}function re(){return Z.startsWith("data:application/octet-stream;base64,")}function oe(){var e=Z;try{if(e==Z&&E)return new Uint8Array(E);if(d)return d(e);throw"both async and sync fetching of the wasm failed"}catch(e){ne(e)}}Z="ort-wasm-threaded.wasm",re()||(Z=S(Z));var ie={};function ae(e){this.name="ExitStatus",this.message="Program terminated with exit("+e+")",this.status=e}function se(e){(e=pe.La[e])||ne(),pe.Xa(e)}function ue(e){var t=pe.lb();if(!t)return 6;pe.Ra.push(t),pe.La[e.Ka]=t,t.Ka=e.Ka;var n={cmd:"run",start_routine:e.pb,arg:e.ib,pthread_ptr:e.Ka};return t.Qa=()=>{n.time=performance.now(),t.postMessage(n,e.vb)},t.loaded&&(t.Qa(),delete t.Qa),0}function le(e){if(x)return je(1,1,e);P||(pe.qb(),s.onExit&&s.onExit(e),j=!0),y(e,new ae(e))}function ce(e,t){if(!t&&x)throw fe(e),"unwind";le(e)}var pe={Oa:[],Ra:[],$a:[],La:{},Ua:function(){x&&pe.mb()},xb:function(){},mb:function(){pe.receiveObjectTransfer=pe.ob,pe.threadInitTLS=pe.Za,pe.setExitStatus=pe.Ya,P=!1},Ya:function(){},qb:function(){for(var e of Object.values(pe.La))pe.Xa(e);for(e of pe.Oa)e.terminate();pe.Oa=[]},Xa:function(e){var t=e.Ka;delete pe.La[t],pe.Oa.push(e),pe.Ra.splice(pe.Ra.indexOf(e),1),e.Ka=0,lt(t)},ob:function(){},Za:function(){pe.$a.forEach((e=>e()))},nb:function(e,t){e.onmessage=n=>{var r=(n=n.data).cmd;if(e.Ka&&(pe.kb=e.Ka),n.targetThread&&n.targetThread!=rt()){var o=pe.La[n.yb];o?o.postMessage(n,n.transferList):$('Internal error! Worker sent a message "'+r+'" to target pthread '+n.targetThread+", but that thread no longer exists!")}else"processProxyingQueue"===r?Ce(n.queue):"spawnThread"===r?ue(n):"cleanupThread"===r?se(n.thread):"killThread"===r?(n=n.thread,r=pe.La[n],delete pe.La[n],r.terminate(),lt(n),pe.Ra.splice(pe.Ra.indexOf(r),1),r.Ka=0):"cancelThread"===r?pe.La[n.thread].postMessage({cmd:"cancel"}):"loaded"===r?(e.loaded=!0,t&&t(e),e.Qa&&(e.Qa(),delete e.Qa)):"print"===r?I("Thread "+n.threadId+": "+n.text):"printErr"===r?$("Thread "+n.threadId+": "+n.text):"alert"===r?alert("Thread "+n.threadId+": "+n.text):"setimmediate"===n.target?e.postMessage(n):"onAbort"===r?s.onAbort&&s.onAbort(n.arg):r&&$("worker sent an unknown command "+r);pe.kb=void 0},e.onerror=e=>{throw $("worker sent an error! "+e.filename+":"+e.lineno+": "+e.message),e},v&&(e.on("message",(function(t){e.onmessage({data:t})})),e.on("error",(function(t){e.onerror(t)})),e.on("detachedExit",(function(){}))),e.postMessage({cmd:"load",urlOrBlob:s.mainScriptUrlOrBlob||_scriptDir,wasmMemory:D,wasmModule:k})},hb:function(){var e=S("ort-wasm-threaded.worker.js");pe.Oa.push(new Worker(e))},lb:function(){return 0==pe.Oa.length&&(pe.hb(),pe.nb(pe.Oa[0])),pe.Oa.pop()}};function de(e){for(;0<e.length;)e.shift()(s)}function fe(e){if(x)return je(2,0,e);try{ce(e)}catch(e){e instanceof ae||"unwind"==e||y(1,e)}}s.PThread=pe,s.establishStackSpace=function(){var e=rt(),t=o()[e+44>>2>>>0];e=o()[e+48>>2>>>0],pt(t,t-e),ft(t)};var he,ge,me=[];function be(e){this.Pa=e-24,this.gb=function(e){i()[this.Pa+4>>2>>>0]=e},this.cb=function(e){i()[this.Pa+8>>2>>>0]=e},this.eb=function(){o()[this.Pa>>2>>>0]=0},this.bb=function(){t()[this.Pa+12>>0>>>0]=0},this.fb=function(){t()[this.Pa+13>>0>>>0]=0},this.Ua=function(e,t){this.ab(),this.gb(e),this.cb(t),this.eb(),this.bb(),this.fb()},this.ab=function(){i()[this.Pa+16>>2>>>0]=0}}function ye(e,t,n,r){return x?je(3,1,e,t,n,r):we(e,t,n,r)}function we(e,t,n,r){if("undefined"==typeof SharedArrayBuffer)return $("Current environment does not support SharedArrayBuffer, pthreads are not available!"),6;var o=[];return x&&0===o.length?ye(e,t,n,r):(e={pb:n,Ka:e,ib:r,vb:o},x?(e.wb="spawnThread",postMessage(e,o),0):ue(e))}function _e(e,t,n){return x?je(4,1,e,t,n):0}function ve(e,t){if(x)return je(5,1,e,t)}function xe(e,t){if(x)return je(6,1,e,t)}function Te(e,t,n){if(x)return je(7,1,e,t,n)}function Se(e,t,n){return x?je(8,1,e,t,n):0}function Oe(e,t){if(x)return je(9,1,e,t)}function Ae(e,t,n){if(x)return je(10,1,e,t,n)}function Ee(e,t,n,r){if(x)return je(11,1,e,t,n,r)}function Ie(e,t,n,r){if(x)return je(12,1,e,t,n,r)}function $e(e,t,n,r){if(x)return je(13,1,e,t,n,r)}function Pe(e){if(x)return je(14,1,e)}function De(e,t){if(x)return je(15,1,e,t)}function ke(e,t,n){if(x)return je(16,1,e,t,n)}function Ce(e){Atomics.store(o(),e>>2,1),rt()&&ut(e),Atomics.compareExchange(o(),e>>2,1,0)}function Re(e){return i()[e>>>2]+4294967296*o()[e+4>>>2]}function Me(e,t,n,r,o,i){return x?je(17,1,e,t,n,r,o,i):-52}function Ne(e,t,n,r,o,i){if(x)return je(18,1,e,t,n,r,o,i)}function Fe(e){var n=z(e)+1,r=ot(n);return r&&V(e,t(),r,n),r}function Le(e,t,n){function r(e){return(e=e.toTimeString().match(/\(([A-Za-z ]+)\)$/))?e[1]:"GMT"}if(x)return je(19,1,e,t,n);var a=(new Date).getFullYear(),s=new Date(a,0,1),u=new Date(a,6,1);a=s.getTimezoneOffset();var l=u.getTimezoneOffset(),c=Math.max(a,l);o()[e>>2>>>0]=60*c,o()[t>>2>>>0]=Number(a!=l),e=r(s),t=r(u),e=Fe(e),t=Fe(t),l<a?(i()[n>>2>>>0]=e,i()[n+4>>2>>>0]=t):(i()[n>>2>>>0]=t,i()[n+4>>2>>>0]=e)}function je(e,t){var n=arguments.length-2,r=arguments;return function(e){var t=dt();return e=e(),ft(t),e}((()=>{for(var o=ht(8*n),i=o>>3,s=0;s<n;s++){var u=r[2+s];a()[i+s>>>0]=u}return st(e,n,o,t)}))}s.invokeEntryPoint=function(e,t){var n=me[e];n||(e>=me.length&&(me.length=e+1),me[e]=n=q.get(e)),e=n(t),P?pe.Ya(e):ct(e)},s.executeNotifiedProxyingQueue=Ce,ge=v?()=>{var e=process.hrtime();return 1e3*e[0]+e[1]/1e6}:x?()=>performance.now()-s.__performance_now_clock_drift:()=>performance.now();var Ue,Be=[],Ge={};function Ve(){if(!Ue){var e,t={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:("object"==typeof navigator&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:b||"./this.program"};for(e in Ge)void 0===Ge[e]?delete t[e]:t[e]=Ge[e];var n=[];for(e in t)n.push(e+"="+t[e]);Ue=n}return Ue}function ze(e,n){if(x)return je(20,1,e,n);var r=0;return Ve().forEach((function(o,a){var s=n+r;for(a=i()[e+4*a>>2>>>0]=s,s=0;s<o.length;++s)t()[a++>>0>>>0]=o.charCodeAt(s);t()[a>>0>>>0]=0,r+=o.length+1})),0}function He(e,t){if(x)return je(21,1,e,t);var n=Ve();i()[e>>2>>>0]=n.length;var r=0;return n.forEach((function(e){r+=e.length+1})),i()[t>>2>>>0]=r,0}function We(e){return x?je(22,1,e):52}function qe(e,t,n,r){return x?je(23,1,e,t,n,r):52}function Ke(e,t,n,r,o){return x?je(24,1,e,t,n,r,o):70}var Xe=[null,[],[]];function Ye(e,t,n,o){if(x)return je(25,1,e,t,n,o);for(var a=0,s=0;s<n;s++){var u=i()[t>>2>>>0],l=i()[t+4>>2>>>0];t+=8;for(var c=0;c<l;c++){var p=r()[u+c>>>0],d=Xe[e];0===p||10===p?((1===e?I:$)(B(d,0)),d.length=0):d.push(p)}a+=l}return i()[o>>2>>>0]=a,0}function Je(e){return 0==e%4&&(0!=e%100||0==e%400)}var Ze=[31,29,31,30,31,30,31,31,30,31,30,31],Qe=[31,28,31,30,31,30,31,31,30,31,30,31];function et(e,n,r,i){function a(e,t,n){for(e="number"==typeof e?e.toString():e||"";e.length<t;)e=n[0]+e;return e}function s(e,t){return a(e,t,"0")}function u(e,t){function n(e){return 0>e?-1:0<e?1:0}var r;return 0===(r=n(e.getFullYear()-t.getFullYear()))&&0===(r=n(e.getMonth()-t.getMonth()))&&(r=n(e.getDate()-t.getDate())),r}function l(e){switch(e.getDay()){case 0:return new Date(e.getFullYear()-1,11,29);case 1:return e;case 2:return new Date(e.getFullYear(),0,3);case 3:return new Date(e.getFullYear(),0,2);case 4:return new Date(e.getFullYear(),0,1);case 5:return new Date(e.getFullYear()-1,11,31);case 6:return new Date(e.getFullYear()-1,11,30)}}function c(e){var t=e.Ma;for(e=new Date(new Date(e.Na+1900,0,1).getTime());0<t;){var n=e.getMonth(),r=(Je(e.getFullYear())?Ze:Qe)[n];if(!(t>r-e.getDate())){e.setDate(e.getDate()+t);break}t-=r-e.getDate()+1,e.setDate(1),11>n?e.setMonth(n+1):(e.setMonth(0),e.setFullYear(e.getFullYear()+1))}return n=new Date(e.getFullYear()+1,0,4),t=l(new Date(e.getFullYear(),0,4)),n=l(n),0>=u(t,e)?0>=u(n,e)?e.getFullYear()+1:e.getFullYear():e.getFullYear()-1}var p=o()[i+40>>2>>>0];for(var d in i={tb:o()[i>>2>>>0],sb:o()[i+4>>2>>>0],Sa:o()[i+8>>2>>>0],Va:o()[i+12>>2>>>0],Ta:o()[i+16>>2>>>0],Na:o()[i+20>>2>>>0],Ja:o()[i+24>>2>>>0],Ma:o()[i+28>>2>>>0],zb:o()[i+32>>2>>>0],rb:o()[i+36>>2>>>0],ub:p?G(p):""},r=G(r),p={"%c":"%a %b %d %H:%M:%S %Y","%D":"%m/%d/%y","%F":"%Y-%m-%d","%h":"%b","%r":"%I:%M:%S %p","%R":"%H:%M","%T":"%H:%M:%S","%x":"%m/%d/%y","%X":"%H:%M:%S","%Ec":"%c","%EC":"%C","%Ex":"%m/%d/%y","%EX":"%H:%M:%S","%Ey":"%y","%EY":"%Y","%Od":"%d","%Oe":"%e","%OH":"%H","%OI":"%I","%Om":"%m","%OM":"%M","%OS":"%S","%Ou":"%u","%OU":"%U","%OV":"%V","%Ow":"%w","%OW":"%W","%Oy":"%y"})r=r.replace(new RegExp(d,"g"),p[d]);var f="Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),h="January February March April May June July August September October November December".split(" ");for(d in p={"%a":function(e){return f[e.Ja].substring(0,3)},"%A":function(e){return f[e.Ja]},"%b":function(e){return h[e.Ta].substring(0,3)},"%B":function(e){return h[e.Ta]},"%C":function(e){return s((e.Na+1900)/100|0,2)},"%d":function(e){return s(e.Va,2)},"%e":function(e){return a(e.Va,2," ")},"%g":function(e){return c(e).toString().substring(2)},"%G":function(e){return c(e)},"%H":function(e){return s(e.Sa,2)},"%I":function(e){return 0==(e=e.Sa)?e=12:12<e&&(e-=12),s(e,2)},"%j":function(e){for(var t=0,n=0;n<=e.Ta-1;t+=(Je(e.Na+1900)?Ze:Qe)[n++]);return s(e.Va+t,3)},"%m":function(e){return s(e.Ta+1,2)},"%M":function(e){return s(e.sb,2)},"%n":function(){return"\n"},"%p":function(e){return 0<=e.Sa&&12>e.Sa?"AM":"PM"},"%S":function(e){return s(e.tb,2)},"%t":function(){return"\t"},"%u":function(e){return e.Ja||7},"%U":function(e){return s(Math.floor((e.Ma+7-e.Ja)/7),2)},"%V":function(e){var t=Math.floor((e.Ma+7-(e.Ja+6)%7)/7);if(2>=(e.Ja+371-e.Ma-2)%7&&t++,t)53==t&&(4==(n=(e.Ja+371-e.Ma)%7)||3==n&&Je(e.Na)||(t=1));else{t=52;var n=(e.Ja+7-e.Ma-1)%7;(4==n||5==n&&Je(e.Na%400-1))&&t++}return s(t,2)},"%w":function(e){return e.Ja},"%W":function(e){return s(Math.floor((e.Ma+7-(e.Ja+6)%7)/7),2)},"%y":function(e){return(e.Na+1900).toString().substring(2)},"%Y":function(e){return e.Na+1900},"%z":function(e){var t=0<=(e=e.rb);return e=Math.abs(e)/60,(t?"+":"-")+String("0000"+(e/60*100+e%60)).slice(-4)},"%Z":function(e){return e.ub},"%%":function(){return"%"}},r=r.replace(/%%/g,"\0\0"),p)r.includes(d)&&(r=r.replace(new RegExp(d,"g"),p[d](i)));return d=function(e){var t=Array(z(e)+1);return V(e,t,0,t.length),t}(r=r.replace(/\0\0/g,"%")),d.length>n?0:(function(e,n){t().set(e,n>>>0)}(d,e),d.length-1)}pe.Ua();var tt=[null,le,fe,ye,_e,ve,xe,Te,Se,Oe,Ae,Ee,Ie,$e,Pe,De,ke,Me,Ne,Le,ze,He,We,qe,Ke,Ye],nt={b:function(e){return ot(e+24)+24},c:function(e,t,n){throw new be(e).Ua(t,n),e},L:function(e){it(e,!_,1,!w),pe.Za()},l:function(e){x?postMessage({cmd:"cleanupThread",thread:e}):se(e)},D:we,i:_e,R:ve,z:xe,B:Te,T:Se,P:Oe,I:Ae,O:Ee,p:Ie,A:$e,x:Pe,Q:De,y:ke,r:function(){},j:function(){ne("To use dlopen, you need enable dynamic linking, see https://github.com/emscripten-core/emscripten/wiki/Linking")},s:function(){ne("To use dlopen, you need enable dynamic linking, see https://github.com/emscripten-core/emscripten/wiki/Linking")},q:function(){return Date.now()},E:function(){return 2097152},V:function(){return!0},F:function(e,t,n,r){if(e==t)setTimeout((()=>Ce(r)));else if(x)postMessage({targetThread:e,cmd:"processProxyingQueue",queue:r});else{if(!(e=pe.La[e]))return;e.postMessage({cmd:"processProxyingQueue",queue:r})}return 1},K:function(){return-1},W:function(e,t){e=new Date(1e3*Re(e)),o()[t>>2>>>0]=e.getUTCSeconds(),o()[t+4>>2>>>0]=e.getUTCMinutes(),o()[t+8>>2>>>0]=e.getUTCHours(),o()[t+12>>2>>>0]=e.getUTCDate(),o()[t+16>>2>>>0]=e.getUTCMonth(),o()[t+20>>2>>>0]=e.getUTCFullYear()-1900,o()[t+24>>2>>>0]=e.getUTCDay(),e=(e.getTime()-Date.UTC(e.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,o()[t+28>>2>>>0]=e},X:function(e,t){e=new Date(1e3*Re(e)),o()[t>>2>>>0]=e.getSeconds(),o()[t+4>>2>>>0]=e.getMinutes(),o()[t+8>>2>>>0]=e.getHours(),o()[t+12>>2>>>0]=e.getDate(),o()[t+16>>2>>>0]=e.getMonth(),o()[t+20>>2>>>0]=e.getFullYear()-1900,o()[t+24>>2>>>0]=e.getDay();var n=new Date(e.getFullYear(),0,1),r=(e.getTime()-n.getTime())/864e5|0;o()[t+28>>2>>>0]=r,o()[t+36>>2>>>0]=-60*e.getTimezoneOffset(),r=new Date(e.getFullYear(),6,1).getTimezoneOffset(),e=0|(r!=(n=n.getTimezoneOffset())&&e.getTimezoneOffset()==Math.min(n,r)),o()[t+32>>2>>>0]=e},Y:function(e){var t=new Date(o()[e+20>>2>>>0]+1900,o()[e+16>>2>>>0],o()[e+12>>2>>>0],o()[e+8>>2>>>0],o()[e+4>>2>>>0],o()[e>>2>>>0],0),n=o()[e+32>>2>>>0],r=t.getTimezoneOffset(),i=new Date(t.getFullYear(),0,1),a=new Date(t.getFullYear(),6,1).getTimezoneOffset(),s=i.getTimezoneOffset(),u=Math.min(s,a);return 0>n?o()[e+32>>2>>>0]=Number(a!=s&&u==r):0<n!=(u==r)&&(a=Math.max(s,a),t.setTime(t.getTime()+6e4*((0<n?u:a)-r))),o()[e+24>>2>>>0]=t.getDay(),n=(t.getTime()-i.getTime())/864e5|0,o()[e+28>>2>>>0]=n,o()[e>>2>>>0]=t.getSeconds(),o()[e+4>>2>>>0]=t.getMinutes(),o()[e+8>>2>>>0]=t.getHours(),o()[e+12>>2>>>0]=t.getDate(),o()[e+16>>2>>>0]=t.getMonth(),t.getTime()/1e3|0},G:Me,H:Ne,Z:function e(t,n,r){e.jb||(e.jb=!0,Le(t,n,r))},d:function(){ne("")},m:function(){if(!v&&!_){var e="Blocking on the main thread is very dangerous, see https://emscripten.org/docs/porting/pthreads.html#blocking-on-the-main-browser-thread";he||(he={}),he[e]||(he[e]=1,v&&(e="warning: "+e),$(e))}},w:function(){return 4294901760},f:ge,S:function(e,t,n){r().copyWithin(e>>>0,t>>>0,t+n>>>0)},g:function(){return v?n(3993).cpus().length:navigator.hardwareConcurrency},J:function(e,t,n){Be.length=t,n>>=3;for(var r=0;r<t;r++)Be[r]=a()[n+r>>>0];return(0>e?ie[-e-1]:tt[e]).apply(null,Be)},v:function(e){var t=r().length;if((e>>>=0)<=t||4294901760<e)return!1;for(var n=1;4>=n;n*=2){var o=t*(1+.2/n);o=Math.min(o,e+100663296);var i=Math;o=Math.max(e,o),i=i.min.call(i,4294901760,o+(65536-o%65536)%65536);e:{try{D.grow(i-C.byteLength+65535>>>16),H(D.buffer);var a=1;break e}catch(e){}a=void 0}if(a)return!0}return!1},U:function(){throw"unwind"},M:ze,N:He,k:ce,h:We,o:qe,t:Ke,n:Ye,u:function e(r,o){e.Wa||(e.Wa=function(){if("object"==typeof crypto&&"function"==typeof crypto.getRandomValues){var e=new Uint8Array(1);return()=>(crypto.getRandomValues(e),e[0])}if(v)try{var t=n(760);return()=>t.randomBytes(1)[0]}catch(e){}return()=>ne("randomDevice")}());for(var i=0;i<o;i++)t()[r+i>>0>>>0]=e.Wa();return 0},a:D||s.wasmMemory,C:et,e:function(e,t,n,r){return et(e,t,n,r)}};!function(){function e(e,t){s.asm=e.exports,pe.$a.push(s.asm.wa),q=s.asm.za,X.unshift(s.asm._),k=t,x||(Q--,s.monitorRunDependencies&&s.monitorRunDependencies(Q),0==Q&&(null!==ee&&(clearInterval(ee),ee=null),te&&(e=te,te=null,e())))}function t(t){e(t.instance,t.module)}function n(e){return function(){if(!E&&(w||_)){if("function"==typeof fetch&&!Z.startsWith("file://"))return fetch(Z,{credentials:"same-origin"}).then((function(e){if(!e.ok)throw"failed to load wasm binary file at '"+Z+"'";return e.arrayBuffer()})).catch((function(){return oe()}));if(p)return new Promise((function(e,t){p(Z,(function(t){e(new Uint8Array(t))}),t)}))}return Promise.resolve().then((function(){return oe()}))}().then((function(e){return WebAssembly.instantiate(e,r)})).then((function(e){return e})).then(e,(function(e){$("failed to asynchronously prepare wasm: "+e),ne(e)}))}var r={a:nt};if(x||(Q++,s.monitorRunDependencies&&s.monitorRunDependencies(Q)),s.instantiateWasm)try{return s.instantiateWasm(r,e)}catch(e){return $("Module.instantiateWasm callback failed with error: "+e),!1}(E||"function"!=typeof WebAssembly.instantiateStreaming||re()||Z.startsWith("file://")||v||"function"!=typeof fetch?n(t):fetch(Z,{credentials:"same-origin"}).then((function(e){return WebAssembly.instantiateStreaming(e,r).then(t,(function(e){return $("wasm streaming compile failed: "+e),$("falling back to ArrayBuffer instantiation"),n(t)}))}))).catch(l)}(),s.___wasm_call_ctors=function(){return(s.___wasm_call_ctors=s.asm._).apply(null,arguments)},s._OrtInit=function(){return(s._OrtInit=s.asm.$).apply(null,arguments)},s._OrtCreateSessionOptions=function(){return(s._OrtCreateSessionOptions=s.asm.aa).apply(null,arguments)},s._OrtAppendExecutionProvider=function(){return(s._OrtAppendExecutionProvider=s.asm.ba).apply(null,arguments)},s._OrtAddSessionConfigEntry=function(){return(s._OrtAddSessionConfigEntry=s.asm.ca).apply(null,arguments)},s._OrtReleaseSessionOptions=function(){return(s._OrtReleaseSessionOptions=s.asm.da).apply(null,arguments)},s._OrtCreateSession=function(){return(s._OrtCreateSession=s.asm.ea).apply(null,arguments)},s._OrtReleaseSession=function(){return(s._OrtReleaseSession=s.asm.fa).apply(null,arguments)},s._OrtGetInputCount=function(){return(s._OrtGetInputCount=s.asm.ga).apply(null,arguments)},s._OrtGetOutputCount=function(){return(s._OrtGetOutputCount=s.asm.ha).apply(null,arguments)},s._OrtGetInputName=function(){return(s._OrtGetInputName=s.asm.ia).apply(null,arguments)},s._OrtGetOutputName=function(){return(s._OrtGetOutputName=s.asm.ja).apply(null,arguments)},s._OrtFree=function(){return(s._OrtFree=s.asm.ka).apply(null,arguments)},s._OrtCreateTensor=function(){return(s._OrtCreateTensor=s.asm.la).apply(null,arguments)},s._OrtGetTensorData=function(){return(s._OrtGetTensorData=s.asm.ma).apply(null,arguments)},s._OrtReleaseTensor=function(){return(s._OrtReleaseTensor=s.asm.na).apply(null,arguments)},s._OrtCreateRunOptions=function(){return(s._OrtCreateRunOptions=s.asm.oa).apply(null,arguments)},s._OrtAddRunConfigEntry=function(){return(s._OrtAddRunConfigEntry=s.asm.pa).apply(null,arguments)},s._OrtReleaseRunOptions=function(){return(s._OrtReleaseRunOptions=s.asm.qa).apply(null,arguments)},s._OrtRun=function(){return(s._OrtRun=s.asm.ra).apply(null,arguments)},s._OrtEndProfiling=function(){return(s._OrtEndProfiling=s.asm.sa).apply(null,arguments)};var rt=s._pthread_self=function(){return(rt=s._pthread_self=s.asm.ta).apply(null,arguments)},ot=s._malloc=function(){return(ot=s._malloc=s.asm.ua).apply(null,arguments)};s._free=function(){return(s._free=s.asm.va).apply(null,arguments)},s.__emscripten_tls_init=function(){return(s.__emscripten_tls_init=s.asm.wa).apply(null,arguments)};var it=s.__emscripten_thread_init=function(){return(it=s.__emscripten_thread_init=s.asm.xa).apply(null,arguments)};s.__emscripten_thread_crashed=function(){return(s.__emscripten_thread_crashed=s.asm.ya).apply(null,arguments)};var at,st=s._emscripten_run_in_main_runtime_thread_js=function(){return(st=s._emscripten_run_in_main_runtime_thread_js=s.asm.Aa).apply(null,arguments)},ut=s.__emscripten_proxy_execute_task_queue=function(){return(ut=s.__emscripten_proxy_execute_task_queue=s.asm.Ba).apply(null,arguments)},lt=s.__emscripten_thread_free_data=function(){return(lt=s.__emscripten_thread_free_data=s.asm.Ca).apply(null,arguments)},ct=s.__emscripten_thread_exit=function(){return(ct=s.__emscripten_thread_exit=s.asm.Da).apply(null,arguments)},pt=s._emscripten_stack_set_limits=function(){return(pt=s._emscripten_stack_set_limits=s.asm.Ea).apply(null,arguments)},dt=s.stackSave=function(){return(dt=s.stackSave=s.asm.Fa).apply(null,arguments)},ft=s.stackRestore=function(){return(ft=s.stackRestore=s.asm.Ga).apply(null,arguments)},ht=s.stackAlloc=function(){return(ht=s.stackAlloc=s.asm.Ha).apply(null,arguments)};function gt(){function e(){if(!at&&(at=!0,s.calledRun=!0,!j)&&(x||de(X),u(s),s.onRuntimeInitialized&&s.onRuntimeInitialized(),!x)){if(s.postRun)for("function"==typeof s.postRun&&(s.postRun=[s.postRun]);s.postRun.length;){var e=s.postRun.shift();Y.unshift(e)}de(Y)}}if(!(0<Q))if(x)u(s),x||de(X),postMessage({cmd:"loaded"});else{if(s.preRun)for("function"==typeof s.preRun&&(s.preRun=[s.preRun]);s.preRun.length;)J();de(K),0<Q||(s.setStatus?(s.setStatus("Running..."),setTimeout((function(){setTimeout((function(){s.setStatus("")}),1),e()}),1)):e())}}if(s.___cxa_is_pointer_type=function(){return(s.___cxa_is_pointer_type=s.asm.Ia).apply(null,arguments)},s.UTF8ToString=G,s.stringToUTF8=function(e,t,n){return V(e,r(),t,n)},s.lengthBytesUTF8=z,s.keepRuntimeAlive=function(){return P},s.wasmMemory=D,s.stackSave=dt,s.stackRestore=ft,s.stackAlloc=ht,s.ExitStatus=ae,s.PThread=pe,te=function e(){at||gt(),at||(te=e)},s.preInit)for("function"==typeof s.preInit&&(s.preInit=[s.preInit]);0<s.preInit.length;)s.preInit.pop()();return gt(),e.ready});e.exports=r},932:(e,t,n)=>{var _scriptDir,r=(_scriptDir=(_scriptDir="undefined"!=typeof document&&document.currentScript?document.currentScript.src:void 0)||"/index.js",function(e){var t,r,o;e=e||{},t||(t=void 0!==e?e:{}),t.ready=new Promise((function(e,t){r=e,o=t}));var i,a,s,u,l,c,p=Object.assign({},t),d="./this.program",f=(e,t)=>{throw t},h="object"==typeof window,g="function"==typeof importScripts,m="object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node,b="";m?(b=g?n(908).dirname(b)+"/":"//",c=()=>{l||(u=n(1384),l=n(908))},i=function(e,t){return c(),e=l.normalize(e),u.readFileSync(e,t?void 0:"utf8")},s=e=>((e=i(e,!0)).buffer||(e=new Uint8Array(e)),e),a=(e,t,n)=>{c(),e=l.normalize(e),u.readFile(e,(function(e,r){e?n(e):t(r.buffer)}))},1<process.argv.length&&(d=process.argv[1].replace(/\\/g,"/")),process.argv.slice(2),process.on("uncaughtException",(function(e){if(!(e instanceof q))throw e})),process.on("unhandledRejection",(function(e){throw e})),f=(e,t)=>{if(v)throw process.exitCode=e,t;t instanceof q||_("exiting due to exception: "+t),process.exit(e)},t.inspect=function(){return"[Emscripten Module object]"}):(h||g)&&(g?b=self.location.href:"undefined"!=typeof document&&document.currentScript&&(b=document.currentScript.src),_scriptDir&&(b=_scriptDir),b=0!==b.indexOf("blob:")?b.substr(0,b.replace(/[?#].*/,"").lastIndexOf("/")+1):"",i=e=>{var t=new XMLHttpRequest;return t.open("GET",e,!1),t.send(null),t.responseText},g&&(s=e=>{var t=new XMLHttpRequest;return t.open("GET",e,!1),t.responseType="arraybuffer",t.send(null),new Uint8Array(t.response)}),a=(e,t,n)=>{var r=new XMLHttpRequest;r.open("GET",e,!0),r.responseType="arraybuffer",r.onload=()=>{200==r.status||0==r.status&&r.response?t(r.response):n()},r.onerror=n,r.send(null)});var y,w=t.print||console.log.bind(console),_=t.printErr||console.warn.bind(console);Object.assign(t,p),p=null,t.thisProgram&&(d=t.thisProgram),t.quit&&(f=t.quit),t.wasmBinary&&(y=t.wasmBinary);var v=t.noExitRuntime||!0;"object"!=typeof WebAssembly&&V("no native wasm support detected");var x,T,S,O,A,E,I=!1,$="undefined"!=typeof TextDecoder?new TextDecoder("utf8"):void 0;function P(e,t,n){var r=(t>>>=0)+n;for(n=t;e[n]&&!(n>=r);)++n;if(16<n-t&&e.buffer&&$)return $.decode(e.subarray(t,n));for(r="";t<n;){var o=e[t++];if(128&o){var i=63&e[t++];if(192==(224&o))r+=String.fromCharCode((31&o)<<6|i);else{var a=63&e[t++];65536>(o=224==(240&o)?(15&o)<<12|i<<6|a:(7&o)<<18|i<<12|a<<6|63&e[t++])?r+=String.fromCharCode(o):(o-=65536,r+=String.fromCharCode(55296|o>>10,56320|1023&o))}}else r+=String.fromCharCode(o)}return r}function D(e,t){return(e>>>=0)?P(O,e,t):""}function k(e,t,n,r){if(!(0<r))return 0;var o=n>>>=0;r=n+r-1;for(var i=0;i<e.length;++i){var a=e.charCodeAt(i);if(55296<=a&&57343>=a&&(a=65536+((1023&a)<<10)|1023&e.charCodeAt(++i)),127>=a){if(n>=r)break;t[n++>>>0]=a}else{if(2047>=a){if(n+1>=r)break;t[n++>>>0]=192|a>>6}else{if(65535>=a){if(n+2>=r)break;t[n++>>>0]=224|a>>12}else{if(n+3>=r)break;t[n++>>>0]=240|a>>18,t[n++>>>0]=128|a>>12&63}t[n++>>>0]=128|a>>6&63}t[n++>>>0]=128|63&a}}return t[n>>>0]=0,n-o}function C(e){for(var t=0,n=0;n<e.length;++n){var r=e.charCodeAt(n);127>=r?t++:2047>=r?t+=2:55296<=r&&57343>=r?(t+=4,++n):t+=3}return t}function R(){var e=x.buffer;T=e,t.HEAP8=S=new Int8Array(e),t.HEAP16=new Int16Array(e),t.HEAP32=A=new Int32Array(e),t.HEAPU8=O=new Uint8Array(e),t.HEAPU16=new Uint16Array(e),t.HEAPU32=E=new Uint32Array(e),t.HEAPF32=new Float32Array(e),t.HEAPF64=new Float64Array(e)}var M=[],N=[],F=[];function L(){var e=t.preRun.shift();M.unshift(e)}var j,U=0,B=null,G=null;function V(e){throw t.onAbort&&t.onAbort(e),_(e="Aborted("+e+")"),I=!0,e=new WebAssembly.RuntimeError(e+". Build with -sASSERTIONS for more info."),o(e),e}function z(){return j.startsWith("data:application/octet-stream;base64,")}if(j="ort-wasm.wasm",!z()){var H=j;j=t.locateFile?t.locateFile(H,b):b+H}function W(){var e=j;try{if(e==j&&y)return new Uint8Array(y);if(s)return s(e);throw"both async and sync fetching of the wasm failed"}catch(e){V(e)}}function q(e){this.name="ExitStatus",this.message="Program terminated with exit("+e+")",this.status=e}function K(e){for(;0<e.length;)e.shift()(t)}function X(e){this.sa=e-24,this.Ia=function(e){E[this.sa+4>>2>>>0]=e},this.Ba=function(e){E[this.sa+8>>2>>>0]=e},this.Ga=function(){A[this.sa>>2>>>0]=0},this.Aa=function(){S[this.sa+12>>0>>>0]=0},this.Ha=function(){S[this.sa+13>>0>>>0]=0},this.ya=function(e,t){this.za(),this.Ia(e),this.Ba(t),this.Ga(),this.Aa(),this.Ha()},this.za=function(){E[this.sa+16>>2>>>0]=0}}function Y(e){var t=C(e)+1,n=ae(t);return n&&k(e,S,n,t),n}var J={};function Z(){if(!Q){var e,t={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:("object"==typeof navigator&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:d||"./this.program"};for(e in J)void 0===J[e]?delete t[e]:t[e]=J[e];var n=[];for(e in t)n.push(e+"="+t[e]);Q=n}return Q}var Q,ee=[null,[],[]];function te(e){return 0==e%4&&(0!=e%100||0==e%400)}var ne=[31,29,31,30,31,30,31,31,30,31,30,31],re=[31,28,31,30,31,30,31,31,30,31,30,31];function oe(e,t,n,r){function o(e,t,n){for(e="number"==typeof e?e.toString():e||"";e.length<t;)e=n[0]+e;return e}function i(e,t){return o(e,t,"0")}function a(e,t){function n(e){return 0>e?-1:0<e?1:0}var r;return 0===(r=n(e.getFullYear()-t.getFullYear()))&&0===(r=n(e.getMonth()-t.getMonth()))&&(r=n(e.getDate()-t.getDate())),r}function s(e){switch(e.getDay()){case 0:return new Date(e.getFullYear()-1,11,29);case 1:return e;case 2:return new Date(e.getFullYear(),0,3);case 3:return new Date(e.getFullYear(),0,2);case 4:return new Date(e.getFullYear(),0,1);case 5:return new Date(e.getFullYear()-1,11,31);case 6:return new Date(e.getFullYear()-1,11,30)}}function u(e){var t=e.qa;for(e=new Date(new Date(e.ra+1900,0,1).getTime());0<t;){var n=e.getMonth(),r=(te(e.getFullYear())?ne:re)[n];if(!(t>r-e.getDate())){e.setDate(e.getDate()+t);break}t-=r-e.getDate()+1,e.setDate(1),11>n?e.setMonth(n+1):(e.setMonth(0),e.setFullYear(e.getFullYear()+1))}return n=new Date(e.getFullYear()+1,0,4),t=s(new Date(e.getFullYear(),0,4)),n=s(n),0>=a(t,e)?0>=a(n,e)?e.getFullYear()+1:e.getFullYear():e.getFullYear()-1}var l=A[r+40>>2>>>0];for(var c in r={Ea:A[r>>2>>>0],Da:A[r+4>>2>>>0],ta:A[r+8>>2>>>0],va:A[r+12>>2>>>0],ua:A[r+16>>2>>>0],ra:A[r+20>>2>>>0],la:A[r+24>>2>>>0],qa:A[r+28>>2>>>0],Ja:A[r+32>>2>>>0],Ca:A[r+36>>2>>>0],Fa:l?D(l):""},n=D(n),l={"%c":"%a %b %d %H:%M:%S %Y","%D":"%m/%d/%y","%F":"%Y-%m-%d","%h":"%b","%r":"%I:%M:%S %p","%R":"%H:%M","%T":"%H:%M:%S","%x":"%m/%d/%y","%X":"%H:%M:%S","%Ec":"%c","%EC":"%C","%Ex":"%m/%d/%y","%EX":"%H:%M:%S","%Ey":"%y","%EY":"%Y","%Od":"%d","%Oe":"%e","%OH":"%H","%OI":"%I","%Om":"%m","%OM":"%M","%OS":"%S","%Ou":"%u","%OU":"%U","%OV":"%V","%Ow":"%w","%OW":"%W","%Oy":"%y"})n=n.replace(new RegExp(c,"g"),l[c]);var p="Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),d="January February March April May June July August September October November December".split(" ");for(c in l={"%a":function(e){return p[e.la].substring(0,3)},"%A":function(e){return p[e.la]},"%b":function(e){return d[e.ua].substring(0,3)},"%B":function(e){return d[e.ua]},"%C":function(e){return i((e.ra+1900)/100|0,2)},"%d":function(e){return i(e.va,2)},"%e":function(e){return o(e.va,2," ")},"%g":function(e){return u(e).toString().substring(2)},"%G":function(e){return u(e)},"%H":function(e){return i(e.ta,2)},"%I":function(e){return 0==(e=e.ta)?e=12:12<e&&(e-=12),i(e,2)},"%j":function(e){for(var t=0,n=0;n<=e.ua-1;t+=(te(e.ra+1900)?ne:re)[n++]);return i(e.va+t,3)},"%m":function(e){return i(e.ua+1,2)},"%M":function(e){return i(e.Da,2)},"%n":function(){return"\n"},"%p":function(e){return 0<=e.ta&&12>e.ta?"AM":"PM"},"%S":function(e){return i(e.Ea,2)},"%t":function(){return"\t"},"%u":function(e){return e.la||7},"%U":function(e){return i(Math.floor((e.qa+7-e.la)/7),2)},"%V":function(e){var t=Math.floor((e.qa+7-(e.la+6)%7)/7);if(2>=(e.la+371-e.qa-2)%7&&t++,t)53==t&&(4==(n=(e.la+371-e.qa)%7)||3==n&&te(e.ra)||(t=1));else{t=52;var n=(e.la+7-e.qa-1)%7;(4==n||5==n&&te(e.ra%400-1))&&t++}return i(t,2)},"%w":function(e){return e.la},"%W":function(e){return i(Math.floor((e.qa+7-(e.la+6)%7)/7),2)},"%y":function(e){return(e.ra+1900).toString().substring(2)},"%Y":function(e){return e.ra+1900},"%z":function(e){var t=0<=(e=e.Ca);return e=Math.abs(e)/60,(t?"+":"-")+String("0000"+(e/60*100+e%60)).slice(-4)},"%Z":function(e){return e.Fa},"%%":function(){return"%"}},n=n.replace(/%%/g,"\0\0"),l)n.includes(c)&&(n=n.replace(new RegExp(c,"g"),l[c](r)));return c=function(e){var t=Array(C(e)+1);return k(e,t,0,t.length),t}(n=n.replace(/\0\0/g,"%")),c.length>t?0:(S.set(c,e>>>0),c.length-1)}var ie={a:function(e){return ae(e+24)+24},b:function(e,t,n){throw new X(e).ya(t,n),e},g:function(){return 0},I:function(){},w:function(){},y:function(){},K:function(){return 0},G:function(){},C:function(){},F:function(){},k:function(){},x:function(){},u:function(){},H:function(){},v:function(){},n:function(){},p:function(){V("To use dlopen, you need enable dynamic linking, see https://github.com/emscripten-core/emscripten/wiki/Linking")},o:function(){V("To use dlopen, you need enable dynamic linking, see https://github.com/emscripten-core/emscripten/wiki/Linking")},l:function(){return Date.now()},L:function(){return!0},M:function(e,t){e=new Date(1e3*(E[e>>>2]+4294967296*A[e+4>>>2])),A[t>>2>>>0]=e.getUTCSeconds(),A[t+4>>2>>>0]=e.getUTCMinutes(),A[t+8>>2>>>0]=e.getUTCHours(),A[t+12>>2>>>0]=e.getUTCDate(),A[t+16>>2>>>0]=e.getUTCMonth(),A[t+20>>2>>>0]=e.getUTCFullYear()-1900,A[t+24>>2>>>0]=e.getUTCDay(),A[t+28>>2>>>0]=(e.getTime()-Date.UTC(e.getUTCFullYear(),0,1,0,0,0,0))/864e5|0},N:function(e,t){e=new Date(1e3*(E[e>>>2]+4294967296*A[e+4>>>2])),A[t>>2>>>0]=e.getSeconds(),A[t+4>>2>>>0]=e.getMinutes(),A[t+8>>2>>>0]=e.getHours(),A[t+12>>2>>>0]=e.getDate(),A[t+16>>2>>>0]=e.getMonth(),A[t+20>>2>>>0]=e.getFullYear()-1900,A[t+24>>2>>>0]=e.getDay();var n=new Date(e.getFullYear(),0,1);A[t+28>>2>>>0]=(e.getTime()-n.getTime())/864e5|0,A[t+36>>2>>>0]=-60*e.getTimezoneOffset();var r=new Date(e.getFullYear(),6,1).getTimezoneOffset();n=n.getTimezoneOffset(),A[t+32>>2>>>0]=0|(r!=n&&e.getTimezoneOffset()==Math.min(n,r))},O:function(e){var t=new Date(A[e+20>>2>>>0]+1900,A[e+16>>2>>>0],A[e+12>>2>>>0],A[e+8>>2>>>0],A[e+4>>2>>>0],A[e>>2>>>0],0),n=A[e+32>>2>>>0],r=t.getTimezoneOffset(),o=new Date(t.getFullYear(),0,1),i=new Date(t.getFullYear(),6,1).getTimezoneOffset(),a=o.getTimezoneOffset(),s=Math.min(a,i);return 0>n?A[e+32>>2>>>0]=Number(i!=a&&s==r):0<n!=(s==r)&&(i=Math.max(a,i),t.setTime(t.getTime()+6e4*((0<n?s:i)-r))),A[e+24>>2>>>0]=t.getDay(),A[e+28>>2>>>0]=(t.getTime()-o.getTime())/864e5|0,A[e>>2>>>0]=t.getSeconds(),A[e+4>>2>>>0]=t.getMinutes(),A[e+8>>2>>>0]=t.getHours(),A[e+12>>2>>>0]=t.getDate(),A[e+16>>2>>>0]=t.getMonth(),t.getTime()/1e3|0},z:function(){return-52},B:function(){},m:function e(t,n,r){e.xa||(e.xa=!0,function(e,t,n){function r(e){return(e=e.toTimeString().match(/\(([A-Za-z ]+)\)$/))?e[1]:"GMT"}var o=(new Date).getFullYear(),i=new Date(o,0,1),a=new Date(o,6,1);o=i.getTimezoneOffset();var s=a.getTimezoneOffset();A[e>>2>>>0]=60*Math.max(o,s),A[t>>2>>>0]=Number(o!=s),e=r(i),t=r(a),e=Y(e),t=Y(t),s<o?(E[n>>2>>>0]=e,E[n+4>>2>>>0]=t):(E[n>>2>>>0]=t,E[n+4>>2>>>0]=e)}(t,n,r))},d:function(){V("")},t:function(){return 4294901760},h:m?()=>{var e=process.hrtime();return 1e3*e[0]+e[1]/1e6}:()=>performance.now(),J:function(e,t,n){O.copyWithin(e>>>0,t>>>0,t+n>>>0)},f:function(e){var t=O.length;if(4294901760<(e>>>=0))return!1;for(var n=1;4>=n;n*=2){var r=t*(1+.2/n);r=Math.min(r,e+100663296);var o=Math;r=Math.max(e,r),o=o.min.call(o,4294901760,r+(65536-r%65536)%65536);e:{try{x.grow(o-T.byteLength+65535>>>16),R();var i=1;break e}catch(e){}i=void 0}if(i)return!0}return!1},D:function(e,t){var n=0;return Z().forEach((function(r,o){var i=t+n;for(o=E[e+4*o>>2>>>0]=i,i=0;i<r.length;++i)S[o++>>0>>>0]=r.charCodeAt(i);S[o>>0>>>0]=0,n+=r.length+1})),0},E:function(e,t){var n=Z();E[e>>2>>>0]=n.length;var r=0;return n.forEach((function(e){r+=e.length+1})),E[t>>2>>>0]=r,0},r:function(e){v||(t.onExit&&t.onExit(e),I=!0),f(e,new q(e))},e:function(){return 52},j:function(){return 52},q:function(){return 70},i:function(e,t,n,r){for(var o=0,i=0;i<n;i++){var a=E[t>>2>>>0],s=E[t+4>>2>>>0];t+=8;for(var u=0;u<s;u++){var l=O[a+u>>>0],c=ee[e];0===l||10===l?((1===e?w:_)(P(c,0)),c.length=0):c.push(l)}o+=s}return E[r>>2>>>0]=o,0},s:function e(t,r){e.wa||(e.wa=function(){if("object"==typeof crypto&&"function"==typeof crypto.getRandomValues){var e=new Uint8Array(1);return()=>(crypto.getRandomValues(e),e[0])}if(m)try{var t=n(760);return()=>t.randomBytes(1)[0]}catch(e){}return()=>V("randomDevice")}());for(var o=0;o<r;o++)S[t+o>>0>>>0]=e.wa();return 0},A:oe,c:function(e,t,n,r){return oe(e,t,n,r)}};!function(){function e(e){t.asm=e.exports,x=t.asm.P,R(),N.unshift(t.asm.Q),U--,t.monitorRunDependencies&&t.monitorRunDependencies(U),0==U&&(null!==B&&(clearInterval(B),B=null),G&&(e=G,G=null,e()))}function n(t){e(t.instance)}function r(e){return function(){if(!y&&(h||g)){if("function"==typeof fetch&&!j.startsWith("file://"))return fetch(j,{credentials:"same-origin"}).then((function(e){if(!e.ok)throw"failed to load wasm binary file at '"+j+"'";return e.arrayBuffer()})).catch((function(){return W()}));if(a)return new Promise((function(e,t){a(j,(function(t){e(new Uint8Array(t))}),t)}))}return Promise.resolve().then((function(){return W()}))}().then((function(e){return WebAssembly.instantiate(e,i)})).then((function(e){return e})).then(e,(function(e){_("failed to asynchronously prepare wasm: "+e),V(e)}))}var i={a:ie};if(U++,t.monitorRunDependencies&&t.monitorRunDependencies(U),t.instantiateWasm)try{return t.instantiateWasm(i,e)}catch(e){return _("Module.instantiateWasm callback failed with error: "+e),!1}(y||"function"!=typeof WebAssembly.instantiateStreaming||z()||j.startsWith("file://")||m||"function"!=typeof fetch?r(n):fetch(j,{credentials:"same-origin"}).then((function(e){return WebAssembly.instantiateStreaming(e,i).then(n,(function(e){return _("wasm streaming compile failed: "+e),_("falling back to ArrayBuffer instantiation"),r(n)}))}))).catch(o)}(),t.___wasm_call_ctors=function(){return(t.___wasm_call_ctors=t.asm.Q).apply(null,arguments)},t._OrtInit=function(){return(t._OrtInit=t.asm.R).apply(null,arguments)},t._OrtCreateSessionOptions=function(){return(t._OrtCreateSessionOptions=t.asm.S).apply(null,arguments)},t._OrtAppendExecutionProvider=function(){return(t._OrtAppendExecutionProvider=t.asm.T).apply(null,arguments)},t._OrtAddSessionConfigEntry=function(){return(t._OrtAddSessionConfigEntry=t.asm.U).apply(null,arguments)},t._OrtReleaseSessionOptions=function(){return(t._OrtReleaseSessionOptions=t.asm.V).apply(null,arguments)},t._OrtCreateSession=function(){return(t._OrtCreateSession=t.asm.W).apply(null,arguments)},t._OrtReleaseSession=function(){return(t._OrtReleaseSession=t.asm.X).apply(null,arguments)},t._OrtGetInputCount=function(){return(t._OrtGetInputCount=t.asm.Y).apply(null,arguments)},t._OrtGetOutputCount=function(){return(t._OrtGetOutputCount=t.asm.Z).apply(null,arguments)},t._OrtGetInputName=function(){return(t._OrtGetInputName=t.asm._).apply(null,arguments)},t._OrtGetOutputName=function(){return(t._OrtGetOutputName=t.asm.$).apply(null,arguments)},t._OrtFree=function(){return(t._OrtFree=t.asm.aa).apply(null,arguments)},t._OrtCreateTensor=function(){return(t._OrtCreateTensor=t.asm.ba).apply(null,arguments)},t._OrtGetTensorData=function(){return(t._OrtGetTensorData=t.asm.ca).apply(null,arguments)},t._OrtReleaseTensor=function(){return(t._OrtReleaseTensor=t.asm.da).apply(null,arguments)},t._OrtCreateRunOptions=function(){return(t._OrtCreateRunOptions=t.asm.ea).apply(null,arguments)},t._OrtAddRunConfigEntry=function(){return(t._OrtAddRunConfigEntry=t.asm.fa).apply(null,arguments)},t._OrtReleaseRunOptions=function(){return(t._OrtReleaseRunOptions=t.asm.ga).apply(null,arguments)},t._OrtRun=function(){return(t._OrtRun=t.asm.ha).apply(null,arguments)},t._OrtEndProfiling=function(){return(t._OrtEndProfiling=t.asm.ia).apply(null,arguments)};var ae=t._malloc=function(){return(ae=t._malloc=t.asm.ja).apply(null,arguments)};t._free=function(){return(t._free=t.asm.ka).apply(null,arguments)};var se,ue=t.stackSave=function(){return(ue=t.stackSave=t.asm.ma).apply(null,arguments)},le=t.stackRestore=function(){return(le=t.stackRestore=t.asm.na).apply(null,arguments)},ce=t.stackAlloc=function(){return(ce=t.stackAlloc=t.asm.oa).apply(null,arguments)};function pe(){function e(){if(!se&&(se=!0,t.calledRun=!0,!I)){if(K(N),r(t),t.onRuntimeInitialized&&t.onRuntimeInitialized(),t.postRun)for("function"==typeof t.postRun&&(t.postRun=[t.postRun]);t.postRun.length;){var e=t.postRun.shift();F.unshift(e)}K(F)}}if(!(0<U)){if(t.preRun)for("function"==typeof t.preRun&&(t.preRun=[t.preRun]);t.preRun.length;)L();K(M),0<U||(t.setStatus?(t.setStatus("Running..."),setTimeout((function(){setTimeout((function(){t.setStatus("")}),1),e()}),1)):e())}}if(t.___cxa_is_pointer_type=function(){return(t.___cxa_is_pointer_type=t.asm.pa).apply(null,arguments)},t.UTF8ToString=D,t.stringToUTF8=function(e,t,n){return k(e,O,t,n)},t.lengthBytesUTF8=C,t.stackSave=ue,t.stackRestore=le,t.stackAlloc=ce,G=function e(){se||pe(),se||(G=e)},t.preInit)for("function"==typeof t.preInit&&(t.preInit=[t.preInit]);0<t.preInit.length;)t.preInit.pop()();return pe(),e.ready});e.exports=r},4537:e=>{"use strict";e.exports=function(e,t){for(var n=new Array(arguments.length-1),r=0,o=2,i=!0;o<arguments.length;)n[r++]=arguments[o++];return new Promise((function(o,a){n[r]=function(e){if(i)if(i=!1,e)a(e);else{for(var t=new Array(arguments.length-1),n=0;n<t.length;)t[n++]=arguments[n];o.apply(null,t)}};try{e.apply(t||null,n)}catch(e){i&&(i=!1,a(e))}}))}},7419:(e,t)=>{"use strict";var n=t;n.length=function(e){var t=e.length;if(!t)return 0;for(var n=0;--t%4>1&&"="===e.charAt(t);)++n;return Math.ceil(3*e.length)/4-n};for(var r=new Array(64),o=new Array(123),i=0;i<64;)o[r[i]=i<26?i+65:i<52?i+71:i<62?i-4:i-59|43]=i++;n.encode=function(e,t,n){for(var o,i=null,a=[],s=0,u=0;t<n;){var l=e[t++];switch(u){case 0:a[s++]=r[l>>2],o=(3&l)<<4,u=1;break;case 1:a[s++]=r[o|l>>4],o=(15&l)<<2,u=2;break;case 2:a[s++]=r[o|l>>6],a[s++]=r[63&l],u=0}s>8191&&((i||(i=[])).push(String.fromCharCode.apply(String,a)),s=0)}return u&&(a[s++]=r[o],a[s++]=61,1===u&&(a[s++]=61)),i?(s&&i.push(String.fromCharCode.apply(String,a.slice(0,s))),i.join("")):String.fromCharCode.apply(String,a.slice(0,s))};var a="invalid encoding";n.decode=function(e,t,n){for(var r,i=n,s=0,u=0;u<e.length;){var l=e.charCodeAt(u++);if(61===l&&s>1)break;if(void 0===(l=o[l]))throw Error(a);switch(s){case 0:r=l,s=1;break;case 1:t[n++]=r<<2|(48&l)>>4,r=l,s=2;break;case 2:t[n++]=(15&r)<<4|(60&l)>>2,r=l,s=3;break;case 3:t[n++]=(3&r)<<6|l,s=0}}if(1===s)throw Error(a);return n-i},n.test=function(e){return/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(e)}},9211:e=>{"use strict";function t(){this._listeners={}}e.exports=t,t.prototype.on=function(e,t,n){return(this._listeners[e]||(this._listeners[e]=[])).push({fn:t,ctx:n||this}),this},t.prototype.off=function(e,t){if(void 0===e)this._listeners={};else if(void 0===t)this._listeners[e]=[];else for(var n=this._listeners[e],r=0;r<n.length;)n[r].fn===t?n.splice(r,1):++r;return this},t.prototype.emit=function(e){var t=this._listeners[e];if(t){for(var n=[],r=1;r<arguments.length;)n.push(arguments[r++]);for(r=0;r<t.length;)t[r].fn.apply(t[r++].ctx,n)}return this}},945:e=>{"use strict";function t(e){return"undefined"!=typeof Float32Array?function(){var t=new Float32Array([-0]),n=new Uint8Array(t.buffer),r=128===n[3];function o(e,r,o){t[0]=e,r[o]=n[0],r[o+1]=n[1],r[o+2]=n[2],r[o+3]=n[3]}function i(e,r,o){t[0]=e,r[o]=n[3],r[o+1]=n[2],r[o+2]=n[1],r[o+3]=n[0]}function a(e,r){return n[0]=e[r],n[1]=e[r+1],n[2]=e[r+2],n[3]=e[r+3],t[0]}function s(e,r){return n[3]=e[r],n[2]=e[r+1],n[1]=e[r+2],n[0]=e[r+3],t[0]}e.writeFloatLE=r?o:i,e.writeFloatBE=r?i:o,e.readFloatLE=r?a:s,e.readFloatBE=r?s:a}():function(){function t(e,t,n,r){var o=t<0?1:0;if(o&&(t=-t),0===t)e(1/t>0?0:2147483648,n,r);else if(isNaN(t))e(2143289344,n,r);else if(t>34028234663852886e22)e((o<<31|2139095040)>>>0,n,r);else if(t<11754943508222875e-54)e((o<<31|Math.round(t/1401298464324817e-60))>>>0,n,r);else{var i=Math.floor(Math.log(t)/Math.LN2);e((o<<31|i+127<<23|8388607&Math.round(t*Math.pow(2,-i)*8388608))>>>0,n,r)}}function a(e,t,n){var r=e(t,n),o=2*(r>>31)+1,i=r>>>23&255,a=8388607&r;return 255===i?a?NaN:o*(1/0):0===i?1401298464324817e-60*o*a:o*Math.pow(2,i-150)*(a+8388608)}e.writeFloatLE=t.bind(null,n),e.writeFloatBE=t.bind(null,r),e.readFloatLE=a.bind(null,o),e.readFloatBE=a.bind(null,i)}(),"undefined"!=typeof Float64Array?function(){var t=new Float64Array([-0]),n=new Uint8Array(t.buffer),r=128===n[7];function o(e,r,o){t[0]=e,r[o]=n[0],r[o+1]=n[1],r[o+2]=n[2],r[o+3]=n[3],r[o+4]=n[4],r[o+5]=n[5],r[o+6]=n[6],r[o+7]=n[7]}function i(e,r,o){t[0]=e,r[o]=n[7],r[o+1]=n[6],r[o+2]=n[5],r[o+3]=n[4],r[o+4]=n[3],r[o+5]=n[2],r[o+6]=n[1],r[o+7]=n[0]}function a(e,r){return n[0]=e[r],n[1]=e[r+1],n[2]=e[r+2],n[3]=e[r+3],n[4]=e[r+4],n[5]=e[r+5],n[6]=e[r+6],n[7]=e[r+7],t[0]}function s(e,r){return n[7]=e[r],n[6]=e[r+1],n[5]=e[r+2],n[4]=e[r+3],n[3]=e[r+4],n[2]=e[r+5],n[1]=e[r+6],n[0]=e[r+7],t[0]}e.writeDoubleLE=r?o:i,e.writeDoubleBE=r?i:o,e.readDoubleLE=r?a:s,e.readDoubleBE=r?s:a}():function(){function t(e,t,n,r,o,i){var a=r<0?1:0;if(a&&(r=-r),0===r)e(0,o,i+t),e(1/r>0?0:2147483648,o,i+n);else if(isNaN(r))e(0,o,i+t),e(2146959360,o,i+n);else if(r>17976931348623157e292)e(0,o,i+t),e((a<<31|2146435072)>>>0,o,i+n);else{var s;if(r<22250738585072014e-324)e((s=r/5e-324)>>>0,o,i+t),e((a<<31|s/4294967296)>>>0,o,i+n);else{var u=Math.floor(Math.log(r)/Math.LN2);1024===u&&(u=1023),e(4503599627370496*(s=r*Math.pow(2,-u))>>>0,o,i+t),e((a<<31|u+1023<<20|1048576*s&1048575)>>>0,o,i+n)}}}function a(e,t,n,r,o){var i=e(r,o+t),a=e(r,o+n),s=2*(a>>31)+1,u=a>>>20&2047,l=4294967296*(1048575&a)+i;return 2047===u?l?NaN:s*(1/0):0===u?5e-324*s*l:s*Math.pow(2,u-1075)*(l+4503599627370496)}e.writeDoubleLE=t.bind(null,n,0,4),e.writeDoubleBE=t.bind(null,r,4,0),e.readDoubleLE=a.bind(null,o,0,4),e.readDoubleBE=a.bind(null,i,4,0)}(),e}function n(e,t,n){t[n]=255&e,t[n+1]=e>>>8&255,t[n+2]=e>>>16&255,t[n+3]=e>>>24}function r(e,t,n){t[n]=e>>>24,t[n+1]=e>>>16&255,t[n+2]=e>>>8&255,t[n+3]=255&e}function o(e,t){return(e[t]|e[t+1]<<8|e[t+2]<<16|e[t+3]<<24)>>>0}function i(e,t){return(e[t]<<24|e[t+1]<<16|e[t+2]<<8|e[t+3])>>>0}e.exports=t(t)},7199:module=>{"use strict";function inquire(moduleName){try{var mod=eval("quire".replace(/^/,"re"))(moduleName);if(mod&&(mod.length||Object.keys(mod).length))return mod}catch(e){}return null}module.exports=inquire},6662:e=>{"use strict";e.exports=function(e,t,n){var r=n||8192,o=r>>>1,i=null,a=r;return function(n){if(n<1||n>o)return e(n);a+n>r&&(i=e(r),a=0);var s=t.call(i,a,a+=n);return 7&a&&(a=1+(7|a)),s}}},4997:(e,t)=>{"use strict";var n=t;n.length=function(e){for(var t=0,n=0,r=0;r<e.length;++r)(n=e.charCodeAt(r))<128?t+=1:n<2048?t+=2:55296==(64512&n)&&56320==(64512&e.charCodeAt(r+1))?(++r,t+=4):t+=3;return t},n.read=function(e,t,n){if(n-t<1)return"";for(var r,o=null,i=[],a=0;t<n;)(r=e[t++])<128?i[a++]=r:r>191&&r<224?i[a++]=(31&r)<<6|63&e[t++]:r>239&&r<365?(r=((7&r)<<18|(63&e[t++])<<12|(63&e[t++])<<6|63&e[t++])-65536,i[a++]=55296+(r>>10),i[a++]=56320+(1023&r)):i[a++]=(15&r)<<12|(63&e[t++])<<6|63&e[t++],a>8191&&((o||(o=[])).push(String.fromCharCode.apply(String,i)),a=0);return o?(a&&o.push(String.fromCharCode.apply(String,i.slice(0,a))),o.join("")):String.fromCharCode.apply(String,i.slice(0,a))},n.write=function(e,t,n){for(var r,o,i=n,a=0;a<e.length;++a)(r=e.charCodeAt(a))<128?t[n++]=r:r<2048?(t[n++]=r>>6|192,t[n++]=63&r|128):55296==(64512&r)&&56320==(64512&(o=e.charCodeAt(a+1)))?(r=65536+((1023&r)<<10)+(1023&o),++a,t[n++]=r>>18|240,t[n++]=r>>12&63|128,t[n++]=r>>6&63|128,t[n++]=63&r|128):(t[n++]=r>>12|224,t[n++]=r>>6&63|128,t[n++]=63&r|128);return n-i}},3442:(e,t)=>{"use strict";t.__esModule=!0;var n=function(){function e(t){if(!t)throw new TypeError("Invalid argument; `value` has no value.");this.value=e.EMPTY,t&&e.isGuid(t)&&(this.value=t)}return e.isGuid=function(t){var n=t.toString();return t&&(t instanceof e||e.validator.test(n))},e.create=function(){return new e([e.gen(2),e.gen(1),e.gen(1),e.gen(1),e.gen(3)].join("-"))},e.createEmpty=function(){return new e("emptyguid")},e.parse=function(t){return new e(t)},e.raw=function(){return[e.gen(2),e.gen(1),e.gen(1),e.gen(1),e.gen(3)].join("-")},e.gen=function(e){for(var t="",n=0;n<e;n++)t+=(65536*(1+Math.random())|0).toString(16).substring(1);return t},e.prototype.equals=function(t){return e.isGuid(t)&&this.value===t.toString()},e.prototype.isEmpty=function(){return this.value===e.EMPTY},e.prototype.toString=function(){return this.value},e.prototype.toJSON=function(){return{value:this.value}},e.validator=new RegExp("^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$","i"),e.EMPTY="00000000-0000-0000-0000-000000000000",e}();t.Guid=n},3720:e=>{e.exports=n;var t=null;try{t=new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0,97,115,109,1,0,0,0,1,13,2,96,0,1,127,96,4,127,127,127,127,1,127,3,7,6,0,1,1,1,1,1,6,6,1,127,1,65,0,11,7,50,6,3,109,117,108,0,1,5,100,105,118,95,115,0,2,5,100,105,118,95,117,0,3,5,114,101,109,95,115,0,4,5,114,101,109,95,117,0,5,8,103,101,116,95,104,105,103,104,0,0,10,191,1,6,4,0,35,0,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,126,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,127,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,128,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,129,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,130,34,4,66,32,135,167,36,0,32,4,167,11])),{}).exports}catch(e){}function n(e,t,n){this.low=0|e,this.high=0|t,this.unsigned=!!n}function r(e){return!0===(e&&e.__isLong__)}n.prototype.__isLong__,Object.defineProperty(n.prototype,"__isLong__",{value:!0}),n.isLong=r;var o={},i={};function a(e,t){var n,r,a;return t?(a=0<=(e>>>=0)&&e<256)&&(r=i[e])?r:(n=u(e,(0|e)<0?-1:0,!0),a&&(i[e]=n),n):(a=-128<=(e|=0)&&e<128)&&(r=o[e])?r:(n=u(e,e<0?-1:0,!1),a&&(o[e]=n),n)}function s(e,t){if(isNaN(e))return t?b:m;if(t){if(e<0)return b;if(e>=f)return x}else{if(e<=-h)return T;if(e+1>=h)return v}return e<0?s(-e,t).neg():u(e%d|0,e/d|0,t)}function u(e,t,r){return new n(e,t,r)}n.fromInt=a,n.fromNumber=s,n.fromBits=u;var l=Math.pow;function c(e,t,n){if(0===e.length)throw Error("empty string");if("NaN"===e||"Infinity"===e||"+Infinity"===e||"-Infinity"===e)return m;if("number"==typeof t?(n=t,t=!1):t=!!t,(n=n||10)<2||36<n)throw RangeError("radix");var r;if((r=e.indexOf("-"))>0)throw Error("interior hyphen");if(0===r)return c(e.substring(1),t,n).neg();for(var o=s(l(n,8)),i=m,a=0;a<e.length;a+=8){var u=Math.min(8,e.length-a),p=parseInt(e.substring(a,a+u),n);if(u<8){var d=s(l(n,u));i=i.mul(d).add(s(p))}else i=(i=i.mul(o)).add(s(p))}return i.unsigned=t,i}function p(e,t){return"number"==typeof e?s(e,t):"string"==typeof e?c(e,t):u(e.low,e.high,"boolean"==typeof t?t:e.unsigned)}n.fromString=c,n.fromValue=p;var d=4294967296,f=d*d,h=f/2,g=a(1<<24),m=a(0);n.ZERO=m;var b=a(0,!0);n.UZERO=b;var y=a(1);n.ONE=y;var w=a(1,!0);n.UONE=w;var _=a(-1);n.NEG_ONE=_;var v=u(-1,2147483647,!1);n.MAX_VALUE=v;var x=u(-1,-1,!0);n.MAX_UNSIGNED_VALUE=x;var T=u(0,-2147483648,!1);n.MIN_VALUE=T;var S=n.prototype;S.toInt=function(){return this.unsigned?this.low>>>0:this.low},S.toNumber=function(){return this.unsigned?(this.high>>>0)*d+(this.low>>>0):this.high*d+(this.low>>>0)},S.toString=function(e){if((e=e||10)<2||36<e)throw RangeError("radix");if(this.isZero())return"0";if(this.isNegative()){if(this.eq(T)){var t=s(e),n=this.div(t),r=n.mul(t).sub(this);return n.toString(e)+r.toInt().toString(e)}return"-"+this.neg().toString(e)}for(var o=s(l(e,6),this.unsigned),i=this,a="";;){var u=i.div(o),c=(i.sub(u.mul(o)).toInt()>>>0).toString(e);if((i=u).isZero())return c+a;for(;c.length<6;)c="0"+c;a=""+c+a}},S.getHighBits=function(){return this.high},S.getHighBitsUnsigned=function(){return this.high>>>0},S.getLowBits=function(){return this.low},S.getLowBitsUnsigned=function(){return this.low>>>0},S.getNumBitsAbs=function(){if(this.isNegative())return this.eq(T)?64:this.neg().getNumBitsAbs();for(var e=0!=this.high?this.high:this.low,t=31;t>0&&0==(e&1<<t);t--);return 0!=this.high?t+33:t+1},S.isZero=function(){return 0===this.high&&0===this.low},S.eqz=S.isZero,S.isNegative=function(){return!this.unsigned&&this.high<0},S.isPositive=function(){return this.unsigned||this.high>=0},S.isOdd=function(){return 1==(1&this.low)},S.isEven=function(){return 0==(1&this.low)},S.equals=function(e){return r(e)||(e=p(e)),(this.unsigned===e.unsigned||this.high>>>31!=1||e.high>>>31!=1)&&this.high===e.high&&this.low===e.low},S.eq=S.equals,S.notEquals=function(e){return!this.eq(e)},S.neq=S.notEquals,S.ne=S.notEquals,S.lessThan=function(e){return this.comp(e)<0},S.lt=S.lessThan,S.lessThanOrEqual=function(e){return this.comp(e)<=0},S.lte=S.lessThanOrEqual,S.le=S.lessThanOrEqual,S.greaterThan=function(e){return this.comp(e)>0},S.gt=S.greaterThan,S.greaterThanOrEqual=function(e){return this.comp(e)>=0},S.gte=S.greaterThanOrEqual,S.ge=S.greaterThanOrEqual,S.compare=function(e){if(r(e)||(e=p(e)),this.eq(e))return 0;var t=this.isNegative(),n=e.isNegative();return t&&!n?-1:!t&&n?1:this.unsigned?e.high>>>0>this.high>>>0||e.high===this.high&&e.low>>>0>this.low>>>0?-1:1:this.sub(e).isNegative()?-1:1},S.comp=S.compare,S.negate=function(){return!this.unsigned&&this.eq(T)?T:this.not().add(y)},S.neg=S.negate,S.add=function(e){r(e)||(e=p(e));var t=this.high>>>16,n=65535&this.high,o=this.low>>>16,i=65535&this.low,a=e.high>>>16,s=65535&e.high,l=e.low>>>16,c=0,d=0,f=0,h=0;return f+=(h+=i+(65535&e.low))>>>16,d+=(f+=o+l)>>>16,c+=(d+=n+s)>>>16,c+=t+a,u((f&=65535)<<16|(h&=65535),(c&=65535)<<16|(d&=65535),this.unsigned)},S.subtract=function(e){return r(e)||(e=p(e)),this.add(e.neg())},S.sub=S.subtract,S.multiply=function(e){if(this.isZero())return m;if(r(e)||(e=p(e)),t)return u(t.mul(this.low,this.high,e.low,e.high),t.get_high(),this.unsigned);if(e.isZero())return m;if(this.eq(T))return e.isOdd()?T:m;if(e.eq(T))return this.isOdd()?T:m;if(this.isNegative())return e.isNegative()?this.neg().mul(e.neg()):this.neg().mul(e).neg();if(e.isNegative())return this.mul(e.neg()).neg();if(this.lt(g)&&e.lt(g))return s(this.toNumber()*e.toNumber(),this.unsigned);var n=this.high>>>16,o=65535&this.high,i=this.low>>>16,a=65535&this.low,l=e.high>>>16,c=65535&e.high,d=e.low>>>16,f=65535&e.low,h=0,b=0,y=0,w=0;return y+=(w+=a*f)>>>16,b+=(y+=i*f)>>>16,y&=65535,b+=(y+=a*d)>>>16,h+=(b+=o*f)>>>16,b&=65535,h+=(b+=i*d)>>>16,b&=65535,h+=(b+=a*c)>>>16,h+=n*f+o*d+i*c+a*l,u((y&=65535)<<16|(w&=65535),(h&=65535)<<16|(b&=65535),this.unsigned)},S.mul=S.multiply,S.divide=function(e){if(r(e)||(e=p(e)),e.isZero())throw Error("division by zero");var n,o,i;if(t)return this.unsigned||-2147483648!==this.high||-1!==e.low||-1!==e.high?u((this.unsigned?t.div_u:t.div_s)(this.low,this.high,e.low,e.high),t.get_high(),this.unsigned):this;if(this.isZero())return this.unsigned?b:m;if(this.unsigned){if(e.unsigned||(e=e.toUnsigned()),e.gt(this))return b;if(e.gt(this.shru(1)))return w;i=b}else{if(this.eq(T))return e.eq(y)||e.eq(_)?T:e.eq(T)?y:(n=this.shr(1).div(e).shl(1)).eq(m)?e.isNegative()?y:_:(o=this.sub(e.mul(n)),i=n.add(o.div(e)));if(e.eq(T))return this.unsigned?b:m;if(this.isNegative())return e.isNegative()?this.neg().div(e.neg()):this.neg().div(e).neg();if(e.isNegative())return this.div(e.neg()).neg();i=m}for(o=this;o.gte(e);){n=Math.max(1,Math.floor(o.toNumber()/e.toNumber()));for(var a=Math.ceil(Math.log(n)/Math.LN2),c=a<=48?1:l(2,a-48),d=s(n),f=d.mul(e);f.isNegative()||f.gt(o);)f=(d=s(n-=c,this.unsigned)).mul(e);d.isZero()&&(d=y),i=i.add(d),o=o.sub(f)}return i},S.div=S.divide,S.modulo=function(e){return r(e)||(e=p(e)),t?u((this.unsigned?t.rem_u:t.rem_s)(this.low,this.high,e.low,e.high),t.get_high(),this.unsigned):this.sub(this.div(e).mul(e))},S.mod=S.modulo,S.rem=S.modulo,S.not=function(){return u(~this.low,~this.high,this.unsigned)},S.and=function(e){return r(e)||(e=p(e)),u(this.low&e.low,this.high&e.high,this.unsigned)},S.or=function(e){return r(e)||(e=p(e)),u(this.low|e.low,this.high|e.high,this.unsigned)},S.xor=function(e){return r(e)||(e=p(e)),u(this.low^e.low,this.high^e.high,this.unsigned)},S.shiftLeft=function(e){return r(e)&&(e=e.toInt()),0==(e&=63)?this:e<32?u(this.low<<e,this.high<<e|this.low>>>32-e,this.unsigned):u(0,this.low<<e-32,this.unsigned)},S.shl=S.shiftLeft,S.shiftRight=function(e){return r(e)&&(e=e.toInt()),0==(e&=63)?this:e<32?u(this.low>>>e|this.high<<32-e,this.high>>e,this.unsigned):u(this.high>>e-32,this.high>=0?0:-1,this.unsigned)},S.shr=S.shiftRight,S.shiftRightUnsigned=function(e){if(r(e)&&(e=e.toInt()),0==(e&=63))return this;var t=this.high;return e<32?u(this.low>>>e|t<<32-e,t>>>e,this.unsigned):u(32===e?t:t>>>e-32,0,this.unsigned)},S.shru=S.shiftRightUnsigned,S.shr_u=S.shiftRightUnsigned,S.toSigned=function(){return this.unsigned?u(this.low,this.high,!1):this},S.toUnsigned=function(){return this.unsigned?this:u(this.low,this.high,!0)},S.toBytes=function(e){return e?this.toBytesLE():this.toBytesBE()},S.toBytesLE=function(){var e=this.high,t=this.low;return[255&t,t>>>8&255,t>>>16&255,t>>>24,255&e,e>>>8&255,e>>>16&255,e>>>24]},S.toBytesBE=function(){var e=this.high,t=this.low;return[e>>>24,e>>>16&255,e>>>8&255,255&e,t>>>24,t>>>16&255,t>>>8&255,255&t]},n.fromBytes=function(e,t,r){return r?n.fromBytesLE(e,t):n.fromBytesBE(e,t)},n.fromBytesLE=function(e,t){return new n(e[0]|e[1]<<8|e[2]<<16|e[3]<<24,e[4]|e[5]<<8|e[6]<<16|e[7]<<24,t)},n.fromBytesBE=function(e,t){return new n(e[4]<<24|e[5]<<16|e[6]<<8|e[7],e[0]<<24|e[1]<<16|e[2]<<8|e[3],t)}},1446:(e,t,n)=>{"use strict";var r,o,i,a=n(2100),s=a.Reader,u=a.Writer,l=a.util,c=a.roots.default||(a.roots.default={});c.onnx=((i={}).Version=(r={},(o=Object.create(r))[r[0]="_START_VERSION"]=0,o[r[1]="IR_VERSION_2017_10_10"]=1,o[r[2]="IR_VERSION_2017_10_30"]=2,o[r[3]="IR_VERSION_2017_11_3"]=3,o[r[4]="IR_VERSION_2019_1_22"]=4,o[r[5]="IR_VERSION"]=5,o),i.AttributeProto=function(){function e(e){if(this.floats=[],this.ints=[],this.strings=[],this.tensors=[],this.graphs=[],e)for(var t=Object.keys(e),n=0;n<t.length;++n)null!=e[t[n]]&&(this[t[n]]=e[t[n]])}return e.prototype.name="",e.prototype.refAttrName="",e.prototype.docString="",e.prototype.type=0,e.prototype.f=0,e.prototype.i=l.Long?l.Long.fromBits(0,0,!1):0,e.prototype.s=l.newBuffer([]),e.prototype.t=null,e.prototype.g=null,e.prototype.floats=l.emptyArray,e.prototype.ints=l.emptyArray,e.prototype.strings=l.emptyArray,e.prototype.tensors=l.emptyArray,e.prototype.graphs=l.emptyArray,e.create=function(t){return new e(t)},e.encode=function(e,t){if(t||(t=u.create()),null!=e.name&&e.hasOwnProperty("name")&&t.uint32(10).string(e.name),null!=e.f&&e.hasOwnProperty("f")&&t.uint32(21).float(e.f),null!=e.i&&e.hasOwnProperty("i")&&t.uint32(24).int64(e.i),null!=e.s&&e.hasOwnProperty("s")&&t.uint32(34).bytes(e.s),null!=e.t&&e.hasOwnProperty("t")&&c.onnx.TensorProto.encode(e.t,t.uint32(42).fork()).ldelim(),null!=e.g&&e.hasOwnProperty("g")&&c.onnx.GraphProto.encode(e.g,t.uint32(50).fork()).ldelim(),null!=e.floats&&e.floats.length){t.uint32(58).fork();for(var n=0;n<e.floats.length;++n)t.float(e.floats[n]);t.ldelim()}if(null!=e.ints&&e.ints.length){for(t.uint32(66).fork(),n=0;n<e.ints.length;++n)t.int64(e.ints[n]);t.ldelim()}if(null!=e.strings&&e.strings.length)for(n=0;n<e.strings.length;++n)t.uint32(74).bytes(e.strings[n]);if(null!=e.tensors&&e.tensors.length)for(n=0;n<e.tensors.length;++n)c.onnx.TensorProto.encode(e.tensors[n],t.uint32(82).fork()).ldelim();if(null!=e.graphs&&e.graphs.length)for(n=0;n<e.graphs.length;++n)c.onnx.GraphProto.encode(e.graphs[n],t.uint32(90).fork()).ldelim();return null!=e.docString&&e.hasOwnProperty("docString")&&t.uint32(106).string(e.docString),null!=e.type&&e.hasOwnProperty("type")&&t.uint32(160).int32(e.type),null!=e.refAttrName&&e.hasOwnProperty("refAttrName")&&t.uint32(170).string(e.refAttrName),t},e.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},e.decode=function(e,t){e instanceof s||(e=s.create(e));for(var n=void 0===t?e.len:e.pos+t,r=new c.onnx.AttributeProto;e.pos<n;){var o=e.uint32();switch(o>>>3){case 1:r.name=e.string();break;case 21:r.refAttrName=e.string();break;case 13:r.docString=e.string();break;case 20:r.type=e.int32();break;case 2:r.f=e.float();break;case 3:r.i=e.int64();break;case 4:r.s=e.bytes();break;case 5:r.t=c.onnx.TensorProto.decode(e,e.uint32());break;case 6:r.g=c.onnx.GraphProto.decode(e,e.uint32());break;case 7:if(r.floats&&r.floats.length||(r.floats=[]),2==(7&o))for(var i=e.uint32()+e.pos;e.pos<i;)r.floats.push(e.float());else r.floats.push(e.float());break;case 8:if(r.ints&&r.ints.length||(r.ints=[]),2==(7&o))for(i=e.uint32()+e.pos;e.pos<i;)r.ints.push(e.int64());else r.ints.push(e.int64());break;case 9:r.strings&&r.strings.length||(r.strings=[]),r.strings.push(e.bytes());break;case 10:r.tensors&&r.tensors.length||(r.tensors=[]),r.tensors.push(c.onnx.TensorProto.decode(e,e.uint32()));break;case 11:r.graphs&&r.graphs.length||(r.graphs=[]),r.graphs.push(c.onnx.GraphProto.decode(e,e.uint32()));break;default:e.skipType(7&o)}}return r},e.decodeDelimited=function(e){return e instanceof s||(e=new s(e)),this.decode(e,e.uint32())},e.verify=function(e){if("object"!=typeof e||null===e)return"object expected";if(null!=e.name&&e.hasOwnProperty("name")&&!l.isString(e.name))return"name: string expected";if(null!=e.refAttrName&&e.hasOwnProperty("refAttrName")&&!l.isString(e.refAttrName))return"refAttrName: string expected";if(null!=e.docString&&e.hasOwnProperty("docString")&&!l.isString(e.docString))return"docString: string expected";if(null!=e.type&&e.hasOwnProperty("type"))switch(e.type){default:return"type: enum value expected";case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:case 8:case 9:case 10:}if(null!=e.f&&e.hasOwnProperty("f")&&"number"!=typeof e.f)return"f: number expected";if(null!=e.i&&e.hasOwnProperty("i")&&!(l.isInteger(e.i)||e.i&&l.isInteger(e.i.low)&&l.isInteger(e.i.high)))return"i: integer|Long expected";if(null!=e.s&&e.hasOwnProperty("s")&&!(e.s&&"number"==typeof e.s.length||l.isString(e.s)))return"s: buffer expected";if(null!=e.t&&e.hasOwnProperty("t")&&(n=c.onnx.TensorProto.verify(e.t)))return"t."+n;if(null!=e.g&&e.hasOwnProperty("g")&&(n=c.onnx.GraphProto.verify(e.g)))return"g."+n;if(null!=e.floats&&e.hasOwnProperty("floats")){if(!Array.isArray(e.floats))return"floats: array expected";for(var t=0;t<e.floats.length;++t)if("number"!=typeof e.floats[t])return"floats: number[] expected"}if(null!=e.ints&&e.hasOwnProperty("ints")){if(!Array.isArray(e.ints))return"ints: array expected";for(t=0;t<e.ints.length;++t)if(!(l.isInteger(e.ints[t])||e.ints[t]&&l.isInteger(e.ints[t].low)&&l.isInteger(e.ints[t].high)))return"ints: integer|Long[] expected"}if(null!=e.strings&&e.hasOwnProperty("strings")){if(!Array.isArray(e.strings))return"strings: array expected";for(t=0;t<e.strings.length;++t)if(!(e.strings[t]&&"number"==typeof e.strings[t].length||l.isString(e.strings[t])))return"strings: buffer[] expected"}if(null!=e.tensors&&e.hasOwnProperty("tensors")){if(!Array.isArray(e.tensors))return"tensors: array expected";for(t=0;t<e.tensors.length;++t)if(n=c.onnx.TensorProto.verify(e.tensors[t]))return"tensors."+n}if(null!=e.graphs&&e.hasOwnProperty("graphs")){if(!Array.isArray(e.graphs))return"graphs: array expected";for(t=0;t<e.graphs.length;++t){var n;if(n=c.onnx.GraphProto.verify(e.graphs[t]))return"graphs."+n}}return null},e.fromObject=function(e){if(e instanceof c.onnx.AttributeProto)return e;var t=new c.onnx.AttributeProto;switch(null!=e.name&&(t.name=String(e.name)),null!=e.refAttrName&&(t.refAttrName=String(e.refAttrName)),null!=e.docString&&(t.docString=String(e.docString)),e.type){case"UNDEFINED":case 0:t.type=0;break;case"FLOAT":case 1:t.type=1;break;case"INT":case 2:t.type=2;break;case"STRING":case 3:t.type=3;break;case"TENSOR":case 4:t.type=4;break;case"GRAPH":case 5:t.type=5;break;case"FLOATS":case 6:t.type=6;break;case"INTS":case 7:t.type=7;break;case"STRINGS":case 8:t.type=8;break;case"TENSORS":case 9:t.type=9;break;case"GRAPHS":case 10:t.type=10}if(null!=e.f&&(t.f=Number(e.f)),null!=e.i&&(l.Long?(t.i=l.Long.fromValue(e.i)).unsigned=!1:"string"==typeof e.i?t.i=parseInt(e.i,10):"number"==typeof e.i?t.i=e.i:"object"==typeof e.i&&(t.i=new l.LongBits(e.i.low>>>0,e.i.high>>>0).toNumber())),null!=e.s&&("string"==typeof e.s?l.base64.decode(e.s,t.s=l.newBuffer(l.base64.length(e.s)),0):e.s.length&&(t.s=e.s)),null!=e.t){if("object"!=typeof e.t)throw TypeError(".onnx.AttributeProto.t: object expected");t.t=c.onnx.TensorProto.fromObject(e.t)}if(null!=e.g){if("object"!=typeof e.g)throw TypeError(".onnx.AttributeProto.g: object expected");t.g=c.onnx.GraphProto.fromObject(e.g)}if(e.floats){if(!Array.isArray(e.floats))throw TypeError(".onnx.AttributeProto.floats: array expected");t.floats=[];for(var n=0;n<e.floats.length;++n)t.floats[n]=Number(e.floats[n])}if(e.ints){if(!Array.isArray(e.ints))throw TypeError(".onnx.AttributeProto.ints: array expected");for(t.ints=[],n=0;n<e.ints.length;++n)l.Long?(t.ints[n]=l.Long.fromValue(e.ints[n])).unsigned=!1:"string"==typeof e.ints[n]?t.ints[n]=parseInt(e.ints[n],10):"number"==typeof e.ints[n]?t.ints[n]=e.ints[n]:"object"==typeof e.ints[n]&&(t.ints[n]=new l.LongBits(e.ints[n].low>>>0,e.ints[n].high>>>0).toNumber())}if(e.strings){if(!Array.isArray(e.strings))throw TypeError(".onnx.AttributeProto.strings: array expected");for(t.strings=[],n=0;n<e.strings.length;++n)"string"==typeof e.strings[n]?l.base64.decode(e.strings[n],t.strings[n]=l.newBuffer(l.base64.length(e.strings[n])),0):e.strings[n].length&&(t.strings[n]=e.strings[n])}if(e.tensors){if(!Array.isArray(e.tensors))throw TypeError(".onnx.AttributeProto.tensors: array expected");for(t.tensors=[],n=0;n<e.tensors.length;++n){if("object"!=typeof e.tensors[n])throw TypeError(".onnx.AttributeProto.tensors: object expected");t.tensors[n]=c.onnx.TensorProto.fromObject(e.tensors[n])}}if(e.graphs){if(!Array.isArray(e.graphs))throw TypeError(".onnx.AttributeProto.graphs: array expected");for(t.graphs=[],n=0;n<e.graphs.length;++n){if("object"!=typeof e.graphs[n])throw TypeError(".onnx.AttributeProto.graphs: object expected");t.graphs[n]=c.onnx.GraphProto.fromObject(e.graphs[n])}}return t},e.toObject=function(e,t){t||(t={});var n={};if((t.arrays||t.defaults)&&(n.floats=[],n.ints=[],n.strings=[],n.tensors=[],n.graphs=[]),t.defaults){if(n.name="",n.f=0,l.Long){var r=new l.Long(0,0,!1);n.i=t.longs===String?r.toString():t.longs===Number?r.toNumber():r}else n.i=t.longs===String?"0":0;t.bytes===String?n.s="":(n.s=[],t.bytes!==Array&&(n.s=l.newBuffer(n.s))),n.t=null,n.g=null,n.docString="",n.type=t.enums===String?"UNDEFINED":0,n.refAttrName=""}if(null!=e.name&&e.hasOwnProperty("name")&&(n.name=e.name),null!=e.f&&e.hasOwnProperty("f")&&(n.f=t.json&&!isFinite(e.f)?String(e.f):e.f),null!=e.i&&e.hasOwnProperty("i")&&("number"==typeof e.i?n.i=t.longs===String?String(e.i):e.i:n.i=t.longs===String?l.Long.prototype.toString.call(e.i):t.longs===Number?new l.LongBits(e.i.low>>>0,e.i.high>>>0).toNumber():e.i),null!=e.s&&e.hasOwnProperty("s")&&(n.s=t.bytes===String?l.base64.encode(e.s,0,e.s.length):t.bytes===Array?Array.prototype.slice.call(e.s):e.s),null!=e.t&&e.hasOwnProperty("t")&&(n.t=c.onnx.TensorProto.toObject(e.t,t)),null!=e.g&&e.hasOwnProperty("g")&&(n.g=c.onnx.GraphProto.toObject(e.g,t)),e.floats&&e.floats.length){n.floats=[];for(var o=0;o<e.floats.length;++o)n.floats[o]=t.json&&!isFinite(e.floats[o])?String(e.floats[o]):e.floats[o]}if(e.ints&&e.ints.length)for(n.ints=[],o=0;o<e.ints.length;++o)"number"==typeof e.ints[o]?n.ints[o]=t.longs===String?String(e.ints[o]):e.ints[o]:n.ints[o]=t.longs===String?l.Long.prototype.toString.call(e.ints[o]):t.longs===Number?new l.LongBits(e.ints[o].low>>>0,e.ints[o].high>>>0).toNumber():e.ints[o];if(e.strings&&e.strings.length)for(n.strings=[],o=0;o<e.strings.length;++o)n.strings[o]=t.bytes===String?l.base64.encode(e.strings[o],0,e.strings[o].length):t.bytes===Array?Array.prototype.slice.call(e.strings[o]):e.strings[o];if(e.tensors&&e.tensors.length)for(n.tensors=[],o=0;o<e.tensors.length;++o)n.tensors[o]=c.onnx.TensorProto.toObject(e.tensors[o],t);if(e.graphs&&e.graphs.length)for(n.graphs=[],o=0;o<e.graphs.length;++o)n.graphs[o]=c.onnx.GraphProto.toObject(e.graphs[o],t);return null!=e.docString&&e.hasOwnProperty("docString")&&(n.docString=e.docString),null!=e.type&&e.hasOwnProperty("type")&&(n.type=t.enums===String?c.onnx.AttributeProto.AttributeType[e.type]:e.type),null!=e.refAttrName&&e.hasOwnProperty("refAttrName")&&(n.refAttrName=e.refAttrName),n},e.prototype.toJSON=function(){return this.constructor.toObject(this,a.util.toJSONOptions)},e.AttributeType=function(){var e={},t=Object.create(e);return t[e[0]="UNDEFINED"]=0,t[e[1]="FLOAT"]=1,t[e[2]="INT"]=2,t[e[3]="STRING"]=3,t[e[4]="TENSOR"]=4,t[e[5]="GRAPH"]=5,t[e[6]="FLOATS"]=6,t[e[7]="INTS"]=7,t[e[8]="STRINGS"]=8,t[e[9]="TENSORS"]=9,t[e[10]="GRAPHS"]=10,t}(),e}(),i.ValueInfoProto=function(){function e(e){if(e)for(var t=Object.keys(e),n=0;n<t.length;++n)null!=e[t[n]]&&(this[t[n]]=e[t[n]])}return e.prototype.name="",e.prototype.type=null,e.prototype.docString="",e.create=function(t){return new e(t)},e.encode=function(e,t){return t||(t=u.create()),null!=e.name&&e.hasOwnProperty("name")&&t.uint32(10).string(e.name),null!=e.type&&e.hasOwnProperty("type")&&c.onnx.TypeProto.encode(e.type,t.uint32(18).fork()).ldelim(),null!=e.docString&&e.hasOwnProperty("docString")&&t.uint32(26).string(e.docString),t},e.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},e.decode=function(e,t){e instanceof s||(e=s.create(e));for(var n=void 0===t?e.len:e.pos+t,r=new c.onnx.ValueInfoProto;e.pos<n;){var o=e.uint32();switch(o>>>3){case 1:r.name=e.string();break;case 2:r.type=c.onnx.TypeProto.decode(e,e.uint32());break;case 3:r.docString=e.string();break;default:e.skipType(7&o)}}return r},e.decodeDelimited=function(e){return e instanceof s||(e=new s(e)),this.decode(e,e.uint32())},e.verify=function(e){if("object"!=typeof e||null===e)return"object expected";if(null!=e.name&&e.hasOwnProperty("name")&&!l.isString(e.name))return"name: string expected";if(null!=e.type&&e.hasOwnProperty("type")){var t=c.onnx.TypeProto.verify(e.type);if(t)return"type."+t}return null!=e.docString&&e.hasOwnProperty("docString")&&!l.isString(e.docString)?"docString: string expected":null},e.fromObject=function(e){if(e instanceof c.onnx.ValueInfoProto)return e;var t=new c.onnx.ValueInfoProto;if(null!=e.name&&(t.name=String(e.name)),null!=e.type){if("object"!=typeof e.type)throw TypeError(".onnx.ValueInfoProto.type: object expected");t.type=c.onnx.TypeProto.fromObject(e.type)}return null!=e.docString&&(t.docString=String(e.docString)),t},e.toObject=function(e,t){t||(t={});var n={};return t.defaults&&(n.name="",n.type=null,n.docString=""),null!=e.name&&e.hasOwnProperty("name")&&(n.name=e.name),null!=e.type&&e.hasOwnProperty("type")&&(n.type=c.onnx.TypeProto.toObject(e.type,t)),null!=e.docString&&e.hasOwnProperty("docString")&&(n.docString=e.docString),n},e.prototype.toJSON=function(){return this.constructor.toObject(this,a.util.toJSONOptions)},e}(),i.NodeProto=function(){function e(e){if(this.input=[],this.output=[],this.attribute=[],e)for(var t=Object.keys(e),n=0;n<t.length;++n)null!=e[t[n]]&&(this[t[n]]=e[t[n]])}return e.prototype.input=l.emptyArray,e.prototype.output=l.emptyArray,e.prototype.name="",e.prototype.opType="",e.prototype.domain="",e.prototype.attribute=l.emptyArray,e.prototype.docString="",e.create=function(t){return new e(t)},e.encode=function(e,t){if(t||(t=u.create()),null!=e.input&&e.input.length)for(var n=0;n<e.input.length;++n)t.uint32(10).string(e.input[n]);if(null!=e.output&&e.output.length)for(n=0;n<e.output.length;++n)t.uint32(18).string(e.output[n]);if(null!=e.name&&e.hasOwnProperty("name")&&t.uint32(26).string(e.name),null!=e.opType&&e.hasOwnProperty("opType")&&t.uint32(34).string(e.opType),null!=e.attribute&&e.attribute.length)for(n=0;n<e.attribute.length;++n)c.onnx.AttributeProto.encode(e.attribute[n],t.uint32(42).fork()).ldelim();return null!=e.docString&&e.hasOwnProperty("docString")&&t.uint32(50).string(e.docString),null!=e.domain&&e.hasOwnProperty("domain")&&t.uint32(58).string(e.domain),t},e.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},e.decode=function(e,t){e instanceof s||(e=s.create(e));for(var n=void 0===t?e.len:e.pos+t,r=new c.onnx.NodeProto;e.pos<n;){var o=e.uint32();switch(o>>>3){case 1:r.input&&r.input.length||(r.input=[]),r.input.push(e.string());break;case 2:r.output&&r.output.length||(r.output=[]),r.output.push(e.string());break;case 3:r.name=e.string();break;case 4:r.opType=e.string();break;case 7:r.domain=e.string();break;case 5:r.attribute&&r.attribute.length||(r.attribute=[]),r.attribute.push(c.onnx.AttributeProto.decode(e,e.uint32()));break;case 6:r.docString=e.string();break;default:e.skipType(7&o)}}return r},e.decodeDelimited=function(e){return e instanceof s||(e=new s(e)),this.decode(e,e.uint32())},e.verify=function(e){if("object"!=typeof e||null===e)return"object expected";if(null!=e.input&&e.hasOwnProperty("input")){if(!Array.isArray(e.input))return"input: array expected";for(var t=0;t<e.input.length;++t)if(!l.isString(e.input[t]))return"input: string[] expected"}if(null!=e.output&&e.hasOwnProperty("output")){if(!Array.isArray(e.output))return"output: array expected";for(t=0;t<e.output.length;++t)if(!l.isString(e.output[t]))return"output: string[] expected"}if(null!=e.name&&e.hasOwnProperty("name")&&!l.isString(e.name))return"name: string expected";if(null!=e.opType&&e.hasOwnProperty("opType")&&!l.isString(e.opType))return"opType: string expected";if(null!=e.domain&&e.hasOwnProperty("domain")&&!l.isString(e.domain))return"domain: string expected";if(null!=e.attribute&&e.hasOwnProperty("attribute")){if(!Array.isArray(e.attribute))return"attribute: array expected";for(t=0;t<e.attribute.length;++t){var n=c.onnx.AttributeProto.verify(e.attribute[t]);if(n)return"attribute."+n}}return null!=e.docString&&e.hasOwnProperty("docString")&&!l.isString(e.docString)?"docString: string expected":null},e.fromObject=function(e){if(e instanceof c.onnx.NodeProto)return e;var t=new c.onnx.NodeProto;if(e.input){if(!Array.isArray(e.input))throw TypeError(".onnx.NodeProto.input: array expected");t.input=[];for(var n=0;n<e.input.length;++n)t.input[n]=String(e.input[n])}if(e.output){if(!Array.isArray(e.output))throw TypeError(".onnx.NodeProto.output: array expected");for(t.output=[],n=0;n<e.output.length;++n)t.output[n]=String(e.output[n])}if(null!=e.name&&(t.name=String(e.name)),null!=e.opType&&(t.opType=String(e.opType)),null!=e.domain&&(t.domain=String(e.domain)),e.attribute){if(!Array.isArray(e.attribute))throw TypeError(".onnx.NodeProto.attribute: array expected");for(t.attribute=[],n=0;n<e.attribute.length;++n){if("object"!=typeof e.attribute[n])throw TypeError(".onnx.NodeProto.attribute: object expected");t.attribute[n]=c.onnx.AttributeProto.fromObject(e.attribute[n])}}return null!=e.docString&&(t.docString=String(e.docString)),t},e.toObject=function(e,t){t||(t={});var n={};if((t.arrays||t.defaults)&&(n.input=[],n.output=[],n.attribute=[]),t.defaults&&(n.name="",n.opType="",n.docString="",n.domain=""),e.input&&e.input.length){n.input=[];for(var r=0;r<e.input.length;++r)n.input[r]=e.input[r]}if(e.output&&e.output.length)for(n.output=[],r=0;r<e.output.length;++r)n.output[r]=e.output[r];if(null!=e.name&&e.hasOwnProperty("name")&&(n.name=e.name),null!=e.opType&&e.hasOwnProperty("opType")&&(n.opType=e.opType),e.attribute&&e.attribute.length)for(n.attribute=[],r=0;r<e.attribute.length;++r)n.attribute[r]=c.onnx.AttributeProto.toObject(e.attribute[r],t);return null!=e.docString&&e.hasOwnProperty("docString")&&(n.docString=e.docString),null!=e.domain&&e.hasOwnProperty("domain")&&(n.domain=e.domain),n},e.prototype.toJSON=function(){return this.constructor.toObject(this,a.util.toJSONOptions)},e}(),i.ModelProto=function(){function e(e){if(this.opsetImport=[],this.metadataProps=[],e)for(var t=Object.keys(e),n=0;n<t.length;++n)null!=e[t[n]]&&(this[t[n]]=e[t[n]])}return e.prototype.irVersion=l.Long?l.Long.fromBits(0,0,!1):0,e.prototype.opsetImport=l.emptyArray,e.prototype.producerName="",e.prototype.producerVersion="",e.prototype.domain="",e.prototype.modelVersion=l.Long?l.Long.fromBits(0,0,!1):0,e.prototype.docString="",e.prototype.graph=null,e.prototype.metadataProps=l.emptyArray,e.create=function(t){return new e(t)},e.encode=function(e,t){if(t||(t=u.create()),null!=e.irVersion&&e.hasOwnProperty("irVersion")&&t.uint32(8).int64(e.irVersion),null!=e.producerName&&e.hasOwnProperty("producerName")&&t.uint32(18).string(e.producerName),null!=e.producerVersion&&e.hasOwnProperty("producerVersion")&&t.uint32(26).string(e.producerVersion),null!=e.domain&&e.hasOwnProperty("domain")&&t.uint32(34).string(e.domain),null!=e.modelVersion&&e.hasOwnProperty("modelVersion")&&t.uint32(40).int64(e.modelVersion),null!=e.docString&&e.hasOwnProperty("docString")&&t.uint32(50).string(e.docString),null!=e.graph&&e.hasOwnProperty("graph")&&c.onnx.GraphProto.encode(e.graph,t.uint32(58).fork()).ldelim(),null!=e.opsetImport&&e.opsetImport.length)for(var n=0;n<e.opsetImport.length;++n)c.onnx.OperatorSetIdProto.encode(e.opsetImport[n],t.uint32(66).fork()).ldelim();if(null!=e.metadataProps&&e.metadataProps.length)for(n=0;n<e.metadataProps.length;++n)c.onnx.StringStringEntryProto.encode(e.metadataProps[n],t.uint32(114).fork()).ldelim();return t},e.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},e.decode=function(e,t){e instanceof s||(e=s.create(e));for(var n=void 0===t?e.len:e.pos+t,r=new c.onnx.ModelProto;e.pos<n;){var o=e.uint32();switch(o>>>3){case 1:r.irVersion=e.int64();break;case 8:r.opsetImport&&r.opsetImport.length||(r.opsetImport=[]),r.opsetImport.push(c.onnx.OperatorSetIdProto.decode(e,e.uint32()));break;case 2:r.producerName=e.string();break;case 3:r.producerVersion=e.string();break;case 4:r.domain=e.string();break;case 5:r.modelVersion=e.int64();break;case 6:r.docString=e.string();break;case 7:r.graph=c.onnx.GraphProto.decode(e,e.uint32());break;case 14:r.metadataProps&&r.metadataProps.length||(r.metadataProps=[]),r.metadataProps.push(c.onnx.StringStringEntryProto.decode(e,e.uint32()));break;default:e.skipType(7&o)}}return r},e.decodeDelimited=function(e){return e instanceof s||(e=new s(e)),this.decode(e,e.uint32())},e.verify=function(e){if("object"!=typeof e||null===e)return"object expected";if(null!=e.irVersion&&e.hasOwnProperty("irVersion")&&!(l.isInteger(e.irVersion)||e.irVersion&&l.isInteger(e.irVersion.low)&&l.isInteger(e.irVersion.high)))return"irVersion: integer|Long expected";if(null!=e.opsetImport&&e.hasOwnProperty("opsetImport")){if(!Array.isArray(e.opsetImport))return"opsetImport: array expected";for(var t=0;t<e.opsetImport.length;++t)if(n=c.onnx.OperatorSetIdProto.verify(e.opsetImport[t]))return"opsetImport."+n}if(null!=e.producerName&&e.hasOwnProperty("producerName")&&!l.isString(e.producerName))return"producerName: string expected";if(null!=e.producerVersion&&e.hasOwnProperty("producerVersion")&&!l.isString(e.producerVersion))return"producerVersion: string expected";if(null!=e.domain&&e.hasOwnProperty("domain")&&!l.isString(e.domain))return"domain: string expected";if(null!=e.modelVersion&&e.hasOwnProperty("modelVersion")&&!(l.isInteger(e.modelVersion)||e.modelVersion&&l.isInteger(e.modelVersion.low)&&l.isInteger(e.modelVersion.high)))return"modelVersion: integer|Long expected";if(null!=e.docString&&e.hasOwnProperty("docString")&&!l.isString(e.docString))return"docString: string expected";if(null!=e.graph&&e.hasOwnProperty("graph")&&(n=c.onnx.GraphProto.verify(e.graph)))return"graph."+n;if(null!=e.metadataProps&&e.hasOwnProperty("metadataProps")){if(!Array.isArray(e.metadataProps))return"metadataProps: array expected";for(t=0;t<e.metadataProps.length;++t){var n;if(n=c.onnx.StringStringEntryProto.verify(e.metadataProps[t]))return"metadataProps."+n}}return null},e.fromObject=function(e){if(e instanceof c.onnx.ModelProto)return e;var t=new c.onnx.ModelProto;if(null!=e.irVersion&&(l.Long?(t.irVersion=l.Long.fromValue(e.irVersion)).unsigned=!1:"string"==typeof e.irVersion?t.irVersion=parseInt(e.irVersion,10):"number"==typeof e.irVersion?t.irVersion=e.irVersion:"object"==typeof e.irVersion&&(t.irVersion=new l.LongBits(e.irVersion.low>>>0,e.irVersion.high>>>0).toNumber())),e.opsetImport){if(!Array.isArray(e.opsetImport))throw TypeError(".onnx.ModelProto.opsetImport: array expected");t.opsetImport=[];for(var n=0;n<e.opsetImport.length;++n){if("object"!=typeof e.opsetImport[n])throw TypeError(".onnx.ModelProto.opsetImport: object expected");t.opsetImport[n]=c.onnx.OperatorSetIdProto.fromObject(e.opsetImport[n])}}if(null!=e.producerName&&(t.producerName=String(e.producerName)),null!=e.producerVersion&&(t.producerVersion=String(e.producerVersion)),null!=e.domain&&(t.domain=String(e.domain)),null!=e.modelVersion&&(l.Long?(t.modelVersion=l.Long.fromValue(e.modelVersion)).unsigned=!1:"string"==typeof e.modelVersion?t.modelVersion=parseInt(e.modelVersion,10):"number"==typeof e.modelVersion?t.modelVersion=e.modelVersion:"object"==typeof e.modelVersion&&(t.modelVersion=new l.LongBits(e.modelVersion.low>>>0,e.modelVersion.high>>>0).toNumber())),null!=e.docString&&(t.docString=String(e.docString)),null!=e.graph){if("object"!=typeof e.graph)throw TypeError(".onnx.ModelProto.graph: object expected");t.graph=c.onnx.GraphProto.fromObject(e.graph)}if(e.metadataProps){if(!Array.isArray(e.metadataProps))throw TypeError(".onnx.ModelProto.metadataProps: array expected");for(t.metadataProps=[],n=0;n<e.metadataProps.length;++n){if("object"!=typeof e.metadataProps[n])throw TypeError(".onnx.ModelProto.metadataProps: object expected");t.metadataProps[n]=c.onnx.StringStringEntryProto.fromObject(e.metadataProps[n])}}return t},e.toObject=function(e,t){t||(t={});var n={};if((t.arrays||t.defaults)&&(n.opsetImport=[],n.metadataProps=[]),t.defaults){if(l.Long){var r=new l.Long(0,0,!1);n.irVersion=t.longs===String?r.toString():t.longs===Number?r.toNumber():r}else n.irVersion=t.longs===String?"0":0;n.producerName="",n.producerVersion="",n.domain="",l.Long?(r=new l.Long(0,0,!1),n.modelVersion=t.longs===String?r.toString():t.longs===Number?r.toNumber():r):n.modelVersion=t.longs===String?"0":0,n.docString="",n.graph=null}if(null!=e.irVersion&&e.hasOwnProperty("irVersion")&&("number"==typeof e.irVersion?n.irVersion=t.longs===String?String(e.irVersion):e.irVersion:n.irVersion=t.longs===String?l.Long.prototype.toString.call(e.irVersion):t.longs===Number?new l.LongBits(e.irVersion.low>>>0,e.irVersion.high>>>0).toNumber():e.irVersion),null!=e.producerName&&e.hasOwnProperty("producerName")&&(n.producerName=e.producerName),null!=e.producerVersion&&e.hasOwnProperty("producerVersion")&&(n.producerVersion=e.producerVersion),null!=e.domain&&e.hasOwnProperty("domain")&&(n.domain=e.domain),null!=e.modelVersion&&e.hasOwnProperty("modelVersion")&&("number"==typeof e.modelVersion?n.modelVersion=t.longs===String?String(e.modelVersion):e.modelVersion:n.modelVersion=t.longs===String?l.Long.prototype.toString.call(e.modelVersion):t.longs===Number?new l.LongBits(e.modelVersion.low>>>0,e.modelVersion.high>>>0).toNumber():e.modelVersion),null!=e.docString&&e.hasOwnProperty("docString")&&(n.docString=e.docString),null!=e.graph&&e.hasOwnProperty("graph")&&(n.graph=c.onnx.GraphProto.toObject(e.graph,t)),e.opsetImport&&e.opsetImport.length){n.opsetImport=[];for(var o=0;o<e.opsetImport.length;++o)n.opsetImport[o]=c.onnx.OperatorSetIdProto.toObject(e.opsetImport[o],t)}if(e.metadataProps&&e.metadataProps.length)for(n.metadataProps=[],o=0;o<e.metadataProps.length;++o)n.metadataProps[o]=c.onnx.StringStringEntryProto.toObject(e.metadataProps[o],t);return n},e.prototype.toJSON=function(){return this.constructor.toObject(this,a.util.toJSONOptions)},e}(),i.StringStringEntryProto=function(){function e(e){if(e)for(var t=Object.keys(e),n=0;n<t.length;++n)null!=e[t[n]]&&(this[t[n]]=e[t[n]])}return e.prototype.key="",e.prototype.value="",e.create=function(t){return new e(t)},e.encode=function(e,t){return t||(t=u.create()),null!=e.key&&e.hasOwnProperty("key")&&t.uint32(10).string(e.key),null!=e.value&&e.hasOwnProperty("value")&&t.uint32(18).string(e.value),t},e.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},e.decode=function(e,t){e instanceof s||(e=s.create(e));for(var n=void 0===t?e.len:e.pos+t,r=new c.onnx.StringStringEntryProto;e.pos<n;){var o=e.uint32();switch(o>>>3){case 1:r.key=e.string();break;case 2:r.value=e.string();break;default:e.skipType(7&o)}}return r},e.decodeDelimited=function(e){return e instanceof s||(e=new s(e)),this.decode(e,e.uint32())},e.verify=function(e){return"object"!=typeof e||null===e?"object expected":null!=e.key&&e.hasOwnProperty("key")&&!l.isString(e.key)?"key: string expected":null!=e.value&&e.hasOwnProperty("value")&&!l.isString(e.value)?"value: string expected":null},e.fromObject=function(e){if(e instanceof c.onnx.StringStringEntryProto)return e;var t=new c.onnx.StringStringEntryProto;return null!=e.key&&(t.key=String(e.key)),null!=e.value&&(t.value=String(e.value)),t},e.toObject=function(e,t){t||(t={});var n={};return t.defaults&&(n.key="",n.value=""),null!=e.key&&e.hasOwnProperty("key")&&(n.key=e.key),null!=e.value&&e.hasOwnProperty("value")&&(n.value=e.value),n},e.prototype.toJSON=function(){return this.constructor.toObject(this,a.util.toJSONOptions)},e}(),i.TensorAnnotation=function(){function e(e){if(this.quantParameterTensorNames=[],e)for(var t=Object.keys(e),n=0;n<t.length;++n)null!=e[t[n]]&&(this[t[n]]=e[t[n]])}return e.prototype.tensorName="",e.prototype.quantParameterTensorNames=l.emptyArray,e.create=function(t){return new e(t)},e.encode=function(e,t){if(t||(t=u.create()),null!=e.tensorName&&e.hasOwnProperty("tensorName")&&t.uint32(10).string(e.tensorName),null!=e.quantParameterTensorNames&&e.quantParameterTensorNames.length)for(var n=0;n<e.quantParameterTensorNames.length;++n)c.onnx.StringStringEntryProto.encode(e.quantParameterTensorNames[n],t.uint32(18).fork()).ldelim();return t},e.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},e.decode=function(e,t){e instanceof s||(e=s.create(e));for(var n=void 0===t?e.len:e.pos+t,r=new c.onnx.TensorAnnotation;e.pos<n;){var o=e.uint32();switch(o>>>3){case 1:r.tensorName=e.string();break;case 2:r.quantParameterTensorNames&&r.quantParameterTensorNames.length||(r.quantParameterTensorNames=[]),r.quantParameterTensorNames.push(c.onnx.StringStringEntryProto.decode(e,e.uint32()));break;default:e.skipType(7&o)}}return r},e.decodeDelimited=function(e){return e instanceof s||(e=new s(e)),this.decode(e,e.uint32())},e.verify=function(e){if("object"!=typeof e||null===e)return"object expected";if(null!=e.tensorName&&e.hasOwnProperty("tensorName")&&!l.isString(e.tensorName))return"tensorName: string expected";if(null!=e.quantParameterTensorNames&&e.hasOwnProperty("quantParameterTensorNames")){if(!Array.isArray(e.quantParameterTensorNames))return"quantParameterTensorNames: array expected";for(var t=0;t<e.quantParameterTensorNames.length;++t){var n=c.onnx.StringStringEntryProto.verify(e.quantParameterTensorNames[t]);if(n)return"quantParameterTensorNames."+n}}return null},e.fromObject=function(e){if(e instanceof c.onnx.TensorAnnotation)return e;var t=new c.onnx.TensorAnnotation;if(null!=e.tensorName&&(t.tensorName=String(e.tensorName)),e.quantParameterTensorNames){if(!Array.isArray(e.quantParameterTensorNames))throw TypeError(".onnx.TensorAnnotation.quantParameterTensorNames: array expected");t.quantParameterTensorNames=[];for(var n=0;n<e.quantParameterTensorNames.length;++n){if("object"!=typeof e.quantParameterTensorNames[n])throw TypeError(".onnx.TensorAnnotation.quantParameterTensorNames: object expected");t.quantParameterTensorNames[n]=c.onnx.StringStringEntryProto.fromObject(e.quantParameterTensorNames[n])}}return t},e.toObject=function(e,t){t||(t={});var n={};if((t.arrays||t.defaults)&&(n.quantParameterTensorNames=[]),t.defaults&&(n.tensorName=""),null!=e.tensorName&&e.hasOwnProperty("tensorName")&&(n.tensorName=e.tensorName),e.quantParameterTensorNames&&e.quantParameterTensorNames.length){n.quantParameterTensorNames=[];for(var r=0;r<e.quantParameterTensorNames.length;++r)n.quantParameterTensorNames[r]=c.onnx.StringStringEntryProto.toObject(e.quantParameterTensorNames[r],t)}return n},e.prototype.toJSON=function(){return this.constructor.toObject(this,a.util.toJSONOptions)},e}(),i.GraphProto=function(){function e(e){if(this.node=[],this.initializer=[],this.input=[],this.output=[],this.valueInfo=[],this.quantizationAnnotation=[],e)for(var t=Object.keys(e),n=0;n<t.length;++n)null!=e[t[n]]&&(this[t[n]]=e[t[n]])}return e.prototype.node=l.emptyArray,e.prototype.name="",e.prototype.initializer=l.emptyArray,e.prototype.docString="",e.prototype.input=l.emptyArray,e.prototype.output=l.emptyArray,e.prototype.valueInfo=l.emptyArray,e.prototype.quantizationAnnotation=l.emptyArray,e.create=function(t){return new e(t)},e.encode=function(e,t){if(t||(t=u.create()),null!=e.node&&e.node.length)for(var n=0;n<e.node.length;++n)c.onnx.NodeProto.encode(e.node[n],t.uint32(10).fork()).ldelim();if(null!=e.name&&e.hasOwnProperty("name")&&t.uint32(18).string(e.name),null!=e.initializer&&e.initializer.length)for(n=0;n<e.initializer.length;++n)c.onnx.TensorProto.encode(e.initializer[n],t.uint32(42).fork()).ldelim();if(null!=e.docString&&e.hasOwnProperty("docString")&&t.uint32(82).string(e.docString),null!=e.input&&e.input.length)for(n=0;n<e.input.length;++n)c.onnx.ValueInfoProto.encode(e.input[n],t.uint32(90).fork()).ldelim();if(null!=e.output&&e.output.length)for(n=0;n<e.output.length;++n)c.onnx.ValueInfoProto.encode(e.output[n],t.uint32(98).fork()).ldelim();if(null!=e.valueInfo&&e.valueInfo.length)for(n=0;n<e.valueInfo.length;++n)c.onnx.ValueInfoProto.encode(e.valueInfo[n],t.uint32(106).fork()).ldelim();if(null!=e.quantizationAnnotation&&e.quantizationAnnotation.length)for(n=0;n<e.quantizationAnnotation.length;++n)c.onnx.TensorAnnotation.encode(e.quantizationAnnotation[n],t.uint32(114).fork()).ldelim();return t},e.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},e.decode=function(e,t){e instanceof s||(e=s.create(e));for(var n=void 0===t?e.len:e.pos+t,r=new c.onnx.GraphProto;e.pos<n;){var o=e.uint32();switch(o>>>3){case 1:r.node&&r.node.length||(r.node=[]),r.node.push(c.onnx.NodeProto.decode(e,e.uint32()));break;case 2:r.name=e.string();break;case 5:r.initializer&&r.initializer.length||(r.initializer=[]),r.initializer.push(c.onnx.TensorProto.decode(e,e.uint32()));break;case 10:r.docString=e.string();break;case 11:r.input&&r.input.length||(r.input=[]),r.input.push(c.onnx.ValueInfoProto.decode(e,e.uint32()));break;case 12:r.output&&r.output.length||(r.output=[]),r.output.push(c.onnx.ValueInfoProto.decode(e,e.uint32()));break;case 13:r.valueInfo&&r.valueInfo.length||(r.valueInfo=[]),r.valueInfo.push(c.onnx.ValueInfoProto.decode(e,e.uint32()));break;case 14:r.quantizationAnnotation&&r.quantizationAnnotation.length||(r.quantizationAnnotation=[]),r.quantizationAnnotation.push(c.onnx.TensorAnnotation.decode(e,e.uint32()));break;default:e.skipType(7&o)}}return r},e.decodeDelimited=function(e){return e instanceof s||(e=new s(e)),this.decode(e,e.uint32())},e.verify=function(e){if("object"!=typeof e||null===e)return"object expected";if(null!=e.node&&e.hasOwnProperty("node")){if(!Array.isArray(e.node))return"node: array expected";for(var t=0;t<e.node.length;++t)if(n=c.onnx.NodeProto.verify(e.node[t]))return"node."+n}if(null!=e.name&&e.hasOwnProperty("name")&&!l.isString(e.name))return"name: string expected";if(null!=e.initializer&&e.hasOwnProperty("initializer")){if(!Array.isArray(e.initializer))return"initializer: array expected";for(t=0;t<e.initializer.length;++t)if(n=c.onnx.TensorProto.verify(e.initializer[t]))return"initializer."+n}if(null!=e.docString&&e.hasOwnProperty("docString")&&!l.isString(e.docString))return"docString: string expected";if(null!=e.input&&e.hasOwnProperty("input")){if(!Array.isArray(e.input))return"input: array expected";for(t=0;t<e.input.length;++t)if(n=c.onnx.ValueInfoProto.verify(e.input[t]))return"input."+n}if(null!=e.output&&e.hasOwnProperty("output")){if(!Array.isArray(e.output))return"output: array expected";for(t=0;t<e.output.length;++t)if(n=c.onnx.ValueInfoProto.verify(e.output[t]))return"output."+n}if(null!=e.valueInfo&&e.hasOwnProperty("valueInfo")){if(!Array.isArray(e.valueInfo))return"valueInfo: array expected";for(t=0;t<e.valueInfo.length;++t)if(n=c.onnx.ValueInfoProto.verify(e.valueInfo[t]))return"valueInfo."+n}if(null!=e.quantizationAnnotation&&e.hasOwnProperty("quantizationAnnotation")){if(!Array.isArray(e.quantizationAnnotation))return"quantizationAnnotation: array expected";for(t=0;t<e.quantizationAnnotation.length;++t){var n;if(n=c.onnx.TensorAnnotation.verify(e.quantizationAnnotation[t]))return"quantizationAnnotation."+n}}return null},e.fromObject=function(e){if(e instanceof c.onnx.GraphProto)return e;var t=new c.onnx.GraphProto;if(e.node){if(!Array.isArray(e.node))throw TypeError(".onnx.GraphProto.node: array expected");t.node=[];for(var n=0;n<e.node.length;++n){if("object"!=typeof e.node[n])throw TypeError(".onnx.GraphProto.node: object expected");t.node[n]=c.onnx.NodeProto.fromObject(e.node[n])}}if(null!=e.name&&(t.name=String(e.name)),e.initializer){if(!Array.isArray(e.initializer))throw TypeError(".onnx.GraphProto.initializer: array expected");for(t.initializer=[],n=0;n<e.initializer.length;++n){if("object"!=typeof e.initializer[n])throw TypeError(".onnx.GraphProto.initializer: object expected");t.initializer[n]=c.onnx.TensorProto.fromObject(e.initializer[n])}}if(null!=e.docString&&(t.docString=String(e.docString)),e.input){if(!Array.isArray(e.input))throw TypeError(".onnx.GraphProto.input: array expected");for(t.input=[],n=0;n<e.input.length;++n){if("object"!=typeof e.input[n])throw TypeError(".onnx.GraphProto.input: object expected");t.input[n]=c.onnx.ValueInfoProto.fromObject(e.input[n])}}if(e.output){if(!Array.isArray(e.output))throw TypeError(".onnx.GraphProto.output: array expected");for(t.output=[],n=0;n<e.output.length;++n){if("object"!=typeof e.output[n])throw TypeError(".onnx.GraphProto.output: object expected");t.output[n]=c.onnx.ValueInfoProto.fromObject(e.output[n])}}if(e.valueInfo){if(!Array.isArray(e.valueInfo))throw TypeError(".onnx.GraphProto.valueInfo: array expected");for(t.valueInfo=[],n=0;n<e.valueInfo.length;++n){if("object"!=typeof e.valueInfo[n])throw TypeError(".onnx.GraphProto.valueInfo: object expected");t.valueInfo[n]=c.onnx.ValueInfoProto.fromObject(e.valueInfo[n])}}if(e.quantizationAnnotation){if(!Array.isArray(e.quantizationAnnotation))throw TypeError(".onnx.GraphProto.quantizationAnnotation: array expected");for(t.quantizationAnnotation=[],n=0;n<e.quantizationAnnotation.length;++n){if("object"!=typeof e.quantizationAnnotation[n])throw TypeError(".onnx.GraphProto.quantizationAnnotation: object expected");t.quantizationAnnotation[n]=c.onnx.TensorAnnotation.fromObject(e.quantizationAnnotation[n])}}return t},e.toObject=function(e,t){t||(t={});var n={};if((t.arrays||t.defaults)&&(n.node=[],n.initializer=[],n.input=[],n.output=[],n.valueInfo=[],n.quantizationAnnotation=[]),t.defaults&&(n.name="",n.docString=""),e.node&&e.node.length){n.node=[];for(var r=0;r<e.node.length;++r)n.node[r]=c.onnx.NodeProto.toObject(e.node[r],t)}if(null!=e.name&&e.hasOwnProperty("name")&&(n.name=e.name),e.initializer&&e.initializer.length)for(n.initializer=[],r=0;r<e.initializer.length;++r)n.initializer[r]=c.onnx.TensorProto.toObject(e.initializer[r],t);if(null!=e.docString&&e.hasOwnProperty("docString")&&(n.docString=e.docString),e.input&&e.input.length)for(n.input=[],r=0;r<e.input.length;++r)n.input[r]=c.onnx.ValueInfoProto.toObject(e.input[r],t);if(e.output&&e.output.length)for(n.output=[],r=0;r<e.output.length;++r)n.output[r]=c.onnx.ValueInfoProto.toObject(e.output[r],t);if(e.valueInfo&&e.valueInfo.length)for(n.valueInfo=[],r=0;r<e.valueInfo.length;++r)n.valueInfo[r]=c.onnx.ValueInfoProto.toObject(e.valueInfo[r],t);if(e.quantizationAnnotation&&e.quantizationAnnotation.length)for(n.quantizationAnnotation=[],r=0;r<e.quantizationAnnotation.length;++r)n.quantizationAnnotation[r]=c.onnx.TensorAnnotation.toObject(e.quantizationAnnotation[r],t);return n},e.prototype.toJSON=function(){return this.constructor.toObject(this,a.util.toJSONOptions)},e}(),i.TensorProto=function(){function e(e){if(this.dims=[],this.floatData=[],this.int32Data=[],this.stringData=[],this.int64Data=[],this.externalData=[],this.doubleData=[],this.uint64Data=[],e)for(var t=Object.keys(e),n=0;n<t.length;++n)null!=e[t[n]]&&(this[t[n]]=e[t[n]])}return e.prototype.dims=l.emptyArray,e.prototype.dataType=0,e.prototype.segment=null,e.prototype.floatData=l.emptyArray,e.prototype.int32Data=l.emptyArray,e.prototype.stringData=l.emptyArray,e.prototype.int64Data=l.emptyArray,e.prototype.name="",e.prototype.docString="",e.prototype.rawData=l.newBuffer([]),e.prototype.externalData=l.emptyArray,e.prototype.dataLocation=0,e.prototype.doubleData=l.emptyArray,e.prototype.uint64Data=l.emptyArray,e.create=function(t){return new e(t)},e.encode=function(e,t){if(t||(t=u.create()),null!=e.dims&&e.dims.length){t.uint32(10).fork();for(var n=0;n<e.dims.length;++n)t.int64(e.dims[n]);t.ldelim()}if(null!=e.dataType&&e.hasOwnProperty("dataType")&&t.uint32(16).int32(e.dataType),null!=e.segment&&e.hasOwnProperty("segment")&&c.onnx.TensorProto.Segment.encode(e.segment,t.uint32(26).fork()).ldelim(),null!=e.floatData&&e.floatData.length){for(t.uint32(34).fork(),n=0;n<e.floatData.length;++n)t.float(e.floatData[n]);t.ldelim()}if(null!=e.int32Data&&e.int32Data.length){for(t.uint32(42).fork(),n=0;n<e.int32Data.length;++n)t.int32(e.int32Data[n]);t.ldelim()}if(null!=e.stringData&&e.stringData.length)for(n=0;n<e.stringData.length;++n)t.uint32(50).bytes(e.stringData[n]);if(null!=e.int64Data&&e.int64Data.length){for(t.uint32(58).fork(),n=0;n<e.int64Data.length;++n)t.int64(e.int64Data[n]);t.ldelim()}if(null!=e.name&&e.hasOwnProperty("name")&&t.uint32(66).string(e.name),null!=e.rawData&&e.hasOwnProperty("rawData")&&t.uint32(74).bytes(e.rawData),null!=e.doubleData&&e.doubleData.length){for(t.uint32(82).fork(),n=0;n<e.doubleData.length;++n)t.double(e.doubleData[n]);t.ldelim()}if(null!=e.uint64Data&&e.uint64Data.length){for(t.uint32(90).fork(),n=0;n<e.uint64Data.length;++n)t.uint64(e.uint64Data[n]);t.ldelim()}if(null!=e.docString&&e.hasOwnProperty("docString")&&t.uint32(98).string(e.docString),null!=e.externalData&&e.externalData.length)for(n=0;n<e.externalData.length;++n)c.onnx.StringStringEntryProto.encode(e.externalData[n],t.uint32(106).fork()).ldelim();return null!=e.dataLocation&&e.hasOwnProperty("dataLocation")&&t.uint32(112).int32(e.dataLocation),t},e.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},e.decode=function(e,t){e instanceof s||(e=s.create(e));for(var n=void 0===t?e.len:e.pos+t,r=new c.onnx.TensorProto;e.pos<n;){var o=e.uint32();switch(o>>>3){case 1:if(r.dims&&r.dims.length||(r.dims=[]),2==(7&o))for(var i=e.uint32()+e.pos;e.pos<i;)r.dims.push(e.int64());else r.dims.push(e.int64());break;case 2:r.dataType=e.int32();break;case 3:r.segment=c.onnx.TensorProto.Segment.decode(e,e.uint32());break;case 4:if(r.floatData&&r.floatData.length||(r.floatData=[]),2==(7&o))for(i=e.uint32()+e.pos;e.pos<i;)r.floatData.push(e.float());else r.floatData.push(e.float());break;case 5:if(r.int32Data&&r.int32Data.length||(r.int32Data=[]),2==(7&o))for(i=e.uint32()+e.pos;e.pos<i;)r.int32Data.push(e.int32());else r.int32Data.push(e.int32());break;case 6:r.stringData&&r.stringData.length||(r.stringData=[]),r.stringData.push(e.bytes());break;case 7:if(r.int64Data&&r.int64Data.length||(r.int64Data=[]),2==(7&o))for(i=e.uint32()+e.pos;e.pos<i;)r.int64Data.push(e.int64());else r.int64Data.push(e.int64());break;case 8:r.name=e.string();break;case 12:r.docString=e.string();break;case 9:r.rawData=e.bytes();break;case 13:r.externalData&&r.externalData.length||(r.externalData=[]),r.externalData.push(c.onnx.StringStringEntryProto.decode(e,e.uint32()));break;case 14:r.dataLocation=e.int32();break;case 10:if(r.doubleData&&r.doubleData.length||(r.doubleData=[]),2==(7&o))for(i=e.uint32()+e.pos;e.pos<i;)r.doubleData.push(e.double());else r.doubleData.push(e.double());break;case 11:if(r.uint64Data&&r.uint64Data.length||(r.uint64Data=[]),2==(7&o))for(i=e.uint32()+e.pos;e.pos<i;)r.uint64Data.push(e.uint64());else r.uint64Data.push(e.uint64());break;default:e.skipType(7&o)}}return r},e.decodeDelimited=function(e){return e instanceof s||(e=new s(e)),this.decode(e,e.uint32())},e.verify=function(e){if("object"!=typeof e||null===e)return"object expected";if(null!=e.dims&&e.hasOwnProperty("dims")){if(!Array.isArray(e.dims))return"dims: array expected";for(var t=0;t<e.dims.length;++t)if(!(l.isInteger(e.dims[t])||e.dims[t]&&l.isInteger(e.dims[t].low)&&l.isInteger(e.dims[t].high)))return"dims: integer|Long[] expected"}if(null!=e.dataType&&e.hasOwnProperty("dataType")&&!l.isInteger(e.dataType))return"dataType: integer expected";if(null!=e.segment&&e.hasOwnProperty("segment")&&(n=c.onnx.TensorProto.Segment.verify(e.segment)))return"segment."+n;if(null!=e.floatData&&e.hasOwnProperty("floatData")){if(!Array.isArray(e.floatData))return"floatData: array expected";for(t=0;t<e.floatData.length;++t)if("number"!=typeof e.floatData[t])return"floatData: number[] expected"}if(null!=e.int32Data&&e.hasOwnProperty("int32Data")){if(!Array.isArray(e.int32Data))return"int32Data: array expected";for(t=0;t<e.int32Data.length;++t)if(!l.isInteger(e.int32Data[t]))return"int32Data: integer[] expected"}if(null!=e.stringData&&e.hasOwnProperty("stringData")){if(!Array.isArray(e.stringData))return"stringData: array expected";for(t=0;t<e.stringData.length;++t)if(!(e.stringData[t]&&"number"==typeof e.stringData[t].length||l.isString(e.stringData[t])))return"stringData: buffer[] expected"}if(null!=e.int64Data&&e.hasOwnProperty("int64Data")){if(!Array.isArray(e.int64Data))return"int64Data: array expected";for(t=0;t<e.int64Data.length;++t)if(!(l.isInteger(e.int64Data[t])||e.int64Data[t]&&l.isInteger(e.int64Data[t].low)&&l.isInteger(e.int64Data[t].high)))return"int64Data: integer|Long[] expected"}if(null!=e.name&&e.hasOwnProperty("name")&&!l.isString(e.name))return"name: string expected";if(null!=e.docString&&e.hasOwnProperty("docString")&&!l.isString(e.docString))return"docString: string expected";if(null!=e.rawData&&e.hasOwnProperty("rawData")&&!(e.rawData&&"number"==typeof e.rawData.length||l.isString(e.rawData)))return"rawData: buffer expected";if(null!=e.externalData&&e.hasOwnProperty("externalData")){if(!Array.isArray(e.externalData))return"externalData: array expected";for(t=0;t<e.externalData.length;++t){var n;if(n=c.onnx.StringStringEntryProto.verify(e.externalData[t]))return"externalData."+n}}if(null!=e.dataLocation&&e.hasOwnProperty("dataLocation"))switch(e.dataLocation){default:return"dataLocation: enum value expected";case 0:case 1:}if(null!=e.doubleData&&e.hasOwnProperty("doubleData")){if(!Array.isArray(e.doubleData))return"doubleData: array expected";for(t=0;t<e.doubleData.length;++t)if("number"!=typeof e.doubleData[t])return"doubleData: number[] expected"}if(null!=e.uint64Data&&e.hasOwnProperty("uint64Data")){if(!Array.isArray(e.uint64Data))return"uint64Data: array expected";for(t=0;t<e.uint64Data.length;++t)if(!(l.isInteger(e.uint64Data[t])||e.uint64Data[t]&&l.isInteger(e.uint64Data[t].low)&&l.isInteger(e.uint64Data[t].high)))return"uint64Data: integer|Long[] expected"}return null},e.fromObject=function(e){if(e instanceof c.onnx.TensorProto)return e;var t=new c.onnx.TensorProto;if(e.dims){if(!Array.isArray(e.dims))throw TypeError(".onnx.TensorProto.dims: array expected");t.dims=[];for(var n=0;n<e.dims.length;++n)l.Long?(t.dims[n]=l.Long.fromValue(e.dims[n])).unsigned=!1:"string"==typeof e.dims[n]?t.dims[n]=parseInt(e.dims[n],10):"number"==typeof e.dims[n]?t.dims[n]=e.dims[n]:"object"==typeof e.dims[n]&&(t.dims[n]=new l.LongBits(e.dims[n].low>>>0,e.dims[n].high>>>0).toNumber())}if(null!=e.dataType&&(t.dataType=0|e.dataType),null!=e.segment){if("object"!=typeof e.segment)throw TypeError(".onnx.TensorProto.segment: object expected");t.segment=c.onnx.TensorProto.Segment.fromObject(e.segment)}if(e.floatData){if(!Array.isArray(e.floatData))throw TypeError(".onnx.TensorProto.floatData: array expected");for(t.floatData=[],n=0;n<e.floatData.length;++n)t.floatData[n]=Number(e.floatData[n])}if(e.int32Data){if(!Array.isArray(e.int32Data))throw TypeError(".onnx.TensorProto.int32Data: array expected");for(t.int32Data=[],n=0;n<e.int32Data.length;++n)t.int32Data[n]=0|e.int32Data[n]}if(e.stringData){if(!Array.isArray(e.stringData))throw TypeError(".onnx.TensorProto.stringData: array expected");for(t.stringData=[],n=0;n<e.stringData.length;++n)"string"==typeof e.stringData[n]?l.base64.decode(e.stringData[n],t.stringData[n]=l.newBuffer(l.base64.length(e.stringData[n])),0):e.stringData[n].length&&(t.stringData[n]=e.stringData[n])}if(e.int64Data){if(!Array.isArray(e.int64Data))throw TypeError(".onnx.TensorProto.int64Data: array expected");for(t.int64Data=[],n=0;n<e.int64Data.length;++n)l.Long?(t.int64Data[n]=l.Long.fromValue(e.int64Data[n])).unsigned=!1:"string"==typeof e.int64Data[n]?t.int64Data[n]=parseInt(e.int64Data[n],10):"number"==typeof e.int64Data[n]?t.int64Data[n]=e.int64Data[n]:"object"==typeof e.int64Data[n]&&(t.int64Data[n]=new l.LongBits(e.int64Data[n].low>>>0,e.int64Data[n].high>>>0).toNumber())}if(null!=e.name&&(t.name=String(e.name)),null!=e.docString&&(t.docString=String(e.docString)),null!=e.rawData&&("string"==typeof e.rawData?l.base64.decode(e.rawData,t.rawData=l.newBuffer(l.base64.length(e.rawData)),0):e.rawData.length&&(t.rawData=e.rawData)),e.externalData){if(!Array.isArray(e.externalData))throw TypeError(".onnx.TensorProto.externalData: array expected");for(t.externalData=[],n=0;n<e.externalData.length;++n){if("object"!=typeof e.externalData[n])throw TypeError(".onnx.TensorProto.externalData: object expected");t.externalData[n]=c.onnx.StringStringEntryProto.fromObject(e.externalData[n])}}switch(e.dataLocation){case"DEFAULT":case 0:t.dataLocation=0;break;case"EXTERNAL":case 1:t.dataLocation=1}if(e.doubleData){if(!Array.isArray(e.doubleData))throw TypeError(".onnx.TensorProto.doubleData: array expected");for(t.doubleData=[],n=0;n<e.doubleData.length;++n)t.doubleData[n]=Number(e.doubleData[n])}if(e.uint64Data){if(!Array.isArray(e.uint64Data))throw TypeError(".onnx.TensorProto.uint64Data: array expected");for(t.uint64Data=[],n=0;n<e.uint64Data.length;++n)l.Long?(t.uint64Data[n]=l.Long.fromValue(e.uint64Data[n])).unsigned=!0:"string"==typeof e.uint64Data[n]?t.uint64Data[n]=parseInt(e.uint64Data[n],10):"number"==typeof e.uint64Data[n]?t.uint64Data[n]=e.uint64Data[n]:"object"==typeof e.uint64Data[n]&&(t.uint64Data[n]=new l.LongBits(e.uint64Data[n].low>>>0,e.uint64Data[n].high>>>0).toNumber(!0))}return t},e.toObject=function(e,t){t||(t={});var n={};if((t.arrays||t.defaults)&&(n.dims=[],n.floatData=[],n.int32Data=[],n.stringData=[],n.int64Data=[],n.doubleData=[],n.uint64Data=[],n.externalData=[]),t.defaults&&(n.dataType=0,n.segment=null,n.name="",t.bytes===String?n.rawData="":(n.rawData=[],t.bytes!==Array&&(n.rawData=l.newBuffer(n.rawData))),n.docString="",n.dataLocation=t.enums===String?"DEFAULT":0),e.dims&&e.dims.length){n.dims=[];for(var r=0;r<e.dims.length;++r)"number"==typeof e.dims[r]?n.dims[r]=t.longs===String?String(e.dims[r]):e.dims[r]:n.dims[r]=t.longs===String?l.Long.prototype.toString.call(e.dims[r]):t.longs===Number?new l.LongBits(e.dims[r].low>>>0,e.dims[r].high>>>0).toNumber():e.dims[r]}if(null!=e.dataType&&e.hasOwnProperty("dataType")&&(n.dataType=e.dataType),null!=e.segment&&e.hasOwnProperty("segment")&&(n.segment=c.onnx.TensorProto.Segment.toObject(e.segment,t)),e.floatData&&e.floatData.length)for(n.floatData=[],r=0;r<e.floatData.length;++r)n.floatData[r]=t.json&&!isFinite(e.floatData[r])?String(e.floatData[r]):e.floatData[r];if(e.int32Data&&e.int32Data.length)for(n.int32Data=[],r=0;r<e.int32Data.length;++r)n.int32Data[r]=e.int32Data[r];if(e.stringData&&e.stringData.length)for(n.stringData=[],r=0;r<e.stringData.length;++r)n.stringData[r]=t.bytes===String?l.base64.encode(e.stringData[r],0,e.stringData[r].length):t.bytes===Array?Array.prototype.slice.call(e.stringData[r]):e.stringData[r];if(e.int64Data&&e.int64Data.length)for(n.int64Data=[],r=0;r<e.int64Data.length;++r)"number"==typeof e.int64Data[r]?n.int64Data[r]=t.longs===String?String(e.int64Data[r]):e.int64Data[r]:n.int64Data[r]=t.longs===String?l.Long.prototype.toString.call(e.int64Data[r]):t.longs===Number?new l.LongBits(e.int64Data[r].low>>>0,e.int64Data[r].high>>>0).toNumber():e.int64Data[r];if(null!=e.name&&e.hasOwnProperty("name")&&(n.name=e.name),null!=e.rawData&&e.hasOwnProperty("rawData")&&(n.rawData=t.bytes===String?l.base64.encode(e.rawData,0,e.rawData.length):t.bytes===Array?Array.prototype.slice.call(e.rawData):e.rawData),e.doubleData&&e.doubleData.length)for(n.doubleData=[],r=0;r<e.doubleData.length;++r)n.doubleData[r]=t.json&&!isFinite(e.doubleData[r])?String(e.doubleData[r]):e.doubleData[r];if(e.uint64Data&&e.uint64Data.length)for(n.uint64Data=[],r=0;r<e.uint64Data.length;++r)"number"==typeof e.uint64Data[r]?n.uint64Data[r]=t.longs===String?String(e.uint64Data[r]):e.uint64Data[r]:n.uint64Data[r]=t.longs===String?l.Long.prototype.toString.call(e.uint64Data[r]):t.longs===Number?new l.LongBits(e.uint64Data[r].low>>>0,e.uint64Data[r].high>>>0).toNumber(!0):e.uint64Data[r];if(null!=e.docString&&e.hasOwnProperty("docString")&&(n.docString=e.docString),e.externalData&&e.externalData.length)for(n.externalData=[],r=0;r<e.externalData.length;++r)n.externalData[r]=c.onnx.StringStringEntryProto.toObject(e.externalData[r],t);return null!=e.dataLocation&&e.hasOwnProperty("dataLocation")&&(n.dataLocation=t.enums===String?c.onnx.TensorProto.DataLocation[e.dataLocation]:e.dataLocation),n},e.prototype.toJSON=function(){return this.constructor.toObject(this,a.util.toJSONOptions)},e.DataType=function(){var e={},t=Object.create(e);return t[e[0]="UNDEFINED"]=0,t[e[1]="FLOAT"]=1,t[e[2]="UINT8"]=2,t[e[3]="INT8"]=3,t[e[4]="UINT16"]=4,t[e[5]="INT16"]=5,t[e[6]="INT32"]=6,t[e[7]="INT64"]=7,t[e[8]="STRING"]=8,t[e[9]="BOOL"]=9,t[e[10]="FLOAT16"]=10,t[e[11]="DOUBLE"]=11,t[e[12]="UINT32"]=12,t[e[13]="UINT64"]=13,t[e[14]="COMPLEX64"]=14,t[e[15]="COMPLEX128"]=15,t[e[16]="BFLOAT16"]=16,t}(),e.Segment=function(){function e(e){if(e)for(var t=Object.keys(e),n=0;n<t.length;++n)null!=e[t[n]]&&(this[t[n]]=e[t[n]])}return e.prototype.begin=l.Long?l.Long.fromBits(0,0,!1):0,e.prototype.end=l.Long?l.Long.fromBits(0,0,!1):0,e.create=function(t){return new e(t)},e.encode=function(e,t){return t||(t=u.create()),null!=e.begin&&e.hasOwnProperty("begin")&&t.uint32(8).int64(e.begin),null!=e.end&&e.hasOwnProperty("end")&&t.uint32(16).int64(e.end),t},e.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},e.decode=function(e,t){e instanceof s||(e=s.create(e));for(var n=void 0===t?e.len:e.pos+t,r=new c.onnx.TensorProto.Segment;e.pos<n;){var o=e.uint32();switch(o>>>3){case 1:r.begin=e.int64();break;case 2:r.end=e.int64();break;default:e.skipType(7&o)}}return r},e.decodeDelimited=function(e){return e instanceof s||(e=new s(e)),this.decode(e,e.uint32())},e.verify=function(e){return"object"!=typeof e||null===e?"object expected":null!=e.begin&&e.hasOwnProperty("begin")&&!(l.isInteger(e.begin)||e.begin&&l.isInteger(e.begin.low)&&l.isInteger(e.begin.high))?"begin: integer|Long expected":null!=e.end&&e.hasOwnProperty("end")&&!(l.isInteger(e.end)||e.end&&l.isInteger(e.end.low)&&l.isInteger(e.end.high))?"end: integer|Long expected":null},e.fromObject=function(e){if(e instanceof c.onnx.TensorProto.Segment)return e;var t=new c.onnx.TensorProto.Segment;return null!=e.begin&&(l.Long?(t.begin=l.Long.fromValue(e.begin)).unsigned=!1:"string"==typeof e.begin?t.begin=parseInt(e.begin,10):"number"==typeof e.begin?t.begin=e.begin:"object"==typeof e.begin&&(t.begin=new l.LongBits(e.begin.low>>>0,e.begin.high>>>0).toNumber())),null!=e.end&&(l.Long?(t.end=l.Long.fromValue(e.end)).unsigned=!1:"string"==typeof e.end?t.end=parseInt(e.end,10):"number"==typeof e.end?t.end=e.end:"object"==typeof e.end&&(t.end=new l.LongBits(e.end.low>>>0,e.end.high>>>0).toNumber())),t},e.toObject=function(e,t){t||(t={});var n={};if(t.defaults){if(l.Long){var r=new l.Long(0,0,!1);n.begin=t.longs===String?r.toString():t.longs===Number?r.toNumber():r}else n.begin=t.longs===String?"0":0;l.Long?(r=new l.Long(0,0,!1),n.end=t.longs===String?r.toString():t.longs===Number?r.toNumber():r):n.end=t.longs===String?"0":0}return null!=e.begin&&e.hasOwnProperty("begin")&&("number"==typeof e.begin?n.begin=t.longs===String?String(e.begin):e.begin:n.begin=t.longs===String?l.Long.prototype.toString.call(e.begin):t.longs===Number?new l.LongBits(e.begin.low>>>0,e.begin.high>>>0).toNumber():e.begin),null!=e.end&&e.hasOwnProperty("end")&&("number"==typeof e.end?n.end=t.longs===String?String(e.end):e.end:n.end=t.longs===String?l.Long.prototype.toString.call(e.end):t.longs===Number?new l.LongBits(e.end.low>>>0,e.end.high>>>0).toNumber():e.end),n},e.prototype.toJSON=function(){return this.constructor.toObject(this,a.util.toJSONOptions)},e}(),e.DataLocation=function(){var e={},t=Object.create(e);return t[e[0]="DEFAULT"]=0,t[e[1]="EXTERNAL"]=1,t}(),e}(),i.TensorShapeProto=function(){function e(e){if(this.dim=[],e)for(var t=Object.keys(e),n=0;n<t.length;++n)null!=e[t[n]]&&(this[t[n]]=e[t[n]])}return e.prototype.dim=l.emptyArray,e.create=function(t){return new e(t)},e.encode=function(e,t){if(t||(t=u.create()),null!=e.dim&&e.dim.length)for(var n=0;n<e.dim.length;++n)c.onnx.TensorShapeProto.Dimension.encode(e.dim[n],t.uint32(10).fork()).ldelim();return t},e.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},e.decode=function(e,t){e instanceof s||(e=s.create(e));for(var n=void 0===t?e.len:e.pos+t,r=new c.onnx.TensorShapeProto;e.pos<n;){var o=e.uint32();o>>>3==1?(r.dim&&r.dim.length||(r.dim=[]),r.dim.push(c.onnx.TensorShapeProto.Dimension.decode(e,e.uint32()))):e.skipType(7&o)}return r},e.decodeDelimited=function(e){return e instanceof s||(e=new s(e)),this.decode(e,e.uint32())},e.verify=function(e){if("object"!=typeof e||null===e)return"object expected";if(null!=e.dim&&e.hasOwnProperty("dim")){if(!Array.isArray(e.dim))return"dim: array expected";for(var t=0;t<e.dim.length;++t){var n=c.onnx.TensorShapeProto.Dimension.verify(e.dim[t]);if(n)return"dim."+n}}return null},e.fromObject=function(e){if(e instanceof c.onnx.TensorShapeProto)return e;var t=new c.onnx.TensorShapeProto;if(e.dim){if(!Array.isArray(e.dim))throw TypeError(".onnx.TensorShapeProto.dim: array expected");t.dim=[];for(var n=0;n<e.dim.length;++n){if("object"!=typeof e.dim[n])throw TypeError(".onnx.TensorShapeProto.dim: object expected");t.dim[n]=c.onnx.TensorShapeProto.Dimension.fromObject(e.dim[n])}}return t},e.toObject=function(e,t){t||(t={});var n={};if((t.arrays||t.defaults)&&(n.dim=[]),e.dim&&e.dim.length){n.dim=[];for(var r=0;r<e.dim.length;++r)n.dim[r]=c.onnx.TensorShapeProto.Dimension.toObject(e.dim[r],t)}return n},e.prototype.toJSON=function(){return this.constructor.toObject(this,a.util.toJSONOptions)},e.Dimension=function(){function e(e){if(e)for(var t=Object.keys(e),n=0;n<t.length;++n)null!=e[t[n]]&&(this[t[n]]=e[t[n]])}var t;return e.prototype.dimValue=l.Long?l.Long.fromBits(0,0,!1):0,e.prototype.dimParam="",e.prototype.denotation="",Object.defineProperty(e.prototype,"value",{get:l.oneOfGetter(t=["dimValue","dimParam"]),set:l.oneOfSetter(t)}),e.create=function(t){return new e(t)},e.encode=function(e,t){return t||(t=u.create()),null!=e.dimValue&&e.hasOwnProperty("dimValue")&&t.uint32(8).int64(e.dimValue),null!=e.dimParam&&e.hasOwnProperty("dimParam")&&t.uint32(18).string(e.dimParam),null!=e.denotation&&e.hasOwnProperty("denotation")&&t.uint32(26).string(e.denotation),t},e.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},e.decode=function(e,t){e instanceof s||(e=s.create(e));for(var n=void 0===t?e.len:e.pos+t,r=new c.onnx.TensorShapeProto.Dimension;e.pos<n;){var o=e.uint32();switch(o>>>3){case 1:r.dimValue=e.int64();break;case 2:r.dimParam=e.string();break;case 3:r.denotation=e.string();break;default:e.skipType(7&o)}}return r},e.decodeDelimited=function(e){return e instanceof s||(e=new s(e)),this.decode(e,e.uint32())},e.verify=function(e){if("object"!=typeof e||null===e)return"object expected";var t={};if(null!=e.dimValue&&e.hasOwnProperty("dimValue")&&(t.value=1,!(l.isInteger(e.dimValue)||e.dimValue&&l.isInteger(e.dimValue.low)&&l.isInteger(e.dimValue.high))))return"dimValue: integer|Long expected";if(null!=e.dimParam&&e.hasOwnProperty("dimParam")){if(1===t.value)return"value: multiple values";if(t.value=1,!l.isString(e.dimParam))return"dimParam: string expected"}return null!=e.denotation&&e.hasOwnProperty("denotation")&&!l.isString(e.denotation)?"denotation: string expected":null},e.fromObject=function(e){if(e instanceof c.onnx.TensorShapeProto.Dimension)return e;var t=new c.onnx.TensorShapeProto.Dimension;return null!=e.dimValue&&(l.Long?(t.dimValue=l.Long.fromValue(e.dimValue)).unsigned=!1:"string"==typeof e.dimValue?t.dimValue=parseInt(e.dimValue,10):"number"==typeof e.dimValue?t.dimValue=e.dimValue:"object"==typeof e.dimValue&&(t.dimValue=new l.LongBits(e.dimValue.low>>>0,e.dimValue.high>>>0).toNumber())),null!=e.dimParam&&(t.dimParam=String(e.dimParam)),null!=e.denotation&&(t.denotation=String(e.denotation)),t},e.toObject=function(e,t){t||(t={});var n={};return t.defaults&&(n.denotation=""),null!=e.dimValue&&e.hasOwnProperty("dimValue")&&("number"==typeof e.dimValue?n.dimValue=t.longs===String?String(e.dimValue):e.dimValue:n.dimValue=t.longs===String?l.Long.prototype.toString.call(e.dimValue):t.longs===Number?new l.LongBits(e.dimValue.low>>>0,e.dimValue.high>>>0).toNumber():e.dimValue,t.oneofs&&(n.value="dimValue")),null!=e.dimParam&&e.hasOwnProperty("dimParam")&&(n.dimParam=e.dimParam,t.oneofs&&(n.value="dimParam")),null!=e.denotation&&e.hasOwnProperty("denotation")&&(n.denotation=e.denotation),n},e.prototype.toJSON=function(){return this.constructor.toObject(this,a.util.toJSONOptions)},e}(),e}(),i.TypeProto=function(){function e(e){if(e)for(var t=Object.keys(e),n=0;n<t.length;++n)null!=e[t[n]]&&(this[t[n]]=e[t[n]])}var t;return e.prototype.tensorType=null,e.prototype.denotation="",Object.defineProperty(e.prototype,"value",{get:l.oneOfGetter(t=["tensorType"]),set:l.oneOfSetter(t)}),e.create=function(t){return new e(t)},e.encode=function(e,t){return t||(t=u.create()),null!=e.tensorType&&e.hasOwnProperty("tensorType")&&c.onnx.TypeProto.Tensor.encode(e.tensorType,t.uint32(10).fork()).ldelim(),null!=e.denotation&&e.hasOwnProperty("denotation")&&t.uint32(50).string(e.denotation),t},e.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},e.decode=function(e,t){e instanceof s||(e=s.create(e));for(var n=void 0===t?e.len:e.pos+t,r=new c.onnx.TypeProto;e.pos<n;){var o=e.uint32();switch(o>>>3){case 1:r.tensorType=c.onnx.TypeProto.Tensor.decode(e,e.uint32());break;case 6:r.denotation=e.string();break;default:e.skipType(7&o)}}return r},e.decodeDelimited=function(e){return e instanceof s||(e=new s(e)),this.decode(e,e.uint32())},e.verify=function(e){if("object"!=typeof e||null===e)return"object expected";if(null!=e.tensorType&&e.hasOwnProperty("tensorType")){var t=c.onnx.TypeProto.Tensor.verify(e.tensorType);if(t)return"tensorType."+t}return null!=e.denotation&&e.hasOwnProperty("denotation")&&!l.isString(e.denotation)?"denotation: string expected":null},e.fromObject=function(e){if(e instanceof c.onnx.TypeProto)return e;var t=new c.onnx.TypeProto;if(null!=e.tensorType){if("object"!=typeof e.tensorType)throw TypeError(".onnx.TypeProto.tensorType: object expected");t.tensorType=c.onnx.TypeProto.Tensor.fromObject(e.tensorType)}return null!=e.denotation&&(t.denotation=String(e.denotation)),t},e.toObject=function(e,t){t||(t={});var n={};return t.defaults&&(n.denotation=""),null!=e.tensorType&&e.hasOwnProperty("tensorType")&&(n.tensorType=c.onnx.TypeProto.Tensor.toObject(e.tensorType,t),t.oneofs&&(n.value="tensorType")),null!=e.denotation&&e.hasOwnProperty("denotation")&&(n.denotation=e.denotation),n},e.prototype.toJSON=function(){return this.constructor.toObject(this,a.util.toJSONOptions)},e.Tensor=function(){function e(e){if(e)for(var t=Object.keys(e),n=0;n<t.length;++n)null!=e[t[n]]&&(this[t[n]]=e[t[n]])}return e.prototype.elemType=0,e.prototype.shape=null,e.create=function(t){return new e(t)},e.encode=function(e,t){return t||(t=u.create()),null!=e.elemType&&e.hasOwnProperty("elemType")&&t.uint32(8).int32(e.elemType),null!=e.shape&&e.hasOwnProperty("shape")&&c.onnx.TensorShapeProto.encode(e.shape,t.uint32(18).fork()).ldelim(),t},e.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},e.decode=function(e,t){e instanceof s||(e=s.create(e));for(var n=void 0===t?e.len:e.pos+t,r=new c.onnx.TypeProto.Tensor;e.pos<n;){var o=e.uint32();switch(o>>>3){case 1:r.elemType=e.int32();break;case 2:r.shape=c.onnx.TensorShapeProto.decode(e,e.uint32());break;default:e.skipType(7&o)}}return r},e.decodeDelimited=function(e){return e instanceof s||(e=new s(e)),this.decode(e,e.uint32())},e.verify=function(e){if("object"!=typeof e||null===e)return"object expected";if(null!=e.elemType&&e.hasOwnProperty("elemType")&&!l.isInteger(e.elemType))return"elemType: integer expected";if(null!=e.shape&&e.hasOwnProperty("shape")){var t=c.onnx.TensorShapeProto.verify(e.shape);if(t)return"shape."+t}return null},e.fromObject=function(e){if(e instanceof c.onnx.TypeProto.Tensor)return e;var t=new c.onnx.TypeProto.Tensor;if(null!=e.elemType&&(t.elemType=0|e.elemType),null!=e.shape){if("object"!=typeof e.shape)throw TypeError(".onnx.TypeProto.Tensor.shape: object expected");t.shape=c.onnx.TensorShapeProto.fromObject(e.shape)}return t},e.toObject=function(e,t){t||(t={});var n={};return t.defaults&&(n.elemType=0,n.shape=null),null!=e.elemType&&e.hasOwnProperty("elemType")&&(n.elemType=e.elemType),null!=e.shape&&e.hasOwnProperty("shape")&&(n.shape=c.onnx.TensorShapeProto.toObject(e.shape,t)),n},e.prototype.toJSON=function(){return this.constructor.toObject(this,a.util.toJSONOptions)},e}(),e}(),i.OperatorSetIdProto=function(){function e(e){if(e)for(var t=Object.keys(e),n=0;n<t.length;++n)null!=e[t[n]]&&(this[t[n]]=e[t[n]])}return e.prototype.domain="",e.prototype.version=l.Long?l.Long.fromBits(0,0,!1):0,e.create=function(t){return new e(t)},e.encode=function(e,t){return t||(t=u.create()),null!=e.domain&&e.hasOwnProperty("domain")&&t.uint32(10).string(e.domain),null!=e.version&&e.hasOwnProperty("version")&&t.uint32(16).int64(e.version),t},e.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},e.decode=function(e,t){e instanceof s||(e=s.create(e));for(var n=void 0===t?e.len:e.pos+t,r=new c.onnx.OperatorSetIdProto;e.pos<n;){var o=e.uint32();switch(o>>>3){case 1:r.domain=e.string();break;case 2:r.version=e.int64();break;default:e.skipType(7&o)}}return r},e.decodeDelimited=function(e){return e instanceof s||(e=new s(e)),this.decode(e,e.uint32())},e.verify=function(e){return"object"!=typeof e||null===e?"object expected":null!=e.domain&&e.hasOwnProperty("domain")&&!l.isString(e.domain)?"domain: string expected":null!=e.version&&e.hasOwnProperty("version")&&!(l.isInteger(e.version)||e.version&&l.isInteger(e.version.low)&&l.isInteger(e.version.high))?"version: integer|Long expected":null},e.fromObject=function(e){if(e instanceof c.onnx.OperatorSetIdProto)return e;var t=new c.onnx.OperatorSetIdProto;return null!=e.domain&&(t.domain=String(e.domain)),null!=e.version&&(l.Long?(t.version=l.Long.fromValue(e.version)).unsigned=!1:"string"==typeof e.version?t.version=parseInt(e.version,10):"number"==typeof e.version?t.version=e.version:"object"==typeof e.version&&(t.version=new l.LongBits(e.version.low>>>0,e.version.high>>>0).toNumber())),t},e.toObject=function(e,t){t||(t={});var n={};if(t.defaults)if(n.domain="",l.Long){var r=new l.Long(0,0,!1);n.version=t.longs===String?r.toString():t.longs===Number?r.toNumber():r}else n.version=t.longs===String?"0":0;return null!=e.domain&&e.hasOwnProperty("domain")&&(n.domain=e.domain),null!=e.version&&e.hasOwnProperty("version")&&("number"==typeof e.version?n.version=t.longs===String?String(e.version):e.version:n.version=t.longs===String?l.Long.prototype.toString.call(e.version):t.longs===Number?new l.LongBits(e.version.low>>>0,e.version.high>>>0).toNumber():e.version),n},e.prototype.toJSON=function(){return this.constructor.toObject(this,a.util.toJSONOptions)},e}(),i),e.exports=c},2100:(e,t,n)=>{"use strict";e.exports=n(9482)},9482:(e,t,n)=>{"use strict";var r=t;function o(){r.util._configure(),r.Writer._configure(r.BufferWriter),r.Reader._configure(r.BufferReader)}r.build="minimal",r.Writer=n(1173),r.BufferWriter=n(3155),r.Reader=n(1408),r.BufferReader=n(593),r.util=n(9693),r.rpc=n(5994),r.roots=n(5054),r.configure=o,o()},1408:(e,t,n)=>{"use strict";e.exports=u;var r,o=n(9693),i=o.LongBits,a=o.utf8;function s(e,t){return RangeError("index out of range: "+e.pos+" + "+(t||1)+" > "+e.len)}function u(e){this.buf=e,this.pos=0,this.len=e.length}var l,c="undefined"!=typeof Uint8Array?function(e){if(e instanceof Uint8Array||Array.isArray(e))return new u(e);throw Error("illegal buffer")}:function(e){if(Array.isArray(e))return new u(e);throw Error("illegal buffer")},p=function(){return o.Buffer?function(e){return(u.create=function(e){return o.Buffer.isBuffer(e)?new r(e):c(e)})(e)}:c};function d(){var e=new i(0,0),t=0;if(!(this.len-this.pos>4)){for(;t<3;++t){if(this.pos>=this.len)throw s(this);if(e.lo=(e.lo|(127&this.buf[this.pos])<<7*t)>>>0,this.buf[this.pos++]<128)return e}return e.lo=(e.lo|(127&this.buf[this.pos++])<<7*t)>>>0,e}for(;t<4;++t)if(e.lo=(e.lo|(127&this.buf[this.pos])<<7*t)>>>0,this.buf[this.pos++]<128)return e;if(e.lo=(e.lo|(127&this.buf[this.pos])<<28)>>>0,e.hi=(e.hi|(127&this.buf[this.pos])>>4)>>>0,this.buf[this.pos++]<128)return e;if(t=0,this.len-this.pos>4){for(;t<5;++t)if(e.hi=(e.hi|(127&this.buf[this.pos])<<7*t+3)>>>0,this.buf[this.pos++]<128)return e}else for(;t<5;++t){if(this.pos>=this.len)throw s(this);if(e.hi=(e.hi|(127&this.buf[this.pos])<<7*t+3)>>>0,this.buf[this.pos++]<128)return e}throw Error("invalid varint encoding")}function f(e,t){return(e[t-4]|e[t-3]<<8|e[t-2]<<16|e[t-1]<<24)>>>0}function h(){if(this.pos+8>this.len)throw s(this,8);return new i(f(this.buf,this.pos+=4),f(this.buf,this.pos+=4))}u.create=p(),u.prototype._slice=o.Array.prototype.subarray||o.Array.prototype.slice,u.prototype.uint32=(l=4294967295,function(){if(l=(127&this.buf[this.pos])>>>0,this.buf[this.pos++]<128)return l;if(l=(l|(127&this.buf[this.pos])<<7)>>>0,this.buf[this.pos++]<128)return l;if(l=(l|(127&this.buf[this.pos])<<14)>>>0,this.buf[this.pos++]<128)return l;if(l=(l|(127&this.buf[this.pos])<<21)>>>0,this.buf[this.pos++]<128)return l;if(l=(l|(15&this.buf[this.pos])<<28)>>>0,this.buf[this.pos++]<128)return l;if((this.pos+=5)>this.len)throw this.pos=this.len,s(this,10);return l}),u.prototype.int32=function(){return 0|this.uint32()},u.prototype.sint32=function(){var e=this.uint32();return e>>>1^-(1&e)|0},u.prototype.bool=function(){return 0!==this.uint32()},u.prototype.fixed32=function(){if(this.pos+4>this.len)throw s(this,4);return f(this.buf,this.pos+=4)},u.prototype.sfixed32=function(){if(this.pos+4>this.len)throw s(this,4);return 0|f(this.buf,this.pos+=4)},u.prototype.float=function(){if(this.pos+4>this.len)throw s(this,4);var e=o.float.readFloatLE(this.buf,this.pos);return this.pos+=4,e},u.prototype.double=function(){if(this.pos+8>this.len)throw s(this,4);var e=o.float.readDoubleLE(this.buf,this.pos);return this.pos+=8,e},u.prototype.bytes=function(){var e=this.uint32(),t=this.pos,n=this.pos+e;if(n>this.len)throw s(this,e);return this.pos+=e,Array.isArray(this.buf)?this.buf.slice(t,n):t===n?new this.buf.constructor(0):this._slice.call(this.buf,t,n)},u.prototype.string=function(){var e=this.bytes();return a.read(e,0,e.length)},u.prototype.skip=function(e){if("number"==typeof e){if(this.pos+e>this.len)throw s(this,e);this.pos+=e}else do{if(this.pos>=this.len)throw s(this)}while(128&this.buf[this.pos++]);return this},u.prototype.skipType=function(e){switch(e){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());break;case 3:for(;4!=(e=7&this.uint32());)this.skipType(e);break;case 5:this.skip(4);break;default:throw Error("invalid wire type "+e+" at offset "+this.pos)}return this},u._configure=function(e){r=e,u.create=p(),r._configure();var t=o.Long?"toLong":"toNumber";o.merge(u.prototype,{int64:function(){return d.call(this)[t](!1)},uint64:function(){return d.call(this)[t](!0)},sint64:function(){return d.call(this).zzDecode()[t](!1)},fixed64:function(){return h.call(this)[t](!0)},sfixed64:function(){return h.call(this)[t](!1)}})}},593:(e,t,n)=>{"use strict";e.exports=i;var r=n(1408);(i.prototype=Object.create(r.prototype)).constructor=i;var o=n(9693);function i(e){r.call(this,e)}i._configure=function(){o.Buffer&&(i.prototype._slice=o.Buffer.prototype.slice)},i.prototype.string=function(){var e=this.uint32();return this.buf.utf8Slice?this.buf.utf8Slice(this.pos,this.pos=Math.min(this.pos+e,this.len)):this.buf.toString("utf-8",this.pos,this.pos=Math.min(this.pos+e,this.len))},i._configure()},5054:e=>{"use strict";e.exports={}},5994:(e,t,n)=>{"use strict";t.Service=n(7948)},7948:(e,t,n)=>{"use strict";e.exports=o;var r=n(9693);function o(e,t,n){if("function"!=typeof e)throw TypeError("rpcImpl must be a function");r.EventEmitter.call(this),this.rpcImpl=e,this.requestDelimited=Boolean(t),this.responseDelimited=Boolean(n)}(o.prototype=Object.create(r.EventEmitter.prototype)).constructor=o,o.prototype.rpcCall=function e(t,n,o,i,a){if(!i)throw TypeError("request must be specified");var s=this;if(!a)return r.asPromise(e,s,t,n,o,i);if(s.rpcImpl)try{return s.rpcImpl(t,n[s.requestDelimited?"encodeDelimited":"encode"](i).finish(),(function(e,n){if(e)return s.emit("error",e,t),a(e);if(null!==n){if(!(n instanceof o))try{n=o[s.responseDelimited?"decodeDelimited":"decode"](n)}catch(e){return s.emit("error",e,t),a(e)}return s.emit("data",n,t),a(null,n)}s.end(!0)}))}catch(e){return s.emit("error",e,t),void setTimeout((function(){a(e)}),0)}else setTimeout((function(){a(Error("already ended"))}),0)},o.prototype.end=function(e){return this.rpcImpl&&(e||this.rpcImpl(null,null,null),this.rpcImpl=null,this.emit("end").off()),this}},1945:(e,t,n)=>{"use strict";e.exports=o;var r=n(9693);function o(e,t){this.lo=e>>>0,this.hi=t>>>0}var i=o.zero=new o(0,0);i.toNumber=function(){return 0},i.zzEncode=i.zzDecode=function(){return this},i.length=function(){return 1};var a=o.zeroHash="\0\0\0\0\0\0\0\0";o.fromNumber=function(e){if(0===e)return i;var t=e<0;t&&(e=-e);var n=e>>>0,r=(e-n)/4294967296>>>0;return t&&(r=~r>>>0,n=~n>>>0,++n>4294967295&&(n=0,++r>4294967295&&(r=0))),new o(n,r)},o.from=function(e){if("number"==typeof e)return o.fromNumber(e);if(r.isString(e)){if(!r.Long)return o.fromNumber(parseInt(e,10));e=r.Long.fromString(e)}return e.low||e.high?new o(e.low>>>0,e.high>>>0):i},o.prototype.toNumber=function(e){if(!e&&this.hi>>>31){var t=1+~this.lo>>>0,n=~this.hi>>>0;return t||(n=n+1>>>0),-(t+4294967296*n)}return this.lo+4294967296*this.hi},o.prototype.toLong=function(e){return r.Long?new r.Long(0|this.lo,0|this.hi,Boolean(e)):{low:0|this.lo,high:0|this.hi,unsigned:Boolean(e)}};var s=String.prototype.charCodeAt;o.fromHash=function(e){return e===a?i:new o((s.call(e,0)|s.call(e,1)<<8|s.call(e,2)<<16|s.call(e,3)<<24)>>>0,(s.call(e,4)|s.call(e,5)<<8|s.call(e,6)<<16|s.call(e,7)<<24)>>>0)},o.prototype.toHash=function(){return String.fromCharCode(255&this.lo,this.lo>>>8&255,this.lo>>>16&255,this.lo>>>24,255&this.hi,this.hi>>>8&255,this.hi>>>16&255,this.hi>>>24)},o.prototype.zzEncode=function(){var e=this.hi>>31;return this.hi=((this.hi<<1|this.lo>>>31)^e)>>>0,this.lo=(this.lo<<1^e)>>>0,this},o.prototype.zzDecode=function(){var e=-(1&this.lo);return this.lo=((this.lo>>>1|this.hi<<31)^e)>>>0,this.hi=(this.hi>>>1^e)>>>0,this},o.prototype.length=function(){var e=this.lo,t=(this.lo>>>28|this.hi<<4)>>>0,n=this.hi>>>24;return 0===n?0===t?e<16384?e<128?1:2:e<2097152?3:4:t<16384?t<128?5:6:t<2097152?7:8:n<128?9:10}},9693:function(e,t,n){"use strict";var r=t;function o(e,t,n){for(var r=Object.keys(t),o=0;o<r.length;++o)void 0!==e[r[o]]&&n||(e[r[o]]=t[r[o]]);return e}function i(e){function t(e,n){if(!(this instanceof t))return new t(e,n);Object.defineProperty(this,"message",{get:function(){return e}}),Error.captureStackTrace?Error.captureStackTrace(this,t):Object.defineProperty(this,"stack",{value:(new Error).stack||""}),n&&o(this,n)}return(t.prototype=Object.create(Error.prototype)).constructor=t,Object.defineProperty(t.prototype,"name",{get:function(){return e}}),t.prototype.toString=function(){return this.name+": "+this.message},t}r.asPromise=n(4537),r.base64=n(7419),r.EventEmitter=n(9211),r.float=n(945),r.inquire=n(7199),r.utf8=n(4997),r.pool=n(6662),r.LongBits=n(1945),r.isNode=Boolean(void 0!==n.g&&n.g&&n.g.process&&n.g.process.versions&&n.g.process.versions.node),r.global=r.isNode&&n.g||"undefined"!=typeof window&&window||"undefined"!=typeof self&&self||this,r.emptyArray=Object.freeze?Object.freeze([]):[],r.emptyObject=Object.freeze?Object.freeze({}):{},r.isInteger=Number.isInteger||function(e){return"number"==typeof e&&isFinite(e)&&Math.floor(e)===e},r.isString=function(e){return"string"==typeof e||e instanceof String},r.isObject=function(e){return e&&"object"==typeof e},r.isset=r.isSet=function(e,t){var n=e[t];return!(null==n||!e.hasOwnProperty(t))&&("object"!=typeof n||(Array.isArray(n)?n.length:Object.keys(n).length)>0)},r.Buffer=function(){try{var e=r.inquire("buffer").Buffer;return e.prototype.utf8Write?e:null}catch(e){return null}}(),r._Buffer_from=null,r._Buffer_allocUnsafe=null,r.newBuffer=function(e){return"number"==typeof e?r.Buffer?r._Buffer_allocUnsafe(e):new r.Array(e):r.Buffer?r._Buffer_from(e):"undefined"==typeof Uint8Array?e:new Uint8Array(e)},r.Array="undefined"!=typeof Uint8Array?Uint8Array:Array,r.Long=r.global.dcodeIO&&r.global.dcodeIO.Long||r.global.Long||r.inquire("long"),r.key2Re=/^true|false|0|1$/,r.key32Re=/^-?(?:0|[1-9][0-9]*)$/,r.key64Re=/^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/,r.longToHash=function(e){return e?r.LongBits.from(e).toHash():r.LongBits.zeroHash},r.longFromHash=function(e,t){var n=r.LongBits.fromHash(e);return r.Long?r.Long.fromBits(n.lo,n.hi,t):n.toNumber(Boolean(t))},r.merge=o,r.lcFirst=function(e){return e.charAt(0).toLowerCase()+e.substring(1)},r.newError=i,r.ProtocolError=i("ProtocolError"),r.oneOfGetter=function(e){for(var t={},n=0;n<e.length;++n)t[e[n]]=1;return function(){for(var e=Object.keys(this),n=e.length-1;n>-1;--n)if(1===t[e[n]]&&void 0!==this[e[n]]&&null!==this[e[n]])return e[n]}},r.oneOfSetter=function(e){return function(t){for(var n=0;n<e.length;++n)e[n]!==t&&delete this[e[n]]}},r.toJSONOptions={longs:String,enums:String,bytes:String,json:!0},r._configure=function(){var e=r.Buffer;e?(r._Buffer_from=e.from!==Uint8Array.from&&e.from||function(t,n){return new e(t,n)},r._Buffer_allocUnsafe=e.allocUnsafe||function(t){return new e(t)}):r._Buffer_from=r._Buffer_allocUnsafe=null}},1173:(e,t,n)=>{"use strict";e.exports=p;var r,o=n(9693),i=o.LongBits,a=o.base64,s=o.utf8;function u(e,t,n){this.fn=e,this.len=t,this.next=void 0,this.val=n}function l(){}function c(e){this.head=e.head,this.tail=e.tail,this.len=e.len,this.next=e.states}function p(){this.len=0,this.head=new u(l,0,0),this.tail=this.head,this.states=null}var d=function(){return o.Buffer?function(){return(p.create=function(){return new r})()}:function(){return new p}};function f(e,t,n){t[n]=255&e}function h(e,t){this.len=e,this.next=void 0,this.val=t}function g(e,t,n){for(;e.hi;)t[n++]=127&e.lo|128,e.lo=(e.lo>>>7|e.hi<<25)>>>0,e.hi>>>=7;for(;e.lo>127;)t[n++]=127&e.lo|128,e.lo=e.lo>>>7;t[n++]=e.lo}function m(e,t,n){t[n]=255&e,t[n+1]=e>>>8&255,t[n+2]=e>>>16&255,t[n+3]=e>>>24}p.create=d(),p.alloc=function(e){return new o.Array(e)},o.Array!==Array&&(p.alloc=o.pool(p.alloc,o.Array.prototype.subarray)),p.prototype._push=function(e,t,n){return this.tail=this.tail.next=new u(e,t,n),this.len+=t,this},h.prototype=Object.create(u.prototype),h.prototype.fn=function(e,t,n){for(;e>127;)t[n++]=127&e|128,e>>>=7;t[n]=e},p.prototype.uint32=function(e){return this.len+=(this.tail=this.tail.next=new h((e>>>=0)<128?1:e<16384?2:e<2097152?3:e<268435456?4:5,e)).len,this},p.prototype.int32=function(e){return e<0?this._push(g,10,i.fromNumber(e)):this.uint32(e)},p.prototype.sint32=function(e){return this.uint32((e<<1^e>>31)>>>0)},p.prototype.uint64=function(e){var t=i.from(e);return this._push(g,t.length(),t)},p.prototype.int64=p.prototype.uint64,p.prototype.sint64=function(e){var t=i.from(e).zzEncode();return this._push(g,t.length(),t)},p.prototype.bool=function(e){return this._push(f,1,e?1:0)},p.prototype.fixed32=function(e){return this._push(m,4,e>>>0)},p.prototype.sfixed32=p.prototype.fixed32,p.prototype.fixed64=function(e){var t=i.from(e);return this._push(m,4,t.lo)._push(m,4,t.hi)},p.prototype.sfixed64=p.prototype.fixed64,p.prototype.float=function(e){return this._push(o.float.writeFloatLE,4,e)},p.prototype.double=function(e){return this._push(o.float.writeDoubleLE,8,e)};var b=o.Array.prototype.set?function(e,t,n){t.set(e,n)}:function(e,t,n){for(var r=0;r<e.length;++r)t[n+r]=e[r]};p.prototype.bytes=function(e){var t=e.length>>>0;if(!t)return this._push(f,1,0);if(o.isString(e)){var n=p.alloc(t=a.length(e));a.decode(e,n,0),e=n}return this.uint32(t)._push(b,t,e)},p.prototype.string=function(e){var t=s.length(e);return t?this.uint32(t)._push(s.write,t,e):this._push(f,1,0)},p.prototype.fork=function(){return this.states=new c(this),this.head=this.tail=new u(l,0,0),this.len=0,this},p.prototype.reset=function(){return this.states?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):(this.head=this.tail=new u(l,0,0),this.len=0),this},p.prototype.ldelim=function(){var e=this.head,t=this.tail,n=this.len;return this.reset().uint32(n),n&&(this.tail.next=e.next,this.tail=t,this.len+=n),this},p.prototype.finish=function(){for(var e=this.head.next,t=this.constructor.alloc(this.len),n=0;e;)e.fn(e.val,t,n),n+=e.len,e=e.next;return t},p._configure=function(e){r=e,p.create=d(),r._configure()}},3155:(e,t,n)=>{"use strict";e.exports=i;var r=n(1173);(i.prototype=Object.create(r.prototype)).constructor=i;var o=n(9693);function i(){r.call(this)}function a(e,t,n){e.length<40?o.utf8.write(e,t,n):t.utf8Write?t.utf8Write(e,n):t.write(e,n)}i._configure=function(){i.alloc=o._Buffer_allocUnsafe,i.writeBytesBuffer=o.Buffer&&o.Buffer.prototype instanceof Uint8Array&&"set"===o.Buffer.prototype.set.name?function(e,t,n){t.set(e,n)}:function(e,t,n){if(e.copy)e.copy(t,n,0,e.length);else for(var r=0;r<e.length;)t[n++]=e[r++]}},i.prototype.bytes=function(e){o.isString(e)&&(e=o._Buffer_from(e,"base64"));var t=e.length>>>0;return this.uint32(t),t&&this._push(i.writeBytesBuffer,t,e),this},i.prototype.string=function(e){var t=o.Buffer.byteLength(e);return this.uint32(t),t&&this._push(a,t,e),this},i._configure()},4154:e=>{"use strict";e.exports='"use strict";var e={},t="object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node;if(t){var r=require("worker_threads"),a=r.parentPort;a.on("message",(e=>onmessage({data:e})));var o=require("fs");Object.assign(global,{self:global,require:require,Module:e,location:{href:__filename},Worker:r.Worker,importScripts:function(e){(0,eval)(o.readFileSync(e,"utf8"))},postMessage:function(e){a.postMessage(e)},performance:global.performance||{now:function(){return Date.now()}}})}var s=!1,n=[],i=function(){var e=Array.prototype.slice.call(arguments).join(" ");t?o.writeSync(2,e+"\\n"):console.error(e)};self.alert=function(){var t=Array.prototype.slice.call(arguments).join(" ");postMessage({cmd:"alert",text:t,threadId:e._pthread_self()})},e.instantiateWasm=(t,r)=>{var a=new WebAssembly.Instance(e.wasmModule,t);return r(a),e.wasmModule=null,a.exports},self.onunhandledrejection=e=>{throw e.reason??e},self.onmessage=t=>{try{if("load"===t.data.cmd){if(e.wasmModule=t.data.wasmModule,e.wasmMemory=t.data.wasmMemory,e.buffer=e.wasmMemory.buffer,e.ENVIRONMENT_IS_PTHREAD=!0,"string"==typeof t.data.urlOrBlob)importScripts(t.data.urlOrBlob);else{var r=URL.createObjectURL(t.data.urlOrBlob);importScripts(r),URL.revokeObjectURL(r)}ortWasmThreaded(e).then((function(t){e=t}))}else if("run"===t.data.cmd){e.__performance_now_clock_drift=performance.now()-t.data.time,e.__emscripten_thread_init(t.data.pthread_ptr,0,0,1),e.establishStackSpace(),e.PThread.receiveObjectTransfer(t.data),e.PThread.threadInitTLS(),s||(n.forEach((t=>{e.executeNotifiedProxyingQueue(t)})),n=[],s=!0);try{e.invokeEntryPoint(t.data.start_routine,t.data.arg)}catch(t){if("unwind"!=t){if(!(t instanceof e.ExitStatus))throw t;e.keepRuntimeAlive()||e.__emscripten_thread_exit(t.status)}}}else"cancel"===t.data.cmd?e._pthread_self()&&e.__emscripten_thread_exit(-1):"setimmediate"===t.data.target||("processProxyingQueue"===t.data.cmd?s?e.executeNotifiedProxyingQueue(t.data.queue):n.push(t.data.queue):(i("worker.js received unknown command "+t.data.cmd),i(t.data)))}catch(t){throw i("worker.js onmessage() captured an uncaught exception: "+t),t&&t.stack&&i(t.stack),e.__emscripten_thread_crashed&&e.__emscripten_thread_crashed(),t}};\n'},7067:()=>{},1296:()=>{},760:()=>{},1384:()=>{},3993:()=>{},908:()=>{},6953:()=>{},9925:()=>{},2806:()=>{},6449:()=>{},2850:()=>{},5381:()=>{},5686:(e,t,n)=>{"use strict";n.r(t),n.d(t,{flatbuffers:()=>r});var r={};r.Offset,r.Table,r.SIZEOF_SHORT=2,r.SIZEOF_INT=4,r.FILE_IDENTIFIER_LENGTH=4,r.SIZE_PREFIX_LENGTH=4,r.Encoding={UTF8_BYTES:1,UTF16_STRING:2},r.int32=new Int32Array(2),r.float32=new Float32Array(r.int32.buffer),r.float64=new Float64Array(r.int32.buffer),r.isLittleEndian=1===new Uint16Array(new Uint8Array([1,0]).buffer)[0],r.Long=function(e,t){this.low=0|e,this.high=0|t},r.Long.create=function(e,t){return 0==e&&0==t?r.Long.ZERO:new r.Long(e,t)},r.Long.prototype.toFloat64=function(){return(this.low>>>0)+4294967296*this.high},r.Long.prototype.equals=function(e){return this.low==e.low&&this.high==e.high},r.Long.ZERO=new r.Long(0,0),r.Builder=function(e){if(e)t=e;else var t=1024;this.bb=r.ByteBuffer.allocate(t),this.space=t,this.minalign=1,this.vtable=null,this.vtable_in_use=0,this.isNested=!1,this.object_start=0,this.vtables=[],this.vector_num_elems=0,this.force_defaults=!1},r.Builder.prototype.clear=function(){this.bb.clear(),this.space=this.bb.capacity(),this.minalign=1,this.vtable=null,this.vtable_in_use=0,this.isNested=!1,this.object_start=0,this.vtables=[],this.vector_num_elems=0,this.force_defaults=!1},r.Builder.prototype.forceDefaults=function(e){this.force_defaults=e},r.Builder.prototype.dataBuffer=function(){return this.bb},r.Builder.prototype.asUint8Array=function(){return this.bb.bytes().subarray(this.bb.position(),this.bb.position()+this.offset())},r.Builder.prototype.prep=function(e,t){e>this.minalign&&(this.minalign=e);for(var n=1+~(this.bb.capacity()-this.space+t)&e-1;this.space<n+e+t;){var o=this.bb.capacity();this.bb=r.Builder.growByteBuffer(this.bb),this.space+=this.bb.capacity()-o}this.pad(n)},r.Builder.prototype.pad=function(e){for(var t=0;t<e;t++)this.bb.writeInt8(--this.space,0)},r.Builder.prototype.writeInt8=function(e){this.bb.writeInt8(this.space-=1,e)},r.Builder.prototype.writeInt16=function(e){this.bb.writeInt16(this.space-=2,e)},r.Builder.prototype.writeInt32=function(e){this.bb.writeInt32(this.space-=4,e)},r.Builder.prototype.writeInt64=function(e){this.bb.writeInt64(this.space-=8,e)},r.Builder.prototype.writeFloat32=function(e){this.bb.writeFloat32(this.space-=4,e)},r.Builder.prototype.writeFloat64=function(e){this.bb.writeFloat64(this.space-=8,e)},r.Builder.prototype.addInt8=function(e){this.prep(1,0),this.writeInt8(e)},r.Builder.prototype.addInt16=function(e){this.prep(2,0),this.writeInt16(e)},r.Builder.prototype.addInt32=function(e){this.prep(4,0),this.writeInt32(e)},r.Builder.prototype.addInt64=function(e){this.prep(8,0),this.writeInt64(e)},r.Builder.prototype.addFloat32=function(e){this.prep(4,0),this.writeFloat32(e)},r.Builder.prototype.addFloat64=function(e){this.prep(8,0),this.writeFloat64(e)},r.Builder.prototype.addFieldInt8=function(e,t,n){(this.force_defaults||t!=n)&&(this.addInt8(t),this.slot(e))},r.Builder.prototype.addFieldInt16=function(e,t,n){(this.force_defaults||t!=n)&&(this.addInt16(t),this.slot(e))},r.Builder.prototype.addFieldInt32=function(e,t,n){(this.force_defaults||t!=n)&&(this.addInt32(t),this.slot(e))},r.Builder.prototype.addFieldInt64=function(e,t,n){!this.force_defaults&&t.equals(n)||(this.addInt64(t),this.slot(e))},r.Builder.prototype.addFieldFloat32=function(e,t,n){(this.force_defaults||t!=n)&&(this.addFloat32(t),this.slot(e))},r.Builder.prototype.addFieldFloat64=function(e,t,n){(this.force_defaults||t!=n)&&(this.addFloat64(t),this.slot(e))},r.Builder.prototype.addFieldOffset=function(e,t,n){(this.force_defaults||t!=n)&&(this.addOffset(t),this.slot(e))},r.Builder.prototype.addFieldStruct=function(e,t,n){t!=n&&(this.nested(t),this.slot(e))},r.Builder.prototype.nested=function(e){if(e!=this.offset())throw new Error("FlatBuffers: struct must be serialized inline.")},r.Builder.prototype.notNested=function(){if(this.isNested)throw new Error("FlatBuffers: object serialization must not be nested.")},r.Builder.prototype.slot=function(e){this.vtable[e]=this.offset()},r.Builder.prototype.offset=function(){return this.bb.capacity()-this.space},r.Builder.growByteBuffer=function(e){var t=e.capacity();if(3221225472&t)throw new Error("FlatBuffers: cannot grow buffer beyond 2 gigabytes.");var n=t<<1,o=r.ByteBuffer.allocate(n);return o.setPosition(n-t),o.bytes().set(e.bytes(),n-t),o},r.Builder.prototype.addOffset=function(e){this.prep(r.SIZEOF_INT,0),this.writeInt32(this.offset()-e+r.SIZEOF_INT)},r.Builder.prototype.startObject=function(e){this.notNested(),null==this.vtable&&(this.vtable=[]),this.vtable_in_use=e;for(var t=0;t<e;t++)this.vtable[t]=0;this.isNested=!0,this.object_start=this.offset()},r.Builder.prototype.endObject=function(){if(null==this.vtable||!this.isNested)throw new Error("FlatBuffers: endObject called without startObject");this.addInt32(0);for(var e=this.offset(),t=this.vtable_in_use-1;t>=0&&0==this.vtable[t];t--);for(var n=t+1;t>=0;t--)this.addInt16(0!=this.vtable[t]?e-this.vtable[t]:0);this.addInt16(e-this.object_start);var o=(n+2)*r.SIZEOF_SHORT;this.addInt16(o);var i=0,a=this.space;e:for(t=0;t<this.vtables.length;t++){var s=this.bb.capacity()-this.vtables[t];if(o==this.bb.readInt16(s)){for(var u=r.SIZEOF_SHORT;u<o;u+=r.SIZEOF_SHORT)if(this.bb.readInt16(a+u)!=this.bb.readInt16(s+u))continue e;i=this.vtables[t];break}}return i?(this.space=this.bb.capacity()-e,this.bb.writeInt32(this.space,i-e)):(this.vtables.push(this.offset()),this.bb.writeInt32(this.bb.capacity()-e,this.offset()-e)),this.isNested=!1,e},r.Builder.prototype.finish=function(e,t,n){var o=n?r.SIZE_PREFIX_LENGTH:0;if(t){var i=t;if(this.prep(this.minalign,r.SIZEOF_INT+r.FILE_IDENTIFIER_LENGTH+o),i.length!=r.FILE_IDENTIFIER_LENGTH)throw new Error("FlatBuffers: file identifier must be length "+r.FILE_IDENTIFIER_LENGTH);for(var a=r.FILE_IDENTIFIER_LENGTH-1;a>=0;a--)this.writeInt8(i.charCodeAt(a))}this.prep(this.minalign,r.SIZEOF_INT+o),this.addOffset(e),o&&this.addInt32(this.bb.capacity()-this.space),this.bb.setPosition(this.space)},r.Builder.prototype.finishSizePrefixed=function(e,t){this.finish(e,t,!0)},r.Builder.prototype.requiredField=function(e,t){var n=this.bb.capacity()-e,r=n-this.bb.readInt32(n);if(0==this.bb.readInt16(r+t))throw new Error("FlatBuffers: field "+t+" must be set")},r.Builder.prototype.startVector=function(e,t,n){this.notNested(),this.vector_num_elems=t,this.prep(r.SIZEOF_INT,e*t),this.prep(n,e*t)},r.Builder.prototype.endVector=function(){return this.writeInt32(this.vector_num_elems),this.offset()},r.Builder.prototype.createString=function(e){if(e instanceof Uint8Array)var t=e;else{t=[];for(var n=0;n<e.length;){var r,o=e.charCodeAt(n++);(r=o<55296||o>=56320?o:(o<<10)+e.charCodeAt(n++)+-56613888)<128?t.push(r):(r<2048?t.push(r>>6&31|192):(r<65536?t.push(r>>12&15|224):t.push(r>>18&7|240,r>>12&63|128),t.push(r>>6&63|128)),t.push(63&r|128))}}this.addInt8(0),this.startVector(1,t.length,1),this.bb.setPosition(this.space-=t.length),n=0;for(var i=this.space,a=this.bb.bytes();n<t.length;n++)a[i++]=t[n];return this.endVector()},r.Builder.prototype.createLong=function(e,t){return r.Long.create(e,t)},r.ByteBuffer=function(e){this.bytes_=e,this.position_=0},r.ByteBuffer.allocate=function(e){return new r.ByteBuffer(new Uint8Array(e))},r.ByteBuffer.prototype.clear=function(){this.position_=0},r.ByteBuffer.prototype.bytes=function(){return this.bytes_},r.ByteBuffer.prototype.position=function(){return this.position_},r.ByteBuffer.prototype.setPosition=function(e){this.position_=e},r.ByteBuffer.prototype.capacity=function(){return this.bytes_.length},r.ByteBuffer.prototype.readInt8=function(e){return this.readUint8(e)<<24>>24},r.ByteBuffer.prototype.readUint8=function(e){return this.bytes_[e]},r.ByteBuffer.prototype.readInt16=function(e){return this.readUint16(e)<<16>>16},r.ByteBuffer.prototype.readUint16=function(e){return this.bytes_[e]|this.bytes_[e+1]<<8},r.ByteBuffer.prototype.readInt32=function(e){return this.bytes_[e]|this.bytes_[e+1]<<8|this.bytes_[e+2]<<16|this.bytes_[e+3]<<24},r.ByteBuffer.prototype.readUint32=function(e){return this.readInt32(e)>>>0},r.ByteBuffer.prototype.readInt64=function(e){return new r.Long(this.readInt32(e),this.readInt32(e+4))},r.ByteBuffer.prototype.readUint64=function(e){return new r.Long(this.readUint32(e),this.readUint32(e+4))},r.ByteBuffer.prototype.readFloat32=function(e){return r.int32[0]=this.readInt32(e),r.float32[0]},r.ByteBuffer.prototype.readFloat64=function(e){return r.int32[r.isLittleEndian?0:1]=this.readInt32(e),r.int32[r.isLittleEndian?1:0]=this.readInt32(e+4),r.float64[0]},r.ByteBuffer.prototype.writeInt8=function(e,t){this.bytes_[e]=t},r.ByteBuffer.prototype.writeUint8=function(e,t){this.bytes_[e]=t},r.ByteBuffer.prototype.writeInt16=function(e,t){this.bytes_[e]=t,this.bytes_[e+1]=t>>8},r.ByteBuffer.prototype.writeUint16=function(e,t){this.bytes_[e]=t,this.bytes_[e+1]=t>>8},r.ByteBuffer.prototype.writeInt32=function(e,t){this.bytes_[e]=t,this.bytes_[e+1]=t>>8,this.bytes_[e+2]=t>>16,this.bytes_[e+3]=t>>24},r.ByteBuffer.prototype.writeUint32=function(e,t){this.bytes_[e]=t,this.bytes_[e+1]=t>>8,this.bytes_[e+2]=t>>16,this.bytes_[e+3]=t>>24},r.ByteBuffer.prototype.writeInt64=function(e,t){this.writeInt32(e,t.low),this.writeInt32(e+4,t.high)},r.ByteBuffer.prototype.writeUint64=function(e,t){this.writeUint32(e,t.low),this.writeUint32(e+4,t.high)},r.ByteBuffer.prototype.writeFloat32=function(e,t){r.float32[0]=t,this.writeInt32(e,r.int32[0])},r.ByteBuffer.prototype.writeFloat64=function(e,t){r.float64[0]=t,this.writeInt32(e,r.int32[r.isLittleEndian?0:1]),this.writeInt32(e+4,r.int32[r.isLittleEndian?1:0])},r.ByteBuffer.prototype.getBufferIdentifier=function(){if(this.bytes_.length<this.position_+r.SIZEOF_INT+r.FILE_IDENTIFIER_LENGTH)throw new Error("FlatBuffers: ByteBuffer is too short to contain an identifier.");for(var e="",t=0;t<r.FILE_IDENTIFIER_LENGTH;t++)e+=String.fromCharCode(this.readInt8(this.position_+r.SIZEOF_INT+t));return e},r.ByteBuffer.prototype.__offset=function(e,t){var n=e-this.readInt32(e);return t<this.readInt16(n)?this.readInt16(n+t):0},r.ByteBuffer.prototype.__union=function(e,t){return e.bb_pos=t+this.readInt32(t),e.bb=this,e},r.ByteBuffer.prototype.__string=function(e,t){e+=this.readInt32(e);var n=this.readInt32(e),o="",i=0;if(e+=r.SIZEOF_INT,t===r.Encoding.UTF8_BYTES)return this.bytes_.subarray(e,e+n);for(;i<n;){var a,s=this.readUint8(e+i++);if(s<192)a=s;else{var u=this.readUint8(e+i++);if(s<224)a=(31&s)<<6|63&u;else{var l=this.readUint8(e+i++);a=s<240?(15&s)<<12|(63&u)<<6|63&l:(7&s)<<18|(63&u)<<12|(63&l)<<6|63&this.readUint8(e+i++)}}a<65536?o+=String.fromCharCode(a):(a-=65536,o+=String.fromCharCode(55296+(a>>10),56320+(1023&a)))}return o},r.ByteBuffer.prototype.__indirect=function(e){return e+this.readInt32(e)},r.ByteBuffer.prototype.__vector=function(e){return e+this.readInt32(e)+r.SIZEOF_INT},r.ByteBuffer.prototype.__vector_len=function(e){return this.readInt32(e+this.readInt32(e))},r.ByteBuffer.prototype.__has_identifier=function(e){if(e.length!=r.FILE_IDENTIFIER_LENGTH)throw new Error("FlatBuffers: file identifier must be length "+r.FILE_IDENTIFIER_LENGTH);for(var t=0;t<r.FILE_IDENTIFIER_LENGTH;t++)if(e.charCodeAt(t)!=this.readInt8(this.position_+r.SIZEOF_INT+t))return!1;return!0},r.ByteBuffer.prototype.createLong=function(e,t){return r.Long.create(e,t)}}},__webpack_module_cache__={};function __nested_webpack_require_606622__(e){var t=__webpack_module_cache__[e];if(void 0!==t)return t.exports;var n=__webpack_module_cache__[e]={exports:{}};return __webpack_modules__[e].call(n.exports,n,n.exports,__nested_webpack_require_606622__),n.exports}__nested_webpack_require_606622__.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return __nested_webpack_require_606622__.d(t,{a:t}),t},__nested_webpack_require_606622__.d=(e,t)=>{for(var n in t)__nested_webpack_require_606622__.o(t,n)&&!__nested_webpack_require_606622__.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},__nested_webpack_require_606622__.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),__nested_webpack_require_606622__.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),__nested_webpack_require_606622__.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var __nested_webpack_exports__=__nested_webpack_require_606622__(1057);return __nested_webpack_exports__})()));
//# sourceMappingURL=ort.min.js.map

/***/ }),

/***/ 7886:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.convertToWavBlob = exports.convertToWavBuffer = void 0;
const WavEncoder_1 = __webpack_require__(8426);
/**
 * Convert a Float32Array of audio samples to a WAV array buffer
 * @param audioData - The audio samples
 * @returns - The audio in WAV format as an ArrayBuffer
 */
function convertToWavBuffer(audioData) {
    const arrayBuffer = (0, WavEncoder_1.encodeWAV)(audioData);
    return arrayBuffer;
}
exports.convertToWavBuffer = convertToWavBuffer;
/**
 * Convert a Float32Array of audio samples to a WAV Blob
 * @param audioData - The audio samples
 * @returns - The audio in WAV format
 */
function convertToWavBlob(audioData) {
    const arrayBuffer = convertToWavBuffer(audioData);
    return new Blob([arrayBuffer], { type: "audio/wav" });
}
exports.convertToWavBlob = convertToWavBlob;


/***/ }),

/***/ 8426:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// Most of the code here come from ricky0123/vad-web
// Who in turn copied it from linto-ai/WebVoiceSDK
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.encodeWAV = exports.arrayBufferToBase64 = exports.minFramesForTargetMS = void 0;
function minFramesForTargetMS(targetDuration, frameSamples, sr = 16000) {
    return Math.ceil((targetDuration * sr) / 1000 / frameSamples);
}
exports.minFramesForTargetMS = minFramesForTargetMS;
function arrayBufferToBase64(buffer) {
    var binary = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}
exports.arrayBufferToBase64 = arrayBufferToBase64;
/*
  This rest of this was mostly copied from https://github.com/linto-ai/WebVoiceSDK
  */
// this function is used to encode the Float32Array audio data produced from a MicVAD
// as a WAV file audio buffer
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
exports.encodeWAV = encodeWAV;
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


/***/ }),

/***/ 1541:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.audioInputMachine = void 0;
const vad_web_1 = __webpack_require__(9762);
const ConfigModule_1 = __webpack_require__(8186);
const RequestInterceptor_1 = __webpack_require__(4870);
const AudioEncoder_1 = __webpack_require__(7886);
const xstate_1 = __webpack_require__(4679);
// Assuming config.appServerUrl is of type string.
const fullWorkletURL = `${ConfigModule_1.config.appServerUrl}/vad.worklet.bundle.min.js`;
const EventBus = window.EventBus;
let audioMimeType = "audio/wav";
let speechStartTime = 0;
const threshold = 1000; // 1000 ms = 1 second, about the length of "Hey, Pi"
(0, RequestInterceptor_1.setupInterceptors)();
// Variable to hold the microphone instance. Now has a specific type.
let microphone = null;
// Options for MicVAD
const micVADOptions = {
    workletURL: fullWorkletURL,
    positiveSpeechThreshold: 0.8,
    minSpeechFrames: 5,
    preSpeechPadFrames: 10,
    onSpeechStart: () => {
        console.log("Speech started");
        speechStartTime = Date.now();
        EventBus.emit("saypi:userSpeaking");
    },
    onSpeechEnd: (rawAudioData) => {
        console.log("Speech ended");
        const speechStopTime = Date.now();
        const speechDuration = speechStopTime - speechStartTime;
        const audioBlob = (0, AudioEncoder_1.convertToWavBlob)(rawAudioData);
        EventBus.emit("audio:dataavailable", {
            blob: audioBlob,
            duration: speechDuration,
        });
    },
    onVADMisfire: () => {
        console.log("Cancelled. Audio was not speech.");
        EventBus.emit("saypi:userStoppedSpeaking", { duration: 0 });
    },
};
// The callback type can be more specific based on your usage
function setupRecording(callback) {
    return __awaiter(this, void 0, void 0, function* () {
        if (microphone) {
            return;
        }
        try {
            const stream = yield navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    echoCancellation: true,
                    autoGainControl: true,
                    noiseSuppression: true,
                },
            });
            microphone = yield vad_web_1.MicVAD.new(Object.assign(Object.assign({}, micVADOptions), { stream }));
            if (typeof callback === "function") {
                callback();
            }
        }
        catch (err) {
            console.error("VAD failed to load", err);
            console.error(`Application server at ${ConfigModule_1.config.appServerUrl} may be unavailable. Please make sure it is running.`);
        }
    });
}
function tearDownRecording() {
    if (microphone) {
        microphone.pause();
    }
    microphone = null;
}
exports.audioInputMachine = (0, xstate_1.createMachine)({
    /** @xstate-layout N4IgpgJg5mDOIC5QEMCuECWB7AkgOwAdUAXAOgCcwAbMZWSAYmQGMBHVDSgbQAYBdRKAJZYGYtjyCQAD0QBGAGwBmUgFYeG1UoCc2gCxKA7HJ4KANCACeiJXIAcpBYe0K7bpasMHtqgL6+LNExcQhJSFnZODDwoBggsPDBSaIA3LABrJKDsfCIyCI5yaKgEVKxmZHEE3j4aqWFRKskkGURVACYLawQ7PVVSRVMeOyU9bSVlbX9A9BzQ-LZC4oYwcnIsclICKkqAMw2AW3DZkLzwxaiY0rw0iqaaupaGsQkpWQQ5QxV1TR19IxM5isiHa7X6oIUqlUCn0Ll0X2mIGypzCBU4jEoNDoYEeQhELwSb3kXzUGh4Wl0BmMpi6iDsclIY102h4RnaPG0inaiORuVRF0oEGSEBoDFgxGQ5GIuJAzyaRI+7U+Ax4clUIyhhlZI1pPV6pCUoPGekMhjsTjVPJOfIWkUFFDAzA2mBiYuIWAIACUwOw4MRIDK5a8Wu85O1tIYDXZ2nYOcNFM5dVr+p84WbVLp2n0rcEbec7ZAHU7yC7YhBKsgAIIpZAYHYAIxogfx8pD8j0kNIGrsLjcYbkSl1sYcvWUCnHenspqmASR1vm+cKhYIYDwpYAyu6CG6Pc3GsHQO9jA4FBzw5ytXYvtpddpQVGY4bPAZ2gpubPeQu0faV2vipuPTiCtq1rBsm34eoWwPVoEGPRwz10T5hmvIcwVIO84X0ORORMOQczmM5v0LcUPRXCAGD3AlmkPeRtTUNVVHsOQ9A0dpDCBboWQcZwfA0AxFFjPDETwLAIDgKRPzySD90JNsEAAWg4xBFPwlEyExWh6AgaSqIVPROmBD5mPghiFCQwEfFUvNv2KHTWxohA-nQ88eGMJwOWcVRdSNAZsNNJQhjVewrK-AVIDs6D3lfBl2KhP5OUhYZdU8FRUxhbDVEnS0P3nQiwqFDARTACLZIcuQBxUU9mIUPpXK0Nxb1c0geKZZwtSwkK8oLIVKGLUsSuomDmPpZz7HZFiJjYvRbxMUhz1aiMOUnTr+W6rZVw3LcBoVALtGayEKUQxK7CHLQBkNNrVR4I09BW20lyFEiCDI7a5KvPboXaCY7EYmNMoM7o3D0ObdHUAKs3VWx-H8IA */
    id: "audioInput",
    initial: "released",
    context: {
        waitingToStop: false,
        waitingToStart: false,
        recordingStartTime: 0,
    },
    states: {
        released: {
            on: {
                acquire: {
                    target: "acquiring",
                },
            },
        },
        acquiring: {
            description: "Acquiring the microphone. Waits until asynchronous call has completed.",
            invoke: {
                src: "acquireMicrophone",
                onDone: {
                    target: "acquired",
                },
                onError: {
                    target: "released",
                    actions: {
                        type: "logError",
                    },
                },
            },
            on: {
                start: {
                    actions: (0, xstate_1.assign)({ waitingToStart: true }),
                    internal: true,
                },
            },
        },
        acquired: {
            description: "Microphone acquired and ready to start recording.",
            initial: "idle",
            states: {
                idle: {
                    on: {
                        start: {
                            target: "recording",
                            cond: "microphoneAcquired",
                        },
                    },
                    always: {
                        target: "recording",
                        cond: "pendingStart",
                    },
                },
                recording: {
                    entry: ["startRecording", (0, xstate_1.assign)({ waitingToStart: false })],
                    on: {
                        stopRequested: {
                            target: "pendingStop",
                        },
                        dataAvailable: {
                            actions: {
                                type: "sendData",
                            },
                            internal: true,
                        },
                    },
                },
                pendingStop: {
                    description: "Waiting for the media recording device to stop recording.",
                    entry: {
                        type: "prepareStop",
                    },
                    after: {
                        "5000": [
                            {
                                target: "#audioInput.acquired.stopped",
                                actions: ["stopIfWaiting"],
                                description: "Stop eventually",
                            },
                            {
                                internal: false,
                            },
                        ],
                    },
                    on: {
                        stop: {
                            target: "stopped",
                            description: "Stop immediately",
                        },
                        dataAvailable: {
                            target: "stopped",
                            actions: ["stopIfWaiting", "sendData"],
                            description: "Stop after final audio data collected",
                        },
                    },
                },
                stopped: {
                    entry: (0, xstate_1.assign)({ waitingToStop: false }),
                    always: {
                        target: "idle",
                    },
                },
            },
            on: {
                release: {
                    target: "released",
                    actions: {
                        type: "releaseMicrophone",
                    },
                },
            },
        },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
}, {
    actions: {
        startRecording: (context, event) => {
            context.recordingStartTime = Date.now();
            // Start recording
            if (microphone && microphone.listening === false) {
                microphone.start();
            }
        },
        prepareStop: (context, event) => {
            if (microphone && microphone.listening === true) {
                context.waitingToStop = true;
            }
        },
        sendData: (context, event) => {
            const { blob, duration } = event;
            const sizeInKb = (blob.size / 1024).toFixed(2); // Convert to kilobytes and keep 2 decimal places
            console.log(`Uploading ${sizeInKb}kb of audio data`);
            // Use the duration directly from the event
            const speechDuration = duration;
            if (Number(sizeInKb) > 0) {
                // Upload the audio to the server for transcription
                EventBus.emit("saypi:userStoppedSpeaking", {
                    duration: speechDuration,
                    blob,
                });
            }
        },
        stopIfWaiting: (SayPiContext) => {
            if (SayPiContext.waitingToStop === true) {
                microphone === null || microphone === void 0 ? void 0 : microphone.pause();
            }
        },
        releaseMicrophone: (context, event) => {
            tearDownRecording();
        },
        logError: (context, event) => {
            console.error("Error acquiring microphone: ", event.data);
        },
    },
    services: {
        acquireMicrophone: (context, event) => {
            return new Promise((resolve, reject) => {
                setupRecording(() => {
                    if (microphone) {
                        resolve();
                    }
                    else {
                        reject(new Error("Failed to acquire microphone resource."));
                    }
                });
            });
        },
    },
    guards: {
        microphoneAcquired: (context, event) => {
            return microphone !== null;
        },
        pendingStart: (context, event) => {
            return context.waitingToStart === true;
        },
    },
    delays: {},
});


/***/ }),

/***/ 8933:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Xg: () => (/* binding */ createDeferredActor),
/* harmony export */   f3: () => (/* binding */ isSpawnedActor),
/* harmony export */   mu: () => (/* binding */ createInvocableActor),
/* harmony export */   vk: () => (/* binding */ toActorRef)
/* harmony export */ });
/* unused harmony exports createNullActor, isActor */
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3056);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9823);
/* harmony import */ var _serviceScope_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(797);




function createNullActor(id) {
  var _a;

  return _a = {
    id: id,
    send: function () {
      return void 0;
    },
    subscribe: function () {
      return {
        unsubscribe: function () {
          return void 0;
        }
      };
    },
    getSnapshot: function () {
      return undefined;
    },
    toJSON: function () {
      return {
        id: id
      };
    }
  }, _a[_utils_js__WEBPACK_IMPORTED_MODULE_0__/* .symbolObservable */ .L$] = function () {
    return this;
  }, _a;
}
/**
 * Creates a deferred actor that is able to be invoked given the provided
 * invocation information in its `.meta` value.
 *
 * @param invokeDefinition The meta information needed to invoke the actor.
 */

function createInvocableActor(invokeDefinition, machine, context, _event) {
  var _a;

  var invokeSrc = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__/* .toInvokeSource */ .j)(invokeDefinition.src);
  var serviceCreator = (_a = machine === null || machine === void 0 ? void 0 : machine.options.services) === null || _a === void 0 ? void 0 : _a[invokeSrc.type];
  var resolvedData = invokeDefinition.data ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__/* .mapContext */ .QX)(invokeDefinition.data, context, _event) : undefined;
  var tempActor = serviceCreator ? createDeferredActor(serviceCreator, invokeDefinition.id, resolvedData) : createNullActor(invokeDefinition.id); // @ts-ignore

  tempActor.meta = invokeDefinition;
  return tempActor;
}
function createDeferredActor(entity, id, data) {
  var tempActor = createNullActor(id); // @ts-ignore

  tempActor.deferred = true;

  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__/* .isMachine */ .O4)(entity)) {
    // "mute" the existing service scope so potential spawned actors within the `.initialState` stay deferred here
    var initialState_1 = tempActor.state = (0,_serviceScope_js__WEBPACK_IMPORTED_MODULE_1__/* .provide */ .J)(undefined, function () {
      return (data ? entity.withContext(data) : entity).initialState;
    });

    tempActor.getSnapshot = function () {
      return initialState_1;
    };
  }

  return tempActor;
}
function isActor(item) {
  try {
    return typeof item.send === 'function';
  } catch (e) {
    return false;
  }
}
function isSpawnedActor(item) {
  return isActor(item) && 'id' in item;
} // TODO: refactor the return type, this could be written in a better way but it's best to avoid unneccessary breaking changes now

function toActorRef(actorRefLike) {
  var _a;

  return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__/* .__assign */ .pi)((_a = {
    subscribe: function () {
      return {
        unsubscribe: function () {
          return void 0;
        }
      };
    },
    id: 'anonymous',
    getSnapshot: function () {
      return undefined;
    }
  }, _a[_utils_js__WEBPACK_IMPORTED_MODULE_0__/* .symbolObservable */ .L$] = function () {
    return this;
  }, _a), actorRefLike);
}




/***/ }),

/***/ 629:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C: () => (/* binding */ createMachine),
/* harmony export */   J: () => (/* binding */ Machine)
/* harmony export */ });
/* harmony import */ var _StateNode_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8889);
/* harmony import */ var _environment_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4066);



var warned = false;
function Machine(config, options, initialContext) {
  if (initialContext === void 0) {
    initialContext = config.context;
  }

  return new _StateNode_js__WEBPACK_IMPORTED_MODULE_0__/* .StateNode */ .n(config, options, initialContext);
}
function createMachine(config, options) {
  if (!_environment_js__WEBPACK_IMPORTED_MODULE_1__/* .IS_PRODUCTION */ .M && !('predictableActionArguments' in config) && !warned) {
    warned = true;
    console.warn('It is highly recommended to set `predictableActionArguments` to `true` when using `createMachine`. https://xstate.js.org/docs/guides/actions.html');
  }

  return new _StateNode_js__WEBPACK_IMPORTED_MODULE_0__/* .StateNode */ .n(config, options);
}




/***/ }),

/***/ 4911:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TL: () => (/* binding */ isStateConfig),
/* harmony export */   ZM: () => (/* binding */ State),
/* harmony export */   j1: () => (/* binding */ bindActionToState),
/* harmony export */   j_: () => (/* binding */ stateValuesEqual)
/* harmony export */ });
/* unused harmony export isState */
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3056);
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7353);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9823);
/* harmony import */ var _stateUtils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6115);
/* harmony import */ var _actions_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(375);
/* harmony import */ var _environment_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(4066);







function stateValuesEqual(a, b) {
  if (a === b) {
    return true;
  }

  if (a === undefined || b === undefined) {
    return false;
  }

  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__/* .isString */ .HD)(a) || (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__/* .isString */ .HD)(b)) {
    return a === b;
  }

  var aKeys = Object.keys(a);
  var bKeys = Object.keys(b);
  return aKeys.length === bKeys.length && aKeys.every(function (key) {
    return stateValuesEqual(a[key], b[key]);
  });
}
function isStateConfig(state) {
  if (typeof state !== 'object' || state === null) {
    return false;
  }

  return 'value' in state && '_event' in state;
}
/**
 * @deprecated Use `isStateConfig(object)` or `state instanceof State` instead.
 */

var isState = (/* unused pure expression or super */ null && (isStateConfig));
function bindActionToState(action, state) {
  var exec = action.exec;

  var boundAction = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__/* .__assign */ .pi)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__/* .__assign */ .pi)({}, action), {
    exec: exec !== undefined ? function () {
      return exec(state.context, state.event, {
        action: action,
        state: state,
        _event: state._event
      });
    } : undefined
  });

  return boundAction;
}

var State =
/*#__PURE__*/

/** @class */
function () {
  /**
   * Creates a new State instance.
   * @param value The state value
   * @param context The extended state
   * @param historyValue The tree representing historical values of the state nodes
   * @param history The previous state
   * @param actions An array of action objects to execute as side-effects
   * @param activities A mapping of activities and whether they are started (`true`) or stopped (`false`).
   * @param meta
   * @param events Internal event queue. Should be empty with run-to-completion semantics.
   * @param configuration
   */
  function State(config) {
    var _this = this;

    var _a;

    this.actions = [];
    this.activities = _constants_js__WEBPACK_IMPORTED_MODULE_2__/* .EMPTY_ACTIVITY_MAP */ .qP;
    this.meta = {};
    this.events = [];
    this.value = config.value;
    this.context = config.context;
    this._event = config._event;
    this._sessionid = config._sessionid;
    this.event = this._event.data;
    this.historyValue = config.historyValue;
    this.history = config.history;
    this.actions = config.actions || [];
    this.activities = config.activities || _constants_js__WEBPACK_IMPORTED_MODULE_2__/* .EMPTY_ACTIVITY_MAP */ .qP;
    this.meta = (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_3__/* .getMeta */ .xZ)(config.configuration);
    this.events = config.events || [];
    this.matches = this.matches.bind(this);
    this.toStrings = this.toStrings.bind(this);
    this.configuration = config.configuration;
    this.transitions = config.transitions;
    this.children = config.children;
    this.done = !!config.done;
    this.tags = (_a = Array.isArray(config.tags) ? new Set(config.tags) : config.tags) !== null && _a !== void 0 ? _a : new Set();
    this.machine = config.machine;
    Object.defineProperty(this, 'nextEvents', {
      get: function () {
        return (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_3__/* .nextEvents */ .nJ)(_this.configuration);
      }
    });
  }
  /**
   * Creates a new State instance for the given `stateValue` and `context`.
   * @param stateValue
   * @param context
   */


  State.from = function (stateValue, context) {
    if (stateValue instanceof State) {
      if (stateValue.context !== context) {
        return new State({
          value: stateValue.value,
          context: context,
          _event: stateValue._event,
          _sessionid: null,
          historyValue: stateValue.historyValue,
          history: stateValue.history,
          actions: [],
          activities: stateValue.activities,
          meta: {},
          events: [],
          configuration: [],
          transitions: [],
          children: {}
        });
      }

      return stateValue;
    }

    var _event = _actions_js__WEBPACK_IMPORTED_MODULE_4__.initEvent;
    return new State({
      value: stateValue,
      context: context,
      _event: _event,
      _sessionid: null,
      historyValue: undefined,
      history: undefined,
      actions: [],
      activities: undefined,
      meta: undefined,
      events: [],
      configuration: [],
      transitions: [],
      children: {}
    });
  };
  /**
   * Creates a new State instance for the given `config`.
   * @param config The state config
   */


  State.create = function (config) {
    return new State(config);
  };
  /**
   * Creates a new `State` instance for the given `stateValue` and `context` with no actions (side-effects).
   * @param stateValue
   * @param context
   */


  State.inert = function (stateValue, context) {
    if (stateValue instanceof State) {
      if (!stateValue.actions.length) {
        return stateValue;
      }

      var _event = _actions_js__WEBPACK_IMPORTED_MODULE_4__.initEvent;
      return new State({
        value: stateValue.value,
        context: context,
        _event: _event,
        _sessionid: null,
        historyValue: stateValue.historyValue,
        history: stateValue.history,
        activities: stateValue.activities,
        configuration: stateValue.configuration,
        transitions: [],
        children: {}
      });
    }

    return State.from(stateValue, context);
  };
  /**
   * Returns an array of all the string leaf state node paths.
   * @param stateValue
   * @param delimiter The character(s) that separate each subpath in the string state node path.
   */


  State.prototype.toStrings = function (stateValue, delimiter) {
    var _this = this;

    if (stateValue === void 0) {
      stateValue = this.value;
    }

    if (delimiter === void 0) {
      delimiter = '.';
    }

    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__/* .isString */ .HD)(stateValue)) {
      return [stateValue];
    }

    var valueKeys = Object.keys(stateValue);
    return valueKeys.concat.apply(valueKeys, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__/* .__spreadArray */ .ev)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__/* .__read */ .CR)(valueKeys.map(function (key) {
      return _this.toStrings(stateValue[key], delimiter).map(function (s) {
        return key + delimiter + s;
      });
    })), false));
  };

  State.prototype.toJSON = function () {
    var _a = this;
        _a.configuration;
        _a.transitions;
        var tags = _a.tags;
        _a.machine;
        var jsonValues = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__/* .__rest */ ._T)(_a, ["configuration", "transitions", "tags", "machine"]);

    return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__/* .__assign */ .pi)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__/* .__assign */ .pi)({}, jsonValues), {
      tags: Array.from(tags)
    });
  };

  State.prototype.matches = function (parentStateValue) {
    return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__/* .matchesState */ .W)(parentStateValue, this.value);
  };
  /**
   * Whether the current state configuration has a state node with the specified `tag`.
   * @param tag
   */


  State.prototype.hasTag = function (tag) {
    return this.tags.has(tag);
  };
  /**
   * Determines whether sending the `event` will cause a non-forbidden transition
   * to be selected, even if the transitions have no actions nor
   * change the state value.
   *
   * @param event The event to test
   * @returns Whether the event will cause a transition
   */


  State.prototype.can = function (event) {
    var _a;

    if (_environment_js__WEBPACK_IMPORTED_MODULE_5__/* .IS_PRODUCTION */ .M) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__/* .warn */ .ZK)(!!this.machine, "state.can(...) used outside of a machine-created State object; this will always return false.");
    }

    var transitionData = (_a = this.machine) === null || _a === void 0 ? void 0 : _a.getTransitionData(this, event);
    return !!(transitionData === null || transitionData === void 0 ? void 0 : transitionData.transitions.length) && // Check that at least one transition is not forbidden
    transitionData.transitions.some(function (t) {
      return t.target !== undefined || t.actions.length;
    });
  };

  return State;
}();




/***/ }),

/***/ 8889:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  n: () => (/* binding */ StateNode)
});

// EXTERNAL MODULE: ./node_modules/xstate/es/_virtual/_tslib.js
var _tslib = __webpack_require__(3056);
// EXTERNAL MODULE: ./node_modules/xstate/es/utils.js
var utils = __webpack_require__(9823);
// EXTERNAL MODULE: ./node_modules/xstate/es/State.js
var State = __webpack_require__(4911);
// EXTERNAL MODULE: ./node_modules/xstate/es/actionTypes.js
var actionTypes = __webpack_require__(3884);
// EXTERNAL MODULE: ./node_modules/xstate/es/actions.js
var es_actions = __webpack_require__(375);
// EXTERNAL MODULE: ./node_modules/xstate/es/environment.js
var environment = __webpack_require__(4066);
// EXTERNAL MODULE: ./node_modules/xstate/es/constants.js
var constants = __webpack_require__(7353);
// EXTERNAL MODULE: ./node_modules/xstate/es/stateUtils.js
var stateUtils = __webpack_require__(6115);
// EXTERNAL MODULE: ./node_modules/xstate/es/Actor.js
var Actor = __webpack_require__(8933);
;// CONCATENATED MODULE: ./node_modules/xstate/es/invokeUtils.js






function toInvokeSource(src) {
  if (typeof src === 'string') {
    var simpleSrc = {
      type: src
    };

    simpleSrc.toString = function () {
      return src;
    }; // v4 compat - TODO: remove in v5


    return simpleSrc;
  }

  return src;
}
function toInvokeDefinition(invokeConfig) {
  return (0,_tslib/* __assign */.pi)((0,_tslib/* __assign */.pi)({
    type: actionTypes.invoke
  }, invokeConfig), {
    toJSON: function () {
      invokeConfig.onDone;
          invokeConfig.onError;
          var invokeDef = (0,_tslib/* __rest */._T)(invokeConfig, ["onDone", "onError"]);

      return (0,_tslib/* __assign */.pi)((0,_tslib/* __assign */.pi)({}, invokeDef), {
        type: actionTypes.invoke,
        src: toInvokeSource(invokeConfig.src)
      });
    }
  });
}



;// CONCATENATED MODULE: ./node_modules/xstate/es/StateNode.js











var NULL_EVENT = '';
var STATE_IDENTIFIER = '#';
var WILDCARD = '*';
var EMPTY_OBJECT = {};

var isStateId = function (str) {
  return str[0] === STATE_IDENTIFIER;
};

var createDefaultOptions = function () {
  return {
    actions: {},
    guards: {},
    services: {},
    activities: {},
    delays: {}
  };
};

var validateArrayifiedTransitions = function (stateNode, event, transitions) {
  var hasNonLastUnguardedTarget = transitions.slice(0, -1).some(function (transition) {
    return !('cond' in transition) && !('in' in transition) && ((0,utils/* isString */.HD)(transition.target) || (0,utils/* isMachine */.O4)(transition.target));
  });
  var eventText = event === NULL_EVENT ? 'the transient event' : "event '".concat(event, "'");
  (0,utils/* warn */.ZK)(!hasNonLastUnguardedTarget, "One or more transitions for ".concat(eventText, " on state '").concat(stateNode.id, "' are unreachable. ") + "Make sure that the default transition is the last one defined.");
};

var StateNode =
/*#__PURE__*/

/** @class */
function () {
  function StateNode(
  /**
   * The raw config used to create the machine.
   */
  config, options,
  /**
   * The initial extended state
   */
  _context, // TODO: this is unsafe, but we're removing it in v5 anyway
  _stateInfo) {
    if (_context === void 0) {
      _context = 'context' in config ? config.context : undefined;
    }

    var _this = this;

    var _a;

    this.config = config;
    this._context = _context;
    /**
     * The order this state node appears. Corresponds to the implicit SCXML document order.
     */

    this.order = -1;
    this.__xstatenode = true;
    this.__cache = {
      events: undefined,
      relativeValue: new Map(),
      initialStateValue: undefined,
      initialState: undefined,
      on: undefined,
      transitions: undefined,
      candidates: {},
      delayedTransitions: undefined
    };
    this.idMap = {};
    this.tags = [];
    this.options = Object.assign(createDefaultOptions(), options);
    this.parent = _stateInfo === null || _stateInfo === void 0 ? void 0 : _stateInfo.parent;
    this.key = this.config.key || (_stateInfo === null || _stateInfo === void 0 ? void 0 : _stateInfo.key) || this.config.id || '(machine)';
    this.machine = this.parent ? this.parent.machine : this;
    this.path = this.parent ? this.parent.path.concat(this.key) : [];
    this.delimiter = this.config.delimiter || (this.parent ? this.parent.delimiter : constants/* STATE_DELIMITER */.iS);
    this.id = this.config.id || (0,_tslib/* __spreadArray */.ev)([this.machine.key], (0,_tslib/* __read */.CR)(this.path), false).join(this.delimiter);
    this.version = this.parent ? this.parent.version : this.config.version;
    this.type = this.config.type || (this.config.parallel ? 'parallel' : this.config.states && Object.keys(this.config.states).length ? 'compound' : this.config.history ? 'history' : 'atomic');
    this.schema = this.parent ? this.machine.schema : (_a = this.config.schema) !== null && _a !== void 0 ? _a : {};
    this.description = this.config.description;

    if (!environment/* IS_PRODUCTION */.M) {
      (0,utils/* warn */.ZK)(!('parallel' in this.config), "The \"parallel\" property is deprecated and will be removed in version 4.1. ".concat(this.config.parallel ? "Replace with `type: 'parallel'`" : "Use `type: '".concat(this.type, "'`"), " in the config for state node '").concat(this.id, "' instead."));
    }

    this.initial = this.config.initial;
    this.states = this.config.states ? (0,utils/* mapValues */.Q8)(this.config.states, function (stateConfig, key) {
      var _a;

      var stateNode = new StateNode(stateConfig, {}, undefined, {
        parent: _this,
        key: key
      });
      Object.assign(_this.idMap, (0,_tslib/* __assign */.pi)((_a = {}, _a[stateNode.id] = stateNode, _a), stateNode.idMap));
      return stateNode;
    }) : EMPTY_OBJECT; // Document order

    var order = 0;

    function dfs(stateNode) {
      var e_1, _a;

      stateNode.order = order++;

      try {
        for (var _b = (0,_tslib/* __values */.XA)((0,stateUtils/* getAllChildren */.nI)(stateNode)), _c = _b.next(); !_c.done; _c = _b.next()) {
          var child = _c.value;
          dfs(child);
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    }

    dfs(this); // History config

    this.history = this.config.history === true ? 'shallow' : this.config.history || false;
    this._transient = !!this.config.always || (!this.config.on ? false : Array.isArray(this.config.on) ? this.config.on.some(function (_a) {
      var event = _a.event;
      return event === NULL_EVENT;
    }) : NULL_EVENT in this.config.on);
    this.strict = !!this.config.strict; // TODO: deprecate (entry)

    this.onEntry = (0,utils/* toArray */.qo)(this.config.entry || this.config.onEntry).map(function (action) {
      return (0,es_actions.toActionObject)(action);
    }); // TODO: deprecate (exit)

    this.onExit = (0,utils/* toArray */.qo)(this.config.exit || this.config.onExit).map(function (action) {
      return (0,es_actions.toActionObject)(action);
    });
    this.meta = this.config.meta;
    this.doneData = this.type === 'final' ? this.config.data : undefined;
    this.invoke = (0,utils/* toArray */.qo)(this.config.invoke).map(function (invokeConfig, i) {
      var _a, _b;

      if ((0,utils/* isMachine */.O4)(invokeConfig)) {
        var invokeId = (0,utils/* createInvokeId */.bx)(_this.id, i);
        _this.machine.options.services = (0,_tslib/* __assign */.pi)((_a = {}, _a[invokeId] = invokeConfig, _a), _this.machine.options.services);
        return toInvokeDefinition({
          src: invokeId,
          id: invokeId
        });
      } else if ((0,utils/* isString */.HD)(invokeConfig.src)) {
        var invokeId = invokeConfig.id || (0,utils/* createInvokeId */.bx)(_this.id, i);
        return toInvokeDefinition((0,_tslib/* __assign */.pi)((0,_tslib/* __assign */.pi)({}, invokeConfig), {
          id: invokeId,
          src: invokeConfig.src
        }));
      } else if ((0,utils/* isMachine */.O4)(invokeConfig.src) || (0,utils/* isFunction */.mf)(invokeConfig.src)) {
        var invokeId = invokeConfig.id || (0,utils/* createInvokeId */.bx)(_this.id, i);
        _this.machine.options.services = (0,_tslib/* __assign */.pi)((_b = {}, _b[invokeId] = invokeConfig.src, _b), _this.machine.options.services);
        return toInvokeDefinition((0,_tslib/* __assign */.pi)((0,_tslib/* __assign */.pi)({
          id: invokeId
        }, invokeConfig), {
          src: invokeId
        }));
      } else {
        var invokeSource = invokeConfig.src;
        return toInvokeDefinition((0,_tslib/* __assign */.pi)((0,_tslib/* __assign */.pi)({
          id: (0,utils/* createInvokeId */.bx)(_this.id, i)
        }, invokeConfig), {
          src: invokeSource
        }));
      }
    });
    this.activities = (0,utils/* toArray */.qo)(this.config.activities).concat(this.invoke).map(function (activity) {
      return (0,es_actions.toActivityDefinition)(activity);
    });
    this.transition = this.transition.bind(this);
    this.tags = (0,utils/* toArray */.qo)(this.config.tags); // TODO: this is the real fix for initialization once
    // state node getters are deprecated
    // if (!this.parent) {
    //   this._init();
    // }
  }

  StateNode.prototype._init = function () {
    if (this.__cache.transitions) {
      return;
    }

    (0,stateUtils/* getAllStateNodes */.ac)(this).forEach(function (stateNode) {
      return stateNode.on;
    });
  };
  /**
   * Clones this state machine with custom options and context.
   *
   * @param options Options (actions, guards, activities, services) to recursively merge with the existing options.
   * @param context Custom context (will override predefined context)
   */


  StateNode.prototype.withConfig = function (options, context) {
    var _a = this.options,
        actions = _a.actions,
        activities = _a.activities,
        guards = _a.guards,
        services = _a.services,
        delays = _a.delays;
    return new StateNode(this.config, {
      actions: (0,_tslib/* __assign */.pi)((0,_tslib/* __assign */.pi)({}, actions), options.actions),
      activities: (0,_tslib/* __assign */.pi)((0,_tslib/* __assign */.pi)({}, activities), options.activities),
      guards: (0,_tslib/* __assign */.pi)((0,_tslib/* __assign */.pi)({}, guards), options.guards),
      services: (0,_tslib/* __assign */.pi)((0,_tslib/* __assign */.pi)({}, services), options.services),
      delays: (0,_tslib/* __assign */.pi)((0,_tslib/* __assign */.pi)({}, delays), options.delays)
    }, context !== null && context !== void 0 ? context : this.context);
  };
  /**
   * Clones this state machine with custom context.
   *
   * @param context Custom context (will override predefined context, not recursive)
   */


  StateNode.prototype.withContext = function (context) {
    return new StateNode(this.config, this.options, context);
  };

  Object.defineProperty(StateNode.prototype, "context", {
    get: function () {
      return (0,utils/* isFunction */.mf)(this._context) ? this._context() : this._context;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(StateNode.prototype, "definition", {
    /**
     * The well-structured state node definition.
     */
    get: function () {
      return {
        id: this.id,
        key: this.key,
        version: this.version,
        context: this.context,
        type: this.type,
        initial: this.initial,
        history: this.history,
        states: (0,utils/* mapValues */.Q8)(this.states, function (state) {
          return state.definition;
        }),
        on: this.on,
        transitions: this.transitions,
        entry: this.onEntry,
        exit: this.onExit,
        activities: this.activities || [],
        meta: this.meta,
        order: this.order || -1,
        data: this.doneData,
        invoke: this.invoke,
        description: this.description,
        tags: this.tags
      };
    },
    enumerable: false,
    configurable: true
  });

  StateNode.prototype.toJSON = function () {
    return this.definition;
  };

  Object.defineProperty(StateNode.prototype, "on", {
    /**
     * The mapping of events to transitions.
     */
    get: function () {
      if (this.__cache.on) {
        return this.__cache.on;
      }

      var transitions = this.transitions;
      return this.__cache.on = transitions.reduce(function (map, transition) {
        map[transition.eventType] = map[transition.eventType] || [];
        map[transition.eventType].push(transition);
        return map;
      }, {});
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(StateNode.prototype, "after", {
    get: function () {
      return this.__cache.delayedTransitions || (this.__cache.delayedTransitions = this.getDelayedTransitions(), this.__cache.delayedTransitions);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(StateNode.prototype, "transitions", {
    /**
     * All the transitions that can be taken from this state node.
     */
    get: function () {
      return this.__cache.transitions || (this.__cache.transitions = this.formatTransitions(), this.__cache.transitions);
    },
    enumerable: false,
    configurable: true
  });

  StateNode.prototype.getCandidates = function (eventName) {
    if (this.__cache.candidates[eventName]) {
      return this.__cache.candidates[eventName];
    }

    var transient = eventName === NULL_EVENT;
    var candidates = this.transitions.filter(function (transition) {
      var sameEventType = transition.eventType === eventName; // null events should only match against eventless transitions

      return transient ? sameEventType : sameEventType || transition.eventType === WILDCARD;
    });
    this.__cache.candidates[eventName] = candidates;
    return candidates;
  };
  /**
   * All delayed transitions from the config.
   */


  StateNode.prototype.getDelayedTransitions = function () {
    var _this = this;

    var afterConfig = this.config.after;

    if (!afterConfig) {
      return [];
    }

    var mutateEntryExit = function (delay, i) {
      var delayRef = (0,utils/* isFunction */.mf)(delay) ? "".concat(_this.id, ":delay[").concat(i, "]") : delay;
      var eventType = (0,es_actions.after)(delayRef, _this.id);

      _this.onEntry.push((0,es_actions.send)(eventType, {
        delay: delay
      }));

      _this.onExit.push((0,es_actions.cancel)(eventType));

      return eventType;
    };

    var delayedTransitions = (0,utils/* isArray */.kJ)(afterConfig) ? afterConfig.map(function (transition, i) {
      var eventType = mutateEntryExit(transition.delay, i);
      return (0,_tslib/* __assign */.pi)((0,_tslib/* __assign */.pi)({}, transition), {
        event: eventType
      });
    }) : (0,utils/* flatten */.xH)(Object.keys(afterConfig).map(function (delay, i) {
      var configTransition = afterConfig[delay];
      var resolvedTransition = (0,utils/* isString */.HD)(configTransition) ? {
        target: configTransition
      } : configTransition;
      var resolvedDelay = !isNaN(+delay) ? +delay : delay;
      var eventType = mutateEntryExit(resolvedDelay, i);
      return (0,utils/* toArray */.qo)(resolvedTransition).map(function (transition) {
        return (0,_tslib/* __assign */.pi)((0,_tslib/* __assign */.pi)({}, transition), {
          event: eventType,
          delay: resolvedDelay
        });
      });
    }));
    return delayedTransitions.map(function (delayedTransition) {
      var delay = delayedTransition.delay;
      return (0,_tslib/* __assign */.pi)((0,_tslib/* __assign */.pi)({}, _this.formatTransition(delayedTransition)), {
        delay: delay
      });
    });
  };
  /**
   * Returns the state nodes represented by the current state value.
   *
   * @param state The state value or State instance
   */


  StateNode.prototype.getStateNodes = function (state) {
    var _a;

    var _this = this;

    if (!state) {
      return [];
    }

    var stateValue = state instanceof State/* State */.ZM ? state.value : (0,utils/* toStateValue */.WM)(state, this.delimiter);

    if ((0,utils/* isString */.HD)(stateValue)) {
      var initialStateValue = this.getStateNode(stateValue).initial;
      return initialStateValue !== undefined ? this.getStateNodes((_a = {}, _a[stateValue] = initialStateValue, _a)) : [this, this.states[stateValue]];
    }

    var subStateKeys = Object.keys(stateValue);
    var subStateNodes = [this];
    subStateNodes.push.apply(subStateNodes, (0,_tslib/* __spreadArray */.ev)([], (0,_tslib/* __read */.CR)((0,utils/* flatten */.xH)(subStateKeys.map(function (subStateKey) {
      return _this.getStateNode(subStateKey).getStateNodes(stateValue[subStateKey]);
    }))), false));
    return subStateNodes;
  };
  /**
   * Returns `true` if this state node explicitly handles the given event.
   *
   * @param event The event in question
   */


  StateNode.prototype.handles = function (event) {
    var eventType = (0,utils/* getEventType */.x6)(event);
    return this.events.includes(eventType);
  };
  /**
   * Resolves the given `state` to a new `State` instance relative to this machine.
   *
   * This ensures that `.events` and `.nextEvents` represent the correct values.
   *
   * @param state The state to resolve
   */


  StateNode.prototype.resolveState = function (state) {
    var stateFromConfig = state instanceof State/* State */.ZM ? state : State/* State */.ZM.create(state);
    var configuration = Array.from((0,stateUtils/* getConfiguration */.P_)([], this.getStateNodes(stateFromConfig.value)));
    return new State/* State */.ZM((0,_tslib/* __assign */.pi)((0,_tslib/* __assign */.pi)({}, stateFromConfig), {
      value: this.resolve(stateFromConfig.value),
      configuration: configuration,
      done: (0,stateUtils/* isInFinalState */.Ij)(configuration, this),
      tags: (0,stateUtils/* getTagsFromConfiguration */.Oe)(configuration),
      machine: this.machine
    }));
  };

  StateNode.prototype.transitionLeafNode = function (stateValue, state, _event) {
    var stateNode = this.getStateNode(stateValue);
    var next = stateNode.next(state, _event);

    if (!next || !next.transitions.length) {
      return this.next(state, _event);
    }

    return next;
  };

  StateNode.prototype.transitionCompoundNode = function (stateValue, state, _event) {
    var subStateKeys = Object.keys(stateValue);
    var stateNode = this.getStateNode(subStateKeys[0]);

    var next = stateNode._transition(stateValue[subStateKeys[0]], state, _event);

    if (!next || !next.transitions.length) {
      return this.next(state, _event);
    }

    return next;
  };

  StateNode.prototype.transitionParallelNode = function (stateValue, state, _event) {
    var e_2, _a;

    var transitionMap = {};

    try {
      for (var _b = (0,_tslib/* __values */.XA)(Object.keys(stateValue)), _c = _b.next(); !_c.done; _c = _b.next()) {
        var subStateKey = _c.value;
        var subStateValue = stateValue[subStateKey];

        if (!subStateValue) {
          continue;
        }

        var subStateNode = this.getStateNode(subStateKey);

        var next = subStateNode._transition(subStateValue, state, _event);

        if (next) {
          transitionMap[subStateKey] = next;
        }
      }
    } catch (e_2_1) {
      e_2 = {
        error: e_2_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_2) throw e_2.error;
      }
    }

    var stateTransitions = Object.keys(transitionMap).map(function (key) {
      return transitionMap[key];
    });
    var enabledTransitions = (0,utils/* flatten */.xH)(stateTransitions.map(function (st) {
      return st.transitions;
    }));
    var willTransition = stateTransitions.some(function (st) {
      return st.transitions.length > 0;
    });

    if (!willTransition) {
      return this.next(state, _event);
    }

    var configuration = (0,utils/* flatten */.xH)(Object.keys(transitionMap).map(function (key) {
      return transitionMap[key].configuration;
    }));
    return {
      transitions: enabledTransitions,
      exitSet: (0,utils/* flatten */.xH)(stateTransitions.map(function (t) {
        return t.exitSet;
      })),
      configuration: configuration,
      source: state,
      actions: (0,utils/* flatten */.xH)(Object.keys(transitionMap).map(function (key) {
        return transitionMap[key].actions;
      }))
    };
  };

  StateNode.prototype._transition = function (stateValue, state, _event) {
    // leaf node
    if ((0,utils/* isString */.HD)(stateValue)) {
      return this.transitionLeafNode(stateValue, state, _event);
    } // hierarchical node


    if (Object.keys(stateValue).length === 1) {
      return this.transitionCompoundNode(stateValue, state, _event);
    } // orthogonal node


    return this.transitionParallelNode(stateValue, state, _event);
  };

  StateNode.prototype.getTransitionData = function (state, event) {
    return this._transition(state.value, state, (0,utils/* toSCXMLEvent */.g5)(event));
  };

  StateNode.prototype.next = function (state, _event) {
    var e_3, _a;

    var _this = this;

    var eventName = _event.name;
    var actions = [];
    var nextStateNodes = [];
    var selectedTransition;

    try {
      for (var _b = (0,_tslib/* __values */.XA)(this.getCandidates(eventName)), _c = _b.next(); !_c.done; _c = _b.next()) {
        var candidate = _c.value;
        var cond = candidate.cond,
            stateIn = candidate.in;
        var resolvedContext = state.context;
        var isInState = stateIn ? (0,utils/* isString */.HD)(stateIn) && isStateId(stateIn) ? // Check if in state by ID
        state.matches((0,utils/* toStateValue */.WM)(this.getStateNodeById(stateIn).path, this.delimiter)) : // Check if in state by relative grandparent
        (0,utils/* matchesState */.W)((0,utils/* toStateValue */.WM)(stateIn, this.delimiter), (0,utils/* path */.ET)(this.path.slice(0, -2))(state.value)) : true;
        var guardPassed = false;

        try {
          guardPassed = !cond || (0,utils/* evaluateGuard */.vx)(this.machine, cond, resolvedContext, _event, state);
        } catch (err) {
          throw new Error("Unable to evaluate guard '".concat(cond.name || cond.type, "' in transition for event '").concat(eventName, "' in state node '").concat(this.id, "':\n").concat(err.message));
        }

        if (guardPassed && isInState) {
          if (candidate.target !== undefined) {
            nextStateNodes = candidate.target;
          }

          actions.push.apply(actions, (0,_tslib/* __spreadArray */.ev)([], (0,_tslib/* __read */.CR)(candidate.actions), false));
          selectedTransition = candidate;
          break;
        }
      }
    } catch (e_3_1) {
      e_3 = {
        error: e_3_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_3) throw e_3.error;
      }
    }

    if (!selectedTransition) {
      return undefined;
    }

    if (!nextStateNodes.length) {
      return {
        transitions: [selectedTransition],
        exitSet: [],
        configuration: state.value ? [this] : [],
        source: state,
        actions: actions
      };
    }

    var allNextStateNodes = (0,utils/* flatten */.xH)(nextStateNodes.map(function (stateNode) {
      return _this.getRelativeStateNodes(stateNode, state.historyValue);
    }));
    var isInternal = !!selectedTransition.internal;
    return {
      transitions: [selectedTransition],
      exitSet: isInternal ? [] : (0,utils/* flatten */.xH)(nextStateNodes.map(function (targetNode) {
        return _this.getPotentiallyReenteringNodes(targetNode);
      })),
      configuration: allNextStateNodes,
      source: state,
      actions: actions
    };
  }; // even though the name of this function mentions reentry nodes
  // we are pushing its result into `exitSet`
  // that's because what we exit might be reentered (it's an invariant of reentrancy)


  StateNode.prototype.getPotentiallyReenteringNodes = function (targetNode) {
    if (this.order < targetNode.order) {
      return [this];
    }

    var nodes = [];
    var marker = this;
    var possibleAncestor = targetNode;

    while (marker && marker !== possibleAncestor) {
      nodes.push(marker);
      marker = marker.parent;
    }

    if (marker !== possibleAncestor) {
      // we never got to `possibleAncestor`, therefore the initial `marker` "escapes" it
      // it's in a different part of the tree so no states will be reentered for such an external transition
      return [];
    }

    nodes.push(possibleAncestor);
    return nodes;
  };

  StateNode.prototype.getActions = function (resolvedConfig, isDone, transition, currentContext, _event, prevState, predictableExec) {
    var e_4, _a, e_5, _b;

    var _this = this;

    var prevConfig = prevState ? (0,stateUtils/* getConfiguration */.P_)([], this.getStateNodes(prevState.value)) : [];
    var entrySet = new Set();

    try {
      for (var _c = (0,_tslib/* __values */.XA)(Array.from(resolvedConfig).sort(function (a, b) {
        return a.order - b.order;
      })), _d = _c.next(); !_d.done; _d = _c.next()) {
        var sn = _d.value;

        if (!(0,stateUtils/* has */.e$)(prevConfig, sn) || (0,stateUtils/* has */.e$)(transition.exitSet, sn) || sn.parent && entrySet.has(sn.parent)) {
          entrySet.add(sn);
        }
      }
    } catch (e_4_1) {
      e_4 = {
        error: e_4_1
      };
    } finally {
      try {
        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
      } finally {
        if (e_4) throw e_4.error;
      }
    }

    try {
      for (var prevConfig_1 = (0,_tslib/* __values */.XA)(prevConfig), prevConfig_1_1 = prevConfig_1.next(); !prevConfig_1_1.done; prevConfig_1_1 = prevConfig_1.next()) {
        var sn = prevConfig_1_1.value;

        if (!(0,stateUtils/* has */.e$)(resolvedConfig, sn) || (0,stateUtils/* has */.e$)(transition.exitSet, sn.parent)) {
          transition.exitSet.push(sn);
        }
      }
    } catch (e_5_1) {
      e_5 = {
        error: e_5_1
      };
    } finally {
      try {
        if (prevConfig_1_1 && !prevConfig_1_1.done && (_b = prevConfig_1.return)) _b.call(prevConfig_1);
      } finally {
        if (e_5) throw e_5.error;
      }
    }

    transition.exitSet.sort(function (a, b) {
      return b.order - a.order;
    });
    var entryStates = Array.from(entrySet).sort(function (a, b) {
      return a.order - b.order;
    });
    var exitStates = new Set(transition.exitSet);
    var doneEvents = (0,utils/* flatten */.xH)(entryStates.map(function (sn) {
      var events = [];

      if (sn.type !== 'final') {
        return events;
      }

      var parent = sn.parent;

      if (!parent.parent) {
        return events;
      }

      events.push((0,es_actions.done)(sn.id, sn.doneData), // TODO: deprecate - final states should not emit done events for their own state.
      (0,es_actions.done)(parent.id, sn.doneData ? (0,utils/* mapContext */.QX)(sn.doneData, currentContext, _event) : undefined));
      var grandparent = parent.parent;

      if (grandparent.type === 'parallel') {
        if ((0,stateUtils/* getChildren */.G)(grandparent).every(function (parentNode) {
          return (0,stateUtils/* isInFinalState */.Ij)(transition.configuration, parentNode);
        })) {
          events.push((0,es_actions.done)(grandparent.id));
        }
      }

      return events;
    }));
    var entryActions = entryStates.map(function (stateNode) {
      var entryActions = stateNode.onEntry;
      var invokeActions = stateNode.activities.map(function (activity) {
        return (0,es_actions.start)(activity);
      });
      return {
        type: 'entry',
        actions: (0,es_actions.toActionObjects)(predictableExec ? (0,_tslib/* __spreadArray */.ev)((0,_tslib/* __spreadArray */.ev)([], (0,_tslib/* __read */.CR)(entryActions), false), (0,_tslib/* __read */.CR)(invokeActions), false) : (0,_tslib/* __spreadArray */.ev)((0,_tslib/* __spreadArray */.ev)([], (0,_tslib/* __read */.CR)(invokeActions), false), (0,_tslib/* __read */.CR)(entryActions), false), _this.machine.options.actions)
      };
    }).concat({
      type: 'state_done',
      actions: doneEvents.map(function (event) {
        return (0,es_actions.raise)(event);
      })
    });
    var exitActions = Array.from(exitStates).map(function (stateNode) {
      return {
        type: 'exit',
        actions: (0,es_actions.toActionObjects)((0,_tslib/* __spreadArray */.ev)((0,_tslib/* __spreadArray */.ev)([], (0,_tslib/* __read */.CR)(stateNode.onExit), false), (0,_tslib/* __read */.CR)(stateNode.activities.map(function (activity) {
          return (0,es_actions.stop)(activity);
        })), false), _this.machine.options.actions)
      };
    });
    var actions = exitActions.concat({
      type: 'transition',
      actions: (0,es_actions.toActionObjects)(transition.actions, this.machine.options.actions)
    }).concat(entryActions);

    if (isDone) {
      var stopActions = (0,es_actions.toActionObjects)((0,utils/* flatten */.xH)((0,_tslib/* __spreadArray */.ev)([], (0,_tslib/* __read */.CR)(resolvedConfig), false).sort(function (a, b) {
        return b.order - a.order;
      }).map(function (stateNode) {
        return stateNode.onExit;
      })), this.machine.options.actions).filter(function (action) {
        return !(0,utils/* isRaisableAction */.vK)(action);
      });
      return actions.concat({
        type: 'stop',
        actions: stopActions
      });
    }

    return actions;
  };
  /**
   * Determines the next state given the current `state` and sent `event`.
   *
   * @param state The current State instance or state value
   * @param event The event that was sent at the current state
   * @param context The current context (extended state) of the current state
   */


  StateNode.prototype.transition = function (state, event, context, exec) {
    if (state === void 0) {
      state = this.initialState;
    }

    var _event = (0,utils/* toSCXMLEvent */.g5)(event);

    var currentState;

    if (state instanceof State/* State */.ZM) {
      currentState = context === undefined ? state : this.resolveState(State/* State */.ZM.from(state, context));
    } else {
      var resolvedStateValue = (0,utils/* isString */.HD)(state) ? this.resolve((0,utils/* pathToStateValue */.on)(this.getResolvedPath(state))) : this.resolve(state);
      var resolvedContext = context !== null && context !== void 0 ? context : this.machine.context;
      currentState = this.resolveState(State/* State */.ZM.from(resolvedStateValue, resolvedContext));
    }

    if (!environment/* IS_PRODUCTION */.M && _event.name === WILDCARD) {
      throw new Error("An event cannot have the wildcard type ('".concat(WILDCARD, "')"));
    }

    if (this.strict) {
      if (!this.events.includes(_event.name) && !(0,utils/* isBuiltInEvent */.JQ)(_event.name)) {
        throw new Error("Machine '".concat(this.id, "' does not accept event '").concat(_event.name, "'"));
      }
    }

    var stateTransition = this._transition(currentState.value, currentState, _event) || {
      transitions: [],
      configuration: [],
      exitSet: [],
      source: currentState,
      actions: []
    };
    var prevConfig = (0,stateUtils/* getConfiguration */.P_)([], this.getStateNodes(currentState.value));
    var resolvedConfig = stateTransition.configuration.length ? (0,stateUtils/* getConfiguration */.P_)(prevConfig, stateTransition.configuration) : prevConfig;
    stateTransition.configuration = (0,_tslib/* __spreadArray */.ev)([], (0,_tslib/* __read */.CR)(resolvedConfig), false);
    return this.resolveTransition(stateTransition, currentState, currentState.context, exec, _event);
  };

  StateNode.prototype.resolveRaisedTransition = function (state, _event, originalEvent, predictableExec) {
    var _a;

    var currentActions = state.actions;
    state = this.transition(state, _event, undefined, predictableExec); // Save original event to state
    // TODO: this should be the raised event! Delete in V5 (breaking)

    state._event = originalEvent;
    state.event = originalEvent.data;

    (_a = state.actions).unshift.apply(_a, (0,_tslib/* __spreadArray */.ev)([], (0,_tslib/* __read */.CR)(currentActions), false));

    return state;
  };

  StateNode.prototype.resolveTransition = function (stateTransition, currentState, context, predictableExec, _event) {
    var e_6, _a, e_7, _b;

    var _this = this;

    if (_event === void 0) {
      _event = es_actions.initEvent;
    }

    var configuration = stateTransition.configuration; // Transition will "apply" if:
    // - this is the initial state (there is no current state)
    // - OR there are transitions

    var willTransition = !currentState || stateTransition.transitions.length > 0;
    var resolvedConfiguration = willTransition ? stateTransition.configuration : currentState ? currentState.configuration : [];
    var isDone = (0,stateUtils/* isInFinalState */.Ij)(resolvedConfiguration, this);
    var resolvedStateValue = willTransition ? (0,stateUtils/* getValue */.NA)(this.machine, configuration) : undefined;
    var historyValue = currentState ? currentState.historyValue ? currentState.historyValue : stateTransition.source ? this.machine.historyValue(currentState.value) : undefined : undefined;
    var actionBlocks = this.getActions(new Set(resolvedConfiguration), isDone, stateTransition, context, _event, currentState, predictableExec);
    var activities = currentState ? (0,_tslib/* __assign */.pi)({}, currentState.activities) : {};

    try {
      for (var actionBlocks_1 = (0,_tslib/* __values */.XA)(actionBlocks), actionBlocks_1_1 = actionBlocks_1.next(); !actionBlocks_1_1.done; actionBlocks_1_1 = actionBlocks_1.next()) {
        var block = actionBlocks_1_1.value;

        try {
          for (var _c = (e_7 = void 0, (0,_tslib/* __values */.XA)(block.actions)), _d = _c.next(); !_d.done; _d = _c.next()) {
            var action = _d.value;

            if (action.type === actionTypes.start) {
              activities[action.activity.id || action.activity.type] = action;
            } else if (action.type === actionTypes.stop) {
              activities[action.activity.id || action.activity.type] = false;
            }
          }
        } catch (e_7_1) {
          e_7 = {
            error: e_7_1
          };
        } finally {
          try {
            if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
          } finally {
            if (e_7) throw e_7.error;
          }
        }
      }
    } catch (e_6_1) {
      e_6 = {
        error: e_6_1
      };
    } finally {
      try {
        if (actionBlocks_1_1 && !actionBlocks_1_1.done && (_a = actionBlocks_1.return)) _a.call(actionBlocks_1);
      } finally {
        if (e_6) throw e_6.error;
      }
    }

    var _e = (0,_tslib/* __read */.CR)((0,es_actions.resolveActions)(this, currentState, context, _event, actionBlocks, predictableExec, this.machine.config.predictableActionArguments || this.machine.config.preserveActionOrder), 2),
        resolvedActions = _e[0],
        updatedContext = _e[1];

    var _f = (0,_tslib/* __read */.CR)((0,utils/* partition */.uK)(resolvedActions, utils/* isRaisableAction */.vK), 2),
        raisedEvents = _f[0],
        nonRaisedActions = _f[1];

    var invokeActions = resolvedActions.filter(function (action) {
      var _a;

      return action.type === actionTypes.start && ((_a = action.activity) === null || _a === void 0 ? void 0 : _a.type) === actionTypes.invoke;
    });
    var children = invokeActions.reduce(function (acc, action) {
      acc[action.activity.id] = (0,Actor/* createInvocableActor */.mu)(action.activity, _this.machine, updatedContext, _event);
      return acc;
    }, currentState ? (0,_tslib/* __assign */.pi)({}, currentState.children) : {});
    var nextState = new State/* State */.ZM({
      value: resolvedStateValue || currentState.value,
      context: updatedContext,
      _event: _event,
      // Persist _sessionid between states
      _sessionid: currentState ? currentState._sessionid : null,
      historyValue: resolvedStateValue ? historyValue ? (0,utils/* updateHistoryValue */.yv)(historyValue, resolvedStateValue) : undefined : currentState ? currentState.historyValue : undefined,
      history: !resolvedStateValue || stateTransition.source ? currentState : undefined,
      actions: resolvedStateValue ? nonRaisedActions : [],
      activities: resolvedStateValue ? activities : currentState ? currentState.activities : {},
      events: [],
      configuration: resolvedConfiguration,
      transitions: stateTransition.transitions,
      children: children,
      done: isDone,
      tags: (0,stateUtils/* getTagsFromConfiguration */.Oe)(resolvedConfiguration),
      machine: this
    });
    var didUpdateContext = context !== updatedContext;
    nextState.changed = _event.name === actionTypes.update || didUpdateContext; // Dispose of penultimate histories to prevent memory leaks

    var history = nextState.history;

    if (history) {
      delete history.history;
    } // There are transient transitions if the machine is not in a final state
    // and if some of the state nodes have transient ("always") transitions.


    var hasAlwaysTransitions = !isDone && (this._transient || configuration.some(function (stateNode) {
      return stateNode._transient;
    })); // If there are no enabled transitions, check if there are transient transitions.
    // If there are transient transitions, continue checking for more transitions
    // because an transient transition should be triggered even if there are no
    // enabled transitions.
    //
    // If we're already working on an transient transition then stop to prevent an infinite loop.
    //
    // Otherwise, if there are no enabled nor transient transitions, we are done.

    if (!willTransition && (!hasAlwaysTransitions || _event.name === NULL_EVENT)) {
      return nextState;
    }

    var maybeNextState = nextState;

    if (!isDone) {
      if (hasAlwaysTransitions) {
        maybeNextState = this.resolveRaisedTransition(maybeNextState, {
          type: actionTypes.nullEvent
        }, _event, predictableExec);
      }

      while (raisedEvents.length) {
        var raisedEvent = raisedEvents.shift();
        maybeNextState = this.resolveRaisedTransition(maybeNextState, raisedEvent._event, _event, predictableExec);
      }
    } // Detect if state changed


    var changed = maybeNextState.changed || (history ? !!maybeNextState.actions.length || didUpdateContext || typeof history.value !== typeof maybeNextState.value || !(0,State/* stateValuesEqual */.j_)(maybeNextState.value, history.value) : undefined);
    maybeNextState.changed = changed; // Preserve original history after raised events

    maybeNextState.history = history;
    return maybeNextState;
  };
  /**
   * Returns the child state node from its relative `stateKey`, or throws.
   */


  StateNode.prototype.getStateNode = function (stateKey) {
    if (isStateId(stateKey)) {
      return this.machine.getStateNodeById(stateKey);
    }

    if (!this.states) {
      throw new Error("Unable to retrieve child state '".concat(stateKey, "' from '").concat(this.id, "'; no child states exist."));
    }

    var result = this.states[stateKey];

    if (!result) {
      throw new Error("Child state '".concat(stateKey, "' does not exist on '").concat(this.id, "'"));
    }

    return result;
  };
  /**
   * Returns the state node with the given `stateId`, or throws.
   *
   * @param stateId The state ID. The prefix "#" is removed.
   */


  StateNode.prototype.getStateNodeById = function (stateId) {
    var resolvedStateId = isStateId(stateId) ? stateId.slice(STATE_IDENTIFIER.length) : stateId;

    if (resolvedStateId === this.id) {
      return this;
    }

    var stateNode = this.machine.idMap[resolvedStateId];

    if (!stateNode) {
      throw new Error("Child state node '#".concat(resolvedStateId, "' does not exist on machine '").concat(this.id, "'"));
    }

    return stateNode;
  };
  /**
   * Returns the relative state node from the given `statePath`, or throws.
   *
   * @param statePath The string or string array relative path to the state node.
   */


  StateNode.prototype.getStateNodeByPath = function (statePath) {
    if (typeof statePath === 'string' && isStateId(statePath)) {
      try {
        return this.getStateNodeById(statePath.slice(1));
      } catch (e) {// try individual paths
        // throw e;
      }
    }

    var arrayStatePath = (0,utils/* toStatePath */.Q9)(statePath, this.delimiter).slice();
    var currentStateNode = this;

    while (arrayStatePath.length) {
      var key = arrayStatePath.shift();

      if (!key.length) {
        break;
      }

      currentStateNode = currentStateNode.getStateNode(key);
    }

    return currentStateNode;
  };
  /**
   * Resolves a partial state value with its full representation in this machine.
   *
   * @param stateValue The partial state value to resolve.
   */


  StateNode.prototype.resolve = function (stateValue) {
    var _a;

    var _this = this;

    if (!stateValue) {
      return this.initialStateValue || EMPTY_OBJECT; // TODO: type-specific properties
    }

    switch (this.type) {
      case 'parallel':
        return (0,utils/* mapValues */.Q8)(this.initialStateValue, function (subStateValue, subStateKey) {
          return subStateValue ? _this.getStateNode(subStateKey).resolve(stateValue[subStateKey] || subStateValue) : EMPTY_OBJECT;
        });

      case 'compound':
        if ((0,utils/* isString */.HD)(stateValue)) {
          var subStateNode = this.getStateNode(stateValue);

          if (subStateNode.type === 'parallel' || subStateNode.type === 'compound') {
            return _a = {}, _a[stateValue] = subStateNode.initialStateValue, _a;
          }

          return stateValue;
        }

        if (!Object.keys(stateValue).length) {
          return this.initialStateValue || {};
        }

        return (0,utils/* mapValues */.Q8)(stateValue, function (subStateValue, subStateKey) {
          return subStateValue ? _this.getStateNode(subStateKey).resolve(subStateValue) : EMPTY_OBJECT;
        });

      default:
        return stateValue || EMPTY_OBJECT;
    }
  };

  StateNode.prototype.getResolvedPath = function (stateIdentifier) {
    if (isStateId(stateIdentifier)) {
      var stateNode = this.machine.idMap[stateIdentifier.slice(STATE_IDENTIFIER.length)];

      if (!stateNode) {
        throw new Error("Unable to find state node '".concat(stateIdentifier, "'"));
      }

      return stateNode.path;
    }

    return (0,utils/* toStatePath */.Q9)(stateIdentifier, this.delimiter);
  };

  Object.defineProperty(StateNode.prototype, "initialStateValue", {
    get: function () {
      var _a;

      if (this.__cache.initialStateValue) {
        return this.__cache.initialStateValue;
      }

      var initialStateValue;

      if (this.type === 'parallel') {
        initialStateValue = (0,utils/* mapFilterValues */.ib)(this.states, function (state) {
          return state.initialStateValue || EMPTY_OBJECT;
        }, function (stateNode) {
          return !(stateNode.type === 'history');
        });
      } else if (this.initial !== undefined) {
        if (!this.states[this.initial]) {
          throw new Error("Initial state '".concat(this.initial, "' not found on '").concat(this.key, "'"));
        }

        initialStateValue = (0,stateUtils/* isLeafNode */.N9)(this.states[this.initial]) ? this.initial : (_a = {}, _a[this.initial] = this.states[this.initial].initialStateValue, _a);
      } else {
        // The finite state value of a machine without child states is just an empty object
        initialStateValue = {};
      }

      this.__cache.initialStateValue = initialStateValue;
      return this.__cache.initialStateValue;
    },
    enumerable: false,
    configurable: true
  });

  StateNode.prototype.getInitialState = function (stateValue, context) {
    this._init(); // TODO: this should be in the constructor (see note in constructor)


    var configuration = this.getStateNodes(stateValue);
    return this.resolveTransition({
      configuration: configuration,
      exitSet: [],
      transitions: [],
      source: undefined,
      actions: []
    }, undefined, context !== null && context !== void 0 ? context : this.machine.context, undefined);
  };

  Object.defineProperty(StateNode.prototype, "initialState", {
    /**
     * The initial State instance, which includes all actions to be executed from
     * entering the initial state.
     */
    get: function () {
      var initialStateValue = this.initialStateValue;

      if (!initialStateValue) {
        throw new Error("Cannot retrieve initial state from simple state '".concat(this.id, "'."));
      }

      return this.getInitialState(initialStateValue);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(StateNode.prototype, "target", {
    /**
     * The target state value of the history state node, if it exists. This represents the
     * default state value to transition to if no history value exists yet.
     */
    get: function () {
      var target;

      if (this.type === 'history') {
        var historyConfig = this.config;

        if ((0,utils/* isString */.HD)(historyConfig.target)) {
          target = isStateId(historyConfig.target) ? (0,utils/* pathToStateValue */.on)(this.machine.getStateNodeById(historyConfig.target).path.slice(this.path.length - 1)) : historyConfig.target;
        } else {
          target = historyConfig.target;
        }
      }

      return target;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Returns the leaf nodes from a state path relative to this state node.
   *
   * @param relativeStateId The relative state path to retrieve the state nodes
   * @param history The previous state to retrieve history
   * @param resolve Whether state nodes should resolve to initial child state nodes
   */

  StateNode.prototype.getRelativeStateNodes = function (relativeStateId, historyValue, resolve) {
    if (resolve === void 0) {
      resolve = true;
    }

    return resolve ? relativeStateId.type === 'history' ? relativeStateId.resolveHistory(historyValue) : relativeStateId.initialStateNodes : [relativeStateId];
  };

  Object.defineProperty(StateNode.prototype, "initialStateNodes", {
    get: function () {
      var _this = this;

      if ((0,stateUtils/* isLeafNode */.N9)(this)) {
        return [this];
      } // Case when state node is compound but no initial state is defined


      if (this.type === 'compound' && !this.initial) {
        if (!environment/* IS_PRODUCTION */.M) {
          (0,utils/* warn */.ZK)(false, "Compound state node '".concat(this.id, "' has no initial state."));
        }

        return [this];
      }

      var initialStateNodePaths = (0,utils/* toStatePaths */.SA)(this.initialStateValue);
      return (0,utils/* flatten */.xH)(initialStateNodePaths.map(function (initialPath) {
        return _this.getFromRelativePath(initialPath);
      }));
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Retrieves state nodes from a relative path to this state node.
   *
   * @param relativePath The relative path from this state node
   * @param historyValue
   */

  StateNode.prototype.getFromRelativePath = function (relativePath) {
    if (!relativePath.length) {
      return [this];
    }

    var _a = (0,_tslib/* __read */.CR)(relativePath),
        stateKey = _a[0],
        childStatePath = _a.slice(1);

    if (!this.states) {
      throw new Error("Cannot retrieve subPath '".concat(stateKey, "' from node with no states"));
    }

    var childStateNode = this.getStateNode(stateKey);

    if (childStateNode.type === 'history') {
      return childStateNode.resolveHistory();
    }

    if (!this.states[stateKey]) {
      throw new Error("Child state '".concat(stateKey, "' does not exist on '").concat(this.id, "'"));
    }

    return this.states[stateKey].getFromRelativePath(childStatePath);
  };

  StateNode.prototype.historyValue = function (relativeStateValue) {
    if (!Object.keys(this.states).length) {
      return undefined;
    }

    return {
      current: relativeStateValue || this.initialStateValue,
      states: (0,utils/* mapFilterValues */.ib)(this.states, function (stateNode, key) {
        if (!relativeStateValue) {
          return stateNode.historyValue();
        }

        var subStateValue = (0,utils/* isString */.HD)(relativeStateValue) ? undefined : relativeStateValue[key];
        return stateNode.historyValue(subStateValue || stateNode.initialStateValue);
      }, function (stateNode) {
        return !stateNode.history;
      })
    };
  };
  /**
   * Resolves to the historical value(s) of the parent state node,
   * represented by state nodes.
   *
   * @param historyValue
   */


  StateNode.prototype.resolveHistory = function (historyValue) {
    var _this = this;

    if (this.type !== 'history') {
      return [this];
    }

    var parent = this.parent;

    if (!historyValue) {
      var historyTarget = this.target;
      return historyTarget ? (0,utils/* flatten */.xH)((0,utils/* toStatePaths */.SA)(historyTarget).map(function (relativeChildPath) {
        return parent.getFromRelativePath(relativeChildPath);
      })) : parent.initialStateNodes;
    }

    var subHistoryValue = (0,utils/* nestedPath */.gk)(parent.path, 'states')(historyValue).current;

    if ((0,utils/* isString */.HD)(subHistoryValue)) {
      return [parent.getStateNode(subHistoryValue)];
    }

    return (0,utils/* flatten */.xH)((0,utils/* toStatePaths */.SA)(subHistoryValue).map(function (subStatePath) {
      return _this.history === 'deep' ? parent.getFromRelativePath(subStatePath) : [parent.states[subStatePath[0]]];
    }));
  };

  Object.defineProperty(StateNode.prototype, "stateIds", {
    /**
     * All the state node IDs of this state node and its descendant state nodes.
     */
    get: function () {
      var _this = this;

      var childStateIds = (0,utils/* flatten */.xH)(Object.keys(this.states).map(function (stateKey) {
        return _this.states[stateKey].stateIds;
      }));
      return [this.id].concat(childStateIds);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(StateNode.prototype, "events", {
    /**
     * All the event types accepted by this state node and its descendants.
     */
    get: function () {
      var e_8, _a, e_9, _b;

      if (this.__cache.events) {
        return this.__cache.events;
      }

      var states = this.states;
      var events = new Set(this.ownEvents);

      if (states) {
        try {
          for (var _c = (0,_tslib/* __values */.XA)(Object.keys(states)), _d = _c.next(); !_d.done; _d = _c.next()) {
            var stateId = _d.value;
            var state = states[stateId];

            if (state.states) {
              try {
                for (var _e = (e_9 = void 0, (0,_tslib/* __values */.XA)(state.events)), _f = _e.next(); !_f.done; _f = _e.next()) {
                  var event_1 = _f.value;
                  events.add("".concat(event_1));
                }
              } catch (e_9_1) {
                e_9 = {
                  error: e_9_1
                };
              } finally {
                try {
                  if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                } finally {
                  if (e_9) throw e_9.error;
                }
              }
            }
          }
        } catch (e_8_1) {
          e_8 = {
            error: e_8_1
          };
        } finally {
          try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
          } finally {
            if (e_8) throw e_8.error;
          }
        }
      }

      return this.__cache.events = Array.from(events);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(StateNode.prototype, "ownEvents", {
    /**
     * All the events that have transitions directly from this state node.
     *
     * Excludes any inert events.
     */
    get: function () {
      var events = new Set(this.transitions.filter(function (transition) {
        return !(!transition.target && !transition.actions.length && transition.internal);
      }).map(function (transition) {
        return transition.eventType;
      }));
      return Array.from(events);
    },
    enumerable: false,
    configurable: true
  });

  StateNode.prototype.resolveTarget = function (_target) {
    var _this = this;

    if (_target === undefined) {
      // an undefined target signals that the state node should not transition from that state when receiving that event
      return undefined;
    }

    return _target.map(function (target) {
      if (!(0,utils/* isString */.HD)(target)) {
        return target;
      }

      var isInternalTarget = target[0] === _this.delimiter; // If internal target is defined on machine,
      // do not include machine key on target

      if (isInternalTarget && !_this.parent) {
        return _this.getStateNodeByPath(target.slice(1));
      }

      var resolvedTarget = isInternalTarget ? _this.key + target : target;

      if (_this.parent) {
        try {
          var targetStateNode = _this.parent.getStateNodeByPath(resolvedTarget);

          return targetStateNode;
        } catch (err) {
          throw new Error("Invalid transition definition for state node '".concat(_this.id, "':\n").concat(err.message));
        }
      } else {
        return _this.getStateNodeByPath(resolvedTarget);
      }
    });
  };

  StateNode.prototype.formatTransition = function (transitionConfig) {
    var _this = this;

    var normalizedTarget = (0,utils/* normalizeTarget */.rg)(transitionConfig.target);
    var internal = 'internal' in transitionConfig ? transitionConfig.internal : normalizedTarget ? normalizedTarget.some(function (_target) {
      return (0,utils/* isString */.HD)(_target) && _target[0] === _this.delimiter;
    }) : true;
    var guards = this.machine.options.guards;
    var target = this.resolveTarget(normalizedTarget);

    var transition = (0,_tslib/* __assign */.pi)((0,_tslib/* __assign */.pi)({}, transitionConfig), {
      actions: (0,es_actions.toActionObjects)((0,utils/* toArray */.qo)(transitionConfig.actions)),
      cond: (0,utils/* toGuard */.Qi)(transitionConfig.cond, guards),
      target: target,
      source: this,
      internal: internal,
      eventType: transitionConfig.event,
      toJSON: function () {
        return (0,_tslib/* __assign */.pi)((0,_tslib/* __assign */.pi)({}, transition), {
          target: transition.target ? transition.target.map(function (t) {
            return "#".concat(t.id);
          }) : undefined,
          source: "#".concat(_this.id)
        });
      }
    });

    return transition;
  };

  StateNode.prototype.formatTransitions = function () {
    var e_10, _a;

    var _this = this;

    var onConfig;

    if (!this.config.on) {
      onConfig = [];
    } else if (Array.isArray(this.config.on)) {
      onConfig = this.config.on;
    } else {
      var _b = this.config.on,
          _c = WILDCARD,
          _d = _b[_c],
          wildcardConfigs = _d === void 0 ? [] : _d,
          strictTransitionConfigs_1 = (0,_tslib/* __rest */._T)(_b, [typeof _c === "symbol" ? _c : _c + ""]);

      onConfig = (0,utils/* flatten */.xH)(Object.keys(strictTransitionConfigs_1).map(function (key) {
        if (!environment/* IS_PRODUCTION */.M && key === NULL_EVENT) {
          (0,utils/* warn */.ZK)(false, "Empty string transition configs (e.g., `{ on: { '': ... }}`) for transient transitions are deprecated. Specify the transition in the `{ always: ... }` property instead. " + "Please check the `on` configuration for \"#".concat(_this.id, "\"."));
        }

        var transitionConfigArray = (0,utils/* toTransitionConfigArray */.jh)(key, strictTransitionConfigs_1[key]);

        if (!environment/* IS_PRODUCTION */.M) {
          validateArrayifiedTransitions(_this, key, transitionConfigArray);
        }

        return transitionConfigArray;
      }).concat((0,utils/* toTransitionConfigArray */.jh)(WILDCARD, wildcardConfigs)));
    }

    var eventlessConfig = this.config.always ? (0,utils/* toTransitionConfigArray */.jh)('', this.config.always) : [];
    var doneConfig = this.config.onDone ? (0,utils/* toTransitionConfigArray */.jh)(String((0,es_actions.done)(this.id)), this.config.onDone) : [];

    if (!environment/* IS_PRODUCTION */.M) {
      (0,utils/* warn */.ZK)(!(this.config.onDone && !this.parent), "Root nodes cannot have an \".onDone\" transition. Please check the config of \"".concat(this.id, "\"."));
    }

    var invokeConfig = (0,utils/* flatten */.xH)(this.invoke.map(function (invokeDef) {
      var settleTransitions = [];

      if (invokeDef.onDone) {
        settleTransitions.push.apply(settleTransitions, (0,_tslib/* __spreadArray */.ev)([], (0,_tslib/* __read */.CR)((0,utils/* toTransitionConfigArray */.jh)(String((0,es_actions.doneInvoke)(invokeDef.id)), invokeDef.onDone)), false));
      }

      if (invokeDef.onError) {
        settleTransitions.push.apply(settleTransitions, (0,_tslib/* __spreadArray */.ev)([], (0,_tslib/* __read */.CR)((0,utils/* toTransitionConfigArray */.jh)(String((0,es_actions.error)(invokeDef.id)), invokeDef.onError)), false));
      }

      return settleTransitions;
    }));
    var delayedTransitions = this.after;
    var formattedTransitions = (0,utils/* flatten */.xH)((0,_tslib/* __spreadArray */.ev)((0,_tslib/* __spreadArray */.ev)((0,_tslib/* __spreadArray */.ev)((0,_tslib/* __spreadArray */.ev)([], (0,_tslib/* __read */.CR)(doneConfig), false), (0,_tslib/* __read */.CR)(invokeConfig), false), (0,_tslib/* __read */.CR)(onConfig), false), (0,_tslib/* __read */.CR)(eventlessConfig), false).map(function (transitionConfig) {
      return (0,utils/* toArray */.qo)(transitionConfig).map(function (transition) {
        return _this.formatTransition(transition);
      });
    }));

    try {
      for (var delayedTransitions_1 = (0,_tslib/* __values */.XA)(delayedTransitions), delayedTransitions_1_1 = delayedTransitions_1.next(); !delayedTransitions_1_1.done; delayedTransitions_1_1 = delayedTransitions_1.next()) {
        var delayedTransition = delayedTransitions_1_1.value;
        formattedTransitions.push(delayedTransition);
      }
    } catch (e_10_1) {
      e_10 = {
        error: e_10_1
      };
    } finally {
      try {
        if (delayedTransitions_1_1 && !delayedTransitions_1_1.done && (_a = delayedTransitions_1.return)) _a.call(delayedTransitions_1);
      } finally {
        if (e_10) throw e_10.error;
      }
    }

    return formattedTransitions;
  };

  return StateNode;
}();




/***/ }),

/***/ 3056:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CR: () => (/* binding */ __read),
/* harmony export */   XA: () => (/* binding */ __values),
/* harmony export */   _T: () => (/* binding */ __rest),
/* harmony export */   ev: () => (/* binding */ __spreadArray),
/* harmony export */   pi: () => (/* binding */ __assign)
/* harmony export */ });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}




/***/ }),

/***/ 3884:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   after: () => (/* binding */ after),
/* harmony export */   assign: () => (/* binding */ assign),
/* harmony export */   cancel: () => (/* binding */ cancel),
/* harmony export */   choose: () => (/* binding */ choose),
/* harmony export */   doneState: () => (/* binding */ doneState),
/* harmony export */   error: () => (/* binding */ error),
/* harmony export */   errorExecution: () => (/* binding */ errorExecution),
/* harmony export */   errorPlatform: () => (/* binding */ errorPlatform),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   invoke: () => (/* binding */ invoke),
/* harmony export */   log: () => (/* binding */ log),
/* harmony export */   nullEvent: () => (/* binding */ nullEvent),
/* harmony export */   pure: () => (/* binding */ pure),
/* harmony export */   raise: () => (/* binding */ raise),
/* harmony export */   send: () => (/* binding */ send),
/* harmony export */   start: () => (/* binding */ start),
/* harmony export */   stop: () => (/* binding */ stop),
/* harmony export */   update: () => (/* binding */ update)
/* harmony export */ });
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9043);


var start = _types_js__WEBPACK_IMPORTED_MODULE_0__/* .ActionTypes */ .M.Start;
var stop = _types_js__WEBPACK_IMPORTED_MODULE_0__/* .ActionTypes */ .M.Stop;
var raise = _types_js__WEBPACK_IMPORTED_MODULE_0__/* .ActionTypes */ .M.Raise;
var send = _types_js__WEBPACK_IMPORTED_MODULE_0__/* .ActionTypes */ .M.Send;
var cancel = _types_js__WEBPACK_IMPORTED_MODULE_0__/* .ActionTypes */ .M.Cancel;
var nullEvent = _types_js__WEBPACK_IMPORTED_MODULE_0__/* .ActionTypes */ .M.NullEvent;
var assign = _types_js__WEBPACK_IMPORTED_MODULE_0__/* .ActionTypes */ .M.Assign;
var after = _types_js__WEBPACK_IMPORTED_MODULE_0__/* .ActionTypes */ .M.After;
var doneState = _types_js__WEBPACK_IMPORTED_MODULE_0__/* .ActionTypes */ .M.DoneState;
var log = _types_js__WEBPACK_IMPORTED_MODULE_0__/* .ActionTypes */ .M.Log;
var init = _types_js__WEBPACK_IMPORTED_MODULE_0__/* .ActionTypes */ .M.Init;
var invoke = _types_js__WEBPACK_IMPORTED_MODULE_0__/* .ActionTypes */ .M.Invoke;
var errorExecution = _types_js__WEBPACK_IMPORTED_MODULE_0__/* .ActionTypes */ .M.ErrorExecution;
var errorPlatform = _types_js__WEBPACK_IMPORTED_MODULE_0__/* .ActionTypes */ .M.ErrorPlatform;
var error = _types_js__WEBPACK_IMPORTED_MODULE_0__/* .ActionTypes */ .M.ErrorCustom;
var update = _types_js__WEBPACK_IMPORTED_MODULE_0__/* .ActionTypes */ .M.Update;
var choose = _types_js__WEBPACK_IMPORTED_MODULE_0__/* .ActionTypes */ .M.Choose;
var pure = _types_js__WEBPACK_IMPORTED_MODULE_0__/* .ActionTypes */ .M.Pure;




/***/ }),

/***/ 375:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   actionTypes: () => (/* reexport module object */ _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   after: () => (/* binding */ after),
/* harmony export */   assign: () => (/* binding */ assign),
/* harmony export */   cancel: () => (/* binding */ cancel),
/* harmony export */   choose: () => (/* binding */ choose),
/* harmony export */   done: () => (/* binding */ done),
/* harmony export */   doneInvoke: () => (/* binding */ doneInvoke),
/* harmony export */   error: () => (/* binding */ error),
/* harmony export */   escalate: () => (/* binding */ escalate),
/* harmony export */   forwardTo: () => (/* binding */ forwardTo),
/* harmony export */   getActionFunction: () => (/* binding */ getActionFunction),
/* harmony export */   initEvent: () => (/* binding */ initEvent),
/* harmony export */   isActionObject: () => (/* binding */ isActionObject),
/* harmony export */   log: () => (/* binding */ log),
/* harmony export */   pure: () => (/* binding */ pure),
/* harmony export */   raise: () => (/* binding */ raise),
/* harmony export */   resolveActions: () => (/* binding */ resolveActions),
/* harmony export */   resolveLog: () => (/* binding */ resolveLog),
/* harmony export */   resolveRaise: () => (/* binding */ resolveRaise),
/* harmony export */   resolveSend: () => (/* binding */ resolveSend),
/* harmony export */   resolveStop: () => (/* binding */ resolveStop),
/* harmony export */   respond: () => (/* binding */ respond),
/* harmony export */   send: () => (/* binding */ send),
/* harmony export */   sendParent: () => (/* binding */ sendParent),
/* harmony export */   sendTo: () => (/* binding */ sendTo),
/* harmony export */   sendUpdate: () => (/* binding */ sendUpdate),
/* harmony export */   start: () => (/* binding */ start),
/* harmony export */   stop: () => (/* binding */ stop),
/* harmony export */   toActionObject: () => (/* binding */ toActionObject),
/* harmony export */   toActionObjects: () => (/* binding */ toActionObjects),
/* harmony export */   toActivityDefinition: () => (/* binding */ toActivityDefinition)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3056);
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9043);
/* harmony import */ var _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3884);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9823);
/* harmony import */ var _environment_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4066);








var initEvent = /*#__PURE__*/(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .toSCXMLEvent */ .g5)({
  type: _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.init
});
function getActionFunction(actionType, actionFunctionMap) {
  return actionFunctionMap ? actionFunctionMap[actionType] || undefined : undefined;
}
function toActionObject(action, actionFunctionMap) {
  var actionObject;

  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .isString */ .HD)(action) || typeof action === 'number') {
    var exec = getActionFunction(action, actionFunctionMap);

    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .isFunction */ .mf)(exec)) {
      actionObject = {
        type: action,
        exec: exec
      };
    } else if (exec) {
      actionObject = exec;
    } else {
      actionObject = {
        type: action,
        exec: undefined
      };
    }
  } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .isFunction */ .mf)(action)) {
    actionObject = {
      // Convert action to string if unnamed
      type: action.name || action.toString(),
      exec: action
    };
  } else {
    var exec = getActionFunction(action.type, actionFunctionMap);

    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .isFunction */ .mf)(exec)) {
      actionObject = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__/* .__assign */ .pi)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__/* .__assign */ .pi)({}, action), {
        exec: exec
      });
    } else if (exec) {
      var actionType = exec.type || action.type;
      actionObject = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__/* .__assign */ .pi)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__/* .__assign */ .pi)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__/* .__assign */ .pi)({}, exec), action), {
        type: actionType
      });
    } else {
      actionObject = action;
    }
  }

  return actionObject;
}
var toActionObjects = function (action, actionFunctionMap) {
  if (!action) {
    return [];
  }

  var actions = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .isArray */ .kJ)(action) ? action : [action];
  return actions.map(function (subAction) {
    return toActionObject(subAction, actionFunctionMap);
  });
};
function toActivityDefinition(action) {
  var actionObject = toActionObject(action);
  return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__/* .__assign */ .pi)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__/* .__assign */ .pi)({
    id: (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .isString */ .HD)(action) ? action : actionObject.id
  }, actionObject), {
    type: actionObject.type
  });
}
/**
 * Raises an event. This places the event in the internal event queue, so that
 * the event is immediately consumed by the machine in the current step.
 *
 * @param eventType The event to raise.
 */

function raise(event, options) {
  return {
    type: _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.raise,
    event: typeof event === 'function' ? event : (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .toEventObject */ ._v)(event),
    delay: options ? options.delay : undefined,
    id: options === null || options === void 0 ? void 0 : options.id
  };
}
function resolveRaise(action, ctx, _event, delaysMap) {
  var meta = {
    _event: _event
  };
  var resolvedEvent = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .toSCXMLEvent */ .g5)((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .isFunction */ .mf)(action.event) ? action.event(ctx, _event.data, meta) : action.event);
  var resolvedDelay;

  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .isString */ .HD)(action.delay)) {
    var configDelay = delaysMap && delaysMap[action.delay];
    resolvedDelay = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .isFunction */ .mf)(configDelay) ? configDelay(ctx, _event.data, meta) : configDelay;
  } else {
    resolvedDelay = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .isFunction */ .mf)(action.delay) ? action.delay(ctx, _event.data, meta) : action.delay;
  }

  return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__/* .__assign */ .pi)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__/* .__assign */ .pi)({}, action), {
    type: _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.raise,
    _event: resolvedEvent,
    delay: resolvedDelay
  });
}
/**
 * Sends an event. This returns an action that will be read by an interpreter to
 * send the event in the next step, after the current step is finished executing.
 *
 * @deprecated Use the `sendTo(...)` action creator instead.
 *
 * @param event The event to send.
 * @param options Options to pass into the send event:
 *  - `id` - The unique send event identifier (used with `cancel()`).
 *  - `delay` - The number of milliseconds to delay the sending of the event.
 *  - `to` - The target of this event (by default, the machine the event was sent from).
 */

function send(event, options) {
  return {
    to: options ? options.to : undefined,
    type: _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.send,
    event: (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .isFunction */ .mf)(event) ? event : (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .toEventObject */ ._v)(event),
    delay: options ? options.delay : undefined,
    // TODO: don't auto-generate IDs here like that
    // there is too big chance of the ID collision
    id: options && options.id !== undefined ? options.id : (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .isFunction */ .mf)(event) ? event.name : (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .getEventType */ .x6)(event)
  };
}
function resolveSend(action, ctx, _event, delaysMap) {
  var meta = {
    _event: _event
  }; // TODO: helper function for resolving Expr

  var resolvedEvent = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .toSCXMLEvent */ .g5)((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .isFunction */ .mf)(action.event) ? action.event(ctx, _event.data, meta) : action.event);
  var resolvedDelay;

  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .isString */ .HD)(action.delay)) {
    var configDelay = delaysMap && delaysMap[action.delay];
    resolvedDelay = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .isFunction */ .mf)(configDelay) ? configDelay(ctx, _event.data, meta) : configDelay;
  } else {
    resolvedDelay = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .isFunction */ .mf)(action.delay) ? action.delay(ctx, _event.data, meta) : action.delay;
  }

  var resolvedTarget = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .isFunction */ .mf)(action.to) ? action.to(ctx, _event.data, meta) : action.to;
  return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__/* .__assign */ .pi)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__/* .__assign */ .pi)({}, action), {
    to: resolvedTarget,
    _event: resolvedEvent,
    event: resolvedEvent.data,
    delay: resolvedDelay
  });
}
/**
 * Sends an event to this machine's parent.
 *
 * @param event The event to send to the parent machine.
 * @param options Options to pass into the send event.
 */

function sendParent(event, options) {
  return send(event, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__/* .__assign */ .pi)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__/* .__assign */ .pi)({}, options), {
    to: _types_js__WEBPACK_IMPORTED_MODULE_3__/* .SpecialTargets */ .K.Parent
  }));
}
/**
 * Sends an event to an actor.
 *
 * @param actor The `ActorRef` to send the event to.
 * @param event The event to send, or an expression that evaluates to the event to send
 * @param options Send action options
 * @returns An XState send action object
 */

function sendTo(actor, event, options) {
  return send(event, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__/* .__assign */ .pi)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__/* .__assign */ .pi)({}, options), {
    to: actor
  }));
}
/**
 * Sends an update event to this machine's parent.
 */

function sendUpdate() {
  return sendParent(_actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.update);
}
/**
 * Sends an event back to the sender of the original event.
 *
 * @param event The event to send back to the sender
 * @param options Options to pass into the send event
 */

function respond(event, options) {
  return send(event, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__/* .__assign */ .pi)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__/* .__assign */ .pi)({}, options), {
    to: function (_, __, _a) {
      var _event = _a._event;
      return _event.origin; // TODO: handle when _event.origin is undefined
    }
  }));
}

var defaultLogExpr = function (context, event) {
  return {
    context: context,
    event: event
  };
};
/**
 *
 * @param expr The expression function to evaluate which will be logged.
 *  Takes in 2 arguments:
 *  - `ctx` - the current state context
 *  - `event` - the event that caused this action to be executed.
 * @param label The label to give to the logged expression.
 */


function log(expr, label) {
  if (expr === void 0) {
    expr = defaultLogExpr;
  }

  return {
    type: _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.log,
    label: label,
    expr: expr
  };
}
var resolveLog = function (action, ctx, _event) {
  return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__/* .__assign */ .pi)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__/* .__assign */ .pi)({}, action), {
    value: (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .isString */ .HD)(action.expr) ? action.expr : action.expr(ctx, _event.data, {
      _event: _event
    })
  });
};
/**
 * Cancels an in-flight `send(...)` action. A canceled sent action will not
 * be executed, nor will its event be sent, unless it has already been sent
 * (e.g., if `cancel(...)` is called after the `send(...)` action's `delay`).
 *
 * @param sendId The `id` of the `send(...)` action to cancel.
 */

var cancel = function (sendId) {
  return {
    type: _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.cancel,
    sendId: sendId
  };
};
/**
 * Starts an activity.
 *
 * @param activity The activity to start.
 */

function start(activity) {
  var activityDef = toActivityDefinition(activity);
  return {
    type: _types_js__WEBPACK_IMPORTED_MODULE_3__/* .ActionTypes */ .M.Start,
    activity: activityDef,
    exec: undefined
  };
}
/**
 * Stops an activity.
 *
 * @param actorRef The activity to stop.
 */

function stop(actorRef) {
  var activity = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .isFunction */ .mf)(actorRef) ? actorRef : toActivityDefinition(actorRef);
  return {
    type: _types_js__WEBPACK_IMPORTED_MODULE_3__/* .ActionTypes */ .M.Stop,
    activity: activity,
    exec: undefined
  };
}
function resolveStop(action, context, _event) {
  var actorRefOrString = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .isFunction */ .mf)(action.activity) ? action.activity(context, _event.data) : action.activity;
  var resolvedActorRef = typeof actorRefOrString === 'string' ? {
    id: actorRefOrString
  } : actorRefOrString;
  var actionObject = {
    type: _types_js__WEBPACK_IMPORTED_MODULE_3__/* .ActionTypes */ .M.Stop,
    activity: resolvedActorRef
  };
  return actionObject;
}
/**
 * Updates the current context of the machine.
 *
 * @param assignment An object that represents the partial context to update.
 */

var assign = function (assignment) {
  return {
    type: _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.assign,
    assignment: assignment
  };
};
function isActionObject(action) {
  return typeof action === 'object' && 'type' in action;
}
/**
 * Returns an event type that represents an implicit event that
 * is sent after the specified `delay`.
 *
 * @param delayRef The delay in milliseconds
 * @param id The state node ID where this event is handled
 */

function after(delayRef, id) {
  var idSuffix = id ? "#".concat(id) : '';
  return "".concat(_types_js__WEBPACK_IMPORTED_MODULE_3__/* .ActionTypes */ .M.After, "(").concat(delayRef, ")").concat(idSuffix);
}
/**
 * Returns an event that represents that a final state node
 * has been reached in the parent state node.
 *
 * @param id The final state node's parent state node `id`
 * @param data The data to pass into the event
 */

function done(id, data) {
  var type = "".concat(_types_js__WEBPACK_IMPORTED_MODULE_3__/* .ActionTypes */ .M.DoneState, ".").concat(id);
  var eventObject = {
    type: type,
    data: data
  };

  eventObject.toString = function () {
    return type;
  };

  return eventObject;
}
/**
 * Returns an event that represents that an invoked service has terminated.
 *
 * An invoked service is terminated when it has reached a top-level final state node,
 * but not when it is canceled.
 *
 * @param id The final state node ID
 * @param data The data to pass into the event
 */

function doneInvoke(id, data) {
  var type = "".concat(_types_js__WEBPACK_IMPORTED_MODULE_3__/* .ActionTypes */ .M.DoneInvoke, ".").concat(id);
  var eventObject = {
    type: type,
    data: data
  };

  eventObject.toString = function () {
    return type;
  };

  return eventObject;
}
function error(id, data) {
  var type = "".concat(_types_js__WEBPACK_IMPORTED_MODULE_3__/* .ActionTypes */ .M.ErrorPlatform, ".").concat(id);
  var eventObject = {
    type: type,
    data: data
  };

  eventObject.toString = function () {
    return type;
  };

  return eventObject;
}
function pure(getActions) {
  return {
    type: _types_js__WEBPACK_IMPORTED_MODULE_3__/* .ActionTypes */ .M.Pure,
    get: getActions
  };
}
/**
 * Forwards (sends) an event to a specified service.
 *
 * @param target The target service to forward the event to.
 * @param options Options to pass into the send action creator.
 */

function forwardTo(target, options) {
  if (!_environment_js__WEBPACK_IMPORTED_MODULE_4__/* .IS_PRODUCTION */ .M && (!target || typeof target === 'function')) {
    var originalTarget_1 = target;

    target = function () {
      var args = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }

      var resolvedTarget = typeof originalTarget_1 === 'function' ? originalTarget_1.apply(void 0, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__/* .__spreadArray */ .ev)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__/* .__read */ .CR)(args), false)) : originalTarget_1;

      if (!resolvedTarget) {
        throw new Error("Attempted to forward event to undefined actor. This risks an infinite loop in the sender.");
      }

      return resolvedTarget;
    };
  }

  return send(function (_, event) {
    return event;
  }, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__/* .__assign */ .pi)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__/* .__assign */ .pi)({}, options), {
    to: target
  }));
}
/**
 * Escalates an error by sending it as an event to this machine's parent.
 *
 * @param errorData The error data to send, or the expression function that
 * takes in the `context`, `event`, and `meta`, and returns the error data to send.
 * @param options Options to pass into the send action creator.
 */

function escalate(errorData, options) {
  return sendParent(function (context, event, meta) {
    return {
      type: _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.error,
      data: (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .isFunction */ .mf)(errorData) ? errorData(context, event, meta) : errorData
    };
  }, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__/* .__assign */ .pi)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__/* .__assign */ .pi)({}, options), {
    to: _types_js__WEBPACK_IMPORTED_MODULE_3__/* .SpecialTargets */ .K.Parent
  }));
}
function choose(conds) {
  return {
    type: _types_js__WEBPACK_IMPORTED_MODULE_3__/* .ActionTypes */ .M.Choose,
    conds: conds
  };
}

var pluckAssigns = function (actionBlocks) {
  var e_1, _a;

  var assignActions = [];

  try {
    for (var actionBlocks_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__/* .__values */ .XA)(actionBlocks), actionBlocks_1_1 = actionBlocks_1.next(); !actionBlocks_1_1.done; actionBlocks_1_1 = actionBlocks_1.next()) {
      var block = actionBlocks_1_1.value;
      var i = 0;

      while (i < block.actions.length) {
        if (block.actions[i].type === _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.assign) {
          assignActions.push(block.actions[i]);
          block.actions.splice(i, 1);
          continue;
        }

        i++;
      }
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (actionBlocks_1_1 && !actionBlocks_1_1.done && (_a = actionBlocks_1.return)) _a.call(actionBlocks_1);
    } finally {
      if (e_1) throw e_1.error;
    }
  }

  return assignActions;
};

function resolveActions(machine, currentState, currentContext, _event, actionBlocks, predictableExec, preserveActionOrder) {
  if (preserveActionOrder === void 0) {
    preserveActionOrder = false;
  }

  var assignActions = preserveActionOrder ? [] : pluckAssigns(actionBlocks);
  var updatedContext = assignActions.length ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .updateContext */ .dt)(currentContext, _event, assignActions, currentState) : currentContext;
  var preservedContexts = preserveActionOrder ? [currentContext] : undefined;
  var deferredToBlockEnd = [];

  function handleAction(blockType, actionObject) {
    var _a;

    switch (actionObject.type) {
      case _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.raise:
        {
          var raisedAction = resolveRaise(actionObject, updatedContext, _event, machine.options.delays);

          if (predictableExec && typeof raisedAction.delay === 'number') {
            predictableExec(raisedAction, updatedContext, _event);
          }

          return raisedAction;
        }

      case _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.send:
        var sendAction = resolveSend(actionObject, updatedContext, _event, machine.options.delays); // TODO: fix ActionTypes.Init

        if (!_environment_js__WEBPACK_IMPORTED_MODULE_4__/* .IS_PRODUCTION */ .M) {
          var configuredDelay = actionObject.delay; // warn after resolving as we can create better contextual message here

          (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .warn */ .ZK)(!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .isString */ .HD)(configuredDelay) || typeof sendAction.delay === 'number', // tslint:disable-next-line:max-line-length
          "No delay reference for delay expression '".concat(configuredDelay, "' was found on machine '").concat(machine.id, "'"));
        }

        if (predictableExec && sendAction.to !== _types_js__WEBPACK_IMPORTED_MODULE_3__/* .SpecialTargets */ .K.Internal) {
          if (blockType === 'entry') {
            deferredToBlockEnd.push(sendAction);
          } else {
            predictableExec(sendAction, updatedContext, _event);
          }
        }

        return sendAction;

      case _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.log:
        {
          var resolved = resolveLog(actionObject, updatedContext, _event);
          predictableExec === null || predictableExec === void 0 ? void 0 : predictableExec(resolved, updatedContext, _event);
          return resolved;
        }

      case _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.choose:
        {
          var chooseAction = actionObject;
          var matchedActions = (_a = chooseAction.conds.find(function (condition) {
            var guard = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .toGuard */ .Qi)(condition.cond, machine.options.guards);
            return !guard || (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .evaluateGuard */ .vx)(machine, guard, updatedContext, _event, !predictableExec ? currentState : undefined);
          })) === null || _a === void 0 ? void 0 : _a.actions;

          if (!matchedActions) {
            return [];
          }

          var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__/* .__read */ .CR)(resolveActions(machine, currentState, updatedContext, _event, [{
            type: blockType,
            actions: toActionObjects((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .toArray */ .qo)(matchedActions), machine.options.actions)
          }], predictableExec, preserveActionOrder), 2),
              resolvedActionsFromChoose = _b[0],
              resolvedContextFromChoose = _b[1];

          updatedContext = resolvedContextFromChoose;
          preservedContexts === null || preservedContexts === void 0 ? void 0 : preservedContexts.push(updatedContext);
          return resolvedActionsFromChoose;
        }

      case _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.pure:
        {
          var matchedActions = actionObject.get(updatedContext, _event.data);

          if (!matchedActions) {
            return [];
          }

          var _c = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__/* .__read */ .CR)(resolveActions(machine, currentState, updatedContext, _event, [{
            type: blockType,
            actions: toActionObjects((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .toArray */ .qo)(matchedActions), machine.options.actions)
          }], predictableExec, preserveActionOrder), 2),
              resolvedActionsFromPure = _c[0],
              resolvedContext = _c[1];

          updatedContext = resolvedContext;
          preservedContexts === null || preservedContexts === void 0 ? void 0 : preservedContexts.push(updatedContext);
          return resolvedActionsFromPure;
        }

      case _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.stop:
        {
          var resolved = resolveStop(actionObject, updatedContext, _event);
          predictableExec === null || predictableExec === void 0 ? void 0 : predictableExec(resolved, currentContext, _event);
          return resolved;
        }

      case _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.assign:
        {
          updatedContext = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .updateContext */ .dt)(updatedContext, _event, [actionObject], !predictableExec ? currentState : undefined);
          preservedContexts === null || preservedContexts === void 0 ? void 0 : preservedContexts.push(updatedContext);
          break;
        }

      default:
        var resolvedActionObject = toActionObject(actionObject, machine.options.actions);
        var exec_1 = resolvedActionObject.exec;

        if (predictableExec) {
          predictableExec(resolvedActionObject, updatedContext, _event);
        } else if (exec_1 && preservedContexts) {
          var contextIndex_1 = preservedContexts.length - 1;

          var wrapped = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__/* .__assign */ .pi)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__/* .__assign */ .pi)({}, resolvedActionObject), {
            exec: function (_ctx) {
              var args = [];

              for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
              }

              exec_1.apply(void 0, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__/* .__spreadArray */ .ev)([preservedContexts[contextIndex_1]], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__/* .__read */ .CR)(args), false));
            }
          });

          resolvedActionObject = wrapped;
        }

        return resolvedActionObject;
    }
  }

  function processBlock(block) {
    var e_2, _a;

    var resolvedActions = [];

    try {
      for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__/* .__values */ .XA)(block.actions), _c = _b.next(); !_c.done; _c = _b.next()) {
        var action = _c.value;
        var resolved = handleAction(block.type, action);

        if (resolved) {
          resolvedActions = resolvedActions.concat(resolved);
        }
      }
    } catch (e_2_1) {
      e_2 = {
        error: e_2_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_2) throw e_2.error;
      }
    }

    deferredToBlockEnd.forEach(function (action) {
      predictableExec(action, updatedContext, _event);
    });
    deferredToBlockEnd.length = 0;
    return resolvedActions;
  }

  var resolvedActions = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .flatten */ .xH)(actionBlocks.map(processBlock));
  return [resolvedActions, updatedContext];
}




/***/ }),

/***/ 8199:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   YP: () => (/* binding */ spawnBehavior)
/* harmony export */ });
/* unused harmony exports fromPromise, fromReducer */
/* harmony import */ var _Actor_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8933);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9823);




/**
 * Returns an actor behavior from a reducer and its initial state.
 *
 * @param transition The pure reducer that returns the next state given the current state and event.
 * @param initialState The initial state of the reducer.
 * @returns An actor behavior
 */

function fromReducer(transition, initialState) {
  return {
    transition: transition,
    initialState: initialState
  };
}
function fromPromise(promiseFn) {
  var initialState = {
    error: undefined,
    data: undefined,
    status: 'pending'
  };
  return {
    transition: function (state, event, _a) {
      var parent = _a.parent,
          id = _a.id,
          observers = _a.observers;

      switch (event.type) {
        case 'fulfill':
          parent === null || parent === void 0 ? void 0 : parent.send(doneInvoke(id, event.data));
          return {
            error: undefined,
            data: event.data,
            status: 'fulfilled'
          };

        case 'reject':
          parent === null || parent === void 0 ? void 0 : parent.send(error(id, event.error));
          observers.forEach(function (observer) {
            observer.error(event.error);
          });
          return {
            error: event.error,
            data: undefined,
            status: 'rejected'
          };

        default:
          return state;
      }
    },
    initialState: initialState,
    start: function (_a) {
      var self = _a.self;
      promiseFn().then(function (data) {
        self.send({
          type: 'fulfill',
          data: data
        });
      }, function (reason) {
        self.send({
          type: 'reject',
          error: reason
        });
      });
      return initialState;
    }
  };
}
function spawnBehavior(behavior, options) {
  if (options === void 0) {
    options = {};
  }

  var state = behavior.initialState;
  var observers = new Set();
  var mailbox = [];
  var flushing = false;

  var flush = function () {
    if (flushing) {
      return;
    }

    flushing = true;

    while (mailbox.length > 0) {
      var event_1 = mailbox.shift();
      state = behavior.transition(state, event_1, actorCtx);
      observers.forEach(function (observer) {
        return observer.next(state);
      });
    }

    flushing = false;
  };

  var actor = (0,_Actor_js__WEBPACK_IMPORTED_MODULE_0__/* .toActorRef */ .vk)({
    id: options.id,
    send: function (event) {
      mailbox.push(event);
      flush();
    },
    getSnapshot: function () {
      return state;
    },
    subscribe: function (next, handleError, complete) {
      var observer = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__/* .toObserver */ .zM)(next, handleError, complete);
      observers.add(observer);
      observer.next(state);
      return {
        unsubscribe: function () {
          observers.delete(observer);
        }
      };
    }
  });
  var actorCtx = {
    parent: options.parent,
    self: actor,
    id: options.id || 'anonymous',
    observers: observers
  };
  state = behavior.start ? behavior.start(actorCtx) : state;
  return actor;
}




/***/ }),

/***/ 7353:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TV: () => (/* binding */ DEFAULT_GUARD_TYPE),
/* harmony export */   iS: () => (/* binding */ STATE_DELIMITER),
/* harmony export */   qP: () => (/* binding */ EMPTY_ACTIVITY_MAP),
/* harmony export */   rt: () => (/* binding */ TARGETLESS_KEY)
/* harmony export */ });
var STATE_DELIMITER = '.';
var EMPTY_ACTIVITY_MAP = {};
var DEFAULT_GUARD_TYPE = 'xstate.guard';
var TARGETLESS_KEY = '';




/***/ }),

/***/ 4066:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   M: () => (/* binding */ IS_PRODUCTION)
/* harmony export */ });
var IS_PRODUCTION = "production" === 'production';




/***/ }),

/***/ 4679:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  ActionTypes: () => (/* reexport */ types/* ActionTypes */.M),
  Interpreter: () => (/* reexport */ interpreter/* Interpreter */.Ng),
  InterpreterStatus: () => (/* reexport */ interpreter/* InterpreterStatus */.TM),
  Machine: () => (/* reexport */ Machine/* Machine */.J),
  SpecialTargets: () => (/* reexport */ types/* SpecialTargets */.K),
  State: () => (/* reexport */ State/* State */.ZM),
  StateNode: () => (/* reexport */ StateNode/* StateNode */.n),
  actions: () => (/* reexport */ actions),
  assign: () => (/* binding */ es_assign),
  cancel: () => (/* binding */ cancel),
  choose: () => (/* binding */ choose),
  createMachine: () => (/* reexport */ Machine/* createMachine */.C),
  createSchema: () => (/* reexport */ createSchema),
  doneInvoke: () => (/* binding */ doneInvoke),
  forwardTo: () => (/* binding */ forwardTo),
  interpret: () => (/* reexport */ interpreter/* interpret */.kJ),
  log: () => (/* binding */ log),
  mapState: () => (/* reexport */ mapState),
  matchState: () => (/* reexport */ matchState),
  matchesState: () => (/* reexport */ utils/* matchesState */.W),
  pure: () => (/* binding */ pure),
  raise: () => (/* binding */ raise),
  send: () => (/* binding */ send),
  sendParent: () => (/* binding */ sendParent),
  sendTo: () => (/* binding */ sendTo),
  sendUpdate: () => (/* binding */ sendUpdate),
  spawn: () => (/* reexport */ interpreter/* spawn */.Cs),
  spawnBehavior: () => (/* reexport */ behaviors/* spawnBehavior */.YP),
  stop: () => (/* binding */ stop),
  t: () => (/* reexport */ t),
  toActorRef: () => (/* reexport */ Actor/* toActorRef */.vk),
  toEventObject: () => (/* reexport */ utils/* toEventObject */._v),
  toObserver: () => (/* reexport */ utils/* toObserver */.zM),
  toSCXMLEvent: () => (/* reexport */ utils/* toSCXMLEvent */.g5)
});

// EXTERNAL MODULE: ./node_modules/xstate/es/actions.js
var actions = __webpack_require__(375);
// EXTERNAL MODULE: ./node_modules/xstate/es/Actor.js
var Actor = __webpack_require__(8933);
// EXTERNAL MODULE: ./node_modules/xstate/es/interpreter.js + 3 modules
var interpreter = __webpack_require__(9805);
// EXTERNAL MODULE: ./node_modules/xstate/es/Machine.js
var Machine = __webpack_require__(629);
// EXTERNAL MODULE: ./node_modules/xstate/es/_virtual/_tslib.js
var _tslib = __webpack_require__(3056);
// EXTERNAL MODULE: ./node_modules/xstate/es/utils.js
var utils = __webpack_require__(9823);
;// CONCATENATED MODULE: ./node_modules/xstate/es/mapState.js



function mapState(stateMap, stateId) {
  var e_1, _a;

  var foundStateId;

  try {
    for (var _b = (0,_tslib/* __values */.XA)(Object.keys(stateMap)), _c = _b.next(); !_c.done; _c = _b.next()) {
      var mappedStateId = _c.value;

      if ((0,utils/* matchesState */.W)(mappedStateId, stateId) && (!foundStateId || stateId.length > foundStateId.length)) {
        foundStateId = mappedStateId;
      }
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
    } finally {
      if (e_1) throw e_1.error;
    }
  }

  return stateMap[foundStateId];
}



// EXTERNAL MODULE: ./node_modules/xstate/es/State.js
var State = __webpack_require__(4911);
;// CONCATENATED MODULE: ./node_modules/xstate/es/match.js



function matchState(state, patterns, defaultValue) {
  var e_1, _a;

  var resolvedState = State/* State */.ZM.from(state, state instanceof State/* State */.ZM ? state.context : undefined);

  try {
    for (var patterns_1 = (0,_tslib/* __values */.XA)(patterns), patterns_1_1 = patterns_1.next(); !patterns_1_1.done; patterns_1_1 = patterns_1.next()) {
      var _b = (0,_tslib/* __read */.CR)(patterns_1_1.value, 2),
          stateValue = _b[0],
          getValue = _b[1];

      if (resolvedState.matches(stateValue)) {
        return getValue(resolvedState);
      }
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (patterns_1_1 && !patterns_1_1.done && (_a = patterns_1.return)) _a.call(patterns_1);
    } finally {
      if (e_1) throw e_1.error;
    }
  }

  return defaultValue(resolvedState);
}



;// CONCATENATED MODULE: ./node_modules/xstate/es/schema.js
function createSchema(schema) {
  return schema;
}
var t = createSchema;



// EXTERNAL MODULE: ./node_modules/xstate/es/StateNode.js + 1 modules
var StateNode = __webpack_require__(8889);
// EXTERNAL MODULE: ./node_modules/xstate/es/behaviors.js
var behaviors = __webpack_require__(8199);
// EXTERNAL MODULE: ./node_modules/xstate/es/types.js
var types = __webpack_require__(9043);
;// CONCATENATED MODULE: ./node_modules/xstate/es/index.js















var es_assign = actions.assign,
    cancel = actions.cancel,
    send = actions.send,
    sendTo = actions.sendTo,
    sendParent = actions.sendParent,
    sendUpdate = actions.sendUpdate,
    forwardTo = actions.forwardTo,
    doneInvoke = actions.doneInvoke,
    raise = actions.raise,
    log = actions.log,
    pure = actions.pure,
    choose = actions.choose,
    stop = actions.stop;




/***/ }),

/***/ 9805:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Ng: () => (/* binding */ Interpreter),
  TM: () => (/* binding */ InterpreterStatus),
  kJ: () => (/* binding */ interpret),
  Cs: () => (/* binding */ spawn)
});

// EXTERNAL MODULE: ./node_modules/xstate/es/_virtual/_tslib.js
var _tslib = __webpack_require__(3056);
// EXTERNAL MODULE: ./node_modules/xstate/es/types.js
var types = __webpack_require__(9043);
// EXTERNAL MODULE: ./node_modules/xstate/es/State.js
var State = __webpack_require__(4911);
// EXTERNAL MODULE: ./node_modules/xstate/es/actionTypes.js
var actionTypes = __webpack_require__(3884);
// EXTERNAL MODULE: ./node_modules/xstate/es/actions.js
var actions = __webpack_require__(375);
// EXTERNAL MODULE: ./node_modules/xstate/es/environment.js
var environment = __webpack_require__(4066);
// EXTERNAL MODULE: ./node_modules/xstate/es/utils.js
var utils = __webpack_require__(9823);
;// CONCATENATED MODULE: ./node_modules/xstate/es/scheduler.js


var defaultOptions = {
  deferEvents: false
};

var Scheduler =
/*#__PURE__*/

/** @class */
function () {
  function Scheduler(options) {
    this.processingEvent = false;
    this.queue = [];
    this.initialized = false;
    this.options = (0,_tslib/* __assign */.pi)((0,_tslib/* __assign */.pi)({}, defaultOptions), options);
  }

  Scheduler.prototype.initialize = function (callback) {
    this.initialized = true;

    if (callback) {
      if (!this.options.deferEvents) {
        this.schedule(callback);
        return;
      }

      this.process(callback);
    }

    this.flushEvents();
  };

  Scheduler.prototype.schedule = function (task) {
    if (!this.initialized || this.processingEvent) {
      this.queue.push(task);
      return;
    }

    if (this.queue.length !== 0) {
      throw new Error('Event queue should be empty when it is not processing events');
    }

    this.process(task);
    this.flushEvents();
  };

  Scheduler.prototype.clear = function () {
    this.queue = [];
  };

  Scheduler.prototype.flushEvents = function () {
    var nextCallback = this.queue.shift();

    while (nextCallback) {
      this.process(nextCallback);
      nextCallback = this.queue.shift();
    }
  };

  Scheduler.prototype.process = function (callback) {
    this.processingEvent = true;

    try {
      callback();
    } catch (e) {
      // there is no use to keep the future events
      // as the situation is not anymore the same
      this.clear();
      throw e;
    } finally {
      this.processingEvent = false;
    }
  };

  return Scheduler;
}();



// EXTERNAL MODULE: ./node_modules/xstate/es/Actor.js
var Actor = __webpack_require__(8933);
;// CONCATENATED MODULE: ./node_modules/xstate/es/registry.js
var children = /*#__PURE__*/new Map();
var sessionIdIndex = 0;
var registry = {
  bookId: function () {
    return "x:".concat(sessionIdIndex++);
  },
  register: function (id, actor) {
    children.set(id, actor);
    return id;
  },
  get: function (id) {
    return children.get(id);
  },
  free: function (id) {
    children.delete(id);
  }
};



;// CONCATENATED MODULE: ./node_modules/xstate/es/devTools.js


function getGlobal() {
  if (typeof globalThis !== 'undefined') {
    return globalThis;
  }

  if (typeof self !== 'undefined') {
    return self;
  }

  if (typeof window !== 'undefined') {
    return window;
  }

  if (typeof __webpack_require__.g !== 'undefined') {
    return __webpack_require__.g;
  }

  if (!environment/* IS_PRODUCTION */.M) {
    console.warn('XState could not find a global object in this environment. Please let the maintainers know and raise an issue here: https://github.com/statelyai/xstate/issues');
  }
}

function getDevTools() {
  var global = getGlobal();

  if (global && '__xstate__' in global) {
    return global.__xstate__;
  }

  return undefined;
}

function registerService(service) {
  if (!getGlobal()) {
    return;
  }

  var devTools = getDevTools();

  if (devTools) {
    devTools.register(service);
  }
}



// EXTERNAL MODULE: ./node_modules/xstate/es/serviceScope.js
var serviceScope = __webpack_require__(797);
// EXTERNAL MODULE: ./node_modules/xstate/es/behaviors.js
var behaviors = __webpack_require__(8199);
;// CONCATENATED MODULE: ./node_modules/xstate/es/interpreter.js














var DEFAULT_SPAWN_OPTIONS = {
  sync: false,
  autoForward: false
};
var InterpreterStatus;

(function (InterpreterStatus) {
  InterpreterStatus[InterpreterStatus["NotStarted"] = 0] = "NotStarted";
  InterpreterStatus[InterpreterStatus["Running"] = 1] = "Running";
  InterpreterStatus[InterpreterStatus["Stopped"] = 2] = "Stopped";
})(InterpreterStatus || (InterpreterStatus = {}));

var Interpreter =
/*#__PURE__*/

/** @class */
function () {
  /**
   * Creates a new Interpreter instance (i.e., service) for the given machine with the provided options, if any.
   *
   * @param machine The machine to be interpreted
   * @param options Interpreter options
   */
  function Interpreter(machine, options) {
    if (options === void 0) {
      options = Interpreter.defaultOptions;
    }

    var _this = this;

    this.machine = machine;
    this.delayedEventsMap = {};
    this.listeners = new Set();
    this.contextListeners = new Set();
    this.stopListeners = new Set();
    this.doneListeners = new Set();
    this.eventListeners = new Set();
    this.sendListeners = new Set();
    /**
     * Whether the service is started.
     */

    this.initialized = false;
    this.status = InterpreterStatus.NotStarted;
    this.children = new Map();
    this.forwardTo = new Set();
    this._outgoingQueue = [];
    /**
     * Alias for Interpreter.prototype.start
     */

    this.init = this.start;
    /**
     * Sends an event to the running interpreter to trigger a transition.
     *
     * An array of events (batched) can be sent as well, which will send all
     * batched events to the running interpreter. The listeners will be
     * notified only **once** when all events are processed.
     *
     * @param event The event(s) to send
     */

    this.send = function (event, payload) {
      if ((0,utils/* isArray */.kJ)(event)) {
        _this.batch(event);

        return _this.state;
      }

      var _event = (0,utils/* toSCXMLEvent */.g5)((0,utils/* toEventObject */._v)(event, payload));

      if (_this.status === InterpreterStatus.Stopped) {
        // do nothing
        if (!environment/* IS_PRODUCTION */.M) {
          (0,utils/* warn */.ZK)(false, "Event \"".concat(_event.name, "\" was sent to stopped service \"").concat(_this.machine.id, "\". This service has already reached its final state, and will not transition.\nEvent: ").concat(JSON.stringify(_event.data)));
        }

        return _this.state;
      }

      if (_this.status !== InterpreterStatus.Running && !_this.options.deferEvents) {
        throw new Error("Event \"".concat(_event.name, "\" was sent to uninitialized service \"").concat(_this.machine.id // tslint:disable-next-line:max-line-length
        , "\". Make sure .start() is called for this service, or set { deferEvents: true } in the service options.\nEvent: ").concat(JSON.stringify(_event.data)));
      }

      _this.scheduler.schedule(function () {
        // Forward copy of event to child actors
        _this.forward(_event);

        var nextState = _this._nextState(_event);

        _this.update(nextState, _event);
      });

      return _this._state; // TODO: deprecate (should return void)
      // tslint:disable-next-line:semicolon
    };

    this.sendTo = function (event, to, immediate) {
      var isParent = _this.parent && (to === types/* SpecialTargets */.K.Parent || _this.parent.id === to);
      var target = isParent ? _this.parent : (0,utils/* isString */.HD)(to) ? to === types/* SpecialTargets */.K.Internal ? _this : _this.children.get(to) || registry.get(to) : (0,utils/* isActor */.Bc)(to) ? to : undefined;

      if (!target) {
        if (!isParent) {
          throw new Error("Unable to send event to child '".concat(to, "' from service '").concat(_this.id, "'."));
        } // tslint:disable-next-line:no-console


        if (!environment/* IS_PRODUCTION */.M) {
          (0,utils/* warn */.ZK)(false, "Service '".concat(_this.id, "' has no parent: unable to send event ").concat(event.type));
        }

        return;
      }

      if ('machine' in target) {
        // perhaps those events should be rejected in the parent
        // but atm it doesn't have easy access to all of the information that is required to do it reliably
        if (_this.status !== InterpreterStatus.Stopped || _this.parent !== target || // we need to send events to the parent from exit handlers of a machine that reached its final state
        _this.state.done) {
          // Send SCXML events to machines
          var scxmlEvent = (0,_tslib/* __assign */.pi)((0,_tslib/* __assign */.pi)({}, event), {
            name: event.name === actionTypes.error ? "".concat((0,actions.error)(_this.id)) : event.name,
            origin: _this.sessionId
          });

          if (!immediate && _this.machine.config.predictableActionArguments) {
            _this._outgoingQueue.push([target, scxmlEvent]);
          } else {
            target.send(scxmlEvent);
          }
        }
      } else {
        // Send normal events to other targets
        if (!immediate && _this.machine.config.predictableActionArguments) {
          _this._outgoingQueue.push([target, event.data]);
        } else {
          target.send(event.data);
        }
      }
    };

    this._exec = function (action, context, _event, actionFunctionMap) {
      if (actionFunctionMap === void 0) {
        actionFunctionMap = _this.machine.options.actions;
      }

      var actionOrExec = action.exec || (0,actions.getActionFunction)(action.type, actionFunctionMap);
      var exec = (0,utils/* isFunction */.mf)(actionOrExec) ? actionOrExec : actionOrExec ? actionOrExec.exec : action.exec;

      if (exec) {
        try {
          return exec(context, _event.data, !_this.machine.config.predictableActionArguments ? {
            action: action,
            state: _this.state,
            _event: _event
          } : {
            action: action,
            _event: _event
          });
        } catch (err) {
          if (_this.parent) {
            _this.parent.send({
              type: 'xstate.error',
              data: err
            });
          }

          throw err;
        }
      }

      switch (action.type) {
        case actionTypes.raise:
          {
            // if raise action reached the interpreter then it's a delayed one
            var sendAction_1 = action;

            _this.defer(sendAction_1);

            break;
          }

        case actionTypes.send:
          var sendAction = action;

          if (typeof sendAction.delay === 'number') {
            _this.defer(sendAction);

            return;
          } else {
            if (sendAction.to) {
              _this.sendTo(sendAction._event, sendAction.to, _event === actions.initEvent);
            } else {
              _this.send(sendAction._event);
            }
          }

          break;

        case actionTypes.cancel:
          _this.cancel(action.sendId);

          break;

        case actionTypes.start:
          {
            if (_this.status !== InterpreterStatus.Running) {
              return;
            }

            var activity = action.activity; // If the activity will be stopped right after it's started
            // (such as in transient states)
            // don't bother starting the activity.

            if ( // in v4 with `predictableActionArguments` invokes are called eagerly when the `this.state` still points to the previous state
            !_this.machine.config.predictableActionArguments && !_this.state.activities[activity.id || activity.type]) {
              break;
            } // Invoked services


            if (activity.type === types/* ActionTypes */.M.Invoke) {
              var invokeSource = (0,utils/* toInvokeSource */.j)(activity.src);
              var serviceCreator = _this.machine.options.services ? _this.machine.options.services[invokeSource.type] : undefined;
              var id = activity.id,
                  data = activity.data;

              if (!environment/* IS_PRODUCTION */.M) {
                (0,utils/* warn */.ZK)(!('forward' in activity), // tslint:disable-next-line:max-line-length
                "`forward` property is deprecated (found in invocation of '".concat(activity.src, "' in in machine '").concat(_this.machine.id, "'). ") + "Please use `autoForward` instead.");
              }

              var autoForward = 'autoForward' in activity ? activity.autoForward : !!activity.forward;

              if (!serviceCreator) {
                // tslint:disable-next-line:no-console
                if (!environment/* IS_PRODUCTION */.M) {
                  (0,utils/* warn */.ZK)(false, "No service found for invocation '".concat(activity.src, "' in machine '").concat(_this.machine.id, "'."));
                }

                return;
              }

              var resolvedData = data ? (0,utils/* mapContext */.QX)(data, context, _event) : undefined;

              if (typeof serviceCreator === 'string') {
                // TODO: warn
                return;
              }

              var source = (0,utils/* isFunction */.mf)(serviceCreator) ? serviceCreator(context, _event.data, {
                data: resolvedData,
                src: invokeSource,
                meta: activity.meta
              }) : serviceCreator;

              if (!source) {
                // TODO: warn?
                return;
              }

              var options = void 0;

              if ((0,utils/* isMachine */.O4)(source)) {
                source = resolvedData ? source.withContext(resolvedData) : source;
                options = {
                  autoForward: autoForward
                };
              }

              _this.spawn(source, id, options);
            } else {
              _this.spawnActivity(activity);
            }

            break;
          }

        case actionTypes.stop:
          {
            _this.stopChild(action.activity.id);

            break;
          }

        case actionTypes.log:
          var _a = action,
              label = _a.label,
              value = _a.value;

          if (label) {
            _this.logger(label, value);
          } else {
            _this.logger(value);
          }

          break;

        default:
          if (!environment/* IS_PRODUCTION */.M) {
            (0,utils/* warn */.ZK)(false, "No implementation found for action type '".concat(action.type, "'"));
          }

          break;
      }
    };

    var resolvedOptions = (0,_tslib/* __assign */.pi)((0,_tslib/* __assign */.pi)({}, Interpreter.defaultOptions), options);

    var clock = resolvedOptions.clock,
        logger = resolvedOptions.logger,
        parent = resolvedOptions.parent,
        id = resolvedOptions.id;
    var resolvedId = id !== undefined ? id : machine.id;
    this.id = resolvedId;
    this.logger = logger;
    this.clock = clock;
    this.parent = parent;
    this.options = resolvedOptions;
    this.scheduler = new Scheduler({
      deferEvents: this.options.deferEvents
    });
    this.sessionId = registry.bookId();
  }

  Object.defineProperty(Interpreter.prototype, "initialState", {
    get: function () {
      var _this = this;

      if (this._initialState) {
        return this._initialState;
      }

      return (0,serviceScope/* provide */.J)(this, function () {
        _this._initialState = _this.machine.initialState;
        return _this._initialState;
      });
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Interpreter.prototype, "state", {
    /**
     * @deprecated Use `.getSnapshot()` instead.
     */
    get: function () {
      if (!environment/* IS_PRODUCTION */.M) {
        (0,utils/* warn */.ZK)(this.status !== InterpreterStatus.NotStarted, "Attempted to read state from uninitialized service '".concat(this.id, "'. Make sure the service is started first."));
      }

      return this._state;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Executes the actions of the given state, with that state's `context` and `event`.
   *
   * @param state The state whose actions will be executed
   * @param actionsConfig The action implementations to use
   */

  Interpreter.prototype.execute = function (state, actionsConfig) {
    var e_1, _a;

    try {
      for (var _b = (0,_tslib/* __values */.XA)(state.actions), _c = _b.next(); !_c.done; _c = _b.next()) {
        var action = _c.value;
        this.exec(action, state, actionsConfig);
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
  };

  Interpreter.prototype.update = function (state, _event) {
    var e_2, _a, e_3, _b, e_4, _c, e_5, _d;

    var _this = this; // Attach session ID to state


    state._sessionid = this.sessionId; // Update state

    this._state = state; // Execute actions

    if ((!this.machine.config.predictableActionArguments || // this is currently required to execute initial actions as the `initialState` gets cached
    // we can't just recompute it (and execute actions while doing so) because we try to preserve identity of actors created within initial assigns
    _event === actions.initEvent) && this.options.execute) {
      this.execute(this.state);
    } else {
      var item = void 0;

      while (item = this._outgoingQueue.shift()) {
        item[0].send(item[1]);
      }
    } // Update children


    this.children.forEach(function (child) {
      _this.state.children[child.id] = child;
    }); // Dev tools

    if (this.devTools) {
      this.devTools.send(_event.data, state);
    } // Execute listeners


    if (state.event) {
      try {
        for (var _e = (0,_tslib/* __values */.XA)(this.eventListeners), _f = _e.next(); !_f.done; _f = _e.next()) {
          var listener = _f.value;
          listener(state.event);
        }
      } catch (e_2_1) {
        e_2 = {
          error: e_2_1
        };
      } finally {
        try {
          if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
        } finally {
          if (e_2) throw e_2.error;
        }
      }
    }

    try {
      for (var _g = (0,_tslib/* __values */.XA)(this.listeners), _h = _g.next(); !_h.done; _h = _g.next()) {
        var listener = _h.value;
        listener(state, state.event);
      }
    } catch (e_3_1) {
      e_3 = {
        error: e_3_1
      };
    } finally {
      try {
        if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
      } finally {
        if (e_3) throw e_3.error;
      }
    }

    try {
      for (var _j = (0,_tslib/* __values */.XA)(this.contextListeners), _k = _j.next(); !_k.done; _k = _j.next()) {
        var contextListener = _k.value;
        contextListener(this.state.context, this.state.history ? this.state.history.context : undefined);
      }
    } catch (e_4_1) {
      e_4 = {
        error: e_4_1
      };
    } finally {
      try {
        if (_k && !_k.done && (_c = _j.return)) _c.call(_j);
      } finally {
        if (e_4) throw e_4.error;
      }
    }

    if (this.state.done) {
      // get final child state node
      var finalChildStateNode = state.configuration.find(function (sn) {
        return sn.type === 'final' && sn.parent === _this.machine;
      });
      var doneData = finalChildStateNode && finalChildStateNode.doneData ? (0,utils/* mapContext */.QX)(finalChildStateNode.doneData, state.context, _event) : undefined;
      this._doneEvent = (0,actions.doneInvoke)(this.id, doneData);

      try {
        for (var _l = (0,_tslib/* __values */.XA)(this.doneListeners), _m = _l.next(); !_m.done; _m = _l.next()) {
          var listener = _m.value;
          listener(this._doneEvent);
        }
      } catch (e_5_1) {
        e_5 = {
          error: e_5_1
        };
      } finally {
        try {
          if (_m && !_m.done && (_d = _l.return)) _d.call(_l);
        } finally {
          if (e_5) throw e_5.error;
        }
      }

      this._stop();

      this._stopChildren();

      registry.free(this.sessionId);
    }
  };
  /*
   * Adds a listener that is notified whenever a state transition happens. The listener is called with
   * the next state and the event object that caused the state transition.
   *
   * @param listener The state listener
   */


  Interpreter.prototype.onTransition = function (listener) {
    this.listeners.add(listener); // Send current state to listener

    if (this.status === InterpreterStatus.Running) {
      listener(this.state, this.state.event);
    }

    return this;
  };

  Interpreter.prototype.subscribe = function (nextListenerOrObserver, _, // TODO: error listener
  completeListener) {
    var _this = this;

    var observer = (0,utils/* toObserver */.zM)(nextListenerOrObserver, _, completeListener);
    this.listeners.add(observer.next); // Send current state to listener

    if (this.status !== InterpreterStatus.NotStarted) {
      observer.next(this.state);
    }

    var completeOnce = function () {
      _this.doneListeners.delete(completeOnce);

      _this.stopListeners.delete(completeOnce);

      observer.complete();
    };

    if (this.status === InterpreterStatus.Stopped) {
      observer.complete();
    } else {
      this.onDone(completeOnce);
      this.onStop(completeOnce);
    }

    return {
      unsubscribe: function () {
        _this.listeners.delete(observer.next);

        _this.doneListeners.delete(completeOnce);

        _this.stopListeners.delete(completeOnce);
      }
    };
  };
  /**
   * Adds an event listener that is notified whenever an event is sent to the running interpreter.
   * @param listener The event listener
   */


  Interpreter.prototype.onEvent = function (listener) {
    this.eventListeners.add(listener);
    return this;
  };
  /**
   * Adds an event listener that is notified whenever a `send` event occurs.
   * @param listener The event listener
   */


  Interpreter.prototype.onSend = function (listener) {
    this.sendListeners.add(listener);
    return this;
  };
  /**
   * Adds a context listener that is notified whenever the state context changes.
   * @param listener The context listener
   */


  Interpreter.prototype.onChange = function (listener) {
    this.contextListeners.add(listener);
    return this;
  };
  /**
   * Adds a listener that is notified when the machine is stopped.
   * @param listener The listener
   */


  Interpreter.prototype.onStop = function (listener) {
    this.stopListeners.add(listener);
    return this;
  };
  /**
   * Adds a state listener that is notified when the statechart has reached its final state.
   * @param listener The state listener
   */


  Interpreter.prototype.onDone = function (listener) {
    if (this.status === InterpreterStatus.Stopped && this._doneEvent) {
      listener(this._doneEvent);
    } else {
      this.doneListeners.add(listener);
    }

    return this;
  };
  /**
   * Removes a listener.
   * @param listener The listener to remove
   */


  Interpreter.prototype.off = function (listener) {
    this.listeners.delete(listener);
    this.eventListeners.delete(listener);
    this.sendListeners.delete(listener);
    this.stopListeners.delete(listener);
    this.doneListeners.delete(listener);
    this.contextListeners.delete(listener);
    return this;
  };
  /**
   * Starts the interpreter from the given state, or the initial state.
   * @param initialState The state to start the statechart from
   */


  Interpreter.prototype.start = function (initialState) {
    var _this = this;

    if (this.status === InterpreterStatus.Running) {
      // Do not restart the service if it is already started
      return this;
    } // yes, it's a hack but we need the related cache to be populated for some things to work (like delayed transitions)
    // this is usually called by `machine.getInitialState` but if we rehydrate from a state we might bypass this call
    // we also don't want to call this method here as it resolves the full initial state which might involve calling assign actions
    // and that could potentially lead to some unwanted side-effects (even such as creating some rogue actors)


    this.machine._init();

    registry.register(this.sessionId, this);
    this.initialized = true;
    this.status = InterpreterStatus.Running;
    var resolvedState = initialState === undefined ? this.initialState : (0,serviceScope/* provide */.J)(this, function () {
      return (0,State/* isStateConfig */.TL)(initialState) ? _this.machine.resolveState(initialState) : _this.machine.resolveState(State/* State */.ZM.from(initialState, _this.machine.context));
    });

    if (this.options.devTools) {
      this.attachDev();
    }

    this.scheduler.initialize(function () {
      _this.update(resolvedState, actions.initEvent);
    });
    return this;
  };

  Interpreter.prototype._stopChildren = function () {
    // TODO: think about converting those to actions
    this.children.forEach(function (child) {
      if ((0,utils/* isFunction */.mf)(child.stop)) {
        child.stop();
      }
    });
    this.children.clear();
  };

  Interpreter.prototype._stop = function () {
    var e_6, _a, e_7, _b, e_8, _c, e_9, _d, e_10, _e;

    try {
      for (var _f = (0,_tslib/* __values */.XA)(this.listeners), _g = _f.next(); !_g.done; _g = _f.next()) {
        var listener = _g.value;
        this.listeners.delete(listener);
      }
    } catch (e_6_1) {
      e_6 = {
        error: e_6_1
      };
    } finally {
      try {
        if (_g && !_g.done && (_a = _f.return)) _a.call(_f);
      } finally {
        if (e_6) throw e_6.error;
      }
    }

    try {
      for (var _h = (0,_tslib/* __values */.XA)(this.stopListeners), _j = _h.next(); !_j.done; _j = _h.next()) {
        var listener = _j.value; // call listener, then remove

        listener();
        this.stopListeners.delete(listener);
      }
    } catch (e_7_1) {
      e_7 = {
        error: e_7_1
      };
    } finally {
      try {
        if (_j && !_j.done && (_b = _h.return)) _b.call(_h);
      } finally {
        if (e_7) throw e_7.error;
      }
    }

    try {
      for (var _k = (0,_tslib/* __values */.XA)(this.contextListeners), _l = _k.next(); !_l.done; _l = _k.next()) {
        var listener = _l.value;
        this.contextListeners.delete(listener);
      }
    } catch (e_8_1) {
      e_8 = {
        error: e_8_1
      };
    } finally {
      try {
        if (_l && !_l.done && (_c = _k.return)) _c.call(_k);
      } finally {
        if (e_8) throw e_8.error;
      }
    }

    try {
      for (var _m = (0,_tslib/* __values */.XA)(this.doneListeners), _o = _m.next(); !_o.done; _o = _m.next()) {
        var listener = _o.value;
        this.doneListeners.delete(listener);
      }
    } catch (e_9_1) {
      e_9 = {
        error: e_9_1
      };
    } finally {
      try {
        if (_o && !_o.done && (_d = _m.return)) _d.call(_m);
      } finally {
        if (e_9) throw e_9.error;
      }
    }

    if (!this.initialized) {
      // Interpreter already stopped; do nothing
      return this;
    }

    this.initialized = false;
    this.status = InterpreterStatus.Stopped;
    this._initialState = undefined;

    try {
      // we are going to stop within the current sync frame
      // so we can safely just cancel this here as nothing async should be fired anyway
      for (var _p = (0,_tslib/* __values */.XA)(Object.keys(this.delayedEventsMap)), _q = _p.next(); !_q.done; _q = _p.next()) {
        var key = _q.value;
        this.clock.clearTimeout(this.delayedEventsMap[key]);
      }
    } catch (e_10_1) {
      e_10 = {
        error: e_10_1
      };
    } finally {
      try {
        if (_q && !_q.done && (_e = _p.return)) _e.call(_p);
      } finally {
        if (e_10) throw e_10.error;
      }
    } // clear everything that might be enqueued


    this.scheduler.clear();
    this.scheduler = new Scheduler({
      deferEvents: this.options.deferEvents
    });
  };
  /**
   * Stops the interpreter and unsubscribe all listeners.
   *
   * This will also notify the `onStop` listeners.
   */


  Interpreter.prototype.stop = function () {
    // TODO: add warning for stopping non-root interpreters
    var _this = this; // grab the current scheduler as it will be replaced in _stop


    var scheduler = this.scheduler;

    this._stop(); // let what is currently processed to be finished


    scheduler.schedule(function () {
      // it feels weird to handle this here but we need to handle this even slightly "out of band"
      var _event = (0,utils/* toSCXMLEvent */.g5)({
        type: 'xstate.stop'
      });

      var nextState = (0,serviceScope/* provide */.J)(_this, function () {
        var exitActions = (0,utils/* flatten */.xH)((0,_tslib/* __spreadArray */.ev)([], (0,_tslib/* __read */.CR)(_this.state.configuration), false).sort(function (a, b) {
          return b.order - a.order;
        }).map(function (stateNode) {
          return (0,actions.toActionObjects)(stateNode.onExit, _this.machine.options.actions);
        }));

        var _a = (0,_tslib/* __read */.CR)((0,actions.resolveActions)(_this.machine, _this.state, _this.state.context, _event, [{
          type: 'exit',
          actions: exitActions
        }], _this.machine.config.predictableActionArguments ? _this._exec : undefined, _this.machine.config.predictableActionArguments || _this.machine.config.preserveActionOrder), 2),
            resolvedActions = _a[0],
            updatedContext = _a[1];

        var newState = new State/* State */.ZM({
          value: _this.state.value,
          context: updatedContext,
          _event: _event,
          _sessionid: _this.sessionId,
          historyValue: undefined,
          history: _this.state,
          actions: resolvedActions.filter(function (action) {
            return !(0,utils/* isRaisableAction */.vK)(action);
          }),
          activities: {},
          events: [],
          configuration: [],
          transitions: [],
          children: {},
          done: _this.state.done,
          tags: _this.state.tags,
          machine: _this.machine
        });
        newState.changed = true;
        return newState;
      });

      _this.update(nextState, _event);

      _this._stopChildren();

      registry.free(_this.sessionId);
    });
    return this;
  };

  Interpreter.prototype.batch = function (events) {
    var _this = this;

    if (this.status === InterpreterStatus.NotStarted && this.options.deferEvents) {
      // tslint:disable-next-line:no-console
      if (!environment/* IS_PRODUCTION */.M) {
        (0,utils/* warn */.ZK)(false, "".concat(events.length, " event(s) were sent to uninitialized service \"").concat(this.machine.id, "\" and are deferred. Make sure .start() is called for this service.\nEvent: ").concat(JSON.stringify(event)));
      }
    } else if (this.status !== InterpreterStatus.Running) {
      throw new Error( // tslint:disable-next-line:max-line-length
      "".concat(events.length, " event(s) were sent to uninitialized service \"").concat(this.machine.id, "\". Make sure .start() is called for this service, or set { deferEvents: true } in the service options."));
    }

    if (!events.length) {
      return;
    }

    var exec = !!this.machine.config.predictableActionArguments && this._exec;
    this.scheduler.schedule(function () {
      var e_11, _a;

      var nextState = _this.state;
      var batchChanged = false;
      var batchedActions = [];

      var _loop_1 = function (event_1) {
        var _event = (0,utils/* toSCXMLEvent */.g5)(event_1);

        _this.forward(_event);

        nextState = (0,serviceScope/* provide */.J)(_this, function () {
          return _this.machine.transition(nextState, _event, undefined, exec || undefined);
        });
        batchedActions.push.apply(batchedActions, (0,_tslib/* __spreadArray */.ev)([], (0,_tslib/* __read */.CR)(_this.machine.config.predictableActionArguments ? nextState.actions : nextState.actions.map(function (a) {
          return (0,State/* bindActionToState */.j1)(a, nextState);
        })), false));
        batchChanged = batchChanged || !!nextState.changed;
      };

      try {
        for (var events_1 = (0,_tslib/* __values */.XA)(events), events_1_1 = events_1.next(); !events_1_1.done; events_1_1 = events_1.next()) {
          var event_1 = events_1_1.value;

          _loop_1(event_1);
        }
      } catch (e_11_1) {
        e_11 = {
          error: e_11_1
        };
      } finally {
        try {
          if (events_1_1 && !events_1_1.done && (_a = events_1.return)) _a.call(events_1);
        } finally {
          if (e_11) throw e_11.error;
        }
      }

      nextState.changed = batchChanged;
      nextState.actions = batchedActions;

      _this.update(nextState, (0,utils/* toSCXMLEvent */.g5)(events[events.length - 1]));
    });
  };
  /**
   * Returns a send function bound to this interpreter instance.
   *
   * @param event The event to be sent by the sender.
   */


  Interpreter.prototype.sender = function (event) {
    return this.send.bind(this, event);
  };

  Interpreter.prototype._nextState = function (event, exec) {
    var _this = this;

    if (exec === void 0) {
      exec = !!this.machine.config.predictableActionArguments && this._exec;
    }

    var _event = (0,utils/* toSCXMLEvent */.g5)(event);

    if (_event.name.indexOf(actionTypes.errorPlatform) === 0 && !this.state.nextEvents.some(function (nextEvent) {
      return nextEvent.indexOf(actionTypes.errorPlatform) === 0;
    })) {
      throw _event.data.data;
    }

    var nextState = (0,serviceScope/* provide */.J)(this, function () {
      return _this.machine.transition(_this.state, _event, undefined, exec || undefined);
    });
    return nextState;
  };
  /**
   * Returns the next state given the interpreter's current state and the event.
   *
   * This is a pure method that does _not_ update the interpreter's state.
   *
   * @param event The event to determine the next state
   */


  Interpreter.prototype.nextState = function (event) {
    return this._nextState(event, false);
  };

  Interpreter.prototype.forward = function (event) {
    var e_12, _a;

    try {
      for (var _b = (0,_tslib/* __values */.XA)(this.forwardTo), _c = _b.next(); !_c.done; _c = _b.next()) {
        var id = _c.value;
        var child = this.children.get(id);

        if (!child) {
          throw new Error("Unable to forward event '".concat(event, "' from interpreter '").concat(this.id, "' to nonexistant child '").concat(id, "'."));
        }

        child.send(event);
      }
    } catch (e_12_1) {
      e_12 = {
        error: e_12_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_12) throw e_12.error;
      }
    }
  };

  Interpreter.prototype.defer = function (sendAction) {
    var _this = this;

    var timerId = this.clock.setTimeout(function () {
      if ('to' in sendAction && sendAction.to) {
        _this.sendTo(sendAction._event, sendAction.to, true);
      } else {
        _this.send(sendAction._event);
      }
    }, sendAction.delay);

    if (sendAction.id) {
      this.delayedEventsMap[sendAction.id] = timerId;
    }
  };

  Interpreter.prototype.cancel = function (sendId) {
    this.clock.clearTimeout(this.delayedEventsMap[sendId]);
    delete this.delayedEventsMap[sendId];
  };

  Interpreter.prototype.exec = function (action, state, actionFunctionMap) {
    if (actionFunctionMap === void 0) {
      actionFunctionMap = this.machine.options.actions;
    }

    this._exec(action, state.context, state._event, actionFunctionMap);
  };

  Interpreter.prototype.removeChild = function (childId) {
    var _a;

    this.children.delete(childId);
    this.forwardTo.delete(childId); // this.state might not exist at the time this is called,
    // such as when a child is added then removed while initializing the state

    (_a = this.state) === null || _a === void 0 ? true : delete _a.children[childId];
  };

  Interpreter.prototype.stopChild = function (childId) {
    var child = this.children.get(childId);

    if (!child) {
      return;
    }

    this.removeChild(childId);

    if ((0,utils/* isFunction */.mf)(child.stop)) {
      child.stop();
    }
  };

  Interpreter.prototype.spawn = function (entity, name, options) {
    if (this.status !== InterpreterStatus.Running) {
      return (0,Actor/* createDeferredActor */.Xg)(entity, name);
    }

    if ((0,utils/* isPromiseLike */.y8)(entity)) {
      return this.spawnPromise(Promise.resolve(entity), name);
    } else if ((0,utils/* isFunction */.mf)(entity)) {
      return this.spawnCallback(entity, name);
    } else if ((0,Actor/* isSpawnedActor */.f3)(entity)) {
      return this.spawnActor(entity, name);
    } else if ((0,utils/* isObservable */.bi)(entity)) {
      return this.spawnObservable(entity, name);
    } else if ((0,utils/* isMachine */.O4)(entity)) {
      return this.spawnMachine(entity, (0,_tslib/* __assign */.pi)((0,_tslib/* __assign */.pi)({}, options), {
        id: name
      }));
    } else if ((0,utils/* isBehavior */.HV)(entity)) {
      return this.spawnBehavior(entity, name);
    } else {
      throw new Error("Unable to spawn entity \"".concat(name, "\" of type \"").concat(typeof entity, "\"."));
    }
  };

  Interpreter.prototype.spawnMachine = function (machine, options) {
    var _this = this;

    if (options === void 0) {
      options = {};
    }

    var childService = new Interpreter(machine, (0,_tslib/* __assign */.pi)((0,_tslib/* __assign */.pi)({}, this.options), {
      parent: this,
      id: options.id || machine.id
    }));

    var resolvedOptions = (0,_tslib/* __assign */.pi)((0,_tslib/* __assign */.pi)({}, DEFAULT_SPAWN_OPTIONS), options);

    if (resolvedOptions.sync) {
      childService.onTransition(function (state) {
        _this.send(actionTypes.update, {
          state: state,
          id: childService.id
        });
      });
    }

    var actor = childService;
    this.children.set(childService.id, actor);

    if (resolvedOptions.autoForward) {
      this.forwardTo.add(childService.id);
    }

    childService.onDone(function (doneEvent) {
      _this.removeChild(childService.id);

      _this.send((0,utils/* toSCXMLEvent */.g5)(doneEvent, {
        origin: childService.id
      }));
    }).start();
    return actor;
  };

  Interpreter.prototype.spawnBehavior = function (behavior, id) {
    var actorRef = (0,behaviors/* spawnBehavior */.YP)(behavior, {
      id: id,
      parent: this
    });
    this.children.set(id, actorRef);
    return actorRef;
  };

  Interpreter.prototype.spawnPromise = function (promise, id) {
    var _a;

    var _this = this;

    var canceled = false;
    var resolvedData;
    promise.then(function (response) {
      if (!canceled) {
        resolvedData = response;

        _this.removeChild(id);

        _this.send((0,utils/* toSCXMLEvent */.g5)((0,actions.doneInvoke)(id, response), {
          origin: id
        }));
      }
    }, function (errorData) {
      if (!canceled) {
        _this.removeChild(id);

        var errorEvent = (0,actions.error)(id, errorData);

        try {
          // Send "error.platform.id" to this (parent).
          _this.send((0,utils/* toSCXMLEvent */.g5)(errorEvent, {
            origin: id
          }));
        } catch (error) {
          (0,utils/* reportUnhandledExceptionOnInvocation */.v4)(errorData, error, id);

          if (_this.devTools) {
            _this.devTools.send(errorEvent, _this.state);
          }

          if (_this.machine.strict) {
            // it would be better to always stop the state machine if unhandled
            // exception/promise rejection happens but because we don't want to
            // break existing code so enforce it on strict mode only especially so
            // because documentation says that onError is optional
            _this.stop();
          }
        }
      }
    });
    var actor = (_a = {
      id: id,
      send: function () {
        return void 0;
      },
      subscribe: function (next, handleError, complete) {
        var observer = (0,utils/* toObserver */.zM)(next, handleError, complete);
        var unsubscribed = false;
        promise.then(function (response) {
          if (unsubscribed) {
            return;
          }

          observer.next(response);

          if (unsubscribed) {
            return;
          }

          observer.complete();
        }, function (err) {
          if (unsubscribed) {
            return;
          }

          observer.error(err);
        });
        return {
          unsubscribe: function () {
            return unsubscribed = true;
          }
        };
      },
      stop: function () {
        canceled = true;
      },
      toJSON: function () {
        return {
          id: id
        };
      },
      getSnapshot: function () {
        return resolvedData;
      }
    }, _a[utils/* symbolObservable */.L$] = function () {
      return this;
    }, _a);
    this.children.set(id, actor);
    return actor;
  };

  Interpreter.prototype.spawnCallback = function (callback, id) {
    var _a;

    var _this = this;

    var canceled = false;
    var receivers = new Set();
    var listeners = new Set();
    var emitted;

    var receive = function (e) {
      emitted = e;
      listeners.forEach(function (listener) {
        return listener(e);
      });

      if (canceled) {
        return;
      }

      _this.send((0,utils/* toSCXMLEvent */.g5)(e, {
        origin: id
      }));
    };

    var callbackStop;

    try {
      callbackStop = callback(receive, function (newListener) {
        receivers.add(newListener);
      });
    } catch (err) {
      this.send((0,actions.error)(id, err));
    }

    if ((0,utils/* isPromiseLike */.y8)(callbackStop)) {
      // it turned out to be an async function, can't reliably check this before calling `callback`
      // because transpiled async functions are not recognizable
      return this.spawnPromise(callbackStop, id);
    }

    var actor = (_a = {
      id: id,
      send: function (event) {
        return receivers.forEach(function (receiver) {
          return receiver(event);
        });
      },
      subscribe: function (next) {
        var observer = (0,utils/* toObserver */.zM)(next);
        listeners.add(observer.next);
        return {
          unsubscribe: function () {
            listeners.delete(observer.next);
          }
        };
      },
      stop: function () {
        canceled = true;

        if ((0,utils/* isFunction */.mf)(callbackStop)) {
          callbackStop();
        }
      },
      toJSON: function () {
        return {
          id: id
        };
      },
      getSnapshot: function () {
        return emitted;
      }
    }, _a[utils/* symbolObservable */.L$] = function () {
      return this;
    }, _a);
    this.children.set(id, actor);
    return actor;
  };

  Interpreter.prototype.spawnObservable = function (source, id) {
    var _a;

    var _this = this;

    var emitted;
    var subscription = source.subscribe(function (value) {
      emitted = value;

      _this.send((0,utils/* toSCXMLEvent */.g5)(value, {
        origin: id
      }));
    }, function (err) {
      _this.removeChild(id);

      _this.send((0,utils/* toSCXMLEvent */.g5)((0,actions.error)(id, err), {
        origin: id
      }));
    }, function () {
      _this.removeChild(id);

      _this.send((0,utils/* toSCXMLEvent */.g5)((0,actions.doneInvoke)(id), {
        origin: id
      }));
    });
    var actor = (_a = {
      id: id,
      send: function () {
        return void 0;
      },
      subscribe: function (next, handleError, complete) {
        return source.subscribe(next, handleError, complete);
      },
      stop: function () {
        return subscription.unsubscribe();
      },
      getSnapshot: function () {
        return emitted;
      },
      toJSON: function () {
        return {
          id: id
        };
      }
    }, _a[utils/* symbolObservable */.L$] = function () {
      return this;
    }, _a);
    this.children.set(id, actor);
    return actor;
  };

  Interpreter.prototype.spawnActor = function (actor, name) {
    this.children.set(name, actor);
    return actor;
  };

  Interpreter.prototype.spawnActivity = function (activity) {
    var implementation = this.machine.options && this.machine.options.activities ? this.machine.options.activities[activity.type] : undefined;

    if (!implementation) {
      if (!environment/* IS_PRODUCTION */.M) {
        (0,utils/* warn */.ZK)(false, "No implementation found for activity '".concat(activity.type, "'"));
      } // tslint:disable-next-line:no-console


      return;
    } // Start implementation


    var dispose = implementation(this.state.context, activity);
    this.spawnEffect(activity.id, dispose);
  };

  Interpreter.prototype.spawnEffect = function (id, dispose) {
    var _a;

    this.children.set(id, (_a = {
      id: id,
      send: function () {
        return void 0;
      },
      subscribe: function () {
        return {
          unsubscribe: function () {
            return void 0;
          }
        };
      },
      stop: dispose || undefined,
      getSnapshot: function () {
        return undefined;
      },
      toJSON: function () {
        return {
          id: id
        };
      }
    }, _a[utils/* symbolObservable */.L$] = function () {
      return this;
    }, _a));
  };

  Interpreter.prototype.attachDev = function () {
    var global = getGlobal();

    if (this.options.devTools && global) {
      if (global.__REDUX_DEVTOOLS_EXTENSION__) {
        var devToolsOptions = typeof this.options.devTools === 'object' ? this.options.devTools : undefined;
        this.devTools = global.__REDUX_DEVTOOLS_EXTENSION__.connect((0,_tslib/* __assign */.pi)((0,_tslib/* __assign */.pi)({
          name: this.id,
          autoPause: true,
          stateSanitizer: function (state) {
            return {
              value: state.value,
              context: state.context,
              actions: state.actions
            };
          }
        }, devToolsOptions), {
          features: (0,_tslib/* __assign */.pi)({
            jump: false,
            skip: false
          }, devToolsOptions ? devToolsOptions.features : undefined)
        }), this.machine);
        this.devTools.init(this.state);
      } // add XState-specific dev tooling hook


      registerService(this);
    }
  };

  Interpreter.prototype.toJSON = function () {
    return {
      id: this.id
    };
  };

  Interpreter.prototype[utils/* symbolObservable */.L$] = function () {
    return this;
  };

  Interpreter.prototype.getSnapshot = function () {
    if (this.status === InterpreterStatus.NotStarted) {
      return this.initialState;
    }

    return this._state;
  };
  /**
   * The default interpreter options:
   *
   * - `clock` uses the global `setTimeout` and `clearTimeout` functions
   * - `logger` uses the global `console.log()` method
   */


  Interpreter.defaultOptions = {
    execute: true,
    deferEvents: true,
    clock: {
      setTimeout: function (fn, ms) {
        return setTimeout(fn, ms);
      },
      clearTimeout: function (id) {
        return clearTimeout(id);
      }
    },
    logger: /*#__PURE__*/console.log.bind(console),
    devTools: false
  };
  Interpreter.interpret = interpret;
  return Interpreter;
}();

var resolveSpawnOptions = function (nameOrOptions) {
  if ((0,utils/* isString */.HD)(nameOrOptions)) {
    return (0,_tslib/* __assign */.pi)((0,_tslib/* __assign */.pi)({}, DEFAULT_SPAWN_OPTIONS), {
      name: nameOrOptions
    });
  }

  return (0,_tslib/* __assign */.pi)((0,_tslib/* __assign */.pi)((0,_tslib/* __assign */.pi)({}, DEFAULT_SPAWN_OPTIONS), {
    name: (0,utils/* uniqueId */.EL)()
  }), nameOrOptions);
};

function spawn(entity, nameOrOptions) {
  var resolvedOptions = resolveSpawnOptions(nameOrOptions);
  return (0,serviceScope/* consume */.F)(function (service) {
    if (!environment/* IS_PRODUCTION */.M) {
      var isLazyEntity = (0,utils/* isMachine */.O4)(entity) || (0,utils/* isFunction */.mf)(entity);
      (0,utils/* warn */.ZK)(!!service || isLazyEntity, "Attempted to spawn an Actor (ID: \"".concat((0,utils/* isMachine */.O4)(entity) ? entity.id : 'undefined', "\") outside of a service. This will have no effect."));
    }

    if (service) {
      return service.spawn(entity, resolvedOptions.name, resolvedOptions);
    } else {
      return (0,Actor/* createDeferredActor */.Xg)(entity, resolvedOptions.name);
    }
  });
}
/**
 * Creates a new Interpreter instance for the given machine with the provided options, if any.
 *
 * @param machine The machine to interpret
 * @param options Interpreter options
 */

function interpret(machine, options) {
  var interpreter = new Interpreter(machine, options);
  return interpreter;
}




/***/ }),

/***/ 797:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   F: () => (/* binding */ consume),
/* harmony export */   J: () => (/* binding */ provide)
/* harmony export */ });
/**
 * Maintains a stack of the current service in scope.
 * This is used to provide the correct service to spawn().
 */
var serviceStack = [];
var provide = function (service, fn) {
  serviceStack.push(service);
  var result = fn(service);
  serviceStack.pop();
  return result;
};
var consume = function (fn) {
  return fn(serviceStack[serviceStack.length - 1]);
};




/***/ }),

/***/ 6115:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   G: () => (/* binding */ getChildren),
/* harmony export */   Ij: () => (/* binding */ isInFinalState),
/* harmony export */   N9: () => (/* binding */ isLeafNode),
/* harmony export */   NA: () => (/* binding */ getValue),
/* harmony export */   Oe: () => (/* binding */ getTagsFromConfiguration),
/* harmony export */   P_: () => (/* binding */ getConfiguration),
/* harmony export */   ac: () => (/* binding */ getAllStateNodes),
/* harmony export */   e$: () => (/* binding */ has),
/* harmony export */   nI: () => (/* binding */ getAllChildren),
/* harmony export */   nJ: () => (/* binding */ nextEvents),
/* harmony export */   xZ: () => (/* binding */ getMeta)
/* harmony export */ });
/* unused harmony export getAdjList */
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3056);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9823);



var isLeafNode = function (stateNode) {
  return stateNode.type === 'atomic' || stateNode.type === 'final';
};
function getAllChildren(stateNode) {
  return Object.keys(stateNode.states).map(function (key) {
    return stateNode.states[key];
  });
}
function getChildren(stateNode) {
  return getAllChildren(stateNode).filter(function (sn) {
    return sn.type !== 'history';
  });
}
function getAllStateNodes(stateNode) {
  var stateNodes = [stateNode];

  if (isLeafNode(stateNode)) {
    return stateNodes;
  }

  return stateNodes.concat((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__/* .flatten */ .xH)(getChildren(stateNode).map(getAllStateNodes)));
}
function getConfiguration(prevStateNodes, stateNodes) {
  var e_1, _a, e_2, _b, e_3, _c, e_4, _d;

  var prevConfiguration = new Set(prevStateNodes);
  var prevAdjList = getAdjList(prevConfiguration);
  var configuration = new Set(stateNodes);

  try {
    // add all ancestors
    for (var configuration_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__/* .__values */ .XA)(configuration), configuration_1_1 = configuration_1.next(); !configuration_1_1.done; configuration_1_1 = configuration_1.next()) {
      var s = configuration_1_1.value;
      var m = s.parent;

      while (m && !configuration.has(m)) {
        configuration.add(m);
        m = m.parent;
      }
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (configuration_1_1 && !configuration_1_1.done && (_a = configuration_1.return)) _a.call(configuration_1);
    } finally {
      if (e_1) throw e_1.error;
    }
  }

  var adjList = getAdjList(configuration);

  try {
    // add descendants
    for (var configuration_2 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__/* .__values */ .XA)(configuration), configuration_2_1 = configuration_2.next(); !configuration_2_1.done; configuration_2_1 = configuration_2.next()) {
      var s = configuration_2_1.value; // if previously active, add existing child nodes

      if (s.type === 'compound' && (!adjList.get(s) || !adjList.get(s).length)) {
        if (prevAdjList.get(s)) {
          prevAdjList.get(s).forEach(function (sn) {
            return configuration.add(sn);
          });
        } else {
          s.initialStateNodes.forEach(function (sn) {
            return configuration.add(sn);
          });
        }
      } else {
        if (s.type === 'parallel') {
          try {
            for (var _e = (e_3 = void 0, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__/* .__values */ .XA)(getChildren(s))), _f = _e.next(); !_f.done; _f = _e.next()) {
              var child = _f.value;

              if (!configuration.has(child)) {
                configuration.add(child);

                if (prevAdjList.get(child)) {
                  prevAdjList.get(child).forEach(function (sn) {
                    return configuration.add(sn);
                  });
                } else {
                  child.initialStateNodes.forEach(function (sn) {
                    return configuration.add(sn);
                  });
                }
              }
            }
          } catch (e_3_1) {
            e_3 = {
              error: e_3_1
            };
          } finally {
            try {
              if (_f && !_f.done && (_c = _e.return)) _c.call(_e);
            } finally {
              if (e_3) throw e_3.error;
            }
          }
        }
      }
    }
  } catch (e_2_1) {
    e_2 = {
      error: e_2_1
    };
  } finally {
    try {
      if (configuration_2_1 && !configuration_2_1.done && (_b = configuration_2.return)) _b.call(configuration_2);
    } finally {
      if (e_2) throw e_2.error;
    }
  }

  try {
    // add all ancestors
    for (var configuration_3 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__/* .__values */ .XA)(configuration), configuration_3_1 = configuration_3.next(); !configuration_3_1.done; configuration_3_1 = configuration_3.next()) {
      var s = configuration_3_1.value;
      var m = s.parent;

      while (m && !configuration.has(m)) {
        configuration.add(m);
        m = m.parent;
      }
    }
  } catch (e_4_1) {
    e_4 = {
      error: e_4_1
    };
  } finally {
    try {
      if (configuration_3_1 && !configuration_3_1.done && (_d = configuration_3.return)) _d.call(configuration_3);
    } finally {
      if (e_4) throw e_4.error;
    }
  }

  return configuration;
}

function getValueFromAdj(baseNode, adjList) {
  var childStateNodes = adjList.get(baseNode);

  if (!childStateNodes) {
    return {}; // todo: fix?
  }

  if (baseNode.type === 'compound') {
    var childStateNode = childStateNodes[0];

    if (childStateNode) {
      if (isLeafNode(childStateNode)) {
        return childStateNode.key;
      }
    } else {
      return {};
    }
  }

  var stateValue = {};
  childStateNodes.forEach(function (csn) {
    stateValue[csn.key] = getValueFromAdj(csn, adjList);
  });
  return stateValue;
}

function getAdjList(configuration) {
  var e_5, _a;

  var adjList = new Map();

  try {
    for (var configuration_4 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__/* .__values */ .XA)(configuration), configuration_4_1 = configuration_4.next(); !configuration_4_1.done; configuration_4_1 = configuration_4.next()) {
      var s = configuration_4_1.value;

      if (!adjList.has(s)) {
        adjList.set(s, []);
      }

      if (s.parent) {
        if (!adjList.has(s.parent)) {
          adjList.set(s.parent, []);
        }

        adjList.get(s.parent).push(s);
      }
    }
  } catch (e_5_1) {
    e_5 = {
      error: e_5_1
    };
  } finally {
    try {
      if (configuration_4_1 && !configuration_4_1.done && (_a = configuration_4.return)) _a.call(configuration_4);
    } finally {
      if (e_5) throw e_5.error;
    }
  }

  return adjList;
}
function getValue(rootNode, configuration) {
  var config = getConfiguration([rootNode], configuration);
  return getValueFromAdj(rootNode, getAdjList(config));
}
function has(iterable, item) {
  if (Array.isArray(iterable)) {
    return iterable.some(function (member) {
      return member === item;
    });
  }

  if (iterable instanceof Set) {
    return iterable.has(item);
  }

  return false; // TODO: fix
}
function nextEvents(configuration) {
  return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__/* .__spreadArray */ .ev)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__/* .__read */ .CR)(new Set((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__/* .flatten */ .xH)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__/* .__spreadArray */ .ev)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__/* .__read */ .CR)(configuration.map(function (sn) {
    return sn.ownEvents;
  })), false)))), false);
}
function isInFinalState(configuration, stateNode) {
  if (stateNode.type === 'compound') {
    return getChildren(stateNode).some(function (s) {
      return s.type === 'final' && has(configuration, s);
    });
  }

  if (stateNode.type === 'parallel') {
    return getChildren(stateNode).every(function (sn) {
      return isInFinalState(configuration, sn);
    });
  }

  return false;
}
function getMeta(configuration) {
  if (configuration === void 0) {
    configuration = [];
  }

  return configuration.reduce(function (acc, stateNode) {
    if (stateNode.meta !== undefined) {
      acc[stateNode.id] = stateNode.meta;
    }

    return acc;
  }, {});
}
function getTagsFromConfiguration(configuration) {
  return new Set((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__/* .flatten */ .xH)(configuration.map(function (sn) {
    return sn.tags;
  })));
}




/***/ }),

/***/ 9043:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   K: () => (/* binding */ SpecialTargets),
/* harmony export */   M: () => (/* binding */ ActionTypes)
/* harmony export */ });
var ActionTypes;

(function (ActionTypes) {
  ActionTypes["Start"] = "xstate.start";
  ActionTypes["Stop"] = "xstate.stop";
  ActionTypes["Raise"] = "xstate.raise";
  ActionTypes["Send"] = "xstate.send";
  ActionTypes["Cancel"] = "xstate.cancel";
  ActionTypes["NullEvent"] = "";
  ActionTypes["Assign"] = "xstate.assign";
  ActionTypes["After"] = "xstate.after";
  ActionTypes["DoneState"] = "done.state";
  ActionTypes["DoneInvoke"] = "done.invoke";
  ActionTypes["Log"] = "xstate.log";
  ActionTypes["Init"] = "xstate.init";
  ActionTypes["Invoke"] = "xstate.invoke";
  ActionTypes["ErrorExecution"] = "error.execution";
  ActionTypes["ErrorCommunication"] = "error.communication";
  ActionTypes["ErrorPlatform"] = "error.platform";
  ActionTypes["ErrorCustom"] = "xstate.error";
  ActionTypes["Update"] = "xstate.update";
  ActionTypes["Pure"] = "xstate.pure";
  ActionTypes["Choose"] = "xstate.choose";
})(ActionTypes || (ActionTypes = {}));

var SpecialTargets;

(function (SpecialTargets) {
  SpecialTargets["Parent"] = "#_parent";
  SpecialTargets["Internal"] = "#_internal";
})(SpecialTargets || (SpecialTargets = {}));




/***/ }),

/***/ 9823:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Bc: () => (/* binding */ isActor),
/* harmony export */   EL: () => (/* binding */ uniqueId),
/* harmony export */   ET: () => (/* binding */ path),
/* harmony export */   HD: () => (/* binding */ isString),
/* harmony export */   HV: () => (/* binding */ isBehavior),
/* harmony export */   JQ: () => (/* binding */ isBuiltInEvent),
/* harmony export */   L$: () => (/* binding */ symbolObservable),
/* harmony export */   O4: () => (/* binding */ isMachine),
/* harmony export */   Q8: () => (/* binding */ mapValues),
/* harmony export */   Q9: () => (/* binding */ toStatePath),
/* harmony export */   QX: () => (/* binding */ mapContext),
/* harmony export */   Qi: () => (/* binding */ toGuard),
/* harmony export */   SA: () => (/* binding */ toStatePaths),
/* harmony export */   W: () => (/* binding */ matchesState),
/* harmony export */   WM: () => (/* binding */ toStateValue),
/* harmony export */   ZK: () => (/* binding */ warn),
/* harmony export */   _v: () => (/* binding */ toEventObject),
/* harmony export */   bi: () => (/* binding */ isObservable),
/* harmony export */   bx: () => (/* binding */ createInvokeId),
/* harmony export */   dt: () => (/* binding */ updateContext),
/* harmony export */   g5: () => (/* binding */ toSCXMLEvent),
/* harmony export */   gk: () => (/* binding */ nestedPath),
/* harmony export */   ib: () => (/* binding */ mapFilterValues),
/* harmony export */   j: () => (/* binding */ toInvokeSource),
/* harmony export */   jh: () => (/* binding */ toTransitionConfigArray),
/* harmony export */   kJ: () => (/* binding */ isArray),
/* harmony export */   mf: () => (/* binding */ isFunction),
/* harmony export */   on: () => (/* binding */ pathToStateValue),
/* harmony export */   qo: () => (/* binding */ toArray),
/* harmony export */   rg: () => (/* binding */ normalizeTarget),
/* harmony export */   uK: () => (/* binding */ partition),
/* harmony export */   v4: () => (/* binding */ reportUnhandledExceptionOnInvocation),
/* harmony export */   vK: () => (/* binding */ isRaisableAction),
/* harmony export */   vx: () => (/* binding */ evaluateGuard),
/* harmony export */   x6: () => (/* binding */ getEventType),
/* harmony export */   xH: () => (/* binding */ flatten),
/* harmony export */   y8: () => (/* binding */ isPromiseLike),
/* harmony export */   yv: () => (/* binding */ updateHistoryValue),
/* harmony export */   zM: () => (/* binding */ toObserver)
/* harmony export */ });
/* unused harmony exports getActionType, interopSymbols, isStateLike, keys, pathsToStateValue, toArrayStrict, updateHistoryStates */
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3056);
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9043);
/* harmony import */ var _actionTypes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3884);
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7353);
/* harmony import */ var _environment_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4066);






var _a;
function keys(value) {
  return Object.keys(value);
}
function matchesState(parentStateId, childStateId, delimiter) {
  if (delimiter === void 0) {
    delimiter = _constants_js__WEBPACK_IMPORTED_MODULE_0__/* .STATE_DELIMITER */ .iS;
  }

  var parentStateValue = toStateValue(parentStateId, delimiter);
  var childStateValue = toStateValue(childStateId, delimiter);

  if (isString(childStateValue)) {
    if (isString(parentStateValue)) {
      return childStateValue === parentStateValue;
    } // Parent more specific than child


    return false;
  }

  if (isString(parentStateValue)) {
    return parentStateValue in childStateValue;
  }

  return Object.keys(parentStateValue).every(function (key) {
    if (!(key in childStateValue)) {
      return false;
    }

    return matchesState(parentStateValue[key], childStateValue[key]);
  });
}
function getEventType(event) {
  try {
    return isString(event) || typeof event === 'number' ? "".concat(event) : event.type;
  } catch (e) {
    throw new Error('Events must be strings or objects with a string event.type property.');
  }
}
function getActionType(action) {
  try {
    return isString(action) || typeof action === 'number' ? "".concat(action) : isFunction(action) ? action.name : action.type;
  } catch (e) {
    throw new Error('Actions must be strings or objects with a string action.type property.');
  }
}
function toStatePath(stateId, delimiter) {
  try {
    if (isArray(stateId)) {
      return stateId;
    }

    return stateId.toString().split(delimiter);
  } catch (e) {
    throw new Error("'".concat(stateId, "' is not a valid state path."));
  }
}
function isStateLike(state) {
  return typeof state === 'object' && 'value' in state && 'context' in state && 'event' in state && '_event' in state;
}
function toStateValue(stateValue, delimiter) {
  if (isStateLike(stateValue)) {
    return stateValue.value;
  }

  if (isArray(stateValue)) {
    return pathToStateValue(stateValue);
  }

  if (typeof stateValue !== 'string') {
    return stateValue;
  }

  var statePath = toStatePath(stateValue, delimiter);
  return pathToStateValue(statePath);
}
function pathToStateValue(statePath) {
  if (statePath.length === 1) {
    return statePath[0];
  }

  var value = {};
  var marker = value;

  for (var i = 0; i < statePath.length - 1; i++) {
    if (i === statePath.length - 2) {
      marker[statePath[i]] = statePath[i + 1];
    } else {
      marker[statePath[i]] = {};
      marker = marker[statePath[i]];
    }
  }

  return value;
}
function mapValues(collection, iteratee) {
  var result = {};
  var collectionKeys = Object.keys(collection);

  for (var i = 0; i < collectionKeys.length; i++) {
    var key = collectionKeys[i];
    result[key] = iteratee(collection[key], key, collection, i);
  }

  return result;
}
function mapFilterValues(collection, iteratee, predicate) {
  var e_1, _a;

  var result = {};

  try {
    for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__/* .__values */ .XA)(Object.keys(collection)), _c = _b.next(); !_c.done; _c = _b.next()) {
      var key = _c.value;
      var item = collection[key];

      if (!predicate(item)) {
        continue;
      }

      result[key] = iteratee(item, key, collection);
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
    } finally {
      if (e_1) throw e_1.error;
    }
  }

  return result;
}
/**
 * Retrieves a value at the given path.
 * @param props The deep path to the prop of the desired value
 */

var path = function (props) {
  return function (object) {
    var e_2, _a;

    var result = object;

    try {
      for (var props_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__/* .__values */ .XA)(props), props_1_1 = props_1.next(); !props_1_1.done; props_1_1 = props_1.next()) {
        var prop = props_1_1.value;
        result = result[prop];
      }
    } catch (e_2_1) {
      e_2 = {
        error: e_2_1
      };
    } finally {
      try {
        if (props_1_1 && !props_1_1.done && (_a = props_1.return)) _a.call(props_1);
      } finally {
        if (e_2) throw e_2.error;
      }
    }

    return result;
  };
};
/**
 * Retrieves a value at the given path via the nested accessor prop.
 * @param props The deep path to the prop of the desired value
 */

function nestedPath(props, accessorProp) {
  return function (object) {
    var e_3, _a;

    var result = object;

    try {
      for (var props_2 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__/* .__values */ .XA)(props), props_2_1 = props_2.next(); !props_2_1.done; props_2_1 = props_2.next()) {
        var prop = props_2_1.value;
        result = result[accessorProp][prop];
      }
    } catch (e_3_1) {
      e_3 = {
        error: e_3_1
      };
    } finally {
      try {
        if (props_2_1 && !props_2_1.done && (_a = props_2.return)) _a.call(props_2);
      } finally {
        if (e_3) throw e_3.error;
      }
    }

    return result;
  };
}
function toStatePaths(stateValue) {
  if (!stateValue) {
    return [[]];
  }

  if (isString(stateValue)) {
    return [[stateValue]];
  }

  var result = flatten(Object.keys(stateValue).map(function (key) {
    var subStateValue = stateValue[key];

    if (typeof subStateValue !== 'string' && (!subStateValue || !Object.keys(subStateValue).length)) {
      return [[key]];
    }

    return toStatePaths(stateValue[key]).map(function (subPath) {
      return [key].concat(subPath);
    });
  }));
  return result;
}
function pathsToStateValue(paths) {
  var e_4, _a;

  var result = {};

  if (paths && paths.length === 1 && paths[0].length === 1) {
    return paths[0][0];
  }

  try {
    for (var paths_1 = __values(paths), paths_1_1 = paths_1.next(); !paths_1_1.done; paths_1_1 = paths_1.next()) {
      var currentPath = paths_1_1.value;
      var marker = result; // tslint:disable-next-line:prefer-for-of

      for (var i = 0; i < currentPath.length; i++) {
        var subPath = currentPath[i];

        if (i === currentPath.length - 2) {
          marker[subPath] = currentPath[i + 1];
          break;
        }

        marker[subPath] = marker[subPath] || {};
        marker = marker[subPath];
      }
    }
  } catch (e_4_1) {
    e_4 = {
      error: e_4_1
    };
  } finally {
    try {
      if (paths_1_1 && !paths_1_1.done && (_a = paths_1.return)) _a.call(paths_1);
    } finally {
      if (e_4) throw e_4.error;
    }
  }

  return result;
}
function flatten(array) {
  var _a;

  return (_a = []).concat.apply(_a, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__/* .__spreadArray */ .ev)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__/* .__read */ .CR)(array), false));
}
function toArrayStrict(value) {
  if (isArray(value)) {
    return value;
  }

  return [value];
}
function toArray(value) {
  if (value === undefined) {
    return [];
  }

  return toArrayStrict(value);
}
function mapContext(mapper, context, _event) {
  var e_5, _a;

  if (isFunction(mapper)) {
    return mapper(context, _event.data);
  }

  var result = {};

  try {
    for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__/* .__values */ .XA)(Object.keys(mapper)), _c = _b.next(); !_c.done; _c = _b.next()) {
      var key = _c.value;
      var subMapper = mapper[key];

      if (isFunction(subMapper)) {
        result[key] = subMapper(context, _event.data);
      } else {
        result[key] = subMapper;
      }
    }
  } catch (e_5_1) {
    e_5 = {
      error: e_5_1
    };
  } finally {
    try {
      if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
    } finally {
      if (e_5) throw e_5.error;
    }
  }

  return result;
}
function isBuiltInEvent(eventType) {
  return /^(done|error)\./.test(eventType);
}
function isPromiseLike(value) {
  if (value instanceof Promise) {
    return true;
  } // Check if shape matches the Promise/A+ specification for a "thenable".


  if (value !== null && (isFunction(value) || typeof value === 'object') && isFunction(value.then)) {
    return true;
  }

  return false;
}
function isBehavior(value) {
  return value !== null && typeof value === 'object' && 'transition' in value && typeof value.transition === 'function';
}
function partition(items, predicate) {
  var e_6, _a;

  var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__/* .__read */ .CR)([[], []], 2),
      truthy = _b[0],
      falsy = _b[1];

  try {
    for (var items_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__/* .__values */ .XA)(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
      var item = items_1_1.value;

      if (predicate(item)) {
        truthy.push(item);
      } else {
        falsy.push(item);
      }
    }
  } catch (e_6_1) {
    e_6 = {
      error: e_6_1
    };
  } finally {
    try {
      if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
    } finally {
      if (e_6) throw e_6.error;
    }
  }

  return [truthy, falsy];
}
function updateHistoryStates(hist, stateValue) {
  return mapValues(hist.states, function (subHist, key) {
    if (!subHist) {
      return undefined;
    }

    var subStateValue = (isString(stateValue) ? undefined : stateValue[key]) || (subHist ? subHist.current : undefined);

    if (!subStateValue) {
      return undefined;
    }

    return {
      current: subStateValue,
      states: updateHistoryStates(subHist, subStateValue)
    };
  });
}
function updateHistoryValue(hist, stateValue) {
  return {
    current: stateValue,
    states: updateHistoryStates(hist, stateValue)
  };
}
function updateContext(context, _event, assignActions, state) {
  if (!_environment_js__WEBPACK_IMPORTED_MODULE_2__/* .IS_PRODUCTION */ .M) {
    warn(!!context, 'Attempting to update undefined context');
  }

  var updatedContext = context ? assignActions.reduce(function (acc, assignAction) {
    var e_7, _a;

    var assignment = assignAction.assignment;
    var meta = {
      state: state,
      action: assignAction,
      _event: _event
    };
    var partialUpdate = {};

    if (isFunction(assignment)) {
      partialUpdate = assignment(acc, _event.data, meta);
    } else {
      try {
        for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__/* .__values */ .XA)(Object.keys(assignment)), _c = _b.next(); !_c.done; _c = _b.next()) {
          var key = _c.value;
          var propAssignment = assignment[key];
          partialUpdate[key] = isFunction(propAssignment) ? propAssignment(acc, _event.data, meta) : propAssignment;
        }
      } catch (e_7_1) {
        e_7 = {
          error: e_7_1
        };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_7) throw e_7.error;
        }
      }
    }

    return Object.assign({}, acc, partialUpdate);
  }, context) : context;
  return updatedContext;
} // tslint:disable-next-line:no-empty

var warn = function () {};

if (!_environment_js__WEBPACK_IMPORTED_MODULE_2__/* .IS_PRODUCTION */ .M) {
  warn = function (condition, message) {
    var error = condition instanceof Error ? condition : undefined;

    if (!error && condition) {
      return;
    }

    if (console !== undefined) {
      var args = ["Warning: ".concat(message)];

      if (error) {
        args.push(error);
      } // tslint:disable-next-line:no-console


      console.warn.apply(console, args);
    }
  };
}
function isArray(value) {
  return Array.isArray(value);
} // tslint:disable-next-line:ban-types

function isFunction(value) {
  return typeof value === 'function';
}
function isString(value) {
  return typeof value === 'string';
}
function toGuard(condition, guardMap) {
  if (!condition) {
    return undefined;
  }

  if (isString(condition)) {
    return {
      type: _constants_js__WEBPACK_IMPORTED_MODULE_0__/* .DEFAULT_GUARD_TYPE */ .TV,
      name: condition,
      predicate: guardMap ? guardMap[condition] : undefined
    };
  }

  if (isFunction(condition)) {
    return {
      type: _constants_js__WEBPACK_IMPORTED_MODULE_0__/* .DEFAULT_GUARD_TYPE */ .TV,
      name: condition.name,
      predicate: condition
    };
  }

  return condition;
}
function isObservable(value) {
  try {
    return 'subscribe' in value && isFunction(value.subscribe);
  } catch (e) {
    return false;
  }
}
var symbolObservable = /*#__PURE__*/function () {
  return typeof Symbol === 'function' && Symbol.observable || '@@observable';
}(); // TODO: to be removed in v5, left it out just to minimize the scope of the change and maintain compatibility with older versions of integration paackages

var interopSymbols = (_a = {}, _a[symbolObservable] = function () {
  return this;
}, _a[Symbol.observable] = function () {
  return this;
}, _a);
function isMachine(value) {
  return !!value && '__xstatenode' in value;
}
function isActor(value) {
  return !!value && typeof value.send === 'function';
}
var uniqueId = /*#__PURE__*/function () {
  var currentId = 0;
  return function () {
    currentId++;
    return currentId.toString(16);
  };
}();
function toEventObject(event, payload // id?: TEvent['type']
) {
  if (isString(event) || typeof event === 'number') {
    return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__/* .__assign */ .pi)({
      type: event
    }, payload);
  }

  return event;
}
function toSCXMLEvent(event, scxmlEvent) {
  if (!isString(event) && '$$type' in event && event.$$type === 'scxml') {
    return event;
  }

  var eventObject = toEventObject(event);
  return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__/* .__assign */ .pi)({
    name: eventObject.type,
    data: eventObject,
    $$type: 'scxml',
    type: 'external'
  }, scxmlEvent);
}
function toTransitionConfigArray(event, configLike) {
  var transitions = toArrayStrict(configLike).map(function (transitionLike) {
    if (typeof transitionLike === 'undefined' || typeof transitionLike === 'string' || isMachine(transitionLike)) {
      return {
        target: transitionLike,
        event: event
      };
    }

    return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__/* .__assign */ .pi)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__/* .__assign */ .pi)({}, transitionLike), {
      event: event
    });
  });
  return transitions;
}
function normalizeTarget(target) {
  if (target === undefined || target === _constants_js__WEBPACK_IMPORTED_MODULE_0__/* .TARGETLESS_KEY */ .rt) {
    return undefined;
  }

  return toArray(target);
}
function reportUnhandledExceptionOnInvocation(originalError, currentError, id) {
  if (!_environment_js__WEBPACK_IMPORTED_MODULE_2__/* .IS_PRODUCTION */ .M) {
    var originalStackTrace = originalError.stack ? " Stacktrace was '".concat(originalError.stack, "'") : '';

    if (originalError === currentError) {
      // tslint:disable-next-line:no-console
      console.error("Missing onError handler for invocation '".concat(id, "', error was '").concat(originalError, "'.").concat(originalStackTrace));
    } else {
      var stackTrace = currentError.stack ? " Stacktrace was '".concat(currentError.stack, "'") : ''; // tslint:disable-next-line:no-console

      console.error("Missing onError handler and/or unhandled exception/promise rejection for invocation '".concat(id, "'. ") + "Original error: '".concat(originalError, "'. ").concat(originalStackTrace, " Current error is '").concat(currentError, "'.").concat(stackTrace));
    }
  }
}
function evaluateGuard(machine, guard, context, _event, state) {
  var guards = machine.options.guards;
  var guardMeta = {
    state: state,
    cond: guard,
    _event: _event
  }; // TODO: do not hardcode!

  if (guard.type === _constants_js__WEBPACK_IMPORTED_MODULE_0__/* .DEFAULT_GUARD_TYPE */ .TV) {
    return ((guards === null || guards === void 0 ? void 0 : guards[guard.name]) || guard.predicate)(context, _event.data, guardMeta);
  }

  var condFn = guards === null || guards === void 0 ? void 0 : guards[guard.type];

  if (!condFn) {
    throw new Error("Guard '".concat(guard.type, "' is not implemented on machine '").concat(machine.id, "'."));
  }

  return condFn(context, _event.data, guardMeta);
}
function toInvokeSource(src) {
  if (typeof src === 'string') {
    return {
      type: src
    };
  }

  return src;
}
function toObserver(nextHandler, errorHandler, completionHandler) {
  var noop = function () {};

  var isObserver = typeof nextHandler === 'object';
  var self = isObserver ? nextHandler : null;
  return {
    next: ((isObserver ? nextHandler.next : nextHandler) || noop).bind(self),
    error: ((isObserver ? nextHandler.error : errorHandler) || noop).bind(self),
    complete: ((isObserver ? nextHandler.complete : completionHandler) || noop).bind(self)
  };
}
function createInvokeId(stateNodeId, index) {
  return "".concat(stateNodeId, ":invocation[").concat(index, "]");
}
function isRaisableAction(action) {
  return (action.type === _actionTypes_js__WEBPACK_IMPORTED_MODULE_3__.raise || action.type === _actionTypes_js__WEBPACK_IMPORTED_MODULE_3__.send && action.to === _types_js__WEBPACK_IMPORTED_MODULE_4__/* .SpecialTargets */ .K.Internal) && typeof action.delay !== 'number';
}




/***/ }),

/***/ 8186:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   config: () => (/* binding */ config)
/* harmony export */ });
var config = {
  appServerUrl: "https://app.saypi.ai",
  apiServerUrl: "https://api.saypi.ai"
};

/***/ }),

/***/ 4870:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setupInterceptors: () => (/* binding */ setupInterceptors)
/* harmony export */ });
/* harmony import */ var _ConfigModule_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8186);

var filesToRedirect = ["silero_vad.onnx", "ort-wasm-simd.wasm", "ort.min.js.map"];

// Function to redirect specific XMLHttpRequests
function redirectXMLHttpRequest(open) {
  XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
    var filename = url.split("/").pop();
    if (filename && filesToRedirect.includes(filename)) {
      arguments[1] = "".concat(_ConfigModule_js__WEBPACK_IMPORTED_MODULE_0__.config.appServerUrl, "/").concat(filename);
    }
    open.apply(this, arguments);
  };
}

// Function to redirect specific fetch requests
function redirectFetch(_fetch) {
  window.fetch = function (url, opts) {
    var filename = url.split("/").pop();
    if (filename && filesToRedirect.includes(filename)) {
      arguments[0] = "".concat(_ConfigModule_js__WEBPACK_IMPORTED_MODULE_0__.config.appServerUrl, "/").concat(filename);
    }
    return _fetch.apply(this, arguments);
  };
}

// Function to set up the interceptors
function setupInterceptors() {
  redirectXMLHttpRequest(XMLHttpRequest.prototype.open);
  redirectFetch(window.fetch);
}

/***/ })

/******/ 	});
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
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

// EXTERNAL MODULE: ./node_modules/xstate/es/interpreter.js + 3 modules
var interpreter = __webpack_require__(9805);
// EXTERNAL MODULE: ./src/state-machines/AudioInputMachine.ts
var AudioInputMachine = __webpack_require__(1541);
// EXTERNAL MODULE: ./node_modules/xstate/es/Machine.js
var Machine = __webpack_require__(629);
;// CONCATENATED MODULE: ./src/state-machines/AudioOutputMachine.js

var EventBus = window.EventBus;
var audioOutputMachine = (0,Machine/* createMachine */.C)({
  context: {
    autoplay: false
  },
  id: "audioOutput",
  initial: "idle",
  states: {
    idle: {
      on: {
        loadstart: {
          target: "loading"
        }
      }
    },
    loading: {
      on: {
        loadedmetadata: {
          target: "loaded"
        }
      }
    },
    loaded: {
      initial: "ready",
      states: {
        ready: {
          description: "Audio has loaded and is ready to start playing (further buffering may be required to reach the end).",
          entry: {
            type: "emitEvent",
            params: {
              eventName: "saypi:ready"
            }
          },
          on: {
            play: {
              target: "playing"
            }
          }
        },
        playing: {
          entry: {
            type: "emitEvent",
            params: {
              eventName: "saypi:piSpeaking"
            }
          },
          exit: [{
            type: "emitEvent",
            params: {
              eventName: "saypi:piStoppedSpeaking"
            }
          }],
          on: {
            pause: {
              target: "paused"
            },
            ended: {
              target: "ended"
            },
            canplaythrough: {
              internal: true
            }
          }
        },
        paused: {
          on: {
            play: {
              target: "playing"
            }
          }
        },
        ended: {
          entry: {
            type: "emitEvent",
            params: {
              eventName: "saypi:piFinishedSpeaking"
            }
          },
          on: {
            seeked: {
              target: "ready",
              description: "An ended track is seeked back to earlier in the track."
            }
          }
        }
      },
      on: {
        emptied: {
          target: "idle"
        }
      }
    }
  },
  predictableActionArguments: true,
  preserveActionOrder: true
}, {
  actions: {
    emitEvent: function emitEvent(context, event, _ref) {
      var action = _ref.action;
      EventBus.emit(action.params.eventName);
    }
  },
  guards: {},
  services: {},
  delays: {}
});
;// CONCATENATED MODULE: ./src/LoggingModule.js
function serializeStateValue(stateValue) {
  if (typeof stateValue === "string") {
    return stateValue;
  }
  return Object.keys(stateValue).map(function (key) {
    return "".concat(key, ":").concat(serializeStateValue(stateValue[key]));
  }).join(",");
}
var DEBUG = false; // Consider using config and .env to set the DEBUG flag

var logger = {
  debug: function debug() {
    if (DEBUG) {
      var _console;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      (_console = console).log.apply(_console, ["DEBUG:"].concat(args));
    }
  },
  info: function info() {
    var _console2;
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    (_console2 = console).log.apply(_console2, ["INFO:"].concat(args));
  },
  error: function error() {
    var _console3;
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    (_console3 = console).error.apply(_console3, ["ERROR:"].concat(args));
  }
};
;// CONCATENATED MODULE: ./src/AudioModule.js
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
// import state machines for audio input and output





// depends on the injecting script (saypi.index.js) declaring the EventBus as a global variable
var AudioModule_EventBus = window.EventBus;

// audio output (Pi)
var audioElement = document.querySelector("audio");
if (!audioElement) {
  console.error("Audio element not found!");
} else {
  audioElement.preload = "auto"; // enable aggressive preloading of audio
}

var audioOutputActor = (0,interpreter/* interpret */.kJ)(audioOutputMachine).onTransition(function (state) {
  if (state.changed) {
    var fromState = state.history ? serializeStateValue(state.history.value) : "N/A";
    var toState = serializeStateValue(state.value);
    logger.debug("Audio Output Machine transitioned from ".concat(fromState, " to ").concat(toState, " with ").concat(state.event.type));
  }
}).start();
function registerAudioPlaybackEvents(audio, actor) {
  var events = ["loadstart", "loadedmetadata", "canplaythrough", "play", "pause", "ended", "seeked", "emptied"];
  events.forEach(function (event) {
    audio.addEventListener(event, function () {
      return actor.send(event);
    });
  });
  audio.addEventListener("playing", function () {
    actor.send("play");
  });
}
registerAudioPlaybackEvents(audioElement, audioOutputActor);

// audio input (user)
var audioInputActor = (0,interpreter/* interpret */.kJ)(AudioInputMachine.audioInputMachine).onTransition(function (state) {
  if (state.changed) {
    var fromState = state.history ? serializeStateValue(state.history.value) : "N/A";
    var toState = serializeStateValue(state.value);
    logger.debug("Audio Input Machine transitioned from ".concat(fromState, " to ").concat(toState, " with ").concat(state.event.type));
  }
}).start();

/* These events are used to control/pass requests to the audio module from other modules */
function registerAudioCommands() {
  // audio input (recording) commands
  AudioModule_EventBus.on("audio:setupRecording", function (e) {
    audioInputActor.send("acquire");
  });
  AudioModule_EventBus.on("audio:tearDownRecording", function (e) {
    audioInputActor.send("release");
  });
  AudioModule_EventBus.on("audio:startRecording", function (e) {
    // Check if Pi is currently speaking and stop her audio
    audioOutputActor.send("pause");

    // Check if the MediaRecorder is acquired before starting?
    audioInputActor.send(["acquire", "start"]);
  });
  AudioModule_EventBus.on("audio:stopRecording", function (e) {
    audioInputActor.send("stopRequested");
    /* resume or cancel Pi's audio */
    /* TODO: reassess how to handle interruptions
    audioOutputActor.send("play"); // resume Pi's audio
    audioOutputActor.send("stop"); // cancel Pi's audio
    */
  });
  // audio input (recording) events (pass media recorder events -> audio input machine actor)
  AudioModule_EventBus.on("audio:dataavailable", function (detail) {
    audioInputActor.send(_objectSpread({
      type: "dataAvailable"
    }, detail));
  });
  AudioModule_EventBus.on("audio:input:stop", function (e) {
    audioInputActor.send("stop");
  });

  // audio output (playback) commands
  AudioModule_EventBus.on("audio:reload", function (e) {
    audioOutputActor.send("reload");
  });
}
registerAudioCommands();
})();

/******/ })()
;
//# sourceMappingURL=audioModule.bundle.js.map