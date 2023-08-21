// ==UserScript==
// @name         Say, Pi
// @namespace    http://www.saypi.ai/
// @version      1.2.5
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

/***/ "./src/AnimationModule.js":
/*!********************************!*\
  !*** ./src/AnimationModule.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AnimationModule)
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var AnimationModule = /*#__PURE__*/function () {
  function AnimationModule() {
    _classCallCheck(this, AnimationModule);
  }
  _createClass(AnimationModule, null, [{
    key: "animate",
    value: function animate(animation) {
      this.stopOtherAnimations(animation);
      var rectangles = document.querySelectorAll(this.rectanglesSelector);
      rectangles.forEach(function (rect) {
        return rect.classList.add(animation);
      });
    }
  }, {
    key: "inanimate",
    value: function inanimate(animation) {
      var rectangles = document.querySelectorAll(this.rectanglesSelector);
      rectangles.forEach(function (rect) {
        return rect.classList.remove(animation);
      });
    }
  }, {
    key: "stopAllAnimations",
    value: function stopAllAnimations() {
      var _this = this;
      this.talkButtonAnimations.forEach(function (animation) {
        return _this.inanimate(animation);
      });
    }
  }, {
    key: "stopOtherAnimations",
    value: function stopOtherAnimations(keepAnimation) {
      var _this2 = this;
      this.talkButtonAnimations.forEach(function (animation) {
        if (animation !== keepAnimation) {
          _this2.inanimate(animation);
        }
      });
    }
  }]);
  return AnimationModule;
}();
_defineProperty(AnimationModule, "rectanglesSelector", ".outermost, .second, .third, .fourth, .fifth, .innermost");
_defineProperty(AnimationModule, "talkButtonAnimations", ["readyToRespond"]);


/***/ }),

/***/ "./src/ButtonModule.js":
/*!*****************************!*\
  !*** ./src/ButtonModule.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ButtonModule)
/* harmony export */ });
/* harmony import */ var _AnimationModule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AnimationModule */ "./src/AnimationModule.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

var ButtonModule = /*#__PURE__*/function () {
  function ButtonModule() {
    _classCallCheck(this, ButtonModule);
    this.playButton = null;
    // Binding methods to the current instance
    this.handlePlayButtonClick = this.handlePlayButtonClick.bind(this);
    this.registerButtonEvents();
    this.registerOtherEvents();
  }
  _createClass(ButtonModule, [{
    key: "registerButtonEvents",
    value: function registerButtonEvents() {
      var _this = this;
      window.addEventListener("saypi:awaitingUserInput", function () {
        _this.pokeUser();
      });
      window.addEventListener("saypi:receivedUserInput", function () {
        _this.unpokeUser();
      });
      window.addEventListener("audio:loading", function () {
        _AnimationModule__WEBPACK_IMPORTED_MODULE_0__["default"].animate("loading");
      });
      window.addEventListener("saypi:piSpeaking", function () {
        _this.unpokeUser(); // playback has started, user input is no longer needed
        _AnimationModule__WEBPACK_IMPORTED_MODULE_0__["default"].inanimate("loading");
        _AnimationModule__WEBPACK_IMPORTED_MODULE_0__["default"].animate("piSpeaking");
      });
      ["saypi:piStoppedSpeaking", "saypi:piFinishedSpeaking"].forEach(function (eventName) {
        window.addEventListener(eventName, function () {
          _AnimationModule__WEBPACK_IMPORTED_MODULE_0__["default"].inanimate("piSpeaking");
        });
      });
      window.addEventListener("saypi:userSpeaking", function () {
        var talkButton = document.getElementById("saypi-talkButton");
        talkButton.classList.add("active"); // Add the active class (for Firefox on Android)
        _AnimationModule__WEBPACK_IMPORTED_MODULE_0__["default"].animate("userSpeaking");
      });
      ["saypi:userStoppedSpeaking", "saypi:userFinishedSpeaking"].forEach(function (eventName) {
        window.addEventListener(eventName, function () {
          var talkButton = document.getElementById("saypi-talkButton");
          talkButton.classList.remove("active"); // Remove the active class (for Firefox on Android)
          _AnimationModule__WEBPACK_IMPORTED_MODULE_0__["default"].inanimate("userSpeaking");
        });
      });
      window.addEventListener("saypi:transcribing", function () {
        _AnimationModule__WEBPACK_IMPORTED_MODULE_0__["default"].animate("transcribing");
      });
      window.addEventListener("saypi:transcribed", function () {
        _AnimationModule__WEBPACK_IMPORTED_MODULE_0__["default"].inanimate("transcribing");
      });
    }
  }, {
    key: "registerOtherEvents",
    value: function registerOtherEvents() {
      window.addEventListener("saypi:autoSubmit", ButtonModule.handleAutoSubmit);
    }

    // Function to create a new button
  }, {
    key: "createButton",
    value: function createButton(label, callback) {
      var button = document.createElement("button");
      button.textContent = label;
      button.onclick = callback;
      return button;
    }

    // Function to style a given button
  }, {
    key: "styleButton",
    value: function styleButton(button, styles) {
      for (var key in styles) {
        if (styles.hasOwnProperty(key)) {
          button.style[key] = styles[key];
        }
      }
    }

    // Simulate an "Enter" keypress event on a form
  }, {
    key: "createPlayButton",
    value: function createPlayButton() {
      var label = "Hear Pi's response";
      this.playButton = this.createButton("", function () {});
      this.playButton.id = "saypi-playButton";
      this.playButton.type = "button";
      this.playButton.className = "hidden play-button";
      this.playButton.setAttribute("aria-label", label);
      this.playButton.setAttribute("title", label);
      this.playButton.addEventListener("click", this.handlePlayButtonClick);
      document.body.appendChild(this.playButton);
      return this.playButton;
    }
  }, {
    key: "showPlayButton",
    value: function showPlayButton() {
      if (!this.playButton) {
        this.createPlayButton();
      }
      this.playButton.classList.remove("hidden");
    }
  }, {
    key: "hidePlayButton",
    value: function hidePlayButton() {
      if (this.playButton) {
        this.playButton.classList.add("hidden");
      }
    }
  }, {
    key: "handlePlayButtonClick",
    value: function handlePlayButtonClick() {
      this.unpokeUser();
      dispatchCustomEvent("saypi:receivedUserInput"); // doubling up with previous line?
      piAudioManager.userPlay();
    }
  }, {
    key: "pokeUser",
    value: function pokeUser() {
      _AnimationModule__WEBPACK_IMPORTED_MODULE_0__["default"].animate("readyToRespond");
      this.showPlayButton();
    }
  }, {
    key: "unpokeUser",
    value: function unpokeUser() {
      _AnimationModule__WEBPACK_IMPORTED_MODULE_0__["default"].inanimate("readyToRespond");
      this.hidePlayButton();
    }
  }], [{
    key: "simulateFormSubmit",
    value: function simulateFormSubmit() {
      var textarea = document.getElementById("saypi-prompt");
      var enterEvent = new KeyboardEvent("keydown", {
        bubbles: true,
        key: "Enter",
        keyCode: 13,
        which: 13
      });
      textarea.dispatchEvent(enterEvent);
    }

    // Function to handle auto-submit based on the button's data attribute
  }, {
    key: "handleAutoSubmit",
    value: function handleAutoSubmit() {
      var talkButton = document.getElementById("saypi-talkButton");
      if (talkButton.dataset.autosubmit === "false") {
        console.log("Autosubmit is disabled");
      } else {
        ButtonModule.simulateFormSubmit();
      }
    }
  }]);
  return ButtonModule;
}();


/***/ }),

/***/ "./src/EventModule.js":
/*!****************************!*\
  !*** ./src/EventModule.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EventModule)
/* harmony export */ });
/* harmony import */ var _UserAgentModule_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UserAgentModule.js */ "./src/UserAgentModule.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

var EventModule = /*#__PURE__*/function () {
  function EventModule() {
    _classCallCheck(this, EventModule);
  }
  _createClass(EventModule, null, [{
    key: "init",
    value: function init() {
      // All the event listeners can be added here
      this.handleAudioEvents();
      // Any other initializations...
    }
  }, {
    key: "cleanup",
    value: function cleanup() {
      // Remove event listeners if needed, or any other cleanup operations
      window.removeEventListener("saypi:transcribed", this.handleTranscriptionResponse);
    }

    // Dispatch Custom Event
    // TODO: remove duplicated function from transcriber.js
  }, {
    key: "dispatchCustomEvent",
    value: function dispatchCustomEvent(eventName) {
      var detail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var event = new CustomEvent(eventName, {
        detail: detail
      });
      console.log("dispatching event: " + eventName);
      window.dispatchEvent(event);
    }
  }, {
    key: "handleAudioEvents",
    value: function handleAudioEvents() {
      window.addEventListener("saypi:transcribed", EventModule.handleTranscriptionResponse);
    }
  }, {
    key: "handleTranscriptionResponse",
    value: function handleTranscriptionResponse(transcriptionEvent) {
      var transcript = transcriptionEvent.detail.text;
      console.log("Transcript: " + transcript);
      var textarea = document.getElementById("saypi-prompt");
      if ((0,_UserAgentModule_js__WEBPACK_IMPORTED_MODULE_0__.isMobileView)()) {
        // if transcript is > 1000 characters, truncate it to 999 characters plus an ellipsis
        if (transcript.length > 1000) {
          transcript = transcript.substring(0, 999) + "…";
          console.warn("Transcript was too long for Pi. Truncated to 999 characters, losing the following text: ... " + transcript.substring(999));
        }
        EventModule.setNativeValue(textarea, transcript);
        EventModule.dispatchCustomEvent("saypi:autoSubmit");
      } else {
        EventModule.simulateTyping(textarea, transcript + " ");
      }
    }
  }, {
    key: "simulateTyping",
    value: function simulateTyping(element, text) {
      var words = text.split(" ");
      var i = 0;
      var typeWord = function typeWord() {
        if (i < words.length) {
          EventModule.setNativeValue(element, element.value + words[i++] + " ");
          requestAnimationFrame(typeWord);
        } else {
          EventModule.dispatchCustomEvent("saypi:autoSubmit");
        }
      };
      typeWord();
    }
  }, {
    key: "setNativeValue",
    value: function setNativeValue(element, value) {
      var lastValue = element.value;
      element.value = value;
      var event = new Event("input", {
        target: element,
        bubbles: true
      });
      // React 15
      event.simulated = true;
      // React 16-17
      var tracker = element._valueTracker;
      if (tracker) {
        tracker.setValue(lastValue);
      }
      element.dispatchEvent(event);
    }
  }, {
    key: "handleTalkMouseDown",
    value: function handleTalkMouseDown() {
      dispatchCustomEvent("audio:startRecording");
    }
  }, {
    key: "handleTalkMouseUp",
    value: function handleTalkMouseUp() {
      dispatchCustomEvent("audio:stopRecording");
    }
  }, {
    key: "handleTalkDoubleClick",
    value: function handleTalkDoubleClick(button) {
      // Toggle the CSS classes to indicate the mode
      button.classList.toggle("autoSubmit");
      if (button.getAttribute("data-autosubmit") === "true") {
        button.setAttribute("data-autosubmit", "false");
        console.log("autosubmit disabled");
      } else {
        button.setAttribute("data-autosubmit", "true");
        console.log("autosubmit enabled");
      }
    }
  }, {
    key: "handleTalkTouchStart",
    value: function handleTalkTouchStart(button, e) {
      e.preventDefault();
      this.dispatchCustomEvent("audio:startRecording");
    }
  }, {
    key: "handleTalkTouchEnd",
    value: function handleTalkTouchEnd(button) {
      this.dispatchCustomEvent("audio:stopRecording");
    }
  }, {
    key: "setContext",
    value: function setContext(ctx) {
      this.context = ctx;
    }
  }, {
    key: "registerOtherAudioButtonEvents",
    value: function registerOtherAudioButtonEvents(button) {
      // "warm up" the microphone by acquiring it before the user presses the button
      button.addEventListener("mouseenter", function () {
        EventModule.dispatchCustomEvent("audio:setupRecording");
      });
      button.addEventListener("mouseleave", function () {
        EventModule.dispatchCustomEvent("audio:tearDownRecording");
      });
      window.addEventListener("beforeunload", function () {
        EventModule.dispatchCustomEvent("audio:tearDownRecording");
      });
      button.addEventListener("touchcancel", function () {
        EventModule.dispatchCustomEvent("audio:tearDownRecording");
      });
    }
  }, {
    key: "registerCustomAudioEventListeners",
    value: function registerCustomAudioEventListeners() {
      window.addEventListener("saypi:piReadyToRespond", function (e) {
        if ((0,_UserAgentModule_js__WEBPACK_IMPORTED_MODULE_0__.isSafari)()) {
          EventModule.dispatchCustomEvent("saypi:awaitingUserInput");
        }
      });
      window.addEventListener("audio:loading", function (e) {
        // Handle the piSpeaking event, e.g., start an animation or show a UI element.
        if ((0,_UserAgentModule_js__WEBPACK_IMPORTED_MODULE_0__.isSafari)()) {
          EventModule.dispatchCustomEvent("saypi:receivedUserInput");
        }
      });
    }

    /* events to direct the audio module to start/stop recording */
  }, {
    key: "registerHotkey",
    value: function registerHotkey() {
      var _this = this;
      var ctrlDown = false;
      document.addEventListener("keydown", function (event) {
        if (event.ctrlKey && event.code === "Space" && !ctrlDown) {
          ctrlDown = true;
          _this.dispatchCustomEvent("audio:startRecording");
        }
      });
      document.addEventListener("keyup", function (event) {
        if (ctrlDown && event.code === "Space") {
          ctrlDown = false;
          _this.dispatchCustomEvent("audio:stopRecording");
        }
      });
    }
  }]);
  return EventModule;
}();
_defineProperty(EventModule, "context", window);


/***/ }),

/***/ "./src/UserAgentModule.js":
/*!********************************!*\
  !*** ./src/UserAgentModule.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isMobileView: () => (/* binding */ isMobileView),
/* harmony export */   isSafari: () => (/* binding */ isSafari)
/* harmony export */ });
function isMobileView() {
  return window.matchMedia("(max-width: 768px)").matches;
}
// TODO: dedupe this function from transcriber.js
function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

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

/* bounce animation to indicate Pi is waiting to speak */
@keyframes bounce_outermost {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5%);
  }
  60% {
    transform: translateY(-3%);
  }
}
.outermost.readyToRespond {
  animation-name: bounce_outermost;
  animation-duration: 2s;
  animation-iteration-count: infinite;
}

@keyframes bounce_second {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5.8%);
  }
  60% {
    transform: translateY(-3.48%);
  }
}
.second.readyToRespond {
  animation-name: bounce_second;
  animation-duration: 2s;
  animation-iteration-count: infinite;
}

@keyframes bounce_third {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-6.6%);
  }
  60% {
    transform: translateY(-3.96%);
  }
}
.third.readyToRespond {
  animation-name: bounce_third;
  animation-duration: 2s;
  animation-iteration-count: infinite;
}

@keyframes bounce_fourth {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-7.4%);
  }
  60% {
    transform: translateY(-4.44%);
  }
}
.fourth.readyToRespond {
  animation-name: bounce_fourth;
  animation-duration: 2s;
  animation-iteration-count: infinite;
}

@keyframes bounce_fifth {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8.2%);
  }
  60% {
    transform: translateY(-4.92%);
  }
}
.fifth.readyToRespond {
  animation-name: bounce_fifth;
  animation-duration: 2s;
  animation-iteration-count: infinite;
}

@keyframes bounce_innermost {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-9%);
  }
  60% {
    transform: translateY(-5.4%);
  }
}
.innermost.readyToRespond {
  animation-name: bounce_innermost;
  animation-duration: 2s;
  animation-iteration-count: infinite;
}

/* playful animation to indicate Pi is speaking */
@keyframes speaking_outermost {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(0.995);
  }
  50% {
    transform: scale(0.9);
  }
  75% {
    transform: scale(0.895);
  }
}
.outermost.piSpeaking {
  animation: speaking_outermost 2s infinite;
  transform-origin: center;
}

@keyframes speaking_second {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(0.98) rotate(-1deg);
  }
  50% {
    transform: scale(0.87) rotate(0deg);
  }
  75% {
    transform: scale(0.865) rotate(1deg);
  }
}
.second.piSpeaking {
  animation: speaking_second 2s infinite;
  transform-origin: center;
}

@keyframes speaking_third {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(0.965) rotate(-2deg);
  }
  50% {
    transform: scale(0.84) rotate(0deg);
  }
  75% {
    transform: scale(0.835) rotate(2deg);
  }
}
.third.piSpeaking {
  animation: speaking_third 2s infinite;
  transform-origin: center;
}

@keyframes speaking_fourth {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(0.95) rotate(-3deg);
  }
  50% {
    transform: scale(0.81) rotate(0deg);
  }
  75% {
    transform: scale(0.805) rotate(3deg);
  }
}
.fourth.piSpeaking {
  animation: speaking_fourth 2s infinite;
  transform-origin: center;
}

@keyframes speaking_fifth {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(0.935) rotate(-4deg);
  }
  50% {
    transform: scale(0.78) rotate(0deg);
  }
  75% {
    transform: scale(0.775) rotate(4deg);
  }
}
.fifth.piSpeaking {
  animation: speaking_fifth 2s infinite;
  transform-origin: center;
}

@keyframes speaking_innermost {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(0.92) rotate(-5deg);
  }
  50% {
    transform: scale(0.75) rotate(0deg);
  }
  75% {
    transform: scale(0.745) rotate(5deg);
  }
}
.innermost.piSpeaking {
  animation: speaking_innermost 2s infinite;
  transform-origin: center;
}

/* wave animation to indicate user is speaking */
@keyframes userSpeakingAnimation {
  50% {
    transform: scaleY(0.05) scaleX(var(--width-factor))
      translateX(calc(-50% + var(--spread-amount)));
  }
  100% {
    transform: scaleY(1) scaleX(var(--width-factor))
      translateX(calc(-50% + var(--spread-amount)));
  }
}
/* user speaking oscillation animation */
@keyframes waveform_outermost {
  0%,
  100% {
    transform: scaleY(1) scaleX(1);
  }
  25%,
  75% {
    transform: scaleY(0.9) scaleX(0.9);
  }
}

@keyframes waveform_second {
  0%,
  100% {
    transform: scaleY(0.9) scaleX(0.9);
  }
  25%,
  75% {
    transform: scaleY(0.8) scaleX(0.8);
  }
}

@keyframes waveform_third {
  0%,
  100% {
    transform: scaleY(0.8) scaleX(0.8);
  }
  25%,
  75% {
    transform: scaleY(0.7) scaleX(0.7);
  }
}

@keyframes waveform_fourth {
  0%,
  100% {
    transform: scaleY(0.7) scaleX(0.7);
  }
  25%,
  75% {
    transform: scaleY(0.6) scaleX(0.6);
  }
}

@keyframes waveform_fifth {
  0%,
  100% {
    transform: scaleY(0.6) scaleX(0.6);
  }
  25%,
  75% {
    transform: scaleY(0.5) scaleX(0.5);
  }
}

@keyframes waveform_innermost {
  0%,
  100% {
    transform: scaleY(0.5) scaleX(0.5);
  }
  25%,
  75% {
    transform: scaleY(0.4) scaleX(0.4);
  }
}

.outermost.userSpeaking {
  animation: waveform_outermost 0.7s infinite alternate;
}

.second.userSpeaking {
  animation: waveform_second 0.65s infinite alternate;
}

.third.userSpeaking {
  animation: waveform_third 0.6s infinite alternate;
}

.fourth.userSpeaking {
  animation: waveform_fourth 0.55s infinite alternate;
}

.fifth.userSpeaking {
  animation: waveform_fifth 0.5s infinite alternate;
}

.innermost.userSpeaking {
  animation: waveform_innermost 0.45s infinite alternate;
}

/* flipcard animation to indicate Say, Pi is transcribing audio to text */
@keyframes transcribingFlip {
  0%,
  100% {
    transform: rotateY(0deg);
    fill: var(--original-color);
  }
  50% {
    transform: rotateY(180deg);
    fill: var(--transcribing-color);
  }
}

.outermost.transcribing {
  --original-color: #e4f2d1;
  --transcribing-color: #b3e0fe;
  animation: transcribingFlip 1.5s infinite;
}

.second.transcribing {
  --original-color: #cce8b5;
  --transcribing-color: #89c2ff;
  animation: transcribingFlip 1.6s infinite;
}

.third.transcribing {
  --original-color: #b3db95;
  --transcribing-color: #5fa4ff;
  animation: transcribingFlip 1.7s infinite;
}

.fourth.transcribing {
  --original-color: #9bd078;
  --transcribing-color: #3586ff;
  animation: transcribingFlip 1.8s infinite;
}

.fifth.transcribing {
  --original-color: #83c55c;
  --transcribing-color: #0b69e3;
  animation: transcribingFlip 1.9s infinite;
}

.innermost.transcribing {
  --original-color: #428a2f;
  --transcribing-color: #0053bf;
  animation: transcribingFlip 2s infinite;
}

/* inhalation animation to indicate Pi is preparing to speak */
@keyframes loadingInhalation {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05); /* Slightly scaled up */
  }
}

.outermost.loading {
  animation: loadingInhalation 2s infinite;
}

.second.loading {
  animation: loadingInhalation 2.1s infinite;
}

.third.loading {
  animation: loadingInhalation 2.2s infinite;
}

.fourth.loading {
  animation: loadingInhalation 2.3s infinite;
}

.fifth.loading {
  animation: loadingInhalation 2.4s infinite;
}

.innermost.loading {
  animation: loadingInhalation 2.5s infinite;
}
`, "",{"version":3,"sources":["webpack://./src/rectangles.css"],"names":[],"mappings":"AAAA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,sBAAsB;EACxB;AACF;AACA;EACE,sCAAsC;EACtC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,mCAAmC;EACnC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,kCAAkC;EAClC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,mCAAmC;EACnC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,kCAAkC;EAClC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,qBAAqB;EACvB;AACF;AACA;EACE,sCAAsC;EACtC,wBAAwB;AAC1B;;AAEA,wDAAwD;AACxD;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,0BAA0B;EAC5B;EACA;IACE,0BAA0B;EAC5B;AACF;AACA;EACE,gCAAgC;EAChC,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,4BAA4B;EAC9B;EACA;IACE,6BAA6B;EAC/B;AACF;AACA;EACE,6BAA6B;EAC7B,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,4BAA4B;EAC9B;EACA;IACE,6BAA6B;EAC/B;AACF;AACA;EACE,4BAA4B;EAC5B,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,4BAA4B;EAC9B;EACA;IACE,6BAA6B;EAC/B;AACF;AACA;EACE,6BAA6B;EAC7B,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,4BAA4B;EAC9B;EACA;IACE,6BAA6B;EAC/B;AACF;AACA;EACE,4BAA4B;EAC5B,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,0BAA0B;EAC5B;EACA;IACE,4BAA4B;EAC9B;AACF;AACA;EACE,gCAAgC;EAChC,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA,iDAAiD;AACjD;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,uBAAuB;EACzB;EACA;IACE,qBAAqB;EACvB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,yCAAyC;EACzC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,oCAAoC;EACtC;EACA;IACE,mCAAmC;EACrC;EACA;IACE,oCAAoC;EACtC;AACF;AACA;EACE,sCAAsC;EACtC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,qCAAqC;EACvC;EACA;IACE,mCAAmC;EACrC;EACA;IACE,oCAAoC;EACtC;AACF;AACA;EACE,qCAAqC;EACrC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,oCAAoC;EACtC;EACA;IACE,mCAAmC;EACrC;EACA;IACE,oCAAoC;EACtC;AACF;AACA;EACE,sCAAsC;EACtC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,qCAAqC;EACvC;EACA;IACE,mCAAmC;EACrC;EACA;IACE,oCAAoC;EACtC;AACF;AACA;EACE,qCAAqC;EACrC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,oCAAoC;EACtC;EACA;IACE,mCAAmC;EACrC;EACA;IACE,oCAAoC;EACtC;AACF;AACA;EACE,yCAAyC;EACzC,wBAAwB;AAC1B;;AAEA,gDAAgD;AAChD;EACE;IACE;mDAC+C;EACjD;EACA;IACE;mDAC+C;EACjD;AACF;AACA,wCAAwC;AACxC;EACE;;IAEE,8BAA8B;EAChC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE;;IAEE,kCAAkC;EACpC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE;;IAEE,kCAAkC;EACpC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE;;IAEE,kCAAkC;EACpC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE;;IAEE,kCAAkC;EACpC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE;;IAEE,kCAAkC;EACpC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE,qDAAqD;AACvD;;AAEA;EACE,mDAAmD;AACrD;;AAEA;EACE,iDAAiD;AACnD;;AAEA;EACE,mDAAmD;AACrD;;AAEA;EACE,iDAAiD;AACnD;;AAEA;EACE,sDAAsD;AACxD;;AAEA,yEAAyE;AACzE;EACE;;IAEE,wBAAwB;IACxB,2BAA2B;EAC7B;EACA;IACE,0BAA0B;IAC1B,+BAA+B;EACjC;AACF;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,yCAAyC;AAC3C;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,yCAAyC;AAC3C;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,yCAAyC;AAC3C;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,yCAAyC;AAC3C;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,yCAAyC;AAC3C;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,uCAAuC;AACzC;;AAEA,8DAA8D;AAC9D;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,sBAAsB,EAAE,uBAAuB;EACjD;AACF;;AAEA;EACE,wCAAwC;AAC1C;;AAEA;EACE,0CAA0C;AAC5C;;AAEA;EACE,0CAA0C;AAC5C;;AAEA;EACE,0CAA0C;AAC5C;;AAEA;EACE,0CAA0C;AAC5C;;AAEA;EACE,0CAA0C;AAC5C","sourcesContent":["@keyframes pulse_outermost {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.92);\n  }\n}\n.outermost {\n  animation: pulse_outermost 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_second {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.856);\n  }\n}\n.second {\n  animation: pulse_second 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_third {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.792);\n  }\n}\n.third {\n  animation: pulse_third 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_fourth {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.728);\n  }\n}\n.fourth {\n  animation: pulse_fourth 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_fifth {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.664);\n  }\n}\n.fifth {\n  animation: pulse_fifth 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_innermost {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.6);\n  }\n}\n.innermost {\n  animation: pulse_innermost 5s infinite;\n  transform-origin: center;\n}\n\n/* bounce animation to indicate Pi is waiting to speak */\n@keyframes bounce_outermost {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-5%);\n  }\n  60% {\n    transform: translateY(-3%);\n  }\n}\n.outermost.readyToRespond {\n  animation-name: bounce_outermost;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n@keyframes bounce_second {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-5.8%);\n  }\n  60% {\n    transform: translateY(-3.48%);\n  }\n}\n.second.readyToRespond {\n  animation-name: bounce_second;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n@keyframes bounce_third {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-6.6%);\n  }\n  60% {\n    transform: translateY(-3.96%);\n  }\n}\n.third.readyToRespond {\n  animation-name: bounce_third;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n@keyframes bounce_fourth {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-7.4%);\n  }\n  60% {\n    transform: translateY(-4.44%);\n  }\n}\n.fourth.readyToRespond {\n  animation-name: bounce_fourth;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n@keyframes bounce_fifth {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-8.2%);\n  }\n  60% {\n    transform: translateY(-4.92%);\n  }\n}\n.fifth.readyToRespond {\n  animation-name: bounce_fifth;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n@keyframes bounce_innermost {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-9%);\n  }\n  60% {\n    transform: translateY(-5.4%);\n  }\n}\n.innermost.readyToRespond {\n  animation-name: bounce_innermost;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n/* playful animation to indicate Pi is speaking */\n@keyframes speaking_outermost {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.995);\n  }\n  50% {\n    transform: scale(0.9);\n  }\n  75% {\n    transform: scale(0.895);\n  }\n}\n.outermost.piSpeaking {\n  animation: speaking_outermost 2s infinite;\n  transform-origin: center;\n}\n\n@keyframes speaking_second {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.98) rotate(-1deg);\n  }\n  50% {\n    transform: scale(0.87) rotate(0deg);\n  }\n  75% {\n    transform: scale(0.865) rotate(1deg);\n  }\n}\n.second.piSpeaking {\n  animation: speaking_second 2s infinite;\n  transform-origin: center;\n}\n\n@keyframes speaking_third {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.965) rotate(-2deg);\n  }\n  50% {\n    transform: scale(0.84) rotate(0deg);\n  }\n  75% {\n    transform: scale(0.835) rotate(2deg);\n  }\n}\n.third.piSpeaking {\n  animation: speaking_third 2s infinite;\n  transform-origin: center;\n}\n\n@keyframes speaking_fourth {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.95) rotate(-3deg);\n  }\n  50% {\n    transform: scale(0.81) rotate(0deg);\n  }\n  75% {\n    transform: scale(0.805) rotate(3deg);\n  }\n}\n.fourth.piSpeaking {\n  animation: speaking_fourth 2s infinite;\n  transform-origin: center;\n}\n\n@keyframes speaking_fifth {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.935) rotate(-4deg);\n  }\n  50% {\n    transform: scale(0.78) rotate(0deg);\n  }\n  75% {\n    transform: scale(0.775) rotate(4deg);\n  }\n}\n.fifth.piSpeaking {\n  animation: speaking_fifth 2s infinite;\n  transform-origin: center;\n}\n\n@keyframes speaking_innermost {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.92) rotate(-5deg);\n  }\n  50% {\n    transform: scale(0.75) rotate(0deg);\n  }\n  75% {\n    transform: scale(0.745) rotate(5deg);\n  }\n}\n.innermost.piSpeaking {\n  animation: speaking_innermost 2s infinite;\n  transform-origin: center;\n}\n\n/* wave animation to indicate user is speaking */\n@keyframes userSpeakingAnimation {\n  50% {\n    transform: scaleY(0.05) scaleX(var(--width-factor))\n      translateX(calc(-50% + var(--spread-amount)));\n  }\n  100% {\n    transform: scaleY(1) scaleX(var(--width-factor))\n      translateX(calc(-50% + var(--spread-amount)));\n  }\n}\n/* user speaking oscillation animation */\n@keyframes waveform_outermost {\n  0%,\n  100% {\n    transform: scaleY(1) scaleX(1);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.9) scaleX(0.9);\n  }\n}\n\n@keyframes waveform_second {\n  0%,\n  100% {\n    transform: scaleY(0.9) scaleX(0.9);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.8) scaleX(0.8);\n  }\n}\n\n@keyframes waveform_third {\n  0%,\n  100% {\n    transform: scaleY(0.8) scaleX(0.8);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.7) scaleX(0.7);\n  }\n}\n\n@keyframes waveform_fourth {\n  0%,\n  100% {\n    transform: scaleY(0.7) scaleX(0.7);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.6) scaleX(0.6);\n  }\n}\n\n@keyframes waveform_fifth {\n  0%,\n  100% {\n    transform: scaleY(0.6) scaleX(0.6);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.5) scaleX(0.5);\n  }\n}\n\n@keyframes waveform_innermost {\n  0%,\n  100% {\n    transform: scaleY(0.5) scaleX(0.5);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.4) scaleX(0.4);\n  }\n}\n\n.outermost.userSpeaking {\n  animation: waveform_outermost 0.7s infinite alternate;\n}\n\n.second.userSpeaking {\n  animation: waveform_second 0.65s infinite alternate;\n}\n\n.third.userSpeaking {\n  animation: waveform_third 0.6s infinite alternate;\n}\n\n.fourth.userSpeaking {\n  animation: waveform_fourth 0.55s infinite alternate;\n}\n\n.fifth.userSpeaking {\n  animation: waveform_fifth 0.5s infinite alternate;\n}\n\n.innermost.userSpeaking {\n  animation: waveform_innermost 0.45s infinite alternate;\n}\n\n/* flipcard animation to indicate Say, Pi is transcribing audio to text */\n@keyframes transcribingFlip {\n  0%,\n  100% {\n    transform: rotateY(0deg);\n    fill: var(--original-color);\n  }\n  50% {\n    transform: rotateY(180deg);\n    fill: var(--transcribing-color);\n  }\n}\n\n.outermost.transcribing {\n  --original-color: #e4f2d1;\n  --transcribing-color: #b3e0fe;\n  animation: transcribingFlip 1.5s infinite;\n}\n\n.second.transcribing {\n  --original-color: #cce8b5;\n  --transcribing-color: #89c2ff;\n  animation: transcribingFlip 1.6s infinite;\n}\n\n.third.transcribing {\n  --original-color: #b3db95;\n  --transcribing-color: #5fa4ff;\n  animation: transcribingFlip 1.7s infinite;\n}\n\n.fourth.transcribing {\n  --original-color: #9bd078;\n  --transcribing-color: #3586ff;\n  animation: transcribingFlip 1.8s infinite;\n}\n\n.fifth.transcribing {\n  --original-color: #83c55c;\n  --transcribing-color: #0b69e3;\n  animation: transcribingFlip 1.9s infinite;\n}\n\n.innermost.transcribing {\n  --original-color: #428a2f;\n  --transcribing-color: #0053bf;\n  animation: transcribingFlip 2s infinite;\n}\n\n/* inhalation animation to indicate Pi is preparing to speak */\n@keyframes loadingInhalation {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(1.05); /* Slightly scaled up */\n  }\n}\n\n.outermost.loading {\n  animation: loadingInhalation 2s infinite;\n}\n\n.second.loading {\n  animation: loadingInhalation 2.1s infinite;\n}\n\n.third.loading {\n  animation: loadingInhalation 2.2s infinite;\n}\n\n.fourth.loading {\n  animation: loadingInhalation 2.3s infinite;\n}\n\n.fifth.loading {\n  animation: loadingInhalation 2.4s infinite;\n}\n\n.innermost.loading {\n  animation: loadingInhalation 2.5s infinite;\n}\n"],"sourceRoot":""}]);
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
#saypi-talkButton,
.play-button {
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
}
.hidden {
  display: none;
}
#saypi-playButton.play-button {
  /* position over the talk button, but under any controls */
  z-index: 70; /* talk button z-index is 59 or 60 */
  background-color: rgba(0, 0, 0, 0); /* transparent without holes */
  border: none;
}
`, "",{"version":3,"sources":["webpack://./src/talkButton.css"],"names":[],"mappings":"AAAA;EACE;IACE,mBAAmB;EACrB;EACA;IACE,qBAAqB;EACvB;EACA;IACE,mBAAmB;EACrB;AACF;AACA;;EAEE,mBAAmB;EACnB,mBAAmB;EACnB,YAAY;EACZ,cAAc,EAAE,eAAe;AACjC;;AAEA;;EAEE,4BAA4B;AAC9B;AACA;EACE,aAAa;AACf;AACA;EACE,oBAAoB,EAAE,8BAA8B;AACtD;AACA;EACE,aAAa;AACf;AACA;EACE,0DAA0D;EAC1D,WAAW,EAAE,oCAAoC;EACjD,kCAAkC,EAAE,8BAA8B;EAClE,YAAY;AACd","sourcesContent":["@keyframes pulse {\n  0% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.9);\n  }\n  100% {\n    transform: scale(1);\n  }\n}\n#saypi-talkButton,\n.play-button {\n  margin-top: 0.25rem;\n  border-radius: 18px;\n  width: 120px;\n  display: block; /* For Safari */\n}\n\nhtml:not(.firefox-android) #saypi-talkButton:active .waveform,\n#saypi-talkButton.active .waveform {\n  animation: pulse 1s infinite;\n}\n#saypi-talkButton .waveform {\n  fill: #776d6d;\n}\n#saypi-talkButton.autoSubmit .waveform {\n  fill: rgb(65 138 47); /* Pi's text-brand-green-600 */\n}\n.hidden {\n  display: none;\n}\n#saypi-playButton.play-button {\n  /* position over the talk button, but under any controls */\n  z-index: 70; /* talk button z-index is 59 or 60 */\n  background-color: rgba(0, 0, 0, 0); /* transparent without holes */\n  border: none;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[3].use[1]!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[3].use[2]!./src/mobile.scss":
/*!**************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[3].use[1]!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[3].use[2]!./src/mobile.scss ***!
  \**************************************************************************************************************************************************************/
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
  html.mobile-view #saypi-panel,
  html.mobile-view .play-button {
    width: 100%;
    position: fixed;
    left: 0;
    background-color: rgba(245, 238, 223, 0.98);
    height: 100vh;
    top: 0;
    padding: 5%;
  }
  html.mobile-view #saypi-talkButton {
    width: 100%;
    height: 100%;
    background-color: transparent;
    border-radius: 0;
    margin: 0;
  }
  html.mobile-view #__next > main > div > div > div.fixed.top-4.right-6 > button,
  html.mobile-view div[data-projection-id="12"] > button {
    transform: scale(2);
    z-index: 50;
  }
  html.mobile-view button[data-projection-id="16"] > div[data-projection-id="17"],
  html.mobile-view button[data-projection-id="16"] > div[data-projection-id="18"] {
    transform: scale(2) !important;
    z-index: 50;
  }
  html.mobile-view #saypi-footer {
    display: none;
  }
}`, "",{"version":3,"sources":["webpack://./src/mobile.scss"],"names":[],"mappings":"AAAA;EAEI;;IAEE,WAAA;IACA,eAAA;IACA,OAAA;IACA,2CAAA;IAEA,aAAA;IACA,MAAA;IACA,WAAA;EADJ;EAIE;IACE,WAAA;IACA,YAAA;IACA,6BAAA;IACA,gBAAA;IACA,SAAA;EAFJ;EAKE;;IAEE,mBAAA;IACA,WAAA;EAHJ;EAOI;;IAEE,8BAAA;IACA,WAAA;EALN;EASE;IACE,aAAA;EAPJ;AACF","sourcesContent":["@media (max-width: 768px) {\n  html.mobile-view {\n    #saypi-panel,\n    .play-button {\n      width: 100%;\n      position: fixed;\n      left: 0;\n      background-color: rgba(245, 238, 223, 0.98);\n\n      height: 100vh;\n      top: 0;\n      padding: 5%;\n    }\n\n    #saypi-talkButton {\n      width: 100%;\n      height: 100%;\n      background-color: transparent;\n      border-radius: 0;\n      margin: 0;\n    }\n\n    #__next > main > div > div > div.fixed.top-4.right-6 > button,\n    div[data-projection-id=\"12\"] > button {\n      transform: scale(2);\n      z-index: 50;\n    }\n\n    button[data-projection-id=\"16\"] {\n      > div[data-projection-id=\"17\"],\n      > div[data-projection-id=\"18\"] {\n        transform: scale(2) !important;\n        z-index: 50;\n      }\n    }\n\n    #saypi-footer {\n      display: none;\n    }\n  }\n}\n"],"sourceRoot":""}]);
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("// Dispatch Custom Event\nfunction dispatchCustomEvent(eventName) {\n  var detail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n  var event = new CustomEvent(eventName, {\n    detail: detail\n  });\n  console.log(\"dispatching event: \" + eventName);\n  window.dispatchEvent(event);\n}\n\n// audio output (Pi)\nvar audioElement = document.querySelector(\"audio\");\nif (!audioElement) {\n  console.error(\"Audio element not found!\");\n}\n\n// TODO: dedupe this function from EventModule.js\nfunction isSafari() {\n  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);\n}\naudioElement.preload = \"auto\"; // enable aggressive preloading of audio\nvar piAudioManager = {\n  isSpeaking: false,\n  audioElement: audioElement,\n  _userStarted: true,\n  // flag to indicate playback has been started by the user (true by default because user must request initial playback)\n  _isLoadCalled: false,\n  // flag to indicate if the load() method has been called on the audio element\n\n  isLoadCalled: function isLoadCalled() {\n    return this._isLoadCalled;\n  },\n  setIsLoadCalled: function setIsLoadCalled(value) {\n    this._isLoadCalled = value;\n  },\n  userPlay: function userPlay() {\n    if (!isSafari()) {\n      return;\n    }\n    this._userStarted = true; // set a flag to indicate playback has been started by the user\n    this.audioElement.load(); // reset for Safari\n    dispatchCustomEvent(\"audio:loading\");\n    this.audioElement.play();\n  },\n  autoPlay: function autoPlay() {\n    if (!this._userStarted) {\n      this.audioElement.pause();\n    }\n  },\n  stop: function stop() {\n    if (this.isSpeaking) {\n      this.audioElement.pause();\n    }\n    if (this.audioElement.duration && !this.audioElement.ended && this.audioElement.currentTime < this.audioElement.duration) {\n      this.audioElement.currentTime = this.audioElement.duration; // seek the audio to the end\n      this.audioElement.play(); // trigger the ended event\n    }\n  },\n\n  pause: function pause() {\n    this.audioElement.pause();\n  },\n  resume: function resume() {\n    this.audioElement.play();\n  },\n  playing: function playing() {\n    this.isSpeaking = true;\n  },\n  stopped: function stopped() {\n    this.isSpeaking = false;\n    this._userStarted = false;\n  }\n};\n\n// Intercept Autoplay Events (autoplay doesn't work on Safari)\naudioElement.addEventListener(\"play\", function () {\n  if (isSafari()) {\n    piAudioManager.autoPlay();\n  }\n});\naudioElement.addEventListener(\"loadstart\", function () {\n  if (isSafari()) {\n    dispatchCustomEvent(\"saypi:piReadyToRespond\");\n  }\n});\n\n// Event listeners for detecting when Pi is speaking\naudioElement.addEventListener(\"playing\", function () {\n  piAudioManager.playing();\n  dispatchCustomEvent(\"saypi:piSpeaking\");\n});\naudioElement.addEventListener(\"pause\", function () {\n  piAudioManager.stopped();\n  dispatchCustomEvent(\"saypi:piStoppedSpeaking\");\n});\naudioElement.addEventListener(\"ended\", function () {\n  piAudioManager.stopped();\n  dispatchCustomEvent(\"saypi:piFinishedSpeaking\");\n});\n\n// audio input (user)\nvar audioDataChunks = [];\nvar audioMimeType = \"audio/webm;codecs=opus\";\nfunction uploadAudio(audioBlob) {\n  // Create a FormData object\n  var formData = new FormData();\n  var audioFilename = \"audio.webm\";\n  if (audioBlob.type === \"audio/mp4\") {\n    audioFilename = \"audio.mp4\";\n  }\n  // Add the audio blob to the FormData object\n  formData.append(\"audio\", audioBlob, audioFilename);\n  // Get the user's preferred language\n  var language = navigator.language;\n  dispatchCustomEvent(\"saypi:transcribing\");\n  // Post the audio to the server for transcription\n  fetch(config.apiServerUrl + \"/transcribe?language=\" + language, {\n    method: \"POST\",\n    body: formData\n  }).then(function (response) {\n    if (!response.ok) {\n      throw Error(response.statusText);\n    }\n    return response.json();\n  }).then(function (responseJson) {\n    dispatchCustomEvent(\"saypi:transcribed\", {\n      text: responseJson.text\n    });\n  })[\"catch\"](function (error) {\n    console.error(\"Looks like there was a problem: \", error);\n    var textarea = document.getElementById(\"saypi-prompt\");\n    textarea.value = \"Sorry, there was a problem transcribing your audio. Please try again later.\";\n  });\n}\n\n// Declare a global variable for the mediaRecorder\nvar mediaRecorder;\nvar threshold = 1000; // 1000 ms = 1 second, about the length of \"Hey, Pi\"\n\n// This function will be called when the 'dataavailable' event fires\nfunction handleDataAvailable(e) {\n  // Add the audio data chunk to the array\n  audioDataChunks.push(e.data);\n}\n\n// This function will be called when the 'stop' event fires\nfunction handleStop() {\n  // Create a Blob from the audio data chunks\n  var audioBlob = new Blob(audioDataChunks, {\n    type: audioMimeType\n  });\n\n  // Get the stop time and calculate the duration\n  var stopTime = Date.now();\n  var duration = stopTime - window.startTime;\n\n  // If the duration is greater than the threshold, upload the audio for transcription\n  if (duration >= threshold) {\n    // Upload the audio to the server for transcription\n    uploadAudio(audioBlob);\n  }\n\n  // Clear the array for the next recording\n  audioDataChunks = [];\n}\nfunction setupRecording(callback) {\n  if (mediaRecorder) {\n    return;\n  }\n\n  // Get a stream from the user's microphone\n  navigator.mediaDevices.getUserMedia({\n    audio: true\n  }).then(function (stream) {\n    if (!MediaRecorder.isTypeSupported(audioMimeType)) {\n      // use MP4 for Safari\n      audioMimeType = \"audio/mp4\";\n    }\n    // Create a new MediaRecorder object using the stream and specifying the MIME type\n    var options = {\n      mimeType: audioMimeType\n    };\n    mediaRecorder = new MediaRecorder(stream, options);\n\n    // Listen for the 'dataavailable' event\n    mediaRecorder.addEventListener(\"dataavailable\", handleDataAvailable);\n\n    // Listen for the 'stop' event\n    mediaRecorder.addEventListener(\"stop\", handleStop);\n  }).then(function () {\n    // Invoke the callback function\n    if (typeof callback === \"function\") {\n      callback();\n    }\n  })[\"catch\"](function (err) {\n    console.error(\"Error getting audio stream: \" + err);\n  });\n}\nfunction tearDownRecording() {\n  // Check if the MediaRecorder is set up\n  if (!mediaRecorder) {\n    return;\n  }\n\n  // Stop any ongoing recording\n  if (mediaRecorder.state === \"recording\") {\n    mediaRecorder.stop();\n  }\n\n  // Remove the MediaRecorder's event listeners\n  mediaRecorder.removeEventListener(\"dataavailable\", handleDataAvailable);\n  mediaRecorder.removeEventListener(\"stop\", handleStop);\n\n  // Clear the MediaRecorder variable\n  mediaRecorder = null;\n}\n\n// To request recording, other modules can dispatch a custom event audio:startRecording\nfunction startRecording() {\n  // Check if the MediaRecorder is set up\n  if (!mediaRecorder) {\n    setupRecording(startRecording);\n    return;\n  }\n  // Check if Pi is currently speaking and stop her audio\n  if (piAudioManager.isSpeaking) {\n    piAudioManager.pause();\n  }\n\n  // Start recording\n  mediaRecorder.start();\n\n  // Record the start time\n  window.startTime = Date.now();\n  dispatchCustomEvent(\"saypi:userSpeaking\");\n}\n\n// To stop recording, other modules can dispatch a custom event audio:stopRecording\nfunction stopRecording() {\n  if (mediaRecorder && mediaRecorder.state === \"recording\") {\n    // Stop recording\n    mediaRecorder.stop();\n\n    // Record the stop time and calculate the duration\n    var stopTime = Date.now();\n    var duration = stopTime - window.startTime;\n\n    // If the duration is less than the threshold, don't upload the audio for transcription\n    if (duration < threshold) {\n      console.log(\"Recording was too short, not uploading for transcription\");\n      dispatchCustomEvent(\"saypi:userStoppedSpeaking\");\n      piAudioManager.resume();\n    } else {\n      piAudioManager.stop();\n      dispatchCustomEvent(\"saypi:userFinishedSpeaking\");\n    }\n  }\n}\nfunction registerCustomAudioEventListeners() {\n  window.addEventListener(\"audio:setupRecording\", function (e) {\n    setupRecording();\n  });\n  window.addEventListener(\"audio:tearDownRecording\", function (e) {\n    tearDownRecording();\n  });\n  window.addEventListener(\"audio:startRecording\", function (e) {\n    startRecording();\n  });\n  window.addEventListener(\"audio:stopRecording\", function (e) {\n    stopRecording();\n  });\n}\nregisterCustomAudioEventListeners();");

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

/***/ "./src/mobile.scss":
/*!*************************!*\
  !*** ./src/mobile.scss ***!
  \*************************/
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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_3_use_1_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_3_use_2_mobile_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[3].use[1]!../node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[3].use[2]!./mobile.scss */ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[3].use[1]!./node_modules/sass-loader/dist/cjs.js??ruleSet[1].rules[3].use[2]!./src/mobile.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_3_use_1_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_3_use_2_mobile_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_3_use_1_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_3_use_2_mobile_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_3_use_1_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_3_use_2_mobile_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_3_use_1_node_modules_sass_loader_dist_cjs_js_ruleSet_1_rules_3_use_2_mobile_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


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
/* harmony import */ var _ButtonModule_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ButtonModule.js */ "./src/ButtonModule.js");
/* harmony import */ var _EventModule_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EventModule.js */ "./src/EventModule.js");
/* harmony import */ var _talkButton_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./talkButton.css */ "./src/talkButton.css");
/* harmony import */ var _mobile_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./mobile.scss */ "./src/mobile.scss");
/* harmony import */ var _rectangles_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./rectangles.css */ "./src/rectangles.css");
/* harmony import */ var _waveform_svg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./waveform.svg */ "./src/waveform.svg");
/* harmony import */ var _rectangles_svg__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./rectangles.svg */ "./src/rectangles.svg");







(function () {
  "use strict";

  var buttonModule = new _ButtonModule_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
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
  addUserAgentFlags();
  _EventModule_js__WEBPACK_IMPORTED_MODULE_1__["default"].init();

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
            if (!annotateDOM()) {
              console.warn("Required elements not found in DOM");
            }
            observer.disconnect();
            return;
          }
        }
      }
    }
  });
  function annotateDOM() {
    // Add an ID to the prompt textarea
    var foundPrompt = addIdPromptTextArea();
    var foundFooter = addIdFooter();
    return foundPrompt && foundFooter;
  }
  function addIdPromptTextArea() {
    var textarea = document.getElementById("saypi-prompt");
    if (!textarea) {
      // Find the first <textarea> element and give it an id
      var textareaElement = document.querySelector("textarea");
      if (textareaElement) {
        textareaElement.id = "saypi-prompt";
      } else {
        console.warn("No <textarea> element found");
        return false;
      }
    }
    return true;
  }
  function addIdFooter() {
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

    // Create the talk button using ButtonModule
    var label = "Talk (Hold Control + Space to use hotkey. Double click to toggle auto-submit on/off)";
    var button = buttonModule.createButton("", function () {}); // The callback is empty for now, but you can add functionalities if needed.

    button.id = "saypi-talkButton";
    button.type = "button";

    // Set ARIA label and tooltip
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
    var classNames = "relative flex mt-1 mb-1 rounded-full px-2 py-3 text-center bg-cream-550 hover:bg-cream-650 hover:text-brand-green-700 text-muted";
    button.classList.add(classNames.split(" "));

    // Enable autosubmit by default
    button.dataset.autosubmit = "true";
    button.classList.add("autoSubmit");
    panel.appendChild(button);
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
      iconContainer.innerHTML = _rectangles_svg__WEBPACK_IMPORTED_MODULE_6__["default"];
    } else {
      iconContainer.innerHTML = _waveform_svg__WEBPACK_IMPORTED_MODULE_5__["default"];
    }
  }
  function addUserAgentFlags() {
    var isFirefoxAndroid = /Firefox/.test(navigator.userAgent) && /Android/.test(navigator.userAgent);
    var element = document.documentElement;
    if (isFirefoxAndroid) {
      // hack for Firefox on Android, which doesn't support :active correctly
      element.classList.add("firefox-android");
    }
    if (isMobileView()) {
      element.classList.add("mobile-view");
    } else {
      element.classList.remove("mobile-view");
    }
  }
  function registerAudioButtonEvents() {
    var button = document.getElementById("saypi-talkButton");

    // Setting the correct context
    var context = window;
    if (GM_info.scriptHandler !== "Userscripts") {
      context = unsafeWindow;
    }
    _EventModule_js__WEBPACK_IMPORTED_MODULE_1__["default"].setContext(context); // Set the context for EventModule

    // Attach the event listeners
    button.addEventListener("mousedown", _EventModule_js__WEBPACK_IMPORTED_MODULE_1__["default"].handleTalkMouseDown.bind(_EventModule_js__WEBPACK_IMPORTED_MODULE_1__["default"]));
    button.addEventListener("mouseup", _EventModule_js__WEBPACK_IMPORTED_MODULE_1__["default"].handleTalkMouseUp.bind(_EventModule_js__WEBPACK_IMPORTED_MODULE_1__["default"]));
    button.addEventListener("dblclick", function () {
      return _EventModule_js__WEBPACK_IMPORTED_MODULE_1__["default"].handleTalkDoubleClick(button);
    });
    button.addEventListener("touchstart", function (e) {
      return _EventModule_js__WEBPACK_IMPORTED_MODULE_1__["default"].handleTalkTouchStart(button, e);
    });
    button.addEventListener("touchend", function () {
      return _EventModule_js__WEBPACK_IMPORTED_MODULE_1__["default"].handleTalkTouchEnd(button);
    });
    _EventModule_js__WEBPACK_IMPORTED_MODULE_1__["default"].registerOtherAudioButtonEvents(button);
    _EventModule_js__WEBPACK_IMPORTED_MODULE_1__["default"].registerCustomAudioEventListeners();
    _EventModule_js__WEBPACK_IMPORTED_MODULE_1__["default"].registerHotkey();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU8scUZBQXFGLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxZQUFZLE1BQU0sU0FBUyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxTQUFTLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFNBQVMsWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssU0FBUyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxTQUFTLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFNBQVMsWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLFlBQVksTUFBTSxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sWUFBWSxNQUFNLEtBQUssS0FBSyxPQUFPLE1BQU0sS0FBSyxLQUFLLE9BQU8sTUFBTSxLQUFLLFlBQVks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QUFDLFlBQVksRUFBRSxVQUFDa0YsQ0FBQztNQUFBLE9BQ3RDdEMsdURBQVcsQ0FBQ3FDLG9CQUFvQixDQUFDdkUsTUFBTSxFQUFFd0UsQ0FBQyxDQUFDO0lBQUEsQ0FDN0MsQ0FBQztJQUNEeEUsTUFBTSxDQUFDVixnQkFBZ0IsQ0FBQyxVQUFVLEVBQUU7TUFBQSxPQUNsQzRDLHVEQUFXLENBQUN3QyxrQkFBa0IsQ0FBQzFFLE1BQU0sQ0FBQztJQUFBLENBQ3hDLENBQUM7SUFFRGtDLHVEQUFXLENBQUM0Qyw4QkFBOEIsQ0FBQzlFLE1BQU0sQ0FBQztJQUNsRGtDLHVEQUFXLENBQUM2QyxpQ0FBaUMsQ0FBQyxDQUFDO0lBQy9DN0MsdURBQVcsQ0FBQzhDLGNBQWMsQ0FBQyxDQUFDO0VBQzlCOztFQUVBO0VBQ0FvQixRQUFRLENBQUM4QyxPQUFPLENBQUNuTCxRQUFRLEVBQUU7SUFBRW9MLFNBQVMsRUFBRSxJQUFJO0lBQUVDLE9BQU8sRUFBRTtFQUFLLENBQUMsQ0FBQztBQUNoRSxDQUFDLEVBQUUsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvQW5pbWF0aW9uTW9kdWxlLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvQnV0dG9uTW9kdWxlLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvRXZlbnRNb2R1bGUuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9Vc2VyQWdlbnRNb2R1bGUuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9yZWN0YW5nbGVzLmNzcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3RhbGtCdXR0b24uY3NzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvbW9iaWxlLnNjc3MiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvdHJhbnNjcmliZXIuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9yZWN0YW5nbGVzLnN2ZyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3dhdmVmb3JtLnN2ZyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3JlY3RhbmdsZXMuY3NzPzAzNjIiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy90YWxrQnV0dG9uLmNzcz8wN2Y1Iiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvbW9iaWxlLnNjc3M/ZjIzZSIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvc2F5cGkuaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQW5pbWF0aW9uTW9kdWxlIHtcbiAgc3RhdGljIHJlY3RhbmdsZXNTZWxlY3RvciA9XG4gICAgXCIub3V0ZXJtb3N0LCAuc2Vjb25kLCAudGhpcmQsIC5mb3VydGgsIC5maWZ0aCwgLmlubmVybW9zdFwiO1xuICBzdGF0aWMgdGFsa0J1dHRvbkFuaW1hdGlvbnMgPSBbXCJyZWFkeVRvUmVzcG9uZFwiXTtcblxuICBzdGF0aWMgYW5pbWF0ZShhbmltYXRpb24pIHtcbiAgICB0aGlzLnN0b3BPdGhlckFuaW1hdGlvbnMoYW5pbWF0aW9uKTtcblxuICAgIGxldCByZWN0YW5nbGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLnJlY3RhbmdsZXNTZWxlY3Rvcik7XG4gICAgcmVjdGFuZ2xlcy5mb3JFYWNoKChyZWN0KSA9PiByZWN0LmNsYXNzTGlzdC5hZGQoYW5pbWF0aW9uKSk7XG4gIH1cblxuICBzdGF0aWMgaW5hbmltYXRlKGFuaW1hdGlvbikge1xuICAgIGxldCByZWN0YW5nbGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLnJlY3RhbmdsZXNTZWxlY3Rvcik7XG4gICAgcmVjdGFuZ2xlcy5mb3JFYWNoKChyZWN0KSA9PiByZWN0LmNsYXNzTGlzdC5yZW1vdmUoYW5pbWF0aW9uKSk7XG4gIH1cblxuICBzdGF0aWMgc3RvcEFsbEFuaW1hdGlvbnMoKSB7XG4gICAgdGhpcy50YWxrQnV0dG9uQW5pbWF0aW9ucy5mb3JFYWNoKChhbmltYXRpb24pID0+IHRoaXMuaW5hbmltYXRlKGFuaW1hdGlvbikpO1xuICB9XG5cbiAgc3RhdGljIHN0b3BPdGhlckFuaW1hdGlvbnMoa2VlcEFuaW1hdGlvbikge1xuICAgIHRoaXMudGFsa0J1dHRvbkFuaW1hdGlvbnMuZm9yRWFjaCgoYW5pbWF0aW9uKSA9PiB7XG4gICAgICBpZiAoYW5pbWF0aW9uICE9PSBrZWVwQW5pbWF0aW9uKSB7XG4gICAgICAgIHRoaXMuaW5hbmltYXRlKGFuaW1hdGlvbik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCBBbmltYXRpb25Nb2R1bGUgZnJvbSBcIi4vQW5pbWF0aW9uTW9kdWxlXCI7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCdXR0b25Nb2R1bGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnBsYXlCdXR0b24gPSBudWxsO1xuICAgIC8vIEJpbmRpbmcgbWV0aG9kcyB0byB0aGUgY3VycmVudCBpbnN0YW5jZVxuICAgIHRoaXMuaGFuZGxlUGxheUJ1dHRvbkNsaWNrID0gdGhpcy5oYW5kbGVQbGF5QnV0dG9uQ2xpY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlZ2lzdGVyQnV0dG9uRXZlbnRzKCk7XG4gICAgdGhpcy5yZWdpc3Rlck90aGVyRXZlbnRzKCk7XG4gIH1cblxuICByZWdpc3RlckJ1dHRvbkV2ZW50cygpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNheXBpOmF3YWl0aW5nVXNlcklucHV0XCIsICgpID0+IHtcbiAgICAgIHRoaXMucG9rZVVzZXIoKTtcbiAgICB9KTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNheXBpOnJlY2VpdmVkVXNlcklucHV0XCIsICgpID0+IHtcbiAgICAgIHRoaXMudW5wb2tlVXNlcigpO1xuICAgIH0pO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiYXVkaW86bG9hZGluZ1wiLCAoKSA9PiB7XG4gICAgICBBbmltYXRpb25Nb2R1bGUuYW5pbWF0ZShcImxvYWRpbmdcIik7XG4gICAgfSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzYXlwaTpwaVNwZWFraW5nXCIsICgpID0+IHtcbiAgICAgIHRoaXMudW5wb2tlVXNlcigpOyAvLyBwbGF5YmFjayBoYXMgc3RhcnRlZCwgdXNlciBpbnB1dCBpcyBubyBsb25nZXIgbmVlZGVkXG4gICAgICBBbmltYXRpb25Nb2R1bGUuaW5hbmltYXRlKFwibG9hZGluZ1wiKTtcbiAgICAgIEFuaW1hdGlvbk1vZHVsZS5hbmltYXRlKFwicGlTcGVha2luZ1wiKTtcbiAgICB9KTtcbiAgICBbXCJzYXlwaTpwaVN0b3BwZWRTcGVha2luZ1wiLCBcInNheXBpOnBpRmluaXNoZWRTcGVha2luZ1wiXS5mb3JFYWNoKFxuICAgICAgKGV2ZW50TmFtZSkgPT4ge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsICgpID0+IHtcbiAgICAgICAgICBBbmltYXRpb25Nb2R1bGUuaW5hbmltYXRlKFwicGlTcGVha2luZ1wiKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNheXBpOnVzZXJTcGVha2luZ1wiLCAoKSA9PiB7XG4gICAgICBjb25zdCB0YWxrQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS10YWxrQnV0dG9uXCIpO1xuICAgICAgdGFsa0J1dHRvbi5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpOyAvLyBBZGQgdGhlIGFjdGl2ZSBjbGFzcyAoZm9yIEZpcmVmb3ggb24gQW5kcm9pZClcbiAgICAgIEFuaW1hdGlvbk1vZHVsZS5hbmltYXRlKFwidXNlclNwZWFraW5nXCIpO1xuICAgIH0pO1xuICAgIFtcInNheXBpOnVzZXJTdG9wcGVkU3BlYWtpbmdcIiwgXCJzYXlwaTp1c2VyRmluaXNoZWRTcGVha2luZ1wiXS5mb3JFYWNoKFxuICAgICAgKGV2ZW50TmFtZSkgPT4ge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsICgpID0+IHtcbiAgICAgICAgICBjb25zdCB0YWxrQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS10YWxrQnV0dG9uXCIpO1xuICAgICAgICAgIHRhbGtCdXR0b24uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTsgLy8gUmVtb3ZlIHRoZSBhY3RpdmUgY2xhc3MgKGZvciBGaXJlZm94IG9uIEFuZHJvaWQpXG4gICAgICAgICAgQW5pbWF0aW9uTW9kdWxlLmluYW5pbWF0ZShcInVzZXJTcGVha2luZ1wiKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNheXBpOnRyYW5zY3JpYmluZ1wiLCAoKSA9PiB7XG4gICAgICBBbmltYXRpb25Nb2R1bGUuYW5pbWF0ZShcInRyYW5zY3JpYmluZ1wiKTtcbiAgICB9KTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNheXBpOnRyYW5zY3JpYmVkXCIsICgpID0+IHtcbiAgICAgIEFuaW1hdGlvbk1vZHVsZS5pbmFuaW1hdGUoXCJ0cmFuc2NyaWJpbmdcIik7XG4gICAgfSk7XG4gIH1cblxuICByZWdpc3Rlck90aGVyRXZlbnRzKCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2F5cGk6YXV0b1N1Ym1pdFwiLCBCdXR0b25Nb2R1bGUuaGFuZGxlQXV0b1N1Ym1pdCk7XG4gIH1cblxuICAvLyBGdW5jdGlvbiB0byBjcmVhdGUgYSBuZXcgYnV0dG9uXG4gIGNyZWF0ZUJ1dHRvbihsYWJlbCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9IGxhYmVsO1xuICAgIGJ1dHRvbi5vbmNsaWNrID0gY2FsbGJhY2s7XG4gICAgcmV0dXJuIGJ1dHRvbjtcbiAgfVxuXG4gIC8vIEZ1bmN0aW9uIHRvIHN0eWxlIGEgZ2l2ZW4gYnV0dG9uXG4gIHN0eWxlQnV0dG9uKGJ1dHRvbiwgc3R5bGVzKSB7XG4gICAgZm9yIChsZXQga2V5IGluIHN0eWxlcykge1xuICAgICAgaWYgKHN0eWxlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIGJ1dHRvbi5zdHlsZVtrZXldID0gc3R5bGVzW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gU2ltdWxhdGUgYW4gXCJFbnRlclwiIGtleXByZXNzIGV2ZW50IG9uIGEgZm9ybVxuICBzdGF0aWMgc2ltdWxhdGVGb3JtU3VibWl0KCkge1xuICAgIGNvbnN0IHRleHRhcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS1wcm9tcHRcIik7XG5cbiAgICBjb25zdCBlbnRlckV2ZW50ID0gbmV3IEtleWJvYXJkRXZlbnQoXCJrZXlkb3duXCIsIHtcbiAgICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgICBrZXk6IFwiRW50ZXJcIixcbiAgICAgIGtleUNvZGU6IDEzLFxuICAgICAgd2hpY2g6IDEzLFxuICAgIH0pO1xuXG4gICAgdGV4dGFyZWEuZGlzcGF0Y2hFdmVudChlbnRlckV2ZW50KTtcbiAgfVxuXG4gIC8vIEZ1bmN0aW9uIHRvIGhhbmRsZSBhdXRvLXN1Ym1pdCBiYXNlZCBvbiB0aGUgYnV0dG9uJ3MgZGF0YSBhdHRyaWJ1dGVcbiAgc3RhdGljIGhhbmRsZUF1dG9TdWJtaXQoKSB7XG4gICAgY29uc3QgdGFsa0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F5cGktdGFsa0J1dHRvblwiKTtcblxuICAgIGlmICh0YWxrQnV0dG9uLmRhdGFzZXQuYXV0b3N1Ym1pdCA9PT0gXCJmYWxzZVwiKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkF1dG9zdWJtaXQgaXMgZGlzYWJsZWRcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIEJ1dHRvbk1vZHVsZS5zaW11bGF0ZUZvcm1TdWJtaXQoKTtcbiAgICB9XG4gIH1cblxuICBjcmVhdGVQbGF5QnV0dG9uKCkge1xuICAgIGNvbnN0IGxhYmVsID0gXCJIZWFyIFBpJ3MgcmVzcG9uc2VcIjtcbiAgICB0aGlzLnBsYXlCdXR0b24gPSB0aGlzLmNyZWF0ZUJ1dHRvbihcIlwiLCAoKSA9PiB7fSk7XG4gICAgdGhpcy5wbGF5QnV0dG9uLmlkID0gXCJzYXlwaS1wbGF5QnV0dG9uXCI7XG4gICAgdGhpcy5wbGF5QnV0dG9uLnR5cGUgPSBcImJ1dHRvblwiO1xuICAgIHRoaXMucGxheUJ1dHRvbi5jbGFzc05hbWUgPSBcImhpZGRlbiBwbGF5LWJ1dHRvblwiO1xuICAgIHRoaXMucGxheUJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIGxhYmVsKTtcbiAgICB0aGlzLnBsYXlCdXR0b24uc2V0QXR0cmlidXRlKFwidGl0bGVcIiwgbGFiZWwpO1xuICAgIHRoaXMucGxheUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5oYW5kbGVQbGF5QnV0dG9uQ2xpY2spO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5wbGF5QnV0dG9uKTtcbiAgICByZXR1cm4gdGhpcy5wbGF5QnV0dG9uO1xuICB9XG5cbiAgc2hvd1BsYXlCdXR0b24oKSB7XG4gICAgaWYgKCF0aGlzLnBsYXlCdXR0b24pIHtcbiAgICAgIHRoaXMuY3JlYXRlUGxheUJ1dHRvbigpO1xuICAgIH1cbiAgICB0aGlzLnBsYXlCdXR0b24uY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgfVxuXG4gIGhpZGVQbGF5QnV0dG9uKCkge1xuICAgIGlmICh0aGlzLnBsYXlCdXR0b24pIHtcbiAgICAgIHRoaXMucGxheUJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZVBsYXlCdXR0b25DbGljaygpIHtcbiAgICB0aGlzLnVucG9rZVVzZXIoKTtcbiAgICBkaXNwYXRjaEN1c3RvbUV2ZW50KFwic2F5cGk6cmVjZWl2ZWRVc2VySW5wdXRcIik7IC8vIGRvdWJsaW5nIHVwIHdpdGggcHJldmlvdXMgbGluZT9cbiAgICBwaUF1ZGlvTWFuYWdlci51c2VyUGxheSgpO1xuICB9XG5cbiAgcG9rZVVzZXIoKSB7XG4gICAgQW5pbWF0aW9uTW9kdWxlLmFuaW1hdGUoXCJyZWFkeVRvUmVzcG9uZFwiKTtcbiAgICB0aGlzLnNob3dQbGF5QnV0dG9uKCk7XG4gIH1cblxuICB1bnBva2VVc2VyKCkge1xuICAgIEFuaW1hdGlvbk1vZHVsZS5pbmFuaW1hdGUoXCJyZWFkeVRvUmVzcG9uZFwiKTtcbiAgICB0aGlzLmhpZGVQbGF5QnV0dG9uKCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IGlzU2FmYXJpLCBpc01vYmlsZVZpZXcgfSBmcm9tIFwiLi9Vc2VyQWdlbnRNb2R1bGUuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRNb2R1bGUge1xuICBzdGF0aWMgY29udGV4dCA9IHdpbmRvdztcbiAgc3RhdGljIGluaXQoKSB7XG4gICAgLy8gQWxsIHRoZSBldmVudCBsaXN0ZW5lcnMgY2FuIGJlIGFkZGVkIGhlcmVcbiAgICB0aGlzLmhhbmRsZUF1ZGlvRXZlbnRzKCk7XG4gICAgLy8gQW55IG90aGVyIGluaXRpYWxpemF0aW9ucy4uLlxuICB9XG5cbiAgc3RhdGljIGNsZWFudXAoKSB7XG4gICAgLy8gUmVtb3ZlIGV2ZW50IGxpc3RlbmVycyBpZiBuZWVkZWQsIG9yIGFueSBvdGhlciBjbGVhbnVwIG9wZXJhdGlvbnNcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwic2F5cGk6dHJhbnNjcmliZWRcIixcbiAgICAgIHRoaXMuaGFuZGxlVHJhbnNjcmlwdGlvblJlc3BvbnNlXG4gICAgKTtcbiAgfVxuXG4gIC8vIERpc3BhdGNoIEN1c3RvbSBFdmVudFxuICAvLyBUT0RPOiByZW1vdmUgZHVwbGljYXRlZCBmdW5jdGlvbiBmcm9tIHRyYW5zY3JpYmVyLmpzXG4gIHN0YXRpYyBkaXNwYXRjaEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwgZGV0YWlsID0ge30pIHtcbiAgICBjb25zdCBldmVudCA9IG5ldyBDdXN0b21FdmVudChldmVudE5hbWUsIHsgZGV0YWlsIH0pO1xuICAgIGNvbnNvbGUubG9nKFwiZGlzcGF0Y2hpbmcgZXZlbnQ6IFwiICsgZXZlbnROYW1lKTtcbiAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gIH1cblxuICBzdGF0aWMgaGFuZGxlQXVkaW9FdmVudHMoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBcInNheXBpOnRyYW5zY3JpYmVkXCIsXG4gICAgICBFdmVudE1vZHVsZS5oYW5kbGVUcmFuc2NyaXB0aW9uUmVzcG9uc2VcbiAgICApO1xuICB9XG5cbiAgc3RhdGljIGhhbmRsZVRyYW5zY3JpcHRpb25SZXNwb25zZSh0cmFuc2NyaXB0aW9uRXZlbnQpIHtcbiAgICBsZXQgdHJhbnNjcmlwdCA9IHRyYW5zY3JpcHRpb25FdmVudC5kZXRhaWwudGV4dDtcbiAgICBjb25zb2xlLmxvZyhcIlRyYW5zY3JpcHQ6IFwiICsgdHJhbnNjcmlwdCk7XG4gICAgY29uc3QgdGV4dGFyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNheXBpLXByb21wdFwiKTtcbiAgICBpZiAoaXNNb2JpbGVWaWV3KCkpIHtcbiAgICAgIC8vIGlmIHRyYW5zY3JpcHQgaXMgPiAxMDAwIGNoYXJhY3RlcnMsIHRydW5jYXRlIGl0IHRvIDk5OSBjaGFyYWN0ZXJzIHBsdXMgYW4gZWxsaXBzaXNcbiAgICAgIGlmICh0cmFuc2NyaXB0Lmxlbmd0aCA+IDEwMDApIHtcbiAgICAgICAgdHJhbnNjcmlwdCA9IHRyYW5zY3JpcHQuc3Vic3RyaW5nKDAsIDk5OSkgKyBcIuKAplwiO1xuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgXCJUcmFuc2NyaXB0IHdhcyB0b28gbG9uZyBmb3IgUGkuIFRydW5jYXRlZCB0byA5OTkgY2hhcmFjdGVycywgbG9zaW5nIHRoZSBmb2xsb3dpbmcgdGV4dDogLi4uIFwiICtcbiAgICAgICAgICAgIHRyYW5zY3JpcHQuc3Vic3RyaW5nKDk5OSlcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIEV2ZW50TW9kdWxlLnNldE5hdGl2ZVZhbHVlKHRleHRhcmVhLCB0cmFuc2NyaXB0KTtcbiAgICAgIEV2ZW50TW9kdWxlLmRpc3BhdGNoQ3VzdG9tRXZlbnQoXCJzYXlwaTphdXRvU3VibWl0XCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBFdmVudE1vZHVsZS5zaW11bGF0ZVR5cGluZyh0ZXh0YXJlYSwgdHJhbnNjcmlwdCArIFwiIFwiKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgc2ltdWxhdGVUeXBpbmcoZWxlbWVudCwgdGV4dCkge1xuICAgIGNvbnN0IHdvcmRzID0gdGV4dC5zcGxpdChcIiBcIik7XG4gICAgbGV0IGkgPSAwO1xuXG4gICAgY29uc3QgdHlwZVdvcmQgPSAoKSA9PiB7XG4gICAgICBpZiAoaSA8IHdvcmRzLmxlbmd0aCkge1xuICAgICAgICBFdmVudE1vZHVsZS5zZXROYXRpdmVWYWx1ZShlbGVtZW50LCBlbGVtZW50LnZhbHVlICsgd29yZHNbaSsrXSArIFwiIFwiKTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHR5cGVXb3JkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEV2ZW50TW9kdWxlLmRpc3BhdGNoQ3VzdG9tRXZlbnQoXCJzYXlwaTphdXRvU3VibWl0XCIpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0eXBlV29yZCgpO1xuICB9XG5cbiAgc3RhdGljIHNldE5hdGl2ZVZhbHVlKGVsZW1lbnQsIHZhbHVlKSB7XG4gICAgbGV0IGxhc3RWYWx1ZSA9IGVsZW1lbnQudmFsdWU7XG4gICAgZWxlbWVudC52YWx1ZSA9IHZhbHVlO1xuICAgIGxldCBldmVudCA9IG5ldyBFdmVudChcImlucHV0XCIsIHsgdGFyZ2V0OiBlbGVtZW50LCBidWJibGVzOiB0cnVlIH0pO1xuICAgIC8vIFJlYWN0IDE1XG4gICAgZXZlbnQuc2ltdWxhdGVkID0gdHJ1ZTtcbiAgICAvLyBSZWFjdCAxNi0xN1xuICAgIGxldCB0cmFja2VyID0gZWxlbWVudC5fdmFsdWVUcmFja2VyO1xuICAgIGlmICh0cmFja2VyKSB7XG4gICAgICB0cmFja2VyLnNldFZhbHVlKGxhc3RWYWx1ZSk7XG4gICAgfVxuICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gIH1cblxuICBzdGF0aWMgaGFuZGxlVGFsa01vdXNlRG93bigpIHtcbiAgICBkaXNwYXRjaEN1c3RvbUV2ZW50KFwiYXVkaW86c3RhcnRSZWNvcmRpbmdcIik7XG4gIH1cblxuICBzdGF0aWMgaGFuZGxlVGFsa01vdXNlVXAoKSB7XG4gICAgZGlzcGF0Y2hDdXN0b21FdmVudChcImF1ZGlvOnN0b3BSZWNvcmRpbmdcIik7XG4gIH1cblxuICBzdGF0aWMgaGFuZGxlVGFsa0RvdWJsZUNsaWNrKGJ1dHRvbikge1xuICAgIC8vIFRvZ2dsZSB0aGUgQ1NTIGNsYXNzZXMgdG8gaW5kaWNhdGUgdGhlIG1vZGVcbiAgICBidXR0b24uY2xhc3NMaXN0LnRvZ2dsZShcImF1dG9TdWJtaXRcIik7XG4gICAgaWYgKGJ1dHRvbi5nZXRBdHRyaWJ1dGUoXCJkYXRhLWF1dG9zdWJtaXRcIikgPT09IFwidHJ1ZVwiKSB7XG4gICAgICBidXR0b24uc2V0QXR0cmlidXRlKFwiZGF0YS1hdXRvc3VibWl0XCIsIFwiZmFsc2VcIik7XG4gICAgICBjb25zb2xlLmxvZyhcImF1dG9zdWJtaXQgZGlzYWJsZWRcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJkYXRhLWF1dG9zdWJtaXRcIiwgXCJ0cnVlXCIpO1xuICAgICAgY29uc29sZS5sb2coXCJhdXRvc3VibWl0IGVuYWJsZWRcIik7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGhhbmRsZVRhbGtUb3VjaFN0YXJ0KGJ1dHRvbiwgZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLmRpc3BhdGNoQ3VzdG9tRXZlbnQoXCJhdWRpbzpzdGFydFJlY29yZGluZ1wiKTtcbiAgfVxuXG4gIHN0YXRpYyBoYW5kbGVUYWxrVG91Y2hFbmQoYnV0dG9uKSB7XG4gICAgdGhpcy5kaXNwYXRjaEN1c3RvbUV2ZW50KFwiYXVkaW86c3RvcFJlY29yZGluZ1wiKTtcbiAgfVxuXG4gIHN0YXRpYyBzZXRDb250ZXh0KGN0eCkge1xuICAgIHRoaXMuY29udGV4dCA9IGN0eDtcbiAgfVxuXG4gIHN0YXRpYyByZWdpc3Rlck90aGVyQXVkaW9CdXR0b25FdmVudHMoYnV0dG9uKSB7XG4gICAgLy8gXCJ3YXJtIHVwXCIgdGhlIG1pY3JvcGhvbmUgYnkgYWNxdWlyaW5nIGl0IGJlZm9yZSB0aGUgdXNlciBwcmVzc2VzIHRoZSBidXR0b25cbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZW50ZXJcIiwgKCkgPT4ge1xuICAgICAgRXZlbnRNb2R1bGUuZGlzcGF0Y2hDdXN0b21FdmVudChcImF1ZGlvOnNldHVwUmVjb3JkaW5nXCIpO1xuICAgIH0pO1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCAoKSA9PiB7XG4gICAgICBFdmVudE1vZHVsZS5kaXNwYXRjaEN1c3RvbUV2ZW50KFwiYXVkaW86dGVhckRvd25SZWNvcmRpbmdcIik7XG4gICAgfSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJiZWZvcmV1bmxvYWRcIiwgKCkgPT4ge1xuICAgICAgRXZlbnRNb2R1bGUuZGlzcGF0Y2hDdXN0b21FdmVudChcImF1ZGlvOnRlYXJEb3duUmVjb3JkaW5nXCIpO1xuICAgIH0pO1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hjYW5jZWxcIiwgKCkgPT4ge1xuICAgICAgRXZlbnRNb2R1bGUuZGlzcGF0Y2hDdXN0b21FdmVudChcImF1ZGlvOnRlYXJEb3duUmVjb3JkaW5nXCIpO1xuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIHJlZ2lzdGVyQ3VzdG9tQXVkaW9FdmVudExpc3RlbmVycygpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNheXBpOnBpUmVhZHlUb1Jlc3BvbmRcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGlmIChpc1NhZmFyaSgpKSB7XG4gICAgICAgIEV2ZW50TW9kdWxlLmRpc3BhdGNoQ3VzdG9tRXZlbnQoXCJzYXlwaTphd2FpdGluZ1VzZXJJbnB1dFwiKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiYXVkaW86bG9hZGluZ1wiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgLy8gSGFuZGxlIHRoZSBwaVNwZWFraW5nIGV2ZW50LCBlLmcuLCBzdGFydCBhbiBhbmltYXRpb24gb3Igc2hvdyBhIFVJIGVsZW1lbnQuXG4gICAgICBpZiAoaXNTYWZhcmkoKSkge1xuICAgICAgICBFdmVudE1vZHVsZS5kaXNwYXRjaEN1c3RvbUV2ZW50KFwic2F5cGk6cmVjZWl2ZWRVc2VySW5wdXRcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKiBldmVudHMgdG8gZGlyZWN0IHRoZSBhdWRpbyBtb2R1bGUgdG8gc3RhcnQvc3RvcCByZWNvcmRpbmcgKi9cblxuICBzdGF0aWMgcmVnaXN0ZXJIb3RrZXkoKSB7XG4gICAgbGV0IGN0cmxEb3duID0gZmFsc2U7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC5jdHJsS2V5ICYmIGV2ZW50LmNvZGUgPT09IFwiU3BhY2VcIiAmJiAhY3RybERvd24pIHtcbiAgICAgICAgY3RybERvd24gPSB0cnVlO1xuICAgICAgICB0aGlzLmRpc3BhdGNoQ3VzdG9tRXZlbnQoXCJhdWRpbzpzdGFydFJlY29yZGluZ1wiKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChjdHJsRG93biAmJiBldmVudC5jb2RlID09PSBcIlNwYWNlXCIpIHtcbiAgICAgICAgY3RybERvd24gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kaXNwYXRjaEN1c3RvbUV2ZW50KFwiYXVkaW86c3RvcFJlY29yZGluZ1wiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGlzTW9iaWxlVmlldygpIHtcbiAgcmV0dXJuIHdpbmRvdy5tYXRjaE1lZGlhKFwiKG1heC13aWR0aDogNzY4cHgpXCIpLm1hdGNoZXM7XG59XG4vLyBUT0RPOiBkZWR1cGUgdGhpcyBmdW5jdGlvbiBmcm9tIHRyYW5zY3JpYmVyLmpzXG5leHBvcnQgZnVuY3Rpb24gaXNTYWZhcmkoKSB7XG4gIHJldHVybiAvXigoPyFjaHJvbWV8YW5kcm9pZCkuKSpzYWZhcmkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xufVxuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYEBrZXlmcmFtZXMgcHVsc2Vfb3V0ZXJtb3N0IHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTIpO1xuICB9XG59XG4ub3V0ZXJtb3N0IHtcbiAgYW5pbWF0aW9uOiBwdWxzZV9vdXRlcm1vc3QgNXMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBwdWxzZV9zZWNvbmQge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44NTYpO1xuICB9XG59XG4uc2Vjb25kIHtcbiAgYW5pbWF0aW9uOiBwdWxzZV9zZWNvbmQgNXMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBwdWxzZV90aGlyZCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjc5Mik7XG4gIH1cbn1cbi50aGlyZCB7XG4gIGFuaW1hdGlvbjogcHVsc2VfdGhpcmQgNXMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBwdWxzZV9mb3VydGgge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43MjgpO1xuICB9XG59XG4uZm91cnRoIHtcbiAgYW5pbWF0aW9uOiBwdWxzZV9mb3VydGggNXMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBwdWxzZV9maWZ0aCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjY2NCk7XG4gIH1cbn1cbi5maWZ0aCB7XG4gIGFuaW1hdGlvbjogcHVsc2VfZmlmdGggNXMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBwdWxzZV9pbm5lcm1vc3Qge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC42KTtcbiAgfVxufVxuLmlubmVybW9zdCB7XG4gIGFuaW1hdGlvbjogcHVsc2VfaW5uZXJtb3N0IDVzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbi8qIGJvdW5jZSBhbmltYXRpb24gdG8gaW5kaWNhdGUgUGkgaXMgd2FpdGluZyB0byBzcGVhayAqL1xuQGtleWZyYW1lcyBib3VuY2Vfb3V0ZXJtb3N0IHtcbiAgMCUsXG4gIDIwJSxcbiAgNTAlLFxuICA4MCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcbiAgfVxuICA0MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNSUpO1xuICB9XG4gIDYwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0zJSk7XG4gIH1cbn1cbi5vdXRlcm1vc3QucmVhZHlUb1Jlc3BvbmQge1xuICBhbmltYXRpb24tbmFtZTogYm91bmNlX291dGVybW9zdDtcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcbiAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGU7XG59XG5cbkBrZXlmcmFtZXMgYm91bmNlX3NlY29uZCB7XG4gIDAlLFxuICAyMCUsXG4gIDUwJSxcbiAgODAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gIH1cbiAgNDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUuOCUpO1xuICB9XG4gIDYwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0zLjQ4JSk7XG4gIH1cbn1cbi5zZWNvbmQucmVhZHlUb1Jlc3BvbmQge1xuICBhbmltYXRpb24tbmFtZTogYm91bmNlX3NlY29uZDtcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcbiAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGU7XG59XG5cbkBrZXlmcmFtZXMgYm91bmNlX3RoaXJkIHtcbiAgMCUsXG4gIDIwJSxcbiAgNTAlLFxuICA4MCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcbiAgfVxuICA0MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNi42JSk7XG4gIH1cbiAgNjAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTMuOTYlKTtcbiAgfVxufVxuLnRoaXJkLnJlYWR5VG9SZXNwb25kIHtcbiAgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZV90aGlyZDtcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcbiAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGU7XG59XG5cbkBrZXlmcmFtZXMgYm91bmNlX2ZvdXJ0aCB7XG4gIDAlLFxuICAyMCUsXG4gIDUwJSxcbiAgODAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gIH1cbiAgNDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTcuNCUpO1xuICB9XG4gIDYwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC00LjQ0JSk7XG4gIH1cbn1cbi5mb3VydGgucmVhZHlUb1Jlc3BvbmQge1xuICBhbmltYXRpb24tbmFtZTogYm91bmNlX2ZvdXJ0aDtcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcbiAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGU7XG59XG5cbkBrZXlmcmFtZXMgYm91bmNlX2ZpZnRoIHtcbiAgMCUsXG4gIDIwJSxcbiAgNTAlLFxuICA4MCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcbiAgfVxuICA0MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtOC4yJSk7XG4gIH1cbiAgNjAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTQuOTIlKTtcbiAgfVxufVxuLmZpZnRoLnJlYWR5VG9SZXNwb25kIHtcbiAgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZV9maWZ0aDtcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcbiAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGU7XG59XG5cbkBrZXlmcmFtZXMgYm91bmNlX2lubmVybW9zdCB7XG4gIDAlLFxuICAyMCUsXG4gIDUwJSxcbiAgODAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gIH1cbiAgNDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTklKTtcbiAgfVxuICA2MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNS40JSk7XG4gIH1cbn1cbi5pbm5lcm1vc3QucmVhZHlUb1Jlc3BvbmQge1xuICBhbmltYXRpb24tbmFtZTogYm91bmNlX2lubmVybW9zdDtcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcbiAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGU7XG59XG5cbi8qIHBsYXlmdWwgYW5pbWF0aW9uIHRvIGluZGljYXRlIFBpIGlzIHNwZWFraW5nICovXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX291dGVybW9zdCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpIHJvdGF0ZSgwZGVnKTtcbiAgfVxuICAyNSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45OTUpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkpO1xuICB9XG4gIDc1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjg5NSk7XG4gIH1cbn1cbi5vdXRlcm1vc3QucGlTcGVha2luZyB7XG4gIGFuaW1hdGlvbjogc3BlYWtpbmdfb3V0ZXJtb3N0IDJzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbkBrZXlmcmFtZXMgc3BlYWtpbmdfc2Vjb25kIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSkgcm90YXRlKDBkZWcpO1xuICB9XG4gIDI1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjk4KSByb3RhdGUoLTFkZWcpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjg3KSByb3RhdGUoMGRlZyk7XG4gIH1cbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODY1KSByb3RhdGUoMWRlZyk7XG4gIH1cbn1cbi5zZWNvbmQucGlTcGVha2luZyB7XG4gIGFuaW1hdGlvbjogc3BlYWtpbmdfc2Vjb25kIDJzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbkBrZXlmcmFtZXMgc3BlYWtpbmdfdGhpcmQge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKSByb3RhdGUoMGRlZyk7XG4gIH1cbiAgMjUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTY1KSByb3RhdGUoLTJkZWcpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjg0KSByb3RhdGUoMGRlZyk7XG4gIH1cbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODM1KSByb3RhdGUoMmRlZyk7XG4gIH1cbn1cbi50aGlyZC5waVNwZWFraW5nIHtcbiAgYW5pbWF0aW9uOiBzcGVha2luZ190aGlyZCAycyBpbmZpbml0ZTtcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xufVxuXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX2ZvdXJ0aCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpIHJvdGF0ZSgwZGVnKTtcbiAgfVxuICAyNSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45NSkgcm90YXRlKC0zZGVnKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44MSkgcm90YXRlKDBkZWcpO1xuICB9XG4gIDc1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjgwNSkgcm90YXRlKDNkZWcpO1xuICB9XG59XG4uZm91cnRoLnBpU3BlYWtpbmcge1xuICBhbmltYXRpb246IHNwZWFraW5nX2ZvdXJ0aCAycyBpbmZpbml0ZTtcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xufVxuXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX2ZpZnRoIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSkgcm90YXRlKDBkZWcpO1xuICB9XG4gIDI1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkzNSkgcm90YXRlKC00ZGVnKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43OCkgcm90YXRlKDBkZWcpO1xuICB9XG4gIDc1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjc3NSkgcm90YXRlKDRkZWcpO1xuICB9XG59XG4uZmlmdGgucGlTcGVha2luZyB7XG4gIGFuaW1hdGlvbjogc3BlYWtpbmdfZmlmdGggMnMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBzcGVha2luZ19pbm5lcm1vc3Qge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKSByb3RhdGUoMGRlZyk7XG4gIH1cbiAgMjUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTIpIHJvdGF0ZSgtNWRlZyk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNzUpIHJvdGF0ZSgwZGVnKTtcbiAgfVxuICA3NSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43NDUpIHJvdGF0ZSg1ZGVnKTtcbiAgfVxufVxuLmlubmVybW9zdC5waVNwZWFraW5nIHtcbiAgYW5pbWF0aW9uOiBzcGVha2luZ19pbm5lcm1vc3QgMnMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuLyogd2F2ZSBhbmltYXRpb24gdG8gaW5kaWNhdGUgdXNlciBpcyBzcGVha2luZyAqL1xuQGtleWZyYW1lcyB1c2VyU3BlYWtpbmdBbmltYXRpb24ge1xuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuMDUpIHNjYWxlWCh2YXIoLS13aWR0aC1mYWN0b3IpKVxuICAgICAgdHJhbnNsYXRlWChjYWxjKC01MCUgKyB2YXIoLS1zcHJlYWQtYW1vdW50KSkpO1xuICB9XG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDEpIHNjYWxlWCh2YXIoLS13aWR0aC1mYWN0b3IpKVxuICAgICAgdHJhbnNsYXRlWChjYWxjKC01MCUgKyB2YXIoLS1zcHJlYWQtYW1vdW50KSkpO1xuICB9XG59XG4vKiB1c2VyIHNwZWFraW5nIG9zY2lsbGF0aW9uIGFuaW1hdGlvbiAqL1xuQGtleWZyYW1lcyB3YXZlZm9ybV9vdXRlcm1vc3Qge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMSkgc2NhbGVYKDEpO1xuICB9XG4gIDI1JSxcbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjkpIHNjYWxlWCgwLjkpO1xuICB9XG59XG5cbkBrZXlmcmFtZXMgd2F2ZWZvcm1fc2Vjb25kIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuOSkgc2NhbGVYKDAuOSk7XG4gIH1cbiAgMjUlLFxuICA3NSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuOCkgc2NhbGVYKDAuOCk7XG4gIH1cbn1cblxuQGtleWZyYW1lcyB3YXZlZm9ybV90aGlyZCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjgpIHNjYWxlWCgwLjgpO1xuICB9XG4gIDI1JSxcbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjcpIHNjYWxlWCgwLjcpO1xuICB9XG59XG5cbkBrZXlmcmFtZXMgd2F2ZWZvcm1fZm91cnRoIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuNykgc2NhbGVYKDAuNyk7XG4gIH1cbiAgMjUlLFxuICA3NSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuNikgc2NhbGVYKDAuNik7XG4gIH1cbn1cblxuQGtleWZyYW1lcyB3YXZlZm9ybV9maWZ0aCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjYpIHNjYWxlWCgwLjYpO1xuICB9XG4gIDI1JSxcbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjUpIHNjYWxlWCgwLjUpO1xuICB9XG59XG5cbkBrZXlmcmFtZXMgd2F2ZWZvcm1faW5uZXJtb3N0IHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuNSkgc2NhbGVYKDAuNSk7XG4gIH1cbiAgMjUlLFxuICA3NSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuNCkgc2NhbGVYKDAuNCk7XG4gIH1cbn1cblxuLm91dGVybW9zdC51c2VyU3BlYWtpbmcge1xuICBhbmltYXRpb246IHdhdmVmb3JtX291dGVybW9zdCAwLjdzIGluZmluaXRlIGFsdGVybmF0ZTtcbn1cblxuLnNlY29uZC51c2VyU3BlYWtpbmcge1xuICBhbmltYXRpb246IHdhdmVmb3JtX3NlY29uZCAwLjY1cyBpbmZpbml0ZSBhbHRlcm5hdGU7XG59XG5cbi50aGlyZC51c2VyU3BlYWtpbmcge1xuICBhbmltYXRpb246IHdhdmVmb3JtX3RoaXJkIDAuNnMgaW5maW5pdGUgYWx0ZXJuYXRlO1xufVxuXG4uZm91cnRoLnVzZXJTcGVha2luZyB7XG4gIGFuaW1hdGlvbjogd2F2ZWZvcm1fZm91cnRoIDAuNTVzIGluZmluaXRlIGFsdGVybmF0ZTtcbn1cblxuLmZpZnRoLnVzZXJTcGVha2luZyB7XG4gIGFuaW1hdGlvbjogd2F2ZWZvcm1fZmlmdGggMC41cyBpbmZpbml0ZSBhbHRlcm5hdGU7XG59XG5cbi5pbm5lcm1vc3QudXNlclNwZWFraW5nIHtcbiAgYW5pbWF0aW9uOiB3YXZlZm9ybV9pbm5lcm1vc3QgMC40NXMgaW5maW5pdGUgYWx0ZXJuYXRlO1xufVxuXG4vKiBmbGlwY2FyZCBhbmltYXRpb24gdG8gaW5kaWNhdGUgU2F5LCBQaSBpcyB0cmFuc2NyaWJpbmcgYXVkaW8gdG8gdGV4dCAqL1xuQGtleWZyYW1lcyB0cmFuc2NyaWJpbmdGbGlwIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogcm90YXRlWSgwZGVnKTtcbiAgICBmaWxsOiB2YXIoLS1vcmlnaW5hbC1jb2xvcik7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZVkoMTgwZGVnKTtcbiAgICBmaWxsOiB2YXIoLS10cmFuc2NyaWJpbmctY29sb3IpO1xuICB9XG59XG5cbi5vdXRlcm1vc3QudHJhbnNjcmliaW5nIHtcbiAgLS1vcmlnaW5hbC1jb2xvcjogI2U0ZjJkMTtcbiAgLS10cmFuc2NyaWJpbmctY29sb3I6ICNiM2UwZmU7XG4gIGFuaW1hdGlvbjogdHJhbnNjcmliaW5nRmxpcCAxLjVzIGluZmluaXRlO1xufVxuXG4uc2Vjb25kLnRyYW5zY3JpYmluZyB7XG4gIC0tb3JpZ2luYWwtY29sb3I6ICNjY2U4YjU7XG4gIC0tdHJhbnNjcmliaW5nLWNvbG9yOiAjODljMmZmO1xuICBhbmltYXRpb246IHRyYW5zY3JpYmluZ0ZsaXAgMS42cyBpbmZpbml0ZTtcbn1cblxuLnRoaXJkLnRyYW5zY3JpYmluZyB7XG4gIC0tb3JpZ2luYWwtY29sb3I6ICNiM2RiOTU7XG4gIC0tdHJhbnNjcmliaW5nLWNvbG9yOiAjNWZhNGZmO1xuICBhbmltYXRpb246IHRyYW5zY3JpYmluZ0ZsaXAgMS43cyBpbmZpbml0ZTtcbn1cblxuLmZvdXJ0aC50cmFuc2NyaWJpbmcge1xuICAtLW9yaWdpbmFsLWNvbG9yOiAjOWJkMDc4O1xuICAtLXRyYW5zY3JpYmluZy1jb2xvcjogIzM1ODZmZjtcbiAgYW5pbWF0aW9uOiB0cmFuc2NyaWJpbmdGbGlwIDEuOHMgaW5maW5pdGU7XG59XG5cbi5maWZ0aC50cmFuc2NyaWJpbmcge1xuICAtLW9yaWdpbmFsLWNvbG9yOiAjODNjNTVjO1xuICAtLXRyYW5zY3JpYmluZy1jb2xvcjogIzBiNjllMztcbiAgYW5pbWF0aW9uOiB0cmFuc2NyaWJpbmdGbGlwIDEuOXMgaW5maW5pdGU7XG59XG5cbi5pbm5lcm1vc3QudHJhbnNjcmliaW5nIHtcbiAgLS1vcmlnaW5hbC1jb2xvcjogIzQyOGEyZjtcbiAgLS10cmFuc2NyaWJpbmctY29sb3I6ICMwMDUzYmY7XG4gIGFuaW1hdGlvbjogdHJhbnNjcmliaW5nRmxpcCAycyBpbmZpbml0ZTtcbn1cblxuLyogaW5oYWxhdGlvbiBhbmltYXRpb24gdG8gaW5kaWNhdGUgUGkgaXMgcHJlcGFyaW5nIHRvIHNwZWFrICovXG5Aa2V5ZnJhbWVzIGxvYWRpbmdJbmhhbGF0aW9uIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMDUpOyAvKiBTbGlnaHRseSBzY2FsZWQgdXAgKi9cbiAgfVxufVxuXG4ub3V0ZXJtb3N0LmxvYWRpbmcge1xuICBhbmltYXRpb246IGxvYWRpbmdJbmhhbGF0aW9uIDJzIGluZmluaXRlO1xufVxuXG4uc2Vjb25kLmxvYWRpbmcge1xuICBhbmltYXRpb246IGxvYWRpbmdJbmhhbGF0aW9uIDIuMXMgaW5maW5pdGU7XG59XG5cbi50aGlyZC5sb2FkaW5nIHtcbiAgYW5pbWF0aW9uOiBsb2FkaW5nSW5oYWxhdGlvbiAyLjJzIGluZmluaXRlO1xufVxuXG4uZm91cnRoLmxvYWRpbmcge1xuICBhbmltYXRpb246IGxvYWRpbmdJbmhhbGF0aW9uIDIuM3MgaW5maW5pdGU7XG59XG5cbi5maWZ0aC5sb2FkaW5nIHtcbiAgYW5pbWF0aW9uOiBsb2FkaW5nSW5oYWxhdGlvbiAyLjRzIGluZmluaXRlO1xufVxuXG4uaW5uZXJtb3N0LmxvYWRpbmcge1xuICBhbmltYXRpb246IGxvYWRpbmdJbmhhbGF0aW9uIDIuNXMgaW5maW5pdGU7XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9yZWN0YW5nbGVzLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNFOztJQUVFLG1CQUFtQjtFQUNyQjtFQUNBO0lBQ0Usc0JBQXNCO0VBQ3hCO0FBQ0Y7QUFDQTtFQUNFLHNDQUFzQztFQUN0Qyx3QkFBd0I7QUFDMUI7O0FBRUE7RUFDRTs7SUFFRSxtQkFBbUI7RUFDckI7RUFDQTtJQUNFLHVCQUF1QjtFQUN6QjtBQUNGO0FBQ0E7RUFDRSxtQ0FBbUM7RUFDbkMsd0JBQXdCO0FBQzFCOztBQUVBO0VBQ0U7O0lBRUUsbUJBQW1CO0VBQ3JCO0VBQ0E7SUFDRSx1QkFBdUI7RUFDekI7QUFDRjtBQUNBO0VBQ0Usa0NBQWtDO0VBQ2xDLHdCQUF3QjtBQUMxQjs7QUFFQTtFQUNFOztJQUVFLG1CQUFtQjtFQUNyQjtFQUNBO0lBQ0UsdUJBQXVCO0VBQ3pCO0FBQ0Y7QUFDQTtFQUNFLG1DQUFtQztFQUNuQyx3QkFBd0I7QUFDMUI7O0FBRUE7RUFDRTs7SUFFRSxtQkFBbUI7RUFDckI7RUFDQTtJQUNFLHVCQUF1QjtFQUN6QjtBQUNGO0FBQ0E7RUFDRSxrQ0FB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O0FBQzNDOztBQUVBO0VBQ0UseUJBQXlCO0VBQ3pCLDZCQUE2QjtFQUM3Qix1Q0FBdUM7QUFDekM7O0FBRUEsOERBQThEO0FBQzlEO0VBQ0U7O0lBRUUsbUJBQW1CO0VBQ3JCO0VBQ0E7SUFDRSxzQkFBc0IsRUFBRSx1QkFBdUI7RUFDakQ7QUFDRjs7QUFFQTtFQUNFLHdDQUF3QztBQUMxQzs7QUFFQTtFQUNFLDBDQUEwQztBQUM1Qzs7QUFFQTtFQUNFLDBDQUEwQztBQUM1Qzs7QUFFQTtFQUNFLDBDQUEwQztBQUM1Qzs7QUFFQTtFQUNFLDBDQUEwQztBQUM1Qzs7QUFFQTtFQUNFLDBDQUEwQztBQUM1Q1wiLFwic291cmNlc0NvbnRlbnRcIjpbXCJAa2V5ZnJhbWVzIHB1bHNlX291dGVybW9zdCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkyKTtcXG4gIH1cXG59XFxuLm91dGVybW9zdCB7XFxuICBhbmltYXRpb246IHB1bHNlX291dGVybW9zdCA1cyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuQGtleWZyYW1lcyBwdWxzZV9zZWNvbmQge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44NTYpO1xcbiAgfVxcbn1cXG4uc2Vjb25kIHtcXG4gIGFuaW1hdGlvbjogcHVsc2Vfc2Vjb25kIDVzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHB1bHNlX3RoaXJkIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNzkyKTtcXG4gIH1cXG59XFxuLnRoaXJkIHtcXG4gIGFuaW1hdGlvbjogcHVsc2VfdGhpcmQgNXMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbkBrZXlmcmFtZXMgcHVsc2VfZm91cnRoIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNzI4KTtcXG4gIH1cXG59XFxuLmZvdXJ0aCB7XFxuICBhbmltYXRpb246IHB1bHNlX2ZvdXJ0aCA1cyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuQGtleWZyYW1lcyBwdWxzZV9maWZ0aCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjY2NCk7XFxuICB9XFxufVxcbi5maWZ0aCB7XFxuICBhbmltYXRpb246IHB1bHNlX2ZpZnRoIDVzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHB1bHNlX2lubmVybW9zdCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjYpO1xcbiAgfVxcbn1cXG4uaW5uZXJtb3N0IHtcXG4gIGFuaW1hdGlvbjogcHVsc2VfaW5uZXJtb3N0IDVzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG4vKiBib3VuY2UgYW5pbWF0aW9uIHRvIGluZGljYXRlIFBpIGlzIHdhaXRpbmcgdG8gc3BlYWsgKi9cXG5Aa2V5ZnJhbWVzIGJvdW5jZV9vdXRlcm1vc3Qge1xcbiAgMCUsXFxuICAyMCUsXFxuICA1MCUsXFxuICA4MCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xcbiAgfVxcbiAgNDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01JSk7XFxuICB9XFxuICA2MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTMlKTtcXG4gIH1cXG59XFxuLm91dGVybW9zdC5yZWFkeVRvUmVzcG9uZCB7XFxuICBhbmltYXRpb24tbmFtZTogYm91bmNlX291dGVybW9zdDtcXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XFxuICBhbmltYXRpb24taXRlcmF0aW9uLWNvdW50OiBpbmZpbml0ZTtcXG59XFxuXFxuQGtleWZyYW1lcyBib3VuY2Vfc2Vjb25kIHtcXG4gIDAlLFxcbiAgMjAlLFxcbiAgNTAlLFxcbiAgODAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcXG4gIH1cXG4gIDQwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNS44JSk7XFxuICB9XFxuICA2MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTMuNDglKTtcXG4gIH1cXG59XFxuLnNlY29uZC5yZWFkeVRvUmVzcG9uZCB7XFxuICBhbmltYXRpb24tbmFtZTogYm91bmNlX3NlY29uZDtcXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XFxuICBhbmltYXRpb24taXRlcmF0aW9uLWNvdW50OiBpbmZpbml0ZTtcXG59XFxuXFxuQGtleWZyYW1lcyBib3VuY2VfdGhpcmQge1xcbiAgMCUsXFxuICAyMCUsXFxuICA1MCUsXFxuICA4MCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xcbiAgfVxcbiAgNDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC02LjYlKTtcXG4gIH1cXG4gIDYwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMy45NiUpO1xcbiAgfVxcbn1cXG4udGhpcmQucmVhZHlUb1Jlc3BvbmQge1xcbiAgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZV90aGlyZDtcXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XFxuICBhbmltYXRpb24taXRlcmF0aW9uLWNvdW50OiBpbmZpbml0ZTtcXG59XFxuXFxuQGtleWZyYW1lcyBib3VuY2VfZm91cnRoIHtcXG4gIDAlLFxcbiAgMjAlLFxcbiAgNTAlLFxcbiAgODAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcXG4gIH1cXG4gIDQwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNy40JSk7XFxuICB9XFxuICA2MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTQuNDQlKTtcXG4gIH1cXG59XFxuLmZvdXJ0aC5yZWFkeVRvUmVzcG9uZCB7XFxuICBhbmltYXRpb24tbmFtZTogYm91bmNlX2ZvdXJ0aDtcXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XFxuICBhbmltYXRpb24taXRlcmF0aW9uLWNvdW50OiBpbmZpbml0ZTtcXG59XFxuXFxuQGtleWZyYW1lcyBib3VuY2VfZmlmdGgge1xcbiAgMCUsXFxuICAyMCUsXFxuICA1MCUsXFxuICA4MCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xcbiAgfVxcbiAgNDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC04LjIlKTtcXG4gIH1cXG4gIDYwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNC45MiUpO1xcbiAgfVxcbn1cXG4uZmlmdGgucmVhZHlUb1Jlc3BvbmQge1xcbiAgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZV9maWZ0aDtcXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XFxuICBhbmltYXRpb24taXRlcmF0aW9uLWNvdW50OiBpbmZpbml0ZTtcXG59XFxuXFxuQGtleWZyYW1lcyBib3VuY2VfaW5uZXJtb3N0IHtcXG4gIDAlLFxcbiAgMjAlLFxcbiAgNTAlLFxcbiAgODAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcXG4gIH1cXG4gIDQwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtOSUpO1xcbiAgfVxcbiAgNjAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01LjQlKTtcXG4gIH1cXG59XFxuLmlubmVybW9zdC5yZWFkeVRvUmVzcG9uZCB7XFxuICBhbmltYXRpb24tbmFtZTogYm91bmNlX2lubmVybW9zdDtcXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XFxuICBhbmltYXRpb24taXRlcmF0aW9uLWNvdW50OiBpbmZpbml0ZTtcXG59XFxuXFxuLyogcGxheWZ1bCBhbmltYXRpb24gdG8gaW5kaWNhdGUgUGkgaXMgc3BlYWtpbmcgKi9cXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX291dGVybW9zdCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpIHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDI1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45OTUpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkpO1xcbiAgfVxcbiAgNzUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjg5NSk7XFxuICB9XFxufVxcbi5vdXRlcm1vc3QucGlTcGVha2luZyB7XFxuICBhbmltYXRpb246IHNwZWFraW5nX291dGVybW9zdCAycyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuQGtleWZyYW1lcyBzcGVha2luZ19zZWNvbmQge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKSByb3RhdGUoMGRlZyk7XFxuICB9XFxuICAyNSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTgpIHJvdGF0ZSgtMWRlZyk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODcpIHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44NjUpIHJvdGF0ZSgxZGVnKTtcXG4gIH1cXG59XFxuLnNlY29uZC5waVNwZWFraW5nIHtcXG4gIGFuaW1hdGlvbjogc3BlYWtpbmdfc2Vjb25kIDJzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX3RoaXJkIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSkgcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgMjUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjk2NSkgcm90YXRlKC0yZGVnKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44NCkgcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgNzUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjgzNSkgcm90YXRlKDJkZWcpO1xcbiAgfVxcbn1cXG4udGhpcmQucGlTcGVha2luZyB7XFxuICBhbmltYXRpb246IHNwZWFraW5nX3RoaXJkIDJzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX2ZvdXJ0aCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpIHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDI1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45NSkgcm90YXRlKC0zZGVnKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44MSkgcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgNzUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjgwNSkgcm90YXRlKDNkZWcpO1xcbiAgfVxcbn1cXG4uZm91cnRoLnBpU3BlYWtpbmcge1xcbiAgYW5pbWF0aW9uOiBzcGVha2luZ19mb3VydGggMnMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbkBrZXlmcmFtZXMgc3BlYWtpbmdfZmlmdGgge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKSByb3RhdGUoMGRlZyk7XFxuICB9XFxuICAyNSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTM1KSByb3RhdGUoLTRkZWcpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjc4KSByb3RhdGUoMGRlZyk7XFxuICB9XFxuICA3NSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNzc1KSByb3RhdGUoNGRlZyk7XFxuICB9XFxufVxcbi5maWZ0aC5waVNwZWFraW5nIHtcXG4gIGFuaW1hdGlvbjogc3BlYWtpbmdfZmlmdGggMnMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbkBrZXlmcmFtZXMgc3BlYWtpbmdfaW5uZXJtb3N0IHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSkgcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgMjUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkyKSByb3RhdGUoLTVkZWcpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjc1KSByb3RhdGUoMGRlZyk7XFxuICB9XFxuICA3NSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNzQ1KSByb3RhdGUoNWRlZyk7XFxuICB9XFxufVxcbi5pbm5lcm1vc3QucGlTcGVha2luZyB7XFxuICBhbmltYXRpb246IHNwZWFraW5nX2lubmVybW9zdCAycyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuLyogd2F2ZSBhbmltYXRpb24gdG8gaW5kaWNhdGUgdXNlciBpcyBzcGVha2luZyAqL1xcbkBrZXlmcmFtZXMgdXNlclNwZWFraW5nQW5pbWF0aW9uIHtcXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuMDUpIHNjYWxlWCh2YXIoLS13aWR0aC1mYWN0b3IpKVxcbiAgICAgIHRyYW5zbGF0ZVgoY2FsYygtNTAlICsgdmFyKC0tc3ByZWFkLWFtb3VudCkpKTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgxKSBzY2FsZVgodmFyKC0td2lkdGgtZmFjdG9yKSlcXG4gICAgICB0cmFuc2xhdGVYKGNhbGMoLTUwJSArIHZhcigtLXNwcmVhZC1hbW91bnQpKSk7XFxuICB9XFxufVxcbi8qIHVzZXIgc3BlYWtpbmcgb3NjaWxsYXRpb24gYW5pbWF0aW9uICovXFxuQGtleWZyYW1lcyB3YXZlZm9ybV9vdXRlcm1vc3Qge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMSkgc2NhbGVYKDEpO1xcbiAgfVxcbiAgMjUlLFxcbiAgNzUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC45KSBzY2FsZVgoMC45KTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyB3YXZlZm9ybV9zZWNvbmQge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC45KSBzY2FsZVgoMC45KTtcXG4gIH1cXG4gIDI1JSxcXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuOCkgc2NhbGVYKDAuOCk7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgd2F2ZWZvcm1fdGhpcmQge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC44KSBzY2FsZVgoMC44KTtcXG4gIH1cXG4gIDI1JSxcXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuNykgc2NhbGVYKDAuNyk7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgd2F2ZWZvcm1fZm91cnRoIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuNykgc2NhbGVYKDAuNyk7XFxuICB9XFxuICAyNSUsXFxuICA3NSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjYpIHNjYWxlWCgwLjYpO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIHdhdmVmb3JtX2ZpZnRoIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuNikgc2NhbGVYKDAuNik7XFxuICB9XFxuICAyNSUsXFxuICA3NSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjUpIHNjYWxlWCgwLjUpO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIHdhdmVmb3JtX2lubmVybW9zdCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjUpIHNjYWxlWCgwLjUpO1xcbiAgfVxcbiAgMjUlLFxcbiAgNzUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC40KSBzY2FsZVgoMC40KTtcXG4gIH1cXG59XFxuXFxuLm91dGVybW9zdC51c2VyU3BlYWtpbmcge1xcbiAgYW5pbWF0aW9uOiB3YXZlZm9ybV9vdXRlcm1vc3QgMC43cyBpbmZpbml0ZSBhbHRlcm5hdGU7XFxufVxcblxcbi5zZWNvbmQudXNlclNwZWFraW5nIHtcXG4gIGFuaW1hdGlvbjogd2F2ZWZvcm1fc2Vjb25kIDAuNjVzIGluZmluaXRlIGFsdGVybmF0ZTtcXG59XFxuXFxuLnRoaXJkLnVzZXJTcGVha2luZyB7XFxuICBhbmltYXRpb246IHdhdmVmb3JtX3RoaXJkIDAuNnMgaW5maW5pdGUgYWx0ZXJuYXRlO1xcbn1cXG5cXG4uZm91cnRoLnVzZXJTcGVha2luZyB7XFxuICBhbmltYXRpb246IHdhdmVmb3JtX2ZvdXJ0aCAwLjU1cyBpbmZpbml0ZSBhbHRlcm5hdGU7XFxufVxcblxcbi5maWZ0aC51c2VyU3BlYWtpbmcge1xcbiAgYW5pbWF0aW9uOiB3YXZlZm9ybV9maWZ0aCAwLjVzIGluZmluaXRlIGFsdGVybmF0ZTtcXG59XFxuXFxuLmlubmVybW9zdC51c2VyU3BlYWtpbmcge1xcbiAgYW5pbWF0aW9uOiB3YXZlZm9ybV9pbm5lcm1vc3QgMC40NXMgaW5maW5pdGUgYWx0ZXJuYXRlO1xcbn1cXG5cXG4vKiBmbGlwY2FyZCBhbmltYXRpb24gdG8gaW5kaWNhdGUgU2F5LCBQaSBpcyB0cmFuc2NyaWJpbmcgYXVkaW8gdG8gdGV4dCAqL1xcbkBrZXlmcmFtZXMgdHJhbnNjcmliaW5nRmxpcCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZVkoMGRlZyk7XFxuICAgIGZpbGw6IHZhcigtLW9yaWdpbmFsLWNvbG9yKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogcm90YXRlWSgxODBkZWcpO1xcbiAgICBmaWxsOiB2YXIoLS10cmFuc2NyaWJpbmctY29sb3IpO1xcbiAgfVxcbn1cXG5cXG4ub3V0ZXJtb3N0LnRyYW5zY3JpYmluZyB7XFxuICAtLW9yaWdpbmFsLWNvbG9yOiAjZTRmMmQxO1xcbiAgLS10cmFuc2NyaWJpbmctY29sb3I6ICNiM2UwZmU7XFxuICBhbmltYXRpb246IHRyYW5zY3JpYmluZ0ZsaXAgMS41cyBpbmZpbml0ZTtcXG59XFxuXFxuLnNlY29uZC50cmFuc2NyaWJpbmcge1xcbiAgLS1vcmlnaW5hbC1jb2xvcjogI2NjZThiNTtcXG4gIC0tdHJhbnNjcmliaW5nLWNvbG9yOiAjODljMmZmO1xcbiAgYW5pbWF0aW9uOiB0cmFuc2NyaWJpbmdGbGlwIDEuNnMgaW5maW5pdGU7XFxufVxcblxcbi50aGlyZC50cmFuc2NyaWJpbmcge1xcbiAgLS1vcmlnaW5hbC1jb2xvcjogI2IzZGI5NTtcXG4gIC0tdHJhbnNjcmliaW5nLWNvbG9yOiAjNWZhNGZmO1xcbiAgYW5pbWF0aW9uOiB0cmFuc2NyaWJpbmdGbGlwIDEuN3MgaW5maW5pdGU7XFxufVxcblxcbi5mb3VydGgudHJhbnNjcmliaW5nIHtcXG4gIC0tb3JpZ2luYWwtY29sb3I6ICM5YmQwNzg7XFxuICAtLXRyYW5zY3JpYmluZy1jb2xvcjogIzM1ODZmZjtcXG4gIGFuaW1hdGlvbjogdHJhbnNjcmliaW5nRmxpcCAxLjhzIGluZmluaXRlO1xcbn1cXG5cXG4uZmlmdGgudHJhbnNjcmliaW5nIHtcXG4gIC0tb3JpZ2luYWwtY29sb3I6ICM4M2M1NWM7XFxuICAtLXRyYW5zY3JpYmluZy1jb2xvcjogIzBiNjllMztcXG4gIGFuaW1hdGlvbjogdHJhbnNjcmliaW5nRmxpcCAxLjlzIGluZmluaXRlO1xcbn1cXG5cXG4uaW5uZXJtb3N0LnRyYW5zY3JpYmluZyB7XFxuICAtLW9yaWdpbmFsLWNvbG9yOiAjNDI4YTJmO1xcbiAgLS10cmFuc2NyaWJpbmctY29sb3I6ICMwMDUzYmY7XFxuICBhbmltYXRpb246IHRyYW5zY3JpYmluZ0ZsaXAgMnMgaW5maW5pdGU7XFxufVxcblxcbi8qIGluaGFsYXRpb24gYW5pbWF0aW9uIHRvIGluZGljYXRlIFBpIGlzIHByZXBhcmluZyB0byBzcGVhayAqL1xcbkBrZXlmcmFtZXMgbG9hZGluZ0luaGFsYXRpb24ge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMS4wNSk7IC8qIFNsaWdodGx5IHNjYWxlZCB1cCAqL1xcbiAgfVxcbn1cXG5cXG4ub3V0ZXJtb3N0LmxvYWRpbmcge1xcbiAgYW5pbWF0aW9uOiBsb2FkaW5nSW5oYWxhdGlvbiAycyBpbmZpbml0ZTtcXG59XFxuXFxuLnNlY29uZC5sb2FkaW5nIHtcXG4gIGFuaW1hdGlvbjogbG9hZGluZ0luaGFsYXRpb24gMi4xcyBpbmZpbml0ZTtcXG59XFxuXFxuLnRoaXJkLmxvYWRpbmcge1xcbiAgYW5pbWF0aW9uOiBsb2FkaW5nSW5oYWxhdGlvbiAyLjJzIGluZmluaXRlO1xcbn1cXG5cXG4uZm91cnRoLmxvYWRpbmcge1xcbiAgYW5pbWF0aW9uOiBsb2FkaW5nSW5oYWxhdGlvbiAyLjNzIGluZmluaXRlO1xcbn1cXG5cXG4uZmlmdGgubG9hZGluZyB7XFxuICBhbmltYXRpb246IGxvYWRpbmdJbmhhbGF0aW9uIDIuNHMgaW5maW5pdGU7XFxufVxcblxcbi5pbm5lcm1vc3QubG9hZGluZyB7XFxuICBhbmltYXRpb246IGxvYWRpbmdJbmhhbGF0aW9uIDIuNXMgaW5maW5pdGU7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgQGtleWZyYW1lcyBwdWxzZSB7XG4gIDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkpO1xuICB9XG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gIH1cbn1cbiNzYXlwaS10YWxrQnV0dG9uLFxuLnBsYXktYnV0dG9uIHtcbiAgbWFyZ2luLXRvcDogMC4yNXJlbTtcbiAgYm9yZGVyLXJhZGl1czogMThweDtcbiAgd2lkdGg6IDEyMHB4O1xuICBkaXNwbGF5OiBibG9jazsgLyogRm9yIFNhZmFyaSAqL1xufVxuXG5odG1sOm5vdCguZmlyZWZveC1hbmRyb2lkKSAjc2F5cGktdGFsa0J1dHRvbjphY3RpdmUgLndhdmVmb3JtLFxuI3NheXBpLXRhbGtCdXR0b24uYWN0aXZlIC53YXZlZm9ybSB7XG4gIGFuaW1hdGlvbjogcHVsc2UgMXMgaW5maW5pdGU7XG59XG4jc2F5cGktdGFsa0J1dHRvbiAud2F2ZWZvcm0ge1xuICBmaWxsOiAjNzc2ZDZkO1xufVxuI3NheXBpLXRhbGtCdXR0b24uYXV0b1N1Ym1pdCAud2F2ZWZvcm0ge1xuICBmaWxsOiByZ2IoNjUgMTM4IDQ3KTsgLyogUGkncyB0ZXh0LWJyYW5kLWdyZWVuLTYwMCAqL1xufVxuLmhpZGRlbiB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG4jc2F5cGktcGxheUJ1dHRvbi5wbGF5LWJ1dHRvbiB7XG4gIC8qIHBvc2l0aW9uIG92ZXIgdGhlIHRhbGsgYnV0dG9uLCBidXQgdW5kZXIgYW55IGNvbnRyb2xzICovXG4gIHotaW5kZXg6IDcwOyAvKiB0YWxrIGJ1dHRvbiB6LWluZGV4IGlzIDU5IG9yIDYwICovXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMCk7IC8qIHRyYW5zcGFyZW50IHdpdGhvdXQgaG9sZXMgKi9cbiAgYm9yZGVyOiBub25lO1xufVxuYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvdGFsa0J1dHRvbi5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDRTtJQUNFLG1CQUFtQjtFQUNyQjtFQUNBO0lBQ0UscUJBQXFCO0VBQ3ZCO0VBQ0E7SUFDRSxtQkFBbUI7RUFDckI7QUFDRjtBQUNBOztFQUVFLG1CQUFtQjtFQUNuQixtQkFBbUI7RUFDbkIsWUFBWTtFQUNaLGNBQWMsRUFBRSxlQUFlO0FBQ2pDOztBQUVBOztFQUVFLDRCQUE0QjtBQUM5QjtBQUNBO0VBQ0UsYUFBYTtBQUNmO0FBQ0E7RUFDRSxvQkFBb0IsRUFBRSw4QkFBOEI7QUFDdEQ7QUFDQTtFQUNFLGFBQWE7QUFDZjtBQUNBO0VBQ0UsMERBQTBEO0VBQzFELFdBQVcsRUFBRSxvQ0FBb0M7RUFDakQsa0NBQWtDLEVBQUUsOEJBQThCO0VBQ2xFLFlBQVk7QUFDZFwiLFwic291cmNlc0NvbnRlbnRcIjpbXCJAa2V5ZnJhbWVzIHB1bHNlIHtcXG4gIDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45KTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgfVxcbn1cXG4jc2F5cGktdGFsa0J1dHRvbixcXG4ucGxheS1idXR0b24ge1xcbiAgbWFyZ2luLXRvcDogMC4yNXJlbTtcXG4gIGJvcmRlci1yYWRpdXM6IDE4cHg7XFxuICB3aWR0aDogMTIwcHg7XFxuICBkaXNwbGF5OiBibG9jazsgLyogRm9yIFNhZmFyaSAqL1xcbn1cXG5cXG5odG1sOm5vdCguZmlyZWZveC1hbmRyb2lkKSAjc2F5cGktdGFsa0J1dHRvbjphY3RpdmUgLndhdmVmb3JtLFxcbiNzYXlwaS10YWxrQnV0dG9uLmFjdGl2ZSAud2F2ZWZvcm0ge1xcbiAgYW5pbWF0aW9uOiBwdWxzZSAxcyBpbmZpbml0ZTtcXG59XFxuI3NheXBpLXRhbGtCdXR0b24gLndhdmVmb3JtIHtcXG4gIGZpbGw6ICM3NzZkNmQ7XFxufVxcbiNzYXlwaS10YWxrQnV0dG9uLmF1dG9TdWJtaXQgLndhdmVmb3JtIHtcXG4gIGZpbGw6IHJnYig2NSAxMzggNDcpOyAvKiBQaSdzIHRleHQtYnJhbmQtZ3JlZW4tNjAwICovXFxufVxcbi5oaWRkZW4ge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuI3NheXBpLXBsYXlCdXR0b24ucGxheS1idXR0b24ge1xcbiAgLyogcG9zaXRpb24gb3ZlciB0aGUgdGFsayBidXR0b24sIGJ1dCB1bmRlciBhbnkgY29udHJvbHMgKi9cXG4gIHotaW5kZXg6IDcwOyAvKiB0YWxrIGJ1dHRvbiB6LWluZGV4IGlzIDU5IG9yIDYwICovXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDApOyAvKiB0cmFuc3BhcmVudCB3aXRob3V0IGhvbGVzICovXFxuICBib3JkZXI6IG5vbmU7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIGh0bWwubW9iaWxlLXZpZXcgI3NheXBpLXBhbmVsLFxuICBodG1sLm1vYmlsZS12aWV3IC5wbGF5LWJ1dHRvbiB7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgcG9zaXRpb246IGZpeGVkO1xuICAgIGxlZnQ6IDA7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNDUsIDIzOCwgMjIzLCAwLjk4KTtcbiAgICBoZWlnaHQ6IDEwMHZoO1xuICAgIHRvcDogMDtcbiAgICBwYWRkaW5nOiA1JTtcbiAgfVxuICBodG1sLm1vYmlsZS12aWV3ICNzYXlwaS10YWxrQnV0dG9uIHtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBoZWlnaHQ6IDEwMCU7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgYm9yZGVyLXJhZGl1czogMDtcbiAgICBtYXJnaW46IDA7XG4gIH1cbiAgaHRtbC5tb2JpbGUtdmlldyAjX19uZXh0ID4gbWFpbiA+IGRpdiA+IGRpdiA+IGRpdi5maXhlZC50b3AtNC5yaWdodC02ID4gYnV0dG9uLFxuICBodG1sLm1vYmlsZS12aWV3IGRpdltkYXRhLXByb2plY3Rpb24taWQ9XCIxMlwiXSA+IGJ1dHRvbiB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgyKTtcbiAgICB6LWluZGV4OiA1MDtcbiAgfVxuICBodG1sLm1vYmlsZS12aWV3IGJ1dHRvbltkYXRhLXByb2plY3Rpb24taWQ9XCIxNlwiXSA+IGRpdltkYXRhLXByb2plY3Rpb24taWQ9XCIxN1wiXSxcbiAgaHRtbC5tb2JpbGUtdmlldyBidXR0b25bZGF0YS1wcm9qZWN0aW9uLWlkPVwiMTZcIl0gPiBkaXZbZGF0YS1wcm9qZWN0aW9uLWlkPVwiMThcIl0ge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMikgIWltcG9ydGFudDtcbiAgICB6LWluZGV4OiA1MDtcbiAgfVxuICBodG1sLm1vYmlsZS12aWV3ICNzYXlwaS1mb290ZXIge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gIH1cbn1gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9tb2JpbGUuc2Nzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUVJOztJQUVFLFdBQUE7SUFDQSxlQUFBO0lBQ0EsT0FBQTtJQUNBLDJDQUFBO0lBRUEsYUFBQTtJQUNBLE1BQUE7SUFDQSxXQUFBO0VBREo7RUFJRTtJQUNFLFdBQUE7SUFDQSxZQUFBO0lBQ0EsNkJBQUE7SUFDQSxnQkFBQTtJQUNBLFNBQUE7RUFGSjtFQUtFOztJQUVFLG1CQUFBO0lBQ0EsV0FBQTtFQUhKO0VBT0k7O0lBRUUsOEJBQUE7SUFDQSxXQUFBO0VBTE47RUFTRTtJQUNFLGFBQUE7RUFQSjtBQUNGXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xcbiAgaHRtbC5tb2JpbGUtdmlldyB7XFxuICAgICNzYXlwaS1wYW5lbCxcXG4gICAgLnBsYXktYnV0dG9uIHtcXG4gICAgICB3aWR0aDogMTAwJTtcXG4gICAgICBwb3NpdGlvbjogZml4ZWQ7XFxuICAgICAgbGVmdDogMDtcXG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI0NSwgMjM4LCAyMjMsIDAuOTgpO1xcblxcbiAgICAgIGhlaWdodDogMTAwdmg7XFxuICAgICAgdG9wOiAwO1xcbiAgICAgIHBhZGRpbmc6IDUlO1xcbiAgICB9XFxuXFxuICAgICNzYXlwaS10YWxrQnV0dG9uIHtcXG4gICAgICB3aWR0aDogMTAwJTtcXG4gICAgICBoZWlnaHQ6IDEwMCU7XFxuICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICAgICAgYm9yZGVyLXJhZGl1czogMDtcXG4gICAgICBtYXJnaW46IDA7XFxuICAgIH1cXG5cXG4gICAgI19fbmV4dCA+IG1haW4gPiBkaXYgPiBkaXYgPiBkaXYuZml4ZWQudG9wLTQucmlnaHQtNiA+IGJ1dHRvbixcXG4gICAgZGl2W2RhdGEtcHJvamVjdGlvbi1pZD1cXFwiMTJcXFwiXSA+IGJ1dHRvbiB7XFxuICAgICAgdHJhbnNmb3JtOiBzY2FsZSgyKTtcXG4gICAgICB6LWluZGV4OiA1MDtcXG4gICAgfVxcblxcbiAgICBidXR0b25bZGF0YS1wcm9qZWN0aW9uLWlkPVxcXCIxNlxcXCJdIHtcXG4gICAgICA+IGRpdltkYXRhLXByb2plY3Rpb24taWQ9XFxcIjE3XFxcIl0sXFxuICAgICAgPiBkaXZbZGF0YS1wcm9qZWN0aW9uLWlkPVxcXCIxOFxcXCJdIHtcXG4gICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMikgIWltcG9ydGFudDtcXG4gICAgICAgIHotaW5kZXg6IDUwO1xcbiAgICAgIH1cXG4gICAgfVxcblxcbiAgICAjc2F5cGktZm9vdGVyIHtcXG4gICAgICBkaXNwbGF5OiBub25lO1xcbiAgICB9XFxuICB9XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiZXhwb3J0IGRlZmF1bHQgXCIvLyBEaXNwYXRjaCBDdXN0b20gRXZlbnRcXG5mdW5jdGlvbiBkaXNwYXRjaEN1c3RvbUV2ZW50KGV2ZW50TmFtZSkge1xcbiAgdmFyIGRldGFpbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XFxuICB2YXIgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCB7XFxuICAgIGRldGFpbDogZGV0YWlsXFxuICB9KTtcXG4gIGNvbnNvbGUubG9nKFxcXCJkaXNwYXRjaGluZyBldmVudDogXFxcIiArIGV2ZW50TmFtZSk7XFxuICB3aW5kb3cuZGlzcGF0Y2hFdmVudChldmVudCk7XFxufVxcblxcbi8vIGF1ZGlvIG91dHB1dCAoUGkpXFxudmFyIGF1ZGlvRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXFxcImF1ZGlvXFxcIik7XFxuaWYgKCFhdWRpb0VsZW1lbnQpIHtcXG4gIGNvbnNvbGUuZXJyb3IoXFxcIkF1ZGlvIGVsZW1lbnQgbm90IGZvdW5kIVxcXCIpO1xcbn1cXG5cXG4vLyBUT0RPOiBkZWR1cGUgdGhpcyBmdW5jdGlvbiBmcm9tIEV2ZW50TW9kdWxlLmpzXFxuZnVuY3Rpb24gaXNTYWZhcmkoKSB7XFxuICByZXR1cm4gL14oKD8hY2hyb21lfGFuZHJvaWQpLikqc2FmYXJpL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcXG59XFxuYXVkaW9FbGVtZW50LnByZWxvYWQgPSBcXFwiYXV0b1xcXCI7IC8vIGVuYWJsZSBhZ2dyZXNzaXZlIHByZWxvYWRpbmcgb2YgYXVkaW9cXG52YXIgcGlBdWRpb01hbmFnZXIgPSB7XFxuICBpc1NwZWFraW5nOiBmYWxzZSxcXG4gIGF1ZGlvRWxlbWVudDogYXVkaW9FbGVtZW50LFxcbiAgX3VzZXJTdGFydGVkOiB0cnVlLFxcbiAgLy8gZmxhZyB0byBpbmRpY2F0ZSBwbGF5YmFjayBoYXMgYmVlbiBzdGFydGVkIGJ5IHRoZSB1c2VyICh0cnVlIGJ5IGRlZmF1bHQgYmVjYXVzZSB1c2VyIG11c3QgcmVxdWVzdCBpbml0aWFsIHBsYXliYWNrKVxcbiAgX2lzTG9hZENhbGxlZDogZmFsc2UsXFxuICAvLyBmbGFnIHRvIGluZGljYXRlIGlmIHRoZSBsb2FkKCkgbWV0aG9kIGhhcyBiZWVuIGNhbGxlZCBvbiB0aGUgYXVkaW8gZWxlbWVudFxcblxcbiAgaXNMb2FkQ2FsbGVkOiBmdW5jdGlvbiBpc0xvYWRDYWxsZWQoKSB7XFxuICAgIHJldHVybiB0aGlzLl9pc0xvYWRDYWxsZWQ7XFxuICB9LFxcbiAgc2V0SXNMb2FkQ2FsbGVkOiBmdW5jdGlvbiBzZXRJc0xvYWRDYWxsZWQodmFsdWUpIHtcXG4gICAgdGhpcy5faXNMb2FkQ2FsbGVkID0gdmFsdWU7XFxuICB9LFxcbiAgdXNlclBsYXk6IGZ1bmN0aW9uIHVzZXJQbGF5KCkge1xcbiAgICBpZiAoIWlzU2FmYXJpKCkpIHtcXG4gICAgICByZXR1cm47XFxuICAgIH1cXG4gICAgdGhpcy5fdXNlclN0YXJ0ZWQgPSB0cnVlOyAvLyBzZXQgYSBmbGFnIHRvIGluZGljYXRlIHBsYXliYWNrIGhhcyBiZWVuIHN0YXJ0ZWQgYnkgdGhlIHVzZXJcXG4gICAgdGhpcy5hdWRpb0VsZW1lbnQubG9hZCgpOyAvLyByZXNldCBmb3IgU2FmYXJpXFxuICAgIGRpc3BhdGNoQ3VzdG9tRXZlbnQoXFxcImF1ZGlvOmxvYWRpbmdcXFwiKTtcXG4gICAgdGhpcy5hdWRpb0VsZW1lbnQucGxheSgpO1xcbiAgfSxcXG4gIGF1dG9QbGF5OiBmdW5jdGlvbiBhdXRvUGxheSgpIHtcXG4gICAgaWYgKCF0aGlzLl91c2VyU3RhcnRlZCkge1xcbiAgICAgIHRoaXMuYXVkaW9FbGVtZW50LnBhdXNlKCk7XFxuICAgIH1cXG4gIH0sXFxuICBzdG9wOiBmdW5jdGlvbiBzdG9wKCkge1xcbiAgICBpZiAodGhpcy5pc1NwZWFraW5nKSB7XFxuICAgICAgdGhpcy5hdWRpb0VsZW1lbnQucGF1c2UoKTtcXG4gICAgfVxcbiAgICBpZiAodGhpcy5hdWRpb0VsZW1lbnQuZHVyYXRpb24gJiYgIXRoaXMuYXVkaW9FbGVtZW50LmVuZGVkICYmIHRoaXMuYXVkaW9FbGVtZW50LmN1cnJlbnRUaW1lIDwgdGhpcy5hdWRpb0VsZW1lbnQuZHVyYXRpb24pIHtcXG4gICAgICB0aGlzLmF1ZGlvRWxlbWVudC5jdXJyZW50VGltZSA9IHRoaXMuYXVkaW9FbGVtZW50LmR1cmF0aW9uOyAvLyBzZWVrIHRoZSBhdWRpbyB0byB0aGUgZW5kXFxuICAgICAgdGhpcy5hdWRpb0VsZW1lbnQucGxheSgpOyAvLyB0cmlnZ2VyIHRoZSBlbmRlZCBldmVudFxcbiAgICB9XFxuICB9LFxcblxcbiAgcGF1c2U6IGZ1bmN0aW9uIHBhdXNlKCkge1xcbiAgICB0aGlzLmF1ZGlvRWxlbWVudC5wYXVzZSgpO1xcbiAgfSxcXG4gIHJlc3VtZTogZnVuY3Rpb24gcmVzdW1lKCkge1xcbiAgICB0aGlzLmF1ZGlvRWxlbWVudC5wbGF5KCk7XFxuICB9LFxcbiAgcGxheWluZzogZnVuY3Rpb24gcGxheWluZygpIHtcXG4gICAgdGhpcy5pc1NwZWFraW5nID0gdHJ1ZTtcXG4gIH0sXFxuICBzdG9wcGVkOiBmdW5jdGlvbiBzdG9wcGVkKCkge1xcbiAgICB0aGlzLmlzU3BlYWtpbmcgPSBmYWxzZTtcXG4gICAgdGhpcy5fdXNlclN0YXJ0ZWQgPSBmYWxzZTtcXG4gIH1cXG59O1xcblxcbi8vIEludGVyY2VwdCBBdXRvcGxheSBFdmVudHMgKGF1dG9wbGF5IGRvZXNuJ3Qgd29yayBvbiBTYWZhcmkpXFxuYXVkaW9FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXFxcInBsYXlcXFwiLCBmdW5jdGlvbiAoKSB7XFxuICBpZiAoaXNTYWZhcmkoKSkge1xcbiAgICBwaUF1ZGlvTWFuYWdlci5hdXRvUGxheSgpO1xcbiAgfVxcbn0pO1xcbmF1ZGlvRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxcXCJsb2Fkc3RhcnRcXFwiLCBmdW5jdGlvbiAoKSB7XFxuICBpZiAoaXNTYWZhcmkoKSkge1xcbiAgICBkaXNwYXRjaEN1c3RvbUV2ZW50KFxcXCJzYXlwaTpwaVJlYWR5VG9SZXNwb25kXFxcIik7XFxuICB9XFxufSk7XFxuXFxuLy8gRXZlbnQgbGlzdGVuZXJzIGZvciBkZXRlY3Rpbmcgd2hlbiBQaSBpcyBzcGVha2luZ1xcbmF1ZGlvRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxcXCJwbGF5aW5nXFxcIiwgZnVuY3Rpb24gKCkge1xcbiAgcGlBdWRpb01hbmFnZXIucGxheWluZygpO1xcbiAgZGlzcGF0Y2hDdXN0b21FdmVudChcXFwic2F5cGk6cGlTcGVha2luZ1xcXCIpO1xcbn0pO1xcbmF1ZGlvRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxcXCJwYXVzZVxcXCIsIGZ1bmN0aW9uICgpIHtcXG4gIHBpQXVkaW9NYW5hZ2VyLnN0b3BwZWQoKTtcXG4gIGRpc3BhdGNoQ3VzdG9tRXZlbnQoXFxcInNheXBpOnBpU3RvcHBlZFNwZWFraW5nXFxcIik7XFxufSk7XFxuYXVkaW9FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXFxcImVuZGVkXFxcIiwgZnVuY3Rpb24gKCkge1xcbiAgcGlBdWRpb01hbmFnZXIuc3RvcHBlZCgpO1xcbiAgZGlzcGF0Y2hDdXN0b21FdmVudChcXFwic2F5cGk6cGlGaW5pc2hlZFNwZWFraW5nXFxcIik7XFxufSk7XFxuXFxuLy8gYXVkaW8gaW5wdXQgKHVzZXIpXFxudmFyIGF1ZGlvRGF0YUNodW5rcyA9IFtdO1xcbnZhciBhdWRpb01pbWVUeXBlID0gXFxcImF1ZGlvL3dlYm07Y29kZWNzPW9wdXNcXFwiO1xcbmZ1bmN0aW9uIHVwbG9hZEF1ZGlvKGF1ZGlvQmxvYikge1xcbiAgLy8gQ3JlYXRlIGEgRm9ybURhdGEgb2JqZWN0XFxuICB2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcXG4gIHZhciBhdWRpb0ZpbGVuYW1lID0gXFxcImF1ZGlvLndlYm1cXFwiO1xcbiAgaWYgKGF1ZGlvQmxvYi50eXBlID09PSBcXFwiYXVkaW8vbXA0XFxcIikge1xcbiAgICBhdWRpb0ZpbGVuYW1lID0gXFxcImF1ZGlvLm1wNFxcXCI7XFxuICB9XFxuICAvLyBBZGQgdGhlIGF1ZGlvIGJsb2IgdG8gdGhlIEZvcm1EYXRhIG9iamVjdFxcbiAgZm9ybURhdGEuYXBwZW5kKFxcXCJhdWRpb1xcXCIsIGF1ZGlvQmxvYiwgYXVkaW9GaWxlbmFtZSk7XFxuICAvLyBHZXQgdGhlIHVzZXIncyBwcmVmZXJyZWQgbGFuZ3VhZ2VcXG4gIHZhciBsYW5ndWFnZSA9IG5hdmlnYXRvci5sYW5ndWFnZTtcXG4gIGRpc3BhdGNoQ3VzdG9tRXZlbnQoXFxcInNheXBpOnRyYW5zY3JpYmluZ1xcXCIpO1xcbiAgLy8gUG9zdCB0aGUgYXVkaW8gdG8gdGhlIHNlcnZlciBmb3IgdHJhbnNjcmlwdGlvblxcbiAgZmV0Y2goY29uZmlnLmFwaVNlcnZlclVybCArIFxcXCIvdHJhbnNjcmliZT9sYW5ndWFnZT1cXFwiICsgbGFuZ3VhZ2UsIHtcXG4gICAgbWV0aG9kOiBcXFwiUE9TVFxcXCIsXFxuICAgIGJvZHk6IGZvcm1EYXRhXFxuICB9KS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xcbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XFxuICAgICAgdGhyb3cgRXJyb3IocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XFxuICAgIH1cXG4gICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcXG4gIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlSnNvbikge1xcbiAgICBkaXNwYXRjaEN1c3RvbUV2ZW50KFxcXCJzYXlwaTp0cmFuc2NyaWJlZFxcXCIsIHtcXG4gICAgICB0ZXh0OiByZXNwb25zZUpzb24udGV4dFxcbiAgICB9KTtcXG4gIH0pW1xcXCJjYXRjaFxcXCJdKGZ1bmN0aW9uIChlcnJvcikge1xcbiAgICBjb25zb2xlLmVycm9yKFxcXCJMb29rcyBsaWtlIHRoZXJlIHdhcyBhIHByb2JsZW06IFxcXCIsIGVycm9yKTtcXG4gICAgdmFyIHRleHRhcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXFxcInNheXBpLXByb21wdFxcXCIpO1xcbiAgICB0ZXh0YXJlYS52YWx1ZSA9IFxcXCJTb3JyeSwgdGhlcmUgd2FzIGEgcHJvYmxlbSB0cmFuc2NyaWJpbmcgeW91ciBhdWRpby4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlci5cXFwiO1xcbiAgfSk7XFxufVxcblxcbi8vIERlY2xhcmUgYSBnbG9iYWwgdmFyaWFibGUgZm9yIHRoZSBtZWRpYVJlY29yZGVyXFxudmFyIG1lZGlhUmVjb3JkZXI7XFxudmFyIHRocmVzaG9sZCA9IDEwMDA7IC8vIDEwMDAgbXMgPSAxIHNlY29uZCwgYWJvdXQgdGhlIGxlbmd0aCBvZiBcXFwiSGV5LCBQaVxcXCJcXG5cXG4vLyBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlICdkYXRhYXZhaWxhYmxlJyBldmVudCBmaXJlc1xcbmZ1bmN0aW9uIGhhbmRsZURhdGFBdmFpbGFibGUoZSkge1xcbiAgLy8gQWRkIHRoZSBhdWRpbyBkYXRhIGNodW5rIHRvIHRoZSBhcnJheVxcbiAgYXVkaW9EYXRhQ2h1bmtzLnB1c2goZS5kYXRhKTtcXG59XFxuXFxuLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSAnc3RvcCcgZXZlbnQgZmlyZXNcXG5mdW5jdGlvbiBoYW5kbGVTdG9wKCkge1xcbiAgLy8gQ3JlYXRlIGEgQmxvYiBmcm9tIHRoZSBhdWRpbyBkYXRhIGNodW5rc1xcbiAgdmFyIGF1ZGlvQmxvYiA9IG5ldyBCbG9iKGF1ZGlvRGF0YUNodW5rcywge1xcbiAgICB0eXBlOiBhdWRpb01pbWVUeXBlXFxuICB9KTtcXG5cXG4gIC8vIEdldCB0aGUgc3RvcCB0aW1lIGFuZCBjYWxjdWxhdGUgdGhlIGR1cmF0aW9uXFxuICB2YXIgc3RvcFRpbWUgPSBEYXRlLm5vdygpO1xcbiAgdmFyIGR1cmF0aW9uID0gc3RvcFRpbWUgLSB3aW5kb3cuc3RhcnRUaW1lO1xcblxcbiAgLy8gSWYgdGhlIGR1cmF0aW9uIGlzIGdyZWF0ZXIgdGhhbiB0aGUgdGhyZXNob2xkLCB1cGxvYWQgdGhlIGF1ZGlvIGZvciB0cmFuc2NyaXB0aW9uXFxuICBpZiAoZHVyYXRpb24gPj0gdGhyZXNob2xkKSB7XFxuICAgIC8vIFVwbG9hZCB0aGUgYXVkaW8gdG8gdGhlIHNlcnZlciBmb3IgdHJhbnNjcmlwdGlvblxcbiAgICB1cGxvYWRBdWRpbyhhdWRpb0Jsb2IpO1xcbiAgfVxcblxcbiAgLy8gQ2xlYXIgdGhlIGFycmF5IGZvciB0aGUgbmV4dCByZWNvcmRpbmdcXG4gIGF1ZGlvRGF0YUNodW5rcyA9IFtdO1xcbn1cXG5mdW5jdGlvbiBzZXR1cFJlY29yZGluZyhjYWxsYmFjaykge1xcbiAgaWYgKG1lZGlhUmVjb3JkZXIpIHtcXG4gICAgcmV0dXJuO1xcbiAgfVxcblxcbiAgLy8gR2V0IGEgc3RyZWFtIGZyb20gdGhlIHVzZXIncyBtaWNyb3Bob25lXFxuICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYSh7XFxuICAgIGF1ZGlvOiB0cnVlXFxuICB9KS50aGVuKGZ1bmN0aW9uIChzdHJlYW0pIHtcXG4gICAgaWYgKCFNZWRpYVJlY29yZGVyLmlzVHlwZVN1cHBvcnRlZChhdWRpb01pbWVUeXBlKSkge1xcbiAgICAgIC8vIHVzZSBNUDQgZm9yIFNhZmFyaVxcbiAgICAgIGF1ZGlvTWltZVR5cGUgPSBcXFwiYXVkaW8vbXA0XFxcIjtcXG4gICAgfVxcbiAgICAvLyBDcmVhdGUgYSBuZXcgTWVkaWFSZWNvcmRlciBvYmplY3QgdXNpbmcgdGhlIHN0cmVhbSBhbmQgc3BlY2lmeWluZyB0aGUgTUlNRSB0eXBlXFxuICAgIHZhciBvcHRpb25zID0ge1xcbiAgICAgIG1pbWVUeXBlOiBhdWRpb01pbWVUeXBlXFxuICAgIH07XFxuICAgIG1lZGlhUmVjb3JkZXIgPSBuZXcgTWVkaWFSZWNvcmRlcihzdHJlYW0sIG9wdGlvbnMpO1xcblxcbiAgICAvLyBMaXN0ZW4gZm9yIHRoZSAnZGF0YWF2YWlsYWJsZScgZXZlbnRcXG4gICAgbWVkaWFSZWNvcmRlci5hZGRFdmVudExpc3RlbmVyKFxcXCJkYXRhYXZhaWxhYmxlXFxcIiwgaGFuZGxlRGF0YUF2YWlsYWJsZSk7XFxuXFxuICAgIC8vIExpc3RlbiBmb3IgdGhlICdzdG9wJyBldmVudFxcbiAgICBtZWRpYVJlY29yZGVyLmFkZEV2ZW50TGlzdGVuZXIoXFxcInN0b3BcXFwiLCBoYW5kbGVTdG9wKTtcXG4gIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xcbiAgICAvLyBJbnZva2UgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uXFxuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFxcXCJmdW5jdGlvblxcXCIpIHtcXG4gICAgICBjYWxsYmFjaygpO1xcbiAgICB9XFxuICB9KVtcXFwiY2F0Y2hcXFwiXShmdW5jdGlvbiAoZXJyKSB7XFxuICAgIGNvbnNvbGUuZXJyb3IoXFxcIkVycm9yIGdldHRpbmcgYXVkaW8gc3RyZWFtOiBcXFwiICsgZXJyKTtcXG4gIH0pO1xcbn1cXG5mdW5jdGlvbiB0ZWFyRG93blJlY29yZGluZygpIHtcXG4gIC8vIENoZWNrIGlmIHRoZSBNZWRpYVJlY29yZGVyIGlzIHNldCB1cFxcbiAgaWYgKCFtZWRpYVJlY29yZGVyKSB7XFxuICAgIHJldHVybjtcXG4gIH1cXG5cXG4gIC8vIFN0b3AgYW55IG9uZ29pbmcgcmVjb3JkaW5nXFxuICBpZiAobWVkaWFSZWNvcmRlci5zdGF0ZSA9PT0gXFxcInJlY29yZGluZ1xcXCIpIHtcXG4gICAgbWVkaWFSZWNvcmRlci5zdG9wKCk7XFxuICB9XFxuXFxuICAvLyBSZW1vdmUgdGhlIE1lZGlhUmVjb3JkZXIncyBldmVudCBsaXN0ZW5lcnNcXG4gIG1lZGlhUmVjb3JkZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihcXFwiZGF0YWF2YWlsYWJsZVxcXCIsIGhhbmRsZURhdGFBdmFpbGFibGUpO1xcbiAgbWVkaWFSZWNvcmRlci5yZW1vdmVFdmVudExpc3RlbmVyKFxcXCJzdG9wXFxcIiwgaGFuZGxlU3RvcCk7XFxuXFxuICAvLyBDbGVhciB0aGUgTWVkaWFSZWNvcmRlciB2YXJpYWJsZVxcbiAgbWVkaWFSZWNvcmRlciA9IG51bGw7XFxufVxcblxcbi8vIFRvIHJlcXVlc3QgcmVjb3JkaW5nLCBvdGhlciBtb2R1bGVzIGNhbiBkaXNwYXRjaCBhIGN1c3RvbSBldmVudCBhdWRpbzpzdGFydFJlY29yZGluZ1xcbmZ1bmN0aW9uIHN0YXJ0UmVjb3JkaW5nKCkge1xcbiAgLy8gQ2hlY2sgaWYgdGhlIE1lZGlhUmVjb3JkZXIgaXMgc2V0IHVwXFxuICBpZiAoIW1lZGlhUmVjb3JkZXIpIHtcXG4gICAgc2V0dXBSZWNvcmRpbmcoc3RhcnRSZWNvcmRpbmcpO1xcbiAgICByZXR1cm47XFxuICB9XFxuICAvLyBDaGVjayBpZiBQaSBpcyBjdXJyZW50bHkgc3BlYWtpbmcgYW5kIHN0b3AgaGVyIGF1ZGlvXFxuICBpZiAocGlBdWRpb01hbmFnZXIuaXNTcGVha2luZykge1xcbiAgICBwaUF1ZGlvTWFuYWdlci5wYXVzZSgpO1xcbiAgfVxcblxcbiAgLy8gU3RhcnQgcmVjb3JkaW5nXFxuICBtZWRpYVJlY29yZGVyLnN0YXJ0KCk7XFxuXFxuICAvLyBSZWNvcmQgdGhlIHN0YXJ0IHRpbWVcXG4gIHdpbmRvdy5zdGFydFRpbWUgPSBEYXRlLm5vdygpO1xcbiAgZGlzcGF0Y2hDdXN0b21FdmVudChcXFwic2F5cGk6dXNlclNwZWFraW5nXFxcIik7XFxufVxcblxcbi8vIFRvIHN0b3AgcmVjb3JkaW5nLCBvdGhlciBtb2R1bGVzIGNhbiBkaXNwYXRjaCBhIGN1c3RvbSBldmVudCBhdWRpbzpzdG9wUmVjb3JkaW5nXFxuZnVuY3Rpb24gc3RvcFJlY29yZGluZygpIHtcXG4gIGlmIChtZWRpYVJlY29yZGVyICYmIG1lZGlhUmVjb3JkZXIuc3RhdGUgPT09IFxcXCJyZWNvcmRpbmdcXFwiKSB7XFxuICAgIC8vIFN0b3AgcmVjb3JkaW5nXFxuICAgIG1lZGlhUmVjb3JkZXIuc3RvcCgpO1xcblxcbiAgICAvLyBSZWNvcmQgdGhlIHN0b3AgdGltZSBhbmQgY2FsY3VsYXRlIHRoZSBkdXJhdGlvblxcbiAgICB2YXIgc3RvcFRpbWUgPSBEYXRlLm5vdygpO1xcbiAgICB2YXIgZHVyYXRpb24gPSBzdG9wVGltZSAtIHdpbmRvdy5zdGFydFRpbWU7XFxuXFxuICAgIC8vIElmIHRoZSBkdXJhdGlvbiBpcyBsZXNzIHRoYW4gdGhlIHRocmVzaG9sZCwgZG9uJ3QgdXBsb2FkIHRoZSBhdWRpbyBmb3IgdHJhbnNjcmlwdGlvblxcbiAgICBpZiAoZHVyYXRpb24gPCB0aHJlc2hvbGQpIHtcXG4gICAgICBjb25zb2xlLmxvZyhcXFwiUmVjb3JkaW5nIHdhcyB0b28gc2hvcnQsIG5vdCB1cGxvYWRpbmcgZm9yIHRyYW5zY3JpcHRpb25cXFwiKTtcXG4gICAgICBkaXNwYXRjaEN1c3RvbUV2ZW50KFxcXCJzYXlwaTp1c2VyU3RvcHBlZFNwZWFraW5nXFxcIik7XFxuICAgICAgcGlBdWRpb01hbmFnZXIucmVzdW1lKCk7XFxuICAgIH0gZWxzZSB7XFxuICAgICAgcGlBdWRpb01hbmFnZXIuc3RvcCgpO1xcbiAgICAgIGRpc3BhdGNoQ3VzdG9tRXZlbnQoXFxcInNheXBpOnVzZXJGaW5pc2hlZFNwZWFraW5nXFxcIik7XFxuICAgIH1cXG4gIH1cXG59XFxuZnVuY3Rpb24gcmVnaXN0ZXJDdXN0b21BdWRpb0V2ZW50TGlzdGVuZXJzKCkge1xcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXFxcImF1ZGlvOnNldHVwUmVjb3JkaW5nXFxcIiwgZnVuY3Rpb24gKGUpIHtcXG4gICAgc2V0dXBSZWNvcmRpbmcoKTtcXG4gIH0pO1xcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXFxcImF1ZGlvOnRlYXJEb3duUmVjb3JkaW5nXFxcIiwgZnVuY3Rpb24gKGUpIHtcXG4gICAgdGVhckRvd25SZWNvcmRpbmcoKTtcXG4gIH0pO1xcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXFxcImF1ZGlvOnN0YXJ0UmVjb3JkaW5nXFxcIiwgZnVuY3Rpb24gKGUpIHtcXG4gICAgc3RhcnRSZWNvcmRpbmcoKTtcXG4gIH0pO1xcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXFxcImF1ZGlvOnN0b3BSZWNvcmRpbmdcXFwiLCBmdW5jdGlvbiAoZSkge1xcbiAgICBzdG9wUmVjb3JkaW5nKCk7XFxuICB9KTtcXG59XFxucmVnaXN0ZXJDdXN0b21BdWRpb0V2ZW50TGlzdGVuZXJzKCk7XCI7IiwiZXhwb3J0IGRlZmF1bHQgXCI8P3htbCB2ZXJzaW9uPVxcXCIxLjBcXFwiIGVuY29kaW5nPVxcXCJVVEYtOFxcXCI/PlxcbjxzdmcgaWQ9XFxcIkxheWVyXzFcXFwiIGRhdGEtbmFtZT1cXFwiTGF5ZXIgMVxcXCIgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMzA3IDY0MFxcXCI+XFxuICA8ZGVmcz5cXG4gICAgPHN0eWxlPlxcbiAgICAgIC5pbm5lcm1vc3QsIC5zZWNvbmQsIC50aGlyZCwgLmZvdXJ0aCwgLmZpZnRoLCAub3V0ZXJtb3N0IHtcXG4gICAgICAgIHN0cm9rZS13aWR0aDogMHB4O1xcbiAgICAgIH1cXG4gICAgICBcXG4gICAgICAub3V0ZXJtb3N0IHtcXG4gICAgICAgIGZpbGw6ICNlNGYyZDE7XFxuICAgICAgfVxcblxcbiAgICAgIC5zZWNvbmQge1xcbiAgICAgICAgZmlsbDogI2NjZThiNTtcXG4gICAgICB9XFxuXFxuICAgICAgLnRoaXJkIHtcXG4gICAgICAgIGZpbGw6ICNiM2RiOTU7XFxuICAgICAgfVxcblxcbiAgICAgIC5mb3VydGgge1xcbiAgICAgICAgZmlsbDogIzliZDA3ODtcXG4gICAgICB9XFxuXFxuICAgICAgLmZpZnRoIHtcXG4gICAgICAgIGZpbGw6ICM4M2M1NWM7XFxuICAgICAgfVxcblxcbiAgICAgIC5pbm5lcm1vc3Qge1xcbiAgICAgICAgZmlsbDogIzQyOGEyZjtcXG4gICAgICB9XFxuICAgIDwvc3R5bGU+XFxuICA8L2RlZnM+XFxuICA8cGF0aCBjbGFzcz1cXFwib3V0ZXJtb3N0XFxcIiBkPVxcXCJtMzA2LjksMzIwYzAsMTA1LjMtLjAyLDIxMC42LjEsMzE1LjkxLDAsMy40Mi0uNjcsNC4xLTQuMDksNC4wOS05OS42LS4xMi0xOTkuMjEtLjEyLTI5OC44MSwwQy42Nyw2NDAsMCw2MzkuMzMsMCw2MzUuOTEuMTEsNDI1LjMuMTEsMjE0LjcsMCw0LjA5LDAsLjY3LjY3LDAsNC4wOSwwLDEwMy43LjEyLDIwMy4zLjEyLDMwMi45MSwwYzMuNDIsMCw0LjEuNjcsNC4wOSw0LjA5LS4xMiwxMDUuMy0uMSwyMTAuNi0uMSwzMTUuOTFaXFxcIi8+XFxuICA8cGF0aCBjbGFzcz1cXFwic2Vjb25kXFxcIiBkPVxcXCJtMjc1LjkyLDMyM2MwLDg3LjYzLDAsMTc1LjI3LDAsMjYyLjksMCw3LjI0LS41NSw3LjkzLTcuODYsNy45OC0xNC42Ni4wOS0yOS4zMS4wMy00My45Ny4wMy02MC45NiwwLTEyMS45MiwwLTE4Mi44OCwwcS03LjEzLDAtNy4xNC03LjI0YzAtMTc2LjEsMC0zNTIuMjEsMC01MjguMzFxMC03LjI2LDcuMTItNy4yNmM3NS43OCwwLDE1MS41NiwwLDIyNy4zNSwwcTcuMzgsMCw3LjM4LDcuNWMwLDg4LjEzLDAsMTc2LjI3LDAsMjY0LjRaXFxcIi8+XFxuICA8cGF0aCBjbGFzcz1cXFwidGhpcmRcXFwiIGQ9XFxcIm02OC4wNiwzMjIuMjRjMC02OS40NywwLTEzOC45NCwwLTIwOC40MSwwLTguOTksMS4zMy0xMC4xMywxMC40OS05LjEyLDEuOTguMjIsMy45OC4zMiw1Ljk3LjMyLDQ2LjEzLjAyLDkyLjI2LjAyLDEzOC4zOSwwLDMuNDgsMCw2LjkyLS4yMywxMC40MS0uNjcsNS41LS43LDguNzQuNDYsOC43Myw3LjI1LS4xOCwxMzguOTQtLjEzLDI3Ny44OC0uMTMsNDE2LjgxLDAsLjMzLDAsLjY3LDAsMXEtLjE0LDEwLjUxLTEwLjM5LDEwLjUxYy01Mi4xMywwLTEwNC4yNSwwLTE1Ni4zOCwwcS03LjA5LDAtNy4wOS03LjI4YzAtNzAuMTQsMC0xNDAuMjcsMC0yMTAuNDFaXFxcIi8+XFxuICA8cGF0aCBjbGFzcz1cXFwiZm91cnRoXFxcIiBkPVxcXCJtMTAzLjAyLDMyMi41YzAtNTIuNDYsMC0xMDQuOTEsMC0xNTcuMzcsMC02LjY4LjM2LTcuMDYsNy4wNy03LjA2LDMwLjMtLjAxLDYwLjYuMDcsOTAuOS0uMDksNC41NC0uMDIsNi4wOCwxLjMzLDYuMDcsNS45OC0uMSwxMDUuNTgtLjEsMjExLjE2LDAsMzE2Ljc0LDAsNC4xOC0xLjI3LDUuMzctNS4zOCw1LjM1LTI5LjMtLjE1LTU4LjYtLjA4LTg3LjktLjA4cS0xMC43NiwwLTEwLjc2LTExLjA5YzAtNTAuNzksMC0xMDEuNTgsMC0xNTIuMzdaXFxcIi8+XFxuICA8cGF0aCBjbGFzcz1cXFwiZmlmdGhcXFwiIGQ9XFxcIm0xNzMsMzIyLjJjMCwzNS4yOSwwLDcwLjU4LDAsMTA1Ljg4cTAsNi44OS02Ljk5LDYuOWMtOC4xNSwwLTE2LjMxLS4xMy0yNC40Ni4wNi0zLjQ3LjA4LTQuNjgtMS4wOS00LjYxLTQuNTkuMTgtOS42NS4wNi0xOS4zMS4wNi0yOC45NiwwLTU4LjI2LS4wMS0xMTYuNTMuMDItMTc0Ljc5LDAtNC43Ni0xLjEyLTkuNDYtLjE0LTE0LjMuNTEtMi41NCwxLjM5LTMuMzgsMy44LTMuMzYsOC44Mi4wNiwxNy42NC4xNCwyNi40Ni0uMDIsNC41OS0uMDksNS45NSwxLjg1LDUuOTQsNi4zMy0uMTQsMzUuNjItLjA4LDcxLjI1LS4wOCwxMDYuODdaXFxcIi8+XFxuICA8cGF0aCBjbGFzcz1cXFwiaW5uZXJtb3N0XFxcIiBkPVxcXCJtMTUxLjA0LDMyMi4wMWMwLTkuOTkuMDctMTkuOTctLjA1LTI5Ljk2LS4wNC0yLjkzLjgzLTQuMTgsMy45NS00LjE4LDMuMDYsMCw0LjAzLDEuMTIsNC4wMiw0LjExLS4wOSwxOS45Ny0uMDgsMzkuOTQuMDEsNTkuOTEuMDEsMi45Ni0uODQsNC4xNi0zLjk2LDQuMTQtMy4wMy0uMDEtNC4wOC0xLjA0LTQuMDMtNC4wOC4xNC05Ljk4LjA1LTE5Ljk3LjA1LTI5Ljk2WlxcXCIvPlxcbjwvc3ZnPlwiOyIsImV4cG9ydCBkZWZhdWx0IFwiPHN2ZyB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIHZlcnNpb249XFxcIjEuMFxcXCIgdmlld0JveD1cXFwiMCAwIDU2LjI1IDMwXFxcIiBjbGFzcz1cXFwid2F2ZWZvcm1cXFwiPlxcbiAgICA8ZGVmcz5cXG4gICAgICAgIDxjbGlwUGF0aCBpZD1cXFwiYVxcXCI+XFxuICAgICAgICAgICAgPHBhdGggZD1cXFwiTS41NCAxMkgzdjVILjU0Wm0wIDBcXFwiLz5cXG4gICAgICAgIDwvY2xpcFBhdGg+XFxuICAgICAgICA8Y2xpcFBhdGggaWQ9XFxcImJcXFwiPlxcbiAgICAgICAgICAgIDxwYXRoIGQ9XFxcIk0yNSAyLjJoMnYyNC42OGgtMlptMCAwXFxcIi8+XFxuICAgICAgICA8L2NsaXBQYXRoPlxcbiAgICAgICAgPGNsaXBQYXRoIGlkPVxcXCJjXFxcIj5cXG4gICAgICAgICAgICA8cGF0aCBkPVxcXCJNNTMgMTJoMS45OHY1SDUzWm0wIDBcXFwiLz5cXG4gICAgICAgIDwvY2xpcFBhdGg+XFxuICAgIDwvZGVmcz5cXG4gICAgPGcgY2xpcC1wYXRoPVxcXCJ1cmwoI2EpXFxcIj5cXG4gICAgICAgIDxwYXRoIGQ9XFxcIk0xLjQ4IDEyLjcxYy0uNSAwLS45LjQtLjkuOXYxLjg1YS45LjkgMCAwIDAgMS44IDB2LTEuODRjMC0uNS0uNC0uOS0uOS0uOVptMCAwXFxcIi8+XFxuICAgIDwvZz5cXG4gICAgPHBhdGggZD1cXFwiTTQuOTggNi42M2MtLjUgMC0uOS40LS45Ljl2MTQuMDFhLjkuOSAwIDAgMCAxLjgxIDB2LTE0YzAtLjUtLjQtLjkyLS45LS45MlptMy41MSAzLjFhLjkuOSAwIDAgMC0uOS45MXY3Ljc5YS45LjkgMCAwIDAgMS44IDB2LTcuNzljMC0uNS0uNC0uOS0uOS0uOVpNMTIgMy44M2EuOS45IDAgMCAwLS45MS45djE5LjZhLjkuOSAwIDAgMCAxLjggMFY0Ljc0YzAtLjUtLjQtLjktLjktLjlabTMuNSA4LjI5YS45LjkgMCAwIDAtLjkxLjl2My4wM2EuOS45IDAgMCAwIDEuODEgMHYtMy4wM2MwLS41LS40LS45LS45LS45Wk0xOSA2LjhjLS41IDAtLjkuNC0uOS45djEzLjY4YS45LjkgMCAwIDAgMS44IDBWNy43YzAtLjUtLjQtLjktLjktLjlabTMuNTgtMi45N2gtLjAxYy0uNSAwLS45LjQtLjkuOWwtLjEzIDE5LjZjMCAuNS40LjkuOS45MS41IDAgLjktLjQuOS0uOWwuMTQtMTkuNmEuOS45IDAgMCAwLS45LS45Wm0wIDBcXFwiLz5cXG4gICAgPGcgY2xpcC1wYXRoPVxcXCJ1cmwoI2IpXFxcIj5cXG4gICAgICAgIDxwYXRoIGQ9XFxcIk0yNiAyLjJjLS41IDAtLjkuNC0uOS45djIyLjg2YS45LjkgMCAxIDAgMS44MSAwVjMuMTFhLjkuOSAwIDAgMC0uOS0uOTFabTAgMFxcXCIvPlxcbiAgICA8L2c+XFxuICAgIDxwYXRoIGQ9XFxcIk0yOS41MiA3LjcxYS45LjkgMCAwIDAtLjkxLjl2MTEuODVhLjkuOSAwIDAgMCAxLjgxIDBWOC42MmMwLS41LS40LS45LS45LS45Wm0zLjUgMi45M2EuOS45IDAgMCAwLS45LjkxdjUuOTdhLjkuOSAwIDAgMCAxLjggMHYtNS45N2MwLS41LS40LS45LS45LS45Wm0zLjUtNS43OGMtLjUgMC0uOS40LS45Ljl2MTcuNTVhLjkuOSAwIDAgMCAxLjgxIDBWNS43NmMwLS41LS40LS45LS45LS45Wm0zLjUxIDMuMzRjLS41IDAtLjkuNC0uOS45djEwLjg3YS45LjkgMCAwIDAgMS44IDBWOS4xYS45LjkgMCAwIDAtLjktLjkxWm0zLjUgMy4wOGMtLjUgMC0uOS40LS45LjkxdjQuN2EuOS45IDAgMSAwIDEuOCAwdi00LjdhLjkuOSAwIDAgMC0uOS0uOVptMy41MS03LjQ1YS45LjkgMCAwIDAtLjkxLjl2MTkuNmEuOS45IDAgMCAwIDEuODEgMFY0Ljc0YzAtLjUtLjQtLjktLjktLjlabTMuNSA1LjU3YS45LjkgMCAwIDAtLjkuOTF2OC40NWEuOS45IDAgMCAwIDEuOCAwdi04LjQ1YzAtLjUtLjQtLjktLjktLjlabTAgMFxcXCIvPlxcbiAgICA8ZyBjbGlwLXBhdGg9XFxcInVybCgjYylcXFwiPlxcbiAgICAgICAgPHBhdGggZD1cXFwiTTU0LjA0IDEyLjk2YS45LjkgMCAwIDAtLjkuOTF2MS4zM2EuOS45IDAgMSAwIDEuOCAwdi0xLjMyYS45LjkgMCAwIDAtLjktLjkyWm0wIDBcXFwiLz5cXG4gICAgPC9nPlxcbjwvc3ZnPlwiOyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9yZWN0YW5nbGVzLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vcmVjdGFuZ2xlcy5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vdGFsa0J1dHRvbi5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3RhbGtCdXR0b24uY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cnVsZVNldFsxXS5ydWxlc1szXS51c2VbMV0hLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9ydWxlU2V0WzFdLnJ1bGVzWzNdLnVzZVsyXSEuL21vYmlsZS5zY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3J1bGVTZXRbMV0ucnVsZXNbM10udXNlWzFdIS4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cnVsZVNldFsxXS5ydWxlc1szXS51c2VbMl0hLi9tb2JpbGUuc2Nzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiaW1wb3J0IEJ1dHRvbk1vZHVsZSBmcm9tIFwiLi9CdXR0b25Nb2R1bGUuanNcIjtcbmltcG9ydCBFdmVudE1vZHVsZSBmcm9tIFwiLi9FdmVudE1vZHVsZS5qc1wiO1xuaW1wb3J0IFwiLi90YWxrQnV0dG9uLmNzc1wiO1xuaW1wb3J0IFwiLi9tb2JpbGUuc2Nzc1wiO1xuaW1wb3J0IFwiLi9yZWN0YW5nbGVzLmNzc1wiO1xuaW1wb3J0IHRhbGtJY29uU1ZHIGZyb20gXCIuL3dhdmVmb3JtLnN2Z1wiO1xuaW1wb3J0IHJlY3RhbmdsZXNTVkcgZnJvbSBcIi4vcmVjdGFuZ2xlcy5zdmdcIjtcbihmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIGNvbnN0IGJ1dHRvbk1vZHVsZSA9IG5ldyBCdXR0b25Nb2R1bGUoKTtcblxuICBjb25zdCBsb2NhbENvbmZpZyA9IHtcbiAgICBhcHBTZXJ2ZXJVcmw6IFwiaHR0cDovL2xvY2FsaG9zdDozMDAwXCIsXG4gICAgYXBpU2VydmVyVXJsOiBcImh0dHBzOi8vbG9jYWxob3N0OjUwMDBcIixcbiAgICAvLyBBZGQgb3RoZXIgY29uZmlndXJhdGlvbiBwcm9wZXJ0aWVzIGFzIG5lZWRlZFxuICB9O1xuXG4gIC8vIERlZmluZSBhIGdsb2JhbCBjb25maWd1cmF0aW9uIHByb3BlcnR5XG4gIGNvbnN0IHByb2R1Y3Rpb25Db25maWcgPSB7XG4gICAgYXBwU2VydmVyVXJsOiBcImh0dHBzOi8vYXBwLnNheXBpLmFpXCIsXG4gICAgYXBpU2VydmVyVXJsOiBcImh0dHBzOi8vYXBpLnNheXBpLmFpXCIsXG4gICAgLy8gQWRkIG90aGVyIGNvbmZpZ3VyYXRpb24gcHJvcGVydGllcyBhcyBuZWVkZWRcbiAgfTtcbiAgY29uc3QgY29uZmlnID0gcHJvZHVjdGlvbkNvbmZpZztcblxuICBjb25zdCBwYWdlU2NyaXB0ID0gcmVxdWlyZShcInJhdy1sb2FkZXIhLi90cmFuc2NyaWJlci5qc1wiKS5kZWZhdWx0O1xuICBhZGRVc2VyQWdlbnRGbGFncygpO1xuICBFdmVudE1vZHVsZS5pbml0KCk7XG5cbiAgLy8gQ3JlYXRlIGEgTXV0YXRpb25PYnNlcnZlciB0byBsaXN0ZW4gZm9yIGNoYW5nZXMgdG8gdGhlIERPTVxuICB2YXIgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAobXV0YXRpb25zKSB7XG4gICAgLy8gQ2hlY2sgZWFjaCBtdXRhdGlvblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbXV0YXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbXV0YXRpb24gPSBtdXRhdGlvbnNbaV07XG5cbiAgICAgIC8vIElmIG5vZGVzIHdlcmUgYWRkZWQsIGNoZWNrIGVhY2ggb25lXG4gICAgICBpZiAobXV0YXRpb24uYWRkZWROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbXV0YXRpb24uYWRkZWROb2Rlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgIHZhciBub2RlID0gbXV0YXRpb24uYWRkZWROb2Rlc1tqXTtcblxuICAgICAgICAgIC8vIElmIHRoZSBub2RlIGlzIHRoZSBhcHByb3ByaWF0ZSBjb250YWluZXIgZWxlbWVudCwgYWRkIHRoZSBidXR0b24gYW5kIHN0b3Agb2JzZXJ2aW5nXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgbm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImRpdlwiICYmXG4gICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5jb250YWlucyhcImZpeGVkXCIpICYmXG4gICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5jb250YWlucyhcImJvdHRvbS0xNlwiKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgdmFyIGZvb3RlciA9IG5vZGU7XG4gICAgICAgICAgICB2YXIgYnV0dG9uQ29udGFpbmVyID0gZm9vdGVyLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgICAgIFwiLnJlbGF0aXZlLmZsZXguZmxleC1jb2xcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChidXR0b25Db250YWluZXIpIHtcbiAgICAgICAgICAgICAgYWRkVGFsa0J1dHRvbihidXR0b25Db250YWluZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiTm8gYnV0dG9uIGNvbnRhaW5lciBmb3VuZCBpbiBmb290ZXJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWFubm90YXRlRE9NKCkpIHtcbiAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiUmVxdWlyZWQgZWxlbWVudHMgbm90IGZvdW5kIGluIERPTVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIGFubm90YXRlRE9NKCkge1xuICAgIC8vIEFkZCBhbiBJRCB0byB0aGUgcHJvbXB0IHRleHRhcmVhXG4gICAgY29uc3QgZm91bmRQcm9tcHQgPSBhZGRJZFByb21wdFRleHRBcmVhKCk7XG4gICAgY29uc3QgZm91bmRGb290ZXIgPSBhZGRJZEZvb3RlcigpO1xuICAgIHJldHVybiBmb3VuZFByb21wdCAmJiBmb3VuZEZvb3RlcjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZElkUHJvbXB0VGV4dEFyZWEoKSB7XG4gICAgdmFyIHRleHRhcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS1wcm9tcHRcIik7XG4gICAgaWYgKCF0ZXh0YXJlYSkge1xuICAgICAgLy8gRmluZCB0aGUgZmlyc3QgPHRleHRhcmVhPiBlbGVtZW50IGFuZCBnaXZlIGl0IGFuIGlkXG4gICAgICB2YXIgdGV4dGFyZWFFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInRleHRhcmVhXCIpO1xuICAgICAgaWYgKHRleHRhcmVhRWxlbWVudCkge1xuICAgICAgICB0ZXh0YXJlYUVsZW1lbnQuaWQgPSBcInNheXBpLXByb21wdFwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiTm8gPHRleHRhcmVhPiBlbGVtZW50IGZvdW5kXCIpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkSWRGb290ZXIoKSB7XG4gICAgLy8gRmluZCBhbGwgYXVkaW8gZWxlbWVudHMgb24gdGhlIHBhZ2VcbiAgICB2YXIgYXVkaW9FbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJhdWRpb1wiKTtcbiAgICB2YXIgZm91bmQgPSBmYWxzZTsgLy8gZGVmYXVsdCB0byBub3QgZm91bmRcblxuICAgIGF1ZGlvRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoYXVkaW8pIHtcbiAgICAgIHZhciBwcmVjZWRpbmdEaXYgPSBhdWRpby5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuXG4gICAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGZvdW5kIGEgZGl2LCB3ZSBjYW4gc2tpcCBmdXJ0aGVyIGl0ZXJhdGlvbnNcbiAgICAgIGlmIChmb3VuZCkgcmV0dXJuO1xuXG4gICAgICAvLyBDaGVjayBpZiB0aGUgcHJlY2VkaW5nIGVsZW1lbnQgaXMgYSBkaXZcbiAgICAgIGlmIChwcmVjZWRpbmdEaXYgJiYgcHJlY2VkaW5nRGl2LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJkaXZcIikge1xuICAgICAgICAvLyBBc3NpZ24gYW4gSUQgdG8gdGhlIGRpdlxuICAgICAgICBwcmVjZWRpbmdEaXYuaWQgPSBcInNheXBpLWZvb3RlclwiO1xuICAgICAgICBmb3VuZCA9IHRydWU7IC8vIHNldCB0byBmb3VuZFxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGZvdW5kO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5qZWN0U2NyaXB0KGNhbGxiYWNrKSB7XG4gICAgdmFyIHNjcmlwdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgIHNjcmlwdEVsZW1lbnQudHlwZSA9IFwidGV4dC9qYXZhc2NyaXB0XCI7XG4gICAgc2NyaXB0RWxlbWVudC5pZCA9IFwic2F5cGktc2NyaXB0XCI7XG4gICAgY29uc3QgY29uZmlnVGV4dCA9IFwidmFyIGNvbmZpZyA9IFwiICsgSlNPTi5zdHJpbmdpZnkoY29uZmlnKSArIFwiO1wiO1xuICAgIHNjcmlwdEVsZW1lbnQudGV4dENvbnRlbnQgPSBjb25maWdUZXh0ICsgcGFnZVNjcmlwdDtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdEVsZW1lbnQpO1xuXG4gICAgLy8gQ2FsbCB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gYWZ0ZXIgdGhlIHNjcmlwdCBpcyBhZGRlZFxuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpc01vYmlsZVZpZXcoKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5tYXRjaE1lZGlhKFwiKG1heC13aWR0aDogNzY4cHgpXCIpLm1hdGNoZXM7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRUYWxrQnV0dG9uKGNvbnRhaW5lcikge1xuICAgIC8vIGNyZWF0ZSBhIGNvbnRhaW5pbmcgZGl2XG4gICAgdmFyIHBhbmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBwYW5lbC5pZCA9IFwic2F5cGktcGFuZWxcIjtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQocGFuZWwpO1xuXG4gICAgLy8gQ3JlYXRlIHRoZSB0YWxrIGJ1dHRvbiB1c2luZyBCdXR0b25Nb2R1bGVcbiAgICBjb25zdCBsYWJlbCA9XG4gICAgICBcIlRhbGsgKEhvbGQgQ29udHJvbCArIFNwYWNlIHRvIHVzZSBob3RrZXkuIERvdWJsZSBjbGljayB0byB0b2dnbGUgYXV0by1zdWJtaXQgb24vb2ZmKVwiO1xuICAgIHZhciBidXR0b24gPSBidXR0b25Nb2R1bGUuY3JlYXRlQnV0dG9uKFwiXCIsICgpID0+IHt9KTsgLy8gVGhlIGNhbGxiYWNrIGlzIGVtcHR5IGZvciBub3csIGJ1dCB5b3UgY2FuIGFkZCBmdW5jdGlvbmFsaXRpZXMgaWYgbmVlZGVkLlxuXG4gICAgYnV0dG9uLmlkID0gXCJzYXlwaS10YWxrQnV0dG9uXCI7XG4gICAgYnV0dG9uLnR5cGUgPSBcImJ1dHRvblwiO1xuXG4gICAgLy8gU2V0IEFSSUEgbGFiZWwgYW5kIHRvb2x0aXBcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBsYWJlbCk7XG4gICAgYnV0dG9uLnNldEF0dHJpYnV0ZShcInRpdGxlXCIsIGxhYmVsKTtcblxuICAgIGNvbnN0IGNsYXNzTmFtZXMgPVxuICAgICAgXCJyZWxhdGl2ZSBmbGV4IG10LTEgbWItMSByb3VuZGVkLWZ1bGwgcHgtMiBweS0zIHRleHQtY2VudGVyIGJnLWNyZWFtLTU1MCBob3ZlcjpiZy1jcmVhbS02NTAgaG92ZXI6dGV4dC1icmFuZC1ncmVlbi03MDAgdGV4dC1tdXRlZFwiO1xuICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZXMuc3BsaXQoXCIgXCIpKTtcblxuICAgIC8vIEVuYWJsZSBhdXRvc3VibWl0IGJ5IGRlZmF1bHRcbiAgICBidXR0b24uZGF0YXNldC5hdXRvc3VibWl0ID0gXCJ0cnVlXCI7XG4gICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJhdXRvU3VibWl0XCIpO1xuXG4gICAgcGFuZWwuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgICBhZGRUYWxrSWNvbihidXR0b24pO1xuXG4gICAgLy8gQ2FsbCB0aGUgZnVuY3Rpb24gdG8gaW5qZWN0IHRoZSBzY3JpcHQgYWZ0ZXIgdGhlIGJ1dHRvbiBoYXMgYmVlbiBhZGRlZFxuICAgIGluamVjdFNjcmlwdChyZWdpc3RlckF1ZGlvQnV0dG9uRXZlbnRzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFRhbGtJY29uKGJ1dHRvbikge1xuICAgIHVwZGF0ZUljb25Db250ZW50KGJ1dHRvbik7XG5cbiAgICB3aW5kb3cubWF0Y2hNZWRpYShcIihtYXgtd2lkdGg6IDc2OHB4KVwiKS5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICB1cGRhdGVJY29uQ29udGVudChidXR0b24pO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlSWNvbkNvbnRlbnQoaWNvbkNvbnRhaW5lcikge1xuICAgIGlmIChpc01vYmlsZVZpZXcoKSkge1xuICAgICAgaWNvbkNvbnRhaW5lci5pbm5lckhUTUwgPSByZWN0YW5nbGVzU1ZHO1xuICAgIH0gZWxzZSB7XG4gICAgICBpY29uQ29udGFpbmVyLmlubmVySFRNTCA9IHRhbGtJY29uU1ZHO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFVzZXJBZ2VudEZsYWdzKCkge1xuICAgIHZhciBpc0ZpcmVmb3hBbmRyb2lkID1cbiAgICAgIC9GaXJlZm94Ly50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpICYmXG4gICAgICAvQW5kcm9pZC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgIGlmIChpc0ZpcmVmb3hBbmRyb2lkKSB7XG4gICAgICAvLyBoYWNrIGZvciBGaXJlZm94IG9uIEFuZHJvaWQsIHdoaWNoIGRvZXNuJ3Qgc3VwcG9ydCA6YWN0aXZlIGNvcnJlY3RseVxuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiZmlyZWZveC1hbmRyb2lkXCIpO1xuICAgIH1cblxuICAgIGlmIChpc01vYmlsZVZpZXcoKSkge1xuICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwibW9iaWxlLXZpZXdcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcIm1vYmlsZS12aWV3XCIpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlZ2lzdGVyQXVkaW9CdXR0b25FdmVudHMoKSB7XG4gICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS10YWxrQnV0dG9uXCIpO1xuXG4gICAgLy8gU2V0dGluZyB0aGUgY29ycmVjdCBjb250ZXh0XG4gICAgbGV0IGNvbnRleHQgPSB3aW5kb3c7XG4gICAgaWYgKEdNX2luZm8uc2NyaXB0SGFuZGxlciAhPT0gXCJVc2Vyc2NyaXB0c1wiKSB7XG4gICAgICBjb250ZXh0ID0gdW5zYWZlV2luZG93O1xuICAgIH1cbiAgICBFdmVudE1vZHVsZS5zZXRDb250ZXh0KGNvbnRleHQpOyAvLyBTZXQgdGhlIGNvbnRleHQgZm9yIEV2ZW50TW9kdWxlXG5cbiAgICAvLyBBdHRhY2ggdGhlIGV2ZW50IGxpc3RlbmVyc1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJtb3VzZWRvd25cIixcbiAgICAgIEV2ZW50TW9kdWxlLmhhbmRsZVRhbGtNb3VzZURvd24uYmluZChFdmVudE1vZHVsZSlcbiAgICApO1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJtb3VzZXVwXCIsXG4gICAgICBFdmVudE1vZHVsZS5oYW5kbGVUYWxrTW91c2VVcC5iaW5kKEV2ZW50TW9kdWxlKVxuICAgICk7XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJkYmxjbGlja1wiLCAoKSA9PlxuICAgICAgRXZlbnRNb2R1bGUuaGFuZGxlVGFsa0RvdWJsZUNsaWNrKGJ1dHRvbilcbiAgICApO1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCAoZSkgPT5cbiAgICAgIEV2ZW50TW9kdWxlLmhhbmRsZVRhbGtUb3VjaFN0YXJ0KGJ1dHRvbiwgZSlcbiAgICApO1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgKCkgPT5cbiAgICAgIEV2ZW50TW9kdWxlLmhhbmRsZVRhbGtUb3VjaEVuZChidXR0b24pXG4gICAgKTtcblxuICAgIEV2ZW50TW9kdWxlLnJlZ2lzdGVyT3RoZXJBdWRpb0J1dHRvbkV2ZW50cyhidXR0b24pO1xuICAgIEV2ZW50TW9kdWxlLnJlZ2lzdGVyQ3VzdG9tQXVkaW9FdmVudExpc3RlbmVycygpO1xuICAgIEV2ZW50TW9kdWxlLnJlZ2lzdGVySG90a2V5KCk7XG4gIH1cblxuICAvLyBTdGFydCBvYnNlcnZpbmcgdGhlIGVudGlyZSBkb2N1bWVudCBmb3IgY2hhbmdlcyB0byBjaGlsZCBub2RlcyBhbmQgc3VidHJlZVxuICBvYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LCB7IGNoaWxkTGlzdDogdHJ1ZSwgc3VidHJlZTogdHJ1ZSB9KTtcbn0pKCk7XG4iXSwibmFtZXMiOlsiQW5pbWF0aW9uTW9kdWxlIiwiX2NsYXNzQ2FsbENoZWNrIiwiX2NyZWF0ZUNsYXNzIiwia2V5IiwidmFsdWUiLCJhbmltYXRlIiwiYW5pbWF0aW9uIiwic3RvcE90aGVyQW5pbWF0aW9ucyIsInJlY3RhbmdsZXMiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJyZWN0YW5nbGVzU2VsZWN0b3IiLCJmb3JFYWNoIiwicmVjdCIsImNsYXNzTGlzdCIsImFkZCIsImluYW5pbWF0ZSIsInJlbW92ZSIsInN0b3BBbGxBbmltYXRpb25zIiwiX3RoaXMiLCJ0YWxrQnV0dG9uQW5pbWF0aW9ucyIsImtlZXBBbmltYXRpb24iLCJfdGhpczIiLCJfZGVmaW5lUHJvcGVydHkiLCJkZWZhdWx0IiwiQnV0dG9uTW9kdWxlIiwicGxheUJ1dHRvbiIsImhhbmRsZVBsYXlCdXR0b25DbGljayIsImJpbmQiLCJyZWdpc3RlckJ1dHRvbkV2ZW50cyIsInJlZ2lzdGVyT3RoZXJFdmVudHMiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwicG9rZVVzZXIiLCJ1bnBva2VVc2VyIiwiZXZlbnROYW1lIiwidGFsa0J1dHRvbiIsImdldEVsZW1lbnRCeUlkIiwiaGFuZGxlQXV0b1N1Ym1pdCIsImNyZWF0ZUJ1dHRvbiIsImxhYmVsIiwiY2FsbGJhY2siLCJidXR0b24iLCJjcmVhdGVFbGVtZW50IiwidGV4dENvbnRlbnQiLCJvbmNsaWNrIiwic3R5bGVCdXR0b24iLCJzdHlsZXMiLCJoYXNPd25Qcm9wZXJ0eSIsInN0eWxlIiwiY3JlYXRlUGxheUJ1dHRvbiIsImlkIiwidHlwZSIsImNsYXNzTmFtZSIsInNldEF0dHJpYnV0ZSIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInNob3dQbGF5QnV0dG9uIiwiaGlkZVBsYXlCdXR0b24iLCJkaXNwYXRjaEN1c3RvbUV2ZW50IiwicGlBdWRpb01hbmFnZXIiLCJ1c2VyUGxheSIsInNpbXVsYXRlRm9ybVN1Ym1pdCIsInRleHRhcmVhIiwiZW50ZXJFdmVudCIsIktleWJvYXJkRXZlbnQiLCJidWJibGVzIiwia2V5Q29kZSIsIndoaWNoIiwiZGlzcGF0Y2hFdmVudCIsImRhdGFzZXQiLCJhdXRvc3VibWl0IiwiY29uc29sZSIsImxvZyIsImlzU2FmYXJpIiwiaXNNb2JpbGVWaWV3IiwiRXZlbnRNb2R1bGUiLCJpbml0IiwiaGFuZGxlQXVkaW9FdmVudHMiLCJjbGVhbnVwIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImhhbmRsZVRyYW5zY3JpcHRpb25SZXNwb25zZSIsImRldGFpbCIsImFyZ3VtZW50cyIsImxlbmd0aCIsInVuZGVmaW5lZCIsImV2ZW50IiwiQ3VzdG9tRXZlbnQiLCJ0cmFuc2NyaXB0aW9uRXZlbnQiLCJ0cmFuc2NyaXB0IiwidGV4dCIsInN1YnN0cmluZyIsIndhcm4iLCJzZXROYXRpdmVWYWx1ZSIsInNpbXVsYXRlVHlwaW5nIiwiZWxlbWVudCIsIndvcmRzIiwic3BsaXQiLCJpIiwidHlwZVdvcmQiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJsYXN0VmFsdWUiLCJFdmVudCIsInRhcmdldCIsInNpbXVsYXRlZCIsInRyYWNrZXIiLCJfdmFsdWVUcmFja2VyIiwic2V0VmFsdWUiLCJoYW5kbGVUYWxrTW91c2VEb3duIiwiaGFuZGxlVGFsa01vdXNlVXAiLCJoYW5kbGVUYWxrRG91YmxlQ2xpY2siLCJ0b2dnbGUiLCJnZXRBdHRyaWJ1dGUiLCJoYW5kbGVUYWxrVG91Y2hTdGFydCIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImhhbmRsZVRhbGtUb3VjaEVuZCIsInNldENvbnRleHQiLCJjdHgiLCJjb250ZXh0IiwicmVnaXN0ZXJPdGhlckF1ZGlvQnV0dG9uRXZlbnRzIiwicmVnaXN0ZXJDdXN0b21BdWRpb0V2ZW50TGlzdGVuZXJzIiwicmVnaXN0ZXJIb3RrZXkiLCJjdHJsRG93biIsImN0cmxLZXkiLCJjb2RlIiwibWF0Y2hNZWRpYSIsIm1hdGNoZXMiLCJ0ZXN0IiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwidGFsa0ljb25TVkciLCJyZWN0YW5nbGVzU1ZHIiwiYnV0dG9uTW9kdWxlIiwibG9jYWxDb25maWciLCJhcHBTZXJ2ZXJVcmwiLCJhcGlTZXJ2ZXJVcmwiLCJwcm9kdWN0aW9uQ29uZmlnIiwiY29uZmlnIiwicGFnZVNjcmlwdCIsInJlcXVpcmUiLCJhZGRVc2VyQWdlbnRGbGFncyIsIm9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsIm11dGF0aW9ucyIsIm11dGF0aW9uIiwiYWRkZWROb2RlcyIsImoiLCJub2RlIiwibm9kZU5hbWUiLCJ0b0xvd2VyQ2FzZSIsImNvbnRhaW5zIiwiZm9vdGVyIiwiYnV0dG9uQ29udGFpbmVyIiwicXVlcnlTZWxlY3RvciIsImFkZFRhbGtCdXR0b24iLCJhbm5vdGF0ZURPTSIsImRpc2Nvbm5lY3QiLCJmb3VuZFByb21wdCIsImFkZElkUHJvbXB0VGV4dEFyZWEiLCJmb3VuZEZvb3RlciIsImFkZElkRm9vdGVyIiwidGV4dGFyZWFFbGVtZW50IiwiYXVkaW9FbGVtZW50cyIsImZvdW5kIiwiYXVkaW8iLCJwcmVjZWRpbmdEaXYiLCJwcmV2aW91c0VsZW1lbnRTaWJsaW5nIiwidGFnTmFtZSIsImluamVjdFNjcmlwdCIsInNjcmlwdEVsZW1lbnQiLCJjb25maWdUZXh0IiwiSlNPTiIsInN0cmluZ2lmeSIsImNvbnRhaW5lciIsInBhbmVsIiwiY2xhc3NOYW1lcyIsImFkZFRhbGtJY29uIiwicmVnaXN0ZXJBdWRpb0J1dHRvbkV2ZW50cyIsInVwZGF0ZUljb25Db250ZW50IiwiYWRkTGlzdGVuZXIiLCJpY29uQ29udGFpbmVyIiwiaW5uZXJIVE1MIiwiaXNGaXJlZm94QW5kcm9pZCIsImRvY3VtZW50RWxlbWVudCIsIkdNX2luZm8iLCJzY3JpcHRIYW5kbGVyIiwidW5zYWZlV2luZG93Iiwib2JzZXJ2ZSIsImNoaWxkTGlzdCIsInN1YnRyZWUiXSwic291cmNlUm9vdCI6IiJ9