// ==UserScript==
// @name         Say, Pi
// @namespace    http://www.saypi.ai/
// @version      1.3.8
// @description  Speak to Pi with OpenAI's Whisper
// @author       Ross Cadogan
// @match        https://pi.ai/talk
// @inject-into  page
// @updateURL    https://app.saypi.ai/saypi.user.js
// @downloadURL  https://app.saypi.ai/saypi.user.js
// @license      MIT
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/UserAgentModule.js":
/*!********************************!*\
  !*** ./src/UserAgentModule.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addDeviceFlags: () => (/* binding */ addDeviceFlags),
/* harmony export */   addUserAgentFlags: () => (/* binding */ addUserAgentFlags),
/* harmony export */   addViewFlags: () => (/* binding */ addViewFlags),
/* harmony export */   enterMobileMode: () => (/* binding */ enterMobileMode),
/* harmony export */   exitMobileMode: () => (/* binding */ exitMobileMode),
/* harmony export */   isMobileDevice: () => (/* binding */ isMobileDevice),
/* harmony export */   isMobileView: () => (/* binding */ isMobileView),
/* harmony export */   isSafari: () => (/* binding */ isSafari)
/* harmony export */ });
function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.matchMedia("(max-width: 768px)").matches;
}

// Use localStorage to persist user preference
function isMobileView() {
  var userViewPreference = localStorage.getItem("userViewPreference");
  if (userViewPreference) {
    return userViewPreference === "mobile";
  }
  return isMobileDevice();
}
function exitMobileMode() {
  localStorage.setItem("userViewPreference", "desktop"); // Save preference

  var element = document.documentElement;
  element.classList.remove("mobile-view");
  element.classList.add("desktop-view");
}
function enterMobileMode() {
  localStorage.setItem("userViewPreference", "mobile"); // Save preference

  var element = document.documentElement;
  element.classList.remove("desktop-view");
  element.classList.add("mobile-view");
}
function addUserAgentFlags() {
  var isFirefoxAndroid = /Firefox/.test(navigator.userAgent) && /Android/.test(navigator.userAgent);
  var element = document.documentElement;
  if (isFirefoxAndroid) {
    element.classList.add("firefox-android");
  }
  addDeviceFlags(element);
  addViewFlags(element);
}
function addDeviceFlags(element) {
  if (isMobileDevice()) {
    element.classList.add("mobile-device");
  }
}
function addViewFlags(element) {
  if (isMobileView()) {
    element.classList.add("mobile-view");
  } else {
    element.classList.remove("mobile-view");
    element.classList.add("desktop-view");
  }
}

/***/ }),

/***/ "./src/state-machines/AudioInputMachine.js":
/*!*************************************************!*\
  !*** ./src/state-machines/AudioInputMachine.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   audioInputMachine: () => (/* binding */ audioInputMachine)
/* harmony export */ });
/* harmony import */ var xstate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! xstate */ "./node_modules/xstate/es/Machine.js");

var EventBus = window.EventBus;
var audioMimeType = "audio/webm;codecs=opus";
var threshold = 1000; // 1000 ms = 1 second, about the length of "Hey, Pi"

// Declare a global variable for the mediaRecorder
var mediaRecorder;
function setupRecording(callback) {
  if (mediaRecorder) {
    return;
  }

  // Get a stream from the user's microphone
  navigator.mediaDevices.getUserMedia({
    audio: true
  }).then(function (stream) {
    if (!MediaRecorder.isTypeSupported(audioMimeType)) {
      // use MP4 for Safari
      audioMimeType = "audio/mp4";
    }
    // Create a new MediaRecorder object using the stream and specifying the MIME type
    var options = {
      mimeType: audioMimeType
    };
    mediaRecorder = new MediaRecorder(stream, options);
    mediaRecorder.addEventListener("dataavailable", function (event) {
      EventBus.emit("audio:dataavailable", {
        data: event.data
      });
    });
    mediaRecorder.addEventListener("stop", function () {
      EventBus.emit("audio:input:stop");
    });
  }).then(function () {
    // Invoke the callback function
    if (typeof callback === "function") {
      callback();
    }
  })["catch"](function (err) {
    console.error("Error getting audio stream: " + err);
  });
}
function tearDownRecording() {
  // Check if the MediaRecorder is set up
  if (!mediaRecorder) {
    return;
  }

  // Stop any ongoing recording
  if (mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }

  // Clear the MediaRecorder variable
  mediaRecorder = null;
}
var audioInputMachine = (0,xstate__WEBPACK_IMPORTED_MODULE_0__.createMachine)({
  /** @xstate-layout N4IgpgJg5mDOIC5QEMCuECWB7AkgOwAdUAXAOgCcwAbMZWSAYmQGMBHVDSgbQAYBdRKAJZYGYtjyCQAD0QBGAGwBmUgFYANCACeiJXIAcpBQHYAnAtP6l+gCw2lAJgU2Avi81pMuQiVIt2nBh4UAwQWHhgpEEAblgA1pGe2PhEZP4c5EFQCDFYzMji4bx8xVLCooWSSDKIqg6aOgj6xnJqCqo8qtbKpjwODm4e6Mk+aWwZWQxg5ORY5KQEVAUAZnMAtn7D3ql+44HBOXix+ZXFpdXlYhJSsghyxioa2oj9qqT97Q-Wdo4KgyBJba+dKcRiUGh0MDnIQiK7hG7yB5qBqIfStDo8HhyHj6Wz2Jxyf6AlLAvaUCBRCA0BiwYjIcjEaEgS6VBEIGxyFSWezGJ6NfTmUhyVQKRSmbFKZQtIlbEljALkihgZhzTDBGnELAEABKYHYcGIkCZLOu1VuJgUaiUvQUDj5iHFrRsAo6DnsFmMnRlXjluwVkCVKvIapCEAKyAAgtFkBglgAjGjG2Gss21Bw8NT6VSmJS8lFNO2kGwOcw8BQKHiS3OE9wA2WjP0ZAMEMB4EMAZU1BA1WqTFVNoFucjkOaMdvzphspiFjgeikrUprQx9DZBipbbayna1oXDUZj8cT-DKyYHNQQk5UVnTenHzwLb1MJYr5YX1e9Ix2a4DtK1LYgDB9nCVSDvII4qLa9oIJ6bz3OYSjOjYXTGKKbi1ngWAQHAUjEqMJ79vCqYIAAtAo+bEY+phUbyPDFs4T6obWuE7OCtD0BA+HAWyxb5sONhGFiqhfHivxLnWK5fmSWScSmoHsumRiIbmUH9NOw6WH0qiqNiVFKB+QLyk2HEXKehFyQ4+gOEWtjKfmQkqHBr6CdpSiqPpvrfhSGBUmAMlnrcShKBmSl5ve4rTsoDhzhWVbSkx9aSf6FKUEGIZ+WZ55dJaJgGKFjQMaQuJRXoMWLu5q5ks2rYdl26UgeetjTlRDi5VBT7GKQ1jFfOsVicxpJJaQv4EP+dVsnIJatBZE2epOWZOG1E2kC0Fb6AoVi5mWaEuEAA */
  context: {
    audioDataChunks: []
  },
  id: "audioInput",
  initial: "released",
  states: {
    released: {
      on: {
        acquire: {
          target: "acquiring"
        }
      }
    },
    acquiring: {
      description: "Acquiring the microphone. Waits until asynchronous call has completed.",
      invoke: {
        src: "acquireMediaRecorder",
        onDone: {
          target: "acquired"
        },
        onError: {
          target: "released",
          actions: "logError"
        }
      }
    },
    acquired: {
      description: "Microphone acquired and ready to start recording.",
      initial: "idle",
      states: {
        idle: {
          on: {
            start: {
              target: "recording",
              actions: {
                type: "startRecording",
                cond: "mediaRecorderAcquired"
              }
            }
          }
        },
        recording: {
          on: {
            stopRequested: {
              target: "pendingStop",
              actions: {
                type: "stopRecording"
              }
            },
            dataAvailable: {
              actions: {
                type: "addData",
                params: {}
              },
              internal: true
            }
          }
        },
        pendingStop: {
          description: "Waiting for the MediaRecorder to stop recording.",
          on: {
            stop: {
              target: "stopped"
            },
            dataAvailable: {
              actions: {
                type: "addData",
                params: {}
              },
              internal: true
            }
          }
        },
        stopped: {
          entry: {
            type: "sendData",
            params: {},
            cond: "hasData"
          },
          always: "idle"
        }
      },
      on: {
        release: {
          target: "released",
          actions: {
            type: "releaseMediaRecorder"
          }
        }
      }
    }
  },
  predictableActionArguments: true,
  preserveActionOrder: true
}, {
  actions: {
    startRecording: function startRecording(context, event) {
      // Clear the array for the next recording
      context.audioDataChunks = [];
      context.startTime = Date.now();

      // Start recording
      mediaRecorder.start();
      EventBus.emit("saypi:userSpeaking");
    },
    stopRecording: function stopRecording(context, event) {
      // TODO: do I need this state check?
      if (mediaRecorder && mediaRecorder.state === "recording") {
        // Stop recording
        mediaRecorder.stop();

        // Record the stop time and calculate the duration
        var stopTime = Date.now();
        var duration = stopTime - context.startTime;
        EventBus.emit("saypi:userStoppedSpeaking", {
          duration: duration
        });
      }
    },
    addData: function addData(context, event) {
      // Add the new data to the array
      context.audioDataChunks.push(event.data);
    },
    sendData: function sendData(context, event) {
      // Create a Blob from the audio data chunks
      var audioBlob = new Blob(context.audioDataChunks, {
        type: mediaRecorder.mimeType
      });

      // Get the stop time and calculate the duration
      var stopTime = Date.now();
      var duration = stopTime - context.startTime;

      // If the duration is greater than the threshold, upload the audio for transcription
      if (duration >= threshold) {
        // Upload the audio to the server for transcription
        EventBus.emit("saypi:userFinishedSpeaking", {
          duration: duration,
          blob: audioBlob
        });
      } else {
        console.log("Recording was too short, not uploading for transcription");
      }
    },
    releaseMediaRecorder: function releaseMediaRecorder(context, event) {
      tearDownRecording();
    },
    logError: function logError(context, event) {
      console.error("Error acquiring MediaRecorder: ", event.data);
    }
  },
  services: {
    acquireMediaRecorder: function acquireMediaRecorder(context, event, _ref) {
      var send = _ref.send;
      return new Promise(function (resolve, reject) {
        setupRecording(function () {
          if (mediaRecorder) {
            resolve();
          } else {
            reject(new Error("Failed to acquire MediaRecorder"));
          }
        });
      });
    }
  },
  guards: {
    mediaRecorderAcquired: function mediaRecorderAcquired(context, event) {
      return mediaRecorder !== null;
    },
    hasData: function hasData(context, event) {
      return context.audioDataChunks.length > 0;
    }
  },
  delays: {}
});

/***/ }),

/***/ "./src/state-machines/AudioOutputMachine.js":
/*!**************************************************!*\
  !*** ./src/state-machines/AudioOutputMachine.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   audioOutputMachine: () => (/* binding */ audioOutputMachine)
/* harmony export */ });
/* harmony import */ var xstate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! xstate */ "./node_modules/xstate/es/Machine.js");
/* harmony import */ var xstate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! xstate */ "./node_modules/xstate/es/index.js");
/* harmony import */ var _UserAgentModule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../UserAgentModule */ "./src/UserAgentModule.js");


var EventBus = window.EventBus;
var audioElement = document.querySelector("audio");
if (!audioElement) {
  console.error("Audio element not found in output machine!");
}
var audioOutputMachine = (0,xstate__WEBPACK_IMPORTED_MODULE_1__.createMachine)({
  /** @xstate-layout N4IgpgJg5mDOIC5QEMCuECWB7A8qgLgA4EDEYAtofhpANoAMAuoqIVrBtVgHYsgCeiALQBGAOwBWADQgAHohEBOACzKAdMrEA2LQA4ATPq0iJW-QF9zMtJlwFi+NRggAbMCRdZkEWPmQAnfAZmJBA2Di5eUPkEQwk1aQFERX1FNXoM+hMAZnoJXRFsrUtrdGw8IgI1T28MbigPLwhIcjA-CGQ-YL5wzmwo0BiJfRlBBAKEzPpFDPFdbP1lEpAbcvsqmuaINX8wb34SQhdkfm7Q3si+GJEsrQTsmbNEsdTsybEDD7yCouXVu0qjk2kDURxOdQahDQsDAZ1Y7D6PCuySM90UIn0GKMym+o0Qqn0ai0C0+um+hWKVhWZQBDmqTRBYP4ELI3C2cLCCMu0RRdwkDwxWK0OPyeIQ4noan0Eg++i++UK+T+NIqdOB2yZLIAxshuEz8AALfxYVBQA0ci79ZEIRQytRibTTehaPLZbLzMXDMT23QzB1khW-Kn-VUbBka47M+okC1cq08m2o-nozGGYW4pIIB53Yn6UnkoOlWyhoHh0HQyCHSOxiLxwYKLLqIpiRZmbEZsbZZS6NSFPNygM-SlFtaA+neRkViAkXabGuIgZyBR5ntiG6KRRt9OizPKW32iSzfkFiTK4vrUsT7ZgNmVmFgADWdCYPTjSITpj5Yno2Qxz0QRSEn2-r0GIyjiOIlhUtwWDNPAoQhher61u+9YIEIWhikIRiEqewYqheTiuGAyELtaygjJm2hvKkIh6EoLbdj+Z6jmqTQQqR3JoXRvr2iINwykYJhmGKvGHkeHyHroujKHhI60mGV6cXWS6xBIaTJs60qiYSkhfHu+hFO6igsQpl5bDsewQGM8IoYuMQUeomlPGK+hZESCwgWBEFiKZJbjhZmr1MpqGqVoiirqoMnOq67rZGKCzqH2+aBsO1LnmO6rlqgMIQCF9kKAJRLiK2aYiroCXge8KVDn5hFZTeWz5dauTes52mZhIdq5jVFJQeYQA */
  id: "audioOutput",
  context: {
    autoplay: false,
    audioElement: audioElement
  },
  initial: "idle",
  states: {
    idle: {
      on: {
        loadstart: "loading"
      }
    },
    loading: {
      on: {
        loadedmetadata: "loaded"
      }
    },
    loaded: {
      initial: "ready",
      on: {
        emptied: "idle"
      },
      states: {
        ready: {
          description: "Audio has loaded and is ready to start playing (further buffering may be required to reach the end).",
          on: {
            play: "playing"
          },
          entry: {
            type: "emitEvent",
            params: {
              eventName: "saypi:ready"
            }
          }
        },
        playing: {
          on: {
            pause: "paused",
            ended: "ended",
            canplaythrough: {
              target: "playing",
              internal: true
            }
          },
          always: {
            target: "paused",
            cond: "isSafariAutoPlay",
            actions: ["requestPause", {
              type: "emitEvent",
              params: {
                eventName: "saypi:safariBlocked"
              }
            }]
          },
          entry: [{
            type: "emitEvent",
            params: {
              eventName: "saypi:piSpeaking"
            }
          }],
          exit: [{
            type: "emitEvent",
            params: {
              eventName: "saypi:piStoppedSpeaking"
            }
          }, (0,xstate__WEBPACK_IMPORTED_MODULE_2__.assign)({
            autoplay: true,
            audioElement: function audioElement(context) {
              return context.audioElement;
            }
          })]
        },
        paused: {
          on: {
            play: "playing",
            reload: {
              target: "#audioOutput.loading",
              description: "Reload the audio stream for Safari. This is the only command that external modules can send the machine.",
              actions: [(0,xstate__WEBPACK_IMPORTED_MODULE_2__.assign)(function (context) {
                return {
                  autoplay: false,
                  audioElement: context.audioElement
                };
              }), "reloadAudio"],
              cond: "isSafari"
            }
          }
        },
        ended: {
          on: {
            seeked: {
              target: "#audioOutput.loaded.ready",
              description: "An ended track is seeked back to earlier in the track."
            }
          },
          entry: [{
            type: "emitEvent",
            params: {
              eventName: "saypi:piFinishedSpeaking"
            }
          }]
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
    },
    requestPause: function requestPause(context, event) {
      context.audioElement.pause();
    },
    seekToEnd: function seekToEnd(context, event) {
      var audio = context.audioElement;
      if (audio.duration && !audio.ended && audio.currentTime < audio.duration) {
        audio.currentTime = audio.duration; // seek the audio to the end
        audio.play(); // trigger the ended event
      }

      EventBus.emit("saypi:piFinishedSpeaking");
    },
    requestReload: function requestReload(context) {
      var audio = context.audioElement;
      audio.load();
      audio.play();
    }
  },
  guards: {
    isSafari: function isSafari(context, event) {
      return (0,_UserAgentModule__WEBPACK_IMPORTED_MODULE_0__.isSafari)();
    },
    isSafariMobile: function isSafariMobile(context, event) {
      return (0,_UserAgentModule__WEBPACK_IMPORTED_MODULE_0__.isSafari)() && (0,_UserAgentModule__WEBPACK_IMPORTED_MODULE_0__.isMobileView)();
    },
    isSafariAutoPlay: function isSafariAutoPlay(context, event) {
      return (0,_UserAgentModule__WEBPACK_IMPORTED_MODULE_0__.isSafari)() && context.autoplay;
    }
  }
});

/***/ }),

/***/ "./node_modules/xstate/es/Actor.js":
/*!*****************************************!*\
  !*** ./node_modules/xstate/es/Actor.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createDeferredActor: () => (/* binding */ createDeferredActor),
/* harmony export */   createInvocableActor: () => (/* binding */ createInvocableActor),
/* harmony export */   createNullActor: () => (/* binding */ createNullActor),
/* harmony export */   isActor: () => (/* binding */ isActor),
/* harmony export */   isSpawnedActor: () => (/* binding */ isSpawnedActor),
/* harmony export */   toActorRef: () => (/* binding */ toActorRef)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "./node_modules/xstate/es/_virtual/_tslib.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./node_modules/xstate/es/utils.js");
/* harmony import */ var _serviceScope_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./serviceScope.js */ "./node_modules/xstate/es/serviceScope.js");




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
  }, _a[_utils_js__WEBPACK_IMPORTED_MODULE_0__.symbolObservable] = function () {
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

  var invokeSrc = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toInvokeSource)(invokeDefinition.src);
  var serviceCreator = (_a = machine === null || machine === void 0 ? void 0 : machine.options.services) === null || _a === void 0 ? void 0 : _a[invokeSrc.type];
  var resolvedData = invokeDefinition.data ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.mapContext)(invokeDefinition.data, context, _event) : undefined;
  var tempActor = serviceCreator ? createDeferredActor(serviceCreator, invokeDefinition.id, resolvedData) : createNullActor(invokeDefinition.id); // @ts-ignore

  tempActor.meta = invokeDefinition;
  return tempActor;
}
function createDeferredActor(entity, id, data) {
  var tempActor = createNullActor(id); // @ts-ignore

  tempActor.deferred = true;

  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isMachine)(entity)) {
    // "mute" the existing service scope so potential spawned actors within the `.initialState` stay deferred here
    var initialState_1 = tempActor.state = (0,_serviceScope_js__WEBPACK_IMPORTED_MODULE_1__.provide)(undefined, function () {
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

  return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((_a = {
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
  }, _a[_utils_js__WEBPACK_IMPORTED_MODULE_0__.symbolObservable] = function () {
    return this;
  }, _a), actorRefLike);
}




/***/ }),

/***/ "./node_modules/xstate/es/Machine.js":
/*!*******************************************!*\
  !*** ./node_modules/xstate/es/Machine.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Machine: () => (/* binding */ Machine),
/* harmony export */   createMachine: () => (/* binding */ createMachine)
/* harmony export */ });
/* harmony import */ var _StateNode_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StateNode.js */ "./node_modules/xstate/es/StateNode.js");
/* harmony import */ var _environment_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environment.js */ "./node_modules/xstate/es/environment.js");



var warned = false;
function Machine(config, options, initialContext) {
  if (initialContext === void 0) {
    initialContext = config.context;
  }

  return new _StateNode_js__WEBPACK_IMPORTED_MODULE_0__.StateNode(config, options, initialContext);
}
function createMachine(config, options) {
  if (!_environment_js__WEBPACK_IMPORTED_MODULE_1__.IS_PRODUCTION && !('predictableActionArguments' in config) && !warned) {
    warned = true;
    console.warn('It is highly recommended to set `predictableActionArguments` to `true` when using `createMachine`. https://xstate.js.org/docs/guides/actions.html');
  }

  return new _StateNode_js__WEBPACK_IMPORTED_MODULE_0__.StateNode(config, options);
}




/***/ }),

/***/ "./node_modules/xstate/es/State.js":
/*!*****************************************!*\
  !*** ./node_modules/xstate/es/State.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   State: () => (/* binding */ State),
/* harmony export */   bindActionToState: () => (/* binding */ bindActionToState),
/* harmony export */   isState: () => (/* binding */ isState),
/* harmony export */   isStateConfig: () => (/* binding */ isStateConfig),
/* harmony export */   stateValuesEqual: () => (/* binding */ stateValuesEqual)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "./node_modules/xstate/es/_virtual/_tslib.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants.js */ "./node_modules/xstate/es/constants.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./node_modules/xstate/es/utils.js");
/* harmony import */ var _stateUtils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./stateUtils.js */ "./node_modules/xstate/es/stateUtils.js");
/* harmony import */ var _actions_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./actions.js */ "./node_modules/xstate/es/actions.js");
/* harmony import */ var _environment_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./environment.js */ "./node_modules/xstate/es/environment.js");







function stateValuesEqual(a, b) {
  if (a === b) {
    return true;
  }

  if (a === undefined || b === undefined) {
    return false;
  }

  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(a) || (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(b)) {
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

var isState = isStateConfig;
function bindActionToState(action, state) {
  var exec = action.exec;

  var boundAction = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__assign)({}, action), {
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
    this.activities = _constants_js__WEBPACK_IMPORTED_MODULE_2__.EMPTY_ACTIVITY_MAP;
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
    this.activities = config.activities || _constants_js__WEBPACK_IMPORTED_MODULE_2__.EMPTY_ACTIVITY_MAP;
    this.meta = (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_3__.getMeta)(config.configuration);
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
        return (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_3__.nextEvents)(_this.configuration);
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

    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(stateValue)) {
      return [stateValue];
    }

    var valueKeys = Object.keys(stateValue);
    return valueKeys.concat.apply(valueKeys, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__read)(valueKeys.map(function (key) {
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
        var jsonValues = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__rest)(_a, ["configuration", "transitions", "tags", "machine"]);

    return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__assign)({}, jsonValues), {
      tags: Array.from(tags)
    });
  };

  State.prototype.matches = function (parentStateValue) {
    return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.matchesState)(parentStateValue, this.value);
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

    if (_environment_js__WEBPACK_IMPORTED_MODULE_5__.IS_PRODUCTION) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.warn)(!!this.machine, "state.can(...) used outside of a machine-created State object; this will always return false.");
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

/***/ "./node_modules/xstate/es/StateNode.js":
/*!*********************************************!*\
  !*** ./node_modules/xstate/es/StateNode.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StateNode: () => (/* binding */ StateNode)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "./node_modules/xstate/es/_virtual/_tslib.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./node_modules/xstate/es/utils.js");
/* harmony import */ var _State_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./State.js */ "./node_modules/xstate/es/State.js");
/* harmony import */ var _actionTypes_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./actionTypes.js */ "./node_modules/xstate/es/actionTypes.js");
/* harmony import */ var _actions_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./actions.js */ "./node_modules/xstate/es/actions.js");
/* harmony import */ var _environment_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environment.js */ "./node_modules/xstate/es/environment.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants.js */ "./node_modules/xstate/es/constants.js");
/* harmony import */ var _stateUtils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./stateUtils.js */ "./node_modules/xstate/es/stateUtils.js");
/* harmony import */ var _Actor_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Actor.js */ "./node_modules/xstate/es/Actor.js");
/* harmony import */ var _invokeUtils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./invokeUtils.js */ "./node_modules/xstate/es/invokeUtils.js");











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
    return !('cond' in transition) && !('in' in transition) && ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(transition.target) || (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isMachine)(transition.target));
  });
  var eventText = event === NULL_EVENT ? 'the transient event' : "event '".concat(event, "'");
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.warn)(!hasNonLastUnguardedTarget, "One or more transitions for ".concat(eventText, " on state '").concat(stateNode.id, "' are unreachable. ") + "Make sure that the default transition is the last one defined.");
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
    this.delimiter = this.config.delimiter || (this.parent ? this.parent.delimiter : _constants_js__WEBPACK_IMPORTED_MODULE_1__.STATE_DELIMITER);
    this.id = this.config.id || (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)([this.machine.key], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(this.path), false).join(this.delimiter);
    this.version = this.parent ? this.parent.version : this.config.version;
    this.type = this.config.type || (this.config.parallel ? 'parallel' : this.config.states && Object.keys(this.config.states).length ? 'compound' : this.config.history ? 'history' : 'atomic');
    this.schema = this.parent ? this.machine.schema : (_a = this.config.schema) !== null && _a !== void 0 ? _a : {};
    this.description = this.config.description;

    if (!_environment_js__WEBPACK_IMPORTED_MODULE_3__.IS_PRODUCTION) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.warn)(!('parallel' in this.config), "The \"parallel\" property is deprecated and will be removed in version 4.1. ".concat(this.config.parallel ? "Replace with `type: 'parallel'`" : "Use `type: '".concat(this.type, "'`"), " in the config for state node '").concat(this.id, "' instead."));
    }

    this.initial = this.config.initial;
    this.states = this.config.states ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.mapValues)(this.config.states, function (stateConfig, key) {
      var _a;

      var stateNode = new StateNode(stateConfig, {}, undefined, {
        parent: _this,
        key: key
      });
      Object.assign(_this.idMap, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((_a = {}, _a[stateNode.id] = stateNode, _a), stateNode.idMap));
      return stateNode;
    }) : EMPTY_OBJECT; // Document order

    var order = 0;

    function dfs(stateNode) {
      var e_1, _a;

      stateNode.order = order++;

      try {
        for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__values)((0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.getAllChildren)(stateNode)), _c = _b.next(); !_c.done; _c = _b.next()) {
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

    this.onEntry = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toArray)(this.config.entry || this.config.onEntry).map(function (action) {
      return (0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.toActionObject)(action);
    }); // TODO: deprecate (exit)

    this.onExit = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toArray)(this.config.exit || this.config.onExit).map(function (action) {
      return (0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.toActionObject)(action);
    });
    this.meta = this.config.meta;
    this.doneData = this.type === 'final' ? this.config.data : undefined;
    this.invoke = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toArray)(this.config.invoke).map(function (invokeConfig, i) {
      var _a, _b;

      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isMachine)(invokeConfig)) {
        var invokeId = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.createInvokeId)(_this.id, i);
        _this.machine.options.services = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((_a = {}, _a[invokeId] = invokeConfig, _a), _this.machine.options.services);
        return (0,_invokeUtils_js__WEBPACK_IMPORTED_MODULE_6__.toInvokeDefinition)({
          src: invokeId,
          id: invokeId
        });
      } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(invokeConfig.src)) {
        var invokeId = invokeConfig.id || (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.createInvokeId)(_this.id, i);
        return (0,_invokeUtils_js__WEBPACK_IMPORTED_MODULE_6__.toInvokeDefinition)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, invokeConfig), {
          id: invokeId,
          src: invokeConfig.src
        }));
      } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isMachine)(invokeConfig.src) || (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isFunction)(invokeConfig.src)) {
        var invokeId = invokeConfig.id || (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.createInvokeId)(_this.id, i);
        _this.machine.options.services = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((_b = {}, _b[invokeId] = invokeConfig.src, _b), _this.machine.options.services);
        return (0,_invokeUtils_js__WEBPACK_IMPORTED_MODULE_6__.toInvokeDefinition)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({
          id: invokeId
        }, invokeConfig), {
          src: invokeId
        }));
      } else {
        var invokeSource = invokeConfig.src;
        return (0,_invokeUtils_js__WEBPACK_IMPORTED_MODULE_6__.toInvokeDefinition)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({
          id: (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.createInvokeId)(_this.id, i)
        }, invokeConfig), {
          src: invokeSource
        }));
      }
    });
    this.activities = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toArray)(this.config.activities).concat(this.invoke).map(function (activity) {
      return (0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.toActivityDefinition)(activity);
    });
    this.transition = this.transition.bind(this);
    this.tags = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toArray)(this.config.tags); // TODO: this is the real fix for initialization once
    // state node getters are deprecated
    // if (!this.parent) {
    //   this._init();
    // }
  }

  StateNode.prototype._init = function () {
    if (this.__cache.transitions) {
      return;
    }

    (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.getAllStateNodes)(this).forEach(function (stateNode) {
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
      actions: (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, actions), options.actions),
      activities: (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, activities), options.activities),
      guards: (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, guards), options.guards),
      services: (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, services), options.services),
      delays: (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, delays), options.delays)
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
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isFunction)(this._context) ? this._context() : this._context;
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
        states: (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.mapValues)(this.states, function (state) {
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
      var delayRef = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isFunction)(delay) ? "".concat(_this.id, ":delay[").concat(i, "]") : delay;
      var eventType = (0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.after)(delayRef, _this.id);

      _this.onEntry.push((0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.send)(eventType, {
        delay: delay
      }));

      _this.onExit.push((0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.cancel)(eventType));

      return eventType;
    };

    var delayedTransitions = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isArray)(afterConfig) ? afterConfig.map(function (transition, i) {
      var eventType = mutateEntryExit(transition.delay, i);
      return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, transition), {
        event: eventType
      });
    }) : (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)(Object.keys(afterConfig).map(function (delay, i) {
      var configTransition = afterConfig[delay];
      var resolvedTransition = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(configTransition) ? {
        target: configTransition
      } : configTransition;
      var resolvedDelay = !isNaN(+delay) ? +delay : delay;
      var eventType = mutateEntryExit(resolvedDelay, i);
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toArray)(resolvedTransition).map(function (transition) {
        return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, transition), {
          event: eventType,
          delay: resolvedDelay
        });
      });
    }));
    return delayedTransitions.map(function (delayedTransition) {
      var delay = delayedTransition.delay;
      return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, _this.formatTransition(delayedTransition)), {
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

    var stateValue = state instanceof _State_js__WEBPACK_IMPORTED_MODULE_7__.State ? state.value : (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toStateValue)(state, this.delimiter);

    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(stateValue)) {
      var initialStateValue = this.getStateNode(stateValue).initial;
      return initialStateValue !== undefined ? this.getStateNodes((_a = {}, _a[stateValue] = initialStateValue, _a)) : [this, this.states[stateValue]];
    }

    var subStateKeys = Object.keys(stateValue);
    var subStateNodes = [this];
    subStateNodes.push.apply(subStateNodes, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)(subStateKeys.map(function (subStateKey) {
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
    var eventType = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.getEventType)(event);
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
    var stateFromConfig = state instanceof _State_js__WEBPACK_IMPORTED_MODULE_7__.State ? state : _State_js__WEBPACK_IMPORTED_MODULE_7__.State.create(state);
    var configuration = Array.from((0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.getConfiguration)([], this.getStateNodes(stateFromConfig.value)));
    return new _State_js__WEBPACK_IMPORTED_MODULE_7__.State((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, stateFromConfig), {
      value: this.resolve(stateFromConfig.value),
      configuration: configuration,
      done: (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.isInFinalState)(configuration, this),
      tags: (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.getTagsFromConfiguration)(configuration),
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
      for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__values)(Object.keys(stateValue)), _c = _b.next(); !_c.done; _c = _b.next()) {
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
    var enabledTransitions = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)(stateTransitions.map(function (st) {
      return st.transitions;
    }));
    var willTransition = stateTransitions.some(function (st) {
      return st.transitions.length > 0;
    });

    if (!willTransition) {
      return this.next(state, _event);
    }

    var configuration = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)(Object.keys(transitionMap).map(function (key) {
      return transitionMap[key].configuration;
    }));
    return {
      transitions: enabledTransitions,
      exitSet: (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)(stateTransitions.map(function (t) {
        return t.exitSet;
      })),
      configuration: configuration,
      source: state,
      actions: (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)(Object.keys(transitionMap).map(function (key) {
        return transitionMap[key].actions;
      }))
    };
  };

  StateNode.prototype._transition = function (stateValue, state, _event) {
    // leaf node
    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(stateValue)) {
      return this.transitionLeafNode(stateValue, state, _event);
    } // hierarchical node


    if (Object.keys(stateValue).length === 1) {
      return this.transitionCompoundNode(stateValue, state, _event);
    } // orthogonal node


    return this.transitionParallelNode(stateValue, state, _event);
  };

  StateNode.prototype.getTransitionData = function (state, event) {
    return this._transition(state.value, state, (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toSCXMLEvent)(event));
  };

  StateNode.prototype.next = function (state, _event) {
    var e_3, _a;

    var _this = this;

    var eventName = _event.name;
    var actions = [];
    var nextStateNodes = [];
    var selectedTransition;

    try {
      for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__values)(this.getCandidates(eventName)), _c = _b.next(); !_c.done; _c = _b.next()) {
        var candidate = _c.value;
        var cond = candidate.cond,
            stateIn = candidate.in;
        var resolvedContext = state.context;
        var isInState = stateIn ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(stateIn) && isStateId(stateIn) ? // Check if in state by ID
        state.matches((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toStateValue)(this.getStateNodeById(stateIn).path, this.delimiter)) : // Check if in state by relative grandparent
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.matchesState)((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toStateValue)(stateIn, this.delimiter), (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.path)(this.path.slice(0, -2))(state.value)) : true;
        var guardPassed = false;

        try {
          guardPassed = !cond || (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.evaluateGuard)(this.machine, cond, resolvedContext, _event, state);
        } catch (err) {
          throw new Error("Unable to evaluate guard '".concat(cond.name || cond.type, "' in transition for event '").concat(eventName, "' in state node '").concat(this.id, "':\n").concat(err.message));
        }

        if (guardPassed && isInState) {
          if (candidate.target !== undefined) {
            nextStateNodes = candidate.target;
          }

          actions.push.apply(actions, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(candidate.actions), false));
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

    var allNextStateNodes = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)(nextStateNodes.map(function (stateNode) {
      return _this.getRelativeStateNodes(stateNode, state.historyValue);
    }));
    var isInternal = !!selectedTransition.internal;
    return {
      transitions: [selectedTransition],
      exitSet: isInternal ? [] : (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)(nextStateNodes.map(function (targetNode) {
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

    var prevConfig = prevState ? (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.getConfiguration)([], this.getStateNodes(prevState.value)) : [];
    var entrySet = new Set();

    try {
      for (var _c = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__values)(Array.from(resolvedConfig).sort(function (a, b) {
        return a.order - b.order;
      })), _d = _c.next(); !_d.done; _d = _c.next()) {
        var sn = _d.value;

        if (!(0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.has)(prevConfig, sn) || (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.has)(transition.exitSet, sn) || sn.parent && entrySet.has(sn.parent)) {
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
      for (var prevConfig_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__values)(prevConfig), prevConfig_1_1 = prevConfig_1.next(); !prevConfig_1_1.done; prevConfig_1_1 = prevConfig_1.next()) {
        var sn = prevConfig_1_1.value;

        if (!(0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.has)(resolvedConfig, sn) || (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.has)(transition.exitSet, sn.parent)) {
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
    var doneEvents = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)(entryStates.map(function (sn) {
      var events = [];

      if (sn.type !== 'final') {
        return events;
      }

      var parent = sn.parent;

      if (!parent.parent) {
        return events;
      }

      events.push((0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.done)(sn.id, sn.doneData), // TODO: deprecate - final states should not emit done events for their own state.
      (0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.done)(parent.id, sn.doneData ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.mapContext)(sn.doneData, currentContext, _event) : undefined));
      var grandparent = parent.parent;

      if (grandparent.type === 'parallel') {
        if ((0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.getChildren)(grandparent).every(function (parentNode) {
          return (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.isInFinalState)(transition.configuration, parentNode);
        })) {
          events.push((0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.done)(grandparent.id));
        }
      }

      return events;
    }));
    var entryActions = entryStates.map(function (stateNode) {
      var entryActions = stateNode.onEntry;
      var invokeActions = stateNode.activities.map(function (activity) {
        return (0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.start)(activity);
      });
      return {
        type: 'entry',
        actions: (0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.toActionObjects)(predictableExec ? (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(entryActions), false), (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(invokeActions), false) : (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(invokeActions), false), (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(entryActions), false), _this.machine.options.actions)
      };
    }).concat({
      type: 'state_done',
      actions: doneEvents.map(function (event) {
        return (0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.raise)(event);
      })
    });
    var exitActions = Array.from(exitStates).map(function (stateNode) {
      return {
        type: 'exit',
        actions: (0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.toActionObjects)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(stateNode.onExit), false), (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(stateNode.activities.map(function (activity) {
          return (0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.stop)(activity);
        })), false), _this.machine.options.actions)
      };
    });
    var actions = exitActions.concat({
      type: 'transition',
      actions: (0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.toActionObjects)(transition.actions, this.machine.options.actions)
    }).concat(entryActions);

    if (isDone) {
      var stopActions = (0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.toActionObjects)((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(resolvedConfig), false).sort(function (a, b) {
        return b.order - a.order;
      }).map(function (stateNode) {
        return stateNode.onExit;
      })), this.machine.options.actions).filter(function (action) {
        return !(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isRaisableAction)(action);
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

    var _event = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toSCXMLEvent)(event);

    var currentState;

    if (state instanceof _State_js__WEBPACK_IMPORTED_MODULE_7__.State) {
      currentState = context === undefined ? state : this.resolveState(_State_js__WEBPACK_IMPORTED_MODULE_7__.State.from(state, context));
    } else {
      var resolvedStateValue = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(state) ? this.resolve((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.pathToStateValue)(this.getResolvedPath(state))) : this.resolve(state);
      var resolvedContext = context !== null && context !== void 0 ? context : this.machine.context;
      currentState = this.resolveState(_State_js__WEBPACK_IMPORTED_MODULE_7__.State.from(resolvedStateValue, resolvedContext));
    }

    if (!_environment_js__WEBPACK_IMPORTED_MODULE_3__.IS_PRODUCTION && _event.name === WILDCARD) {
      throw new Error("An event cannot have the wildcard type ('".concat(WILDCARD, "')"));
    }

    if (this.strict) {
      if (!this.events.includes(_event.name) && !(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isBuiltInEvent)(_event.name)) {
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
    var prevConfig = (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.getConfiguration)([], this.getStateNodes(currentState.value));
    var resolvedConfig = stateTransition.configuration.length ? (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.getConfiguration)(prevConfig, stateTransition.configuration) : prevConfig;
    stateTransition.configuration = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(resolvedConfig), false);
    return this.resolveTransition(stateTransition, currentState, currentState.context, exec, _event);
  };

  StateNode.prototype.resolveRaisedTransition = function (state, _event, originalEvent, predictableExec) {
    var _a;

    var currentActions = state.actions;
    state = this.transition(state, _event, undefined, predictableExec); // Save original event to state
    // TODO: this should be the raised event! Delete in V5 (breaking)

    state._event = originalEvent;
    state.event = originalEvent.data;

    (_a = state.actions).unshift.apply(_a, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(currentActions), false));

    return state;
  };

  StateNode.prototype.resolveTransition = function (stateTransition, currentState, context, predictableExec, _event) {
    var e_6, _a, e_7, _b;

    var _this = this;

    if (_event === void 0) {
      _event = _actions_js__WEBPACK_IMPORTED_MODULE_5__.initEvent;
    }

    var configuration = stateTransition.configuration; // Transition will "apply" if:
    // - this is the initial state (there is no current state)
    // - OR there are transitions

    var willTransition = !currentState || stateTransition.transitions.length > 0;
    var resolvedConfiguration = willTransition ? stateTransition.configuration : currentState ? currentState.configuration : [];
    var isDone = (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.isInFinalState)(resolvedConfiguration, this);
    var resolvedStateValue = willTransition ? (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.getValue)(this.machine, configuration) : undefined;
    var historyValue = currentState ? currentState.historyValue ? currentState.historyValue : stateTransition.source ? this.machine.historyValue(currentState.value) : undefined : undefined;
    var actionBlocks = this.getActions(new Set(resolvedConfiguration), isDone, stateTransition, context, _event, currentState, predictableExec);
    var activities = currentState ? (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, currentState.activities) : {};

    try {
      for (var actionBlocks_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__values)(actionBlocks), actionBlocks_1_1 = actionBlocks_1.next(); !actionBlocks_1_1.done; actionBlocks_1_1 = actionBlocks_1.next()) {
        var block = actionBlocks_1_1.value;

        try {
          for (var _c = (e_7 = void 0, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__values)(block.actions)), _d = _c.next(); !_d.done; _d = _c.next()) {
            var action = _d.value;

            if (action.type === _actionTypes_js__WEBPACK_IMPORTED_MODULE_8__.start) {
              activities[action.activity.id || action.activity.type] = action;
            } else if (action.type === _actionTypes_js__WEBPACK_IMPORTED_MODULE_8__.stop) {
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

    var _e = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)((0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.resolveActions)(this, currentState, context, _event, actionBlocks, predictableExec, this.machine.config.predictableActionArguments || this.machine.config.preserveActionOrder), 2),
        resolvedActions = _e[0],
        updatedContext = _e[1];

    var _f = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.partition)(resolvedActions, _utils_js__WEBPACK_IMPORTED_MODULE_0__.isRaisableAction), 2),
        raisedEvents = _f[0],
        nonRaisedActions = _f[1];

    var invokeActions = resolvedActions.filter(function (action) {
      var _a;

      return action.type === _actionTypes_js__WEBPACK_IMPORTED_MODULE_8__.start && ((_a = action.activity) === null || _a === void 0 ? void 0 : _a.type) === _actionTypes_js__WEBPACK_IMPORTED_MODULE_8__.invoke;
    });
    var children = invokeActions.reduce(function (acc, action) {
      acc[action.activity.id] = (0,_Actor_js__WEBPACK_IMPORTED_MODULE_9__.createInvocableActor)(action.activity, _this.machine, updatedContext, _event);
      return acc;
    }, currentState ? (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, currentState.children) : {});
    var nextState = new _State_js__WEBPACK_IMPORTED_MODULE_7__.State({
      value: resolvedStateValue || currentState.value,
      context: updatedContext,
      _event: _event,
      // Persist _sessionid between states
      _sessionid: currentState ? currentState._sessionid : null,
      historyValue: resolvedStateValue ? historyValue ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.updateHistoryValue)(historyValue, resolvedStateValue) : undefined : currentState ? currentState.historyValue : undefined,
      history: !resolvedStateValue || stateTransition.source ? currentState : undefined,
      actions: resolvedStateValue ? nonRaisedActions : [],
      activities: resolvedStateValue ? activities : currentState ? currentState.activities : {},
      events: [],
      configuration: resolvedConfiguration,
      transitions: stateTransition.transitions,
      children: children,
      done: isDone,
      tags: (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.getTagsFromConfiguration)(resolvedConfiguration),
      machine: this
    });
    var didUpdateContext = context !== updatedContext;
    nextState.changed = _event.name === _actionTypes_js__WEBPACK_IMPORTED_MODULE_8__.update || didUpdateContext; // Dispose of penultimate histories to prevent memory leaks

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
          type: _actionTypes_js__WEBPACK_IMPORTED_MODULE_8__.nullEvent
        }, _event, predictableExec);
      }

      while (raisedEvents.length) {
        var raisedEvent = raisedEvents.shift();
        maybeNextState = this.resolveRaisedTransition(maybeNextState, raisedEvent._event, _event, predictableExec);
      }
    } // Detect if state changed


    var changed = maybeNextState.changed || (history ? !!maybeNextState.actions.length || didUpdateContext || typeof history.value !== typeof maybeNextState.value || !(0,_State_js__WEBPACK_IMPORTED_MODULE_7__.stateValuesEqual)(maybeNextState.value, history.value) : undefined);
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

    var arrayStatePath = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toStatePath)(statePath, this.delimiter).slice();
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
        return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.mapValues)(this.initialStateValue, function (subStateValue, subStateKey) {
          return subStateValue ? _this.getStateNode(subStateKey).resolve(stateValue[subStateKey] || subStateValue) : EMPTY_OBJECT;
        });

      case 'compound':
        if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(stateValue)) {
          var subStateNode = this.getStateNode(stateValue);

          if (subStateNode.type === 'parallel' || subStateNode.type === 'compound') {
            return _a = {}, _a[stateValue] = subStateNode.initialStateValue, _a;
          }

          return stateValue;
        }

        if (!Object.keys(stateValue).length) {
          return this.initialStateValue || {};
        }

        return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.mapValues)(stateValue, function (subStateValue, subStateKey) {
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

    return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toStatePath)(stateIdentifier, this.delimiter);
  };

  Object.defineProperty(StateNode.prototype, "initialStateValue", {
    get: function () {
      var _a;

      if (this.__cache.initialStateValue) {
        return this.__cache.initialStateValue;
      }

      var initialStateValue;

      if (this.type === 'parallel') {
        initialStateValue = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.mapFilterValues)(this.states, function (state) {
          return state.initialStateValue || EMPTY_OBJECT;
        }, function (stateNode) {
          return !(stateNode.type === 'history');
        });
      } else if (this.initial !== undefined) {
        if (!this.states[this.initial]) {
          throw new Error("Initial state '".concat(this.initial, "' not found on '").concat(this.key, "'"));
        }

        initialStateValue = (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.isLeafNode)(this.states[this.initial]) ? this.initial : (_a = {}, _a[this.initial] = this.states[this.initial].initialStateValue, _a);
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

        if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(historyConfig.target)) {
          target = isStateId(historyConfig.target) ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.pathToStateValue)(this.machine.getStateNodeById(historyConfig.target).path.slice(this.path.length - 1)) : historyConfig.target;
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

      if ((0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_4__.isLeafNode)(this)) {
        return [this];
      } // Case when state node is compound but no initial state is defined


      if (this.type === 'compound' && !this.initial) {
        if (!_environment_js__WEBPACK_IMPORTED_MODULE_3__.IS_PRODUCTION) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.warn)(false, "Compound state node '".concat(this.id, "' has no initial state."));
        }

        return [this];
      }

      var initialStateNodePaths = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toStatePaths)(this.initialStateValue);
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)(initialStateNodePaths.map(function (initialPath) {
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

    var _a = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(relativePath),
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
      states: (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.mapFilterValues)(this.states, function (stateNode, key) {
        if (!relativeStateValue) {
          return stateNode.historyValue();
        }

        var subStateValue = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(relativeStateValue) ? undefined : relativeStateValue[key];
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
      return historyTarget ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toStatePaths)(historyTarget).map(function (relativeChildPath) {
        return parent.getFromRelativePath(relativeChildPath);
      })) : parent.initialStateNodes;
    }

    var subHistoryValue = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.nestedPath)(parent.path, 'states')(historyValue).current;

    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(subHistoryValue)) {
      return [parent.getStateNode(subHistoryValue)];
    }

    return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toStatePaths)(subHistoryValue).map(function (subStatePath) {
      return _this.history === 'deep' ? parent.getFromRelativePath(subStatePath) : [parent.states[subStatePath[0]]];
    }));
  };

  Object.defineProperty(StateNode.prototype, "stateIds", {
    /**
     * All the state node IDs of this state node and its descendant state nodes.
     */
    get: function () {
      var _this = this;

      var childStateIds = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)(Object.keys(this.states).map(function (stateKey) {
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
          for (var _c = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__values)(Object.keys(states)), _d = _c.next(); !_d.done; _d = _c.next()) {
            var stateId = _d.value;
            var state = states[stateId];

            if (state.states) {
              try {
                for (var _e = (e_9 = void 0, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__values)(state.events)), _f = _e.next(); !_f.done; _f = _e.next()) {
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
      if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(target)) {
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

    var normalizedTarget = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.normalizeTarget)(transitionConfig.target);
    var internal = 'internal' in transitionConfig ? transitionConfig.internal : normalizedTarget ? normalizedTarget.some(function (_target) {
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(_target) && _target[0] === _this.delimiter;
    }) : true;
    var guards = this.machine.options.guards;
    var target = this.resolveTarget(normalizedTarget);

    var transition = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, transitionConfig), {
      actions: (0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.toActionObjects)((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toArray)(transitionConfig.actions)),
      cond: (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toGuard)(transitionConfig.cond, guards),
      target: target,
      source: this,
      internal: internal,
      eventType: transitionConfig.event,
      toJSON: function () {
        return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, transition), {
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
          strictTransitionConfigs_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__rest)(_b, [typeof _c === "symbol" ? _c : _c + ""]);

      onConfig = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)(Object.keys(strictTransitionConfigs_1).map(function (key) {
        if (!_environment_js__WEBPACK_IMPORTED_MODULE_3__.IS_PRODUCTION && key === NULL_EVENT) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.warn)(false, "Empty string transition configs (e.g., `{ on: { '': ... }}`) for transient transitions are deprecated. Specify the transition in the `{ always: ... }` property instead. " + "Please check the `on` configuration for \"#".concat(_this.id, "\"."));
        }

        var transitionConfigArray = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toTransitionConfigArray)(key, strictTransitionConfigs_1[key]);

        if (!_environment_js__WEBPACK_IMPORTED_MODULE_3__.IS_PRODUCTION) {
          validateArrayifiedTransitions(_this, key, transitionConfigArray);
        }

        return transitionConfigArray;
      }).concat((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toTransitionConfigArray)(WILDCARD, wildcardConfigs)));
    }

    var eventlessConfig = this.config.always ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toTransitionConfigArray)('', this.config.always) : [];
    var doneConfig = this.config.onDone ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toTransitionConfigArray)(String((0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.done)(this.id)), this.config.onDone) : [];

    if (!_environment_js__WEBPACK_IMPORTED_MODULE_3__.IS_PRODUCTION) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.warn)(!(this.config.onDone && !this.parent), "Root nodes cannot have an \".onDone\" transition. Please check the config of \"".concat(this.id, "\"."));
    }

    var invokeConfig = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)(this.invoke.map(function (invokeDef) {
      var settleTransitions = [];

      if (invokeDef.onDone) {
        settleTransitions.push.apply(settleTransitions, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toTransitionConfigArray)(String((0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.doneInvoke)(invokeDef.id)), invokeDef.onDone)), false));
      }

      if (invokeDef.onError) {
        settleTransitions.push.apply(settleTransitions, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toTransitionConfigArray)(String((0,_actions_js__WEBPACK_IMPORTED_MODULE_5__.error)(invokeDef.id)), invokeDef.onError)), false));
      }

      return settleTransitions;
    }));
    var delayedTransitions = this.after;
    var formattedTransitions = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(doneConfig), false), (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(invokeConfig), false), (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(onConfig), false), (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(eventlessConfig), false).map(function (transitionConfig) {
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toArray)(transitionConfig).map(function (transition) {
        return _this.formatTransition(transition);
      });
    }));

    try {
      for (var delayedTransitions_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__values)(delayedTransitions), delayedTransitions_1_1 = delayedTransitions_1.next(); !delayedTransitions_1_1.done; delayedTransitions_1_1 = delayedTransitions_1.next()) {
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

/***/ "./node_modules/xstate/es/_virtual/_tslib.js":
/*!***************************************************!*\
  !*** ./node_modules/xstate/es/_virtual/_tslib.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __assign: () => (/* binding */ __assign),
/* harmony export */   __read: () => (/* binding */ __read),
/* harmony export */   __rest: () => (/* binding */ __rest),
/* harmony export */   __spreadArray: () => (/* binding */ __spreadArray),
/* harmony export */   __values: () => (/* binding */ __values)
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

/***/ "./node_modules/xstate/es/actionTypes.js":
/*!***********************************************!*\
  !*** ./node_modules/xstate/es/actionTypes.js ***!
  \***********************************************/
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
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types.js */ "./node_modules/xstate/es/types.js");


var start = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Start;
var stop = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Stop;
var raise = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Raise;
var send = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Send;
var cancel = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Cancel;
var nullEvent = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.NullEvent;
var assign = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Assign;
var after = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.After;
var doneState = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.DoneState;
var log = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Log;
var init = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Init;
var invoke = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Invoke;
var errorExecution = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.ErrorExecution;
var errorPlatform = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.ErrorPlatform;
var error = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.ErrorCustom;
var update = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Update;
var choose = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Choose;
var pure = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Pure;




/***/ }),

/***/ "./node_modules/xstate/es/actions.js":
/*!*******************************************!*\
  !*** ./node_modules/xstate/es/actions.js ***!
  \*******************************************/
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
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "./node_modules/xstate/es/_virtual/_tslib.js");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./types.js */ "./node_modules/xstate/es/types.js");
/* harmony import */ var _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./actionTypes.js */ "./node_modules/xstate/es/actionTypes.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./node_modules/xstate/es/utils.js");
/* harmony import */ var _environment_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./environment.js */ "./node_modules/xstate/es/environment.js");








var initEvent = /*#__PURE__*/(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toSCXMLEvent)({
  type: _actionTypes_js__WEBPACK_IMPORTED_MODULE_0__.init
});
function getActionFunction(actionType, actionFunctionMap) {
  return actionFunctionMap ? actionFunctionMap[actionType] || undefined : undefined;
}
function toActionObject(action, actionFunctionMap) {
  var actionObject;

  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isString)(action) || typeof action === 'number') {
    var exec = getActionFunction(action, actionFunctionMap);

    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(exec)) {
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
  } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(action)) {
    actionObject = {
      // Convert action to string if unnamed
      type: action.name || action.toString(),
      exec: action
    };
  } else {
    var exec = getActionFunction(action.type, actionFunctionMap);

    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(exec)) {
      actionObject = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, action), {
        exec: exec
      });
    } else if (exec) {
      var actionType = exec.type || action.type;
      actionObject = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, exec), action), {
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

  var actions = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isArray)(action) ? action : [action];
  return actions.map(function (subAction) {
    return toActionObject(subAction, actionFunctionMap);
  });
};
function toActivityDefinition(action) {
  var actionObject = toActionObject(action);
  return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({
    id: (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isString)(action) ? action : actionObject.id
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
    event: typeof event === 'function' ? event : (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toEventObject)(event),
    delay: options ? options.delay : undefined,
    id: options === null || options === void 0 ? void 0 : options.id
  };
}
function resolveRaise(action, ctx, _event, delaysMap) {
  var meta = {
    _event: _event
  };
  var resolvedEvent = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toSCXMLEvent)((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(action.event) ? action.event(ctx, _event.data, meta) : action.event);
  var resolvedDelay;

  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isString)(action.delay)) {
    var configDelay = delaysMap && delaysMap[action.delay];
    resolvedDelay = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(configDelay) ? configDelay(ctx, _event.data, meta) : configDelay;
  } else {
    resolvedDelay = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(action.delay) ? action.delay(ctx, _event.data, meta) : action.delay;
  }

  return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, action), {
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
    event: (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(event) ? event : (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toEventObject)(event),
    delay: options ? options.delay : undefined,
    // TODO: don't auto-generate IDs here like that
    // there is too big chance of the ID collision
    id: options && options.id !== undefined ? options.id : (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(event) ? event.name : (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getEventType)(event)
  };
}
function resolveSend(action, ctx, _event, delaysMap) {
  var meta = {
    _event: _event
  }; // TODO: helper function for resolving Expr

  var resolvedEvent = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toSCXMLEvent)((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(action.event) ? action.event(ctx, _event.data, meta) : action.event);
  var resolvedDelay;

  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isString)(action.delay)) {
    var configDelay = delaysMap && delaysMap[action.delay];
    resolvedDelay = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(configDelay) ? configDelay(ctx, _event.data, meta) : configDelay;
  } else {
    resolvedDelay = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(action.delay) ? action.delay(ctx, _event.data, meta) : action.delay;
  }

  var resolvedTarget = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(action.to) ? action.to(ctx, _event.data, meta) : action.to;
  return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, action), {
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
  return send(event, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, options), {
    to: _types_js__WEBPACK_IMPORTED_MODULE_3__.SpecialTargets.Parent
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
  return send(event, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, options), {
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
  return send(event, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, options), {
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
  return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, action), {
    value: (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isString)(action.expr) ? action.expr : action.expr(ctx, _event.data, {
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
    type: _types_js__WEBPACK_IMPORTED_MODULE_3__.ActionTypes.Start,
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
  var activity = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(actorRef) ? actorRef : toActivityDefinition(actorRef);
  return {
    type: _types_js__WEBPACK_IMPORTED_MODULE_3__.ActionTypes.Stop,
    activity: activity,
    exec: undefined
  };
}
function resolveStop(action, context, _event) {
  var actorRefOrString = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(action.activity) ? action.activity(context, _event.data) : action.activity;
  var resolvedActorRef = typeof actorRefOrString === 'string' ? {
    id: actorRefOrString
  } : actorRefOrString;
  var actionObject = {
    type: _types_js__WEBPACK_IMPORTED_MODULE_3__.ActionTypes.Stop,
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
  return "".concat(_types_js__WEBPACK_IMPORTED_MODULE_3__.ActionTypes.After, "(").concat(delayRef, ")").concat(idSuffix);
}
/**
 * Returns an event that represents that a final state node
 * has been reached in the parent state node.
 *
 * @param id The final state node's parent state node `id`
 * @param data The data to pass into the event
 */

function done(id, data) {
  var type = "".concat(_types_js__WEBPACK_IMPORTED_MODULE_3__.ActionTypes.DoneState, ".").concat(id);
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
  var type = "".concat(_types_js__WEBPACK_IMPORTED_MODULE_3__.ActionTypes.DoneInvoke, ".").concat(id);
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
  var type = "".concat(_types_js__WEBPACK_IMPORTED_MODULE_3__.ActionTypes.ErrorPlatform, ".").concat(id);
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
    type: _types_js__WEBPACK_IMPORTED_MODULE_3__.ActionTypes.Pure,
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
  if (!_environment_js__WEBPACK_IMPORTED_MODULE_4__.IS_PRODUCTION && (!target || typeof target === 'function')) {
    var originalTarget_1 = target;

    target = function () {
      var args = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }

      var resolvedTarget = typeof originalTarget_1 === 'function' ? originalTarget_1.apply(void 0, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(args), false)) : originalTarget_1;

      if (!resolvedTarget) {
        throw new Error("Attempted to forward event to undefined actor. This risks an infinite loop in the sender.");
      }

      return resolvedTarget;
    };
  }

  return send(function (_, event) {
    return event;
  }, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, options), {
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
      data: (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(errorData) ? errorData(context, event, meta) : errorData
    };
  }, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, options), {
    to: _types_js__WEBPACK_IMPORTED_MODULE_3__.SpecialTargets.Parent
  }));
}
function choose(conds) {
  return {
    type: _types_js__WEBPACK_IMPORTED_MODULE_3__.ActionTypes.Choose,
    conds: conds
  };
}

var pluckAssigns = function (actionBlocks) {
  var e_1, _a;

  var assignActions = [];

  try {
    for (var actionBlocks_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__values)(actionBlocks), actionBlocks_1_1 = actionBlocks_1.next(); !actionBlocks_1_1.done; actionBlocks_1_1 = actionBlocks_1.next()) {
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
  var updatedContext = assignActions.length ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.updateContext)(currentContext, _event, assignActions, currentState) : currentContext;
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

        if (!_environment_js__WEBPACK_IMPORTED_MODULE_4__.IS_PRODUCTION) {
          var configuredDelay = actionObject.delay; // warn after resolving as we can create better contextual message here

          (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.warn)(!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isString)(configuredDelay) || typeof sendAction.delay === 'number', // tslint:disable-next-line:max-line-length
          "No delay reference for delay expression '".concat(configuredDelay, "' was found on machine '").concat(machine.id, "'"));
        }

        if (predictableExec && sendAction.to !== _types_js__WEBPACK_IMPORTED_MODULE_3__.SpecialTargets.Internal) {
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
            var guard = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toGuard)(condition.cond, machine.options.guards);
            return !guard || (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.evaluateGuard)(machine, guard, updatedContext, _event, !predictableExec ? currentState : undefined);
          })) === null || _a === void 0 ? void 0 : _a.actions;

          if (!matchedActions) {
            return [];
          }

          var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(resolveActions(machine, currentState, updatedContext, _event, [{
            type: blockType,
            actions: toActionObjects((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toArray)(matchedActions), machine.options.actions)
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

          var _c = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(resolveActions(machine, currentState, updatedContext, _event, [{
            type: blockType,
            actions: toActionObjects((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toArray)(matchedActions), machine.options.actions)
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
          updatedContext = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.updateContext)(updatedContext, _event, [actionObject], !predictableExec ? currentState : undefined);
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

          var wrapped = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__assign)({}, resolvedActionObject), {
            exec: function (_ctx) {
              var args = [];

              for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
              }

              exec_1.apply(void 0, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__spreadArray)([preservedContexts[contextIndex_1]], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__read)(args), false));
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
      for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_2__.__values)(block.actions), _c = _b.next(); !_c.done; _c = _b.next()) {
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

  var resolvedActions = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.flatten)(actionBlocks.map(processBlock));
  return [resolvedActions, updatedContext];
}




/***/ }),

/***/ "./node_modules/xstate/es/behaviors.js":
/*!*********************************************!*\
  !*** ./node_modules/xstate/es/behaviors.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fromPromise: () => (/* binding */ fromPromise),
/* harmony export */   fromReducer: () => (/* binding */ fromReducer),
/* harmony export */   spawnBehavior: () => (/* binding */ spawnBehavior)
/* harmony export */ });
/* harmony import */ var _actions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./actions.js */ "./node_modules/xstate/es/actions.js");
/* harmony import */ var _Actor_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Actor.js */ "./node_modules/xstate/es/Actor.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "./node_modules/xstate/es/utils.js");




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
          parent === null || parent === void 0 ? void 0 : parent.send((0,_actions_js__WEBPACK_IMPORTED_MODULE_0__.doneInvoke)(id, event.data));
          return {
            error: undefined,
            data: event.data,
            status: 'fulfilled'
          };

        case 'reject':
          parent === null || parent === void 0 ? void 0 : parent.send((0,_actions_js__WEBPACK_IMPORTED_MODULE_0__.error)(id, event.error));
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

  var actor = (0,_Actor_js__WEBPACK_IMPORTED_MODULE_1__.toActorRef)({
    id: options.id,
    send: function (event) {
      mailbox.push(event);
      flush();
    },
    getSnapshot: function () {
      return state;
    },
    subscribe: function (next, handleError, complete) {
      var observer = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.toObserver)(next, handleError, complete);
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

/***/ "./node_modules/xstate/es/constants.js":
/*!*********************************************!*\
  !*** ./node_modules/xstate/es/constants.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_GUARD_TYPE: () => (/* binding */ DEFAULT_GUARD_TYPE),
/* harmony export */   EMPTY_ACTIVITY_MAP: () => (/* binding */ EMPTY_ACTIVITY_MAP),
/* harmony export */   STATE_DELIMITER: () => (/* binding */ STATE_DELIMITER),
/* harmony export */   TARGETLESS_KEY: () => (/* binding */ TARGETLESS_KEY)
/* harmony export */ });
var STATE_DELIMITER = '.';
var EMPTY_ACTIVITY_MAP = {};
var DEFAULT_GUARD_TYPE = 'xstate.guard';
var TARGETLESS_KEY = '';




/***/ }),

/***/ "./node_modules/xstate/es/devTools.js":
/*!********************************************!*\
  !*** ./node_modules/xstate/es/devTools.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getGlobal: () => (/* binding */ getGlobal),
/* harmony export */   registerService: () => (/* binding */ registerService)
/* harmony export */ });
/* harmony import */ var _environment_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./environment.js */ "./node_modules/xstate/es/environment.js");


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

  if (!_environment_js__WEBPACK_IMPORTED_MODULE_0__.IS_PRODUCTION) {
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




/***/ }),

/***/ "./node_modules/xstate/es/environment.js":
/*!***********************************************!*\
  !*** ./node_modules/xstate/es/environment.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IS_PRODUCTION: () => (/* binding */ IS_PRODUCTION)
/* harmony export */ });
var IS_PRODUCTION = "development" === 'production';




/***/ }),

/***/ "./node_modules/xstate/es/index.js":
/*!*****************************************!*\
  !*** ./node_modules/xstate/es/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ActionTypes: () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_10__.ActionTypes),
/* harmony export */   Interpreter: () => (/* reexport safe */ _interpreter_js__WEBPACK_IMPORTED_MODULE_2__.Interpreter),
/* harmony export */   InterpreterStatus: () => (/* reexport safe */ _interpreter_js__WEBPACK_IMPORTED_MODULE_2__.InterpreterStatus),
/* harmony export */   Machine: () => (/* reexport safe */ _Machine_js__WEBPACK_IMPORTED_MODULE_3__.Machine),
/* harmony export */   SpecialTargets: () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_10__.SpecialTargets),
/* harmony export */   State: () => (/* reexport safe */ _State_js__WEBPACK_IMPORTED_MODULE_7__.State),
/* harmony export */   StateNode: () => (/* reexport safe */ _StateNode_js__WEBPACK_IMPORTED_MODULE_8__.StateNode),
/* harmony export */   actions: () => (/* reexport module object */ _actions_js__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   assign: () => (/* binding */ assign),
/* harmony export */   cancel: () => (/* binding */ cancel),
/* harmony export */   choose: () => (/* binding */ choose),
/* harmony export */   createMachine: () => (/* reexport safe */ _Machine_js__WEBPACK_IMPORTED_MODULE_3__.createMachine),
/* harmony export */   createSchema: () => (/* reexport safe */ _schema_js__WEBPACK_IMPORTED_MODULE_6__.createSchema),
/* harmony export */   doneInvoke: () => (/* binding */ doneInvoke),
/* harmony export */   forwardTo: () => (/* binding */ forwardTo),
/* harmony export */   interpret: () => (/* reexport safe */ _interpreter_js__WEBPACK_IMPORTED_MODULE_2__.interpret),
/* harmony export */   log: () => (/* binding */ log),
/* harmony export */   mapState: () => (/* reexport safe */ _mapState_js__WEBPACK_IMPORTED_MODULE_4__.mapState),
/* harmony export */   matchState: () => (/* reexport safe */ _match_js__WEBPACK_IMPORTED_MODULE_5__.matchState),
/* harmony export */   matchesState: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_11__.matchesState),
/* harmony export */   pure: () => (/* binding */ pure),
/* harmony export */   raise: () => (/* binding */ raise),
/* harmony export */   send: () => (/* binding */ send),
/* harmony export */   sendParent: () => (/* binding */ sendParent),
/* harmony export */   sendTo: () => (/* binding */ sendTo),
/* harmony export */   sendUpdate: () => (/* binding */ sendUpdate),
/* harmony export */   spawn: () => (/* reexport safe */ _interpreter_js__WEBPACK_IMPORTED_MODULE_2__.spawn),
/* harmony export */   spawnBehavior: () => (/* reexport safe */ _behaviors_js__WEBPACK_IMPORTED_MODULE_9__.spawnBehavior),
/* harmony export */   stop: () => (/* binding */ stop),
/* harmony export */   t: () => (/* reexport safe */ _schema_js__WEBPACK_IMPORTED_MODULE_6__.t),
/* harmony export */   toActorRef: () => (/* reexport safe */ _Actor_js__WEBPACK_IMPORTED_MODULE_1__.toActorRef),
/* harmony export */   toEventObject: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_11__.toEventObject),
/* harmony export */   toObserver: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_11__.toObserver),
/* harmony export */   toSCXMLEvent: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_11__.toSCXMLEvent)
/* harmony export */ });
/* harmony import */ var _actions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./actions.js */ "./node_modules/xstate/es/actions.js");
/* harmony import */ var _Actor_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Actor.js */ "./node_modules/xstate/es/Actor.js");
/* harmony import */ var _interpreter_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./interpreter.js */ "./node_modules/xstate/es/interpreter.js");
/* harmony import */ var _Machine_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Machine.js */ "./node_modules/xstate/es/Machine.js");
/* harmony import */ var _mapState_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./mapState.js */ "./node_modules/xstate/es/mapState.js");
/* harmony import */ var _match_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./match.js */ "./node_modules/xstate/es/match.js");
/* harmony import */ var _schema_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./schema.js */ "./node_modules/xstate/es/schema.js");
/* harmony import */ var _State_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./State.js */ "./node_modules/xstate/es/State.js");
/* harmony import */ var _StateNode_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./StateNode.js */ "./node_modules/xstate/es/StateNode.js");
/* harmony import */ var _behaviors_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./behaviors.js */ "./node_modules/xstate/es/behaviors.js");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./types.js */ "./node_modules/xstate/es/types.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./utils.js */ "./node_modules/xstate/es/utils.js");















var assign = _actions_js__WEBPACK_IMPORTED_MODULE_0__.assign,
    cancel = _actions_js__WEBPACK_IMPORTED_MODULE_0__.cancel,
    send = _actions_js__WEBPACK_IMPORTED_MODULE_0__.send,
    sendTo = _actions_js__WEBPACK_IMPORTED_MODULE_0__.sendTo,
    sendParent = _actions_js__WEBPACK_IMPORTED_MODULE_0__.sendParent,
    sendUpdate = _actions_js__WEBPACK_IMPORTED_MODULE_0__.sendUpdate,
    forwardTo = _actions_js__WEBPACK_IMPORTED_MODULE_0__.forwardTo,
    doneInvoke = _actions_js__WEBPACK_IMPORTED_MODULE_0__.doneInvoke,
    raise = _actions_js__WEBPACK_IMPORTED_MODULE_0__.raise,
    log = _actions_js__WEBPACK_IMPORTED_MODULE_0__.log,
    pure = _actions_js__WEBPACK_IMPORTED_MODULE_0__.pure,
    choose = _actions_js__WEBPACK_IMPORTED_MODULE_0__.choose,
    stop = _actions_js__WEBPACK_IMPORTED_MODULE_0__.stop;




/***/ }),

/***/ "./node_modules/xstate/es/interpreter.js":
/*!***********************************************!*\
  !*** ./node_modules/xstate/es/interpreter.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Interpreter: () => (/* binding */ Interpreter),
/* harmony export */   InterpreterStatus: () => (/* binding */ InterpreterStatus),
/* harmony export */   interpret: () => (/* binding */ interpret),
/* harmony export */   spawn: () => (/* binding */ spawn)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "./node_modules/xstate/es/_virtual/_tslib.js");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./types.js */ "./node_modules/xstate/es/types.js");
/* harmony import */ var _State_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./State.js */ "./node_modules/xstate/es/State.js");
/* harmony import */ var _actionTypes_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./actionTypes.js */ "./node_modules/xstate/es/actionTypes.js");
/* harmony import */ var _actions_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./actions.js */ "./node_modules/xstate/es/actions.js");
/* harmony import */ var _environment_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environment.js */ "./node_modules/xstate/es/environment.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./node_modules/xstate/es/utils.js");
/* harmony import */ var _scheduler_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./scheduler.js */ "./node_modules/xstate/es/scheduler.js");
/* harmony import */ var _Actor_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Actor.js */ "./node_modules/xstate/es/Actor.js");
/* harmony import */ var _registry_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./registry.js */ "./node_modules/xstate/es/registry.js");
/* harmony import */ var _devTools_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./devTools.js */ "./node_modules/xstate/es/devTools.js");
/* harmony import */ var _serviceScope_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./serviceScope.js */ "./node_modules/xstate/es/serviceScope.js");
/* harmony import */ var _behaviors_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./behaviors.js */ "./node_modules/xstate/es/behaviors.js");














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
      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isArray)(event)) {
        _this.batch(event);

        return _this.state;
      }

      var _event = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toSCXMLEvent)((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toEventObject)(event, payload));

      if (_this.status === InterpreterStatus.Stopped) {
        // do nothing
        if (!_environment_js__WEBPACK_IMPORTED_MODULE_1__.IS_PRODUCTION) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.warn)(false, "Event \"".concat(_event.name, "\" was sent to stopped service \"").concat(_this.machine.id, "\". This service has already reached its final state, and will not transition.\nEvent: ").concat(JSON.stringify(_event.data)));
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
      var isParent = _this.parent && (to === _types_js__WEBPACK_IMPORTED_MODULE_2__.SpecialTargets.Parent || _this.parent.id === to);
      var target = isParent ? _this.parent : (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(to) ? to === _types_js__WEBPACK_IMPORTED_MODULE_2__.SpecialTargets.Internal ? _this : _this.children.get(to) || _registry_js__WEBPACK_IMPORTED_MODULE_3__.registry.get(to) : (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isActor)(to) ? to : undefined;

      if (!target) {
        if (!isParent) {
          throw new Error("Unable to send event to child '".concat(to, "' from service '").concat(_this.id, "'."));
        } // tslint:disable-next-line:no-console


        if (!_environment_js__WEBPACK_IMPORTED_MODULE_1__.IS_PRODUCTION) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.warn)(false, "Service '".concat(_this.id, "' has no parent: unable to send event ").concat(event.type));
        }

        return;
      }

      if ('machine' in target) {
        // perhaps those events should be rejected in the parent
        // but atm it doesn't have easy access to all of the information that is required to do it reliably
        if (_this.status !== InterpreterStatus.Stopped || _this.parent !== target || // we need to send events to the parent from exit handlers of a machine that reached its final state
        _this.state.done) {
          // Send SCXML events to machines
          var scxmlEvent = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)({}, event), {
            name: event.name === _actionTypes_js__WEBPACK_IMPORTED_MODULE_5__.error ? "".concat((0,_actions_js__WEBPACK_IMPORTED_MODULE_6__.error)(_this.id)) : event.name,
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

      var actionOrExec = action.exec || (0,_actions_js__WEBPACK_IMPORTED_MODULE_6__.getActionFunction)(action.type, actionFunctionMap);
      var exec = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isFunction)(actionOrExec) ? actionOrExec : actionOrExec ? actionOrExec.exec : action.exec;

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
        case _actionTypes_js__WEBPACK_IMPORTED_MODULE_5__.raise:
          {
            // if raise action reached the interpreter then it's a delayed one
            var sendAction_1 = action;

            _this.defer(sendAction_1);

            break;
          }

        case _actionTypes_js__WEBPACK_IMPORTED_MODULE_5__.send:
          var sendAction = action;

          if (typeof sendAction.delay === 'number') {
            _this.defer(sendAction);

            return;
          } else {
            if (sendAction.to) {
              _this.sendTo(sendAction._event, sendAction.to, _event === _actions_js__WEBPACK_IMPORTED_MODULE_6__.initEvent);
            } else {
              _this.send(sendAction._event);
            }
          }

          break;

        case _actionTypes_js__WEBPACK_IMPORTED_MODULE_5__.cancel:
          _this.cancel(action.sendId);

          break;

        case _actionTypes_js__WEBPACK_IMPORTED_MODULE_5__.start:
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


            if (activity.type === _types_js__WEBPACK_IMPORTED_MODULE_2__.ActionTypes.Invoke) {
              var invokeSource = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toInvokeSource)(activity.src);
              var serviceCreator = _this.machine.options.services ? _this.machine.options.services[invokeSource.type] : undefined;
              var id = activity.id,
                  data = activity.data;

              if (!_environment_js__WEBPACK_IMPORTED_MODULE_1__.IS_PRODUCTION) {
                (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.warn)(!('forward' in activity), // tslint:disable-next-line:max-line-length
                "`forward` property is deprecated (found in invocation of '".concat(activity.src, "' in in machine '").concat(_this.machine.id, "'). ") + "Please use `autoForward` instead.");
              }

              var autoForward = 'autoForward' in activity ? activity.autoForward : !!activity.forward;

              if (!serviceCreator) {
                // tslint:disable-next-line:no-console
                if (!_environment_js__WEBPACK_IMPORTED_MODULE_1__.IS_PRODUCTION) {
                  (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.warn)(false, "No service found for invocation '".concat(activity.src, "' in machine '").concat(_this.machine.id, "'."));
                }

                return;
              }

              var resolvedData = data ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.mapContext)(data, context, _event) : undefined;

              if (typeof serviceCreator === 'string') {
                // TODO: warn
                return;
              }

              var source = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isFunction)(serviceCreator) ? serviceCreator(context, _event.data, {
                data: resolvedData,
                src: invokeSource,
                meta: activity.meta
              }) : serviceCreator;

              if (!source) {
                // TODO: warn?
                return;
              }

              var options = void 0;

              if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isMachine)(source)) {
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

        case _actionTypes_js__WEBPACK_IMPORTED_MODULE_5__.stop:
          {
            _this.stopChild(action.activity.id);

            break;
          }

        case _actionTypes_js__WEBPACK_IMPORTED_MODULE_5__.log:
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
          if (!_environment_js__WEBPACK_IMPORTED_MODULE_1__.IS_PRODUCTION) {
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.warn)(false, "No implementation found for action type '".concat(action.type, "'"));
          }

          break;
      }
    };

    var resolvedOptions = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)({}, Interpreter.defaultOptions), options);

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
    this.scheduler = new _scheduler_js__WEBPACK_IMPORTED_MODULE_7__.Scheduler({
      deferEvents: this.options.deferEvents
    });
    this.sessionId = _registry_js__WEBPACK_IMPORTED_MODULE_3__.registry.bookId();
  }

  Object.defineProperty(Interpreter.prototype, "initialState", {
    get: function () {
      var _this = this;

      if (this._initialState) {
        return this._initialState;
      }

      return (0,_serviceScope_js__WEBPACK_IMPORTED_MODULE_8__.provide)(this, function () {
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
      if (!_environment_js__WEBPACK_IMPORTED_MODULE_1__.IS_PRODUCTION) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.warn)(this.status !== InterpreterStatus.NotStarted, "Attempted to read state from uninitialized service '".concat(this.id, "'. Make sure the service is started first."));
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
      for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__values)(state.actions), _c = _b.next(); !_c.done; _c = _b.next()) {
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
    _event === _actions_js__WEBPACK_IMPORTED_MODULE_6__.initEvent) && this.options.execute) {
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
        for (var _e = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__values)(this.eventListeners), _f = _e.next(); !_f.done; _f = _e.next()) {
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
      for (var _g = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__values)(this.listeners), _h = _g.next(); !_h.done; _h = _g.next()) {
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
      for (var _j = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__values)(this.contextListeners), _k = _j.next(); !_k.done; _k = _j.next()) {
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
      var doneData = finalChildStateNode && finalChildStateNode.doneData ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.mapContext)(finalChildStateNode.doneData, state.context, _event) : undefined;
      this._doneEvent = (0,_actions_js__WEBPACK_IMPORTED_MODULE_6__.doneInvoke)(this.id, doneData);

      try {
        for (var _l = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__values)(this.doneListeners), _m = _l.next(); !_m.done; _m = _l.next()) {
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

      _registry_js__WEBPACK_IMPORTED_MODULE_3__.registry.free(this.sessionId);
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

    var observer = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toObserver)(nextListenerOrObserver, _, completeListener);
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

    _registry_js__WEBPACK_IMPORTED_MODULE_3__.registry.register(this.sessionId, this);
    this.initialized = true;
    this.status = InterpreterStatus.Running;
    var resolvedState = initialState === undefined ? this.initialState : (0,_serviceScope_js__WEBPACK_IMPORTED_MODULE_8__.provide)(this, function () {
      return (0,_State_js__WEBPACK_IMPORTED_MODULE_9__.isStateConfig)(initialState) ? _this.machine.resolveState(initialState) : _this.machine.resolveState(_State_js__WEBPACK_IMPORTED_MODULE_9__.State.from(initialState, _this.machine.context));
    });

    if (this.options.devTools) {
      this.attachDev();
    }

    this.scheduler.initialize(function () {
      _this.update(resolvedState, _actions_js__WEBPACK_IMPORTED_MODULE_6__.initEvent);
    });
    return this;
  };

  Interpreter.prototype._stopChildren = function () {
    // TODO: think about converting those to actions
    this.children.forEach(function (child) {
      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isFunction)(child.stop)) {
        child.stop();
      }
    });
    this.children.clear();
  };

  Interpreter.prototype._stop = function () {
    var e_6, _a, e_7, _b, e_8, _c, e_9, _d, e_10, _e;

    try {
      for (var _f = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__values)(this.listeners), _g = _f.next(); !_g.done; _g = _f.next()) {
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
      for (var _h = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__values)(this.stopListeners), _j = _h.next(); !_j.done; _j = _h.next()) {
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
      for (var _k = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__values)(this.contextListeners), _l = _k.next(); !_l.done; _l = _k.next()) {
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
      for (var _m = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__values)(this.doneListeners), _o = _m.next(); !_o.done; _o = _m.next()) {
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
      for (var _p = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__values)(Object.keys(this.delayedEventsMap)), _q = _p.next(); !_q.done; _q = _p.next()) {
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
    this.scheduler = new _scheduler_js__WEBPACK_IMPORTED_MODULE_7__.Scheduler({
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
      var _event = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toSCXMLEvent)({
        type: 'xstate.stop'
      });

      var nextState = (0,_serviceScope_js__WEBPACK_IMPORTED_MODULE_8__.provide)(_this, function () {
        var exitActions = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__read)(_this.state.configuration), false).sort(function (a, b) {
          return b.order - a.order;
        }).map(function (stateNode) {
          return (0,_actions_js__WEBPACK_IMPORTED_MODULE_6__.toActionObjects)(stateNode.onExit, _this.machine.options.actions);
        }));

        var _a = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__read)((0,_actions_js__WEBPACK_IMPORTED_MODULE_6__.resolveActions)(_this.machine, _this.state, _this.state.context, _event, [{
          type: 'exit',
          actions: exitActions
        }], _this.machine.config.predictableActionArguments ? _this._exec : undefined, _this.machine.config.predictableActionArguments || _this.machine.config.preserveActionOrder), 2),
            resolvedActions = _a[0],
            updatedContext = _a[1];

        var newState = new _State_js__WEBPACK_IMPORTED_MODULE_9__.State({
          value: _this.state.value,
          context: updatedContext,
          _event: _event,
          _sessionid: _this.sessionId,
          historyValue: undefined,
          history: _this.state,
          actions: resolvedActions.filter(function (action) {
            return !(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isRaisableAction)(action);
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

      _registry_js__WEBPACK_IMPORTED_MODULE_3__.registry.free(_this.sessionId);
    });
    return this;
  };

  Interpreter.prototype.batch = function (events) {
    var _this = this;

    if (this.status === InterpreterStatus.NotStarted && this.options.deferEvents) {
      // tslint:disable-next-line:no-console
      if (!_environment_js__WEBPACK_IMPORTED_MODULE_1__.IS_PRODUCTION) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.warn)(false, "".concat(events.length, " event(s) were sent to uninitialized service \"").concat(this.machine.id, "\" and are deferred. Make sure .start() is called for this service.\nEvent: ").concat(JSON.stringify(event)));
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
        var _event = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toSCXMLEvent)(event_1);

        _this.forward(_event);

        nextState = (0,_serviceScope_js__WEBPACK_IMPORTED_MODULE_8__.provide)(_this, function () {
          return _this.machine.transition(nextState, _event, undefined, exec || undefined);
        });
        batchedActions.push.apply(batchedActions, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__read)(_this.machine.config.predictableActionArguments ? nextState.actions : nextState.actions.map(function (a) {
          return (0,_State_js__WEBPACK_IMPORTED_MODULE_9__.bindActionToState)(a, nextState);
        })), false));
        batchChanged = batchChanged || !!nextState.changed;
      };

      try {
        for (var events_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__values)(events), events_1_1 = events_1.next(); !events_1_1.done; events_1_1 = events_1.next()) {
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

      _this.update(nextState, (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toSCXMLEvent)(events[events.length - 1]));
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

    var _event = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toSCXMLEvent)(event);

    if (_event.name.indexOf(_actionTypes_js__WEBPACK_IMPORTED_MODULE_5__.errorPlatform) === 0 && !this.state.nextEvents.some(function (nextEvent) {
      return nextEvent.indexOf(_actionTypes_js__WEBPACK_IMPORTED_MODULE_5__.errorPlatform) === 0;
    })) {
      throw _event.data.data;
    }

    var nextState = (0,_serviceScope_js__WEBPACK_IMPORTED_MODULE_8__.provide)(this, function () {
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
      for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__values)(this.forwardTo), _c = _b.next(); !_c.done; _c = _b.next()) {
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

    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isFunction)(child.stop)) {
      child.stop();
    }
  };

  Interpreter.prototype.spawn = function (entity, name, options) {
    if (this.status !== InterpreterStatus.Running) {
      return (0,_Actor_js__WEBPACK_IMPORTED_MODULE_10__.createDeferredActor)(entity, name);
    }

    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isPromiseLike)(entity)) {
      return this.spawnPromise(Promise.resolve(entity), name);
    } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isFunction)(entity)) {
      return this.spawnCallback(entity, name);
    } else if ((0,_Actor_js__WEBPACK_IMPORTED_MODULE_10__.isSpawnedActor)(entity)) {
      return this.spawnActor(entity, name);
    } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isObservable)(entity)) {
      return this.spawnObservable(entity, name);
    } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isMachine)(entity)) {
      return this.spawnMachine(entity, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)({}, options), {
        id: name
      }));
    } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isBehavior)(entity)) {
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

    var childService = new Interpreter(machine, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)({}, this.options), {
      parent: this,
      id: options.id || machine.id
    }));

    var resolvedOptions = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)({}, DEFAULT_SPAWN_OPTIONS), options);

    if (resolvedOptions.sync) {
      childService.onTransition(function (state) {
        _this.send(_actionTypes_js__WEBPACK_IMPORTED_MODULE_5__.update, {
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

      _this.send((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toSCXMLEvent)(doneEvent, {
        origin: childService.id
      }));
    }).start();
    return actor;
  };

  Interpreter.prototype.spawnBehavior = function (behavior, id) {
    var actorRef = (0,_behaviors_js__WEBPACK_IMPORTED_MODULE_11__.spawnBehavior)(behavior, {
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

        _this.send((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toSCXMLEvent)((0,_actions_js__WEBPACK_IMPORTED_MODULE_6__.doneInvoke)(id, response), {
          origin: id
        }));
      }
    }, function (errorData) {
      if (!canceled) {
        _this.removeChild(id);

        var errorEvent = (0,_actions_js__WEBPACK_IMPORTED_MODULE_6__.error)(id, errorData);

        try {
          // Send "error.platform.id" to this (parent).
          _this.send((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toSCXMLEvent)(errorEvent, {
            origin: id
          }));
        } catch (error) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.reportUnhandledExceptionOnInvocation)(errorData, error, id);

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
        var observer = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toObserver)(next, handleError, complete);
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
    }, _a[_utils_js__WEBPACK_IMPORTED_MODULE_0__.symbolObservable] = function () {
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

      _this.send((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toSCXMLEvent)(e, {
        origin: id
      }));
    };

    var callbackStop;

    try {
      callbackStop = callback(receive, function (newListener) {
        receivers.add(newListener);
      });
    } catch (err) {
      this.send((0,_actions_js__WEBPACK_IMPORTED_MODULE_6__.error)(id, err));
    }

    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isPromiseLike)(callbackStop)) {
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
        var observer = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toObserver)(next);
        listeners.add(observer.next);
        return {
          unsubscribe: function () {
            listeners.delete(observer.next);
          }
        };
      },
      stop: function () {
        canceled = true;

        if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isFunction)(callbackStop)) {
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
    }, _a[_utils_js__WEBPACK_IMPORTED_MODULE_0__.symbolObservable] = function () {
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

      _this.send((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toSCXMLEvent)(value, {
        origin: id
      }));
    }, function (err) {
      _this.removeChild(id);

      _this.send((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toSCXMLEvent)((0,_actions_js__WEBPACK_IMPORTED_MODULE_6__.error)(id, err), {
        origin: id
      }));
    }, function () {
      _this.removeChild(id);

      _this.send((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.toSCXMLEvent)((0,_actions_js__WEBPACK_IMPORTED_MODULE_6__.doneInvoke)(id), {
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
    }, _a[_utils_js__WEBPACK_IMPORTED_MODULE_0__.symbolObservable] = function () {
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
      if (!_environment_js__WEBPACK_IMPORTED_MODULE_1__.IS_PRODUCTION) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.warn)(false, "No implementation found for activity '".concat(activity.type, "'"));
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
    }, _a[_utils_js__WEBPACK_IMPORTED_MODULE_0__.symbolObservable] = function () {
      return this;
    }, _a));
  };

  Interpreter.prototype.attachDev = function () {
    var global = (0,_devTools_js__WEBPACK_IMPORTED_MODULE_12__.getGlobal)();

    if (this.options.devTools && global) {
      if (global.__REDUX_DEVTOOLS_EXTENSION__) {
        var devToolsOptions = typeof this.options.devTools === 'object' ? this.options.devTools : undefined;
        this.devTools = global.__REDUX_DEVTOOLS_EXTENSION__.connect((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)({
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
          features: (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)({
            jump: false,
            skip: false
          }, devToolsOptions ? devToolsOptions.features : undefined)
        }), this.machine);
        this.devTools.init(this.state);
      } // add XState-specific dev tooling hook


      (0,_devTools_js__WEBPACK_IMPORTED_MODULE_12__.registerService)(this);
    }
  };

  Interpreter.prototype.toJSON = function () {
    return {
      id: this.id
    };
  };

  Interpreter.prototype[_utils_js__WEBPACK_IMPORTED_MODULE_0__.symbolObservable] = function () {
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
  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isString)(nameOrOptions)) {
    return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)({}, DEFAULT_SPAWN_OPTIONS), {
      name: nameOrOptions
    });
  }

  return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_4__.__assign)({}, DEFAULT_SPAWN_OPTIONS), {
    name: (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.uniqueId)()
  }), nameOrOptions);
};

function spawn(entity, nameOrOptions) {
  var resolvedOptions = resolveSpawnOptions(nameOrOptions);
  return (0,_serviceScope_js__WEBPACK_IMPORTED_MODULE_8__.consume)(function (service) {
    if (!_environment_js__WEBPACK_IMPORTED_MODULE_1__.IS_PRODUCTION) {
      var isLazyEntity = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isMachine)(entity) || (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isFunction)(entity);
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.warn)(!!service || isLazyEntity, "Attempted to spawn an Actor (ID: \"".concat((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isMachine)(entity) ? entity.id : 'undefined', "\") outside of a service. This will have no effect."));
    }

    if (service) {
      return service.spawn(entity, resolvedOptions.name, resolvedOptions);
    } else {
      return (0,_Actor_js__WEBPACK_IMPORTED_MODULE_10__.createDeferredActor)(entity, resolvedOptions.name);
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

/***/ "./node_modules/xstate/es/invokeUtils.js":
/*!***********************************************!*\
  !*** ./node_modules/xstate/es/invokeUtils.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   toInvokeDefinition: () => (/* binding */ toInvokeDefinition),
/* harmony export */   toInvokeSource: () => (/* binding */ toInvokeSource)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "./node_modules/xstate/es/_virtual/_tslib.js");
/* harmony import */ var _actionTypes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./actionTypes.js */ "./node_modules/xstate/es/actionTypes.js");






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
  return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({
    type: _actionTypes_js__WEBPACK_IMPORTED_MODULE_1__.invoke
  }, invokeConfig), {
    toJSON: function () {
      invokeConfig.onDone;
          invokeConfig.onError;
          var invokeDef = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__rest)(invokeConfig, ["onDone", "onError"]);

      return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, invokeDef), {
        type: _actionTypes_js__WEBPACK_IMPORTED_MODULE_1__.invoke,
        src: toInvokeSource(invokeConfig.src)
      });
    }
  });
}




/***/ }),

/***/ "./node_modules/xstate/es/mapState.js":
/*!********************************************!*\
  !*** ./node_modules/xstate/es/mapState.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mapState: () => (/* binding */ mapState)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "./node_modules/xstate/es/_virtual/_tslib.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./node_modules/xstate/es/utils.js");



function mapState(stateMap, stateId) {
  var e_1, _a;

  var foundStateId;

  try {
    for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(Object.keys(stateMap)), _c = _b.next(); !_c.done; _c = _b.next()) {
      var mappedStateId = _c.value;

      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.matchesState)(mappedStateId, stateId) && (!foundStateId || stateId.length > foundStateId.length)) {
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




/***/ }),

/***/ "./node_modules/xstate/es/match.js":
/*!*****************************************!*\
  !*** ./node_modules/xstate/es/match.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   matchState: () => (/* binding */ matchState)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "./node_modules/xstate/es/_virtual/_tslib.js");
/* harmony import */ var _State_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./State.js */ "./node_modules/xstate/es/State.js");



function matchState(state, patterns, defaultValue) {
  var e_1, _a;

  var resolvedState = _State_js__WEBPACK_IMPORTED_MODULE_0__.State.from(state, state instanceof _State_js__WEBPACK_IMPORTED_MODULE_0__.State ? state.context : undefined);

  try {
    for (var patterns_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__values)(patterns), patterns_1_1 = patterns_1.next(); !patterns_1_1.done; patterns_1_1 = patterns_1.next()) {
      var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__read)(patterns_1_1.value, 2),
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




/***/ }),

/***/ "./node_modules/xstate/es/registry.js":
/*!********************************************!*\
  !*** ./node_modules/xstate/es/registry.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   registry: () => (/* binding */ registry)
/* harmony export */ });
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




/***/ }),

/***/ "./node_modules/xstate/es/scheduler.js":
/*!*********************************************!*\
  !*** ./node_modules/xstate/es/scheduler.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Scheduler: () => (/* binding */ Scheduler)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "./node_modules/xstate/es/_virtual/_tslib.js");


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
    this.options = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, defaultOptions), options);
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




/***/ }),

/***/ "./node_modules/xstate/es/schema.js":
/*!******************************************!*\
  !*** ./node_modules/xstate/es/schema.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createSchema: () => (/* binding */ createSchema),
/* harmony export */   t: () => (/* binding */ t)
/* harmony export */ });
function createSchema(schema) {
  return schema;
}
var t = createSchema;




/***/ }),

/***/ "./node_modules/xstate/es/serviceScope.js":
/*!************************************************!*\
  !*** ./node_modules/xstate/es/serviceScope.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   consume: () => (/* binding */ consume),
/* harmony export */   provide: () => (/* binding */ provide)
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

/***/ "./node_modules/xstate/es/stateUtils.js":
/*!**********************************************!*\
  !*** ./node_modules/xstate/es/stateUtils.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getAdjList: () => (/* binding */ getAdjList),
/* harmony export */   getAllChildren: () => (/* binding */ getAllChildren),
/* harmony export */   getAllStateNodes: () => (/* binding */ getAllStateNodes),
/* harmony export */   getChildren: () => (/* binding */ getChildren),
/* harmony export */   getConfiguration: () => (/* binding */ getConfiguration),
/* harmony export */   getMeta: () => (/* binding */ getMeta),
/* harmony export */   getTagsFromConfiguration: () => (/* binding */ getTagsFromConfiguration),
/* harmony export */   getValue: () => (/* binding */ getValue),
/* harmony export */   has: () => (/* binding */ has),
/* harmony export */   isInFinalState: () => (/* binding */ isInFinalState),
/* harmony export */   isLeafNode: () => (/* binding */ isLeafNode),
/* harmony export */   nextEvents: () => (/* binding */ nextEvents)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "./node_modules/xstate/es/_virtual/_tslib.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./node_modules/xstate/es/utils.js");



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

  return stateNodes.concat((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)(getChildren(stateNode).map(getAllStateNodes)));
}
function getConfiguration(prevStateNodes, stateNodes) {
  var e_1, _a, e_2, _b, e_3, _c, e_4, _d;

  var prevConfiguration = new Set(prevStateNodes);
  var prevAdjList = getAdjList(prevConfiguration);
  var configuration = new Set(stateNodes);

  try {
    // add all ancestors
    for (var configuration_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__values)(configuration), configuration_1_1 = configuration_1.next(); !configuration_1_1.done; configuration_1_1 = configuration_1.next()) {
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
    for (var configuration_2 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__values)(configuration), configuration_2_1 = configuration_2.next(); !configuration_2_1.done; configuration_2_1 = configuration_2.next()) {
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
            for (var _e = (e_3 = void 0, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__values)(getChildren(s))), _f = _e.next(); !_f.done; _f = _e.next()) {
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
    for (var configuration_3 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__values)(configuration), configuration_3_1 = configuration_3.next(); !configuration_3_1.done; configuration_3_1 = configuration_3.next()) {
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
    for (var configuration_4 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__values)(configuration), configuration_4_1 = configuration_4.next(); !configuration_4_1.done; configuration_4_1 = configuration_4.next()) {
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
  return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__read)(new Set((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__read)(configuration.map(function (sn) {
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
  return new Set((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.flatten)(configuration.map(function (sn) {
    return sn.tags;
  })));
}




/***/ }),

/***/ "./node_modules/xstate/es/types.js":
/*!*****************************************!*\
  !*** ./node_modules/xstate/es/types.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ActionTypes: () => (/* binding */ ActionTypes),
/* harmony export */   SpecialTargets: () => (/* binding */ SpecialTargets)
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

/***/ "./node_modules/xstate/es/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/xstate/es/utils.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createInvokeId: () => (/* binding */ createInvokeId),
/* harmony export */   evaluateGuard: () => (/* binding */ evaluateGuard),
/* harmony export */   flatten: () => (/* binding */ flatten),
/* harmony export */   getActionType: () => (/* binding */ getActionType),
/* harmony export */   getEventType: () => (/* binding */ getEventType),
/* harmony export */   interopSymbols: () => (/* binding */ interopSymbols),
/* harmony export */   isActor: () => (/* binding */ isActor),
/* harmony export */   isArray: () => (/* binding */ isArray),
/* harmony export */   isBehavior: () => (/* binding */ isBehavior),
/* harmony export */   isBuiltInEvent: () => (/* binding */ isBuiltInEvent),
/* harmony export */   isFunction: () => (/* binding */ isFunction),
/* harmony export */   isMachine: () => (/* binding */ isMachine),
/* harmony export */   isObservable: () => (/* binding */ isObservable),
/* harmony export */   isPromiseLike: () => (/* binding */ isPromiseLike),
/* harmony export */   isRaisableAction: () => (/* binding */ isRaisableAction),
/* harmony export */   isStateLike: () => (/* binding */ isStateLike),
/* harmony export */   isString: () => (/* binding */ isString),
/* harmony export */   keys: () => (/* binding */ keys),
/* harmony export */   mapContext: () => (/* binding */ mapContext),
/* harmony export */   mapFilterValues: () => (/* binding */ mapFilterValues),
/* harmony export */   mapValues: () => (/* binding */ mapValues),
/* harmony export */   matchesState: () => (/* binding */ matchesState),
/* harmony export */   nestedPath: () => (/* binding */ nestedPath),
/* harmony export */   normalizeTarget: () => (/* binding */ normalizeTarget),
/* harmony export */   partition: () => (/* binding */ partition),
/* harmony export */   path: () => (/* binding */ path),
/* harmony export */   pathToStateValue: () => (/* binding */ pathToStateValue),
/* harmony export */   pathsToStateValue: () => (/* binding */ pathsToStateValue),
/* harmony export */   reportUnhandledExceptionOnInvocation: () => (/* binding */ reportUnhandledExceptionOnInvocation),
/* harmony export */   symbolObservable: () => (/* binding */ symbolObservable),
/* harmony export */   toArray: () => (/* binding */ toArray),
/* harmony export */   toArrayStrict: () => (/* binding */ toArrayStrict),
/* harmony export */   toEventObject: () => (/* binding */ toEventObject),
/* harmony export */   toGuard: () => (/* binding */ toGuard),
/* harmony export */   toInvokeSource: () => (/* binding */ toInvokeSource),
/* harmony export */   toObserver: () => (/* binding */ toObserver),
/* harmony export */   toSCXMLEvent: () => (/* binding */ toSCXMLEvent),
/* harmony export */   toStatePath: () => (/* binding */ toStatePath),
/* harmony export */   toStatePaths: () => (/* binding */ toStatePaths),
/* harmony export */   toStateValue: () => (/* binding */ toStateValue),
/* harmony export */   toTransitionConfigArray: () => (/* binding */ toTransitionConfigArray),
/* harmony export */   uniqueId: () => (/* binding */ uniqueId),
/* harmony export */   updateContext: () => (/* binding */ updateContext),
/* harmony export */   updateHistoryStates: () => (/* binding */ updateHistoryStates),
/* harmony export */   updateHistoryValue: () => (/* binding */ updateHistoryValue),
/* harmony export */   warn: () => (/* binding */ warn)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "./node_modules/xstate/es/_virtual/_tslib.js");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./types.js */ "./node_modules/xstate/es/types.js");
/* harmony import */ var _actionTypes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./actionTypes.js */ "./node_modules/xstate/es/actionTypes.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.js */ "./node_modules/xstate/es/constants.js");
/* harmony import */ var _environment_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./environment.js */ "./node_modules/xstate/es/environment.js");






var _a;
function keys(value) {
  return Object.keys(value);
}
function matchesState(parentStateId, childStateId, delimiter) {
  if (delimiter === void 0) {
    delimiter = _constants_js__WEBPACK_IMPORTED_MODULE_0__.STATE_DELIMITER;
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
    for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__values)(Object.keys(collection)), _c = _b.next(); !_c.done; _c = _b.next()) {
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
      for (var props_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__values)(props), props_1_1 = props_1.next(); !props_1_1.done; props_1_1 = props_1.next()) {
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
      for (var props_2 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__values)(props), props_2_1 = props_2.next(); !props_2_1.done; props_2_1 = props_2.next()) {
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
    for (var paths_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__values)(paths), paths_1_1 = paths_1.next(); !paths_1_1.done; paths_1_1 = paths_1.next()) {
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

  return (_a = []).concat.apply(_a, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__read)(array), false));
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
    for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__values)(Object.keys(mapper)), _c = _b.next(); !_c.done; _c = _b.next()) {
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

  var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__read)([[], []], 2),
      truthy = _b[0],
      falsy = _b[1];

  try {
    for (var items_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__values)(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
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
  if (!_environment_js__WEBPACK_IMPORTED_MODULE_2__.IS_PRODUCTION) {
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
        for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__values)(Object.keys(assignment)), _c = _b.next(); !_c.done; _c = _b.next()) {
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

if (!_environment_js__WEBPACK_IMPORTED_MODULE_2__.IS_PRODUCTION) {
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
      type: _constants_js__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_GUARD_TYPE,
      name: condition,
      predicate: guardMap ? guardMap[condition] : undefined
    };
  }

  if (isFunction(condition)) {
    return {
      type: _constants_js__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_GUARD_TYPE,
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
    return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__assign)({
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
  return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__assign)({
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

    return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_1__.__assign)({}, transitionLike), {
      event: event
    });
  });
  return transitions;
}
function normalizeTarget(target) {
  if (target === undefined || target === _constants_js__WEBPACK_IMPORTED_MODULE_0__.TARGETLESS_KEY) {
    return undefined;
  }

  return toArray(target);
}
function reportUnhandledExceptionOnInvocation(originalError, currentError, id) {
  if (!_environment_js__WEBPACK_IMPORTED_MODULE_2__.IS_PRODUCTION) {
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

  if (guard.type === _constants_js__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_GUARD_TYPE) {
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
  return (action.type === _actionTypes_js__WEBPACK_IMPORTED_MODULE_3__.raise || action.type === _actionTypes_js__WEBPACK_IMPORTED_MODULE_3__.send && action.to === _types_js__WEBPACK_IMPORTED_MODULE_4__.SpecialTargets.Internal) && typeof action.delay !== 'number';
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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!****************************!*\
  !*** ./src/AudioModule.js ***!
  \****************************/
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
// import state machines for audio input and output
var _require = __webpack_require__(/*! xstate */ "./node_modules/xstate/es/index.js"),
  interpret = _require.interpret;
var _require2 = __webpack_require__(/*! ./state-machines/AudioInputMachine */ "./src/state-machines/AudioInputMachine.js"),
  audioInputMachine = _require2.audioInputMachine;
var _require3 = __webpack_require__(/*! ./state-machines/AudioOutputMachine */ "./src/state-machines/AudioOutputMachine.js"),
  audioOutputMachine = _require3.audioOutputMachine;

// depends on the injecting script (saypi.index.js) declaring the EventBus as a global variable
var EventBus = window.EventBus;

// audio output (Pi)
var audioElement = document.querySelector("audio");
if (!audioElement) {
  console.error("Audio element not found!");
} else {
  audioElement.preload = "auto"; // enable aggressive preloading of audio
}

function serializeStateValue(stateValue) {
  if (typeof stateValue === "string") {
    return stateValue;
  }
  return Object.keys(stateValue).map(function (key) {
    return "".concat(key, ":").concat(serializeStateValue(stateValue[key]));
  }).join(",");
}
var audioOutputActor = interpret(audioOutputMachine).onTransition(function (state) {
  if (state.changed) {
    var fromState = state.history ? serializeStateValue(state.history.value) : "N/A";
    var toState = serializeStateValue(state.value);
    console.log("Audio Output Machine transitioned from ".concat(fromState, " to ").concat(toState, " with ").concat(state.event.type));
    console.log(state.context);
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
var audioInputActor = interpret(audioInputMachine).start();

/* These events are used to control/pass requests to the audio module from other modules */
function registerAudioCommands() {
  // audio input (recording) commands
  EventBus.on("audio:setupRecording", function (e) {
    audioInputActor.send("acquire");
  });
  EventBus.on("audio:tearDownRecording", function (e) {
    audioInputActor.send("release");
  });
  EventBus.on("audio:startRecording", function (e) {
    // Check if Pi is currently speaking and stop her audio
    audioOutputActor.send("pause");

    // Check if the MediaRecorder is acquired before starting?
    audioInputActor.send(["acquire", "start"]);
  });
  EventBus.on("audio:stopRecording", function (e) {
    audioInputActor.send("stopRequested");
    /* resume or cancel Pi's audio */
    /* TODO: reassess how to handle interruptions
    audioOutputActor.send("play"); // resume Pi's audio
    audioOutputActor.send("stop"); // cancel Pi's audio
    */
  });
  // audio input (recording) events (pass MediaRecorder events -> audio input machine actor)
  EventBus.on("audio:dataavailable", function (detail) {
    audioInputActor.send(_objectSpread({
      type: "dataAvailable"
    }, detail));
  });
  EventBus.on("audio:input:stop", function (e) {
    audioInputActor.send("stop");
  });

  // audio output (playback) commands
  EventBus.on("audio:reload", function (e) {
    audioOutputActor.send("reload");
  });
}
registerAudioCommands();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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TUFBTSxDQUFDO0VBQzlCLENBQUMsQ0FBQzs7RUFFRjtFQUNBOUUsUUFBUSxDQUFDZ0MsRUFBRSxDQUFDLGNBQWMsRUFBRSxVQUFVa0gsQ0FBQyxFQUFFO0lBQ3ZDYixnQkFBZ0IsQ0FBQ3ZELElBQUksQ0FBQyxRQUFRLENBQUM7RUFDakMsQ0FBQyxDQUFDO0FBQ0o7QUFDQW1FLHFCQUFxQixDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL1VzZXJBZ2VudE1vZHVsZS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3N0YXRlLW1hY2hpbmVzL0F1ZGlvSW5wdXRNYWNoaW5lLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvc3RhdGUtbWFjaGluZXMvQXVkaW9PdXRwdXRNYWNoaW5lLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL0FjdG9yLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL01hY2hpbmUuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvU3RhdGUuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvU3RhdGVOb2RlLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL192aXJ0dWFsL190c2xpYi5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9hY3Rpb25UeXBlcy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9hY3Rpb25zLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL2JlaGF2aW9ycy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9jb25zdGFudHMuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvZGV2VG9vbHMuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvZW52aXJvbm1lbnQuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvaW50ZXJwcmV0ZXIuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvaW52b2tlVXRpbHMuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvbWFwU3RhdGUuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvbWF0Y2guanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvcmVnaXN0cnkuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvc2NoZWR1bGVyLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL3NjaGVtYS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9zZXJ2aWNlU2NvcGUuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvc3RhdGVVdGlscy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy90eXBlcy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy91dGlscy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvQXVkaW9Nb2R1bGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGlzU2FmYXJpKCkge1xuICByZXR1cm4gL14oKD8hY2hyb21lfGFuZHJvaWQpLikqc2FmYXJpL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc01vYmlsZURldmljZSgpIHtcbiAgcmV0dXJuIChcbiAgICAvQW5kcm9pZHx3ZWJPU3xpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnl8SUVNb2JpbGV8T3BlcmEgTWluaS9pLnRlc3QoXG4gICAgICBuYXZpZ2F0b3IudXNlckFnZW50XG4gICAgKSB8fCB3aW5kb3cubWF0Y2hNZWRpYShcIihtYXgtd2lkdGg6IDc2OHB4KVwiKS5tYXRjaGVzXG4gICk7XG59XG5cbi8vIFVzZSBsb2NhbFN0b3JhZ2UgdG8gcGVyc2lzdCB1c2VyIHByZWZlcmVuY2VcbmV4cG9ydCBmdW5jdGlvbiBpc01vYmlsZVZpZXcoKSB7XG4gIGNvbnN0IHVzZXJWaWV3UHJlZmVyZW5jZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidXNlclZpZXdQcmVmZXJlbmNlXCIpO1xuXG4gIGlmICh1c2VyVmlld1ByZWZlcmVuY2UpIHtcbiAgICByZXR1cm4gdXNlclZpZXdQcmVmZXJlbmNlID09PSBcIm1vYmlsZVwiO1xuICB9XG5cbiAgcmV0dXJuIGlzTW9iaWxlRGV2aWNlKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleGl0TW9iaWxlTW9kZSgpIHtcbiAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ1c2VyVmlld1ByZWZlcmVuY2VcIiwgXCJkZXNrdG9wXCIpOyAvLyBTYXZlIHByZWZlcmVuY2VcblxuICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJtb2JpbGUtdmlld1wiKTtcbiAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZGVza3RvcC12aWV3XCIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW50ZXJNb2JpbGVNb2RlKCkge1xuICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInVzZXJWaWV3UHJlZmVyZW5jZVwiLCBcIm1vYmlsZVwiKTsgLy8gU2F2ZSBwcmVmZXJlbmNlXG5cbiAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiZGVza3RvcC12aWV3XCIpO1xuICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJtb2JpbGUtdmlld1wiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFVzZXJBZ2VudEZsYWdzKCkge1xuICBjb25zdCBpc0ZpcmVmb3hBbmRyb2lkID1cbiAgICAvRmlyZWZveC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSAmJiAvQW5kcm9pZC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcblxuICBpZiAoaXNGaXJlZm94QW5kcm9pZCkge1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImZpcmVmb3gtYW5kcm9pZFwiKTtcbiAgfVxuXG4gIGFkZERldmljZUZsYWdzKGVsZW1lbnQpO1xuICBhZGRWaWV3RmxhZ3MoZWxlbWVudCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGREZXZpY2VGbGFncyhlbGVtZW50KSB7XG4gIGlmIChpc01vYmlsZURldmljZSgpKSB7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwibW9iaWxlLWRldmljZVwiKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkVmlld0ZsYWdzKGVsZW1lbnQpIHtcbiAgaWYgKGlzTW9iaWxlVmlldygpKSB7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwibW9iaWxlLXZpZXdcIik7XG4gIH0gZWxzZSB7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwibW9iaWxlLXZpZXdcIik7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZGVza3RvcC12aWV3XCIpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBjcmVhdGVNYWNoaW5lIH0gZnJvbSBcInhzdGF0ZVwiO1xuXG5jb25zdCBFdmVudEJ1cyA9IHdpbmRvdy5FdmVudEJ1cztcblxubGV0IGF1ZGlvTWltZVR5cGUgPSBcImF1ZGlvL3dlYm07Y29kZWNzPW9wdXNcIjtcbmNvbnN0IHRocmVzaG9sZCA9IDEwMDA7IC8vIDEwMDAgbXMgPSAxIHNlY29uZCwgYWJvdXQgdGhlIGxlbmd0aCBvZiBcIkhleSwgUGlcIlxuXG4vLyBEZWNsYXJlIGEgZ2xvYmFsIHZhcmlhYmxlIGZvciB0aGUgbWVkaWFSZWNvcmRlclxudmFyIG1lZGlhUmVjb3JkZXI7XG5cbmZ1bmN0aW9uIHNldHVwUmVjb3JkaW5nKGNhbGxiYWNrKSB7XG4gIGlmIChtZWRpYVJlY29yZGVyKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gR2V0IGEgc3RyZWFtIGZyb20gdGhlIHVzZXIncyBtaWNyb3Bob25lXG4gIG5hdmlnYXRvci5tZWRpYURldmljZXNcbiAgICAuZ2V0VXNlck1lZGlhKHsgYXVkaW86IHRydWUgfSlcbiAgICAudGhlbihmdW5jdGlvbiAoc3RyZWFtKSB7XG4gICAgICBpZiAoIU1lZGlhUmVjb3JkZXIuaXNUeXBlU3VwcG9ydGVkKGF1ZGlvTWltZVR5cGUpKSB7XG4gICAgICAgIC8vIHVzZSBNUDQgZm9yIFNhZmFyaVxuICAgICAgICBhdWRpb01pbWVUeXBlID0gXCJhdWRpby9tcDRcIjtcbiAgICAgIH1cbiAgICAgIC8vIENyZWF0ZSBhIG5ldyBNZWRpYVJlY29yZGVyIG9iamVjdCB1c2luZyB0aGUgc3RyZWFtIGFuZCBzcGVjaWZ5aW5nIHRoZSBNSU1FIHR5cGVcbiAgICAgIHZhciBvcHRpb25zID0geyBtaW1lVHlwZTogYXVkaW9NaW1lVHlwZSB9O1xuICAgICAgbWVkaWFSZWNvcmRlciA9IG5ldyBNZWRpYVJlY29yZGVyKHN0cmVhbSwgb3B0aW9ucyk7XG4gICAgICBtZWRpYVJlY29yZGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJkYXRhYXZhaWxhYmxlXCIsIChldmVudCkgPT4ge1xuICAgICAgICBFdmVudEJ1cy5lbWl0KFwiYXVkaW86ZGF0YWF2YWlsYWJsZVwiLCB7XG4gICAgICAgICAgZGF0YTogZXZlbnQuZGF0YSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIG1lZGlhUmVjb3JkZXIuYWRkRXZlbnRMaXN0ZW5lcihcInN0b3BcIiwgKCkgPT4ge1xuICAgICAgICBFdmVudEJ1cy5lbWl0KFwiYXVkaW86aW5wdXQ6c3RvcFwiKTtcbiAgICAgIH0pO1xuICAgIH0pXG4gICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgLy8gSW52b2tlIHRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9XG4gICAgfSlcbiAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIGdldHRpbmcgYXVkaW8gc3RyZWFtOiBcIiArIGVycik7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHRlYXJEb3duUmVjb3JkaW5nKCkge1xuICAvLyBDaGVjayBpZiB0aGUgTWVkaWFSZWNvcmRlciBpcyBzZXQgdXBcbiAgaWYgKCFtZWRpYVJlY29yZGVyKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gU3RvcCBhbnkgb25nb2luZyByZWNvcmRpbmdcbiAgaWYgKG1lZGlhUmVjb3JkZXIuc3RhdGUgPT09IFwicmVjb3JkaW5nXCIpIHtcbiAgICBtZWRpYVJlY29yZGVyLnN0b3AoKTtcbiAgfVxuXG4gIC8vIENsZWFyIHRoZSBNZWRpYVJlY29yZGVyIHZhcmlhYmxlXG4gIG1lZGlhUmVjb3JkZXIgPSBudWxsO1xufVxuXG5leHBvcnQgY29uc3QgYXVkaW9JbnB1dE1hY2hpbmUgPSBjcmVhdGVNYWNoaW5lKFxuICB7XG4gICAgLyoqIEB4c3RhdGUtbGF5b3V0IE40SWdwZ0pnNW1ET0lDNVFFTUN1RUNXQjdBa2dPd0FkVUFYQU9nQ2N3QWJNWldTQVltUUdNQkhWRFNnYlFBWUJkUktBSlpZR1l0anlDUUFEMFFCR0FHd0JtVWdGWUFOQ0FDZWlKWElBY3BCUUhZQW5BdFA2bCtnQ3cybEFKZ1UyQXZpODFwTXVRaVZJdDJuQmg0VUF3UVdIaGdwRUVBYmxnQTFwR2UyUGhFWlA0YzVFRlFDREZZek1qaTRieDh4VkxDb29XU1NES0lxZzZhT2dqNnhuSnFDcW84cXRiS3Bqd09EbTRlNk1rK2FXd1pXUXhnNU9SWTVLUUVWQVVBWm5NQXRuN0QzcWwrNDRIQk9YaXgrWlhGcGRYbFloSlNzZ2h5eGlvYTJvajlxcVQ5N1EtV2RvNEtneUJKYmErZEtjUmlVR2gwTURuSVFpSzdoRzd5QjVxQnFJZlN0RG84SGh5SGo2V3oySnh5ZjZBbExBdmFVQ0JSQ0EwQml3WWpJY2pFYUVnUzZWQkVJR3h5RlNXZXpHSjZOZlRtVWh5VlFLUlNtYkZLWlF0SWxiRWxqQUxraWhnWmh6VERCR25FTEFFQUJLWUhZY0dJa0NaTE91MVZ1SmdVYWlVdlFVRGo1aUhGclJzQW82RG5zRm1NblJsWGpsdXdWa0NWS3ZJYXBDRUFLeUFBZ3RGa0JnbGdBakdqRzJHc3MyMUJ3OE5UNlZTbUpTOGxGTk8ya0d3T2N3OEJRS0hpUzNPRTl3QTJXalAwWkFNRU1CNEVNQVpVMUJBMVdxVEZWTm9GdWNqa09hTWR2enBoc3BpRmpnZWlrclVwclF4OURaQmlwYmJheW5hMW9YRFVaajhjVC1ES3lZSE5RUWs1VVZuVGVuSHp3TGIxTUpZcjVZWDFlOUl4MmE0RHRLMUxZZ0RCOW5DVlNEdklJNHFMYTlvSUo2YnozT1lTak9qWVhUR0tLYmkxbmdXQVFIQVVqRXFNSjc5dkNxWUlBQXRBbytiRVkrcGhVYnlQREZzNFQ2b2JXdUU3T0N0RDBCQStIQVd5eGI1c09OaEdGaXFoZkhpdnhMbldLNWZtU1dTY1Ntb0hzdW1SaUlibVVIOU5PdzZXSDBxaXFOaVZGS0IrUUx5azJIRVhLZWhGeVE0K2dPRVd0aktmbVFrcUhCcjZDZHBTaXFQcHZyZmhTR0JVbUFNbG5yY1NoS0JtU2w1dmU0clRzb0RoemhXVmJTa3g5YVNmNkZLVUVHSVorV1o1NWRKYUpnR0tGalFNYVF1SlJYb01XTHU1cTVrczJyWWRsMjZVZ2VldGpUbFJEaTVWQlQ3R0tRMWpGZk9zVmljeHBKSmFRdjRFUCtkVnNuSUphdEJaRTJlcE9XWk9HMUUya0MwRmI2QW9WaTVtV2FFdUVBQSAqL1xuICAgIGNvbnRleHQ6IHtcbiAgICAgIGF1ZGlvRGF0YUNodW5rczogW10sXG4gICAgfSxcbiAgICBpZDogXCJhdWRpb0lucHV0XCIsXG4gICAgaW5pdGlhbDogXCJyZWxlYXNlZFwiLFxuICAgIHN0YXRlczoge1xuICAgICAgcmVsZWFzZWQ6IHtcbiAgICAgICAgb246IHtcbiAgICAgICAgICBhY3F1aXJlOiB7XG4gICAgICAgICAgICB0YXJnZXQ6IFwiYWNxdWlyaW5nXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBhY3F1aXJpbmc6IHtcbiAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgXCJBY3F1aXJpbmcgdGhlIG1pY3JvcGhvbmUuIFdhaXRzIHVudGlsIGFzeW5jaHJvbm91cyBjYWxsIGhhcyBjb21wbGV0ZWQuXCIsXG4gICAgICAgIGludm9rZToge1xuICAgICAgICAgIHNyYzogXCJhY3F1aXJlTWVkaWFSZWNvcmRlclwiLFxuICAgICAgICAgIG9uRG9uZToge1xuICAgICAgICAgICAgdGFyZ2V0OiBcImFjcXVpcmVkXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBvbkVycm9yOiB7XG4gICAgICAgICAgICB0YXJnZXQ6IFwicmVsZWFzZWRcIixcbiAgICAgICAgICAgIGFjdGlvbnM6IFwibG9nRXJyb3JcIixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGFjcXVpcmVkOiB7XG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIk1pY3JvcGhvbmUgYWNxdWlyZWQgYW5kIHJlYWR5IHRvIHN0YXJ0IHJlY29yZGluZy5cIixcbiAgICAgICAgaW5pdGlhbDogXCJpZGxlXCIsXG4gICAgICAgIHN0YXRlczoge1xuICAgICAgICAgIGlkbGU6IHtcbiAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgIHN0YXJ0OiB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0OiBcInJlY29yZGluZ1wiLFxuICAgICAgICAgICAgICAgIGFjdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6IFwic3RhcnRSZWNvcmRpbmdcIixcbiAgICAgICAgICAgICAgICAgIGNvbmQ6IFwibWVkaWFSZWNvcmRlckFjcXVpcmVkXCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICByZWNvcmRpbmc6IHtcbiAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgIHN0b3BSZXF1ZXN0ZWQ6IHtcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IFwicGVuZGluZ1N0b3BcIixcbiAgICAgICAgICAgICAgICBhY3Rpb25zOiB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiBcInN0b3BSZWNvcmRpbmdcIixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBkYXRhQXZhaWxhYmxlOiB7XG4gICAgICAgICAgICAgICAgYWN0aW9uczoge1xuICAgICAgICAgICAgICAgICAgdHlwZTogXCJhZGREYXRhXCIsXG4gICAgICAgICAgICAgICAgICBwYXJhbXM6IHt9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgaW50ZXJuYWw6IHRydWUsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgcGVuZGluZ1N0b3A6IHtcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIldhaXRpbmcgZm9yIHRoZSBNZWRpYVJlY29yZGVyIHRvIHN0b3AgcmVjb3JkaW5nLlwiLFxuICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgc3RvcDoge1xuICAgICAgICAgICAgICAgIHRhcmdldDogXCJzdG9wcGVkXCIsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGRhdGFBdmFpbGFibGU6IHtcbiAgICAgICAgICAgICAgICBhY3Rpb25zOiB7XG4gICAgICAgICAgICAgICAgICB0eXBlOiBcImFkZERhdGFcIixcbiAgICAgICAgICAgICAgICAgIHBhcmFtczoge30sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBpbnRlcm5hbDogdHJ1ZSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBzdG9wcGVkOiB7XG4gICAgICAgICAgICBlbnRyeToge1xuICAgICAgICAgICAgICB0eXBlOiBcInNlbmREYXRhXCIsXG4gICAgICAgICAgICAgIHBhcmFtczoge30sXG4gICAgICAgICAgICAgIGNvbmQ6IFwiaGFzRGF0YVwiLFxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgYWx3YXlzOiBcImlkbGVcIixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBvbjoge1xuICAgICAgICAgIHJlbGVhc2U6IHtcbiAgICAgICAgICAgIHRhcmdldDogXCJyZWxlYXNlZFwiLFxuICAgICAgICAgICAgYWN0aW9uczoge1xuICAgICAgICAgICAgICB0eXBlOiBcInJlbGVhc2VNZWRpYVJlY29yZGVyXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgcHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHM6IHRydWUsXG4gICAgcHJlc2VydmVBY3Rpb25PcmRlcjogdHJ1ZSxcbiAgfSxcbiAge1xuICAgIGFjdGlvbnM6IHtcbiAgICAgIHN0YXJ0UmVjb3JkaW5nOiAoY29udGV4dCwgZXZlbnQpID0+IHtcbiAgICAgICAgLy8gQ2xlYXIgdGhlIGFycmF5IGZvciB0aGUgbmV4dCByZWNvcmRpbmdcbiAgICAgICAgY29udGV4dC5hdWRpb0RhdGFDaHVua3MgPSBbXTtcbiAgICAgICAgY29udGV4dC5zdGFydFRpbWUgPSBEYXRlLm5vdygpO1xuXG4gICAgICAgIC8vIFN0YXJ0IHJlY29yZGluZ1xuICAgICAgICBtZWRpYVJlY29yZGVyLnN0YXJ0KCk7XG5cbiAgICAgICAgRXZlbnRCdXMuZW1pdChcInNheXBpOnVzZXJTcGVha2luZ1wiKTtcbiAgICAgIH0sXG5cbiAgICAgIHN0b3BSZWNvcmRpbmc6IChjb250ZXh0LCBldmVudCkgPT4ge1xuICAgICAgICAvLyBUT0RPOiBkbyBJIG5lZWQgdGhpcyBzdGF0ZSBjaGVjaz9cbiAgICAgICAgaWYgKG1lZGlhUmVjb3JkZXIgJiYgbWVkaWFSZWNvcmRlci5zdGF0ZSA9PT0gXCJyZWNvcmRpbmdcIikge1xuICAgICAgICAgIC8vIFN0b3AgcmVjb3JkaW5nXG4gICAgICAgICAgbWVkaWFSZWNvcmRlci5zdG9wKCk7XG5cbiAgICAgICAgICAvLyBSZWNvcmQgdGhlIHN0b3AgdGltZSBhbmQgY2FsY3VsYXRlIHRoZSBkdXJhdGlvblxuICAgICAgICAgIHZhciBzdG9wVGltZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgdmFyIGR1cmF0aW9uID0gc3RvcFRpbWUgLSBjb250ZXh0LnN0YXJ0VGltZTtcblxuICAgICAgICAgIEV2ZW50QnVzLmVtaXQoXCJzYXlwaTp1c2VyU3RvcHBlZFNwZWFraW5nXCIsIHsgZHVyYXRpb246IGR1cmF0aW9uIH0pO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICBhZGREYXRhOiAoY29udGV4dCwgZXZlbnQpID0+IHtcbiAgICAgICAgLy8gQWRkIHRoZSBuZXcgZGF0YSB0byB0aGUgYXJyYXlcbiAgICAgICAgY29udGV4dC5hdWRpb0RhdGFDaHVua3MucHVzaChldmVudC5kYXRhKTtcbiAgICAgIH0sXG5cbiAgICAgIHNlbmREYXRhOiAoY29udGV4dCwgZXZlbnQpID0+IHtcbiAgICAgICAgLy8gQ3JlYXRlIGEgQmxvYiBmcm9tIHRoZSBhdWRpbyBkYXRhIGNodW5rc1xuICAgICAgICB2YXIgYXVkaW9CbG9iID0gbmV3IEJsb2IoY29udGV4dC5hdWRpb0RhdGFDaHVua3MsIHtcbiAgICAgICAgICB0eXBlOiBtZWRpYVJlY29yZGVyLm1pbWVUeXBlLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBHZXQgdGhlIHN0b3AgdGltZSBhbmQgY2FsY3VsYXRlIHRoZSBkdXJhdGlvblxuICAgICAgICB2YXIgc3RvcFRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICB2YXIgZHVyYXRpb24gPSBzdG9wVGltZSAtIGNvbnRleHQuc3RhcnRUaW1lO1xuXG4gICAgICAgIC8vIElmIHRoZSBkdXJhdGlvbiBpcyBncmVhdGVyIHRoYW4gdGhlIHRocmVzaG9sZCwgdXBsb2FkIHRoZSBhdWRpbyBmb3IgdHJhbnNjcmlwdGlvblxuICAgICAgICBpZiAoZHVyYXRpb24gPj0gdGhyZXNob2xkKSB7XG4gICAgICAgICAgLy8gVXBsb2FkIHRoZSBhdWRpbyB0byB0aGUgc2VydmVyIGZvciB0cmFuc2NyaXB0aW9uXG4gICAgICAgICAgRXZlbnRCdXMuZW1pdChcInNheXBpOnVzZXJGaW5pc2hlZFNwZWFraW5nXCIsIHtcbiAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgICAgICAgIGJsb2I6IGF1ZGlvQmxvYixcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgIFwiUmVjb3JkaW5nIHdhcyB0b28gc2hvcnQsIG5vdCB1cGxvYWRpbmcgZm9yIHRyYW5zY3JpcHRpb25cIlxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIHJlbGVhc2VNZWRpYVJlY29yZGVyOiAoY29udGV4dCwgZXZlbnQpID0+IHtcbiAgICAgICAgdGVhckRvd25SZWNvcmRpbmcoKTtcbiAgICAgIH0sXG5cbiAgICAgIGxvZ0Vycm9yOiAoY29udGV4dCwgZXZlbnQpID0+IHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIGFjcXVpcmluZyBNZWRpYVJlY29yZGVyOiBcIiwgZXZlbnQuZGF0YSk7XG4gICAgICB9LFxuICAgIH0sXG4gICAgc2VydmljZXM6IHtcbiAgICAgIGFjcXVpcmVNZWRpYVJlY29yZGVyOiAoY29udGV4dCwgZXZlbnQsIHsgc2VuZCB9KSA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgc2V0dXBSZWNvcmRpbmcoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKG1lZGlhUmVjb3JkZXIpIHtcbiAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihcIkZhaWxlZCB0byBhY3F1aXJlIE1lZGlhUmVjb3JkZXJcIikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBndWFyZHM6IHtcbiAgICAgIG1lZGlhUmVjb3JkZXJBY3F1aXJlZDogKGNvbnRleHQsIGV2ZW50KSA9PiB7XG4gICAgICAgIHJldHVybiBtZWRpYVJlY29yZGVyICE9PSBudWxsO1xuICAgICAgfSxcbiAgICAgIGhhc0RhdGE6IChjb250ZXh0LCBldmVudCkgPT4ge1xuICAgICAgICByZXR1cm4gY29udGV4dC5hdWRpb0RhdGFDaHVua3MubGVuZ3RoID4gMDtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBkZWxheXM6IHt9LFxuICB9XG4pO1xuIiwiaW1wb3J0IHsgY3JlYXRlTWFjaGluZSwgYXNzaWduLCByYWlzZSB9IGZyb20gXCJ4c3RhdGVcIjtcbmltcG9ydCB7IGlzU2FmYXJpLCBpc01vYmlsZVZpZXcgfSBmcm9tIFwiLi4vVXNlckFnZW50TW9kdWxlXCI7XG5cbmNvbnN0IEV2ZW50QnVzID0gd2luZG93LkV2ZW50QnVzO1xuXG5jb25zdCBhdWRpb0VsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYXVkaW9cIik7XG5pZiAoIWF1ZGlvRWxlbWVudCkge1xuICBjb25zb2xlLmVycm9yKFwiQXVkaW8gZWxlbWVudCBub3QgZm91bmQgaW4gb3V0cHV0IG1hY2hpbmUhXCIpO1xufVxuXG5leHBvcnQgY29uc3QgYXVkaW9PdXRwdXRNYWNoaW5lID0gY3JlYXRlTWFjaGluZShcbiAge1xuICAgIC8qKiBAeHN0YXRlLWxheW91dCBONElncGdKZzVtRE9JQzVRRU1DdUVDV0I3QThxZ0xnQTRFREVZQXRvZmhwQU5vQU1BdW9xSVZyQnRWZ0hZc2dDZWlBTFFCR0FPd0JXQURRZ0FIb2hFQk9BQ3pLQWRNckVBMkxRQTRBVFBxMGlKVy1RRjl6TXRKbHdGaStOUmdnQWJNQ1JkWmtFV1BtUUFuZkFabUpCQTJEaTVlVVBrRVF3azFhUUZFUlgxRk5Yb00raE1BWm5vSlhSRnNyVXRyZEd3OElnSTFUMjhNYmlnUEx3aEljakEtQ0dRLVlMNXd6bXdvMEJpSmZSbEJCQUtFelBwRkRQRmRiUDFsRXBBYmN2c3FtdWFJTlg4d2IzNFNRaGRrZm03UTNzaStHSkVzclFUc21iTkVzZFRzeWJFREQ3eUNvdVhWdTBxamsya0RVUnhPZFFhaERRc0RBWjFZN0Q2UEN1eVNNOTBVSW4wR0tNeW0rbzBRcW4wYWkwQzArdW0raFdLVmhXWlFCRG1xVFJCWVA0RUxJM0MyY0xDQ011MFJSZHdrRHd4V0swT1B5ZUlRNG5vYW4wRWcrK2krK1VLK1QrTklxZE9CMnlaTElBeHNodUV6OEFBTGZ4WVZCUUEwY2k3OVpFSVJReXRSaWJUVGVoYVBMWmJMek1YRE1UMjNRekIxa2hXLUtuLVZVYkJrYTQ3TStva0MxY3EwOG0yby1ub3pHR1lXNHBJSUI1M1luNlVua29PbFd5aG9IaDBIUXlDSFNPeGlMeHdZS0xMcUlwaVJabWJFWnNiWlpTNk5TRlBOeWdNLVNsRnRhQStuZVJrVmlBa1hhYkd1SWdaeUJSNW50aUc2S1JSdDlPaXpQS1czMmlTemZrRmlUSzR2clVzVDdaZ05tVm1GZ0FEV2RDWVBUalNJVHBqNVlubzJReHowUVJTRW4yLXIwR0l5amlPSWxoVXR3V0ROUEFvUWhoZXI2MXUrOVlJRUlXaGlrSVJpRXFld1lxaGVUaXVHQXlFTHRheWdqSm0yaHZLa0loNkVvTGJkaitaNmptcVRRUXFSM0pvWFJ2cjJpSU53eWtZSmhtR0t2R0hrZUh5SHJvdWpLSGhJNjBtR1Y2Y1hXUzZ4QklhVEpzNjBxaVlTa2hmSHUraEZPNmlnc1FwbDViRHNld1FHTThJb1l1TVFVZW9tbFBHSytoWkVTQ3dnV0JFRmlLWkpiamhabXIxTXBxR3FWb2lpcnFvTW5PcTY3clpHS0N6cUgyK2FCc08xTG5tTzZybHFnTUlRQ0Y5a0tBSlJMaUsyYVlpcm9DWGdlOEtWRG41aEZaVGVXejVkYXVUZXM1Mm1aaElkcTVqVkZKUWVZUUEgKi9cbiAgICBpZDogXCJhdWRpb091dHB1dFwiLFxuICAgIGNvbnRleHQ6IHsgYXV0b3BsYXk6IGZhbHNlLCBhdWRpb0VsZW1lbnQ6IGF1ZGlvRWxlbWVudCB9LFxuICAgIGluaXRpYWw6IFwiaWRsZVwiLFxuXG4gICAgc3RhdGVzOiB7XG4gICAgICBpZGxlOiB7XG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgbG9hZHN0YXJ0OiBcImxvYWRpbmdcIixcbiAgICAgICAgfSxcbiAgICAgIH0sXG5cbiAgICAgIGxvYWRpbmc6IHtcbiAgICAgICAgb246IHtcbiAgICAgICAgICBsb2FkZWRtZXRhZGF0YTogXCJsb2FkZWRcIixcbiAgICAgICAgfSxcbiAgICAgIH0sXG5cbiAgICAgIGxvYWRlZDoge1xuICAgICAgICBpbml0aWFsOiBcInJlYWR5XCIsXG5cbiAgICAgICAgb246IHtcbiAgICAgICAgICBlbXB0aWVkOiBcImlkbGVcIixcbiAgICAgICAgfSxcblxuICAgICAgICBzdGF0ZXM6IHtcbiAgICAgICAgICByZWFkeToge1xuICAgICAgICAgICAgZGVzY3JpcHRpb246IGBBdWRpbyBoYXMgbG9hZGVkIGFuZCBpcyByZWFkeSB0byBzdGFydCBwbGF5aW5nIChmdXJ0aGVyIGJ1ZmZlcmluZyBtYXkgYmUgcmVxdWlyZWQgdG8gcmVhY2ggdGhlIGVuZCkuYCxcbiAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgIHBsYXk6IFwicGxheWluZ1wiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVudHJ5OiB7XG4gICAgICAgICAgICAgIHR5cGU6IFwiZW1pdEV2ZW50XCIsXG4gICAgICAgICAgICAgIHBhcmFtczogeyBldmVudE5hbWU6IFwic2F5cGk6cmVhZHlcIiB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgcGxheWluZzoge1xuICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgcGF1c2U6IFwicGF1c2VkXCIsXG4gICAgICAgICAgICAgIGVuZGVkOiBcImVuZGVkXCIsXG4gICAgICAgICAgICAgIGNhbnBsYXl0aHJvdWdoOiB7IHRhcmdldDogXCJwbGF5aW5nXCIsIGludGVybmFsOiB0cnVlIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYWx3YXlzOiB7XG4gICAgICAgICAgICAgIHRhcmdldDogXCJwYXVzZWRcIixcbiAgICAgICAgICAgICAgY29uZDogXCJpc1NhZmFyaUF1dG9QbGF5XCIsXG4gICAgICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgICAgICBcInJlcXVlc3RQYXVzZVwiLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6IFwiZW1pdEV2ZW50XCIsXG4gICAgICAgICAgICAgICAgICBwYXJhbXM6IHsgZXZlbnROYW1lOiBcInNheXBpOnNhZmFyaUJsb2NrZWRcIiB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZW50cnk6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZW1pdEV2ZW50XCIsXG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7IGV2ZW50TmFtZTogXCJzYXlwaTpwaVNwZWFraW5nXCIgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBleGl0OiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImVtaXRFdmVudFwiLFxuICAgICAgICAgICAgICAgIHBhcmFtczogeyBldmVudE5hbWU6IFwic2F5cGk6cGlTdG9wcGVkU3BlYWtpbmdcIiB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBhc3NpZ24oe1xuICAgICAgICAgICAgICAgIGF1dG9wbGF5OiB0cnVlLFxuICAgICAgICAgICAgICAgIGF1ZGlvRWxlbWVudDogKGNvbnRleHQpID0+IGNvbnRleHQuYXVkaW9FbGVtZW50LFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcblxuICAgICAgICAgIHBhdXNlZDoge1xuICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgcGxheTogXCJwbGF5aW5nXCIsXG4gICAgICAgICAgICAgIHJlbG9hZDoge1xuICAgICAgICAgICAgICAgIHRhcmdldDogXCIjYXVkaW9PdXRwdXQubG9hZGluZ1wiLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBgUmVsb2FkIHRoZSBhdWRpbyBzdHJlYW0gZm9yIFNhZmFyaS4gVGhpcyBpcyB0aGUgb25seSBjb21tYW5kIHRoYXQgZXh0ZXJuYWwgbW9kdWxlcyBjYW4gc2VuZCB0aGUgbWFjaGluZS5gLFxuICAgICAgICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgICAgICAgIGFzc2lnbigoY29udGV4dCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgIGF1dG9wbGF5OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICBhdWRpb0VsZW1lbnQ6IGNvbnRleHQuYXVkaW9FbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICBcInJlbG9hZEF1ZGlvXCIsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBjb25kOiBcImlzU2FmYXJpXCIsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG5cbiAgICAgICAgICBlbmRlZDoge1xuICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgc2Vla2VkOiB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0OiBcIiNhdWRpb091dHB1dC5sb2FkZWQucmVhZHlcIixcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogYEFuIGVuZGVkIHRyYWNrIGlzIHNlZWtlZCBiYWNrIHRvIGVhcmxpZXIgaW4gdGhlIHRyYWNrLmAsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZW50cnk6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZW1pdEV2ZW50XCIsXG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7IGV2ZW50TmFtZTogXCJzYXlwaTpwaUZpbmlzaGVkU3BlYWtpbmdcIiB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIHByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzOiB0cnVlLFxuICAgIHByZXNlcnZlQWN0aW9uT3JkZXI6IHRydWUsXG4gIH0sXG4gIHtcbiAgICBhY3Rpb25zOiB7XG4gICAgICBlbWl0RXZlbnQ6IChjb250ZXh0LCBldmVudCwgeyBhY3Rpb24gfSkgPT4ge1xuICAgICAgICBFdmVudEJ1cy5lbWl0KGFjdGlvbi5wYXJhbXMuZXZlbnROYW1lKTtcbiAgICAgIH0sXG4gICAgICByZXF1ZXN0UGF1c2U6IChjb250ZXh0LCBldmVudCkgPT4ge1xuICAgICAgICBjb250ZXh0LmF1ZGlvRWxlbWVudC5wYXVzZSgpO1xuICAgICAgfSxcbiAgICAgIHNlZWtUb0VuZDogKGNvbnRleHQsIGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGF1ZGlvID0gY29udGV4dC5hdWRpb0VsZW1lbnQ7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBhdWRpby5kdXJhdGlvbiAmJlxuICAgICAgICAgICFhdWRpby5lbmRlZCAmJlxuICAgICAgICAgIGF1ZGlvLmN1cnJlbnRUaW1lIDwgYXVkaW8uZHVyYXRpb25cbiAgICAgICAgKSB7XG4gICAgICAgICAgYXVkaW8uY3VycmVudFRpbWUgPSBhdWRpby5kdXJhdGlvbjsgLy8gc2VlayB0aGUgYXVkaW8gdG8gdGhlIGVuZFxuICAgICAgICAgIGF1ZGlvLnBsYXkoKTsgLy8gdHJpZ2dlciB0aGUgZW5kZWQgZXZlbnRcbiAgICAgICAgfVxuICAgICAgICBFdmVudEJ1cy5lbWl0KFwic2F5cGk6cGlGaW5pc2hlZFNwZWFraW5nXCIpO1xuICAgICAgfSxcbiAgICAgIHJlcXVlc3RSZWxvYWQ6IChjb250ZXh0KSA9PiB7XG4gICAgICAgIGNvbnN0IGF1ZGlvID0gY29udGV4dC5hdWRpb0VsZW1lbnQ7XG4gICAgICAgIGF1ZGlvLmxvYWQoKTtcbiAgICAgICAgYXVkaW8ucGxheSgpO1xuICAgICAgfSxcbiAgICB9LFxuICAgIGd1YXJkczoge1xuICAgICAgaXNTYWZhcmk6IChjb250ZXh0LCBldmVudCkgPT4ge1xuICAgICAgICByZXR1cm4gaXNTYWZhcmkoKTtcbiAgICAgIH0sXG4gICAgICBpc1NhZmFyaU1vYmlsZTogKGNvbnRleHQsIGV2ZW50KSA9PiB7XG4gICAgICAgIHJldHVybiBpc1NhZmFyaSgpICYmIGlzTW9iaWxlVmlldygpO1xuICAgICAgfSxcbiAgICAgIGlzU2FmYXJpQXV0b1BsYXk6IChjb250ZXh0LCBldmVudCkgPT4ge1xuICAgICAgICByZXR1cm4gaXNTYWZhcmkoKSAmJiBjb250ZXh0LmF1dG9wbGF5O1xuICAgICAgfSxcbiAgICB9LFxuICB9XG4pO1xuIiwiaW1wb3J0IHsgX19hc3NpZ24gfSBmcm9tICcuL192aXJ0dWFsL190c2xpYi5qcyc7XG5pbXBvcnQgeyBzeW1ib2xPYnNlcnZhYmxlLCB0b0ludm9rZVNvdXJjZSwgbWFwQ29udGV4dCwgaXNNYWNoaW5lIH0gZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQgeyBwcm92aWRlIH0gZnJvbSAnLi9zZXJ2aWNlU2NvcGUuanMnO1xuXG5mdW5jdGlvbiBjcmVhdGVOdWxsQWN0b3IoaWQpIHtcbiAgdmFyIF9hO1xuXG4gIHJldHVybiBfYSA9IHtcbiAgICBpZDogaWQsXG4gICAgc2VuZDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9LFxuICAgIHN1YnNjcmliZTogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgZ2V0U25hcHNob3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSxcbiAgICB0b0pTT046IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkOiBpZFxuICAgICAgfTtcbiAgICB9XG4gIH0sIF9hW3N5bWJvbE9ic2VydmFibGVdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9LCBfYTtcbn1cbi8qKlxyXG4gKiBDcmVhdGVzIGEgZGVmZXJyZWQgYWN0b3IgdGhhdCBpcyBhYmxlIHRvIGJlIGludm9rZWQgZ2l2ZW4gdGhlIHByb3ZpZGVkXHJcbiAqIGludm9jYXRpb24gaW5mb3JtYXRpb24gaW4gaXRzIGAubWV0YWAgdmFsdWUuXHJcbiAqXHJcbiAqIEBwYXJhbSBpbnZva2VEZWZpbml0aW9uIFRoZSBtZXRhIGluZm9ybWF0aW9uIG5lZWRlZCB0byBpbnZva2UgdGhlIGFjdG9yLlxyXG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlSW52b2NhYmxlQWN0b3IoaW52b2tlRGVmaW5pdGlvbiwgbWFjaGluZSwgY29udGV4dCwgX2V2ZW50KSB7XG4gIHZhciBfYTtcblxuICB2YXIgaW52b2tlU3JjID0gdG9JbnZva2VTb3VyY2UoaW52b2tlRGVmaW5pdGlvbi5zcmMpO1xuICB2YXIgc2VydmljZUNyZWF0b3IgPSAoX2EgPSBtYWNoaW5lID09PSBudWxsIHx8IG1hY2hpbmUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG1hY2hpbmUub3B0aW9ucy5zZXJ2aWNlcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hW2ludm9rZVNyYy50eXBlXTtcbiAgdmFyIHJlc29sdmVkRGF0YSA9IGludm9rZURlZmluaXRpb24uZGF0YSA/IG1hcENvbnRleHQoaW52b2tlRGVmaW5pdGlvbi5kYXRhLCBjb250ZXh0LCBfZXZlbnQpIDogdW5kZWZpbmVkO1xuICB2YXIgdGVtcEFjdG9yID0gc2VydmljZUNyZWF0b3IgPyBjcmVhdGVEZWZlcnJlZEFjdG9yKHNlcnZpY2VDcmVhdG9yLCBpbnZva2VEZWZpbml0aW9uLmlkLCByZXNvbHZlZERhdGEpIDogY3JlYXRlTnVsbEFjdG9yKGludm9rZURlZmluaXRpb24uaWQpOyAvLyBAdHMtaWdub3JlXG5cbiAgdGVtcEFjdG9yLm1ldGEgPSBpbnZva2VEZWZpbml0aW9uO1xuICByZXR1cm4gdGVtcEFjdG9yO1xufVxuZnVuY3Rpb24gY3JlYXRlRGVmZXJyZWRBY3RvcihlbnRpdHksIGlkLCBkYXRhKSB7XG4gIHZhciB0ZW1wQWN0b3IgPSBjcmVhdGVOdWxsQWN0b3IoaWQpOyAvLyBAdHMtaWdub3JlXG5cbiAgdGVtcEFjdG9yLmRlZmVycmVkID0gdHJ1ZTtcblxuICBpZiAoaXNNYWNoaW5lKGVudGl0eSkpIHtcbiAgICAvLyBcIm11dGVcIiB0aGUgZXhpc3Rpbmcgc2VydmljZSBzY29wZSBzbyBwb3RlbnRpYWwgc3Bhd25lZCBhY3RvcnMgd2l0aGluIHRoZSBgLmluaXRpYWxTdGF0ZWAgc3RheSBkZWZlcnJlZCBoZXJlXG4gICAgdmFyIGluaXRpYWxTdGF0ZV8xID0gdGVtcEFjdG9yLnN0YXRlID0gcHJvdmlkZSh1bmRlZmluZWQsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAoZGF0YSA/IGVudGl0eS53aXRoQ29udGV4dChkYXRhKSA6IGVudGl0eSkuaW5pdGlhbFN0YXRlO1xuICAgIH0pO1xuXG4gICAgdGVtcEFjdG9yLmdldFNuYXBzaG90ID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGluaXRpYWxTdGF0ZV8xO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gdGVtcEFjdG9yO1xufVxuZnVuY3Rpb24gaXNBY3RvcihpdGVtKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHR5cGVvZiBpdGVtLnNlbmQgPT09ICdmdW5jdGlvbic7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbmZ1bmN0aW9uIGlzU3Bhd25lZEFjdG9yKGl0ZW0pIHtcbiAgcmV0dXJuIGlzQWN0b3IoaXRlbSkgJiYgJ2lkJyBpbiBpdGVtO1xufSAvLyBUT0RPOiByZWZhY3RvciB0aGUgcmV0dXJuIHR5cGUsIHRoaXMgY291bGQgYmUgd3JpdHRlbiBpbiBhIGJldHRlciB3YXkgYnV0IGl0J3MgYmVzdCB0byBhdm9pZCB1bm5lY2Nlc3NhcnkgYnJlYWtpbmcgY2hhbmdlcyBub3dcblxuZnVuY3Rpb24gdG9BY3RvclJlZihhY3RvclJlZkxpa2UpIHtcbiAgdmFyIF9hO1xuXG4gIHJldHVybiBfX2Fzc2lnbigoX2EgPSB7XG4gICAgc3Vic2NyaWJlOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBpZDogJ2Fub255bW91cycsXG4gICAgZ2V0U25hcHNob3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICB9LCBfYVtzeW1ib2xPYnNlcnZhYmxlXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfSwgX2EpLCBhY3RvclJlZkxpa2UpO1xufVxuXG5leHBvcnQgeyBjcmVhdGVEZWZlcnJlZEFjdG9yLCBjcmVhdGVJbnZvY2FibGVBY3RvciwgY3JlYXRlTnVsbEFjdG9yLCBpc0FjdG9yLCBpc1NwYXduZWRBY3RvciwgdG9BY3RvclJlZiB9O1xuIiwiaW1wb3J0IHsgU3RhdGVOb2RlIH0gZnJvbSAnLi9TdGF0ZU5vZGUuanMnO1xuaW1wb3J0IHsgSVNfUFJPRFVDVElPTiB9IGZyb20gJy4vZW52aXJvbm1lbnQuanMnO1xuXG52YXIgd2FybmVkID0gZmFsc2U7XG5mdW5jdGlvbiBNYWNoaW5lKGNvbmZpZywgb3B0aW9ucywgaW5pdGlhbENvbnRleHQpIHtcbiAgaWYgKGluaXRpYWxDb250ZXh0ID09PSB2b2lkIDApIHtcbiAgICBpbml0aWFsQ29udGV4dCA9IGNvbmZpZy5jb250ZXh0O1xuICB9XG5cbiAgcmV0dXJuIG5ldyBTdGF0ZU5vZGUoY29uZmlnLCBvcHRpb25zLCBpbml0aWFsQ29udGV4dCk7XG59XG5mdW5jdGlvbiBjcmVhdGVNYWNoaW5lKGNvbmZpZywgb3B0aW9ucykge1xuICBpZiAoIUlTX1BST0RVQ1RJT04gJiYgISgncHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHMnIGluIGNvbmZpZykgJiYgIXdhcm5lZCkge1xuICAgIHdhcm5lZCA9IHRydWU7XG4gICAgY29uc29sZS53YXJuKCdJdCBpcyBoaWdobHkgcmVjb21tZW5kZWQgdG8gc2V0IGBwcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50c2AgdG8gYHRydWVgIHdoZW4gdXNpbmcgYGNyZWF0ZU1hY2hpbmVgLiBodHRwczovL3hzdGF0ZS5qcy5vcmcvZG9jcy9ndWlkZXMvYWN0aW9ucy5odG1sJyk7XG4gIH1cblxuICByZXR1cm4gbmV3IFN0YXRlTm9kZShjb25maWcsIG9wdGlvbnMpO1xufVxuXG5leHBvcnQgeyBNYWNoaW5lLCBjcmVhdGVNYWNoaW5lIH07XG4iLCJpbXBvcnQgeyBfX2Fzc2lnbiwgX19zcHJlYWRBcnJheSwgX19yZWFkLCBfX3Jlc3QgfSBmcm9tICcuL192aXJ0dWFsL190c2xpYi5qcyc7XG5pbXBvcnQgeyBFTVBUWV9BQ1RJVklUWV9NQVAgfSBmcm9tICcuL2NvbnN0YW50cy5qcyc7XG5pbXBvcnQgeyBpc1N0cmluZywgbWF0Y2hlc1N0YXRlLCB3YXJuIH0gZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQgeyBnZXRNZXRhLCBuZXh0RXZlbnRzIH0gZnJvbSAnLi9zdGF0ZVV0aWxzLmpzJztcbmltcG9ydCB7IGluaXRFdmVudCB9IGZyb20gJy4vYWN0aW9ucy5qcyc7XG5pbXBvcnQgeyBJU19QUk9EVUNUSU9OIH0gZnJvbSAnLi9lbnZpcm9ubWVudC5qcyc7XG5cbmZ1bmN0aW9uIHN0YXRlVmFsdWVzRXF1YWwoYSwgYikge1xuICBpZiAoYSA9PT0gYikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKGEgPT09IHVuZGVmaW5lZCB8fCBiID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoaXNTdHJpbmcoYSkgfHwgaXNTdHJpbmcoYikpIHtcbiAgICByZXR1cm4gYSA9PT0gYjtcbiAgfVxuXG4gIHZhciBhS2V5cyA9IE9iamVjdC5rZXlzKGEpO1xuICB2YXIgYktleXMgPSBPYmplY3Qua2V5cyhiKTtcbiAgcmV0dXJuIGFLZXlzLmxlbmd0aCA9PT0gYktleXMubGVuZ3RoICYmIGFLZXlzLmV2ZXJ5KGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gc3RhdGVWYWx1ZXNFcXVhbChhW2tleV0sIGJba2V5XSk7XG4gIH0pO1xufVxuZnVuY3Rpb24gaXNTdGF0ZUNvbmZpZyhzdGF0ZSkge1xuICBpZiAodHlwZW9mIHN0YXRlICE9PSAnb2JqZWN0JyB8fCBzdGF0ZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiAndmFsdWUnIGluIHN0YXRlICYmICdfZXZlbnQnIGluIHN0YXRlO1xufVxuLyoqXHJcbiAqIEBkZXByZWNhdGVkIFVzZSBgaXNTdGF0ZUNvbmZpZyhvYmplY3QpYCBvciBgc3RhdGUgaW5zdGFuY2VvZiBTdGF0ZWAgaW5zdGVhZC5cclxuICovXG5cbnZhciBpc1N0YXRlID0gaXNTdGF0ZUNvbmZpZztcbmZ1bmN0aW9uIGJpbmRBY3Rpb25Ub1N0YXRlKGFjdGlvbiwgc3RhdGUpIHtcbiAgdmFyIGV4ZWMgPSBhY3Rpb24uZXhlYztcblxuICB2YXIgYm91bmRBY3Rpb24gPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgYWN0aW9uKSwge1xuICAgIGV4ZWM6IGV4ZWMgIT09IHVuZGVmaW5lZCA/IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBleGVjKHN0YXRlLmNvbnRleHQsIHN0YXRlLmV2ZW50LCB7XG4gICAgICAgIGFjdGlvbjogYWN0aW9uLFxuICAgICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICAgIF9ldmVudDogc3RhdGUuX2V2ZW50XG4gICAgICB9KTtcbiAgICB9IDogdW5kZWZpbmVkXG4gIH0pO1xuXG4gIHJldHVybiBib3VuZEFjdGlvbjtcbn1cblxudmFyIFN0YXRlID1cbi8qI19fUFVSRV9fKi9cblxuLyoqIEBjbGFzcyAqL1xuZnVuY3Rpb24gKCkge1xuICAvKipcclxuICAgKiBDcmVhdGVzIGEgbmV3IFN0YXRlIGluc3RhbmNlLlxyXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgc3RhdGUgdmFsdWVcclxuICAgKiBAcGFyYW0gY29udGV4dCBUaGUgZXh0ZW5kZWQgc3RhdGVcclxuICAgKiBAcGFyYW0gaGlzdG9yeVZhbHVlIFRoZSB0cmVlIHJlcHJlc2VudGluZyBoaXN0b3JpY2FsIHZhbHVlcyBvZiB0aGUgc3RhdGUgbm9kZXNcclxuICAgKiBAcGFyYW0gaGlzdG9yeSBUaGUgcHJldmlvdXMgc3RhdGVcclxuICAgKiBAcGFyYW0gYWN0aW9ucyBBbiBhcnJheSBvZiBhY3Rpb24gb2JqZWN0cyB0byBleGVjdXRlIGFzIHNpZGUtZWZmZWN0c1xyXG4gICAqIEBwYXJhbSBhY3Rpdml0aWVzIEEgbWFwcGluZyBvZiBhY3Rpdml0aWVzIGFuZCB3aGV0aGVyIHRoZXkgYXJlIHN0YXJ0ZWQgKGB0cnVlYCkgb3Igc3RvcHBlZCAoYGZhbHNlYCkuXHJcbiAgICogQHBhcmFtIG1ldGFcclxuICAgKiBAcGFyYW0gZXZlbnRzIEludGVybmFsIGV2ZW50IHF1ZXVlLiBTaG91bGQgYmUgZW1wdHkgd2l0aCBydW4tdG8tY29tcGxldGlvbiBzZW1hbnRpY3MuXHJcbiAgICogQHBhcmFtIGNvbmZpZ3VyYXRpb25cclxuICAgKi9cbiAgZnVuY3Rpb24gU3RhdGUoY29uZmlnKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBfYTtcblxuICAgIHRoaXMuYWN0aW9ucyA9IFtdO1xuICAgIHRoaXMuYWN0aXZpdGllcyA9IEVNUFRZX0FDVElWSVRZX01BUDtcbiAgICB0aGlzLm1ldGEgPSB7fTtcbiAgICB0aGlzLmV2ZW50cyA9IFtdO1xuICAgIHRoaXMudmFsdWUgPSBjb25maWcudmFsdWU7XG4gICAgdGhpcy5jb250ZXh0ID0gY29uZmlnLmNvbnRleHQ7XG4gICAgdGhpcy5fZXZlbnQgPSBjb25maWcuX2V2ZW50O1xuICAgIHRoaXMuX3Nlc3Npb25pZCA9IGNvbmZpZy5fc2Vzc2lvbmlkO1xuICAgIHRoaXMuZXZlbnQgPSB0aGlzLl9ldmVudC5kYXRhO1xuICAgIHRoaXMuaGlzdG9yeVZhbHVlID0gY29uZmlnLmhpc3RvcnlWYWx1ZTtcbiAgICB0aGlzLmhpc3RvcnkgPSBjb25maWcuaGlzdG9yeTtcbiAgICB0aGlzLmFjdGlvbnMgPSBjb25maWcuYWN0aW9ucyB8fCBbXTtcbiAgICB0aGlzLmFjdGl2aXRpZXMgPSBjb25maWcuYWN0aXZpdGllcyB8fCBFTVBUWV9BQ1RJVklUWV9NQVA7XG4gICAgdGhpcy5tZXRhID0gZ2V0TWV0YShjb25maWcuY29uZmlndXJhdGlvbik7XG4gICAgdGhpcy5ldmVudHMgPSBjb25maWcuZXZlbnRzIHx8IFtdO1xuICAgIHRoaXMubWF0Y2hlcyA9IHRoaXMubWF0Y2hlcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMudG9TdHJpbmdzID0gdGhpcy50b1N0cmluZ3MuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNvbmZpZ3VyYXRpb24gPSBjb25maWcuY29uZmlndXJhdGlvbjtcbiAgICB0aGlzLnRyYW5zaXRpb25zID0gY29uZmlnLnRyYW5zaXRpb25zO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBjb25maWcuY2hpbGRyZW47XG4gICAgdGhpcy5kb25lID0gISFjb25maWcuZG9uZTtcbiAgICB0aGlzLnRhZ3MgPSAoX2EgPSBBcnJheS5pc0FycmF5KGNvbmZpZy50YWdzKSA/IG5ldyBTZXQoY29uZmlnLnRhZ3MpIDogY29uZmlnLnRhZ3MpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IG5ldyBTZXQoKTtcbiAgICB0aGlzLm1hY2hpbmUgPSBjb25maWcubWFjaGluZTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ25leHRFdmVudHMnLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5leHRFdmVudHMoX3RoaXMuY29uZmlndXJhdGlvbik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhIG5ldyBTdGF0ZSBpbnN0YW5jZSBmb3IgdGhlIGdpdmVuIGBzdGF0ZVZhbHVlYCBhbmQgYGNvbnRleHRgLlxyXG4gICAqIEBwYXJhbSBzdGF0ZVZhbHVlXHJcbiAgICogQHBhcmFtIGNvbnRleHRcclxuICAgKi9cblxuXG4gIFN0YXRlLmZyb20gPSBmdW5jdGlvbiAoc3RhdGVWYWx1ZSwgY29udGV4dCkge1xuICAgIGlmIChzdGF0ZVZhbHVlIGluc3RhbmNlb2YgU3RhdGUpIHtcbiAgICAgIGlmIChzdGF0ZVZhbHVlLmNvbnRleHQgIT09IGNvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTdGF0ZSh7XG4gICAgICAgICAgdmFsdWU6IHN0YXRlVmFsdWUudmFsdWUsXG4gICAgICAgICAgY29udGV4dDogY29udGV4dCxcbiAgICAgICAgICBfZXZlbnQ6IHN0YXRlVmFsdWUuX2V2ZW50LFxuICAgICAgICAgIF9zZXNzaW9uaWQ6IG51bGwsXG4gICAgICAgICAgaGlzdG9yeVZhbHVlOiBzdGF0ZVZhbHVlLmhpc3RvcnlWYWx1ZSxcbiAgICAgICAgICBoaXN0b3J5OiBzdGF0ZVZhbHVlLmhpc3RvcnksXG4gICAgICAgICAgYWN0aW9uczogW10sXG4gICAgICAgICAgYWN0aXZpdGllczogc3RhdGVWYWx1ZS5hY3Rpdml0aWVzLFxuICAgICAgICAgIG1ldGE6IHt9LFxuICAgICAgICAgIGV2ZW50czogW10sXG4gICAgICAgICAgY29uZmlndXJhdGlvbjogW10sXG4gICAgICAgICAgdHJhbnNpdGlvbnM6IFtdLFxuICAgICAgICAgIGNoaWxkcmVuOiB7fVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0YXRlVmFsdWU7XG4gICAgfVxuXG4gICAgdmFyIF9ldmVudCA9IGluaXRFdmVudDtcbiAgICByZXR1cm4gbmV3IFN0YXRlKHtcbiAgICAgIHZhbHVlOiBzdGF0ZVZhbHVlLFxuICAgICAgY29udGV4dDogY29udGV4dCxcbiAgICAgIF9ldmVudDogX2V2ZW50LFxuICAgICAgX3Nlc3Npb25pZDogbnVsbCxcbiAgICAgIGhpc3RvcnlWYWx1ZTogdW5kZWZpbmVkLFxuICAgICAgaGlzdG9yeTogdW5kZWZpbmVkLFxuICAgICAgYWN0aW9uczogW10sXG4gICAgICBhY3Rpdml0aWVzOiB1bmRlZmluZWQsXG4gICAgICBtZXRhOiB1bmRlZmluZWQsXG4gICAgICBldmVudHM6IFtdLFxuICAgICAgY29uZmlndXJhdGlvbjogW10sXG4gICAgICB0cmFuc2l0aW9uczogW10sXG4gICAgICBjaGlsZHJlbjoge31cbiAgICB9KTtcbiAgfTtcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhIG5ldyBTdGF0ZSBpbnN0YW5jZSBmb3IgdGhlIGdpdmVuIGBjb25maWdgLlxyXG4gICAqIEBwYXJhbSBjb25maWcgVGhlIHN0YXRlIGNvbmZpZ1xyXG4gICAqL1xuXG5cbiAgU3RhdGUuY3JlYXRlID0gZnVuY3Rpb24gKGNvbmZpZykge1xuICAgIHJldHVybiBuZXcgU3RhdGUoY29uZmlnKTtcbiAgfTtcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhIG5ldyBgU3RhdGVgIGluc3RhbmNlIGZvciB0aGUgZ2l2ZW4gYHN0YXRlVmFsdWVgIGFuZCBgY29udGV4dGAgd2l0aCBubyBhY3Rpb25zIChzaWRlLWVmZmVjdHMpLlxyXG4gICAqIEBwYXJhbSBzdGF0ZVZhbHVlXHJcbiAgICogQHBhcmFtIGNvbnRleHRcclxuICAgKi9cblxuXG4gIFN0YXRlLmluZXJ0ID0gZnVuY3Rpb24gKHN0YXRlVmFsdWUsIGNvbnRleHQpIHtcbiAgICBpZiAoc3RhdGVWYWx1ZSBpbnN0YW5jZW9mIFN0YXRlKSB7XG4gICAgICBpZiAoIXN0YXRlVmFsdWUuYWN0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlVmFsdWU7XG4gICAgICB9XG5cbiAgICAgIHZhciBfZXZlbnQgPSBpbml0RXZlbnQ7XG4gICAgICByZXR1cm4gbmV3IFN0YXRlKHtcbiAgICAgICAgdmFsdWU6IHN0YXRlVmFsdWUudmFsdWUsXG4gICAgICAgIGNvbnRleHQ6IGNvbnRleHQsXG4gICAgICAgIF9ldmVudDogX2V2ZW50LFxuICAgICAgICBfc2Vzc2lvbmlkOiBudWxsLFxuICAgICAgICBoaXN0b3J5VmFsdWU6IHN0YXRlVmFsdWUuaGlzdG9yeVZhbHVlLFxuICAgICAgICBoaXN0b3J5OiBzdGF0ZVZhbHVlLmhpc3RvcnksXG4gICAgICAgIGFjdGl2aXRpZXM6IHN0YXRlVmFsdWUuYWN0aXZpdGllcyxcbiAgICAgICAgY29uZmlndXJhdGlvbjogc3RhdGVWYWx1ZS5jb25maWd1cmF0aW9uLFxuICAgICAgICB0cmFuc2l0aW9uczogW10sXG4gICAgICAgIGNoaWxkcmVuOiB7fVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFN0YXRlLmZyb20oc3RhdGVWYWx1ZSwgY29udGV4dCk7XG4gIH07XG4gIC8qKlxyXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2YgYWxsIHRoZSBzdHJpbmcgbGVhZiBzdGF0ZSBub2RlIHBhdGhzLlxyXG4gICAqIEBwYXJhbSBzdGF0ZVZhbHVlXHJcbiAgICogQHBhcmFtIGRlbGltaXRlciBUaGUgY2hhcmFjdGVyKHMpIHRoYXQgc2VwYXJhdGUgZWFjaCBzdWJwYXRoIGluIHRoZSBzdHJpbmcgc3RhdGUgbm9kZSBwYXRoLlxyXG4gICAqL1xuXG5cbiAgU3RhdGUucHJvdG90eXBlLnRvU3RyaW5ncyA9IGZ1bmN0aW9uIChzdGF0ZVZhbHVlLCBkZWxpbWl0ZXIpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKHN0YXRlVmFsdWUgPT09IHZvaWQgMCkge1xuICAgICAgc3RhdGVWYWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKGRlbGltaXRlciA9PT0gdm9pZCAwKSB7XG4gICAgICBkZWxpbWl0ZXIgPSAnLic7XG4gICAgfVxuXG4gICAgaWYgKGlzU3RyaW5nKHN0YXRlVmFsdWUpKSB7XG4gICAgICByZXR1cm4gW3N0YXRlVmFsdWVdO1xuICAgIH1cblxuICAgIHZhciB2YWx1ZUtleXMgPSBPYmplY3Qua2V5cyhzdGF0ZVZhbHVlKTtcbiAgICByZXR1cm4gdmFsdWVLZXlzLmNvbmNhdC5hcHBseSh2YWx1ZUtleXMsIF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZCh2YWx1ZUtleXMubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHJldHVybiBfdGhpcy50b1N0cmluZ3Moc3RhdGVWYWx1ZVtrZXldLCBkZWxpbWl0ZXIpLm1hcChmdW5jdGlvbiAocykge1xuICAgICAgICByZXR1cm4ga2V5ICsgZGVsaW1pdGVyICsgcztcbiAgICAgIH0pO1xuICAgIH0pKSwgZmFsc2UpKTtcbiAgfTtcblxuICBTdGF0ZS5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSA9IHRoaXM7XG4gICAgICAgIF9hLmNvbmZpZ3VyYXRpb247XG4gICAgICAgIF9hLnRyYW5zaXRpb25zO1xuICAgICAgICB2YXIgdGFncyA9IF9hLnRhZ3M7XG4gICAgICAgIF9hLm1hY2hpbmU7XG4gICAgICAgIHZhciBqc29uVmFsdWVzID0gX19yZXN0KF9hLCBbXCJjb25maWd1cmF0aW9uXCIsIFwidHJhbnNpdGlvbnNcIiwgXCJ0YWdzXCIsIFwibWFjaGluZVwiXSk7XG5cbiAgICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIGpzb25WYWx1ZXMpLCB7XG4gICAgICB0YWdzOiBBcnJheS5mcm9tKHRhZ3MpXG4gICAgfSk7XG4gIH07XG5cbiAgU3RhdGUucHJvdG90eXBlLm1hdGNoZXMgPSBmdW5jdGlvbiAocGFyZW50U3RhdGVWYWx1ZSkge1xuICAgIHJldHVybiBtYXRjaGVzU3RhdGUocGFyZW50U3RhdGVWYWx1ZSwgdGhpcy52YWx1ZSk7XG4gIH07XG4gIC8qKlxyXG4gICAqIFdoZXRoZXIgdGhlIGN1cnJlbnQgc3RhdGUgY29uZmlndXJhdGlvbiBoYXMgYSBzdGF0ZSBub2RlIHdpdGggdGhlIHNwZWNpZmllZCBgdGFnYC5cclxuICAgKiBAcGFyYW0gdGFnXHJcbiAgICovXG5cblxuICBTdGF0ZS5wcm90b3R5cGUuaGFzVGFnID0gZnVuY3Rpb24gKHRhZykge1xuICAgIHJldHVybiB0aGlzLnRhZ3MuaGFzKHRhZyk7XG4gIH07XG4gIC8qKlxyXG4gICAqIERldGVybWluZXMgd2hldGhlciBzZW5kaW5nIHRoZSBgZXZlbnRgIHdpbGwgY2F1c2UgYSBub24tZm9yYmlkZGVuIHRyYW5zaXRpb25cclxuICAgKiB0byBiZSBzZWxlY3RlZCwgZXZlbiBpZiB0aGUgdHJhbnNpdGlvbnMgaGF2ZSBubyBhY3Rpb25zIG5vclxyXG4gICAqIGNoYW5nZSB0aGUgc3RhdGUgdmFsdWUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50IHRvIHRlc3RcclxuICAgKiBAcmV0dXJucyBXaGV0aGVyIHRoZSBldmVudCB3aWxsIGNhdXNlIGEgdHJhbnNpdGlvblxyXG4gICAqL1xuXG5cbiAgU3RhdGUucHJvdG90eXBlLmNhbiA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBfYTtcblxuICAgIGlmIChJU19QUk9EVUNUSU9OKSB7XG4gICAgICB3YXJuKCEhdGhpcy5tYWNoaW5lLCBcInN0YXRlLmNhbiguLi4pIHVzZWQgb3V0c2lkZSBvZiBhIG1hY2hpbmUtY3JlYXRlZCBTdGF0ZSBvYmplY3Q7IHRoaXMgd2lsbCBhbHdheXMgcmV0dXJuIGZhbHNlLlwiKTtcbiAgICB9XG5cbiAgICB2YXIgdHJhbnNpdGlvbkRhdGEgPSAoX2EgPSB0aGlzLm1hY2hpbmUpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5nZXRUcmFuc2l0aW9uRGF0YSh0aGlzLCBldmVudCk7XG4gICAgcmV0dXJuICEhKHRyYW5zaXRpb25EYXRhID09PSBudWxsIHx8IHRyYW5zaXRpb25EYXRhID09PSB2b2lkIDAgPyB2b2lkIDAgOiB0cmFuc2l0aW9uRGF0YS50cmFuc2l0aW9ucy5sZW5ndGgpICYmIC8vIENoZWNrIHRoYXQgYXQgbGVhc3Qgb25lIHRyYW5zaXRpb24gaXMgbm90IGZvcmJpZGRlblxuICAgIHRyYW5zaXRpb25EYXRhLnRyYW5zaXRpb25zLnNvbWUoZnVuY3Rpb24gKHQpIHtcbiAgICAgIHJldHVybiB0LnRhcmdldCAhPT0gdW5kZWZpbmVkIHx8IHQuYWN0aW9ucy5sZW5ndGg7XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIFN0YXRlO1xufSgpO1xuXG5leHBvcnQgeyBTdGF0ZSwgYmluZEFjdGlvblRvU3RhdGUsIGlzU3RhdGUsIGlzU3RhdGVDb25maWcsIHN0YXRlVmFsdWVzRXF1YWwgfTtcbiIsImltcG9ydCB7IF9fYXNzaWduLCBfX3NwcmVhZEFycmF5LCBfX3JlYWQsIF9fdmFsdWVzLCBfX3Jlc3QgfSBmcm9tICcuL192aXJ0dWFsL190c2xpYi5qcyc7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uLCBtYXBWYWx1ZXMsIGlzQXJyYXksIGZsYXR0ZW4sIHRvQXJyYXksIHRvU3RhdGVWYWx1ZSwgaXNTdHJpbmcsIGdldEV2ZW50VHlwZSwgdG9TQ1hNTEV2ZW50LCBtYXRjaGVzU3RhdGUsIHBhdGgsIGV2YWx1YXRlR3VhcmQsIG1hcENvbnRleHQsIGlzUmFpc2FibGVBY3Rpb24sIHBhdGhUb1N0YXRlVmFsdWUsIGlzQnVpbHRJbkV2ZW50LCBwYXJ0aXRpb24sIHVwZGF0ZUhpc3RvcnlWYWx1ZSwgdG9TdGF0ZVBhdGgsIG1hcEZpbHRlclZhbHVlcywgd2FybiwgdG9TdGF0ZVBhdGhzLCBuZXN0ZWRQYXRoLCBub3JtYWxpemVUYXJnZXQsIHRvR3VhcmQsIHRvVHJhbnNpdGlvbkNvbmZpZ0FycmF5LCBpc01hY2hpbmUsIGNyZWF0ZUludm9rZUlkIH0gZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQgeyBTdGF0ZSwgc3RhdGVWYWx1ZXNFcXVhbCB9IGZyb20gJy4vU3RhdGUuanMnO1xuaW1wb3J0IHsgc3RhcnQgYXMgc3RhcnQkMSwgc3RvcCBhcyBzdG9wJDEsIGludm9rZSwgdXBkYXRlLCBudWxsRXZlbnQgfSBmcm9tICcuL2FjdGlvblR5cGVzLmpzJztcbmltcG9ydCB7IGRvbmUsIHN0YXJ0LCB0b0FjdGlvbk9iamVjdHMsIHJhaXNlLCBzdG9wLCByZXNvbHZlQWN0aW9ucywgZG9uZUludm9rZSwgZXJyb3IsIHRvQWN0aW9uT2JqZWN0LCB0b0FjdGl2aXR5RGVmaW5pdGlvbiwgYWZ0ZXIsIHNlbmQsIGNhbmNlbCwgaW5pdEV2ZW50IH0gZnJvbSAnLi9hY3Rpb25zLmpzJztcbmltcG9ydCB7IElTX1BST0RVQ1RJT04gfSBmcm9tICcuL2Vudmlyb25tZW50LmpzJztcbmltcG9ydCB7IFNUQVRFX0RFTElNSVRFUiB9IGZyb20gJy4vY29uc3RhbnRzLmpzJztcbmltcG9ydCB7IGdldEFsbFN0YXRlTm9kZXMsIGdldENvbmZpZ3VyYXRpb24sIGlzSW5GaW5hbFN0YXRlLCBnZXRUYWdzRnJvbUNvbmZpZ3VyYXRpb24sIGhhcywgZ2V0Q2hpbGRyZW4sIGdldFZhbHVlLCBpc0xlYWZOb2RlLCBnZXRBbGxDaGlsZHJlbiB9IGZyb20gJy4vc3RhdGVVdGlscy5qcyc7XG5pbXBvcnQgeyBjcmVhdGVJbnZvY2FibGVBY3RvciB9IGZyb20gJy4vQWN0b3IuanMnO1xuaW1wb3J0IHsgdG9JbnZva2VEZWZpbml0aW9uIH0gZnJvbSAnLi9pbnZva2VVdGlscy5qcyc7XG5cbnZhciBOVUxMX0VWRU5UID0gJyc7XG52YXIgU1RBVEVfSURFTlRJRklFUiA9ICcjJztcbnZhciBXSUxEQ0FSRCA9ICcqJztcbnZhciBFTVBUWV9PQkpFQ1QgPSB7fTtcblxudmFyIGlzU3RhdGVJZCA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgcmV0dXJuIHN0clswXSA9PT0gU1RBVEVfSURFTlRJRklFUjtcbn07XG5cbnZhciBjcmVhdGVEZWZhdWx0T3B0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHtcbiAgICBhY3Rpb25zOiB7fSxcbiAgICBndWFyZHM6IHt9LFxuICAgIHNlcnZpY2VzOiB7fSxcbiAgICBhY3Rpdml0aWVzOiB7fSxcbiAgICBkZWxheXM6IHt9XG4gIH07XG59O1xuXG52YXIgdmFsaWRhdGVBcnJheWlmaWVkVHJhbnNpdGlvbnMgPSBmdW5jdGlvbiAoc3RhdGVOb2RlLCBldmVudCwgdHJhbnNpdGlvbnMpIHtcbiAgdmFyIGhhc05vbkxhc3RVbmd1YXJkZWRUYXJnZXQgPSB0cmFuc2l0aW9ucy5zbGljZSgwLCAtMSkuc29tZShmdW5jdGlvbiAodHJhbnNpdGlvbikge1xuICAgIHJldHVybiAhKCdjb25kJyBpbiB0cmFuc2l0aW9uKSAmJiAhKCdpbicgaW4gdHJhbnNpdGlvbikgJiYgKGlzU3RyaW5nKHRyYW5zaXRpb24udGFyZ2V0KSB8fCBpc01hY2hpbmUodHJhbnNpdGlvbi50YXJnZXQpKTtcbiAgfSk7XG4gIHZhciBldmVudFRleHQgPSBldmVudCA9PT0gTlVMTF9FVkVOVCA/ICd0aGUgdHJhbnNpZW50IGV2ZW50JyA6IFwiZXZlbnQgJ1wiLmNvbmNhdChldmVudCwgXCInXCIpO1xuICB3YXJuKCFoYXNOb25MYXN0VW5ndWFyZGVkVGFyZ2V0LCBcIk9uZSBvciBtb3JlIHRyYW5zaXRpb25zIGZvciBcIi5jb25jYXQoZXZlbnRUZXh0LCBcIiBvbiBzdGF0ZSAnXCIpLmNvbmNhdChzdGF0ZU5vZGUuaWQsIFwiJyBhcmUgdW5yZWFjaGFibGUuIFwiKSArIFwiTWFrZSBzdXJlIHRoYXQgdGhlIGRlZmF1bHQgdHJhbnNpdGlvbiBpcyB0aGUgbGFzdCBvbmUgZGVmaW5lZC5cIik7XG59O1xuXG52YXIgU3RhdGVOb2RlID1cbi8qI19fUFVSRV9fKi9cblxuLyoqIEBjbGFzcyAqL1xuZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBTdGF0ZU5vZGUoXG4gIC8qKlxyXG4gICAqIFRoZSByYXcgY29uZmlnIHVzZWQgdG8gY3JlYXRlIHRoZSBtYWNoaW5lLlxyXG4gICAqL1xuICBjb25maWcsIG9wdGlvbnMsXG4gIC8qKlxyXG4gICAqIFRoZSBpbml0aWFsIGV4dGVuZGVkIHN0YXRlXHJcbiAgICovXG4gIF9jb250ZXh0LCAvLyBUT0RPOiB0aGlzIGlzIHVuc2FmZSwgYnV0IHdlJ3JlIHJlbW92aW5nIGl0IGluIHY1IGFueXdheVxuICBfc3RhdGVJbmZvKSB7XG4gICAgaWYgKF9jb250ZXh0ID09PSB2b2lkIDApIHtcbiAgICAgIF9jb250ZXh0ID0gJ2NvbnRleHQnIGluIGNvbmZpZyA/IGNvbmZpZy5jb250ZXh0IDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgX2E7XG5cbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLl9jb250ZXh0ID0gX2NvbnRleHQ7XG4gICAgLyoqXHJcbiAgICAgKiBUaGUgb3JkZXIgdGhpcyBzdGF0ZSBub2RlIGFwcGVhcnMuIENvcnJlc3BvbmRzIHRvIHRoZSBpbXBsaWNpdCBTQ1hNTCBkb2N1bWVudCBvcmRlci5cclxuICAgICAqL1xuXG4gICAgdGhpcy5vcmRlciA9IC0xO1xuICAgIHRoaXMuX194c3RhdGVub2RlID0gdHJ1ZTtcbiAgICB0aGlzLl9fY2FjaGUgPSB7XG4gICAgICBldmVudHM6IHVuZGVmaW5lZCxcbiAgICAgIHJlbGF0aXZlVmFsdWU6IG5ldyBNYXAoKSxcbiAgICAgIGluaXRpYWxTdGF0ZVZhbHVlOiB1bmRlZmluZWQsXG4gICAgICBpbml0aWFsU3RhdGU6IHVuZGVmaW5lZCxcbiAgICAgIG9uOiB1bmRlZmluZWQsXG4gICAgICB0cmFuc2l0aW9uczogdW5kZWZpbmVkLFxuICAgICAgY2FuZGlkYXRlczoge30sXG4gICAgICBkZWxheWVkVHJhbnNpdGlvbnM6IHVuZGVmaW5lZFxuICAgIH07XG4gICAgdGhpcy5pZE1hcCA9IHt9O1xuICAgIHRoaXMudGFncyA9IFtdO1xuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oY3JlYXRlRGVmYXVsdE9wdGlvbnMoKSwgb3B0aW9ucyk7XG4gICAgdGhpcy5wYXJlbnQgPSBfc3RhdGVJbmZvID09PSBudWxsIHx8IF9zdGF0ZUluZm8gPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9zdGF0ZUluZm8ucGFyZW50O1xuICAgIHRoaXMua2V5ID0gdGhpcy5jb25maWcua2V5IHx8IChfc3RhdGVJbmZvID09PSBudWxsIHx8IF9zdGF0ZUluZm8gPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9zdGF0ZUluZm8ua2V5KSB8fCB0aGlzLmNvbmZpZy5pZCB8fCAnKG1hY2hpbmUpJztcbiAgICB0aGlzLm1hY2hpbmUgPSB0aGlzLnBhcmVudCA/IHRoaXMucGFyZW50Lm1hY2hpbmUgOiB0aGlzO1xuICAgIHRoaXMucGF0aCA9IHRoaXMucGFyZW50ID8gdGhpcy5wYXJlbnQucGF0aC5jb25jYXQodGhpcy5rZXkpIDogW107XG4gICAgdGhpcy5kZWxpbWl0ZXIgPSB0aGlzLmNvbmZpZy5kZWxpbWl0ZXIgfHwgKHRoaXMucGFyZW50ID8gdGhpcy5wYXJlbnQuZGVsaW1pdGVyIDogU1RBVEVfREVMSU1JVEVSKTtcbiAgICB0aGlzLmlkID0gdGhpcy5jb25maWcuaWQgfHwgX19zcHJlYWRBcnJheShbdGhpcy5tYWNoaW5lLmtleV0sIF9fcmVhZCh0aGlzLnBhdGgpLCBmYWxzZSkuam9pbih0aGlzLmRlbGltaXRlcik7XG4gICAgdGhpcy52ZXJzaW9uID0gdGhpcy5wYXJlbnQgPyB0aGlzLnBhcmVudC52ZXJzaW9uIDogdGhpcy5jb25maWcudmVyc2lvbjtcbiAgICB0aGlzLnR5cGUgPSB0aGlzLmNvbmZpZy50eXBlIHx8ICh0aGlzLmNvbmZpZy5wYXJhbGxlbCA/ICdwYXJhbGxlbCcgOiB0aGlzLmNvbmZpZy5zdGF0ZXMgJiYgT2JqZWN0LmtleXModGhpcy5jb25maWcuc3RhdGVzKS5sZW5ndGggPyAnY29tcG91bmQnIDogdGhpcy5jb25maWcuaGlzdG9yeSA/ICdoaXN0b3J5JyA6ICdhdG9taWMnKTtcbiAgICB0aGlzLnNjaGVtYSA9IHRoaXMucGFyZW50ID8gdGhpcy5tYWNoaW5lLnNjaGVtYSA6IChfYSA9IHRoaXMuY29uZmlnLnNjaGVtYSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDoge307XG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IHRoaXMuY29uZmlnLmRlc2NyaXB0aW9uO1xuXG4gICAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgICB3YXJuKCEoJ3BhcmFsbGVsJyBpbiB0aGlzLmNvbmZpZyksIFwiVGhlIFxcXCJwYXJhbGxlbFxcXCIgcHJvcGVydHkgaXMgZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHZlcnNpb24gNC4xLiBcIi5jb25jYXQodGhpcy5jb25maWcucGFyYWxsZWwgPyBcIlJlcGxhY2Ugd2l0aCBgdHlwZTogJ3BhcmFsbGVsJ2BcIiA6IFwiVXNlIGB0eXBlOiAnXCIuY29uY2F0KHRoaXMudHlwZSwgXCInYFwiKSwgXCIgaW4gdGhlIGNvbmZpZyBmb3Igc3RhdGUgbm9kZSAnXCIpLmNvbmNhdCh0aGlzLmlkLCBcIicgaW5zdGVhZC5cIikpO1xuICAgIH1cblxuICAgIHRoaXMuaW5pdGlhbCA9IHRoaXMuY29uZmlnLmluaXRpYWw7XG4gICAgdGhpcy5zdGF0ZXMgPSB0aGlzLmNvbmZpZy5zdGF0ZXMgPyBtYXBWYWx1ZXModGhpcy5jb25maWcuc3RhdGVzLCBmdW5jdGlvbiAoc3RhdGVDb25maWcsIGtleSkge1xuICAgICAgdmFyIF9hO1xuXG4gICAgICB2YXIgc3RhdGVOb2RlID0gbmV3IFN0YXRlTm9kZShzdGF0ZUNvbmZpZywge30sIHVuZGVmaW5lZCwge1xuICAgICAgICBwYXJlbnQ6IF90aGlzLFxuICAgICAgICBrZXk6IGtleVxuICAgICAgfSk7XG4gICAgICBPYmplY3QuYXNzaWduKF90aGlzLmlkTWFwLCBfX2Fzc2lnbigoX2EgPSB7fSwgX2Fbc3RhdGVOb2RlLmlkXSA9IHN0YXRlTm9kZSwgX2EpLCBzdGF0ZU5vZGUuaWRNYXApKTtcbiAgICAgIHJldHVybiBzdGF0ZU5vZGU7XG4gICAgfSkgOiBFTVBUWV9PQkpFQ1Q7IC8vIERvY3VtZW50IG9yZGVyXG5cbiAgICB2YXIgb3JkZXIgPSAwO1xuXG4gICAgZnVuY3Rpb24gZGZzKHN0YXRlTm9kZSkge1xuICAgICAgdmFyIGVfMSwgX2E7XG5cbiAgICAgIHN0YXRlTm9kZS5vcmRlciA9IG9yZGVyKys7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAodmFyIF9iID0gX192YWx1ZXMoZ2V0QWxsQ2hpbGRyZW4oc3RhdGVOb2RlKSksIF9jID0gX2IubmV4dCgpOyAhX2MuZG9uZTsgX2MgPSBfYi5uZXh0KCkpIHtcbiAgICAgICAgICB2YXIgY2hpbGQgPSBfYy52YWx1ZTtcbiAgICAgICAgICBkZnMoY2hpbGQpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlXzFfMSkge1xuICAgICAgICBlXzEgPSB7XG4gICAgICAgICAgZXJyb3I6IGVfMV8xXG4gICAgICAgIH07XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChfYyAmJiAhX2MuZG9uZSAmJiAoX2EgPSBfYi5yZXR1cm4pKSBfYS5jYWxsKF9iKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBpZiAoZV8xKSB0aHJvdyBlXzEuZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBkZnModGhpcyk7IC8vIEhpc3RvcnkgY29uZmlnXG5cbiAgICB0aGlzLmhpc3RvcnkgPSB0aGlzLmNvbmZpZy5oaXN0b3J5ID09PSB0cnVlID8gJ3NoYWxsb3cnIDogdGhpcy5jb25maWcuaGlzdG9yeSB8fCBmYWxzZTtcbiAgICB0aGlzLl90cmFuc2llbnQgPSAhIXRoaXMuY29uZmlnLmFsd2F5cyB8fCAoIXRoaXMuY29uZmlnLm9uID8gZmFsc2UgOiBBcnJheS5pc0FycmF5KHRoaXMuY29uZmlnLm9uKSA/IHRoaXMuY29uZmlnLm9uLnNvbWUoZnVuY3Rpb24gKF9hKSB7XG4gICAgICB2YXIgZXZlbnQgPSBfYS5ldmVudDtcbiAgICAgIHJldHVybiBldmVudCA9PT0gTlVMTF9FVkVOVDtcbiAgICB9KSA6IE5VTExfRVZFTlQgaW4gdGhpcy5jb25maWcub24pO1xuICAgIHRoaXMuc3RyaWN0ID0gISF0aGlzLmNvbmZpZy5zdHJpY3Q7IC8vIFRPRE86IGRlcHJlY2F0ZSAoZW50cnkpXG5cbiAgICB0aGlzLm9uRW50cnkgPSB0b0FycmF5KHRoaXMuY29uZmlnLmVudHJ5IHx8IHRoaXMuY29uZmlnLm9uRW50cnkpLm1hcChmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICByZXR1cm4gdG9BY3Rpb25PYmplY3QoYWN0aW9uKTtcbiAgICB9KTsgLy8gVE9ETzogZGVwcmVjYXRlIChleGl0KVxuXG4gICAgdGhpcy5vbkV4aXQgPSB0b0FycmF5KHRoaXMuY29uZmlnLmV4aXQgfHwgdGhpcy5jb25maWcub25FeGl0KS5tYXAoZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgcmV0dXJuIHRvQWN0aW9uT2JqZWN0KGFjdGlvbik7XG4gICAgfSk7XG4gICAgdGhpcy5tZXRhID0gdGhpcy5jb25maWcubWV0YTtcbiAgICB0aGlzLmRvbmVEYXRhID0gdGhpcy50eXBlID09PSAnZmluYWwnID8gdGhpcy5jb25maWcuZGF0YSA6IHVuZGVmaW5lZDtcbiAgICB0aGlzLmludm9rZSA9IHRvQXJyYXkodGhpcy5jb25maWcuaW52b2tlKS5tYXAoZnVuY3Rpb24gKGludm9rZUNvbmZpZywgaSkge1xuICAgICAgdmFyIF9hLCBfYjtcblxuICAgICAgaWYgKGlzTWFjaGluZShpbnZva2VDb25maWcpKSB7XG4gICAgICAgIHZhciBpbnZva2VJZCA9IGNyZWF0ZUludm9rZUlkKF90aGlzLmlkLCBpKTtcbiAgICAgICAgX3RoaXMubWFjaGluZS5vcHRpb25zLnNlcnZpY2VzID0gX19hc3NpZ24oKF9hID0ge30sIF9hW2ludm9rZUlkXSA9IGludm9rZUNvbmZpZywgX2EpLCBfdGhpcy5tYWNoaW5lLm9wdGlvbnMuc2VydmljZXMpO1xuICAgICAgICByZXR1cm4gdG9JbnZva2VEZWZpbml0aW9uKHtcbiAgICAgICAgICBzcmM6IGludm9rZUlkLFxuICAgICAgICAgIGlkOiBpbnZva2VJZFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoaXNTdHJpbmcoaW52b2tlQ29uZmlnLnNyYykpIHtcbiAgICAgICAgdmFyIGludm9rZUlkID0gaW52b2tlQ29uZmlnLmlkIHx8IGNyZWF0ZUludm9rZUlkKF90aGlzLmlkLCBpKTtcbiAgICAgICAgcmV0dXJuIHRvSW52b2tlRGVmaW5pdGlvbihfX2Fzc2lnbihfX2Fzc2lnbih7fSwgaW52b2tlQ29uZmlnKSwge1xuICAgICAgICAgIGlkOiBpbnZva2VJZCxcbiAgICAgICAgICBzcmM6IGludm9rZUNvbmZpZy5zcmNcbiAgICAgICAgfSkpO1xuICAgICAgfSBlbHNlIGlmIChpc01hY2hpbmUoaW52b2tlQ29uZmlnLnNyYykgfHwgaXNGdW5jdGlvbihpbnZva2VDb25maWcuc3JjKSkge1xuICAgICAgICB2YXIgaW52b2tlSWQgPSBpbnZva2VDb25maWcuaWQgfHwgY3JlYXRlSW52b2tlSWQoX3RoaXMuaWQsIGkpO1xuICAgICAgICBfdGhpcy5tYWNoaW5lLm9wdGlvbnMuc2VydmljZXMgPSBfX2Fzc2lnbigoX2IgPSB7fSwgX2JbaW52b2tlSWRdID0gaW52b2tlQ29uZmlnLnNyYywgX2IpLCBfdGhpcy5tYWNoaW5lLm9wdGlvbnMuc2VydmljZXMpO1xuICAgICAgICByZXR1cm4gdG9JbnZva2VEZWZpbml0aW9uKF9fYXNzaWduKF9fYXNzaWduKHtcbiAgICAgICAgICBpZDogaW52b2tlSWRcbiAgICAgICAgfSwgaW52b2tlQ29uZmlnKSwge1xuICAgICAgICAgIHNyYzogaW52b2tlSWRcbiAgICAgICAgfSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGludm9rZVNvdXJjZSA9IGludm9rZUNvbmZpZy5zcmM7XG4gICAgICAgIHJldHVybiB0b0ludm9rZURlZmluaXRpb24oX19hc3NpZ24oX19hc3NpZ24oe1xuICAgICAgICAgIGlkOiBjcmVhdGVJbnZva2VJZChfdGhpcy5pZCwgaSlcbiAgICAgICAgfSwgaW52b2tlQ29uZmlnKSwge1xuICAgICAgICAgIHNyYzogaW52b2tlU291cmNlXG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmFjdGl2aXRpZXMgPSB0b0FycmF5KHRoaXMuY29uZmlnLmFjdGl2aXRpZXMpLmNvbmNhdCh0aGlzLmludm9rZSkubWFwKGZ1bmN0aW9uIChhY3Rpdml0eSkge1xuICAgICAgcmV0dXJuIHRvQWN0aXZpdHlEZWZpbml0aW9uKGFjdGl2aXR5KTtcbiAgICB9KTtcbiAgICB0aGlzLnRyYW5zaXRpb24gPSB0aGlzLnRyYW5zaXRpb24uYmluZCh0aGlzKTtcbiAgICB0aGlzLnRhZ3MgPSB0b0FycmF5KHRoaXMuY29uZmlnLnRhZ3MpOyAvLyBUT0RPOiB0aGlzIGlzIHRoZSByZWFsIGZpeCBmb3IgaW5pdGlhbGl6YXRpb24gb25jZVxuICAgIC8vIHN0YXRlIG5vZGUgZ2V0dGVycyBhcmUgZGVwcmVjYXRlZFxuICAgIC8vIGlmICghdGhpcy5wYXJlbnQpIHtcbiAgICAvLyAgIHRoaXMuX2luaXQoKTtcbiAgICAvLyB9XG4gIH1cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLl9fY2FjaGUudHJhbnNpdGlvbnMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBnZXRBbGxTdGF0ZU5vZGVzKHRoaXMpLmZvckVhY2goZnVuY3Rpb24gKHN0YXRlTm9kZSkge1xuICAgICAgcmV0dXJuIHN0YXRlTm9kZS5vbjtcbiAgICB9KTtcbiAgfTtcbiAgLyoqXHJcbiAgICogQ2xvbmVzIHRoaXMgc3RhdGUgbWFjaGluZSB3aXRoIGN1c3RvbSBvcHRpb25zIGFuZCBjb250ZXh0LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyAoYWN0aW9ucywgZ3VhcmRzLCBhY3Rpdml0aWVzLCBzZXJ2aWNlcykgdG8gcmVjdXJzaXZlbHkgbWVyZ2Ugd2l0aCB0aGUgZXhpc3Rpbmcgb3B0aW9ucy5cclxuICAgKiBAcGFyYW0gY29udGV4dCBDdXN0b20gY29udGV4dCAod2lsbCBvdmVycmlkZSBwcmVkZWZpbmVkIGNvbnRleHQpXHJcbiAgICovXG5cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLndpdGhDb25maWcgPSBmdW5jdGlvbiAob3B0aW9ucywgY29udGV4dCkge1xuICAgIHZhciBfYSA9IHRoaXMub3B0aW9ucyxcbiAgICAgICAgYWN0aW9ucyA9IF9hLmFjdGlvbnMsXG4gICAgICAgIGFjdGl2aXRpZXMgPSBfYS5hY3Rpdml0aWVzLFxuICAgICAgICBndWFyZHMgPSBfYS5ndWFyZHMsXG4gICAgICAgIHNlcnZpY2VzID0gX2Euc2VydmljZXMsXG4gICAgICAgIGRlbGF5cyA9IF9hLmRlbGF5cztcbiAgICByZXR1cm4gbmV3IFN0YXRlTm9kZSh0aGlzLmNvbmZpZywge1xuICAgICAgYWN0aW9uczogX19hc3NpZ24oX19hc3NpZ24oe30sIGFjdGlvbnMpLCBvcHRpb25zLmFjdGlvbnMpLFxuICAgICAgYWN0aXZpdGllczogX19hc3NpZ24oX19hc3NpZ24oe30sIGFjdGl2aXRpZXMpLCBvcHRpb25zLmFjdGl2aXRpZXMpLFxuICAgICAgZ3VhcmRzOiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgZ3VhcmRzKSwgb3B0aW9ucy5ndWFyZHMpLFxuICAgICAgc2VydmljZXM6IF9fYXNzaWduKF9fYXNzaWduKHt9LCBzZXJ2aWNlcyksIG9wdGlvbnMuc2VydmljZXMpLFxuICAgICAgZGVsYXlzOiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgZGVsYXlzKSwgb3B0aW9ucy5kZWxheXMpXG4gICAgfSwgY29udGV4dCAhPT0gbnVsbCAmJiBjb250ZXh0ICE9PSB2b2lkIDAgPyBjb250ZXh0IDogdGhpcy5jb250ZXh0KTtcbiAgfTtcbiAgLyoqXHJcbiAgICogQ2xvbmVzIHRoaXMgc3RhdGUgbWFjaGluZSB3aXRoIGN1c3RvbSBjb250ZXh0LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGNvbnRleHQgQ3VzdG9tIGNvbnRleHQgKHdpbGwgb3ZlcnJpZGUgcHJlZGVmaW5lZCBjb250ZXh0LCBub3QgcmVjdXJzaXZlKVxyXG4gICAqL1xuXG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS53aXRoQ29udGV4dCA9IGZ1bmN0aW9uIChjb250ZXh0KSB7XG4gICAgcmV0dXJuIG5ldyBTdGF0ZU5vZGUodGhpcy5jb25maWcsIHRoaXMub3B0aW9ucywgY29udGV4dCk7XG4gIH07XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0YXRlTm9kZS5wcm90b3R5cGUsIFwiY29udGV4dFwiLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gaXNGdW5jdGlvbih0aGlzLl9jb250ZXh0KSA/IHRoaXMuX2NvbnRleHQoKSA6IHRoaXMuX2NvbnRleHQ7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdGF0ZU5vZGUucHJvdG90eXBlLCBcImRlZmluaXRpb25cIiwge1xuICAgIC8qKlxyXG4gICAgICogVGhlIHdlbGwtc3RydWN0dXJlZCBzdGF0ZSBub2RlIGRlZmluaXRpb24uXHJcbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAgICBrZXk6IHRoaXMua2V5LFxuICAgICAgICB2ZXJzaW9uOiB0aGlzLnZlcnNpb24sXG4gICAgICAgIGNvbnRleHQ6IHRoaXMuY29udGV4dCxcbiAgICAgICAgdHlwZTogdGhpcy50eXBlLFxuICAgICAgICBpbml0aWFsOiB0aGlzLmluaXRpYWwsXG4gICAgICAgIGhpc3Rvcnk6IHRoaXMuaGlzdG9yeSxcbiAgICAgICAgc3RhdGVzOiBtYXBWYWx1ZXModGhpcy5zdGF0ZXMsIGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgICAgIHJldHVybiBzdGF0ZS5kZWZpbml0aW9uO1xuICAgICAgICB9KSxcbiAgICAgICAgb246IHRoaXMub24sXG4gICAgICAgIHRyYW5zaXRpb25zOiB0aGlzLnRyYW5zaXRpb25zLFxuICAgICAgICBlbnRyeTogdGhpcy5vbkVudHJ5LFxuICAgICAgICBleGl0OiB0aGlzLm9uRXhpdCxcbiAgICAgICAgYWN0aXZpdGllczogdGhpcy5hY3Rpdml0aWVzIHx8IFtdLFxuICAgICAgICBtZXRhOiB0aGlzLm1ldGEsXG4gICAgICAgIG9yZGVyOiB0aGlzLm9yZGVyIHx8IC0xLFxuICAgICAgICBkYXRhOiB0aGlzLmRvbmVEYXRhLFxuICAgICAgICBpbnZva2U6IHRoaXMuaW52b2tlLFxuICAgICAgICBkZXNjcmlwdGlvbjogdGhpcy5kZXNjcmlwdGlvbixcbiAgICAgICAgdGFnczogdGhpcy50YWdzXG4gICAgICB9O1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmRlZmluaXRpb247XG4gIH07XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0YXRlTm9kZS5wcm90b3R5cGUsIFwib25cIiwge1xuICAgIC8qKlxyXG4gICAgICogVGhlIG1hcHBpbmcgb2YgZXZlbnRzIHRvIHRyYW5zaXRpb25zLlxyXG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5fX2NhY2hlLm9uKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fY2FjaGUub247XG4gICAgICB9XG5cbiAgICAgIHZhciB0cmFuc2l0aW9ucyA9IHRoaXMudHJhbnNpdGlvbnM7XG4gICAgICByZXR1cm4gdGhpcy5fX2NhY2hlLm9uID0gdHJhbnNpdGlvbnMucmVkdWNlKGZ1bmN0aW9uIChtYXAsIHRyYW5zaXRpb24pIHtcbiAgICAgICAgbWFwW3RyYW5zaXRpb24uZXZlbnRUeXBlXSA9IG1hcFt0cmFuc2l0aW9uLmV2ZW50VHlwZV0gfHwgW107XG4gICAgICAgIG1hcFt0cmFuc2l0aW9uLmV2ZW50VHlwZV0ucHVzaCh0cmFuc2l0aW9uKTtcbiAgICAgICAgcmV0dXJuIG1hcDtcbiAgICAgIH0sIHt9KTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0YXRlTm9kZS5wcm90b3R5cGUsIFwiYWZ0ZXJcIiwge1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX19jYWNoZS5kZWxheWVkVHJhbnNpdGlvbnMgfHwgKHRoaXMuX19jYWNoZS5kZWxheWVkVHJhbnNpdGlvbnMgPSB0aGlzLmdldERlbGF5ZWRUcmFuc2l0aW9ucygpLCB0aGlzLl9fY2FjaGUuZGVsYXllZFRyYW5zaXRpb25zKTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0YXRlTm9kZS5wcm90b3R5cGUsIFwidHJhbnNpdGlvbnNcIiwge1xuICAgIC8qKlxyXG4gICAgICogQWxsIHRoZSB0cmFuc2l0aW9ucyB0aGF0IGNhbiBiZSB0YWtlbiBmcm9tIHRoaXMgc3RhdGUgbm9kZS5cclxuICAgICAqL1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX19jYWNoZS50cmFuc2l0aW9ucyB8fCAodGhpcy5fX2NhY2hlLnRyYW5zaXRpb25zID0gdGhpcy5mb3JtYXRUcmFuc2l0aW9ucygpLCB0aGlzLl9fY2FjaGUudHJhbnNpdGlvbnMpO1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZ2V0Q2FuZGlkYXRlcyA9IGZ1bmN0aW9uIChldmVudE5hbWUpIHtcbiAgICBpZiAodGhpcy5fX2NhY2hlLmNhbmRpZGF0ZXNbZXZlbnROYW1lXSkge1xuICAgICAgcmV0dXJuIHRoaXMuX19jYWNoZS5jYW5kaWRhdGVzW2V2ZW50TmFtZV07XG4gICAgfVxuXG4gICAgdmFyIHRyYW5zaWVudCA9IGV2ZW50TmFtZSA9PT0gTlVMTF9FVkVOVDtcbiAgICB2YXIgY2FuZGlkYXRlcyA9IHRoaXMudHJhbnNpdGlvbnMuZmlsdGVyKGZ1bmN0aW9uICh0cmFuc2l0aW9uKSB7XG4gICAgICB2YXIgc2FtZUV2ZW50VHlwZSA9IHRyYW5zaXRpb24uZXZlbnRUeXBlID09PSBldmVudE5hbWU7IC8vIG51bGwgZXZlbnRzIHNob3VsZCBvbmx5IG1hdGNoIGFnYWluc3QgZXZlbnRsZXNzIHRyYW5zaXRpb25zXG5cbiAgICAgIHJldHVybiB0cmFuc2llbnQgPyBzYW1lRXZlbnRUeXBlIDogc2FtZUV2ZW50VHlwZSB8fCB0cmFuc2l0aW9uLmV2ZW50VHlwZSA9PT0gV0lMRENBUkQ7XG4gICAgfSk7XG4gICAgdGhpcy5fX2NhY2hlLmNhbmRpZGF0ZXNbZXZlbnROYW1lXSA9IGNhbmRpZGF0ZXM7XG4gICAgcmV0dXJuIGNhbmRpZGF0ZXM7XG4gIH07XG4gIC8qKlxyXG4gICAqIEFsbCBkZWxheWVkIHRyYW5zaXRpb25zIGZyb20gdGhlIGNvbmZpZy5cclxuICAgKi9cblxuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZ2V0RGVsYXllZFRyYW5zaXRpb25zID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgYWZ0ZXJDb25maWcgPSB0aGlzLmNvbmZpZy5hZnRlcjtcblxuICAgIGlmICghYWZ0ZXJDb25maWcpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICB2YXIgbXV0YXRlRW50cnlFeGl0ID0gZnVuY3Rpb24gKGRlbGF5LCBpKSB7XG4gICAgICB2YXIgZGVsYXlSZWYgPSBpc0Z1bmN0aW9uKGRlbGF5KSA/IFwiXCIuY29uY2F0KF90aGlzLmlkLCBcIjpkZWxheVtcIikuY29uY2F0KGksIFwiXVwiKSA6IGRlbGF5O1xuICAgICAgdmFyIGV2ZW50VHlwZSA9IGFmdGVyKGRlbGF5UmVmLCBfdGhpcy5pZCk7XG5cbiAgICAgIF90aGlzLm9uRW50cnkucHVzaChzZW5kKGV2ZW50VHlwZSwge1xuICAgICAgICBkZWxheTogZGVsYXlcbiAgICAgIH0pKTtcblxuICAgICAgX3RoaXMub25FeGl0LnB1c2goY2FuY2VsKGV2ZW50VHlwZSkpO1xuXG4gICAgICByZXR1cm4gZXZlbnRUeXBlO1xuICAgIH07XG5cbiAgICB2YXIgZGVsYXllZFRyYW5zaXRpb25zID0gaXNBcnJheShhZnRlckNvbmZpZykgPyBhZnRlckNvbmZpZy5tYXAoZnVuY3Rpb24gKHRyYW5zaXRpb24sIGkpIHtcbiAgICAgIHZhciBldmVudFR5cGUgPSBtdXRhdGVFbnRyeUV4aXQodHJhbnNpdGlvbi5kZWxheSwgaSk7XG4gICAgICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIHRyYW5zaXRpb24pLCB7XG4gICAgICAgIGV2ZW50OiBldmVudFR5cGVcbiAgICAgIH0pO1xuICAgIH0pIDogZmxhdHRlbihPYmplY3Qua2V5cyhhZnRlckNvbmZpZykubWFwKGZ1bmN0aW9uIChkZWxheSwgaSkge1xuICAgICAgdmFyIGNvbmZpZ1RyYW5zaXRpb24gPSBhZnRlckNvbmZpZ1tkZWxheV07XG4gICAgICB2YXIgcmVzb2x2ZWRUcmFuc2l0aW9uID0gaXNTdHJpbmcoY29uZmlnVHJhbnNpdGlvbikgPyB7XG4gICAgICAgIHRhcmdldDogY29uZmlnVHJhbnNpdGlvblxuICAgICAgfSA6IGNvbmZpZ1RyYW5zaXRpb247XG4gICAgICB2YXIgcmVzb2x2ZWREZWxheSA9ICFpc05hTigrZGVsYXkpID8gK2RlbGF5IDogZGVsYXk7XG4gICAgICB2YXIgZXZlbnRUeXBlID0gbXV0YXRlRW50cnlFeGl0KHJlc29sdmVkRGVsYXksIGkpO1xuICAgICAgcmV0dXJuIHRvQXJyYXkocmVzb2x2ZWRUcmFuc2l0aW9uKS5tYXAoZnVuY3Rpb24gKHRyYW5zaXRpb24pIHtcbiAgICAgICAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCB0cmFuc2l0aW9uKSwge1xuICAgICAgICAgIGV2ZW50OiBldmVudFR5cGUsXG4gICAgICAgICAgZGVsYXk6IHJlc29sdmVkRGVsYXlcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KSk7XG4gICAgcmV0dXJuIGRlbGF5ZWRUcmFuc2l0aW9ucy5tYXAoZnVuY3Rpb24gKGRlbGF5ZWRUcmFuc2l0aW9uKSB7XG4gICAgICB2YXIgZGVsYXkgPSBkZWxheWVkVHJhbnNpdGlvbi5kZWxheTtcbiAgICAgIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgX3RoaXMuZm9ybWF0VHJhbnNpdGlvbihkZWxheWVkVHJhbnNpdGlvbikpLCB7XG4gICAgICAgIGRlbGF5OiBkZWxheVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIHN0YXRlIG5vZGVzIHJlcHJlc2VudGVkIGJ5IHRoZSBjdXJyZW50IHN0YXRlIHZhbHVlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHN0YXRlIFRoZSBzdGF0ZSB2YWx1ZSBvciBTdGF0ZSBpbnN0YW5jZVxyXG4gICAqL1xuXG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5nZXRTdGF0ZU5vZGVzID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgdmFyIF9hO1xuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGlmICghc3RhdGUpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICB2YXIgc3RhdGVWYWx1ZSA9IHN0YXRlIGluc3RhbmNlb2YgU3RhdGUgPyBzdGF0ZS52YWx1ZSA6IHRvU3RhdGVWYWx1ZShzdGF0ZSwgdGhpcy5kZWxpbWl0ZXIpO1xuXG4gICAgaWYgKGlzU3RyaW5nKHN0YXRlVmFsdWUpKSB7XG4gICAgICB2YXIgaW5pdGlhbFN0YXRlVmFsdWUgPSB0aGlzLmdldFN0YXRlTm9kZShzdGF0ZVZhbHVlKS5pbml0aWFsO1xuICAgICAgcmV0dXJuIGluaXRpYWxTdGF0ZVZhbHVlICE9PSB1bmRlZmluZWQgPyB0aGlzLmdldFN0YXRlTm9kZXMoKF9hID0ge30sIF9hW3N0YXRlVmFsdWVdID0gaW5pdGlhbFN0YXRlVmFsdWUsIF9hKSkgOiBbdGhpcywgdGhpcy5zdGF0ZXNbc3RhdGVWYWx1ZV1dO1xuICAgIH1cblxuICAgIHZhciBzdWJTdGF0ZUtleXMgPSBPYmplY3Qua2V5cyhzdGF0ZVZhbHVlKTtcbiAgICB2YXIgc3ViU3RhdGVOb2RlcyA9IFt0aGlzXTtcbiAgICBzdWJTdGF0ZU5vZGVzLnB1c2guYXBwbHkoc3ViU3RhdGVOb2RlcywgX19zcHJlYWRBcnJheShbXSwgX19yZWFkKGZsYXR0ZW4oc3ViU3RhdGVLZXlzLm1hcChmdW5jdGlvbiAoc3ViU3RhdGVLZXkpIHtcbiAgICAgIHJldHVybiBfdGhpcy5nZXRTdGF0ZU5vZGUoc3ViU3RhdGVLZXkpLmdldFN0YXRlTm9kZXMoc3RhdGVWYWx1ZVtzdWJTdGF0ZUtleV0pO1xuICAgIH0pKSksIGZhbHNlKSk7XG4gICAgcmV0dXJuIHN1YlN0YXRlTm9kZXM7XG4gIH07XG4gIC8qKlxyXG4gICAqIFJldHVybnMgYHRydWVgIGlmIHRoaXMgc3RhdGUgbm9kZSBleHBsaWNpdGx5IGhhbmRsZXMgdGhlIGdpdmVuIGV2ZW50LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGV2ZW50IFRoZSBldmVudCBpbiBxdWVzdGlvblxyXG4gICAqL1xuXG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5oYW5kbGVzID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIGV2ZW50VHlwZSA9IGdldEV2ZW50VHlwZShldmVudCk7XG4gICAgcmV0dXJuIHRoaXMuZXZlbnRzLmluY2x1ZGVzKGV2ZW50VHlwZSk7XG4gIH07XG4gIC8qKlxyXG4gICAqIFJlc29sdmVzIHRoZSBnaXZlbiBgc3RhdGVgIHRvIGEgbmV3IGBTdGF0ZWAgaW5zdGFuY2UgcmVsYXRpdmUgdG8gdGhpcyBtYWNoaW5lLlxyXG4gICAqXHJcbiAgICogVGhpcyBlbnN1cmVzIHRoYXQgYC5ldmVudHNgIGFuZCBgLm5leHRFdmVudHNgIHJlcHJlc2VudCB0aGUgY29ycmVjdCB2YWx1ZXMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gc3RhdGUgVGhlIHN0YXRlIHRvIHJlc29sdmVcclxuICAgKi9cblxuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUucmVzb2x2ZVN0YXRlID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgdmFyIHN0YXRlRnJvbUNvbmZpZyA9IHN0YXRlIGluc3RhbmNlb2YgU3RhdGUgPyBzdGF0ZSA6IFN0YXRlLmNyZWF0ZShzdGF0ZSk7XG4gICAgdmFyIGNvbmZpZ3VyYXRpb24gPSBBcnJheS5mcm9tKGdldENvbmZpZ3VyYXRpb24oW10sIHRoaXMuZ2V0U3RhdGVOb2RlcyhzdGF0ZUZyb21Db25maWcudmFsdWUpKSk7XG4gICAgcmV0dXJuIG5ldyBTdGF0ZShfX2Fzc2lnbihfX2Fzc2lnbih7fSwgc3RhdGVGcm9tQ29uZmlnKSwge1xuICAgICAgdmFsdWU6IHRoaXMucmVzb2x2ZShzdGF0ZUZyb21Db25maWcudmFsdWUpLFxuICAgICAgY29uZmlndXJhdGlvbjogY29uZmlndXJhdGlvbixcbiAgICAgIGRvbmU6IGlzSW5GaW5hbFN0YXRlKGNvbmZpZ3VyYXRpb24sIHRoaXMpLFxuICAgICAgdGFnczogZ2V0VGFnc0Zyb21Db25maWd1cmF0aW9uKGNvbmZpZ3VyYXRpb24pLFxuICAgICAgbWFjaGluZTogdGhpcy5tYWNoaW5lXG4gICAgfSkpO1xuICB9O1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUudHJhbnNpdGlvbkxlYWZOb2RlID0gZnVuY3Rpb24gKHN0YXRlVmFsdWUsIHN0YXRlLCBfZXZlbnQpIHtcbiAgICB2YXIgc3RhdGVOb2RlID0gdGhpcy5nZXRTdGF0ZU5vZGUoc3RhdGVWYWx1ZSk7XG4gICAgdmFyIG5leHQgPSBzdGF0ZU5vZGUubmV4dChzdGF0ZSwgX2V2ZW50KTtcblxuICAgIGlmICghbmV4dCB8fCAhbmV4dC50cmFuc2l0aW9ucy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0aGlzLm5leHQoc3RhdGUsIF9ldmVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5leHQ7XG4gIH07XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS50cmFuc2l0aW9uQ29tcG91bmROb2RlID0gZnVuY3Rpb24gKHN0YXRlVmFsdWUsIHN0YXRlLCBfZXZlbnQpIHtcbiAgICB2YXIgc3ViU3RhdGVLZXlzID0gT2JqZWN0LmtleXMoc3RhdGVWYWx1ZSk7XG4gICAgdmFyIHN0YXRlTm9kZSA9IHRoaXMuZ2V0U3RhdGVOb2RlKHN1YlN0YXRlS2V5c1swXSk7XG5cbiAgICB2YXIgbmV4dCA9IHN0YXRlTm9kZS5fdHJhbnNpdGlvbihzdGF0ZVZhbHVlW3N1YlN0YXRlS2V5c1swXV0sIHN0YXRlLCBfZXZlbnQpO1xuXG4gICAgaWYgKCFuZXh0IHx8ICFuZXh0LnRyYW5zaXRpb25zLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHRoaXMubmV4dChzdGF0ZSwgX2V2ZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV4dDtcbiAgfTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLnRyYW5zaXRpb25QYXJhbGxlbE5vZGUgPSBmdW5jdGlvbiAoc3RhdGVWYWx1ZSwgc3RhdGUsIF9ldmVudCkge1xuICAgIHZhciBlXzIsIF9hO1xuXG4gICAgdmFyIHRyYW5zaXRpb25NYXAgPSB7fTtcblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBfYiA9IF9fdmFsdWVzKE9iamVjdC5rZXlzKHN0YXRlVmFsdWUpKSwgX2MgPSBfYi5uZXh0KCk7ICFfYy5kb25lOyBfYyA9IF9iLm5leHQoKSkge1xuICAgICAgICB2YXIgc3ViU3RhdGVLZXkgPSBfYy52YWx1ZTtcbiAgICAgICAgdmFyIHN1YlN0YXRlVmFsdWUgPSBzdGF0ZVZhbHVlW3N1YlN0YXRlS2V5XTtcblxuICAgICAgICBpZiAoIXN1YlN0YXRlVmFsdWUpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzdWJTdGF0ZU5vZGUgPSB0aGlzLmdldFN0YXRlTm9kZShzdWJTdGF0ZUtleSk7XG5cbiAgICAgICAgdmFyIG5leHQgPSBzdWJTdGF0ZU5vZGUuX3RyYW5zaXRpb24oc3ViU3RhdGVWYWx1ZSwgc3RhdGUsIF9ldmVudCk7XG5cbiAgICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgICB0cmFuc2l0aW9uTWFwW3N1YlN0YXRlS2V5XSA9IG5leHQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzJfMSkge1xuICAgICAgZV8yID0ge1xuICAgICAgICBlcnJvcjogZV8yXzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfYyAmJiAhX2MuZG9uZSAmJiAoX2EgPSBfYi5yZXR1cm4pKSBfYS5jYWxsKF9iKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzIpIHRocm93IGVfMi5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgc3RhdGVUcmFuc2l0aW9ucyA9IE9iamVjdC5rZXlzKHRyYW5zaXRpb25NYXApLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZXR1cm4gdHJhbnNpdGlvbk1hcFtrZXldO1xuICAgIH0pO1xuICAgIHZhciBlbmFibGVkVHJhbnNpdGlvbnMgPSBmbGF0dGVuKHN0YXRlVHJhbnNpdGlvbnMubWFwKGZ1bmN0aW9uIChzdCkge1xuICAgICAgcmV0dXJuIHN0LnRyYW5zaXRpb25zO1xuICAgIH0pKTtcbiAgICB2YXIgd2lsbFRyYW5zaXRpb24gPSBzdGF0ZVRyYW5zaXRpb25zLnNvbWUoZnVuY3Rpb24gKHN0KSB7XG4gICAgICByZXR1cm4gc3QudHJhbnNpdGlvbnMubGVuZ3RoID4gMDtcbiAgICB9KTtcblxuICAgIGlmICghd2lsbFRyYW5zaXRpb24pIHtcbiAgICAgIHJldHVybiB0aGlzLm5leHQoc3RhdGUsIF9ldmVudCk7XG4gICAgfVxuXG4gICAgdmFyIGNvbmZpZ3VyYXRpb24gPSBmbGF0dGVuKE9iamVjdC5rZXlzKHRyYW5zaXRpb25NYXApLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZXR1cm4gdHJhbnNpdGlvbk1hcFtrZXldLmNvbmZpZ3VyYXRpb247XG4gICAgfSkpO1xuICAgIHJldHVybiB7XG4gICAgICB0cmFuc2l0aW9uczogZW5hYmxlZFRyYW5zaXRpb25zLFxuICAgICAgZXhpdFNldDogZmxhdHRlbihzdGF0ZVRyYW5zaXRpb25zLm1hcChmdW5jdGlvbiAodCkge1xuICAgICAgICByZXR1cm4gdC5leGl0U2V0O1xuICAgICAgfSkpLFxuICAgICAgY29uZmlndXJhdGlvbjogY29uZmlndXJhdGlvbixcbiAgICAgIHNvdXJjZTogc3RhdGUsXG4gICAgICBhY3Rpb25zOiBmbGF0dGVuKE9iamVjdC5rZXlzKHRyYW5zaXRpb25NYXApLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHJldHVybiB0cmFuc2l0aW9uTWFwW2tleV0uYWN0aW9ucztcbiAgICAgIH0pKVxuICAgIH07XG4gIH07XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5fdHJhbnNpdGlvbiA9IGZ1bmN0aW9uIChzdGF0ZVZhbHVlLCBzdGF0ZSwgX2V2ZW50KSB7XG4gICAgLy8gbGVhZiBub2RlXG4gICAgaWYgKGlzU3RyaW5nKHN0YXRlVmFsdWUpKSB7XG4gICAgICByZXR1cm4gdGhpcy50cmFuc2l0aW9uTGVhZk5vZGUoc3RhdGVWYWx1ZSwgc3RhdGUsIF9ldmVudCk7XG4gICAgfSAvLyBoaWVyYXJjaGljYWwgbm9kZVxuXG5cbiAgICBpZiAoT2JqZWN0LmtleXMoc3RhdGVWYWx1ZSkubGVuZ3RoID09PSAxKSB7XG4gICAgICByZXR1cm4gdGhpcy50cmFuc2l0aW9uQ29tcG91bmROb2RlKHN0YXRlVmFsdWUsIHN0YXRlLCBfZXZlbnQpO1xuICAgIH0gLy8gb3J0aG9nb25hbCBub2RlXG5cblxuICAgIHJldHVybiB0aGlzLnRyYW5zaXRpb25QYXJhbGxlbE5vZGUoc3RhdGVWYWx1ZSwgc3RhdGUsIF9ldmVudCk7XG4gIH07XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5nZXRUcmFuc2l0aW9uRGF0YSA9IGZ1bmN0aW9uIChzdGF0ZSwgZXZlbnQpIHtcbiAgICByZXR1cm4gdGhpcy5fdHJhbnNpdGlvbihzdGF0ZS52YWx1ZSwgc3RhdGUsIHRvU0NYTUxFdmVudChldmVudCkpO1xuICB9O1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uIChzdGF0ZSwgX2V2ZW50KSB7XG4gICAgdmFyIGVfMywgX2E7XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIGV2ZW50TmFtZSA9IF9ldmVudC5uYW1lO1xuICAgIHZhciBhY3Rpb25zID0gW107XG4gICAgdmFyIG5leHRTdGF0ZU5vZGVzID0gW107XG4gICAgdmFyIHNlbGVjdGVkVHJhbnNpdGlvbjtcblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBfYiA9IF9fdmFsdWVzKHRoaXMuZ2V0Q2FuZGlkYXRlcyhldmVudE5hbWUpKSwgX2MgPSBfYi5uZXh0KCk7ICFfYy5kb25lOyBfYyA9IF9iLm5leHQoKSkge1xuICAgICAgICB2YXIgY2FuZGlkYXRlID0gX2MudmFsdWU7XG4gICAgICAgIHZhciBjb25kID0gY2FuZGlkYXRlLmNvbmQsXG4gICAgICAgICAgICBzdGF0ZUluID0gY2FuZGlkYXRlLmluO1xuICAgICAgICB2YXIgcmVzb2x2ZWRDb250ZXh0ID0gc3RhdGUuY29udGV4dDtcbiAgICAgICAgdmFyIGlzSW5TdGF0ZSA9IHN0YXRlSW4gPyBpc1N0cmluZyhzdGF0ZUluKSAmJiBpc1N0YXRlSWQoc3RhdGVJbikgPyAvLyBDaGVjayBpZiBpbiBzdGF0ZSBieSBJRFxuICAgICAgICBzdGF0ZS5tYXRjaGVzKHRvU3RhdGVWYWx1ZSh0aGlzLmdldFN0YXRlTm9kZUJ5SWQoc3RhdGVJbikucGF0aCwgdGhpcy5kZWxpbWl0ZXIpKSA6IC8vIENoZWNrIGlmIGluIHN0YXRlIGJ5IHJlbGF0aXZlIGdyYW5kcGFyZW50XG4gICAgICAgIG1hdGNoZXNTdGF0ZSh0b1N0YXRlVmFsdWUoc3RhdGVJbiwgdGhpcy5kZWxpbWl0ZXIpLCBwYXRoKHRoaXMucGF0aC5zbGljZSgwLCAtMikpKHN0YXRlLnZhbHVlKSkgOiB0cnVlO1xuICAgICAgICB2YXIgZ3VhcmRQYXNzZWQgPSBmYWxzZTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGd1YXJkUGFzc2VkID0gIWNvbmQgfHwgZXZhbHVhdGVHdWFyZCh0aGlzLm1hY2hpbmUsIGNvbmQsIHJlc29sdmVkQ29udGV4dCwgX2V2ZW50LCBzdGF0ZSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuYWJsZSB0byBldmFsdWF0ZSBndWFyZCAnXCIuY29uY2F0KGNvbmQubmFtZSB8fCBjb25kLnR5cGUsIFwiJyBpbiB0cmFuc2l0aW9uIGZvciBldmVudCAnXCIpLmNvbmNhdChldmVudE5hbWUsIFwiJyBpbiBzdGF0ZSBub2RlICdcIikuY29uY2F0KHRoaXMuaWQsIFwiJzpcXG5cIikuY29uY2F0KGVyci5tZXNzYWdlKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZ3VhcmRQYXNzZWQgJiYgaXNJblN0YXRlKSB7XG4gICAgICAgICAgaWYgKGNhbmRpZGF0ZS50YXJnZXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbmV4dFN0YXRlTm9kZXMgPSBjYW5kaWRhdGUudGFyZ2V0O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGFjdGlvbnMucHVzaC5hcHBseShhY3Rpb25zLCBfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQoY2FuZGlkYXRlLmFjdGlvbnMpLCBmYWxzZSkpO1xuICAgICAgICAgIHNlbGVjdGVkVHJhbnNpdGlvbiA9IGNhbmRpZGF0ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfM18xKSB7XG4gICAgICBlXzMgPSB7XG4gICAgICAgIGVycm9yOiBlXzNfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKF9jICYmICFfYy5kb25lICYmIChfYSA9IF9iLnJldHVybikpIF9hLmNhbGwoX2IpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfMykgdGhyb3cgZV8zLmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghc2VsZWN0ZWRUcmFuc2l0aW9uKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmICghbmV4dFN0YXRlTm9kZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0cmFuc2l0aW9uczogW3NlbGVjdGVkVHJhbnNpdGlvbl0sXG4gICAgICAgIGV4aXRTZXQ6IFtdLFxuICAgICAgICBjb25maWd1cmF0aW9uOiBzdGF0ZS52YWx1ZSA/IFt0aGlzXSA6IFtdLFxuICAgICAgICBzb3VyY2U6IHN0YXRlLFxuICAgICAgICBhY3Rpb25zOiBhY3Rpb25zXG4gICAgICB9O1xuICAgIH1cblxuICAgIHZhciBhbGxOZXh0U3RhdGVOb2RlcyA9IGZsYXR0ZW4obmV4dFN0YXRlTm9kZXMubWFwKGZ1bmN0aW9uIChzdGF0ZU5vZGUpIHtcbiAgICAgIHJldHVybiBfdGhpcy5nZXRSZWxhdGl2ZVN0YXRlTm9kZXMoc3RhdGVOb2RlLCBzdGF0ZS5oaXN0b3J5VmFsdWUpO1xuICAgIH0pKTtcbiAgICB2YXIgaXNJbnRlcm5hbCA9ICEhc2VsZWN0ZWRUcmFuc2l0aW9uLmludGVybmFsO1xuICAgIHJldHVybiB7XG4gICAgICB0cmFuc2l0aW9uczogW3NlbGVjdGVkVHJhbnNpdGlvbl0sXG4gICAgICBleGl0U2V0OiBpc0ludGVybmFsID8gW10gOiBmbGF0dGVuKG5leHRTdGF0ZU5vZGVzLm1hcChmdW5jdGlvbiAodGFyZ2V0Tm9kZSkge1xuICAgICAgICByZXR1cm4gX3RoaXMuZ2V0UG90ZW50aWFsbHlSZWVudGVyaW5nTm9kZXModGFyZ2V0Tm9kZSk7XG4gICAgICB9KSksXG4gICAgICBjb25maWd1cmF0aW9uOiBhbGxOZXh0U3RhdGVOb2RlcyxcbiAgICAgIHNvdXJjZTogc3RhdGUsXG4gICAgICBhY3Rpb25zOiBhY3Rpb25zXG4gICAgfTtcbiAgfTsgLy8gZXZlbiB0aG91Z2ggdGhlIG5hbWUgb2YgdGhpcyBmdW5jdGlvbiBtZW50aW9ucyByZWVudHJ5IG5vZGVzXG4gIC8vIHdlIGFyZSBwdXNoaW5nIGl0cyByZXN1bHQgaW50byBgZXhpdFNldGBcbiAgLy8gdGhhdCdzIGJlY2F1c2Ugd2hhdCB3ZSBleGl0IG1pZ2h0IGJlIHJlZW50ZXJlZCAoaXQncyBhbiBpbnZhcmlhbnQgb2YgcmVlbnRyYW5jeSlcblxuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZ2V0UG90ZW50aWFsbHlSZWVudGVyaW5nTm9kZXMgPSBmdW5jdGlvbiAodGFyZ2V0Tm9kZSkge1xuICAgIGlmICh0aGlzLm9yZGVyIDwgdGFyZ2V0Tm9kZS5vcmRlcikge1xuICAgICAgcmV0dXJuIFt0aGlzXTtcbiAgICB9XG5cbiAgICB2YXIgbm9kZXMgPSBbXTtcbiAgICB2YXIgbWFya2VyID0gdGhpcztcbiAgICB2YXIgcG9zc2libGVBbmNlc3RvciA9IHRhcmdldE5vZGU7XG5cbiAgICB3aGlsZSAobWFya2VyICYmIG1hcmtlciAhPT0gcG9zc2libGVBbmNlc3Rvcikge1xuICAgICAgbm9kZXMucHVzaChtYXJrZXIpO1xuICAgICAgbWFya2VyID0gbWFya2VyLnBhcmVudDtcbiAgICB9XG5cbiAgICBpZiAobWFya2VyICE9PSBwb3NzaWJsZUFuY2VzdG9yKSB7XG4gICAgICAvLyB3ZSBuZXZlciBnb3QgdG8gYHBvc3NpYmxlQW5jZXN0b3JgLCB0aGVyZWZvcmUgdGhlIGluaXRpYWwgYG1hcmtlcmAgXCJlc2NhcGVzXCIgaXRcbiAgICAgIC8vIGl0J3MgaW4gYSBkaWZmZXJlbnQgcGFydCBvZiB0aGUgdHJlZSBzbyBubyBzdGF0ZXMgd2lsbCBiZSByZWVudGVyZWQgZm9yIHN1Y2ggYW4gZXh0ZXJuYWwgdHJhbnNpdGlvblxuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIG5vZGVzLnB1c2gocG9zc2libGVBbmNlc3Rvcik7XG4gICAgcmV0dXJuIG5vZGVzO1xuICB9O1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZ2V0QWN0aW9ucyA9IGZ1bmN0aW9uIChyZXNvbHZlZENvbmZpZywgaXNEb25lLCB0cmFuc2l0aW9uLCBjdXJyZW50Q29udGV4dCwgX2V2ZW50LCBwcmV2U3RhdGUsIHByZWRpY3RhYmxlRXhlYykge1xuICAgIHZhciBlXzQsIF9hLCBlXzUsIF9iO1xuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBwcmV2Q29uZmlnID0gcHJldlN0YXRlID8gZ2V0Q29uZmlndXJhdGlvbihbXSwgdGhpcy5nZXRTdGF0ZU5vZGVzKHByZXZTdGF0ZS52YWx1ZSkpIDogW107XG4gICAgdmFyIGVudHJ5U2V0ID0gbmV3IFNldCgpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIF9jID0gX192YWx1ZXMoQXJyYXkuZnJvbShyZXNvbHZlZENvbmZpZykuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICByZXR1cm4gYS5vcmRlciAtIGIub3JkZXI7XG4gICAgICB9KSksIF9kID0gX2MubmV4dCgpOyAhX2QuZG9uZTsgX2QgPSBfYy5uZXh0KCkpIHtcbiAgICAgICAgdmFyIHNuID0gX2QudmFsdWU7XG5cbiAgICAgICAgaWYgKCFoYXMocHJldkNvbmZpZywgc24pIHx8IGhhcyh0cmFuc2l0aW9uLmV4aXRTZXQsIHNuKSB8fCBzbi5wYXJlbnQgJiYgZW50cnlTZXQuaGFzKHNuLnBhcmVudCkpIHtcbiAgICAgICAgICBlbnRyeVNldC5hZGQoc24pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV80XzEpIHtcbiAgICAgIGVfNCA9IHtcbiAgICAgICAgZXJyb3I6IGVfNF8xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoX2QgJiYgIV9kLmRvbmUgJiYgKF9hID0gX2MucmV0dXJuKSkgX2EuY2FsbChfYyk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV80KSB0aHJvdyBlXzQuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIHByZXZDb25maWdfMSA9IF9fdmFsdWVzKHByZXZDb25maWcpLCBwcmV2Q29uZmlnXzFfMSA9IHByZXZDb25maWdfMS5uZXh0KCk7ICFwcmV2Q29uZmlnXzFfMS5kb25lOyBwcmV2Q29uZmlnXzFfMSA9IHByZXZDb25maWdfMS5uZXh0KCkpIHtcbiAgICAgICAgdmFyIHNuID0gcHJldkNvbmZpZ18xXzEudmFsdWU7XG5cbiAgICAgICAgaWYgKCFoYXMocmVzb2x2ZWRDb25maWcsIHNuKSB8fCBoYXModHJhbnNpdGlvbi5leGl0U2V0LCBzbi5wYXJlbnQpKSB7XG4gICAgICAgICAgdHJhbnNpdGlvbi5leGl0U2V0LnB1c2goc24pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV81XzEpIHtcbiAgICAgIGVfNSA9IHtcbiAgICAgICAgZXJyb3I6IGVfNV8xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAocHJldkNvbmZpZ18xXzEgJiYgIXByZXZDb25maWdfMV8xLmRvbmUgJiYgKF9iID0gcHJldkNvbmZpZ18xLnJldHVybikpIF9iLmNhbGwocHJldkNvbmZpZ18xKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzUpIHRocm93IGVfNS5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0cmFuc2l0aW9uLmV4aXRTZXQuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIGIub3JkZXIgLSBhLm9yZGVyO1xuICAgIH0pO1xuICAgIHZhciBlbnRyeVN0YXRlcyA9IEFycmF5LmZyb20oZW50cnlTZXQpLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBhLm9yZGVyIC0gYi5vcmRlcjtcbiAgICB9KTtcbiAgICB2YXIgZXhpdFN0YXRlcyA9IG5ldyBTZXQodHJhbnNpdGlvbi5leGl0U2V0KTtcbiAgICB2YXIgZG9uZUV2ZW50cyA9IGZsYXR0ZW4oZW50cnlTdGF0ZXMubWFwKGZ1bmN0aW9uIChzbikge1xuICAgICAgdmFyIGV2ZW50cyA9IFtdO1xuXG4gICAgICBpZiAoc24udHlwZSAhPT0gJ2ZpbmFsJykge1xuICAgICAgICByZXR1cm4gZXZlbnRzO1xuICAgICAgfVxuXG4gICAgICB2YXIgcGFyZW50ID0gc24ucGFyZW50O1xuXG4gICAgICBpZiAoIXBhcmVudC5wYXJlbnQpIHtcbiAgICAgICAgcmV0dXJuIGV2ZW50cztcbiAgICAgIH1cblxuICAgICAgZXZlbnRzLnB1c2goZG9uZShzbi5pZCwgc24uZG9uZURhdGEpLCAvLyBUT0RPOiBkZXByZWNhdGUgLSBmaW5hbCBzdGF0ZXMgc2hvdWxkIG5vdCBlbWl0IGRvbmUgZXZlbnRzIGZvciB0aGVpciBvd24gc3RhdGUuXG4gICAgICBkb25lKHBhcmVudC5pZCwgc24uZG9uZURhdGEgPyBtYXBDb250ZXh0KHNuLmRvbmVEYXRhLCBjdXJyZW50Q29udGV4dCwgX2V2ZW50KSA6IHVuZGVmaW5lZCkpO1xuICAgICAgdmFyIGdyYW5kcGFyZW50ID0gcGFyZW50LnBhcmVudDtcblxuICAgICAgaWYgKGdyYW5kcGFyZW50LnR5cGUgPT09ICdwYXJhbGxlbCcpIHtcbiAgICAgICAgaWYgKGdldENoaWxkcmVuKGdyYW5kcGFyZW50KS5ldmVyeShmdW5jdGlvbiAocGFyZW50Tm9kZSkge1xuICAgICAgICAgIHJldHVybiBpc0luRmluYWxTdGF0ZSh0cmFuc2l0aW9uLmNvbmZpZ3VyYXRpb24sIHBhcmVudE5vZGUpO1xuICAgICAgICB9KSkge1xuICAgICAgICAgIGV2ZW50cy5wdXNoKGRvbmUoZ3JhbmRwYXJlbnQuaWQpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZXZlbnRzO1xuICAgIH0pKTtcbiAgICB2YXIgZW50cnlBY3Rpb25zID0gZW50cnlTdGF0ZXMubWFwKGZ1bmN0aW9uIChzdGF0ZU5vZGUpIHtcbiAgICAgIHZhciBlbnRyeUFjdGlvbnMgPSBzdGF0ZU5vZGUub25FbnRyeTtcbiAgICAgIHZhciBpbnZva2VBY3Rpb25zID0gc3RhdGVOb2RlLmFjdGl2aXRpZXMubWFwKGZ1bmN0aW9uIChhY3Rpdml0eSkge1xuICAgICAgICByZXR1cm4gc3RhcnQoYWN0aXZpdHkpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiAnZW50cnknLFxuICAgICAgICBhY3Rpb25zOiB0b0FjdGlvbk9iamVjdHMocHJlZGljdGFibGVFeGVjID8gX19zcHJlYWRBcnJheShfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQoZW50cnlBY3Rpb25zKSwgZmFsc2UpLCBfX3JlYWQoaW52b2tlQWN0aW9ucyksIGZhbHNlKSA6IF9fc3ByZWFkQXJyYXkoX19zcHJlYWRBcnJheShbXSwgX19yZWFkKGludm9rZUFjdGlvbnMpLCBmYWxzZSksIF9fcmVhZChlbnRyeUFjdGlvbnMpLCBmYWxzZSksIF90aGlzLm1hY2hpbmUub3B0aW9ucy5hY3Rpb25zKVxuICAgICAgfTtcbiAgICB9KS5jb25jYXQoe1xuICAgICAgdHlwZTogJ3N0YXRlX2RvbmUnLFxuICAgICAgYWN0aW9uczogZG9uZUV2ZW50cy5tYXAoZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHJldHVybiByYWlzZShldmVudCk7XG4gICAgICB9KVxuICAgIH0pO1xuICAgIHZhciBleGl0QWN0aW9ucyA9IEFycmF5LmZyb20oZXhpdFN0YXRlcykubWFwKGZ1bmN0aW9uIChzdGF0ZU5vZGUpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6ICdleGl0JyxcbiAgICAgICAgYWN0aW9uczogdG9BY3Rpb25PYmplY3RzKF9fc3ByZWFkQXJyYXkoX19zcHJlYWRBcnJheShbXSwgX19yZWFkKHN0YXRlTm9kZS5vbkV4aXQpLCBmYWxzZSksIF9fcmVhZChzdGF0ZU5vZGUuYWN0aXZpdGllcy5tYXAoZnVuY3Rpb24gKGFjdGl2aXR5KSB7XG4gICAgICAgICAgcmV0dXJuIHN0b3AoYWN0aXZpdHkpO1xuICAgICAgICB9KSksIGZhbHNlKSwgX3RoaXMubWFjaGluZS5vcHRpb25zLmFjdGlvbnMpXG4gICAgICB9O1xuICAgIH0pO1xuICAgIHZhciBhY3Rpb25zID0gZXhpdEFjdGlvbnMuY29uY2F0KHtcbiAgICAgIHR5cGU6ICd0cmFuc2l0aW9uJyxcbiAgICAgIGFjdGlvbnM6IHRvQWN0aW9uT2JqZWN0cyh0cmFuc2l0aW9uLmFjdGlvbnMsIHRoaXMubWFjaGluZS5vcHRpb25zLmFjdGlvbnMpXG4gICAgfSkuY29uY2F0KGVudHJ5QWN0aW9ucyk7XG5cbiAgICBpZiAoaXNEb25lKSB7XG4gICAgICB2YXIgc3RvcEFjdGlvbnMgPSB0b0FjdGlvbk9iamVjdHMoZmxhdHRlbihfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQocmVzb2x2ZWRDb25maWcpLCBmYWxzZSkuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICByZXR1cm4gYi5vcmRlciAtIGEub3JkZXI7XG4gICAgICB9KS5tYXAoZnVuY3Rpb24gKHN0YXRlTm9kZSkge1xuICAgICAgICByZXR1cm4gc3RhdGVOb2RlLm9uRXhpdDtcbiAgICAgIH0pKSwgdGhpcy5tYWNoaW5lLm9wdGlvbnMuYWN0aW9ucykuZmlsdGVyKGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuICFpc1JhaXNhYmxlQWN0aW9uKGFjdGlvbik7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBhY3Rpb25zLmNvbmNhdCh7XG4gICAgICAgIHR5cGU6ICdzdG9wJyxcbiAgICAgICAgYWN0aW9uczogc3RvcEFjdGlvbnNcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBhY3Rpb25zO1xuICB9O1xuICAvKipcclxuICAgKiBEZXRlcm1pbmVzIHRoZSBuZXh0IHN0YXRlIGdpdmVuIHRoZSBjdXJyZW50IGBzdGF0ZWAgYW5kIHNlbnQgYGV2ZW50YC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBzdGF0ZSBUaGUgY3VycmVudCBTdGF0ZSBpbnN0YW5jZSBvciBzdGF0ZSB2YWx1ZVxyXG4gICAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQgdGhhdCB3YXMgc2VudCBhdCB0aGUgY3VycmVudCBzdGF0ZVxyXG4gICAqIEBwYXJhbSBjb250ZXh0IFRoZSBjdXJyZW50IGNvbnRleHQgKGV4dGVuZGVkIHN0YXRlKSBvZiB0aGUgY3VycmVudCBzdGF0ZVxyXG4gICAqL1xuXG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS50cmFuc2l0aW9uID0gZnVuY3Rpb24gKHN0YXRlLCBldmVudCwgY29udGV4dCwgZXhlYykge1xuICAgIGlmIChzdGF0ZSA9PT0gdm9pZCAwKSB7XG4gICAgICBzdGF0ZSA9IHRoaXMuaW5pdGlhbFN0YXRlO1xuICAgIH1cblxuICAgIHZhciBfZXZlbnQgPSB0b1NDWE1MRXZlbnQoZXZlbnQpO1xuXG4gICAgdmFyIGN1cnJlbnRTdGF0ZTtcblxuICAgIGlmIChzdGF0ZSBpbnN0YW5jZW9mIFN0YXRlKSB7XG4gICAgICBjdXJyZW50U3RhdGUgPSBjb250ZXh0ID09PSB1bmRlZmluZWQgPyBzdGF0ZSA6IHRoaXMucmVzb2x2ZVN0YXRlKFN0YXRlLmZyb20oc3RhdGUsIGNvbnRleHQpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHJlc29sdmVkU3RhdGVWYWx1ZSA9IGlzU3RyaW5nKHN0YXRlKSA/IHRoaXMucmVzb2x2ZShwYXRoVG9TdGF0ZVZhbHVlKHRoaXMuZ2V0UmVzb2x2ZWRQYXRoKHN0YXRlKSkpIDogdGhpcy5yZXNvbHZlKHN0YXRlKTtcbiAgICAgIHZhciByZXNvbHZlZENvbnRleHQgPSBjb250ZXh0ICE9PSBudWxsICYmIGNvbnRleHQgIT09IHZvaWQgMCA/IGNvbnRleHQgOiB0aGlzLm1hY2hpbmUuY29udGV4dDtcbiAgICAgIGN1cnJlbnRTdGF0ZSA9IHRoaXMucmVzb2x2ZVN0YXRlKFN0YXRlLmZyb20ocmVzb2x2ZWRTdGF0ZVZhbHVlLCByZXNvbHZlZENvbnRleHQpKTtcbiAgICB9XG5cbiAgICBpZiAoIUlTX1BST0RVQ1RJT04gJiYgX2V2ZW50Lm5hbWUgPT09IFdJTERDQVJEKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBbiBldmVudCBjYW5ub3QgaGF2ZSB0aGUgd2lsZGNhcmQgdHlwZSAoJ1wiLmNvbmNhdChXSUxEQ0FSRCwgXCInKVwiKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc3RyaWN0KSB7XG4gICAgICBpZiAoIXRoaXMuZXZlbnRzLmluY2x1ZGVzKF9ldmVudC5uYW1lKSAmJiAhaXNCdWlsdEluRXZlbnQoX2V2ZW50Lm5hbWUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1hY2hpbmUgJ1wiLmNvbmNhdCh0aGlzLmlkLCBcIicgZG9lcyBub3QgYWNjZXB0IGV2ZW50ICdcIikuY29uY2F0KF9ldmVudC5uYW1lLCBcIidcIikpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBzdGF0ZVRyYW5zaXRpb24gPSB0aGlzLl90cmFuc2l0aW9uKGN1cnJlbnRTdGF0ZS52YWx1ZSwgY3VycmVudFN0YXRlLCBfZXZlbnQpIHx8IHtcbiAgICAgIHRyYW5zaXRpb25zOiBbXSxcbiAgICAgIGNvbmZpZ3VyYXRpb246IFtdLFxuICAgICAgZXhpdFNldDogW10sXG4gICAgICBzb3VyY2U6IGN1cnJlbnRTdGF0ZSxcbiAgICAgIGFjdGlvbnM6IFtdXG4gICAgfTtcbiAgICB2YXIgcHJldkNvbmZpZyA9IGdldENvbmZpZ3VyYXRpb24oW10sIHRoaXMuZ2V0U3RhdGVOb2RlcyhjdXJyZW50U3RhdGUudmFsdWUpKTtcbiAgICB2YXIgcmVzb2x2ZWRDb25maWcgPSBzdGF0ZVRyYW5zaXRpb24uY29uZmlndXJhdGlvbi5sZW5ndGggPyBnZXRDb25maWd1cmF0aW9uKHByZXZDb25maWcsIHN0YXRlVHJhbnNpdGlvbi5jb25maWd1cmF0aW9uKSA6IHByZXZDb25maWc7XG4gICAgc3RhdGVUcmFuc2l0aW9uLmNvbmZpZ3VyYXRpb24gPSBfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQocmVzb2x2ZWRDb25maWcpLCBmYWxzZSk7XG4gICAgcmV0dXJuIHRoaXMucmVzb2x2ZVRyYW5zaXRpb24oc3RhdGVUcmFuc2l0aW9uLCBjdXJyZW50U3RhdGUsIGN1cnJlbnRTdGF0ZS5jb250ZXh0LCBleGVjLCBfZXZlbnQpO1xuICB9O1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUucmVzb2x2ZVJhaXNlZFRyYW5zaXRpb24gPSBmdW5jdGlvbiAoc3RhdGUsIF9ldmVudCwgb3JpZ2luYWxFdmVudCwgcHJlZGljdGFibGVFeGVjKSB7XG4gICAgdmFyIF9hO1xuXG4gICAgdmFyIGN1cnJlbnRBY3Rpb25zID0gc3RhdGUuYWN0aW9ucztcbiAgICBzdGF0ZSA9IHRoaXMudHJhbnNpdGlvbihzdGF0ZSwgX2V2ZW50LCB1bmRlZmluZWQsIHByZWRpY3RhYmxlRXhlYyk7IC8vIFNhdmUgb3JpZ2luYWwgZXZlbnQgdG8gc3RhdGVcbiAgICAvLyBUT0RPOiB0aGlzIHNob3VsZCBiZSB0aGUgcmFpc2VkIGV2ZW50ISBEZWxldGUgaW4gVjUgKGJyZWFraW5nKVxuXG4gICAgc3RhdGUuX2V2ZW50ID0gb3JpZ2luYWxFdmVudDtcbiAgICBzdGF0ZS5ldmVudCA9IG9yaWdpbmFsRXZlbnQuZGF0YTtcblxuICAgIChfYSA9IHN0YXRlLmFjdGlvbnMpLnVuc2hpZnQuYXBwbHkoX2EsIF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChjdXJyZW50QWN0aW9ucyksIGZhbHNlKSk7XG5cbiAgICByZXR1cm4gc3RhdGU7XG4gIH07XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5yZXNvbHZlVHJhbnNpdGlvbiA9IGZ1bmN0aW9uIChzdGF0ZVRyYW5zaXRpb24sIGN1cnJlbnRTdGF0ZSwgY29udGV4dCwgcHJlZGljdGFibGVFeGVjLCBfZXZlbnQpIHtcbiAgICB2YXIgZV82LCBfYSwgZV83LCBfYjtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAoX2V2ZW50ID09PSB2b2lkIDApIHtcbiAgICAgIF9ldmVudCA9IGluaXRFdmVudDtcbiAgICB9XG5cbiAgICB2YXIgY29uZmlndXJhdGlvbiA9IHN0YXRlVHJhbnNpdGlvbi5jb25maWd1cmF0aW9uOyAvLyBUcmFuc2l0aW9uIHdpbGwgXCJhcHBseVwiIGlmOlxuICAgIC8vIC0gdGhpcyBpcyB0aGUgaW5pdGlhbCBzdGF0ZSAodGhlcmUgaXMgbm8gY3VycmVudCBzdGF0ZSlcbiAgICAvLyAtIE9SIHRoZXJlIGFyZSB0cmFuc2l0aW9uc1xuXG4gICAgdmFyIHdpbGxUcmFuc2l0aW9uID0gIWN1cnJlbnRTdGF0ZSB8fCBzdGF0ZVRyYW5zaXRpb24udHJhbnNpdGlvbnMubGVuZ3RoID4gMDtcbiAgICB2YXIgcmVzb2x2ZWRDb25maWd1cmF0aW9uID0gd2lsbFRyYW5zaXRpb24gPyBzdGF0ZVRyYW5zaXRpb24uY29uZmlndXJhdGlvbiA6IGN1cnJlbnRTdGF0ZSA/IGN1cnJlbnRTdGF0ZS5jb25maWd1cmF0aW9uIDogW107XG4gICAgdmFyIGlzRG9uZSA9IGlzSW5GaW5hbFN0YXRlKHJlc29sdmVkQ29uZmlndXJhdGlvbiwgdGhpcyk7XG4gICAgdmFyIHJlc29sdmVkU3RhdGVWYWx1ZSA9IHdpbGxUcmFuc2l0aW9uID8gZ2V0VmFsdWUodGhpcy5tYWNoaW5lLCBjb25maWd1cmF0aW9uKSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgaGlzdG9yeVZhbHVlID0gY3VycmVudFN0YXRlID8gY3VycmVudFN0YXRlLmhpc3RvcnlWYWx1ZSA/IGN1cnJlbnRTdGF0ZS5oaXN0b3J5VmFsdWUgOiBzdGF0ZVRyYW5zaXRpb24uc291cmNlID8gdGhpcy5tYWNoaW5lLmhpc3RvcnlWYWx1ZShjdXJyZW50U3RhdGUudmFsdWUpIDogdW5kZWZpbmVkIDogdW5kZWZpbmVkO1xuICAgIHZhciBhY3Rpb25CbG9ja3MgPSB0aGlzLmdldEFjdGlvbnMobmV3IFNldChyZXNvbHZlZENvbmZpZ3VyYXRpb24pLCBpc0RvbmUsIHN0YXRlVHJhbnNpdGlvbiwgY29udGV4dCwgX2V2ZW50LCBjdXJyZW50U3RhdGUsIHByZWRpY3RhYmxlRXhlYyk7XG4gICAgdmFyIGFjdGl2aXRpZXMgPSBjdXJyZW50U3RhdGUgPyBfX2Fzc2lnbih7fSwgY3VycmVudFN0YXRlLmFjdGl2aXRpZXMpIDoge307XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgYWN0aW9uQmxvY2tzXzEgPSBfX3ZhbHVlcyhhY3Rpb25CbG9ja3MpLCBhY3Rpb25CbG9ja3NfMV8xID0gYWN0aW9uQmxvY2tzXzEubmV4dCgpOyAhYWN0aW9uQmxvY2tzXzFfMS5kb25lOyBhY3Rpb25CbG9ja3NfMV8xID0gYWN0aW9uQmxvY2tzXzEubmV4dCgpKSB7XG4gICAgICAgIHZhciBibG9jayA9IGFjdGlvbkJsb2Nrc18xXzEudmFsdWU7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmb3IgKHZhciBfYyA9IChlXzcgPSB2b2lkIDAsIF9fdmFsdWVzKGJsb2NrLmFjdGlvbnMpKSwgX2QgPSBfYy5uZXh0KCk7ICFfZC5kb25lOyBfZCA9IF9jLm5leHQoKSkge1xuICAgICAgICAgICAgdmFyIGFjdGlvbiA9IF9kLnZhbHVlO1xuXG4gICAgICAgICAgICBpZiAoYWN0aW9uLnR5cGUgPT09IHN0YXJ0JDEpIHtcbiAgICAgICAgICAgICAgYWN0aXZpdGllc1thY3Rpb24uYWN0aXZpdHkuaWQgfHwgYWN0aW9uLmFjdGl2aXR5LnR5cGVdID0gYWN0aW9uO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhY3Rpb24udHlwZSA9PT0gc3RvcCQxKSB7XG4gICAgICAgICAgICAgIGFjdGl2aXRpZXNbYWN0aW9uLmFjdGl2aXR5LmlkIHx8IGFjdGlvbi5hY3Rpdml0eS50eXBlXSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZV83XzEpIHtcbiAgICAgICAgICBlXzcgPSB7XG4gICAgICAgICAgICBlcnJvcjogZV83XzFcbiAgICAgICAgICB9O1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoX2QgJiYgIV9kLmRvbmUgJiYgKF9iID0gX2MucmV0dXJuKSkgX2IuY2FsbChfYyk7XG4gICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIGlmIChlXzcpIHRocm93IGVfNy5lcnJvcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzZfMSkge1xuICAgICAgZV82ID0ge1xuICAgICAgICBlcnJvcjogZV82XzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChhY3Rpb25CbG9ja3NfMV8xICYmICFhY3Rpb25CbG9ja3NfMV8xLmRvbmUgJiYgKF9hID0gYWN0aW9uQmxvY2tzXzEucmV0dXJuKSkgX2EuY2FsbChhY3Rpb25CbG9ja3NfMSk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV82KSB0aHJvdyBlXzYuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIF9lID0gX19yZWFkKHJlc29sdmVBY3Rpb25zKHRoaXMsIGN1cnJlbnRTdGF0ZSwgY29udGV4dCwgX2V2ZW50LCBhY3Rpb25CbG9ja3MsIHByZWRpY3RhYmxlRXhlYywgdGhpcy5tYWNoaW5lLmNvbmZpZy5wcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50cyB8fCB0aGlzLm1hY2hpbmUuY29uZmlnLnByZXNlcnZlQWN0aW9uT3JkZXIpLCAyKSxcbiAgICAgICAgcmVzb2x2ZWRBY3Rpb25zID0gX2VbMF0sXG4gICAgICAgIHVwZGF0ZWRDb250ZXh0ID0gX2VbMV07XG5cbiAgICB2YXIgX2YgPSBfX3JlYWQocGFydGl0aW9uKHJlc29sdmVkQWN0aW9ucywgaXNSYWlzYWJsZUFjdGlvbiksIDIpLFxuICAgICAgICByYWlzZWRFdmVudHMgPSBfZlswXSxcbiAgICAgICAgbm9uUmFpc2VkQWN0aW9ucyA9IF9mWzFdO1xuXG4gICAgdmFyIGludm9rZUFjdGlvbnMgPSByZXNvbHZlZEFjdGlvbnMuZmlsdGVyKGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgIHZhciBfYTtcblxuICAgICAgcmV0dXJuIGFjdGlvbi50eXBlID09PSBzdGFydCQxICYmICgoX2EgPSBhY3Rpb24uYWN0aXZpdHkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS50eXBlKSA9PT0gaW52b2tlO1xuICAgIH0pO1xuICAgIHZhciBjaGlsZHJlbiA9IGludm9rZUFjdGlvbnMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIGFjdGlvbikge1xuICAgICAgYWNjW2FjdGlvbi5hY3Rpdml0eS5pZF0gPSBjcmVhdGVJbnZvY2FibGVBY3RvcihhY3Rpb24uYWN0aXZpdHksIF90aGlzLm1hY2hpbmUsIHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQpO1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCBjdXJyZW50U3RhdGUgPyBfX2Fzc2lnbih7fSwgY3VycmVudFN0YXRlLmNoaWxkcmVuKSA6IHt9KTtcbiAgICB2YXIgbmV4dFN0YXRlID0gbmV3IFN0YXRlKHtcbiAgICAgIHZhbHVlOiByZXNvbHZlZFN0YXRlVmFsdWUgfHwgY3VycmVudFN0YXRlLnZhbHVlLFxuICAgICAgY29udGV4dDogdXBkYXRlZENvbnRleHQsXG4gICAgICBfZXZlbnQ6IF9ldmVudCxcbiAgICAgIC8vIFBlcnNpc3QgX3Nlc3Npb25pZCBiZXR3ZWVuIHN0YXRlc1xuICAgICAgX3Nlc3Npb25pZDogY3VycmVudFN0YXRlID8gY3VycmVudFN0YXRlLl9zZXNzaW9uaWQgOiBudWxsLFxuICAgICAgaGlzdG9yeVZhbHVlOiByZXNvbHZlZFN0YXRlVmFsdWUgPyBoaXN0b3J5VmFsdWUgPyB1cGRhdGVIaXN0b3J5VmFsdWUoaGlzdG9yeVZhbHVlLCByZXNvbHZlZFN0YXRlVmFsdWUpIDogdW5kZWZpbmVkIDogY3VycmVudFN0YXRlID8gY3VycmVudFN0YXRlLmhpc3RvcnlWYWx1ZSA6IHVuZGVmaW5lZCxcbiAgICAgIGhpc3Rvcnk6ICFyZXNvbHZlZFN0YXRlVmFsdWUgfHwgc3RhdGVUcmFuc2l0aW9uLnNvdXJjZSA/IGN1cnJlbnRTdGF0ZSA6IHVuZGVmaW5lZCxcbiAgICAgIGFjdGlvbnM6IHJlc29sdmVkU3RhdGVWYWx1ZSA/IG5vblJhaXNlZEFjdGlvbnMgOiBbXSxcbiAgICAgIGFjdGl2aXRpZXM6IHJlc29sdmVkU3RhdGVWYWx1ZSA/IGFjdGl2aXRpZXMgOiBjdXJyZW50U3RhdGUgPyBjdXJyZW50U3RhdGUuYWN0aXZpdGllcyA6IHt9LFxuICAgICAgZXZlbnRzOiBbXSxcbiAgICAgIGNvbmZpZ3VyYXRpb246IHJlc29sdmVkQ29uZmlndXJhdGlvbixcbiAgICAgIHRyYW5zaXRpb25zOiBzdGF0ZVRyYW5zaXRpb24udHJhbnNpdGlvbnMsXG4gICAgICBjaGlsZHJlbjogY2hpbGRyZW4sXG4gICAgICBkb25lOiBpc0RvbmUsXG4gICAgICB0YWdzOiBnZXRUYWdzRnJvbUNvbmZpZ3VyYXRpb24ocmVzb2x2ZWRDb25maWd1cmF0aW9uKSxcbiAgICAgIG1hY2hpbmU6IHRoaXNcbiAgICB9KTtcbiAgICB2YXIgZGlkVXBkYXRlQ29udGV4dCA9IGNvbnRleHQgIT09IHVwZGF0ZWRDb250ZXh0O1xuICAgIG5leHRTdGF0ZS5jaGFuZ2VkID0gX2V2ZW50Lm5hbWUgPT09IHVwZGF0ZSB8fCBkaWRVcGRhdGVDb250ZXh0OyAvLyBEaXNwb3NlIG9mIHBlbnVsdGltYXRlIGhpc3RvcmllcyB0byBwcmV2ZW50IG1lbW9yeSBsZWFrc1xuXG4gICAgdmFyIGhpc3RvcnkgPSBuZXh0U3RhdGUuaGlzdG9yeTtcblxuICAgIGlmIChoaXN0b3J5KSB7XG4gICAgICBkZWxldGUgaGlzdG9yeS5oaXN0b3J5O1xuICAgIH0gLy8gVGhlcmUgYXJlIHRyYW5zaWVudCB0cmFuc2l0aW9ucyBpZiB0aGUgbWFjaGluZSBpcyBub3QgaW4gYSBmaW5hbCBzdGF0ZVxuICAgIC8vIGFuZCBpZiBzb21lIG9mIHRoZSBzdGF0ZSBub2RlcyBoYXZlIHRyYW5zaWVudCAoXCJhbHdheXNcIikgdHJhbnNpdGlvbnMuXG5cblxuICAgIHZhciBoYXNBbHdheXNUcmFuc2l0aW9ucyA9ICFpc0RvbmUgJiYgKHRoaXMuX3RyYW5zaWVudCB8fCBjb25maWd1cmF0aW9uLnNvbWUoZnVuY3Rpb24gKHN0YXRlTm9kZSkge1xuICAgICAgcmV0dXJuIHN0YXRlTm9kZS5fdHJhbnNpZW50O1xuICAgIH0pKTsgLy8gSWYgdGhlcmUgYXJlIG5vIGVuYWJsZWQgdHJhbnNpdGlvbnMsIGNoZWNrIGlmIHRoZXJlIGFyZSB0cmFuc2llbnQgdHJhbnNpdGlvbnMuXG4gICAgLy8gSWYgdGhlcmUgYXJlIHRyYW5zaWVudCB0cmFuc2l0aW9ucywgY29udGludWUgY2hlY2tpbmcgZm9yIG1vcmUgdHJhbnNpdGlvbnNcbiAgICAvLyBiZWNhdXNlIGFuIHRyYW5zaWVudCB0cmFuc2l0aW9uIHNob3VsZCBiZSB0cmlnZ2VyZWQgZXZlbiBpZiB0aGVyZSBhcmUgbm9cbiAgICAvLyBlbmFibGVkIHRyYW5zaXRpb25zLlxuICAgIC8vXG4gICAgLy8gSWYgd2UncmUgYWxyZWFkeSB3b3JraW5nIG9uIGFuIHRyYW5zaWVudCB0cmFuc2l0aW9uIHRoZW4gc3RvcCB0byBwcmV2ZW50IGFuIGluZmluaXRlIGxvb3AuXG4gICAgLy9cbiAgICAvLyBPdGhlcndpc2UsIGlmIHRoZXJlIGFyZSBubyBlbmFibGVkIG5vciB0cmFuc2llbnQgdHJhbnNpdGlvbnMsIHdlIGFyZSBkb25lLlxuXG4gICAgaWYgKCF3aWxsVHJhbnNpdGlvbiAmJiAoIWhhc0Fsd2F5c1RyYW5zaXRpb25zIHx8IF9ldmVudC5uYW1lID09PSBOVUxMX0VWRU5UKSkge1xuICAgICAgcmV0dXJuIG5leHRTdGF0ZTtcbiAgICB9XG5cbiAgICB2YXIgbWF5YmVOZXh0U3RhdGUgPSBuZXh0U3RhdGU7XG5cbiAgICBpZiAoIWlzRG9uZSkge1xuICAgICAgaWYgKGhhc0Fsd2F5c1RyYW5zaXRpb25zKSB7XG4gICAgICAgIG1heWJlTmV4dFN0YXRlID0gdGhpcy5yZXNvbHZlUmFpc2VkVHJhbnNpdGlvbihtYXliZU5leHRTdGF0ZSwge1xuICAgICAgICAgIHR5cGU6IG51bGxFdmVudFxuICAgICAgICB9LCBfZXZlbnQsIHByZWRpY3RhYmxlRXhlYyk7XG4gICAgICB9XG5cbiAgICAgIHdoaWxlIChyYWlzZWRFdmVudHMubGVuZ3RoKSB7XG4gICAgICAgIHZhciByYWlzZWRFdmVudCA9IHJhaXNlZEV2ZW50cy5zaGlmdCgpO1xuICAgICAgICBtYXliZU5leHRTdGF0ZSA9IHRoaXMucmVzb2x2ZVJhaXNlZFRyYW5zaXRpb24obWF5YmVOZXh0U3RhdGUsIHJhaXNlZEV2ZW50Ll9ldmVudCwgX2V2ZW50LCBwcmVkaWN0YWJsZUV4ZWMpO1xuICAgICAgfVxuICAgIH0gLy8gRGV0ZWN0IGlmIHN0YXRlIGNoYW5nZWRcblxuXG4gICAgdmFyIGNoYW5nZWQgPSBtYXliZU5leHRTdGF0ZS5jaGFuZ2VkIHx8IChoaXN0b3J5ID8gISFtYXliZU5leHRTdGF0ZS5hY3Rpb25zLmxlbmd0aCB8fCBkaWRVcGRhdGVDb250ZXh0IHx8IHR5cGVvZiBoaXN0b3J5LnZhbHVlICE9PSB0eXBlb2YgbWF5YmVOZXh0U3RhdGUudmFsdWUgfHwgIXN0YXRlVmFsdWVzRXF1YWwobWF5YmVOZXh0U3RhdGUudmFsdWUsIGhpc3RvcnkudmFsdWUpIDogdW5kZWZpbmVkKTtcbiAgICBtYXliZU5leHRTdGF0ZS5jaGFuZ2VkID0gY2hhbmdlZDsgLy8gUHJlc2VydmUgb3JpZ2luYWwgaGlzdG9yeSBhZnRlciByYWlzZWQgZXZlbnRzXG5cbiAgICBtYXliZU5leHRTdGF0ZS5oaXN0b3J5ID0gaGlzdG9yeTtcbiAgICByZXR1cm4gbWF5YmVOZXh0U3RhdGU7XG4gIH07XG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGNoaWxkIHN0YXRlIG5vZGUgZnJvbSBpdHMgcmVsYXRpdmUgYHN0YXRlS2V5YCwgb3IgdGhyb3dzLlxyXG4gICAqL1xuXG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5nZXRTdGF0ZU5vZGUgPSBmdW5jdGlvbiAoc3RhdGVLZXkpIHtcbiAgICBpZiAoaXNTdGF0ZUlkKHN0YXRlS2V5KSkge1xuICAgICAgcmV0dXJuIHRoaXMubWFjaGluZS5nZXRTdGF0ZU5vZGVCeUlkKHN0YXRlS2V5KTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuc3RhdGVzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmFibGUgdG8gcmV0cmlldmUgY2hpbGQgc3RhdGUgJ1wiLmNvbmNhdChzdGF0ZUtleSwgXCInIGZyb20gJ1wiKS5jb25jYXQodGhpcy5pZCwgXCInOyBubyBjaGlsZCBzdGF0ZXMgZXhpc3QuXCIpKTtcbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0ID0gdGhpcy5zdGF0ZXNbc3RhdGVLZXldO1xuXG4gICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNoaWxkIHN0YXRlICdcIi5jb25jYXQoc3RhdGVLZXksIFwiJyBkb2VzIG5vdCBleGlzdCBvbiAnXCIpLmNvbmNhdCh0aGlzLmlkLCBcIidcIikpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIHN0YXRlIG5vZGUgd2l0aCB0aGUgZ2l2ZW4gYHN0YXRlSWRgLCBvciB0aHJvd3MuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gc3RhdGVJZCBUaGUgc3RhdGUgSUQuIFRoZSBwcmVmaXggXCIjXCIgaXMgcmVtb3ZlZC5cclxuICAgKi9cblxuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZ2V0U3RhdGVOb2RlQnlJZCA9IGZ1bmN0aW9uIChzdGF0ZUlkKSB7XG4gICAgdmFyIHJlc29sdmVkU3RhdGVJZCA9IGlzU3RhdGVJZChzdGF0ZUlkKSA/IHN0YXRlSWQuc2xpY2UoU1RBVEVfSURFTlRJRklFUi5sZW5ndGgpIDogc3RhdGVJZDtcblxuICAgIGlmIChyZXNvbHZlZFN0YXRlSWQgPT09IHRoaXMuaWQpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHZhciBzdGF0ZU5vZGUgPSB0aGlzLm1hY2hpbmUuaWRNYXBbcmVzb2x2ZWRTdGF0ZUlkXTtcblxuICAgIGlmICghc3RhdGVOb2RlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDaGlsZCBzdGF0ZSBub2RlICcjXCIuY29uY2F0KHJlc29sdmVkU3RhdGVJZCwgXCInIGRvZXMgbm90IGV4aXN0IG9uIG1hY2hpbmUgJ1wiKS5jb25jYXQodGhpcy5pZCwgXCInXCIpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdGVOb2RlO1xuICB9O1xuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSByZWxhdGl2ZSBzdGF0ZSBub2RlIGZyb20gdGhlIGdpdmVuIGBzdGF0ZVBhdGhgLCBvciB0aHJvd3MuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gc3RhdGVQYXRoIFRoZSBzdHJpbmcgb3Igc3RyaW5nIGFycmF5IHJlbGF0aXZlIHBhdGggdG8gdGhlIHN0YXRlIG5vZGUuXHJcbiAgICovXG5cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmdldFN0YXRlTm9kZUJ5UGF0aCA9IGZ1bmN0aW9uIChzdGF0ZVBhdGgpIHtcbiAgICBpZiAodHlwZW9mIHN0YXRlUGF0aCA9PT0gJ3N0cmluZycgJiYgaXNTdGF0ZUlkKHN0YXRlUGF0aCkpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFN0YXRlTm9kZUJ5SWQoc3RhdGVQYXRoLnNsaWNlKDEpKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHsvLyB0cnkgaW5kaXZpZHVhbCBwYXRoc1xuICAgICAgICAvLyB0aHJvdyBlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBhcnJheVN0YXRlUGF0aCA9IHRvU3RhdGVQYXRoKHN0YXRlUGF0aCwgdGhpcy5kZWxpbWl0ZXIpLnNsaWNlKCk7XG4gICAgdmFyIGN1cnJlbnRTdGF0ZU5vZGUgPSB0aGlzO1xuXG4gICAgd2hpbGUgKGFycmF5U3RhdGVQYXRoLmxlbmd0aCkge1xuICAgICAgdmFyIGtleSA9IGFycmF5U3RhdGVQYXRoLnNoaWZ0KCk7XG5cbiAgICAgIGlmICgha2V5Lmxlbmd0aCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY3VycmVudFN0YXRlTm9kZSA9IGN1cnJlbnRTdGF0ZU5vZGUuZ2V0U3RhdGVOb2RlKGtleSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGN1cnJlbnRTdGF0ZU5vZGU7XG4gIH07XG4gIC8qKlxyXG4gICAqIFJlc29sdmVzIGEgcGFydGlhbCBzdGF0ZSB2YWx1ZSB3aXRoIGl0cyBmdWxsIHJlcHJlc2VudGF0aW9uIGluIHRoaXMgbWFjaGluZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBzdGF0ZVZhbHVlIFRoZSBwYXJ0aWFsIHN0YXRlIHZhbHVlIHRvIHJlc29sdmUuXHJcbiAgICovXG5cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLnJlc29sdmUgPSBmdW5jdGlvbiAoc3RhdGVWYWx1ZSkge1xuICAgIHZhciBfYTtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAoIXN0YXRlVmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzLmluaXRpYWxTdGF0ZVZhbHVlIHx8IEVNUFRZX09CSkVDVDsgLy8gVE9ETzogdHlwZS1zcGVjaWZpYyBwcm9wZXJ0aWVzXG4gICAgfVxuXG4gICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgIGNhc2UgJ3BhcmFsbGVsJzpcbiAgICAgICAgcmV0dXJuIG1hcFZhbHVlcyh0aGlzLmluaXRpYWxTdGF0ZVZhbHVlLCBmdW5jdGlvbiAoc3ViU3RhdGVWYWx1ZSwgc3ViU3RhdGVLZXkpIHtcbiAgICAgICAgICByZXR1cm4gc3ViU3RhdGVWYWx1ZSA/IF90aGlzLmdldFN0YXRlTm9kZShzdWJTdGF0ZUtleSkucmVzb2x2ZShzdGF0ZVZhbHVlW3N1YlN0YXRlS2V5XSB8fCBzdWJTdGF0ZVZhbHVlKSA6IEVNUFRZX09CSkVDVDtcbiAgICAgICAgfSk7XG5cbiAgICAgIGNhc2UgJ2NvbXBvdW5kJzpcbiAgICAgICAgaWYgKGlzU3RyaW5nKHN0YXRlVmFsdWUpKSB7XG4gICAgICAgICAgdmFyIHN1YlN0YXRlTm9kZSA9IHRoaXMuZ2V0U3RhdGVOb2RlKHN0YXRlVmFsdWUpO1xuXG4gICAgICAgICAgaWYgKHN1YlN0YXRlTm9kZS50eXBlID09PSAncGFyYWxsZWwnIHx8IHN1YlN0YXRlTm9kZS50eXBlID09PSAnY29tcG91bmQnKSB7XG4gICAgICAgICAgICByZXR1cm4gX2EgPSB7fSwgX2Fbc3RhdGVWYWx1ZV0gPSBzdWJTdGF0ZU5vZGUuaW5pdGlhbFN0YXRlVmFsdWUsIF9hO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBzdGF0ZVZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFPYmplY3Qua2V5cyhzdGF0ZVZhbHVlKS5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5pbml0aWFsU3RhdGVWYWx1ZSB8fCB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtYXBWYWx1ZXMoc3RhdGVWYWx1ZSwgZnVuY3Rpb24gKHN1YlN0YXRlVmFsdWUsIHN1YlN0YXRlS2V5KSB7XG4gICAgICAgICAgcmV0dXJuIHN1YlN0YXRlVmFsdWUgPyBfdGhpcy5nZXRTdGF0ZU5vZGUoc3ViU3RhdGVLZXkpLnJlc29sdmUoc3ViU3RhdGVWYWx1ZSkgOiBFTVBUWV9PQkpFQ1Q7XG4gICAgICAgIH0pO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gc3RhdGVWYWx1ZSB8fCBFTVBUWV9PQkpFQ1Q7XG4gICAgfVxuICB9O1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZ2V0UmVzb2x2ZWRQYXRoID0gZnVuY3Rpb24gKHN0YXRlSWRlbnRpZmllcikge1xuICAgIGlmIChpc1N0YXRlSWQoc3RhdGVJZGVudGlmaWVyKSkge1xuICAgICAgdmFyIHN0YXRlTm9kZSA9IHRoaXMubWFjaGluZS5pZE1hcFtzdGF0ZUlkZW50aWZpZXIuc2xpY2UoU1RBVEVfSURFTlRJRklFUi5sZW5ndGgpXTtcblxuICAgICAgaWYgKCFzdGF0ZU5vZGUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5hYmxlIHRvIGZpbmQgc3RhdGUgbm9kZSAnXCIuY29uY2F0KHN0YXRlSWRlbnRpZmllciwgXCInXCIpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0YXRlTm9kZS5wYXRoO1xuICAgIH1cblxuICAgIHJldHVybiB0b1N0YXRlUGF0aChzdGF0ZUlkZW50aWZpZXIsIHRoaXMuZGVsaW1pdGVyKTtcbiAgfTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RhdGVOb2RlLnByb3RvdHlwZSwgXCJpbml0aWFsU3RhdGVWYWx1ZVwiLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgX2E7XG5cbiAgICAgIGlmICh0aGlzLl9fY2FjaGUuaW5pdGlhbFN0YXRlVmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19jYWNoZS5pbml0aWFsU3RhdGVWYWx1ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIGluaXRpYWxTdGF0ZVZhbHVlO1xuXG4gICAgICBpZiAodGhpcy50eXBlID09PSAncGFyYWxsZWwnKSB7XG4gICAgICAgIGluaXRpYWxTdGF0ZVZhbHVlID0gbWFwRmlsdGVyVmFsdWVzKHRoaXMuc3RhdGVzLCBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgICByZXR1cm4gc3RhdGUuaW5pdGlhbFN0YXRlVmFsdWUgfHwgRU1QVFlfT0JKRUNUO1xuICAgICAgICB9LCBmdW5jdGlvbiAoc3RhdGVOb2RlKSB7XG4gICAgICAgICAgcmV0dXJuICEoc3RhdGVOb2RlLnR5cGUgPT09ICdoaXN0b3J5Jyk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmluaXRpYWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGVzW3RoaXMuaW5pdGlhbF0pIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbml0aWFsIHN0YXRlICdcIi5jb25jYXQodGhpcy5pbml0aWFsLCBcIicgbm90IGZvdW5kIG9uICdcIikuY29uY2F0KHRoaXMua2V5LCBcIidcIikpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdGlhbFN0YXRlVmFsdWUgPSBpc0xlYWZOb2RlKHRoaXMuc3RhdGVzW3RoaXMuaW5pdGlhbF0pID8gdGhpcy5pbml0aWFsIDogKF9hID0ge30sIF9hW3RoaXMuaW5pdGlhbF0gPSB0aGlzLnN0YXRlc1t0aGlzLmluaXRpYWxdLmluaXRpYWxTdGF0ZVZhbHVlLCBfYSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUaGUgZmluaXRlIHN0YXRlIHZhbHVlIG9mIGEgbWFjaGluZSB3aXRob3V0IGNoaWxkIHN0YXRlcyBpcyBqdXN0IGFuIGVtcHR5IG9iamVjdFxuICAgICAgICBpbml0aWFsU3RhdGVWYWx1ZSA9IHt9O1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9fY2FjaGUuaW5pdGlhbFN0YXRlVmFsdWUgPSBpbml0aWFsU3RhdGVWYWx1ZTtcbiAgICAgIHJldHVybiB0aGlzLl9fY2FjaGUuaW5pdGlhbFN0YXRlVmFsdWU7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5nZXRJbml0aWFsU3RhdGUgPSBmdW5jdGlvbiAoc3RhdGVWYWx1ZSwgY29udGV4dCkge1xuICAgIHRoaXMuX2luaXQoKTsgLy8gVE9ETzogdGhpcyBzaG91bGQgYmUgaW4gdGhlIGNvbnN0cnVjdG9yIChzZWUgbm90ZSBpbiBjb25zdHJ1Y3RvcilcblxuXG4gICAgdmFyIGNvbmZpZ3VyYXRpb24gPSB0aGlzLmdldFN0YXRlTm9kZXMoc3RhdGVWYWx1ZSk7XG4gICAgcmV0dXJuIHRoaXMucmVzb2x2ZVRyYW5zaXRpb24oe1xuICAgICAgY29uZmlndXJhdGlvbjogY29uZmlndXJhdGlvbixcbiAgICAgIGV4aXRTZXQ6IFtdLFxuICAgICAgdHJhbnNpdGlvbnM6IFtdLFxuICAgICAgc291cmNlOiB1bmRlZmluZWQsXG4gICAgICBhY3Rpb25zOiBbXVxuICAgIH0sIHVuZGVmaW5lZCwgY29udGV4dCAhPT0gbnVsbCAmJiBjb250ZXh0ICE9PSB2b2lkIDAgPyBjb250ZXh0IDogdGhpcy5tYWNoaW5lLmNvbnRleHQsIHVuZGVmaW5lZCk7XG4gIH07XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0YXRlTm9kZS5wcm90b3R5cGUsIFwiaW5pdGlhbFN0YXRlXCIsIHtcbiAgICAvKipcclxuICAgICAqIFRoZSBpbml0aWFsIFN0YXRlIGluc3RhbmNlLCB3aGljaCBpbmNsdWRlcyBhbGwgYWN0aW9ucyB0byBiZSBleGVjdXRlZCBmcm9tXHJcbiAgICAgKiBlbnRlcmluZyB0aGUgaW5pdGlhbCBzdGF0ZS5cclxuICAgICAqL1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGluaXRpYWxTdGF0ZVZhbHVlID0gdGhpcy5pbml0aWFsU3RhdGVWYWx1ZTtcblxuICAgICAgaWYgKCFpbml0aWFsU3RhdGVWYWx1ZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgcmV0cmlldmUgaW5pdGlhbCBzdGF0ZSBmcm9tIHNpbXBsZSBzdGF0ZSAnXCIuY29uY2F0KHRoaXMuaWQsIFwiJy5cIikpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5nZXRJbml0aWFsU3RhdGUoaW5pdGlhbFN0YXRlVmFsdWUpO1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RhdGVOb2RlLnByb3RvdHlwZSwgXCJ0YXJnZXRcIiwge1xuICAgIC8qKlxyXG4gICAgICogVGhlIHRhcmdldCBzdGF0ZSB2YWx1ZSBvZiB0aGUgaGlzdG9yeSBzdGF0ZSBub2RlLCBpZiBpdCBleGlzdHMuIFRoaXMgcmVwcmVzZW50cyB0aGVcclxuICAgICAqIGRlZmF1bHQgc3RhdGUgdmFsdWUgdG8gdHJhbnNpdGlvbiB0byBpZiBubyBoaXN0b3J5IHZhbHVlIGV4aXN0cyB5ZXQuXHJcbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB0YXJnZXQ7XG5cbiAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdoaXN0b3J5Jykge1xuICAgICAgICB2YXIgaGlzdG9yeUNvbmZpZyA9IHRoaXMuY29uZmlnO1xuXG4gICAgICAgIGlmIChpc1N0cmluZyhoaXN0b3J5Q29uZmlnLnRhcmdldCkpIHtcbiAgICAgICAgICB0YXJnZXQgPSBpc1N0YXRlSWQoaGlzdG9yeUNvbmZpZy50YXJnZXQpID8gcGF0aFRvU3RhdGVWYWx1ZSh0aGlzLm1hY2hpbmUuZ2V0U3RhdGVOb2RlQnlJZChoaXN0b3J5Q29uZmlnLnRhcmdldCkucGF0aC5zbGljZSh0aGlzLnBhdGgubGVuZ3RoIC0gMSkpIDogaGlzdG9yeUNvbmZpZy50YXJnZXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGFyZ2V0ID0gaGlzdG9yeUNvbmZpZy50YXJnZXQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgbGVhZiBub2RlcyBmcm9tIGEgc3RhdGUgcGF0aCByZWxhdGl2ZSB0byB0aGlzIHN0YXRlIG5vZGUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gcmVsYXRpdmVTdGF0ZUlkIFRoZSByZWxhdGl2ZSBzdGF0ZSBwYXRoIHRvIHJldHJpZXZlIHRoZSBzdGF0ZSBub2Rlc1xyXG4gICAqIEBwYXJhbSBoaXN0b3J5IFRoZSBwcmV2aW91cyBzdGF0ZSB0byByZXRyaWV2ZSBoaXN0b3J5XHJcbiAgICogQHBhcmFtIHJlc29sdmUgV2hldGhlciBzdGF0ZSBub2RlcyBzaG91bGQgcmVzb2x2ZSB0byBpbml0aWFsIGNoaWxkIHN0YXRlIG5vZGVzXHJcbiAgICovXG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5nZXRSZWxhdGl2ZVN0YXRlTm9kZXMgPSBmdW5jdGlvbiAocmVsYXRpdmVTdGF0ZUlkLCBoaXN0b3J5VmFsdWUsIHJlc29sdmUpIHtcbiAgICBpZiAocmVzb2x2ZSA9PT0gdm9pZCAwKSB7XG4gICAgICByZXNvbHZlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzb2x2ZSA/IHJlbGF0aXZlU3RhdGVJZC50eXBlID09PSAnaGlzdG9yeScgPyByZWxhdGl2ZVN0YXRlSWQucmVzb2x2ZUhpc3RvcnkoaGlzdG9yeVZhbHVlKSA6IHJlbGF0aXZlU3RhdGVJZC5pbml0aWFsU3RhdGVOb2RlcyA6IFtyZWxhdGl2ZVN0YXRlSWRdO1xuICB9O1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdGF0ZU5vZGUucHJvdG90eXBlLCBcImluaXRpYWxTdGF0ZU5vZGVzXCIsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIGlmIChpc0xlYWZOb2RlKHRoaXMpKSB7XG4gICAgICAgIHJldHVybiBbdGhpc107XG4gICAgICB9IC8vIENhc2Ugd2hlbiBzdGF0ZSBub2RlIGlzIGNvbXBvdW5kIGJ1dCBubyBpbml0aWFsIHN0YXRlIGlzIGRlZmluZWRcblxuXG4gICAgICBpZiAodGhpcy50eXBlID09PSAnY29tcG91bmQnICYmICF0aGlzLmluaXRpYWwpIHtcbiAgICAgICAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgICAgICAgd2FybihmYWxzZSwgXCJDb21wb3VuZCBzdGF0ZSBub2RlICdcIi5jb25jYXQodGhpcy5pZCwgXCInIGhhcyBubyBpbml0aWFsIHN0YXRlLlwiKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gW3RoaXNdO1xuICAgICAgfVxuXG4gICAgICB2YXIgaW5pdGlhbFN0YXRlTm9kZVBhdGhzID0gdG9TdGF0ZVBhdGhzKHRoaXMuaW5pdGlhbFN0YXRlVmFsdWUpO1xuICAgICAgcmV0dXJuIGZsYXR0ZW4oaW5pdGlhbFN0YXRlTm9kZVBhdGhzLm1hcChmdW5jdGlvbiAoaW5pdGlhbFBhdGgpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLmdldEZyb21SZWxhdGl2ZVBhdGgoaW5pdGlhbFBhdGgpO1xuICAgICAgfSkpO1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuICAvKipcclxuICAgKiBSZXRyaWV2ZXMgc3RhdGUgbm9kZXMgZnJvbSBhIHJlbGF0aXZlIHBhdGggdG8gdGhpcyBzdGF0ZSBub2RlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHJlbGF0aXZlUGF0aCBUaGUgcmVsYXRpdmUgcGF0aCBmcm9tIHRoaXMgc3RhdGUgbm9kZVxyXG4gICAqIEBwYXJhbSBoaXN0b3J5VmFsdWVcclxuICAgKi9cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmdldEZyb21SZWxhdGl2ZVBhdGggPSBmdW5jdGlvbiAocmVsYXRpdmVQYXRoKSB7XG4gICAgaWYgKCFyZWxhdGl2ZVBhdGgubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gW3RoaXNdO1xuICAgIH1cblxuICAgIHZhciBfYSA9IF9fcmVhZChyZWxhdGl2ZVBhdGgpLFxuICAgICAgICBzdGF0ZUtleSA9IF9hWzBdLFxuICAgICAgICBjaGlsZFN0YXRlUGF0aCA9IF9hLnNsaWNlKDEpO1xuXG4gICAgaWYgKCF0aGlzLnN0YXRlcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHJldHJpZXZlIHN1YlBhdGggJ1wiLmNvbmNhdChzdGF0ZUtleSwgXCInIGZyb20gbm9kZSB3aXRoIG5vIHN0YXRlc1wiKSk7XG4gICAgfVxuXG4gICAgdmFyIGNoaWxkU3RhdGVOb2RlID0gdGhpcy5nZXRTdGF0ZU5vZGUoc3RhdGVLZXkpO1xuXG4gICAgaWYgKGNoaWxkU3RhdGVOb2RlLnR5cGUgPT09ICdoaXN0b3J5Jykge1xuICAgICAgcmV0dXJuIGNoaWxkU3RhdGVOb2RlLnJlc29sdmVIaXN0b3J5KCk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnN0YXRlc1tzdGF0ZUtleV0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNoaWxkIHN0YXRlICdcIi5jb25jYXQoc3RhdGVLZXksIFwiJyBkb2VzIG5vdCBleGlzdCBvbiAnXCIpLmNvbmNhdCh0aGlzLmlkLCBcIidcIikpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnN0YXRlc1tzdGF0ZUtleV0uZ2V0RnJvbVJlbGF0aXZlUGF0aChjaGlsZFN0YXRlUGF0aCk7XG4gIH07XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5oaXN0b3J5VmFsdWUgPSBmdW5jdGlvbiAocmVsYXRpdmVTdGF0ZVZhbHVlKSB7XG4gICAgaWYgKCFPYmplY3Qua2V5cyh0aGlzLnN0YXRlcykubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBjdXJyZW50OiByZWxhdGl2ZVN0YXRlVmFsdWUgfHwgdGhpcy5pbml0aWFsU3RhdGVWYWx1ZSxcbiAgICAgIHN0YXRlczogbWFwRmlsdGVyVmFsdWVzKHRoaXMuc3RhdGVzLCBmdW5jdGlvbiAoc3RhdGVOb2RlLCBrZXkpIHtcbiAgICAgICAgaWYgKCFyZWxhdGl2ZVN0YXRlVmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gc3RhdGVOb2RlLmhpc3RvcnlWYWx1ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHN1YlN0YXRlVmFsdWUgPSBpc1N0cmluZyhyZWxhdGl2ZVN0YXRlVmFsdWUpID8gdW5kZWZpbmVkIDogcmVsYXRpdmVTdGF0ZVZhbHVlW2tleV07XG4gICAgICAgIHJldHVybiBzdGF0ZU5vZGUuaGlzdG9yeVZhbHVlKHN1YlN0YXRlVmFsdWUgfHwgc3RhdGVOb2RlLmluaXRpYWxTdGF0ZVZhbHVlKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChzdGF0ZU5vZGUpIHtcbiAgICAgICAgcmV0dXJuICFzdGF0ZU5vZGUuaGlzdG9yeTtcbiAgICAgIH0pXG4gICAgfTtcbiAgfTtcbiAgLyoqXHJcbiAgICogUmVzb2x2ZXMgdG8gdGhlIGhpc3RvcmljYWwgdmFsdWUocykgb2YgdGhlIHBhcmVudCBzdGF0ZSBub2RlLFxyXG4gICAqIHJlcHJlc2VudGVkIGJ5IHN0YXRlIG5vZGVzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGhpc3RvcnlWYWx1ZVxyXG4gICAqL1xuXG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5yZXNvbHZlSGlzdG9yeSA9IGZ1bmN0aW9uIChoaXN0b3J5VmFsdWUpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMudHlwZSAhPT0gJ2hpc3RvcnknKSB7XG4gICAgICByZXR1cm4gW3RoaXNdO1xuICAgIH1cblxuICAgIHZhciBwYXJlbnQgPSB0aGlzLnBhcmVudDtcblxuICAgIGlmICghaGlzdG9yeVZhbHVlKSB7XG4gICAgICB2YXIgaGlzdG9yeVRhcmdldCA9IHRoaXMudGFyZ2V0O1xuICAgICAgcmV0dXJuIGhpc3RvcnlUYXJnZXQgPyBmbGF0dGVuKHRvU3RhdGVQYXRocyhoaXN0b3J5VGFyZ2V0KS5tYXAoZnVuY3Rpb24gKHJlbGF0aXZlQ2hpbGRQYXRoKSB7XG4gICAgICAgIHJldHVybiBwYXJlbnQuZ2V0RnJvbVJlbGF0aXZlUGF0aChyZWxhdGl2ZUNoaWxkUGF0aCk7XG4gICAgICB9KSkgOiBwYXJlbnQuaW5pdGlhbFN0YXRlTm9kZXM7XG4gICAgfVxuXG4gICAgdmFyIHN1Ykhpc3RvcnlWYWx1ZSA9IG5lc3RlZFBhdGgocGFyZW50LnBhdGgsICdzdGF0ZXMnKShoaXN0b3J5VmFsdWUpLmN1cnJlbnQ7XG5cbiAgICBpZiAoaXNTdHJpbmcoc3ViSGlzdG9yeVZhbHVlKSkge1xuICAgICAgcmV0dXJuIFtwYXJlbnQuZ2V0U3RhdGVOb2RlKHN1Ykhpc3RvcnlWYWx1ZSldO1xuICAgIH1cblxuICAgIHJldHVybiBmbGF0dGVuKHRvU3RhdGVQYXRocyhzdWJIaXN0b3J5VmFsdWUpLm1hcChmdW5jdGlvbiAoc3ViU3RhdGVQYXRoKSB7XG4gICAgICByZXR1cm4gX3RoaXMuaGlzdG9yeSA9PT0gJ2RlZXAnID8gcGFyZW50LmdldEZyb21SZWxhdGl2ZVBhdGgoc3ViU3RhdGVQYXRoKSA6IFtwYXJlbnQuc3RhdGVzW3N1YlN0YXRlUGF0aFswXV1dO1xuICAgIH0pKTtcbiAgfTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RhdGVOb2RlLnByb3RvdHlwZSwgXCJzdGF0ZUlkc1wiLCB7XG4gICAgLyoqXHJcbiAgICAgKiBBbGwgdGhlIHN0YXRlIG5vZGUgSURzIG9mIHRoaXMgc3RhdGUgbm9kZSBhbmQgaXRzIGRlc2NlbmRhbnQgc3RhdGUgbm9kZXMuXHJcbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIHZhciBjaGlsZFN0YXRlSWRzID0gZmxhdHRlbihPYmplY3Qua2V5cyh0aGlzLnN0YXRlcykubWFwKGZ1bmN0aW9uIChzdGF0ZUtleSkge1xuICAgICAgICByZXR1cm4gX3RoaXMuc3RhdGVzW3N0YXRlS2V5XS5zdGF0ZUlkcztcbiAgICAgIH0pKTtcbiAgICAgIHJldHVybiBbdGhpcy5pZF0uY29uY2F0KGNoaWxkU3RhdGVJZHMpO1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RhdGVOb2RlLnByb3RvdHlwZSwgXCJldmVudHNcIiwge1xuICAgIC8qKlxyXG4gICAgICogQWxsIHRoZSBldmVudCB0eXBlcyBhY2NlcHRlZCBieSB0aGlzIHN0YXRlIG5vZGUgYW5kIGl0cyBkZXNjZW5kYW50cy5cclxuICAgICAqL1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGVfOCwgX2EsIGVfOSwgX2I7XG5cbiAgICAgIGlmICh0aGlzLl9fY2FjaGUuZXZlbnRzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fY2FjaGUuZXZlbnRzO1xuICAgICAgfVxuXG4gICAgICB2YXIgc3RhdGVzID0gdGhpcy5zdGF0ZXM7XG4gICAgICB2YXIgZXZlbnRzID0gbmV3IFNldCh0aGlzLm93bkV2ZW50cyk7XG5cbiAgICAgIGlmIChzdGF0ZXMpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmb3IgKHZhciBfYyA9IF9fdmFsdWVzKE9iamVjdC5rZXlzKHN0YXRlcykpLCBfZCA9IF9jLm5leHQoKTsgIV9kLmRvbmU7IF9kID0gX2MubmV4dCgpKSB7XG4gICAgICAgICAgICB2YXIgc3RhdGVJZCA9IF9kLnZhbHVlO1xuICAgICAgICAgICAgdmFyIHN0YXRlID0gc3RhdGVzW3N0YXRlSWRdO1xuXG4gICAgICAgICAgICBpZiAoc3RhdGUuc3RhdGVzKSB7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgX2UgPSAoZV85ID0gdm9pZCAwLCBfX3ZhbHVlcyhzdGF0ZS5ldmVudHMpKSwgX2YgPSBfZS5uZXh0KCk7ICFfZi5kb25lOyBfZiA9IF9lLm5leHQoKSkge1xuICAgICAgICAgICAgICAgICAgdmFyIGV2ZW50XzEgPSBfZi52YWx1ZTtcbiAgICAgICAgICAgICAgICAgIGV2ZW50cy5hZGQoXCJcIi5jb25jYXQoZXZlbnRfMSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBjYXRjaCAoZV85XzEpIHtcbiAgICAgICAgICAgICAgICBlXzkgPSB7XG4gICAgICAgICAgICAgICAgICBlcnJvcjogZV85XzFcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICBpZiAoX2YgJiYgIV9mLmRvbmUgJiYgKF9iID0gX2UucmV0dXJuKSkgX2IuY2FsbChfZSk7XG4gICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgIGlmIChlXzkpIHRocm93IGVfOS5lcnJvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVfOF8xKSB7XG4gICAgICAgICAgZV84ID0ge1xuICAgICAgICAgICAgZXJyb3I6IGVfOF8xXG4gICAgICAgICAgfTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKF9kICYmICFfZC5kb25lICYmIChfYSA9IF9jLnJldHVybikpIF9hLmNhbGwoX2MpO1xuICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBpZiAoZV84KSB0aHJvdyBlXzguZXJyb3I7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLl9fY2FjaGUuZXZlbnRzID0gQXJyYXkuZnJvbShldmVudHMpO1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RhdGVOb2RlLnByb3RvdHlwZSwgXCJvd25FdmVudHNcIiwge1xuICAgIC8qKlxyXG4gICAgICogQWxsIHRoZSBldmVudHMgdGhhdCBoYXZlIHRyYW5zaXRpb25zIGRpcmVjdGx5IGZyb20gdGhpcyBzdGF0ZSBub2RlLlxyXG4gICAgICpcclxuICAgICAqIEV4Y2x1ZGVzIGFueSBpbmVydCBldmVudHMuXHJcbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBldmVudHMgPSBuZXcgU2V0KHRoaXMudHJhbnNpdGlvbnMuZmlsdGVyKGZ1bmN0aW9uICh0cmFuc2l0aW9uKSB7XG4gICAgICAgIHJldHVybiAhKCF0cmFuc2l0aW9uLnRhcmdldCAmJiAhdHJhbnNpdGlvbi5hY3Rpb25zLmxlbmd0aCAmJiB0cmFuc2l0aW9uLmludGVybmFsKTtcbiAgICAgIH0pLm1hcChmdW5jdGlvbiAodHJhbnNpdGlvbikge1xuICAgICAgICByZXR1cm4gdHJhbnNpdGlvbi5ldmVudFR5cGU7XG4gICAgICB9KSk7XG4gICAgICByZXR1cm4gQXJyYXkuZnJvbShldmVudHMpO1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUucmVzb2x2ZVRhcmdldCA9IGZ1bmN0aW9uIChfdGFyZ2V0KSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGlmIChfdGFyZ2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIGFuIHVuZGVmaW5lZCB0YXJnZXQgc2lnbmFscyB0aGF0IHRoZSBzdGF0ZSBub2RlIHNob3VsZCBub3QgdHJhbnNpdGlvbiBmcm9tIHRoYXQgc3RhdGUgd2hlbiByZWNlaXZpbmcgdGhhdCBldmVudFxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gX3RhcmdldC5tYXAoZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgaWYgKCFpc1N0cmluZyh0YXJnZXQpKSB7XG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgICB9XG5cbiAgICAgIHZhciBpc0ludGVybmFsVGFyZ2V0ID0gdGFyZ2V0WzBdID09PSBfdGhpcy5kZWxpbWl0ZXI7IC8vIElmIGludGVybmFsIHRhcmdldCBpcyBkZWZpbmVkIG9uIG1hY2hpbmUsXG4gICAgICAvLyBkbyBub3QgaW5jbHVkZSBtYWNoaW5lIGtleSBvbiB0YXJnZXRcblxuICAgICAgaWYgKGlzSW50ZXJuYWxUYXJnZXQgJiYgIV90aGlzLnBhcmVudCkge1xuICAgICAgICByZXR1cm4gX3RoaXMuZ2V0U3RhdGVOb2RlQnlQYXRoKHRhcmdldC5zbGljZSgxKSk7XG4gICAgICB9XG5cbiAgICAgIHZhciByZXNvbHZlZFRhcmdldCA9IGlzSW50ZXJuYWxUYXJnZXQgPyBfdGhpcy5rZXkgKyB0YXJnZXQgOiB0YXJnZXQ7XG5cbiAgICAgIGlmIChfdGhpcy5wYXJlbnQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YXIgdGFyZ2V0U3RhdGVOb2RlID0gX3RoaXMucGFyZW50LmdldFN0YXRlTm9kZUJ5UGF0aChyZXNvbHZlZFRhcmdldCk7XG5cbiAgICAgICAgICByZXR1cm4gdGFyZ2V0U3RhdGVOb2RlO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHRyYW5zaXRpb24gZGVmaW5pdGlvbiBmb3Igc3RhdGUgbm9kZSAnXCIuY29uY2F0KF90aGlzLmlkLCBcIic6XFxuXCIpLmNvbmNhdChlcnIubWVzc2FnZSkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gX3RoaXMuZ2V0U3RhdGVOb2RlQnlQYXRoKHJlc29sdmVkVGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmZvcm1hdFRyYW5zaXRpb24gPSBmdW5jdGlvbiAodHJhbnNpdGlvbkNvbmZpZykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgbm9ybWFsaXplZFRhcmdldCA9IG5vcm1hbGl6ZVRhcmdldCh0cmFuc2l0aW9uQ29uZmlnLnRhcmdldCk7XG4gICAgdmFyIGludGVybmFsID0gJ2ludGVybmFsJyBpbiB0cmFuc2l0aW9uQ29uZmlnID8gdHJhbnNpdGlvbkNvbmZpZy5pbnRlcm5hbCA6IG5vcm1hbGl6ZWRUYXJnZXQgPyBub3JtYWxpemVkVGFyZ2V0LnNvbWUoZnVuY3Rpb24gKF90YXJnZXQpIHtcbiAgICAgIHJldHVybiBpc1N0cmluZyhfdGFyZ2V0KSAmJiBfdGFyZ2V0WzBdID09PSBfdGhpcy5kZWxpbWl0ZXI7XG4gICAgfSkgOiB0cnVlO1xuICAgIHZhciBndWFyZHMgPSB0aGlzLm1hY2hpbmUub3B0aW9ucy5ndWFyZHM7XG4gICAgdmFyIHRhcmdldCA9IHRoaXMucmVzb2x2ZVRhcmdldChub3JtYWxpemVkVGFyZ2V0KTtcblxuICAgIHZhciB0cmFuc2l0aW9uID0gX19hc3NpZ24oX19hc3NpZ24oe30sIHRyYW5zaXRpb25Db25maWcpLCB7XG4gICAgICBhY3Rpb25zOiB0b0FjdGlvbk9iamVjdHModG9BcnJheSh0cmFuc2l0aW9uQ29uZmlnLmFjdGlvbnMpKSxcbiAgICAgIGNvbmQ6IHRvR3VhcmQodHJhbnNpdGlvbkNvbmZpZy5jb25kLCBndWFyZHMpLFxuICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICBzb3VyY2U6IHRoaXMsXG4gICAgICBpbnRlcm5hbDogaW50ZXJuYWwsXG4gICAgICBldmVudFR5cGU6IHRyYW5zaXRpb25Db25maWcuZXZlbnQsXG4gICAgICB0b0pTT046IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCB0cmFuc2l0aW9uKSwge1xuICAgICAgICAgIHRhcmdldDogdHJhbnNpdGlvbi50YXJnZXQgPyB0cmFuc2l0aW9uLnRhcmdldC5tYXAoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHJldHVybiBcIiNcIi5jb25jYXQodC5pZCk7XG4gICAgICAgICAgfSkgOiB1bmRlZmluZWQsXG4gICAgICAgICAgc291cmNlOiBcIiNcIi5jb25jYXQoX3RoaXMuaWQpXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRyYW5zaXRpb247XG4gIH07XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5mb3JtYXRUcmFuc2l0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZV8xMCwgX2E7XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIG9uQ29uZmlnO1xuXG4gICAgaWYgKCF0aGlzLmNvbmZpZy5vbikge1xuICAgICAgb25Db25maWcgPSBbXTtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5jb25maWcub24pKSB7XG4gICAgICBvbkNvbmZpZyA9IHRoaXMuY29uZmlnLm9uO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgX2IgPSB0aGlzLmNvbmZpZy5vbixcbiAgICAgICAgICBfYyA9IFdJTERDQVJELFxuICAgICAgICAgIF9kID0gX2JbX2NdLFxuICAgICAgICAgIHdpbGRjYXJkQ29uZmlncyA9IF9kID09PSB2b2lkIDAgPyBbXSA6IF9kLFxuICAgICAgICAgIHN0cmljdFRyYW5zaXRpb25Db25maWdzXzEgPSBfX3Jlc3QoX2IsIFt0eXBlb2YgX2MgPT09IFwic3ltYm9sXCIgPyBfYyA6IF9jICsgXCJcIl0pO1xuXG4gICAgICBvbkNvbmZpZyA9IGZsYXR0ZW4oT2JqZWN0LmtleXMoc3RyaWN0VHJhbnNpdGlvbkNvbmZpZ3NfMSkubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgaWYgKCFJU19QUk9EVUNUSU9OICYmIGtleSA9PT0gTlVMTF9FVkVOVCkge1xuICAgICAgICAgIHdhcm4oZmFsc2UsIFwiRW1wdHkgc3RyaW5nIHRyYW5zaXRpb24gY29uZmlncyAoZS5nLiwgYHsgb246IHsgJyc6IC4uLiB9fWApIGZvciB0cmFuc2llbnQgdHJhbnNpdGlvbnMgYXJlIGRlcHJlY2F0ZWQuIFNwZWNpZnkgdGhlIHRyYW5zaXRpb24gaW4gdGhlIGB7IGFsd2F5czogLi4uIH1gIHByb3BlcnR5IGluc3RlYWQuIFwiICsgXCJQbGVhc2UgY2hlY2sgdGhlIGBvbmAgY29uZmlndXJhdGlvbiBmb3IgXFxcIiNcIi5jb25jYXQoX3RoaXMuaWQsIFwiXFxcIi5cIikpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRyYW5zaXRpb25Db25maWdBcnJheSA9IHRvVHJhbnNpdGlvbkNvbmZpZ0FycmF5KGtleSwgc3RyaWN0VHJhbnNpdGlvbkNvbmZpZ3NfMVtrZXldKTtcblxuICAgICAgICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICAgICAgICB2YWxpZGF0ZUFycmF5aWZpZWRUcmFuc2l0aW9ucyhfdGhpcywga2V5LCB0cmFuc2l0aW9uQ29uZmlnQXJyYXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRyYW5zaXRpb25Db25maWdBcnJheTtcbiAgICAgIH0pLmNvbmNhdCh0b1RyYW5zaXRpb25Db25maWdBcnJheShXSUxEQ0FSRCwgd2lsZGNhcmRDb25maWdzKSkpO1xuICAgIH1cblxuICAgIHZhciBldmVudGxlc3NDb25maWcgPSB0aGlzLmNvbmZpZy5hbHdheXMgPyB0b1RyYW5zaXRpb25Db25maWdBcnJheSgnJywgdGhpcy5jb25maWcuYWx3YXlzKSA6IFtdO1xuICAgIHZhciBkb25lQ29uZmlnID0gdGhpcy5jb25maWcub25Eb25lID8gdG9UcmFuc2l0aW9uQ29uZmlnQXJyYXkoU3RyaW5nKGRvbmUodGhpcy5pZCkpLCB0aGlzLmNvbmZpZy5vbkRvbmUpIDogW107XG5cbiAgICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICAgIHdhcm4oISh0aGlzLmNvbmZpZy5vbkRvbmUgJiYgIXRoaXMucGFyZW50KSwgXCJSb290IG5vZGVzIGNhbm5vdCBoYXZlIGFuIFxcXCIub25Eb25lXFxcIiB0cmFuc2l0aW9uLiBQbGVhc2UgY2hlY2sgdGhlIGNvbmZpZyBvZiBcXFwiXCIuY29uY2F0KHRoaXMuaWQsIFwiXFxcIi5cIikpO1xuICAgIH1cblxuICAgIHZhciBpbnZva2VDb25maWcgPSBmbGF0dGVuKHRoaXMuaW52b2tlLm1hcChmdW5jdGlvbiAoaW52b2tlRGVmKSB7XG4gICAgICB2YXIgc2V0dGxlVHJhbnNpdGlvbnMgPSBbXTtcblxuICAgICAgaWYgKGludm9rZURlZi5vbkRvbmUpIHtcbiAgICAgICAgc2V0dGxlVHJhbnNpdGlvbnMucHVzaC5hcHBseShzZXR0bGVUcmFuc2l0aW9ucywgX19zcHJlYWRBcnJheShbXSwgX19yZWFkKHRvVHJhbnNpdGlvbkNvbmZpZ0FycmF5KFN0cmluZyhkb25lSW52b2tlKGludm9rZURlZi5pZCkpLCBpbnZva2VEZWYub25Eb25lKSksIGZhbHNlKSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpbnZva2VEZWYub25FcnJvcikge1xuICAgICAgICBzZXR0bGVUcmFuc2l0aW9ucy5wdXNoLmFwcGx5KHNldHRsZVRyYW5zaXRpb25zLCBfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQodG9UcmFuc2l0aW9uQ29uZmlnQXJyYXkoU3RyaW5nKGVycm9yKGludm9rZURlZi5pZCkpLCBpbnZva2VEZWYub25FcnJvcikpLCBmYWxzZSkpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2V0dGxlVHJhbnNpdGlvbnM7XG4gICAgfSkpO1xuICAgIHZhciBkZWxheWVkVHJhbnNpdGlvbnMgPSB0aGlzLmFmdGVyO1xuICAgIHZhciBmb3JtYXR0ZWRUcmFuc2l0aW9ucyA9IGZsYXR0ZW4oX19zcHJlYWRBcnJheShfX3NwcmVhZEFycmF5KF9fc3ByZWFkQXJyYXkoX19zcHJlYWRBcnJheShbXSwgX19yZWFkKGRvbmVDb25maWcpLCBmYWxzZSksIF9fcmVhZChpbnZva2VDb25maWcpLCBmYWxzZSksIF9fcmVhZChvbkNvbmZpZyksIGZhbHNlKSwgX19yZWFkKGV2ZW50bGVzc0NvbmZpZyksIGZhbHNlKS5tYXAoZnVuY3Rpb24gKHRyYW5zaXRpb25Db25maWcpIHtcbiAgICAgIHJldHVybiB0b0FycmF5KHRyYW5zaXRpb25Db25maWcpLm1hcChmdW5jdGlvbiAodHJhbnNpdGlvbikge1xuICAgICAgICByZXR1cm4gX3RoaXMuZm9ybWF0VHJhbnNpdGlvbih0cmFuc2l0aW9uKTtcbiAgICAgIH0pO1xuICAgIH0pKTtcblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBkZWxheWVkVHJhbnNpdGlvbnNfMSA9IF9fdmFsdWVzKGRlbGF5ZWRUcmFuc2l0aW9ucyksIGRlbGF5ZWRUcmFuc2l0aW9uc18xXzEgPSBkZWxheWVkVHJhbnNpdGlvbnNfMS5uZXh0KCk7ICFkZWxheWVkVHJhbnNpdGlvbnNfMV8xLmRvbmU7IGRlbGF5ZWRUcmFuc2l0aW9uc18xXzEgPSBkZWxheWVkVHJhbnNpdGlvbnNfMS5uZXh0KCkpIHtcbiAgICAgICAgdmFyIGRlbGF5ZWRUcmFuc2l0aW9uID0gZGVsYXllZFRyYW5zaXRpb25zXzFfMS52YWx1ZTtcbiAgICAgICAgZm9ybWF0dGVkVHJhbnNpdGlvbnMucHVzaChkZWxheWVkVHJhbnNpdGlvbik7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV8xMF8xKSB7XG4gICAgICBlXzEwID0ge1xuICAgICAgICBlcnJvcjogZV8xMF8xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoZGVsYXllZFRyYW5zaXRpb25zXzFfMSAmJiAhZGVsYXllZFRyYW5zaXRpb25zXzFfMS5kb25lICYmIChfYSA9IGRlbGF5ZWRUcmFuc2l0aW9uc18xLnJldHVybikpIF9hLmNhbGwoZGVsYXllZFRyYW5zaXRpb25zXzEpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfMTApIHRocm93IGVfMTAuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZvcm1hdHRlZFRyYW5zaXRpb25zO1xuICB9O1xuXG4gIHJldHVybiBTdGF0ZU5vZGU7XG59KCk7XG5cbmV4cG9ydCB7IFN0YXRlTm9kZSB9O1xuIiwiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuXHJcbnZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn07XHJcblxyXG5mdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxyXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICAgICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5mdW5jdGlvbiBfX3NwcmVhZEFycmF5KHRvLCBmcm9tLCBwYWNrKSB7XHJcbiAgICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgIGlmIChhciB8fCAhKGkgaW4gZnJvbSkpIHtcclxuICAgICAgICAgICAgaWYgKCFhcikgYXIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tLCAwLCBpKTtcclxuICAgICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xyXG59XG5cbmV4cG9ydCB7IF9fYXNzaWduLCBfX3JlYWQsIF9fcmVzdCwgX19zcHJlYWRBcnJheSwgX192YWx1ZXMgfTtcbiIsImltcG9ydCB7IEFjdGlvblR5cGVzIH0gZnJvbSAnLi90eXBlcy5qcyc7XG5cbnZhciBzdGFydCA9IEFjdGlvblR5cGVzLlN0YXJ0O1xudmFyIHN0b3AgPSBBY3Rpb25UeXBlcy5TdG9wO1xudmFyIHJhaXNlID0gQWN0aW9uVHlwZXMuUmFpc2U7XG52YXIgc2VuZCA9IEFjdGlvblR5cGVzLlNlbmQ7XG52YXIgY2FuY2VsID0gQWN0aW9uVHlwZXMuQ2FuY2VsO1xudmFyIG51bGxFdmVudCA9IEFjdGlvblR5cGVzLk51bGxFdmVudDtcbnZhciBhc3NpZ24gPSBBY3Rpb25UeXBlcy5Bc3NpZ247XG52YXIgYWZ0ZXIgPSBBY3Rpb25UeXBlcy5BZnRlcjtcbnZhciBkb25lU3RhdGUgPSBBY3Rpb25UeXBlcy5Eb25lU3RhdGU7XG52YXIgbG9nID0gQWN0aW9uVHlwZXMuTG9nO1xudmFyIGluaXQgPSBBY3Rpb25UeXBlcy5Jbml0O1xudmFyIGludm9rZSA9IEFjdGlvblR5cGVzLkludm9rZTtcbnZhciBlcnJvckV4ZWN1dGlvbiA9IEFjdGlvblR5cGVzLkVycm9yRXhlY3V0aW9uO1xudmFyIGVycm9yUGxhdGZvcm0gPSBBY3Rpb25UeXBlcy5FcnJvclBsYXRmb3JtO1xudmFyIGVycm9yID0gQWN0aW9uVHlwZXMuRXJyb3JDdXN0b207XG52YXIgdXBkYXRlID0gQWN0aW9uVHlwZXMuVXBkYXRlO1xudmFyIGNob29zZSA9IEFjdGlvblR5cGVzLkNob29zZTtcbnZhciBwdXJlID0gQWN0aW9uVHlwZXMuUHVyZTtcblxuZXhwb3J0IHsgYWZ0ZXIsIGFzc2lnbiwgY2FuY2VsLCBjaG9vc2UsIGRvbmVTdGF0ZSwgZXJyb3IsIGVycm9yRXhlY3V0aW9uLCBlcnJvclBsYXRmb3JtLCBpbml0LCBpbnZva2UsIGxvZywgbnVsbEV2ZW50LCBwdXJlLCByYWlzZSwgc2VuZCwgc3RhcnQsIHN0b3AsIHVwZGF0ZSB9O1xuIiwiaW1wb3J0IHsgX19hc3NpZ24sIF9fc3ByZWFkQXJyYXksIF9fcmVhZCwgX192YWx1ZXMgfSBmcm9tICcuL192aXJ0dWFsL190c2xpYi5qcyc7XG5pbXBvcnQgeyBTcGVjaWFsVGFyZ2V0cywgQWN0aW9uVHlwZXMgfSBmcm9tICcuL3R5cGVzLmpzJztcbmltcG9ydCB7IGluaXQsIHJhaXNlIGFzIHJhaXNlJDEsIHNlbmQgYXMgc2VuZCQxLCB1cGRhdGUsIGxvZyBhcyBsb2ckMSwgY2FuY2VsIGFzIGNhbmNlbCQxLCBhc3NpZ24gYXMgYXNzaWduJDEsIGVycm9yIGFzIGVycm9yJDEsIHN0b3AgYXMgc3RvcCQxLCBwdXJlIGFzIHB1cmUkMSwgY2hvb3NlIGFzIGNob29zZSQxIH0gZnJvbSAnLi9hY3Rpb25UeXBlcy5qcyc7XG5pbXBvcnQgKiBhcyBhY3Rpb25UeXBlcyBmcm9tICcuL2FjdGlvblR5cGVzLmpzJztcbmV4cG9ydCB7IGFjdGlvblR5cGVzIH07XG5pbXBvcnQgeyB0b1NDWE1MRXZlbnQsIGlzU3RyaW5nLCBpc0Z1bmN0aW9uLCB0b0V2ZW50T2JqZWN0LCBnZXRFdmVudFR5cGUsIHVwZGF0ZUNvbnRleHQsIGZsYXR0ZW4sIGlzQXJyYXksIHRvQXJyYXksIHRvR3VhcmQsIGV2YWx1YXRlR3VhcmQsIHdhcm4gfSBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7IElTX1BST0RVQ1RJT04gfSBmcm9tICcuL2Vudmlyb25tZW50LmpzJztcblxudmFyIGluaXRFdmVudCA9IC8qI19fUFVSRV9fKi90b1NDWE1MRXZlbnQoe1xuICB0eXBlOiBpbml0XG59KTtcbmZ1bmN0aW9uIGdldEFjdGlvbkZ1bmN0aW9uKGFjdGlvblR5cGUsIGFjdGlvbkZ1bmN0aW9uTWFwKSB7XG4gIHJldHVybiBhY3Rpb25GdW5jdGlvbk1hcCA/IGFjdGlvbkZ1bmN0aW9uTWFwW2FjdGlvblR5cGVdIHx8IHVuZGVmaW5lZCA6IHVuZGVmaW5lZDtcbn1cbmZ1bmN0aW9uIHRvQWN0aW9uT2JqZWN0KGFjdGlvbiwgYWN0aW9uRnVuY3Rpb25NYXApIHtcbiAgdmFyIGFjdGlvbk9iamVjdDtcblxuICBpZiAoaXNTdHJpbmcoYWN0aW9uKSB8fCB0eXBlb2YgYWN0aW9uID09PSAnbnVtYmVyJykge1xuICAgIHZhciBleGVjID0gZ2V0QWN0aW9uRnVuY3Rpb24oYWN0aW9uLCBhY3Rpb25GdW5jdGlvbk1hcCk7XG5cbiAgICBpZiAoaXNGdW5jdGlvbihleGVjKSkge1xuICAgICAgYWN0aW9uT2JqZWN0ID0ge1xuICAgICAgICB0eXBlOiBhY3Rpb24sXG4gICAgICAgIGV4ZWM6IGV4ZWNcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChleGVjKSB7XG4gICAgICBhY3Rpb25PYmplY3QgPSBleGVjO1xuICAgIH0gZWxzZSB7XG4gICAgICBhY3Rpb25PYmplY3QgPSB7XG4gICAgICAgIHR5cGU6IGFjdGlvbixcbiAgICAgICAgZXhlYzogdW5kZWZpbmVkXG4gICAgICB9O1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc0Z1bmN0aW9uKGFjdGlvbikpIHtcbiAgICBhY3Rpb25PYmplY3QgPSB7XG4gICAgICAvLyBDb252ZXJ0IGFjdGlvbiB0byBzdHJpbmcgaWYgdW5uYW1lZFxuICAgICAgdHlwZTogYWN0aW9uLm5hbWUgfHwgYWN0aW9uLnRvU3RyaW5nKCksXG4gICAgICBleGVjOiBhY3Rpb25cbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHZhciBleGVjID0gZ2V0QWN0aW9uRnVuY3Rpb24oYWN0aW9uLnR5cGUsIGFjdGlvbkZ1bmN0aW9uTWFwKTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGV4ZWMpKSB7XG4gICAgICBhY3Rpb25PYmplY3QgPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgYWN0aW9uKSwge1xuICAgICAgICBleGVjOiBleGVjXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGV4ZWMpIHtcbiAgICAgIHZhciBhY3Rpb25UeXBlID0gZXhlYy50eXBlIHx8IGFjdGlvbi50eXBlO1xuICAgICAgYWN0aW9uT2JqZWN0ID0gX19hc3NpZ24oX19hc3NpZ24oX19hc3NpZ24oe30sIGV4ZWMpLCBhY3Rpb24pLCB7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBhY3Rpb25PYmplY3QgPSBhY3Rpb247XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGFjdGlvbk9iamVjdDtcbn1cbnZhciB0b0FjdGlvbk9iamVjdHMgPSBmdW5jdGlvbiAoYWN0aW9uLCBhY3Rpb25GdW5jdGlvbk1hcCkge1xuICBpZiAoIWFjdGlvbikge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHZhciBhY3Rpb25zID0gaXNBcnJheShhY3Rpb24pID8gYWN0aW9uIDogW2FjdGlvbl07XG4gIHJldHVybiBhY3Rpb25zLm1hcChmdW5jdGlvbiAoc3ViQWN0aW9uKSB7XG4gICAgcmV0dXJuIHRvQWN0aW9uT2JqZWN0KHN1YkFjdGlvbiwgYWN0aW9uRnVuY3Rpb25NYXApO1xuICB9KTtcbn07XG5mdW5jdGlvbiB0b0FjdGl2aXR5RGVmaW5pdGlvbihhY3Rpb24pIHtcbiAgdmFyIGFjdGlvbk9iamVjdCA9IHRvQWN0aW9uT2JqZWN0KGFjdGlvbik7XG4gIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7XG4gICAgaWQ6IGlzU3RyaW5nKGFjdGlvbikgPyBhY3Rpb24gOiBhY3Rpb25PYmplY3QuaWRcbiAgfSwgYWN0aW9uT2JqZWN0KSwge1xuICAgIHR5cGU6IGFjdGlvbk9iamVjdC50eXBlXG4gIH0pO1xufVxuLyoqXHJcbiAqIFJhaXNlcyBhbiBldmVudC4gVGhpcyBwbGFjZXMgdGhlIGV2ZW50IGluIHRoZSBpbnRlcm5hbCBldmVudCBxdWV1ZSwgc28gdGhhdFxyXG4gKiB0aGUgZXZlbnQgaXMgaW1tZWRpYXRlbHkgY29uc3VtZWQgYnkgdGhlIG1hY2hpbmUgaW4gdGhlIGN1cnJlbnQgc3RlcC5cclxuICpcclxuICogQHBhcmFtIGV2ZW50VHlwZSBUaGUgZXZlbnQgdG8gcmFpc2UuXHJcbiAqL1xuXG5mdW5jdGlvbiByYWlzZShldmVudCwgb3B0aW9ucykge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IHJhaXNlJDEsXG4gICAgZXZlbnQ6IHR5cGVvZiBldmVudCA9PT0gJ2Z1bmN0aW9uJyA/IGV2ZW50IDogdG9FdmVudE9iamVjdChldmVudCksXG4gICAgZGVsYXk6IG9wdGlvbnMgPyBvcHRpb25zLmRlbGF5IDogdW5kZWZpbmVkLFxuICAgIGlkOiBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuaWRcbiAgfTtcbn1cbmZ1bmN0aW9uIHJlc29sdmVSYWlzZShhY3Rpb24sIGN0eCwgX2V2ZW50LCBkZWxheXNNYXApIHtcbiAgdmFyIG1ldGEgPSB7XG4gICAgX2V2ZW50OiBfZXZlbnRcbiAgfTtcbiAgdmFyIHJlc29sdmVkRXZlbnQgPSB0b1NDWE1MRXZlbnQoaXNGdW5jdGlvbihhY3Rpb24uZXZlbnQpID8gYWN0aW9uLmV2ZW50KGN0eCwgX2V2ZW50LmRhdGEsIG1ldGEpIDogYWN0aW9uLmV2ZW50KTtcbiAgdmFyIHJlc29sdmVkRGVsYXk7XG5cbiAgaWYgKGlzU3RyaW5nKGFjdGlvbi5kZWxheSkpIHtcbiAgICB2YXIgY29uZmlnRGVsYXkgPSBkZWxheXNNYXAgJiYgZGVsYXlzTWFwW2FjdGlvbi5kZWxheV07XG4gICAgcmVzb2x2ZWREZWxheSA9IGlzRnVuY3Rpb24oY29uZmlnRGVsYXkpID8gY29uZmlnRGVsYXkoY3R4LCBfZXZlbnQuZGF0YSwgbWV0YSkgOiBjb25maWdEZWxheTtcbiAgfSBlbHNlIHtcbiAgICByZXNvbHZlZERlbGF5ID0gaXNGdW5jdGlvbihhY3Rpb24uZGVsYXkpID8gYWN0aW9uLmRlbGF5KGN0eCwgX2V2ZW50LmRhdGEsIG1ldGEpIDogYWN0aW9uLmRlbGF5O1xuICB9XG5cbiAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCBhY3Rpb24pLCB7XG4gICAgdHlwZTogcmFpc2UkMSxcbiAgICBfZXZlbnQ6IHJlc29sdmVkRXZlbnQsXG4gICAgZGVsYXk6IHJlc29sdmVkRGVsYXlcbiAgfSk7XG59XG4vKipcclxuICogU2VuZHMgYW4gZXZlbnQuIFRoaXMgcmV0dXJucyBhbiBhY3Rpb24gdGhhdCB3aWxsIGJlIHJlYWQgYnkgYW4gaW50ZXJwcmV0ZXIgdG9cclxuICogc2VuZCB0aGUgZXZlbnQgaW4gdGhlIG5leHQgc3RlcCwgYWZ0ZXIgdGhlIGN1cnJlbnQgc3RlcCBpcyBmaW5pc2hlZCBleGVjdXRpbmcuXHJcbiAqXHJcbiAqIEBkZXByZWNhdGVkIFVzZSB0aGUgYHNlbmRUbyguLi4pYCBhY3Rpb24gY3JlYXRvciBpbnN0ZWFkLlxyXG4gKlxyXG4gKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50IHRvIHNlbmQuXHJcbiAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgdG8gcGFzcyBpbnRvIHRoZSBzZW5kIGV2ZW50OlxyXG4gKiAgLSBgaWRgIC0gVGhlIHVuaXF1ZSBzZW5kIGV2ZW50IGlkZW50aWZpZXIgKHVzZWQgd2l0aCBgY2FuY2VsKClgKS5cclxuICogIC0gYGRlbGF5YCAtIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIGRlbGF5IHRoZSBzZW5kaW5nIG9mIHRoZSBldmVudC5cclxuICogIC0gYHRvYCAtIFRoZSB0YXJnZXQgb2YgdGhpcyBldmVudCAoYnkgZGVmYXVsdCwgdGhlIG1hY2hpbmUgdGhlIGV2ZW50IHdhcyBzZW50IGZyb20pLlxyXG4gKi9cblxuZnVuY3Rpb24gc2VuZChldmVudCwgb3B0aW9ucykge1xuICByZXR1cm4ge1xuICAgIHRvOiBvcHRpb25zID8gb3B0aW9ucy50byA6IHVuZGVmaW5lZCxcbiAgICB0eXBlOiBzZW5kJDEsXG4gICAgZXZlbnQ6IGlzRnVuY3Rpb24oZXZlbnQpID8gZXZlbnQgOiB0b0V2ZW50T2JqZWN0KGV2ZW50KSxcbiAgICBkZWxheTogb3B0aW9ucyA/IG9wdGlvbnMuZGVsYXkgOiB1bmRlZmluZWQsXG4gICAgLy8gVE9ETzogZG9uJ3QgYXV0by1nZW5lcmF0ZSBJRHMgaGVyZSBsaWtlIHRoYXRcbiAgICAvLyB0aGVyZSBpcyB0b28gYmlnIGNoYW5jZSBvZiB0aGUgSUQgY29sbGlzaW9uXG4gICAgaWQ6IG9wdGlvbnMgJiYgb3B0aW9ucy5pZCAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5pZCA6IGlzRnVuY3Rpb24oZXZlbnQpID8gZXZlbnQubmFtZSA6IGdldEV2ZW50VHlwZShldmVudClcbiAgfTtcbn1cbmZ1bmN0aW9uIHJlc29sdmVTZW5kKGFjdGlvbiwgY3R4LCBfZXZlbnQsIGRlbGF5c01hcCkge1xuICB2YXIgbWV0YSA9IHtcbiAgICBfZXZlbnQ6IF9ldmVudFxuICB9OyAvLyBUT0RPOiBoZWxwZXIgZnVuY3Rpb24gZm9yIHJlc29sdmluZyBFeHByXG5cbiAgdmFyIHJlc29sdmVkRXZlbnQgPSB0b1NDWE1MRXZlbnQoaXNGdW5jdGlvbihhY3Rpb24uZXZlbnQpID8gYWN0aW9uLmV2ZW50KGN0eCwgX2V2ZW50LmRhdGEsIG1ldGEpIDogYWN0aW9uLmV2ZW50KTtcbiAgdmFyIHJlc29sdmVkRGVsYXk7XG5cbiAgaWYgKGlzU3RyaW5nKGFjdGlvbi5kZWxheSkpIHtcbiAgICB2YXIgY29uZmlnRGVsYXkgPSBkZWxheXNNYXAgJiYgZGVsYXlzTWFwW2FjdGlvbi5kZWxheV07XG4gICAgcmVzb2x2ZWREZWxheSA9IGlzRnVuY3Rpb24oY29uZmlnRGVsYXkpID8gY29uZmlnRGVsYXkoY3R4LCBfZXZlbnQuZGF0YSwgbWV0YSkgOiBjb25maWdEZWxheTtcbiAgfSBlbHNlIHtcbiAgICByZXNvbHZlZERlbGF5ID0gaXNGdW5jdGlvbihhY3Rpb24uZGVsYXkpID8gYWN0aW9uLmRlbGF5KGN0eCwgX2V2ZW50LmRhdGEsIG1ldGEpIDogYWN0aW9uLmRlbGF5O1xuICB9XG5cbiAgdmFyIHJlc29sdmVkVGFyZ2V0ID0gaXNGdW5jdGlvbihhY3Rpb24udG8pID8gYWN0aW9uLnRvKGN0eCwgX2V2ZW50LmRhdGEsIG1ldGEpIDogYWN0aW9uLnRvO1xuICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIGFjdGlvbiksIHtcbiAgICB0bzogcmVzb2x2ZWRUYXJnZXQsXG4gICAgX2V2ZW50OiByZXNvbHZlZEV2ZW50LFxuICAgIGV2ZW50OiByZXNvbHZlZEV2ZW50LmRhdGEsXG4gICAgZGVsYXk6IHJlc29sdmVkRGVsYXlcbiAgfSk7XG59XG4vKipcclxuICogU2VuZHMgYW4gZXZlbnQgdG8gdGhpcyBtYWNoaW5lJ3MgcGFyZW50LlxyXG4gKlxyXG4gKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50IHRvIHNlbmQgdG8gdGhlIHBhcmVudCBtYWNoaW5lLlxyXG4gKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIHRvIHBhc3MgaW50byB0aGUgc2VuZCBldmVudC5cclxuICovXG5cbmZ1bmN0aW9uIHNlbmRQYXJlbnQoZXZlbnQsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIHNlbmQoZXZlbnQsIF9fYXNzaWduKF9fYXNzaWduKHt9LCBvcHRpb25zKSwge1xuICAgIHRvOiBTcGVjaWFsVGFyZ2V0cy5QYXJlbnRcbiAgfSkpO1xufVxuLyoqXHJcbiAqIFNlbmRzIGFuIGV2ZW50IHRvIGFuIGFjdG9yLlxyXG4gKlxyXG4gKiBAcGFyYW0gYWN0b3IgVGhlIGBBY3RvclJlZmAgdG8gc2VuZCB0aGUgZXZlbnQgdG8uXHJcbiAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQgdG8gc2VuZCwgb3IgYW4gZXhwcmVzc2lvbiB0aGF0IGV2YWx1YXRlcyB0byB0aGUgZXZlbnQgdG8gc2VuZFxyXG4gKiBAcGFyYW0gb3B0aW9ucyBTZW5kIGFjdGlvbiBvcHRpb25zXHJcbiAqIEByZXR1cm5zIEFuIFhTdGF0ZSBzZW5kIGFjdGlvbiBvYmplY3RcclxuICovXG5cbmZ1bmN0aW9uIHNlbmRUbyhhY3RvciwgZXZlbnQsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIHNlbmQoZXZlbnQsIF9fYXNzaWduKF9fYXNzaWduKHt9LCBvcHRpb25zKSwge1xuICAgIHRvOiBhY3RvclxuICB9KSk7XG59XG4vKipcclxuICogU2VuZHMgYW4gdXBkYXRlIGV2ZW50IHRvIHRoaXMgbWFjaGluZSdzIHBhcmVudC5cclxuICovXG5cbmZ1bmN0aW9uIHNlbmRVcGRhdGUoKSB7XG4gIHJldHVybiBzZW5kUGFyZW50KHVwZGF0ZSk7XG59XG4vKipcclxuICogU2VuZHMgYW4gZXZlbnQgYmFjayB0byB0aGUgc2VuZGVyIG9mIHRoZSBvcmlnaW5hbCBldmVudC5cclxuICpcclxuICogQHBhcmFtIGV2ZW50IFRoZSBldmVudCB0byBzZW5kIGJhY2sgdG8gdGhlIHNlbmRlclxyXG4gKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIHRvIHBhc3MgaW50byB0aGUgc2VuZCBldmVudFxyXG4gKi9cblxuZnVuY3Rpb24gcmVzcG9uZChldmVudCwgb3B0aW9ucykge1xuICByZXR1cm4gc2VuZChldmVudCwgX19hc3NpZ24oX19hc3NpZ24oe30sIG9wdGlvbnMpLCB7XG4gICAgdG86IGZ1bmN0aW9uIChfLCBfXywgX2EpIHtcbiAgICAgIHZhciBfZXZlbnQgPSBfYS5fZXZlbnQ7XG4gICAgICByZXR1cm4gX2V2ZW50Lm9yaWdpbjsgLy8gVE9ETzogaGFuZGxlIHdoZW4gX2V2ZW50Lm9yaWdpbiBpcyB1bmRlZmluZWRcbiAgICB9XG4gIH0pKTtcbn1cblxudmFyIGRlZmF1bHRMb2dFeHByID0gZnVuY3Rpb24gKGNvbnRleHQsIGV2ZW50KSB7XG4gIHJldHVybiB7XG4gICAgY29udGV4dDogY29udGV4dCxcbiAgICBldmVudDogZXZlbnRcbiAgfTtcbn07XG4vKipcclxuICpcclxuICogQHBhcmFtIGV4cHIgVGhlIGV4cHJlc3Npb24gZnVuY3Rpb24gdG8gZXZhbHVhdGUgd2hpY2ggd2lsbCBiZSBsb2dnZWQuXHJcbiAqICBUYWtlcyBpbiAyIGFyZ3VtZW50czpcclxuICogIC0gYGN0eGAgLSB0aGUgY3VycmVudCBzdGF0ZSBjb250ZXh0XHJcbiAqICAtIGBldmVudGAgLSB0aGUgZXZlbnQgdGhhdCBjYXVzZWQgdGhpcyBhY3Rpb24gdG8gYmUgZXhlY3V0ZWQuXHJcbiAqIEBwYXJhbSBsYWJlbCBUaGUgbGFiZWwgdG8gZ2l2ZSB0byB0aGUgbG9nZ2VkIGV4cHJlc3Npb24uXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGxvZyhleHByLCBsYWJlbCkge1xuICBpZiAoZXhwciA9PT0gdm9pZCAwKSB7XG4gICAgZXhwciA9IGRlZmF1bHRMb2dFeHByO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBsb2ckMSxcbiAgICBsYWJlbDogbGFiZWwsXG4gICAgZXhwcjogZXhwclxuICB9O1xufVxudmFyIHJlc29sdmVMb2cgPSBmdW5jdGlvbiAoYWN0aW9uLCBjdHgsIF9ldmVudCkge1xuICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIGFjdGlvbiksIHtcbiAgICB2YWx1ZTogaXNTdHJpbmcoYWN0aW9uLmV4cHIpID8gYWN0aW9uLmV4cHIgOiBhY3Rpb24uZXhwcihjdHgsIF9ldmVudC5kYXRhLCB7XG4gICAgICBfZXZlbnQ6IF9ldmVudFxuICAgIH0pXG4gIH0pO1xufTtcbi8qKlxyXG4gKiBDYW5jZWxzIGFuIGluLWZsaWdodCBgc2VuZCguLi4pYCBhY3Rpb24uIEEgY2FuY2VsZWQgc2VudCBhY3Rpb24gd2lsbCBub3RcclxuICogYmUgZXhlY3V0ZWQsIG5vciB3aWxsIGl0cyBldmVudCBiZSBzZW50LCB1bmxlc3MgaXQgaGFzIGFscmVhZHkgYmVlbiBzZW50XHJcbiAqIChlLmcuLCBpZiBgY2FuY2VsKC4uLilgIGlzIGNhbGxlZCBhZnRlciB0aGUgYHNlbmQoLi4uKWAgYWN0aW9uJ3MgYGRlbGF5YCkuXHJcbiAqXHJcbiAqIEBwYXJhbSBzZW5kSWQgVGhlIGBpZGAgb2YgdGhlIGBzZW5kKC4uLilgIGFjdGlvbiB0byBjYW5jZWwuXHJcbiAqL1xuXG52YXIgY2FuY2VsID0gZnVuY3Rpb24gKHNlbmRJZCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IGNhbmNlbCQxLFxuICAgIHNlbmRJZDogc2VuZElkXG4gIH07XG59O1xuLyoqXHJcbiAqIFN0YXJ0cyBhbiBhY3Rpdml0eS5cclxuICpcclxuICogQHBhcmFtIGFjdGl2aXR5IFRoZSBhY3Rpdml0eSB0byBzdGFydC5cclxuICovXG5cbmZ1bmN0aW9uIHN0YXJ0KGFjdGl2aXR5KSB7XG4gIHZhciBhY3Rpdml0eURlZiA9IHRvQWN0aXZpdHlEZWZpbml0aW9uKGFjdGl2aXR5KTtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5TdGFydCxcbiAgICBhY3Rpdml0eTogYWN0aXZpdHlEZWYsXG4gICAgZXhlYzogdW5kZWZpbmVkXG4gIH07XG59XG4vKipcclxuICogU3RvcHMgYW4gYWN0aXZpdHkuXHJcbiAqXHJcbiAqIEBwYXJhbSBhY3RvclJlZiBUaGUgYWN0aXZpdHkgdG8gc3RvcC5cclxuICovXG5cbmZ1bmN0aW9uIHN0b3AoYWN0b3JSZWYpIHtcbiAgdmFyIGFjdGl2aXR5ID0gaXNGdW5jdGlvbihhY3RvclJlZikgPyBhY3RvclJlZiA6IHRvQWN0aXZpdHlEZWZpbml0aW9uKGFjdG9yUmVmKTtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5TdG9wLFxuICAgIGFjdGl2aXR5OiBhY3Rpdml0eSxcbiAgICBleGVjOiB1bmRlZmluZWRcbiAgfTtcbn1cbmZ1bmN0aW9uIHJlc29sdmVTdG9wKGFjdGlvbiwgY29udGV4dCwgX2V2ZW50KSB7XG4gIHZhciBhY3RvclJlZk9yU3RyaW5nID0gaXNGdW5jdGlvbihhY3Rpb24uYWN0aXZpdHkpID8gYWN0aW9uLmFjdGl2aXR5KGNvbnRleHQsIF9ldmVudC5kYXRhKSA6IGFjdGlvbi5hY3Rpdml0eTtcbiAgdmFyIHJlc29sdmVkQWN0b3JSZWYgPSB0eXBlb2YgYWN0b3JSZWZPclN0cmluZyA9PT0gJ3N0cmluZycgPyB7XG4gICAgaWQ6IGFjdG9yUmVmT3JTdHJpbmdcbiAgfSA6IGFjdG9yUmVmT3JTdHJpbmc7XG4gIHZhciBhY3Rpb25PYmplY3QgPSB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuU3RvcCxcbiAgICBhY3Rpdml0eTogcmVzb2x2ZWRBY3RvclJlZlxuICB9O1xuICByZXR1cm4gYWN0aW9uT2JqZWN0O1xufVxuLyoqXHJcbiAqIFVwZGF0ZXMgdGhlIGN1cnJlbnQgY29udGV4dCBvZiB0aGUgbWFjaGluZS5cclxuICpcclxuICogQHBhcmFtIGFzc2lnbm1lbnQgQW4gb2JqZWN0IHRoYXQgcmVwcmVzZW50cyB0aGUgcGFydGlhbCBjb250ZXh0IHRvIHVwZGF0ZS5cclxuICovXG5cbnZhciBhc3NpZ24gPSBmdW5jdGlvbiAoYXNzaWdubWVudCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IGFzc2lnbiQxLFxuICAgIGFzc2lnbm1lbnQ6IGFzc2lnbm1lbnRcbiAgfTtcbn07XG5mdW5jdGlvbiBpc0FjdGlvbk9iamVjdChhY3Rpb24pIHtcbiAgcmV0dXJuIHR5cGVvZiBhY3Rpb24gPT09ICdvYmplY3QnICYmICd0eXBlJyBpbiBhY3Rpb247XG59XG4vKipcclxuICogUmV0dXJucyBhbiBldmVudCB0eXBlIHRoYXQgcmVwcmVzZW50cyBhbiBpbXBsaWNpdCBldmVudCB0aGF0XHJcbiAqIGlzIHNlbnQgYWZ0ZXIgdGhlIHNwZWNpZmllZCBgZGVsYXlgLlxyXG4gKlxyXG4gKiBAcGFyYW0gZGVsYXlSZWYgVGhlIGRlbGF5IGluIG1pbGxpc2Vjb25kc1xyXG4gKiBAcGFyYW0gaWQgVGhlIHN0YXRlIG5vZGUgSUQgd2hlcmUgdGhpcyBldmVudCBpcyBoYW5kbGVkXHJcbiAqL1xuXG5mdW5jdGlvbiBhZnRlcihkZWxheVJlZiwgaWQpIHtcbiAgdmFyIGlkU3VmZml4ID0gaWQgPyBcIiNcIi5jb25jYXQoaWQpIDogJyc7XG4gIHJldHVybiBcIlwiLmNvbmNhdChBY3Rpb25UeXBlcy5BZnRlciwgXCIoXCIpLmNvbmNhdChkZWxheVJlZiwgXCIpXCIpLmNvbmNhdChpZFN1ZmZpeCk7XG59XG4vKipcclxuICogUmV0dXJucyBhbiBldmVudCB0aGF0IHJlcHJlc2VudHMgdGhhdCBhIGZpbmFsIHN0YXRlIG5vZGVcclxuICogaGFzIGJlZW4gcmVhY2hlZCBpbiB0aGUgcGFyZW50IHN0YXRlIG5vZGUuXHJcbiAqXHJcbiAqIEBwYXJhbSBpZCBUaGUgZmluYWwgc3RhdGUgbm9kZSdzIHBhcmVudCBzdGF0ZSBub2RlIGBpZGBcclxuICogQHBhcmFtIGRhdGEgVGhlIGRhdGEgdG8gcGFzcyBpbnRvIHRoZSBldmVudFxyXG4gKi9cblxuZnVuY3Rpb24gZG9uZShpZCwgZGF0YSkge1xuICB2YXIgdHlwZSA9IFwiXCIuY29uY2F0KEFjdGlvblR5cGVzLkRvbmVTdGF0ZSwgXCIuXCIpLmNvbmNhdChpZCk7XG4gIHZhciBldmVudE9iamVjdCA9IHtcbiAgICB0eXBlOiB0eXBlLFxuICAgIGRhdGE6IGRhdGFcbiAgfTtcblxuICBldmVudE9iamVjdC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdHlwZTtcbiAgfTtcblxuICByZXR1cm4gZXZlbnRPYmplY3Q7XG59XG4vKipcclxuICogUmV0dXJucyBhbiBldmVudCB0aGF0IHJlcHJlc2VudHMgdGhhdCBhbiBpbnZva2VkIHNlcnZpY2UgaGFzIHRlcm1pbmF0ZWQuXHJcbiAqXHJcbiAqIEFuIGludm9rZWQgc2VydmljZSBpcyB0ZXJtaW5hdGVkIHdoZW4gaXQgaGFzIHJlYWNoZWQgYSB0b3AtbGV2ZWwgZmluYWwgc3RhdGUgbm9kZSxcclxuICogYnV0IG5vdCB3aGVuIGl0IGlzIGNhbmNlbGVkLlxyXG4gKlxyXG4gKiBAcGFyYW0gaWQgVGhlIGZpbmFsIHN0YXRlIG5vZGUgSURcclxuICogQHBhcmFtIGRhdGEgVGhlIGRhdGEgdG8gcGFzcyBpbnRvIHRoZSBldmVudFxyXG4gKi9cblxuZnVuY3Rpb24gZG9uZUludm9rZShpZCwgZGF0YSkge1xuICB2YXIgdHlwZSA9IFwiXCIuY29uY2F0KEFjdGlvblR5cGVzLkRvbmVJbnZva2UsIFwiLlwiKS5jb25jYXQoaWQpO1xuICB2YXIgZXZlbnRPYmplY3QgPSB7XG4gICAgdHlwZTogdHlwZSxcbiAgICBkYXRhOiBkYXRhXG4gIH07XG5cbiAgZXZlbnRPYmplY3QudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHR5cGU7XG4gIH07XG5cbiAgcmV0dXJuIGV2ZW50T2JqZWN0O1xufVxuZnVuY3Rpb24gZXJyb3IoaWQsIGRhdGEpIHtcbiAgdmFyIHR5cGUgPSBcIlwiLmNvbmNhdChBY3Rpb25UeXBlcy5FcnJvclBsYXRmb3JtLCBcIi5cIikuY29uY2F0KGlkKTtcbiAgdmFyIGV2ZW50T2JqZWN0ID0ge1xuICAgIHR5cGU6IHR5cGUsXG4gICAgZGF0YTogZGF0YVxuICB9O1xuXG4gIGV2ZW50T2JqZWN0LnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0eXBlO1xuICB9O1xuXG4gIHJldHVybiBldmVudE9iamVjdDtcbn1cbmZ1bmN0aW9uIHB1cmUoZ2V0QWN0aW9ucykge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLlB1cmUsXG4gICAgZ2V0OiBnZXRBY3Rpb25zXG4gIH07XG59XG4vKipcclxuICogRm9yd2FyZHMgKHNlbmRzKSBhbiBldmVudCB0byBhIHNwZWNpZmllZCBzZXJ2aWNlLlxyXG4gKlxyXG4gKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgc2VydmljZSB0byBmb3J3YXJkIHRoZSBldmVudCB0by5cclxuICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyB0byBwYXNzIGludG8gdGhlIHNlbmQgYWN0aW9uIGNyZWF0b3IuXHJcbiAqL1xuXG5mdW5jdGlvbiBmb3J3YXJkVG8odGFyZ2V0LCBvcHRpb25zKSB7XG4gIGlmICghSVNfUFJPRFVDVElPTiAmJiAoIXRhcmdldCB8fCB0eXBlb2YgdGFyZ2V0ID09PSAnZnVuY3Rpb24nKSkge1xuICAgIHZhciBvcmlnaW5hbFRhcmdldF8xID0gdGFyZ2V0O1xuXG4gICAgdGFyZ2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGFyZ3MgPSBbXTtcblxuICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVzb2x2ZWRUYXJnZXQgPSB0eXBlb2Ygb3JpZ2luYWxUYXJnZXRfMSA9PT0gJ2Z1bmN0aW9uJyA/IG9yaWdpbmFsVGFyZ2V0XzEuYXBwbHkodm9pZCAwLCBfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQoYXJncyksIGZhbHNlKSkgOiBvcmlnaW5hbFRhcmdldF8xO1xuXG4gICAgICBpZiAoIXJlc29sdmVkVGFyZ2V0KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkF0dGVtcHRlZCB0byBmb3J3YXJkIGV2ZW50IHRvIHVuZGVmaW5lZCBhY3Rvci4gVGhpcyByaXNrcyBhbiBpbmZpbml0ZSBsb29wIGluIHRoZSBzZW5kZXIuXCIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzb2x2ZWRUYXJnZXQ7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBzZW5kKGZ1bmN0aW9uIChfLCBldmVudCkge1xuICAgIHJldHVybiBldmVudDtcbiAgfSwgX19hc3NpZ24oX19hc3NpZ24oe30sIG9wdGlvbnMpLCB7XG4gICAgdG86IHRhcmdldFxuICB9KSk7XG59XG4vKipcclxuICogRXNjYWxhdGVzIGFuIGVycm9yIGJ5IHNlbmRpbmcgaXQgYXMgYW4gZXZlbnQgdG8gdGhpcyBtYWNoaW5lJ3MgcGFyZW50LlxyXG4gKlxyXG4gKiBAcGFyYW0gZXJyb3JEYXRhIFRoZSBlcnJvciBkYXRhIHRvIHNlbmQsIG9yIHRoZSBleHByZXNzaW9uIGZ1bmN0aW9uIHRoYXRcclxuICogdGFrZXMgaW4gdGhlIGBjb250ZXh0YCwgYGV2ZW50YCwgYW5kIGBtZXRhYCwgYW5kIHJldHVybnMgdGhlIGVycm9yIGRhdGEgdG8gc2VuZC5cclxuICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyB0byBwYXNzIGludG8gdGhlIHNlbmQgYWN0aW9uIGNyZWF0b3IuXHJcbiAqL1xuXG5mdW5jdGlvbiBlc2NhbGF0ZShlcnJvckRhdGEsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIHNlbmRQYXJlbnQoZnVuY3Rpb24gKGNvbnRleHQsIGV2ZW50LCBtZXRhKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6IGVycm9yJDEsXG4gICAgICBkYXRhOiBpc0Z1bmN0aW9uKGVycm9yRGF0YSkgPyBlcnJvckRhdGEoY29udGV4dCwgZXZlbnQsIG1ldGEpIDogZXJyb3JEYXRhXG4gICAgfTtcbiAgfSwgX19hc3NpZ24oX19hc3NpZ24oe30sIG9wdGlvbnMpLCB7XG4gICAgdG86IFNwZWNpYWxUYXJnZXRzLlBhcmVudFxuICB9KSk7XG59XG5mdW5jdGlvbiBjaG9vc2UoY29uZHMpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5DaG9vc2UsXG4gICAgY29uZHM6IGNvbmRzXG4gIH07XG59XG5cbnZhciBwbHVja0Fzc2lnbnMgPSBmdW5jdGlvbiAoYWN0aW9uQmxvY2tzKSB7XG4gIHZhciBlXzEsIF9hO1xuXG4gIHZhciBhc3NpZ25BY3Rpb25zID0gW107XG5cbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBhY3Rpb25CbG9ja3NfMSA9IF9fdmFsdWVzKGFjdGlvbkJsb2NrcyksIGFjdGlvbkJsb2Nrc18xXzEgPSBhY3Rpb25CbG9ja3NfMS5uZXh0KCk7ICFhY3Rpb25CbG9ja3NfMV8xLmRvbmU7IGFjdGlvbkJsb2Nrc18xXzEgPSBhY3Rpb25CbG9ja3NfMS5uZXh0KCkpIHtcbiAgICAgIHZhciBibG9jayA9IGFjdGlvbkJsb2Nrc18xXzEudmFsdWU7XG4gICAgICB2YXIgaSA9IDA7XG5cbiAgICAgIHdoaWxlIChpIDwgYmxvY2suYWN0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKGJsb2NrLmFjdGlvbnNbaV0udHlwZSA9PT0gYXNzaWduJDEpIHtcbiAgICAgICAgICBhc3NpZ25BY3Rpb25zLnB1c2goYmxvY2suYWN0aW9uc1tpXSk7XG4gICAgICAgICAgYmxvY2suYWN0aW9ucy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlXzFfMSkge1xuICAgIGVfMSA9IHtcbiAgICAgIGVycm9yOiBlXzFfMVxuICAgIH07XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChhY3Rpb25CbG9ja3NfMV8xICYmICFhY3Rpb25CbG9ja3NfMV8xLmRvbmUgJiYgKF9hID0gYWN0aW9uQmxvY2tzXzEucmV0dXJuKSkgX2EuY2FsbChhY3Rpb25CbG9ja3NfMSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYXNzaWduQWN0aW9ucztcbn07XG5cbmZ1bmN0aW9uIHJlc29sdmVBY3Rpb25zKG1hY2hpbmUsIGN1cnJlbnRTdGF0ZSwgY3VycmVudENvbnRleHQsIF9ldmVudCwgYWN0aW9uQmxvY2tzLCBwcmVkaWN0YWJsZUV4ZWMsIHByZXNlcnZlQWN0aW9uT3JkZXIpIHtcbiAgaWYgKHByZXNlcnZlQWN0aW9uT3JkZXIgPT09IHZvaWQgMCkge1xuICAgIHByZXNlcnZlQWN0aW9uT3JkZXIgPSBmYWxzZTtcbiAgfVxuXG4gIHZhciBhc3NpZ25BY3Rpb25zID0gcHJlc2VydmVBY3Rpb25PcmRlciA/IFtdIDogcGx1Y2tBc3NpZ25zKGFjdGlvbkJsb2Nrcyk7XG4gIHZhciB1cGRhdGVkQ29udGV4dCA9IGFzc2lnbkFjdGlvbnMubGVuZ3RoID8gdXBkYXRlQ29udGV4dChjdXJyZW50Q29udGV4dCwgX2V2ZW50LCBhc3NpZ25BY3Rpb25zLCBjdXJyZW50U3RhdGUpIDogY3VycmVudENvbnRleHQ7XG4gIHZhciBwcmVzZXJ2ZWRDb250ZXh0cyA9IHByZXNlcnZlQWN0aW9uT3JkZXIgPyBbY3VycmVudENvbnRleHRdIDogdW5kZWZpbmVkO1xuICB2YXIgZGVmZXJyZWRUb0Jsb2NrRW5kID0gW107XG5cbiAgZnVuY3Rpb24gaGFuZGxlQWN0aW9uKGJsb2NrVHlwZSwgYWN0aW9uT2JqZWN0KSB7XG4gICAgdmFyIF9hO1xuXG4gICAgc3dpdGNoIChhY3Rpb25PYmplY3QudHlwZSkge1xuICAgICAgY2FzZSByYWlzZSQxOlxuICAgICAgICB7XG4gICAgICAgICAgdmFyIHJhaXNlZEFjdGlvbiA9IHJlc29sdmVSYWlzZShhY3Rpb25PYmplY3QsIHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQsIG1hY2hpbmUub3B0aW9ucy5kZWxheXMpO1xuXG4gICAgICAgICAgaWYgKHByZWRpY3RhYmxlRXhlYyAmJiB0eXBlb2YgcmFpc2VkQWN0aW9uLmRlbGF5ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgcHJlZGljdGFibGVFeGVjKHJhaXNlZEFjdGlvbiwgdXBkYXRlZENvbnRleHQsIF9ldmVudCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHJhaXNlZEFjdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICBjYXNlIHNlbmQkMTpcbiAgICAgICAgdmFyIHNlbmRBY3Rpb24gPSByZXNvbHZlU2VuZChhY3Rpb25PYmplY3QsIHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQsIG1hY2hpbmUub3B0aW9ucy5kZWxheXMpOyAvLyBUT0RPOiBmaXggQWN0aW9uVHlwZXMuSW5pdFxuXG4gICAgICAgIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgICAgICAgIHZhciBjb25maWd1cmVkRGVsYXkgPSBhY3Rpb25PYmplY3QuZGVsYXk7IC8vIHdhcm4gYWZ0ZXIgcmVzb2x2aW5nIGFzIHdlIGNhbiBjcmVhdGUgYmV0dGVyIGNvbnRleHR1YWwgbWVzc2FnZSBoZXJlXG5cbiAgICAgICAgICB3YXJuKCFpc1N0cmluZyhjb25maWd1cmVkRGVsYXkpIHx8IHR5cGVvZiBzZW5kQWN0aW9uLmRlbGF5ID09PSAnbnVtYmVyJywgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICAgICAgICAgIFwiTm8gZGVsYXkgcmVmZXJlbmNlIGZvciBkZWxheSBleHByZXNzaW9uICdcIi5jb25jYXQoY29uZmlndXJlZERlbGF5LCBcIicgd2FzIGZvdW5kIG9uIG1hY2hpbmUgJ1wiKS5jb25jYXQobWFjaGluZS5pZCwgXCInXCIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcmVkaWN0YWJsZUV4ZWMgJiYgc2VuZEFjdGlvbi50byAhPT0gU3BlY2lhbFRhcmdldHMuSW50ZXJuYWwpIHtcbiAgICAgICAgICBpZiAoYmxvY2tUeXBlID09PSAnZW50cnknKSB7XG4gICAgICAgICAgICBkZWZlcnJlZFRvQmxvY2tFbmQucHVzaChzZW5kQWN0aW9uKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJlZGljdGFibGVFeGVjKHNlbmRBY3Rpb24sIHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZW5kQWN0aW9uO1xuXG4gICAgICBjYXNlIGxvZyQxOlxuICAgICAgICB7XG4gICAgICAgICAgdmFyIHJlc29sdmVkID0gcmVzb2x2ZUxvZyhhY3Rpb25PYmplY3QsIHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQpO1xuICAgICAgICAgIHByZWRpY3RhYmxlRXhlYyA9PT0gbnVsbCB8fCBwcmVkaWN0YWJsZUV4ZWMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHByZWRpY3RhYmxlRXhlYyhyZXNvbHZlZCwgdXBkYXRlZENvbnRleHQsIF9ldmVudCk7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmVkO1xuICAgICAgICB9XG5cbiAgICAgIGNhc2UgY2hvb3NlJDE6XG4gICAgICAgIHtcbiAgICAgICAgICB2YXIgY2hvb3NlQWN0aW9uID0gYWN0aW9uT2JqZWN0O1xuICAgICAgICAgIHZhciBtYXRjaGVkQWN0aW9ucyA9IChfYSA9IGNob29zZUFjdGlvbi5jb25kcy5maW5kKGZ1bmN0aW9uIChjb25kaXRpb24pIHtcbiAgICAgICAgICAgIHZhciBndWFyZCA9IHRvR3VhcmQoY29uZGl0aW9uLmNvbmQsIG1hY2hpbmUub3B0aW9ucy5ndWFyZHMpO1xuICAgICAgICAgICAgcmV0dXJuICFndWFyZCB8fCBldmFsdWF0ZUd1YXJkKG1hY2hpbmUsIGd1YXJkLCB1cGRhdGVkQ29udGV4dCwgX2V2ZW50LCAhcHJlZGljdGFibGVFeGVjID8gY3VycmVudFN0YXRlIDogdW5kZWZpbmVkKTtcbiAgICAgICAgICB9KSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmFjdGlvbnM7XG5cbiAgICAgICAgICBpZiAoIW1hdGNoZWRBY3Rpb25zKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIF9iID0gX19yZWFkKHJlc29sdmVBY3Rpb25zKG1hY2hpbmUsIGN1cnJlbnRTdGF0ZSwgdXBkYXRlZENvbnRleHQsIF9ldmVudCwgW3tcbiAgICAgICAgICAgIHR5cGU6IGJsb2NrVHlwZSxcbiAgICAgICAgICAgIGFjdGlvbnM6IHRvQWN0aW9uT2JqZWN0cyh0b0FycmF5KG1hdGNoZWRBY3Rpb25zKSwgbWFjaGluZS5vcHRpb25zLmFjdGlvbnMpXG4gICAgICAgICAgfV0sIHByZWRpY3RhYmxlRXhlYywgcHJlc2VydmVBY3Rpb25PcmRlciksIDIpLFxuICAgICAgICAgICAgICByZXNvbHZlZEFjdGlvbnNGcm9tQ2hvb3NlID0gX2JbMF0sXG4gICAgICAgICAgICAgIHJlc29sdmVkQ29udGV4dEZyb21DaG9vc2UgPSBfYlsxXTtcblxuICAgICAgICAgIHVwZGF0ZWRDb250ZXh0ID0gcmVzb2x2ZWRDb250ZXh0RnJvbUNob29zZTtcbiAgICAgICAgICBwcmVzZXJ2ZWRDb250ZXh0cyA9PT0gbnVsbCB8fCBwcmVzZXJ2ZWRDb250ZXh0cyA9PT0gdm9pZCAwID8gdm9pZCAwIDogcHJlc2VydmVkQ29udGV4dHMucHVzaCh1cGRhdGVkQ29udGV4dCk7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmVkQWN0aW9uc0Zyb21DaG9vc2U7XG4gICAgICAgIH1cblxuICAgICAgY2FzZSBwdXJlJDE6XG4gICAgICAgIHtcbiAgICAgICAgICB2YXIgbWF0Y2hlZEFjdGlvbnMgPSBhY3Rpb25PYmplY3QuZ2V0KHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQuZGF0YSk7XG5cbiAgICAgICAgICBpZiAoIW1hdGNoZWRBY3Rpb25zKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIF9jID0gX19yZWFkKHJlc29sdmVBY3Rpb25zKG1hY2hpbmUsIGN1cnJlbnRTdGF0ZSwgdXBkYXRlZENvbnRleHQsIF9ldmVudCwgW3tcbiAgICAgICAgICAgIHR5cGU6IGJsb2NrVHlwZSxcbiAgICAgICAgICAgIGFjdGlvbnM6IHRvQWN0aW9uT2JqZWN0cyh0b0FycmF5KG1hdGNoZWRBY3Rpb25zKSwgbWFjaGluZS5vcHRpb25zLmFjdGlvbnMpXG4gICAgICAgICAgfV0sIHByZWRpY3RhYmxlRXhlYywgcHJlc2VydmVBY3Rpb25PcmRlciksIDIpLFxuICAgICAgICAgICAgICByZXNvbHZlZEFjdGlvbnNGcm9tUHVyZSA9IF9jWzBdLFxuICAgICAgICAgICAgICByZXNvbHZlZENvbnRleHQgPSBfY1sxXTtcblxuICAgICAgICAgIHVwZGF0ZWRDb250ZXh0ID0gcmVzb2x2ZWRDb250ZXh0O1xuICAgICAgICAgIHByZXNlcnZlZENvbnRleHRzID09PSBudWxsIHx8IHByZXNlcnZlZENvbnRleHRzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwcmVzZXJ2ZWRDb250ZXh0cy5wdXNoKHVwZGF0ZWRDb250ZXh0KTtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZWRBY3Rpb25zRnJvbVB1cmU7XG4gICAgICAgIH1cblxuICAgICAgY2FzZSBzdG9wJDE6XG4gICAgICAgIHtcbiAgICAgICAgICB2YXIgcmVzb2x2ZWQgPSByZXNvbHZlU3RvcChhY3Rpb25PYmplY3QsIHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQpO1xuICAgICAgICAgIHByZWRpY3RhYmxlRXhlYyA9PT0gbnVsbCB8fCBwcmVkaWN0YWJsZUV4ZWMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHByZWRpY3RhYmxlRXhlYyhyZXNvbHZlZCwgY3VycmVudENvbnRleHQsIF9ldmVudCk7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmVkO1xuICAgICAgICB9XG5cbiAgICAgIGNhc2UgYXNzaWduJDE6XG4gICAgICAgIHtcbiAgICAgICAgICB1cGRhdGVkQ29udGV4dCA9IHVwZGF0ZUNvbnRleHQodXBkYXRlZENvbnRleHQsIF9ldmVudCwgW2FjdGlvbk9iamVjdF0sICFwcmVkaWN0YWJsZUV4ZWMgPyBjdXJyZW50U3RhdGUgOiB1bmRlZmluZWQpO1xuICAgICAgICAgIHByZXNlcnZlZENvbnRleHRzID09PSBudWxsIHx8IHByZXNlcnZlZENvbnRleHRzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwcmVzZXJ2ZWRDb250ZXh0cy5wdXNoKHVwZGF0ZWRDb250ZXh0KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB2YXIgcmVzb2x2ZWRBY3Rpb25PYmplY3QgPSB0b0FjdGlvbk9iamVjdChhY3Rpb25PYmplY3QsIG1hY2hpbmUub3B0aW9ucy5hY3Rpb25zKTtcbiAgICAgICAgdmFyIGV4ZWNfMSA9IHJlc29sdmVkQWN0aW9uT2JqZWN0LmV4ZWM7XG5cbiAgICAgICAgaWYgKHByZWRpY3RhYmxlRXhlYykge1xuICAgICAgICAgIHByZWRpY3RhYmxlRXhlYyhyZXNvbHZlZEFjdGlvbk9iamVjdCwgdXBkYXRlZENvbnRleHQsIF9ldmVudCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXhlY18xICYmIHByZXNlcnZlZENvbnRleHRzKSB7XG4gICAgICAgICAgdmFyIGNvbnRleHRJbmRleF8xID0gcHJlc2VydmVkQ29udGV4dHMubGVuZ3RoIC0gMTtcblxuICAgICAgICAgIHZhciB3cmFwcGVkID0gX19hc3NpZ24oX19hc3NpZ24oe30sIHJlc29sdmVkQWN0aW9uT2JqZWN0KSwge1xuICAgICAgICAgICAgZXhlYzogZnVuY3Rpb24gKF9jdHgpIHtcbiAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBbXTtcblxuICAgICAgICAgICAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgIGFyZ3NbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBleGVjXzEuYXBwbHkodm9pZCAwLCBfX3NwcmVhZEFycmF5KFtwcmVzZXJ2ZWRDb250ZXh0c1tjb250ZXh0SW5kZXhfMV1dLCBfX3JlYWQoYXJncyksIGZhbHNlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXNvbHZlZEFjdGlvbk9iamVjdCA9IHdyYXBwZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzb2x2ZWRBY3Rpb25PYmplY3Q7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcHJvY2Vzc0Jsb2NrKGJsb2NrKSB7XG4gICAgdmFyIGVfMiwgX2E7XG5cbiAgICB2YXIgcmVzb2x2ZWRBY3Rpb25zID0gW107XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2IgPSBfX3ZhbHVlcyhibG9jay5hY3Rpb25zKSwgX2MgPSBfYi5uZXh0KCk7ICFfYy5kb25lOyBfYyA9IF9iLm5leHQoKSkge1xuICAgICAgICB2YXIgYWN0aW9uID0gX2MudmFsdWU7XG4gICAgICAgIHZhciByZXNvbHZlZCA9IGhhbmRsZUFjdGlvbihibG9jay50eXBlLCBhY3Rpb24pO1xuXG4gICAgICAgIGlmIChyZXNvbHZlZCkge1xuICAgICAgICAgIHJlc29sdmVkQWN0aW9ucyA9IHJlc29sdmVkQWN0aW9ucy5jb25jYXQocmVzb2x2ZWQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV8yXzEpIHtcbiAgICAgIGVfMiA9IHtcbiAgICAgICAgZXJyb3I6IGVfMl8xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoX2MgJiYgIV9jLmRvbmUgJiYgKF9hID0gX2IucmV0dXJuKSkgX2EuY2FsbChfYik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV8yKSB0aHJvdyBlXzIuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZGVmZXJyZWRUb0Jsb2NrRW5kLmZvckVhY2goZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgcHJlZGljdGFibGVFeGVjKGFjdGlvbiwgdXBkYXRlZENvbnRleHQsIF9ldmVudCk7XG4gICAgfSk7XG4gICAgZGVmZXJyZWRUb0Jsb2NrRW5kLmxlbmd0aCA9IDA7XG4gICAgcmV0dXJuIHJlc29sdmVkQWN0aW9ucztcbiAgfVxuXG4gIHZhciByZXNvbHZlZEFjdGlvbnMgPSBmbGF0dGVuKGFjdGlvbkJsb2Nrcy5tYXAocHJvY2Vzc0Jsb2NrKSk7XG4gIHJldHVybiBbcmVzb2x2ZWRBY3Rpb25zLCB1cGRhdGVkQ29udGV4dF07XG59XG5cbmV4cG9ydCB7IGFmdGVyLCBhc3NpZ24sIGNhbmNlbCwgY2hvb3NlLCBkb25lLCBkb25lSW52b2tlLCBlcnJvciwgZXNjYWxhdGUsIGZvcndhcmRUbywgZ2V0QWN0aW9uRnVuY3Rpb24sIGluaXRFdmVudCwgaXNBY3Rpb25PYmplY3QsIGxvZywgcHVyZSwgcmFpc2UsIHJlc29sdmVBY3Rpb25zLCByZXNvbHZlTG9nLCByZXNvbHZlUmFpc2UsIHJlc29sdmVTZW5kLCByZXNvbHZlU3RvcCwgcmVzcG9uZCwgc2VuZCwgc2VuZFBhcmVudCwgc2VuZFRvLCBzZW5kVXBkYXRlLCBzdGFydCwgc3RvcCwgdG9BY3Rpb25PYmplY3QsIHRvQWN0aW9uT2JqZWN0cywgdG9BY3Rpdml0eURlZmluaXRpb24gfTtcbiIsImltcG9ydCB7IGVycm9yLCBkb25lSW52b2tlIH0gZnJvbSAnLi9hY3Rpb25zLmpzJztcbmltcG9ydCB7IHRvQWN0b3JSZWYgfSBmcm9tICcuL0FjdG9yLmpzJztcbmltcG9ydCB7IHRvT2JzZXJ2ZXIgfSBmcm9tICcuL3V0aWxzLmpzJztcblxuLyoqXHJcbiAqIFJldHVybnMgYW4gYWN0b3IgYmVoYXZpb3IgZnJvbSBhIHJlZHVjZXIgYW5kIGl0cyBpbml0aWFsIHN0YXRlLlxyXG4gKlxyXG4gKiBAcGFyYW0gdHJhbnNpdGlvbiBUaGUgcHVyZSByZWR1Y2VyIHRoYXQgcmV0dXJucyB0aGUgbmV4dCBzdGF0ZSBnaXZlbiB0aGUgY3VycmVudCBzdGF0ZSBhbmQgZXZlbnQuXHJcbiAqIEBwYXJhbSBpbml0aWFsU3RhdGUgVGhlIGluaXRpYWwgc3RhdGUgb2YgdGhlIHJlZHVjZXIuXHJcbiAqIEByZXR1cm5zIEFuIGFjdG9yIGJlaGF2aW9yXHJcbiAqL1xuXG5mdW5jdGlvbiBmcm9tUmVkdWNlcih0cmFuc2l0aW9uLCBpbml0aWFsU3RhdGUpIHtcbiAgcmV0dXJuIHtcbiAgICB0cmFuc2l0aW9uOiB0cmFuc2l0aW9uLFxuICAgIGluaXRpYWxTdGF0ZTogaW5pdGlhbFN0YXRlXG4gIH07XG59XG5mdW5jdGlvbiBmcm9tUHJvbWlzZShwcm9taXNlRm4pIHtcbiAgdmFyIGluaXRpYWxTdGF0ZSA9IHtcbiAgICBlcnJvcjogdW5kZWZpbmVkLFxuICAgIGRhdGE6IHVuZGVmaW5lZCxcbiAgICBzdGF0dXM6ICdwZW5kaW5nJ1xuICB9O1xuICByZXR1cm4ge1xuICAgIHRyYW5zaXRpb246IGZ1bmN0aW9uIChzdGF0ZSwgZXZlbnQsIF9hKSB7XG4gICAgICB2YXIgcGFyZW50ID0gX2EucGFyZW50LFxuICAgICAgICAgIGlkID0gX2EuaWQsXG4gICAgICAgICAgb2JzZXJ2ZXJzID0gX2Eub2JzZXJ2ZXJzO1xuXG4gICAgICBzd2l0Y2ggKGV2ZW50LnR5cGUpIHtcbiAgICAgICAgY2FzZSAnZnVsZmlsbCc6XG4gICAgICAgICAgcGFyZW50ID09PSBudWxsIHx8IHBhcmVudCA9PT0gdm9pZCAwID8gdm9pZCAwIDogcGFyZW50LnNlbmQoZG9uZUludm9rZShpZCwgZXZlbnQuZGF0YSkpO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBlcnJvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgZGF0YTogZXZlbnQuZGF0YSxcbiAgICAgICAgICAgIHN0YXR1czogJ2Z1bGZpbGxlZCdcbiAgICAgICAgICB9O1xuXG4gICAgICAgIGNhc2UgJ3JlamVjdCc6XG4gICAgICAgICAgcGFyZW50ID09PSBudWxsIHx8IHBhcmVudCA9PT0gdm9pZCAwID8gdm9pZCAwIDogcGFyZW50LnNlbmQoZXJyb3IoaWQsIGV2ZW50LmVycm9yKSk7XG4gICAgICAgICAgb2JzZXJ2ZXJzLmZvckVhY2goZnVuY3Rpb24gKG9ic2VydmVyKSB7XG4gICAgICAgICAgICBvYnNlcnZlci5lcnJvcihldmVudC5lcnJvcik7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVycm9yOiBldmVudC5lcnJvcixcbiAgICAgICAgICAgIGRhdGE6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHN0YXR1czogJ3JlamVjdGVkJ1xuICAgICAgICAgIH07XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICB9XG4gICAgfSxcbiAgICBpbml0aWFsU3RhdGU6IGluaXRpYWxTdGF0ZSxcbiAgICBzdGFydDogZnVuY3Rpb24gKF9hKSB7XG4gICAgICB2YXIgc2VsZiA9IF9hLnNlbGY7XG4gICAgICBwcm9taXNlRm4oKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHNlbGYuc2VuZCh7XG4gICAgICAgICAgdHlwZTogJ2Z1bGZpbGwnLFxuICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgICAgfSk7XG4gICAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgIHNlbGYuc2VuZCh7XG4gICAgICAgICAgdHlwZTogJ3JlamVjdCcsXG4gICAgICAgICAgZXJyb3I6IHJlYXNvblxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGluaXRpYWxTdGF0ZTtcbiAgICB9XG4gIH07XG59XG5mdW5jdGlvbiBzcGF3bkJlaGF2aW9yKGJlaGF2aW9yLCBvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zID09PSB2b2lkIDApIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cblxuICB2YXIgc3RhdGUgPSBiZWhhdmlvci5pbml0aWFsU3RhdGU7XG4gIHZhciBvYnNlcnZlcnMgPSBuZXcgU2V0KCk7XG4gIHZhciBtYWlsYm94ID0gW107XG4gIHZhciBmbHVzaGluZyA9IGZhbHNlO1xuXG4gIHZhciBmbHVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoZmx1c2hpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmbHVzaGluZyA9IHRydWU7XG5cbiAgICB3aGlsZSAobWFpbGJveC5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgZXZlbnRfMSA9IG1haWxib3guc2hpZnQoKTtcbiAgICAgIHN0YXRlID0gYmVoYXZpb3IudHJhbnNpdGlvbihzdGF0ZSwgZXZlbnRfMSwgYWN0b3JDdHgpO1xuICAgICAgb2JzZXJ2ZXJzLmZvckVhY2goZnVuY3Rpb24gKG9ic2VydmVyKSB7XG4gICAgICAgIHJldHVybiBvYnNlcnZlci5uZXh0KHN0YXRlKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZsdXNoaW5nID0gZmFsc2U7XG4gIH07XG5cbiAgdmFyIGFjdG9yID0gdG9BY3RvclJlZih7XG4gICAgaWQ6IG9wdGlvbnMuaWQsXG4gICAgc2VuZDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBtYWlsYm94LnB1c2goZXZlbnQpO1xuICAgICAgZmx1c2goKTtcbiAgICB9LFxuICAgIGdldFNuYXBzaG90OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfSxcbiAgICBzdWJzY3JpYmU6IGZ1bmN0aW9uIChuZXh0LCBoYW5kbGVFcnJvciwgY29tcGxldGUpIHtcbiAgICAgIHZhciBvYnNlcnZlciA9IHRvT2JzZXJ2ZXIobmV4dCwgaGFuZGxlRXJyb3IsIGNvbXBsZXRlKTtcbiAgICAgIG9ic2VydmVycy5hZGQob2JzZXJ2ZXIpO1xuICAgICAgb2JzZXJ2ZXIubmV4dChzdGF0ZSk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIG9ic2VydmVycy5kZWxldGUob2JzZXJ2ZXIpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG4gIHZhciBhY3RvckN0eCA9IHtcbiAgICBwYXJlbnQ6IG9wdGlvbnMucGFyZW50LFxuICAgIHNlbGY6IGFjdG9yLFxuICAgIGlkOiBvcHRpb25zLmlkIHx8ICdhbm9ueW1vdXMnLFxuICAgIG9ic2VydmVyczogb2JzZXJ2ZXJzXG4gIH07XG4gIHN0YXRlID0gYmVoYXZpb3Iuc3RhcnQgPyBiZWhhdmlvci5zdGFydChhY3RvckN0eCkgOiBzdGF0ZTtcbiAgcmV0dXJuIGFjdG9yO1xufVxuXG5leHBvcnQgeyBmcm9tUHJvbWlzZSwgZnJvbVJlZHVjZXIsIHNwYXduQmVoYXZpb3IgfTtcbiIsInZhciBTVEFURV9ERUxJTUlURVIgPSAnLic7XG52YXIgRU1QVFlfQUNUSVZJVFlfTUFQID0ge307XG52YXIgREVGQVVMVF9HVUFSRF9UWVBFID0gJ3hzdGF0ZS5ndWFyZCc7XG52YXIgVEFSR0VUTEVTU19LRVkgPSAnJztcblxuZXhwb3J0IHsgREVGQVVMVF9HVUFSRF9UWVBFLCBFTVBUWV9BQ1RJVklUWV9NQVAsIFNUQVRFX0RFTElNSVRFUiwgVEFSR0VUTEVTU19LRVkgfTtcbiIsImltcG9ydCB7IElTX1BST0RVQ1RJT04gfSBmcm9tICcuL2Vudmlyb25tZW50LmpzJztcblxuZnVuY3Rpb24gZ2V0R2xvYmFsKCkge1xuICBpZiAodHlwZW9mIGdsb2JhbFRoaXMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGdsb2JhbFRoaXM7XG4gIH1cblxuICBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIHNlbGY7XG4gIH1cblxuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gd2luZG93O1xuICB9XG5cbiAgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGdsb2JhbDtcbiAgfVxuXG4gIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgIGNvbnNvbGUud2FybignWFN0YXRlIGNvdWxkIG5vdCBmaW5kIGEgZ2xvYmFsIG9iamVjdCBpbiB0aGlzIGVudmlyb25tZW50LiBQbGVhc2UgbGV0IHRoZSBtYWludGFpbmVycyBrbm93IGFuZCByYWlzZSBhbiBpc3N1ZSBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vc3RhdGVseWFpL3hzdGF0ZS9pc3N1ZXMnKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXREZXZUb29scygpIHtcbiAgdmFyIGdsb2JhbCA9IGdldEdsb2JhbCgpO1xuXG4gIGlmIChnbG9iYWwgJiYgJ19feHN0YXRlX18nIGluIGdsb2JhbCkge1xuICAgIHJldHVybiBnbG9iYWwuX194c3RhdGVfXztcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyU2VydmljZShzZXJ2aWNlKSB7XG4gIGlmICghZ2V0R2xvYmFsKCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgZGV2VG9vbHMgPSBnZXREZXZUb29scygpO1xuXG4gIGlmIChkZXZUb29scykge1xuICAgIGRldlRvb2xzLnJlZ2lzdGVyKHNlcnZpY2UpO1xuICB9XG59XG5cbmV4cG9ydCB7IGdldEdsb2JhbCwgcmVnaXN0ZXJTZXJ2aWNlIH07XG4iLCJ2YXIgSVNfUFJPRFVDVElPTiA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbic7XG5cbmV4cG9ydCB7IElTX1BST0RVQ1RJT04gfTtcbiIsImltcG9ydCB7IGFzc2lnbiBhcyBhc3NpZ24kMSwgY2FuY2VsIGFzIGNhbmNlbCQxLCBzZW5kIGFzIHNlbmQkMSwgc2VuZFRvIGFzIHNlbmRUbyQxLCBzZW5kUGFyZW50IGFzIHNlbmRQYXJlbnQkMSwgc2VuZFVwZGF0ZSBhcyBzZW5kVXBkYXRlJDEsIGZvcndhcmRUbyBhcyBmb3J3YXJkVG8kMSwgZG9uZUludm9rZSBhcyBkb25lSW52b2tlJDEsIHJhaXNlIGFzIHJhaXNlJDEsIGxvZyBhcyBsb2ckMSwgcHVyZSBhcyBwdXJlJDEsIGNob29zZSBhcyBjaG9vc2UkMSwgc3RvcCBhcyBzdG9wJDEgfSBmcm9tICcuL2FjdGlvbnMuanMnO1xuaW1wb3J0ICogYXMgYWN0aW9ucyBmcm9tICcuL2FjdGlvbnMuanMnO1xuZXhwb3J0IHsgYWN0aW9ucyB9O1xuZXhwb3J0IHsgdG9BY3RvclJlZiB9IGZyb20gJy4vQWN0b3IuanMnO1xuZXhwb3J0IHsgSW50ZXJwcmV0ZXIsIEludGVycHJldGVyU3RhdHVzLCBpbnRlcnByZXQsIHNwYXduIH0gZnJvbSAnLi9pbnRlcnByZXRlci5qcyc7XG5leHBvcnQgeyBNYWNoaW5lLCBjcmVhdGVNYWNoaW5lIH0gZnJvbSAnLi9NYWNoaW5lLmpzJztcbmV4cG9ydCB7IG1hcFN0YXRlIH0gZnJvbSAnLi9tYXBTdGF0ZS5qcyc7XG5leHBvcnQgeyBtYXRjaFN0YXRlIH0gZnJvbSAnLi9tYXRjaC5qcyc7XG5leHBvcnQgeyBjcmVhdGVTY2hlbWEsIHQgfSBmcm9tICcuL3NjaGVtYS5qcyc7XG5leHBvcnQgeyBTdGF0ZSB9IGZyb20gJy4vU3RhdGUuanMnO1xuZXhwb3J0IHsgU3RhdGVOb2RlIH0gZnJvbSAnLi9TdGF0ZU5vZGUuanMnO1xuZXhwb3J0IHsgc3Bhd25CZWhhdmlvciB9IGZyb20gJy4vYmVoYXZpb3JzLmpzJztcbmV4cG9ydCB7IEFjdGlvblR5cGVzLCBTcGVjaWFsVGFyZ2V0cyB9IGZyb20gJy4vdHlwZXMuanMnO1xuZXhwb3J0IHsgbWF0Y2hlc1N0YXRlLCB0b0V2ZW50T2JqZWN0LCB0b09ic2VydmVyLCB0b1NDWE1MRXZlbnQgfSBmcm9tICcuL3V0aWxzLmpzJztcblxudmFyIGFzc2lnbiA9IGFzc2lnbiQxLFxuICAgIGNhbmNlbCA9IGNhbmNlbCQxLFxuICAgIHNlbmQgPSBzZW5kJDEsXG4gICAgc2VuZFRvID0gc2VuZFRvJDEsXG4gICAgc2VuZFBhcmVudCA9IHNlbmRQYXJlbnQkMSxcbiAgICBzZW5kVXBkYXRlID0gc2VuZFVwZGF0ZSQxLFxuICAgIGZvcndhcmRUbyA9IGZvcndhcmRUbyQxLFxuICAgIGRvbmVJbnZva2UgPSBkb25lSW52b2tlJDEsXG4gICAgcmFpc2UgPSByYWlzZSQxLFxuICAgIGxvZyA9IGxvZyQxLFxuICAgIHB1cmUgPSBwdXJlJDEsXG4gICAgY2hvb3NlID0gY2hvb3NlJDEsXG4gICAgc3RvcCA9IHN0b3AkMTtcblxuZXhwb3J0IHsgYXNzaWduLCBjYW5jZWwsIGNob29zZSwgZG9uZUludm9rZSwgZm9yd2FyZFRvLCBsb2csIHB1cmUsIHJhaXNlLCBzZW5kLCBzZW5kUGFyZW50LCBzZW5kVG8sIHNlbmRVcGRhdGUsIHN0b3AgfTtcbiIsImltcG9ydCB7IF9fdmFsdWVzLCBfX3NwcmVhZEFycmF5LCBfX3JlYWQsIF9fYXNzaWduIH0gZnJvbSAnLi9fdmlydHVhbC9fdHNsaWIuanMnO1xuaW1wb3J0IHsgU3BlY2lhbFRhcmdldHMsIEFjdGlvblR5cGVzIH0gZnJvbSAnLi90eXBlcy5qcyc7XG5pbXBvcnQgeyBpc1N0YXRlQ29uZmlnLCBTdGF0ZSwgYmluZEFjdGlvblRvU3RhdGUgfSBmcm9tICcuL1N0YXRlLmpzJztcbmltcG9ydCB7IGVycm9yUGxhdGZvcm0sIHVwZGF0ZSwgZXJyb3IgYXMgZXJyb3IkMSwgbG9nLCBzdG9wLCBzdGFydCwgY2FuY2VsLCBzZW5kLCByYWlzZSB9IGZyb20gJy4vYWN0aW9uVHlwZXMuanMnO1xuaW1wb3J0IHsgaW5pdEV2ZW50LCBkb25lSW52b2tlLCB0b0FjdGlvbk9iamVjdHMsIHJlc29sdmVBY3Rpb25zLCBlcnJvciwgZ2V0QWN0aW9uRnVuY3Rpb24gfSBmcm9tICcuL2FjdGlvbnMuanMnO1xuaW1wb3J0IHsgSVNfUFJPRFVDVElPTiB9IGZyb20gJy4vZW52aXJvbm1lbnQuanMnO1xuaW1wb3J0IHsgd2FybiwgbWFwQ29udGV4dCwgdG9PYnNlcnZlciwgaXNGdW5jdGlvbiwgdG9TQ1hNTEV2ZW50LCBmbGF0dGVuLCBpc1JhaXNhYmxlQWN0aW9uLCBpc1Byb21pc2VMaWtlLCBpc09ic2VydmFibGUsIGlzTWFjaGluZSwgaXNCZWhhdmlvciwgcmVwb3J0VW5oYW5kbGVkRXhjZXB0aW9uT25JbnZvY2F0aW9uLCBzeW1ib2xPYnNlcnZhYmxlLCBpc0FycmF5LCB0b0V2ZW50T2JqZWN0LCBpc1N0cmluZywgaXNBY3RvciwgdG9JbnZva2VTb3VyY2UsIHVuaXF1ZUlkIH0gZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQgeyBTY2hlZHVsZXIgfSBmcm9tICcuL3NjaGVkdWxlci5qcyc7XG5pbXBvcnQgeyBjcmVhdGVEZWZlcnJlZEFjdG9yLCBpc1NwYXduZWRBY3RvciB9IGZyb20gJy4vQWN0b3IuanMnO1xuaW1wb3J0IHsgcmVnaXN0cnkgfSBmcm9tICcuL3JlZ2lzdHJ5LmpzJztcbmltcG9ydCB7IGdldEdsb2JhbCwgcmVnaXN0ZXJTZXJ2aWNlIH0gZnJvbSAnLi9kZXZUb29scy5qcyc7XG5pbXBvcnQgeyBwcm92aWRlLCBjb25zdW1lIH0gZnJvbSAnLi9zZXJ2aWNlU2NvcGUuanMnO1xuaW1wb3J0IHsgc3Bhd25CZWhhdmlvciB9IGZyb20gJy4vYmVoYXZpb3JzLmpzJztcblxudmFyIERFRkFVTFRfU1BBV05fT1BUSU9OUyA9IHtcbiAgc3luYzogZmFsc2UsXG4gIGF1dG9Gb3J3YXJkOiBmYWxzZVxufTtcbnZhciBJbnRlcnByZXRlclN0YXR1cztcblxuKGZ1bmN0aW9uIChJbnRlcnByZXRlclN0YXR1cykge1xuICBJbnRlcnByZXRlclN0YXR1c1tJbnRlcnByZXRlclN0YXR1c1tcIk5vdFN0YXJ0ZWRcIl0gPSAwXSA9IFwiTm90U3RhcnRlZFwiO1xuICBJbnRlcnByZXRlclN0YXR1c1tJbnRlcnByZXRlclN0YXR1c1tcIlJ1bm5pbmdcIl0gPSAxXSA9IFwiUnVubmluZ1wiO1xuICBJbnRlcnByZXRlclN0YXR1c1tJbnRlcnByZXRlclN0YXR1c1tcIlN0b3BwZWRcIl0gPSAyXSA9IFwiU3RvcHBlZFwiO1xufSkoSW50ZXJwcmV0ZXJTdGF0dXMgfHwgKEludGVycHJldGVyU3RhdHVzID0ge30pKTtcblxudmFyIEludGVycHJldGVyID1cbi8qI19fUFVSRV9fKi9cblxuLyoqIEBjbGFzcyAqL1xuZnVuY3Rpb24gKCkge1xuICAvKipcclxuICAgKiBDcmVhdGVzIGEgbmV3IEludGVycHJldGVyIGluc3RhbmNlIChpLmUuLCBzZXJ2aWNlKSBmb3IgdGhlIGdpdmVuIG1hY2hpbmUgd2l0aCB0aGUgcHJvdmlkZWQgb3B0aW9ucywgaWYgYW55LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIG1hY2hpbmUgVGhlIG1hY2hpbmUgdG8gYmUgaW50ZXJwcmV0ZWRcclxuICAgKiBAcGFyYW0gb3B0aW9ucyBJbnRlcnByZXRlciBvcHRpb25zXHJcbiAgICovXG4gIGZ1bmN0aW9uIEludGVycHJldGVyKG1hY2hpbmUsIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgICBvcHRpb25zID0gSW50ZXJwcmV0ZXIuZGVmYXVsdE9wdGlvbnM7XG4gICAgfVxuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHRoaXMubWFjaGluZSA9IG1hY2hpbmU7XG4gICAgdGhpcy5kZWxheWVkRXZlbnRzTWFwID0ge307XG4gICAgdGhpcy5saXN0ZW5lcnMgPSBuZXcgU2V0KCk7XG4gICAgdGhpcy5jb250ZXh0TGlzdGVuZXJzID0gbmV3IFNldCgpO1xuICAgIHRoaXMuc3RvcExpc3RlbmVycyA9IG5ldyBTZXQoKTtcbiAgICB0aGlzLmRvbmVMaXN0ZW5lcnMgPSBuZXcgU2V0KCk7XG4gICAgdGhpcy5ldmVudExpc3RlbmVycyA9IG5ldyBTZXQoKTtcbiAgICB0aGlzLnNlbmRMaXN0ZW5lcnMgPSBuZXcgU2V0KCk7XG4gICAgLyoqXHJcbiAgICAgKiBXaGV0aGVyIHRoZSBzZXJ2aWNlIGlzIHN0YXJ0ZWQuXHJcbiAgICAgKi9cblxuICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICB0aGlzLnN0YXR1cyA9IEludGVycHJldGVyU3RhdHVzLk5vdFN0YXJ0ZWQ7XG4gICAgdGhpcy5jaGlsZHJlbiA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmZvcndhcmRUbyA9IG5ldyBTZXQoKTtcbiAgICB0aGlzLl9vdXRnb2luZ1F1ZXVlID0gW107XG4gICAgLyoqXHJcbiAgICAgKiBBbGlhcyBmb3IgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnN0YXJ0XHJcbiAgICAgKi9cblxuICAgIHRoaXMuaW5pdCA9IHRoaXMuc3RhcnQ7XG4gICAgLyoqXHJcbiAgICAgKiBTZW5kcyBhbiBldmVudCB0byB0aGUgcnVubmluZyBpbnRlcnByZXRlciB0byB0cmlnZ2VyIGEgdHJhbnNpdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBBbiBhcnJheSBvZiBldmVudHMgKGJhdGNoZWQpIGNhbiBiZSBzZW50IGFzIHdlbGwsIHdoaWNoIHdpbGwgc2VuZCBhbGxcclxuICAgICAqIGJhdGNoZWQgZXZlbnRzIHRvIHRoZSBydW5uaW5nIGludGVycHJldGVyLiBUaGUgbGlzdGVuZXJzIHdpbGwgYmVcclxuICAgICAqIG5vdGlmaWVkIG9ubHkgKipvbmNlKiogd2hlbiBhbGwgZXZlbnRzIGFyZSBwcm9jZXNzZWQuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGV2ZW50IFRoZSBldmVudChzKSB0byBzZW5kXHJcbiAgICAgKi9cblxuICAgIHRoaXMuc2VuZCA9IGZ1bmN0aW9uIChldmVudCwgcGF5bG9hZCkge1xuICAgICAgaWYgKGlzQXJyYXkoZXZlbnQpKSB7XG4gICAgICAgIF90aGlzLmJhdGNoKGV2ZW50KTtcblxuICAgICAgICByZXR1cm4gX3RoaXMuc3RhdGU7XG4gICAgICB9XG5cbiAgICAgIHZhciBfZXZlbnQgPSB0b1NDWE1MRXZlbnQodG9FdmVudE9iamVjdChldmVudCwgcGF5bG9hZCkpO1xuXG4gICAgICBpZiAoX3RoaXMuc3RhdHVzID09PSBJbnRlcnByZXRlclN0YXR1cy5TdG9wcGVkKSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICAgICAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgICAgICAgd2FybihmYWxzZSwgXCJFdmVudCBcXFwiXCIuY29uY2F0KF9ldmVudC5uYW1lLCBcIlxcXCIgd2FzIHNlbnQgdG8gc3RvcHBlZCBzZXJ2aWNlIFxcXCJcIikuY29uY2F0KF90aGlzLm1hY2hpbmUuaWQsIFwiXFxcIi4gVGhpcyBzZXJ2aWNlIGhhcyBhbHJlYWR5IHJlYWNoZWQgaXRzIGZpbmFsIHN0YXRlLCBhbmQgd2lsbCBub3QgdHJhbnNpdGlvbi5cXG5FdmVudDogXCIpLmNvbmNhdChKU09OLnN0cmluZ2lmeShfZXZlbnQuZGF0YSkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBfdGhpcy5zdGF0ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKF90aGlzLnN0YXR1cyAhPT0gSW50ZXJwcmV0ZXJTdGF0dXMuUnVubmluZyAmJiAhX3RoaXMub3B0aW9ucy5kZWZlckV2ZW50cykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFdmVudCBcXFwiXCIuY29uY2F0KF9ldmVudC5uYW1lLCBcIlxcXCIgd2FzIHNlbnQgdG8gdW5pbml0aWFsaXplZCBzZXJ2aWNlIFxcXCJcIikuY29uY2F0KF90aGlzLm1hY2hpbmUuaWQgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICAgICAgICAsIFwiXFxcIi4gTWFrZSBzdXJlIC5zdGFydCgpIGlzIGNhbGxlZCBmb3IgdGhpcyBzZXJ2aWNlLCBvciBzZXQgeyBkZWZlckV2ZW50czogdHJ1ZSB9IGluIHRoZSBzZXJ2aWNlIG9wdGlvbnMuXFxuRXZlbnQ6IFwiKS5jb25jYXQoSlNPTi5zdHJpbmdpZnkoX2V2ZW50LmRhdGEpKSk7XG4gICAgICB9XG5cbiAgICAgIF90aGlzLnNjaGVkdWxlci5zY2hlZHVsZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIEZvcndhcmQgY29weSBvZiBldmVudCB0byBjaGlsZCBhY3RvcnNcbiAgICAgICAgX3RoaXMuZm9yd2FyZChfZXZlbnQpO1xuXG4gICAgICAgIHZhciBuZXh0U3RhdGUgPSBfdGhpcy5fbmV4dFN0YXRlKF9ldmVudCk7XG5cbiAgICAgICAgX3RoaXMudXBkYXRlKG5leHRTdGF0ZSwgX2V2ZW50KTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gX3RoaXMuX3N0YXRlOyAvLyBUT0RPOiBkZXByZWNhdGUgKHNob3VsZCByZXR1cm4gdm9pZClcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpzZW1pY29sb25cbiAgICB9O1xuXG4gICAgdGhpcy5zZW5kVG8gPSBmdW5jdGlvbiAoZXZlbnQsIHRvLCBpbW1lZGlhdGUpIHtcbiAgICAgIHZhciBpc1BhcmVudCA9IF90aGlzLnBhcmVudCAmJiAodG8gPT09IFNwZWNpYWxUYXJnZXRzLlBhcmVudCB8fCBfdGhpcy5wYXJlbnQuaWQgPT09IHRvKTtcbiAgICAgIHZhciB0YXJnZXQgPSBpc1BhcmVudCA/IF90aGlzLnBhcmVudCA6IGlzU3RyaW5nKHRvKSA/IHRvID09PSBTcGVjaWFsVGFyZ2V0cy5JbnRlcm5hbCA/IF90aGlzIDogX3RoaXMuY2hpbGRyZW4uZ2V0KHRvKSB8fCByZWdpc3RyeS5nZXQodG8pIDogaXNBY3Rvcih0bykgPyB0byA6IHVuZGVmaW5lZDtcblxuICAgICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgICAgaWYgKCFpc1BhcmVudCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuYWJsZSB0byBzZW5kIGV2ZW50IHRvIGNoaWxkICdcIi5jb25jYXQodG8sIFwiJyBmcm9tIHNlcnZpY2UgJ1wiKS5jb25jYXQoX3RoaXMuaWQsIFwiJy5cIikpO1xuICAgICAgICB9IC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1jb25zb2xlXG5cblxuICAgICAgICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICAgICAgICB3YXJuKGZhbHNlLCBcIlNlcnZpY2UgJ1wiLmNvbmNhdChfdGhpcy5pZCwgXCInIGhhcyBubyBwYXJlbnQ6IHVuYWJsZSB0byBzZW5kIGV2ZW50IFwiKS5jb25jYXQoZXZlbnQudHlwZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoJ21hY2hpbmUnIGluIHRhcmdldCkge1xuICAgICAgICAvLyBwZXJoYXBzIHRob3NlIGV2ZW50cyBzaG91bGQgYmUgcmVqZWN0ZWQgaW4gdGhlIHBhcmVudFxuICAgICAgICAvLyBidXQgYXRtIGl0IGRvZXNuJ3QgaGF2ZSBlYXN5IGFjY2VzcyB0byBhbGwgb2YgdGhlIGluZm9ybWF0aW9uIHRoYXQgaXMgcmVxdWlyZWQgdG8gZG8gaXQgcmVsaWFibHlcbiAgICAgICAgaWYgKF90aGlzLnN0YXR1cyAhPT0gSW50ZXJwcmV0ZXJTdGF0dXMuU3RvcHBlZCB8fCBfdGhpcy5wYXJlbnQgIT09IHRhcmdldCB8fCAvLyB3ZSBuZWVkIHRvIHNlbmQgZXZlbnRzIHRvIHRoZSBwYXJlbnQgZnJvbSBleGl0IGhhbmRsZXJzIG9mIGEgbWFjaGluZSB0aGF0IHJlYWNoZWQgaXRzIGZpbmFsIHN0YXRlXG4gICAgICAgIF90aGlzLnN0YXRlLmRvbmUpIHtcbiAgICAgICAgICAvLyBTZW5kIFNDWE1MIGV2ZW50cyB0byBtYWNoaW5lc1xuICAgICAgICAgIHZhciBzY3htbEV2ZW50ID0gX19hc3NpZ24oX19hc3NpZ24oe30sIGV2ZW50KSwge1xuICAgICAgICAgICAgbmFtZTogZXZlbnQubmFtZSA9PT0gZXJyb3IkMSA/IFwiXCIuY29uY2F0KGVycm9yKF90aGlzLmlkKSkgOiBldmVudC5uYW1lLFxuICAgICAgICAgICAgb3JpZ2luOiBfdGhpcy5zZXNzaW9uSWRcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGlmICghaW1tZWRpYXRlICYmIF90aGlzLm1hY2hpbmUuY29uZmlnLnByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzKSB7XG4gICAgICAgICAgICBfdGhpcy5fb3V0Z29pbmdRdWV1ZS5wdXNoKFt0YXJnZXQsIHNjeG1sRXZlbnRdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGFyZ2V0LnNlbmQoc2N4bWxFdmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBTZW5kIG5vcm1hbCBldmVudHMgdG8gb3RoZXIgdGFyZ2V0c1xuICAgICAgICBpZiAoIWltbWVkaWF0ZSAmJiBfdGhpcy5tYWNoaW5lLmNvbmZpZy5wcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50cykge1xuICAgICAgICAgIF90aGlzLl9vdXRnb2luZ1F1ZXVlLnB1c2goW3RhcmdldCwgZXZlbnQuZGF0YV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRhcmdldC5zZW5kKGV2ZW50LmRhdGEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMuX2V4ZWMgPSBmdW5jdGlvbiAoYWN0aW9uLCBjb250ZXh0LCBfZXZlbnQsIGFjdGlvbkZ1bmN0aW9uTWFwKSB7XG4gICAgICBpZiAoYWN0aW9uRnVuY3Rpb25NYXAgPT09IHZvaWQgMCkge1xuICAgICAgICBhY3Rpb25GdW5jdGlvbk1hcCA9IF90aGlzLm1hY2hpbmUub3B0aW9ucy5hY3Rpb25zO1xuICAgICAgfVxuXG4gICAgICB2YXIgYWN0aW9uT3JFeGVjID0gYWN0aW9uLmV4ZWMgfHwgZ2V0QWN0aW9uRnVuY3Rpb24oYWN0aW9uLnR5cGUsIGFjdGlvbkZ1bmN0aW9uTWFwKTtcbiAgICAgIHZhciBleGVjID0gaXNGdW5jdGlvbihhY3Rpb25PckV4ZWMpID8gYWN0aW9uT3JFeGVjIDogYWN0aW9uT3JFeGVjID8gYWN0aW9uT3JFeGVjLmV4ZWMgOiBhY3Rpb24uZXhlYztcblxuICAgICAgaWYgKGV4ZWMpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gZXhlYyhjb250ZXh0LCBfZXZlbnQuZGF0YSwgIV90aGlzLm1hY2hpbmUuY29uZmlnLnByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzID8ge1xuICAgICAgICAgICAgYWN0aW9uOiBhY3Rpb24sXG4gICAgICAgICAgICBzdGF0ZTogX3RoaXMuc3RhdGUsXG4gICAgICAgICAgICBfZXZlbnQ6IF9ldmVudFxuICAgICAgICAgIH0gOiB7XG4gICAgICAgICAgICBhY3Rpb246IGFjdGlvbixcbiAgICAgICAgICAgIF9ldmVudDogX2V2ZW50XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIGlmIChfdGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICAgIF90aGlzLnBhcmVudC5zZW5kKHtcbiAgICAgICAgICAgICAgdHlwZTogJ3hzdGF0ZS5lcnJvcicsXG4gICAgICAgICAgICAgIGRhdGE6IGVyclxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICAgICAgY2FzZSByYWlzZTpcbiAgICAgICAgICB7XG4gICAgICAgICAgICAvLyBpZiByYWlzZSBhY3Rpb24gcmVhY2hlZCB0aGUgaW50ZXJwcmV0ZXIgdGhlbiBpdCdzIGEgZGVsYXllZCBvbmVcbiAgICAgICAgICAgIHZhciBzZW5kQWN0aW9uXzEgPSBhY3Rpb247XG5cbiAgICAgICAgICAgIF90aGlzLmRlZmVyKHNlbmRBY3Rpb25fMSk7XG5cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICBjYXNlIHNlbmQ6XG4gICAgICAgICAgdmFyIHNlbmRBY3Rpb24gPSBhY3Rpb247XG5cbiAgICAgICAgICBpZiAodHlwZW9mIHNlbmRBY3Rpb24uZGVsYXkgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBfdGhpcy5kZWZlcihzZW5kQWN0aW9uKTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoc2VuZEFjdGlvbi50bykge1xuICAgICAgICAgICAgICBfdGhpcy5zZW5kVG8oc2VuZEFjdGlvbi5fZXZlbnQsIHNlbmRBY3Rpb24udG8sIF9ldmVudCA9PT0gaW5pdEV2ZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIF90aGlzLnNlbmQoc2VuZEFjdGlvbi5fZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgY2FuY2VsOlxuICAgICAgICAgIF90aGlzLmNhbmNlbChhY3Rpb24uc2VuZElkKTtcblxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2Ugc3RhcnQ6XG4gICAgICAgICAge1xuICAgICAgICAgICAgaWYgKF90aGlzLnN0YXR1cyAhPT0gSW50ZXJwcmV0ZXJTdGF0dXMuUnVubmluZykge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBhY3Rpdml0eSA9IGFjdGlvbi5hY3Rpdml0eTsgLy8gSWYgdGhlIGFjdGl2aXR5IHdpbGwgYmUgc3RvcHBlZCByaWdodCBhZnRlciBpdCdzIHN0YXJ0ZWRcbiAgICAgICAgICAgIC8vIChzdWNoIGFzIGluIHRyYW5zaWVudCBzdGF0ZXMpXG4gICAgICAgICAgICAvLyBkb24ndCBib3RoZXIgc3RhcnRpbmcgdGhlIGFjdGl2aXR5LlxuXG4gICAgICAgICAgICBpZiAoIC8vIGluIHY0IHdpdGggYHByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzYCBpbnZva2VzIGFyZSBjYWxsZWQgZWFnZXJseSB3aGVuIHRoZSBgdGhpcy5zdGF0ZWAgc3RpbGwgcG9pbnRzIHRvIHRoZSBwcmV2aW91cyBzdGF0ZVxuICAgICAgICAgICAgIV90aGlzLm1hY2hpbmUuY29uZmlnLnByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzICYmICFfdGhpcy5zdGF0ZS5hY3Rpdml0aWVzW2FjdGl2aXR5LmlkIHx8IGFjdGl2aXR5LnR5cGVdKSB7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSAvLyBJbnZva2VkIHNlcnZpY2VzXG5cblxuICAgICAgICAgICAgaWYgKGFjdGl2aXR5LnR5cGUgPT09IEFjdGlvblR5cGVzLkludm9rZSkge1xuICAgICAgICAgICAgICB2YXIgaW52b2tlU291cmNlID0gdG9JbnZva2VTb3VyY2UoYWN0aXZpdHkuc3JjKTtcbiAgICAgICAgICAgICAgdmFyIHNlcnZpY2VDcmVhdG9yID0gX3RoaXMubWFjaGluZS5vcHRpb25zLnNlcnZpY2VzID8gX3RoaXMubWFjaGluZS5vcHRpb25zLnNlcnZpY2VzW2ludm9rZVNvdXJjZS50eXBlXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgdmFyIGlkID0gYWN0aXZpdHkuaWQsXG4gICAgICAgICAgICAgICAgICBkYXRhID0gYWN0aXZpdHkuZGF0YTtcblxuICAgICAgICAgICAgICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICAgICAgICAgICAgICB3YXJuKCEoJ2ZvcndhcmQnIGluIGFjdGl2aXR5KSwgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICAgICAgICAgICAgICAgIFwiYGZvcndhcmRgIHByb3BlcnR5IGlzIGRlcHJlY2F0ZWQgKGZvdW5kIGluIGludm9jYXRpb24gb2YgJ1wiLmNvbmNhdChhY3Rpdml0eS5zcmMsIFwiJyBpbiBpbiBtYWNoaW5lICdcIikuY29uY2F0KF90aGlzLm1hY2hpbmUuaWQsIFwiJykuIFwiKSArIFwiUGxlYXNlIHVzZSBgYXV0b0ZvcndhcmRgIGluc3RlYWQuXCIpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdmFyIGF1dG9Gb3J3YXJkID0gJ2F1dG9Gb3J3YXJkJyBpbiBhY3Rpdml0eSA/IGFjdGl2aXR5LmF1dG9Gb3J3YXJkIDogISFhY3Rpdml0eS5mb3J3YXJkO1xuXG4gICAgICAgICAgICAgIGlmICghc2VydmljZUNyZWF0b3IpIHtcbiAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tY29uc29sZVxuICAgICAgICAgICAgICAgIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgICAgICAgICAgICAgICAgd2FybihmYWxzZSwgXCJObyBzZXJ2aWNlIGZvdW5kIGZvciBpbnZvY2F0aW9uICdcIi5jb25jYXQoYWN0aXZpdHkuc3JjLCBcIicgaW4gbWFjaGluZSAnXCIpLmNvbmNhdChfdGhpcy5tYWNoaW5lLmlkLCBcIicuXCIpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB2YXIgcmVzb2x2ZWREYXRhID0gZGF0YSA/IG1hcENvbnRleHQoZGF0YSwgY29udGV4dCwgX2V2ZW50KSA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICBpZiAodHlwZW9mIHNlcnZpY2VDcmVhdG9yID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIC8vIFRPRE86IHdhcm5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB2YXIgc291cmNlID0gaXNGdW5jdGlvbihzZXJ2aWNlQ3JlYXRvcikgPyBzZXJ2aWNlQ3JlYXRvcihjb250ZXh0LCBfZXZlbnQuZGF0YSwge1xuICAgICAgICAgICAgICAgIGRhdGE6IHJlc29sdmVkRGF0YSxcbiAgICAgICAgICAgICAgICBzcmM6IGludm9rZVNvdXJjZSxcbiAgICAgICAgICAgICAgICBtZXRhOiBhY3Rpdml0eS5tZXRhXG4gICAgICAgICAgICAgIH0pIDogc2VydmljZUNyZWF0b3I7XG5cbiAgICAgICAgICAgICAgaWYgKCFzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiB3YXJuP1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHZhciBvcHRpb25zID0gdm9pZCAwO1xuXG4gICAgICAgICAgICAgIGlmIChpc01hY2hpbmUoc291cmNlKSkge1xuICAgICAgICAgICAgICAgIHNvdXJjZSA9IHJlc29sdmVkRGF0YSA/IHNvdXJjZS53aXRoQ29udGV4dChyZXNvbHZlZERhdGEpIDogc291cmNlO1xuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICBhdXRvRm9yd2FyZDogYXV0b0ZvcndhcmRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgX3RoaXMuc3Bhd24oc291cmNlLCBpZCwgb3B0aW9ucyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBfdGhpcy5zcGF3bkFjdGl2aXR5KGFjdGl2aXR5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgIGNhc2Ugc3RvcDpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBfdGhpcy5zdG9wQ2hpbGQoYWN0aW9uLmFjdGl2aXR5LmlkKTtcblxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgbG9nOlxuICAgICAgICAgIHZhciBfYSA9IGFjdGlvbixcbiAgICAgICAgICAgICAgbGFiZWwgPSBfYS5sYWJlbCxcbiAgICAgICAgICAgICAgdmFsdWUgPSBfYS52YWx1ZTtcblxuICAgICAgICAgIGlmIChsYWJlbCkge1xuICAgICAgICAgICAgX3RoaXMubG9nZ2VyKGxhYmVsLCB2YWx1ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF90aGlzLmxvZ2dlcih2YWx1ZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICAgICAgICAgIHdhcm4oZmFsc2UsIFwiTm8gaW1wbGVtZW50YXRpb24gZm91bmQgZm9yIGFjdGlvbiB0eXBlICdcIi5jb25jYXQoYWN0aW9uLnR5cGUsIFwiJ1wiKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciByZXNvbHZlZE9wdGlvbnMgPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgSW50ZXJwcmV0ZXIuZGVmYXVsdE9wdGlvbnMpLCBvcHRpb25zKTtcblxuICAgIHZhciBjbG9jayA9IHJlc29sdmVkT3B0aW9ucy5jbG9jayxcbiAgICAgICAgbG9nZ2VyID0gcmVzb2x2ZWRPcHRpb25zLmxvZ2dlcixcbiAgICAgICAgcGFyZW50ID0gcmVzb2x2ZWRPcHRpb25zLnBhcmVudCxcbiAgICAgICAgaWQgPSByZXNvbHZlZE9wdGlvbnMuaWQ7XG4gICAgdmFyIHJlc29sdmVkSWQgPSBpZCAhPT0gdW5kZWZpbmVkID8gaWQgOiBtYWNoaW5lLmlkO1xuICAgIHRoaXMuaWQgPSByZXNvbHZlZElkO1xuICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyO1xuICAgIHRoaXMuY2xvY2sgPSBjbG9jaztcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICB0aGlzLm9wdGlvbnMgPSByZXNvbHZlZE9wdGlvbnM7XG4gICAgdGhpcy5zY2hlZHVsZXIgPSBuZXcgU2NoZWR1bGVyKHtcbiAgICAgIGRlZmVyRXZlbnRzOiB0aGlzLm9wdGlvbnMuZGVmZXJFdmVudHNcbiAgICB9KTtcbiAgICB0aGlzLnNlc3Npb25JZCA9IHJlZ2lzdHJ5LmJvb2tJZCgpO1xuICB9XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEludGVycHJldGVyLnByb3RvdHlwZSwgXCJpbml0aWFsU3RhdGVcIiwge1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgaWYgKHRoaXMuX2luaXRpYWxTdGF0ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5faW5pdGlhbFN0YXRlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJvdmlkZSh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIF90aGlzLl9pbml0aWFsU3RhdGUgPSBfdGhpcy5tYWNoaW5lLmluaXRpYWxTdGF0ZTtcbiAgICAgICAgcmV0dXJuIF90aGlzLl9pbml0aWFsU3RhdGU7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEludGVycHJldGVyLnByb3RvdHlwZSwgXCJzdGF0ZVwiLCB7XG4gICAgLyoqXHJcbiAgICAgKiBAZGVwcmVjYXRlZCBVc2UgYC5nZXRTbmFwc2hvdCgpYCBpbnN0ZWFkLlxyXG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICAgICAgd2Fybih0aGlzLnN0YXR1cyAhPT0gSW50ZXJwcmV0ZXJTdGF0dXMuTm90U3RhcnRlZCwgXCJBdHRlbXB0ZWQgdG8gcmVhZCBzdGF0ZSBmcm9tIHVuaW5pdGlhbGl6ZWQgc2VydmljZSAnXCIuY29uY2F0KHRoaXMuaWQsIFwiJy4gTWFrZSBzdXJlIHRoZSBzZXJ2aWNlIGlzIHN0YXJ0ZWQgZmlyc3QuXCIpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlO1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuICAvKipcclxuICAgKiBFeGVjdXRlcyB0aGUgYWN0aW9ucyBvZiB0aGUgZ2l2ZW4gc3RhdGUsIHdpdGggdGhhdCBzdGF0ZSdzIGBjb250ZXh0YCBhbmQgYGV2ZW50YC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBzdGF0ZSBUaGUgc3RhdGUgd2hvc2UgYWN0aW9ucyB3aWxsIGJlIGV4ZWN1dGVkXHJcbiAgICogQHBhcmFtIGFjdGlvbnNDb25maWcgVGhlIGFjdGlvbiBpbXBsZW1lbnRhdGlvbnMgdG8gdXNlXHJcbiAgICovXG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLmV4ZWN1dGUgPSBmdW5jdGlvbiAoc3RhdGUsIGFjdGlvbnNDb25maWcpIHtcbiAgICB2YXIgZV8xLCBfYTtcblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBfYiA9IF9fdmFsdWVzKHN0YXRlLmFjdGlvbnMpLCBfYyA9IF9iLm5leHQoKTsgIV9jLmRvbmU7IF9jID0gX2IubmV4dCgpKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBfYy52YWx1ZTtcbiAgICAgICAgdGhpcy5leGVjKGFjdGlvbiwgc3RhdGUsIGFjdGlvbnNDb25maWcpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfMV8xKSB7XG4gICAgICBlXzEgPSB7XG4gICAgICAgIGVycm9yOiBlXzFfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKF9jICYmICFfYy5kb25lICYmIChfYSA9IF9iLnJldHVybikpIF9hLmNhbGwoX2IpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKHN0YXRlLCBfZXZlbnQpIHtcbiAgICB2YXIgZV8yLCBfYSwgZV8zLCBfYiwgZV80LCBfYywgZV81LCBfZDtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7IC8vIEF0dGFjaCBzZXNzaW9uIElEIHRvIHN0YXRlXG5cblxuICAgIHN0YXRlLl9zZXNzaW9uaWQgPSB0aGlzLnNlc3Npb25JZDsgLy8gVXBkYXRlIHN0YXRlXG5cbiAgICB0aGlzLl9zdGF0ZSA9IHN0YXRlOyAvLyBFeGVjdXRlIGFjdGlvbnNcblxuICAgIGlmICgoIXRoaXMubWFjaGluZS5jb25maWcucHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHMgfHwgLy8gdGhpcyBpcyBjdXJyZW50bHkgcmVxdWlyZWQgdG8gZXhlY3V0ZSBpbml0aWFsIGFjdGlvbnMgYXMgdGhlIGBpbml0aWFsU3RhdGVgIGdldHMgY2FjaGVkXG4gICAgLy8gd2UgY2FuJ3QganVzdCByZWNvbXB1dGUgaXQgKGFuZCBleGVjdXRlIGFjdGlvbnMgd2hpbGUgZG9pbmcgc28pIGJlY2F1c2Ugd2UgdHJ5IHRvIHByZXNlcnZlIGlkZW50aXR5IG9mIGFjdG9ycyBjcmVhdGVkIHdpdGhpbiBpbml0aWFsIGFzc2lnbnNcbiAgICBfZXZlbnQgPT09IGluaXRFdmVudCkgJiYgdGhpcy5vcHRpb25zLmV4ZWN1dGUpIHtcbiAgICAgIHRoaXMuZXhlY3V0ZSh0aGlzLnN0YXRlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGl0ZW0gPSB2b2lkIDA7XG5cbiAgICAgIHdoaWxlIChpdGVtID0gdGhpcy5fb3V0Z29pbmdRdWV1ZS5zaGlmdCgpKSB7XG4gICAgICAgIGl0ZW1bMF0uc2VuZChpdGVtWzFdKTtcbiAgICAgIH1cbiAgICB9IC8vIFVwZGF0ZSBjaGlsZHJlblxuXG5cbiAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICBfdGhpcy5zdGF0ZS5jaGlsZHJlbltjaGlsZC5pZF0gPSBjaGlsZDtcbiAgICB9KTsgLy8gRGV2IHRvb2xzXG5cbiAgICBpZiAodGhpcy5kZXZUb29scykge1xuICAgICAgdGhpcy5kZXZUb29scy5zZW5kKF9ldmVudC5kYXRhLCBzdGF0ZSk7XG4gICAgfSAvLyBFeGVjdXRlIGxpc3RlbmVyc1xuXG5cbiAgICBpZiAoc3RhdGUuZXZlbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAodmFyIF9lID0gX192YWx1ZXModGhpcy5ldmVudExpc3RlbmVycyksIF9mID0gX2UubmV4dCgpOyAhX2YuZG9uZTsgX2YgPSBfZS5uZXh0KCkpIHtcbiAgICAgICAgICB2YXIgbGlzdGVuZXIgPSBfZi52YWx1ZTtcbiAgICAgICAgICBsaXN0ZW5lcihzdGF0ZS5ldmVudCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVfMl8xKSB7XG4gICAgICAgIGVfMiA9IHtcbiAgICAgICAgICBlcnJvcjogZV8yXzFcbiAgICAgICAgfTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKF9mICYmICFfZi5kb25lICYmIChfYSA9IF9lLnJldHVybikpIF9hLmNhbGwoX2UpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIGlmIChlXzIpIHRocm93IGVfMi5lcnJvcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBfZyA9IF9fdmFsdWVzKHRoaXMubGlzdGVuZXJzKSwgX2ggPSBfZy5uZXh0KCk7ICFfaC5kb25lOyBfaCA9IF9nLm5leHQoKSkge1xuICAgICAgICB2YXIgbGlzdGVuZXIgPSBfaC52YWx1ZTtcbiAgICAgICAgbGlzdGVuZXIoc3RhdGUsIHN0YXRlLmV2ZW50KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzNfMSkge1xuICAgICAgZV8zID0ge1xuICAgICAgICBlcnJvcjogZV8zXzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfaCAmJiAhX2guZG9uZSAmJiAoX2IgPSBfZy5yZXR1cm4pKSBfYi5jYWxsKF9nKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzMpIHRocm93IGVfMy5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2ogPSBfX3ZhbHVlcyh0aGlzLmNvbnRleHRMaXN0ZW5lcnMpLCBfayA9IF9qLm5leHQoKTsgIV9rLmRvbmU7IF9rID0gX2oubmV4dCgpKSB7XG4gICAgICAgIHZhciBjb250ZXh0TGlzdGVuZXIgPSBfay52YWx1ZTtcbiAgICAgICAgY29udGV4dExpc3RlbmVyKHRoaXMuc3RhdGUuY29udGV4dCwgdGhpcy5zdGF0ZS5oaXN0b3J5ID8gdGhpcy5zdGF0ZS5oaXN0b3J5LmNvbnRleHQgOiB1bmRlZmluZWQpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfNF8xKSB7XG4gICAgICBlXzQgPSB7XG4gICAgICAgIGVycm9yOiBlXzRfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKF9rICYmICFfay5kb25lICYmIChfYyA9IF9qLnJldHVybikpIF9jLmNhbGwoX2opO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfNCkgdGhyb3cgZV80LmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnN0YXRlLmRvbmUpIHtcbiAgICAgIC8vIGdldCBmaW5hbCBjaGlsZCBzdGF0ZSBub2RlXG4gICAgICB2YXIgZmluYWxDaGlsZFN0YXRlTm9kZSA9IHN0YXRlLmNvbmZpZ3VyYXRpb24uZmluZChmdW5jdGlvbiAoc24pIHtcbiAgICAgICAgcmV0dXJuIHNuLnR5cGUgPT09ICdmaW5hbCcgJiYgc24ucGFyZW50ID09PSBfdGhpcy5tYWNoaW5lO1xuICAgICAgfSk7XG4gICAgICB2YXIgZG9uZURhdGEgPSBmaW5hbENoaWxkU3RhdGVOb2RlICYmIGZpbmFsQ2hpbGRTdGF0ZU5vZGUuZG9uZURhdGEgPyBtYXBDb250ZXh0KGZpbmFsQ2hpbGRTdGF0ZU5vZGUuZG9uZURhdGEsIHN0YXRlLmNvbnRleHQsIF9ldmVudCkgOiB1bmRlZmluZWQ7XG4gICAgICB0aGlzLl9kb25lRXZlbnQgPSBkb25lSW52b2tlKHRoaXMuaWQsIGRvbmVEYXRhKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yICh2YXIgX2wgPSBfX3ZhbHVlcyh0aGlzLmRvbmVMaXN0ZW5lcnMpLCBfbSA9IF9sLm5leHQoKTsgIV9tLmRvbmU7IF9tID0gX2wubmV4dCgpKSB7XG4gICAgICAgICAgdmFyIGxpc3RlbmVyID0gX20udmFsdWU7XG4gICAgICAgICAgbGlzdGVuZXIodGhpcy5fZG9uZUV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZV81XzEpIHtcbiAgICAgICAgZV81ID0ge1xuICAgICAgICAgIGVycm9yOiBlXzVfMVxuICAgICAgICB9O1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoX20gJiYgIV9tLmRvbmUgJiYgKF9kID0gX2wucmV0dXJuKSkgX2QuY2FsbChfbCk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgaWYgKGVfNSkgdGhyb3cgZV81LmVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3N0b3AoKTtcblxuICAgICAgdGhpcy5fc3RvcENoaWxkcmVuKCk7XG5cbiAgICAgIHJlZ2lzdHJ5LmZyZWUodGhpcy5zZXNzaW9uSWQpO1xuICAgIH1cbiAgfTtcbiAgLypcclxuICAgKiBBZGRzIGEgbGlzdGVuZXIgdGhhdCBpcyBub3RpZmllZCB3aGVuZXZlciBhIHN0YXRlIHRyYW5zaXRpb24gaGFwcGVucy4gVGhlIGxpc3RlbmVyIGlzIGNhbGxlZCB3aXRoXHJcbiAgICogdGhlIG5leHQgc3RhdGUgYW5kIHRoZSBldmVudCBvYmplY3QgdGhhdCBjYXVzZWQgdGhlIHN0YXRlIHRyYW5zaXRpb24uXHJcbiAgICpcclxuICAgKiBAcGFyYW0gbGlzdGVuZXIgVGhlIHN0YXRlIGxpc3RlbmVyXHJcbiAgICovXG5cblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUub25UcmFuc2l0aW9uID0gZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgdGhpcy5saXN0ZW5lcnMuYWRkKGxpc3RlbmVyKTsgLy8gU2VuZCBjdXJyZW50IHN0YXRlIHRvIGxpc3RlbmVyXG5cbiAgICBpZiAodGhpcy5zdGF0dXMgPT09IEludGVycHJldGVyU3RhdHVzLlJ1bm5pbmcpIHtcbiAgICAgIGxpc3RlbmVyKHRoaXMuc3RhdGUsIHRoaXMuc3RhdGUuZXZlbnQpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5zdWJzY3JpYmUgPSBmdW5jdGlvbiAobmV4dExpc3RlbmVyT3JPYnNlcnZlciwgXywgLy8gVE9ETzogZXJyb3IgbGlzdGVuZXJcbiAgY29tcGxldGVMaXN0ZW5lcikge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgb2JzZXJ2ZXIgPSB0b09ic2VydmVyKG5leHRMaXN0ZW5lck9yT2JzZXJ2ZXIsIF8sIGNvbXBsZXRlTGlzdGVuZXIpO1xuICAgIHRoaXMubGlzdGVuZXJzLmFkZChvYnNlcnZlci5uZXh0KTsgLy8gU2VuZCBjdXJyZW50IHN0YXRlIHRvIGxpc3RlbmVyXG5cbiAgICBpZiAodGhpcy5zdGF0dXMgIT09IEludGVycHJldGVyU3RhdHVzLk5vdFN0YXJ0ZWQpIHtcbiAgICAgIG9ic2VydmVyLm5leHQodGhpcy5zdGF0ZSk7XG4gICAgfVxuXG4gICAgdmFyIGNvbXBsZXRlT25jZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIF90aGlzLmRvbmVMaXN0ZW5lcnMuZGVsZXRlKGNvbXBsZXRlT25jZSk7XG5cbiAgICAgIF90aGlzLnN0b3BMaXN0ZW5lcnMuZGVsZXRlKGNvbXBsZXRlT25jZSk7XG5cbiAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgfTtcblxuICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gSW50ZXJwcmV0ZXJTdGF0dXMuU3RvcHBlZCkge1xuICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vbkRvbmUoY29tcGxldGVPbmNlKTtcbiAgICAgIHRoaXMub25TdG9wKGNvbXBsZXRlT25jZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIF90aGlzLmxpc3RlbmVycy5kZWxldGUob2JzZXJ2ZXIubmV4dCk7XG5cbiAgICAgICAgX3RoaXMuZG9uZUxpc3RlbmVycy5kZWxldGUoY29tcGxldGVPbmNlKTtcblxuICAgICAgICBfdGhpcy5zdG9wTGlzdGVuZXJzLmRlbGV0ZShjb21wbGV0ZU9uY2UpO1xuICAgICAgfVxuICAgIH07XG4gIH07XG4gIC8qKlxyXG4gICAqIEFkZHMgYW4gZXZlbnQgbGlzdGVuZXIgdGhhdCBpcyBub3RpZmllZCB3aGVuZXZlciBhbiBldmVudCBpcyBzZW50IHRvIHRoZSBydW5uaW5nIGludGVycHJldGVyLlxyXG4gICAqIEBwYXJhbSBsaXN0ZW5lciBUaGUgZXZlbnQgbGlzdGVuZXJcclxuICAgKi9cblxuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5vbkV2ZW50ID0gZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgdGhpcy5ldmVudExpc3RlbmVycy5hZGQobGlzdGVuZXIpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICAvKipcclxuICAgKiBBZGRzIGFuIGV2ZW50IGxpc3RlbmVyIHRoYXQgaXMgbm90aWZpZWQgd2hlbmV2ZXIgYSBgc2VuZGAgZXZlbnQgb2NjdXJzLlxyXG4gICAqIEBwYXJhbSBsaXN0ZW5lciBUaGUgZXZlbnQgbGlzdGVuZXJcclxuICAgKi9cblxuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5vblNlbmQgPSBmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICB0aGlzLnNlbmRMaXN0ZW5lcnMuYWRkKGxpc3RlbmVyKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgLyoqXHJcbiAgICogQWRkcyBhIGNvbnRleHQgbGlzdGVuZXIgdGhhdCBpcyBub3RpZmllZCB3aGVuZXZlciB0aGUgc3RhdGUgY29udGV4dCBjaGFuZ2VzLlxyXG4gICAqIEBwYXJhbSBsaXN0ZW5lciBUaGUgY29udGV4dCBsaXN0ZW5lclxyXG4gICAqL1xuXG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLm9uQ2hhbmdlID0gZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgdGhpcy5jb250ZXh0TGlzdGVuZXJzLmFkZChsaXN0ZW5lcik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIC8qKlxyXG4gICAqIEFkZHMgYSBsaXN0ZW5lciB0aGF0IGlzIG5vdGlmaWVkIHdoZW4gdGhlIG1hY2hpbmUgaXMgc3RvcHBlZC5cclxuICAgKiBAcGFyYW0gbGlzdGVuZXIgVGhlIGxpc3RlbmVyXHJcbiAgICovXG5cblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUub25TdG9wID0gZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgdGhpcy5zdG9wTGlzdGVuZXJzLmFkZChsaXN0ZW5lcik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIC8qKlxyXG4gICAqIEFkZHMgYSBzdGF0ZSBsaXN0ZW5lciB0aGF0IGlzIG5vdGlmaWVkIHdoZW4gdGhlIHN0YXRlY2hhcnQgaGFzIHJlYWNoZWQgaXRzIGZpbmFsIHN0YXRlLlxyXG4gICAqIEBwYXJhbSBsaXN0ZW5lciBUaGUgc3RhdGUgbGlzdGVuZXJcclxuICAgKi9cblxuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5vbkRvbmUgPSBmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICBpZiAodGhpcy5zdGF0dXMgPT09IEludGVycHJldGVyU3RhdHVzLlN0b3BwZWQgJiYgdGhpcy5fZG9uZUV2ZW50KSB7XG4gICAgICBsaXN0ZW5lcih0aGlzLl9kb25lRXZlbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRvbmVMaXN0ZW5lcnMuYWRkKGxpc3RlbmVyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgLyoqXHJcbiAgICogUmVtb3ZlcyBhIGxpc3RlbmVyLlxyXG4gICAqIEBwYXJhbSBsaXN0ZW5lciBUaGUgbGlzdGVuZXIgdG8gcmVtb3ZlXHJcbiAgICovXG5cblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUub2ZmID0gZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgdGhpcy5saXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcbiAgICB0aGlzLmV2ZW50TGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcik7XG4gICAgdGhpcy5zZW5kTGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcik7XG4gICAgdGhpcy5zdG9wTGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcik7XG4gICAgdGhpcy5kb25lTGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcik7XG4gICAgdGhpcy5jb250ZXh0TGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIC8qKlxyXG4gICAqIFN0YXJ0cyB0aGUgaW50ZXJwcmV0ZXIgZnJvbSB0aGUgZ2l2ZW4gc3RhdGUsIG9yIHRoZSBpbml0aWFsIHN0YXRlLlxyXG4gICAqIEBwYXJhbSBpbml0aWFsU3RhdGUgVGhlIHN0YXRlIHRvIHN0YXJ0IHRoZSBzdGF0ZWNoYXJ0IGZyb21cclxuICAgKi9cblxuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uIChpbml0aWFsU3RhdGUpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSBJbnRlcnByZXRlclN0YXR1cy5SdW5uaW5nKSB7XG4gICAgICAvLyBEbyBub3QgcmVzdGFydCB0aGUgc2VydmljZSBpZiBpdCBpcyBhbHJlYWR5IHN0YXJ0ZWRcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gLy8geWVzLCBpdCdzIGEgaGFjayBidXQgd2UgbmVlZCB0aGUgcmVsYXRlZCBjYWNoZSB0byBiZSBwb3B1bGF0ZWQgZm9yIHNvbWUgdGhpbmdzIHRvIHdvcmsgKGxpa2UgZGVsYXllZCB0cmFuc2l0aW9ucylcbiAgICAvLyB0aGlzIGlzIHVzdWFsbHkgY2FsbGVkIGJ5IGBtYWNoaW5lLmdldEluaXRpYWxTdGF0ZWAgYnV0IGlmIHdlIHJlaHlkcmF0ZSBmcm9tIGEgc3RhdGUgd2UgbWlnaHQgYnlwYXNzIHRoaXMgY2FsbFxuICAgIC8vIHdlIGFsc28gZG9uJ3Qgd2FudCB0byBjYWxsIHRoaXMgbWV0aG9kIGhlcmUgYXMgaXQgcmVzb2x2ZXMgdGhlIGZ1bGwgaW5pdGlhbCBzdGF0ZSB3aGljaCBtaWdodCBpbnZvbHZlIGNhbGxpbmcgYXNzaWduIGFjdGlvbnNcbiAgICAvLyBhbmQgdGhhdCBjb3VsZCBwb3RlbnRpYWxseSBsZWFkIHRvIHNvbWUgdW53YW50ZWQgc2lkZS1lZmZlY3RzIChldmVuIHN1Y2ggYXMgY3JlYXRpbmcgc29tZSByb2d1ZSBhY3RvcnMpXG5cblxuICAgIHRoaXMubWFjaGluZS5faW5pdCgpO1xuXG4gICAgcmVnaXN0cnkucmVnaXN0ZXIodGhpcy5zZXNzaW9uSWQsIHRoaXMpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIHRoaXMuc3RhdHVzID0gSW50ZXJwcmV0ZXJTdGF0dXMuUnVubmluZztcbiAgICB2YXIgcmVzb2x2ZWRTdGF0ZSA9IGluaXRpYWxTdGF0ZSA9PT0gdW5kZWZpbmVkID8gdGhpcy5pbml0aWFsU3RhdGUgOiBwcm92aWRlKHRoaXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBpc1N0YXRlQ29uZmlnKGluaXRpYWxTdGF0ZSkgPyBfdGhpcy5tYWNoaW5lLnJlc29sdmVTdGF0ZShpbml0aWFsU3RhdGUpIDogX3RoaXMubWFjaGluZS5yZXNvbHZlU3RhdGUoU3RhdGUuZnJvbShpbml0aWFsU3RhdGUsIF90aGlzLm1hY2hpbmUuY29udGV4dCkpO1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5kZXZUb29scykge1xuICAgICAgdGhpcy5hdHRhY2hEZXYoKTtcbiAgICB9XG5cbiAgICB0aGlzLnNjaGVkdWxlci5pbml0aWFsaXplKGZ1bmN0aW9uICgpIHtcbiAgICAgIF90aGlzLnVwZGF0ZShyZXNvbHZlZFN0YXRlLCBpbml0RXZlbnQpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5fc3RvcENoaWxkcmVuID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIFRPRE86IHRoaW5rIGFib3V0IGNvbnZlcnRpbmcgdGhvc2UgdG8gYWN0aW9uc1xuICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgIGlmIChpc0Z1bmN0aW9uKGNoaWxkLnN0b3ApKSB7XG4gICAgICAgIGNoaWxkLnN0b3AoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmNoaWxkcmVuLmNsZWFyKCk7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLl9zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBlXzYsIF9hLCBlXzcsIF9iLCBlXzgsIF9jLCBlXzksIF9kLCBlXzEwLCBfZTtcblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBfZiA9IF9fdmFsdWVzKHRoaXMubGlzdGVuZXJzKSwgX2cgPSBfZi5uZXh0KCk7ICFfZy5kb25lOyBfZyA9IF9mLm5leHQoKSkge1xuICAgICAgICB2YXIgbGlzdGVuZXIgPSBfZy52YWx1ZTtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzZfMSkge1xuICAgICAgZV82ID0ge1xuICAgICAgICBlcnJvcjogZV82XzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfZyAmJiAhX2cuZG9uZSAmJiAoX2EgPSBfZi5yZXR1cm4pKSBfYS5jYWxsKF9mKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzYpIHRocm93IGVfNi5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2ggPSBfX3ZhbHVlcyh0aGlzLnN0b3BMaXN0ZW5lcnMpLCBfaiA9IF9oLm5leHQoKTsgIV9qLmRvbmU7IF9qID0gX2gubmV4dCgpKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lciA9IF9qLnZhbHVlOyAvLyBjYWxsIGxpc3RlbmVyLCB0aGVuIHJlbW92ZVxuXG4gICAgICAgIGxpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuc3RvcExpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfN18xKSB7XG4gICAgICBlXzcgPSB7XG4gICAgICAgIGVycm9yOiBlXzdfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKF9qICYmICFfai5kb25lICYmIChfYiA9IF9oLnJldHVybikpIF9iLmNhbGwoX2gpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfNykgdGhyb3cgZV83LmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBfayA9IF9fdmFsdWVzKHRoaXMuY29udGV4dExpc3RlbmVycyksIF9sID0gX2submV4dCgpOyAhX2wuZG9uZTsgX2wgPSBfay5uZXh0KCkpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVyID0gX2wudmFsdWU7XG4gICAgICAgIHRoaXMuY29udGV4dExpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfOF8xKSB7XG4gICAgICBlXzggPSB7XG4gICAgICAgIGVycm9yOiBlXzhfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKF9sICYmICFfbC5kb25lICYmIChfYyA9IF9rLnJldHVybikpIF9jLmNhbGwoX2spO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfOCkgdGhyb3cgZV84LmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBfbSA9IF9fdmFsdWVzKHRoaXMuZG9uZUxpc3RlbmVycyksIF9vID0gX20ubmV4dCgpOyAhX28uZG9uZTsgX28gPSBfbS5uZXh0KCkpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVyID0gX28udmFsdWU7XG4gICAgICAgIHRoaXMuZG9uZUxpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfOV8xKSB7XG4gICAgICBlXzkgPSB7XG4gICAgICAgIGVycm9yOiBlXzlfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKF9vICYmICFfby5kb25lICYmIChfZCA9IF9tLnJldHVybikpIF9kLmNhbGwoX20pO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfOSkgdGhyb3cgZV85LmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghdGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgLy8gSW50ZXJwcmV0ZXIgYWxyZWFkeSBzdG9wcGVkOyBkbyBub3RoaW5nXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgdGhpcy5zdGF0dXMgPSBJbnRlcnByZXRlclN0YXR1cy5TdG9wcGVkO1xuICAgIHRoaXMuX2luaXRpYWxTdGF0ZSA9IHVuZGVmaW5lZDtcblxuICAgIHRyeSB7XG4gICAgICAvLyB3ZSBhcmUgZ29pbmcgdG8gc3RvcCB3aXRoaW4gdGhlIGN1cnJlbnQgc3luYyBmcmFtZVxuICAgICAgLy8gc28gd2UgY2FuIHNhZmVseSBqdXN0IGNhbmNlbCB0aGlzIGhlcmUgYXMgbm90aGluZyBhc3luYyBzaG91bGQgYmUgZmlyZWQgYW55d2F5XG4gICAgICBmb3IgKHZhciBfcCA9IF9fdmFsdWVzKE9iamVjdC5rZXlzKHRoaXMuZGVsYXllZEV2ZW50c01hcCkpLCBfcSA9IF9wLm5leHQoKTsgIV9xLmRvbmU7IF9xID0gX3AubmV4dCgpKSB7XG4gICAgICAgIHZhciBrZXkgPSBfcS52YWx1ZTtcbiAgICAgICAgdGhpcy5jbG9jay5jbGVhclRpbWVvdXQodGhpcy5kZWxheWVkRXZlbnRzTWFwW2tleV0pO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfMTBfMSkge1xuICAgICAgZV8xMCA9IHtcbiAgICAgICAgZXJyb3I6IGVfMTBfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKF9xICYmICFfcS5kb25lICYmIChfZSA9IF9wLnJldHVybikpIF9lLmNhbGwoX3ApO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfMTApIHRocm93IGVfMTAuZXJyb3I7XG4gICAgICB9XG4gICAgfSAvLyBjbGVhciBldmVyeXRoaW5nIHRoYXQgbWlnaHQgYmUgZW5xdWV1ZWRcblxuXG4gICAgdGhpcy5zY2hlZHVsZXIuY2xlYXIoKTtcbiAgICB0aGlzLnNjaGVkdWxlciA9IG5ldyBTY2hlZHVsZXIoe1xuICAgICAgZGVmZXJFdmVudHM6IHRoaXMub3B0aW9ucy5kZWZlckV2ZW50c1xuICAgIH0pO1xuICB9O1xuICAvKipcclxuICAgKiBTdG9wcyB0aGUgaW50ZXJwcmV0ZXIgYW5kIHVuc3Vic2NyaWJlIGFsbCBsaXN0ZW5lcnMuXHJcbiAgICpcclxuICAgKiBUaGlzIHdpbGwgYWxzbyBub3RpZnkgdGhlIGBvblN0b3BgIGxpc3RlbmVycy5cclxuICAgKi9cblxuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIFRPRE86IGFkZCB3YXJuaW5nIGZvciBzdG9wcGluZyBub24tcm9vdCBpbnRlcnByZXRlcnNcbiAgICB2YXIgX3RoaXMgPSB0aGlzOyAvLyBncmFiIHRoZSBjdXJyZW50IHNjaGVkdWxlciBhcyBpdCB3aWxsIGJlIHJlcGxhY2VkIGluIF9zdG9wXG5cblxuICAgIHZhciBzY2hlZHVsZXIgPSB0aGlzLnNjaGVkdWxlcjtcblxuICAgIHRoaXMuX3N0b3AoKTsgLy8gbGV0IHdoYXQgaXMgY3VycmVudGx5IHByb2Nlc3NlZCB0byBiZSBmaW5pc2hlZFxuXG5cbiAgICBzY2hlZHVsZXIuc2NoZWR1bGUoZnVuY3Rpb24gKCkge1xuICAgICAgLy8gaXQgZmVlbHMgd2VpcmQgdG8gaGFuZGxlIHRoaXMgaGVyZSBidXQgd2UgbmVlZCB0byBoYW5kbGUgdGhpcyBldmVuIHNsaWdodGx5IFwib3V0IG9mIGJhbmRcIlxuICAgICAgdmFyIF9ldmVudCA9IHRvU0NYTUxFdmVudCh7XG4gICAgICAgIHR5cGU6ICd4c3RhdGUuc3RvcCdcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgbmV4dFN0YXRlID0gcHJvdmlkZShfdGhpcywgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZXhpdEFjdGlvbnMgPSBmbGF0dGVuKF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChfdGhpcy5zdGF0ZS5jb25maWd1cmF0aW9uKSwgZmFsc2UpLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICByZXR1cm4gYi5vcmRlciAtIGEub3JkZXI7XG4gICAgICAgIH0pLm1hcChmdW5jdGlvbiAoc3RhdGVOb2RlKSB7XG4gICAgICAgICAgcmV0dXJuIHRvQWN0aW9uT2JqZWN0cyhzdGF0ZU5vZGUub25FeGl0LCBfdGhpcy5tYWNoaW5lLm9wdGlvbnMuYWN0aW9ucyk7XG4gICAgICAgIH0pKTtcblxuICAgICAgICB2YXIgX2EgPSBfX3JlYWQocmVzb2x2ZUFjdGlvbnMoX3RoaXMubWFjaGluZSwgX3RoaXMuc3RhdGUsIF90aGlzLnN0YXRlLmNvbnRleHQsIF9ldmVudCwgW3tcbiAgICAgICAgICB0eXBlOiAnZXhpdCcsXG4gICAgICAgICAgYWN0aW9uczogZXhpdEFjdGlvbnNcbiAgICAgICAgfV0sIF90aGlzLm1hY2hpbmUuY29uZmlnLnByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzID8gX3RoaXMuX2V4ZWMgOiB1bmRlZmluZWQsIF90aGlzLm1hY2hpbmUuY29uZmlnLnByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzIHx8IF90aGlzLm1hY2hpbmUuY29uZmlnLnByZXNlcnZlQWN0aW9uT3JkZXIpLCAyKSxcbiAgICAgICAgICAgIHJlc29sdmVkQWN0aW9ucyA9IF9hWzBdLFxuICAgICAgICAgICAgdXBkYXRlZENvbnRleHQgPSBfYVsxXTtcblxuICAgICAgICB2YXIgbmV3U3RhdGUgPSBuZXcgU3RhdGUoe1xuICAgICAgICAgIHZhbHVlOiBfdGhpcy5zdGF0ZS52YWx1ZSxcbiAgICAgICAgICBjb250ZXh0OiB1cGRhdGVkQ29udGV4dCxcbiAgICAgICAgICBfZXZlbnQ6IF9ldmVudCxcbiAgICAgICAgICBfc2Vzc2lvbmlkOiBfdGhpcy5zZXNzaW9uSWQsXG4gICAgICAgICAgaGlzdG9yeVZhbHVlOiB1bmRlZmluZWQsXG4gICAgICAgICAgaGlzdG9yeTogX3RoaXMuc3RhdGUsXG4gICAgICAgICAgYWN0aW9uczogcmVzb2x2ZWRBY3Rpb25zLmZpbHRlcihmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gIWlzUmFpc2FibGVBY3Rpb24oYWN0aW9uKTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBhY3Rpdml0aWVzOiB7fSxcbiAgICAgICAgICBldmVudHM6IFtdLFxuICAgICAgICAgIGNvbmZpZ3VyYXRpb246IFtdLFxuICAgICAgICAgIHRyYW5zaXRpb25zOiBbXSxcbiAgICAgICAgICBjaGlsZHJlbjoge30sXG4gICAgICAgICAgZG9uZTogX3RoaXMuc3RhdGUuZG9uZSxcbiAgICAgICAgICB0YWdzOiBfdGhpcy5zdGF0ZS50YWdzLFxuICAgICAgICAgIG1hY2hpbmU6IF90aGlzLm1hY2hpbmVcbiAgICAgICAgfSk7XG4gICAgICAgIG5ld1N0YXRlLmNoYW5nZWQgPSB0cnVlO1xuICAgICAgICByZXR1cm4gbmV3U3RhdGU7XG4gICAgICB9KTtcblxuICAgICAgX3RoaXMudXBkYXRlKG5leHRTdGF0ZSwgX2V2ZW50KTtcblxuICAgICAgX3RoaXMuX3N0b3BDaGlsZHJlbigpO1xuXG4gICAgICByZWdpc3RyeS5mcmVlKF90aGlzLnNlc3Npb25JZCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLmJhdGNoID0gZnVuY3Rpb24gKGV2ZW50cykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAodGhpcy5zdGF0dXMgPT09IEludGVycHJldGVyU3RhdHVzLk5vdFN0YXJ0ZWQgJiYgdGhpcy5vcHRpb25zLmRlZmVyRXZlbnRzKSB7XG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tY29uc29sZVxuICAgICAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgICAgIHdhcm4oZmFsc2UsIFwiXCIuY29uY2F0KGV2ZW50cy5sZW5ndGgsIFwiIGV2ZW50KHMpIHdlcmUgc2VudCB0byB1bmluaXRpYWxpemVkIHNlcnZpY2UgXFxcIlwiKS5jb25jYXQodGhpcy5tYWNoaW5lLmlkLCBcIlxcXCIgYW5kIGFyZSBkZWZlcnJlZC4gTWFrZSBzdXJlIC5zdGFydCgpIGlzIGNhbGxlZCBmb3IgdGhpcyBzZXJ2aWNlLlxcbkV2ZW50OiBcIikuY29uY2F0KEpTT04uc3RyaW5naWZ5KGV2ZW50KSkpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0dXMgIT09IEludGVycHJldGVyU3RhdHVzLlJ1bm5pbmcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvciggLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICAgICAgXCJcIi5jb25jYXQoZXZlbnRzLmxlbmd0aCwgXCIgZXZlbnQocykgd2VyZSBzZW50IHRvIHVuaW5pdGlhbGl6ZWQgc2VydmljZSBcXFwiXCIpLmNvbmNhdCh0aGlzLm1hY2hpbmUuaWQsIFwiXFxcIi4gTWFrZSBzdXJlIC5zdGFydCgpIGlzIGNhbGxlZCBmb3IgdGhpcyBzZXJ2aWNlLCBvciBzZXQgeyBkZWZlckV2ZW50czogdHJ1ZSB9IGluIHRoZSBzZXJ2aWNlIG9wdGlvbnMuXCIpKTtcbiAgICB9XG5cbiAgICBpZiAoIWV2ZW50cy5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZXhlYyA9ICEhdGhpcy5tYWNoaW5lLmNvbmZpZy5wcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50cyAmJiB0aGlzLl9leGVjO1xuICAgIHRoaXMuc2NoZWR1bGVyLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBlXzExLCBfYTtcblxuICAgICAgdmFyIG5leHRTdGF0ZSA9IF90aGlzLnN0YXRlO1xuICAgICAgdmFyIGJhdGNoQ2hhbmdlZCA9IGZhbHNlO1xuICAgICAgdmFyIGJhdGNoZWRBY3Rpb25zID0gW107XG5cbiAgICAgIHZhciBfbG9vcF8xID0gZnVuY3Rpb24gKGV2ZW50XzEpIHtcbiAgICAgICAgdmFyIF9ldmVudCA9IHRvU0NYTUxFdmVudChldmVudF8xKTtcblxuICAgICAgICBfdGhpcy5mb3J3YXJkKF9ldmVudCk7XG5cbiAgICAgICAgbmV4dFN0YXRlID0gcHJvdmlkZShfdGhpcywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBfdGhpcy5tYWNoaW5lLnRyYW5zaXRpb24obmV4dFN0YXRlLCBfZXZlbnQsIHVuZGVmaW5lZCwgZXhlYyB8fCB1bmRlZmluZWQpO1xuICAgICAgICB9KTtcbiAgICAgICAgYmF0Y2hlZEFjdGlvbnMucHVzaC5hcHBseShiYXRjaGVkQWN0aW9ucywgX19zcHJlYWRBcnJheShbXSwgX19yZWFkKF90aGlzLm1hY2hpbmUuY29uZmlnLnByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzID8gbmV4dFN0YXRlLmFjdGlvbnMgOiBuZXh0U3RhdGUuYWN0aW9ucy5tYXAoZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICByZXR1cm4gYmluZEFjdGlvblRvU3RhdGUoYSwgbmV4dFN0YXRlKTtcbiAgICAgICAgfSkpLCBmYWxzZSkpO1xuICAgICAgICBiYXRjaENoYW5nZWQgPSBiYXRjaENoYW5nZWQgfHwgISFuZXh0U3RhdGUuY2hhbmdlZDtcbiAgICAgIH07XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAodmFyIGV2ZW50c18xID0gX192YWx1ZXMoZXZlbnRzKSwgZXZlbnRzXzFfMSA9IGV2ZW50c18xLm5leHQoKTsgIWV2ZW50c18xXzEuZG9uZTsgZXZlbnRzXzFfMSA9IGV2ZW50c18xLm5leHQoKSkge1xuICAgICAgICAgIHZhciBldmVudF8xID0gZXZlbnRzXzFfMS52YWx1ZTtcblxuICAgICAgICAgIF9sb29wXzEoZXZlbnRfMSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVfMTFfMSkge1xuICAgICAgICBlXzExID0ge1xuICAgICAgICAgIGVycm9yOiBlXzExXzFcbiAgICAgICAgfTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKGV2ZW50c18xXzEgJiYgIWV2ZW50c18xXzEuZG9uZSAmJiAoX2EgPSBldmVudHNfMS5yZXR1cm4pKSBfYS5jYWxsKGV2ZW50c18xKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBpZiAoZV8xMSkgdGhyb3cgZV8xMS5lcnJvcjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBuZXh0U3RhdGUuY2hhbmdlZCA9IGJhdGNoQ2hhbmdlZDtcbiAgICAgIG5leHRTdGF0ZS5hY3Rpb25zID0gYmF0Y2hlZEFjdGlvbnM7XG5cbiAgICAgIF90aGlzLnVwZGF0ZShuZXh0U3RhdGUsIHRvU0NYTUxFdmVudChldmVudHNbZXZlbnRzLmxlbmd0aCAtIDFdKSk7XG4gICAgfSk7XG4gIH07XG4gIC8qKlxyXG4gICAqIFJldHVybnMgYSBzZW5kIGZ1bmN0aW9uIGJvdW5kIHRvIHRoaXMgaW50ZXJwcmV0ZXIgaW5zdGFuY2UuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50IHRvIGJlIHNlbnQgYnkgdGhlIHNlbmRlci5cclxuICAgKi9cblxuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5zZW5kZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICByZXR1cm4gdGhpcy5zZW5kLmJpbmQodGhpcywgZXZlbnQpO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5fbmV4dFN0YXRlID0gZnVuY3Rpb24gKGV2ZW50LCBleGVjKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGlmIChleGVjID09PSB2b2lkIDApIHtcbiAgICAgIGV4ZWMgPSAhIXRoaXMubWFjaGluZS5jb25maWcucHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHMgJiYgdGhpcy5fZXhlYztcbiAgICB9XG5cbiAgICB2YXIgX2V2ZW50ID0gdG9TQ1hNTEV2ZW50KGV2ZW50KTtcblxuICAgIGlmIChfZXZlbnQubmFtZS5pbmRleE9mKGVycm9yUGxhdGZvcm0pID09PSAwICYmICF0aGlzLnN0YXRlLm5leHRFdmVudHMuc29tZShmdW5jdGlvbiAobmV4dEV2ZW50KSB7XG4gICAgICByZXR1cm4gbmV4dEV2ZW50LmluZGV4T2YoZXJyb3JQbGF0Zm9ybSkgPT09IDA7XG4gICAgfSkpIHtcbiAgICAgIHRocm93IF9ldmVudC5kYXRhLmRhdGE7XG4gICAgfVxuXG4gICAgdmFyIG5leHRTdGF0ZSA9IHByb3ZpZGUodGhpcywgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIF90aGlzLm1hY2hpbmUudHJhbnNpdGlvbihfdGhpcy5zdGF0ZSwgX2V2ZW50LCB1bmRlZmluZWQsIGV4ZWMgfHwgdW5kZWZpbmVkKTtcbiAgICB9KTtcbiAgICByZXR1cm4gbmV4dFN0YXRlO1xuICB9O1xuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBuZXh0IHN0YXRlIGdpdmVuIHRoZSBpbnRlcnByZXRlcidzIGN1cnJlbnQgc3RhdGUgYW5kIHRoZSBldmVudC5cclxuICAgKlxyXG4gICAqIFRoaXMgaXMgYSBwdXJlIG1ldGhvZCB0aGF0IGRvZXMgX25vdF8gdXBkYXRlIHRoZSBpbnRlcnByZXRlcidzIHN0YXRlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGV2ZW50IFRoZSBldmVudCB0byBkZXRlcm1pbmUgdGhlIG5leHQgc3RhdGVcclxuICAgKi9cblxuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5uZXh0U3RhdGUgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICByZXR1cm4gdGhpcy5fbmV4dFN0YXRlKGV2ZW50LCBmYWxzZSk7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLmZvcndhcmQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgZV8xMiwgX2E7XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2IgPSBfX3ZhbHVlcyh0aGlzLmZvcndhcmRUbyksIF9jID0gX2IubmV4dCgpOyAhX2MuZG9uZTsgX2MgPSBfYi5uZXh0KCkpIHtcbiAgICAgICAgdmFyIGlkID0gX2MudmFsdWU7XG4gICAgICAgIHZhciBjaGlsZCA9IHRoaXMuY2hpbGRyZW4uZ2V0KGlkKTtcblxuICAgICAgICBpZiAoIWNoaWxkKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5hYmxlIHRvIGZvcndhcmQgZXZlbnQgJ1wiLmNvbmNhdChldmVudCwgXCInIGZyb20gaW50ZXJwcmV0ZXIgJ1wiKS5jb25jYXQodGhpcy5pZCwgXCInIHRvIG5vbmV4aXN0YW50IGNoaWxkICdcIikuY29uY2F0KGlkLCBcIicuXCIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNoaWxkLnNlbmQoZXZlbnQpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfMTJfMSkge1xuICAgICAgZV8xMiA9IHtcbiAgICAgICAgZXJyb3I6IGVfMTJfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKF9jICYmICFfYy5kb25lICYmIChfYSA9IF9iLnJldHVybikpIF9hLmNhbGwoX2IpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfMTIpIHRocm93IGVfMTIuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5kZWZlciA9IGZ1bmN0aW9uIChzZW5kQWN0aW9uKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciB0aW1lcklkID0gdGhpcy5jbG9jay5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICgndG8nIGluIHNlbmRBY3Rpb24gJiYgc2VuZEFjdGlvbi50bykge1xuICAgICAgICBfdGhpcy5zZW5kVG8oc2VuZEFjdGlvbi5fZXZlbnQsIHNlbmRBY3Rpb24udG8sIHRydWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX3RoaXMuc2VuZChzZW5kQWN0aW9uLl9ldmVudCk7XG4gICAgICB9XG4gICAgfSwgc2VuZEFjdGlvbi5kZWxheSk7XG5cbiAgICBpZiAoc2VuZEFjdGlvbi5pZCkge1xuICAgICAgdGhpcy5kZWxheWVkRXZlbnRzTWFwW3NlbmRBY3Rpb24uaWRdID0gdGltZXJJZDtcbiAgICB9XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLmNhbmNlbCA9IGZ1bmN0aW9uIChzZW5kSWQpIHtcbiAgICB0aGlzLmNsb2NrLmNsZWFyVGltZW91dCh0aGlzLmRlbGF5ZWRFdmVudHNNYXBbc2VuZElkXSk7XG4gICAgZGVsZXRlIHRoaXMuZGVsYXllZEV2ZW50c01hcFtzZW5kSWRdO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5leGVjID0gZnVuY3Rpb24gKGFjdGlvbiwgc3RhdGUsIGFjdGlvbkZ1bmN0aW9uTWFwKSB7XG4gICAgaWYgKGFjdGlvbkZ1bmN0aW9uTWFwID09PSB2b2lkIDApIHtcbiAgICAgIGFjdGlvbkZ1bmN0aW9uTWFwID0gdGhpcy5tYWNoaW5lLm9wdGlvbnMuYWN0aW9ucztcbiAgICB9XG5cbiAgICB0aGlzLl9leGVjKGFjdGlvbiwgc3RhdGUuY29udGV4dCwgc3RhdGUuX2V2ZW50LCBhY3Rpb25GdW5jdGlvbk1hcCk7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnJlbW92ZUNoaWxkID0gZnVuY3Rpb24gKGNoaWxkSWQpIHtcbiAgICB2YXIgX2E7XG5cbiAgICB0aGlzLmNoaWxkcmVuLmRlbGV0ZShjaGlsZElkKTtcbiAgICB0aGlzLmZvcndhcmRUby5kZWxldGUoY2hpbGRJZCk7IC8vIHRoaXMuc3RhdGUgbWlnaHQgbm90IGV4aXN0IGF0IHRoZSB0aW1lIHRoaXMgaXMgY2FsbGVkLFxuICAgIC8vIHN1Y2ggYXMgd2hlbiBhIGNoaWxkIGlzIGFkZGVkIHRoZW4gcmVtb3ZlZCB3aGlsZSBpbml0aWFsaXppbmcgdGhlIHN0YXRlXG5cbiAgICAoX2EgPSB0aGlzLnN0YXRlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdHJ1ZSA6IGRlbGV0ZSBfYS5jaGlsZHJlbltjaGlsZElkXTtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuc3RvcENoaWxkID0gZnVuY3Rpb24gKGNoaWxkSWQpIHtcbiAgICB2YXIgY2hpbGQgPSB0aGlzLmNoaWxkcmVuLmdldChjaGlsZElkKTtcblxuICAgIGlmICghY2hpbGQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnJlbW92ZUNoaWxkKGNoaWxkSWQpO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oY2hpbGQuc3RvcCkpIHtcbiAgICAgIGNoaWxkLnN0b3AoKTtcbiAgICB9XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnNwYXduID0gZnVuY3Rpb24gKGVudGl0eSwgbmFtZSwgb3B0aW9ucykge1xuICAgIGlmICh0aGlzLnN0YXR1cyAhPT0gSW50ZXJwcmV0ZXJTdGF0dXMuUnVubmluZykge1xuICAgICAgcmV0dXJuIGNyZWF0ZURlZmVycmVkQWN0b3IoZW50aXR5LCBuYW1lKTtcbiAgICB9XG5cbiAgICBpZiAoaXNQcm9taXNlTGlrZShlbnRpdHkpKSB7XG4gICAgICByZXR1cm4gdGhpcy5zcGF3blByb21pc2UoUHJvbWlzZS5yZXNvbHZlKGVudGl0eSksIG5hbWUpO1xuICAgIH0gZWxzZSBpZiAoaXNGdW5jdGlvbihlbnRpdHkpKSB7XG4gICAgICByZXR1cm4gdGhpcy5zcGF3bkNhbGxiYWNrKGVudGl0eSwgbmFtZSk7XG4gICAgfSBlbHNlIGlmIChpc1NwYXduZWRBY3RvcihlbnRpdHkpKSB7XG4gICAgICByZXR1cm4gdGhpcy5zcGF3bkFjdG9yKGVudGl0eSwgbmFtZSk7XG4gICAgfSBlbHNlIGlmIChpc09ic2VydmFibGUoZW50aXR5KSkge1xuICAgICAgcmV0dXJuIHRoaXMuc3Bhd25PYnNlcnZhYmxlKGVudGl0eSwgbmFtZSk7XG4gICAgfSBlbHNlIGlmIChpc01hY2hpbmUoZW50aXR5KSkge1xuICAgICAgcmV0dXJuIHRoaXMuc3Bhd25NYWNoaW5lKGVudGl0eSwgX19hc3NpZ24oX19hc3NpZ24oe30sIG9wdGlvbnMpLCB7XG4gICAgICAgIGlkOiBuYW1lXG4gICAgICB9KSk7XG4gICAgfSBlbHNlIGlmIChpc0JlaGF2aW9yKGVudGl0eSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnNwYXduQmVoYXZpb3IoZW50aXR5LCBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5hYmxlIHRvIHNwYXduIGVudGl0eSBcXFwiXCIuY29uY2F0KG5hbWUsIFwiXFxcIiBvZiB0eXBlIFxcXCJcIikuY29uY2F0KHR5cGVvZiBlbnRpdHksIFwiXFxcIi5cIikpO1xuICAgIH1cbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuc3Bhd25NYWNoaW5lID0gZnVuY3Rpb24gKG1hY2hpbmUsIG9wdGlvbnMpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cblxuICAgIHZhciBjaGlsZFNlcnZpY2UgPSBuZXcgSW50ZXJwcmV0ZXIobWFjaGluZSwgX19hc3NpZ24oX19hc3NpZ24oe30sIHRoaXMub3B0aW9ucyksIHtcbiAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgIGlkOiBvcHRpb25zLmlkIHx8IG1hY2hpbmUuaWRcbiAgICB9KSk7XG5cbiAgICB2YXIgcmVzb2x2ZWRPcHRpb25zID0gX19hc3NpZ24oX19hc3NpZ24oe30sIERFRkFVTFRfU1BBV05fT1BUSU9OUyksIG9wdGlvbnMpO1xuXG4gICAgaWYgKHJlc29sdmVkT3B0aW9ucy5zeW5jKSB7XG4gICAgICBjaGlsZFNlcnZpY2Uub25UcmFuc2l0aW9uKGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgICBfdGhpcy5zZW5kKHVwZGF0ZSwge1xuICAgICAgICAgIHN0YXRlOiBzdGF0ZSxcbiAgICAgICAgICBpZDogY2hpbGRTZXJ2aWNlLmlkXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdmFyIGFjdG9yID0gY2hpbGRTZXJ2aWNlO1xuICAgIHRoaXMuY2hpbGRyZW4uc2V0KGNoaWxkU2VydmljZS5pZCwgYWN0b3IpO1xuXG4gICAgaWYgKHJlc29sdmVkT3B0aW9ucy5hdXRvRm9yd2FyZCkge1xuICAgICAgdGhpcy5mb3J3YXJkVG8uYWRkKGNoaWxkU2VydmljZS5pZCk7XG4gICAgfVxuXG4gICAgY2hpbGRTZXJ2aWNlLm9uRG9uZShmdW5jdGlvbiAoZG9uZUV2ZW50KSB7XG4gICAgICBfdGhpcy5yZW1vdmVDaGlsZChjaGlsZFNlcnZpY2UuaWQpO1xuXG4gICAgICBfdGhpcy5zZW5kKHRvU0NYTUxFdmVudChkb25lRXZlbnQsIHtcbiAgICAgICAgb3JpZ2luOiBjaGlsZFNlcnZpY2UuaWRcbiAgICAgIH0pKTtcbiAgICB9KS5zdGFydCgpO1xuICAgIHJldHVybiBhY3RvcjtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuc3Bhd25CZWhhdmlvciA9IGZ1bmN0aW9uIChiZWhhdmlvciwgaWQpIHtcbiAgICB2YXIgYWN0b3JSZWYgPSBzcGF3bkJlaGF2aW9yKGJlaGF2aW9yLCB7XG4gICAgICBpZDogaWQsXG4gICAgICBwYXJlbnQ6IHRoaXNcbiAgICB9KTtcbiAgICB0aGlzLmNoaWxkcmVuLnNldChpZCwgYWN0b3JSZWYpO1xuICAgIHJldHVybiBhY3RvclJlZjtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuc3Bhd25Qcm9taXNlID0gZnVuY3Rpb24gKHByb21pc2UsIGlkKSB7XG4gICAgdmFyIF9hO1xuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBjYW5jZWxlZCA9IGZhbHNlO1xuICAgIHZhciByZXNvbHZlZERhdGE7XG4gICAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgaWYgKCFjYW5jZWxlZCkge1xuICAgICAgICByZXNvbHZlZERhdGEgPSByZXNwb25zZTtcblxuICAgICAgICBfdGhpcy5yZW1vdmVDaGlsZChpZCk7XG5cbiAgICAgICAgX3RoaXMuc2VuZCh0b1NDWE1MRXZlbnQoZG9uZUludm9rZShpZCwgcmVzcG9uc2UpLCB7XG4gICAgICAgICAgb3JpZ2luOiBpZFxuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgfSwgZnVuY3Rpb24gKGVycm9yRGF0YSkge1xuICAgICAgaWYgKCFjYW5jZWxlZCkge1xuICAgICAgICBfdGhpcy5yZW1vdmVDaGlsZChpZCk7XG5cbiAgICAgICAgdmFyIGVycm9yRXZlbnQgPSBlcnJvcihpZCwgZXJyb3JEYXRhKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIFNlbmQgXCJlcnJvci5wbGF0Zm9ybS5pZFwiIHRvIHRoaXMgKHBhcmVudCkuXG4gICAgICAgICAgX3RoaXMuc2VuZCh0b1NDWE1MRXZlbnQoZXJyb3JFdmVudCwge1xuICAgICAgICAgICAgb3JpZ2luOiBpZFxuICAgICAgICAgIH0pKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICByZXBvcnRVbmhhbmRsZWRFeGNlcHRpb25Pbkludm9jYXRpb24oZXJyb3JEYXRhLCBlcnJvciwgaWQpO1xuXG4gICAgICAgICAgaWYgKF90aGlzLmRldlRvb2xzKSB7XG4gICAgICAgICAgICBfdGhpcy5kZXZUb29scy5zZW5kKGVycm9yRXZlbnQsIF90aGlzLnN0YXRlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoX3RoaXMubWFjaGluZS5zdHJpY3QpIHtcbiAgICAgICAgICAgIC8vIGl0IHdvdWxkIGJlIGJldHRlciB0byBhbHdheXMgc3RvcCB0aGUgc3RhdGUgbWFjaGluZSBpZiB1bmhhbmRsZWRcbiAgICAgICAgICAgIC8vIGV4Y2VwdGlvbi9wcm9taXNlIHJlamVjdGlvbiBoYXBwZW5zIGJ1dCBiZWNhdXNlIHdlIGRvbid0IHdhbnQgdG9cbiAgICAgICAgICAgIC8vIGJyZWFrIGV4aXN0aW5nIGNvZGUgc28gZW5mb3JjZSBpdCBvbiBzdHJpY3QgbW9kZSBvbmx5IGVzcGVjaWFsbHkgc29cbiAgICAgICAgICAgIC8vIGJlY2F1c2UgZG9jdW1lbnRhdGlvbiBzYXlzIHRoYXQgb25FcnJvciBpcyBvcHRpb25hbFxuICAgICAgICAgICAgX3RoaXMuc3RvcCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBhY3RvciA9IChfYSA9IHtcbiAgICAgIGlkOiBpZCxcbiAgICAgIHNlbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICAgIH0sXG4gICAgICBzdWJzY3JpYmU6IGZ1bmN0aW9uIChuZXh0LCBoYW5kbGVFcnJvciwgY29tcGxldGUpIHtcbiAgICAgICAgdmFyIG9ic2VydmVyID0gdG9PYnNlcnZlcihuZXh0LCBoYW5kbGVFcnJvciwgY29tcGxldGUpO1xuICAgICAgICB2YXIgdW5zdWJzY3JpYmVkID0gZmFsc2U7XG4gICAgICAgIHByb21pc2UudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICBpZiAodW5zdWJzY3JpYmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgb2JzZXJ2ZXIubmV4dChyZXNwb25zZSk7XG5cbiAgICAgICAgICBpZiAodW5zdWJzY3JpYmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgIGlmICh1bnN1YnNjcmliZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBvYnNlcnZlci5lcnJvcihlcnIpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuc3Vic2NyaWJlZCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSxcbiAgICAgIHN0b3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2FuY2VsZWQgPSB0cnVlO1xuICAgICAgfSxcbiAgICAgIHRvSlNPTjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlkOiBpZFxuICAgICAgICB9O1xuICAgICAgfSxcbiAgICAgIGdldFNuYXBzaG90OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiByZXNvbHZlZERhdGE7XG4gICAgICB9XG4gICAgfSwgX2Fbc3ltYm9sT2JzZXJ2YWJsZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LCBfYSk7XG4gICAgdGhpcy5jaGlsZHJlbi5zZXQoaWQsIGFjdG9yKTtcbiAgICByZXR1cm4gYWN0b3I7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnNwYXduQ2FsbGJhY2sgPSBmdW5jdGlvbiAoY2FsbGJhY2ssIGlkKSB7XG4gICAgdmFyIF9hO1xuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBjYW5jZWxlZCA9IGZhbHNlO1xuICAgIHZhciByZWNlaXZlcnMgPSBuZXcgU2V0KCk7XG4gICAgdmFyIGxpc3RlbmVycyA9IG5ldyBTZXQoKTtcbiAgICB2YXIgZW1pdHRlZDtcblxuICAgIHZhciByZWNlaXZlID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgIGVtaXR0ZWQgPSBlO1xuICAgICAgbGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgICAgIHJldHVybiBsaXN0ZW5lcihlKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoY2FuY2VsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBfdGhpcy5zZW5kKHRvU0NYTUxFdmVudChlLCB7XG4gICAgICAgIG9yaWdpbjogaWRcbiAgICAgIH0pKTtcbiAgICB9O1xuXG4gICAgdmFyIGNhbGxiYWNrU3RvcDtcblxuICAgIHRyeSB7XG4gICAgICBjYWxsYmFja1N0b3AgPSBjYWxsYmFjayhyZWNlaXZlLCBmdW5jdGlvbiAobmV3TGlzdGVuZXIpIHtcbiAgICAgICAgcmVjZWl2ZXJzLmFkZChuZXdMaXN0ZW5lcik7XG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMuc2VuZChlcnJvcihpZCwgZXJyKSk7XG4gICAgfVxuXG4gICAgaWYgKGlzUHJvbWlzZUxpa2UoY2FsbGJhY2tTdG9wKSkge1xuICAgICAgLy8gaXQgdHVybmVkIG91dCB0byBiZSBhbiBhc3luYyBmdW5jdGlvbiwgY2FuJ3QgcmVsaWFibHkgY2hlY2sgdGhpcyBiZWZvcmUgY2FsbGluZyBgY2FsbGJhY2tgXG4gICAgICAvLyBiZWNhdXNlIHRyYW5zcGlsZWQgYXN5bmMgZnVuY3Rpb25zIGFyZSBub3QgcmVjb2duaXphYmxlXG4gICAgICByZXR1cm4gdGhpcy5zcGF3blByb21pc2UoY2FsbGJhY2tTdG9wLCBpZCk7XG4gICAgfVxuXG4gICAgdmFyIGFjdG9yID0gKF9hID0ge1xuICAgICAgaWQ6IGlkLFxuICAgICAgc2VuZDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHJldHVybiByZWNlaXZlcnMuZm9yRWFjaChmdW5jdGlvbiAocmVjZWl2ZXIpIHtcbiAgICAgICAgICByZXR1cm4gcmVjZWl2ZXIoZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBzdWJzY3JpYmU6IGZ1bmN0aW9uIChuZXh0KSB7XG4gICAgICAgIHZhciBvYnNlcnZlciA9IHRvT2JzZXJ2ZXIobmV4dCk7XG4gICAgICAgIGxpc3RlbmVycy5hZGQob2JzZXJ2ZXIubmV4dCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxpc3RlbmVycy5kZWxldGUob2JzZXJ2ZXIubmV4dCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSxcbiAgICAgIHN0b3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2FuY2VsZWQgPSB0cnVlO1xuXG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKGNhbGxiYWNrU3RvcCkpIHtcbiAgICAgICAgICBjYWxsYmFja1N0b3AoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHRvSlNPTjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlkOiBpZFxuICAgICAgICB9O1xuICAgICAgfSxcbiAgICAgIGdldFNuYXBzaG90OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBlbWl0dGVkO1xuICAgICAgfVxuICAgIH0sIF9hW3N5bWJvbE9ic2VydmFibGVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSwgX2EpO1xuICAgIHRoaXMuY2hpbGRyZW4uc2V0KGlkLCBhY3Rvcik7XG4gICAgcmV0dXJuIGFjdG9yO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5zcGF3bk9ic2VydmFibGUgPSBmdW5jdGlvbiAoc291cmNlLCBpZCkge1xuICAgIHZhciBfYTtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgZW1pdHRlZDtcbiAgICB2YXIgc3Vic2NyaXB0aW9uID0gc291cmNlLnN1YnNjcmliZShmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIGVtaXR0ZWQgPSB2YWx1ZTtcblxuICAgICAgX3RoaXMuc2VuZCh0b1NDWE1MRXZlbnQodmFsdWUsIHtcbiAgICAgICAgb3JpZ2luOiBpZFxuICAgICAgfSkpO1xuICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIF90aGlzLnJlbW92ZUNoaWxkKGlkKTtcblxuICAgICAgX3RoaXMuc2VuZCh0b1NDWE1MRXZlbnQoZXJyb3IoaWQsIGVyciksIHtcbiAgICAgICAgb3JpZ2luOiBpZFxuICAgICAgfSkpO1xuICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgIF90aGlzLnJlbW92ZUNoaWxkKGlkKTtcblxuICAgICAgX3RoaXMuc2VuZCh0b1NDWE1MRXZlbnQoZG9uZUludm9rZShpZCksIHtcbiAgICAgICAgb3JpZ2luOiBpZFxuICAgICAgfSkpO1xuICAgIH0pO1xuICAgIHZhciBhY3RvciA9IChfYSA9IHtcbiAgICAgIGlkOiBpZCxcbiAgICAgIHNlbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICAgIH0sXG4gICAgICBzdWJzY3JpYmU6IGZ1bmN0aW9uIChuZXh0LCBoYW5kbGVFcnJvciwgY29tcGxldGUpIHtcbiAgICAgICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV4dCwgaGFuZGxlRXJyb3IsIGNvbXBsZXRlKTtcbiAgICAgIH0sXG4gICAgICBzdG9wOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIH0sXG4gICAgICBnZXRTbmFwc2hvdDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZW1pdHRlZDtcbiAgICAgIH0sXG4gICAgICB0b0pTT046IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpZDogaWRcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9LCBfYVtzeW1ib2xPYnNlcnZhYmxlXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sIF9hKTtcbiAgICB0aGlzLmNoaWxkcmVuLnNldChpZCwgYWN0b3IpO1xuICAgIHJldHVybiBhY3RvcjtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuc3Bhd25BY3RvciA9IGZ1bmN0aW9uIChhY3RvciwgbmFtZSkge1xuICAgIHRoaXMuY2hpbGRyZW4uc2V0KG5hbWUsIGFjdG9yKTtcbiAgICByZXR1cm4gYWN0b3I7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnNwYXduQWN0aXZpdHkgPSBmdW5jdGlvbiAoYWN0aXZpdHkpIHtcbiAgICB2YXIgaW1wbGVtZW50YXRpb24gPSB0aGlzLm1hY2hpbmUub3B0aW9ucyAmJiB0aGlzLm1hY2hpbmUub3B0aW9ucy5hY3Rpdml0aWVzID8gdGhpcy5tYWNoaW5lLm9wdGlvbnMuYWN0aXZpdGllc1thY3Rpdml0eS50eXBlXSA6IHVuZGVmaW5lZDtcblxuICAgIGlmICghaW1wbGVtZW50YXRpb24pIHtcbiAgICAgIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgICAgICB3YXJuKGZhbHNlLCBcIk5vIGltcGxlbWVudGF0aW9uIGZvdW5kIGZvciBhY3Rpdml0eSAnXCIuY29uY2F0KGFjdGl2aXR5LnR5cGUsIFwiJ1wiKSk7XG4gICAgICB9IC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1jb25zb2xlXG5cblxuICAgICAgcmV0dXJuO1xuICAgIH0gLy8gU3RhcnQgaW1wbGVtZW50YXRpb25cblxuXG4gICAgdmFyIGRpc3Bvc2UgPSBpbXBsZW1lbnRhdGlvbih0aGlzLnN0YXRlLmNvbnRleHQsIGFjdGl2aXR5KTtcbiAgICB0aGlzLnNwYXduRWZmZWN0KGFjdGl2aXR5LmlkLCBkaXNwb3NlKTtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuc3Bhd25FZmZlY3QgPSBmdW5jdGlvbiAoaWQsIGRpc3Bvc2UpIHtcbiAgICB2YXIgX2E7XG5cbiAgICB0aGlzLmNoaWxkcmVuLnNldChpZCwgKF9hID0ge1xuICAgICAgaWQ6IGlkLFxuICAgICAgc2VuZDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgICAgfSxcbiAgICAgIHN1YnNjcmliZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICBzdG9wOiBkaXNwb3NlIHx8IHVuZGVmaW5lZCxcbiAgICAgIGdldFNuYXBzaG90OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9LFxuICAgICAgdG9KU09OOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaWQ6IGlkXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSwgX2Fbc3ltYm9sT2JzZXJ2YWJsZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LCBfYSkpO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5hdHRhY2hEZXYgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGdsb2JhbCA9IGdldEdsb2JhbCgpO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5kZXZUb29scyAmJiBnbG9iYWwpIHtcbiAgICAgIGlmIChnbG9iYWwuX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fXykge1xuICAgICAgICB2YXIgZGV2VG9vbHNPcHRpb25zID0gdHlwZW9mIHRoaXMub3B0aW9ucy5kZXZUb29scyA9PT0gJ29iamVjdCcgPyB0aGlzLm9wdGlvbnMuZGV2VG9vbHMgOiB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuZGV2VG9vbHMgPSBnbG9iYWwuX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fXy5jb25uZWN0KF9fYXNzaWduKF9fYXNzaWduKHtcbiAgICAgICAgICBuYW1lOiB0aGlzLmlkLFxuICAgICAgICAgIGF1dG9QYXVzZTogdHJ1ZSxcbiAgICAgICAgICBzdGF0ZVNhbml0aXplcjogZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB2YWx1ZTogc3RhdGUudmFsdWUsXG4gICAgICAgICAgICAgIGNvbnRleHQ6IHN0YXRlLmNvbnRleHQsXG4gICAgICAgICAgICAgIGFjdGlvbnM6IHN0YXRlLmFjdGlvbnNcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9LCBkZXZUb29sc09wdGlvbnMpLCB7XG4gICAgICAgICAgZmVhdHVyZXM6IF9fYXNzaWduKHtcbiAgICAgICAgICAgIGp1bXA6IGZhbHNlLFxuICAgICAgICAgICAgc2tpcDogZmFsc2VcbiAgICAgICAgICB9LCBkZXZUb29sc09wdGlvbnMgPyBkZXZUb29sc09wdGlvbnMuZmVhdHVyZXMgOiB1bmRlZmluZWQpXG4gICAgICAgIH0pLCB0aGlzLm1hY2hpbmUpO1xuICAgICAgICB0aGlzLmRldlRvb2xzLmluaXQodGhpcy5zdGF0ZSk7XG4gICAgICB9IC8vIGFkZCBYU3RhdGUtc3BlY2lmaWMgZGV2IHRvb2xpbmcgaG9va1xuXG5cbiAgICAgIHJlZ2lzdGVyU2VydmljZSh0aGlzKTtcbiAgICB9XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IHRoaXMuaWRcbiAgICB9O1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZVtzeW1ib2xPYnNlcnZhYmxlXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuZ2V0U25hcHNob3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSBJbnRlcnByZXRlclN0YXR1cy5Ob3RTdGFydGVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbml0aWFsU3RhdGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlO1xuICB9O1xuICAvKipcclxuICAgKiBUaGUgZGVmYXVsdCBpbnRlcnByZXRlciBvcHRpb25zOlxyXG4gICAqXHJcbiAgICogLSBgY2xvY2tgIHVzZXMgdGhlIGdsb2JhbCBgc2V0VGltZW91dGAgYW5kIGBjbGVhclRpbWVvdXRgIGZ1bmN0aW9uc1xyXG4gICAqIC0gYGxvZ2dlcmAgdXNlcyB0aGUgZ2xvYmFsIGBjb25zb2xlLmxvZygpYCBtZXRob2RcclxuICAgKi9cblxuXG4gIEludGVycHJldGVyLmRlZmF1bHRPcHRpb25zID0ge1xuICAgIGV4ZWN1dGU6IHRydWUsXG4gICAgZGVmZXJFdmVudHM6IHRydWUsXG4gICAgY2xvY2s6IHtcbiAgICAgIHNldFRpbWVvdXQ6IGZ1bmN0aW9uIChmbiwgbXMpIHtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZm4sIG1zKTtcbiAgICAgIH0sXG4gICAgICBjbGVhclRpbWVvdXQ6IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KGlkKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGxvZ2dlcjogLyojX19QVVJFX18qL2NvbnNvbGUubG9nLmJpbmQoY29uc29sZSksXG4gICAgZGV2VG9vbHM6IGZhbHNlXG4gIH07XG4gIEludGVycHJldGVyLmludGVycHJldCA9IGludGVycHJldDtcbiAgcmV0dXJuIEludGVycHJldGVyO1xufSgpO1xuXG52YXIgcmVzb2x2ZVNwYXduT3B0aW9ucyA9IGZ1bmN0aW9uIChuYW1lT3JPcHRpb25zKSB7XG4gIGlmIChpc1N0cmluZyhuYW1lT3JPcHRpb25zKSkge1xuICAgIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgREVGQVVMVF9TUEFXTl9PUFRJT05TKSwge1xuICAgICAgbmFtZTogbmFtZU9yT3B0aW9uc1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKF9fYXNzaWduKHt9LCBERUZBVUxUX1NQQVdOX09QVElPTlMpLCB7XG4gICAgbmFtZTogdW5pcXVlSWQoKVxuICB9KSwgbmFtZU9yT3B0aW9ucyk7XG59O1xuXG5mdW5jdGlvbiBzcGF3bihlbnRpdHksIG5hbWVPck9wdGlvbnMpIHtcbiAgdmFyIHJlc29sdmVkT3B0aW9ucyA9IHJlc29sdmVTcGF3bk9wdGlvbnMobmFtZU9yT3B0aW9ucyk7XG4gIHJldHVybiBjb25zdW1lKGZ1bmN0aW9uIChzZXJ2aWNlKSB7XG4gICAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgICB2YXIgaXNMYXp5RW50aXR5ID0gaXNNYWNoaW5lKGVudGl0eSkgfHwgaXNGdW5jdGlvbihlbnRpdHkpO1xuICAgICAgd2FybighIXNlcnZpY2UgfHwgaXNMYXp5RW50aXR5LCBcIkF0dGVtcHRlZCB0byBzcGF3biBhbiBBY3RvciAoSUQ6IFxcXCJcIi5jb25jYXQoaXNNYWNoaW5lKGVudGl0eSkgPyBlbnRpdHkuaWQgOiAndW5kZWZpbmVkJywgXCJcXFwiKSBvdXRzaWRlIG9mIGEgc2VydmljZS4gVGhpcyB3aWxsIGhhdmUgbm8gZWZmZWN0LlwiKSk7XG4gICAgfVxuXG4gICAgaWYgKHNlcnZpY2UpIHtcbiAgICAgIHJldHVybiBzZXJ2aWNlLnNwYXduKGVudGl0eSwgcmVzb2x2ZWRPcHRpb25zLm5hbWUsIHJlc29sdmVkT3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjcmVhdGVEZWZlcnJlZEFjdG9yKGVudGl0eSwgcmVzb2x2ZWRPcHRpb25zLm5hbWUpO1xuICAgIH1cbiAgfSk7XG59XG4vKipcclxuICogQ3JlYXRlcyBhIG5ldyBJbnRlcnByZXRlciBpbnN0YW5jZSBmb3IgdGhlIGdpdmVuIG1hY2hpbmUgd2l0aCB0aGUgcHJvdmlkZWQgb3B0aW9ucywgaWYgYW55LlxyXG4gKlxyXG4gKiBAcGFyYW0gbWFjaGluZSBUaGUgbWFjaGluZSB0byBpbnRlcnByZXRcclxuICogQHBhcmFtIG9wdGlvbnMgSW50ZXJwcmV0ZXIgb3B0aW9uc1xyXG4gKi9cblxuZnVuY3Rpb24gaW50ZXJwcmV0KG1hY2hpbmUsIG9wdGlvbnMpIHtcbiAgdmFyIGludGVycHJldGVyID0gbmV3IEludGVycHJldGVyKG1hY2hpbmUsIG9wdGlvbnMpO1xuICByZXR1cm4gaW50ZXJwcmV0ZXI7XG59XG5cbmV4cG9ydCB7IEludGVycHJldGVyLCBJbnRlcnByZXRlclN0YXR1cywgaW50ZXJwcmV0LCBzcGF3biB9O1xuIiwiaW1wb3J0IHsgX19hc3NpZ24sIF9fcmVzdCB9IGZyb20gJy4vX3ZpcnR1YWwvX3RzbGliLmpzJztcbmltcG9ydCAnLi90eXBlcy5qcyc7XG5pbXBvcnQgeyBpbnZva2UgfSBmcm9tICcuL2FjdGlvblR5cGVzLmpzJztcbmltcG9ydCAnLi91dGlscy5qcyc7XG5pbXBvcnQgJy4vZW52aXJvbm1lbnQuanMnO1xuXG5mdW5jdGlvbiB0b0ludm9rZVNvdXJjZShzcmMpIHtcbiAgaWYgKHR5cGVvZiBzcmMgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFyIHNpbXBsZVNyYyA9IHtcbiAgICAgIHR5cGU6IHNyY1xuICAgIH07XG5cbiAgICBzaW1wbGVTcmMudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gc3JjO1xuICAgIH07IC8vIHY0IGNvbXBhdCAtIFRPRE86IHJlbW92ZSBpbiB2NVxuXG5cbiAgICByZXR1cm4gc2ltcGxlU3JjO1xuICB9XG5cbiAgcmV0dXJuIHNyYztcbn1cbmZ1bmN0aW9uIHRvSW52b2tlRGVmaW5pdGlvbihpbnZva2VDb25maWcpIHtcbiAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHtcbiAgICB0eXBlOiBpbnZva2VcbiAgfSwgaW52b2tlQ29uZmlnKSwge1xuICAgIHRvSlNPTjogZnVuY3Rpb24gKCkge1xuICAgICAgaW52b2tlQ29uZmlnLm9uRG9uZTtcbiAgICAgICAgICBpbnZva2VDb25maWcub25FcnJvcjtcbiAgICAgICAgICB2YXIgaW52b2tlRGVmID0gX19yZXN0KGludm9rZUNvbmZpZywgW1wib25Eb25lXCIsIFwib25FcnJvclwiXSk7XG5cbiAgICAgIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgaW52b2tlRGVmKSwge1xuICAgICAgICB0eXBlOiBpbnZva2UsXG4gICAgICAgIHNyYzogdG9JbnZva2VTb3VyY2UoaW52b2tlQ29uZmlnLnNyYylcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCB7IHRvSW52b2tlRGVmaW5pdGlvbiwgdG9JbnZva2VTb3VyY2UgfTtcbiIsImltcG9ydCB7IF9fdmFsdWVzIH0gZnJvbSAnLi9fdmlydHVhbC9fdHNsaWIuanMnO1xuaW1wb3J0IHsgbWF0Y2hlc1N0YXRlIH0gZnJvbSAnLi91dGlscy5qcyc7XG5cbmZ1bmN0aW9uIG1hcFN0YXRlKHN0YXRlTWFwLCBzdGF0ZUlkKSB7XG4gIHZhciBlXzEsIF9hO1xuXG4gIHZhciBmb3VuZFN0YXRlSWQ7XG5cbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBfYiA9IF9fdmFsdWVzKE9iamVjdC5rZXlzKHN0YXRlTWFwKSksIF9jID0gX2IubmV4dCgpOyAhX2MuZG9uZTsgX2MgPSBfYi5uZXh0KCkpIHtcbiAgICAgIHZhciBtYXBwZWRTdGF0ZUlkID0gX2MudmFsdWU7XG5cbiAgICAgIGlmIChtYXRjaGVzU3RhdGUobWFwcGVkU3RhdGVJZCwgc3RhdGVJZCkgJiYgKCFmb3VuZFN0YXRlSWQgfHwgc3RhdGVJZC5sZW5ndGggPiBmb3VuZFN0YXRlSWQubGVuZ3RoKSkge1xuICAgICAgICBmb3VuZFN0YXRlSWQgPSBtYXBwZWRTdGF0ZUlkO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZV8xXzEpIHtcbiAgICBlXzEgPSB7XG4gICAgICBlcnJvcjogZV8xXzFcbiAgICB9O1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoX2MgJiYgIV9jLmRvbmUgJiYgKF9hID0gX2IucmV0dXJuKSkgX2EuY2FsbChfYik7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gc3RhdGVNYXBbZm91bmRTdGF0ZUlkXTtcbn1cblxuZXhwb3J0IHsgbWFwU3RhdGUgfTtcbiIsImltcG9ydCB7IF9fdmFsdWVzLCBfX3JlYWQgfSBmcm9tICcuL192aXJ0dWFsL190c2xpYi5qcyc7XG5pbXBvcnQgeyBTdGF0ZSB9IGZyb20gJy4vU3RhdGUuanMnO1xuXG5mdW5jdGlvbiBtYXRjaFN0YXRlKHN0YXRlLCBwYXR0ZXJucywgZGVmYXVsdFZhbHVlKSB7XG4gIHZhciBlXzEsIF9hO1xuXG4gIHZhciByZXNvbHZlZFN0YXRlID0gU3RhdGUuZnJvbShzdGF0ZSwgc3RhdGUgaW5zdGFuY2VvZiBTdGF0ZSA/IHN0YXRlLmNvbnRleHQgOiB1bmRlZmluZWQpO1xuXG4gIHRyeSB7XG4gICAgZm9yICh2YXIgcGF0dGVybnNfMSA9IF9fdmFsdWVzKHBhdHRlcm5zKSwgcGF0dGVybnNfMV8xID0gcGF0dGVybnNfMS5uZXh0KCk7ICFwYXR0ZXJuc18xXzEuZG9uZTsgcGF0dGVybnNfMV8xID0gcGF0dGVybnNfMS5uZXh0KCkpIHtcbiAgICAgIHZhciBfYiA9IF9fcmVhZChwYXR0ZXJuc18xXzEudmFsdWUsIDIpLFxuICAgICAgICAgIHN0YXRlVmFsdWUgPSBfYlswXSxcbiAgICAgICAgICBnZXRWYWx1ZSA9IF9iWzFdO1xuXG4gICAgICBpZiAocmVzb2x2ZWRTdGF0ZS5tYXRjaGVzKHN0YXRlVmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBnZXRWYWx1ZShyZXNvbHZlZFN0YXRlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVfMV8xKSB7XG4gICAgZV8xID0ge1xuICAgICAgZXJyb3I6IGVfMV8xXG4gICAgfTtcbiAgfSBmaW5hbGx5IHtcbiAgICB0cnkge1xuICAgICAgaWYgKHBhdHRlcm5zXzFfMSAmJiAhcGF0dGVybnNfMV8xLmRvbmUgJiYgKF9hID0gcGF0dGVybnNfMS5yZXR1cm4pKSBfYS5jYWxsKHBhdHRlcm5zXzEpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpZiAoZV8xKSB0aHJvdyBlXzEuZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRlZmF1bHRWYWx1ZShyZXNvbHZlZFN0YXRlKTtcbn1cblxuZXhwb3J0IHsgbWF0Y2hTdGF0ZSB9O1xuIiwidmFyIGNoaWxkcmVuID0gLyojX19QVVJFX18qL25ldyBNYXAoKTtcbnZhciBzZXNzaW9uSWRJbmRleCA9IDA7XG52YXIgcmVnaXN0cnkgPSB7XG4gIGJvb2tJZDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBcIng6XCIuY29uY2F0KHNlc3Npb25JZEluZGV4KyspO1xuICB9LFxuICByZWdpc3RlcjogZnVuY3Rpb24gKGlkLCBhY3Rvcikge1xuICAgIGNoaWxkcmVuLnNldChpZCwgYWN0b3IpO1xuICAgIHJldHVybiBpZDtcbiAgfSxcbiAgZ2V0OiBmdW5jdGlvbiAoaWQpIHtcbiAgICByZXR1cm4gY2hpbGRyZW4uZ2V0KGlkKTtcbiAgfSxcbiAgZnJlZTogZnVuY3Rpb24gKGlkKSB7XG4gICAgY2hpbGRyZW4uZGVsZXRlKGlkKTtcbiAgfVxufTtcblxuZXhwb3J0IHsgcmVnaXN0cnkgfTtcbiIsImltcG9ydCB7IF9fYXNzaWduIH0gZnJvbSAnLi9fdmlydHVhbC9fdHNsaWIuanMnO1xuXG52YXIgZGVmYXVsdE9wdGlvbnMgPSB7XG4gIGRlZmVyRXZlbnRzOiBmYWxzZVxufTtcblxudmFyIFNjaGVkdWxlciA9XG4vKiNfX1BVUkVfXyovXG5cbi8qKiBAY2xhc3MgKi9cbmZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gU2NoZWR1bGVyKG9wdGlvbnMpIHtcbiAgICB0aGlzLnByb2Nlc3NpbmdFdmVudCA9IGZhbHNlO1xuICAgIHRoaXMucXVldWUgPSBbXTtcbiAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgdGhpcy5vcHRpb25zID0gX19hc3NpZ24oX19hc3NpZ24oe30sIGRlZmF1bHRPcHRpb25zKSwgb3B0aW9ucyk7XG4gIH1cblxuICBTY2hlZHVsZXIucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcblxuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuZGVmZXJFdmVudHMpIHtcbiAgICAgICAgdGhpcy5zY2hlZHVsZShjYWxsYmFjayk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wcm9jZXNzKGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICB0aGlzLmZsdXNoRXZlbnRzKCk7XG4gIH07XG5cbiAgU2NoZWR1bGVyLnByb3RvdHlwZS5zY2hlZHVsZSA9IGZ1bmN0aW9uICh0YXNrKSB7XG4gICAgaWYgKCF0aGlzLmluaXRpYWxpemVkIHx8IHRoaXMucHJvY2Vzc2luZ0V2ZW50KSB7XG4gICAgICB0aGlzLnF1ZXVlLnB1c2godGFzayk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucXVldWUubGVuZ3RoICE9PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V2ZW50IHF1ZXVlIHNob3VsZCBiZSBlbXB0eSB3aGVuIGl0IGlzIG5vdCBwcm9jZXNzaW5nIGV2ZW50cycpO1xuICAgIH1cblxuICAgIHRoaXMucHJvY2Vzcyh0YXNrKTtcbiAgICB0aGlzLmZsdXNoRXZlbnRzKCk7XG4gIH07XG5cbiAgU2NoZWR1bGVyLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnF1ZXVlID0gW107XG4gIH07XG5cbiAgU2NoZWR1bGVyLnByb3RvdHlwZS5mbHVzaEV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbmV4dENhbGxiYWNrID0gdGhpcy5xdWV1ZS5zaGlmdCgpO1xuXG4gICAgd2hpbGUgKG5leHRDYWxsYmFjaykge1xuICAgICAgdGhpcy5wcm9jZXNzKG5leHRDYWxsYmFjayk7XG4gICAgICBuZXh0Q2FsbGJhY2sgPSB0aGlzLnF1ZXVlLnNoaWZ0KCk7XG4gICAgfVxuICB9O1xuXG4gIFNjaGVkdWxlci5wcm90b3R5cGUucHJvY2VzcyA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIHRoaXMucHJvY2Vzc2luZ0V2ZW50ID0gdHJ1ZTtcblxuICAgIHRyeSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIHRoZXJlIGlzIG5vIHVzZSB0byBrZWVwIHRoZSBmdXR1cmUgZXZlbnRzXG4gICAgICAvLyBhcyB0aGUgc2l0dWF0aW9uIGlzIG5vdCBhbnltb3JlIHRoZSBzYW1lXG4gICAgICB0aGlzLmNsZWFyKCk7XG4gICAgICB0aHJvdyBlO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLnByb2Nlc3NpbmdFdmVudCA9IGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gU2NoZWR1bGVyO1xufSgpO1xuXG5leHBvcnQgeyBTY2hlZHVsZXIgfTtcbiIsImZ1bmN0aW9uIGNyZWF0ZVNjaGVtYShzY2hlbWEpIHtcbiAgcmV0dXJuIHNjaGVtYTtcbn1cbnZhciB0ID0gY3JlYXRlU2NoZW1hO1xuXG5leHBvcnQgeyBjcmVhdGVTY2hlbWEsIHQgfTtcbiIsIi8qKlxyXG4gKiBNYWludGFpbnMgYSBzdGFjayBvZiB0aGUgY3VycmVudCBzZXJ2aWNlIGluIHNjb3BlLlxyXG4gKiBUaGlzIGlzIHVzZWQgdG8gcHJvdmlkZSB0aGUgY29ycmVjdCBzZXJ2aWNlIHRvIHNwYXduKCkuXHJcbiAqL1xudmFyIHNlcnZpY2VTdGFjayA9IFtdO1xudmFyIHByb3ZpZGUgPSBmdW5jdGlvbiAoc2VydmljZSwgZm4pIHtcbiAgc2VydmljZVN0YWNrLnB1c2goc2VydmljZSk7XG4gIHZhciByZXN1bHQgPSBmbihzZXJ2aWNlKTtcbiAgc2VydmljZVN0YWNrLnBvcCgpO1xuICByZXR1cm4gcmVzdWx0O1xufTtcbnZhciBjb25zdW1lID0gZnVuY3Rpb24gKGZuKSB7XG4gIHJldHVybiBmbihzZXJ2aWNlU3RhY2tbc2VydmljZVN0YWNrLmxlbmd0aCAtIDFdKTtcbn07XG5cbmV4cG9ydCB7IGNvbnN1bWUsIHByb3ZpZGUgfTtcbiIsImltcG9ydCB7IF9fdmFsdWVzLCBfX3NwcmVhZEFycmF5LCBfX3JlYWQgfSBmcm9tICcuL192aXJ0dWFsL190c2xpYi5qcyc7XG5pbXBvcnQgeyBmbGF0dGVuIH0gZnJvbSAnLi91dGlscy5qcyc7XG5cbnZhciBpc0xlYWZOb2RlID0gZnVuY3Rpb24gKHN0YXRlTm9kZSkge1xuICByZXR1cm4gc3RhdGVOb2RlLnR5cGUgPT09ICdhdG9taWMnIHx8IHN0YXRlTm9kZS50eXBlID09PSAnZmluYWwnO1xufTtcbmZ1bmN0aW9uIGdldEFsbENoaWxkcmVuKHN0YXRlTm9kZSkge1xuICByZXR1cm4gT2JqZWN0LmtleXMoc3RhdGVOb2RlLnN0YXRlcykubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gc3RhdGVOb2RlLnN0YXRlc1trZXldO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGdldENoaWxkcmVuKHN0YXRlTm9kZSkge1xuICByZXR1cm4gZ2V0QWxsQ2hpbGRyZW4oc3RhdGVOb2RlKS5maWx0ZXIoZnVuY3Rpb24gKHNuKSB7XG4gICAgcmV0dXJuIHNuLnR5cGUgIT09ICdoaXN0b3J5JztcbiAgfSk7XG59XG5mdW5jdGlvbiBnZXRBbGxTdGF0ZU5vZGVzKHN0YXRlTm9kZSkge1xuICB2YXIgc3RhdGVOb2RlcyA9IFtzdGF0ZU5vZGVdO1xuXG4gIGlmIChpc0xlYWZOb2RlKHN0YXRlTm9kZSkpIHtcbiAgICByZXR1cm4gc3RhdGVOb2RlcztcbiAgfVxuXG4gIHJldHVybiBzdGF0ZU5vZGVzLmNvbmNhdChmbGF0dGVuKGdldENoaWxkcmVuKHN0YXRlTm9kZSkubWFwKGdldEFsbFN0YXRlTm9kZXMpKSk7XG59XG5mdW5jdGlvbiBnZXRDb25maWd1cmF0aW9uKHByZXZTdGF0ZU5vZGVzLCBzdGF0ZU5vZGVzKSB7XG4gIHZhciBlXzEsIF9hLCBlXzIsIF9iLCBlXzMsIF9jLCBlXzQsIF9kO1xuXG4gIHZhciBwcmV2Q29uZmlndXJhdGlvbiA9IG5ldyBTZXQocHJldlN0YXRlTm9kZXMpO1xuICB2YXIgcHJldkFkakxpc3QgPSBnZXRBZGpMaXN0KHByZXZDb25maWd1cmF0aW9uKTtcbiAgdmFyIGNvbmZpZ3VyYXRpb24gPSBuZXcgU2V0KHN0YXRlTm9kZXMpO1xuXG4gIHRyeSB7XG4gICAgLy8gYWRkIGFsbCBhbmNlc3RvcnNcbiAgICBmb3IgKHZhciBjb25maWd1cmF0aW9uXzEgPSBfX3ZhbHVlcyhjb25maWd1cmF0aW9uKSwgY29uZmlndXJhdGlvbl8xXzEgPSBjb25maWd1cmF0aW9uXzEubmV4dCgpOyAhY29uZmlndXJhdGlvbl8xXzEuZG9uZTsgY29uZmlndXJhdGlvbl8xXzEgPSBjb25maWd1cmF0aW9uXzEubmV4dCgpKSB7XG4gICAgICB2YXIgcyA9IGNvbmZpZ3VyYXRpb25fMV8xLnZhbHVlO1xuICAgICAgdmFyIG0gPSBzLnBhcmVudDtcblxuICAgICAgd2hpbGUgKG0gJiYgIWNvbmZpZ3VyYXRpb24uaGFzKG0pKSB7XG4gICAgICAgIGNvbmZpZ3VyYXRpb24uYWRkKG0pO1xuICAgICAgICBtID0gbS5wYXJlbnQ7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlXzFfMSkge1xuICAgIGVfMSA9IHtcbiAgICAgIGVycm9yOiBlXzFfMVxuICAgIH07XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChjb25maWd1cmF0aW9uXzFfMSAmJiAhY29uZmlndXJhdGlvbl8xXzEuZG9uZSAmJiAoX2EgPSBjb25maWd1cmF0aW9uXzEucmV0dXJuKSkgX2EuY2FsbChjb25maWd1cmF0aW9uXzEpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpZiAoZV8xKSB0aHJvdyBlXzEuZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgdmFyIGFkakxpc3QgPSBnZXRBZGpMaXN0KGNvbmZpZ3VyYXRpb24pO1xuXG4gIHRyeSB7XG4gICAgLy8gYWRkIGRlc2NlbmRhbnRzXG4gICAgZm9yICh2YXIgY29uZmlndXJhdGlvbl8yID0gX192YWx1ZXMoY29uZmlndXJhdGlvbiksIGNvbmZpZ3VyYXRpb25fMl8xID0gY29uZmlndXJhdGlvbl8yLm5leHQoKTsgIWNvbmZpZ3VyYXRpb25fMl8xLmRvbmU7IGNvbmZpZ3VyYXRpb25fMl8xID0gY29uZmlndXJhdGlvbl8yLm5leHQoKSkge1xuICAgICAgdmFyIHMgPSBjb25maWd1cmF0aW9uXzJfMS52YWx1ZTsgLy8gaWYgcHJldmlvdXNseSBhY3RpdmUsIGFkZCBleGlzdGluZyBjaGlsZCBub2Rlc1xuXG4gICAgICBpZiAocy50eXBlID09PSAnY29tcG91bmQnICYmICghYWRqTGlzdC5nZXQocykgfHwgIWFkakxpc3QuZ2V0KHMpLmxlbmd0aCkpIHtcbiAgICAgICAgaWYgKHByZXZBZGpMaXN0LmdldChzKSkge1xuICAgICAgICAgIHByZXZBZGpMaXN0LmdldChzKS5mb3JFYWNoKGZ1bmN0aW9uIChzbikge1xuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZ3VyYXRpb24uYWRkKHNuKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzLmluaXRpYWxTdGF0ZU5vZGVzLmZvckVhY2goZnVuY3Rpb24gKHNuKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uZmlndXJhdGlvbi5hZGQoc24pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocy50eXBlID09PSAncGFyYWxsZWwnKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvciAodmFyIF9lID0gKGVfMyA9IHZvaWQgMCwgX192YWx1ZXMoZ2V0Q2hpbGRyZW4ocykpKSwgX2YgPSBfZS5uZXh0KCk7ICFfZi5kb25lOyBfZiA9IF9lLm5leHQoKSkge1xuICAgICAgICAgICAgICB2YXIgY2hpbGQgPSBfZi52YWx1ZTtcblxuICAgICAgICAgICAgICBpZiAoIWNvbmZpZ3VyYXRpb24uaGFzKGNoaWxkKSkge1xuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYXRpb24uYWRkKGNoaWxkKTtcblxuICAgICAgICAgICAgICAgIGlmIChwcmV2QWRqTGlzdC5nZXQoY2hpbGQpKSB7XG4gICAgICAgICAgICAgICAgICBwcmV2QWRqTGlzdC5nZXQoY2hpbGQpLmZvckVhY2goZnVuY3Rpb24gKHNuKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb25maWd1cmF0aW9uLmFkZChzbik7XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgY2hpbGQuaW5pdGlhbFN0YXRlTm9kZXMuZm9yRWFjaChmdW5jdGlvbiAoc24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbmZpZ3VyYXRpb24uYWRkKHNuKTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gY2F0Y2ggKGVfM18xKSB7XG4gICAgICAgICAgICBlXzMgPSB7XG4gICAgICAgICAgICAgIGVycm9yOiBlXzNfMVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgaWYgKF9mICYmICFfZi5kb25lICYmIChfYyA9IF9lLnJldHVybikpIF9jLmNhbGwoX2UpO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgaWYgKGVfMykgdGhyb3cgZV8zLmVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZV8yXzEpIHtcbiAgICBlXzIgPSB7XG4gICAgICBlcnJvcjogZV8yXzFcbiAgICB9O1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoY29uZmlndXJhdGlvbl8yXzEgJiYgIWNvbmZpZ3VyYXRpb25fMl8xLmRvbmUgJiYgKF9iID0gY29uZmlndXJhdGlvbl8yLnJldHVybikpIF9iLmNhbGwoY29uZmlndXJhdGlvbl8yKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKGVfMikgdGhyb3cgZV8yLmVycm9yO1xuICAgIH1cbiAgfVxuXG4gIHRyeSB7XG4gICAgLy8gYWRkIGFsbCBhbmNlc3RvcnNcbiAgICBmb3IgKHZhciBjb25maWd1cmF0aW9uXzMgPSBfX3ZhbHVlcyhjb25maWd1cmF0aW9uKSwgY29uZmlndXJhdGlvbl8zXzEgPSBjb25maWd1cmF0aW9uXzMubmV4dCgpOyAhY29uZmlndXJhdGlvbl8zXzEuZG9uZTsgY29uZmlndXJhdGlvbl8zXzEgPSBjb25maWd1cmF0aW9uXzMubmV4dCgpKSB7XG4gICAgICB2YXIgcyA9IGNvbmZpZ3VyYXRpb25fM18xLnZhbHVlO1xuICAgICAgdmFyIG0gPSBzLnBhcmVudDtcblxuICAgICAgd2hpbGUgKG0gJiYgIWNvbmZpZ3VyYXRpb24uaGFzKG0pKSB7XG4gICAgICAgIGNvbmZpZ3VyYXRpb24uYWRkKG0pO1xuICAgICAgICBtID0gbS5wYXJlbnQ7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlXzRfMSkge1xuICAgIGVfNCA9IHtcbiAgICAgIGVycm9yOiBlXzRfMVxuICAgIH07XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChjb25maWd1cmF0aW9uXzNfMSAmJiAhY29uZmlndXJhdGlvbl8zXzEuZG9uZSAmJiAoX2QgPSBjb25maWd1cmF0aW9uXzMucmV0dXJuKSkgX2QuY2FsbChjb25maWd1cmF0aW9uXzMpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpZiAoZV80KSB0aHJvdyBlXzQuZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNvbmZpZ3VyYXRpb247XG59XG5cbmZ1bmN0aW9uIGdldFZhbHVlRnJvbUFkaihiYXNlTm9kZSwgYWRqTGlzdCkge1xuICB2YXIgY2hpbGRTdGF0ZU5vZGVzID0gYWRqTGlzdC5nZXQoYmFzZU5vZGUpO1xuXG4gIGlmICghY2hpbGRTdGF0ZU5vZGVzKSB7XG4gICAgcmV0dXJuIHt9OyAvLyB0b2RvOiBmaXg/XG4gIH1cblxuICBpZiAoYmFzZU5vZGUudHlwZSA9PT0gJ2NvbXBvdW5kJykge1xuICAgIHZhciBjaGlsZFN0YXRlTm9kZSA9IGNoaWxkU3RhdGVOb2Rlc1swXTtcblxuICAgIGlmIChjaGlsZFN0YXRlTm9kZSkge1xuICAgICAgaWYgKGlzTGVhZk5vZGUoY2hpbGRTdGF0ZU5vZGUpKSB7XG4gICAgICAgIHJldHVybiBjaGlsZFN0YXRlTm9kZS5rZXk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH1cblxuICB2YXIgc3RhdGVWYWx1ZSA9IHt9O1xuICBjaGlsZFN0YXRlTm9kZXMuZm9yRWFjaChmdW5jdGlvbiAoY3NuKSB7XG4gICAgc3RhdGVWYWx1ZVtjc24ua2V5XSA9IGdldFZhbHVlRnJvbUFkaihjc24sIGFkakxpc3QpO1xuICB9KTtcbiAgcmV0dXJuIHN0YXRlVmFsdWU7XG59XG5cbmZ1bmN0aW9uIGdldEFkakxpc3QoY29uZmlndXJhdGlvbikge1xuICB2YXIgZV81LCBfYTtcblxuICB2YXIgYWRqTGlzdCA9IG5ldyBNYXAoKTtcblxuICB0cnkge1xuICAgIGZvciAodmFyIGNvbmZpZ3VyYXRpb25fNCA9IF9fdmFsdWVzKGNvbmZpZ3VyYXRpb24pLCBjb25maWd1cmF0aW9uXzRfMSA9IGNvbmZpZ3VyYXRpb25fNC5uZXh0KCk7ICFjb25maWd1cmF0aW9uXzRfMS5kb25lOyBjb25maWd1cmF0aW9uXzRfMSA9IGNvbmZpZ3VyYXRpb25fNC5uZXh0KCkpIHtcbiAgICAgIHZhciBzID0gY29uZmlndXJhdGlvbl80XzEudmFsdWU7XG5cbiAgICAgIGlmICghYWRqTGlzdC5oYXMocykpIHtcbiAgICAgICAgYWRqTGlzdC5zZXQocywgW10pO1xuICAgICAgfVxuXG4gICAgICBpZiAocy5wYXJlbnQpIHtcbiAgICAgICAgaWYgKCFhZGpMaXN0LmhhcyhzLnBhcmVudCkpIHtcbiAgICAgICAgICBhZGpMaXN0LnNldChzLnBhcmVudCwgW10pO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRqTGlzdC5nZXQocy5wYXJlbnQpLnB1c2gocyk7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlXzVfMSkge1xuICAgIGVfNSA9IHtcbiAgICAgIGVycm9yOiBlXzVfMVxuICAgIH07XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChjb25maWd1cmF0aW9uXzRfMSAmJiAhY29uZmlndXJhdGlvbl80XzEuZG9uZSAmJiAoX2EgPSBjb25maWd1cmF0aW9uXzQucmV0dXJuKSkgX2EuY2FsbChjb25maWd1cmF0aW9uXzQpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpZiAoZV81KSB0aHJvdyBlXzUuZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGFkakxpc3Q7XG59XG5mdW5jdGlvbiBnZXRWYWx1ZShyb290Tm9kZSwgY29uZmlndXJhdGlvbikge1xuICB2YXIgY29uZmlnID0gZ2V0Q29uZmlndXJhdGlvbihbcm9vdE5vZGVdLCBjb25maWd1cmF0aW9uKTtcbiAgcmV0dXJuIGdldFZhbHVlRnJvbUFkaihyb290Tm9kZSwgZ2V0QWRqTGlzdChjb25maWcpKTtcbn1cbmZ1bmN0aW9uIGhhcyhpdGVyYWJsZSwgaXRlbSkge1xuICBpZiAoQXJyYXkuaXNBcnJheShpdGVyYWJsZSkpIHtcbiAgICByZXR1cm4gaXRlcmFibGUuc29tZShmdW5jdGlvbiAobWVtYmVyKSB7XG4gICAgICByZXR1cm4gbWVtYmVyID09PSBpdGVtO1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKGl0ZXJhYmxlIGluc3RhbmNlb2YgU2V0KSB7XG4gICAgcmV0dXJuIGl0ZXJhYmxlLmhhcyhpdGVtKTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTsgLy8gVE9ETzogZml4XG59XG5mdW5jdGlvbiBuZXh0RXZlbnRzKGNvbmZpZ3VyYXRpb24pIHtcbiAgcmV0dXJuIF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChuZXcgU2V0KGZsYXR0ZW4oX19zcHJlYWRBcnJheShbXSwgX19yZWFkKGNvbmZpZ3VyYXRpb24ubWFwKGZ1bmN0aW9uIChzbikge1xuICAgIHJldHVybiBzbi5vd25FdmVudHM7XG4gIH0pKSwgZmFsc2UpKSkpLCBmYWxzZSk7XG59XG5mdW5jdGlvbiBpc0luRmluYWxTdGF0ZShjb25maWd1cmF0aW9uLCBzdGF0ZU5vZGUpIHtcbiAgaWYgKHN0YXRlTm9kZS50eXBlID09PSAnY29tcG91bmQnKSB7XG4gICAgcmV0dXJuIGdldENoaWxkcmVuKHN0YXRlTm9kZSkuc29tZShmdW5jdGlvbiAocykge1xuICAgICAgcmV0dXJuIHMudHlwZSA9PT0gJ2ZpbmFsJyAmJiBoYXMoY29uZmlndXJhdGlvbiwgcyk7XG4gICAgfSk7XG4gIH1cblxuICBpZiAoc3RhdGVOb2RlLnR5cGUgPT09ICdwYXJhbGxlbCcpIHtcbiAgICByZXR1cm4gZ2V0Q2hpbGRyZW4oc3RhdGVOb2RlKS5ldmVyeShmdW5jdGlvbiAoc24pIHtcbiAgICAgIHJldHVybiBpc0luRmluYWxTdGF0ZShjb25maWd1cmF0aW9uLCBzbik7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5mdW5jdGlvbiBnZXRNZXRhKGNvbmZpZ3VyYXRpb24pIHtcbiAgaWYgKGNvbmZpZ3VyYXRpb24gPT09IHZvaWQgMCkge1xuICAgIGNvbmZpZ3VyYXRpb24gPSBbXTtcbiAgfVxuXG4gIHJldHVybiBjb25maWd1cmF0aW9uLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBzdGF0ZU5vZGUpIHtcbiAgICBpZiAoc3RhdGVOb2RlLm1ldGEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgYWNjW3N0YXRlTm9kZS5pZF0gPSBzdGF0ZU5vZGUubWV0YTtcbiAgICB9XG5cbiAgICByZXR1cm4gYWNjO1xuICB9LCB7fSk7XG59XG5mdW5jdGlvbiBnZXRUYWdzRnJvbUNvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvbikge1xuICByZXR1cm4gbmV3IFNldChmbGF0dGVuKGNvbmZpZ3VyYXRpb24ubWFwKGZ1bmN0aW9uIChzbikge1xuICAgIHJldHVybiBzbi50YWdzO1xuICB9KSkpO1xufVxuXG5leHBvcnQgeyBnZXRBZGpMaXN0LCBnZXRBbGxDaGlsZHJlbiwgZ2V0QWxsU3RhdGVOb2RlcywgZ2V0Q2hpbGRyZW4sIGdldENvbmZpZ3VyYXRpb24sIGdldE1ldGEsIGdldFRhZ3NGcm9tQ29uZmlndXJhdGlvbiwgZ2V0VmFsdWUsIGhhcywgaXNJbkZpbmFsU3RhdGUsIGlzTGVhZk5vZGUsIG5leHRFdmVudHMgfTtcbiIsInZhciBBY3Rpb25UeXBlcztcblxuKGZ1bmN0aW9uIChBY3Rpb25UeXBlcykge1xuICBBY3Rpb25UeXBlc1tcIlN0YXJ0XCJdID0gXCJ4c3RhdGUuc3RhcnRcIjtcbiAgQWN0aW9uVHlwZXNbXCJTdG9wXCJdID0gXCJ4c3RhdGUuc3RvcFwiO1xuICBBY3Rpb25UeXBlc1tcIlJhaXNlXCJdID0gXCJ4c3RhdGUucmFpc2VcIjtcbiAgQWN0aW9uVHlwZXNbXCJTZW5kXCJdID0gXCJ4c3RhdGUuc2VuZFwiO1xuICBBY3Rpb25UeXBlc1tcIkNhbmNlbFwiXSA9IFwieHN0YXRlLmNhbmNlbFwiO1xuICBBY3Rpb25UeXBlc1tcIk51bGxFdmVudFwiXSA9IFwiXCI7XG4gIEFjdGlvblR5cGVzW1wiQXNzaWduXCJdID0gXCJ4c3RhdGUuYXNzaWduXCI7XG4gIEFjdGlvblR5cGVzW1wiQWZ0ZXJcIl0gPSBcInhzdGF0ZS5hZnRlclwiO1xuICBBY3Rpb25UeXBlc1tcIkRvbmVTdGF0ZVwiXSA9IFwiZG9uZS5zdGF0ZVwiO1xuICBBY3Rpb25UeXBlc1tcIkRvbmVJbnZva2VcIl0gPSBcImRvbmUuaW52b2tlXCI7XG4gIEFjdGlvblR5cGVzW1wiTG9nXCJdID0gXCJ4c3RhdGUubG9nXCI7XG4gIEFjdGlvblR5cGVzW1wiSW5pdFwiXSA9IFwieHN0YXRlLmluaXRcIjtcbiAgQWN0aW9uVHlwZXNbXCJJbnZva2VcIl0gPSBcInhzdGF0ZS5pbnZva2VcIjtcbiAgQWN0aW9uVHlwZXNbXCJFcnJvckV4ZWN1dGlvblwiXSA9IFwiZXJyb3IuZXhlY3V0aW9uXCI7XG4gIEFjdGlvblR5cGVzW1wiRXJyb3JDb21tdW5pY2F0aW9uXCJdID0gXCJlcnJvci5jb21tdW5pY2F0aW9uXCI7XG4gIEFjdGlvblR5cGVzW1wiRXJyb3JQbGF0Zm9ybVwiXSA9IFwiZXJyb3IucGxhdGZvcm1cIjtcbiAgQWN0aW9uVHlwZXNbXCJFcnJvckN1c3RvbVwiXSA9IFwieHN0YXRlLmVycm9yXCI7XG4gIEFjdGlvblR5cGVzW1wiVXBkYXRlXCJdID0gXCJ4c3RhdGUudXBkYXRlXCI7XG4gIEFjdGlvblR5cGVzW1wiUHVyZVwiXSA9IFwieHN0YXRlLnB1cmVcIjtcbiAgQWN0aW9uVHlwZXNbXCJDaG9vc2VcIl0gPSBcInhzdGF0ZS5jaG9vc2VcIjtcbn0pKEFjdGlvblR5cGVzIHx8IChBY3Rpb25UeXBlcyA9IHt9KSk7XG5cbnZhciBTcGVjaWFsVGFyZ2V0cztcblxuKGZ1bmN0aW9uIChTcGVjaWFsVGFyZ2V0cykge1xuICBTcGVjaWFsVGFyZ2V0c1tcIlBhcmVudFwiXSA9IFwiI19wYXJlbnRcIjtcbiAgU3BlY2lhbFRhcmdldHNbXCJJbnRlcm5hbFwiXSA9IFwiI19pbnRlcm5hbFwiO1xufSkoU3BlY2lhbFRhcmdldHMgfHwgKFNwZWNpYWxUYXJnZXRzID0ge30pKTtcblxuZXhwb3J0IHsgQWN0aW9uVHlwZXMsIFNwZWNpYWxUYXJnZXRzIH07XG4iLCJpbXBvcnQgeyBfX3ZhbHVlcywgX19zcHJlYWRBcnJheSwgX19yZWFkLCBfX2Fzc2lnbiB9IGZyb20gJy4vX3ZpcnR1YWwvX3RzbGliLmpzJztcbmltcG9ydCB7IFNwZWNpYWxUYXJnZXRzIH0gZnJvbSAnLi90eXBlcy5qcyc7XG5pbXBvcnQgeyByYWlzZSwgc2VuZCB9IGZyb20gJy4vYWN0aW9uVHlwZXMuanMnO1xuaW1wb3J0IHsgREVGQVVMVF9HVUFSRF9UWVBFLCBUQVJHRVRMRVNTX0tFWSwgU1RBVEVfREVMSU1JVEVSIH0gZnJvbSAnLi9jb25zdGFudHMuanMnO1xuaW1wb3J0IHsgSVNfUFJPRFVDVElPTiB9IGZyb20gJy4vZW52aXJvbm1lbnQuanMnO1xuXG52YXIgX2E7XG5mdW5jdGlvbiBrZXlzKHZhbHVlKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyh2YWx1ZSk7XG59XG5mdW5jdGlvbiBtYXRjaGVzU3RhdGUocGFyZW50U3RhdGVJZCwgY2hpbGRTdGF0ZUlkLCBkZWxpbWl0ZXIpIHtcbiAgaWYgKGRlbGltaXRlciA9PT0gdm9pZCAwKSB7XG4gICAgZGVsaW1pdGVyID0gU1RBVEVfREVMSU1JVEVSO1xuICB9XG5cbiAgdmFyIHBhcmVudFN0YXRlVmFsdWUgPSB0b1N0YXRlVmFsdWUocGFyZW50U3RhdGVJZCwgZGVsaW1pdGVyKTtcbiAgdmFyIGNoaWxkU3RhdGVWYWx1ZSA9IHRvU3RhdGVWYWx1ZShjaGlsZFN0YXRlSWQsIGRlbGltaXRlcik7XG5cbiAgaWYgKGlzU3RyaW5nKGNoaWxkU3RhdGVWYWx1ZSkpIHtcbiAgICBpZiAoaXNTdHJpbmcocGFyZW50U3RhdGVWYWx1ZSkpIHtcbiAgICAgIHJldHVybiBjaGlsZFN0YXRlVmFsdWUgPT09IHBhcmVudFN0YXRlVmFsdWU7XG4gICAgfSAvLyBQYXJlbnQgbW9yZSBzcGVjaWZpYyB0aGFuIGNoaWxkXG5cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChpc1N0cmluZyhwYXJlbnRTdGF0ZVZhbHVlKSkge1xuICAgIHJldHVybiBwYXJlbnRTdGF0ZVZhbHVlIGluIGNoaWxkU3RhdGVWYWx1ZTtcbiAgfVxuXG4gIHJldHVybiBPYmplY3Qua2V5cyhwYXJlbnRTdGF0ZVZhbHVlKS5ldmVyeShmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKCEoa2V5IGluIGNoaWxkU3RhdGVWYWx1ZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWF0Y2hlc1N0YXRlKHBhcmVudFN0YXRlVmFsdWVba2V5XSwgY2hpbGRTdGF0ZVZhbHVlW2tleV0pO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGdldEV2ZW50VHlwZShldmVudCkge1xuICB0cnkge1xuICAgIHJldHVybiBpc1N0cmluZyhldmVudCkgfHwgdHlwZW9mIGV2ZW50ID09PSAnbnVtYmVyJyA/IFwiXCIuY29uY2F0KGV2ZW50KSA6IGV2ZW50LnR5cGU7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0V2ZW50cyBtdXN0IGJlIHN0cmluZ3Mgb3Igb2JqZWN0cyB3aXRoIGEgc3RyaW5nIGV2ZW50LnR5cGUgcHJvcGVydHkuJyk7XG4gIH1cbn1cbmZ1bmN0aW9uIGdldEFjdGlvblR5cGUoYWN0aW9uKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGlzU3RyaW5nKGFjdGlvbikgfHwgdHlwZW9mIGFjdGlvbiA9PT0gJ251bWJlcicgPyBcIlwiLmNvbmNhdChhY3Rpb24pIDogaXNGdW5jdGlvbihhY3Rpb24pID8gYWN0aW9uLm5hbWUgOiBhY3Rpb24udHlwZTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignQWN0aW9ucyBtdXN0IGJlIHN0cmluZ3Mgb3Igb2JqZWN0cyB3aXRoIGEgc3RyaW5nIGFjdGlvbi50eXBlIHByb3BlcnR5LicpO1xuICB9XG59XG5mdW5jdGlvbiB0b1N0YXRlUGF0aChzdGF0ZUlkLCBkZWxpbWl0ZXIpIHtcbiAgdHJ5IHtcbiAgICBpZiAoaXNBcnJheShzdGF0ZUlkKSkge1xuICAgICAgcmV0dXJuIHN0YXRlSWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXRlSWQudG9TdHJpbmcoKS5zcGxpdChkZWxpbWl0ZXIpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiJ1wiLmNvbmNhdChzdGF0ZUlkLCBcIicgaXMgbm90IGEgdmFsaWQgc3RhdGUgcGF0aC5cIikpO1xuICB9XG59XG5mdW5jdGlvbiBpc1N0YXRlTGlrZShzdGF0ZSkge1xuICByZXR1cm4gdHlwZW9mIHN0YXRlID09PSAnb2JqZWN0JyAmJiAndmFsdWUnIGluIHN0YXRlICYmICdjb250ZXh0JyBpbiBzdGF0ZSAmJiAnZXZlbnQnIGluIHN0YXRlICYmICdfZXZlbnQnIGluIHN0YXRlO1xufVxuZnVuY3Rpb24gdG9TdGF0ZVZhbHVlKHN0YXRlVmFsdWUsIGRlbGltaXRlcikge1xuICBpZiAoaXNTdGF0ZUxpa2Uoc3RhdGVWYWx1ZSkpIHtcbiAgICByZXR1cm4gc3RhdGVWYWx1ZS52YWx1ZTtcbiAgfVxuXG4gIGlmIChpc0FycmF5KHN0YXRlVmFsdWUpKSB7XG4gICAgcmV0dXJuIHBhdGhUb1N0YXRlVmFsdWUoc3RhdGVWYWx1ZSk7XG4gIH1cblxuICBpZiAodHlwZW9mIHN0YXRlVmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHN0YXRlVmFsdWU7XG4gIH1cblxuICB2YXIgc3RhdGVQYXRoID0gdG9TdGF0ZVBhdGgoc3RhdGVWYWx1ZSwgZGVsaW1pdGVyKTtcbiAgcmV0dXJuIHBhdGhUb1N0YXRlVmFsdWUoc3RhdGVQYXRoKTtcbn1cbmZ1bmN0aW9uIHBhdGhUb1N0YXRlVmFsdWUoc3RhdGVQYXRoKSB7XG4gIGlmIChzdGF0ZVBhdGgubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIHN0YXRlUGF0aFswXTtcbiAgfVxuXG4gIHZhciB2YWx1ZSA9IHt9O1xuICB2YXIgbWFya2VyID0gdmFsdWU7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGF0ZVBhdGgubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgaWYgKGkgPT09IHN0YXRlUGF0aC5sZW5ndGggLSAyKSB7XG4gICAgICBtYXJrZXJbc3RhdGVQYXRoW2ldXSA9IHN0YXRlUGF0aFtpICsgMV07XG4gICAgfSBlbHNlIHtcbiAgICAgIG1hcmtlcltzdGF0ZVBhdGhbaV1dID0ge307XG4gICAgICBtYXJrZXIgPSBtYXJrZXJbc3RhdGVQYXRoW2ldXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdmFsdWU7XG59XG5mdW5jdGlvbiBtYXBWYWx1ZXMoY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuICB2YXIgY29sbGVjdGlvbktleXMgPSBPYmplY3Qua2V5cyhjb2xsZWN0aW9uKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbGxlY3Rpb25LZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGtleSA9IGNvbGxlY3Rpb25LZXlzW2ldO1xuICAgIHJlc3VsdFtrZXldID0gaXRlcmF0ZWUoY29sbGVjdGlvbltrZXldLCBrZXksIGNvbGxlY3Rpb24sIGkpO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1hcEZpbHRlclZhbHVlcyhjb2xsZWN0aW9uLCBpdGVyYXRlZSwgcHJlZGljYXRlKSB7XG4gIHZhciBlXzEsIF9hO1xuXG4gIHZhciByZXN1bHQgPSB7fTtcblxuICB0cnkge1xuICAgIGZvciAodmFyIF9iID0gX192YWx1ZXMoT2JqZWN0LmtleXMoY29sbGVjdGlvbikpLCBfYyA9IF9iLm5leHQoKTsgIV9jLmRvbmU7IF9jID0gX2IubmV4dCgpKSB7XG4gICAgICB2YXIga2V5ID0gX2MudmFsdWU7XG4gICAgICB2YXIgaXRlbSA9IGNvbGxlY3Rpb25ba2V5XTtcblxuICAgICAgaWYgKCFwcmVkaWNhdGUoaXRlbSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHJlc3VsdFtrZXldID0gaXRlcmF0ZWUoaXRlbSwga2V5LCBjb2xsZWN0aW9uKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVfMV8xKSB7XG4gICAgZV8xID0ge1xuICAgICAgZXJyb3I6IGVfMV8xXG4gICAgfTtcbiAgfSBmaW5hbGx5IHtcbiAgICB0cnkge1xuICAgICAgaWYgKF9jICYmICFfYy5kb25lICYmIChfYSA9IF9iLnJldHVybikpIF9hLmNhbGwoX2IpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpZiAoZV8xKSB0aHJvdyBlXzEuZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKlxyXG4gKiBSZXRyaWV2ZXMgYSB2YWx1ZSBhdCB0aGUgZ2l2ZW4gcGF0aC5cclxuICogQHBhcmFtIHByb3BzIFRoZSBkZWVwIHBhdGggdG8gdGhlIHByb3Agb2YgdGhlIGRlc2lyZWQgdmFsdWVcclxuICovXG5cbnZhciBwYXRoID0gZnVuY3Rpb24gKHByb3BzKSB7XG4gIHJldHVybiBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgdmFyIGVfMiwgX2E7XG5cbiAgICB2YXIgcmVzdWx0ID0gb2JqZWN0O1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIHByb3BzXzEgPSBfX3ZhbHVlcyhwcm9wcyksIHByb3BzXzFfMSA9IHByb3BzXzEubmV4dCgpOyAhcHJvcHNfMV8xLmRvbmU7IHByb3BzXzFfMSA9IHByb3BzXzEubmV4dCgpKSB7XG4gICAgICAgIHZhciBwcm9wID0gcHJvcHNfMV8xLnZhbHVlO1xuICAgICAgICByZXN1bHQgPSByZXN1bHRbcHJvcF07XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV8yXzEpIHtcbiAgICAgIGVfMiA9IHtcbiAgICAgICAgZXJyb3I6IGVfMl8xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAocHJvcHNfMV8xICYmICFwcm9wc18xXzEuZG9uZSAmJiAoX2EgPSBwcm9wc18xLnJldHVybikpIF9hLmNhbGwocHJvcHNfMSk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV8yKSB0aHJvdyBlXzIuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn07XG4vKipcclxuICogUmV0cmlldmVzIGEgdmFsdWUgYXQgdGhlIGdpdmVuIHBhdGggdmlhIHRoZSBuZXN0ZWQgYWNjZXNzb3IgcHJvcC5cclxuICogQHBhcmFtIHByb3BzIFRoZSBkZWVwIHBhdGggdG8gdGhlIHByb3Agb2YgdGhlIGRlc2lyZWQgdmFsdWVcclxuICovXG5cbmZ1bmN0aW9uIG5lc3RlZFBhdGgocHJvcHMsIGFjY2Vzc29yUHJvcCkge1xuICByZXR1cm4gZnVuY3Rpb24gKG9iamVjdCkge1xuICAgIHZhciBlXzMsIF9hO1xuXG4gICAgdmFyIHJlc3VsdCA9IG9iamVjdDtcblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBwcm9wc18yID0gX192YWx1ZXMocHJvcHMpLCBwcm9wc18yXzEgPSBwcm9wc18yLm5leHQoKTsgIXByb3BzXzJfMS5kb25lOyBwcm9wc18yXzEgPSBwcm9wc18yLm5leHQoKSkge1xuICAgICAgICB2YXIgcHJvcCA9IHByb3BzXzJfMS52YWx1ZTtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0W2FjY2Vzc29yUHJvcF1bcHJvcF07XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV8zXzEpIHtcbiAgICAgIGVfMyA9IHtcbiAgICAgICAgZXJyb3I6IGVfM18xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAocHJvcHNfMl8xICYmICFwcm9wc18yXzEuZG9uZSAmJiAoX2EgPSBwcm9wc18yLnJldHVybikpIF9hLmNhbGwocHJvcHNfMik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV8zKSB0aHJvdyBlXzMuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cbmZ1bmN0aW9uIHRvU3RhdGVQYXRocyhzdGF0ZVZhbHVlKSB7XG4gIGlmICghc3RhdGVWYWx1ZSkge1xuICAgIHJldHVybiBbW11dO1xuICB9XG5cbiAgaWYgKGlzU3RyaW5nKHN0YXRlVmFsdWUpKSB7XG4gICAgcmV0dXJuIFtbc3RhdGVWYWx1ZV1dO1xuICB9XG5cbiAgdmFyIHJlc3VsdCA9IGZsYXR0ZW4oT2JqZWN0LmtleXMoc3RhdGVWYWx1ZSkubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgc3ViU3RhdGVWYWx1ZSA9IHN0YXRlVmFsdWVba2V5XTtcblxuICAgIGlmICh0eXBlb2Ygc3ViU3RhdGVWYWx1ZSAhPT0gJ3N0cmluZycgJiYgKCFzdWJTdGF0ZVZhbHVlIHx8ICFPYmplY3Qua2V5cyhzdWJTdGF0ZVZhbHVlKS5sZW5ndGgpKSB7XG4gICAgICByZXR1cm4gW1trZXldXTtcbiAgICB9XG5cbiAgICByZXR1cm4gdG9TdGF0ZVBhdGhzKHN0YXRlVmFsdWVba2V5XSkubWFwKGZ1bmN0aW9uIChzdWJQYXRoKSB7XG4gICAgICByZXR1cm4gW2tleV0uY29uY2F0KHN1YlBhdGgpO1xuICAgIH0pO1xuICB9KSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBwYXRoc1RvU3RhdGVWYWx1ZShwYXRocykge1xuICB2YXIgZV80LCBfYTtcblxuICB2YXIgcmVzdWx0ID0ge307XG5cbiAgaWYgKHBhdGhzICYmIHBhdGhzLmxlbmd0aCA9PT0gMSAmJiBwYXRoc1swXS5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gcGF0aHNbMF1bMF07XG4gIH1cblxuICB0cnkge1xuICAgIGZvciAodmFyIHBhdGhzXzEgPSBfX3ZhbHVlcyhwYXRocyksIHBhdGhzXzFfMSA9IHBhdGhzXzEubmV4dCgpOyAhcGF0aHNfMV8xLmRvbmU7IHBhdGhzXzFfMSA9IHBhdGhzXzEubmV4dCgpKSB7XG4gICAgICB2YXIgY3VycmVudFBhdGggPSBwYXRoc18xXzEudmFsdWU7XG4gICAgICB2YXIgbWFya2VyID0gcmVzdWx0OyAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cHJlZmVyLWZvci1vZlxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbnRQYXRoLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBzdWJQYXRoID0gY3VycmVudFBhdGhbaV07XG5cbiAgICAgICAgaWYgKGkgPT09IGN1cnJlbnRQYXRoLmxlbmd0aCAtIDIpIHtcbiAgICAgICAgICBtYXJrZXJbc3ViUGF0aF0gPSBjdXJyZW50UGF0aFtpICsgMV07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBtYXJrZXJbc3ViUGF0aF0gPSBtYXJrZXJbc3ViUGF0aF0gfHwge307XG4gICAgICAgIG1hcmtlciA9IG1hcmtlcltzdWJQYXRoXTtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVfNF8xKSB7XG4gICAgZV80ID0ge1xuICAgICAgZXJyb3I6IGVfNF8xXG4gICAgfTtcbiAgfSBmaW5hbGx5IHtcbiAgICB0cnkge1xuICAgICAgaWYgKHBhdGhzXzFfMSAmJiAhcGF0aHNfMV8xLmRvbmUgJiYgKF9hID0gcGF0aHNfMS5yZXR1cm4pKSBfYS5jYWxsKHBhdGhzXzEpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpZiAoZV80KSB0aHJvdyBlXzQuZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGZsYXR0ZW4oYXJyYXkpIHtcbiAgdmFyIF9hO1xuXG4gIHJldHVybiAoX2EgPSBbXSkuY29uY2F0LmFwcGx5KF9hLCBfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQoYXJyYXkpLCBmYWxzZSkpO1xufVxuZnVuY3Rpb24gdG9BcnJheVN0cmljdCh2YWx1ZSkge1xuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gW3ZhbHVlXTtcbn1cbmZ1bmN0aW9uIHRvQXJyYXkodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICByZXR1cm4gdG9BcnJheVN0cmljdCh2YWx1ZSk7XG59XG5mdW5jdGlvbiBtYXBDb250ZXh0KG1hcHBlciwgY29udGV4dCwgX2V2ZW50KSB7XG4gIHZhciBlXzUsIF9hO1xuXG4gIGlmIChpc0Z1bmN0aW9uKG1hcHBlcikpIHtcbiAgICByZXR1cm4gbWFwcGVyKGNvbnRleHQsIF9ldmVudC5kYXRhKTtcbiAgfVxuXG4gIHZhciByZXN1bHQgPSB7fTtcblxuICB0cnkge1xuICAgIGZvciAodmFyIF9iID0gX192YWx1ZXMoT2JqZWN0LmtleXMobWFwcGVyKSksIF9jID0gX2IubmV4dCgpOyAhX2MuZG9uZTsgX2MgPSBfYi5uZXh0KCkpIHtcbiAgICAgIHZhciBrZXkgPSBfYy52YWx1ZTtcbiAgICAgIHZhciBzdWJNYXBwZXIgPSBtYXBwZXJba2V5XTtcblxuICAgICAgaWYgKGlzRnVuY3Rpb24oc3ViTWFwcGVyKSkge1xuICAgICAgICByZXN1bHRba2V5XSA9IHN1Yk1hcHBlcihjb250ZXh0LCBfZXZlbnQuZGF0YSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRba2V5XSA9IHN1Yk1hcHBlcjtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVfNV8xKSB7XG4gICAgZV81ID0ge1xuICAgICAgZXJyb3I6IGVfNV8xXG4gICAgfTtcbiAgfSBmaW5hbGx5IHtcbiAgICB0cnkge1xuICAgICAgaWYgKF9jICYmICFfYy5kb25lICYmIChfYSA9IF9iLnJldHVybikpIF9hLmNhbGwoX2IpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpZiAoZV81KSB0aHJvdyBlXzUuZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGlzQnVpbHRJbkV2ZW50KGV2ZW50VHlwZSkge1xuICByZXR1cm4gL14oZG9uZXxlcnJvcilcXC4vLnRlc3QoZXZlbnRUeXBlKTtcbn1cbmZ1bmN0aW9uIGlzUHJvbWlzZUxpa2UodmFsdWUpIHtcbiAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IC8vIENoZWNrIGlmIHNoYXBlIG1hdGNoZXMgdGhlIFByb21pc2UvQSsgc3BlY2lmaWNhdGlvbiBmb3IgYSBcInRoZW5hYmxlXCIuXG5cblxuICBpZiAodmFsdWUgIT09IG51bGwgJiYgKGlzRnVuY3Rpb24odmFsdWUpIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpICYmIGlzRnVuY3Rpb24odmFsdWUudGhlbikpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cbmZ1bmN0aW9uIGlzQmVoYXZpb3IodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9PSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgJ3RyYW5zaXRpb24nIGluIHZhbHVlICYmIHR5cGVvZiB2YWx1ZS50cmFuc2l0aW9uID09PSAnZnVuY3Rpb24nO1xufVxuZnVuY3Rpb24gcGFydGl0aW9uKGl0ZW1zLCBwcmVkaWNhdGUpIHtcbiAgdmFyIGVfNiwgX2E7XG5cbiAgdmFyIF9iID0gX19yZWFkKFtbXSwgW11dLCAyKSxcbiAgICAgIHRydXRoeSA9IF9iWzBdLFxuICAgICAgZmFsc3kgPSBfYlsxXTtcblxuICB0cnkge1xuICAgIGZvciAodmFyIGl0ZW1zXzEgPSBfX3ZhbHVlcyhpdGVtcyksIGl0ZW1zXzFfMSA9IGl0ZW1zXzEubmV4dCgpOyAhaXRlbXNfMV8xLmRvbmU7IGl0ZW1zXzFfMSA9IGl0ZW1zXzEubmV4dCgpKSB7XG4gICAgICB2YXIgaXRlbSA9IGl0ZW1zXzFfMS52YWx1ZTtcblxuICAgICAgaWYgKHByZWRpY2F0ZShpdGVtKSkge1xuICAgICAgICB0cnV0aHkucHVzaChpdGVtKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZhbHN5LnB1c2goaXRlbSk7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlXzZfMSkge1xuICAgIGVfNiA9IHtcbiAgICAgIGVycm9yOiBlXzZfMVxuICAgIH07XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChpdGVtc18xXzEgJiYgIWl0ZW1zXzFfMS5kb25lICYmIChfYSA9IGl0ZW1zXzEucmV0dXJuKSkgX2EuY2FsbChpdGVtc18xKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKGVfNikgdGhyb3cgZV82LmVycm9yO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBbdHJ1dGh5LCBmYWxzeV07XG59XG5mdW5jdGlvbiB1cGRhdGVIaXN0b3J5U3RhdGVzKGhpc3QsIHN0YXRlVmFsdWUpIHtcbiAgcmV0dXJuIG1hcFZhbHVlcyhoaXN0LnN0YXRlcywgZnVuY3Rpb24gKHN1Ykhpc3QsIGtleSkge1xuICAgIGlmICghc3ViSGlzdCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICB2YXIgc3ViU3RhdGVWYWx1ZSA9IChpc1N0cmluZyhzdGF0ZVZhbHVlKSA/IHVuZGVmaW5lZCA6IHN0YXRlVmFsdWVba2V5XSkgfHwgKHN1Ykhpc3QgPyBzdWJIaXN0LmN1cnJlbnQgOiB1bmRlZmluZWQpO1xuXG4gICAgaWYgKCFzdWJTdGF0ZVZhbHVlKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBjdXJyZW50OiBzdWJTdGF0ZVZhbHVlLFxuICAgICAgc3RhdGVzOiB1cGRhdGVIaXN0b3J5U3RhdGVzKHN1Ykhpc3QsIHN1YlN0YXRlVmFsdWUpXG4gICAgfTtcbiAgfSk7XG59XG5mdW5jdGlvbiB1cGRhdGVIaXN0b3J5VmFsdWUoaGlzdCwgc3RhdGVWYWx1ZSkge1xuICByZXR1cm4ge1xuICAgIGN1cnJlbnQ6IHN0YXRlVmFsdWUsXG4gICAgc3RhdGVzOiB1cGRhdGVIaXN0b3J5U3RhdGVzKGhpc3QsIHN0YXRlVmFsdWUpXG4gIH07XG59XG5mdW5jdGlvbiB1cGRhdGVDb250ZXh0KGNvbnRleHQsIF9ldmVudCwgYXNzaWduQWN0aW9ucywgc3RhdGUpIHtcbiAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgd2FybighIWNvbnRleHQsICdBdHRlbXB0aW5nIHRvIHVwZGF0ZSB1bmRlZmluZWQgY29udGV4dCcpO1xuICB9XG5cbiAgdmFyIHVwZGF0ZWRDb250ZXh0ID0gY29udGV4dCA/IGFzc2lnbkFjdGlvbnMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIGFzc2lnbkFjdGlvbikge1xuICAgIHZhciBlXzcsIF9hO1xuXG4gICAgdmFyIGFzc2lnbm1lbnQgPSBhc3NpZ25BY3Rpb24uYXNzaWdubWVudDtcbiAgICB2YXIgbWV0YSA9IHtcbiAgICAgIHN0YXRlOiBzdGF0ZSxcbiAgICAgIGFjdGlvbjogYXNzaWduQWN0aW9uLFxuICAgICAgX2V2ZW50OiBfZXZlbnRcbiAgICB9O1xuICAgIHZhciBwYXJ0aWFsVXBkYXRlID0ge307XG5cbiAgICBpZiAoaXNGdW5jdGlvbihhc3NpZ25tZW50KSkge1xuICAgICAgcGFydGlhbFVwZGF0ZSA9IGFzc2lnbm1lbnQoYWNjLCBfZXZlbnQuZGF0YSwgbWV0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAodmFyIF9iID0gX192YWx1ZXMoT2JqZWN0LmtleXMoYXNzaWdubWVudCkpLCBfYyA9IF9iLm5leHQoKTsgIV9jLmRvbmU7IF9jID0gX2IubmV4dCgpKSB7XG4gICAgICAgICAgdmFyIGtleSA9IF9jLnZhbHVlO1xuICAgICAgICAgIHZhciBwcm9wQXNzaWdubWVudCA9IGFzc2lnbm1lbnRba2V5XTtcbiAgICAgICAgICBwYXJ0aWFsVXBkYXRlW2tleV0gPSBpc0Z1bmN0aW9uKHByb3BBc3NpZ25tZW50KSA/IHByb3BBc3NpZ25tZW50KGFjYywgX2V2ZW50LmRhdGEsIG1ldGEpIDogcHJvcEFzc2lnbm1lbnQ7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVfN18xKSB7XG4gICAgICAgIGVfNyA9IHtcbiAgICAgICAgICBlcnJvcjogZV83XzFcbiAgICAgICAgfTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKF9jICYmICFfYy5kb25lICYmIChfYSA9IF9iLnJldHVybikpIF9hLmNhbGwoX2IpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIGlmIChlXzcpIHRocm93IGVfNy5lcnJvcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBhY2MsIHBhcnRpYWxVcGRhdGUpO1xuICB9LCBjb250ZXh0KSA6IGNvbnRleHQ7XG4gIHJldHVybiB1cGRhdGVkQ29udGV4dDtcbn0gLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWVtcHR5XG5cbnZhciB3YXJuID0gZnVuY3Rpb24gKCkge307XG5cbmlmICghSVNfUFJPRFVDVElPTikge1xuICB3YXJuID0gZnVuY3Rpb24gKGNvbmRpdGlvbiwgbWVzc2FnZSkge1xuICAgIHZhciBlcnJvciA9IGNvbmRpdGlvbiBpbnN0YW5jZW9mIEVycm9yID8gY29uZGl0aW9uIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKCFlcnJvciAmJiBjb25kaXRpb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY29uc29sZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgYXJncyA9IFtcIldhcm5pbmc6IFwiLmNvbmNhdChtZXNzYWdlKV07XG5cbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBhcmdzLnB1c2goZXJyb3IpO1xuICAgICAgfSAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tY29uc29sZVxuXG5cbiAgICAgIGNvbnNvbGUud2Fybi5hcHBseShjb25zb2xlLCBhcmdzKTtcbiAgICB9XG4gIH07XG59XG5mdW5jdGlvbiBpc0FycmF5KHZhbHVlKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKTtcbn0gLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmJhbi10eXBlc1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbic7XG59XG5mdW5jdGlvbiBpc1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJztcbn1cbmZ1bmN0aW9uIHRvR3VhcmQoY29uZGl0aW9uLCBndWFyZE1hcCkge1xuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBpZiAoaXNTdHJpbmcoY29uZGl0aW9uKSkge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiBERUZBVUxUX0dVQVJEX1RZUEUsXG4gICAgICBuYW1lOiBjb25kaXRpb24sXG4gICAgICBwcmVkaWNhdGU6IGd1YXJkTWFwID8gZ3VhcmRNYXBbY29uZGl0aW9uXSA6IHVuZGVmaW5lZFxuICAgIH07XG4gIH1cblxuICBpZiAoaXNGdW5jdGlvbihjb25kaXRpb24pKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6IERFRkFVTFRfR1VBUkRfVFlQRSxcbiAgICAgIG5hbWU6IGNvbmRpdGlvbi5uYW1lLFxuICAgICAgcHJlZGljYXRlOiBjb25kaXRpb25cbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIGNvbmRpdGlvbjtcbn1cbmZ1bmN0aW9uIGlzT2JzZXJ2YWJsZSh2YWx1ZSkge1xuICB0cnkge1xuICAgIHJldHVybiAnc3Vic2NyaWJlJyBpbiB2YWx1ZSAmJiBpc0Z1bmN0aW9uKHZhbHVlLnN1YnNjcmliZSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbnZhciBzeW1ib2xPYnNlcnZhYmxlID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLm9ic2VydmFibGUgfHwgJ0BAb2JzZXJ2YWJsZSc7XG59KCk7IC8vIFRPRE86IHRvIGJlIHJlbW92ZWQgaW4gdjUsIGxlZnQgaXQgb3V0IGp1c3QgdG8gbWluaW1pemUgdGhlIHNjb3BlIG9mIHRoZSBjaGFuZ2UgYW5kIG1haW50YWluIGNvbXBhdGliaWxpdHkgd2l0aCBvbGRlciB2ZXJzaW9ucyBvZiBpbnRlZ3JhdGlvbiBwYWFja2FnZXNcblxudmFyIGludGVyb3BTeW1ib2xzID0gKF9hID0ge30sIF9hW3N5bWJvbE9ic2VydmFibGVdID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcztcbn0sIF9hW1N5bWJvbC5vYnNlcnZhYmxlXSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXM7XG59LCBfYSk7XG5mdW5jdGlvbiBpc01hY2hpbmUodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgJ19feHN0YXRlbm9kZScgaW4gdmFsdWU7XG59XG5mdW5jdGlvbiBpc0FjdG9yKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZS5zZW5kID09PSAnZnVuY3Rpb24nO1xufVxudmFyIHVuaXF1ZUlkID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgdmFyIGN1cnJlbnRJZCA9IDA7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgY3VycmVudElkKys7XG4gICAgcmV0dXJuIGN1cnJlbnRJZC50b1N0cmluZygxNik7XG4gIH07XG59KCk7XG5mdW5jdGlvbiB0b0V2ZW50T2JqZWN0KGV2ZW50LCBwYXlsb2FkIC8vIGlkPzogVEV2ZW50Wyd0eXBlJ11cbikge1xuICBpZiAoaXNTdHJpbmcoZXZlbnQpIHx8IHR5cGVvZiBldmVudCA9PT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gX19hc3NpZ24oe1xuICAgICAgdHlwZTogZXZlbnRcbiAgICB9LCBwYXlsb2FkKTtcbiAgfVxuXG4gIHJldHVybiBldmVudDtcbn1cbmZ1bmN0aW9uIHRvU0NYTUxFdmVudChldmVudCwgc2N4bWxFdmVudCkge1xuICBpZiAoIWlzU3RyaW5nKGV2ZW50KSAmJiAnJCR0eXBlJyBpbiBldmVudCAmJiBldmVudC4kJHR5cGUgPT09ICdzY3htbCcpIHtcbiAgICByZXR1cm4gZXZlbnQ7XG4gIH1cblxuICB2YXIgZXZlbnRPYmplY3QgPSB0b0V2ZW50T2JqZWN0KGV2ZW50KTtcbiAgcmV0dXJuIF9fYXNzaWduKHtcbiAgICBuYW1lOiBldmVudE9iamVjdC50eXBlLFxuICAgIGRhdGE6IGV2ZW50T2JqZWN0LFxuICAgICQkdHlwZTogJ3NjeG1sJyxcbiAgICB0eXBlOiAnZXh0ZXJuYWwnXG4gIH0sIHNjeG1sRXZlbnQpO1xufVxuZnVuY3Rpb24gdG9UcmFuc2l0aW9uQ29uZmlnQXJyYXkoZXZlbnQsIGNvbmZpZ0xpa2UpIHtcbiAgdmFyIHRyYW5zaXRpb25zID0gdG9BcnJheVN0cmljdChjb25maWdMaWtlKS5tYXAoZnVuY3Rpb24gKHRyYW5zaXRpb25MaWtlKSB7XG4gICAgaWYgKHR5cGVvZiB0cmFuc2l0aW9uTGlrZSA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHRyYW5zaXRpb25MaWtlID09PSAnc3RyaW5nJyB8fCBpc01hY2hpbmUodHJhbnNpdGlvbkxpa2UpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0YXJnZXQ6IHRyYW5zaXRpb25MaWtlLFxuICAgICAgICBldmVudDogZXZlbnRcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCB0cmFuc2l0aW9uTGlrZSksIHtcbiAgICAgIGV2ZW50OiBldmVudFxuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIHRyYW5zaXRpb25zO1xufVxuZnVuY3Rpb24gbm9ybWFsaXplVGFyZ2V0KHRhcmdldCkge1xuICBpZiAodGFyZ2V0ID09PSB1bmRlZmluZWQgfHwgdGFyZ2V0ID09PSBUQVJHRVRMRVNTX0tFWSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICByZXR1cm4gdG9BcnJheSh0YXJnZXQpO1xufVxuZnVuY3Rpb24gcmVwb3J0VW5oYW5kbGVkRXhjZXB0aW9uT25JbnZvY2F0aW9uKG9yaWdpbmFsRXJyb3IsIGN1cnJlbnRFcnJvciwgaWQpIHtcbiAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgdmFyIG9yaWdpbmFsU3RhY2tUcmFjZSA9IG9yaWdpbmFsRXJyb3Iuc3RhY2sgPyBcIiBTdGFja3RyYWNlIHdhcyAnXCIuY29uY2F0KG9yaWdpbmFsRXJyb3Iuc3RhY2ssIFwiJ1wiKSA6ICcnO1xuXG4gICAgaWYgKG9yaWdpbmFsRXJyb3IgPT09IGN1cnJlbnRFcnJvcikge1xuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWNvbnNvbGVcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJNaXNzaW5nIG9uRXJyb3IgaGFuZGxlciBmb3IgaW52b2NhdGlvbiAnXCIuY29uY2F0KGlkLCBcIicsIGVycm9yIHdhcyAnXCIpLmNvbmNhdChvcmlnaW5hbEVycm9yLCBcIicuXCIpLmNvbmNhdChvcmlnaW5hbFN0YWNrVHJhY2UpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHN0YWNrVHJhY2UgPSBjdXJyZW50RXJyb3Iuc3RhY2sgPyBcIiBTdGFja3RyYWNlIHdhcyAnXCIuY29uY2F0KGN1cnJlbnRFcnJvci5zdGFjaywgXCInXCIpIDogJyc7IC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1jb25zb2xlXG5cbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJNaXNzaW5nIG9uRXJyb3IgaGFuZGxlciBhbmQvb3IgdW5oYW5kbGVkIGV4Y2VwdGlvbi9wcm9taXNlIHJlamVjdGlvbiBmb3IgaW52b2NhdGlvbiAnXCIuY29uY2F0KGlkLCBcIicuIFwiKSArIFwiT3JpZ2luYWwgZXJyb3I6ICdcIi5jb25jYXQob3JpZ2luYWxFcnJvciwgXCInLiBcIikuY29uY2F0KG9yaWdpbmFsU3RhY2tUcmFjZSwgXCIgQ3VycmVudCBlcnJvciBpcyAnXCIpLmNvbmNhdChjdXJyZW50RXJyb3IsIFwiJy5cIikuY29uY2F0KHN0YWNrVHJhY2UpKTtcbiAgICB9XG4gIH1cbn1cbmZ1bmN0aW9uIGV2YWx1YXRlR3VhcmQobWFjaGluZSwgZ3VhcmQsIGNvbnRleHQsIF9ldmVudCwgc3RhdGUpIHtcbiAgdmFyIGd1YXJkcyA9IG1hY2hpbmUub3B0aW9ucy5ndWFyZHM7XG4gIHZhciBndWFyZE1ldGEgPSB7XG4gICAgc3RhdGU6IHN0YXRlLFxuICAgIGNvbmQ6IGd1YXJkLFxuICAgIF9ldmVudDogX2V2ZW50XG4gIH07IC8vIFRPRE86IGRvIG5vdCBoYXJkY29kZSFcblxuICBpZiAoZ3VhcmQudHlwZSA9PT0gREVGQVVMVF9HVUFSRF9UWVBFKSB7XG4gICAgcmV0dXJuICgoZ3VhcmRzID09PSBudWxsIHx8IGd1YXJkcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogZ3VhcmRzW2d1YXJkLm5hbWVdKSB8fCBndWFyZC5wcmVkaWNhdGUpKGNvbnRleHQsIF9ldmVudC5kYXRhLCBndWFyZE1ldGEpO1xuICB9XG5cbiAgdmFyIGNvbmRGbiA9IGd1YXJkcyA9PT0gbnVsbCB8fCBndWFyZHMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGd1YXJkc1tndWFyZC50eXBlXTtcblxuICBpZiAoIWNvbmRGbikge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkd1YXJkICdcIi5jb25jYXQoZ3VhcmQudHlwZSwgXCInIGlzIG5vdCBpbXBsZW1lbnRlZCBvbiBtYWNoaW5lICdcIikuY29uY2F0KG1hY2hpbmUuaWQsIFwiJy5cIikpO1xuICB9XG5cbiAgcmV0dXJuIGNvbmRGbihjb250ZXh0LCBfZXZlbnQuZGF0YSwgZ3VhcmRNZXRhKTtcbn1cbmZ1bmN0aW9uIHRvSW52b2tlU291cmNlKHNyYykge1xuICBpZiAodHlwZW9mIHNyYyA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogc3JjXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBzcmM7XG59XG5mdW5jdGlvbiB0b09ic2VydmVyKG5leHRIYW5kbGVyLCBlcnJvckhhbmRsZXIsIGNvbXBsZXRpb25IYW5kbGVyKSB7XG4gIHZhciBub29wID0gZnVuY3Rpb24gKCkge307XG5cbiAgdmFyIGlzT2JzZXJ2ZXIgPSB0eXBlb2YgbmV4dEhhbmRsZXIgPT09ICdvYmplY3QnO1xuICB2YXIgc2VsZiA9IGlzT2JzZXJ2ZXIgPyBuZXh0SGFuZGxlciA6IG51bGw7XG4gIHJldHVybiB7XG4gICAgbmV4dDogKChpc09ic2VydmVyID8gbmV4dEhhbmRsZXIubmV4dCA6IG5leHRIYW5kbGVyKSB8fCBub29wKS5iaW5kKHNlbGYpLFxuICAgIGVycm9yOiAoKGlzT2JzZXJ2ZXIgPyBuZXh0SGFuZGxlci5lcnJvciA6IGVycm9ySGFuZGxlcikgfHwgbm9vcCkuYmluZChzZWxmKSxcbiAgICBjb21wbGV0ZTogKChpc09ic2VydmVyID8gbmV4dEhhbmRsZXIuY29tcGxldGUgOiBjb21wbGV0aW9uSGFuZGxlcikgfHwgbm9vcCkuYmluZChzZWxmKVxuICB9O1xufVxuZnVuY3Rpb24gY3JlYXRlSW52b2tlSWQoc3RhdGVOb2RlSWQsIGluZGV4KSB7XG4gIHJldHVybiBcIlwiLmNvbmNhdChzdGF0ZU5vZGVJZCwgXCI6aW52b2NhdGlvbltcIikuY29uY2F0KGluZGV4LCBcIl1cIik7XG59XG5mdW5jdGlvbiBpc1JhaXNhYmxlQWN0aW9uKGFjdGlvbikge1xuICByZXR1cm4gKGFjdGlvbi50eXBlID09PSByYWlzZSB8fCBhY3Rpb24udHlwZSA9PT0gc2VuZCAmJiBhY3Rpb24udG8gPT09IFNwZWNpYWxUYXJnZXRzLkludGVybmFsKSAmJiB0eXBlb2YgYWN0aW9uLmRlbGF5ICE9PSAnbnVtYmVyJztcbn1cblxuZXhwb3J0IHsgY3JlYXRlSW52b2tlSWQsIGV2YWx1YXRlR3VhcmQsIGZsYXR0ZW4sIGdldEFjdGlvblR5cGUsIGdldEV2ZW50VHlwZSwgaW50ZXJvcFN5bWJvbHMsIGlzQWN0b3IsIGlzQXJyYXksIGlzQmVoYXZpb3IsIGlzQnVpbHRJbkV2ZW50LCBpc0Z1bmN0aW9uLCBpc01hY2hpbmUsIGlzT2JzZXJ2YWJsZSwgaXNQcm9taXNlTGlrZSwgaXNSYWlzYWJsZUFjdGlvbiwgaXNTdGF0ZUxpa2UsIGlzU3RyaW5nLCBrZXlzLCBtYXBDb250ZXh0LCBtYXBGaWx0ZXJWYWx1ZXMsIG1hcFZhbHVlcywgbWF0Y2hlc1N0YXRlLCBuZXN0ZWRQYXRoLCBub3JtYWxpemVUYXJnZXQsIHBhcnRpdGlvbiwgcGF0aCwgcGF0aFRvU3RhdGVWYWx1ZSwgcGF0aHNUb1N0YXRlVmFsdWUsIHJlcG9ydFVuaGFuZGxlZEV4Y2VwdGlvbk9uSW52b2NhdGlvbiwgc3ltYm9sT2JzZXJ2YWJsZSwgdG9BcnJheSwgdG9BcnJheVN0cmljdCwgdG9FdmVudE9iamVjdCwgdG9HdWFyZCwgdG9JbnZva2VTb3VyY2UsIHRvT2JzZXJ2ZXIsIHRvU0NYTUxFdmVudCwgdG9TdGF0ZVBhdGgsIHRvU3RhdGVQYXRocywgdG9TdGF0ZVZhbHVlLCB0b1RyYW5zaXRpb25Db25maWdBcnJheSwgdW5pcXVlSWQsIHVwZGF0ZUNvbnRleHQsIHVwZGF0ZUhpc3RvcnlTdGF0ZXMsIHVwZGF0ZUhpc3RvcnlWYWx1ZSwgd2FybiB9O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIGltcG9ydCBzdGF0ZSBtYWNoaW5lcyBmb3IgYXVkaW8gaW5wdXQgYW5kIG91dHB1dFxuY29uc3QgeyBpbnRlcnByZXQgfSA9IHJlcXVpcmUoXCJ4c3RhdGVcIik7XG5jb25zdCB7IGF1ZGlvSW5wdXRNYWNoaW5lIH0gPSByZXF1aXJlKFwiLi9zdGF0ZS1tYWNoaW5lcy9BdWRpb0lucHV0TWFjaGluZVwiKTtcbmNvbnN0IHsgYXVkaW9PdXRwdXRNYWNoaW5lIH0gPSByZXF1aXJlKFwiLi9zdGF0ZS1tYWNoaW5lcy9BdWRpb091dHB1dE1hY2hpbmVcIik7XG5cbi8vIGRlcGVuZHMgb24gdGhlIGluamVjdGluZyBzY3JpcHQgKHNheXBpLmluZGV4LmpzKSBkZWNsYXJpbmcgdGhlIEV2ZW50QnVzIGFzIGEgZ2xvYmFsIHZhcmlhYmxlXG5jb25zdCBFdmVudEJ1cyA9IHdpbmRvdy5FdmVudEJ1cztcblxuLy8gYXVkaW8gb3V0cHV0IChQaSlcbmNvbnN0IGF1ZGlvRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJhdWRpb1wiKTtcbmlmICghYXVkaW9FbGVtZW50KSB7XG4gIGNvbnNvbGUuZXJyb3IoXCJBdWRpbyBlbGVtZW50IG5vdCBmb3VuZCFcIik7XG59IGVsc2Uge1xuICBhdWRpb0VsZW1lbnQucHJlbG9hZCA9IFwiYXV0b1wiOyAvLyBlbmFibGUgYWdncmVzc2l2ZSBwcmVsb2FkaW5nIG9mIGF1ZGlvXG59XG5cbmZ1bmN0aW9uIHNlcmlhbGl6ZVN0YXRlVmFsdWUoc3RhdGVWYWx1ZSkge1xuICBpZiAodHlwZW9mIHN0YXRlVmFsdWUgPT09IFwic3RyaW5nXCIpIHtcbiAgICByZXR1cm4gc3RhdGVWYWx1ZTtcbiAgfVxuXG4gIHJldHVybiBPYmplY3Qua2V5cyhzdGF0ZVZhbHVlKVxuICAgIC5tYXAoKGtleSkgPT4gYCR7a2V5fToke3NlcmlhbGl6ZVN0YXRlVmFsdWUoc3RhdGVWYWx1ZVtrZXldKX1gKVxuICAgIC5qb2luKFwiLFwiKTtcbn1cblxuY29uc3QgYXVkaW9PdXRwdXRBY3RvciA9IGludGVycHJldChhdWRpb091dHB1dE1hY2hpbmUpXG4gIC5vblRyYW5zaXRpb24oKHN0YXRlKSA9PiB7XG4gICAgaWYgKHN0YXRlLmNoYW5nZWQpIHtcbiAgICAgIGNvbnN0IGZyb21TdGF0ZSA9IHN0YXRlLmhpc3RvcnlcbiAgICAgICAgPyBzZXJpYWxpemVTdGF0ZVZhbHVlKHN0YXRlLmhpc3RvcnkudmFsdWUpXG4gICAgICAgIDogXCJOL0FcIjtcbiAgICAgIGNvbnN0IHRvU3RhdGUgPSBzZXJpYWxpemVTdGF0ZVZhbHVlKHN0YXRlLnZhbHVlKTtcbiAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICBgQXVkaW8gT3V0cHV0IE1hY2hpbmUgdHJhbnNpdGlvbmVkIGZyb20gJHtmcm9tU3RhdGV9IHRvICR7dG9TdGF0ZX0gd2l0aCAke3N0YXRlLmV2ZW50LnR5cGV9YFxuICAgICAgKTtcbiAgICAgIGNvbnNvbGUubG9nKHN0YXRlLmNvbnRleHQpO1xuICAgIH1cbiAgfSlcbiAgLnN0YXJ0KCk7XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyQXVkaW9QbGF5YmFja0V2ZW50cyhhdWRpbywgYWN0b3IpIHtcbiAgY29uc3QgZXZlbnRzID0gW1xuICAgIFwibG9hZHN0YXJ0XCIsXG4gICAgXCJsb2FkZWRtZXRhZGF0YVwiLFxuICAgIFwiY2FucGxheXRocm91Z2hcIixcbiAgICBcInBsYXlcIixcbiAgICBcInBhdXNlXCIsXG4gICAgXCJlbmRlZFwiLFxuICAgIFwic2Vla2VkXCIsXG4gICAgXCJlbXB0aWVkXCIsXG4gIF07XG5cbiAgZXZlbnRzLmZvckVhY2goKGV2ZW50KSA9PiB7XG4gICAgYXVkaW8uYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgKCkgPT4gYWN0b3Iuc2VuZChldmVudCkpO1xuICB9KTtcblxuICBhdWRpby5hZGRFdmVudExpc3RlbmVyKFwicGxheWluZ1wiLCAoKSA9PiB7XG4gICAgYWN0b3Iuc2VuZChcInBsYXlcIik7XG4gIH0pO1xufVxucmVnaXN0ZXJBdWRpb1BsYXliYWNrRXZlbnRzKGF1ZGlvRWxlbWVudCwgYXVkaW9PdXRwdXRBY3Rvcik7XG5cbi8vIGF1ZGlvIGlucHV0ICh1c2VyKVxuY29uc3QgYXVkaW9JbnB1dEFjdG9yID0gaW50ZXJwcmV0KGF1ZGlvSW5wdXRNYWNoaW5lKS5zdGFydCgpO1xuXG4vKiBUaGVzZSBldmVudHMgYXJlIHVzZWQgdG8gY29udHJvbC9wYXNzIHJlcXVlc3RzIHRvIHRoZSBhdWRpbyBtb2R1bGUgZnJvbSBvdGhlciBtb2R1bGVzICovXG5mdW5jdGlvbiByZWdpc3RlckF1ZGlvQ29tbWFuZHMoKSB7XG4gIC8vIGF1ZGlvIGlucHV0IChyZWNvcmRpbmcpIGNvbW1hbmRzXG4gIEV2ZW50QnVzLm9uKFwiYXVkaW86c2V0dXBSZWNvcmRpbmdcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICBhdWRpb0lucHV0QWN0b3Iuc2VuZChcImFjcXVpcmVcIik7XG4gIH0pO1xuXG4gIEV2ZW50QnVzLm9uKFwiYXVkaW86dGVhckRvd25SZWNvcmRpbmdcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICBhdWRpb0lucHV0QWN0b3Iuc2VuZChcInJlbGVhc2VcIik7XG4gIH0pO1xuXG4gIEV2ZW50QnVzLm9uKFwiYXVkaW86c3RhcnRSZWNvcmRpbmdcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAvLyBDaGVjayBpZiBQaSBpcyBjdXJyZW50bHkgc3BlYWtpbmcgYW5kIHN0b3AgaGVyIGF1ZGlvXG4gICAgYXVkaW9PdXRwdXRBY3Rvci5zZW5kKFwicGF1c2VcIik7XG5cbiAgICAvLyBDaGVjayBpZiB0aGUgTWVkaWFSZWNvcmRlciBpcyBhY3F1aXJlZCBiZWZvcmUgc3RhcnRpbmc/XG4gICAgYXVkaW9JbnB1dEFjdG9yLnNlbmQoW1wiYWNxdWlyZVwiLCBcInN0YXJ0XCJdKTtcbiAgfSk7XG4gIEV2ZW50QnVzLm9uKFwiYXVkaW86c3RvcFJlY29yZGluZ1wiLCBmdW5jdGlvbiAoZSkge1xuICAgIGF1ZGlvSW5wdXRBY3Rvci5zZW5kKFwic3RvcFJlcXVlc3RlZFwiKTtcbiAgICAvKiByZXN1bWUgb3IgY2FuY2VsIFBpJ3MgYXVkaW8gKi9cbiAgICAvKiBUT0RPOiByZWFzc2VzcyBob3cgdG8gaGFuZGxlIGludGVycnVwdGlvbnNcbiAgICBhdWRpb091dHB1dEFjdG9yLnNlbmQoXCJwbGF5XCIpOyAvLyByZXN1bWUgUGkncyBhdWRpb1xuICAgIGF1ZGlvT3V0cHV0QWN0b3Iuc2VuZChcInN0b3BcIik7IC8vIGNhbmNlbCBQaSdzIGF1ZGlvXG4gICAgKi9cbiAgfSk7XG4gIC8vIGF1ZGlvIGlucHV0IChyZWNvcmRpbmcpIGV2ZW50cyAocGFzcyBNZWRpYVJlY29yZGVyIGV2ZW50cyAtPiBhdWRpbyBpbnB1dCBtYWNoaW5lIGFjdG9yKVxuICBFdmVudEJ1cy5vbihcImF1ZGlvOmRhdGFhdmFpbGFibGVcIiwgKGRldGFpbCkgPT4ge1xuICAgIGF1ZGlvSW5wdXRBY3Rvci5zZW5kKHsgdHlwZTogXCJkYXRhQXZhaWxhYmxlXCIsIC4uLmRldGFpbCB9KTtcbiAgfSk7XG4gIEV2ZW50QnVzLm9uKFwiYXVkaW86aW5wdXQ6c3RvcFwiLCBmdW5jdGlvbiAoZSkge1xuICAgIGF1ZGlvSW5wdXRBY3Rvci5zZW5kKFwic3RvcFwiKTtcbiAgfSk7XG5cbiAgLy8gYXVkaW8gb3V0cHV0IChwbGF5YmFjaykgY29tbWFuZHNcbiAgRXZlbnRCdXMub24oXCJhdWRpbzpyZWxvYWRcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICBhdWRpb091dHB1dEFjdG9yLnNlbmQoXCJyZWxvYWRcIik7XG4gIH0pO1xufVxucmVnaXN0ZXJBdWRpb0NvbW1hbmRzKCk7XG4iXSwibmFtZXMiOlsiaXNTYWZhcmkiLCJ0ZXN0IiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwiaXNNb2JpbGVEZXZpY2UiLCJ3aW5kb3ciLCJtYXRjaE1lZGlhIiwibWF0Y2hlcyIsImlzTW9iaWxlVmlldyIsInVzZXJWaWV3UHJlZmVyZW5jZSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJleGl0TW9iaWxlTW9kZSIsInNldEl0ZW0iLCJlbGVtZW50IiwiZG9jdW1lbnQiLCJkb2N1bWVudEVsZW1lbnQiLCJjbGFzc0xpc3QiLCJyZW1vdmUiLCJhZGQiLCJlbnRlck1vYmlsZU1vZGUiLCJhZGRVc2VyQWdlbnRGbGFncyIsImlzRmlyZWZveEFuZHJvaWQiLCJhZGREZXZpY2VGbGFncyIsImFkZFZpZXdGbGFncyIsImNyZWF0ZU1hY2hpbmUiLCJFdmVudEJ1cyIsImF1ZGlvTWltZVR5cGUiLCJ0aHJlc2hvbGQiLCJtZWRpYVJlY29yZGVyIiwic2V0dXBSZWNvcmRpbmciLCJjYWxsYmFjayIsIm1lZGlhRGV2aWNlcyIsImdldFVzZXJNZWRpYSIsImF1ZGlvIiwidGhlbiIsInN0cmVhbSIsIk1lZGlhUmVjb3JkZXIiLCJpc1R5cGVTdXBwb3J0ZWQiLCJvcHRpb25zIiwibWltZVR5cGUiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJlbWl0IiwiZGF0YSIsImVyciIsImNvbnNvbGUiLCJlcnJvciIsInRlYXJEb3duUmVjb3JkaW5nIiwic3RhdGUiLCJzdG9wIiwiYXVkaW9JbnB1dE1hY2hpbmUiLCJjb250ZXh0IiwiYXVkaW9EYXRhQ2h1bmtzIiwiaWQiLCJpbml0aWFsIiwic3RhdGVzIiwicmVsZWFzZWQiLCJvbiIsImFjcXVpcmUiLCJ0YXJnZXQiLCJhY3F1aXJpbmciLCJkZXNjcmlwdGlvbiIsImludm9rZSIsInNyYyIsIm9uRG9uZSIsIm9uRXJyb3IiLCJhY3Rpb25zIiwiYWNxdWlyZWQiLCJpZGxlIiwic3RhcnQiLCJ0eXBlIiwiY29uZCIsInJlY29yZGluZyIsInN0b3BSZXF1ZXN0ZWQiLCJkYXRhQXZhaWxhYmxlIiwicGFyYW1zIiwiaW50ZXJuYWwiLCJwZW5kaW5nU3RvcCIsInN0b3BwZWQiLCJlbnRyeSIsImFsd2F5cyIsInJlbGVhc2UiLCJwcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50cyIsInByZXNlcnZlQWN0aW9uT3JkZXIiLCJzdGFydFJlY29yZGluZyIsInN0YXJ0VGltZSIsIkRhdGUiLCJub3ciLCJzdG9wUmVjb3JkaW5nIiwic3RvcFRpbWUiLCJkdXJhdGlvbiIsImFkZERhdGEiLCJwdXNoIiwic2VuZERhdGEiLCJhdWRpb0Jsb2IiLCJCbG9iIiwiYmxvYiIsImxvZyIsInJlbGVhc2VNZWRpYVJlY29yZGVyIiwibG9nRXJyb3IiLCJzZXJ2aWNlcyIsImFjcXVpcmVNZWRpYVJlY29yZGVyIiwiX3JlZiIsInNlbmQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIkVycm9yIiwiZ3VhcmRzIiwibWVkaWFSZWNvcmRlckFjcXVpcmVkIiwiaGFzRGF0YSIsImxlbmd0aCIsImRlbGF5cyIsImFzc2lnbiIsInJhaXNlIiwiYXVkaW9FbGVtZW50IiwicXVlcnlTZWxlY3RvciIsImF1ZGlvT3V0cHV0TWFjaGluZSIsImF1dG9wbGF5IiwibG9hZHN0YXJ0IiwibG9hZGluZyIsImxvYWRlZG1ldGFkYXRhIiwibG9hZGVkIiwiZW1wdGllZCIsInJlYWR5IiwicGxheSIsImV2ZW50TmFtZSIsInBsYXlpbmciLCJwYXVzZSIsImVuZGVkIiwiY2FucGxheXRocm91Z2giLCJleGl0IiwicGF1c2VkIiwicmVsb2FkIiwic2Vla2VkIiwiZW1pdEV2ZW50IiwiYWN0aW9uIiwicmVxdWVzdFBhdXNlIiwic2Vla1RvRW5kIiwiY3VycmVudFRpbWUiLCJyZXF1ZXN0UmVsb2FkIiwibG9hZCIsImlzU2FmYXJpTW9iaWxlIiwiaXNTYWZhcmlBdXRvUGxheSIsIl9yZXF1aXJlIiwicmVxdWlyZSIsImludGVycHJldCIsIl9yZXF1aXJlMiIsIl9yZXF1aXJlMyIsInByZWxvYWQiLCJzZXJpYWxpemVTdGF0ZVZhbHVlIiwic3RhdGVWYWx1ZSIsIk9iamVjdCIsImtleXMiLCJtYXAiLCJrZXkiLCJjb25jYXQiLCJqb2luIiwiYXVkaW9PdXRwdXRBY3RvciIsIm9uVHJhbnNpdGlvbiIsImNoYW5nZWQiLCJmcm9tU3RhdGUiLCJoaXN0b3J5IiwidmFsdWUiLCJ0b1N0YXRlIiwicmVnaXN0ZXJBdWRpb1BsYXliYWNrRXZlbnRzIiwiYWN0b3IiLCJldmVudHMiLCJmb3JFYWNoIiwiYXVkaW9JbnB1dEFjdG9yIiwicmVnaXN0ZXJBdWRpb0NvbW1hbmRzIiwiZSIsImRldGFpbCIsIl9vYmplY3RTcHJlYWQiXSwic291cmNlUm9vdCI6IiJ9