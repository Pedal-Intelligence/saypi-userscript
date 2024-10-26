/******/ (() => {
  // webpackBootstrap
  /******/ "use strict";
  /******/ var __webpack_modules__ = [
    ,
    /* 0 */ /* 1 */
    /***/ (__unused_webpack_module, exports) => {
      Object.defineProperty(exports, "__esModule", { value: true });
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

      /***/
    },
    /* 2 */
    /***/ (__unused_webpack_module, exports) => {
      Object.defineProperty(exports, "__esModule", { value: true });
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

      /***/
    },
    /* 3 */
    /***/ (__unused_webpack_module, exports, __webpack_require__) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Resampler = void 0;
      const logging_1 = __webpack_require__(1);
      class Resampler {
        constructor(options) {
          this.options = options;
          this.process = (audioFrame) => {
            const outputFrames = [];
            for (const sample of audioFrame) {
              this.inputBuffer.push(sample);
              while (this.hasEnoughDataForFrame()) {
                const outputFrame = this.generateOutputFrame();
                outputFrames.push(outputFrame);
              }
            }
            return outputFrames;
          };
          this.stream = async function* (audioInput) {
            for (const sample of audioInput) {
              this.inputBuffer.push(sample);
              while (this.hasEnoughDataForFrame()) {
                const outputFrame = this.generateOutputFrame();
                yield outputFrame;
              }
            }
          };
          if (options.nativeSampleRate < 16000) {
            logging_1.log.error(
              "nativeSampleRate is too low. Should have 16000 = targetSampleRate <= nativeSampleRate"
            );
          }
          this.inputBuffer = [];
        }
        hasEnoughDataForFrame() {
          return (
            (this.inputBuffer.length * this.options.targetSampleRate) /
              this.options.nativeSampleRate >=
            this.options.targetFrameSize
          );
        }
        generateOutputFrame() {
          const outputFrame = new Float32Array(this.options.targetFrameSize);
          let outputIndex = 0;
          let inputIndex = 0;
          while (outputIndex < this.options.targetFrameSize) {
            let sum = 0;
            let num = 0;
            while (
              inputIndex <
              Math.min(
                this.inputBuffer.length,
                ((outputIndex + 1) * this.options.nativeSampleRate) /
                  this.options.targetSampleRate
              )
            ) {
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

      /***/
    },
    /******/
  ];
  /************************************************************************/
  /******/ // The module cache
  /******/ var __webpack_module_cache__ = {};
  /******/
  /******/ // The require function
  /******/ function __webpack_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/ var cachedModule = __webpack_module_cache__[moduleId];
    /******/ if (cachedModule !== undefined) {
      /******/ return cachedModule.exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/ var module = (__webpack_module_cache__[moduleId] = {
      /******/ // no module.id needed
      /******/ // no module.loaded needed
      /******/ exports: {},
      /******/
    });
    /******/
    /******/ // Execute the module function
    /******/ __webpack_modules__[moduleId](
      module,
      module.exports,
      __webpack_require__
    );
    /******/
    /******/ // Return the exports of the module
    /******/ return module.exports;
    /******/
  }
  /******/
  /************************************************************************/
  var __webpack_exports__ = {};
  // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
  (() => {
    var exports = __webpack_exports__;

    Object.defineProperty(exports, "__esModule", { value: true });
    const logging_1 = __webpack_require__(1);
    const messages_1 = __webpack_require__(2);
    const resampler_1 = __webpack_require__(3);
    class Processor extends AudioWorkletProcessor {
      constructor(options) {
        super();
        this._initialized = false;
        this._stopProcessing = false;
        this.init = async () => {
          logging_1.log.debug("Initializing SayPi VAD worklet");
          this.resampler = new resampler_1.Resampler({
            nativeSampleRate: sampleRate,
            targetSampleRate: 16000,
            targetFrameSize: 1536,
          });
          this._initialized = true;
          logging_1.log.debug(
            "Initialized SayPi VAD worklet with sample rate",
            sampleRate
          );
        };
        this.options = options.processorOptions;
        this.port.onmessage = (ev) => {
          if (ev.data.message === messages_1.Message.SpeechStop) {
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
            this.port.postMessage(
              { message: messages_1.Message.AudioFrame, data: frame.buffer },
              [frame.buffer]
            );
          }
        }
        return true;
      }
    }
    registerProcessor("vad-helper-worklet", Processor);
    //# sourceMappingURL=worklet.js.map
  })();

  /******/
})();
