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

/***/ "./node_modules/css-loader/dist/cjs.js!./src/mobileStyles.css":
/*!********************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/mobileStyles.css ***!
  \********************************************************************/
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
    #control-panel, #pi-panel, #saypi-panel {
        width: 100%;
        position: fixed;
        left: 0;
      }
      #control-panel {
        height: 10vh;
        top: 0;
        background-color: rgba(245, 238, 223, 0.5);
    }
      #pi-panel {
        height: 50vh;
        background-color: rgba(0, 128, 0, 0.5);
        top: 10vh;
      }
      #saypi-panel {
        height: 40vh;
        background-color: rgba(245, 238, 223, 0.5);
        bottom: 0;
      }                
      /* make the buttons fill the panels */
      #saypi-talkButton {
        width: 100%;
        height: 100%;
        background-color: transparent;
        border-radius: 0;
        margin: 0;
      }
      /* move audio controls (mute/unmute, voice selection) to top */
      div[data-projection-id='13'] {
        position: absolute;
        bottom: 79vh;
        right: 30px;
      }
      /* flip voice list below audio controls */
      div[data-projection-id='14'] {
        position: relative;
        top: 325px;
      }
}`, "",{"version":3,"sources":["webpack://./src/mobileStyles.css"],"names":[],"mappings":"AAAA;IACI,0BAA0B;IAC1B;QACI,WAAW;QACX,eAAe;QACf,OAAO;MACT;MACA;QACE,YAAY;QACZ,MAAM;QACN,0CAA0C;IAC9C;MACE;QACE,YAAY;QACZ,sCAAsC;QACtC,SAAS;MACX;MACA;QACE,YAAY;QACZ,0CAA0C;QAC1C,SAAS;MACX;MACA,qCAAqC;MACrC;QACE,WAAW;QACX,YAAY;QACZ,6BAA6B;QAC7B,gBAAgB;QAChB,SAAS;MACX;MACA,8DAA8D;MAC9D;QACE,kBAAkB;QAClB,YAAY;QACZ,WAAW;MACb;MACA,yCAAyC;MACzC;QACE,kBAAkB;QAClB,UAAU;MACZ;AACN","sourcesContent":["@media (max-width: 768px) {\n    /* mobile styles go here */\n    #control-panel, #pi-panel, #saypi-panel {\n        width: 100%;\n        position: fixed;\n        left: 0;\n      }\n      #control-panel {\n        height: 10vh;\n        top: 0;\n        background-color: rgba(245, 238, 223, 0.5);\n    }\n      #pi-panel {\n        height: 50vh;\n        background-color: rgba(0, 128, 0, 0.5);\n        top: 10vh;\n      }\n      #saypi-panel {\n        height: 40vh;\n        background-color: rgba(245, 238, 223, 0.5);\n        bottom: 0;\n      }                \n      /* make the buttons fill the panels */\n      #saypi-talkButton {\n        width: 100%;\n        height: 100%;\n        background-color: transparent;\n        border-radius: 0;\n        margin: 0;\n      }\n      /* move audio controls (mute/unmute, voice selection) to top */\n      div[data-projection-id='13'] {\n        position: absolute;\n        bottom: 79vh;\n        right: 30px;\n      }\n      /* flip voice list below audio controls */\n      div[data-projection-id='14'] {\n        position: relative;\n        top: 325px;\n      }\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/talkButtonStyles.css":
/*!************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/talkButtonStyles.css ***!
  \************************************************************************/
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
}`, "",{"version":3,"sources":["webpack://./src/talkButtonStyles.css"],"names":[],"mappings":"AAAA;IACI;QACI,mBAAmB;IACvB;IACA;QACI,qBAAqB;IACzB;IACA;QACI,mBAAmB;IACvB;AACJ;AACA;IACI,mBAAmB;IACnB,mBAAmB;IACnB,YAAY;IACZ,cAAc,EAAE,eAAe;AACnC;;AAEA;;IAEI,4BAA4B;AAChC;AACA;IACI,aAAa;AACjB;AACA;IACI,oBAAoB,EAAE,8BAA8B;AACxD","sourcesContent":["@keyframes pulse {\n    0% {\n        transform: scale(1);\n    }\n    50% {\n        transform: scale(0.9);\n    }\n    100% {\n        transform: scale(1);\n    }\n}\n#saypi-talkButton {\n    margin-top: 0.25rem;\n    border-radius: 18px;\n    width: 120px;\n    display: block; /* For Safari */\n}\n\nhtml:not(.firefox-android) #saypi-talkButton:active .waveform,\n#saypi-talkButton.active .waveform {\n    animation: pulse 1s infinite;\n}            \n#saypi-talkButton .waveform {\n    fill: #776d6d;\n}\n#saypi-talkButton.autoSubmit .waveform {\n    fill: rgb(65 138 47); /* Pi's text-brand-green-600 */\n}"],"sourceRoot":""}]);
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

/***/ "./src/mobileStyles.css":
/*!******************************!*\
  !*** ./src/mobileStyles.css ***!
  \******************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_mobileStyles_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./mobileStyles.css */ "./node_modules/css-loader/dist/cjs.js!./src/mobileStyles.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_mobileStyles_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_mobileStyles_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_mobileStyles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_mobileStyles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/talkButtonStyles.css":
/*!**********************************!*\
  !*** ./src/talkButtonStyles.css ***!
  \**********************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_talkButtonStyles_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./talkButtonStyles.css */ "./node_modules/css-loader/dist/cjs.js!./src/talkButtonStyles.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_talkButtonStyles_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_talkButtonStyles_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_talkButtonStyles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_talkButtonStyles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


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
/* harmony import */ var _talkButtonStyles_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./talkButtonStyles.css */ "./src/talkButtonStyles.css");
/* harmony import */ var _mobileStyles_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mobileStyles.css */ "./src/mobileStyles.css");
/* harmony import */ var _waveform_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./waveform.svg */ "./src/waveform.svg");



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
              console.log("No button container found in footer");
            }
            observer.disconnect();
            return;
          }
        }
      }
    }
  });
  addControlPanel();
  function addControlPanel() {
    var controlPanel = document.createElement("div");
    controlPanel.id = "control-panel";
    document.body.prepend(controlPanel);
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
    var icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    button.appendChild(icon);
    icon.outerHTML = _waveform_svg__WEBPACK_IMPORTED_MODULE_2__["default"];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RSxZQUFZLENBQUM7UUFDdkVELFVBQVUsQ0FBQzVFLFNBQVMsQ0FBQ29FLE1BQU0sQ0FBQyxRQUFRLENBQUM7TUFDdkM7SUFDRixDQUFDLENBQUM7RUFDSjtFQUVBLFNBQVNYLGdCQUFnQkEsQ0FBQSxFQUFHO0lBQzFCLElBQUlxQixRQUFRLEdBQUduRSxRQUFRLENBQUN1QyxjQUFjLENBQUMsUUFBUSxDQUFDO0lBQ2hELElBQUksQ0FBQzRCLFFBQVEsRUFBRTtNQUNiO01BQ0EsSUFBSUMsZUFBZSxHQUFHcEUsUUFBUSxDQUFDUCxhQUFhLENBQUMsVUFBVSxDQUFDO01BQ3hELElBQUkyRSxlQUFlLEVBQUU7UUFDbkJBLGVBQWUsQ0FBQ2xFLEVBQUUsR0FBRyxRQUFRO01BQy9CLENBQUMsTUFBTTtRQUNMUCxPQUFPLENBQUNDLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQztNQUM1QztJQUNGO0VBQ0Y7O0VBRUE7RUFDQWxCLFFBQVEsQ0FBQzJGLE9BQU8sQ0FBQ3JFLFFBQVEsRUFBRTtJQUFFc0UsU0FBUyxFQUFFLElBQUk7SUFBRUMsT0FBTyxFQUFFO0VBQUssQ0FBQyxDQUFDO0FBQ2hFLENBQUMsRUFBRSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9tb2JpbGVTdHlsZXMuY3NzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvdGFsa0J1dHRvblN0eWxlcy5jc3MiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvdHJhbnNjcmliZXIuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy93YXZlZm9ybS5zdmciLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9tb2JpbGVTdHlsZXMuY3NzPzVkZTkiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy90YWxrQnV0dG9uU3R5bGVzLmNzcz82NjRlIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9zYXlwaS5pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gICAgLyogbW9iaWxlIHN0eWxlcyBnbyBoZXJlICovXG4gICAgI2NvbnRyb2wtcGFuZWwsICNwaS1wYW5lbCwgI3NheXBpLXBhbmVsIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICAgICAgbGVmdDogMDtcbiAgICAgIH1cbiAgICAgICNjb250cm9sLXBhbmVsIHtcbiAgICAgICAgaGVpZ2h0OiAxMHZoO1xuICAgICAgICB0b3A6IDA7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjQ1LCAyMzgsIDIyMywgMC41KTtcbiAgICB9XG4gICAgICAjcGktcGFuZWwge1xuICAgICAgICBoZWlnaHQ6IDUwdmg7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMTI4LCAwLCAwLjUpO1xuICAgICAgICB0b3A6IDEwdmg7XG4gICAgICB9XG4gICAgICAjc2F5cGktcGFuZWwge1xuICAgICAgICBoZWlnaHQ6IDQwdmg7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjQ1LCAyMzgsIDIyMywgMC41KTtcbiAgICAgICAgYm90dG9tOiAwO1xuICAgICAgfSAgICAgICAgICAgICAgICBcbiAgICAgIC8qIG1ha2UgdGhlIGJ1dHRvbnMgZmlsbCB0aGUgcGFuZWxzICovXG4gICAgICAjc2F5cGktdGFsa0J1dHRvbiB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgICAgICBib3JkZXItcmFkaXVzOiAwO1xuICAgICAgICBtYXJnaW46IDA7XG4gICAgICB9XG4gICAgICAvKiBtb3ZlIGF1ZGlvIGNvbnRyb2xzIChtdXRlL3VubXV0ZSwgdm9pY2Ugc2VsZWN0aW9uKSB0byB0b3AgKi9cbiAgICAgIGRpdltkYXRhLXByb2plY3Rpb24taWQ9JzEzJ10ge1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgIGJvdHRvbTogNzl2aDtcbiAgICAgICAgcmlnaHQ6IDMwcHg7XG4gICAgICB9XG4gICAgICAvKiBmbGlwIHZvaWNlIGxpc3QgYmVsb3cgYXVkaW8gY29udHJvbHMgKi9cbiAgICAgIGRpdltkYXRhLXByb2plY3Rpb24taWQ9JzE0J10ge1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgIHRvcDogMzI1cHg7XG4gICAgICB9XG59YCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvbW9iaWxlU3R5bGVzLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtJQUNJLDBCQUEwQjtJQUMxQjtRQUNJLFdBQVc7UUFDWCxlQUFlO1FBQ2YsT0FBTztNQUNUO01BQ0E7UUFDRSxZQUFZO1FBQ1osTUFBTTtRQUNOLDBDQUEwQztJQUM5QztNQUNFO1FBQ0UsWUFBWTtRQUNaLHNDQUFzQztRQUN0QyxTQUFTO01BQ1g7TUFDQTtRQUNFLFlBQVk7UUFDWiwwQ0FBMEM7UUFDMUMsU0FBUztNQUNYO01BQ0EscUNBQXFDO01BQ3JDO1FBQ0UsV0FBVztRQUNYLFlBQVk7UUFDWiw2QkFBNkI7UUFDN0IsZ0JBQWdCO1FBQ2hCLFNBQVM7TUFDWDtNQUNBLDhEQUE4RDtNQUM5RDtRQUNFLGtCQUFrQjtRQUNsQixZQUFZO1FBQ1osV0FBVztNQUNiO01BQ0EseUNBQXlDO01BQ3pDO1FBQ0Usa0JBQWtCO1FBQ2xCLFVBQVU7TUFDWjtBQUNOXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xcbiAgICAvKiBtb2JpbGUgc3R5bGVzIGdvIGhlcmUgKi9cXG4gICAgI2NvbnRyb2wtcGFuZWwsICNwaS1wYW5lbCwgI3NheXBpLXBhbmVsIHtcXG4gICAgICAgIHdpZHRoOiAxMDAlO1xcbiAgICAgICAgcG9zaXRpb246IGZpeGVkO1xcbiAgICAgICAgbGVmdDogMDtcXG4gICAgICB9XFxuICAgICAgI2NvbnRyb2wtcGFuZWwge1xcbiAgICAgICAgaGVpZ2h0OiAxMHZoO1xcbiAgICAgICAgdG9wOiAwO1xcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNDUsIDIzOCwgMjIzLCAwLjUpO1xcbiAgICB9XFxuICAgICAgI3BpLXBhbmVsIHtcXG4gICAgICAgIGhlaWdodDogNTB2aDtcXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMTI4LCAwLCAwLjUpO1xcbiAgICAgICAgdG9wOiAxMHZoO1xcbiAgICAgIH1cXG4gICAgICAjc2F5cGktcGFuZWwge1xcbiAgICAgICAgaGVpZ2h0OiA0MHZoO1xcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNDUsIDIzOCwgMjIzLCAwLjUpO1xcbiAgICAgICAgYm90dG9tOiAwO1xcbiAgICAgIH0gICAgICAgICAgICAgICAgXFxuICAgICAgLyogbWFrZSB0aGUgYnV0dG9ucyBmaWxsIHRoZSBwYW5lbHMgKi9cXG4gICAgICAjc2F5cGktdGFsa0J1dHRvbiB7XFxuICAgICAgICB3aWR0aDogMTAwJTtcXG4gICAgICAgIGhlaWdodDogMTAwJTtcXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMDtcXG4gICAgICAgIG1hcmdpbjogMDtcXG4gICAgICB9XFxuICAgICAgLyogbW92ZSBhdWRpbyBjb250cm9scyAobXV0ZS91bm11dGUsIHZvaWNlIHNlbGVjdGlvbikgdG8gdG9wICovXFxuICAgICAgZGl2W2RhdGEtcHJvamVjdGlvbi1pZD0nMTMnXSB7XFxuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgICAgICBib3R0b206IDc5dmg7XFxuICAgICAgICByaWdodDogMzBweDtcXG4gICAgICB9XFxuICAgICAgLyogZmxpcCB2b2ljZSBsaXN0IGJlbG93IGF1ZGlvIGNvbnRyb2xzICovXFxuICAgICAgZGl2W2RhdGEtcHJvamVjdGlvbi1pZD0nMTQnXSB7XFxuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICAgICAgICB0b3A6IDMyNXB4O1xcbiAgICAgIH1cXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGBAa2V5ZnJhbWVzIHB1bHNlIHtcbiAgICAwJSB7XG4gICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gICAgfVxuICAgIDUwJSB7XG4gICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMC45KTtcbiAgICB9XG4gICAgMTAwJSB7XG4gICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gICAgfVxufVxuI3NheXBpLXRhbGtCdXR0b24ge1xuICAgIG1hcmdpbi10b3A6IDAuMjVyZW07XG4gICAgYm9yZGVyLXJhZGl1czogMThweDtcbiAgICB3aWR0aDogMTIwcHg7XG4gICAgZGlzcGxheTogYmxvY2s7IC8qIEZvciBTYWZhcmkgKi9cbn1cblxuaHRtbDpub3QoLmZpcmVmb3gtYW5kcm9pZCkgI3NheXBpLXRhbGtCdXR0b246YWN0aXZlIC53YXZlZm9ybSxcbiNzYXlwaS10YWxrQnV0dG9uLmFjdGl2ZSAud2F2ZWZvcm0ge1xuICAgIGFuaW1hdGlvbjogcHVsc2UgMXMgaW5maW5pdGU7XG59ICAgICAgICAgICAgXG4jc2F5cGktdGFsa0J1dHRvbiAud2F2ZWZvcm0ge1xuICAgIGZpbGw6ICM3NzZkNmQ7XG59XG4jc2F5cGktdGFsa0J1dHRvbi5hdXRvU3VibWl0IC53YXZlZm9ybSB7XG4gICAgZmlsbDogcmdiKDY1IDEzOCA0Nyk7IC8qIFBpJ3MgdGV4dC1icmFuZC1ncmVlbi02MDAgKi9cbn1gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy90YWxrQnV0dG9uU3R5bGVzLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtJQUNJO1FBQ0ksbUJBQW1CO0lBQ3ZCO0lBQ0E7UUFDSSxxQkFBcUI7SUFDekI7SUFDQTtRQUNJLG1CQUFtQjtJQUN2QjtBQUNKO0FBQ0E7SUFDSSxtQkFBbUI7SUFDbkIsbUJBQW1CO0lBQ25CLFlBQVk7SUFDWixjQUFjLEVBQUUsZUFBZTtBQUNuQzs7QUFFQTs7SUFFSSw0QkFBNEI7QUFDaEM7QUFDQTtJQUNJLGFBQWE7QUFDakI7QUFDQTtJQUNJLG9CQUFvQixFQUFFLDhCQUE4QjtBQUN4RFwiLFwic291cmNlc0NvbnRlbnRcIjpbXCJAa2V5ZnJhbWVzIHB1bHNlIHtcXG4gICAgMCUge1xcbiAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gICAgfVxcbiAgICA1MCUge1xcbiAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkpO1xcbiAgICB9XFxuICAgIDEwMCUge1xcbiAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gICAgfVxcbn1cXG4jc2F5cGktdGFsa0J1dHRvbiB7XFxuICAgIG1hcmdpbi10b3A6IDAuMjVyZW07XFxuICAgIGJvcmRlci1yYWRpdXM6IDE4cHg7XFxuICAgIHdpZHRoOiAxMjBweDtcXG4gICAgZGlzcGxheTogYmxvY2s7IC8qIEZvciBTYWZhcmkgKi9cXG59XFxuXFxuaHRtbDpub3QoLmZpcmVmb3gtYW5kcm9pZCkgI3NheXBpLXRhbGtCdXR0b246YWN0aXZlIC53YXZlZm9ybSxcXG4jc2F5cGktdGFsa0J1dHRvbi5hY3RpdmUgLndhdmVmb3JtIHtcXG4gICAgYW5pbWF0aW9uOiBwdWxzZSAxcyBpbmZpbml0ZTtcXG59ICAgICAgICAgICAgXFxuI3NheXBpLXRhbGtCdXR0b24gLndhdmVmb3JtIHtcXG4gICAgZmlsbDogIzc3NmQ2ZDtcXG59XFxuI3NheXBpLXRhbGtCdXR0b24uYXV0b1N1Ym1pdCAud2F2ZWZvcm0ge1xcbiAgICBmaWxsOiByZ2IoNjUgMTM4IDQ3KTsgLyogUGkncyB0ZXh0LWJyYW5kLWdyZWVuLTYwMCAqL1xcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsImV4cG9ydCBkZWZhdWx0IFwiLy8gYXVkaW8gb3V0cHV0IChQaSlcXG52YXIgYXVkaW9FbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcXFwiYXVkaW9cXFwiKTtcXG5pZiAoIWF1ZGlvRWxlbWVudCkge1xcbiAgY29uc29sZS5lcnJvcihcXFwiQXVkaW8gZWxlbWVudCBub3QgZm91bmQhXFxcIik7XFxufVxcbmZ1bmN0aW9uIGlzU2FmYXJpKCkge1xcbiAgcmV0dXJuIC9eKCg/IWNocm9tZXxhbmRyb2lkKS4pKnNhZmFyaS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XFxufVxcbmF1ZGlvRWxlbWVudC5wcmVsb2FkID0gXFxcImF1dG9cXFwiOyAvLyBlbmFibGUgYWdncmVzc2l2ZSBwcmVsb2FkaW5nIG9mIGF1ZGlvXFxudmFyIHBpQXVkaW9NYW5hZ2VyID0ge1xcbiAgaXNTcGVha2luZzogZmFsc2UsXFxuICBhdWRpb0VsZW1lbnQ6IGF1ZGlvRWxlbWVudCxcXG4gIF91c2VyU3RhcnRlZDogdHJ1ZSxcXG4gIC8vIGZsYWcgdG8gaW5kaWNhdGUgcGxheWJhY2sgaGFzIGJlZW4gc3RhcnRlZCBieSB0aGUgdXNlciAodHJ1ZSBieSBkZWZhdWx0IGJlY2F1c2UgdXNlciBtdXN0IHJlcXVlc3QgaW5pdGlhbCBwbGF5YmFjaylcXG4gIF9pc0xvYWRDYWxsZWQ6IGZhbHNlLFxcbiAgLy8gZmxhZyB0byBpbmRpY2F0ZSBpZiB0aGUgbG9hZCgpIG1ldGhvZCBoYXMgYmVlbiBjYWxsZWQgb24gdGhlIGF1ZGlvIGVsZW1lbnRcXG5cXG4gIHVzZXJQbGF5OiBmdW5jdGlvbiB1c2VyUGxheSgpIHtcXG4gICAgaWYgKCFpc1NhZmFyaSgpKSB7XFxuICAgICAgcmV0dXJuO1xcbiAgICB9XFxuICAgIHRoaXMuX3VzZXJTdGFydGVkID0gdHJ1ZTsgLy8gc2V0IGEgZmxhZyB0byBpbmRpY2F0ZSBwbGF5YmFjayBoYXMgYmVlbiBzdGFydGVkIGJ5IHRoZSB1c2VyXFxuICAgIHRoaXMuYXVkaW9FbGVtZW50LmxvYWQoKTsgLy8gcmVzZXQgZm9yIFNhZmFyaVxcbiAgICB0aGlzLmF1ZGlvRWxlbWVudC5wbGF5KCk7XFxuICAgIGNvbnNvbGUubG9nKFxcXCJVc2VyIHN0YXJ0ZWQgcGxheWJhY2tcXFwiKTtcXG4gIH0sXFxuICBhdXRvUGxheTogZnVuY3Rpb24gYXV0b1BsYXkoKSB7XFxuICAgIGlmICghaXNTYWZhcmkoKSkge1xcbiAgICAgIHJldHVybjtcXG4gICAgfVxcbiAgICBpZiAoIXRoaXMuX3VzZXJTdGFydGVkKSB7XFxuICAgICAgdGhpcy5hdWRpb0VsZW1lbnQucGF1c2UoKTtcXG4gICAgICBjb25zb2xlLmxvZyhcXFwiQXV0b3BsYXkgcHJldmVudGVkXFxcIik7XFxuICAgIH1cXG4gIH0sXFxuICBzdG9wOiBmdW5jdGlvbiBzdG9wKCkge1xcbiAgICBpZiAodGhpcy5pc1NwZWFraW5nKSB7XFxuICAgICAgdGhpcy5hdWRpb0VsZW1lbnQucGF1c2UoKTtcXG4gICAgfVxcbiAgICBpZiAodGhpcy5hdWRpb0VsZW1lbnQuZHVyYXRpb24gJiYgIXRoaXMuYXVkaW9FbGVtZW50LmVuZGVkICYmIHRoaXMuYXVkaW9FbGVtZW50LmN1cnJlbnRUaW1lIDwgdGhpcy5hdWRpb0VsZW1lbnQuZHVyYXRpb24pIHtcXG4gICAgICB0aGlzLmF1ZGlvRWxlbWVudC5jdXJyZW50VGltZSA9IHRoaXMuYXVkaW9FbGVtZW50LmR1cmF0aW9uOyAvLyBzZWVrIHRoZSBhdWRpbyB0byB0aGUgZW5kXFxuICAgICAgdGhpcy5hdWRpb0VsZW1lbnQucGxheSgpOyAvLyB0cmlnZ2VyIHRoZSBlbmRlZCBldmVudFxcbiAgICB9XFxuICB9LFxcblxcbiAgcGF1c2U6IGZ1bmN0aW9uIHBhdXNlKCkge1xcbiAgICB0aGlzLmF1ZGlvRWxlbWVudC5wYXVzZSgpO1xcbiAgfSxcXG4gIHJlc3VtZTogZnVuY3Rpb24gcmVzdW1lKCkge1xcbiAgICB0aGlzLmF1ZGlvRWxlbWVudC5wbGF5KCk7XFxuICB9LFxcbiAgbG9hZGluZzogZnVuY3Rpb24gbG9hZGluZygpIHtcXG4gICAgaWYgKCFpc1NhZmFyaSgpKSB7XFxuICAgICAgcmV0dXJuO1xcbiAgICB9XFxuICAgIGlmICghdGhpcy5faXNMb2FkQ2FsbGVkKSB7XFxuICAgICAgdGhpcy5faXNMb2FkQ2FsbGVkID0gdHJ1ZTsgLy8gU2V0IHRoZSBmbGFnIHRvIHRydWVcXG4gICAgICB0aGlzLnNob3dQbGF5QnV0dG9uKCk7IC8vIFNob3cgdGhlIHBsYXkgYnV0dG9uXFxuICAgIH0gZWxzZSB7XFxuICAgICAgdGhpcy5faXNMb2FkQ2FsbGVkID0gZmFsc2U7IC8vIFJlc2V0IHRoZSBmbGFnXFxuICAgIH1cXG4gIH0sXFxuXFxuICBwbGF5aW5nOiBmdW5jdGlvbiBwbGF5aW5nKCkge1xcbiAgICB0aGlzLmlzU3BlYWtpbmcgPSB0cnVlO1xcbiAgICBpZiAoaXNTYWZhcmkoKSkge1xcbiAgICAgIHRoaXMuaGlkZVBsYXlCdXR0b24oKTtcXG4gICAgfVxcbiAgfSxcXG4gIHN0b3BwZWQ6IGZ1bmN0aW9uIHN0b3BwZWQoKSB7XFxuICAgIHRoaXMuaXNTcGVha2luZyA9IGZhbHNlO1xcbiAgICB0aGlzLl91c2VyU3RhcnRlZCA9IGZhbHNlO1xcbiAgfSxcXG4gIHNob3dQbGF5QnV0dG9uOiBmdW5jdGlvbiBzaG93UGxheUJ1dHRvbigpIHtcXG4gICAgdmFyIHBsYXlCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcXFwic2F5cGktcGxheUF1ZGlvXFxcIik7XFxuICAgIGlmICghcGxheUJ1dHRvbikge1xcbiAgICAgIHBsYXlCdXR0b24gPSB0aGlzLmNyZWF0ZVBsYXlCdXR0b24oKTtcXG4gICAgfVxcbiAgICBwbGF5QnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcXFwiYmxvY2tcXFwiO1xcbiAgfSxcXG4gIGhpZGVQbGF5QnV0dG9uOiBmdW5jdGlvbiBoaWRlUGxheUJ1dHRvbigpIHtcXG4gICAgdmFyIHBsYXlCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcXFwic2F5cGktcGxheUF1ZGlvXFxcIik7XFxuICAgIGlmIChwbGF5QnV0dG9uKSB7XFxuICAgICAgcGxheUJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXFxcIm5vbmVcXFwiO1xcbiAgICB9XFxuICB9LFxcbiAgY3JlYXRlUGxheUJ1dHRvbjogZnVuY3Rpb24gY3JlYXRlUGxheUJ1dHRvbigpIHtcXG4gICAgdmFyIF90aGlzID0gdGhpcztcXG4gICAgLy8gY3JlYXRlIGEgY29udGFpbmluZyBkaXZcXG4gICAgdmFyIHBhbmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcXFwiZGl2XFxcIik7XFxuICAgIHBhbmVsLmlkID0gXFxcInBpLXBhbmVsXFxcIjtcXG4gICAgdmFyIHBsYXlCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFxcXCJidXR0b25cXFwiKTtcXG4gICAgcGxheUJ1dHRvbi5pZCA9IFxcXCJzYXlwaS1wbGF5QXVkaW9cXFwiO1xcbiAgICBwbGF5QnV0dG9uLmlubmVyVGV4dCA9IFxcXCJIZWFyIFBpJ3MgUmVzcG9uc2VcXFwiO1xcbiAgICBwbGF5QnV0dG9uLnN0eWxlLnBvc2l0aW9uID0gXFxcImZpeGVkXFxcIjtcXG4gICAgcGxheUJ1dHRvbi5zdHlsZS50b3AgPSBcXFwiNTAlXFxcIjtcXG4gICAgcGxheUJ1dHRvbi5zdHlsZS5sZWZ0ID0gXFxcIjUwJVxcXCI7XFxuICAgIHBsYXlCdXR0b24uc3R5bGUudHJhbnNmb3JtID0gXFxcInRyYW5zbGF0ZSgtNTAlLCA1MCUpXFxcIjtcXG4gICAgcGxheUJ1dHRvbi5zdHlsZS5wYWRkaW5nID0gXFxcIjEwcHggMjBweFxcXCI7XFxuICAgIHBsYXlCdXR0b24uc3R5bGUuZm9udFNpemUgPSBcXFwiMjRweFxcXCI7XFxuICAgIHBsYXlCdXR0b24uc3R5bGUuYm9yZGVyUmFkaXVzID0gXFxcIjVweFxcXCI7XFxuICAgIHBsYXlCdXR0b24uc3R5bGUuYm9yZGVyID0gXFxcIm5vbmVcXFwiO1xcbiAgICBwbGF5QnV0dG9uLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFxcXCJyZ2IoMjI4IDIxNiAxOTMpXFxcIjtcXG4gICAgcGxheUJ1dHRvbi5zdHlsZS56SW5kZXggPSBcXFwiOTk5OVxcXCI7IC8vIGVuc3VyZSBpdCdzIG9uIHRvcCBvZiBvdGhlciBlbGVtZW50c1xcbiAgICBwbGF5QnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcXFwibm9uZVxcXCI7IC8vIGluaXRpYWxseSBoaWRkZW5cXG5cXG4gICAgcGFuZWwuYXBwZW5kQ2hpbGQocGxheUJ1dHRvbik7XFxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocGFuZWwpO1xcblxcbiAgICAvLyBFdmVudCBsaXN0ZW5lciB0byBzdGFydCBwbGF5YmFja1xcbiAgICBwbGF5QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXFxcImNsaWNrXFxcIiwgZnVuY3Rpb24gKCkge1xcbiAgICAgIF90aGlzLnVzZXJQbGF5KCk7XFxuICAgICAgX3RoaXMuaGlkZVBsYXlCdXR0b24oKTtcXG4gICAgfSk7XFxuICAgIHJldHVybiBwbGF5QnV0dG9uO1xcbiAgfVxcbn07XFxuXFxuLy8gSW50ZXJjZXB0IEF1dG9wbGF5IEV2ZW50cyAoYXV0b3BsYXkgZG9lc24ndCB3b3JrIG9uIFNhZmFyaSlcXG5hdWRpb0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcXFwicGxheVxcXCIsIGZ1bmN0aW9uICgpIHtcXG4gIHBpQXVkaW9NYW5hZ2VyLmF1dG9QbGF5KCk7XFxufSk7XFxuYXVkaW9FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXFxcImxvYWRzdGFydFxcXCIsIGZ1bmN0aW9uICgpIHtcXG4gIHBpQXVkaW9NYW5hZ2VyLmxvYWRpbmcoKTtcXG59KTtcXG5cXG4vLyBFdmVudCBsaXN0ZW5lcnMgZm9yIGRldGVjdGluZyB3aGVuIFBpIGlzIHNwZWFraW5nXFxuYXVkaW9FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXFxcInBsYXlpbmdcXFwiLCBmdW5jdGlvbiAoKSB7XFxuICBjb25zb2xlLmxvZyhcXFwiUGkgaXMgc3BlYWtpbmdcXFwiKTtcXG4gIHBpQXVkaW9NYW5hZ2VyLnBsYXlpbmcoKTtcXG59KTtcXG5hdWRpb0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcXFwicGF1c2VcXFwiLCBmdW5jdGlvbiAoKSB7XFxuICBjb25zb2xlLmxvZyhcXFwiUGkgc3RvcHBlZCBzcGVha2luZ1xcXCIpO1xcbiAgcGlBdWRpb01hbmFnZXIuc3RvcHBlZCgpO1xcbn0pO1xcbmF1ZGlvRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxcXCJlbmRlZFxcXCIsIGZ1bmN0aW9uICgpIHtcXG4gIGNvbnNvbGUubG9nKFxcXCJQaSBmaW5pc2hlZCBzcGVha2luZ1xcXCIpO1xcbiAgcGlBdWRpb01hbmFnZXIuc3RvcHBlZCgpO1xcbn0pO1xcblxcbi8vIGF1ZGlvIGlucHV0ICh1c2VyKVxcbnZhciBhdWRpb0RhdGFDaHVua3MgPSBbXTtcXG52YXIgYXVkaW9NaW1lVHlwZSA9IFxcXCJhdWRpby93ZWJtO2NvZGVjcz1vcHVzXFxcIjtcXG5mdW5jdGlvbiB1cGxvYWRBdWRpbyhhdWRpb0Jsb2IpIHtcXG4gIC8vIENyZWF0ZSBhIEZvcm1EYXRhIG9iamVjdFxcbiAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XFxuICB2YXIgYXVkaW9GaWxlbmFtZSA9IFxcXCJhdWRpby53ZWJtXFxcIjtcXG4gIGlmIChhdWRpb0Jsb2IudHlwZSA9PT0gXFxcImF1ZGlvL21wNFxcXCIpIHtcXG4gICAgYXVkaW9GaWxlbmFtZSA9IFxcXCJhdWRpby5tcDRcXFwiO1xcbiAgfVxcbiAgLy8gQWRkIHRoZSBhdWRpbyBibG9iIHRvIHRoZSBGb3JtRGF0YSBvYmplY3RcXG4gIGZvcm1EYXRhLmFwcGVuZChcXFwiYXVkaW9cXFwiLCBhdWRpb0Jsb2IsIGF1ZGlvRmlsZW5hbWUpO1xcbiAgLy8gR2V0IHRoZSB1c2VyJ3MgcHJlZmVycmVkIGxhbmd1YWdlXFxuICB2YXIgbGFuZ3VhZ2UgPSBuYXZpZ2F0b3IubGFuZ3VhZ2U7XFxuICAvLyBQb3N0IHRoZSBhdWRpbyB0byB0aGUgc2VydmVyIGZvciB0cmFuc2NyaXB0aW9uXFxuICBmZXRjaChjb25maWcuYXBpU2VydmVyVXJsICsgXFxcIi90cmFuc2NyaWJlP2xhbmd1YWdlPVxcXCIgKyBsYW5ndWFnZSwge1xcbiAgICBtZXRob2Q6IFxcXCJQT1NUXFxcIixcXG4gICAgYm9keTogZm9ybURhdGFcXG4gIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XFxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcXG4gICAgICB0aHJvdyBFcnJvcihyZXNwb25zZS5zdGF0dXNUZXh0KTtcXG4gICAgfVxcbiAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xcbiAgfSkudGhlbihoYW5kbGVUcmFuc2NyaXB0aW9uUmVzcG9uc2UpW1xcXCJjYXRjaFxcXCJdKGZ1bmN0aW9uIChlcnJvcikge1xcbiAgICBjb25zb2xlLmVycm9yKFxcXCJMb29rcyBsaWtlIHRoZXJlIHdhcyBhIHByb2JsZW06IFxcXCIsIGVycm9yKTtcXG4gICAgdmFyIHRleHRhcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXFxcInByb21wdFxcXCIpO1xcbiAgICB0ZXh0YXJlYS52YWx1ZSA9IFxcXCJTb3JyeSwgdGhlcmUgd2FzIGEgcHJvYmxlbSB0cmFuc2NyaWJpbmcgeW91ciBhdWRpby4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlci5cXFwiO1xcbiAgfSk7XFxufVxcbmZ1bmN0aW9uIGhhbmRsZVRyYW5zY3JpcHRpb25SZXNwb25zZShyZXNwb25zZUpzb24pIHtcXG4gIHZhciB0ZXh0YXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxcXCJwcm9tcHRcXFwiKTtcXG4gIHNpbXVsYXRlVHlwaW5nKHRleHRhcmVhLCByZXNwb25zZUpzb24udGV4dCArIFxcXCIgXFxcIik7XFxuICBjb25zb2xlLmxvZyhcXFwiVHJhbnNjcmlwdDogXFxcIiArIHJlc3BvbnNlSnNvbi50ZXh0KTtcXG59XFxuZnVuY3Rpb24gc2V0TmF0aXZlVmFsdWUoZWxlbWVudCwgdmFsdWUpIHtcXG4gIHZhciBsYXN0VmFsdWUgPSBlbGVtZW50LnZhbHVlO1xcbiAgZWxlbWVudC52YWx1ZSA9IHZhbHVlO1xcbiAgdmFyIGV2ZW50ID0gbmV3IEV2ZW50KFxcXCJpbnB1dFxcXCIsIHtcXG4gICAgdGFyZ2V0OiBlbGVtZW50LFxcbiAgICBidWJibGVzOiB0cnVlXFxuICB9KTtcXG4gIC8vIFJlYWN0IDE1XFxuICBldmVudC5zaW11bGF0ZWQgPSB0cnVlO1xcbiAgLy8gUmVhY3QgMTYtMTdcXG4gIHZhciB0cmFja2VyID0gZWxlbWVudC5fdmFsdWVUcmFja2VyO1xcbiAgaWYgKHRyYWNrZXIpIHtcXG4gICAgdHJhY2tlci5zZXRWYWx1ZShsYXN0VmFsdWUpO1xcbiAgfVxcbiAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcXG59XFxuZnVuY3Rpb24gc2ltdWxhdGVGb3JtU3VibWl0KHRleHRhcmVhKSB7XFxuICB2YXIgZW50ZXJFdmVudCA9IG5ldyBLZXlib2FyZEV2ZW50KFxcXCJrZXlkb3duXFxcIiwge1xcbiAgICBidWJibGVzOiB0cnVlLFxcbiAgICBrZXk6IFxcXCJFbnRlclxcXCIsXFxuICAgIGtleUNvZGU6IDEzLFxcbiAgICB3aGljaDogMTNcXG4gIH0pO1xcbiAgdGV4dGFyZWEuZGlzcGF0Y2hFdmVudChlbnRlckV2ZW50KTtcXG59XFxuZnVuY3Rpb24gc2ltdWxhdGVUeXBpbmcoZWxlbWVudCwgdGV4dCkge1xcbiAgdmFyIHdvcmRzID0gdGV4dC5zcGxpdChcXFwiIFxcXCIpOyAvLyBTcGxpdCB0aGUgdGV4dCBpbnRvIHdvcmRzIChtYXkgbm90IGJlIGlkZWFsIGZvciBhbGwgbGFuZ3VhZ2VzKVxcbiAgdmFyIGkgPSAwO1xcbiAgZnVuY3Rpb24gdHlwZVdvcmQoKSB7XFxuICAgIGlmIChpIDwgd29yZHMubGVuZ3RoKSB7XFxuICAgICAgLy8gQXBwZW5kIHRoZSBuZXh0IHdvcmQgYW5kIGEgc3BhY2UsIHRoZW4gaW5jcmVtZW50IGlcXG4gICAgICBzZXROYXRpdmVWYWx1ZShlbGVtZW50LCBlbGVtZW50LnZhbHVlICsgd29yZHNbaSsrXSArIFxcXCIgXFxcIik7XFxuICAgICAgLy8gQ2FsbCB0aGlzIGZ1bmN0aW9uIGFnYWluIGJlZm9yZSB0aGUgbmV4dCByZXBhaW50XFxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHR5cGVXb3JkKTtcXG4gICAgfSBlbHNlIHtcXG4gICAgICAvLyBDaGVjayBpZiBhdXRvc3VibWl0IGlzIGVuYWJsZWRcXG4gICAgICB2YXIgdGFsa0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxcXCJzYXlwaS10YWxrQnV0dG9uXFxcIik7XFxuICAgICAgaWYgKHRhbGtCdXR0b24uZGF0YXNldC5hdXRvc3VibWl0ID09PSBcXFwiZmFsc2VcXFwiKSB7XFxuICAgICAgICBjb25zb2xlLmxvZyhcXFwiQXV0b3N1Ym1pdCBpcyBkaXNhYmxlZFxcXCIpO1xcbiAgICAgIH0gZWxzZSB7XFxuICAgICAgICAvLyBTaW11bGF0ZSBhbiBcXFwiRW50ZXJcXFwiIGtleXByZXNzIGV2ZW50XFxuICAgICAgICBzaW11bGF0ZUZvcm1TdWJtaXQoZWxlbWVudCk7XFxuICAgICAgfVxcbiAgICB9XFxuICB9XFxuICAvLyBTdGFydCB0eXBpbmdcXG4gIHR5cGVXb3JkKCk7XFxufVxcblxcbi8vIERlY2xhcmUgYSBnbG9iYWwgdmFyaWFibGUgZm9yIHRoZSBtZWRpYVJlY29yZGVyXFxudmFyIG1lZGlhUmVjb3JkZXI7XFxudmFyIHRocmVzaG9sZCA9IDEwMDA7IC8vIDEwMDAgbXMgPSAxIHNlY29uZCwgYWJvdXQgdGhlIGxlbmd0aCBvZiBcXFwiSGV5LCBQaVxcXCJcXG5cXG4vLyBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlICdkYXRhYXZhaWxhYmxlJyBldmVudCBmaXJlc1xcbmZ1bmN0aW9uIGhhbmRsZURhdGFBdmFpbGFibGUoZSkge1xcbiAgLy8gQWRkIHRoZSBhdWRpbyBkYXRhIGNodW5rIHRvIHRoZSBhcnJheVxcbiAgYXVkaW9EYXRhQ2h1bmtzLnB1c2goZS5kYXRhKTtcXG59XFxuXFxuLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSAnc3RvcCcgZXZlbnQgZmlyZXNcXG5mdW5jdGlvbiBoYW5kbGVTdG9wKCkge1xcbiAgLy8gQ3JlYXRlIGEgQmxvYiBmcm9tIHRoZSBhdWRpbyBkYXRhIGNodW5rc1xcbiAgdmFyIGF1ZGlvQmxvYiA9IG5ldyBCbG9iKGF1ZGlvRGF0YUNodW5rcywge1xcbiAgICB0eXBlOiBhdWRpb01pbWVUeXBlXFxuICB9KTtcXG5cXG4gIC8vIEdldCB0aGUgc3RvcCB0aW1lIGFuZCBjYWxjdWxhdGUgdGhlIGR1cmF0aW9uXFxuICB2YXIgc3RvcFRpbWUgPSBEYXRlLm5vdygpO1xcbiAgdmFyIGR1cmF0aW9uID0gc3RvcFRpbWUgLSB3aW5kb3cuc3RhcnRUaW1lO1xcblxcbiAgLy8gSWYgdGhlIGR1cmF0aW9uIGlzIGdyZWF0ZXIgdGhhbiB0aGUgdGhyZXNob2xkLCB1cGxvYWQgdGhlIGF1ZGlvIGZvciB0cmFuc2NyaXB0aW9uXFxuICBpZiAoZHVyYXRpb24gPj0gdGhyZXNob2xkKSB7XFxuICAgIC8vIGRvd25sb2FkIHRoZSBhdWRpb1xcbiAgICB2YXIgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChhdWRpb0Jsb2IpO1xcbiAgICB2YXIgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXFxcImFcXFwiKTtcXG4gICAgYS5zdHlsZS5kaXNwbGF5ID0gXFxcIm5vbmVcXFwiO1xcbiAgICBhLmhyZWYgPSB1cmw7XFxuICAgIGEuZG93bmxvYWQgPSBcXFwic2FmYXJpX2F1ZGlvLm1wNFxcXCI7XFxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYSk7XFxuICAgIC8vIGEuY2xpY2soKTtcXG4gICAgLy8gVXBsb2FkIHRoZSBhdWRpbyB0byB0aGUgc2VydmVyIGZvciB0cmFuc2NyaXB0aW9uXFxuICAgIHVwbG9hZEF1ZGlvKGF1ZGlvQmxvYik7XFxuICB9XFxuXFxuICAvLyBDbGVhciB0aGUgYXJyYXkgZm9yIHRoZSBuZXh0IHJlY29yZGluZ1xcbiAgYXVkaW9EYXRhQ2h1bmtzID0gW107XFxufVxcbmZ1bmN0aW9uIHNldHVwUmVjb3JkaW5nKGNhbGxiYWNrKSB7XFxuICBpZiAobWVkaWFSZWNvcmRlcikge1xcbiAgICByZXR1cm47XFxuICB9XFxuXFxuICAvLyBHZXQgYSBzdHJlYW0gZnJvbSB0aGUgdXNlcidzIG1pY3JvcGhvbmVcXG4gIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKHtcXG4gICAgYXVkaW86IHRydWVcXG4gIH0pLnRoZW4oZnVuY3Rpb24gKHN0cmVhbSkge1xcbiAgICBpZiAoIU1lZGlhUmVjb3JkZXIuaXNUeXBlU3VwcG9ydGVkKGF1ZGlvTWltZVR5cGUpKSB7XFxuICAgICAgLy8gdXNlIE1QNCBmb3IgU2FmYXJpXFxuICAgICAgYXVkaW9NaW1lVHlwZSA9IFxcXCJhdWRpby9tcDRcXFwiO1xcbiAgICB9XFxuICAgIC8vIENyZWF0ZSBhIG5ldyBNZWRpYVJlY29yZGVyIG9iamVjdCB1c2luZyB0aGUgc3RyZWFtIGFuZCBzcGVjaWZ5aW5nIHRoZSBNSU1FIHR5cGVcXG4gICAgdmFyIG9wdGlvbnMgPSB7XFxuICAgICAgbWltZVR5cGU6IGF1ZGlvTWltZVR5cGVcXG4gICAgfTtcXG4gICAgbWVkaWFSZWNvcmRlciA9IG5ldyBNZWRpYVJlY29yZGVyKHN0cmVhbSwgb3B0aW9ucyk7XFxuXFxuICAgIC8vIExpc3RlbiBmb3IgdGhlICdkYXRhYXZhaWxhYmxlJyBldmVudFxcbiAgICBtZWRpYVJlY29yZGVyLmFkZEV2ZW50TGlzdGVuZXIoXFxcImRhdGFhdmFpbGFibGVcXFwiLCBoYW5kbGVEYXRhQXZhaWxhYmxlKTtcXG5cXG4gICAgLy8gTGlzdGVuIGZvciB0aGUgJ3N0b3AnIGV2ZW50XFxuICAgIG1lZGlhUmVjb3JkZXIuYWRkRXZlbnRMaXN0ZW5lcihcXFwic3RvcFxcXCIsIGhhbmRsZVN0b3ApO1xcbiAgfSkudGhlbihmdW5jdGlvbiAoKSB7XFxuICAgIC8vIEludm9rZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cXG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXFxcImZ1bmN0aW9uXFxcIikge1xcbiAgICAgIGNhbGxiYWNrKCk7XFxuICAgIH1cXG4gIH0pW1xcXCJjYXRjaFxcXCJdKGZ1bmN0aW9uIChlcnIpIHtcXG4gICAgY29uc29sZS5lcnJvcihcXFwiRXJyb3IgZ2V0dGluZyBhdWRpbyBzdHJlYW06IFxcXCIgKyBlcnIpO1xcbiAgfSk7XFxufVxcbmZ1bmN0aW9uIHRlYXJEb3duUmVjb3JkaW5nKCkge1xcbiAgLy8gQ2hlY2sgaWYgdGhlIE1lZGlhUmVjb3JkZXIgaXMgc2V0IHVwXFxuICBpZiAoIW1lZGlhUmVjb3JkZXIpIHtcXG4gICAgcmV0dXJuO1xcbiAgfVxcblxcbiAgLy8gU3RvcCBhbnkgb25nb2luZyByZWNvcmRpbmdcXG4gIGlmIChtZWRpYVJlY29yZGVyLnN0YXRlID09PSBcXFwicmVjb3JkaW5nXFxcIikge1xcbiAgICBtZWRpYVJlY29yZGVyLnN0b3AoKTtcXG4gIH1cXG5cXG4gIC8vIFJlbW92ZSB0aGUgTWVkaWFSZWNvcmRlcidzIGV2ZW50IGxpc3RlbmVyc1xcbiAgbWVkaWFSZWNvcmRlci5yZW1vdmVFdmVudExpc3RlbmVyKFxcXCJkYXRhYXZhaWxhYmxlXFxcIiwgaGFuZGxlRGF0YUF2YWlsYWJsZSk7XFxuICBtZWRpYVJlY29yZGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoXFxcInN0b3BcXFwiLCBoYW5kbGVTdG9wKTtcXG5cXG4gIC8vIENsZWFyIHRoZSBNZWRpYVJlY29yZGVyIHZhcmlhYmxlXFxuICBtZWRpYVJlY29yZGVyID0gbnVsbDtcXG59XFxuXFxuLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSB1c2VyIHByZXNzZXMgdGhlIHJlY29yZCBidXR0b25cXG5mdW5jdGlvbiBzdGFydFJlY29yZGluZygpIHtcXG4gIC8vIENoZWNrIGlmIHRoZSBNZWRpYVJlY29yZGVyIGlzIHNldCB1cFxcbiAgaWYgKCFtZWRpYVJlY29yZGVyKSB7XFxuICAgIHNldHVwUmVjb3JkaW5nKHN0YXJ0UmVjb3JkaW5nKTtcXG4gICAgcmV0dXJuO1xcbiAgfVxcbiAgLy8gQ2hlY2sgaWYgUGkgaXMgY3VycmVudGx5IHNwZWFraW5nIGFuZCBzdG9wIGhlciBhdWRpb1xcbiAgaWYgKHBpQXVkaW9NYW5hZ2VyLmlzU3BlYWtpbmcpIHtcXG4gICAgcGlBdWRpb01hbmFnZXIucGF1c2UoKTtcXG4gIH1cXG5cXG4gIC8vIFN0YXJ0IHJlY29yZGluZ1xcbiAgbWVkaWFSZWNvcmRlci5zdGFydCgpO1xcblxcbiAgLy8gUmVjb3JkIHRoZSBzdGFydCB0aW1lXFxuICB3aW5kb3cuc3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcXG4gIGNvbnNvbGUubG9nKFxcXCJVc2VyIGlzIHNwZWFraW5nXFxcIik7XFxuXFxuICAvLyBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlIHVzZXIgcmVsZWFzZXMgdGhlIHJlY29yZCBidXR0b25cXG4gIHdpbmRvdy5zdG9wUmVjb3JkaW5nID0gZnVuY3Rpb24gKCkge1xcbiAgICBpZiAobWVkaWFSZWNvcmRlciAmJiBtZWRpYVJlY29yZGVyLnN0YXRlID09PSBcXFwicmVjb3JkaW5nXFxcIikge1xcbiAgICAgIC8vIFN0b3AgcmVjb3JkaW5nXFxuICAgICAgbWVkaWFSZWNvcmRlci5zdG9wKCk7XFxuXFxuICAgICAgLy8gUmVjb3JkIHRoZSBzdG9wIHRpbWUgYW5kIGNhbGN1bGF0ZSB0aGUgZHVyYXRpb25cXG4gICAgICB2YXIgc3RvcFRpbWUgPSBEYXRlLm5vdygpO1xcbiAgICAgIHZhciBkdXJhdGlvbiA9IHN0b3BUaW1lIC0gd2luZG93LnN0YXJ0VGltZTtcXG5cXG4gICAgICAvLyBJZiB0aGUgZHVyYXRpb24gaXMgbGVzcyB0aGFuIHRoZSB0aHJlc2hvbGQsIGRvbid0IHVwbG9hZCB0aGUgYXVkaW8gZm9yIHRyYW5zY3JpcHRpb25cXG4gICAgICBpZiAoZHVyYXRpb24gPCB0aHJlc2hvbGQpIHtcXG4gICAgICAgIGNvbnNvbGUubG9nKFxcXCJVc2VyIHN0b3BwZWQgc3BlYWtpbmdcXFwiKTtcXG4gICAgICAgIGNvbnNvbGUubG9nKFxcXCJSZWNvcmRpbmcgd2FzIHRvbyBzaG9ydCwgbm90IHVwbG9hZGluZyBmb3IgdHJhbnNjcmlwdGlvblxcXCIpO1xcbiAgICAgICAgcGlBdWRpb01hbmFnZXIucmVzdW1lKCk7XFxuICAgICAgfSBlbHNlIHtcXG4gICAgICAgIGNvbnNvbGUubG9nKFxcXCJVc2VyIGZpbmlzaGVkIHNwZWFraW5nXFxcIik7XFxuICAgICAgICBwaUF1ZGlvTWFuYWdlci5zdG9wKCk7XFxuICAgICAgfVxcbiAgICB9XFxuICAgIC8vIFJlbW92ZSB0aGUgc3RvcFJlY29yZGluZyBmdW5jdGlvblxcbiAgICBkZWxldGUgd2luZG93LnN0b3BSZWNvcmRpbmc7XFxuICB9O1xcbn1cXG5cXG4vLyBBZGQgdGhlIHN0YXJ0UmVjb3JkaW5nIGZ1bmN0aW9uIHRvIHRoZSB3aW5kb3cgb2JqZWN0IHNvIGl0IGNhbiBiZSBjYWxsZWQgZnJvbSBvdXRzaWRlIHRoaXMgc2NyaXB0XFxud2luZG93LnN0YXJ0UmVjb3JkaW5nID0gc3RhcnRSZWNvcmRpbmc7XCI7IiwiZXhwb3J0IGRlZmF1bHQgXCI8c3ZnIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgdmVyc2lvbj1cXFwiMS4wXFxcIiB2aWV3Qm94PVxcXCIwIDAgNTYuMjUgMzBcXFwiIGNsYXNzPVxcXCJ3YXZlZm9ybVxcXCI+XFxuICAgIDxkZWZzPlxcbiAgICAgICAgPGNsaXBQYXRoIGlkPVxcXCJhXFxcIj5cXG4gICAgICAgICAgICA8cGF0aCBkPVxcXCJNLjU0IDEySDN2NUguNTRabTAgMFxcXCIvPlxcbiAgICAgICAgPC9jbGlwUGF0aD5cXG4gICAgICAgIDxjbGlwUGF0aCBpZD1cXFwiYlxcXCI+XFxuICAgICAgICAgICAgPHBhdGggZD1cXFwiTTI1IDIuMmgydjI0LjY4aC0yWm0wIDBcXFwiLz5cXG4gICAgICAgIDwvY2xpcFBhdGg+XFxuICAgICAgICA8Y2xpcFBhdGggaWQ9XFxcImNcXFwiPlxcbiAgICAgICAgICAgIDxwYXRoIGQ9XFxcIk01MyAxMmgxLjk4djVINTNabTAgMFxcXCIvPlxcbiAgICAgICAgPC9jbGlwUGF0aD5cXG4gICAgPC9kZWZzPlxcbiAgICA8ZyBjbGlwLXBhdGg9XFxcInVybCgjYSlcXFwiPlxcbiAgICAgICAgPHBhdGggZD1cXFwiTTEuNDggMTIuNzFjLS41IDAtLjkuNC0uOS45djEuODVhLjkuOSAwIDAgMCAxLjggMHYtMS44NGMwLS41LS40LS45LS45LS45Wm0wIDBcXFwiLz5cXG4gICAgPC9nPlxcbiAgICA8cGF0aCBkPVxcXCJNNC45OCA2LjYzYy0uNSAwLS45LjQtLjkuOXYxNC4wMWEuOS45IDAgMCAwIDEuODEgMHYtMTRjMC0uNS0uNC0uOTItLjktLjkyWm0zLjUxIDMuMWEuOS45IDAgMCAwLS45LjkxdjcuNzlhLjkuOSAwIDAgMCAxLjggMHYtNy43OWMwLS41LS40LS45LS45LS45Wk0xMiAzLjgzYS45LjkgMCAwIDAtLjkxLjl2MTkuNmEuOS45IDAgMCAwIDEuOCAwVjQuNzRjMC0uNS0uNC0uOS0uOS0uOVptMy41IDguMjlhLjkuOSAwIDAgMC0uOTEuOXYzLjAzYS45LjkgMCAwIDAgMS44MSAwdi0zLjAzYzAtLjUtLjQtLjktLjktLjlaTTE5IDYuOGMtLjUgMC0uOS40LS45Ljl2MTMuNjhhLjkuOSAwIDAgMCAxLjggMFY3LjdjMC0uNS0uNC0uOS0uOS0uOVptMy41OC0yLjk3aC0uMDFjLS41IDAtLjkuNC0uOS45bC0uMTMgMTkuNmMwIC41LjQuOS45LjkxLjUgMCAuOS0uNC45LS45bC4xNC0xOS42YS45LjkgMCAwIDAtLjktLjlabTAgMFxcXCIvPlxcbiAgICA8ZyBjbGlwLXBhdGg9XFxcInVybCgjYilcXFwiPlxcbiAgICAgICAgPHBhdGggZD1cXFwiTTI2IDIuMmMtLjUgMC0uOS40LS45Ljl2MjIuODZhLjkuOSAwIDEgMCAxLjgxIDBWMy4xMWEuOS45IDAgMCAwLS45LS45MVptMCAwXFxcIi8+XFxuICAgIDwvZz5cXG4gICAgPHBhdGggZD1cXFwiTTI5LjUyIDcuNzFhLjkuOSAwIDAgMC0uOTEuOXYxMS44NWEuOS45IDAgMCAwIDEuODEgMFY4LjYyYzAtLjUtLjQtLjktLjktLjlabTMuNSAyLjkzYS45LjkgMCAwIDAtLjkuOTF2NS45N2EuOS45IDAgMCAwIDEuOCAwdi01Ljk3YzAtLjUtLjQtLjktLjktLjlabTMuNS01Ljc4Yy0uNSAwLS45LjQtLjkuOXYxNy41NWEuOS45IDAgMCAwIDEuODEgMFY1Ljc2YzAtLjUtLjQtLjktLjktLjlabTMuNTEgMy4zNGMtLjUgMC0uOS40LS45Ljl2MTAuODdhLjkuOSAwIDAgMCAxLjggMFY5LjFhLjkuOSAwIDAgMC0uOS0uOTFabTMuNSAzLjA4Yy0uNSAwLS45LjQtLjkuOTF2NC43YS45LjkgMCAxIDAgMS44IDB2LTQuN2EuOS45IDAgMCAwLS45LS45Wm0zLjUxLTcuNDVhLjkuOSAwIDAgMC0uOTEuOXYxOS42YS45LjkgMCAwIDAgMS44MSAwVjQuNzRjMC0uNS0uNC0uOS0uOS0uOVptMy41IDUuNTdhLjkuOSAwIDAgMC0uOS45MXY4LjQ1YS45LjkgMCAwIDAgMS44IDB2LTguNDVjMC0uNS0uNC0uOS0uOS0uOVptMCAwXFxcIi8+XFxuICAgIDxnIGNsaXAtcGF0aD1cXFwidXJsKCNjKVxcXCI+XFxuICAgICAgICA8cGF0aCBkPVxcXCJNNTQuMDQgMTIuOTZhLjkuOSAwIDAgMC0uOS45MXYxLjMzYS45LjkgMCAxIDAgMS44IDB2LTEuMzJhLjkuOSAwIDAgMC0uOS0uOTJabTAgMFxcXCIvPlxcbiAgICA8L2c+XFxuPC9zdmc+XCI7IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL21vYmlsZVN0eWxlcy5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL21vYmlsZVN0eWxlcy5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vdGFsa0J1dHRvblN0eWxlcy5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3RhbGtCdXR0b25TdHlsZXMuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJpbXBvcnQgXCIuL3RhbGtCdXR0b25TdHlsZXMuY3NzXCI7XG5pbXBvcnQgXCIuL21vYmlsZVN0eWxlcy5jc3NcIjtcbmltcG9ydCB0YWxrSWNvblNWRyBmcm9tIFwiLi93YXZlZm9ybS5zdmdcIjtcbihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIGNvbnN0IGxvY2FsQ29uZmlnID0ge1xuICAgIGFwcFNlcnZlclVybDogXCJodHRwOi8vbG9jYWxob3N0OjMwMDBcIixcbiAgICBhcGlTZXJ2ZXJVcmw6IFwiaHR0cHM6Ly9sb2NhbGhvc3Q6NTAwMFwiLFxuICAgIC8vIEFkZCBvdGhlciBjb25maWd1cmF0aW9uIHByb3BlcnRpZXMgYXMgbmVlZGVkXG4gIH07XG5cbiAgLy8gRGVmaW5lIGEgZ2xvYmFsIGNvbmZpZ3VyYXRpb24gcHJvcGVydHlcbiAgY29uc3QgcHJvZHVjdGlvbkNvbmZpZyA9IHtcbiAgICBhcHBTZXJ2ZXJVcmw6IFwiaHR0cHM6Ly9hcHAuc2F5cGkuYWlcIixcbiAgICBhcGlTZXJ2ZXJVcmw6IFwiaHR0cHM6Ly9hcGkuc2F5cGkuYWlcIixcbiAgICAvLyBBZGQgb3RoZXIgY29uZmlndXJhdGlvbiBwcm9wZXJ0aWVzIGFzIG5lZWRlZFxuICB9O1xuICBjb25zdCBjb25maWcgPSBwcm9kdWN0aW9uQ29uZmlnO1xuXG4gIGNvbnN0IHBhZ2VTY3JpcHQgPSByZXF1aXJlKFwicmF3LWxvYWRlciEuL3RyYW5zY3JpYmVyLmpzXCIpLmRlZmF1bHQ7XG5cbiAgLy8gQ3JlYXRlIGEgTXV0YXRpb25PYnNlcnZlciB0byBsaXN0ZW4gZm9yIGNoYW5nZXMgdG8gdGhlIERPTVxuICB2YXIgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAobXV0YXRpb25zKSB7XG4gICAgLy8gQ2hlY2sgZWFjaCBtdXRhdGlvblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbXV0YXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbXV0YXRpb24gPSBtdXRhdGlvbnNbaV07XG5cbiAgICAgIC8vIElmIG5vZGVzIHdlcmUgYWRkZWQsIGNoZWNrIGVhY2ggb25lXG4gICAgICBpZiAobXV0YXRpb24uYWRkZWROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbXV0YXRpb24uYWRkZWROb2Rlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgIHZhciBub2RlID0gbXV0YXRpb24uYWRkZWROb2Rlc1tqXTtcblxuICAgICAgICAgIC8vIElmIHRoZSBub2RlIGlzIHRoZSBhcHByb3ByaWF0ZSBjb250YWluZXIgZWxlbWVudCwgYWRkIHRoZSBidXR0b24gYW5kIHN0b3Agb2JzZXJ2aW5nXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgbm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImRpdlwiICYmXG4gICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5jb250YWlucyhcImZpeGVkXCIpICYmXG4gICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5jb250YWlucyhcImJvdHRvbS0xNlwiKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgdmFyIGZvb3RlciA9IG5vZGU7XG4gICAgICAgICAgICB2YXIgYnV0dG9uQ29udGFpbmVyID0gZm9vdGVyLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgICAgIFwiLnJlbGF0aXZlLmZsZXguZmxleC1jb2xcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChidXR0b25Db250YWluZXIpIHtcbiAgICAgICAgICAgICAgYWRkVGFsa0J1dHRvbihidXR0b25Db250YWluZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJObyBidXR0b24gY29udGFpbmVyIGZvdW5kIGluIGZvb3RlclwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBhZGRDb250cm9sUGFuZWwoKTtcblxuICBmdW5jdGlvbiBhZGRDb250cm9sUGFuZWwoKSB7XG4gICAgY29uc3QgY29udHJvbFBhbmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBjb250cm9sUGFuZWwuaWQgPSBcImNvbnRyb2wtcGFuZWxcIjtcbiAgICBkb2N1bWVudC5ib2R5LnByZXBlbmQoY29udHJvbFBhbmVsKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluamVjdFNjcmlwdChjYWxsYmFjaykge1xuICAgIHZhciBzY3JpcHRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICBzY3JpcHRFbGVtZW50LnR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiO1xuICAgIHNjcmlwdEVsZW1lbnQuaWQgPSBcInNheXBpLXNjcmlwdFwiO1xuICAgIGNvbnN0IGNvbmZpZ1RleHQgPSBcInZhciBjb25maWcgPSBcIiArIEpTT04uc3RyaW5naWZ5KGNvbmZpZykgKyBcIjtcIjtcbiAgICBzY3JpcHRFbGVtZW50LnRleHRDb250ZW50ID0gY29uZmlnVGV4dCArIHBhZ2VTY3JpcHQ7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHRFbGVtZW50KTtcblxuICAgIC8vIENhbGwgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIGFmdGVyIHRoZSBzY3JpcHQgaXMgYWRkZWRcbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYWRkVGFsa0J1dHRvbihjb250YWluZXIpIHtcbiAgICAvLyBjcmVhdGUgYSBjb250YWluaW5nIGRpdlxuICAgIHZhciBwYW5lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgcGFuZWwuaWQgPSBcInNheXBpLXBhbmVsXCI7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHBhbmVsKTtcblxuICAgIHZhciBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgIGJ1dHRvbi5pZCA9IFwic2F5cGktdGFsa0J1dHRvblwiO1xuICAgIGJ1dHRvbi50eXBlID0gXCJidXR0b25cIjtcbiAgICBidXR0b24uY2xhc3NOYW1lID1cbiAgICAgIFwicmVsYXRpdmUgZmxleCBtdC0xIG1iLTEgcm91bmRlZC1mdWxsIHB4LTIgcHktMyB0ZXh0LWNlbnRlciBiZy1jcmVhbS01NTAgaG92ZXI6YmctY3JlYW0tNjUwIGhvdmVyOnRleHQtYnJhbmQtZ3JlZW4tNzAwIHRleHQtbXV0ZWRcIjtcbiAgICAvLyBTZXQgQVJJQSBsYWJlbCBhbmQgdG9vbHRpcFxuICAgIGNvbnN0IGxhYmVsID1cbiAgICAgIFwiVGFsayAoSG9sZCBDb250cm9sICsgU3BhY2UgdG8gdXNlIGhvdGtleS4gRG91YmxlIGNsaWNrIHRvIHRvZ2dsZSBhdXRvLXN1Ym1pdCBvbi9vZmYpXCI7XG4gICAgYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgbGFiZWwpO1xuICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiLCBsYWJlbCk7XG4gICAgLy8gZW5hYmxlIGF1dG9zdWJtaXQgYnkgZGVmYXVsdFxuICAgIGJ1dHRvbi5kYXRhc2V0LmF1dG9zdWJtaXQgPSBcInRydWVcIjtcbiAgICBidXR0b24uY2xhc3NMaXN0LmFkZChcImF1dG9TdWJtaXRcIik7XG4gICAgcGFuZWwuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgICBhZGRUYWxrQnV0dG9uU3R5bGVzKCk7XG4gICAgYWRkVGFsa0ljb24oYnV0dG9uKTtcblxuICAgIC8vIENhbGwgdGhlIGZ1bmN0aW9uIHRvIGluamVjdCB0aGUgc2NyaXB0IGFmdGVyIHRoZSBidXR0b24gaGFzIGJlZW4gYWRkZWRcbiAgICBpbmplY3RTY3JpcHQocmVnaXN0ZXJBdWRpb0J1dHRvbkV2ZW50cyk7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRUYWxrSWNvbihidXR0b24pIHtcbiAgICB2YXIgaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIFwic3ZnXCIpO1xuICAgIGJ1dHRvbi5hcHBlbmRDaGlsZChpY29uKTtcbiAgICBpY29uLm91dGVySFRNTCA9IHRhbGtJY29uU1ZHO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkU3R5bGVzKGNzcykge1xuICAgIGNvbnN0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICAgIHN0eWxlLnR5cGUgPSBcInRleHQvY3NzXCI7XG4gICAgc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRUYWxrQnV0dG9uU3R5bGVzKCkge1xuICAgIHZhciBpc0ZpcmVmb3hBbmRyb2lkID1cbiAgICAgIC9GaXJlZm94Ly50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpICYmXG4gICAgICAvQW5kcm9pZC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICBpZiAoaXNGaXJlZm94QW5kcm9pZCkge1xuICAgICAgLy8gaGFjayBmb3IgRmlyZWZveCBvbiBBbmRyb2lkLCB3aGljaCBkb2Vzbid0IHN1cHBvcnQgOmFjdGl2ZSBjb3JyZWN0bHlcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZmlyZWZveC1hbmRyb2lkXCIpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlZ2lzdGVyQXVkaW9CdXR0b25FdmVudHMoKSB7XG4gICAgdmFyIGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F5cGktdGFsa0J1dHRvblwiKTtcbiAgICB2YXIgY29udGV4dCA9IHdpbmRvdztcbiAgICBpZiAoR01faW5mby5zY3JpcHRIYW5kbGVyICE9PSBcIlVzZXJzY3JpcHRzXCIpIHtcbiAgICAgIGNvbnRleHQgPSB1bnNhZmVXaW5kb3c7XG4gICAgfVxuXG4gICAgLy8gRm9yIGRlc2t0b3BcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICBpZFByb21wdFRleHRBcmVhKCk7XG4gICAgICBjb250ZXh0LnN0YXJ0UmVjb3JkaW5nKCk7XG4gICAgfSk7XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0eXBlb2YgY29udGV4dD8uc3RvcFJlY29yZGluZyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGNvbnRleHQuc3RvcFJlY29yZGluZygpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmVnaXN0ZXJIb3RrZXkoKTtcblxuICAgIC8vIFwid2FybSB1cFwiIHRoZSBtaWNyb3Bob25lIGJ5IGFjcXVpcmluZyBpdCBiZWZvcmUgdGhlIHVzZXIgcHJlc3NlcyB0aGUgYnV0dG9uXG4gICAgZG9jdW1lbnRcbiAgICAgIC5nZXRFbGVtZW50QnlJZChcInNheXBpLXRhbGtCdXR0b25cIilcbiAgICAgIC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCBzZXR1cFJlY29yZGluZyk7XG4gICAgZG9jdW1lbnRcbiAgICAgIC5nZXRFbGVtZW50QnlJZChcInNheXBpLXRhbGtCdXR0b25cIilcbiAgICAgIC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCB0ZWFyRG93blJlY29yZGluZyk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJiZWZvcmV1bmxvYWRcIiwgdGVhckRvd25SZWNvcmRpbmcpO1xuXG4gICAgLy8gQXR0YWNoIGEgZG91YmxlIGNsaWNrIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSB0YWxrIGJ1dHRvblxuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiZGJsY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgLy8gVG9nZ2xlIHRoZSBDU1MgY2xhc3NlcyB0byBpbmRpY2F0ZSB0aGUgbW9kZVxuICAgICAgYnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoXCJhdXRvU3VibWl0XCIpO1xuXG4gICAgICAvLyBTdG9yZSB0aGUgc3RhdGUgb24gdGhlIGJ1dHRvbiBlbGVtZW50IHVzaW5nIGEgY3VzdG9tIGRhdGEgYXR0cmlidXRlXG4gICAgICBpZiAoYnV0dG9uLmdldEF0dHJpYnV0ZShcImRhdGEtYXV0b3N1Ym1pdFwiKSA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZShcImRhdGEtYXV0b3N1Ym1pdFwiLCBcImZhbHNlXCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhcImF1dG9zdWJtaXQgZGlzYWJsZWRcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBidXR0b24uc2V0QXR0cmlidXRlKFwiZGF0YS1hdXRvc3VibWl0XCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJhdXRvc3VibWl0IGVuYWJsZWRcIik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBGb3IgbW9iaWxlXG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7IC8vIFByZXZlbnQgdGhlIGRlZmF1bHQgY2xpY2sgYmVoYXZpb3IgZnJvbSBoYXBwZW5pbmdcbiAgICAgIGlkUHJvbXB0VGV4dEFyZWEoKTtcbiAgICAgIGNvbnRleHQuc3RhcnRSZWNvcmRpbmcoKTtcbiAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTsgLy8gQWRkIHRoZSBhY3RpdmUgY2xhc3MgKGZvciBGaXJlZm94IG9uIEFuZHJvaWQpXG4gICAgfSk7XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7IC8vIFJlbW92ZSB0aGUgYWN0aXZlIGNsYXNzIChmb3IgRmlyZWZveCBvbiBBbmRyb2lkXG4gICAgICBjb250ZXh0LnN0b3BSZWNvcmRpbmcoKTtcbiAgICB9KTtcbiAgICBkb2N1bWVudFxuICAgICAgLmdldEVsZW1lbnRCeUlkKFwic2F5cGktdGFsa0J1dHRvblwiKVxuICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGNhbmNlbFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTsgLy8gUmVtb3ZlIHRoZSBhY3RpdmUgY2xhc3MgKGZvciBGaXJlZm94IG9uIEFuZHJvaWRcbiAgICAgICAgdGVhckRvd25SZWNvcmRpbmcoKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVnaXN0ZXJIb3RrZXkoKSB7XG4gICAgLy8gUmVnaXN0ZXIgYSBob3RrZXkgZm9yIHRoZSBidXR0b25cbiAgICBsZXQgY3RybERvd24gPSBmYWxzZTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgaWYgKGV2ZW50LmN0cmxLZXkgJiYgZXZlbnQuY29kZSA9PT0gXCJTcGFjZVwiICYmICFjdHJsRG93bikge1xuICAgICAgICBjdHJsRG93biA9IHRydWU7XG4gICAgICAgIC8vIFNpbXVsYXRlIG1vdXNlZG93biBldmVudFxuICAgICAgICBsZXQgbW91c2VEb3duRXZlbnQgPSBuZXcgRXZlbnQoXCJtb3VzZWRvd25cIik7XG4gICAgICAgIGRvY3VtZW50XG4gICAgICAgICAgLmdldEVsZW1lbnRCeUlkKFwic2F5cGktdGFsa0J1dHRvblwiKVxuICAgICAgICAgIC5kaXNwYXRjaEV2ZW50KG1vdXNlRG93bkV2ZW50KTtcbiAgICAgICAgdGFsa0J1dHRvbi5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpOyAvLyBBZGQgdGhlIGFjdGl2ZSBjbGFzc1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgaWYgKGN0cmxEb3duICYmIGV2ZW50LmNvZGUgPT09IFwiU3BhY2VcIikge1xuICAgICAgICBjdHJsRG93biA9IGZhbHNlO1xuICAgICAgICAvLyBTaW11bGF0ZSBtb3VzZXVwIGV2ZW50XG4gICAgICAgIGxldCBtb3VzZVVwRXZlbnQgPSBuZXcgRXZlbnQoXCJtb3VzZXVwXCIpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNheXBpLXRhbGtCdXR0b25cIikuZGlzcGF0Y2hFdmVudChtb3VzZVVwRXZlbnQpO1xuICAgICAgICB0YWxrQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBpZFByb21wdFRleHRBcmVhKCkge1xuICAgIHZhciB0ZXh0YXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJvbXB0XCIpO1xuICAgIGlmICghdGV4dGFyZWEpIHtcbiAgICAgIC8vIEZpbmQgdGhlIGZpcnN0IDx0ZXh0YXJlYT4gZWxlbWVudCBhbmQgZ2l2ZSBpdCBhbiBpZFxuICAgICAgdmFyIHRleHRhcmVhRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ0ZXh0YXJlYVwiKTtcbiAgICAgIGlmICh0ZXh0YXJlYUVsZW1lbnQpIHtcbiAgICAgICAgdGV4dGFyZWFFbGVtZW50LmlkID0gXCJwcm9tcHRcIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiTm8gPHRleHRhcmVhPiBlbGVtZW50IGZvdW5kXCIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFN0YXJ0IG9ic2VydmluZyB0aGUgZW50aXJlIGRvY3VtZW50IGZvciBjaGFuZ2VzIHRvIGNoaWxkIG5vZGVzIGFuZCBzdWJ0cmVlXG4gIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQsIHsgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH0pO1xufSkoKTtcbiJdLCJuYW1lcyI6WyJ0YWxrSWNvblNWRyIsImxvY2FsQ29uZmlnIiwiYXBwU2VydmVyVXJsIiwiYXBpU2VydmVyVXJsIiwicHJvZHVjdGlvbkNvbmZpZyIsImNvbmZpZyIsInBhZ2VTY3JpcHQiLCJyZXF1aXJlIiwib2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwibXV0YXRpb25zIiwiaSIsImxlbmd0aCIsIm11dGF0aW9uIiwiYWRkZWROb2RlcyIsImoiLCJub2RlIiwibm9kZU5hbWUiLCJ0b0xvd2VyQ2FzZSIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwiZm9vdGVyIiwiYnV0dG9uQ29udGFpbmVyIiwicXVlcnlTZWxlY3RvciIsImFkZFRhbGtCdXR0b24iLCJjb25zb2xlIiwibG9nIiwiZGlzY29ubmVjdCIsImFkZENvbnRyb2xQYW5lbCIsImNvbnRyb2xQYW5lbCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImlkIiwiYm9keSIsInByZXBlbmQiLCJpbmplY3RTY3JpcHQiLCJjYWxsYmFjayIsInNjcmlwdEVsZW1lbnQiLCJ0eXBlIiwiY29uZmlnVGV4dCIsIkpTT04iLCJzdHJpbmdpZnkiLCJ0ZXh0Q29udGVudCIsImFwcGVuZENoaWxkIiwiY29udGFpbmVyIiwicGFuZWwiLCJidXR0b24iLCJjbGFzc05hbWUiLCJsYWJlbCIsInNldEF0dHJpYnV0ZSIsImRhdGFzZXQiLCJhdXRvc3VibWl0IiwiYWRkIiwiYWRkVGFsa0J1dHRvblN0eWxlcyIsImFkZFRhbGtJY29uIiwicmVnaXN0ZXJBdWRpb0J1dHRvbkV2ZW50cyIsImljb24iLCJjcmVhdGVFbGVtZW50TlMiLCJvdXRlckhUTUwiLCJhZGRTdHlsZXMiLCJjc3MiLCJzdHlsZSIsImNyZWF0ZVRleHROb2RlIiwiaGVhZCIsImlzRmlyZWZveEFuZHJvaWQiLCJ0ZXN0IiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwiZG9jdW1lbnRFbGVtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJjb250ZXh0Iiwid2luZG93IiwiR01faW5mbyIsInNjcmlwdEhhbmRsZXIiLCJ1bnNhZmVXaW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwiaWRQcm9tcHRUZXh0QXJlYSIsInN0YXJ0UmVjb3JkaW5nIiwiX2NvbnRleHQiLCJzdG9wUmVjb3JkaW5nIiwicmVnaXN0ZXJIb3RrZXkiLCJzZXR1cFJlY29yZGluZyIsInRlYXJEb3duUmVjb3JkaW5nIiwidG9nZ2xlIiwiZ2V0QXR0cmlidXRlIiwiZSIsInByZXZlbnREZWZhdWx0IiwicmVtb3ZlIiwiY3RybERvd24iLCJldmVudCIsImN0cmxLZXkiLCJjb2RlIiwibW91c2VEb3duRXZlbnQiLCJFdmVudCIsImRpc3BhdGNoRXZlbnQiLCJ0YWxrQnV0dG9uIiwibW91c2VVcEV2ZW50IiwidGV4dGFyZWEiLCJ0ZXh0YXJlYUVsZW1lbnQiLCJvYnNlcnZlIiwiY2hpbGRMaXN0Iiwic3VidHJlZSJdLCJzb3VyY2VSb290IjoiIn0=