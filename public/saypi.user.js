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
___CSS_LOADER_EXPORT___.push([module.id, `@keyframes pulse_outermost {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.92);
  }
}
.outermost {
  animation: pulse_outermost 5s infinite;
  transform-origin: center;
}

@keyframes pulse_second {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.856);
  }
}
.second {
  animation: pulse_second 5s infinite;
  transform-origin: center;
}

@keyframes pulse_third {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.792);
  }
}
.third {
  animation: pulse_third 5s infinite;
  transform-origin: center;
}

@keyframes pulse_fourth {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.728);
  }
}
.fourth {
  animation: pulse_fourth 5s infinite;
  transform-origin: center;
}

@keyframes pulse_fifth {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.664);
  }
}
.fifth {
  animation: pulse_fifth 5s infinite;
  transform-origin: center;
}

@keyframes pulse_innermost {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.6);
  }
}
.innermost {
  animation: pulse_innermost 5s infinite;
  transform-origin: center;
}
`, "",{"version":3,"sources":["webpack://./src/rectangles.css"],"names":[],"mappings":"AAAA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,sBAAsB;EACxB;AACF;AACA;EACE,sCAAsC;EACtC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,mCAAmC;EACnC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,kCAAkC;EAClC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,mCAAmC;EACnC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,kCAAkC;EAClC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,qBAAqB;EACvB;AACF;AACA;EACE,sCAAsC;EACtC,wBAAwB;AAC1B","sourcesContent":["@keyframes pulse_outermost {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.92);\n  }\n}\n.outermost {\n  animation: pulse_outermost 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_second {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.856);\n  }\n}\n.second {\n  animation: pulse_second 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_third {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.792);\n  }\n}\n.third {\n  animation: pulse_third 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_fourth {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.728);\n  }\n}\n.fourth {\n  animation: pulse_fourth 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_fifth {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.664);\n  }\n}\n.fifth {\n  animation: pulse_fifth 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_innermost {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.6);\n  }\n}\n.innermost {\n  animation: pulse_innermost 5s infinite;\n  transform-origin: center;\n}\n"],"sourceRoot":""}]);
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 307 640\">\n  <defs>\n    <style>\n      .innermost, .second, .third, .fourth, .fifth, .outermost {\n        stroke-width: 0px;\n      }\n      \n      .outermost {\n        fill: #e4f2d1;\n      }\n\n      .second {\n        fill: #cce8b5;\n      }\n\n      .third {\n        fill: #b3db95;\n      }\n\n      .fourth {\n        fill: #9bd078;\n      }\n\n      .fifth {\n        fill: #83c55c;\n      }\n\n      .innermost {\n        fill: #428a2f;\n      }\n    </style>\n  </defs>\n  <path class=\"outermost\" d=\"m306.9,320c0,105.3-.02,210.6.1,315.91,0,3.42-.67,4.1-4.09,4.09-99.6-.12-199.21-.12-298.81,0C.67,640,0,639.33,0,635.91.11,425.3.11,214.7,0,4.09,0,.67.67,0,4.09,0,103.7.12,203.3.12,302.91,0c3.42,0,4.1.67,4.09,4.09-.12,105.3-.1,210.6-.1,315.91Z\"/>\n  <path class=\"second\" d=\"m275.92,323c0,87.63,0,175.27,0,262.9,0,7.24-.55,7.93-7.86,7.98-14.66.09-29.31.03-43.97.03-60.96,0-121.92,0-182.88,0q-7.13,0-7.14-7.24c0-176.1,0-352.21,0-528.31q0-7.26,7.12-7.26c75.78,0,151.56,0,227.35,0q7.38,0,7.38,7.5c0,88.13,0,176.27,0,264.4Z\"/>\n  <path class=\"third\" d=\"m68.06,322.24c0-69.47,0-138.94,0-208.41,0-8.99,1.33-10.13,10.49-9.12,1.98.22,3.98.32,5.97.32,46.13.02,92.26.02,138.39,0,3.48,0,6.92-.23,10.41-.67,5.5-.7,8.74.46,8.73,7.25-.18,138.94-.13,277.88-.13,416.81,0,.33,0,.67,0,1q-.14,10.51-10.39,10.51c-52.13,0-104.25,0-156.38,0q-7.09,0-7.09-7.28c0-70.14,0-140.27,0-210.41Z\"/>\n  <path class=\"fourth\" d=\"m103.02,322.5c0-52.46,0-104.91,0-157.37,0-6.68.36-7.06,7.07-7.06,30.3-.01,60.6.07,90.9-.09,4.54-.02,6.08,1.33,6.07,5.98-.1,105.58-.1,211.16,0,316.74,0,4.18-1.27,5.37-5.38,5.35-29.3-.15-58.6-.08-87.9-.08q-10.76,0-10.76-11.09c0-50.79,0-101.58,0-152.37Z\"/>\n  <path class=\"fifth\" d=\"m173,322.2c0,35.29,0,70.58,0,105.88q0,6.89-6.99,6.9c-8.15,0-16.31-.13-24.46.06-3.47.08-4.68-1.09-4.61-4.59.18-9.65.06-19.31.06-28.96,0-58.26-.01-116.53.02-174.79,0-4.76-1.12-9.46-.14-14.3.51-2.54,1.39-3.38,3.8-3.36,8.82.06,17.64.14,26.46-.02,4.59-.09,5.95,1.85,5.94,6.33-.14,35.62-.08,71.25-.08,106.87Z\"/>\n  <path class=\"innermost\" d=\"m151.04,322.01c0-9.99.07-19.97-.05-29.96-.04-2.93.83-4.18,3.95-4.18,3.06,0,4.03,1.12,4.02,4.11-.09,19.97-.08,39.94.01,59.91.01,2.96-.84,4.16-3.96,4.14-3.03-.01-4.08-1.04-4.03-4.08.14-9.98.05-19.97.05-29.96Z\"/>\n</svg>");

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QXZGLFFBQVEsQ0FBQ3NHLE9BQU8sQ0FBQ2hGLFFBQVEsRUFBRTtJQUFFaUYsU0FBUyxFQUFFLElBQUk7SUFBRUMsT0FBTyxFQUFFO0VBQUssQ0FBQyxDQUFDO0FBQ2hFLENBQUMsRUFBRSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9tb2JpbGUuY3NzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvcmVjdGFuZ2xlcy5jc3MiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy90YWxrQnV0dG9uLmNzcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy90cmFuc2NyaWJlci5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3JlY3RhbmdsZXMuc3ZnIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvd2F2ZWZvcm0uc3ZnIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvbW9iaWxlLmNzcz9mNmZmIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvcmVjdGFuZ2xlcy5jc3M/MDM2MiIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3RhbGtCdXR0b24uY3NzPzA3ZjUiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3NheXBpLmluZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGBAbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgLyogbW9iaWxlIHN0eWxlcyBnbyBoZXJlICovXG4gICNzYXlwaS1wYW5lbCB7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgcG9zaXRpb246IGZpeGVkO1xuICAgIGxlZnQ6IDA7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNDUsIDIzOCwgMjIzLCAwLjkpO1xuICB9XG4gICNzYXlwaS1wYW5lbCB7XG4gICAgaGVpZ2h0OiAxMDB2aDtcbiAgICB0b3A6IDA7XG4gICAgcGFkZGluZzogNSU7XG4gIH1cbiAgLyogbWFrZSB0aGUgYnV0dG9ucyBmaWxsIHRoZSBwYW5lbHMgKi9cbiAgI3NheXBpLXRhbGtCdXR0b24ge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGhlaWdodDogMTAwJTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICBib3JkZXItcmFkaXVzOiAwO1xuICAgIG1hcmdpbjogMDtcbiAgfVxuICAvKiBzdXJmYWNlIHByaW1hcnkgY29udHJvbHM6IFwiLi4uXCIsIFwiZXhwZXJpZW5jZXNcIiwgXCJ1bm11dGUvbXV0ZVwiICovXG4gICNfX25leHQgPiBtYWluID4gZGl2ID4gZGl2ID4gZGl2LmZpeGVkLnRvcC00LnJpZ2h0LTYgPiBidXR0b24sXG4gIGRpdltkYXRhLXByb2plY3Rpb24taWQ9XCIxMlwiXSA+IGJ1dHRvbiB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgyKTtcbiAgICB6LWluZGV4OiA1MDtcbiAgfVxuICAvKiBvdmVycmlkZSBSZWFjdCBjaGFuZ2VzIG9uIGF1ZGlvIGJ1dHRvbiAqL1xuICBidXR0b25bZGF0YS1wcm9qZWN0aW9uLWlkPVwiMTZcIl0gPiBkaXZbZGF0YS1wcm9qZWN0aW9uLWlkPVwiMTdcIl0sXG4gIGJ1dHRvbltkYXRhLXByb2plY3Rpb24taWQ9XCIxNlwiXSA+IGRpdltkYXRhLXByb2plY3Rpb24taWQ9XCIxOFwiXSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgyKSAhaW1wb3J0YW50O1xuICAgIHotaW5kZXg6IDUwO1xuICB9XG4gIC8qIGhpZGUgZm9vdGVyICovXG4gICNzYXlwaS1mb290ZXIge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gIH1cbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL21vYmlsZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDRSwwQkFBMEI7RUFDMUI7SUFDRSxXQUFXO0lBQ1gsZUFBZTtJQUNmLE9BQU87SUFDUCwwQ0FBMEM7RUFDNUM7RUFDQTtJQUNFLGFBQWE7SUFDYixNQUFNO0lBQ04sV0FBVztFQUNiO0VBQ0EscUNBQXFDO0VBQ3JDO0lBQ0UsV0FBVztJQUNYLFlBQVk7SUFDWiw2QkFBNkI7SUFDN0IsZ0JBQWdCO0lBQ2hCLFNBQVM7RUFDWDtFQUNBLGtFQUFrRTtFQUNsRTs7SUFFRSxtQkFBbUI7SUFDbkIsV0FBVztFQUNiO0VBQ0EsMkNBQTJDO0VBQzNDOztJQUVFLDhCQUE4QjtJQUM5QixXQUFXO0VBQ2I7RUFDQSxnQkFBZ0I7RUFDaEI7SUFDRSxhQUFhO0VBQ2Y7QUFDRlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCJAbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcXG4gIC8qIG1vYmlsZSBzdHlsZXMgZ28gaGVyZSAqL1xcbiAgI3NheXBpLXBhbmVsIHtcXG4gICAgd2lkdGg6IDEwMCU7XFxuICAgIHBvc2l0aW9uOiBmaXhlZDtcXG4gICAgbGVmdDogMDtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNDUsIDIzOCwgMjIzLCAwLjkpO1xcbiAgfVxcbiAgI3NheXBpLXBhbmVsIHtcXG4gICAgaGVpZ2h0OiAxMDB2aDtcXG4gICAgdG9wOiAwO1xcbiAgICBwYWRkaW5nOiA1JTtcXG4gIH1cXG4gIC8qIG1ha2UgdGhlIGJ1dHRvbnMgZmlsbCB0aGUgcGFuZWxzICovXFxuICAjc2F5cGktdGFsa0J1dHRvbiB7XFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgICBoZWlnaHQ6IDEwMCU7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgICBib3JkZXItcmFkaXVzOiAwO1xcbiAgICBtYXJnaW46IDA7XFxuICB9XFxuICAvKiBzdXJmYWNlIHByaW1hcnkgY29udHJvbHM6IFxcXCIuLi5cXFwiLCBcXFwiZXhwZXJpZW5jZXNcXFwiLCBcXFwidW5tdXRlL211dGVcXFwiICovXFxuICAjX19uZXh0ID4gbWFpbiA+IGRpdiA+IGRpdiA+IGRpdi5maXhlZC50b3AtNC5yaWdodC02ID4gYnV0dG9uLFxcbiAgZGl2W2RhdGEtcHJvamVjdGlvbi1pZD1cXFwiMTJcXFwiXSA+IGJ1dHRvbiB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMik7XFxuICAgIHotaW5kZXg6IDUwO1xcbiAgfVxcbiAgLyogb3ZlcnJpZGUgUmVhY3QgY2hhbmdlcyBvbiBhdWRpbyBidXR0b24gKi9cXG4gIGJ1dHRvbltkYXRhLXByb2plY3Rpb24taWQ9XFxcIjE2XFxcIl0gPiBkaXZbZGF0YS1wcm9qZWN0aW9uLWlkPVxcXCIxN1xcXCJdLFxcbiAgYnV0dG9uW2RhdGEtcHJvamVjdGlvbi1pZD1cXFwiMTZcXFwiXSA+IGRpdltkYXRhLXByb2plY3Rpb24taWQ9XFxcIjE4XFxcIl0ge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDIpICFpbXBvcnRhbnQ7XFxuICAgIHotaW5kZXg6IDUwO1xcbiAgfVxcbiAgLyogaGlkZSBmb290ZXIgKi9cXG4gICNzYXlwaS1mb290ZXIge1xcbiAgICBkaXNwbGF5OiBub25lO1xcbiAgfVxcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYEBrZXlmcmFtZXMgcHVsc2Vfb3V0ZXJtb3N0IHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTIpO1xuICB9XG59XG4ub3V0ZXJtb3N0IHtcbiAgYW5pbWF0aW9uOiBwdWxzZV9vdXRlcm1vc3QgNXMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBwdWxzZV9zZWNvbmQge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44NTYpO1xuICB9XG59XG4uc2Vjb25kIHtcbiAgYW5pbWF0aW9uOiBwdWxzZV9zZWNvbmQgNXMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBwdWxzZV90aGlyZCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjc5Mik7XG4gIH1cbn1cbi50aGlyZCB7XG4gIGFuaW1hdGlvbjogcHVsc2VfdGhpcmQgNXMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBwdWxzZV9mb3VydGgge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43MjgpO1xuICB9XG59XG4uZm91cnRoIHtcbiAgYW5pbWF0aW9uOiBwdWxzZV9mb3VydGggNXMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBwdWxzZV9maWZ0aCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjY2NCk7XG4gIH1cbn1cbi5maWZ0aCB7XG4gIGFuaW1hdGlvbjogcHVsc2VfZmlmdGggNXMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBwdWxzZV9pbm5lcm1vc3Qge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC42KTtcbiAgfVxufVxuLmlubmVybW9zdCB7XG4gIGFuaW1hdGlvbjogcHVsc2VfaW5uZXJtb3N0IDVzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9yZWN0YW5nbGVzLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNFOztJQUVFLG1CQUFtQjtFQUNyQjtFQUNBO0lBQ0Usc0JBQXNCO0VBQ3hCO0FBQ0Y7QUFDQTtFQUNFLHNDQUFzQztFQUN0Qyx3QkFBd0I7QUFDMUI7O0FBRUE7RUFDRTs7SUFFRSxtQkFBbUI7RUFDckI7RUFDQTtJQUNFLHVCQUF1QjtFQUN6QjtBQUNGO0FBQ0E7RUFDRSxtQ0FBbUM7RUFDbkMsd0JBQXdCO0FBQzFCOztBQUVBO0VBQ0U7O0lBRUUsbUJBQW1CO0VBQ3JCO0VBQ0E7SUFDRSx1QkFBdUI7RUFDekI7QUFDRjtBQUNBO0VBQ0Usa0NBQWtDO0VBQ2xDLHdCQUF3QjtBQUMxQjs7QUFFQTtFQUNFOztJQUVFLG1CQUFtQjtFQUNyQjtFQUNBO0lBQ0UsdUJBQXVCO0VBQ3pCO0FBQ0Y7QUFDQTtFQUNFLG1DQUFtQztFQUNuQyx3QkFBd0I7QUFDMUI7O0FBRUE7RUFDRTs7SUFFRSxtQkFBbUI7RUFDckI7RUFDQTtJQUNFLHVCQUF1QjtFQUN6QjtBQUNGO0FBQ0E7RUFDRSxrQ0FBa0M7RUFDbEMsd0JBQXdCO0FBQzFCOztBQUVBO0VBQ0U7O0lBRUUsbUJBQW1CO0VBQ3JCO0VBQ0E7SUFDRSxxQkFBcUI7RUFDdkI7QUFDRjtBQUNBO0VBQ0Usc0NBQXNDO0VBQ3RDLHdCQUF3QjtBQUMxQlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCJAa2V5ZnJhbWVzIHB1bHNlX291dGVybW9zdCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkyKTtcXG4gIH1cXG59XFxuLm91dGVybW9zdCB7XFxuICBhbmltYXRpb246IHB1bHNlX291dGVybW9zdCA1cyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuQGtleWZyYW1lcyBwdWxzZV9zZWNvbmQge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44NTYpO1xcbiAgfVxcbn1cXG4uc2Vjb25kIHtcXG4gIGFuaW1hdGlvbjogcHVsc2Vfc2Vjb25kIDVzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHB1bHNlX3RoaXJkIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNzkyKTtcXG4gIH1cXG59XFxuLnRoaXJkIHtcXG4gIGFuaW1hdGlvbjogcHVsc2VfdGhpcmQgNXMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbkBrZXlmcmFtZXMgcHVsc2VfZm91cnRoIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNzI4KTtcXG4gIH1cXG59XFxuLmZvdXJ0aCB7XFxuICBhbmltYXRpb246IHB1bHNlX2ZvdXJ0aCA1cyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuQGtleWZyYW1lcyBwdWxzZV9maWZ0aCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjY2NCk7XFxuICB9XFxufVxcbi5maWZ0aCB7XFxuICBhbmltYXRpb246IHB1bHNlX2ZpZnRoIDVzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHB1bHNlX2lubmVybW9zdCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjYpO1xcbiAgfVxcbn1cXG4uaW5uZXJtb3N0IHtcXG4gIGFuaW1hdGlvbjogcHVsc2VfaW5uZXJtb3N0IDVzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYEBrZXlmcmFtZXMgcHVsc2Uge1xuICAgIDAlIHtcbiAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgICB9XG4gICAgNTAlIHtcbiAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkpO1xuICAgIH1cbiAgICAxMDAlIHtcbiAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgICB9XG59XG4jc2F5cGktdGFsa0J1dHRvbiB7XG4gICAgbWFyZ2luLXRvcDogMC4yNXJlbTtcbiAgICBib3JkZXItcmFkaXVzOiAxOHB4O1xuICAgIHdpZHRoOiAxMjBweDtcbiAgICBkaXNwbGF5OiBibG9jazsgLyogRm9yIFNhZmFyaSAqL1xufVxuXG5odG1sOm5vdCguZmlyZWZveC1hbmRyb2lkKSAjc2F5cGktdGFsa0J1dHRvbjphY3RpdmUgLndhdmVmb3JtLFxuI3NheXBpLXRhbGtCdXR0b24uYWN0aXZlIC53YXZlZm9ybSB7XG4gICAgYW5pbWF0aW9uOiBwdWxzZSAxcyBpbmZpbml0ZTtcbn0gICAgICAgICAgICBcbiNzYXlwaS10YWxrQnV0dG9uIC53YXZlZm9ybSB7XG4gICAgZmlsbDogIzc3NmQ2ZDtcbn1cbiNzYXlwaS10YWxrQnV0dG9uLmF1dG9TdWJtaXQgLndhdmVmb3JtIHtcbiAgICBmaWxsOiByZ2IoNjUgMTM4IDQ3KTsgLyogUGkncyB0ZXh0LWJyYW5kLWdyZWVuLTYwMCAqL1xufWAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3RhbGtCdXR0b24uY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0lBQ0k7UUFDSSxtQkFBbUI7SUFDdkI7SUFDQTtRQUNJLHFCQUFxQjtJQUN6QjtJQUNBO1FBQ0ksbUJBQW1CO0lBQ3ZCO0FBQ0o7QUFDQTtJQUNJLG1CQUFtQjtJQUNuQixtQkFBbUI7SUFDbkIsWUFBWTtJQUNaLGNBQWMsRUFBRSxlQUFlO0FBQ25DOztBQUVBOztJQUVJLDRCQUE0QjtBQUNoQztBQUNBO0lBQ0ksYUFBYTtBQUNqQjtBQUNBO0lBQ0ksb0JBQW9CLEVBQUUsOEJBQThCO0FBQ3hEXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIkBrZXlmcmFtZXMgcHVsc2Uge1xcbiAgICAwJSB7XFxuICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgICB9XFxuICAgIDUwJSB7XFxuICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOSk7XFxuICAgIH1cXG4gICAgMTAwJSB7XFxuICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgICB9XFxufVxcbiNzYXlwaS10YWxrQnV0dG9uIHtcXG4gICAgbWFyZ2luLXRvcDogMC4yNXJlbTtcXG4gICAgYm9yZGVyLXJhZGl1czogMThweDtcXG4gICAgd2lkdGg6IDEyMHB4O1xcbiAgICBkaXNwbGF5OiBibG9jazsgLyogRm9yIFNhZmFyaSAqL1xcbn1cXG5cXG5odG1sOm5vdCguZmlyZWZveC1hbmRyb2lkKSAjc2F5cGktdGFsa0J1dHRvbjphY3RpdmUgLndhdmVmb3JtLFxcbiNzYXlwaS10YWxrQnV0dG9uLmFjdGl2ZSAud2F2ZWZvcm0ge1xcbiAgICBhbmltYXRpb246IHB1bHNlIDFzIGluZmluaXRlO1xcbn0gICAgICAgICAgICBcXG4jc2F5cGktdGFsa0J1dHRvbiAud2F2ZWZvcm0ge1xcbiAgICBmaWxsOiAjNzc2ZDZkO1xcbn1cXG4jc2F5cGktdGFsa0J1dHRvbi5hdXRvU3VibWl0IC53YXZlZm9ybSB7XFxuICAgIGZpbGw6IHJnYig2NSAxMzggNDcpOyAvKiBQaSdzIHRleHQtYnJhbmQtZ3JlZW4tNjAwICovXFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiZXhwb3J0IGRlZmF1bHQgXCIvLyBhdWRpbyBvdXRwdXQgKFBpKVxcbnZhciBhdWRpb0VsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxcXCJhdWRpb1xcXCIpO1xcbmlmICghYXVkaW9FbGVtZW50KSB7XFxuICBjb25zb2xlLmVycm9yKFxcXCJBdWRpbyBlbGVtZW50IG5vdCBmb3VuZCFcXFwiKTtcXG59XFxuZnVuY3Rpb24gaXNTYWZhcmkoKSB7XFxuICByZXR1cm4gL14oKD8hY2hyb21lfGFuZHJvaWQpLikqc2FmYXJpL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcXG59XFxuYXVkaW9FbGVtZW50LnByZWxvYWQgPSBcXFwiYXV0b1xcXCI7IC8vIGVuYWJsZSBhZ2dyZXNzaXZlIHByZWxvYWRpbmcgb2YgYXVkaW9cXG52YXIgcGlBdWRpb01hbmFnZXIgPSB7XFxuICBpc1NwZWFraW5nOiBmYWxzZSxcXG4gIGF1ZGlvRWxlbWVudDogYXVkaW9FbGVtZW50LFxcbiAgX3VzZXJTdGFydGVkOiB0cnVlLFxcbiAgLy8gZmxhZyB0byBpbmRpY2F0ZSBwbGF5YmFjayBoYXMgYmVlbiBzdGFydGVkIGJ5IHRoZSB1c2VyICh0cnVlIGJ5IGRlZmF1bHQgYmVjYXVzZSB1c2VyIG11c3QgcmVxdWVzdCBpbml0aWFsIHBsYXliYWNrKVxcbiAgX2lzTG9hZENhbGxlZDogZmFsc2UsXFxuICAvLyBmbGFnIHRvIGluZGljYXRlIGlmIHRoZSBsb2FkKCkgbWV0aG9kIGhhcyBiZWVuIGNhbGxlZCBvbiB0aGUgYXVkaW8gZWxlbWVudFxcblxcbiAgdXNlclBsYXk6IGZ1bmN0aW9uIHVzZXJQbGF5KCkge1xcbiAgICBpZiAoIWlzU2FmYXJpKCkpIHtcXG4gICAgICByZXR1cm47XFxuICAgIH1cXG4gICAgdGhpcy5fdXNlclN0YXJ0ZWQgPSB0cnVlOyAvLyBzZXQgYSBmbGFnIHRvIGluZGljYXRlIHBsYXliYWNrIGhhcyBiZWVuIHN0YXJ0ZWQgYnkgdGhlIHVzZXJcXG4gICAgdGhpcy5hdWRpb0VsZW1lbnQubG9hZCgpOyAvLyByZXNldCBmb3IgU2FmYXJpXFxuICAgIHRoaXMuYXVkaW9FbGVtZW50LnBsYXkoKTtcXG4gICAgY29uc29sZS5sb2coXFxcIlVzZXIgc3RhcnRlZCBwbGF5YmFja1xcXCIpO1xcbiAgfSxcXG4gIGF1dG9QbGF5OiBmdW5jdGlvbiBhdXRvUGxheSgpIHtcXG4gICAgaWYgKCFpc1NhZmFyaSgpKSB7XFxuICAgICAgcmV0dXJuO1xcbiAgICB9XFxuICAgIGlmICghdGhpcy5fdXNlclN0YXJ0ZWQpIHtcXG4gICAgICB0aGlzLmF1ZGlvRWxlbWVudC5wYXVzZSgpO1xcbiAgICAgIGNvbnNvbGUubG9nKFxcXCJBdXRvcGxheSBwcmV2ZW50ZWRcXFwiKTtcXG4gICAgfVxcbiAgfSxcXG4gIHN0b3A6IGZ1bmN0aW9uIHN0b3AoKSB7XFxuICAgIGlmICh0aGlzLmlzU3BlYWtpbmcpIHtcXG4gICAgICB0aGlzLmF1ZGlvRWxlbWVudC5wYXVzZSgpO1xcbiAgICB9XFxuICAgIGlmICh0aGlzLmF1ZGlvRWxlbWVudC5kdXJhdGlvbiAmJiAhdGhpcy5hdWRpb0VsZW1lbnQuZW5kZWQgJiYgdGhpcy5hdWRpb0VsZW1lbnQuY3VycmVudFRpbWUgPCB0aGlzLmF1ZGlvRWxlbWVudC5kdXJhdGlvbikge1xcbiAgICAgIHRoaXMuYXVkaW9FbGVtZW50LmN1cnJlbnRUaW1lID0gdGhpcy5hdWRpb0VsZW1lbnQuZHVyYXRpb247IC8vIHNlZWsgdGhlIGF1ZGlvIHRvIHRoZSBlbmRcXG4gICAgICB0aGlzLmF1ZGlvRWxlbWVudC5wbGF5KCk7IC8vIHRyaWdnZXIgdGhlIGVuZGVkIGV2ZW50XFxuICAgIH1cXG4gIH0sXFxuXFxuICBwYXVzZTogZnVuY3Rpb24gcGF1c2UoKSB7XFxuICAgIHRoaXMuYXVkaW9FbGVtZW50LnBhdXNlKCk7XFxuICB9LFxcbiAgcmVzdW1lOiBmdW5jdGlvbiByZXN1bWUoKSB7XFxuICAgIHRoaXMuYXVkaW9FbGVtZW50LnBsYXkoKTtcXG4gIH0sXFxuICBsb2FkaW5nOiBmdW5jdGlvbiBsb2FkaW5nKCkge1xcbiAgICBpZiAoIWlzU2FmYXJpKCkpIHtcXG4gICAgICByZXR1cm47XFxuICAgIH1cXG4gICAgaWYgKCF0aGlzLl9pc0xvYWRDYWxsZWQpIHtcXG4gICAgICB0aGlzLl9pc0xvYWRDYWxsZWQgPSB0cnVlOyAvLyBTZXQgdGhlIGZsYWcgdG8gdHJ1ZVxcbiAgICAgIHRoaXMuc2hvd1BsYXlCdXR0b24oKTsgLy8gU2hvdyB0aGUgcGxheSBidXR0b25cXG4gICAgfSBlbHNlIHtcXG4gICAgICB0aGlzLl9pc0xvYWRDYWxsZWQgPSBmYWxzZTsgLy8gUmVzZXQgdGhlIGZsYWdcXG4gICAgfVxcbiAgfSxcXG5cXG4gIHBsYXlpbmc6IGZ1bmN0aW9uIHBsYXlpbmcoKSB7XFxuICAgIHRoaXMuaXNTcGVha2luZyA9IHRydWU7XFxuICAgIGlmIChpc1NhZmFyaSgpKSB7XFxuICAgICAgdGhpcy5oaWRlUGxheUJ1dHRvbigpO1xcbiAgICB9XFxuICB9LFxcbiAgc3RvcHBlZDogZnVuY3Rpb24gc3RvcHBlZCgpIHtcXG4gICAgdGhpcy5pc1NwZWFraW5nID0gZmFsc2U7XFxuICAgIHRoaXMuX3VzZXJTdGFydGVkID0gZmFsc2U7XFxuICB9LFxcbiAgc2hvd1BsYXlCdXR0b246IGZ1bmN0aW9uIHNob3dQbGF5QnV0dG9uKCkge1xcbiAgICB2YXIgcGxheUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxcXCJzYXlwaS1wbGF5QXVkaW9cXFwiKTtcXG4gICAgaWYgKCFwbGF5QnV0dG9uKSB7XFxuICAgICAgcGxheUJ1dHRvbiA9IHRoaXMuY3JlYXRlUGxheUJ1dHRvbigpO1xcbiAgICB9XFxuICAgIHBsYXlCdXR0b24uc3R5bGUuZGlzcGxheSA9IFxcXCJibG9ja1xcXCI7XFxuICB9LFxcbiAgaGlkZVBsYXlCdXR0b246IGZ1bmN0aW9uIGhpZGVQbGF5QnV0dG9uKCkge1xcbiAgICB2YXIgcGxheUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxcXCJzYXlwaS1wbGF5QXVkaW9cXFwiKTtcXG4gICAgaWYgKHBsYXlCdXR0b24pIHtcXG4gICAgICBwbGF5QnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcXFwibm9uZVxcXCI7XFxuICAgIH1cXG4gIH0sXFxuICBjcmVhdGVQbGF5QnV0dG9uOiBmdW5jdGlvbiBjcmVhdGVQbGF5QnV0dG9uKCkge1xcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xcbiAgICAvLyBjcmVhdGUgYSBjb250YWluaW5nIGRpdlxcbiAgICB2YXIgcGFuZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFxcXCJkaXZcXFwiKTtcXG4gICAgcGFuZWwuaWQgPSBcXFwicGktcGFuZWxcXFwiO1xcbiAgICB2YXIgcGxheUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXFxcImJ1dHRvblxcXCIpO1xcbiAgICBwbGF5QnV0dG9uLmlkID0gXFxcInNheXBpLXBsYXlBdWRpb1xcXCI7XFxuICAgIHBsYXlCdXR0b24uaW5uZXJUZXh0ID0gXFxcIkhlYXIgUGkncyBSZXNwb25zZVxcXCI7XFxuICAgIHBsYXlCdXR0b24uc3R5bGUucG9zaXRpb24gPSBcXFwiZml4ZWRcXFwiO1xcbiAgICBwbGF5QnV0dG9uLnN0eWxlLnRvcCA9IFxcXCI1MCVcXFwiO1xcbiAgICBwbGF5QnV0dG9uLnN0eWxlLmxlZnQgPSBcXFwiNTAlXFxcIjtcXG4gICAgcGxheUJ1dHRvbi5zdHlsZS50cmFuc2Zvcm0gPSBcXFwidHJhbnNsYXRlKC01MCUsIDUwJSlcXFwiO1xcbiAgICBwbGF5QnV0dG9uLnN0eWxlLnBhZGRpbmcgPSBcXFwiMTBweCAyMHB4XFxcIjtcXG4gICAgcGxheUJ1dHRvbi5zdHlsZS5mb250U2l6ZSA9IFxcXCIyNHB4XFxcIjtcXG4gICAgcGxheUJ1dHRvbi5zdHlsZS5ib3JkZXJSYWRpdXMgPSBcXFwiNXB4XFxcIjtcXG4gICAgcGxheUJ1dHRvbi5zdHlsZS5ib3JkZXIgPSBcXFwibm9uZVxcXCI7XFxuICAgIHBsYXlCdXR0b24uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXFxcInJnYigyMjggMjE2IDE5MylcXFwiO1xcbiAgICBwbGF5QnV0dG9uLnN0eWxlLnpJbmRleCA9IFxcXCI5OTk5XFxcIjsgLy8gZW5zdXJlIGl0J3Mgb24gdG9wIG9mIG90aGVyIGVsZW1lbnRzXFxuICAgIHBsYXlCdXR0b24uc3R5bGUuZGlzcGxheSA9IFxcXCJub25lXFxcIjsgLy8gaW5pdGlhbGx5IGhpZGRlblxcblxcbiAgICBwYW5lbC5hcHBlbmRDaGlsZChwbGF5QnV0dG9uKTtcXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChwYW5lbCk7XFxuXFxuICAgIC8vIEV2ZW50IGxpc3RlbmVyIHRvIHN0YXJ0IHBsYXliYWNrXFxuICAgIHBsYXlCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcXFwiY2xpY2tcXFwiLCBmdW5jdGlvbiAoKSB7XFxuICAgICAgX3RoaXMudXNlclBsYXkoKTtcXG4gICAgICBfdGhpcy5oaWRlUGxheUJ1dHRvbigpO1xcbiAgICB9KTtcXG4gICAgcmV0dXJuIHBsYXlCdXR0b247XFxuICB9XFxufTtcXG5cXG4vLyBJbnRlcmNlcHQgQXV0b3BsYXkgRXZlbnRzIChhdXRvcGxheSBkb2Vzbid0IHdvcmsgb24gU2FmYXJpKVxcbmF1ZGlvRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxcXCJwbGF5XFxcIiwgZnVuY3Rpb24gKCkge1xcbiAgcGlBdWRpb01hbmFnZXIuYXV0b1BsYXkoKTtcXG59KTtcXG5hdWRpb0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcXFwibG9hZHN0YXJ0XFxcIiwgZnVuY3Rpb24gKCkge1xcbiAgcGlBdWRpb01hbmFnZXIubG9hZGluZygpO1xcbn0pO1xcblxcbi8vIEV2ZW50IGxpc3RlbmVycyBmb3IgZGV0ZWN0aW5nIHdoZW4gUGkgaXMgc3BlYWtpbmdcXG5hdWRpb0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcXFwicGxheWluZ1xcXCIsIGZ1bmN0aW9uICgpIHtcXG4gIGNvbnNvbGUubG9nKFxcXCJQaSBpcyBzcGVha2luZ1xcXCIpO1xcbiAgcGlBdWRpb01hbmFnZXIucGxheWluZygpO1xcbn0pO1xcbmF1ZGlvRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxcXCJwYXVzZVxcXCIsIGZ1bmN0aW9uICgpIHtcXG4gIGNvbnNvbGUubG9nKFxcXCJQaSBzdG9wcGVkIHNwZWFraW5nXFxcIik7XFxuICBwaUF1ZGlvTWFuYWdlci5zdG9wcGVkKCk7XFxufSk7XFxuYXVkaW9FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXFxcImVuZGVkXFxcIiwgZnVuY3Rpb24gKCkge1xcbiAgY29uc29sZS5sb2coXFxcIlBpIGZpbmlzaGVkIHNwZWFraW5nXFxcIik7XFxuICBwaUF1ZGlvTWFuYWdlci5zdG9wcGVkKCk7XFxufSk7XFxuXFxuLy8gYXVkaW8gaW5wdXQgKHVzZXIpXFxudmFyIGF1ZGlvRGF0YUNodW5rcyA9IFtdO1xcbnZhciBhdWRpb01pbWVUeXBlID0gXFxcImF1ZGlvL3dlYm07Y29kZWNzPW9wdXNcXFwiO1xcbmZ1bmN0aW9uIHVwbG9hZEF1ZGlvKGF1ZGlvQmxvYikge1xcbiAgLy8gQ3JlYXRlIGEgRm9ybURhdGEgb2JqZWN0XFxuICB2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcXG4gIHZhciBhdWRpb0ZpbGVuYW1lID0gXFxcImF1ZGlvLndlYm1cXFwiO1xcbiAgaWYgKGF1ZGlvQmxvYi50eXBlID09PSBcXFwiYXVkaW8vbXA0XFxcIikge1xcbiAgICBhdWRpb0ZpbGVuYW1lID0gXFxcImF1ZGlvLm1wNFxcXCI7XFxuICB9XFxuICAvLyBBZGQgdGhlIGF1ZGlvIGJsb2IgdG8gdGhlIEZvcm1EYXRhIG9iamVjdFxcbiAgZm9ybURhdGEuYXBwZW5kKFxcXCJhdWRpb1xcXCIsIGF1ZGlvQmxvYiwgYXVkaW9GaWxlbmFtZSk7XFxuICAvLyBHZXQgdGhlIHVzZXIncyBwcmVmZXJyZWQgbGFuZ3VhZ2VcXG4gIHZhciBsYW5ndWFnZSA9IG5hdmlnYXRvci5sYW5ndWFnZTtcXG4gIC8vIFBvc3QgdGhlIGF1ZGlvIHRvIHRoZSBzZXJ2ZXIgZm9yIHRyYW5zY3JpcHRpb25cXG4gIGZldGNoKGNvbmZpZy5hcGlTZXJ2ZXJVcmwgKyBcXFwiL3RyYW5zY3JpYmU/bGFuZ3VhZ2U9XFxcIiArIGxhbmd1YWdlLCB7XFxuICAgIG1ldGhvZDogXFxcIlBPU1RcXFwiLFxcbiAgICBib2R5OiBmb3JtRGF0YVxcbiAgfSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcXG4gICAgaWYgKCFyZXNwb25zZS5vaykge1xcbiAgICAgIHRocm93IEVycm9yKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xcbiAgICB9XFxuICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XFxuICB9KS50aGVuKGhhbmRsZVRyYW5zY3JpcHRpb25SZXNwb25zZSlbXFxcImNhdGNoXFxcIl0oZnVuY3Rpb24gKGVycm9yKSB7XFxuICAgIGNvbnNvbGUuZXJyb3IoXFxcIkxvb2tzIGxpa2UgdGhlcmUgd2FzIGEgcHJvYmxlbTogXFxcIiwgZXJyb3IpO1xcbiAgICB2YXIgdGV4dGFyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcXFwicHJvbXB0XFxcIik7XFxuICAgIHRleHRhcmVhLnZhbHVlID0gXFxcIlNvcnJ5LCB0aGVyZSB3YXMgYSBwcm9ibGVtIHRyYW5zY3JpYmluZyB5b3VyIGF1ZGlvLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyLlxcXCI7XFxuICB9KTtcXG59XFxuZnVuY3Rpb24gaGFuZGxlVHJhbnNjcmlwdGlvblJlc3BvbnNlKHJlc3BvbnNlSnNvbikge1xcbiAgdmFyIHRleHRhcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXFxcInByb21wdFxcXCIpO1xcbiAgc2ltdWxhdGVUeXBpbmcodGV4dGFyZWEsIHJlc3BvbnNlSnNvbi50ZXh0ICsgXFxcIiBcXFwiKTtcXG4gIGNvbnNvbGUubG9nKFxcXCJUcmFuc2NyaXB0OiBcXFwiICsgcmVzcG9uc2VKc29uLnRleHQpO1xcbn1cXG5mdW5jdGlvbiBzZXROYXRpdmVWYWx1ZShlbGVtZW50LCB2YWx1ZSkge1xcbiAgdmFyIGxhc3RWYWx1ZSA9IGVsZW1lbnQudmFsdWU7XFxuICBlbGVtZW50LnZhbHVlID0gdmFsdWU7XFxuICB2YXIgZXZlbnQgPSBuZXcgRXZlbnQoXFxcImlucHV0XFxcIiwge1xcbiAgICB0YXJnZXQ6IGVsZW1lbnQsXFxuICAgIGJ1YmJsZXM6IHRydWVcXG4gIH0pO1xcbiAgLy8gUmVhY3QgMTVcXG4gIGV2ZW50LnNpbXVsYXRlZCA9IHRydWU7XFxuICAvLyBSZWFjdCAxNi0xN1xcbiAgdmFyIHRyYWNrZXIgPSBlbGVtZW50Ll92YWx1ZVRyYWNrZXI7XFxuICBpZiAodHJhY2tlcikge1xcbiAgICB0cmFja2VyLnNldFZhbHVlKGxhc3RWYWx1ZSk7XFxuICB9XFxuICBlbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xcbn1cXG5mdW5jdGlvbiBzaW11bGF0ZUZvcm1TdWJtaXQodGV4dGFyZWEpIHtcXG4gIHZhciBlbnRlckV2ZW50ID0gbmV3IEtleWJvYXJkRXZlbnQoXFxcImtleWRvd25cXFwiLCB7XFxuICAgIGJ1YmJsZXM6IHRydWUsXFxuICAgIGtleTogXFxcIkVudGVyXFxcIixcXG4gICAga2V5Q29kZTogMTMsXFxuICAgIHdoaWNoOiAxM1xcbiAgfSk7XFxuICB0ZXh0YXJlYS5kaXNwYXRjaEV2ZW50KGVudGVyRXZlbnQpO1xcbn1cXG5mdW5jdGlvbiBzaW11bGF0ZVR5cGluZyhlbGVtZW50LCB0ZXh0KSB7XFxuICB2YXIgd29yZHMgPSB0ZXh0LnNwbGl0KFxcXCIgXFxcIik7IC8vIFNwbGl0IHRoZSB0ZXh0IGludG8gd29yZHMgKG1heSBub3QgYmUgaWRlYWwgZm9yIGFsbCBsYW5ndWFnZXMpXFxuICB2YXIgaSA9IDA7XFxuICBmdW5jdGlvbiB0eXBlV29yZCgpIHtcXG4gICAgaWYgKGkgPCB3b3Jkcy5sZW5ndGgpIHtcXG4gICAgICAvLyBBcHBlbmQgdGhlIG5leHQgd29yZCBhbmQgYSBzcGFjZSwgdGhlbiBpbmNyZW1lbnQgaVxcbiAgICAgIHNldE5hdGl2ZVZhbHVlKGVsZW1lbnQsIGVsZW1lbnQudmFsdWUgKyB3b3Jkc1tpKytdICsgXFxcIiBcXFwiKTtcXG4gICAgICAvLyBDYWxsIHRoaXMgZnVuY3Rpb24gYWdhaW4gYmVmb3JlIHRoZSBuZXh0IHJlcGFpbnRcXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodHlwZVdvcmQpO1xcbiAgICB9IGVsc2Uge1xcbiAgICAgIC8vIENoZWNrIGlmIGF1dG9zdWJtaXQgaXMgZW5hYmxlZFxcbiAgICAgIHZhciB0YWxrQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXFxcInNheXBpLXRhbGtCdXR0b25cXFwiKTtcXG4gICAgICBpZiAodGFsa0J1dHRvbi5kYXRhc2V0LmF1dG9zdWJtaXQgPT09IFxcXCJmYWxzZVxcXCIpIHtcXG4gICAgICAgIGNvbnNvbGUubG9nKFxcXCJBdXRvc3VibWl0IGlzIGRpc2FibGVkXFxcIik7XFxuICAgICAgfSBlbHNlIHtcXG4gICAgICAgIC8vIFNpbXVsYXRlIGFuIFxcXCJFbnRlclxcXCIga2V5cHJlc3MgZXZlbnRcXG4gICAgICAgIHNpbXVsYXRlRm9ybVN1Ym1pdChlbGVtZW50KTtcXG4gICAgICB9XFxuICAgIH1cXG4gIH1cXG4gIC8vIFN0YXJ0IHR5cGluZ1xcbiAgdHlwZVdvcmQoKTtcXG59XFxuXFxuLy8gRGVjbGFyZSBhIGdsb2JhbCB2YXJpYWJsZSBmb3IgdGhlIG1lZGlhUmVjb3JkZXJcXG52YXIgbWVkaWFSZWNvcmRlcjtcXG52YXIgdGhyZXNob2xkID0gMTAwMDsgLy8gMTAwMCBtcyA9IDEgc2Vjb25kLCBhYm91dCB0aGUgbGVuZ3RoIG9mIFxcXCJIZXksIFBpXFxcIlxcblxcbi8vIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgJ2RhdGFhdmFpbGFibGUnIGV2ZW50IGZpcmVzXFxuZnVuY3Rpb24gaGFuZGxlRGF0YUF2YWlsYWJsZShlKSB7XFxuICAvLyBBZGQgdGhlIGF1ZGlvIGRhdGEgY2h1bmsgdG8gdGhlIGFycmF5XFxuICBhdWRpb0RhdGFDaHVua3MucHVzaChlLmRhdGEpO1xcbn1cXG5cXG4vLyBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlICdzdG9wJyBldmVudCBmaXJlc1xcbmZ1bmN0aW9uIGhhbmRsZVN0b3AoKSB7XFxuICAvLyBDcmVhdGUgYSBCbG9iIGZyb20gdGhlIGF1ZGlvIGRhdGEgY2h1bmtzXFxuICB2YXIgYXVkaW9CbG9iID0gbmV3IEJsb2IoYXVkaW9EYXRhQ2h1bmtzLCB7XFxuICAgIHR5cGU6IGF1ZGlvTWltZVR5cGVcXG4gIH0pO1xcblxcbiAgLy8gR2V0IHRoZSBzdG9wIHRpbWUgYW5kIGNhbGN1bGF0ZSB0aGUgZHVyYXRpb25cXG4gIHZhciBzdG9wVGltZSA9IERhdGUubm93KCk7XFxuICB2YXIgZHVyYXRpb24gPSBzdG9wVGltZSAtIHdpbmRvdy5zdGFydFRpbWU7XFxuXFxuICAvLyBJZiB0aGUgZHVyYXRpb24gaXMgZ3JlYXRlciB0aGFuIHRoZSB0aHJlc2hvbGQsIHVwbG9hZCB0aGUgYXVkaW8gZm9yIHRyYW5zY3JpcHRpb25cXG4gIGlmIChkdXJhdGlvbiA+PSB0aHJlc2hvbGQpIHtcXG4gICAgLy8gZG93bmxvYWQgdGhlIGF1ZGlvXFxuICAgIHZhciB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGF1ZGlvQmxvYik7XFxuICAgIHZhciBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcXFwiYVxcXCIpO1xcbiAgICBhLnN0eWxlLmRpc3BsYXkgPSBcXFwibm9uZVxcXCI7XFxuICAgIGEuaHJlZiA9IHVybDtcXG4gICAgYS5kb3dubG9hZCA9IFxcXCJzYWZhcmlfYXVkaW8ubXA0XFxcIjtcXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTtcXG4gICAgLy8gYS5jbGljaygpO1xcbiAgICAvLyBVcGxvYWQgdGhlIGF1ZGlvIHRvIHRoZSBzZXJ2ZXIgZm9yIHRyYW5zY3JpcHRpb25cXG4gICAgdXBsb2FkQXVkaW8oYXVkaW9CbG9iKTtcXG4gIH1cXG5cXG4gIC8vIENsZWFyIHRoZSBhcnJheSBmb3IgdGhlIG5leHQgcmVjb3JkaW5nXFxuICBhdWRpb0RhdGFDaHVua3MgPSBbXTtcXG59XFxuZnVuY3Rpb24gc2V0dXBSZWNvcmRpbmcoY2FsbGJhY2spIHtcXG4gIGlmIChtZWRpYVJlY29yZGVyKSB7XFxuICAgIHJldHVybjtcXG4gIH1cXG5cXG4gIC8vIEdldCBhIHN0cmVhbSBmcm9tIHRoZSB1c2VyJ3MgbWljcm9waG9uZVxcbiAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEoe1xcbiAgICBhdWRpbzogdHJ1ZVxcbiAgfSkudGhlbihmdW5jdGlvbiAoc3RyZWFtKSB7XFxuICAgIGlmICghTWVkaWFSZWNvcmRlci5pc1R5cGVTdXBwb3J0ZWQoYXVkaW9NaW1lVHlwZSkpIHtcXG4gICAgICAvLyB1c2UgTVA0IGZvciBTYWZhcmlcXG4gICAgICBhdWRpb01pbWVUeXBlID0gXFxcImF1ZGlvL21wNFxcXCI7XFxuICAgIH1cXG4gICAgLy8gQ3JlYXRlIGEgbmV3IE1lZGlhUmVjb3JkZXIgb2JqZWN0IHVzaW5nIHRoZSBzdHJlYW0gYW5kIHNwZWNpZnlpbmcgdGhlIE1JTUUgdHlwZVxcbiAgICB2YXIgb3B0aW9ucyA9IHtcXG4gICAgICBtaW1lVHlwZTogYXVkaW9NaW1lVHlwZVxcbiAgICB9O1xcbiAgICBtZWRpYVJlY29yZGVyID0gbmV3IE1lZGlhUmVjb3JkZXIoc3RyZWFtLCBvcHRpb25zKTtcXG5cXG4gICAgLy8gTGlzdGVuIGZvciB0aGUgJ2RhdGFhdmFpbGFibGUnIGV2ZW50XFxuICAgIG1lZGlhUmVjb3JkZXIuYWRkRXZlbnRMaXN0ZW5lcihcXFwiZGF0YWF2YWlsYWJsZVxcXCIsIGhhbmRsZURhdGFBdmFpbGFibGUpO1xcblxcbiAgICAvLyBMaXN0ZW4gZm9yIHRoZSAnc3RvcCcgZXZlbnRcXG4gICAgbWVkaWFSZWNvcmRlci5hZGRFdmVudExpc3RlbmVyKFxcXCJzdG9wXFxcIiwgaGFuZGxlU3RvcCk7XFxuICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcXG4gICAgLy8gSW52b2tlIHRoZSBjYWxsYmFjayBmdW5jdGlvblxcbiAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcXFwiZnVuY3Rpb25cXFwiKSB7XFxuICAgICAgY2FsbGJhY2soKTtcXG4gICAgfVxcbiAgfSlbXFxcImNhdGNoXFxcIl0oZnVuY3Rpb24gKGVycikge1xcbiAgICBjb25zb2xlLmVycm9yKFxcXCJFcnJvciBnZXR0aW5nIGF1ZGlvIHN0cmVhbTogXFxcIiArIGVycik7XFxuICB9KTtcXG59XFxuZnVuY3Rpb24gdGVhckRvd25SZWNvcmRpbmcoKSB7XFxuICAvLyBDaGVjayBpZiB0aGUgTWVkaWFSZWNvcmRlciBpcyBzZXQgdXBcXG4gIGlmICghbWVkaWFSZWNvcmRlcikge1xcbiAgICByZXR1cm47XFxuICB9XFxuXFxuICAvLyBTdG9wIGFueSBvbmdvaW5nIHJlY29yZGluZ1xcbiAgaWYgKG1lZGlhUmVjb3JkZXIuc3RhdGUgPT09IFxcXCJyZWNvcmRpbmdcXFwiKSB7XFxuICAgIG1lZGlhUmVjb3JkZXIuc3RvcCgpO1xcbiAgfVxcblxcbiAgLy8gUmVtb3ZlIHRoZSBNZWRpYVJlY29yZGVyJ3MgZXZlbnQgbGlzdGVuZXJzXFxuICBtZWRpYVJlY29yZGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoXFxcImRhdGFhdmFpbGFibGVcXFwiLCBoYW5kbGVEYXRhQXZhaWxhYmxlKTtcXG4gIG1lZGlhUmVjb3JkZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihcXFwic3RvcFxcXCIsIGhhbmRsZVN0b3ApO1xcblxcbiAgLy8gQ2xlYXIgdGhlIE1lZGlhUmVjb3JkZXIgdmFyaWFibGVcXG4gIG1lZGlhUmVjb3JkZXIgPSBudWxsO1xcbn1cXG5cXG4vLyBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlIHVzZXIgcHJlc3NlcyB0aGUgcmVjb3JkIGJ1dHRvblxcbmZ1bmN0aW9uIHN0YXJ0UmVjb3JkaW5nKCkge1xcbiAgLy8gQ2hlY2sgaWYgdGhlIE1lZGlhUmVjb3JkZXIgaXMgc2V0IHVwXFxuICBpZiAoIW1lZGlhUmVjb3JkZXIpIHtcXG4gICAgc2V0dXBSZWNvcmRpbmcoc3RhcnRSZWNvcmRpbmcpO1xcbiAgICByZXR1cm47XFxuICB9XFxuICAvLyBDaGVjayBpZiBQaSBpcyBjdXJyZW50bHkgc3BlYWtpbmcgYW5kIHN0b3AgaGVyIGF1ZGlvXFxuICBpZiAocGlBdWRpb01hbmFnZXIuaXNTcGVha2luZykge1xcbiAgICBwaUF1ZGlvTWFuYWdlci5wYXVzZSgpO1xcbiAgfVxcblxcbiAgLy8gU3RhcnQgcmVjb3JkaW5nXFxuICBtZWRpYVJlY29yZGVyLnN0YXJ0KCk7XFxuXFxuICAvLyBSZWNvcmQgdGhlIHN0YXJ0IHRpbWVcXG4gIHdpbmRvdy5zdGFydFRpbWUgPSBEYXRlLm5vdygpO1xcbiAgY29uc29sZS5sb2coXFxcIlVzZXIgaXMgc3BlYWtpbmdcXFwiKTtcXG5cXG4gIC8vIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgdXNlciByZWxlYXNlcyB0aGUgcmVjb3JkIGJ1dHRvblxcbiAgd2luZG93LnN0b3BSZWNvcmRpbmcgPSBmdW5jdGlvbiAoKSB7XFxuICAgIGlmIChtZWRpYVJlY29yZGVyICYmIG1lZGlhUmVjb3JkZXIuc3RhdGUgPT09IFxcXCJyZWNvcmRpbmdcXFwiKSB7XFxuICAgICAgLy8gU3RvcCByZWNvcmRpbmdcXG4gICAgICBtZWRpYVJlY29yZGVyLnN0b3AoKTtcXG5cXG4gICAgICAvLyBSZWNvcmQgdGhlIHN0b3AgdGltZSBhbmQgY2FsY3VsYXRlIHRoZSBkdXJhdGlvblxcbiAgICAgIHZhciBzdG9wVGltZSA9IERhdGUubm93KCk7XFxuICAgICAgdmFyIGR1cmF0aW9uID0gc3RvcFRpbWUgLSB3aW5kb3cuc3RhcnRUaW1lO1xcblxcbiAgICAgIC8vIElmIHRoZSBkdXJhdGlvbiBpcyBsZXNzIHRoYW4gdGhlIHRocmVzaG9sZCwgZG9uJ3QgdXBsb2FkIHRoZSBhdWRpbyBmb3IgdHJhbnNjcmlwdGlvblxcbiAgICAgIGlmIChkdXJhdGlvbiA8IHRocmVzaG9sZCkge1xcbiAgICAgICAgY29uc29sZS5sb2coXFxcIlVzZXIgc3RvcHBlZCBzcGVha2luZ1xcXCIpO1xcbiAgICAgICAgY29uc29sZS5sb2coXFxcIlJlY29yZGluZyB3YXMgdG9vIHNob3J0LCBub3QgdXBsb2FkaW5nIGZvciB0cmFuc2NyaXB0aW9uXFxcIik7XFxuICAgICAgICBwaUF1ZGlvTWFuYWdlci5yZXN1bWUoKTtcXG4gICAgICB9IGVsc2Uge1xcbiAgICAgICAgY29uc29sZS5sb2coXFxcIlVzZXIgZmluaXNoZWQgc3BlYWtpbmdcXFwiKTtcXG4gICAgICAgIHBpQXVkaW9NYW5hZ2VyLnN0b3AoKTtcXG4gICAgICB9XFxuICAgIH1cXG4gICAgLy8gUmVtb3ZlIHRoZSBzdG9wUmVjb3JkaW5nIGZ1bmN0aW9uXFxuICAgIGRlbGV0ZSB3aW5kb3cuc3RvcFJlY29yZGluZztcXG4gIH07XFxufVxcblxcbi8vIEFkZCB0aGUgc3RhcnRSZWNvcmRpbmcgZnVuY3Rpb24gdG8gdGhlIHdpbmRvdyBvYmplY3Qgc28gaXQgY2FuIGJlIGNhbGxlZCBmcm9tIG91dHNpZGUgdGhpcyBzY3JpcHRcXG53aW5kb3cuc3RhcnRSZWNvcmRpbmcgPSBzdGFydFJlY29yZGluZztcIjsiLCJleHBvcnQgZGVmYXVsdCBcIjw/eG1sIHZlcnNpb249XFxcIjEuMFxcXCIgZW5jb2Rpbmc9XFxcIlVURi04XFxcIj8+XFxuPHN2ZyBpZD1cXFwiTGF5ZXJfMVxcXCIgZGF0YS1uYW1lPVxcXCJMYXllciAxXFxcIiB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAzMDcgNjQwXFxcIj5cXG4gIDxkZWZzPlxcbiAgICA8c3R5bGU+XFxuICAgICAgLmlubmVybW9zdCwgLnNlY29uZCwgLnRoaXJkLCAuZm91cnRoLCAuZmlmdGgsIC5vdXRlcm1vc3Qge1xcbiAgICAgICAgc3Ryb2tlLXdpZHRoOiAwcHg7XFxuICAgICAgfVxcbiAgICAgIFxcbiAgICAgIC5vdXRlcm1vc3Qge1xcbiAgICAgICAgZmlsbDogI2U0ZjJkMTtcXG4gICAgICB9XFxuXFxuICAgICAgLnNlY29uZCB7XFxuICAgICAgICBmaWxsOiAjY2NlOGI1O1xcbiAgICAgIH1cXG5cXG4gICAgICAudGhpcmQge1xcbiAgICAgICAgZmlsbDogI2IzZGI5NTtcXG4gICAgICB9XFxuXFxuICAgICAgLmZvdXJ0aCB7XFxuICAgICAgICBmaWxsOiAjOWJkMDc4O1xcbiAgICAgIH1cXG5cXG4gICAgICAuZmlmdGgge1xcbiAgICAgICAgZmlsbDogIzgzYzU1YztcXG4gICAgICB9XFxuXFxuICAgICAgLmlubmVybW9zdCB7XFxuICAgICAgICBmaWxsOiAjNDI4YTJmO1xcbiAgICAgIH1cXG4gICAgPC9zdHlsZT5cXG4gIDwvZGVmcz5cXG4gIDxwYXRoIGNsYXNzPVxcXCJvdXRlcm1vc3RcXFwiIGQ9XFxcIm0zMDYuOSwzMjBjMCwxMDUuMy0uMDIsMjEwLjYuMSwzMTUuOTEsMCwzLjQyLS42Nyw0LjEtNC4wOSw0LjA5LTk5LjYtLjEyLTE5OS4yMS0uMTItMjk4LjgxLDBDLjY3LDY0MCwwLDYzOS4zMywwLDYzNS45MS4xMSw0MjUuMy4xMSwyMTQuNywwLDQuMDksMCwuNjcuNjcsMCw0LjA5LDAsMTAzLjcuMTIsMjAzLjMuMTIsMzAyLjkxLDBjMy40MiwwLDQuMS42Nyw0LjA5LDQuMDktLjEyLDEwNS4zLS4xLDIxMC42LS4xLDMxNS45MVpcXFwiLz5cXG4gIDxwYXRoIGNsYXNzPVxcXCJzZWNvbmRcXFwiIGQ9XFxcIm0yNzUuOTIsMzIzYzAsODcuNjMsMCwxNzUuMjcsMCwyNjIuOSwwLDcuMjQtLjU1LDcuOTMtNy44Niw3Ljk4LTE0LjY2LjA5LTI5LjMxLjAzLTQzLjk3LjAzLTYwLjk2LDAtMTIxLjkyLDAtMTgyLjg4LDBxLTcuMTMsMC03LjE0LTcuMjRjMC0xNzYuMSwwLTM1Mi4yMSwwLTUyOC4zMXEwLTcuMjYsNy4xMi03LjI2Yzc1Ljc4LDAsMTUxLjU2LDAsMjI3LjM1LDBxNy4zOCwwLDcuMzgsNy41YzAsODguMTMsMCwxNzYuMjcsMCwyNjQuNFpcXFwiLz5cXG4gIDxwYXRoIGNsYXNzPVxcXCJ0aGlyZFxcXCIgZD1cXFwibTY4LjA2LDMyMi4yNGMwLTY5LjQ3LDAtMTM4Ljk0LDAtMjA4LjQxLDAtOC45OSwxLjMzLTEwLjEzLDEwLjQ5LTkuMTIsMS45OC4yMiwzLjk4LjMyLDUuOTcuMzIsNDYuMTMuMDIsOTIuMjYuMDIsMTM4LjM5LDAsMy40OCwwLDYuOTItLjIzLDEwLjQxLS42Nyw1LjUtLjcsOC43NC40Niw4LjczLDcuMjUtLjE4LDEzOC45NC0uMTMsMjc3Ljg4LS4xMyw0MTYuODEsMCwuMzMsMCwuNjcsMCwxcS0uMTQsMTAuNTEtMTAuMzksMTAuNTFjLTUyLjEzLDAtMTA0LjI1LDAtMTU2LjM4LDBxLTcuMDksMC03LjA5LTcuMjhjMC03MC4xNCwwLTE0MC4yNywwLTIxMC40MVpcXFwiLz5cXG4gIDxwYXRoIGNsYXNzPVxcXCJmb3VydGhcXFwiIGQ9XFxcIm0xMDMuMDIsMzIyLjVjMC01Mi40NiwwLTEwNC45MSwwLTE1Ny4zNywwLTYuNjguMzYtNy4wNiw3LjA3LTcuMDYsMzAuMy0uMDEsNjAuNi4wNyw5MC45LS4wOSw0LjU0LS4wMiw2LjA4LDEuMzMsNi4wNyw1Ljk4LS4xLDEwNS41OC0uMSwyMTEuMTYsMCwzMTYuNzQsMCw0LjE4LTEuMjcsNS4zNy01LjM4LDUuMzUtMjkuMy0uMTUtNTguNi0uMDgtODcuOS0uMDhxLTEwLjc2LDAtMTAuNzYtMTEuMDljMC01MC43OSwwLTEwMS41OCwwLTE1Mi4zN1pcXFwiLz5cXG4gIDxwYXRoIGNsYXNzPVxcXCJmaWZ0aFxcXCIgZD1cXFwibTE3MywzMjIuMmMwLDM1LjI5LDAsNzAuNTgsMCwxMDUuODhxMCw2Ljg5LTYuOTksNi45Yy04LjE1LDAtMTYuMzEtLjEzLTI0LjQ2LjA2LTMuNDcuMDgtNC42OC0xLjA5LTQuNjEtNC41OS4xOC05LjY1LjA2LTE5LjMxLjA2LTI4Ljk2LDAtNTguMjYtLjAxLTExNi41My4wMi0xNzQuNzksMC00Ljc2LTEuMTItOS40Ni0uMTQtMTQuMy41MS0yLjU0LDEuMzktMy4zOCwzLjgtMy4zNiw4LjgyLjA2LDE3LjY0LjE0LDI2LjQ2LS4wMiw0LjU5LS4wOSw1Ljk1LDEuODUsNS45NCw2LjMzLS4xNCwzNS42Mi0uMDgsNzEuMjUtLjA4LDEwNi44N1pcXFwiLz5cXG4gIDxwYXRoIGNsYXNzPVxcXCJpbm5lcm1vc3RcXFwiIGQ9XFxcIm0xNTEuMDQsMzIyLjAxYzAtOS45OS4wNy0xOS45Ny0uMDUtMjkuOTYtLjA0LTIuOTMuODMtNC4xOCwzLjk1LTQuMTgsMy4wNiwwLDQuMDMsMS4xMiw0LjAyLDQuMTEtLjA5LDE5Ljk3LS4wOCwzOS45NC4wMSw1OS45MS4wMSwyLjk2LS44NCw0LjE2LTMuOTYsNC4xNC0zLjAzLS4wMS00LjA4LTEuMDQtNC4wMy00LjA4LjE0LTkuOTguMDUtMTkuOTcuMDUtMjkuOTZaXFxcIi8+XFxuPC9zdmc+XCI7IiwiZXhwb3J0IGRlZmF1bHQgXCI8c3ZnIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgdmVyc2lvbj1cXFwiMS4wXFxcIiB2aWV3Qm94PVxcXCIwIDAgNTYuMjUgMzBcXFwiIGNsYXNzPVxcXCJ3YXZlZm9ybVxcXCI+XFxuICAgIDxkZWZzPlxcbiAgICAgICAgPGNsaXBQYXRoIGlkPVxcXCJhXFxcIj5cXG4gICAgICAgICAgICA8cGF0aCBkPVxcXCJNLjU0IDEySDN2NUguNTRabTAgMFxcXCIvPlxcbiAgICAgICAgPC9jbGlwUGF0aD5cXG4gICAgICAgIDxjbGlwUGF0aCBpZD1cXFwiYlxcXCI+XFxuICAgICAgICAgICAgPHBhdGggZD1cXFwiTTI1IDIuMmgydjI0LjY4aC0yWm0wIDBcXFwiLz5cXG4gICAgICAgIDwvY2xpcFBhdGg+XFxuICAgICAgICA8Y2xpcFBhdGggaWQ9XFxcImNcXFwiPlxcbiAgICAgICAgICAgIDxwYXRoIGQ9XFxcIk01MyAxMmgxLjk4djVINTNabTAgMFxcXCIvPlxcbiAgICAgICAgPC9jbGlwUGF0aD5cXG4gICAgPC9kZWZzPlxcbiAgICA8ZyBjbGlwLXBhdGg9XFxcInVybCgjYSlcXFwiPlxcbiAgICAgICAgPHBhdGggZD1cXFwiTTEuNDggMTIuNzFjLS41IDAtLjkuNC0uOS45djEuODVhLjkuOSAwIDAgMCAxLjggMHYtMS44NGMwLS41LS40LS45LS45LS45Wm0wIDBcXFwiLz5cXG4gICAgPC9nPlxcbiAgICA8cGF0aCBkPVxcXCJNNC45OCA2LjYzYy0uNSAwLS45LjQtLjkuOXYxNC4wMWEuOS45IDAgMCAwIDEuODEgMHYtMTRjMC0uNS0uNC0uOTItLjktLjkyWm0zLjUxIDMuMWEuOS45IDAgMCAwLS45LjkxdjcuNzlhLjkuOSAwIDAgMCAxLjggMHYtNy43OWMwLS41LS40LS45LS45LS45Wk0xMiAzLjgzYS45LjkgMCAwIDAtLjkxLjl2MTkuNmEuOS45IDAgMCAwIDEuOCAwVjQuNzRjMC0uNS0uNC0uOS0uOS0uOVptMy41IDguMjlhLjkuOSAwIDAgMC0uOTEuOXYzLjAzYS45LjkgMCAwIDAgMS44MSAwdi0zLjAzYzAtLjUtLjQtLjktLjktLjlaTTE5IDYuOGMtLjUgMC0uOS40LS45Ljl2MTMuNjhhLjkuOSAwIDAgMCAxLjggMFY3LjdjMC0uNS0uNC0uOS0uOS0uOVptMy41OC0yLjk3aC0uMDFjLS41IDAtLjkuNC0uOS45bC0uMTMgMTkuNmMwIC41LjQuOS45LjkxLjUgMCAuOS0uNC45LS45bC4xNC0xOS42YS45LjkgMCAwIDAtLjktLjlabTAgMFxcXCIvPlxcbiAgICA8ZyBjbGlwLXBhdGg9XFxcInVybCgjYilcXFwiPlxcbiAgICAgICAgPHBhdGggZD1cXFwiTTI2IDIuMmMtLjUgMC0uOS40LS45Ljl2MjIuODZhLjkuOSAwIDEgMCAxLjgxIDBWMy4xMWEuOS45IDAgMCAwLS45LS45MVptMCAwXFxcIi8+XFxuICAgIDwvZz5cXG4gICAgPHBhdGggZD1cXFwiTTI5LjUyIDcuNzFhLjkuOSAwIDAgMC0uOTEuOXYxMS44NWEuOS45IDAgMCAwIDEuODEgMFY4LjYyYzAtLjUtLjQtLjktLjktLjlabTMuNSAyLjkzYS45LjkgMCAwIDAtLjkuOTF2NS45N2EuOS45IDAgMCAwIDEuOCAwdi01Ljk3YzAtLjUtLjQtLjktLjktLjlabTMuNS01Ljc4Yy0uNSAwLS45LjQtLjkuOXYxNy41NWEuOS45IDAgMCAwIDEuODEgMFY1Ljc2YzAtLjUtLjQtLjktLjktLjlabTMuNTEgMy4zNGMtLjUgMC0uOS40LS45Ljl2MTAuODdhLjkuOSAwIDAgMCAxLjggMFY5LjFhLjkuOSAwIDAgMC0uOS0uOTFabTMuNSAzLjA4Yy0uNSAwLS45LjQtLjkuOTF2NC43YS45LjkgMCAxIDAgMS44IDB2LTQuN2EuOS45IDAgMCAwLS45LS45Wm0zLjUxLTcuNDVhLjkuOSAwIDAgMC0uOTEuOXYxOS42YS45LjkgMCAwIDAgMS44MSAwVjQuNzRjMC0uNS0uNC0uOS0uOS0uOVptMy41IDUuNTdhLjkuOSAwIDAgMC0uOS45MXY4LjQ1YS45LjkgMCAwIDAgMS44IDB2LTguNDVjMC0uNS0uNC0uOS0uOS0uOVptMCAwXFxcIi8+XFxuICAgIDxnIGNsaXAtcGF0aD1cXFwidXJsKCNjKVxcXCI+XFxuICAgICAgICA8cGF0aCBkPVxcXCJNNTQuMDQgMTIuOTZhLjkuOSAwIDAgMC0uOS45MXYxLjMzYS45LjkgMCAxIDAgMS44IDB2LTEuMzJhLjkuOSAwIDAgMC0uOS0uOTJabTAgMFxcXCIvPlxcbiAgICA8L2c+XFxuPC9zdmc+XCI7IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL21vYmlsZS5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL21vYmlsZS5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vcmVjdGFuZ2xlcy5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3JlY3RhbmdsZXMuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3RhbGtCdXR0b24uY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi90YWxrQnV0dG9uLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiaW1wb3J0IFwiLi90YWxrQnV0dG9uLmNzc1wiO1xuaW1wb3J0IFwiLi9tb2JpbGUuY3NzXCI7XG5pbXBvcnQgXCIuL3JlY3RhbmdsZXMuY3NzXCI7XG5pbXBvcnQgdGFsa0ljb25TVkcgZnJvbSBcIi4vd2F2ZWZvcm0uc3ZnXCI7XG5pbXBvcnQgcmVjdGFuZ2xlc1NWRyBmcm9tIFwiLi9yZWN0YW5nbGVzLnN2Z1wiO1xuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgY29uc3QgbG9jYWxDb25maWcgPSB7XG4gICAgYXBwU2VydmVyVXJsOiBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMFwiLFxuICAgIGFwaVNlcnZlclVybDogXCJodHRwczovL2xvY2FsaG9zdDo1MDAwXCIsXG4gICAgLy8gQWRkIG90aGVyIGNvbmZpZ3VyYXRpb24gcHJvcGVydGllcyBhcyBuZWVkZWRcbiAgfTtcblxuICAvLyBEZWZpbmUgYSBnbG9iYWwgY29uZmlndXJhdGlvbiBwcm9wZXJ0eVxuICBjb25zdCBwcm9kdWN0aW9uQ29uZmlnID0ge1xuICAgIGFwcFNlcnZlclVybDogXCJodHRwczovL2FwcC5zYXlwaS5haVwiLFxuICAgIGFwaVNlcnZlclVybDogXCJodHRwczovL2FwaS5zYXlwaS5haVwiLFxuICAgIC8vIEFkZCBvdGhlciBjb25maWd1cmF0aW9uIHByb3BlcnRpZXMgYXMgbmVlZGVkXG4gIH07XG4gIGNvbnN0IGNvbmZpZyA9IHByb2R1Y3Rpb25Db25maWc7XG5cbiAgY29uc3QgcGFnZVNjcmlwdCA9IHJlcXVpcmUoXCJyYXctbG9hZGVyIS4vdHJhbnNjcmliZXIuanNcIikuZGVmYXVsdDtcblxuICAvLyBDcmVhdGUgYSBNdXRhdGlvbk9ic2VydmVyIHRvIGxpc3RlbiBmb3IgY2hhbmdlcyB0byB0aGUgRE9NXG4gIHZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uIChtdXRhdGlvbnMpIHtcbiAgICAvLyBDaGVjayBlYWNoIG11dGF0aW9uXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtdXRhdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBtdXRhdGlvbiA9IG11dGF0aW9uc1tpXTtcblxuICAgICAgLy8gSWYgbm9kZXMgd2VyZSBhZGRlZCwgY2hlY2sgZWFjaCBvbmVcbiAgICAgIGlmIChtdXRhdGlvbi5hZGRlZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBtdXRhdGlvbi5hZGRlZE5vZGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgdmFyIG5vZGUgPSBtdXRhdGlvbi5hZGRlZE5vZGVzW2pdO1xuXG4gICAgICAgICAgLy8gSWYgdGhlIG5vZGUgaXMgdGhlIGFwcHJvcHJpYXRlIGNvbnRhaW5lciBlbGVtZW50LCBhZGQgdGhlIGJ1dHRvbiBhbmQgc3RvcCBvYnNlcnZpbmdcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiZGl2XCIgJiZcbiAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZml4ZWRcIikgJiZcbiAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYm90dG9tLTE2XCIpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB2YXIgZm9vdGVyID0gbm9kZTtcbiAgICAgICAgICAgIHZhciBidXR0b25Db250YWluZXIgPSBmb290ZXIucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgICAgXCIucmVsYXRpdmUuZmxleC5mbGV4LWNvbFwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKGJ1dHRvbkNvbnRhaW5lcikge1xuICAgICAgICAgICAgICBhZGRUYWxrQnV0dG9uKGJ1dHRvbkNvbnRhaW5lcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJObyBidXR0b24gY29udGFpbmVyIGZvdW5kIGluIGZvb3RlclwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaWRlbnRpZnlGb290ZXIoKSkge1xuICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJGb290ZXIgbm90IGZvdW5kXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIGZ1bmN0aW9uIGlkZW50aWZ5Rm9vdGVyKCkge1xuICAgIC8vIEZpbmQgYWxsIGF1ZGlvIGVsZW1lbnRzIG9uIHRoZSBwYWdlXG4gICAgdmFyIGF1ZGlvRWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiYXVkaW9cIik7XG4gICAgdmFyIGZvdW5kID0gZmFsc2U7IC8vIGRlZmF1bHQgdG8gbm90IGZvdW5kXG5cbiAgICBhdWRpb0VsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGF1ZGlvKSB7XG4gICAgICB2YXIgcHJlY2VkaW5nRGl2ID0gYXVkaW8ucHJldmlvdXNFbGVtZW50U2libGluZztcblxuICAgICAgLy8gSWYgd2UndmUgYWxyZWFkeSBmb3VuZCBhIGRpdiwgd2UgY2FuIHNraXAgZnVydGhlciBpdGVyYXRpb25zXG4gICAgICBpZiAoZm91bmQpIHJldHVybjtcblxuICAgICAgLy8gQ2hlY2sgaWYgdGhlIHByZWNlZGluZyBlbGVtZW50IGlzIGEgZGl2XG4gICAgICBpZiAocHJlY2VkaW5nRGl2ICYmIHByZWNlZGluZ0Rpdi50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiZGl2XCIpIHtcbiAgICAgICAgLy8gQXNzaWduIGFuIElEIHRvIHRoZSBkaXZcbiAgICAgICAgcHJlY2VkaW5nRGl2LmlkID0gXCJzYXlwaS1mb290ZXJcIjtcbiAgICAgICAgZm91bmQgPSB0cnVlOyAvLyBzZXQgdG8gZm91bmRcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBmb3VuZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluamVjdFNjcmlwdChjYWxsYmFjaykge1xuICAgIHZhciBzY3JpcHRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICBzY3JpcHRFbGVtZW50LnR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiO1xuICAgIHNjcmlwdEVsZW1lbnQuaWQgPSBcInNheXBpLXNjcmlwdFwiO1xuICAgIGNvbnN0IGNvbmZpZ1RleHQgPSBcInZhciBjb25maWcgPSBcIiArIEpTT04uc3RyaW5naWZ5KGNvbmZpZykgKyBcIjtcIjtcbiAgICBzY3JpcHRFbGVtZW50LnRleHRDb250ZW50ID0gY29uZmlnVGV4dCArIHBhZ2VTY3JpcHQ7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHRFbGVtZW50KTtcblxuICAgIC8vIENhbGwgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIGFmdGVyIHRoZSBzY3JpcHQgaXMgYWRkZWRcbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaXNNb2JpbGVWaWV3KCkge1xuICAgIHJldHVybiB3aW5kb3cubWF0Y2hNZWRpYShcIihtYXgtd2lkdGg6IDc2OHB4KVwiKS5tYXRjaGVzO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkVGFsa0J1dHRvbihjb250YWluZXIpIHtcbiAgICAvLyBjcmVhdGUgYSBjb250YWluaW5nIGRpdlxuICAgIHZhciBwYW5lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgcGFuZWwuaWQgPSBcInNheXBpLXBhbmVsXCI7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHBhbmVsKTtcblxuICAgIHZhciBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgIGJ1dHRvbi5pZCA9IFwic2F5cGktdGFsa0J1dHRvblwiO1xuICAgIGJ1dHRvbi50eXBlID0gXCJidXR0b25cIjtcbiAgICBidXR0b24uY2xhc3NOYW1lID1cbiAgICAgIFwicmVsYXRpdmUgZmxleCBtdC0xIG1iLTEgcm91bmRlZC1mdWxsIHB4LTIgcHktMyB0ZXh0LWNlbnRlciBiZy1jcmVhbS01NTAgaG92ZXI6YmctY3JlYW0tNjUwIGhvdmVyOnRleHQtYnJhbmQtZ3JlZW4tNzAwIHRleHQtbXV0ZWRcIjtcbiAgICAvLyBTZXQgQVJJQSBsYWJlbCBhbmQgdG9vbHRpcFxuICAgIGNvbnN0IGxhYmVsID1cbiAgICAgIFwiVGFsayAoSG9sZCBDb250cm9sICsgU3BhY2UgdG8gdXNlIGhvdGtleS4gRG91YmxlIGNsaWNrIHRvIHRvZ2dsZSBhdXRvLXN1Ym1pdCBvbi9vZmYpXCI7XG4gICAgYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgbGFiZWwpO1xuICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiLCBsYWJlbCk7XG4gICAgLy8gZW5hYmxlIGF1dG9zdWJtaXQgYnkgZGVmYXVsdFxuICAgIGJ1dHRvbi5kYXRhc2V0LmF1dG9zdWJtaXQgPSBcInRydWVcIjtcbiAgICBidXR0b24uY2xhc3NMaXN0LmFkZChcImF1dG9TdWJtaXRcIik7XG4gICAgcGFuZWwuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgICBhZGRUYWxrQnV0dG9uU3R5bGVzKCk7XG4gICAgYWRkVGFsa0ljb24oYnV0dG9uKTtcblxuICAgIC8vIENhbGwgdGhlIGZ1bmN0aW9uIHRvIGluamVjdCB0aGUgc2NyaXB0IGFmdGVyIHRoZSBidXR0b24gaGFzIGJlZW4gYWRkZWRcbiAgICBpbmplY3RTY3JpcHQocmVnaXN0ZXJBdWRpb0J1dHRvbkV2ZW50cyk7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRUYWxrSWNvbihidXR0b24pIHtcbiAgICB1cGRhdGVJY29uQ29udGVudChidXR0b24pO1xuXG4gICAgd2luZG93Lm1hdGNoTWVkaWEoXCIobWF4LXdpZHRoOiA3NjhweClcIikuYWRkTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgdXBkYXRlSWNvbkNvbnRlbnQoYnV0dG9uKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZUljb25Db250ZW50KGljb25Db250YWluZXIpIHtcbiAgICBpZiAoaXNNb2JpbGVWaWV3KCkpIHtcbiAgICAgIGljb25Db250YWluZXIuaW5uZXJIVE1MID0gcmVjdGFuZ2xlc1NWRztcbiAgICB9IGVsc2Uge1xuICAgICAgaWNvbkNvbnRhaW5lci5pbm5lckhUTUwgPSB0YWxrSWNvblNWRztcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBhZGRTdHlsZXMoY3NzKSB7XG4gICAgY29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gICAgc3R5bGUudHlwZSA9IFwidGV4dC9jc3NcIjtcbiAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFRhbGtCdXR0b25TdHlsZXMoKSB7XG4gICAgdmFyIGlzRmlyZWZveEFuZHJvaWQgPVxuICAgICAgL0ZpcmVmb3gvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgJiZcbiAgICAgIC9BbmRyb2lkLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAgIGlmIChpc0ZpcmVmb3hBbmRyb2lkKSB7XG4gICAgICAvLyBoYWNrIGZvciBGaXJlZm94IG9uIEFuZHJvaWQsIHdoaWNoIGRvZXNuJ3Qgc3VwcG9ydCA6YWN0aXZlIGNvcnJlY3RseVxuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJmaXJlZm94LWFuZHJvaWRcIik7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVnaXN0ZXJBdWRpb0J1dHRvbkV2ZW50cygpIHtcbiAgICB2YXIgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS10YWxrQnV0dG9uXCIpO1xuICAgIHZhciBjb250ZXh0ID0gd2luZG93O1xuICAgIGlmIChHTV9pbmZvLnNjcmlwdEhhbmRsZXIgIT09IFwiVXNlcnNjcmlwdHNcIikge1xuICAgICAgY29udGV4dCA9IHVuc2FmZVdpbmRvdztcbiAgICB9XG5cbiAgICAvLyBGb3IgZGVza3RvcFxuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlkUHJvbXB0VGV4dEFyZWEoKTtcbiAgICAgIGNvbnRleHQuc3RhcnRSZWNvcmRpbmcoKTtcbiAgICB9KTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHR5cGVvZiBjb250ZXh0Py5zdG9wUmVjb3JkaW5nID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgY29udGV4dC5zdG9wUmVjb3JkaW5nKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZWdpc3RlckhvdGtleSgpO1xuXG4gICAgLy8gXCJ3YXJtIHVwXCIgdGhlIG1pY3JvcGhvbmUgYnkgYWNxdWlyaW5nIGl0IGJlZm9yZSB0aGUgdXNlciBwcmVzc2VzIHRoZSBidXR0b25cbiAgICBkb2N1bWVudFxuICAgICAgLmdldEVsZW1lbnRCeUlkKFwic2F5cGktdGFsa0J1dHRvblwiKVxuICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWVudGVyXCIsIHNldHVwUmVjb3JkaW5nKTtcbiAgICBkb2N1bWVudFxuICAgICAgLmdldEVsZW1lbnRCeUlkKFwic2F5cGktdGFsa0J1dHRvblwiKVxuICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsIHRlYXJEb3duUmVjb3JkaW5nKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImJlZm9yZXVubG9hZFwiLCB0ZWFyRG93blJlY29yZGluZyk7XG5cbiAgICAvLyBBdHRhY2ggYSBkb3VibGUgY2xpY2sgZXZlbnQgbGlzdGVuZXIgdG8gdGhlIHRhbGsgYnV0dG9uXG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJkYmxjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBUb2dnbGUgdGhlIENTUyBjbGFzc2VzIHRvIGluZGljYXRlIHRoZSBtb2RlXG4gICAgICBidXR0b24uY2xhc3NMaXN0LnRvZ2dsZShcImF1dG9TdWJtaXRcIik7XG5cbiAgICAgIC8vIFN0b3JlIHRoZSBzdGF0ZSBvbiB0aGUgYnV0dG9uIGVsZW1lbnQgdXNpbmcgYSBjdXN0b20gZGF0YSBhdHRyaWJ1dGVcbiAgICAgIGlmIChidXR0b24uZ2V0QXR0cmlidXRlKFwiZGF0YS1hdXRvc3VibWl0XCIpID09PSBcInRydWVcIikge1xuICAgICAgICBidXR0b24uc2V0QXR0cmlidXRlKFwiZGF0YS1hdXRvc3VibWl0XCIsIFwiZmFsc2VcIik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiYXV0b3N1Ym1pdCBkaXNhYmxlZFwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJkYXRhLWF1dG9zdWJtaXRcIiwgXCJ0cnVlXCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhcImF1dG9zdWJtaXQgZW5hYmxlZFwiKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIEZvciBtb2JpbGVcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTsgLy8gUHJldmVudCB0aGUgZGVmYXVsdCBjbGljayBiZWhhdmlvciBmcm9tIGhhcHBlbmluZ1xuICAgICAgaWRQcm9tcHRUZXh0QXJlYSgpO1xuICAgICAgY29udGV4dC5zdGFydFJlY29yZGluZygpO1xuICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpOyAvLyBBZGQgdGhlIGFjdGl2ZSBjbGFzcyAoZm9yIEZpcmVmb3ggb24gQW5kcm9pZClcbiAgICB9KTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTsgLy8gUmVtb3ZlIHRoZSBhY3RpdmUgY2xhc3MgKGZvciBGaXJlZm94IG9uIEFuZHJvaWRcbiAgICAgIGNvbnRleHQuc3RvcFJlY29yZGluZygpO1xuICAgIH0pO1xuICAgIGRvY3VtZW50XG4gICAgICAuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS10YWxrQnV0dG9uXCIpXG4gICAgICAuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoY2FuY2VsXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpOyAvLyBSZW1vdmUgdGhlIGFjdGl2ZSBjbGFzcyAoZm9yIEZpcmVmb3ggb24gQW5kcm9pZFxuICAgICAgICB0ZWFyRG93blJlY29yZGluZygpO1xuICAgICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiByZWdpc3RlckhvdGtleSgpIHtcbiAgICAvLyBSZWdpc3RlciBhIGhvdGtleSBmb3IgdGhlIGJ1dHRvblxuICAgIGxldCBjdHJsRG93biA9IGZhbHNlO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBpZiAoZXZlbnQuY3RybEtleSAmJiBldmVudC5jb2RlID09PSBcIlNwYWNlXCIgJiYgIWN0cmxEb3duKSB7XG4gICAgICAgIGN0cmxEb3duID0gdHJ1ZTtcbiAgICAgICAgLy8gU2ltdWxhdGUgbW91c2Vkb3duIGV2ZW50XG4gICAgICAgIGxldCBtb3VzZURvd25FdmVudCA9IG5ldyBFdmVudChcIm1vdXNlZG93blwiKTtcbiAgICAgICAgZG9jdW1lbnRcbiAgICAgICAgICAuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS10YWxrQnV0dG9uXCIpXG4gICAgICAgICAgLmRpc3BhdGNoRXZlbnQobW91c2VEb3duRXZlbnQpO1xuICAgICAgICB0YWxrQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7IC8vIEFkZCB0aGUgYWN0aXZlIGNsYXNzXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBpZiAoY3RybERvd24gJiYgZXZlbnQuY29kZSA9PT0gXCJTcGFjZVwiKSB7XG4gICAgICAgIGN0cmxEb3duID0gZmFsc2U7XG4gICAgICAgIC8vIFNpbXVsYXRlIG1vdXNldXAgZXZlbnRcbiAgICAgICAgbGV0IG1vdXNlVXBFdmVudCA9IG5ldyBFdmVudChcIm1vdXNldXBcIik7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F5cGktdGFsa0J1dHRvblwiKS5kaXNwYXRjaEV2ZW50KG1vdXNlVXBFdmVudCk7XG4gICAgICAgIHRhbGtCdXR0b24uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlkUHJvbXB0VGV4dEFyZWEoKSB7XG4gICAgdmFyIHRleHRhcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcm9tcHRcIik7XG4gICAgaWYgKCF0ZXh0YXJlYSkge1xuICAgICAgLy8gRmluZCB0aGUgZmlyc3QgPHRleHRhcmVhPiBlbGVtZW50IGFuZCBnaXZlIGl0IGFuIGlkXG4gICAgICB2YXIgdGV4dGFyZWFFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInRleHRhcmVhXCIpO1xuICAgICAgaWYgKHRleHRhcmVhRWxlbWVudCkge1xuICAgICAgICB0ZXh0YXJlYUVsZW1lbnQuaWQgPSBcInByb21wdFwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJObyA8dGV4dGFyZWE+IGVsZW1lbnQgZm91bmRcIik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gU3RhcnQgb2JzZXJ2aW5nIHRoZSBlbnRpcmUgZG9jdW1lbnQgZm9yIGNoYW5nZXMgdG8gY2hpbGQgbm9kZXMgYW5kIHN1YnRyZWVcbiAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudCwgeyBjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWUgfSk7XG59KSgpO1xuIl0sIm5hbWVzIjpbInRhbGtJY29uU1ZHIiwicmVjdGFuZ2xlc1NWRyIsImxvY2FsQ29uZmlnIiwiYXBwU2VydmVyVXJsIiwiYXBpU2VydmVyVXJsIiwicHJvZHVjdGlvbkNvbmZpZyIsImNvbmZpZyIsInBhZ2VTY3JpcHQiLCJyZXF1aXJlIiwib2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwibXV0YXRpb25zIiwiaSIsImxlbmd0aCIsIm11dGF0aW9uIiwiYWRkZWROb2RlcyIsImoiLCJub2RlIiwibm9kZU5hbWUiLCJ0b0xvd2VyQ2FzZSIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwiZm9vdGVyIiwiYnV0dG9uQ29udGFpbmVyIiwicXVlcnlTZWxlY3RvciIsImFkZFRhbGtCdXR0b24iLCJjb25zb2xlIiwid2FybiIsImlkZW50aWZ5Rm9vdGVyIiwiZGlzY29ubmVjdCIsImF1ZGlvRWxlbWVudHMiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmb3VuZCIsImZvckVhY2giLCJhdWRpbyIsInByZWNlZGluZ0RpdiIsInByZXZpb3VzRWxlbWVudFNpYmxpbmciLCJ0YWdOYW1lIiwiaWQiLCJpbmplY3RTY3JpcHQiLCJjYWxsYmFjayIsInNjcmlwdEVsZW1lbnQiLCJjcmVhdGVFbGVtZW50IiwidHlwZSIsImNvbmZpZ1RleHQiLCJKU09OIiwic3RyaW5naWZ5IiwidGV4dENvbnRlbnQiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJpc01vYmlsZVZpZXciLCJ3aW5kb3ciLCJtYXRjaE1lZGlhIiwibWF0Y2hlcyIsImNvbnRhaW5lciIsInBhbmVsIiwiYnV0dG9uIiwiY2xhc3NOYW1lIiwibGFiZWwiLCJzZXRBdHRyaWJ1dGUiLCJkYXRhc2V0IiwiYXV0b3N1Ym1pdCIsImFkZCIsImFkZFRhbGtCdXR0b25TdHlsZXMiLCJhZGRUYWxrSWNvbiIsInJlZ2lzdGVyQXVkaW9CdXR0b25FdmVudHMiLCJ1cGRhdGVJY29uQ29udGVudCIsImFkZExpc3RlbmVyIiwiaWNvbkNvbnRhaW5lciIsImlubmVySFRNTCIsImFkZFN0eWxlcyIsImNzcyIsInN0eWxlIiwiY3JlYXRlVGV4dE5vZGUiLCJoZWFkIiwiaXNGaXJlZm94QW5kcm9pZCIsInRlc3QiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJkb2N1bWVudEVsZW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImNvbnRleHQiLCJHTV9pbmZvIiwic2NyaXB0SGFuZGxlciIsInVuc2FmZVdpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJpZFByb21wdFRleHRBcmVhIiwic3RhcnRSZWNvcmRpbmciLCJfY29udGV4dCIsInN0b3BSZWNvcmRpbmciLCJyZWdpc3RlckhvdGtleSIsInNldHVwUmVjb3JkaW5nIiwidGVhckRvd25SZWNvcmRpbmciLCJ0b2dnbGUiLCJnZXRBdHRyaWJ1dGUiLCJsb2ciLCJlIiwicHJldmVudERlZmF1bHQiLCJyZW1vdmUiLCJjdHJsRG93biIsImV2ZW50IiwiY3RybEtleSIsImNvZGUiLCJtb3VzZURvd25FdmVudCIsIkV2ZW50IiwiZGlzcGF0Y2hFdmVudCIsInRhbGtCdXR0b24iLCJtb3VzZVVwRXZlbnQiLCJ0ZXh0YXJlYSIsInRleHRhcmVhRWxlbWVudCIsIm9ic2VydmUiLCJjaGlsZExpc3QiLCJzdWJ0cmVlIl0sInNvdXJjZVJvb3QiOiIifQ==