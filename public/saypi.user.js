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
      } else {
        EventModule.simulateTyping(textarea, transcript + " ");
      }
      EventModule.dispatchCustomEvent("saypi:autoSubmit");
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
          return;
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
  #saypi-panel,
  .play-button {
    width: 100%;
    position: fixed;
    left: 0;
    background-color: rgba(245, 238, 223, 0.98);
  }
  #saypi-panel,
  .play-button {
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
`, "",{"version":3,"sources":["webpack://./src/mobile.css"],"names":[],"mappings":"AAAA;EACE,0BAA0B;EAC1B;;IAEE,WAAW;IACX,eAAe;IACf,OAAO;IACP,2CAA2C;EAC7C;EACA;;IAEE,aAAa;IACb,MAAM;IACN,WAAW;EACb;EACA,qCAAqC;EACrC;IACE,WAAW;IACX,YAAY;IACZ,6BAA6B;IAC7B,gBAAgB;IAChB,SAAS;EACX;EACA,kEAAkE;EAClE;;IAEE,mBAAmB;IACnB,WAAW;EACb;EACA,2CAA2C;EAC3C;;IAEE,8BAA8B;IAC9B,WAAW;EACb;EACA,gBAAgB;EAChB;IACE,aAAa;EACf;AACF","sourcesContent":["@media (max-width: 768px) {\n  /* mobile styles go here */\n  #saypi-panel,\n  .play-button {\n    width: 100%;\n    position: fixed;\n    left: 0;\n    background-color: rgba(245, 238, 223, 0.98);\n  }\n  #saypi-panel,\n  .play-button {\n    height: 100vh;\n    top: 0;\n    padding: 5%;\n  }\n  /* make the buttons fill the panels */\n  #saypi-talkButton {\n    width: 100%;\n    height: 100%;\n    background-color: transparent;\n    border-radius: 0;\n    margin: 0;\n  }\n  /* surface primary controls: \"...\", \"experiences\", \"unmute/mute\" */\n  #__next > main > div > div > div.fixed.top-4.right-6 > button,\n  div[data-projection-id=\"12\"] > button {\n    transform: scale(2);\n    z-index: 50;\n  }\n  /* override React changes on audio button */\n  button[data-projection-id=\"16\"] > div[data-projection-id=\"17\"],\n  button[data-projection-id=\"16\"] > div[data-projection-id=\"18\"] {\n    transform: scale(2) !important;\n    z-index: 50;\n  }\n  /* hide footer */\n  #saypi-footer {\n    display: none;\n  }\n}\n"],"sourceRoot":""}]);
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("// Dispatch Custom Event\nfunction dispatchCustomEvent(eventName) {\n  var detail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};\n  var event = new CustomEvent(eventName, {\n    detail: detail\n  });\n  console.log(\"dispatching event: \" + eventName);\n  window.dispatchEvent(event);\n}\n\n// audio output (Pi)\nvar audioElement = document.querySelector(\"audio\");\nif (!audioElement) {\n  console.error(\"Audio element not found!\");\n}\n\n// TODO: dedupe this function from EventModule.js\nfunction isSafari() {\n  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);\n}\naudioElement.preload = \"auto\"; // enable aggressive preloading of audio\nvar piAudioManager = {\n  isSpeaking: false,\n  audioElement: audioElement,\n  _userStarted: true,\n  // flag to indicate playback has been started by the user (true by default because user must request initial playback)\n  _isLoadCalled: false,\n  // flag to indicate if the load() method has been called on the audio element\n\n  isLoadCalled: function isLoadCalled() {\n    return this._isLoadCalled;\n  },\n  setIsLoadCalled: function setIsLoadCalled(value) {\n    this._isLoadCalled = value;\n  },\n  userPlay: function userPlay() {\n    if (!isSafari()) {\n      return;\n    }\n    this._userStarted = true; // set a flag to indicate playback has been started by the user\n    this.audioElement.load(); // reset for Safari\n    dispatchCustomEvent(\"audio:loading\");\n    this.audioElement.play();\n    console.log(\"User started playback\");\n  },\n  autoPlay: function autoPlay() {\n    if (!this._userStarted) {\n      this.audioElement.pause();\n    }\n  },\n  stop: function stop() {\n    if (this.isSpeaking) {\n      this.audioElement.pause();\n    }\n    if (this.audioElement.duration && !this.audioElement.ended && this.audioElement.currentTime < this.audioElement.duration) {\n      this.audioElement.currentTime = this.audioElement.duration; // seek the audio to the end\n      this.audioElement.play(); // trigger the ended event\n    }\n  },\n\n  pause: function pause() {\n    this.audioElement.pause();\n  },\n  resume: function resume() {\n    this.audioElement.play();\n  },\n  playing: function playing() {\n    this.isSpeaking = true;\n  },\n  stopped: function stopped() {\n    this.isSpeaking = false;\n    this._userStarted = false;\n  }\n};\n\n// Intercept Autoplay Events (autoplay doesn't work on Safari)\naudioElement.addEventListener(\"play\", function () {\n  console.log(\"play\");\n  if (isSafari()) {\n    piAudioManager.autoPlay();\n  }\n});\naudioElement.addEventListener(\"loadstart\", function () {\n  console.log(\"loadstart\");\n  if (isSafari()) {\n    dispatchCustomEvent(\"saypi:piReadyToRespond\");\n  }\n});\n\n// Event listeners for detecting when Pi is speaking\naudioElement.addEventListener(\"playing\", function () {\n  console.log(\"playing\");\n  piAudioManager.playing();\n  dispatchCustomEvent(\"saypi:piSpeaking\");\n});\naudioElement.addEventListener(\"pause\", function () {\n  console.log(\"pause\");\n  piAudioManager.stopped();\n  dispatchCustomEvent(\"saypi:piStoppedSpeaking\");\n});\naudioElement.addEventListener(\"ended\", function () {\n  piAudioManager.stopped();\n  dispatchCustomEvent(\"saypi:piFinishedSpeaking\");\n});\n\n// audio input (user)\nvar audioDataChunks = [];\nvar audioMimeType = \"audio/webm;codecs=opus\";\nfunction uploadAudio(audioBlob) {\n  // Create a FormData object\n  var formData = new FormData();\n  var audioFilename = \"audio.webm\";\n  if (audioBlob.type === \"audio/mp4\") {\n    audioFilename = \"audio.mp4\";\n  }\n  // Add the audio blob to the FormData object\n  formData.append(\"audio\", audioBlob, audioFilename);\n  // Get the user's preferred language\n  var language = navigator.language;\n  dispatchCustomEvent(\"saypi:transcribing\");\n  // Post the audio to the server for transcription\n  fetch(config.apiServerUrl + \"/transcribe?language=\" + language, {\n    method: \"POST\",\n    body: formData\n  }).then(function (response) {\n    if (!response.ok) {\n      throw Error(response.statusText);\n    }\n    return response.json();\n  }).then(function (responseJson) {\n    dispatchCustomEvent(\"saypi:transcribed\", {\n      text: responseJson.text\n    });\n  })[\"catch\"](function (error) {\n    console.error(\"Looks like there was a problem: \", error);\n    var textarea = document.getElementById(\"saypi-prompt\");\n    textarea.value = \"Sorry, there was a problem transcribing your audio. Please try again later.\";\n  });\n}\n\n// Declare a global variable for the mediaRecorder\nvar mediaRecorder;\nvar threshold = 1000; // 1000 ms = 1 second, about the length of \"Hey, Pi\"\n\n// This function will be called when the 'dataavailable' event fires\nfunction handleDataAvailable(e) {\n  // Add the audio data chunk to the array\n  audioDataChunks.push(e.data);\n}\n\n// This function will be called when the 'stop' event fires\nfunction handleStop() {\n  // Create a Blob from the audio data chunks\n  var audioBlob = new Blob(audioDataChunks, {\n    type: audioMimeType\n  });\n\n  // Get the stop time and calculate the duration\n  var stopTime = Date.now();\n  var duration = stopTime - window.startTime;\n\n  // If the duration is greater than the threshold, upload the audio for transcription\n  if (duration >= threshold) {\n    // Upload the audio to the server for transcription\n    uploadAudio(audioBlob);\n  }\n\n  // Clear the array for the next recording\n  audioDataChunks = [];\n}\nfunction setupRecording(callback) {\n  if (mediaRecorder) {\n    return;\n  }\n\n  // Get a stream from the user's microphone\n  navigator.mediaDevices.getUserMedia({\n    audio: true\n  }).then(function (stream) {\n    if (!MediaRecorder.isTypeSupported(audioMimeType)) {\n      // use MP4 for Safari\n      audioMimeType = \"audio/mp4\";\n    }\n    // Create a new MediaRecorder object using the stream and specifying the MIME type\n    var options = {\n      mimeType: audioMimeType\n    };\n    mediaRecorder = new MediaRecorder(stream, options);\n\n    // Listen for the 'dataavailable' event\n    mediaRecorder.addEventListener(\"dataavailable\", handleDataAvailable);\n\n    // Listen for the 'stop' event\n    mediaRecorder.addEventListener(\"stop\", handleStop);\n  }).then(function () {\n    // Invoke the callback function\n    if (typeof callback === \"function\") {\n      callback();\n    }\n  })[\"catch\"](function (err) {\n    console.error(\"Error getting audio stream: \" + err);\n  });\n}\nfunction tearDownRecording() {\n  // Check if the MediaRecorder is set up\n  if (!mediaRecorder) {\n    return;\n  }\n\n  // Stop any ongoing recording\n  if (mediaRecorder.state === \"recording\") {\n    mediaRecorder.stop();\n  }\n\n  // Remove the MediaRecorder's event listeners\n  mediaRecorder.removeEventListener(\"dataavailable\", handleDataAvailable);\n  mediaRecorder.removeEventListener(\"stop\", handleStop);\n\n  // Clear the MediaRecorder variable\n  mediaRecorder = null;\n}\n\n// To request recording, other modules can dispatch a custom event audio:startRecording\nfunction startRecording() {\n  // Check if the MediaRecorder is set up\n  if (!mediaRecorder) {\n    setupRecording(startRecording);\n    return;\n  }\n  // Check if Pi is currently speaking and stop her audio\n  if (piAudioManager.isSpeaking) {\n    piAudioManager.pause();\n  }\n\n  // Start recording\n  mediaRecorder.start();\n\n  // Record the start time\n  window.startTime = Date.now();\n  dispatchCustomEvent(\"saypi:userSpeaking\");\n}\n\n// To stop recording, other modules can dispatch a custom event audio:stopRecording\nfunction stopRecording() {\n  if (mediaRecorder && mediaRecorder.state === \"recording\") {\n    // Stop recording\n    mediaRecorder.stop();\n\n    // Record the stop time and calculate the duration\n    var stopTime = Date.now();\n    var duration = stopTime - window.startTime;\n\n    // If the duration is less than the threshold, don't upload the audio for transcription\n    if (duration < threshold) {\n      console.log(\"Recording was too short, not uploading for transcription\");\n      dispatchCustomEvent(\"saypi:userStoppedSpeaking\");\n      piAudioManager.resume();\n    } else {\n      piAudioManager.stop();\n      dispatchCustomEvent(\"saypi:userFinishedSpeaking\");\n    }\n  }\n}\nfunction registerCustomAudioEventListeners() {\n  window.addEventListener(\"audio:setupRecording\", function (e) {\n    setupRecording();\n  });\n  window.addEventListener(\"audio:tearDownRecording\", function (e) {\n    tearDownRecording();\n  });\n  window.addEventListener(\"audio:startRecording\", function (e) {\n    startRecording();\n  });\n  window.addEventListener(\"audio:stopRecording\", function (e) {\n    stopRecording();\n  });\n}\nregisterCustomAudioEventListeners();");

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
/* harmony import */ var _AnimationModule_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AnimationModule.js */ "./src/AnimationModule.js");
/* harmony import */ var _ButtonModule_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ButtonModule.js */ "./src/ButtonModule.js");
/* harmony import */ var _EventModule_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./EventModule.js */ "./src/EventModule.js");
/* harmony import */ var _talkButton_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./talkButton.css */ "./src/talkButton.css");
/* harmony import */ var _mobile_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./mobile.css */ "./src/mobile.css");
/* harmony import */ var _rectangles_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./rectangles.css */ "./src/rectangles.css");
/* harmony import */ var _waveform_svg__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./waveform.svg */ "./src/waveform.svg");
/* harmony import */ var _rectangles_svg__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./rectangles.svg */ "./src/rectangles.svg");








(function () {
  "use strict";

  var buttonModule = new _ButtonModule_js__WEBPACK_IMPORTED_MODULE_1__["default"]();
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
  _EventModule_js__WEBPACK_IMPORTED_MODULE_2__["default"].init();

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
      iconContainer.innerHTML = _rectangles_svg__WEBPACK_IMPORTED_MODULE_7__["default"];
    } else {
      iconContainer.innerHTML = _waveform_svg__WEBPACK_IMPORTED_MODULE_6__["default"];
    }
  }
  function addUserAgentFlags() {
    var isFirefoxAndroid = /Firefox/.test(navigator.userAgent) && /Android/.test(navigator.userAgent);
    if (isFirefoxAndroid) {
      // hack for Firefox on Android, which doesn't support :active correctly
      document.documentElement.classList.add("firefox-android");
    }
  }
  function registerAudioButtonEvents() {
    var button = document.getElementById("saypi-talkButton");

    // Setting the correct context
    var context = window;
    if (GM_info.scriptHandler !== "Userscripts") {
      context = unsafeWindow;
    }
    _EventModule_js__WEBPACK_IMPORTED_MODULE_2__["default"].setContext(context); // Set the context for EventModule

    // Attach the event listeners
    button.addEventListener("mousedown", _EventModule_js__WEBPACK_IMPORTED_MODULE_2__["default"].handleTalkMouseDown.bind(_EventModule_js__WEBPACK_IMPORTED_MODULE_2__["default"]));
    button.addEventListener("mouseup", _EventModule_js__WEBPACK_IMPORTED_MODULE_2__["default"].handleTalkMouseUp.bind(_EventModule_js__WEBPACK_IMPORTED_MODULE_2__["default"]));
    button.addEventListener("dblclick", function () {
      return _EventModule_js__WEBPACK_IMPORTED_MODULE_2__["default"].handleTalkDoubleClick(button);
    });
    button.addEventListener("touchstart", function (e) {
      return _EventModule_js__WEBPACK_IMPORTED_MODULE_2__["default"].handleTalkTouchStart(button, e);
    });
    button.addEventListener("touchend", function () {
      return _EventModule_js__WEBPACK_IMPORTED_MODULE_2__["default"].handleTalkTouchEnd(button);
    });
    _EventModule_js__WEBPACK_IMPORTED_MODULE_2__["default"].registerOtherAudioButtonEvents(button);
    _EventModule_js__WEBPACK_IMPORTED_MODULE_2__["default"].registerCustomAudioEventListeners();
    _EventModule_js__WEBPACK_IMPORTED_MODULE_2__["default"].registerHotkey();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU8scUZBQXFGLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxZQUFZLE1BQU0sU0FBUyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxTQUFTLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFNBQVMsWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssU0FBUyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxTQUFTLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFNBQVMsWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLFlBQVksTUFBTSxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sWUFBWSxNQUFNLEtBQUssS0FBSyxPQUFPLE1BQU0sS0FBSyxLQUFLLE9BQU8sTUFBTSxLQUFLLFlBQVksTUFBTSxNQUFNLFlBQVksTUFBTSxNQUFNLFlBQVksTUFBTSxNQUFNLEtBQUssTUFBTSxZQUFZLE1BQU0sTUFBTSxZQUFZLE1BQU0sTUFBTSxLQUFLLE1BQU0sWUFBWSxNQUFNLE1BQU0sWUFBWSxNQUFNLE1BQU0sS0FBSyxNQUFNLFlBQVksTUFBTSxNQUFNLFlBQVksTUFBTSxNQUFNLEtBQUssTUFBTSxZQUFZLE1BQU0sTUFBTSxZQUFZLE1BQU0sTUFBTSxLQUFLLE1BQU0sWUFBWSxNQUFNLE1BQU0sWUFBWSxNQUFNLE1BQU0sS0FB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QkFBZ0IsQ0FBQyxVQUFVLEVBQUU7TUFBQSxPQUNsQzRDLHVEQUFXLENBQUN3QyxrQkFBa0IsQ0FBQzFFLE1BQU0sQ0FBQztJQUFBLENBQ3hDLENBQUM7SUFFRGtDLHVEQUFXLENBQUM0Qyw4QkFBOEIsQ0FBQzlFLE1BQU0sQ0FBQztJQUNsRGtDLHVEQUFXLENBQUM2QyxpQ0FBaUMsQ0FBQyxDQUFDO0lBQy9DN0MsdURBQVcsQ0FBQzhDLGNBQWMsQ0FBQyxDQUFDO0VBQzlCOztFQUVBO0VBQ0FvQixRQUFRLENBQUM4QyxPQUFPLENBQUNuTCxRQUFRLEVBQUU7SUFBRW9MLFNBQVMsRUFBRSxJQUFJO0lBQUVDLE9BQU8sRUFBRTtFQUFLLENBQUMsQ0FBQztBQUNoRSxDQUFDLEVBQUUsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvQW5pbWF0aW9uTW9kdWxlLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvQnV0dG9uTW9kdWxlLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvRXZlbnRNb2R1bGUuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9Vc2VyQWdlbnRNb2R1bGUuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9tb2JpbGUuY3NzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvcmVjdGFuZ2xlcy5jc3MiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy90YWxrQnV0dG9uLmNzcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy90cmFuc2NyaWJlci5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3JlY3RhbmdsZXMuc3ZnIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvd2F2ZWZvcm0uc3ZnIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvbW9iaWxlLmNzcz9mNmZmIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvcmVjdGFuZ2xlcy5jc3M/MDM2MiIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3RhbGtCdXR0b24uY3NzPzA3ZjUiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3NheXBpLmluZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIEFuaW1hdGlvbk1vZHVsZSB7XG4gIHN0YXRpYyByZWN0YW5nbGVzU2VsZWN0b3IgPVxuICAgIFwiLm91dGVybW9zdCwgLnNlY29uZCwgLnRoaXJkLCAuZm91cnRoLCAuZmlmdGgsIC5pbm5lcm1vc3RcIjtcbiAgc3RhdGljIHRhbGtCdXR0b25BbmltYXRpb25zID0gW1wicmVhZHlUb1Jlc3BvbmRcIl07XG5cbiAgc3RhdGljIGFuaW1hdGUoYW5pbWF0aW9uKSB7XG4gICAgdGhpcy5zdG9wT3RoZXJBbmltYXRpb25zKGFuaW1hdGlvbik7XG5cbiAgICBsZXQgcmVjdGFuZ2xlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5yZWN0YW5nbGVzU2VsZWN0b3IpO1xuICAgIHJlY3RhbmdsZXMuZm9yRWFjaCgocmVjdCkgPT4gcmVjdC5jbGFzc0xpc3QuYWRkKGFuaW1hdGlvbikpO1xuICB9XG5cbiAgc3RhdGljIGluYW5pbWF0ZShhbmltYXRpb24pIHtcbiAgICBsZXQgcmVjdGFuZ2xlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5yZWN0YW5nbGVzU2VsZWN0b3IpO1xuICAgIHJlY3RhbmdsZXMuZm9yRWFjaCgocmVjdCkgPT4gcmVjdC5jbGFzc0xpc3QucmVtb3ZlKGFuaW1hdGlvbikpO1xuICB9XG5cbiAgc3RhdGljIHN0b3BBbGxBbmltYXRpb25zKCkge1xuICAgIHRoaXMudGFsa0J1dHRvbkFuaW1hdGlvbnMuZm9yRWFjaCgoYW5pbWF0aW9uKSA9PiB0aGlzLmluYW5pbWF0ZShhbmltYXRpb24pKTtcbiAgfVxuXG4gIHN0YXRpYyBzdG9wT3RoZXJBbmltYXRpb25zKGtlZXBBbmltYXRpb24pIHtcbiAgICB0aGlzLnRhbGtCdXR0b25BbmltYXRpb25zLmZvckVhY2goKGFuaW1hdGlvbikgPT4ge1xuICAgICAgaWYgKGFuaW1hdGlvbiAhPT0ga2VlcEFuaW1hdGlvbikge1xuICAgICAgICB0aGlzLmluYW5pbWF0ZShhbmltYXRpb24pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iLCJpbXBvcnQgQW5pbWF0aW9uTW9kdWxlIGZyb20gXCIuL0FuaW1hdGlvbk1vZHVsZVwiO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnV0dG9uTW9kdWxlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5wbGF5QnV0dG9uID0gbnVsbDtcbiAgICAvLyBCaW5kaW5nIG1ldGhvZHMgdG8gdGhlIGN1cnJlbnQgaW5zdGFuY2VcbiAgICB0aGlzLmhhbmRsZVBsYXlCdXR0b25DbGljayA9IHRoaXMuaGFuZGxlUGxheUJ1dHRvbkNsaWNrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5yZWdpc3RlckJ1dHRvbkV2ZW50cygpO1xuICAgIHRoaXMucmVnaXN0ZXJPdGhlckV2ZW50cygpO1xuICB9XG5cbiAgcmVnaXN0ZXJCdXR0b25FdmVudHMoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzYXlwaTphd2FpdGluZ1VzZXJJbnB1dFwiLCAoKSA9PiB7XG4gICAgICB0aGlzLnBva2VVc2VyKCk7XG4gICAgfSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzYXlwaTpyZWNlaXZlZFVzZXJJbnB1dFwiLCAoKSA9PiB7XG4gICAgICB0aGlzLnVucG9rZVVzZXIoKTtcbiAgICB9KTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImF1ZGlvOmxvYWRpbmdcIiwgKCkgPT4ge1xuICAgICAgQW5pbWF0aW9uTW9kdWxlLmFuaW1hdGUoXCJsb2FkaW5nXCIpO1xuICAgIH0pO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2F5cGk6cGlTcGVha2luZ1wiLCAoKSA9PiB7XG4gICAgICB0aGlzLnVucG9rZVVzZXIoKTsgLy8gcGxheWJhY2sgaGFzIHN0YXJ0ZWQsIHVzZXIgaW5wdXQgaXMgbm8gbG9uZ2VyIG5lZWRlZFxuICAgICAgQW5pbWF0aW9uTW9kdWxlLmluYW5pbWF0ZShcImxvYWRpbmdcIik7XG4gICAgICBBbmltYXRpb25Nb2R1bGUuYW5pbWF0ZShcInBpU3BlYWtpbmdcIik7XG4gICAgfSk7XG4gICAgW1wic2F5cGk6cGlTdG9wcGVkU3BlYWtpbmdcIiwgXCJzYXlwaTpwaUZpbmlzaGVkU3BlYWtpbmdcIl0uZm9yRWFjaChcbiAgICAgIChldmVudE5hbWUpID0+IHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCAoKSA9PiB7XG4gICAgICAgICAgQW5pbWF0aW9uTW9kdWxlLmluYW5pbWF0ZShcInBpU3BlYWtpbmdcIik7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzYXlwaTp1c2VyU3BlYWtpbmdcIiwgKCkgPT4ge1xuICAgICAgY29uc3QgdGFsa0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F5cGktdGFsa0J1dHRvblwiKTtcbiAgICAgIHRhbGtCdXR0b24uY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTsgLy8gQWRkIHRoZSBhY3RpdmUgY2xhc3MgKGZvciBGaXJlZm94IG9uIEFuZHJvaWQpXG4gICAgICBBbmltYXRpb25Nb2R1bGUuYW5pbWF0ZShcInVzZXJTcGVha2luZ1wiKTtcbiAgICB9KTtcbiAgICBbXCJzYXlwaTp1c2VyU3RvcHBlZFNwZWFraW5nXCIsIFwic2F5cGk6dXNlckZpbmlzaGVkU3BlYWtpbmdcIl0uZm9yRWFjaChcbiAgICAgIChldmVudE5hbWUpID0+IHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgdGFsa0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F5cGktdGFsa0J1dHRvblwiKTtcbiAgICAgICAgICB0YWxrQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7IC8vIFJlbW92ZSB0aGUgYWN0aXZlIGNsYXNzIChmb3IgRmlyZWZveCBvbiBBbmRyb2lkKVxuICAgICAgICAgIEFuaW1hdGlvbk1vZHVsZS5pbmFuaW1hdGUoXCJ1c2VyU3BlYWtpbmdcIik7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzYXlwaTp0cmFuc2NyaWJpbmdcIiwgKCkgPT4ge1xuICAgICAgQW5pbWF0aW9uTW9kdWxlLmFuaW1hdGUoXCJ0cmFuc2NyaWJpbmdcIik7XG4gICAgfSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzYXlwaTp0cmFuc2NyaWJlZFwiLCAoKSA9PiB7XG4gICAgICBBbmltYXRpb25Nb2R1bGUuaW5hbmltYXRlKFwidHJhbnNjcmliaW5nXCIpO1xuICAgIH0pO1xuICB9XG5cbiAgcmVnaXN0ZXJPdGhlckV2ZW50cygpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNheXBpOmF1dG9TdWJtaXRcIiwgQnV0dG9uTW9kdWxlLmhhbmRsZUF1dG9TdWJtaXQpO1xuICB9XG5cbiAgLy8gRnVuY3Rpb24gdG8gY3JlYXRlIGEgbmV3IGJ1dHRvblxuICBjcmVhdGVCdXR0b24obGFiZWwsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICBidXR0b24udGV4dENvbnRlbnQgPSBsYWJlbDtcbiAgICBidXR0b24ub25jbGljayA9IGNhbGxiYWNrO1xuICAgIHJldHVybiBidXR0b247XG4gIH1cblxuICAvLyBGdW5jdGlvbiB0byBzdHlsZSBhIGdpdmVuIGJ1dHRvblxuICBzdHlsZUJ1dHRvbihidXR0b24sIHN0eWxlcykge1xuICAgIGZvciAobGV0IGtleSBpbiBzdHlsZXMpIHtcbiAgICAgIGlmIChzdHlsZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBidXR0b24uc3R5bGVba2V5XSA9IHN0eWxlc1trZXldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFNpbXVsYXRlIGFuIFwiRW50ZXJcIiBrZXlwcmVzcyBldmVudCBvbiBhIGZvcm1cbiAgc3RhdGljIHNpbXVsYXRlRm9ybVN1Ym1pdCgpIHtcbiAgICBjb25zdCB0ZXh0YXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F5cGktcHJvbXB0XCIpO1xuXG4gICAgY29uc3QgZW50ZXJFdmVudCA9IG5ldyBLZXlib2FyZEV2ZW50KFwia2V5ZG93blwiLCB7XG4gICAgICBidWJibGVzOiB0cnVlLFxuICAgICAga2V5OiBcIkVudGVyXCIsXG4gICAgICBrZXlDb2RlOiAxMyxcbiAgICAgIHdoaWNoOiAxMyxcbiAgICB9KTtcblxuICAgIHRleHRhcmVhLmRpc3BhdGNoRXZlbnQoZW50ZXJFdmVudCk7XG4gIH1cblxuICAvLyBGdW5jdGlvbiB0byBoYW5kbGUgYXV0by1zdWJtaXQgYmFzZWQgb24gdGhlIGJ1dHRvbidzIGRhdGEgYXR0cmlidXRlXG4gIHN0YXRpYyBoYW5kbGVBdXRvU3VibWl0KCkge1xuICAgIGNvbnN0IHRhbGtCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNheXBpLXRhbGtCdXR0b25cIik7XG5cbiAgICBpZiAodGFsa0J1dHRvbi5kYXRhc2V0LmF1dG9zdWJtaXQgPT09IFwiZmFsc2VcIikge1xuICAgICAgY29uc29sZS5sb2coXCJBdXRvc3VibWl0IGlzIGRpc2FibGVkXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBCdXR0b25Nb2R1bGUuc2ltdWxhdGVGb3JtU3VibWl0KCk7XG4gICAgfVxuICB9XG5cbiAgY3JlYXRlUGxheUJ1dHRvbigpIHtcbiAgICBjb25zdCBsYWJlbCA9IFwiSGVhciBQaSdzIHJlc3BvbnNlXCI7XG4gICAgdGhpcy5wbGF5QnV0dG9uID0gdGhpcy5jcmVhdGVCdXR0b24oXCJcIiwgKCkgPT4ge30pO1xuICAgIHRoaXMucGxheUJ1dHRvbi5pZCA9IFwic2F5cGktcGxheUJ1dHRvblwiO1xuICAgIHRoaXMucGxheUJ1dHRvbi50eXBlID0gXCJidXR0b25cIjtcbiAgICB0aGlzLnBsYXlCdXR0b24uY2xhc3NOYW1lID0gXCJoaWRkZW4gcGxheS1idXR0b25cIjtcbiAgICB0aGlzLnBsYXlCdXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBsYWJlbCk7XG4gICAgdGhpcy5wbGF5QnV0dG9uLnNldEF0dHJpYnV0ZShcInRpdGxlXCIsIGxhYmVsKTtcbiAgICB0aGlzLnBsYXlCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuaGFuZGxlUGxheUJ1dHRvbkNsaWNrKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMucGxheUJ1dHRvbik7XG4gICAgcmV0dXJuIHRoaXMucGxheUJ1dHRvbjtcbiAgfVxuXG4gIHNob3dQbGF5QnV0dG9uKCkge1xuICAgIGlmICghdGhpcy5wbGF5QnV0dG9uKSB7XG4gICAgICB0aGlzLmNyZWF0ZVBsYXlCdXR0b24oKTtcbiAgICB9XG4gICAgdGhpcy5wbGF5QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gIH1cblxuICBoaWRlUGxheUJ1dHRvbigpIHtcbiAgICBpZiAodGhpcy5wbGF5QnV0dG9uKSB7XG4gICAgICB0aGlzLnBsYXlCdXR0b24uY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVQbGF5QnV0dG9uQ2xpY2soKSB7XG4gICAgdGhpcy51bnBva2VVc2VyKCk7XG4gICAgZGlzcGF0Y2hDdXN0b21FdmVudChcInNheXBpOnJlY2VpdmVkVXNlcklucHV0XCIpOyAvLyBkb3VibGluZyB1cCB3aXRoIHByZXZpb3VzIGxpbmU/XG4gICAgcGlBdWRpb01hbmFnZXIudXNlclBsYXkoKTtcbiAgfVxuXG4gIHBva2VVc2VyKCkge1xuICAgIEFuaW1hdGlvbk1vZHVsZS5hbmltYXRlKFwicmVhZHlUb1Jlc3BvbmRcIik7XG4gICAgdGhpcy5zaG93UGxheUJ1dHRvbigpO1xuICB9XG5cbiAgdW5wb2tlVXNlcigpIHtcbiAgICBBbmltYXRpb25Nb2R1bGUuaW5hbmltYXRlKFwicmVhZHlUb1Jlc3BvbmRcIik7XG4gICAgdGhpcy5oaWRlUGxheUJ1dHRvbigpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBpc1NhZmFyaSwgaXNNb2JpbGVWaWV3IH0gZnJvbSBcIi4vVXNlckFnZW50TW9kdWxlLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50TW9kdWxlIHtcbiAgc3RhdGljIGNvbnRleHQgPSB3aW5kb3c7XG4gIHN0YXRpYyBpbml0KCkge1xuICAgIC8vIEFsbCB0aGUgZXZlbnQgbGlzdGVuZXJzIGNhbiBiZSBhZGRlZCBoZXJlXG4gICAgdGhpcy5oYW5kbGVBdWRpb0V2ZW50cygpO1xuICAgIC8vIEFueSBvdGhlciBpbml0aWFsaXphdGlvbnMuLi5cbiAgfVxuXG4gIHN0YXRpYyBjbGVhbnVwKCkge1xuICAgIC8vIFJlbW92ZSBldmVudCBsaXN0ZW5lcnMgaWYgbmVlZGVkLCBvciBhbnkgb3RoZXIgY2xlYW51cCBvcGVyYXRpb25zXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICBcInNheXBpOnRyYW5zY3JpYmVkXCIsXG4gICAgICB0aGlzLmhhbmRsZVRyYW5zY3JpcHRpb25SZXNwb25zZVxuICAgICk7XG4gIH1cblxuICAvLyBEaXNwYXRjaCBDdXN0b20gRXZlbnRcbiAgLy8gVE9ETzogcmVtb3ZlIGR1cGxpY2F0ZWQgZnVuY3Rpb24gZnJvbSB0cmFuc2NyaWJlci5qc1xuICBzdGF0aWMgZGlzcGF0Y2hDdXN0b21FdmVudChldmVudE5hbWUsIGRldGFpbCA9IHt9KSB7XG4gICAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCB7IGRldGFpbCB9KTtcbiAgICBjb25zb2xlLmxvZyhcImRpc3BhdGNoaW5nIGV2ZW50OiBcIiArIGV2ZW50TmFtZSk7XG4gICAgd2luZG93LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICB9XG5cbiAgc3RhdGljIGhhbmRsZUF1ZGlvRXZlbnRzKCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJzYXlwaTp0cmFuc2NyaWJlZFwiLFxuICAgICAgRXZlbnRNb2R1bGUuaGFuZGxlVHJhbnNjcmlwdGlvblJlc3BvbnNlXG4gICAgKTtcbiAgfVxuXG4gIHN0YXRpYyBoYW5kbGVUcmFuc2NyaXB0aW9uUmVzcG9uc2UodHJhbnNjcmlwdGlvbkV2ZW50KSB7XG4gICAgbGV0IHRyYW5zY3JpcHQgPSB0cmFuc2NyaXB0aW9uRXZlbnQuZGV0YWlsLnRleHQ7XG4gICAgY29uc29sZS5sb2coXCJUcmFuc2NyaXB0OiBcIiArIHRyYW5zY3JpcHQpO1xuICAgIGNvbnN0IHRleHRhcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS1wcm9tcHRcIik7XG4gICAgaWYgKGlzTW9iaWxlVmlldygpKSB7XG4gICAgICAvLyBpZiB0cmFuc2NyaXB0IGlzID4gMTAwMCBjaGFyYWN0ZXJzLCB0cnVuY2F0ZSBpdCB0byA5OTkgY2hhcmFjdGVycyBwbHVzIGFuIGVsbGlwc2lzXG4gICAgICBpZiAodHJhbnNjcmlwdC5sZW5ndGggPiAxMDAwKSB7XG4gICAgICAgIHRyYW5zY3JpcHQgPSB0cmFuc2NyaXB0LnN1YnN0cmluZygwLCA5OTkpICsgXCLigKZcIjtcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgIFwiVHJhbnNjcmlwdCB3YXMgdG9vIGxvbmcgZm9yIFBpLiBUcnVuY2F0ZWQgdG8gOTk5IGNoYXJhY3RlcnMsIGxvc2luZyB0aGUgZm9sbG93aW5nIHRleHQ6IC4uLiBcIiArXG4gICAgICAgICAgICB0cmFuc2NyaXB0LnN1YnN0cmluZyg5OTkpXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBFdmVudE1vZHVsZS5zZXROYXRpdmVWYWx1ZSh0ZXh0YXJlYSwgdHJhbnNjcmlwdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIEV2ZW50TW9kdWxlLnNpbXVsYXRlVHlwaW5nKHRleHRhcmVhLCB0cmFuc2NyaXB0ICsgXCIgXCIpO1xuICAgIH1cbiAgICBFdmVudE1vZHVsZS5kaXNwYXRjaEN1c3RvbUV2ZW50KFwic2F5cGk6YXV0b1N1Ym1pdFwiKTtcbiAgfVxuXG4gIHN0YXRpYyBzaW11bGF0ZVR5cGluZyhlbGVtZW50LCB0ZXh0KSB7XG4gICAgY29uc3Qgd29yZHMgPSB0ZXh0LnNwbGl0KFwiIFwiKTtcbiAgICBsZXQgaSA9IDA7XG5cbiAgICBjb25zdCB0eXBlV29yZCA9ICgpID0+IHtcbiAgICAgIGlmIChpIDwgd29yZHMubGVuZ3RoKSB7XG4gICAgICAgIEV2ZW50TW9kdWxlLnNldE5hdGl2ZVZhbHVlKGVsZW1lbnQsIGVsZW1lbnQudmFsdWUgKyB3b3Jkc1tpKytdICsgXCIgXCIpO1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodHlwZVdvcmQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0eXBlV29yZCgpO1xuICB9XG5cbiAgc3RhdGljIHNldE5hdGl2ZVZhbHVlKGVsZW1lbnQsIHZhbHVlKSB7XG4gICAgbGV0IGxhc3RWYWx1ZSA9IGVsZW1lbnQudmFsdWU7XG4gICAgZWxlbWVudC52YWx1ZSA9IHZhbHVlO1xuICAgIGxldCBldmVudCA9IG5ldyBFdmVudChcImlucHV0XCIsIHsgdGFyZ2V0OiBlbGVtZW50LCBidWJibGVzOiB0cnVlIH0pO1xuICAgIC8vIFJlYWN0IDE1XG4gICAgZXZlbnQuc2ltdWxhdGVkID0gdHJ1ZTtcbiAgICAvLyBSZWFjdCAxNi0xN1xuICAgIGxldCB0cmFja2VyID0gZWxlbWVudC5fdmFsdWVUcmFja2VyO1xuICAgIGlmICh0cmFja2VyKSB7XG4gICAgICB0cmFja2VyLnNldFZhbHVlKGxhc3RWYWx1ZSk7XG4gICAgfVxuICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gIH1cblxuICBzdGF0aWMgaGFuZGxlVGFsa01vdXNlRG93bigpIHtcbiAgICBkaXNwYXRjaEN1c3RvbUV2ZW50KFwiYXVkaW86c3RhcnRSZWNvcmRpbmdcIik7XG4gIH1cblxuICBzdGF0aWMgaGFuZGxlVGFsa01vdXNlVXAoKSB7XG4gICAgZGlzcGF0Y2hDdXN0b21FdmVudChcImF1ZGlvOnN0b3BSZWNvcmRpbmdcIik7XG4gIH1cblxuICBzdGF0aWMgaGFuZGxlVGFsa0RvdWJsZUNsaWNrKGJ1dHRvbikge1xuICAgIC8vIFRvZ2dsZSB0aGUgQ1NTIGNsYXNzZXMgdG8gaW5kaWNhdGUgdGhlIG1vZGVcbiAgICBidXR0b24uY2xhc3NMaXN0LnRvZ2dsZShcImF1dG9TdWJtaXRcIik7XG4gICAgaWYgKGJ1dHRvbi5nZXRBdHRyaWJ1dGUoXCJkYXRhLWF1dG9zdWJtaXRcIikgPT09IFwidHJ1ZVwiKSB7XG4gICAgICBidXR0b24uc2V0QXR0cmlidXRlKFwiZGF0YS1hdXRvc3VibWl0XCIsIFwiZmFsc2VcIik7XG4gICAgICBjb25zb2xlLmxvZyhcImF1dG9zdWJtaXQgZGlzYWJsZWRcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJkYXRhLWF1dG9zdWJtaXRcIiwgXCJ0cnVlXCIpO1xuICAgICAgY29uc29sZS5sb2coXCJhdXRvc3VibWl0IGVuYWJsZWRcIik7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGhhbmRsZVRhbGtUb3VjaFN0YXJ0KGJ1dHRvbiwgZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLmRpc3BhdGNoQ3VzdG9tRXZlbnQoXCJhdWRpbzpzdGFydFJlY29yZGluZ1wiKTtcbiAgfVxuXG4gIHN0YXRpYyBoYW5kbGVUYWxrVG91Y2hFbmQoYnV0dG9uKSB7XG4gICAgdGhpcy5kaXNwYXRjaEN1c3RvbUV2ZW50KFwiYXVkaW86c3RvcFJlY29yZGluZ1wiKTtcbiAgfVxuXG4gIHN0YXRpYyBzZXRDb250ZXh0KGN0eCkge1xuICAgIHRoaXMuY29udGV4dCA9IGN0eDtcbiAgfVxuXG4gIHN0YXRpYyByZWdpc3Rlck90aGVyQXVkaW9CdXR0b25FdmVudHMoYnV0dG9uKSB7XG4gICAgLy8gXCJ3YXJtIHVwXCIgdGhlIG1pY3JvcGhvbmUgYnkgYWNxdWlyaW5nIGl0IGJlZm9yZSB0aGUgdXNlciBwcmVzc2VzIHRoZSBidXR0b25cbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZW50ZXJcIiwgKCkgPT4ge1xuICAgICAgRXZlbnRNb2R1bGUuZGlzcGF0Y2hDdXN0b21FdmVudChcImF1ZGlvOnNldHVwUmVjb3JkaW5nXCIpO1xuICAgIH0pO1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCAoKSA9PiB7XG4gICAgICBFdmVudE1vZHVsZS5kaXNwYXRjaEN1c3RvbUV2ZW50KFwiYXVkaW86dGVhckRvd25SZWNvcmRpbmdcIik7XG4gICAgfSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJiZWZvcmV1bmxvYWRcIiwgKCkgPT4ge1xuICAgICAgRXZlbnRNb2R1bGUuZGlzcGF0Y2hDdXN0b21FdmVudChcImF1ZGlvOnRlYXJEb3duUmVjb3JkaW5nXCIpO1xuICAgIH0pO1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hjYW5jZWxcIiwgKCkgPT4ge1xuICAgICAgRXZlbnRNb2R1bGUuZGlzcGF0Y2hDdXN0b21FdmVudChcImF1ZGlvOnRlYXJEb3duUmVjb3JkaW5nXCIpO1xuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIHJlZ2lzdGVyQ3VzdG9tQXVkaW9FdmVudExpc3RlbmVycygpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNheXBpOnBpUmVhZHlUb1Jlc3BvbmRcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGlmIChpc1NhZmFyaSgpKSB7XG4gICAgICAgIEV2ZW50TW9kdWxlLmRpc3BhdGNoQ3VzdG9tRXZlbnQoXCJzYXlwaTphd2FpdGluZ1VzZXJJbnB1dFwiKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiYXVkaW86bG9hZGluZ1wiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgLy8gSGFuZGxlIHRoZSBwaVNwZWFraW5nIGV2ZW50LCBlLmcuLCBzdGFydCBhbiBhbmltYXRpb24gb3Igc2hvdyBhIFVJIGVsZW1lbnQuXG4gICAgICBpZiAoaXNTYWZhcmkoKSkge1xuICAgICAgICBFdmVudE1vZHVsZS5kaXNwYXRjaEN1c3RvbUV2ZW50KFwic2F5cGk6cmVjZWl2ZWRVc2VySW5wdXRcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKiBldmVudHMgdG8gZGlyZWN0IHRoZSBhdWRpbyBtb2R1bGUgdG8gc3RhcnQvc3RvcCByZWNvcmRpbmcgKi9cblxuICBzdGF0aWMgcmVnaXN0ZXJIb3RrZXkoKSB7XG4gICAgbGV0IGN0cmxEb3duID0gZmFsc2U7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC5jdHJsS2V5ICYmIGV2ZW50LmNvZGUgPT09IFwiU3BhY2VcIiAmJiAhY3RybERvd24pIHtcbiAgICAgICAgY3RybERvd24gPSB0cnVlO1xuICAgICAgICB0aGlzLmRpc3BhdGNoQ3VzdG9tRXZlbnQoXCJhdWRpbzpzdGFydFJlY29yZGluZ1wiKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChjdHJsRG93biAmJiBldmVudC5jb2RlID09PSBcIlNwYWNlXCIpIHtcbiAgICAgICAgY3RybERvd24gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kaXNwYXRjaEN1c3RvbUV2ZW50KFwiYXVkaW86c3RvcFJlY29yZGluZ1wiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGlzTW9iaWxlVmlldygpIHtcbiAgcmV0dXJuIHdpbmRvdy5tYXRjaE1lZGlhKFwiKG1heC13aWR0aDogNzY4cHgpXCIpLm1hdGNoZXM7XG59XG4vLyBUT0RPOiBkZWR1cGUgdGhpcyBmdW5jdGlvbiBmcm9tIHRyYW5zY3JpYmVyLmpzXG5leHBvcnQgZnVuY3Rpb24gaXNTYWZhcmkoKSB7XG4gIHJldHVybiAvXigoPyFjaHJvbWV8YW5kcm9pZCkuKSpzYWZhcmkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xufVxuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYEBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAvKiBtb2JpbGUgc3R5bGVzIGdvIGhlcmUgKi9cbiAgI3NheXBpLXBhbmVsLFxuICAucGxheS1idXR0b24ge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICBsZWZ0OiAwO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjQ1LCAyMzgsIDIyMywgMC45OCk7XG4gIH1cbiAgI3NheXBpLXBhbmVsLFxuICAucGxheS1idXR0b24ge1xuICAgIGhlaWdodDogMTAwdmg7XG4gICAgdG9wOiAwO1xuICAgIHBhZGRpbmc6IDUlO1xuICB9XG4gIC8qIG1ha2UgdGhlIGJ1dHRvbnMgZmlsbCB0aGUgcGFuZWxzICovXG4gICNzYXlwaS10YWxrQnV0dG9uIHtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBoZWlnaHQ6IDEwMCU7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgYm9yZGVyLXJhZGl1czogMDtcbiAgICBtYXJnaW46IDA7XG4gIH1cbiAgLyogc3VyZmFjZSBwcmltYXJ5IGNvbnRyb2xzOiBcIi4uLlwiLCBcImV4cGVyaWVuY2VzXCIsIFwidW5tdXRlL211dGVcIiAqL1xuICAjX19uZXh0ID4gbWFpbiA+IGRpdiA+IGRpdiA+IGRpdi5maXhlZC50b3AtNC5yaWdodC02ID4gYnV0dG9uLFxuICBkaXZbZGF0YS1wcm9qZWN0aW9uLWlkPVwiMTJcIl0gPiBidXR0b24ge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMik7XG4gICAgei1pbmRleDogNTA7XG4gIH1cbiAgLyogb3ZlcnJpZGUgUmVhY3QgY2hhbmdlcyBvbiBhdWRpbyBidXR0b24gKi9cbiAgYnV0dG9uW2RhdGEtcHJvamVjdGlvbi1pZD1cIjE2XCJdID4gZGl2W2RhdGEtcHJvamVjdGlvbi1pZD1cIjE3XCJdLFxuICBidXR0b25bZGF0YS1wcm9qZWN0aW9uLWlkPVwiMTZcIl0gPiBkaXZbZGF0YS1wcm9qZWN0aW9uLWlkPVwiMThcIl0ge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMikgIWltcG9ydGFudDtcbiAgICB6LWluZGV4OiA1MDtcbiAgfVxuICAvKiBoaWRlIGZvb3RlciAqL1xuICAjc2F5cGktZm9vdGVyIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9tb2JpbGUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0UsMEJBQTBCO0VBQzFCOztJQUVFLFdBQVc7SUFDWCxlQUFlO0lBQ2YsT0FBTztJQUNQLDJDQUEyQztFQUM3QztFQUNBOztJQUVFLGFBQWE7SUFDYixNQUFNO0lBQ04sV0FBVztFQUNiO0VBQ0EscUNBQXFDO0VBQ3JDO0lBQ0UsV0FBVztJQUNYLFlBQVk7SUFDWiw2QkFBNkI7SUFDN0IsZ0JBQWdCO0lBQ2hCLFNBQVM7RUFDWDtFQUNBLGtFQUFrRTtFQUNsRTs7SUFFRSxtQkFBbUI7SUFDbkIsV0FBVztFQUNiO0VBQ0EsMkNBQTJDO0VBQzNDOztJQUVFLDhCQUE4QjtJQUM5QixXQUFXO0VBQ2I7RUFDQSxnQkFBZ0I7RUFDaEI7SUFDRSxhQUFhO0VBQ2Y7QUFDRlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCJAbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcXG4gIC8qIG1vYmlsZSBzdHlsZXMgZ28gaGVyZSAqL1xcbiAgI3NheXBpLXBhbmVsLFxcbiAgLnBsYXktYnV0dG9uIHtcXG4gICAgd2lkdGg6IDEwMCU7XFxuICAgIHBvc2l0aW9uOiBmaXhlZDtcXG4gICAgbGVmdDogMDtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNDUsIDIzOCwgMjIzLCAwLjk4KTtcXG4gIH1cXG4gICNzYXlwaS1wYW5lbCxcXG4gIC5wbGF5LWJ1dHRvbiB7XFxuICAgIGhlaWdodDogMTAwdmg7XFxuICAgIHRvcDogMDtcXG4gICAgcGFkZGluZzogNSU7XFxuICB9XFxuICAvKiBtYWtlIHRoZSBidXR0b25zIGZpbGwgdGhlIHBhbmVscyAqL1xcbiAgI3NheXBpLXRhbGtCdXR0b24ge1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgaGVpZ2h0OiAxMDAlO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gICAgYm9yZGVyLXJhZGl1czogMDtcXG4gICAgbWFyZ2luOiAwO1xcbiAgfVxcbiAgLyogc3VyZmFjZSBwcmltYXJ5IGNvbnRyb2xzOiBcXFwiLi4uXFxcIiwgXFxcImV4cGVyaWVuY2VzXFxcIiwgXFxcInVubXV0ZS9tdXRlXFxcIiAqL1xcbiAgI19fbmV4dCA+IG1haW4gPiBkaXYgPiBkaXYgPiBkaXYuZml4ZWQudG9wLTQucmlnaHQtNiA+IGJ1dHRvbixcXG4gIGRpdltkYXRhLXByb2plY3Rpb24taWQ9XFxcIjEyXFxcIl0gPiBidXR0b24ge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDIpO1xcbiAgICB6LWluZGV4OiA1MDtcXG4gIH1cXG4gIC8qIG92ZXJyaWRlIFJlYWN0IGNoYW5nZXMgb24gYXVkaW8gYnV0dG9uICovXFxuICBidXR0b25bZGF0YS1wcm9qZWN0aW9uLWlkPVxcXCIxNlxcXCJdID4gZGl2W2RhdGEtcHJvamVjdGlvbi1pZD1cXFwiMTdcXFwiXSxcXG4gIGJ1dHRvbltkYXRhLXByb2plY3Rpb24taWQ9XFxcIjE2XFxcIl0gPiBkaXZbZGF0YS1wcm9qZWN0aW9uLWlkPVxcXCIxOFxcXCJdIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgyKSAhaW1wb3J0YW50O1xcbiAgICB6LWluZGV4OiA1MDtcXG4gIH1cXG4gIC8qIGhpZGUgZm9vdGVyICovXFxuICAjc2F5cGktZm9vdGVyIHtcXG4gICAgZGlzcGxheTogbm9uZTtcXG4gIH1cXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGBAa2V5ZnJhbWVzIHB1bHNlX291dGVybW9zdCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkyKTtcbiAgfVxufVxuLm91dGVybW9zdCB7XG4gIGFuaW1hdGlvbjogcHVsc2Vfb3V0ZXJtb3N0IDVzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbkBrZXlmcmFtZXMgcHVsc2Vfc2Vjb25kIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODU2KTtcbiAgfVxufVxuLnNlY29uZCB7XG4gIGFuaW1hdGlvbjogcHVsc2Vfc2Vjb25kIDVzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbkBrZXlmcmFtZXMgcHVsc2VfdGhpcmQge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43OTIpO1xuICB9XG59XG4udGhpcmQge1xuICBhbmltYXRpb246IHB1bHNlX3RoaXJkIDVzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbkBrZXlmcmFtZXMgcHVsc2VfZm91cnRoIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNzI4KTtcbiAgfVxufVxuLmZvdXJ0aCB7XG4gIGFuaW1hdGlvbjogcHVsc2VfZm91cnRoIDVzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbkBrZXlmcmFtZXMgcHVsc2VfZmlmdGgge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC42NjQpO1xuICB9XG59XG4uZmlmdGgge1xuICBhbmltYXRpb246IHB1bHNlX2ZpZnRoIDVzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbkBrZXlmcmFtZXMgcHVsc2VfaW5uZXJtb3N0IHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNik7XG4gIH1cbn1cbi5pbm5lcm1vc3Qge1xuICBhbmltYXRpb246IHB1bHNlX2lubmVybW9zdCA1cyBpbmZpbml0ZTtcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xufVxuXG4vKiBib3VuY2UgYW5pbWF0aW9uIHRvIGluZGljYXRlIFBpIGlzIHdhaXRpbmcgdG8gc3BlYWsgKi9cbkBrZXlmcmFtZXMgYm91bmNlX291dGVybW9zdCB7XG4gIDAlLFxuICAyMCUsXG4gIDUwJSxcbiAgODAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gIH1cbiAgNDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUlKTtcbiAgfVxuICA2MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMyUpO1xuICB9XG59XG4ub3V0ZXJtb3N0LnJlYWR5VG9SZXNwb25kIHtcbiAgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZV9vdXRlcm1vc3Q7XG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xufVxuXG5Aa2V5ZnJhbWVzIGJvdW5jZV9zZWNvbmQge1xuICAwJSxcbiAgMjAlLFxuICA1MCUsXG4gIDgwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xuICB9XG4gIDQwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01LjglKTtcbiAgfVxuICA2MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMy40OCUpO1xuICB9XG59XG4uc2Vjb25kLnJlYWR5VG9SZXNwb25kIHtcbiAgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZV9zZWNvbmQ7XG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xufVxuXG5Aa2V5ZnJhbWVzIGJvdW5jZV90aGlyZCB7XG4gIDAlLFxuICAyMCUsXG4gIDUwJSxcbiAgODAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gIH1cbiAgNDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTYuNiUpO1xuICB9XG4gIDYwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0zLjk2JSk7XG4gIH1cbn1cbi50aGlyZC5yZWFkeVRvUmVzcG9uZCB7XG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2VfdGhpcmQ7XG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xufVxuXG5Aa2V5ZnJhbWVzIGJvdW5jZV9mb3VydGgge1xuICAwJSxcbiAgMjAlLFxuICA1MCUsXG4gIDgwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xuICB9XG4gIDQwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC03LjQlKTtcbiAgfVxuICA2MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNC40NCUpO1xuICB9XG59XG4uZm91cnRoLnJlYWR5VG9SZXNwb25kIHtcbiAgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZV9mb3VydGg7XG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xufVxuXG5Aa2V5ZnJhbWVzIGJvdW5jZV9maWZ0aCB7XG4gIDAlLFxuICAyMCUsXG4gIDUwJSxcbiAgODAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gIH1cbiAgNDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTguMiUpO1xuICB9XG4gIDYwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC00LjkyJSk7XG4gIH1cbn1cbi5maWZ0aC5yZWFkeVRvUmVzcG9uZCB7XG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2VfZmlmdGg7XG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xufVxuXG5Aa2V5ZnJhbWVzIGJvdW5jZV9pbm5lcm1vc3Qge1xuICAwJSxcbiAgMjAlLFxuICA1MCUsXG4gIDgwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xuICB9XG4gIDQwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC05JSk7XG4gIH1cbiAgNjAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUuNCUpO1xuICB9XG59XG4uaW5uZXJtb3N0LnJlYWR5VG9SZXNwb25kIHtcbiAgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZV9pbm5lcm1vc3Q7XG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xufVxuXG4vKiBwbGF5ZnVsIGFuaW1hdGlvbiB0byBpbmRpY2F0ZSBQaSBpcyBzcGVha2luZyAqL1xuQGtleWZyYW1lcyBzcGVha2luZ19vdXRlcm1vc3Qge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKSByb3RhdGUoMGRlZyk7XG4gIH1cbiAgMjUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTk1KTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45KTtcbiAgfVxuICA3NSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44OTUpO1xuICB9XG59XG4ub3V0ZXJtb3N0LnBpU3BlYWtpbmcge1xuICBhbmltYXRpb246IHNwZWFraW5nX291dGVybW9zdCAycyBpbmZpbml0ZTtcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xufVxuXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX3NlY29uZCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpIHJvdGF0ZSgwZGVnKTtcbiAgfVxuICAyNSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45OCkgcm90YXRlKC0xZGVnKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44Nykgcm90YXRlKDBkZWcpO1xuICB9XG4gIDc1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjg2NSkgcm90YXRlKDFkZWcpO1xuICB9XG59XG4uc2Vjb25kLnBpU3BlYWtpbmcge1xuICBhbmltYXRpb246IHNwZWFraW5nX3NlY29uZCAycyBpbmZpbml0ZTtcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xufVxuXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX3RoaXJkIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSkgcm90YXRlKDBkZWcpO1xuICB9XG4gIDI1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjk2NSkgcm90YXRlKC0yZGVnKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44NCkgcm90YXRlKDBkZWcpO1xuICB9XG4gIDc1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjgzNSkgcm90YXRlKDJkZWcpO1xuICB9XG59XG4udGhpcmQucGlTcGVha2luZyB7XG4gIGFuaW1hdGlvbjogc3BlYWtpbmdfdGhpcmQgMnMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBzcGVha2luZ19mb3VydGgge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKSByb3RhdGUoMGRlZyk7XG4gIH1cbiAgMjUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTUpIHJvdGF0ZSgtM2RlZyk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODEpIHJvdGF0ZSgwZGVnKTtcbiAgfVxuICA3NSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44MDUpIHJvdGF0ZSgzZGVnKTtcbiAgfVxufVxuLmZvdXJ0aC5waVNwZWFraW5nIHtcbiAgYW5pbWF0aW9uOiBzcGVha2luZ19mb3VydGggMnMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBzcGVha2luZ19maWZ0aCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpIHJvdGF0ZSgwZGVnKTtcbiAgfVxuICAyNSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45MzUpIHJvdGF0ZSgtNGRlZyk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNzgpIHJvdGF0ZSgwZGVnKTtcbiAgfVxuICA3NSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43NzUpIHJvdGF0ZSg0ZGVnKTtcbiAgfVxufVxuLmZpZnRoLnBpU3BlYWtpbmcge1xuICBhbmltYXRpb246IHNwZWFraW5nX2ZpZnRoIDJzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbkBrZXlmcmFtZXMgc3BlYWtpbmdfaW5uZXJtb3N0IHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSkgcm90YXRlKDBkZWcpO1xuICB9XG4gIDI1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkyKSByb3RhdGUoLTVkZWcpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjc1KSByb3RhdGUoMGRlZyk7XG4gIH1cbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNzQ1KSByb3RhdGUoNWRlZyk7XG4gIH1cbn1cbi5pbm5lcm1vc3QucGlTcGVha2luZyB7XG4gIGFuaW1hdGlvbjogc3BlYWtpbmdfaW5uZXJtb3N0IDJzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbi8qIHdhdmUgYW5pbWF0aW9uIHRvIGluZGljYXRlIHVzZXIgaXMgc3BlYWtpbmcgKi9cbkBrZXlmcmFtZXMgdXNlclNwZWFraW5nQW5pbWF0aW9uIHtcbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjA1KSBzY2FsZVgodmFyKC0td2lkdGgtZmFjdG9yKSlcbiAgICAgIHRyYW5zbGF0ZVgoY2FsYygtNTAlICsgdmFyKC0tc3ByZWFkLWFtb3VudCkpKTtcbiAgfVxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgxKSBzY2FsZVgodmFyKC0td2lkdGgtZmFjdG9yKSlcbiAgICAgIHRyYW5zbGF0ZVgoY2FsYygtNTAlICsgdmFyKC0tc3ByZWFkLWFtb3VudCkpKTtcbiAgfVxufVxuLyogdXNlciBzcGVha2luZyBvc2NpbGxhdGlvbiBhbmltYXRpb24gKi9cbkBrZXlmcmFtZXMgd2F2ZWZvcm1fb3V0ZXJtb3N0IHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDEpIHNjYWxlWCgxKTtcbiAgfVxuICAyNSUsXG4gIDc1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC45KSBzY2FsZVgoMC45KTtcbiAgfVxufVxuXG5Aa2V5ZnJhbWVzIHdhdmVmb3JtX3NlY29uZCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjkpIHNjYWxlWCgwLjkpO1xuICB9XG4gIDI1JSxcbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjgpIHNjYWxlWCgwLjgpO1xuICB9XG59XG5cbkBrZXlmcmFtZXMgd2F2ZWZvcm1fdGhpcmQge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC44KSBzY2FsZVgoMC44KTtcbiAgfVxuICAyNSUsXG4gIDc1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC43KSBzY2FsZVgoMC43KTtcbiAgfVxufVxuXG5Aa2V5ZnJhbWVzIHdhdmVmb3JtX2ZvdXJ0aCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjcpIHNjYWxlWCgwLjcpO1xuICB9XG4gIDI1JSxcbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjYpIHNjYWxlWCgwLjYpO1xuICB9XG59XG5cbkBrZXlmcmFtZXMgd2F2ZWZvcm1fZmlmdGgge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC42KSBzY2FsZVgoMC42KTtcbiAgfVxuICAyNSUsXG4gIDc1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC41KSBzY2FsZVgoMC41KTtcbiAgfVxufVxuXG5Aa2V5ZnJhbWVzIHdhdmVmb3JtX2lubmVybW9zdCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjUpIHNjYWxlWCgwLjUpO1xuICB9XG4gIDI1JSxcbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjQpIHNjYWxlWCgwLjQpO1xuICB9XG59XG5cbi5vdXRlcm1vc3QudXNlclNwZWFraW5nIHtcbiAgYW5pbWF0aW9uOiB3YXZlZm9ybV9vdXRlcm1vc3QgMC43cyBpbmZpbml0ZSBhbHRlcm5hdGU7XG59XG5cbi5zZWNvbmQudXNlclNwZWFraW5nIHtcbiAgYW5pbWF0aW9uOiB3YXZlZm9ybV9zZWNvbmQgMC42NXMgaW5maW5pdGUgYWx0ZXJuYXRlO1xufVxuXG4udGhpcmQudXNlclNwZWFraW5nIHtcbiAgYW5pbWF0aW9uOiB3YXZlZm9ybV90aGlyZCAwLjZzIGluZmluaXRlIGFsdGVybmF0ZTtcbn1cblxuLmZvdXJ0aC51c2VyU3BlYWtpbmcge1xuICBhbmltYXRpb246IHdhdmVmb3JtX2ZvdXJ0aCAwLjU1cyBpbmZpbml0ZSBhbHRlcm5hdGU7XG59XG5cbi5maWZ0aC51c2VyU3BlYWtpbmcge1xuICBhbmltYXRpb246IHdhdmVmb3JtX2ZpZnRoIDAuNXMgaW5maW5pdGUgYWx0ZXJuYXRlO1xufVxuXG4uaW5uZXJtb3N0LnVzZXJTcGVha2luZyB7XG4gIGFuaW1hdGlvbjogd2F2ZWZvcm1faW5uZXJtb3N0IDAuNDVzIGluZmluaXRlIGFsdGVybmF0ZTtcbn1cblxuLyogZmxpcGNhcmQgYW5pbWF0aW9uIHRvIGluZGljYXRlIFNheSwgUGkgaXMgdHJhbnNjcmliaW5nIGF1ZGlvIHRvIHRleHQgKi9cbkBrZXlmcmFtZXMgdHJhbnNjcmliaW5nRmxpcCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZVkoMGRlZyk7XG4gICAgZmlsbDogdmFyKC0tb3JpZ2luYWwtY29sb3IpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGVZKDE4MGRlZyk7XG4gICAgZmlsbDogdmFyKC0tdHJhbnNjcmliaW5nLWNvbG9yKTtcbiAgfVxufVxuXG4ub3V0ZXJtb3N0LnRyYW5zY3JpYmluZyB7XG4gIC0tb3JpZ2luYWwtY29sb3I6ICNlNGYyZDE7XG4gIC0tdHJhbnNjcmliaW5nLWNvbG9yOiAjYjNlMGZlO1xuICBhbmltYXRpb246IHRyYW5zY3JpYmluZ0ZsaXAgMS41cyBpbmZpbml0ZTtcbn1cblxuLnNlY29uZC50cmFuc2NyaWJpbmcge1xuICAtLW9yaWdpbmFsLWNvbG9yOiAjY2NlOGI1O1xuICAtLXRyYW5zY3JpYmluZy1jb2xvcjogIzg5YzJmZjtcbiAgYW5pbWF0aW9uOiB0cmFuc2NyaWJpbmdGbGlwIDEuNnMgaW5maW5pdGU7XG59XG5cbi50aGlyZC50cmFuc2NyaWJpbmcge1xuICAtLW9yaWdpbmFsLWNvbG9yOiAjYjNkYjk1O1xuICAtLXRyYW5zY3JpYmluZy1jb2xvcjogIzVmYTRmZjtcbiAgYW5pbWF0aW9uOiB0cmFuc2NyaWJpbmdGbGlwIDEuN3MgaW5maW5pdGU7XG59XG5cbi5mb3VydGgudHJhbnNjcmliaW5nIHtcbiAgLS1vcmlnaW5hbC1jb2xvcjogIzliZDA3ODtcbiAgLS10cmFuc2NyaWJpbmctY29sb3I6ICMzNTg2ZmY7XG4gIGFuaW1hdGlvbjogdHJhbnNjcmliaW5nRmxpcCAxLjhzIGluZmluaXRlO1xufVxuXG4uZmlmdGgudHJhbnNjcmliaW5nIHtcbiAgLS1vcmlnaW5hbC1jb2xvcjogIzgzYzU1YztcbiAgLS10cmFuc2NyaWJpbmctY29sb3I6ICMwYjY5ZTM7XG4gIGFuaW1hdGlvbjogdHJhbnNjcmliaW5nRmxpcCAxLjlzIGluZmluaXRlO1xufVxuXG4uaW5uZXJtb3N0LnRyYW5zY3JpYmluZyB7XG4gIC0tb3JpZ2luYWwtY29sb3I6ICM0MjhhMmY7XG4gIC0tdHJhbnNjcmliaW5nLWNvbG9yOiAjMDA1M2JmO1xuICBhbmltYXRpb246IHRyYW5zY3JpYmluZ0ZsaXAgMnMgaW5maW5pdGU7XG59XG5cbi8qIGluaGFsYXRpb24gYW5pbWF0aW9uIHRvIGluZGljYXRlIFBpIGlzIHByZXBhcmluZyB0byBzcGVhayAqL1xuQGtleWZyYW1lcyBsb2FkaW5nSW5oYWxhdGlvbiB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxLjA1KTsgLyogU2xpZ2h0bHkgc2NhbGVkIHVwICovXG4gIH1cbn1cblxuLm91dGVybW9zdC5sb2FkaW5nIHtcbiAgYW5pbWF0aW9uOiBsb2FkaW5nSW5oYWxhdGlvbiAycyBpbmZpbml0ZTtcbn1cblxuLnNlY29uZC5sb2FkaW5nIHtcbiAgYW5pbWF0aW9uOiBsb2FkaW5nSW5oYWxhdGlvbiAyLjFzIGluZmluaXRlO1xufVxuXG4udGhpcmQubG9hZGluZyB7XG4gIGFuaW1hdGlvbjogbG9hZGluZ0luaGFsYXRpb24gMi4ycyBpbmZpbml0ZTtcbn1cblxuLmZvdXJ0aC5sb2FkaW5nIHtcbiAgYW5pbWF0aW9uOiBsb2FkaW5nSW5oYWxhdGlvbiAyLjNzIGluZmluaXRlO1xufVxuXG4uZmlmdGgubG9hZGluZyB7XG4gIGFuaW1hdGlvbjogbG9hZGluZ0luaGFsYXRpb24gMi40cyBpbmZpbml0ZTtcbn1cblxuLmlubmVybW9zdC5sb2FkaW5nIHtcbiAgYW5pbWF0aW9uOiBsb2FkaW5nSW5oYWxhdGlvbiAyLjVzIGluZmluaXRlO1xufVxuYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvcmVjdGFuZ2xlcy5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDRTs7SUFFRSxtQkFBbUI7RUFDckI7RUFDQTtJQUNFLHNCQUFzQjtFQUN4QjtBQUNGO0FBQ0E7RUFDRSxzQ0FBc0M7RUFDdEMsd0JBQXdCO0FBQzFCOztBQUVBO0VBQ0U7O0lBRUUsbUJBQW1CO0VBQ3JCO0VBQ0E7SUFDRSx1QkFBdUI7RUFDekI7QUFDRjtBQUNBO0VBQ0UsbUNBQW1DO0VBQ25DLHdCQUF3QjtBQUMxQjs7QUFFQTtFQUNFOztJQUVFLG1CQUFtQjtFQUNyQjtFQUNBO0lBQ0UsdUJBQXVCO0VBQ3pCO0FBQ0Y7QUFDQTtFQUNFLGtDQUFrQztFQUNsQyx3QkFBd0I7QUFDMUI7O0FBRUE7RUFDRTs7SUFFRSxtQkFBbUI7RUFDckI7RUFDQTtJQUNFLHVCQUF1QjtFQUN6QjtBQUNGO0FBQ0E7RUFDRSxtQ0FBbUM7RUFDbkMsd0JBQXdCO0FBQzFCOztBQUVBO0VBQ0U7O0lBRUUsbUJBQW1CO0VBQ3JCO0VBQ0E7SUFDRSx1QkFBdUI7RUFDekI7QUFDRjtBQUNBO0VBQ0Usa0NBQWtDO0VBQ2xDLHdCQUF3QjtBQUMxQjs7QUFFQTtFQUNFOztJQUVFLG1CQUFtQjtFQUNyQjtFQUNBO0lBQ0UscUJBQXFCO0VBQ3ZCO0FBQ0Y7QUFDQTtFQUNFLHNDQUFzQztFQUN0Qyx3QkFBd0I7QUFDMUI7O0FBRUEsd0RBQXdEO0FBQ3hEO0VBQ0U7Ozs7O0lBS0Usd0JBQXdCO0VBQzFCO0VBQ0E7SUFDRSwwQkFBMEI7RUFDNUI7RUFDQTtJQUNFLDBCQUEwQjtFQUM1QjtBQUNGO0FBQ0E7RUFDRSxnQ0FBZ0M7RUFDaEMsc0JBQXNCO0VBQ3RCLG1DQUFtQztBQUNyQzs7QUFFQTtFQUNFOzs7OztJQUtFLHdCQUF3QjtFQUMxQjtFQUNBO0lBQ0UsNEJBQTRCO0VBQzlCO0VBQ0E7SUFDRSw2QkFBNkI7RUFDL0I7QUFDRjtBQUNBO0VBQ0UsNkJBQTZCO0VBQzdCLHNCQUFzQjtFQUN0QixtQ0FBbUM7QUFDckM7O0FBRUE7RUFDRTs7Ozs7SUFLRSx3QkFBd0I7RUFDMUI7RUFDQTtJQUNFLDRCQUE0QjtFQUM5QjtFQUNBO0lBQ0UsNkJBQTZCO0VBQy9CO0FBQ0Y7QUFDQTtFQUNFLDRCQUE0QjtFQUM1QixzQkFBc0I7RUFDdEIsbUNBQW1DO0FBQ3JDOztBQUVBO0VBQ0U7Ozs7O0lBS0Usd0JBQXdCO0VBQzFCO0VBQ0E7SUFDRSw0QkFBNEI7RUFDOUI7RUFDQTtJQUNFLDZCQUE2QjtFQUMvQjtBQUNGO0FBQ0E7RUFDRSw2QkFBNkI7RUFDN0Isc0JBQXNCO0VBQ3RCLG1DQUFtQztBQUNyQzs7QUFFQTtFQUNFOzs7OztJQUtFLHdCQUF3QjtFQUMxQjtFQUNBO0lBQ0UsNEJBQTRCO0VBQzlCO0VBQ0E7SUFDRSw2QkFBNkI7RUFDL0I7QUFDRjtBQUNBO0VBQ0UsNEJBQTRCO0VBQzVCLHNCQUFzQjtFQUN0QixtQ0FBbUM7QUFDckM7O0FBRUE7RUFDRTs7Ozs7SUFLRSx3QkFBd0I7RUFDMUI7RUFDQTtJQUNFLDBCQUEwQjtFQUM1QjtFQUNBO0lBQ0UsNEJBQTRCO0VBQzlCO0FBQ0Y7QUFDQTtFQUNFLGdDQUFnQztFQUNoQyxzQkFBc0I7RUFDdEIsbUNBQW1DO0FBQ3JDOztBQUVBLGlEQUFpRDtBQUNqRDtFQUNFOztJQUVFLGdDQUFnQztFQUNsQztFQUNBO0lBQ0UsdUJBQXVCO0VBQ3pCO0VBQ0E7SUFDRSxxQkFBcUI7RUFDdkI7RUFDQTtJQUNFLHVCQUF1QjtFQUN6QjtBQUNGO0FBQ0E7RUFDRSx5Q0FBeUM7RUFDekMsd0JBQXdCO0FBQzFCOztBQUVBO0VBQ0U7O0lBRUUsZ0NBQWdDO0VBQ2xDO0VBQ0E7SUFDRSxvQ0FBb0M7RUFDdEM7RUFDQTtJQUNFLG1DQUFtQztFQUNyQztFQUNBO0lBQ0Usb0NBQW9DO0VBQ3RDO0FBQ0Y7QUFDQTtFQUNFLHNDQUFzQztFQUN0Qyx3QkFBd0I7QUFDMUI7O0FBRUE7RUFDRTs7SUFFRSxnQ0FBZ0M7RUFDbEM7RUFDQTtJQUNFLHFDQUFxQztFQUN2QztFQUNBO0lBQ0UsbUNBQW1DO0VBQ3JDO0VBQ0E7SUFDRSxvQ0FBb0M7RUFDdEM7QUFDRjtBQUNBO0VBQ0UscUNBQXFDO0VBQ3JDLHdCQUF3QjtBQUMxQjs7QUFFQTtFQUNFOztJQUVFLGdDQUFnQztFQUNsQztFQUNBO0lBQ0Usb0NBQW9DO0VBQ3RDO0VBQ0E7SUFDRSxtQ0FBbUM7RUFDckM7RUFDQTtJQUNFLG9DQUFvQztFQUN0QztBQUNGO0FBQ0E7RUFDRSxzQ0FBc0M7RUFDdEMsd0JBQXdCO0FBQzFCOztBQUVBO0VBQ0U7O0lBRUUsZ0NBQWdDO0VBQ2xDO0VBQ0E7SUFDRSxxQ0FBcUM7RUFDdkM7RUFDQTtJQUNFLG1DQUFtQztFQUNyQztFQUNBO0lBQ0Usb0NBQW9DO0VBQ3RDO0FBQ0Y7QUFDQTtFQUNFLHFDQUFxQztFQUNyQyx3QkFBd0I7QUFDMUI7O0FBRUE7RUFDRTs7SUFFRSxnQ0FBZ0M7RUFDbEM7RUFDQTtJQUNFLG9DQUFvQztFQUN0QztFQUNBO0lBQ0UsbUNBQW1DO0VBQ3JDO0VBQ0E7SUFDRSxvQ0FBb0M7RUFDdEM7QUFDRjtBQUNBO0VBQ0UseUNBQXlDO0VBQ3pDLHdCQUF3QjtBQUMxQjs7QUFFQSxnREFBZ0Q7QUFDaEQ7RUFDRTtJQUNFO21EQUMrQztFQUNqRDtFQUNBO0lBQ0U7bURBQytDO0VBQ2pEO0FBQ0Y7QUFDQSx3Q0FBd0M7QUFDeEM7RUFDRTs7SUFFRSw4QkFBOEI7RUFDaEM7RUFDQTs7SUFFRSxrQ0FBa0M7RUFDcEM7QUFDRjs7QUFFQTtFQUNFOztJQUVFLGtDQUFrQztFQUNwQztFQUNBOztJQUVFLGtDQUFrQztFQUNwQztBQUNGOztBQUVBO0VBQ0U7O0lBRUUsa0NBQWtDO0VBQ3BDO0VBQ0E7O0lBRUUsa0NBQWtDO0VBQ3BDO0FBQ0Y7O0FBRUE7RUFDRTs7SUFFRSxrQ0FBa0M7RUFDcEM7RUFDQTs7SUFFRSxrQ0FBa0M7RUFDcEM7QUFDRjs7QUFFQTtFQUNFOztJQUVFLGtDQUFrQztFQUNwQztFQUNBOztJQUVFLGtDQUFrQztFQUNwQztBQUNGOztBQUVBO0VBQ0U7O0lBRUUsa0NBQWtDO0VBQ3BDO0VBQ0E7O0lBRUUsa0NBQWtDO0VBQ3BDO0FBQ0Y7O0FBRUE7RUFDRSxxREFBcUQ7QUFDdkQ7O0FBRUE7RUFDRSxtREFBbUQ7QUFDckQ7O0FBRUE7RUFDRSxpREFBaUQ7QUFDbkQ7O0FBRUE7RUFDRSxtREFBbUQ7QUFDckQ7O0FBRUE7RUFDRSxpREFBaUQ7QUFDbkQ7O0FBRUE7RUFDRSxzREFBc0Q7QUFDeEQ7O0FBRUEseUVBQXlFO0FBQ3pFO0VBQ0U7O0lBRUUsd0JBQXdCO0lBQ3hCLDJCQUEyQjtFQUM3QjtFQUNBO0lBQ0UsMEJBQTBCO0lBQzFCLCtCQUErQjtFQUNqQztBQUNGOztBQUVBO0VBQ0UseUJBQXlCO0VBQ3pCLDZCQUE2QjtFQUM3Qix5Q0FBeUM7QUFDM0M7O0FBRUE7RUFDRSx5QkFBeUI7RUFDekIsNkJBQTZCO0VBQzdCLHlDQUF5QztBQUMzQzs7QUFFQTtFQUNFLHlCQUF5QjtFQUN6Qiw2QkFBNkI7RUFDN0IseUNBQXlDO0FBQzNDOztBQUVBO0VBQ0UseUJBQXlCO0VBQ3pCLDZCQUE2QjtFQUM3Qix5Q0FBeUM7QUFDM0M7O0FBRUE7RUFDRSx5QkFBeUI7RUFDekIsNkJBQTZCO0VBQzdCLHlDQUF5QztBQUMzQzs7QUFFQTtFQUNFLHlCQUF5QjtFQUN6Qiw2QkFBNkI7RUFDN0IsdUNBQXVDO0FBQ3pDOztBQUVBLDhEQUE4RDtBQUM5RDtFQUNFOztJQUVFLG1CQUFtQjtFQUNyQjtFQUNBO0lBQ0Usc0JBQXNCLEVBQUUsdUJBQXVCO0VBQ2pEO0FBQ0Y7O0FBRUE7RUFDRSx3Q0FBd0M7QUFDMUM7O0FBRUE7RUFDRSwwQ0FBMEM7QUFDNUM7O0FBRUE7RUFDRSwwQ0FBMEM7QUFDNUM7O0FBRUE7RUFDRSwwQ0FBMEM7QUFDNUM7O0FBRUE7RUFDRSwwQ0FBMEM7QUFDNUM7O0FBRUE7RUFDRSwwQ0FBMEM7QUFDNUNcIixcInNvdXJjZXNDb250ZW50XCI6W1wiQGtleWZyYW1lcyBwdWxzZV9vdXRlcm1vc3Qge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45Mik7XFxuICB9XFxufVxcbi5vdXRlcm1vc3Qge1xcbiAgYW5pbWF0aW9uOiBwdWxzZV9vdXRlcm1vc3QgNXMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbkBrZXlmcmFtZXMgcHVsc2Vfc2Vjb25kIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODU2KTtcXG4gIH1cXG59XFxuLnNlY29uZCB7XFxuICBhbmltYXRpb246IHB1bHNlX3NlY29uZCA1cyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuQGtleWZyYW1lcyBwdWxzZV90aGlyZCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjc5Mik7XFxuICB9XFxufVxcbi50aGlyZCB7XFxuICBhbmltYXRpb246IHB1bHNlX3RoaXJkIDVzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHB1bHNlX2ZvdXJ0aCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjcyOCk7XFxuICB9XFxufVxcbi5mb3VydGgge1xcbiAgYW5pbWF0aW9uOiBwdWxzZV9mb3VydGggNXMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbkBrZXlmcmFtZXMgcHVsc2VfZmlmdGgge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC42NjQpO1xcbiAgfVxcbn1cXG4uZmlmdGgge1xcbiAgYW5pbWF0aW9uOiBwdWxzZV9maWZ0aCA1cyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuQGtleWZyYW1lcyBwdWxzZV9pbm5lcm1vc3Qge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC42KTtcXG4gIH1cXG59XFxuLmlubmVybW9zdCB7XFxuICBhbmltYXRpb246IHB1bHNlX2lubmVybW9zdCA1cyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuLyogYm91bmNlIGFuaW1hdGlvbiB0byBpbmRpY2F0ZSBQaSBpcyB3YWl0aW5nIHRvIHNwZWFrICovXFxuQGtleWZyYW1lcyBib3VuY2Vfb3V0ZXJtb3N0IHtcXG4gIDAlLFxcbiAgMjAlLFxcbiAgNTAlLFxcbiAgODAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcXG4gIH1cXG4gIDQwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNSUpO1xcbiAgfVxcbiAgNjAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0zJSk7XFxuICB9XFxufVxcbi5vdXRlcm1vc3QucmVhZHlUb1Jlc3BvbmQge1xcbiAgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZV9vdXRlcm1vc3Q7XFxuICBhbmltYXRpb24tZHVyYXRpb246IDJzO1xcbiAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGU7XFxufVxcblxcbkBrZXlmcmFtZXMgYm91bmNlX3NlY29uZCB7XFxuICAwJSxcXG4gIDIwJSxcXG4gIDUwJSxcXG4gIDgwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XFxuICB9XFxuICA0MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUuOCUpO1xcbiAgfVxcbiAgNjAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0zLjQ4JSk7XFxuICB9XFxufVxcbi5zZWNvbmQucmVhZHlUb1Jlc3BvbmQge1xcbiAgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZV9zZWNvbmQ7XFxuICBhbmltYXRpb24tZHVyYXRpb246IDJzO1xcbiAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGU7XFxufVxcblxcbkBrZXlmcmFtZXMgYm91bmNlX3RoaXJkIHtcXG4gIDAlLFxcbiAgMjAlLFxcbiAgNTAlLFxcbiAgODAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcXG4gIH1cXG4gIDQwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNi42JSk7XFxuICB9XFxuICA2MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTMuOTYlKTtcXG4gIH1cXG59XFxuLnRoaXJkLnJlYWR5VG9SZXNwb25kIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2VfdGhpcmQ7XFxuICBhbmltYXRpb24tZHVyYXRpb246IDJzO1xcbiAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGU7XFxufVxcblxcbkBrZXlmcmFtZXMgYm91bmNlX2ZvdXJ0aCB7XFxuICAwJSxcXG4gIDIwJSxcXG4gIDUwJSxcXG4gIDgwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XFxuICB9XFxuICA0MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTcuNCUpO1xcbiAgfVxcbiAgNjAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC00LjQ0JSk7XFxuICB9XFxufVxcbi5mb3VydGgucmVhZHlUb1Jlc3BvbmQge1xcbiAgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZV9mb3VydGg7XFxuICBhbmltYXRpb24tZHVyYXRpb246IDJzO1xcbiAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGU7XFxufVxcblxcbkBrZXlmcmFtZXMgYm91bmNlX2ZpZnRoIHtcXG4gIDAlLFxcbiAgMjAlLFxcbiAgNTAlLFxcbiAgODAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcXG4gIH1cXG4gIDQwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtOC4yJSk7XFxuICB9XFxuICA2MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTQuOTIlKTtcXG4gIH1cXG59XFxuLmZpZnRoLnJlYWR5VG9SZXNwb25kIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2VfZmlmdGg7XFxuICBhbmltYXRpb24tZHVyYXRpb246IDJzO1xcbiAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGU7XFxufVxcblxcbkBrZXlmcmFtZXMgYm91bmNlX2lubmVybW9zdCB7XFxuICAwJSxcXG4gIDIwJSxcXG4gIDUwJSxcXG4gIDgwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XFxuICB9XFxuICA0MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTklKTtcXG4gIH1cXG4gIDYwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNS40JSk7XFxuICB9XFxufVxcbi5pbm5lcm1vc3QucmVhZHlUb1Jlc3BvbmQge1xcbiAgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZV9pbm5lcm1vc3Q7XFxuICBhbmltYXRpb24tZHVyYXRpb246IDJzO1xcbiAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGU7XFxufVxcblxcbi8qIHBsYXlmdWwgYW5pbWF0aW9uIHRvIGluZGljYXRlIFBpIGlzIHNwZWFraW5nICovXFxuQGtleWZyYW1lcyBzcGVha2luZ19vdXRlcm1vc3Qge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKSByb3RhdGUoMGRlZyk7XFxuICB9XFxuICAyNSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTk1KTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45KTtcXG4gIH1cXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44OTUpO1xcbiAgfVxcbn1cXG4ub3V0ZXJtb3N0LnBpU3BlYWtpbmcge1xcbiAgYW5pbWF0aW9uOiBzcGVha2luZ19vdXRlcm1vc3QgMnMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbkBrZXlmcmFtZXMgc3BlYWtpbmdfc2Vjb25kIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSkgcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgMjUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjk4KSByb3RhdGUoLTFkZWcpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjg3KSByb3RhdGUoMGRlZyk7XFxuICB9XFxuICA3NSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODY1KSByb3RhdGUoMWRlZyk7XFxuICB9XFxufVxcbi5zZWNvbmQucGlTcGVha2luZyB7XFxuICBhbmltYXRpb246IHNwZWFraW5nX3NlY29uZCAycyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuQGtleWZyYW1lcyBzcGVha2luZ190aGlyZCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpIHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDI1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45NjUpIHJvdGF0ZSgtMmRlZyk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODQpIHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44MzUpIHJvdGF0ZSgyZGVnKTtcXG4gIH1cXG59XFxuLnRoaXJkLnBpU3BlYWtpbmcge1xcbiAgYW5pbWF0aW9uOiBzcGVha2luZ190aGlyZCAycyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuQGtleWZyYW1lcyBzcGVha2luZ19mb3VydGgge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKSByb3RhdGUoMGRlZyk7XFxuICB9XFxuICAyNSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTUpIHJvdGF0ZSgtM2RlZyk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODEpIHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44MDUpIHJvdGF0ZSgzZGVnKTtcXG4gIH1cXG59XFxuLmZvdXJ0aC5waVNwZWFraW5nIHtcXG4gIGFuaW1hdGlvbjogc3BlYWtpbmdfZm91cnRoIDJzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX2ZpZnRoIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSkgcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgMjUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkzNSkgcm90YXRlKC00ZGVnKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43OCkgcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgNzUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjc3NSkgcm90YXRlKDRkZWcpO1xcbiAgfVxcbn1cXG4uZmlmdGgucGlTcGVha2luZyB7XFxuICBhbmltYXRpb246IHNwZWFraW5nX2ZpZnRoIDJzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX2lubmVybW9zdCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpIHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDI1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45Mikgcm90YXRlKC01ZGVnKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43NSkgcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgNzUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjc0NSkgcm90YXRlKDVkZWcpO1xcbiAgfVxcbn1cXG4uaW5uZXJtb3N0LnBpU3BlYWtpbmcge1xcbiAgYW5pbWF0aW9uOiBzcGVha2luZ19pbm5lcm1vc3QgMnMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbi8qIHdhdmUgYW5pbWF0aW9uIHRvIGluZGljYXRlIHVzZXIgaXMgc3BlYWtpbmcgKi9cXG5Aa2V5ZnJhbWVzIHVzZXJTcGVha2luZ0FuaW1hdGlvbiB7XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjA1KSBzY2FsZVgodmFyKC0td2lkdGgtZmFjdG9yKSlcXG4gICAgICB0cmFuc2xhdGVYKGNhbGMoLTUwJSArIHZhcigtLXNwcmVhZC1hbW91bnQpKSk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMSkgc2NhbGVYKHZhcigtLXdpZHRoLWZhY3RvcikpXFxuICAgICAgdHJhbnNsYXRlWChjYWxjKC01MCUgKyB2YXIoLS1zcHJlYWQtYW1vdW50KSkpO1xcbiAgfVxcbn1cXG4vKiB1c2VyIHNwZWFraW5nIG9zY2lsbGF0aW9uIGFuaW1hdGlvbiAqL1xcbkBrZXlmcmFtZXMgd2F2ZWZvcm1fb3V0ZXJtb3N0IHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDEpIHNjYWxlWCgxKTtcXG4gIH1cXG4gIDI1JSxcXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuOSkgc2NhbGVYKDAuOSk7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgd2F2ZWZvcm1fc2Vjb25kIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuOSkgc2NhbGVYKDAuOSk7XFxuICB9XFxuICAyNSUsXFxuICA3NSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjgpIHNjYWxlWCgwLjgpO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIHdhdmVmb3JtX3RoaXJkIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuOCkgc2NhbGVYKDAuOCk7XFxuICB9XFxuICAyNSUsXFxuICA3NSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjcpIHNjYWxlWCgwLjcpO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIHdhdmVmb3JtX2ZvdXJ0aCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjcpIHNjYWxlWCgwLjcpO1xcbiAgfVxcbiAgMjUlLFxcbiAgNzUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC42KSBzY2FsZVgoMC42KTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyB3YXZlZm9ybV9maWZ0aCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjYpIHNjYWxlWCgwLjYpO1xcbiAgfVxcbiAgMjUlLFxcbiAgNzUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC41KSBzY2FsZVgoMC41KTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyB3YXZlZm9ybV9pbm5lcm1vc3Qge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC41KSBzY2FsZVgoMC41KTtcXG4gIH1cXG4gIDI1JSxcXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuNCkgc2NhbGVYKDAuNCk7XFxuICB9XFxufVxcblxcbi5vdXRlcm1vc3QudXNlclNwZWFraW5nIHtcXG4gIGFuaW1hdGlvbjogd2F2ZWZvcm1fb3V0ZXJtb3N0IDAuN3MgaW5maW5pdGUgYWx0ZXJuYXRlO1xcbn1cXG5cXG4uc2Vjb25kLnVzZXJTcGVha2luZyB7XFxuICBhbmltYXRpb246IHdhdmVmb3JtX3NlY29uZCAwLjY1cyBpbmZpbml0ZSBhbHRlcm5hdGU7XFxufVxcblxcbi50aGlyZC51c2VyU3BlYWtpbmcge1xcbiAgYW5pbWF0aW9uOiB3YXZlZm9ybV90aGlyZCAwLjZzIGluZmluaXRlIGFsdGVybmF0ZTtcXG59XFxuXFxuLmZvdXJ0aC51c2VyU3BlYWtpbmcge1xcbiAgYW5pbWF0aW9uOiB3YXZlZm9ybV9mb3VydGggMC41NXMgaW5maW5pdGUgYWx0ZXJuYXRlO1xcbn1cXG5cXG4uZmlmdGgudXNlclNwZWFraW5nIHtcXG4gIGFuaW1hdGlvbjogd2F2ZWZvcm1fZmlmdGggMC41cyBpbmZpbml0ZSBhbHRlcm5hdGU7XFxufVxcblxcbi5pbm5lcm1vc3QudXNlclNwZWFraW5nIHtcXG4gIGFuaW1hdGlvbjogd2F2ZWZvcm1faW5uZXJtb3N0IDAuNDVzIGluZmluaXRlIGFsdGVybmF0ZTtcXG59XFxuXFxuLyogZmxpcGNhcmQgYW5pbWF0aW9uIHRvIGluZGljYXRlIFNheSwgUGkgaXMgdHJhbnNjcmliaW5nIGF1ZGlvIHRvIHRleHQgKi9cXG5Aa2V5ZnJhbWVzIHRyYW5zY3JpYmluZ0ZsaXAge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiByb3RhdGVZKDBkZWcpO1xcbiAgICBmaWxsOiB2YXIoLS1vcmlnaW5hbC1jb2xvcik7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZVkoMTgwZGVnKTtcXG4gICAgZmlsbDogdmFyKC0tdHJhbnNjcmliaW5nLWNvbG9yKTtcXG4gIH1cXG59XFxuXFxuLm91dGVybW9zdC50cmFuc2NyaWJpbmcge1xcbiAgLS1vcmlnaW5hbC1jb2xvcjogI2U0ZjJkMTtcXG4gIC0tdHJhbnNjcmliaW5nLWNvbG9yOiAjYjNlMGZlO1xcbiAgYW5pbWF0aW9uOiB0cmFuc2NyaWJpbmdGbGlwIDEuNXMgaW5maW5pdGU7XFxufVxcblxcbi5zZWNvbmQudHJhbnNjcmliaW5nIHtcXG4gIC0tb3JpZ2luYWwtY29sb3I6ICNjY2U4YjU7XFxuICAtLXRyYW5zY3JpYmluZy1jb2xvcjogIzg5YzJmZjtcXG4gIGFuaW1hdGlvbjogdHJhbnNjcmliaW5nRmxpcCAxLjZzIGluZmluaXRlO1xcbn1cXG5cXG4udGhpcmQudHJhbnNjcmliaW5nIHtcXG4gIC0tb3JpZ2luYWwtY29sb3I6ICNiM2RiOTU7XFxuICAtLXRyYW5zY3JpYmluZy1jb2xvcjogIzVmYTRmZjtcXG4gIGFuaW1hdGlvbjogdHJhbnNjcmliaW5nRmxpcCAxLjdzIGluZmluaXRlO1xcbn1cXG5cXG4uZm91cnRoLnRyYW5zY3JpYmluZyB7XFxuICAtLW9yaWdpbmFsLWNvbG9yOiAjOWJkMDc4O1xcbiAgLS10cmFuc2NyaWJpbmctY29sb3I6ICMzNTg2ZmY7XFxuICBhbmltYXRpb246IHRyYW5zY3JpYmluZ0ZsaXAgMS44cyBpbmZpbml0ZTtcXG59XFxuXFxuLmZpZnRoLnRyYW5zY3JpYmluZyB7XFxuICAtLW9yaWdpbmFsLWNvbG9yOiAjODNjNTVjO1xcbiAgLS10cmFuc2NyaWJpbmctY29sb3I6ICMwYjY5ZTM7XFxuICBhbmltYXRpb246IHRyYW5zY3JpYmluZ0ZsaXAgMS45cyBpbmZpbml0ZTtcXG59XFxuXFxuLmlubmVybW9zdC50cmFuc2NyaWJpbmcge1xcbiAgLS1vcmlnaW5hbC1jb2xvcjogIzQyOGEyZjtcXG4gIC0tdHJhbnNjcmliaW5nLWNvbG9yOiAjMDA1M2JmO1xcbiAgYW5pbWF0aW9uOiB0cmFuc2NyaWJpbmdGbGlwIDJzIGluZmluaXRlO1xcbn1cXG5cXG4vKiBpbmhhbGF0aW9uIGFuaW1hdGlvbiB0byBpbmRpY2F0ZSBQaSBpcyBwcmVwYXJpbmcgdG8gc3BlYWsgKi9cXG5Aa2V5ZnJhbWVzIGxvYWRpbmdJbmhhbGF0aW9uIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMDUpOyAvKiBTbGlnaHRseSBzY2FsZWQgdXAgKi9cXG4gIH1cXG59XFxuXFxuLm91dGVybW9zdC5sb2FkaW5nIHtcXG4gIGFuaW1hdGlvbjogbG9hZGluZ0luaGFsYXRpb24gMnMgaW5maW5pdGU7XFxufVxcblxcbi5zZWNvbmQubG9hZGluZyB7XFxuICBhbmltYXRpb246IGxvYWRpbmdJbmhhbGF0aW9uIDIuMXMgaW5maW5pdGU7XFxufVxcblxcbi50aGlyZC5sb2FkaW5nIHtcXG4gIGFuaW1hdGlvbjogbG9hZGluZ0luaGFsYXRpb24gMi4ycyBpbmZpbml0ZTtcXG59XFxuXFxuLmZvdXJ0aC5sb2FkaW5nIHtcXG4gIGFuaW1hdGlvbjogbG9hZGluZ0luaGFsYXRpb24gMi4zcyBpbmZpbml0ZTtcXG59XFxuXFxuLmZpZnRoLmxvYWRpbmcge1xcbiAgYW5pbWF0aW9uOiBsb2FkaW5nSW5oYWxhdGlvbiAyLjRzIGluZmluaXRlO1xcbn1cXG5cXG4uaW5uZXJtb3N0LmxvYWRpbmcge1xcbiAgYW5pbWF0aW9uOiBsb2FkaW5nSW5oYWxhdGlvbiAyLjVzIGluZmluaXRlO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYEBrZXlmcmFtZXMgcHVsc2Uge1xuICAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45KTtcbiAgfVxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICB9XG59XG4jc2F5cGktdGFsa0J1dHRvbixcbi5wbGF5LWJ1dHRvbiB7XG4gIG1hcmdpbi10b3A6IDAuMjVyZW07XG4gIGJvcmRlci1yYWRpdXM6IDE4cHg7XG4gIHdpZHRoOiAxMjBweDtcbiAgZGlzcGxheTogYmxvY2s7IC8qIEZvciBTYWZhcmkgKi9cbn1cblxuaHRtbDpub3QoLmZpcmVmb3gtYW5kcm9pZCkgI3NheXBpLXRhbGtCdXR0b246YWN0aXZlIC53YXZlZm9ybSxcbiNzYXlwaS10YWxrQnV0dG9uLmFjdGl2ZSAud2F2ZWZvcm0ge1xuICBhbmltYXRpb246IHB1bHNlIDFzIGluZmluaXRlO1xufVxuI3NheXBpLXRhbGtCdXR0b24gLndhdmVmb3JtIHtcbiAgZmlsbDogIzc3NmQ2ZDtcbn1cbiNzYXlwaS10YWxrQnV0dG9uLmF1dG9TdWJtaXQgLndhdmVmb3JtIHtcbiAgZmlsbDogcmdiKDY1IDEzOCA0Nyk7IC8qIFBpJ3MgdGV4dC1icmFuZC1ncmVlbi02MDAgKi9cbn1cbi5oaWRkZW4ge1xuICBkaXNwbGF5OiBub25lO1xufVxuI3NheXBpLXBsYXlCdXR0b24ucGxheS1idXR0b24ge1xuICAvKiBwb3NpdGlvbiBvdmVyIHRoZSB0YWxrIGJ1dHRvbiwgYnV0IHVuZGVyIGFueSBjb250cm9scyAqL1xuICB6LWluZGV4OiA3MDsgLyogdGFsayBidXR0b24gei1pbmRleCBpcyA1OSBvciA2MCAqL1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDApOyAvKiB0cmFuc3BhcmVudCB3aXRob3V0IGhvbGVzICovXG4gIGJvcmRlcjogbm9uZTtcbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3RhbGtCdXR0b24uY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0U7SUFDRSxtQkFBbUI7RUFDckI7RUFDQTtJQUNFLHFCQUFxQjtFQUN2QjtFQUNBO0lBQ0UsbUJBQW1CO0VBQ3JCO0FBQ0Y7QUFDQTs7RUFFRSxtQkFBbUI7RUFDbkIsbUJBQW1CO0VBQ25CLFlBQVk7RUFDWixjQUFjLEVBQUUsZUFBZTtBQUNqQzs7QUFFQTs7RUFFRSw0QkFBNEI7QUFDOUI7QUFDQTtFQUNFLGFBQWE7QUFDZjtBQUNBO0VBQ0Usb0JBQW9CLEVBQUUsOEJBQThCO0FBQ3REO0FBQ0E7RUFDRSxhQUFhO0FBQ2Y7QUFDQTtFQUNFLDBEQUEwRDtFQUMxRCxXQUFXLEVBQUUsb0NBQW9DO0VBQ2pELGtDQUFrQyxFQUFFLDhCQUE4QjtFQUNsRSxZQUFZO0FBQ2RcIixcInNvdXJjZXNDb250ZW50XCI6W1wiQGtleWZyYW1lcyBwdWxzZSB7XFxuICAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOSk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gIH1cXG59XFxuI3NheXBpLXRhbGtCdXR0b24sXFxuLnBsYXktYnV0dG9uIHtcXG4gIG1hcmdpbi10b3A6IDAuMjVyZW07XFxuICBib3JkZXItcmFkaXVzOiAxOHB4O1xcbiAgd2lkdGg6IDEyMHB4O1xcbiAgZGlzcGxheTogYmxvY2s7IC8qIEZvciBTYWZhcmkgKi9cXG59XFxuXFxuaHRtbDpub3QoLmZpcmVmb3gtYW5kcm9pZCkgI3NheXBpLXRhbGtCdXR0b246YWN0aXZlIC53YXZlZm9ybSxcXG4jc2F5cGktdGFsa0J1dHRvbi5hY3RpdmUgLndhdmVmb3JtIHtcXG4gIGFuaW1hdGlvbjogcHVsc2UgMXMgaW5maW5pdGU7XFxufVxcbiNzYXlwaS10YWxrQnV0dG9uIC53YXZlZm9ybSB7XFxuICBmaWxsOiAjNzc2ZDZkO1xcbn1cXG4jc2F5cGktdGFsa0J1dHRvbi5hdXRvU3VibWl0IC53YXZlZm9ybSB7XFxuICBmaWxsOiByZ2IoNjUgMTM4IDQ3KTsgLyogUGkncyB0ZXh0LWJyYW5kLWdyZWVuLTYwMCAqL1xcbn1cXG4uaGlkZGVuIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcbiNzYXlwaS1wbGF5QnV0dG9uLnBsYXktYnV0dG9uIHtcXG4gIC8qIHBvc2l0aW9uIG92ZXIgdGhlIHRhbGsgYnV0dG9uLCBidXQgdW5kZXIgYW55IGNvbnRyb2xzICovXFxuICB6LWluZGV4OiA3MDsgLyogdGFsayBidXR0b24gei1pbmRleCBpcyA1OSBvciA2MCAqL1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwKTsgLyogdHJhbnNwYXJlbnQgd2l0aG91dCBob2xlcyAqL1xcbiAgYm9yZGVyOiBub25lO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsImV4cG9ydCBkZWZhdWx0IFwiLy8gRGlzcGF0Y2ggQ3VzdG9tIEV2ZW50XFxuZnVuY3Rpb24gZGlzcGF0Y2hDdXN0b21FdmVudChldmVudE5hbWUpIHtcXG4gIHZhciBkZXRhaWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xcbiAgdmFyIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwge1xcbiAgICBkZXRhaWw6IGRldGFpbFxcbiAgfSk7XFxuICBjb25zb2xlLmxvZyhcXFwiZGlzcGF0Y2hpbmcgZXZlbnQ6IFxcXCIgKyBldmVudE5hbWUpO1xcbiAgd2luZG93LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xcbn1cXG5cXG4vLyBhdWRpbyBvdXRwdXQgKFBpKVxcbnZhciBhdWRpb0VsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxcXCJhdWRpb1xcXCIpO1xcbmlmICghYXVkaW9FbGVtZW50KSB7XFxuICBjb25zb2xlLmVycm9yKFxcXCJBdWRpbyBlbGVtZW50IG5vdCBmb3VuZCFcXFwiKTtcXG59XFxuXFxuLy8gVE9ETzogZGVkdXBlIHRoaXMgZnVuY3Rpb24gZnJvbSBFdmVudE1vZHVsZS5qc1xcbmZ1bmN0aW9uIGlzU2FmYXJpKCkge1xcbiAgcmV0dXJuIC9eKCg/IWNocm9tZXxhbmRyb2lkKS4pKnNhZmFyaS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XFxufVxcbmF1ZGlvRWxlbWVudC5wcmVsb2FkID0gXFxcImF1dG9cXFwiOyAvLyBlbmFibGUgYWdncmVzc2l2ZSBwcmVsb2FkaW5nIG9mIGF1ZGlvXFxudmFyIHBpQXVkaW9NYW5hZ2VyID0ge1xcbiAgaXNTcGVha2luZzogZmFsc2UsXFxuICBhdWRpb0VsZW1lbnQ6IGF1ZGlvRWxlbWVudCxcXG4gIF91c2VyU3RhcnRlZDogdHJ1ZSxcXG4gIC8vIGZsYWcgdG8gaW5kaWNhdGUgcGxheWJhY2sgaGFzIGJlZW4gc3RhcnRlZCBieSB0aGUgdXNlciAodHJ1ZSBieSBkZWZhdWx0IGJlY2F1c2UgdXNlciBtdXN0IHJlcXVlc3QgaW5pdGlhbCBwbGF5YmFjaylcXG4gIF9pc0xvYWRDYWxsZWQ6IGZhbHNlLFxcbiAgLy8gZmxhZyB0byBpbmRpY2F0ZSBpZiB0aGUgbG9hZCgpIG1ldGhvZCBoYXMgYmVlbiBjYWxsZWQgb24gdGhlIGF1ZGlvIGVsZW1lbnRcXG5cXG4gIGlzTG9hZENhbGxlZDogZnVuY3Rpb24gaXNMb2FkQ2FsbGVkKCkge1xcbiAgICByZXR1cm4gdGhpcy5faXNMb2FkQ2FsbGVkO1xcbiAgfSxcXG4gIHNldElzTG9hZENhbGxlZDogZnVuY3Rpb24gc2V0SXNMb2FkQ2FsbGVkKHZhbHVlKSB7XFxuICAgIHRoaXMuX2lzTG9hZENhbGxlZCA9IHZhbHVlO1xcbiAgfSxcXG4gIHVzZXJQbGF5OiBmdW5jdGlvbiB1c2VyUGxheSgpIHtcXG4gICAgaWYgKCFpc1NhZmFyaSgpKSB7XFxuICAgICAgcmV0dXJuO1xcbiAgICB9XFxuICAgIHRoaXMuX3VzZXJTdGFydGVkID0gdHJ1ZTsgLy8gc2V0IGEgZmxhZyB0byBpbmRpY2F0ZSBwbGF5YmFjayBoYXMgYmVlbiBzdGFydGVkIGJ5IHRoZSB1c2VyXFxuICAgIHRoaXMuYXVkaW9FbGVtZW50LmxvYWQoKTsgLy8gcmVzZXQgZm9yIFNhZmFyaVxcbiAgICBkaXNwYXRjaEN1c3RvbUV2ZW50KFxcXCJhdWRpbzpsb2FkaW5nXFxcIik7XFxuICAgIHRoaXMuYXVkaW9FbGVtZW50LnBsYXkoKTtcXG4gICAgY29uc29sZS5sb2coXFxcIlVzZXIgc3RhcnRlZCBwbGF5YmFja1xcXCIpO1xcbiAgfSxcXG4gIGF1dG9QbGF5OiBmdW5jdGlvbiBhdXRvUGxheSgpIHtcXG4gICAgaWYgKCF0aGlzLl91c2VyU3RhcnRlZCkge1xcbiAgICAgIHRoaXMuYXVkaW9FbGVtZW50LnBhdXNlKCk7XFxuICAgIH1cXG4gIH0sXFxuICBzdG9wOiBmdW5jdGlvbiBzdG9wKCkge1xcbiAgICBpZiAodGhpcy5pc1NwZWFraW5nKSB7XFxuICAgICAgdGhpcy5hdWRpb0VsZW1lbnQucGF1c2UoKTtcXG4gICAgfVxcbiAgICBpZiAodGhpcy5hdWRpb0VsZW1lbnQuZHVyYXRpb24gJiYgIXRoaXMuYXVkaW9FbGVtZW50LmVuZGVkICYmIHRoaXMuYXVkaW9FbGVtZW50LmN1cnJlbnRUaW1lIDwgdGhpcy5hdWRpb0VsZW1lbnQuZHVyYXRpb24pIHtcXG4gICAgICB0aGlzLmF1ZGlvRWxlbWVudC5jdXJyZW50VGltZSA9IHRoaXMuYXVkaW9FbGVtZW50LmR1cmF0aW9uOyAvLyBzZWVrIHRoZSBhdWRpbyB0byB0aGUgZW5kXFxuICAgICAgdGhpcy5hdWRpb0VsZW1lbnQucGxheSgpOyAvLyB0cmlnZ2VyIHRoZSBlbmRlZCBldmVudFxcbiAgICB9XFxuICB9LFxcblxcbiAgcGF1c2U6IGZ1bmN0aW9uIHBhdXNlKCkge1xcbiAgICB0aGlzLmF1ZGlvRWxlbWVudC5wYXVzZSgpO1xcbiAgfSxcXG4gIHJlc3VtZTogZnVuY3Rpb24gcmVzdW1lKCkge1xcbiAgICB0aGlzLmF1ZGlvRWxlbWVudC5wbGF5KCk7XFxuICB9LFxcbiAgcGxheWluZzogZnVuY3Rpb24gcGxheWluZygpIHtcXG4gICAgdGhpcy5pc1NwZWFraW5nID0gdHJ1ZTtcXG4gIH0sXFxuICBzdG9wcGVkOiBmdW5jdGlvbiBzdG9wcGVkKCkge1xcbiAgICB0aGlzLmlzU3BlYWtpbmcgPSBmYWxzZTtcXG4gICAgdGhpcy5fdXNlclN0YXJ0ZWQgPSBmYWxzZTtcXG4gIH1cXG59O1xcblxcbi8vIEludGVyY2VwdCBBdXRvcGxheSBFdmVudHMgKGF1dG9wbGF5IGRvZXNuJ3Qgd29yayBvbiBTYWZhcmkpXFxuYXVkaW9FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXFxcInBsYXlcXFwiLCBmdW5jdGlvbiAoKSB7XFxuICBjb25zb2xlLmxvZyhcXFwicGxheVxcXCIpO1xcbiAgaWYgKGlzU2FmYXJpKCkpIHtcXG4gICAgcGlBdWRpb01hbmFnZXIuYXV0b1BsYXkoKTtcXG4gIH1cXG59KTtcXG5hdWRpb0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcXFwibG9hZHN0YXJ0XFxcIiwgZnVuY3Rpb24gKCkge1xcbiAgY29uc29sZS5sb2coXFxcImxvYWRzdGFydFxcXCIpO1xcbiAgaWYgKGlzU2FmYXJpKCkpIHtcXG4gICAgZGlzcGF0Y2hDdXN0b21FdmVudChcXFwic2F5cGk6cGlSZWFkeVRvUmVzcG9uZFxcXCIpO1xcbiAgfVxcbn0pO1xcblxcbi8vIEV2ZW50IGxpc3RlbmVycyBmb3IgZGV0ZWN0aW5nIHdoZW4gUGkgaXMgc3BlYWtpbmdcXG5hdWRpb0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcXFwicGxheWluZ1xcXCIsIGZ1bmN0aW9uICgpIHtcXG4gIGNvbnNvbGUubG9nKFxcXCJwbGF5aW5nXFxcIik7XFxuICBwaUF1ZGlvTWFuYWdlci5wbGF5aW5nKCk7XFxuICBkaXNwYXRjaEN1c3RvbUV2ZW50KFxcXCJzYXlwaTpwaVNwZWFraW5nXFxcIik7XFxufSk7XFxuYXVkaW9FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXFxcInBhdXNlXFxcIiwgZnVuY3Rpb24gKCkge1xcbiAgY29uc29sZS5sb2coXFxcInBhdXNlXFxcIik7XFxuICBwaUF1ZGlvTWFuYWdlci5zdG9wcGVkKCk7XFxuICBkaXNwYXRjaEN1c3RvbUV2ZW50KFxcXCJzYXlwaTpwaVN0b3BwZWRTcGVha2luZ1xcXCIpO1xcbn0pO1xcbmF1ZGlvRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxcXCJlbmRlZFxcXCIsIGZ1bmN0aW9uICgpIHtcXG4gIHBpQXVkaW9NYW5hZ2VyLnN0b3BwZWQoKTtcXG4gIGRpc3BhdGNoQ3VzdG9tRXZlbnQoXFxcInNheXBpOnBpRmluaXNoZWRTcGVha2luZ1xcXCIpO1xcbn0pO1xcblxcbi8vIGF1ZGlvIGlucHV0ICh1c2VyKVxcbnZhciBhdWRpb0RhdGFDaHVua3MgPSBbXTtcXG52YXIgYXVkaW9NaW1lVHlwZSA9IFxcXCJhdWRpby93ZWJtO2NvZGVjcz1vcHVzXFxcIjtcXG5mdW5jdGlvbiB1cGxvYWRBdWRpbyhhdWRpb0Jsb2IpIHtcXG4gIC8vIENyZWF0ZSBhIEZvcm1EYXRhIG9iamVjdFxcbiAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XFxuICB2YXIgYXVkaW9GaWxlbmFtZSA9IFxcXCJhdWRpby53ZWJtXFxcIjtcXG4gIGlmIChhdWRpb0Jsb2IudHlwZSA9PT0gXFxcImF1ZGlvL21wNFxcXCIpIHtcXG4gICAgYXVkaW9GaWxlbmFtZSA9IFxcXCJhdWRpby5tcDRcXFwiO1xcbiAgfVxcbiAgLy8gQWRkIHRoZSBhdWRpbyBibG9iIHRvIHRoZSBGb3JtRGF0YSBvYmplY3RcXG4gIGZvcm1EYXRhLmFwcGVuZChcXFwiYXVkaW9cXFwiLCBhdWRpb0Jsb2IsIGF1ZGlvRmlsZW5hbWUpO1xcbiAgLy8gR2V0IHRoZSB1c2VyJ3MgcHJlZmVycmVkIGxhbmd1YWdlXFxuICB2YXIgbGFuZ3VhZ2UgPSBuYXZpZ2F0b3IubGFuZ3VhZ2U7XFxuICBkaXNwYXRjaEN1c3RvbUV2ZW50KFxcXCJzYXlwaTp0cmFuc2NyaWJpbmdcXFwiKTtcXG4gIC8vIFBvc3QgdGhlIGF1ZGlvIHRvIHRoZSBzZXJ2ZXIgZm9yIHRyYW5zY3JpcHRpb25cXG4gIGZldGNoKGNvbmZpZy5hcGlTZXJ2ZXJVcmwgKyBcXFwiL3RyYW5zY3JpYmU/bGFuZ3VhZ2U9XFxcIiArIGxhbmd1YWdlLCB7XFxuICAgIG1ldGhvZDogXFxcIlBPU1RcXFwiLFxcbiAgICBib2R5OiBmb3JtRGF0YVxcbiAgfSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcXG4gICAgaWYgKCFyZXNwb25zZS5vaykge1xcbiAgICAgIHRocm93IEVycm9yKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xcbiAgICB9XFxuICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XFxuICB9KS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZUpzb24pIHtcXG4gICAgZGlzcGF0Y2hDdXN0b21FdmVudChcXFwic2F5cGk6dHJhbnNjcmliZWRcXFwiLCB7XFxuICAgICAgdGV4dDogcmVzcG9uc2VKc29uLnRleHRcXG4gICAgfSk7XFxuICB9KVtcXFwiY2F0Y2hcXFwiXShmdW5jdGlvbiAoZXJyb3IpIHtcXG4gICAgY29uc29sZS5lcnJvcihcXFwiTG9va3MgbGlrZSB0aGVyZSB3YXMgYSBwcm9ibGVtOiBcXFwiLCBlcnJvcik7XFxuICAgIHZhciB0ZXh0YXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxcXCJzYXlwaS1wcm9tcHRcXFwiKTtcXG4gICAgdGV4dGFyZWEudmFsdWUgPSBcXFwiU29ycnksIHRoZXJlIHdhcyBhIHByb2JsZW0gdHJhbnNjcmliaW5nIHlvdXIgYXVkaW8uIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuXFxcIjtcXG4gIH0pO1xcbn1cXG5cXG4vLyBEZWNsYXJlIGEgZ2xvYmFsIHZhcmlhYmxlIGZvciB0aGUgbWVkaWFSZWNvcmRlclxcbnZhciBtZWRpYVJlY29yZGVyO1xcbnZhciB0aHJlc2hvbGQgPSAxMDAwOyAvLyAxMDAwIG1zID0gMSBzZWNvbmQsIGFib3V0IHRoZSBsZW5ndGggb2YgXFxcIkhleSwgUGlcXFwiXFxuXFxuLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSAnZGF0YWF2YWlsYWJsZScgZXZlbnQgZmlyZXNcXG5mdW5jdGlvbiBoYW5kbGVEYXRhQXZhaWxhYmxlKGUpIHtcXG4gIC8vIEFkZCB0aGUgYXVkaW8gZGF0YSBjaHVuayB0byB0aGUgYXJyYXlcXG4gIGF1ZGlvRGF0YUNodW5rcy5wdXNoKGUuZGF0YSk7XFxufVxcblxcbi8vIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgJ3N0b3AnIGV2ZW50IGZpcmVzXFxuZnVuY3Rpb24gaGFuZGxlU3RvcCgpIHtcXG4gIC8vIENyZWF0ZSBhIEJsb2IgZnJvbSB0aGUgYXVkaW8gZGF0YSBjaHVua3NcXG4gIHZhciBhdWRpb0Jsb2IgPSBuZXcgQmxvYihhdWRpb0RhdGFDaHVua3MsIHtcXG4gICAgdHlwZTogYXVkaW9NaW1lVHlwZVxcbiAgfSk7XFxuXFxuICAvLyBHZXQgdGhlIHN0b3AgdGltZSBhbmQgY2FsY3VsYXRlIHRoZSBkdXJhdGlvblxcbiAgdmFyIHN0b3BUaW1lID0gRGF0ZS5ub3coKTtcXG4gIHZhciBkdXJhdGlvbiA9IHN0b3BUaW1lIC0gd2luZG93LnN0YXJ0VGltZTtcXG5cXG4gIC8vIElmIHRoZSBkdXJhdGlvbiBpcyBncmVhdGVyIHRoYW4gdGhlIHRocmVzaG9sZCwgdXBsb2FkIHRoZSBhdWRpbyBmb3IgdHJhbnNjcmlwdGlvblxcbiAgaWYgKGR1cmF0aW9uID49IHRocmVzaG9sZCkge1xcbiAgICAvLyBVcGxvYWQgdGhlIGF1ZGlvIHRvIHRoZSBzZXJ2ZXIgZm9yIHRyYW5zY3JpcHRpb25cXG4gICAgdXBsb2FkQXVkaW8oYXVkaW9CbG9iKTtcXG4gIH1cXG5cXG4gIC8vIENsZWFyIHRoZSBhcnJheSBmb3IgdGhlIG5leHQgcmVjb3JkaW5nXFxuICBhdWRpb0RhdGFDaHVua3MgPSBbXTtcXG59XFxuZnVuY3Rpb24gc2V0dXBSZWNvcmRpbmcoY2FsbGJhY2spIHtcXG4gIGlmIChtZWRpYVJlY29yZGVyKSB7XFxuICAgIHJldHVybjtcXG4gIH1cXG5cXG4gIC8vIEdldCBhIHN0cmVhbSBmcm9tIHRoZSB1c2VyJ3MgbWljcm9waG9uZVxcbiAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEoe1xcbiAgICBhdWRpbzogdHJ1ZVxcbiAgfSkudGhlbihmdW5jdGlvbiAoc3RyZWFtKSB7XFxuICAgIGlmICghTWVkaWFSZWNvcmRlci5pc1R5cGVTdXBwb3J0ZWQoYXVkaW9NaW1lVHlwZSkpIHtcXG4gICAgICAvLyB1c2UgTVA0IGZvciBTYWZhcmlcXG4gICAgICBhdWRpb01pbWVUeXBlID0gXFxcImF1ZGlvL21wNFxcXCI7XFxuICAgIH1cXG4gICAgLy8gQ3JlYXRlIGEgbmV3IE1lZGlhUmVjb3JkZXIgb2JqZWN0IHVzaW5nIHRoZSBzdHJlYW0gYW5kIHNwZWNpZnlpbmcgdGhlIE1JTUUgdHlwZVxcbiAgICB2YXIgb3B0aW9ucyA9IHtcXG4gICAgICBtaW1lVHlwZTogYXVkaW9NaW1lVHlwZVxcbiAgICB9O1xcbiAgICBtZWRpYVJlY29yZGVyID0gbmV3IE1lZGlhUmVjb3JkZXIoc3RyZWFtLCBvcHRpb25zKTtcXG5cXG4gICAgLy8gTGlzdGVuIGZvciB0aGUgJ2RhdGFhdmFpbGFibGUnIGV2ZW50XFxuICAgIG1lZGlhUmVjb3JkZXIuYWRkRXZlbnRMaXN0ZW5lcihcXFwiZGF0YWF2YWlsYWJsZVxcXCIsIGhhbmRsZURhdGFBdmFpbGFibGUpO1xcblxcbiAgICAvLyBMaXN0ZW4gZm9yIHRoZSAnc3RvcCcgZXZlbnRcXG4gICAgbWVkaWFSZWNvcmRlci5hZGRFdmVudExpc3RlbmVyKFxcXCJzdG9wXFxcIiwgaGFuZGxlU3RvcCk7XFxuICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcXG4gICAgLy8gSW52b2tlIHRoZSBjYWxsYmFjayBmdW5jdGlvblxcbiAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcXFwiZnVuY3Rpb25cXFwiKSB7XFxuICAgICAgY2FsbGJhY2soKTtcXG4gICAgfVxcbiAgfSlbXFxcImNhdGNoXFxcIl0oZnVuY3Rpb24gKGVycikge1xcbiAgICBjb25zb2xlLmVycm9yKFxcXCJFcnJvciBnZXR0aW5nIGF1ZGlvIHN0cmVhbTogXFxcIiArIGVycik7XFxuICB9KTtcXG59XFxuZnVuY3Rpb24gdGVhckRvd25SZWNvcmRpbmcoKSB7XFxuICAvLyBDaGVjayBpZiB0aGUgTWVkaWFSZWNvcmRlciBpcyBzZXQgdXBcXG4gIGlmICghbWVkaWFSZWNvcmRlcikge1xcbiAgICByZXR1cm47XFxuICB9XFxuXFxuICAvLyBTdG9wIGFueSBvbmdvaW5nIHJlY29yZGluZ1xcbiAgaWYgKG1lZGlhUmVjb3JkZXIuc3RhdGUgPT09IFxcXCJyZWNvcmRpbmdcXFwiKSB7XFxuICAgIG1lZGlhUmVjb3JkZXIuc3RvcCgpO1xcbiAgfVxcblxcbiAgLy8gUmVtb3ZlIHRoZSBNZWRpYVJlY29yZGVyJ3MgZXZlbnQgbGlzdGVuZXJzXFxuICBtZWRpYVJlY29yZGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoXFxcImRhdGFhdmFpbGFibGVcXFwiLCBoYW5kbGVEYXRhQXZhaWxhYmxlKTtcXG4gIG1lZGlhUmVjb3JkZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihcXFwic3RvcFxcXCIsIGhhbmRsZVN0b3ApO1xcblxcbiAgLy8gQ2xlYXIgdGhlIE1lZGlhUmVjb3JkZXIgdmFyaWFibGVcXG4gIG1lZGlhUmVjb3JkZXIgPSBudWxsO1xcbn1cXG5cXG4vLyBUbyByZXF1ZXN0IHJlY29yZGluZywgb3RoZXIgbW9kdWxlcyBjYW4gZGlzcGF0Y2ggYSBjdXN0b20gZXZlbnQgYXVkaW86c3RhcnRSZWNvcmRpbmdcXG5mdW5jdGlvbiBzdGFydFJlY29yZGluZygpIHtcXG4gIC8vIENoZWNrIGlmIHRoZSBNZWRpYVJlY29yZGVyIGlzIHNldCB1cFxcbiAgaWYgKCFtZWRpYVJlY29yZGVyKSB7XFxuICAgIHNldHVwUmVjb3JkaW5nKHN0YXJ0UmVjb3JkaW5nKTtcXG4gICAgcmV0dXJuO1xcbiAgfVxcbiAgLy8gQ2hlY2sgaWYgUGkgaXMgY3VycmVudGx5IHNwZWFraW5nIGFuZCBzdG9wIGhlciBhdWRpb1xcbiAgaWYgKHBpQXVkaW9NYW5hZ2VyLmlzU3BlYWtpbmcpIHtcXG4gICAgcGlBdWRpb01hbmFnZXIucGF1c2UoKTtcXG4gIH1cXG5cXG4gIC8vIFN0YXJ0IHJlY29yZGluZ1xcbiAgbWVkaWFSZWNvcmRlci5zdGFydCgpO1xcblxcbiAgLy8gUmVjb3JkIHRoZSBzdGFydCB0aW1lXFxuICB3aW5kb3cuc3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcXG4gIGRpc3BhdGNoQ3VzdG9tRXZlbnQoXFxcInNheXBpOnVzZXJTcGVha2luZ1xcXCIpO1xcbn1cXG5cXG4vLyBUbyBzdG9wIHJlY29yZGluZywgb3RoZXIgbW9kdWxlcyBjYW4gZGlzcGF0Y2ggYSBjdXN0b20gZXZlbnQgYXVkaW86c3RvcFJlY29yZGluZ1xcbmZ1bmN0aW9uIHN0b3BSZWNvcmRpbmcoKSB7XFxuICBpZiAobWVkaWFSZWNvcmRlciAmJiBtZWRpYVJlY29yZGVyLnN0YXRlID09PSBcXFwicmVjb3JkaW5nXFxcIikge1xcbiAgICAvLyBTdG9wIHJlY29yZGluZ1xcbiAgICBtZWRpYVJlY29yZGVyLnN0b3AoKTtcXG5cXG4gICAgLy8gUmVjb3JkIHRoZSBzdG9wIHRpbWUgYW5kIGNhbGN1bGF0ZSB0aGUgZHVyYXRpb25cXG4gICAgdmFyIHN0b3BUaW1lID0gRGF0ZS5ub3coKTtcXG4gICAgdmFyIGR1cmF0aW9uID0gc3RvcFRpbWUgLSB3aW5kb3cuc3RhcnRUaW1lO1xcblxcbiAgICAvLyBJZiB0aGUgZHVyYXRpb24gaXMgbGVzcyB0aGFuIHRoZSB0aHJlc2hvbGQsIGRvbid0IHVwbG9hZCB0aGUgYXVkaW8gZm9yIHRyYW5zY3JpcHRpb25cXG4gICAgaWYgKGR1cmF0aW9uIDwgdGhyZXNob2xkKSB7XFxuICAgICAgY29uc29sZS5sb2coXFxcIlJlY29yZGluZyB3YXMgdG9vIHNob3J0LCBub3QgdXBsb2FkaW5nIGZvciB0cmFuc2NyaXB0aW9uXFxcIik7XFxuICAgICAgZGlzcGF0Y2hDdXN0b21FdmVudChcXFwic2F5cGk6dXNlclN0b3BwZWRTcGVha2luZ1xcXCIpO1xcbiAgICAgIHBpQXVkaW9NYW5hZ2VyLnJlc3VtZSgpO1xcbiAgICB9IGVsc2Uge1xcbiAgICAgIHBpQXVkaW9NYW5hZ2VyLnN0b3AoKTtcXG4gICAgICBkaXNwYXRjaEN1c3RvbUV2ZW50KFxcXCJzYXlwaTp1c2VyRmluaXNoZWRTcGVha2luZ1xcXCIpO1xcbiAgICB9XFxuICB9XFxufVxcbmZ1bmN0aW9uIHJlZ2lzdGVyQ3VzdG9tQXVkaW9FdmVudExpc3RlbmVycygpIHtcXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxcXCJhdWRpbzpzZXR1cFJlY29yZGluZ1xcXCIsIGZ1bmN0aW9uIChlKSB7XFxuICAgIHNldHVwUmVjb3JkaW5nKCk7XFxuICB9KTtcXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxcXCJhdWRpbzp0ZWFyRG93blJlY29yZGluZ1xcXCIsIGZ1bmN0aW9uIChlKSB7XFxuICAgIHRlYXJEb3duUmVjb3JkaW5nKCk7XFxuICB9KTtcXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxcXCJhdWRpbzpzdGFydFJlY29yZGluZ1xcXCIsIGZ1bmN0aW9uIChlKSB7XFxuICAgIHN0YXJ0UmVjb3JkaW5nKCk7XFxuICB9KTtcXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxcXCJhdWRpbzpzdG9wUmVjb3JkaW5nXFxcIiwgZnVuY3Rpb24gKGUpIHtcXG4gICAgc3RvcFJlY29yZGluZygpO1xcbiAgfSk7XFxufVxcbnJlZ2lzdGVyQ3VzdG9tQXVkaW9FdmVudExpc3RlbmVycygpO1wiOyIsImV4cG9ydCBkZWZhdWx0IFwiPD94bWwgdmVyc2lvbj1cXFwiMS4wXFxcIiBlbmNvZGluZz1cXFwiVVRGLThcXFwiPz5cXG48c3ZnIGlkPVxcXCJMYXllcl8xXFxcIiBkYXRhLW5hbWU9XFxcIkxheWVyIDFcXFwiIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDMwNyA2NDBcXFwiPlxcbiAgPGRlZnM+XFxuICAgIDxzdHlsZT5cXG4gICAgICAuaW5uZXJtb3N0LCAuc2Vjb25kLCAudGhpcmQsIC5mb3VydGgsIC5maWZ0aCwgLm91dGVybW9zdCB7XFxuICAgICAgICBzdHJva2Utd2lkdGg6IDBweDtcXG4gICAgICB9XFxuICAgICAgXFxuICAgICAgLm91dGVybW9zdCB7XFxuICAgICAgICBmaWxsOiAjZTRmMmQxO1xcbiAgICAgIH1cXG5cXG4gICAgICAuc2Vjb25kIHtcXG4gICAgICAgIGZpbGw6ICNjY2U4YjU7XFxuICAgICAgfVxcblxcbiAgICAgIC50aGlyZCB7XFxuICAgICAgICBmaWxsOiAjYjNkYjk1O1xcbiAgICAgIH1cXG5cXG4gICAgICAuZm91cnRoIHtcXG4gICAgICAgIGZpbGw6ICM5YmQwNzg7XFxuICAgICAgfVxcblxcbiAgICAgIC5maWZ0aCB7XFxuICAgICAgICBmaWxsOiAjODNjNTVjO1xcbiAgICAgIH1cXG5cXG4gICAgICAuaW5uZXJtb3N0IHtcXG4gICAgICAgIGZpbGw6ICM0MjhhMmY7XFxuICAgICAgfVxcbiAgICA8L3N0eWxlPlxcbiAgPC9kZWZzPlxcbiAgPHBhdGggY2xhc3M9XFxcIm91dGVybW9zdFxcXCIgZD1cXFwibTMwNi45LDMyMGMwLDEwNS4zLS4wMiwyMTAuNi4xLDMxNS45MSwwLDMuNDItLjY3LDQuMS00LjA5LDQuMDktOTkuNi0uMTItMTk5LjIxLS4xMi0yOTguODEsMEMuNjcsNjQwLDAsNjM5LjMzLDAsNjM1LjkxLjExLDQyNS4zLjExLDIxNC43LDAsNC4wOSwwLC42Ny42NywwLDQuMDksMCwxMDMuNy4xMiwyMDMuMy4xMiwzMDIuOTEsMGMzLjQyLDAsNC4xLjY3LDQuMDksNC4wOS0uMTIsMTA1LjMtLjEsMjEwLjYtLjEsMzE1LjkxWlxcXCIvPlxcbiAgPHBhdGggY2xhc3M9XFxcInNlY29uZFxcXCIgZD1cXFwibTI3NS45MiwzMjNjMCw4Ny42MywwLDE3NS4yNywwLDI2Mi45LDAsNy4yNC0uNTUsNy45My03Ljg2LDcuOTgtMTQuNjYuMDktMjkuMzEuMDMtNDMuOTcuMDMtNjAuOTYsMC0xMjEuOTIsMC0xODIuODgsMHEtNy4xMywwLTcuMTQtNy4yNGMwLTE3Ni4xLDAtMzUyLjIxLDAtNTI4LjMxcTAtNy4yNiw3LjEyLTcuMjZjNzUuNzgsMCwxNTEuNTYsMCwyMjcuMzUsMHE3LjM4LDAsNy4zOCw3LjVjMCw4OC4xMywwLDE3Ni4yNywwLDI2NC40WlxcXCIvPlxcbiAgPHBhdGggY2xhc3M9XFxcInRoaXJkXFxcIiBkPVxcXCJtNjguMDYsMzIyLjI0YzAtNjkuNDcsMC0xMzguOTQsMC0yMDguNDEsMC04Ljk5LDEuMzMtMTAuMTMsMTAuNDktOS4xMiwxLjk4LjIyLDMuOTguMzIsNS45Ny4zMiw0Ni4xMy4wMiw5Mi4yNi4wMiwxMzguMzksMCwzLjQ4LDAsNi45Mi0uMjMsMTAuNDEtLjY3LDUuNS0uNyw4Ljc0LjQ2LDguNzMsNy4yNS0uMTgsMTM4Ljk0LS4xMywyNzcuODgtLjEzLDQxNi44MSwwLC4zMywwLC42NywwLDFxLS4xNCwxMC41MS0xMC4zOSwxMC41MWMtNTIuMTMsMC0xMDQuMjUsMC0xNTYuMzgsMHEtNy4wOSwwLTcuMDktNy4yOGMwLTcwLjE0LDAtMTQwLjI3LDAtMjEwLjQxWlxcXCIvPlxcbiAgPHBhdGggY2xhc3M9XFxcImZvdXJ0aFxcXCIgZD1cXFwibTEwMy4wMiwzMjIuNWMwLTUyLjQ2LDAtMTA0LjkxLDAtMTU3LjM3LDAtNi42OC4zNi03LjA2LDcuMDctNy4wNiwzMC4zLS4wMSw2MC42LjA3LDkwLjktLjA5LDQuNTQtLjAyLDYuMDgsMS4zMyw2LjA3LDUuOTgtLjEsMTA1LjU4LS4xLDIxMS4xNiwwLDMxNi43NCwwLDQuMTgtMS4yNyw1LjM3LTUuMzgsNS4zNS0yOS4zLS4xNS01OC42LS4wOC04Ny45LS4wOHEtMTAuNzYsMC0xMC43Ni0xMS4wOWMwLTUwLjc5LDAtMTAxLjU4LDAtMTUyLjM3WlxcXCIvPlxcbiAgPHBhdGggY2xhc3M9XFxcImZpZnRoXFxcIiBkPVxcXCJtMTczLDMyMi4yYzAsMzUuMjksMCw3MC41OCwwLDEwNS44OHEwLDYuODktNi45OSw2LjljLTguMTUsMC0xNi4zMS0uMTMtMjQuNDYuMDYtMy40Ny4wOC00LjY4LTEuMDktNC42MS00LjU5LjE4LTkuNjUuMDYtMTkuMzEuMDYtMjguOTYsMC01OC4yNi0uMDEtMTE2LjUzLjAyLTE3NC43OSwwLTQuNzYtMS4xMi05LjQ2LS4xNC0xNC4zLjUxLTIuNTQsMS4zOS0zLjM4LDMuOC0zLjM2LDguODIuMDYsMTcuNjQuMTQsMjYuNDYtLjAyLDQuNTktLjA5LDUuOTUsMS44NSw1Ljk0LDYuMzMtLjE0LDM1LjYyLS4wOCw3MS4yNS0uMDgsMTA2Ljg3WlxcXCIvPlxcbiAgPHBhdGggY2xhc3M9XFxcImlubmVybW9zdFxcXCIgZD1cXFwibTE1MS4wNCwzMjIuMDFjMC05Ljk5LjA3LTE5Ljk3LS4wNS0yOS45Ni0uMDQtMi45My44My00LjE4LDMuOTUtNC4xOCwzLjA2LDAsNC4wMywxLjEyLDQuMDIsNC4xMS0uMDksMTkuOTctLjA4LDM5Ljk0LjAxLDU5LjkxLjAxLDIuOTYtLjg0LDQuMTYtMy45Niw0LjE0LTMuMDMtLjAxLTQuMDgtMS4wNC00LjAzLTQuMDguMTQtOS45OC4wNS0xOS45Ny4wNS0yOS45NlpcXFwiLz5cXG48L3N2Zz5cIjsiLCJleHBvcnQgZGVmYXVsdCBcIjxzdmcgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiB2ZXJzaW9uPVxcXCIxLjBcXFwiIHZpZXdCb3g9XFxcIjAgMCA1Ni4yNSAzMFxcXCIgY2xhc3M9XFxcIndhdmVmb3JtXFxcIj5cXG4gICAgPGRlZnM+XFxuICAgICAgICA8Y2xpcFBhdGggaWQ9XFxcImFcXFwiPlxcbiAgICAgICAgICAgIDxwYXRoIGQ9XFxcIk0uNTQgMTJIM3Y1SC41NFptMCAwXFxcIi8+XFxuICAgICAgICA8L2NsaXBQYXRoPlxcbiAgICAgICAgPGNsaXBQYXRoIGlkPVxcXCJiXFxcIj5cXG4gICAgICAgICAgICA8cGF0aCBkPVxcXCJNMjUgMi4yaDJ2MjQuNjhoLTJabTAgMFxcXCIvPlxcbiAgICAgICAgPC9jbGlwUGF0aD5cXG4gICAgICAgIDxjbGlwUGF0aCBpZD1cXFwiY1xcXCI+XFxuICAgICAgICAgICAgPHBhdGggZD1cXFwiTTUzIDEyaDEuOTh2NUg1M1ptMCAwXFxcIi8+XFxuICAgICAgICA8L2NsaXBQYXRoPlxcbiAgICA8L2RlZnM+XFxuICAgIDxnIGNsaXAtcGF0aD1cXFwidXJsKCNhKVxcXCI+XFxuICAgICAgICA8cGF0aCBkPVxcXCJNMS40OCAxMi43MWMtLjUgMC0uOS40LS45Ljl2MS44NWEuOS45IDAgMCAwIDEuOCAwdi0xLjg0YzAtLjUtLjQtLjktLjktLjlabTAgMFxcXCIvPlxcbiAgICA8L2c+XFxuICAgIDxwYXRoIGQ9XFxcIk00Ljk4IDYuNjNjLS41IDAtLjkuNC0uOS45djE0LjAxYS45LjkgMCAwIDAgMS44MSAwdi0xNGMwLS41LS40LS45Mi0uOS0uOTJabTMuNTEgMy4xYS45LjkgMCAwIDAtLjkuOTF2Ny43OWEuOS45IDAgMCAwIDEuOCAwdi03Ljc5YzAtLjUtLjQtLjktLjktLjlaTTEyIDMuODNhLjkuOSAwIDAgMC0uOTEuOXYxOS42YS45LjkgMCAwIDAgMS44IDBWNC43NGMwLS41LS40LS45LS45LS45Wm0zLjUgOC4yOWEuOS45IDAgMCAwLS45MS45djMuMDNhLjkuOSAwIDAgMCAxLjgxIDB2LTMuMDNjMC0uNS0uNC0uOS0uOS0uOVpNMTkgNi44Yy0uNSAwLS45LjQtLjkuOXYxMy42OGEuOS45IDAgMCAwIDEuOCAwVjcuN2MwLS41LS40LS45LS45LS45Wm0zLjU4LTIuOTdoLS4wMWMtLjUgMC0uOS40LS45LjlsLS4xMyAxOS42YzAgLjUuNC45LjkuOTEuNSAwIC45LS40LjktLjlsLjE0LTE5LjZhLjkuOSAwIDAgMC0uOS0uOVptMCAwXFxcIi8+XFxuICAgIDxnIGNsaXAtcGF0aD1cXFwidXJsKCNiKVxcXCI+XFxuICAgICAgICA8cGF0aCBkPVxcXCJNMjYgMi4yYy0uNSAwLS45LjQtLjkuOXYyMi44NmEuOS45IDAgMSAwIDEuODEgMFYzLjExYS45LjkgMCAwIDAtLjktLjkxWm0wIDBcXFwiLz5cXG4gICAgPC9nPlxcbiAgICA8cGF0aCBkPVxcXCJNMjkuNTIgNy43MWEuOS45IDAgMCAwLS45MS45djExLjg1YS45LjkgMCAwIDAgMS44MSAwVjguNjJjMC0uNS0uNC0uOS0uOS0uOVptMy41IDIuOTNhLjkuOSAwIDAgMC0uOS45MXY1Ljk3YS45LjkgMCAwIDAgMS44IDB2LTUuOTdjMC0uNS0uNC0uOS0uOS0uOVptMy41LTUuNzhjLS41IDAtLjkuNC0uOS45djE3LjU1YS45LjkgMCAwIDAgMS44MSAwVjUuNzZjMC0uNS0uNC0uOS0uOS0uOVptMy41MSAzLjM0Yy0uNSAwLS45LjQtLjkuOXYxMC44N2EuOS45IDAgMCAwIDEuOCAwVjkuMWEuOS45IDAgMCAwLS45LS45MVptMy41IDMuMDhjLS41IDAtLjkuNC0uOS45MXY0LjdhLjkuOSAwIDEgMCAxLjggMHYtNC43YS45LjkgMCAwIDAtLjktLjlabTMuNTEtNy40NWEuOS45IDAgMCAwLS45MS45djE5LjZhLjkuOSAwIDAgMCAxLjgxIDBWNC43NGMwLS41LS40LS45LS45LS45Wm0zLjUgNS41N2EuOS45IDAgMCAwLS45LjkxdjguNDVhLjkuOSAwIDAgMCAxLjggMHYtOC40NWMwLS41LS40LS45LS45LS45Wm0wIDBcXFwiLz5cXG4gICAgPGcgY2xpcC1wYXRoPVxcXCJ1cmwoI2MpXFxcIj5cXG4gICAgICAgIDxwYXRoIGQ9XFxcIk01NC4wNCAxMi45NmEuOS45IDAgMCAwLS45LjkxdjEuMzNhLjkuOSAwIDEgMCAxLjggMHYtMS4zMmEuOS45IDAgMCAwLS45LS45MlptMCAwXFxcIi8+XFxuICAgIDwvZz5cXG48L3N2Zz5cIjsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vbW9iaWxlLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vbW9iaWxlLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9yZWN0YW5nbGVzLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vcmVjdGFuZ2xlcy5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vdGFsa0J1dHRvbi5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3RhbGtCdXR0b24uY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJpbXBvcnQgQW5pbWF0aW9uTW9kdWxlIGZyb20gXCIuL0FuaW1hdGlvbk1vZHVsZS5qc1wiO1xuaW1wb3J0IEJ1dHRvbk1vZHVsZSBmcm9tIFwiLi9CdXR0b25Nb2R1bGUuanNcIjtcbmltcG9ydCBFdmVudE1vZHVsZSBmcm9tIFwiLi9FdmVudE1vZHVsZS5qc1wiO1xuaW1wb3J0IFwiLi90YWxrQnV0dG9uLmNzc1wiO1xuaW1wb3J0IFwiLi9tb2JpbGUuY3NzXCI7XG5pbXBvcnQgXCIuL3JlY3RhbmdsZXMuY3NzXCI7XG5pbXBvcnQgdGFsa0ljb25TVkcgZnJvbSBcIi4vd2F2ZWZvcm0uc3ZnXCI7XG5pbXBvcnQgcmVjdGFuZ2xlc1NWRyBmcm9tIFwiLi9yZWN0YW5nbGVzLnN2Z1wiO1xuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgY29uc3QgYnV0dG9uTW9kdWxlID0gbmV3IEJ1dHRvbk1vZHVsZSgpO1xuXG4gIGNvbnN0IGxvY2FsQ29uZmlnID0ge1xuICAgIGFwcFNlcnZlclVybDogXCJodHRwOi8vbG9jYWxob3N0OjMwMDBcIixcbiAgICBhcGlTZXJ2ZXJVcmw6IFwiaHR0cHM6Ly9sb2NhbGhvc3Q6NTAwMFwiLFxuICAgIC8vIEFkZCBvdGhlciBjb25maWd1cmF0aW9uIHByb3BlcnRpZXMgYXMgbmVlZGVkXG4gIH07XG5cbiAgLy8gRGVmaW5lIGEgZ2xvYmFsIGNvbmZpZ3VyYXRpb24gcHJvcGVydHlcbiAgY29uc3QgcHJvZHVjdGlvbkNvbmZpZyA9IHtcbiAgICBhcHBTZXJ2ZXJVcmw6IFwiaHR0cHM6Ly9hcHAuc2F5cGkuYWlcIixcbiAgICBhcGlTZXJ2ZXJVcmw6IFwiaHR0cHM6Ly9hcGkuc2F5cGkuYWlcIixcbiAgICAvLyBBZGQgb3RoZXIgY29uZmlndXJhdGlvbiBwcm9wZXJ0aWVzIGFzIG5lZWRlZFxuICB9O1xuICBjb25zdCBjb25maWcgPSBwcm9kdWN0aW9uQ29uZmlnO1xuXG4gIGNvbnN0IHBhZ2VTY3JpcHQgPSByZXF1aXJlKFwicmF3LWxvYWRlciEuL3RyYW5zY3JpYmVyLmpzXCIpLmRlZmF1bHQ7XG4gIGFkZFVzZXJBZ2VudEZsYWdzKCk7XG4gIEV2ZW50TW9kdWxlLmluaXQoKTtcblxuICAvLyBDcmVhdGUgYSBNdXRhdGlvbk9ic2VydmVyIHRvIGxpc3RlbiBmb3IgY2hhbmdlcyB0byB0aGUgRE9NXG4gIHZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uIChtdXRhdGlvbnMpIHtcbiAgICAvLyBDaGVjayBlYWNoIG11dGF0aW9uXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtdXRhdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBtdXRhdGlvbiA9IG11dGF0aW9uc1tpXTtcblxuICAgICAgLy8gSWYgbm9kZXMgd2VyZSBhZGRlZCwgY2hlY2sgZWFjaCBvbmVcbiAgICAgIGlmIChtdXRhdGlvbi5hZGRlZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBtdXRhdGlvbi5hZGRlZE5vZGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgdmFyIG5vZGUgPSBtdXRhdGlvbi5hZGRlZE5vZGVzW2pdO1xuXG4gICAgICAgICAgLy8gSWYgdGhlIG5vZGUgaXMgdGhlIGFwcHJvcHJpYXRlIGNvbnRhaW5lciBlbGVtZW50LCBhZGQgdGhlIGJ1dHRvbiBhbmQgc3RvcCBvYnNlcnZpbmdcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiZGl2XCIgJiZcbiAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZml4ZWRcIikgJiZcbiAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYm90dG9tLTE2XCIpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB2YXIgZm9vdGVyID0gbm9kZTtcbiAgICAgICAgICAgIHZhciBidXR0b25Db250YWluZXIgPSBmb290ZXIucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgICAgXCIucmVsYXRpdmUuZmxleC5mbGV4LWNvbFwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKGJ1dHRvbkNvbnRhaW5lcikge1xuICAgICAgICAgICAgICBhZGRUYWxrQnV0dG9uKGJ1dHRvbkNvbnRhaW5lcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJObyBidXR0b24gY29udGFpbmVyIGZvdW5kIGluIGZvb3RlclwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghYW5ub3RhdGVET00oKSkge1xuICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJSZXF1aXJlZCBlbGVtZW50cyBub3QgZm91bmQgaW4gRE9NXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgZnVuY3Rpb24gYW5ub3RhdGVET00oKSB7XG4gICAgLy8gQWRkIGFuIElEIHRvIHRoZSBwcm9tcHQgdGV4dGFyZWFcbiAgICBjb25zdCBmb3VuZFByb21wdCA9IGFkZElkUHJvbXB0VGV4dEFyZWEoKTtcbiAgICBjb25zdCBmb3VuZEZvb3RlciA9IGFkZElkRm9vdGVyKCk7XG4gICAgcmV0dXJuIGZvdW5kUHJvbXB0ICYmIGZvdW5kRm9vdGVyO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkSWRQcm9tcHRUZXh0QXJlYSgpIHtcbiAgICB2YXIgdGV4dGFyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNheXBpLXByb21wdFwiKTtcbiAgICBpZiAoIXRleHRhcmVhKSB7XG4gICAgICAvLyBGaW5kIHRoZSBmaXJzdCA8dGV4dGFyZWE+IGVsZW1lbnQgYW5kIGdpdmUgaXQgYW4gaWRcbiAgICAgIHZhciB0ZXh0YXJlYUVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwidGV4dGFyZWFcIik7XG4gICAgICBpZiAodGV4dGFyZWFFbGVtZW50KSB7XG4gICAgICAgIHRleHRhcmVhRWxlbWVudC5pZCA9IFwic2F5cGktcHJvbXB0XCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJObyA8dGV4dGFyZWE+IGVsZW1lbnQgZm91bmRcIik7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRJZEZvb3RlcigpIHtcbiAgICAvLyBGaW5kIGFsbCBhdWRpbyBlbGVtZW50cyBvbiB0aGUgcGFnZVxuICAgIHZhciBhdWRpb0VsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImF1ZGlvXCIpO1xuICAgIHZhciBmb3VuZCA9IGZhbHNlOyAvLyBkZWZhdWx0IHRvIG5vdCBmb3VuZFxuXG4gICAgYXVkaW9FbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChhdWRpbykge1xuICAgICAgdmFyIHByZWNlZGluZ0RpdiA9IGF1ZGlvLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG5cbiAgICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZm91bmQgYSBkaXYsIHdlIGNhbiBza2lwIGZ1cnRoZXIgaXRlcmF0aW9uc1xuICAgICAgaWYgKGZvdW5kKSByZXR1cm47XG5cbiAgICAgIC8vIENoZWNrIGlmIHRoZSBwcmVjZWRpbmcgZWxlbWVudCBpcyBhIGRpdlxuICAgICAgaWYgKHByZWNlZGluZ0RpdiAmJiBwcmVjZWRpbmdEaXYudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImRpdlwiKSB7XG4gICAgICAgIC8vIEFzc2lnbiBhbiBJRCB0byB0aGUgZGl2XG4gICAgICAgIHByZWNlZGluZ0Rpdi5pZCA9IFwic2F5cGktZm9vdGVyXCI7XG4gICAgICAgIGZvdW5kID0gdHJ1ZTsgLy8gc2V0IHRvIGZvdW5kXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZm91bmQ7XG4gIH1cblxuICBmdW5jdGlvbiBpbmplY3RTY3JpcHQoY2FsbGJhY2spIHtcbiAgICB2YXIgc2NyaXB0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgc2NyaXB0RWxlbWVudC50eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIjtcbiAgICBzY3JpcHRFbGVtZW50LmlkID0gXCJzYXlwaS1zY3JpcHRcIjtcbiAgICBjb25zdCBjb25maWdUZXh0ID0gXCJ2YXIgY29uZmlnID0gXCIgKyBKU09OLnN0cmluZ2lmeShjb25maWcpICsgXCI7XCI7XG4gICAgc2NyaXB0RWxlbWVudC50ZXh0Q29udGVudCA9IGNvbmZpZ1RleHQgKyBwYWdlU2NyaXB0O1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0RWxlbWVudCk7XG5cbiAgICAvLyBDYWxsIHRoZSBjYWxsYmFjayBmdW5jdGlvbiBhZnRlciB0aGUgc2NyaXB0IGlzIGFkZGVkXG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGlzTW9iaWxlVmlldygpIHtcbiAgICByZXR1cm4gd2luZG93Lm1hdGNoTWVkaWEoXCIobWF4LXdpZHRoOiA3NjhweClcIikubWF0Y2hlcztcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFRhbGtCdXR0b24oY29udGFpbmVyKSB7XG4gICAgLy8gY3JlYXRlIGEgY29udGFpbmluZyBkaXZcbiAgICB2YXIgcGFuZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHBhbmVsLmlkID0gXCJzYXlwaS1wYW5lbFwiO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChwYW5lbCk7XG5cbiAgICAvLyBDcmVhdGUgdGhlIHRhbGsgYnV0dG9uIHVzaW5nIEJ1dHRvbk1vZHVsZVxuICAgIGNvbnN0IGxhYmVsID1cbiAgICAgIFwiVGFsayAoSG9sZCBDb250cm9sICsgU3BhY2UgdG8gdXNlIGhvdGtleS4gRG91YmxlIGNsaWNrIHRvIHRvZ2dsZSBhdXRvLXN1Ym1pdCBvbi9vZmYpXCI7XG4gICAgdmFyIGJ1dHRvbiA9IGJ1dHRvbk1vZHVsZS5jcmVhdGVCdXR0b24oXCJcIiwgKCkgPT4ge30pOyAvLyBUaGUgY2FsbGJhY2sgaXMgZW1wdHkgZm9yIG5vdywgYnV0IHlvdSBjYW4gYWRkIGZ1bmN0aW9uYWxpdGllcyBpZiBuZWVkZWQuXG5cbiAgICBidXR0b24uaWQgPSBcInNheXBpLXRhbGtCdXR0b25cIjtcbiAgICBidXR0b24udHlwZSA9IFwiYnV0dG9uXCI7XG5cbiAgICAvLyBTZXQgQVJJQSBsYWJlbCBhbmQgdG9vbHRpcFxuICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIGxhYmVsKTtcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKFwidGl0bGVcIiwgbGFiZWwpO1xuXG4gICAgY29uc3QgY2xhc3NOYW1lcyA9XG4gICAgICBcInJlbGF0aXZlIGZsZXggbXQtMSBtYi0xIHJvdW5kZWQtZnVsbCBweC0yIHB5LTMgdGV4dC1jZW50ZXIgYmctY3JlYW0tNTUwIGhvdmVyOmJnLWNyZWFtLTY1MCBob3Zlcjp0ZXh0LWJyYW5kLWdyZWVuLTcwMCB0ZXh0LW11dGVkXCI7XG4gICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lcy5zcGxpdChcIiBcIikpO1xuXG4gICAgLy8gRW5hYmxlIGF1dG9zdWJtaXQgYnkgZGVmYXVsdFxuICAgIGJ1dHRvbi5kYXRhc2V0LmF1dG9zdWJtaXQgPSBcInRydWVcIjtcbiAgICBidXR0b24uY2xhc3NMaXN0LmFkZChcImF1dG9TdWJtaXRcIik7XG5cbiAgICBwYW5lbC5hcHBlbmRDaGlsZChidXR0b24pO1xuICAgIGFkZFRhbGtJY29uKGJ1dHRvbik7XG5cbiAgICAvLyBDYWxsIHRoZSBmdW5jdGlvbiB0byBpbmplY3QgdGhlIHNjcmlwdCBhZnRlciB0aGUgYnV0dG9uIGhhcyBiZWVuIGFkZGVkXG4gICAgaW5qZWN0U2NyaXB0KHJlZ2lzdGVyQXVkaW9CdXR0b25FdmVudHMpO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkVGFsa0ljb24oYnV0dG9uKSB7XG4gICAgdXBkYXRlSWNvbkNvbnRlbnQoYnV0dG9uKTtcblxuICAgIHdpbmRvdy5tYXRjaE1lZGlhKFwiKG1heC13aWR0aDogNzY4cHgpXCIpLmFkZExpc3RlbmVyKCgpID0+IHtcbiAgICAgIHVwZGF0ZUljb25Db250ZW50KGJ1dHRvbik7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVJY29uQ29udGVudChpY29uQ29udGFpbmVyKSB7XG4gICAgaWYgKGlzTW9iaWxlVmlldygpKSB7XG4gICAgICBpY29uQ29udGFpbmVyLmlubmVySFRNTCA9IHJlY3RhbmdsZXNTVkc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGljb25Db250YWluZXIuaW5uZXJIVE1MID0gdGFsa0ljb25TVkc7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYWRkVXNlckFnZW50RmxhZ3MoKSB7XG4gICAgdmFyIGlzRmlyZWZveEFuZHJvaWQgPVxuICAgICAgL0ZpcmVmb3gvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgJiZcbiAgICAgIC9BbmRyb2lkLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAgIGlmIChpc0ZpcmVmb3hBbmRyb2lkKSB7XG4gICAgICAvLyBoYWNrIGZvciBGaXJlZm94IG9uIEFuZHJvaWQsIHdoaWNoIGRvZXNuJ3Qgc3VwcG9ydCA6YWN0aXZlIGNvcnJlY3RseVxuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJmaXJlZm94LWFuZHJvaWRcIik7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVnaXN0ZXJBdWRpb0J1dHRvbkV2ZW50cygpIHtcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNheXBpLXRhbGtCdXR0b25cIik7XG5cbiAgICAvLyBTZXR0aW5nIHRoZSBjb3JyZWN0IGNvbnRleHRcbiAgICBsZXQgY29udGV4dCA9IHdpbmRvdztcbiAgICBpZiAoR01faW5mby5zY3JpcHRIYW5kbGVyICE9PSBcIlVzZXJzY3JpcHRzXCIpIHtcbiAgICAgIGNvbnRleHQgPSB1bnNhZmVXaW5kb3c7XG4gICAgfVxuICAgIEV2ZW50TW9kdWxlLnNldENvbnRleHQoY29udGV4dCk7IC8vIFNldCB0aGUgY29udGV4dCBmb3IgRXZlbnRNb2R1bGVcblxuICAgIC8vIEF0dGFjaCB0aGUgZXZlbnQgbGlzdGVuZXJzXG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBcIm1vdXNlZG93blwiLFxuICAgICAgRXZlbnRNb2R1bGUuaGFuZGxlVGFsa01vdXNlRG93bi5iaW5kKEV2ZW50TW9kdWxlKVxuICAgICk7XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBcIm1vdXNldXBcIixcbiAgICAgIEV2ZW50TW9kdWxlLmhhbmRsZVRhbGtNb3VzZVVwLmJpbmQoRXZlbnRNb2R1bGUpXG4gICAgKTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImRibGNsaWNrXCIsICgpID0+XG4gICAgICBFdmVudE1vZHVsZS5oYW5kbGVUYWxrRG91YmxlQ2xpY2soYnV0dG9uKVxuICAgICk7XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIChlKSA9PlxuICAgICAgRXZlbnRNb2R1bGUuaGFuZGxlVGFsa1RvdWNoU3RhcnQoYnV0dG9uLCBlKVxuICAgICk7XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCAoKSA9PlxuICAgICAgRXZlbnRNb2R1bGUuaGFuZGxlVGFsa1RvdWNoRW5kKGJ1dHRvbilcbiAgICApO1xuXG4gICAgRXZlbnRNb2R1bGUucmVnaXN0ZXJPdGhlckF1ZGlvQnV0dG9uRXZlbnRzKGJ1dHRvbik7XG4gICAgRXZlbnRNb2R1bGUucmVnaXN0ZXJDdXN0b21BdWRpb0V2ZW50TGlzdGVuZXJzKCk7XG4gICAgRXZlbnRNb2R1bGUucmVnaXN0ZXJIb3RrZXkoKTtcbiAgfVxuXG4gIC8vIFN0YXJ0IG9ic2VydmluZyB0aGUgZW50aXJlIGRvY3VtZW50IGZvciBjaGFuZ2VzIHRvIGNoaWxkIG5vZGVzIGFuZCBzdWJ0cmVlXG4gIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQsIHsgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH0pO1xufSkoKTtcbiJdLCJuYW1lcyI6WyJBbmltYXRpb25Nb2R1bGUiLCJfY2xhc3NDYWxsQ2hlY2siLCJfY3JlYXRlQ2xhc3MiLCJrZXkiLCJ2YWx1ZSIsImFuaW1hdGUiLCJhbmltYXRpb24iLCJzdG9wT3RoZXJBbmltYXRpb25zIiwicmVjdGFuZ2xlcyIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsInJlY3RhbmdsZXNTZWxlY3RvciIsImZvckVhY2giLCJyZWN0IiwiY2xhc3NMaXN0IiwiYWRkIiwiaW5hbmltYXRlIiwicmVtb3ZlIiwic3RvcEFsbEFuaW1hdGlvbnMiLCJfdGhpcyIsInRhbGtCdXR0b25BbmltYXRpb25zIiwia2VlcEFuaW1hdGlvbiIsIl90aGlzMiIsIl9kZWZpbmVQcm9wZXJ0eSIsImRlZmF1bHQiLCJCdXR0b25Nb2R1bGUiLCJwbGF5QnV0dG9uIiwiaGFuZGxlUGxheUJ1dHRvbkNsaWNrIiwiYmluZCIsInJlZ2lzdGVyQnV0dG9uRXZlbnRzIiwicmVnaXN0ZXJPdGhlckV2ZW50cyIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJwb2tlVXNlciIsInVucG9rZVVzZXIiLCJldmVudE5hbWUiLCJ0YWxrQnV0dG9uIiwiZ2V0RWxlbWVudEJ5SWQiLCJoYW5kbGVBdXRvU3VibWl0IiwiY3JlYXRlQnV0dG9uIiwibGFiZWwiLCJjYWxsYmFjayIsImJ1dHRvbiIsImNyZWF0ZUVsZW1lbnQiLCJ0ZXh0Q29udGVudCIsIm9uY2xpY2siLCJzdHlsZUJ1dHRvbiIsInN0eWxlcyIsImhhc093blByb3BlcnR5Iiwic3R5bGUiLCJjcmVhdGVQbGF5QnV0dG9uIiwiaWQiLCJ0eXBlIiwiY2xhc3NOYW1lIiwic2V0QXR0cmlidXRlIiwiYm9keSIsImFwcGVuZENoaWxkIiwic2hvd1BsYXlCdXR0b24iLCJoaWRlUGxheUJ1dHRvbiIsImRpc3BhdGNoQ3VzdG9tRXZlbnQiLCJwaUF1ZGlvTWFuYWdlciIsInVzZXJQbGF5Iiwic2ltdWxhdGVGb3JtU3VibWl0IiwidGV4dGFyZWEiLCJlbnRlckV2ZW50IiwiS2V5Ym9hcmRFdmVudCIsImJ1YmJsZXMiLCJrZXlDb2RlIiwid2hpY2giLCJkaXNwYXRjaEV2ZW50IiwiZGF0YXNldCIsImF1dG9zdWJtaXQiLCJjb25zb2xlIiwibG9nIiwiaXNTYWZhcmkiLCJpc01vYmlsZVZpZXciLCJFdmVudE1vZHVsZSIsImluaXQiLCJoYW5kbGVBdWRpb0V2ZW50cyIsImNsZWFudXAiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiaGFuZGxlVHJhbnNjcmlwdGlvblJlc3BvbnNlIiwiZGV0YWlsIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwidW5kZWZpbmVkIiwiZXZlbnQiLCJDdXN0b21FdmVudCIsInRyYW5zY3JpcHRpb25FdmVudCIsInRyYW5zY3JpcHQiLCJ0ZXh0Iiwic3Vic3RyaW5nIiwid2FybiIsInNldE5hdGl2ZVZhbHVlIiwic2ltdWxhdGVUeXBpbmciLCJlbGVtZW50Iiwid29yZHMiLCJzcGxpdCIsImkiLCJ0eXBlV29yZCIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImxhc3RWYWx1ZSIsIkV2ZW50IiwidGFyZ2V0Iiwic2ltdWxhdGVkIiwidHJhY2tlciIsIl92YWx1ZVRyYWNrZXIiLCJzZXRWYWx1ZSIsImhhbmRsZVRhbGtNb3VzZURvd24iLCJoYW5kbGVUYWxrTW91c2VVcCIsImhhbmRsZVRhbGtEb3VibGVDbGljayIsInRvZ2dsZSIsImdldEF0dHJpYnV0ZSIsImhhbmRsZVRhbGtUb3VjaFN0YXJ0IiwiZSIsInByZXZlbnREZWZhdWx0IiwiaGFuZGxlVGFsa1RvdWNoRW5kIiwic2V0Q29udGV4dCIsImN0eCIsImNvbnRleHQiLCJyZWdpc3Rlck90aGVyQXVkaW9CdXR0b25FdmVudHMiLCJyZWdpc3RlckN1c3RvbUF1ZGlvRXZlbnRMaXN0ZW5lcnMiLCJyZWdpc3RlckhvdGtleSIsImN0cmxEb3duIiwiY3RybEtleSIsImNvZGUiLCJtYXRjaE1lZGlhIiwibWF0Y2hlcyIsInRlc3QiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJ0YWxrSWNvblNWRyIsInJlY3RhbmdsZXNTVkciLCJidXR0b25Nb2R1bGUiLCJsb2NhbENvbmZpZyIsImFwcFNlcnZlclVybCIsImFwaVNlcnZlclVybCIsInByb2R1Y3Rpb25Db25maWciLCJjb25maWciLCJwYWdlU2NyaXB0IiwicmVxdWlyZSIsImFkZFVzZXJBZ2VudEZsYWdzIiwib2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwibXV0YXRpb25zIiwibXV0YXRpb24iLCJhZGRlZE5vZGVzIiwiaiIsIm5vZGUiLCJub2RlTmFtZSIsInRvTG93ZXJDYXNlIiwiY29udGFpbnMiLCJmb290ZXIiLCJidXR0b25Db250YWluZXIiLCJxdWVyeVNlbGVjdG9yIiwiYWRkVGFsa0J1dHRvbiIsImFubm90YXRlRE9NIiwiZGlzY29ubmVjdCIsImZvdW5kUHJvbXB0IiwiYWRkSWRQcm9tcHRUZXh0QXJlYSIsImZvdW5kRm9vdGVyIiwiYWRkSWRGb290ZXIiLCJ0ZXh0YXJlYUVsZW1lbnQiLCJhdWRpb0VsZW1lbnRzIiwiZm91bmQiLCJhdWRpbyIsInByZWNlZGluZ0RpdiIsInByZXZpb3VzRWxlbWVudFNpYmxpbmciLCJ0YWdOYW1lIiwiaW5qZWN0U2NyaXB0Iiwic2NyaXB0RWxlbWVudCIsImNvbmZpZ1RleHQiLCJKU09OIiwic3RyaW5naWZ5IiwiY29udGFpbmVyIiwicGFuZWwiLCJjbGFzc05hbWVzIiwiYWRkVGFsa0ljb24iLCJyZWdpc3RlckF1ZGlvQnV0dG9uRXZlbnRzIiwidXBkYXRlSWNvbkNvbnRlbnQiLCJhZGRMaXN0ZW5lciIsImljb25Db250YWluZXIiLCJpbm5lckhUTUwiLCJpc0ZpcmVmb3hBbmRyb2lkIiwiZG9jdW1lbnRFbGVtZW50IiwiR01faW5mbyIsInNjcmlwdEhhbmRsZXIiLCJ1bnNhZmVXaW5kb3ciLCJvYnNlcnZlIiwiY2hpbGRMaXN0Iiwic3VidHJlZSJdLCJzb3VyY2VSb290IjoiIn0=