// ==UserScript==
// @name         Say, Pi
// @namespace    http://www.saypi.ai/
// @version      1.3.2
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
    key: "startAnimation",
    value: function startAnimation(animation) {
      this.stopOtherAnimations(animation);
      var rectangles = document.querySelectorAll(this.rectanglesSelector);
      rectangles.forEach(function (rect) {
        return rect.classList.add(animation);
      });
    }
  }, {
    key: "stopAnimation",
    value: function stopAnimation(animation) {
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
        return _this.stopAnimation(animation);
      });
    }
  }, {
    key: "stopOtherAnimations",
    value: function stopOtherAnimations(keepAnimation) {
      var _this2 = this;
      this.talkButtonAnimations.forEach(function (animation) {
        if (animation !== keepAnimation) {
          _this2.stopAnimation(animation);
        }
      });
    }
  }]);
  return AnimationModule;
}();
_defineProperty(AnimationModule, "rectanglesSelector", ".outermost, .second, .third, .fourth, .fifth, .innermost");
_defineProperty(AnimationModule, "talkButtonAnimations", ["loading", "piSpeaking", "userSpeaking", "transcribing", "paused"]);


/***/ }),

/***/ "./src/ButtonModule.js":
/*!*****************************!*\
  !*** ./src/ButtonModule.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buttonModule: () => (/* binding */ buttonModule),
/* harmony export */   "default": () => (/* binding */ ButtonModule)
/* harmony export */ });
/* harmony import */ var _UserAgentModule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UserAgentModule */ "./src/UserAgentModule.js");
/* harmony import */ var _EventBus__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EventBus */ "./src/EventBus.js");
/* harmony import */ var _EventModule_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./EventModule.js */ "./src/EventModule.js");
/* harmony import */ var _StateMachineService_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./StateMachineService.js */ "./src/StateMachineService.js");
/* harmony import */ var _exit_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./exit.svg */ "./src/exit.svg");
/* harmony import */ var _rectangles_svg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./rectangles.svg */ "./src/rectangles.svg");
/* harmony import */ var _waveform_svg__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./waveform.svg */ "./src/waveform.svg");
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
    this.actor = _StateMachineService_js__WEBPACK_IMPORTED_MODULE_3__["default"].actor;
    // Binding methods to the current instance
    this.handlePlayButtonClick = this.handlePlayButtonClick.bind(this);
    this.registerOtherEvents();
  }
  _createClass(ButtonModule, [{
    key: "registerOtherEvents",
    value: function registerOtherEvents() {
      _EventBus__WEBPACK_IMPORTED_MODULE_1__["default"].on("saypi:autoSubmit", ButtonModule.handleAutoSubmit);
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
      var _this = this;
      this.updateIconContent(button);
      window.matchMedia("(max-width: 768px)").addListener(function () {
        _this.updateIconContent(button);
      });
      this.setupClassObserver(button);
    }
  }, {
    key: "updateIconContent",
    value: function updateIconContent(iconContainer) {
      if ((0,_UserAgentModule__WEBPACK_IMPORTED_MODULE_0__.isMobileView)()) {
        iconContainer.innerHTML = _rectangles_svg__WEBPACK_IMPORTED_MODULE_5__["default"];
      } else {
        iconContainer.innerHTML = _waveform_svg__WEBPACK_IMPORTED_MODULE_6__["default"];
      }
    }
  }, {
    key: "setupClassObserver",
    value: function setupClassObserver(button) {
      var _this2 = this;
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
                  _this2.updateIconContent(button);
                } else {
                  // 'mobile-view' class was removed
                  _this2.updateIconContent(button);
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
        (0,_UserAgentModule__WEBPACK_IMPORTED_MODULE_0__.exitMobileMode)();
      });
      button.id = "saypi-exitButton";
      button.type = "button";
      button.className = "exit-button fixed rounded-full bg-cream-550 enabled:hover:bg-cream-650";
      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
      button.innerHTML = _exit_svg__WEBPACK_IMPORTED_MODULE_4__["default"];
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
      this.actor.send("saypi:play");
      _EventBus__WEBPACK_IMPORTED_MODULE_1__["default"].emit("audio:reload");
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
}(); // Singleton

var buttonModule = new ButtonModule();

/***/ }),

/***/ "./src/EventBus.js":
/*!*************************!*\
  !*** ./src/EventBus.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ "./node_modules/events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new (events__WEBPACK_IMPORTED_MODULE_0___default())());

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
/* harmony import */ var _EventBus_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EventBus.js */ "./src/EventBus.js");
/* harmony import */ var _StateMachineService_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./StateMachineService.js */ "./src/StateMachineService.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }


var USER_SPEAKING = "saypi:userSpeaking";
var USER_STOPPED_SPEAKING = "saypi:userStoppedSpeaking";
var USER_FINISHED_SPEAKING = "saypi:userFinishedSpeaking";
var TRANSCRIBING = "saypi:transcribing";
var PI_SPEAKING = "saypi:piSpeaking";
var PI_STOPPED_SPEAKING = "saypi:piStoppedSpeaking";
var PI_FINISHED_SPEAKING = "saypi:piFinishedSpeaking";
var PAUSE = "saypi:pause";
var READY = "saypi:ready";
var PLAY = "saypi:play";
var EventModule = /*#__PURE__*/function () {
  function EventModule() {
    _classCallCheck(this, EventModule);
  }
  _createClass(EventModule, null, [{
    key: "init",
    value: function init() {
      // All the event listeners can be added here
      this.registerStateMachineEvents(_StateMachineService_js__WEBPACK_IMPORTED_MODULE_1__["default"].actor);
      // Any other initializations...
    }
  }, {
    key: "cleanup",
    value: function cleanup() {
      // Remove event listeners if needed, or any other cleanup operations
      window.removeEventListener("saypi:transcribed", this.handleTranscriptionResponse);
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
          _EventBus_js__WEBPACK_IMPORTED_MODULE_0__["default"].emit("saypi:autoSubmit");
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
      _EventBus_js__WEBPACK_IMPORTED_MODULE_0__["default"].emit("audio:startRecording");
    }
  }, {
    key: "handleTalkMouseUp",
    value: function handleTalkMouseUp() {
      _EventBus_js__WEBPACK_IMPORTED_MODULE_0__["default"].emit("audio:stopRecording");
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
      _EventBus_js__WEBPACK_IMPORTED_MODULE_0__["default"].emit("audio:startRecording");
    }
  }, {
    key: "handleTalkTouchEnd",
    value: function handleTalkTouchEnd(button) {
      _EventBus_js__WEBPACK_IMPORTED_MODULE_0__["default"].emit("audio:stopRecording");
    }
  }, {
    key: "registerOtherAudioButtonEvents",
    value: function registerOtherAudioButtonEvents(button) {
      // "warm up" the microphone by acquiring it before the user presses the button
      button.addEventListener("mouseenter", function () {
        _EventBus_js__WEBPACK_IMPORTED_MODULE_0__["default"].emit("audio:setupRecording");
      });
      button.addEventListener("mouseleave", function () {
        _EventBus_js__WEBPACK_IMPORTED_MODULE_0__["default"].emit("audio:tearDownRecording");
      });
      window.addEventListener("beforeunload", function () {
        _EventBus_js__WEBPACK_IMPORTED_MODULE_0__["default"].emit("audio:tearDownRecording");
      });
      button.addEventListener("touchcancel", function () {
        _EventBus_js__WEBPACK_IMPORTED_MODULE_0__["default"].emit("audio:tearDownRecording");
      });
    }
  }, {
    key: "registerStateMachineEvents",
    value: function registerStateMachineEvents(actor) {
      _EventBus_js__WEBPACK_IMPORTED_MODULE_0__["default"].on(USER_SPEAKING, function () {
        actor.send(USER_SPEAKING);
      });
      [USER_STOPPED_SPEAKING, USER_FINISHED_SPEAKING].forEach(function (eventName) {
        _EventBus_js__WEBPACK_IMPORTED_MODULE_0__["default"].on(eventName, function (detail) {
          if (detail) {
            actor.send(_objectSpread({
              type: eventName
            }, detail));
          } else {
            console.warn("Received ".concat(eventName, " without details."));
          }
        });
      });
      _EventBus_js__WEBPACK_IMPORTED_MODULE_0__["default"].on(TRANSCRIBING, function () {
        actor.send(TRANSCRIBING);
      });
      [PI_SPEAKING, PI_STOPPED_SPEAKING, PI_FINISHED_SPEAKING].forEach(function (eventName) {
        _EventBus_js__WEBPACK_IMPORTED_MODULE_0__["default"].on(eventName, function () {
          actor.send(eventName);
        });
      });
      [PAUSE, READY, PLAY].forEach(function (eventName) {
        _EventBus_js__WEBPACK_IMPORTED_MODULE_0__["default"].on(eventName, function () {
          actor.send(eventName);
        });
      });
    }

    /* events to direct the audio module to start/stop recording */
  }, {
    key: "registerHotkey",
    value: function registerHotkey() {
      var ctrlDown = false;
      document.addEventListener("keydown", function (event) {
        if (event.ctrlKey && event.code === "Space" && !ctrlDown) {
          ctrlDown = true;
          _EventBus_js__WEBPACK_IMPORTED_MODULE_0__["default"].emit("audio:startRecording");
        }
      });
      document.addEventListener("keyup", function (event) {
        if (ctrlDown && event.code === "Space") {
          ctrlDown = false;
          _EventBus_js__WEBPACK_IMPORTED_MODULE_0__["default"].emit("audio:stopRecording");
        }
      });
    }
  }]);
  return EventModule;
}();


/***/ }),

/***/ "./src/StateMachineService.js":
/*!************************************!*\
  !*** ./src/StateMachineService.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var xstate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! xstate */ "./node_modules/xstate/es/interpreter.js");
/* harmony import */ var _saypiStateMachine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./saypiStateMachine */ "./src/saypiStateMachine.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



/**
 * A singleton service that manages the state machine.
 */
var StateMachineService = /*#__PURE__*/_createClass(function StateMachineService() {
  _classCallCheck(this, StateMachineService);
  this.actor = (0,xstate__WEBPACK_IMPORTED_MODULE_1__.interpret)(_saypiStateMachine__WEBPACK_IMPORTED_MODULE_0__.machine).onTransition(function (state) {
    console.log("Transitioned to state: ".concat(state.value));
  });
  this.actor.start();
}); // Singleton
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new StateMachineService());

/***/ }),

/***/ "./src/TranscriptionModule.js":
/*!************************************!*\
  !*** ./src/TranscriptionModule.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   handleTranscriptionResponse: () => (/* binding */ handleTranscriptionResponse),
/* harmony export */   uploadAudio: () => (/* binding */ uploadAudio)
/* harmony export */ });
/* harmony import */ var _StateMachineService_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StateMachineService.js */ "./src/StateMachineService.js");
/* harmony import */ var _UserAgentModule_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./UserAgentModule.js */ "./src/UserAgentModule.js");
/* harmony import */ var _EventBus_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./EventBus.js */ "./src/EventBus.js");
/* harmony import */ var _EventModule_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./EventModule.js */ "./src/EventModule.js");




var config = {
  appServerUrl: "https://app.saypi.ai",
  apiServerUrl: "https://api.saypi.ai"
};
function uploadAudio(audioBlob) {
  // Create a FormData object
  var formData = new FormData();
  var audioFilename = "audio.webm";
  if (audioBlob.type === "audio/mp4") {
    audioFilename = "audio.mp4";
  }
  // Add the audio blob to the FormData object
  formData.append("audio", audioBlob, audioFilename);
  // Get the user's preferred language
  var language = navigator.language;
  // Post the audio to the server for transcription
  fetch(config.apiServerUrl + "/transcribe?language=" + language, {
    method: "POST",
    body: formData
  }).then(function (response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json();
  }).then(function (responseJson) {
    _StateMachineService_js__WEBPACK_IMPORTED_MODULE_0__["default"].actor.send("saypi:transcribed", {
      text: responseJson.text
    });
  })["catch"](function (error) {
    console.error("Looks like there was a problem: ", error);
    //TODO: raise an event to the state machine instead
    var textarea = document.getElementById("saypi-prompt");
    textarea.value = "Sorry, there was a problem transcribing your audio. Please try again later.";
  });
}
function handleTranscriptionResponse(transcript) {
  console.log("Transcript: " + transcript);
  var textarea = document.getElementById("saypi-prompt");
  if ((0,_UserAgentModule_js__WEBPACK_IMPORTED_MODULE_1__.isMobileView)()) {
    // if transcript is > 1000 characters, truncate it to 999 characters plus an ellipsis
    if (transcript.length > 1000) {
      transcript = transcript.substring(0, 999) + "…";
      console.warn("Transcript was too long for Pi. Truncated to 999 characters, losing the following text: ... " + transcript.substring(999));
    }
    _EventModule_js__WEBPACK_IMPORTED_MODULE_3__["default"].setNativeValue(textarea, transcript);
    _EventBus_js__WEBPACK_IMPORTED_MODULE_2__["default"].emit("saypi:autoSubmit");
  } else {
    _EventModule_js__WEBPACK_IMPORTED_MODULE_3__["default"].simulateTyping(textarea, transcript + " ");
  }
}

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

/***/ "./src/saypiStateMachine.js":
/*!**********************************!*\
  !*** ./src/saypiStateMachine.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   machine: () => (/* binding */ machine)
/* harmony export */ });
/* harmony import */ var _ButtonModule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ButtonModule */ "./src/ButtonModule.js");
/* harmony import */ var xstate__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! xstate */ "./node_modules/xstate/es/Machine.js");
/* harmony import */ var _AnimationModule__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AnimationModule */ "./src/AnimationModule.js");
/* harmony import */ var _UserAgentModule__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./UserAgentModule */ "./src/UserAgentModule.js");
/* harmony import */ var _TranscriptionModule__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TranscriptionModule */ "./src/TranscriptionModule.js");
/* harmony import */ var _EventBus__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./EventBus */ "./src/EventBus.js");






var machine = (0,xstate__WEBPACK_IMPORTED_MODULE_5__.createMachine)({
  /** @xstate-layout N4IgpgJg5mDOIC5SwIYE8AKBLAdFiANmAMSpoAOWCArrGAE4DK5YKA1lgHZQDaADAF1EocgHtYWAC5ZRnYSAAeiAMwB2PjmUBOPgDYAjLq379y3QBoQaRPr5atOXaq26ALKoBMy-QA5TAX39LMmw8QhIySgRyFFowfiEkEDEJaVl5JQQ1DW09Q2NTCytEVSMcUo8tH3cfVWVXM0Dg9FD8IlJ0KMpmVg5uBPkUqRk5JMzszR0DIxMzS2sEVx8PHHddAFZSrWVN3V0+daaQENw4phZ2LigOiiozgDEuLFgAC0gey-7BQfFh9LHEJUtK4cOs+Ko6ps+Hp1sp5ohYbpQR4NqV6j4tOsPEcTjgzh8+tdInc6ExJKJyCwIASrgMkkM0qNQJkPHwMThlnwzMo7Bj1j44cUEB5XBotKV1vywXs9r4cS1TqSadwblFJPQUJxYABjehYABGtO+9N+jIygPsILBEJ26hhgoWrg2OD4KKxVS5EMl8swuBicQgqqo5AI6DpIlNI3NCFsOk0DS9ugFrO88IQEJB6m8ro8qlcHixrh9oW6F0JQeiWEY5Mp7zLRsSEdSUYBMfzSNcWg8It0BZ26xcafFPhwXZcTh8SZ8m30xb9VfrKuJNCVi94xqbfyZikBbIcnO5vMxArTnZHudRlQzKOUc5wpd6VwrlEenGeb2pa-DyUj-2ZNnbUFvGUbxgS5TYtDTMx9HKN1NghPRqmnO91U1HU9UNJdOioVCtV1A1IG-BkW3-LJeRwfR1l7HQQO7TE0z8UFoWhdRfAFfRczvAhRBQCAn2XB9PnXRsf2bP8dzbFFVi7Hs+0lQchWcVRHGcNwqPBfQdB8O9-ToQNl3oVgIDQIjf23TI9jFJMKn2fYBR8NN9mUHBuw2KjKlqbtZyOThRAgOB5BOH4xPMxAAFoigWCKXWY2K4vBO82jAYKt2jfM0w49ZNHWSj3O7PxNKLIJjgVPFV0fbgUrNVsC1dJiEOWflclUU9TBciV827fkDlvYrcV0yAqpIiSBxHeo1HzfQaiohzFLMCjVOWbxcx5Q4+tKwTCSG8TMkMapyjBNlPFRTtTydZFL1MVk-BQjU8Iwq5ttCrJ8yyjiz0qBo9io086ohNzVB8ad1lcAcuJ4vjKpNELo0ysaqiWYEM3qNM8yysc3DWXxQbWwIgA */
  id: "sayPi",
  initial: "idle",
  states: {
    idle: {
      description: "Initial state.\nGentle pulsing animation.",
      entry: ["stopAllAnimations", "acquireMicrophone"],
      on: {
        "saypi:userSpeaking": {
          target: "userSpeaking"
        },
        "saypi:pause": {
          target: "paused",
          cond: "isSafari"
        },
        "saypi:piSpeaking": {
          target: "piSpeaking"
        }
      }
    },
    userSpeaking: {
      description: "User is speaking and being recorded by the microphone.\nWaveform animation.",
      entry: [{
        type: "startAnimation",
        params: {
          animation: "userSpeaking"
        }
      }, "activateTalkButton"],
      exit: [{
        type: "stopAnimation",
        params: {
          animation: "userSpeaking"
        }
      }, "deactivateTalkButton"],
      on: {
        "saypi:userFinishedSpeaking": {
          target: "transcribing",
          cond: "longEnoughForUpload"
        },
        "saypi:userStoppedSpeaking": {
          target: "idle",
          cond: "tooShortForUpload"
        },
        "saypi:transcribing": {
          target: "transcribing"
        }
      }
    },
    paused: {
      description: "Blocking action on Safari.\nUser must press play to hear Pi's response.\nBounce animation.",
      entry: [{
        type: "startAnimation",
        params: {
          animation: "paused"
        }
      }],
      exit: [{
        type: "stopAnimation",
        params: {
          animation: "paused"
        }
      }],
      on: {
        "saypi:play": {
          target: "loading",
          actions: "hidePlayButton"
        },
        "saypi:ready": {
          target: "paused",
          internal: true,
          description: "Enough audio has been buffered to start playback.",
          actions: "showPlayButton"
        }
      }
    },
    piSpeaking: {
      description: "Pi's synthesised speech audio is playing.\nPlayful animation.",
      entry: {
        type: "startAnimation",
        params: {
          animation: "piSpeaking"
        }
      },
      exit: {
        type: "stopAnimation",
        params: {
          animation: "piSpeaking"
        }
      },
      on: {
        "saypi:piStoppedSpeaking": {
          target: "idle"
        },
        "saypi:userSpeaking": {
          target: "userSpeaking"
        },
        "saypi:piFinishedSpeaking": {
          target: "idle"
        }
      }
    },
    transcribing: {
      description: "Transcribing audio to text.\nCard flip animation.",
      entry: [{
        type: "startAnimation",
        params: {
          animation: "transcribing"
        }
      }, "transcribeAudio"],
      exit: {
        type: "stopAnimation",
        params: {
          animation: "transcribing"
        }
      },
      on: {
        "saypi:transcribed": {
          target: "idle",
          actions: "handleTranscriptionResponse",
          description: "Successfully transcribed user audio to text."
        }
      }
    },
    loading: {
      description: "Pi's audio is loading.",
      entry: {
        type: "startAnimation",
        params: {
          animation: "loading"
        }
      },
      exit: {
        type: "stopAnimation",
        params: {
          animation: "loading"
        }
      },
      on: {
        "saypi:piSpeaking": {
          target: "piSpeaking"
        }
      }
    }
  },
  predictableActionArguments: true,
  preserveActionOrder: true
}, {
  actions: {
    stopAllAnimations: function stopAllAnimations(context, event) {
      _AnimationModule__WEBPACK_IMPORTED_MODULE_1__["default"].stopAllAnimations();
    },
    startAnimation: function startAnimation(context, event, _ref) {
      var action = _ref.action;
      _AnimationModule__WEBPACK_IMPORTED_MODULE_1__["default"].startAnimation(action.params.animation);
    },
    stopAnimation: function stopAnimation(context, event, _ref2) {
      var action = _ref2.action;
      _AnimationModule__WEBPACK_IMPORTED_MODULE_1__["default"].stopAnimation(action.params.animation);
    },
    transcribeAudio: function transcribeAudio(context, event) {
      console.log("transcribeAudio", event);
      var audioBlob = event.blob;
      (0,_TranscriptionModule__WEBPACK_IMPORTED_MODULE_3__.uploadAudio)(audioBlob);
    },
    handleTranscriptionResponse: function handleTranscriptionResponse(context, event) {
      console.log("handleTranscriptionResponse", event);
      var transcription = event.text;
      (0,_TranscriptionModule__WEBPACK_IMPORTED_MODULE_3__.handleTranscriptionResponse)(transcription);
    },
    showPlayButton: function showPlayButton(context, event) {
      _ButtonModule__WEBPACK_IMPORTED_MODULE_0__.buttonModule.showPlayButton();
    },
    hidePlayButton: function hidePlayButton(context, event) {
      _ButtonModule__WEBPACK_IMPORTED_MODULE_0__.buttonModule.hidePlayButton();
    },
    activateTalkButton: function activateTalkButton(context, event) {
      var talkButton = document.getElementById("saypi-talkButton");
      talkButton.classList.add("active"); // Add the active class (for Firefox on Android)
    },

    deactivateTalkButton: function deactivateTalkButton(context, event) {
      var talkButton = document.getElementById("saypi-talkButton");
      talkButton.classList.remove("active"); // Remove the active class (for Firefox on Android)
    },

    acquireMicrophone: function acquireMicrophone(context, event) {
      // warmup the microphone on idle in mobile view,
      // since there's no mouseover event to trigger it
      if ((0,_UserAgentModule__WEBPACK_IMPORTED_MODULE_2__.isMobileView)()) {
        _EventBus__WEBPACK_IMPORTED_MODULE_4__["default"].emit("audio:setupRecording");
      }
    }
  },
  services: {},
  guards: {
    tooShortForUpload: function tooShortForUpload(context, event) {
      console.log("tooShortForUpload", event);
      return event.duration < 1000;
    },
    longEnoughForUpload: function longEnoughForUpload(context, event) {
      return event.duration >= 1000;
    },
    isSafari: function isSafari(context, event) {
      return (0,_UserAgentModule__WEBPACK_IMPORTED_MODULE_2__.isSafari)();
    }
  },
  delays: {}
});

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

/* bounce animation to indicate Pi is paused awaiting permission to speak */
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
.outermost.paused {
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
.second.paused {
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
.third.paused {
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
.fourth.paused {
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
.fifth.paused {
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
.innermost.paused {
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
    fill: var(--original-color);
  }
  50% {
    opacity: 0.5;
    fill: rgb(245 238 223);
  }
}

.outermost.loading {
  --original-color: #e4f2d1;
  animation: heartbeat 2s infinite;
  animation-delay: 0s;
}

.second.loading {
  --original-color: #cce8b5;
  animation: heartbeat 2s infinite;
  animation-delay: 0.4s;
}

.third.loading {
  --original-color: #b3db95;
  animation: heartbeat 2s infinite;
  animation-delay: 0.8s;
}

.fourth.loading {
  --original-color: #9bd078;
  animation: heartbeat 2s infinite;
  animation-delay: 1.2s;
}

.fifth.loading {
  --original-color: #83c55c;
  animation: heartbeat 2s infinite;
  animation-delay: 1.6s;
}

.innermost.loading {
  --original-color: #428a2f;
  animation: heartbeat 2s infinite;
  animation-delay: 2s;
}
`, "",{"version":3,"sources":["webpack://./src/rectangles.css"],"names":[],"mappings":"AAAA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,sBAAsB;EACxB;AACF;AACA;EACE,sCAAsC;EACtC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,mCAAmC;EACnC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,kCAAkC;EAClC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,mCAAmC;EACnC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,kCAAkC;EAClC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,qBAAqB;EACvB;AACF;AACA;EACE,sCAAsC;EACtC,wBAAwB;AAC1B;;AAEA,2EAA2E;AAC3E;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,0BAA0B;EAC5B;EACA;IACE,0BAA0B;EAC5B;AACF;AACA;EACE,gCAAgC;EAChC,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,4BAA4B;EAC9B;EACA;IACE,6BAA6B;EAC/B;AACF;AACA;EACE,6BAA6B;EAC7B,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,4BAA4B;EAC9B;EACA;IACE,6BAA6B;EAC/B;AACF;AACA;EACE,4BAA4B;EAC5B,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,4BAA4B;EAC9B;EACA;IACE,6BAA6B;EAC/B;AACF;AACA;EACE,6BAA6B;EAC7B,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,4BAA4B;EAC9B;EACA;IACE,6BAA6B;EAC/B;AACF;AACA;EACE,4BAA4B;EAC5B,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,0BAA0B;EAC5B;EACA;IACE,4BAA4B;EAC9B;AACF;AACA;EACE,gCAAgC;EAChC,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA,iDAAiD;AACjD;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,uBAAuB;EACzB;EACA;IACE,qBAAqB;EACvB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,yCAAyC;EACzC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,oCAAoC;EACtC;EACA;IACE,mCAAmC;EACrC;EACA;IACE,oCAAoC;EACtC;AACF;AACA;EACE,sCAAsC;EACtC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,qCAAqC;EACvC;EACA;IACE,mCAAmC;EACrC;EACA;IACE,oCAAoC;EACtC;AACF;AACA;EACE,qCAAqC;EACrC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,oCAAoC;EACtC;EACA;IACE,mCAAmC;EACrC;EACA;IACE,oCAAoC;EACtC;AACF;AACA;EACE,sCAAsC;EACtC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,qCAAqC;EACvC;EACA;IACE,mCAAmC;EACrC;EACA;IACE,oCAAoC;EACtC;AACF;AACA;EACE,qCAAqC;EACrC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,oCAAoC;EACtC;EACA;IACE,mCAAmC;EACrC;EACA;IACE,oCAAoC;EACtC;AACF;AACA;EACE,yCAAyC;EACzC,wBAAwB;AAC1B;;AAEA,gDAAgD;AAChD;EACE;IACE;mDAC+C;EACjD;EACA;IACE;mDAC+C;EACjD;AACF;AACA,wCAAwC;AACxC;EACE;;IAEE,8BAA8B;EAChC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE;;IAEE,kCAAkC;EACpC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE;;IAEE,kCAAkC;EACpC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE;;IAEE,kCAAkC;EACpC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE;;IAEE,kCAAkC;EACpC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE;;IAEE,kCAAkC;EACpC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE,qDAAqD;AACvD;;AAEA;EACE,mDAAmD;AACrD;;AAEA;EACE,iDAAiD;AACnD;;AAEA;EACE,mDAAmD;AACrD;;AAEA;EACE,iDAAiD;AACnD;;AAEA;EACE,sDAAsD;AACxD;;AAEA,yEAAyE;AACzE;EACE;;IAEE,wBAAwB;IACxB,2BAA2B;EAC7B;EACA;IACE,0BAA0B;IAC1B,+BAA+B;EACjC;AACF;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,yCAAyC;AAC3C;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,yCAAyC;AAC3C;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,yCAAyC;AAC3C;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,yCAAyC;AAC3C;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,yCAAyC;AAC3C;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,uCAAuC;AACzC;;AAEA,6DAA6D;AAC7D;EACE;;IAEE,UAAU;IACV,2BAA2B;EAC7B;EACA;IACE,YAAY;IACZ,sBAAsB;EACxB;AACF;;AAEA;EACE,yBAAyB;EACzB,gCAAgC;EAChC,mBAAmB;AACrB;;AAEA;EACE,yBAAyB;EACzB,gCAAgC;EAChC,qBAAqB;AACvB;;AAEA;EACE,yBAAyB;EACzB,gCAAgC;EAChC,qBAAqB;AACvB;;AAEA;EACE,yBAAyB;EACzB,gCAAgC;EAChC,qBAAqB;AACvB;;AAEA;EACE,yBAAyB;EACzB,gCAAgC;EAChC,qBAAqB;AACvB;;AAEA;EACE,yBAAyB;EACzB,gCAAgC;EAChC,mBAAmB;AACrB","sourcesContent":["@keyframes pulse_outermost {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.92);\n  }\n}\n.outermost {\n  animation: pulse_outermost 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_second {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.856);\n  }\n}\n.second {\n  animation: pulse_second 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_third {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.792);\n  }\n}\n.third {\n  animation: pulse_third 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_fourth {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.728);\n  }\n}\n.fourth {\n  animation: pulse_fourth 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_fifth {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.664);\n  }\n}\n.fifth {\n  animation: pulse_fifth 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_innermost {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.6);\n  }\n}\n.innermost {\n  animation: pulse_innermost 5s infinite;\n  transform-origin: center;\n}\n\n/* bounce animation to indicate Pi is paused awaiting permission to speak */\n@keyframes bounce_outermost {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-5%);\n  }\n  60% {\n    transform: translateY(-3%);\n  }\n}\n.outermost.paused {\n  animation-name: bounce_outermost;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n@keyframes bounce_second {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-5.8%);\n  }\n  60% {\n    transform: translateY(-3.48%);\n  }\n}\n.second.paused {\n  animation-name: bounce_second;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n@keyframes bounce_third {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-6.6%);\n  }\n  60% {\n    transform: translateY(-3.96%);\n  }\n}\n.third.paused {\n  animation-name: bounce_third;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n@keyframes bounce_fourth {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-7.4%);\n  }\n  60% {\n    transform: translateY(-4.44%);\n  }\n}\n.fourth.paused {\n  animation-name: bounce_fourth;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n@keyframes bounce_fifth {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-8.2%);\n  }\n  60% {\n    transform: translateY(-4.92%);\n  }\n}\n.fifth.paused {\n  animation-name: bounce_fifth;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n@keyframes bounce_innermost {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-9%);\n  }\n  60% {\n    transform: translateY(-5.4%);\n  }\n}\n.innermost.paused {\n  animation-name: bounce_innermost;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n/* playful animation to indicate Pi is speaking */\n@keyframes speaking_outermost {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.995);\n  }\n  50% {\n    transform: scale(0.9);\n  }\n  75% {\n    transform: scale(0.895);\n  }\n}\n.outermost.piSpeaking {\n  animation: speaking_outermost 2s infinite;\n  transform-origin: center;\n}\n\n@keyframes speaking_second {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.98) rotate(-1deg);\n  }\n  50% {\n    transform: scale(0.87) rotate(0deg);\n  }\n  75% {\n    transform: scale(0.865) rotate(1deg);\n  }\n}\n.second.piSpeaking {\n  animation: speaking_second 2s infinite;\n  transform-origin: center;\n}\n\n@keyframes speaking_third {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.965) rotate(-2deg);\n  }\n  50% {\n    transform: scale(0.84) rotate(0deg);\n  }\n  75% {\n    transform: scale(0.835) rotate(2deg);\n  }\n}\n.third.piSpeaking {\n  animation: speaking_third 2s infinite;\n  transform-origin: center;\n}\n\n@keyframes speaking_fourth {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.95) rotate(-3deg);\n  }\n  50% {\n    transform: scale(0.81) rotate(0deg);\n  }\n  75% {\n    transform: scale(0.805) rotate(3deg);\n  }\n}\n.fourth.piSpeaking {\n  animation: speaking_fourth 2s infinite;\n  transform-origin: center;\n}\n\n@keyframes speaking_fifth {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.935) rotate(-4deg);\n  }\n  50% {\n    transform: scale(0.78) rotate(0deg);\n  }\n  75% {\n    transform: scale(0.775) rotate(4deg);\n  }\n}\n.fifth.piSpeaking {\n  animation: speaking_fifth 2s infinite;\n  transform-origin: center;\n}\n\n@keyframes speaking_innermost {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.92) rotate(-5deg);\n  }\n  50% {\n    transform: scale(0.75) rotate(0deg);\n  }\n  75% {\n    transform: scale(0.745) rotate(5deg);\n  }\n}\n.innermost.piSpeaking {\n  animation: speaking_innermost 2s infinite;\n  transform-origin: center;\n}\n\n/* wave animation to indicate user is speaking */\n@keyframes userSpeakingAnimation {\n  50% {\n    transform: scaleY(0.05) scaleX(var(--width-factor))\n      translateX(calc(-50% + var(--spread-amount)));\n  }\n  100% {\n    transform: scaleY(1) scaleX(var(--width-factor))\n      translateX(calc(-50% + var(--spread-amount)));\n  }\n}\n/* user speaking oscillation animation */\n@keyframes waveform_outermost {\n  0%,\n  100% {\n    transform: scaleY(1) scaleX(1);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.9) scaleX(0.9);\n  }\n}\n\n@keyframes waveform_second {\n  0%,\n  100% {\n    transform: scaleY(0.9) scaleX(0.9);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.8) scaleX(0.8);\n  }\n}\n\n@keyframes waveform_third {\n  0%,\n  100% {\n    transform: scaleY(0.8) scaleX(0.8);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.7) scaleX(0.7);\n  }\n}\n\n@keyframes waveform_fourth {\n  0%,\n  100% {\n    transform: scaleY(0.7) scaleX(0.7);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.6) scaleX(0.6);\n  }\n}\n\n@keyframes waveform_fifth {\n  0%,\n  100% {\n    transform: scaleY(0.6) scaleX(0.6);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.5) scaleX(0.5);\n  }\n}\n\n@keyframes waveform_innermost {\n  0%,\n  100% {\n    transform: scaleY(0.5) scaleX(0.5);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.4) scaleX(0.4);\n  }\n}\n\n.outermost.userSpeaking {\n  animation: waveform_outermost 0.7s infinite alternate;\n}\n\n.second.userSpeaking {\n  animation: waveform_second 0.65s infinite alternate;\n}\n\n.third.userSpeaking {\n  animation: waveform_third 0.6s infinite alternate;\n}\n\n.fourth.userSpeaking {\n  animation: waveform_fourth 0.55s infinite alternate;\n}\n\n.fifth.userSpeaking {\n  animation: waveform_fifth 0.5s infinite alternate;\n}\n\n.innermost.userSpeaking {\n  animation: waveform_innermost 0.45s infinite alternate;\n}\n\n/* flipcard animation to indicate Say, Pi is transcribing audio to text */\n@keyframes transcribingFlip {\n  0%,\n  100% {\n    transform: rotateY(0deg);\n    fill: var(--original-color);\n  }\n  50% {\n    transform: rotateY(180deg);\n    fill: var(--transcribing-color);\n  }\n}\n\n.outermost.transcribing {\n  --original-color: #e4f2d1;\n  --transcribing-color: #b3e0fe;\n  animation: transcribingFlip 1.5s infinite;\n}\n\n.second.transcribing {\n  --original-color: #cce8b5;\n  --transcribing-color: #89c2ff;\n  animation: transcribingFlip 1.6s infinite;\n}\n\n.third.transcribing {\n  --original-color: #b3db95;\n  --transcribing-color: #5fa4ff;\n  animation: transcribingFlip 1.7s infinite;\n}\n\n.fourth.transcribing {\n  --original-color: #9bd078;\n  --transcribing-color: #3586ff;\n  animation: transcribingFlip 1.8s infinite;\n}\n\n.fifth.transcribing {\n  --original-color: #83c55c;\n  --transcribing-color: #0b69e3;\n  animation: transcribingFlip 1.9s infinite;\n}\n\n.innermost.transcribing {\n  --original-color: #428a2f;\n  --transcribing-color: #0053bf;\n  animation: transcribingFlip 2s infinite;\n}\n\n/* heartbeat animation to indicate Pi is preparing to speak */\n@keyframes heartbeat {\n  0%,\n  100% {\n    opacity: 1;\n    fill: var(--original-color);\n  }\n  50% {\n    opacity: 0.5;\n    fill: rgb(245 238 223);\n  }\n}\n\n.outermost.loading {\n  --original-color: #e4f2d1;\n  animation: heartbeat 2s infinite;\n  animation-delay: 0s;\n}\n\n.second.loading {\n  --original-color: #cce8b5;\n  animation: heartbeat 2s infinite;\n  animation-delay: 0.4s;\n}\n\n.third.loading {\n  --original-color: #b3db95;\n  animation: heartbeat 2s infinite;\n  animation-delay: 0.8s;\n}\n\n.fourth.loading {\n  --original-color: #9bd078;\n  animation: heartbeat 2s infinite;\n  animation-delay: 1.2s;\n}\n\n.fifth.loading {\n  --original-color: #83c55c;\n  animation: heartbeat 2s infinite;\n  animation-delay: 1.6s;\n}\n\n.innermost.loading {\n  --original-color: #428a2f;\n  animation: heartbeat 2s infinite;\n  animation-delay: 2s;\n}\n"],"sourceRoot":""}]);
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

/***/ "./node_modules/events/events.js":
/*!***************************************!*\
  !*** ./node_modules/events/events.js ***!
  \***************************************/
/***/ ((module) => {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}


/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/AudioModule.js":
/*!******************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/AudioModule.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("// depends on injecting script (saypi.index.js) declaring the EventBus as a global variable\nconsole.log(\"AudioModule.js: EventBus\", window.EventBus);\nvar EventBus = window.EventBus;\n\n// audio output (Pi)\nvar audioElement = document.querySelector(\"audio\");\nif (!audioElement) {\n  console.error(\"Audio element not found!\");\n}\n\n// TODO: dedupe this function from EventModule.js\nfunction isSafari() {\n  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);\n}\naudioElement.preload = \"auto\"; // enable aggressive preloading of audio\nvar piAudioManager = {\n  isSpeaking: false,\n  audioElement: audioElement,\n  _userStarted: true,\n  // flag to indicate playback has been started by the user (true by default because user must request initial playback)\n  _isLoadCalled: false,\n  // flag to indicate if the load() method has been called on the audio element\n\n  isLoadCalled: function isLoadCalled() {\n    return this._isLoadCalled;\n  },\n  setIsLoadCalled: function setIsLoadCalled(value) {\n    this._isLoadCalled = value;\n  },\n  reload: function reload() {\n    if (!isSafari()) {\n      return;\n    }\n    this._userStarted = true; // set a flag to indicate playback has been started by the user\n    this.audioElement.load(); // reset for Safari\n    this.audioElement.play();\n  },\n  autoPlay: function autoPlay() {\n    if (!this._userStarted) {\n      this.audioElement.pause();\n      EventBus.emit(\"saypi:pause\");\n    }\n  },\n  stop: function stop() {\n    if (this.isSpeaking) {\n      this.audioElement.pause();\n    }\n    if (this.audioElement.duration && !this.audioElement.ended && this.audioElement.currentTime < this.audioElement.duration) {\n      this.audioElement.currentTime = this.audioElement.duration; // seek the audio to the end\n      this.audioElement.play(); // trigger the ended event\n    }\n  },\n\n  pause: function pause() {\n    this.audioElement.pause();\n  },\n  resume: function resume() {\n    this.audioElement.play();\n  },\n  playing: function playing() {\n    this.isSpeaking = true;\n  },\n  stopped: function stopped() {\n    this.isSpeaking = false;\n    this._userStarted = false;\n  }\n};\n\n// Intercept Autoplay Events (can't autoplay full audio on Safari)\naudioElement.addEventListener(\"play\", function () {\n  if (isSafari()) {\n    piAudioManager.autoPlay();\n  }\n});\naudioElement.addEventListener(\"loadstart\", function () {\n  if (isSafari()) {\n    // tell the state machine that Pi is ready to speak (while paused)\n    EventBus.emit(\"saypi:ready\");\n  }\n});\n\n// Event listeners for detecting when Pi is speaking\naudioElement.addEventListener(\"playing\", function () {\n  piAudioManager.playing();\n  EventBus.emit(\"saypi:piSpeaking\");\n});\naudioElement.addEventListener(\"pause\", function () {\n  piAudioManager.stopped();\n  EventBus.emit(\"saypi:piStoppedSpeaking\");\n});\naudioElement.addEventListener(\"ended\", function () {\n  piAudioManager.stopped();\n  EventBus.emit(\"saypi:piFinishedSpeaking\");\n});\n\n// audio input (user)\nvar audioDataChunks = [];\nvar audioMimeType = \"audio/webm;codecs=opus\";\n\n// Declare a global variable for the mediaRecorder\nvar mediaRecorder;\nvar threshold = 1000; // 1000 ms = 1 second, about the length of \"Hey, Pi\"\n\n// This function will be called when the 'dataavailable' event fires\nfunction handleDataAvailable(e) {\n  // Add the audio data chunk to the array\n  audioDataChunks.push(e.data);\n}\n\n// This function will be called when the 'stop' event fires\nfunction handleStop() {\n  // Create a Blob from the audio data chunks\n  var audioBlob = new Blob(audioDataChunks, {\n    type: audioMimeType\n  });\n\n  // Get the stop time and calculate the duration\n  var stopTime = Date.now();\n  var duration = stopTime - window.startTime;\n\n  // If the duration is greater than the threshold, upload the audio for transcription\n  if (duration >= threshold) {\n    // Upload the audio to the server for transcription\n    EventBus.emit(\"saypi:userFinishedSpeaking\", {\n      duration: duration,\n      blob: audioBlob\n    });\n  }\n\n  // Clear the array for the next recording\n  audioDataChunks = [];\n}\nfunction setupRecording(callback) {\n  if (mediaRecorder) {\n    return;\n  }\n\n  // Get a stream from the user's microphone\n  navigator.mediaDevices.getUserMedia({\n    audio: true\n  }).then(function (stream) {\n    if (!MediaRecorder.isTypeSupported(audioMimeType)) {\n      // use MP4 for Safari\n      audioMimeType = \"audio/mp4\";\n    }\n    // Create a new MediaRecorder object using the stream and specifying the MIME type\n    var options = {\n      mimeType: audioMimeType\n    };\n    mediaRecorder = new MediaRecorder(stream, options);\n\n    // Listen for the 'dataavailable' event\n    mediaRecorder.addEventListener(\"dataavailable\", handleDataAvailable);\n\n    // Listen for the 'stop' event\n    mediaRecorder.addEventListener(\"stop\", handleStop);\n  }).then(function () {\n    // Invoke the callback function\n    if (typeof callback === \"function\") {\n      callback();\n    }\n  })[\"catch\"](function (err) {\n    console.error(\"Error getting audio stream: \" + err);\n  });\n}\nfunction tearDownRecording() {\n  // Check if the MediaRecorder is set up\n  if (!mediaRecorder) {\n    return;\n  }\n\n  // Stop any ongoing recording\n  if (mediaRecorder.state === \"recording\") {\n    mediaRecorder.stop();\n  }\n\n  // Remove the MediaRecorder's event listeners\n  mediaRecorder.removeEventListener(\"dataavailable\", handleDataAvailable);\n  mediaRecorder.removeEventListener(\"stop\", handleStop);\n\n  // Clear the MediaRecorder variable\n  mediaRecorder = null;\n}\n\n// To request recording, other modules can dispatch a custom event audio:startRecording\nfunction startRecording() {\n  // Check if the MediaRecorder is set up\n  if (!mediaRecorder) {\n    setupRecording(startRecording);\n    return;\n  }\n  // Check if Pi is currently speaking and stop her audio\n  if (piAudioManager.isSpeaking) {\n    piAudioManager.pause();\n  }\n\n  // Start recording\n  mediaRecorder.start();\n\n  // Record the start time\n  window.startTime = Date.now();\n  EventBus.emit(\"saypi:userSpeaking\");\n}\n\n// To stop recording, other modules can dispatch a custom event audio:stopRecording\nfunction stopRecording() {\n  if (mediaRecorder && mediaRecorder.state === \"recording\") {\n    // Stop recording\n    mediaRecorder.stop();\n\n    // Record the stop time and calculate the duration\n    var stopTime = Date.now();\n    var duration = stopTime - window.startTime;\n\n    // If the duration is less than the threshold, don't upload the audio for transcription\n    if (duration < threshold) {\n      console.log(\"Recording was too short, not uploading for transcription\");\n      EventBus.emit(\"saypi:userStoppedSpeaking\", {\n        duration: duration\n      });\n      piAudioManager.resume();\n    } else {\n      piAudioManager.stop();\n    }\n  }\n}\n\n/* These events are used to control/pass requests to the audio module from other modules */\nfunction registerCustomAudioEventListeners() {\n  EventBus.on(\"audio:setupRecording\", function (e) {\n    setupRecording();\n  });\n  EventBus.on(\"audio:tearDownRecording\", function (e) {\n    tearDownRecording();\n  });\n  EventBus.on(\"audio:startRecording\", function (e) {\n    startRecording();\n  });\n  EventBus.on(\"audio:stopRecording\", function (e) {\n    stopRecording();\n  });\n  EventBus.on(\"audio:reload\", function (e) {\n    piAudioManager.reload();\n  });\n}\nregisterCustomAudioEventListeners();");

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

/***/ }),

/***/ "./node_modules/xstate/es/Actor.js":
/*!*****************************************!*\
  !*** ./node_modules/xstate/es/Actor.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IS_PRODUCTION: () => (/* binding */ IS_PRODUCTION)
/* harmony export */ });
var IS_PRODUCTION = "development" === 'production';




/***/ }),

/***/ "./node_modules/xstate/es/interpreter.js":
/*!***********************************************!*\
  !*** ./node_modules/xstate/es/interpreter.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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

/***/ "./node_modules/xstate/es/registry.js":
/*!********************************************!*\
  !*** ./node_modules/xstate/es/registry.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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

/***/ "./node_modules/xstate/es/serviceScope.js":
/*!************************************************!*\
  !*** ./node_modules/xstate/es/serviceScope.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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
/* harmony import */ var _EventBus_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EventBus.js */ "./src/EventBus.js");
/* harmony import */ var _EventModule_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./EventModule.js */ "./src/EventModule.js");
/* harmony import */ var _UserAgentModule_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./UserAgentModule.js */ "./src/UserAgentModule.js");
/* harmony import */ var _talkButton_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./talkButton.css */ "./src/talkButton.css");
/* harmony import */ var _mobile_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./mobile.scss */ "./src/mobile.scss");
/* harmony import */ var _rectangles_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./rectangles.css */ "./src/rectangles.css");







(function () {
  "use strict";

  var pageScript = (__webpack_require__(/*! raw-loader!./AudioModule.js */ "./node_modules/raw-loader/dist/cjs.js!./src/AudioModule.js")["default"]);
  (0,_UserAgentModule_js__WEBPACK_IMPORTED_MODULE_3__.addUserAgentFlags)();
  _EventModule_js__WEBPACK_IMPORTED_MODULE_2__["default"].init();
  setupEventBus();

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
            if ((0,_UserAgentModule_js__WEBPACK_IMPORTED_MODULE_3__.isMobileView)()) {
              _ButtonModule_js__WEBPACK_IMPORTED_MODULE_0__.buttonModule.createExitButton();
            }
            observer.disconnect();
            return;
          }
        }
      }
    }
  });
  function setupEventBus() {
    // Setting the correct context
    var context = window;
    if (GM_info.scriptHandler !== "Userscripts") {
      context = unsafeWindow;
    }
    context.EventBus = _EventBus_js__WEBPACK_IMPORTED_MODULE_1__["default"]; // Make the EventBus available to the page script
  }

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
    scriptElement.textContent = pageScript;
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
    var button = _ButtonModule_js__WEBPACK_IMPORTED_MODULE_0__.buttonModule.createButton("", function () {}); // The callback is empty for now, but you can add functionalities if needed.

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
    _ButtonModule_js__WEBPACK_IMPORTED_MODULE_0__.buttonModule.addTalkIcon(button);

    // Call the function to inject the script after the button has been added
    injectScript(registerAudioButtonEvents);
  }
  function registerAudioButtonEvents() {
    var button = document.getElementById("saypi-talkButton");

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2F5cGkudXNlci5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQXFCQSxlQUFlO0VBQUEsU0FBQUEsZ0JBQUE7SUFBQUMsZUFBQSxPQUFBRCxlQUFBO0VBQUE7RUFBQUUsWUFBQSxDQUFBRixlQUFBO0lBQUFHLEdBQUE7SUFBQUMsS0FBQSxFQVdsQyxTQUFBQyxlQUFzQkMsU0FBUyxFQUFFO01BQy9CLElBQUksQ0FBQ0MsbUJBQW1CLENBQUNELFNBQVMsQ0FBQztNQUVuQyxJQUFJRSxVQUFVLEdBQUdDLFFBQVEsQ0FBQ0MsZ0JBQWdCLENBQUMsSUFBSSxDQUFDQyxrQkFBa0IsQ0FBQztNQUNuRUgsVUFBVSxDQUFDSSxPQUFPLENBQUMsVUFBQ0MsSUFBSTtRQUFBLE9BQUtBLElBQUksQ0FBQ0MsU0FBUyxDQUFDQyxHQUFHLENBQUNULFNBQVMsQ0FBQztNQUFBLEVBQUM7SUFDN0Q7RUFBQztJQUFBSCxHQUFBO0lBQUFDLEtBQUEsRUFFRCxTQUFBWSxjQUFxQlYsU0FBUyxFQUFFO01BQzlCLElBQUlFLFVBQVUsR0FBR0MsUUFBUSxDQUFDQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUNDLGtCQUFrQixDQUFDO01BQ25FSCxVQUFVLENBQUNJLE9BQU8sQ0FBQyxVQUFDQyxJQUFJO1FBQUEsT0FBS0EsSUFBSSxDQUFDQyxTQUFTLENBQUNHLE1BQU0sQ0FBQ1gsU0FBUyxDQUFDO01BQUEsRUFBQztJQUNoRTtFQUFDO0lBQUFILEdBQUE7SUFBQUMsS0FBQSxFQUVELFNBQUFjLGtCQUFBLEVBQTJCO01BQUEsSUFBQUMsS0FBQTtNQUN6QixJQUFJLENBQUNDLG9CQUFvQixDQUFDUixPQUFPLENBQUMsVUFBQ04sU0FBUztRQUFBLE9BQzFDYSxLQUFJLENBQUNILGFBQWEsQ0FBQ1YsU0FBUyxDQUFDO01BQUEsQ0FDL0IsQ0FBQztJQUNIO0VBQUM7SUFBQUgsR0FBQTtJQUFBQyxLQUFBLEVBRUQsU0FBQUcsb0JBQTJCYyxhQUFhLEVBQUU7TUFBQSxJQUFBQyxNQUFBO01BQ3hDLElBQUksQ0FBQ0Ysb0JBQW9CLENBQUNSLE9BQU8sQ0FBQyxVQUFDTixTQUFTLEVBQUs7UUFDL0MsSUFBSUEsU0FBUyxLQUFLZSxhQUFhLEVBQUU7VUFDL0JDLE1BQUksQ0FBQ04sYUFBYSxDQUFDVixTQUFTLENBQUM7UUFDL0I7TUFDRixDQUFDLENBQUM7SUFDSjtFQUFDO0VBQUEsT0FBQU4sZUFBQTtBQUFBO0FBQUF1QixlQUFBLENBbkNrQnZCLGVBQWUsd0JBRWhDLDBEQUEwRDtBQUFBdUIsZUFBQSxDQUZ6Q3ZCLGVBQWUsMEJBR0osQ0FDNUIsU0FBUyxFQUNULFlBQVksRUFDWixjQUFjLEVBQ2QsY0FBYyxFQUNkLFFBQVEsQ0FDVDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNUOEQ7QUFDL0I7QUFDUztBQUNnQjtBQUN0QjtBQUNRO0FBQ0o7QUFBQSxJQUNwQmlDLFlBQVk7RUFDL0IsU0FBQUEsYUFBQSxFQUFjO0lBQUFoQyxlQUFBLE9BQUFnQyxZQUFBO0lBQ1osSUFBSSxDQUFDQyxVQUFVLEdBQUcsSUFBSTtJQUN0QixJQUFJLENBQUNDLEtBQUssR0FBR04sK0RBQW1CLENBQUNNLEtBQUs7SUFDdEM7SUFDQSxJQUFJLENBQUNDLHFCQUFxQixHQUFHLElBQUksQ0FBQ0EscUJBQXFCLENBQUNDLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDbEUsSUFBSSxDQUFDQyxtQkFBbUIsQ0FBQyxDQUFDO0VBQzVCO0VBQUNwQyxZQUFBLENBQUErQixZQUFBO0lBQUE5QixHQUFBO0lBQUFDLEtBQUEsRUFFRCxTQUFBa0Msb0JBQUEsRUFBc0I7TUFDcEJYLGlEQUFRLENBQUNZLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRU4sWUFBWSxDQUFDTyxnQkFBZ0IsQ0FBQztJQUNoRTs7SUFFQTtFQUFBO0lBQUFyQyxHQUFBO0lBQUFDLEtBQUEsRUFDQSxTQUFBcUMsYUFBYUMsS0FBSyxFQUFFQyxRQUFRLEVBQUU7TUFDNUIsSUFBTUMsTUFBTSxHQUFHbkMsUUFBUSxDQUFDb0MsYUFBYSxDQUFDLFFBQVEsQ0FBQztNQUMvQ0QsTUFBTSxDQUFDRSxXQUFXLEdBQUdKLEtBQUs7TUFDMUJFLE1BQU0sQ0FBQ0csT0FBTyxHQUFHSixRQUFRO01BQ3pCLE9BQU9DLE1BQU07SUFDZjs7SUFFQTtFQUFBO0lBQUF6QyxHQUFBO0lBQUFDLEtBQUEsRUFDQSxTQUFBNEMsWUFBWUosTUFBTSxFQUFFSyxNQUFNLEVBQUU7TUFDMUIsS0FBSyxJQUFJOUMsR0FBRyxJQUFJOEMsTUFBTSxFQUFFO1FBQ3RCLElBQUlBLE1BQU0sQ0FBQ0MsY0FBYyxDQUFDL0MsR0FBRyxDQUFDLEVBQUU7VUFDOUJ5QyxNQUFNLENBQUNPLEtBQUssQ0FBQ2hELEdBQUcsQ0FBQyxHQUFHOEMsTUFBTSxDQUFDOUMsR0FBRyxDQUFDO1FBQ2pDO01BQ0Y7SUFDRjtFQUFDO0lBQUFBLEdBQUE7SUFBQUMsS0FBQSxFQUVELFNBQUFnRCxZQUFZUixNQUFNLEVBQUU7TUFBQSxJQUFBekIsS0FBQTtNQUNsQixJQUFJLENBQUNrQyxpQkFBaUIsQ0FBQ1QsTUFBTSxDQUFDO01BRTlCVSxNQUFNLENBQUNDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDQyxXQUFXLENBQUMsWUFBTTtRQUN4RHJDLEtBQUksQ0FBQ2tDLGlCQUFpQixDQUFDVCxNQUFNLENBQUM7TUFDaEMsQ0FBQyxDQUFDO01BQ0YsSUFBSSxDQUFDYSxrQkFBa0IsQ0FBQ2IsTUFBTSxDQUFDO0lBQ2pDO0VBQUM7SUFBQXpDLEdBQUE7SUFBQUMsS0FBQSxFQUVELFNBQUFpRCxrQkFBa0JLLGFBQWEsRUFBRTtNQUMvQixJQUFJaEMsOERBQVksQ0FBQyxDQUFDLEVBQUU7UUFDbEJnQyxhQUFhLENBQUNDLFNBQVMsR0FBRzVCLHVEQUFhO01BQ3pDLENBQUMsTUFBTTtRQUNMMkIsYUFBYSxDQUFDQyxTQUFTLEdBQUczQixxREFBVztNQUN2QztJQUNGO0VBQUM7SUFBQTdCLEdBQUE7SUFBQUMsS0FBQSxFQUVELFNBQUFxRCxtQkFBbUJiLE1BQU0sRUFBRTtNQUFBLElBQUF0QixNQUFBO01BQ3pCLElBQU1zQyxVQUFVLEdBQUduRCxRQUFRLENBQUNvRCxlQUFlLENBQUMsQ0FBQzs7TUFFN0MsSUFBTUMsTUFBTSxHQUFHO1FBQUVDLFVBQVUsRUFBRSxJQUFJO1FBQUVDLGVBQWUsRUFBRSxDQUFDLE9BQU87TUFBRSxDQUFDO01BRS9ELElBQU1yQixRQUFRLEdBQUcsU0FBWEEsUUFBUUEsQ0FBSXNCLGFBQWEsRUFBRUMsUUFBUSxFQUFLO1FBQUEsSUFBQUMsU0FBQSxHQUFBQywwQkFBQSxDQUN2QkgsYUFBYTtVQUFBSSxLQUFBO1FBQUE7VUFBbEMsS0FBQUYsU0FBQSxDQUFBRyxDQUFBLE1BQUFELEtBQUEsR0FBQUYsU0FBQSxDQUFBSSxDQUFBLElBQUFDLElBQUEsR0FBb0M7WUFBQSxJQUEzQkMsUUFBUSxHQUFBSixLQUFBLENBQUFqRSxLQUFBO1lBQ2YsSUFBSXFFLFFBQVEsQ0FBQ0MsSUFBSSxLQUFLLFlBQVksRUFBRTtjQUNsQyxJQUFJRCxRQUFRLENBQUNFLGFBQWEsS0FBSyxPQUFPLEVBQUU7Z0JBQ3RDLElBQUlsRSxRQUFRLENBQUNvRCxlQUFlLENBQUMvQyxTQUFTLENBQUM4RCxRQUFRLENBQUMsYUFBYSxDQUFDLEVBQUU7a0JBQzlEO2tCQUNBdEQsTUFBSSxDQUFDK0IsaUJBQWlCLENBQUNULE1BQU0sQ0FBQztnQkFDaEMsQ0FBQyxNQUFNO2tCQUNMO2tCQUNBdEIsTUFBSSxDQUFDK0IsaUJBQWlCLENBQUNULE1BQU0sQ0FBQztnQkFDaEM7Y0FDRjtZQUNGO1VBQ0Y7UUFBQyxTQUFBaUMsR0FBQTtVQUFBVixTQUFBLENBQUFXLENBQUEsQ0FBQUQsR0FBQTtRQUFBO1VBQUFWLFNBQUEsQ0FBQVksQ0FBQTtRQUFBO01BQ0gsQ0FBQztNQUVELElBQU1iLFFBQVEsR0FBRyxJQUFJYyxnQkFBZ0IsQ0FBQ3JDLFFBQVEsQ0FBQzs7TUFFL0M7TUFDQXVCLFFBQVEsQ0FBQ2UsT0FBTyxDQUFDckIsVUFBVSxFQUFFRSxNQUFNLENBQUM7O01BRXBDO01BQ0E7SUFDRjs7SUFFQTtFQUFBO0lBQUEzRCxHQUFBO0lBQUFDLEtBQUEsRUF5QkEsU0FBQThFLGlCQUFBLEVBQW1CO01BQ2pCLElBQU14QyxLQUFLLEdBQUcsbUNBQW1DO01BQ2pELElBQU1FLE1BQU0sR0FBRyxJQUFJLENBQUNILFlBQVksQ0FBQyxFQUFFLEVBQUUsWUFBTTtRQUN6Q2hCLGdFQUFjLENBQUMsQ0FBQztNQUNsQixDQUFDLENBQUM7TUFDRm1CLE1BQU0sQ0FBQ3VDLEVBQUUsR0FBRyxrQkFBa0I7TUFDOUJ2QyxNQUFNLENBQUM4QixJQUFJLEdBQUcsUUFBUTtNQUN0QjlCLE1BQU0sQ0FBQ3dDLFNBQVMsR0FDZCx3RUFBd0U7TUFDMUV4QyxNQUFNLENBQUN5QyxZQUFZLENBQUMsWUFBWSxFQUFFM0MsS0FBSyxDQUFDO01BQ3hDRSxNQUFNLENBQUN5QyxZQUFZLENBQUMsT0FBTyxFQUFFM0MsS0FBSyxDQUFDO01BQ25DRSxNQUFNLENBQUNlLFNBQVMsR0FBRzdCLGlEQUFXO01BQzlCckIsUUFBUSxDQUFDNkUsSUFBSSxDQUFDQyxXQUFXLENBQUMzQyxNQUFNLENBQUM7TUFDakMsT0FBT0EsTUFBTTtJQUNmO0VBQUM7SUFBQXpDLEdBQUE7SUFBQUMsS0FBQSxFQUVELFNBQUFvRixpQkFBQSxFQUFtQjtNQUNqQixJQUFNOUMsS0FBSyxHQUFHLG9CQUFvQjtNQUNsQyxJQUFJLENBQUNSLFVBQVUsR0FBRyxJQUFJLENBQUNPLFlBQVksQ0FBQyxFQUFFLEVBQUUsWUFBTSxDQUFDLENBQUMsQ0FBQztNQUNqRCxJQUFJLENBQUNQLFVBQVUsQ0FBQ2lELEVBQUUsR0FBRyxrQkFBa0I7TUFDdkMsSUFBSSxDQUFDakQsVUFBVSxDQUFDd0MsSUFBSSxHQUFHLFFBQVE7TUFDL0IsSUFBSSxDQUFDeEMsVUFBVSxDQUFDa0QsU0FBUyxHQUFHLG9CQUFvQjtNQUNoRCxJQUFJLENBQUNsRCxVQUFVLENBQUNtRCxZQUFZLENBQUMsWUFBWSxFQUFFM0MsS0FBSyxDQUFDO01BQ2pELElBQUksQ0FBQ1IsVUFBVSxDQUFDbUQsWUFBWSxDQUFDLE9BQU8sRUFBRTNDLEtBQUssQ0FBQztNQUM1QyxJQUFJLENBQUNSLFVBQVUsQ0FBQ3VELGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUNyRCxxQkFBcUIsQ0FBQztNQUNyRTNCLFFBQVEsQ0FBQzZFLElBQUksQ0FBQ0MsV0FBVyxDQUFDLElBQUksQ0FBQ3JELFVBQVUsQ0FBQztNQUMxQyxPQUFPLElBQUksQ0FBQ0EsVUFBVTtJQUN4QjtFQUFDO0lBQUEvQixHQUFBO0lBQUFDLEtBQUEsRUFFRCxTQUFBc0YsZUFBQSxFQUFpQjtNQUNmLElBQUksQ0FBQyxJQUFJLENBQUN4RCxVQUFVLEVBQUU7UUFDcEIsSUFBSSxDQUFDc0QsZ0JBQWdCLENBQUMsQ0FBQztNQUN6QjtNQUNBLElBQUksQ0FBQ3RELFVBQVUsQ0FBQ3BCLFNBQVMsQ0FBQ0csTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUM1QztFQUFDO0lBQUFkLEdBQUE7SUFBQUMsS0FBQSxFQUVELFNBQUF1RixlQUFBLEVBQWlCO01BQ2YsSUFBSSxJQUFJLENBQUN6RCxVQUFVLEVBQUU7UUFDbkIsSUFBSSxDQUFDQSxVQUFVLENBQUNwQixTQUFTLENBQUNDLEdBQUcsQ0FBQyxRQUFRLENBQUM7TUFDekM7SUFDRjtFQUFDO0lBQUFaLEdBQUE7SUFBQUMsS0FBQSxFQUVELFNBQUFnQyxzQkFBQSxFQUF3QjtNQUN0QixJQUFJLENBQUNELEtBQUssQ0FBQ3lELElBQUksQ0FBQyxZQUFZLENBQUM7TUFDN0JqRSxpREFBUSxDQUFDa0UsSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUMvQjtFQUFDO0lBQUExRixHQUFBO0lBQUFDLEtBQUEsRUFyRUQsU0FBQTBGLG1CQUFBLEVBQTRCO01BQzFCLElBQU1DLFFBQVEsR0FBR3RGLFFBQVEsQ0FBQ3VGLGNBQWMsQ0FBQyxjQUFjLENBQUM7TUFFeEQsSUFBTUMsVUFBVSxHQUFHLElBQUlDLGFBQWEsQ0FBQyxTQUFTLEVBQUU7UUFDOUNDLE9BQU8sRUFBRSxJQUFJO1FBQ2JoRyxHQUFHLEVBQUUsT0FBTztRQUNaaUcsT0FBTyxFQUFFLEVBQUU7UUFDWEMsS0FBSyxFQUFFO01BQ1QsQ0FBQyxDQUFDO01BRUZOLFFBQVEsQ0FBQ08sYUFBYSxDQUFDTCxVQUFVLENBQUM7SUFDcEM7O0lBRUE7RUFBQTtJQUFBOUYsR0FBQTtJQUFBQyxLQUFBLEVBQ0EsU0FBQW9DLGlCQUFBLEVBQTBCO01BQ3hCLElBQU0rRCxVQUFVLEdBQUc5RixRQUFRLENBQUN1RixjQUFjLENBQUMsa0JBQWtCLENBQUM7TUFFOUQsSUFBSU8sVUFBVSxDQUFDQyxPQUFPLENBQUNDLFVBQVUsS0FBSyxPQUFPLEVBQUU7UUFDN0NDLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLHdCQUF3QixDQUFDO01BQ3ZDLENBQUMsTUFBTTtRQUNMMUUsWUFBWSxDQUFDNkQsa0JBQWtCLENBQUMsQ0FBQztNQUNuQztJQUNGO0VBQUM7RUFBQSxPQUFBN0QsWUFBQTtBQUFBLEtBa0RIO0FBdEppQztBQXVKMUIsSUFBTTJFLFlBQVksR0FBRyxJQUFJM0UsWUFBWSxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5Slo7QUFFbEMsaUVBQWUsSUFBSTRFLCtDQUFZLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0ZJO0FBQ3NCO0FBRTNELElBQU1DLGFBQWEsR0FBRyxvQkFBb0I7QUFDMUMsSUFBTUMscUJBQXFCLEdBQUcsMkJBQTJCO0FBQ3pELElBQU1DLHNCQUFzQixHQUFHLDRCQUE0QjtBQUMzRCxJQUFNQyxZQUFZLEdBQUcsb0JBQW9CO0FBQ3pDLElBQU1DLFdBQVcsR0FBRyxrQkFBa0I7QUFDdEMsSUFBTUMsbUJBQW1CLEdBQUcseUJBQXlCO0FBQ3JELElBQU1DLG9CQUFvQixHQUFHLDBCQUEwQjtBQUN2RCxJQUFNQyxLQUFLLEdBQUcsYUFBYTtBQUMzQixJQUFNQyxLQUFLLEdBQUcsYUFBYTtBQUMzQixJQUFNQyxJQUFJLEdBQUcsWUFBWTtBQUFDLElBRUwzRixXQUFXO0VBQUEsU0FBQUEsWUFBQTtJQUFBM0IsZUFBQSxPQUFBMkIsV0FBQTtFQUFBO0VBQUExQixZQUFBLENBQUEwQixXQUFBO0lBQUF6QixHQUFBO0lBQUFDLEtBQUEsRUFDOUIsU0FBQW9ILEtBQUEsRUFBYztNQUNaO01BQ0EsSUFBSSxDQUFDQywwQkFBMEIsQ0FBQzVGLCtEQUFtQixDQUFDTSxLQUFLLENBQUM7TUFDMUQ7SUFDRjtFQUFDO0lBQUFoQyxHQUFBO0lBQUFDLEtBQUEsRUFFRCxTQUFBc0gsUUFBQSxFQUFpQjtNQUNmO01BQ0FwRSxNQUFNLENBQUNxRSxtQkFBbUIsQ0FDeEIsbUJBQW1CLEVBQ25CLElBQUksQ0FBQ0MsMkJBQ1AsQ0FBQztJQUNIO0VBQUM7SUFBQXpILEdBQUE7SUFBQUMsS0FBQSxFQUVELFNBQUF5SCxlQUFzQkMsT0FBTyxFQUFFQyxJQUFJLEVBQUU7TUFDbkMsSUFBTUMsS0FBSyxHQUFHRCxJQUFJLENBQUNFLEtBQUssQ0FBQyxHQUFHLENBQUM7TUFDN0IsSUFBSUMsQ0FBQyxHQUFHLENBQUM7TUFFVCxJQUFNQyxRQUFRLEdBQUcsU0FBWEEsUUFBUUEsQ0FBQSxFQUFTO1FBQ3JCLElBQUlELENBQUMsR0FBR0YsS0FBSyxDQUFDSSxNQUFNLEVBQUU7VUFDcEJ4RyxXQUFXLENBQUN5RyxjQUFjLENBQUNQLE9BQU8sRUFBRUEsT0FBTyxDQUFDMUgsS0FBSyxHQUFHNEgsS0FBSyxDQUFDRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQztVQUNyRUkscUJBQXFCLENBQUNILFFBQVEsQ0FBQztRQUNqQyxDQUFDLE1BQU07VUFDTHhHLG9EQUFRLENBQUNrRSxJQUFJLENBQUMsa0JBQWtCLENBQUM7UUFDbkM7TUFDRixDQUFDO01BRURzQyxRQUFRLENBQUMsQ0FBQztJQUNaO0VBQUM7SUFBQWhJLEdBQUE7SUFBQUMsS0FBQSxFQUVELFNBQUFpSSxlQUFzQlAsT0FBTyxFQUFFMUgsS0FBSyxFQUFFO01BQ3BDLElBQUltSSxTQUFTLEdBQUdULE9BQU8sQ0FBQzFILEtBQUs7TUFDN0IwSCxPQUFPLENBQUMxSCxLQUFLLEdBQUdBLEtBQUs7TUFDckIsSUFBSW9JLEtBQUssR0FBRyxJQUFJQyxLQUFLLENBQUMsT0FBTyxFQUFFO1FBQUVDLE1BQU0sRUFBRVosT0FBTztRQUFFM0IsT0FBTyxFQUFFO01BQUssQ0FBQyxDQUFDO01BQ2xFO01BQ0FxQyxLQUFLLENBQUNHLFNBQVMsR0FBRyxJQUFJO01BQ3RCO01BQ0EsSUFBSUMsT0FBTyxHQUFHZCxPQUFPLENBQUNlLGFBQWE7TUFDbkMsSUFBSUQsT0FBTyxFQUFFO1FBQ1hBLE9BQU8sQ0FBQ0UsUUFBUSxDQUFDUCxTQUFTLENBQUM7TUFDN0I7TUFDQVQsT0FBTyxDQUFDeEIsYUFBYSxDQUFDa0MsS0FBSyxDQUFDO0lBQzlCO0VBQUM7SUFBQXJJLEdBQUE7SUFBQUMsS0FBQSxFQUVELFNBQUEySSxvQkFBQSxFQUE2QjtNQUMzQnBILG9EQUFRLENBQUNrRSxJQUFJLENBQUMsc0JBQXNCLENBQUM7SUFDdkM7RUFBQztJQUFBMUYsR0FBQTtJQUFBQyxLQUFBLEVBRUQsU0FBQTRJLGtCQUFBLEVBQTJCO01BQ3pCckgsb0RBQVEsQ0FBQ2tFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQztJQUN0QztFQUFDO0lBQUExRixHQUFBO0lBQUFDLEtBQUEsRUFFRCxTQUFBNkksc0JBQTZCckcsTUFBTSxFQUFFO01BQ25DO01BQ0FBLE1BQU0sQ0FBQzlCLFNBQVMsQ0FBQ29JLE1BQU0sQ0FBQyxZQUFZLENBQUM7TUFDckMsSUFBSXRHLE1BQU0sQ0FBQ3VHLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLE1BQU0sRUFBRTtRQUNyRHZHLE1BQU0sQ0FBQ3lDLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLENBQUM7UUFDL0NxQixPQUFPLENBQUNDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQztNQUNwQyxDQUFDLE1BQU07UUFDTC9ELE1BQU0sQ0FBQ3lDLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxNQUFNLENBQUM7UUFDOUNxQixPQUFPLENBQUNDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQztNQUNuQztJQUNGO0VBQUM7SUFBQXhHLEdBQUE7SUFBQUMsS0FBQSxFQUVELFNBQUFnSixxQkFBNEJ4RyxNQUFNLEVBQUVrQyxDQUFDLEVBQUU7TUFDckNBLENBQUMsQ0FBQ3VFLGNBQWMsQ0FBQyxDQUFDO01BQ2xCMUgsb0RBQVEsQ0FBQ2tFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztJQUN2QztFQUFDO0lBQUExRixHQUFBO0lBQUFDLEtBQUEsRUFFRCxTQUFBa0osbUJBQTBCMUcsTUFBTSxFQUFFO01BQ2hDakIsb0RBQVEsQ0FBQ2tFLElBQUksQ0FBQyxxQkFBcUIsQ0FBQztJQUN0QztFQUFDO0lBQUExRixHQUFBO0lBQUFDLEtBQUEsRUFFRCxTQUFBbUosK0JBQXNDM0csTUFBTSxFQUFFO01BQzVDO01BQ0FBLE1BQU0sQ0FBQzZDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxZQUFNO1FBQzFDOUQsb0RBQVEsQ0FBQ2tFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztNQUN2QyxDQUFDLENBQUM7TUFDRmpELE1BQU0sQ0FBQzZDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxZQUFNO1FBQzFDOUQsb0RBQVEsQ0FBQ2tFLElBQUksQ0FBQyx5QkFBeUIsQ0FBQztNQUMxQyxDQUFDLENBQUM7TUFDRnZDLE1BQU0sQ0FBQ21DLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxZQUFNO1FBQzVDOUQsb0RBQVEsQ0FBQ2tFLElBQUksQ0FBQyx5QkFBeUIsQ0FBQztNQUMxQyxDQUFDLENBQUM7TUFDRmpELE1BQU0sQ0FBQzZDLGdCQUFnQixDQUFDLGFBQWEsRUFBRSxZQUFNO1FBQzNDOUQsb0RBQVEsQ0FBQ2tFLElBQUksQ0FBQyx5QkFBeUIsQ0FBQztNQUMxQyxDQUFDLENBQUM7SUFDSjtFQUFDO0lBQUExRixHQUFBO0lBQUFDLEtBQUEsRUFFRCxTQUFBcUgsMkJBQWtDdEYsS0FBSyxFQUFFO01BQ3ZDUixvREFBUSxDQUFDWSxFQUFFLENBQUN1RSxhQUFhLEVBQUUsWUFBTTtRQUMvQjNFLEtBQUssQ0FBQ3lELElBQUksQ0FBQ2tCLGFBQWEsQ0FBQztNQUMzQixDQUFDLENBQUM7TUFFRixDQUFDQyxxQkFBcUIsRUFBRUMsc0JBQXNCLENBQUMsQ0FBQ3BHLE9BQU8sQ0FBQyxVQUFDNEksU0FBUyxFQUFLO1FBQ3JFN0gsb0RBQVEsQ0FBQ1ksRUFBRSxDQUFDaUgsU0FBUyxFQUFFLFVBQUNDLE1BQU0sRUFBSztVQUNqQyxJQUFJQSxNQUFNLEVBQUU7WUFDVnRILEtBQUssQ0FBQ3lELElBQUksQ0FBQThELGFBQUE7Y0FBR2hGLElBQUksRUFBRThFO1lBQVMsR0FBS0MsTUFBTSxDQUFFLENBQUM7VUFDNUMsQ0FBQyxNQUFNO1lBQ0wvQyxPQUFPLENBQUNpRCxJQUFJLGFBQUFDLE1BQUEsQ0FBYUosU0FBUyxzQkFBbUIsQ0FBQztVQUN4RDtRQUNGLENBQUMsQ0FBQztNQUNKLENBQUMsQ0FBQztNQUVGN0gsb0RBQVEsQ0FBQ1ksRUFBRSxDQUFDMEUsWUFBWSxFQUFFLFlBQU07UUFDOUI5RSxLQUFLLENBQUN5RCxJQUFJLENBQUNxQixZQUFZLENBQUM7TUFDMUIsQ0FBQyxDQUFDO01BRUYsQ0FBQ0MsV0FBVyxFQUFFQyxtQkFBbUIsRUFBRUMsb0JBQW9CLENBQUMsQ0FBQ3hHLE9BQU8sQ0FDOUQsVUFBQzRJLFNBQVMsRUFBSztRQUNiN0gsb0RBQVEsQ0FBQ1ksRUFBRSxDQUFDaUgsU0FBUyxFQUFFLFlBQU07VUFDM0JySCxLQUFLLENBQUN5RCxJQUFJLENBQUM0RCxTQUFTLENBQUM7UUFDdkIsQ0FBQyxDQUFDO01BQ0osQ0FDRixDQUFDO01BRUQsQ0FBQ25DLEtBQUssRUFBRUMsS0FBSyxFQUFFQyxJQUFJLENBQUMsQ0FBQzNHLE9BQU8sQ0FBQyxVQUFDNEksU0FBUyxFQUFLO1FBQzFDN0gsb0RBQVEsQ0FBQ1ksRUFBRSxDQUFDaUgsU0FBUyxFQUFFLFlBQU07VUFDM0JySCxLQUFLLENBQUN5RCxJQUFJLENBQUM0RCxTQUFTLENBQUM7UUFDdkIsQ0FBQyxDQUFDO01BQ0osQ0FBQyxDQUFDO0lBQ0o7O0lBRUE7RUFBQTtJQUFBckosR0FBQTtJQUFBQyxLQUFBLEVBRUEsU0FBQXlKLGVBQUEsRUFBd0I7TUFDdEIsSUFBSUMsUUFBUSxHQUFHLEtBQUs7TUFFcEJySixRQUFRLENBQUNnRixnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsVUFBQytDLEtBQUssRUFBSztRQUM5QyxJQUFJQSxLQUFLLENBQUN1QixPQUFPLElBQUl2QixLQUFLLENBQUN3QixJQUFJLEtBQUssT0FBTyxJQUFJLENBQUNGLFFBQVEsRUFBRTtVQUN4REEsUUFBUSxHQUFHLElBQUk7VUFDZm5JLG9EQUFRLENBQUNrRSxJQUFJLENBQUMsc0JBQXNCLENBQUM7UUFDdkM7TUFDRixDQUFDLENBQUM7TUFFRnBGLFFBQVEsQ0FBQ2dGLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFDK0MsS0FBSyxFQUFLO1FBQzVDLElBQUlzQixRQUFRLElBQUl0QixLQUFLLENBQUN3QixJQUFJLEtBQUssT0FBTyxFQUFFO1VBQ3RDRixRQUFRLEdBQUcsS0FBSztVQUNoQm5JLG9EQUFRLENBQUNrRSxJQUFJLENBQUMscUJBQXFCLENBQUM7UUFDdEM7TUFDRixDQUFDLENBQUM7SUFDSjtFQUFDO0VBQUEsT0FBQWpFLFdBQUE7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM1SmdDO0FBQ1c7O0FBRTlDO0FBQ0E7QUFDQTtBQUZBLElBR01DLG1CQUFtQixnQkFBQTNCLFlBQUEsQ0FDdkIsU0FBQTJCLG9CQUFBLEVBQWM7RUFBQTVCLGVBQUEsT0FBQTRCLG1CQUFBO0VBQ1osSUFBSSxDQUFDTSxLQUFLLEdBQUc4SCxpREFBUyxDQUFDQyx1REFBTyxDQUFDLENBQUNDLFlBQVksQ0FBQyxVQUFDQyxLQUFLLEVBQUs7SUFDdEQxRCxPQUFPLENBQUNDLEdBQUcsMkJBQUFpRCxNQUFBLENBQTJCUSxLQUFLLENBQUNoSyxLQUFLLENBQUUsQ0FBQztFQUN0RCxDQUFDLENBQUM7RUFDRixJQUFJLENBQUMrQixLQUFLLENBQUNrSSxLQUFLLENBQUMsQ0FBQztBQUNwQixDQUFDLEdBR0g7QUFDQSxpRUFBZSxJQUFJeEksbUJBQW1CLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hCbUI7QUFDUDtBQUNmO0FBQ007QUFFM0MsSUFBTWlDLE1BQU0sR0FBRztFQUNid0csWUFBWSxFQUFFQyxzQkFBMEI7RUFDeENHLFlBQVksRUFBRUgsc0JBQTBCSTtBQUMxQyxDQUFDO0FBRU0sU0FBU0MsV0FBV0EsQ0FBQ0MsU0FBUyxFQUFFO0VBQ3JDO0VBQ0EsSUFBSUMsUUFBUSxHQUFHLElBQUlDLFFBQVEsQ0FBQyxDQUFDO0VBQzdCLElBQUlDLGFBQWEsR0FBRyxZQUFZO0VBQ2hDLElBQUlILFNBQVMsQ0FBQ25HLElBQUksS0FBSyxXQUFXLEVBQUU7SUFDbENzRyxhQUFhLEdBQUcsV0FBVztFQUM3QjtFQUNBO0VBQ0FGLFFBQVEsQ0FBQ0csTUFBTSxDQUFDLE9BQU8sRUFBRUosU0FBUyxFQUFFRyxhQUFhLENBQUM7RUFDbEQ7RUFDQSxJQUFJRSxRQUFRLEdBQUdDLFNBQVMsQ0FBQ0QsUUFBUTtFQUNqQztFQUNBRSxLQUFLLENBQUN0SCxNQUFNLENBQUM0RyxZQUFZLEdBQUcsdUJBQXVCLEdBQUdRLFFBQVEsRUFBRTtJQUM5REcsTUFBTSxFQUFFLE1BQU07SUFDZC9GLElBQUksRUFBRXdGO0VBQ1IsQ0FBQyxDQUFDLENBQ0NRLElBQUksQ0FBQyxVQUFVQyxRQUFRLEVBQUU7SUFDeEIsSUFBSSxDQUFDQSxRQUFRLENBQUNDLEVBQUUsRUFBRTtNQUNoQixNQUFNQyxLQUFLLENBQUNGLFFBQVEsQ0FBQ0csVUFBVSxDQUFDO0lBQ2xDO0lBQ0EsT0FBT0gsUUFBUSxDQUFDSSxJQUFJLENBQUMsQ0FBQztFQUN4QixDQUFDLENBQUMsQ0FDREwsSUFBSSxDQUFDLFVBQVVNLFlBQVksRUFBRTtJQUM1Qi9KLCtEQUFtQixDQUFDTSxLQUFLLENBQUN5RCxJQUFJLENBQUMsbUJBQW1CLEVBQUU7TUFDbERtQyxJQUFJLEVBQUU2RCxZQUFZLENBQUM3RDtJQUNyQixDQUFDLENBQUM7RUFDSixDQUFDLENBQUMsU0FDSSxDQUFDLFVBQVU4RCxLQUFLLEVBQUU7SUFDdEJuRixPQUFPLENBQUNtRixLQUFLLENBQUMsa0NBQWtDLEVBQUVBLEtBQUssQ0FBQztJQUN4RDtJQUNBLElBQUk5RixRQUFRLEdBQUd0RixRQUFRLENBQUN1RixjQUFjLENBQUMsY0FBYyxDQUFDO0lBQ3RERCxRQUFRLENBQUMzRixLQUFLLEdBQ1osNkVBQTZFO0VBQ2pGLENBQUMsQ0FBQztBQUNOO0FBRU8sU0FBU3dILDJCQUEyQkEsQ0FBQ2tFLFVBQVUsRUFBRTtFQUN0RHBGLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLGNBQWMsR0FBR21GLFVBQVUsQ0FBQztFQUN4QyxJQUFNL0YsUUFBUSxHQUFHdEYsUUFBUSxDQUFDdUYsY0FBYyxDQUFDLGNBQWMsQ0FBQztFQUN4RCxJQUFJdEUsaUVBQVksQ0FBQyxDQUFDLEVBQUU7SUFDbEI7SUFDQSxJQUFJb0ssVUFBVSxDQUFDMUQsTUFBTSxHQUFHLElBQUksRUFBRTtNQUM1QjBELFVBQVUsR0FBR0EsVUFBVSxDQUFDQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUc7TUFDL0NyRixPQUFPLENBQUNpRCxJQUFJLENBQ1YsOEZBQThGLEdBQzVGbUMsVUFBVSxDQUFDQyxTQUFTLENBQUMsR0FBRyxDQUM1QixDQUFDO0lBQ0g7SUFDQW5LLHVEQUFXLENBQUN5RyxjQUFjLENBQUN0QyxRQUFRLEVBQUUrRixVQUFVLENBQUM7SUFDaERuSyxvREFBUSxDQUFDa0UsSUFBSSxDQUFDLGtCQUFrQixDQUFDO0VBQ25DLENBQUMsTUFBTTtJQUNMakUsdURBQVcsQ0FBQ2lHLGNBQWMsQ0FBQzlCLFFBQVEsRUFBRStGLFVBQVUsR0FBRyxHQUFHLENBQUM7RUFDeEQ7QUFDRjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvREEsSUFBSUUsY0FBYyxDQUFDLENBQUM7O0FBRWIsU0FBU3RLLFlBQVlBLENBQUEsRUFBRztFQUM3QixJQUFJc0ssY0FBYyxFQUFFO0lBQ2xCLE9BQU9BLGNBQWMsS0FBSyxRQUFRO0VBQ3BDO0VBRUEsT0FBTzFJLE1BQU0sQ0FBQ0MsVUFBVSxDQUFDLG9CQUFvQixDQUFDLENBQUMwSSxPQUFPO0FBQ3hEOztBQUVBO0FBQ08sU0FBU0MsUUFBUUEsQ0FBQSxFQUFHO0VBQ3pCLE9BQU8sZ0NBQWdDLENBQUNDLElBQUksQ0FBQ2hCLFNBQVMsQ0FBQ2lCLFNBQVMsQ0FBQztBQUNuRTtBQUNPLFNBQVMzSyxjQUFjQSxDQUFBLEVBQUc7RUFDL0J1SyxjQUFjLEdBQUcsU0FBUyxDQUFDLENBQUM7O0VBRTVCLElBQU1sRSxPQUFPLEdBQUdySCxRQUFRLENBQUNvRCxlQUFlO0VBQ3hDaUUsT0FBTyxDQUFDaEgsU0FBUyxDQUFDRyxNQUFNLENBQUMsYUFBYSxDQUFDO0FBQ3pDO0FBQ08sU0FBU29MLGlCQUFpQkEsQ0FBQSxFQUFHO0VBQ2xDLElBQUlDLGdCQUFnQixHQUNsQixTQUFTLENBQUNILElBQUksQ0FBQ2hCLFNBQVMsQ0FBQ2lCLFNBQVMsQ0FBQyxJQUFJLFNBQVMsQ0FBQ0QsSUFBSSxDQUFDaEIsU0FBUyxDQUFDaUIsU0FBUyxDQUFDO0VBQzVFLElBQU10RSxPQUFPLEdBQUdySCxRQUFRLENBQUNvRCxlQUFlO0VBQ3hDLElBQUl5SSxnQkFBZ0IsRUFBRTtJQUNwQjtJQUNBeEUsT0FBTyxDQUFDaEgsU0FBUyxDQUFDQyxHQUFHLENBQUMsaUJBQWlCLENBQUM7RUFDMUM7RUFFQSxJQUFJVyxZQUFZLENBQUMsQ0FBQyxFQUFFO0lBQ2xCb0csT0FBTyxDQUFDaEgsU0FBUyxDQUFDQyxHQUFHLENBQUMsYUFBYSxDQUFDO0VBQ3RDLENBQUMsTUFBTTtJQUNMK0csT0FBTyxDQUFDaEgsU0FBUyxDQUFDRyxNQUFNLENBQUMsYUFBYSxDQUFDO0VBQ3pDO0FBQ0Y7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEM4QztBQUNQO0FBQ1M7QUFDVztBQUk1QjtBQUNHO0FBRTNCLElBQU1pSixPQUFPLEdBQUdxQyxxREFBYSxDQUNsQztFQUNFO0VBQ0FwSCxFQUFFLEVBQUUsT0FBTztFQUNYcUgsT0FBTyxFQUFFLE1BQU07RUFDZkMsTUFBTSxFQUFFO0lBQ05DLElBQUksRUFBRTtNQUNKQyxXQUFXLEVBQUUsMkNBQTJDO01BQ3hEQyxLQUFLLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxtQkFBbUIsQ0FBQztNQUNqRHJLLEVBQUUsRUFBRTtRQUNGLG9CQUFvQixFQUFFO1VBQ3BCbUcsTUFBTSxFQUFFO1FBQ1YsQ0FBQztRQUNELGFBQWEsRUFBRTtVQUNiQSxNQUFNLEVBQUUsUUFBUTtVQUNoQm1FLElBQUksRUFBRTtRQUNSLENBQUM7UUFDRCxrQkFBa0IsRUFBRTtVQUNsQm5FLE1BQU0sRUFBRTtRQUNWO01BQ0Y7SUFDRixDQUFDO0lBQ0RvRSxZQUFZLEVBQUU7TUFDWkgsV0FBVyxFQUNULDZFQUE2RTtNQUUvRUMsS0FBSyxFQUFFLENBQ0w7UUFDRWxJLElBQUksRUFBRSxnQkFBZ0I7UUFDdEJxSSxNQUFNLEVBQUU7VUFDTnpNLFNBQVMsRUFBRTtRQUNiO01BQ0YsQ0FBQyxFQUNELG9CQUFvQixDQUNyQjtNQUVEME0sSUFBSSxFQUFFLENBQ0o7UUFDRXRJLElBQUksRUFBRSxlQUFlO1FBQ3JCcUksTUFBTSxFQUFFO1VBQ056TSxTQUFTLEVBQUU7UUFDYjtNQUNGLENBQUMsRUFDRCxzQkFBc0IsQ0FDdkI7TUFFRGlDLEVBQUUsRUFBRTtRQUNGLDRCQUE0QixFQUFFO1VBQzVCbUcsTUFBTSxFQUFFLGNBQWM7VUFDdEJtRSxJQUFJLEVBQUU7UUFDUixDQUFDO1FBQ0QsMkJBQTJCLEVBQUU7VUFDM0JuRSxNQUFNLEVBQUUsTUFBTTtVQUNkbUUsSUFBSSxFQUFFO1FBQ1IsQ0FBQztRQUNELG9CQUFvQixFQUFFO1VBQ3BCbkUsTUFBTSxFQUFFO1FBQ1Y7TUFDRjtJQUNGLENBQUM7SUFDRHVFLE1BQU0sRUFBRTtNQUNOTixXQUFXLEVBQ1QsNEZBQTRGO01BQzlGQyxLQUFLLEVBQUUsQ0FDTDtRQUNFbEksSUFBSSxFQUFFLGdCQUFnQjtRQUN0QnFJLE1BQU0sRUFBRTtVQUNOek0sU0FBUyxFQUFFO1FBQ2I7TUFDRixDQUFDLENBQ0Y7TUFDRDBNLElBQUksRUFBRSxDQUNKO1FBQ0V0SSxJQUFJLEVBQUUsZUFBZTtRQUNyQnFJLE1BQU0sRUFBRTtVQUNOek0sU0FBUyxFQUFFO1FBQ2I7TUFDRixDQUFDLENBQ0Y7TUFDRGlDLEVBQUUsRUFBRTtRQUNGLFlBQVksRUFBRTtVQUNabUcsTUFBTSxFQUFFLFNBQVM7VUFDakJ3RSxPQUFPLEVBQUU7UUFDWCxDQUFDO1FBRUQsYUFBYSxFQUFFO1VBQ2J4RSxNQUFNLEVBQUUsUUFBUTtVQUNoQnlFLFFBQVEsRUFBRSxJQUFJO1VBQ2RSLFdBQVcscURBQXFEO1VBQ2hFTyxPQUFPLEVBQUU7UUFDWDtNQUNGO0lBQ0YsQ0FBQztJQUNERSxVQUFVLEVBQUU7TUFDVlQsV0FBVyxFQUNULCtEQUErRDtNQUNqRUMsS0FBSyxFQUFFO1FBQ0xsSSxJQUFJLEVBQUUsZ0JBQWdCO1FBQ3RCcUksTUFBTSxFQUFFO1VBQ056TSxTQUFTLEVBQUU7UUFDYjtNQUNGLENBQUM7TUFDRDBNLElBQUksRUFBRTtRQUNKdEksSUFBSSxFQUFFLGVBQWU7UUFDckJxSSxNQUFNLEVBQUU7VUFDTnpNLFNBQVMsRUFBRTtRQUNiO01BQ0YsQ0FBQztNQUNEaUMsRUFBRSxFQUFFO1FBQ0YseUJBQXlCLEVBQUU7VUFDekJtRyxNQUFNLEVBQUU7UUFDVixDQUFDO1FBQ0Qsb0JBQW9CLEVBQUU7VUFDcEJBLE1BQU0sRUFBRTtRQUNWLENBQUM7UUFDRCwwQkFBMEIsRUFBRTtVQUMxQkEsTUFBTSxFQUFFO1FBQ1Y7TUFDRjtJQUNGLENBQUM7SUFDRDJFLFlBQVksRUFBRTtNQUNaVixXQUFXLEVBQUUsbURBQW1EO01BQ2hFQyxLQUFLLEVBQUUsQ0FDTDtRQUNFbEksSUFBSSxFQUFFLGdCQUFnQjtRQUN0QnFJLE1BQU0sRUFBRTtVQUNOek0sU0FBUyxFQUFFO1FBQ2I7TUFDRixDQUFDLEVBQ0QsaUJBQWlCLENBQ2xCO01BQ0QwTSxJQUFJLEVBQUU7UUFDSnRJLElBQUksRUFBRSxlQUFlO1FBQ3JCcUksTUFBTSxFQUFFO1VBQ056TSxTQUFTLEVBQUU7UUFDYjtNQUNGLENBQUM7TUFDRGlDLEVBQUUsRUFBRTtRQUNGLG1CQUFtQixFQUFFO1VBQ25CbUcsTUFBTSxFQUFFLE1BQU07VUFDZHdFLE9BQU8sRUFBRSw2QkFBNkI7VUFDdENQLFdBQVcsRUFBRTtRQUNmO01BQ0Y7SUFDRixDQUFDO0lBQ0RXLE9BQU8sRUFBRTtNQUNQWCxXQUFXLEVBQUUsd0JBQXdCO01BQ3JDQyxLQUFLLEVBQUU7UUFDTGxJLElBQUksRUFBRSxnQkFBZ0I7UUFDdEJxSSxNQUFNLEVBQUU7VUFDTnpNLFNBQVMsRUFBRTtRQUNiO01BQ0YsQ0FBQztNQUNEME0sSUFBSSxFQUFFO1FBQ0p0SSxJQUFJLEVBQUUsZUFBZTtRQUNyQnFJLE1BQU0sRUFBRTtVQUNOek0sU0FBUyxFQUFFO1FBQ2I7TUFDRixDQUFDO01BQ0RpQyxFQUFFLEVBQUU7UUFDRixrQkFBa0IsRUFBRTtVQUNsQm1HLE1BQU0sRUFBRTtRQUNWO01BQ0Y7SUFDRjtFQUNGLENBQUM7RUFDRDZFLDBCQUEwQixFQUFFLElBQUk7RUFDaENDLG1CQUFtQixFQUFFO0FBQ3ZCLENBQUMsRUFDRDtFQUNFTixPQUFPLEVBQUU7SUFDUGhNLGlCQUFpQixFQUFFLFNBQUFBLGtCQUFDdU0sT0FBTyxFQUFFakYsS0FBSyxFQUFLO01BQ3JDeEksd0RBQWUsQ0FBQ2tCLGlCQUFpQixDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVEYixjQUFjLEVBQUUsU0FBQUEsZUFBQ29OLE9BQU8sRUFBRWpGLEtBQUssRUFBQWtGLElBQUEsRUFBaUI7TUFBQSxJQUFiQyxNQUFNLEdBQUFELElBQUEsQ0FBTkMsTUFBTTtNQUN2QzNOLHdEQUFlLENBQUNLLGNBQWMsQ0FBQ3NOLE1BQU0sQ0FBQ1osTUFBTSxDQUFDek0sU0FBUyxDQUFDO0lBQ3pELENBQUM7SUFFRFUsYUFBYSxFQUFFLFNBQUFBLGNBQUN5TSxPQUFPLEVBQUVqRixLQUFLLEVBQUFvRixLQUFBLEVBQWlCO01BQUEsSUFBYkQsTUFBTSxHQUFBQyxLQUFBLENBQU5ELE1BQU07TUFDdEMzTix3REFBZSxDQUFDZ0IsYUFBYSxDQUFDMk0sTUFBTSxDQUFDWixNQUFNLENBQUN6TSxTQUFTLENBQUM7SUFDeEQsQ0FBQztJQUVEdU4sZUFBZSxFQUFFLFNBQUFBLGdCQUFDSixPQUFPLEVBQUVqRixLQUFLLEVBQUs7TUFDbkM5QixPQUFPLENBQUNDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRTZCLEtBQUssQ0FBQztNQUNyQyxJQUFNcUMsU0FBUyxHQUFHckMsS0FBSyxDQUFDc0YsSUFBSTtNQUM1QmxELGlFQUFXLENBQUNDLFNBQVMsQ0FBQztJQUN4QixDQUFDO0lBRURqRCwyQkFBMkIsRUFBRSxTQUFBQSw0QkFBQzZGLE9BQU8sRUFBRWpGLEtBQUssRUFBSztNQUMvQzlCLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLDZCQUE2QixFQUFFNkIsS0FBSyxDQUFDO01BQ2pELElBQU11RixhQUFhLEdBQUd2RixLQUFLLENBQUNULElBQUk7TUFDaENILGlGQUEyQixDQUFDbUcsYUFBYSxDQUFDO0lBQzVDLENBQUM7SUFFRHJJLGNBQWMsRUFBRSxTQUFBQSxlQUFDK0gsT0FBTyxFQUFFakYsS0FBSyxFQUFLO01BQ2xDNUIsdURBQVksQ0FBQ2xCLGNBQWMsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFREMsY0FBYyxFQUFFLFNBQUFBLGVBQUM4SCxPQUFPLEVBQUVqRixLQUFLLEVBQUs7TUFDbEM1Qix1REFBWSxDQUFDakIsY0FBYyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVEcUksa0JBQWtCLEVBQUUsU0FBQUEsbUJBQUNQLE9BQU8sRUFBRWpGLEtBQUssRUFBSztNQUN0QyxJQUFNakMsVUFBVSxHQUFHOUYsUUFBUSxDQUFDdUYsY0FBYyxDQUFDLGtCQUFrQixDQUFDO01BQzlETyxVQUFVLENBQUN6RixTQUFTLENBQUNDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7O0lBRURrTixvQkFBb0IsRUFBRSxTQUFBQSxxQkFBQ1IsT0FBTyxFQUFFakYsS0FBSyxFQUFLO01BQ3hDLElBQU1qQyxVQUFVLEdBQUc5RixRQUFRLENBQUN1RixjQUFjLENBQUMsa0JBQWtCLENBQUM7TUFDOURPLFVBQVUsQ0FBQ3pGLFNBQVMsQ0FBQ0csTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDekMsQ0FBQzs7SUFFRGlOLGlCQUFpQixFQUFFLFNBQUFBLGtCQUFDVCxPQUFPLEVBQUVqRixLQUFLLEVBQUs7TUFDckM7TUFDQTtNQUNBLElBQUk5Ryw4REFBWSxDQUFDLENBQUMsRUFBRTtRQUNsQkMsaURBQVEsQ0FBQ2tFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztNQUN2QztJQUNGO0VBQ0YsQ0FBQztFQUNEc0ksUUFBUSxFQUFFLENBQUMsQ0FBQztFQUNaQyxNQUFNLEVBQUU7SUFDTkMsaUJBQWlCLEVBQUUsU0FBQUEsa0JBQUNaLE9BQU8sRUFBRWpGLEtBQUssRUFBSztNQUNyQzlCLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLG1CQUFtQixFQUFFNkIsS0FBSyxDQUFDO01BQ3ZDLE9BQU9BLEtBQUssQ0FBQzhGLFFBQVEsR0FBRyxJQUFJO0lBQzlCLENBQUM7SUFFREMsbUJBQW1CLEVBQUUsU0FBQUEsb0JBQUNkLE9BQU8sRUFBRWpGLEtBQUssRUFBSztNQUN2QyxPQUFPQSxLQUFLLENBQUM4RixRQUFRLElBQUksSUFBSTtJQUMvQixDQUFDO0lBRURwQyxRQUFRLEVBQUUsU0FBQUEsU0FBQ3VCLE9BQU8sRUFBRWpGLEtBQUssRUFBSztNQUM1QixPQUFPMEQsMERBQVEsQ0FBQyxDQUFDO0lBQ25CO0VBQ0YsQ0FBQztFQUNEc0MsTUFBTSxFQUFFLENBQUM7QUFDWCxDQUNGLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3hQRDtBQUMwRztBQUNqQjtBQUN6Riw4QkFBOEIsbUZBQTJCLENBQUMsNEZBQXFDO0FBQy9GO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLHFGQUFxRixNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sWUFBWSxNQUFNLFNBQVMsWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssU0FBUyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxTQUFTLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFNBQVMsWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssU0FBUyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxTQUFTLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxZQUFZLE1BQU0sTUFBTSxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssTUFBTSxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssTUFBTSxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssTUFBTSxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssTUFBTSxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssTUFBTSxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxPQUFPLFlBQVksTUFBTSxLQUFLLEtBQUssT0FBTyxNQUFNLEtBQUssS0FBSyxPQUFPLE1BQU0sS0FBSyxZQUFZLE1BQU0sTUFBTSxZQUFZLE1BQU0sTUFBTSxZQUFZLE1BQU0sTUFBTSxLQUFLLE1BQU0sWUFBWSxNQUFNLE1BQU0sWUFBWSxNQUFNLE1BQU0sS0FBSyxNQUFNLFlBQVksTUFBTSxNQUFNLFlBQVksTUFBTSxNQUFNLEtBQUssTUFBTSxZQUFZLE1BQU0sTUFBTSxZQUFZLE1BQU0sTUFBTSxLQUFLLE1BQU0sWUFBWSxNQUFNLE1BQU0sWUFBWSxNQUFNLE1BQU0sS0FBSyxNQUFNLFlBQVksTUFBTSxNQUFNLFlBQVksTUFBTSxNQUFNLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLFlBQVksTUFBTSxNQUFNLFlBQVksYUFBYSxNQUFNLEtBQUssWUFBWSxhQUFhLE1BQU0sTUFBTSxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxZQUFZLE1BQU0sTUFBTSxVQUFVLFlBQVksTUFBTSxLQUFLLFVBQVUsWUFBWSxNQUFNLE1BQU0sS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFlBQVksYUFBYSxhQUFhLHNEQUFz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SSxDQUFDVCx1REFBVyxDQUNoRCxDQUFDO0lBQ0RnQixNQUFNLENBQUM2QyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUU7TUFBQSxPQUNsQzdELHVEQUFXLENBQUNxSCxxQkFBcUIsQ0FBQ3JHLE1BQU0sQ0FBQztJQUFBLENBQzNDLENBQUM7SUFDREEsTUFBTSxDQUFDNkMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLFVBQUNYLENBQUM7TUFBQSxPQUN0Q2xELHVEQUFXLENBQUN3SCxvQkFBb0IsQ0FBQ3hHLE1BQU0sRUFBRWtDLENBQUMsQ0FBQztJQUFBLENBQzdDLENBQUM7SUFDRGxDLE1BQU0sQ0FBQzZDLGdCQUFnQixDQUFDLFVBQVUsRUFBRTtNQUFBLE9BQ2xDN0QsdURBQVcsQ0FBQzBILGtCQUFrQixDQUFDMUcsTUFBTSxDQUFDO0lBQUEsQ0FDeEMsQ0FBQztJQUVEaEIsdURBQVcsQ0FBQzJILDhCQUE4QixDQUFDM0csTUFBTSxDQUFDO0lBQ2xEaEIsdURBQVcsQ0FBQ2lJLGNBQWMsQ0FBQyxDQUFDO0VBQzlCOztFQUVBO0VBQ0EzRixRQUFRLENBQUNlLE9BQU8sQ0FBQ3hFLFFBQVEsRUFBRTtJQUFFbVEsU0FBUyxFQUFFLElBQUk7SUFBRUMsT0FBTyxFQUFFO0VBQUssQ0FBQyxDQUFDO0FBQ2hFLENBQUMsRUFBRSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9BbmltYXRpb25Nb2R1bGUuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9CdXR0b25Nb2R1bGUuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9FdmVudEJ1cy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL0V2ZW50TW9kdWxlLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvU3RhdGVNYWNoaW5lU2VydmljZS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL1RyYW5zY3JpcHRpb25Nb2R1bGUuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9Vc2VyQWdlbnRNb2R1bGUuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9zYXlwaVN0YXRlTWFjaGluZS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3JlY3RhbmdsZXMuY3NzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvdGFsa0J1dHRvbi5jc3MiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9tb2JpbGUuc2NzcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvQXVkaW9Nb2R1bGUuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9leGl0LnN2ZyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3JlY3RhbmdsZXMuc3ZnIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvd2F2ZWZvcm0uc3ZnIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvcmVjdGFuZ2xlcy5jc3M/MDM2MiIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3RhbGtCdXR0b24uY3NzPzA3ZjUiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9tb2JpbGUuc2Nzcz9mMjNlIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvQWN0b3IuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvTWFjaGluZS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9TdGF0ZS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9TdGF0ZU5vZGUuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvX3ZpcnR1YWwvX3RzbGliLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL2FjdGlvblR5cGVzLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL2FjdGlvbnMuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvYmVoYXZpb3JzLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL2NvbnN0YW50cy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9kZXZUb29scy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9lbnZpcm9ubWVudC5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9pbnRlcnByZXRlci5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9pbnZva2VVdGlscy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9yZWdpc3RyeS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9zY2hlZHVsZXIuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvc2VydmljZVNjb3BlLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL3N0YXRlVXRpbHMuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvdHlwZXMuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvc2F5cGkuaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQW5pbWF0aW9uTW9kdWxlIHtcbiAgc3RhdGljIHJlY3RhbmdsZXNTZWxlY3RvciA9XG4gICAgXCIub3V0ZXJtb3N0LCAuc2Vjb25kLCAudGhpcmQsIC5mb3VydGgsIC5maWZ0aCwgLmlubmVybW9zdFwiO1xuICBzdGF0aWMgdGFsa0J1dHRvbkFuaW1hdGlvbnMgPSBbXG4gICAgXCJsb2FkaW5nXCIsXG4gICAgXCJwaVNwZWFraW5nXCIsXG4gICAgXCJ1c2VyU3BlYWtpbmdcIixcbiAgICBcInRyYW5zY3JpYmluZ1wiLFxuICAgIFwicGF1c2VkXCIsXG4gIF07XG5cbiAgc3RhdGljIHN0YXJ0QW5pbWF0aW9uKGFuaW1hdGlvbikge1xuICAgIHRoaXMuc3RvcE90aGVyQW5pbWF0aW9ucyhhbmltYXRpb24pO1xuXG4gICAgbGV0IHJlY3RhbmdsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMucmVjdGFuZ2xlc1NlbGVjdG9yKTtcbiAgICByZWN0YW5nbGVzLmZvckVhY2goKHJlY3QpID0+IHJlY3QuY2xhc3NMaXN0LmFkZChhbmltYXRpb24pKTtcbiAgfVxuXG4gIHN0YXRpYyBzdG9wQW5pbWF0aW9uKGFuaW1hdGlvbikge1xuICAgIGxldCByZWN0YW5nbGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLnJlY3RhbmdsZXNTZWxlY3Rvcik7XG4gICAgcmVjdGFuZ2xlcy5mb3JFYWNoKChyZWN0KSA9PiByZWN0LmNsYXNzTGlzdC5yZW1vdmUoYW5pbWF0aW9uKSk7XG4gIH1cblxuICBzdGF0aWMgc3RvcEFsbEFuaW1hdGlvbnMoKSB7XG4gICAgdGhpcy50YWxrQnV0dG9uQW5pbWF0aW9ucy5mb3JFYWNoKChhbmltYXRpb24pID0+XG4gICAgICB0aGlzLnN0b3BBbmltYXRpb24oYW5pbWF0aW9uKVxuICAgICk7XG4gIH1cblxuICBzdGF0aWMgc3RvcE90aGVyQW5pbWF0aW9ucyhrZWVwQW5pbWF0aW9uKSB7XG4gICAgdGhpcy50YWxrQnV0dG9uQW5pbWF0aW9ucy5mb3JFYWNoKChhbmltYXRpb24pID0+IHtcbiAgICAgIGlmIChhbmltYXRpb24gIT09IGtlZXBBbmltYXRpb24pIHtcbiAgICAgICAgdGhpcy5zdG9wQW5pbWF0aW9uKGFuaW1hdGlvbik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IGV4aXRNb2JpbGVNb2RlLCBpc01vYmlsZVZpZXcgfSBmcm9tIFwiLi9Vc2VyQWdlbnRNb2R1bGVcIjtcbmltcG9ydCBFdmVudEJ1cyBmcm9tIFwiLi9FdmVudEJ1c1wiO1xuaW1wb3J0IEV2ZW50TW9kdWxlIGZyb20gXCIuL0V2ZW50TW9kdWxlLmpzXCI7XG5pbXBvcnQgU3RhdGVNYWNoaW5lU2VydmljZSBmcm9tIFwiLi9TdGF0ZU1hY2hpbmVTZXJ2aWNlLmpzXCI7XG5pbXBvcnQgZXhpdEljb25TVkcgZnJvbSBcIi4vZXhpdC5zdmdcIjtcbmltcG9ydCByZWN0YW5nbGVzU1ZHIGZyb20gXCIuL3JlY3RhbmdsZXMuc3ZnXCI7XG5pbXBvcnQgdGFsa0ljb25TVkcgZnJvbSBcIi4vd2F2ZWZvcm0uc3ZnXCI7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCdXR0b25Nb2R1bGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnBsYXlCdXR0b24gPSBudWxsO1xuICAgIHRoaXMuYWN0b3IgPSBTdGF0ZU1hY2hpbmVTZXJ2aWNlLmFjdG9yO1xuICAgIC8vIEJpbmRpbmcgbWV0aG9kcyB0byB0aGUgY3VycmVudCBpbnN0YW5jZVxuICAgIHRoaXMuaGFuZGxlUGxheUJ1dHRvbkNsaWNrID0gdGhpcy5oYW5kbGVQbGF5QnV0dG9uQ2xpY2suYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlZ2lzdGVyT3RoZXJFdmVudHMoKTtcbiAgfVxuXG4gIHJlZ2lzdGVyT3RoZXJFdmVudHMoKSB7XG4gICAgRXZlbnRCdXMub24oXCJzYXlwaTphdXRvU3VibWl0XCIsIEJ1dHRvbk1vZHVsZS5oYW5kbGVBdXRvU3VibWl0KTtcbiAgfVxuXG4gIC8vIEZ1bmN0aW9uIHRvIGNyZWF0ZSBhIG5ldyBidXR0b25cbiAgY3JlYXRlQnV0dG9uKGxhYmVsLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgYnV0dG9uLnRleHRDb250ZW50ID0gbGFiZWw7XG4gICAgYnV0dG9uLm9uY2xpY2sgPSBjYWxsYmFjaztcbiAgICByZXR1cm4gYnV0dG9uO1xuICB9XG5cbiAgLy8gRnVuY3Rpb24gdG8gc3R5bGUgYSBnaXZlbiBidXR0b25cbiAgc3R5bGVCdXR0b24oYnV0dG9uLCBzdHlsZXMpIHtcbiAgICBmb3IgKGxldCBrZXkgaW4gc3R5bGVzKSB7XG4gICAgICBpZiAoc3R5bGVzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgYnV0dG9uLnN0eWxlW2tleV0gPSBzdHlsZXNba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhZGRUYWxrSWNvbihidXR0b24pIHtcbiAgICB0aGlzLnVwZGF0ZUljb25Db250ZW50KGJ1dHRvbik7XG5cbiAgICB3aW5kb3cubWF0Y2hNZWRpYShcIihtYXgtd2lkdGg6IDc2OHB4KVwiKS5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZUljb25Db250ZW50KGJ1dHRvbik7XG4gICAgfSk7XG4gICAgdGhpcy5zZXR1cENsYXNzT2JzZXJ2ZXIoYnV0dG9uKTtcbiAgfVxuXG4gIHVwZGF0ZUljb25Db250ZW50KGljb25Db250YWluZXIpIHtcbiAgICBpZiAoaXNNb2JpbGVWaWV3KCkpIHtcbiAgICAgIGljb25Db250YWluZXIuaW5uZXJIVE1MID0gcmVjdGFuZ2xlc1NWRztcbiAgICB9IGVsc2Uge1xuICAgICAgaWNvbkNvbnRhaW5lci5pbm5lckhUTUwgPSB0YWxrSWNvblNWRztcbiAgICB9XG4gIH1cblxuICBzZXR1cENsYXNzT2JzZXJ2ZXIoYnV0dG9uKSB7XG4gICAgY29uc3QgdGFyZ2V0Tm9kZSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDsgLy8gVGhlIDxodG1sPiBlbGVtZW50XG5cbiAgICBjb25zdCBjb25maWcgPSB7IGF0dHJpYnV0ZXM6IHRydWUsIGF0dHJpYnV0ZUZpbHRlcjogW1wiY2xhc3NcIl0gfTtcblxuICAgIGNvbnN0IGNhbGxiYWNrID0gKG11dGF0aW9uc0xpc3QsIG9ic2VydmVyKSA9PiB7XG4gICAgICBmb3IgKGxldCBtdXRhdGlvbiBvZiBtdXRhdGlvbnNMaXN0KSB7XG4gICAgICAgIGlmIChtdXRhdGlvbi50eXBlID09PSBcImF0dHJpYnV0ZXNcIikge1xuICAgICAgICAgIGlmIChtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lID09PSBcImNsYXNzXCIpIHtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwibW9iaWxlLXZpZXdcIikpIHtcbiAgICAgICAgICAgICAgLy8gJ21vYmlsZS12aWV3JyBjbGFzcyB3YXMgYWRkZWRcbiAgICAgICAgICAgICAgdGhpcy51cGRhdGVJY29uQ29udGVudChidXR0b24pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gJ21vYmlsZS12aWV3JyBjbGFzcyB3YXMgcmVtb3ZlZFxuICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUljb25Db250ZW50KGJ1dHRvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoY2FsbGJhY2spO1xuXG4gICAgLy8gU3RhcnQgb2JzZXJ2aW5nIHRoZSB0YXJnZXQgbm9kZSBmb3IgY29uZmlndXJlZCBtdXRhdGlvbnNcbiAgICBvYnNlcnZlci5vYnNlcnZlKHRhcmdldE5vZGUsIGNvbmZpZyk7XG5cbiAgICAvLyBMYXRlciwgeW91IGNhbiBzdG9wIG9ic2VydmluZyBieSBjYWxsaW5nOlxuICAgIC8vIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgfVxuXG4gIC8vIFNpbXVsYXRlIGFuIFwiRW50ZXJcIiBrZXlwcmVzcyBldmVudCBvbiBhIGZvcm1cbiAgc3RhdGljIHNpbXVsYXRlRm9ybVN1Ym1pdCgpIHtcbiAgICBjb25zdCB0ZXh0YXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F5cGktcHJvbXB0XCIpO1xuXG4gICAgY29uc3QgZW50ZXJFdmVudCA9IG5ldyBLZXlib2FyZEV2ZW50KFwia2V5ZG93blwiLCB7XG4gICAgICBidWJibGVzOiB0cnVlLFxuICAgICAga2V5OiBcIkVudGVyXCIsXG4gICAgICBrZXlDb2RlOiAxMyxcbiAgICAgIHdoaWNoOiAxMyxcbiAgICB9KTtcblxuICAgIHRleHRhcmVhLmRpc3BhdGNoRXZlbnQoZW50ZXJFdmVudCk7XG4gIH1cblxuICAvLyBGdW5jdGlvbiB0byBoYW5kbGUgYXV0by1zdWJtaXQgYmFzZWQgb24gdGhlIGJ1dHRvbidzIGRhdGEgYXR0cmlidXRlXG4gIHN0YXRpYyBoYW5kbGVBdXRvU3VibWl0KCkge1xuICAgIGNvbnN0IHRhbGtCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNheXBpLXRhbGtCdXR0b25cIik7XG5cbiAgICBpZiAodGFsa0J1dHRvbi5kYXRhc2V0LmF1dG9zdWJtaXQgPT09IFwiZmFsc2VcIikge1xuICAgICAgY29uc29sZS5sb2coXCJBdXRvc3VibWl0IGlzIGRpc2FibGVkXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBCdXR0b25Nb2R1bGUuc2ltdWxhdGVGb3JtU3VibWl0KCk7XG4gICAgfVxuICB9XG5cbiAgY3JlYXRlRXhpdEJ1dHRvbigpIHtcbiAgICBjb25zdCBsYWJlbCA9IFwiRXhpdCBWb2ljZS1Db250cm9sbGVkIE1vYmlsZSBNb2RlXCI7XG4gICAgY29uc3QgYnV0dG9uID0gdGhpcy5jcmVhdGVCdXR0b24oXCJcIiwgKCkgPT4ge1xuICAgICAgZXhpdE1vYmlsZU1vZGUoKTtcbiAgICB9KTtcbiAgICBidXR0b24uaWQgPSBcInNheXBpLWV4aXRCdXR0b25cIjtcbiAgICBidXR0b24udHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgYnV0dG9uLmNsYXNzTmFtZSA9XG4gICAgICBcImV4aXQtYnV0dG9uIGZpeGVkIHJvdW5kZWQtZnVsbCBiZy1jcmVhbS01NTAgZW5hYmxlZDpob3ZlcjpiZy1jcmVhbS02NTBcIjtcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBsYWJlbCk7XG4gICAgYnV0dG9uLnNldEF0dHJpYnV0ZShcInRpdGxlXCIsIGxhYmVsKTtcbiAgICBidXR0b24uaW5uZXJIVE1MID0gZXhpdEljb25TVkc7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChidXR0b24pO1xuICAgIHJldHVybiBidXR0b247XG4gIH1cblxuICBjcmVhdGVQbGF5QnV0dG9uKCkge1xuICAgIGNvbnN0IGxhYmVsID0gXCJIZWFyIFBpJ3MgcmVzcG9uc2VcIjtcbiAgICB0aGlzLnBsYXlCdXR0b24gPSB0aGlzLmNyZWF0ZUJ1dHRvbihcIlwiLCAoKSA9PiB7fSk7XG4gICAgdGhpcy5wbGF5QnV0dG9uLmlkID0gXCJzYXlwaS1wbGF5QnV0dG9uXCI7XG4gICAgdGhpcy5wbGF5QnV0dG9uLnR5cGUgPSBcImJ1dHRvblwiO1xuICAgIHRoaXMucGxheUJ1dHRvbi5jbGFzc05hbWUgPSBcImhpZGRlbiBwbGF5LWJ1dHRvblwiO1xuICAgIHRoaXMucGxheUJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIGxhYmVsKTtcbiAgICB0aGlzLnBsYXlCdXR0b24uc2V0QXR0cmlidXRlKFwidGl0bGVcIiwgbGFiZWwpO1xuICAgIHRoaXMucGxheUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5oYW5kbGVQbGF5QnV0dG9uQ2xpY2spO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5wbGF5QnV0dG9uKTtcbiAgICByZXR1cm4gdGhpcy5wbGF5QnV0dG9uO1xuICB9XG5cbiAgc2hvd1BsYXlCdXR0b24oKSB7XG4gICAgaWYgKCF0aGlzLnBsYXlCdXR0b24pIHtcbiAgICAgIHRoaXMuY3JlYXRlUGxheUJ1dHRvbigpO1xuICAgIH1cbiAgICB0aGlzLnBsYXlCdXR0b24uY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgfVxuXG4gIGhpZGVQbGF5QnV0dG9uKCkge1xuICAgIGlmICh0aGlzLnBsYXlCdXR0b24pIHtcbiAgICAgIHRoaXMucGxheUJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZVBsYXlCdXR0b25DbGljaygpIHtcbiAgICB0aGlzLmFjdG9yLnNlbmQoXCJzYXlwaTpwbGF5XCIpO1xuICAgIEV2ZW50QnVzLmVtaXQoXCJhdWRpbzpyZWxvYWRcIik7XG4gIH1cbn1cblxuLy8gU2luZ2xldG9uXG5leHBvcnQgY29uc3QgYnV0dG9uTW9kdWxlID0gbmV3IEJ1dHRvbk1vZHVsZSgpO1xuIiwiaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tIFwiZXZlbnRzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiIsImltcG9ydCBFdmVudEJ1cyBmcm9tIFwiLi9FdmVudEJ1cy5qc1wiO1xuaW1wb3J0IFN0YXRlTWFjaGluZVNlcnZpY2UgZnJvbSBcIi4vU3RhdGVNYWNoaW5lU2VydmljZS5qc1wiO1xuXG5jb25zdCBVU0VSX1NQRUFLSU5HID0gXCJzYXlwaTp1c2VyU3BlYWtpbmdcIjtcbmNvbnN0IFVTRVJfU1RPUFBFRF9TUEVBS0lORyA9IFwic2F5cGk6dXNlclN0b3BwZWRTcGVha2luZ1wiO1xuY29uc3QgVVNFUl9GSU5JU0hFRF9TUEVBS0lORyA9IFwic2F5cGk6dXNlckZpbmlzaGVkU3BlYWtpbmdcIjtcbmNvbnN0IFRSQU5TQ1JJQklORyA9IFwic2F5cGk6dHJhbnNjcmliaW5nXCI7XG5jb25zdCBQSV9TUEVBS0lORyA9IFwic2F5cGk6cGlTcGVha2luZ1wiO1xuY29uc3QgUElfU1RPUFBFRF9TUEVBS0lORyA9IFwic2F5cGk6cGlTdG9wcGVkU3BlYWtpbmdcIjtcbmNvbnN0IFBJX0ZJTklTSEVEX1NQRUFLSU5HID0gXCJzYXlwaTpwaUZpbmlzaGVkU3BlYWtpbmdcIjtcbmNvbnN0IFBBVVNFID0gXCJzYXlwaTpwYXVzZVwiO1xuY29uc3QgUkVBRFkgPSBcInNheXBpOnJlYWR5XCI7XG5jb25zdCBQTEFZID0gXCJzYXlwaTpwbGF5XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50TW9kdWxlIHtcbiAgc3RhdGljIGluaXQoKSB7XG4gICAgLy8gQWxsIHRoZSBldmVudCBsaXN0ZW5lcnMgY2FuIGJlIGFkZGVkIGhlcmVcbiAgICB0aGlzLnJlZ2lzdGVyU3RhdGVNYWNoaW5lRXZlbnRzKFN0YXRlTWFjaGluZVNlcnZpY2UuYWN0b3IpO1xuICAgIC8vIEFueSBvdGhlciBpbml0aWFsaXphdGlvbnMuLi5cbiAgfVxuXG4gIHN0YXRpYyBjbGVhbnVwKCkge1xuICAgIC8vIFJlbW92ZSBldmVudCBsaXN0ZW5lcnMgaWYgbmVlZGVkLCBvciBhbnkgb3RoZXIgY2xlYW51cCBvcGVyYXRpb25zXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICBcInNheXBpOnRyYW5zY3JpYmVkXCIsXG4gICAgICB0aGlzLmhhbmRsZVRyYW5zY3JpcHRpb25SZXNwb25zZVxuICAgICk7XG4gIH1cblxuICBzdGF0aWMgc2ltdWxhdGVUeXBpbmcoZWxlbWVudCwgdGV4dCkge1xuICAgIGNvbnN0IHdvcmRzID0gdGV4dC5zcGxpdChcIiBcIik7XG4gICAgbGV0IGkgPSAwO1xuXG4gICAgY29uc3QgdHlwZVdvcmQgPSAoKSA9PiB7XG4gICAgICBpZiAoaSA8IHdvcmRzLmxlbmd0aCkge1xuICAgICAgICBFdmVudE1vZHVsZS5zZXROYXRpdmVWYWx1ZShlbGVtZW50LCBlbGVtZW50LnZhbHVlICsgd29yZHNbaSsrXSArIFwiIFwiKTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHR5cGVXb3JkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEV2ZW50QnVzLmVtaXQoXCJzYXlwaTphdXRvU3VibWl0XCIpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0eXBlV29yZCgpO1xuICB9XG5cbiAgc3RhdGljIHNldE5hdGl2ZVZhbHVlKGVsZW1lbnQsIHZhbHVlKSB7XG4gICAgbGV0IGxhc3RWYWx1ZSA9IGVsZW1lbnQudmFsdWU7XG4gICAgZWxlbWVudC52YWx1ZSA9IHZhbHVlO1xuICAgIGxldCBldmVudCA9IG5ldyBFdmVudChcImlucHV0XCIsIHsgdGFyZ2V0OiBlbGVtZW50LCBidWJibGVzOiB0cnVlIH0pO1xuICAgIC8vIFJlYWN0IDE1XG4gICAgZXZlbnQuc2ltdWxhdGVkID0gdHJ1ZTtcbiAgICAvLyBSZWFjdCAxNi0xN1xuICAgIGxldCB0cmFja2VyID0gZWxlbWVudC5fdmFsdWVUcmFja2VyO1xuICAgIGlmICh0cmFja2VyKSB7XG4gICAgICB0cmFja2VyLnNldFZhbHVlKGxhc3RWYWx1ZSk7XG4gICAgfVxuICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gIH1cblxuICBzdGF0aWMgaGFuZGxlVGFsa01vdXNlRG93bigpIHtcbiAgICBFdmVudEJ1cy5lbWl0KFwiYXVkaW86c3RhcnRSZWNvcmRpbmdcIik7XG4gIH1cblxuICBzdGF0aWMgaGFuZGxlVGFsa01vdXNlVXAoKSB7XG4gICAgRXZlbnRCdXMuZW1pdChcImF1ZGlvOnN0b3BSZWNvcmRpbmdcIik7XG4gIH1cblxuICBzdGF0aWMgaGFuZGxlVGFsa0RvdWJsZUNsaWNrKGJ1dHRvbikge1xuICAgIC8vIFRvZ2dsZSB0aGUgQ1NTIGNsYXNzZXMgdG8gaW5kaWNhdGUgdGhlIG1vZGVcbiAgICBidXR0b24uY2xhc3NMaXN0LnRvZ2dsZShcImF1dG9TdWJtaXRcIik7XG4gICAgaWYgKGJ1dHRvbi5nZXRBdHRyaWJ1dGUoXCJkYXRhLWF1dG9zdWJtaXRcIikgPT09IFwidHJ1ZVwiKSB7XG4gICAgICBidXR0b24uc2V0QXR0cmlidXRlKFwiZGF0YS1hdXRvc3VibWl0XCIsIFwiZmFsc2VcIik7XG4gICAgICBjb25zb2xlLmxvZyhcImF1dG9zdWJtaXQgZGlzYWJsZWRcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJkYXRhLWF1dG9zdWJtaXRcIiwgXCJ0cnVlXCIpO1xuICAgICAgY29uc29sZS5sb2coXCJhdXRvc3VibWl0IGVuYWJsZWRcIik7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGhhbmRsZVRhbGtUb3VjaFN0YXJ0KGJ1dHRvbiwgZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBFdmVudEJ1cy5lbWl0KFwiYXVkaW86c3RhcnRSZWNvcmRpbmdcIik7XG4gIH1cblxuICBzdGF0aWMgaGFuZGxlVGFsa1RvdWNoRW5kKGJ1dHRvbikge1xuICAgIEV2ZW50QnVzLmVtaXQoXCJhdWRpbzpzdG9wUmVjb3JkaW5nXCIpO1xuICB9XG5cbiAgc3RhdGljIHJlZ2lzdGVyT3RoZXJBdWRpb0J1dHRvbkV2ZW50cyhidXR0b24pIHtcbiAgICAvLyBcIndhcm0gdXBcIiB0aGUgbWljcm9waG9uZSBieSBhY3F1aXJpbmcgaXQgYmVmb3JlIHRoZSB1c2VyIHByZXNzZXMgdGhlIGJ1dHRvblxuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCAoKSA9PiB7XG4gICAgICBFdmVudEJ1cy5lbWl0KFwiYXVkaW86c2V0dXBSZWNvcmRpbmdcIik7XG4gICAgfSk7XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsICgpID0+IHtcbiAgICAgIEV2ZW50QnVzLmVtaXQoXCJhdWRpbzp0ZWFyRG93blJlY29yZGluZ1wiKTtcbiAgICB9KTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImJlZm9yZXVubG9hZFwiLCAoKSA9PiB7XG4gICAgICBFdmVudEJ1cy5lbWl0KFwiYXVkaW86dGVhckRvd25SZWNvcmRpbmdcIik7XG4gICAgfSk7XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGNhbmNlbFwiLCAoKSA9PiB7XG4gICAgICBFdmVudEJ1cy5lbWl0KFwiYXVkaW86dGVhckRvd25SZWNvcmRpbmdcIik7XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgcmVnaXN0ZXJTdGF0ZU1hY2hpbmVFdmVudHMoYWN0b3IpIHtcbiAgICBFdmVudEJ1cy5vbihVU0VSX1NQRUFLSU5HLCAoKSA9PiB7XG4gICAgICBhY3Rvci5zZW5kKFVTRVJfU1BFQUtJTkcpO1xuICAgIH0pO1xuXG4gICAgW1VTRVJfU1RPUFBFRF9TUEVBS0lORywgVVNFUl9GSU5JU0hFRF9TUEVBS0lOR10uZm9yRWFjaCgoZXZlbnROYW1lKSA9PiB7XG4gICAgICBFdmVudEJ1cy5vbihldmVudE5hbWUsIChkZXRhaWwpID0+IHtcbiAgICAgICAgaWYgKGRldGFpbCkge1xuICAgICAgICAgIGFjdG9yLnNlbmQoeyB0eXBlOiBldmVudE5hbWUsIC4uLmRldGFpbCB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oYFJlY2VpdmVkICR7ZXZlbnROYW1lfSB3aXRob3V0IGRldGFpbHMuYCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgRXZlbnRCdXMub24oVFJBTlNDUklCSU5HLCAoKSA9PiB7XG4gICAgICBhY3Rvci5zZW5kKFRSQU5TQ1JJQklORyk7XG4gICAgfSk7XG5cbiAgICBbUElfU1BFQUtJTkcsIFBJX1NUT1BQRURfU1BFQUtJTkcsIFBJX0ZJTklTSEVEX1NQRUFLSU5HXS5mb3JFYWNoKFxuICAgICAgKGV2ZW50TmFtZSkgPT4ge1xuICAgICAgICBFdmVudEJ1cy5vbihldmVudE5hbWUsICgpID0+IHtcbiAgICAgICAgICBhY3Rvci5zZW5kKGV2ZW50TmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICk7XG5cbiAgICBbUEFVU0UsIFJFQURZLCBQTEFZXS5mb3JFYWNoKChldmVudE5hbWUpID0+IHtcbiAgICAgIEV2ZW50QnVzLm9uKGV2ZW50TmFtZSwgKCkgPT4ge1xuICAgICAgICBhY3Rvci5zZW5kKGV2ZW50TmFtZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qIGV2ZW50cyB0byBkaXJlY3QgdGhlIGF1ZGlvIG1vZHVsZSB0byBzdGFydC9zdG9wIHJlY29yZGluZyAqL1xuXG4gIHN0YXRpYyByZWdpc3RlckhvdGtleSgpIHtcbiAgICBsZXQgY3RybERvd24gPSBmYWxzZTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LmN0cmxLZXkgJiYgZXZlbnQuY29kZSA9PT0gXCJTcGFjZVwiICYmICFjdHJsRG93bikge1xuICAgICAgICBjdHJsRG93biA9IHRydWU7XG4gICAgICAgIEV2ZW50QnVzLmVtaXQoXCJhdWRpbzpzdGFydFJlY29yZGluZ1wiKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChjdHJsRG93biAmJiBldmVudC5jb2RlID09PSBcIlNwYWNlXCIpIHtcbiAgICAgICAgY3RybERvd24gPSBmYWxzZTtcbiAgICAgICAgRXZlbnRCdXMuZW1pdChcImF1ZGlvOnN0b3BSZWNvcmRpbmdcIik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IGludGVycHJldCB9IGZyb20gXCJ4c3RhdGVcIjtcbmltcG9ydCB7IG1hY2hpbmUgfSBmcm9tIFwiLi9zYXlwaVN0YXRlTWFjaGluZVwiO1xuXG4vKipcbiAqIEEgc2luZ2xldG9uIHNlcnZpY2UgdGhhdCBtYW5hZ2VzIHRoZSBzdGF0ZSBtYWNoaW5lLlxuICovXG5jbGFzcyBTdGF0ZU1hY2hpbmVTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hY3RvciA9IGludGVycHJldChtYWNoaW5lKS5vblRyYW5zaXRpb24oKHN0YXRlKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhgVHJhbnNpdGlvbmVkIHRvIHN0YXRlOiAke3N0YXRlLnZhbHVlfWApO1xuICAgIH0pO1xuICAgIHRoaXMuYWN0b3Iuc3RhcnQoKTtcbiAgfVxufVxuXG4vLyBTaW5nbGV0b25cbmV4cG9ydCBkZWZhdWx0IG5ldyBTdGF0ZU1hY2hpbmVTZXJ2aWNlKCk7XG4iLCJpbXBvcnQgU3RhdGVNYWNoaW5lU2VydmljZSBmcm9tIFwiLi9TdGF0ZU1hY2hpbmVTZXJ2aWNlLmpzXCI7XG5pbXBvcnQgeyBpc01vYmlsZVZpZXcgfSBmcm9tIFwiLi9Vc2VyQWdlbnRNb2R1bGUuanNcIjtcbmltcG9ydCBFdmVudEJ1cyBmcm9tIFwiLi9FdmVudEJ1cy5qc1wiO1xuaW1wb3J0IEV2ZW50TW9kdWxlIGZyb20gXCIuL0V2ZW50TW9kdWxlLmpzXCI7XG5cbmNvbnN0IGNvbmZpZyA9IHtcbiAgYXBwU2VydmVyVXJsOiBwcm9jZXNzLmVudi5BUFBfU0VSVkVSX1VSTCxcbiAgYXBpU2VydmVyVXJsOiBwcm9jZXNzLmVudi5BUElfU0VSVkVSX1VSTCxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGxvYWRBdWRpbyhhdWRpb0Jsb2IpIHtcbiAgLy8gQ3JlYXRlIGEgRm9ybURhdGEgb2JqZWN0XG4gIHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICB2YXIgYXVkaW9GaWxlbmFtZSA9IFwiYXVkaW8ud2VibVwiO1xuICBpZiAoYXVkaW9CbG9iLnR5cGUgPT09IFwiYXVkaW8vbXA0XCIpIHtcbiAgICBhdWRpb0ZpbGVuYW1lID0gXCJhdWRpby5tcDRcIjtcbiAgfVxuICAvLyBBZGQgdGhlIGF1ZGlvIGJsb2IgdG8gdGhlIEZvcm1EYXRhIG9iamVjdFxuICBmb3JtRGF0YS5hcHBlbmQoXCJhdWRpb1wiLCBhdWRpb0Jsb2IsIGF1ZGlvRmlsZW5hbWUpO1xuICAvLyBHZXQgdGhlIHVzZXIncyBwcmVmZXJyZWQgbGFuZ3VhZ2VcbiAgdmFyIGxhbmd1YWdlID0gbmF2aWdhdG9yLmxhbmd1YWdlO1xuICAvLyBQb3N0IHRoZSBhdWRpbyB0byB0aGUgc2VydmVyIGZvciB0cmFuc2NyaXB0aW9uXG4gIGZldGNoKGNvbmZpZy5hcGlTZXJ2ZXJVcmwgKyBcIi90cmFuc2NyaWJlP2xhbmd1YWdlPVwiICsgbGFuZ3VhZ2UsIHtcbiAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgIGJvZHk6IGZvcm1EYXRhLFxuICB9KVxuICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICB0aHJvdyBFcnJvcihyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gICAgfSlcbiAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2VKc29uKSB7XG4gICAgICBTdGF0ZU1hY2hpbmVTZXJ2aWNlLmFjdG9yLnNlbmQoXCJzYXlwaTp0cmFuc2NyaWJlZFwiLCB7XG4gICAgICAgIHRleHQ6IHJlc3BvbnNlSnNvbi50ZXh0LFxuICAgICAgfSk7XG4gICAgfSlcbiAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiTG9va3MgbGlrZSB0aGVyZSB3YXMgYSBwcm9ibGVtOiBcIiwgZXJyb3IpO1xuICAgICAgLy9UT0RPOiByYWlzZSBhbiBldmVudCB0byB0aGUgc3RhdGUgbWFjaGluZSBpbnN0ZWFkXG4gICAgICB2YXIgdGV4dGFyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNheXBpLXByb21wdFwiKTtcbiAgICAgIHRleHRhcmVhLnZhbHVlID1cbiAgICAgICAgXCJTb3JyeSwgdGhlcmUgd2FzIGEgcHJvYmxlbSB0cmFuc2NyaWJpbmcgeW91ciBhdWRpby4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlci5cIjtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZVRyYW5zY3JpcHRpb25SZXNwb25zZSh0cmFuc2NyaXB0KSB7XG4gIGNvbnNvbGUubG9nKFwiVHJhbnNjcmlwdDogXCIgKyB0cmFuc2NyaXB0KTtcbiAgY29uc3QgdGV4dGFyZWEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNheXBpLXByb21wdFwiKTtcbiAgaWYgKGlzTW9iaWxlVmlldygpKSB7XG4gICAgLy8gaWYgdHJhbnNjcmlwdCBpcyA+IDEwMDAgY2hhcmFjdGVycywgdHJ1bmNhdGUgaXQgdG8gOTk5IGNoYXJhY3RlcnMgcGx1cyBhbiBlbGxpcHNpc1xuICAgIGlmICh0cmFuc2NyaXB0Lmxlbmd0aCA+IDEwMDApIHtcbiAgICAgIHRyYW5zY3JpcHQgPSB0cmFuc2NyaXB0LnN1YnN0cmluZygwLCA5OTkpICsgXCLigKZcIjtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgXCJUcmFuc2NyaXB0IHdhcyB0b28gbG9uZyBmb3IgUGkuIFRydW5jYXRlZCB0byA5OTkgY2hhcmFjdGVycywgbG9zaW5nIHRoZSBmb2xsb3dpbmcgdGV4dDogLi4uIFwiICtcbiAgICAgICAgICB0cmFuc2NyaXB0LnN1YnN0cmluZyg5OTkpXG4gICAgICApO1xuICAgIH1cbiAgICBFdmVudE1vZHVsZS5zZXROYXRpdmVWYWx1ZSh0ZXh0YXJlYSwgdHJhbnNjcmlwdCk7XG4gICAgRXZlbnRCdXMuZW1pdChcInNheXBpOmF1dG9TdWJtaXRcIik7XG4gIH0gZWxzZSB7XG4gICAgRXZlbnRNb2R1bGUuc2ltdWxhdGVUeXBpbmcodGV4dGFyZWEsIHRyYW5zY3JpcHQgKyBcIiBcIik7XG4gIH1cbn1cbiIsImxldCB1c2VyUHJlZmVyZW5jZTsgLy8gdHJhbnNpZW50IHZhcmlhYmxlIHRvIHN0b3JlIHVzZXIgcHJlZmVyZW5jZSB1bnRpbCByZWZyZXNoXG5cbmV4cG9ydCBmdW5jdGlvbiBpc01vYmlsZVZpZXcoKSB7XG4gIGlmICh1c2VyUHJlZmVyZW5jZSkge1xuICAgIHJldHVybiB1c2VyUHJlZmVyZW5jZSA9PT0gXCJtb2JpbGVcIjtcbiAgfVxuXG4gIHJldHVybiB3aW5kb3cubWF0Y2hNZWRpYShcIihtYXgtd2lkdGg6IDc2OHB4KVwiKS5tYXRjaGVzO1xufVxuXG4vLyBUT0RPOiBkZWR1cGUgdGhpcyBmdW5jdGlvbiBmcm9tIHRyYW5zY3JpYmVyLmpzXG5leHBvcnQgZnVuY3Rpb24gaXNTYWZhcmkoKSB7XG4gIHJldHVybiAvXigoPyFjaHJvbWV8YW5kcm9pZCkuKSpzYWZhcmkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGV4aXRNb2JpbGVNb2RlKCkge1xuICB1c2VyUHJlZmVyZW5jZSA9IFwiZGVza3RvcFwiOyAvLyBvciAnbW9iaWxlJ1xuXG4gIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcIm1vYmlsZS12aWV3XCIpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGFkZFVzZXJBZ2VudEZsYWdzKCkge1xuICB2YXIgaXNGaXJlZm94QW5kcm9pZCA9XG4gICAgL0ZpcmVmb3gvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgJiYgL0FuZHJvaWQvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gIGlmIChpc0ZpcmVmb3hBbmRyb2lkKSB7XG4gICAgLy8gaGFjayBmb3IgRmlyZWZveCBvbiBBbmRyb2lkLCB3aGljaCBkb2Vzbid0IHN1cHBvcnQgOmFjdGl2ZSBjb3JyZWN0bHlcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJmaXJlZm94LWFuZHJvaWRcIik7XG4gIH1cblxuICBpZiAoaXNNb2JpbGVWaWV3KCkpIHtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJtb2JpbGUtdmlld1wiKTtcbiAgfSBlbHNlIHtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJtb2JpbGUtdmlld1wiKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgYnV0dG9uTW9kdWxlIH0gZnJvbSBcIi4vQnV0dG9uTW9kdWxlXCI7XG5pbXBvcnQgeyBjcmVhdGVNYWNoaW5lIH0gZnJvbSBcInhzdGF0ZVwiO1xuaW1wb3J0IEFuaW1hdGlvbk1vZHVsZSBmcm9tIFwiLi9BbmltYXRpb25Nb2R1bGVcIjtcbmltcG9ydCB7IGlzU2FmYXJpLCBpc01vYmlsZVZpZXcgfSBmcm9tIFwiLi9Vc2VyQWdlbnRNb2R1bGVcIjtcbmltcG9ydCB7XG4gIHVwbG9hZEF1ZGlvLFxuICBoYW5kbGVUcmFuc2NyaXB0aW9uUmVzcG9uc2UsXG59IGZyb20gXCIuL1RyYW5zY3JpcHRpb25Nb2R1bGVcIjtcbmltcG9ydCBFdmVudEJ1cyBmcm9tIFwiLi9FdmVudEJ1c1wiO1xuXG5leHBvcnQgY29uc3QgbWFjaGluZSA9IGNyZWF0ZU1hY2hpbmUoXG4gIHtcbiAgICAvKiogQHhzdGF0ZS1sYXlvdXQgTjRJZ3BnSmc1bURPSUM1U3dJWUU4QUtCTEFkRmlBTm1BTVNwb0FPV0NBcnJHQUU0REs1WUtBMWxnSFpRRGFBREFGMUVvY2dIdFlXQUM1WlJuWVNBQWVpQU13QjJQam1VQk9QZ0RZQWpMcTM3OXkzUUJvUWFSUHI1YXRPWGFxMjZBTEtvQk15LVFBNVRBWDM5TE1tdzhRaEl5U2dSeUZGb3dmaUVrRURFSmFWbDVKUVExRFcwOVEyTlRDeXRFVlNNY1VvOHRIM2NmVldWWE0wRGc5RkQ4SWxKMEtNcG1WZzV1QlBrVXFSazVKTXpzelIwREl4TXpTMnNFVng4UEhIZGRBRlpTcldWTjNWMCtkYWFRRU53NHBoWjJMaWdPaWlvemdERXVMRmdBQzBnZXktN0JRZkZoOUxIRUpVdEs0Y09zK0tvNnBzK0hwMXNwNW9oWWJwUVI0TnFWNmo0dE9zUEVjVGpnemg4K3RkSW5jNkV4SktKeUN3SUFTcmdNa2tNMHFOUUprUEh3TVRobG53ek1vN0JqMWo0NGNVRUI1WEJvdEtWMXZ5d1hzOXI0Y1MxVHFTYWR3YmxGSlBRVUp4WUFCamVoWUFCR3RPKzlOK2pJeWdQc0lMQkVKMjZoaGdvV3JnMk9ENEtLeFZTNUVNbDhzd3VCaWNRZ3FxbzVBSTZEcElsTkkzTkNGc09rMERTOXVnRnJPODhJUUVKQjZtOHJvOHFsY0hpeHJoOW9XNkYwSlFlaVdFWTVNcDd6TFJzU0VkU1VZQk1melNOY1dnOEl0MEJaMjZ4Y2FmRlBod1haY1RoOFNaOG0zMHhiOVZmckt1Sk5DVmk5NHhxYmZ5WmlrQmJJY25PNXZNeEFyVG5aSHVkUmxRektPVWM1d3BkNlZ3cmxFZW5HZWIycGEtRHlVai0yWk5uYlVGdkdVYnhnUzVUWXREVE14OUhLTjFOZ2hQUnFtbk85MVUxSFU5VU5KZE9pb1ZDdFYxQTFJRy1Ca1czLUxKZVJ3ZlIxbDdIUVFPN1RFMHo4VUZvV2hkUmZBRmZSY3p2QWhSQlFDQW4yWEI5UG5YUnNmMmJQOGR6YkZGVmk3SHMrMGxRY2hXY1ZSSEdjTndxUEJmUWRCOE85LVRvUU5sM29WZ0lEUUlqZjIzVEk5akZKTUtuMmZZQlI4Tk45bVVIQnV3MktqS2xxYnRaeU9UaFJBZ09CNUJPSDR4UE14QUFGb2lnV0NLWFdZMks0dkJPODJqQVlLdDJqZk0wdzQ5Wk5IV1NqM083UHhOS0xJSmpnVlBGVjBmYmdVck5Wc0MxZEppRU9XZmxjbFVVOVRCY2lWODI3ZmtEbHZZcmNWMHlBcXBJaVNCeEhlbzFIemZRYWlvaHpGTE1DalZPV2J4Y3g1UTQrdEt3VENTRzhUTWtNYXB5akJObFBGUlR0VHlkWkZMMU1Way1CUWpVOEl3cTV0dENySjh5eWppejBxQm85aW8wODZvaE56VkI4YWQxbGNBY3VKNHZqS3BORUxvMHlzYXFpV1lFTTNxTk04eXlzYzNEV1h4UWJXd0lnQSAqL1xuICAgIGlkOiBcInNheVBpXCIsXG4gICAgaW5pdGlhbDogXCJpZGxlXCIsXG4gICAgc3RhdGVzOiB7XG4gICAgICBpZGxlOiB7XG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIkluaXRpYWwgc3RhdGUuXFxuR2VudGxlIHB1bHNpbmcgYW5pbWF0aW9uLlwiLFxuICAgICAgICBlbnRyeTogW1wic3RvcEFsbEFuaW1hdGlvbnNcIiwgXCJhY3F1aXJlTWljcm9waG9uZVwiXSxcbiAgICAgICAgb246IHtcbiAgICAgICAgICBcInNheXBpOnVzZXJTcGVha2luZ1wiOiB7XG4gICAgICAgICAgICB0YXJnZXQ6IFwidXNlclNwZWFraW5nXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNheXBpOnBhdXNlXCI6IHtcbiAgICAgICAgICAgIHRhcmdldDogXCJwYXVzZWRcIixcbiAgICAgICAgICAgIGNvbmQ6IFwiaXNTYWZhcmlcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2F5cGk6cGlTcGVha2luZ1wiOiB7XG4gICAgICAgICAgICB0YXJnZXQ6IFwicGlTcGVha2luZ1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgdXNlclNwZWFraW5nOiB7XG4gICAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAgIFwiVXNlciBpcyBzcGVha2luZyBhbmQgYmVpbmcgcmVjb3JkZWQgYnkgdGhlIG1pY3JvcGhvbmUuXFxuV2F2ZWZvcm0gYW5pbWF0aW9uLlwiLFxuXG4gICAgICAgIGVudHJ5OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogXCJzdGFydEFuaW1hdGlvblwiLFxuICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgIGFuaW1hdGlvbjogXCJ1c2VyU3BlYWtpbmdcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImFjdGl2YXRlVGFsa0J1dHRvblwiLFxuICAgICAgICBdLFxuXG4gICAgICAgIGV4aXQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiBcInN0b3BBbmltYXRpb25cIixcbiAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICBhbmltYXRpb246IFwidXNlclNwZWFraW5nXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkZWFjdGl2YXRlVGFsa0J1dHRvblwiLFxuICAgICAgICBdLFxuXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgXCJzYXlwaTp1c2VyRmluaXNoZWRTcGVha2luZ1wiOiB7XG4gICAgICAgICAgICB0YXJnZXQ6IFwidHJhbnNjcmliaW5nXCIsXG4gICAgICAgICAgICBjb25kOiBcImxvbmdFbm91Z2hGb3JVcGxvYWRcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2F5cGk6dXNlclN0b3BwZWRTcGVha2luZ1wiOiB7XG4gICAgICAgICAgICB0YXJnZXQ6IFwiaWRsZVwiLFxuICAgICAgICAgICAgY29uZDogXCJ0b29TaG9ydEZvclVwbG9hZFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzYXlwaTp0cmFuc2NyaWJpbmdcIjoge1xuICAgICAgICAgICAgdGFyZ2V0OiBcInRyYW5zY3JpYmluZ1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcGF1c2VkOiB7XG4gICAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAgIFwiQmxvY2tpbmcgYWN0aW9uIG9uIFNhZmFyaS5cXG5Vc2VyIG11c3QgcHJlc3MgcGxheSB0byBoZWFyIFBpJ3MgcmVzcG9uc2UuXFxuQm91bmNlIGFuaW1hdGlvbi5cIixcbiAgICAgICAgZW50cnk6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiBcInN0YXJ0QW5pbWF0aW9uXCIsXG4gICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgYW5pbWF0aW9uOiBcInBhdXNlZFwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBleGl0OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogXCJzdG9wQW5pbWF0aW9uXCIsXG4gICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgYW5pbWF0aW9uOiBcInBhdXNlZFwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBvbjoge1xuICAgICAgICAgIFwic2F5cGk6cGxheVwiOiB7XG4gICAgICAgICAgICB0YXJnZXQ6IFwibG9hZGluZ1wiLFxuICAgICAgICAgICAgYWN0aW9uczogXCJoaWRlUGxheUJ1dHRvblwiLFxuICAgICAgICAgIH0sXG5cbiAgICAgICAgICBcInNheXBpOnJlYWR5XCI6IHtcbiAgICAgICAgICAgIHRhcmdldDogXCJwYXVzZWRcIixcbiAgICAgICAgICAgIGludGVybmFsOiB0cnVlLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IGBFbm91Z2ggYXVkaW8gaGFzIGJlZW4gYnVmZmVyZWQgdG8gc3RhcnQgcGxheWJhY2suYCxcbiAgICAgICAgICAgIGFjdGlvbnM6IFwic2hvd1BsYXlCdXR0b25cIixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHBpU3BlYWtpbmc6IHtcbiAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgXCJQaSdzIHN5bnRoZXNpc2VkIHNwZWVjaCBhdWRpbyBpcyBwbGF5aW5nLlxcblBsYXlmdWwgYW5pbWF0aW9uLlwiLFxuICAgICAgICBlbnRyeToge1xuICAgICAgICAgIHR5cGU6IFwic3RhcnRBbmltYXRpb25cIixcbiAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogXCJwaVNwZWFraW5nXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgZXhpdDoge1xuICAgICAgICAgIHR5cGU6IFwic3RvcEFuaW1hdGlvblwiLFxuICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgYW5pbWF0aW9uOiBcInBpU3BlYWtpbmdcIixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBvbjoge1xuICAgICAgICAgIFwic2F5cGk6cGlTdG9wcGVkU3BlYWtpbmdcIjoge1xuICAgICAgICAgICAgdGFyZ2V0OiBcImlkbGVcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2F5cGk6dXNlclNwZWFraW5nXCI6IHtcbiAgICAgICAgICAgIHRhcmdldDogXCJ1c2VyU3BlYWtpbmdcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2F5cGk6cGlGaW5pc2hlZFNwZWFraW5nXCI6IHtcbiAgICAgICAgICAgIHRhcmdldDogXCJpZGxlXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB0cmFuc2NyaWJpbmc6IHtcbiAgICAgICAgZGVzY3JpcHRpb246IFwiVHJhbnNjcmliaW5nIGF1ZGlvIHRvIHRleHQuXFxuQ2FyZCBmbGlwIGFuaW1hdGlvbi5cIixcbiAgICAgICAgZW50cnk6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiBcInN0YXJ0QW5pbWF0aW9uXCIsXG4gICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgYW5pbWF0aW9uOiBcInRyYW5zY3JpYmluZ1wiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidHJhbnNjcmliZUF1ZGlvXCIsXG4gICAgICAgIF0sXG4gICAgICAgIGV4aXQ6IHtcbiAgICAgICAgICB0eXBlOiBcInN0b3BBbmltYXRpb25cIixcbiAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogXCJ0cmFuc2NyaWJpbmdcIixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBvbjoge1xuICAgICAgICAgIFwic2F5cGk6dHJhbnNjcmliZWRcIjoge1xuICAgICAgICAgICAgdGFyZ2V0OiBcImlkbGVcIixcbiAgICAgICAgICAgIGFjdGlvbnM6IFwiaGFuZGxlVHJhbnNjcmlwdGlvblJlc3BvbnNlXCIsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJTdWNjZXNzZnVsbHkgdHJhbnNjcmliZWQgdXNlciBhdWRpbyB0byB0ZXh0LlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgbG9hZGluZzoge1xuICAgICAgICBkZXNjcmlwdGlvbjogXCJQaSdzIGF1ZGlvIGlzIGxvYWRpbmcuXCIsXG4gICAgICAgIGVudHJ5OiB7XG4gICAgICAgICAgdHlwZTogXCJzdGFydEFuaW1hdGlvblwiLFxuICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgYW5pbWF0aW9uOiBcImxvYWRpbmdcIixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBleGl0OiB7XG4gICAgICAgICAgdHlwZTogXCJzdG9wQW5pbWF0aW9uXCIsXG4gICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICBhbmltYXRpb246IFwibG9hZGluZ1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgXCJzYXlwaTpwaVNwZWFraW5nXCI6IHtcbiAgICAgICAgICAgIHRhcmdldDogXCJwaVNwZWFraW5nXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBwcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50czogdHJ1ZSxcbiAgICBwcmVzZXJ2ZUFjdGlvbk9yZGVyOiB0cnVlLFxuICB9LFxuICB7XG4gICAgYWN0aW9uczoge1xuICAgICAgc3RvcEFsbEFuaW1hdGlvbnM6IChjb250ZXh0LCBldmVudCkgPT4ge1xuICAgICAgICBBbmltYXRpb25Nb2R1bGUuc3RvcEFsbEFuaW1hdGlvbnMoKTtcbiAgICAgIH0sXG5cbiAgICAgIHN0YXJ0QW5pbWF0aW9uOiAoY29udGV4dCwgZXZlbnQsIHsgYWN0aW9uIH0pID0+IHtcbiAgICAgICAgQW5pbWF0aW9uTW9kdWxlLnN0YXJ0QW5pbWF0aW9uKGFjdGlvbi5wYXJhbXMuYW5pbWF0aW9uKTtcbiAgICAgIH0sXG5cbiAgICAgIHN0b3BBbmltYXRpb246IChjb250ZXh0LCBldmVudCwgeyBhY3Rpb24gfSkgPT4ge1xuICAgICAgICBBbmltYXRpb25Nb2R1bGUuc3RvcEFuaW1hdGlvbihhY3Rpb24ucGFyYW1zLmFuaW1hdGlvbik7XG4gICAgICB9LFxuXG4gICAgICB0cmFuc2NyaWJlQXVkaW86IChjb250ZXh0LCBldmVudCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcInRyYW5zY3JpYmVBdWRpb1wiLCBldmVudCk7XG4gICAgICAgIGNvbnN0IGF1ZGlvQmxvYiA9IGV2ZW50LmJsb2I7XG4gICAgICAgIHVwbG9hZEF1ZGlvKGF1ZGlvQmxvYik7XG4gICAgICB9LFxuXG4gICAgICBoYW5kbGVUcmFuc2NyaXB0aW9uUmVzcG9uc2U6IChjb250ZXh0LCBldmVudCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcImhhbmRsZVRyYW5zY3JpcHRpb25SZXNwb25zZVwiLCBldmVudCk7XG4gICAgICAgIGNvbnN0IHRyYW5zY3JpcHRpb24gPSBldmVudC50ZXh0O1xuICAgICAgICBoYW5kbGVUcmFuc2NyaXB0aW9uUmVzcG9uc2UodHJhbnNjcmlwdGlvbik7XG4gICAgICB9LFxuXG4gICAgICBzaG93UGxheUJ1dHRvbjogKGNvbnRleHQsIGV2ZW50KSA9PiB7XG4gICAgICAgIGJ1dHRvbk1vZHVsZS5zaG93UGxheUJ1dHRvbigpO1xuICAgICAgfSxcblxuICAgICAgaGlkZVBsYXlCdXR0b246IChjb250ZXh0LCBldmVudCkgPT4ge1xuICAgICAgICBidXR0b25Nb2R1bGUuaGlkZVBsYXlCdXR0b24oKTtcbiAgICAgIH0sXG5cbiAgICAgIGFjdGl2YXRlVGFsa0J1dHRvbjogKGNvbnRleHQsIGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IHRhbGtCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNheXBpLXRhbGtCdXR0b25cIik7XG4gICAgICAgIHRhbGtCdXR0b24uY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTsgLy8gQWRkIHRoZSBhY3RpdmUgY2xhc3MgKGZvciBGaXJlZm94IG9uIEFuZHJvaWQpXG4gICAgICB9LFxuXG4gICAgICBkZWFjdGl2YXRlVGFsa0J1dHRvbjogKGNvbnRleHQsIGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IHRhbGtCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNheXBpLXRhbGtCdXR0b25cIik7XG4gICAgICAgIHRhbGtCdXR0b24uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTsgLy8gUmVtb3ZlIHRoZSBhY3RpdmUgY2xhc3MgKGZvciBGaXJlZm94IG9uIEFuZHJvaWQpXG4gICAgICB9LFxuXG4gICAgICBhY3F1aXJlTWljcm9waG9uZTogKGNvbnRleHQsIGV2ZW50KSA9PiB7XG4gICAgICAgIC8vIHdhcm11cCB0aGUgbWljcm9waG9uZSBvbiBpZGxlIGluIG1vYmlsZSB2aWV3LFxuICAgICAgICAvLyBzaW5jZSB0aGVyZSdzIG5vIG1vdXNlb3ZlciBldmVudCB0byB0cmlnZ2VyIGl0XG4gICAgICAgIGlmIChpc01vYmlsZVZpZXcoKSkge1xuICAgICAgICAgIEV2ZW50QnVzLmVtaXQoXCJhdWRpbzpzZXR1cFJlY29yZGluZ1wiKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9LFxuICAgIHNlcnZpY2VzOiB7fSxcbiAgICBndWFyZHM6IHtcbiAgICAgIHRvb1Nob3J0Rm9yVXBsb2FkOiAoY29udGV4dCwgZXZlbnQpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJ0b29TaG9ydEZvclVwbG9hZFwiLCBldmVudCk7XG4gICAgICAgIHJldHVybiBldmVudC5kdXJhdGlvbiA8IDEwMDA7XG4gICAgICB9LFxuXG4gICAgICBsb25nRW5vdWdoRm9yVXBsb2FkOiAoY29udGV4dCwgZXZlbnQpID0+IHtcbiAgICAgICAgcmV0dXJuIGV2ZW50LmR1cmF0aW9uID49IDEwMDA7XG4gICAgICB9LFxuXG4gICAgICBpc1NhZmFyaTogKGNvbnRleHQsIGV2ZW50KSA9PiB7XG4gICAgICAgIHJldHVybiBpc1NhZmFyaSgpO1xuICAgICAgfSxcbiAgICB9LFxuICAgIGRlbGF5czoge30sXG4gIH1cbik7XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgQGtleWZyYW1lcyBwdWxzZV9vdXRlcm1vc3Qge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45Mik7XG4gIH1cbn1cbi5vdXRlcm1vc3Qge1xuICBhbmltYXRpb246IHB1bHNlX291dGVybW9zdCA1cyBpbmZpbml0ZTtcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xufVxuXG5Aa2V5ZnJhbWVzIHB1bHNlX3NlY29uZCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjg1Nik7XG4gIH1cbn1cbi5zZWNvbmQge1xuICBhbmltYXRpb246IHB1bHNlX3NlY29uZCA1cyBpbmZpbml0ZTtcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xufVxuXG5Aa2V5ZnJhbWVzIHB1bHNlX3RoaXJkIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNzkyKTtcbiAgfVxufVxuLnRoaXJkIHtcbiAgYW5pbWF0aW9uOiBwdWxzZV90aGlyZCA1cyBpbmZpbml0ZTtcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xufVxuXG5Aa2V5ZnJhbWVzIHB1bHNlX2ZvdXJ0aCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjcyOCk7XG4gIH1cbn1cbi5mb3VydGgge1xuICBhbmltYXRpb246IHB1bHNlX2ZvdXJ0aCA1cyBpbmZpbml0ZTtcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xufVxuXG5Aa2V5ZnJhbWVzIHB1bHNlX2ZpZnRoIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNjY0KTtcbiAgfVxufVxuLmZpZnRoIHtcbiAgYW5pbWF0aW9uOiBwdWxzZV9maWZ0aCA1cyBpbmZpbml0ZTtcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xufVxuXG5Aa2V5ZnJhbWVzIHB1bHNlX2lubmVybW9zdCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjYpO1xuICB9XG59XG4uaW5uZXJtb3N0IHtcbiAgYW5pbWF0aW9uOiBwdWxzZV9pbm5lcm1vc3QgNXMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuLyogYm91bmNlIGFuaW1hdGlvbiB0byBpbmRpY2F0ZSBQaSBpcyBwYXVzZWQgYXdhaXRpbmcgcGVybWlzc2lvbiB0byBzcGVhayAqL1xuQGtleWZyYW1lcyBib3VuY2Vfb3V0ZXJtb3N0IHtcbiAgMCUsXG4gIDIwJSxcbiAgNTAlLFxuICA4MCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcbiAgfVxuICA0MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNSUpO1xuICB9XG4gIDYwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0zJSk7XG4gIH1cbn1cbi5vdXRlcm1vc3QucGF1c2VkIHtcbiAgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZV9vdXRlcm1vc3Q7XG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xufVxuXG5Aa2V5ZnJhbWVzIGJvdW5jZV9zZWNvbmQge1xuICAwJSxcbiAgMjAlLFxuICA1MCUsXG4gIDgwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xuICB9XG4gIDQwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01LjglKTtcbiAgfVxuICA2MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMy40OCUpO1xuICB9XG59XG4uc2Vjb25kLnBhdXNlZCB7XG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2Vfc2Vjb25kO1xuICBhbmltYXRpb24tZHVyYXRpb246IDJzO1xuICBhbmltYXRpb24taXRlcmF0aW9uLWNvdW50OiBpbmZpbml0ZTtcbn1cblxuQGtleWZyYW1lcyBib3VuY2VfdGhpcmQge1xuICAwJSxcbiAgMjAlLFxuICA1MCUsXG4gIDgwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xuICB9XG4gIDQwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC02LjYlKTtcbiAgfVxuICA2MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMy45NiUpO1xuICB9XG59XG4udGhpcmQucGF1c2VkIHtcbiAgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZV90aGlyZDtcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcbiAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGU7XG59XG5cbkBrZXlmcmFtZXMgYm91bmNlX2ZvdXJ0aCB7XG4gIDAlLFxuICAyMCUsXG4gIDUwJSxcbiAgODAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gIH1cbiAgNDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTcuNCUpO1xuICB9XG4gIDYwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC00LjQ0JSk7XG4gIH1cbn1cbi5mb3VydGgucGF1c2VkIHtcbiAgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZV9mb3VydGg7XG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xufVxuXG5Aa2V5ZnJhbWVzIGJvdW5jZV9maWZ0aCB7XG4gIDAlLFxuICAyMCUsXG4gIDUwJSxcbiAgODAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gIH1cbiAgNDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTguMiUpO1xuICB9XG4gIDYwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC00LjkyJSk7XG4gIH1cbn1cbi5maWZ0aC5wYXVzZWQge1xuICBhbmltYXRpb24tbmFtZTogYm91bmNlX2ZpZnRoO1xuICBhbmltYXRpb24tZHVyYXRpb246IDJzO1xuICBhbmltYXRpb24taXRlcmF0aW9uLWNvdW50OiBpbmZpbml0ZTtcbn1cblxuQGtleWZyYW1lcyBib3VuY2VfaW5uZXJtb3N0IHtcbiAgMCUsXG4gIDIwJSxcbiAgNTAlLFxuICA4MCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcbiAgfVxuICA0MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtOSUpO1xuICB9XG4gIDYwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01LjQlKTtcbiAgfVxufVxuLmlubmVybW9zdC5wYXVzZWQge1xuICBhbmltYXRpb24tbmFtZTogYm91bmNlX2lubmVybW9zdDtcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcbiAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGU7XG59XG5cbi8qIHBsYXlmdWwgYW5pbWF0aW9uIHRvIGluZGljYXRlIFBpIGlzIHNwZWFraW5nICovXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX291dGVybW9zdCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpIHJvdGF0ZSgwZGVnKTtcbiAgfVxuICAyNSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45OTUpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkpO1xuICB9XG4gIDc1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjg5NSk7XG4gIH1cbn1cbi5vdXRlcm1vc3QucGlTcGVha2luZyB7XG4gIGFuaW1hdGlvbjogc3BlYWtpbmdfb3V0ZXJtb3N0IDJzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbkBrZXlmcmFtZXMgc3BlYWtpbmdfc2Vjb25kIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSkgcm90YXRlKDBkZWcpO1xuICB9XG4gIDI1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjk4KSByb3RhdGUoLTFkZWcpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjg3KSByb3RhdGUoMGRlZyk7XG4gIH1cbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODY1KSByb3RhdGUoMWRlZyk7XG4gIH1cbn1cbi5zZWNvbmQucGlTcGVha2luZyB7XG4gIGFuaW1hdGlvbjogc3BlYWtpbmdfc2Vjb25kIDJzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbkBrZXlmcmFtZXMgc3BlYWtpbmdfdGhpcmQge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKSByb3RhdGUoMGRlZyk7XG4gIH1cbiAgMjUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTY1KSByb3RhdGUoLTJkZWcpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjg0KSByb3RhdGUoMGRlZyk7XG4gIH1cbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODM1KSByb3RhdGUoMmRlZyk7XG4gIH1cbn1cbi50aGlyZC5waVNwZWFraW5nIHtcbiAgYW5pbWF0aW9uOiBzcGVha2luZ190aGlyZCAycyBpbmZpbml0ZTtcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xufVxuXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX2ZvdXJ0aCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpIHJvdGF0ZSgwZGVnKTtcbiAgfVxuICAyNSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45NSkgcm90YXRlKC0zZGVnKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44MSkgcm90YXRlKDBkZWcpO1xuICB9XG4gIDc1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjgwNSkgcm90YXRlKDNkZWcpO1xuICB9XG59XG4uZm91cnRoLnBpU3BlYWtpbmcge1xuICBhbmltYXRpb246IHNwZWFraW5nX2ZvdXJ0aCAycyBpbmZpbml0ZTtcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xufVxuXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX2ZpZnRoIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSkgcm90YXRlKDBkZWcpO1xuICB9XG4gIDI1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkzNSkgcm90YXRlKC00ZGVnKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43OCkgcm90YXRlKDBkZWcpO1xuICB9XG4gIDc1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjc3NSkgcm90YXRlKDRkZWcpO1xuICB9XG59XG4uZmlmdGgucGlTcGVha2luZyB7XG4gIGFuaW1hdGlvbjogc3BlYWtpbmdfZmlmdGggMnMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBzcGVha2luZ19pbm5lcm1vc3Qge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKSByb3RhdGUoMGRlZyk7XG4gIH1cbiAgMjUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTIpIHJvdGF0ZSgtNWRlZyk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNzUpIHJvdGF0ZSgwZGVnKTtcbiAgfVxuICA3NSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43NDUpIHJvdGF0ZSg1ZGVnKTtcbiAgfVxufVxuLmlubmVybW9zdC5waVNwZWFraW5nIHtcbiAgYW5pbWF0aW9uOiBzcGVha2luZ19pbm5lcm1vc3QgMnMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuLyogd2F2ZSBhbmltYXRpb24gdG8gaW5kaWNhdGUgdXNlciBpcyBzcGVha2luZyAqL1xuQGtleWZyYW1lcyB1c2VyU3BlYWtpbmdBbmltYXRpb24ge1xuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuMDUpIHNjYWxlWCh2YXIoLS13aWR0aC1mYWN0b3IpKVxuICAgICAgdHJhbnNsYXRlWChjYWxjKC01MCUgKyB2YXIoLS1zcHJlYWQtYW1vdW50KSkpO1xuICB9XG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDEpIHNjYWxlWCh2YXIoLS13aWR0aC1mYWN0b3IpKVxuICAgICAgdHJhbnNsYXRlWChjYWxjKC01MCUgKyB2YXIoLS1zcHJlYWQtYW1vdW50KSkpO1xuICB9XG59XG4vKiB1c2VyIHNwZWFraW5nIG9zY2lsbGF0aW9uIGFuaW1hdGlvbiAqL1xuQGtleWZyYW1lcyB3YXZlZm9ybV9vdXRlcm1vc3Qge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMSkgc2NhbGVYKDEpO1xuICB9XG4gIDI1JSxcbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjkpIHNjYWxlWCgwLjkpO1xuICB9XG59XG5cbkBrZXlmcmFtZXMgd2F2ZWZvcm1fc2Vjb25kIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuOSkgc2NhbGVYKDAuOSk7XG4gIH1cbiAgMjUlLFxuICA3NSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuOCkgc2NhbGVYKDAuOCk7XG4gIH1cbn1cblxuQGtleWZyYW1lcyB3YXZlZm9ybV90aGlyZCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjgpIHNjYWxlWCgwLjgpO1xuICB9XG4gIDI1JSxcbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjcpIHNjYWxlWCgwLjcpO1xuICB9XG59XG5cbkBrZXlmcmFtZXMgd2F2ZWZvcm1fZm91cnRoIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuNykgc2NhbGVYKDAuNyk7XG4gIH1cbiAgMjUlLFxuICA3NSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuNikgc2NhbGVYKDAuNik7XG4gIH1cbn1cblxuQGtleWZyYW1lcyB3YXZlZm9ybV9maWZ0aCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjYpIHNjYWxlWCgwLjYpO1xuICB9XG4gIDI1JSxcbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjUpIHNjYWxlWCgwLjUpO1xuICB9XG59XG5cbkBrZXlmcmFtZXMgd2F2ZWZvcm1faW5uZXJtb3N0IHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuNSkgc2NhbGVYKDAuNSk7XG4gIH1cbiAgMjUlLFxuICA3NSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuNCkgc2NhbGVYKDAuNCk7XG4gIH1cbn1cblxuLm91dGVybW9zdC51c2VyU3BlYWtpbmcge1xuICBhbmltYXRpb246IHdhdmVmb3JtX291dGVybW9zdCAwLjdzIGluZmluaXRlIGFsdGVybmF0ZTtcbn1cblxuLnNlY29uZC51c2VyU3BlYWtpbmcge1xuICBhbmltYXRpb246IHdhdmVmb3JtX3NlY29uZCAwLjY1cyBpbmZpbml0ZSBhbHRlcm5hdGU7XG59XG5cbi50aGlyZC51c2VyU3BlYWtpbmcge1xuICBhbmltYXRpb246IHdhdmVmb3JtX3RoaXJkIDAuNnMgaW5maW5pdGUgYWx0ZXJuYXRlO1xufVxuXG4uZm91cnRoLnVzZXJTcGVha2luZyB7XG4gIGFuaW1hdGlvbjogd2F2ZWZvcm1fZm91cnRoIDAuNTVzIGluZmluaXRlIGFsdGVybmF0ZTtcbn1cblxuLmZpZnRoLnVzZXJTcGVha2luZyB7XG4gIGFuaW1hdGlvbjogd2F2ZWZvcm1fZmlmdGggMC41cyBpbmZpbml0ZSBhbHRlcm5hdGU7XG59XG5cbi5pbm5lcm1vc3QudXNlclNwZWFraW5nIHtcbiAgYW5pbWF0aW9uOiB3YXZlZm9ybV9pbm5lcm1vc3QgMC40NXMgaW5maW5pdGUgYWx0ZXJuYXRlO1xufVxuXG4vKiBmbGlwY2FyZCBhbmltYXRpb24gdG8gaW5kaWNhdGUgU2F5LCBQaSBpcyB0cmFuc2NyaWJpbmcgYXVkaW8gdG8gdGV4dCAqL1xuQGtleWZyYW1lcyB0cmFuc2NyaWJpbmdGbGlwIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogcm90YXRlWSgwZGVnKTtcbiAgICBmaWxsOiB2YXIoLS1vcmlnaW5hbC1jb2xvcik7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZVkoMTgwZGVnKTtcbiAgICBmaWxsOiB2YXIoLS10cmFuc2NyaWJpbmctY29sb3IpO1xuICB9XG59XG5cbi5vdXRlcm1vc3QudHJhbnNjcmliaW5nIHtcbiAgLS1vcmlnaW5hbC1jb2xvcjogI2U0ZjJkMTtcbiAgLS10cmFuc2NyaWJpbmctY29sb3I6ICNiM2UwZmU7XG4gIGFuaW1hdGlvbjogdHJhbnNjcmliaW5nRmxpcCAxLjVzIGluZmluaXRlO1xufVxuXG4uc2Vjb25kLnRyYW5zY3JpYmluZyB7XG4gIC0tb3JpZ2luYWwtY29sb3I6ICNjY2U4YjU7XG4gIC0tdHJhbnNjcmliaW5nLWNvbG9yOiAjODljMmZmO1xuICBhbmltYXRpb246IHRyYW5zY3JpYmluZ0ZsaXAgMS42cyBpbmZpbml0ZTtcbn1cblxuLnRoaXJkLnRyYW5zY3JpYmluZyB7XG4gIC0tb3JpZ2luYWwtY29sb3I6ICNiM2RiOTU7XG4gIC0tdHJhbnNjcmliaW5nLWNvbG9yOiAjNWZhNGZmO1xuICBhbmltYXRpb246IHRyYW5zY3JpYmluZ0ZsaXAgMS43cyBpbmZpbml0ZTtcbn1cblxuLmZvdXJ0aC50cmFuc2NyaWJpbmcge1xuICAtLW9yaWdpbmFsLWNvbG9yOiAjOWJkMDc4O1xuICAtLXRyYW5zY3JpYmluZy1jb2xvcjogIzM1ODZmZjtcbiAgYW5pbWF0aW9uOiB0cmFuc2NyaWJpbmdGbGlwIDEuOHMgaW5maW5pdGU7XG59XG5cbi5maWZ0aC50cmFuc2NyaWJpbmcge1xuICAtLW9yaWdpbmFsLWNvbG9yOiAjODNjNTVjO1xuICAtLXRyYW5zY3JpYmluZy1jb2xvcjogIzBiNjllMztcbiAgYW5pbWF0aW9uOiB0cmFuc2NyaWJpbmdGbGlwIDEuOXMgaW5maW5pdGU7XG59XG5cbi5pbm5lcm1vc3QudHJhbnNjcmliaW5nIHtcbiAgLS1vcmlnaW5hbC1jb2xvcjogIzQyOGEyZjtcbiAgLS10cmFuc2NyaWJpbmctY29sb3I6ICMwMDUzYmY7XG4gIGFuaW1hdGlvbjogdHJhbnNjcmliaW5nRmxpcCAycyBpbmZpbml0ZTtcbn1cblxuLyogaGVhcnRiZWF0IGFuaW1hdGlvbiB0byBpbmRpY2F0ZSBQaSBpcyBwcmVwYXJpbmcgdG8gc3BlYWsgKi9cbkBrZXlmcmFtZXMgaGVhcnRiZWF0IHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIG9wYWNpdHk6IDE7XG4gICAgZmlsbDogdmFyKC0tb3JpZ2luYWwtY29sb3IpO1xuICB9XG4gIDUwJSB7XG4gICAgb3BhY2l0eTogMC41O1xuICAgIGZpbGw6IHJnYigyNDUgMjM4IDIyMyk7XG4gIH1cbn1cblxuLm91dGVybW9zdC5sb2FkaW5nIHtcbiAgLS1vcmlnaW5hbC1jb2xvcjogI2U0ZjJkMTtcbiAgYW5pbWF0aW9uOiBoZWFydGJlYXQgMnMgaW5maW5pdGU7XG4gIGFuaW1hdGlvbi1kZWxheTogMHM7XG59XG5cbi5zZWNvbmQubG9hZGluZyB7XG4gIC0tb3JpZ2luYWwtY29sb3I6ICNjY2U4YjU7XG4gIGFuaW1hdGlvbjogaGVhcnRiZWF0IDJzIGluZmluaXRlO1xuICBhbmltYXRpb24tZGVsYXk6IDAuNHM7XG59XG5cbi50aGlyZC5sb2FkaW5nIHtcbiAgLS1vcmlnaW5hbC1jb2xvcjogI2IzZGI5NTtcbiAgYW5pbWF0aW9uOiBoZWFydGJlYXQgMnMgaW5maW5pdGU7XG4gIGFuaW1hdGlvbi1kZWxheTogMC44cztcbn1cblxuLmZvdXJ0aC5sb2FkaW5nIHtcbiAgLS1vcmlnaW5hbC1jb2xvcjogIzliZDA3ODtcbiAgYW5pbWF0aW9uOiBoZWFydGJlYXQgMnMgaW5maW5pdGU7XG4gIGFuaW1hdGlvbi1kZWxheTogMS4ycztcbn1cblxuLmZpZnRoLmxvYWRpbmcge1xuICAtLW9yaWdpbmFsLWNvbG9yOiAjODNjNTVjO1xuICBhbmltYXRpb246IGhlYXJ0YmVhdCAycyBpbmZpbml0ZTtcbiAgYW5pbWF0aW9uLWRlbGF5OiAxLjZzO1xufVxuXG4uaW5uZXJtb3N0LmxvYWRpbmcge1xuICAtLW9yaWdpbmFsLWNvbG9yOiAjNDI4YTJmO1xuICBhbmltYXRpb246IGhlYXJ0YmVhdCAycyBpbmZpbml0ZTtcbiAgYW5pbWF0aW9uLWRlbGF5OiAycztcbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3JlY3RhbmdsZXMuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0U7O0lBRUUsbUJBQW1CO0VBQ3JCO0VBQ0E7SUFDRSxzQkFBc0I7RUFDeEI7QUFDRjtBQUNBO0VBQ0Usc0NBQXNDO0VBQ3RDLHdCQUF3QjtBQUMxQjs7QUFFQTtFQUNFOztJQUVFLG1CQUFtQjtFQUNyQjtFQUNBO0lBQ0UsdUJBQXVCO0VBQ3pCO0FBQ0Y7QUFDQTtFQUNFLG1DQUFtQztFQUNuQyx3QkFBd0I7QUFDMUI7O0FBRUE7RUFDRTs7SUFFRSxtQkFBbUI7RUFDckI7RUFDQTtJQUNFLHVCQUF1QjtFQUN6QjtBQUNGO0FBQ0E7RUFDRSxrQ0FBa0M7RUFDbEMsd0JBQXdCO0FBQzFCOztBQUVBO0VBQ0U7O0lBRUUsbUJBQW1CO0VBQ3JCO0VBQ0E7SUFDRSx1QkFBdUI7RUFDekI7QUFDRjtBQUNBO0VBQ0UsbUNBQW1DO0VBQ25DLHdCQUF3QjtBQUMxQjs7QUFFQTtFQUNFOztJQUVFLG1CQUFtQjtFQUNyQjtFQUNBO0lBQ0UsdUJBQXVCO0VBQ3pCO0FBQ0Y7QUFDQTtF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Qix5Q0FBeUM7QUFDM0M7O0FBRUE7RUFDRSx5QkFBeUI7RUFDekIsNkJBQTZCO0VBQzdCLHVDQUF1QztBQUN6Qzs7QUFFQSw2REFBNkQ7QUFDN0Q7RUFDRTs7SUFFRSxVQUFVO0lBQ1YsMkJBQTJCO0VBQzdCO0VBQ0E7SUFDRSxZQUFZO0lBQ1osc0JBQXNCO0VBQ3hCO0FBQ0Y7O0FBRUE7RUFDRSx5QkFBeUI7RUFDekIsZ0NBQWdDO0VBQ2hDLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLHlCQUF5QjtFQUN6QixnQ0FBZ0M7RUFDaEMscUJBQXFCO0FBQ3ZCOztBQUVBO0VBQ0UseUJBQXlCO0VBQ3pCLGdDQUFnQztFQUNoQyxxQkFBcUI7QUFDdkI7O0FBRUE7RUFDRSx5QkFBeUI7RUFDekIsZ0NBQWdDO0VBQ2hDLHFCQUFxQjtBQUN2Qjs7QUFFQTtFQUNFLHlCQUF5QjtFQUN6QixnQ0FBZ0M7RUFDaEMscUJBQXFCO0FBQ3ZCOztBQUVBO0VBQ0UseUJBQXlCO0VBQ3pCLGdDQUFnQztFQUNoQyxtQkFBbUI7QUFDckJcIixcInNvdXJjZXNDb250ZW50XCI6W1wiQGtleWZyYW1lcyBwdWxzZV9vdXRlcm1vc3Qge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45Mik7XFxuICB9XFxufVxcbi5vdXRlcm1vc3Qge1xcbiAgYW5pbWF0aW9uOiBwdWxzZV9vdXRlcm1vc3QgNXMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbkBrZXlmcmFtZXMgcHVsc2Vfc2Vjb25kIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODU2KTtcXG4gIH1cXG59XFxuLnNlY29uZCB7XFxuICBhbmltYXRpb246IHB1bHNlX3NlY29uZCA1cyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuQGtleWZyYW1lcyBwdWxzZV90aGlyZCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjc5Mik7XFxuICB9XFxufVxcbi50aGlyZCB7XFxuICBhbmltYXRpb246IHB1bHNlX3RoaXJkIDVzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHB1bHNlX2ZvdXJ0aCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjcyOCk7XFxuICB9XFxufVxcbi5mb3VydGgge1xcbiAgYW5pbWF0aW9uOiBwdWxzZV9mb3VydGggNXMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbkBrZXlmcmFtZXMgcHVsc2VfZmlmdGgge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC42NjQpO1xcbiAgfVxcbn1cXG4uZmlmdGgge1xcbiAgYW5pbWF0aW9uOiBwdWxzZV9maWZ0aCA1cyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuQGtleWZyYW1lcyBwdWxzZV9pbm5lcm1vc3Qge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC42KTtcXG4gIH1cXG59XFxuLmlubmVybW9zdCB7XFxuICBhbmltYXRpb246IHB1bHNlX2lubmVybW9zdCA1cyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuLyogYm91bmNlIGFuaW1hdGlvbiB0byBpbmRpY2F0ZSBQaSBpcyBwYXVzZWQgYXdhaXRpbmcgcGVybWlzc2lvbiB0byBzcGVhayAqL1xcbkBrZXlmcmFtZXMgYm91bmNlX291dGVybW9zdCB7XFxuICAwJSxcXG4gIDIwJSxcXG4gIDUwJSxcXG4gIDgwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XFxuICB9XFxuICA0MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUlKTtcXG4gIH1cXG4gIDYwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMyUpO1xcbiAgfVxcbn1cXG4ub3V0ZXJtb3N0LnBhdXNlZCB7XFxuICBhbmltYXRpb24tbmFtZTogYm91bmNlX291dGVybW9zdDtcXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XFxuICBhbmltYXRpb24taXRlcmF0aW9uLWNvdW50OiBpbmZpbml0ZTtcXG59XFxuXFxuQGtleWZyYW1lcyBib3VuY2Vfc2Vjb25kIHtcXG4gIDAlLFxcbiAgMjAlLFxcbiAgNTAlLFxcbiAgODAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcXG4gIH1cXG4gIDQwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNS44JSk7XFxuICB9XFxuICA2MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTMuNDglKTtcXG4gIH1cXG59XFxuLnNlY29uZC5wYXVzZWQge1xcbiAgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZV9zZWNvbmQ7XFxuICBhbmltYXRpb24tZHVyYXRpb246IDJzO1xcbiAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGU7XFxufVxcblxcbkBrZXlmcmFtZXMgYm91bmNlX3RoaXJkIHtcXG4gIDAlLFxcbiAgMjAlLFxcbiAgNTAlLFxcbiAgODAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcXG4gIH1cXG4gIDQwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNi42JSk7XFxuICB9XFxuICA2MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTMuOTYlKTtcXG4gIH1cXG59XFxuLnRoaXJkLnBhdXNlZCB7XFxuICBhbmltYXRpb24tbmFtZTogYm91bmNlX3RoaXJkO1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcXG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIGJvdW5jZV9mb3VydGgge1xcbiAgMCUsXFxuICAyMCUsXFxuICA1MCUsXFxuICA4MCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xcbiAgfVxcbiAgNDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC03LjQlKTtcXG4gIH1cXG4gIDYwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNC40NCUpO1xcbiAgfVxcbn1cXG4uZm91cnRoLnBhdXNlZCB7XFxuICBhbmltYXRpb24tbmFtZTogYm91bmNlX2ZvdXJ0aDtcXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XFxuICBhbmltYXRpb24taXRlcmF0aW9uLWNvdW50OiBpbmZpbml0ZTtcXG59XFxuXFxuQGtleWZyYW1lcyBib3VuY2VfZmlmdGgge1xcbiAgMCUsXFxuICAyMCUsXFxuICA1MCUsXFxuICA4MCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xcbiAgfVxcbiAgNDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC04LjIlKTtcXG4gIH1cXG4gIDYwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNC45MiUpO1xcbiAgfVxcbn1cXG4uZmlmdGgucGF1c2VkIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2VfZmlmdGg7XFxuICBhbmltYXRpb24tZHVyYXRpb246IDJzO1xcbiAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGU7XFxufVxcblxcbkBrZXlmcmFtZXMgYm91bmNlX2lubmVybW9zdCB7XFxuICAwJSxcXG4gIDIwJSxcXG4gIDUwJSxcXG4gIDgwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XFxuICB9XFxuICA0MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTklKTtcXG4gIH1cXG4gIDYwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNS40JSk7XFxuICB9XFxufVxcbi5pbm5lcm1vc3QucGF1c2VkIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2VfaW5uZXJtb3N0O1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcXG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xcbn1cXG5cXG4vKiBwbGF5ZnVsIGFuaW1hdGlvbiB0byBpbmRpY2F0ZSBQaSBpcyBzcGVha2luZyAqL1xcbkBrZXlmcmFtZXMgc3BlYWtpbmdfb3V0ZXJtb3N0IHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSkgcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgMjUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjk5NSk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOSk7XFxuICB9XFxuICA3NSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODk1KTtcXG4gIH1cXG59XFxuLm91dGVybW9zdC5waVNwZWFraW5nIHtcXG4gIGFuaW1hdGlvbjogc3BlYWtpbmdfb3V0ZXJtb3N0IDJzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX3NlY29uZCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpIHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDI1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45OCkgcm90YXRlKC0xZGVnKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44Nykgcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgNzUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjg2NSkgcm90YXRlKDFkZWcpO1xcbiAgfVxcbn1cXG4uc2Vjb25kLnBpU3BlYWtpbmcge1xcbiAgYW5pbWF0aW9uOiBzcGVha2luZ19zZWNvbmQgMnMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbkBrZXlmcmFtZXMgc3BlYWtpbmdfdGhpcmQge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKSByb3RhdGUoMGRlZyk7XFxuICB9XFxuICAyNSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTY1KSByb3RhdGUoLTJkZWcpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjg0KSByb3RhdGUoMGRlZyk7XFxuICB9XFxuICA3NSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODM1KSByb3RhdGUoMmRlZyk7XFxuICB9XFxufVxcbi50aGlyZC5waVNwZWFraW5nIHtcXG4gIGFuaW1hdGlvbjogc3BlYWtpbmdfdGhpcmQgMnMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbkBrZXlmcmFtZXMgc3BlYWtpbmdfZm91cnRoIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSkgcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgMjUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjk1KSByb3RhdGUoLTNkZWcpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjgxKSByb3RhdGUoMGRlZyk7XFxuICB9XFxuICA3NSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODA1KSByb3RhdGUoM2RlZyk7XFxuICB9XFxufVxcbi5mb3VydGgucGlTcGVha2luZyB7XFxuICBhbmltYXRpb246IHNwZWFraW5nX2ZvdXJ0aCAycyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuQGtleWZyYW1lcyBzcGVha2luZ19maWZ0aCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpIHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDI1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45MzUpIHJvdGF0ZSgtNGRlZyk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNzgpIHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43NzUpIHJvdGF0ZSg0ZGVnKTtcXG4gIH1cXG59XFxuLmZpZnRoLnBpU3BlYWtpbmcge1xcbiAgYW5pbWF0aW9uOiBzcGVha2luZ19maWZ0aCAycyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuQGtleWZyYW1lcyBzcGVha2luZ19pbm5lcm1vc3Qge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKSByb3RhdGUoMGRlZyk7XFxuICB9XFxuICAyNSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTIpIHJvdGF0ZSgtNWRlZyk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNzUpIHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43NDUpIHJvdGF0ZSg1ZGVnKTtcXG4gIH1cXG59XFxuLmlubmVybW9zdC5waVNwZWFraW5nIHtcXG4gIGFuaW1hdGlvbjogc3BlYWtpbmdfaW5uZXJtb3N0IDJzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG4vKiB3YXZlIGFuaW1hdGlvbiB0byBpbmRpY2F0ZSB1c2VyIGlzIHNwZWFraW5nICovXFxuQGtleWZyYW1lcyB1c2VyU3BlYWtpbmdBbmltYXRpb24ge1xcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC4wNSkgc2NhbGVYKHZhcigtLXdpZHRoLWZhY3RvcikpXFxuICAgICAgdHJhbnNsYXRlWChjYWxjKC01MCUgKyB2YXIoLS1zcHJlYWQtYW1vdW50KSkpO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDEpIHNjYWxlWCh2YXIoLS13aWR0aC1mYWN0b3IpKVxcbiAgICAgIHRyYW5zbGF0ZVgoY2FsYygtNTAlICsgdmFyKC0tc3ByZWFkLWFtb3VudCkpKTtcXG4gIH1cXG59XFxuLyogdXNlciBzcGVha2luZyBvc2NpbGxhdGlvbiBhbmltYXRpb24gKi9cXG5Aa2V5ZnJhbWVzIHdhdmVmb3JtX291dGVybW9zdCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgxKSBzY2FsZVgoMSk7XFxuICB9XFxuICAyNSUsXFxuICA3NSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjkpIHNjYWxlWCgwLjkpO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIHdhdmVmb3JtX3NlY29uZCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjkpIHNjYWxlWCgwLjkpO1xcbiAgfVxcbiAgMjUlLFxcbiAgNzUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC44KSBzY2FsZVgoMC44KTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyB3YXZlZm9ybV90aGlyZCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjgpIHNjYWxlWCgwLjgpO1xcbiAgfVxcbiAgMjUlLFxcbiAgNzUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC43KSBzY2FsZVgoMC43KTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyB3YXZlZm9ybV9mb3VydGgge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC43KSBzY2FsZVgoMC43KTtcXG4gIH1cXG4gIDI1JSxcXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuNikgc2NhbGVYKDAuNik7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgd2F2ZWZvcm1fZmlmdGgge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC42KSBzY2FsZVgoMC42KTtcXG4gIH1cXG4gIDI1JSxcXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuNSkgc2NhbGVYKDAuNSk7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgd2F2ZWZvcm1faW5uZXJtb3N0IHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuNSkgc2NhbGVYKDAuNSk7XFxuICB9XFxuICAyNSUsXFxuICA3NSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjQpIHNjYWxlWCgwLjQpO1xcbiAgfVxcbn1cXG5cXG4ub3V0ZXJtb3N0LnVzZXJTcGVha2luZyB7XFxuICBhbmltYXRpb246IHdhdmVmb3JtX291dGVybW9zdCAwLjdzIGluZmluaXRlIGFsdGVybmF0ZTtcXG59XFxuXFxuLnNlY29uZC51c2VyU3BlYWtpbmcge1xcbiAgYW5pbWF0aW9uOiB3YXZlZm9ybV9zZWNvbmQgMC42NXMgaW5maW5pdGUgYWx0ZXJuYXRlO1xcbn1cXG5cXG4udGhpcmQudXNlclNwZWFraW5nIHtcXG4gIGFuaW1hdGlvbjogd2F2ZWZvcm1fdGhpcmQgMC42cyBpbmZpbml0ZSBhbHRlcm5hdGU7XFxufVxcblxcbi5mb3VydGgudXNlclNwZWFraW5nIHtcXG4gIGFuaW1hdGlvbjogd2F2ZWZvcm1fZm91cnRoIDAuNTVzIGluZmluaXRlIGFsdGVybmF0ZTtcXG59XFxuXFxuLmZpZnRoLnVzZXJTcGVha2luZyB7XFxuICBhbmltYXRpb246IHdhdmVmb3JtX2ZpZnRoIDAuNXMgaW5maW5pdGUgYWx0ZXJuYXRlO1xcbn1cXG5cXG4uaW5uZXJtb3N0LnVzZXJTcGVha2luZyB7XFxuICBhbmltYXRpb246IHdhdmVmb3JtX2lubmVybW9zdCAwLjQ1cyBpbmZpbml0ZSBhbHRlcm5hdGU7XFxufVxcblxcbi8qIGZsaXBjYXJkIGFuaW1hdGlvbiB0byBpbmRpY2F0ZSBTYXksIFBpIGlzIHRyYW5zY3JpYmluZyBhdWRpbyB0byB0ZXh0ICovXFxuQGtleWZyYW1lcyB0cmFuc2NyaWJpbmdGbGlwIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogcm90YXRlWSgwZGVnKTtcXG4gICAgZmlsbDogdmFyKC0tb3JpZ2luYWwtY29sb3IpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiByb3RhdGVZKDE4MGRlZyk7XFxuICAgIGZpbGw6IHZhcigtLXRyYW5zY3JpYmluZy1jb2xvcik7XFxuICB9XFxufVxcblxcbi5vdXRlcm1vc3QudHJhbnNjcmliaW5nIHtcXG4gIC0tb3JpZ2luYWwtY29sb3I6ICNlNGYyZDE7XFxuICAtLXRyYW5zY3JpYmluZy1jb2xvcjogI2IzZTBmZTtcXG4gIGFuaW1hdGlvbjogdHJhbnNjcmliaW5nRmxpcCAxLjVzIGluZmluaXRlO1xcbn1cXG5cXG4uc2Vjb25kLnRyYW5zY3JpYmluZyB7XFxuICAtLW9yaWdpbmFsLWNvbG9yOiAjY2NlOGI1O1xcbiAgLS10cmFuc2NyaWJpbmctY29sb3I6ICM4OWMyZmY7XFxuICBhbmltYXRpb246IHRyYW5zY3JpYmluZ0ZsaXAgMS42cyBpbmZpbml0ZTtcXG59XFxuXFxuLnRoaXJkLnRyYW5zY3JpYmluZyB7XFxuICAtLW9yaWdpbmFsLWNvbG9yOiAjYjNkYjk1O1xcbiAgLS10cmFuc2NyaWJpbmctY29sb3I6ICM1ZmE0ZmY7XFxuICBhbmltYXRpb246IHRyYW5zY3JpYmluZ0ZsaXAgMS43cyBpbmZpbml0ZTtcXG59XFxuXFxuLmZvdXJ0aC50cmFuc2NyaWJpbmcge1xcbiAgLS1vcmlnaW5hbC1jb2xvcjogIzliZDA3ODtcXG4gIC0tdHJhbnNjcmliaW5nLWNvbG9yOiAjMzU4NmZmO1xcbiAgYW5pbWF0aW9uOiB0cmFuc2NyaWJpbmdGbGlwIDEuOHMgaW5maW5pdGU7XFxufVxcblxcbi5maWZ0aC50cmFuc2NyaWJpbmcge1xcbiAgLS1vcmlnaW5hbC1jb2xvcjogIzgzYzU1YztcXG4gIC0tdHJhbnNjcmliaW5nLWNvbG9yOiAjMGI2OWUzO1xcbiAgYW5pbWF0aW9uOiB0cmFuc2NyaWJpbmdGbGlwIDEuOXMgaW5maW5pdGU7XFxufVxcblxcbi5pbm5lcm1vc3QudHJhbnNjcmliaW5nIHtcXG4gIC0tb3JpZ2luYWwtY29sb3I6ICM0MjhhMmY7XFxuICAtLXRyYW5zY3JpYmluZy1jb2xvcjogIzAwNTNiZjtcXG4gIGFuaW1hdGlvbjogdHJhbnNjcmliaW5nRmxpcCAycyBpbmZpbml0ZTtcXG59XFxuXFxuLyogaGVhcnRiZWF0IGFuaW1hdGlvbiB0byBpbmRpY2F0ZSBQaSBpcyBwcmVwYXJpbmcgdG8gc3BlYWsgKi9cXG5Aa2V5ZnJhbWVzIGhlYXJ0YmVhdCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICBvcGFjaXR5OiAxO1xcbiAgICBmaWxsOiB2YXIoLS1vcmlnaW5hbC1jb2xvcik7XFxuICB9XFxuICA1MCUge1xcbiAgICBvcGFjaXR5OiAwLjU7XFxuICAgIGZpbGw6IHJnYigyNDUgMjM4IDIyMyk7XFxuICB9XFxufVxcblxcbi5vdXRlcm1vc3QubG9hZGluZyB7XFxuICAtLW9yaWdpbmFsLWNvbG9yOiAjZTRmMmQxO1xcbiAgYW5pbWF0aW9uOiBoZWFydGJlYXQgMnMgaW5maW5pdGU7XFxuICBhbmltYXRpb24tZGVsYXk6IDBzO1xcbn1cXG5cXG4uc2Vjb25kLmxvYWRpbmcge1xcbiAgLS1vcmlnaW5hbC1jb2xvcjogI2NjZThiNTtcXG4gIGFuaW1hdGlvbjogaGVhcnRiZWF0IDJzIGluZmluaXRlO1xcbiAgYW5pbWF0aW9uLWRlbGF5OiAwLjRzO1xcbn1cXG5cXG4udGhpcmQubG9hZGluZyB7XFxuICAtLW9yaWdpbmFsLWNvbG9yOiAjYjNkYjk1O1xcbiAgYW5pbWF0aW9uOiBoZWFydGJlYXQgMnMgaW5maW5pdGU7XFxuICBhbmltYXRpb24tZGVsYXk6IDAuOHM7XFxufVxcblxcbi5mb3VydGgubG9hZGluZyB7XFxuICAtLW9yaWdpbmFsLWNvbG9yOiAjOWJkMDc4O1xcbiAgYW5pbWF0aW9uOiBoZWFydGJlYXQgMnMgaW5maW5pdGU7XFxuICBhbmltYXRpb24tZGVsYXk6IDEuMnM7XFxufVxcblxcbi5maWZ0aC5sb2FkaW5nIHtcXG4gIC0tb3JpZ2luYWwtY29sb3I6ICM4M2M1NWM7XFxuICBhbmltYXRpb246IGhlYXJ0YmVhdCAycyBpbmZpbml0ZTtcXG4gIGFuaW1hdGlvbi1kZWxheTogMS42cztcXG59XFxuXFxuLmlubmVybW9zdC5sb2FkaW5nIHtcXG4gIC0tb3JpZ2luYWwtY29sb3I6ICM0MjhhMmY7XFxuICBhbmltYXRpb246IGhlYXJ0YmVhdCAycyBpbmZpbml0ZTtcXG4gIGFuaW1hdGlvbi1kZWxheTogMnM7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgQGtleWZyYW1lcyBwdWxzZSB7XG4gIDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkpO1xuICB9XG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gIH1cbn1cbiNzYXlwaS10YWxrQnV0dG9uLFxuLnBsYXktYnV0dG9uIHtcbiAgbWFyZ2luLXRvcDogMC4yNXJlbTtcbiAgYm9yZGVyLXJhZGl1czogMThweDtcbiAgd2lkdGg6IDEyMHB4O1xuICBkaXNwbGF5OiBibG9jazsgLyogRm9yIFNhZmFyaSAqL1xufVxuXG5odG1sOm5vdCguZmlyZWZveC1hbmRyb2lkKSAjc2F5cGktdGFsa0J1dHRvbjphY3RpdmUgLndhdmVmb3JtLFxuI3NheXBpLXRhbGtCdXR0b24uYWN0aXZlIC53YXZlZm9ybSB7XG4gIGFuaW1hdGlvbjogcHVsc2UgMXMgaW5maW5pdGU7XG59XG4jc2F5cGktdGFsa0J1dHRvbiAud2F2ZWZvcm0ge1xuICBmaWxsOiAjNzc2ZDZkO1xufVxuI3NheXBpLXRhbGtCdXR0b24uYXV0b1N1Ym1pdCAud2F2ZWZvcm0ge1xuICBmaWxsOiByZ2IoNjUgMTM4IDQ3KTsgLyogUGkncyB0ZXh0LWJyYW5kLWdyZWVuLTYwMCAqL1xufVxuLmhpZGRlbiB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG4jc2F5cGktcGxheUJ1dHRvbi5wbGF5LWJ1dHRvbiB7XG4gIC8qIHBvc2l0aW9uIG92ZXIgdGhlIHRhbGsgYnV0dG9uLCBidXQgdW5kZXIgYW55IGNvbnRyb2xzICovXG4gIHotaW5kZXg6IDcwOyAvKiB0YWxrIGJ1dHRvbiB6LWluZGV4IGlzIDU5IG9yIDYwICovXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMCk7IC8qIHRyYW5zcGFyZW50IHdpdGhvdXQgaG9sZXMgKi9cbiAgYm9yZGVyOiBub25lO1xufVxuYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvdGFsa0J1dHRvbi5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDRTtJQUNFLG1CQUFtQjtFQUNyQjtFQUNBO0lBQ0UscUJBQXFCO0VBQ3ZCO0VBQ0E7SUFDRSxtQkFBbUI7RUFDckI7QUFDRjtBQUNBOztFQUVFLG1CQUFtQjtFQUNuQixtQkFBbUI7RUFDbkIsWUFBWTtFQUNaLGNBQWMsRUFBRSxlQUFlO0FBQ2pDOztBQUVBOztFQUVFLDRCQUE0QjtBQUM5QjtBQUNBO0VBQ0UsYUFBYTtBQUNmO0FBQ0E7RUFDRSxvQkFBb0IsRUFBRSw4QkFBOEI7QUFDdEQ7QUFDQTtFQUNFLGFBQWE7QUFDZjtBQUNBO0VBQ0UsMERBQTBEO0VBQzFELFdBQVcsRUFBRSxvQ0FBb0M7RUFDakQsa0NBQWtDLEVBQUUsOEJBQThCO0VBQ2xFLFlBQVk7QUFDZFwiLFwic291cmNlc0NvbnRlbnRcIjpbXCJAa2V5ZnJhbWVzIHB1bHNlIHtcXG4gIDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45KTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgfVxcbn1cXG4jc2F5cGktdGFsa0J1dHRvbixcXG4ucGxheS1idXR0b24ge1xcbiAgbWFyZ2luLXRvcDogMC4yNXJlbTtcXG4gIGJvcmRlci1yYWRpdXM6IDE4cHg7XFxuICB3aWR0aDogMTIwcHg7XFxuICBkaXNwbGF5OiBibG9jazsgLyogRm9yIFNhZmFyaSAqL1xcbn1cXG5cXG5odG1sOm5vdCguZmlyZWZveC1hbmRyb2lkKSAjc2F5cGktdGFsa0J1dHRvbjphY3RpdmUgLndhdmVmb3JtLFxcbiNzYXlwaS10YWxrQnV0dG9uLmFjdGl2ZSAud2F2ZWZvcm0ge1xcbiAgYW5pbWF0aW9uOiBwdWxzZSAxcyBpbmZpbml0ZTtcXG59XFxuI3NheXBpLXRhbGtCdXR0b24gLndhdmVmb3JtIHtcXG4gIGZpbGw6ICM3NzZkNmQ7XFxufVxcbiNzYXlwaS10YWxrQnV0dG9uLmF1dG9TdWJtaXQgLndhdmVmb3JtIHtcXG4gIGZpbGw6IHJnYig2NSAxMzggNDcpOyAvKiBQaSdzIHRleHQtYnJhbmQtZ3JlZW4tNjAwICovXFxufVxcbi5oaWRkZW4ge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuI3NheXBpLXBsYXlCdXR0b24ucGxheS1idXR0b24ge1xcbiAgLyogcG9zaXRpb24gb3ZlciB0aGUgdGFsayBidXR0b24sIGJ1dCB1bmRlciBhbnkgY29udHJvbHMgKi9cXG4gIHotaW5kZXg6IDcwOyAvKiB0YWxrIGJ1dHRvbiB6LWluZGV4IGlzIDU5IG9yIDYwICovXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDApOyAvKiB0cmFuc3BhcmVudCB3aXRob3V0IGhvbGVzICovXFxuICBib3JkZXI6IG5vbmU7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gIGh0bWwubW9iaWxlLXZpZXcge1xuICAgIC8qIFBpIGNvbnRyb2xzOiBleHBlcmllbmNlcyAqL1xuICAgIC8qIFBpIGNvbnRyb2xzOiBtdXRlL3VubXV0ZSAqL1xuICB9XG4gIGh0bWwubW9iaWxlLXZpZXcgI3NheXBpLXBhbmVsLFxuICBodG1sLm1vYmlsZS12aWV3IC5wbGF5LWJ1dHRvbiB7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgcG9zaXRpb246IGZpeGVkO1xuICAgIGxlZnQ6IDA7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNDUsIDIzOCwgMjIzLCAwLjk4KTtcbiAgICBoZWlnaHQ6IDEwMHZoO1xuICAgIHRvcDogMDtcbiAgICBwYWRkaW5nOiA1JTtcbiAgfVxuICBodG1sLm1vYmlsZS12aWV3ICNzYXlwaS10YWxrQnV0dG9uIHtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBoZWlnaHQ6IDEwMCU7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgYm9yZGVyLXJhZGl1czogMDtcbiAgICBtYXJnaW46IDA7XG4gIH1cbiAgaHRtbC5tb2JpbGUtdmlldyAjX19uZXh0ID4gbWFpbiA+IGRpdiA+IGRpdiA+IGRpdi5maXhlZC50b3AtNC5yaWdodC02ID4gYnV0dG9uLFxuICBodG1sLm1vYmlsZS12aWV3IGRpdltkYXRhLXByb2plY3Rpb24taWQ9XCIxMlwiXSA+IGJ1dHRvbiB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgyKTtcbiAgICB6LWluZGV4OiA1MDtcbiAgfVxuICBodG1sLm1vYmlsZS12aWV3IGJ1dHRvbltkYXRhLXByb2plY3Rpb24taWQ9XCIxNlwiXSA+IGRpdltkYXRhLXByb2plY3Rpb24taWQ9XCIxN1wiXSxcbiAgaHRtbC5tb2JpbGUtdmlldyBidXR0b25bZGF0YS1wcm9qZWN0aW9uLWlkPVwiMTZcIl0gPiBkaXZbZGF0YS1wcm9qZWN0aW9uLWlkPVwiMThcIl0ge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMikgIWltcG9ydGFudDtcbiAgICB6LWluZGV4OiA1MDtcbiAgfVxuICBodG1sLm1vYmlsZS12aWV3ICNzYXlwaS1leGl0QnV0dG9uIHtcbiAgICBwb3NpdGlvbjogZml4ZWQ7XG4gICAgdG9wOiAxMHB4O1xuICAgIGxlZnQ6IDEycHg7XG4gICAgd2lkdGg6IDUycHg7XG4gICAgaGVpZ2h0OiA1MnB4O1xuICAgIHBhZGRpbmc6IDZweDtcbiAgICBib3JkZXI6IDA7XG4gICAgei1pbmRleDogNjA7XG4gIH1cbiAgaHRtbC5tb2JpbGUtdmlldyAjc2F5cGktZm9vdGVyIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG59YCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvbW9iaWxlLnNjc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDRTtJQXFCRSw2QkFBQTtJQU9BLDZCQUFBO0VBekJGO0VBRkU7O0lBRUUsV0FBQTtJQUNBLGVBQUE7SUFDQSxPQUFBO0lBQ0EsMkNBQUE7SUFFQSxhQUFBO0lBQ0EsTUFBQTtJQUNBLFdBQUE7RUFHSjtFQUFFO0lBQ0UsV0FBQTtJQUNBLFlBQUE7SUFDQSw2QkFBQTtJQUNBLGdCQUFBO0lBQ0EsU0FBQTtFQUVKO0VBRUU7O0lBRUUsbUJBQUE7SUFDQSxXQUFBO0VBQUo7RUFLSTs7SUFFRSw4QkFBQTtJQUNBLFdBQUE7RUFITjtFQU9FO0lBQ0UsZUFBQTtJQUNBLFNBQUE7SUFDQSxVQUFBO0lBQ0EsV0FBQTtJQUNBLFlBQUE7SUFDQSxZQUFBO0lBQ0EsU0FBQTtJQUNBLFdBQUE7RUFMSjtFQVFFO0lBQ0UsYUFBQTtFQU5KO0FBQ0ZcIixcInNvdXJjZXNDb250ZW50XCI6W1wiQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XFxuICBodG1sLm1vYmlsZS12aWV3IHtcXG4gICAgI3NheXBpLXBhbmVsLFxcbiAgICAucGxheS1idXR0b24ge1xcbiAgICAgIHdpZHRoOiAxMDAlO1xcbiAgICAgIHBvc2l0aW9uOiBmaXhlZDtcXG4gICAgICBsZWZ0OiAwO1xcbiAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjQ1LCAyMzgsIDIyMywgMC45OCk7XFxuXFxuICAgICAgaGVpZ2h0OiAxMDB2aDtcXG4gICAgICB0b3A6IDA7XFxuICAgICAgcGFkZGluZzogNSU7XFxuICAgIH1cXG5cXG4gICAgI3NheXBpLXRhbGtCdXR0b24ge1xcbiAgICAgIHdpZHRoOiAxMDAlO1xcbiAgICAgIGhlaWdodDogMTAwJTtcXG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG4gICAgICBib3JkZXItcmFkaXVzOiAwO1xcbiAgICAgIG1hcmdpbjogMDtcXG4gICAgfVxcblxcbiAgICAvKiBQaSBjb250cm9sczogZXhwZXJpZW5jZXMgKi9cXG4gICAgI19fbmV4dCA+IG1haW4gPiBkaXYgPiBkaXYgPiBkaXYuZml4ZWQudG9wLTQucmlnaHQtNiA+IGJ1dHRvbixcXG4gICAgZGl2W2RhdGEtcHJvamVjdGlvbi1pZD1cXFwiMTJcXFwiXSA+IGJ1dHRvbiB7XFxuICAgICAgdHJhbnNmb3JtOiBzY2FsZSgyKTtcXG4gICAgICB6LWluZGV4OiA1MDtcXG4gICAgfVxcblxcbiAgICAvKiBQaSBjb250cm9sczogbXV0ZS91bm11dGUgKi9cXG4gICAgYnV0dG9uW2RhdGEtcHJvamVjdGlvbi1pZD1cXFwiMTZcXFwiXSB7XFxuICAgICAgPiBkaXZbZGF0YS1wcm9qZWN0aW9uLWlkPVxcXCIxN1xcXCJdLFxcbiAgICAgID4gZGl2W2RhdGEtcHJvamVjdGlvbi1pZD1cXFwiMThcXFwiXSB7XFxuICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDIpICFpbXBvcnRhbnQ7XFxuICAgICAgICB6LWluZGV4OiA1MDtcXG4gICAgICB9XFxuICAgIH1cXG5cXG4gICAgI3NheXBpLWV4aXRCdXR0b24ge1xcbiAgICAgIHBvc2l0aW9uOiBmaXhlZDtcXG4gICAgICB0b3A6IDEwcHg7XFxuICAgICAgbGVmdDogMTJweDtcXG4gICAgICB3aWR0aDogNTJweDtcXG4gICAgICBoZWlnaHQ6IDUycHg7XFxuICAgICAgcGFkZGluZzogNnB4O1xcbiAgICAgIGJvcmRlcjogMDtcXG4gICAgICB6LWluZGV4OiA2MDtcXG4gICAgfVxcblxcbiAgICAjc2F5cGktZm9vdGVyIHtcXG4gICAgICBkaXNwbGF5OiBub25lO1xcbiAgICB9XFxuICB9XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFIgPSB0eXBlb2YgUmVmbGVjdCA9PT0gJ29iamVjdCcgPyBSZWZsZWN0IDogbnVsbFxudmFyIFJlZmxlY3RBcHBseSA9IFIgJiYgdHlwZW9mIFIuYXBwbHkgPT09ICdmdW5jdGlvbidcbiAgPyBSLmFwcGx5XG4gIDogZnVuY3Rpb24gUmVmbGVjdEFwcGx5KHRhcmdldCwgcmVjZWl2ZXIsIGFyZ3MpIHtcbiAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwodGFyZ2V0LCByZWNlaXZlciwgYXJncyk7XG4gIH1cblxudmFyIFJlZmxlY3RPd25LZXlzXG5pZiAoUiAmJiB0eXBlb2YgUi5vd25LZXlzID09PSAnZnVuY3Rpb24nKSB7XG4gIFJlZmxlY3RPd25LZXlzID0gUi5vd25LZXlzXG59IGVsc2UgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcbiAgUmVmbGVjdE93bktleXMgPSBmdW5jdGlvbiBSZWZsZWN0T3duS2V5cyh0YXJnZXQpIHtcbiAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGFyZ2V0KVxuICAgICAgLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHRhcmdldCkpO1xuICB9O1xufSBlbHNlIHtcbiAgUmVmbGVjdE93bktleXMgPSBmdW5jdGlvbiBSZWZsZWN0T3duS2V5cyh0YXJnZXQpIHtcbiAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGFyZ2V0KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gUHJvY2Vzc0VtaXRXYXJuaW5nKHdhcm5pbmcpIHtcbiAgaWYgKGNvbnNvbGUgJiYgY29uc29sZS53YXJuKSBjb25zb2xlLndhcm4od2FybmluZyk7XG59XG5cbnZhciBOdW1iZXJJc05hTiA9IE51bWJlci5pc05hTiB8fCBmdW5jdGlvbiBOdW1iZXJJc05hTih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT09IHZhbHVlO1xufVxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIEV2ZW50RW1pdHRlci5pbml0LmNhbGwodGhpcyk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcbm1vZHVsZS5leHBvcnRzLm9uY2UgPSBvbmNlO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50c0NvdW50ID0gMDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxudmFyIGRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuZnVuY3Rpb24gY2hlY2tMaXN0ZW5lcihsaXN0ZW5lcikge1xuICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwibGlzdGVuZXJcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgRnVuY3Rpb24uIFJlY2VpdmVkIHR5cGUgJyArIHR5cGVvZiBsaXN0ZW5lcik7XG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KEV2ZW50RW1pdHRlciwgJ2RlZmF1bHRNYXhMaXN0ZW5lcnMnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gIH0sXG4gIHNldDogZnVuY3Rpb24oYXJnKSB7XG4gICAgaWYgKHR5cGVvZiBhcmcgIT09ICdudW1iZXInIHx8IGFyZyA8IDAgfHwgTnVtYmVySXNOYU4oYXJnKSkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RoZSB2YWx1ZSBvZiBcImRlZmF1bHRNYXhMaXN0ZW5lcnNcIiBpcyBvdXQgb2YgcmFuZ2UuIEl0IG11c3QgYmUgYSBub24tbmVnYXRpdmUgbnVtYmVyLiBSZWNlaXZlZCAnICsgYXJnICsgJy4nKTtcbiAgICB9XG4gICAgZGVmYXVsdE1heExpc3RlbmVycyA9IGFyZztcbiAgfVxufSk7XG5cbkV2ZW50RW1pdHRlci5pbml0ID0gZnVuY3Rpb24oKSB7XG5cbiAgaWYgKHRoaXMuX2V2ZW50cyA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICB0aGlzLl9ldmVudHMgPT09IE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzKS5fZXZlbnRzKSB7XG4gICAgdGhpcy5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG4gIH1cblxuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufTtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24gc2V0TWF4TGlzdGVuZXJzKG4pIHtcbiAgaWYgKHR5cGVvZiBuICE9PSAnbnVtYmVyJyB8fCBuIDwgMCB8fCBOdW1iZXJJc05hTihuKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdUaGUgdmFsdWUgb2YgXCJuXCIgaXMgb3V0IG9mIHJhbmdlLiBJdCBtdXN0IGJlIGEgbm9uLW5lZ2F0aXZlIG51bWJlci4gUmVjZWl2ZWQgJyArIG4gKyAnLicpO1xuICB9XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuZnVuY3Rpb24gX2dldE1heExpc3RlbmVycyh0aGF0KSB7XG4gIGlmICh0aGF0Ll9tYXhMaXN0ZW5lcnMgPT09IHVuZGVmaW5lZClcbiAgICByZXR1cm4gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gIHJldHVybiB0aGF0Ll9tYXhMaXN0ZW5lcnM7XG59XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZ2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24gZ2V0TWF4TGlzdGVuZXJzKCkge1xuICByZXR1cm4gX2dldE1heExpc3RlbmVycyh0aGlzKTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIGVtaXQodHlwZSkge1xuICB2YXIgYXJncyA9IFtdO1xuICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgYXJncy5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gIHZhciBkb0Vycm9yID0gKHR5cGUgPT09ICdlcnJvcicpO1xuXG4gIHZhciBldmVudHMgPSB0aGlzLl9ldmVudHM7XG4gIGlmIChldmVudHMgIT09IHVuZGVmaW5lZClcbiAgICBkb0Vycm9yID0gKGRvRXJyb3IgJiYgZXZlbnRzLmVycm9yID09PSB1bmRlZmluZWQpO1xuICBlbHNlIGlmICghZG9FcnJvcilcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAoZG9FcnJvcikge1xuICAgIHZhciBlcjtcbiAgICBpZiAoYXJncy5sZW5ndGggPiAwKVxuICAgICAgZXIgPSBhcmdzWzBdO1xuICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAvLyBOb3RlOiBUaGUgY29tbWVudHMgb24gdGhlIGB0aHJvd2AgbGluZXMgYXJlIGludGVudGlvbmFsLCB0aGV5IHNob3dcbiAgICAgIC8vIHVwIGluIE5vZGUncyBvdXRwdXQgaWYgdGhpcyByZXN1bHRzIGluIGFuIHVuaGFuZGxlZCBleGNlcHRpb24uXG4gICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICB9XG4gICAgLy8gQXQgbGVhc3QgZ2l2ZSBzb21lIGtpbmQgb2YgY29udGV4dCB0byB0aGUgdXNlclxuICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoJ1VuaGFuZGxlZCBlcnJvci4nICsgKGVyID8gJyAoJyArIGVyLm1lc3NhZ2UgKyAnKScgOiAnJykpO1xuICAgIGVyci5jb250ZXh0ID0gZXI7XG4gICAgdGhyb3cgZXJyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICB9XG5cbiAgdmFyIGhhbmRsZXIgPSBldmVudHNbdHlwZV07XG5cbiAgaWYgKGhhbmRsZXIgPT09IHVuZGVmaW5lZClcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHR5cGVvZiBoYW5kbGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgUmVmbGVjdEFwcGx5KGhhbmRsZXIsIHRoaXMsIGFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIHZhciBsZW4gPSBoYW5kbGVyLmxlbmd0aDtcbiAgICB2YXIgbGlzdGVuZXJzID0gYXJyYXlDbG9uZShoYW5kbGVyLCBsZW4pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpXG4gICAgICBSZWZsZWN0QXBwbHkobGlzdGVuZXJzW2ldLCB0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuZnVuY3Rpb24gX2FkZExpc3RlbmVyKHRhcmdldCwgdHlwZSwgbGlzdGVuZXIsIHByZXBlbmQpIHtcbiAgdmFyIG07XG4gIHZhciBldmVudHM7XG4gIHZhciBleGlzdGluZztcblxuICBjaGVja0xpc3RlbmVyKGxpc3RlbmVyKTtcblxuICBldmVudHMgPSB0YXJnZXQuX2V2ZW50cztcbiAgaWYgKGV2ZW50cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZXZlbnRzID0gdGFyZ2V0Ll9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHRhcmdldC5fZXZlbnRzQ291bnQgPSAwO1xuICB9IGVsc2Uge1xuICAgIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gICAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICAgIGlmIChldmVudHMubmV3TGlzdGVuZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGFyZ2V0LmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyID8gbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgICAgIC8vIFJlLWFzc2lnbiBgZXZlbnRzYCBiZWNhdXNlIGEgbmV3TGlzdGVuZXIgaGFuZGxlciBjb3VsZCBoYXZlIGNhdXNlZCB0aGVcbiAgICAgIC8vIHRoaXMuX2V2ZW50cyB0byBiZSBhc3NpZ25lZCB0byBhIG5ldyBvYmplY3RcbiAgICAgIGV2ZW50cyA9IHRhcmdldC5fZXZlbnRzO1xuICAgIH1cbiAgICBleGlzdGluZyA9IGV2ZW50c1t0eXBlXTtcbiAgfVxuXG4gIGlmIChleGlzdGluZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgZXhpc3RpbmcgPSBldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgICArK3RhcmdldC5fZXZlbnRzQ291bnQ7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHR5cGVvZiBleGlzdGluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgICBleGlzdGluZyA9IGV2ZW50c1t0eXBlXSA9XG4gICAgICAgIHByZXBlbmQgPyBbbGlzdGVuZXIsIGV4aXN0aW5nXSA6IFtleGlzdGluZywgbGlzdGVuZXJdO1xuICAgICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIH0gZWxzZSBpZiAocHJlcGVuZCkge1xuICAgICAgZXhpc3RpbmcudW5zaGlmdChsaXN0ZW5lcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGV4aXN0aW5nLnB1c2gobGlzdGVuZXIpO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gICAgbSA9IF9nZXRNYXhMaXN0ZW5lcnModGFyZ2V0KTtcbiAgICBpZiAobSA+IDAgJiYgZXhpc3RpbmcubGVuZ3RoID4gbSAmJiAhZXhpc3Rpbmcud2FybmVkKSB7XG4gICAgICBleGlzdGluZy53YXJuZWQgPSB0cnVlO1xuICAgICAgLy8gTm8gZXJyb3IgY29kZSBmb3IgdGhpcyBzaW5jZSBpdCBpcyBhIFdhcm5pbmdcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLXN5bnRheFxuICAgICAgdmFyIHcgPSBuZXcgRXJyb3IoJ1Bvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgbGVhayBkZXRlY3RlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nLmxlbmd0aCArICcgJyArIFN0cmluZyh0eXBlKSArICcgbGlzdGVuZXJzICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnYWRkZWQuIFVzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnaW5jcmVhc2UgbGltaXQnKTtcbiAgICAgIHcubmFtZSA9ICdNYXhMaXN0ZW5lcnNFeGNlZWRlZFdhcm5pbmcnO1xuICAgICAgdy5lbWl0dGVyID0gdGFyZ2V0O1xuICAgICAgdy50eXBlID0gdHlwZTtcbiAgICAgIHcuY291bnQgPSBleGlzdGluZy5sZW5ndGg7XG4gICAgICBQcm9jZXNzRW1pdFdhcm5pbmcodyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uIGFkZExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHJldHVybiBfYWRkTGlzdGVuZXIodGhpcywgdHlwZSwgbGlzdGVuZXIsIGZhbHNlKTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnByZXBlbmRMaXN0ZW5lciA9XG4gICAgZnVuY3Rpb24gcHJlcGVuZExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgICByZXR1cm4gX2FkZExpc3RlbmVyKHRoaXMsIHR5cGUsIGxpc3RlbmVyLCB0cnVlKTtcbiAgICB9O1xuXG5mdW5jdGlvbiBvbmNlV3JhcHBlcigpIHtcbiAgaWYgKCF0aGlzLmZpcmVkKSB7XG4gICAgdGhpcy50YXJnZXQucmVtb3ZlTGlzdGVuZXIodGhpcy50eXBlLCB0aGlzLndyYXBGbik7XG4gICAgdGhpcy5maXJlZCA9IHRydWU7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICByZXR1cm4gdGhpcy5saXN0ZW5lci5jYWxsKHRoaXMudGFyZ2V0KTtcbiAgICByZXR1cm4gdGhpcy5saXN0ZW5lci5hcHBseSh0aGlzLnRhcmdldCwgYXJndW1lbnRzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfb25jZVdyYXAodGFyZ2V0LCB0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgc3RhdGUgPSB7IGZpcmVkOiBmYWxzZSwgd3JhcEZuOiB1bmRlZmluZWQsIHRhcmdldDogdGFyZ2V0LCB0eXBlOiB0eXBlLCBsaXN0ZW5lcjogbGlzdGVuZXIgfTtcbiAgdmFyIHdyYXBwZWQgPSBvbmNlV3JhcHBlci5iaW5kKHN0YXRlKTtcbiAgd3JhcHBlZC5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICBzdGF0ZS53cmFwRm4gPSB3cmFwcGVkO1xuICByZXR1cm4gd3JhcHBlZDtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24gb25jZSh0eXBlLCBsaXN0ZW5lcikge1xuICBjaGVja0xpc3RlbmVyKGxpc3RlbmVyKTtcbiAgdGhpcy5vbih0eXBlLCBfb25jZVdyYXAodGhpcywgdHlwZSwgbGlzdGVuZXIpKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnByZXBlbmRPbmNlTGlzdGVuZXIgPVxuICAgIGZ1bmN0aW9uIHByZXBlbmRPbmNlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgIGNoZWNrTGlzdGVuZXIobGlzdGVuZXIpO1xuICAgICAgdGhpcy5wcmVwZW5kTGlzdGVuZXIodHlwZSwgX29uY2VXcmFwKHRoaXMsIHR5cGUsIGxpc3RlbmVyKSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4vLyBFbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWYgYW5kIG9ubHkgaWYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9XG4gICAgZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgIHZhciBsaXN0LCBldmVudHMsIHBvc2l0aW9uLCBpLCBvcmlnaW5hbExpc3RlbmVyO1xuXG4gICAgICBjaGVja0xpc3RlbmVyKGxpc3RlbmVyKTtcblxuICAgICAgZXZlbnRzID0gdGhpcy5fZXZlbnRzO1xuICAgICAgaWYgKGV2ZW50cyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgbGlzdCA9IGV2ZW50c1t0eXBlXTtcbiAgICAgIGlmIChsaXN0ID09PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHwgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpIHtcbiAgICAgICAgaWYgKC0tdGhpcy5fZXZlbnRzQ291bnQgPT09IDApXG4gICAgICAgICAgdGhpcy5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZGVsZXRlIGV2ZW50c1t0eXBlXTtcbiAgICAgICAgICBpZiAoZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3QubGlzdGVuZXIgfHwgbGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBsaXN0ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHBvc2l0aW9uID0gLTE7XG5cbiAgICAgICAgZm9yIChpID0gbGlzdC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fCBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikge1xuICAgICAgICAgICAgb3JpZ2luYWxMaXN0ZW5lciA9IGxpc3RbaV0ubGlzdGVuZXI7XG4gICAgICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICAgIGlmIChwb3NpdGlvbiA9PT0gMClcbiAgICAgICAgICBsaXN0LnNoaWZ0KCk7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHNwbGljZU9uZShsaXN0LCBwb3NpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpXG4gICAgICAgICAgZXZlbnRzW3R5cGVdID0gbGlzdFswXTtcblxuICAgICAgICBpZiAoZXZlbnRzLnJlbW92ZUxpc3RlbmVyICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIG9yaWdpbmFsTGlzdGVuZXIgfHwgbGlzdGVuZXIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9mZiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID1cbiAgICBmdW5jdGlvbiByZW1vdmVBbGxMaXN0ZW5lcnModHlwZSkge1xuICAgICAgdmFyIGxpc3RlbmVycywgZXZlbnRzLCBpO1xuXG4gICAgICBldmVudHMgPSB0aGlzLl9ldmVudHM7XG4gICAgICBpZiAoZXZlbnRzID09PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gICAgICBpZiAoZXZlbnRzLnJlbW92ZUxpc3RlbmVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICB0aGlzLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICAgIHRoaXMuX2V2ZW50c0NvdW50ID0gMDtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudHNbdHlwZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmICgtLXRoaXMuX2V2ZW50c0NvdW50ID09PSAwKVxuICAgICAgICAgICAgdGhpcy5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBkZWxldGUgZXZlbnRzW3R5cGVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZXZlbnRzKTtcbiAgICAgICAgdmFyIGtleTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGtleXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICBrZXkgPSBrZXlzW2ldO1xuICAgICAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgICAgIHRoaXMuX2V2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIHRoaXMuX2V2ZW50c0NvdW50ID0gMDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIGxpc3RlbmVycyA9IGV2ZW50c1t0eXBlXTtcblxuICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lcnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICAgICAgfSBlbHNlIGlmIChsaXN0ZW5lcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBMSUZPIG9yZGVyXG4gICAgICAgIGZvciAoaSA9IGxpc3RlbmVycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG5mdW5jdGlvbiBfbGlzdGVuZXJzKHRhcmdldCwgdHlwZSwgdW53cmFwKSB7XG4gIHZhciBldmVudHMgPSB0YXJnZXQuX2V2ZW50cztcblxuICBpZiAoZXZlbnRzID09PSB1bmRlZmluZWQpXG4gICAgcmV0dXJuIFtdO1xuXG4gIHZhciBldmxpc3RlbmVyID0gZXZlbnRzW3R5cGVdO1xuICBpZiAoZXZsaXN0ZW5lciA9PT0gdW5kZWZpbmVkKVxuICAgIHJldHVybiBbXTtcblxuICBpZiAodHlwZW9mIGV2bGlzdGVuZXIgPT09ICdmdW5jdGlvbicpXG4gICAgcmV0dXJuIHVud3JhcCA/IFtldmxpc3RlbmVyLmxpc3RlbmVyIHx8IGV2bGlzdGVuZXJdIDogW2V2bGlzdGVuZXJdO1xuXG4gIHJldHVybiB1bndyYXAgP1xuICAgIHVud3JhcExpc3RlbmVycyhldmxpc3RlbmVyKSA6IGFycmF5Q2xvbmUoZXZsaXN0ZW5lciwgZXZsaXN0ZW5lci5sZW5ndGgpO1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uIGxpc3RlbmVycyh0eXBlKSB7XG4gIHJldHVybiBfbGlzdGVuZXJzKHRoaXMsIHR5cGUsIHRydWUpO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yYXdMaXN0ZW5lcnMgPSBmdW5jdGlvbiByYXdMaXN0ZW5lcnModHlwZSkge1xuICByZXR1cm4gX2xpc3RlbmVycyh0aGlzLCB0eXBlLCBmYWxzZSk7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgaWYgKHR5cGVvZiBlbWl0dGVyLmxpc3RlbmVyQ291bnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZW1pdHRlci5saXN0ZW5lckNvdW50KHR5cGUpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBsaXN0ZW5lckNvdW50LmNhbGwoZW1pdHRlciwgdHlwZSk7XG4gIH1cbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJDb3VudCA9IGxpc3RlbmVyQ291bnQ7XG5mdW5jdGlvbiBsaXN0ZW5lckNvdW50KHR5cGUpIHtcbiAgdmFyIGV2ZW50cyA9IHRoaXMuX2V2ZW50cztcblxuICBpZiAoZXZlbnRzICE9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgZXZsaXN0ZW5lciA9IGV2ZW50c1t0eXBlXTtcblxuICAgIGlmICh0eXBlb2YgZXZsaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIDE7XG4gICAgfSBlbHNlIGlmIChldmxpc3RlbmVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBldmxpc3RlbmVyLmxlbmd0aDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gMDtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5ldmVudE5hbWVzID0gZnVuY3Rpb24gZXZlbnROYW1lcygpIHtcbiAgcmV0dXJuIHRoaXMuX2V2ZW50c0NvdW50ID4gMCA/IFJlZmxlY3RPd25LZXlzKHRoaXMuX2V2ZW50cykgOiBbXTtcbn07XG5cbmZ1bmN0aW9uIGFycmF5Q2xvbmUoYXJyLCBuKSB7XG4gIHZhciBjb3B5ID0gbmV3IEFycmF5KG4pO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG47ICsraSlcbiAgICBjb3B5W2ldID0gYXJyW2ldO1xuICByZXR1cm4gY29weTtcbn1cblxuZnVuY3Rpb24gc3BsaWNlT25lKGxpc3QsIGluZGV4KSB7XG4gIGZvciAoOyBpbmRleCArIDEgPCBsaXN0Lmxlbmd0aDsgaW5kZXgrKylcbiAgICBsaXN0W2luZGV4XSA9IGxpc3RbaW5kZXggKyAxXTtcbiAgbGlzdC5wb3AoKTtcbn1cblxuZnVuY3Rpb24gdW53cmFwTGlzdGVuZXJzKGFycikge1xuICB2YXIgcmV0ID0gbmV3IEFycmF5KGFyci5sZW5ndGgpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHJldC5sZW5ndGg7ICsraSkge1xuICAgIHJldFtpXSA9IGFycltpXS5saXN0ZW5lciB8fCBhcnJbaV07XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxuZnVuY3Rpb24gb25jZShlbWl0dGVyLCBuYW1lKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgZnVuY3Rpb24gZXJyb3JMaXN0ZW5lcihlcnIpIHtcbiAgICAgIGVtaXR0ZXIucmVtb3ZlTGlzdGVuZXIobmFtZSwgcmVzb2x2ZXIpO1xuICAgICAgcmVqZWN0KGVycik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzb2x2ZXIoKSB7XG4gICAgICBpZiAodHlwZW9mIGVtaXR0ZXIucmVtb3ZlTGlzdGVuZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZW1pdHRlci5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBlcnJvckxpc3RlbmVyKTtcbiAgICAgIH1cbiAgICAgIHJlc29sdmUoW10uc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcbiAgICB9O1xuXG4gICAgZXZlbnRUYXJnZXRBZ25vc3RpY0FkZExpc3RlbmVyKGVtaXR0ZXIsIG5hbWUsIHJlc29sdmVyLCB7IG9uY2U6IHRydWUgfSk7XG4gICAgaWYgKG5hbWUgIT09ICdlcnJvcicpIHtcbiAgICAgIGFkZEVycm9ySGFuZGxlcklmRXZlbnRFbWl0dGVyKGVtaXR0ZXIsIGVycm9yTGlzdGVuZXIsIHsgb25jZTogdHJ1ZSB9KTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRFcnJvckhhbmRsZXJJZkV2ZW50RW1pdHRlcihlbWl0dGVyLCBoYW5kbGVyLCBmbGFncykge1xuICBpZiAodHlwZW9mIGVtaXR0ZXIub24gPT09ICdmdW5jdGlvbicpIHtcbiAgICBldmVudFRhcmdldEFnbm9zdGljQWRkTGlzdGVuZXIoZW1pdHRlciwgJ2Vycm9yJywgaGFuZGxlciwgZmxhZ3MpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGV2ZW50VGFyZ2V0QWdub3N0aWNBZGRMaXN0ZW5lcihlbWl0dGVyLCBuYW1lLCBsaXN0ZW5lciwgZmxhZ3MpIHtcbiAgaWYgKHR5cGVvZiBlbWl0dGVyLm9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgaWYgKGZsYWdzLm9uY2UpIHtcbiAgICAgIGVtaXR0ZXIub25jZShuYW1lLCBsaXN0ZW5lcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVtaXR0ZXIub24obmFtZSwgbGlzdGVuZXIpO1xuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgZW1pdHRlci5hZGRFdmVudExpc3RlbmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gRXZlbnRUYXJnZXQgZG9lcyBub3QgaGF2ZSBgZXJyb3JgIGV2ZW50IHNlbWFudGljcyBsaWtlIE5vZGVcbiAgICAvLyBFdmVudEVtaXR0ZXJzLCB3ZSBkbyBub3QgbGlzdGVuIGZvciBgZXJyb3JgIGV2ZW50cyBoZXJlLlxuICAgIGVtaXR0ZXIuYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBmdW5jdGlvbiB3cmFwTGlzdGVuZXIoYXJnKSB7XG4gICAgICAvLyBJRSBkb2VzIG5vdCBoYXZlIGJ1aWx0aW4gYHsgb25jZTogdHJ1ZSB9YCBzdXBwb3J0IHNvIHdlXG4gICAgICAvLyBoYXZlIHRvIGRvIGl0IG1hbnVhbGx5LlxuICAgICAgaWYgKGZsYWdzLm9uY2UpIHtcbiAgICAgICAgZW1pdHRlci5yZW1vdmVFdmVudExpc3RlbmVyKG5hbWUsIHdyYXBMaXN0ZW5lcik7XG4gICAgICB9XG4gICAgICBsaXN0ZW5lcihhcmcpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImVtaXR0ZXJcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgRXZlbnRFbWl0dGVyLiBSZWNlaXZlZCB0eXBlICcgKyB0eXBlb2YgZW1pdHRlcik7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IFwiLy8gZGVwZW5kcyBvbiBpbmplY3Rpbmcgc2NyaXB0IChzYXlwaS5pbmRleC5qcykgZGVjbGFyaW5nIHRoZSBFdmVudEJ1cyBhcyBhIGdsb2JhbCB2YXJpYWJsZVxcbmNvbnNvbGUubG9nKFxcXCJBdWRpb01vZHVsZS5qczogRXZlbnRCdXNcXFwiLCB3aW5kb3cuRXZlbnRCdXMpO1xcbnZhciBFdmVudEJ1cyA9IHdpbmRvdy5FdmVudEJ1cztcXG5cXG4vLyBhdWRpbyBvdXRwdXQgKFBpKVxcbnZhciBhdWRpb0VsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxcXCJhdWRpb1xcXCIpO1xcbmlmICghYXVkaW9FbGVtZW50KSB7XFxuICBjb25zb2xlLmVycm9yKFxcXCJBdWRpbyBlbGVtZW50IG5vdCBmb3VuZCFcXFwiKTtcXG59XFxuXFxuLy8gVE9ETzogZGVkdXBlIHRoaXMgZnVuY3Rpb24gZnJvbSBFdmVudE1vZHVsZS5qc1xcbmZ1bmN0aW9uIGlzU2FmYXJpKCkge1xcbiAgcmV0dXJuIC9eKCg/IWNocm9tZXxhbmRyb2lkKS4pKnNhZmFyaS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XFxufVxcbmF1ZGlvRWxlbWVudC5wcmVsb2FkID0gXFxcImF1dG9cXFwiOyAvLyBlbmFibGUgYWdncmVzc2l2ZSBwcmVsb2FkaW5nIG9mIGF1ZGlvXFxudmFyIHBpQXVkaW9NYW5hZ2VyID0ge1xcbiAgaXNTcGVha2luZzogZmFsc2UsXFxuICBhdWRpb0VsZW1lbnQ6IGF1ZGlvRWxlbWVudCxcXG4gIF91c2VyU3RhcnRlZDogdHJ1ZSxcXG4gIC8vIGZsYWcgdG8gaW5kaWNhdGUgcGxheWJhY2sgaGFzIGJlZW4gc3RhcnRlZCBieSB0aGUgdXNlciAodHJ1ZSBieSBkZWZhdWx0IGJlY2F1c2UgdXNlciBtdXN0IHJlcXVlc3QgaW5pdGlhbCBwbGF5YmFjaylcXG4gIF9pc0xvYWRDYWxsZWQ6IGZhbHNlLFxcbiAgLy8gZmxhZyB0byBpbmRpY2F0ZSBpZiB0aGUgbG9hZCgpIG1ldGhvZCBoYXMgYmVlbiBjYWxsZWQgb24gdGhlIGF1ZGlvIGVsZW1lbnRcXG5cXG4gIGlzTG9hZENhbGxlZDogZnVuY3Rpb24gaXNMb2FkQ2FsbGVkKCkge1xcbiAgICByZXR1cm4gdGhpcy5faXNMb2FkQ2FsbGVkO1xcbiAgfSxcXG4gIHNldElzTG9hZENhbGxlZDogZnVuY3Rpb24gc2V0SXNMb2FkQ2FsbGVkKHZhbHVlKSB7XFxuICAgIHRoaXMuX2lzTG9hZENhbGxlZCA9IHZhbHVlO1xcbiAgfSxcXG4gIHJlbG9hZDogZnVuY3Rpb24gcmVsb2FkKCkge1xcbiAgICBpZiAoIWlzU2FmYXJpKCkpIHtcXG4gICAgICByZXR1cm47XFxuICAgIH1cXG4gICAgdGhpcy5fdXNlclN0YXJ0ZWQgPSB0cnVlOyAvLyBzZXQgYSBmbGFnIHRvIGluZGljYXRlIHBsYXliYWNrIGhhcyBiZWVuIHN0YXJ0ZWQgYnkgdGhlIHVzZXJcXG4gICAgdGhpcy5hdWRpb0VsZW1lbnQubG9hZCgpOyAvLyByZXNldCBmb3IgU2FmYXJpXFxuICAgIHRoaXMuYXVkaW9FbGVtZW50LnBsYXkoKTtcXG4gIH0sXFxuICBhdXRvUGxheTogZnVuY3Rpb24gYXV0b1BsYXkoKSB7XFxuICAgIGlmICghdGhpcy5fdXNlclN0YXJ0ZWQpIHtcXG4gICAgICB0aGlzLmF1ZGlvRWxlbWVudC5wYXVzZSgpO1xcbiAgICAgIEV2ZW50QnVzLmVtaXQoXFxcInNheXBpOnBhdXNlXFxcIik7XFxuICAgIH1cXG4gIH0sXFxuICBzdG9wOiBmdW5jdGlvbiBzdG9wKCkge1xcbiAgICBpZiAodGhpcy5pc1NwZWFraW5nKSB7XFxuICAgICAgdGhpcy5hdWRpb0VsZW1lbnQucGF1c2UoKTtcXG4gICAgfVxcbiAgICBpZiAodGhpcy5hdWRpb0VsZW1lbnQuZHVyYXRpb24gJiYgIXRoaXMuYXVkaW9FbGVtZW50LmVuZGVkICYmIHRoaXMuYXVkaW9FbGVtZW50LmN1cnJlbnRUaW1lIDwgdGhpcy5hdWRpb0VsZW1lbnQuZHVyYXRpb24pIHtcXG4gICAgICB0aGlzLmF1ZGlvRWxlbWVudC5jdXJyZW50VGltZSA9IHRoaXMuYXVkaW9FbGVtZW50LmR1cmF0aW9uOyAvLyBzZWVrIHRoZSBhdWRpbyB0byB0aGUgZW5kXFxuICAgICAgdGhpcy5hdWRpb0VsZW1lbnQucGxheSgpOyAvLyB0cmlnZ2VyIHRoZSBlbmRlZCBldmVudFxcbiAgICB9XFxuICB9LFxcblxcbiAgcGF1c2U6IGZ1bmN0aW9uIHBhdXNlKCkge1xcbiAgICB0aGlzLmF1ZGlvRWxlbWVudC5wYXVzZSgpO1xcbiAgfSxcXG4gIHJlc3VtZTogZnVuY3Rpb24gcmVzdW1lKCkge1xcbiAgICB0aGlzLmF1ZGlvRWxlbWVudC5wbGF5KCk7XFxuICB9LFxcbiAgcGxheWluZzogZnVuY3Rpb24gcGxheWluZygpIHtcXG4gICAgdGhpcy5pc1NwZWFraW5nID0gdHJ1ZTtcXG4gIH0sXFxuICBzdG9wcGVkOiBmdW5jdGlvbiBzdG9wcGVkKCkge1xcbiAgICB0aGlzLmlzU3BlYWtpbmcgPSBmYWxzZTtcXG4gICAgdGhpcy5fdXNlclN0YXJ0ZWQgPSBmYWxzZTtcXG4gIH1cXG59O1xcblxcbi8vIEludGVyY2VwdCBBdXRvcGxheSBFdmVudHMgKGNhbid0IGF1dG9wbGF5IGZ1bGwgYXVkaW8gb24gU2FmYXJpKVxcbmF1ZGlvRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxcXCJwbGF5XFxcIiwgZnVuY3Rpb24gKCkge1xcbiAgaWYgKGlzU2FmYXJpKCkpIHtcXG4gICAgcGlBdWRpb01hbmFnZXIuYXV0b1BsYXkoKTtcXG4gIH1cXG59KTtcXG5hdWRpb0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcXFwibG9hZHN0YXJ0XFxcIiwgZnVuY3Rpb24gKCkge1xcbiAgaWYgKGlzU2FmYXJpKCkpIHtcXG4gICAgLy8gdGVsbCB0aGUgc3RhdGUgbWFjaGluZSB0aGF0IFBpIGlzIHJlYWR5IHRvIHNwZWFrICh3aGlsZSBwYXVzZWQpXFxuICAgIEV2ZW50QnVzLmVtaXQoXFxcInNheXBpOnJlYWR5XFxcIik7XFxuICB9XFxufSk7XFxuXFxuLy8gRXZlbnQgbGlzdGVuZXJzIGZvciBkZXRlY3Rpbmcgd2hlbiBQaSBpcyBzcGVha2luZ1xcbmF1ZGlvRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxcXCJwbGF5aW5nXFxcIiwgZnVuY3Rpb24gKCkge1xcbiAgcGlBdWRpb01hbmFnZXIucGxheWluZygpO1xcbiAgRXZlbnRCdXMuZW1pdChcXFwic2F5cGk6cGlTcGVha2luZ1xcXCIpO1xcbn0pO1xcbmF1ZGlvRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxcXCJwYXVzZVxcXCIsIGZ1bmN0aW9uICgpIHtcXG4gIHBpQXVkaW9NYW5hZ2VyLnN0b3BwZWQoKTtcXG4gIEV2ZW50QnVzLmVtaXQoXFxcInNheXBpOnBpU3RvcHBlZFNwZWFraW5nXFxcIik7XFxufSk7XFxuYXVkaW9FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXFxcImVuZGVkXFxcIiwgZnVuY3Rpb24gKCkge1xcbiAgcGlBdWRpb01hbmFnZXIuc3RvcHBlZCgpO1xcbiAgRXZlbnRCdXMuZW1pdChcXFwic2F5cGk6cGlGaW5pc2hlZFNwZWFraW5nXFxcIik7XFxufSk7XFxuXFxuLy8gYXVkaW8gaW5wdXQgKHVzZXIpXFxudmFyIGF1ZGlvRGF0YUNodW5rcyA9IFtdO1xcbnZhciBhdWRpb01pbWVUeXBlID0gXFxcImF1ZGlvL3dlYm07Y29kZWNzPW9wdXNcXFwiO1xcblxcbi8vIERlY2xhcmUgYSBnbG9iYWwgdmFyaWFibGUgZm9yIHRoZSBtZWRpYVJlY29yZGVyXFxudmFyIG1lZGlhUmVjb3JkZXI7XFxudmFyIHRocmVzaG9sZCA9IDEwMDA7IC8vIDEwMDAgbXMgPSAxIHNlY29uZCwgYWJvdXQgdGhlIGxlbmd0aCBvZiBcXFwiSGV5LCBQaVxcXCJcXG5cXG4vLyBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlICdkYXRhYXZhaWxhYmxlJyBldmVudCBmaXJlc1xcbmZ1bmN0aW9uIGhhbmRsZURhdGFBdmFpbGFibGUoZSkge1xcbiAgLy8gQWRkIHRoZSBhdWRpbyBkYXRhIGNodW5rIHRvIHRoZSBhcnJheVxcbiAgYXVkaW9EYXRhQ2h1bmtzLnB1c2goZS5kYXRhKTtcXG59XFxuXFxuLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSAnc3RvcCcgZXZlbnQgZmlyZXNcXG5mdW5jdGlvbiBoYW5kbGVTdG9wKCkge1xcbiAgLy8gQ3JlYXRlIGEgQmxvYiBmcm9tIHRoZSBhdWRpbyBkYXRhIGNodW5rc1xcbiAgdmFyIGF1ZGlvQmxvYiA9IG5ldyBCbG9iKGF1ZGlvRGF0YUNodW5rcywge1xcbiAgICB0eXBlOiBhdWRpb01pbWVUeXBlXFxuICB9KTtcXG5cXG4gIC8vIEdldCB0aGUgc3RvcCB0aW1lIGFuZCBjYWxjdWxhdGUgdGhlIGR1cmF0aW9uXFxuICB2YXIgc3RvcFRpbWUgPSBEYXRlLm5vdygpO1xcbiAgdmFyIGR1cmF0aW9uID0gc3RvcFRpbWUgLSB3aW5kb3cuc3RhcnRUaW1lO1xcblxcbiAgLy8gSWYgdGhlIGR1cmF0aW9uIGlzIGdyZWF0ZXIgdGhhbiB0aGUgdGhyZXNob2xkLCB1cGxvYWQgdGhlIGF1ZGlvIGZvciB0cmFuc2NyaXB0aW9uXFxuICBpZiAoZHVyYXRpb24gPj0gdGhyZXNob2xkKSB7XFxuICAgIC8vIFVwbG9hZCB0aGUgYXVkaW8gdG8gdGhlIHNlcnZlciBmb3IgdHJhbnNjcmlwdGlvblxcbiAgICBFdmVudEJ1cy5lbWl0KFxcXCJzYXlwaTp1c2VyRmluaXNoZWRTcGVha2luZ1xcXCIsIHtcXG4gICAgICBkdXJhdGlvbjogZHVyYXRpb24sXFxuICAgICAgYmxvYjogYXVkaW9CbG9iXFxuICAgIH0pO1xcbiAgfVxcblxcbiAgLy8gQ2xlYXIgdGhlIGFycmF5IGZvciB0aGUgbmV4dCByZWNvcmRpbmdcXG4gIGF1ZGlvRGF0YUNodW5rcyA9IFtdO1xcbn1cXG5mdW5jdGlvbiBzZXR1cFJlY29yZGluZyhjYWxsYmFjaykge1xcbiAgaWYgKG1lZGlhUmVjb3JkZXIpIHtcXG4gICAgcmV0dXJuO1xcbiAgfVxcblxcbiAgLy8gR2V0IGEgc3RyZWFtIGZyb20gdGhlIHVzZXIncyBtaWNyb3Bob25lXFxuICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYSh7XFxuICAgIGF1ZGlvOiB0cnVlXFxuICB9KS50aGVuKGZ1bmN0aW9uIChzdHJlYW0pIHtcXG4gICAgaWYgKCFNZWRpYVJlY29yZGVyLmlzVHlwZVN1cHBvcnRlZChhdWRpb01pbWVUeXBlKSkge1xcbiAgICAgIC8vIHVzZSBNUDQgZm9yIFNhZmFyaVxcbiAgICAgIGF1ZGlvTWltZVR5cGUgPSBcXFwiYXVkaW8vbXA0XFxcIjtcXG4gICAgfVxcbiAgICAvLyBDcmVhdGUgYSBuZXcgTWVkaWFSZWNvcmRlciBvYmplY3QgdXNpbmcgdGhlIHN0cmVhbSBhbmQgc3BlY2lmeWluZyB0aGUgTUlNRSB0eXBlXFxuICAgIHZhciBvcHRpb25zID0ge1xcbiAgICAgIG1pbWVUeXBlOiBhdWRpb01pbWVUeXBlXFxuICAgIH07XFxuICAgIG1lZGlhUmVjb3JkZXIgPSBuZXcgTWVkaWFSZWNvcmRlcihzdHJlYW0sIG9wdGlvbnMpO1xcblxcbiAgICAvLyBMaXN0ZW4gZm9yIHRoZSAnZGF0YWF2YWlsYWJsZScgZXZlbnRcXG4gICAgbWVkaWFSZWNvcmRlci5hZGRFdmVudExpc3RlbmVyKFxcXCJkYXRhYXZhaWxhYmxlXFxcIiwgaGFuZGxlRGF0YUF2YWlsYWJsZSk7XFxuXFxuICAgIC8vIExpc3RlbiBmb3IgdGhlICdzdG9wJyBldmVudFxcbiAgICBtZWRpYVJlY29yZGVyLmFkZEV2ZW50TGlzdGVuZXIoXFxcInN0b3BcXFwiLCBoYW5kbGVTdG9wKTtcXG4gIH0pLnRoZW4oZnVuY3Rpb24gKCkge1xcbiAgICAvLyBJbnZva2UgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uXFxuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFxcXCJmdW5jdGlvblxcXCIpIHtcXG4gICAgICBjYWxsYmFjaygpO1xcbiAgICB9XFxuICB9KVtcXFwiY2F0Y2hcXFwiXShmdW5jdGlvbiAoZXJyKSB7XFxuICAgIGNvbnNvbGUuZXJyb3IoXFxcIkVycm9yIGdldHRpbmcgYXVkaW8gc3RyZWFtOiBcXFwiICsgZXJyKTtcXG4gIH0pO1xcbn1cXG5mdW5jdGlvbiB0ZWFyRG93blJlY29yZGluZygpIHtcXG4gIC8vIENoZWNrIGlmIHRoZSBNZWRpYVJlY29yZGVyIGlzIHNldCB1cFxcbiAgaWYgKCFtZWRpYVJlY29yZGVyKSB7XFxuICAgIHJldHVybjtcXG4gIH1cXG5cXG4gIC8vIFN0b3AgYW55IG9uZ29pbmcgcmVjb3JkaW5nXFxuICBpZiAobWVkaWFSZWNvcmRlci5zdGF0ZSA9PT0gXFxcInJlY29yZGluZ1xcXCIpIHtcXG4gICAgbWVkaWFSZWNvcmRlci5zdG9wKCk7XFxuICB9XFxuXFxuICAvLyBSZW1vdmUgdGhlIE1lZGlhUmVjb3JkZXIncyBldmVudCBsaXN0ZW5lcnNcXG4gIG1lZGlhUmVjb3JkZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihcXFwiZGF0YWF2YWlsYWJsZVxcXCIsIGhhbmRsZURhdGFBdmFpbGFibGUpO1xcbiAgbWVkaWFSZWNvcmRlci5yZW1vdmVFdmVudExpc3RlbmVyKFxcXCJzdG9wXFxcIiwgaGFuZGxlU3RvcCk7XFxuXFxuICAvLyBDbGVhciB0aGUgTWVkaWFSZWNvcmRlciB2YXJpYWJsZVxcbiAgbWVkaWFSZWNvcmRlciA9IG51bGw7XFxufVxcblxcbi8vIFRvIHJlcXVlc3QgcmVjb3JkaW5nLCBvdGhlciBtb2R1bGVzIGNhbiBkaXNwYXRjaCBhIGN1c3RvbSBldmVudCBhdWRpbzpzdGFydFJlY29yZGluZ1xcbmZ1bmN0aW9uIHN0YXJ0UmVjb3JkaW5nKCkge1xcbiAgLy8gQ2hlY2sgaWYgdGhlIE1lZGlhUmVjb3JkZXIgaXMgc2V0IHVwXFxuICBpZiAoIW1lZGlhUmVjb3JkZXIpIHtcXG4gICAgc2V0dXBSZWNvcmRpbmcoc3RhcnRSZWNvcmRpbmcpO1xcbiAgICByZXR1cm47XFxuICB9XFxuICAvLyBDaGVjayBpZiBQaSBpcyBjdXJyZW50bHkgc3BlYWtpbmcgYW5kIHN0b3AgaGVyIGF1ZGlvXFxuICBpZiAocGlBdWRpb01hbmFnZXIuaXNTcGVha2luZykge1xcbiAgICBwaUF1ZGlvTWFuYWdlci5wYXVzZSgpO1xcbiAgfVxcblxcbiAgLy8gU3RhcnQgcmVjb3JkaW5nXFxuICBtZWRpYVJlY29yZGVyLnN0YXJ0KCk7XFxuXFxuICAvLyBSZWNvcmQgdGhlIHN0YXJ0IHRpbWVcXG4gIHdpbmRvdy5zdGFydFRpbWUgPSBEYXRlLm5vdygpO1xcbiAgRXZlbnRCdXMuZW1pdChcXFwic2F5cGk6dXNlclNwZWFraW5nXFxcIik7XFxufVxcblxcbi8vIFRvIHN0b3AgcmVjb3JkaW5nLCBvdGhlciBtb2R1bGVzIGNhbiBkaXNwYXRjaCBhIGN1c3RvbSBldmVudCBhdWRpbzpzdG9wUmVjb3JkaW5nXFxuZnVuY3Rpb24gc3RvcFJlY29yZGluZygpIHtcXG4gIGlmIChtZWRpYVJlY29yZGVyICYmIG1lZGlhUmVjb3JkZXIuc3RhdGUgPT09IFxcXCJyZWNvcmRpbmdcXFwiKSB7XFxuICAgIC8vIFN0b3AgcmVjb3JkaW5nXFxuICAgIG1lZGlhUmVjb3JkZXIuc3RvcCgpO1xcblxcbiAgICAvLyBSZWNvcmQgdGhlIHN0b3AgdGltZSBhbmQgY2FsY3VsYXRlIHRoZSBkdXJhdGlvblxcbiAgICB2YXIgc3RvcFRpbWUgPSBEYXRlLm5vdygpO1xcbiAgICB2YXIgZHVyYXRpb24gPSBzdG9wVGltZSAtIHdpbmRvdy5zdGFydFRpbWU7XFxuXFxuICAgIC8vIElmIHRoZSBkdXJhdGlvbiBpcyBsZXNzIHRoYW4gdGhlIHRocmVzaG9sZCwgZG9uJ3QgdXBsb2FkIHRoZSBhdWRpbyBmb3IgdHJhbnNjcmlwdGlvblxcbiAgICBpZiAoZHVyYXRpb24gPCB0aHJlc2hvbGQpIHtcXG4gICAgICBjb25zb2xlLmxvZyhcXFwiUmVjb3JkaW5nIHdhcyB0b28gc2hvcnQsIG5vdCB1cGxvYWRpbmcgZm9yIHRyYW5zY3JpcHRpb25cXFwiKTtcXG4gICAgICBFdmVudEJ1cy5lbWl0KFxcXCJzYXlwaTp1c2VyU3RvcHBlZFNwZWFraW5nXFxcIiwge1xcbiAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uXFxuICAgICAgfSk7XFxuICAgICAgcGlBdWRpb01hbmFnZXIucmVzdW1lKCk7XFxuICAgIH0gZWxzZSB7XFxuICAgICAgcGlBdWRpb01hbmFnZXIuc3RvcCgpO1xcbiAgICB9XFxuICB9XFxufVxcblxcbi8qIFRoZXNlIGV2ZW50cyBhcmUgdXNlZCB0byBjb250cm9sL3Bhc3MgcmVxdWVzdHMgdG8gdGhlIGF1ZGlvIG1vZHVsZSBmcm9tIG90aGVyIG1vZHVsZXMgKi9cXG5mdW5jdGlvbiByZWdpc3RlckN1c3RvbUF1ZGlvRXZlbnRMaXN0ZW5lcnMoKSB7XFxuICBFdmVudEJ1cy5vbihcXFwiYXVkaW86c2V0dXBSZWNvcmRpbmdcXFwiLCBmdW5jdGlvbiAoZSkge1xcbiAgICBzZXR1cFJlY29yZGluZygpO1xcbiAgfSk7XFxuICBFdmVudEJ1cy5vbihcXFwiYXVkaW86dGVhckRvd25SZWNvcmRpbmdcXFwiLCBmdW5jdGlvbiAoZSkge1xcbiAgICB0ZWFyRG93blJlY29yZGluZygpO1xcbiAgfSk7XFxuICBFdmVudEJ1cy5vbihcXFwiYXVkaW86c3RhcnRSZWNvcmRpbmdcXFwiLCBmdW5jdGlvbiAoZSkge1xcbiAgICBzdGFydFJlY29yZGluZygpO1xcbiAgfSk7XFxuICBFdmVudEJ1cy5vbihcXFwiYXVkaW86c3RvcFJlY29yZGluZ1xcXCIsIGZ1bmN0aW9uIChlKSB7XFxuICAgIHN0b3BSZWNvcmRpbmcoKTtcXG4gIH0pO1xcbiAgRXZlbnRCdXMub24oXFxcImF1ZGlvOnJlbG9hZFxcXCIsIGZ1bmN0aW9uIChlKSB7XFxuICAgIHBpQXVkaW9NYW5hZ2VyLnJlbG9hZCgpO1xcbiAgfSk7XFxufVxcbnJlZ2lzdGVyQ3VzdG9tQXVkaW9FdmVudExpc3RlbmVycygpO1wiOyIsImV4cG9ydCBkZWZhdWx0IFwiPD94bWwgdmVyc2lvbj1cXFwiMS4wXFxcIiBlbmNvZGluZz1cXFwiVVRGLThcXFwiPz5cXG48c3ZnIGlkPVxcXCJMYXllcl8xXFxcIiBkYXRhLW5hbWU9XFxcIkxheWVyIDFcXFwiIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDY0LjA2IDY0LjMzXFxcIj5cXG4gIDxkZWZzPlxcbiAgICA8c3R5bGU+XFxuICAgICAgLmNscy0xIHtcXG4gICAgICAgIGZpbGw6ICMyNDM4MWI7XFxuICAgICAgfVxcblxcbiAgICAgIC5jbHMtMSwgLmNscy0yIHtcXG4gICAgICAgIHN0cm9rZS13aWR0aDogMHB4O1xcbiAgICAgIH1cXG5cXG4gICAgICAuY2xzLTIge1xcbiAgICAgICAgZmlsbDogI2RmZDdjMjtcXG4gICAgICB9XFxuICAgIDwvc3R5bGU+XFxuICA8L2RlZnM+XFxuICA8cGF0aCBjbGFzcz1cXFwiY2xzLTJcXFwiIGQ9XFxcIm0zMS43MSw2NC4zMkMxNC43Nyw2NC40Ni0uNDQsNDkuOTMsMCwzMS4zMy40MSwxNC40NywxNC4yOS0uMzIsMzIuNywwYzE2LjkxLjMsMzEuOCwxNC4zMiwzMS4zNiwzMy4xNC0uMzksMTYuNzYtMTQuNDksMzEuNTUtMzIuMzQsMzEuMThabTEwLjY3LTIzLjE5Yy4wNi0uNy0uNDEtMS4xMi0uODQtMS41NS0yLTItMy45NC00LjA3LTYuMDItNS45Ny0xLjE0LTEuMDQtMS4zMi0xLjY4LS4wNi0yLjgyLDIuMTMtMS45Myw0LjA3LTQuMDgsNi4xLTYuMTIuNzgtLjc5LDEuMzEtMS42NC4zNC0yLjU2LS45Mi0uODctMS43Mi0uMjgtMi40My40NS0yLjE3LDIuMjEtNC4zOSw0LjM5LTYuNTIsNi42NS0uNzIuNzctMS4xNi43LTEuODQtLjAyLTIuMDYtMi4xNy00LjE5LTQuMjgtNi4yOS02LjQxLS43Ni0uNzctMS41OS0xLjY4LTIuNjYtLjYzLTEuMTQsMS4xMi0uMTksMS45OC42MiwyLjc5LDIuMDcsMi4wOSw0LjA5LDQuMjIsNi4yLDYuMjYuNzcuNzUuODIsMS4yLjAyLDEuOTctMi4yMSwyLjEtNC4zMyw0LjMtNi40OSw2LjQ1LS43OS43OC0xLjMsMS42NS0uMzIsMi41Ni45Mi44NSwxLjcxLjI2LDIuNDMtLjQ3LDIuMTEtMi4xMiw0LjI4LTQuMTksNi4zMy02LjM4Ljg4LS45NCwxLjM3LS44NiwyLjIxLjAzLDIuMTMsMi4yNiw0LjM3LDQuNDEsNi41Nyw2LjYuNTEuNTEsMS4wOS43OCwxLjguNDguNTYtLjI0Ljg1LS42OC44Ny0xLjNaXFxcIi8+XFxuICA8cGF0aCBjbGFzcz1cXFwiY2xzLTFcXFwiIGQ9XFxcIm00Mi40Nyw0MS4yN2MtLjAyLjYyLS4zMiwxLjA2LS44NywxLjMtLjcxLjMxLTEuMjkuMDMtMS44LS40OC0yLjItMi4yLTQuNDQtNC4zNS02LjU3LTYuNi0uODQtLjg5LTEuMzMtLjk2LTIuMjEtLjAzLTIuMDQsMi4xOS00LjIyLDQuMjUtNi4zMyw2LjM4LS43Mi43Mi0xLjUxLDEuMzItMi40My40Ny0uOTgtLjkxLS40Ny0xLjc4LjMyLTIuNTYsMi4xNi0yLjE1LDQuMjgtNC4zNSw2LjQ5LTYuNDUuODEtLjc3Ljc2LTEuMjItLjAyLTEuOTctMi4xMS0yLjA0LTQuMTMtNC4xNy02LjItNi4yNi0uOC0uODEtMS43NS0xLjY3LS42Mi0yLjc5LDEuMDctMS4wNSwxLjktLjE0LDIuNjYuNjMsMi4xLDIuMTMsNC4yMyw0LjI0LDYuMjksNi40MS42OS43MywxLjEyLjc5LDEuODQuMDIsMi4xMy0yLjI2LDQuMzUtNC40Myw2LjUyLTYuNjUuNzItLjczLDEuNTEtMS4zMSwyLjQzLS40NS45Ny45Mi40NCwxLjc4LS4zNCwyLjU2LTIuMDMsMi4wNC0zLjk3LDQuMTktNi4xLDYuMTItMS4yNSwxLjE0LTEuMDgsMS43OC4wNiwyLjgyLDIuMDksMS45MSw0LjAyLDMuOTcsNi4wMiw1Ljk3LjQzLjQzLjkuODUuODQsMS41NVpcXFwiLz5cXG48L3N2Zz5cIjsiLCJleHBvcnQgZGVmYXVsdCBcIjw/eG1sIHZlcnNpb249XFxcIjEuMFxcXCIgZW5jb2Rpbmc9XFxcIlVURi04XFxcIj8+XFxuPHN2ZyBpZD1cXFwiTGF5ZXJfMVxcXCIgZGF0YS1uYW1lPVxcXCJMYXllciAxXFxcIiB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCAzMDcgNjQwXFxcIj5cXG4gIDxkZWZzPlxcbiAgICA8c3R5bGU+XFxuICAgICAgLmlubmVybW9zdCwgLnNlY29uZCwgLnRoaXJkLCAuZm91cnRoLCAuZmlmdGgsIC5vdXRlcm1vc3Qge1xcbiAgICAgICAgc3Ryb2tlLXdpZHRoOiAwcHg7XFxuICAgICAgfVxcbiAgICAgIFxcbiAgICAgIC5vdXRlcm1vc3Qge1xcbiAgICAgICAgZmlsbDogI2U0ZjJkMTtcXG4gICAgICB9XFxuXFxuICAgICAgLnNlY29uZCB7XFxuICAgICAgICBmaWxsOiAjY2NlOGI1O1xcbiAgICAgIH1cXG5cXG4gICAgICAudGhpcmQge1xcbiAgICAgICAgZmlsbDogI2IzZGI5NTtcXG4gICAgICB9XFxuXFxuICAgICAgLmZvdXJ0aCB7XFxuICAgICAgICBmaWxsOiAjOWJkMDc4O1xcbiAgICAgIH1cXG5cXG4gICAgICAuZmlmdGgge1xcbiAgICAgICAgZmlsbDogIzgzYzU1YztcXG4gICAgICB9XFxuXFxuICAgICAgLmlubmVybW9zdCB7XFxuICAgICAgICBmaWxsOiAjNDI4YTJmO1xcbiAgICAgIH1cXG4gICAgPC9zdHlsZT5cXG4gIDwvZGVmcz5cXG4gIDxwYXRoIGNsYXNzPVxcXCJvdXRlcm1vc3RcXFwiIGQ9XFxcIm0zMDYuOSwzMjBjMCwxMDUuMy0uMDIsMjEwLjYuMSwzMTUuOTEsMCwzLjQyLS42Nyw0LjEtNC4wOSw0LjA5LTk5LjYtLjEyLTE5OS4yMS0uMTItMjk4LjgxLDBDLjY3LDY0MCwwLDYzOS4zMywwLDYzNS45MS4xMSw0MjUuMy4xMSwyMTQuNywwLDQuMDksMCwuNjcuNjcsMCw0LjA5LDAsMTAzLjcuMTIsMjAzLjMuMTIsMzAyLjkxLDBjMy40MiwwLDQuMS42Nyw0LjA5LDQuMDktLjEyLDEwNS4zLS4xLDIxMC42LS4xLDMxNS45MVpcXFwiLz5cXG4gIDxwYXRoIGNsYXNzPVxcXCJzZWNvbmRcXFwiIGQ9XFxcIm0yNzUuOTIsMzIzYzAsODcuNjMsMCwxNzUuMjcsMCwyNjIuOSwwLDcuMjQtLjU1LDcuOTMtNy44Niw3Ljk4LTE0LjY2LjA5LTI5LjMxLjAzLTQzLjk3LjAzLTYwLjk2LDAtMTIxLjkyLDAtMTgyLjg4LDBxLTcuMTMsMC03LjE0LTcuMjRjMC0xNzYuMSwwLTM1Mi4yMSwwLTUyOC4zMXEwLTcuMjYsNy4xMi03LjI2Yzc1Ljc4LDAsMTUxLjU2LDAsMjI3LjM1LDBxNy4zOCwwLDcuMzgsNy41YzAsODguMTMsMCwxNzYuMjcsMCwyNjQuNFpcXFwiLz5cXG4gIDxwYXRoIGNsYXNzPVxcXCJ0aGlyZFxcXCIgZD1cXFwibTY4LjA2LDMyMi4yNGMwLTY5LjQ3LDAtMTM4Ljk0LDAtMjA4LjQxLDAtOC45OSwxLjMzLTEwLjEzLDEwLjQ5LTkuMTIsMS45OC4yMiwzLjk4LjMyLDUuOTcuMzIsNDYuMTMuMDIsOTIuMjYuMDIsMTM4LjM5LDAsMy40OCwwLDYuOTItLjIzLDEwLjQxLS42Nyw1LjUtLjcsOC43NC40Niw4LjczLDcuMjUtLjE4LDEzOC45NC0uMTMsMjc3Ljg4LS4xMyw0MTYuODEsMCwuMzMsMCwuNjcsMCwxcS0uMTQsMTAuNTEtMTAuMzksMTAuNTFjLTUyLjEzLDAtMTA0LjI1LDAtMTU2LjM4LDBxLTcuMDksMC03LjA5LTcuMjhjMC03MC4xNCwwLTE0MC4yNywwLTIxMC40MVpcXFwiLz5cXG4gIDxwYXRoIGNsYXNzPVxcXCJmb3VydGhcXFwiIGQ9XFxcIm0xMDMuMDIsMzIyLjVjMC01Mi40NiwwLTEwNC45MSwwLTE1Ny4zNywwLTYuNjguMzYtNy4wNiw3LjA3LTcuMDYsMzAuMy0uMDEsNjAuNi4wNyw5MC45LS4wOSw0LjU0LS4wMiw2LjA4LDEuMzMsNi4wNyw1Ljk4LS4xLDEwNS41OC0uMSwyMTEuMTYsMCwzMTYuNzQsMCw0LjE4LTEuMjcsNS4zNy01LjM4LDUuMzUtMjkuMy0uMTUtNTguNi0uMDgtODcuOS0uMDhxLTEwLjc2LDAtMTAuNzYtMTEuMDljMC01MC43OSwwLTEwMS41OCwwLTE1Mi4zN1pcXFwiLz5cXG4gIDxwYXRoIGNsYXNzPVxcXCJmaWZ0aFxcXCIgZD1cXFwibTE3MywzMjIuMmMwLDM1LjI5LDAsNzAuNTgsMCwxMDUuODhxMCw2Ljg5LTYuOTksNi45Yy04LjE1LDAtMTYuMzEtLjEzLTI0LjQ2LjA2LTMuNDcuMDgtNC42OC0xLjA5LTQuNjEtNC41OS4xOC05LjY1LjA2LTE5LjMxLjA2LTI4Ljk2LDAtNTguMjYtLjAxLTExNi41My4wMi0xNzQuNzksMC00Ljc2LTEuMTItOS40Ni0uMTQtMTQuMy41MS0yLjU0LDEuMzktMy4zOCwzLjgtMy4zNiw4LjgyLjA2LDE3LjY0LjE0LDI2LjQ2LS4wMiw0LjU5LS4wOSw1Ljk1LDEuODUsNS45NCw2LjMzLS4xNCwzNS42Mi0uMDgsNzEuMjUtLjA4LDEwNi44N1pcXFwiLz5cXG4gIDxwYXRoIGNsYXNzPVxcXCJpbm5lcm1vc3RcXFwiIGQ9XFxcIm0xNTEuMDQsMzIyLjAxYzAtOS45OS4wNy0xOS45Ny0uMDUtMjkuOTYtLjA0LTIuOTMuODMtNC4xOCwzLjk1LTQuMTgsMy4wNiwwLDQuMDMsMS4xMiw0LjAyLDQuMTEtLjA5LDE5Ljk3LS4wOCwzOS45NC4wMSw1OS45MS4wMSwyLjk2LS44NCw0LjE2LTMuOTYsNC4xNC0zLjAzLS4wMS00LjA4LTEuMDQtNC4wMy00LjA4LjE0LTkuOTguMDUtMTkuOTcuMDUtMjkuOTZaXFxcIi8+XFxuPC9zdmc+XCI7IiwiZXhwb3J0IGRlZmF1bHQgXCI8c3ZnIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgdmVyc2lvbj1cXFwiMS4wXFxcIiB2aWV3Qm94PVxcXCIwIDAgNTYuMjUgMzBcXFwiIGNsYXNzPVxcXCJ3YXZlZm9ybVxcXCI+XFxuICAgIDxkZWZzPlxcbiAgICAgICAgPGNsaXBQYXRoIGlkPVxcXCJhXFxcIj5cXG4gICAgICAgICAgICA8cGF0aCBkPVxcXCJNLjU0IDEySDN2NUguNTRabTAgMFxcXCIvPlxcbiAgICAgICAgPC9jbGlwUGF0aD5cXG4gICAgICAgIDxjbGlwUGF0aCBpZD1cXFwiYlxcXCI+XFxuICAgICAgICAgICAgPHBhdGggZD1cXFwiTTI1IDIuMmgydjI0LjY4aC0yWm0wIDBcXFwiLz5cXG4gICAgICAgIDwvY2xpcFBhdGg+XFxuICAgICAgICA8Y2xpcFBhdGggaWQ9XFxcImNcXFwiPlxcbiAgICAgICAgICAgIDxwYXRoIGQ9XFxcIk01MyAxMmgxLjk4djVINTNabTAgMFxcXCIvPlxcbiAgICAgICAgPC9jbGlwUGF0aD5cXG4gICAgPC9kZWZzPlxcbiAgICA8ZyBjbGlwLXBhdGg9XFxcInVybCgjYSlcXFwiPlxcbiAgICAgICAgPHBhdGggZD1cXFwiTTEuNDggMTIuNzFjLS41IDAtLjkuNC0uOS45djEuODVhLjkuOSAwIDAgMCAxLjggMHYtMS44NGMwLS41LS40LS45LS45LS45Wm0wIDBcXFwiLz5cXG4gICAgPC9nPlxcbiAgICA8cGF0aCBkPVxcXCJNNC45OCA2LjYzYy0uNSAwLS45LjQtLjkuOXYxNC4wMWEuOS45IDAgMCAwIDEuODEgMHYtMTRjMC0uNS0uNC0uOTItLjktLjkyWm0zLjUxIDMuMWEuOS45IDAgMCAwLS45LjkxdjcuNzlhLjkuOSAwIDAgMCAxLjggMHYtNy43OWMwLS41LS40LS45LS45LS45Wk0xMiAzLjgzYS45LjkgMCAwIDAtLjkxLjl2MTkuNmEuOS45IDAgMCAwIDEuOCAwVjQuNzRjMC0uNS0uNC0uOS0uOS0uOVptMy41IDguMjlhLjkuOSAwIDAgMC0uOTEuOXYzLjAzYS45LjkgMCAwIDAgMS44MSAwdi0zLjAzYzAtLjUtLjQtLjktLjktLjlaTTE5IDYuOGMtLjUgMC0uOS40LS45Ljl2MTMuNjhhLjkuOSAwIDAgMCAxLjggMFY3LjdjMC0uNS0uNC0uOS0uOS0uOVptMy41OC0yLjk3aC0uMDFjLS41IDAtLjkuNC0uOS45bC0uMTMgMTkuNmMwIC41LjQuOS45LjkxLjUgMCAuOS0uNC45LS45bC4xNC0xOS42YS45LjkgMCAwIDAtLjktLjlabTAgMFxcXCIvPlxcbiAgICA8ZyBjbGlwLXBhdGg9XFxcInVybCgjYilcXFwiPlxcbiAgICAgICAgPHBhdGggZD1cXFwiTTI2IDIuMmMtLjUgMC0uOS40LS45Ljl2MjIuODZhLjkuOSAwIDEgMCAxLjgxIDBWMy4xMWEuOS45IDAgMCAwLS45LS45MVptMCAwXFxcIi8+XFxuICAgIDwvZz5cXG4gICAgPHBhdGggZD1cXFwiTTI5LjUyIDcuNzFhLjkuOSAwIDAgMC0uOTEuOXYxMS44NWEuOS45IDAgMCAwIDEuODEgMFY4LjYyYzAtLjUtLjQtLjktLjktLjlabTMuNSAyLjkzYS45LjkgMCAwIDAtLjkuOTF2NS45N2EuOS45IDAgMCAwIDEuOCAwdi01Ljk3YzAtLjUtLjQtLjktLjktLjlabTMuNS01Ljc4Yy0uNSAwLS45LjQtLjkuOXYxNy41NWEuOS45IDAgMCAwIDEuODEgMFY1Ljc2YzAtLjUtLjQtLjktLjktLjlabTMuNTEgMy4zNGMtLjUgMC0uOS40LS45Ljl2MTAuODdhLjkuOSAwIDAgMCAxLjggMFY5LjFhLjkuOSAwIDAgMC0uOS0uOTFabTMuNSAzLjA4Yy0uNSAwLS45LjQtLjkuOTF2NC43YS45LjkgMCAxIDAgMS44IDB2LTQuN2EuOS45IDAgMCAwLS45LS45Wm0zLjUxLTcuNDVhLjkuOSAwIDAgMC0uOTEuOXYxOS42YS45LjkgMCAwIDAgMS44MSAwVjQuNzRjMC0uNS0uNC0uOS0uOS0uOVptMy41IDUuNTdhLjkuOSAwIDAgMC0uOS45MXY4LjQ1YS45LjkgMCAwIDAgMS44IDB2LTguNDVjMC0uNS0uNC0uOS0uOS0uOVptMCAwXFxcIi8+XFxuICAgIDxnIGNsaXAtcGF0aD1cXFwidXJsKCNjKVxcXCI+XFxuICAgICAgICA8cGF0aCBkPVxcXCJNNTQuMDQgMTIuOTZhLjkuOSAwIDAgMC0uOS45MXYxLjMzYS45LjkgMCAxIDAgMS44IDB2LTEuMzJhLjkuOSAwIDAgMC0uOS0uOTJabTAgMFxcXCIvPlxcbiAgICA8L2c+XFxuPC9zdmc+XCI7IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3JlY3RhbmdsZXMuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9yZWN0YW5nbGVzLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi90YWxrQnV0dG9uLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vdGFsa0J1dHRvbi5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9ydWxlU2V0WzFdLnJ1bGVzWzNdLnVzZVsxXSEuLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvZGlzdC9janMuanM/P3J1bGVTZXRbMV0ucnVsZXNbM10udXNlWzJdIS4vbW9iaWxlLnNjc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cnVsZVNldFsxXS5ydWxlc1szXS51c2VbMV0hLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9ydWxlU2V0WzFdLnJ1bGVzWzNdLnVzZVsyXSEuL21vYmlsZS5zY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCJpbXBvcnQgeyBfX2Fzc2lnbiB9IGZyb20gJy4vX3ZpcnR1YWwvX3RzbGliLmpzJztcbmltcG9ydCB7IHN5bWJvbE9ic2VydmFibGUsIHRvSW52b2tlU291cmNlLCBtYXBDb250ZXh0LCBpc01hY2hpbmUgfSBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7IHByb3ZpZGUgfSBmcm9tICcuL3NlcnZpY2VTY29wZS5qcyc7XG5cbmZ1bmN0aW9uIGNyZWF0ZU51bGxBY3RvcihpZCkge1xuICB2YXIgX2E7XG5cbiAgcmV0dXJuIF9hID0ge1xuICAgIGlkOiBpZCxcbiAgICBzZW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdm9pZCAwO1xuICAgIH0sXG4gICAgc3Vic2NyaWJlOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBnZXRTbmFwc2hvdDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9LFxuICAgIHRvSlNPTjogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaWQ6IGlkXG4gICAgICB9O1xuICAgIH1cbiAgfSwgX2Fbc3ltYm9sT2JzZXJ2YWJsZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sIF9hO1xufVxuLyoqXHJcbiAqIENyZWF0ZXMgYSBkZWZlcnJlZCBhY3RvciB0aGF0IGlzIGFibGUgdG8gYmUgaW52b2tlZCBnaXZlbiB0aGUgcHJvdmlkZWRcclxuICogaW52b2NhdGlvbiBpbmZvcm1hdGlvbiBpbiBpdHMgYC5tZXRhYCB2YWx1ZS5cclxuICpcclxuICogQHBhcmFtIGludm9rZURlZmluaXRpb24gVGhlIG1ldGEgaW5mb3JtYXRpb24gbmVlZGVkIHRvIGludm9rZSB0aGUgYWN0b3IuXHJcbiAqL1xuXG5mdW5jdGlvbiBjcmVhdGVJbnZvY2FibGVBY3RvcihpbnZva2VEZWZpbml0aW9uLCBtYWNoaW5lLCBjb250ZXh0LCBfZXZlbnQpIHtcbiAgdmFyIF9hO1xuXG4gIHZhciBpbnZva2VTcmMgPSB0b0ludm9rZVNvdXJjZShpbnZva2VEZWZpbml0aW9uLnNyYyk7XG4gIHZhciBzZXJ2aWNlQ3JlYXRvciA9IChfYSA9IG1hY2hpbmUgPT09IG51bGwgfHwgbWFjaGluZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogbWFjaGluZS5vcHRpb25zLnNlcnZpY2VzKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2FbaW52b2tlU3JjLnR5cGVdO1xuICB2YXIgcmVzb2x2ZWREYXRhID0gaW52b2tlRGVmaW5pdGlvbi5kYXRhID8gbWFwQ29udGV4dChpbnZva2VEZWZpbml0aW9uLmRhdGEsIGNvbnRleHQsIF9ldmVudCkgOiB1bmRlZmluZWQ7XG4gIHZhciB0ZW1wQWN0b3IgPSBzZXJ2aWNlQ3JlYXRvciA/IGNyZWF0ZURlZmVycmVkQWN0b3Ioc2VydmljZUNyZWF0b3IsIGludm9rZURlZmluaXRpb24uaWQsIHJlc29sdmVkRGF0YSkgOiBjcmVhdGVOdWxsQWN0b3IoaW52b2tlRGVmaW5pdGlvbi5pZCk7IC8vIEB0cy1pZ25vcmVcblxuICB0ZW1wQWN0b3IubWV0YSA9IGludm9rZURlZmluaXRpb247XG4gIHJldHVybiB0ZW1wQWN0b3I7XG59XG5mdW5jdGlvbiBjcmVhdGVEZWZlcnJlZEFjdG9yKGVudGl0eSwgaWQsIGRhdGEpIHtcbiAgdmFyIHRlbXBBY3RvciA9IGNyZWF0ZU51bGxBY3RvcihpZCk7IC8vIEB0cy1pZ25vcmVcblxuICB0ZW1wQWN0b3IuZGVmZXJyZWQgPSB0cnVlO1xuXG4gIGlmIChpc01hY2hpbmUoZW50aXR5KSkge1xuICAgIC8vIFwibXV0ZVwiIHRoZSBleGlzdGluZyBzZXJ2aWNlIHNjb3BlIHNvIHBvdGVudGlhbCBzcGF3bmVkIGFjdG9ycyB3aXRoaW4gdGhlIGAuaW5pdGlhbFN0YXRlYCBzdGF5IGRlZmVycmVkIGhlcmVcbiAgICB2YXIgaW5pdGlhbFN0YXRlXzEgPSB0ZW1wQWN0b3Iuc3RhdGUgPSBwcm92aWRlKHVuZGVmaW5lZCwgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIChkYXRhID8gZW50aXR5LndpdGhDb250ZXh0KGRhdGEpIDogZW50aXR5KS5pbml0aWFsU3RhdGU7XG4gICAgfSk7XG5cbiAgICB0ZW1wQWN0b3IuZ2V0U25hcHNob3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gaW5pdGlhbFN0YXRlXzE7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB0ZW1wQWN0b3I7XG59XG5mdW5jdGlvbiBpc0FjdG9yKGl0ZW0pIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gdHlwZW9mIGl0ZW0uc2VuZCA9PT0gJ2Z1bmN0aW9uJztcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuZnVuY3Rpb24gaXNTcGF3bmVkQWN0b3IoaXRlbSkge1xuICByZXR1cm4gaXNBY3RvcihpdGVtKSAmJiAnaWQnIGluIGl0ZW07XG59IC8vIFRPRE86IHJlZmFjdG9yIHRoZSByZXR1cm4gdHlwZSwgdGhpcyBjb3VsZCBiZSB3cml0dGVuIGluIGEgYmV0dGVyIHdheSBidXQgaXQncyBiZXN0IHRvIGF2b2lkIHVubmVjY2Vzc2FyeSBicmVha2luZyBjaGFuZ2VzIG5vd1xuXG5mdW5jdGlvbiB0b0FjdG9yUmVmKGFjdG9yUmVmTGlrZSkge1xuICB2YXIgX2E7XG5cbiAgcmV0dXJuIF9fYXNzaWduKChfYSA9IHtcbiAgICBzdWJzY3JpYmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICAgIGlkOiAnYW5vbnltb3VzJyxcbiAgICBnZXRTbmFwc2hvdDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH0sIF9hW3N5bWJvbE9ic2VydmFibGVdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9LCBfYSksIGFjdG9yUmVmTGlrZSk7XG59XG5cbmV4cG9ydCB7IGNyZWF0ZURlZmVycmVkQWN0b3IsIGNyZWF0ZUludm9jYWJsZUFjdG9yLCBjcmVhdGVOdWxsQWN0b3IsIGlzQWN0b3IsIGlzU3Bhd25lZEFjdG9yLCB0b0FjdG9yUmVmIH07XG4iLCJpbXBvcnQgeyBTdGF0ZU5vZGUgfSBmcm9tICcuL1N0YXRlTm9kZS5qcyc7XG5pbXBvcnQgeyBJU19QUk9EVUNUSU9OIH0gZnJvbSAnLi9lbnZpcm9ubWVudC5qcyc7XG5cbnZhciB3YXJuZWQgPSBmYWxzZTtcbmZ1bmN0aW9uIE1hY2hpbmUoY29uZmlnLCBvcHRpb25zLCBpbml0aWFsQ29udGV4dCkge1xuICBpZiAoaW5pdGlhbENvbnRleHQgPT09IHZvaWQgMCkge1xuICAgIGluaXRpYWxDb250ZXh0ID0gY29uZmlnLmNvbnRleHQ7XG4gIH1cblxuICByZXR1cm4gbmV3IFN0YXRlTm9kZShjb25maWcsIG9wdGlvbnMsIGluaXRpYWxDb250ZXh0KTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZU1hY2hpbmUoY29uZmlnLCBvcHRpb25zKSB7XG4gIGlmICghSVNfUFJPRFVDVElPTiAmJiAhKCdwcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50cycgaW4gY29uZmlnKSAmJiAhd2FybmVkKSB7XG4gICAgd2FybmVkID0gdHJ1ZTtcbiAgICBjb25zb2xlLndhcm4oJ0l0IGlzIGhpZ2hseSByZWNvbW1lbmRlZCB0byBzZXQgYHByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzYCB0byBgdHJ1ZWAgd2hlbiB1c2luZyBgY3JlYXRlTWFjaGluZWAuIGh0dHBzOi8veHN0YXRlLmpzLm9yZy9kb2NzL2d1aWRlcy9hY3Rpb25zLmh0bWwnKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgU3RhdGVOb2RlKGNvbmZpZywgb3B0aW9ucyk7XG59XG5cbmV4cG9ydCB7IE1hY2hpbmUsIGNyZWF0ZU1hY2hpbmUgfTtcbiIsImltcG9ydCB7IF9fYXNzaWduLCBfX3NwcmVhZEFycmF5LCBfX3JlYWQsIF9fcmVzdCB9IGZyb20gJy4vX3ZpcnR1YWwvX3RzbGliLmpzJztcbmltcG9ydCB7IEVNUFRZX0FDVElWSVRZX01BUCB9IGZyb20gJy4vY29uc3RhbnRzLmpzJztcbmltcG9ydCB7IGlzU3RyaW5nLCBtYXRjaGVzU3RhdGUsIHdhcm4gfSBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7IGdldE1ldGEsIG5leHRFdmVudHMgfSBmcm9tICcuL3N0YXRlVXRpbHMuanMnO1xuaW1wb3J0IHsgaW5pdEV2ZW50IH0gZnJvbSAnLi9hY3Rpb25zLmpzJztcbmltcG9ydCB7IElTX1BST0RVQ1RJT04gfSBmcm9tICcuL2Vudmlyb25tZW50LmpzJztcblxuZnVuY3Rpb24gc3RhdGVWYWx1ZXNFcXVhbChhLCBiKSB7XG4gIGlmIChhID09PSBiKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAoYSA9PT0gdW5kZWZpbmVkIHx8IGIgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChpc1N0cmluZyhhKSB8fCBpc1N0cmluZyhiKSkge1xuICAgIHJldHVybiBhID09PSBiO1xuICB9XG5cbiAgdmFyIGFLZXlzID0gT2JqZWN0LmtleXMoYSk7XG4gIHZhciBiS2V5cyA9IE9iamVjdC5rZXlzKGIpO1xuICByZXR1cm4gYUtleXMubGVuZ3RoID09PSBiS2V5cy5sZW5ndGggJiYgYUtleXMuZXZlcnkoZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBzdGF0ZVZhbHVlc0VxdWFsKGFba2V5XSwgYltrZXldKTtcbiAgfSk7XG59XG5mdW5jdGlvbiBpc1N0YXRlQ29uZmlnKHN0YXRlKSB7XG4gIGlmICh0eXBlb2Ygc3RhdGUgIT09ICdvYmplY3QnIHx8IHN0YXRlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuICd2YWx1ZScgaW4gc3RhdGUgJiYgJ19ldmVudCcgaW4gc3RhdGU7XG59XG4vKipcclxuICogQGRlcHJlY2F0ZWQgVXNlIGBpc1N0YXRlQ29uZmlnKG9iamVjdClgIG9yIGBzdGF0ZSBpbnN0YW5jZW9mIFN0YXRlYCBpbnN0ZWFkLlxyXG4gKi9cblxudmFyIGlzU3RhdGUgPSBpc1N0YXRlQ29uZmlnO1xuZnVuY3Rpb24gYmluZEFjdGlvblRvU3RhdGUoYWN0aW9uLCBzdGF0ZSkge1xuICB2YXIgZXhlYyA9IGFjdGlvbi5leGVjO1xuXG4gIHZhciBib3VuZEFjdGlvbiA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCBhY3Rpb24pLCB7XG4gICAgZXhlYzogZXhlYyAhPT0gdW5kZWZpbmVkID8gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGV4ZWMoc3RhdGUuY29udGV4dCwgc3RhdGUuZXZlbnQsIHtcbiAgICAgICAgYWN0aW9uOiBhY3Rpb24sXG4gICAgICAgIHN0YXRlOiBzdGF0ZSxcbiAgICAgICAgX2V2ZW50OiBzdGF0ZS5fZXZlbnRcbiAgICAgIH0pO1xuICAgIH0gOiB1bmRlZmluZWRcbiAgfSk7XG5cbiAgcmV0dXJuIGJvdW5kQWN0aW9uO1xufVxuXG52YXIgU3RhdGUgPVxuLyojX19QVVJFX18qL1xuXG4vKiogQGNsYXNzICovXG5mdW5jdGlvbiAoKSB7XG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYSBuZXcgU3RhdGUgaW5zdGFuY2UuXHJcbiAgICogQHBhcmFtIHZhbHVlIFRoZSBzdGF0ZSB2YWx1ZVxyXG4gICAqIEBwYXJhbSBjb250ZXh0IFRoZSBleHRlbmRlZCBzdGF0ZVxyXG4gICAqIEBwYXJhbSBoaXN0b3J5VmFsdWUgVGhlIHRyZWUgcmVwcmVzZW50aW5nIGhpc3RvcmljYWwgdmFsdWVzIG9mIHRoZSBzdGF0ZSBub2Rlc1xyXG4gICAqIEBwYXJhbSBoaXN0b3J5IFRoZSBwcmV2aW91cyBzdGF0ZVxyXG4gICAqIEBwYXJhbSBhY3Rpb25zIEFuIGFycmF5IG9mIGFjdGlvbiBvYmplY3RzIHRvIGV4ZWN1dGUgYXMgc2lkZS1lZmZlY3RzXHJcbiAgICogQHBhcmFtIGFjdGl2aXRpZXMgQSBtYXBwaW5nIG9mIGFjdGl2aXRpZXMgYW5kIHdoZXRoZXIgdGhleSBhcmUgc3RhcnRlZCAoYHRydWVgKSBvciBzdG9wcGVkIChgZmFsc2VgKS5cclxuICAgKiBAcGFyYW0gbWV0YVxyXG4gICAqIEBwYXJhbSBldmVudHMgSW50ZXJuYWwgZXZlbnQgcXVldWUuIFNob3VsZCBiZSBlbXB0eSB3aXRoIHJ1bi10by1jb21wbGV0aW9uIHNlbWFudGljcy5cclxuICAgKiBAcGFyYW0gY29uZmlndXJhdGlvblxyXG4gICAqL1xuICBmdW5jdGlvbiBTdGF0ZShjb25maWcpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIF9hO1xuXG4gICAgdGhpcy5hY3Rpb25zID0gW107XG4gICAgdGhpcy5hY3Rpdml0aWVzID0gRU1QVFlfQUNUSVZJVFlfTUFQO1xuICAgIHRoaXMubWV0YSA9IHt9O1xuICAgIHRoaXMuZXZlbnRzID0gW107XG4gICAgdGhpcy52YWx1ZSA9IGNvbmZpZy52YWx1ZTtcbiAgICB0aGlzLmNvbnRleHQgPSBjb25maWcuY29udGV4dDtcbiAgICB0aGlzLl9ldmVudCA9IGNvbmZpZy5fZXZlbnQ7XG4gICAgdGhpcy5fc2Vzc2lvbmlkID0gY29uZmlnLl9zZXNzaW9uaWQ7XG4gICAgdGhpcy5ldmVudCA9IHRoaXMuX2V2ZW50LmRhdGE7XG4gICAgdGhpcy5oaXN0b3J5VmFsdWUgPSBjb25maWcuaGlzdG9yeVZhbHVlO1xuICAgIHRoaXMuaGlzdG9yeSA9IGNvbmZpZy5oaXN0b3J5O1xuICAgIHRoaXMuYWN0aW9ucyA9IGNvbmZpZy5hY3Rpb25zIHx8IFtdO1xuICAgIHRoaXMuYWN0aXZpdGllcyA9IGNvbmZpZy5hY3Rpdml0aWVzIHx8IEVNUFRZX0FDVElWSVRZX01BUDtcbiAgICB0aGlzLm1ldGEgPSBnZXRNZXRhKGNvbmZpZy5jb25maWd1cmF0aW9uKTtcbiAgICB0aGlzLmV2ZW50cyA9IGNvbmZpZy5ldmVudHMgfHwgW107XG4gICAgdGhpcy5tYXRjaGVzID0gdGhpcy5tYXRjaGVzLmJpbmQodGhpcyk7XG4gICAgdGhpcy50b1N0cmluZ3MgPSB0aGlzLnRvU3RyaW5ncy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY29uZmlndXJhdGlvbiA9IGNvbmZpZy5jb25maWd1cmF0aW9uO1xuICAgIHRoaXMudHJhbnNpdGlvbnMgPSBjb25maWcudHJhbnNpdGlvbnM7XG4gICAgdGhpcy5jaGlsZHJlbiA9IGNvbmZpZy5jaGlsZHJlbjtcbiAgICB0aGlzLmRvbmUgPSAhIWNvbmZpZy5kb25lO1xuICAgIHRoaXMudGFncyA9IChfYSA9IEFycmF5LmlzQXJyYXkoY29uZmlnLnRhZ3MpID8gbmV3IFNldChjb25maWcudGFncykgOiBjb25maWcudGFncykgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogbmV3IFNldCgpO1xuICAgIHRoaXMubWFjaGluZSA9IGNvbmZpZy5tYWNoaW5lO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbmV4dEV2ZW50cycsIHtcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV4dEV2ZW50cyhfdGhpcy5jb25maWd1cmF0aW9uKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICAvKipcclxuICAgKiBDcmVhdGVzIGEgbmV3IFN0YXRlIGluc3RhbmNlIGZvciB0aGUgZ2l2ZW4gYHN0YXRlVmFsdWVgIGFuZCBgY29udGV4dGAuXHJcbiAgICogQHBhcmFtIHN0YXRlVmFsdWVcclxuICAgKiBAcGFyYW0gY29udGV4dFxyXG4gICAqL1xuXG5cbiAgU3RhdGUuZnJvbSA9IGZ1bmN0aW9uIChzdGF0ZVZhbHVlLCBjb250ZXh0KSB7XG4gICAgaWYgKHN0YXRlVmFsdWUgaW5zdGFuY2VvZiBTdGF0ZSkge1xuICAgICAgaWYgKHN0YXRlVmFsdWUuY29udGV4dCAhPT0gY29udGV4dCkge1xuICAgICAgICByZXR1cm4gbmV3IFN0YXRlKHtcbiAgICAgICAgICB2YWx1ZTogc3RhdGVWYWx1ZS52YWx1ZSxcbiAgICAgICAgICBjb250ZXh0OiBjb250ZXh0LFxuICAgICAgICAgIF9ldmVudDogc3RhdGVWYWx1ZS5fZXZlbnQsXG4gICAgICAgICAgX3Nlc3Npb25pZDogbnVsbCxcbiAgICAgICAgICBoaXN0b3J5VmFsdWU6IHN0YXRlVmFsdWUuaGlzdG9yeVZhbHVlLFxuICAgICAgICAgIGhpc3Rvcnk6IHN0YXRlVmFsdWUuaGlzdG9yeSxcbiAgICAgICAgICBhY3Rpb25zOiBbXSxcbiAgICAgICAgICBhY3Rpdml0aWVzOiBzdGF0ZVZhbHVlLmFjdGl2aXRpZXMsXG4gICAgICAgICAgbWV0YToge30sXG4gICAgICAgICAgZXZlbnRzOiBbXSxcbiAgICAgICAgICBjb25maWd1cmF0aW9uOiBbXSxcbiAgICAgICAgICB0cmFuc2l0aW9uczogW10sXG4gICAgICAgICAgY2hpbGRyZW46IHt9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3RhdGVWYWx1ZTtcbiAgICB9XG5cbiAgICB2YXIgX2V2ZW50ID0gaW5pdEV2ZW50O1xuICAgIHJldHVybiBuZXcgU3RhdGUoe1xuICAgICAgdmFsdWU6IHN0YXRlVmFsdWUsXG4gICAgICBjb250ZXh0OiBjb250ZXh0LFxuICAgICAgX2V2ZW50OiBfZXZlbnQsXG4gICAgICBfc2Vzc2lvbmlkOiBudWxsLFxuICAgICAgaGlzdG9yeVZhbHVlOiB1bmRlZmluZWQsXG4gICAgICBoaXN0b3J5OiB1bmRlZmluZWQsXG4gICAgICBhY3Rpb25zOiBbXSxcbiAgICAgIGFjdGl2aXRpZXM6IHVuZGVmaW5lZCxcbiAgICAgIG1ldGE6IHVuZGVmaW5lZCxcbiAgICAgIGV2ZW50czogW10sXG4gICAgICBjb25maWd1cmF0aW9uOiBbXSxcbiAgICAgIHRyYW5zaXRpb25zOiBbXSxcbiAgICAgIGNoaWxkcmVuOiB7fVxuICAgIH0pO1xuICB9O1xuICAvKipcclxuICAgKiBDcmVhdGVzIGEgbmV3IFN0YXRlIGluc3RhbmNlIGZvciB0aGUgZ2l2ZW4gYGNvbmZpZ2AuXHJcbiAgICogQHBhcmFtIGNvbmZpZyBUaGUgc3RhdGUgY29uZmlnXHJcbiAgICovXG5cblxuICBTdGF0ZS5jcmVhdGUgPSBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgcmV0dXJuIG5ldyBTdGF0ZShjb25maWcpO1xuICB9O1xuICAvKipcclxuICAgKiBDcmVhdGVzIGEgbmV3IGBTdGF0ZWAgaW5zdGFuY2UgZm9yIHRoZSBnaXZlbiBgc3RhdGVWYWx1ZWAgYW5kIGBjb250ZXh0YCB3aXRoIG5vIGFjdGlvbnMgKHNpZGUtZWZmZWN0cykuXHJcbiAgICogQHBhcmFtIHN0YXRlVmFsdWVcclxuICAgKiBAcGFyYW0gY29udGV4dFxyXG4gICAqL1xuXG5cbiAgU3RhdGUuaW5lcnQgPSBmdW5jdGlvbiAoc3RhdGVWYWx1ZSwgY29udGV4dCkge1xuICAgIGlmIChzdGF0ZVZhbHVlIGluc3RhbmNlb2YgU3RhdGUpIHtcbiAgICAgIGlmICghc3RhdGVWYWx1ZS5hY3Rpb25zLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gc3RhdGVWYWx1ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIF9ldmVudCA9IGluaXRFdmVudDtcbiAgICAgIHJldHVybiBuZXcgU3RhdGUoe1xuICAgICAgICB2YWx1ZTogc3RhdGVWYWx1ZS52YWx1ZSxcbiAgICAgICAgY29udGV4dDogY29udGV4dCxcbiAgICAgICAgX2V2ZW50OiBfZXZlbnQsXG4gICAgICAgIF9zZXNzaW9uaWQ6IG51bGwsXG4gICAgICAgIGhpc3RvcnlWYWx1ZTogc3RhdGVWYWx1ZS5oaXN0b3J5VmFsdWUsXG4gICAgICAgIGhpc3Rvcnk6IHN0YXRlVmFsdWUuaGlzdG9yeSxcbiAgICAgICAgYWN0aXZpdGllczogc3RhdGVWYWx1ZS5hY3Rpdml0aWVzLFxuICAgICAgICBjb25maWd1cmF0aW9uOiBzdGF0ZVZhbHVlLmNvbmZpZ3VyYXRpb24sXG4gICAgICAgIHRyYW5zaXRpb25zOiBbXSxcbiAgICAgICAgY2hpbGRyZW46IHt9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gU3RhdGUuZnJvbShzdGF0ZVZhbHVlLCBjb250ZXh0KTtcbiAgfTtcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBhbGwgdGhlIHN0cmluZyBsZWFmIHN0YXRlIG5vZGUgcGF0aHMuXHJcbiAgICogQHBhcmFtIHN0YXRlVmFsdWVcclxuICAgKiBAcGFyYW0gZGVsaW1pdGVyIFRoZSBjaGFyYWN0ZXIocykgdGhhdCBzZXBhcmF0ZSBlYWNoIHN1YnBhdGggaW4gdGhlIHN0cmluZyBzdGF0ZSBub2RlIHBhdGguXHJcbiAgICovXG5cblxuICBTdGF0ZS5wcm90b3R5cGUudG9TdHJpbmdzID0gZnVuY3Rpb24gKHN0YXRlVmFsdWUsIGRlbGltaXRlcikge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAoc3RhdGVWYWx1ZSA9PT0gdm9pZCAwKSB7XG4gICAgICBzdGF0ZVZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAoZGVsaW1pdGVyID09PSB2b2lkIDApIHtcbiAgICAgIGRlbGltaXRlciA9ICcuJztcbiAgICB9XG5cbiAgICBpZiAoaXNTdHJpbmcoc3RhdGVWYWx1ZSkpIHtcbiAgICAgIHJldHVybiBbc3RhdGVWYWx1ZV07XG4gICAgfVxuXG4gICAgdmFyIHZhbHVlS2V5cyA9IE9iamVjdC5rZXlzKHN0YXRlVmFsdWUpO1xuICAgIHJldHVybiB2YWx1ZUtleXMuY29uY2F0LmFwcGx5KHZhbHVlS2V5cywgX19zcHJlYWRBcnJheShbXSwgX19yZWFkKHZhbHVlS2V5cy5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgcmV0dXJuIF90aGlzLnRvU3RyaW5ncyhzdGF0ZVZhbHVlW2tleV0sIGRlbGltaXRlcikubWFwKGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIHJldHVybiBrZXkgKyBkZWxpbWl0ZXIgKyBzO1xuICAgICAgfSk7XG4gICAgfSkpLCBmYWxzZSkpO1xuICB9O1xuXG4gIFN0YXRlLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9hID0gdGhpcztcbiAgICAgICAgX2EuY29uZmlndXJhdGlvbjtcbiAgICAgICAgX2EudHJhbnNpdGlvbnM7XG4gICAgICAgIHZhciB0YWdzID0gX2EudGFncztcbiAgICAgICAgX2EubWFjaGluZTtcbiAgICAgICAgdmFyIGpzb25WYWx1ZXMgPSBfX3Jlc3QoX2EsIFtcImNvbmZpZ3VyYXRpb25cIiwgXCJ0cmFuc2l0aW9uc1wiLCBcInRhZ3NcIiwgXCJtYWNoaW5lXCJdKTtcblxuICAgIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwganNvblZhbHVlcyksIHtcbiAgICAgIHRhZ3M6IEFycmF5LmZyb20odGFncylcbiAgICB9KTtcbiAgfTtcblxuICBTdGF0ZS5wcm90b3R5cGUubWF0Y2hlcyA9IGZ1bmN0aW9uIChwYXJlbnRTdGF0ZVZhbHVlKSB7XG4gICAgcmV0dXJuIG1hdGNoZXNTdGF0ZShwYXJlbnRTdGF0ZVZhbHVlLCB0aGlzLnZhbHVlKTtcbiAgfTtcbiAgLyoqXHJcbiAgICogV2hldGhlciB0aGUgY3VycmVudCBzdGF0ZSBjb25maWd1cmF0aW9uIGhhcyBhIHN0YXRlIG5vZGUgd2l0aCB0aGUgc3BlY2lmaWVkIGB0YWdgLlxyXG4gICAqIEBwYXJhbSB0YWdcclxuICAgKi9cblxuXG4gIFN0YXRlLnByb3RvdHlwZS5oYXNUYWcgPSBmdW5jdGlvbiAodGFnKSB7XG4gICAgcmV0dXJuIHRoaXMudGFncy5oYXModGFnKTtcbiAgfTtcbiAgLyoqXHJcbiAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIHNlbmRpbmcgdGhlIGBldmVudGAgd2lsbCBjYXVzZSBhIG5vbi1mb3JiaWRkZW4gdHJhbnNpdGlvblxyXG4gICAqIHRvIGJlIHNlbGVjdGVkLCBldmVuIGlmIHRoZSB0cmFuc2l0aW9ucyBoYXZlIG5vIGFjdGlvbnMgbm9yXHJcbiAgICogY2hhbmdlIHRoZSBzdGF0ZSB2YWx1ZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQgdG8gdGVzdFxyXG4gICAqIEByZXR1cm5zIFdoZXRoZXIgdGhlIGV2ZW50IHdpbGwgY2F1c2UgYSB0cmFuc2l0aW9uXHJcbiAgICovXG5cblxuICBTdGF0ZS5wcm90b3R5cGUuY2FuID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIF9hO1xuXG4gICAgaWYgKElTX1BST0RVQ1RJT04pIHtcbiAgICAgIHdhcm4oISF0aGlzLm1hY2hpbmUsIFwic3RhdGUuY2FuKC4uLikgdXNlZCBvdXRzaWRlIG9mIGEgbWFjaGluZS1jcmVhdGVkIFN0YXRlIG9iamVjdDsgdGhpcyB3aWxsIGFsd2F5cyByZXR1cm4gZmFsc2UuXCIpO1xuICAgIH1cblxuICAgIHZhciB0cmFuc2l0aW9uRGF0YSA9IChfYSA9IHRoaXMubWFjaGluZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmdldFRyYW5zaXRpb25EYXRhKHRoaXMsIGV2ZW50KTtcbiAgICByZXR1cm4gISEodHJhbnNpdGlvbkRhdGEgPT09IG51bGwgfHwgdHJhbnNpdGlvbkRhdGEgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHRyYW5zaXRpb25EYXRhLnRyYW5zaXRpb25zLmxlbmd0aCkgJiYgLy8gQ2hlY2sgdGhhdCBhdCBsZWFzdCBvbmUgdHJhbnNpdGlvbiBpcyBub3QgZm9yYmlkZGVuXG4gICAgdHJhbnNpdGlvbkRhdGEudHJhbnNpdGlvbnMuc29tZShmdW5jdGlvbiAodCkge1xuICAgICAgcmV0dXJuIHQudGFyZ2V0ICE9PSB1bmRlZmluZWQgfHwgdC5hY3Rpb25zLmxlbmd0aDtcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gU3RhdGU7XG59KCk7XG5cbmV4cG9ydCB7IFN0YXRlLCBiaW5kQWN0aW9uVG9TdGF0ZSwgaXNTdGF0ZSwgaXNTdGF0ZUNvbmZpZywgc3RhdGVWYWx1ZXNFcXVhbCB9O1xuIiwiaW1wb3J0IHsgX19hc3NpZ24sIF9fc3ByZWFkQXJyYXksIF9fcmVhZCwgX192YWx1ZXMsIF9fcmVzdCB9IGZyb20gJy4vX3ZpcnR1YWwvX3RzbGliLmpzJztcbmltcG9ydCB7IGlzRnVuY3Rpb24sIG1hcFZhbHVlcywgaXNBcnJheSwgZmxhdHRlbiwgdG9BcnJheSwgdG9TdGF0ZVZhbHVlLCBpc1N0cmluZywgZ2V0RXZlbnRUeXBlLCB0b1NDWE1MRXZlbnQsIG1hdGNoZXNTdGF0ZSwgcGF0aCwgZXZhbHVhdGVHdWFyZCwgbWFwQ29udGV4dCwgaXNSYWlzYWJsZUFjdGlvbiwgcGF0aFRvU3RhdGVWYWx1ZSwgaXNCdWlsdEluRXZlbnQsIHBhcnRpdGlvbiwgdXBkYXRlSGlzdG9yeVZhbHVlLCB0b1N0YXRlUGF0aCwgbWFwRmlsdGVyVmFsdWVzLCB3YXJuLCB0b1N0YXRlUGF0aHMsIG5lc3RlZFBhdGgsIG5vcm1hbGl6ZVRhcmdldCwgdG9HdWFyZCwgdG9UcmFuc2l0aW9uQ29uZmlnQXJyYXksIGlzTWFjaGluZSwgY3JlYXRlSW52b2tlSWQgfSBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7IFN0YXRlLCBzdGF0ZVZhbHVlc0VxdWFsIH0gZnJvbSAnLi9TdGF0ZS5qcyc7XG5pbXBvcnQgeyBzdGFydCBhcyBzdGFydCQxLCBzdG9wIGFzIHN0b3AkMSwgaW52b2tlLCB1cGRhdGUsIG51bGxFdmVudCB9IGZyb20gJy4vYWN0aW9uVHlwZXMuanMnO1xuaW1wb3J0IHsgZG9uZSwgc3RhcnQsIHRvQWN0aW9uT2JqZWN0cywgcmFpc2UsIHN0b3AsIHJlc29sdmVBY3Rpb25zLCBkb25lSW52b2tlLCBlcnJvciwgdG9BY3Rpb25PYmplY3QsIHRvQWN0aXZpdHlEZWZpbml0aW9uLCBhZnRlciwgc2VuZCwgY2FuY2VsLCBpbml0RXZlbnQgfSBmcm9tICcuL2FjdGlvbnMuanMnO1xuaW1wb3J0IHsgSVNfUFJPRFVDVElPTiB9IGZyb20gJy4vZW52aXJvbm1lbnQuanMnO1xuaW1wb3J0IHsgU1RBVEVfREVMSU1JVEVSIH0gZnJvbSAnLi9jb25zdGFudHMuanMnO1xuaW1wb3J0IHsgZ2V0QWxsU3RhdGVOb2RlcywgZ2V0Q29uZmlndXJhdGlvbiwgaXNJbkZpbmFsU3RhdGUsIGdldFRhZ3NGcm9tQ29uZmlndXJhdGlvbiwgaGFzLCBnZXRDaGlsZHJlbiwgZ2V0VmFsdWUsIGlzTGVhZk5vZGUsIGdldEFsbENoaWxkcmVuIH0gZnJvbSAnLi9zdGF0ZVV0aWxzLmpzJztcbmltcG9ydCB7IGNyZWF0ZUludm9jYWJsZUFjdG9yIH0gZnJvbSAnLi9BY3Rvci5qcyc7XG5pbXBvcnQgeyB0b0ludm9rZURlZmluaXRpb24gfSBmcm9tICcuL2ludm9rZVV0aWxzLmpzJztcblxudmFyIE5VTExfRVZFTlQgPSAnJztcbnZhciBTVEFURV9JREVOVElGSUVSID0gJyMnO1xudmFyIFdJTERDQVJEID0gJyonO1xudmFyIEVNUFRZX09CSkVDVCA9IHt9O1xuXG52YXIgaXNTdGF0ZUlkID0gZnVuY3Rpb24gKHN0cikge1xuICByZXR1cm4gc3RyWzBdID09PSBTVEFURV9JREVOVElGSUVSO1xufTtcblxudmFyIGNyZWF0ZURlZmF1bHRPcHRpb25zID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIGFjdGlvbnM6IHt9LFxuICAgIGd1YXJkczoge30sXG4gICAgc2VydmljZXM6IHt9LFxuICAgIGFjdGl2aXRpZXM6IHt9LFxuICAgIGRlbGF5czoge31cbiAgfTtcbn07XG5cbnZhciB2YWxpZGF0ZUFycmF5aWZpZWRUcmFuc2l0aW9ucyA9IGZ1bmN0aW9uIChzdGF0ZU5vZGUsIGV2ZW50LCB0cmFuc2l0aW9ucykge1xuICB2YXIgaGFzTm9uTGFzdFVuZ3VhcmRlZFRhcmdldCA9IHRyYW5zaXRpb25zLnNsaWNlKDAsIC0xKS5zb21lKGZ1bmN0aW9uICh0cmFuc2l0aW9uKSB7XG4gICAgcmV0dXJuICEoJ2NvbmQnIGluIHRyYW5zaXRpb24pICYmICEoJ2luJyBpbiB0cmFuc2l0aW9uKSAmJiAoaXNTdHJpbmcodHJhbnNpdGlvbi50YXJnZXQpIHx8IGlzTWFjaGluZSh0cmFuc2l0aW9uLnRhcmdldCkpO1xuICB9KTtcbiAgdmFyIGV2ZW50VGV4dCA9IGV2ZW50ID09PSBOVUxMX0VWRU5UID8gJ3RoZSB0cmFuc2llbnQgZXZlbnQnIDogXCJldmVudCAnXCIuY29uY2F0KGV2ZW50LCBcIidcIik7XG4gIHdhcm4oIWhhc05vbkxhc3RVbmd1YXJkZWRUYXJnZXQsIFwiT25lIG9yIG1vcmUgdHJhbnNpdGlvbnMgZm9yIFwiLmNvbmNhdChldmVudFRleHQsIFwiIG9uIHN0YXRlICdcIikuY29uY2F0KHN0YXRlTm9kZS5pZCwgXCInIGFyZSB1bnJlYWNoYWJsZS4gXCIpICsgXCJNYWtlIHN1cmUgdGhhdCB0aGUgZGVmYXVsdCB0cmFuc2l0aW9uIGlzIHRoZSBsYXN0IG9uZSBkZWZpbmVkLlwiKTtcbn07XG5cbnZhciBTdGF0ZU5vZGUgPVxuLyojX19QVVJFX18qL1xuXG4vKiogQGNsYXNzICovXG5mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFN0YXRlTm9kZShcbiAgLyoqXHJcbiAgICogVGhlIHJhdyBjb25maWcgdXNlZCB0byBjcmVhdGUgdGhlIG1hY2hpbmUuXHJcbiAgICovXG4gIGNvbmZpZywgb3B0aW9ucyxcbiAgLyoqXHJcbiAgICogVGhlIGluaXRpYWwgZXh0ZW5kZWQgc3RhdGVcclxuICAgKi9cbiAgX2NvbnRleHQsIC8vIFRPRE86IHRoaXMgaXMgdW5zYWZlLCBidXQgd2UncmUgcmVtb3ZpbmcgaXQgaW4gdjUgYW55d2F5XG4gIF9zdGF0ZUluZm8pIHtcbiAgICBpZiAoX2NvbnRleHQgPT09IHZvaWQgMCkge1xuICAgICAgX2NvbnRleHQgPSAnY29udGV4dCcgaW4gY29uZmlnID8gY29uZmlnLmNvbnRleHQgOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBfYTtcblxuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMuX2NvbnRleHQgPSBfY29udGV4dDtcbiAgICAvKipcclxuICAgICAqIFRoZSBvcmRlciB0aGlzIHN0YXRlIG5vZGUgYXBwZWFycy4gQ29ycmVzcG9uZHMgdG8gdGhlIGltcGxpY2l0IFNDWE1MIGRvY3VtZW50IG9yZGVyLlxyXG4gICAgICovXG5cbiAgICB0aGlzLm9yZGVyID0gLTE7XG4gICAgdGhpcy5fX3hzdGF0ZW5vZGUgPSB0cnVlO1xuICAgIHRoaXMuX19jYWNoZSA9IHtcbiAgICAgIGV2ZW50czogdW5kZWZpbmVkLFxuICAgICAgcmVsYXRpdmVWYWx1ZTogbmV3IE1hcCgpLFxuICAgICAgaW5pdGlhbFN0YXRlVmFsdWU6IHVuZGVmaW5lZCxcbiAgICAgIGluaXRpYWxTdGF0ZTogdW5kZWZpbmVkLFxuICAgICAgb246IHVuZGVmaW5lZCxcbiAgICAgIHRyYW5zaXRpb25zOiB1bmRlZmluZWQsXG4gICAgICBjYW5kaWRhdGVzOiB7fSxcbiAgICAgIGRlbGF5ZWRUcmFuc2l0aW9uczogdW5kZWZpbmVkXG4gICAgfTtcbiAgICB0aGlzLmlkTWFwID0ge307XG4gICAgdGhpcy50YWdzID0gW107XG4gICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbihjcmVhdGVEZWZhdWx0T3B0aW9ucygpLCBvcHRpb25zKTtcbiAgICB0aGlzLnBhcmVudCA9IF9zdGF0ZUluZm8gPT09IG51bGwgfHwgX3N0YXRlSW5mbyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX3N0YXRlSW5mby5wYXJlbnQ7XG4gICAgdGhpcy5rZXkgPSB0aGlzLmNvbmZpZy5rZXkgfHwgKF9zdGF0ZUluZm8gPT09IG51bGwgfHwgX3N0YXRlSW5mbyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX3N0YXRlSW5mby5rZXkpIHx8IHRoaXMuY29uZmlnLmlkIHx8ICcobWFjaGluZSknO1xuICAgIHRoaXMubWFjaGluZSA9IHRoaXMucGFyZW50ID8gdGhpcy5wYXJlbnQubWFjaGluZSA6IHRoaXM7XG4gICAgdGhpcy5wYXRoID0gdGhpcy5wYXJlbnQgPyB0aGlzLnBhcmVudC5wYXRoLmNvbmNhdCh0aGlzLmtleSkgOiBbXTtcbiAgICB0aGlzLmRlbGltaXRlciA9IHRoaXMuY29uZmlnLmRlbGltaXRlciB8fCAodGhpcy5wYXJlbnQgPyB0aGlzLnBhcmVudC5kZWxpbWl0ZXIgOiBTVEFURV9ERUxJTUlURVIpO1xuICAgIHRoaXMuaWQgPSB0aGlzLmNvbmZpZy5pZCB8fCBfX3NwcmVhZEFycmF5KFt0aGlzLm1hY2hpbmUua2V5XSwgX19yZWFkKHRoaXMucGF0aCksIGZhbHNlKS5qb2luKHRoaXMuZGVsaW1pdGVyKTtcbiAgICB0aGlzLnZlcnNpb24gPSB0aGlzLnBhcmVudCA/IHRoaXMucGFyZW50LnZlcnNpb24gOiB0aGlzLmNvbmZpZy52ZXJzaW9uO1xuICAgIHRoaXMudHlwZSA9IHRoaXMuY29uZmlnLnR5cGUgfHwgKHRoaXMuY29uZmlnLnBhcmFsbGVsID8gJ3BhcmFsbGVsJyA6IHRoaXMuY29uZmlnLnN0YXRlcyAmJiBPYmplY3Qua2V5cyh0aGlzLmNvbmZpZy5zdGF0ZXMpLmxlbmd0aCA/ICdjb21wb3VuZCcgOiB0aGlzLmNvbmZpZy5oaXN0b3J5ID8gJ2hpc3RvcnknIDogJ2F0b21pYycpO1xuICAgIHRoaXMuc2NoZW1hID0gdGhpcy5wYXJlbnQgPyB0aGlzLm1hY2hpbmUuc2NoZW1hIDogKF9hID0gdGhpcy5jb25maWcuc2NoZW1hKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiB7fTtcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gdGhpcy5jb25maWcuZGVzY3JpcHRpb247XG5cbiAgICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICAgIHdhcm4oISgncGFyYWxsZWwnIGluIHRoaXMuY29uZmlnKSwgXCJUaGUgXFxcInBhcmFsbGVsXFxcIiBwcm9wZXJ0eSBpcyBkZXByZWNhdGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gdmVyc2lvbiA0LjEuIFwiLmNvbmNhdCh0aGlzLmNvbmZpZy5wYXJhbGxlbCA/IFwiUmVwbGFjZSB3aXRoIGB0eXBlOiAncGFyYWxsZWwnYFwiIDogXCJVc2UgYHR5cGU6ICdcIi5jb25jYXQodGhpcy50eXBlLCBcIidgXCIpLCBcIiBpbiB0aGUgY29uZmlnIGZvciBzdGF0ZSBub2RlICdcIikuY29uY2F0KHRoaXMuaWQsIFwiJyBpbnN0ZWFkLlwiKSk7XG4gICAgfVxuXG4gICAgdGhpcy5pbml0aWFsID0gdGhpcy5jb25maWcuaW5pdGlhbDtcbiAgICB0aGlzLnN0YXRlcyA9IHRoaXMuY29uZmlnLnN0YXRlcyA/IG1hcFZhbHVlcyh0aGlzLmNvbmZpZy5zdGF0ZXMsIGZ1bmN0aW9uIChzdGF0ZUNvbmZpZywga2V5KSB7XG4gICAgICB2YXIgX2E7XG5cbiAgICAgIHZhciBzdGF0ZU5vZGUgPSBuZXcgU3RhdGVOb2RlKHN0YXRlQ29uZmlnLCB7fSwgdW5kZWZpbmVkLCB7XG4gICAgICAgIHBhcmVudDogX3RoaXMsXG4gICAgICAgIGtleToga2V5XG4gICAgICB9KTtcbiAgICAgIE9iamVjdC5hc3NpZ24oX3RoaXMuaWRNYXAsIF9fYXNzaWduKChfYSA9IHt9LCBfYVtzdGF0ZU5vZGUuaWRdID0gc3RhdGVOb2RlLCBfYSksIHN0YXRlTm9kZS5pZE1hcCkpO1xuICAgICAgcmV0dXJuIHN0YXRlTm9kZTtcbiAgICB9KSA6IEVNUFRZX09CSkVDVDsgLy8gRG9jdW1lbnQgb3JkZXJcblxuICAgIHZhciBvcmRlciA9IDA7XG5cbiAgICBmdW5jdGlvbiBkZnMoc3RhdGVOb2RlKSB7XG4gICAgICB2YXIgZV8xLCBfYTtcblxuICAgICAgc3RhdGVOb2RlLm9yZGVyID0gb3JkZXIrKztcblxuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yICh2YXIgX2IgPSBfX3ZhbHVlcyhnZXRBbGxDaGlsZHJlbihzdGF0ZU5vZGUpKSwgX2MgPSBfYi5uZXh0KCk7ICFfYy5kb25lOyBfYyA9IF9iLm5leHQoKSkge1xuICAgICAgICAgIHZhciBjaGlsZCA9IF9jLnZhbHVlO1xuICAgICAgICAgIGRmcyhjaGlsZCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVfMV8xKSB7XG4gICAgICAgIGVfMSA9IHtcbiAgICAgICAgICBlcnJvcjogZV8xXzFcbiAgICAgICAgfTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKF9jICYmICFfYy5kb25lICYmIChfYSA9IF9iLnJldHVybikpIF9hLmNhbGwoX2IpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGRmcyh0aGlzKTsgLy8gSGlzdG9yeSBjb25maWdcblxuICAgIHRoaXMuaGlzdG9yeSA9IHRoaXMuY29uZmlnLmhpc3RvcnkgPT09IHRydWUgPyAnc2hhbGxvdycgOiB0aGlzLmNvbmZpZy5oaXN0b3J5IHx8IGZhbHNlO1xuICAgIHRoaXMuX3RyYW5zaWVudCA9ICEhdGhpcy5jb25maWcuYWx3YXlzIHx8ICghdGhpcy5jb25maWcub24gPyBmYWxzZSA6IEFycmF5LmlzQXJyYXkodGhpcy5jb25maWcub24pID8gdGhpcy5jb25maWcub24uc29tZShmdW5jdGlvbiAoX2EpIHtcbiAgICAgIHZhciBldmVudCA9IF9hLmV2ZW50O1xuICAgICAgcmV0dXJuIGV2ZW50ID09PSBOVUxMX0VWRU5UO1xuICAgIH0pIDogTlVMTF9FVkVOVCBpbiB0aGlzLmNvbmZpZy5vbik7XG4gICAgdGhpcy5zdHJpY3QgPSAhIXRoaXMuY29uZmlnLnN0cmljdDsgLy8gVE9ETzogZGVwcmVjYXRlIChlbnRyeSlcblxuICAgIHRoaXMub25FbnRyeSA9IHRvQXJyYXkodGhpcy5jb25maWcuZW50cnkgfHwgdGhpcy5jb25maWcub25FbnRyeSkubWFwKGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgIHJldHVybiB0b0FjdGlvbk9iamVjdChhY3Rpb24pO1xuICAgIH0pOyAvLyBUT0RPOiBkZXByZWNhdGUgKGV4aXQpXG5cbiAgICB0aGlzLm9uRXhpdCA9IHRvQXJyYXkodGhpcy5jb25maWcuZXhpdCB8fCB0aGlzLmNvbmZpZy5vbkV4aXQpLm1hcChmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICByZXR1cm4gdG9BY3Rpb25PYmplY3QoYWN0aW9uKTtcbiAgICB9KTtcbiAgICB0aGlzLm1ldGEgPSB0aGlzLmNvbmZpZy5tZXRhO1xuICAgIHRoaXMuZG9uZURhdGEgPSB0aGlzLnR5cGUgPT09ICdmaW5hbCcgPyB0aGlzLmNvbmZpZy5kYXRhIDogdW5kZWZpbmVkO1xuICAgIHRoaXMuaW52b2tlID0gdG9BcnJheSh0aGlzLmNvbmZpZy5pbnZva2UpLm1hcChmdW5jdGlvbiAoaW52b2tlQ29uZmlnLCBpKSB7XG4gICAgICB2YXIgX2EsIF9iO1xuXG4gICAgICBpZiAoaXNNYWNoaW5lKGludm9rZUNvbmZpZykpIHtcbiAgICAgICAgdmFyIGludm9rZUlkID0gY3JlYXRlSW52b2tlSWQoX3RoaXMuaWQsIGkpO1xuICAgICAgICBfdGhpcy5tYWNoaW5lLm9wdGlvbnMuc2VydmljZXMgPSBfX2Fzc2lnbigoX2EgPSB7fSwgX2FbaW52b2tlSWRdID0gaW52b2tlQ29uZmlnLCBfYSksIF90aGlzLm1hY2hpbmUub3B0aW9ucy5zZXJ2aWNlcyk7XG4gICAgICAgIHJldHVybiB0b0ludm9rZURlZmluaXRpb24oe1xuICAgICAgICAgIHNyYzogaW52b2tlSWQsXG4gICAgICAgICAgaWQ6IGludm9rZUlkXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChpc1N0cmluZyhpbnZva2VDb25maWcuc3JjKSkge1xuICAgICAgICB2YXIgaW52b2tlSWQgPSBpbnZva2VDb25maWcuaWQgfHwgY3JlYXRlSW52b2tlSWQoX3RoaXMuaWQsIGkpO1xuICAgICAgICByZXR1cm4gdG9JbnZva2VEZWZpbml0aW9uKF9fYXNzaWduKF9fYXNzaWduKHt9LCBpbnZva2VDb25maWcpLCB7XG4gICAgICAgICAgaWQ6IGludm9rZUlkLFxuICAgICAgICAgIHNyYzogaW52b2tlQ29uZmlnLnNyY1xuICAgICAgICB9KSk7XG4gICAgICB9IGVsc2UgaWYgKGlzTWFjaGluZShpbnZva2VDb25maWcuc3JjKSB8fCBpc0Z1bmN0aW9uKGludm9rZUNvbmZpZy5zcmMpKSB7XG4gICAgICAgIHZhciBpbnZva2VJZCA9IGludm9rZUNvbmZpZy5pZCB8fCBjcmVhdGVJbnZva2VJZChfdGhpcy5pZCwgaSk7XG4gICAgICAgIF90aGlzLm1hY2hpbmUub3B0aW9ucy5zZXJ2aWNlcyA9IF9fYXNzaWduKChfYiA9IHt9LCBfYltpbnZva2VJZF0gPSBpbnZva2VDb25maWcuc3JjLCBfYiksIF90aGlzLm1hY2hpbmUub3B0aW9ucy5zZXJ2aWNlcyk7XG4gICAgICAgIHJldHVybiB0b0ludm9rZURlZmluaXRpb24oX19hc3NpZ24oX19hc3NpZ24oe1xuICAgICAgICAgIGlkOiBpbnZva2VJZFxuICAgICAgICB9LCBpbnZva2VDb25maWcpLCB7XG4gICAgICAgICAgc3JjOiBpbnZva2VJZFxuICAgICAgICB9KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgaW52b2tlU291cmNlID0gaW52b2tlQ29uZmlnLnNyYztcbiAgICAgICAgcmV0dXJuIHRvSW52b2tlRGVmaW5pdGlvbihfX2Fzc2lnbihfX2Fzc2lnbih7XG4gICAgICAgICAgaWQ6IGNyZWF0ZUludm9rZUlkKF90aGlzLmlkLCBpKVxuICAgICAgICB9LCBpbnZva2VDb25maWcpLCB7XG4gICAgICAgICAgc3JjOiBpbnZva2VTb3VyY2VcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuYWN0aXZpdGllcyA9IHRvQXJyYXkodGhpcy5jb25maWcuYWN0aXZpdGllcykuY29uY2F0KHRoaXMuaW52b2tlKS5tYXAoZnVuY3Rpb24gKGFjdGl2aXR5KSB7XG4gICAgICByZXR1cm4gdG9BY3Rpdml0eURlZmluaXRpb24oYWN0aXZpdHkpO1xuICAgIH0pO1xuICAgIHRoaXMudHJhbnNpdGlvbiA9IHRoaXMudHJhbnNpdGlvbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMudGFncyA9IHRvQXJyYXkodGhpcy5jb25maWcudGFncyk7IC8vIFRPRE86IHRoaXMgaXMgdGhlIHJlYWwgZml4IGZvciBpbml0aWFsaXphdGlvbiBvbmNlXG4gICAgLy8gc3RhdGUgbm9kZSBnZXR0ZXJzIGFyZSBkZXByZWNhdGVkXG4gICAgLy8gaWYgKCF0aGlzLnBhcmVudCkge1xuICAgIC8vICAgdGhpcy5faW5pdCgpO1xuICAgIC8vIH1cbiAgfVxuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuX19jYWNoZS50cmFuc2l0aW9ucykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGdldEFsbFN0YXRlTm9kZXModGhpcykuZm9yRWFjaChmdW5jdGlvbiAoc3RhdGVOb2RlKSB7XG4gICAgICByZXR1cm4gc3RhdGVOb2RlLm9uO1xuICAgIH0pO1xuICB9O1xuICAvKipcclxuICAgKiBDbG9uZXMgdGhpcyBzdGF0ZSBtYWNoaW5lIHdpdGggY3VzdG9tIG9wdGlvbnMgYW5kIGNvbnRleHQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIChhY3Rpb25zLCBndWFyZHMsIGFjdGl2aXRpZXMsIHNlcnZpY2VzKSB0byByZWN1cnNpdmVseSBtZXJnZSB3aXRoIHRoZSBleGlzdGluZyBvcHRpb25zLlxyXG4gICAqIEBwYXJhbSBjb250ZXh0IEN1c3RvbSBjb250ZXh0ICh3aWxsIG92ZXJyaWRlIHByZWRlZmluZWQgY29udGV4dClcclxuICAgKi9cblxuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUud2l0aENvbmZpZyA9IGZ1bmN0aW9uIChvcHRpb25zLCBjb250ZXh0KSB7XG4gICAgdmFyIF9hID0gdGhpcy5vcHRpb25zLFxuICAgICAgICBhY3Rpb25zID0gX2EuYWN0aW9ucyxcbiAgICAgICAgYWN0aXZpdGllcyA9IF9hLmFjdGl2aXRpZXMsXG4gICAgICAgIGd1YXJkcyA9IF9hLmd1YXJkcyxcbiAgICAgICAgc2VydmljZXMgPSBfYS5zZXJ2aWNlcyxcbiAgICAgICAgZGVsYXlzID0gX2EuZGVsYXlzO1xuICAgIHJldHVybiBuZXcgU3RhdGVOb2RlKHRoaXMuY29uZmlnLCB7XG4gICAgICBhY3Rpb25zOiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgYWN0aW9ucyksIG9wdGlvbnMuYWN0aW9ucyksXG4gICAgICBhY3Rpdml0aWVzOiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgYWN0aXZpdGllcyksIG9wdGlvbnMuYWN0aXZpdGllcyksXG4gICAgICBndWFyZHM6IF9fYXNzaWduKF9fYXNzaWduKHt9LCBndWFyZHMpLCBvcHRpb25zLmd1YXJkcyksXG4gICAgICBzZXJ2aWNlczogX19hc3NpZ24oX19hc3NpZ24oe30sIHNlcnZpY2VzKSwgb3B0aW9ucy5zZXJ2aWNlcyksXG4gICAgICBkZWxheXM6IF9fYXNzaWduKF9fYXNzaWduKHt9LCBkZWxheXMpLCBvcHRpb25zLmRlbGF5cylcbiAgICB9LCBjb250ZXh0ICE9PSBudWxsICYmIGNvbnRleHQgIT09IHZvaWQgMCA/IGNvbnRleHQgOiB0aGlzLmNvbnRleHQpO1xuICB9O1xuICAvKipcclxuICAgKiBDbG9uZXMgdGhpcyBzdGF0ZSBtYWNoaW5lIHdpdGggY3VzdG9tIGNvbnRleHQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gY29udGV4dCBDdXN0b20gY29udGV4dCAod2lsbCBvdmVycmlkZSBwcmVkZWZpbmVkIGNvbnRleHQsIG5vdCByZWN1cnNpdmUpXHJcbiAgICovXG5cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLndpdGhDb250ZXh0ID0gZnVuY3Rpb24gKGNvbnRleHQpIHtcbiAgICByZXR1cm4gbmV3IFN0YXRlTm9kZSh0aGlzLmNvbmZpZywgdGhpcy5vcHRpb25zLCBjb250ZXh0KTtcbiAgfTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RhdGVOb2RlLnByb3RvdHlwZSwgXCJjb250ZXh0XCIsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBpc0Z1bmN0aW9uKHRoaXMuX2NvbnRleHQpID8gdGhpcy5fY29udGV4dCgpIDogdGhpcy5fY29udGV4dDtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0YXRlTm9kZS5wcm90b3R5cGUsIFwiZGVmaW5pdGlvblwiLCB7XG4gICAgLyoqXHJcbiAgICAgKiBUaGUgd2VsbC1zdHJ1Y3R1cmVkIHN0YXRlIG5vZGUgZGVmaW5pdGlvbi5cclxuICAgICAqL1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgIGtleTogdGhpcy5rZXksXG4gICAgICAgIHZlcnNpb246IHRoaXMudmVyc2lvbixcbiAgICAgICAgY29udGV4dDogdGhpcy5jb250ZXh0LFxuICAgICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICAgIGluaXRpYWw6IHRoaXMuaW5pdGlhbCxcbiAgICAgICAgaGlzdG9yeTogdGhpcy5oaXN0b3J5LFxuICAgICAgICBzdGF0ZXM6IG1hcFZhbHVlcyh0aGlzLnN0YXRlcywgZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICAgICAgcmV0dXJuIHN0YXRlLmRlZmluaXRpb247XG4gICAgICAgIH0pLFxuICAgICAgICBvbjogdGhpcy5vbixcbiAgICAgICAgdHJhbnNpdGlvbnM6IHRoaXMudHJhbnNpdGlvbnMsXG4gICAgICAgIGVudHJ5OiB0aGlzLm9uRW50cnksXG4gICAgICAgIGV4aXQ6IHRoaXMub25FeGl0LFxuICAgICAgICBhY3Rpdml0aWVzOiB0aGlzLmFjdGl2aXRpZXMgfHwgW10sXG4gICAgICAgIG1ldGE6IHRoaXMubWV0YSxcbiAgICAgICAgb3JkZXI6IHRoaXMub3JkZXIgfHwgLTEsXG4gICAgICAgIGRhdGE6IHRoaXMuZG9uZURhdGEsXG4gICAgICAgIGludm9rZTogdGhpcy5pbnZva2UsXG4gICAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLmRlc2NyaXB0aW9uLFxuICAgICAgICB0YWdzOiB0aGlzLnRhZ3NcbiAgICAgIH07XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVmaW5pdGlvbjtcbiAgfTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RhdGVOb2RlLnByb3RvdHlwZSwgXCJvblwiLCB7XG4gICAgLyoqXHJcbiAgICAgKiBUaGUgbWFwcGluZyBvZiBldmVudHMgdG8gdHJhbnNpdGlvbnMuXHJcbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLl9fY2FjaGUub24pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19jYWNoZS5vbjtcbiAgICAgIH1cblxuICAgICAgdmFyIHRyYW5zaXRpb25zID0gdGhpcy50cmFuc2l0aW9ucztcbiAgICAgIHJldHVybiB0aGlzLl9fY2FjaGUub24gPSB0cmFuc2l0aW9ucy5yZWR1Y2UoZnVuY3Rpb24gKG1hcCwgdHJhbnNpdGlvbikge1xuICAgICAgICBtYXBbdHJhbnNpdGlvbi5ldmVudFR5cGVdID0gbWFwW3RyYW5zaXRpb24uZXZlbnRUeXBlXSB8fCBbXTtcbiAgICAgICAgbWFwW3RyYW5zaXRpb24uZXZlbnRUeXBlXS5wdXNoKHRyYW5zaXRpb24pO1xuICAgICAgICByZXR1cm4gbWFwO1xuICAgICAgfSwge30pO1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RhdGVOb2RlLnByb3RvdHlwZSwgXCJhZnRlclwiLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX2NhY2hlLmRlbGF5ZWRUcmFuc2l0aW9ucyB8fCAodGhpcy5fX2NhY2hlLmRlbGF5ZWRUcmFuc2l0aW9ucyA9IHRoaXMuZ2V0RGVsYXllZFRyYW5zaXRpb25zKCksIHRoaXMuX19jYWNoZS5kZWxheWVkVHJhbnNpdGlvbnMpO1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RhdGVOb2RlLnByb3RvdHlwZSwgXCJ0cmFuc2l0aW9uc1wiLCB7XG4gICAgLyoqXHJcbiAgICAgKiBBbGwgdGhlIHRyYW5zaXRpb25zIHRoYXQgY2FuIGJlIHRha2VuIGZyb20gdGhpcyBzdGF0ZSBub2RlLlxyXG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX2NhY2hlLnRyYW5zaXRpb25zIHx8ICh0aGlzLl9fY2FjaGUudHJhbnNpdGlvbnMgPSB0aGlzLmZvcm1hdFRyYW5zaXRpb25zKCksIHRoaXMuX19jYWNoZS50cmFuc2l0aW9ucyk7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5nZXRDYW5kaWRhdGVzID0gZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuICAgIGlmICh0aGlzLl9fY2FjaGUuY2FuZGlkYXRlc1tldmVudE5hbWVdKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX2NhY2hlLmNhbmRpZGF0ZXNbZXZlbnROYW1lXTtcbiAgICB9XG5cbiAgICB2YXIgdHJhbnNpZW50ID0gZXZlbnROYW1lID09PSBOVUxMX0VWRU5UO1xuICAgIHZhciBjYW5kaWRhdGVzID0gdGhpcy50cmFuc2l0aW9ucy5maWx0ZXIoZnVuY3Rpb24gKHRyYW5zaXRpb24pIHtcbiAgICAgIHZhciBzYW1lRXZlbnRUeXBlID0gdHJhbnNpdGlvbi5ldmVudFR5cGUgPT09IGV2ZW50TmFtZTsgLy8gbnVsbCBldmVudHMgc2hvdWxkIG9ubHkgbWF0Y2ggYWdhaW5zdCBldmVudGxlc3MgdHJhbnNpdGlvbnNcblxuICAgICAgcmV0dXJuIHRyYW5zaWVudCA/IHNhbWVFdmVudFR5cGUgOiBzYW1lRXZlbnRUeXBlIHx8IHRyYW5zaXRpb24uZXZlbnRUeXBlID09PSBXSUxEQ0FSRDtcbiAgICB9KTtcbiAgICB0aGlzLl9fY2FjaGUuY2FuZGlkYXRlc1tldmVudE5hbWVdID0gY2FuZGlkYXRlcztcbiAgICByZXR1cm4gY2FuZGlkYXRlcztcbiAgfTtcbiAgLyoqXHJcbiAgICogQWxsIGRlbGF5ZWQgdHJhbnNpdGlvbnMgZnJvbSB0aGUgY29uZmlnLlxyXG4gICAqL1xuXG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5nZXREZWxheWVkVHJhbnNpdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBhZnRlckNvbmZpZyA9IHRoaXMuY29uZmlnLmFmdGVyO1xuXG4gICAgaWYgKCFhZnRlckNvbmZpZykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIHZhciBtdXRhdGVFbnRyeUV4aXQgPSBmdW5jdGlvbiAoZGVsYXksIGkpIHtcbiAgICAgIHZhciBkZWxheVJlZiA9IGlzRnVuY3Rpb24oZGVsYXkpID8gXCJcIi5jb25jYXQoX3RoaXMuaWQsIFwiOmRlbGF5W1wiKS5jb25jYXQoaSwgXCJdXCIpIDogZGVsYXk7XG4gICAgICB2YXIgZXZlbnRUeXBlID0gYWZ0ZXIoZGVsYXlSZWYsIF90aGlzLmlkKTtcblxuICAgICAgX3RoaXMub25FbnRyeS5wdXNoKHNlbmQoZXZlbnRUeXBlLCB7XG4gICAgICAgIGRlbGF5OiBkZWxheVxuICAgICAgfSkpO1xuXG4gICAgICBfdGhpcy5vbkV4aXQucHVzaChjYW5jZWwoZXZlbnRUeXBlKSk7XG5cbiAgICAgIHJldHVybiBldmVudFR5cGU7XG4gICAgfTtcblxuICAgIHZhciBkZWxheWVkVHJhbnNpdGlvbnMgPSBpc0FycmF5KGFmdGVyQ29uZmlnKSA/IGFmdGVyQ29uZmlnLm1hcChmdW5jdGlvbiAodHJhbnNpdGlvbiwgaSkge1xuICAgICAgdmFyIGV2ZW50VHlwZSA9IG11dGF0ZUVudHJ5RXhpdCh0cmFuc2l0aW9uLmRlbGF5LCBpKTtcbiAgICAgIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgdHJhbnNpdGlvbiksIHtcbiAgICAgICAgZXZlbnQ6IGV2ZW50VHlwZVxuICAgICAgfSk7XG4gICAgfSkgOiBmbGF0dGVuKE9iamVjdC5rZXlzKGFmdGVyQ29uZmlnKS5tYXAoZnVuY3Rpb24gKGRlbGF5LCBpKSB7XG4gICAgICB2YXIgY29uZmlnVHJhbnNpdGlvbiA9IGFmdGVyQ29uZmlnW2RlbGF5XTtcbiAgICAgIHZhciByZXNvbHZlZFRyYW5zaXRpb24gPSBpc1N0cmluZyhjb25maWdUcmFuc2l0aW9uKSA/IHtcbiAgICAgICAgdGFyZ2V0OiBjb25maWdUcmFuc2l0aW9uXG4gICAgICB9IDogY29uZmlnVHJhbnNpdGlvbjtcbiAgICAgIHZhciByZXNvbHZlZERlbGF5ID0gIWlzTmFOKCtkZWxheSkgPyArZGVsYXkgOiBkZWxheTtcbiAgICAgIHZhciBldmVudFR5cGUgPSBtdXRhdGVFbnRyeUV4aXQocmVzb2x2ZWREZWxheSwgaSk7XG4gICAgICByZXR1cm4gdG9BcnJheShyZXNvbHZlZFRyYW5zaXRpb24pLm1hcChmdW5jdGlvbiAodHJhbnNpdGlvbikge1xuICAgICAgICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIHRyYW5zaXRpb24pLCB7XG4gICAgICAgICAgZXZlbnQ6IGV2ZW50VHlwZSxcbiAgICAgICAgICBkZWxheTogcmVzb2x2ZWREZWxheVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pKTtcbiAgICByZXR1cm4gZGVsYXllZFRyYW5zaXRpb25zLm1hcChmdW5jdGlvbiAoZGVsYXllZFRyYW5zaXRpb24pIHtcbiAgICAgIHZhciBkZWxheSA9IGRlbGF5ZWRUcmFuc2l0aW9uLmRlbGF5O1xuICAgICAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCBfdGhpcy5mb3JtYXRUcmFuc2l0aW9uKGRlbGF5ZWRUcmFuc2l0aW9uKSksIHtcbiAgICAgICAgZGVsYXk6IGRlbGF5XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgc3RhdGUgbm9kZXMgcmVwcmVzZW50ZWQgYnkgdGhlIGN1cnJlbnQgc3RhdGUgdmFsdWUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gc3RhdGUgVGhlIHN0YXRlIHZhbHVlIG9yIFN0YXRlIGluc3RhbmNlXHJcbiAgICovXG5cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmdldFN0YXRlTm9kZXMgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICB2YXIgX2E7XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKCFzdGF0ZSkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIHZhciBzdGF0ZVZhbHVlID0gc3RhdGUgaW5zdGFuY2VvZiBTdGF0ZSA/IHN0YXRlLnZhbHVlIDogdG9TdGF0ZVZhbHVlKHN0YXRlLCB0aGlzLmRlbGltaXRlcik7XG5cbiAgICBpZiAoaXNTdHJpbmcoc3RhdGVWYWx1ZSkpIHtcbiAgICAgIHZhciBpbml0aWFsU3RhdGVWYWx1ZSA9IHRoaXMuZ2V0U3RhdGVOb2RlKHN0YXRlVmFsdWUpLmluaXRpYWw7XG4gICAgICByZXR1cm4gaW5pdGlhbFN0YXRlVmFsdWUgIT09IHVuZGVmaW5lZCA/IHRoaXMuZ2V0U3RhdGVOb2RlcygoX2EgPSB7fSwgX2Fbc3RhdGVWYWx1ZV0gPSBpbml0aWFsU3RhdGVWYWx1ZSwgX2EpKSA6IFt0aGlzLCB0aGlzLnN0YXRlc1tzdGF0ZVZhbHVlXV07XG4gICAgfVxuXG4gICAgdmFyIHN1YlN0YXRlS2V5cyA9IE9iamVjdC5rZXlzKHN0YXRlVmFsdWUpO1xuICAgIHZhciBzdWJTdGF0ZU5vZGVzID0gW3RoaXNdO1xuICAgIHN1YlN0YXRlTm9kZXMucHVzaC5hcHBseShzdWJTdGF0ZU5vZGVzLCBfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQoZmxhdHRlbihzdWJTdGF0ZUtleXMubWFwKGZ1bmN0aW9uIChzdWJTdGF0ZUtleSkge1xuICAgICAgcmV0dXJuIF90aGlzLmdldFN0YXRlTm9kZShzdWJTdGF0ZUtleSkuZ2V0U3RhdGVOb2RlcyhzdGF0ZVZhbHVlW3N1YlN0YXRlS2V5XSk7XG4gICAgfSkpKSwgZmFsc2UpKTtcbiAgICByZXR1cm4gc3ViU3RhdGVOb2RlcztcbiAgfTtcbiAgLyoqXHJcbiAgICogUmV0dXJucyBgdHJ1ZWAgaWYgdGhpcyBzdGF0ZSBub2RlIGV4cGxpY2l0bHkgaGFuZGxlcyB0aGUgZ2l2ZW4gZXZlbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50IGluIHF1ZXN0aW9uXHJcbiAgICovXG5cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmhhbmRsZXMgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgZXZlbnRUeXBlID0gZ2V0RXZlbnRUeXBlKGV2ZW50KTtcbiAgICByZXR1cm4gdGhpcy5ldmVudHMuaW5jbHVkZXMoZXZlbnRUeXBlKTtcbiAgfTtcbiAgLyoqXHJcbiAgICogUmVzb2x2ZXMgdGhlIGdpdmVuIGBzdGF0ZWAgdG8gYSBuZXcgYFN0YXRlYCBpbnN0YW5jZSByZWxhdGl2ZSB0byB0aGlzIG1hY2hpbmUuXHJcbiAgICpcclxuICAgKiBUaGlzIGVuc3VyZXMgdGhhdCBgLmV2ZW50c2AgYW5kIGAubmV4dEV2ZW50c2AgcmVwcmVzZW50IHRoZSBjb3JyZWN0IHZhbHVlcy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBzdGF0ZSBUaGUgc3RhdGUgdG8gcmVzb2x2ZVxyXG4gICAqL1xuXG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5yZXNvbHZlU3RhdGUgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICB2YXIgc3RhdGVGcm9tQ29uZmlnID0gc3RhdGUgaW5zdGFuY2VvZiBTdGF0ZSA/IHN0YXRlIDogU3RhdGUuY3JlYXRlKHN0YXRlKTtcbiAgICB2YXIgY29uZmlndXJhdGlvbiA9IEFycmF5LmZyb20oZ2V0Q29uZmlndXJhdGlvbihbXSwgdGhpcy5nZXRTdGF0ZU5vZGVzKHN0YXRlRnJvbUNvbmZpZy52YWx1ZSkpKTtcbiAgICByZXR1cm4gbmV3IFN0YXRlKF9fYXNzaWduKF9fYXNzaWduKHt9LCBzdGF0ZUZyb21Db25maWcpLCB7XG4gICAgICB2YWx1ZTogdGhpcy5yZXNvbHZlKHN0YXRlRnJvbUNvbmZpZy52YWx1ZSksXG4gICAgICBjb25maWd1cmF0aW9uOiBjb25maWd1cmF0aW9uLFxuICAgICAgZG9uZTogaXNJbkZpbmFsU3RhdGUoY29uZmlndXJhdGlvbiwgdGhpcyksXG4gICAgICB0YWdzOiBnZXRUYWdzRnJvbUNvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvbiksXG4gICAgICBtYWNoaW5lOiB0aGlzLm1hY2hpbmVcbiAgICB9KSk7XG4gIH07XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS50cmFuc2l0aW9uTGVhZk5vZGUgPSBmdW5jdGlvbiAoc3RhdGVWYWx1ZSwgc3RhdGUsIF9ldmVudCkge1xuICAgIHZhciBzdGF0ZU5vZGUgPSB0aGlzLmdldFN0YXRlTm9kZShzdGF0ZVZhbHVlKTtcbiAgICB2YXIgbmV4dCA9IHN0YXRlTm9kZS5uZXh0KHN0YXRlLCBfZXZlbnQpO1xuXG4gICAgaWYgKCFuZXh0IHx8ICFuZXh0LnRyYW5zaXRpb25zLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHRoaXMubmV4dChzdGF0ZSwgX2V2ZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV4dDtcbiAgfTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLnRyYW5zaXRpb25Db21wb3VuZE5vZGUgPSBmdW5jdGlvbiAoc3RhdGVWYWx1ZSwgc3RhdGUsIF9ldmVudCkge1xuICAgIHZhciBzdWJTdGF0ZUtleXMgPSBPYmplY3Qua2V5cyhzdGF0ZVZhbHVlKTtcbiAgICB2YXIgc3RhdGVOb2RlID0gdGhpcy5nZXRTdGF0ZU5vZGUoc3ViU3RhdGVLZXlzWzBdKTtcblxuICAgIHZhciBuZXh0ID0gc3RhdGVOb2RlLl90cmFuc2l0aW9uKHN0YXRlVmFsdWVbc3ViU3RhdGVLZXlzWzBdXSwgc3RhdGUsIF9ldmVudCk7XG5cbiAgICBpZiAoIW5leHQgfHwgIW5leHQudHJhbnNpdGlvbnMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdGhpcy5uZXh0KHN0YXRlLCBfZXZlbnQpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXh0O1xuICB9O1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUudHJhbnNpdGlvblBhcmFsbGVsTm9kZSA9IGZ1bmN0aW9uIChzdGF0ZVZhbHVlLCBzdGF0ZSwgX2V2ZW50KSB7XG4gICAgdmFyIGVfMiwgX2E7XG5cbiAgICB2YXIgdHJhbnNpdGlvbk1hcCA9IHt9O1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIF9iID0gX192YWx1ZXMoT2JqZWN0LmtleXMoc3RhdGVWYWx1ZSkpLCBfYyA9IF9iLm5leHQoKTsgIV9jLmRvbmU7IF9jID0gX2IubmV4dCgpKSB7XG4gICAgICAgIHZhciBzdWJTdGF0ZUtleSA9IF9jLnZhbHVlO1xuICAgICAgICB2YXIgc3ViU3RhdGVWYWx1ZSA9IHN0YXRlVmFsdWVbc3ViU3RhdGVLZXldO1xuXG4gICAgICAgIGlmICghc3ViU3RhdGVWYWx1ZSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHN1YlN0YXRlTm9kZSA9IHRoaXMuZ2V0U3RhdGVOb2RlKHN1YlN0YXRlS2V5KTtcblxuICAgICAgICB2YXIgbmV4dCA9IHN1YlN0YXRlTm9kZS5fdHJhbnNpdGlvbihzdWJTdGF0ZVZhbHVlLCBzdGF0ZSwgX2V2ZW50KTtcblxuICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgIHRyYW5zaXRpb25NYXBbc3ViU3RhdGVLZXldID0gbmV4dDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfMl8xKSB7XG4gICAgICBlXzIgPSB7XG4gICAgICAgIGVycm9yOiBlXzJfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKF9jICYmICFfYy5kb25lICYmIChfYSA9IF9iLnJldHVybikpIF9hLmNhbGwoX2IpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfMikgdGhyb3cgZV8yLmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBzdGF0ZVRyYW5zaXRpb25zID0gT2JqZWN0LmtleXModHJhbnNpdGlvbk1hcCkubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHJldHVybiB0cmFuc2l0aW9uTWFwW2tleV07XG4gICAgfSk7XG4gICAgdmFyIGVuYWJsZWRUcmFuc2l0aW9ucyA9IGZsYXR0ZW4oc3RhdGVUcmFuc2l0aW9ucy5tYXAoZnVuY3Rpb24gKHN0KSB7XG4gICAgICByZXR1cm4gc3QudHJhbnNpdGlvbnM7XG4gICAgfSkpO1xuICAgIHZhciB3aWxsVHJhbnNpdGlvbiA9IHN0YXRlVHJhbnNpdGlvbnMuc29tZShmdW5jdGlvbiAoc3QpIHtcbiAgICAgIHJldHVybiBzdC50cmFuc2l0aW9ucy5sZW5ndGggPiAwO1xuICAgIH0pO1xuXG4gICAgaWYgKCF3aWxsVHJhbnNpdGlvbikge1xuICAgICAgcmV0dXJuIHRoaXMubmV4dChzdGF0ZSwgX2V2ZW50KTtcbiAgICB9XG5cbiAgICB2YXIgY29uZmlndXJhdGlvbiA9IGZsYXR0ZW4oT2JqZWN0LmtleXModHJhbnNpdGlvbk1hcCkubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHJldHVybiB0cmFuc2l0aW9uTWFwW2tleV0uY29uZmlndXJhdGlvbjtcbiAgICB9KSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRyYW5zaXRpb25zOiBlbmFibGVkVHJhbnNpdGlvbnMsXG4gICAgICBleGl0U2V0OiBmbGF0dGVuKHN0YXRlVHJhbnNpdGlvbnMubWFwKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHJldHVybiB0LmV4aXRTZXQ7XG4gICAgICB9KSksXG4gICAgICBjb25maWd1cmF0aW9uOiBjb25maWd1cmF0aW9uLFxuICAgICAgc291cmNlOiBzdGF0ZSxcbiAgICAgIGFjdGlvbnM6IGZsYXR0ZW4oT2JqZWN0LmtleXModHJhbnNpdGlvbk1hcCkubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRyYW5zaXRpb25NYXBba2V5XS5hY3Rpb25zO1xuICAgICAgfSkpXG4gICAgfTtcbiAgfTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLl90cmFuc2l0aW9uID0gZnVuY3Rpb24gKHN0YXRlVmFsdWUsIHN0YXRlLCBfZXZlbnQpIHtcbiAgICAvLyBsZWFmIG5vZGVcbiAgICBpZiAoaXNTdHJpbmcoc3RhdGVWYWx1ZSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnRyYW5zaXRpb25MZWFmTm9kZShzdGF0ZVZhbHVlLCBzdGF0ZSwgX2V2ZW50KTtcbiAgICB9IC8vIGhpZXJhcmNoaWNhbCBub2RlXG5cblxuICAgIGlmIChPYmplY3Qua2V5cyhzdGF0ZVZhbHVlKS5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiB0aGlzLnRyYW5zaXRpb25Db21wb3VuZE5vZGUoc3RhdGVWYWx1ZSwgc3RhdGUsIF9ldmVudCk7XG4gICAgfSAvLyBvcnRob2dvbmFsIG5vZGVcblxuXG4gICAgcmV0dXJuIHRoaXMudHJhbnNpdGlvblBhcmFsbGVsTm9kZShzdGF0ZVZhbHVlLCBzdGF0ZSwgX2V2ZW50KTtcbiAgfTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmdldFRyYW5zaXRpb25EYXRhID0gZnVuY3Rpb24gKHN0YXRlLCBldmVudCkge1xuICAgIHJldHVybiB0aGlzLl90cmFuc2l0aW9uKHN0YXRlLnZhbHVlLCBzdGF0ZSwgdG9TQ1hNTEV2ZW50KGV2ZW50KSk7XG4gIH07XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKHN0YXRlLCBfZXZlbnQpIHtcbiAgICB2YXIgZV8zLCBfYTtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgZXZlbnROYW1lID0gX2V2ZW50Lm5hbWU7XG4gICAgdmFyIGFjdGlvbnMgPSBbXTtcbiAgICB2YXIgbmV4dFN0YXRlTm9kZXMgPSBbXTtcbiAgICB2YXIgc2VsZWN0ZWRUcmFuc2l0aW9uO1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIF9iID0gX192YWx1ZXModGhpcy5nZXRDYW5kaWRhdGVzKGV2ZW50TmFtZSkpLCBfYyA9IF9iLm5leHQoKTsgIV9jLmRvbmU7IF9jID0gX2IubmV4dCgpKSB7XG4gICAgICAgIHZhciBjYW5kaWRhdGUgPSBfYy52YWx1ZTtcbiAgICAgICAgdmFyIGNvbmQgPSBjYW5kaWRhdGUuY29uZCxcbiAgICAgICAgICAgIHN0YXRlSW4gPSBjYW5kaWRhdGUuaW47XG4gICAgICAgIHZhciByZXNvbHZlZENvbnRleHQgPSBzdGF0ZS5jb250ZXh0O1xuICAgICAgICB2YXIgaXNJblN0YXRlID0gc3RhdGVJbiA/IGlzU3RyaW5nKHN0YXRlSW4pICYmIGlzU3RhdGVJZChzdGF0ZUluKSA/IC8vIENoZWNrIGlmIGluIHN0YXRlIGJ5IElEXG4gICAgICAgIHN0YXRlLm1hdGNoZXModG9TdGF0ZVZhbHVlKHRoaXMuZ2V0U3RhdGVOb2RlQnlJZChzdGF0ZUluKS5wYXRoLCB0aGlzLmRlbGltaXRlcikpIDogLy8gQ2hlY2sgaWYgaW4gc3RhdGUgYnkgcmVsYXRpdmUgZ3JhbmRwYXJlbnRcbiAgICAgICAgbWF0Y2hlc1N0YXRlKHRvU3RhdGVWYWx1ZShzdGF0ZUluLCB0aGlzLmRlbGltaXRlciksIHBhdGgodGhpcy5wYXRoLnNsaWNlKDAsIC0yKSkoc3RhdGUudmFsdWUpKSA6IHRydWU7XG4gICAgICAgIHZhciBndWFyZFBhc3NlZCA9IGZhbHNlO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZ3VhcmRQYXNzZWQgPSAhY29uZCB8fCBldmFsdWF0ZUd1YXJkKHRoaXMubWFjaGluZSwgY29uZCwgcmVzb2x2ZWRDb250ZXh0LCBfZXZlbnQsIHN0YXRlKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5hYmxlIHRvIGV2YWx1YXRlIGd1YXJkICdcIi5jb25jYXQoY29uZC5uYW1lIHx8IGNvbmQudHlwZSwgXCInIGluIHRyYW5zaXRpb24gZm9yIGV2ZW50ICdcIikuY29uY2F0KGV2ZW50TmFtZSwgXCInIGluIHN0YXRlIG5vZGUgJ1wiKS5jb25jYXQodGhpcy5pZCwgXCInOlxcblwiKS5jb25jYXQoZXJyLm1lc3NhZ2UpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChndWFyZFBhc3NlZCAmJiBpc0luU3RhdGUpIHtcbiAgICAgICAgICBpZiAoY2FuZGlkYXRlLnRhcmdldCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBuZXh0U3RhdGVOb2RlcyA9IGNhbmRpZGF0ZS50YXJnZXQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYWN0aW9ucy5wdXNoLmFwcGx5KGFjdGlvbnMsIF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChjYW5kaWRhdGUuYWN0aW9ucyksIGZhbHNlKSk7XG4gICAgICAgICAgc2VsZWN0ZWRUcmFuc2l0aW9uID0gY2FuZGlkYXRlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV8zXzEpIHtcbiAgICAgIGVfMyA9IHtcbiAgICAgICAgZXJyb3I6IGVfM18xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoX2MgJiYgIV9jLmRvbmUgJiYgKF9hID0gX2IucmV0dXJuKSkgX2EuY2FsbChfYik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV8zKSB0aHJvdyBlXzMuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFzZWxlY3RlZFRyYW5zaXRpb24pIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKCFuZXh0U3RhdGVOb2Rlcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRyYW5zaXRpb25zOiBbc2VsZWN0ZWRUcmFuc2l0aW9uXSxcbiAgICAgICAgZXhpdFNldDogW10sXG4gICAgICAgIGNvbmZpZ3VyYXRpb246IHN0YXRlLnZhbHVlID8gW3RoaXNdIDogW10sXG4gICAgICAgIHNvdXJjZTogc3RhdGUsXG4gICAgICAgIGFjdGlvbnM6IGFjdGlvbnNcbiAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIGFsbE5leHRTdGF0ZU5vZGVzID0gZmxhdHRlbihuZXh0U3RhdGVOb2Rlcy5tYXAoZnVuY3Rpb24gKHN0YXRlTm9kZSkge1xuICAgICAgcmV0dXJuIF90aGlzLmdldFJlbGF0aXZlU3RhdGVOb2RlcyhzdGF0ZU5vZGUsIHN0YXRlLmhpc3RvcnlWYWx1ZSk7XG4gICAgfSkpO1xuICAgIHZhciBpc0ludGVybmFsID0gISFzZWxlY3RlZFRyYW5zaXRpb24uaW50ZXJuYWw7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRyYW5zaXRpb25zOiBbc2VsZWN0ZWRUcmFuc2l0aW9uXSxcbiAgICAgIGV4aXRTZXQ6IGlzSW50ZXJuYWwgPyBbXSA6IGZsYXR0ZW4obmV4dFN0YXRlTm9kZXMubWFwKGZ1bmN0aW9uICh0YXJnZXROb2RlKSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5nZXRQb3RlbnRpYWxseVJlZW50ZXJpbmdOb2Rlcyh0YXJnZXROb2RlKTtcbiAgICAgIH0pKSxcbiAgICAgIGNvbmZpZ3VyYXRpb246IGFsbE5leHRTdGF0ZU5vZGVzLFxuICAgICAgc291cmNlOiBzdGF0ZSxcbiAgICAgIGFjdGlvbnM6IGFjdGlvbnNcbiAgICB9O1xuICB9OyAvLyBldmVuIHRob3VnaCB0aGUgbmFtZSBvZiB0aGlzIGZ1bmN0aW9uIG1lbnRpb25zIHJlZW50cnkgbm9kZXNcbiAgLy8gd2UgYXJlIHB1c2hpbmcgaXRzIHJlc3VsdCBpbnRvIGBleGl0U2V0YFxuICAvLyB0aGF0J3MgYmVjYXVzZSB3aGF0IHdlIGV4aXQgbWlnaHQgYmUgcmVlbnRlcmVkIChpdCdzIGFuIGludmFyaWFudCBvZiByZWVudHJhbmN5KVxuXG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5nZXRQb3RlbnRpYWxseVJlZW50ZXJpbmdOb2RlcyA9IGZ1bmN0aW9uICh0YXJnZXROb2RlKSB7XG4gICAgaWYgKHRoaXMub3JkZXIgPCB0YXJnZXROb2RlLm9yZGVyKSB7XG4gICAgICByZXR1cm4gW3RoaXNdO1xuICAgIH1cblxuICAgIHZhciBub2RlcyA9IFtdO1xuICAgIHZhciBtYXJrZXIgPSB0aGlzO1xuICAgIHZhciBwb3NzaWJsZUFuY2VzdG9yID0gdGFyZ2V0Tm9kZTtcblxuICAgIHdoaWxlIChtYXJrZXIgJiYgbWFya2VyICE9PSBwb3NzaWJsZUFuY2VzdG9yKSB7XG4gICAgICBub2Rlcy5wdXNoKG1hcmtlcik7XG4gICAgICBtYXJrZXIgPSBtYXJrZXIucGFyZW50O1xuICAgIH1cblxuICAgIGlmIChtYXJrZXIgIT09IHBvc3NpYmxlQW5jZXN0b3IpIHtcbiAgICAgIC8vIHdlIG5ldmVyIGdvdCB0byBgcG9zc2libGVBbmNlc3RvcmAsIHRoZXJlZm9yZSB0aGUgaW5pdGlhbCBgbWFya2VyYCBcImVzY2FwZXNcIiBpdFxuICAgICAgLy8gaXQncyBpbiBhIGRpZmZlcmVudCBwYXJ0IG9mIHRoZSB0cmVlIHNvIG5vIHN0YXRlcyB3aWxsIGJlIHJlZW50ZXJlZCBmb3Igc3VjaCBhbiBleHRlcm5hbCB0cmFuc2l0aW9uXG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgbm9kZXMucHVzaChwb3NzaWJsZUFuY2VzdG9yKTtcbiAgICByZXR1cm4gbm9kZXM7XG4gIH07XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5nZXRBY3Rpb25zID0gZnVuY3Rpb24gKHJlc29sdmVkQ29uZmlnLCBpc0RvbmUsIHRyYW5zaXRpb24sIGN1cnJlbnRDb250ZXh0LCBfZXZlbnQsIHByZXZTdGF0ZSwgcHJlZGljdGFibGVFeGVjKSB7XG4gICAgdmFyIGVfNCwgX2EsIGVfNSwgX2I7XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIHByZXZDb25maWcgPSBwcmV2U3RhdGUgPyBnZXRDb25maWd1cmF0aW9uKFtdLCB0aGlzLmdldFN0YXRlTm9kZXMocHJldlN0YXRlLnZhbHVlKSkgOiBbXTtcbiAgICB2YXIgZW50cnlTZXQgPSBuZXcgU2V0KCk7XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2MgPSBfX3ZhbHVlcyhBcnJheS5mcm9tKHJlc29sdmVkQ29uZmlnKS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIHJldHVybiBhLm9yZGVyIC0gYi5vcmRlcjtcbiAgICAgIH0pKSwgX2QgPSBfYy5uZXh0KCk7ICFfZC5kb25lOyBfZCA9IF9jLm5leHQoKSkge1xuICAgICAgICB2YXIgc24gPSBfZC52YWx1ZTtcblxuICAgICAgICBpZiAoIWhhcyhwcmV2Q29uZmlnLCBzbikgfHwgaGFzKHRyYW5zaXRpb24uZXhpdFNldCwgc24pIHx8IHNuLnBhcmVudCAmJiBlbnRyeVNldC5oYXMoc24ucGFyZW50KSkge1xuICAgICAgICAgIGVudHJ5U2V0LmFkZChzbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzRfMSkge1xuICAgICAgZV80ID0ge1xuICAgICAgICBlcnJvcjogZV80XzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfZCAmJiAhX2QuZG9uZSAmJiAoX2EgPSBfYy5yZXR1cm4pKSBfYS5jYWxsKF9jKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzQpIHRocm93IGVfNC5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgcHJldkNvbmZpZ18xID0gX192YWx1ZXMocHJldkNvbmZpZyksIHByZXZDb25maWdfMV8xID0gcHJldkNvbmZpZ18xLm5leHQoKTsgIXByZXZDb25maWdfMV8xLmRvbmU7IHByZXZDb25maWdfMV8xID0gcHJldkNvbmZpZ18xLm5leHQoKSkge1xuICAgICAgICB2YXIgc24gPSBwcmV2Q29uZmlnXzFfMS52YWx1ZTtcblxuICAgICAgICBpZiAoIWhhcyhyZXNvbHZlZENvbmZpZywgc24pIHx8IGhhcyh0cmFuc2l0aW9uLmV4aXRTZXQsIHNuLnBhcmVudCkpIHtcbiAgICAgICAgICB0cmFuc2l0aW9uLmV4aXRTZXQucHVzaChzbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzVfMSkge1xuICAgICAgZV81ID0ge1xuICAgICAgICBlcnJvcjogZV81XzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChwcmV2Q29uZmlnXzFfMSAmJiAhcHJldkNvbmZpZ18xXzEuZG9uZSAmJiAoX2IgPSBwcmV2Q29uZmlnXzEucmV0dXJuKSkgX2IuY2FsbChwcmV2Q29uZmlnXzEpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfNSkgdGhyb3cgZV81LmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRyYW5zaXRpb24uZXhpdFNldC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICByZXR1cm4gYi5vcmRlciAtIGEub3JkZXI7XG4gICAgfSk7XG4gICAgdmFyIGVudHJ5U3RhdGVzID0gQXJyYXkuZnJvbShlbnRyeVNldCkuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIGEub3JkZXIgLSBiLm9yZGVyO1xuICAgIH0pO1xuICAgIHZhciBleGl0U3RhdGVzID0gbmV3IFNldCh0cmFuc2l0aW9uLmV4aXRTZXQpO1xuICAgIHZhciBkb25lRXZlbnRzID0gZmxhdHRlbihlbnRyeVN0YXRlcy5tYXAoZnVuY3Rpb24gKHNuKSB7XG4gICAgICB2YXIgZXZlbnRzID0gW107XG5cbiAgICAgIGlmIChzbi50eXBlICE9PSAnZmluYWwnKSB7XG4gICAgICAgIHJldHVybiBldmVudHM7XG4gICAgICB9XG5cbiAgICAgIHZhciBwYXJlbnQgPSBzbi5wYXJlbnQ7XG5cbiAgICAgIGlmICghcGFyZW50LnBhcmVudCkge1xuICAgICAgICByZXR1cm4gZXZlbnRzO1xuICAgICAgfVxuXG4gICAgICBldmVudHMucHVzaChkb25lKHNuLmlkLCBzbi5kb25lRGF0YSksIC8vIFRPRE86IGRlcHJlY2F0ZSAtIGZpbmFsIHN0YXRlcyBzaG91bGQgbm90IGVtaXQgZG9uZSBldmVudHMgZm9yIHRoZWlyIG93biBzdGF0ZS5cbiAgICAgIGRvbmUocGFyZW50LmlkLCBzbi5kb25lRGF0YSA/IG1hcENvbnRleHQoc24uZG9uZURhdGEsIGN1cnJlbnRDb250ZXh0LCBfZXZlbnQpIDogdW5kZWZpbmVkKSk7XG4gICAgICB2YXIgZ3JhbmRwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuXG4gICAgICBpZiAoZ3JhbmRwYXJlbnQudHlwZSA9PT0gJ3BhcmFsbGVsJykge1xuICAgICAgICBpZiAoZ2V0Q2hpbGRyZW4oZ3JhbmRwYXJlbnQpLmV2ZXJ5KGZ1bmN0aW9uIChwYXJlbnROb2RlKSB7XG4gICAgICAgICAgcmV0dXJuIGlzSW5GaW5hbFN0YXRlKHRyYW5zaXRpb24uY29uZmlndXJhdGlvbiwgcGFyZW50Tm9kZSk7XG4gICAgICAgIH0pKSB7XG4gICAgICAgICAgZXZlbnRzLnB1c2goZG9uZShncmFuZHBhcmVudC5pZCkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBldmVudHM7XG4gICAgfSkpO1xuICAgIHZhciBlbnRyeUFjdGlvbnMgPSBlbnRyeVN0YXRlcy5tYXAoZnVuY3Rpb24gKHN0YXRlTm9kZSkge1xuICAgICAgdmFyIGVudHJ5QWN0aW9ucyA9IHN0YXRlTm9kZS5vbkVudHJ5O1xuICAgICAgdmFyIGludm9rZUFjdGlvbnMgPSBzdGF0ZU5vZGUuYWN0aXZpdGllcy5tYXAoZnVuY3Rpb24gKGFjdGl2aXR5KSB7XG4gICAgICAgIHJldHVybiBzdGFydChhY3Rpdml0eSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6ICdlbnRyeScsXG4gICAgICAgIGFjdGlvbnM6IHRvQWN0aW9uT2JqZWN0cyhwcmVkaWN0YWJsZUV4ZWMgPyBfX3NwcmVhZEFycmF5KF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChlbnRyeUFjdGlvbnMpLCBmYWxzZSksIF9fcmVhZChpbnZva2VBY3Rpb25zKSwgZmFsc2UpIDogX19zcHJlYWRBcnJheShfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQoaW52b2tlQWN0aW9ucyksIGZhbHNlKSwgX19yZWFkKGVudHJ5QWN0aW9ucyksIGZhbHNlKSwgX3RoaXMubWFjaGluZS5vcHRpb25zLmFjdGlvbnMpXG4gICAgICB9O1xuICAgIH0pLmNvbmNhdCh7XG4gICAgICB0eXBlOiAnc3RhdGVfZG9uZScsXG4gICAgICBhY3Rpb25zOiBkb25lRXZlbnRzLm1hcChmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgcmV0dXJuIHJhaXNlKGV2ZW50KTtcbiAgICAgIH0pXG4gICAgfSk7XG4gICAgdmFyIGV4aXRBY3Rpb25zID0gQXJyYXkuZnJvbShleGl0U3RhdGVzKS5tYXAoZnVuY3Rpb24gKHN0YXRlTm9kZSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogJ2V4aXQnLFxuICAgICAgICBhY3Rpb25zOiB0b0FjdGlvbk9iamVjdHMoX19zcHJlYWRBcnJheShfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQoc3RhdGVOb2RlLm9uRXhpdCksIGZhbHNlKSwgX19yZWFkKHN0YXRlTm9kZS5hY3Rpdml0aWVzLm1hcChmdW5jdGlvbiAoYWN0aXZpdHkpIHtcbiAgICAgICAgICByZXR1cm4gc3RvcChhY3Rpdml0eSk7XG4gICAgICAgIH0pKSwgZmFsc2UpLCBfdGhpcy5tYWNoaW5lLm9wdGlvbnMuYWN0aW9ucylcbiAgICAgIH07XG4gICAgfSk7XG4gICAgdmFyIGFjdGlvbnMgPSBleGl0QWN0aW9ucy5jb25jYXQoe1xuICAgICAgdHlwZTogJ3RyYW5zaXRpb24nLFxuICAgICAgYWN0aW9uczogdG9BY3Rpb25PYmplY3RzKHRyYW5zaXRpb24uYWN0aW9ucywgdGhpcy5tYWNoaW5lLm9wdGlvbnMuYWN0aW9ucylcbiAgICB9KS5jb25jYXQoZW50cnlBY3Rpb25zKTtcblxuICAgIGlmIChpc0RvbmUpIHtcbiAgICAgIHZhciBzdG9wQWN0aW9ucyA9IHRvQWN0aW9uT2JqZWN0cyhmbGF0dGVuKF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChyZXNvbHZlZENvbmZpZyksIGZhbHNlKS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIHJldHVybiBiLm9yZGVyIC0gYS5vcmRlcjtcbiAgICAgIH0pLm1hcChmdW5jdGlvbiAoc3RhdGVOb2RlKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZU5vZGUub25FeGl0O1xuICAgICAgfSkpLCB0aGlzLm1hY2hpbmUub3B0aW9ucy5hY3Rpb25zKS5maWx0ZXIoZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgICByZXR1cm4gIWlzUmFpc2FibGVBY3Rpb24oYWN0aW9uKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGFjdGlvbnMuY29uY2F0KHtcbiAgICAgICAgdHlwZTogJ3N0b3AnLFxuICAgICAgICBhY3Rpb25zOiBzdG9wQWN0aW9uc1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFjdGlvbnM7XG4gIH07XG4gIC8qKlxyXG4gICAqIERldGVybWluZXMgdGhlIG5leHQgc3RhdGUgZ2l2ZW4gdGhlIGN1cnJlbnQgYHN0YXRlYCBhbmQgc2VudCBgZXZlbnRgLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHN0YXRlIFRoZSBjdXJyZW50IFN0YXRlIGluc3RhbmNlIG9yIHN0YXRlIHZhbHVlXHJcbiAgICogQHBhcmFtIGV2ZW50IFRoZSBldmVudCB0aGF0IHdhcyBzZW50IGF0IHRoZSBjdXJyZW50IHN0YXRlXHJcbiAgICogQHBhcmFtIGNvbnRleHQgVGhlIGN1cnJlbnQgY29udGV4dCAoZXh0ZW5kZWQgc3RhdGUpIG9mIHRoZSBjdXJyZW50IHN0YXRlXHJcbiAgICovXG5cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLnRyYW5zaXRpb24gPSBmdW5jdGlvbiAoc3RhdGUsIGV2ZW50LCBjb250ZXh0LCBleGVjKSB7XG4gICAgaWYgKHN0YXRlID09PSB2b2lkIDApIHtcbiAgICAgIHN0YXRlID0gdGhpcy5pbml0aWFsU3RhdGU7XG4gICAgfVxuXG4gICAgdmFyIF9ldmVudCA9IHRvU0NYTUxFdmVudChldmVudCk7XG5cbiAgICB2YXIgY3VycmVudFN0YXRlO1xuXG4gICAgaWYgKHN0YXRlIGluc3RhbmNlb2YgU3RhdGUpIHtcbiAgICAgIGN1cnJlbnRTdGF0ZSA9IGNvbnRleHQgPT09IHVuZGVmaW5lZCA/IHN0YXRlIDogdGhpcy5yZXNvbHZlU3RhdGUoU3RhdGUuZnJvbShzdGF0ZSwgY29udGV4dCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcmVzb2x2ZWRTdGF0ZVZhbHVlID0gaXNTdHJpbmcoc3RhdGUpID8gdGhpcy5yZXNvbHZlKHBhdGhUb1N0YXRlVmFsdWUodGhpcy5nZXRSZXNvbHZlZFBhdGgoc3RhdGUpKSkgOiB0aGlzLnJlc29sdmUoc3RhdGUpO1xuICAgICAgdmFyIHJlc29sdmVkQ29udGV4dCA9IGNvbnRleHQgIT09IG51bGwgJiYgY29udGV4dCAhPT0gdm9pZCAwID8gY29udGV4dCA6IHRoaXMubWFjaGluZS5jb250ZXh0O1xuICAgICAgY3VycmVudFN0YXRlID0gdGhpcy5yZXNvbHZlU3RhdGUoU3RhdGUuZnJvbShyZXNvbHZlZFN0YXRlVmFsdWUsIHJlc29sdmVkQ29udGV4dCkpO1xuICAgIH1cblxuICAgIGlmICghSVNfUFJPRFVDVElPTiAmJiBfZXZlbnQubmFtZSA9PT0gV0lMRENBUkQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkFuIGV2ZW50IGNhbm5vdCBoYXZlIHRoZSB3aWxkY2FyZCB0eXBlICgnXCIuY29uY2F0KFdJTERDQVJELCBcIicpXCIpKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zdHJpY3QpIHtcbiAgICAgIGlmICghdGhpcy5ldmVudHMuaW5jbHVkZXMoX2V2ZW50Lm5hbWUpICYmICFpc0J1aWx0SW5FdmVudChfZXZlbnQubmFtZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWFjaGluZSAnXCIuY29uY2F0KHRoaXMuaWQsIFwiJyBkb2VzIG5vdCBhY2NlcHQgZXZlbnQgJ1wiKS5jb25jYXQoX2V2ZW50Lm5hbWUsIFwiJ1wiKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHN0YXRlVHJhbnNpdGlvbiA9IHRoaXMuX3RyYW5zaXRpb24oY3VycmVudFN0YXRlLnZhbHVlLCBjdXJyZW50U3RhdGUsIF9ldmVudCkgfHwge1xuICAgICAgdHJhbnNpdGlvbnM6IFtdLFxuICAgICAgY29uZmlndXJhdGlvbjogW10sXG4gICAgICBleGl0U2V0OiBbXSxcbiAgICAgIHNvdXJjZTogY3VycmVudFN0YXRlLFxuICAgICAgYWN0aW9uczogW11cbiAgICB9O1xuICAgIHZhciBwcmV2Q29uZmlnID0gZ2V0Q29uZmlndXJhdGlvbihbXSwgdGhpcy5nZXRTdGF0ZU5vZGVzKGN1cnJlbnRTdGF0ZS52YWx1ZSkpO1xuICAgIHZhciByZXNvbHZlZENvbmZpZyA9IHN0YXRlVHJhbnNpdGlvbi5jb25maWd1cmF0aW9uLmxlbmd0aCA/IGdldENvbmZpZ3VyYXRpb24ocHJldkNvbmZpZywgc3RhdGVUcmFuc2l0aW9uLmNvbmZpZ3VyYXRpb24pIDogcHJldkNvbmZpZztcbiAgICBzdGF0ZVRyYW5zaXRpb24uY29uZmlndXJhdGlvbiA9IF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChyZXNvbHZlZENvbmZpZyksIGZhbHNlKTtcbiAgICByZXR1cm4gdGhpcy5yZXNvbHZlVHJhbnNpdGlvbihzdGF0ZVRyYW5zaXRpb24sIGN1cnJlbnRTdGF0ZSwgY3VycmVudFN0YXRlLmNvbnRleHQsIGV4ZWMsIF9ldmVudCk7XG4gIH07XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5yZXNvbHZlUmFpc2VkVHJhbnNpdGlvbiA9IGZ1bmN0aW9uIChzdGF0ZSwgX2V2ZW50LCBvcmlnaW5hbEV2ZW50LCBwcmVkaWN0YWJsZUV4ZWMpIHtcbiAgICB2YXIgX2E7XG5cbiAgICB2YXIgY3VycmVudEFjdGlvbnMgPSBzdGF0ZS5hY3Rpb25zO1xuICAgIHN0YXRlID0gdGhpcy50cmFuc2l0aW9uKHN0YXRlLCBfZXZlbnQsIHVuZGVmaW5lZCwgcHJlZGljdGFibGVFeGVjKTsgLy8gU2F2ZSBvcmlnaW5hbCBldmVudCB0byBzdGF0ZVxuICAgIC8vIFRPRE86IHRoaXMgc2hvdWxkIGJlIHRoZSByYWlzZWQgZXZlbnQhIERlbGV0ZSBpbiBWNSAoYnJlYWtpbmcpXG5cbiAgICBzdGF0ZS5fZXZlbnQgPSBvcmlnaW5hbEV2ZW50O1xuICAgIHN0YXRlLmV2ZW50ID0gb3JpZ2luYWxFdmVudC5kYXRhO1xuXG4gICAgKF9hID0gc3RhdGUuYWN0aW9ucykudW5zaGlmdC5hcHBseShfYSwgX19zcHJlYWRBcnJheShbXSwgX19yZWFkKGN1cnJlbnRBY3Rpb25zKSwgZmFsc2UpKTtcblxuICAgIHJldHVybiBzdGF0ZTtcbiAgfTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLnJlc29sdmVUcmFuc2l0aW9uID0gZnVuY3Rpb24gKHN0YXRlVHJhbnNpdGlvbiwgY3VycmVudFN0YXRlLCBjb250ZXh0LCBwcmVkaWN0YWJsZUV4ZWMsIF9ldmVudCkge1xuICAgIHZhciBlXzYsIF9hLCBlXzcsIF9iO1xuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGlmIChfZXZlbnQgPT09IHZvaWQgMCkge1xuICAgICAgX2V2ZW50ID0gaW5pdEV2ZW50O1xuICAgIH1cblxuICAgIHZhciBjb25maWd1cmF0aW9uID0gc3RhdGVUcmFuc2l0aW9uLmNvbmZpZ3VyYXRpb247IC8vIFRyYW5zaXRpb24gd2lsbCBcImFwcGx5XCIgaWY6XG4gICAgLy8gLSB0aGlzIGlzIHRoZSBpbml0aWFsIHN0YXRlICh0aGVyZSBpcyBubyBjdXJyZW50IHN0YXRlKVxuICAgIC8vIC0gT1IgdGhlcmUgYXJlIHRyYW5zaXRpb25zXG5cbiAgICB2YXIgd2lsbFRyYW5zaXRpb24gPSAhY3VycmVudFN0YXRlIHx8IHN0YXRlVHJhbnNpdGlvbi50cmFuc2l0aW9ucy5sZW5ndGggPiAwO1xuICAgIHZhciByZXNvbHZlZENvbmZpZ3VyYXRpb24gPSB3aWxsVHJhbnNpdGlvbiA/IHN0YXRlVHJhbnNpdGlvbi5jb25maWd1cmF0aW9uIDogY3VycmVudFN0YXRlID8gY3VycmVudFN0YXRlLmNvbmZpZ3VyYXRpb24gOiBbXTtcbiAgICB2YXIgaXNEb25lID0gaXNJbkZpbmFsU3RhdGUocmVzb2x2ZWRDb25maWd1cmF0aW9uLCB0aGlzKTtcbiAgICB2YXIgcmVzb2x2ZWRTdGF0ZVZhbHVlID0gd2lsbFRyYW5zaXRpb24gPyBnZXRWYWx1ZSh0aGlzLm1hY2hpbmUsIGNvbmZpZ3VyYXRpb24pIDogdW5kZWZpbmVkO1xuICAgIHZhciBoaXN0b3J5VmFsdWUgPSBjdXJyZW50U3RhdGUgPyBjdXJyZW50U3RhdGUuaGlzdG9yeVZhbHVlID8gY3VycmVudFN0YXRlLmhpc3RvcnlWYWx1ZSA6IHN0YXRlVHJhbnNpdGlvbi5zb3VyY2UgPyB0aGlzLm1hY2hpbmUuaGlzdG9yeVZhbHVlKGN1cnJlbnRTdGF0ZS52YWx1ZSkgOiB1bmRlZmluZWQgOiB1bmRlZmluZWQ7XG4gICAgdmFyIGFjdGlvbkJsb2NrcyA9IHRoaXMuZ2V0QWN0aW9ucyhuZXcgU2V0KHJlc29sdmVkQ29uZmlndXJhdGlvbiksIGlzRG9uZSwgc3RhdGVUcmFuc2l0aW9uLCBjb250ZXh0LCBfZXZlbnQsIGN1cnJlbnRTdGF0ZSwgcHJlZGljdGFibGVFeGVjKTtcbiAgICB2YXIgYWN0aXZpdGllcyA9IGN1cnJlbnRTdGF0ZSA/IF9fYXNzaWduKHt9LCBjdXJyZW50U3RhdGUuYWN0aXZpdGllcykgOiB7fTtcblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBhY3Rpb25CbG9ja3NfMSA9IF9fdmFsdWVzKGFjdGlvbkJsb2NrcyksIGFjdGlvbkJsb2Nrc18xXzEgPSBhY3Rpb25CbG9ja3NfMS5uZXh0KCk7ICFhY3Rpb25CbG9ja3NfMV8xLmRvbmU7IGFjdGlvbkJsb2Nrc18xXzEgPSBhY3Rpb25CbG9ja3NfMS5uZXh0KCkpIHtcbiAgICAgICAgdmFyIGJsb2NrID0gYWN0aW9uQmxvY2tzXzFfMS52YWx1ZTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGZvciAodmFyIF9jID0gKGVfNyA9IHZvaWQgMCwgX192YWx1ZXMoYmxvY2suYWN0aW9ucykpLCBfZCA9IF9jLm5leHQoKTsgIV9kLmRvbmU7IF9kID0gX2MubmV4dCgpKSB7XG4gICAgICAgICAgICB2YXIgYWN0aW9uID0gX2QudmFsdWU7XG5cbiAgICAgICAgICAgIGlmIChhY3Rpb24udHlwZSA9PT0gc3RhcnQkMSkge1xuICAgICAgICAgICAgICBhY3Rpdml0aWVzW2FjdGlvbi5hY3Rpdml0eS5pZCB8fCBhY3Rpb24uYWN0aXZpdHkudHlwZV0gPSBhY3Rpb247XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFjdGlvbi50eXBlID09PSBzdG9wJDEpIHtcbiAgICAgICAgICAgICAgYWN0aXZpdGllc1thY3Rpb24uYWN0aXZpdHkuaWQgfHwgYWN0aW9uLmFjdGl2aXR5LnR5cGVdID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlXzdfMSkge1xuICAgICAgICAgIGVfNyA9IHtcbiAgICAgICAgICAgIGVycm9yOiBlXzdfMVxuICAgICAgICAgIH07XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChfZCAmJiAhX2QuZG9uZSAmJiAoX2IgPSBfYy5yZXR1cm4pKSBfYi5jYWxsKF9jKTtcbiAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgaWYgKGVfNykgdGhyb3cgZV83LmVycm9yO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfNl8xKSB7XG4gICAgICBlXzYgPSB7XG4gICAgICAgIGVycm9yOiBlXzZfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKGFjdGlvbkJsb2Nrc18xXzEgJiYgIWFjdGlvbkJsb2Nrc18xXzEuZG9uZSAmJiAoX2EgPSBhY3Rpb25CbG9ja3NfMS5yZXR1cm4pKSBfYS5jYWxsKGFjdGlvbkJsb2Nrc18xKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzYpIHRocm93IGVfNi5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgX2UgPSBfX3JlYWQocmVzb2x2ZUFjdGlvbnModGhpcywgY3VycmVudFN0YXRlLCBjb250ZXh0LCBfZXZlbnQsIGFjdGlvbkJsb2NrcywgcHJlZGljdGFibGVFeGVjLCB0aGlzLm1hY2hpbmUuY29uZmlnLnByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzIHx8IHRoaXMubWFjaGluZS5jb25maWcucHJlc2VydmVBY3Rpb25PcmRlciksIDIpLFxuICAgICAgICByZXNvbHZlZEFjdGlvbnMgPSBfZVswXSxcbiAgICAgICAgdXBkYXRlZENvbnRleHQgPSBfZVsxXTtcblxuICAgIHZhciBfZiA9IF9fcmVhZChwYXJ0aXRpb24ocmVzb2x2ZWRBY3Rpb25zLCBpc1JhaXNhYmxlQWN0aW9uKSwgMiksXG4gICAgICAgIHJhaXNlZEV2ZW50cyA9IF9mWzBdLFxuICAgICAgICBub25SYWlzZWRBY3Rpb25zID0gX2ZbMV07XG5cbiAgICB2YXIgaW52b2tlQWN0aW9ucyA9IHJlc29sdmVkQWN0aW9ucy5maWx0ZXIoZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgdmFyIF9hO1xuXG4gICAgICByZXR1cm4gYWN0aW9uLnR5cGUgPT09IHN0YXJ0JDEgJiYgKChfYSA9IGFjdGlvbi5hY3Rpdml0eSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnR5cGUpID09PSBpbnZva2U7XG4gICAgfSk7XG4gICAgdmFyIGNoaWxkcmVuID0gaW52b2tlQWN0aW9ucy5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgYWN0aW9uKSB7XG4gICAgICBhY2NbYWN0aW9uLmFjdGl2aXR5LmlkXSA9IGNyZWF0ZUludm9jYWJsZUFjdG9yKGFjdGlvbi5hY3Rpdml0eSwgX3RoaXMubWFjaGluZSwgdXBkYXRlZENvbnRleHQsIF9ldmVudCk7XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIGN1cnJlbnRTdGF0ZSA/IF9fYXNzaWduKHt9LCBjdXJyZW50U3RhdGUuY2hpbGRyZW4pIDoge30pO1xuICAgIHZhciBuZXh0U3RhdGUgPSBuZXcgU3RhdGUoe1xuICAgICAgdmFsdWU6IHJlc29sdmVkU3RhdGVWYWx1ZSB8fCBjdXJyZW50U3RhdGUudmFsdWUsXG4gICAgICBjb250ZXh0OiB1cGRhdGVkQ29udGV4dCxcbiAgICAgIF9ldmVudDogX2V2ZW50LFxuICAgICAgLy8gUGVyc2lzdCBfc2Vzc2lvbmlkIGJldHdlZW4gc3RhdGVzXG4gICAgICBfc2Vzc2lvbmlkOiBjdXJyZW50U3RhdGUgPyBjdXJyZW50U3RhdGUuX3Nlc3Npb25pZCA6IG51bGwsXG4gICAgICBoaXN0b3J5VmFsdWU6IHJlc29sdmVkU3RhdGVWYWx1ZSA/IGhpc3RvcnlWYWx1ZSA/IHVwZGF0ZUhpc3RvcnlWYWx1ZShoaXN0b3J5VmFsdWUsIHJlc29sdmVkU3RhdGVWYWx1ZSkgOiB1bmRlZmluZWQgOiBjdXJyZW50U3RhdGUgPyBjdXJyZW50U3RhdGUuaGlzdG9yeVZhbHVlIDogdW5kZWZpbmVkLFxuICAgICAgaGlzdG9yeTogIXJlc29sdmVkU3RhdGVWYWx1ZSB8fCBzdGF0ZVRyYW5zaXRpb24uc291cmNlID8gY3VycmVudFN0YXRlIDogdW5kZWZpbmVkLFxuICAgICAgYWN0aW9uczogcmVzb2x2ZWRTdGF0ZVZhbHVlID8gbm9uUmFpc2VkQWN0aW9ucyA6IFtdLFxuICAgICAgYWN0aXZpdGllczogcmVzb2x2ZWRTdGF0ZVZhbHVlID8gYWN0aXZpdGllcyA6IGN1cnJlbnRTdGF0ZSA/IGN1cnJlbnRTdGF0ZS5hY3Rpdml0aWVzIDoge30sXG4gICAgICBldmVudHM6IFtdLFxuICAgICAgY29uZmlndXJhdGlvbjogcmVzb2x2ZWRDb25maWd1cmF0aW9uLFxuICAgICAgdHJhbnNpdGlvbnM6IHN0YXRlVHJhbnNpdGlvbi50cmFuc2l0aW9ucyxcbiAgICAgIGNoaWxkcmVuOiBjaGlsZHJlbixcbiAgICAgIGRvbmU6IGlzRG9uZSxcbiAgICAgIHRhZ3M6IGdldFRhZ3NGcm9tQ29uZmlndXJhdGlvbihyZXNvbHZlZENvbmZpZ3VyYXRpb24pLFxuICAgICAgbWFjaGluZTogdGhpc1xuICAgIH0pO1xuICAgIHZhciBkaWRVcGRhdGVDb250ZXh0ID0gY29udGV4dCAhPT0gdXBkYXRlZENvbnRleHQ7XG4gICAgbmV4dFN0YXRlLmNoYW5nZWQgPSBfZXZlbnQubmFtZSA9PT0gdXBkYXRlIHx8IGRpZFVwZGF0ZUNvbnRleHQ7IC8vIERpc3Bvc2Ugb2YgcGVudWx0aW1hdGUgaGlzdG9yaWVzIHRvIHByZXZlbnQgbWVtb3J5IGxlYWtzXG5cbiAgICB2YXIgaGlzdG9yeSA9IG5leHRTdGF0ZS5oaXN0b3J5O1xuXG4gICAgaWYgKGhpc3RvcnkpIHtcbiAgICAgIGRlbGV0ZSBoaXN0b3J5Lmhpc3Rvcnk7XG4gICAgfSAvLyBUaGVyZSBhcmUgdHJhbnNpZW50IHRyYW5zaXRpb25zIGlmIHRoZSBtYWNoaW5lIGlzIG5vdCBpbiBhIGZpbmFsIHN0YXRlXG4gICAgLy8gYW5kIGlmIHNvbWUgb2YgdGhlIHN0YXRlIG5vZGVzIGhhdmUgdHJhbnNpZW50IChcImFsd2F5c1wiKSB0cmFuc2l0aW9ucy5cblxuXG4gICAgdmFyIGhhc0Fsd2F5c1RyYW5zaXRpb25zID0gIWlzRG9uZSAmJiAodGhpcy5fdHJhbnNpZW50IHx8IGNvbmZpZ3VyYXRpb24uc29tZShmdW5jdGlvbiAoc3RhdGVOb2RlKSB7XG4gICAgICByZXR1cm4gc3RhdGVOb2RlLl90cmFuc2llbnQ7XG4gICAgfSkpOyAvLyBJZiB0aGVyZSBhcmUgbm8gZW5hYmxlZCB0cmFuc2l0aW9ucywgY2hlY2sgaWYgdGhlcmUgYXJlIHRyYW5zaWVudCB0cmFuc2l0aW9ucy5cbiAgICAvLyBJZiB0aGVyZSBhcmUgdHJhbnNpZW50IHRyYW5zaXRpb25zLCBjb250aW51ZSBjaGVja2luZyBmb3IgbW9yZSB0cmFuc2l0aW9uc1xuICAgIC8vIGJlY2F1c2UgYW4gdHJhbnNpZW50IHRyYW5zaXRpb24gc2hvdWxkIGJlIHRyaWdnZXJlZCBldmVuIGlmIHRoZXJlIGFyZSBub1xuICAgIC8vIGVuYWJsZWQgdHJhbnNpdGlvbnMuXG4gICAgLy9cbiAgICAvLyBJZiB3ZSdyZSBhbHJlYWR5IHdvcmtpbmcgb24gYW4gdHJhbnNpZW50IHRyYW5zaXRpb24gdGhlbiBzdG9wIHRvIHByZXZlbnQgYW4gaW5maW5pdGUgbG9vcC5cbiAgICAvL1xuICAgIC8vIE90aGVyd2lzZSwgaWYgdGhlcmUgYXJlIG5vIGVuYWJsZWQgbm9yIHRyYW5zaWVudCB0cmFuc2l0aW9ucywgd2UgYXJlIGRvbmUuXG5cbiAgICBpZiAoIXdpbGxUcmFuc2l0aW9uICYmICghaGFzQWx3YXlzVHJhbnNpdGlvbnMgfHwgX2V2ZW50Lm5hbWUgPT09IE5VTExfRVZFTlQpKSB7XG4gICAgICByZXR1cm4gbmV4dFN0YXRlO1xuICAgIH1cblxuICAgIHZhciBtYXliZU5leHRTdGF0ZSA9IG5leHRTdGF0ZTtcblxuICAgIGlmICghaXNEb25lKSB7XG4gICAgICBpZiAoaGFzQWx3YXlzVHJhbnNpdGlvbnMpIHtcbiAgICAgICAgbWF5YmVOZXh0U3RhdGUgPSB0aGlzLnJlc29sdmVSYWlzZWRUcmFuc2l0aW9uKG1heWJlTmV4dFN0YXRlLCB7XG4gICAgICAgICAgdHlwZTogbnVsbEV2ZW50XG4gICAgICAgIH0sIF9ldmVudCwgcHJlZGljdGFibGVFeGVjKTtcbiAgICAgIH1cblxuICAgICAgd2hpbGUgKHJhaXNlZEV2ZW50cy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIHJhaXNlZEV2ZW50ID0gcmFpc2VkRXZlbnRzLnNoaWZ0KCk7XG4gICAgICAgIG1heWJlTmV4dFN0YXRlID0gdGhpcy5yZXNvbHZlUmFpc2VkVHJhbnNpdGlvbihtYXliZU5leHRTdGF0ZSwgcmFpc2VkRXZlbnQuX2V2ZW50LCBfZXZlbnQsIHByZWRpY3RhYmxlRXhlYyk7XG4gICAgICB9XG4gICAgfSAvLyBEZXRlY3QgaWYgc3RhdGUgY2hhbmdlZFxuXG5cbiAgICB2YXIgY2hhbmdlZCA9IG1heWJlTmV4dFN0YXRlLmNoYW5nZWQgfHwgKGhpc3RvcnkgPyAhIW1heWJlTmV4dFN0YXRlLmFjdGlvbnMubGVuZ3RoIHx8IGRpZFVwZGF0ZUNvbnRleHQgfHwgdHlwZW9mIGhpc3RvcnkudmFsdWUgIT09IHR5cGVvZiBtYXliZU5leHRTdGF0ZS52YWx1ZSB8fCAhc3RhdGVWYWx1ZXNFcXVhbChtYXliZU5leHRTdGF0ZS52YWx1ZSwgaGlzdG9yeS52YWx1ZSkgOiB1bmRlZmluZWQpO1xuICAgIG1heWJlTmV4dFN0YXRlLmNoYW5nZWQgPSBjaGFuZ2VkOyAvLyBQcmVzZXJ2ZSBvcmlnaW5hbCBoaXN0b3J5IGFmdGVyIHJhaXNlZCBldmVudHNcblxuICAgIG1heWJlTmV4dFN0YXRlLmhpc3RvcnkgPSBoaXN0b3J5O1xuICAgIHJldHVybiBtYXliZU5leHRTdGF0ZTtcbiAgfTtcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgY2hpbGQgc3RhdGUgbm9kZSBmcm9tIGl0cyByZWxhdGl2ZSBgc3RhdGVLZXlgLCBvciB0aHJvd3MuXHJcbiAgICovXG5cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmdldFN0YXRlTm9kZSA9IGZ1bmN0aW9uIChzdGF0ZUtleSkge1xuICAgIGlmIChpc1N0YXRlSWQoc3RhdGVLZXkpKSB7XG4gICAgICByZXR1cm4gdGhpcy5tYWNoaW5lLmdldFN0YXRlTm9kZUJ5SWQoc3RhdGVLZXkpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5zdGF0ZXMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuYWJsZSB0byByZXRyaWV2ZSBjaGlsZCBzdGF0ZSAnXCIuY29uY2F0KHN0YXRlS2V5LCBcIicgZnJvbSAnXCIpLmNvbmNhdCh0aGlzLmlkLCBcIic7IG5vIGNoaWxkIHN0YXRlcyBleGlzdC5cIikpO1xuICAgIH1cblxuICAgIHZhciByZXN1bHQgPSB0aGlzLnN0YXRlc1tzdGF0ZUtleV07XG5cbiAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2hpbGQgc3RhdGUgJ1wiLmNvbmNhdChzdGF0ZUtleSwgXCInIGRvZXMgbm90IGV4aXN0IG9uICdcIikuY29uY2F0KHRoaXMuaWQsIFwiJ1wiKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgc3RhdGUgbm9kZSB3aXRoIHRoZSBnaXZlbiBgc3RhdGVJZGAsIG9yIHRocm93cy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBzdGF0ZUlkIFRoZSBzdGF0ZSBJRC4gVGhlIHByZWZpeCBcIiNcIiBpcyByZW1vdmVkLlxyXG4gICAqL1xuXG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5nZXRTdGF0ZU5vZGVCeUlkID0gZnVuY3Rpb24gKHN0YXRlSWQpIHtcbiAgICB2YXIgcmVzb2x2ZWRTdGF0ZUlkID0gaXNTdGF0ZUlkKHN0YXRlSWQpID8gc3RhdGVJZC5zbGljZShTVEFURV9JREVOVElGSUVSLmxlbmd0aCkgOiBzdGF0ZUlkO1xuXG4gICAgaWYgKHJlc29sdmVkU3RhdGVJZCA9PT0gdGhpcy5pZCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdmFyIHN0YXRlTm9kZSA9IHRoaXMubWFjaGluZS5pZE1hcFtyZXNvbHZlZFN0YXRlSWRdO1xuXG4gICAgaWYgKCFzdGF0ZU5vZGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNoaWxkIHN0YXRlIG5vZGUgJyNcIi5jb25jYXQocmVzb2x2ZWRTdGF0ZUlkLCBcIicgZG9lcyBub3QgZXhpc3Qgb24gbWFjaGluZSAnXCIpLmNvbmNhdCh0aGlzLmlkLCBcIidcIikpO1xuICAgIH1cblxuICAgIHJldHVybiBzdGF0ZU5vZGU7XG4gIH07XG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIHJlbGF0aXZlIHN0YXRlIG5vZGUgZnJvbSB0aGUgZ2l2ZW4gYHN0YXRlUGF0aGAsIG9yIHRocm93cy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBzdGF0ZVBhdGggVGhlIHN0cmluZyBvciBzdHJpbmcgYXJyYXkgcmVsYXRpdmUgcGF0aCB0byB0aGUgc3RhdGUgbm9kZS5cclxuICAgKi9cblxuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZ2V0U3RhdGVOb2RlQnlQYXRoID0gZnVuY3Rpb24gKHN0YXRlUGF0aCkge1xuICAgIGlmICh0eXBlb2Ygc3RhdGVQYXRoID09PSAnc3RyaW5nJyAmJiBpc1N0YXRlSWQoc3RhdGVQYXRoKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U3RhdGVOb2RlQnlJZChzdGF0ZVBhdGguc2xpY2UoMSkpO1xuICAgICAgfSBjYXRjaCAoZSkgey8vIHRyeSBpbmRpdmlkdWFsIHBhdGhzXG4gICAgICAgIC8vIHRocm93IGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGFycmF5U3RhdGVQYXRoID0gdG9TdGF0ZVBhdGgoc3RhdGVQYXRoLCB0aGlzLmRlbGltaXRlcikuc2xpY2UoKTtcbiAgICB2YXIgY3VycmVudFN0YXRlTm9kZSA9IHRoaXM7XG5cbiAgICB3aGlsZSAoYXJyYXlTdGF0ZVBhdGgubGVuZ3RoKSB7XG4gICAgICB2YXIga2V5ID0gYXJyYXlTdGF0ZVBhdGguc2hpZnQoKTtcblxuICAgICAgaWYgKCFrZXkubGVuZ3RoKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBjdXJyZW50U3RhdGVOb2RlID0gY3VycmVudFN0YXRlTm9kZS5nZXRTdGF0ZU5vZGUoa2V5KTtcbiAgICB9XG5cbiAgICByZXR1cm4gY3VycmVudFN0YXRlTm9kZTtcbiAgfTtcbiAgLyoqXHJcbiAgICogUmVzb2x2ZXMgYSBwYXJ0aWFsIHN0YXRlIHZhbHVlIHdpdGggaXRzIGZ1bGwgcmVwcmVzZW50YXRpb24gaW4gdGhpcyBtYWNoaW5lLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHN0YXRlVmFsdWUgVGhlIHBhcnRpYWwgc3RhdGUgdmFsdWUgdG8gcmVzb2x2ZS5cclxuICAgKi9cblxuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUucmVzb2x2ZSA9IGZ1bmN0aW9uIChzdGF0ZVZhbHVlKSB7XG4gICAgdmFyIF9hO1xuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGlmICghc3RhdGVWYWx1ZSkge1xuICAgICAgcmV0dXJuIHRoaXMuaW5pdGlhbFN0YXRlVmFsdWUgfHwgRU1QVFlfT0JKRUNUOyAvLyBUT0RPOiB0eXBlLXNwZWNpZmljIHByb3BlcnRpZXNcbiAgICB9XG5cbiAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgY2FzZSAncGFyYWxsZWwnOlxuICAgICAgICByZXR1cm4gbWFwVmFsdWVzKHRoaXMuaW5pdGlhbFN0YXRlVmFsdWUsIGZ1bmN0aW9uIChzdWJTdGF0ZVZhbHVlLCBzdWJTdGF0ZUtleSkge1xuICAgICAgICAgIHJldHVybiBzdWJTdGF0ZVZhbHVlID8gX3RoaXMuZ2V0U3RhdGVOb2RlKHN1YlN0YXRlS2V5KS5yZXNvbHZlKHN0YXRlVmFsdWVbc3ViU3RhdGVLZXldIHx8IHN1YlN0YXRlVmFsdWUpIDogRU1QVFlfT0JKRUNUO1xuICAgICAgICB9KTtcblxuICAgICAgY2FzZSAnY29tcG91bmQnOlxuICAgICAgICBpZiAoaXNTdHJpbmcoc3RhdGVWYWx1ZSkpIHtcbiAgICAgICAgICB2YXIgc3ViU3RhdGVOb2RlID0gdGhpcy5nZXRTdGF0ZU5vZGUoc3RhdGVWYWx1ZSk7XG5cbiAgICAgICAgICBpZiAoc3ViU3RhdGVOb2RlLnR5cGUgPT09ICdwYXJhbGxlbCcgfHwgc3ViU3RhdGVOb2RlLnR5cGUgPT09ICdjb21wb3VuZCcpIHtcbiAgICAgICAgICAgIHJldHVybiBfYSA9IHt9LCBfYVtzdGF0ZVZhbHVlXSA9IHN1YlN0YXRlTm9kZS5pbml0aWFsU3RhdGVWYWx1ZSwgX2E7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHN0YXRlVmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIU9iamVjdC5rZXlzKHN0YXRlVmFsdWUpLmxlbmd0aCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmluaXRpYWxTdGF0ZVZhbHVlIHx8IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1hcFZhbHVlcyhzdGF0ZVZhbHVlLCBmdW5jdGlvbiAoc3ViU3RhdGVWYWx1ZSwgc3ViU3RhdGVLZXkpIHtcbiAgICAgICAgICByZXR1cm4gc3ViU3RhdGVWYWx1ZSA/IF90aGlzLmdldFN0YXRlTm9kZShzdWJTdGF0ZUtleSkucmVzb2x2ZShzdWJTdGF0ZVZhbHVlKSA6IEVNUFRZX09CSkVDVDtcbiAgICAgICAgfSk7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBzdGF0ZVZhbHVlIHx8IEVNUFRZX09CSkVDVDtcbiAgICB9XG4gIH07XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5nZXRSZXNvbHZlZFBhdGggPSBmdW5jdGlvbiAoc3RhdGVJZGVudGlmaWVyKSB7XG4gICAgaWYgKGlzU3RhdGVJZChzdGF0ZUlkZW50aWZpZXIpKSB7XG4gICAgICB2YXIgc3RhdGVOb2RlID0gdGhpcy5tYWNoaW5lLmlkTWFwW3N0YXRlSWRlbnRpZmllci5zbGljZShTVEFURV9JREVOVElGSUVSLmxlbmd0aCldO1xuXG4gICAgICBpZiAoIXN0YXRlTm9kZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmFibGUgdG8gZmluZCBzdGF0ZSBub2RlICdcIi5jb25jYXQoc3RhdGVJZGVudGlmaWVyLCBcIidcIikpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3RhdGVOb2RlLnBhdGg7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRvU3RhdGVQYXRoKHN0YXRlSWRlbnRpZmllciwgdGhpcy5kZWxpbWl0ZXIpO1xuICB9O1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdGF0ZU5vZGUucHJvdG90eXBlLCBcImluaXRpYWxTdGF0ZVZhbHVlXCIsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBfYTtcblxuICAgICAgaWYgKHRoaXMuX19jYWNoZS5pbml0aWFsU3RhdGVWYWx1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fX2NhY2hlLmluaXRpYWxTdGF0ZVZhbHVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgaW5pdGlhbFN0YXRlVmFsdWU7XG5cbiAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdwYXJhbGxlbCcpIHtcbiAgICAgICAgaW5pdGlhbFN0YXRlVmFsdWUgPSBtYXBGaWx0ZXJWYWx1ZXModGhpcy5zdGF0ZXMsIGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgICAgIHJldHVybiBzdGF0ZS5pbml0aWFsU3RhdGVWYWx1ZSB8fCBFTVBUWV9PQkpFQ1Q7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChzdGF0ZU5vZGUpIHtcbiAgICAgICAgICByZXR1cm4gIShzdGF0ZU5vZGUudHlwZSA9PT0gJ2hpc3RvcnknKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaW5pdGlhbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICghdGhpcy5zdGF0ZXNbdGhpcy5pbml0aWFsXSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkluaXRpYWwgc3RhdGUgJ1wiLmNvbmNhdCh0aGlzLmluaXRpYWwsIFwiJyBub3QgZm91bmQgb24gJ1wiKS5jb25jYXQodGhpcy5rZXksIFwiJ1wiKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpbml0aWFsU3RhdGVWYWx1ZSA9IGlzTGVhZk5vZGUodGhpcy5zdGF0ZXNbdGhpcy5pbml0aWFsXSkgPyB0aGlzLmluaXRpYWwgOiAoX2EgPSB7fSwgX2FbdGhpcy5pbml0aWFsXSA9IHRoaXMuc3RhdGVzW3RoaXMuaW5pdGlhbF0uaW5pdGlhbFN0YXRlVmFsdWUsIF9hKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRoZSBmaW5pdGUgc3RhdGUgdmFsdWUgb2YgYSBtYWNoaW5lIHdpdGhvdXQgY2hpbGQgc3RhdGVzIGlzIGp1c3QgYW4gZW1wdHkgb2JqZWN0XG4gICAgICAgIGluaXRpYWxTdGF0ZVZhbHVlID0ge307XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX19jYWNoZS5pbml0aWFsU3RhdGVWYWx1ZSA9IGluaXRpYWxTdGF0ZVZhbHVlO1xuICAgICAgcmV0dXJuIHRoaXMuX19jYWNoZS5pbml0aWFsU3RhdGVWYWx1ZTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmdldEluaXRpYWxTdGF0ZSA9IGZ1bmN0aW9uIChzdGF0ZVZhbHVlLCBjb250ZXh0KSB7XG4gICAgdGhpcy5faW5pdCgpOyAvLyBUT0RPOiB0aGlzIHNob3VsZCBiZSBpbiB0aGUgY29uc3RydWN0b3IgKHNlZSBub3RlIGluIGNvbnN0cnVjdG9yKVxuXG5cbiAgICB2YXIgY29uZmlndXJhdGlvbiA9IHRoaXMuZ2V0U3RhdGVOb2RlcyhzdGF0ZVZhbHVlKTtcbiAgICByZXR1cm4gdGhpcy5yZXNvbHZlVHJhbnNpdGlvbih7XG4gICAgICBjb25maWd1cmF0aW9uOiBjb25maWd1cmF0aW9uLFxuICAgICAgZXhpdFNldDogW10sXG4gICAgICB0cmFuc2l0aW9uczogW10sXG4gICAgICBzb3VyY2U6IHVuZGVmaW5lZCxcbiAgICAgIGFjdGlvbnM6IFtdXG4gICAgfSwgdW5kZWZpbmVkLCBjb250ZXh0ICE9PSBudWxsICYmIGNvbnRleHQgIT09IHZvaWQgMCA/IGNvbnRleHQgOiB0aGlzLm1hY2hpbmUuY29udGV4dCwgdW5kZWZpbmVkKTtcbiAgfTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RhdGVOb2RlLnByb3RvdHlwZSwgXCJpbml0aWFsU3RhdGVcIiwge1xuICAgIC8qKlxyXG4gICAgICogVGhlIGluaXRpYWwgU3RhdGUgaW5zdGFuY2UsIHdoaWNoIGluY2x1ZGVzIGFsbCBhY3Rpb25zIHRvIGJlIGV4ZWN1dGVkIGZyb21cclxuICAgICAqIGVudGVyaW5nIHRoZSBpbml0aWFsIHN0YXRlLlxyXG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgaW5pdGlhbFN0YXRlVmFsdWUgPSB0aGlzLmluaXRpYWxTdGF0ZVZhbHVlO1xuXG4gICAgICBpZiAoIWluaXRpYWxTdGF0ZVZhbHVlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCByZXRyaWV2ZSBpbml0aWFsIHN0YXRlIGZyb20gc2ltcGxlIHN0YXRlICdcIi5jb25jYXQodGhpcy5pZCwgXCInLlwiKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmdldEluaXRpYWxTdGF0ZShpbml0aWFsU3RhdGVWYWx1ZSk7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdGF0ZU5vZGUucHJvdG90eXBlLCBcInRhcmdldFwiLCB7XG4gICAgLyoqXHJcbiAgICAgKiBUaGUgdGFyZ2V0IHN0YXRlIHZhbHVlIG9mIHRoZSBoaXN0b3J5IHN0YXRlIG5vZGUsIGlmIGl0IGV4aXN0cy4gVGhpcyByZXByZXNlbnRzIHRoZVxyXG4gICAgICogZGVmYXVsdCBzdGF0ZSB2YWx1ZSB0byB0cmFuc2l0aW9uIHRvIGlmIG5vIGhpc3RvcnkgdmFsdWUgZXhpc3RzIHlldC5cclxuICAgICAqL1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHRhcmdldDtcblxuICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ2hpc3RvcnknKSB7XG4gICAgICAgIHZhciBoaXN0b3J5Q29uZmlnID0gdGhpcy5jb25maWc7XG5cbiAgICAgICAgaWYgKGlzU3RyaW5nKGhpc3RvcnlDb25maWcudGFyZ2V0KSkge1xuICAgICAgICAgIHRhcmdldCA9IGlzU3RhdGVJZChoaXN0b3J5Q29uZmlnLnRhcmdldCkgPyBwYXRoVG9TdGF0ZVZhbHVlKHRoaXMubWFjaGluZS5nZXRTdGF0ZU5vZGVCeUlkKGhpc3RvcnlDb25maWcudGFyZ2V0KS5wYXRoLnNsaWNlKHRoaXMucGF0aC5sZW5ndGggLSAxKSkgOiBoaXN0b3J5Q29uZmlnLnRhcmdldDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0YXJnZXQgPSBoaXN0b3J5Q29uZmlnLnRhcmdldDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBsZWFmIG5vZGVzIGZyb20gYSBzdGF0ZSBwYXRoIHJlbGF0aXZlIHRvIHRoaXMgc3RhdGUgbm9kZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSByZWxhdGl2ZVN0YXRlSWQgVGhlIHJlbGF0aXZlIHN0YXRlIHBhdGggdG8gcmV0cmlldmUgdGhlIHN0YXRlIG5vZGVzXHJcbiAgICogQHBhcmFtIGhpc3RvcnkgVGhlIHByZXZpb3VzIHN0YXRlIHRvIHJldHJpZXZlIGhpc3RvcnlcclxuICAgKiBAcGFyYW0gcmVzb2x2ZSBXaGV0aGVyIHN0YXRlIG5vZGVzIHNob3VsZCByZXNvbHZlIHRvIGluaXRpYWwgY2hpbGQgc3RhdGUgbm9kZXNcclxuICAgKi9cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmdldFJlbGF0aXZlU3RhdGVOb2RlcyA9IGZ1bmN0aW9uIChyZWxhdGl2ZVN0YXRlSWQsIGhpc3RvcnlWYWx1ZSwgcmVzb2x2ZSkge1xuICAgIGlmIChyZXNvbHZlID09PSB2b2lkIDApIHtcbiAgICAgIHJlc29sdmUgPSB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiByZXNvbHZlID8gcmVsYXRpdmVTdGF0ZUlkLnR5cGUgPT09ICdoaXN0b3J5JyA/IHJlbGF0aXZlU3RhdGVJZC5yZXNvbHZlSGlzdG9yeShoaXN0b3J5VmFsdWUpIDogcmVsYXRpdmVTdGF0ZUlkLmluaXRpYWxTdGF0ZU5vZGVzIDogW3JlbGF0aXZlU3RhdGVJZF07XG4gIH07XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0YXRlTm9kZS5wcm90b3R5cGUsIFwiaW5pdGlhbFN0YXRlTm9kZXNcIiwge1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgaWYgKGlzTGVhZk5vZGUodGhpcykpIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzXTtcbiAgICAgIH0gLy8gQ2FzZSB3aGVuIHN0YXRlIG5vZGUgaXMgY29tcG91bmQgYnV0IG5vIGluaXRpYWwgc3RhdGUgaXMgZGVmaW5lZFxuXG5cbiAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdjb21wb3VuZCcgJiYgIXRoaXMuaW5pdGlhbCkge1xuICAgICAgICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICAgICAgICB3YXJuKGZhbHNlLCBcIkNvbXBvdW5kIHN0YXRlIG5vZGUgJ1wiLmNvbmNhdCh0aGlzLmlkLCBcIicgaGFzIG5vIGluaXRpYWwgc3RhdGUuXCIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbdGhpc107XG4gICAgICB9XG5cbiAgICAgIHZhciBpbml0aWFsU3RhdGVOb2RlUGF0aHMgPSB0b1N0YXRlUGF0aHModGhpcy5pbml0aWFsU3RhdGVWYWx1ZSk7XG4gICAgICByZXR1cm4gZmxhdHRlbihpbml0aWFsU3RhdGVOb2RlUGF0aHMubWFwKGZ1bmN0aW9uIChpbml0aWFsUGF0aCkge1xuICAgICAgICByZXR1cm4gX3RoaXMuZ2V0RnJvbVJlbGF0aXZlUGF0aChpbml0aWFsUGF0aCk7XG4gICAgICB9KSk7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG4gIC8qKlxyXG4gICAqIFJldHJpZXZlcyBzdGF0ZSBub2RlcyBmcm9tIGEgcmVsYXRpdmUgcGF0aCB0byB0aGlzIHN0YXRlIG5vZGUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gcmVsYXRpdmVQYXRoIFRoZSByZWxhdGl2ZSBwYXRoIGZyb20gdGhpcyBzdGF0ZSBub2RlXHJcbiAgICogQHBhcmFtIGhpc3RvcnlWYWx1ZVxyXG4gICAqL1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZ2V0RnJvbVJlbGF0aXZlUGF0aCA9IGZ1bmN0aW9uIChyZWxhdGl2ZVBhdGgpIHtcbiAgICBpZiAoIXJlbGF0aXZlUGF0aC5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBbdGhpc107XG4gICAgfVxuXG4gICAgdmFyIF9hID0gX19yZWFkKHJlbGF0aXZlUGF0aCksXG4gICAgICAgIHN0YXRlS2V5ID0gX2FbMF0sXG4gICAgICAgIGNoaWxkU3RhdGVQYXRoID0gX2Euc2xpY2UoMSk7XG5cbiAgICBpZiAoIXRoaXMuc3RhdGVzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgcmV0cmlldmUgc3ViUGF0aCAnXCIuY29uY2F0KHN0YXRlS2V5LCBcIicgZnJvbSBub2RlIHdpdGggbm8gc3RhdGVzXCIpKTtcbiAgICB9XG5cbiAgICB2YXIgY2hpbGRTdGF0ZU5vZGUgPSB0aGlzLmdldFN0YXRlTm9kZShzdGF0ZUtleSk7XG5cbiAgICBpZiAoY2hpbGRTdGF0ZU5vZGUudHlwZSA9PT0gJ2hpc3RvcnknKSB7XG4gICAgICByZXR1cm4gY2hpbGRTdGF0ZU5vZGUucmVzb2x2ZUhpc3RvcnkoKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuc3RhdGVzW3N0YXRlS2V5XSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2hpbGQgc3RhdGUgJ1wiLmNvbmNhdChzdGF0ZUtleSwgXCInIGRvZXMgbm90IGV4aXN0IG9uICdcIikuY29uY2F0KHRoaXMuaWQsIFwiJ1wiKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc3RhdGVzW3N0YXRlS2V5XS5nZXRGcm9tUmVsYXRpdmVQYXRoKGNoaWxkU3RhdGVQYXRoKTtcbiAgfTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmhpc3RvcnlWYWx1ZSA9IGZ1bmN0aW9uIChyZWxhdGl2ZVN0YXRlVmFsdWUpIHtcbiAgICBpZiAoIU9iamVjdC5rZXlzKHRoaXMuc3RhdGVzKS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGN1cnJlbnQ6IHJlbGF0aXZlU3RhdGVWYWx1ZSB8fCB0aGlzLmluaXRpYWxTdGF0ZVZhbHVlLFxuICAgICAgc3RhdGVzOiBtYXBGaWx0ZXJWYWx1ZXModGhpcy5zdGF0ZXMsIGZ1bmN0aW9uIChzdGF0ZU5vZGUsIGtleSkge1xuICAgICAgICBpZiAoIXJlbGF0aXZlU3RhdGVWYWx1ZSkge1xuICAgICAgICAgIHJldHVybiBzdGF0ZU5vZGUuaGlzdG9yeVZhbHVlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3ViU3RhdGVWYWx1ZSA9IGlzU3RyaW5nKHJlbGF0aXZlU3RhdGVWYWx1ZSkgPyB1bmRlZmluZWQgOiByZWxhdGl2ZVN0YXRlVmFsdWVba2V5XTtcbiAgICAgICAgcmV0dXJuIHN0YXRlTm9kZS5oaXN0b3J5VmFsdWUoc3ViU3RhdGVWYWx1ZSB8fCBzdGF0ZU5vZGUuaW5pdGlhbFN0YXRlVmFsdWUpO1xuICAgICAgfSwgZnVuY3Rpb24gKHN0YXRlTm9kZSkge1xuICAgICAgICByZXR1cm4gIXN0YXRlTm9kZS5oaXN0b3J5O1xuICAgICAgfSlcbiAgICB9O1xuICB9O1xuICAvKipcclxuICAgKiBSZXNvbHZlcyB0byB0aGUgaGlzdG9yaWNhbCB2YWx1ZShzKSBvZiB0aGUgcGFyZW50IHN0YXRlIG5vZGUsXHJcbiAgICogcmVwcmVzZW50ZWQgYnkgc3RhdGUgbm9kZXMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gaGlzdG9yeVZhbHVlXHJcbiAgICovXG5cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLnJlc29sdmVIaXN0b3J5ID0gZnVuY3Rpb24gKGhpc3RvcnlWYWx1ZSkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAodGhpcy50eXBlICE9PSAnaGlzdG9yeScpIHtcbiAgICAgIHJldHVybiBbdGhpc107XG4gICAgfVxuXG4gICAgdmFyIHBhcmVudCA9IHRoaXMucGFyZW50O1xuXG4gICAgaWYgKCFoaXN0b3J5VmFsdWUpIHtcbiAgICAgIHZhciBoaXN0b3J5VGFyZ2V0ID0gdGhpcy50YXJnZXQ7XG4gICAgICByZXR1cm4gaGlzdG9yeVRhcmdldCA/IGZsYXR0ZW4odG9TdGF0ZVBhdGhzKGhpc3RvcnlUYXJnZXQpLm1hcChmdW5jdGlvbiAocmVsYXRpdmVDaGlsZFBhdGgpIHtcbiAgICAgICAgcmV0dXJuIHBhcmVudC5nZXRGcm9tUmVsYXRpdmVQYXRoKHJlbGF0aXZlQ2hpbGRQYXRoKTtcbiAgICAgIH0pKSA6IHBhcmVudC5pbml0aWFsU3RhdGVOb2RlcztcbiAgICB9XG5cbiAgICB2YXIgc3ViSGlzdG9yeVZhbHVlID0gbmVzdGVkUGF0aChwYXJlbnQucGF0aCwgJ3N0YXRlcycpKGhpc3RvcnlWYWx1ZSkuY3VycmVudDtcblxuICAgIGlmIChpc1N0cmluZyhzdWJIaXN0b3J5VmFsdWUpKSB7XG4gICAgICByZXR1cm4gW3BhcmVudC5nZXRTdGF0ZU5vZGUoc3ViSGlzdG9yeVZhbHVlKV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZsYXR0ZW4odG9TdGF0ZVBhdGhzKHN1Ykhpc3RvcnlWYWx1ZSkubWFwKGZ1bmN0aW9uIChzdWJTdGF0ZVBhdGgpIHtcbiAgICAgIHJldHVybiBfdGhpcy5oaXN0b3J5ID09PSAnZGVlcCcgPyBwYXJlbnQuZ2V0RnJvbVJlbGF0aXZlUGF0aChzdWJTdGF0ZVBhdGgpIDogW3BhcmVudC5zdGF0ZXNbc3ViU3RhdGVQYXRoWzBdXV07XG4gICAgfSkpO1xuICB9O1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdGF0ZU5vZGUucHJvdG90eXBlLCBcInN0YXRlSWRzXCIsIHtcbiAgICAvKipcclxuICAgICAqIEFsbCB0aGUgc3RhdGUgbm9kZSBJRHMgb2YgdGhpcyBzdGF0ZSBub2RlIGFuZCBpdHMgZGVzY2VuZGFudCBzdGF0ZSBub2Rlcy5cclxuICAgICAqL1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgdmFyIGNoaWxkU3RhdGVJZHMgPSBmbGF0dGVuKE9iamVjdC5rZXlzKHRoaXMuc3RhdGVzKS5tYXAoZnVuY3Rpb24gKHN0YXRlS2V5KSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5zdGF0ZXNbc3RhdGVLZXldLnN0YXRlSWRzO1xuICAgICAgfSkpO1xuICAgICAgcmV0dXJuIFt0aGlzLmlkXS5jb25jYXQoY2hpbGRTdGF0ZUlkcyk7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdGF0ZU5vZGUucHJvdG90eXBlLCBcImV2ZW50c1wiLCB7XG4gICAgLyoqXHJcbiAgICAgKiBBbGwgdGhlIGV2ZW50IHR5cGVzIGFjY2VwdGVkIGJ5IHRoaXMgc3RhdGUgbm9kZSBhbmQgaXRzIGRlc2NlbmRhbnRzLlxyXG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgZV84LCBfYSwgZV85LCBfYjtcblxuICAgICAgaWYgKHRoaXMuX19jYWNoZS5ldmVudHMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19jYWNoZS5ldmVudHM7XG4gICAgICB9XG5cbiAgICAgIHZhciBzdGF0ZXMgPSB0aGlzLnN0YXRlcztcbiAgICAgIHZhciBldmVudHMgPSBuZXcgU2V0KHRoaXMub3duRXZlbnRzKTtcblxuICAgICAgaWYgKHN0YXRlcykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZvciAodmFyIF9jID0gX192YWx1ZXMoT2JqZWN0LmtleXMoc3RhdGVzKSksIF9kID0gX2MubmV4dCgpOyAhX2QuZG9uZTsgX2QgPSBfYy5uZXh0KCkpIHtcbiAgICAgICAgICAgIHZhciBzdGF0ZUlkID0gX2QudmFsdWU7XG4gICAgICAgICAgICB2YXIgc3RhdGUgPSBzdGF0ZXNbc3RhdGVJZF07XG5cbiAgICAgICAgICAgIGlmIChzdGF0ZS5zdGF0ZXMpIHtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfZSA9IChlXzkgPSB2b2lkIDAsIF9fdmFsdWVzKHN0YXRlLmV2ZW50cykpLCBfZiA9IF9lLm5leHQoKTsgIV9mLmRvbmU7IF9mID0gX2UubmV4dCgpKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgZXZlbnRfMSA9IF9mLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgZXZlbnRzLmFkZChcIlwiLmNvbmNhdChldmVudF8xKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGNhdGNoIChlXzlfMSkge1xuICAgICAgICAgICAgICAgIGVfOSA9IHtcbiAgICAgICAgICAgICAgICAgIGVycm9yOiBlXzlfMVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIGlmIChfZiAmJiAhX2YuZG9uZSAmJiAoX2IgPSBfZS5yZXR1cm4pKSBfYi5jYWxsKF9lKTtcbiAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgaWYgKGVfOSkgdGhyb3cgZV85LmVycm9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZV84XzEpIHtcbiAgICAgICAgICBlXzggPSB7XG4gICAgICAgICAgICBlcnJvcjogZV84XzFcbiAgICAgICAgICB9O1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoX2QgJiYgIV9kLmRvbmUgJiYgKF9hID0gX2MucmV0dXJuKSkgX2EuY2FsbChfYyk7XG4gICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIGlmIChlXzgpIHRocm93IGVfOC5lcnJvcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuX19jYWNoZS5ldmVudHMgPSBBcnJheS5mcm9tKGV2ZW50cyk7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdGF0ZU5vZGUucHJvdG90eXBlLCBcIm93bkV2ZW50c1wiLCB7XG4gICAgLyoqXHJcbiAgICAgKiBBbGwgdGhlIGV2ZW50cyB0aGF0IGhhdmUgdHJhbnNpdGlvbnMgZGlyZWN0bHkgZnJvbSB0aGlzIHN0YXRlIG5vZGUuXHJcbiAgICAgKlxyXG4gICAgICogRXhjbHVkZXMgYW55IGluZXJ0IGV2ZW50cy5cclxuICAgICAqL1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGV2ZW50cyA9IG5ldyBTZXQodGhpcy50cmFuc2l0aW9ucy5maWx0ZXIoZnVuY3Rpb24gKHRyYW5zaXRpb24pIHtcbiAgICAgICAgcmV0dXJuICEoIXRyYW5zaXRpb24udGFyZ2V0ICYmICF0cmFuc2l0aW9uLmFjdGlvbnMubGVuZ3RoICYmIHRyYW5zaXRpb24uaW50ZXJuYWwpO1xuICAgICAgfSkubWFwKGZ1bmN0aW9uICh0cmFuc2l0aW9uKSB7XG4gICAgICAgIHJldHVybiB0cmFuc2l0aW9uLmV2ZW50VHlwZTtcbiAgICAgIH0pKTtcbiAgICAgIHJldHVybiBBcnJheS5mcm9tKGV2ZW50cyk7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5yZXNvbHZlVGFyZ2V0ID0gZnVuY3Rpb24gKF90YXJnZXQpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKF90YXJnZXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gYW4gdW5kZWZpbmVkIHRhcmdldCBzaWduYWxzIHRoYXQgdGhlIHN0YXRlIG5vZGUgc2hvdWxkIG5vdCB0cmFuc2l0aW9uIGZyb20gdGhhdCBzdGF0ZSB3aGVuIHJlY2VpdmluZyB0aGF0IGV2ZW50XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiBfdGFyZ2V0Lm1hcChmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICBpZiAoIWlzU3RyaW5nKHRhcmdldCkpIHtcbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICAgIH1cblxuICAgICAgdmFyIGlzSW50ZXJuYWxUYXJnZXQgPSB0YXJnZXRbMF0gPT09IF90aGlzLmRlbGltaXRlcjsgLy8gSWYgaW50ZXJuYWwgdGFyZ2V0IGlzIGRlZmluZWQgb24gbWFjaGluZSxcbiAgICAgIC8vIGRvIG5vdCBpbmNsdWRlIG1hY2hpbmUga2V5IG9uIHRhcmdldFxuXG4gICAgICBpZiAoaXNJbnRlcm5hbFRhcmdldCAmJiAhX3RoaXMucGFyZW50KSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5nZXRTdGF0ZU5vZGVCeVBhdGgodGFyZ2V0LnNsaWNlKDEpKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlc29sdmVkVGFyZ2V0ID0gaXNJbnRlcm5hbFRhcmdldCA/IF90aGlzLmtleSArIHRhcmdldCA6IHRhcmdldDtcblxuICAgICAgaWYgKF90aGlzLnBhcmVudCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhciB0YXJnZXRTdGF0ZU5vZGUgPSBfdGhpcy5wYXJlbnQuZ2V0U3RhdGVOb2RlQnlQYXRoKHJlc29sdmVkVGFyZ2V0KTtcblxuICAgICAgICAgIHJldHVybiB0YXJnZXRTdGF0ZU5vZGU7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdHJhbnNpdGlvbiBkZWZpbml0aW9uIGZvciBzdGF0ZSBub2RlICdcIi5jb25jYXQoX3RoaXMuaWQsIFwiJzpcXG5cIikuY29uY2F0KGVyci5tZXNzYWdlKSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5nZXRTdGF0ZU5vZGVCeVBhdGgocmVzb2x2ZWRUYXJnZXQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZm9ybWF0VHJhbnNpdGlvbiA9IGZ1bmN0aW9uICh0cmFuc2l0aW9uQ29uZmlnKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBub3JtYWxpemVkVGFyZ2V0ID0gbm9ybWFsaXplVGFyZ2V0KHRyYW5zaXRpb25Db25maWcudGFyZ2V0KTtcbiAgICB2YXIgaW50ZXJuYWwgPSAnaW50ZXJuYWwnIGluIHRyYW5zaXRpb25Db25maWcgPyB0cmFuc2l0aW9uQ29uZmlnLmludGVybmFsIDogbm9ybWFsaXplZFRhcmdldCA/IG5vcm1hbGl6ZWRUYXJnZXQuc29tZShmdW5jdGlvbiAoX3RhcmdldCkge1xuICAgICAgcmV0dXJuIGlzU3RyaW5nKF90YXJnZXQpICYmIF90YXJnZXRbMF0gPT09IF90aGlzLmRlbGltaXRlcjtcbiAgICB9KSA6IHRydWU7XG4gICAgdmFyIGd1YXJkcyA9IHRoaXMubWFjaGluZS5vcHRpb25zLmd1YXJkcztcbiAgICB2YXIgdGFyZ2V0ID0gdGhpcy5yZXNvbHZlVGFyZ2V0KG5vcm1hbGl6ZWRUYXJnZXQpO1xuXG4gICAgdmFyIHRyYW5zaXRpb24gPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgdHJhbnNpdGlvbkNvbmZpZyksIHtcbiAgICAgIGFjdGlvbnM6IHRvQWN0aW9uT2JqZWN0cyh0b0FycmF5KHRyYW5zaXRpb25Db25maWcuYWN0aW9ucykpLFxuICAgICAgY29uZDogdG9HdWFyZCh0cmFuc2l0aW9uQ29uZmlnLmNvbmQsIGd1YXJkcyksXG4gICAgICB0YXJnZXQ6IHRhcmdldCxcbiAgICAgIHNvdXJjZTogdGhpcyxcbiAgICAgIGludGVybmFsOiBpbnRlcm5hbCxcbiAgICAgIGV2ZW50VHlwZTogdHJhbnNpdGlvbkNvbmZpZy5ldmVudCxcbiAgICAgIHRvSlNPTjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIHRyYW5zaXRpb24pLCB7XG4gICAgICAgICAgdGFyZ2V0OiB0cmFuc2l0aW9uLnRhcmdldCA/IHRyYW5zaXRpb24udGFyZ2V0Lm1hcChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiI1wiLmNvbmNhdCh0LmlkKTtcbiAgICAgICAgICB9KSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICBzb3VyY2U6IFwiI1wiLmNvbmNhdChfdGhpcy5pZClcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdHJhbnNpdGlvbjtcbiAgfTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmZvcm1hdFRyYW5zaXRpb25zID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBlXzEwLCBfYTtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgb25Db25maWc7XG5cbiAgICBpZiAoIXRoaXMuY29uZmlnLm9uKSB7XG4gICAgICBvbkNvbmZpZyA9IFtdO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLmNvbmZpZy5vbikpIHtcbiAgICAgIG9uQ29uZmlnID0gdGhpcy5jb25maWcub247XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBfYiA9IHRoaXMuY29uZmlnLm9uLFxuICAgICAgICAgIF9jID0gV0lMRENBUkQsXG4gICAgICAgICAgX2QgPSBfYltfY10sXG4gICAgICAgICAgd2lsZGNhcmRDb25maWdzID0gX2QgPT09IHZvaWQgMCA/IFtdIDogX2QsXG4gICAgICAgICAgc3RyaWN0VHJhbnNpdGlvbkNvbmZpZ3NfMSA9IF9fcmVzdChfYiwgW3R5cGVvZiBfYyA9PT0gXCJzeW1ib2xcIiA/IF9jIDogX2MgKyBcIlwiXSk7XG5cbiAgICAgIG9uQ29uZmlnID0gZmxhdHRlbihPYmplY3Qua2V5cyhzdHJpY3RUcmFuc2l0aW9uQ29uZmlnc18xKS5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBpZiAoIUlTX1BST0RVQ1RJT04gJiYga2V5ID09PSBOVUxMX0VWRU5UKSB7XG4gICAgICAgICAgd2FybihmYWxzZSwgXCJFbXB0eSBzdHJpbmcgdHJhbnNpdGlvbiBjb25maWdzIChlLmcuLCBgeyBvbjogeyAnJzogLi4uIH19YCkgZm9yIHRyYW5zaWVudCB0cmFuc2l0aW9ucyBhcmUgZGVwcmVjYXRlZC4gU3BlY2lmeSB0aGUgdHJhbnNpdGlvbiBpbiB0aGUgYHsgYWx3YXlzOiAuLi4gfWAgcHJvcGVydHkgaW5zdGVhZC4gXCIgKyBcIlBsZWFzZSBjaGVjayB0aGUgYG9uYCBjb25maWd1cmF0aW9uIGZvciBcXFwiI1wiLmNvbmNhdChfdGhpcy5pZCwgXCJcXFwiLlwiKSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdHJhbnNpdGlvbkNvbmZpZ0FycmF5ID0gdG9UcmFuc2l0aW9uQ29uZmlnQXJyYXkoa2V5LCBzdHJpY3RUcmFuc2l0aW9uQ29uZmlnc18xW2tleV0pO1xuXG4gICAgICAgIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgICAgICAgIHZhbGlkYXRlQXJyYXlpZmllZFRyYW5zaXRpb25zKF90aGlzLCBrZXksIHRyYW5zaXRpb25Db25maWdBcnJheSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJhbnNpdGlvbkNvbmZpZ0FycmF5O1xuICAgICAgfSkuY29uY2F0KHRvVHJhbnNpdGlvbkNvbmZpZ0FycmF5KFdJTERDQVJELCB3aWxkY2FyZENvbmZpZ3MpKSk7XG4gICAgfVxuXG4gICAgdmFyIGV2ZW50bGVzc0NvbmZpZyA9IHRoaXMuY29uZmlnLmFsd2F5cyA/IHRvVHJhbnNpdGlvbkNvbmZpZ0FycmF5KCcnLCB0aGlzLmNvbmZpZy5hbHdheXMpIDogW107XG4gICAgdmFyIGRvbmVDb25maWcgPSB0aGlzLmNvbmZpZy5vbkRvbmUgPyB0b1RyYW5zaXRpb25Db25maWdBcnJheShTdHJpbmcoZG9uZSh0aGlzLmlkKSksIHRoaXMuY29uZmlnLm9uRG9uZSkgOiBbXTtcblxuICAgIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgICAgd2FybighKHRoaXMuY29uZmlnLm9uRG9uZSAmJiAhdGhpcy5wYXJlbnQpLCBcIlJvb3Qgbm9kZXMgY2Fubm90IGhhdmUgYW4gXFxcIi5vbkRvbmVcXFwiIHRyYW5zaXRpb24uIFBsZWFzZSBjaGVjayB0aGUgY29uZmlnIG9mIFxcXCJcIi5jb25jYXQodGhpcy5pZCwgXCJcXFwiLlwiKSk7XG4gICAgfVxuXG4gICAgdmFyIGludm9rZUNvbmZpZyA9IGZsYXR0ZW4odGhpcy5pbnZva2UubWFwKGZ1bmN0aW9uIChpbnZva2VEZWYpIHtcbiAgICAgIHZhciBzZXR0bGVUcmFuc2l0aW9ucyA9IFtdO1xuXG4gICAgICBpZiAoaW52b2tlRGVmLm9uRG9uZSkge1xuICAgICAgICBzZXR0bGVUcmFuc2l0aW9ucy5wdXNoLmFwcGx5KHNldHRsZVRyYW5zaXRpb25zLCBfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQodG9UcmFuc2l0aW9uQ29uZmlnQXJyYXkoU3RyaW5nKGRvbmVJbnZva2UoaW52b2tlRGVmLmlkKSksIGludm9rZURlZi5vbkRvbmUpKSwgZmFsc2UpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGludm9rZURlZi5vbkVycm9yKSB7XG4gICAgICAgIHNldHRsZVRyYW5zaXRpb25zLnB1c2guYXBwbHkoc2V0dGxlVHJhbnNpdGlvbnMsIF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZCh0b1RyYW5zaXRpb25Db25maWdBcnJheShTdHJpbmcoZXJyb3IoaW52b2tlRGVmLmlkKSksIGludm9rZURlZi5vbkVycm9yKSksIGZhbHNlKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzZXR0bGVUcmFuc2l0aW9ucztcbiAgICB9KSk7XG4gICAgdmFyIGRlbGF5ZWRUcmFuc2l0aW9ucyA9IHRoaXMuYWZ0ZXI7XG4gICAgdmFyIGZvcm1hdHRlZFRyYW5zaXRpb25zID0gZmxhdHRlbihfX3NwcmVhZEFycmF5KF9fc3ByZWFkQXJyYXkoX19zcHJlYWRBcnJheShfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQoZG9uZUNvbmZpZyksIGZhbHNlKSwgX19yZWFkKGludm9rZUNvbmZpZyksIGZhbHNlKSwgX19yZWFkKG9uQ29uZmlnKSwgZmFsc2UpLCBfX3JlYWQoZXZlbnRsZXNzQ29uZmlnKSwgZmFsc2UpLm1hcChmdW5jdGlvbiAodHJhbnNpdGlvbkNvbmZpZykge1xuICAgICAgcmV0dXJuIHRvQXJyYXkodHJhbnNpdGlvbkNvbmZpZykubWFwKGZ1bmN0aW9uICh0cmFuc2l0aW9uKSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5mb3JtYXRUcmFuc2l0aW9uKHRyYW5zaXRpb24pO1xuICAgICAgfSk7XG4gICAgfSkpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIGRlbGF5ZWRUcmFuc2l0aW9uc18xID0gX192YWx1ZXMoZGVsYXllZFRyYW5zaXRpb25zKSwgZGVsYXllZFRyYW5zaXRpb25zXzFfMSA9IGRlbGF5ZWRUcmFuc2l0aW9uc18xLm5leHQoKTsgIWRlbGF5ZWRUcmFuc2l0aW9uc18xXzEuZG9uZTsgZGVsYXllZFRyYW5zaXRpb25zXzFfMSA9IGRlbGF5ZWRUcmFuc2l0aW9uc18xLm5leHQoKSkge1xuICAgICAgICB2YXIgZGVsYXllZFRyYW5zaXRpb24gPSBkZWxheWVkVHJhbnNpdGlvbnNfMV8xLnZhbHVlO1xuICAgICAgICBmb3JtYXR0ZWRUcmFuc2l0aW9ucy5wdXNoKGRlbGF5ZWRUcmFuc2l0aW9uKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzEwXzEpIHtcbiAgICAgIGVfMTAgPSB7XG4gICAgICAgIGVycm9yOiBlXzEwXzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChkZWxheWVkVHJhbnNpdGlvbnNfMV8xICYmICFkZWxheWVkVHJhbnNpdGlvbnNfMV8xLmRvbmUgJiYgKF9hID0gZGVsYXllZFRyYW5zaXRpb25zXzEucmV0dXJuKSkgX2EuY2FsbChkZWxheWVkVHJhbnNpdGlvbnNfMSk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV8xMCkgdGhyb3cgZV8xMC5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZm9ybWF0dGVkVHJhbnNpdGlvbnM7XG4gIH07XG5cbiAgcmV0dXJuIFN0YXRlTm9kZTtcbn0oKTtcblxuZXhwb3J0IHsgU3RhdGVOb2RlIH07XG4iLCIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXHJcblxyXG5QZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcclxucHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLlxyXG5cclxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVMgV0lUSFxyXG5SRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFlcclxuQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULFxyXG5JTkRJUkVDVCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST01cclxuTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1JcclxuT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUlxyXG5QRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG5cclxudmFyIF9fYXNzaWduID0gZnVuY3Rpb24oKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH07XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufTtcclxuXHJcbmZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIF9fc3ByZWFkQXJyYXkodG8sIGZyb20sIHBhY2spIHtcclxuICAgIGlmIChwYWNrIHx8IGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIGZvciAodmFyIGkgPSAwLCBsID0gZnJvbS5sZW5ndGgsIGFyOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGFyIHx8ICEoaSBpbiBmcm9tKSkge1xyXG4gICAgICAgICAgICBpZiAoIWFyKSBhciA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20sIDAsIGkpO1xyXG4gICAgICAgICAgICBhcltpXSA9IGZyb21baV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRvLmNvbmNhdChhciB8fCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tKSk7XHJcbn1cblxuZXhwb3J0IHsgX19hc3NpZ24sIF9fcmVhZCwgX19yZXN0LCBfX3NwcmVhZEFycmF5LCBfX3ZhbHVlcyB9O1xuIiwiaW1wb3J0IHsgQWN0aW9uVHlwZXMgfSBmcm9tICcuL3R5cGVzLmpzJztcblxudmFyIHN0YXJ0ID0gQWN0aW9uVHlwZXMuU3RhcnQ7XG52YXIgc3RvcCA9IEFjdGlvblR5cGVzLlN0b3A7XG52YXIgcmFpc2UgPSBBY3Rpb25UeXBlcy5SYWlzZTtcbnZhciBzZW5kID0gQWN0aW9uVHlwZXMuU2VuZDtcbnZhciBjYW5jZWwgPSBBY3Rpb25UeXBlcy5DYW5jZWw7XG52YXIgbnVsbEV2ZW50ID0gQWN0aW9uVHlwZXMuTnVsbEV2ZW50O1xudmFyIGFzc2lnbiA9IEFjdGlvblR5cGVzLkFzc2lnbjtcbnZhciBhZnRlciA9IEFjdGlvblR5cGVzLkFmdGVyO1xudmFyIGRvbmVTdGF0ZSA9IEFjdGlvblR5cGVzLkRvbmVTdGF0ZTtcbnZhciBsb2cgPSBBY3Rpb25UeXBlcy5Mb2c7XG52YXIgaW5pdCA9IEFjdGlvblR5cGVzLkluaXQ7XG52YXIgaW52b2tlID0gQWN0aW9uVHlwZXMuSW52b2tlO1xudmFyIGVycm9yRXhlY3V0aW9uID0gQWN0aW9uVHlwZXMuRXJyb3JFeGVjdXRpb247XG52YXIgZXJyb3JQbGF0Zm9ybSA9IEFjdGlvblR5cGVzLkVycm9yUGxhdGZvcm07XG52YXIgZXJyb3IgPSBBY3Rpb25UeXBlcy5FcnJvckN1c3RvbTtcbnZhciB1cGRhdGUgPSBBY3Rpb25UeXBlcy5VcGRhdGU7XG52YXIgY2hvb3NlID0gQWN0aW9uVHlwZXMuQ2hvb3NlO1xudmFyIHB1cmUgPSBBY3Rpb25UeXBlcy5QdXJlO1xuXG5leHBvcnQgeyBhZnRlciwgYXNzaWduLCBjYW5jZWwsIGNob29zZSwgZG9uZVN0YXRlLCBlcnJvciwgZXJyb3JFeGVjdXRpb24sIGVycm9yUGxhdGZvcm0sIGluaXQsIGludm9rZSwgbG9nLCBudWxsRXZlbnQsIHB1cmUsIHJhaXNlLCBzZW5kLCBzdGFydCwgc3RvcCwgdXBkYXRlIH07XG4iLCJpbXBvcnQgeyBfX2Fzc2lnbiwgX19zcHJlYWRBcnJheSwgX19yZWFkLCBfX3ZhbHVlcyB9IGZyb20gJy4vX3ZpcnR1YWwvX3RzbGliLmpzJztcbmltcG9ydCB7IFNwZWNpYWxUYXJnZXRzLCBBY3Rpb25UeXBlcyB9IGZyb20gJy4vdHlwZXMuanMnO1xuaW1wb3J0IHsgaW5pdCwgcmFpc2UgYXMgcmFpc2UkMSwgc2VuZCBhcyBzZW5kJDEsIHVwZGF0ZSwgbG9nIGFzIGxvZyQxLCBjYW5jZWwgYXMgY2FuY2VsJDEsIGFzc2lnbiBhcyBhc3NpZ24kMSwgZXJyb3IgYXMgZXJyb3IkMSwgc3RvcCBhcyBzdG9wJDEsIHB1cmUgYXMgcHVyZSQxLCBjaG9vc2UgYXMgY2hvb3NlJDEgfSBmcm9tICcuL2FjdGlvblR5cGVzLmpzJztcbmltcG9ydCAqIGFzIGFjdGlvblR5cGVzIGZyb20gJy4vYWN0aW9uVHlwZXMuanMnO1xuZXhwb3J0IHsgYWN0aW9uVHlwZXMgfTtcbmltcG9ydCB7IHRvU0NYTUxFdmVudCwgaXNTdHJpbmcsIGlzRnVuY3Rpb24sIHRvRXZlbnRPYmplY3QsIGdldEV2ZW50VHlwZSwgdXBkYXRlQ29udGV4dCwgZmxhdHRlbiwgaXNBcnJheSwgdG9BcnJheSwgdG9HdWFyZCwgZXZhbHVhdGVHdWFyZCwgd2FybiB9IGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHsgSVNfUFJPRFVDVElPTiB9IGZyb20gJy4vZW52aXJvbm1lbnQuanMnO1xuXG52YXIgaW5pdEV2ZW50ID0gLyojX19QVVJFX18qL3RvU0NYTUxFdmVudCh7XG4gIHR5cGU6IGluaXRcbn0pO1xuZnVuY3Rpb24gZ2V0QWN0aW9uRnVuY3Rpb24oYWN0aW9uVHlwZSwgYWN0aW9uRnVuY3Rpb25NYXApIHtcbiAgcmV0dXJuIGFjdGlvbkZ1bmN0aW9uTWFwID8gYWN0aW9uRnVuY3Rpb25NYXBbYWN0aW9uVHlwZV0gfHwgdW5kZWZpbmVkIDogdW5kZWZpbmVkO1xufVxuZnVuY3Rpb24gdG9BY3Rpb25PYmplY3QoYWN0aW9uLCBhY3Rpb25GdW5jdGlvbk1hcCkge1xuICB2YXIgYWN0aW9uT2JqZWN0O1xuXG4gIGlmIChpc1N0cmluZyhhY3Rpb24pIHx8IHR5cGVvZiBhY3Rpb24gPT09ICdudW1iZXInKSB7XG4gICAgdmFyIGV4ZWMgPSBnZXRBY3Rpb25GdW5jdGlvbihhY3Rpb24sIGFjdGlvbkZ1bmN0aW9uTWFwKTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGV4ZWMpKSB7XG4gICAgICBhY3Rpb25PYmplY3QgPSB7XG4gICAgICAgIHR5cGU6IGFjdGlvbixcbiAgICAgICAgZXhlYzogZXhlY1xuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKGV4ZWMpIHtcbiAgICAgIGFjdGlvbk9iamVjdCA9IGV4ZWM7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFjdGlvbk9iamVjdCA9IHtcbiAgICAgICAgdHlwZTogYWN0aW9uLFxuICAgICAgICBleGVjOiB1bmRlZmluZWRcbiAgICAgIH07XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzRnVuY3Rpb24oYWN0aW9uKSkge1xuICAgIGFjdGlvbk9iamVjdCA9IHtcbiAgICAgIC8vIENvbnZlcnQgYWN0aW9uIHRvIHN0cmluZyBpZiB1bm5hbWVkXG4gICAgICB0eXBlOiBhY3Rpb24ubmFtZSB8fCBhY3Rpb24udG9TdHJpbmcoKSxcbiAgICAgIGV4ZWM6IGFjdGlvblxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgdmFyIGV4ZWMgPSBnZXRBY3Rpb25GdW5jdGlvbihhY3Rpb24udHlwZSwgYWN0aW9uRnVuY3Rpb25NYXApO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oZXhlYykpIHtcbiAgICAgIGFjdGlvbk9iamVjdCA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCBhY3Rpb24pLCB7XG4gICAgICAgIGV4ZWM6IGV4ZWNcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoZXhlYykge1xuICAgICAgdmFyIGFjdGlvblR5cGUgPSBleGVjLnR5cGUgfHwgYWN0aW9uLnR5cGU7XG4gICAgICBhY3Rpb25PYmplY3QgPSBfX2Fzc2lnbihfX2Fzc2lnbihfX2Fzc2lnbih7fSwgZXhlYyksIGFjdGlvbiksIHtcbiAgICAgICAgdHlwZTogYWN0aW9uVHlwZVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFjdGlvbk9iamVjdCA9IGFjdGlvbjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYWN0aW9uT2JqZWN0O1xufVxudmFyIHRvQWN0aW9uT2JqZWN0cyA9IGZ1bmN0aW9uIChhY3Rpb24sIGFjdGlvbkZ1bmN0aW9uTWFwKSB7XG4gIGlmICghYWN0aW9uKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgdmFyIGFjdGlvbnMgPSBpc0FycmF5KGFjdGlvbikgPyBhY3Rpb24gOiBbYWN0aW9uXTtcbiAgcmV0dXJuIGFjdGlvbnMubWFwKGZ1bmN0aW9uIChzdWJBY3Rpb24pIHtcbiAgICByZXR1cm4gdG9BY3Rpb25PYmplY3Qoc3ViQWN0aW9uLCBhY3Rpb25GdW5jdGlvbk1hcCk7XG4gIH0pO1xufTtcbmZ1bmN0aW9uIHRvQWN0aXZpdHlEZWZpbml0aW9uKGFjdGlvbikge1xuICB2YXIgYWN0aW9uT2JqZWN0ID0gdG9BY3Rpb25PYmplY3QoYWN0aW9uKTtcbiAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHtcbiAgICBpZDogaXNTdHJpbmcoYWN0aW9uKSA/IGFjdGlvbiA6IGFjdGlvbk9iamVjdC5pZFxuICB9LCBhY3Rpb25PYmplY3QpLCB7XG4gICAgdHlwZTogYWN0aW9uT2JqZWN0LnR5cGVcbiAgfSk7XG59XG4vKipcclxuICogUmFpc2VzIGFuIGV2ZW50LiBUaGlzIHBsYWNlcyB0aGUgZXZlbnQgaW4gdGhlIGludGVybmFsIGV2ZW50IHF1ZXVlLCBzbyB0aGF0XHJcbiAqIHRoZSBldmVudCBpcyBpbW1lZGlhdGVseSBjb25zdW1lZCBieSB0aGUgbWFjaGluZSBpbiB0aGUgY3VycmVudCBzdGVwLlxyXG4gKlxyXG4gKiBAcGFyYW0gZXZlbnRUeXBlIFRoZSBldmVudCB0byByYWlzZS5cclxuICovXG5cbmZ1bmN0aW9uIHJhaXNlKGV2ZW50LCBvcHRpb25zKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogcmFpc2UkMSxcbiAgICBldmVudDogdHlwZW9mIGV2ZW50ID09PSAnZnVuY3Rpb24nID8gZXZlbnQgOiB0b0V2ZW50T2JqZWN0KGV2ZW50KSxcbiAgICBkZWxheTogb3B0aW9ucyA/IG9wdGlvbnMuZGVsYXkgOiB1bmRlZmluZWQsXG4gICAgaWQ6IG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5pZFxuICB9O1xufVxuZnVuY3Rpb24gcmVzb2x2ZVJhaXNlKGFjdGlvbiwgY3R4LCBfZXZlbnQsIGRlbGF5c01hcCkge1xuICB2YXIgbWV0YSA9IHtcbiAgICBfZXZlbnQ6IF9ldmVudFxuICB9O1xuICB2YXIgcmVzb2x2ZWRFdmVudCA9IHRvU0NYTUxFdmVudChpc0Z1bmN0aW9uKGFjdGlvbi5ldmVudCkgPyBhY3Rpb24uZXZlbnQoY3R4LCBfZXZlbnQuZGF0YSwgbWV0YSkgOiBhY3Rpb24uZXZlbnQpO1xuICB2YXIgcmVzb2x2ZWREZWxheTtcblxuICBpZiAoaXNTdHJpbmcoYWN0aW9uLmRlbGF5KSkge1xuICAgIHZhciBjb25maWdEZWxheSA9IGRlbGF5c01hcCAmJiBkZWxheXNNYXBbYWN0aW9uLmRlbGF5XTtcbiAgICByZXNvbHZlZERlbGF5ID0gaXNGdW5jdGlvbihjb25maWdEZWxheSkgPyBjb25maWdEZWxheShjdHgsIF9ldmVudC5kYXRhLCBtZXRhKSA6IGNvbmZpZ0RlbGF5O1xuICB9IGVsc2Uge1xuICAgIHJlc29sdmVkRGVsYXkgPSBpc0Z1bmN0aW9uKGFjdGlvbi5kZWxheSkgPyBhY3Rpb24uZGVsYXkoY3R4LCBfZXZlbnQuZGF0YSwgbWV0YSkgOiBhY3Rpb24uZGVsYXk7XG4gIH1cblxuICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIGFjdGlvbiksIHtcbiAgICB0eXBlOiByYWlzZSQxLFxuICAgIF9ldmVudDogcmVzb2x2ZWRFdmVudCxcbiAgICBkZWxheTogcmVzb2x2ZWREZWxheVxuICB9KTtcbn1cbi8qKlxyXG4gKiBTZW5kcyBhbiBldmVudC4gVGhpcyByZXR1cm5zIGFuIGFjdGlvbiB0aGF0IHdpbGwgYmUgcmVhZCBieSBhbiBpbnRlcnByZXRlciB0b1xyXG4gKiBzZW5kIHRoZSBldmVudCBpbiB0aGUgbmV4dCBzdGVwLCBhZnRlciB0aGUgY3VycmVudCBzdGVwIGlzIGZpbmlzaGVkIGV4ZWN1dGluZy5cclxuICpcclxuICogQGRlcHJlY2F0ZWQgVXNlIHRoZSBgc2VuZFRvKC4uLilgIGFjdGlvbiBjcmVhdG9yIGluc3RlYWQuXHJcbiAqXHJcbiAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQgdG8gc2VuZC5cclxuICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyB0byBwYXNzIGludG8gdGhlIHNlbmQgZXZlbnQ6XHJcbiAqICAtIGBpZGAgLSBUaGUgdW5pcXVlIHNlbmQgZXZlbnQgaWRlbnRpZmllciAodXNlZCB3aXRoIGBjYW5jZWwoKWApLlxyXG4gKiAgLSBgZGVsYXlgIC0gVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gZGVsYXkgdGhlIHNlbmRpbmcgb2YgdGhlIGV2ZW50LlxyXG4gKiAgLSBgdG9gIC0gVGhlIHRhcmdldCBvZiB0aGlzIGV2ZW50IChieSBkZWZhdWx0LCB0aGUgbWFjaGluZSB0aGUgZXZlbnQgd2FzIHNlbnQgZnJvbSkuXHJcbiAqL1xuXG5mdW5jdGlvbiBzZW5kKGV2ZW50LCBvcHRpb25zKSB7XG4gIHJldHVybiB7XG4gICAgdG86IG9wdGlvbnMgPyBvcHRpb25zLnRvIDogdW5kZWZpbmVkLFxuICAgIHR5cGU6IHNlbmQkMSxcbiAgICBldmVudDogaXNGdW5jdGlvbihldmVudCkgPyBldmVudCA6IHRvRXZlbnRPYmplY3QoZXZlbnQpLFxuICAgIGRlbGF5OiBvcHRpb25zID8gb3B0aW9ucy5kZWxheSA6IHVuZGVmaW5lZCxcbiAgICAvLyBUT0RPOiBkb24ndCBhdXRvLWdlbmVyYXRlIElEcyBoZXJlIGxpa2UgdGhhdFxuICAgIC8vIHRoZXJlIGlzIHRvbyBiaWcgY2hhbmNlIG9mIHRoZSBJRCBjb2xsaXNpb25cbiAgICBpZDogb3B0aW9ucyAmJiBvcHRpb25zLmlkICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLmlkIDogaXNGdW5jdGlvbihldmVudCkgPyBldmVudC5uYW1lIDogZ2V0RXZlbnRUeXBlKGV2ZW50KVxuICB9O1xufVxuZnVuY3Rpb24gcmVzb2x2ZVNlbmQoYWN0aW9uLCBjdHgsIF9ldmVudCwgZGVsYXlzTWFwKSB7XG4gIHZhciBtZXRhID0ge1xuICAgIF9ldmVudDogX2V2ZW50XG4gIH07IC8vIFRPRE86IGhlbHBlciBmdW5jdGlvbiBmb3IgcmVzb2x2aW5nIEV4cHJcblxuICB2YXIgcmVzb2x2ZWRFdmVudCA9IHRvU0NYTUxFdmVudChpc0Z1bmN0aW9uKGFjdGlvbi5ldmVudCkgPyBhY3Rpb24uZXZlbnQoY3R4LCBfZXZlbnQuZGF0YSwgbWV0YSkgOiBhY3Rpb24uZXZlbnQpO1xuICB2YXIgcmVzb2x2ZWREZWxheTtcblxuICBpZiAoaXNTdHJpbmcoYWN0aW9uLmRlbGF5KSkge1xuICAgIHZhciBjb25maWdEZWxheSA9IGRlbGF5c01hcCAmJiBkZWxheXNNYXBbYWN0aW9uLmRlbGF5XTtcbiAgICByZXNvbHZlZERlbGF5ID0gaXNGdW5jdGlvbihjb25maWdEZWxheSkgPyBjb25maWdEZWxheShjdHgsIF9ldmVudC5kYXRhLCBtZXRhKSA6IGNvbmZpZ0RlbGF5O1xuICB9IGVsc2Uge1xuICAgIHJlc29sdmVkRGVsYXkgPSBpc0Z1bmN0aW9uKGFjdGlvbi5kZWxheSkgPyBhY3Rpb24uZGVsYXkoY3R4LCBfZXZlbnQuZGF0YSwgbWV0YSkgOiBhY3Rpb24uZGVsYXk7XG4gIH1cblxuICB2YXIgcmVzb2x2ZWRUYXJnZXQgPSBpc0Z1bmN0aW9uKGFjdGlvbi50bykgPyBhY3Rpb24udG8oY3R4LCBfZXZlbnQuZGF0YSwgbWV0YSkgOiBhY3Rpb24udG87XG4gIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgYWN0aW9uKSwge1xuICAgIHRvOiByZXNvbHZlZFRhcmdldCxcbiAgICBfZXZlbnQ6IHJlc29sdmVkRXZlbnQsXG4gICAgZXZlbnQ6IHJlc29sdmVkRXZlbnQuZGF0YSxcbiAgICBkZWxheTogcmVzb2x2ZWREZWxheVxuICB9KTtcbn1cbi8qKlxyXG4gKiBTZW5kcyBhbiBldmVudCB0byB0aGlzIG1hY2hpbmUncyBwYXJlbnQuXHJcbiAqXHJcbiAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQgdG8gc2VuZCB0byB0aGUgcGFyZW50IG1hY2hpbmUuXHJcbiAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgdG8gcGFzcyBpbnRvIHRoZSBzZW5kIGV2ZW50LlxyXG4gKi9cblxuZnVuY3Rpb24gc2VuZFBhcmVudChldmVudCwgb3B0aW9ucykge1xuICByZXR1cm4gc2VuZChldmVudCwgX19hc3NpZ24oX19hc3NpZ24oe30sIG9wdGlvbnMpLCB7XG4gICAgdG86IFNwZWNpYWxUYXJnZXRzLlBhcmVudFxuICB9KSk7XG59XG4vKipcclxuICogU2VuZHMgYW4gZXZlbnQgdG8gYW4gYWN0b3IuXHJcbiAqXHJcbiAqIEBwYXJhbSBhY3RvciBUaGUgYEFjdG9yUmVmYCB0byBzZW5kIHRoZSBldmVudCB0by5cclxuICogQHBhcmFtIGV2ZW50IFRoZSBldmVudCB0byBzZW5kLCBvciBhbiBleHByZXNzaW9uIHRoYXQgZXZhbHVhdGVzIHRvIHRoZSBldmVudCB0byBzZW5kXHJcbiAqIEBwYXJhbSBvcHRpb25zIFNlbmQgYWN0aW9uIG9wdGlvbnNcclxuICogQHJldHVybnMgQW4gWFN0YXRlIHNlbmQgYWN0aW9uIG9iamVjdFxyXG4gKi9cblxuZnVuY3Rpb24gc2VuZFRvKGFjdG9yLCBldmVudCwgb3B0aW9ucykge1xuICByZXR1cm4gc2VuZChldmVudCwgX19hc3NpZ24oX19hc3NpZ24oe30sIG9wdGlvbnMpLCB7XG4gICAgdG86IGFjdG9yXG4gIH0pKTtcbn1cbi8qKlxyXG4gKiBTZW5kcyBhbiB1cGRhdGUgZXZlbnQgdG8gdGhpcyBtYWNoaW5lJ3MgcGFyZW50LlxyXG4gKi9cblxuZnVuY3Rpb24gc2VuZFVwZGF0ZSgpIHtcbiAgcmV0dXJuIHNlbmRQYXJlbnQodXBkYXRlKTtcbn1cbi8qKlxyXG4gKiBTZW5kcyBhbiBldmVudCBiYWNrIHRvIHRoZSBzZW5kZXIgb2YgdGhlIG9yaWdpbmFsIGV2ZW50LlxyXG4gKlxyXG4gKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50IHRvIHNlbmQgYmFjayB0byB0aGUgc2VuZGVyXHJcbiAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgdG8gcGFzcyBpbnRvIHRoZSBzZW5kIGV2ZW50XHJcbiAqL1xuXG5mdW5jdGlvbiByZXNwb25kKGV2ZW50LCBvcHRpb25zKSB7XG4gIHJldHVybiBzZW5kKGV2ZW50LCBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgb3B0aW9ucyksIHtcbiAgICB0bzogZnVuY3Rpb24gKF8sIF9fLCBfYSkge1xuICAgICAgdmFyIF9ldmVudCA9IF9hLl9ldmVudDtcbiAgICAgIHJldHVybiBfZXZlbnQub3JpZ2luOyAvLyBUT0RPOiBoYW5kbGUgd2hlbiBfZXZlbnQub3JpZ2luIGlzIHVuZGVmaW5lZFxuICAgIH1cbiAgfSkpO1xufVxuXG52YXIgZGVmYXVsdExvZ0V4cHIgPSBmdW5jdGlvbiAoY29udGV4dCwgZXZlbnQpIHtcbiAgcmV0dXJuIHtcbiAgICBjb250ZXh0OiBjb250ZXh0LFxuICAgIGV2ZW50OiBldmVudFxuICB9O1xufTtcbi8qKlxyXG4gKlxyXG4gKiBAcGFyYW0gZXhwciBUaGUgZXhwcmVzc2lvbiBmdW5jdGlvbiB0byBldmFsdWF0ZSB3aGljaCB3aWxsIGJlIGxvZ2dlZC5cclxuICogIFRha2VzIGluIDIgYXJndW1lbnRzOlxyXG4gKiAgLSBgY3R4YCAtIHRoZSBjdXJyZW50IHN0YXRlIGNvbnRleHRcclxuICogIC0gYGV2ZW50YCAtIHRoZSBldmVudCB0aGF0IGNhdXNlZCB0aGlzIGFjdGlvbiB0byBiZSBleGVjdXRlZC5cclxuICogQHBhcmFtIGxhYmVsIFRoZSBsYWJlbCB0byBnaXZlIHRvIHRoZSBsb2dnZWQgZXhwcmVzc2lvbi5cclxuICovXG5cblxuZnVuY3Rpb24gbG9nKGV4cHIsIGxhYmVsKSB7XG4gIGlmIChleHByID09PSB2b2lkIDApIHtcbiAgICBleHByID0gZGVmYXVsdExvZ0V4cHI7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHR5cGU6IGxvZyQxLFxuICAgIGxhYmVsOiBsYWJlbCxcbiAgICBleHByOiBleHByXG4gIH07XG59XG52YXIgcmVzb2x2ZUxvZyA9IGZ1bmN0aW9uIChhY3Rpb24sIGN0eCwgX2V2ZW50KSB7XG4gIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgYWN0aW9uKSwge1xuICAgIHZhbHVlOiBpc1N0cmluZyhhY3Rpb24uZXhwcikgPyBhY3Rpb24uZXhwciA6IGFjdGlvbi5leHByKGN0eCwgX2V2ZW50LmRhdGEsIHtcbiAgICAgIF9ldmVudDogX2V2ZW50XG4gICAgfSlcbiAgfSk7XG59O1xuLyoqXHJcbiAqIENhbmNlbHMgYW4gaW4tZmxpZ2h0IGBzZW5kKC4uLilgIGFjdGlvbi4gQSBjYW5jZWxlZCBzZW50IGFjdGlvbiB3aWxsIG5vdFxyXG4gKiBiZSBleGVjdXRlZCwgbm9yIHdpbGwgaXRzIGV2ZW50IGJlIHNlbnQsIHVubGVzcyBpdCBoYXMgYWxyZWFkeSBiZWVuIHNlbnRcclxuICogKGUuZy4sIGlmIGBjYW5jZWwoLi4uKWAgaXMgY2FsbGVkIGFmdGVyIHRoZSBgc2VuZCguLi4pYCBhY3Rpb24ncyBgZGVsYXlgKS5cclxuICpcclxuICogQHBhcmFtIHNlbmRJZCBUaGUgYGlkYCBvZiB0aGUgYHNlbmQoLi4uKWAgYWN0aW9uIHRvIGNhbmNlbC5cclxuICovXG5cbnZhciBjYW5jZWwgPSBmdW5jdGlvbiAoc2VuZElkKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogY2FuY2VsJDEsXG4gICAgc2VuZElkOiBzZW5kSWRcbiAgfTtcbn07XG4vKipcclxuICogU3RhcnRzIGFuIGFjdGl2aXR5LlxyXG4gKlxyXG4gKiBAcGFyYW0gYWN0aXZpdHkgVGhlIGFjdGl2aXR5IHRvIHN0YXJ0LlxyXG4gKi9cblxuZnVuY3Rpb24gc3RhcnQoYWN0aXZpdHkpIHtcbiAgdmFyIGFjdGl2aXR5RGVmID0gdG9BY3Rpdml0eURlZmluaXRpb24oYWN0aXZpdHkpO1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLlN0YXJ0LFxuICAgIGFjdGl2aXR5OiBhY3Rpdml0eURlZixcbiAgICBleGVjOiB1bmRlZmluZWRcbiAgfTtcbn1cbi8qKlxyXG4gKiBTdG9wcyBhbiBhY3Rpdml0eS5cclxuICpcclxuICogQHBhcmFtIGFjdG9yUmVmIFRoZSBhY3Rpdml0eSB0byBzdG9wLlxyXG4gKi9cblxuZnVuY3Rpb24gc3RvcChhY3RvclJlZikge1xuICB2YXIgYWN0aXZpdHkgPSBpc0Z1bmN0aW9uKGFjdG9yUmVmKSA/IGFjdG9yUmVmIDogdG9BY3Rpdml0eURlZmluaXRpb24oYWN0b3JSZWYpO1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLlN0b3AsXG4gICAgYWN0aXZpdHk6IGFjdGl2aXR5LFxuICAgIGV4ZWM6IHVuZGVmaW5lZFxuICB9O1xufVxuZnVuY3Rpb24gcmVzb2x2ZVN0b3AoYWN0aW9uLCBjb250ZXh0LCBfZXZlbnQpIHtcbiAgdmFyIGFjdG9yUmVmT3JTdHJpbmcgPSBpc0Z1bmN0aW9uKGFjdGlvbi5hY3Rpdml0eSkgPyBhY3Rpb24uYWN0aXZpdHkoY29udGV4dCwgX2V2ZW50LmRhdGEpIDogYWN0aW9uLmFjdGl2aXR5O1xuICB2YXIgcmVzb2x2ZWRBY3RvclJlZiA9IHR5cGVvZiBhY3RvclJlZk9yU3RyaW5nID09PSAnc3RyaW5nJyA/IHtcbiAgICBpZDogYWN0b3JSZWZPclN0cmluZ1xuICB9IDogYWN0b3JSZWZPclN0cmluZztcbiAgdmFyIGFjdGlvbk9iamVjdCA9IHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5TdG9wLFxuICAgIGFjdGl2aXR5OiByZXNvbHZlZEFjdG9yUmVmXG4gIH07XG4gIHJldHVybiBhY3Rpb25PYmplY3Q7XG59XG4vKipcclxuICogVXBkYXRlcyB0aGUgY3VycmVudCBjb250ZXh0IG9mIHRoZSBtYWNoaW5lLlxyXG4gKlxyXG4gKiBAcGFyYW0gYXNzaWdubWVudCBBbiBvYmplY3QgdGhhdCByZXByZXNlbnRzIHRoZSBwYXJ0aWFsIGNvbnRleHQgdG8gdXBkYXRlLlxyXG4gKi9cblxudmFyIGFzc2lnbiA9IGZ1bmN0aW9uIChhc3NpZ25tZW50KSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogYXNzaWduJDEsXG4gICAgYXNzaWdubWVudDogYXNzaWdubWVudFxuICB9O1xufTtcbmZ1bmN0aW9uIGlzQWN0aW9uT2JqZWN0KGFjdGlvbikge1xuICByZXR1cm4gdHlwZW9mIGFjdGlvbiA9PT0gJ29iamVjdCcgJiYgJ3R5cGUnIGluIGFjdGlvbjtcbn1cbi8qKlxyXG4gKiBSZXR1cm5zIGFuIGV2ZW50IHR5cGUgdGhhdCByZXByZXNlbnRzIGFuIGltcGxpY2l0IGV2ZW50IHRoYXRcclxuICogaXMgc2VudCBhZnRlciB0aGUgc3BlY2lmaWVkIGBkZWxheWAuXHJcbiAqXHJcbiAqIEBwYXJhbSBkZWxheVJlZiBUaGUgZGVsYXkgaW4gbWlsbGlzZWNvbmRzXHJcbiAqIEBwYXJhbSBpZCBUaGUgc3RhdGUgbm9kZSBJRCB3aGVyZSB0aGlzIGV2ZW50IGlzIGhhbmRsZWRcclxuICovXG5cbmZ1bmN0aW9uIGFmdGVyKGRlbGF5UmVmLCBpZCkge1xuICB2YXIgaWRTdWZmaXggPSBpZCA/IFwiI1wiLmNvbmNhdChpZCkgOiAnJztcbiAgcmV0dXJuIFwiXCIuY29uY2F0KEFjdGlvblR5cGVzLkFmdGVyLCBcIihcIikuY29uY2F0KGRlbGF5UmVmLCBcIilcIikuY29uY2F0KGlkU3VmZml4KTtcbn1cbi8qKlxyXG4gKiBSZXR1cm5zIGFuIGV2ZW50IHRoYXQgcmVwcmVzZW50cyB0aGF0IGEgZmluYWwgc3RhdGUgbm9kZVxyXG4gKiBoYXMgYmVlbiByZWFjaGVkIGluIHRoZSBwYXJlbnQgc3RhdGUgbm9kZS5cclxuICpcclxuICogQHBhcmFtIGlkIFRoZSBmaW5hbCBzdGF0ZSBub2RlJ3MgcGFyZW50IHN0YXRlIG5vZGUgYGlkYFxyXG4gKiBAcGFyYW0gZGF0YSBUaGUgZGF0YSB0byBwYXNzIGludG8gdGhlIGV2ZW50XHJcbiAqL1xuXG5mdW5jdGlvbiBkb25lKGlkLCBkYXRhKSB7XG4gIHZhciB0eXBlID0gXCJcIi5jb25jYXQoQWN0aW9uVHlwZXMuRG9uZVN0YXRlLCBcIi5cIikuY29uY2F0KGlkKTtcbiAgdmFyIGV2ZW50T2JqZWN0ID0ge1xuICAgIHR5cGU6IHR5cGUsXG4gICAgZGF0YTogZGF0YVxuICB9O1xuXG4gIGV2ZW50T2JqZWN0LnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0eXBlO1xuICB9O1xuXG4gIHJldHVybiBldmVudE9iamVjdDtcbn1cbi8qKlxyXG4gKiBSZXR1cm5zIGFuIGV2ZW50IHRoYXQgcmVwcmVzZW50cyB0aGF0IGFuIGludm9rZWQgc2VydmljZSBoYXMgdGVybWluYXRlZC5cclxuICpcclxuICogQW4gaW52b2tlZCBzZXJ2aWNlIGlzIHRlcm1pbmF0ZWQgd2hlbiBpdCBoYXMgcmVhY2hlZCBhIHRvcC1sZXZlbCBmaW5hbCBzdGF0ZSBub2RlLFxyXG4gKiBidXQgbm90IHdoZW4gaXQgaXMgY2FuY2VsZWQuXHJcbiAqXHJcbiAqIEBwYXJhbSBpZCBUaGUgZmluYWwgc3RhdGUgbm9kZSBJRFxyXG4gKiBAcGFyYW0gZGF0YSBUaGUgZGF0YSB0byBwYXNzIGludG8gdGhlIGV2ZW50XHJcbiAqL1xuXG5mdW5jdGlvbiBkb25lSW52b2tlKGlkLCBkYXRhKSB7XG4gIHZhciB0eXBlID0gXCJcIi5jb25jYXQoQWN0aW9uVHlwZXMuRG9uZUludm9rZSwgXCIuXCIpLmNvbmNhdChpZCk7XG4gIHZhciBldmVudE9iamVjdCA9IHtcbiAgICB0eXBlOiB0eXBlLFxuICAgIGRhdGE6IGRhdGFcbiAgfTtcblxuICBldmVudE9iamVjdC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdHlwZTtcbiAgfTtcblxuICByZXR1cm4gZXZlbnRPYmplY3Q7XG59XG5mdW5jdGlvbiBlcnJvcihpZCwgZGF0YSkge1xuICB2YXIgdHlwZSA9IFwiXCIuY29uY2F0KEFjdGlvblR5cGVzLkVycm9yUGxhdGZvcm0sIFwiLlwiKS5jb25jYXQoaWQpO1xuICB2YXIgZXZlbnRPYmplY3QgPSB7XG4gICAgdHlwZTogdHlwZSxcbiAgICBkYXRhOiBkYXRhXG4gIH07XG5cbiAgZXZlbnRPYmplY3QudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHR5cGU7XG4gIH07XG5cbiAgcmV0dXJuIGV2ZW50T2JqZWN0O1xufVxuZnVuY3Rpb24gcHVyZShnZXRBY3Rpb25zKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuUHVyZSxcbiAgICBnZXQ6IGdldEFjdGlvbnNcbiAgfTtcbn1cbi8qKlxyXG4gKiBGb3J3YXJkcyAoc2VuZHMpIGFuIGV2ZW50IHRvIGEgc3BlY2lmaWVkIHNlcnZpY2UuXHJcbiAqXHJcbiAqIEBwYXJhbSB0YXJnZXQgVGhlIHRhcmdldCBzZXJ2aWNlIHRvIGZvcndhcmQgdGhlIGV2ZW50IHRvLlxyXG4gKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIHRvIHBhc3MgaW50byB0aGUgc2VuZCBhY3Rpb24gY3JlYXRvci5cclxuICovXG5cbmZ1bmN0aW9uIGZvcndhcmRUbyh0YXJnZXQsIG9wdGlvbnMpIHtcbiAgaWYgKCFJU19QUk9EVUNUSU9OICYmICghdGFyZ2V0IHx8IHR5cGVvZiB0YXJnZXQgPT09ICdmdW5jdGlvbicpKSB7XG4gICAgdmFyIG9yaWdpbmFsVGFyZ2V0XzEgPSB0YXJnZXQ7XG5cbiAgICB0YXJnZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgYXJncyA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICBhcmdzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICB9XG5cbiAgICAgIHZhciByZXNvbHZlZFRhcmdldCA9IHR5cGVvZiBvcmlnaW5hbFRhcmdldF8xID09PSAnZnVuY3Rpb24nID8gb3JpZ2luYWxUYXJnZXRfMS5hcHBseSh2b2lkIDAsIF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChhcmdzKSwgZmFsc2UpKSA6IG9yaWdpbmFsVGFyZ2V0XzE7XG5cbiAgICAgIGlmICghcmVzb2x2ZWRUYXJnZXQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQXR0ZW1wdGVkIHRvIGZvcndhcmQgZXZlbnQgdG8gdW5kZWZpbmVkIGFjdG9yLiBUaGlzIHJpc2tzIGFuIGluZmluaXRlIGxvb3AgaW4gdGhlIHNlbmRlci5cIik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXNvbHZlZFRhcmdldDtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHNlbmQoZnVuY3Rpb24gKF8sIGV2ZW50KSB7XG4gICAgcmV0dXJuIGV2ZW50O1xuICB9LCBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgb3B0aW9ucyksIHtcbiAgICB0bzogdGFyZ2V0XG4gIH0pKTtcbn1cbi8qKlxyXG4gKiBFc2NhbGF0ZXMgYW4gZXJyb3IgYnkgc2VuZGluZyBpdCBhcyBhbiBldmVudCB0byB0aGlzIG1hY2hpbmUncyBwYXJlbnQuXHJcbiAqXHJcbiAqIEBwYXJhbSBlcnJvckRhdGEgVGhlIGVycm9yIGRhdGEgdG8gc2VuZCwgb3IgdGhlIGV4cHJlc3Npb24gZnVuY3Rpb24gdGhhdFxyXG4gKiB0YWtlcyBpbiB0aGUgYGNvbnRleHRgLCBgZXZlbnRgLCBhbmQgYG1ldGFgLCBhbmQgcmV0dXJucyB0aGUgZXJyb3IgZGF0YSB0byBzZW5kLlxyXG4gKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIHRvIHBhc3MgaW50byB0aGUgc2VuZCBhY3Rpb24gY3JlYXRvci5cclxuICovXG5cbmZ1bmN0aW9uIGVzY2FsYXRlKGVycm9yRGF0YSwgb3B0aW9ucykge1xuICByZXR1cm4gc2VuZFBhcmVudChmdW5jdGlvbiAoY29udGV4dCwgZXZlbnQsIG1ldGEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogZXJyb3IkMSxcbiAgICAgIGRhdGE6IGlzRnVuY3Rpb24oZXJyb3JEYXRhKSA/IGVycm9yRGF0YShjb250ZXh0LCBldmVudCwgbWV0YSkgOiBlcnJvckRhdGFcbiAgICB9O1xuICB9LCBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgb3B0aW9ucyksIHtcbiAgICB0bzogU3BlY2lhbFRhcmdldHMuUGFyZW50XG4gIH0pKTtcbn1cbmZ1bmN0aW9uIGNob29zZShjb25kcykge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLkNob29zZSxcbiAgICBjb25kczogY29uZHNcbiAgfTtcbn1cblxudmFyIHBsdWNrQXNzaWducyA9IGZ1bmN0aW9uIChhY3Rpb25CbG9ja3MpIHtcbiAgdmFyIGVfMSwgX2E7XG5cbiAgdmFyIGFzc2lnbkFjdGlvbnMgPSBbXTtcblxuICB0cnkge1xuICAgIGZvciAodmFyIGFjdGlvbkJsb2Nrc18xID0gX192YWx1ZXMoYWN0aW9uQmxvY2tzKSwgYWN0aW9uQmxvY2tzXzFfMSA9IGFjdGlvbkJsb2Nrc18xLm5leHQoKTsgIWFjdGlvbkJsb2Nrc18xXzEuZG9uZTsgYWN0aW9uQmxvY2tzXzFfMSA9IGFjdGlvbkJsb2Nrc18xLm5leHQoKSkge1xuICAgICAgdmFyIGJsb2NrID0gYWN0aW9uQmxvY2tzXzFfMS52YWx1ZTtcbiAgICAgIHZhciBpID0gMDtcblxuICAgICAgd2hpbGUgKGkgPCBibG9jay5hY3Rpb25zLmxlbmd0aCkge1xuICAgICAgICBpZiAoYmxvY2suYWN0aW9uc1tpXS50eXBlID09PSBhc3NpZ24kMSkge1xuICAgICAgICAgIGFzc2lnbkFjdGlvbnMucHVzaChibG9jay5hY3Rpb25zW2ldKTtcbiAgICAgICAgICBibG9jay5hY3Rpb25zLnNwbGljZShpLCAxKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGkrKztcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVfMV8xKSB7XG4gICAgZV8xID0ge1xuICAgICAgZXJyb3I6IGVfMV8xXG4gICAgfTtcbiAgfSBmaW5hbGx5IHtcbiAgICB0cnkge1xuICAgICAgaWYgKGFjdGlvbkJsb2Nrc18xXzEgJiYgIWFjdGlvbkJsb2Nrc18xXzEuZG9uZSAmJiAoX2EgPSBhY3Rpb25CbG9ja3NfMS5yZXR1cm4pKSBfYS5jYWxsKGFjdGlvbkJsb2Nrc18xKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhc3NpZ25BY3Rpb25zO1xufTtcblxuZnVuY3Rpb24gcmVzb2x2ZUFjdGlvbnMobWFjaGluZSwgY3VycmVudFN0YXRlLCBjdXJyZW50Q29udGV4dCwgX2V2ZW50LCBhY3Rpb25CbG9ja3MsIHByZWRpY3RhYmxlRXhlYywgcHJlc2VydmVBY3Rpb25PcmRlcikge1xuICBpZiAocHJlc2VydmVBY3Rpb25PcmRlciA9PT0gdm9pZCAwKSB7XG4gICAgcHJlc2VydmVBY3Rpb25PcmRlciA9IGZhbHNlO1xuICB9XG5cbiAgdmFyIGFzc2lnbkFjdGlvbnMgPSBwcmVzZXJ2ZUFjdGlvbk9yZGVyID8gW10gOiBwbHVja0Fzc2lnbnMoYWN0aW9uQmxvY2tzKTtcbiAgdmFyIHVwZGF0ZWRDb250ZXh0ID0gYXNzaWduQWN0aW9ucy5sZW5ndGggPyB1cGRhdGVDb250ZXh0KGN1cnJlbnRDb250ZXh0LCBfZXZlbnQsIGFzc2lnbkFjdGlvbnMsIGN1cnJlbnRTdGF0ZSkgOiBjdXJyZW50Q29udGV4dDtcbiAgdmFyIHByZXNlcnZlZENvbnRleHRzID0gcHJlc2VydmVBY3Rpb25PcmRlciA/IFtjdXJyZW50Q29udGV4dF0gOiB1bmRlZmluZWQ7XG4gIHZhciBkZWZlcnJlZFRvQmxvY2tFbmQgPSBbXTtcblxuICBmdW5jdGlvbiBoYW5kbGVBY3Rpb24oYmxvY2tUeXBlLCBhY3Rpb25PYmplY3QpIHtcbiAgICB2YXIgX2E7XG5cbiAgICBzd2l0Y2ggKGFjdGlvbk9iamVjdC50eXBlKSB7XG4gICAgICBjYXNlIHJhaXNlJDE6XG4gICAgICAgIHtcbiAgICAgICAgICB2YXIgcmFpc2VkQWN0aW9uID0gcmVzb2x2ZVJhaXNlKGFjdGlvbk9iamVjdCwgdXBkYXRlZENvbnRleHQsIF9ldmVudCwgbWFjaGluZS5vcHRpb25zLmRlbGF5cyk7XG5cbiAgICAgICAgICBpZiAocHJlZGljdGFibGVFeGVjICYmIHR5cGVvZiByYWlzZWRBY3Rpb24uZGVsYXkgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBwcmVkaWN0YWJsZUV4ZWMocmFpc2VkQWN0aW9uLCB1cGRhdGVkQ29udGV4dCwgX2V2ZW50KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gcmFpc2VkQWN0aW9uO1xuICAgICAgICB9XG5cbiAgICAgIGNhc2Ugc2VuZCQxOlxuICAgICAgICB2YXIgc2VuZEFjdGlvbiA9IHJlc29sdmVTZW5kKGFjdGlvbk9iamVjdCwgdXBkYXRlZENvbnRleHQsIF9ldmVudCwgbWFjaGluZS5vcHRpb25zLmRlbGF5cyk7IC8vIFRPRE86IGZpeCBBY3Rpb25UeXBlcy5Jbml0XG5cbiAgICAgICAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgICAgICAgdmFyIGNvbmZpZ3VyZWREZWxheSA9IGFjdGlvbk9iamVjdC5kZWxheTsgLy8gd2FybiBhZnRlciByZXNvbHZpbmcgYXMgd2UgY2FuIGNyZWF0ZSBiZXR0ZXIgY29udGV4dHVhbCBtZXNzYWdlIGhlcmVcblxuICAgICAgICAgIHdhcm4oIWlzU3RyaW5nKGNvbmZpZ3VyZWREZWxheSkgfHwgdHlwZW9mIHNlbmRBY3Rpb24uZGVsYXkgPT09ICdudW1iZXInLCAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICAgICAgXCJObyBkZWxheSByZWZlcmVuY2UgZm9yIGRlbGF5IGV4cHJlc3Npb24gJ1wiLmNvbmNhdChjb25maWd1cmVkRGVsYXksIFwiJyB3YXMgZm91bmQgb24gbWFjaGluZSAnXCIpLmNvbmNhdChtYWNoaW5lLmlkLCBcIidcIikpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHByZWRpY3RhYmxlRXhlYyAmJiBzZW5kQWN0aW9uLnRvICE9PSBTcGVjaWFsVGFyZ2V0cy5JbnRlcm5hbCkge1xuICAgICAgICAgIGlmIChibG9ja1R5cGUgPT09ICdlbnRyeScpIHtcbiAgICAgICAgICAgIGRlZmVycmVkVG9CbG9ja0VuZC5wdXNoKHNlbmRBY3Rpb24pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcmVkaWN0YWJsZUV4ZWMoc2VuZEFjdGlvbiwgdXBkYXRlZENvbnRleHQsIF9ldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlbmRBY3Rpb247XG5cbiAgICAgIGNhc2UgbG9nJDE6XG4gICAgICAgIHtcbiAgICAgICAgICB2YXIgcmVzb2x2ZWQgPSByZXNvbHZlTG9nKGFjdGlvbk9iamVjdCwgdXBkYXRlZENvbnRleHQsIF9ldmVudCk7XG4gICAgICAgICAgcHJlZGljdGFibGVFeGVjID09PSBudWxsIHx8IHByZWRpY3RhYmxlRXhlYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogcHJlZGljdGFibGVFeGVjKHJlc29sdmVkLCB1cGRhdGVkQ29udGV4dCwgX2V2ZW50KTtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZWQ7XG4gICAgICAgIH1cblxuICAgICAgY2FzZSBjaG9vc2UkMTpcbiAgICAgICAge1xuICAgICAgICAgIHZhciBjaG9vc2VBY3Rpb24gPSBhY3Rpb25PYmplY3Q7XG4gICAgICAgICAgdmFyIG1hdGNoZWRBY3Rpb25zID0gKF9hID0gY2hvb3NlQWN0aW9uLmNvbmRzLmZpbmQoZnVuY3Rpb24gKGNvbmRpdGlvbikge1xuICAgICAgICAgICAgdmFyIGd1YXJkID0gdG9HdWFyZChjb25kaXRpb24uY29uZCwgbWFjaGluZS5vcHRpb25zLmd1YXJkcyk7XG4gICAgICAgICAgICByZXR1cm4gIWd1YXJkIHx8IGV2YWx1YXRlR3VhcmQobWFjaGluZSwgZ3VhcmQsIHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQsICFwcmVkaWN0YWJsZUV4ZWMgPyBjdXJyZW50U3RhdGUgOiB1bmRlZmluZWQpO1xuICAgICAgICAgIH0pKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuYWN0aW9ucztcblxuICAgICAgICAgIGlmICghbWF0Y2hlZEFjdGlvbnMpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgX2IgPSBfX3JlYWQocmVzb2x2ZUFjdGlvbnMobWFjaGluZSwgY3VycmVudFN0YXRlLCB1cGRhdGVkQ29udGV4dCwgX2V2ZW50LCBbe1xuICAgICAgICAgICAgdHlwZTogYmxvY2tUeXBlLFxuICAgICAgICAgICAgYWN0aW9uczogdG9BY3Rpb25PYmplY3RzKHRvQXJyYXkobWF0Y2hlZEFjdGlvbnMpLCBtYWNoaW5lLm9wdGlvbnMuYWN0aW9ucylcbiAgICAgICAgICB9XSwgcHJlZGljdGFibGVFeGVjLCBwcmVzZXJ2ZUFjdGlvbk9yZGVyKSwgMiksXG4gICAgICAgICAgICAgIHJlc29sdmVkQWN0aW9uc0Zyb21DaG9vc2UgPSBfYlswXSxcbiAgICAgICAgICAgICAgcmVzb2x2ZWRDb250ZXh0RnJvbUNob29zZSA9IF9iWzFdO1xuXG4gICAgICAgICAgdXBkYXRlZENvbnRleHQgPSByZXNvbHZlZENvbnRleHRGcm9tQ2hvb3NlO1xuICAgICAgICAgIHByZXNlcnZlZENvbnRleHRzID09PSBudWxsIHx8IHByZXNlcnZlZENvbnRleHRzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwcmVzZXJ2ZWRDb250ZXh0cy5wdXNoKHVwZGF0ZWRDb250ZXh0KTtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZWRBY3Rpb25zRnJvbUNob29zZTtcbiAgICAgICAgfVxuXG4gICAgICBjYXNlIHB1cmUkMTpcbiAgICAgICAge1xuICAgICAgICAgIHZhciBtYXRjaGVkQWN0aW9ucyA9IGFjdGlvbk9iamVjdC5nZXQodXBkYXRlZENvbnRleHQsIF9ldmVudC5kYXRhKTtcblxuICAgICAgICAgIGlmICghbWF0Y2hlZEFjdGlvbnMpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgX2MgPSBfX3JlYWQocmVzb2x2ZUFjdGlvbnMobWFjaGluZSwgY3VycmVudFN0YXRlLCB1cGRhdGVkQ29udGV4dCwgX2V2ZW50LCBbe1xuICAgICAgICAgICAgdHlwZTogYmxvY2tUeXBlLFxuICAgICAgICAgICAgYWN0aW9uczogdG9BY3Rpb25PYmplY3RzKHRvQXJyYXkobWF0Y2hlZEFjdGlvbnMpLCBtYWNoaW5lLm9wdGlvbnMuYWN0aW9ucylcbiAgICAgICAgICB9XSwgcHJlZGljdGFibGVFeGVjLCBwcmVzZXJ2ZUFjdGlvbk9yZGVyKSwgMiksXG4gICAgICAgICAgICAgIHJlc29sdmVkQWN0aW9uc0Zyb21QdXJlID0gX2NbMF0sXG4gICAgICAgICAgICAgIHJlc29sdmVkQ29udGV4dCA9IF9jWzFdO1xuXG4gICAgICAgICAgdXBkYXRlZENvbnRleHQgPSByZXNvbHZlZENvbnRleHQ7XG4gICAgICAgICAgcHJlc2VydmVkQ29udGV4dHMgPT09IG51bGwgfHwgcHJlc2VydmVkQ29udGV4dHMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHByZXNlcnZlZENvbnRleHRzLnB1c2godXBkYXRlZENvbnRleHQpO1xuICAgICAgICAgIHJldHVybiByZXNvbHZlZEFjdGlvbnNGcm9tUHVyZTtcbiAgICAgICAgfVxuXG4gICAgICBjYXNlIHN0b3AkMTpcbiAgICAgICAge1xuICAgICAgICAgIHZhciByZXNvbHZlZCA9IHJlc29sdmVTdG9wKGFjdGlvbk9iamVjdCwgdXBkYXRlZENvbnRleHQsIF9ldmVudCk7XG4gICAgICAgICAgcHJlZGljdGFibGVFeGVjID09PSBudWxsIHx8IHByZWRpY3RhYmxlRXhlYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogcHJlZGljdGFibGVFeGVjKHJlc29sdmVkLCBjdXJyZW50Q29udGV4dCwgX2V2ZW50KTtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZWQ7XG4gICAgICAgIH1cblxuICAgICAgY2FzZSBhc3NpZ24kMTpcbiAgICAgICAge1xuICAgICAgICAgIHVwZGF0ZWRDb250ZXh0ID0gdXBkYXRlQ29udGV4dCh1cGRhdGVkQ29udGV4dCwgX2V2ZW50LCBbYWN0aW9uT2JqZWN0XSwgIXByZWRpY3RhYmxlRXhlYyA/IGN1cnJlbnRTdGF0ZSA6IHVuZGVmaW5lZCk7XG4gICAgICAgICAgcHJlc2VydmVkQ29udGV4dHMgPT09IG51bGwgfHwgcHJlc2VydmVkQ29udGV4dHMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHByZXNlcnZlZENvbnRleHRzLnB1c2godXBkYXRlZENvbnRleHQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHZhciByZXNvbHZlZEFjdGlvbk9iamVjdCA9IHRvQWN0aW9uT2JqZWN0KGFjdGlvbk9iamVjdCwgbWFjaGluZS5vcHRpb25zLmFjdGlvbnMpO1xuICAgICAgICB2YXIgZXhlY18xID0gcmVzb2x2ZWRBY3Rpb25PYmplY3QuZXhlYztcblxuICAgICAgICBpZiAocHJlZGljdGFibGVFeGVjKSB7XG4gICAgICAgICAgcHJlZGljdGFibGVFeGVjKHJlc29sdmVkQWN0aW9uT2JqZWN0LCB1cGRhdGVkQ29udGV4dCwgX2V2ZW50KTtcbiAgICAgICAgfSBlbHNlIGlmIChleGVjXzEgJiYgcHJlc2VydmVkQ29udGV4dHMpIHtcbiAgICAgICAgICB2YXIgY29udGV4dEluZGV4XzEgPSBwcmVzZXJ2ZWRDb250ZXh0cy5sZW5ndGggLSAxO1xuXG4gICAgICAgICAgdmFyIHdyYXBwZWQgPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgcmVzb2x2ZWRBY3Rpb25PYmplY3QpLCB7XG4gICAgICAgICAgICBleGVjOiBmdW5jdGlvbiAoX2N0eCkge1xuICAgICAgICAgICAgICB2YXIgYXJncyA9IFtdO1xuXG4gICAgICAgICAgICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgYXJnc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGV4ZWNfMS5hcHBseSh2b2lkIDAsIF9fc3ByZWFkQXJyYXkoW3ByZXNlcnZlZENvbnRleHRzW2NvbnRleHRJbmRleF8xXV0sIF9fcmVhZChhcmdzKSwgZmFsc2UpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJlc29sdmVkQWN0aW9uT2JqZWN0ID0gd3JhcHBlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXNvbHZlZEFjdGlvbk9iamVjdDtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwcm9jZXNzQmxvY2soYmxvY2spIHtcbiAgICB2YXIgZV8yLCBfYTtcblxuICAgIHZhciByZXNvbHZlZEFjdGlvbnMgPSBbXTtcblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBfYiA9IF9fdmFsdWVzKGJsb2NrLmFjdGlvbnMpLCBfYyA9IF9iLm5leHQoKTsgIV9jLmRvbmU7IF9jID0gX2IubmV4dCgpKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBfYy52YWx1ZTtcbiAgICAgICAgdmFyIHJlc29sdmVkID0gaGFuZGxlQWN0aW9uKGJsb2NrLnR5cGUsIGFjdGlvbik7XG5cbiAgICAgICAgaWYgKHJlc29sdmVkKSB7XG4gICAgICAgICAgcmVzb2x2ZWRBY3Rpb25zID0gcmVzb2x2ZWRBY3Rpb25zLmNvbmNhdChyZXNvbHZlZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzJfMSkge1xuICAgICAgZV8yID0ge1xuICAgICAgICBlcnJvcjogZV8yXzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfYyAmJiAhX2MuZG9uZSAmJiAoX2EgPSBfYi5yZXR1cm4pKSBfYS5jYWxsKF9iKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzIpIHRocm93IGVfMi5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkZWZlcnJlZFRvQmxvY2tFbmQuZm9yRWFjaChmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICBwcmVkaWN0YWJsZUV4ZWMoYWN0aW9uLCB1cGRhdGVkQ29udGV4dCwgX2V2ZW50KTtcbiAgICB9KTtcbiAgICBkZWZlcnJlZFRvQmxvY2tFbmQubGVuZ3RoID0gMDtcbiAgICByZXR1cm4gcmVzb2x2ZWRBY3Rpb25zO1xuICB9XG5cbiAgdmFyIHJlc29sdmVkQWN0aW9ucyA9IGZsYXR0ZW4oYWN0aW9uQmxvY2tzLm1hcChwcm9jZXNzQmxvY2spKTtcbiAgcmV0dXJuIFtyZXNvbHZlZEFjdGlvbnMsIHVwZGF0ZWRDb250ZXh0XTtcbn1cblxuZXhwb3J0IHsgYWZ0ZXIsIGFzc2lnbiwgY2FuY2VsLCBjaG9vc2UsIGRvbmUsIGRvbmVJbnZva2UsIGVycm9yLCBlc2NhbGF0ZSwgZm9yd2FyZFRvLCBnZXRBY3Rpb25GdW5jdGlvbiwgaW5pdEV2ZW50LCBpc0FjdGlvbk9iamVjdCwgbG9nLCBwdXJlLCByYWlzZSwgcmVzb2x2ZUFjdGlvbnMsIHJlc29sdmVMb2csIHJlc29sdmVSYWlzZSwgcmVzb2x2ZVNlbmQsIHJlc29sdmVTdG9wLCByZXNwb25kLCBzZW5kLCBzZW5kUGFyZW50LCBzZW5kVG8sIHNlbmRVcGRhdGUsIHN0YXJ0LCBzdG9wLCB0b0FjdGlvbk9iamVjdCwgdG9BY3Rpb25PYmplY3RzLCB0b0FjdGl2aXR5RGVmaW5pdGlvbiB9O1xuIiwiaW1wb3J0IHsgZXJyb3IsIGRvbmVJbnZva2UgfSBmcm9tICcuL2FjdGlvbnMuanMnO1xuaW1wb3J0IHsgdG9BY3RvclJlZiB9IGZyb20gJy4vQWN0b3IuanMnO1xuaW1wb3J0IHsgdG9PYnNlcnZlciB9IGZyb20gJy4vdXRpbHMuanMnO1xuXG4vKipcclxuICogUmV0dXJucyBhbiBhY3RvciBiZWhhdmlvciBmcm9tIGEgcmVkdWNlciBhbmQgaXRzIGluaXRpYWwgc3RhdGUuXHJcbiAqXHJcbiAqIEBwYXJhbSB0cmFuc2l0aW9uIFRoZSBwdXJlIHJlZHVjZXIgdGhhdCByZXR1cm5zIHRoZSBuZXh0IHN0YXRlIGdpdmVuIHRoZSBjdXJyZW50IHN0YXRlIGFuZCBldmVudC5cclxuICogQHBhcmFtIGluaXRpYWxTdGF0ZSBUaGUgaW5pdGlhbCBzdGF0ZSBvZiB0aGUgcmVkdWNlci5cclxuICogQHJldHVybnMgQW4gYWN0b3IgYmVoYXZpb3JcclxuICovXG5cbmZ1bmN0aW9uIGZyb21SZWR1Y2VyKHRyYW5zaXRpb24sIGluaXRpYWxTdGF0ZSkge1xuICByZXR1cm4ge1xuICAgIHRyYW5zaXRpb246IHRyYW5zaXRpb24sXG4gICAgaW5pdGlhbFN0YXRlOiBpbml0aWFsU3RhdGVcbiAgfTtcbn1cbmZ1bmN0aW9uIGZyb21Qcm9taXNlKHByb21pc2VGbikge1xuICB2YXIgaW5pdGlhbFN0YXRlID0ge1xuICAgIGVycm9yOiB1bmRlZmluZWQsXG4gICAgZGF0YTogdW5kZWZpbmVkLFxuICAgIHN0YXR1czogJ3BlbmRpbmcnXG4gIH07XG4gIHJldHVybiB7XG4gICAgdHJhbnNpdGlvbjogZnVuY3Rpb24gKHN0YXRlLCBldmVudCwgX2EpIHtcbiAgICAgIHZhciBwYXJlbnQgPSBfYS5wYXJlbnQsXG4gICAgICAgICAgaWQgPSBfYS5pZCxcbiAgICAgICAgICBvYnNlcnZlcnMgPSBfYS5vYnNlcnZlcnM7XG5cbiAgICAgIHN3aXRjaCAoZXZlbnQudHlwZSkge1xuICAgICAgICBjYXNlICdmdWxmaWxsJzpcbiAgICAgICAgICBwYXJlbnQgPT09IG51bGwgfHwgcGFyZW50ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwYXJlbnQuc2VuZChkb25lSW52b2tlKGlkLCBldmVudC5kYXRhKSk7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVycm9yOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBkYXRhOiBldmVudC5kYXRhLFxuICAgICAgICAgICAgc3RhdHVzOiAnZnVsZmlsbGVkJ1xuICAgICAgICAgIH07XG5cbiAgICAgICAgY2FzZSAncmVqZWN0JzpcbiAgICAgICAgICBwYXJlbnQgPT09IG51bGwgfHwgcGFyZW50ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwYXJlbnQuc2VuZChlcnJvcihpZCwgZXZlbnQuZXJyb3IpKTtcbiAgICAgICAgICBvYnNlcnZlcnMuZm9yRWFjaChmdW5jdGlvbiAob2JzZXJ2ZXIpIHtcbiAgICAgICAgICAgIG9ic2VydmVyLmVycm9yKGV2ZW50LmVycm9yKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZXJyb3I6IGV2ZW50LmVycm9yLFxuICAgICAgICAgICAgZGF0YTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgc3RhdHVzOiAncmVqZWN0ZWQnXG4gICAgICAgICAgfTtcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGluaXRpYWxTdGF0ZTogaW5pdGlhbFN0YXRlLFxuICAgIHN0YXJ0OiBmdW5jdGlvbiAoX2EpIHtcbiAgICAgIHZhciBzZWxmID0gX2Euc2VsZjtcbiAgICAgIHByb21pc2VGbigpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgc2VsZi5zZW5kKHtcbiAgICAgICAgICB0eXBlOiAnZnVsZmlsbCcsXG4gICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICB9KTtcbiAgICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgc2VsZi5zZW5kKHtcbiAgICAgICAgICB0eXBlOiAncmVqZWN0JyxcbiAgICAgICAgICBlcnJvcjogcmVhc29uXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gaW5pdGlhbFN0YXRlO1xuICAgIH1cbiAgfTtcbn1cbmZ1bmN0aW9uIHNwYXduQmVoYXZpb3IoYmVoYXZpb3IsIG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuXG4gIHZhciBzdGF0ZSA9IGJlaGF2aW9yLmluaXRpYWxTdGF0ZTtcbiAgdmFyIG9ic2VydmVycyA9IG5ldyBTZXQoKTtcbiAgdmFyIG1haWxib3ggPSBbXTtcbiAgdmFyIGZsdXNoaW5nID0gZmFsc2U7XG5cbiAgdmFyIGZsdXNoID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChmbHVzaGluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZsdXNoaW5nID0gdHJ1ZTtcblxuICAgIHdoaWxlIChtYWlsYm94Lmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciBldmVudF8xID0gbWFpbGJveC5zaGlmdCgpO1xuICAgICAgc3RhdGUgPSBiZWhhdmlvci50cmFuc2l0aW9uKHN0YXRlLCBldmVudF8xLCBhY3RvckN0eCk7XG4gICAgICBvYnNlcnZlcnMuZm9yRWFjaChmdW5jdGlvbiAob2JzZXJ2ZXIpIHtcbiAgICAgICAgcmV0dXJuIG9ic2VydmVyLm5leHQoc3RhdGUpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZmx1c2hpbmcgPSBmYWxzZTtcbiAgfTtcblxuICB2YXIgYWN0b3IgPSB0b0FjdG9yUmVmKHtcbiAgICBpZDogb3B0aW9ucy5pZCxcbiAgICBzZW5kOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIG1haWxib3gucHVzaChldmVudCk7XG4gICAgICBmbHVzaCgpO1xuICAgIH0sXG4gICAgZ2V0U25hcHNob3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9LFxuICAgIHN1YnNjcmliZTogZnVuY3Rpb24gKG5leHQsIGhhbmRsZUVycm9yLCBjb21wbGV0ZSkge1xuICAgICAgdmFyIG9ic2VydmVyID0gdG9PYnNlcnZlcihuZXh0LCBoYW5kbGVFcnJvciwgY29tcGxldGUpO1xuICAgICAgb2JzZXJ2ZXJzLmFkZChvYnNlcnZlcik7XG4gICAgICBvYnNlcnZlci5uZXh0KHN0YXRlKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgb2JzZXJ2ZXJzLmRlbGV0ZShvYnNlcnZlcik7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9KTtcbiAgdmFyIGFjdG9yQ3R4ID0ge1xuICAgIHBhcmVudDogb3B0aW9ucy5wYXJlbnQsXG4gICAgc2VsZjogYWN0b3IsXG4gICAgaWQ6IG9wdGlvbnMuaWQgfHwgJ2Fub255bW91cycsXG4gICAgb2JzZXJ2ZXJzOiBvYnNlcnZlcnNcbiAgfTtcbiAgc3RhdGUgPSBiZWhhdmlvci5zdGFydCA/IGJlaGF2aW9yLnN0YXJ0KGFjdG9yQ3R4KSA6IHN0YXRlO1xuICByZXR1cm4gYWN0b3I7XG59XG5cbmV4cG9ydCB7IGZyb21Qcm9taXNlLCBmcm9tUmVkdWNlciwgc3Bhd25CZWhhdmlvciB9O1xuIiwidmFyIFNUQVRFX0RFTElNSVRFUiA9ICcuJztcbnZhciBFTVBUWV9BQ1RJVklUWV9NQVAgPSB7fTtcbnZhciBERUZBVUxUX0dVQVJEX1RZUEUgPSAneHN0YXRlLmd1YXJkJztcbnZhciBUQVJHRVRMRVNTX0tFWSA9ICcnO1xuXG5leHBvcnQgeyBERUZBVUxUX0dVQVJEX1RZUEUsIEVNUFRZX0FDVElWSVRZX01BUCwgU1RBVEVfREVMSU1JVEVSLCBUQVJHRVRMRVNTX0tFWSB9O1xuIiwiaW1wb3J0IHsgSVNfUFJPRFVDVElPTiB9IGZyb20gJy4vZW52aXJvbm1lbnQuanMnO1xuXG5mdW5jdGlvbiBnZXRHbG9iYWwoKSB7XG4gIGlmICh0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZ2xvYmFsVGhpcztcbiAgfVxuXG4gIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gc2VsZjtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiB3aW5kb3c7XG4gIH1cblxuICBpZiAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZ2xvYmFsO1xuICB9XG5cbiAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgY29uc29sZS53YXJuKCdYU3RhdGUgY291bGQgbm90IGZpbmQgYSBnbG9iYWwgb2JqZWN0IGluIHRoaXMgZW52aXJvbm1lbnQuIFBsZWFzZSBsZXQgdGhlIG1haW50YWluZXJzIGtub3cgYW5kIHJhaXNlIGFuIGlzc3VlIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9zdGF0ZWx5YWkveHN0YXRlL2lzc3VlcycpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldERldlRvb2xzKCkge1xuICB2YXIgZ2xvYmFsID0gZ2V0R2xvYmFsKCk7XG5cbiAgaWYgKGdsb2JhbCAmJiAnX194c3RhdGVfXycgaW4gZ2xvYmFsKSB7XG4gICAgcmV0dXJuIGdsb2JhbC5fX3hzdGF0ZV9fO1xuICB9XG5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gcmVnaXN0ZXJTZXJ2aWNlKHNlcnZpY2UpIHtcbiAgaWYgKCFnZXRHbG9iYWwoKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBkZXZUb29scyA9IGdldERldlRvb2xzKCk7XG5cbiAgaWYgKGRldlRvb2xzKSB7XG4gICAgZGV2VG9vbHMucmVnaXN0ZXIoc2VydmljZSk7XG4gIH1cbn1cblxuZXhwb3J0IHsgZ2V0R2xvYmFsLCByZWdpc3RlclNlcnZpY2UgfTtcbiIsInZhciBJU19QUk9EVUNUSU9OID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJztcblxuZXhwb3J0IHsgSVNfUFJPRFVDVElPTiB9O1xuIiwiaW1wb3J0IHsgX192YWx1ZXMsIF9fc3ByZWFkQXJyYXksIF9fcmVhZCwgX19hc3NpZ24gfSBmcm9tICcuL192aXJ0dWFsL190c2xpYi5qcyc7XG5pbXBvcnQgeyBTcGVjaWFsVGFyZ2V0cywgQWN0aW9uVHlwZXMgfSBmcm9tICcuL3R5cGVzLmpzJztcbmltcG9ydCB7IGlzU3RhdGVDb25maWcsIFN0YXRlLCBiaW5kQWN0aW9uVG9TdGF0ZSB9IGZyb20gJy4vU3RhdGUuanMnO1xuaW1wb3J0IHsgZXJyb3JQbGF0Zm9ybSwgdXBkYXRlLCBlcnJvciBhcyBlcnJvciQxLCBsb2csIHN0b3AsIHN0YXJ0LCBjYW5jZWwsIHNlbmQsIHJhaXNlIH0gZnJvbSAnLi9hY3Rpb25UeXBlcy5qcyc7XG5pbXBvcnQgeyBpbml0RXZlbnQsIGRvbmVJbnZva2UsIHRvQWN0aW9uT2JqZWN0cywgcmVzb2x2ZUFjdGlvbnMsIGVycm9yLCBnZXRBY3Rpb25GdW5jdGlvbiB9IGZyb20gJy4vYWN0aW9ucy5qcyc7XG5pbXBvcnQgeyBJU19QUk9EVUNUSU9OIH0gZnJvbSAnLi9lbnZpcm9ubWVudC5qcyc7XG5pbXBvcnQgeyB3YXJuLCBtYXBDb250ZXh0LCB0b09ic2VydmVyLCBpc0Z1bmN0aW9uLCB0b1NDWE1MRXZlbnQsIGZsYXR0ZW4sIGlzUmFpc2FibGVBY3Rpb24sIGlzUHJvbWlzZUxpa2UsIGlzT2JzZXJ2YWJsZSwgaXNNYWNoaW5lLCBpc0JlaGF2aW9yLCByZXBvcnRVbmhhbmRsZWRFeGNlcHRpb25Pbkludm9jYXRpb24sIHN5bWJvbE9ic2VydmFibGUsIGlzQXJyYXksIHRvRXZlbnRPYmplY3QsIGlzU3RyaW5nLCBpc0FjdG9yLCB0b0ludm9rZVNvdXJjZSwgdW5pcXVlSWQgfSBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7IFNjaGVkdWxlciB9IGZyb20gJy4vc2NoZWR1bGVyLmpzJztcbmltcG9ydCB7IGNyZWF0ZURlZmVycmVkQWN0b3IsIGlzU3Bhd25lZEFjdG9yIH0gZnJvbSAnLi9BY3Rvci5qcyc7XG5pbXBvcnQgeyByZWdpc3RyeSB9IGZyb20gJy4vcmVnaXN0cnkuanMnO1xuaW1wb3J0IHsgZ2V0R2xvYmFsLCByZWdpc3RlclNlcnZpY2UgfSBmcm9tICcuL2RldlRvb2xzLmpzJztcbmltcG9ydCB7IHByb3ZpZGUsIGNvbnN1bWUgfSBmcm9tICcuL3NlcnZpY2VTY29wZS5qcyc7XG5pbXBvcnQgeyBzcGF3bkJlaGF2aW9yIH0gZnJvbSAnLi9iZWhhdmlvcnMuanMnO1xuXG52YXIgREVGQVVMVF9TUEFXTl9PUFRJT05TID0ge1xuICBzeW5jOiBmYWxzZSxcbiAgYXV0b0ZvcndhcmQ6IGZhbHNlXG59O1xudmFyIEludGVycHJldGVyU3RhdHVzO1xuXG4oZnVuY3Rpb24gKEludGVycHJldGVyU3RhdHVzKSB7XG4gIEludGVycHJldGVyU3RhdHVzW0ludGVycHJldGVyU3RhdHVzW1wiTm90U3RhcnRlZFwiXSA9IDBdID0gXCJOb3RTdGFydGVkXCI7XG4gIEludGVycHJldGVyU3RhdHVzW0ludGVycHJldGVyU3RhdHVzW1wiUnVubmluZ1wiXSA9IDFdID0gXCJSdW5uaW5nXCI7XG4gIEludGVycHJldGVyU3RhdHVzW0ludGVycHJldGVyU3RhdHVzW1wiU3RvcHBlZFwiXSA9IDJdID0gXCJTdG9wcGVkXCI7XG59KShJbnRlcnByZXRlclN0YXR1cyB8fCAoSW50ZXJwcmV0ZXJTdGF0dXMgPSB7fSkpO1xuXG52YXIgSW50ZXJwcmV0ZXIgPVxuLyojX19QVVJFX18qL1xuXG4vKiogQGNsYXNzICovXG5mdW5jdGlvbiAoKSB7XG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYSBuZXcgSW50ZXJwcmV0ZXIgaW5zdGFuY2UgKGkuZS4sIHNlcnZpY2UpIGZvciB0aGUgZ2l2ZW4gbWFjaGluZSB3aXRoIHRoZSBwcm92aWRlZCBvcHRpb25zLCBpZiBhbnkuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gbWFjaGluZSBUaGUgbWFjaGluZSB0byBiZSBpbnRlcnByZXRlZFxyXG4gICAqIEBwYXJhbSBvcHRpb25zIEludGVycHJldGVyIG9wdGlvbnNcclxuICAgKi9cbiAgZnVuY3Rpb24gSW50ZXJwcmV0ZXIobWFjaGluZSwgb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHtcbiAgICAgIG9wdGlvbnMgPSBJbnRlcnByZXRlci5kZWZhdWx0T3B0aW9ucztcbiAgICB9XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdGhpcy5tYWNoaW5lID0gbWFjaGluZTtcbiAgICB0aGlzLmRlbGF5ZWRFdmVudHNNYXAgPSB7fTtcbiAgICB0aGlzLmxpc3RlbmVycyA9IG5ldyBTZXQoKTtcbiAgICB0aGlzLmNvbnRleHRMaXN0ZW5lcnMgPSBuZXcgU2V0KCk7XG4gICAgdGhpcy5zdG9wTGlzdGVuZXJzID0gbmV3IFNldCgpO1xuICAgIHRoaXMuZG9uZUxpc3RlbmVycyA9IG5ldyBTZXQoKTtcbiAgICB0aGlzLmV2ZW50TGlzdGVuZXJzID0gbmV3IFNldCgpO1xuICAgIHRoaXMuc2VuZExpc3RlbmVycyA9IG5ldyBTZXQoKTtcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgdGhlIHNlcnZpY2UgaXMgc3RhcnRlZC5cclxuICAgICAqL1xuXG4gICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIHRoaXMuc3RhdHVzID0gSW50ZXJwcmV0ZXJTdGF0dXMuTm90U3RhcnRlZDtcbiAgICB0aGlzLmNoaWxkcmVuID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuZm9yd2FyZFRvID0gbmV3IFNldCgpO1xuICAgIHRoaXMuX291dGdvaW5nUXVldWUgPSBbXTtcbiAgICAvKipcclxuICAgICAqIEFsaWFzIGZvciBJbnRlcnByZXRlci5wcm90b3R5cGUuc3RhcnRcclxuICAgICAqL1xuXG4gICAgdGhpcy5pbml0ID0gdGhpcy5zdGFydDtcbiAgICAvKipcclxuICAgICAqIFNlbmRzIGFuIGV2ZW50IHRvIHRoZSBydW5uaW5nIGludGVycHJldGVyIHRvIHRyaWdnZXIgYSB0cmFuc2l0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEFuIGFycmF5IG9mIGV2ZW50cyAoYmF0Y2hlZCkgY2FuIGJlIHNlbnQgYXMgd2VsbCwgd2hpY2ggd2lsbCBzZW5kIGFsbFxyXG4gICAgICogYmF0Y2hlZCBldmVudHMgdG8gdGhlIHJ1bm5pbmcgaW50ZXJwcmV0ZXIuIFRoZSBsaXN0ZW5lcnMgd2lsbCBiZVxyXG4gICAgICogbm90aWZpZWQgb25seSAqKm9uY2UqKiB3aGVuIGFsbCBldmVudHMgYXJlIHByb2Nlc3NlZC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50KHMpIHRvIHNlbmRcclxuICAgICAqL1xuXG4gICAgdGhpcy5zZW5kID0gZnVuY3Rpb24gKGV2ZW50LCBwYXlsb2FkKSB7XG4gICAgICBpZiAoaXNBcnJheShldmVudCkpIHtcbiAgICAgICAgX3RoaXMuYmF0Y2goZXZlbnQpO1xuXG4gICAgICAgIHJldHVybiBfdGhpcy5zdGF0ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIF9ldmVudCA9IHRvU0NYTUxFdmVudCh0b0V2ZW50T2JqZWN0KGV2ZW50LCBwYXlsb2FkKSk7XG5cbiAgICAgIGlmIChfdGhpcy5zdGF0dXMgPT09IEludGVycHJldGVyU3RhdHVzLlN0b3BwZWQpIHtcbiAgICAgICAgLy8gZG8gbm90aGluZ1xuICAgICAgICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICAgICAgICB3YXJuKGZhbHNlLCBcIkV2ZW50IFxcXCJcIi5jb25jYXQoX2V2ZW50Lm5hbWUsIFwiXFxcIiB3YXMgc2VudCB0byBzdG9wcGVkIHNlcnZpY2UgXFxcIlwiKS5jb25jYXQoX3RoaXMubWFjaGluZS5pZCwgXCJcXFwiLiBUaGlzIHNlcnZpY2UgaGFzIGFscmVhZHkgcmVhY2hlZCBpdHMgZmluYWwgc3RhdGUsIGFuZCB3aWxsIG5vdCB0cmFuc2l0aW9uLlxcbkV2ZW50OiBcIikuY29uY2F0KEpTT04uc3RyaW5naWZ5KF9ldmVudC5kYXRhKSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF90aGlzLnN0YXRlO1xuICAgICAgfVxuXG4gICAgICBpZiAoX3RoaXMuc3RhdHVzICE9PSBJbnRlcnByZXRlclN0YXR1cy5SdW5uaW5nICYmICFfdGhpcy5vcHRpb25zLmRlZmVyRXZlbnRzKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkV2ZW50IFxcXCJcIi5jb25jYXQoX2V2ZW50Lm5hbWUsIFwiXFxcIiB3YXMgc2VudCB0byB1bmluaXRpYWxpemVkIHNlcnZpY2UgXFxcIlwiKS5jb25jYXQoX3RoaXMubWFjaGluZS5pZCAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICAgICwgXCJcXFwiLiBNYWtlIHN1cmUgLnN0YXJ0KCkgaXMgY2FsbGVkIGZvciB0aGlzIHNlcnZpY2UsIG9yIHNldCB7IGRlZmVyRXZlbnRzOiB0cnVlIH0gaW4gdGhlIHNlcnZpY2Ugb3B0aW9ucy5cXG5FdmVudDogXCIpLmNvbmNhdChKU09OLnN0cmluZ2lmeShfZXZlbnQuZGF0YSkpKTtcbiAgICAgIH1cblxuICAgICAgX3RoaXMuc2NoZWR1bGVyLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gRm9yd2FyZCBjb3B5IG9mIGV2ZW50IHRvIGNoaWxkIGFjdG9yc1xuICAgICAgICBfdGhpcy5mb3J3YXJkKF9ldmVudCk7XG5cbiAgICAgICAgdmFyIG5leHRTdGF0ZSA9IF90aGlzLl9uZXh0U3RhdGUoX2V2ZW50KTtcblxuICAgICAgICBfdGhpcy51cGRhdGUobmV4dFN0YXRlLCBfZXZlbnQpO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBfdGhpcy5fc3RhdGU7IC8vIFRPRE86IGRlcHJlY2F0ZSAoc2hvdWxkIHJldHVybiB2b2lkKVxuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnNlbWljb2xvblxuICAgIH07XG5cbiAgICB0aGlzLnNlbmRUbyA9IGZ1bmN0aW9uIChldmVudCwgdG8sIGltbWVkaWF0ZSkge1xuICAgICAgdmFyIGlzUGFyZW50ID0gX3RoaXMucGFyZW50ICYmICh0byA9PT0gU3BlY2lhbFRhcmdldHMuUGFyZW50IHx8IF90aGlzLnBhcmVudC5pZCA9PT0gdG8pO1xuICAgICAgdmFyIHRhcmdldCA9IGlzUGFyZW50ID8gX3RoaXMucGFyZW50IDogaXNTdHJpbmcodG8pID8gdG8gPT09IFNwZWNpYWxUYXJnZXRzLkludGVybmFsID8gX3RoaXMgOiBfdGhpcy5jaGlsZHJlbi5nZXQodG8pIHx8IHJlZ2lzdHJ5LmdldCh0bykgOiBpc0FjdG9yKHRvKSA/IHRvIDogdW5kZWZpbmVkO1xuXG4gICAgICBpZiAoIXRhcmdldCkge1xuICAgICAgICBpZiAoIWlzUGFyZW50KSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5hYmxlIHRvIHNlbmQgZXZlbnQgdG8gY2hpbGQgJ1wiLmNvbmNhdCh0bywgXCInIGZyb20gc2VydmljZSAnXCIpLmNvbmNhdChfdGhpcy5pZCwgXCInLlwiKSk7XG4gICAgICAgIH0gLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWNvbnNvbGVcblxuXG4gICAgICAgIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgICAgICAgIHdhcm4oZmFsc2UsIFwiU2VydmljZSAnXCIuY29uY2F0KF90aGlzLmlkLCBcIicgaGFzIG5vIHBhcmVudDogdW5hYmxlIHRvIHNlbmQgZXZlbnQgXCIpLmNvbmNhdChldmVudC50eXBlKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICgnbWFjaGluZScgaW4gdGFyZ2V0KSB7XG4gICAgICAgIC8vIHBlcmhhcHMgdGhvc2UgZXZlbnRzIHNob3VsZCBiZSByZWplY3RlZCBpbiB0aGUgcGFyZW50XG4gICAgICAgIC8vIGJ1dCBhdG0gaXQgZG9lc24ndCBoYXZlIGVhc3kgYWNjZXNzIHRvIGFsbCBvZiB0aGUgaW5mb3JtYXRpb24gdGhhdCBpcyByZXF1aXJlZCB0byBkbyBpdCByZWxpYWJseVxuICAgICAgICBpZiAoX3RoaXMuc3RhdHVzICE9PSBJbnRlcnByZXRlclN0YXR1cy5TdG9wcGVkIHx8IF90aGlzLnBhcmVudCAhPT0gdGFyZ2V0IHx8IC8vIHdlIG5lZWQgdG8gc2VuZCBldmVudHMgdG8gdGhlIHBhcmVudCBmcm9tIGV4aXQgaGFuZGxlcnMgb2YgYSBtYWNoaW5lIHRoYXQgcmVhY2hlZCBpdHMgZmluYWwgc3RhdGVcbiAgICAgICAgX3RoaXMuc3RhdGUuZG9uZSkge1xuICAgICAgICAgIC8vIFNlbmQgU0NYTUwgZXZlbnRzIHRvIG1hY2hpbmVzXG4gICAgICAgICAgdmFyIHNjeG1sRXZlbnQgPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgZXZlbnQpLCB7XG4gICAgICAgICAgICBuYW1lOiBldmVudC5uYW1lID09PSBlcnJvciQxID8gXCJcIi5jb25jYXQoZXJyb3IoX3RoaXMuaWQpKSA6IGV2ZW50Lm5hbWUsXG4gICAgICAgICAgICBvcmlnaW46IF90aGlzLnNlc3Npb25JZFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaWYgKCFpbW1lZGlhdGUgJiYgX3RoaXMubWFjaGluZS5jb25maWcucHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHMpIHtcbiAgICAgICAgICAgIF90aGlzLl9vdXRnb2luZ1F1ZXVlLnB1c2goW3RhcmdldCwgc2N4bWxFdmVudF0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YXJnZXQuc2VuZChzY3htbEV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFNlbmQgbm9ybWFsIGV2ZW50cyB0byBvdGhlciB0YXJnZXRzXG4gICAgICAgIGlmICghaW1tZWRpYXRlICYmIF90aGlzLm1hY2hpbmUuY29uZmlnLnByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzKSB7XG4gICAgICAgICAgX3RoaXMuX291dGdvaW5nUXVldWUucHVzaChbdGFyZ2V0LCBldmVudC5kYXRhXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGFyZ2V0LnNlbmQoZXZlbnQuZGF0YSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5fZXhlYyA9IGZ1bmN0aW9uIChhY3Rpb24sIGNvbnRleHQsIF9ldmVudCwgYWN0aW9uRnVuY3Rpb25NYXApIHtcbiAgICAgIGlmIChhY3Rpb25GdW5jdGlvbk1hcCA9PT0gdm9pZCAwKSB7XG4gICAgICAgIGFjdGlvbkZ1bmN0aW9uTWFwID0gX3RoaXMubWFjaGluZS5vcHRpb25zLmFjdGlvbnM7XG4gICAgICB9XG5cbiAgICAgIHZhciBhY3Rpb25PckV4ZWMgPSBhY3Rpb24uZXhlYyB8fCBnZXRBY3Rpb25GdW5jdGlvbihhY3Rpb24udHlwZSwgYWN0aW9uRnVuY3Rpb25NYXApO1xuICAgICAgdmFyIGV4ZWMgPSBpc0Z1bmN0aW9uKGFjdGlvbk9yRXhlYykgPyBhY3Rpb25PckV4ZWMgOiBhY3Rpb25PckV4ZWMgPyBhY3Rpb25PckV4ZWMuZXhlYyA6IGFjdGlvbi5leGVjO1xuXG4gICAgICBpZiAoZXhlYykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBleGVjKGNvbnRleHQsIF9ldmVudC5kYXRhLCAhX3RoaXMubWFjaGluZS5jb25maWcucHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHMgPyB7XG4gICAgICAgICAgICBhY3Rpb246IGFjdGlvbixcbiAgICAgICAgICAgIHN0YXRlOiBfdGhpcy5zdGF0ZSxcbiAgICAgICAgICAgIF9ldmVudDogX2V2ZW50XG4gICAgICAgICAgfSA6IHtcbiAgICAgICAgICAgIGFjdGlvbjogYWN0aW9uLFxuICAgICAgICAgICAgX2V2ZW50OiBfZXZlbnRcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgaWYgKF90aGlzLnBhcmVudCkge1xuICAgICAgICAgICAgX3RoaXMucGFyZW50LnNlbmQoe1xuICAgICAgICAgICAgICB0eXBlOiAneHN0YXRlLmVycm9yJyxcbiAgICAgICAgICAgICAgZGF0YTogZXJyXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xuICAgICAgICBjYXNlIHJhaXNlOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIC8vIGlmIHJhaXNlIGFjdGlvbiByZWFjaGVkIHRoZSBpbnRlcnByZXRlciB0aGVuIGl0J3MgYSBkZWxheWVkIG9uZVxuICAgICAgICAgICAgdmFyIHNlbmRBY3Rpb25fMSA9IGFjdGlvbjtcblxuICAgICAgICAgICAgX3RoaXMuZGVmZXIoc2VuZEFjdGlvbl8xKTtcblxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgIGNhc2Ugc2VuZDpcbiAgICAgICAgICB2YXIgc2VuZEFjdGlvbiA9IGFjdGlvbjtcblxuICAgICAgICAgIGlmICh0eXBlb2Ygc2VuZEFjdGlvbi5kZWxheSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIF90aGlzLmRlZmVyKHNlbmRBY3Rpb24pO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChzZW5kQWN0aW9uLnRvKSB7XG4gICAgICAgICAgICAgIF90aGlzLnNlbmRUbyhzZW5kQWN0aW9uLl9ldmVudCwgc2VuZEFjdGlvbi50bywgX2V2ZW50ID09PSBpbml0RXZlbnQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgX3RoaXMuc2VuZChzZW5kQWN0aW9uLl9ldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBjYW5jZWw6XG4gICAgICAgICAgX3RoaXMuY2FuY2VsKGFjdGlvbi5zZW5kSWQpO1xuXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBzdGFydDpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpZiAoX3RoaXMuc3RhdHVzICE9PSBJbnRlcnByZXRlclN0YXR1cy5SdW5uaW5nKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGFjdGl2aXR5ID0gYWN0aW9uLmFjdGl2aXR5OyAvLyBJZiB0aGUgYWN0aXZpdHkgd2lsbCBiZSBzdG9wcGVkIHJpZ2h0IGFmdGVyIGl0J3Mgc3RhcnRlZFxuICAgICAgICAgICAgLy8gKHN1Y2ggYXMgaW4gdHJhbnNpZW50IHN0YXRlcylcbiAgICAgICAgICAgIC8vIGRvbid0IGJvdGhlciBzdGFydGluZyB0aGUgYWN0aXZpdHkuXG5cbiAgICAgICAgICAgIGlmICggLy8gaW4gdjQgd2l0aCBgcHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHNgIGludm9rZXMgYXJlIGNhbGxlZCBlYWdlcmx5IHdoZW4gdGhlIGB0aGlzLnN0YXRlYCBzdGlsbCBwb2ludHMgdG8gdGhlIHByZXZpb3VzIHN0YXRlXG4gICAgICAgICAgICAhX3RoaXMubWFjaGluZS5jb25maWcucHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHMgJiYgIV90aGlzLnN0YXRlLmFjdGl2aXRpZXNbYWN0aXZpdHkuaWQgfHwgYWN0aXZpdHkudHlwZV0pIHtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9IC8vIEludm9rZWQgc2VydmljZXNcblxuXG4gICAgICAgICAgICBpZiAoYWN0aXZpdHkudHlwZSA9PT0gQWN0aW9uVHlwZXMuSW52b2tlKSB7XG4gICAgICAgICAgICAgIHZhciBpbnZva2VTb3VyY2UgPSB0b0ludm9rZVNvdXJjZShhY3Rpdml0eS5zcmMpO1xuICAgICAgICAgICAgICB2YXIgc2VydmljZUNyZWF0b3IgPSBfdGhpcy5tYWNoaW5lLm9wdGlvbnMuc2VydmljZXMgPyBfdGhpcy5tYWNoaW5lLm9wdGlvbnMuc2VydmljZXNbaW52b2tlU291cmNlLnR5cGVdIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICB2YXIgaWQgPSBhY3Rpdml0eS5pZCxcbiAgICAgICAgICAgICAgICAgIGRhdGEgPSBhY3Rpdml0eS5kYXRhO1xuXG4gICAgICAgICAgICAgIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgICAgICAgICAgICAgIHdhcm4oISgnZm9yd2FyZCcgaW4gYWN0aXZpdHkpLCAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICAgICAgICAgICAgXCJgZm9yd2FyZGAgcHJvcGVydHkgaXMgZGVwcmVjYXRlZCAoZm91bmQgaW4gaW52b2NhdGlvbiBvZiAnXCIuY29uY2F0KGFjdGl2aXR5LnNyYywgXCInIGluIGluIG1hY2hpbmUgJ1wiKS5jb25jYXQoX3RoaXMubWFjaGluZS5pZCwgXCInKS4gXCIpICsgXCJQbGVhc2UgdXNlIGBhdXRvRm9yd2FyZGAgaW5zdGVhZC5cIik7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB2YXIgYXV0b0ZvcndhcmQgPSAnYXV0b0ZvcndhcmQnIGluIGFjdGl2aXR5ID8gYWN0aXZpdHkuYXV0b0ZvcndhcmQgOiAhIWFjdGl2aXR5LmZvcndhcmQ7XG5cbiAgICAgICAgICAgICAgaWYgKCFzZXJ2aWNlQ3JlYXRvcikge1xuICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1jb25zb2xlXG4gICAgICAgICAgICAgICAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgICAgICAgICAgICAgICB3YXJuKGZhbHNlLCBcIk5vIHNlcnZpY2UgZm91bmQgZm9yIGludm9jYXRpb24gJ1wiLmNvbmNhdChhY3Rpdml0eS5zcmMsIFwiJyBpbiBtYWNoaW5lICdcIikuY29uY2F0KF90aGlzLm1hY2hpbmUuaWQsIFwiJy5cIikpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHZhciByZXNvbHZlZERhdGEgPSBkYXRhID8gbWFwQ29udGV4dChkYXRhLCBjb250ZXh0LCBfZXZlbnQpIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgIGlmICh0eXBlb2Ygc2VydmljZUNyZWF0b3IgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgLy8gVE9ETzogd2FyblxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHZhciBzb3VyY2UgPSBpc0Z1bmN0aW9uKHNlcnZpY2VDcmVhdG9yKSA/IHNlcnZpY2VDcmVhdG9yKGNvbnRleHQsIF9ldmVudC5kYXRhLCB7XG4gICAgICAgICAgICAgICAgZGF0YTogcmVzb2x2ZWREYXRhLFxuICAgICAgICAgICAgICAgIHNyYzogaW52b2tlU291cmNlLFxuICAgICAgICAgICAgICAgIG1ldGE6IGFjdGl2aXR5Lm1ldGFcbiAgICAgICAgICAgICAgfSkgOiBzZXJ2aWNlQ3JlYXRvcjtcblxuICAgICAgICAgICAgICBpZiAoIXNvdXJjZSkge1xuICAgICAgICAgICAgICAgIC8vIFRPRE86IHdhcm4/XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB2b2lkIDA7XG5cbiAgICAgICAgICAgICAgaWYgKGlzTWFjaGluZShzb3VyY2UpKSB7XG4gICAgICAgICAgICAgICAgc291cmNlID0gcmVzb2x2ZWREYXRhID8gc291cmNlLndpdGhDb250ZXh0KHJlc29sdmVkRGF0YSkgOiBzb3VyY2U7XG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgIGF1dG9Gb3J3YXJkOiBhdXRvRm9yd2FyZFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBfdGhpcy5zcGF3bihzb3VyY2UsIGlkLCBvcHRpb25zKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIF90aGlzLnNwYXduQWN0aXZpdHkoYWN0aXZpdHkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBzdG9wOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIF90aGlzLnN0b3BDaGlsZChhY3Rpb24uYWN0aXZpdHkuaWQpO1xuXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgY2FzZSBsb2c6XG4gICAgICAgICAgdmFyIF9hID0gYWN0aW9uLFxuICAgICAgICAgICAgICBsYWJlbCA9IF9hLmxhYmVsLFxuICAgICAgICAgICAgICB2YWx1ZSA9IF9hLnZhbHVlO1xuXG4gICAgICAgICAgaWYgKGxhYmVsKSB7XG4gICAgICAgICAgICBfdGhpcy5sb2dnZXIobGFiZWwsIHZhbHVlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX3RoaXMubG9nZ2VyKHZhbHVlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgICAgICAgICAgd2FybihmYWxzZSwgXCJObyBpbXBsZW1lbnRhdGlvbiBmb3VuZCBmb3IgYWN0aW9uIHR5cGUgJ1wiLmNvbmNhdChhY3Rpb24udHlwZSwgXCInXCIpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIHJlc29sdmVkT3B0aW9ucyA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCBJbnRlcnByZXRlci5kZWZhdWx0T3B0aW9ucyksIG9wdGlvbnMpO1xuXG4gICAgdmFyIGNsb2NrID0gcmVzb2x2ZWRPcHRpb25zLmNsb2NrLFxuICAgICAgICBsb2dnZXIgPSByZXNvbHZlZE9wdGlvbnMubG9nZ2VyLFxuICAgICAgICBwYXJlbnQgPSByZXNvbHZlZE9wdGlvbnMucGFyZW50LFxuICAgICAgICBpZCA9IHJlc29sdmVkT3B0aW9ucy5pZDtcbiAgICB2YXIgcmVzb2x2ZWRJZCA9IGlkICE9PSB1bmRlZmluZWQgPyBpZCA6IG1hY2hpbmUuaWQ7XG4gICAgdGhpcy5pZCA9IHJlc29sdmVkSWQ7XG4gICAgdGhpcy5sb2dnZXIgPSBsb2dnZXI7XG4gICAgdGhpcy5jbG9jayA9IGNsb2NrO1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgIHRoaXMub3B0aW9ucyA9IHJlc29sdmVkT3B0aW9ucztcbiAgICB0aGlzLnNjaGVkdWxlciA9IG5ldyBTY2hlZHVsZXIoe1xuICAgICAgZGVmZXJFdmVudHM6IHRoaXMub3B0aW9ucy5kZWZlckV2ZW50c1xuICAgIH0pO1xuICAgIHRoaXMuc2Vzc2lvbklkID0gcmVnaXN0cnkuYm9va0lkKCk7XG4gIH1cblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoSW50ZXJwcmV0ZXIucHJvdG90eXBlLCBcImluaXRpYWxTdGF0ZVwiLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICBpZiAodGhpcy5faW5pdGlhbFN0YXRlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbml0aWFsU3RhdGU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm92aWRlKHRoaXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgX3RoaXMuX2luaXRpYWxTdGF0ZSA9IF90aGlzLm1hY2hpbmUuaW5pdGlhbFN0YXRlO1xuICAgICAgICByZXR1cm4gX3RoaXMuX2luaXRpYWxTdGF0ZTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoSW50ZXJwcmV0ZXIucHJvdG90eXBlLCBcInN0YXRlXCIsIHtcbiAgICAvKipcclxuICAgICAqIEBkZXByZWNhdGVkIFVzZSBgLmdldFNuYXBzaG90KClgIGluc3RlYWQuXHJcbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgICAgICB3YXJuKHRoaXMuc3RhdHVzICE9PSBJbnRlcnByZXRlclN0YXR1cy5Ob3RTdGFydGVkLCBcIkF0dGVtcHRlZCB0byByZWFkIHN0YXRlIGZyb20gdW5pbml0aWFsaXplZCBzZXJ2aWNlICdcIi5jb25jYXQodGhpcy5pZCwgXCInLiBNYWtlIHN1cmUgdGhlIHNlcnZpY2UgaXMgc3RhcnRlZCBmaXJzdC5cIikpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5fc3RhdGU7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG4gIC8qKlxyXG4gICAqIEV4ZWN1dGVzIHRoZSBhY3Rpb25zIG9mIHRoZSBnaXZlbiBzdGF0ZSwgd2l0aCB0aGF0IHN0YXRlJ3MgYGNvbnRleHRgIGFuZCBgZXZlbnRgLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHN0YXRlIFRoZSBzdGF0ZSB3aG9zZSBhY3Rpb25zIHdpbGwgYmUgZXhlY3V0ZWRcclxuICAgKiBAcGFyYW0gYWN0aW9uc0NvbmZpZyBUaGUgYWN0aW9uIGltcGxlbWVudGF0aW9ucyB0byB1c2VcclxuICAgKi9cblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuZXhlY3V0ZSA9IGZ1bmN0aW9uIChzdGF0ZSwgYWN0aW9uc0NvbmZpZykge1xuICAgIHZhciBlXzEsIF9hO1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIF9iID0gX192YWx1ZXMoc3RhdGUuYWN0aW9ucyksIF9jID0gX2IubmV4dCgpOyAhX2MuZG9uZTsgX2MgPSBfYi5uZXh0KCkpIHtcbiAgICAgICAgdmFyIGFjdGlvbiA9IF9jLnZhbHVlO1xuICAgICAgICB0aGlzLmV4ZWMoYWN0aW9uLCBzdGF0ZSwgYWN0aW9uc0NvbmZpZyk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV8xXzEpIHtcbiAgICAgIGVfMSA9IHtcbiAgICAgICAgZXJyb3I6IGVfMV8xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoX2MgJiYgIV9jLmRvbmUgJiYgKF9hID0gX2IucmV0dXJuKSkgX2EuY2FsbChfYik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV8xKSB0aHJvdyBlXzEuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoc3RhdGUsIF9ldmVudCkge1xuICAgIHZhciBlXzIsIF9hLCBlXzMsIF9iLCBlXzQsIF9jLCBlXzUsIF9kO1xuXG4gICAgdmFyIF90aGlzID0gdGhpczsgLy8gQXR0YWNoIHNlc3Npb24gSUQgdG8gc3RhdGVcblxuXG4gICAgc3RhdGUuX3Nlc3Npb25pZCA9IHRoaXMuc2Vzc2lvbklkOyAvLyBVcGRhdGUgc3RhdGVcblxuICAgIHRoaXMuX3N0YXRlID0gc3RhdGU7IC8vIEV4ZWN1dGUgYWN0aW9uc1xuXG4gICAgaWYgKCghdGhpcy5tYWNoaW5lLmNvbmZpZy5wcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50cyB8fCAvLyB0aGlzIGlzIGN1cnJlbnRseSByZXF1aXJlZCB0byBleGVjdXRlIGluaXRpYWwgYWN0aW9ucyBhcyB0aGUgYGluaXRpYWxTdGF0ZWAgZ2V0cyBjYWNoZWRcbiAgICAvLyB3ZSBjYW4ndCBqdXN0IHJlY29tcHV0ZSBpdCAoYW5kIGV4ZWN1dGUgYWN0aW9ucyB3aGlsZSBkb2luZyBzbykgYmVjYXVzZSB3ZSB0cnkgdG8gcHJlc2VydmUgaWRlbnRpdHkgb2YgYWN0b3JzIGNyZWF0ZWQgd2l0aGluIGluaXRpYWwgYXNzaWduc1xuICAgIF9ldmVudCA9PT0gaW5pdEV2ZW50KSAmJiB0aGlzLm9wdGlvbnMuZXhlY3V0ZSkge1xuICAgICAgdGhpcy5leGVjdXRlKHRoaXMuc3RhdGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgaXRlbSA9IHZvaWQgMDtcblxuICAgICAgd2hpbGUgKGl0ZW0gPSB0aGlzLl9vdXRnb2luZ1F1ZXVlLnNoaWZ0KCkpIHtcbiAgICAgICAgaXRlbVswXS5zZW5kKGl0ZW1bMV0pO1xuICAgICAgfVxuICAgIH0gLy8gVXBkYXRlIGNoaWxkcmVuXG5cblxuICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgIF90aGlzLnN0YXRlLmNoaWxkcmVuW2NoaWxkLmlkXSA9IGNoaWxkO1xuICAgIH0pOyAvLyBEZXYgdG9vbHNcblxuICAgIGlmICh0aGlzLmRldlRvb2xzKSB7XG4gICAgICB0aGlzLmRldlRvb2xzLnNlbmQoX2V2ZW50LmRhdGEsIHN0YXRlKTtcbiAgICB9IC8vIEV4ZWN1dGUgbGlzdGVuZXJzXG5cblxuICAgIGlmIChzdGF0ZS5ldmVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yICh2YXIgX2UgPSBfX3ZhbHVlcyh0aGlzLmV2ZW50TGlzdGVuZXJzKSwgX2YgPSBfZS5uZXh0KCk7ICFfZi5kb25lOyBfZiA9IF9lLm5leHQoKSkge1xuICAgICAgICAgIHZhciBsaXN0ZW5lciA9IF9mLnZhbHVlO1xuICAgICAgICAgIGxpc3RlbmVyKHN0YXRlLmV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZV8yXzEpIHtcbiAgICAgICAgZV8yID0ge1xuICAgICAgICAgIGVycm9yOiBlXzJfMVxuICAgICAgICB9O1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoX2YgJiYgIV9mLmRvbmUgJiYgKF9hID0gX2UucmV0dXJuKSkgX2EuY2FsbChfZSk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgaWYgKGVfMikgdGhyb3cgZV8yLmVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIF9nID0gX192YWx1ZXModGhpcy5saXN0ZW5lcnMpLCBfaCA9IF9nLm5leHQoKTsgIV9oLmRvbmU7IF9oID0gX2cubmV4dCgpKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lciA9IF9oLnZhbHVlO1xuICAgICAgICBsaXN0ZW5lcihzdGF0ZSwgc3RhdGUuZXZlbnQpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfM18xKSB7XG4gICAgICBlXzMgPSB7XG4gICAgICAgIGVycm9yOiBlXzNfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKF9oICYmICFfaC5kb25lICYmIChfYiA9IF9nLnJldHVybikpIF9iLmNhbGwoX2cpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfMykgdGhyb3cgZV8zLmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBfaiA9IF9fdmFsdWVzKHRoaXMuY29udGV4dExpc3RlbmVycyksIF9rID0gX2oubmV4dCgpOyAhX2suZG9uZTsgX2sgPSBfai5uZXh0KCkpIHtcbiAgICAgICAgdmFyIGNvbnRleHRMaXN0ZW5lciA9IF9rLnZhbHVlO1xuICAgICAgICBjb250ZXh0TGlzdGVuZXIodGhpcy5zdGF0ZS5jb250ZXh0LCB0aGlzLnN0YXRlLmhpc3RvcnkgPyB0aGlzLnN0YXRlLmhpc3RvcnkuY29udGV4dCA6IHVuZGVmaW5lZCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV80XzEpIHtcbiAgICAgIGVfNCA9IHtcbiAgICAgICAgZXJyb3I6IGVfNF8xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoX2sgJiYgIV9rLmRvbmUgJiYgKF9jID0gX2oucmV0dXJuKSkgX2MuY2FsbChfaik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV80KSB0aHJvdyBlXzQuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc3RhdGUuZG9uZSkge1xuICAgICAgLy8gZ2V0IGZpbmFsIGNoaWxkIHN0YXRlIG5vZGVcbiAgICAgIHZhciBmaW5hbENoaWxkU3RhdGVOb2RlID0gc3RhdGUuY29uZmlndXJhdGlvbi5maW5kKGZ1bmN0aW9uIChzbikge1xuICAgICAgICByZXR1cm4gc24udHlwZSA9PT0gJ2ZpbmFsJyAmJiBzbi5wYXJlbnQgPT09IF90aGlzLm1hY2hpbmU7XG4gICAgICB9KTtcbiAgICAgIHZhciBkb25lRGF0YSA9IGZpbmFsQ2hpbGRTdGF0ZU5vZGUgJiYgZmluYWxDaGlsZFN0YXRlTm9kZS5kb25lRGF0YSA/IG1hcENvbnRleHQoZmluYWxDaGlsZFN0YXRlTm9kZS5kb25lRGF0YSwgc3RhdGUuY29udGV4dCwgX2V2ZW50KSA6IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuX2RvbmVFdmVudCA9IGRvbmVJbnZva2UodGhpcy5pZCwgZG9uZURhdGEpO1xuXG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKHZhciBfbCA9IF9fdmFsdWVzKHRoaXMuZG9uZUxpc3RlbmVycyksIF9tID0gX2wubmV4dCgpOyAhX20uZG9uZTsgX20gPSBfbC5uZXh0KCkpIHtcbiAgICAgICAgICB2YXIgbGlzdGVuZXIgPSBfbS52YWx1ZTtcbiAgICAgICAgICBsaXN0ZW5lcih0aGlzLl9kb25lRXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlXzVfMSkge1xuICAgICAgICBlXzUgPSB7XG4gICAgICAgICAgZXJyb3I6IGVfNV8xXG4gICAgICAgIH07XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChfbSAmJiAhX20uZG9uZSAmJiAoX2QgPSBfbC5yZXR1cm4pKSBfZC5jYWxsKF9sKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBpZiAoZV81KSB0aHJvdyBlXzUuZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5fc3RvcCgpO1xuXG4gICAgICB0aGlzLl9zdG9wQ2hpbGRyZW4oKTtcblxuICAgICAgcmVnaXN0cnkuZnJlZSh0aGlzLnNlc3Npb25JZCk7XG4gICAgfVxuICB9O1xuICAvKlxyXG4gICAqIEFkZHMgYSBsaXN0ZW5lciB0aGF0IGlzIG5vdGlmaWVkIHdoZW5ldmVyIGEgc3RhdGUgdHJhbnNpdGlvbiBoYXBwZW5zLiBUaGUgbGlzdGVuZXIgaXMgY2FsbGVkIHdpdGhcclxuICAgKiB0aGUgbmV4dCBzdGF0ZSBhbmQgdGhlIGV2ZW50IG9iamVjdCB0aGF0IGNhdXNlZCB0aGUgc3RhdGUgdHJhbnNpdGlvbi5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBsaXN0ZW5lciBUaGUgc3RhdGUgbGlzdGVuZXJcclxuICAgKi9cblxuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5vblRyYW5zaXRpb24gPSBmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICB0aGlzLmxpc3RlbmVycy5hZGQobGlzdGVuZXIpOyAvLyBTZW5kIGN1cnJlbnQgc3RhdGUgdG8gbGlzdGVuZXJcblxuICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gSW50ZXJwcmV0ZXJTdGF0dXMuUnVubmluZykge1xuICAgICAgbGlzdGVuZXIodGhpcy5zdGF0ZSwgdGhpcy5zdGF0ZS5ldmVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnN1YnNjcmliZSA9IGZ1bmN0aW9uIChuZXh0TGlzdGVuZXJPck9ic2VydmVyLCBfLCAvLyBUT0RPOiBlcnJvciBsaXN0ZW5lclxuICBjb21wbGV0ZUxpc3RlbmVyKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBvYnNlcnZlciA9IHRvT2JzZXJ2ZXIobmV4dExpc3RlbmVyT3JPYnNlcnZlciwgXywgY29tcGxldGVMaXN0ZW5lcik7XG4gICAgdGhpcy5saXN0ZW5lcnMuYWRkKG9ic2VydmVyLm5leHQpOyAvLyBTZW5kIGN1cnJlbnQgc3RhdGUgdG8gbGlzdGVuZXJcblxuICAgIGlmICh0aGlzLnN0YXR1cyAhPT0gSW50ZXJwcmV0ZXJTdGF0dXMuTm90U3RhcnRlZCkge1xuICAgICAgb2JzZXJ2ZXIubmV4dCh0aGlzLnN0YXRlKTtcbiAgICB9XG5cbiAgICB2YXIgY29tcGxldGVPbmNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgX3RoaXMuZG9uZUxpc3RlbmVycy5kZWxldGUoY29tcGxldGVPbmNlKTtcblxuICAgICAgX3RoaXMuc3RvcExpc3RlbmVycy5kZWxldGUoY29tcGxldGVPbmNlKTtcblxuICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSBJbnRlcnByZXRlclN0YXR1cy5TdG9wcGVkKSB7XG4gICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9uRG9uZShjb21wbGV0ZU9uY2UpO1xuICAgICAgdGhpcy5vblN0b3AoY29tcGxldGVPbmNlKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgX3RoaXMubGlzdGVuZXJzLmRlbGV0ZShvYnNlcnZlci5uZXh0KTtcblxuICAgICAgICBfdGhpcy5kb25lTGlzdGVuZXJzLmRlbGV0ZShjb21wbGV0ZU9uY2UpO1xuXG4gICAgICAgIF90aGlzLnN0b3BMaXN0ZW5lcnMuZGVsZXRlKGNvbXBsZXRlT25jZSk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcbiAgLyoqXHJcbiAgICogQWRkcyBhbiBldmVudCBsaXN0ZW5lciB0aGF0IGlzIG5vdGlmaWVkIHdoZW5ldmVyIGFuIGV2ZW50IGlzIHNlbnQgdG8gdGhlIHJ1bm5pbmcgaW50ZXJwcmV0ZXIuXHJcbiAgICogQHBhcmFtIGxpc3RlbmVyIFRoZSBldmVudCBsaXN0ZW5lclxyXG4gICAqL1xuXG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLm9uRXZlbnQgPSBmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICB0aGlzLmV2ZW50TGlzdGVuZXJzLmFkZChsaXN0ZW5lcik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIC8qKlxyXG4gICAqIEFkZHMgYW4gZXZlbnQgbGlzdGVuZXIgdGhhdCBpcyBub3RpZmllZCB3aGVuZXZlciBhIGBzZW5kYCBldmVudCBvY2N1cnMuXHJcbiAgICogQHBhcmFtIGxpc3RlbmVyIFRoZSBldmVudCBsaXN0ZW5lclxyXG4gICAqL1xuXG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLm9uU2VuZCA9IGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgIHRoaXMuc2VuZExpc3RlbmVycy5hZGQobGlzdGVuZXIpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICAvKipcclxuICAgKiBBZGRzIGEgY29udGV4dCBsaXN0ZW5lciB0aGF0IGlzIG5vdGlmaWVkIHdoZW5ldmVyIHRoZSBzdGF0ZSBjb250ZXh0IGNoYW5nZXMuXHJcbiAgICogQHBhcmFtIGxpc3RlbmVyIFRoZSBjb250ZXh0IGxpc3RlbmVyXHJcbiAgICovXG5cblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUub25DaGFuZ2UgPSBmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICB0aGlzLmNvbnRleHRMaXN0ZW5lcnMuYWRkKGxpc3RlbmVyKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgLyoqXHJcbiAgICogQWRkcyBhIGxpc3RlbmVyIHRoYXQgaXMgbm90aWZpZWQgd2hlbiB0aGUgbWFjaGluZSBpcyBzdG9wcGVkLlxyXG4gICAqIEBwYXJhbSBsaXN0ZW5lciBUaGUgbGlzdGVuZXJcclxuICAgKi9cblxuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5vblN0b3AgPSBmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICB0aGlzLnN0b3BMaXN0ZW5lcnMuYWRkKGxpc3RlbmVyKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgLyoqXHJcbiAgICogQWRkcyBhIHN0YXRlIGxpc3RlbmVyIHRoYXQgaXMgbm90aWZpZWQgd2hlbiB0aGUgc3RhdGVjaGFydCBoYXMgcmVhY2hlZCBpdHMgZmluYWwgc3RhdGUuXHJcbiAgICogQHBhcmFtIGxpc3RlbmVyIFRoZSBzdGF0ZSBsaXN0ZW5lclxyXG4gICAqL1xuXG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLm9uRG9uZSA9IGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gSW50ZXJwcmV0ZXJTdGF0dXMuU3RvcHBlZCAmJiB0aGlzLl9kb25lRXZlbnQpIHtcbiAgICAgIGxpc3RlbmVyKHRoaXMuX2RvbmVFdmVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZG9uZUxpc3RlbmVycy5hZGQobGlzdGVuZXIpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICAvKipcclxuICAgKiBSZW1vdmVzIGEgbGlzdGVuZXIuXHJcbiAgICogQHBhcmFtIGxpc3RlbmVyIFRoZSBsaXN0ZW5lciB0byByZW1vdmVcclxuICAgKi9cblxuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5vZmYgPSBmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICB0aGlzLmxpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpO1xuICAgIHRoaXMuZXZlbnRMaXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcbiAgICB0aGlzLnNlbmRMaXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcbiAgICB0aGlzLnN0b3BMaXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcbiAgICB0aGlzLmRvbmVMaXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcbiAgICB0aGlzLmNvbnRleHRMaXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgLyoqXHJcbiAgICogU3RhcnRzIHRoZSBpbnRlcnByZXRlciBmcm9tIHRoZSBnaXZlbiBzdGF0ZSwgb3IgdGhlIGluaXRpYWwgc3RhdGUuXHJcbiAgICogQHBhcmFtIGluaXRpYWxTdGF0ZSBUaGUgc3RhdGUgdG8gc3RhcnQgdGhlIHN0YXRlY2hhcnQgZnJvbVxyXG4gICAqL1xuXG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKGluaXRpYWxTdGF0ZSkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAodGhpcy5zdGF0dXMgPT09IEludGVycHJldGVyU3RhdHVzLlJ1bm5pbmcpIHtcbiAgICAgIC8vIERvIG5vdCByZXN0YXJ0IHRoZSBzZXJ2aWNlIGlmIGl0IGlzIGFscmVhZHkgc3RhcnRlZFxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSAvLyB5ZXMsIGl0J3MgYSBoYWNrIGJ1dCB3ZSBuZWVkIHRoZSByZWxhdGVkIGNhY2hlIHRvIGJlIHBvcHVsYXRlZCBmb3Igc29tZSB0aGluZ3MgdG8gd29yayAobGlrZSBkZWxheWVkIHRyYW5zaXRpb25zKVxuICAgIC8vIHRoaXMgaXMgdXN1YWxseSBjYWxsZWQgYnkgYG1hY2hpbmUuZ2V0SW5pdGlhbFN0YXRlYCBidXQgaWYgd2UgcmVoeWRyYXRlIGZyb20gYSBzdGF0ZSB3ZSBtaWdodCBieXBhc3MgdGhpcyBjYWxsXG4gICAgLy8gd2UgYWxzbyBkb24ndCB3YW50IHRvIGNhbGwgdGhpcyBtZXRob2QgaGVyZSBhcyBpdCByZXNvbHZlcyB0aGUgZnVsbCBpbml0aWFsIHN0YXRlIHdoaWNoIG1pZ2h0IGludm9sdmUgY2FsbGluZyBhc3NpZ24gYWN0aW9uc1xuICAgIC8vIGFuZCB0aGF0IGNvdWxkIHBvdGVudGlhbGx5IGxlYWQgdG8gc29tZSB1bndhbnRlZCBzaWRlLWVmZmVjdHMgKGV2ZW4gc3VjaCBhcyBjcmVhdGluZyBzb21lIHJvZ3VlIGFjdG9ycylcblxuXG4gICAgdGhpcy5tYWNoaW5lLl9pbml0KCk7XG5cbiAgICByZWdpc3RyeS5yZWdpc3Rlcih0aGlzLnNlc3Npb25JZCwgdGhpcyk7XG4gICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgdGhpcy5zdGF0dXMgPSBJbnRlcnByZXRlclN0YXR1cy5SdW5uaW5nO1xuICAgIHZhciByZXNvbHZlZFN0YXRlID0gaW5pdGlhbFN0YXRlID09PSB1bmRlZmluZWQgPyB0aGlzLmluaXRpYWxTdGF0ZSA6IHByb3ZpZGUodGhpcywgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGlzU3RhdGVDb25maWcoaW5pdGlhbFN0YXRlKSA/IF90aGlzLm1hY2hpbmUucmVzb2x2ZVN0YXRlKGluaXRpYWxTdGF0ZSkgOiBfdGhpcy5tYWNoaW5lLnJlc29sdmVTdGF0ZShTdGF0ZS5mcm9tKGluaXRpYWxTdGF0ZSwgX3RoaXMubWFjaGluZS5jb250ZXh0KSk7XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmRldlRvb2xzKSB7XG4gICAgICB0aGlzLmF0dGFjaERldigpO1xuICAgIH1cblxuICAgIHRoaXMuc2NoZWR1bGVyLmluaXRpYWxpemUoZnVuY3Rpb24gKCkge1xuICAgICAgX3RoaXMudXBkYXRlKHJlc29sdmVkU3RhdGUsIGluaXRFdmVudCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLl9zdG9wQ2hpbGRyZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gVE9ETzogdGhpbmsgYWJvdXQgY29udmVydGluZyB0aG9zZSB0byBhY3Rpb25zXG4gICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgaWYgKGlzRnVuY3Rpb24oY2hpbGQuc3RvcCkpIHtcbiAgICAgICAgY2hpbGQuc3RvcCgpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuY2hpbGRyZW4uY2xlYXIoKTtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuX3N0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVfNiwgX2EsIGVfNywgX2IsIGVfOCwgX2MsIGVfOSwgX2QsIGVfMTAsIF9lO1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIF9mID0gX192YWx1ZXModGhpcy5saXN0ZW5lcnMpLCBfZyA9IF9mLm5leHQoKTsgIV9nLmRvbmU7IF9nID0gX2YubmV4dCgpKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lciA9IF9nLnZhbHVlO1xuICAgICAgICB0aGlzLmxpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfNl8xKSB7XG4gICAgICBlXzYgPSB7XG4gICAgICAgIGVycm9yOiBlXzZfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKF9nICYmICFfZy5kb25lICYmIChfYSA9IF9mLnJldHVybikpIF9hLmNhbGwoX2YpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfNikgdGhyb3cgZV82LmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBfaCA9IF9fdmFsdWVzKHRoaXMuc3RvcExpc3RlbmVycyksIF9qID0gX2gubmV4dCgpOyAhX2ouZG9uZTsgX2ogPSBfaC5uZXh0KCkpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVyID0gX2oudmFsdWU7IC8vIGNhbGwgbGlzdGVuZXIsIHRoZW4gcmVtb3ZlXG5cbiAgICAgICAgbGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5zdG9wTGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcik7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV83XzEpIHtcbiAgICAgIGVfNyA9IHtcbiAgICAgICAgZXJyb3I6IGVfN18xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoX2ogJiYgIV9qLmRvbmUgJiYgKF9iID0gX2gucmV0dXJuKSkgX2IuY2FsbChfaCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV83KSB0aHJvdyBlXzcuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIF9rID0gX192YWx1ZXModGhpcy5jb250ZXh0TGlzdGVuZXJzKSwgX2wgPSBfay5uZXh0KCk7ICFfbC5kb25lOyBfbCA9IF9rLm5leHQoKSkge1xuICAgICAgICB2YXIgbGlzdGVuZXIgPSBfbC52YWx1ZTtcbiAgICAgICAgdGhpcy5jb250ZXh0TGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcik7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV84XzEpIHtcbiAgICAgIGVfOCA9IHtcbiAgICAgICAgZXJyb3I6IGVfOF8xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoX2wgJiYgIV9sLmRvbmUgJiYgKF9jID0gX2sucmV0dXJuKSkgX2MuY2FsbChfayk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV84KSB0aHJvdyBlXzguZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIF9tID0gX192YWx1ZXModGhpcy5kb25lTGlzdGVuZXJzKSwgX28gPSBfbS5uZXh0KCk7ICFfby5kb25lOyBfbyA9IF9tLm5leHQoKSkge1xuICAgICAgICB2YXIgbGlzdGVuZXIgPSBfby52YWx1ZTtcbiAgICAgICAgdGhpcy5kb25lTGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcik7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV85XzEpIHtcbiAgICAgIGVfOSA9IHtcbiAgICAgICAgZXJyb3I6IGVfOV8xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoX28gJiYgIV9vLmRvbmUgJiYgKF9kID0gX20ucmV0dXJuKSkgX2QuY2FsbChfbSk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV85KSB0aHJvdyBlXzkuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICAvLyBJbnRlcnByZXRlciBhbHJlYWR5IHN0b3BwZWQ7IGRvIG5vdGhpbmdcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICB0aGlzLnN0YXR1cyA9IEludGVycHJldGVyU3RhdHVzLlN0b3BwZWQ7XG4gICAgdGhpcy5faW5pdGlhbFN0YXRlID0gdW5kZWZpbmVkO1xuXG4gICAgdHJ5IHtcbiAgICAgIC8vIHdlIGFyZSBnb2luZyB0byBzdG9wIHdpdGhpbiB0aGUgY3VycmVudCBzeW5jIGZyYW1lXG4gICAgICAvLyBzbyB3ZSBjYW4gc2FmZWx5IGp1c3QgY2FuY2VsIHRoaXMgaGVyZSBhcyBub3RoaW5nIGFzeW5jIHNob3VsZCBiZSBmaXJlZCBhbnl3YXlcbiAgICAgIGZvciAodmFyIF9wID0gX192YWx1ZXMoT2JqZWN0LmtleXModGhpcy5kZWxheWVkRXZlbnRzTWFwKSksIF9xID0gX3AubmV4dCgpOyAhX3EuZG9uZTsgX3EgPSBfcC5uZXh0KCkpIHtcbiAgICAgICAgdmFyIGtleSA9IF9xLnZhbHVlO1xuICAgICAgICB0aGlzLmNsb2NrLmNsZWFyVGltZW91dCh0aGlzLmRlbGF5ZWRFdmVudHNNYXBba2V5XSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV8xMF8xKSB7XG4gICAgICBlXzEwID0ge1xuICAgICAgICBlcnJvcjogZV8xMF8xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoX3EgJiYgIV9xLmRvbmUgJiYgKF9lID0gX3AucmV0dXJuKSkgX2UuY2FsbChfcCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV8xMCkgdGhyb3cgZV8xMC5lcnJvcjtcbiAgICAgIH1cbiAgICB9IC8vIGNsZWFyIGV2ZXJ5dGhpbmcgdGhhdCBtaWdodCBiZSBlbnF1ZXVlZFxuXG5cbiAgICB0aGlzLnNjaGVkdWxlci5jbGVhcigpO1xuICAgIHRoaXMuc2NoZWR1bGVyID0gbmV3IFNjaGVkdWxlcih7XG4gICAgICBkZWZlckV2ZW50czogdGhpcy5vcHRpb25zLmRlZmVyRXZlbnRzXG4gICAgfSk7XG4gIH07XG4gIC8qKlxyXG4gICAqIFN0b3BzIHRoZSBpbnRlcnByZXRlciBhbmQgdW5zdWJzY3JpYmUgYWxsIGxpc3RlbmVycy5cclxuICAgKlxyXG4gICAqIFRoaXMgd2lsbCBhbHNvIG5vdGlmeSB0aGUgYG9uU3RvcGAgbGlzdGVuZXJzLlxyXG4gICAqL1xuXG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gVE9ETzogYWRkIHdhcm5pbmcgZm9yIHN0b3BwaW5nIG5vbi1yb290IGludGVycHJldGVyc1xuICAgIHZhciBfdGhpcyA9IHRoaXM7IC8vIGdyYWIgdGhlIGN1cnJlbnQgc2NoZWR1bGVyIGFzIGl0IHdpbGwgYmUgcmVwbGFjZWQgaW4gX3N0b3BcblxuXG4gICAgdmFyIHNjaGVkdWxlciA9IHRoaXMuc2NoZWR1bGVyO1xuXG4gICAgdGhpcy5fc3RvcCgpOyAvLyBsZXQgd2hhdCBpcyBjdXJyZW50bHkgcHJvY2Vzc2VkIHRvIGJlIGZpbmlzaGVkXG5cblxuICAgIHNjaGVkdWxlci5zY2hlZHVsZShmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBpdCBmZWVscyB3ZWlyZCB0byBoYW5kbGUgdGhpcyBoZXJlIGJ1dCB3ZSBuZWVkIHRvIGhhbmRsZSB0aGlzIGV2ZW4gc2xpZ2h0bHkgXCJvdXQgb2YgYmFuZFwiXG4gICAgICB2YXIgX2V2ZW50ID0gdG9TQ1hNTEV2ZW50KHtcbiAgICAgICAgdHlwZTogJ3hzdGF0ZS5zdG9wJ1xuICAgICAgfSk7XG5cbiAgICAgIHZhciBuZXh0U3RhdGUgPSBwcm92aWRlKF90aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBleGl0QWN0aW9ucyA9IGZsYXR0ZW4oX19zcHJlYWRBcnJheShbXSwgX19yZWFkKF90aGlzLnN0YXRlLmNvbmZpZ3VyYXRpb24pLCBmYWxzZSkuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgIHJldHVybiBiLm9yZGVyIC0gYS5vcmRlcjtcbiAgICAgICAgfSkubWFwKGZ1bmN0aW9uIChzdGF0ZU5vZGUpIHtcbiAgICAgICAgICByZXR1cm4gdG9BY3Rpb25PYmplY3RzKHN0YXRlTm9kZS5vbkV4aXQsIF90aGlzLm1hY2hpbmUub3B0aW9ucy5hY3Rpb25zKTtcbiAgICAgICAgfSkpO1xuXG4gICAgICAgIHZhciBfYSA9IF9fcmVhZChyZXNvbHZlQWN0aW9ucyhfdGhpcy5tYWNoaW5lLCBfdGhpcy5zdGF0ZSwgX3RoaXMuc3RhdGUuY29udGV4dCwgX2V2ZW50LCBbe1xuICAgICAgICAgIHR5cGU6ICdleGl0JyxcbiAgICAgICAgICBhY3Rpb25zOiBleGl0QWN0aW9uc1xuICAgICAgICB9XSwgX3RoaXMubWFjaGluZS5jb25maWcucHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHMgPyBfdGhpcy5fZXhlYyA6IHVuZGVmaW5lZCwgX3RoaXMubWFjaGluZS5jb25maWcucHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHMgfHwgX3RoaXMubWFjaGluZS5jb25maWcucHJlc2VydmVBY3Rpb25PcmRlciksIDIpLFxuICAgICAgICAgICAgcmVzb2x2ZWRBY3Rpb25zID0gX2FbMF0sXG4gICAgICAgICAgICB1cGRhdGVkQ29udGV4dCA9IF9hWzFdO1xuXG4gICAgICAgIHZhciBuZXdTdGF0ZSA9IG5ldyBTdGF0ZSh7XG4gICAgICAgICAgdmFsdWU6IF90aGlzLnN0YXRlLnZhbHVlLFxuICAgICAgICAgIGNvbnRleHQ6IHVwZGF0ZWRDb250ZXh0LFxuICAgICAgICAgIF9ldmVudDogX2V2ZW50LFxuICAgICAgICAgIF9zZXNzaW9uaWQ6IF90aGlzLnNlc3Npb25JZCxcbiAgICAgICAgICBoaXN0b3J5VmFsdWU6IHVuZGVmaW5lZCxcbiAgICAgICAgICBoaXN0b3J5OiBfdGhpcy5zdGF0ZSxcbiAgICAgICAgICBhY3Rpb25zOiByZXNvbHZlZEFjdGlvbnMuZmlsdGVyKGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgICAgICAgIHJldHVybiAhaXNSYWlzYWJsZUFjdGlvbihhY3Rpb24pO1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIGFjdGl2aXRpZXM6IHt9LFxuICAgICAgICAgIGV2ZW50czogW10sXG4gICAgICAgICAgY29uZmlndXJhdGlvbjogW10sXG4gICAgICAgICAgdHJhbnNpdGlvbnM6IFtdLFxuICAgICAgICAgIGNoaWxkcmVuOiB7fSxcbiAgICAgICAgICBkb25lOiBfdGhpcy5zdGF0ZS5kb25lLFxuICAgICAgICAgIHRhZ3M6IF90aGlzLnN0YXRlLnRhZ3MsXG4gICAgICAgICAgbWFjaGluZTogX3RoaXMubWFjaGluZVxuICAgICAgICB9KTtcbiAgICAgICAgbmV3U3RhdGUuY2hhbmdlZCA9IHRydWU7XG4gICAgICAgIHJldHVybiBuZXdTdGF0ZTtcbiAgICAgIH0pO1xuXG4gICAgICBfdGhpcy51cGRhdGUobmV4dFN0YXRlLCBfZXZlbnQpO1xuXG4gICAgICBfdGhpcy5fc3RvcENoaWxkcmVuKCk7XG5cbiAgICAgIHJlZ2lzdHJ5LmZyZWUoX3RoaXMuc2Vzc2lvbklkKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuYmF0Y2ggPSBmdW5jdGlvbiAoZXZlbnRzKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gSW50ZXJwcmV0ZXJTdGF0dXMuTm90U3RhcnRlZCAmJiB0aGlzLm9wdGlvbnMuZGVmZXJFdmVudHMpIHtcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1jb25zb2xlXG4gICAgICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICAgICAgd2FybihmYWxzZSwgXCJcIi5jb25jYXQoZXZlbnRzLmxlbmd0aCwgXCIgZXZlbnQocykgd2VyZSBzZW50IHRvIHVuaW5pdGlhbGl6ZWQgc2VydmljZSBcXFwiXCIpLmNvbmNhdCh0aGlzLm1hY2hpbmUuaWQsIFwiXFxcIiBhbmQgYXJlIGRlZmVycmVkLiBNYWtlIHN1cmUgLnN0YXJ0KCkgaXMgY2FsbGVkIGZvciB0aGlzIHNlcnZpY2UuXFxuRXZlbnQ6IFwiKS5jb25jYXQoSlNPTi5zdHJpbmdpZnkoZXZlbnQpKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXR1cyAhPT0gSW50ZXJwcmV0ZXJTdGF0dXMuUnVubmluZykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICBcIlwiLmNvbmNhdChldmVudHMubGVuZ3RoLCBcIiBldmVudChzKSB3ZXJlIHNlbnQgdG8gdW5pbml0aWFsaXplZCBzZXJ2aWNlIFxcXCJcIikuY29uY2F0KHRoaXMubWFjaGluZS5pZCwgXCJcXFwiLiBNYWtlIHN1cmUgLnN0YXJ0KCkgaXMgY2FsbGVkIGZvciB0aGlzIHNlcnZpY2UsIG9yIHNldCB7IGRlZmVyRXZlbnRzOiB0cnVlIH0gaW4gdGhlIHNlcnZpY2Ugb3B0aW9ucy5cIikpO1xuICAgIH1cblxuICAgIGlmICghZXZlbnRzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBleGVjID0gISF0aGlzLm1hY2hpbmUuY29uZmlnLnByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzICYmIHRoaXMuX2V4ZWM7XG4gICAgdGhpcy5zY2hlZHVsZXIuc2NoZWR1bGUoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGVfMTEsIF9hO1xuXG4gICAgICB2YXIgbmV4dFN0YXRlID0gX3RoaXMuc3RhdGU7XG4gICAgICB2YXIgYmF0Y2hDaGFuZ2VkID0gZmFsc2U7XG4gICAgICB2YXIgYmF0Y2hlZEFjdGlvbnMgPSBbXTtcblxuICAgICAgdmFyIF9sb29wXzEgPSBmdW5jdGlvbiAoZXZlbnRfMSkge1xuICAgICAgICB2YXIgX2V2ZW50ID0gdG9TQ1hNTEV2ZW50KGV2ZW50XzEpO1xuXG4gICAgICAgIF90aGlzLmZvcndhcmQoX2V2ZW50KTtcblxuICAgICAgICBuZXh0U3RhdGUgPSBwcm92aWRlKF90aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLm1hY2hpbmUudHJhbnNpdGlvbihuZXh0U3RhdGUsIF9ldmVudCwgdW5kZWZpbmVkLCBleGVjIHx8IHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuICAgICAgICBiYXRjaGVkQWN0aW9ucy5wdXNoLmFwcGx5KGJhdGNoZWRBY3Rpb25zLCBfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQoX3RoaXMubWFjaGluZS5jb25maWcucHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHMgPyBuZXh0U3RhdGUuYWN0aW9ucyA6IG5leHRTdGF0ZS5hY3Rpb25zLm1hcChmdW5jdGlvbiAoYSkge1xuICAgICAgICAgIHJldHVybiBiaW5kQWN0aW9uVG9TdGF0ZShhLCBuZXh0U3RhdGUpO1xuICAgICAgICB9KSksIGZhbHNlKSk7XG4gICAgICAgIGJhdGNoQ2hhbmdlZCA9IGJhdGNoQ2hhbmdlZCB8fCAhIW5leHRTdGF0ZS5jaGFuZ2VkO1xuICAgICAgfTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yICh2YXIgZXZlbnRzXzEgPSBfX3ZhbHVlcyhldmVudHMpLCBldmVudHNfMV8xID0gZXZlbnRzXzEubmV4dCgpOyAhZXZlbnRzXzFfMS5kb25lOyBldmVudHNfMV8xID0gZXZlbnRzXzEubmV4dCgpKSB7XG4gICAgICAgICAgdmFyIGV2ZW50XzEgPSBldmVudHNfMV8xLnZhbHVlO1xuXG4gICAgICAgICAgX2xvb3BfMShldmVudF8xKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZV8xMV8xKSB7XG4gICAgICAgIGVfMTEgPSB7XG4gICAgICAgICAgZXJyb3I6IGVfMTFfMVxuICAgICAgICB9O1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoZXZlbnRzXzFfMSAmJiAhZXZlbnRzXzFfMS5kb25lICYmIChfYSA9IGV2ZW50c18xLnJldHVybikpIF9hLmNhbGwoZXZlbnRzXzEpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIGlmIChlXzExKSB0aHJvdyBlXzExLmVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIG5leHRTdGF0ZS5jaGFuZ2VkID0gYmF0Y2hDaGFuZ2VkO1xuICAgICAgbmV4dFN0YXRlLmFjdGlvbnMgPSBiYXRjaGVkQWN0aW9ucztcblxuICAgICAgX3RoaXMudXBkYXRlKG5leHRTdGF0ZSwgdG9TQ1hNTEV2ZW50KGV2ZW50c1tldmVudHMubGVuZ3RoIC0gMV0pKTtcbiAgICB9KTtcbiAgfTtcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhIHNlbmQgZnVuY3Rpb24gYm91bmQgdG8gdGhpcyBpbnRlcnByZXRlciBpbnN0YW5jZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQgdG8gYmUgc2VudCBieSB0aGUgc2VuZGVyLlxyXG4gICAqL1xuXG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnNlbmRlciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHJldHVybiB0aGlzLnNlbmQuYmluZCh0aGlzLCBldmVudCk7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLl9uZXh0U3RhdGUgPSBmdW5jdGlvbiAoZXZlbnQsIGV4ZWMpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKGV4ZWMgPT09IHZvaWQgMCkge1xuICAgICAgZXhlYyA9ICEhdGhpcy5tYWNoaW5lLmNvbmZpZy5wcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50cyAmJiB0aGlzLl9leGVjO1xuICAgIH1cblxuICAgIHZhciBfZXZlbnQgPSB0b1NDWE1MRXZlbnQoZXZlbnQpO1xuXG4gICAgaWYgKF9ldmVudC5uYW1lLmluZGV4T2YoZXJyb3JQbGF0Zm9ybSkgPT09IDAgJiYgIXRoaXMuc3RhdGUubmV4dEV2ZW50cy5zb21lKGZ1bmN0aW9uIChuZXh0RXZlbnQpIHtcbiAgICAgIHJldHVybiBuZXh0RXZlbnQuaW5kZXhPZihlcnJvclBsYXRmb3JtKSA9PT0gMDtcbiAgICB9KSkge1xuICAgICAgdGhyb3cgX2V2ZW50LmRhdGEuZGF0YTtcbiAgICB9XG5cbiAgICB2YXIgbmV4dFN0YXRlID0gcHJvdmlkZSh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gX3RoaXMubWFjaGluZS50cmFuc2l0aW9uKF90aGlzLnN0YXRlLCBfZXZlbnQsIHVuZGVmaW5lZCwgZXhlYyB8fCB1bmRlZmluZWQpO1xuICAgIH0pO1xuICAgIHJldHVybiBuZXh0U3RhdGU7XG4gIH07XG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIG5leHQgc3RhdGUgZ2l2ZW4gdGhlIGludGVycHJldGVyJ3MgY3VycmVudCBzdGF0ZSBhbmQgdGhlIGV2ZW50LlxyXG4gICAqXHJcbiAgICogVGhpcyBpcyBhIHB1cmUgbWV0aG9kIHRoYXQgZG9lcyBfbm90XyB1cGRhdGUgdGhlIGludGVycHJldGVyJ3Mgc3RhdGUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50IHRvIGRldGVybWluZSB0aGUgbmV4dCBzdGF0ZVxyXG4gICAqL1xuXG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLm5leHRTdGF0ZSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHJldHVybiB0aGlzLl9uZXh0U3RhdGUoZXZlbnQsIGZhbHNlKTtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuZm9yd2FyZCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBlXzEyLCBfYTtcblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBfYiA9IF9fdmFsdWVzKHRoaXMuZm9yd2FyZFRvKSwgX2MgPSBfYi5uZXh0KCk7ICFfYy5kb25lOyBfYyA9IF9iLm5leHQoKSkge1xuICAgICAgICB2YXIgaWQgPSBfYy52YWx1ZTtcbiAgICAgICAgdmFyIGNoaWxkID0gdGhpcy5jaGlsZHJlbi5nZXQoaWQpO1xuXG4gICAgICAgIGlmICghY2hpbGQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmFibGUgdG8gZm9yd2FyZCBldmVudCAnXCIuY29uY2F0KGV2ZW50LCBcIicgZnJvbSBpbnRlcnByZXRlciAnXCIpLmNvbmNhdCh0aGlzLmlkLCBcIicgdG8gbm9uZXhpc3RhbnQgY2hpbGQgJ1wiKS5jb25jYXQoaWQsIFwiJy5cIikpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2hpbGQuc2VuZChldmVudCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV8xMl8xKSB7XG4gICAgICBlXzEyID0ge1xuICAgICAgICBlcnJvcjogZV8xMl8xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoX2MgJiYgIV9jLmRvbmUgJiYgKF9hID0gX2IucmV0dXJuKSkgX2EuY2FsbChfYik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV8xMikgdGhyb3cgZV8xMi5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLmRlZmVyID0gZnVuY3Rpb24gKHNlbmRBY3Rpb24pIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIHRpbWVySWQgPSB0aGlzLmNsb2NrLnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCd0bycgaW4gc2VuZEFjdGlvbiAmJiBzZW5kQWN0aW9uLnRvKSB7XG4gICAgICAgIF90aGlzLnNlbmRUbyhzZW5kQWN0aW9uLl9ldmVudCwgc2VuZEFjdGlvbi50bywgdHJ1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfdGhpcy5zZW5kKHNlbmRBY3Rpb24uX2V2ZW50KTtcbiAgICAgIH1cbiAgICB9LCBzZW5kQWN0aW9uLmRlbGF5KTtcblxuICAgIGlmIChzZW5kQWN0aW9uLmlkKSB7XG4gICAgICB0aGlzLmRlbGF5ZWRFdmVudHNNYXBbc2VuZEFjdGlvbi5pZF0gPSB0aW1lcklkO1xuICAgIH1cbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuY2FuY2VsID0gZnVuY3Rpb24gKHNlbmRJZCkge1xuICAgIHRoaXMuY2xvY2suY2xlYXJUaW1lb3V0KHRoaXMuZGVsYXllZEV2ZW50c01hcFtzZW5kSWRdKTtcbiAgICBkZWxldGUgdGhpcy5kZWxheWVkRXZlbnRzTWFwW3NlbmRJZF07XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLmV4ZWMgPSBmdW5jdGlvbiAoYWN0aW9uLCBzdGF0ZSwgYWN0aW9uRnVuY3Rpb25NYXApIHtcbiAgICBpZiAoYWN0aW9uRnVuY3Rpb25NYXAgPT09IHZvaWQgMCkge1xuICAgICAgYWN0aW9uRnVuY3Rpb25NYXAgPSB0aGlzLm1hY2hpbmUub3B0aW9ucy5hY3Rpb25zO1xuICAgIH1cblxuICAgIHRoaXMuX2V4ZWMoYWN0aW9uLCBzdGF0ZS5jb250ZXh0LCBzdGF0ZS5fZXZlbnQsIGFjdGlvbkZ1bmN0aW9uTWFwKTtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUucmVtb3ZlQ2hpbGQgPSBmdW5jdGlvbiAoY2hpbGRJZCkge1xuICAgIHZhciBfYTtcblxuICAgIHRoaXMuY2hpbGRyZW4uZGVsZXRlKGNoaWxkSWQpO1xuICAgIHRoaXMuZm9yd2FyZFRvLmRlbGV0ZShjaGlsZElkKTsgLy8gdGhpcy5zdGF0ZSBtaWdodCBub3QgZXhpc3QgYXQgdGhlIHRpbWUgdGhpcyBpcyBjYWxsZWQsXG4gICAgLy8gc3VjaCBhcyB3aGVuIGEgY2hpbGQgaXMgYWRkZWQgdGhlbiByZW1vdmVkIHdoaWxlIGluaXRpYWxpemluZyB0aGUgc3RhdGVcblxuICAgIChfYSA9IHRoaXMuc3RhdGUpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB0cnVlIDogZGVsZXRlIF9hLmNoaWxkcmVuW2NoaWxkSWRdO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5zdG9wQ2hpbGQgPSBmdW5jdGlvbiAoY2hpbGRJZCkge1xuICAgIHZhciBjaGlsZCA9IHRoaXMuY2hpbGRyZW4uZ2V0KGNoaWxkSWQpO1xuXG4gICAgaWYgKCFjaGlsZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucmVtb3ZlQ2hpbGQoY2hpbGRJZCk7XG5cbiAgICBpZiAoaXNGdW5jdGlvbihjaGlsZC5zdG9wKSkge1xuICAgICAgY2hpbGQuc3RvcCgpO1xuICAgIH1cbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuc3Bhd24gPSBmdW5jdGlvbiAoZW50aXR5LCBuYW1lLCBvcHRpb25zKSB7XG4gICAgaWYgKHRoaXMuc3RhdHVzICE9PSBJbnRlcnByZXRlclN0YXR1cy5SdW5uaW5nKSB7XG4gICAgICByZXR1cm4gY3JlYXRlRGVmZXJyZWRBY3RvcihlbnRpdHksIG5hbWUpO1xuICAgIH1cblxuICAgIGlmIChpc1Byb21pc2VMaWtlKGVudGl0eSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnNwYXduUHJvbWlzZShQcm9taXNlLnJlc29sdmUoZW50aXR5KSwgbmFtZSk7XG4gICAgfSBlbHNlIGlmIChpc0Z1bmN0aW9uKGVudGl0eSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnNwYXduQ2FsbGJhY2soZW50aXR5LCBuYW1lKTtcbiAgICB9IGVsc2UgaWYgKGlzU3Bhd25lZEFjdG9yKGVudGl0eSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnNwYXduQWN0b3IoZW50aXR5LCBuYW1lKTtcbiAgICB9IGVsc2UgaWYgKGlzT2JzZXJ2YWJsZShlbnRpdHkpKSB7XG4gICAgICByZXR1cm4gdGhpcy5zcGF3bk9ic2VydmFibGUoZW50aXR5LCBuYW1lKTtcbiAgICB9IGVsc2UgaWYgKGlzTWFjaGluZShlbnRpdHkpKSB7XG4gICAgICByZXR1cm4gdGhpcy5zcGF3bk1hY2hpbmUoZW50aXR5LCBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgb3B0aW9ucyksIHtcbiAgICAgICAgaWQ6IG5hbWVcbiAgICAgIH0pKTtcbiAgICB9IGVsc2UgaWYgKGlzQmVoYXZpb3IoZW50aXR5KSkge1xuICAgICAgcmV0dXJuIHRoaXMuc3Bhd25CZWhhdmlvcihlbnRpdHksIG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmFibGUgdG8gc3Bhd24gZW50aXR5IFxcXCJcIi5jb25jYXQobmFtZSwgXCJcXFwiIG9mIHR5cGUgXFxcIlwiKS5jb25jYXQodHlwZW9mIGVudGl0eSwgXCJcXFwiLlwiKSk7XG4gICAgfVxuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5zcGF3bk1hY2hpbmUgPSBmdW5jdGlvbiAobWFjaGluZSwgb3B0aW9ucykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuXG4gICAgdmFyIGNoaWxkU2VydmljZSA9IG5ldyBJbnRlcnByZXRlcihtYWNoaW5lLCBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgdGhpcy5vcHRpb25zKSwge1xuICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgaWQ6IG9wdGlvbnMuaWQgfHwgbWFjaGluZS5pZFxuICAgIH0pKTtcblxuICAgIHZhciByZXNvbHZlZE9wdGlvbnMgPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgREVGQVVMVF9TUEFXTl9PUFRJT05TKSwgb3B0aW9ucyk7XG5cbiAgICBpZiAocmVzb2x2ZWRPcHRpb25zLnN5bmMpIHtcbiAgICAgIGNoaWxkU2VydmljZS5vblRyYW5zaXRpb24oZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICAgIF90aGlzLnNlbmQodXBkYXRlLCB7XG4gICAgICAgICAgc3RhdGU6IHN0YXRlLFxuICAgICAgICAgIGlkOiBjaGlsZFNlcnZpY2UuaWRcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB2YXIgYWN0b3IgPSBjaGlsZFNlcnZpY2U7XG4gICAgdGhpcy5jaGlsZHJlbi5zZXQoY2hpbGRTZXJ2aWNlLmlkLCBhY3Rvcik7XG5cbiAgICBpZiAocmVzb2x2ZWRPcHRpb25zLmF1dG9Gb3J3YXJkKSB7XG4gICAgICB0aGlzLmZvcndhcmRUby5hZGQoY2hpbGRTZXJ2aWNlLmlkKTtcbiAgICB9XG5cbiAgICBjaGlsZFNlcnZpY2Uub25Eb25lKGZ1bmN0aW9uIChkb25lRXZlbnQpIHtcbiAgICAgIF90aGlzLnJlbW92ZUNoaWxkKGNoaWxkU2VydmljZS5pZCk7XG5cbiAgICAgIF90aGlzLnNlbmQodG9TQ1hNTEV2ZW50KGRvbmVFdmVudCwge1xuICAgICAgICBvcmlnaW46IGNoaWxkU2VydmljZS5pZFxuICAgICAgfSkpO1xuICAgIH0pLnN0YXJ0KCk7XG4gICAgcmV0dXJuIGFjdG9yO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5zcGF3bkJlaGF2aW9yID0gZnVuY3Rpb24gKGJlaGF2aW9yLCBpZCkge1xuICAgIHZhciBhY3RvclJlZiA9IHNwYXduQmVoYXZpb3IoYmVoYXZpb3IsIHtcbiAgICAgIGlkOiBpZCxcbiAgICAgIHBhcmVudDogdGhpc1xuICAgIH0pO1xuICAgIHRoaXMuY2hpbGRyZW4uc2V0KGlkLCBhY3RvclJlZik7XG4gICAgcmV0dXJuIGFjdG9yUmVmO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5zcGF3blByb21pc2UgPSBmdW5jdGlvbiAocHJvbWlzZSwgaWQpIHtcbiAgICB2YXIgX2E7XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIGNhbmNlbGVkID0gZmFsc2U7XG4gICAgdmFyIHJlc29sdmVkRGF0YTtcbiAgICBwcm9taXNlLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBpZiAoIWNhbmNlbGVkKSB7XG4gICAgICAgIHJlc29sdmVkRGF0YSA9IHJlc3BvbnNlO1xuXG4gICAgICAgIF90aGlzLnJlbW92ZUNoaWxkKGlkKTtcblxuICAgICAgICBfdGhpcy5zZW5kKHRvU0NYTUxFdmVudChkb25lSW52b2tlKGlkLCByZXNwb25zZSksIHtcbiAgICAgICAgICBvcmlnaW46IGlkXG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICB9LCBmdW5jdGlvbiAoZXJyb3JEYXRhKSB7XG4gICAgICBpZiAoIWNhbmNlbGVkKSB7XG4gICAgICAgIF90aGlzLnJlbW92ZUNoaWxkKGlkKTtcblxuICAgICAgICB2YXIgZXJyb3JFdmVudCA9IGVycm9yKGlkLCBlcnJvckRhdGEpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgLy8gU2VuZCBcImVycm9yLnBsYXRmb3JtLmlkXCIgdG8gdGhpcyAocGFyZW50KS5cbiAgICAgICAgICBfdGhpcy5zZW5kKHRvU0NYTUxFdmVudChlcnJvckV2ZW50LCB7XG4gICAgICAgICAgICBvcmlnaW46IGlkXG4gICAgICAgICAgfSkpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIHJlcG9ydFVuaGFuZGxlZEV4Y2VwdGlvbk9uSW52b2NhdGlvbihlcnJvckRhdGEsIGVycm9yLCBpZCk7XG5cbiAgICAgICAgICBpZiAoX3RoaXMuZGV2VG9vbHMpIHtcbiAgICAgICAgICAgIF90aGlzLmRldlRvb2xzLnNlbmQoZXJyb3JFdmVudCwgX3RoaXMuc3RhdGUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChfdGhpcy5tYWNoaW5lLnN0cmljdCkge1xuICAgICAgICAgICAgLy8gaXQgd291bGQgYmUgYmV0dGVyIHRvIGFsd2F5cyBzdG9wIHRoZSBzdGF0ZSBtYWNoaW5lIGlmIHVuaGFuZGxlZFxuICAgICAgICAgICAgLy8gZXhjZXB0aW9uL3Byb21pc2UgcmVqZWN0aW9uIGhhcHBlbnMgYnV0IGJlY2F1c2Ugd2UgZG9uJ3Qgd2FudCB0b1xuICAgICAgICAgICAgLy8gYnJlYWsgZXhpc3RpbmcgY29kZSBzbyBlbmZvcmNlIGl0IG9uIHN0cmljdCBtb2RlIG9ubHkgZXNwZWNpYWxseSBzb1xuICAgICAgICAgICAgLy8gYmVjYXVzZSBkb2N1bWVudGF0aW9uIHNheXMgdGhhdCBvbkVycm9yIGlzIG9wdGlvbmFsXG4gICAgICAgICAgICBfdGhpcy5zdG9wKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGFjdG9yID0gKF9hID0ge1xuICAgICAgaWQ6IGlkLFxuICAgICAgc2VuZDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgICAgfSxcbiAgICAgIHN1YnNjcmliZTogZnVuY3Rpb24gKG5leHQsIGhhbmRsZUVycm9yLCBjb21wbGV0ZSkge1xuICAgICAgICB2YXIgb2JzZXJ2ZXIgPSB0b09ic2VydmVyKG5leHQsIGhhbmRsZUVycm9yLCBjb21wbGV0ZSk7XG4gICAgICAgIHZhciB1bnN1YnNjcmliZWQgPSBmYWxzZTtcbiAgICAgICAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgIGlmICh1bnN1YnNjcmliZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBvYnNlcnZlci5uZXh0KHJlc3BvbnNlKTtcblxuICAgICAgICAgIGlmICh1bnN1YnNjcmliZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgaWYgKHVuc3Vic2NyaWJlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG9ic2VydmVyLmVycm9yKGVycik7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5zdWJzY3JpYmVkID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYW5jZWxlZCA9IHRydWU7XG4gICAgICB9LFxuICAgICAgdG9KU09OOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaWQ6IGlkXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgZ2V0U25hcHNob3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHJlc29sdmVkRGF0YTtcbiAgICAgIH1cbiAgICB9LCBfYVtzeW1ib2xPYnNlcnZhYmxlXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sIF9hKTtcbiAgICB0aGlzLmNoaWxkcmVuLnNldChpZCwgYWN0b3IpO1xuICAgIHJldHVybiBhY3RvcjtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuc3Bhd25DYWxsYmFjayA9IGZ1bmN0aW9uIChjYWxsYmFjaywgaWQpIHtcbiAgICB2YXIgX2E7XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIGNhbmNlbGVkID0gZmFsc2U7XG4gICAgdmFyIHJlY2VpdmVycyA9IG5ldyBTZXQoKTtcbiAgICB2YXIgbGlzdGVuZXJzID0gbmV3IFNldCgpO1xuICAgIHZhciBlbWl0dGVkO1xuXG4gICAgdmFyIHJlY2VpdmUgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgZW1pdHRlZCA9IGU7XG4gICAgICBsaXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICAgICAgcmV0dXJuIGxpc3RlbmVyKGUpO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChjYW5jZWxlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIF90aGlzLnNlbmQodG9TQ1hNTEV2ZW50KGUsIHtcbiAgICAgICAgb3JpZ2luOiBpZFxuICAgICAgfSkpO1xuICAgIH07XG5cbiAgICB2YXIgY2FsbGJhY2tTdG9wO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNhbGxiYWNrU3RvcCA9IGNhbGxiYWNrKHJlY2VpdmUsIGZ1bmN0aW9uIChuZXdMaXN0ZW5lcikge1xuICAgICAgICByZWNlaXZlcnMuYWRkKG5ld0xpc3RlbmVyKTtcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5zZW5kKGVycm9yKGlkLCBlcnIpKTtcbiAgICB9XG5cbiAgICBpZiAoaXNQcm9taXNlTGlrZShjYWxsYmFja1N0b3ApKSB7XG4gICAgICAvLyBpdCB0dXJuZWQgb3V0IHRvIGJlIGFuIGFzeW5jIGZ1bmN0aW9uLCBjYW4ndCByZWxpYWJseSBjaGVjayB0aGlzIGJlZm9yZSBjYWxsaW5nIGBjYWxsYmFja2BcbiAgICAgIC8vIGJlY2F1c2UgdHJhbnNwaWxlZCBhc3luYyBmdW5jdGlvbnMgYXJlIG5vdCByZWNvZ25pemFibGVcbiAgICAgIHJldHVybiB0aGlzLnNwYXduUHJvbWlzZShjYWxsYmFja1N0b3AsIGlkKTtcbiAgICB9XG5cbiAgICB2YXIgYWN0b3IgPSAoX2EgPSB7XG4gICAgICBpZDogaWQsXG4gICAgICBzZW5kOiBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgcmV0dXJuIHJlY2VpdmVycy5mb3JFYWNoKGZ1bmN0aW9uIChyZWNlaXZlcikge1xuICAgICAgICAgIHJldHVybiByZWNlaXZlcihldmVudCk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIHN1YnNjcmliZTogZnVuY3Rpb24gKG5leHQpIHtcbiAgICAgICAgdmFyIG9ic2VydmVyID0gdG9PYnNlcnZlcihuZXh0KTtcbiAgICAgICAgbGlzdGVuZXJzLmFkZChvYnNlcnZlci5uZXh0KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbGlzdGVuZXJzLmRlbGV0ZShvYnNlcnZlci5uZXh0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgc3RvcDogZnVuY3Rpb24gKCkge1xuICAgICAgICBjYW5jZWxlZCA9IHRydWU7XG5cbiAgICAgICAgaWYgKGlzRnVuY3Rpb24oY2FsbGJhY2tTdG9wKSkge1xuICAgICAgICAgIGNhbGxiYWNrU3RvcCgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdG9KU09OOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaWQ6IGlkXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgZ2V0U25hcHNob3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGVtaXR0ZWQ7XG4gICAgICB9XG4gICAgfSwgX2Fbc3ltYm9sT2JzZXJ2YWJsZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LCBfYSk7XG4gICAgdGhpcy5jaGlsZHJlbi5zZXQoaWQsIGFjdG9yKTtcbiAgICByZXR1cm4gYWN0b3I7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnNwYXduT2JzZXJ2YWJsZSA9IGZ1bmN0aW9uIChzb3VyY2UsIGlkKSB7XG4gICAgdmFyIF9hO1xuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBlbWl0dGVkO1xuICAgIHZhciBzdWJzY3JpcHRpb24gPSBzb3VyY2Uuc3Vic2NyaWJlKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgZW1pdHRlZCA9IHZhbHVlO1xuXG4gICAgICBfdGhpcy5zZW5kKHRvU0NYTUxFdmVudCh2YWx1ZSwge1xuICAgICAgICBvcmlnaW46IGlkXG4gICAgICB9KSk7XG4gICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgX3RoaXMucmVtb3ZlQ2hpbGQoaWQpO1xuXG4gICAgICBfdGhpcy5zZW5kKHRvU0NYTUxFdmVudChlcnJvcihpZCwgZXJyKSwge1xuICAgICAgICBvcmlnaW46IGlkXG4gICAgICB9KSk7XG4gICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgX3RoaXMucmVtb3ZlQ2hpbGQoaWQpO1xuXG4gICAgICBfdGhpcy5zZW5kKHRvU0NYTUxFdmVudChkb25lSW52b2tlKGlkKSwge1xuICAgICAgICBvcmlnaW46IGlkXG4gICAgICB9KSk7XG4gICAgfSk7XG4gICAgdmFyIGFjdG9yID0gKF9hID0ge1xuICAgICAgaWQ6IGlkLFxuICAgICAgc2VuZDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgICAgfSxcbiAgICAgIHN1YnNjcmliZTogZnVuY3Rpb24gKG5leHQsIGhhbmRsZUVycm9yLCBjb21wbGV0ZSkge1xuICAgICAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXh0LCBoYW5kbGVFcnJvciwgY29tcGxldGUpO1xuICAgICAgfSxcbiAgICAgIHN0b3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgfSxcbiAgICAgIGdldFNuYXBzaG90OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBlbWl0dGVkO1xuICAgICAgfSxcbiAgICAgIHRvSlNPTjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlkOiBpZFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0sIF9hW3N5bWJvbE9ic2VydmFibGVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSwgX2EpO1xuICAgIHRoaXMuY2hpbGRyZW4uc2V0KGlkLCBhY3Rvcik7XG4gICAgcmV0dXJuIGFjdG9yO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5zcGF3bkFjdG9yID0gZnVuY3Rpb24gKGFjdG9yLCBuYW1lKSB7XG4gICAgdGhpcy5jaGlsZHJlbi5zZXQobmFtZSwgYWN0b3IpO1xuICAgIHJldHVybiBhY3RvcjtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuc3Bhd25BY3Rpdml0eSA9IGZ1bmN0aW9uIChhY3Rpdml0eSkge1xuICAgIHZhciBpbXBsZW1lbnRhdGlvbiA9IHRoaXMubWFjaGluZS5vcHRpb25zICYmIHRoaXMubWFjaGluZS5vcHRpb25zLmFjdGl2aXRpZXMgPyB0aGlzLm1hY2hpbmUub3B0aW9ucy5hY3Rpdml0aWVzW2FjdGl2aXR5LnR5cGVdIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKCFpbXBsZW1lbnRhdGlvbikge1xuICAgICAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgICAgIHdhcm4oZmFsc2UsIFwiTm8gaW1wbGVtZW50YXRpb24gZm91bmQgZm9yIGFjdGl2aXR5ICdcIi5jb25jYXQoYWN0aXZpdHkudHlwZSwgXCInXCIpKTtcbiAgICAgIH0gLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWNvbnNvbGVcblxuXG4gICAgICByZXR1cm47XG4gICAgfSAvLyBTdGFydCBpbXBsZW1lbnRhdGlvblxuXG5cbiAgICB2YXIgZGlzcG9zZSA9IGltcGxlbWVudGF0aW9uKHRoaXMuc3RhdGUuY29udGV4dCwgYWN0aXZpdHkpO1xuICAgIHRoaXMuc3Bhd25FZmZlY3QoYWN0aXZpdHkuaWQsIGRpc3Bvc2UpO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5zcGF3bkVmZmVjdCA9IGZ1bmN0aW9uIChpZCwgZGlzcG9zZSkge1xuICAgIHZhciBfYTtcblxuICAgIHRoaXMuY2hpbGRyZW4uc2V0KGlkLCAoX2EgPSB7XG4gICAgICBpZDogaWQsXG4gICAgICBzZW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgICB9LFxuICAgICAgc3Vic2NyaWJlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSxcbiAgICAgIHN0b3A6IGRpc3Bvc2UgfHwgdW5kZWZpbmVkLFxuICAgICAgZ2V0U25hcHNob3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH0sXG4gICAgICB0b0pTT046IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpZDogaWRcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9LCBfYVtzeW1ib2xPYnNlcnZhYmxlXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sIF9hKSk7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLmF0dGFjaERldiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZ2xvYmFsID0gZ2V0R2xvYmFsKCk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmRldlRvb2xzICYmIGdsb2JhbCkge1xuICAgICAgaWYgKGdsb2JhbC5fX1JFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTl9fKSB7XG4gICAgICAgIHZhciBkZXZUb29sc09wdGlvbnMgPSB0eXBlb2YgdGhpcy5vcHRpb25zLmRldlRvb2xzID09PSAnb2JqZWN0JyA/IHRoaXMub3B0aW9ucy5kZXZUb29scyA6IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5kZXZUb29scyA9IGdsb2JhbC5fX1JFRFVYX0RFVlRPT0xTX0VYVEVOU0lPTl9fLmNvbm5lY3QoX19hc3NpZ24oX19hc3NpZ24oe1xuICAgICAgICAgIG5hbWU6IHRoaXMuaWQsXG4gICAgICAgICAgYXV0b1BhdXNlOiB0cnVlLFxuICAgICAgICAgIHN0YXRlU2FuaXRpemVyOiBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHZhbHVlOiBzdGF0ZS52YWx1ZSxcbiAgICAgICAgICAgICAgY29udGV4dDogc3RhdGUuY29udGV4dCxcbiAgICAgICAgICAgICAgYWN0aW9uczogc3RhdGUuYWN0aW9uc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIGRldlRvb2xzT3B0aW9ucyksIHtcbiAgICAgICAgICBmZWF0dXJlczogX19hc3NpZ24oe1xuICAgICAgICAgICAganVtcDogZmFsc2UsXG4gICAgICAgICAgICBza2lwOiBmYWxzZVxuICAgICAgICAgIH0sIGRldlRvb2xzT3B0aW9ucyA/IGRldlRvb2xzT3B0aW9ucy5mZWF0dXJlcyA6IHVuZGVmaW5lZClcbiAgICAgICAgfSksIHRoaXMubWFjaGluZSk7XG4gICAgICAgIHRoaXMuZGV2VG9vbHMuaW5pdCh0aGlzLnN0YXRlKTtcbiAgICAgIH0gLy8gYWRkIFhTdGF0ZS1zcGVjaWZpYyBkZXYgdG9vbGluZyBob29rXG5cblxuICAgICAgcmVnaXN0ZXJTZXJ2aWNlKHRoaXMpO1xuICAgIH1cbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpZDogdGhpcy5pZFxuICAgIH07XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlW3N5bWJvbE9ic2VydmFibGVdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5nZXRTbmFwc2hvdCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5zdGF0dXMgPT09IEludGVycHJldGVyU3RhdHVzLk5vdFN0YXJ0ZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLmluaXRpYWxTdGF0ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fc3RhdGU7XG4gIH07XG4gIC8qKlxyXG4gICAqIFRoZSBkZWZhdWx0IGludGVycHJldGVyIG9wdGlvbnM6XHJcbiAgICpcclxuICAgKiAtIGBjbG9ja2AgdXNlcyB0aGUgZ2xvYmFsIGBzZXRUaW1lb3V0YCBhbmQgYGNsZWFyVGltZW91dGAgZnVuY3Rpb25zXHJcbiAgICogLSBgbG9nZ2VyYCB1c2VzIHRoZSBnbG9iYWwgYGNvbnNvbGUubG9nKClgIG1ldGhvZFxyXG4gICAqL1xuXG5cbiAgSW50ZXJwcmV0ZXIuZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgZXhlY3V0ZTogdHJ1ZSxcbiAgICBkZWZlckV2ZW50czogdHJ1ZSxcbiAgICBjbG9jazoge1xuICAgICAgc2V0VGltZW91dDogZnVuY3Rpb24gKGZuLCBtcykge1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmbiwgbXMpO1xuICAgICAgfSxcbiAgICAgIGNsZWFyVGltZW91dDogZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQoaWQpO1xuICAgICAgfVxuICAgIH0sXG4gICAgbG9nZ2VyOiAvKiNfX1BVUkVfXyovY29uc29sZS5sb2cuYmluZChjb25zb2xlKSxcbiAgICBkZXZUb29sczogZmFsc2VcbiAgfTtcbiAgSW50ZXJwcmV0ZXIuaW50ZXJwcmV0ID0gaW50ZXJwcmV0O1xuICByZXR1cm4gSW50ZXJwcmV0ZXI7XG59KCk7XG5cbnZhciByZXNvbHZlU3Bhd25PcHRpb25zID0gZnVuY3Rpb24gKG5hbWVPck9wdGlvbnMpIHtcbiAgaWYgKGlzU3RyaW5nKG5hbWVPck9wdGlvbnMpKSB7XG4gICAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCBERUZBVUxUX1NQQVdOX09QVElPTlMpLCB7XG4gICAgICBuYW1lOiBuYW1lT3JPcHRpb25zXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oX19hc3NpZ24oe30sIERFRkFVTFRfU1BBV05fT1BUSU9OUyksIHtcbiAgICBuYW1lOiB1bmlxdWVJZCgpXG4gIH0pLCBuYW1lT3JPcHRpb25zKTtcbn07XG5cbmZ1bmN0aW9uIHNwYXduKGVudGl0eSwgbmFtZU9yT3B0aW9ucykge1xuICB2YXIgcmVzb2x2ZWRPcHRpb25zID0gcmVzb2x2ZVNwYXduT3B0aW9ucyhuYW1lT3JPcHRpb25zKTtcbiAgcmV0dXJuIGNvbnN1bWUoZnVuY3Rpb24gKHNlcnZpY2UpIHtcbiAgICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICAgIHZhciBpc0xhenlFbnRpdHkgPSBpc01hY2hpbmUoZW50aXR5KSB8fCBpc0Z1bmN0aW9uKGVudGl0eSk7XG4gICAgICB3YXJuKCEhc2VydmljZSB8fCBpc0xhenlFbnRpdHksIFwiQXR0ZW1wdGVkIHRvIHNwYXduIGFuIEFjdG9yIChJRDogXFxcIlwiLmNvbmNhdChpc01hY2hpbmUoZW50aXR5KSA/IGVudGl0eS5pZCA6ICd1bmRlZmluZWQnLCBcIlxcXCIpIG91dHNpZGUgb2YgYSBzZXJ2aWNlLiBUaGlzIHdpbGwgaGF2ZSBubyBlZmZlY3QuXCIpKTtcbiAgICB9XG5cbiAgICBpZiAoc2VydmljZSkge1xuICAgICAgcmV0dXJuIHNlcnZpY2Uuc3Bhd24oZW50aXR5LCByZXNvbHZlZE9wdGlvbnMubmFtZSwgcmVzb2x2ZWRPcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNyZWF0ZURlZmVycmVkQWN0b3IoZW50aXR5LCByZXNvbHZlZE9wdGlvbnMubmFtZSk7XG4gICAgfVxuICB9KTtcbn1cbi8qKlxyXG4gKiBDcmVhdGVzIGEgbmV3IEludGVycHJldGVyIGluc3RhbmNlIGZvciB0aGUgZ2l2ZW4gbWFjaGluZSB3aXRoIHRoZSBwcm92aWRlZCBvcHRpb25zLCBpZiBhbnkuXHJcbiAqXHJcbiAqIEBwYXJhbSBtYWNoaW5lIFRoZSBtYWNoaW5lIHRvIGludGVycHJldFxyXG4gKiBAcGFyYW0gb3B0aW9ucyBJbnRlcnByZXRlciBvcHRpb25zXHJcbiAqL1xuXG5mdW5jdGlvbiBpbnRlcnByZXQobWFjaGluZSwgb3B0aW9ucykge1xuICB2YXIgaW50ZXJwcmV0ZXIgPSBuZXcgSW50ZXJwcmV0ZXIobWFjaGluZSwgb3B0aW9ucyk7XG4gIHJldHVybiBpbnRlcnByZXRlcjtcbn1cblxuZXhwb3J0IHsgSW50ZXJwcmV0ZXIsIEludGVycHJldGVyU3RhdHVzLCBpbnRlcnByZXQsIHNwYXduIH07XG4iLCJpbXBvcnQgeyBfX2Fzc2lnbiwgX19yZXN0IH0gZnJvbSAnLi9fdmlydHVhbC9fdHNsaWIuanMnO1xuaW1wb3J0ICcuL3R5cGVzLmpzJztcbmltcG9ydCB7IGludm9rZSB9IGZyb20gJy4vYWN0aW9uVHlwZXMuanMnO1xuaW1wb3J0ICcuL3V0aWxzLmpzJztcbmltcG9ydCAnLi9lbnZpcm9ubWVudC5qcyc7XG5cbmZ1bmN0aW9uIHRvSW52b2tlU291cmNlKHNyYykge1xuICBpZiAodHlwZW9mIHNyYyA9PT0gJ3N0cmluZycpIHtcbiAgICB2YXIgc2ltcGxlU3JjID0ge1xuICAgICAgdHlwZTogc3JjXG4gICAgfTtcblxuICAgIHNpbXBsZVNyYy50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBzcmM7XG4gICAgfTsgLy8gdjQgY29tcGF0IC0gVE9ETzogcmVtb3ZlIGluIHY1XG5cblxuICAgIHJldHVybiBzaW1wbGVTcmM7XG4gIH1cblxuICByZXR1cm4gc3JjO1xufVxuZnVuY3Rpb24gdG9JbnZva2VEZWZpbml0aW9uKGludm9rZUNvbmZpZykge1xuICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe1xuICAgIHR5cGU6IGludm9rZVxuICB9LCBpbnZva2VDb25maWcpLCB7XG4gICAgdG9KU09OOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpbnZva2VDb25maWcub25Eb25lO1xuICAgICAgICAgIGludm9rZUNvbmZpZy5vbkVycm9yO1xuICAgICAgICAgIHZhciBpbnZva2VEZWYgPSBfX3Jlc3QoaW52b2tlQ29uZmlnLCBbXCJvbkRvbmVcIiwgXCJvbkVycm9yXCJdKTtcblxuICAgICAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCBpbnZva2VEZWYpLCB7XG4gICAgICAgIHR5cGU6IGludm9rZSxcbiAgICAgICAgc3JjOiB0b0ludm9rZVNvdXJjZShpbnZva2VDb25maWcuc3JjKVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IHsgdG9JbnZva2VEZWZpbml0aW9uLCB0b0ludm9rZVNvdXJjZSB9O1xuIiwidmFyIGNoaWxkcmVuID0gLyojX19QVVJFX18qL25ldyBNYXAoKTtcbnZhciBzZXNzaW9uSWRJbmRleCA9IDA7XG52YXIgcmVnaXN0cnkgPSB7XG4gIGJvb2tJZDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBcIng6XCIuY29uY2F0KHNlc3Npb25JZEluZGV4KyspO1xuICB9LFxuICByZWdpc3RlcjogZnVuY3Rpb24gKGlkLCBhY3Rvcikge1xuICAgIGNoaWxkcmVuLnNldChpZCwgYWN0b3IpO1xuICAgIHJldHVybiBpZDtcbiAgfSxcbiAgZ2V0OiBmdW5jdGlvbiAoaWQpIHtcbiAgICByZXR1cm4gY2hpbGRyZW4uZ2V0KGlkKTtcbiAgfSxcbiAgZnJlZTogZnVuY3Rpb24gKGlkKSB7XG4gICAgY2hpbGRyZW4uZGVsZXRlKGlkKTtcbiAgfVxufTtcblxuZXhwb3J0IHsgcmVnaXN0cnkgfTtcbiIsImltcG9ydCB7IF9fYXNzaWduIH0gZnJvbSAnLi9fdmlydHVhbC9fdHNsaWIuanMnO1xuXG52YXIgZGVmYXVsdE9wdGlvbnMgPSB7XG4gIGRlZmVyRXZlbnRzOiBmYWxzZVxufTtcblxudmFyIFNjaGVkdWxlciA9XG4vKiNfX1BVUkVfXyovXG5cbi8qKiBAY2xhc3MgKi9cbmZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gU2NoZWR1bGVyKG9wdGlvbnMpIHtcbiAgICB0aGlzLnByb2Nlc3NpbmdFdmVudCA9IGZhbHNlO1xuICAgIHRoaXMucXVldWUgPSBbXTtcbiAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgdGhpcy5vcHRpb25zID0gX19hc3NpZ24oX19hc3NpZ24oe30sIGRlZmF1bHRPcHRpb25zKSwgb3B0aW9ucyk7XG4gIH1cblxuICBTY2hlZHVsZXIucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcblxuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuZGVmZXJFdmVudHMpIHtcbiAgICAgICAgdGhpcy5zY2hlZHVsZShjYWxsYmFjayk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wcm9jZXNzKGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICB0aGlzLmZsdXNoRXZlbnRzKCk7XG4gIH07XG5cbiAgU2NoZWR1bGVyLnByb3RvdHlwZS5zY2hlZHVsZSA9IGZ1bmN0aW9uICh0YXNrKSB7XG4gICAgaWYgKCF0aGlzLmluaXRpYWxpemVkIHx8IHRoaXMucHJvY2Vzc2luZ0V2ZW50KSB7XG4gICAgICB0aGlzLnF1ZXVlLnB1c2godGFzayk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucXVldWUubGVuZ3RoICE9PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V2ZW50IHF1ZXVlIHNob3VsZCBiZSBlbXB0eSB3aGVuIGl0IGlzIG5vdCBwcm9jZXNzaW5nIGV2ZW50cycpO1xuICAgIH1cblxuICAgIHRoaXMucHJvY2Vzcyh0YXNrKTtcbiAgICB0aGlzLmZsdXNoRXZlbnRzKCk7XG4gIH07XG5cbiAgU2NoZWR1bGVyLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnF1ZXVlID0gW107XG4gIH07XG5cbiAgU2NoZWR1bGVyLnByb3RvdHlwZS5mbHVzaEV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbmV4dENhbGxiYWNrID0gdGhpcy5xdWV1ZS5zaGlmdCgpO1xuXG4gICAgd2hpbGUgKG5leHRDYWxsYmFjaykge1xuICAgICAgdGhpcy5wcm9jZXNzKG5leHRDYWxsYmFjayk7XG4gICAgICBuZXh0Q2FsbGJhY2sgPSB0aGlzLnF1ZXVlLnNoaWZ0KCk7XG4gICAgfVxuICB9O1xuXG4gIFNjaGVkdWxlci5wcm90b3R5cGUucHJvY2VzcyA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIHRoaXMucHJvY2Vzc2luZ0V2ZW50ID0gdHJ1ZTtcblxuICAgIHRyeSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIHRoZXJlIGlzIG5vIHVzZSB0byBrZWVwIHRoZSBmdXR1cmUgZXZlbnRzXG4gICAgICAvLyBhcyB0aGUgc2l0dWF0aW9uIGlzIG5vdCBhbnltb3JlIHRoZSBzYW1lXG4gICAgICB0aGlzLmNsZWFyKCk7XG4gICAgICB0aHJvdyBlO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLnByb2Nlc3NpbmdFdmVudCA9IGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gU2NoZWR1bGVyO1xufSgpO1xuXG5leHBvcnQgeyBTY2hlZHVsZXIgfTtcbiIsIi8qKlxyXG4gKiBNYWludGFpbnMgYSBzdGFjayBvZiB0aGUgY3VycmVudCBzZXJ2aWNlIGluIHNjb3BlLlxyXG4gKiBUaGlzIGlzIHVzZWQgdG8gcHJvdmlkZSB0aGUgY29ycmVjdCBzZXJ2aWNlIHRvIHNwYXduKCkuXHJcbiAqL1xudmFyIHNlcnZpY2VTdGFjayA9IFtdO1xudmFyIHByb3ZpZGUgPSBmdW5jdGlvbiAoc2VydmljZSwgZm4pIHtcbiAgc2VydmljZVN0YWNrLnB1c2goc2VydmljZSk7XG4gIHZhciByZXN1bHQgPSBmbihzZXJ2aWNlKTtcbiAgc2VydmljZVN0YWNrLnBvcCgpO1xuICByZXR1cm4gcmVzdWx0O1xufTtcbnZhciBjb25zdW1lID0gZnVuY3Rpb24gKGZuKSB7XG4gIHJldHVybiBmbihzZXJ2aWNlU3RhY2tbc2VydmljZVN0YWNrLmxlbmd0aCAtIDFdKTtcbn07XG5cbmV4cG9ydCB7IGNvbnN1bWUsIHByb3ZpZGUgfTtcbiIsImltcG9ydCB7IF9fdmFsdWVzLCBfX3NwcmVhZEFycmF5LCBfX3JlYWQgfSBmcm9tICcuL192aXJ0dWFsL190c2xpYi5qcyc7XG5pbXBvcnQgeyBmbGF0dGVuIH0gZnJvbSAnLi91dGlscy5qcyc7XG5cbnZhciBpc0xlYWZOb2RlID0gZnVuY3Rpb24gKHN0YXRlTm9kZSkge1xuICByZXR1cm4gc3RhdGVOb2RlLnR5cGUgPT09ICdhdG9taWMnIHx8IHN0YXRlTm9kZS50eXBlID09PSAnZmluYWwnO1xufTtcbmZ1bmN0aW9uIGdldEFsbENoaWxkcmVuKHN0YXRlTm9kZSkge1xuICByZXR1cm4gT2JqZWN0LmtleXMoc3RhdGVOb2RlLnN0YXRlcykubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gc3RhdGVOb2RlLnN0YXRlc1trZXldO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGdldENoaWxkcmVuKHN0YXRlTm9kZSkge1xuICByZXR1cm4gZ2V0QWxsQ2hpbGRyZW4oc3RhdGVOb2RlKS5maWx0ZXIoZnVuY3Rpb24gKHNuKSB7XG4gICAgcmV0dXJuIHNuLnR5cGUgIT09ICdoaXN0b3J5JztcbiAgfSk7XG59XG5mdW5jdGlvbiBnZXRBbGxTdGF0ZU5vZGVzKHN0YXRlTm9kZSkge1xuICB2YXIgc3RhdGVOb2RlcyA9IFtzdGF0ZU5vZGVdO1xuXG4gIGlmIChpc0xlYWZOb2RlKHN0YXRlTm9kZSkpIHtcbiAgICByZXR1cm4gc3RhdGVOb2RlcztcbiAgfVxuXG4gIHJldHVybiBzdGF0ZU5vZGVzLmNvbmNhdChmbGF0dGVuKGdldENoaWxkcmVuKHN0YXRlTm9kZSkubWFwKGdldEFsbFN0YXRlTm9kZXMpKSk7XG59XG5mdW5jdGlvbiBnZXRDb25maWd1cmF0aW9uKHByZXZTdGF0ZU5vZGVzLCBzdGF0ZU5vZGVzKSB7XG4gIHZhciBlXzEsIF9hLCBlXzIsIF9iLCBlXzMsIF9jLCBlXzQsIF9kO1xuXG4gIHZhciBwcmV2Q29uZmlndXJhdGlvbiA9IG5ldyBTZXQocHJldlN0YXRlTm9kZXMpO1xuICB2YXIgcHJldkFkakxpc3QgPSBnZXRBZGpMaXN0KHByZXZDb25maWd1cmF0aW9uKTtcbiAgdmFyIGNvbmZpZ3VyYXRpb24gPSBuZXcgU2V0KHN0YXRlTm9kZXMpO1xuXG4gIHRyeSB7XG4gICAgLy8gYWRkIGFsbCBhbmNlc3RvcnNcbiAgICBmb3IgKHZhciBjb25maWd1cmF0aW9uXzEgPSBfX3ZhbHVlcyhjb25maWd1cmF0aW9uKSwgY29uZmlndXJhdGlvbl8xXzEgPSBjb25maWd1cmF0aW9uXzEubmV4dCgpOyAhY29uZmlndXJhdGlvbl8xXzEuZG9uZTsgY29uZmlndXJhdGlvbl8xXzEgPSBjb25maWd1cmF0aW9uXzEubmV4dCgpKSB7XG4gICAgICB2YXIgcyA9IGNvbmZpZ3VyYXRpb25fMV8xLnZhbHVlO1xuICAgICAgdmFyIG0gPSBzLnBhcmVudDtcblxuICAgICAgd2hpbGUgKG0gJiYgIWNvbmZpZ3VyYXRpb24uaGFzKG0pKSB7XG4gICAgICAgIGNvbmZpZ3VyYXRpb24uYWRkKG0pO1xuICAgICAgICBtID0gbS5wYXJlbnQ7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlXzFfMSkge1xuICAgIGVfMSA9IHtcbiAgICAgIGVycm9yOiBlXzFfMVxuICAgIH07XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChjb25maWd1cmF0aW9uXzFfMSAmJiAhY29uZmlndXJhdGlvbl8xXzEuZG9uZSAmJiAoX2EgPSBjb25maWd1cmF0aW9uXzEucmV0dXJuKSkgX2EuY2FsbChjb25maWd1cmF0aW9uXzEpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpZiAoZV8xKSB0aHJvdyBlXzEuZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgdmFyIGFkakxpc3QgPSBnZXRBZGpMaXN0KGNvbmZpZ3VyYXRpb24pO1xuXG4gIHRyeSB7XG4gICAgLy8gYWRkIGRlc2NlbmRhbnRzXG4gICAgZm9yICh2YXIgY29uZmlndXJhdGlvbl8yID0gX192YWx1ZXMoY29uZmlndXJhdGlvbiksIGNvbmZpZ3VyYXRpb25fMl8xID0gY29uZmlndXJhdGlvbl8yLm5leHQoKTsgIWNvbmZpZ3VyYXRpb25fMl8xLmRvbmU7IGNvbmZpZ3VyYXRpb25fMl8xID0gY29uZmlndXJhdGlvbl8yLm5leHQoKSkge1xuICAgICAgdmFyIHMgPSBjb25maWd1cmF0aW9uXzJfMS52YWx1ZTsgLy8gaWYgcHJldmlvdXNseSBhY3RpdmUsIGFkZCBleGlzdGluZyBjaGlsZCBub2Rlc1xuXG4gICAgICBpZiAocy50eXBlID09PSAnY29tcG91bmQnICYmICghYWRqTGlzdC5nZXQocykgfHwgIWFkakxpc3QuZ2V0KHMpLmxlbmd0aCkpIHtcbiAgICAgICAgaWYgKHByZXZBZGpMaXN0LmdldChzKSkge1xuICAgICAgICAgIHByZXZBZGpMaXN0LmdldChzKS5mb3JFYWNoKGZ1bmN0aW9uIChzbikge1xuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZ3VyYXRpb24uYWRkKHNuKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzLmluaXRpYWxTdGF0ZU5vZGVzLmZvckVhY2goZnVuY3Rpb24gKHNuKSB7XG4gICAgICAgICAgICByZXR1cm4gY29uZmlndXJhdGlvbi5hZGQoc24pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocy50eXBlID09PSAncGFyYWxsZWwnKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvciAodmFyIF9lID0gKGVfMyA9IHZvaWQgMCwgX192YWx1ZXMoZ2V0Q2hpbGRyZW4ocykpKSwgX2YgPSBfZS5uZXh0KCk7ICFfZi5kb25lOyBfZiA9IF9lLm5leHQoKSkge1xuICAgICAgICAgICAgICB2YXIgY2hpbGQgPSBfZi52YWx1ZTtcblxuICAgICAgICAgICAgICBpZiAoIWNvbmZpZ3VyYXRpb24uaGFzKGNoaWxkKSkge1xuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYXRpb24uYWRkKGNoaWxkKTtcblxuICAgICAgICAgICAgICAgIGlmIChwcmV2QWRqTGlzdC5nZXQoY2hpbGQpKSB7XG4gICAgICAgICAgICAgICAgICBwcmV2QWRqTGlzdC5nZXQoY2hpbGQpLmZvckVhY2goZnVuY3Rpb24gKHNuKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb25maWd1cmF0aW9uLmFkZChzbik7XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgY2hpbGQuaW5pdGlhbFN0YXRlTm9kZXMuZm9yRWFjaChmdW5jdGlvbiAoc24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbmZpZ3VyYXRpb24uYWRkKHNuKTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gY2F0Y2ggKGVfM18xKSB7XG4gICAgICAgICAgICBlXzMgPSB7XG4gICAgICAgICAgICAgIGVycm9yOiBlXzNfMVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgaWYgKF9mICYmICFfZi5kb25lICYmIChfYyA9IF9lLnJldHVybikpIF9jLmNhbGwoX2UpO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgaWYgKGVfMykgdGhyb3cgZV8zLmVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZV8yXzEpIHtcbiAgICBlXzIgPSB7XG4gICAgICBlcnJvcjogZV8yXzFcbiAgICB9O1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoY29uZmlndXJhdGlvbl8yXzEgJiYgIWNvbmZpZ3VyYXRpb25fMl8xLmRvbmUgJiYgKF9iID0gY29uZmlndXJhdGlvbl8yLnJldHVybikpIF9iLmNhbGwoY29uZmlndXJhdGlvbl8yKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKGVfMikgdGhyb3cgZV8yLmVycm9yO1xuICAgIH1cbiAgfVxuXG4gIHRyeSB7XG4gICAgLy8gYWRkIGFsbCBhbmNlc3RvcnNcbiAgICBmb3IgKHZhciBjb25maWd1cmF0aW9uXzMgPSBfX3ZhbHVlcyhjb25maWd1cmF0aW9uKSwgY29uZmlndXJhdGlvbl8zXzEgPSBjb25maWd1cmF0aW9uXzMubmV4dCgpOyAhY29uZmlndXJhdGlvbl8zXzEuZG9uZTsgY29uZmlndXJhdGlvbl8zXzEgPSBjb25maWd1cmF0aW9uXzMubmV4dCgpKSB7XG4gICAgICB2YXIgcyA9IGNvbmZpZ3VyYXRpb25fM18xLnZhbHVlO1xuICAgICAgdmFyIG0gPSBzLnBhcmVudDtcblxuICAgICAgd2hpbGUgKG0gJiYgIWNvbmZpZ3VyYXRpb24uaGFzKG0pKSB7XG4gICAgICAgIGNvbmZpZ3VyYXRpb24uYWRkKG0pO1xuICAgICAgICBtID0gbS5wYXJlbnQ7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlXzRfMSkge1xuICAgIGVfNCA9IHtcbiAgICAgIGVycm9yOiBlXzRfMVxuICAgIH07XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChjb25maWd1cmF0aW9uXzNfMSAmJiAhY29uZmlndXJhdGlvbl8zXzEuZG9uZSAmJiAoX2QgPSBjb25maWd1cmF0aW9uXzMucmV0dXJuKSkgX2QuY2FsbChjb25maWd1cmF0aW9uXzMpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpZiAoZV80KSB0aHJvdyBlXzQuZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNvbmZpZ3VyYXRpb247XG59XG5cbmZ1bmN0aW9uIGdldFZhbHVlRnJvbUFkaihiYXNlTm9kZSwgYWRqTGlzdCkge1xuICB2YXIgY2hpbGRTdGF0ZU5vZGVzID0gYWRqTGlzdC5nZXQoYmFzZU5vZGUpO1xuXG4gIGlmICghY2hpbGRTdGF0ZU5vZGVzKSB7XG4gICAgcmV0dXJuIHt9OyAvLyB0b2RvOiBmaXg/XG4gIH1cblxuICBpZiAoYmFzZU5vZGUudHlwZSA9PT0gJ2NvbXBvdW5kJykge1xuICAgIHZhciBjaGlsZFN0YXRlTm9kZSA9IGNoaWxkU3RhdGVOb2Rlc1swXTtcblxuICAgIGlmIChjaGlsZFN0YXRlTm9kZSkge1xuICAgICAgaWYgKGlzTGVhZk5vZGUoY2hpbGRTdGF0ZU5vZGUpKSB7XG4gICAgICAgIHJldHVybiBjaGlsZFN0YXRlTm9kZS5rZXk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH1cblxuICB2YXIgc3RhdGVWYWx1ZSA9IHt9O1xuICBjaGlsZFN0YXRlTm9kZXMuZm9yRWFjaChmdW5jdGlvbiAoY3NuKSB7XG4gICAgc3RhdGVWYWx1ZVtjc24ua2V5XSA9IGdldFZhbHVlRnJvbUFkaihjc24sIGFkakxpc3QpO1xuICB9KTtcbiAgcmV0dXJuIHN0YXRlVmFsdWU7XG59XG5cbmZ1bmN0aW9uIGdldEFkakxpc3QoY29uZmlndXJhdGlvbikge1xuICB2YXIgZV81LCBfYTtcblxuICB2YXIgYWRqTGlzdCA9IG5ldyBNYXAoKTtcblxuICB0cnkge1xuICAgIGZvciAodmFyIGNvbmZpZ3VyYXRpb25fNCA9IF9fdmFsdWVzKGNvbmZpZ3VyYXRpb24pLCBjb25maWd1cmF0aW9uXzRfMSA9IGNvbmZpZ3VyYXRpb25fNC5uZXh0KCk7ICFjb25maWd1cmF0aW9uXzRfMS5kb25lOyBjb25maWd1cmF0aW9uXzRfMSA9IGNvbmZpZ3VyYXRpb25fNC5uZXh0KCkpIHtcbiAgICAgIHZhciBzID0gY29uZmlndXJhdGlvbl80XzEudmFsdWU7XG5cbiAgICAgIGlmICghYWRqTGlzdC5oYXMocykpIHtcbiAgICAgICAgYWRqTGlzdC5zZXQocywgW10pO1xuICAgICAgfVxuXG4gICAgICBpZiAocy5wYXJlbnQpIHtcbiAgICAgICAgaWYgKCFhZGpMaXN0LmhhcyhzLnBhcmVudCkpIHtcbiAgICAgICAgICBhZGpMaXN0LnNldChzLnBhcmVudCwgW10pO1xuICAgICAgICB9XG5cbiAgICAgICAgYWRqTGlzdC5nZXQocy5wYXJlbnQpLnB1c2gocyk7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlXzVfMSkge1xuICAgIGVfNSA9IHtcbiAgICAgIGVycm9yOiBlXzVfMVxuICAgIH07XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChjb25maWd1cmF0aW9uXzRfMSAmJiAhY29uZmlndXJhdGlvbl80XzEuZG9uZSAmJiAoX2EgPSBjb25maWd1cmF0aW9uXzQucmV0dXJuKSkgX2EuY2FsbChjb25maWd1cmF0aW9uXzQpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpZiAoZV81KSB0aHJvdyBlXzUuZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGFkakxpc3Q7XG59XG5mdW5jdGlvbiBnZXRWYWx1ZShyb290Tm9kZSwgY29uZmlndXJhdGlvbikge1xuICB2YXIgY29uZmlnID0gZ2V0Q29uZmlndXJhdGlvbihbcm9vdE5vZGVdLCBjb25maWd1cmF0aW9uKTtcbiAgcmV0dXJuIGdldFZhbHVlRnJvbUFkaihyb290Tm9kZSwgZ2V0QWRqTGlzdChjb25maWcpKTtcbn1cbmZ1bmN0aW9uIGhhcyhpdGVyYWJsZSwgaXRlbSkge1xuICBpZiAoQXJyYXkuaXNBcnJheShpdGVyYWJsZSkpIHtcbiAgICByZXR1cm4gaXRlcmFibGUuc29tZShmdW5jdGlvbiAobWVtYmVyKSB7XG4gICAgICByZXR1cm4gbWVtYmVyID09PSBpdGVtO1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKGl0ZXJhYmxlIGluc3RhbmNlb2YgU2V0KSB7XG4gICAgcmV0dXJuIGl0ZXJhYmxlLmhhcyhpdGVtKTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTsgLy8gVE9ETzogZml4XG59XG5mdW5jdGlvbiBuZXh0RXZlbnRzKGNvbmZpZ3VyYXRpb24pIHtcbiAgcmV0dXJuIF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChuZXcgU2V0KGZsYXR0ZW4oX19zcHJlYWRBcnJheShbXSwgX19yZWFkKGNvbmZpZ3VyYXRpb24ubWFwKGZ1bmN0aW9uIChzbikge1xuICAgIHJldHVybiBzbi5vd25FdmVudHM7XG4gIH0pKSwgZmFsc2UpKSkpLCBmYWxzZSk7XG59XG5mdW5jdGlvbiBpc0luRmluYWxTdGF0ZShjb25maWd1cmF0aW9uLCBzdGF0ZU5vZGUpIHtcbiAgaWYgKHN0YXRlTm9kZS50eXBlID09PSAnY29tcG91bmQnKSB7XG4gICAgcmV0dXJuIGdldENoaWxkcmVuKHN0YXRlTm9kZSkuc29tZShmdW5jdGlvbiAocykge1xuICAgICAgcmV0dXJuIHMudHlwZSA9PT0gJ2ZpbmFsJyAmJiBoYXMoY29uZmlndXJhdGlvbiwgcyk7XG4gICAgfSk7XG4gIH1cblxuICBpZiAoc3RhdGVOb2RlLnR5cGUgPT09ICdwYXJhbGxlbCcpIHtcbiAgICByZXR1cm4gZ2V0Q2hpbGRyZW4oc3RhdGVOb2RlKS5ldmVyeShmdW5jdGlvbiAoc24pIHtcbiAgICAgIHJldHVybiBpc0luRmluYWxTdGF0ZShjb25maWd1cmF0aW9uLCBzbik7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5mdW5jdGlvbiBnZXRNZXRhKGNvbmZpZ3VyYXRpb24pIHtcbiAgaWYgKGNvbmZpZ3VyYXRpb24gPT09IHZvaWQgMCkge1xuICAgIGNvbmZpZ3VyYXRpb24gPSBbXTtcbiAgfVxuXG4gIHJldHVybiBjb25maWd1cmF0aW9uLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBzdGF0ZU5vZGUpIHtcbiAgICBpZiAoc3RhdGVOb2RlLm1ldGEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgYWNjW3N0YXRlTm9kZS5pZF0gPSBzdGF0ZU5vZGUubWV0YTtcbiAgICB9XG5cbiAgICByZXR1cm4gYWNjO1xuICB9LCB7fSk7XG59XG5mdW5jdGlvbiBnZXRUYWdzRnJvbUNvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvbikge1xuICByZXR1cm4gbmV3IFNldChmbGF0dGVuKGNvbmZpZ3VyYXRpb24ubWFwKGZ1bmN0aW9uIChzbikge1xuICAgIHJldHVybiBzbi50YWdzO1xuICB9KSkpO1xufVxuXG5leHBvcnQgeyBnZXRBZGpMaXN0LCBnZXRBbGxDaGlsZHJlbiwgZ2V0QWxsU3RhdGVOb2RlcywgZ2V0Q2hpbGRyZW4sIGdldENvbmZpZ3VyYXRpb24sIGdldE1ldGEsIGdldFRhZ3NGcm9tQ29uZmlndXJhdGlvbiwgZ2V0VmFsdWUsIGhhcywgaXNJbkZpbmFsU3RhdGUsIGlzTGVhZk5vZGUsIG5leHRFdmVudHMgfTtcbiIsInZhciBBY3Rpb25UeXBlcztcblxuKGZ1bmN0aW9uIChBY3Rpb25UeXBlcykge1xuICBBY3Rpb25UeXBlc1tcIlN0YXJ0XCJdID0gXCJ4c3RhdGUuc3RhcnRcIjtcbiAgQWN0aW9uVHlwZXNbXCJTdG9wXCJdID0gXCJ4c3RhdGUuc3RvcFwiO1xuICBBY3Rpb25UeXBlc1tcIlJhaXNlXCJdID0gXCJ4c3RhdGUucmFpc2VcIjtcbiAgQWN0aW9uVHlwZXNbXCJTZW5kXCJdID0gXCJ4c3RhdGUuc2VuZFwiO1xuICBBY3Rpb25UeXBlc1tcIkNhbmNlbFwiXSA9IFwieHN0YXRlLmNhbmNlbFwiO1xuICBBY3Rpb25UeXBlc1tcIk51bGxFdmVudFwiXSA9IFwiXCI7XG4gIEFjdGlvblR5cGVzW1wiQXNzaWduXCJdID0gXCJ4c3RhdGUuYXNzaWduXCI7XG4gIEFjdGlvblR5cGVzW1wiQWZ0ZXJcIl0gPSBcInhzdGF0ZS5hZnRlclwiO1xuICBBY3Rpb25UeXBlc1tcIkRvbmVTdGF0ZVwiXSA9IFwiZG9uZS5zdGF0ZVwiO1xuICBBY3Rpb25UeXBlc1tcIkRvbmVJbnZva2VcIl0gPSBcImRvbmUuaW52b2tlXCI7XG4gIEFjdGlvblR5cGVzW1wiTG9nXCJdID0gXCJ4c3RhdGUubG9nXCI7XG4gIEFjdGlvblR5cGVzW1wiSW5pdFwiXSA9IFwieHN0YXRlLmluaXRcIjtcbiAgQWN0aW9uVHlwZXNbXCJJbnZva2VcIl0gPSBcInhzdGF0ZS5pbnZva2VcIjtcbiAgQWN0aW9uVHlwZXNbXCJFcnJvckV4ZWN1dGlvblwiXSA9IFwiZXJyb3IuZXhlY3V0aW9uXCI7XG4gIEFjdGlvblR5cGVzW1wiRXJyb3JDb21tdW5pY2F0aW9uXCJdID0gXCJlcnJvci5jb21tdW5pY2F0aW9uXCI7XG4gIEFjdGlvblR5cGVzW1wiRXJyb3JQbGF0Zm9ybVwiXSA9IFwiZXJyb3IucGxhdGZvcm1cIjtcbiAgQWN0aW9uVHlwZXNbXCJFcnJvckN1c3RvbVwiXSA9IFwieHN0YXRlLmVycm9yXCI7XG4gIEFjdGlvblR5cGVzW1wiVXBkYXRlXCJdID0gXCJ4c3RhdGUudXBkYXRlXCI7XG4gIEFjdGlvblR5cGVzW1wiUHVyZVwiXSA9IFwieHN0YXRlLnB1cmVcIjtcbiAgQWN0aW9uVHlwZXNbXCJDaG9vc2VcIl0gPSBcInhzdGF0ZS5jaG9vc2VcIjtcbn0pKEFjdGlvblR5cGVzIHx8IChBY3Rpb25UeXBlcyA9IHt9KSk7XG5cbnZhciBTcGVjaWFsVGFyZ2V0cztcblxuKGZ1bmN0aW9uIChTcGVjaWFsVGFyZ2V0cykge1xuICBTcGVjaWFsVGFyZ2V0c1tcIlBhcmVudFwiXSA9IFwiI19wYXJlbnRcIjtcbiAgU3BlY2lhbFRhcmdldHNbXCJJbnRlcm5hbFwiXSA9IFwiI19pbnRlcm5hbFwiO1xufSkoU3BlY2lhbFRhcmdldHMgfHwgKFNwZWNpYWxUYXJnZXRzID0ge30pKTtcblxuZXhwb3J0IHsgQWN0aW9uVHlwZXMsIFNwZWNpYWxUYXJnZXRzIH07XG4iLCJpbXBvcnQgeyBfX3ZhbHVlcywgX19zcHJlYWRBcnJheSwgX19yZWFkLCBfX2Fzc2lnbiB9IGZyb20gJy4vX3ZpcnR1YWwvX3RzbGliLmpzJztcbmltcG9ydCB7IFNwZWNpYWxUYXJnZXRzIH0gZnJvbSAnLi90eXBlcy5qcyc7XG5pbXBvcnQgeyByYWlzZSwgc2VuZCB9IGZyb20gJy4vYWN0aW9uVHlwZXMuanMnO1xuaW1wb3J0IHsgREVGQVVMVF9HVUFSRF9UWVBFLCBUQVJHRVRMRVNTX0tFWSwgU1RBVEVfREVMSU1JVEVSIH0gZnJvbSAnLi9jb25zdGFudHMuanMnO1xuaW1wb3J0IHsgSVNfUFJPRFVDVElPTiB9IGZyb20gJy4vZW52aXJvbm1lbnQuanMnO1xuXG52YXIgX2E7XG5mdW5jdGlvbiBrZXlzKHZhbHVlKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyh2YWx1ZSk7XG59XG5mdW5jdGlvbiBtYXRjaGVzU3RhdGUocGFyZW50U3RhdGVJZCwgY2hpbGRTdGF0ZUlkLCBkZWxpbWl0ZXIpIHtcbiAgaWYgKGRlbGltaXRlciA9PT0gdm9pZCAwKSB7XG4gICAgZGVsaW1pdGVyID0gU1RBVEVfREVMSU1JVEVSO1xuICB9XG5cbiAgdmFyIHBhcmVudFN0YXRlVmFsdWUgPSB0b1N0YXRlVmFsdWUocGFyZW50U3RhdGVJZCwgZGVsaW1pdGVyKTtcbiAgdmFyIGNoaWxkU3RhdGVWYWx1ZSA9IHRvU3RhdGVWYWx1ZShjaGlsZFN0YXRlSWQsIGRlbGltaXRlcik7XG5cbiAgaWYgKGlzU3RyaW5nKGNoaWxkU3RhdGVWYWx1ZSkpIHtcbiAgICBpZiAoaXNTdHJpbmcocGFyZW50U3RhdGVWYWx1ZSkpIHtcbiAgICAgIHJldHVybiBjaGlsZFN0YXRlVmFsdWUgPT09IHBhcmVudFN0YXRlVmFsdWU7XG4gICAgfSAvLyBQYXJlbnQgbW9yZSBzcGVjaWZpYyB0aGFuIGNoaWxkXG5cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChpc1N0cmluZyhwYXJlbnRTdGF0ZVZhbHVlKSkge1xuICAgIHJldHVybiBwYXJlbnRTdGF0ZVZhbHVlIGluIGNoaWxkU3RhdGVWYWx1ZTtcbiAgfVxuXG4gIHJldHVybiBPYmplY3Qua2V5cyhwYXJlbnRTdGF0ZVZhbHVlKS5ldmVyeShmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKCEoa2V5IGluIGNoaWxkU3RhdGVWYWx1ZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWF0Y2hlc1N0YXRlKHBhcmVudFN0YXRlVmFsdWVba2V5XSwgY2hpbGRTdGF0ZVZhbHVlW2tleV0pO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGdldEV2ZW50VHlwZShldmVudCkge1xuICB0cnkge1xuICAgIHJldHVybiBpc1N0cmluZyhldmVudCkgfHwgdHlwZW9mIGV2ZW50ID09PSAnbnVtYmVyJyA/IFwiXCIuY29uY2F0KGV2ZW50KSA6IGV2ZW50LnR5cGU7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0V2ZW50cyBtdXN0IGJlIHN0cmluZ3Mgb3Igb2JqZWN0cyB3aXRoIGEgc3RyaW5nIGV2ZW50LnR5cGUgcHJvcGVydHkuJyk7XG4gIH1cbn1cbmZ1bmN0aW9uIGdldEFjdGlvblR5cGUoYWN0aW9uKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGlzU3RyaW5nKGFjdGlvbikgfHwgdHlwZW9mIGFjdGlvbiA9PT0gJ251bWJlcicgPyBcIlwiLmNvbmNhdChhY3Rpb24pIDogaXNGdW5jdGlvbihhY3Rpb24pID8gYWN0aW9uLm5hbWUgOiBhY3Rpb24udHlwZTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignQWN0aW9ucyBtdXN0IGJlIHN0cmluZ3Mgb3Igb2JqZWN0cyB3aXRoIGEgc3RyaW5nIGFjdGlvbi50eXBlIHByb3BlcnR5LicpO1xuICB9XG59XG5mdW5jdGlvbiB0b1N0YXRlUGF0aChzdGF0ZUlkLCBkZWxpbWl0ZXIpIHtcbiAgdHJ5IHtcbiAgICBpZiAoaXNBcnJheShzdGF0ZUlkKSkge1xuICAgICAgcmV0dXJuIHN0YXRlSWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXRlSWQudG9TdHJpbmcoKS5zcGxpdChkZWxpbWl0ZXIpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiJ1wiLmNvbmNhdChzdGF0ZUlkLCBcIicgaXMgbm90IGEgdmFsaWQgc3RhdGUgcGF0aC5cIikpO1xuICB9XG59XG5mdW5jdGlvbiBpc1N0YXRlTGlrZShzdGF0ZSkge1xuICByZXR1cm4gdHlwZW9mIHN0YXRlID09PSAnb2JqZWN0JyAmJiAndmFsdWUnIGluIHN0YXRlICYmICdjb250ZXh0JyBpbiBzdGF0ZSAmJiAnZXZlbnQnIGluIHN0YXRlICYmICdfZXZlbnQnIGluIHN0YXRlO1xufVxuZnVuY3Rpb24gdG9TdGF0ZVZhbHVlKHN0YXRlVmFsdWUsIGRlbGltaXRlcikge1xuICBpZiAoaXNTdGF0ZUxpa2Uoc3RhdGVWYWx1ZSkpIHtcbiAgICByZXR1cm4gc3RhdGVWYWx1ZS52YWx1ZTtcbiAgfVxuXG4gIGlmIChpc0FycmF5KHN0YXRlVmFsdWUpKSB7XG4gICAgcmV0dXJuIHBhdGhUb1N0YXRlVmFsdWUoc3RhdGVWYWx1ZSk7XG4gIH1cblxuICBpZiAodHlwZW9mIHN0YXRlVmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHN0YXRlVmFsdWU7XG4gIH1cblxuICB2YXIgc3RhdGVQYXRoID0gdG9TdGF0ZVBhdGgoc3RhdGVWYWx1ZSwgZGVsaW1pdGVyKTtcbiAgcmV0dXJuIHBhdGhUb1N0YXRlVmFsdWUoc3RhdGVQYXRoKTtcbn1cbmZ1bmN0aW9uIHBhdGhUb1N0YXRlVmFsdWUoc3RhdGVQYXRoKSB7XG4gIGlmIChzdGF0ZVBhdGgubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIHN0YXRlUGF0aFswXTtcbiAgfVxuXG4gIHZhciB2YWx1ZSA9IHt9O1xuICB2YXIgbWFya2VyID0gdmFsdWU7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGF0ZVBhdGgubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgaWYgKGkgPT09IHN0YXRlUGF0aC5sZW5ndGggLSAyKSB7XG4gICAgICBtYXJrZXJbc3RhdGVQYXRoW2ldXSA9IHN0YXRlUGF0aFtpICsgMV07XG4gICAgfSBlbHNlIHtcbiAgICAgIG1hcmtlcltzdGF0ZVBhdGhbaV1dID0ge307XG4gICAgICBtYXJrZXIgPSBtYXJrZXJbc3RhdGVQYXRoW2ldXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdmFsdWU7XG59XG5mdW5jdGlvbiBtYXBWYWx1ZXMoY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuICB2YXIgY29sbGVjdGlvbktleXMgPSBPYmplY3Qua2V5cyhjb2xsZWN0aW9uKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbGxlY3Rpb25LZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGtleSA9IGNvbGxlY3Rpb25LZXlzW2ldO1xuICAgIHJlc3VsdFtrZXldID0gaXRlcmF0ZWUoY29sbGVjdGlvbltrZXldLCBrZXksIGNvbGxlY3Rpb24sIGkpO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1hcEZpbHRlclZhbHVlcyhjb2xsZWN0aW9uLCBpdGVyYXRlZSwgcHJlZGljYXRlKSB7XG4gIHZhciBlXzEsIF9hO1xuXG4gIHZhciByZXN1bHQgPSB7fTtcblxuICB0cnkge1xuICAgIGZvciAodmFyIF9iID0gX192YWx1ZXMoT2JqZWN0LmtleXMoY29sbGVjdGlvbikpLCBfYyA9IF9iLm5leHQoKTsgIV9jLmRvbmU7IF9jID0gX2IubmV4dCgpKSB7XG4gICAgICB2YXIga2V5ID0gX2MudmFsdWU7XG4gICAgICB2YXIgaXRlbSA9IGNvbGxlY3Rpb25ba2V5XTtcblxuICAgICAgaWYgKCFwcmVkaWNhdGUoaXRlbSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHJlc3VsdFtrZXldID0gaXRlcmF0ZWUoaXRlbSwga2V5LCBjb2xsZWN0aW9uKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVfMV8xKSB7XG4gICAgZV8xID0ge1xuICAgICAgZXJyb3I6IGVfMV8xXG4gICAgfTtcbiAgfSBmaW5hbGx5IHtcbiAgICB0cnkge1xuICAgICAgaWYgKF9jICYmICFfYy5kb25lICYmIChfYSA9IF9iLnJldHVybikpIF9hLmNhbGwoX2IpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpZiAoZV8xKSB0aHJvdyBlXzEuZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKlxyXG4gKiBSZXRyaWV2ZXMgYSB2YWx1ZSBhdCB0aGUgZ2l2ZW4gcGF0aC5cclxuICogQHBhcmFtIHByb3BzIFRoZSBkZWVwIHBhdGggdG8gdGhlIHByb3Agb2YgdGhlIGRlc2lyZWQgdmFsdWVcclxuICovXG5cbnZhciBwYXRoID0gZnVuY3Rpb24gKHByb3BzKSB7XG4gIHJldHVybiBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgdmFyIGVfMiwgX2E7XG5cbiAgICB2YXIgcmVzdWx0ID0gb2JqZWN0O1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIHByb3BzXzEgPSBfX3ZhbHVlcyhwcm9wcyksIHByb3BzXzFfMSA9IHByb3BzXzEubmV4dCgpOyAhcHJvcHNfMV8xLmRvbmU7IHByb3BzXzFfMSA9IHByb3BzXzEubmV4dCgpKSB7XG4gICAgICAgIHZhciBwcm9wID0gcHJvcHNfMV8xLnZhbHVlO1xuICAgICAgICByZXN1bHQgPSByZXN1bHRbcHJvcF07XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV8yXzEpIHtcbiAgICAgIGVfMiA9IHtcbiAgICAgICAgZXJyb3I6IGVfMl8xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAocHJvcHNfMV8xICYmICFwcm9wc18xXzEuZG9uZSAmJiAoX2EgPSBwcm9wc18xLnJldHVybikpIF9hLmNhbGwocHJvcHNfMSk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV8yKSB0aHJvdyBlXzIuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn07XG4vKipcclxuICogUmV0cmlldmVzIGEgdmFsdWUgYXQgdGhlIGdpdmVuIHBhdGggdmlhIHRoZSBuZXN0ZWQgYWNjZXNzb3IgcHJvcC5cclxuICogQHBhcmFtIHByb3BzIFRoZSBkZWVwIHBhdGggdG8gdGhlIHByb3Agb2YgdGhlIGRlc2lyZWQgdmFsdWVcclxuICovXG5cbmZ1bmN0aW9uIG5lc3RlZFBhdGgocHJvcHMsIGFjY2Vzc29yUHJvcCkge1xuICByZXR1cm4gZnVuY3Rpb24gKG9iamVjdCkge1xuICAgIHZhciBlXzMsIF9hO1xuXG4gICAgdmFyIHJlc3VsdCA9IG9iamVjdDtcblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBwcm9wc18yID0gX192YWx1ZXMocHJvcHMpLCBwcm9wc18yXzEgPSBwcm9wc18yLm5leHQoKTsgIXByb3BzXzJfMS5kb25lOyBwcm9wc18yXzEgPSBwcm9wc18yLm5leHQoKSkge1xuICAgICAgICB2YXIgcHJvcCA9IHByb3BzXzJfMS52YWx1ZTtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0W2FjY2Vzc29yUHJvcF1bcHJvcF07XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV8zXzEpIHtcbiAgICAgIGVfMyA9IHtcbiAgICAgICAgZXJyb3I6IGVfM18xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAocHJvcHNfMl8xICYmICFwcm9wc18yXzEuZG9uZSAmJiAoX2EgPSBwcm9wc18yLnJldHVybikpIF9hLmNhbGwocHJvcHNfMik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV8zKSB0aHJvdyBlXzMuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cbmZ1bmN0aW9uIHRvU3RhdGVQYXRocyhzdGF0ZVZhbHVlKSB7XG4gIGlmICghc3RhdGVWYWx1ZSkge1xuICAgIHJldHVybiBbW11dO1xuICB9XG5cbiAgaWYgKGlzU3RyaW5nKHN0YXRlVmFsdWUpKSB7XG4gICAgcmV0dXJuIFtbc3RhdGVWYWx1ZV1dO1xuICB9XG5cbiAgdmFyIHJlc3VsdCA9IGZsYXR0ZW4oT2JqZWN0LmtleXMoc3RhdGVWYWx1ZSkubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgc3ViU3RhdGVWYWx1ZSA9IHN0YXRlVmFsdWVba2V5XTtcblxuICAgIGlmICh0eXBlb2Ygc3ViU3RhdGVWYWx1ZSAhPT0gJ3N0cmluZycgJiYgKCFzdWJTdGF0ZVZhbHVlIHx8ICFPYmplY3Qua2V5cyhzdWJTdGF0ZVZhbHVlKS5sZW5ndGgpKSB7XG4gICAgICByZXR1cm4gW1trZXldXTtcbiAgICB9XG5cbiAgICByZXR1cm4gdG9TdGF0ZVBhdGhzKHN0YXRlVmFsdWVba2V5XSkubWFwKGZ1bmN0aW9uIChzdWJQYXRoKSB7XG4gICAgICByZXR1cm4gW2tleV0uY29uY2F0KHN1YlBhdGgpO1xuICAgIH0pO1xuICB9KSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBwYXRoc1RvU3RhdGVWYWx1ZShwYXRocykge1xuICB2YXIgZV80LCBfYTtcblxuICB2YXIgcmVzdWx0ID0ge307XG5cbiAgaWYgKHBhdGhzICYmIHBhdGhzLmxlbmd0aCA9PT0gMSAmJiBwYXRoc1swXS5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gcGF0aHNbMF1bMF07XG4gIH1cblxuICB0cnkge1xuICAgIGZvciAodmFyIHBhdGhzXzEgPSBfX3ZhbHVlcyhwYXRocyksIHBhdGhzXzFfMSA9IHBhdGhzXzEubmV4dCgpOyAhcGF0aHNfMV8xLmRvbmU7IHBhdGhzXzFfMSA9IHBhdGhzXzEubmV4dCgpKSB7XG4gICAgICB2YXIgY3VycmVudFBhdGggPSBwYXRoc18xXzEudmFsdWU7XG4gICAgICB2YXIgbWFya2VyID0gcmVzdWx0OyAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cHJlZmVyLWZvci1vZlxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJlbnRQYXRoLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBzdWJQYXRoID0gY3VycmVudFBhdGhbaV07XG5cbiAgICAgICAgaWYgKGkgPT09IGN1cnJlbnRQYXRoLmxlbmd0aCAtIDIpIHtcbiAgICAgICAgICBtYXJrZXJbc3ViUGF0aF0gPSBjdXJyZW50UGF0aFtpICsgMV07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBtYXJrZXJbc3ViUGF0aF0gPSBtYXJrZXJbc3ViUGF0aF0gfHwge307XG4gICAgICAgIG1hcmtlciA9IG1hcmtlcltzdWJQYXRoXTtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVfNF8xKSB7XG4gICAgZV80ID0ge1xuICAgICAgZXJyb3I6IGVfNF8xXG4gICAgfTtcbiAgfSBmaW5hbGx5IHtcbiAgICB0cnkge1xuICAgICAgaWYgKHBhdGhzXzFfMSAmJiAhcGF0aHNfMV8xLmRvbmUgJiYgKF9hID0gcGF0aHNfMS5yZXR1cm4pKSBfYS5jYWxsKHBhdGhzXzEpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpZiAoZV80KSB0aHJvdyBlXzQuZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGZsYXR0ZW4oYXJyYXkpIHtcbiAgdmFyIF9hO1xuXG4gIHJldHVybiAoX2EgPSBbXSkuY29uY2F0LmFwcGx5KF9hLCBfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQoYXJyYXkpLCBmYWxzZSkpO1xufVxuZnVuY3Rpb24gdG9BcnJheVN0cmljdCh2YWx1ZSkge1xuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICByZXR1cm4gW3ZhbHVlXTtcbn1cbmZ1bmN0aW9uIHRvQXJyYXkodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICByZXR1cm4gdG9BcnJheVN0cmljdCh2YWx1ZSk7XG59XG5mdW5jdGlvbiBtYXBDb250ZXh0KG1hcHBlciwgY29udGV4dCwgX2V2ZW50KSB7XG4gIHZhciBlXzUsIF9hO1xuXG4gIGlmIChpc0Z1bmN0aW9uKG1hcHBlcikpIHtcbiAgICByZXR1cm4gbWFwcGVyKGNvbnRleHQsIF9ldmVudC5kYXRhKTtcbiAgfVxuXG4gIHZhciByZXN1bHQgPSB7fTtcblxuICB0cnkge1xuICAgIGZvciAodmFyIF9iID0gX192YWx1ZXMoT2JqZWN0LmtleXMobWFwcGVyKSksIF9jID0gX2IubmV4dCgpOyAhX2MuZG9uZTsgX2MgPSBfYi5uZXh0KCkpIHtcbiAgICAgIHZhciBrZXkgPSBfYy52YWx1ZTtcbiAgICAgIHZhciBzdWJNYXBwZXIgPSBtYXBwZXJba2V5XTtcblxuICAgICAgaWYgKGlzRnVuY3Rpb24oc3ViTWFwcGVyKSkge1xuICAgICAgICByZXN1bHRba2V5XSA9IHN1Yk1hcHBlcihjb250ZXh0LCBfZXZlbnQuZGF0YSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRba2V5XSA9IHN1Yk1hcHBlcjtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVfNV8xKSB7XG4gICAgZV81ID0ge1xuICAgICAgZXJyb3I6IGVfNV8xXG4gICAgfTtcbiAgfSBmaW5hbGx5IHtcbiAgICB0cnkge1xuICAgICAgaWYgKF9jICYmICFfYy5kb25lICYmIChfYSA9IF9iLnJldHVybikpIF9hLmNhbGwoX2IpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpZiAoZV81KSB0aHJvdyBlXzUuZXJyb3I7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIGlzQnVpbHRJbkV2ZW50KGV2ZW50VHlwZSkge1xuICByZXR1cm4gL14oZG9uZXxlcnJvcilcXC4vLnRlc3QoZXZlbnRUeXBlKTtcbn1cbmZ1bmN0aW9uIGlzUHJvbWlzZUxpa2UodmFsdWUpIHtcbiAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IC8vIENoZWNrIGlmIHNoYXBlIG1hdGNoZXMgdGhlIFByb21pc2UvQSsgc3BlY2lmaWNhdGlvbiBmb3IgYSBcInRoZW5hYmxlXCIuXG5cblxuICBpZiAodmFsdWUgIT09IG51bGwgJiYgKGlzRnVuY3Rpb24odmFsdWUpIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpICYmIGlzRnVuY3Rpb24odmFsdWUudGhlbikpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cbmZ1bmN0aW9uIGlzQmVoYXZpb3IodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9PSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgJ3RyYW5zaXRpb24nIGluIHZhbHVlICYmIHR5cGVvZiB2YWx1ZS50cmFuc2l0aW9uID09PSAnZnVuY3Rpb24nO1xufVxuZnVuY3Rpb24gcGFydGl0aW9uKGl0ZW1zLCBwcmVkaWNhdGUpIHtcbiAgdmFyIGVfNiwgX2E7XG5cbiAgdmFyIF9iID0gX19yZWFkKFtbXSwgW11dLCAyKSxcbiAgICAgIHRydXRoeSA9IF9iWzBdLFxuICAgICAgZmFsc3kgPSBfYlsxXTtcblxuICB0cnkge1xuICAgIGZvciAodmFyIGl0ZW1zXzEgPSBfX3ZhbHVlcyhpdGVtcyksIGl0ZW1zXzFfMSA9IGl0ZW1zXzEubmV4dCgpOyAhaXRlbXNfMV8xLmRvbmU7IGl0ZW1zXzFfMSA9IGl0ZW1zXzEubmV4dCgpKSB7XG4gICAgICB2YXIgaXRlbSA9IGl0ZW1zXzFfMS52YWx1ZTtcblxuICAgICAgaWYgKHByZWRpY2F0ZShpdGVtKSkge1xuICAgICAgICB0cnV0aHkucHVzaChpdGVtKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZhbHN5LnB1c2goaXRlbSk7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlXzZfMSkge1xuICAgIGVfNiA9IHtcbiAgICAgIGVycm9yOiBlXzZfMVxuICAgIH07XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChpdGVtc18xXzEgJiYgIWl0ZW1zXzFfMS5kb25lICYmIChfYSA9IGl0ZW1zXzEucmV0dXJuKSkgX2EuY2FsbChpdGVtc18xKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKGVfNikgdGhyb3cgZV82LmVycm9yO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBbdHJ1dGh5LCBmYWxzeV07XG59XG5mdW5jdGlvbiB1cGRhdGVIaXN0b3J5U3RhdGVzKGhpc3QsIHN0YXRlVmFsdWUpIHtcbiAgcmV0dXJuIG1hcFZhbHVlcyhoaXN0LnN0YXRlcywgZnVuY3Rpb24gKHN1Ykhpc3QsIGtleSkge1xuICAgIGlmICghc3ViSGlzdCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICB2YXIgc3ViU3RhdGVWYWx1ZSA9IChpc1N0cmluZyhzdGF0ZVZhbHVlKSA/IHVuZGVmaW5lZCA6IHN0YXRlVmFsdWVba2V5XSkgfHwgKHN1Ykhpc3QgPyBzdWJIaXN0LmN1cnJlbnQgOiB1bmRlZmluZWQpO1xuXG4gICAgaWYgKCFzdWJTdGF0ZVZhbHVlKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBjdXJyZW50OiBzdWJTdGF0ZVZhbHVlLFxuICAgICAgc3RhdGVzOiB1cGRhdGVIaXN0b3J5U3RhdGVzKHN1Ykhpc3QsIHN1YlN0YXRlVmFsdWUpXG4gICAgfTtcbiAgfSk7XG59XG5mdW5jdGlvbiB1cGRhdGVIaXN0b3J5VmFsdWUoaGlzdCwgc3RhdGVWYWx1ZSkge1xuICByZXR1cm4ge1xuICAgIGN1cnJlbnQ6IHN0YXRlVmFsdWUsXG4gICAgc3RhdGVzOiB1cGRhdGVIaXN0b3J5U3RhdGVzKGhpc3QsIHN0YXRlVmFsdWUpXG4gIH07XG59XG5mdW5jdGlvbiB1cGRhdGVDb250ZXh0KGNvbnRleHQsIF9ldmVudCwgYXNzaWduQWN0aW9ucywgc3RhdGUpIHtcbiAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgd2FybighIWNvbnRleHQsICdBdHRlbXB0aW5nIHRvIHVwZGF0ZSB1bmRlZmluZWQgY29udGV4dCcpO1xuICB9XG5cbiAgdmFyIHVwZGF0ZWRDb250ZXh0ID0gY29udGV4dCA/IGFzc2lnbkFjdGlvbnMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIGFzc2lnbkFjdGlvbikge1xuICAgIHZhciBlXzcsIF9hO1xuXG4gICAgdmFyIGFzc2lnbm1lbnQgPSBhc3NpZ25BY3Rpb24uYXNzaWdubWVudDtcbiAgICB2YXIgbWV0YSA9IHtcbiAgICAgIHN0YXRlOiBzdGF0ZSxcbiAgICAgIGFjdGlvbjogYXNzaWduQWN0aW9uLFxuICAgICAgX2V2ZW50OiBfZXZlbnRcbiAgICB9O1xuICAgIHZhciBwYXJ0aWFsVXBkYXRlID0ge307XG5cbiAgICBpZiAoaXNGdW5jdGlvbihhc3NpZ25tZW50KSkge1xuICAgICAgcGFydGlhbFVwZGF0ZSA9IGFzc2lnbm1lbnQoYWNjLCBfZXZlbnQuZGF0YSwgbWV0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAodmFyIF9iID0gX192YWx1ZXMoT2JqZWN0LmtleXMoYXNzaWdubWVudCkpLCBfYyA9IF9iLm5leHQoKTsgIV9jLmRvbmU7IF9jID0gX2IubmV4dCgpKSB7XG4gICAgICAgICAgdmFyIGtleSA9IF9jLnZhbHVlO1xuICAgICAgICAgIHZhciBwcm9wQXNzaWdubWVudCA9IGFzc2lnbm1lbnRba2V5XTtcbiAgICAgICAgICBwYXJ0aWFsVXBkYXRlW2tleV0gPSBpc0Z1bmN0aW9uKHByb3BBc3NpZ25tZW50KSA/IHByb3BBc3NpZ25tZW50KGFjYywgX2V2ZW50LmRhdGEsIG1ldGEpIDogcHJvcEFzc2lnbm1lbnQ7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVfN18xKSB7XG4gICAgICAgIGVfNyA9IHtcbiAgICAgICAgICBlcnJvcjogZV83XzFcbiAgICAgICAgfTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKF9jICYmICFfYy5kb25lICYmIChfYSA9IF9iLnJldHVybikpIF9hLmNhbGwoX2IpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIGlmIChlXzcpIHRocm93IGVfNy5lcnJvcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBhY2MsIHBhcnRpYWxVcGRhdGUpO1xuICB9LCBjb250ZXh0KSA6IGNvbnRleHQ7XG4gIHJldHVybiB1cGRhdGVkQ29udGV4dDtcbn0gLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWVtcHR5XG5cbnZhciB3YXJuID0gZnVuY3Rpb24gKCkge307XG5cbmlmICghSVNfUFJPRFVDVElPTikge1xuICB3YXJuID0gZnVuY3Rpb24gKGNvbmRpdGlvbiwgbWVzc2FnZSkge1xuICAgIHZhciBlcnJvciA9IGNvbmRpdGlvbiBpbnN0YW5jZW9mIEVycm9yID8gY29uZGl0aW9uIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKCFlcnJvciAmJiBjb25kaXRpb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY29uc29sZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgYXJncyA9IFtcIldhcm5pbmc6IFwiLmNvbmNhdChtZXNzYWdlKV07XG5cbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBhcmdzLnB1c2goZXJyb3IpO1xuICAgICAgfSAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tY29uc29sZVxuXG5cbiAgICAgIGNvbnNvbGUud2Fybi5hcHBseShjb25zb2xlLCBhcmdzKTtcbiAgICB9XG4gIH07XG59XG5mdW5jdGlvbiBpc0FycmF5KHZhbHVlKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKTtcbn0gLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmJhbi10eXBlc1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbic7XG59XG5mdW5jdGlvbiBpc1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJztcbn1cbmZ1bmN0aW9uIHRvR3VhcmQoY29uZGl0aW9uLCBndWFyZE1hcCkge1xuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBpZiAoaXNTdHJpbmcoY29uZGl0aW9uKSkge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiBERUZBVUxUX0dVQVJEX1RZUEUsXG4gICAgICBuYW1lOiBjb25kaXRpb24sXG4gICAgICBwcmVkaWNhdGU6IGd1YXJkTWFwID8gZ3VhcmRNYXBbY29uZGl0aW9uXSA6IHVuZGVmaW5lZFxuICAgIH07XG4gIH1cblxuICBpZiAoaXNGdW5jdGlvbihjb25kaXRpb24pKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6IERFRkFVTFRfR1VBUkRfVFlQRSxcbiAgICAgIG5hbWU6IGNvbmRpdGlvbi5uYW1lLFxuICAgICAgcHJlZGljYXRlOiBjb25kaXRpb25cbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIGNvbmRpdGlvbjtcbn1cbmZ1bmN0aW9uIGlzT2JzZXJ2YWJsZSh2YWx1ZSkge1xuICB0cnkge1xuICAgIHJldHVybiAnc3Vic2NyaWJlJyBpbiB2YWx1ZSAmJiBpc0Z1bmN0aW9uKHZhbHVlLnN1YnNjcmliZSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbnZhciBzeW1ib2xPYnNlcnZhYmxlID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLm9ic2VydmFibGUgfHwgJ0BAb2JzZXJ2YWJsZSc7XG59KCk7IC8vIFRPRE86IHRvIGJlIHJlbW92ZWQgaW4gdjUsIGxlZnQgaXQgb3V0IGp1c3QgdG8gbWluaW1pemUgdGhlIHNjb3BlIG9mIHRoZSBjaGFuZ2UgYW5kIG1haW50YWluIGNvbXBhdGliaWxpdHkgd2l0aCBvbGRlciB2ZXJzaW9ucyBvZiBpbnRlZ3JhdGlvbiBwYWFja2FnZXNcblxudmFyIGludGVyb3BTeW1ib2xzID0gKF9hID0ge30sIF9hW3N5bWJvbE9ic2VydmFibGVdID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcztcbn0sIF9hW1N5bWJvbC5vYnNlcnZhYmxlXSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXM7XG59LCBfYSk7XG5mdW5jdGlvbiBpc01hY2hpbmUodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgJ19feHN0YXRlbm9kZScgaW4gdmFsdWU7XG59XG5mdW5jdGlvbiBpc0FjdG9yKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZS5zZW5kID09PSAnZnVuY3Rpb24nO1xufVxudmFyIHVuaXF1ZUlkID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgdmFyIGN1cnJlbnRJZCA9IDA7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgY3VycmVudElkKys7XG4gICAgcmV0dXJuIGN1cnJlbnRJZC50b1N0cmluZygxNik7XG4gIH07XG59KCk7XG5mdW5jdGlvbiB0b0V2ZW50T2JqZWN0KGV2ZW50LCBwYXlsb2FkIC8vIGlkPzogVEV2ZW50Wyd0eXBlJ11cbikge1xuICBpZiAoaXNTdHJpbmcoZXZlbnQpIHx8IHR5cGVvZiBldmVudCA9PT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gX19hc3NpZ24oe1xuICAgICAgdHlwZTogZXZlbnRcbiAgICB9LCBwYXlsb2FkKTtcbiAgfVxuXG4gIHJldHVybiBldmVudDtcbn1cbmZ1bmN0aW9uIHRvU0NYTUxFdmVudChldmVudCwgc2N4bWxFdmVudCkge1xuICBpZiAoIWlzU3RyaW5nKGV2ZW50KSAmJiAnJCR0eXBlJyBpbiBldmVudCAmJiBldmVudC4kJHR5cGUgPT09ICdzY3htbCcpIHtcbiAgICByZXR1cm4gZXZlbnQ7XG4gIH1cblxuICB2YXIgZXZlbnRPYmplY3QgPSB0b0V2ZW50T2JqZWN0KGV2ZW50KTtcbiAgcmV0dXJuIF9fYXNzaWduKHtcbiAgICBuYW1lOiBldmVudE9iamVjdC50eXBlLFxuICAgIGRhdGE6IGV2ZW50T2JqZWN0LFxuICAgICQkdHlwZTogJ3NjeG1sJyxcbiAgICB0eXBlOiAnZXh0ZXJuYWwnXG4gIH0sIHNjeG1sRXZlbnQpO1xufVxuZnVuY3Rpb24gdG9UcmFuc2l0aW9uQ29uZmlnQXJyYXkoZXZlbnQsIGNvbmZpZ0xpa2UpIHtcbiAgdmFyIHRyYW5zaXRpb25zID0gdG9BcnJheVN0cmljdChjb25maWdMaWtlKS5tYXAoZnVuY3Rpb24gKHRyYW5zaXRpb25MaWtlKSB7XG4gICAgaWYgKHR5cGVvZiB0cmFuc2l0aW9uTGlrZSA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHRyYW5zaXRpb25MaWtlID09PSAnc3RyaW5nJyB8fCBpc01hY2hpbmUodHJhbnNpdGlvbkxpa2UpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0YXJnZXQ6IHRyYW5zaXRpb25MaWtlLFxuICAgICAgICBldmVudDogZXZlbnRcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCB0cmFuc2l0aW9uTGlrZSksIHtcbiAgICAgIGV2ZW50OiBldmVudFxuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIHRyYW5zaXRpb25zO1xufVxuZnVuY3Rpb24gbm9ybWFsaXplVGFyZ2V0KHRhcmdldCkge1xuICBpZiAodGFyZ2V0ID09PSB1bmRlZmluZWQgfHwgdGFyZ2V0ID09PSBUQVJHRVRMRVNTX0tFWSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICByZXR1cm4gdG9BcnJheSh0YXJnZXQpO1xufVxuZnVuY3Rpb24gcmVwb3J0VW5oYW5kbGVkRXhjZXB0aW9uT25JbnZvY2F0aW9uKG9yaWdpbmFsRXJyb3IsIGN1cnJlbnRFcnJvciwgaWQpIHtcbiAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgdmFyIG9yaWdpbmFsU3RhY2tUcmFjZSA9IG9yaWdpbmFsRXJyb3Iuc3RhY2sgPyBcIiBTdGFja3RyYWNlIHdhcyAnXCIuY29uY2F0KG9yaWdpbmFsRXJyb3Iuc3RhY2ssIFwiJ1wiKSA6ICcnO1xuXG4gICAgaWYgKG9yaWdpbmFsRXJyb3IgPT09IGN1cnJlbnRFcnJvcikge1xuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWNvbnNvbGVcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJNaXNzaW5nIG9uRXJyb3IgaGFuZGxlciBmb3IgaW52b2NhdGlvbiAnXCIuY29uY2F0KGlkLCBcIicsIGVycm9yIHdhcyAnXCIpLmNvbmNhdChvcmlnaW5hbEVycm9yLCBcIicuXCIpLmNvbmNhdChvcmlnaW5hbFN0YWNrVHJhY2UpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHN0YWNrVHJhY2UgPSBjdXJyZW50RXJyb3Iuc3RhY2sgPyBcIiBTdGFja3RyYWNlIHdhcyAnXCIuY29uY2F0KGN1cnJlbnRFcnJvci5zdGFjaywgXCInXCIpIDogJyc7IC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1jb25zb2xlXG5cbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJNaXNzaW5nIG9uRXJyb3IgaGFuZGxlciBhbmQvb3IgdW5oYW5kbGVkIGV4Y2VwdGlvbi9wcm9taXNlIHJlamVjdGlvbiBmb3IgaW52b2NhdGlvbiAnXCIuY29uY2F0KGlkLCBcIicuIFwiKSArIFwiT3JpZ2luYWwgZXJyb3I6ICdcIi5jb25jYXQob3JpZ2luYWxFcnJvciwgXCInLiBcIikuY29uY2F0KG9yaWdpbmFsU3RhY2tUcmFjZSwgXCIgQ3VycmVudCBlcnJvciBpcyAnXCIpLmNvbmNhdChjdXJyZW50RXJyb3IsIFwiJy5cIikuY29uY2F0KHN0YWNrVHJhY2UpKTtcbiAgICB9XG4gIH1cbn1cbmZ1bmN0aW9uIGV2YWx1YXRlR3VhcmQobWFjaGluZSwgZ3VhcmQsIGNvbnRleHQsIF9ldmVudCwgc3RhdGUpIHtcbiAgdmFyIGd1YXJkcyA9IG1hY2hpbmUub3B0aW9ucy5ndWFyZHM7XG4gIHZhciBndWFyZE1ldGEgPSB7XG4gICAgc3RhdGU6IHN0YXRlLFxuICAgIGNvbmQ6IGd1YXJkLFxuICAgIF9ldmVudDogX2V2ZW50XG4gIH07IC8vIFRPRE86IGRvIG5vdCBoYXJkY29kZSFcblxuICBpZiAoZ3VhcmQudHlwZSA9PT0gREVGQVVMVF9HVUFSRF9UWVBFKSB7XG4gICAgcmV0dXJuICgoZ3VhcmRzID09PSBudWxsIHx8IGd1YXJkcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogZ3VhcmRzW2d1YXJkLm5hbWVdKSB8fCBndWFyZC5wcmVkaWNhdGUpKGNvbnRleHQsIF9ldmVudC5kYXRhLCBndWFyZE1ldGEpO1xuICB9XG5cbiAgdmFyIGNvbmRGbiA9IGd1YXJkcyA9PT0gbnVsbCB8fCBndWFyZHMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGd1YXJkc1tndWFyZC50eXBlXTtcblxuICBpZiAoIWNvbmRGbikge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkd1YXJkICdcIi5jb25jYXQoZ3VhcmQudHlwZSwgXCInIGlzIG5vdCBpbXBsZW1lbnRlZCBvbiBtYWNoaW5lICdcIikuY29uY2F0KG1hY2hpbmUuaWQsIFwiJy5cIikpO1xuICB9XG5cbiAgcmV0dXJuIGNvbmRGbihjb250ZXh0LCBfZXZlbnQuZGF0YSwgZ3VhcmRNZXRhKTtcbn1cbmZ1bmN0aW9uIHRvSW52b2tlU291cmNlKHNyYykge1xuICBpZiAodHlwZW9mIHNyYyA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogc3JjXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBzcmM7XG59XG5mdW5jdGlvbiB0b09ic2VydmVyKG5leHRIYW5kbGVyLCBlcnJvckhhbmRsZXIsIGNvbXBsZXRpb25IYW5kbGVyKSB7XG4gIHZhciBub29wID0gZnVuY3Rpb24gKCkge307XG5cbiAgdmFyIGlzT2JzZXJ2ZXIgPSB0eXBlb2YgbmV4dEhhbmRsZXIgPT09ICdvYmplY3QnO1xuICB2YXIgc2VsZiA9IGlzT2JzZXJ2ZXIgPyBuZXh0SGFuZGxlciA6IG51bGw7XG4gIHJldHVybiB7XG4gICAgbmV4dDogKChpc09ic2VydmVyID8gbmV4dEhhbmRsZXIubmV4dCA6IG5leHRIYW5kbGVyKSB8fCBub29wKS5iaW5kKHNlbGYpLFxuICAgIGVycm9yOiAoKGlzT2JzZXJ2ZXIgPyBuZXh0SGFuZGxlci5lcnJvciA6IGVycm9ySGFuZGxlcikgfHwgbm9vcCkuYmluZChzZWxmKSxcbiAgICBjb21wbGV0ZTogKChpc09ic2VydmVyID8gbmV4dEhhbmRsZXIuY29tcGxldGUgOiBjb21wbGV0aW9uSGFuZGxlcikgfHwgbm9vcCkuYmluZChzZWxmKVxuICB9O1xufVxuZnVuY3Rpb24gY3JlYXRlSW52b2tlSWQoc3RhdGVOb2RlSWQsIGluZGV4KSB7XG4gIHJldHVybiBcIlwiLmNvbmNhdChzdGF0ZU5vZGVJZCwgXCI6aW52b2NhdGlvbltcIikuY29uY2F0KGluZGV4LCBcIl1cIik7XG59XG5mdW5jdGlvbiBpc1JhaXNhYmxlQWN0aW9uKGFjdGlvbikge1xuICByZXR1cm4gKGFjdGlvbi50eXBlID09PSByYWlzZSB8fCBhY3Rpb24udHlwZSA9PT0gc2VuZCAmJiBhY3Rpb24udG8gPT09IFNwZWNpYWxUYXJnZXRzLkludGVybmFsKSAmJiB0eXBlb2YgYWN0aW9uLmRlbGF5ICE9PSAnbnVtYmVyJztcbn1cblxuZXhwb3J0IHsgY3JlYXRlSW52b2tlSWQsIGV2YWx1YXRlR3VhcmQsIGZsYXR0ZW4sIGdldEFjdGlvblR5cGUsIGdldEV2ZW50VHlwZSwgaW50ZXJvcFN5bWJvbHMsIGlzQWN0b3IsIGlzQXJyYXksIGlzQmVoYXZpb3IsIGlzQnVpbHRJbkV2ZW50LCBpc0Z1bmN0aW9uLCBpc01hY2hpbmUsIGlzT2JzZXJ2YWJsZSwgaXNQcm9taXNlTGlrZSwgaXNSYWlzYWJsZUFjdGlvbiwgaXNTdGF0ZUxpa2UsIGlzU3RyaW5nLCBrZXlzLCBtYXBDb250ZXh0LCBtYXBGaWx0ZXJWYWx1ZXMsIG1hcFZhbHVlcywgbWF0Y2hlc1N0YXRlLCBuZXN0ZWRQYXRoLCBub3JtYWxpemVUYXJnZXQsIHBhcnRpdGlvbiwgcGF0aCwgcGF0aFRvU3RhdGVWYWx1ZSwgcGF0aHNUb1N0YXRlVmFsdWUsIHJlcG9ydFVuaGFuZGxlZEV4Y2VwdGlvbk9uSW52b2NhdGlvbiwgc3ltYm9sT2JzZXJ2YWJsZSwgdG9BcnJheSwgdG9BcnJheVN0cmljdCwgdG9FdmVudE9iamVjdCwgdG9HdWFyZCwgdG9JbnZva2VTb3VyY2UsIHRvT2JzZXJ2ZXIsIHRvU0NYTUxFdmVudCwgdG9TdGF0ZVBhdGgsIHRvU3RhdGVQYXRocywgdG9TdGF0ZVZhbHVlLCB0b1RyYW5zaXRpb25Db25maWdBcnJheSwgdW5pcXVlSWQsIHVwZGF0ZUNvbnRleHQsIHVwZGF0ZUhpc3RvcnlTdGF0ZXMsIHVwZGF0ZUhpc3RvcnlWYWx1ZSwgd2FybiB9O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJpbXBvcnQgeyBidXR0b25Nb2R1bGUgfSBmcm9tIFwiLi9CdXR0b25Nb2R1bGUuanNcIjtcbmltcG9ydCBFdmVudEJ1cyBmcm9tIFwiLi9FdmVudEJ1cy5qc1wiO1xuaW1wb3J0IEV2ZW50TW9kdWxlIGZyb20gXCIuL0V2ZW50TW9kdWxlLmpzXCI7XG5pbXBvcnQgeyBpc01vYmlsZVZpZXcsIGFkZFVzZXJBZ2VudEZsYWdzIH0gZnJvbSBcIi4vVXNlckFnZW50TW9kdWxlLmpzXCI7XG5pbXBvcnQgXCIuL3RhbGtCdXR0b24uY3NzXCI7XG5pbXBvcnQgXCIuL21vYmlsZS5zY3NzXCI7XG5pbXBvcnQgXCIuL3JlY3RhbmdsZXMuY3NzXCI7XG4oZnVuY3Rpb24gKCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICBjb25zdCBwYWdlU2NyaXB0ID0gcmVxdWlyZShcInJhdy1sb2FkZXIhLi9BdWRpb01vZHVsZS5qc1wiKS5kZWZhdWx0O1xuICBhZGRVc2VyQWdlbnRGbGFncygpO1xuICBFdmVudE1vZHVsZS5pbml0KCk7XG4gIHNldHVwRXZlbnRCdXMoKTtcblxuICAvLyBDcmVhdGUgYSBNdXRhdGlvbk9ic2VydmVyIHRvIGxpc3RlbiBmb3IgY2hhbmdlcyB0byB0aGUgRE9NXG4gIHZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uIChtdXRhdGlvbnMpIHtcbiAgICAvLyBDaGVjayBlYWNoIG11dGF0aW9uXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtdXRhdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBtdXRhdGlvbiA9IG11dGF0aW9uc1tpXTtcblxuICAgICAgLy8gSWYgbm9kZXMgd2VyZSBhZGRlZCwgY2hlY2sgZWFjaCBvbmVcbiAgICAgIGlmIChtdXRhdGlvbi5hZGRlZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBtdXRhdGlvbi5hZGRlZE5vZGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgdmFyIG5vZGUgPSBtdXRhdGlvbi5hZGRlZE5vZGVzW2pdO1xuXG4gICAgICAgICAgLy8gSWYgdGhlIG5vZGUgaXMgdGhlIGFwcHJvcHJpYXRlIGNvbnRhaW5lciBlbGVtZW50LCBhZGQgdGhlIGJ1dHRvbiBhbmQgc3RvcCBvYnNlcnZpbmdcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiZGl2XCIgJiZcbiAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZml4ZWRcIikgJiZcbiAgICAgICAgICAgIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYm90dG9tLTE2XCIpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB2YXIgZm9vdGVyID0gbm9kZTtcbiAgICAgICAgICAgIHZhciBidXR0b25Db250YWluZXIgPSBmb290ZXIucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgICAgXCIucmVsYXRpdmUuZmxleC5mbGV4LWNvbFwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKGJ1dHRvbkNvbnRhaW5lcikge1xuICAgICAgICAgICAgICBhZGRUYWxrQnV0dG9uKGJ1dHRvbkNvbnRhaW5lcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJObyBidXR0b24gY29udGFpbmVyIGZvdW5kIGluIGZvb3RlclwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghYW5ub3RhdGVET00oKSkge1xuICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJSZXF1aXJlZCBlbGVtZW50cyBub3QgZm91bmQgaW4gRE9NXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzTW9iaWxlVmlldygpKSB7XG4gICAgICAgICAgICAgIGJ1dHRvbk1vZHVsZS5jcmVhdGVFeGl0QnV0dG9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBmdW5jdGlvbiBzZXR1cEV2ZW50QnVzKCkge1xuICAgIC8vIFNldHRpbmcgdGhlIGNvcnJlY3QgY29udGV4dFxuICAgIGxldCBjb250ZXh0ID0gd2luZG93O1xuICAgIGlmIChHTV9pbmZvLnNjcmlwdEhhbmRsZXIgIT09IFwiVXNlcnNjcmlwdHNcIikge1xuICAgICAgY29udGV4dCA9IHVuc2FmZVdpbmRvdztcbiAgICB9XG4gICAgY29udGV4dC5FdmVudEJ1cyA9IEV2ZW50QnVzOyAvLyBNYWtlIHRoZSBFdmVudEJ1cyBhdmFpbGFibGUgdG8gdGhlIHBhZ2Ugc2NyaXB0XG4gIH1cblxuICBmdW5jdGlvbiBhbm5vdGF0ZURPTSgpIHtcbiAgICAvLyBBZGQgYW4gSUQgdG8gdGhlIHByb21wdCB0ZXh0YXJlYVxuICAgIGNvbnN0IGZvdW5kUHJvbXB0ID0gYWRkSWRQcm9tcHRUZXh0QXJlYSgpO1xuICAgIGNvbnN0IGZvdW5kRm9vdGVyID0gYWRkSWRGb290ZXIoKTtcbiAgICByZXR1cm4gZm91bmRQcm9tcHQgJiYgZm91bmRGb290ZXI7XG4gIH1cblxuICBmdW5jdGlvbiBhZGRJZFByb21wdFRleHRBcmVhKCkge1xuICAgIHZhciB0ZXh0YXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F5cGktcHJvbXB0XCIpO1xuICAgIGlmICghdGV4dGFyZWEpIHtcbiAgICAgIC8vIEZpbmQgdGhlIGZpcnN0IDx0ZXh0YXJlYT4gZWxlbWVudCBhbmQgZ2l2ZSBpdCBhbiBpZFxuICAgICAgdmFyIHRleHRhcmVhRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ0ZXh0YXJlYVwiKTtcbiAgICAgIGlmICh0ZXh0YXJlYUVsZW1lbnQpIHtcbiAgICAgICAgdGV4dGFyZWFFbGVtZW50LmlkID0gXCJzYXlwaS1wcm9tcHRcIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcIk5vIDx0ZXh0YXJlYT4gZWxlbWVudCBmb3VuZFwiKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZElkRm9vdGVyKCkge1xuICAgIC8vIEZpbmQgYWxsIGF1ZGlvIGVsZW1lbnRzIG9uIHRoZSBwYWdlXG4gICAgdmFyIGF1ZGlvRWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiYXVkaW9cIik7XG4gICAgdmFyIGZvdW5kID0gZmFsc2U7IC8vIGRlZmF1bHQgdG8gbm90IGZvdW5kXG5cbiAgICBhdWRpb0VsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGF1ZGlvKSB7XG4gICAgICB2YXIgcHJlY2VkaW5nRGl2ID0gYXVkaW8ucHJldmlvdXNFbGVtZW50U2libGluZztcblxuICAgICAgLy8gSWYgd2UndmUgYWxyZWFkeSBmb3VuZCBhIGRpdiwgd2UgY2FuIHNraXAgZnVydGhlciBpdGVyYXRpb25zXG4gICAgICBpZiAoZm91bmQpIHJldHVybjtcblxuICAgICAgLy8gQ2hlY2sgaWYgdGhlIHByZWNlZGluZyBlbGVtZW50IGlzIGEgZGl2XG4gICAgICBpZiAocHJlY2VkaW5nRGl2ICYmIHByZWNlZGluZ0Rpdi50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiZGl2XCIpIHtcbiAgICAgICAgLy8gQXNzaWduIGFuIElEIHRvIHRoZSBkaXZcbiAgICAgICAgcHJlY2VkaW5nRGl2LmlkID0gXCJzYXlwaS1mb290ZXJcIjtcbiAgICAgICAgZm91bmQgPSB0cnVlOyAvLyBzZXQgdG8gZm91bmRcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBmb3VuZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluamVjdFNjcmlwdChjYWxsYmFjaykge1xuICAgIHZhciBzY3JpcHRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICBzY3JpcHRFbGVtZW50LnR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiO1xuICAgIHNjcmlwdEVsZW1lbnQuaWQgPSBcInNheXBpLXNjcmlwdFwiO1xuICAgIHNjcmlwdEVsZW1lbnQudGV4dENvbnRlbnQgPSBwYWdlU2NyaXB0O1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0RWxlbWVudCk7XG5cbiAgICAvLyBDYWxsIHRoZSBjYWxsYmFjayBmdW5jdGlvbiBhZnRlciB0aGUgc2NyaXB0IGlzIGFkZGVkXG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFRhbGtCdXR0b24oY29udGFpbmVyKSB7XG4gICAgLy8gY3JlYXRlIGEgY29udGFpbmluZyBkaXZcbiAgICB2YXIgcGFuZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHBhbmVsLmlkID0gXCJzYXlwaS1wYW5lbFwiO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChwYW5lbCk7XG5cbiAgICAvLyBDcmVhdGUgdGhlIHRhbGsgYnV0dG9uIHVzaW5nIEJ1dHRvbk1vZHVsZVxuICAgIGNvbnN0IGxhYmVsID1cbiAgICAgIFwiVGFsayAoSG9sZCBDb250cm9sICsgU3BhY2UgdG8gdXNlIGhvdGtleS4gRG91YmxlIGNsaWNrIHRvIHRvZ2dsZSBhdXRvLXN1Ym1pdCBvbi9vZmYpXCI7XG4gICAgdmFyIGJ1dHRvbiA9IGJ1dHRvbk1vZHVsZS5jcmVhdGVCdXR0b24oXCJcIiwgKCkgPT4ge30pOyAvLyBUaGUgY2FsbGJhY2sgaXMgZW1wdHkgZm9yIG5vdywgYnV0IHlvdSBjYW4gYWRkIGZ1bmN0aW9uYWxpdGllcyBpZiBuZWVkZWQuXG5cbiAgICBidXR0b24uaWQgPSBcInNheXBpLXRhbGtCdXR0b25cIjtcbiAgICBidXR0b24udHlwZSA9IFwiYnV0dG9uXCI7XG5cbiAgICAvLyBTZXQgQVJJQSBsYWJlbCBhbmQgdG9vbHRpcFxuICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIGxhYmVsKTtcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKFwidGl0bGVcIiwgbGFiZWwpO1xuXG4gICAgY29uc3QgY2xhc3NOYW1lcyA9XG4gICAgICBcInJlbGF0aXZlIGZsZXggbXQtMSBtYi0xIHJvdW5kZWQtZnVsbCBweC0yIHB5LTMgdGV4dC1jZW50ZXIgYmctY3JlYW0tNTUwIGhvdmVyOmJnLWNyZWFtLTY1MCBob3Zlcjp0ZXh0LWJyYW5kLWdyZWVuLTcwMCB0ZXh0LW11dGVkXCI7XG4gICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lcy5zcGxpdChcIiBcIikpO1xuXG4gICAgLy8gRW5hYmxlIGF1dG9zdWJtaXQgYnkgZGVmYXVsdFxuICAgIGJ1dHRvbi5kYXRhc2V0LmF1dG9zdWJtaXQgPSBcInRydWVcIjtcbiAgICBidXR0b24uY2xhc3NMaXN0LmFkZChcImF1dG9TdWJtaXRcIik7XG5cbiAgICBwYW5lbC5hcHBlbmRDaGlsZChidXR0b24pO1xuICAgIGJ1dHRvbk1vZHVsZS5hZGRUYWxrSWNvbihidXR0b24pO1xuXG4gICAgLy8gQ2FsbCB0aGUgZnVuY3Rpb24gdG8gaW5qZWN0IHRoZSBzY3JpcHQgYWZ0ZXIgdGhlIGJ1dHRvbiBoYXMgYmVlbiBhZGRlZFxuICAgIGluamVjdFNjcmlwdChyZWdpc3RlckF1ZGlvQnV0dG9uRXZlbnRzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlZ2lzdGVyQXVkaW9CdXR0b25FdmVudHMoKSB7XG4gICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS10YWxrQnV0dG9uXCIpO1xuXG4gICAgLy8gQXR0YWNoIHRoZSBldmVudCBsaXN0ZW5lcnNcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwibW91c2Vkb3duXCIsXG4gICAgICBFdmVudE1vZHVsZS5oYW5kbGVUYWxrTW91c2VEb3duLmJpbmQoRXZlbnRNb2R1bGUpXG4gICAgKTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwibW91c2V1cFwiLFxuICAgICAgRXZlbnRNb2R1bGUuaGFuZGxlVGFsa01vdXNlVXAuYmluZChFdmVudE1vZHVsZSlcbiAgICApO1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiZGJsY2xpY2tcIiwgKCkgPT5cbiAgICAgIEV2ZW50TW9kdWxlLmhhbmRsZVRhbGtEb3VibGVDbGljayhidXR0b24pXG4gICAgKTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgKGUpID0+XG4gICAgICBFdmVudE1vZHVsZS5oYW5kbGVUYWxrVG91Y2hTdGFydChidXR0b24sIGUpXG4gICAgKTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsICgpID0+XG4gICAgICBFdmVudE1vZHVsZS5oYW5kbGVUYWxrVG91Y2hFbmQoYnV0dG9uKVxuICAgICk7XG5cbiAgICBFdmVudE1vZHVsZS5yZWdpc3Rlck90aGVyQXVkaW9CdXR0b25FdmVudHMoYnV0dG9uKTtcbiAgICBFdmVudE1vZHVsZS5yZWdpc3RlckhvdGtleSgpO1xuICB9XG5cbiAgLy8gU3RhcnQgb2JzZXJ2aW5nIHRoZSBlbnRpcmUgZG9jdW1lbnQgZm9yIGNoYW5nZXMgdG8gY2hpbGQgbm9kZXMgYW5kIHN1YnRyZWVcbiAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudCwgeyBjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWUgfSk7XG59KSgpO1xuIl0sIm5hbWVzIjpbIkFuaW1hdGlvbk1vZHVsZSIsIl9jbGFzc0NhbGxDaGVjayIsIl9jcmVhdGVDbGFzcyIsImtleSIsInZhbHVlIiwic3RhcnRBbmltYXRpb24iLCJhbmltYXRpb24iLCJzdG9wT3RoZXJBbmltYXRpb25zIiwicmVjdGFuZ2xlcyIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsInJlY3RhbmdsZXNTZWxlY3RvciIsImZvckVhY2giLCJyZWN0IiwiY2xhc3NMaXN0IiwiYWRkIiwic3RvcEFuaW1hdGlvbiIsInJlbW92ZSIsInN0b3BBbGxBbmltYXRpb25zIiwiX3RoaXMiLCJ0YWxrQnV0dG9uQW5pbWF0aW9ucyIsImtlZXBBbmltYXRpb24iLCJfdGhpczIiLCJfZGVmaW5lUHJvcGVydHkiLCJkZWZhdWx0IiwiZXhpdE1vYmlsZU1vZGUiLCJpc01vYmlsZVZpZXciLCJFdmVudEJ1cyIsIkV2ZW50TW9kdWxlIiwiU3RhdGVNYWNoaW5lU2VydmljZSIsImV4aXRJY29uU1ZHIiwicmVjdGFuZ2xlc1NWRyIsInRhbGtJY29uU1ZHIiwiQnV0dG9uTW9kdWxlIiwicGxheUJ1dHRvbiIsImFjdG9yIiwiaGFuZGxlUGxheUJ1dHRvbkNsaWNrIiwiYmluZCIsInJlZ2lzdGVyT3RoZXJFdmVudHMiLCJvbiIsImhhbmRsZUF1dG9TdWJtaXQiLCJjcmVhdGVCdXR0b24iLCJsYWJlbCIsImNhbGxiYWNrIiwiYnV0dG9uIiwiY3JlYXRlRWxlbWVudCIsInRleHRDb250ZW50Iiwib25jbGljayIsInN0eWxlQnV0dG9uIiwic3R5bGVzIiwiaGFzT3duUHJvcGVydHkiLCJzdHlsZSIsImFkZFRhbGtJY29uIiwidXBkYXRlSWNvbkNvbnRlbnQiLCJ3aW5kb3ciLCJtYXRjaE1lZGlhIiwiYWRkTGlzdGVuZXIiLCJzZXR1cENsYXNzT2JzZXJ2ZXIiLCJpY29uQ29udGFpbmVyIiwiaW5uZXJIVE1MIiwidGFyZ2V0Tm9kZSIsImRvY3VtZW50RWxlbWVudCIsImNvbmZpZyIsImF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVGaWx0ZXIiLCJtdXRhdGlvbnNMaXN0Iiwib2JzZXJ2ZXIiLCJfaXRlcmF0b3IiLCJfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlciIsIl9zdGVwIiwicyIsIm4iLCJkb25lIiwibXV0YXRpb24iLCJ0eXBlIiwiYXR0cmlidXRlTmFtZSIsImNvbnRhaW5zIiwiZXJyIiwiZSIsImYiLCJNdXRhdGlvbk9ic2VydmVyIiwib2JzZXJ2ZSIsImNyZWF0ZUV4aXRCdXR0b24iLCJpZCIsImNsYXNzTmFtZSIsInNldEF0dHJpYnV0ZSIsImJvZHkiLCJhcHBlbmRDaGlsZCIsImNyZWF0ZVBsYXlCdXR0b24iLCJhZGRFdmVudExpc3RlbmVyIiwic2hvd1BsYXlCdXR0b24iLCJoaWRlUGxheUJ1dHRvbiIsInNlbmQiLCJlbWl0Iiwic2ltdWxhdGVGb3JtU3VibWl0IiwidGV4dGFyZWEiLCJnZXRFbGVtZW50QnlJZCIsImVudGVyRXZlbnQiLCJLZXlib2FyZEV2ZW50IiwiYnViYmxlcyIsImtleUNvZGUiLCJ3aGljaCIsImRpc3BhdGNoRXZlbnQiLCJ0YWxrQnV0dG9uIiwiZGF0YXNldCIsImF1dG9zdWJtaXQiLCJjb25zb2xlIiwibG9nIiwiYnV0dG9uTW9kdWxlIiwiRXZlbnRFbWl0dGVyIiwiVVNFUl9TUEVBS0lORyIsIlVTRVJfU1RPUFBFRF9TUEVBS0lORyIsIlVTRVJfRklOSVNIRURfU1BFQUtJTkciLCJUUkFOU0NSSUJJTkciLCJQSV9TUEVBS0lORyIsIlBJX1NUT1BQRURfU1BFQUtJTkciLCJQSV9GSU5JU0hFRF9TUEVBS0lORyIsIlBBVVNFIiwiUkVBRFkiLCJQTEFZIiwiaW5pdCIsInJlZ2lzdGVyU3RhdGVNYWNoaW5lRXZlbnRzIiwiY2xlYW51cCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJoYW5kbGVUcmFuc2NyaXB0aW9uUmVzcG9uc2UiLCJzaW11bGF0ZVR5cGluZyIsImVsZW1lbnQiLCJ0ZXh0Iiwid29yZHMiLCJzcGxpdCIsImkiLCJ0eXBlV29yZCIsImxlbmd0aCIsInNldE5hdGl2ZVZhbHVlIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibGFzdFZhbHVlIiwiZXZlbnQiLCJFdmVudCIsInRhcmdldCIsInNpbXVsYXRlZCIsInRyYWNrZXIiLCJfdmFsdWVUcmFja2VyIiwic2V0VmFsdWUiLCJoYW5kbGVUYWxrTW91c2VEb3duIiwiaGFuZGxlVGFsa01vdXNlVXAiLCJoYW5kbGVUYWxrRG91YmxlQ2xpY2siLCJ0b2dnbGUiLCJnZXRBdHRyaWJ1dGUiLCJoYW5kbGVUYWxrVG91Y2hTdGFydCIsInByZXZlbnREZWZhdWx0IiwiaGFuZGxlVGFsa1RvdWNoRW5kIiwicmVnaXN0ZXJPdGhlckF1ZGlvQnV0dG9uRXZlbnRzIiwiZXZlbnROYW1lIiwiZGV0YWlsIiwiX29iamVjdFNwcmVhZCIsIndhcm4iLCJjb25jYXQiLCJyZWdpc3RlckhvdGtleSIsImN0cmxEb3duIiwiY3RybEtleSIsImNvZGUiLCJpbnRlcnByZXQiLCJtYWNoaW5lIiwib25UcmFuc2l0aW9uIiwic3RhdGUiLCJzdGFydCIsImFwcFNlcnZlclVybCIsInByb2Nlc3MiLCJlbnYiLCJBUFBfU0VSVkVSX1VSTCIsImFwaVNlcnZlclVybCIsIkFQSV9TRVJWRVJfVVJMIiwidXBsb2FkQXVkaW8iLCJhdWRpb0Jsb2IiLCJmb3JtRGF0YSIsIkZvcm1EYXRhIiwiYXVkaW9GaWxlbmFtZSIsImFwcGVuZCIsImxhbmd1YWdlIiwibmF2aWdhdG9yIiwiZmV0Y2giLCJtZXRob2QiLCJ0aGVuIiwicmVzcG9uc2UiLCJvayIsIkVycm9yIiwic3RhdHVzVGV4dCIsImpzb24iLCJyZXNwb25zZUpzb24iLCJlcnJvciIsInRyYW5zY3JpcHQiLCJzdWJzdHJpbmciLCJ1c2VyUHJlZmVyZW5jZSIsIm1hdGNoZXMiLCJpc1NhZmFyaSIsInRlc3QiLCJ1c2VyQWdlbnQiLCJhZGRVc2VyQWdlbnRGbGFncyIsImlzRmlyZWZveEFuZHJvaWQiLCJjcmVhdGVNYWNoaW5lIiwiaW5pdGlhbCIsInN0YXRlcyIsImlkbGUiLCJkZXNjcmlwdGlvbiIsImVudHJ5IiwiY29uZCIsInVzZXJTcGVha2luZyIsInBhcmFtcyIsImV4aXQiLCJwYXVzZWQiLCJhY3Rpb25zIiwiaW50ZXJuYWwiLCJwaVNwZWFraW5nIiwidHJhbnNjcmliaW5nIiwibG9hZGluZyIsInByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzIiwicHJlc2VydmVBY3Rpb25PcmRlciIsImNvbnRleHQiLCJfcmVmIiwiYWN0aW9uIiwiX3JlZjIiLCJ0cmFuc2NyaWJlQXVkaW8iLCJibG9iIiwidHJhbnNjcmlwdGlvbiIsImFjdGl2YXRlVGFsa0J1dHRvbiIsImRlYWN0aXZhdGVUYWxrQnV0dG9uIiwiYWNxdWlyZU1pY3JvcGhvbmUiLCJzZXJ2aWNlcyIsImd1YXJkcyIsInRvb1Nob3J0Rm9yVXBsb2FkIiwiZHVyYXRpb24iLCJsb25nRW5vdWdoRm9yVXBsb2FkIiwiZGVsYXlzIiwicGFnZVNjcmlwdCIsInJlcXVpcmUiLCJzZXR1cEV2ZW50QnVzIiwibXV0YXRpb25zIiwiYWRkZWROb2RlcyIsImoiLCJub2RlIiwibm9kZU5hbWUiLCJ0b0xvd2VyQ2FzZSIsImZvb3RlciIsImJ1dHRvbkNvbnRhaW5lciIsInF1ZXJ5U2VsZWN0b3IiLCJhZGRUYWxrQnV0dG9uIiwiYW5ub3RhdGVET00iLCJkaXNjb25uZWN0IiwiR01faW5mbyIsInNjcmlwdEhhbmRsZXIiLCJ1bnNhZmVXaW5kb3ciLCJmb3VuZFByb21wdCIsImFkZElkUHJvbXB0VGV4dEFyZWEiLCJmb3VuZEZvb3RlciIsImFkZElkRm9vdGVyIiwidGV4dGFyZWFFbGVtZW50IiwiYXVkaW9FbGVtZW50cyIsImZvdW5kIiwiYXVkaW8iLCJwcmVjZWRpbmdEaXYiLCJwcmV2aW91c0VsZW1lbnRTaWJsaW5nIiwidGFnTmFtZSIsImluamVjdFNjcmlwdCIsInNjcmlwdEVsZW1lbnQiLCJjb250YWluZXIiLCJwYW5lbCIsImNsYXNzTmFtZXMiLCJyZWdpc3RlckF1ZGlvQnV0dG9uRXZlbnRzIiwiY2hpbGRMaXN0Iiwic3VidHJlZSJdLCJzb3VyY2VSb290IjoiIn0=