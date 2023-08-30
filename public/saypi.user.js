// ==UserScript==
// @name         Say, Pi
// @namespace    http://www.saypi.ai/
// @version      1.3
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
_defineProperty(AnimationModule, "talkButtonAnimations", ["loading", "piSpeaking", "userSpeaking", "transcribing", "readyToRespond"]);


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
/* harmony import */ var _UserAgentModule__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./UserAgentModule */ "./src/UserAgentModule.js");
/* harmony import */ var _exit_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./exit.svg */ "./src/exit.svg");
/* harmony import */ var _rectangles_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./rectangles.svg */ "./src/rectangles.svg");
/* harmony import */ var _waveform_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./waveform.svg */ "./src/waveform.svg");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
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
  }, {
    key: "addTalkIcon",
    value: function addTalkIcon(button) {
      var _this2 = this;
      this.updateIconContent(button);
      window.matchMedia("(max-width: 768px)").addListener(function () {
        _this2.updateIconContent(button);
      });
      this.setupClassObserver(button);
    }
  }, {
    key: "updateIconContent",
    value: function updateIconContent(iconContainer) {
      if ((0,_UserAgentModule__WEBPACK_IMPORTED_MODULE_1__.isMobileView)()) {
        iconContainer.innerHTML = _rectangles_svg__WEBPACK_IMPORTED_MODULE_3__["default"];
      } else {
        iconContainer.innerHTML = _waveform_svg__WEBPACK_IMPORTED_MODULE_4__["default"];
      }
    }
  }, {
    key: "setupClassObserver",
    value: function setupClassObserver(button) {
      var _this3 = this;
      var targetNode = document.documentElement; // The <html> element

      var config = {
        attributes: true,
        attributeFilter: ["class"]
      };
      var callback = function callback(mutationsList, observer) {
        var _iterator = _createForOfIteratorHelper(mutationsList),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var mutation = _step.value;
            if (mutation.type === "attributes") {
              if (mutation.attributeName === "class") {
                if (document.documentElement.classList.contains("mobile-view")) {
                  // 'mobile-view' class was added
                  _this3.updateIconContent(button);
                } else {
                  // 'mobile-view' class was removed
                  _this3.updateIconContent(button);
                }
              }
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      };
      var observer = new MutationObserver(callback);

      // Start observing the target node for configured mutations
      observer.observe(targetNode, config);

      // Later, you can stop observing by calling:
      // observer.disconnect();
    }

    // Simulate an "Enter" keypress event on a form
  }, {
    key: "createExitButton",
    value: function createExitButton() {
      var label = "Exit Voice-Controlled Mobile Mode";
      var button = this.createButton("", function () {
        (0,_UserAgentModule__WEBPACK_IMPORTED_MODULE_1__.exitMobileMode)();
      });
      button.id = "saypi-exitButton";
      button.type = "button";
      button.className = "exit-button fixed rounded-full bg-cream-550 enabled:hover:bg-cream-650";
      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
      button.innerHTML = _exit_svg__WEBPACK_IMPORTED_MODULE_2__["default"];
      document.body.appendChild(button);
      return button;
    }
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
/* harmony export */   addUserAgentFlags: () => (/* binding */ addUserAgentFlags),
/* harmony export */   exitMobileMode: () => (/* binding */ exitMobileMode),
/* harmony export */   isMobileView: () => (/* binding */ isMobileView),
/* harmony export */   isSafari: () => (/* binding */ isSafari)
/* harmony export */ });
var userPreference; // transient variable to store user preference until refresh

function isMobileView() {
  if (userPreference) {
    return userPreference === "mobile";
  }
  return window.matchMedia("(max-width: 768px)").matches;
}

// TODO: dedupe this function from transcriber.js
function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
function exitMobileMode() {
  userPreference = "desktop"; // or 'mobile'

  var element = document.documentElement;
  element.classList.remove("mobile-view");
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

/* heartbeat animation to indicate Pi is preparing to speak */
@keyframes heartbeat {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.loading .outermost {
  animation: heartbeat 2s infinite;
  animation-delay: 0s;
}

.loading .second {
  animation: heartbeat 2s infinite;
  animation-delay: 0.4s;
}

.loading .third {
  animation: heartbeat 2s infinite;
  animation-delay: 0.8s;
}

.loading .fourth {
  animation: heartbeat 2s infinite;
  animation-delay: 1.2s;
}

.loading .fifth {
  animation: heartbeat 2s infinite;
  animation-delay: 1.6s;
}

.loading .innermost {
  animation: heartbeat 2s infinite;
  animation-delay: 2s;
}
`, "",{"version":3,"sources":["webpack://./src/rectangles.css"],"names":[],"mappings":"AAAA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,sBAAsB;EACxB;AACF;AACA;EACE,sCAAsC;EACtC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,mCAAmC;EACnC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,kCAAkC;EAClC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,mCAAmC;EACnC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,kCAAkC;EAClC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,qBAAqB;EACvB;AACF;AACA;EACE,sCAAsC;EACtC,wBAAwB;AAC1B;;AAEA,wDAAwD;AACxD;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,0BAA0B;EAC5B;EACA;IACE,0BAA0B;EAC5B;AACF;AACA;EACE,gCAAgC;EAChC,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,4BAA4B;EAC9B;EACA;IACE,6BAA6B;EAC/B;AACF;AACA;EACE,6BAA6B;EAC7B,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,4BAA4B;EAC9B;EACA;IACE,6BAA6B;EAC/B;AACF;AACA;EACE,4BAA4B;EAC5B,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,4BAA4B;EAC9B;EACA;IACE,6BAA6B;EAC/B;AACF;AACA;EACE,6BAA6B;EAC7B,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,4BAA4B;EAC9B;EACA;IACE,6BAA6B;EAC/B;AACF;AACA;EACE,4BAA4B;EAC5B,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,0BAA0B;EAC5B;EACA;IACE,4BAA4B;EAC9B;AACF;AACA;EACE,gCAAgC;EAChC,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA,iDAAiD;AACjD;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,uBAAuB;EACzB;EACA;IACE,qBAAqB;EACvB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,yCAAyC;EACzC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,oCAAoC;EACtC;EACA;IACE,mCAAmC;EACrC;EACA;IACE,oCAAoC;EACtC;AACF;AACA;EACE,sCAAsC;EACtC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,qCAAqC;EACvC;EACA;IACE,mCAAmC;EACrC;EACA;IACE,oCAAoC;EACtC;AACF;AACA;EACE,qCAAqC;EACrC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,oCAAoC;EACtC;EACA;IACE,mCAAmC;EACrC;EACA;IACE,oCAAoC;EACtC;AACF;AACA;EACE,sCAAsC;EACtC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,qCAAqC;EACvC;EACA;IACE,mCAAmC;EACrC;EACA;IACE,oCAAoC;EACtC;AACF;AACA;EACE,qCAAqC;EACrC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,oCAAoC;EACtC;EACA;IACE,mCAAmC;EACrC;EACA;IACE,oCAAoC;EACtC;AACF;AACA;EACE,yCAAyC;EACzC,wBAAwB;AAC1B;;AAEA,gDAAgD;AAChD;EACE;IACE;mDAC+C;EACjD;EACA;IACE;mDAC+C;EACjD;AACF;AACA,wCAAwC;AACxC;EACE;;IAEE,8BAA8B;EAChC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE;;IAEE,kCAAkC;EACpC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE;;IAEE,kCAAkC;EACpC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE;;IAEE,kCAAkC;EACpC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE;;IAEE,kCAAkC;EACpC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE;;IAEE,kCAAkC;EACpC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE,qDAAqD;AACvD;;AAEA;EACE,mDAAmD;AACrD;;AAEA;EACE,iDAAiD;AACnD;;AAEA;EACE,mDAAmD;AACrD;;AAEA;EACE,iDAAiD;AACnD;;AAEA;EACE,sDAAsD;AACxD;;AAEA,yEAAyE;AACzE;EACE;;IAEE,wBAAwB;IACxB,2BAA2B;EAC7B;EACA;IACE,0BAA0B;IAC1B,+BAA+B;EACjC;AACF;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,yCAAyC;AAC3C;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,yCAAyC;AAC3C;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,yCAAyC;AAC3C;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,yCAAyC;AAC3C;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,yCAAyC;AAC3C;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,uCAAuC;AACzC;;AAEA,6DAA6D;AAC7D;EACE;;IAEE,UAAU;EACZ;EACA;IACE,YAAY;EACd;AACF;;AAEA;EACE,gCAAgC;EAChC,mBAAmB;AACrB;;AAEA;EACE,gCAAgC;EAChC,qBAAqB;AACvB;;AAEA;EACE,gCAAgC;EAChC,qBAAqB;AACvB;;AAEA;EACE,gCAAgC;EAChC,qBAAqB;AACvB;;AAEA;EACE,gCAAgC;EAChC,qBAAqB;AACvB;;AAEA;EACE,gCAAgC;EAChC,mBAAmB;AACrB","sourcesContent":["@keyframes pulse_outermost {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.92);\n  }\n}\n.outermost {\n  animation: pulse_outermost 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_second {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.856);\n  }\n}\n.second {\n  animation: pulse_second 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_third {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.792);\n  }\n}\n.third {\n  animation: pulse_third 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_fourth {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.728);\n  }\n}\n.fourth {\n  animation: pulse_fourth 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_fifth {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.664);\n  }\n}\n.fifth {\n  animation: pulse_fifth 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_innermost {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.6);\n  }\n}\n.innermost {\n  animation: pulse_innermost 5s infinite;\n  transform-origin: center;\n}\n\n/* bounce animation to indicate Pi is waiting to speak */\n@keyframes bounce_outermost {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-5%);\n  }\n  60% {\n    transform: translateY(-3%);\n  }\n}\n.outermost.readyToRespond {\n  animation-name: bounce_outermost;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n@keyframes bounce_second {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-5.8%);\n  }\n  60% {\n    transform: translateY(-3.48%);\n  }\n}\n.second.readyToRespond {\n  animation-name: bounce_second;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n@keyframes bounce_third {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-6.6%);\n  }\n  60% {\n    transform: translateY(-3.96%);\n  }\n}\n.third.readyToRespond {\n  animation-name: bounce_third;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n@keyframes bounce_fourth {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-7.4%);\n  }\n  60% {\n    transform: translateY(-4.44%);\n  }\n}\n.fourth.readyToRespond {\n  animation-name: bounce_fourth;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n@keyframes bounce_fifth {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-8.2%);\n  }\n  60% {\n    transform: translateY(-4.92%);\n  }\n}\n.fifth.readyToRespond {\n  animation-name: bounce_fifth;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n@keyframes bounce_innermost {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-9%);\n  }\n  60% {\n    transform: translateY(-5.4%);\n  }\n}\n.innermost.readyToRespond {\n  animation-name: bounce_innermost;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n/* playful animation to indicate Pi is speaking */\n@keyframes speaking_outermost {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.995);\n  }\n  50% {\n    transform: scale(0.9);\n  }\n  75% {\n    transform: scale(0.895);\n  }\n}\n.outermost.piSpeaking {\n  animation: speaking_outermost 2s infinite;\n  transform-origin: center;\n}\n\n@keyframes speaking_second {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.98) rotate(-1deg);\n  }\n  50% {\n    transform: scale(0.87) rotate(0deg);\n  }\n  75% {\n    transform: scale(0.865) rotate(1deg);\n  }\n}\n.second.piSpeaking {\n  animation: speaking_second 2s infinite;\n  transform-origin: center;\n}\n\n@keyframes speaking_third {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.965) rotate(-2deg);\n  }\n  50% {\n    transform: scale(0.84) rotate(0deg);\n  }\n  75% {\n    transform: scale(0.835) rotate(2deg);\n  }\n}\n.third.piSpeaking {\n  animation: speaking_third 2s infinite;\n  transform-origin: center;\n}\n\n@keyframes speaking_fourth {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.95) rotate(-3deg);\n  }\n  50% {\n    transform: scale(0.81) rotate(0deg);\n  }\n  75% {\n    transform: scale(0.805) rotate(3deg);\n  }\n}\n.fourth.piSpeaking {\n  animation: speaking_fourth 2s infinite;\n  transform-origin: center;\n}\n\n@keyframes speaking_fifth {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.935) rotate(-4deg);\n  }\n  50% {\n    transform: scale(0.78) rotate(0deg);\n  }\n  75% {\n    transform: scale(0.775) rotate(4deg);\n  }\n}\n.fifth.piSpeaking {\n  animation: speaking_fifth 2s infinite;\n  transform-origin: center;\n}\n\n@keyframes speaking_innermost {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.92) rotate(-5deg);\n  }\n  50% {\n    transform: scale(0.75) rotate(0deg);\n  }\n  75% {\n    transform: scale(0.745) rotate(5deg);\n  }\n}\n.innermost.piSpeaking {\n  animation: speaking_innermost 2s infinite;\n  transform-origin: center;\n}\n\n/* wave animation to indicate user is speaking */\n@keyframes userSpeakingAnimation {\n  50% {\n    transform: scaleY(0.05) scaleX(var(--width-factor))\n      translateX(calc(-50% + var(--spread-amount)));\n  }\n  100% {\n    transform: scaleY(1) scaleX(var(--width-factor))\n      translateX(calc(-50% + var(--spread-amount)));\n  }\n}\n/* user speaking oscillation animation */\n@keyframes waveform_outermost {\n  0%,\n  100% {\n    transform: scaleY(1) scaleX(1);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.9) scaleX(0.9);\n  }\n}\n\n@keyframes waveform_second {\n  0%,\n  100% {\n    transform: scaleY(0.9) scaleX(0.9);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.8) scaleX(0.8);\n  }\n}\n\n@keyframes waveform_third {\n  0%,\n  100% {\n    transform: scaleY(0.8) scaleX(0.8);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.7) scaleX(0.7);\n  }\n}\n\n@keyframes waveform_fourth {\n  0%,\n  100% {\n    transform: scaleY(0.7) scaleX(0.7);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.6) scaleX(0.6);\n  }\n}\n\n@keyframes waveform_fifth {\n  0%,\n  100% {\n    transform: scaleY(0.6) scaleX(0.6);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.5) scaleX(0.5);\n  }\n}\n\n@keyframes waveform_innermost {\n  0%,\n  100% {\n    transform: scaleY(0.5) scaleX(0.5);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.4) scaleX(0.4);\n  }\n}\n\n.outermost.userSpeaking {\n  animation: waveform_outermost 0.7s infinite alternate;\n}\n\n.second.userSpeaking {\n  animation: waveform_second 0.65s infinite alternate;\n}\n\n.third.userSpeaking {\n  animation: waveform_third 0.6s infinite alternate;\n}\n\n.fourth.userSpeaking {\n  animation: waveform_fourth 0.55s infinite alternate;\n}\n\n.fifth.userSpeaking {\n  animation: waveform_fifth 0.5s infinite alternate;\n}\n\n.innermost.userSpeaking {\n  animation: waveform_innermost 0.45s infinite alternate;\n}\n\n/* flipcard animation to indicate Say, Pi is transcribing audio to text */\n@keyframes transcribingFlip {\n  0%,\n  100% {\n    transform: rotateY(0deg);\n    fill: var(--original-color);\n  }\n  50% {\n    transform: rotateY(180deg);\n    fill: var(--transcribing-color);\n  }\n}\n\n.outermost.transcribing {\n  --original-color: #e4f2d1;\n  --transcribing-color: #b3e0fe;\n  animation: transcribingFlip 1.5s infinite;\n}\n\n.second.transcribing {\n  --original-color: #cce8b5;\n  --transcribing-color: #89c2ff;\n  animation: transcribingFlip 1.6s infinite;\n}\n\n.third.transcribing {\n  --original-color: #b3db95;\n  --transcribing-color: #5fa4ff;\n  animation: transcribingFlip 1.7s infinite;\n}\n\n.fourth.transcribing {\n  --original-color: #9bd078;\n  --transcribing-color: #3586ff;\n  animation: transcribingFlip 1.8s infinite;\n}\n\n.fifth.transcribing {\n  --original-color: #83c55c;\n  --transcribing-color: #0b69e3;\n  animation: transcribingFlip 1.9s infinite;\n}\n\n.innermost.transcribing {\n  --original-color: #428a2f;\n  --transcribing-color: #0053bf;\n  animation: transcribingFlip 2s infinite;\n}\n\n/* heartbeat animation to indicate Pi is preparing to speak */\n@keyframes heartbeat {\n  0%,\n  100% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.5;\n  }\n}\n\n.loading .outermost {\n  animation: heartbeat 2s infinite;\n  animation-delay: 0s;\n}\n\n.loading .second {\n  animation: heartbeat 2s infinite;\n  animation-delay: 0.4s;\n}\n\n.loading .third {\n  animation: heartbeat 2s infinite;\n  animation-delay: 0.8s;\n}\n\n.loading .fourth {\n  animation: heartbeat 2s infinite;\n  animation-delay: 1.2s;\n}\n\n.loading .fifth {\n  animation: heartbeat 2s infinite;\n  animation-delay: 1.6s;\n}\n\n.loading .innermost {\n  animation: heartbeat 2s infinite;\n  animation-delay: 2s;\n}\n"],"sourceRoot":""}]);
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
  html.mobile-view {
    /* Pi controls: experiences */
    /* Pi controls: mute/unmute */
  }
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
  html.mobile-view #saypi-exitButton {
    position: fixed;
    top: 10px;
    left: 12px;
    width: 52px;
    height: 52px;
    padding: 6px;
    border: 0;
    z-index: 60;
  }
  html.mobile-view #saypi-footer {
    display: none;
  }
}`, "",{"version":3,"sources":["webpack://./src/mobile.scss"],"names":[],"mappings":"AAAA;EACE;IAqBE,6BAAA;IAOA,6BAAA;EAzBF;EAFE;;IAEE,WAAA;IACA,eAAA;IACA,OAAA;IACA,2CAAA;IAEA,aAAA;IACA,MAAA;IACA,WAAA;EAGJ;EAAE;IACE,WAAA;IACA,YAAA;IACA,6BAAA;IACA,gBAAA;IACA,SAAA;EAEJ;EAEE;;IAEE,mBAAA;IACA,WAAA;EAAJ;EAKI;;IAEE,8BAAA;IACA,WAAA;EAHN;EAOE;IACE,eAAA;IACA,SAAA;IACA,UAAA;IACA,WAAA;IACA,YAAA;IACA,YAAA;IACA,SAAA;IACA,WAAA;EALJ;EAQE;IACE,aAAA;EANJ;AACF","sourcesContent":["@media (max-width: 768px) {\n  html.mobile-view {\n    #saypi-panel,\n    .play-button {\n      width: 100%;\n      position: fixed;\n      left: 0;\n      background-color: rgba(245, 238, 223, 0.98);\n\n      height: 100vh;\n      top: 0;\n      padding: 5%;\n    }\n\n    #saypi-talkButton {\n      width: 100%;\n      height: 100%;\n      background-color: transparent;\n      border-radius: 0;\n      margin: 0;\n    }\n\n    /* Pi controls: experiences */\n    #__next > main > div > div > div.fixed.top-4.right-6 > button,\n    div[data-projection-id=\"12\"] > button {\n      transform: scale(2);\n      z-index: 50;\n    }\n\n    /* Pi controls: mute/unmute */\n    button[data-projection-id=\"16\"] {\n      > div[data-projection-id=\"17\"],\n      > div[data-projection-id=\"18\"] {\n        transform: scale(2) !important;\n        z-index: 50;\n      }\n    }\n\n    #saypi-exitButton {\n      position: fixed;\n      top: 10px;\n      left: 12px;\n      width: 52px;\n      height: 52px;\n      padding: 6px;\n      border: 0;\n      z-index: 60;\n    }\n\n    #saypi-footer {\n      display: none;\n    }\n  }\n}\n"],"sourceRoot":""}]);
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

/***/ "./src/exit.svg":
/*!**********************!*\
  !*** ./src/exit.svg ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg id=\"Layer_1\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64.06 64.33\">\n  <defs>\n    <style>\n      .cls-1 {\n        fill: #24381b;\n      }\n\n      .cls-1, .cls-2 {\n        stroke-width: 0px;\n      }\n\n      .cls-2 {\n        fill: #dfd7c2;\n      }\n    </style>\n  </defs>\n  <path class=\"cls-2\" d=\"m31.71,64.32C14.77,64.46-.44,49.93,0,31.33.41,14.47,14.29-.32,32.7,0c16.91.3,31.8,14.32,31.36,33.14-.39,16.76-14.49,31.55-32.34,31.18Zm10.67-23.19c.06-.7-.41-1.12-.84-1.55-2-2-3.94-4.07-6.02-5.97-1.14-1.04-1.32-1.68-.06-2.82,2.13-1.93,4.07-4.08,6.1-6.12.78-.79,1.31-1.64.34-2.56-.92-.87-1.72-.28-2.43.45-2.17,2.21-4.39,4.39-6.52,6.65-.72.77-1.16.7-1.84-.02-2.06-2.17-4.19-4.28-6.29-6.41-.76-.77-1.59-1.68-2.66-.63-1.14,1.12-.19,1.98.62,2.79,2.07,2.09,4.09,4.22,6.2,6.26.77.75.82,1.2.02,1.97-2.21,2.1-4.33,4.3-6.49,6.45-.79.78-1.3,1.65-.32,2.56.92.85,1.71.26,2.43-.47,2.11-2.12,4.28-4.19,6.33-6.38.88-.94,1.37-.86,2.21.03,2.13,2.26,4.37,4.41,6.57,6.6.51.51,1.09.78,1.8.48.56-.24.85-.68.87-1.3Z\"/>\n  <path class=\"cls-1\" d=\"m42.47,41.27c-.02.62-.32,1.06-.87,1.3-.71.31-1.29.03-1.8-.48-2.2-2.2-4.44-4.35-6.57-6.6-.84-.89-1.33-.96-2.21-.03-2.04,2.19-4.22,4.25-6.33,6.38-.72.72-1.51,1.32-2.43.47-.98-.91-.47-1.78.32-2.56,2.16-2.15,4.28-4.35,6.49-6.45.81-.77.76-1.22-.02-1.97-2.11-2.04-4.13-4.17-6.2-6.26-.8-.81-1.75-1.67-.62-2.79,1.07-1.05,1.9-.14,2.66.63,2.1,2.13,4.23,4.24,6.29,6.41.69.73,1.12.79,1.84.02,2.13-2.26,4.35-4.43,6.52-6.65.72-.73,1.51-1.31,2.43-.45.97.92.44,1.78-.34,2.56-2.03,2.04-3.97,4.19-6.1,6.12-1.25,1.14-1.08,1.78.06,2.82,2.09,1.91,4.02,3.97,6.02,5.97.43.43.9.85.84,1.55Z\"/>\n</svg>");

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
/* harmony import */ var _UserAgentModule_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./UserAgentModule.js */ "./src/UserAgentModule.js");
/* harmony import */ var _talkButton_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./talkButton.css */ "./src/talkButton.css");
/* harmony import */ var _mobile_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./mobile.scss */ "./src/mobile.scss");
/* harmony import */ var _rectangles_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./rectangles.css */ "./src/rectangles.css");






(function () {
  "use strict";

  var buttonModule = new _ButtonModule_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
  var localConfig = {
    appServerUrl: "http://localhost:3000",
    apiServerUrl: "http://localhost:8080"
    //apiServerUrl: "https://localhost:4443",
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
  (0,_UserAgentModule_js__WEBPACK_IMPORTED_MODULE_2__.addUserAgentFlags)();
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
            if ((0,_UserAgentModule_js__WEBPACK_IMPORTED_MODULE_2__.isMobileView)()) {
              buttonModule.createExitButton();
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
    buttonModule.addTalkIcon(button);

    // Call the function to inject the script after the button has been added
    injectScript(registerAudioButtonEvents);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyxxRkFBcUYsTUFBTSxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssTUFBTSxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssTUFBTSxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssTUFBTSxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssTUFBTSxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssTUFBTSxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxPQUFPLFlBQVksTUFBTSxTQUFTLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFNBQVMsWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssU0FBUyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxTQUFTLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFNBQVMsWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssU0FBUyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sWUFBWSxNQUFNLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxZQUFZLE1BQU0sS0FBSyxLQUFLLE9BQU8sTUFBTSxLQUFLLEtBQUssT0FBTyxNQUFNLEtBQUssWUFBWSxNQUFNLE1BQU0sWUFBWSxNQUFNLE1BQU0sWUFBWSxNQUFNLE1BQU0sS0FBSyxNQUFNLFlBQVksTUFBTSxNQUFNLFlBQVksTUFBTSxNQUFNLEtBQUssTUFBTSxZQUFZLE1BQU0sTUFBTSxZQUFZLE1BQU0sTUFBTSxLQUFLLE1BQU0sWUFBWSxNQUFNLE1BQU0sWUFBWSxNQUFNLE1BQU0sS0FBSyxNQUFNLFlBQVksTUFBTSxNQUFNLFlBQVksTUFBTSxNQUFNLEtBQUssTUFBTSxZQUFZLE1BQU0sTUFBTSxZQUFZLE1BQU0sTUFBTSxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxZQUFZLE1BQU0sTUFBTSxZQUFZLGFBQWEsTUFBTSxLQUFLLFlBQVksYUFBYSxNQUFNLE1BQU0sS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sWUFBWSxNQUFNLE1BQU0sVUFBVSxLQUFLLEtBQUssVUFBVSxLQUFLLE1BQU0sS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLHNEQUFzRCxpQkFBaUIsMEJBQTBCLEtBQUssU0FBUyw2QkFBNkIsS0FBSyxHQUFHLGNBQWMsMkNBQTJDLDZCQUE2QixHQUFHLDZCQUE2QixpQkFBaUIsMEJBQTBCLEtBQUssU0FBUyw4QkFBOEIsS0FBSyxHQUFHLFdBQVcsd0NBQXdDLDZCQUE2QixHQUFHLDRCQUE0QixpQkFBaUIsMEJBQTBCLEtBQUssU0FBUyw4QkFBOEIsS0FBSyxHQUFHLFVBQVUsdUNBQXVDLDZCQUE2QixHQUFHLDZCQUE2QixpQkFBaUIsMEJBQTBCLEtBQUssU0FBUyw4QkFBOEIsS0FBSyxHQUFHLFdBQVcsd0NBQXdDLDZCQUE2QixHQUFHLDRCQUE0QixpQkFBaUIsMEJBQTBCLEtBQUssU0FBUyw4QkFBOEIsS0FBSyxHQUFHLFVBQVUsdUNBQXVDLDZCQUE2QixHQUFHLGdDQUFnQyxpQkFBaUIsMEJBQTBCLEtBQUssU0FBUyw0QkFBNEIsS0FBSyxHQUFHLGNBQWMsMkNBQTJDLDZCQUE2QixHQUFHLDRGQUE0Rix5Q0FBeUMsK0JBQStCLEtBQUssU0FBUyxpQ0FBaUMsS0FBSyxTQUFTLGlDQUFpQyxLQUFLLEdBQUcsNkJBQTZCLHFDQUFxQywyQkFBMkIsd0NBQXdDLEdBQUcsOEJBQThCLHlDQUF5QywrQkFBK0IsS0FBSyxTQUFTLG1DQUFtQyxLQUFLLFNBQVMsb0NBQW9DLEtBQUssR0FBRywwQkFBMEIsa0NBQWtDLDJCQUEyQix3Q0FBd0MsR0FBRyw2QkFBNkIseUNBQXlDLCtCQUErQixLQUFLLFNBQVMsbUNBQW1DLEtBQUssU0FBUyxvQ0FBb0MsS0FBSyxHQUFHLHlCQUF5QixpQ0FBaUMsMkJBQTJCLHdDQUF3QyxHQUFHLDhCQUE4Qix5Q0FBeUMsK0JBQStCLEtBQUssU0FBUyxtQ0FBbUMsS0FBSyxTQUFTLG9DQUFvQyxLQUFLLEdBQUcsMEJBQTBCLGtDQUFrQywyQkFBMkIsd0NBQXdDLEdBQUcsNkJBQTZCLHlDQUF5QywrQkFBK0IsS0FBSyxTQUFTLG1DQUFtQyxLQUFLLFNBQVMsb0NBQW9DLEtBQUssR0FBRyx5QkFBeUIsaUNBQWlDLDJCQUEyQix3Q0FBd0MsR0FBRyxpQ0FBaUMseUNBQXlDLCtCQUErQixLQUFLLFNBQVMsaUNBQWlDLEtBQUssU0FBUyxtQ0FBbUMsS0FBSyxHQUFHLDZCQUE2QixxQ0FBcUMsMkJBQTJCLHdDQUF3QyxHQUFHLHVGQUF1RixpQkFBaUIsdUNBQXVDLEtBQUssU0FBUyw4QkFBOEIsS0FBSyxTQUFTLDRCQUE0QixLQUFLLFNBQVMsOEJBQThCLEtBQUssR0FBRyx5QkFBeUIsOENBQThDLDZCQUE2QixHQUFHLGdDQUFnQyxpQkFBaUIsdUNBQXVDLEtBQUssU0FBUywyQ0FBMkMsS0FBSyxTQUFTLDBDQUEwQyxLQUFLLFNBQVMsMkNBQTJDLEtBQUssR0FBRyxzQkFBc0IsMkNBQTJDLDZCQUE2QixHQUFHLCtCQUErQixpQkFBaUIsdUNBQXVDLEtBQUssU0FBUyw0Q0FBNEMsS0FBSyxTQUFTLDBDQUEwQyxLQUFLLFNBQVMsMkNBQTJDLEtBQUssR0FBRyxxQkFBcUIsMENBQTBDLDZCQUE2QixHQUFHLGdDQUFnQyxpQkFBaUIsdUNBQXVDLEtBQUssU0FBUywyQ0FBMkMsS0FBSyxTQUFTLDBDQUEwQyxLQUFLLFNBQVMsMkNBQTJDLEtBQUssR0FBRyxzQkFBc0IsMkNBQTJDLDZCQUE2QixHQUFHLCtCQUErQixpQkFBaUIsdUNBQXVDLEtBQUssU0FBUyw0Q0FBNEMsS0FBSyxTQUFTLDBDQUEwQyxLQUFLLFNBQVMsMkNBQTJDLEtBQUssR0FBRyxxQkFBcUIsMENBQTBDLDZCQUE2QixHQUFHLG1DQUFtQyxpQkFBaUIsdUNBQXVDLEtBQUssU0FBUywyQ0FBMkMsS0FBSyxTQUFTLDBDQUEwQyxLQUFLLFNBQVMsMkNBQTJDLEtBQUssR0FBRyx5QkFBeUIsOENBQThDLDZCQUE2QixHQUFHLHlGQUF5RixTQUFTLCtHQUErRyxLQUFLLFVBQVUsNEdBQTRHLEtBQUssR0FBRyw0RUFBNEUsaUJBQWlCLHFDQUFxQyxLQUFLLGlCQUFpQix5Q0FBeUMsS0FBSyxHQUFHLGdDQUFnQyxpQkFBaUIseUNBQXlDLEtBQUssaUJBQWlCLHlDQUF5QyxLQUFLLEdBQUcsK0JBQStCLGlCQUFpQix5Q0FBeUMsS0FBSyxpQkFBaUIseUNBQXlDLEtBQUssR0FBRyxnQ0FBZ0MsaUJBQWlCLHlDQUF5QyxLQUFLLGlCQUFpQix5Q0FBeUMsS0FBSyxHQUFHLCtCQUErQixpQkFBaUIseUNBQXlDLEtBQUssaUJBQWlCLHlDQUF5QyxLQUFLLEdBQUcsbUNBQW1DLGlCQUFpQix5Q0FBeUMsS0FBSyxpQkFBaUIseUNBQXlDLEtBQUssR0FBRyw2QkFBNkIsMERBQTBELEdBQUcsMEJBQTBCLHdEQUF3RCxHQUFHLHlCQUF5QixzREFBc0QsR0FBRywwQkFBMEIsd0RBQXdELEdBQUcseUJBQXlCLHNEQUFzRCxHQUFHLDZCQUE2QiwyREFBMkQsR0FBRyw2R0FBNkcsaUJBQWlCLCtCQUErQixrQ0FBa0MsS0FBSyxTQUFTLGlDQUFpQyxzQ0FBc0MsS0FBSyxHQUFHLDZCQUE2Qiw4QkFBOEIsa0NBQWtDLDhDQUE4QyxHQUFHLDBCQUEwQiw4QkFBOEIsa0NBQWtDLDhDQUE4QyxHQUFHLHlCQUF5Qiw4QkFBOEIsa0NBQWtDLDhDQUE4QyxHQUFHLDBCQUEwQiw4QkFBOEIsa0NBQWtDLDhDQUE4QyxHQUFHLHlCQUF5Qiw4QkFBOEIsa0NBQWtDLDhDQUE4QyxHQUFHLDZCQUE2Qiw4QkFBOEIsa0NBQWtDLDRDQUE0QyxHQUFHLDBGQUEwRixpQkFBaUIsaUJBQWlCLEtBQUssU0FBUyxtQkFBbUIsS0FBSyxHQUFHLHlCQUF5QixxQ0FBcUMsd0JBQXdCLEdBQUcsc0JBQXNCLHFDQUFxQywwQkFBMEIsR0FBRyxxQkFBcUIscUNBQXFDLDBCQUEwQixHQUFHLHNCQUFzQixxQ0FBcUMsMEJBQTBCLEdBQUcscUJBQXFCLHFDQUFxQywwQkFBMEIsR0FBRyx5QkFBeUIscUNBQXFDLHdCQUF3QixHQUFHLHFCQUFxQjtBQUMxaVo7QUFDQSxpRUFBZSx1QkFBdUIsRUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xoQnZDO0FBQzBHO0FBQ2pCO0FBQ3pGLDhCQUE4QixtRkFBMkIsQ0FBQyw0RkFBcUM7QUFDL0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZixzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBLE9BQU8scUZBQXFGLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssTUFBTSxZQUFZLGFBQWEsV0FBVyxvQkFBb0IsT0FBTyxNQUFNLFlBQVksTUFBTSxLQUFLLFVBQVUsS0FBSyxLQUFLLHdCQUF3QixNQUFNLEtBQUssVUFBVSxLQUFLLEtBQUssWUFBWSx1QkFBdUIseUJBQXlCLFdBQVcsMkNBQTJDLFFBQVEsMEJBQTBCLEtBQUssU0FBUyw0QkFBNEIsS0FBSyxVQUFVLDBCQUEwQixLQUFLLEdBQUcsb0NBQW9DLHdCQUF3Qix3QkFBd0IsaUJBQWlCLG9CQUFvQixtQkFBbUIsd0dBQXdHLGlDQUFpQyxHQUFHLCtCQUErQixrQkFBa0IsR0FBRywwQ0FBMEMsMEJBQTBCLGtDQUFrQyxXQUFXLGtCQUFrQixHQUFHLGlDQUFpQyxnRkFBZ0YsNkVBQTZFLGdEQUFnRCxHQUFHLHFCQUFxQjtBQUMxeEM7QUFDQSxpRUFBZSx1QkFBdUIsRUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzdDdkM7QUFDMEc7QUFDakI7QUFDekYsOEJBQThCLG1GQUEyQixDQUFDLDRGQUFxQztBQUMvRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsT0FBTyxrRkFBa0YsS0FBSyxZQUFZLFdBQVcsTUFBTSxNQUFNLFVBQVUsVUFBVSxVQUFVLFdBQVcsVUFBVSxVQUFVLFVBQVUsS0FBSyxLQUFLLFVBQVUsVUFBVSxXQUFXLFdBQVcsVUFBVSxLQUFLLE1BQU0sV0FBVyxVQUFVLEtBQUssTUFBTSxXQUFXLFVBQVUsS0FBSyxLQUFLLFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFBVSxLQUFLLEtBQUssVUFBVSxLQUFLLG9EQUFvRCxzQkFBc0IsdUNBQXVDLG9CQUFvQix3QkFBd0IsZ0JBQWdCLG9EQUFvRCx3QkFBd0IsZUFBZSxvQkFBb0IsT0FBTywyQkFBMkIsb0JBQW9CLHFCQUFxQixzQ0FBc0MseUJBQXlCLGtCQUFrQixPQUFPLHlKQUF5Siw0QkFBNEIsb0JBQW9CLE9BQU8sK0VBQStFLG1GQUFtRix5Q0FBeUMsc0JBQXNCLFNBQVMsT0FBTywyQkFBMkIsd0JBQXdCLGtCQUFrQixtQkFBbUIsb0JBQW9CLHFCQUFxQixxQkFBcUIsa0JBQWtCLG9CQUFvQixPQUFPLHVCQUF1QixzQkFBc0IsT0FBTyxLQUFLLEdBQUcscUJBQXFCO0FBQzlrRDtBQUNBLGlFQUFlLHVCQUF1QixFQUFDOzs7Ozs7Ozs7OztBQ3BEMUI7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRDtBQUNyRDtBQUNBO0FBQ0EsZ0RBQWdEO0FBQ2hEO0FBQ0E7QUFDQSxxRkFBcUY7QUFDckY7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLGlCQUFpQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIscUJBQXFCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLHNGQUFzRixxQkFBcUI7QUFDM0c7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLGlEQUFpRCxxQkFBcUI7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLHNEQUFzRCxxQkFBcUI7QUFDM0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ3BGYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVELGNBQWM7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUNmQSxpRUFBZSxvRUFBb0Usd0ZBQXdGLDRDQUE0Qyx5QkFBeUIsRUFBRSxxREFBcUQsZ0NBQWdDLEdBQUcsK0VBQStFLHNCQUFzQixnREFBZ0QsR0FBRyw0RUFBNEUsc0VBQXNFLEdBQUcsbUNBQW1DLGdFQUFnRSw2VkFBNlYsZ0NBQWdDLEtBQUssdURBQXVELGlDQUFpQyxLQUFLLG9DQUFvQyx3QkFBd0IsZUFBZSxPQUFPLGdDQUFnQywrRkFBK0YsZ0VBQWdFLCtCQUErQixLQUFLLG9DQUFvQywrQkFBK0Isa0NBQWtDLE9BQU8sS0FBSyw0QkFBNEIsNEJBQTRCLGtDQUFrQyxPQUFPLGlJQUFpSSxvRUFBb0UsOERBQThELGlDQUFpQyxLQUFLLGdDQUFnQyxnQ0FBZ0MsS0FBSyxnQ0FBZ0MsK0JBQStCLEtBQUssa0NBQWtDLDZCQUE2QixLQUFLLGtDQUFrQyw4QkFBOEIsZ0NBQWdDLEtBQUssSUFBSSx5SEFBeUgscUJBQXFCLGdDQUFnQyxLQUFLLEdBQUcsRUFBRSw0REFBNEQscUJBQXFCLHNEQUFzRCxLQUFLLEdBQUcsRUFBRSxrSEFBa0gsNkJBQTZCLDhDQUE4QyxHQUFHLEVBQUUsd0RBQXdELDZCQUE2QixxREFBcUQsR0FBRyxFQUFFLHdEQUF3RCw2QkFBNkIsc0RBQXNELEdBQUcsRUFBRSxvREFBb0QsbUNBQW1DLGNBQWMsbUNBQW1DLGlFQUFpRSx1Q0FBdUMsMkNBQTJDLG9DQUFvQyxLQUFLLHlHQUF5Ryw4RUFBOEUsZ0RBQWdELDRIQUE0SCxnREFBZ0QsNEJBQTRCLHlCQUF5Qix5Q0FBeUMsT0FBTyw2QkFBNkIsS0FBSyxnQ0FBZ0Msa0RBQWtELHNDQUFzQyxFQUFFLEtBQUssK0JBQStCLGlFQUFpRSwrREFBK0QsdUdBQXVHLEtBQUssRUFBRSxHQUFHLDBFQUEwRSx3QkFBd0IsaUtBQWlLLDZFQUE2RSxHQUFHLHdGQUF3Riw4RkFBOEYsOEJBQThCLEVBQUUsbUZBQW1GLCtDQUErQywwSEFBMEgsc0ZBQXNGLEtBQUssd0VBQXdFLEdBQUcscUNBQXFDLHdCQUF3QixhQUFhLEtBQUsseUZBQXlGLHNCQUFzQiwwQkFBMEIsMERBQTBELG1FQUFtRSxPQUFPLDZHQUE2Ryx1Q0FBdUMseURBQXlELDRIQUE0SCxpR0FBaUcsS0FBSyxvQkFBb0Isa0ZBQWtGLG1CQUFtQixPQUFPLEtBQUssNkJBQTZCLDREQUE0RCxLQUFLLEVBQUUsR0FBRyxnQ0FBZ0Msb0VBQW9FLGFBQWEsS0FBSyxtRkFBbUYsMkJBQTJCLEtBQUssaUlBQWlJLDREQUE0RCxrRUFBa0UsR0FBRyx3SEFBd0gsb0VBQW9FLHFDQUFxQyxhQUFhLEtBQUssK0ZBQStGLDZCQUE2QixLQUFLLGtEQUFrRCxnRUFBZ0UsZ0RBQWdELEdBQUcsbUhBQW1ILGlFQUFpRSxrREFBa0QsMEZBQTBGLGlEQUFpRCxnSUFBZ0ksa0ZBQWtGLDJEQUEyRCxnQ0FBZ0MsUUFBUSxNQUFNLDhCQUE4Qiw0REFBNEQsT0FBTyxLQUFLLEdBQUcsZ0RBQWdELG9FQUFvRSx1QkFBdUIsS0FBSyxFQUFFLHVFQUF1RSwwQkFBMEIsS0FBSyxFQUFFLG9FQUFvRSx1QkFBdUIsS0FBSyxFQUFFLG1FQUFtRSxzQkFBc0IsS0FBSyxFQUFFLEdBQUcsc0NBQXNDLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDQW4vUSxpRUFBZSwrTEFBK0wsd0JBQXdCLFNBQVMsMEJBQTBCLDRCQUE0QixTQUFTLGtCQUFrQix3QkFBd0IsU0FBUywrMENBQSswQzs7Ozs7Ozs7Ozs7Ozs7QUNBaHJELGlFQUFlLDZPQUE2Tyw0QkFBNEIsU0FBUyw0QkFBNEIsd0JBQXdCLFNBQVMsbUJBQW1CLHdCQUF3QixTQUFTLGtCQUFrQix3QkFBd0IsU0FBUyxtQkFBbUIsd0JBQXdCLFNBQVMsa0JBQWtCLHdCQUF3QixTQUFTLHNCQUFzQix3QkFBd0IsU0FBUyw2d0RBQTZ3RDs7Ozs7Ozs7Ozs7Ozs7QUNBaDNFLGlFQUFlLDgwREFBODBEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQzcxRCxNQUErRjtBQUMvRixNQUFxRjtBQUNyRixNQUE0RjtBQUM1RixNQUErRztBQUMvRyxNQUF3RztBQUN4RyxNQUF3RztBQUN4RyxNQUF3RztBQUN4RztBQUNBOztBQUVBOztBQUVBLDRCQUE0QixxR0FBbUI7QUFDL0Msd0JBQXdCLGtIQUFhOztBQUVyQyx1QkFBdUIsdUdBQWE7QUFDcEM7QUFDQSxpQkFBaUIsK0ZBQU07QUFDdkIsNkJBQTZCLHNHQUFrQjs7QUFFL0MsYUFBYSwwR0FBRyxDQUFDLDJGQUFPOzs7O0FBSWtEO0FBQzFFLE9BQU8saUVBQWUsMkZBQU8sSUFBSSwyRkFBTyxVQUFVLDJGQUFPLG1CQUFtQixFQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3pCN0UsTUFBK0Y7QUFDL0YsTUFBcUY7QUFDckYsTUFBNEY7QUFDNUYsTUFBK0c7QUFDL0csTUFBd0c7QUFDeEcsTUFBd0c7QUFDeEcsTUFBd0c7QUFDeEc7QUFDQTs7QUFFQTs7QUFFQSw0QkFBNEIscUdBQW1CO0FBQy9DLHdCQUF3QixrSEFBYTs7QUFFckMsdUJBQXVCLHVHQUFhO0FBQ3BDO0FBQ0EsaUJBQWlCLCtGQUFNO0FBQ3ZCLDZCQUE2QixzR0FBa0I7O0FBRS9DLGFBQWEsMEdBQUcsQ0FBQywyRkFBTzs7OztBQUlrRDtBQUMxRSxPQUFPLGlFQUFlLDJGQUFPLElBQUksMkZBQU8sVUFBVSwyRkFBTyxtQkFBbUIsRUFBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6QjdFLE1BQStGO0FBQy9GLE1BQXFGO0FBQ3JGLE1BQTRGO0FBQzVGLE1BQStHO0FBQy9HLE1BQXdHO0FBQ3hHLE1BQXdHO0FBQ3hHLE1BQXFNO0FBQ3JNO0FBQ0E7O0FBRUE7O0FBRUEsNEJBQTRCLHFHQUFtQjtBQUMvQyx3QkFBd0Isa0hBQWE7O0FBRXJDLHVCQUF1Qix1R0FBYTtBQUNwQztBQUNBLGlCQUFpQiwrRkFBTTtBQUN2Qiw2QkFBNkIsc0dBQWtCOztBQUUvQyxhQUFhLDBHQUFHLENBQUMsNktBQU87Ozs7QUFJK0k7QUFDdkssT0FBTyxpRUFBZSw2S0FBTyxJQUFJLDZLQUFPLFVBQVUsNktBQU8sbUJBQW1CLEVBQUM7Ozs7Ozs7Ozs7O0FDMUJoRTs7QUFFYjtBQUNBO0FBQ0E7QUFDQSxrQkFBa0Isd0JBQXdCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLGlCQUFpQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLDRCQUE0QjtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLDZCQUE2QjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ25GYTs7QUFFYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNqQ2E7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ1RhOztBQUViO0FBQ0E7QUFDQSxjQUFjLEtBQXdDLEdBQUcsc0JBQWlCLEdBQUcsQ0FBSTtBQUNqRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDVGE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0Q7QUFDbEQ7QUFDQTtBQUNBLDBDQUEwQztBQUMxQztBQUNBO0FBQ0E7QUFDQSxpRkFBaUY7QUFDakY7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSx5REFBeUQ7QUFDekQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUM1RGE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztVQ2JBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOzs7Ozs7Ozs7Ozs7Ozs7OztBQ0E2QztBQUNGO0FBQzRCO0FBQzdDO0FBQ0g7QUFDRztBQUMxQixDQUFDLFlBQVk7RUFDWCxZQUFZOztFQUVaLElBQU1xSixZQUFZLEdBQUcsSUFBSXhJLHdEQUFZLENBQUMsQ0FBQztFQUV2QyxJQUFNeUksV0FBVyxHQUFHO0lBQ2xCQyxZQUFZLEVBQUUsdUJBQXVCO0lBQ3JDQyxZQUFZLEVBQUU7SUFDZDtJQUNBO0VBQ0YsQ0FBQzs7RUFFRDtFQUNBLElBQU1DLGdCQUFnQixHQUFHO0lBQ3ZCRixZQUFZLEVBQUUsc0JBQXNCO0lBQ3BDQyxZQUFZLEVBQUU7SUFDZDtFQUNGLENBQUM7O0VBQ0QsSUFBTXhHLE1BQU0sR0FBR3lHLGdCQUFnQjtFQUUvQixJQUFNQyxVQUFVLEdBQUdDLGlJQUE4QztFQUNqRVIsc0VBQWlCLENBQUMsQ0FBQztFQUNuQnRELHVEQUFXLENBQUNDLElBQUksQ0FBQyxDQUFDOztFQUVsQjtFQUNBLElBQUkxQyxRQUFRLEdBQUcsSUFBSWMsZ0JBQWdCLENBQUMsVUFBVTBGLFNBQVMsRUFBRTtJQUN2RDtJQUNBLEtBQUssSUFBSXpDLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR3lDLFNBQVMsQ0FBQ3ZELE1BQU0sRUFBRWMsQ0FBQyxFQUFFLEVBQUU7TUFDekMsSUFBSXhELFFBQVEsR0FBR2lHLFNBQVMsQ0FBQ3pDLENBQUMsQ0FBQzs7TUFFM0I7TUFDQSxJQUFJeEQsUUFBUSxDQUFDa0csVUFBVSxDQUFDeEQsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUNsQyxLQUFLLElBQUl5RCxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUduRyxRQUFRLENBQUNrRyxVQUFVLENBQUN4RCxNQUFNLEVBQUV5RCxDQUFDLEVBQUUsRUFBRTtVQUNuRCxJQUFJQyxJQUFJLEdBQUdwRyxRQUFRLENBQUNrRyxVQUFVLENBQUNDLENBQUMsQ0FBQzs7VUFFakM7VUFDQSxJQUNFQyxJQUFJLENBQUNDLFFBQVEsQ0FBQ0MsV0FBVyxDQUFDLENBQUMsS0FBSyxLQUFLLElBQ3JDRixJQUFJLENBQUNsSyxTQUFTLENBQUNpRSxRQUFRLENBQUMsT0FBTyxDQUFDLElBQ2hDaUcsSUFBSSxDQUFDbEssU0FBUyxDQUFDaUUsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUNwQztZQUNBLElBQUlvRyxNQUFNLEdBQUdILElBQUk7WUFDakIsSUFBSUksZUFBZSxHQUFHRCxNQUFNLENBQUNFLGFBQWEsQ0FDeEMseUJBQ0YsQ0FBQztZQUNELElBQUlELGVBQWUsRUFBRTtjQUNuQkUsYUFBYSxDQUFDRixlQUFlLENBQUM7WUFDaEMsQ0FBQyxNQUFNO2NBQ0x6RSxPQUFPLENBQUNtQixJQUFJLENBQUMscUNBQXFDLENBQUM7WUFDckQ7WUFDQSxJQUFJLENBQUN5RCxXQUFXLENBQUMsQ0FBQyxFQUFFO2NBQ2xCNUUsT0FBTyxDQUFDbUIsSUFBSSxDQUFDLG9DQUFvQyxDQUFDO1lBQ3BEO1lBQ0EsSUFBSXBHLGlFQUFZLENBQUMsQ0FBQyxFQUFFO2NBQ2xCNEksWUFBWSxDQUFDakYsZ0JBQWdCLENBQUMsQ0FBQztZQUNqQztZQUNBaEIsUUFBUSxDQUFDbUgsVUFBVSxDQUFDLENBQUM7WUFDckI7VUFDRjtRQUNGO01BQ0Y7SUFDRjtFQUNGLENBQUMsQ0FBQztFQUVGLFNBQVNELFdBQVdBLENBQUEsRUFBRztJQUNyQjtJQUNBLElBQU1FLFdBQVcsR0FBR0MsbUJBQW1CLENBQUMsQ0FBQztJQUN6QyxJQUFNQyxXQUFXLEdBQUdDLFdBQVcsQ0FBQyxDQUFDO0lBQ2pDLE9BQU9ILFdBQVcsSUFBSUUsV0FBVztFQUNuQztFQUVBLFNBQVNELG1CQUFtQkEsQ0FBQSxFQUFHO0lBQzdCLElBQUl4RixRQUFRLEdBQUd6RixRQUFRLENBQUNpQyxjQUFjLENBQUMsY0FBYyxDQUFDO0lBQ3RELElBQUksQ0FBQ3dELFFBQVEsRUFBRTtNQUNiO01BQ0EsSUFBSTJGLGVBQWUsR0FBR3BMLFFBQVEsQ0FBQzRLLGFBQWEsQ0FBQyxVQUFVLENBQUM7TUFDeEQsSUFBSVEsZUFBZSxFQUFFO1FBQ25CQSxlQUFlLENBQUN2RyxFQUFFLEdBQUcsY0FBYztNQUNyQyxDQUFDLE1BQU07UUFDTHFCLE9BQU8sQ0FBQ21CLElBQUksQ0FBQyw2QkFBNkIsQ0FBQztRQUMzQyxPQUFPLEtBQUs7TUFDZDtJQUNGO0lBQ0EsT0FBTyxJQUFJO0VBQ2I7RUFFQSxTQUFTOEQsV0FBV0EsQ0FBQSxFQUFHO0lBQ3JCO0lBQ0EsSUFBSUUsYUFBYSxHQUFHckwsUUFBUSxDQUFDQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUM7SUFDdEQsSUFBSXFMLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQzs7SUFFbkJELGFBQWEsQ0FBQ2xMLE9BQU8sQ0FBQyxVQUFVb0wsS0FBSyxFQUFFO01BQ3JDLElBQUlDLFlBQVksR0FBR0QsS0FBSyxDQUFDRSxzQkFBc0I7O01BRS9DO01BQ0EsSUFBSUgsS0FBSyxFQUFFOztNQUVYO01BQ0EsSUFBSUUsWUFBWSxJQUFJQSxZQUFZLENBQUNFLE9BQU8sQ0FBQ2pCLFdBQVcsQ0FBQyxDQUFDLEtBQUssS0FBSyxFQUFFO1FBQ2hFO1FBQ0FlLFlBQVksQ0FBQzNHLEVBQUUsR0FBRyxjQUFjO1FBQ2hDeUcsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDO01BQ2hCO0lBQ0YsQ0FBQyxDQUFDOztJQUVGLE9BQU9BLEtBQUs7RUFDZDtFQUVBLFNBQVNLLFlBQVlBLENBQUN0SixRQUFRLEVBQUU7SUFDOUIsSUFBSXVKLGFBQWEsR0FBRzVMLFFBQVEsQ0FBQ3VDLGFBQWEsQ0FBQyxRQUFRLENBQUM7SUFDcERxSixhQUFhLENBQUN4SCxJQUFJLEdBQUcsaUJBQWlCO0lBQ3RDd0gsYUFBYSxDQUFDL0csRUFBRSxHQUFHLGNBQWM7SUFDakMsSUFBTWdILFVBQVUsR0FBRyxlQUFlLEdBQUdDLElBQUksQ0FBQ0MsU0FBUyxDQUFDdkksTUFBTSxDQUFDLEdBQUcsR0FBRztJQUNqRW9JLGFBQWEsQ0FBQ3BKLFdBQVcsR0FBR3FKLFVBQVUsR0FBRzNCLFVBQVU7SUFDbkRsSyxRQUFRLENBQUNnRixJQUFJLENBQUNDLFdBQVcsQ0FBQzJHLGFBQWEsQ0FBQzs7SUFFeEM7SUFDQSxJQUFJdkosUUFBUSxFQUFFO01BQ1pBLFFBQVEsQ0FBQyxDQUFDO0lBQ1o7RUFDRjtFQUVBLFNBQVN3SSxhQUFhQSxDQUFDbUIsU0FBUyxFQUFFO0lBQ2hDO0lBQ0EsSUFBSUMsS0FBSyxHQUFHak0sUUFBUSxDQUFDdUMsYUFBYSxDQUFDLEtBQUssQ0FBQztJQUN6QzBKLEtBQUssQ0FBQ3BILEVBQUUsR0FBRyxhQUFhO0lBQ3hCbUgsU0FBUyxDQUFDL0csV0FBVyxDQUFDZ0gsS0FBSyxDQUFDOztJQUU1QjtJQUNBLElBQU03SixLQUFLLEdBQ1Qsc0ZBQXNGO0lBQ3hGLElBQUlFLE1BQU0sR0FBR3VILFlBQVksQ0FBQzFILFlBQVksQ0FBQyxFQUFFLEVBQUUsWUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O0lBRXRERyxNQUFNLENBQUN1QyxFQUFFLEdBQUcsa0JBQWtCO0lBQzlCdkMsTUFBTSxDQUFDOEIsSUFBSSxHQUFHLFFBQVE7O0lBRXRCO0lBQ0E5QixNQUFNLENBQUN5QyxZQUFZLENBQUMsWUFBWSxFQUFFM0MsS0FBSyxDQUFDO0lBQ3hDRSxNQUFNLENBQUN5QyxZQUFZLENBQUMsT0FBTyxFQUFFM0MsS0FBSyxDQUFDO0lBRW5DLElBQU04SixVQUFVLEdBQ2Qsa0lBQWtJO0lBQ3BJNUosTUFBTSxDQUFDakMsU0FBUyxDQUFDQyxHQUFHLENBQUM0TCxVQUFVLENBQUN4RSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7O0lBRTNDO0lBQ0FwRixNQUFNLENBQUMwRCxPQUFPLENBQUNDLFVBQVUsR0FBRyxNQUFNO0lBQ2xDM0QsTUFBTSxDQUFDakMsU0FBUyxDQUFDQyxHQUFHLENBQUMsWUFBWSxDQUFDO0lBRWxDMkwsS0FBSyxDQUFDaEgsV0FBVyxDQUFDM0MsTUFBTSxDQUFDO0lBQ3pCdUgsWUFBWSxDQUFDL0csV0FBVyxDQUFDUixNQUFNLENBQUM7O0lBRWhDO0lBQ0FxSixZQUFZLENBQUNRLHlCQUF5QixDQUFDO0VBQ3pDO0VBRUEsU0FBU0EseUJBQXlCQSxDQUFBLEVBQUc7SUFDbkMsSUFBTTdKLE1BQU0sR0FBR3RDLFFBQVEsQ0FBQ2lDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQzs7SUFFMUQ7SUFDQSxJQUFJOEcsT0FBTyxHQUFHcEgsTUFBTTtJQUNwQixJQUFJeUssT0FBTyxDQUFDQyxhQUFhLEtBQUssYUFBYSxFQUFFO01BQzNDdEQsT0FBTyxHQUFHdUQsWUFBWTtJQUN4QjtJQUNBakcsdURBQVcsQ0FBQ3dDLFVBQVUsQ0FBQ0UsT0FBTyxDQUFDLENBQUMsQ0FBQzs7SUFFakM7SUFDQXpHLE1BQU0sQ0FBQ1YsZ0JBQWdCLENBQ3JCLFdBQVcsRUFDWHlFLHVEQUFXLENBQUNnQyxtQkFBbUIsQ0FBQzdHLElBQUksQ0FBQzZFLHVEQUFXLENBQ2xELENBQUM7SUFDRC9ELE1BQU0sQ0FBQ1YsZ0JBQWdCLENBQ3JCLFNBQVMsRUFDVHlFLHVEQUFXLENBQUNpQyxpQkFBaUIsQ0FBQzlHLElBQUksQ0FBQzZFLHVEQUFXLENBQ2hELENBQUM7SUFDRC9ELE1BQU0sQ0FBQ1YsZ0JBQWdCLENBQUMsVUFBVSxFQUFFO01BQUEsT0FDbEN5RSx1REFBVyxDQUFDa0MscUJBQXFCLENBQUNqRyxNQUFNLENBQUM7SUFBQSxDQUMzQyxDQUFDO0lBQ0RBLE1BQU0sQ0FBQ1YsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLFVBQUM0QyxDQUFDO01BQUEsT0FDdEM2Qix1REFBVyxDQUFDcUMsb0JBQW9CLENBQUNwRyxNQUFNLEVBQUVrQyxDQUFDLENBQUM7SUFBQSxDQUM3QyxDQUFDO0lBQ0RsQyxNQUFNLENBQUNWLGdCQUFnQixDQUFDLFVBQVUsRUFBRTtNQUFBLE9BQ2xDeUUsdURBQVcsQ0FBQ3VDLGtCQUFrQixDQUFDdEcsTUFBTSxDQUFDO0lBQUEsQ0FDeEMsQ0FBQztJQUVEK0QsdURBQVcsQ0FBQzJDLDhCQUE4QixDQUFDMUcsTUFBTSxDQUFDO0lBQ2xEK0QsdURBQVcsQ0FBQzRDLGlDQUFpQyxDQUFDLENBQUM7SUFDL0M1Qyx1REFBVyxDQUFDNkMsY0FBYyxDQUFDLENBQUM7RUFDOUI7O0VBRUE7RUFDQXRGLFFBQVEsQ0FBQ2UsT0FBTyxDQUFDM0UsUUFBUSxFQUFFO0lBQUV1TSxTQUFTLEVBQUUsSUFBSTtJQUFFQyxPQUFPLEVBQUU7RUFBSyxDQUFDLENBQUM7QUFDaEUsQ0FBQyxFQUFFLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL0FuaW1hdGlvbk1vZHVsZS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL0J1dHRvbk1vZHVsZS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL0V2ZW50TW9kdWxlLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvVXNlckFnZW50TW9kdWxlLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvcmVjdGFuZ2xlcy5jc3MiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy90YWxrQnV0dG9uLmNzcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL21vYmlsZS5zY3NzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3RyYW5zY3JpYmVyLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvZXhpdC5zdmciLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9yZWN0YW5nbGVzLnN2ZyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3dhdmVmb3JtLnN2ZyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3JlY3RhbmdsZXMuY3NzPzAzNjIiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy90YWxrQnV0dG9uLmNzcz8wN2Y1Iiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvbW9iaWxlLnNjc3M/ZjIzZSIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvc2F5cGkuaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQW5pbWF0aW9uTW9kdWxlIHtcbiAgc3RhdGljIHJlY3RhbmdsZXNTZWxlY3RvciA9XG4gICAgXCIub3V0ZXJtb3N0LCAuc2Vjb25kLCAudGhpcmQsIC5mb3VydGgsIC5maWZ0aCwgLmlubmVybW9zdFwiO1xuICBzdGF0aWMgdGFsa0J1dHRvbkFuaW1hdGlvbnMgPSBbXG4gICAgXCJsb2FkaW5nXCIsXG4gICAgXCJwaVNwZWFraW5nXCIsXG4gICAgXCJ1c2VyU3BlYWtpbmdcIixcbiAgICBcInRyYW5zY3JpYmluZ1wiLFxuICAgIFwicmVhZHlUb1Jlc3BvbmRcIixcbiAgXTtcblxuICBzdGF0aWMgYW5pbWF0ZShhbmltYXRpb24pIHtcbiAgICB0aGlzLnN0b3BPdGhlckFuaW1hdGlvbnMoYW5pbWF0aW9uKTtcblxuICAgIGxldCByZWN0YW5nbGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLnJlY3RhbmdsZXNTZWxlY3Rvcik7XG4gICAgcmVjdGFuZ2xlcy5mb3JFYWNoKChyZWN0KSA9PiByZWN0LmNsYXNzTGlzdC5hZGQoYW5pbWF0aW9uKSk7XG4gIH1cblxuICBzdGF0aWMgaW5hbmltYXRlKGFuaW1hdGlvbikge1xuICAgIGxldCByZWN0YW5nbGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLnJlY3RhbmdsZXNTZWxlY3Rvcik7XG4gICAgcmVjdGFuZ2xlcy5mb3JFYWNoKChyZWN0KSA9PiByZWN0LmNsYXNzTGlzdC5yZW1vdmUoYW5pbWF0aW9uKSk7XG4gIH1cblxuICBzdGF0aWMgc3RvcEFsbEFuaW1hdGlvbnMoKSB7XG4gICAgdGhpcy50YWxrQnV0dG9uQW5pbWF0aW9ucy5mb3JFYWNoKChhbmltYXRpb24pID0+IHRoaXMuaW5hbmltYXRlKGFuaW1hdGlvbikpO1xuICB9XG5cbiAgc3RhdGljIHN0b3BPdGhlckFuaW1hdGlvbnMoa2VlcEFuaW1hdGlvbikge1xuICAgIHRoaXMudGFsa0J1dHRvbkFuaW1hdGlvbnMuZm9yRWFjaCgoYW5pbWF0aW9uKSA9PiB7XG4gICAgICBpZiAoYW5pbWF0aW9uICE9PSBrZWVwQW5pbWF0aW9uKSB7XG4gICAgICAgIHRoaXMuaW5hbmltYXRlKGFuaW1hdGlvbik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCBBbmltYXRpb25Nb2R1bGUgZnJvbSBcIi4vQW5pbWF0aW9uTW9kdWxlXCI7XG5pbXBvcnQgeyBleGl0TW9iaWxlTW9kZSwgaXNNb2JpbGVWaWV3IH0gZnJvbSBcIi4vVXNlckFnZW50TW9kdWxlXCI7XG5pbXBvcnQgZXhpdEljb25TVkcgZnJvbSBcIi4vZXhpdC5zdmdcIjtcbmltcG9ydCByZWN0YW5nbGVzU1ZHIGZyb20gXCIuL3JlY3RhbmdsZXMuc3ZnXCI7XG5pbXBvcnQgdGFsa0ljb25TVkcgZnJvbSBcIi4vd2F2ZWZvcm0uc3ZnXCI7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCdXR0b25Nb2R1bGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnBsYXlCdXR0b24gPSBudWxsO1xuICAgIC8vIEJpbmRpbmcgbWV0aG9kcyB0byB0aGUgY3VycmVudCBpbnN0YW5jZVxuICAgIHRoaXMuaGFuZGxlUGxheUJ1dHRvbkNsaWNrID0gdGhpcy5oYW5kbGVQbGF5QnV0dG9uQ2xpY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlZ2lzdGVyQnV0dG9uRXZlbnRzKCk7XG4gICAgdGhpcy5yZWdpc3Rlck90aGVyRXZlbnRzKCk7XG4gIH1cblxuICByZWdpc3RlckJ1dHRvbkV2ZW50cygpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNheXBpOmF3YWl0aW5nVXNlcklucHV0XCIsICgpID0+IHtcbiAgICAgIHRoaXMucG9rZVVzZXIoKTtcbiAgICB9KTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNheXBpOnJlY2VpdmVkVXNlcklucHV0XCIsICgpID0+IHtcbiAgICAgIHRoaXMudW5wb2tlVXNlcigpO1xuICAgIH0pO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiYXVkaW86bG9hZGluZ1wiLCAoKSA9PiB7XG4gICAgICBBbmltYXRpb25Nb2R1bGUuYW5pbWF0ZShcImxvYWRpbmdcIik7XG4gICAgfSk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzYXlwaTpwaVNwZWFraW5nXCIsICgpID0+IHtcbiAgICAgIHRoaXMudW5wb2tlVXNlcigpOyAvLyBwbGF5YmFjayBoYXMgc3RhcnRlZCwgdXNlciBpbnB1dCBpcyBubyBsb25nZXIgbmVlZGVkXG4gICAgICBBbmltYXRpb25Nb2R1bGUuaW5hbmltYXRlKFwibG9hZGluZ1wiKTtcbiAgICAgIEFuaW1hdGlvbk1vZHVsZS5hbmltYXRlKFwicGlTcGVha2luZ1wiKTtcbiAgICB9KTtcbiAgICBbXCJzYXlwaTpwaVN0b3BwZWRTcGVha2luZ1wiLCBcInNheXBpOnBpRmluaXNoZWRTcGVha2luZ1wiXS5mb3JFYWNoKFxuICAgICAgKGV2ZW50TmFtZSkgPT4ge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsICgpID0+IHtcbiAgICAgICAgICBBbmltYXRpb25Nb2R1bGUuaW5hbmltYXRlKFwicGlTcGVha2luZ1wiKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNheXBpOnVzZXJTcGVha2luZ1wiLCAoKSA9PiB7XG4gICAgICBjb25zdCB0YWxrQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS10YWxrQnV0dG9uXCIpO1xuICAgICAgdGFsa0J1dHRvbi5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpOyAvLyBBZGQgdGhlIGFjdGl2ZSBjbGFzcyAoZm9yIEZpcmVmb3ggb24gQW5kcm9pZClcbiAgICAgIEFuaW1hdGlvbk1vZHVsZS5hbmltYXRlKFwidXNlclNwZWFraW5nXCIpO1xuICAgIH0pO1xuICAgIFtcInNheXBpOnVzZXJTdG9wcGVkU3BlYWtpbmdcIiwgXCJzYXlwaTp1c2VyRmluaXNoZWRTcGVha2luZ1wiXS5mb3JFYWNoKFxuICAgICAgKGV2ZW50TmFtZSkgPT4ge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsICgpID0+IHtcbiAgICAgICAgICBjb25zdCB0YWxrQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS10YWxrQnV0dG9uXCIpO1xuICAgICAgICAgIHRhbGtCdXR0b24uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTsgLy8gUmVtb3ZlIHRoZSBhY3RpdmUgY2xhc3MgKGZvciBGaXJlZm94IG9uIEFuZHJvaWQpXG4gICAgICAgICAgQW5pbWF0aW9uTW9kdWxlLmluYW5pbWF0ZShcInVzZXJTcGVha2luZ1wiKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNheXBpOnRyYW5zY3JpYmluZ1wiLCAoKSA9PiB7XG4gICAgICBBbmltYXRpb25Nb2R1bGUuYW5pbWF0ZShcInRyYW5zY3JpYmluZ1wiKTtcbiAgICB9KTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNheXBpOnRyYW5zY3JpYmVkXCIsICgpID0+IHtcbiAgICAgIEFuaW1hdGlvbk1vZHVsZS5pbmFuaW1hdGUoXCJ0cmFuc2NyaWJpbmdcIik7XG4gICAgfSk7XG4gIH1cblxuICByZWdpc3Rlck90aGVyRXZlbnRzKCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2F5cGk6YXV0b1N1Ym1pdFwiLCBCdXR0b25Nb2R1bGUuaGFuZGxlQXV0b1N1Ym1pdCk7XG4gIH1cblxuICAvLyBGdW5jdGlvbiB0byBjcmVhdGUgYSBuZXcgYnV0dG9uXG4gIGNyZWF0ZUJ1dHRvbihsYWJlbCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9IGxhYmVsO1xuICAgIGJ1dHRvbi5vbmNsaWNrID0gY2FsbGJhY2s7XG4gICAgcmV0dXJuIGJ1dHRvbjtcbiAgfVxuXG4gIC8vIEZ1bmN0aW9uIHRvIHN0eWxlIGEgZ2l2ZW4gYnV0dG9uXG4gIHN0eWxlQnV0dG9uKGJ1dHRvbiwgc3R5bGVzKSB7XG4gICAgZm9yIChsZXQga2V5IGluIHN0eWxlcykge1xuICAgICAgaWYgKHN0eWxlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIGJ1dHRvbi5zdHlsZVtrZXldID0gc3R5bGVzW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYWRkVGFsa0ljb24oYnV0dG9uKSB7XG4gICAgdGhpcy51cGRhdGVJY29uQ29udGVudChidXR0b24pO1xuXG4gICAgd2luZG93Lm1hdGNoTWVkaWEoXCIobWF4LXdpZHRoOiA3NjhweClcIikuYWRkTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVJY29uQ29udGVudChidXR0b24pO1xuICAgIH0pO1xuICAgIHRoaXMuc2V0dXBDbGFzc09ic2VydmVyKGJ1dHRvbik7XG4gIH1cblxuICB1cGRhdGVJY29uQ29udGVudChpY29uQ29udGFpbmVyKSB7XG4gICAgaWYgKGlzTW9iaWxlVmlldygpKSB7XG4gICAgICBpY29uQ29udGFpbmVyLmlubmVySFRNTCA9IHJlY3RhbmdsZXNTVkc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGljb25Db250YWluZXIuaW5uZXJIVE1MID0gdGFsa0ljb25TVkc7XG4gICAgfVxuICB9XG5cbiAgc2V0dXBDbGFzc09ic2VydmVyKGJ1dHRvbikge1xuICAgIGNvbnN0IHRhcmdldE5vZGUgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7IC8vIFRoZSA8aHRtbD4gZWxlbWVudFxuXG4gICAgY29uc3QgY29uZmlnID0geyBhdHRyaWJ1dGVzOiB0cnVlLCBhdHRyaWJ1dGVGaWx0ZXI6IFtcImNsYXNzXCJdIH07XG5cbiAgICBjb25zdCBjYWxsYmFjayA9IChtdXRhdGlvbnNMaXN0LCBvYnNlcnZlcikgPT4ge1xuICAgICAgZm9yIChsZXQgbXV0YXRpb24gb2YgbXV0YXRpb25zTGlzdCkge1xuICAgICAgICBpZiAobXV0YXRpb24udHlwZSA9PT0gXCJhdHRyaWJ1dGVzXCIpIHtcbiAgICAgICAgICBpZiAobXV0YXRpb24uYXR0cmlidXRlTmFtZSA9PT0gXCJjbGFzc1wiKSB7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhcIm1vYmlsZS12aWV3XCIpKSB7XG4gICAgICAgICAgICAgIC8vICdtb2JpbGUtdmlldycgY2xhc3Mgd2FzIGFkZGVkXG4gICAgICAgICAgICAgIHRoaXMudXBkYXRlSWNvbkNvbnRlbnQoYnV0dG9uKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vICdtb2JpbGUtdmlldycgY2xhc3Mgd2FzIHJlbW92ZWRcbiAgICAgICAgICAgICAgdGhpcy51cGRhdGVJY29uQ29udGVudChidXR0b24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGNhbGxiYWNrKTtcblxuICAgIC8vIFN0YXJ0IG9ic2VydmluZyB0aGUgdGFyZ2V0IG5vZGUgZm9yIGNvbmZpZ3VyZWQgbXV0YXRpb25zXG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZSh0YXJnZXROb2RlLCBjb25maWcpO1xuXG4gICAgLy8gTGF0ZXIsIHlvdSBjYW4gc3RvcCBvYnNlcnZpbmcgYnkgY2FsbGluZzpcbiAgICAvLyBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gIH1cblxuICAvLyBTaW11bGF0ZSBhbiBcIkVudGVyXCIga2V5cHJlc3MgZXZlbnQgb24gYSBmb3JtXG4gIHN0YXRpYyBzaW11bGF0ZUZvcm1TdWJtaXQoKSB7XG4gICAgY29uc3QgdGV4dGFyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNheXBpLXByb21wdFwiKTtcblxuICAgIGNvbnN0IGVudGVyRXZlbnQgPSBuZXcgS2V5Ym9hcmRFdmVudChcImtleWRvd25cIiwge1xuICAgICAgYnViYmxlczogdHJ1ZSxcbiAgICAgIGtleTogXCJFbnRlclwiLFxuICAgICAga2V5Q29kZTogMTMsXG4gICAgICB3aGljaDogMTMsXG4gICAgfSk7XG5cbiAgICB0ZXh0YXJlYS5kaXNwYXRjaEV2ZW50KGVudGVyRXZlbnQpO1xuICB9XG5cbiAgLy8gRnVuY3Rpb24gdG8gaGFuZGxlIGF1dG8tc3VibWl0IGJhc2VkIG9uIHRoZSBidXR0b24ncyBkYXRhIGF0dHJpYnV0ZVxuICBzdGF0aWMgaGFuZGxlQXV0b1N1Ym1pdCgpIHtcbiAgICBjb25zdCB0YWxrQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS10YWxrQnV0dG9uXCIpO1xuXG4gICAgaWYgKHRhbGtCdXR0b24uZGF0YXNldC5hdXRvc3VibWl0ID09PSBcImZhbHNlXCIpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiQXV0b3N1Ym1pdCBpcyBkaXNhYmxlZFwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgQnV0dG9uTW9kdWxlLnNpbXVsYXRlRm9ybVN1Ym1pdCgpO1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZUV4aXRCdXR0b24oKSB7XG4gICAgY29uc3QgbGFiZWwgPSBcIkV4aXQgVm9pY2UtQ29udHJvbGxlZCBNb2JpbGUgTW9kZVwiO1xuICAgIGNvbnN0IGJ1dHRvbiA9IHRoaXMuY3JlYXRlQnV0dG9uKFwiXCIsICgpID0+IHtcbiAgICAgIGV4aXRNb2JpbGVNb2RlKCk7XG4gICAgfSk7XG4gICAgYnV0dG9uLmlkID0gXCJzYXlwaS1leGl0QnV0dG9uXCI7XG4gICAgYnV0dG9uLnR5cGUgPSBcImJ1dHRvblwiO1xuICAgIGJ1dHRvbi5jbGFzc05hbWUgPVxuICAgICAgXCJleGl0LWJ1dHRvbiBmaXhlZCByb3VuZGVkLWZ1bGwgYmctY3JlYW0tNTUwIGVuYWJsZWQ6aG92ZXI6YmctY3JlYW0tNjUwXCI7XG4gICAgYnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgbGFiZWwpO1xuICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiLCBsYWJlbCk7XG4gICAgYnV0dG9uLmlubmVySFRNTCA9IGV4aXRJY29uU1ZHO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgICByZXR1cm4gYnV0dG9uO1xuICB9XG5cbiAgY3JlYXRlUGxheUJ1dHRvbigpIHtcbiAgICBjb25zdCBsYWJlbCA9IFwiSGVhciBQaSdzIHJlc3BvbnNlXCI7XG4gICAgdGhpcy5wbGF5QnV0dG9uID0gdGhpcy5jcmVhdGVCdXR0b24oXCJcIiwgKCkgPT4ge30pO1xuICAgIHRoaXMucGxheUJ1dHRvbi5pZCA9IFwic2F5cGktcGxheUJ1dHRvblwiO1xuICAgIHRoaXMucGxheUJ1dHRvbi50eXBlID0gXCJidXR0b25cIjtcbiAgICB0aGlzLnBsYXlCdXR0b24uY2xhc3NOYW1lID0gXCJoaWRkZW4gcGxheS1idXR0b25cIjtcbiAgICB0aGlzLnBsYXlCdXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBsYWJlbCk7XG4gICAgdGhpcy5wbGF5QnV0dG9uLnNldEF0dHJpYnV0ZShcInRpdGxlXCIsIGxhYmVsKTtcbiAgICB0aGlzLnBsYXlCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuaGFuZGxlUGxheUJ1dHRvbkNsaWNrKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMucGxheUJ1dHRvbik7XG4gICAgcmV0dXJuIHRoaXMucGxheUJ1dHRvbjtcbiAgfVxuXG4gIHNob3dQbGF5QnV0dG9uKCkge1xuICAgIGlmICghdGhpcy5wbGF5QnV0dG9uKSB7XG4gICAgICB0aGlzLmNyZWF0ZVBsYXlCdXR0b24oKTtcbiAgICB9XG4gICAgdGhpcy5wbGF5QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gIH1cblxuICBoaWRlUGxheUJ1dHRvbigpIHtcbiAgICBpZiAodGhpcy5wbGF5QnV0dG9uKSB7XG4gICAgICB0aGlzLnBsYXlCdXR0b24uY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVQbGF5QnV0dG9uQ2xpY2soKSB7XG4gICAgdGhpcy51bnBva2VVc2VyKCk7XG4gICAgZGlzcGF0Y2hDdXN0b21FdmVudChcInNheXBpOnJlY2VpdmVkVXNlcklucHV0XCIpOyAvLyBkb3VibGluZyB1cCB3aXRoIHByZXZpb3VzIGxpbmU/XG4gICAgcGlBdWRpb01hbmFnZXIudXNlclBsYXkoKTtcbiAgfVxuXG4gIHBva2VVc2VyKCkge1xuICAgIEFuaW1hdGlvbk1vZHVsZS5hbmltYXRlKFwicmVhZHlUb1Jlc3BvbmRcIik7XG4gICAgdGhpcy5zaG93UGxheUJ1dHRvbigpO1xuICB9XG5cbiAgdW5wb2tlVXNlcigpIHtcbiAgICBBbmltYXRpb25Nb2R1bGUuaW5hbmltYXRlKFwicmVhZHlUb1Jlc3BvbmRcIik7XG4gICAgdGhpcy5oaWRlUGxheUJ1dHRvbigpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBpc1NhZmFyaSwgaXNNb2JpbGVWaWV3IH0gZnJvbSBcIi4vVXNlckFnZW50TW9kdWxlLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50TW9kdWxlIHtcbiAgc3RhdGljIGNvbnRleHQgPSB3aW5kb3c7XG4gIHN0YXRpYyBpbml0KCkge1xuICAgIC8vIEFsbCB0aGUgZXZlbnQgbGlzdGVuZXJzIGNhbiBiZSBhZGRlZCBoZXJlXG4gICAgdGhpcy5oYW5kbGVBdWRpb0V2ZW50cygpO1xuICAgIC8vIEFueSBvdGhlciBpbml0aWFsaXphdGlvbnMuLi5cbiAgfVxuXG4gIHN0YXRpYyBjbGVhbnVwKCkge1xuICAgIC8vIFJlbW92ZSBldmVudCBsaXN0ZW5lcnMgaWYgbmVlZGVkLCBvciBhbnkgb3RoZXIgY2xlYW51cCBvcGVyYXRpb25zXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICBcInNheXBpOnRyYW5zY3JpYmVkXCIsXG4gICAgICB0aGlzLmhhbmRsZVRyYW5zY3JpcHRpb25SZXNwb25zZVxuICAgICk7XG4gIH1cblxuICAvLyBEaXNwYXRjaCBDdXN0b20gRXZlbnRcbiAgLy8gVE9ETzogcmVtb3ZlIGR1cGxpY2F0ZWQgZnVuY3Rpb24gZnJvbSB0cmFuc2NyaWJlci5qc1xuICBzdGF0aWMgZGlzcGF0Y2hDdXN0b21FdmVudChldmVudE5hbWUsIGRldGFpbCA9IHt9KSB7XG4gICAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCB7IGRldGFpbCB9KTtcbiAgICBjb25zb2xlLmxvZyhcImRpc3BhdGNoaW5nIGV2ZW50OiBcIiArIGV2ZW50TmFtZSk7XG4gICAgd2luZG93LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICB9XG5cbiAgc3RhdGljIGhhbmRsZUF1ZGlvRXZlbnRzKCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJzYXlwaTp0cmFuc2NyaWJlZFwiLFxuICAgICAgRXZlbnRNb2R1bGUuaGFuZGxlVHJhbnNjcmlwdGlvblJlc3BvbnNlXG4gICAgKTtcbiAgfVxuXG4gIHN0YXRpYyBoYW5kbGVUcmFuc2NyaXB0aW9uUmVzcG9uc2UodHJhbnNjcmlwdGlvbkV2ZW50KSB7XG4gICAgbGV0IHRyYW5zY3JpcHQgPSB0cmFuc2NyaXB0aW9uRXZlbnQuZGV0YWlsLnRleHQ7XG4gICAgY29uc29sZS5sb2coXCJUcmFuc2NyaXB0OiBcIiArIHRyYW5zY3JpcHQpO1xuICAgIGNvbnN0IHRleHRhcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS1wcm9tcHRcIik7XG4gICAgaWYgKGlzTW9iaWxlVmlldygpKSB7XG4gICAgICAvLyBpZiB0cmFuc2NyaXB0IGlzID4gMTAwMCBjaGFyYWN0ZXJzLCB0cnVuY2F0ZSBpdCB0byA5OTkgY2hhcmFjdGVycyBwbHVzIGFuIGVsbGlwc2lzXG4gICAgICBpZiAodHJhbnNjcmlwdC5sZW5ndGggPiAxMDAwKSB7XG4gICAgICAgIHRyYW5zY3JpcHQgPSB0cmFuc2NyaXB0LnN1YnN0cmluZygwLCA5OTkpICsgXCLigKZcIjtcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgIFwiVHJhbnNjcmlwdCB3YXMgdG9vIGxvbmcgZm9yIFBpLiBUcnVuY2F0ZWQgdG8gOTk5IGNoYXJhY3RlcnMsIGxvc2luZyB0aGUgZm9sbG93aW5nIHRleHQ6IC4uLiBcIiArXG4gICAgICAgICAgICB0cmFuc2NyaXB0LnN1YnN0cmluZyg5OTkpXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBFdmVudE1vZHVsZS5zZXROYXRpdmVWYWx1ZSh0ZXh0YXJlYSwgdHJhbnNjcmlwdCk7XG4gICAgICBFdmVudE1vZHVsZS5kaXNwYXRjaEN1c3RvbUV2ZW50KFwic2F5cGk6YXV0b1N1Ym1pdFwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgRXZlbnRNb2R1bGUuc2ltdWxhdGVUeXBpbmcodGV4dGFyZWEsIHRyYW5zY3JpcHQgKyBcIiBcIik7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHNpbXVsYXRlVHlwaW5nKGVsZW1lbnQsIHRleHQpIHtcbiAgICBjb25zdCB3b3JkcyA9IHRleHQuc3BsaXQoXCIgXCIpO1xuICAgIGxldCBpID0gMDtcblxuICAgIGNvbnN0IHR5cGVXb3JkID0gKCkgPT4ge1xuICAgICAgaWYgKGkgPCB3b3Jkcy5sZW5ndGgpIHtcbiAgICAgICAgRXZlbnRNb2R1bGUuc2V0TmF0aXZlVmFsdWUoZWxlbWVudCwgZWxlbWVudC52YWx1ZSArIHdvcmRzW2krK10gKyBcIiBcIik7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0eXBlV29yZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBFdmVudE1vZHVsZS5kaXNwYXRjaEN1c3RvbUV2ZW50KFwic2F5cGk6YXV0b1N1Ym1pdFwiKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdHlwZVdvcmQoKTtcbiAgfVxuXG4gIHN0YXRpYyBzZXROYXRpdmVWYWx1ZShlbGVtZW50LCB2YWx1ZSkge1xuICAgIGxldCBsYXN0VmFsdWUgPSBlbGVtZW50LnZhbHVlO1xuICAgIGVsZW1lbnQudmFsdWUgPSB2YWx1ZTtcbiAgICBsZXQgZXZlbnQgPSBuZXcgRXZlbnQoXCJpbnB1dFwiLCB7IHRhcmdldDogZWxlbWVudCwgYnViYmxlczogdHJ1ZSB9KTtcbiAgICAvLyBSZWFjdCAxNVxuICAgIGV2ZW50LnNpbXVsYXRlZCA9IHRydWU7XG4gICAgLy8gUmVhY3QgMTYtMTdcbiAgICBsZXQgdHJhY2tlciA9IGVsZW1lbnQuX3ZhbHVlVHJhY2tlcjtcbiAgICBpZiAodHJhY2tlcikge1xuICAgICAgdHJhY2tlci5zZXRWYWx1ZShsYXN0VmFsdWUpO1xuICAgIH1cbiAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICB9XG5cbiAgc3RhdGljIGhhbmRsZVRhbGtNb3VzZURvd24oKSB7XG4gICAgZGlzcGF0Y2hDdXN0b21FdmVudChcImF1ZGlvOnN0YXJ0UmVjb3JkaW5nXCIpO1xuICB9XG5cbiAgc3RhdGljIGhhbmRsZVRhbGtNb3VzZVVwKCkge1xuICAgIGRpc3BhdGNoQ3VzdG9tRXZlbnQoXCJhdWRpbzpzdG9wUmVjb3JkaW5nXCIpO1xuICB9XG5cbiAgc3RhdGljIGhhbmRsZVRhbGtEb3VibGVDbGljayhidXR0b24pIHtcbiAgICAvLyBUb2dnbGUgdGhlIENTUyBjbGFzc2VzIHRvIGluZGljYXRlIHRoZSBtb2RlXG4gICAgYnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoXCJhdXRvU3VibWl0XCIpO1xuICAgIGlmIChidXR0b24uZ2V0QXR0cmlidXRlKFwiZGF0YS1hdXRvc3VibWl0XCIpID09PSBcInRydWVcIikge1xuICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZShcImRhdGEtYXV0b3N1Ym1pdFwiLCBcImZhbHNlXCIpO1xuICAgICAgY29uc29sZS5sb2coXCJhdXRvc3VibWl0IGRpc2FibGVkXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBidXR0b24uc2V0QXR0cmlidXRlKFwiZGF0YS1hdXRvc3VibWl0XCIsIFwidHJ1ZVwiKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiYXV0b3N1Ym1pdCBlbmFibGVkXCIpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBoYW5kbGVUYWxrVG91Y2hTdGFydChidXR0b24sIGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5kaXNwYXRjaEN1c3RvbUV2ZW50KFwiYXVkaW86c3RhcnRSZWNvcmRpbmdcIik7XG4gIH1cblxuICBzdGF0aWMgaGFuZGxlVGFsa1RvdWNoRW5kKGJ1dHRvbikge1xuICAgIHRoaXMuZGlzcGF0Y2hDdXN0b21FdmVudChcImF1ZGlvOnN0b3BSZWNvcmRpbmdcIik7XG4gIH1cblxuICBzdGF0aWMgc2V0Q29udGV4dChjdHgpIHtcbiAgICB0aGlzLmNvbnRleHQgPSBjdHg7XG4gIH1cblxuICBzdGF0aWMgcmVnaXN0ZXJPdGhlckF1ZGlvQnV0dG9uRXZlbnRzKGJ1dHRvbikge1xuICAgIC8vIFwid2FybSB1cFwiIHRoZSBtaWNyb3Bob25lIGJ5IGFjcXVpcmluZyBpdCBiZWZvcmUgdGhlIHVzZXIgcHJlc3NlcyB0aGUgYnV0dG9uXG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWVudGVyXCIsICgpID0+IHtcbiAgICAgIEV2ZW50TW9kdWxlLmRpc3BhdGNoQ3VzdG9tRXZlbnQoXCJhdWRpbzpzZXR1cFJlY29yZGluZ1wiKTtcbiAgICB9KTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgKCkgPT4ge1xuICAgICAgRXZlbnRNb2R1bGUuZGlzcGF0Y2hDdXN0b21FdmVudChcImF1ZGlvOnRlYXJEb3duUmVjb3JkaW5nXCIpO1xuICAgIH0pO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiYmVmb3JldW5sb2FkXCIsICgpID0+IHtcbiAgICAgIEV2ZW50TW9kdWxlLmRpc3BhdGNoQ3VzdG9tRXZlbnQoXCJhdWRpbzp0ZWFyRG93blJlY29yZGluZ1wiKTtcbiAgICB9KTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoY2FuY2VsXCIsICgpID0+IHtcbiAgICAgIEV2ZW50TW9kdWxlLmRpc3BhdGNoQ3VzdG9tRXZlbnQoXCJhdWRpbzp0ZWFyRG93blJlY29yZGluZ1wiKTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyByZWdpc3RlckN1c3RvbUF1ZGlvRXZlbnRMaXN0ZW5lcnMoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzYXlwaTpwaVJlYWR5VG9SZXNwb25kXCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBpZiAoaXNTYWZhcmkoKSkge1xuICAgICAgICBFdmVudE1vZHVsZS5kaXNwYXRjaEN1c3RvbUV2ZW50KFwic2F5cGk6YXdhaXRpbmdVc2VySW5wdXRcIik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImF1ZGlvOmxvYWRpbmdcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgIC8vIEhhbmRsZSB0aGUgcGlTcGVha2luZyBldmVudCwgZS5nLiwgc3RhcnQgYW4gYW5pbWF0aW9uIG9yIHNob3cgYSBVSSBlbGVtZW50LlxuICAgICAgaWYgKGlzU2FmYXJpKCkpIHtcbiAgICAgICAgRXZlbnRNb2R1bGUuZGlzcGF0Y2hDdXN0b21FdmVudChcInNheXBpOnJlY2VpdmVkVXNlcklucHV0XCIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyogZXZlbnRzIHRvIGRpcmVjdCB0aGUgYXVkaW8gbW9kdWxlIHRvIHN0YXJ0L3N0b3AgcmVjb3JkaW5nICovXG5cbiAgc3RhdGljIHJlZ2lzdGVySG90a2V5KCkge1xuICAgIGxldCBjdHJsRG93biA9IGZhbHNlO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQuY3RybEtleSAmJiBldmVudC5jb2RlID09PSBcIlNwYWNlXCIgJiYgIWN0cmxEb3duKSB7XG4gICAgICAgIGN0cmxEb3duID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5kaXNwYXRjaEN1c3RvbUV2ZW50KFwiYXVkaW86c3RhcnRSZWNvcmRpbmdcIik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoY3RybERvd24gJiYgZXZlbnQuY29kZSA9PT0gXCJTcGFjZVwiKSB7XG4gICAgICAgIGN0cmxEb3duID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2hDdXN0b21FdmVudChcImF1ZGlvOnN0b3BSZWNvcmRpbmdcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiIsImxldCB1c2VyUHJlZmVyZW5jZTsgLy8gdHJhbnNpZW50IHZhcmlhYmxlIHRvIHN0b3JlIHVzZXIgcHJlZmVyZW5jZSB1bnRpbCByZWZyZXNoXG5cbmV4cG9ydCBmdW5jdGlvbiBpc01vYmlsZVZpZXcoKSB7XG4gIGlmICh1c2VyUHJlZmVyZW5jZSkge1xuICAgIHJldHVybiB1c2VyUHJlZmVyZW5jZSA9PT0gXCJtb2JpbGVcIjtcbiAgfVxuXG4gIHJldHVybiB3aW5kb3cubWF0Y2hNZWRpYShcIihtYXgtd2lkdGg6IDc2OHB4KVwiKS5tYXRjaGVzO1xufVxuXG4vLyBUT0RPOiBkZWR1cGUgdGhpcyBmdW5jdGlvbiBmcm9tIHRyYW5zY3JpYmVyLmpzXG5leHBvcnQgZnVuY3Rpb24gaXNTYWZhcmkoKSB7XG4gIHJldHVybiAvXigoPyFjaHJvbWV8YW5kcm9pZCkuKSpzYWZhcmkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGV4aXRNb2JpbGVNb2RlKCkge1xuICB1c2VyUHJlZmVyZW5jZSA9IFwiZGVza3RvcFwiOyAvLyBvciAnbW9iaWxlJ1xuXG4gIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcIm1vYmlsZS12aWV3XCIpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGFkZFVzZXJBZ2VudEZsYWdzKCkge1xuICB2YXIgaXNGaXJlZm94QW5kcm9pZCA9XG4gICAgL0ZpcmVmb3gvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgJiYgL0FuZHJvaWQvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gIGlmIChpc0ZpcmVmb3hBbmRyb2lkKSB7XG4gICAgLy8gaGFjayBmb3IgRmlyZWZveCBvbiBBbmRyb2lkLCB3aGljaCBkb2Vzbid0IHN1cHBvcnQgOmFjdGl2ZSBjb3JyZWN0bHlcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJmaXJlZm94LWFuZHJvaWRcIik7XG4gIH1cblxuICBpZiAoaXNNb2JpbGVWaWV3KCkpIHtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJtb2JpbGUtdmlld1wiKTtcbiAgfSBlbHNlIHtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJtb2JpbGUtdmlld1wiKTtcbiAgfVxufVxuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYEBrZXlmcmFtZXMgcHVsc2Vfb3V0ZXJtb3N0IHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTIpO1xuICB9XG59XG4ub3V0ZXJtb3N0IHtcbiAgYW5pbWF0aW9uOiBwdWxzZV9vdXRlcm1vc3QgNXMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBwdWxzZV9zZWNvbmQge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44NTYpO1xuICB9XG59XG4uc2Vjb25kIHtcbiAgYW5pbWF0aW9uOiBwdWxzZV9zZWNvbmQgNXMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBwdWxzZV90aGlyZCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjc5Mik7XG4gIH1cbn1cbi50aGlyZCB7XG4gIGFuaW1hdGlvbjogcHVsc2VfdGhpcmQgNXMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBwdWxzZV9mb3VydGgge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43MjgpO1xuICB9XG59XG4uZm91cnRoIHtcbiAgYW5pbWF0aW9uOiBwdWxzZV9mb3VydGggNXMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBwdWxzZV9maWZ0aCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjY2NCk7XG4gIH1cbn1cbi5maWZ0aCB7XG4gIGFuaW1hdGlvbjogcHVsc2VfZmlmdGggNXMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBwdWxzZV9pbm5lcm1vc3Qge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC42KTtcbiAgfVxufVxuLmlubmVybW9zdCB7XG4gIGFuaW1hdGlvbjogcHVsc2VfaW5uZXJtb3N0IDVzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbi8qIGJvdW5jZSBhbmltYXRpb24gdG8gaW5kaWNhdGUgUGkgaXMgd2FpdGluZyB0byBzcGVhayAqL1xuQGtleWZyYW1lcyBib3VuY2Vfb3V0ZXJtb3N0IHtcbiAgMCUsXG4gIDIwJSxcbiAgNTAlLFxuICA4MCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcbiAgfVxuICA0MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNSUpO1xuICB9XG4gIDYwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0zJSk7XG4gIH1cbn1cbi5vdXRlcm1vc3QucmVhZHlUb1Jlc3BvbmQge1xuICBhbmltYXRpb24tbmFtZTogYm91bmNlX291dGVybW9zdDtcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcbiAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGU7XG59XG5cbkBrZXlmcmFtZXMgYm91bmNlX3NlY29uZCB7XG4gIDAlLFxuICAyMCUsXG4gIDUwJSxcbiAgODAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gIH1cbiAgNDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUuOCUpO1xuICB9XG4gIDYwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0zLjQ4JSk7XG4gIH1cbn1cbi5zZWNvbmQucmVhZHlUb1Jlc3BvbmQge1xuICBhbmltYXRpb24tbmFtZTogYm91bmNlX3NlY29uZDtcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcbiAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGU7XG59XG5cbkBrZXlmcmFtZXMgYm91bmNlX3RoaXJkIHtcbiAgMCUsXG4gIDIwJSxcbiAgNTAlLFxuICA4MCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcbiAgfVxuICA0MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNi42JSk7XG4gIH1cbiAgNjAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTMuOTYlKTtcbiAgfVxufVxuLnRoaXJkLnJlYWR5VG9SZXNwb25kIHtcbiAgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZV90aGlyZDtcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcbiAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGU7XG59XG5cbkBrZXlmcmFtZXMgYm91bmNlX2ZvdXJ0aCB7XG4gIDAlLFxuICAyMCUsXG4gIDUwJSxcbiAgODAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gIH1cbiAgNDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTcuNCUpO1xuICB9XG4gIDYwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC00LjQ0JSk7XG4gIH1cbn1cbi5mb3VydGgucmVhZHlUb1Jlc3BvbmQge1xuICBhbmltYXRpb24tbmFtZTogYm91bmNlX2ZvdXJ0aDtcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcbiAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGU7XG59XG5cbkBrZXlmcmFtZXMgYm91bmNlX2ZpZnRoIHtcbiAgMCUsXG4gIDIwJSxcbiAgNTAlLFxuICA4MCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcbiAgfVxuICA0MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtOC4yJSk7XG4gIH1cbiAgNjAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTQuOTIlKTtcbiAgfVxufVxuLmZpZnRoLnJlYWR5VG9SZXNwb25kIHtcbiAgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZV9maWZ0aDtcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcbiAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGU7XG59XG5cbkBrZXlmcmFtZXMgYm91bmNlX2lubmVybW9zdCB7XG4gIDAlLFxuICAyMCUsXG4gIDUwJSxcbiAgODAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gIH1cbiAgNDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTklKTtcbiAgfVxuICA2MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNS40JSk7XG4gIH1cbn1cbi5pbm5lcm1vc3QucmVhZHlUb1Jlc3BvbmQge1xuICBhbmltYXRpb24tbmFtZTogYm91bmNlX2lubmVybW9zdDtcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcbiAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGU7XG59XG5cbi8qIHBsYXlmdWwgYW5pbWF0aW9uIHRvIGluZGljYXRlIFBpIGlzIHNwZWFraW5nICovXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX291dGVybW9zdCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpIHJvdGF0ZSgwZGVnKTtcbiAgfVxuICAyNSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45OTUpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkpO1xuICB9XG4gIDc1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjg5NSk7XG4gIH1cbn1cbi5vdXRlcm1vc3QucGlTcGVha2luZyB7XG4gIGFuaW1hdGlvbjogc3BlYWtpbmdfb3V0ZXJtb3N0IDJzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbkBrZXlmcmFtZXMgc3BlYWtpbmdfc2Vjb25kIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSkgcm90YXRlKDBkZWcpO1xuICB9XG4gIDI1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjk4KSByb3RhdGUoLTFkZWcpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjg3KSByb3RhdGUoMGRlZyk7XG4gIH1cbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODY1KSByb3RhdGUoMWRlZyk7XG4gIH1cbn1cbi5zZWNvbmQucGlTcGVha2luZyB7XG4gIGFuaW1hdGlvbjogc3BlYWtpbmdfc2Vjb25kIDJzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbkBrZXlmcmFtZXMgc3BlYWtpbmdfdGhpcmQge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKSByb3RhdGUoMGRlZyk7XG4gIH1cbiAgMjUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTY1KSByb3RhdGUoLTJkZWcpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjg0KSByb3RhdGUoMGRlZyk7XG4gIH1cbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODM1KSByb3RhdGUoMmRlZyk7XG4gIH1cbn1cbi50aGlyZC5waVNwZWFraW5nIHtcbiAgYW5pbWF0aW9uOiBzcGVha2luZ190aGlyZCAycyBpbmZpbml0ZTtcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xufVxuXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX2ZvdXJ0aCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpIHJvdGF0ZSgwZGVnKTtcbiAgfVxuICAyNSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45NSkgcm90YXRlKC0zZGVnKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44MSkgcm90YXRlKDBkZWcpO1xuICB9XG4gIDc1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjgwNSkgcm90YXRlKDNkZWcpO1xuICB9XG59XG4uZm91cnRoLnBpU3BlYWtpbmcge1xuICBhbmltYXRpb246IHNwZWFraW5nX2ZvdXJ0aCAycyBpbmZpbml0ZTtcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xufVxuXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX2ZpZnRoIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSkgcm90YXRlKDBkZWcpO1xuICB9XG4gIDI1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkzNSkgcm90YXRlKC00ZGVnKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43OCkgcm90YXRlKDBkZWcpO1xuICB9XG4gIDc1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjc3NSkgcm90YXRlKDRkZWcpO1xuICB9XG59XG4uZmlmdGgucGlTcGVha2luZyB7XG4gIGFuaW1hdGlvbjogc3BlYWtpbmdfZmlmdGggMnMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBzcGVha2luZ19pbm5lcm1vc3Qge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKSByb3RhdGUoMGRlZyk7XG4gIH1cbiAgMjUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTIpIHJvdGF0ZSgtNWRlZyk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNzUpIHJvdGF0ZSgwZGVnKTtcbiAgfVxuICA3NSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43NDUpIHJvdGF0ZSg1ZGVnKTtcbiAgfVxufVxuLmlubmVybW9zdC5waVNwZWFraW5nIHtcbiAgYW5pbWF0aW9uOiBzcGVha2luZ19pbm5lcm1vc3QgMnMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuLyogd2F2ZSBhbmltYXRpb24gdG8gaW5kaWNhdGUgdXNlciBpcyBzcGVha2luZyAqL1xuQGtleWZyYW1lcyB1c2VyU3BlYWtpbmdBbmltYXRpb24ge1xuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuMDUpIHNjYWxlWCh2YXIoLS13aWR0aC1mYWN0b3IpKVxuICAgICAgdHJhbnNsYXRlWChjYWxjKC01MCUgKyB2YXIoLS1zcHJlYWQtYW1vdW50KSkpO1xuICB9XG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDEpIHNjYWxlWCh2YXIoLS13aWR0aC1mYWN0b3IpKVxuICAgICAgdHJhbnNsYXRlWChjYWxjKC01MCUgKyB2YXIoLS1zcHJlYWQtYW1vdW50KSkpO1xuICB9XG59XG4vKiB1c2VyIHNwZWFraW5nIG9zY2lsbGF0aW9uIGFuaW1hdGlvbiAqL1xuQGtleWZyYW1lcyB3YXZlZm9ybV9vdXRlcm1vc3Qge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMSkgc2NhbGVYKDEpO1xuICB9XG4gIDI1JSxcbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjkpIHNjYWxlWCgwLjkpO1xuICB9XG59XG5cbkBrZXlmcmFtZXMgd2F2ZWZvcm1fc2Vjb25kIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuOSkgc2NhbGVYKDAuOSk7XG4gIH1cbiAgMjUlLFxuICA3NSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuOCkgc2NhbGVYKDAuOCk7XG4gIH1cbn1cblxuQGtleWZyYW1lcyB3YXZlZm9ybV90aGlyZCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjgpIHNjYWxlWCgwLjgpO1xuICB9XG4gIDI1JSxcbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjcpIHNjYWxlWCgwLjcpO1xuICB9XG59XG5cbkBrZXlmcmFtZXMgd2F2ZWZvcm1fZm91cnRoIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuNykgc2NhbGVYKDAuNyk7XG4gIH1cbiAgMjUlLFxuICA3NSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuNikgc2NhbGVYKDAuNik7XG4gIH1cbn1cblxuQGtleWZyYW1lcyB3YXZlZm9ybV9maWZ0aCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjYpIHNjYWxlWCgwLjYpO1xuICB9XG4gIDI1JSxcbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjUpIHNjYWxlWCgwLjUpO1xuICB9XG59XG5cbkBrZXlmcmFtZXMgd2F2ZWZvcm1faW5uZXJtb3N0IHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuNSkgc2NhbGVYKDAuNSk7XG4gIH1cbiAgMjUlLFxuICA3NSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuNCkgc2NhbGVYKDAuNCk7XG4gIH1cbn1cblxuLm91dGVybW9zdC51c2VyU3BlYWtpbmcge1xuICBhbmltYXRpb246IHdhdmVmb3JtX291dGVybW9zdCAwLjdzIGluZmluaXRlIGFsdGVybmF0ZTtcbn1cblxuLnNlY29uZC51c2VyU3BlYWtpbmcge1xuICBhbmltYXRpb246IHdhdmVmb3JtX3NlY29uZCAwLjY1cyBpbmZpbml0ZSBhbHRlcm5hdGU7XG59XG5cbi50aGlyZC51c2VyU3BlYWtpbmcge1xuICBhbmltYXRpb246IHdhdmVmb3JtX3RoaXJkIDAuNnMgaW5maW5pdGUgYWx0ZXJuYXRlO1xufVxuXG4uZm91cnRoLnVzZXJTcGVha2luZyB7XG4gIGFuaW1hdGlvbjogd2F2ZWZvcm1fZm91cnRoIDAuNTVzIGluZmluaXRlIGFsdGVybmF0ZTtcbn1cblxuLmZpZnRoLnVzZXJTcGVha2luZyB7XG4gIGFuaW1hdGlvbjogd2F2ZWZvcm1fZmlmdGggMC41cyBpbmZpbml0ZSBhbHRlcm5hdGU7XG59XG5cbi5pbm5lcm1vc3QudXNlclNwZWFraW5nIHtcbiAgYW5pbWF0aW9uOiB3YXZlZm9ybV9pbm5lcm1vc3QgMC40NXMgaW5maW5pdGUgYWx0ZXJuYXRlO1xufVxuXG4vKiBmbGlwY2FyZCBhbmltYXRpb24gdG8gaW5kaWNhdGUgU2F5LCBQaSBpcyB0cmFuc2NyaWJpbmcgYXVkaW8gdG8gdGV4dCAqL1xuQGtleWZyYW1lcyB0cmFuc2NyaWJpbmdGbGlwIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogcm90YXRlWSgwZGVnKTtcbiAgICBmaWxsOiB2YXIoLS1vcmlnaW5hbC1jb2xvcik7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZVkoMTgwZGVnKTtcbiAgICBmaWxsOiB2YXIoLS10cmFuc2NyaWJpbmctY29sb3IpO1xuICB9XG59XG5cbi5vdXRlcm1vc3QudHJhbnNjcmliaW5nIHtcbiAgLS1vcmlnaW5hbC1jb2xvcjogI2U0ZjJkMTtcbiAgLS10cmFuc2NyaWJpbmctY29sb3I6ICNiM2UwZmU7XG4gIGFuaW1hdGlvbjogdHJhbnNjcmliaW5nRmxpcCAxLjVzIGluZmluaXRlO1xufVxuXG4uc2Vjb25kLnRyYW5zY3JpYmluZyB7XG4gIC0tb3JpZ2luYWwtY29sb3I6ICNjY2U4YjU7XG4gIC0tdHJhbnNjcmliaW5nLWNvbG9yOiAjODljMmZmO1xuICBhbmltYXRpb246IHRyYW5zY3JpYmluZ0ZsaXAgMS42cyBpbmZpbml0ZTtcbn1cblxuLnRoaXJkLnRyYW5zY3JpYmluZyB7XG4gIC0tb3JpZ2luYWwtY29sb3I6ICNiM2RiOTU7XG4gIC0tdHJhbnNjcmliaW5nLWNvbG9yOiAjNWZhNGZmO1xuICBhbmltYXRpb246IHRyYW5zY3JpYmluZ0ZsaXAgMS43cyBpbmZpbml0ZTtcbn1cblxuLmZvdXJ0aC50cmFuc2NyaWJpbmcge1xuICAtLW9yaWdpbmFsLWNvbG9yOiAjOWJkMDc4O1xuICAtLXRyYW5zY3JpYmluZy1jb2xvcjogIzM1ODZmZjtcbiAgYW5pbWF0aW9uOiB0cmFuc2NyaWJpbmdGbGlwIDEuOHMgaW5maW5pdGU7XG59XG5cbi5maWZ0aC50cmFuc2NyaWJpbmcge1xuICAtLW9yaWdpbmFsLWNvbG9yOiAjODNjNTVjO1xuICAtLXRyYW5zY3JpYmluZy1jb2xvcjogIzBiNjllMztcbiAgYW5pbWF0aW9uOiB0cmFuc2NyaWJpbmdGbGlwIDEuOXMgaW5maW5pdGU7XG59XG5cbi5pbm5lcm1vc3QudHJhbnNjcmliaW5nIHtcbiAgLS1vcmlnaW5hbC1jb2xvcjogIzQyOGEyZjtcbiAgLS10cmFuc2NyaWJpbmctY29sb3I6ICMwMDUzYmY7XG4gIGFuaW1hdGlvbjogdHJhbnNjcmliaW5nRmxpcCAycyBpbmZpbml0ZTtcbn1cblxuLyogaGVhcnRiZWF0IGFuaW1hdGlvbiB0byBpbmRpY2F0ZSBQaSBpcyBwcmVwYXJpbmcgdG8gc3BlYWsgKi9cbkBrZXlmcmFtZXMgaGVhcnRiZWF0IHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIG9wYWNpdHk6IDE7XG4gIH1cbiAgNTAlIHtcbiAgICBvcGFjaXR5OiAwLjU7XG4gIH1cbn1cblxuLmxvYWRpbmcgLm91dGVybW9zdCB7XG4gIGFuaW1hdGlvbjogaGVhcnRiZWF0IDJzIGluZmluaXRlO1xuICBhbmltYXRpb24tZGVsYXk6IDBzO1xufVxuXG4ubG9hZGluZyAuc2Vjb25kIHtcbiAgYW5pbWF0aW9uOiBoZWFydGJlYXQgMnMgaW5maW5pdGU7XG4gIGFuaW1hdGlvbi1kZWxheTogMC40cztcbn1cblxuLmxvYWRpbmcgLnRoaXJkIHtcbiAgYW5pbWF0aW9uOiBoZWFydGJlYXQgMnMgaW5maW5pdGU7XG4gIGFuaW1hdGlvbi1kZWxheTogMC44cztcbn1cblxuLmxvYWRpbmcgLmZvdXJ0aCB7XG4gIGFuaW1hdGlvbjogaGVhcnRiZWF0IDJzIGluZmluaXRlO1xuICBhbmltYXRpb24tZGVsYXk6IDEuMnM7XG59XG5cbi5sb2FkaW5nIC5maWZ0aCB7XG4gIGFuaW1hdGlvbjogaGVhcnRiZWF0IDJzIGluZmluaXRlO1xuICBhbmltYXRpb24tZGVsYXk6IDEuNnM7XG59XG5cbi5sb2FkaW5nIC5pbm5lcm1vc3Qge1xuICBhbmltYXRpb246IGhlYXJ0YmVhdCAycyBpbmZpbml0ZTtcbiAgYW5pbWF0aW9uLWRlbGF5OiAycztcbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3JlY3RhbmdsZXMuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0U7O0lBRUUsbUJBQW1CO0VBQ3JCO0VBQ0E7SUFDRSxzQkFBc0I7RUFDeEI7QUFDRjtBQUNBO0VBQ0Usc0NBQXNDO0VBQ3RDLHdCQUF3QjtBQUMxQjs7QUFFQTtFQUNFOztJQUVFLG1CQUFtQjtFQUNyQjtFQUNBO0lBQ0UsdUJBQXVCO0VBQ3pCO0FBQ0Y7QUFDQTtFQUNFLG1DQUFtQztFQUNuQyx3QkFBd0I7QUFDMUI7O0FBRUE7RUFDRTs7SUFFRSxtQkFBbUI7RUFDckI7RUFDQTtJQUNFLHVCQUF1QjtFQUN6QjtBQUNGO0FBQ0E7RUFDRSxrQ0FBa0M7RUFDbEMsd0JBQXdCO0FBQzFCOztBQUVBO0VBQ0U7O0lBRUUsbUJBQW1CO0VBQ3JCO0VBQ0E7SUFDRSx1QkFBdUI7RUFDekI7QUFDRjtBQUNBO0VBQ0UsbUNBQW1DO0VBQ25DLHdC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LHlCQUF5QjtFQUN6Qiw2QkFBNkI7RUFDN0IseUNBQXlDO0FBQzNDOztBQUVBO0VBQ0UseUJBQXlCO0VBQ3pCLDZCQUE2QjtFQUM3Qix5Q0FBeUM7QUFDM0M7O0FBRUE7RUFDRSx5QkFBeUI7RUFDekIsNkJBQTZCO0VBQzdCLHVDQUF1QztBQUN6Qzs7QUFFQSw2REFBNkQ7QUFDN0Q7RUFDRTs7SUFFRSxVQUFVO0VBQ1o7RUFDQTtJQUNFLFlBQVk7RUFDZDtBQUNGOztBQUVBO0VBQ0UsZ0NBQWdDO0VBQ2hDLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLGdDQUFnQztFQUNoQyxxQkFBcUI7QUFDdkI7O0FBRUE7RUFDRSxnQ0FBZ0M7RUFDaEMscUJBQXFCO0FBQ3ZCOztBQUVBO0VBQ0UsZ0NBQWdDO0VBQ2hDLHFCQUFxQjtBQUN2Qjs7QUFFQTtFQUNFLGdDQUFnQztFQUNoQyxxQkFBcUI7QUFDdkI7O0FBRUE7RUFDRSxnQ0FBZ0M7RUFDaEMsbUJBQW1CO0FBQ3JCXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIkBrZXlmcmFtZXMgcHVsc2Vfb3V0ZXJtb3N0IHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTIpO1xcbiAgfVxcbn1cXG4ub3V0ZXJtb3N0IHtcXG4gIGFuaW1hdGlvbjogcHVsc2Vfb3V0ZXJtb3N0IDVzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHB1bHNlX3NlY29uZCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjg1Nik7XFxuICB9XFxufVxcbi5zZWNvbmQge1xcbiAgYW5pbWF0aW9uOiBwdWxzZV9zZWNvbmQgNXMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbkBrZXlmcmFtZXMgcHVsc2VfdGhpcmQge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43OTIpO1xcbiAgfVxcbn1cXG4udGhpcmQge1xcbiAgYW5pbWF0aW9uOiBwdWxzZV90aGlyZCA1cyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuQGtleWZyYW1lcyBwdWxzZV9mb3VydGgge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43MjgpO1xcbiAgfVxcbn1cXG4uZm91cnRoIHtcXG4gIGFuaW1hdGlvbjogcHVsc2VfZm91cnRoIDVzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHB1bHNlX2ZpZnRoIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNjY0KTtcXG4gIH1cXG59XFxuLmZpZnRoIHtcXG4gIGFuaW1hdGlvbjogcHVsc2VfZmlmdGggNXMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbkBrZXlmcmFtZXMgcHVsc2VfaW5uZXJtb3N0IHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNik7XFxuICB9XFxufVxcbi5pbm5lcm1vc3Qge1xcbiAgYW5pbWF0aW9uOiBwdWxzZV9pbm5lcm1vc3QgNXMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbi8qIGJvdW5jZSBhbmltYXRpb24gdG8gaW5kaWNhdGUgUGkgaXMgd2FpdGluZyB0byBzcGVhayAqL1xcbkBrZXlmcmFtZXMgYm91bmNlX291dGVybW9zdCB7XFxuICAwJSxcXG4gIDIwJSxcXG4gIDUwJSxcXG4gIDgwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XFxuICB9XFxuICA0MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUlKTtcXG4gIH1cXG4gIDYwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMyUpO1xcbiAgfVxcbn1cXG4ub3V0ZXJtb3N0LnJlYWR5VG9SZXNwb25kIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2Vfb3V0ZXJtb3N0O1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcXG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIGJvdW5jZV9zZWNvbmQge1xcbiAgMCUsXFxuICAyMCUsXFxuICA1MCUsXFxuICA4MCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xcbiAgfVxcbiAgNDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01LjglKTtcXG4gIH1cXG4gIDYwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMy40OCUpO1xcbiAgfVxcbn1cXG4uc2Vjb25kLnJlYWR5VG9SZXNwb25kIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2Vfc2Vjb25kO1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcXG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIGJvdW5jZV90aGlyZCB7XFxuICAwJSxcXG4gIDIwJSxcXG4gIDUwJSxcXG4gIDgwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XFxuICB9XFxuICA0MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTYuNiUpO1xcbiAgfVxcbiAgNjAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0zLjk2JSk7XFxuICB9XFxufVxcbi50aGlyZC5yZWFkeVRvUmVzcG9uZCB7XFxuICBhbmltYXRpb24tbmFtZTogYm91bmNlX3RoaXJkO1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcXG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIGJvdW5jZV9mb3VydGgge1xcbiAgMCUsXFxuICAyMCUsXFxuICA1MCUsXFxuICA4MCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xcbiAgfVxcbiAgNDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC03LjQlKTtcXG4gIH1cXG4gIDYwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNC40NCUpO1xcbiAgfVxcbn1cXG4uZm91cnRoLnJlYWR5VG9SZXNwb25kIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2VfZm91cnRoO1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcXG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIGJvdW5jZV9maWZ0aCB7XFxuICAwJSxcXG4gIDIwJSxcXG4gIDUwJSxcXG4gIDgwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XFxuICB9XFxuICA0MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTguMiUpO1xcbiAgfVxcbiAgNjAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC00LjkyJSk7XFxuICB9XFxufVxcbi5maWZ0aC5yZWFkeVRvUmVzcG9uZCB7XFxuICBhbmltYXRpb24tbmFtZTogYm91bmNlX2ZpZnRoO1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcXG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIGJvdW5jZV9pbm5lcm1vc3Qge1xcbiAgMCUsXFxuICAyMCUsXFxuICA1MCUsXFxuICA4MCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xcbiAgfVxcbiAgNDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC05JSk7XFxuICB9XFxuICA2MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUuNCUpO1xcbiAgfVxcbn1cXG4uaW5uZXJtb3N0LnJlYWR5VG9SZXNwb25kIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2VfaW5uZXJtb3N0O1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcXG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xcbn1cXG5cXG4vKiBwbGF5ZnVsIGFuaW1hdGlvbiB0byBpbmRpY2F0ZSBQaSBpcyBzcGVha2luZyAqL1xcbkBrZXlmcmFtZXMgc3BlYWtpbmdfb3V0ZXJtb3N0IHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSkgcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgMjUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjk5NSk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOSk7XFxuICB9XFxuICA3NSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODk1KTtcXG4gIH1cXG59XFxuLm91dGVybW9zdC5waVNwZWFraW5nIHtcXG4gIGFuaW1hdGlvbjogc3BlYWtpbmdfb3V0ZXJtb3N0IDJzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX3NlY29uZCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpIHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDI1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45OCkgcm90YXRlKC0xZGVnKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44Nykgcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgNzUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjg2NSkgcm90YXRlKDFkZWcpO1xcbiAgfVxcbn1cXG4uc2Vjb25kLnBpU3BlYWtpbmcge1xcbiAgYW5pbWF0aW9uOiBzcGVha2luZ19zZWNvbmQgMnMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbkBrZXlmcmFtZXMgc3BlYWtpbmdfdGhpcmQge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKSByb3RhdGUoMGRlZyk7XFxuICB9XFxuICAyNSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTY1KSByb3RhdGUoLTJkZWcpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjg0KSByb3RhdGUoMGRlZyk7XFxuICB9XFxuICA3NSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODM1KSByb3RhdGUoMmRlZyk7XFxuICB9XFxufVxcbi50aGlyZC5waVNwZWFraW5nIHtcXG4gIGFuaW1hdGlvbjogc3BlYWtpbmdfdGhpcmQgMnMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbkBrZXlmcmFtZXMgc3BlYWtpbmdfZm91cnRoIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSkgcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgMjUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjk1KSByb3RhdGUoLTNkZWcpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjgxKSByb3RhdGUoMGRlZyk7XFxuICB9XFxuICA3NSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODA1KSByb3RhdGUoM2RlZyk7XFxuICB9XFxufVxcbi5mb3VydGgucGlTcGVha2luZyB7XFxuICBhbmltYXRpb246IHNwZWFraW5nX2ZvdXJ0aCAycyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuQGtleWZyYW1lcyBzcGVha2luZ19maWZ0aCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpIHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDI1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45MzUpIHJvdGF0ZSgtNGRlZyk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNzgpIHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43NzUpIHJvdGF0ZSg0ZGVnKTtcXG4gIH1cXG59XFxuLmZpZnRoLnBpU3BlYWtpbmcge1xcbiAgYW5pbWF0aW9uOiBzcGVha2luZ19maWZ0aCAycyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuQGtleWZyYW1lcyBzcGVha2luZ19pbm5lcm1vc3Qge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKSByb3RhdGUoMGRlZyk7XFxuICB9XFxuICAyNSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTIpIHJvdGF0ZSgtNWRlZyk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNzUpIHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43NDUpIHJvdGF0ZSg1ZGVnKTtcXG4gIH1cXG59XFxuLmlubmVybW9zdC5waVNwZWFraW5nIHtcXG4gIGFuaW1hdGlvbjogc3BlYWtpbmdfaW5uZXJtb3N0IDJzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG4vKiB3YXZlIGFuaW1hdGlvbiB0byBpbmRpY2F0ZSB1c2VyIGlzIHNwZWFraW5nICovXFxuQGtleWZyYW1lcyB1c2VyU3BlYWtpbmdBbmltYXRpb24ge1xcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC4wNSkgc2NhbGVYKHZhcigtLXdpZHRoLWZhY3RvcikpXFxuICAgICAgdHJhbnNsYXRlWChjYWxjKC01MCUgKyB2YXIoLS1zcHJlYWQtYW1vdW50KSkpO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDEpIHNjYWxlWCh2YXIoLS13aWR0aC1mYWN0b3IpKVxcbiAgICAgIHRyYW5zbGF0ZVgoY2FsYygtNTAlICsgdmFyKC0tc3ByZWFkLWFtb3VudCkpKTtcXG4gIH1cXG59XFxuLyogdXNlciBzcGVha2luZyBvc2NpbGxhdGlvbiBhbmltYXRpb24gKi9cXG5Aa2V5ZnJhbWVzIHdhdmVmb3JtX291dGVybW9zdCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgxKSBzY2FsZVgoMSk7XFxuICB9XFxuICAyNSUsXFxuICA3NSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjkpIHNjYWxlWCgwLjkpO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIHdhdmVmb3JtX3NlY29uZCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjkpIHNjYWxlWCgwLjkpO1xcbiAgfVxcbiAgMjUlLFxcbiAgNzUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC44KSBzY2FsZVgoMC44KTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyB3YXZlZm9ybV90aGlyZCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjgpIHNjYWxlWCgwLjgpO1xcbiAgfVxcbiAgMjUlLFxcbiAgNzUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC43KSBzY2FsZVgoMC43KTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyB3YXZlZm9ybV9mb3VydGgge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC43KSBzY2FsZVgoMC43KTtcXG4gIH1cXG4gIDI1JSxcXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuNikgc2NhbGVYKDAuNik7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgd2F2ZWZvcm1fZmlmdGgge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC42KSBzY2FsZVgoMC42KTtcXG4gIH1cXG4gIDI1JSxcXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuNSkgc2NhbGVYKDAuNSk7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgd2F2ZWZvcm1faW5uZXJtb3N0IHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuNSkgc2NhbGVYKDAuNSk7XFxuICB9XFxuICAyNSUsXFxuICA3NSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjQpIHNjYWxlWCgwLjQpO1xcbiAgfVxcbn1cXG5cXG4ub3V0ZXJtb3N0LnVzZXJTcGVha2luZyB7XFxuICBhbmltYXRpb246IHdhdmVmb3JtX291dGVybW9zdCAwLjdzIGluZmluaXRlIGFsdGVybmF0ZTtcXG59XFxuXFxuLnNlY29uZC51c2VyU3BlYWtpbmcge1xcbiAgYW5pbWF0aW9uOiB3YXZlZm9ybV9zZWNvbmQgMC42NXMgaW5maW5pdGUgYWx0ZXJuYXRlO1xcbn1cXG5cXG4udGhpcmQudXNlclNwZWFraW5nIHtcXG4gIGFuaW1hdGlvbjogd2F2ZWZvcm1fdGhpcmQgMC42cyBpbmZpbml0ZSBhbHRlcm5hdGU7XFxufVxcblxcbi5mb3VydGgudXNlclNwZWFraW5nIHtcXG4gIGFuaW1hdGlvbjogd2F2ZWZvcm1fZm91cnRoIDAuNTVzIGluZmluaXRlIGFsdGVybmF0ZTtcXG59XFxuXFxuLmZpZnRoLnVzZXJTcGVha2luZyB7XFxuICBhbmltYXRpb246IHdhdmVmb3JtX2ZpZnRoIDAuNXMgaW5maW5pdGUgYWx0ZXJuYXRlO1xcbn1cXG5cXG4uaW5uZXJtb3N0LnVzZXJTcGVha2luZyB7XFxuICBhbmltYXRpb246IHdhdmVmb3JtX2lubmVybW9zdCAwLjQ1cyBpbmZpbml0ZSBhbHRlcm5hdGU7XFxufVxcblxcbi8qIGZsaXBjYXJkIGFuaW1hdGlvbiB0byBpbmRpY2F0ZSBTYXksIFBpIGlzIHRyYW5zY3JpYmluZyBhdWRpbyB0byB0ZXh0ICovXFxuQGtleWZyYW1lcyB0cmFuc2NyaWJpbmdGbGlwIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogcm90YXRlWSgwZGVnKTtcXG4gICAgZmlsbDogdmFyKC0tb3JpZ2luYWwtY29sb3IpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiByb3RhdGVZKDE4MGRlZyk7XFxuICAgIGZpbGw6IHZhcigtLXRyYW5zY3JpYmluZy1jb2xvcik7XFxuICB9XFxufVxcblxcbi5vdXRlcm1vc3QudHJhbnNjcmliaW5nIHtcXG4gIC0tb3JpZ2luYWwtY29sb3I6ICNlNGYyZDE7XFxuICAtLXRyYW5zY3JpYmluZy1jb2xvcjogI2IzZTBmZTtcXG4gIGFuaW1hdGlvbjogdHJhbnNjcmliaW5nRmxpcCAxLjVzIGluZmluaXRlO1xcbn1cXG5cXG4uc2Vjb25kLnRyYW5zY3JpYmluZyB7XFxuICAtLW9yaWdpbmFsLWNvbG9yOiAjY2NlOGI1O1xcbiAgLS10cmFuc2NyaWJpbmctY29sb3I6ICM4OWMyZmY7XFxuICBhbmltYXRpb246IHRyYW5zY3JpYmluZ0ZsaXAgMS42cyBpbmZpbml0ZTtcXG59XFxuXFxuLnRoaXJkLnRyYW5zY3JpYmluZyB7XFxuICAtLW9yaWdpbmFsLWNvbG9yOiAjYjNkYjk1O1xcbiAgLS10cmFuc2NyaWJpbmctY29sb3I6ICM1ZmE0ZmY7XFxuICBhbmltYXRpb246IHRyYW5zY3JpYmluZ0ZsaXAgMS43cyBpbmZpbml0ZTtcXG59XFxuXFxuLmZvdXJ0aC50cmFuc2NyaWJpbmcge1xcbiAgLS1vcmlnaW5hbC1jb2xvcjogIzliZDA3ODtcXG4gIC0tdHJhbnNjcmliaW5nLWNvbG9yOiAjMzU4NmZmO1xcbiAgYW5pbWF0aW9uOiB0cmFuc2NyaWJpbmdGbGlwIDEuOHMgaW5maW5pdGU7XFxufVxcblxcbi5maWZ0aC50cmFuc2NyaWJpbmcge1xcbiAgLS1vcmlnaW5hbC1jb2xvcjogIzgzYzU1YztcXG4gIC0tdHJhbnNjcmliaW5nLWNvbG9yOiAjMGI2OWUzO1xcbiAgYW5pbWF0aW9uOiB0cmFuc2NyaWJpbmdGbGlwIDEuOXMgaW5maW5pdGU7XFxufVxcblxcbi5pbm5lcm1vc3QudHJhbnNjcmliaW5nIHtcXG4gIC0tb3JpZ2luYWwtY29sb3I6ICM0MjhhMmY7XFxuICAtLXRyYW5zY3JpYmluZy1jb2xvcjogIzAwNTNiZjtcXG4gIGFuaW1hdGlvbjogdHJhbnNjcmliaW5nRmxpcCAycyBpbmZpbml0ZTtcXG59XFxuXFxuLyogaGVhcnRiZWF0IGFuaW1hdGlvbiB0byBpbmRpY2F0ZSBQaSBpcyBwcmVwYXJpbmcgdG8gc3BlYWsgKi9cXG5Aa2V5ZnJhbWVzIGhlYXJ0YmVhdCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICBvcGFjaXR5OiAxO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgb3BhY2l0eTogMC41O1xcbiAgfVxcbn1cXG5cXG4ubG9hZGluZyAub3V0ZXJtb3N0IHtcXG4gIGFuaW1hdGlvbjogaGVhcnRiZWF0IDJzIGluZmluaXRlO1xcbiAgYW5pbWF0aW9uLWRlbGF5OiAwcztcXG59XFxuXFxuLmxvYWRpbmcgLnNlY29uZCB7XFxuICBhbmltYXRpb246IGhlYXJ0YmVhdCAycyBpbmZpbml0ZTtcXG4gIGFuaW1hdGlvbi1kZWxheTogMC40cztcXG59XFxuXFxuLmxvYWRpbmcgLnRoaXJkIHtcXG4gIGFuaW1hdGlvbjogaGVhcnRiZWF0IDJzIGluZmluaXRlO1xcbiAgYW5pbWF0aW9uLWRlbGF5OiAwLjhzO1xcbn1cXG5cXG4ubG9hZGluZyAuZm91cnRoIHtcXG4gIGFuaW1hdGlvbjogaGVhcnRiZWF0IDJzIGluZmluaXRlO1xcbiAgYW5pbWF0aW9uLWRlbGF5OiAxLjJzO1xcbn1cXG5cXG4ubG9hZGluZyAuZmlmdGgge1xcbiAgYW5pbWF0aW9uOiBoZWFydGJlYXQgMnMgaW5maW5pdGU7XFxuICBhbmltYXRpb24tZGVsYXk6IDEuNnM7XFxufVxcblxcbi5sb2FkaW5nIC5pbm5lcm1vc3Qge1xcbiAgYW5pbWF0aW9uOiBoZWFydGJlYXQgMnMgaW5maW5pdGU7XFxuICBhbmltYXRpb24tZGVsYXk6IDJzO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYEBrZXlmcmFtZXMgcHVsc2Uge1xuICAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45KTtcbiAgfVxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICB9XG59XG4jc2F5cGktdGFsa0J1dHRvbixcbi5wbGF5LWJ1dHRvbiB7XG4gIG1hcmdpbi10b3A6IDAuMjVyZW07XG4gIGJvcmRlci1yYWRpdXM6IDE4cHg7XG4gIHdpZHRoOiAxMjBweDtcbiAgZGlzcGxheTogYmxvY2s7IC8qIEZvciBTYWZhcmkgKi9cbn1cblxuaHRtbDpub3QoLmZpcmVmb3gtYW5kcm9pZCkgI3NheXBpLXRhbGtCdXR0b246YWN0aXZlIC53YXZlZm9ybSxcbiNzYXlwaS10YWxrQnV0dG9uLmFjdGl2ZSAud2F2ZWZvcm0ge1xuICBhbmltYXRpb246IHB1bHNlIDFzIGluZmluaXRlO1xufVxuI3NheXBpLXRhbGtCdXR0b24gLndhdmVmb3JtIHtcbiAgZmlsbDogIzc3NmQ2ZDtcbn1cbiNzYXlwaS10YWxrQnV0dG9uLmF1dG9TdWJtaXQgLndhdmVmb3JtIHtcbiAgZmlsbDogcmdiKDY1IDEzOCA0Nyk7IC8qIFBpJ3MgdGV4dC1icmFuZC1ncmVlbi02MDAgKi9cbn1cbi5oaWRkZW4ge1xuICBkaXNwbGF5OiBub25lO1xufVxuI3NheXBpLXBsYXlCdXR0b24ucGxheS1idXR0b24ge1xuICAvKiBwb3NpdGlvbiBvdmVyIHRoZSB0YWxrIGJ1dHRvbiwgYnV0IHVuZGVyIGFueSBjb250cm9scyAqL1xuICB6LWluZGV4OiA3MDsgLyogdGFsayBidXR0b24gei1pbmRleCBpcyA1OSBvciA2MCAqL1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDApOyAvKiB0cmFuc3BhcmVudCB3aXRob3V0IGhvbGVzICovXG4gIGJvcmRlcjogbm9uZTtcbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3RhbGtCdXR0b24uY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0U7SUFDRSxtQkFBbUI7RUFDckI7RUFDQTtJQUNFLHFCQUFxQjtFQUN2QjtFQUNBO0lBQ0UsbUJBQW1CO0VBQ3JCO0FBQ0Y7QUFDQTs7RUFFRSxtQkFBbUI7RUFDbkIsbUJBQW1CO0VBQ25CLFlBQVk7RUFDWixjQUFjLEVBQUUsZUFBZTtBQUNqQzs7QUFFQTs7RUFFRSw0QkFBNEI7QUFDOUI7QUFDQTtFQUNFLGFBQWE7QUFDZjtBQUNBO0VBQ0Usb0JBQW9CLEVBQUUsOEJBQThCO0FBQ3REO0FBQ0E7RUFDRSxhQUFhO0FBQ2Y7QUFDQTtFQUNFLDBEQUEwRDtFQUMxRCxXQUFXLEVBQUUsb0NBQW9DO0VBQ2pELGtDQUFrQyxFQUFFLDhCQUE4QjtFQUNsRSxZQUFZO0FBQ2RcIixcInNvdXJjZXNDb250ZW50XCI6W1wiQGtleWZyYW1lcyBwdWxzZSB7XFxuICAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOSk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gIH1cXG59XFxuI3NheXBpLXRhbGtCdXR0b24sXFxuLnBsYXktYnV0dG9uIHtcXG4gIG1hcmdpbi10b3A6IDAuMjVyZW07XFxuICBib3JkZXItcmFkaXVzOiAxOHB4O1xcbiAgd2lkdGg6IDEyMHB4O1xcbiAgZGlzcGxheTogYmxvY2s7IC8qIEZvciBTYWZhcmkgKi9cXG59XFxuXFxuaHRtbDpub3QoLmZpcmVmb3gtYW5kcm9pZCkgI3NheXBpLXRhbGtCdXR0b246YWN0aXZlIC53YXZlZm9ybSxcXG4jc2F5cGktdGFsa0J1dHRvbi5hY3RpdmUgLndhdmVmb3JtIHtcXG4gIGFuaW1hdGlvbjogcHVsc2UgMXMgaW5maW5pdGU7XFxufVxcbiNzYXlwaS10YWxrQnV0dG9uIC53YXZlZm9ybSB7XFxuICBmaWxsOiAjNzc2ZDZkO1xcbn1cXG4jc2F5cGktdGFsa0J1dHRvbi5hdXRvU3VibWl0IC53YXZlZm9ybSB7XFxuICBmaWxsOiByZ2IoNjUgMTM4IDQ3KTsgLyogUGkncyB0ZXh0LWJyYW5kLWdyZWVuLTYwMCAqL1xcbn1cXG4uaGlkZGVuIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcbiNzYXlwaS1wbGF5QnV0dG9uLnBsYXktYnV0dG9uIHtcXG4gIC8qIHBvc2l0aW9uIG92ZXIgdGhlIHRhbGsgYnV0dG9uLCBidXQgdW5kZXIgYW55IGNvbnRyb2xzICovXFxuICB6LWluZGV4OiA3MDsgLyogdGFsayBidXR0b24gei1pbmRleCBpcyA1OSBvciA2MCAqL1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwKTsgLyogdHJhbnNwYXJlbnQgd2l0aG91dCBob2xlcyAqL1xcbiAgYm9yZGVyOiBub25lO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYEBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICBodG1sLm1vYmlsZS12aWV3IHtcbiAgICAvKiBQaSBjb250cm9sczogZXhwZXJpZW5jZXMgKi9cbiAgICAvKiBQaSBjb250cm9sczogbXV0ZS91bm11dGUgKi9cbiAgfVxuICBodG1sLm1vYmlsZS12aWV3ICNzYXlwaS1wYW5lbCxcbiAgaHRtbC5tb2JpbGUtdmlldyAucGxheS1idXR0b24ge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICBsZWZ0OiAwO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjQ1LCAyMzgsIDIyMywgMC45OCk7XG4gICAgaGVpZ2h0OiAxMDB2aDtcbiAgICB0b3A6IDA7XG4gICAgcGFkZGluZzogNSU7XG4gIH1cbiAgaHRtbC5tb2JpbGUtdmlldyAjc2F5cGktdGFsa0J1dHRvbiB7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgaGVpZ2h0OiAxMDAlO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgIGJvcmRlci1yYWRpdXM6IDA7XG4gICAgbWFyZ2luOiAwO1xuICB9XG4gIGh0bWwubW9iaWxlLXZpZXcgI19fbmV4dCA+IG1haW4gPiBkaXYgPiBkaXYgPiBkaXYuZml4ZWQudG9wLTQucmlnaHQtNiA+IGJ1dHRvbixcbiAgaHRtbC5tb2JpbGUtdmlldyBkaXZbZGF0YS1wcm9qZWN0aW9uLWlkPVwiMTJcIl0gPiBidXR0b24ge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMik7XG4gICAgei1pbmRleDogNTA7XG4gIH1cbiAgaHRtbC5tb2JpbGUtdmlldyBidXR0b25bZGF0YS1wcm9qZWN0aW9uLWlkPVwiMTZcIl0gPiBkaXZbZGF0YS1wcm9qZWN0aW9uLWlkPVwiMTdcIl0sXG4gIGh0bWwubW9iaWxlLXZpZXcgYnV0dG9uW2RhdGEtcHJvamVjdGlvbi1pZD1cIjE2XCJdID4gZGl2W2RhdGEtcHJvamVjdGlvbi1pZD1cIjE4XCJdIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDIpICFpbXBvcnRhbnQ7XG4gICAgei1pbmRleDogNTA7XG4gIH1cbiAgaHRtbC5tb2JpbGUtdmlldyAjc2F5cGktZXhpdEJ1dHRvbiB7XG4gICAgcG9zaXRpb246IGZpeGVkO1xuICAgIHRvcDogMTBweDtcbiAgICBsZWZ0OiAxMnB4O1xuICAgIHdpZHRoOiA1MnB4O1xuICAgIGhlaWdodDogNTJweDtcbiAgICBwYWRkaW5nOiA2cHg7XG4gICAgYm9yZGVyOiAwO1xuICAgIHotaW5kZXg6IDYwO1xuICB9XG4gIGh0bWwubW9iaWxlLXZpZXcgI3NheXBpLWZvb3RlciB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxufWAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL21vYmlsZS5zY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0U7SUFxQkUsNkJBQUE7SUFPQSw2QkFBQTtFQXpCRjtFQUZFOztJQUVFLFdBQUE7SUFDQSxlQUFBO0lBQ0EsT0FBQTtJQUNBLDJDQUFBO0lBRUEsYUFBQTtJQUNBLE1BQUE7SUFDQSxXQUFBO0VBR0o7RUFBRTtJQUNFLFdBQUE7SUFDQSxZQUFBO0lBQ0EsNkJBQUE7SUFDQSxnQkFBQTtJQUNBLFNBQUE7RUFFSjtFQUVFOztJQUVFLG1CQUFBO0lBQ0EsV0FBQTtFQUFKO0VBS0k7O0lBRUUsOEJBQUE7SUFDQSxXQUFBO0VBSE47RUFPRTtJQUNFLGVBQUE7SUFDQSxTQUFBO0lBQ0EsVUFBQTtJQUNBLFdBQUE7SUFDQSxZQUFBO0lBQ0EsWUFBQTtJQUNBLFNBQUE7SUFDQSxXQUFBO0VBTEo7RUFRRTtJQUNFLGFBQUE7RUFOSjtBQUNGXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xcbiAgaHRtbC5tb2JpbGUtdmlldyB7XFxuICAgICNzYXlwaS1wYW5lbCxcXG4gICAgLnBsYXktYnV0dG9uIHtcXG4gICAgICB3aWR0aDogMTAwJTtcXG4gICAgICBwb3NpdGlvbjogZml4ZWQ7XFxuICAgICAgbGVmdDogMDtcXG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI0NSwgMjM4LCAyMjMsIDAuOTgpO1xcblxcbiAgICAgIGhlaWdodDogMTAwdmg7XFxuICAgICAgdG9wOiAwO1xcbiAgICAgIHBhZGRpbmc6IDUlO1xcbiAgICB9XFxuXFxuICAgICNzYXlwaS10YWxrQnV0dG9uIHtcXG4gICAgICB3aWR0aDogMTAwJTtcXG4gICAgICBoZWlnaHQ6IDEwMCU7XFxuICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICAgICAgYm9yZGVyLXJhZGl1czogMDtcXG4gICAgICBtYXJnaW46IDA7XFxuICAgIH1cXG5cXG4gICAgLyogUGkgY29udHJvbHM6IGV4cGVyaWVuY2VzICovXFxuICAgICNfX25leHQgPiBtYWluID4gZGl2ID4gZGl2ID4gZGl2LmZpeGVkLnRvcC00LnJpZ2h0LTYgPiBidXR0b24sXFxuICAgIGRpdltkYXRhLXByb2plY3Rpb24taWQ9XFxcIjEyXFxcIl0gPiBidXR0b24ge1xcbiAgICAgIHRyYW5zZm9ybTogc2NhbGUoMik7XFxuICAgICAgei1pbmRleDogNTA7XFxuICAgIH1cXG5cXG4gICAgLyogUGkgY29udHJvbHM6IG11dGUvdW5tdXRlICovXFxuICAgIGJ1dHRvbltkYXRhLXByb2plY3Rpb24taWQ9XFxcIjE2XFxcIl0ge1xcbiAgICAgID4gZGl2W2RhdGEtcHJvamVjdGlvbi1pZD1cXFwiMTdcXFwiXSxcXG4gICAgICA+IGRpdltkYXRhLXByb2plY3Rpb24taWQ9XFxcIjE4XFxcIl0ge1xcbiAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgyKSAhaW1wb3J0YW50O1xcbiAgICAgICAgei1pbmRleDogNTA7XFxuICAgICAgfVxcbiAgICB9XFxuXFxuICAgICNzYXlwaS1leGl0QnV0dG9uIHtcXG4gICAgICBwb3NpdGlvbjogZml4ZWQ7XFxuICAgICAgdG9wOiAxMHB4O1xcbiAgICAgIGxlZnQ6IDEycHg7XFxuICAgICAgd2lkdGg6IDUycHg7XFxuICAgICAgaGVpZ2h0OiA1MnB4O1xcbiAgICAgIHBhZGRpbmc6IDZweDtcXG4gICAgICBib3JkZXI6IDA7XFxuICAgICAgei1pbmRleDogNjA7XFxuICAgIH1cXG5cXG4gICAgI3NheXBpLWZvb3RlciB7XFxuICAgICAgZGlzcGxheTogbm9uZTtcXG4gICAgfVxcbiAgfVxcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsImV4cG9ydCBkZWZhdWx0IFwiLy8gRGlzcGF0Y2ggQ3VzdG9tIEV2ZW50XFxuZnVuY3Rpb24gZGlzcGF0Y2hDdXN0b21FdmVudChldmVudE5hbWUpIHtcXG4gIHZhciBkZXRhaWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xcbiAgdmFyIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwge1xcbiAgICBkZXRhaWw6IGRldGFpbFxcbiAgfSk7XFxuICBjb25zb2xlLmxvZyhcXFwiZGlzcGF0Y2hpbmcgZXZlbnQ6IFxcXCIgKyBldmVudE5hbWUpO1xcbiAgd2luZG93LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xcbn1cXG5cXG4vLyBhdWRpbyBvdXRwdXQgKFBpKVxcbnZhciBhdWRpb0VsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxcXCJhdWRpb1xcXCIpO1xcbmlmICghYXVkaW9FbGVtZW50KSB7XFxuICBjb25zb2xlLmVycm9yKFxcXCJBdWRpbyBlbGVtZW50IG5vdCBmb3VuZCFcXFwiKTtcXG59XFxuXFxuLy8gVE9ETzogZGVkdXBlIHRoaXMgZnVuY3Rpb24gZnJvbSBFdmVudE1vZHVsZS5qc1xcbmZ1bmN0aW9uIGlzU2FmYXJpKCkge1xcbiAgcmV0dXJuIC9eKCg/IWNocm9tZXxhbmRyb2lkKS4pKnNhZmFyaS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XFxufVxcbmF1ZGlvRWxlbWVudC5wcmVsb2FkID0gXFxcImF1dG9cXFwiOyAvLyBlbmFibGUgYWdncmVzc2l2ZSBwcmVsb2FkaW5nIG9mIGF1ZGlvXFxudmFyIHBpQXVkaW9NYW5hZ2VyID0ge1xcbiAgaXNTcGVha2luZzogZmFsc2UsXFxuICBhdWRpb0VsZW1lbnQ6IGF1ZGlvRWxlbWVudCxcXG4gIF91c2VyU3RhcnRlZDogdHJ1ZSxcXG4gIC8vIGZsYWcgdG8gaW5kaWNhdGUgcGxheWJhY2sgaGFzIGJlZW4gc3RhcnRlZCBieSB0aGUgdXNlciAodHJ1ZSBieSBkZWZhdWx0IGJlY2F1c2UgdXNlciBtdXN0IHJlcXVlc3QgaW5pdGlhbCBwbGF5YmFjaylcXG4gIF9pc0xvYWRDYWxsZWQ6IGZhbHNlLFxcbiAgLy8gZmxhZyB0byBpbmRpY2F0ZSBpZiB0aGUgbG9hZCgpIG1ldGhvZCBoYXMgYmVlbiBjYWxsZWQgb24gdGhlIGF1ZGlvIGVsZW1lbnRcXG5cXG4gIGlzTG9hZENhbGxlZDogZnVuY3Rpb24gaXNMb2FkQ2FsbGVkKCkge1xcbiAgICByZXR1cm4gdGhpcy5faXNMb2FkQ2FsbGVkO1xcbiAgfSxcXG4gIHNldElzTG9hZENhbGxlZDogZnVuY3Rpb24gc2V0SXNMb2FkQ2FsbGVkKHZhbHVlKSB7XFxuICAgIHRoaXMuX2lzTG9hZENhbGxlZCA9IHZhbHVlO1xcbiAgfSxcXG4gIHVzZXJQbGF5OiBmdW5jdGlvbiB1c2VyUGxheSgpIHtcXG4gICAgaWYgKCFpc1NhZmFyaSgpKSB7XFxuICAgICAgcmV0dXJuO1xcbiAgICB9XFxuICAgIHRoaXMuX3VzZXJTdGFydGVkID0gdHJ1ZTsgLy8gc2V0IGEgZmxhZyB0byBpbmRpY2F0ZSBwbGF5YmFjayBoYXMgYmVlbiBzdGFydGVkIGJ5IHRoZSB1c2VyXFxuICAgIHRoaXMuYXVkaW9FbGVtZW50LmxvYWQoKTsgLy8gcmVzZXQgZm9yIFNhZmFyaVxcbiAgICBkaXNwYXRjaEN1c3RvbUV2ZW50KFxcXCJhdWRpbzpsb2FkaW5nXFxcIik7XFxuICAgIHRoaXMuYXVkaW9FbGVtZW50LnBsYXkoKTtcXG4gIH0sXFxuICBhdXRvUGxheTogZnVuY3Rpb24gYXV0b1BsYXkoKSB7XFxuICAgIGlmICghdGhpcy5fdXNlclN0YXJ0ZWQpIHtcXG4gICAgICB0aGlzLmF1ZGlvRWxlbWVudC5wYXVzZSgpO1xcbiAgICB9XFxuICB9LFxcbiAgc3RvcDogZnVuY3Rpb24gc3RvcCgpIHtcXG4gICAgaWYgKHRoaXMuaXNTcGVha2luZykge1xcbiAgICAgIHRoaXMuYXVkaW9FbGVtZW50LnBhdXNlKCk7XFxuICAgIH1cXG4gICAgaWYgKHRoaXMuYXVkaW9FbGVtZW50LmR1cmF0aW9uICYmICF0aGlzLmF1ZGlvRWxlbWVudC5lbmRlZCAmJiB0aGlzLmF1ZGlvRWxlbWVudC5jdXJyZW50VGltZSA8IHRoaXMuYXVkaW9FbGVtZW50LmR1cmF0aW9uKSB7XFxuICAgICAgdGhpcy5hdWRpb0VsZW1lbnQuY3VycmVudFRpbWUgPSB0aGlzLmF1ZGlvRWxlbWVudC5kdXJhdGlvbjsgLy8gc2VlayB0aGUgYXVkaW8gdG8gdGhlIGVuZFxcbiAgICAgIHRoaXMuYXVkaW9FbGVtZW50LnBsYXkoKTsgLy8gdHJpZ2dlciB0aGUgZW5kZWQgZXZlbnRcXG4gICAgfVxcbiAgfSxcXG5cXG4gIHBhdXNlOiBmdW5jdGlvbiBwYXVzZSgpIHtcXG4gICAgdGhpcy5hdWRpb0VsZW1lbnQucGF1c2UoKTtcXG4gIH0sXFxuICByZXN1bWU6IGZ1bmN0aW9uIHJlc3VtZSgpIHtcXG4gICAgdGhpcy5hdWRpb0VsZW1lbnQucGxheSgpO1xcbiAgfSxcXG4gIHBsYXlpbmc6IGZ1bmN0aW9uIHBsYXlpbmcoKSB7XFxuICAgIHRoaXMuaXNTcGVha2luZyA9IHRydWU7XFxuICB9LFxcbiAgc3RvcHBlZDogZnVuY3Rpb24gc3RvcHBlZCgpIHtcXG4gICAgdGhpcy5pc1NwZWFraW5nID0gZmFsc2U7XFxuICAgIHRoaXMuX3VzZXJTdGFydGVkID0gZmFsc2U7XFxuICB9XFxufTtcXG5cXG4vLyBJbnRlcmNlcHQgQXV0b3BsYXkgRXZlbnRzIChhdXRvcGxheSBkb2Vzbid0IHdvcmsgb24gU2FmYXJpKVxcbmF1ZGlvRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxcXCJwbGF5XFxcIiwgZnVuY3Rpb24gKCkge1xcbiAgaWYgKGlzU2FmYXJpKCkpIHtcXG4gICAgcGlBdWRpb01hbmFnZXIuYXV0b1BsYXkoKTtcXG4gIH1cXG59KTtcXG5hdWRpb0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcXFwibG9hZHN0YXJ0XFxcIiwgZnVuY3Rpb24gKCkge1xcbiAgaWYgKGlzU2FmYXJpKCkpIHtcXG4gICAgZGlzcGF0Y2hDdXN0b21FdmVudChcXFwic2F5cGk6cGlSZWFkeVRvUmVzcG9uZFxcXCIpO1xcbiAgfVxcbn0pO1xcblxcbi8vIEV2ZW50IGxpc3RlbmVycyBmb3IgZGV0ZWN0aW5nIHdoZW4gUGkgaXMgc3BlYWtpbmdcXG5hdWRpb0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcXFwicGxheWluZ1xcXCIsIGZ1bmN0aW9uICgpIHtcXG4gIHBpQXVkaW9NYW5hZ2VyLnBsYXlpbmcoKTtcXG4gIGRpc3BhdGNoQ3VzdG9tRXZlbnQoXFxcInNheXBpOnBpU3BlYWtpbmdcXFwiKTtcXG59KTtcXG5hdWRpb0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcXFwicGF1c2VcXFwiLCBmdW5jdGlvbiAoKSB7XFxuICBwaUF1ZGlvTWFuYWdlci5zdG9wcGVkKCk7XFxuICBkaXNwYXRjaEN1c3RvbUV2ZW50KFxcXCJzYXlwaTpwaVN0b3BwZWRTcGVha2luZ1xcXCIpO1xcbn0pO1xcbmF1ZGlvRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxcXCJlbmRlZFxcXCIsIGZ1bmN0aW9uICgpIHtcXG4gIHBpQXVkaW9NYW5hZ2VyLnN0b3BwZWQoKTtcXG4gIGRpc3BhdGNoQ3VzdG9tRXZlbnQoXFxcInNheXBpOnBpRmluaXNoZWRTcGVha2luZ1xcXCIpO1xcbn0pO1xcblxcbi8vIGF1ZGlvIGlucHV0ICh1c2VyKVxcbnZhciBhdWRpb0RhdGFDaHVua3MgPSBbXTtcXG52YXIgYXVkaW9NaW1lVHlwZSA9IFxcXCJhdWRpby93ZWJtO2NvZGVjcz1vcHVzXFxcIjtcXG5mdW5jdGlvbiB1cGxvYWRBdWRpbyhhdWRpb0Jsb2IpIHtcXG4gIC8vIENyZWF0ZSBhIEZvcm1EYXRhIG9iamVjdFxcbiAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XFxuICB2YXIgYXVkaW9GaWxlbmFtZSA9IFxcXCJhdWRpby53ZWJtXFxcIjtcXG4gIGlmIChhdWRpb0Jsb2IudHlwZSA9PT0gXFxcImF1ZGlvL21wNFxcXCIpIHtcXG4gICAgYXVkaW9GaWxlbmFtZSA9IFxcXCJhdWRpby5tcDRcXFwiO1xcbiAgfVxcbiAgLy8gQWRkIHRoZSBhdWRpbyBibG9iIHRvIHRoZSBGb3JtRGF0YSBvYmplY3RcXG4gIGZvcm1EYXRhLmFwcGVuZChcXFwiYXVkaW9cXFwiLCBhdWRpb0Jsb2IsIGF1ZGlvRmlsZW5hbWUpO1xcbiAgLy8gR2V0IHRoZSB1c2VyJ3MgcHJlZmVycmVkIGxhbmd1YWdlXFxuICB2YXIgbGFuZ3VhZ2UgPSBuYXZpZ2F0b3IubGFuZ3VhZ2U7XFxuICBkaXNwYXRjaEN1c3RvbUV2ZW50KFxcXCJzYXlwaTp0cmFuc2NyaWJpbmdcXFwiKTtcXG4gIC8vIFBvc3QgdGhlIGF1ZGlvIHRvIHRoZSBzZXJ2ZXIgZm9yIHRyYW5zY3JpcHRpb25cXG4gIGZldGNoKGNvbmZpZy5hcGlTZXJ2ZXJVcmwgKyBcXFwiL3RyYW5zY3JpYmU/bGFuZ3VhZ2U9XFxcIiArIGxhbmd1YWdlLCB7XFxuICAgIG1ldGhvZDogXFxcIlBPU1RcXFwiLFxcbiAgICBib2R5OiBmb3JtRGF0YVxcbiAgfSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcXG4gICAgaWYgKCFyZXNwb25zZS5vaykge1xcbiAgICAgIHRocm93IEVycm9yKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xcbiAgICB9XFxuICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XFxuICB9KS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZUpzb24pIHtcXG4gICAgZGlzcGF0Y2hDdXN0b21FdmVudChcXFwic2F5cGk6dHJhbnNjcmliZWRcXFwiLCB7XFxuICAgICAgdGV4dDogcmVzcG9uc2VKc29uLnRleHRcXG4gICAgfSk7XFxuICB9KVtcXFwiY2F0Y2hcXFwiXShmdW5jdGlvbiAoZXJyb3IpIHtcXG4gICAgY29uc29sZS5lcnJvcihcXFwiTG9va3MgbGlrZSB0aGVyZSB3YXMgYSBwcm9ibGVtOiBcXFwiLCBlcnJvcik7XFxuICAgIHZhciB0ZXh0YXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxcXCJzYXlwaS1wcm9tcHRcXFwiKTtcXG4gICAgdGV4dGFyZWEudmFsdWUgPSBcXFwiU29ycnksIHRoZXJlIHdhcyBhIHByb2JsZW0gdHJhbnNjcmliaW5nIHlvdXIgYXVkaW8uIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuXFxcIjtcXG4gIH0pO1xcbn1cXG5cXG4vLyBEZWNsYXJlIGEgZ2xvYmFsIHZhcmlhYmxlIGZvciB0aGUgbWVkaWFSZWNvcmRlclxcbnZhciBtZWRpYVJlY29yZGVyO1xcbnZhciB0aHJlc2hvbGQgPSAxMDAwOyAvLyAxMDAwIG1zID0gMSBzZWNvbmQsIGFib3V0IHRoZSBsZW5ndGggb2YgXFxcIkhleSwgUGlcXFwiXFxuXFxuLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSAnZGF0YWF2YWlsYWJsZScgZXZlbnQgZmlyZXNcXG5mdW5jdGlvbiBoYW5kbGVEYXRhQXZhaWxhYmxlKGUpIHtcXG4gIC8vIEFkZCB0aGUgYXVkaW8gZGF0YSBjaHVuayB0byB0aGUgYXJyYXlcXG4gIGF1ZGlvRGF0YUNodW5rcy5wdXNoKGUuZGF0YSk7XFxufVxcblxcbi8vIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgJ3N0b3AnIGV2ZW50IGZpcmVzXFxuZnVuY3Rpb24gaGFuZGxlU3RvcCgpIHtcXG4gIC8vIENyZWF0ZSBhIEJsb2IgZnJvbSB0aGUgYXVkaW8gZGF0YSBjaHVua3NcXG4gIHZhciBhdWRpb0Jsb2IgPSBuZXcgQmxvYihhdWRpb0RhdGFDaHVua3MsIHtcXG4gICAgdHlwZTogYXVkaW9NaW1lVHlwZVxcbiAgfSk7XFxuXFxuICAvLyBHZXQgdGhlIHN0b3AgdGltZSBhbmQgY2FsY3VsYXRlIHRoZSBkdXJhdGlvblxcbiAgdmFyIHN0b3BUaW1lID0gRGF0ZS5ub3coKTtcXG4gIHZhciBkdXJhdGlvbiA9IHN0b3BUaW1lIC0gd2luZG93LnN0YXJ0VGltZTtcXG5cXG4gIC8vIElmIHRoZSBkdXJhdGlvbiBpcyBncmVhdGVyIHRoYW4gdGhlIHRocmVzaG9sZCwgdXBsb2FkIHRoZSBhdWRpbyBmb3IgdHJhbnNjcmlwdGlvblxcbiAgaWYgKGR1cmF0aW9uID49IHRocmVzaG9sZCkge1xcbiAgICAvLyBVcGxvYWQgdGhlIGF1ZGlvIHRvIHRoZSBzZXJ2ZXIgZm9yIHRyYW5zY3JpcHRpb25cXG4gICAgdXBsb2FkQXVkaW8oYXVkaW9CbG9iKTtcXG4gIH1cXG5cXG4gIC8vIENsZWFyIHRoZSBhcnJheSBmb3IgdGhlIG5leHQgcmVjb3JkaW5nXFxuICBhdWRpb0RhdGFDaHVua3MgPSBbXTtcXG59XFxuZnVuY3Rpb24gc2V0dXBSZWNvcmRpbmcoY2FsbGJhY2spIHtcXG4gIGlmIChtZWRpYVJlY29yZGVyKSB7XFxuICAgIHJldHVybjtcXG4gIH1cXG5cXG4gIC8vIEdldCBhIHN0cmVhbSBmcm9tIHRoZSB1c2VyJ3MgbWljcm9waG9uZVxcbiAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEoe1xcbiAgICBhdWRpbzogdHJ1ZVxcbiAgfSkudGhlbihmdW5jdGlvbiAoc3RyZWFtKSB7XFxuICAgIGlmICghTWVkaWFSZWNvcmRlci5pc1R5cGVTdXBwb3J0ZWQoYXVkaW9NaW1lVHlwZSkpIHtcXG4gICAgICAvLyB1c2UgTVA0IGZvciBTYWZhcmlcXG4gICAgICBhdWRpb01pbWVUeXBlID0gXFxcImF1ZGlvL21wNFxcXCI7XFxuICAgIH1cXG4gICAgLy8gQ3JlYXRlIGEgbmV3IE1lZGlhUmVjb3JkZXIgb2JqZWN0IHVzaW5nIHRoZSBzdHJlYW0gYW5kIHNwZWNpZnlpbmcgdGhlIE1JTUUgdHlwZVxcbiAgICB2YXIgb3B0aW9ucyA9IHtcXG4gICAgICBtaW1lVHlwZTogYXVkaW9NaW1lVHlwZVxcbiAgICB9O1xcbiAgICBtZWRpYVJlY29yZGVyID0gbmV3IE1lZGlhUmVjb3JkZXIoc3RyZWFtLCBvcHRpb25zKTtcXG5cXG4gICAgLy8gTGlzdGVuIGZvciB0aGUgJ2RhdGFhdmFpbGFibGUnIGV2ZW50XFxuICAgIG1lZGlhUmVjb3JkZXIuYWRkRXZlbnRMaXN0ZW5lcihcXFwiZGF0YWF2YWlsYWJsZVxcXCIsIGhhbmRsZURhdGFBdmFpbGFibGUpO1xcblxcbiAgICAvLyBMaXN0ZW4gZm9yIHRoZSAnc3RvcCcgZXZlbnRcXG4gICAgbWVkaWFSZWNvcmRlci5hZGRFdmVudExpc3RlbmVyKFxcXCJzdG9wXFxcIiwgaGFuZGxlU3RvcCk7XFxuICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcXG4gICAgLy8gSW52b2tlIHRoZSBjYWxsYmFjayBmdW5jdGlvblxcbiAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcXFwiZnVuY3Rpb25cXFwiKSB7XFxuICAgICAgY2FsbGJhY2soKTtcXG4gICAgfVxcbiAgfSlbXFxcImNhdGNoXFxcIl0oZnVuY3Rpb24gKGVycikge1xcbiAgICBjb25zb2xlLmVycm9yKFxcXCJFcnJvciBnZXR0aW5nIGF1ZGlvIHN0cmVhbTogXFxcIiArIGVycik7XFxuICB9KTtcXG59XFxuZnVuY3Rpb24gdGVhckRvd25SZWNvcmRpbmcoKSB7XFxuICAvLyBDaGVjayBpZiB0aGUgTWVkaWFSZWNvcmRlciBpcyBzZXQgdXBcXG4gIGlmICghbWVkaWFSZWNvcmRlcikge1xcbiAgICByZXR1cm47XFxuICB9XFxuXFxuICAvLyBTdG9wIGFueSBvbmdvaW5nIHJlY29yZGluZ1xcbiAgaWYgKG1lZGlhUmVjb3JkZXIuc3RhdGUgPT09IFxcXCJyZWNvcmRpbmdcXFwiKSB7XFxuICAgIG1lZGlhUmVjb3JkZXIuc3RvcCgpO1xcbiAgfVxcblxcbiAgLy8gUmVtb3ZlIHRoZSBNZWRpYVJlY29yZGVyJ3MgZXZlbnQgbGlzdGVuZXJzXFxuICBtZWRpYVJlY29yZGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoXFxcImRhdGFhdmFpbGFibGVcXFwiLCBoYW5kbGVEYXRhQXZhaWxhYmxlKTtcXG4gIG1lZGlhUmVjb3JkZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihcXFwic3RvcFxcXCIsIGhhbmRsZVN0b3ApO1xcblxcbiAgLy8gQ2xlYXIgdGhlIE1lZGlhUmVjb3JkZXIgdmFyaWFibGVcXG4gIG1lZGlhUmVjb3JkZXIgPSBudWxsO1xcbn1cXG5cXG4vLyBUbyByZXF1ZXN0IHJlY29yZGluZywgb3RoZXIgbW9kdWxlcyBjYW4gZGlzcGF0Y2ggYSBjdXN0b20gZXZlbnQgYXVkaW86c3RhcnRSZWNvcmRpbmdcXG5mdW5jdGlvbiBzdGFydFJlY29yZGluZygpIHtcXG4gIC8vIENoZWNrIGlmIHRoZSBNZWRpYVJlY29yZGVyIGlzIHNldCB1cFxcbiAgaWYgKCFtZWRpYVJlY29yZGVyKSB7XFxuICAgIHNldHVwUmVjb3JkaW5nKHN0YXJ0UmVjb3JkaW5nKTtcXG4gICAgcmV0dXJuO1xcbiAgfVxcbiAgLy8gQ2hlY2sgaWYgUGkgaXMgY3VycmVudGx5IHNwZWFraW5nIGFuZCBzdG9wIGhlciBhdWRpb1xcbiAgaWYgKHBpQXVkaW9NYW5hZ2VyLmlzU3BlYWtpbmcpIHtcXG4gICAgcGlBdWRpb01hbmFnZXIucGF1c2UoKTtcXG4gIH1cXG5cXG4gIC8vIFN0YXJ0IHJlY29yZGluZ1xcbiAgbWVkaWFSZWNvcmRlci5zdGFydCgpO1xcblxcbiAgLy8gUmVjb3JkIHRoZSBzdGFydCB0aW1lXFxuICB3aW5kb3cuc3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcXG4gIGRpc3BhdGNoQ3VzdG9tRXZlbnQoXFxcInNheXBpOnVzZXJTcGVha2luZ1xcXCIpO1xcbn1cXG5cXG4vLyBUbyBzdG9wIHJlY29yZGluZywgb3RoZXIgbW9kdWxlcyBjYW4gZGlzcGF0Y2ggYSBjdXN0b20gZXZlbnQgYXVkaW86c3RvcFJlY29yZGluZ1xcbmZ1bmN0aW9uIHN0b3BSZWNvcmRpbmcoKSB7XFxuICBpZiAobWVkaWFSZWNvcmRlciAmJiBtZWRpYVJlY29yZGVyLnN0YXRlID09PSBcXFwicmVjb3JkaW5nXFxcIikge1xcbiAgICAvLyBTdG9wIHJlY29yZGluZ1xcbiAgICBtZWRpYVJlY29yZGVyLnN0b3AoKTtcXG5cXG4gICAgLy8gUmVjb3JkIHRoZSBzdG9wIHRpbWUgYW5kIGNhbGN1bGF0ZSB0aGUgZHVyYXRpb25cXG4gICAgdmFyIHN0b3BUaW1lID0gRGF0ZS5ub3coKTtcXG4gICAgdmFyIGR1cmF0aW9uID0gc3RvcFRpbWUgLSB3aW5kb3cuc3RhcnRUaW1lO1xcblxcbiAgICAvLyBJZiB0aGUgZHVyYXRpb24gaXMgbGVzcyB0aGFuIHRoZSB0aHJlc2hvbGQsIGRvbid0IHVwbG9hZCB0aGUgYXVkaW8gZm9yIHRyYW5zY3JpcHRpb25cXG4gICAgaWYgKGR1cmF0aW9uIDwgdGhyZXNob2xkKSB7XFxuICAgICAgY29uc29sZS5sb2coXFxcIlJlY29yZGluZyB3YXMgdG9vIHNob3J0LCBub3QgdXBsb2FkaW5nIGZvciB0cmFuc2NyaXB0aW9uXFxcIik7XFxuICAgICAgZGlzcGF0Y2hDdXN0b21FdmVudChcXFwic2F5cGk6dXNlclN0b3BwZWRTcGVha2luZ1xcXCIpO1xcbiAgICAgIHBpQXVkaW9NYW5hZ2VyLnJlc3VtZSgpO1xcbiAgICB9IGVsc2Uge1xcbiAgICAgIHBpQXVkaW9NYW5hZ2VyLnN0b3AoKTtcXG4gICAgICBkaXNwYXRjaEN1c3RvbUV2ZW50KFxcXCJzYXlwaTp1c2VyRmluaXNoZWRTcGVha2luZ1xcXCIpO1xcbiAgICB9XFxuICB9XFxufVxcbmZ1bmN0aW9uIHJlZ2lzdGVyQ3VzdG9tQXVkaW9FdmVudExpc3RlbmVycygpIHtcXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxcXCJhdWRpbzpzZXR1cFJlY29yZGluZ1xcXCIsIGZ1bmN0aW9uIChlKSB7XFxuICAgIHNldHVwUmVjb3JkaW5nKCk7XFxuICB9KTtcXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxcXCJhdWRpbzp0ZWFyRG93blJlY29yZGluZ1xcXCIsIGZ1bmN0aW9uIChlKSB7XFxuICAgIHRlYXJEb3duUmVjb3JkaW5nKCk7XFxuICB9KTtcXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxcXCJhdWRpbzpzdGFydFJlY29yZGluZ1xcXCIsIGZ1bmN0aW9uIChlKSB7XFxuICAgIHN0YXJ0UmVjb3JkaW5nKCk7XFxuICB9KTtcXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxcXCJhdWRpbzpzdG9wUmVjb3JkaW5nXFxcIiwgZnVuY3Rpb24gKGUpIHtcXG4gICAgc3RvcFJlY29yZGluZygpO1xcbiAgfSk7XFxufVxcbnJlZ2lzdGVyQ3VzdG9tQXVkaW9FdmVudExpc3RlbmVycygpO1wiOyIsImV4cG9ydCBkZWZhdWx0IFwiPD94bWwgdmVyc2lvbj1cXFwiMS4wXFxcIiBlbmNvZGluZz1cXFwiVVRGLThcXFwiPz5cXG48c3ZnIGlkPVxcXCJMYXllcl8xXFxcIiBkYXRhLW5hbWU9XFxcIkxheWVyIDFcXFwiIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDY0LjA2IDY0LjMzXFxcIj5cXG4gIDxkZWZzPlxcbiAgICA8c3R5bGU+XFxuICAgICAgLmNscy0xIHtcXG4gICAgICAgIGZpbGw6ICMyNDM4MWI7XFxuICAgICAgfVxcblxcbiAgICAgIC5jbHMtMSwgLmNscy0yIHtcXG4gICAgICAgIHN0cm9rZS13aWR0aDogMHB4O1xcbiAgICAgIH1cXG5cXG4gICAgICAuY2xzLTIge1xcbiAgICAgICAgZmlsbDogI2RmZDdjMjtcXG4gICAgICB9XFxuICAgIDwvc3R5bGU+XFxuICA8L2RlZnM+XFxuICA8cGF0aCBjbGFzcz1cXFwiY2xzLTJcXFwiIGQ9XFxcIm0zMS43MSw2NC4zMkMxNC43Nyw2NC40Ni0uNDQsNDkuOTMsMCwzMS4zMy40MSwxNC40NywxNC4yOS0uMzIsMzIuNywwYzE2LjkxLjMsMzEuOCwxNC4zMiwzMS4zNiwzMy4xNC0uMzksMTYuNzYtMTQuNDksMzEuNTUtMzIuMzQsMzEuMThabTEwLjY3LTIzLjE5Yy4wNi0uNy0uNDEtMS4xMi0uODQtMS41NS0yLTItMy45NC00LjA3LTYuMDItNS45Ny0xLjE0LTEuMDQtMS4zMi0xLjY4LS4wNi0yLjgyLDIuMTMtMS45Myw0LjA3LTQuMDgsNi4xLTYuMTIuNzgtLjc5LDEuMzEtMS42NC4zNC0yLjU2LS45Mi0uODctMS43Mi0uMjgtMi40My40NS0yLjE3LDIuMjEtNC4zOSw0LjM5LTYuNTIsNi42NS0uNzIuNzctMS4xNi43LTEuODQtLjAyLTIuMDYtMi4xNy00LjE5LTQuMjgtNi4yOS02LjQxLS43Ni0uNzctMS41OS0xLjY4LTIuNjYtLjYzLTEuMTQsMS4xMi0uMTksMS45OC42MiwyLjc5LDIuMDcsMi4wOSw0LjA5LDQuMjIsNi4yLDYuMjYuNzcuNzUuODIsMS4yLjAyLDEuOTctMi4yMSwyLjEtNC4zMyw0LjMtNi40OSw2LjQ1LS43OS43OC0xLjMsMS42NS0uMzIsMi41Ni45Mi44NSwxLjcxLjI2LDIuNDMtLjQ3LDIuMTEtMi4xMiw0LjI4LTQuMTksNi4zMy02LjM4Ljg4LS45NCwxLjM3LS44NiwyLjIxLjAzLDIuMTMsMi4yNiw0LjM3LDQuNDEsNi41Nyw2LjYuNTEuNTEsMS4wOS43OCwxLjguNDguNTYtLjI0Ljg1LS42OC44Ny0xLjNaXFxcIi8+XFxuICA8cGF0aCBjbGFzcz1cXFwiY2xzLTFcXFwiIGQ9XFxcIm00Mi40Nyw0MS4yN2MtLjAyLjYyLS4zMiwxLjA2LS44NywxLjMtLjcxLjMxLTEuMjkuMDMtMS44LS40OC0yLjItMi4yLTQuNDQtNC4zNS02LjU3LTYuNi0uODQtLjg5LTEuMzMtLjk2LTIuMjEtLjAzLTIuMDQsMi4xOS00LjIyLDQuMjUtNi4zMyw2LjM4LS43Mi43Mi0xLjUxLDEuMzItMi40My40Ny0uOTgtLjkxLS40Ny0xLjc4LjMyLTIuNTYsMi4xNi0yLjE1LDQuMjgtNC4zNSw2LjQ5LTYuNDUuODEtLjc3Ljc2LTEuMjItLjAyLTEuOTctMi4xMS0yLjA0LTQuMTMtNC4xNy02LjItNi4yNi0uOC0uODEtMS43NS0xLjY3LS42Mi0yLjc5LDEuMDctMS4wNSwxLjktLjE0LDIuNjYuNjMsMi4xLDIuMTMsNC4yMyw0LjI0LDYuMjksNi40MS42OS43MywxLjEyLjc5LDEuODQuMDIsMi4xMy0yLjI2LDQuMzUtNC40Myw2LjUyLTYuNjUuNzItLjczLDEuNTEtMS4zMSwyLjQzLS40NS45Ny45Mi40NCwxLjc4LS4zNCwyLjU2LTIuMDMsMi4wNC0zLjk3LDQuMTktNi4xLDYuMTItMS4yNSwxLjE0LTEuMDgsMS43OC4wNiwyLjgyLDIuMDksMS45MSw0LjAyLDMuOTcsNi4wMiw1Ljk3LjQzLjQzLjkuODUuODQsMS41NVpcXFwiLz5cXG48L3N2Zz5cIjsiLCJleHBvcnQgZGVmYXVsdCBcIjw/eG1sIHZlcnNpb249XFxcIjEuMFxcXCIgZW5jb2Rpbmc9XFxcIlVURi04XFxcIj8+XFxuPHN2ZyBpZD1cXFwiTGF5ZXJfMVxcXCIgZGF0YS1uYW1lPVxcXCJMYXllciAxXFxcIiB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAzMDcgNjQwXFxcIj5cXG4gIDxkZWZzPlxcbiAgICA8c3R5bGU+XFxuICAgICAgLmlubmVybW9zdCwgLnNlY29uZCwgLnRoaXJkLCAuZm91cnRoLCAuZmlmdGgsIC5vdXRlcm1vc3Qge1xcbiAgICAgICAgc3Ryb2tlLXdpZHRoOiAwcHg7XFxuICAgICAgfVxcbiAgICAgIFxcbiAgICAgIC5vdXRlcm1vc3Qge1xcbiAgICAgICAgZmlsbDogI2U0ZjJkMTtcXG4gICAgICB9XFxuXFxuICAgICAgLnNlY29uZCB7XFxuICAgICAgICBmaWxsOiAjY2NlOGI1O1xcbiAgICAgIH1cXG5cXG4gICAgICAudGhpcmQge1xcbiAgICAgICAgZmlsbDogI2IzZGI5NTtcXG4gICAgICB9XFxuXFxuICAgICAgLmZvdXJ0aCB7XFxuICAgICAgICBmaWxsOiAjOWJkMDc4O1xcbiAgICAgIH1cXG5cXG4gICAgICAuZmlmdGgge1xcbiAgICAgICAgZmlsbDogIzgzYzU1YztcXG4gICAgICB9XFxuXFxuICAgICAgLmlubmVybW9zdCB7XFxuICAgICAgICBmaWxsOiAjNDI4YTJmO1xcbiAgICAgIH1cXG4gICAgPC9zdHlsZT5cXG4gIDwvZGVmcz5cXG4gIDxwYXRoIGNsYXNzPVxcXCJvdXRlcm1vc3RcXFwiIGQ9XFxcIm0zMDYuOSwzMjBjMCwxMDUuMy0uMDIsMjEwLjYuMSwzMTUuOTEsMCwzLjQyLS42Nyw0LjEtNC4wOSw0LjA5LTk5LjYtLjEyLTE5OS4yMS0uMTItMjk4LjgxLDBDLjY3LDY0MCwwLDYzOS4zMywwLDYzNS45MS4xMSw0MjUuMy4xMSwyMTQuNywwLDQuMDksMCwuNjcuNjcsMCw0LjA5LDAsMTAzLjcuMTIsMjAzLjMuMTIsMzAyLjkxLDBjMy40MiwwLDQuMS42Nyw0LjA5LDQuMDktLjEyLDEwNS4zLS4xLDIxMC42LS4xLDMxNS45MVpcXFwiLz5cXG4gIDxwYXRoIGNsYXNzPVxcXCJzZWNvbmRcXFwiIGQ9XFxcIm0yNzUuOTIsMzIzYzAsODcuNjMsMCwxNzUuMjcsMCwyNjIuOSwwLDcuMjQtLjU1LDcuOTMtNy44Niw3Ljk4LTE0LjY2LjA5LTI5LjMxLjAzLTQzLjk3LjAzLTYwLjk2LDAtMTIxLjkyLDAtMTgyLjg4LDBxLTcuMTMsMC03LjE0LTcuMjRjMC0xNzYuMSwwLTM1Mi4yMSwwLTUyOC4zMXEwLTcuMjYsNy4xMi03LjI2Yzc1Ljc4LDAsMTUxLjU2LDAsMjI3LjM1LDBxNy4zOCwwLDcuMzgsNy41YzAsODguMTMsMCwxNzYuMjcsMCwyNjQuNFpcXFwiLz5cXG4gIDxwYXRoIGNsYXNzPVxcXCJ0aGlyZFxcXCIgZD1cXFwibTY4LjA2LDMyMi4yNGMwLTY5LjQ3LDAtMTM4Ljk0LDAtMjA4LjQxLDAtOC45OSwxLjMzLTEwLjEzLDEwLjQ5LTkuMTIsMS45OC4yMiwzLjk4LjMyLDUuOTcuMzIsNDYuMTMuMDIsOTIuMjYuMDIsMTM4LjM5LDAsMy40OCwwLDYuOTItLjIzLDEwLjQxLS42Nyw1LjUtLjcsOC43NC40Niw4LjczLDcuMjUtLjE4LDEzOC45NC0uMTMsMjc3Ljg4LS4xMyw0MTYuODEsMCwuMzMsMCwuNjcsMCwxcS0uMTQsMTAuNTEtMTAuMzksMTAuNTFjLTUyLjEzLDAtMTA0LjI1LDAtMTU2LjM4LDBxLTcuMDksMC03LjA5LTcuMjhjMC03MC4xNCwwLTE0MC4yNywwLTIxMC40MVpcXFwiLz5cXG4gIDxwYXRoIGNsYXNzPVxcXCJmb3VydGhcXFwiIGQ9XFxcIm0xMDMuMDIsMzIyLjVjMC01Mi40NiwwLTEwNC45MSwwLTE1Ny4zNywwLTYuNjguMzYtNy4wNiw3LjA3LTcuMDYsMzAuMy0uMDEsNjAuNi4wNyw5MC45LS4wOSw0LjU0LS4wMiw2LjA4LDEuMzMsNi4wNyw1Ljk4LS4xLDEwNS41OC0uMSwyMTEuMTYsMCwzMTYuNzQsMCw0LjE4LTEuMjcsNS4zNy01LjM4LDUuMzUtMjkuMy0uMTUtNTguNi0uMDgtODcuOS0uMDhxLTEwLjc2LDAtMTAuNzYtMTEuMDljMC01MC43OSwwLTEwMS41OCwwLTE1Mi4zN1pcXFwiLz5cXG4gIDxwYXRoIGNsYXNzPVxcXCJmaWZ0aFxcXCIgZD1cXFwibTE3MywzMjIuMmMwLDM1LjI5LDAsNzAuNTgsMCwxMDUuODhxMCw2Ljg5LTYuOTksNi45Yy04LjE1LDAtMTYuMzEtLjEzLTI0LjQ2LjA2LTMuNDcuMDgtNC42OC0xLjA5LTQuNjEtNC41OS4xOC05LjY1LjA2LTE5LjMxLjA2LTI4Ljk2LDAtNTguMjYtLjAxLTExNi41My4wMi0xNzQuNzksMC00Ljc2LTEuMTItOS40Ni0uMTQtMTQuMy41MS0yLjU0LDEuMzktMy4zOCwzLjgtMy4zNiw4LjgyLjA2LDE3LjY0LjE0LDI2LjQ2LS4wMiw0LjU5LS4wOSw1Ljk1LDEuODUsNS45NCw2LjMzLS4xNCwzNS42Mi0uMDgsNzEuMjUtLjA4LDEwNi44N1pcXFwiLz5cXG4gIDxwYXRoIGNsYXNzPVxcXCJpbm5lcm1vc3RcXFwiIGQ9XFxcIm0xNTEuMDQsMzIyLjAxYzAtOS45OS4wNy0xOS45Ny0uMDUtMjkuOTYtLjA0LTIuOTMuODMtNC4xOCwzLjk1LTQuMTgsMy4wNiwwLDQuMDMsMS4xMiw0LjAyLDQuMTEtLjA5LDE5Ljk3LS4wOCwzOS45NC4wMSw1OS45MS4wMSwyLjk2LS44NCw0LjE2LTMuOTYsNC4xNC0zLjAzLS4wMS00LjA4LTEuMDQtNC4wMy00LjA4LjE0LTkuOTguMDUtMTkuOTcuMDUtMjkuOTZaXFxcIi8+XFxuPC9zdmc+XCI7IiwiZXhwb3J0IGRlZmF1bHQgXCI8c3ZnIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgdmVyc2lvbj1cXFwiMS4wXFxcIiB2aWV3Qm94PVxcXCIwIDAgNTYuMjUgMzBcXFwiIGNsYXNzPVxcXCJ3YXZlZm9ybVxcXCI+XFxuICAgIDxkZWZzPlxcbiAgICAgICAgPGNsaXBQYXRoIGlkPVxcXCJhXFxcIj5cXG4gICAgICAgICAgICA8cGF0aCBkPVxcXCJNLjU0IDEySDN2NUguNTRabTAgMFxcXCIvPlxcbiAgICAgICAgPC9jbGlwUGF0aD5cXG4gICAgICAgIDxjbGlwUGF0aCBpZD1cXFwiYlxcXCI+XFxuICAgICAgICAgICAgPHBhdGggZD1cXFwiTTI1IDIuMmgydjI0LjY4aC0yWm0wIDBcXFwiLz5cXG4gICAgICAgIDwvY2xpcFBhdGg+XFxuICAgICAgICA8Y2xpcFBhdGggaWQ9XFxcImNcXFwiPlxcbiAgICAgICAgICAgIDxwYXRoIGQ9XFxcIk01MyAxMmgxLjk4djVINTNabTAgMFxcXCIvPlxcbiAgICAgICAgPC9jbGlwUGF0aD5cXG4gICAgPC9kZWZzPlxcbiAgICA8ZyBjbGlwLXBhdGg9XFxcInVybCgjYSlcXFwiPlxcbiAgICAgICAgPHBhdGggZD1cXFwiTTEuNDggMTIuNzFjLS41IDAtLjkuNC0uOS45djEuODVhLjkuOSAwIDAgMCAxLjggMHYtMS44NGMwLS41LS40LS45LS45LS45Wm0wIDBcXFwiLz5cXG4gICAgPC9nPlxcbiAgICA8cGF0aCBkPVxcXCJNNC45OCA2LjYzYy0uNSAwLS45LjQtLjkuOXYxNC4wMWEuOS45IDAgMCAwIDEuODEgMHYtMTRjMC0uNS0uNC0uOTItLjktLjkyWm0zLjUxIDMuMWEuOS45IDAgMCAwLS45LjkxdjcuNzlhLjkuOSAwIDAgMCAxLjggMHYtNy43OWMwLS41LS40LS45LS45LS45Wk0xMiAzLjgzYS45LjkgMCAwIDAtLjkxLjl2MTkuNmEuOS45IDAgMCAwIDEuOCAwVjQuNzRjMC0uNS0uNC0uOS0uOS0uOVptMy41IDguMjlhLjkuOSAwIDAgMC0uOTEuOXYzLjAzYS45LjkgMCAwIDAgMS44MSAwdi0zLjAzYzAtLjUtLjQtLjktLjktLjlaTTE5IDYuOGMtLjUgMC0uOS40LS45Ljl2MTMuNjhhLjkuOSAwIDAgMCAxLjggMFY3LjdjMC0uNS0uNC0uOS0uOS0uOVptMy41OC0yLjk3aC0uMDFjLS41IDAtLjkuNC0uOS45bC0uMTMgMTkuNmMwIC41LjQuOS45LjkxLjUgMCAuOS0uNC45LS45bC4xNC0xOS42YS45LjkgMCAwIDAtLjktLjlabTAgMFxcXCIvPlxcbiAgICA8ZyBjbGlwLXBhdGg9XFxcInVybCgjYilcXFwiPlxcbiAgICAgICAgPHBhdGggZD1cXFwiTTI2IDIuMmMtLjUgMC0uOS40LS45Ljl2MjIuODZhLjkuOSAwIDEgMCAxLjgxIDBWMy4xMWEuOS45IDAgMCAwLS45LS45MVptMCAwXFxcIi8+XFxuICAgIDwvZz5cXG4gICAgPHBhdGggZD1cXFwiTTI5LjUyIDcuNzFhLjkuOSAwIDAgMC0uOTEuOXYxMS44NWEuOS45IDAgMCAwIDEuODEgMFY4LjYyYzAtLjUtLjQtLjktLjktLjlabTMuNSAyLjkzYS45LjkgMCAwIDAtLjkuOTF2NS45N2EuOS45IDAgMCAwIDEuOCAwdi01Ljk3YzAtLjUtLjQtLjktLjktLjlabTMuNS01Ljc4Yy0uNSAwLS45LjQtLjkuOXYxNy41NWEuOS45IDAgMCAwIDEuODEgMFY1Ljc2YzAtLjUtLjQtLjktLjktLjlabTMuNTEgMy4zNGMtLjUgMC0uOS40LS45Ljl2MTAuODdhLjkuOSAwIDAgMCAxLjggMFY5LjFhLjkuOSAwIDAgMC0uOS0uOTFabTMuNSAzLjA4Yy0uNSAwLS45LjQtLjkuOTF2NC43YS45LjkgMCAxIDAgMS44IDB2LTQuN2EuOS45IDAgMCAwLS45LS45Wm0zLjUxLTcuNDVhLjkuOSAwIDAgMC0uOTEuOXYxOS42YS45LjkgMCAwIDAgMS44MSAwVjQuNzRjMC0uNS0uNC0uOS0uOS0uOVptMy41IDUuNTdhLjkuOSAwIDAgMC0uOS45MXY4LjQ1YS45LjkgMCAwIDAgMS44IDB2LTguNDVjMC0uNS0uNC0uOS0uOS0uOVptMCAwXFxcIi8+XFxuICAgIDxnIGNsaXAtcGF0aD1cXFwidXJsKCNjKVxcXCI+XFxuICAgICAgICA8cGF0aCBkPVxcXCJNNTQuMDQgMTIuOTZhLjkuOSAwIDAgMC0uOS45MXYxLjMzYS45LjkgMCAxIDAgMS44IDB2LTEuMzJhLjkuOSAwIDAgMC0uOS0uOTJabTAgMFxcXCIvPlxcbiAgICA8L2c+XFxuPC9zdmc+XCI7IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3JlY3RhbmdsZXMuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9yZWN0YW5nbGVzLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi90YWxrQnV0dG9uLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vdGFsa0J1dHRvbi5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9ydWxlU2V0WzFdLnJ1bGVzWzNdLnVzZVsxXSEuLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvZGlzdC9janMuanM/P3J1bGVTZXRbMV0ucnVsZXNbM10udXNlWzJdIS4vbW9iaWxlLnNjc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cnVsZVNldFsxXS5ydWxlc1szXS51c2VbMV0hLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9ydWxlU2V0WzFdLnJ1bGVzWzNdLnVzZVsyXSEuL21vYmlsZS5zY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJpbXBvcnQgQnV0dG9uTW9kdWxlIGZyb20gXCIuL0J1dHRvbk1vZHVsZS5qc1wiO1xuaW1wb3J0IEV2ZW50TW9kdWxlIGZyb20gXCIuL0V2ZW50TW9kdWxlLmpzXCI7XG5pbXBvcnQgeyBpc01vYmlsZVZpZXcsIGFkZFVzZXJBZ2VudEZsYWdzIH0gZnJvbSBcIi4vVXNlckFnZW50TW9kdWxlLmpzXCI7XG5pbXBvcnQgXCIuL3RhbGtCdXR0b24uY3NzXCI7XG5pbXBvcnQgXCIuL21vYmlsZS5zY3NzXCI7XG5pbXBvcnQgXCIuL3JlY3RhbmdsZXMuY3NzXCI7XG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBjb25zdCBidXR0b25Nb2R1bGUgPSBuZXcgQnV0dG9uTW9kdWxlKCk7XG5cbiAgY29uc3QgbG9jYWxDb25maWcgPSB7XG4gICAgYXBwU2VydmVyVXJsOiBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMFwiLFxuICAgIGFwaVNlcnZlclVybDogXCJodHRwOi8vbG9jYWxob3N0OjgwODBcIixcbiAgICAvL2FwaVNlcnZlclVybDogXCJodHRwczovL2xvY2FsaG9zdDo0NDQzXCIsXG4gICAgLy8gQWRkIG90aGVyIGNvbmZpZ3VyYXRpb24gcHJvcGVydGllcyBhcyBuZWVkZWRcbiAgfTtcblxuICAvLyBEZWZpbmUgYSBnbG9iYWwgY29uZmlndXJhdGlvbiBwcm9wZXJ0eVxuICBjb25zdCBwcm9kdWN0aW9uQ29uZmlnID0ge1xuICAgIGFwcFNlcnZlclVybDogXCJodHRwczovL2FwcC5zYXlwaS5haVwiLFxuICAgIGFwaVNlcnZlclVybDogXCJodHRwczovL2FwaS5zYXlwaS5haVwiLFxuICAgIC8vIEFkZCBvdGhlciBjb25maWd1cmF0aW9uIHByb3BlcnRpZXMgYXMgbmVlZGVkXG4gIH07XG4gIGNvbnN0IGNvbmZpZyA9IHByb2R1Y3Rpb25Db25maWc7XG5cbiAgY29uc3QgcGFnZVNjcmlwdCA9IHJlcXVpcmUoXCJyYXctbG9hZGVyIS4vdHJhbnNjcmliZXIuanNcIikuZGVmYXVsdDtcbiAgYWRkVXNlckFnZW50RmxhZ3MoKTtcbiAgRXZlbnRNb2R1bGUuaW5pdCgpO1xuXG4gIC8vIENyZWF0ZSBhIE11dGF0aW9uT2JzZXJ2ZXIgdG8gbGlzdGVuIGZvciBjaGFuZ2VzIHRvIHRoZSBET01cbiAgdmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKG11dGF0aW9ucykge1xuICAgIC8vIENoZWNrIGVhY2ggbXV0YXRpb25cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG11dGF0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG11dGF0aW9uID0gbXV0YXRpb25zW2ldO1xuXG4gICAgICAvLyBJZiBub2RlcyB3ZXJlIGFkZGVkLCBjaGVjayBlYWNoIG9uZVxuICAgICAgaWYgKG11dGF0aW9uLmFkZGVkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG11dGF0aW9uLmFkZGVkTm9kZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICB2YXIgbm9kZSA9IG11dGF0aW9uLmFkZGVkTm9kZXNbal07XG5cbiAgICAgICAgICAvLyBJZiB0aGUgbm9kZSBpcyB0aGUgYXBwcm9wcmlhdGUgY29udGFpbmVyIGVsZW1lbnQsIGFkZCB0aGUgYnV0dG9uIGFuZCBzdG9wIG9ic2VydmluZ1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJkaXZcIiAmJlxuICAgICAgICAgICAgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoXCJmaXhlZFwiKSAmJlxuICAgICAgICAgICAgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoXCJib3R0b20tMTZcIilcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHZhciBmb290ZXIgPSBub2RlO1xuICAgICAgICAgICAgdmFyIGJ1dHRvbkNvbnRhaW5lciA9IGZvb3Rlci5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgICBcIi5yZWxhdGl2ZS5mbGV4LmZsZXgtY29sXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoYnV0dG9uQ29udGFpbmVyKSB7XG4gICAgICAgICAgICAgIGFkZFRhbGtCdXR0b24oYnV0dG9uQ29udGFpbmVyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIk5vIGJ1dHRvbiBjb250YWluZXIgZm91bmQgaW4gZm9vdGVyXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFhbm5vdGF0ZURPTSgpKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIlJlcXVpcmVkIGVsZW1lbnRzIG5vdCBmb3VuZCBpbiBET01cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNNb2JpbGVWaWV3KCkpIHtcbiAgICAgICAgICAgICAgYnV0dG9uTW9kdWxlLmNyZWF0ZUV4aXRCdXR0b24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIGFubm90YXRlRE9NKCkge1xuICAgIC8vIEFkZCBhbiBJRCB0byB0aGUgcHJvbXB0IHRleHRhcmVhXG4gICAgY29uc3QgZm91bmRQcm9tcHQgPSBhZGRJZFByb21wdFRleHRBcmVhKCk7XG4gICAgY29uc3QgZm91bmRGb290ZXIgPSBhZGRJZEZvb3RlcigpO1xuICAgIHJldHVybiBmb3VuZFByb21wdCAmJiBmb3VuZEZvb3RlcjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZElkUHJvbXB0VGV4dEFyZWEoKSB7XG4gICAgdmFyIHRleHRhcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS1wcm9tcHRcIik7XG4gICAgaWYgKCF0ZXh0YXJlYSkge1xuICAgICAgLy8gRmluZCB0aGUgZmlyc3QgPHRleHRhcmVhPiBlbGVtZW50IGFuZCBnaXZlIGl0IGFuIGlkXG4gICAgICB2YXIgdGV4dGFyZWFFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInRleHRhcmVhXCIpO1xuICAgICAgaWYgKHRleHRhcmVhRWxlbWVudCkge1xuICAgICAgICB0ZXh0YXJlYUVsZW1lbnQuaWQgPSBcInNheXBpLXByb21wdFwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiTm8gPHRleHRhcmVhPiBlbGVtZW50IGZvdW5kXCIpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkSWRGb290ZXIoKSB7XG4gICAgLy8gRmluZCBhbGwgYXVkaW8gZWxlbWVudHMgb24gdGhlIHBhZ2VcbiAgICB2YXIgYXVkaW9FbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJhdWRpb1wiKTtcbiAgICB2YXIgZm91bmQgPSBmYWxzZTsgLy8gZGVmYXVsdCB0byBub3QgZm91bmRcblxuICAgIGF1ZGlvRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoYXVkaW8pIHtcbiAgICAgIHZhciBwcmVjZWRpbmdEaXYgPSBhdWRpby5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuXG4gICAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGZvdW5kIGEgZGl2LCB3ZSBjYW4gc2tpcCBmdXJ0aGVyIGl0ZXJhdGlvbnNcbiAgICAgIGlmIChmb3VuZCkgcmV0dXJuO1xuXG4gICAgICAvLyBDaGVjayBpZiB0aGUgcHJlY2VkaW5nIGVsZW1lbnQgaXMgYSBkaXZcbiAgICAgIGlmIChwcmVjZWRpbmdEaXYgJiYgcHJlY2VkaW5nRGl2LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJkaXZcIikge1xuICAgICAgICAvLyBBc3NpZ24gYW4gSUQgdG8gdGhlIGRpdlxuICAgICAgICBwcmVjZWRpbmdEaXYuaWQgPSBcInNheXBpLWZvb3RlclwiO1xuICAgICAgICBmb3VuZCA9IHRydWU7IC8vIHNldCB0byBmb3VuZFxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGZvdW5kO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5qZWN0U2NyaXB0KGNhbGxiYWNrKSB7XG4gICAgdmFyIHNjcmlwdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgIHNjcmlwdEVsZW1lbnQudHlwZSA9IFwidGV4dC9qYXZhc2NyaXB0XCI7XG4gICAgc2NyaXB0RWxlbWVudC5pZCA9IFwic2F5cGktc2NyaXB0XCI7XG4gICAgY29uc3QgY29uZmlnVGV4dCA9IFwidmFyIGNvbmZpZyA9IFwiICsgSlNPTi5zdHJpbmdpZnkoY29uZmlnKSArIFwiO1wiO1xuICAgIHNjcmlwdEVsZW1lbnQudGV4dENvbnRlbnQgPSBjb25maWdUZXh0ICsgcGFnZVNjcmlwdDtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdEVsZW1lbnQpO1xuXG4gICAgLy8gQ2FsbCB0aGUgY2FsbGJhY2sgZnVuY3Rpb24gYWZ0ZXIgdGhlIHNjcmlwdCBpcyBhZGRlZFxuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBhZGRUYWxrQnV0dG9uKGNvbnRhaW5lcikge1xuICAgIC8vIGNyZWF0ZSBhIGNvbnRhaW5pbmcgZGl2XG4gICAgdmFyIHBhbmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBwYW5lbC5pZCA9IFwic2F5cGktcGFuZWxcIjtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQocGFuZWwpO1xuXG4gICAgLy8gQ3JlYXRlIHRoZSB0YWxrIGJ1dHRvbiB1c2luZyBCdXR0b25Nb2R1bGVcbiAgICBjb25zdCBsYWJlbCA9XG4gICAgICBcIlRhbGsgKEhvbGQgQ29udHJvbCArIFNwYWNlIHRvIHVzZSBob3RrZXkuIERvdWJsZSBjbGljayB0byB0b2dnbGUgYXV0by1zdWJtaXQgb24vb2ZmKVwiO1xuICAgIHZhciBidXR0b24gPSBidXR0b25Nb2R1bGUuY3JlYXRlQnV0dG9uKFwiXCIsICgpID0+IHt9KTsgLy8gVGhlIGNhbGxiYWNrIGlzIGVtcHR5IGZvciBub3csIGJ1dCB5b3UgY2FuIGFkZCBmdW5jdGlvbmFsaXRpZXMgaWYgbmVlZGVkLlxuXG4gICAgYnV0dG9uLmlkID0gXCJzYXlwaS10YWxrQnV0dG9uXCI7XG4gICAgYnV0dG9uLnR5cGUgPSBcImJ1dHRvblwiO1xuXG4gICAgLy8gU2V0IEFSSUEgbGFiZWwgYW5kIHRvb2x0aXBcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBsYWJlbCk7XG4gICAgYnV0dG9uLnNldEF0dHJpYnV0ZShcInRpdGxlXCIsIGxhYmVsKTtcblxuICAgIGNvbnN0IGNsYXNzTmFtZXMgPVxuICAgICAgXCJyZWxhdGl2ZSBmbGV4IG10LTEgbWItMSByb3VuZGVkLWZ1bGwgcHgtMiBweS0zIHRleHQtY2VudGVyIGJnLWNyZWFtLTU1MCBob3ZlcjpiZy1jcmVhbS02NTAgaG92ZXI6dGV4dC1icmFuZC1ncmVlbi03MDAgdGV4dC1tdXRlZFwiO1xuICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZXMuc3BsaXQoXCIgXCIpKTtcblxuICAgIC8vIEVuYWJsZSBhdXRvc3VibWl0IGJ5IGRlZmF1bHRcbiAgICBidXR0b24uZGF0YXNldC5hdXRvc3VibWl0ID0gXCJ0cnVlXCI7XG4gICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJhdXRvU3VibWl0XCIpO1xuXG4gICAgcGFuZWwuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgICBidXR0b25Nb2R1bGUuYWRkVGFsa0ljb24oYnV0dG9uKTtcblxuICAgIC8vIENhbGwgdGhlIGZ1bmN0aW9uIHRvIGluamVjdCB0aGUgc2NyaXB0IGFmdGVyIHRoZSBidXR0b24gaGFzIGJlZW4gYWRkZWRcbiAgICBpbmplY3RTY3JpcHQocmVnaXN0ZXJBdWRpb0J1dHRvbkV2ZW50cyk7XG4gIH1cblxuICBmdW5jdGlvbiByZWdpc3RlckF1ZGlvQnV0dG9uRXZlbnRzKCkge1xuICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F5cGktdGFsa0J1dHRvblwiKTtcblxuICAgIC8vIFNldHRpbmcgdGhlIGNvcnJlY3QgY29udGV4dFxuICAgIGxldCBjb250ZXh0ID0gd2luZG93O1xuICAgIGlmIChHTV9pbmZvLnNjcmlwdEhhbmRsZXIgIT09IFwiVXNlcnNjcmlwdHNcIikge1xuICAgICAgY29udGV4dCA9IHVuc2FmZVdpbmRvdztcbiAgICB9XG4gICAgRXZlbnRNb2R1bGUuc2V0Q29udGV4dChjb250ZXh0KTsgLy8gU2V0IHRoZSBjb250ZXh0IGZvciBFdmVudE1vZHVsZVxuXG4gICAgLy8gQXR0YWNoIHRoZSBldmVudCBsaXN0ZW5lcnNcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwibW91c2Vkb3duXCIsXG4gICAgICBFdmVudE1vZHVsZS5oYW5kbGVUYWxrTW91c2VEb3duLmJpbmQoRXZlbnRNb2R1bGUpXG4gICAgKTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwibW91c2V1cFwiLFxuICAgICAgRXZlbnRNb2R1bGUuaGFuZGxlVGFsa01vdXNlVXAuYmluZChFdmVudE1vZHVsZSlcbiAgICApO1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiZGJsY2xpY2tcIiwgKCkgPT5cbiAgICAgIEV2ZW50TW9kdWxlLmhhbmRsZVRhbGtEb3VibGVDbGljayhidXR0b24pXG4gICAgKTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgKGUpID0+XG4gICAgICBFdmVudE1vZHVsZS5oYW5kbGVUYWxrVG91Y2hTdGFydChidXR0b24sIGUpXG4gICAgKTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsICgpID0+XG4gICAgICBFdmVudE1vZHVsZS5oYW5kbGVUYWxrVG91Y2hFbmQoYnV0dG9uKVxuICAgICk7XG5cbiAgICBFdmVudE1vZHVsZS5yZWdpc3Rlck90aGVyQXVkaW9CdXR0b25FdmVudHMoYnV0dG9uKTtcbiAgICBFdmVudE1vZHVsZS5yZWdpc3RlckN1c3RvbUF1ZGlvRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICBFdmVudE1vZHVsZS5yZWdpc3RlckhvdGtleSgpO1xuICB9XG5cbiAgLy8gU3RhcnQgb2JzZXJ2aW5nIHRoZSBlbnRpcmUgZG9jdW1lbnQgZm9yIGNoYW5nZXMgdG8gY2hpbGQgbm9kZXMgYW5kIHN1YnRyZWVcbiAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudCwgeyBjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWUgfSk7XG59KSgpO1xuIl0sIm5hbWVzIjpbIkFuaW1hdGlvbk1vZHVsZSIsIl9jbGFzc0NhbGxDaGVjayIsIl9jcmVhdGVDbGFzcyIsImtleSIsInZhbHVlIiwiYW5pbWF0ZSIsImFuaW1hdGlvbiIsInN0b3BPdGhlckFuaW1hdGlvbnMiLCJyZWN0YW5nbGVzIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yQWxsIiwicmVjdGFuZ2xlc1NlbGVjdG9yIiwiZm9yRWFjaCIsInJlY3QiLCJjbGFzc0xpc3QiLCJhZGQiLCJpbmFuaW1hdGUiLCJyZW1vdmUiLCJzdG9wQWxsQW5pbWF0aW9ucyIsIl90aGlzIiwidGFsa0J1dHRvbkFuaW1hdGlvbnMiLCJrZWVwQW5pbWF0aW9uIiwiX3RoaXMyIiwiX2RlZmluZVByb3BlcnR5IiwiZGVmYXVsdCIsImV4aXRNb2JpbGVNb2RlIiwiaXNNb2JpbGVWaWV3IiwiZXhpdEljb25TVkciLCJyZWN0YW5nbGVzU1ZHIiwidGFsa0ljb25TVkciLCJCdXR0b25Nb2R1bGUiLCJwbGF5QnV0dG9uIiwiaGFuZGxlUGxheUJ1dHRvbkNsaWNrIiwiYmluZCIsInJlZ2lzdGVyQnV0dG9uRXZlbnRzIiwicmVnaXN0ZXJPdGhlckV2ZW50cyIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJwb2tlVXNlciIsInVucG9rZVVzZXIiLCJldmVudE5hbWUiLCJ0YWxrQnV0dG9uIiwiZ2V0RWxlbWVudEJ5SWQiLCJoYW5kbGVBdXRvU3VibWl0IiwiY3JlYXRlQnV0dG9uIiwibGFiZWwiLCJjYWxsYmFjayIsImJ1dHRvbiIsImNyZWF0ZUVsZW1lbnQiLCJ0ZXh0Q29udGVudCIsIm9uY2xpY2siLCJzdHlsZUJ1dHRvbiIsInN0eWxlcyIsImhhc093blByb3BlcnR5Iiwic3R5bGUiLCJhZGRUYWxrSWNvbiIsInVwZGF0ZUljb25Db250ZW50IiwibWF0Y2hNZWRpYSIsImFkZExpc3RlbmVyIiwic2V0dXBDbGFzc09ic2VydmVyIiwiaWNvbkNvbnRhaW5lciIsImlubmVySFRNTCIsIl90aGlzMyIsInRhcmdldE5vZGUiLCJkb2N1bWVudEVsZW1lbnQiLCJjb25maWciLCJhdHRyaWJ1dGVzIiwiYXR0cmlidXRlRmlsdGVyIiwibXV0YXRpb25zTGlzdCIsIm9ic2VydmVyIiwiX2l0ZXJhdG9yIiwiX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIiLCJfc3RlcCIsInMiLCJuIiwiZG9uZSIsIm11dGF0aW9uIiwidHlwZSIsImF0dHJpYnV0ZU5hbWUiLCJjb250YWlucyIsImVyciIsImUiLCJmIiwiTXV0YXRpb25PYnNlcnZlciIsIm9ic2VydmUiLCJjcmVhdGVFeGl0QnV0dG9uIiwiaWQiLCJjbGFzc05hbWUiLCJzZXRBdHRyaWJ1dGUiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJjcmVhdGVQbGF5QnV0dG9uIiwic2hvd1BsYXlCdXR0b24iLCJoaWRlUGxheUJ1dHRvbiIsImRpc3BhdGNoQ3VzdG9tRXZlbnQiLCJwaUF1ZGlvTWFuYWdlciIsInVzZXJQbGF5Iiwic2ltdWxhdGVGb3JtU3VibWl0IiwidGV4dGFyZWEiLCJlbnRlckV2ZW50IiwiS2V5Ym9hcmRFdmVudCIsImJ1YmJsZXMiLCJrZXlDb2RlIiwid2hpY2giLCJkaXNwYXRjaEV2ZW50IiwiZGF0YXNldCIsImF1dG9zdWJtaXQiLCJjb25zb2xlIiwibG9nIiwiaXNTYWZhcmkiLCJFdmVudE1vZHVsZSIsImluaXQiLCJoYW5kbGVBdWRpb0V2ZW50cyIsImNsZWFudXAiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiaGFuZGxlVHJhbnNjcmlwdGlvblJlc3BvbnNlIiwiZGV0YWlsIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwidW5kZWZpbmVkIiwiZXZlbnQiLCJDdXN0b21FdmVudCIsInRyYW5zY3JpcHRpb25FdmVudCIsInRyYW5zY3JpcHQiLCJ0ZXh0Iiwic3Vic3RyaW5nIiwid2FybiIsInNldE5hdGl2ZVZhbHVlIiwic2ltdWxhdGVUeXBpbmciLCJlbGVtZW50Iiwid29yZHMiLCJzcGxpdCIsImkiLCJ0eXBlV29yZCIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImxhc3RWYWx1ZSIsIkV2ZW50IiwidGFyZ2V0Iiwic2ltdWxhdGVkIiwidHJhY2tlciIsIl92YWx1ZVRyYWNrZXIiLCJzZXRWYWx1ZSIsImhhbmRsZVRhbGtNb3VzZURvd24iLCJoYW5kbGVUYWxrTW91c2VVcCIsImhhbmRsZVRhbGtEb3VibGVDbGljayIsInRvZ2dsZSIsImdldEF0dHJpYnV0ZSIsImhhbmRsZVRhbGtUb3VjaFN0YXJ0IiwicHJldmVudERlZmF1bHQiLCJoYW5kbGVUYWxrVG91Y2hFbmQiLCJzZXRDb250ZXh0IiwiY3R4IiwiY29udGV4dCIsInJlZ2lzdGVyT3RoZXJBdWRpb0J1dHRvbkV2ZW50cyIsInJlZ2lzdGVyQ3VzdG9tQXVkaW9FdmVudExpc3RlbmVycyIsInJlZ2lzdGVySG90a2V5IiwiY3RybERvd24iLCJjdHJsS2V5IiwiY29kZSIsInVzZXJQcmVmZXJlbmNlIiwibWF0Y2hlcyIsInRlc3QiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJhZGRVc2VyQWdlbnRGbGFncyIsImlzRmlyZWZveEFuZHJvaWQiLCJidXR0b25Nb2R1bGUiLCJsb2NhbENvbmZpZyIsImFwcFNlcnZlclVybCIsImFwaVNlcnZlclVybCIsInByb2R1Y3Rpb25Db25maWciLCJwYWdlU2NyaXB0IiwicmVxdWlyZSIsIm11dGF0aW9ucyIsImFkZGVkTm9kZXMiLCJqIiwibm9kZSIsIm5vZGVOYW1lIiwidG9Mb3dlckNhc2UiLCJmb290ZXIiLCJidXR0b25Db250YWluZXIiLCJxdWVyeVNlbGVjdG9yIiwiYWRkVGFsa0J1dHRvbiIsImFubm90YXRlRE9NIiwiZGlzY29ubmVjdCIsImZvdW5kUHJvbXB0IiwiYWRkSWRQcm9tcHRUZXh0QXJlYSIsImZvdW5kRm9vdGVyIiwiYWRkSWRGb290ZXIiLCJ0ZXh0YXJlYUVsZW1lbnQiLCJhdWRpb0VsZW1lbnRzIiwiZm91bmQiLCJhdWRpbyIsInByZWNlZGluZ0RpdiIsInByZXZpb3VzRWxlbWVudFNpYmxpbmciLCJ0YWdOYW1lIiwiaW5qZWN0U2NyaXB0Iiwic2NyaXB0RWxlbWVudCIsImNvbmZpZ1RleHQiLCJKU09OIiwic3RyaW5naWZ5IiwiY29udGFpbmVyIiwicGFuZWwiLCJjbGFzc05hbWVzIiwicmVnaXN0ZXJBdWRpb0J1dHRvbkV2ZW50cyIsIkdNX2luZm8iLCJzY3JpcHRIYW5kbGVyIiwidW5zYWZlV2luZG93IiwiY2hpbGRMaXN0Iiwic3VidHJlZSJdLCJzb3VyY2VSb290IjoiIn0=