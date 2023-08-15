// ==UserScript==
// @name         Say, Pi
// @namespace    http://www.saypi.ai/
// @version      1.2.4
// @description  Speak to Pi with OpenAI's Whisper
// @author       Ross Cadogan
// @match        https://pi.ai/talk
// @inject-into  page
// @updateURL    https://app.saypi.ai/saypi.user.js
// @downloadURL  https://app.saypi.ai/saypi.user.js
// @license      MIT
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/css-loader/dist/cjs.js!./src/mobile.css":
/*!**************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/mobile.css ***!
  \**************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `@media (max-width: 768px) {
  /* mobile styles go here */
  #saypi-panel {
    width: 100%;
    position: fixed;
    left: 0;
    background-color: rgba(245, 238, 223, 0.9);
  }
  #saypi-panel {
    height: 100vh;
    top: 0;
    padding: 5%;
  }
  /* make the buttons fill the panels */
  #saypi-talkButton {
    width: 100%;
    height: 100%;
    background-color: transparent;
    border-radius: 0;
    margin: 0;
  }
  /* surface primary controls: "...", "experiences", "unmute/mute" */
  #__next > main > div > div > div.fixed.top-4.right-6 > button,
  div[data-projection-id="12"] > button {
    transform: scale(2);
    z-index: 50;
  }
  /* override React changes on audio button */
  button[data-projection-id="16"] > div[data-projection-id="17"],
  button[data-projection-id="16"] > div[data-projection-id="18"] {
    transform: scale(2) !important;
    z-index: 50;
  }
  /* hide footer */
  #saypi-footer {
    display: none;
  }
}
`, "",{"version":3,"sources":["webpack://./src/mobile.css"],"names":[],"mappings":"AAAA;EACE,0BAA0B;EAC1B;IACE,WAAW;IACX,eAAe;IACf,OAAO;IACP,0CAA0C;EAC5C;EACA;IACE,aAAa;IACb,MAAM;IACN,WAAW;EACb;EACA,qCAAqC;EACrC;IACE,WAAW;IACX,YAAY;IACZ,6BAA6B;IAC7B,gBAAgB;IAChB,SAAS;EACX;EACA,kEAAkE;EAClE;;IAEE,mBAAmB;IACnB,WAAW;EACb;EACA,2CAA2C;EAC3C;;IAEE,8BAA8B;IAC9B,WAAW;EACb;EACA,gBAAgB;EAChB;IACE,aAAa;EACf;AACF","sourcesContent":["@media (max-width: 768px) {\n  /* mobile styles go here */\n  #saypi-panel {\n    width: 100%;\n    position: fixed;\n    left: 0;\n    background-color: rgba(245, 238, 223, 0.9);\n  }\n  #saypi-panel {\n    height: 100vh;\n    top: 0;\n    padding: 5%;\n  }\n  /* make the buttons fill the panels */\n  #saypi-talkButton {\n    width: 100%;\n    height: 100%;\n    background-color: transparent;\n    border-radius: 0;\n    margin: 0;\n  }\n  /* surface primary controls: \"...\", \"experiences\", \"unmute/mute\" */\n  #__next > main > div > div > div.fixed.top-4.right-6 > button,\n  div[data-projection-id=\"12\"] > button {\n    transform: scale(2);\n    z-index: 50;\n  }\n  /* override React changes on audio button */\n  button[data-projection-id=\"16\"] > div[data-projection-id=\"17\"],\n  button[data-projection-id=\"16\"] > div[data-projection-id=\"18\"] {\n    transform: scale(2) !important;\n    z-index: 50;\n  }\n  /* hide footer */\n  #saypi-footer {\n    display: none;\n  }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/rectangles.css":
/*!******************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/rectangles.css ***!
  \******************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* Gentle Pulsation */
@keyframes scaleAnimation {
  0%,
  100% {
    transform: scale(1); /* Original size */
  }
  50% {
    transform: scale(0.6); /* Scaled down to 60% */
  }
}

#Layer_1 {
  animation: scaleAnimation 5s infinite; /* Apply animation to the SVG with ID "Layer_1" */
}
`, "",{"version":3,"sources":["webpack://./src/rectangles.css"],"names":[],"mappings":"AAAA,qBAAqB;AACrB;EACE;;IAEE,mBAAmB,EAAE,kBAAkB;EACzC;EACA;IACE,qBAAqB,EAAE,uBAAuB;EAChD;AACF;;AAEA;EACE,qCAAqC,EAAE,iDAAiD;AAC1F","sourcesContent":["/* Gentle Pulsation */\n@keyframes scaleAnimation {\n  0%,\n  100% {\n    transform: scale(1); /* Original size */\n  }\n  50% {\n    transform: scale(0.6); /* Scaled down to 60% */\n  }\n}\n\n#Layer_1 {\n  animation: scaleAnimation 5s infinite; /* Apply animation to the SVG with ID \"Layer_1\" */\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/talkButton.css":
/*!******************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/talkButton.css ***!
  \******************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `@keyframes pulse {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(0.9);
    }
    100% {
        transform: scale(1);
    }
}
#saypi-talkButton {
    margin-top: 0.25rem;
    border-radius: 18px;
    width: 120px;
    display: block; /* For Safari */
}

html:not(.firefox-android) #saypi-talkButton:active .waveform,
#saypi-talkButton.active .waveform {
    animation: pulse 1s infinite;
}            
#saypi-talkButton .waveform {
    fill: #776d6d;
}
#saypi-talkButton.autoSubmit .waveform {
    fill: rgb(65 138 47); /* Pi's text-brand-green-600 */
}`, "",{"version":3,"sources":["webpack://./src/talkButton.css"],"names":[],"mappings":"AAAA;IACI;QACI,mBAAmB;IACvB;IACA;QACI,qBAAqB;IACzB;IACA;QACI,mBAAmB;IACvB;AACJ;AACA;IACI,mBAAmB;IACnB,mBAAmB;IACnB,YAAY;IACZ,cAAc,EAAE,eAAe;AACnC;;AAEA;;IAEI,4BAA4B;AAChC;AACA;IACI,aAAa;AACjB;AACA;IACI,oBAAoB,EAAE,8BAA8B;AACxD","sourcesContent":["@keyframes pulse {\n    0% {\n        transform: scale(1);\n    }\n    50% {\n        transform: scale(0.9);\n    }\n    100% {\n        transform: scale(1);\n    }\n}\n#saypi-talkButton {\n    margin-top: 0.25rem;\n    border-radius: 18px;\n    width: 120px;\n    display: block; /* For Safari */\n}\n\nhtml:not(.firefox-android) #saypi-talkButton:active .waveform,\n#saypi-talkButton.active .waveform {\n    animation: pulse 1s infinite;\n}            \n#saypi-talkButton .waveform {\n    fill: #776d6d;\n}\n#saypi-talkButton.autoSubmit .waveform {\n    fill: rgb(65 138 47); /* Pi's text-brand-green-600 */\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/transcriber.js":
/*!******************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/transcriber.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("// audio output (Pi)\nvar audioElement = document.querySelector(\"audio\");\nif (!audioElement) {\n  console.error(\"Audio element not found!\");\n}\nfunction isSafari() {\n  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);\n}\naudioElement.preload = \"auto\"; // enable aggressive preloading of audio\nvar piAudioManager = {\n  isSpeaking: false,\n  audioElement: audioElement,\n  _userStarted: true,\n  // flag to indicate playback has been started by the user (true by default because user must request initial playback)\n  _isLoadCalled: false,\n  // flag to indicate if the load() method has been called on the audio element\n\n  userPlay: function userPlay() {\n    if (!isSafari()) {\n      return;\n    }\n    this._userStarted = true; // set a flag to indicate playback has been started by the user\n    this.audioElement.load(); // reset for Safari\n    this.audioElement.play();\n    console.log(\"User started playback\");\n  },\n  autoPlay: function autoPlay() {\n    if (!isSafari()) {\n      return;\n    }\n    if (!this._userStarted) {\n      this.audioElement.pause();\n      console.log(\"Autoplay prevented\");\n    }\n  },\n  stop: function stop() {\n    if (this.isSpeaking) {\n      this.audioElement.pause();\n    }\n    if (this.audioElement.duration && !this.audioElement.ended && this.audioElement.currentTime < this.audioElement.duration) {\n      this.audioElement.currentTime = this.audioElement.duration; // seek the audio to the end\n      this.audioElement.play(); // trigger the ended event\n    }\n  },\n\n  pause: function pause() {\n    this.audioElement.pause();\n  },\n  resume: function resume() {\n    this.audioElement.play();\n  },\n  loading: function loading() {\n    if (!isSafari()) {\n      return;\n    }\n    if (!this._isLoadCalled) {\n      this._isLoadCalled = true; // Set the flag to true\n      this.showPlayButton(); // Show the play button\n    } else {\n      this._isLoadCalled = false; // Reset the flag\n    }\n  },\n\n  playing: function playing() {\n    this.isSpeaking = true;\n    if (isSafari()) {\n      this.hidePlayButton();\n    }\n  },\n  stopped: function stopped() {\n    this.isSpeaking = false;\n    this._userStarted = false;\n  },\n  showPlayButton: function showPlayButton() {\n    var playButton = document.getElementById(\"saypi-playAudio\");\n    if (!playButton) {\n      playButton = this.createPlayButton();\n    }\n    playButton.style.display = \"block\";\n  },\n  hidePlayButton: function hidePlayButton() {\n    var playButton = document.getElementById(\"saypi-playAudio\");\n    if (playButton) {\n      playButton.style.display = \"none\";\n    }\n  },\n  createPlayButton: function createPlayButton() {\n    var _this = this;\n    // create a containing div\n    var panel = document.createElement(\"div\");\n    panel.id = \"pi-panel\";\n    var playButton = document.createElement(\"button\");\n    playButton.id = \"saypi-playAudio\";\n    playButton.innerText = \"Hear Pi's Response\";\n    playButton.style.position = \"fixed\";\n    playButton.style.top = \"50%\";\n    playButton.style.left = \"50%\";\n    playButton.style.transform = \"translate(-50%, 50%)\";\n    playButton.style.padding = \"10px 20px\";\n    playButton.style.fontSize = \"24px\";\n    playButton.style.borderRadius = \"5px\";\n    playButton.style.border = \"none\";\n    playButton.style.backgroundColor = \"rgb(228 216 193)\";\n    playButton.style.zIndex = \"9999\"; // ensure it's on top of other elements\n    playButton.style.display = \"none\"; // initially hidden\n\n    panel.appendChild(playButton);\n    document.body.appendChild(panel);\n\n    // Event listener to start playback\n    playButton.addEventListener(\"click\", function () {\n      _this.userPlay();\n      _this.hidePlayButton();\n    });\n    return playButton;\n  }\n};\n\n// Intercept Autoplay Events (autoplay doesn't work on Safari)\naudioElement.addEventListener(\"play\", function () {\n  piAudioManager.autoPlay();\n});\naudioElement.addEventListener(\"loadstart\", function () {\n  piAudioManager.loading();\n});\n\n// Event listeners for detecting when Pi is speaking\naudioElement.addEventListener(\"playing\", function () {\n  console.log(\"Pi is speaking\");\n  piAudioManager.playing();\n});\naudioElement.addEventListener(\"pause\", function () {\n  console.log(\"Pi stopped speaking\");\n  piAudioManager.stopped();\n});\naudioElement.addEventListener(\"ended\", function () {\n  console.log(\"Pi finished speaking\");\n  piAudioManager.stopped();\n});\n\n// audio input (user)\nvar audioDataChunks = [];\nvar audioMimeType = \"audio/webm;codecs=opus\";\nfunction uploadAudio(audioBlob) {\n  // Create a FormData object\n  var formData = new FormData();\n  var audioFilename = \"audio.webm\";\n  if (audioBlob.type === \"audio/mp4\") {\n    audioFilename = \"audio.mp4\";\n  }\n  // Add the audio blob to the FormData object\n  formData.append(\"audio\", audioBlob, audioFilename);\n  // Get the user's preferred language\n  var language = navigator.language;\n  // Post the audio to the server for transcription\n  fetch(config.apiServerUrl + \"/transcribe?language=\" + language, {\n    method: \"POST\",\n    body: formData\n  }).then(function (response) {\n    if (!response.ok) {\n      throw Error(response.statusText);\n    }\n    return response.json();\n  }).then(handleTranscriptionResponse)[\"catch\"](function (error) {\n    console.error(\"Looks like there was a problem: \", error);\n    var textarea = document.getElementById(\"prompt\");\n    textarea.value = \"Sorry, there was a problem transcribing your audio. Please try again later.\";\n  });\n}\nfunction handleTranscriptionResponse(responseJson) {\n  var textarea = document.getElementById(\"prompt\");\n  simulateTyping(textarea, responseJson.text + \" \");\n  console.log(\"Transcript: \" + responseJson.text);\n}\nfunction setNativeValue(element, value) {\n  var lastValue = element.value;\n  element.value = value;\n  var event = new Event(\"input\", {\n    target: element,\n    bubbles: true\n  });\n  // React 15\n  event.simulated = true;\n  // React 16-17\n  var tracker = element._valueTracker;\n  if (tracker) {\n    tracker.setValue(lastValue);\n  }\n  element.dispatchEvent(event);\n}\nfunction simulateFormSubmit(textarea) {\n  var enterEvent = new KeyboardEvent(\"keydown\", {\n    bubbles: true,\n    key: \"Enter\",\n    keyCode: 13,\n    which: 13\n  });\n  textarea.dispatchEvent(enterEvent);\n}\nfunction simulateTyping(element, text) {\n  var words = text.split(\" \"); // Split the text into words (may not be ideal for all languages)\n  var i = 0;\n  function typeWord() {\n    if (i < words.length) {\n      // Append the next word and a space, then increment i\n      setNativeValue(element, element.value + words[i++] + \" \");\n      // Call this function again before the next repaint\n      requestAnimationFrame(typeWord);\n    } else {\n      // Check if autosubmit is enabled\n      var talkButton = document.getElementById(\"saypi-talkButton\");\n      if (talkButton.dataset.autosubmit === \"false\") {\n        console.log(\"Autosubmit is disabled\");\n      } else {\n        // Simulate an \"Enter\" keypress event\n        simulateFormSubmit(element);\n      }\n    }\n  }\n  // Start typing\n  typeWord();\n}\n\n// Declare a global variable for the mediaRecorder\nvar mediaRecorder;\nvar threshold = 1000; // 1000 ms = 1 second, about the length of \"Hey, Pi\"\n\n// This function will be called when the 'dataavailable' event fires\nfunction handleDataAvailable(e) {\n  // Add the audio data chunk to the array\n  audioDataChunks.push(e.data);\n}\n\n// This function will be called when the 'stop' event fires\nfunction handleStop() {\n  // Create a Blob from the audio data chunks\n  var audioBlob = new Blob(audioDataChunks, {\n    type: audioMimeType\n  });\n\n  // Get the stop time and calculate the duration\n  var stopTime = Date.now();\n  var duration = stopTime - window.startTime;\n\n  // If the duration is greater than the threshold, upload the audio for transcription\n  if (duration >= threshold) {\n    // download the audio\n    var url = URL.createObjectURL(audioBlob);\n    var a = document.createElement(\"a\");\n    a.style.display = \"none\";\n    a.href = url;\n    a.download = \"safari_audio.mp4\";\n    document.body.appendChild(a);\n    // a.click();\n    // Upload the audio to the server for transcription\n    uploadAudio(audioBlob);\n  }\n\n  // Clear the array for the next recording\n  audioDataChunks = [];\n}\nfunction setupRecording(callback) {\n  if (mediaRecorder) {\n    return;\n  }\n\n  // Get a stream from the user's microphone\n  navigator.mediaDevices.getUserMedia({\n    audio: true\n  }).then(function (stream) {\n    if (!MediaRecorder.isTypeSupported(audioMimeType)) {\n      // use MP4 for Safari\n      audioMimeType = \"audio/mp4\";\n    }\n    // Create a new MediaRecorder object using the stream and specifying the MIME type\n    var options = {\n      mimeType: audioMimeType\n    };\n    mediaRecorder = new MediaRecorder(stream, options);\n\n    // Listen for the 'dataavailable' event\n    mediaRecorder.addEventListener(\"dataavailable\", handleDataAvailable);\n\n    // Listen for the 'stop' event\n    mediaRecorder.addEventListener(\"stop\", handleStop);\n  }).then(function () {\n    // Invoke the callback function\n    if (typeof callback === \"function\") {\n      callback();\n    }\n  })[\"catch\"](function (err) {\n    console.error(\"Error getting audio stream: \" + err);\n  });\n}\nfunction tearDownRecording() {\n  // Check if the MediaRecorder is set up\n  if (!mediaRecorder) {\n    return;\n  }\n\n  // Stop any ongoing recording\n  if (mediaRecorder.state === \"recording\") {\n    mediaRecorder.stop();\n  }\n\n  // Remove the MediaRecorder's event listeners\n  mediaRecorder.removeEventListener(\"dataavailable\", handleDataAvailable);\n  mediaRecorder.removeEventListener(\"stop\", handleStop);\n\n  // Clear the MediaRecorder variable\n  mediaRecorder = null;\n}\n\n// This function will be called when the user presses the record button\nfunction startRecording() {\n  // Check if the MediaRecorder is set up\n  if (!mediaRecorder) {\n    setupRecording(startRecording);\n    return;\n  }\n  // Check if Pi is currently speaking and stop her audio\n  if (piAudioManager.isSpeaking) {\n    piAudioManager.pause();\n  }\n\n  // Start recording\n  mediaRecorder.start();\n\n  // Record the start time\n  window.startTime = Date.now();\n  console.log(\"User is speaking\");\n\n  // This function will be called when the user releases the record button\n  window.stopRecording = function () {\n    if (mediaRecorder && mediaRecorder.state === \"recording\") {\n      // Stop recording\n      mediaRecorder.stop();\n\n      // Record the stop time and calculate the duration\n      var stopTime = Date.now();\n      var duration = stopTime - window.startTime;\n\n      // If the duration is less than the threshold, don't upload the audio for transcription\n      if (duration < threshold) {\n        console.log(\"User stopped speaking\");\n        console.log(\"Recording was too short, not uploading for transcription\");\n        piAudioManager.resume();\n      } else {\n        console.log(\"User finished speaking\");\n        piAudioManager.stop();\n      }\n    }\n    // Remove the stopRecording function\n    delete window.stopRecording;\n  };\n}\n\n// Add the startRecording function to the window object so it can be called from outside this script\nwindow.startRecording = startRecording;");

/***/ }),

/***/ "./src/rectangles.svg":
/*!****************************!*\
  !*** ./src/rectangles.svg ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 307 640\">\n  <defs>\n    <style>\n      .cls-1 {\n        fill: #428a2f;\n      }\n\n      .cls-1, .cls-2, .cls-3, .cls-4, .cls-5, .cls-6 {\n        stroke-width: 0px;\n      }\n\n      .cls-2 {\n        fill: #cce8b5;\n      }\n\n      .cls-3 {\n        fill: #b3db95;\n      }\n\n      .cls-4 {\n        fill: #9bd078;\n      }\n\n      .cls-5 {\n        fill: #83c55c;\n      }\n\n      .cls-6 {\n        fill: #e4f2d1;\n      }\n    </style>\n  </defs>\n  <path class=\"cls-6\" d=\"m306.9,320c0,105.3-.02,210.6.1,315.91,0,3.42-.67,4.1-4.09,4.09-99.6-.12-199.21-.12-298.81,0C.67,640,0,639.33,0,635.91.11,425.3.11,214.7,0,4.09,0,.67.67,0,4.09,0,103.7.12,203.3.12,302.91,0c3.42,0,4.1.67,4.09,4.09-.12,105.3-.1,210.6-.1,315.91Z\"/>\n  <path class=\"cls-2\" d=\"m275.92,323c0,87.63,0,175.27,0,262.9,0,7.24-.55,7.93-7.86,7.98-14.66.09-29.31.03-43.97.03-60.96,0-121.92,0-182.88,0q-7.13,0-7.14-7.24c0-176.1,0-352.21,0-528.31q0-7.26,7.12-7.26c75.78,0,151.56,0,227.35,0q7.38,0,7.38,7.5c0,88.13,0,176.27,0,264.4Z\"/>\n  <path class=\"cls-3\" d=\"m68.06,322.24c0-69.47,0-138.94,0-208.41,0-8.99,1.33-10.13,10.49-9.12,1.98.22,3.98.32,5.97.32,46.13.02,92.26.02,138.39,0,3.48,0,6.92-.23,10.41-.67,5.5-.7,8.74.46,8.73,7.25-.18,138.94-.13,277.88-.13,416.81,0,.33,0,.67,0,1q-.14,10.51-10.39,10.51c-52.13,0-104.25,0-156.38,0q-7.09,0-7.09-7.28c0-70.14,0-140.27,0-210.41Z\"/>\n  <path class=\"cls-4\" d=\"m103.02,322.5c0-52.46,0-104.91,0-157.37,0-6.68.36-7.06,7.07-7.06,30.3-.01,60.6.07,90.9-.09,4.54-.02,6.08,1.33,6.07,5.98-.1,105.58-.1,211.16,0,316.74,0,4.18-1.27,5.37-5.38,5.35-29.3-.15-58.6-.08-87.9-.08q-10.76,0-10.76-11.09c0-50.79,0-101.58,0-152.37Z\"/>\n  <path class=\"cls-5\" d=\"m173,322.2c0,35.29,0,70.58,0,105.88q0,6.89-6.99,6.9c-8.15,0-16.31-.13-24.46.06-3.47.08-4.68-1.09-4.61-4.59.18-9.65.06-19.31.06-28.96,0-58.26-.01-116.53.02-174.79,0-4.76-1.12-9.46-.14-14.3.51-2.54,1.39-3.38,3.8-3.36,8.82.06,17.64.14,26.46-.02,4.59-.09,5.95,1.85,5.94,6.33-.14,35.62-.08,71.25-.08,106.87Z\"/>\n  <path class=\"cls-1\" d=\"m151.04,322.01c0-9.99.07-19.97-.05-29.96-.04-2.93.83-4.18,3.95-4.18,3.06,0,4.03,1.12,4.02,4.11-.09,19.97-.08,39.94.01,59.91.01,2.96-.84,4.16-3.96,4.14-3.03-.01-4.08-1.04-4.03-4.08.14-9.98.05-19.97.05-29.96Z\"/>\n</svg>");

/***/ }),

/***/ "./src/waveform.svg":
/*!**************************!*\
  !*** ./src/waveform.svg ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.0\" viewBox=\"0 0 56.25 30\" class=\"waveform\">\n    <defs>\n        <clipPath id=\"a\">\n            <path d=\"M.54 12H3v5H.54Zm0 0\"/>\n        </clipPath>\n        <clipPath id=\"b\">\n            <path d=\"M25 2.2h2v24.68h-2Zm0 0\"/>\n        </clipPath>\n        <clipPath id=\"c\">\n            <path d=\"M53 12h1.98v5H53Zm0 0\"/>\n        </clipPath>\n    </defs>\n    <g clip-path=\"url(#a)\">\n        <path d=\"M1.48 12.71c-.5 0-.9.4-.9.9v1.85a.9.9 0 0 0 1.8 0v-1.84c0-.5-.4-.9-.9-.9Zm0 0\"/>\n    </g>\n    <path d=\"M4.98 6.63c-.5 0-.9.4-.9.9v14.01a.9.9 0 0 0 1.81 0v-14c0-.5-.4-.92-.9-.92Zm3.51 3.1a.9.9 0 0 0-.9.91v7.79a.9.9 0 0 0 1.8 0v-7.79c0-.5-.4-.9-.9-.9ZM12 3.83a.9.9 0 0 0-.91.9v19.6a.9.9 0 0 0 1.8 0V4.74c0-.5-.4-.9-.9-.9Zm3.5 8.29a.9.9 0 0 0-.91.9v3.03a.9.9 0 0 0 1.81 0v-3.03c0-.5-.4-.9-.9-.9ZM19 6.8c-.5 0-.9.4-.9.9v13.68a.9.9 0 0 0 1.8 0V7.7c0-.5-.4-.9-.9-.9Zm3.58-2.97h-.01c-.5 0-.9.4-.9.9l-.13 19.6c0 .5.4.9.9.91.5 0 .9-.4.9-.9l.14-19.6a.9.9 0 0 0-.9-.9Zm0 0\"/>\n    <g clip-path=\"url(#b)\">\n        <path d=\"M26 2.2c-.5 0-.9.4-.9.9v22.86a.9.9 0 1 0 1.81 0V3.11a.9.9 0 0 0-.9-.91Zm0 0\"/>\n    </g>\n    <path d=\"M29.52 7.71a.9.9 0 0 0-.91.9v11.85a.9.9 0 0 0 1.81 0V8.62c0-.5-.4-.9-.9-.9Zm3.5 2.93a.9.9 0 0 0-.9.91v5.97a.9.9 0 0 0 1.8 0v-5.97c0-.5-.4-.9-.9-.9Zm3.5-5.78c-.5 0-.9.4-.9.9v17.55a.9.9 0 0 0 1.81 0V5.76c0-.5-.4-.9-.9-.9Zm3.51 3.34c-.5 0-.9.4-.9.9v10.87a.9.9 0 0 0 1.8 0V9.1a.9.9 0 0 0-.9-.91Zm3.5 3.08c-.5 0-.9.4-.9.91v4.7a.9.9 0 1 0 1.8 0v-4.7a.9.9 0 0 0-.9-.9Zm3.51-7.45a.9.9 0 0 0-.91.9v19.6a.9.9 0 0 0 1.81 0V4.74c0-.5-.4-.9-.9-.9Zm3.5 5.57a.9.9 0 0 0-.9.91v8.45a.9.9 0 0 0 1.8 0v-8.45c0-.5-.4-.9-.9-.9Zm0 0\"/>\n    <g clip-path=\"url(#c)\">\n        <path d=\"M54.04 12.96a.9.9 0 0 0-.9.91v1.33a.9.9 0 1 0 1.8 0v-1.32a.9.9 0 0 0-.9-.92Zm0 0\"/>\n    </g>\n</svg>");

/***/ }),

/***/ "./src/mobile.css":
/*!************************!*\
  !*** ./src/mobile.css ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_mobile_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./mobile.css */ "./node_modules/css-loader/dist/cjs.js!./src/mobile.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_mobile_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_mobile_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_mobile_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_mobile_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/rectangles.css":
/*!****************************!*\
  !*** ./src/rectangles.css ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_rectangles_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./rectangles.css */ "./node_modules/css-loader/dist/cjs.js!./src/rectangles.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_rectangles_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_rectangles_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_rectangles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_rectangles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/talkButton.css":
/*!****************************!*\
  !*** ./src/talkButton.css ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_talkButton_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./talkButton.css */ "./node_modules/css-loader/dist/cjs.js!./src/talkButton.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_talkButton_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_talkButton_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_talkButton_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_talkButton_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

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
/******/ 			id: moduleId,
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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!****************************!*\
  !*** ./src/saypi.index.js ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _talkButton_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./talkButton.css */ "./src/talkButton.css");
/* harmony import */ var _mobile_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mobile.css */ "./src/mobile.css");
/* harmony import */ var _rectangles_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./rectangles.css */ "./src/rectangles.css");
/* harmony import */ var _waveform_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./waveform.svg */ "./src/waveform.svg");
/* harmony import */ var _rectangles_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./rectangles.svg */ "./src/rectangles.svg");





(function () {
  "use strict";

  var localConfig = {
    appServerUrl: "http://localhost:3000",
    apiServerUrl: "https://localhost:5000"
    // Add other configuration properties as needed
  };

  // Define a global configuration property
  var productionConfig = {
    appServerUrl: "https://app.saypi.ai",
    apiServerUrl: "https://api.saypi.ai"
    // Add other configuration properties as needed
  };

  var config = productionConfig;
  var pageScript = (__webpack_require__(/*! raw-loader!./transcriber.js */ "./node_modules/raw-loader/dist/cjs.js!./src/transcriber.js")["default"]);

  // Create a MutationObserver to listen for changes to the DOM
  var observer = new MutationObserver(function (mutations) {
    // Check each mutation
    for (var i = 0; i < mutations.length; i++) {
      var mutation = mutations[i];

      // If nodes were added, check each one
      if (mutation.addedNodes.length > 0) {
        for (var j = 0; j < mutation.addedNodes.length; j++) {
          var node = mutation.addedNodes[j];

          // If the node is the appropriate container element, add the button and stop observing
          if (node.nodeName.toLowerCase() === "div" && node.classList.contains("fixed") && node.classList.contains("bottom-16")) {
            var footer = node;
            var buttonContainer = footer.querySelector(".relative.flex.flex-col");
            if (buttonContainer) {
              addTalkButton(buttonContainer);
            } else {
              console.warn("No button container found in footer");
            }
            if (!identifyFooter()) {
              console.warn("Footer not found");
            }
            observer.disconnect();
            return;
          }
        }
      }
    }
  });
  function identifyFooter() {
    // Find all audio elements on the page
    var audioElements = document.querySelectorAll("audio");
    var found = false; // default to not found

    audioElements.forEach(function (audio) {
      var precedingDiv = audio.previousElementSibling;

      // If we've already found a div, we can skip further iterations
      if (found) return;

      // Check if the preceding element is a div
      if (precedingDiv && precedingDiv.tagName.toLowerCase() === "div") {
        // Assign an ID to the div
        precedingDiv.id = "saypi-footer";
        found = true; // set to found
      }
    });

    return found;
  }
  function injectScript(callback) {
    var scriptElement = document.createElement("script");
    scriptElement.type = "text/javascript";
    scriptElement.id = "saypi-script";
    var configText = "var config = " + JSON.stringify(config) + ";";
    scriptElement.textContent = configText + pageScript;
    document.body.appendChild(scriptElement);

    // Call the callback function after the script is added
    if (callback) {
      callback();
    }
  }
  function isMobileView() {
    return window.matchMedia("(max-width: 768px)").matches;
  }
  function addTalkButton(container) {
    // create a containing div
    var panel = document.createElement("div");
    panel.id = "saypi-panel";
    container.appendChild(panel);
    var button = document.createElement("button");
    button.id = "saypi-talkButton";
    button.type = "button";
    button.className = "relative flex mt-1 mb-1 rounded-full px-2 py-3 text-center bg-cream-550 hover:bg-cream-650 hover:text-brand-green-700 text-muted";
    // Set ARIA label and tooltip
    var label = "Talk (Hold Control + Space to use hotkey. Double click to toggle auto-submit on/off)";
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
    // enable autosubmit by default
    button.dataset.autosubmit = "true";
    button.classList.add("autoSubmit");
    panel.appendChild(button);
    addTalkButtonStyles();
    addTalkIcon(button);

    // Call the function to inject the script after the button has been added
    injectScript(registerAudioButtonEvents);
  }
  function addTalkIcon(button) {
    updateIconContent(button);
    window.matchMedia("(max-width: 768px)").addListener(function () {
      updateIconContent(button);
    });
  }
  function updateIconContent(iconContainer) {
    if (isMobileView()) {
      iconContainer.innerHTML = _rectangles_svg__WEBPACK_IMPORTED_MODULE_4__["default"];
    } else {
      iconContainer.innerHTML = _waveform_svg__WEBPACK_IMPORTED_MODULE_3__["default"];
    }
  }
  function addStyles(css) {
    var style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }
  function addTalkButtonStyles() {
    var isFirefoxAndroid = /Firefox/.test(navigator.userAgent) && /Android/.test(navigator.userAgent);
    if (isFirefoxAndroid) {
      // hack for Firefox on Android, which doesn't support :active correctly
      document.documentElement.classList.add("firefox-android");
    }
  }
  function registerAudioButtonEvents() {
    var button = document.getElementById("saypi-talkButton");
    var context = window;
    if (GM_info.scriptHandler !== "Userscripts") {
      context = unsafeWindow;
    }

    // For desktop
    button.addEventListener("mousedown", function () {
      idPromptTextArea();
      context.startRecording();
    });
    button.addEventListener("mouseup", function () {
      var _context;
      if (typeof ((_context = context) === null || _context === void 0 ? void 0 : _context.stopRecording) === "function") {
        context.stopRecording();
      }
    });
    registerHotkey();

    // "warm up" the microphone by acquiring it before the user presses the button
    document.getElementById("saypi-talkButton").addEventListener("mouseenter", setupRecording);
    document.getElementById("saypi-talkButton").addEventListener("mouseleave", tearDownRecording);
    window.addEventListener("beforeunload", tearDownRecording);

    // Attach a double click event listener to the talk button
    button.addEventListener("dblclick", function () {
      // Toggle the CSS classes to indicate the mode
      button.classList.toggle("autoSubmit");

      // Store the state on the button element using a custom data attribute
      if (button.getAttribute("data-autosubmit") === "true") {
        button.setAttribute("data-autosubmit", "false");
        console.log("autosubmit disabled");
      } else {
        button.setAttribute("data-autosubmit", "true");
        console.log("autosubmit enabled");
      }
    });

    // For mobile
    button.addEventListener("touchstart", function (e) {
      e.preventDefault(); // Prevent the default click behavior from happening
      idPromptTextArea();
      context.startRecording();
      this.classList.add("active"); // Add the active class (for Firefox on Android)
    });

    button.addEventListener("touchend", function () {
      this.classList.remove("active"); // Remove the active class (for Firefox on Android
      context.stopRecording();
    });
    document.getElementById("saypi-talkButton").addEventListener("touchcancel", function () {
      this.classList.remove("active"); // Remove the active class (for Firefox on Android
      tearDownRecording();
    });
  }
  function registerHotkey() {
    // Register a hotkey for the button
    var ctrlDown = false;
    document.addEventListener("keydown", function (event) {
      if (event.ctrlKey && event.code === "Space" && !ctrlDown) {
        ctrlDown = true;
        // Simulate mousedown event
        var mouseDownEvent = new Event("mousedown");
        document.getElementById("saypi-talkButton").dispatchEvent(mouseDownEvent);
        talkButton.classList.add("active"); // Add the active class
      }
    });

    document.addEventListener("keyup", function (event) {
      if (ctrlDown && event.code === "Space") {
        ctrlDown = false;
        // Simulate mouseup event
        var mouseUpEvent = new Event("mouseup");
        document.getElementById("saypi-talkButton").dispatchEvent(mouseUpEvent);
        talkButton.classList.remove("active");
      }
    });
  }
  function idPromptTextArea() {
    var textarea = document.getElementById("prompt");
    if (!textarea) {
      // Find the first <textarea> element and give it an id
      var textareaElement = document.querySelector("textarea");
      if (textareaElement) {
        textareaElement.id = "prompt";
      } else {
        console.log("No <textarea> element found");
      }
    }
  }

  // Start observing the entire document for changes to child nodes and subtree
  observer.observe(document, {
    childList: true,
    subtree: true
  });
})();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SUFBRUMsT0FBTyxFQUFFO0VBQUssQ0FBQyxDQUFDO0FBQ2hFLENBQUMsRUFBRSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9tb2JpbGUuY3NzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvcmVjdGFuZ2xlcy5jc3MiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy90YWxrQnV0dG9uLmNzcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy90cmFuc2NyaWJlci5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3JlY3RhbmdsZXMuc3ZnIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvd2F2ZWZvcm0uc3ZnIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvbW9iaWxlLmNzcz9mNmZmIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvcmVjdGFuZ2xlcy5jc3M/MDM2MiIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3RhbGtCdXR0b24uY3NzPzA3ZjUiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3NheXBpLmluZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGBAbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgLyogbW9iaWxlIHN0eWxlcyBnbyBoZXJlICovXG4gICNzYXlwaS1wYW5lbCB7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgcG9zaXRpb246IGZpeGVkO1xuICAgIGxlZnQ6IDA7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNDUsIDIzOCwgMjIzLCAwLjkpO1xuICB9XG4gICNzYXlwaS1wYW5lbCB7XG4gICAgaGVpZ2h0OiAxMDB2aDtcbiAgICB0b3A6IDA7XG4gICAgcGFkZGluZzogNSU7XG4gIH1cbiAgLyogbWFrZSB0aGUgYnV0dG9ucyBmaWxsIHRoZSBwYW5lbHMgKi9cbiAgI3NheXBpLXRhbGtCdXR0b24ge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGhlaWdodDogMTAwJTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICBib3JkZXItcmFkaXVzOiAwO1xuICAgIG1hcmdpbjogMDtcbiAgfVxuICAvKiBzdXJmYWNlIHByaW1hcnkgY29udHJvbHM6IFwiLi4uXCIsIFwiZXhwZXJpZW5jZXNcIiwgXCJ1bm11dGUvbXV0ZVwiICovXG4gICNfX25leHQgPiBtYWluID4gZGl2ID4gZGl2ID4gZGl2LmZpeGVkLnRvcC00LnJpZ2h0LTYgPiBidXR0b24sXG4gIGRpdltkYXRhLXByb2plY3Rpb24taWQ9XCIxMlwiXSA+IGJ1dHRvbiB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgyKTtcbiAgICB6LWluZGV4OiA1MDtcbiAgfVxuICAvKiBvdmVycmlkZSBSZWFjdCBjaGFuZ2VzIG9uIGF1ZGlvIGJ1dHRvbiAqL1xuICBidXR0b25bZGF0YS1wcm9qZWN0aW9uLWlkPVwiMTZcIl0gPiBkaXZbZGF0YS1wcm9qZWN0aW9uLWlkPVwiMTdcIl0sXG4gIGJ1dHRvbltkYXRhLXByb2plY3Rpb24taWQ9XCIxNlwiXSA+IGRpdltkYXRhLXByb2plY3Rpb24taWQ9XCIxOFwiXSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgyKSAhaW1wb3J0YW50O1xuICAgIHotaW5kZXg6IDUwO1xuICB9XG4gIC8qIGhpZGUgZm9vdGVyICovXG4gICNzYXlwaS1mb290ZXIge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gIH1cbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL21vYmlsZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDRSwwQkFBMEI7RUFDMUI7SUFDRSxXQUFXO0lBQ1gsZUFBZTtJQUNmLE9BQU87SUFDUCwwQ0FBMEM7RUFDNUM7RUFDQTtJQUNFLGFBQWE7SUFDYixNQUFNO0lBQ04sV0FBVztFQUNiO0VBQ0EscUNBQXFDO0VBQ3JDO0lBQ0UsV0FBVztJQUNYLFlBQVk7SUFDWiw2QkFBNkI7SUFDN0IsZ0JBQWdCO0lBQ2hCLFNBQVM7RUFDWDtFQUNBLGtFQUFrRTtFQUNsRTs7SUFFRSxtQkFBbUI7SUFDbkIsV0FBVztFQUNiO0VBQ0EsMkNBQTJDO0VBQzNDOztJQUVFLDhCQUE4QjtJQUM5QixXQUFXO0VBQ2I7RUFDQSxnQkFBZ0I7RUFDaEI7SUFDRSxhQUFhO0VBQ2Y7QUFDRlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCJAbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcXG4gIC8qIG1vYmlsZSBzdHlsZXMgZ28gaGVyZSAqL1xcbiAgI3NheXBpLXBhbmVsIHtcXG4gICAgd2lkdGg6IDEwMCU7XFxuICAgIHBvc2l0aW9uOiBmaXhlZDtcXG4gICAgbGVmdDogMDtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNDUsIDIzOCwgMjIzLCAwLjkpO1xcbiAgfVxcbiAgI3NheXBpLXBhbmVsIHtcXG4gICAgaGVpZ2h0OiAxMDB2aDtcXG4gICAgdG9wOiAwO1xcbiAgICBwYWRkaW5nOiA1JTtcXG4gIH1cXG4gIC8qIG1ha2UgdGhlIGJ1dHRvbnMgZmlsbCB0aGUgcGFuZWxzICovXFxuICAjc2F5cGktdGFsa0J1dHRvbiB7XFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgICBoZWlnaHQ6IDEwMCU7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgICBib3JkZXItcmFkaXVzOiAwO1xcbiAgICBtYXJnaW46IDA7XFxuICB9XFxuICAvKiBzdXJmYWNlIHByaW1hcnkgY29udHJvbHM6IFxcXCIuLi5cXFwiLCBcXFwiZXhwZXJpZW5jZXNcXFwiLCBcXFwidW5tdXRlL211dGVcXFwiICovXFxuICAjX19uZXh0ID4gbWFpbiA+IGRpdiA+IGRpdiA+IGRpdi5maXhlZC50b3AtNC5yaWdodC02ID4gYnV0dG9uLFxcbiAgZGl2W2RhdGEtcHJvamVjdGlvbi1pZD1cXFwiMTJcXFwiXSA+IGJ1dHRvbiB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMik7XFxuICAgIHotaW5kZXg6IDUwO1xcbiAgfVxcbiAgLyogb3ZlcnJpZGUgUmVhY3QgY2hhbmdlcyBvbiBhdWRpbyBidXR0b24gKi9cXG4gIGJ1dHRvbltkYXRhLXByb2plY3Rpb24taWQ9XFxcIjE2XFxcIl0gPiBkaXZbZGF0YS1wcm9qZWN0aW9uLWlkPVxcXCIxN1xcXCJdLFxcbiAgYnV0dG9uW2RhdGEtcHJvamVjdGlvbi1pZD1cXFwiMTZcXFwiXSA+IGRpdltkYXRhLXByb2plY3Rpb24taWQ9XFxcIjE4XFxcIl0ge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDIpICFpbXBvcnRhbnQ7XFxuICAgIHotaW5kZXg6IDUwO1xcbiAgfVxcbiAgLyogaGlkZSBmb290ZXIgKi9cXG4gICNzYXlwaS1mb290ZXIge1xcbiAgICBkaXNwbGF5OiBub25lO1xcbiAgfVxcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYC8qIEdlbnRsZSBQdWxzYXRpb24gKi9cbkBrZXlmcmFtZXMgc2NhbGVBbmltYXRpb24ge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTsgLyogT3JpZ2luYWwgc2l6ZSAqL1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjYpOyAvKiBTY2FsZWQgZG93biB0byA2MCUgKi9cbiAgfVxufVxuXG4jTGF5ZXJfMSB7XG4gIGFuaW1hdGlvbjogc2NhbGVBbmltYXRpb24gNXMgaW5maW5pdGU7IC8qIEFwcGx5IGFuaW1hdGlvbiB0byB0aGUgU1ZHIHdpdGggSUQgXCJMYXllcl8xXCIgKi9cbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3JlY3RhbmdsZXMuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBLHFCQUFxQjtBQUNyQjtFQUNFOztJQUVFLG1CQUFtQixFQUFFLGtCQUFrQjtFQUN6QztFQUNBO0lBQ0UscUJBQXFCLEVBQUUsdUJBQXVCO0VBQ2hEO0FBQ0Y7O0FBRUE7RUFDRSxxQ0FBcUMsRUFBRSxpREFBaUQ7QUFDMUZcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLyogR2VudGxlIFB1bHNhdGlvbiAqL1xcbkBrZXlmcmFtZXMgc2NhbGVBbmltYXRpb24ge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTsgLyogT3JpZ2luYWwgc2l6ZSAqL1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjYpOyAvKiBTY2FsZWQgZG93biB0byA2MCUgKi9cXG4gIH1cXG59XFxuXFxuI0xheWVyXzEge1xcbiAgYW5pbWF0aW9uOiBzY2FsZUFuaW1hdGlvbiA1cyBpbmZpbml0ZTsgLyogQXBwbHkgYW5pbWF0aW9uIHRvIHRoZSBTVkcgd2l0aCBJRCBcXFwiTGF5ZXJfMVxcXCIgKi9cXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGBAa2V5ZnJhbWVzIHB1bHNlIHtcbiAgICAwJSB7XG4gICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gICAgfVxuICAgIDUwJSB7XG4gICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMC45KTtcbiAgICB9XG4gICAgMTAwJSB7XG4gICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gICAgfVxufVxuI3NheXBpLXRhbGtCdXR0b24ge1xuICAgIG1hcmdpbi10b3A6IDAuMjVyZW07XG4gICAgYm9yZGVyLXJhZGl1czogMThweDtcbiAgICB3aWR0aDogMTIwcHg7XG4gICAgZGlzcGxheTogYmxvY2s7IC8qIEZvciBTYWZhcmkgKi9cbn1cblxuaHRtbDpub3QoLmZpcmVmb3gtYW5kcm9pZCkgI3NheXBpLXRhbGtCdXR0b246YWN0aXZlIC53YXZlZm9ybSxcbiNzYXlwaS10YWxrQnV0dG9uLmFjdGl2ZSAud2F2ZWZvcm0ge1xuICAgIGFuaW1hdGlvbjogcHVsc2UgMXMgaW5maW5pdGU7XG59ICAgICAgICAgICAgXG4jc2F5cGktdGFsa0J1dHRvbiAud2F2ZWZvcm0ge1xuICAgIGZpbGw6ICM3NzZkNmQ7XG59XG4jc2F5cGktdGFsa0J1dHRvbi5hdXRvU3VibWl0IC53YXZlZm9ybSB7XG4gICAgZmlsbDogcmdiKDY1IDEzOCA0Nyk7IC8qIFBpJ3MgdGV4dC1icmFuZC1ncmVlbi02MDAgKi9cbn1gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy90YWxrQnV0dG9uLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtJQUNJO1FBQ0ksbUJBQW1CO0lBQ3ZCO0lBQ0E7UUFDSSxxQkFBcUI7SUFDekI7SUFDQTtRQUNJLG1CQUFtQjtJQUN2QjtBQUNKO0FBQ0E7SUFDSSxtQkFBbUI7SUFDbkIsbUJBQW1CO0lBQ25CLFlBQVk7SUFDWixjQUFjLEVBQUUsZUFBZTtBQUNuQzs7QUFFQTs7SUFFSSw0QkFBNEI7QUFDaEM7QUFDQTtJQUNJLGFBQWE7QUFDakI7QUFDQTtJQUNJLG9CQUFvQixFQUFFLDhCQUE4QjtBQUN4RFwiLFwic291cmNlc0NvbnRlbnRcIjpbXCJAa2V5ZnJhbWVzIHB1bHNlIHtcXG4gICAgMCUge1xcbiAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gICAgfVxcbiAgICA1MCUge1xcbiAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkpO1xcbiAgICB9XFxuICAgIDEwMCUge1xcbiAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gICAgfVxcbn1cXG4jc2F5cGktdGFsa0J1dHRvbiB7XFxuICAgIG1hcmdpbi10b3A6IDAuMjVyZW07XFxuICAgIGJvcmRlci1yYWRpdXM6IDE4cHg7XFxuICAgIHdpZHRoOiAxMjBweDtcXG4gICAgZGlzcGxheTogYmxvY2s7IC8qIEZvciBTYWZhcmkgKi9cXG59XFxuXFxuaHRtbDpub3QoLmZpcmVmb3gtYW5kcm9pZCkgI3NheXBpLXRhbGtCdXR0b246YWN0aXZlIC53YXZlZm9ybSxcXG4jc2F5cGktdGFsa0J1dHRvbi5hY3RpdmUgLndhdmVmb3JtIHtcXG4gICAgYW5pbWF0aW9uOiBwdWxzZSAxcyBpbmZpbml0ZTtcXG59ICAgICAgICAgICAgXFxuI3NheXBpLXRhbGtCdXR0b24gLndhdmVmb3JtIHtcXG4gICAgZmlsbDogIzc3NmQ2ZDtcXG59XFxuI3NheXBpLXRhbGtCdXR0b24uYXV0b1N1Ym1pdCAud2F2ZWZvcm0ge1xcbiAgICBmaWxsOiByZ2IoNjUgMTM4IDQ3KTsgLyogUGkncyB0ZXh0LWJyYW5kLWdyZWVuLTYwMCAqL1xcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsImV4cG9ydCBkZWZhdWx0IFwiLy8gYXVkaW8gb3V0cHV0IChQaSlcXG52YXIgYXVkaW9FbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcXFwiYXVkaW9cXFwiKTtcXG5pZiAoIWF1ZGlvRWxlbWVudCkge1xcbiAgY29uc29sZS5lcnJvcihcXFwiQXVkaW8gZWxlbWVudCBub3QgZm91bmQhXFxcIik7XFxufVxcbmZ1bmN0aW9uIGlzU2FmYXJpKCkge1xcbiAgcmV0dXJuIC9eKCg/IWNocm9tZXxhbmRyb2lkKS4pKnNhZmFyaS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XFxufVxcbmF1ZGlvRWxlbWVudC5wcmVsb2FkID0gXFxcImF1dG9cXFwiOyAvLyBlbmFibGUgYWdncmVzc2l2ZSBwcmVsb2FkaW5nIG9mIGF1ZGlvXFxudmFyIHBpQXVkaW9NYW5hZ2VyID0ge1xcbiAgaXNTcGVha2luZzogZmFsc2UsXFxuICBhdWRpb0VsZW1lbnQ6IGF1ZGlvRWxlbWVudCxcXG4gIF91c2VyU3RhcnRlZDogdHJ1ZSxcXG4gIC8vIGZsYWcgdG8gaW5kaWNhdGUgcGxheWJhY2sgaGFzIGJlZW4gc3RhcnRlZCBieSB0aGUgdXNlciAodHJ1ZSBieSBkZWZhdWx0IGJlY2F1c2UgdXNlciBtdXN0IHJlcXVlc3QgaW5pdGlhbCBwbGF5YmFjaylcXG4gIF9pc0xvYWRDYWxsZWQ6IGZhbHNlLFxcbiAgLy8gZmxhZyB0byBpbmRpY2F0ZSBpZiB0aGUgbG9hZCgpIG1ldGhvZCBoYXMgYmVlbiBjYWxsZWQgb24gdGhlIGF1ZGlvIGVsZW1lbnRcXG5cXG4gIHVzZXJQbGF5OiBmdW5jdGlvbiB1c2VyUGxheSgpIHtcXG4gICAgaWYgKCFpc1NhZmFyaSgpKSB7XFxuICAgICAgcmV0dXJuO1xcbiAgICB9XFxuICAgIHRoaXMuX3VzZXJTdGFydGVkID0gdHJ1ZTsgLy8gc2V0IGEgZmxhZyB0byBpbmRpY2F0ZSBwbGF5YmFjayBoYXMgYmVlbiBzdGFydGVkIGJ5IHRoZSB1c2VyXFxuICAgIHRoaXMuYXVkaW9FbGVtZW50LmxvYWQoKTsgLy8gcmVzZXQgZm9yIFNhZmFyaVxcbiAgICB0aGlzLmF1ZGlvRWxlbWVudC5wbGF5KCk7XFxuICAgIGNvbnNvbGUubG9nKFxcXCJVc2VyIHN0YXJ0ZWQgcGxheWJhY2tcXFwiKTtcXG4gIH0sXFxuICBhdXRvUGxheTogZnVuY3Rpb24gYXV0b1BsYXkoKSB7XFxuICAgIGlmICghaXNTYWZhcmkoKSkge1xcbiAgICAgIHJldHVybjtcXG4gICAgfVxcbiAgICBpZiAoIXRoaXMuX3VzZXJTdGFydGVkKSB7XFxuICAgICAgdGhpcy5hdWRpb0VsZW1lbnQucGF1c2UoKTtcXG4gICAgICBjb25zb2xlLmxvZyhcXFwiQXV0b3BsYXkgcHJldmVudGVkXFxcIik7XFxuICAgIH1cXG4gIH0sXFxuICBzdG9wOiBmdW5jdGlvbiBzdG9wKCkge1xcbiAgICBpZiAodGhpcy5pc1NwZWFraW5nKSB7XFxuICAgICAgdGhpcy5hdWRpb0VsZW1lbnQucGF1c2UoKTtcXG4gICAgfVxcbiAgICBpZiAodGhpcy5hdWRpb0VsZW1lbnQuZHVyYXRpb24gJiYgIXRoaXMuYXVkaW9FbGVtZW50LmVuZGVkICYmIHRoaXMuYXVkaW9FbGVtZW50LmN1cnJlbnRUaW1lIDwgdGhpcy5hdWRpb0VsZW1lbnQuZHVyYXRpb24pIHtcXG4gICAgICB0aGlzLmF1ZGlvRWxlbWVudC5jdXJyZW50VGltZSA9IHRoaXMuYXVkaW9FbGVtZW50LmR1cmF0aW9uOyAvLyBzZWVrIHRoZSBhdWRpbyB0byB0aGUgZW5kXFxuICAgICAgdGhpcy5hdWRpb0VsZW1lbnQucGxheSgpOyAvLyB0cmlnZ2VyIHRoZSBlbmRlZCBldmVudFxcbiAgICB9XFxuICB9LFxcblxcbiAgcGF1c2U6IGZ1bmN0aW9uIHBhdXNlKCkge1xcbiAgICB0aGlzLmF1ZGlvRWxlbWVudC5wYXVzZSgpO1xcbiAgfSxcXG4gIHJlc3VtZTogZnVuY3Rpb24gcmVzdW1lKCkge1xcbiAgICB0aGlzLmF1ZGlvRWxlbWVudC5wbGF5KCk7XFxuICB9LFxcbiAgbG9hZGluZzogZnVuY3Rpb24gbG9hZGluZygpIHtcXG4gICAgaWYgKCFpc1NhZmFyaSgpKSB7XFxuICAgICAgcmV0dXJuO1xcbiAgICB9XFxuICAgIGlmICghdGhpcy5faXNMb2FkQ2FsbGVkKSB7XFxuICAgICAgdGhpcy5faXNMb2FkQ2FsbGVkID0gdHJ1ZTsgLy8gU2V0IHRoZSBmbGFnIHRvIHRydWVcXG4gICAgICB0aGlzLnNob3dQbGF5QnV0dG9uKCk7IC8vIFNob3cgdGhlIHBsYXkgYnV0dG9uXFxuICAgIH0gZWxzZSB7XFxuICAgICAgdGhpcy5faXNMb2FkQ2FsbGVkID0gZmFsc2U7IC8vIFJlc2V0IHRoZSBmbGFnXFxuICAgIH1cXG4gIH0sXFxuXFxuICBwbGF5aW5nOiBmdW5jdGlvbiBwbGF5aW5nKCkge1xcbiAgICB0aGlzLmlzU3BlYWtpbmcgPSB0cnVlO1xcbiAgICBpZiAoaXNTYWZhcmkoKSkge1xcbiAgICAgIHRoaXMuaGlkZVBsYXlCdXR0b24oKTtcXG4gICAgfVxcbiAgfSxcXG4gIHN0b3BwZWQ6IGZ1bmN0aW9uIHN0b3BwZWQoKSB7XFxuICAgIHRoaXMuaXNTcGVha2luZyA9IGZhbHNlO1xcbiAgICB0aGlzLl91c2VyU3RhcnRlZCA9IGZhbHNlO1xcbiAgfSxcXG4gIHNob3dQbGF5QnV0dG9uOiBmdW5jdGlvbiBzaG93UGxheUJ1dHRvbigpIHtcXG4gICAgdmFyIHBsYXlCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcXFwic2F5cGktcGxheUF1ZGlvXFxcIik7XFxuICAgIGlmICghcGxheUJ1dHRvbikge1xcbiAgICAgIHBsYXlCdXR0b24gPSB0aGlzLmNyZWF0ZVBsYXlCdXR0b24oKTtcXG4gICAgfVxcbiAgICBwbGF5QnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcXFwiYmxvY2tcXFwiO1xcbiAgfSxcXG4gIGhpZGVQbGF5QnV0dG9uOiBmdW5jdGlvbiBoaWRlUGxheUJ1dHRvbigpIHtcXG4gICAgdmFyIHBsYXlCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcXFwic2F5cGktcGxheUF1ZGlvXFxcIik7XFxuICAgIGlmIChwbGF5QnV0dG9uKSB7XFxuICAgICAgcGxheUJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXFxcIm5vbmVcXFwiO1xcbiAgICB9XFxuICB9LFxcbiAgY3JlYXRlUGxheUJ1dHRvbjogZnVuY3Rpb24gY3JlYXRlUGxheUJ1dHRvbigpIHtcXG4gICAgdmFyIF90aGlzID0gdGhpcztcXG4gICAgLy8gY3JlYXRlIGEgY29udGFpbmluZyBkaXZcXG4gICAgdmFyIHBhbmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcXFwiZGl2XFxcIik7XFxuICAgIHBhbmVsLmlkID0gXFxcInBpLXBhbmVsXFxcIjtcXG4gICAgdmFyIHBsYXlCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFxcXCJidXR0b25cXFwiKTtcXG4gICAgcGxheUJ1dHRvbi5pZCA9IFxcXCJzYXlwaS1wbGF5QXVkaW9cXFwiO1xcbiAgICBwbGF5QnV0dG9uLmlubmVyVGV4dCA9IFxcXCJIZWFyIFBpJ3MgUmVzcG9uc2VcXFwiO1xcbiAgICBwbGF5QnV0dG9uLnN0eWxlLnBvc2l0aW9uID0gXFxcImZpeGVkXFxcIjtcXG4gICAgcGxheUJ1dHRvbi5zdHlsZS50b3AgPSBcXFwiNTAlXFxcIjtcXG4gICAgcGxheUJ1dHRvbi5zdHlsZS5sZWZ0ID0gXFxcIjUwJVxcXCI7XFxuICAgIHBsYXlCdXR0b24uc3R5bGUudHJhbnNmb3JtID0gXFxcInRyYW5zbGF0ZSgtNTAlLCA1MCUpXFxcIjtcXG4gICAgcGxheUJ1dHRvbi5zdHlsZS5wYWRkaW5nID0gXFxcIjEwcHggMjBweFxcXCI7XFxuICAgIHBsYXlCdXR0b24uc3R5bGUuZm9udFNpemUgPSBcXFwiMjRweFxcXCI7XFxuICAgIHBsYXlCdXR0b24uc3R5bGUuYm9yZGVyUmFkaXVzID0gXFxcIjVweFxcXCI7XFxuICAgIHBsYXlCdXR0b24uc3R5bGUuYm9yZGVyID0gXFxcIm5vbmVcXFwiO1xcbiAgICBwbGF5QnV0dG9uLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFxcXCJyZ2IoMjI4IDIxNiAxOTMpXFxcIjtcXG4gICAgcGxheUJ1dHRvbi5zdHlsZS56SW5kZXggPSBcXFwiOTk5OVxcXCI7IC8vIGVuc3VyZSBpdCdzIG9uIHRvcCBvZiBvdGhlciBlbGVtZW50c1xcbiAgICBwbGF5QnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcXFwibm9uZVxcXCI7IC8vIGluaXRpYWxseSBoaWRkZW5cXG5cXG4gICAgcGFuZWwuYXBwZW5kQ2hpbGQocGxheUJ1dHRvbik7XFxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocGFuZWwpO1xcblxcbiAgICAvLyBFdmVudCBsaXN0ZW5lciB0byBzdGFydCBwbGF5YmFja1xcbiAgICBwbGF5QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXFxcImNsaWNrXFxcIiwgZnVuY3Rpb24gKCkge1xcbiAgICAgIF90aGlzLnVzZXJQbGF5KCk7XFxuICAgICAgX3RoaXMuaGlkZVBsYXlCdXR0b24oKTtcXG4gICAgfSk7XFxuICAgIHJldHVybiBwbGF5QnV0dG9uO1xcbiAgfVxcbn07XFxuXFxuLy8gSW50ZXJjZXB0IEF1dG9wbGF5IEV2ZW50cyAoYXV0b3BsYXkgZG9lc24ndCB3b3JrIG9uIFNhZmFyaSlcXG5hdWRpb0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcXFwicGxheVxcXCIsIGZ1bmN0aW9uICgpIHtcXG4gIHBpQXVkaW9NYW5hZ2VyLmF1dG9QbGF5KCk7XFxufSk7XFxuYXVkaW9FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXFxcImxvYWRzdGFydFxcXCIsIGZ1bmN0aW9uICgpIHtcXG4gIHBpQXVkaW9NYW5hZ2VyLmxvYWRpbmcoKTtcXG59KTtcXG5cXG4vLyBFdmVudCBsaXN0ZW5lcnMgZm9yIGRldGVjdGluZyB3aGVuIFBpIGlzIHNwZWFraW5nXFxuYXVkaW9FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXFxcInBsYXlpbmdcXFwiLCBmdW5jdGlvbiAoKSB7XFxuICBjb25zb2xlLmxvZyhcXFwiUGkgaXMgc3BlYWtpbmdcXFwiKTtcXG4gIHBpQXVkaW9NYW5hZ2VyLnBsYXlpbmcoKTtcXG59KTtcXG5hdWRpb0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcXFwicGF1c2VcXFwiLCBmdW5jdGlvbiAoKSB7XFxuICBjb25zb2xlLmxvZyhcXFwiUGkgc3RvcHBlZCBzcGVha2luZ1xcXCIpO1xcbiAgcGlBdWRpb01hbmFnZXIuc3RvcHBlZCgpO1xcbn0pO1xcbmF1ZGlvRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxcXCJlbmRlZFxcXCIsIGZ1bmN0aW9uICgpIHtcXG4gIGNvbnNvbGUubG9nKFxcXCJQaSBmaW5pc2hlZCBzcGVha2luZ1xcXCIpO1xcbiAgcGlBdWRpb01hbmFnZXIuc3RvcHBlZCgpO1xcbn0pO1xcblxcbi8vIGF1ZGlvIGlucHV0ICh1c2VyKVxcbnZhciBhdWRpb0RhdGFDaHVua3MgPSBbXTtcXG52YXIgYXVkaW9NaW1lVHlwZSA9IFxcXCJhdWRpby93ZWJtO2NvZGVjcz1vcHVzXFxcIjtcXG5mdW5jdGlvbiB1cGxvYWRBdWRpbyhhdWRpb0Jsb2IpIHtcXG4gIC8vIENyZWF0ZSBhIEZvcm1EYXRhIG9iamVjdFxcbiAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XFxuICB2YXIgYXVkaW9GaWxlbmFtZSA9IFxcXCJhdWRpby53ZWJtXFxcIjtcXG4gIGlmIChhdWRpb0Jsb2IudHlwZSA9PT0gXFxcImF1ZGlvL21wNFxcXCIpIHtcXG4gICAgYXVkaW9GaWxlbmFtZSA9IFxcXCJhdWRpby5tcDRcXFwiO1xcbiAgfVxcbiAgLy8gQWRkIHRoZSBhdWRpbyBibG9iIHRvIHRoZSBGb3JtRGF0YSBvYmplY3RcXG4gIGZvcm1EYXRhLmFwcGVuZChcXFwiYXVkaW9cXFwiLCBhdWRpb0Jsb2IsIGF1ZGlvRmlsZW5hbWUpO1xcbiAgLy8gR2V0IHRoZSB1c2VyJ3MgcHJlZmVycmVkIGxhbmd1YWdlXFxuICB2YXIgbGFuZ3VhZ2UgPSBuYXZpZ2F0b3IubGFuZ3VhZ2U7XFxuICAvLyBQb3N0IHRoZSBhdWRpbyB0byB0aGUgc2VydmVyIGZvciB0cmFuc2NyaXB0aW9uXFxuICBmZXRjaChjb25maWcuYXBpU2VydmVyVXJsICsgXFxcIi90cmFuc2NyaWJlP2xhbmd1YWdlPVxcXCIgKyBsYW5ndWFnZSwge1xcbiAgICBtZXRob2Q6IFxcXCJQT1NUXFxcIixcXG4gICAgYm9keTogZm9ybURhdGFcXG4gIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XFxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcXG4gICAgICB0aHJvdyBFcnJvcihyZXNwb25zZS5zdGF0dXNUZXh0KTtcXG4gICAgfVxcbiAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xcbiAgfSkudGhlbihoYW5kbGVUcmFuc2NyaXB0aW9uUmVzcG9uc2UpW1xcXCJjYXRjaFxcXCJdKGZ1bmN0aW9uIChlcnJvcikge1xcbiAgICBjb25zb2xlLmVycm9yKFxcXCJMb29rcyBsaWtlIHRoZXJlIHdhcyBhIHByb2JsZW06IFxcXCIsIGVycm9yKTtcXG4gICAgdmFyIHRleHRhcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXFxcInByb21wdFxcXCIpO1xcbiAgICB0ZXh0YXJlYS52YWx1ZSA9IFxcXCJTb3JyeSwgdGhlcmUgd2FzIGEgcHJvYmxlbSB0cmFuc2NyaWJpbmcgeW91ciBhdWRpby4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlci5cXFwiO1xcbiAgfSk7XFxufVxcbmZ1bmN0aW9uIGhhbmRsZVRyYW5zY3JpcHRpb25SZXNwb25zZShyZXNwb25zZUpzb24pIHtcXG4gIHZhciB0ZXh0YXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxcXCJwcm9tcHRcXFwiKTtcXG4gIHNpbXVsYXRlVHlwaW5nKHRleHRhcmVhLCByZXNwb25zZUpzb24udGV4dCArIFxcXCIgXFxcIik7XFxuICBjb25zb2xlLmxvZyhcXFwiVHJhbnNjcmlwdDogXFxcIiArIHJlc3BvbnNlSnNvbi50ZXh0KTtcXG59XFxuZnVuY3Rpb24gc2V0TmF0aXZlVmFsdWUoZWxlbWVudCwgdmFsdWUpIHtcXG4gIHZhciBsYXN0VmFsdWUgPSBlbGVtZW50LnZhbHVlO1xcbiAgZWxlbWVudC52YWx1ZSA9IHZhbHVlO1xcbiAgdmFyIGV2ZW50ID0gbmV3IEV2ZW50KFxcXCJpbnB1dFxcXCIsIHtcXG4gICAgdGFyZ2V0OiBlbGVtZW50LFxcbiAgICBidWJibGVzOiB0cnVlXFxuICB9KTtcXG4gIC8vIFJlYWN0IDE1XFxuICBldmVudC5zaW11bGF0ZWQgPSB0cnVlO1xcbiAgLy8gUmVhY3QgMTYtMTdcXG4gIHZhciB0cmFja2VyID0gZWxlbWVudC5fdmFsdWVUcmFja2VyO1xcbiAgaWYgKHRyYWNrZXIpIHtcXG4gICAgdHJhY2tlci5zZXRWYWx1ZShsYXN0VmFsdWUpO1xcbiAgfVxcbiAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcXG59XFxuZnVuY3Rpb24gc2ltdWxhdGVGb3JtU3VibWl0KHRleHRhcmVhKSB7XFxuICB2YXIgZW50ZXJFdmVudCA9IG5ldyBLZXlib2FyZEV2ZW50KFxcXCJrZXlkb3duXFxcIiwge1xcbiAgICBidWJibGVzOiB0cnVlLFxcbiAgICBrZXk6IFxcXCJFbnRlclxcXCIsXFxuICAgIGtleUNvZGU6IDEzLFxcbiAgICB3aGljaDogMTNcXG4gIH0pO1xcbiAgdGV4dGFyZWEuZGlzcGF0Y2hFdmVudChlbnRlckV2ZW50KTtcXG59XFxuZnVuY3Rpb24gc2ltdWxhdGVUeXBpbmcoZWxlbWVudCwgdGV4dCkge1xcbiAgdmFyIHdvcmRzID0gdGV4dC5zcGxpdChcXFwiIFxcXCIpOyAvLyBTcGxpdCB0aGUgdGV4dCBpbnRvIHdvcmRzIChtYXkgbm90IGJlIGlkZWFsIGZvciBhbGwgbGFuZ3VhZ2VzKVxcbiAgdmFyIGkgPSAwO1xcbiAgZnVuY3Rpb24gdHlwZVdvcmQoKSB7XFxuICAgIGlmIChpIDwgd29yZHMubGVuZ3RoKSB7XFxuICAgICAgLy8gQXBwZW5kIHRoZSBuZXh0IHdvcmQgYW5kIGEgc3BhY2UsIHRoZW4gaW5jcmVtZW50IGlcXG4gICAgICBzZXROYXRpdmVWYWx1ZShlbGVtZW50LCBlbGVtZW50LnZhbHVlICsgd29yZHNbaSsrXSArIFxcXCIgXFxcIik7XFxuICAgICAgLy8gQ2FsbCB0aGlzIGZ1bmN0aW9uIGFnYWluIGJlZm9yZSB0aGUgbmV4dCByZXBhaW50XFxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHR5cGVXb3JkKTtcXG4gICAgfSBlbHNlIHtcXG4gICAgICAvLyBDaGVjayBpZiBhdXRvc3VibWl0IGlzIGVuYWJsZWRcXG4gICAgICB2YXIgdGFsa0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxcXCJzYXlwaS10YWxrQnV0dG9uXFxcIik7XFxuICAgICAgaWYgKHRhbGtCdXR0b24uZGF0YXNldC5hdXRvc3VibWl0ID09PSBcXFwiZmFsc2VcXFwiKSB7XFxuICAgICAgICBjb25zb2xlLmxvZyhcXFwiQXV0b3N1Ym1pdCBpcyBkaXNhYmxlZFxcXCIpO1xcbiAgICAgIH0gZWxzZSB7XFxuICAgICAgICAvLyBTaW11bGF0ZSBhbiBcXFwiRW50ZXJcXFwiIGtleXByZXNzIGV2ZW50XFxuICAgICAgICBzaW11bGF0ZUZvcm1TdWJtaXQoZWxlbWVudCk7XFxuICAgICAgfVxcbiAgICB9XFxuICB9XFxuICAvLyBTdGFydCB0eXBpbmdcXG4gIHR5cGVXb3JkKCk7XFxufVxcblxcbi8vIERlY2xhcmUgYSBnbG9iYWwgdmFyaWFibGUgZm9yIHRoZSBtZWRpYVJlY29yZGVyXFxudmFyIG1lZGlhUmVjb3JkZXI7XFxudmFyIHRocmVzaG9sZCA9IDEwMDA7IC8vIDEwMDAgbXMgPSAxIHNlY29uZCwgYWJvdXQgdGhlIGxlbmd0aCBvZiBcXFwiSGV5LCBQaVxcXCJcXG5cXG4vLyBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlICdkYXRhYXZhaWxhYmxlJyBldmVudCBmaXJlc1xcbmZ1bmN0aW9uIGhhbmRsZURhdGFBdmFpbGFibGUoZSkge1xcbiAgLy8gQWRkIHRoZSBhdWRpbyBkYXRhIGNodW5rIHRvIHRoZSBhcnJheVxcbiAgYXVkaW9EYXRhQ2h1bmtzLnB1c2goZS5kYXRhKTtcXG59XFxuXFxuLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSAnc3RvcCcgZXZlbnQgZmlyZXNcXG5mdW5jdGlvbiBoYW5kbGVTdG9wKCkge1xcbiAgLy8gQ3JlYXRlIGEgQmxvYiBmcm9tIHRoZSBhdWRpbyBkYXRhIGNodW5rc1xcbiAgdmFyIGF1ZGlvQmxvYiA9IG5ldyBCbG9iKGF1ZGlvRGF0YUNodW5rcywge1xcbiAgICB0eXBlOiBhdWRpb01pbWVUeXBlXFxuICB9KTtcXG5cXG4gIC8vIEdldCB0aGUgc3RvcCB0aW1lIGFuZCBjYWxjdWxhdGUgdGhlIGR1cmF0aW9uXFxuICB2YXIgc3RvcFRpbWUgPSBEYXRlLm5vdygpO1xcbiAgdmFyIGR1cmF0aW9uID0gc3RvcFRpbWUgLSB3aW5kb3cuc3RhcnRUaW1lO1xcblxcbiAgLy8gSWYgdGhlIGR1cmF0aW9uIGlzIGdyZWF0ZXIgdGhhbiB0aGUgdGhyZXNob2xkLCB1cGxvYWQgdGhlIGF1ZGlvIGZvciB0cmFuc2NyaXB0aW9uXFxuICBpZiAoZHVyYXRpb24gPj0gdGhyZXNob2xkKSB7XFxuICAgIC8vIGRvd25sb2FkIHRoZSBhdWRpb1xcbiAgICB2YXIgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChhdWRpb0Jsb2IpO1xcbiAgICB2YXIgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXFxcImFcXFwiKTtcXG4gICAgYS5zdHlsZS5kaXNwbGF5ID0gXFxcIm5vbmVcXFwiO1xcbiAgICBhLmhyZWYgPSB1cmw7XFxuICAgIGEuZG93bmxvYWQgPSBcXFwic2FmYXJpX2F1ZGlvLm1wNFxcXCI7XFxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYSk7XFxuICAgIC8vIGEuY2xpY2soKTtcXG4gICAgLy8gVXBsb2FkIHRoZSBhdWRpbyB0byB0aGUgc2VydmVyIGZvciB0cmFuc2NyaXB0aW9uXFxuICAgIHVwbG9hZEF1ZGlvKGF1ZGlvQmxvYik7XFxuICB9XFxuXFxuICAvLyBDbGVhciB0aGUgYXJyYXkgZm9yIHRoZSBuZXh0IHJlY29yZGluZ1xcbiAgYXVkaW9EYXRhQ2h1bmtzID0gW107XFxufVxcbmZ1bmN0aW9uIHNldHVwUmVjb3JkaW5nKGNhbGxiYWNrKSB7XFxuICBpZiAobWVkaWFSZWNvcmRlcikge1xcbiAgICByZXR1cm47XFxuICB9XFxuXFxuICAvLyBHZXQgYSBzdHJlYW0gZnJvbSB0aGUgdXNlcidzIG1pY3JvcGhvbmVcXG4gIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKHtcXG4gICAgYXVkaW86IHRydWVcXG4gIH0pLnRoZW4oZnVuY3Rpb24gKHN0cmVhbSkge1xcbiAgICBpZiAoIU1lZGlhUmVjb3JkZXIuaXNUeXBlU3VwcG9ydGVkKGF1ZGlvTWltZVR5cGUpKSB7XFxuICAgICAgLy8gdXNlIE1QNCBmb3IgU2FmYXJpXFxuICAgICAgYXVkaW9NaW1lVHlwZSA9IFxcXCJhdWRpby9tcDRcXFwiO1xcbiAgICB9XFxuICAgIC8vIENyZWF0ZSBhIG5ldyBNZWRpYVJlY29yZGVyIG9iamVjdCB1c2luZyB0aGUgc3RyZWFtIGFuZCBzcGVjaWZ5aW5nIHRoZSBNSU1FIHR5cGVcXG4gICAgdmFyIG9wdGlvbnMgPSB7XFxuICAgICAgbWltZVR5cGU6IGF1ZGlvTWltZVR5cGVcXG4gICAgfTtcXG4gICAgbWVkaWFSZWNvcmRlciA9IG5ldyBNZWRpYVJlY29yZGVyKHN0cmVhbSwgb3B0aW9ucyk7XFxuXFxuICAgIC8vIExpc3RlbiBmb3IgdGhlICdkYXRhYXZhaWxhYmxlJyBldmVudFxcbiAgICBtZWRpYVJlY29yZGVyLmFkZEV2ZW50TGlzdGVuZXIoXFxcImRhdGFhdmFpbGFibGVcXFwiLCBoYW5kbGVEYXRhQXZhaWxhYmxlKTtcXG5cXG4gICAgLy8gTGlzdGVuIGZvciB0aGUgJ3N0b3AnIGV2ZW50XFxuICAgIG1lZGlhUmVjb3JkZXIuYWRkRXZlbnRMaXN0ZW5lcihcXFwic3RvcFxcXCIsIGhhbmRsZVN0b3ApO1xcbiAgfSkudGhlbihmdW5jdGlvbiAoKSB7XFxuICAgIC8vIEludm9rZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cXG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXFxcImZ1bmN0aW9uXFxcIikge1xcbiAgICAgIGNhbGxiYWNrKCk7XFxuICAgIH1cXG4gIH0pW1xcXCJjYXRjaFxcXCJdKGZ1bmN0aW9uIChlcnIpIHtcXG4gICAgY29uc29sZS5lcnJvcihcXFwiRXJyb3IgZ2V0dGluZyBhdWRpbyBzdHJlYW06IFxcXCIgKyBlcnIpO1xcbiAgfSk7XFxufVxcbmZ1bmN0aW9uIHRlYXJEb3duUmVjb3JkaW5nKCkge1xcbiAgLy8gQ2hlY2sgaWYgdGhlIE1lZGlhUmVjb3JkZXIgaXMgc2V0IHVwXFxuICBpZiAoIW1lZGlhUmVjb3JkZXIpIHtcXG4gICAgcmV0dXJuO1xcbiAgfVxcblxcbiAgLy8gU3RvcCBhbnkgb25nb2luZyByZWNvcmRpbmdcXG4gIGlmIChtZWRpYVJlY29yZGVyLnN0YXRlID09PSBcXFwicmVjb3JkaW5nXFxcIikge1xcbiAgICBtZWRpYVJlY29yZGVyLnN0b3AoKTtcXG4gIH1cXG5cXG4gIC8vIFJlbW92ZSB0aGUgTWVkaWFSZWNvcmRlcidzIGV2ZW50IGxpc3RlbmVyc1xcbiAgbWVkaWFSZWNvcmRlci5yZW1vdmVFdmVudExpc3RlbmVyKFxcXCJkYXRhYXZhaWxhYmxlXFxcIiwgaGFuZGxlRGF0YUF2YWlsYWJsZSk7XFxuICBtZWRpYVJlY29yZGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoXFxcInN0b3BcXFwiLCBoYW5kbGVTdG9wKTtcXG5cXG4gIC8vIENsZWFyIHRoZSBNZWRpYVJlY29yZGVyIHZhcmlhYmxlXFxuICBtZWRpYVJlY29yZGVyID0gbnVsbDtcXG59XFxuXFxuLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSB1c2VyIHByZXNzZXMgdGhlIHJlY29yZCBidXR0b25cXG5mdW5jdGlvbiBzdGFydFJlY29yZGluZygpIHtcXG4gIC8vIENoZWNrIGlmIHRoZSBNZWRpYVJlY29yZGVyIGlzIHNldCB1cFxcbiAgaWYgKCFtZWRpYVJlY29yZGVyKSB7XFxuICAgIHNldHVwUmVjb3JkaW5nKHN0YXJ0UmVjb3JkaW5nKTtcXG4gICAgcmV0dXJuO1xcbiAgfVxcbiAgLy8gQ2hlY2sgaWYgUGkgaXMgY3VycmVudGx5IHNwZWFraW5nIGFuZCBzdG9wIGhlciBhdWRpb1xcbiAgaWYgKHBpQXVkaW9NYW5hZ2VyLmlzU3BlYWtpbmcpIHtcXG4gICAgcGlBdWRpb01hbmFnZXIucGF1c2UoKTtcXG4gIH1cXG5cXG4gIC8vIFN0YXJ0IHJlY29yZGluZ1xcbiAgbWVkaWFSZWNvcmRlci5zdGFydCgpO1xcblxcbiAgLy8gUmVjb3JkIHRoZSBzdGFydCB0aW1lXFxuICB3aW5kb3cuc3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcXG4gIGNvbnNvbGUubG9nKFxcXCJVc2VyIGlzIHNwZWFraW5nXFxcIik7XFxuXFxuICAvLyBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlIHVzZXIgcmVsZWFzZXMgdGhlIHJlY29yZCBidXR0b25cXG4gIHdpbmRvdy5zdG9wUmVjb3JkaW5nID0gZnVuY3Rpb24gKCkge1xcbiAgICBpZiAobWVkaWFSZWNvcmRlciAmJiBtZWRpYVJlY29yZGVyLnN0YXRlID09PSBcXFwicmVjb3JkaW5nXFxcIikge1xcbiAgICAgIC8vIFN0b3AgcmVjb3JkaW5nXFxuICAgICAgbWVkaWFSZWNvcmRlci5zdG9wKCk7XFxuXFxuICAgICAgLy8gUmVjb3JkIHRoZSBzdG9wIHRpbWUgYW5kIGNhbGN1bGF0ZSB0aGUgZHVyYXRpb25cXG4gICAgICB2YXIgc3RvcFRpbWUgPSBEYXRlLm5vdygpO1xcbiAgICAgIHZhciBkdXJhdGlvbiA9IHN0b3BUaW1lIC0gd2luZG93LnN0YXJ0VGltZTtcXG5cXG4gICAgICAvLyBJZiB0aGUgZHVyYXRpb24gaXMgbGVzcyB0aGFuIHRoZSB0aHJlc2hvbGQsIGRvbid0IHVwbG9hZCB0aGUgYXVkaW8gZm9yIHRyYW5zY3JpcHRpb25cXG4gICAgICBpZiAoZHVyYXRpb24gPCB0aHJlc2hvbGQpIHtcXG4gICAgICAgIGNvbnNvbGUubG9nKFxcXCJVc2VyIHN0b3BwZWQgc3BlYWtpbmdcXFwiKTtcXG4gICAgICAgIGNvbnNvbGUubG9nKFxcXCJSZWNvcmRpbmcgd2FzIHRvbyBzaG9ydCwgbm90IHVwbG9hZGluZyBmb3IgdHJhbnNjcmlwdGlvblxcXCIpO1xcbiAgICAgICAgcGlBdWRpb01hbmFnZXIucmVzdW1lKCk7XFxuICAgICAgfSBlbHNlIHtcXG4gICAgICAgIGNvbnNvbGUubG9nKFxcXCJVc2VyIGZpbmlzaGVkIHNwZWFraW5nXFxcIik7XFxuICAgICAgICBwaUF1ZGlvTWFuYWdlci5zdG9wKCk7XFxuICAgICAgfVxcbiAgICB9XFxuICAgIC8vIFJlbW92ZSB0aGUgc3RvcFJlY29yZGluZyBmdW5jdGlvblxcbiAgICBkZWxldGUgd2luZG93LnN0b3BSZWNvcmRpbmc7XFxuICB9O1xcbn1cXG5cXG4vLyBBZGQgdGhlIHN0YXJ0UmVjb3JkaW5nIGZ1bmN0aW9uIHRvIHRoZSB3aW5kb3cgb2JqZWN0IHNvIGl0IGNhbiBiZSBjYWxsZWQgZnJvbSBvdXRzaWRlIHRoaXMgc2NyaXB0XFxud2luZG93LnN0YXJ0UmVjb3JkaW5nID0gc3RhcnRSZWNvcmRpbmc7XCI7IiwiZXhwb3J0IGRlZmF1bHQgXCI8P3htbCB2ZXJzaW9uPVxcXCIxLjBcXFwiIGVuY29kaW5nPVxcXCJVVEYtOFxcXCI/PlxcbjxzdmcgaWQ9XFxcIkxheWVyXzFcXFwiIGRhdGEtbmFtZT1cXFwiTGF5ZXIgMVxcXCIgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMzA3IDY0MFxcXCI+XFxuICA8ZGVmcz5cXG4gICAgPHN0eWxlPlxcbiAgICAgIC5jbHMtMSB7XFxuICAgICAgICBmaWxsOiAjNDI4YTJmO1xcbiAgICAgIH1cXG5cXG4gICAgICAuY2xzLTEsIC5jbHMtMiwgLmNscy0zLCAuY2xzLTQsIC5jbHMtNSwgLmNscy02IHtcXG4gICAgICAgIHN0cm9rZS13aWR0aDogMHB4O1xcbiAgICAgIH1cXG5cXG4gICAgICAuY2xzLTIge1xcbiAgICAgICAgZmlsbDogI2NjZThiNTtcXG4gICAgICB9XFxuXFxuICAgICAgLmNscy0zIHtcXG4gICAgICAgIGZpbGw6ICNiM2RiOTU7XFxuICAgICAgfVxcblxcbiAgICAgIC5jbHMtNCB7XFxuICAgICAgICBmaWxsOiAjOWJkMDc4O1xcbiAgICAgIH1cXG5cXG4gICAgICAuY2xzLTUge1xcbiAgICAgICAgZmlsbDogIzgzYzU1YztcXG4gICAgICB9XFxuXFxuICAgICAgLmNscy02IHtcXG4gICAgICAgIGZpbGw6ICNlNGYyZDE7XFxuICAgICAgfVxcbiAgICA8L3N0eWxlPlxcbiAgPC9kZWZzPlxcbiAgPHBhdGggY2xhc3M9XFxcImNscy02XFxcIiBkPVxcXCJtMzA2LjksMzIwYzAsMTA1LjMtLjAyLDIxMC42LjEsMzE1LjkxLDAsMy40Mi0uNjcsNC4xLTQuMDksNC4wOS05OS42LS4xMi0xOTkuMjEtLjEyLTI5OC44MSwwQy42Nyw2NDAsMCw2MzkuMzMsMCw2MzUuOTEuMTEsNDI1LjMuMTEsMjE0LjcsMCw0LjA5LDAsLjY3LjY3LDAsNC4wOSwwLDEwMy43LjEyLDIwMy4zLjEyLDMwMi45MSwwYzMuNDIsMCw0LjEuNjcsNC4wOSw0LjA5LS4xMiwxMDUuMy0uMSwyMTAuNi0uMSwzMTUuOTFaXFxcIi8+XFxuICA8cGF0aCBjbGFzcz1cXFwiY2xzLTJcXFwiIGQ9XFxcIm0yNzUuOTIsMzIzYzAsODcuNjMsMCwxNzUuMjcsMCwyNjIuOSwwLDcuMjQtLjU1LDcuOTMtNy44Niw3Ljk4LTE0LjY2LjA5LTI5LjMxLjAzLTQzLjk3LjAzLTYwLjk2LDAtMTIxLjkyLDAtMTgyLjg4LDBxLTcuMTMsMC03LjE0LTcuMjRjMC0xNzYuMSwwLTM1Mi4yMSwwLTUyOC4zMXEwLTcuMjYsNy4xMi03LjI2Yzc1Ljc4LDAsMTUxLjU2LDAsMjI3LjM1LDBxNy4zOCwwLDcuMzgsNy41YzAsODguMTMsMCwxNzYuMjcsMCwyNjQuNFpcXFwiLz5cXG4gIDxwYXRoIGNsYXNzPVxcXCJjbHMtM1xcXCIgZD1cXFwibTY4LjA2LDMyMi4yNGMwLTY5LjQ3LDAtMTM4Ljk0LDAtMjA4LjQxLDAtOC45OSwxLjMzLTEwLjEzLDEwLjQ5LTkuMTIsMS45OC4yMiwzLjk4LjMyLDUuOTcuMzIsNDYuMTMuMDIsOTIuMjYuMDIsMTM4LjM5LDAsMy40OCwwLDYuOTItLjIzLDEwLjQxLS42Nyw1LjUtLjcsOC43NC40Niw4LjczLDcuMjUtLjE4LDEzOC45NC0uMTMsMjc3Ljg4LS4xMyw0MTYuODEsMCwuMzMsMCwuNjcsMCwxcS0uMTQsMTAuNTEtMTAuMzksMTAuNTFjLTUyLjEzLDAtMTA0LjI1LDAtMTU2LjM4LDBxLTcuMDksMC03LjA5LTcuMjhjMC03MC4xNCwwLTE0MC4yNywwLTIxMC40MVpcXFwiLz5cXG4gIDxwYXRoIGNsYXNzPVxcXCJjbHMtNFxcXCIgZD1cXFwibTEwMy4wMiwzMjIuNWMwLTUyLjQ2LDAtMTA0LjkxLDAtMTU3LjM3LDAtNi42OC4zNi03LjA2LDcuMDctNy4wNiwzMC4zLS4wMSw2MC42LjA3LDkwLjktLjA5LDQuNTQtLjAyLDYuMDgsMS4zMyw2LjA3LDUuOTgtLjEsMTA1LjU4LS4xLDIxMS4xNiwwLDMxNi43NCwwLDQuMTgtMS4yNyw1LjM3LTUuMzgsNS4zNS0yOS4zLS4xNS01OC42LS4wOC04Ny45LS4wOHEtMTAuNzYsMC0xMC43Ni0xMS4wOWMwLTUwLjc5LDAtMTAxLjU4LDAtMTUyLjM3WlxcXCIvPlxcbiAgPHBhdGggY2xhc3M9XFxcImNscy01XFxcIiBkPVxcXCJtMTczLDMyMi4yYzAsMzUuMjksMCw3MC41OCwwLDEwNS44OHEwLDYuODktNi45OSw2LjljLTguMTUsMC0xNi4zMS0uMTMtMjQuNDYuMDYtMy40Ny4wOC00LjY4LTEuMDktNC42MS00LjU5LjE4LTkuNjUuMDYtMTkuMzEuMDYtMjguOTYsMC01OC4yNi0uMDEtMTE2LjUzLjAyLTE3NC43OSwwLTQuNzYtMS4xMi05LjQ2LS4xNC0xNC4zLjUxLTIuNTQsMS4zOS0zLjM4LDMuOC0zLjM2LDguODIuMDYsMTcuNjQuMTQsMjYuNDYtLjAyLDQuNTktLjA5LDUuOTUsMS44NSw1Ljk0LDYuMzMtLjE0LDM1LjYyLS4wOCw3MS4yNS0uMDgsMTA2Ljg3WlxcXCIvPlxcbiAgPHBhdGggY2xhc3M9XFxcImNscy0xXFxcIiBkPVxcXCJtMTUxLjA0LDMyMi4wMWMwLTkuOTkuMDctMTkuOTctLjA1LTI5Ljk2LS4wNC0yLjkzLjgzLTQuMTgsMy45NS00LjE4LDMuMDYsMCw0LjAzLDEuMTIsNC4wMiw0LjExLS4wOSwxOS45Ny0uMDgsMzkuOTQuMDEsNTkuOTEuMDEsMi45Ni0uODQsNC4xNi0zLjk2LDQuMTQtMy4wMy0uMDEtNC4wOC0xLjA0LTQuMDMtNC4wOC4xNC05Ljk4LjA1LTE5Ljk3LjA1LTI5Ljk2WlxcXCIvPlxcbjwvc3ZnPlwiOyIsImV4cG9ydCBkZWZhdWx0IFwiPHN2ZyB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIHZlcnNpb249XFxcIjEuMFxcXCIgdmlld0JveD1cXFwiMCAwIDU2LjI1IDMwXFxcIiBjbGFzcz1cXFwid2F2ZWZvcm1cXFwiPlxcbiAgICA8ZGVmcz5cXG4gICAgICAgIDxjbGlwUGF0aCBpZD1cXFwiYVxcXCI+XFxuICAgICAgICAgICAgPHBhdGggZD1cXFwiTS41NCAxMkgzdjVILjU0Wm0wIDBcXFwiLz5cXG4gICAgICAgIDwvY2xpcFBhdGg+XFxuICAgICAgICA8Y2xpcFBhdGggaWQ9XFxcImJcXFwiPlxcbiAgICAgICAgICAgIDxwYXRoIGQ9XFxcIk0yNSAyLjJoMnYyNC42OGgtMlptMCAwXFxcIi8+XFxuICAgICAgICA8L2NsaXBQYXRoPlxcbiAgICAgICAgPGNsaXBQYXRoIGlkPVxcXCJjXFxcIj5cXG4gICAgICAgICAgICA8cGF0aCBkPVxcXCJNNTMgMTJoMS45OHY1SDUzWm0wIDBcXFwiLz5cXG4gICAgICAgIDwvY2xpcFBhdGg+XFxuICAgIDwvZGVmcz5cXG4gICAgPGcgY2xpcC1wYXRoPVxcXCJ1cmwoI2EpXFxcIj5cXG4gICAgICAgIDxwYXRoIGQ9XFxcIk0xLjQ4IDEyLjcxYy0uNSAwLS45LjQtLjkuOXYxLjg1YS45LjkgMCAwIDAgMS44IDB2LTEuODRjMC0uNS0uNC0uOS0uOS0uOVptMCAwXFxcIi8+XFxuICAgIDwvZz5cXG4gICAgPHBhdGggZD1cXFwiTTQuOTggNi42M2MtLjUgMC0uOS40LS45Ljl2MTQuMDFhLjkuOSAwIDAgMCAxLjgxIDB2LTE0YzAtLjUtLjQtLjkyLS45LS45MlptMy41MSAzLjFhLjkuOSAwIDAgMC0uOS45MXY3Ljc5YS45LjkgMCAwIDAgMS44IDB2LTcuNzljMC0uNS0uNC0uOS0uOS0uOVpNMTIgMy44M2EuOS45IDAgMCAwLS45MS45djE5LjZhLjkuOSAwIDAgMCAxLjggMFY0Ljc0YzAtLjUtLjQtLjktLjktLjlabTMuNSA4LjI5YS45LjkgMCAwIDAtLjkxLjl2My4wM2EuOS45IDAgMCAwIDEuODEgMHYtMy4wM2MwLS41LS40LS45LS45LS45Wk0xOSA2LjhjLS41IDAtLjkuNC0uOS45djEzLjY4YS45LjkgMCAwIDAgMS44IDBWNy43YzAtLjUtLjQtLjktLjktLjlabTMuNTgtMi45N2gtLjAxYy0uNSAwLS45LjQtLjkuOWwtLjEzIDE5LjZjMCAuNS40LjkuOS45MS41IDAgLjktLjQuOS0uOWwuMTQtMTkuNmEuOS45IDAgMCAwLS45LS45Wm0wIDBcXFwiLz5cXG4gICAgPGcgY2xpcC1wYXRoPVxcXCJ1cmwoI2IpXFxcIj5cXG4gICAgICAgIDxwYXRoIGQ9XFxcIk0yNiAyLjJjLS41IDAtLjkuNC0uOS45djIyLjg2YS45LjkgMCAxIDAgMS44MSAwVjMuMTFhLjkuOSAwIDAgMC0uOS0uOTFabTAgMFxcXCIvPlxcbiAgICA8L2c+XFxuICAgIDxwYXRoIGQ9XFxcIk0yOS41MiA3LjcxYS45LjkgMCAwIDAtLjkxLjl2MTEuODVhLjkuOSAwIDAgMCAxLjgxIDBWOC42MmMwLS41LS40LS45LS45LS45Wm0zLjUgMi45M2EuOS45IDAgMCAwLS45LjkxdjUuOTdhLjkuOSAwIDAgMCAxLjggMHYtNS45N2MwLS41LS40LS45LS45LS45Wm0zLjUtNS43OGMtLjUgMC0uOS40LS45Ljl2MTcuNTVhLjkuOSAwIDAgMCAxLjgxIDBWNS43NmMwLS41LS40LS45LS45LS45Wm0zLjUxIDMuMzRjLS41IDAtLjkuNC0uOS45djEwLjg3YS45LjkgMCAwIDAgMS44IDBWOS4xYS45LjkgMCAwIDAtLjktLjkxWm0zLjUgMy4wOGMtLjUgMC0uOS40LS45LjkxdjQuN2EuOS45IDAgMSAwIDEuOCAwdi00LjdhLjkuOSAwIDAgMC0uOS0uOVptMy41MS03LjQ1YS45LjkgMCAwIDAtLjkxLjl2MTkuNmEuOS45IDAgMCAwIDEuODEgMFY0Ljc0YzAtLjUtLjQtLjktLjktLjlabTMuNSA1LjU3YS45LjkgMCAwIDAtLjkuOTF2OC40NWEuOS45IDAgMCAwIDEuOCAwdi04LjQ1YzAtLjUtLjQtLjktLjktLjlabTAgMFxcXCIvPlxcbiAgICA8ZyBjbGlwLXBhdGg9XFxcInVybCgjYylcXFwiPlxcbiAgICAgICAgPHBhdGggZD1cXFwiTTU0LjA0IDEyLjk2YS45LjkgMCAwIDAtLjkuOTF2MS4zM2EuOS45IDAgMSAwIDEuOCAwdi0xLjMyYS45LjkgMCAwIDAtLjktLjkyWm0wIDBcXFwiLz5cXG4gICAgPC9nPlxcbjwvc3ZnPlwiOyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9tb2JpbGUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9tb2JpbGUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3JlY3RhbmdsZXMuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9yZWN0YW5nbGVzLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi90YWxrQnV0dG9uLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vdGFsa0J1dHRvbi5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImltcG9ydCBcIi4vdGFsa0J1dHRvbi5jc3NcIjtcbmltcG9ydCBcIi4vbW9iaWxlLmNzc1wiO1xuaW1wb3J0IFwiLi9yZWN0YW5nbGVzLmNzc1wiO1xuaW1wb3J0IHRhbGtJY29uU1ZHIGZyb20gXCIuL3dhdmVmb3JtLnN2Z1wiO1xuaW1wb3J0IHJlY3RhbmdsZXNTVkcgZnJvbSBcIi4vcmVjdGFuZ2xlcy5zdmdcIjtcbihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIGNvbnN0IGxvY2FsQ29uZmlnID0ge1xuICAgIGFwcFNlcnZlclVybDogXCJodHRwOi8vbG9jYWxob3N0OjMwMDBcIixcbiAgICBhcGlTZXJ2ZXJVcmw6IFwiaHR0cHM6Ly9sb2NhbGhvc3Q6NTAwMFwiLFxuICAgIC8vIEFkZCBvdGhlciBjb25maWd1cmF0aW9uIHByb3BlcnRpZXMgYXMgbmVlZGVkXG4gIH07XG5cbiAgLy8gRGVmaW5lIGEgZ2xvYmFsIGNvbmZpZ3VyYXRpb24gcHJvcGVydHlcbiAgY29uc3QgcHJvZHVjdGlvbkNvbmZpZyA9IHtcbiAgICBhcHBTZXJ2ZXJVcmw6IFwiaHR0cHM6Ly9hcHAuc2F5cGkuYWlcIixcbiAgICBhcGlTZXJ2ZXJVcmw6IFwiaHR0cHM6Ly9hcGkuc2F5cGkuYWlcIixcbiAgICAvLyBBZGQgb3RoZXIgY29uZmlndXJhdGlvbiBwcm9wZXJ0aWVzIGFzIG5lZWRlZFxuICB9O1xuICBjb25zdCBjb25maWcgPSBwcm9kdWN0aW9uQ29uZmlnO1xuXG4gIGNvbnN0IHBhZ2VTY3JpcHQgPSByZXF1aXJlKFwicmF3LWxvYWRlciEuL3RyYW5zY3JpYmVyLmpzXCIpLmRlZmF1bHQ7XG5cbiAgLy8gQ3JlYXRlIGEgTXV0YXRpb25PYnNlcnZlciB0byBsaXN0ZW4gZm9yIGNoYW5nZXMgdG8gdGhlIERPTVxuICB2YXIgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAobXV0YXRpb25zKSB7XG4gICAgLy8gQ2hlY2sgZWFjaCBtdXRhdGlvblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbXV0YXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbXV0YXRpb24gPSBtdXRhdGlvbnNbaV07XG5cbiAgICAgIC8vIElmIG5vZGVzIHdlcmUgYWRkZWQsIGNoZWNrIGVhY2ggb25lXG4gICAgICBpZiAobXV0YXRpb24uYWRkZWROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbXV0YXRpb24uYWRkZWROb2Rlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgIHZhciBub2RlID0gbXV0YXRpb24uYWRkZWROb2Rlc1tqXTtcblxuICAgICAgICAgIC8vIElmIHRoZSBub2RlIGlzIHRoZSBhcHByb3ByaWF0ZSBjb250YWluZXIgZWxlbWVudCwgYWRkIHRoZSBidXR0b24gYW5kIHN0b3Agb2JzZXJ2aW5nXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgbm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImRpdlwiICYmXG4gICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5jb250YWlucyhcImZpeGVkXCIpICYmXG4gICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5jb250YWlucyhcImJvdHRvbS0xNlwiKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgdmFyIGZvb3RlciA9IG5vZGU7XG4gICAgICAgICAgICB2YXIgYnV0dG9uQ29udGFpbmVyID0gZm9vdGVyLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgICAgIFwiLnJlbGF0aXZlLmZsZXguZmxleC1jb2xcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChidXR0b25Db250YWluZXIpIHtcbiAgICAgICAgICAgICAgYWRkVGFsa0J1dHRvbihidXR0b25Db250YWluZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiTm8gYnV0dG9uIGNvbnRhaW5lciBmb3VuZCBpbiBmb290ZXJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWlkZW50aWZ5Rm9vdGVyKCkpIHtcbiAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiRm9vdGVyIG5vdCBmb3VuZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBmdW5jdGlvbiBpZGVudGlmeUZvb3RlcigpIHtcbiAgICAvLyBGaW5kIGFsbCBhdWRpbyBlbGVtZW50cyBvbiB0aGUgcGFnZVxuICAgIHZhciBhdWRpb0VsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImF1ZGlvXCIpO1xuICAgIHZhciBmb3VuZCA9IGZhbHNlOyAvLyBkZWZhdWx0IHRvIG5vdCBmb3VuZFxuXG4gICAgYXVkaW9FbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChhdWRpbykge1xuICAgICAgdmFyIHByZWNlZGluZ0RpdiA9IGF1ZGlvLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG5cbiAgICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZm91bmQgYSBkaXYsIHdlIGNhbiBza2lwIGZ1cnRoZXIgaXRlcmF0aW9uc1xuICAgICAgaWYgKGZvdW5kKSByZXR1cm47XG5cbiAgICAgIC8vIENoZWNrIGlmIHRoZSBwcmVjZWRpbmcgZWxlbWVudCBpcyBhIGRpdlxuICAgICAgaWYgKHByZWNlZGluZ0RpdiAmJiBwcmVjZWRpbmdEaXYudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImRpdlwiKSB7XG4gICAgICAgIC8vIEFzc2lnbiBhbiBJRCB0byB0aGUgZGl2XG4gICAgICAgIHByZWNlZGluZ0Rpdi5pZCA9IFwic2F5cGktZm9vdGVyXCI7XG4gICAgICAgIGZvdW5kID0gdHJ1ZTsgLy8gc2V0IHRvIGZvdW5kXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZm91bmQ7XG4gIH1cblxuICBmdW5jdGlvbiBpbmplY3RTY3JpcHQoY2FsbGJhY2spIHtcbiAgICB2YXIgc2NyaXB0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgc2NyaXB0RWxlbWVudC50eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIjtcbiAgICBzY3JpcHRFbGVtZW50LmlkID0gXCJzYXlwaS1zY3JpcHRcIjtcbiAgICBjb25zdCBjb25maWdUZXh0ID0gXCJ2YXIgY29uZmlnID0gXCIgKyBKU09OLnN0cmluZ2lmeShjb25maWcpICsgXCI7XCI7XG4gICAgc2NyaXB0RWxlbWVudC50ZXh0Q29udGVudCA9IGNvbmZpZ1RleHQgKyBwYWdlU2NyaXB0O1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0RWxlbWVudCk7XG5cbiAgICAvLyBDYWxsIHRoZSBjYWxsYmFjayBmdW5jdGlvbiBhZnRlciB0aGUgc2NyaXB0IGlzIGFkZGVkXG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGlzTW9iaWxlVmlldygpIHtcbiAgICByZXR1cm4gd2luZG93Lm1hdGNoTWVkaWEoXCIobWF4LXdpZHRoOiA3NjhweClcIikubWF0Y2hlcztcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFRhbGtCdXR0b24oY29udGFpbmVyKSB7XG4gICAgLy8gY3JlYXRlIGEgY29udGFpbmluZyBkaXZcbiAgICB2YXIgcGFuZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHBhbmVsLmlkID0gXCJzYXlwaS1wYW5lbFwiO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChwYW5lbCk7XG5cbiAgICB2YXIgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICBidXR0b24uaWQgPSBcInNheXBpLXRhbGtCdXR0b25cIjtcbiAgICBidXR0b24udHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgYnV0dG9uLmNsYXNzTmFtZSA9XG4gICAgICBcInJlbGF0aXZlIGZsZXggbXQtMSBtYi0xIHJvdW5kZWQtZnVsbCBweC0yIHB5LTMgdGV4dC1jZW50ZXIgYmctY3JlYW0tNTUwIGhvdmVyOmJnLWNyZWFtLTY1MCBob3Zlcjp0ZXh0LWJyYW5kLWdyZWVuLTcwMCB0ZXh0LW11dGVkXCI7XG4gICAgLy8gU2V0IEFSSUEgbGFiZWwgYW5kIHRvb2x0aXBcbiAgICBjb25zdCBsYWJlbCA9XG4gICAgICBcIlRhbGsgKEhvbGQgQ29udHJvbCArIFNwYWNlIHRvIHVzZSBob3RrZXkuIERvdWJsZSBjbGljayB0byB0b2dnbGUgYXV0by1zdWJtaXQgb24vb2ZmKVwiO1xuICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIGxhYmVsKTtcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKFwidGl0bGVcIiwgbGFiZWwpO1xuICAgIC8vIGVuYWJsZSBhdXRvc3VibWl0IGJ5IGRlZmF1bHRcbiAgICBidXR0b24uZGF0YXNldC5hdXRvc3VibWl0ID0gXCJ0cnVlXCI7XG4gICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJhdXRvU3VibWl0XCIpO1xuICAgIHBhbmVsLmFwcGVuZENoaWxkKGJ1dHRvbik7XG4gICAgYWRkVGFsa0J1dHRvblN0eWxlcygpO1xuICAgIGFkZFRhbGtJY29uKGJ1dHRvbik7XG5cbiAgICAvLyBDYWxsIHRoZSBmdW5jdGlvbiB0byBpbmplY3QgdGhlIHNjcmlwdCBhZnRlciB0aGUgYnV0dG9uIGhhcyBiZWVuIGFkZGVkXG4gICAgaW5qZWN0U2NyaXB0KHJlZ2lzdGVyQXVkaW9CdXR0b25FdmVudHMpO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkVGFsa0ljb24oYnV0dG9uKSB7XG4gICAgdXBkYXRlSWNvbkNvbnRlbnQoYnV0dG9uKTtcblxuICAgIHdpbmRvdy5tYXRjaE1lZGlhKFwiKG1heC13aWR0aDogNzY4cHgpXCIpLmFkZExpc3RlbmVyKCgpID0+IHtcbiAgICAgIHVwZGF0ZUljb25Db250ZW50KGJ1dHRvbik7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVJY29uQ29udGVudChpY29uQ29udGFpbmVyKSB7XG4gICAgaWYgKGlzTW9iaWxlVmlldygpKSB7XG4gICAgICBpY29uQ29udGFpbmVyLmlubmVySFRNTCA9IHJlY3RhbmdsZXNTVkc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGljb25Db250YWluZXIuaW5uZXJIVE1MID0gdGFsa0ljb25TVkc7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYWRkU3R5bGVzKGNzcykge1xuICAgIGNvbnN0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICAgIHN0eWxlLnR5cGUgPSBcInRleHQvY3NzXCI7XG4gICAgc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRUYWxrQnV0dG9uU3R5bGVzKCkge1xuICAgIHZhciBpc0ZpcmVmb3hBbmRyb2lkID1cbiAgICAgIC9GaXJlZm94Ly50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpICYmXG4gICAgICAvQW5kcm9pZC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICBpZiAoaXNGaXJlZm94QW5kcm9pZCkge1xuICAgICAgLy8gaGFjayBmb3IgRmlyZWZveCBvbiBBbmRyb2lkLCB3aGljaCBkb2Vzbid0IHN1cHBvcnQgOmFjdGl2ZSBjb3JyZWN0bHlcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZmlyZWZveC1hbmRyb2lkXCIpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlZ2lzdGVyQXVkaW9CdXR0b25FdmVudHMoKSB7XG4gICAgdmFyIGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F5cGktdGFsa0J1dHRvblwiKTtcbiAgICB2YXIgY29udGV4dCA9IHdpbmRvdztcbiAgICBpZiAoR01faW5mby5zY3JpcHRIYW5kbGVyICE9PSBcIlVzZXJzY3JpcHRzXCIpIHtcbiAgICAgIGNvbnRleHQgPSB1bnNhZmVXaW5kb3c7XG4gICAgfVxuXG4gICAgLy8gRm9yIGRlc2t0b3BcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpZFByb21wdFRleHRBcmVhKCk7XG4gICAgICBjb250ZXh0LnN0YXJ0UmVjb3JkaW5nKCk7XG4gICAgfSk7XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0eXBlb2YgY29udGV4dD8uc3RvcFJlY29yZGluZyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGNvbnRleHQuc3RvcFJlY29yZGluZygpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmVnaXN0ZXJIb3RrZXkoKTtcblxuICAgIC8vIFwid2FybSB1cFwiIHRoZSBtaWNyb3Bob25lIGJ5IGFjcXVpcmluZyBpdCBiZWZvcmUgdGhlIHVzZXIgcHJlc3NlcyB0aGUgYnV0dG9uXG4gICAgZG9jdW1lbnRcbiAgICAgIC5nZXRFbGVtZW50QnlJZChcInNheXBpLXRhbGtCdXR0b25cIilcbiAgICAgIC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCBzZXR1cFJlY29yZGluZyk7XG4gICAgZG9jdW1lbnRcbiAgICAgIC5nZXRFbGVtZW50QnlJZChcInNheXBpLXRhbGtCdXR0b25cIilcbiAgICAgIC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCB0ZWFyRG93blJlY29yZGluZyk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJiZWZvcmV1bmxvYWRcIiwgdGVhckRvd25SZWNvcmRpbmcpO1xuXG4gICAgLy8gQXR0YWNoIGEgZG91YmxlIGNsaWNrIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSB0YWxrIGJ1dHRvblxuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiZGJsY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgLy8gVG9nZ2xlIHRoZSBDU1MgY2xhc3NlcyB0byBpbmRpY2F0ZSB0aGUgbW9kZVxuICAgICAgYnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoXCJhdXRvU3VibWl0XCIpO1xuXG4gICAgICAvLyBTdG9yZSB0aGUgc3RhdGUgb24gdGhlIGJ1dHRvbiBlbGVtZW50IHVzaW5nIGEgY3VzdG9tIGRhdGEgYXR0cmlidXRlXG4gICAgICBpZiAoYnV0dG9uLmdldEF0dHJpYnV0ZShcImRhdGEtYXV0b3N1Ym1pdFwiKSA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZShcImRhdGEtYXV0b3N1Ym1pdFwiLCBcImZhbHNlXCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhcImF1dG9zdWJtaXQgZGlzYWJsZWRcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBidXR0b24uc2V0QXR0cmlidXRlKFwiZGF0YS1hdXRvc3VibWl0XCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJhdXRvc3VibWl0IGVuYWJsZWRcIik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBGb3IgbW9iaWxlXG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7IC8vIFByZXZlbnQgdGhlIGRlZmF1bHQgY2xpY2sgYmVoYXZpb3IgZnJvbSBoYXBwZW5pbmdcbiAgICAgIGlkUHJvbXB0VGV4dEFyZWEoKTtcbiAgICAgIGNvbnRleHQuc3RhcnRSZWNvcmRpbmcoKTtcbiAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTsgLy8gQWRkIHRoZSBhY3RpdmUgY2xhc3MgKGZvciBGaXJlZm94IG9uIEFuZHJvaWQpXG4gICAgfSk7XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7IC8vIFJlbW92ZSB0aGUgYWN0aXZlIGNsYXNzIChmb3IgRmlyZWZveCBvbiBBbmRyb2lkXG4gICAgICBjb250ZXh0LnN0b3BSZWNvcmRpbmcoKTtcbiAgICB9KTtcbiAgICBkb2N1bWVudFxuICAgICAgLmdldEVsZW1lbnRCeUlkKFwic2F5cGktdGFsa0J1dHRvblwiKVxuICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGNhbmNlbFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTsgLy8gUmVtb3ZlIHRoZSBhY3RpdmUgY2xhc3MgKGZvciBGaXJlZm94IG9uIEFuZHJvaWRcbiAgICAgICAgdGVhckRvd25SZWNvcmRpbmcoKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVnaXN0ZXJIb3RrZXkoKSB7XG4gICAgLy8gUmVnaXN0ZXIgYSBob3RrZXkgZm9yIHRoZSBidXR0b25cbiAgICBsZXQgY3RybERvd24gPSBmYWxzZTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgaWYgKGV2ZW50LmN0cmxLZXkgJiYgZXZlbnQuY29kZSA9PT0gXCJTcGFjZVwiICYmICFjdHJsRG93bikge1xuICAgICAgICBjdHJsRG93biA9IHRydWU7XG4gICAgICAgIC8vIFNpbXVsYXRlIG1vdXNlZG93biBldmVudFxuICAgICAgICBsZXQgbW91c2VEb3duRXZlbnQgPSBuZXcgRXZlbnQoXCJtb3VzZWRvd25cIik7XG4gICAgICAgIGRvY3VtZW50XG4gICAgICAgICAgLmdldEVsZW1lbnRCeUlkKFwic2F5cGktdGFsa0J1dHRvblwiKVxuICAgICAgICAgIC5kaXNwYXRjaEV2ZW50KG1vdXNlRG93bkV2ZW50KTtcbiAgICAgICAgdGFsa0J1dHRvbi5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpOyAvLyBBZGQgdGhlIGFjdGl2ZSBjbGFzc1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgaWYgKGN0cmxEb3duICYmIGV2ZW50LmNvZGUgPT09IFwiU3BhY2VcIikge1xuICAgICAgICBjdHJsRG93biA9IGZhbHNlO1xuICAgICAgICAvLyBTaW11bGF0ZSBtb3VzZXVwIGV2ZW50XG4gICAgICAgIGxldCBtb3VzZVVwRXZlbnQgPSBuZXcgRXZlbnQoXCJtb3VzZXVwXCIpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNheXBpLXRhbGtCdXR0b25cIikuZGlzcGF0Y2hFdmVudChtb3VzZVVwRXZlbnQpO1xuICAgICAgICB0YWxrQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBpZFByb21wdFRleHRBcmVhKCkge1xuICAgIHZhciB0ZXh0YXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJvbXB0XCIpO1xuICAgIGlmICghdGV4dGFyZWEpIHtcbiAgICAgIC8vIEZpbmQgdGhlIGZpcnN0IDx0ZXh0YXJlYT4gZWxlbWVudCBhbmQgZ2l2ZSBpdCBhbiBpZFxuICAgICAgdmFyIHRleHRhcmVhRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ0ZXh0YXJlYVwiKTtcbiAgICAgIGlmICh0ZXh0YXJlYUVsZW1lbnQpIHtcbiAgICAgICAgdGV4dGFyZWFFbGVtZW50LmlkID0gXCJwcm9tcHRcIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTm8gPHRleHRhcmVhPiBlbGVtZW50IGZvdW5kXCIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFN0YXJ0IG9ic2VydmluZyB0aGUgZW50aXJlIGRvY3VtZW50IGZvciBjaGFuZ2VzIHRvIGNoaWxkIG5vZGVzIGFuZCBzdWJ0cmVlXG4gIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQsIHsgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH0pO1xufSkoKTtcbiJdLCJuYW1lcyI6WyJ0YWxrSWNvblNWRyIsInJlY3RhbmdsZXNTVkciLCJsb2NhbENvbmZpZyIsImFwcFNlcnZlclVybCIsImFwaVNlcnZlclVybCIsInByb2R1Y3Rpb25Db25maWciLCJjb25maWciLCJwYWdlU2NyaXB0IiwicmVxdWlyZSIsIm9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsIm11dGF0aW9ucyIsImkiLCJsZW5ndGgiLCJtdXRhdGlvbiIsImFkZGVkTm9kZXMiLCJqIiwibm9kZSIsIm5vZGVOYW1lIiwidG9Mb3dlckNhc2UiLCJjbGFzc0xpc3QiLCJjb250YWlucyIsImZvb3RlciIsImJ1dHRvbkNvbnRhaW5lciIsInF1ZXJ5U2VsZWN0b3IiLCJhZGRUYWxrQnV0dG9uIiwiY29uc29sZSIsIndhcm4iLCJpZGVudGlmeUZvb3RlciIsImRpc2Nvbm5lY3QiLCJhdWRpb0VsZW1lbnRzIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm91bmQiLCJmb3JFYWNoIiwiYXVkaW8iLCJwcmVjZWRpbmdEaXYiLCJwcmV2aW91c0VsZW1lbnRTaWJsaW5nIiwidGFnTmFtZSIsImlkIiwiaW5qZWN0U2NyaXB0IiwiY2FsbGJhY2siLCJzY3JpcHRFbGVtZW50IiwiY3JlYXRlRWxlbWVudCIsInR5cGUiLCJjb25maWdUZXh0IiwiSlNPTiIsInN0cmluZ2lmeSIsInRleHRDb250ZW50IiwiYm9keSIsImFwcGVuZENoaWxkIiwiaXNNb2JpbGVWaWV3Iiwid2luZG93IiwibWF0Y2hNZWRpYSIsIm1hdGNoZXMiLCJjb250YWluZXIiLCJwYW5lbCIsImJ1dHRvbiIsImNsYXNzTmFtZSIsImxhYmVsIiwic2V0QXR0cmlidXRlIiwiZGF0YXNldCIsImF1dG9zdWJtaXQiLCJhZGQiLCJhZGRUYWxrQnV0dG9uU3R5bGVzIiwiYWRkVGFsa0ljb24iLCJyZWdpc3RlckF1ZGlvQnV0dG9uRXZlbnRzIiwidXBkYXRlSWNvbkNvbnRlbnQiLCJhZGRMaXN0ZW5lciIsImljb25Db250YWluZXIiLCJpbm5lckhUTUwiLCJhZGRTdHlsZXMiLCJjc3MiLCJzdHlsZSIsImNyZWF0ZVRleHROb2RlIiwiaGVhZCIsImlzRmlyZWZveEFuZHJvaWQiLCJ0ZXN0IiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwiZG9jdW1lbnRFbGVtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJjb250ZXh0IiwiR01faW5mbyIsInNjcmlwdEhhbmRsZXIiLCJ1bnNhZmVXaW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwiaWRQcm9tcHRUZXh0QXJlYSIsInN0YXJ0UmVjb3JkaW5nIiwiX2NvbnRleHQiLCJzdG9wUmVjb3JkaW5nIiwicmVnaXN0ZXJIb3RrZXkiLCJzZXR1cFJlY29yZGluZyIsInRlYXJEb3duUmVjb3JkaW5nIiwidG9nZ2xlIiwiZ2V0QXR0cmlidXRlIiwibG9nIiwiZSIsInByZXZlbnREZWZhdWx0IiwicmVtb3ZlIiwiY3RybERvd24iLCJldmVudCIsImN0cmxLZXkiLCJjb2RlIiwibW91c2VEb3duRXZlbnQiLCJFdmVudCIsImRpc3BhdGNoRXZlbnQiLCJ0YWxrQnV0dG9uIiwibW91c2VVcEV2ZW50IiwidGV4dGFyZWEiLCJ0ZXh0YXJlYUVsZW1lbnQiLCJvYnNlcnZlIiwiY2hpbGRMaXN0Iiwic3VidHJlZSJdLCJzb3VyY2VSb290IjoiIn0=