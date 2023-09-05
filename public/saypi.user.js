// ==UserScript==
// @name         Say, Pi
// @namespace    http://www.saypi.ai/
// @version      1.3.4
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
    _StateMachineService_js__WEBPACK_IMPORTED_MODULE_0__["default"].actor.send("saypi:transcribeFailed");
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
    },
    errors: {
      description: "Error parent state.",
      initial: "transcribeFailed",
      states: {
        transcribeFailed: {
          description: "The /transcribe API responded with an error."
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
    fill: rgb(245 238 223); /* bg-cream-550 */
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

/* dissary animation to indicate an error */
@keyframes errorAnimation {
  0% {
    transform: rotate(0deg) translate(0px, 0px);
  }
  50% {
    transform: rotate(45deg) translate(10px, 5px);
  }
  100% {
    transform: rotate(-45deg) translate(-10px, -5px);
  }
}

.outermost.error {
  animation: errorAnimation 2s infinite;
  fill: #ff6666; /* shade of red */
}

.second.error {
  animation: errorAnimation 2.2s infinite;
  fill: #ff4d4d; /* another shade of red */
}

.third.error {
  animation: errorAnimation 2.4s infinite;
  fill: #ff3333; /* another shade of red */
}

.fourth.error {
  animation: errorAnimation 2.6s infinite;
  fill: #ff1a1a; /* another shade of red */
}

.fifth.error {
  animation: errorAnimation 2.8s infinite;
  fill: #ff0000; /* pure red */
}

.innermost.error {
  animation: errorAnimation 3s infinite;
  fill: #e60000; /* dark red */
}
`, "",{"version":3,"sources":["webpack://./src/rectangles.css"],"names":[],"mappings":"AAAA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,sBAAsB;EACxB;AACF;AACA;EACE,sCAAsC;EACtC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,mCAAmC;EACnC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,kCAAkC;EAClC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,mCAAmC;EACnC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,kCAAkC;EAClC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,mBAAmB;EACrB;EACA;IACE,qBAAqB;EACvB;AACF;AACA;EACE,sCAAsC;EACtC,wBAAwB;AAC1B;;AAEA,2EAA2E;AAC3E;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,0BAA0B;EAC5B;EACA;IACE,0BAA0B;EAC5B;AACF;AACA;EACE,gCAAgC;EAChC,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,4BAA4B;EAC9B;EACA;IACE,6BAA6B;EAC/B;AACF;AACA;EACE,6BAA6B;EAC7B,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,4BAA4B;EAC9B;EACA;IACE,6BAA6B;EAC/B;AACF;AACA;EACE,4BAA4B;EAC5B,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,4BAA4B;EAC9B;EACA;IACE,6BAA6B;EAC/B;AACF;AACA;EACE,6BAA6B;EAC7B,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,4BAA4B;EAC9B;EACA;IACE,6BAA6B;EAC/B;AACF;AACA;EACE,4BAA4B;EAC5B,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA;EACE;;;;;IAKE,wBAAwB;EAC1B;EACA;IACE,0BAA0B;EAC5B;EACA;IACE,4BAA4B;EAC9B;AACF;AACA;EACE,gCAAgC;EAChC,sBAAsB;EACtB,mCAAmC;AACrC;;AAEA,iDAAiD;AACjD;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,uBAAuB;EACzB;EACA;IACE,qBAAqB;EACvB;EACA;IACE,uBAAuB;EACzB;AACF;AACA;EACE,yCAAyC;EACzC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,oCAAoC;EACtC;EACA;IACE,mCAAmC;EACrC;EACA;IACE,oCAAoC;EACtC;AACF;AACA;EACE,sCAAsC;EACtC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,qCAAqC;EACvC;EACA;IACE,mCAAmC;EACrC;EACA;IACE,oCAAoC;EACtC;AACF;AACA;EACE,qCAAqC;EACrC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,oCAAoC;EACtC;EACA;IACE,mCAAmC;EACrC;EACA;IACE,oCAAoC;EACtC;AACF;AACA;EACE,sCAAsC;EACtC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,qCAAqC;EACvC;EACA;IACE,mCAAmC;EACrC;EACA;IACE,oCAAoC;EACtC;AACF;AACA;EACE,qCAAqC;EACrC,wBAAwB;AAC1B;;AAEA;EACE;;IAEE,gCAAgC;EAClC;EACA;IACE,oCAAoC;EACtC;EACA;IACE,mCAAmC;EACrC;EACA;IACE,oCAAoC;EACtC;AACF;AACA;EACE,yCAAyC;EACzC,wBAAwB;AAC1B;;AAEA,gDAAgD;AAChD;EACE;IACE;mDAC+C;EACjD;EACA;IACE;mDAC+C;EACjD;AACF;AACA,wCAAwC;AACxC;EACE;;IAEE,8BAA8B;EAChC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE;;IAEE,kCAAkC;EACpC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE;;IAEE,kCAAkC;EACpC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE;;IAEE,kCAAkC;EACpC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE;;IAEE,kCAAkC;EACpC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE;;IAEE,kCAAkC;EACpC;EACA;;IAEE,kCAAkC;EACpC;AACF;;AAEA;EACE,qDAAqD;AACvD;;AAEA;EACE,mDAAmD;AACrD;;AAEA;EACE,iDAAiD;AACnD;;AAEA;EACE,mDAAmD;AACrD;;AAEA;EACE,iDAAiD;AACnD;;AAEA;EACE,sDAAsD;AACxD;;AAEA,yEAAyE;AACzE;EACE;;IAEE,wBAAwB;IACxB,2BAA2B;EAC7B;EACA;IACE,0BAA0B;IAC1B,+BAA+B;EACjC;AACF;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,yCAAyC;AAC3C;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,yCAAyC;AAC3C;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,yCAAyC;AAC3C;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,yCAAyC;AAC3C;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,yCAAyC;AAC3C;;AAEA;EACE,yBAAyB;EACzB,6BAA6B;EAC7B,uCAAuC;AACzC;;AAEA,6DAA6D;AAC7D;EACE;;IAEE,UAAU;IACV,2BAA2B;EAC7B;EACA;IACE,YAAY;IACZ,sBAAsB,EAAE,iBAAiB;EAC3C;AACF;;AAEA;EACE,yBAAyB;EACzB,gCAAgC;EAChC,mBAAmB;AACrB;;AAEA;EACE,yBAAyB;EACzB,gCAAgC;EAChC,qBAAqB;AACvB;;AAEA;EACE,yBAAyB;EACzB,gCAAgC;EAChC,qBAAqB;AACvB;;AAEA;EACE,yBAAyB;EACzB,gCAAgC;EAChC,qBAAqB;AACvB;;AAEA;EACE,yBAAyB;EACzB,gCAAgC;EAChC,qBAAqB;AACvB;;AAEA;EACE,yBAAyB;EACzB,gCAAgC;EAChC,mBAAmB;AACrB;;AAEA,2CAA2C;AAC3C;EACE;IACE,2CAA2C;EAC7C;EACA;IACE,6CAA6C;EAC/C;EACA;IACE,gDAAgD;EAClD;AACF;;AAEA;EACE,qCAAqC;EACrC,aAAa,EAAE,iBAAiB;AAClC;;AAEA;EACE,uCAAuC;EACvC,aAAa,EAAE,yBAAyB;AAC1C;;AAEA;EACE,uCAAuC;EACvC,aAAa,EAAE,yBAAyB;AAC1C;;AAEA;EACE,uCAAuC;EACvC,aAAa,EAAE,yBAAyB;AAC1C;;AAEA;EACE,uCAAuC;EACvC,aAAa,EAAE,aAAa;AAC9B;;AAEA;EACE,qCAAqC;EACrC,aAAa,EAAE,aAAa;AAC9B","sourcesContent":["@keyframes pulse_outermost {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.92);\n  }\n}\n.outermost {\n  animation: pulse_outermost 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_second {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.856);\n  }\n}\n.second {\n  animation: pulse_second 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_third {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.792);\n  }\n}\n.third {\n  animation: pulse_third 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_fourth {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.728);\n  }\n}\n.fourth {\n  animation: pulse_fourth 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_fifth {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.664);\n  }\n}\n.fifth {\n  animation: pulse_fifth 5s infinite;\n  transform-origin: center;\n}\n\n@keyframes pulse_innermost {\n  0%,\n  100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.6);\n  }\n}\n.innermost {\n  animation: pulse_innermost 5s infinite;\n  transform-origin: center;\n}\n\n/* bounce animation to indicate Pi is paused awaiting permission to speak */\n@keyframes bounce_outermost {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-5%);\n  }\n  60% {\n    transform: translateY(-3%);\n  }\n}\n.outermost.paused {\n  animation-name: bounce_outermost;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n@keyframes bounce_second {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-5.8%);\n  }\n  60% {\n    transform: translateY(-3.48%);\n  }\n}\n.second.paused {\n  animation-name: bounce_second;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n@keyframes bounce_third {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-6.6%);\n  }\n  60% {\n    transform: translateY(-3.96%);\n  }\n}\n.third.paused {\n  animation-name: bounce_third;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n@keyframes bounce_fourth {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-7.4%);\n  }\n  60% {\n    transform: translateY(-4.44%);\n  }\n}\n.fourth.paused {\n  animation-name: bounce_fourth;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n@keyframes bounce_fifth {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-8.2%);\n  }\n  60% {\n    transform: translateY(-4.92%);\n  }\n}\n.fifth.paused {\n  animation-name: bounce_fifth;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n@keyframes bounce_innermost {\n  0%,\n  20%,\n  50%,\n  80%,\n  100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-9%);\n  }\n  60% {\n    transform: translateY(-5.4%);\n  }\n}\n.innermost.paused {\n  animation-name: bounce_innermost;\n  animation-duration: 2s;\n  animation-iteration-count: infinite;\n}\n\n/* playful animation to indicate Pi is speaking */\n@keyframes speaking_outermost {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.995);\n  }\n  50% {\n    transform: scale(0.9);\n  }\n  75% {\n    transform: scale(0.895);\n  }\n}\n.outermost.piSpeaking {\n  animation: speaking_outermost 2s infinite;\n  transform-origin: center;\n}\n\n@keyframes speaking_second {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.98) rotate(-1deg);\n  }\n  50% {\n    transform: scale(0.87) rotate(0deg);\n  }\n  75% {\n    transform: scale(0.865) rotate(1deg);\n  }\n}\n.second.piSpeaking {\n  animation: speaking_second 2s infinite;\n  transform-origin: center;\n}\n\n@keyframes speaking_third {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.965) rotate(-2deg);\n  }\n  50% {\n    transform: scale(0.84) rotate(0deg);\n  }\n  75% {\n    transform: scale(0.835) rotate(2deg);\n  }\n}\n.third.piSpeaking {\n  animation: speaking_third 2s infinite;\n  transform-origin: center;\n}\n\n@keyframes speaking_fourth {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.95) rotate(-3deg);\n  }\n  50% {\n    transform: scale(0.81) rotate(0deg);\n  }\n  75% {\n    transform: scale(0.805) rotate(3deg);\n  }\n}\n.fourth.piSpeaking {\n  animation: speaking_fourth 2s infinite;\n  transform-origin: center;\n}\n\n@keyframes speaking_fifth {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.935) rotate(-4deg);\n  }\n  50% {\n    transform: scale(0.78) rotate(0deg);\n  }\n  75% {\n    transform: scale(0.775) rotate(4deg);\n  }\n}\n.fifth.piSpeaking {\n  animation: speaking_fifth 2s infinite;\n  transform-origin: center;\n}\n\n@keyframes speaking_innermost {\n  0%,\n  100% {\n    transform: scale(1) rotate(0deg);\n  }\n  25% {\n    transform: scale(0.92) rotate(-5deg);\n  }\n  50% {\n    transform: scale(0.75) rotate(0deg);\n  }\n  75% {\n    transform: scale(0.745) rotate(5deg);\n  }\n}\n.innermost.piSpeaking {\n  animation: speaking_innermost 2s infinite;\n  transform-origin: center;\n}\n\n/* wave animation to indicate user is speaking */\n@keyframes userSpeakingAnimation {\n  50% {\n    transform: scaleY(0.05) scaleX(var(--width-factor))\n      translateX(calc(-50% + var(--spread-amount)));\n  }\n  100% {\n    transform: scaleY(1) scaleX(var(--width-factor))\n      translateX(calc(-50% + var(--spread-amount)));\n  }\n}\n/* user speaking oscillation animation */\n@keyframes waveform_outermost {\n  0%,\n  100% {\n    transform: scaleY(1) scaleX(1);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.9) scaleX(0.9);\n  }\n}\n\n@keyframes waveform_second {\n  0%,\n  100% {\n    transform: scaleY(0.9) scaleX(0.9);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.8) scaleX(0.8);\n  }\n}\n\n@keyframes waveform_third {\n  0%,\n  100% {\n    transform: scaleY(0.8) scaleX(0.8);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.7) scaleX(0.7);\n  }\n}\n\n@keyframes waveform_fourth {\n  0%,\n  100% {\n    transform: scaleY(0.7) scaleX(0.7);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.6) scaleX(0.6);\n  }\n}\n\n@keyframes waveform_fifth {\n  0%,\n  100% {\n    transform: scaleY(0.6) scaleX(0.6);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.5) scaleX(0.5);\n  }\n}\n\n@keyframes waveform_innermost {\n  0%,\n  100% {\n    transform: scaleY(0.5) scaleX(0.5);\n  }\n  25%,\n  75% {\n    transform: scaleY(0.4) scaleX(0.4);\n  }\n}\n\n.outermost.userSpeaking {\n  animation: waveform_outermost 0.7s infinite alternate;\n}\n\n.second.userSpeaking {\n  animation: waveform_second 0.65s infinite alternate;\n}\n\n.third.userSpeaking {\n  animation: waveform_third 0.6s infinite alternate;\n}\n\n.fourth.userSpeaking {\n  animation: waveform_fourth 0.55s infinite alternate;\n}\n\n.fifth.userSpeaking {\n  animation: waveform_fifth 0.5s infinite alternate;\n}\n\n.innermost.userSpeaking {\n  animation: waveform_innermost 0.45s infinite alternate;\n}\n\n/* flipcard animation to indicate Say, Pi is transcribing audio to text */\n@keyframes transcribingFlip {\n  0%,\n  100% {\n    transform: rotateY(0deg);\n    fill: var(--original-color);\n  }\n  50% {\n    transform: rotateY(180deg);\n    fill: var(--transcribing-color);\n  }\n}\n\n.outermost.transcribing {\n  --original-color: #e4f2d1;\n  --transcribing-color: #b3e0fe;\n  animation: transcribingFlip 1.5s infinite;\n}\n\n.second.transcribing {\n  --original-color: #cce8b5;\n  --transcribing-color: #89c2ff;\n  animation: transcribingFlip 1.6s infinite;\n}\n\n.third.transcribing {\n  --original-color: #b3db95;\n  --transcribing-color: #5fa4ff;\n  animation: transcribingFlip 1.7s infinite;\n}\n\n.fourth.transcribing {\n  --original-color: #9bd078;\n  --transcribing-color: #3586ff;\n  animation: transcribingFlip 1.8s infinite;\n}\n\n.fifth.transcribing {\n  --original-color: #83c55c;\n  --transcribing-color: #0b69e3;\n  animation: transcribingFlip 1.9s infinite;\n}\n\n.innermost.transcribing {\n  --original-color: #428a2f;\n  --transcribing-color: #0053bf;\n  animation: transcribingFlip 2s infinite;\n}\n\n/* heartbeat animation to indicate Pi is preparing to speak */\n@keyframes heartbeat {\n  0%,\n  100% {\n    opacity: 1;\n    fill: var(--original-color);\n  }\n  50% {\n    opacity: 0.5;\n    fill: rgb(245 238 223); /* bg-cream-550 */\n  }\n}\n\n.outermost.loading {\n  --original-color: #e4f2d1;\n  animation: heartbeat 2s infinite;\n  animation-delay: 0s;\n}\n\n.second.loading {\n  --original-color: #cce8b5;\n  animation: heartbeat 2s infinite;\n  animation-delay: 0.4s;\n}\n\n.third.loading {\n  --original-color: #b3db95;\n  animation: heartbeat 2s infinite;\n  animation-delay: 0.8s;\n}\n\n.fourth.loading {\n  --original-color: #9bd078;\n  animation: heartbeat 2s infinite;\n  animation-delay: 1.2s;\n}\n\n.fifth.loading {\n  --original-color: #83c55c;\n  animation: heartbeat 2s infinite;\n  animation-delay: 1.6s;\n}\n\n.innermost.loading {\n  --original-color: #428a2f;\n  animation: heartbeat 2s infinite;\n  animation-delay: 2s;\n}\n\n/* dissary animation to indicate an error */\n@keyframes errorAnimation {\n  0% {\n    transform: rotate(0deg) translate(0px, 0px);\n  }\n  50% {\n    transform: rotate(45deg) translate(10px, 5px);\n  }\n  100% {\n    transform: rotate(-45deg) translate(-10px, -5px);\n  }\n}\n\n.outermost.error {\n  animation: errorAnimation 2s infinite;\n  fill: #ff6666; /* shade of red */\n}\n\n.second.error {\n  animation: errorAnimation 2.2s infinite;\n  fill: #ff4d4d; /* another shade of red */\n}\n\n.third.error {\n  animation: errorAnimation 2.4s infinite;\n  fill: #ff3333; /* another shade of red */\n}\n\n.fourth.error {\n  animation: errorAnimation 2.6s infinite;\n  fill: #ff1a1a; /* another shade of red */\n}\n\n.fifth.error {\n  animation: errorAnimation 2.8s infinite;\n  fill: #ff0000; /* pure red */\n}\n\n.innermost.error {\n  animation: errorAnimation 3s infinite;\n  fill: #e60000; /* dark red */\n}\n"],"sourceRoot":""}]);
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
    /* Pi controls: ellipsis, experiences */
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
  html.mobile-view #saypi-experiences-button {
    transform: scale(1.5);
  }
  html.mobile-view #saypi-audio-controls {
    /* hide the voice options */
    /* scale the mute button */
  }
  html.mobile-view #saypi-audio-controls div.p-1 {
    display: none;
  }
  html.mobile-view #saypi-audio-controls button.group {
    transform: scale(2) !important;
    z-index: 50;
    /* hide the voice selector twisty */
  }
  html.mobile-view #saypi-audio-controls button.group + button {
    display: none;
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
  html.mobile-view #saypi-prompt {
    /* hides virtual keyboard on android */
    display: none;
  }
}`, "",{"version":3,"sources":["webpack://./src/mobile.scss"],"names":[],"mappings":"AAAA;EACE;IAqBE,uCAAA;IAMA,6BAAA;EAxBF;EAFE;;IAEE,WAAA;IACA,eAAA;IACA,OAAA;IACA,2CAAA;IAEA,aAAA;IACA,MAAA;IACA,WAAA;EAGJ;EAAE;IACE,WAAA;IACA,YAAA;IACA,6BAAA;IACA,gBAAA;IACA,SAAA;EAEJ;EAEE;;IAEE,qBAAA;EAAJ;EAIE;IACE,2BAAA;IAIA,0BAAA;EALJ;EAEI;IACE,aAAA;EAAN;EAGI;IACE,8BAAA;IACA,WAAA;IACA,mCAAA;EADN;EAEM;IACE,aAAA;EAAR;EAKE;IACE,eAAA;IACA,SAAA;IACA,UAAA;IACA,WAAA;IACA,YAAA;IACA,YAAA;IACA,SAAA;IACA,WAAA;EAHJ;EAME;IACE,aAAA;EAJJ;EAOE;IACE,sCAAA;IACA,aAAA;EALJ;AACF","sourcesContent":["@media (max-width: 768px) {\n  html.mobile-view {\n    #saypi-panel,\n    .play-button {\n      width: 100%;\n      position: fixed;\n      left: 0;\n      background-color: rgba(245, 238, 223, 0.98);\n\n      height: 100vh;\n      top: 0;\n      padding: 5%;\n    }\n\n    #saypi-talkButton {\n      width: 100%;\n      height: 100%;\n      background-color: transparent;\n      border-radius: 0;\n      margin: 0;\n    }\n\n    /* Pi controls: ellipsis, experiences */\n    #__next > main > div > div > div.fixed.top-4.right-6 > button,\n    #saypi-experiences-button {\n      transform: scale(1.5);\n    }\n\n    /* Pi controls: mute/unmute */\n    #saypi-audio-controls {\n      /* hide the voice options */\n      div.p-1 {\n        display: none;\n      }\n      /* scale the mute button */\n      button.group {\n        transform: scale(2) !important;\n        z-index: 50;\n        /* hide the voice selector twisty */\n        + button {\n          display: none;\n        }\n      }\n    }\n\n    #saypi-exitButton {\n      position: fixed;\n      top: 10px;\n      left: 12px;\n      width: 52px;\n      height: 52px;\n      padding: 6px;\n      border: 0;\n      z-index: 60;\n    }\n\n    #saypi-footer {\n      display: none;\n    }\n\n    #saypi-prompt {\n      /* hides virtual keyboard on android */\n      display: none;\n    }\n  }\n}\n"],"sourceRoot":""}]);
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("// depends on the injecting script (saypi.index.js) declaring the EventBus as a global variable\nvar EventBus = window.EventBus;\n\n// audio output (Pi)\nvar audioElement = document.querySelector(\"audio\");\nif (!audioElement) {\n  console.error(\"Audio element not found!\");\n}\n\n// TODO: dedupe this function from EventModule.js\nfunction isSafari() {\n  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);\n}\naudioElement.preload = \"auto\"; // enable aggressive preloading of audio\nvar piAudioManager = {\n  isSpeaking: false,\n  audioElement: audioElement,\n  _userStarted: true,\n  // flag to indicate playback has been started by the user (true by default because user must request initial playback)\n  _isLoadCalled: false,\n  // flag to indicate if the load() method has been called on the audio element\n\n  isLoadCalled: function isLoadCalled() {\n    return this._isLoadCalled;\n  },\n  setIsLoadCalled: function setIsLoadCalled(value) {\n    this._isLoadCalled = value;\n  },\n  reload: function reload() {\n    if (!isSafari()) {\n      return;\n    }\n    this._userStarted = true; // set a flag to indicate playback has been started by the user\n    this.audioElement.load(); // reset for Safari\n    this.audioElement.play();\n  },\n  autoPlay: function autoPlay() {\n    if (!this._userStarted) {\n      this.audioElement.pause();\n      EventBus.emit(\"saypi:pause\");\n    }\n  },\n  stop: function stop() {\n    if (this.isSpeaking) {\n      this.audioElement.pause();\n    }\n    if (this.audioElement.duration && !this.audioElement.ended && this.audioElement.currentTime < this.audioElement.duration) {\n      this.audioElement.currentTime = this.audioElement.duration; // seek the audio to the end\n      this.audioElement.play(); // trigger the ended event\n    }\n  },\n\n  pause: function pause() {\n    this.audioElement.pause();\n  },\n  resume: function resume() {\n    this.audioElement.play();\n  },\n  playing: function playing() {\n    this.isSpeaking = true;\n  },\n  stopped: function stopped() {\n    this.isSpeaking = false;\n    this._userStarted = false;\n  }\n};\n\n// Intercept Autoplay Events (can't autoplay full audio on Safari)\naudioElement.addEventListener(\"play\", function () {\n  if (isSafari()) {\n    piAudioManager.autoPlay();\n  }\n});\naudioElement.addEventListener(\"loadstart\", function () {\n  if (isSafari()) {\n    // tell the state machine that Pi is ready to speak (while paused)\n    EventBus.emit(\"saypi:ready\");\n  }\n});\n\n// Event listeners for detecting when Pi is speaking\naudioElement.addEventListener(\"playing\", function () {\n  piAudioManager.playing();\n  EventBus.emit(\"saypi:piSpeaking\");\n});\naudioElement.addEventListener(\"pause\", function () {\n  piAudioManager.stopped();\n  EventBus.emit(\"saypi:piStoppedSpeaking\");\n});\naudioElement.addEventListener(\"ended\", function () {\n  piAudioManager.stopped();\n  EventBus.emit(\"saypi:piFinishedSpeaking\");\n});\n\n// audio input (user)\nvar audioDataChunks = [];\nvar audioMimeType = \"audio/webm;codecs=opus\";\n\n// Declare a global variable for the mediaRecorder\nvar mediaRecorder;\nvar threshold = 1000; // 1000 ms = 1 second, about the length of \"Hey, Pi\"\n\n// This function will be called when the 'dataavailable' event fires\nfunction handleDataAvailable(e) {\n  // Add the audio data chunk to the array\n  audioDataChunks.push(e.data);\n}\n\n// This function will be called when the 'stop' event fires\nfunction handleStop() {\n  // Create a Blob from the audio data chunks\n  var audioBlob = new Blob(audioDataChunks, {\n    type: audioMimeType\n  });\n\n  // Get the stop time and calculate the duration\n  var stopTime = Date.now();\n  var duration = stopTime - window.startTime;\n\n  // If the duration is greater than the threshold, upload the audio for transcription\n  if (duration >= threshold) {\n    // Upload the audio to the server for transcription\n    EventBus.emit(\"saypi:userFinishedSpeaking\", {\n      duration: duration,\n      blob: audioBlob\n    });\n  }\n\n  // Clear the array for the next recording\n  audioDataChunks = [];\n}\nfunction setupRecording(callback) {\n  if (mediaRecorder) {\n    return;\n  }\n\n  // Get a stream from the user's microphone\n  navigator.mediaDevices.getUserMedia({\n    audio: true\n  }).then(function (stream) {\n    if (!MediaRecorder.isTypeSupported(audioMimeType)) {\n      // use MP4 for Safari\n      audioMimeType = \"audio/mp4\";\n    }\n    // Create a new MediaRecorder object using the stream and specifying the MIME type\n    var options = {\n      mimeType: audioMimeType\n    };\n    mediaRecorder = new MediaRecorder(stream, options);\n\n    // Listen for the 'dataavailable' event\n    mediaRecorder.addEventListener(\"dataavailable\", handleDataAvailable);\n\n    // Listen for the 'stop' event\n    mediaRecorder.addEventListener(\"stop\", handleStop);\n  }).then(function () {\n    // Invoke the callback function\n    if (typeof callback === \"function\") {\n      callback();\n    }\n  })[\"catch\"](function (err) {\n    console.error(\"Error getting audio stream: \" + err);\n  });\n}\nfunction tearDownRecording() {\n  // Check if the MediaRecorder is set up\n  if (!mediaRecorder) {\n    return;\n  }\n\n  // Stop any ongoing recording\n  if (mediaRecorder.state === \"recording\") {\n    mediaRecorder.stop();\n  }\n\n  // Remove the MediaRecorder's event listeners\n  mediaRecorder.removeEventListener(\"dataavailable\", handleDataAvailable);\n  mediaRecorder.removeEventListener(\"stop\", handleStop);\n\n  // Clear the MediaRecorder variable\n  mediaRecorder = null;\n}\n\n// To request recording, other modules can dispatch a custom event audio:startRecording\nfunction startRecording() {\n  // Check if the MediaRecorder is set up\n  if (!mediaRecorder) {\n    setupRecording(startRecording);\n    return;\n  }\n  // Check if Pi is currently speaking and stop her audio\n  if (piAudioManager.isSpeaking) {\n    piAudioManager.pause();\n  }\n\n  // Start recording\n  mediaRecorder.start();\n\n  // Record the start time\n  window.startTime = Date.now();\n  EventBus.emit(\"saypi:userSpeaking\");\n}\n\n// To stop recording, other modules can dispatch a custom event audio:stopRecording\nfunction stopRecording() {\n  if (mediaRecorder && mediaRecorder.state === \"recording\") {\n    // Stop recording\n    mediaRecorder.stop();\n\n    // Record the stop time and calculate the duration\n    var stopTime = Date.now();\n    var duration = stopTime - window.startTime;\n\n    // If the duration is less than the threshold, don't upload the audio for transcription\n    if (duration < threshold) {\n      console.log(\"Recording was too short, not uploading for transcription\");\n      EventBus.emit(\"saypi:userStoppedSpeaking\", {\n        duration: duration\n      });\n      piAudioManager.resume();\n    } else {\n      piAudioManager.stop();\n    }\n  }\n}\n\n/* These events are used to control/pass requests to the audio module from other modules */\nfunction registerCustomAudioEventListeners() {\n  EventBus.on(\"audio:setupRecording\", function (e) {\n    setupRecording();\n  });\n  EventBus.on(\"audio:tearDownRecording\", function (e) {\n    tearDownRecording();\n  });\n  EventBus.on(\"audio:startRecording\", function (e) {\n    startRecording();\n  });\n  EventBus.on(\"audio:stopRecording\", function (e) {\n    stopRecording();\n  });\n  EventBus.on(\"audio:reload\", function (e) {\n    piAudioManager.reload();\n  });\n}\nregisterCustomAudioEventListeners();");

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
    // Add id attributes to important elements
    var foundPrompt = addIdPromptTextArea();
    var foundFooter = addIdFooter();
    var foundAudioControls = addIdAudioControls();
    var foundExperiencesButton = addIdExperiencesButton();
    return foundPrompt && foundFooter && foundAudioControls && foundExperiencesButton;
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
  function addIdAudioControls() {
    // Find all audio elements on the page
    var audioElements = document.querySelectorAll("audio");
    var found = false; // default to not found

    audioElements.forEach(function (audio) {
      var nextDiv = audio.nextElementSibling;

      // If we've already found a div, we can skip further iterations
      if (found) return;

      // Check if the preceding element is a div
      if (nextDiv && nextDiv.tagName.toLowerCase() === "div") {
        // Assign an ID to the div
        nextDiv.id = "saypi-audio-controls";
        found = true; // set to found
      }
    });

    return found;
  }
  function addIdExperiencesButton() {
    // Find all audio elements on the page
    var audioControls = document.getElementById("saypi-audio-controls");
    if (audioControls) {
      var nextSib = audioControls.nextElementSibling;
      // Check if the element is a button
      if (nextSib && nextSib.tagName.toLowerCase() === "button") {
        // Assign an ID to the div
        nextSib.id = "saypi-experiences-button";
        return true;
      }
    }
    return false;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLE9BQU8scUZBQXFGLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxLQUFLLE1BQU0sWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsT0FBTyxZQUFZLE1BQU0sU0FBUyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxTQUFTLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFNBQVMsWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLEtBQUssU0FBUyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxLQUFLLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxTQUFTLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLGFBQWEsT0FBTyxLQUFLLFNBQVMsWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssWUFBWSxNQUFNLEtBQUssS0FBSyxZQUFZLGFBQWEsYUFBYSxPQUFPLFlBQVksTUFBTSxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sS0FBSyxNQUFNLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLEtBQUssWUFBWSxhQUFhLE9BQU8sWUFBWSxNQUFNLEtBQUssS0FBSyxPQUFPLE1BQU0sS0FBSyxLQUFLLE9BQU8sTUFBTSxLQUFLLFlBQVksTUFBTSxNQUFNLFlBQVksTUFBTSxNQUFNLFlBQVksTUFBTSxNQUFNLEtBQUssTUFBTSxZQUFZLE1BQU0sTUFBTSxZQUFZLE1BQU0sTUFBTSxLQUFLLE1BQU0sWUFBWSxNQUFNLE1BQU0sWUFBWSxNQUFNLE1BQU0sS0FBSyxNQUFNLFlBQVksTUFBTSxNQUFNLFlBQVksTUFBTSxNQUFNLEtBQUssTUFBTSxZQUFZLE1BQU0sTUFBTSxZQUFZLE1BQU0sTUFBTSxLQUFLLE1BQU0sWUFBWSxNQUFNLE1BQU0sWUFBWSxNQUFNLE1BQU0sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sWUFBWSxNQUFNLE1BQU0sWUFBWSxhQUFhLE1BQU0sS0FBSyxZQUFZLGFBQWEsTUFBTSxNQUFNLEtBQUssWUFBWSxhQUFhLGFBQWEs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b0gsaUJBQWlCLENBQUMzRyxJQUFJLENBQUNULHVEQUFXLENBQ2hELENBQUM7SUFDRGdCLE1BQU0sQ0FBQzZDLGdCQUFnQixDQUFDLFVBQVUsRUFBRTtNQUFBLE9BQ2xDN0QsdURBQVcsQ0FBQ3FILHFCQUFxQixDQUFDckcsTUFBTSxDQUFDO0lBQUEsQ0FDM0MsQ0FBQztJQUNEQSxNQUFNLENBQUM2QyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsVUFBQ1gsQ0FBQztNQUFBLE9BQ3RDbEQsdURBQVcsQ0FBQ3dILG9CQUFvQixDQUFDeEcsTUFBTSxFQUFFa0MsQ0FBQyxDQUFDO0lBQUEsQ0FDN0MsQ0FBQztJQUNEbEMsTUFBTSxDQUFDNkMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFO01BQUEsT0FDbEM3RCx1REFBVyxDQUFDMEgsa0JBQWtCLENBQUMxRyxNQUFNLENBQUM7SUFBQSxDQUN4QyxDQUFDO0lBRURoQix1REFBVyxDQUFDMkgsOEJBQThCLENBQUMzRyxNQUFNLENBQUM7SUFDbERoQix1REFBVyxDQUFDaUksY0FBYyxDQUFDLENBQUM7RUFDOUI7O0VBRUE7RUFDQTNGLFFBQVEsQ0FBQ2UsT0FBTyxDQUFDeEUsUUFBUSxFQUFFO0lBQUU2USxTQUFTLEVBQUUsSUFBSTtJQUFFQyxPQUFPLEVBQUU7RUFBSyxDQUFDLENBQUM7QUFDaEUsQ0FBQyxFQUFFLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL0FuaW1hdGlvbk1vZHVsZS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL0J1dHRvbk1vZHVsZS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL0V2ZW50QnVzLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvRXZlbnRNb2R1bGUuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9TdGF0ZU1hY2hpbmVTZXJ2aWNlLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvVHJhbnNjcmlwdGlvbk1vZHVsZS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL1VzZXJBZ2VudE1vZHVsZS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL3NheXBpU3RhdGVNYWNoaW5lLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvcmVjdGFuZ2xlcy5jc3MiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy90YWxrQnV0dG9uLmNzcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL21vYmlsZS5zY3NzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9BdWRpb01vZHVsZS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL2V4aXQuc3ZnIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvcmVjdGFuZ2xlcy5zdmciLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy93YXZlZm9ybS5zdmciLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9yZWN0YW5nbGVzLmNzcz8wMzYyIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9zcmMvdGFsa0J1dHRvbi5jc3M/MDdmNSIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vc3JjL21vYmlsZS5zY3NzP2YyM2UiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9BY3Rvci5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9NYWNoaW5lLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL1N0YXRlLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL1N0YXRlTm9kZS5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9fdmlydHVhbC9fdHNsaWIuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvYWN0aW9uVHlwZXMuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvYWN0aW9ucy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9iZWhhdmlvcnMuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvY29uc3RhbnRzLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL2RldlRvb2xzLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL2Vudmlyb25tZW50LmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL2ludGVycHJldGVyLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL2ludm9rZVV0aWxzLmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL3JlZ2lzdHJ5LmpzIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvLi9ub2RlX21vZHVsZXMveHN0YXRlL2VzL3NjaGVkdWxlci5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy9zZXJ2aWNlU2NvcGUuanMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL25vZGVfbW9kdWxlcy94c3RhdGUvZXMvc3RhdGVVdGlscy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy90eXBlcy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0Ly4vbm9kZV9tb2R1bGVzL3hzdGF0ZS9lcy91dGlscy5qcyIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL3NheXBpLXVzZXJzY3JpcHQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9zYXlwaS11c2Vyc2NyaXB0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vc2F5cGktdXNlcnNjcmlwdC8uL3NyYy9zYXlwaS5pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBBbmltYXRpb25Nb2R1bGUge1xuICBzdGF0aWMgcmVjdGFuZ2xlc1NlbGVjdG9yID1cbiAgICBcIi5vdXRlcm1vc3QsIC5zZWNvbmQsIC50aGlyZCwgLmZvdXJ0aCwgLmZpZnRoLCAuaW5uZXJtb3N0XCI7XG4gIHN0YXRpYyB0YWxrQnV0dG9uQW5pbWF0aW9ucyA9IFtcbiAgICBcImxvYWRpbmdcIixcbiAgICBcInBpU3BlYWtpbmdcIixcbiAgICBcInVzZXJTcGVha2luZ1wiLFxuICAgIFwidHJhbnNjcmliaW5nXCIsXG4gICAgXCJwYXVzZWRcIixcbiAgXTtcblxuICBzdGF0aWMgc3RhcnRBbmltYXRpb24oYW5pbWF0aW9uKSB7XG4gICAgdGhpcy5zdG9wT3RoZXJBbmltYXRpb25zKGFuaW1hdGlvbik7XG5cbiAgICBsZXQgcmVjdGFuZ2xlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5yZWN0YW5nbGVzU2VsZWN0b3IpO1xuICAgIHJlY3RhbmdsZXMuZm9yRWFjaCgocmVjdCkgPT4gcmVjdC5jbGFzc0xpc3QuYWRkKGFuaW1hdGlvbikpO1xuICB9XG5cbiAgc3RhdGljIHN0b3BBbmltYXRpb24oYW5pbWF0aW9uKSB7XG4gICAgbGV0IHJlY3RhbmdsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMucmVjdGFuZ2xlc1NlbGVjdG9yKTtcbiAgICByZWN0YW5nbGVzLmZvckVhY2goKHJlY3QpID0+IHJlY3QuY2xhc3NMaXN0LnJlbW92ZShhbmltYXRpb24pKTtcbiAgfVxuXG4gIHN0YXRpYyBzdG9wQWxsQW5pbWF0aW9ucygpIHtcbiAgICB0aGlzLnRhbGtCdXR0b25BbmltYXRpb25zLmZvckVhY2goKGFuaW1hdGlvbikgPT5cbiAgICAgIHRoaXMuc3RvcEFuaW1hdGlvbihhbmltYXRpb24pXG4gICAgKTtcbiAgfVxuXG4gIHN0YXRpYyBzdG9wT3RoZXJBbmltYXRpb25zKGtlZXBBbmltYXRpb24pIHtcbiAgICB0aGlzLnRhbGtCdXR0b25BbmltYXRpb25zLmZvckVhY2goKGFuaW1hdGlvbikgPT4ge1xuICAgICAgaWYgKGFuaW1hdGlvbiAhPT0ga2VlcEFuaW1hdGlvbikge1xuICAgICAgICB0aGlzLnN0b3BBbmltYXRpb24oYW5pbWF0aW9uKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgZXhpdE1vYmlsZU1vZGUsIGlzTW9iaWxlVmlldyB9IGZyb20gXCIuL1VzZXJBZ2VudE1vZHVsZVwiO1xuaW1wb3J0IEV2ZW50QnVzIGZyb20gXCIuL0V2ZW50QnVzXCI7XG5pbXBvcnQgRXZlbnRNb2R1bGUgZnJvbSBcIi4vRXZlbnRNb2R1bGUuanNcIjtcbmltcG9ydCBTdGF0ZU1hY2hpbmVTZXJ2aWNlIGZyb20gXCIuL1N0YXRlTWFjaGluZVNlcnZpY2UuanNcIjtcbmltcG9ydCBleGl0SWNvblNWRyBmcm9tIFwiLi9leGl0LnN2Z1wiO1xuaW1wb3J0IHJlY3RhbmdsZXNTVkcgZnJvbSBcIi4vcmVjdGFuZ2xlcy5zdmdcIjtcbmltcG9ydCB0YWxrSWNvblNWRyBmcm9tIFwiLi93YXZlZm9ybS5zdmdcIjtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1dHRvbk1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucGxheUJ1dHRvbiA9IG51bGw7XG4gICAgdGhpcy5hY3RvciA9IFN0YXRlTWFjaGluZVNlcnZpY2UuYWN0b3I7XG4gICAgLy8gQmluZGluZyBtZXRob2RzIHRvIHRoZSBjdXJyZW50IGluc3RhbmNlXG4gICAgdGhpcy5oYW5kbGVQbGF5QnV0dG9uQ2xpY2sgPSB0aGlzLmhhbmRsZVBsYXlCdXR0b25DbGljay5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVnaXN0ZXJPdGhlckV2ZW50cygpO1xuICB9XG5cbiAgcmVnaXN0ZXJPdGhlckV2ZW50cygpIHtcbiAgICBFdmVudEJ1cy5vbihcInNheXBpOmF1dG9TdWJtaXRcIiwgQnV0dG9uTW9kdWxlLmhhbmRsZUF1dG9TdWJtaXQpO1xuICB9XG5cbiAgLy8gRnVuY3Rpb24gdG8gY3JlYXRlIGEgbmV3IGJ1dHRvblxuICBjcmVhdGVCdXR0b24obGFiZWwsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICBidXR0b24udGV4dENvbnRlbnQgPSBsYWJlbDtcbiAgICBidXR0b24ub25jbGljayA9IGNhbGxiYWNrO1xuICAgIHJldHVybiBidXR0b247XG4gIH1cblxuICAvLyBGdW5jdGlvbiB0byBzdHlsZSBhIGdpdmVuIGJ1dHRvblxuICBzdHlsZUJ1dHRvbihidXR0b24sIHN0eWxlcykge1xuICAgIGZvciAobGV0IGtleSBpbiBzdHlsZXMpIHtcbiAgICAgIGlmIChzdHlsZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBidXR0b24uc3R5bGVba2V5XSA9IHN0eWxlc1trZXldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFkZFRhbGtJY29uKGJ1dHRvbikge1xuICAgIHRoaXMudXBkYXRlSWNvbkNvbnRlbnQoYnV0dG9uKTtcblxuICAgIHdpbmRvdy5tYXRjaE1lZGlhKFwiKG1heC13aWR0aDogNzY4cHgpXCIpLmFkZExpc3RlbmVyKCgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlSWNvbkNvbnRlbnQoYnV0dG9uKTtcbiAgICB9KTtcbiAgICB0aGlzLnNldHVwQ2xhc3NPYnNlcnZlcihidXR0b24pO1xuICB9XG5cbiAgdXBkYXRlSWNvbkNvbnRlbnQoaWNvbkNvbnRhaW5lcikge1xuICAgIGlmIChpc01vYmlsZVZpZXcoKSkge1xuICAgICAgaWNvbkNvbnRhaW5lci5pbm5lckhUTUwgPSByZWN0YW5nbGVzU1ZHO1xuICAgIH0gZWxzZSB7XG4gICAgICBpY29uQ29udGFpbmVyLmlubmVySFRNTCA9IHRhbGtJY29uU1ZHO1xuICAgIH1cbiAgfVxuXG4gIHNldHVwQ2xhc3NPYnNlcnZlcihidXR0b24pIHtcbiAgICBjb25zdCB0YXJnZXROb2RlID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50OyAvLyBUaGUgPGh0bWw+IGVsZW1lbnRcblxuICAgIGNvbnN0IGNvbmZpZyA9IHsgYXR0cmlidXRlczogdHJ1ZSwgYXR0cmlidXRlRmlsdGVyOiBbXCJjbGFzc1wiXSB9O1xuXG4gICAgY29uc3QgY2FsbGJhY2sgPSAobXV0YXRpb25zTGlzdCwgb2JzZXJ2ZXIpID0+IHtcbiAgICAgIGZvciAobGV0IG11dGF0aW9uIG9mIG11dGF0aW9uc0xpc3QpIHtcbiAgICAgICAgaWYgKG11dGF0aW9uLnR5cGUgPT09IFwiYXR0cmlidXRlc1wiKSB7XG4gICAgICAgICAgaWYgKG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUgPT09IFwiY2xhc3NcIikge1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJtb2JpbGUtdmlld1wiKSkge1xuICAgICAgICAgICAgICAvLyAnbW9iaWxlLXZpZXcnIGNsYXNzIHdhcyBhZGRlZFxuICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUljb25Db250ZW50KGJ1dHRvbik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyAnbW9iaWxlLXZpZXcnIGNsYXNzIHdhcyByZW1vdmVkXG4gICAgICAgICAgICAgIHRoaXMudXBkYXRlSWNvbkNvbnRlbnQoYnV0dG9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihjYWxsYmFjayk7XG5cbiAgICAvLyBTdGFydCBvYnNlcnZpbmcgdGhlIHRhcmdldCBub2RlIGZvciBjb25maWd1cmVkIG11dGF0aW9uc1xuICAgIG9ic2VydmVyLm9ic2VydmUodGFyZ2V0Tm9kZSwgY29uZmlnKTtcblxuICAgIC8vIExhdGVyLCB5b3UgY2FuIHN0b3Agb2JzZXJ2aW5nIGJ5IGNhbGxpbmc6XG4gICAgLy8gb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICB9XG5cbiAgLy8gU2ltdWxhdGUgYW4gXCJFbnRlclwiIGtleXByZXNzIGV2ZW50IG9uIGEgZm9ybVxuICBzdGF0aWMgc2ltdWxhdGVGb3JtU3VibWl0KCkge1xuICAgIGNvbnN0IHRleHRhcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS1wcm9tcHRcIik7XG5cbiAgICBjb25zdCBlbnRlckV2ZW50ID0gbmV3IEtleWJvYXJkRXZlbnQoXCJrZXlkb3duXCIsIHtcbiAgICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgICBrZXk6IFwiRW50ZXJcIixcbiAgICAgIGtleUNvZGU6IDEzLFxuICAgICAgd2hpY2g6IDEzLFxuICAgIH0pO1xuXG4gICAgdGV4dGFyZWEuZGlzcGF0Y2hFdmVudChlbnRlckV2ZW50KTtcbiAgfVxuXG4gIC8vIEZ1bmN0aW9uIHRvIGhhbmRsZSBhdXRvLXN1Ym1pdCBiYXNlZCBvbiB0aGUgYnV0dG9uJ3MgZGF0YSBhdHRyaWJ1dGVcbiAgc3RhdGljIGhhbmRsZUF1dG9TdWJtaXQoKSB7XG4gICAgY29uc3QgdGFsa0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F5cGktdGFsa0J1dHRvblwiKTtcblxuICAgIGlmICh0YWxrQnV0dG9uLmRhdGFzZXQuYXV0b3N1Ym1pdCA9PT0gXCJmYWxzZVwiKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkF1dG9zdWJtaXQgaXMgZGlzYWJsZWRcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIEJ1dHRvbk1vZHVsZS5zaW11bGF0ZUZvcm1TdWJtaXQoKTtcbiAgICB9XG4gIH1cblxuICBjcmVhdGVFeGl0QnV0dG9uKCkge1xuICAgIGNvbnN0IGxhYmVsID0gXCJFeGl0IFZvaWNlLUNvbnRyb2xsZWQgTW9iaWxlIE1vZGVcIjtcbiAgICBjb25zdCBidXR0b24gPSB0aGlzLmNyZWF0ZUJ1dHRvbihcIlwiLCAoKSA9PiB7XG4gICAgICBleGl0TW9iaWxlTW9kZSgpO1xuICAgIH0pO1xuICAgIGJ1dHRvbi5pZCA9IFwic2F5cGktZXhpdEJ1dHRvblwiO1xuICAgIGJ1dHRvbi50eXBlID0gXCJidXR0b25cIjtcbiAgICBidXR0b24uY2xhc3NOYW1lID1cbiAgICAgIFwiZXhpdC1idXR0b24gZml4ZWQgcm91bmRlZC1mdWxsIGJnLWNyZWFtLTU1MCBlbmFibGVkOmhvdmVyOmJnLWNyZWFtLTY1MFwiO1xuICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIGxhYmVsKTtcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKFwidGl0bGVcIiwgbGFiZWwpO1xuICAgIGJ1dHRvbi5pbm5lckhUTUwgPSBleGl0SWNvblNWRztcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGJ1dHRvbik7XG4gICAgcmV0dXJuIGJ1dHRvbjtcbiAgfVxuXG4gIGNyZWF0ZVBsYXlCdXR0b24oKSB7XG4gICAgY29uc3QgbGFiZWwgPSBcIkhlYXIgUGkncyByZXNwb25zZVwiO1xuICAgIHRoaXMucGxheUJ1dHRvbiA9IHRoaXMuY3JlYXRlQnV0dG9uKFwiXCIsICgpID0+IHt9KTtcbiAgICB0aGlzLnBsYXlCdXR0b24uaWQgPSBcInNheXBpLXBsYXlCdXR0b25cIjtcbiAgICB0aGlzLnBsYXlCdXR0b24udHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgdGhpcy5wbGF5QnV0dG9uLmNsYXNzTmFtZSA9IFwiaGlkZGVuIHBsYXktYnV0dG9uXCI7XG4gICAgdGhpcy5wbGF5QnV0dG9uLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgbGFiZWwpO1xuICAgIHRoaXMucGxheUJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiLCBsYWJlbCk7XG4gICAgdGhpcy5wbGF5QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLmhhbmRsZVBsYXlCdXR0b25DbGljayk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnBsYXlCdXR0b24pO1xuICAgIHJldHVybiB0aGlzLnBsYXlCdXR0b247XG4gIH1cblxuICBzaG93UGxheUJ1dHRvbigpIHtcbiAgICBpZiAoIXRoaXMucGxheUJ1dHRvbikge1xuICAgICAgdGhpcy5jcmVhdGVQbGF5QnV0dG9uKCk7XG4gICAgfVxuICAgIHRoaXMucGxheUJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICB9XG5cbiAgaGlkZVBsYXlCdXR0b24oKSB7XG4gICAgaWYgKHRoaXMucGxheUJ1dHRvbikge1xuICAgICAgdGhpcy5wbGF5QnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlUGxheUJ1dHRvbkNsaWNrKCkge1xuICAgIHRoaXMuYWN0b3Iuc2VuZChcInNheXBpOnBsYXlcIik7XG4gICAgRXZlbnRCdXMuZW1pdChcImF1ZGlvOnJlbG9hZFwiKTtcbiAgfVxufVxuXG4vLyBTaW5nbGV0b25cbmV4cG9ydCBjb25zdCBidXR0b25Nb2R1bGUgPSBuZXcgQnV0dG9uTW9kdWxlKCk7XG4iLCJpbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gXCJldmVudHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgbmV3IEV2ZW50RW1pdHRlcigpO1xuIiwiaW1wb3J0IEV2ZW50QnVzIGZyb20gXCIuL0V2ZW50QnVzLmpzXCI7XG5pbXBvcnQgU3RhdGVNYWNoaW5lU2VydmljZSBmcm9tIFwiLi9TdGF0ZU1hY2hpbmVTZXJ2aWNlLmpzXCI7XG5cbmNvbnN0IFVTRVJfU1BFQUtJTkcgPSBcInNheXBpOnVzZXJTcGVha2luZ1wiO1xuY29uc3QgVVNFUl9TVE9QUEVEX1NQRUFLSU5HID0gXCJzYXlwaTp1c2VyU3RvcHBlZFNwZWFraW5nXCI7XG5jb25zdCBVU0VSX0ZJTklTSEVEX1NQRUFLSU5HID0gXCJzYXlwaTp1c2VyRmluaXNoZWRTcGVha2luZ1wiO1xuY29uc3QgVFJBTlNDUklCSU5HID0gXCJzYXlwaTp0cmFuc2NyaWJpbmdcIjtcbmNvbnN0IFBJX1NQRUFLSU5HID0gXCJzYXlwaTpwaVNwZWFraW5nXCI7XG5jb25zdCBQSV9TVE9QUEVEX1NQRUFLSU5HID0gXCJzYXlwaTpwaVN0b3BwZWRTcGVha2luZ1wiO1xuY29uc3QgUElfRklOSVNIRURfU1BFQUtJTkcgPSBcInNheXBpOnBpRmluaXNoZWRTcGVha2luZ1wiO1xuY29uc3QgUEFVU0UgPSBcInNheXBpOnBhdXNlXCI7XG5jb25zdCBSRUFEWSA9IFwic2F5cGk6cmVhZHlcIjtcbmNvbnN0IFBMQVkgPSBcInNheXBpOnBsYXlcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRNb2R1bGUge1xuICBzdGF0aWMgaW5pdCgpIHtcbiAgICAvLyBBbGwgdGhlIGV2ZW50IGxpc3RlbmVycyBjYW4gYmUgYWRkZWQgaGVyZVxuICAgIHRoaXMucmVnaXN0ZXJTdGF0ZU1hY2hpbmVFdmVudHMoU3RhdGVNYWNoaW5lU2VydmljZS5hY3Rvcik7XG4gICAgLy8gQW55IG90aGVyIGluaXRpYWxpemF0aW9ucy4uLlxuICB9XG5cbiAgc3RhdGljIGNsZWFudXAoKSB7XG4gICAgLy8gUmVtb3ZlIGV2ZW50IGxpc3RlbmVycyBpZiBuZWVkZWQsIG9yIGFueSBvdGhlciBjbGVhbnVwIG9wZXJhdGlvbnNcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwic2F5cGk6dHJhbnNjcmliZWRcIixcbiAgICAgIHRoaXMuaGFuZGxlVHJhbnNjcmlwdGlvblJlc3BvbnNlXG4gICAgKTtcbiAgfVxuXG4gIHN0YXRpYyBzaW11bGF0ZVR5cGluZyhlbGVtZW50LCB0ZXh0KSB7XG4gICAgY29uc3Qgd29yZHMgPSB0ZXh0LnNwbGl0KFwiIFwiKTtcbiAgICBsZXQgaSA9IDA7XG5cbiAgICBjb25zdCB0eXBlV29yZCA9ICgpID0+IHtcbiAgICAgIGlmIChpIDwgd29yZHMubGVuZ3RoKSB7XG4gICAgICAgIEV2ZW50TW9kdWxlLnNldE5hdGl2ZVZhbHVlKGVsZW1lbnQsIGVsZW1lbnQudmFsdWUgKyB3b3Jkc1tpKytdICsgXCIgXCIpO1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodHlwZVdvcmQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRXZlbnRCdXMuZW1pdChcInNheXBpOmF1dG9TdWJtaXRcIik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHR5cGVXb3JkKCk7XG4gIH1cblxuICBzdGF0aWMgc2V0TmF0aXZlVmFsdWUoZWxlbWVudCwgdmFsdWUpIHtcbiAgICBsZXQgbGFzdFZhbHVlID0gZWxlbWVudC52YWx1ZTtcbiAgICBlbGVtZW50LnZhbHVlID0gdmFsdWU7XG4gICAgbGV0IGV2ZW50ID0gbmV3IEV2ZW50KFwiaW5wdXRcIiwgeyB0YXJnZXQ6IGVsZW1lbnQsIGJ1YmJsZXM6IHRydWUgfSk7XG4gICAgLy8gUmVhY3QgMTVcbiAgICBldmVudC5zaW11bGF0ZWQgPSB0cnVlO1xuICAgIC8vIFJlYWN0IDE2LTE3XG4gICAgbGV0IHRyYWNrZXIgPSBlbGVtZW50Ll92YWx1ZVRyYWNrZXI7XG4gICAgaWYgKHRyYWNrZXIpIHtcbiAgICAgIHRyYWNrZXIuc2V0VmFsdWUobGFzdFZhbHVlKTtcbiAgICB9XG4gICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgfVxuXG4gIHN0YXRpYyBoYW5kbGVUYWxrTW91c2VEb3duKCkge1xuICAgIEV2ZW50QnVzLmVtaXQoXCJhdWRpbzpzdGFydFJlY29yZGluZ1wiKTtcbiAgfVxuXG4gIHN0YXRpYyBoYW5kbGVUYWxrTW91c2VVcCgpIHtcbiAgICBFdmVudEJ1cy5lbWl0KFwiYXVkaW86c3RvcFJlY29yZGluZ1wiKTtcbiAgfVxuXG4gIHN0YXRpYyBoYW5kbGVUYWxrRG91YmxlQ2xpY2soYnV0dG9uKSB7XG4gICAgLy8gVG9nZ2xlIHRoZSBDU1MgY2xhc3NlcyB0byBpbmRpY2F0ZSB0aGUgbW9kZVxuICAgIGJ1dHRvbi5jbGFzc0xpc3QudG9nZ2xlKFwiYXV0b1N1Ym1pdFwiKTtcbiAgICBpZiAoYnV0dG9uLmdldEF0dHJpYnV0ZShcImRhdGEtYXV0b3N1Ym1pdFwiKSA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJkYXRhLWF1dG9zdWJtaXRcIiwgXCJmYWxzZVwiKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiYXV0b3N1Ym1pdCBkaXNhYmxlZFwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZShcImRhdGEtYXV0b3N1Ym1pdFwiLCBcInRydWVcIik7XG4gICAgICBjb25zb2xlLmxvZyhcImF1dG9zdWJtaXQgZW5hYmxlZFwiKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgaGFuZGxlVGFsa1RvdWNoU3RhcnQoYnV0dG9uLCBlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIEV2ZW50QnVzLmVtaXQoXCJhdWRpbzpzdGFydFJlY29yZGluZ1wiKTtcbiAgfVxuXG4gIHN0YXRpYyBoYW5kbGVUYWxrVG91Y2hFbmQoYnV0dG9uKSB7XG4gICAgRXZlbnRCdXMuZW1pdChcImF1ZGlvOnN0b3BSZWNvcmRpbmdcIik7XG4gIH1cblxuICBzdGF0aWMgcmVnaXN0ZXJPdGhlckF1ZGlvQnV0dG9uRXZlbnRzKGJ1dHRvbikge1xuICAgIC8vIFwid2FybSB1cFwiIHRoZSBtaWNyb3Bob25lIGJ5IGFjcXVpcmluZyBpdCBiZWZvcmUgdGhlIHVzZXIgcHJlc3NlcyB0aGUgYnV0dG9uXG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWVudGVyXCIsICgpID0+IHtcbiAgICAgIEV2ZW50QnVzLmVtaXQoXCJhdWRpbzpzZXR1cFJlY29yZGluZ1wiKTtcbiAgICB9KTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgKCkgPT4ge1xuICAgICAgRXZlbnRCdXMuZW1pdChcImF1ZGlvOnRlYXJEb3duUmVjb3JkaW5nXCIpO1xuICAgIH0pO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiYmVmb3JldW5sb2FkXCIsICgpID0+IHtcbiAgICAgIEV2ZW50QnVzLmVtaXQoXCJhdWRpbzp0ZWFyRG93blJlY29yZGluZ1wiKTtcbiAgICB9KTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoY2FuY2VsXCIsICgpID0+IHtcbiAgICAgIEV2ZW50QnVzLmVtaXQoXCJhdWRpbzp0ZWFyRG93blJlY29yZGluZ1wiKTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyByZWdpc3RlclN0YXRlTWFjaGluZUV2ZW50cyhhY3Rvcikge1xuICAgIEV2ZW50QnVzLm9uKFVTRVJfU1BFQUtJTkcsICgpID0+IHtcbiAgICAgIGFjdG9yLnNlbmQoVVNFUl9TUEVBS0lORyk7XG4gICAgfSk7XG5cbiAgICBbVVNFUl9TVE9QUEVEX1NQRUFLSU5HLCBVU0VSX0ZJTklTSEVEX1NQRUFLSU5HXS5mb3JFYWNoKChldmVudE5hbWUpID0+IHtcbiAgICAgIEV2ZW50QnVzLm9uKGV2ZW50TmFtZSwgKGRldGFpbCkgPT4ge1xuICAgICAgICBpZiAoZGV0YWlsKSB7XG4gICAgICAgICAgYWN0b3Iuc2VuZCh7IHR5cGU6IGV2ZW50TmFtZSwgLi4uZGV0YWlsIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUud2FybihgUmVjZWl2ZWQgJHtldmVudE5hbWV9IHdpdGhvdXQgZGV0YWlscy5gKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBFdmVudEJ1cy5vbihUUkFOU0NSSUJJTkcsICgpID0+IHtcbiAgICAgIGFjdG9yLnNlbmQoVFJBTlNDUklCSU5HKTtcbiAgICB9KTtcblxuICAgIFtQSV9TUEVBS0lORywgUElfU1RPUFBFRF9TUEVBS0lORywgUElfRklOSVNIRURfU1BFQUtJTkddLmZvckVhY2goXG4gICAgICAoZXZlbnROYW1lKSA9PiB7XG4gICAgICAgIEV2ZW50QnVzLm9uKGV2ZW50TmFtZSwgKCkgPT4ge1xuICAgICAgICAgIGFjdG9yLnNlbmQoZXZlbnROYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgKTtcblxuICAgIFtQQVVTRSwgUkVBRFksIFBMQVldLmZvckVhY2goKGV2ZW50TmFtZSkgPT4ge1xuICAgICAgRXZlbnRCdXMub24oZXZlbnROYW1lLCAoKSA9PiB7XG4gICAgICAgIGFjdG9yLnNlbmQoZXZlbnROYW1lKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyogZXZlbnRzIHRvIGRpcmVjdCB0aGUgYXVkaW8gbW9kdWxlIHRvIHN0YXJ0L3N0b3AgcmVjb3JkaW5nICovXG5cbiAgc3RhdGljIHJlZ2lzdGVySG90a2V5KCkge1xuICAgIGxldCBjdHJsRG93biA9IGZhbHNlO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQuY3RybEtleSAmJiBldmVudC5jb2RlID09PSBcIlNwYWNlXCIgJiYgIWN0cmxEb3duKSB7XG4gICAgICAgIGN0cmxEb3duID0gdHJ1ZTtcbiAgICAgICAgRXZlbnRCdXMuZW1pdChcImF1ZGlvOnN0YXJ0UmVjb3JkaW5nXCIpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIChldmVudCkgPT4ge1xuICAgICAgaWYgKGN0cmxEb3duICYmIGV2ZW50LmNvZGUgPT09IFwiU3BhY2VcIikge1xuICAgICAgICBjdHJsRG93biA9IGZhbHNlO1xuICAgICAgICBFdmVudEJ1cy5lbWl0KFwiYXVkaW86c3RvcFJlY29yZGluZ1wiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgaW50ZXJwcmV0IH0gZnJvbSBcInhzdGF0ZVwiO1xuaW1wb3J0IHsgbWFjaGluZSB9IGZyb20gXCIuL3NheXBpU3RhdGVNYWNoaW5lXCI7XG5cbi8qKlxuICogQSBzaW5nbGV0b24gc2VydmljZSB0aGF0IG1hbmFnZXMgdGhlIHN0YXRlIG1hY2hpbmUuXG4gKi9cbmNsYXNzIFN0YXRlTWFjaGluZVNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmFjdG9yID0gaW50ZXJwcmV0KG1hY2hpbmUpLm9uVHJhbnNpdGlvbigoc3RhdGUpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGBUcmFuc2l0aW9uZWQgdG8gc3RhdGU6ICR7c3RhdGUudmFsdWV9YCk7XG4gICAgfSk7XG4gICAgdGhpcy5hY3Rvci5zdGFydCgpO1xuICB9XG59XG5cbi8vIFNpbmdsZXRvblxuZXhwb3J0IGRlZmF1bHQgbmV3IFN0YXRlTWFjaGluZVNlcnZpY2UoKTtcbiIsImltcG9ydCBTdGF0ZU1hY2hpbmVTZXJ2aWNlIGZyb20gXCIuL1N0YXRlTWFjaGluZVNlcnZpY2UuanNcIjtcbmltcG9ydCB7IGlzTW9iaWxlVmlldyB9IGZyb20gXCIuL1VzZXJBZ2VudE1vZHVsZS5qc1wiO1xuaW1wb3J0IEV2ZW50QnVzIGZyb20gXCIuL0V2ZW50QnVzLmpzXCI7XG5pbXBvcnQgRXZlbnRNb2R1bGUgZnJvbSBcIi4vRXZlbnRNb2R1bGUuanNcIjtcblxuY29uc3QgY29uZmlnID0ge1xuICBhcHBTZXJ2ZXJVcmw6IHByb2Nlc3MuZW52LkFQUF9TRVJWRVJfVVJMLFxuICBhcGlTZXJ2ZXJVcmw6IHByb2Nlc3MuZW52LkFQSV9TRVJWRVJfVVJMLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHVwbG9hZEF1ZGlvKGF1ZGlvQmxvYikge1xuICAvLyBDcmVhdGUgYSBGb3JtRGF0YSBvYmplY3RcbiAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gIHZhciBhdWRpb0ZpbGVuYW1lID0gXCJhdWRpby53ZWJtXCI7XG4gIGlmIChhdWRpb0Jsb2IudHlwZSA9PT0gXCJhdWRpby9tcDRcIikge1xuICAgIGF1ZGlvRmlsZW5hbWUgPSBcImF1ZGlvLm1wNFwiO1xuICB9XG4gIC8vIEFkZCB0aGUgYXVkaW8gYmxvYiB0byB0aGUgRm9ybURhdGEgb2JqZWN0XG4gIGZvcm1EYXRhLmFwcGVuZChcImF1ZGlvXCIsIGF1ZGlvQmxvYiwgYXVkaW9GaWxlbmFtZSk7XG4gIC8vIEdldCB0aGUgdXNlcidzIHByZWZlcnJlZCBsYW5ndWFnZVxuICB2YXIgbGFuZ3VhZ2UgPSBuYXZpZ2F0b3IubGFuZ3VhZ2U7XG4gIC8vIFBvc3QgdGhlIGF1ZGlvIHRvIHRoZSBzZXJ2ZXIgZm9yIHRyYW5zY3JpcHRpb25cbiAgZmV0Y2goY29uZmlnLmFwaVNlcnZlclVybCArIFwiL3RyYW5zY3JpYmU/bGFuZ3VhZ2U9XCIgKyBsYW5ndWFnZSwge1xuICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgYm9keTogZm9ybURhdGEsXG4gIH0pXG4gICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgIHRocm93IEVycm9yKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICB9KVxuICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZUpzb24pIHtcbiAgICAgIFN0YXRlTWFjaGluZVNlcnZpY2UuYWN0b3Iuc2VuZChcInNheXBpOnRyYW5zY3JpYmVkXCIsIHtcbiAgICAgICAgdGV4dDogcmVzcG9uc2VKc29uLnRleHQsXG4gICAgICB9KTtcbiAgICB9KVxuICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJMb29rcyBsaWtlIHRoZXJlIHdhcyBhIHByb2JsZW06IFwiLCBlcnJvcik7XG4gICAgICBTdGF0ZU1hY2hpbmVTZXJ2aWNlLmFjdG9yLnNlbmQoXCJzYXlwaTp0cmFuc2NyaWJlRmFpbGVkXCIpO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlVHJhbnNjcmlwdGlvblJlc3BvbnNlKHRyYW5zY3JpcHQpIHtcbiAgY29uc29sZS5sb2coXCJUcmFuc2NyaXB0OiBcIiArIHRyYW5zY3JpcHQpO1xuICBjb25zdCB0ZXh0YXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2F5cGktcHJvbXB0XCIpO1xuICBpZiAoaXNNb2JpbGVWaWV3KCkpIHtcbiAgICAvLyBpZiB0cmFuc2NyaXB0IGlzID4gMTAwMCBjaGFyYWN0ZXJzLCB0cnVuY2F0ZSBpdCB0byA5OTkgY2hhcmFjdGVycyBwbHVzIGFuIGVsbGlwc2lzXG4gICAgaWYgKHRyYW5zY3JpcHQubGVuZ3RoID4gMTAwMCkge1xuICAgICAgdHJhbnNjcmlwdCA9IHRyYW5zY3JpcHQuc3Vic3RyaW5nKDAsIDk5OSkgKyBcIuKAplwiO1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICBcIlRyYW5zY3JpcHQgd2FzIHRvbyBsb25nIGZvciBQaS4gVHJ1bmNhdGVkIHRvIDk5OSBjaGFyYWN0ZXJzLCBsb3NpbmcgdGhlIGZvbGxvd2luZyB0ZXh0OiAuLi4gXCIgK1xuICAgICAgICAgIHRyYW5zY3JpcHQuc3Vic3RyaW5nKDk5OSlcbiAgICAgICk7XG4gICAgfVxuICAgIEV2ZW50TW9kdWxlLnNldE5hdGl2ZVZhbHVlKHRleHRhcmVhLCB0cmFuc2NyaXB0KTtcbiAgICBFdmVudEJ1cy5lbWl0KFwic2F5cGk6YXV0b1N1Ym1pdFwiKTtcbiAgfSBlbHNlIHtcbiAgICBFdmVudE1vZHVsZS5zaW11bGF0ZVR5cGluZyh0ZXh0YXJlYSwgdHJhbnNjcmlwdCArIFwiIFwiKTtcbiAgfVxufVxuIiwibGV0IHVzZXJQcmVmZXJlbmNlOyAvLyB0cmFuc2llbnQgdmFyaWFibGUgdG8gc3RvcmUgdXNlciBwcmVmZXJlbmNlIHVudGlsIHJlZnJlc2hcblxuZXhwb3J0IGZ1bmN0aW9uIGlzTW9iaWxlVmlldygpIHtcbiAgaWYgKHVzZXJQcmVmZXJlbmNlKSB7XG4gICAgcmV0dXJuIHVzZXJQcmVmZXJlbmNlID09PSBcIm1vYmlsZVwiO1xuICB9XG5cbiAgcmV0dXJuIHdpbmRvdy5tYXRjaE1lZGlhKFwiKG1heC13aWR0aDogNzY4cHgpXCIpLm1hdGNoZXM7XG59XG5cbi8vIFRPRE86IGRlZHVwZSB0aGlzIGZ1bmN0aW9uIGZyb20gdHJhbnNjcmliZXIuanNcbmV4cG9ydCBmdW5jdGlvbiBpc1NhZmFyaSgpIHtcbiAgcmV0dXJuIC9eKCg/IWNocm9tZXxhbmRyb2lkKS4pKnNhZmFyaS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG59XG5leHBvcnQgZnVuY3Rpb24gZXhpdE1vYmlsZU1vZGUoKSB7XG4gIHVzZXJQcmVmZXJlbmNlID0gXCJkZXNrdG9wXCI7IC8vIG9yICdtb2JpbGUnXG5cbiAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwibW9iaWxlLXZpZXdcIik7XG59XG5leHBvcnQgZnVuY3Rpb24gYWRkVXNlckFnZW50RmxhZ3MoKSB7XG4gIHZhciBpc0ZpcmVmb3hBbmRyb2lkID1cbiAgICAvRmlyZWZveC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSAmJiAvQW5kcm9pZC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgaWYgKGlzRmlyZWZveEFuZHJvaWQpIHtcbiAgICAvLyBoYWNrIGZvciBGaXJlZm94IG9uIEFuZHJvaWQsIHdoaWNoIGRvZXNuJ3Qgc3VwcG9ydCA6YWN0aXZlIGNvcnJlY3RseVxuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImZpcmVmb3gtYW5kcm9pZFwiKTtcbiAgfVxuXG4gIGlmIChpc01vYmlsZVZpZXcoKSkge1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcIm1vYmlsZS12aWV3XCIpO1xuICB9IGVsc2Uge1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcIm1vYmlsZS12aWV3XCIpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBidXR0b25Nb2R1bGUgfSBmcm9tIFwiLi9CdXR0b25Nb2R1bGVcIjtcbmltcG9ydCB7IGNyZWF0ZU1hY2hpbmUgfSBmcm9tIFwieHN0YXRlXCI7XG5pbXBvcnQgQW5pbWF0aW9uTW9kdWxlIGZyb20gXCIuL0FuaW1hdGlvbk1vZHVsZVwiO1xuaW1wb3J0IHsgaXNTYWZhcmksIGlzTW9iaWxlVmlldyB9IGZyb20gXCIuL1VzZXJBZ2VudE1vZHVsZVwiO1xuaW1wb3J0IHtcbiAgdXBsb2FkQXVkaW8sXG4gIGhhbmRsZVRyYW5zY3JpcHRpb25SZXNwb25zZSxcbn0gZnJvbSBcIi4vVHJhbnNjcmlwdGlvbk1vZHVsZVwiO1xuaW1wb3J0IEV2ZW50QnVzIGZyb20gXCIuL0V2ZW50QnVzXCI7XG5cbmV4cG9ydCBjb25zdCBtYWNoaW5lID0gY3JlYXRlTWFjaGluZShcbiAge1xuICAgIC8qKiBAeHN0YXRlLWxheW91dCBONElncGdKZzVtRE9JQzVTd0lZRThBS0JMQWRGaUFObUFNU3BvQU9XQ0FyckdBRTRESzVZS0ExbGdIWlFEYUFEQUYxRW9jZ0h0WVdBQzVaUm5ZU0FBZWlBTXdCMlBqbVVCT1BnRFlBakxxMzc5eTNRQm9RYVJQcjVhdE9YYXEyNkFMS29CTXktUUE1VEFYMzlMTW13OFFoSXlTZ1J5RkZvd2ZpRWtFREVKYVZsNUpRUTFEVzA5UTJOVEN5dEVWU01jVW84dEgzY2ZWV1ZYTTBEZzlGRDhJbEowS01wbVZnNXVCUGtVcVJrNUpNenN6UjBESXhNelMyc0VWeDhQSEhkZEFGWlNyV1ZOM1YwK2RhYVFFTnc0cGhaMkxpZ09paW96Z0RFdUxGZ0FDMGdleS03QlFmRmg5TEhFSlV0SzRjT3MrS282cHMrSHAxc3A1b2hZYnBRUjROcVY2ajR0T3NQRWNUamd6aDgrdGRJbmM2RXhKS0p5Q3dJQVNyZ01ra00wcU5RSmtQSHdNVGhsbnd6TW83QmoxajQ0Y1VFQjVYQm90S1Yxdnl3WHM5cjRjUzFUcVNhZHdibEZKUFFVSnhZQUJqZWhZQUJHdE8rOU4rakl5Z1BzSUxCRUoyNmhoZ29XcmcyT0Q0S0t4VlM1RU1sOHN3dUJpY1FncXFvNUFJNkRwSWxOSTNOQ0ZzT2swRFM5dWdGck84OElRRUpCNm04cm84cWxjSGl4cmg5b1c2RjBKUWVpV0VZNU1wN3pMUnNTRWRTVVlCTWZ6U05jV2c4SXQwQloyNnhjYWZGUGh3WFpjVGg4U1o4bTMweGI5VmZyS3VKTkNWaTk0eHFiZnlaaWtCYkljbk81dk14QXJUblpIdWRSbFF6S09VYzV3cGQ2VndybEVlbkdlYjJwYS1EeVVqLTJaTm5iVUZ2R1VieGdTNVRZdERUTXg5SEtOMU5naFBScW1uTzkxVTFIVTlVTkpkT2lvVkN0VjFBMUlHLUJrVzMtTEplUndmUjFsN0hRUU83VEUwejhVRm9XaGRSZkFGZlJjenZBaFJCUUNBbjJYQjlQblhSc2YyYlA4ZHpiRkZWaTdIcyswbFFjaFdjVlJIR2NOd3FQQmZRZEI4TzktVG9RTmwzb1ZnSURRSWpmMjNUSTlqRkpNS24yZllCUjhOTjltVUhCdXcyS2pLbHFidFp5T1RoUkFnT0I1Qk9INHhQTXhBQUZvaWdXQ0tYV1kySzR2Qk84MmpBWUt0MmpmTTB3NDlaTkhXU2ozTzdQeE5LTElKamdWUEZWMGZiZ1VyTlZzQzFkSmlFT1dmbGNsVVU5VEJjaVY4Mjdma0RsdllyY1YweUFxcElpU0J4SGVvMUh6ZlFhaW9oekZMTUNqVk9XYnhjeDVRNCt0S3dUQ1NHOFRNa01hcHlqQk5sUEZSVHRUeWRaRkwxTVZrLUJRalU4SXdxNXR0Q3JKOHl5aml6MHFCbzlpbzA4Nm9oTnpWQjhhZDFsY0FjdUo0dmpLcE5FTG8weXNhcWlXWUVNM3FOTTh5eXNjM0RXWHhRYld3SWdBICovXG4gICAgaWQ6IFwic2F5UGlcIixcbiAgICBpbml0aWFsOiBcImlkbGVcIixcbiAgICBzdGF0ZXM6IHtcbiAgICAgIGlkbGU6IHtcbiAgICAgICAgZGVzY3JpcHRpb246IFwiSW5pdGlhbCBzdGF0ZS5cXG5HZW50bGUgcHVsc2luZyBhbmltYXRpb24uXCIsXG4gICAgICAgIGVudHJ5OiBbXCJzdG9wQWxsQW5pbWF0aW9uc1wiLCBcImFjcXVpcmVNaWNyb3Bob25lXCJdLFxuICAgICAgICBvbjoge1xuICAgICAgICAgIFwic2F5cGk6dXNlclNwZWFraW5nXCI6IHtcbiAgICAgICAgICAgIHRhcmdldDogXCJ1c2VyU3BlYWtpbmdcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2F5cGk6cGF1c2VcIjoge1xuICAgICAgICAgICAgdGFyZ2V0OiBcInBhdXNlZFwiLFxuICAgICAgICAgICAgY29uZDogXCJpc1NhZmFyaVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzYXlwaTpwaVNwZWFraW5nXCI6IHtcbiAgICAgICAgICAgIHRhcmdldDogXCJwaVNwZWFraW5nXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB1c2VyU3BlYWtpbmc6IHtcbiAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgXCJVc2VyIGlzIHNwZWFraW5nIGFuZCBiZWluZyByZWNvcmRlZCBieSB0aGUgbWljcm9waG9uZS5cXG5XYXZlZm9ybSBhbmltYXRpb24uXCIsXG5cbiAgICAgICAgZW50cnk6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiBcInN0YXJ0QW5pbWF0aW9uXCIsXG4gICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgYW5pbWF0aW9uOiBcInVzZXJTcGVha2luZ1wiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiYWN0aXZhdGVUYWxrQnV0dG9uXCIsXG4gICAgICAgIF0sXG5cbiAgICAgICAgZXhpdDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHR5cGU6IFwic3RvcEFuaW1hdGlvblwiLFxuICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgIGFuaW1hdGlvbjogXCJ1c2VyU3BlYWtpbmdcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImRlYWN0aXZhdGVUYWxrQnV0dG9uXCIsXG4gICAgICAgIF0sXG5cbiAgICAgICAgb246IHtcbiAgICAgICAgICBcInNheXBpOnVzZXJGaW5pc2hlZFNwZWFraW5nXCI6IHtcbiAgICAgICAgICAgIHRhcmdldDogXCJ0cmFuc2NyaWJpbmdcIixcbiAgICAgICAgICAgIGNvbmQ6IFwibG9uZ0Vub3VnaEZvclVwbG9hZFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzYXlwaTp1c2VyU3RvcHBlZFNwZWFraW5nXCI6IHtcbiAgICAgICAgICAgIHRhcmdldDogXCJpZGxlXCIsXG4gICAgICAgICAgICBjb25kOiBcInRvb1Nob3J0Rm9yVXBsb2FkXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNheXBpOnRyYW5zY3JpYmluZ1wiOiB7XG4gICAgICAgICAgICB0YXJnZXQ6IFwidHJhbnNjcmliaW5nXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBwYXVzZWQ6IHtcbiAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgXCJCbG9ja2luZyBhY3Rpb24gb24gU2FmYXJpLlxcblVzZXIgbXVzdCBwcmVzcyBwbGF5IHRvIGhlYXIgUGkncyByZXNwb25zZS5cXG5Cb3VuY2UgYW5pbWF0aW9uLlwiLFxuICAgICAgICBlbnRyeTogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHR5cGU6IFwic3RhcnRBbmltYXRpb25cIixcbiAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICBhbmltYXRpb246IFwicGF1c2VkXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGV4aXQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiBcInN0b3BBbmltYXRpb25cIixcbiAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICBhbmltYXRpb246IFwicGF1c2VkXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgXCJzYXlwaTpwbGF5XCI6IHtcbiAgICAgICAgICAgIHRhcmdldDogXCJsb2FkaW5nXCIsXG4gICAgICAgICAgICBhY3Rpb25zOiBcImhpZGVQbGF5QnV0dG9uXCIsXG4gICAgICAgICAgfSxcblxuICAgICAgICAgIFwic2F5cGk6cmVhZHlcIjoge1xuICAgICAgICAgICAgdGFyZ2V0OiBcInBhdXNlZFwiLFxuICAgICAgICAgICAgaW50ZXJuYWw6IHRydWUsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogYEVub3VnaCBhdWRpbyBoYXMgYmVlbiBidWZmZXJlZCB0byBzdGFydCBwbGF5YmFjay5gLFxuICAgICAgICAgICAgYWN0aW9uczogXCJzaG93UGxheUJ1dHRvblwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcGlTcGVha2luZzoge1xuICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICBcIlBpJ3Mgc3ludGhlc2lzZWQgc3BlZWNoIGF1ZGlvIGlzIHBsYXlpbmcuXFxuUGxheWZ1bCBhbmltYXRpb24uXCIsXG4gICAgICAgIGVudHJ5OiB7XG4gICAgICAgICAgdHlwZTogXCJzdGFydEFuaW1hdGlvblwiLFxuICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgYW5pbWF0aW9uOiBcInBpU3BlYWtpbmdcIixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBleGl0OiB7XG4gICAgICAgICAgdHlwZTogXCJzdG9wQW5pbWF0aW9uXCIsXG4gICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICBhbmltYXRpb246IFwicGlTcGVha2luZ1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgXCJzYXlwaTpwaVN0b3BwZWRTcGVha2luZ1wiOiB7XG4gICAgICAgICAgICB0YXJnZXQ6IFwiaWRsZVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzYXlwaTp1c2VyU3BlYWtpbmdcIjoge1xuICAgICAgICAgICAgdGFyZ2V0OiBcInVzZXJTcGVha2luZ1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzYXlwaTpwaUZpbmlzaGVkU3BlYWtpbmdcIjoge1xuICAgICAgICAgICAgdGFyZ2V0OiBcImlkbGVcIixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHRyYW5zY3JpYmluZzoge1xuICAgICAgICBkZXNjcmlwdGlvbjogXCJUcmFuc2NyaWJpbmcgYXVkaW8gdG8gdGV4dC5cXG5DYXJkIGZsaXAgYW5pbWF0aW9uLlwiLFxuICAgICAgICBlbnRyeTogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHR5cGU6IFwic3RhcnRBbmltYXRpb25cIixcbiAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICBhbmltYXRpb246IFwidHJhbnNjcmliaW5nXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ0cmFuc2NyaWJlQXVkaW9cIixcbiAgICAgICAgXSxcbiAgICAgICAgZXhpdDoge1xuICAgICAgICAgIHR5cGU6IFwic3RvcEFuaW1hdGlvblwiLFxuICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgYW5pbWF0aW9uOiBcInRyYW5zY3JpYmluZ1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgXCJzYXlwaTp0cmFuc2NyaWJlZFwiOiB7XG4gICAgICAgICAgICB0YXJnZXQ6IFwiaWRsZVwiLFxuICAgICAgICAgICAgYWN0aW9uczogXCJoYW5kbGVUcmFuc2NyaXB0aW9uUmVzcG9uc2VcIixcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBcIlN1Y2Nlc3NmdWxseSB0cmFuc2NyaWJlZCB1c2VyIGF1ZGlvIHRvIHRleHQuXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBsb2FkaW5nOiB7XG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlBpJ3MgYXVkaW8gaXMgbG9hZGluZy5cIixcbiAgICAgICAgZW50cnk6IHtcbiAgICAgICAgICB0eXBlOiBcInN0YXJ0QW5pbWF0aW9uXCIsXG4gICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICBhbmltYXRpb246IFwibG9hZGluZ1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGV4aXQ6IHtcbiAgICAgICAgICB0eXBlOiBcInN0b3BBbmltYXRpb25cIixcbiAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogXCJsb2FkaW5nXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgb246IHtcbiAgICAgICAgICBcInNheXBpOnBpU3BlYWtpbmdcIjoge1xuICAgICAgICAgICAgdGFyZ2V0OiBcInBpU3BlYWtpbmdcIixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGVycm9yczoge1xuICAgICAgICBkZXNjcmlwdGlvbjogXCJFcnJvciBwYXJlbnQgc3RhdGUuXCIsXG4gICAgICAgIGluaXRpYWw6IFwidHJhbnNjcmliZUZhaWxlZFwiLFxuICAgICAgICBzdGF0ZXM6IHtcbiAgICAgICAgICB0cmFuc2NyaWJlRmFpbGVkOiB7XG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogXCJUaGUgL3RyYW5zY3JpYmUgQVBJIHJlc3BvbmRlZCB3aXRoIGFuIGVycm9yLlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgcHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHM6IHRydWUsXG4gICAgcHJlc2VydmVBY3Rpb25PcmRlcjogdHJ1ZSxcbiAgfSxcbiAge1xuICAgIGFjdGlvbnM6IHtcbiAgICAgIHN0b3BBbGxBbmltYXRpb25zOiAoY29udGV4dCwgZXZlbnQpID0+IHtcbiAgICAgICAgQW5pbWF0aW9uTW9kdWxlLnN0b3BBbGxBbmltYXRpb25zKCk7XG4gICAgICB9LFxuXG4gICAgICBzdGFydEFuaW1hdGlvbjogKGNvbnRleHQsIGV2ZW50LCB7IGFjdGlvbiB9KSA9PiB7XG4gICAgICAgIEFuaW1hdGlvbk1vZHVsZS5zdGFydEFuaW1hdGlvbihhY3Rpb24ucGFyYW1zLmFuaW1hdGlvbik7XG4gICAgICB9LFxuXG4gICAgICBzdG9wQW5pbWF0aW9uOiAoY29udGV4dCwgZXZlbnQsIHsgYWN0aW9uIH0pID0+IHtcbiAgICAgICAgQW5pbWF0aW9uTW9kdWxlLnN0b3BBbmltYXRpb24oYWN0aW9uLnBhcmFtcy5hbmltYXRpb24pO1xuICAgICAgfSxcblxuICAgICAgdHJhbnNjcmliZUF1ZGlvOiAoY29udGV4dCwgZXZlbnQpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJ0cmFuc2NyaWJlQXVkaW9cIiwgZXZlbnQpO1xuICAgICAgICBjb25zdCBhdWRpb0Jsb2IgPSBldmVudC5ibG9iO1xuICAgICAgICB1cGxvYWRBdWRpbyhhdWRpb0Jsb2IpO1xuICAgICAgfSxcblxuICAgICAgaGFuZGxlVHJhbnNjcmlwdGlvblJlc3BvbnNlOiAoY29udGV4dCwgZXZlbnQpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJoYW5kbGVUcmFuc2NyaXB0aW9uUmVzcG9uc2VcIiwgZXZlbnQpO1xuICAgICAgICBjb25zdCB0cmFuc2NyaXB0aW9uID0gZXZlbnQudGV4dDtcbiAgICAgICAgaGFuZGxlVHJhbnNjcmlwdGlvblJlc3BvbnNlKHRyYW5zY3JpcHRpb24pO1xuICAgICAgfSxcblxuICAgICAgc2hvd1BsYXlCdXR0b246IChjb250ZXh0LCBldmVudCkgPT4ge1xuICAgICAgICBidXR0b25Nb2R1bGUuc2hvd1BsYXlCdXR0b24oKTtcbiAgICAgIH0sXG5cbiAgICAgIGhpZGVQbGF5QnV0dG9uOiAoY29udGV4dCwgZXZlbnQpID0+IHtcbiAgICAgICAgYnV0dG9uTW9kdWxlLmhpZGVQbGF5QnV0dG9uKCk7XG4gICAgICB9LFxuXG4gICAgICBhY3RpdmF0ZVRhbGtCdXR0b246IChjb250ZXh0LCBldmVudCkgPT4ge1xuICAgICAgICBjb25zdCB0YWxrQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS10YWxrQnV0dG9uXCIpO1xuICAgICAgICB0YWxrQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIik7IC8vIEFkZCB0aGUgYWN0aXZlIGNsYXNzIChmb3IgRmlyZWZveCBvbiBBbmRyb2lkKVxuICAgICAgfSxcblxuICAgICAgZGVhY3RpdmF0ZVRhbGtCdXR0b246IChjb250ZXh0LCBldmVudCkgPT4ge1xuICAgICAgICBjb25zdCB0YWxrQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS10YWxrQnV0dG9uXCIpO1xuICAgICAgICB0YWxrQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7IC8vIFJlbW92ZSB0aGUgYWN0aXZlIGNsYXNzIChmb3IgRmlyZWZveCBvbiBBbmRyb2lkKVxuICAgICAgfSxcblxuICAgICAgYWNxdWlyZU1pY3JvcGhvbmU6IChjb250ZXh0LCBldmVudCkgPT4ge1xuICAgICAgICAvLyB3YXJtdXAgdGhlIG1pY3JvcGhvbmUgb24gaWRsZSBpbiBtb2JpbGUgdmlldyxcbiAgICAgICAgLy8gc2luY2UgdGhlcmUncyBubyBtb3VzZW92ZXIgZXZlbnQgdG8gdHJpZ2dlciBpdFxuICAgICAgICBpZiAoaXNNb2JpbGVWaWV3KCkpIHtcbiAgICAgICAgICBFdmVudEJ1cy5lbWl0KFwiYXVkaW86c2V0dXBSZWNvcmRpbmdcIik7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSxcbiAgICBzZXJ2aWNlczoge30sXG4gICAgZ3VhcmRzOiB7XG4gICAgICB0b29TaG9ydEZvclVwbG9hZDogKGNvbnRleHQsIGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwidG9vU2hvcnRGb3JVcGxvYWRcIiwgZXZlbnQpO1xuICAgICAgICByZXR1cm4gZXZlbnQuZHVyYXRpb24gPCAxMDAwO1xuICAgICAgfSxcblxuICAgICAgbG9uZ0Vub3VnaEZvclVwbG9hZDogKGNvbnRleHQsIGV2ZW50KSA9PiB7XG4gICAgICAgIHJldHVybiBldmVudC5kdXJhdGlvbiA+PSAxMDAwO1xuICAgICAgfSxcblxuICAgICAgaXNTYWZhcmk6IChjb250ZXh0LCBldmVudCkgPT4ge1xuICAgICAgICByZXR1cm4gaXNTYWZhcmkoKTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICBkZWxheXM6IHt9LFxuICB9XG4pO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYEBrZXlmcmFtZXMgcHVsc2Vfb3V0ZXJtb3N0IHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTIpO1xuICB9XG59XG4ub3V0ZXJtb3N0IHtcbiAgYW5pbWF0aW9uOiBwdWxzZV9vdXRlcm1vc3QgNXMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBwdWxzZV9zZWNvbmQge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44NTYpO1xuICB9XG59XG4uc2Vjb25kIHtcbiAgYW5pbWF0aW9uOiBwdWxzZV9zZWNvbmQgNXMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBwdWxzZV90aGlyZCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjc5Mik7XG4gIH1cbn1cbi50aGlyZCB7XG4gIGFuaW1hdGlvbjogcHVsc2VfdGhpcmQgNXMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBwdWxzZV9mb3VydGgge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43MjgpO1xuICB9XG59XG4uZm91cnRoIHtcbiAgYW5pbWF0aW9uOiBwdWxzZV9mb3VydGggNXMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBwdWxzZV9maWZ0aCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjY2NCk7XG4gIH1cbn1cbi5maWZ0aCB7XG4gIGFuaW1hdGlvbjogcHVsc2VfZmlmdGggNXMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBwdWxzZV9pbm5lcm1vc3Qge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC42KTtcbiAgfVxufVxuLmlubmVybW9zdCB7XG4gIGFuaW1hdGlvbjogcHVsc2VfaW5uZXJtb3N0IDVzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbi8qIGJvdW5jZSBhbmltYXRpb24gdG8gaW5kaWNhdGUgUGkgaXMgcGF1c2VkIGF3YWl0aW5nIHBlcm1pc3Npb24gdG8gc3BlYWsgKi9cbkBrZXlmcmFtZXMgYm91bmNlX291dGVybW9zdCB7XG4gIDAlLFxuICAyMCUsXG4gIDUwJSxcbiAgODAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gIH1cbiAgNDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUlKTtcbiAgfVxuICA2MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMyUpO1xuICB9XG59XG4ub3V0ZXJtb3N0LnBhdXNlZCB7XG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2Vfb3V0ZXJtb3N0O1xuICBhbmltYXRpb24tZHVyYXRpb246IDJzO1xuICBhbmltYXRpb24taXRlcmF0aW9uLWNvdW50OiBpbmZpbml0ZTtcbn1cblxuQGtleWZyYW1lcyBib3VuY2Vfc2Vjb25kIHtcbiAgMCUsXG4gIDIwJSxcbiAgNTAlLFxuICA4MCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcbiAgfVxuICA0MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNS44JSk7XG4gIH1cbiAgNjAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTMuNDglKTtcbiAgfVxufVxuLnNlY29uZC5wYXVzZWQge1xuICBhbmltYXRpb24tbmFtZTogYm91bmNlX3NlY29uZDtcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcbiAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGU7XG59XG5cbkBrZXlmcmFtZXMgYm91bmNlX3RoaXJkIHtcbiAgMCUsXG4gIDIwJSxcbiAgNTAlLFxuICA4MCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcbiAgfVxuICA0MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNi42JSk7XG4gIH1cbiAgNjAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTMuOTYlKTtcbiAgfVxufVxuLnRoaXJkLnBhdXNlZCB7XG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2VfdGhpcmQ7XG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xufVxuXG5Aa2V5ZnJhbWVzIGJvdW5jZV9mb3VydGgge1xuICAwJSxcbiAgMjAlLFxuICA1MCUsXG4gIDgwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xuICB9XG4gIDQwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC03LjQlKTtcbiAgfVxuICA2MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNC40NCUpO1xuICB9XG59XG4uZm91cnRoLnBhdXNlZCB7XG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2VfZm91cnRoO1xuICBhbmltYXRpb24tZHVyYXRpb246IDJzO1xuICBhbmltYXRpb24taXRlcmF0aW9uLWNvdW50OiBpbmZpbml0ZTtcbn1cblxuQGtleWZyYW1lcyBib3VuY2VfZmlmdGgge1xuICAwJSxcbiAgMjAlLFxuICA1MCUsXG4gIDgwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xuICB9XG4gIDQwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC04LjIlKTtcbiAgfVxuICA2MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNC45MiUpO1xuICB9XG59XG4uZmlmdGgucGF1c2VkIHtcbiAgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZV9maWZ0aDtcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcbiAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGU7XG59XG5cbkBrZXlmcmFtZXMgYm91bmNlX2lubmVybW9zdCB7XG4gIDAlLFxuICAyMCUsXG4gIDUwJSxcbiAgODAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gIH1cbiAgNDAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTklKTtcbiAgfVxuICA2MCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNS40JSk7XG4gIH1cbn1cbi5pbm5lcm1vc3QucGF1c2VkIHtcbiAgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZV9pbm5lcm1vc3Q7XG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xufVxuXG4vKiBwbGF5ZnVsIGFuaW1hdGlvbiB0byBpbmRpY2F0ZSBQaSBpcyBzcGVha2luZyAqL1xuQGtleWZyYW1lcyBzcGVha2luZ19vdXRlcm1vc3Qge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKSByb3RhdGUoMGRlZyk7XG4gIH1cbiAgMjUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTk1KTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45KTtcbiAgfVxuICA3NSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44OTUpO1xuICB9XG59XG4ub3V0ZXJtb3N0LnBpU3BlYWtpbmcge1xuICBhbmltYXRpb246IHNwZWFraW5nX291dGVybW9zdCAycyBpbmZpbml0ZTtcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xufVxuXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX3NlY29uZCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpIHJvdGF0ZSgwZGVnKTtcbiAgfVxuICAyNSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45OCkgcm90YXRlKC0xZGVnKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44Nykgcm90YXRlKDBkZWcpO1xuICB9XG4gIDc1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjg2NSkgcm90YXRlKDFkZWcpO1xuICB9XG59XG4uc2Vjb25kLnBpU3BlYWtpbmcge1xuICBhbmltYXRpb246IHNwZWFraW5nX3NlY29uZCAycyBpbmZpbml0ZTtcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xufVxuXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX3RoaXJkIHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSkgcm90YXRlKDBkZWcpO1xuICB9XG4gIDI1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjk2NSkgcm90YXRlKC0yZGVnKTtcbiAgfVxuICA1MCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44NCkgcm90YXRlKDBkZWcpO1xuICB9XG4gIDc1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjgzNSkgcm90YXRlKDJkZWcpO1xuICB9XG59XG4udGhpcmQucGlTcGVha2luZyB7XG4gIGFuaW1hdGlvbjogc3BlYWtpbmdfdGhpcmQgMnMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBzcGVha2luZ19mb3VydGgge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKSByb3RhdGUoMGRlZyk7XG4gIH1cbiAgMjUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTUpIHJvdGF0ZSgtM2RlZyk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODEpIHJvdGF0ZSgwZGVnKTtcbiAgfVxuICA3NSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44MDUpIHJvdGF0ZSgzZGVnKTtcbiAgfVxufVxuLmZvdXJ0aC5waVNwZWFraW5nIHtcbiAgYW5pbWF0aW9uOiBzcGVha2luZ19mb3VydGggMnMgaW5maW5pdGU7XG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBzcGVha2luZ19maWZ0aCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpIHJvdGF0ZSgwZGVnKTtcbiAgfVxuICAyNSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45MzUpIHJvdGF0ZSgtNGRlZyk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNzgpIHJvdGF0ZSgwZGVnKTtcbiAgfVxuICA3NSUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43NzUpIHJvdGF0ZSg0ZGVnKTtcbiAgfVxufVxuLmZpZnRoLnBpU3BlYWtpbmcge1xuICBhbmltYXRpb246IHNwZWFraW5nX2ZpZnRoIDJzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbkBrZXlmcmFtZXMgc3BlYWtpbmdfaW5uZXJtb3N0IHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSkgcm90YXRlKDBkZWcpO1xuICB9XG4gIDI1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkyKSByb3RhdGUoLTVkZWcpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjc1KSByb3RhdGUoMGRlZyk7XG4gIH1cbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNzQ1KSByb3RhdGUoNWRlZyk7XG4gIH1cbn1cbi5pbm5lcm1vc3QucGlTcGVha2luZyB7XG4gIGFuaW1hdGlvbjogc3BlYWtpbmdfaW5uZXJtb3N0IDJzIGluZmluaXRlO1xuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbi8qIHdhdmUgYW5pbWF0aW9uIHRvIGluZGljYXRlIHVzZXIgaXMgc3BlYWtpbmcgKi9cbkBrZXlmcmFtZXMgdXNlclNwZWFraW5nQW5pbWF0aW9uIHtcbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjA1KSBzY2FsZVgodmFyKC0td2lkdGgtZmFjdG9yKSlcbiAgICAgIHRyYW5zbGF0ZVgoY2FsYygtNTAlICsgdmFyKC0tc3ByZWFkLWFtb3VudCkpKTtcbiAgfVxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgxKSBzY2FsZVgodmFyKC0td2lkdGgtZmFjdG9yKSlcbiAgICAgIHRyYW5zbGF0ZVgoY2FsYygtNTAlICsgdmFyKC0tc3ByZWFkLWFtb3VudCkpKTtcbiAgfVxufVxuLyogdXNlciBzcGVha2luZyBvc2NpbGxhdGlvbiBhbmltYXRpb24gKi9cbkBrZXlmcmFtZXMgd2F2ZWZvcm1fb3V0ZXJtb3N0IHtcbiAgMCUsXG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGVZKDEpIHNjYWxlWCgxKTtcbiAgfVxuICAyNSUsXG4gIDc1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC45KSBzY2FsZVgoMC45KTtcbiAgfVxufVxuXG5Aa2V5ZnJhbWVzIHdhdmVmb3JtX3NlY29uZCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjkpIHNjYWxlWCgwLjkpO1xuICB9XG4gIDI1JSxcbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjgpIHNjYWxlWCgwLjgpO1xuICB9XG59XG5cbkBrZXlmcmFtZXMgd2F2ZWZvcm1fdGhpcmQge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC44KSBzY2FsZVgoMC44KTtcbiAgfVxuICAyNSUsXG4gIDc1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC43KSBzY2FsZVgoMC43KTtcbiAgfVxufVxuXG5Aa2V5ZnJhbWVzIHdhdmVmb3JtX2ZvdXJ0aCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjcpIHNjYWxlWCgwLjcpO1xuICB9XG4gIDI1JSxcbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjYpIHNjYWxlWCgwLjYpO1xuICB9XG59XG5cbkBrZXlmcmFtZXMgd2F2ZWZvcm1fZmlmdGgge1xuICAwJSxcbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC42KSBzY2FsZVgoMC42KTtcbiAgfVxuICAyNSUsXG4gIDc1JSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC41KSBzY2FsZVgoMC41KTtcbiAgfVxufVxuXG5Aa2V5ZnJhbWVzIHdhdmVmb3JtX2lubmVybW9zdCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjUpIHNjYWxlWCgwLjUpO1xuICB9XG4gIDI1JSxcbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjQpIHNjYWxlWCgwLjQpO1xuICB9XG59XG5cbi5vdXRlcm1vc3QudXNlclNwZWFraW5nIHtcbiAgYW5pbWF0aW9uOiB3YXZlZm9ybV9vdXRlcm1vc3QgMC43cyBpbmZpbml0ZSBhbHRlcm5hdGU7XG59XG5cbi5zZWNvbmQudXNlclNwZWFraW5nIHtcbiAgYW5pbWF0aW9uOiB3YXZlZm9ybV9zZWNvbmQgMC42NXMgaW5maW5pdGUgYWx0ZXJuYXRlO1xufVxuXG4udGhpcmQudXNlclNwZWFraW5nIHtcbiAgYW5pbWF0aW9uOiB3YXZlZm9ybV90aGlyZCAwLjZzIGluZmluaXRlIGFsdGVybmF0ZTtcbn1cblxuLmZvdXJ0aC51c2VyU3BlYWtpbmcge1xuICBhbmltYXRpb246IHdhdmVmb3JtX2ZvdXJ0aCAwLjU1cyBpbmZpbml0ZSBhbHRlcm5hdGU7XG59XG5cbi5maWZ0aC51c2VyU3BlYWtpbmcge1xuICBhbmltYXRpb246IHdhdmVmb3JtX2ZpZnRoIDAuNXMgaW5maW5pdGUgYWx0ZXJuYXRlO1xufVxuXG4uaW5uZXJtb3N0LnVzZXJTcGVha2luZyB7XG4gIGFuaW1hdGlvbjogd2F2ZWZvcm1faW5uZXJtb3N0IDAuNDVzIGluZmluaXRlIGFsdGVybmF0ZTtcbn1cblxuLyogZmxpcGNhcmQgYW5pbWF0aW9uIHRvIGluZGljYXRlIFNheSwgUGkgaXMgdHJhbnNjcmliaW5nIGF1ZGlvIHRvIHRleHQgKi9cbkBrZXlmcmFtZXMgdHJhbnNjcmliaW5nRmxpcCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZVkoMGRlZyk7XG4gICAgZmlsbDogdmFyKC0tb3JpZ2luYWwtY29sb3IpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGVZKDE4MGRlZyk7XG4gICAgZmlsbDogdmFyKC0tdHJhbnNjcmliaW5nLWNvbG9yKTtcbiAgfVxufVxuXG4ub3V0ZXJtb3N0LnRyYW5zY3JpYmluZyB7XG4gIC0tb3JpZ2luYWwtY29sb3I6ICNlNGYyZDE7XG4gIC0tdHJhbnNjcmliaW5nLWNvbG9yOiAjYjNlMGZlO1xuICBhbmltYXRpb246IHRyYW5zY3JpYmluZ0ZsaXAgMS41cyBpbmZpbml0ZTtcbn1cblxuLnNlY29uZC50cmFuc2NyaWJpbmcge1xuICAtLW9yaWdpbmFsLWNvbG9yOiAjY2NlOGI1O1xuICAtLXRyYW5zY3JpYmluZy1jb2xvcjogIzg5YzJmZjtcbiAgYW5pbWF0aW9uOiB0cmFuc2NyaWJpbmdGbGlwIDEuNnMgaW5maW5pdGU7XG59XG5cbi50aGlyZC50cmFuc2NyaWJpbmcge1xuICAtLW9yaWdpbmFsLWNvbG9yOiAjYjNkYjk1O1xuICAtLXRyYW5zY3JpYmluZy1jb2xvcjogIzVmYTRmZjtcbiAgYW5pbWF0aW9uOiB0cmFuc2NyaWJpbmdGbGlwIDEuN3MgaW5maW5pdGU7XG59XG5cbi5mb3VydGgudHJhbnNjcmliaW5nIHtcbiAgLS1vcmlnaW5hbC1jb2xvcjogIzliZDA3ODtcbiAgLS10cmFuc2NyaWJpbmctY29sb3I6ICMzNTg2ZmY7XG4gIGFuaW1hdGlvbjogdHJhbnNjcmliaW5nRmxpcCAxLjhzIGluZmluaXRlO1xufVxuXG4uZmlmdGgudHJhbnNjcmliaW5nIHtcbiAgLS1vcmlnaW5hbC1jb2xvcjogIzgzYzU1YztcbiAgLS10cmFuc2NyaWJpbmctY29sb3I6ICMwYjY5ZTM7XG4gIGFuaW1hdGlvbjogdHJhbnNjcmliaW5nRmxpcCAxLjlzIGluZmluaXRlO1xufVxuXG4uaW5uZXJtb3N0LnRyYW5zY3JpYmluZyB7XG4gIC0tb3JpZ2luYWwtY29sb3I6ICM0MjhhMmY7XG4gIC0tdHJhbnNjcmliaW5nLWNvbG9yOiAjMDA1M2JmO1xuICBhbmltYXRpb246IHRyYW5zY3JpYmluZ0ZsaXAgMnMgaW5maW5pdGU7XG59XG5cbi8qIGhlYXJ0YmVhdCBhbmltYXRpb24gdG8gaW5kaWNhdGUgUGkgaXMgcHJlcGFyaW5nIHRvIHNwZWFrICovXG5Aa2V5ZnJhbWVzIGhlYXJ0YmVhdCB7XG4gIDAlLFxuICAxMDAlIHtcbiAgICBvcGFjaXR5OiAxO1xuICAgIGZpbGw6IHZhcigtLW9yaWdpbmFsLWNvbG9yKTtcbiAgfVxuICA1MCUge1xuICAgIG9wYWNpdHk6IDAuNTtcbiAgICBmaWxsOiByZ2IoMjQ1IDIzOCAyMjMpOyAvKiBiZy1jcmVhbS01NTAgKi9cbiAgfVxufVxuXG4ub3V0ZXJtb3N0LmxvYWRpbmcge1xuICAtLW9yaWdpbmFsLWNvbG9yOiAjZTRmMmQxO1xuICBhbmltYXRpb246IGhlYXJ0YmVhdCAycyBpbmZpbml0ZTtcbiAgYW5pbWF0aW9uLWRlbGF5OiAwcztcbn1cblxuLnNlY29uZC5sb2FkaW5nIHtcbiAgLS1vcmlnaW5hbC1jb2xvcjogI2NjZThiNTtcbiAgYW5pbWF0aW9uOiBoZWFydGJlYXQgMnMgaW5maW5pdGU7XG4gIGFuaW1hdGlvbi1kZWxheTogMC40cztcbn1cblxuLnRoaXJkLmxvYWRpbmcge1xuICAtLW9yaWdpbmFsLWNvbG9yOiAjYjNkYjk1O1xuICBhbmltYXRpb246IGhlYXJ0YmVhdCAycyBpbmZpbml0ZTtcbiAgYW5pbWF0aW9uLWRlbGF5OiAwLjhzO1xufVxuXG4uZm91cnRoLmxvYWRpbmcge1xuICAtLW9yaWdpbmFsLWNvbG9yOiAjOWJkMDc4O1xuICBhbmltYXRpb246IGhlYXJ0YmVhdCAycyBpbmZpbml0ZTtcbiAgYW5pbWF0aW9uLWRlbGF5OiAxLjJzO1xufVxuXG4uZmlmdGgubG9hZGluZyB7XG4gIC0tb3JpZ2luYWwtY29sb3I6ICM4M2M1NWM7XG4gIGFuaW1hdGlvbjogaGVhcnRiZWF0IDJzIGluZmluaXRlO1xuICBhbmltYXRpb24tZGVsYXk6IDEuNnM7XG59XG5cbi5pbm5lcm1vc3QubG9hZGluZyB7XG4gIC0tb3JpZ2luYWwtY29sb3I6ICM0MjhhMmY7XG4gIGFuaW1hdGlvbjogaGVhcnRiZWF0IDJzIGluZmluaXRlO1xuICBhbmltYXRpb24tZGVsYXk6IDJzO1xufVxuXG4vKiBkaXNzYXJ5IGFuaW1hdGlvbiB0byBpbmRpY2F0ZSBhbiBlcnJvciAqL1xuQGtleWZyYW1lcyBlcnJvckFuaW1hdGlvbiB7XG4gIDAlIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKSB0cmFuc2xhdGUoMHB4LCAwcHgpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGUoNDVkZWcpIHRyYW5zbGF0ZSgxMHB4LCA1cHgpO1xuICB9XG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogcm90YXRlKC00NWRlZykgdHJhbnNsYXRlKC0xMHB4LCAtNXB4KTtcbiAgfVxufVxuXG4ub3V0ZXJtb3N0LmVycm9yIHtcbiAgYW5pbWF0aW9uOiBlcnJvckFuaW1hdGlvbiAycyBpbmZpbml0ZTtcbiAgZmlsbDogI2ZmNjY2NjsgLyogc2hhZGUgb2YgcmVkICovXG59XG5cbi5zZWNvbmQuZXJyb3Ige1xuICBhbmltYXRpb246IGVycm9yQW5pbWF0aW9uIDIuMnMgaW5maW5pdGU7XG4gIGZpbGw6ICNmZjRkNGQ7IC8qIGFub3RoZXIgc2hhZGUgb2YgcmVkICovXG59XG5cbi50aGlyZC5lcnJvciB7XG4gIGFuaW1hdGlvbjogZXJyb3JBbmltYXRpb24gMi40cyBpbmZpbml0ZTtcbiAgZmlsbDogI2ZmMzMzMzsgLyogYW5vdGhlciBzaGFkZSBvZiByZWQgKi9cbn1cblxuLmZvdXJ0aC5lcnJvciB7XG4gIGFuaW1hdGlvbjogZXJyb3JBbmltYXRpb24gMi42cyBpbmZpbml0ZTtcbiAgZmlsbDogI2ZmMWExYTsgLyogYW5vdGhlciBzaGFkZSBvZiByZWQgKi9cbn1cblxuLmZpZnRoLmVycm9yIHtcbiAgYW5pbWF0aW9uOiBlcnJvckFuaW1hdGlvbiAyLjhzIGluZmluaXRlO1xuICBmaWxsOiAjZmYwMDAwOyAvKiBwdXJlIHJlZCAqL1xufVxuXG4uaW5uZXJtb3N0LmVycm9yIHtcbiAgYW5pbWF0aW9uOiBlcnJvckFuaW1hdGlvbiAzcyBpbmZpbml0ZTtcbiAgZmlsbDogI2U2MDAwMDsgLyogZGFyayByZWQgKi9cbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3JlY3RhbmdsZXMuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0U7O0lBRUUsbUJBQW1CO0VBQ3JCO0VBQ0E7SUFDRSxzQkFBc0I7RUFDeEI7QUFDRjtBQUNBO0VBQ0Usc0NBQXNDO0VBQ3RDLHdCQUF3QjtBQUMxQjs7QUFFQTtFQUNFOztJQUVFLG1CQUFtQjtFQUNyQjtFQUNBO0lBQ0UsdUJBQXVCO0VBQ3pCO0FBQ0Y7QUFDQTtFQUNFLG1DQUFtQztFQUNuQyx3QkFBd0I7QUFDMUI7O0FBRUE7RUFDRTs7SUFFRSxtQkFBbUI7RUFDckI7RUFDQTtJQUNFLHVCQUF1QjtFQUN6QjtBQUNGO0FBQ0E7RUFDRSxrQ0FBa0M7RUFDbEMsd0JBQXdCO0FBQzFCOztBQUVBO0VBQ0U7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QTtFQUNFLHVDQUF1QztFQUN2QyxhQUFhLEVBQUUsYUFBYTtBQUM5Qjs7QUFFQTtFQUNFLHFDQUFxQztFQUNyQyxhQUFhLEVBQUUsYUFBYTtBQUM5QlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCJAa2V5ZnJhbWVzIHB1bHNlX291dGVybW9zdCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkyKTtcXG4gIH1cXG59XFxuLm91dGVybW9zdCB7XFxuICBhbmltYXRpb246IHB1bHNlX291dGVybW9zdCA1cyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuQGtleWZyYW1lcyBwdWxzZV9zZWNvbmQge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44NTYpO1xcbiAgfVxcbn1cXG4uc2Vjb25kIHtcXG4gIGFuaW1hdGlvbjogcHVsc2Vfc2Vjb25kIDVzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHB1bHNlX3RoaXJkIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNzkyKTtcXG4gIH1cXG59XFxuLnRoaXJkIHtcXG4gIGFuaW1hdGlvbjogcHVsc2VfdGhpcmQgNXMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbkBrZXlmcmFtZXMgcHVsc2VfZm91cnRoIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuNzI4KTtcXG4gIH1cXG59XFxuLmZvdXJ0aCB7XFxuICBhbmltYXRpb246IHB1bHNlX2ZvdXJ0aCA1cyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuQGtleWZyYW1lcyBwdWxzZV9maWZ0aCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjY2NCk7XFxuICB9XFxufVxcbi5maWZ0aCB7XFxuICBhbmltYXRpb246IHB1bHNlX2ZpZnRoIDVzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHB1bHNlX2lubmVybW9zdCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjYpO1xcbiAgfVxcbn1cXG4uaW5uZXJtb3N0IHtcXG4gIGFuaW1hdGlvbjogcHVsc2VfaW5uZXJtb3N0IDVzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG4vKiBib3VuY2UgYW5pbWF0aW9uIHRvIGluZGljYXRlIFBpIGlzIHBhdXNlZCBhd2FpdGluZyBwZXJtaXNzaW9uIHRvIHNwZWFrICovXFxuQGtleWZyYW1lcyBib3VuY2Vfb3V0ZXJtb3N0IHtcXG4gIDAlLFxcbiAgMjAlLFxcbiAgNTAlLFxcbiAgODAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcXG4gIH1cXG4gIDQwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNSUpO1xcbiAgfVxcbiAgNjAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0zJSk7XFxuICB9XFxufVxcbi5vdXRlcm1vc3QucGF1c2VkIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2Vfb3V0ZXJtb3N0O1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcXG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIGJvdW5jZV9zZWNvbmQge1xcbiAgMCUsXFxuICAyMCUsXFxuICA1MCUsXFxuICA4MCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xcbiAgfVxcbiAgNDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01LjglKTtcXG4gIH1cXG4gIDYwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMy40OCUpO1xcbiAgfVxcbn1cXG4uc2Vjb25kLnBhdXNlZCB7XFxuICBhbmltYXRpb24tbmFtZTogYm91bmNlX3NlY29uZDtcXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XFxuICBhbmltYXRpb24taXRlcmF0aW9uLWNvdW50OiBpbmZpbml0ZTtcXG59XFxuXFxuQGtleWZyYW1lcyBib3VuY2VfdGhpcmQge1xcbiAgMCUsXFxuICAyMCUsXFxuICA1MCUsXFxuICA4MCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xcbiAgfVxcbiAgNDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC02LjYlKTtcXG4gIH1cXG4gIDYwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMy45NiUpO1xcbiAgfVxcbn1cXG4udGhpcmQucGF1c2VkIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2VfdGhpcmQ7XFxuICBhbmltYXRpb24tZHVyYXRpb246IDJzO1xcbiAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGU7XFxufVxcblxcbkBrZXlmcmFtZXMgYm91bmNlX2ZvdXJ0aCB7XFxuICAwJSxcXG4gIDIwJSxcXG4gIDUwJSxcXG4gIDgwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XFxuICB9XFxuICA0MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTcuNCUpO1xcbiAgfVxcbiAgNjAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC00LjQ0JSk7XFxuICB9XFxufVxcbi5mb3VydGgucGF1c2VkIHtcXG4gIGFuaW1hdGlvbi1uYW1lOiBib3VuY2VfZm91cnRoO1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAycztcXG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IGluZmluaXRlO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIGJvdW5jZV9maWZ0aCB7XFxuICAwJSxcXG4gIDIwJSxcXG4gIDUwJSxcXG4gIDgwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XFxuICB9XFxuICA0MCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTguMiUpO1xcbiAgfVxcbiAgNjAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC00LjkyJSk7XFxuICB9XFxufVxcbi5maWZ0aC5wYXVzZWQge1xcbiAgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZV9maWZ0aDtcXG4gIGFuaW1hdGlvbi1kdXJhdGlvbjogMnM7XFxuICBhbmltYXRpb24taXRlcmF0aW9uLWNvdW50OiBpbmZpbml0ZTtcXG59XFxuXFxuQGtleWZyYW1lcyBib3VuY2VfaW5uZXJtb3N0IHtcXG4gIDAlLFxcbiAgMjAlLFxcbiAgNTAlLFxcbiAgODAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcXG4gIH1cXG4gIDQwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtOSUpO1xcbiAgfVxcbiAgNjAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01LjQlKTtcXG4gIH1cXG59XFxuLmlubmVybW9zdC5wYXVzZWQge1xcbiAgYW5pbWF0aW9uLW5hbWU6IGJvdW5jZV9pbm5lcm1vc3Q7XFxuICBhbmltYXRpb24tZHVyYXRpb246IDJzO1xcbiAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogaW5maW5pdGU7XFxufVxcblxcbi8qIHBsYXlmdWwgYW5pbWF0aW9uIHRvIGluZGljYXRlIFBpIGlzIHNwZWFraW5nICovXFxuQGtleWZyYW1lcyBzcGVha2luZ19vdXRlcm1vc3Qge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKSByb3RhdGUoMGRlZyk7XFxuICB9XFxuICAyNSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTk1KTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45KTtcXG4gIH1cXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44OTUpO1xcbiAgfVxcbn1cXG4ub3V0ZXJtb3N0LnBpU3BlYWtpbmcge1xcbiAgYW5pbWF0aW9uOiBzcGVha2luZ19vdXRlcm1vc3QgMnMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbkBrZXlmcmFtZXMgc3BlYWtpbmdfc2Vjb25kIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSkgcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgMjUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjk4KSByb3RhdGUoLTFkZWcpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjg3KSByb3RhdGUoMGRlZyk7XFxuICB9XFxuICA3NSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODY1KSByb3RhdGUoMWRlZyk7XFxuICB9XFxufVxcbi5zZWNvbmQucGlTcGVha2luZyB7XFxuICBhbmltYXRpb246IHNwZWFraW5nX3NlY29uZCAycyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuQGtleWZyYW1lcyBzcGVha2luZ190aGlyZCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpIHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDI1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45NjUpIHJvdGF0ZSgtMmRlZyk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODQpIHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44MzUpIHJvdGF0ZSgyZGVnKTtcXG4gIH1cXG59XFxuLnRoaXJkLnBpU3BlYWtpbmcge1xcbiAgYW5pbWF0aW9uOiBzcGVha2luZ190aGlyZCAycyBpbmZpbml0ZTtcXG4gIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcXG59XFxuXFxuQGtleWZyYW1lcyBzcGVha2luZ19mb3VydGgge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKSByb3RhdGUoMGRlZyk7XFxuICB9XFxuICAyNSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTUpIHJvdGF0ZSgtM2RlZyk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuODEpIHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC44MDUpIHJvdGF0ZSgzZGVnKTtcXG4gIH1cXG59XFxuLmZvdXJ0aC5waVNwZWFraW5nIHtcXG4gIGFuaW1hdGlvbjogc3BlYWtpbmdfZm91cnRoIDJzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX2ZpZnRoIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSkgcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgMjUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkzNSkgcm90YXRlKC00ZGVnKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43OCkgcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgNzUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjc3NSkgcm90YXRlKDRkZWcpO1xcbiAgfVxcbn1cXG4uZmlmdGgucGlTcGVha2luZyB7XFxuICBhbmltYXRpb246IHNwZWFraW5nX2ZpZnRoIDJzIGluZmluaXRlO1xcbiAgdHJhbnNmb3JtLW9yaWdpbjogY2VudGVyO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIHNwZWFraW5nX2lubmVybW9zdCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpIHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDI1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC45Mikgcm90YXRlKC01ZGVnKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMC43NSkgcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgNzUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjc0NSkgcm90YXRlKDVkZWcpO1xcbiAgfVxcbn1cXG4uaW5uZXJtb3N0LnBpU3BlYWtpbmcge1xcbiAgYW5pbWF0aW9uOiBzcGVha2luZ19pbm5lcm1vc3QgMnMgaW5maW5pdGU7XFxuICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XFxufVxcblxcbi8qIHdhdmUgYW5pbWF0aW9uIHRvIGluZGljYXRlIHVzZXIgaXMgc3BlYWtpbmcgKi9cXG5Aa2V5ZnJhbWVzIHVzZXJTcGVha2luZ0FuaW1hdGlvbiB7XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjA1KSBzY2FsZVgodmFyKC0td2lkdGgtZmFjdG9yKSlcXG4gICAgICB0cmFuc2xhdGVYKGNhbGMoLTUwJSArIHZhcigtLXNwcmVhZC1hbW91bnQpKSk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMSkgc2NhbGVYKHZhcigtLXdpZHRoLWZhY3RvcikpXFxuICAgICAgdHJhbnNsYXRlWChjYWxjKC01MCUgKyB2YXIoLS1zcHJlYWQtYW1vdW50KSkpO1xcbiAgfVxcbn1cXG4vKiB1c2VyIHNwZWFraW5nIG9zY2lsbGF0aW9uIGFuaW1hdGlvbiAqL1xcbkBrZXlmcmFtZXMgd2F2ZWZvcm1fb3V0ZXJtb3N0IHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDEpIHNjYWxlWCgxKTtcXG4gIH1cXG4gIDI1JSxcXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuOSkgc2NhbGVYKDAuOSk7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgd2F2ZWZvcm1fc2Vjb25kIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuOSkgc2NhbGVYKDAuOSk7XFxuICB9XFxuICAyNSUsXFxuICA3NSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjgpIHNjYWxlWCgwLjgpO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIHdhdmVmb3JtX3RoaXJkIHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuOCkgc2NhbGVYKDAuOCk7XFxuICB9XFxuICAyNSUsXFxuICA3NSUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjcpIHNjYWxlWCgwLjcpO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIHdhdmVmb3JtX2ZvdXJ0aCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjcpIHNjYWxlWCgwLjcpO1xcbiAgfVxcbiAgMjUlLFxcbiAgNzUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC42KSBzY2FsZVgoMC42KTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyB3YXZlZm9ybV9maWZ0aCB7XFxuICAwJSxcXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlWSgwLjYpIHNjYWxlWCgwLjYpO1xcbiAgfVxcbiAgMjUlLFxcbiAgNzUlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC41KSBzY2FsZVgoMC41KTtcXG4gIH1cXG59XFxuXFxuQGtleWZyYW1lcyB3YXZlZm9ybV9pbm5lcm1vc3Qge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZVkoMC41KSBzY2FsZVgoMC41KTtcXG4gIH1cXG4gIDI1JSxcXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGVZKDAuNCkgc2NhbGVYKDAuNCk7XFxuICB9XFxufVxcblxcbi5vdXRlcm1vc3QudXNlclNwZWFraW5nIHtcXG4gIGFuaW1hdGlvbjogd2F2ZWZvcm1fb3V0ZXJtb3N0IDAuN3MgaW5maW5pdGUgYWx0ZXJuYXRlO1xcbn1cXG5cXG4uc2Vjb25kLnVzZXJTcGVha2luZyB7XFxuICBhbmltYXRpb246IHdhdmVmb3JtX3NlY29uZCAwLjY1cyBpbmZpbml0ZSBhbHRlcm5hdGU7XFxufVxcblxcbi50aGlyZC51c2VyU3BlYWtpbmcge1xcbiAgYW5pbWF0aW9uOiB3YXZlZm9ybV90aGlyZCAwLjZzIGluZmluaXRlIGFsdGVybmF0ZTtcXG59XFxuXFxuLmZvdXJ0aC51c2VyU3BlYWtpbmcge1xcbiAgYW5pbWF0aW9uOiB3YXZlZm9ybV9mb3VydGggMC41NXMgaW5maW5pdGUgYWx0ZXJuYXRlO1xcbn1cXG5cXG4uZmlmdGgudXNlclNwZWFraW5nIHtcXG4gIGFuaW1hdGlvbjogd2F2ZWZvcm1fZmlmdGggMC41cyBpbmZpbml0ZSBhbHRlcm5hdGU7XFxufVxcblxcbi5pbm5lcm1vc3QudXNlclNwZWFraW5nIHtcXG4gIGFuaW1hdGlvbjogd2F2ZWZvcm1faW5uZXJtb3N0IDAuNDVzIGluZmluaXRlIGFsdGVybmF0ZTtcXG59XFxuXFxuLyogZmxpcGNhcmQgYW5pbWF0aW9uIHRvIGluZGljYXRlIFNheSwgUGkgaXMgdHJhbnNjcmliaW5nIGF1ZGlvIHRvIHRleHQgKi9cXG5Aa2V5ZnJhbWVzIHRyYW5zY3JpYmluZ0ZsaXAge1xcbiAgMCUsXFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiByb3RhdGVZKDBkZWcpO1xcbiAgICBmaWxsOiB2YXIoLS1vcmlnaW5hbC1jb2xvcik7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZVkoMTgwZGVnKTtcXG4gICAgZmlsbDogdmFyKC0tdHJhbnNjcmliaW5nLWNvbG9yKTtcXG4gIH1cXG59XFxuXFxuLm91dGVybW9zdC50cmFuc2NyaWJpbmcge1xcbiAgLS1vcmlnaW5hbC1jb2xvcjogI2U0ZjJkMTtcXG4gIC0tdHJhbnNjcmliaW5nLWNvbG9yOiAjYjNlMGZlO1xcbiAgYW5pbWF0aW9uOiB0cmFuc2NyaWJpbmdGbGlwIDEuNXMgaW5maW5pdGU7XFxufVxcblxcbi5zZWNvbmQudHJhbnNjcmliaW5nIHtcXG4gIC0tb3JpZ2luYWwtY29sb3I6ICNjY2U4YjU7XFxuICAtLXRyYW5zY3JpYmluZy1jb2xvcjogIzg5YzJmZjtcXG4gIGFuaW1hdGlvbjogdHJhbnNjcmliaW5nRmxpcCAxLjZzIGluZmluaXRlO1xcbn1cXG5cXG4udGhpcmQudHJhbnNjcmliaW5nIHtcXG4gIC0tb3JpZ2luYWwtY29sb3I6ICNiM2RiOTU7XFxuICAtLXRyYW5zY3JpYmluZy1jb2xvcjogIzVmYTRmZjtcXG4gIGFuaW1hdGlvbjogdHJhbnNjcmliaW5nRmxpcCAxLjdzIGluZmluaXRlO1xcbn1cXG5cXG4uZm91cnRoLnRyYW5zY3JpYmluZyB7XFxuICAtLW9yaWdpbmFsLWNvbG9yOiAjOWJkMDc4O1xcbiAgLS10cmFuc2NyaWJpbmctY29sb3I6ICMzNTg2ZmY7XFxuICBhbmltYXRpb246IHRyYW5zY3JpYmluZ0ZsaXAgMS44cyBpbmZpbml0ZTtcXG59XFxuXFxuLmZpZnRoLnRyYW5zY3JpYmluZyB7XFxuICAtLW9yaWdpbmFsLWNvbG9yOiAjODNjNTVjO1xcbiAgLS10cmFuc2NyaWJpbmctY29sb3I6ICMwYjY5ZTM7XFxuICBhbmltYXRpb246IHRyYW5zY3JpYmluZ0ZsaXAgMS45cyBpbmZpbml0ZTtcXG59XFxuXFxuLmlubmVybW9zdC50cmFuc2NyaWJpbmcge1xcbiAgLS1vcmlnaW5hbC1jb2xvcjogIzQyOGEyZjtcXG4gIC0tdHJhbnNjcmliaW5nLWNvbG9yOiAjMDA1M2JmO1xcbiAgYW5pbWF0aW9uOiB0cmFuc2NyaWJpbmdGbGlwIDJzIGluZmluaXRlO1xcbn1cXG5cXG4vKiBoZWFydGJlYXQgYW5pbWF0aW9uIHRvIGluZGljYXRlIFBpIGlzIHByZXBhcmluZyB0byBzcGVhayAqL1xcbkBrZXlmcmFtZXMgaGVhcnRiZWF0IHtcXG4gIDAlLFxcbiAgMTAwJSB7XFxuICAgIG9wYWNpdHk6IDE7XFxuICAgIGZpbGw6IHZhcigtLW9yaWdpbmFsLWNvbG9yKTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIG9wYWNpdHk6IDAuNTtcXG4gICAgZmlsbDogcmdiKDI0NSAyMzggMjIzKTsgLyogYmctY3JlYW0tNTUwICovXFxuICB9XFxufVxcblxcbi5vdXRlcm1vc3QubG9hZGluZyB7XFxuICAtLW9yaWdpbmFsLWNvbG9yOiAjZTRmMmQxO1xcbiAgYW5pbWF0aW9uOiBoZWFydGJlYXQgMnMgaW5maW5pdGU7XFxuICBhbmltYXRpb24tZGVsYXk6IDBzO1xcbn1cXG5cXG4uc2Vjb25kLmxvYWRpbmcge1xcbiAgLS1vcmlnaW5hbC1jb2xvcjogI2NjZThiNTtcXG4gIGFuaW1hdGlvbjogaGVhcnRiZWF0IDJzIGluZmluaXRlO1xcbiAgYW5pbWF0aW9uLWRlbGF5OiAwLjRzO1xcbn1cXG5cXG4udGhpcmQubG9hZGluZyB7XFxuICAtLW9yaWdpbmFsLWNvbG9yOiAjYjNkYjk1O1xcbiAgYW5pbWF0aW9uOiBoZWFydGJlYXQgMnMgaW5maW5pdGU7XFxuICBhbmltYXRpb24tZGVsYXk6IDAuOHM7XFxufVxcblxcbi5mb3VydGgubG9hZGluZyB7XFxuICAtLW9yaWdpbmFsLWNvbG9yOiAjOWJkMDc4O1xcbiAgYW5pbWF0aW9uOiBoZWFydGJlYXQgMnMgaW5maW5pdGU7XFxuICBhbmltYXRpb24tZGVsYXk6IDEuMnM7XFxufVxcblxcbi5maWZ0aC5sb2FkaW5nIHtcXG4gIC0tb3JpZ2luYWwtY29sb3I6ICM4M2M1NWM7XFxuICBhbmltYXRpb246IGhlYXJ0YmVhdCAycyBpbmZpbml0ZTtcXG4gIGFuaW1hdGlvbi1kZWxheTogMS42cztcXG59XFxuXFxuLmlubmVybW9zdC5sb2FkaW5nIHtcXG4gIC0tb3JpZ2luYWwtY29sb3I6ICM0MjhhMmY7XFxuICBhbmltYXRpb246IGhlYXJ0YmVhdCAycyBpbmZpbml0ZTtcXG4gIGFuaW1hdGlvbi1kZWxheTogMnM7XFxufVxcblxcbi8qIGRpc3NhcnkgYW5pbWF0aW9uIHRvIGluZGljYXRlIGFuIGVycm9yICovXFxuQGtleWZyYW1lcyBlcnJvckFuaW1hdGlvbiB7XFxuICAwJSB7XFxuICAgIHRyYW5zZm9ybTogcm90YXRlKDBkZWcpIHRyYW5zbGF0ZSgwcHgsIDBweCk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSg0NWRlZykgdHJhbnNsYXRlKDEwcHgsIDVweCk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiByb3RhdGUoLTQ1ZGVnKSB0cmFuc2xhdGUoLTEwcHgsIC01cHgpO1xcbiAgfVxcbn1cXG5cXG4ub3V0ZXJtb3N0LmVycm9yIHtcXG4gIGFuaW1hdGlvbjogZXJyb3JBbmltYXRpb24gMnMgaW5maW5pdGU7XFxuICBmaWxsOiAjZmY2NjY2OyAvKiBzaGFkZSBvZiByZWQgKi9cXG59XFxuXFxuLnNlY29uZC5lcnJvciB7XFxuICBhbmltYXRpb246IGVycm9yQW5pbWF0aW9uIDIuMnMgaW5maW5pdGU7XFxuICBmaWxsOiAjZmY0ZDRkOyAvKiBhbm90aGVyIHNoYWRlIG9mIHJlZCAqL1xcbn1cXG5cXG4udGhpcmQuZXJyb3Ige1xcbiAgYW5pbWF0aW9uOiBlcnJvckFuaW1hdGlvbiAyLjRzIGluZmluaXRlO1xcbiAgZmlsbDogI2ZmMzMzMzsgLyogYW5vdGhlciBzaGFkZSBvZiByZWQgKi9cXG59XFxuXFxuLmZvdXJ0aC5lcnJvciB7XFxuICBhbmltYXRpb246IGVycm9yQW5pbWF0aW9uIDIuNnMgaW5maW5pdGU7XFxuICBmaWxsOiAjZmYxYTFhOyAvKiBhbm90aGVyIHNoYWRlIG9mIHJlZCAqL1xcbn1cXG5cXG4uZmlmdGguZXJyb3Ige1xcbiAgYW5pbWF0aW9uOiBlcnJvckFuaW1hdGlvbiAyLjhzIGluZmluaXRlO1xcbiAgZmlsbDogI2ZmMDAwMDsgLyogcHVyZSByZWQgKi9cXG59XFxuXFxuLmlubmVybW9zdC5lcnJvciB7XFxuICBhbmltYXRpb246IGVycm9yQW5pbWF0aW9uIDNzIGluZmluaXRlO1xcbiAgZmlsbDogI2U2MDAwMDsgLyogZGFyayByZWQgKi9cXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGBAa2V5ZnJhbWVzIHB1bHNlIHtcbiAgMCUge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOSk7XG4gIH1cbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgfVxufVxuI3NheXBpLXRhbGtCdXR0b24sXG4ucGxheS1idXR0b24ge1xuICBtYXJnaW4tdG9wOiAwLjI1cmVtO1xuICBib3JkZXItcmFkaXVzOiAxOHB4O1xuICB3aWR0aDogMTIwcHg7XG4gIGRpc3BsYXk6IGJsb2NrOyAvKiBGb3IgU2FmYXJpICovXG59XG5cbmh0bWw6bm90KC5maXJlZm94LWFuZHJvaWQpICNzYXlwaS10YWxrQnV0dG9uOmFjdGl2ZSAud2F2ZWZvcm0sXG4jc2F5cGktdGFsa0J1dHRvbi5hY3RpdmUgLndhdmVmb3JtIHtcbiAgYW5pbWF0aW9uOiBwdWxzZSAxcyBpbmZpbml0ZTtcbn1cbiNzYXlwaS10YWxrQnV0dG9uIC53YXZlZm9ybSB7XG4gIGZpbGw6ICM3NzZkNmQ7XG59XG4jc2F5cGktdGFsa0J1dHRvbi5hdXRvU3VibWl0IC53YXZlZm9ybSB7XG4gIGZpbGw6IHJnYig2NSAxMzggNDcpOyAvKiBQaSdzIHRleHQtYnJhbmQtZ3JlZW4tNjAwICovXG59XG4uaGlkZGVuIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cbiNzYXlwaS1wbGF5QnV0dG9uLnBsYXktYnV0dG9uIHtcbiAgLyogcG9zaXRpb24gb3ZlciB0aGUgdGFsayBidXR0b24sIGJ1dCB1bmRlciBhbnkgY29udHJvbHMgKi9cbiAgei1pbmRleDogNzA7IC8qIHRhbGsgYnV0dG9uIHotaW5kZXggaXMgNTkgb3IgNjAgKi9cbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwKTsgLyogdHJhbnNwYXJlbnQgd2l0aG91dCBob2xlcyAqL1xuICBib3JkZXI6IG5vbmU7XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy90YWxrQnV0dG9uLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNFO0lBQ0UsbUJBQW1CO0VBQ3JCO0VBQ0E7SUFDRSxxQkFBcUI7RUFDdkI7RUFDQTtJQUNFLG1CQUFtQjtFQUNyQjtBQUNGO0FBQ0E7O0VBRUUsbUJBQW1CO0VBQ25CLG1CQUFtQjtFQUNuQixZQUFZO0VBQ1osY0FBYyxFQUFFLGVBQWU7QUFDakM7O0FBRUE7O0VBRUUsNEJBQTRCO0FBQzlCO0FBQ0E7RUFDRSxhQUFhO0FBQ2Y7QUFDQTtFQUNFLG9CQUFvQixFQUFFLDhCQUE4QjtBQUN0RDtBQUNBO0VBQ0UsYUFBYTtBQUNmO0FBQ0E7RUFDRSwwREFBMEQ7RUFDMUQsV0FBVyxFQUFFLG9DQUFvQztFQUNqRCxrQ0FBa0MsRUFBRSw4QkFBOEI7RUFDbEUsWUFBWTtBQUNkXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIkBrZXlmcmFtZXMgcHVsc2Uge1xcbiAgMCUge1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgfVxcbiAgNTAlIHtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwLjkpO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxufVxcbiNzYXlwaS10YWxrQnV0dG9uLFxcbi5wbGF5LWJ1dHRvbiB7XFxuICBtYXJnaW4tdG9wOiAwLjI1cmVtO1xcbiAgYm9yZGVyLXJhZGl1czogMThweDtcXG4gIHdpZHRoOiAxMjBweDtcXG4gIGRpc3BsYXk6IGJsb2NrOyAvKiBGb3IgU2FmYXJpICovXFxufVxcblxcbmh0bWw6bm90KC5maXJlZm94LWFuZHJvaWQpICNzYXlwaS10YWxrQnV0dG9uOmFjdGl2ZSAud2F2ZWZvcm0sXFxuI3NheXBpLXRhbGtCdXR0b24uYWN0aXZlIC53YXZlZm9ybSB7XFxuICBhbmltYXRpb246IHB1bHNlIDFzIGluZmluaXRlO1xcbn1cXG4jc2F5cGktdGFsa0J1dHRvbiAud2F2ZWZvcm0ge1xcbiAgZmlsbDogIzc3NmQ2ZDtcXG59XFxuI3NheXBpLXRhbGtCdXR0b24uYXV0b1N1Ym1pdCAud2F2ZWZvcm0ge1xcbiAgZmlsbDogcmdiKDY1IDEzOCA0Nyk7IC8qIFBpJ3MgdGV4dC1icmFuZC1ncmVlbi02MDAgKi9cXG59XFxuLmhpZGRlbiB7XFxuICBkaXNwbGF5OiBub25lO1xcbn1cXG4jc2F5cGktcGxheUJ1dHRvbi5wbGF5LWJ1dHRvbiB7XFxuICAvKiBwb3NpdGlvbiBvdmVyIHRoZSB0YWxrIGJ1dHRvbiwgYnV0IHVuZGVyIGFueSBjb250cm9scyAqL1xcbiAgei1pbmRleDogNzA7IC8qIHRhbGsgYnV0dG9uIHotaW5kZXggaXMgNTkgb3IgNjAgKi9cXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMCk7IC8qIHRyYW5zcGFyZW50IHdpdGhvdXQgaG9sZXMgKi9cXG4gIGJvcmRlcjogbm9uZTtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGBAbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgaHRtbC5tb2JpbGUtdmlldyB7XG4gICAgLyogUGkgY29udHJvbHM6IGVsbGlwc2lzLCBleHBlcmllbmNlcyAqL1xuICAgIC8qIFBpIGNvbnRyb2xzOiBtdXRlL3VubXV0ZSAqL1xuICB9XG4gIGh0bWwubW9iaWxlLXZpZXcgI3NheXBpLXBhbmVsLFxuICBodG1sLm1vYmlsZS12aWV3IC5wbGF5LWJ1dHRvbiB7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgcG9zaXRpb246IGZpeGVkO1xuICAgIGxlZnQ6IDA7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNDUsIDIzOCwgMjIzLCAwLjk4KTtcbiAgICBoZWlnaHQ6IDEwMHZoO1xuICAgIHRvcDogMDtcbiAgICBwYWRkaW5nOiA1JTtcbiAgfVxuICBodG1sLm1vYmlsZS12aWV3ICNzYXlwaS10YWxrQnV0dG9uIHtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBoZWlnaHQ6IDEwMCU7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgYm9yZGVyLXJhZGl1czogMDtcbiAgICBtYXJnaW46IDA7XG4gIH1cbiAgaHRtbC5tb2JpbGUtdmlldyAjX19uZXh0ID4gbWFpbiA+IGRpdiA+IGRpdiA+IGRpdi5maXhlZC50b3AtNC5yaWdodC02ID4gYnV0dG9uLFxuICBodG1sLm1vYmlsZS12aWV3ICNzYXlwaS1leHBlcmllbmNlcy1idXR0b24ge1xuICAgIHRyYW5zZm9ybTogc2NhbGUoMS41KTtcbiAgfVxuICBodG1sLm1vYmlsZS12aWV3ICNzYXlwaS1hdWRpby1jb250cm9scyB7XG4gICAgLyogaGlkZSB0aGUgdm9pY2Ugb3B0aW9ucyAqL1xuICAgIC8qIHNjYWxlIHRoZSBtdXRlIGJ1dHRvbiAqL1xuICB9XG4gIGh0bWwubW9iaWxlLXZpZXcgI3NheXBpLWF1ZGlvLWNvbnRyb2xzIGRpdi5wLTEge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gIH1cbiAgaHRtbC5tb2JpbGUtdmlldyAjc2F5cGktYXVkaW8tY29udHJvbHMgYnV0dG9uLmdyb3VwIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDIpICFpbXBvcnRhbnQ7XG4gICAgei1pbmRleDogNTA7XG4gICAgLyogaGlkZSB0aGUgdm9pY2Ugc2VsZWN0b3IgdHdpc3R5ICovXG4gIH1cbiAgaHRtbC5tb2JpbGUtdmlldyAjc2F5cGktYXVkaW8tY29udHJvbHMgYnV0dG9uLmdyb3VwICsgYnV0dG9uIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG4gIGh0bWwubW9iaWxlLXZpZXcgI3NheXBpLWV4aXRCdXR0b24ge1xuICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICB0b3A6IDEwcHg7XG4gICAgbGVmdDogMTJweDtcbiAgICB3aWR0aDogNTJweDtcbiAgICBoZWlnaHQ6IDUycHg7XG4gICAgcGFkZGluZzogNnB4O1xuICAgIGJvcmRlcjogMDtcbiAgICB6LWluZGV4OiA2MDtcbiAgfVxuICBodG1sLm1vYmlsZS12aWV3ICNzYXlwaS1mb290ZXIge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gIH1cbiAgaHRtbC5tb2JpbGUtdmlldyAjc2F5cGktcHJvbXB0IHtcbiAgICAvKiBoaWRlcyB2aXJ0dWFsIGtleWJvYXJkIG9uIGFuZHJvaWQgKi9cbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG59YCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvbW9iaWxlLnNjc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDRTtJQXFCRSx1Q0FBQTtJQU1BLDZCQUFBO0VBeEJGO0VBRkU7O0lBRUUsV0FBQTtJQUNBLGVBQUE7SUFDQSxPQUFBO0lBQ0EsMkNBQUE7SUFFQSxhQUFBO0lBQ0EsTUFBQTtJQUNBLFdBQUE7RUFHSjtFQUFFO0lBQ0UsV0FBQTtJQUNBLFlBQUE7SUFDQSw2QkFBQTtJQUNBLGdCQUFBO0lBQ0EsU0FBQTtFQUVKO0VBRUU7O0lBRUUscUJBQUE7RUFBSjtFQUlFO0lBQ0UsMkJBQUE7SUFJQSwwQkFBQTtFQUxKO0VBRUk7SUFDRSxhQUFBO0VBQU47RUFHSTtJQUNFLDhCQUFBO0lBQ0EsV0FBQTtJQUNBLG1DQUFBO0VBRE47RUFFTTtJQUNFLGFBQUE7RUFBUjtFQUtFO0lBQ0UsZUFBQTtJQUNBLFNBQUE7SUFDQSxVQUFBO0lBQ0EsV0FBQTtJQUNBLFlBQUE7SUFDQSxZQUFBO0lBQ0EsU0FBQTtJQUNBLFdBQUE7RUFISjtFQU1FO0lBQ0UsYUFBQTtFQUpKO0VBT0U7SUFDRSxzQ0FBQTtJQUNBLGFBQUE7RUFMSjtBQUNGXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xcbiAgaHRtbC5tb2JpbGUtdmlldyB7XFxuICAgICNzYXlwaS1wYW5lbCxcXG4gICAgLnBsYXktYnV0dG9uIHtcXG4gICAgICB3aWR0aDogMTAwJTtcXG4gICAgICBwb3NpdGlvbjogZml4ZWQ7XFxuICAgICAgbGVmdDogMDtcXG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI0NSwgMjM4LCAyMjMsIDAuOTgpO1xcblxcbiAgICAgIGhlaWdodDogMTAwdmg7XFxuICAgICAgdG9wOiAwO1xcbiAgICAgIHBhZGRpbmc6IDUlO1xcbiAgICB9XFxuXFxuICAgICNzYXlwaS10YWxrQnV0dG9uIHtcXG4gICAgICB3aWR0aDogMTAwJTtcXG4gICAgICBoZWlnaHQ6IDEwMCU7XFxuICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICAgICAgYm9yZGVyLXJhZGl1czogMDtcXG4gICAgICBtYXJnaW46IDA7XFxuICAgIH1cXG5cXG4gICAgLyogUGkgY29udHJvbHM6IGVsbGlwc2lzLCBleHBlcmllbmNlcyAqL1xcbiAgICAjX19uZXh0ID4gbWFpbiA+IGRpdiA+IGRpdiA+IGRpdi5maXhlZC50b3AtNC5yaWdodC02ID4gYnV0dG9uLFxcbiAgICAjc2F5cGktZXhwZXJpZW5jZXMtYnV0dG9uIHtcXG4gICAgICB0cmFuc2Zvcm06IHNjYWxlKDEuNSk7XFxuICAgIH1cXG5cXG4gICAgLyogUGkgY29udHJvbHM6IG11dGUvdW5tdXRlICovXFxuICAgICNzYXlwaS1hdWRpby1jb250cm9scyB7XFxuICAgICAgLyogaGlkZSB0aGUgdm9pY2Ugb3B0aW9ucyAqL1xcbiAgICAgIGRpdi5wLTEge1xcbiAgICAgICAgZGlzcGxheTogbm9uZTtcXG4gICAgICB9XFxuICAgICAgLyogc2NhbGUgdGhlIG11dGUgYnV0dG9uICovXFxuICAgICAgYnV0dG9uLmdyb3VwIHtcXG4gICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMikgIWltcG9ydGFudDtcXG4gICAgICAgIHotaW5kZXg6IDUwO1xcbiAgICAgICAgLyogaGlkZSB0aGUgdm9pY2Ugc2VsZWN0b3IgdHdpc3R5ICovXFxuICAgICAgICArIGJ1dHRvbiB7XFxuICAgICAgICAgIGRpc3BsYXk6IG5vbmU7XFxuICAgICAgICB9XFxuICAgICAgfVxcbiAgICB9XFxuXFxuICAgICNzYXlwaS1leGl0QnV0dG9uIHtcXG4gICAgICBwb3NpdGlvbjogZml4ZWQ7XFxuICAgICAgdG9wOiAxMHB4O1xcbiAgICAgIGxlZnQ6IDEycHg7XFxuICAgICAgd2lkdGg6IDUycHg7XFxuICAgICAgaGVpZ2h0OiA1MnB4O1xcbiAgICAgIHBhZGRpbmc6IDZweDtcXG4gICAgICBib3JkZXI6IDA7XFxuICAgICAgei1pbmRleDogNjA7XFxuICAgIH1cXG5cXG4gICAgI3NheXBpLWZvb3RlciB7XFxuICAgICAgZGlzcGxheTogbm9uZTtcXG4gICAgfVxcblxcbiAgICAjc2F5cGktcHJvbXB0IHtcXG4gICAgICAvKiBoaWRlcyB2aXJ0dWFsIGtleWJvYXJkIG9uIGFuZHJvaWQgKi9cXG4gICAgICBkaXNwbGF5OiBub25lO1xcbiAgICB9XFxuICB9XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFIgPSB0eXBlb2YgUmVmbGVjdCA9PT0gJ29iamVjdCcgPyBSZWZsZWN0IDogbnVsbFxudmFyIFJlZmxlY3RBcHBseSA9IFIgJiYgdHlwZW9mIFIuYXBwbHkgPT09ICdmdW5jdGlvbidcbiAgPyBSLmFwcGx5XG4gIDogZnVuY3Rpb24gUmVmbGVjdEFwcGx5KHRhcmdldCwgcmVjZWl2ZXIsIGFyZ3MpIHtcbiAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwodGFyZ2V0LCByZWNlaXZlciwgYXJncyk7XG4gIH1cblxudmFyIFJlZmxlY3RPd25LZXlzXG5pZiAoUiAmJiB0eXBlb2YgUi5vd25LZXlzID09PSAnZnVuY3Rpb24nKSB7XG4gIFJlZmxlY3RPd25LZXlzID0gUi5vd25LZXlzXG59IGVsc2UgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcbiAgUmVmbGVjdE93bktleXMgPSBmdW5jdGlvbiBSZWZsZWN0T3duS2V5cyh0YXJnZXQpIHtcbiAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGFyZ2V0KVxuICAgICAgLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHRhcmdldCkpO1xuICB9O1xufSBlbHNlIHtcbiAgUmVmbGVjdE93bktleXMgPSBmdW5jdGlvbiBSZWZsZWN0T3duS2V5cyh0YXJnZXQpIHtcbiAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGFyZ2V0KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gUHJvY2Vzc0VtaXRXYXJuaW5nKHdhcm5pbmcpIHtcbiAgaWYgKGNvbnNvbGUgJiYgY29uc29sZS53YXJuKSBjb25zb2xlLndhcm4od2FybmluZyk7XG59XG5cbnZhciBOdW1iZXJJc05hTiA9IE51bWJlci5pc05hTiB8fCBmdW5jdGlvbiBOdW1iZXJJc05hTih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT09IHZhbHVlO1xufVxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIEV2ZW50RW1pdHRlci5pbml0LmNhbGwodGhpcyk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcbm1vZHVsZS5leHBvcnRzLm9uY2UgPSBvbmNlO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50c0NvdW50ID0gMDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxudmFyIGRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuZnVuY3Rpb24gY2hlY2tMaXN0ZW5lcihsaXN0ZW5lcikge1xuICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwibGlzdGVuZXJcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgRnVuY3Rpb24uIFJlY2VpdmVkIHR5cGUgJyArIHR5cGVvZiBsaXN0ZW5lcik7XG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KEV2ZW50RW1pdHRlciwgJ2RlZmF1bHRNYXhMaXN0ZW5lcnMnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gIH0sXG4gIHNldDogZnVuY3Rpb24oYXJnKSB7XG4gICAgaWYgKHR5cGVvZiBhcmcgIT09ICdudW1iZXInIHx8IGFyZyA8IDAgfHwgTnVtYmVySXNOYU4oYXJnKSkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RoZSB2YWx1ZSBvZiBcImRlZmF1bHRNYXhMaXN0ZW5lcnNcIiBpcyBvdXQgb2YgcmFuZ2UuIEl0IG11c3QgYmUgYSBub24tbmVnYXRpdmUgbnVtYmVyLiBSZWNlaXZlZCAnICsgYXJnICsgJy4nKTtcbiAgICB9XG4gICAgZGVmYXVsdE1heExpc3RlbmVycyA9IGFyZztcbiAgfVxufSk7XG5cbkV2ZW50RW1pdHRlci5pbml0ID0gZnVuY3Rpb24oKSB7XG5cbiAgaWYgKHRoaXMuX2V2ZW50cyA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICB0aGlzLl9ldmVudHMgPT09IE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzKS5fZXZlbnRzKSB7XG4gICAgdGhpcy5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG4gIH1cblxuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufTtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24gc2V0TWF4TGlzdGVuZXJzKG4pIHtcbiAgaWYgKHR5cGVvZiBuICE9PSAnbnVtYmVyJyB8fCBuIDwgMCB8fCBOdW1iZXJJc05hTihuKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdUaGUgdmFsdWUgb2YgXCJuXCIgaXMgb3V0IG9mIHJhbmdlLiBJdCBtdXN0IGJlIGEgbm9uLW5lZ2F0aXZlIG51bWJlci4gUmVjZWl2ZWQgJyArIG4gKyAnLicpO1xuICB9XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuZnVuY3Rpb24gX2dldE1heExpc3RlbmVycyh0aGF0KSB7XG4gIGlmICh0aGF0Ll9tYXhMaXN0ZW5lcnMgPT09IHVuZGVmaW5lZClcbiAgICByZXR1cm4gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gIHJldHVybiB0aGF0Ll9tYXhMaXN0ZW5lcnM7XG59XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZ2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24gZ2V0TWF4TGlzdGVuZXJzKCkge1xuICByZXR1cm4gX2dldE1heExpc3RlbmVycyh0aGlzKTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIGVtaXQodHlwZSkge1xuICB2YXIgYXJncyA9IFtdO1xuICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgYXJncy5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gIHZhciBkb0Vycm9yID0gKHR5cGUgPT09ICdlcnJvcicpO1xuXG4gIHZhciBldmVudHMgPSB0aGlzLl9ldmVudHM7XG4gIGlmIChldmVudHMgIT09IHVuZGVmaW5lZClcbiAgICBkb0Vycm9yID0gKGRvRXJyb3IgJiYgZXZlbnRzLmVycm9yID09PSB1bmRlZmluZWQpO1xuICBlbHNlIGlmICghZG9FcnJvcilcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAoZG9FcnJvcikge1xuICAgIHZhciBlcjtcbiAgICBpZiAoYXJncy5sZW5ndGggPiAwKVxuICAgICAgZXIgPSBhcmdzWzBdO1xuICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAvLyBOb3RlOiBUaGUgY29tbWVudHMgb24gdGhlIGB0aHJvd2AgbGluZXMgYXJlIGludGVudGlvbmFsLCB0aGV5IHNob3dcbiAgICAgIC8vIHVwIGluIE5vZGUncyBvdXRwdXQgaWYgdGhpcyByZXN1bHRzIGluIGFuIHVuaGFuZGxlZCBleGNlcHRpb24uXG4gICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICB9XG4gICAgLy8gQXQgbGVhc3QgZ2l2ZSBzb21lIGtpbmQgb2YgY29udGV4dCB0byB0aGUgdXNlclxuICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoJ1VuaGFuZGxlZCBlcnJvci4nICsgKGVyID8gJyAoJyArIGVyLm1lc3NhZ2UgKyAnKScgOiAnJykpO1xuICAgIGVyci5jb250ZXh0ID0gZXI7XG4gICAgdGhyb3cgZXJyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICB9XG5cbiAgdmFyIGhhbmRsZXIgPSBldmVudHNbdHlwZV07XG5cbiAgaWYgKGhhbmRsZXIgPT09IHVuZGVmaW5lZClcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHR5cGVvZiBoYW5kbGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgUmVmbGVjdEFwcGx5KGhhbmRsZXIsIHRoaXMsIGFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIHZhciBsZW4gPSBoYW5kbGVyLmxlbmd0aDtcbiAgICB2YXIgbGlzdGVuZXJzID0gYXJyYXlDbG9uZShoYW5kbGVyLCBsZW4pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpXG4gICAgICBSZWZsZWN0QXBwbHkobGlzdGVuZXJzW2ldLCB0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuZnVuY3Rpb24gX2FkZExpc3RlbmVyKHRhcmdldCwgdHlwZSwgbGlzdGVuZXIsIHByZXBlbmQpIHtcbiAgdmFyIG07XG4gIHZhciBldmVudHM7XG4gIHZhciBleGlzdGluZztcblxuICBjaGVja0xpc3RlbmVyKGxpc3RlbmVyKTtcblxuICBldmVudHMgPSB0YXJnZXQuX2V2ZW50cztcbiAgaWYgKGV2ZW50cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZXZlbnRzID0gdGFyZ2V0Ll9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHRhcmdldC5fZXZlbnRzQ291bnQgPSAwO1xuICB9IGVsc2Uge1xuICAgIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gICAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICAgIGlmIChldmVudHMubmV3TGlzdGVuZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGFyZ2V0LmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyID8gbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgICAgIC8vIFJlLWFzc2lnbiBgZXZlbnRzYCBiZWNhdXNlIGEgbmV3TGlzdGVuZXIgaGFuZGxlciBjb3VsZCBoYXZlIGNhdXNlZCB0aGVcbiAgICAgIC8vIHRoaXMuX2V2ZW50cyB0byBiZSBhc3NpZ25lZCB0byBhIG5ldyBvYmplY3RcbiAgICAgIGV2ZW50cyA9IHRhcmdldC5fZXZlbnRzO1xuICAgIH1cbiAgICBleGlzdGluZyA9IGV2ZW50c1t0eXBlXTtcbiAgfVxuXG4gIGlmIChleGlzdGluZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgZXhpc3RpbmcgPSBldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgICArK3RhcmdldC5fZXZlbnRzQ291bnQ7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHR5cGVvZiBleGlzdGluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgICBleGlzdGluZyA9IGV2ZW50c1t0eXBlXSA9XG4gICAgICAgIHByZXBlbmQgPyBbbGlzdGVuZXIsIGV4aXN0aW5nXSA6IFtleGlzdGluZywgbGlzdGVuZXJdO1xuICAgICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIH0gZWxzZSBpZiAocHJlcGVuZCkge1xuICAgICAgZXhpc3RpbmcudW5zaGlmdChsaXN0ZW5lcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGV4aXN0aW5nLnB1c2gobGlzdGVuZXIpO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gICAgbSA9IF9nZXRNYXhMaXN0ZW5lcnModGFyZ2V0KTtcbiAgICBpZiAobSA+IDAgJiYgZXhpc3RpbmcubGVuZ3RoID4gbSAmJiAhZXhpc3Rpbmcud2FybmVkKSB7XG4gICAgICBleGlzdGluZy53YXJuZWQgPSB0cnVlO1xuICAgICAgLy8gTm8gZXJyb3IgY29kZSBmb3IgdGhpcyBzaW5jZSBpdCBpcyBhIFdhcm5pbmdcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLXN5bnRheFxuICAgICAgdmFyIHcgPSBuZXcgRXJyb3IoJ1Bvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgbGVhayBkZXRlY3RlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nLmxlbmd0aCArICcgJyArIFN0cmluZyh0eXBlKSArICcgbGlzdGVuZXJzICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnYWRkZWQuIFVzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnaW5jcmVhc2UgbGltaXQnKTtcbiAgICAgIHcubmFtZSA9ICdNYXhMaXN0ZW5lcnNFeGNlZWRlZFdhcm5pbmcnO1xuICAgICAgdy5lbWl0dGVyID0gdGFyZ2V0O1xuICAgICAgdy50eXBlID0gdHlwZTtcbiAgICAgIHcuY291bnQgPSBleGlzdGluZy5sZW5ndGg7XG4gICAgICBQcm9jZXNzRW1pdFdhcm5pbmcodyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uIGFkZExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHJldHVybiBfYWRkTGlzdGVuZXIodGhpcywgdHlwZSwgbGlzdGVuZXIsIGZhbHNlKTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnByZXBlbmRMaXN0ZW5lciA9XG4gICAgZnVuY3Rpb24gcHJlcGVuZExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgICByZXR1cm4gX2FkZExpc3RlbmVyKHRoaXMsIHR5cGUsIGxpc3RlbmVyLCB0cnVlKTtcbiAgICB9O1xuXG5mdW5jdGlvbiBvbmNlV3JhcHBlcigpIHtcbiAgaWYgKCF0aGlzLmZpcmVkKSB7XG4gICAgdGhpcy50YXJnZXQucmVtb3ZlTGlzdGVuZXIodGhpcy50eXBlLCB0aGlzLndyYXBGbik7XG4gICAgdGhpcy5maXJlZCA9IHRydWU7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICByZXR1cm4gdGhpcy5saXN0ZW5lci5jYWxsKHRoaXMudGFyZ2V0KTtcbiAgICByZXR1cm4gdGhpcy5saXN0ZW5lci5hcHBseSh0aGlzLnRhcmdldCwgYXJndW1lbnRzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfb25jZVdyYXAodGFyZ2V0LCB0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgc3RhdGUgPSB7IGZpcmVkOiBmYWxzZSwgd3JhcEZuOiB1bmRlZmluZWQsIHRhcmdldDogdGFyZ2V0LCB0eXBlOiB0eXBlLCBsaXN0ZW5lcjogbGlzdGVuZXIgfTtcbiAgdmFyIHdyYXBwZWQgPSBvbmNlV3JhcHBlci5iaW5kKHN0YXRlKTtcbiAgd3JhcHBlZC5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICBzdGF0ZS53cmFwRm4gPSB3cmFwcGVkO1xuICByZXR1cm4gd3JhcHBlZDtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24gb25jZSh0eXBlLCBsaXN0ZW5lcikge1xuICBjaGVja0xpc3RlbmVyKGxpc3RlbmVyKTtcbiAgdGhpcy5vbih0eXBlLCBfb25jZVdyYXAodGhpcywgdHlwZSwgbGlzdGVuZXIpKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnByZXBlbmRPbmNlTGlzdGVuZXIgPVxuICAgIGZ1bmN0aW9uIHByZXBlbmRPbmNlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgIGNoZWNrTGlzdGVuZXIobGlzdGVuZXIpO1xuICAgICAgdGhpcy5wcmVwZW5kTGlzdGVuZXIodHlwZSwgX29uY2VXcmFwKHRoaXMsIHR5cGUsIGxpc3RlbmVyKSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4vLyBFbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWYgYW5kIG9ubHkgaWYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9XG4gICAgZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgIHZhciBsaXN0LCBldmVudHMsIHBvc2l0aW9uLCBpLCBvcmlnaW5hbExpc3RlbmVyO1xuXG4gICAgICBjaGVja0xpc3RlbmVyKGxpc3RlbmVyKTtcblxuICAgICAgZXZlbnRzID0gdGhpcy5fZXZlbnRzO1xuICAgICAgaWYgKGV2ZW50cyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgbGlzdCA9IGV2ZW50c1t0eXBlXTtcbiAgICAgIGlmIChsaXN0ID09PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHwgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpIHtcbiAgICAgICAgaWYgKC0tdGhpcy5fZXZlbnRzQ291bnQgPT09IDApXG4gICAgICAgICAgdGhpcy5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZGVsZXRlIGV2ZW50c1t0eXBlXTtcbiAgICAgICAgICBpZiAoZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3QubGlzdGVuZXIgfHwgbGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBsaXN0ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHBvc2l0aW9uID0gLTE7XG5cbiAgICAgICAgZm9yIChpID0gbGlzdC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fCBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikge1xuICAgICAgICAgICAgb3JpZ2luYWxMaXN0ZW5lciA9IGxpc3RbaV0ubGlzdGVuZXI7XG4gICAgICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICAgIGlmIChwb3NpdGlvbiA9PT0gMClcbiAgICAgICAgICBsaXN0LnNoaWZ0KCk7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHNwbGljZU9uZShsaXN0LCBwb3NpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpXG4gICAgICAgICAgZXZlbnRzW3R5cGVdID0gbGlzdFswXTtcblxuICAgICAgICBpZiAoZXZlbnRzLnJlbW92ZUxpc3RlbmVyICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIG9yaWdpbmFsTGlzdGVuZXIgfHwgbGlzdGVuZXIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9mZiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID1cbiAgICBmdW5jdGlvbiByZW1vdmVBbGxMaXN0ZW5lcnModHlwZSkge1xuICAgICAgdmFyIGxpc3RlbmVycywgZXZlbnRzLCBpO1xuXG4gICAgICBldmVudHMgPSB0aGlzLl9ldmVudHM7XG4gICAgICBpZiAoZXZlbnRzID09PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gICAgICBpZiAoZXZlbnRzLnJlbW92ZUxpc3RlbmVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICB0aGlzLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICAgIHRoaXMuX2V2ZW50c0NvdW50ID0gMDtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudHNbdHlwZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmICgtLXRoaXMuX2V2ZW50c0NvdW50ID09PSAwKVxuICAgICAgICAgICAgdGhpcy5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBkZWxldGUgZXZlbnRzW3R5cGVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZXZlbnRzKTtcbiAgICAgICAgdmFyIGtleTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGtleXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICBrZXkgPSBrZXlzW2ldO1xuICAgICAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgICAgIHRoaXMuX2V2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIHRoaXMuX2V2ZW50c0NvdW50ID0gMDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIGxpc3RlbmVycyA9IGV2ZW50c1t0eXBlXTtcblxuICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lcnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICAgICAgfSBlbHNlIGlmIChsaXN0ZW5lcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBMSUZPIG9yZGVyXG4gICAgICAgIGZvciAoaSA9IGxpc3RlbmVycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG5mdW5jdGlvbiBfbGlzdGVuZXJzKHRhcmdldCwgdHlwZSwgdW53cmFwKSB7XG4gIHZhciBldmVudHMgPSB0YXJnZXQuX2V2ZW50cztcblxuICBpZiAoZXZlbnRzID09PSB1bmRlZmluZWQpXG4gICAgcmV0dXJuIFtdO1xuXG4gIHZhciBldmxpc3RlbmVyID0gZXZlbnRzW3R5cGVdO1xuICBpZiAoZXZsaXN0ZW5lciA9PT0gdW5kZWZpbmVkKVxuICAgIHJldHVybiBbXTtcblxuICBpZiAodHlwZW9mIGV2bGlzdGVuZXIgPT09ICdmdW5jdGlvbicpXG4gICAgcmV0dXJuIHVud3JhcCA/IFtldmxpc3RlbmVyLmxpc3RlbmVyIHx8IGV2bGlzdGVuZXJdIDogW2V2bGlzdGVuZXJdO1xuXG4gIHJldHVybiB1bndyYXAgP1xuICAgIHVud3JhcExpc3RlbmVycyhldmxpc3RlbmVyKSA6IGFycmF5Q2xvbmUoZXZsaXN0ZW5lciwgZXZsaXN0ZW5lci5sZW5ndGgpO1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uIGxpc3RlbmVycyh0eXBlKSB7XG4gIHJldHVybiBfbGlzdGVuZXJzKHRoaXMsIHR5cGUsIHRydWUpO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yYXdMaXN0ZW5lcnMgPSBmdW5jdGlvbiByYXdMaXN0ZW5lcnModHlwZSkge1xuICByZXR1cm4gX2xpc3RlbmVycyh0aGlzLCB0eXBlLCBmYWxzZSk7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgaWYgKHR5cGVvZiBlbWl0dGVyLmxpc3RlbmVyQ291bnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZW1pdHRlci5saXN0ZW5lckNvdW50KHR5cGUpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBsaXN0ZW5lckNvdW50LmNhbGwoZW1pdHRlciwgdHlwZSk7XG4gIH1cbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJDb3VudCA9IGxpc3RlbmVyQ291bnQ7XG5mdW5jdGlvbiBsaXN0ZW5lckNvdW50KHR5cGUpIHtcbiAgdmFyIGV2ZW50cyA9IHRoaXMuX2V2ZW50cztcblxuICBpZiAoZXZlbnRzICE9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgZXZsaXN0ZW5lciA9IGV2ZW50c1t0eXBlXTtcblxuICAgIGlmICh0eXBlb2YgZXZsaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIDE7XG4gICAgfSBlbHNlIGlmIChldmxpc3RlbmVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBldmxpc3RlbmVyLmxlbmd0aDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gMDtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5ldmVudE5hbWVzID0gZnVuY3Rpb24gZXZlbnROYW1lcygpIHtcbiAgcmV0dXJuIHRoaXMuX2V2ZW50c0NvdW50ID4gMCA/IFJlZmxlY3RPd25LZXlzKHRoaXMuX2V2ZW50cykgOiBbXTtcbn07XG5cbmZ1bmN0aW9uIGFycmF5Q2xvbmUoYXJyLCBuKSB7XG4gIHZhciBjb3B5ID0gbmV3IEFycmF5KG4pO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG47ICsraSlcbiAgICBjb3B5W2ldID0gYXJyW2ldO1xuICByZXR1cm4gY29weTtcbn1cblxuZnVuY3Rpb24gc3BsaWNlT25lKGxpc3QsIGluZGV4KSB7XG4gIGZvciAoOyBpbmRleCArIDEgPCBsaXN0Lmxlbmd0aDsgaW5kZXgrKylcbiAgICBsaXN0W2luZGV4XSA9IGxpc3RbaW5kZXggKyAxXTtcbiAgbGlzdC5wb3AoKTtcbn1cblxuZnVuY3Rpb24gdW53cmFwTGlzdGVuZXJzKGFycikge1xuICB2YXIgcmV0ID0gbmV3IEFycmF5KGFyci5sZW5ndGgpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHJldC5sZW5ndGg7ICsraSkge1xuICAgIHJldFtpXSA9IGFycltpXS5saXN0ZW5lciB8fCBhcnJbaV07XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxuZnVuY3Rpb24gb25jZShlbWl0dGVyLCBuYW1lKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgZnVuY3Rpb24gZXJyb3JMaXN0ZW5lcihlcnIpIHtcbiAgICAgIGVtaXR0ZXIucmVtb3ZlTGlzdGVuZXIobmFtZSwgcmVzb2x2ZXIpO1xuICAgICAgcmVqZWN0KGVycik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzb2x2ZXIoKSB7XG4gICAgICBpZiAodHlwZW9mIGVtaXR0ZXIucmVtb3ZlTGlzdGVuZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZW1pdHRlci5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBlcnJvckxpc3RlbmVyKTtcbiAgICAgIH1cbiAgICAgIHJlc29sdmUoW10uc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcbiAgICB9O1xuXG4gICAgZXZlbnRUYXJnZXRBZ25vc3RpY0FkZExpc3RlbmVyKGVtaXR0ZXIsIG5hbWUsIHJlc29sdmVyLCB7IG9uY2U6IHRydWUgfSk7XG4gICAgaWYgKG5hbWUgIT09ICdlcnJvcicpIHtcbiAgICAgIGFkZEVycm9ySGFuZGxlcklmRXZlbnRFbWl0dGVyKGVtaXR0ZXIsIGVycm9yTGlzdGVuZXIsIHsgb25jZTogdHJ1ZSB9KTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRFcnJvckhhbmRsZXJJZkV2ZW50RW1pdHRlcihlbWl0dGVyLCBoYW5kbGVyLCBmbGFncykge1xuICBpZiAodHlwZW9mIGVtaXR0ZXIub24gPT09ICdmdW5jdGlvbicpIHtcbiAgICBldmVudFRhcmdldEFnbm9zdGljQWRkTGlzdGVuZXIoZW1pdHRlciwgJ2Vycm9yJywgaGFuZGxlciwgZmxhZ3MpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGV2ZW50VGFyZ2V0QWdub3N0aWNBZGRMaXN0ZW5lcihlbWl0dGVyLCBuYW1lLCBsaXN0ZW5lciwgZmxhZ3MpIHtcbiAgaWYgKHR5cGVvZiBlbWl0dGVyLm9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgaWYgKGZsYWdzLm9uY2UpIHtcbiAgICAgIGVtaXR0ZXIub25jZShuYW1lLCBsaXN0ZW5lcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVtaXR0ZXIub24obmFtZSwgbGlzdGVuZXIpO1xuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgZW1pdHRlci5hZGRFdmVudExpc3RlbmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gRXZlbnRUYXJnZXQgZG9lcyBub3QgaGF2ZSBgZXJyb3JgIGV2ZW50IHNlbWFudGljcyBsaWtlIE5vZGVcbiAgICAvLyBFdmVudEVtaXR0ZXJzLCB3ZSBkbyBub3QgbGlzdGVuIGZvciBgZXJyb3JgIGV2ZW50cyBoZXJlLlxuICAgIGVtaXR0ZXIuYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBmdW5jdGlvbiB3cmFwTGlzdGVuZXIoYXJnKSB7XG4gICAgICAvLyBJRSBkb2VzIG5vdCBoYXZlIGJ1aWx0aW4gYHsgb25jZTogdHJ1ZSB9YCBzdXBwb3J0IHNvIHdlXG4gICAgICAvLyBoYXZlIHRvIGRvIGl0IG1hbnVhbGx5LlxuICAgICAgaWYgKGZsYWdzLm9uY2UpIHtcbiAgICAgICAgZW1pdHRlci5yZW1vdmVFdmVudExpc3RlbmVyKG5hbWUsIHdyYXBMaXN0ZW5lcik7XG4gICAgICB9XG4gICAgICBsaXN0ZW5lcihhcmcpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImVtaXR0ZXJcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgRXZlbnRFbWl0dGVyLiBSZWNlaXZlZCB0eXBlICcgKyB0eXBlb2YgZW1pdHRlcik7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IFwiLy8gZGVwZW5kcyBvbiB0aGUgaW5qZWN0aW5nIHNjcmlwdCAoc2F5cGkuaW5kZXguanMpIGRlY2xhcmluZyB0aGUgRXZlbnRCdXMgYXMgYSBnbG9iYWwgdmFyaWFibGVcXG52YXIgRXZlbnRCdXMgPSB3aW5kb3cuRXZlbnRCdXM7XFxuXFxuLy8gYXVkaW8gb3V0cHV0IChQaSlcXG52YXIgYXVkaW9FbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcXFwiYXVkaW9cXFwiKTtcXG5pZiAoIWF1ZGlvRWxlbWVudCkge1xcbiAgY29uc29sZS5lcnJvcihcXFwiQXVkaW8gZWxlbWVudCBub3QgZm91bmQhXFxcIik7XFxufVxcblxcbi8vIFRPRE86IGRlZHVwZSB0aGlzIGZ1bmN0aW9uIGZyb20gRXZlbnRNb2R1bGUuanNcXG5mdW5jdGlvbiBpc1NhZmFyaSgpIHtcXG4gIHJldHVybiAvXigoPyFjaHJvbWV8YW5kcm9pZCkuKSpzYWZhcmkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xcbn1cXG5hdWRpb0VsZW1lbnQucHJlbG9hZCA9IFxcXCJhdXRvXFxcIjsgLy8gZW5hYmxlIGFnZ3Jlc3NpdmUgcHJlbG9hZGluZyBvZiBhdWRpb1xcbnZhciBwaUF1ZGlvTWFuYWdlciA9IHtcXG4gIGlzU3BlYWtpbmc6IGZhbHNlLFxcbiAgYXVkaW9FbGVtZW50OiBhdWRpb0VsZW1lbnQsXFxuICBfdXNlclN0YXJ0ZWQ6IHRydWUsXFxuICAvLyBmbGFnIHRvIGluZGljYXRlIHBsYXliYWNrIGhhcyBiZWVuIHN0YXJ0ZWQgYnkgdGhlIHVzZXIgKHRydWUgYnkgZGVmYXVsdCBiZWNhdXNlIHVzZXIgbXVzdCByZXF1ZXN0IGluaXRpYWwgcGxheWJhY2spXFxuICBfaXNMb2FkQ2FsbGVkOiBmYWxzZSxcXG4gIC8vIGZsYWcgdG8gaW5kaWNhdGUgaWYgdGhlIGxvYWQoKSBtZXRob2QgaGFzIGJlZW4gY2FsbGVkIG9uIHRoZSBhdWRpbyBlbGVtZW50XFxuXFxuICBpc0xvYWRDYWxsZWQ6IGZ1bmN0aW9uIGlzTG9hZENhbGxlZCgpIHtcXG4gICAgcmV0dXJuIHRoaXMuX2lzTG9hZENhbGxlZDtcXG4gIH0sXFxuICBzZXRJc0xvYWRDYWxsZWQ6IGZ1bmN0aW9uIHNldElzTG9hZENhbGxlZCh2YWx1ZSkge1xcbiAgICB0aGlzLl9pc0xvYWRDYWxsZWQgPSB2YWx1ZTtcXG4gIH0sXFxuICByZWxvYWQ6IGZ1bmN0aW9uIHJlbG9hZCgpIHtcXG4gICAgaWYgKCFpc1NhZmFyaSgpKSB7XFxuICAgICAgcmV0dXJuO1xcbiAgICB9XFxuICAgIHRoaXMuX3VzZXJTdGFydGVkID0gdHJ1ZTsgLy8gc2V0IGEgZmxhZyB0byBpbmRpY2F0ZSBwbGF5YmFjayBoYXMgYmVlbiBzdGFydGVkIGJ5IHRoZSB1c2VyXFxuICAgIHRoaXMuYXVkaW9FbGVtZW50LmxvYWQoKTsgLy8gcmVzZXQgZm9yIFNhZmFyaVxcbiAgICB0aGlzLmF1ZGlvRWxlbWVudC5wbGF5KCk7XFxuICB9LFxcbiAgYXV0b1BsYXk6IGZ1bmN0aW9uIGF1dG9QbGF5KCkge1xcbiAgICBpZiAoIXRoaXMuX3VzZXJTdGFydGVkKSB7XFxuICAgICAgdGhpcy5hdWRpb0VsZW1lbnQucGF1c2UoKTtcXG4gICAgICBFdmVudEJ1cy5lbWl0KFxcXCJzYXlwaTpwYXVzZVxcXCIpO1xcbiAgICB9XFxuICB9LFxcbiAgc3RvcDogZnVuY3Rpb24gc3RvcCgpIHtcXG4gICAgaWYgKHRoaXMuaXNTcGVha2luZykge1xcbiAgICAgIHRoaXMuYXVkaW9FbGVtZW50LnBhdXNlKCk7XFxuICAgIH1cXG4gICAgaWYgKHRoaXMuYXVkaW9FbGVtZW50LmR1cmF0aW9uICYmICF0aGlzLmF1ZGlvRWxlbWVudC5lbmRlZCAmJiB0aGlzLmF1ZGlvRWxlbWVudC5jdXJyZW50VGltZSA8IHRoaXMuYXVkaW9FbGVtZW50LmR1cmF0aW9uKSB7XFxuICAgICAgdGhpcy5hdWRpb0VsZW1lbnQuY3VycmVudFRpbWUgPSB0aGlzLmF1ZGlvRWxlbWVudC5kdXJhdGlvbjsgLy8gc2VlayB0aGUgYXVkaW8gdG8gdGhlIGVuZFxcbiAgICAgIHRoaXMuYXVkaW9FbGVtZW50LnBsYXkoKTsgLy8gdHJpZ2dlciB0aGUgZW5kZWQgZXZlbnRcXG4gICAgfVxcbiAgfSxcXG5cXG4gIHBhdXNlOiBmdW5jdGlvbiBwYXVzZSgpIHtcXG4gICAgdGhpcy5hdWRpb0VsZW1lbnQucGF1c2UoKTtcXG4gIH0sXFxuICByZXN1bWU6IGZ1bmN0aW9uIHJlc3VtZSgpIHtcXG4gICAgdGhpcy5hdWRpb0VsZW1lbnQucGxheSgpO1xcbiAgfSxcXG4gIHBsYXlpbmc6IGZ1bmN0aW9uIHBsYXlpbmcoKSB7XFxuICAgIHRoaXMuaXNTcGVha2luZyA9IHRydWU7XFxuICB9LFxcbiAgc3RvcHBlZDogZnVuY3Rpb24gc3RvcHBlZCgpIHtcXG4gICAgdGhpcy5pc1NwZWFraW5nID0gZmFsc2U7XFxuICAgIHRoaXMuX3VzZXJTdGFydGVkID0gZmFsc2U7XFxuICB9XFxufTtcXG5cXG4vLyBJbnRlcmNlcHQgQXV0b3BsYXkgRXZlbnRzIChjYW4ndCBhdXRvcGxheSBmdWxsIGF1ZGlvIG9uIFNhZmFyaSlcXG5hdWRpb0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcXFwicGxheVxcXCIsIGZ1bmN0aW9uICgpIHtcXG4gIGlmIChpc1NhZmFyaSgpKSB7XFxuICAgIHBpQXVkaW9NYW5hZ2VyLmF1dG9QbGF5KCk7XFxuICB9XFxufSk7XFxuYXVkaW9FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXFxcImxvYWRzdGFydFxcXCIsIGZ1bmN0aW9uICgpIHtcXG4gIGlmIChpc1NhZmFyaSgpKSB7XFxuICAgIC8vIHRlbGwgdGhlIHN0YXRlIG1hY2hpbmUgdGhhdCBQaSBpcyByZWFkeSB0byBzcGVhayAod2hpbGUgcGF1c2VkKVxcbiAgICBFdmVudEJ1cy5lbWl0KFxcXCJzYXlwaTpyZWFkeVxcXCIpO1xcbiAgfVxcbn0pO1xcblxcbi8vIEV2ZW50IGxpc3RlbmVycyBmb3IgZGV0ZWN0aW5nIHdoZW4gUGkgaXMgc3BlYWtpbmdcXG5hdWRpb0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcXFwicGxheWluZ1xcXCIsIGZ1bmN0aW9uICgpIHtcXG4gIHBpQXVkaW9NYW5hZ2VyLnBsYXlpbmcoKTtcXG4gIEV2ZW50QnVzLmVtaXQoXFxcInNheXBpOnBpU3BlYWtpbmdcXFwiKTtcXG59KTtcXG5hdWRpb0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcXFwicGF1c2VcXFwiLCBmdW5jdGlvbiAoKSB7XFxuICBwaUF1ZGlvTWFuYWdlci5zdG9wcGVkKCk7XFxuICBFdmVudEJ1cy5lbWl0KFxcXCJzYXlwaTpwaVN0b3BwZWRTcGVha2luZ1xcXCIpO1xcbn0pO1xcbmF1ZGlvRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFxcXCJlbmRlZFxcXCIsIGZ1bmN0aW9uICgpIHtcXG4gIHBpQXVkaW9NYW5hZ2VyLnN0b3BwZWQoKTtcXG4gIEV2ZW50QnVzLmVtaXQoXFxcInNheXBpOnBpRmluaXNoZWRTcGVha2luZ1xcXCIpO1xcbn0pO1xcblxcbi8vIGF1ZGlvIGlucHV0ICh1c2VyKVxcbnZhciBhdWRpb0RhdGFDaHVua3MgPSBbXTtcXG52YXIgYXVkaW9NaW1lVHlwZSA9IFxcXCJhdWRpby93ZWJtO2NvZGVjcz1vcHVzXFxcIjtcXG5cXG4vLyBEZWNsYXJlIGEgZ2xvYmFsIHZhcmlhYmxlIGZvciB0aGUgbWVkaWFSZWNvcmRlclxcbnZhciBtZWRpYVJlY29yZGVyO1xcbnZhciB0aHJlc2hvbGQgPSAxMDAwOyAvLyAxMDAwIG1zID0gMSBzZWNvbmQsIGFib3V0IHRoZSBsZW5ndGggb2YgXFxcIkhleSwgUGlcXFwiXFxuXFxuLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSAnZGF0YWF2YWlsYWJsZScgZXZlbnQgZmlyZXNcXG5mdW5jdGlvbiBoYW5kbGVEYXRhQXZhaWxhYmxlKGUpIHtcXG4gIC8vIEFkZCB0aGUgYXVkaW8gZGF0YSBjaHVuayB0byB0aGUgYXJyYXlcXG4gIGF1ZGlvRGF0YUNodW5rcy5wdXNoKGUuZGF0YSk7XFxufVxcblxcbi8vIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgJ3N0b3AnIGV2ZW50IGZpcmVzXFxuZnVuY3Rpb24gaGFuZGxlU3RvcCgpIHtcXG4gIC8vIENyZWF0ZSBhIEJsb2IgZnJvbSB0aGUgYXVkaW8gZGF0YSBjaHVua3NcXG4gIHZhciBhdWRpb0Jsb2IgPSBuZXcgQmxvYihhdWRpb0RhdGFDaHVua3MsIHtcXG4gICAgdHlwZTogYXVkaW9NaW1lVHlwZVxcbiAgfSk7XFxuXFxuICAvLyBHZXQgdGhlIHN0b3AgdGltZSBhbmQgY2FsY3VsYXRlIHRoZSBkdXJhdGlvblxcbiAgdmFyIHN0b3BUaW1lID0gRGF0ZS5ub3coKTtcXG4gIHZhciBkdXJhdGlvbiA9IHN0b3BUaW1lIC0gd2luZG93LnN0YXJ0VGltZTtcXG5cXG4gIC8vIElmIHRoZSBkdXJhdGlvbiBpcyBncmVhdGVyIHRoYW4gdGhlIHRocmVzaG9sZCwgdXBsb2FkIHRoZSBhdWRpbyBmb3IgdHJhbnNjcmlwdGlvblxcbiAgaWYgKGR1cmF0aW9uID49IHRocmVzaG9sZCkge1xcbiAgICAvLyBVcGxvYWQgdGhlIGF1ZGlvIHRvIHRoZSBzZXJ2ZXIgZm9yIHRyYW5zY3JpcHRpb25cXG4gICAgRXZlbnRCdXMuZW1pdChcXFwic2F5cGk6dXNlckZpbmlzaGVkU3BlYWtpbmdcXFwiLCB7XFxuICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxcbiAgICAgIGJsb2I6IGF1ZGlvQmxvYlxcbiAgICB9KTtcXG4gIH1cXG5cXG4gIC8vIENsZWFyIHRoZSBhcnJheSBmb3IgdGhlIG5leHQgcmVjb3JkaW5nXFxuICBhdWRpb0RhdGFDaHVua3MgPSBbXTtcXG59XFxuZnVuY3Rpb24gc2V0dXBSZWNvcmRpbmcoY2FsbGJhY2spIHtcXG4gIGlmIChtZWRpYVJlY29yZGVyKSB7XFxuICAgIHJldHVybjtcXG4gIH1cXG5cXG4gIC8vIEdldCBhIHN0cmVhbSBmcm9tIHRoZSB1c2VyJ3MgbWljcm9waG9uZVxcbiAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEoe1xcbiAgICBhdWRpbzogdHJ1ZVxcbiAgfSkudGhlbihmdW5jdGlvbiAoc3RyZWFtKSB7XFxuICAgIGlmICghTWVkaWFSZWNvcmRlci5pc1R5cGVTdXBwb3J0ZWQoYXVkaW9NaW1lVHlwZSkpIHtcXG4gICAgICAvLyB1c2UgTVA0IGZvciBTYWZhcmlcXG4gICAgICBhdWRpb01pbWVUeXBlID0gXFxcImF1ZGlvL21wNFxcXCI7XFxuICAgIH1cXG4gICAgLy8gQ3JlYXRlIGEgbmV3IE1lZGlhUmVjb3JkZXIgb2JqZWN0IHVzaW5nIHRoZSBzdHJlYW0gYW5kIHNwZWNpZnlpbmcgdGhlIE1JTUUgdHlwZVxcbiAgICB2YXIgb3B0aW9ucyA9IHtcXG4gICAgICBtaW1lVHlwZTogYXVkaW9NaW1lVHlwZVxcbiAgICB9O1xcbiAgICBtZWRpYVJlY29yZGVyID0gbmV3IE1lZGlhUmVjb3JkZXIoc3RyZWFtLCBvcHRpb25zKTtcXG5cXG4gICAgLy8gTGlzdGVuIGZvciB0aGUgJ2RhdGFhdmFpbGFibGUnIGV2ZW50XFxuICAgIG1lZGlhUmVjb3JkZXIuYWRkRXZlbnRMaXN0ZW5lcihcXFwiZGF0YWF2YWlsYWJsZVxcXCIsIGhhbmRsZURhdGFBdmFpbGFibGUpO1xcblxcbiAgICAvLyBMaXN0ZW4gZm9yIHRoZSAnc3RvcCcgZXZlbnRcXG4gICAgbWVkaWFSZWNvcmRlci5hZGRFdmVudExpc3RlbmVyKFxcXCJzdG9wXFxcIiwgaGFuZGxlU3RvcCk7XFxuICB9KS50aGVuKGZ1bmN0aW9uICgpIHtcXG4gICAgLy8gSW52b2tlIHRoZSBjYWxsYmFjayBmdW5jdGlvblxcbiAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcXFwiZnVuY3Rpb25cXFwiKSB7XFxuICAgICAgY2FsbGJhY2soKTtcXG4gICAgfVxcbiAgfSlbXFxcImNhdGNoXFxcIl0oZnVuY3Rpb24gKGVycikge1xcbiAgICBjb25zb2xlLmVycm9yKFxcXCJFcnJvciBnZXR0aW5nIGF1ZGlvIHN0cmVhbTogXFxcIiArIGVycik7XFxuICB9KTtcXG59XFxuZnVuY3Rpb24gdGVhckRvd25SZWNvcmRpbmcoKSB7XFxuICAvLyBDaGVjayBpZiB0aGUgTWVkaWFSZWNvcmRlciBpcyBzZXQgdXBcXG4gIGlmICghbWVkaWFSZWNvcmRlcikge1xcbiAgICByZXR1cm47XFxuICB9XFxuXFxuICAvLyBTdG9wIGFueSBvbmdvaW5nIHJlY29yZGluZ1xcbiAgaWYgKG1lZGlhUmVjb3JkZXIuc3RhdGUgPT09IFxcXCJyZWNvcmRpbmdcXFwiKSB7XFxuICAgIG1lZGlhUmVjb3JkZXIuc3RvcCgpO1xcbiAgfVxcblxcbiAgLy8gUmVtb3ZlIHRoZSBNZWRpYVJlY29yZGVyJ3MgZXZlbnQgbGlzdGVuZXJzXFxuICBtZWRpYVJlY29yZGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoXFxcImRhdGFhdmFpbGFibGVcXFwiLCBoYW5kbGVEYXRhQXZhaWxhYmxlKTtcXG4gIG1lZGlhUmVjb3JkZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihcXFwic3RvcFxcXCIsIGhhbmRsZVN0b3ApO1xcblxcbiAgLy8gQ2xlYXIgdGhlIE1lZGlhUmVjb3JkZXIgdmFyaWFibGVcXG4gIG1lZGlhUmVjb3JkZXIgPSBudWxsO1xcbn1cXG5cXG4vLyBUbyByZXF1ZXN0IHJlY29yZGluZywgb3RoZXIgbW9kdWxlcyBjYW4gZGlzcGF0Y2ggYSBjdXN0b20gZXZlbnQgYXVkaW86c3RhcnRSZWNvcmRpbmdcXG5mdW5jdGlvbiBzdGFydFJlY29yZGluZygpIHtcXG4gIC8vIENoZWNrIGlmIHRoZSBNZWRpYVJlY29yZGVyIGlzIHNldCB1cFxcbiAgaWYgKCFtZWRpYVJlY29yZGVyKSB7XFxuICAgIHNldHVwUmVjb3JkaW5nKHN0YXJ0UmVjb3JkaW5nKTtcXG4gICAgcmV0dXJuO1xcbiAgfVxcbiAgLy8gQ2hlY2sgaWYgUGkgaXMgY3VycmVudGx5IHNwZWFraW5nIGFuZCBzdG9wIGhlciBhdWRpb1xcbiAgaWYgKHBpQXVkaW9NYW5hZ2VyLmlzU3BlYWtpbmcpIHtcXG4gICAgcGlBdWRpb01hbmFnZXIucGF1c2UoKTtcXG4gIH1cXG5cXG4gIC8vIFN0YXJ0IHJlY29yZGluZ1xcbiAgbWVkaWFSZWNvcmRlci5zdGFydCgpO1xcblxcbiAgLy8gUmVjb3JkIHRoZSBzdGFydCB0aW1lXFxuICB3aW5kb3cuc3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcXG4gIEV2ZW50QnVzLmVtaXQoXFxcInNheXBpOnVzZXJTcGVha2luZ1xcXCIpO1xcbn1cXG5cXG4vLyBUbyBzdG9wIHJlY29yZGluZywgb3RoZXIgbW9kdWxlcyBjYW4gZGlzcGF0Y2ggYSBjdXN0b20gZXZlbnQgYXVkaW86c3RvcFJlY29yZGluZ1xcbmZ1bmN0aW9uIHN0b3BSZWNvcmRpbmcoKSB7XFxuICBpZiAobWVkaWFSZWNvcmRlciAmJiBtZWRpYVJlY29yZGVyLnN0YXRlID09PSBcXFwicmVjb3JkaW5nXFxcIikge1xcbiAgICAvLyBTdG9wIHJlY29yZGluZ1xcbiAgICBtZWRpYVJlY29yZGVyLnN0b3AoKTtcXG5cXG4gICAgLy8gUmVjb3JkIHRoZSBzdG9wIHRpbWUgYW5kIGNhbGN1bGF0ZSB0aGUgZHVyYXRpb25cXG4gICAgdmFyIHN0b3BUaW1lID0gRGF0ZS5ub3coKTtcXG4gICAgdmFyIGR1cmF0aW9uID0gc3RvcFRpbWUgLSB3aW5kb3cuc3RhcnRUaW1lO1xcblxcbiAgICAvLyBJZiB0aGUgZHVyYXRpb24gaXMgbGVzcyB0aGFuIHRoZSB0aHJlc2hvbGQsIGRvbid0IHVwbG9hZCB0aGUgYXVkaW8gZm9yIHRyYW5zY3JpcHRpb25cXG4gICAgaWYgKGR1cmF0aW9uIDwgdGhyZXNob2xkKSB7XFxuICAgICAgY29uc29sZS5sb2coXFxcIlJlY29yZGluZyB3YXMgdG9vIHNob3J0LCBub3QgdXBsb2FkaW5nIGZvciB0cmFuc2NyaXB0aW9uXFxcIik7XFxuICAgICAgRXZlbnRCdXMuZW1pdChcXFwic2F5cGk6dXNlclN0b3BwZWRTcGVha2luZ1xcXCIsIHtcXG4gICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvblxcbiAgICAgIH0pO1xcbiAgICAgIHBpQXVkaW9NYW5hZ2VyLnJlc3VtZSgpO1xcbiAgICB9IGVsc2Uge1xcbiAgICAgIHBpQXVkaW9NYW5hZ2VyLnN0b3AoKTtcXG4gICAgfVxcbiAgfVxcbn1cXG5cXG4vKiBUaGVzZSBldmVudHMgYXJlIHVzZWQgdG8gY29udHJvbC9wYXNzIHJlcXVlc3RzIHRvIHRoZSBhdWRpbyBtb2R1bGUgZnJvbSBvdGhlciBtb2R1bGVzICovXFxuZnVuY3Rpb24gcmVnaXN0ZXJDdXN0b21BdWRpb0V2ZW50TGlzdGVuZXJzKCkge1xcbiAgRXZlbnRCdXMub24oXFxcImF1ZGlvOnNldHVwUmVjb3JkaW5nXFxcIiwgZnVuY3Rpb24gKGUpIHtcXG4gICAgc2V0dXBSZWNvcmRpbmcoKTtcXG4gIH0pO1xcbiAgRXZlbnRCdXMub24oXFxcImF1ZGlvOnRlYXJEb3duUmVjb3JkaW5nXFxcIiwgZnVuY3Rpb24gKGUpIHtcXG4gICAgdGVhckRvd25SZWNvcmRpbmcoKTtcXG4gIH0pO1xcbiAgRXZlbnRCdXMub24oXFxcImF1ZGlvOnN0YXJ0UmVjb3JkaW5nXFxcIiwgZnVuY3Rpb24gKGUpIHtcXG4gICAgc3RhcnRSZWNvcmRpbmcoKTtcXG4gIH0pO1xcbiAgRXZlbnRCdXMub24oXFxcImF1ZGlvOnN0b3BSZWNvcmRpbmdcXFwiLCBmdW5jdGlvbiAoZSkge1xcbiAgICBzdG9wUmVjb3JkaW5nKCk7XFxuICB9KTtcXG4gIEV2ZW50QnVzLm9uKFxcXCJhdWRpbzpyZWxvYWRcXFwiLCBmdW5jdGlvbiAoZSkge1xcbiAgICBwaUF1ZGlvTWFuYWdlci5yZWxvYWQoKTtcXG4gIH0pO1xcbn1cXG5yZWdpc3RlckN1c3RvbUF1ZGlvRXZlbnRMaXN0ZW5lcnMoKTtcIjsiLCJleHBvcnQgZGVmYXVsdCBcIjw/eG1sIHZlcnNpb249XFxcIjEuMFxcXCIgZW5jb2Rpbmc9XFxcIlVURi04XFxcIj8+XFxuPHN2ZyBpZD1cXFwiTGF5ZXJfMVxcXCIgZGF0YS1uYW1lPVxcXCJMYXllciAxXFxcIiB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIHZpZXdCb3g9XFxcIjAgMCA2NC4wNiA2NC4zM1xcXCI+XFxuICA8ZGVmcz5cXG4gICAgPHN0eWxlPlxcbiAgICAgIC5jbHMtMSB7XFxuICAgICAgICBmaWxsOiAjMjQzODFiO1xcbiAgICAgIH1cXG5cXG4gICAgICAuY2xzLTEsIC5jbHMtMiB7XFxuICAgICAgICBzdHJva2Utd2lkdGg6IDBweDtcXG4gICAgICB9XFxuXFxuICAgICAgLmNscy0yIHtcXG4gICAgICAgIGZpbGw6ICNkZmQ3YzI7XFxuICAgICAgfVxcbiAgICA8L3N0eWxlPlxcbiAgPC9kZWZzPlxcbiAgPHBhdGggY2xhc3M9XFxcImNscy0yXFxcIiBkPVxcXCJtMzEuNzEsNjQuMzJDMTQuNzcsNjQuNDYtLjQ0LDQ5LjkzLDAsMzEuMzMuNDEsMTQuNDcsMTQuMjktLjMyLDMyLjcsMGMxNi45MS4zLDMxLjgsMTQuMzIsMzEuMzYsMzMuMTQtLjM5LDE2Ljc2LTE0LjQ5LDMxLjU1LTMyLjM0LDMxLjE4Wm0xMC42Ny0yMy4xOWMuMDYtLjctLjQxLTEuMTItLjg0LTEuNTUtMi0yLTMuOTQtNC4wNy02LjAyLTUuOTctMS4xNC0xLjA0LTEuMzItMS42OC0uMDYtMi44MiwyLjEzLTEuOTMsNC4wNy00LjA4LDYuMS02LjEyLjc4LS43OSwxLjMxLTEuNjQuMzQtMi41Ni0uOTItLjg3LTEuNzItLjI4LTIuNDMuNDUtMi4xNywyLjIxLTQuMzksNC4zOS02LjUyLDYuNjUtLjcyLjc3LTEuMTYuNy0xLjg0LS4wMi0yLjA2LTIuMTctNC4xOS00LjI4LTYuMjktNi40MS0uNzYtLjc3LTEuNTktMS42OC0yLjY2LS42My0xLjE0LDEuMTItLjE5LDEuOTguNjIsMi43OSwyLjA3LDIuMDksNC4wOSw0LjIyLDYuMiw2LjI2Ljc3Ljc1LjgyLDEuMi4wMiwxLjk3LTIuMjEsMi4xLTQuMzMsNC4zLTYuNDksNi40NS0uNzkuNzgtMS4zLDEuNjUtLjMyLDIuNTYuOTIuODUsMS43MS4yNiwyLjQzLS40NywyLjExLTIuMTIsNC4yOC00LjE5LDYuMzMtNi4zOC44OC0uOTQsMS4zNy0uODYsMi4yMS4wMywyLjEzLDIuMjYsNC4zNyw0LjQxLDYuNTcsNi42LjUxLjUxLDEuMDkuNzgsMS44LjQ4LjU2LS4yNC44NS0uNjguODctMS4zWlxcXCIvPlxcbiAgPHBhdGggY2xhc3M9XFxcImNscy0xXFxcIiBkPVxcXCJtNDIuNDcsNDEuMjdjLS4wMi42Mi0uMzIsMS4wNi0uODcsMS4zLS43MS4zMS0xLjI5LjAzLTEuOC0uNDgtMi4yLTIuMi00LjQ0LTQuMzUtNi41Ny02LjYtLjg0LS44OS0xLjMzLS45Ni0yLjIxLS4wMy0yLjA0LDIuMTktNC4yMiw0LjI1LTYuMzMsNi4zOC0uNzIuNzItMS41MSwxLjMyLTIuNDMuNDctLjk4LS45MS0uNDctMS43OC4zMi0yLjU2LDIuMTYtMi4xNSw0LjI4LTQuMzUsNi40OS02LjQ1LjgxLS43Ny43Ni0xLjIyLS4wMi0xLjk3LTIuMTEtMi4wNC00LjEzLTQuMTctNi4yLTYuMjYtLjgtLjgxLTEuNzUtMS42Ny0uNjItMi43OSwxLjA3LTEuMDUsMS45LS4xNCwyLjY2LjYzLDIuMSwyLjEzLDQuMjMsNC4yNCw2LjI5LDYuNDEuNjkuNzMsMS4xMi43OSwxLjg0LjAyLDIuMTMtMi4yNiw0LjM1LTQuNDMsNi41Mi02LjY1LjcyLS43MywxLjUxLTEuMzEsMi40My0uNDUuOTcuOTIuNDQsMS43OC0uMzQsMi41Ni0yLjAzLDIuMDQtMy45Nyw0LjE5LTYuMSw2LjEyLTEuMjUsMS4xNC0xLjA4LDEuNzguMDYsMi44MiwyLjA5LDEuOTEsNC4wMiwzLjk3LDYuMDIsNS45Ny40My40My45Ljg1Ljg0LDEuNTVaXFxcIi8+XFxuPC9zdmc+XCI7IiwiZXhwb3J0IGRlZmF1bHQgXCI8P3htbCB2ZXJzaW9uPVxcXCIxLjBcXFwiIGVuY29kaW5nPVxcXCJVVEYtOFxcXCI/PlxcbjxzdmcgaWQ9XFxcIkxheWVyXzFcXFwiIGRhdGEtbmFtZT1cXFwiTGF5ZXIgMVxcXCIgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiB2aWV3Qm94PVxcXCIwIDAgMzA3IDY0MFxcXCI+XFxuICA8ZGVmcz5cXG4gICAgPHN0eWxlPlxcbiAgICAgIC5pbm5lcm1vc3QsIC5zZWNvbmQsIC50aGlyZCwgLmZvdXJ0aCwgLmZpZnRoLCAub3V0ZXJtb3N0IHtcXG4gICAgICAgIHN0cm9rZS13aWR0aDogMHB4O1xcbiAgICAgIH1cXG4gICAgICBcXG4gICAgICAub3V0ZXJtb3N0IHtcXG4gICAgICAgIGZpbGw6ICNlNGYyZDE7XFxuICAgICAgfVxcblxcbiAgICAgIC5zZWNvbmQge1xcbiAgICAgICAgZmlsbDogI2NjZThiNTtcXG4gICAgICB9XFxuXFxuICAgICAgLnRoaXJkIHtcXG4gICAgICAgIGZpbGw6ICNiM2RiOTU7XFxuICAgICAgfVxcblxcbiAgICAgIC5mb3VydGgge1xcbiAgICAgICAgZmlsbDogIzliZDA3ODtcXG4gICAgICB9XFxuXFxuICAgICAgLmZpZnRoIHtcXG4gICAgICAgIGZpbGw6ICM4M2M1NWM7XFxuICAgICAgfVxcblxcbiAgICAgIC5pbm5lcm1vc3Qge1xcbiAgICAgICAgZmlsbDogIzQyOGEyZjtcXG4gICAgICB9XFxuICAgIDwvc3R5bGU+XFxuICA8L2RlZnM+XFxuICA8cGF0aCBjbGFzcz1cXFwib3V0ZXJtb3N0XFxcIiBkPVxcXCJtMzA2LjksMzIwYzAsMTA1LjMtLjAyLDIxMC42LjEsMzE1LjkxLDAsMy40Mi0uNjcsNC4xLTQuMDksNC4wOS05OS42LS4xMi0xOTkuMjEtLjEyLTI5OC44MSwwQy42Nyw2NDAsMCw2MzkuMzMsMCw2MzUuOTEuMTEsNDI1LjMuMTEsMjE0LjcsMCw0LjA5LDAsLjY3LjY3LDAsNC4wOSwwLDEwMy43LjEyLDIwMy4zLjEyLDMwMi45MSwwYzMuNDIsMCw0LjEuNjcsNC4wOSw0LjA5LS4xMiwxMDUuMy0uMSwyMTAuNi0uMSwzMTUuOTFaXFxcIi8+XFxuICA8cGF0aCBjbGFzcz1cXFwic2Vjb25kXFxcIiBkPVxcXCJtMjc1LjkyLDMyM2MwLDg3LjYzLDAsMTc1LjI3LDAsMjYyLjksMCw3LjI0LS41NSw3LjkzLTcuODYsNy45OC0xNC42Ni4wOS0yOS4zMS4wMy00My45Ny4wMy02MC45NiwwLTEyMS45MiwwLTE4Mi44OCwwcS03LjEzLDAtNy4xNC03LjI0YzAtMTc2LjEsMC0zNTIuMjEsMC01MjguMzFxMC03LjI2LDcuMTItNy4yNmM3NS43OCwwLDE1MS41NiwwLDIyNy4zNSwwcTcuMzgsMCw3LjM4LDcuNWMwLDg4LjEzLDAsMTc2LjI3LDAsMjY0LjRaXFxcIi8+XFxuICA8cGF0aCBjbGFzcz1cXFwidGhpcmRcXFwiIGQ9XFxcIm02OC4wNiwzMjIuMjRjMC02OS40NywwLTEzOC45NCwwLTIwOC40MSwwLTguOTksMS4zMy0xMC4xMywxMC40OS05LjEyLDEuOTguMjIsMy45OC4zMiw1Ljk3LjMyLDQ2LjEzLjAyLDkyLjI2LjAyLDEzOC4zOSwwLDMuNDgsMCw2LjkyLS4yMywxMC40MS0uNjcsNS41LS43LDguNzQuNDYsOC43Myw3LjI1LS4xOCwxMzguOTQtLjEzLDI3Ny44OC0uMTMsNDE2LjgxLDAsLjMzLDAsLjY3LDAsMXEtLjE0LDEwLjUxLTEwLjM5LDEwLjUxYy01Mi4xMywwLTEwNC4yNSwwLTE1Ni4zOCwwcS03LjA5LDAtNy4wOS03LjI4YzAtNzAuMTQsMC0xNDAuMjcsMC0yMTAuNDFaXFxcIi8+XFxuICA8cGF0aCBjbGFzcz1cXFwiZm91cnRoXFxcIiBkPVxcXCJtMTAzLjAyLDMyMi41YzAtNTIuNDYsMC0xMDQuOTEsMC0xNTcuMzcsMC02LjY4LjM2LTcuMDYsNy4wNy03LjA2LDMwLjMtLjAxLDYwLjYuMDcsOTAuOS0uMDksNC41NC0uMDIsNi4wOCwxLjMzLDYuMDcsNS45OC0uMSwxMDUuNTgtLjEsMjExLjE2LDAsMzE2Ljc0LDAsNC4xOC0xLjI3LDUuMzctNS4zOCw1LjM1LTI5LjMtLjE1LTU4LjYtLjA4LTg3LjktLjA4cS0xMC43NiwwLTEwLjc2LTExLjA5YzAtNTAuNzksMC0xMDEuNTgsMC0xNTIuMzdaXFxcIi8+XFxuICA8cGF0aCBjbGFzcz1cXFwiZmlmdGhcXFwiIGQ9XFxcIm0xNzMsMzIyLjJjMCwzNS4yOSwwLDcwLjU4LDAsMTA1Ljg4cTAsNi44OS02Ljk5LDYuOWMtOC4xNSwwLTE2LjMxLS4xMy0yNC40Ni4wNi0zLjQ3LjA4LTQuNjgtMS4wOS00LjYxLTQuNTkuMTgtOS42NS4wNi0xOS4zMS4wNi0yOC45NiwwLTU4LjI2LS4wMS0xMTYuNTMuMDItMTc0Ljc5LDAtNC43Ni0xLjEyLTkuNDYtLjE0LTE0LjMuNTEtMi41NCwxLjM5LTMuMzgsMy44LTMuMzYsOC44Mi4wNiwxNy42NC4xNCwyNi40Ni0uMDIsNC41OS0uMDksNS45NSwxLjg1LDUuOTQsNi4zMy0uMTQsMzUuNjItLjA4LDcxLjI1LS4wOCwxMDYuODdaXFxcIi8+XFxuICA8cGF0aCBjbGFzcz1cXFwiaW5uZXJtb3N0XFxcIiBkPVxcXCJtMTUxLjA0LDMyMi4wMWMwLTkuOTkuMDctMTkuOTctLjA1LTI5Ljk2LS4wNC0yLjkzLjgzLTQuMTgsMy45NS00LjE4LDMuMDYsMCw0LjAzLDEuMTIsNC4wMiw0LjExLS4wOSwxOS45Ny0uMDgsMzkuOTQuMDEsNTkuOTEuMDEsMi45Ni0uODQsNC4xNi0zLjk2LDQuMTQtMy4wMy0uMDEtNC4wOC0xLjA0LTQuMDMtNC4wOC4xNC05Ljk4LjA1LTE5Ljk3LjA1LTI5Ljk2WlxcXCIvPlxcbjwvc3ZnPlwiOyIsImV4cG9ydCBkZWZhdWx0IFwiPHN2ZyB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIHZlcnNpb249XFxcIjEuMFxcXCIgdmlld0JveD1cXFwiMCAwIDU2LjI1IDMwXFxcIiBjbGFzcz1cXFwid2F2ZWZvcm1cXFwiPlxcbiAgICA8ZGVmcz5cXG4gICAgICAgIDxjbGlwUGF0aCBpZD1cXFwiYVxcXCI+XFxuICAgICAgICAgICAgPHBhdGggZD1cXFwiTS41NCAxMkgzdjVILjU0Wm0wIDBcXFwiLz5cXG4gICAgICAgIDwvY2xpcFBhdGg+XFxuICAgICAgICA8Y2xpcFBhdGggaWQ9XFxcImJcXFwiPlxcbiAgICAgICAgICAgIDxwYXRoIGQ9XFxcIk0yNSAyLjJoMnYyNC42OGgtMlptMCAwXFxcIi8+XFxuICAgICAgICA8L2NsaXBQYXRoPlxcbiAgICAgICAgPGNsaXBQYXRoIGlkPVxcXCJjXFxcIj5cXG4gICAgICAgICAgICA8cGF0aCBkPVxcXCJNNTMgMTJoMS45OHY1SDUzWm0wIDBcXFwiLz5cXG4gICAgICAgIDwvY2xpcFBhdGg+XFxuICAgIDwvZGVmcz5cXG4gICAgPGcgY2xpcC1wYXRoPVxcXCJ1cmwoI2EpXFxcIj5cXG4gICAgICAgIDxwYXRoIGQ9XFxcIk0xLjQ4IDEyLjcxYy0uNSAwLS45LjQtLjkuOXYxLjg1YS45LjkgMCAwIDAgMS44IDB2LTEuODRjMC0uNS0uNC0uOS0uOS0uOVptMCAwXFxcIi8+XFxuICAgIDwvZz5cXG4gICAgPHBhdGggZD1cXFwiTTQuOTggNi42M2MtLjUgMC0uOS40LS45Ljl2MTQuMDFhLjkuOSAwIDAgMCAxLjgxIDB2LTE0YzAtLjUtLjQtLjkyLS45LS45MlptMy41MSAzLjFhLjkuOSAwIDAgMC0uOS45MXY3Ljc5YS45LjkgMCAwIDAgMS44IDB2LTcuNzljMC0uNS0uNC0uOS0uOS0uOVpNMTIgMy44M2EuOS45IDAgMCAwLS45MS45djE5LjZhLjkuOSAwIDAgMCAxLjggMFY0Ljc0YzAtLjUtLjQtLjktLjktLjlabTMuNSA4LjI5YS45LjkgMCAwIDAtLjkxLjl2My4wM2EuOS45IDAgMCAwIDEuODEgMHYtMy4wM2MwLS41LS40LS45LS45LS45Wk0xOSA2LjhjLS41IDAtLjkuNC0uOS45djEzLjY4YS45LjkgMCAwIDAgMS44IDBWNy43YzAtLjUtLjQtLjktLjktLjlabTMuNTgtMi45N2gtLjAxYy0uNSAwLS45LjQtLjkuOWwtLjEzIDE5LjZjMCAuNS40LjkuOS45MS41IDAgLjktLjQuOS0uOWwuMTQtMTkuNmEuOS45IDAgMCAwLS45LS45Wm0wIDBcXFwiLz5cXG4gICAgPGcgY2xpcC1wYXRoPVxcXCJ1cmwoI2IpXFxcIj5cXG4gICAgICAgIDxwYXRoIGQ9XFxcIk0yNiAyLjJjLS41IDAtLjkuNC0uOS45djIyLjg2YS45LjkgMCAxIDAgMS44MSAwVjMuMTFhLjkuOSAwIDAgMC0uOS0uOTFabTAgMFxcXCIvPlxcbiAgICA8L2c+XFxuICAgIDxwYXRoIGQ9XFxcIk0yOS41MiA3LjcxYS45LjkgMCAwIDAtLjkxLjl2MTEuODVhLjkuOSAwIDAgMCAxLjgxIDBWOC42MmMwLS41LS40LS45LS45LS45Wm0zLjUgMi45M2EuOS45IDAgMCAwLS45LjkxdjUuOTdhLjkuOSAwIDAgMCAxLjggMHYtNS45N2MwLS41LS40LS45LS45LS45Wm0zLjUtNS43OGMtLjUgMC0uOS40LS45Ljl2MTcuNTVhLjkuOSAwIDAgMCAxLjgxIDBWNS43NmMwLS41LS40LS45LS45LS45Wm0zLjUxIDMuMzRjLS41IDAtLjkuNC0uOS45djEwLjg3YS45LjkgMCAwIDAgMS44IDBWOS4xYS45LjkgMCAwIDAtLjktLjkxWm0zLjUgMy4wOGMtLjUgMC0uOS40LS45LjkxdjQuN2EuOS45IDAgMSAwIDEuOCAwdi00LjdhLjkuOSAwIDAgMC0uOS0uOVptMy41MS03LjQ1YS45LjkgMCAwIDAtLjkxLjl2MTkuNmEuOS45IDAgMCAwIDEuODEgMFY0Ljc0YzAtLjUtLjQtLjktLjktLjlabTMuNSA1LjU3YS45LjkgMCAwIDAtLjkuOTF2OC40NWEuOS45IDAgMCAwIDEuOCAwdi04LjQ1YzAtLjUtLjQtLjktLjktLjlabTAgMFxcXCIvPlxcbiAgICA8ZyBjbGlwLXBhdGg9XFxcInVybCgjYylcXFwiPlxcbiAgICAgICAgPHBhdGggZD1cXFwiTTU0LjA0IDEyLjk2YS45LjkgMCAwIDAtLjkuOTF2MS4zM2EuOS45IDAgMSAwIDEuOCAwdi0xLjMyYS45LjkgMCAwIDAtLjktLjkyWm0wIDBcXFwiLz5cXG4gICAgPC9nPlxcbjwvc3ZnPlwiOyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9yZWN0YW5nbGVzLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vcmVjdGFuZ2xlcy5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vdGFsa0J1dHRvbi5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3RhbGtCdXR0b24uY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cnVsZVNldFsxXS5ydWxlc1szXS51c2VbMV0hLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2Rpc3QvY2pzLmpzPz9ydWxlU2V0WzFdLnJ1bGVzWzNdLnVzZVsyXSEuL21vYmlsZS5zY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanM/P3J1bGVTZXRbMV0ucnVsZXNbM10udXNlWzFdIS4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9kaXN0L2Nqcy5qcz8/cnVsZVNldFsxXS5ydWxlc1szXS51c2VbMl0hLi9tb2JpbGUuc2Nzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiaW1wb3J0IHsgX19hc3NpZ24gfSBmcm9tICcuL192aXJ0dWFsL190c2xpYi5qcyc7XG5pbXBvcnQgeyBzeW1ib2xPYnNlcnZhYmxlLCB0b0ludm9rZVNvdXJjZSwgbWFwQ29udGV4dCwgaXNNYWNoaW5lIH0gZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQgeyBwcm92aWRlIH0gZnJvbSAnLi9zZXJ2aWNlU2NvcGUuanMnO1xuXG5mdW5jdGlvbiBjcmVhdGVOdWxsQWN0b3IoaWQpIHtcbiAgdmFyIF9hO1xuXG4gIHJldHVybiBfYSA9IHtcbiAgICBpZDogaWQsXG4gICAgc2VuZDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICB9LFxuICAgIHN1YnNjcmliZTogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gICAgZ2V0U25hcHNob3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSxcbiAgICB0b0pTT046IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkOiBpZFxuICAgICAgfTtcbiAgICB9XG4gIH0sIF9hW3N5bWJvbE9ic2VydmFibGVdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9LCBfYTtcbn1cbi8qKlxyXG4gKiBDcmVhdGVzIGEgZGVmZXJyZWQgYWN0b3IgdGhhdCBpcyBhYmxlIHRvIGJlIGludm9rZWQgZ2l2ZW4gdGhlIHByb3ZpZGVkXHJcbiAqIGludm9jYXRpb24gaW5mb3JtYXRpb24gaW4gaXRzIGAubWV0YWAgdmFsdWUuXHJcbiAqXHJcbiAqIEBwYXJhbSBpbnZva2VEZWZpbml0aW9uIFRoZSBtZXRhIGluZm9ybWF0aW9uIG5lZWRlZCB0byBpbnZva2UgdGhlIGFjdG9yLlxyXG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlSW52b2NhYmxlQWN0b3IoaW52b2tlRGVmaW5pdGlvbiwgbWFjaGluZSwgY29udGV4dCwgX2V2ZW50KSB7XG4gIHZhciBfYTtcblxuICB2YXIgaW52b2tlU3JjID0gdG9JbnZva2VTb3VyY2UoaW52b2tlRGVmaW5pdGlvbi5zcmMpO1xuICB2YXIgc2VydmljZUNyZWF0b3IgPSAoX2EgPSBtYWNoaW5lID09PSBudWxsIHx8IG1hY2hpbmUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG1hY2hpbmUub3B0aW9ucy5zZXJ2aWNlcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hW2ludm9rZVNyYy50eXBlXTtcbiAgdmFyIHJlc29sdmVkRGF0YSA9IGludm9rZURlZmluaXRpb24uZGF0YSA/IG1hcENvbnRleHQoaW52b2tlRGVmaW5pdGlvbi5kYXRhLCBjb250ZXh0LCBfZXZlbnQpIDogdW5kZWZpbmVkO1xuICB2YXIgdGVtcEFjdG9yID0gc2VydmljZUNyZWF0b3IgPyBjcmVhdGVEZWZlcnJlZEFjdG9yKHNlcnZpY2VDcmVhdG9yLCBpbnZva2VEZWZpbml0aW9uLmlkLCByZXNvbHZlZERhdGEpIDogY3JlYXRlTnVsbEFjdG9yKGludm9rZURlZmluaXRpb24uaWQpOyAvLyBAdHMtaWdub3JlXG5cbiAgdGVtcEFjdG9yLm1ldGEgPSBpbnZva2VEZWZpbml0aW9uO1xuICByZXR1cm4gdGVtcEFjdG9yO1xufVxuZnVuY3Rpb24gY3JlYXRlRGVmZXJyZWRBY3RvcihlbnRpdHksIGlkLCBkYXRhKSB7XG4gIHZhciB0ZW1wQWN0b3IgPSBjcmVhdGVOdWxsQWN0b3IoaWQpOyAvLyBAdHMtaWdub3JlXG5cbiAgdGVtcEFjdG9yLmRlZmVycmVkID0gdHJ1ZTtcblxuICBpZiAoaXNNYWNoaW5lKGVudGl0eSkpIHtcbiAgICAvLyBcIm11dGVcIiB0aGUgZXhpc3Rpbmcgc2VydmljZSBzY29wZSBzbyBwb3RlbnRpYWwgc3Bhd25lZCBhY3RvcnMgd2l0aGluIHRoZSBgLmluaXRpYWxTdGF0ZWAgc3RheSBkZWZlcnJlZCBoZXJlXG4gICAgdmFyIGluaXRpYWxTdGF0ZV8xID0gdGVtcEFjdG9yLnN0YXRlID0gcHJvdmlkZSh1bmRlZmluZWQsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAoZGF0YSA/IGVudGl0eS53aXRoQ29udGV4dChkYXRhKSA6IGVudGl0eSkuaW5pdGlhbFN0YXRlO1xuICAgIH0pO1xuXG4gICAgdGVtcEFjdG9yLmdldFNuYXBzaG90ID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGluaXRpYWxTdGF0ZV8xO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gdGVtcEFjdG9yO1xufVxuZnVuY3Rpb24gaXNBY3RvcihpdGVtKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHR5cGVvZiBpdGVtLnNlbmQgPT09ICdmdW5jdGlvbic7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbmZ1bmN0aW9uIGlzU3Bhd25lZEFjdG9yKGl0ZW0pIHtcbiAgcmV0dXJuIGlzQWN0b3IoaXRlbSkgJiYgJ2lkJyBpbiBpdGVtO1xufSAvLyBUT0RPOiByZWZhY3RvciB0aGUgcmV0dXJuIHR5cGUsIHRoaXMgY291bGQgYmUgd3JpdHRlbiBpbiBhIGJldHRlciB3YXkgYnV0IGl0J3MgYmVzdCB0byBhdm9pZCB1bm5lY2Nlc3NhcnkgYnJlYWtpbmcgY2hhbmdlcyBub3dcblxuZnVuY3Rpb24gdG9BY3RvclJlZihhY3RvclJlZkxpa2UpIHtcbiAgdmFyIF9hO1xuXG4gIHJldHVybiBfX2Fzc2lnbigoX2EgPSB7XG4gICAgc3Vic2NyaWJlOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSxcbiAgICBpZDogJ2Fub255bW91cycsXG4gICAgZ2V0U25hcHNob3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICB9LCBfYVtzeW1ib2xPYnNlcnZhYmxlXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfSwgX2EpLCBhY3RvclJlZkxpa2UpO1xufVxuXG5leHBvcnQgeyBjcmVhdGVEZWZlcnJlZEFjdG9yLCBjcmVhdGVJbnZvY2FibGVBY3RvciwgY3JlYXRlTnVsbEFjdG9yLCBpc0FjdG9yLCBpc1NwYXduZWRBY3RvciwgdG9BY3RvclJlZiB9O1xuIiwiaW1wb3J0IHsgU3RhdGVOb2RlIH0gZnJvbSAnLi9TdGF0ZU5vZGUuanMnO1xuaW1wb3J0IHsgSVNfUFJPRFVDVElPTiB9IGZyb20gJy4vZW52aXJvbm1lbnQuanMnO1xuXG52YXIgd2FybmVkID0gZmFsc2U7XG5mdW5jdGlvbiBNYWNoaW5lKGNvbmZpZywgb3B0aW9ucywgaW5pdGlhbENvbnRleHQpIHtcbiAgaWYgKGluaXRpYWxDb250ZXh0ID09PSB2b2lkIDApIHtcbiAgICBpbml0aWFsQ29udGV4dCA9IGNvbmZpZy5jb250ZXh0O1xuICB9XG5cbiAgcmV0dXJuIG5ldyBTdGF0ZU5vZGUoY29uZmlnLCBvcHRpb25zLCBpbml0aWFsQ29udGV4dCk7XG59XG5mdW5jdGlvbiBjcmVhdGVNYWNoaW5lKGNvbmZpZywgb3B0aW9ucykge1xuICBpZiAoIUlTX1BST0RVQ1RJT04gJiYgISgncHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHMnIGluIGNvbmZpZykgJiYgIXdhcm5lZCkge1xuICAgIHdhcm5lZCA9IHRydWU7XG4gICAgY29uc29sZS53YXJuKCdJdCBpcyBoaWdobHkgcmVjb21tZW5kZWQgdG8gc2V0IGBwcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50c2AgdG8gYHRydWVgIHdoZW4gdXNpbmcgYGNyZWF0ZU1hY2hpbmVgLiBodHRwczovL3hzdGF0ZS5qcy5vcmcvZG9jcy9ndWlkZXMvYWN0aW9ucy5odG1sJyk7XG4gIH1cblxuICByZXR1cm4gbmV3IFN0YXRlTm9kZShjb25maWcsIG9wdGlvbnMpO1xufVxuXG5leHBvcnQgeyBNYWNoaW5lLCBjcmVhdGVNYWNoaW5lIH07XG4iLCJpbXBvcnQgeyBfX2Fzc2lnbiwgX19zcHJlYWRBcnJheSwgX19yZWFkLCBfX3Jlc3QgfSBmcm9tICcuL192aXJ0dWFsL190c2xpYi5qcyc7XG5pbXBvcnQgeyBFTVBUWV9BQ1RJVklUWV9NQVAgfSBmcm9tICcuL2NvbnN0YW50cy5qcyc7XG5pbXBvcnQgeyBpc1N0cmluZywgbWF0Y2hlc1N0YXRlLCB3YXJuIH0gZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQgeyBnZXRNZXRhLCBuZXh0RXZlbnRzIH0gZnJvbSAnLi9zdGF0ZVV0aWxzLmpzJztcbmltcG9ydCB7IGluaXRFdmVudCB9IGZyb20gJy4vYWN0aW9ucy5qcyc7XG5pbXBvcnQgeyBJU19QUk9EVUNUSU9OIH0gZnJvbSAnLi9lbnZpcm9ubWVudC5qcyc7XG5cbmZ1bmN0aW9uIHN0YXRlVmFsdWVzRXF1YWwoYSwgYikge1xuICBpZiAoYSA9PT0gYikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKGEgPT09IHVuZGVmaW5lZCB8fCBiID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoaXNTdHJpbmcoYSkgfHwgaXNTdHJpbmcoYikpIHtcbiAgICByZXR1cm4gYSA9PT0gYjtcbiAgfVxuXG4gIHZhciBhS2V5cyA9IE9iamVjdC5rZXlzKGEpO1xuICB2YXIgYktleXMgPSBPYmplY3Qua2V5cyhiKTtcbiAgcmV0dXJuIGFLZXlzLmxlbmd0aCA9PT0gYktleXMubGVuZ3RoICYmIGFLZXlzLmV2ZXJ5KGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gc3RhdGVWYWx1ZXNFcXVhbChhW2tleV0sIGJba2V5XSk7XG4gIH0pO1xufVxuZnVuY3Rpb24gaXNTdGF0ZUNvbmZpZyhzdGF0ZSkge1xuICBpZiAodHlwZW9mIHN0YXRlICE9PSAnb2JqZWN0JyB8fCBzdGF0ZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiAndmFsdWUnIGluIHN0YXRlICYmICdfZXZlbnQnIGluIHN0YXRlO1xufVxuLyoqXHJcbiAqIEBkZXByZWNhdGVkIFVzZSBgaXNTdGF0ZUNvbmZpZyhvYmplY3QpYCBvciBgc3RhdGUgaW5zdGFuY2VvZiBTdGF0ZWAgaW5zdGVhZC5cclxuICovXG5cbnZhciBpc1N0YXRlID0gaXNTdGF0ZUNvbmZpZztcbmZ1bmN0aW9uIGJpbmRBY3Rpb25Ub1N0YXRlKGFjdGlvbiwgc3RhdGUpIHtcbiAgdmFyIGV4ZWMgPSBhY3Rpb24uZXhlYztcblxuICB2YXIgYm91bmRBY3Rpb24gPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgYWN0aW9uKSwge1xuICAgIGV4ZWM6IGV4ZWMgIT09IHVuZGVmaW5lZCA/IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBleGVjKHN0YXRlLmNvbnRleHQsIHN0YXRlLmV2ZW50LCB7XG4gICAgICAgIGFjdGlvbjogYWN0aW9uLFxuICAgICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICAgIF9ldmVudDogc3RhdGUuX2V2ZW50XG4gICAgICB9KTtcbiAgICB9IDogdW5kZWZpbmVkXG4gIH0pO1xuXG4gIHJldHVybiBib3VuZEFjdGlvbjtcbn1cblxudmFyIFN0YXRlID1cbi8qI19fUFVSRV9fKi9cblxuLyoqIEBjbGFzcyAqL1xuZnVuY3Rpb24gKCkge1xuICAvKipcclxuICAgKiBDcmVhdGVzIGEgbmV3IFN0YXRlIGluc3RhbmNlLlxyXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgc3RhdGUgdmFsdWVcclxuICAgKiBAcGFyYW0gY29udGV4dCBUaGUgZXh0ZW5kZWQgc3RhdGVcclxuICAgKiBAcGFyYW0gaGlzdG9yeVZhbHVlIFRoZSB0cmVlIHJlcHJlc2VudGluZyBoaXN0b3JpY2FsIHZhbHVlcyBvZiB0aGUgc3RhdGUgbm9kZXNcclxuICAgKiBAcGFyYW0gaGlzdG9yeSBUaGUgcHJldmlvdXMgc3RhdGVcclxuICAgKiBAcGFyYW0gYWN0aW9ucyBBbiBhcnJheSBvZiBhY3Rpb24gb2JqZWN0cyB0byBleGVjdXRlIGFzIHNpZGUtZWZmZWN0c1xyXG4gICAqIEBwYXJhbSBhY3Rpdml0aWVzIEEgbWFwcGluZyBvZiBhY3Rpdml0aWVzIGFuZCB3aGV0aGVyIHRoZXkgYXJlIHN0YXJ0ZWQgKGB0cnVlYCkgb3Igc3RvcHBlZCAoYGZhbHNlYCkuXHJcbiAgICogQHBhcmFtIG1ldGFcclxuICAgKiBAcGFyYW0gZXZlbnRzIEludGVybmFsIGV2ZW50IHF1ZXVlLiBTaG91bGQgYmUgZW1wdHkgd2l0aCBydW4tdG8tY29tcGxldGlvbiBzZW1hbnRpY3MuXHJcbiAgICogQHBhcmFtIGNvbmZpZ3VyYXRpb25cclxuICAgKi9cbiAgZnVuY3Rpb24gU3RhdGUoY29uZmlnKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBfYTtcblxuICAgIHRoaXMuYWN0aW9ucyA9IFtdO1xuICAgIHRoaXMuYWN0aXZpdGllcyA9IEVNUFRZX0FDVElWSVRZX01BUDtcbiAgICB0aGlzLm1ldGEgPSB7fTtcbiAgICB0aGlzLmV2ZW50cyA9IFtdO1xuICAgIHRoaXMudmFsdWUgPSBjb25maWcudmFsdWU7XG4gICAgdGhpcy5jb250ZXh0ID0gY29uZmlnLmNvbnRleHQ7XG4gICAgdGhpcy5fZXZlbnQgPSBjb25maWcuX2V2ZW50O1xuICAgIHRoaXMuX3Nlc3Npb25pZCA9IGNvbmZpZy5fc2Vzc2lvbmlkO1xuICAgIHRoaXMuZXZlbnQgPSB0aGlzLl9ldmVudC5kYXRhO1xuICAgIHRoaXMuaGlzdG9yeVZhbHVlID0gY29uZmlnLmhpc3RvcnlWYWx1ZTtcbiAgICB0aGlzLmhpc3RvcnkgPSBjb25maWcuaGlzdG9yeTtcbiAgICB0aGlzLmFjdGlvbnMgPSBjb25maWcuYWN0aW9ucyB8fCBbXTtcbiAgICB0aGlzLmFjdGl2aXRpZXMgPSBjb25maWcuYWN0aXZpdGllcyB8fCBFTVBUWV9BQ1RJVklUWV9NQVA7XG4gICAgdGhpcy5tZXRhID0gZ2V0TWV0YShjb25maWcuY29uZmlndXJhdGlvbik7XG4gICAgdGhpcy5ldmVudHMgPSBjb25maWcuZXZlbnRzIHx8IFtdO1xuICAgIHRoaXMubWF0Y2hlcyA9IHRoaXMubWF0Y2hlcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMudG9TdHJpbmdzID0gdGhpcy50b1N0cmluZ3MuYmluZCh0aGlzKTtcbiAgICB0aGlzLmNvbmZpZ3VyYXRpb24gPSBjb25maWcuY29uZmlndXJhdGlvbjtcbiAgICB0aGlzLnRyYW5zaXRpb25zID0gY29uZmlnLnRyYW5zaXRpb25zO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBjb25maWcuY2hpbGRyZW47XG4gICAgdGhpcy5kb25lID0gISFjb25maWcuZG9uZTtcbiAgICB0aGlzLnRhZ3MgPSAoX2EgPSBBcnJheS5pc0FycmF5KGNvbmZpZy50YWdzKSA/IG5ldyBTZXQoY29uZmlnLnRhZ3MpIDogY29uZmlnLnRhZ3MpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IG5ldyBTZXQoKTtcbiAgICB0aGlzLm1hY2hpbmUgPSBjb25maWcubWFjaGluZTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ25leHRFdmVudHMnLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5leHRFdmVudHMoX3RoaXMuY29uZmlndXJhdGlvbik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhIG5ldyBTdGF0ZSBpbnN0YW5jZSBmb3IgdGhlIGdpdmVuIGBzdGF0ZVZhbHVlYCBhbmQgYGNvbnRleHRgLlxyXG4gICAqIEBwYXJhbSBzdGF0ZVZhbHVlXHJcbiAgICogQHBhcmFtIGNvbnRleHRcclxuICAgKi9cblxuXG4gIFN0YXRlLmZyb20gPSBmdW5jdGlvbiAoc3RhdGVWYWx1ZSwgY29udGV4dCkge1xuICAgIGlmIChzdGF0ZVZhbHVlIGluc3RhbmNlb2YgU3RhdGUpIHtcbiAgICAgIGlmIChzdGF0ZVZhbHVlLmNvbnRleHQgIT09IGNvbnRleHQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTdGF0ZSh7XG4gICAgICAgICAgdmFsdWU6IHN0YXRlVmFsdWUudmFsdWUsXG4gICAgICAgICAgY29udGV4dDogY29udGV4dCxcbiAgICAgICAgICBfZXZlbnQ6IHN0YXRlVmFsdWUuX2V2ZW50LFxuICAgICAgICAgIF9zZXNzaW9uaWQ6IG51bGwsXG4gICAgICAgICAgaGlzdG9yeVZhbHVlOiBzdGF0ZVZhbHVlLmhpc3RvcnlWYWx1ZSxcbiAgICAgICAgICBoaXN0b3J5OiBzdGF0ZVZhbHVlLmhpc3RvcnksXG4gICAgICAgICAgYWN0aW9uczogW10sXG4gICAgICAgICAgYWN0aXZpdGllczogc3RhdGVWYWx1ZS5hY3Rpdml0aWVzLFxuICAgICAgICAgIG1ldGE6IHt9LFxuICAgICAgICAgIGV2ZW50czogW10sXG4gICAgICAgICAgY29uZmlndXJhdGlvbjogW10sXG4gICAgICAgICAgdHJhbnNpdGlvbnM6IFtdLFxuICAgICAgICAgIGNoaWxkcmVuOiB7fVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0YXRlVmFsdWU7XG4gICAgfVxuXG4gICAgdmFyIF9ldmVudCA9IGluaXRFdmVudDtcbiAgICByZXR1cm4gbmV3IFN0YXRlKHtcbiAgICAgIHZhbHVlOiBzdGF0ZVZhbHVlLFxuICAgICAgY29udGV4dDogY29udGV4dCxcbiAgICAgIF9ldmVudDogX2V2ZW50LFxuICAgICAgX3Nlc3Npb25pZDogbnVsbCxcbiAgICAgIGhpc3RvcnlWYWx1ZTogdW5kZWZpbmVkLFxuICAgICAgaGlzdG9yeTogdW5kZWZpbmVkLFxuICAgICAgYWN0aW9uczogW10sXG4gICAgICBhY3Rpdml0aWVzOiB1bmRlZmluZWQsXG4gICAgICBtZXRhOiB1bmRlZmluZWQsXG4gICAgICBldmVudHM6IFtdLFxuICAgICAgY29uZmlndXJhdGlvbjogW10sXG4gICAgICB0cmFuc2l0aW9uczogW10sXG4gICAgICBjaGlsZHJlbjoge31cbiAgICB9KTtcbiAgfTtcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhIG5ldyBTdGF0ZSBpbnN0YW5jZSBmb3IgdGhlIGdpdmVuIGBjb25maWdgLlxyXG4gICAqIEBwYXJhbSBjb25maWcgVGhlIHN0YXRlIGNvbmZpZ1xyXG4gICAqL1xuXG5cbiAgU3RhdGUuY3JlYXRlID0gZnVuY3Rpb24gKGNvbmZpZykge1xuICAgIHJldHVybiBuZXcgU3RhdGUoY29uZmlnKTtcbiAgfTtcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyBhIG5ldyBgU3RhdGVgIGluc3RhbmNlIGZvciB0aGUgZ2l2ZW4gYHN0YXRlVmFsdWVgIGFuZCBgY29udGV4dGAgd2l0aCBubyBhY3Rpb25zIChzaWRlLWVmZmVjdHMpLlxyXG4gICAqIEBwYXJhbSBzdGF0ZVZhbHVlXHJcbiAgICogQHBhcmFtIGNvbnRleHRcclxuICAgKi9cblxuXG4gIFN0YXRlLmluZXJ0ID0gZnVuY3Rpb24gKHN0YXRlVmFsdWUsIGNvbnRleHQpIHtcbiAgICBpZiAoc3RhdGVWYWx1ZSBpbnN0YW5jZW9mIFN0YXRlKSB7XG4gICAgICBpZiAoIXN0YXRlVmFsdWUuYWN0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlVmFsdWU7XG4gICAgICB9XG5cbiAgICAgIHZhciBfZXZlbnQgPSBpbml0RXZlbnQ7XG4gICAgICByZXR1cm4gbmV3IFN0YXRlKHtcbiAgICAgICAgdmFsdWU6IHN0YXRlVmFsdWUudmFsdWUsXG4gICAgICAgIGNvbnRleHQ6IGNvbnRleHQsXG4gICAgICAgIF9ldmVudDogX2V2ZW50LFxuICAgICAgICBfc2Vzc2lvbmlkOiBudWxsLFxuICAgICAgICBoaXN0b3J5VmFsdWU6IHN0YXRlVmFsdWUuaGlzdG9yeVZhbHVlLFxuICAgICAgICBoaXN0b3J5OiBzdGF0ZVZhbHVlLmhpc3RvcnksXG4gICAgICAgIGFjdGl2aXRpZXM6IHN0YXRlVmFsdWUuYWN0aXZpdGllcyxcbiAgICAgICAgY29uZmlndXJhdGlvbjogc3RhdGVWYWx1ZS5jb25maWd1cmF0aW9uLFxuICAgICAgICB0cmFuc2l0aW9uczogW10sXG4gICAgICAgIGNoaWxkcmVuOiB7fVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFN0YXRlLmZyb20oc3RhdGVWYWx1ZSwgY29udGV4dCk7XG4gIH07XG4gIC8qKlxyXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2YgYWxsIHRoZSBzdHJpbmcgbGVhZiBzdGF0ZSBub2RlIHBhdGhzLlxyXG4gICAqIEBwYXJhbSBzdGF0ZVZhbHVlXHJcbiAgICogQHBhcmFtIGRlbGltaXRlciBUaGUgY2hhcmFjdGVyKHMpIHRoYXQgc2VwYXJhdGUgZWFjaCBzdWJwYXRoIGluIHRoZSBzdHJpbmcgc3RhdGUgbm9kZSBwYXRoLlxyXG4gICAqL1xuXG5cbiAgU3RhdGUucHJvdG90eXBlLnRvU3RyaW5ncyA9IGZ1bmN0aW9uIChzdGF0ZVZhbHVlLCBkZWxpbWl0ZXIpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKHN0YXRlVmFsdWUgPT09IHZvaWQgMCkge1xuICAgICAgc3RhdGVWYWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKGRlbGltaXRlciA9PT0gdm9pZCAwKSB7XG4gICAgICBkZWxpbWl0ZXIgPSAnLic7XG4gICAgfVxuXG4gICAgaWYgKGlzU3RyaW5nKHN0YXRlVmFsdWUpKSB7XG4gICAgICByZXR1cm4gW3N0YXRlVmFsdWVdO1xuICAgIH1cblxuICAgIHZhciB2YWx1ZUtleXMgPSBPYmplY3Qua2V5cyhzdGF0ZVZhbHVlKTtcbiAgICByZXR1cm4gdmFsdWVLZXlzLmNvbmNhdC5hcHBseSh2YWx1ZUtleXMsIF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZCh2YWx1ZUtleXMubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHJldHVybiBfdGhpcy50b1N0cmluZ3Moc3RhdGVWYWx1ZVtrZXldLCBkZWxpbWl0ZXIpLm1hcChmdW5jdGlvbiAocykge1xuICAgICAgICByZXR1cm4ga2V5ICsgZGVsaW1pdGVyICsgcztcbiAgICAgIH0pO1xuICAgIH0pKSwgZmFsc2UpKTtcbiAgfTtcblxuICBTdGF0ZS5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYSA9IHRoaXM7XG4gICAgICAgIF9hLmNvbmZpZ3VyYXRpb247XG4gICAgICAgIF9hLnRyYW5zaXRpb25zO1xuICAgICAgICB2YXIgdGFncyA9IF9hLnRhZ3M7XG4gICAgICAgIF9hLm1hY2hpbmU7XG4gICAgICAgIHZhciBqc29uVmFsdWVzID0gX19yZXN0KF9hLCBbXCJjb25maWd1cmF0aW9uXCIsIFwidHJhbnNpdGlvbnNcIiwgXCJ0YWdzXCIsIFwibWFjaGluZVwiXSk7XG5cbiAgICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIGpzb25WYWx1ZXMpLCB7XG4gICAgICB0YWdzOiBBcnJheS5mcm9tKHRhZ3MpXG4gICAgfSk7XG4gIH07XG5cbiAgU3RhdGUucHJvdG90eXBlLm1hdGNoZXMgPSBmdW5jdGlvbiAocGFyZW50U3RhdGVWYWx1ZSkge1xuICAgIHJldHVybiBtYXRjaGVzU3RhdGUocGFyZW50U3RhdGVWYWx1ZSwgdGhpcy52YWx1ZSk7XG4gIH07XG4gIC8qKlxyXG4gICAqIFdoZXRoZXIgdGhlIGN1cnJlbnQgc3RhdGUgY29uZmlndXJhdGlvbiBoYXMgYSBzdGF0ZSBub2RlIHdpdGggdGhlIHNwZWNpZmllZCBgdGFnYC5cclxuICAgKiBAcGFyYW0gdGFnXHJcbiAgICovXG5cblxuICBTdGF0ZS5wcm90b3R5cGUuaGFzVGFnID0gZnVuY3Rpb24gKHRhZykge1xuICAgIHJldHVybiB0aGlzLnRhZ3MuaGFzKHRhZyk7XG4gIH07XG4gIC8qKlxyXG4gICAqIERldGVybWluZXMgd2hldGhlciBzZW5kaW5nIHRoZSBgZXZlbnRgIHdpbGwgY2F1c2UgYSBub24tZm9yYmlkZGVuIHRyYW5zaXRpb25cclxuICAgKiB0byBiZSBzZWxlY3RlZCwgZXZlbiBpZiB0aGUgdHJhbnNpdGlvbnMgaGF2ZSBubyBhY3Rpb25zIG5vclxyXG4gICAqIGNoYW5nZSB0aGUgc3RhdGUgdmFsdWUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50IHRvIHRlc3RcclxuICAgKiBAcmV0dXJucyBXaGV0aGVyIHRoZSBldmVudCB3aWxsIGNhdXNlIGEgdHJhbnNpdGlvblxyXG4gICAqL1xuXG5cbiAgU3RhdGUucHJvdG90eXBlLmNhbiA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBfYTtcblxuICAgIGlmIChJU19QUk9EVUNUSU9OKSB7XG4gICAgICB3YXJuKCEhdGhpcy5tYWNoaW5lLCBcInN0YXRlLmNhbiguLi4pIHVzZWQgb3V0c2lkZSBvZiBhIG1hY2hpbmUtY3JlYXRlZCBTdGF0ZSBvYmplY3Q7IHRoaXMgd2lsbCBhbHdheXMgcmV0dXJuIGZhbHNlLlwiKTtcbiAgICB9XG5cbiAgICB2YXIgdHJhbnNpdGlvbkRhdGEgPSAoX2EgPSB0aGlzLm1hY2hpbmUpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5nZXRUcmFuc2l0aW9uRGF0YSh0aGlzLCBldmVudCk7XG4gICAgcmV0dXJuICEhKHRyYW5zaXRpb25EYXRhID09PSBudWxsIHx8IHRyYW5zaXRpb25EYXRhID09PSB2b2lkIDAgPyB2b2lkIDAgOiB0cmFuc2l0aW9uRGF0YS50cmFuc2l0aW9ucy5sZW5ndGgpICYmIC8vIENoZWNrIHRoYXQgYXQgbGVhc3Qgb25lIHRyYW5zaXRpb24gaXMgbm90IGZvcmJpZGRlblxuICAgIHRyYW5zaXRpb25EYXRhLnRyYW5zaXRpb25zLnNvbWUoZnVuY3Rpb24gKHQpIHtcbiAgICAgIHJldHVybiB0LnRhcmdldCAhPT0gdW5kZWZpbmVkIHx8IHQuYWN0aW9ucy5sZW5ndGg7XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIFN0YXRlO1xufSgpO1xuXG5leHBvcnQgeyBTdGF0ZSwgYmluZEFjdGlvblRvU3RhdGUsIGlzU3RhdGUsIGlzU3RhdGVDb25maWcsIHN0YXRlVmFsdWVzRXF1YWwgfTtcbiIsImltcG9ydCB7IF9fYXNzaWduLCBfX3NwcmVhZEFycmF5LCBfX3JlYWQsIF9fdmFsdWVzLCBfX3Jlc3QgfSBmcm9tICcuL192aXJ0dWFsL190c2xpYi5qcyc7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uLCBtYXBWYWx1ZXMsIGlzQXJyYXksIGZsYXR0ZW4sIHRvQXJyYXksIHRvU3RhdGVWYWx1ZSwgaXNTdHJpbmcsIGdldEV2ZW50VHlwZSwgdG9TQ1hNTEV2ZW50LCBtYXRjaGVzU3RhdGUsIHBhdGgsIGV2YWx1YXRlR3VhcmQsIG1hcENvbnRleHQsIGlzUmFpc2FibGVBY3Rpb24sIHBhdGhUb1N0YXRlVmFsdWUsIGlzQnVpbHRJbkV2ZW50LCBwYXJ0aXRpb24sIHVwZGF0ZUhpc3RvcnlWYWx1ZSwgdG9TdGF0ZVBhdGgsIG1hcEZpbHRlclZhbHVlcywgd2FybiwgdG9TdGF0ZVBhdGhzLCBuZXN0ZWRQYXRoLCBub3JtYWxpemVUYXJnZXQsIHRvR3VhcmQsIHRvVHJhbnNpdGlvbkNvbmZpZ0FycmF5LCBpc01hY2hpbmUsIGNyZWF0ZUludm9rZUlkIH0gZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQgeyBTdGF0ZSwgc3RhdGVWYWx1ZXNFcXVhbCB9IGZyb20gJy4vU3RhdGUuanMnO1xuaW1wb3J0IHsgc3RhcnQgYXMgc3RhcnQkMSwgc3RvcCBhcyBzdG9wJDEsIGludm9rZSwgdXBkYXRlLCBudWxsRXZlbnQgfSBmcm9tICcuL2FjdGlvblR5cGVzLmpzJztcbmltcG9ydCB7IGRvbmUsIHN0YXJ0LCB0b0FjdGlvbk9iamVjdHMsIHJhaXNlLCBzdG9wLCByZXNvbHZlQWN0aW9ucywgZG9uZUludm9rZSwgZXJyb3IsIHRvQWN0aW9uT2JqZWN0LCB0b0FjdGl2aXR5RGVmaW5pdGlvbiwgYWZ0ZXIsIHNlbmQsIGNhbmNlbCwgaW5pdEV2ZW50IH0gZnJvbSAnLi9hY3Rpb25zLmpzJztcbmltcG9ydCB7IElTX1BST0RVQ1RJT04gfSBmcm9tICcuL2Vudmlyb25tZW50LmpzJztcbmltcG9ydCB7IFNUQVRFX0RFTElNSVRFUiB9IGZyb20gJy4vY29uc3RhbnRzLmpzJztcbmltcG9ydCB7IGdldEFsbFN0YXRlTm9kZXMsIGdldENvbmZpZ3VyYXRpb24sIGlzSW5GaW5hbFN0YXRlLCBnZXRUYWdzRnJvbUNvbmZpZ3VyYXRpb24sIGhhcywgZ2V0Q2hpbGRyZW4sIGdldFZhbHVlLCBpc0xlYWZOb2RlLCBnZXRBbGxDaGlsZHJlbiB9IGZyb20gJy4vc3RhdGVVdGlscy5qcyc7XG5pbXBvcnQgeyBjcmVhdGVJbnZvY2FibGVBY3RvciB9IGZyb20gJy4vQWN0b3IuanMnO1xuaW1wb3J0IHsgdG9JbnZva2VEZWZpbml0aW9uIH0gZnJvbSAnLi9pbnZva2VVdGlscy5qcyc7XG5cbnZhciBOVUxMX0VWRU5UID0gJyc7XG52YXIgU1RBVEVfSURFTlRJRklFUiA9ICcjJztcbnZhciBXSUxEQ0FSRCA9ICcqJztcbnZhciBFTVBUWV9PQkpFQ1QgPSB7fTtcblxudmFyIGlzU3RhdGVJZCA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgcmV0dXJuIHN0clswXSA9PT0gU1RBVEVfSURFTlRJRklFUjtcbn07XG5cbnZhciBjcmVhdGVEZWZhdWx0T3B0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHtcbiAgICBhY3Rpb25zOiB7fSxcbiAgICBndWFyZHM6IHt9LFxuICAgIHNlcnZpY2VzOiB7fSxcbiAgICBhY3Rpdml0aWVzOiB7fSxcbiAgICBkZWxheXM6IHt9XG4gIH07XG59O1xuXG52YXIgdmFsaWRhdGVBcnJheWlmaWVkVHJhbnNpdGlvbnMgPSBmdW5jdGlvbiAoc3RhdGVOb2RlLCBldmVudCwgdHJhbnNpdGlvbnMpIHtcbiAgdmFyIGhhc05vbkxhc3RVbmd1YXJkZWRUYXJnZXQgPSB0cmFuc2l0aW9ucy5zbGljZSgwLCAtMSkuc29tZShmdW5jdGlvbiAodHJhbnNpdGlvbikge1xuICAgIHJldHVybiAhKCdjb25kJyBpbiB0cmFuc2l0aW9uKSAmJiAhKCdpbicgaW4gdHJhbnNpdGlvbikgJiYgKGlzU3RyaW5nKHRyYW5zaXRpb24udGFyZ2V0KSB8fCBpc01hY2hpbmUodHJhbnNpdGlvbi50YXJnZXQpKTtcbiAgfSk7XG4gIHZhciBldmVudFRleHQgPSBldmVudCA9PT0gTlVMTF9FVkVOVCA/ICd0aGUgdHJhbnNpZW50IGV2ZW50JyA6IFwiZXZlbnQgJ1wiLmNvbmNhdChldmVudCwgXCInXCIpO1xuICB3YXJuKCFoYXNOb25MYXN0VW5ndWFyZGVkVGFyZ2V0LCBcIk9uZSBvciBtb3JlIHRyYW5zaXRpb25zIGZvciBcIi5jb25jYXQoZXZlbnRUZXh0LCBcIiBvbiBzdGF0ZSAnXCIpLmNvbmNhdChzdGF0ZU5vZGUuaWQsIFwiJyBhcmUgdW5yZWFjaGFibGUuIFwiKSArIFwiTWFrZSBzdXJlIHRoYXQgdGhlIGRlZmF1bHQgdHJhbnNpdGlvbiBpcyB0aGUgbGFzdCBvbmUgZGVmaW5lZC5cIik7XG59O1xuXG52YXIgU3RhdGVOb2RlID1cbi8qI19fUFVSRV9fKi9cblxuLyoqIEBjbGFzcyAqL1xuZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBTdGF0ZU5vZGUoXG4gIC8qKlxyXG4gICAqIFRoZSByYXcgY29uZmlnIHVzZWQgdG8gY3JlYXRlIHRoZSBtYWNoaW5lLlxyXG4gICAqL1xuICBjb25maWcsIG9wdGlvbnMsXG4gIC8qKlxyXG4gICAqIFRoZSBpbml0aWFsIGV4dGVuZGVkIHN0YXRlXHJcbiAgICovXG4gIF9jb250ZXh0LCAvLyBUT0RPOiB0aGlzIGlzIHVuc2FmZSwgYnV0IHdlJ3JlIHJlbW92aW5nIGl0IGluIHY1IGFueXdheVxuICBfc3RhdGVJbmZvKSB7XG4gICAgaWYgKF9jb250ZXh0ID09PSB2b2lkIDApIHtcbiAgICAgIF9jb250ZXh0ID0gJ2NvbnRleHQnIGluIGNvbmZpZyA/IGNvbmZpZy5jb250ZXh0IDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgX2E7XG5cbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLl9jb250ZXh0ID0gX2NvbnRleHQ7XG4gICAgLyoqXHJcbiAgICAgKiBUaGUgb3JkZXIgdGhpcyBzdGF0ZSBub2RlIGFwcGVhcnMuIENvcnJlc3BvbmRzIHRvIHRoZSBpbXBsaWNpdCBTQ1hNTCBkb2N1bWVudCBvcmRlci5cclxuICAgICAqL1xuXG4gICAgdGhpcy5vcmRlciA9IC0xO1xuICAgIHRoaXMuX194c3RhdGVub2RlID0gdHJ1ZTtcbiAgICB0aGlzLl9fY2FjaGUgPSB7XG4gICAgICBldmVudHM6IHVuZGVmaW5lZCxcbiAgICAgIHJlbGF0aXZlVmFsdWU6IG5ldyBNYXAoKSxcbiAgICAgIGluaXRpYWxTdGF0ZVZhbHVlOiB1bmRlZmluZWQsXG4gICAgICBpbml0aWFsU3RhdGU6IHVuZGVmaW5lZCxcbiAgICAgIG9uOiB1bmRlZmluZWQsXG4gICAgICB0cmFuc2l0aW9uczogdW5kZWZpbmVkLFxuICAgICAgY2FuZGlkYXRlczoge30sXG4gICAgICBkZWxheWVkVHJhbnNpdGlvbnM6IHVuZGVmaW5lZFxuICAgIH07XG4gICAgdGhpcy5pZE1hcCA9IHt9O1xuICAgIHRoaXMudGFncyA9IFtdO1xuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oY3JlYXRlRGVmYXVsdE9wdGlvbnMoKSwgb3B0aW9ucyk7XG4gICAgdGhpcy5wYXJlbnQgPSBfc3RhdGVJbmZvID09PSBudWxsIHx8IF9zdGF0ZUluZm8gPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9zdGF0ZUluZm8ucGFyZW50O1xuICAgIHRoaXMua2V5ID0gdGhpcy5jb25maWcua2V5IHx8IChfc3RhdGVJbmZvID09PSBudWxsIHx8IF9zdGF0ZUluZm8gPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9zdGF0ZUluZm8ua2V5KSB8fCB0aGlzLmNvbmZpZy5pZCB8fCAnKG1hY2hpbmUpJztcbiAgICB0aGlzLm1hY2hpbmUgPSB0aGlzLnBhcmVudCA/IHRoaXMucGFyZW50Lm1hY2hpbmUgOiB0aGlzO1xuICAgIHRoaXMucGF0aCA9IHRoaXMucGFyZW50ID8gdGhpcy5wYXJlbnQucGF0aC5jb25jYXQodGhpcy5rZXkpIDogW107XG4gICAgdGhpcy5kZWxpbWl0ZXIgPSB0aGlzLmNvbmZpZy5kZWxpbWl0ZXIgfHwgKHRoaXMucGFyZW50ID8gdGhpcy5wYXJlbnQuZGVsaW1pdGVyIDogU1RBVEVfREVMSU1JVEVSKTtcbiAgICB0aGlzLmlkID0gdGhpcy5jb25maWcuaWQgfHwgX19zcHJlYWRBcnJheShbdGhpcy5tYWNoaW5lLmtleV0sIF9fcmVhZCh0aGlzLnBhdGgpLCBmYWxzZSkuam9pbih0aGlzLmRlbGltaXRlcik7XG4gICAgdGhpcy52ZXJzaW9uID0gdGhpcy5wYXJlbnQgPyB0aGlzLnBhcmVudC52ZXJzaW9uIDogdGhpcy5jb25maWcudmVyc2lvbjtcbiAgICB0aGlzLnR5cGUgPSB0aGlzLmNvbmZpZy50eXBlIHx8ICh0aGlzLmNvbmZpZy5wYXJhbGxlbCA/ICdwYXJhbGxlbCcgOiB0aGlzLmNvbmZpZy5zdGF0ZXMgJiYgT2JqZWN0LmtleXModGhpcy5jb25maWcuc3RhdGVzKS5sZW5ndGggPyAnY29tcG91bmQnIDogdGhpcy5jb25maWcuaGlzdG9yeSA/ICdoaXN0b3J5JyA6ICdhdG9taWMnKTtcbiAgICB0aGlzLnNjaGVtYSA9IHRoaXMucGFyZW50ID8gdGhpcy5tYWNoaW5lLnNjaGVtYSA6IChfYSA9IHRoaXMuY29uZmlnLnNjaGVtYSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDoge307XG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IHRoaXMuY29uZmlnLmRlc2NyaXB0aW9uO1xuXG4gICAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgICB3YXJuKCEoJ3BhcmFsbGVsJyBpbiB0aGlzLmNvbmZpZyksIFwiVGhlIFxcXCJwYXJhbGxlbFxcXCIgcHJvcGVydHkgaXMgZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHZlcnNpb24gNC4xLiBcIi5jb25jYXQodGhpcy5jb25maWcucGFyYWxsZWwgPyBcIlJlcGxhY2Ugd2l0aCBgdHlwZTogJ3BhcmFsbGVsJ2BcIiA6IFwiVXNlIGB0eXBlOiAnXCIuY29uY2F0KHRoaXMudHlwZSwgXCInYFwiKSwgXCIgaW4gdGhlIGNvbmZpZyBmb3Igc3RhdGUgbm9kZSAnXCIpLmNvbmNhdCh0aGlzLmlkLCBcIicgaW5zdGVhZC5cIikpO1xuICAgIH1cblxuICAgIHRoaXMuaW5pdGlhbCA9IHRoaXMuY29uZmlnLmluaXRpYWw7XG4gICAgdGhpcy5zdGF0ZXMgPSB0aGlzLmNvbmZpZy5zdGF0ZXMgPyBtYXBWYWx1ZXModGhpcy5jb25maWcuc3RhdGVzLCBmdW5jdGlvbiAoc3RhdGVDb25maWcsIGtleSkge1xuICAgICAgdmFyIF9hO1xuXG4gICAgICB2YXIgc3RhdGVOb2RlID0gbmV3IFN0YXRlTm9kZShzdGF0ZUNvbmZpZywge30sIHVuZGVmaW5lZCwge1xuICAgICAgICBwYXJlbnQ6IF90aGlzLFxuICAgICAgICBrZXk6IGtleVxuICAgICAgfSk7XG4gICAgICBPYmplY3QuYXNzaWduKF90aGlzLmlkTWFwLCBfX2Fzc2lnbigoX2EgPSB7fSwgX2Fbc3RhdGVOb2RlLmlkXSA9IHN0YXRlTm9kZSwgX2EpLCBzdGF0ZU5vZGUuaWRNYXApKTtcbiAgICAgIHJldHVybiBzdGF0ZU5vZGU7XG4gICAgfSkgOiBFTVBUWV9PQkpFQ1Q7IC8vIERvY3VtZW50IG9yZGVyXG5cbiAgICB2YXIgb3JkZXIgPSAwO1xuXG4gICAgZnVuY3Rpb24gZGZzKHN0YXRlTm9kZSkge1xuICAgICAgdmFyIGVfMSwgX2E7XG5cbiAgICAgIHN0YXRlTm9kZS5vcmRlciA9IG9yZGVyKys7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAodmFyIF9iID0gX192YWx1ZXMoZ2V0QWxsQ2hpbGRyZW4oc3RhdGVOb2RlKSksIF9jID0gX2IubmV4dCgpOyAhX2MuZG9uZTsgX2MgPSBfYi5uZXh0KCkpIHtcbiAgICAgICAgICB2YXIgY2hpbGQgPSBfYy52YWx1ZTtcbiAgICAgICAgICBkZnMoY2hpbGQpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlXzFfMSkge1xuICAgICAgICBlXzEgPSB7XG4gICAgICAgICAgZXJyb3I6IGVfMV8xXG4gICAgICAgIH07XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChfYyAmJiAhX2MuZG9uZSAmJiAoX2EgPSBfYi5yZXR1cm4pKSBfYS5jYWxsKF9iKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBpZiAoZV8xKSB0aHJvdyBlXzEuZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBkZnModGhpcyk7IC8vIEhpc3RvcnkgY29uZmlnXG5cbiAgICB0aGlzLmhpc3RvcnkgPSB0aGlzLmNvbmZpZy5oaXN0b3J5ID09PSB0cnVlID8gJ3NoYWxsb3cnIDogdGhpcy5jb25maWcuaGlzdG9yeSB8fCBmYWxzZTtcbiAgICB0aGlzLl90cmFuc2llbnQgPSAhIXRoaXMuY29uZmlnLmFsd2F5cyB8fCAoIXRoaXMuY29uZmlnLm9uID8gZmFsc2UgOiBBcnJheS5pc0FycmF5KHRoaXMuY29uZmlnLm9uKSA/IHRoaXMuY29uZmlnLm9uLnNvbWUoZnVuY3Rpb24gKF9hKSB7XG4gICAgICB2YXIgZXZlbnQgPSBfYS5ldmVudDtcbiAgICAgIHJldHVybiBldmVudCA9PT0gTlVMTF9FVkVOVDtcbiAgICB9KSA6IE5VTExfRVZFTlQgaW4gdGhpcy5jb25maWcub24pO1xuICAgIHRoaXMuc3RyaWN0ID0gISF0aGlzLmNvbmZpZy5zdHJpY3Q7IC8vIFRPRE86IGRlcHJlY2F0ZSAoZW50cnkpXG5cbiAgICB0aGlzLm9uRW50cnkgPSB0b0FycmF5KHRoaXMuY29uZmlnLmVudHJ5IHx8IHRoaXMuY29uZmlnLm9uRW50cnkpLm1hcChmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICByZXR1cm4gdG9BY3Rpb25PYmplY3QoYWN0aW9uKTtcbiAgICB9KTsgLy8gVE9ETzogZGVwcmVjYXRlIChleGl0KVxuXG4gICAgdGhpcy5vbkV4aXQgPSB0b0FycmF5KHRoaXMuY29uZmlnLmV4aXQgfHwgdGhpcy5jb25maWcub25FeGl0KS5tYXAoZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgcmV0dXJuIHRvQWN0aW9uT2JqZWN0KGFjdGlvbik7XG4gICAgfSk7XG4gICAgdGhpcy5tZXRhID0gdGhpcy5jb25maWcubWV0YTtcbiAgICB0aGlzLmRvbmVEYXRhID0gdGhpcy50eXBlID09PSAnZmluYWwnID8gdGhpcy5jb25maWcuZGF0YSA6IHVuZGVmaW5lZDtcbiAgICB0aGlzLmludm9rZSA9IHRvQXJyYXkodGhpcy5jb25maWcuaW52b2tlKS5tYXAoZnVuY3Rpb24gKGludm9rZUNvbmZpZywgaSkge1xuICAgICAgdmFyIF9hLCBfYjtcblxuICAgICAgaWYgKGlzTWFjaGluZShpbnZva2VDb25maWcpKSB7XG4gICAgICAgIHZhciBpbnZva2VJZCA9IGNyZWF0ZUludm9rZUlkKF90aGlzLmlkLCBpKTtcbiAgICAgICAgX3RoaXMubWFjaGluZS5vcHRpb25zLnNlcnZpY2VzID0gX19hc3NpZ24oKF9hID0ge30sIF9hW2ludm9rZUlkXSA9IGludm9rZUNvbmZpZywgX2EpLCBfdGhpcy5tYWNoaW5lLm9wdGlvbnMuc2VydmljZXMpO1xuICAgICAgICByZXR1cm4gdG9JbnZva2VEZWZpbml0aW9uKHtcbiAgICAgICAgICBzcmM6IGludm9rZUlkLFxuICAgICAgICAgIGlkOiBpbnZva2VJZFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoaXNTdHJpbmcoaW52b2tlQ29uZmlnLnNyYykpIHtcbiAgICAgICAgdmFyIGludm9rZUlkID0gaW52b2tlQ29uZmlnLmlkIHx8IGNyZWF0ZUludm9rZUlkKF90aGlzLmlkLCBpKTtcbiAgICAgICAgcmV0dXJuIHRvSW52b2tlRGVmaW5pdGlvbihfX2Fzc2lnbihfX2Fzc2lnbih7fSwgaW52b2tlQ29uZmlnKSwge1xuICAgICAgICAgIGlkOiBpbnZva2VJZCxcbiAgICAgICAgICBzcmM6IGludm9rZUNvbmZpZy5zcmNcbiAgICAgICAgfSkpO1xuICAgICAgfSBlbHNlIGlmIChpc01hY2hpbmUoaW52b2tlQ29uZmlnLnNyYykgfHwgaXNGdW5jdGlvbihpbnZva2VDb25maWcuc3JjKSkge1xuICAgICAgICB2YXIgaW52b2tlSWQgPSBpbnZva2VDb25maWcuaWQgfHwgY3JlYXRlSW52b2tlSWQoX3RoaXMuaWQsIGkpO1xuICAgICAgICBfdGhpcy5tYWNoaW5lLm9wdGlvbnMuc2VydmljZXMgPSBfX2Fzc2lnbigoX2IgPSB7fSwgX2JbaW52b2tlSWRdID0gaW52b2tlQ29uZmlnLnNyYywgX2IpLCBfdGhpcy5tYWNoaW5lLm9wdGlvbnMuc2VydmljZXMpO1xuICAgICAgICByZXR1cm4gdG9JbnZva2VEZWZpbml0aW9uKF9fYXNzaWduKF9fYXNzaWduKHtcbiAgICAgICAgICBpZDogaW52b2tlSWRcbiAgICAgICAgfSwgaW52b2tlQ29uZmlnKSwge1xuICAgICAgICAgIHNyYzogaW52b2tlSWRcbiAgICAgICAgfSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGludm9rZVNvdXJjZSA9IGludm9rZUNvbmZpZy5zcmM7XG4gICAgICAgIHJldHVybiB0b0ludm9rZURlZmluaXRpb24oX19hc3NpZ24oX19hc3NpZ24oe1xuICAgICAgICAgIGlkOiBjcmVhdGVJbnZva2VJZChfdGhpcy5pZCwgaSlcbiAgICAgICAgfSwgaW52b2tlQ29uZmlnKSwge1xuICAgICAgICAgIHNyYzogaW52b2tlU291cmNlXG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmFjdGl2aXRpZXMgPSB0b0FycmF5KHRoaXMuY29uZmlnLmFjdGl2aXRpZXMpLmNvbmNhdCh0aGlzLmludm9rZSkubWFwKGZ1bmN0aW9uIChhY3Rpdml0eSkge1xuICAgICAgcmV0dXJuIHRvQWN0aXZpdHlEZWZpbml0aW9uKGFjdGl2aXR5KTtcbiAgICB9KTtcbiAgICB0aGlzLnRyYW5zaXRpb24gPSB0aGlzLnRyYW5zaXRpb24uYmluZCh0aGlzKTtcbiAgICB0aGlzLnRhZ3MgPSB0b0FycmF5KHRoaXMuY29uZmlnLnRhZ3MpOyAvLyBUT0RPOiB0aGlzIGlzIHRoZSByZWFsIGZpeCBmb3IgaW5pdGlhbGl6YXRpb24gb25jZVxuICAgIC8vIHN0YXRlIG5vZGUgZ2V0dGVycyBhcmUgZGVwcmVjYXRlZFxuICAgIC8vIGlmICghdGhpcy5wYXJlbnQpIHtcbiAgICAvLyAgIHRoaXMuX2luaXQoKTtcbiAgICAvLyB9XG4gIH1cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLl9fY2FjaGUudHJhbnNpdGlvbnMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBnZXRBbGxTdGF0ZU5vZGVzKHRoaXMpLmZvckVhY2goZnVuY3Rpb24gKHN0YXRlTm9kZSkge1xuICAgICAgcmV0dXJuIHN0YXRlTm9kZS5vbjtcbiAgICB9KTtcbiAgfTtcbiAgLyoqXHJcbiAgICogQ2xvbmVzIHRoaXMgc3RhdGUgbWFjaGluZSB3aXRoIGN1c3RvbSBvcHRpb25zIGFuZCBjb250ZXh0LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyAoYWN0aW9ucywgZ3VhcmRzLCBhY3Rpdml0aWVzLCBzZXJ2aWNlcykgdG8gcmVjdXJzaXZlbHkgbWVyZ2Ugd2l0aCB0aGUgZXhpc3Rpbmcgb3B0aW9ucy5cclxuICAgKiBAcGFyYW0gY29udGV4dCBDdXN0b20gY29udGV4dCAod2lsbCBvdmVycmlkZSBwcmVkZWZpbmVkIGNvbnRleHQpXHJcbiAgICovXG5cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLndpdGhDb25maWcgPSBmdW5jdGlvbiAob3B0aW9ucywgY29udGV4dCkge1xuICAgIHZhciBfYSA9IHRoaXMub3B0aW9ucyxcbiAgICAgICAgYWN0aW9ucyA9IF9hLmFjdGlvbnMsXG4gICAgICAgIGFjdGl2aXRpZXMgPSBfYS5hY3Rpdml0aWVzLFxuICAgICAgICBndWFyZHMgPSBfYS5ndWFyZHMsXG4gICAgICAgIHNlcnZpY2VzID0gX2Euc2VydmljZXMsXG4gICAgICAgIGRlbGF5cyA9IF9hLmRlbGF5cztcbiAgICByZXR1cm4gbmV3IFN0YXRlTm9kZSh0aGlzLmNvbmZpZywge1xuICAgICAgYWN0aW9uczogX19hc3NpZ24oX19hc3NpZ24oe30sIGFjdGlvbnMpLCBvcHRpb25zLmFjdGlvbnMpLFxuICAgICAgYWN0aXZpdGllczogX19hc3NpZ24oX19hc3NpZ24oe30sIGFjdGl2aXRpZXMpLCBvcHRpb25zLmFjdGl2aXRpZXMpLFxuICAgICAgZ3VhcmRzOiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgZ3VhcmRzKSwgb3B0aW9ucy5ndWFyZHMpLFxuICAgICAgc2VydmljZXM6IF9fYXNzaWduKF9fYXNzaWduKHt9LCBzZXJ2aWNlcyksIG9wdGlvbnMuc2VydmljZXMpLFxuICAgICAgZGVsYXlzOiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgZGVsYXlzKSwgb3B0aW9ucy5kZWxheXMpXG4gICAgfSwgY29udGV4dCAhPT0gbnVsbCAmJiBjb250ZXh0ICE9PSB2b2lkIDAgPyBjb250ZXh0IDogdGhpcy5jb250ZXh0KTtcbiAgfTtcbiAgLyoqXHJcbiAgICogQ2xvbmVzIHRoaXMgc3RhdGUgbWFjaGluZSB3aXRoIGN1c3RvbSBjb250ZXh0LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGNvbnRleHQgQ3VzdG9tIGNvbnRleHQgKHdpbGwgb3ZlcnJpZGUgcHJlZGVmaW5lZCBjb250ZXh0LCBub3QgcmVjdXJzaXZlKVxyXG4gICAqL1xuXG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS53aXRoQ29udGV4dCA9IGZ1bmN0aW9uIChjb250ZXh0KSB7XG4gICAgcmV0dXJuIG5ldyBTdGF0ZU5vZGUodGhpcy5jb25maWcsIHRoaXMub3B0aW9ucywgY29udGV4dCk7XG4gIH07XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0YXRlTm9kZS5wcm90b3R5cGUsIFwiY29udGV4dFwiLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gaXNGdW5jdGlvbih0aGlzLl9jb250ZXh0KSA/IHRoaXMuX2NvbnRleHQoKSA6IHRoaXMuX2NvbnRleHQ7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdGF0ZU5vZGUucHJvdG90eXBlLCBcImRlZmluaXRpb25cIiwge1xuICAgIC8qKlxyXG4gICAgICogVGhlIHdlbGwtc3RydWN0dXJlZCBzdGF0ZSBub2RlIGRlZmluaXRpb24uXHJcbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAgICBrZXk6IHRoaXMua2V5LFxuICAgICAgICB2ZXJzaW9uOiB0aGlzLnZlcnNpb24sXG4gICAgICAgIGNvbnRleHQ6IHRoaXMuY29udGV4dCxcbiAgICAgICAgdHlwZTogdGhpcy50eXBlLFxuICAgICAgICBpbml0aWFsOiB0aGlzLmluaXRpYWwsXG4gICAgICAgIGhpc3Rvcnk6IHRoaXMuaGlzdG9yeSxcbiAgICAgICAgc3RhdGVzOiBtYXBWYWx1ZXModGhpcy5zdGF0ZXMsIGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgICAgIHJldHVybiBzdGF0ZS5kZWZpbml0aW9uO1xuICAgICAgICB9KSxcbiAgICAgICAgb246IHRoaXMub24sXG4gICAgICAgIHRyYW5zaXRpb25zOiB0aGlzLnRyYW5zaXRpb25zLFxuICAgICAgICBlbnRyeTogdGhpcy5vbkVudHJ5LFxuICAgICAgICBleGl0OiB0aGlzLm9uRXhpdCxcbiAgICAgICAgYWN0aXZpdGllczogdGhpcy5hY3Rpdml0aWVzIHx8IFtdLFxuICAgICAgICBtZXRhOiB0aGlzLm1ldGEsXG4gICAgICAgIG9yZGVyOiB0aGlzLm9yZGVyIHx8IC0xLFxuICAgICAgICBkYXRhOiB0aGlzLmRvbmVEYXRhLFxuICAgICAgICBpbnZva2U6IHRoaXMuaW52b2tlLFxuICAgICAgICBkZXNjcmlwdGlvbjogdGhpcy5kZXNjcmlwdGlvbixcbiAgICAgICAgdGFnczogdGhpcy50YWdzXG4gICAgICB9O1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmRlZmluaXRpb247XG4gIH07XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0YXRlTm9kZS5wcm90b3R5cGUsIFwib25cIiwge1xuICAgIC8qKlxyXG4gICAgICogVGhlIG1hcHBpbmcgb2YgZXZlbnRzIHRvIHRyYW5zaXRpb25zLlxyXG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5fX2NhY2hlLm9uKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fY2FjaGUub247XG4gICAgICB9XG5cbiAgICAgIHZhciB0cmFuc2l0aW9ucyA9IHRoaXMudHJhbnNpdGlvbnM7XG4gICAgICByZXR1cm4gdGhpcy5fX2NhY2hlLm9uID0gdHJhbnNpdGlvbnMucmVkdWNlKGZ1bmN0aW9uIChtYXAsIHRyYW5zaXRpb24pIHtcbiAgICAgICAgbWFwW3RyYW5zaXRpb24uZXZlbnRUeXBlXSA9IG1hcFt0cmFuc2l0aW9uLmV2ZW50VHlwZV0gfHwgW107XG4gICAgICAgIG1hcFt0cmFuc2l0aW9uLmV2ZW50VHlwZV0ucHVzaCh0cmFuc2l0aW9uKTtcbiAgICAgICAgcmV0dXJuIG1hcDtcbiAgICAgIH0sIHt9KTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0YXRlTm9kZS5wcm90b3R5cGUsIFwiYWZ0ZXJcIiwge1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX19jYWNoZS5kZWxheWVkVHJhbnNpdGlvbnMgfHwgKHRoaXMuX19jYWNoZS5kZWxheWVkVHJhbnNpdGlvbnMgPSB0aGlzLmdldERlbGF5ZWRUcmFuc2l0aW9ucygpLCB0aGlzLl9fY2FjaGUuZGVsYXllZFRyYW5zaXRpb25zKTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0YXRlTm9kZS5wcm90b3R5cGUsIFwidHJhbnNpdGlvbnNcIiwge1xuICAgIC8qKlxyXG4gICAgICogQWxsIHRoZSB0cmFuc2l0aW9ucyB0aGF0IGNhbiBiZSB0YWtlbiBmcm9tIHRoaXMgc3RhdGUgbm9kZS5cclxuICAgICAqL1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX19jYWNoZS50cmFuc2l0aW9ucyB8fCAodGhpcy5fX2NhY2hlLnRyYW5zaXRpb25zID0gdGhpcy5mb3JtYXRUcmFuc2l0aW9ucygpLCB0aGlzLl9fY2FjaGUudHJhbnNpdGlvbnMpO1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZ2V0Q2FuZGlkYXRlcyA9IGZ1bmN0aW9uIChldmVudE5hbWUpIHtcbiAgICBpZiAodGhpcy5fX2NhY2hlLmNhbmRpZGF0ZXNbZXZlbnROYW1lXSkge1xuICAgICAgcmV0dXJuIHRoaXMuX19jYWNoZS5jYW5kaWRhdGVzW2V2ZW50TmFtZV07XG4gICAgfVxuXG4gICAgdmFyIHRyYW5zaWVudCA9IGV2ZW50TmFtZSA9PT0gTlVMTF9FVkVOVDtcbiAgICB2YXIgY2FuZGlkYXRlcyA9IHRoaXMudHJhbnNpdGlvbnMuZmlsdGVyKGZ1bmN0aW9uICh0cmFuc2l0aW9uKSB7XG4gICAgICB2YXIgc2FtZUV2ZW50VHlwZSA9IHRyYW5zaXRpb24uZXZlbnRUeXBlID09PSBldmVudE5hbWU7IC8vIG51bGwgZXZlbnRzIHNob3VsZCBvbmx5IG1hdGNoIGFnYWluc3QgZXZlbnRsZXNzIHRyYW5zaXRpb25zXG5cbiAgICAgIHJldHVybiB0cmFuc2llbnQgPyBzYW1lRXZlbnRUeXBlIDogc2FtZUV2ZW50VHlwZSB8fCB0cmFuc2l0aW9uLmV2ZW50VHlwZSA9PT0gV0lMRENBUkQ7XG4gICAgfSk7XG4gICAgdGhpcy5fX2NhY2hlLmNhbmRpZGF0ZXNbZXZlbnROYW1lXSA9IGNhbmRpZGF0ZXM7XG4gICAgcmV0dXJuIGNhbmRpZGF0ZXM7XG4gIH07XG4gIC8qKlxyXG4gICAqIEFsbCBkZWxheWVkIHRyYW5zaXRpb25zIGZyb20gdGhlIGNvbmZpZy5cclxuICAgKi9cblxuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZ2V0RGVsYXllZFRyYW5zaXRpb25zID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgYWZ0ZXJDb25maWcgPSB0aGlzLmNvbmZpZy5hZnRlcjtcblxuICAgIGlmICghYWZ0ZXJDb25maWcpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICB2YXIgbXV0YXRlRW50cnlFeGl0ID0gZnVuY3Rpb24gKGRlbGF5LCBpKSB7XG4gICAgICB2YXIgZGVsYXlSZWYgPSBpc0Z1bmN0aW9uKGRlbGF5KSA/IFwiXCIuY29uY2F0KF90aGlzLmlkLCBcIjpkZWxheVtcIikuY29uY2F0KGksIFwiXVwiKSA6IGRlbGF5O1xuICAgICAgdmFyIGV2ZW50VHlwZSA9IGFmdGVyKGRlbGF5UmVmLCBfdGhpcy5pZCk7XG5cbiAgICAgIF90aGlzLm9uRW50cnkucHVzaChzZW5kKGV2ZW50VHlwZSwge1xuICAgICAgICBkZWxheTogZGVsYXlcbiAgICAgIH0pKTtcblxuICAgICAgX3RoaXMub25FeGl0LnB1c2goY2FuY2VsKGV2ZW50VHlwZSkpO1xuXG4gICAgICByZXR1cm4gZXZlbnRUeXBlO1xuICAgIH07XG5cbiAgICB2YXIgZGVsYXllZFRyYW5zaXRpb25zID0gaXNBcnJheShhZnRlckNvbmZpZykgPyBhZnRlckNvbmZpZy5tYXAoZnVuY3Rpb24gKHRyYW5zaXRpb24sIGkpIHtcbiAgICAgIHZhciBldmVudFR5cGUgPSBtdXRhdGVFbnRyeUV4aXQodHJhbnNpdGlvbi5kZWxheSwgaSk7XG4gICAgICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIHRyYW5zaXRpb24pLCB7XG4gICAgICAgIGV2ZW50OiBldmVudFR5cGVcbiAgICAgIH0pO1xuICAgIH0pIDogZmxhdHRlbihPYmplY3Qua2V5cyhhZnRlckNvbmZpZykubWFwKGZ1bmN0aW9uIChkZWxheSwgaSkge1xuICAgICAgdmFyIGNvbmZpZ1RyYW5zaXRpb24gPSBhZnRlckNvbmZpZ1tkZWxheV07XG4gICAgICB2YXIgcmVzb2x2ZWRUcmFuc2l0aW9uID0gaXNTdHJpbmcoY29uZmlnVHJhbnNpdGlvbikgPyB7XG4gICAgICAgIHRhcmdldDogY29uZmlnVHJhbnNpdGlvblxuICAgICAgfSA6IGNvbmZpZ1RyYW5zaXRpb247XG4gICAgICB2YXIgcmVzb2x2ZWREZWxheSA9ICFpc05hTigrZGVsYXkpID8gK2RlbGF5IDogZGVsYXk7XG4gICAgICB2YXIgZXZlbnRUeXBlID0gbXV0YXRlRW50cnlFeGl0KHJlc29sdmVkRGVsYXksIGkpO1xuICAgICAgcmV0dXJuIHRvQXJyYXkocmVzb2x2ZWRUcmFuc2l0aW9uKS5tYXAoZnVuY3Rpb24gKHRyYW5zaXRpb24pIHtcbiAgICAgICAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCB0cmFuc2l0aW9uKSwge1xuICAgICAgICAgIGV2ZW50OiBldmVudFR5cGUsXG4gICAgICAgICAgZGVsYXk6IHJlc29sdmVkRGVsYXlcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KSk7XG4gICAgcmV0dXJuIGRlbGF5ZWRUcmFuc2l0aW9ucy5tYXAoZnVuY3Rpb24gKGRlbGF5ZWRUcmFuc2l0aW9uKSB7XG4gICAgICB2YXIgZGVsYXkgPSBkZWxheWVkVHJhbnNpdGlvbi5kZWxheTtcbiAgICAgIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgX3RoaXMuZm9ybWF0VHJhbnNpdGlvbihkZWxheWVkVHJhbnNpdGlvbikpLCB7XG4gICAgICAgIGRlbGF5OiBkZWxheVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIHN0YXRlIG5vZGVzIHJlcHJlc2VudGVkIGJ5IHRoZSBjdXJyZW50IHN0YXRlIHZhbHVlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHN0YXRlIFRoZSBzdGF0ZSB2YWx1ZSBvciBTdGF0ZSBpbnN0YW5jZVxyXG4gICAqL1xuXG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5nZXRTdGF0ZU5vZGVzID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgdmFyIF9hO1xuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGlmICghc3RhdGUpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICB2YXIgc3RhdGVWYWx1ZSA9IHN0YXRlIGluc3RhbmNlb2YgU3RhdGUgPyBzdGF0ZS52YWx1ZSA6IHRvU3RhdGVWYWx1ZShzdGF0ZSwgdGhpcy5kZWxpbWl0ZXIpO1xuXG4gICAgaWYgKGlzU3RyaW5nKHN0YXRlVmFsdWUpKSB7XG4gICAgICB2YXIgaW5pdGlhbFN0YXRlVmFsdWUgPSB0aGlzLmdldFN0YXRlTm9kZShzdGF0ZVZhbHVlKS5pbml0aWFsO1xuICAgICAgcmV0dXJuIGluaXRpYWxTdGF0ZVZhbHVlICE9PSB1bmRlZmluZWQgPyB0aGlzLmdldFN0YXRlTm9kZXMoKF9hID0ge30sIF9hW3N0YXRlVmFsdWVdID0gaW5pdGlhbFN0YXRlVmFsdWUsIF9hKSkgOiBbdGhpcywgdGhpcy5zdGF0ZXNbc3RhdGVWYWx1ZV1dO1xuICAgIH1cblxuICAgIHZhciBzdWJTdGF0ZUtleXMgPSBPYmplY3Qua2V5cyhzdGF0ZVZhbHVlKTtcbiAgICB2YXIgc3ViU3RhdGVOb2RlcyA9IFt0aGlzXTtcbiAgICBzdWJTdGF0ZU5vZGVzLnB1c2guYXBwbHkoc3ViU3RhdGVOb2RlcywgX19zcHJlYWRBcnJheShbXSwgX19yZWFkKGZsYXR0ZW4oc3ViU3RhdGVLZXlzLm1hcChmdW5jdGlvbiAoc3ViU3RhdGVLZXkpIHtcbiAgICAgIHJldHVybiBfdGhpcy5nZXRTdGF0ZU5vZGUoc3ViU3RhdGVLZXkpLmdldFN0YXRlTm9kZXMoc3RhdGVWYWx1ZVtzdWJTdGF0ZUtleV0pO1xuICAgIH0pKSksIGZhbHNlKSk7XG4gICAgcmV0dXJuIHN1YlN0YXRlTm9kZXM7XG4gIH07XG4gIC8qKlxyXG4gICAqIFJldHVybnMgYHRydWVgIGlmIHRoaXMgc3RhdGUgbm9kZSBleHBsaWNpdGx5IGhhbmRsZXMgdGhlIGdpdmVuIGV2ZW50LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGV2ZW50IFRoZSBldmVudCBpbiBxdWVzdGlvblxyXG4gICAqL1xuXG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5oYW5kbGVzID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIGV2ZW50VHlwZSA9IGdldEV2ZW50VHlwZShldmVudCk7XG4gICAgcmV0dXJuIHRoaXMuZXZlbnRzLmluY2x1ZGVzKGV2ZW50VHlwZSk7XG4gIH07XG4gIC8qKlxyXG4gICAqIFJlc29sdmVzIHRoZSBnaXZlbiBgc3RhdGVgIHRvIGEgbmV3IGBTdGF0ZWAgaW5zdGFuY2UgcmVsYXRpdmUgdG8gdGhpcyBtYWNoaW5lLlxyXG4gICAqXHJcbiAgICogVGhpcyBlbnN1cmVzIHRoYXQgYC5ldmVudHNgIGFuZCBgLm5leHRFdmVudHNgIHJlcHJlc2VudCB0aGUgY29ycmVjdCB2YWx1ZXMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gc3RhdGUgVGhlIHN0YXRlIHRvIHJlc29sdmVcclxuICAgKi9cblxuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUucmVzb2x2ZVN0YXRlID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgdmFyIHN0YXRlRnJvbUNvbmZpZyA9IHN0YXRlIGluc3RhbmNlb2YgU3RhdGUgPyBzdGF0ZSA6IFN0YXRlLmNyZWF0ZShzdGF0ZSk7XG4gICAgdmFyIGNvbmZpZ3VyYXRpb24gPSBBcnJheS5mcm9tKGdldENvbmZpZ3VyYXRpb24oW10sIHRoaXMuZ2V0U3RhdGVOb2RlcyhzdGF0ZUZyb21Db25maWcudmFsdWUpKSk7XG4gICAgcmV0dXJuIG5ldyBTdGF0ZShfX2Fzc2lnbihfX2Fzc2lnbih7fSwgc3RhdGVGcm9tQ29uZmlnKSwge1xuICAgICAgdmFsdWU6IHRoaXMucmVzb2x2ZShzdGF0ZUZyb21Db25maWcudmFsdWUpLFxuICAgICAgY29uZmlndXJhdGlvbjogY29uZmlndXJhdGlvbixcbiAgICAgIGRvbmU6IGlzSW5GaW5hbFN0YXRlKGNvbmZpZ3VyYXRpb24sIHRoaXMpLFxuICAgICAgdGFnczogZ2V0VGFnc0Zyb21Db25maWd1cmF0aW9uKGNvbmZpZ3VyYXRpb24pLFxuICAgICAgbWFjaGluZTogdGhpcy5tYWNoaW5lXG4gICAgfSkpO1xuICB9O1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUudHJhbnNpdGlvbkxlYWZOb2RlID0gZnVuY3Rpb24gKHN0YXRlVmFsdWUsIHN0YXRlLCBfZXZlbnQpIHtcbiAgICB2YXIgc3RhdGVOb2RlID0gdGhpcy5nZXRTdGF0ZU5vZGUoc3RhdGVWYWx1ZSk7XG4gICAgdmFyIG5leHQgPSBzdGF0ZU5vZGUubmV4dChzdGF0ZSwgX2V2ZW50KTtcblxuICAgIGlmICghbmV4dCB8fCAhbmV4dC50cmFuc2l0aW9ucy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0aGlzLm5leHQoc3RhdGUsIF9ldmVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5leHQ7XG4gIH07XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS50cmFuc2l0aW9uQ29tcG91bmROb2RlID0gZnVuY3Rpb24gKHN0YXRlVmFsdWUsIHN0YXRlLCBfZXZlbnQpIHtcbiAgICB2YXIgc3ViU3RhdGVLZXlzID0gT2JqZWN0LmtleXMoc3RhdGVWYWx1ZSk7XG4gICAgdmFyIHN0YXRlTm9kZSA9IHRoaXMuZ2V0U3RhdGVOb2RlKHN1YlN0YXRlS2V5c1swXSk7XG5cbiAgICB2YXIgbmV4dCA9IHN0YXRlTm9kZS5fdHJhbnNpdGlvbihzdGF0ZVZhbHVlW3N1YlN0YXRlS2V5c1swXV0sIHN0YXRlLCBfZXZlbnQpO1xuXG4gICAgaWYgKCFuZXh0IHx8ICFuZXh0LnRyYW5zaXRpb25zLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHRoaXMubmV4dChzdGF0ZSwgX2V2ZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV4dDtcbiAgfTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLnRyYW5zaXRpb25QYXJhbGxlbE5vZGUgPSBmdW5jdGlvbiAoc3RhdGVWYWx1ZSwgc3RhdGUsIF9ldmVudCkge1xuICAgIHZhciBlXzIsIF9hO1xuXG4gICAgdmFyIHRyYW5zaXRpb25NYXAgPSB7fTtcblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBfYiA9IF9fdmFsdWVzKE9iamVjdC5rZXlzKHN0YXRlVmFsdWUpKSwgX2MgPSBfYi5uZXh0KCk7ICFfYy5kb25lOyBfYyA9IF9iLm5leHQoKSkge1xuICAgICAgICB2YXIgc3ViU3RhdGVLZXkgPSBfYy52YWx1ZTtcbiAgICAgICAgdmFyIHN1YlN0YXRlVmFsdWUgPSBzdGF0ZVZhbHVlW3N1YlN0YXRlS2V5XTtcblxuICAgICAgICBpZiAoIXN1YlN0YXRlVmFsdWUpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzdWJTdGF0ZU5vZGUgPSB0aGlzLmdldFN0YXRlTm9kZShzdWJTdGF0ZUtleSk7XG5cbiAgICAgICAgdmFyIG5leHQgPSBzdWJTdGF0ZU5vZGUuX3RyYW5zaXRpb24oc3ViU3RhdGVWYWx1ZSwgc3RhdGUsIF9ldmVudCk7XG5cbiAgICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgICB0cmFuc2l0aW9uTWFwW3N1YlN0YXRlS2V5XSA9IG5leHQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzJfMSkge1xuICAgICAgZV8yID0ge1xuICAgICAgICBlcnJvcjogZV8yXzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfYyAmJiAhX2MuZG9uZSAmJiAoX2EgPSBfYi5yZXR1cm4pKSBfYS5jYWxsKF9iKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzIpIHRocm93IGVfMi5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgc3RhdGVUcmFuc2l0aW9ucyA9IE9iamVjdC5rZXlzKHRyYW5zaXRpb25NYXApLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZXR1cm4gdHJhbnNpdGlvbk1hcFtrZXldO1xuICAgIH0pO1xuICAgIHZhciBlbmFibGVkVHJhbnNpdGlvbnMgPSBmbGF0dGVuKHN0YXRlVHJhbnNpdGlvbnMubWFwKGZ1bmN0aW9uIChzdCkge1xuICAgICAgcmV0dXJuIHN0LnRyYW5zaXRpb25zO1xuICAgIH0pKTtcbiAgICB2YXIgd2lsbFRyYW5zaXRpb24gPSBzdGF0ZVRyYW5zaXRpb25zLnNvbWUoZnVuY3Rpb24gKHN0KSB7XG4gICAgICByZXR1cm4gc3QudHJhbnNpdGlvbnMubGVuZ3RoID4gMDtcbiAgICB9KTtcblxuICAgIGlmICghd2lsbFRyYW5zaXRpb24pIHtcbiAgICAgIHJldHVybiB0aGlzLm5leHQoc3RhdGUsIF9ldmVudCk7XG4gICAgfVxuXG4gICAgdmFyIGNvbmZpZ3VyYXRpb24gPSBmbGF0dGVuKE9iamVjdC5rZXlzKHRyYW5zaXRpb25NYXApLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZXR1cm4gdHJhbnNpdGlvbk1hcFtrZXldLmNvbmZpZ3VyYXRpb247XG4gICAgfSkpO1xuICAgIHJldHVybiB7XG4gICAgICB0cmFuc2l0aW9uczogZW5hYmxlZFRyYW5zaXRpb25zLFxuICAgICAgZXhpdFNldDogZmxhdHRlbihzdGF0ZVRyYW5zaXRpb25zLm1hcChmdW5jdGlvbiAodCkge1xuICAgICAgICByZXR1cm4gdC5leGl0U2V0O1xuICAgICAgfSkpLFxuICAgICAgY29uZmlndXJhdGlvbjogY29uZmlndXJhdGlvbixcbiAgICAgIHNvdXJjZTogc3RhdGUsXG4gICAgICBhY3Rpb25zOiBmbGF0dGVuKE9iamVjdC5rZXlzKHRyYW5zaXRpb25NYXApLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHJldHVybiB0cmFuc2l0aW9uTWFwW2tleV0uYWN0aW9ucztcbiAgICAgIH0pKVxuICAgIH07XG4gIH07XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5fdHJhbnNpdGlvbiA9IGZ1bmN0aW9uIChzdGF0ZVZhbHVlLCBzdGF0ZSwgX2V2ZW50KSB7XG4gICAgLy8gbGVhZiBub2RlXG4gICAgaWYgKGlzU3RyaW5nKHN0YXRlVmFsdWUpKSB7XG4gICAgICByZXR1cm4gdGhpcy50cmFuc2l0aW9uTGVhZk5vZGUoc3RhdGVWYWx1ZSwgc3RhdGUsIF9ldmVudCk7XG4gICAgfSAvLyBoaWVyYXJjaGljYWwgbm9kZVxuXG5cbiAgICBpZiAoT2JqZWN0LmtleXMoc3RhdGVWYWx1ZSkubGVuZ3RoID09PSAxKSB7XG4gICAgICByZXR1cm4gdGhpcy50cmFuc2l0aW9uQ29tcG91bmROb2RlKHN0YXRlVmFsdWUsIHN0YXRlLCBfZXZlbnQpO1xuICAgIH0gLy8gb3J0aG9nb25hbCBub2RlXG5cblxuICAgIHJldHVybiB0aGlzLnRyYW5zaXRpb25QYXJhbGxlbE5vZGUoc3RhdGVWYWx1ZSwgc3RhdGUsIF9ldmVudCk7XG4gIH07XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5nZXRUcmFuc2l0aW9uRGF0YSA9IGZ1bmN0aW9uIChzdGF0ZSwgZXZlbnQpIHtcbiAgICByZXR1cm4gdGhpcy5fdHJhbnNpdGlvbihzdGF0ZS52YWx1ZSwgc3RhdGUsIHRvU0NYTUxFdmVudChldmVudCkpO1xuICB9O1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uIChzdGF0ZSwgX2V2ZW50KSB7XG4gICAgdmFyIGVfMywgX2E7XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIGV2ZW50TmFtZSA9IF9ldmVudC5uYW1lO1xuICAgIHZhciBhY3Rpb25zID0gW107XG4gICAgdmFyIG5leHRTdGF0ZU5vZGVzID0gW107XG4gICAgdmFyIHNlbGVjdGVkVHJhbnNpdGlvbjtcblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBfYiA9IF9fdmFsdWVzKHRoaXMuZ2V0Q2FuZGlkYXRlcyhldmVudE5hbWUpKSwgX2MgPSBfYi5uZXh0KCk7ICFfYy5kb25lOyBfYyA9IF9iLm5leHQoKSkge1xuICAgICAgICB2YXIgY2FuZGlkYXRlID0gX2MudmFsdWU7XG4gICAgICAgIHZhciBjb25kID0gY2FuZGlkYXRlLmNvbmQsXG4gICAgICAgICAgICBzdGF0ZUluID0gY2FuZGlkYXRlLmluO1xuICAgICAgICB2YXIgcmVzb2x2ZWRDb250ZXh0ID0gc3RhdGUuY29udGV4dDtcbiAgICAgICAgdmFyIGlzSW5TdGF0ZSA9IHN0YXRlSW4gPyBpc1N0cmluZyhzdGF0ZUluKSAmJiBpc1N0YXRlSWQoc3RhdGVJbikgPyAvLyBDaGVjayBpZiBpbiBzdGF0ZSBieSBJRFxuICAgICAgICBzdGF0ZS5tYXRjaGVzKHRvU3RhdGVWYWx1ZSh0aGlzLmdldFN0YXRlTm9kZUJ5SWQoc3RhdGVJbikucGF0aCwgdGhpcy5kZWxpbWl0ZXIpKSA6IC8vIENoZWNrIGlmIGluIHN0YXRlIGJ5IHJlbGF0aXZlIGdyYW5kcGFyZW50XG4gICAgICAgIG1hdGNoZXNTdGF0ZSh0b1N0YXRlVmFsdWUoc3RhdGVJbiwgdGhpcy5kZWxpbWl0ZXIpLCBwYXRoKHRoaXMucGF0aC5zbGljZSgwLCAtMikpKHN0YXRlLnZhbHVlKSkgOiB0cnVlO1xuICAgICAgICB2YXIgZ3VhcmRQYXNzZWQgPSBmYWxzZTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGd1YXJkUGFzc2VkID0gIWNvbmQgfHwgZXZhbHVhdGVHdWFyZCh0aGlzLm1hY2hpbmUsIGNvbmQsIHJlc29sdmVkQ29udGV4dCwgX2V2ZW50LCBzdGF0ZSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuYWJsZSB0byBldmFsdWF0ZSBndWFyZCAnXCIuY29uY2F0KGNvbmQubmFtZSB8fCBjb25kLnR5cGUsIFwiJyBpbiB0cmFuc2l0aW9uIGZvciBldmVudCAnXCIpLmNvbmNhdChldmVudE5hbWUsIFwiJyBpbiBzdGF0ZSBub2RlICdcIikuY29uY2F0KHRoaXMuaWQsIFwiJzpcXG5cIikuY29uY2F0KGVyci5tZXNzYWdlKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZ3VhcmRQYXNzZWQgJiYgaXNJblN0YXRlKSB7XG4gICAgICAgICAgaWYgKGNhbmRpZGF0ZS50YXJnZXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbmV4dFN0YXRlTm9kZXMgPSBjYW5kaWRhdGUudGFyZ2V0O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGFjdGlvbnMucHVzaC5hcHBseShhY3Rpb25zLCBfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQoY2FuZGlkYXRlLmFjdGlvbnMpLCBmYWxzZSkpO1xuICAgICAgICAgIHNlbGVjdGVkVHJhbnNpdGlvbiA9IGNhbmRpZGF0ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfM18xKSB7XG4gICAgICBlXzMgPSB7XG4gICAgICAgIGVycm9yOiBlXzNfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKF9jICYmICFfYy5kb25lICYmIChfYSA9IF9iLnJldHVybikpIF9hLmNhbGwoX2IpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfMykgdGhyb3cgZV8zLmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghc2VsZWN0ZWRUcmFuc2l0aW9uKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmICghbmV4dFN0YXRlTm9kZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0cmFuc2l0aW9uczogW3NlbGVjdGVkVHJhbnNpdGlvbl0sXG4gICAgICAgIGV4aXRTZXQ6IFtdLFxuICAgICAgICBjb25maWd1cmF0aW9uOiBzdGF0ZS52YWx1ZSA/IFt0aGlzXSA6IFtdLFxuICAgICAgICBzb3VyY2U6IHN0YXRlLFxuICAgICAgICBhY3Rpb25zOiBhY3Rpb25zXG4gICAgICB9O1xuICAgIH1cblxuICAgIHZhciBhbGxOZXh0U3RhdGVOb2RlcyA9IGZsYXR0ZW4obmV4dFN0YXRlTm9kZXMubWFwKGZ1bmN0aW9uIChzdGF0ZU5vZGUpIHtcbiAgICAgIHJldHVybiBfdGhpcy5nZXRSZWxhdGl2ZVN0YXRlTm9kZXMoc3RhdGVOb2RlLCBzdGF0ZS5oaXN0b3J5VmFsdWUpO1xuICAgIH0pKTtcbiAgICB2YXIgaXNJbnRlcm5hbCA9ICEhc2VsZWN0ZWRUcmFuc2l0aW9uLmludGVybmFsO1xuICAgIHJldHVybiB7XG4gICAgICB0cmFuc2l0aW9uczogW3NlbGVjdGVkVHJhbnNpdGlvbl0sXG4gICAgICBleGl0U2V0OiBpc0ludGVybmFsID8gW10gOiBmbGF0dGVuKG5leHRTdGF0ZU5vZGVzLm1hcChmdW5jdGlvbiAodGFyZ2V0Tm9kZSkge1xuICAgICAgICByZXR1cm4gX3RoaXMuZ2V0UG90ZW50aWFsbHlSZWVudGVyaW5nTm9kZXModGFyZ2V0Tm9kZSk7XG4gICAgICB9KSksXG4gICAgICBjb25maWd1cmF0aW9uOiBhbGxOZXh0U3RhdGVOb2RlcyxcbiAgICAgIHNvdXJjZTogc3RhdGUsXG4gICAgICBhY3Rpb25zOiBhY3Rpb25zXG4gICAgfTtcbiAgfTsgLy8gZXZlbiB0aG91Z2ggdGhlIG5hbWUgb2YgdGhpcyBmdW5jdGlvbiBtZW50aW9ucyByZWVudHJ5IG5vZGVzXG4gIC8vIHdlIGFyZSBwdXNoaW5nIGl0cyByZXN1bHQgaW50byBgZXhpdFNldGBcbiAgLy8gdGhhdCdzIGJlY2F1c2Ugd2hhdCB3ZSBleGl0IG1pZ2h0IGJlIHJlZW50ZXJlZCAoaXQncyBhbiBpbnZhcmlhbnQgb2YgcmVlbnRyYW5jeSlcblxuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZ2V0UG90ZW50aWFsbHlSZWVudGVyaW5nTm9kZXMgPSBmdW5jdGlvbiAodGFyZ2V0Tm9kZSkge1xuICAgIGlmICh0aGlzLm9yZGVyIDwgdGFyZ2V0Tm9kZS5vcmRlcikge1xuICAgICAgcmV0dXJuIFt0aGlzXTtcbiAgICB9XG5cbiAgICB2YXIgbm9kZXMgPSBbXTtcbiAgICB2YXIgbWFya2VyID0gdGhpcztcbiAgICB2YXIgcG9zc2libGVBbmNlc3RvciA9IHRhcmdldE5vZGU7XG5cbiAgICB3aGlsZSAobWFya2VyICYmIG1hcmtlciAhPT0gcG9zc2libGVBbmNlc3Rvcikge1xuICAgICAgbm9kZXMucHVzaChtYXJrZXIpO1xuICAgICAgbWFya2VyID0gbWFya2VyLnBhcmVudDtcbiAgICB9XG5cbiAgICBpZiAobWFya2VyICE9PSBwb3NzaWJsZUFuY2VzdG9yKSB7XG4gICAgICAvLyB3ZSBuZXZlciBnb3QgdG8gYHBvc3NpYmxlQW5jZXN0b3JgLCB0aGVyZWZvcmUgdGhlIGluaXRpYWwgYG1hcmtlcmAgXCJlc2NhcGVzXCIgaXRcbiAgICAgIC8vIGl0J3MgaW4gYSBkaWZmZXJlbnQgcGFydCBvZiB0aGUgdHJlZSBzbyBubyBzdGF0ZXMgd2lsbCBiZSByZWVudGVyZWQgZm9yIHN1Y2ggYW4gZXh0ZXJuYWwgdHJhbnNpdGlvblxuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIG5vZGVzLnB1c2gocG9zc2libGVBbmNlc3Rvcik7XG4gICAgcmV0dXJuIG5vZGVzO1xuICB9O1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZ2V0QWN0aW9ucyA9IGZ1bmN0aW9uIChyZXNvbHZlZENvbmZpZywgaXNEb25lLCB0cmFuc2l0aW9uLCBjdXJyZW50Q29udGV4dCwgX2V2ZW50LCBwcmV2U3RhdGUsIHByZWRpY3RhYmxlRXhlYykge1xuICAgIHZhciBlXzQsIF9hLCBlXzUsIF9iO1xuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBwcmV2Q29uZmlnID0gcHJldlN0YXRlID8gZ2V0Q29uZmlndXJhdGlvbihbXSwgdGhpcy5nZXRTdGF0ZU5vZGVzKHByZXZTdGF0ZS52YWx1ZSkpIDogW107XG4gICAgdmFyIGVudHJ5U2V0ID0gbmV3IFNldCgpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIF9jID0gX192YWx1ZXMoQXJyYXkuZnJvbShyZXNvbHZlZENvbmZpZykuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICByZXR1cm4gYS5vcmRlciAtIGIub3JkZXI7XG4gICAgICB9KSksIF9kID0gX2MubmV4dCgpOyAhX2QuZG9uZTsgX2QgPSBfYy5uZXh0KCkpIHtcbiAgICAgICAgdmFyIHNuID0gX2QudmFsdWU7XG5cbiAgICAgICAgaWYgKCFoYXMocHJldkNvbmZpZywgc24pIHx8IGhhcyh0cmFuc2l0aW9uLmV4aXRTZXQsIHNuKSB8fCBzbi5wYXJlbnQgJiYgZW50cnlTZXQuaGFzKHNuLnBhcmVudCkpIHtcbiAgICAgICAgICBlbnRyeVNldC5hZGQoc24pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV80XzEpIHtcbiAgICAgIGVfNCA9IHtcbiAgICAgICAgZXJyb3I6IGVfNF8xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoX2QgJiYgIV9kLmRvbmUgJiYgKF9hID0gX2MucmV0dXJuKSkgX2EuY2FsbChfYyk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV80KSB0aHJvdyBlXzQuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGZvciAodmFyIHByZXZDb25maWdfMSA9IF9fdmFsdWVzKHByZXZDb25maWcpLCBwcmV2Q29uZmlnXzFfMSA9IHByZXZDb25maWdfMS5uZXh0KCk7ICFwcmV2Q29uZmlnXzFfMS5kb25lOyBwcmV2Q29uZmlnXzFfMSA9IHByZXZDb25maWdfMS5uZXh0KCkpIHtcbiAgICAgICAgdmFyIHNuID0gcHJldkNvbmZpZ18xXzEudmFsdWU7XG5cbiAgICAgICAgaWYgKCFoYXMocmVzb2x2ZWRDb25maWcsIHNuKSB8fCBoYXModHJhbnNpdGlvbi5leGl0U2V0LCBzbi5wYXJlbnQpKSB7XG4gICAgICAgICAgdHJhbnNpdGlvbi5leGl0U2V0LnB1c2goc24pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV81XzEpIHtcbiAgICAgIGVfNSA9IHtcbiAgICAgICAgZXJyb3I6IGVfNV8xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAocHJldkNvbmZpZ18xXzEgJiYgIXByZXZDb25maWdfMV8xLmRvbmUgJiYgKF9iID0gcHJldkNvbmZpZ18xLnJldHVybikpIF9iLmNhbGwocHJldkNvbmZpZ18xKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzUpIHRocm93IGVfNS5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0cmFuc2l0aW9uLmV4aXRTZXQuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIGIub3JkZXIgLSBhLm9yZGVyO1xuICAgIH0pO1xuICAgIHZhciBlbnRyeVN0YXRlcyA9IEFycmF5LmZyb20oZW50cnlTZXQpLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBhLm9yZGVyIC0gYi5vcmRlcjtcbiAgICB9KTtcbiAgICB2YXIgZXhpdFN0YXRlcyA9IG5ldyBTZXQodHJhbnNpdGlvbi5leGl0U2V0KTtcbiAgICB2YXIgZG9uZUV2ZW50cyA9IGZsYXR0ZW4oZW50cnlTdGF0ZXMubWFwKGZ1bmN0aW9uIChzbikge1xuICAgICAgdmFyIGV2ZW50cyA9IFtdO1xuXG4gICAgICBpZiAoc24udHlwZSAhPT0gJ2ZpbmFsJykge1xuICAgICAgICByZXR1cm4gZXZlbnRzO1xuICAgICAgfVxuXG4gICAgICB2YXIgcGFyZW50ID0gc24ucGFyZW50O1xuXG4gICAgICBpZiAoIXBhcmVudC5wYXJlbnQpIHtcbiAgICAgICAgcmV0dXJuIGV2ZW50cztcbiAgICAgIH1cblxuICAgICAgZXZlbnRzLnB1c2goZG9uZShzbi5pZCwgc24uZG9uZURhdGEpLCAvLyBUT0RPOiBkZXByZWNhdGUgLSBmaW5hbCBzdGF0ZXMgc2hvdWxkIG5vdCBlbWl0IGRvbmUgZXZlbnRzIGZvciB0aGVpciBvd24gc3RhdGUuXG4gICAgICBkb25lKHBhcmVudC5pZCwgc24uZG9uZURhdGEgPyBtYXBDb250ZXh0KHNuLmRvbmVEYXRhLCBjdXJyZW50Q29udGV4dCwgX2V2ZW50KSA6IHVuZGVmaW5lZCkpO1xuICAgICAgdmFyIGdyYW5kcGFyZW50ID0gcGFyZW50LnBhcmVudDtcblxuICAgICAgaWYgKGdyYW5kcGFyZW50LnR5cGUgPT09ICdwYXJhbGxlbCcpIHtcbiAgICAgICAgaWYgKGdldENoaWxkcmVuKGdyYW5kcGFyZW50KS5ldmVyeShmdW5jdGlvbiAocGFyZW50Tm9kZSkge1xuICAgICAgICAgIHJldHVybiBpc0luRmluYWxTdGF0ZSh0cmFuc2l0aW9uLmNvbmZpZ3VyYXRpb24sIHBhcmVudE5vZGUpO1xuICAgICAgICB9KSkge1xuICAgICAgICAgIGV2ZW50cy5wdXNoKGRvbmUoZ3JhbmRwYXJlbnQuaWQpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZXZlbnRzO1xuICAgIH0pKTtcbiAgICB2YXIgZW50cnlBY3Rpb25zID0gZW50cnlTdGF0ZXMubWFwKGZ1bmN0aW9uIChzdGF0ZU5vZGUpIHtcbiAgICAgIHZhciBlbnRyeUFjdGlvbnMgPSBzdGF0ZU5vZGUub25FbnRyeTtcbiAgICAgIHZhciBpbnZva2VBY3Rpb25zID0gc3RhdGVOb2RlLmFjdGl2aXRpZXMubWFwKGZ1bmN0aW9uIChhY3Rpdml0eSkge1xuICAgICAgICByZXR1cm4gc3RhcnQoYWN0aXZpdHkpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiAnZW50cnknLFxuICAgICAgICBhY3Rpb25zOiB0b0FjdGlvbk9iamVjdHMocHJlZGljdGFibGVFeGVjID8gX19zcHJlYWRBcnJheShfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQoZW50cnlBY3Rpb25zKSwgZmFsc2UpLCBfX3JlYWQoaW52b2tlQWN0aW9ucyksIGZhbHNlKSA6IF9fc3ByZWFkQXJyYXkoX19zcHJlYWRBcnJheShbXSwgX19yZWFkKGludm9rZUFjdGlvbnMpLCBmYWxzZSksIF9fcmVhZChlbnRyeUFjdGlvbnMpLCBmYWxzZSksIF90aGlzLm1hY2hpbmUub3B0aW9ucy5hY3Rpb25zKVxuICAgICAgfTtcbiAgICB9KS5jb25jYXQoe1xuICAgICAgdHlwZTogJ3N0YXRlX2RvbmUnLFxuICAgICAgYWN0aW9uczogZG9uZUV2ZW50cy5tYXAoZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHJldHVybiByYWlzZShldmVudCk7XG4gICAgICB9KVxuICAgIH0pO1xuICAgIHZhciBleGl0QWN0aW9ucyA9IEFycmF5LmZyb20oZXhpdFN0YXRlcykubWFwKGZ1bmN0aW9uIChzdGF0ZU5vZGUpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6ICdleGl0JyxcbiAgICAgICAgYWN0aW9uczogdG9BY3Rpb25PYmplY3RzKF9fc3ByZWFkQXJyYXkoX19zcHJlYWRBcnJheShbXSwgX19yZWFkKHN0YXRlTm9kZS5vbkV4aXQpLCBmYWxzZSksIF9fcmVhZChzdGF0ZU5vZGUuYWN0aXZpdGllcy5tYXAoZnVuY3Rpb24gKGFjdGl2aXR5KSB7XG4gICAgICAgICAgcmV0dXJuIHN0b3AoYWN0aXZpdHkpO1xuICAgICAgICB9KSksIGZhbHNlKSwgX3RoaXMubWFjaGluZS5vcHRpb25zLmFjdGlvbnMpXG4gICAgICB9O1xuICAgIH0pO1xuICAgIHZhciBhY3Rpb25zID0gZXhpdEFjdGlvbnMuY29uY2F0KHtcbiAgICAgIHR5cGU6ICd0cmFuc2l0aW9uJyxcbiAgICAgIGFjdGlvbnM6IHRvQWN0aW9uT2JqZWN0cyh0cmFuc2l0aW9uLmFjdGlvbnMsIHRoaXMubWFjaGluZS5vcHRpb25zLmFjdGlvbnMpXG4gICAgfSkuY29uY2F0KGVudHJ5QWN0aW9ucyk7XG5cbiAgICBpZiAoaXNEb25lKSB7XG4gICAgICB2YXIgc3RvcEFjdGlvbnMgPSB0b0FjdGlvbk9iamVjdHMoZmxhdHRlbihfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQocmVzb2x2ZWRDb25maWcpLCBmYWxzZSkuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICByZXR1cm4gYi5vcmRlciAtIGEub3JkZXI7XG4gICAgICB9KS5tYXAoZnVuY3Rpb24gKHN0YXRlTm9kZSkge1xuICAgICAgICByZXR1cm4gc3RhdGVOb2RlLm9uRXhpdDtcbiAgICAgIH0pKSwgdGhpcy5tYWNoaW5lLm9wdGlvbnMuYWN0aW9ucykuZmlsdGVyKGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuICFpc1JhaXNhYmxlQWN0aW9uKGFjdGlvbik7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBhY3Rpb25zLmNvbmNhdCh7XG4gICAgICAgIHR5cGU6ICdzdG9wJyxcbiAgICAgICAgYWN0aW9uczogc3RvcEFjdGlvbnNcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBhY3Rpb25zO1xuICB9O1xuICAvKipcclxuICAgKiBEZXRlcm1pbmVzIHRoZSBuZXh0IHN0YXRlIGdpdmVuIHRoZSBjdXJyZW50IGBzdGF0ZWAgYW5kIHNlbnQgYGV2ZW50YC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBzdGF0ZSBUaGUgY3VycmVudCBTdGF0ZSBpbnN0YW5jZSBvciBzdGF0ZSB2YWx1ZVxyXG4gICAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQgdGhhdCB3YXMgc2VudCBhdCB0aGUgY3VycmVudCBzdGF0ZVxyXG4gICAqIEBwYXJhbSBjb250ZXh0IFRoZSBjdXJyZW50IGNvbnRleHQgKGV4dGVuZGVkIHN0YXRlKSBvZiB0aGUgY3VycmVudCBzdGF0ZVxyXG4gICAqL1xuXG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS50cmFuc2l0aW9uID0gZnVuY3Rpb24gKHN0YXRlLCBldmVudCwgY29udGV4dCwgZXhlYykge1xuICAgIGlmIChzdGF0ZSA9PT0gdm9pZCAwKSB7XG4gICAgICBzdGF0ZSA9IHRoaXMuaW5pdGlhbFN0YXRlO1xuICAgIH1cblxuICAgIHZhciBfZXZlbnQgPSB0b1NDWE1MRXZlbnQoZXZlbnQpO1xuXG4gICAgdmFyIGN1cnJlbnRTdGF0ZTtcblxuICAgIGlmIChzdGF0ZSBpbnN0YW5jZW9mIFN0YXRlKSB7XG4gICAgICBjdXJyZW50U3RhdGUgPSBjb250ZXh0ID09PSB1bmRlZmluZWQgPyBzdGF0ZSA6IHRoaXMucmVzb2x2ZVN0YXRlKFN0YXRlLmZyb20oc3RhdGUsIGNvbnRleHQpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHJlc29sdmVkU3RhdGVWYWx1ZSA9IGlzU3RyaW5nKHN0YXRlKSA/IHRoaXMucmVzb2x2ZShwYXRoVG9TdGF0ZVZhbHVlKHRoaXMuZ2V0UmVzb2x2ZWRQYXRoKHN0YXRlKSkpIDogdGhpcy5yZXNvbHZlKHN0YXRlKTtcbiAgICAgIHZhciByZXNvbHZlZENvbnRleHQgPSBjb250ZXh0ICE9PSBudWxsICYmIGNvbnRleHQgIT09IHZvaWQgMCA/IGNvbnRleHQgOiB0aGlzLm1hY2hpbmUuY29udGV4dDtcbiAgICAgIGN1cnJlbnRTdGF0ZSA9IHRoaXMucmVzb2x2ZVN0YXRlKFN0YXRlLmZyb20ocmVzb2x2ZWRTdGF0ZVZhbHVlLCByZXNvbHZlZENvbnRleHQpKTtcbiAgICB9XG5cbiAgICBpZiAoIUlTX1BST0RVQ1RJT04gJiYgX2V2ZW50Lm5hbWUgPT09IFdJTERDQVJEKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBbiBldmVudCBjYW5ub3QgaGF2ZSB0aGUgd2lsZGNhcmQgdHlwZSAoJ1wiLmNvbmNhdChXSUxEQ0FSRCwgXCInKVwiKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc3RyaWN0KSB7XG4gICAgICBpZiAoIXRoaXMuZXZlbnRzLmluY2x1ZGVzKF9ldmVudC5uYW1lKSAmJiAhaXNCdWlsdEluRXZlbnQoX2V2ZW50Lm5hbWUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1hY2hpbmUgJ1wiLmNvbmNhdCh0aGlzLmlkLCBcIicgZG9lcyBub3QgYWNjZXB0IGV2ZW50ICdcIikuY29uY2F0KF9ldmVudC5uYW1lLCBcIidcIikpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBzdGF0ZVRyYW5zaXRpb24gPSB0aGlzLl90cmFuc2l0aW9uKGN1cnJlbnRTdGF0ZS52YWx1ZSwgY3VycmVudFN0YXRlLCBfZXZlbnQpIHx8IHtcbiAgICAgIHRyYW5zaXRpb25zOiBbXSxcbiAgICAgIGNvbmZpZ3VyYXRpb246IFtdLFxuICAgICAgZXhpdFNldDogW10sXG4gICAgICBzb3VyY2U6IGN1cnJlbnRTdGF0ZSxcbiAgICAgIGFjdGlvbnM6IFtdXG4gICAgfTtcbiAgICB2YXIgcHJldkNvbmZpZyA9IGdldENvbmZpZ3VyYXRpb24oW10sIHRoaXMuZ2V0U3RhdGVOb2RlcyhjdXJyZW50U3RhdGUudmFsdWUpKTtcbiAgICB2YXIgcmVzb2x2ZWRDb25maWcgPSBzdGF0ZVRyYW5zaXRpb24uY29uZmlndXJhdGlvbi5sZW5ndGggPyBnZXRDb25maWd1cmF0aW9uKHByZXZDb25maWcsIHN0YXRlVHJhbnNpdGlvbi5jb25maWd1cmF0aW9uKSA6IHByZXZDb25maWc7XG4gICAgc3RhdGVUcmFuc2l0aW9uLmNvbmZpZ3VyYXRpb24gPSBfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQocmVzb2x2ZWRDb25maWcpLCBmYWxzZSk7XG4gICAgcmV0dXJuIHRoaXMucmVzb2x2ZVRyYW5zaXRpb24oc3RhdGVUcmFuc2l0aW9uLCBjdXJyZW50U3RhdGUsIGN1cnJlbnRTdGF0ZS5jb250ZXh0LCBleGVjLCBfZXZlbnQpO1xuICB9O1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUucmVzb2x2ZVJhaXNlZFRyYW5zaXRpb24gPSBmdW5jdGlvbiAoc3RhdGUsIF9ldmVudCwgb3JpZ2luYWxFdmVudCwgcHJlZGljdGFibGVFeGVjKSB7XG4gICAgdmFyIF9hO1xuXG4gICAgdmFyIGN1cnJlbnRBY3Rpb25zID0gc3RhdGUuYWN0aW9ucztcbiAgICBzdGF0ZSA9IHRoaXMudHJhbnNpdGlvbihzdGF0ZSwgX2V2ZW50LCB1bmRlZmluZWQsIHByZWRpY3RhYmxlRXhlYyk7IC8vIFNhdmUgb3JpZ2luYWwgZXZlbnQgdG8gc3RhdGVcbiAgICAvLyBUT0RPOiB0aGlzIHNob3VsZCBiZSB0aGUgcmFpc2VkIGV2ZW50ISBEZWxldGUgaW4gVjUgKGJyZWFraW5nKVxuXG4gICAgc3RhdGUuX2V2ZW50ID0gb3JpZ2luYWxFdmVudDtcbiAgICBzdGF0ZS5ldmVudCA9IG9yaWdpbmFsRXZlbnQuZGF0YTtcblxuICAgIChfYSA9IHN0YXRlLmFjdGlvbnMpLnVuc2hpZnQuYXBwbHkoX2EsIF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChjdXJyZW50QWN0aW9ucyksIGZhbHNlKSk7XG5cbiAgICByZXR1cm4gc3RhdGU7XG4gIH07XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5yZXNvbHZlVHJhbnNpdGlvbiA9IGZ1bmN0aW9uIChzdGF0ZVRyYW5zaXRpb24sIGN1cnJlbnRTdGF0ZSwgY29udGV4dCwgcHJlZGljdGFibGVFeGVjLCBfZXZlbnQpIHtcbiAgICB2YXIgZV82LCBfYSwgZV83LCBfYjtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAoX2V2ZW50ID09PSB2b2lkIDApIHtcbiAgICAgIF9ldmVudCA9IGluaXRFdmVudDtcbiAgICB9XG5cbiAgICB2YXIgY29uZmlndXJhdGlvbiA9IHN0YXRlVHJhbnNpdGlvbi5jb25maWd1cmF0aW9uOyAvLyBUcmFuc2l0aW9uIHdpbGwgXCJhcHBseVwiIGlmOlxuICAgIC8vIC0gdGhpcyBpcyB0aGUgaW5pdGlhbCBzdGF0ZSAodGhlcmUgaXMgbm8gY3VycmVudCBzdGF0ZSlcbiAgICAvLyAtIE9SIHRoZXJlIGFyZSB0cmFuc2l0aW9uc1xuXG4gICAgdmFyIHdpbGxUcmFuc2l0aW9uID0gIWN1cnJlbnRTdGF0ZSB8fCBzdGF0ZVRyYW5zaXRpb24udHJhbnNpdGlvbnMubGVuZ3RoID4gMDtcbiAgICB2YXIgcmVzb2x2ZWRDb25maWd1cmF0aW9uID0gd2lsbFRyYW5zaXRpb24gPyBzdGF0ZVRyYW5zaXRpb24uY29uZmlndXJhdGlvbiA6IGN1cnJlbnRTdGF0ZSA/IGN1cnJlbnRTdGF0ZS5jb25maWd1cmF0aW9uIDogW107XG4gICAgdmFyIGlzRG9uZSA9IGlzSW5GaW5hbFN0YXRlKHJlc29sdmVkQ29uZmlndXJhdGlvbiwgdGhpcyk7XG4gICAgdmFyIHJlc29sdmVkU3RhdGVWYWx1ZSA9IHdpbGxUcmFuc2l0aW9uID8gZ2V0VmFsdWUodGhpcy5tYWNoaW5lLCBjb25maWd1cmF0aW9uKSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgaGlzdG9yeVZhbHVlID0gY3VycmVudFN0YXRlID8gY3VycmVudFN0YXRlLmhpc3RvcnlWYWx1ZSA/IGN1cnJlbnRTdGF0ZS5oaXN0b3J5VmFsdWUgOiBzdGF0ZVRyYW5zaXRpb24uc291cmNlID8gdGhpcy5tYWNoaW5lLmhpc3RvcnlWYWx1ZShjdXJyZW50U3RhdGUudmFsdWUpIDogdW5kZWZpbmVkIDogdW5kZWZpbmVkO1xuICAgIHZhciBhY3Rpb25CbG9ja3MgPSB0aGlzLmdldEFjdGlvbnMobmV3IFNldChyZXNvbHZlZENvbmZpZ3VyYXRpb24pLCBpc0RvbmUsIHN0YXRlVHJhbnNpdGlvbiwgY29udGV4dCwgX2V2ZW50LCBjdXJyZW50U3RhdGUsIHByZWRpY3RhYmxlRXhlYyk7XG4gICAgdmFyIGFjdGl2aXRpZXMgPSBjdXJyZW50U3RhdGUgPyBfX2Fzc2lnbih7fSwgY3VycmVudFN0YXRlLmFjdGl2aXRpZXMpIDoge307XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgYWN0aW9uQmxvY2tzXzEgPSBfX3ZhbHVlcyhhY3Rpb25CbG9ja3MpLCBhY3Rpb25CbG9ja3NfMV8xID0gYWN0aW9uQmxvY2tzXzEubmV4dCgpOyAhYWN0aW9uQmxvY2tzXzFfMS5kb25lOyBhY3Rpb25CbG9ja3NfMV8xID0gYWN0aW9uQmxvY2tzXzEubmV4dCgpKSB7XG4gICAgICAgIHZhciBibG9jayA9IGFjdGlvbkJsb2Nrc18xXzEudmFsdWU7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmb3IgKHZhciBfYyA9IChlXzcgPSB2b2lkIDAsIF9fdmFsdWVzKGJsb2NrLmFjdGlvbnMpKSwgX2QgPSBfYy5uZXh0KCk7ICFfZC5kb25lOyBfZCA9IF9jLm5leHQoKSkge1xuICAgICAgICAgICAgdmFyIGFjdGlvbiA9IF9kLnZhbHVlO1xuXG4gICAgICAgICAgICBpZiAoYWN0aW9uLnR5cGUgPT09IHN0YXJ0JDEpIHtcbiAgICAgICAgICAgICAgYWN0aXZpdGllc1thY3Rpb24uYWN0aXZpdHkuaWQgfHwgYWN0aW9uLmFjdGl2aXR5LnR5cGVdID0gYWN0aW9uO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhY3Rpb24udHlwZSA9PT0gc3RvcCQxKSB7XG4gICAgICAgICAgICAgIGFjdGl2aXRpZXNbYWN0aW9uLmFjdGl2aXR5LmlkIHx8IGFjdGlvbi5hY3Rpdml0eS50eXBlXSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZV83XzEpIHtcbiAgICAgICAgICBlXzcgPSB7XG4gICAgICAgICAgICBlcnJvcjogZV83XzFcbiAgICAgICAgICB9O1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoX2QgJiYgIV9kLmRvbmUgJiYgKF9iID0gX2MucmV0dXJuKSkgX2IuY2FsbChfYyk7XG4gICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIGlmIChlXzcpIHRocm93IGVfNy5lcnJvcjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzZfMSkge1xuICAgICAgZV82ID0ge1xuICAgICAgICBlcnJvcjogZV82XzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChhY3Rpb25CbG9ja3NfMV8xICYmICFhY3Rpb25CbG9ja3NfMV8xLmRvbmUgJiYgKF9hID0gYWN0aW9uQmxvY2tzXzEucmV0dXJuKSkgX2EuY2FsbChhY3Rpb25CbG9ja3NfMSk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV82KSB0aHJvdyBlXzYuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIF9lID0gX19yZWFkKHJlc29sdmVBY3Rpb25zKHRoaXMsIGN1cnJlbnRTdGF0ZSwgY29udGV4dCwgX2V2ZW50LCBhY3Rpb25CbG9ja3MsIHByZWRpY3RhYmxlRXhlYywgdGhpcy5tYWNoaW5lLmNvbmZpZy5wcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50cyB8fCB0aGlzLm1hY2hpbmUuY29uZmlnLnByZXNlcnZlQWN0aW9uT3JkZXIpLCAyKSxcbiAgICAgICAgcmVzb2x2ZWRBY3Rpb25zID0gX2VbMF0sXG4gICAgICAgIHVwZGF0ZWRDb250ZXh0ID0gX2VbMV07XG5cbiAgICB2YXIgX2YgPSBfX3JlYWQocGFydGl0aW9uKHJlc29sdmVkQWN0aW9ucywgaXNSYWlzYWJsZUFjdGlvbiksIDIpLFxuICAgICAgICByYWlzZWRFdmVudHMgPSBfZlswXSxcbiAgICAgICAgbm9uUmFpc2VkQWN0aW9ucyA9IF9mWzFdO1xuXG4gICAgdmFyIGludm9rZUFjdGlvbnMgPSByZXNvbHZlZEFjdGlvbnMuZmlsdGVyKGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICAgIHZhciBfYTtcblxuICAgICAgcmV0dXJuIGFjdGlvbi50eXBlID09PSBzdGFydCQxICYmICgoX2EgPSBhY3Rpb24uYWN0aXZpdHkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS50eXBlKSA9PT0gaW52b2tlO1xuICAgIH0pO1xuICAgIHZhciBjaGlsZHJlbiA9IGludm9rZUFjdGlvbnMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIGFjdGlvbikge1xuICAgICAgYWNjW2FjdGlvbi5hY3Rpdml0eS5pZF0gPSBjcmVhdGVJbnZvY2FibGVBY3RvcihhY3Rpb24uYWN0aXZpdHksIF90aGlzLm1hY2hpbmUsIHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQpO1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCBjdXJyZW50U3RhdGUgPyBfX2Fzc2lnbih7fSwgY3VycmVudFN0YXRlLmNoaWxkcmVuKSA6IHt9KTtcbiAgICB2YXIgbmV4dFN0YXRlID0gbmV3IFN0YXRlKHtcbiAgICAgIHZhbHVlOiByZXNvbHZlZFN0YXRlVmFsdWUgfHwgY3VycmVudFN0YXRlLnZhbHVlLFxuICAgICAgY29udGV4dDogdXBkYXRlZENvbnRleHQsXG4gICAgICBfZXZlbnQ6IF9ldmVudCxcbiAgICAgIC8vIFBlcnNpc3QgX3Nlc3Npb25pZCBiZXR3ZWVuIHN0YXRlc1xuICAgICAgX3Nlc3Npb25pZDogY3VycmVudFN0YXRlID8gY3VycmVudFN0YXRlLl9zZXNzaW9uaWQgOiBudWxsLFxuICAgICAgaGlzdG9yeVZhbHVlOiByZXNvbHZlZFN0YXRlVmFsdWUgPyBoaXN0b3J5VmFsdWUgPyB1cGRhdGVIaXN0b3J5VmFsdWUoaGlzdG9yeVZhbHVlLCByZXNvbHZlZFN0YXRlVmFsdWUpIDogdW5kZWZpbmVkIDogY3VycmVudFN0YXRlID8gY3VycmVudFN0YXRlLmhpc3RvcnlWYWx1ZSA6IHVuZGVmaW5lZCxcbiAgICAgIGhpc3Rvcnk6ICFyZXNvbHZlZFN0YXRlVmFsdWUgfHwgc3RhdGVUcmFuc2l0aW9uLnNvdXJjZSA/IGN1cnJlbnRTdGF0ZSA6IHVuZGVmaW5lZCxcbiAgICAgIGFjdGlvbnM6IHJlc29sdmVkU3RhdGVWYWx1ZSA/IG5vblJhaXNlZEFjdGlvbnMgOiBbXSxcbiAgICAgIGFjdGl2aXRpZXM6IHJlc29sdmVkU3RhdGVWYWx1ZSA/IGFjdGl2aXRpZXMgOiBjdXJyZW50U3RhdGUgPyBjdXJyZW50U3RhdGUuYWN0aXZpdGllcyA6IHt9LFxuICAgICAgZXZlbnRzOiBbXSxcbiAgICAgIGNvbmZpZ3VyYXRpb246IHJlc29sdmVkQ29uZmlndXJhdGlvbixcbiAgICAgIHRyYW5zaXRpb25zOiBzdGF0ZVRyYW5zaXRpb24udHJhbnNpdGlvbnMsXG4gICAgICBjaGlsZHJlbjogY2hpbGRyZW4sXG4gICAgICBkb25lOiBpc0RvbmUsXG4gICAgICB0YWdzOiBnZXRUYWdzRnJvbUNvbmZpZ3VyYXRpb24ocmVzb2x2ZWRDb25maWd1cmF0aW9uKSxcbiAgICAgIG1hY2hpbmU6IHRoaXNcbiAgICB9KTtcbiAgICB2YXIgZGlkVXBkYXRlQ29udGV4dCA9IGNvbnRleHQgIT09IHVwZGF0ZWRDb250ZXh0O1xuICAgIG5leHRTdGF0ZS5jaGFuZ2VkID0gX2V2ZW50Lm5hbWUgPT09IHVwZGF0ZSB8fCBkaWRVcGRhdGVDb250ZXh0OyAvLyBEaXNwb3NlIG9mIHBlbnVsdGltYXRlIGhpc3RvcmllcyB0byBwcmV2ZW50IG1lbW9yeSBsZWFrc1xuXG4gICAgdmFyIGhpc3RvcnkgPSBuZXh0U3RhdGUuaGlzdG9yeTtcblxuICAgIGlmIChoaXN0b3J5KSB7XG4gICAgICBkZWxldGUgaGlzdG9yeS5oaXN0b3J5O1xuICAgIH0gLy8gVGhlcmUgYXJlIHRyYW5zaWVudCB0cmFuc2l0aW9ucyBpZiB0aGUgbWFjaGluZSBpcyBub3QgaW4gYSBmaW5hbCBzdGF0ZVxuICAgIC8vIGFuZCBpZiBzb21lIG9mIHRoZSBzdGF0ZSBub2RlcyBoYXZlIHRyYW5zaWVudCAoXCJhbHdheXNcIikgdHJhbnNpdGlvbnMuXG5cblxuICAgIHZhciBoYXNBbHdheXNUcmFuc2l0aW9ucyA9ICFpc0RvbmUgJiYgKHRoaXMuX3RyYW5zaWVudCB8fCBjb25maWd1cmF0aW9uLnNvbWUoZnVuY3Rpb24gKHN0YXRlTm9kZSkge1xuICAgICAgcmV0dXJuIHN0YXRlTm9kZS5fdHJhbnNpZW50O1xuICAgIH0pKTsgLy8gSWYgdGhlcmUgYXJlIG5vIGVuYWJsZWQgdHJhbnNpdGlvbnMsIGNoZWNrIGlmIHRoZXJlIGFyZSB0cmFuc2llbnQgdHJhbnNpdGlvbnMuXG4gICAgLy8gSWYgdGhlcmUgYXJlIHRyYW5zaWVudCB0cmFuc2l0aW9ucywgY29udGludWUgY2hlY2tpbmcgZm9yIG1vcmUgdHJhbnNpdGlvbnNcbiAgICAvLyBiZWNhdXNlIGFuIHRyYW5zaWVudCB0cmFuc2l0aW9uIHNob3VsZCBiZSB0cmlnZ2VyZWQgZXZlbiBpZiB0aGVyZSBhcmUgbm9cbiAgICAvLyBlbmFibGVkIHRyYW5zaXRpb25zLlxuICAgIC8vXG4gICAgLy8gSWYgd2UncmUgYWxyZWFkeSB3b3JraW5nIG9uIGFuIHRyYW5zaWVudCB0cmFuc2l0aW9uIHRoZW4gc3RvcCB0byBwcmV2ZW50IGFuIGluZmluaXRlIGxvb3AuXG4gICAgLy9cbiAgICAvLyBPdGhlcndpc2UsIGlmIHRoZXJlIGFyZSBubyBlbmFibGVkIG5vciB0cmFuc2llbnQgdHJhbnNpdGlvbnMsIHdlIGFyZSBkb25lLlxuXG4gICAgaWYgKCF3aWxsVHJhbnNpdGlvbiAmJiAoIWhhc0Fsd2F5c1RyYW5zaXRpb25zIHx8IF9ldmVudC5uYW1lID09PSBOVUxMX0VWRU5UKSkge1xuICAgICAgcmV0dXJuIG5leHRTdGF0ZTtcbiAgICB9XG5cbiAgICB2YXIgbWF5YmVOZXh0U3RhdGUgPSBuZXh0U3RhdGU7XG5cbiAgICBpZiAoIWlzRG9uZSkge1xuICAgICAgaWYgKGhhc0Fsd2F5c1RyYW5zaXRpb25zKSB7XG4gICAgICAgIG1heWJlTmV4dFN0YXRlID0gdGhpcy5yZXNvbHZlUmFpc2VkVHJhbnNpdGlvbihtYXliZU5leHRTdGF0ZSwge1xuICAgICAgICAgIHR5cGU6IG51bGxFdmVudFxuICAgICAgICB9LCBfZXZlbnQsIHByZWRpY3RhYmxlRXhlYyk7XG4gICAgICB9XG5cbiAgICAgIHdoaWxlIChyYWlzZWRFdmVudHMubGVuZ3RoKSB7XG4gICAgICAgIHZhciByYWlzZWRFdmVudCA9IHJhaXNlZEV2ZW50cy5zaGlmdCgpO1xuICAgICAgICBtYXliZU5leHRTdGF0ZSA9IHRoaXMucmVzb2x2ZVJhaXNlZFRyYW5zaXRpb24obWF5YmVOZXh0U3RhdGUsIHJhaXNlZEV2ZW50Ll9ldmVudCwgX2V2ZW50LCBwcmVkaWN0YWJsZUV4ZWMpO1xuICAgICAgfVxuICAgIH0gLy8gRGV0ZWN0IGlmIHN0YXRlIGNoYW5nZWRcblxuXG4gICAgdmFyIGNoYW5nZWQgPSBtYXliZU5leHRTdGF0ZS5jaGFuZ2VkIHx8IChoaXN0b3J5ID8gISFtYXliZU5leHRTdGF0ZS5hY3Rpb25zLmxlbmd0aCB8fCBkaWRVcGRhdGVDb250ZXh0IHx8IHR5cGVvZiBoaXN0b3J5LnZhbHVlICE9PSB0eXBlb2YgbWF5YmVOZXh0U3RhdGUudmFsdWUgfHwgIXN0YXRlVmFsdWVzRXF1YWwobWF5YmVOZXh0U3RhdGUudmFsdWUsIGhpc3RvcnkudmFsdWUpIDogdW5kZWZpbmVkKTtcbiAgICBtYXliZU5leHRTdGF0ZS5jaGFuZ2VkID0gY2hhbmdlZDsgLy8gUHJlc2VydmUgb3JpZ2luYWwgaGlzdG9yeSBhZnRlciByYWlzZWQgZXZlbnRzXG5cbiAgICBtYXliZU5leHRTdGF0ZS5oaXN0b3J5ID0gaGlzdG9yeTtcbiAgICByZXR1cm4gbWF5YmVOZXh0U3RhdGU7XG4gIH07XG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGNoaWxkIHN0YXRlIG5vZGUgZnJvbSBpdHMgcmVsYXRpdmUgYHN0YXRlS2V5YCwgb3IgdGhyb3dzLlxyXG4gICAqL1xuXG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5nZXRTdGF0ZU5vZGUgPSBmdW5jdGlvbiAoc3RhdGVLZXkpIHtcbiAgICBpZiAoaXNTdGF0ZUlkKHN0YXRlS2V5KSkge1xuICAgICAgcmV0dXJuIHRoaXMubWFjaGluZS5nZXRTdGF0ZU5vZGVCeUlkKHN0YXRlS2V5KTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuc3RhdGVzKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmFibGUgdG8gcmV0cmlldmUgY2hpbGQgc3RhdGUgJ1wiLmNvbmNhdChzdGF0ZUtleSwgXCInIGZyb20gJ1wiKS5jb25jYXQodGhpcy5pZCwgXCInOyBubyBjaGlsZCBzdGF0ZXMgZXhpc3QuXCIpKTtcbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0ID0gdGhpcy5zdGF0ZXNbc3RhdGVLZXldO1xuXG4gICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNoaWxkIHN0YXRlICdcIi5jb25jYXQoc3RhdGVLZXksIFwiJyBkb2VzIG5vdCBleGlzdCBvbiAnXCIpLmNvbmNhdCh0aGlzLmlkLCBcIidcIikpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIHN0YXRlIG5vZGUgd2l0aCB0aGUgZ2l2ZW4gYHN0YXRlSWRgLCBvciB0aHJvd3MuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gc3RhdGVJZCBUaGUgc3RhdGUgSUQuIFRoZSBwcmVmaXggXCIjXCIgaXMgcmVtb3ZlZC5cclxuICAgKi9cblxuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZ2V0U3RhdGVOb2RlQnlJZCA9IGZ1bmN0aW9uIChzdGF0ZUlkKSB7XG4gICAgdmFyIHJlc29sdmVkU3RhdGVJZCA9IGlzU3RhdGVJZChzdGF0ZUlkKSA/IHN0YXRlSWQuc2xpY2UoU1RBVEVfSURFTlRJRklFUi5sZW5ndGgpIDogc3RhdGVJZDtcblxuICAgIGlmIChyZXNvbHZlZFN0YXRlSWQgPT09IHRoaXMuaWQpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHZhciBzdGF0ZU5vZGUgPSB0aGlzLm1hY2hpbmUuaWRNYXBbcmVzb2x2ZWRTdGF0ZUlkXTtcblxuICAgIGlmICghc3RhdGVOb2RlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDaGlsZCBzdGF0ZSBub2RlICcjXCIuY29uY2F0KHJlc29sdmVkU3RhdGVJZCwgXCInIGRvZXMgbm90IGV4aXN0IG9uIG1hY2hpbmUgJ1wiKS5jb25jYXQodGhpcy5pZCwgXCInXCIpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdGVOb2RlO1xuICB9O1xuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSByZWxhdGl2ZSBzdGF0ZSBub2RlIGZyb20gdGhlIGdpdmVuIGBzdGF0ZVBhdGhgLCBvciB0aHJvd3MuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gc3RhdGVQYXRoIFRoZSBzdHJpbmcgb3Igc3RyaW5nIGFycmF5IHJlbGF0aXZlIHBhdGggdG8gdGhlIHN0YXRlIG5vZGUuXHJcbiAgICovXG5cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmdldFN0YXRlTm9kZUJ5UGF0aCA9IGZ1bmN0aW9uIChzdGF0ZVBhdGgpIHtcbiAgICBpZiAodHlwZW9mIHN0YXRlUGF0aCA9PT0gJ3N0cmluZycgJiYgaXNTdGF0ZUlkKHN0YXRlUGF0aCkpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFN0YXRlTm9kZUJ5SWQoc3RhdGVQYXRoLnNsaWNlKDEpKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHsvLyB0cnkgaW5kaXZpZHVhbCBwYXRoc1xuICAgICAgICAvLyB0aHJvdyBlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBhcnJheVN0YXRlUGF0aCA9IHRvU3RhdGVQYXRoKHN0YXRlUGF0aCwgdGhpcy5kZWxpbWl0ZXIpLnNsaWNlKCk7XG4gICAgdmFyIGN1cnJlbnRTdGF0ZU5vZGUgPSB0aGlzO1xuXG4gICAgd2hpbGUgKGFycmF5U3RhdGVQYXRoLmxlbmd0aCkge1xuICAgICAgdmFyIGtleSA9IGFycmF5U3RhdGVQYXRoLnNoaWZ0KCk7XG5cbiAgICAgIGlmICgha2V5Lmxlbmd0aCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY3VycmVudFN0YXRlTm9kZSA9IGN1cnJlbnRTdGF0ZU5vZGUuZ2V0U3RhdGVOb2RlKGtleSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGN1cnJlbnRTdGF0ZU5vZGU7XG4gIH07XG4gIC8qKlxyXG4gICAqIFJlc29sdmVzIGEgcGFydGlhbCBzdGF0ZSB2YWx1ZSB3aXRoIGl0cyBmdWxsIHJlcHJlc2VudGF0aW9uIGluIHRoaXMgbWFjaGluZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBzdGF0ZVZhbHVlIFRoZSBwYXJ0aWFsIHN0YXRlIHZhbHVlIHRvIHJlc29sdmUuXHJcbiAgICovXG5cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLnJlc29sdmUgPSBmdW5jdGlvbiAoc3RhdGVWYWx1ZSkge1xuICAgIHZhciBfYTtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAoIXN0YXRlVmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzLmluaXRpYWxTdGF0ZVZhbHVlIHx8IEVNUFRZX09CSkVDVDsgLy8gVE9ETzogdHlwZS1zcGVjaWZpYyBwcm9wZXJ0aWVzXG4gICAgfVxuXG4gICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgIGNhc2UgJ3BhcmFsbGVsJzpcbiAgICAgICAgcmV0dXJuIG1hcFZhbHVlcyh0aGlzLmluaXRpYWxTdGF0ZVZhbHVlLCBmdW5jdGlvbiAoc3ViU3RhdGVWYWx1ZSwgc3ViU3RhdGVLZXkpIHtcbiAgICAgICAgICByZXR1cm4gc3ViU3RhdGVWYWx1ZSA/IF90aGlzLmdldFN0YXRlTm9kZShzdWJTdGF0ZUtleSkucmVzb2x2ZShzdGF0ZVZhbHVlW3N1YlN0YXRlS2V5XSB8fCBzdWJTdGF0ZVZhbHVlKSA6IEVNUFRZX09CSkVDVDtcbiAgICAgICAgfSk7XG5cbiAgICAgIGNhc2UgJ2NvbXBvdW5kJzpcbiAgICAgICAgaWYgKGlzU3RyaW5nKHN0YXRlVmFsdWUpKSB7XG4gICAgICAgICAgdmFyIHN1YlN0YXRlTm9kZSA9IHRoaXMuZ2V0U3RhdGVOb2RlKHN0YXRlVmFsdWUpO1xuXG4gICAgICAgICAgaWYgKHN1YlN0YXRlTm9kZS50eXBlID09PSAncGFyYWxsZWwnIHx8IHN1YlN0YXRlTm9kZS50eXBlID09PSAnY29tcG91bmQnKSB7XG4gICAgICAgICAgICByZXR1cm4gX2EgPSB7fSwgX2Fbc3RhdGVWYWx1ZV0gPSBzdWJTdGF0ZU5vZGUuaW5pdGlhbFN0YXRlVmFsdWUsIF9hO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBzdGF0ZVZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFPYmplY3Qua2V5cyhzdGF0ZVZhbHVlKS5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5pbml0aWFsU3RhdGVWYWx1ZSB8fCB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtYXBWYWx1ZXMoc3RhdGVWYWx1ZSwgZnVuY3Rpb24gKHN1YlN0YXRlVmFsdWUsIHN1YlN0YXRlS2V5KSB7XG4gICAgICAgICAgcmV0dXJuIHN1YlN0YXRlVmFsdWUgPyBfdGhpcy5nZXRTdGF0ZU5vZGUoc3ViU3RhdGVLZXkpLnJlc29sdmUoc3ViU3RhdGVWYWx1ZSkgOiBFTVBUWV9PQkpFQ1Q7XG4gICAgICAgIH0pO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gc3RhdGVWYWx1ZSB8fCBFTVBUWV9PQkpFQ1Q7XG4gICAgfVxuICB9O1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUuZ2V0UmVzb2x2ZWRQYXRoID0gZnVuY3Rpb24gKHN0YXRlSWRlbnRpZmllcikge1xuICAgIGlmIChpc1N0YXRlSWQoc3RhdGVJZGVudGlmaWVyKSkge1xuICAgICAgdmFyIHN0YXRlTm9kZSA9IHRoaXMubWFjaGluZS5pZE1hcFtzdGF0ZUlkZW50aWZpZXIuc2xpY2UoU1RBVEVfSURFTlRJRklFUi5sZW5ndGgpXTtcblxuICAgICAgaWYgKCFzdGF0ZU5vZGUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5hYmxlIHRvIGZpbmQgc3RhdGUgbm9kZSAnXCIuY29uY2F0KHN0YXRlSWRlbnRpZmllciwgXCInXCIpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0YXRlTm9kZS5wYXRoO1xuICAgIH1cblxuICAgIHJldHVybiB0b1N0YXRlUGF0aChzdGF0ZUlkZW50aWZpZXIsIHRoaXMuZGVsaW1pdGVyKTtcbiAgfTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RhdGVOb2RlLnByb3RvdHlwZSwgXCJpbml0aWFsU3RhdGVWYWx1ZVwiLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgX2E7XG5cbiAgICAgIGlmICh0aGlzLl9fY2FjaGUuaW5pdGlhbFN0YXRlVmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19jYWNoZS5pbml0aWFsU3RhdGVWYWx1ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIGluaXRpYWxTdGF0ZVZhbHVlO1xuXG4gICAgICBpZiAodGhpcy50eXBlID09PSAncGFyYWxsZWwnKSB7XG4gICAgICAgIGluaXRpYWxTdGF0ZVZhbHVlID0gbWFwRmlsdGVyVmFsdWVzKHRoaXMuc3RhdGVzLCBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgICByZXR1cm4gc3RhdGUuaW5pdGlhbFN0YXRlVmFsdWUgfHwgRU1QVFlfT0JKRUNUO1xuICAgICAgICB9LCBmdW5jdGlvbiAoc3RhdGVOb2RlKSB7XG4gICAgICAgICAgcmV0dXJuICEoc3RhdGVOb2RlLnR5cGUgPT09ICdoaXN0b3J5Jyk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmluaXRpYWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoIXRoaXMuc3RhdGVzW3RoaXMuaW5pdGlhbF0pIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbml0aWFsIHN0YXRlICdcIi5jb25jYXQodGhpcy5pbml0aWFsLCBcIicgbm90IGZvdW5kIG9uICdcIikuY29uY2F0KHRoaXMua2V5LCBcIidcIikpO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5pdGlhbFN0YXRlVmFsdWUgPSBpc0xlYWZOb2RlKHRoaXMuc3RhdGVzW3RoaXMuaW5pdGlhbF0pID8gdGhpcy5pbml0aWFsIDogKF9hID0ge30sIF9hW3RoaXMuaW5pdGlhbF0gPSB0aGlzLnN0YXRlc1t0aGlzLmluaXRpYWxdLmluaXRpYWxTdGF0ZVZhbHVlLCBfYSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUaGUgZmluaXRlIHN0YXRlIHZhbHVlIG9mIGEgbWFjaGluZSB3aXRob3V0IGNoaWxkIHN0YXRlcyBpcyBqdXN0IGFuIGVtcHR5IG9iamVjdFxuICAgICAgICBpbml0aWFsU3RhdGVWYWx1ZSA9IHt9O1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9fY2FjaGUuaW5pdGlhbFN0YXRlVmFsdWUgPSBpbml0aWFsU3RhdGVWYWx1ZTtcbiAgICAgIHJldHVybiB0aGlzLl9fY2FjaGUuaW5pdGlhbFN0YXRlVmFsdWU7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSk7XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5nZXRJbml0aWFsU3RhdGUgPSBmdW5jdGlvbiAoc3RhdGVWYWx1ZSwgY29udGV4dCkge1xuICAgIHRoaXMuX2luaXQoKTsgLy8gVE9ETzogdGhpcyBzaG91bGQgYmUgaW4gdGhlIGNvbnN0cnVjdG9yIChzZWUgbm90ZSBpbiBjb25zdHJ1Y3RvcilcblxuXG4gICAgdmFyIGNvbmZpZ3VyYXRpb24gPSB0aGlzLmdldFN0YXRlTm9kZXMoc3RhdGVWYWx1ZSk7XG4gICAgcmV0dXJuIHRoaXMucmVzb2x2ZVRyYW5zaXRpb24oe1xuICAgICAgY29uZmlndXJhdGlvbjogY29uZmlndXJhdGlvbixcbiAgICAgIGV4aXRTZXQ6IFtdLFxuICAgICAgdHJhbnNpdGlvbnM6IFtdLFxuICAgICAgc291cmNlOiB1bmRlZmluZWQsXG4gICAgICBhY3Rpb25zOiBbXVxuICAgIH0sIHVuZGVmaW5lZCwgY29udGV4dCAhPT0gbnVsbCAmJiBjb250ZXh0ICE9PSB2b2lkIDAgPyBjb250ZXh0IDogdGhpcy5tYWNoaW5lLmNvbnRleHQsIHVuZGVmaW5lZCk7XG4gIH07XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0YXRlTm9kZS5wcm90b3R5cGUsIFwiaW5pdGlhbFN0YXRlXCIsIHtcbiAgICAvKipcclxuICAgICAqIFRoZSBpbml0aWFsIFN0YXRlIGluc3RhbmNlLCB3aGljaCBpbmNsdWRlcyBhbGwgYWN0aW9ucyB0byBiZSBleGVjdXRlZCBmcm9tXHJcbiAgICAgKiBlbnRlcmluZyB0aGUgaW5pdGlhbCBzdGF0ZS5cclxuICAgICAqL1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGluaXRpYWxTdGF0ZVZhbHVlID0gdGhpcy5pbml0aWFsU3RhdGVWYWx1ZTtcblxuICAgICAgaWYgKCFpbml0aWFsU3RhdGVWYWx1ZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgcmV0cmlldmUgaW5pdGlhbCBzdGF0ZSBmcm9tIHNpbXBsZSBzdGF0ZSAnXCIuY29uY2F0KHRoaXMuaWQsIFwiJy5cIikpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5nZXRJbml0aWFsU3RhdGUoaW5pdGlhbFN0YXRlVmFsdWUpO1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RhdGVOb2RlLnByb3RvdHlwZSwgXCJ0YXJnZXRcIiwge1xuICAgIC8qKlxyXG4gICAgICogVGhlIHRhcmdldCBzdGF0ZSB2YWx1ZSBvZiB0aGUgaGlzdG9yeSBzdGF0ZSBub2RlLCBpZiBpdCBleGlzdHMuIFRoaXMgcmVwcmVzZW50cyB0aGVcclxuICAgICAqIGRlZmF1bHQgc3RhdGUgdmFsdWUgdG8gdHJhbnNpdGlvbiB0byBpZiBubyBoaXN0b3J5IHZhbHVlIGV4aXN0cyB5ZXQuXHJcbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB0YXJnZXQ7XG5cbiAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdoaXN0b3J5Jykge1xuICAgICAgICB2YXIgaGlzdG9yeUNvbmZpZyA9IHRoaXMuY29uZmlnO1xuXG4gICAgICAgIGlmIChpc1N0cmluZyhoaXN0b3J5Q29uZmlnLnRhcmdldCkpIHtcbiAgICAgICAgICB0YXJnZXQgPSBpc1N0YXRlSWQoaGlzdG9yeUNvbmZpZy50YXJnZXQpID8gcGF0aFRvU3RhdGVWYWx1ZSh0aGlzLm1hY2hpbmUuZ2V0U3RhdGVOb2RlQnlJZChoaXN0b3J5Q29uZmlnLnRhcmdldCkucGF0aC5zbGljZSh0aGlzLnBhdGgubGVuZ3RoIC0gMSkpIDogaGlzdG9yeUNvbmZpZy50YXJnZXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGFyZ2V0ID0gaGlzdG9yeUNvbmZpZy50YXJnZXQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgbGVhZiBub2RlcyBmcm9tIGEgc3RhdGUgcGF0aCByZWxhdGl2ZSB0byB0aGlzIHN0YXRlIG5vZGUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gcmVsYXRpdmVTdGF0ZUlkIFRoZSByZWxhdGl2ZSBzdGF0ZSBwYXRoIHRvIHJldHJpZXZlIHRoZSBzdGF0ZSBub2Rlc1xyXG4gICAqIEBwYXJhbSBoaXN0b3J5IFRoZSBwcmV2aW91cyBzdGF0ZSB0byByZXRyaWV2ZSBoaXN0b3J5XHJcbiAgICogQHBhcmFtIHJlc29sdmUgV2hldGhlciBzdGF0ZSBub2RlcyBzaG91bGQgcmVzb2x2ZSB0byBpbml0aWFsIGNoaWxkIHN0YXRlIG5vZGVzXHJcbiAgICovXG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5nZXRSZWxhdGl2ZVN0YXRlTm9kZXMgPSBmdW5jdGlvbiAocmVsYXRpdmVTdGF0ZUlkLCBoaXN0b3J5VmFsdWUsIHJlc29sdmUpIHtcbiAgICBpZiAocmVzb2x2ZSA9PT0gdm9pZCAwKSB7XG4gICAgICByZXNvbHZlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzb2x2ZSA/IHJlbGF0aXZlU3RhdGVJZC50eXBlID09PSAnaGlzdG9yeScgPyByZWxhdGl2ZVN0YXRlSWQucmVzb2x2ZUhpc3RvcnkoaGlzdG9yeVZhbHVlKSA6IHJlbGF0aXZlU3RhdGVJZC5pbml0aWFsU3RhdGVOb2RlcyA6IFtyZWxhdGl2ZVN0YXRlSWRdO1xuICB9O1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdGF0ZU5vZGUucHJvdG90eXBlLCBcImluaXRpYWxTdGF0ZU5vZGVzXCIsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIGlmIChpc0xlYWZOb2RlKHRoaXMpKSB7XG4gICAgICAgIHJldHVybiBbdGhpc107XG4gICAgICB9IC8vIENhc2Ugd2hlbiBzdGF0ZSBub2RlIGlzIGNvbXBvdW5kIGJ1dCBubyBpbml0aWFsIHN0YXRlIGlzIGRlZmluZWRcblxuXG4gICAgICBpZiAodGhpcy50eXBlID09PSAnY29tcG91bmQnICYmICF0aGlzLmluaXRpYWwpIHtcbiAgICAgICAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgICAgICAgd2FybihmYWxzZSwgXCJDb21wb3VuZCBzdGF0ZSBub2RlICdcIi5jb25jYXQodGhpcy5pZCwgXCInIGhhcyBubyBpbml0aWFsIHN0YXRlLlwiKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gW3RoaXNdO1xuICAgICAgfVxuXG4gICAgICB2YXIgaW5pdGlhbFN0YXRlTm9kZVBhdGhzID0gdG9TdGF0ZVBhdGhzKHRoaXMuaW5pdGlhbFN0YXRlVmFsdWUpO1xuICAgICAgcmV0dXJuIGZsYXR0ZW4oaW5pdGlhbFN0YXRlTm9kZVBhdGhzLm1hcChmdW5jdGlvbiAoaW5pdGlhbFBhdGgpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLmdldEZyb21SZWxhdGl2ZVBhdGgoaW5pdGlhbFBhdGgpO1xuICAgICAgfSkpO1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuICAvKipcclxuICAgKiBSZXRyaWV2ZXMgc3RhdGUgbm9kZXMgZnJvbSBhIHJlbGF0aXZlIHBhdGggdG8gdGhpcyBzdGF0ZSBub2RlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHJlbGF0aXZlUGF0aCBUaGUgcmVsYXRpdmUgcGF0aCBmcm9tIHRoaXMgc3RhdGUgbm9kZVxyXG4gICAqIEBwYXJhbSBoaXN0b3J5VmFsdWVcclxuICAgKi9cblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmdldEZyb21SZWxhdGl2ZVBhdGggPSBmdW5jdGlvbiAocmVsYXRpdmVQYXRoKSB7XG4gICAgaWYgKCFyZWxhdGl2ZVBhdGgubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gW3RoaXNdO1xuICAgIH1cblxuICAgIHZhciBfYSA9IF9fcmVhZChyZWxhdGl2ZVBhdGgpLFxuICAgICAgICBzdGF0ZUtleSA9IF9hWzBdLFxuICAgICAgICBjaGlsZFN0YXRlUGF0aCA9IF9hLnNsaWNlKDEpO1xuXG4gICAgaWYgKCF0aGlzLnN0YXRlcykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHJldHJpZXZlIHN1YlBhdGggJ1wiLmNvbmNhdChzdGF0ZUtleSwgXCInIGZyb20gbm9kZSB3aXRoIG5vIHN0YXRlc1wiKSk7XG4gICAgfVxuXG4gICAgdmFyIGNoaWxkU3RhdGVOb2RlID0gdGhpcy5nZXRTdGF0ZU5vZGUoc3RhdGVLZXkpO1xuXG4gICAgaWYgKGNoaWxkU3RhdGVOb2RlLnR5cGUgPT09ICdoaXN0b3J5Jykge1xuICAgICAgcmV0dXJuIGNoaWxkU3RhdGVOb2RlLnJlc29sdmVIaXN0b3J5KCk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnN0YXRlc1tzdGF0ZUtleV0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNoaWxkIHN0YXRlICdcIi5jb25jYXQoc3RhdGVLZXksIFwiJyBkb2VzIG5vdCBleGlzdCBvbiAnXCIpLmNvbmNhdCh0aGlzLmlkLCBcIidcIikpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnN0YXRlc1tzdGF0ZUtleV0uZ2V0RnJvbVJlbGF0aXZlUGF0aChjaGlsZFN0YXRlUGF0aCk7XG4gIH07XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5oaXN0b3J5VmFsdWUgPSBmdW5jdGlvbiAocmVsYXRpdmVTdGF0ZVZhbHVlKSB7XG4gICAgaWYgKCFPYmplY3Qua2V5cyh0aGlzLnN0YXRlcykubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBjdXJyZW50OiByZWxhdGl2ZVN0YXRlVmFsdWUgfHwgdGhpcy5pbml0aWFsU3RhdGVWYWx1ZSxcbiAgICAgIHN0YXRlczogbWFwRmlsdGVyVmFsdWVzKHRoaXMuc3RhdGVzLCBmdW5jdGlvbiAoc3RhdGVOb2RlLCBrZXkpIHtcbiAgICAgICAgaWYgKCFyZWxhdGl2ZVN0YXRlVmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gc3RhdGVOb2RlLmhpc3RvcnlWYWx1ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHN1YlN0YXRlVmFsdWUgPSBpc1N0cmluZyhyZWxhdGl2ZVN0YXRlVmFsdWUpID8gdW5kZWZpbmVkIDogcmVsYXRpdmVTdGF0ZVZhbHVlW2tleV07XG4gICAgICAgIHJldHVybiBzdGF0ZU5vZGUuaGlzdG9yeVZhbHVlKHN1YlN0YXRlVmFsdWUgfHwgc3RhdGVOb2RlLmluaXRpYWxTdGF0ZVZhbHVlKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChzdGF0ZU5vZGUpIHtcbiAgICAgICAgcmV0dXJuICFzdGF0ZU5vZGUuaGlzdG9yeTtcbiAgICAgIH0pXG4gICAgfTtcbiAgfTtcbiAgLyoqXHJcbiAgICogUmVzb2x2ZXMgdG8gdGhlIGhpc3RvcmljYWwgdmFsdWUocykgb2YgdGhlIHBhcmVudCBzdGF0ZSBub2RlLFxyXG4gICAqIHJlcHJlc2VudGVkIGJ5IHN0YXRlIG5vZGVzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGhpc3RvcnlWYWx1ZVxyXG4gICAqL1xuXG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5yZXNvbHZlSGlzdG9yeSA9IGZ1bmN0aW9uIChoaXN0b3J5VmFsdWUpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMudHlwZSAhPT0gJ2hpc3RvcnknKSB7XG4gICAgICByZXR1cm4gW3RoaXNdO1xuICAgIH1cblxuICAgIHZhciBwYXJlbnQgPSB0aGlzLnBhcmVudDtcblxuICAgIGlmICghaGlzdG9yeVZhbHVlKSB7XG4gICAgICB2YXIgaGlzdG9yeVRhcmdldCA9IHRoaXMudGFyZ2V0O1xuICAgICAgcmV0dXJuIGhpc3RvcnlUYXJnZXQgPyBmbGF0dGVuKHRvU3RhdGVQYXRocyhoaXN0b3J5VGFyZ2V0KS5tYXAoZnVuY3Rpb24gKHJlbGF0aXZlQ2hpbGRQYXRoKSB7XG4gICAgICAgIHJldHVybiBwYXJlbnQuZ2V0RnJvbVJlbGF0aXZlUGF0aChyZWxhdGl2ZUNoaWxkUGF0aCk7XG4gICAgICB9KSkgOiBwYXJlbnQuaW5pdGlhbFN0YXRlTm9kZXM7XG4gICAgfVxuXG4gICAgdmFyIHN1Ykhpc3RvcnlWYWx1ZSA9IG5lc3RlZFBhdGgocGFyZW50LnBhdGgsICdzdGF0ZXMnKShoaXN0b3J5VmFsdWUpLmN1cnJlbnQ7XG5cbiAgICBpZiAoaXNTdHJpbmcoc3ViSGlzdG9yeVZhbHVlKSkge1xuICAgICAgcmV0dXJuIFtwYXJlbnQuZ2V0U3RhdGVOb2RlKHN1Ykhpc3RvcnlWYWx1ZSldO1xuICAgIH1cblxuICAgIHJldHVybiBmbGF0dGVuKHRvU3RhdGVQYXRocyhzdWJIaXN0b3J5VmFsdWUpLm1hcChmdW5jdGlvbiAoc3ViU3RhdGVQYXRoKSB7XG4gICAgICByZXR1cm4gX3RoaXMuaGlzdG9yeSA9PT0gJ2RlZXAnID8gcGFyZW50LmdldEZyb21SZWxhdGl2ZVBhdGgoc3ViU3RhdGVQYXRoKSA6IFtwYXJlbnQuc3RhdGVzW3N1YlN0YXRlUGF0aFswXV1dO1xuICAgIH0pKTtcbiAgfTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RhdGVOb2RlLnByb3RvdHlwZSwgXCJzdGF0ZUlkc1wiLCB7XG4gICAgLyoqXHJcbiAgICAgKiBBbGwgdGhlIHN0YXRlIG5vZGUgSURzIG9mIHRoaXMgc3RhdGUgbm9kZSBhbmQgaXRzIGRlc2NlbmRhbnQgc3RhdGUgbm9kZXMuXHJcbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIHZhciBjaGlsZFN0YXRlSWRzID0gZmxhdHRlbihPYmplY3Qua2V5cyh0aGlzLnN0YXRlcykubWFwKGZ1bmN0aW9uIChzdGF0ZUtleSkge1xuICAgICAgICByZXR1cm4gX3RoaXMuc3RhdGVzW3N0YXRlS2V5XS5zdGF0ZUlkcztcbiAgICAgIH0pKTtcbiAgICAgIHJldHVybiBbdGhpcy5pZF0uY29uY2F0KGNoaWxkU3RhdGVJZHMpO1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RhdGVOb2RlLnByb3RvdHlwZSwgXCJldmVudHNcIiwge1xuICAgIC8qKlxyXG4gICAgICogQWxsIHRoZSBldmVudCB0eXBlcyBhY2NlcHRlZCBieSB0aGlzIHN0YXRlIG5vZGUgYW5kIGl0cyBkZXNjZW5kYW50cy5cclxuICAgICAqL1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGVfOCwgX2EsIGVfOSwgX2I7XG5cbiAgICAgIGlmICh0aGlzLl9fY2FjaGUuZXZlbnRzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fY2FjaGUuZXZlbnRzO1xuICAgICAgfVxuXG4gICAgICB2YXIgc3RhdGVzID0gdGhpcy5zdGF0ZXM7XG4gICAgICB2YXIgZXZlbnRzID0gbmV3IFNldCh0aGlzLm93bkV2ZW50cyk7XG5cbiAgICAgIGlmIChzdGF0ZXMpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmb3IgKHZhciBfYyA9IF9fdmFsdWVzKE9iamVjdC5rZXlzKHN0YXRlcykpLCBfZCA9IF9jLm5leHQoKTsgIV9kLmRvbmU7IF9kID0gX2MubmV4dCgpKSB7XG4gICAgICAgICAgICB2YXIgc3RhdGVJZCA9IF9kLnZhbHVlO1xuICAgICAgICAgICAgdmFyIHN0YXRlID0gc3RhdGVzW3N0YXRlSWRdO1xuXG4gICAgICAgICAgICBpZiAoc3RhdGUuc3RhdGVzKSB7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgX2UgPSAoZV85ID0gdm9pZCAwLCBfX3ZhbHVlcyhzdGF0ZS5ldmVudHMpKSwgX2YgPSBfZS5uZXh0KCk7ICFfZi5kb25lOyBfZiA9IF9lLm5leHQoKSkge1xuICAgICAgICAgICAgICAgICAgdmFyIGV2ZW50XzEgPSBfZi52YWx1ZTtcbiAgICAgICAgICAgICAgICAgIGV2ZW50cy5hZGQoXCJcIi5jb25jYXQoZXZlbnRfMSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBjYXRjaCAoZV85XzEpIHtcbiAgICAgICAgICAgICAgICBlXzkgPSB7XG4gICAgICAgICAgICAgICAgICBlcnJvcjogZV85XzFcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICBpZiAoX2YgJiYgIV9mLmRvbmUgJiYgKF9iID0gX2UucmV0dXJuKSkgX2IuY2FsbChfZSk7XG4gICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgIGlmIChlXzkpIHRocm93IGVfOS5lcnJvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVfOF8xKSB7XG4gICAgICAgICAgZV84ID0ge1xuICAgICAgICAgICAgZXJyb3I6IGVfOF8xXG4gICAgICAgICAgfTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKF9kICYmICFfZC5kb25lICYmIChfYSA9IF9jLnJldHVybikpIF9hLmNhbGwoX2MpO1xuICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBpZiAoZV84KSB0aHJvdyBlXzguZXJyb3I7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLl9fY2FjaGUuZXZlbnRzID0gQXJyYXkuZnJvbShldmVudHMpO1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RhdGVOb2RlLnByb3RvdHlwZSwgXCJvd25FdmVudHNcIiwge1xuICAgIC8qKlxyXG4gICAgICogQWxsIHRoZSBldmVudHMgdGhhdCBoYXZlIHRyYW5zaXRpb25zIGRpcmVjdGx5IGZyb20gdGhpcyBzdGF0ZSBub2RlLlxyXG4gICAgICpcclxuICAgICAqIEV4Y2x1ZGVzIGFueSBpbmVydCBldmVudHMuXHJcbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBldmVudHMgPSBuZXcgU2V0KHRoaXMudHJhbnNpdGlvbnMuZmlsdGVyKGZ1bmN0aW9uICh0cmFuc2l0aW9uKSB7XG4gICAgICAgIHJldHVybiAhKCF0cmFuc2l0aW9uLnRhcmdldCAmJiAhdHJhbnNpdGlvbi5hY3Rpb25zLmxlbmd0aCAmJiB0cmFuc2l0aW9uLmludGVybmFsKTtcbiAgICAgIH0pLm1hcChmdW5jdGlvbiAodHJhbnNpdGlvbikge1xuICAgICAgICByZXR1cm4gdHJhbnNpdGlvbi5ldmVudFR5cGU7XG4gICAgICB9KSk7XG4gICAgICByZXR1cm4gQXJyYXkuZnJvbShldmVudHMpO1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuXG4gIFN0YXRlTm9kZS5wcm90b3R5cGUucmVzb2x2ZVRhcmdldCA9IGZ1bmN0aW9uIChfdGFyZ2V0KSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGlmIChfdGFyZ2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIGFuIHVuZGVmaW5lZCB0YXJnZXQgc2lnbmFscyB0aGF0IHRoZSBzdGF0ZSBub2RlIHNob3VsZCBub3QgdHJhbnNpdGlvbiBmcm9tIHRoYXQgc3RhdGUgd2hlbiByZWNlaXZpbmcgdGhhdCBldmVudFxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gX3RhcmdldC5tYXAoZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgaWYgKCFpc1N0cmluZyh0YXJnZXQpKSB7XG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgICB9XG5cbiAgICAgIHZhciBpc0ludGVybmFsVGFyZ2V0ID0gdGFyZ2V0WzBdID09PSBfdGhpcy5kZWxpbWl0ZXI7IC8vIElmIGludGVybmFsIHRhcmdldCBpcyBkZWZpbmVkIG9uIG1hY2hpbmUsXG4gICAgICAvLyBkbyBub3QgaW5jbHVkZSBtYWNoaW5lIGtleSBvbiB0YXJnZXRcblxuICAgICAgaWYgKGlzSW50ZXJuYWxUYXJnZXQgJiYgIV90aGlzLnBhcmVudCkge1xuICAgICAgICByZXR1cm4gX3RoaXMuZ2V0U3RhdGVOb2RlQnlQYXRoKHRhcmdldC5zbGljZSgxKSk7XG4gICAgICB9XG5cbiAgICAgIHZhciByZXNvbHZlZFRhcmdldCA9IGlzSW50ZXJuYWxUYXJnZXQgPyBfdGhpcy5rZXkgKyB0YXJnZXQgOiB0YXJnZXQ7XG5cbiAgICAgIGlmIChfdGhpcy5wYXJlbnQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YXIgdGFyZ2V0U3RhdGVOb2RlID0gX3RoaXMucGFyZW50LmdldFN0YXRlTm9kZUJ5UGF0aChyZXNvbHZlZFRhcmdldCk7XG5cbiAgICAgICAgICByZXR1cm4gdGFyZ2V0U3RhdGVOb2RlO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHRyYW5zaXRpb24gZGVmaW5pdGlvbiBmb3Igc3RhdGUgbm9kZSAnXCIuY29uY2F0KF90aGlzLmlkLCBcIic6XFxuXCIpLmNvbmNhdChlcnIubWVzc2FnZSkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gX3RoaXMuZ2V0U3RhdGVOb2RlQnlQYXRoKHJlc29sdmVkVGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBTdGF0ZU5vZGUucHJvdG90eXBlLmZvcm1hdFRyYW5zaXRpb24gPSBmdW5jdGlvbiAodHJhbnNpdGlvbkNvbmZpZykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgbm9ybWFsaXplZFRhcmdldCA9IG5vcm1hbGl6ZVRhcmdldCh0cmFuc2l0aW9uQ29uZmlnLnRhcmdldCk7XG4gICAgdmFyIGludGVybmFsID0gJ2ludGVybmFsJyBpbiB0cmFuc2l0aW9uQ29uZmlnID8gdHJhbnNpdGlvbkNvbmZpZy5pbnRlcm5hbCA6IG5vcm1hbGl6ZWRUYXJnZXQgPyBub3JtYWxpemVkVGFyZ2V0LnNvbWUoZnVuY3Rpb24gKF90YXJnZXQpIHtcbiAgICAgIHJldHVybiBpc1N0cmluZyhfdGFyZ2V0KSAmJiBfdGFyZ2V0WzBdID09PSBfdGhpcy5kZWxpbWl0ZXI7XG4gICAgfSkgOiB0cnVlO1xuICAgIHZhciBndWFyZHMgPSB0aGlzLm1hY2hpbmUub3B0aW9ucy5ndWFyZHM7XG4gICAgdmFyIHRhcmdldCA9IHRoaXMucmVzb2x2ZVRhcmdldChub3JtYWxpemVkVGFyZ2V0KTtcblxuICAgIHZhciB0cmFuc2l0aW9uID0gX19hc3NpZ24oX19hc3NpZ24oe30sIHRyYW5zaXRpb25Db25maWcpLCB7XG4gICAgICBhY3Rpb25zOiB0b0FjdGlvbk9iamVjdHModG9BcnJheSh0cmFuc2l0aW9uQ29uZmlnLmFjdGlvbnMpKSxcbiAgICAgIGNvbmQ6IHRvR3VhcmQodHJhbnNpdGlvbkNvbmZpZy5jb25kLCBndWFyZHMpLFxuICAgICAgdGFyZ2V0OiB0YXJnZXQsXG4gICAgICBzb3VyY2U6IHRoaXMsXG4gICAgICBpbnRlcm5hbDogaW50ZXJuYWwsXG4gICAgICBldmVudFR5cGU6IHRyYW5zaXRpb25Db25maWcuZXZlbnQsXG4gICAgICB0b0pTT046IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCB0cmFuc2l0aW9uKSwge1xuICAgICAgICAgIHRhcmdldDogdHJhbnNpdGlvbi50YXJnZXQgPyB0cmFuc2l0aW9uLnRhcmdldC5tYXAoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHJldHVybiBcIiNcIi5jb25jYXQodC5pZCk7XG4gICAgICAgICAgfSkgOiB1bmRlZmluZWQsXG4gICAgICAgICAgc291cmNlOiBcIiNcIi5jb25jYXQoX3RoaXMuaWQpXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRyYW5zaXRpb247XG4gIH07XG5cbiAgU3RhdGVOb2RlLnByb3RvdHlwZS5mb3JtYXRUcmFuc2l0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZV8xMCwgX2E7XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIG9uQ29uZmlnO1xuXG4gICAgaWYgKCF0aGlzLmNvbmZpZy5vbikge1xuICAgICAgb25Db25maWcgPSBbXTtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5jb25maWcub24pKSB7XG4gICAgICBvbkNvbmZpZyA9IHRoaXMuY29uZmlnLm9uO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgX2IgPSB0aGlzLmNvbmZpZy5vbixcbiAgICAgICAgICBfYyA9IFdJTERDQVJELFxuICAgICAgICAgIF9kID0gX2JbX2NdLFxuICAgICAgICAgIHdpbGRjYXJkQ29uZmlncyA9IF9kID09PSB2b2lkIDAgPyBbXSA6IF9kLFxuICAgICAgICAgIHN0cmljdFRyYW5zaXRpb25Db25maWdzXzEgPSBfX3Jlc3QoX2IsIFt0eXBlb2YgX2MgPT09IFwic3ltYm9sXCIgPyBfYyA6IF9jICsgXCJcIl0pO1xuXG4gICAgICBvbkNvbmZpZyA9IGZsYXR0ZW4oT2JqZWN0LmtleXMoc3RyaWN0VHJhbnNpdGlvbkNvbmZpZ3NfMSkubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgaWYgKCFJU19QUk9EVUNUSU9OICYmIGtleSA9PT0gTlVMTF9FVkVOVCkge1xuICAgICAgICAgIHdhcm4oZmFsc2UsIFwiRW1wdHkgc3RyaW5nIHRyYW5zaXRpb24gY29uZmlncyAoZS5nLiwgYHsgb246IHsgJyc6IC4uLiB9fWApIGZvciB0cmFuc2llbnQgdHJhbnNpdGlvbnMgYXJlIGRlcHJlY2F0ZWQuIFNwZWNpZnkgdGhlIHRyYW5zaXRpb24gaW4gdGhlIGB7IGFsd2F5czogLi4uIH1gIHByb3BlcnR5IGluc3RlYWQuIFwiICsgXCJQbGVhc2UgY2hlY2sgdGhlIGBvbmAgY29uZmlndXJhdGlvbiBmb3IgXFxcIiNcIi5jb25jYXQoX3RoaXMuaWQsIFwiXFxcIi5cIikpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRyYW5zaXRpb25Db25maWdBcnJheSA9IHRvVHJhbnNpdGlvbkNvbmZpZ0FycmF5KGtleSwgc3RyaWN0VHJhbnNpdGlvbkNvbmZpZ3NfMVtrZXldKTtcblxuICAgICAgICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICAgICAgICB2YWxpZGF0ZUFycmF5aWZpZWRUcmFuc2l0aW9ucyhfdGhpcywga2V5LCB0cmFuc2l0aW9uQ29uZmlnQXJyYXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRyYW5zaXRpb25Db25maWdBcnJheTtcbiAgICAgIH0pLmNvbmNhdCh0b1RyYW5zaXRpb25Db25maWdBcnJheShXSUxEQ0FSRCwgd2lsZGNhcmRDb25maWdzKSkpO1xuICAgIH1cblxuICAgIHZhciBldmVudGxlc3NDb25maWcgPSB0aGlzLmNvbmZpZy5hbHdheXMgPyB0b1RyYW5zaXRpb25Db25maWdBcnJheSgnJywgdGhpcy5jb25maWcuYWx3YXlzKSA6IFtdO1xuICAgIHZhciBkb25lQ29uZmlnID0gdGhpcy5jb25maWcub25Eb25lID8gdG9UcmFuc2l0aW9uQ29uZmlnQXJyYXkoU3RyaW5nKGRvbmUodGhpcy5pZCkpLCB0aGlzLmNvbmZpZy5vbkRvbmUpIDogW107XG5cbiAgICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICAgIHdhcm4oISh0aGlzLmNvbmZpZy5vbkRvbmUgJiYgIXRoaXMucGFyZW50KSwgXCJSb290IG5vZGVzIGNhbm5vdCBoYXZlIGFuIFxcXCIub25Eb25lXFxcIiB0cmFuc2l0aW9uLiBQbGVhc2UgY2hlY2sgdGhlIGNvbmZpZyBvZiBcXFwiXCIuY29uY2F0KHRoaXMuaWQsIFwiXFxcIi5cIikpO1xuICAgIH1cblxuICAgIHZhciBpbnZva2VDb25maWcgPSBmbGF0dGVuKHRoaXMuaW52b2tlLm1hcChmdW5jdGlvbiAoaW52b2tlRGVmKSB7XG4gICAgICB2YXIgc2V0dGxlVHJhbnNpdGlvbnMgPSBbXTtcblxuICAgICAgaWYgKGludm9rZURlZi5vbkRvbmUpIHtcbiAgICAgICAgc2V0dGxlVHJhbnNpdGlvbnMucHVzaC5hcHBseShzZXR0bGVUcmFuc2l0aW9ucywgX19zcHJlYWRBcnJheShbXSwgX19yZWFkKHRvVHJhbnNpdGlvbkNvbmZpZ0FycmF5KFN0cmluZyhkb25lSW52b2tlKGludm9rZURlZi5pZCkpLCBpbnZva2VEZWYub25Eb25lKSksIGZhbHNlKSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpbnZva2VEZWYub25FcnJvcikge1xuICAgICAgICBzZXR0bGVUcmFuc2l0aW9ucy5wdXNoLmFwcGx5KHNldHRsZVRyYW5zaXRpb25zLCBfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQodG9UcmFuc2l0aW9uQ29uZmlnQXJyYXkoU3RyaW5nKGVycm9yKGludm9rZURlZi5pZCkpLCBpbnZva2VEZWYub25FcnJvcikpLCBmYWxzZSkpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2V0dGxlVHJhbnNpdGlvbnM7XG4gICAgfSkpO1xuICAgIHZhciBkZWxheWVkVHJhbnNpdGlvbnMgPSB0aGlzLmFmdGVyO1xuICAgIHZhciBmb3JtYXR0ZWRUcmFuc2l0aW9ucyA9IGZsYXR0ZW4oX19zcHJlYWRBcnJheShfX3NwcmVhZEFycmF5KF9fc3ByZWFkQXJyYXkoX19zcHJlYWRBcnJheShbXSwgX19yZWFkKGRvbmVDb25maWcpLCBmYWxzZSksIF9fcmVhZChpbnZva2VDb25maWcpLCBmYWxzZSksIF9fcmVhZChvbkNvbmZpZyksIGZhbHNlKSwgX19yZWFkKGV2ZW50bGVzc0NvbmZpZyksIGZhbHNlKS5tYXAoZnVuY3Rpb24gKHRyYW5zaXRpb25Db25maWcpIHtcbiAgICAgIHJldHVybiB0b0FycmF5KHRyYW5zaXRpb25Db25maWcpLm1hcChmdW5jdGlvbiAodHJhbnNpdGlvbikge1xuICAgICAgICByZXR1cm4gX3RoaXMuZm9ybWF0VHJhbnNpdGlvbih0cmFuc2l0aW9uKTtcbiAgICAgIH0pO1xuICAgIH0pKTtcblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBkZWxheWVkVHJhbnNpdGlvbnNfMSA9IF9fdmFsdWVzKGRlbGF5ZWRUcmFuc2l0aW9ucyksIGRlbGF5ZWRUcmFuc2l0aW9uc18xXzEgPSBkZWxheWVkVHJhbnNpdGlvbnNfMS5uZXh0KCk7ICFkZWxheWVkVHJhbnNpdGlvbnNfMV8xLmRvbmU7IGRlbGF5ZWRUcmFuc2l0aW9uc18xXzEgPSBkZWxheWVkVHJhbnNpdGlvbnNfMS5uZXh0KCkpIHtcbiAgICAgICAgdmFyIGRlbGF5ZWRUcmFuc2l0aW9uID0gZGVsYXllZFRyYW5zaXRpb25zXzFfMS52YWx1ZTtcbiAgICAgICAgZm9ybWF0dGVkVHJhbnNpdGlvbnMucHVzaChkZWxheWVkVHJhbnNpdGlvbik7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV8xMF8xKSB7XG4gICAgICBlXzEwID0ge1xuICAgICAgICBlcnJvcjogZV8xMF8xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoZGVsYXllZFRyYW5zaXRpb25zXzFfMSAmJiAhZGVsYXllZFRyYW5zaXRpb25zXzFfMS5kb25lICYmIChfYSA9IGRlbGF5ZWRUcmFuc2l0aW9uc18xLnJldHVybikpIF9hLmNhbGwoZGVsYXllZFRyYW5zaXRpb25zXzEpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfMTApIHRocm93IGVfMTAuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZvcm1hdHRlZFRyYW5zaXRpb25zO1xuICB9O1xuXG4gIHJldHVybiBTdGF0ZU5vZGU7XG59KCk7XG5cbmV4cG9ydCB7IFN0YXRlTm9kZSB9O1xuIiwiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLlxyXG5cclxuUGVybWlzc2lvbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgYW5kL29yIGRpc3RyaWJ1dGUgdGhpcyBzb2Z0d2FyZSBmb3IgYW55XHJcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZC5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTIFdJVEhcclxuUkVHQVJEIFRPIFRISVMgU09GVFdBUkUgSU5DTFVESU5HIEFMTCBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZXHJcbkFORCBGSVRORVNTLiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SIEJFIExJQUJMRSBGT1IgQU5ZIFNQRUNJQUwsIERJUkVDVCxcclxuSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSIFJFU1VMVElORyBGUk9NXHJcbkxPU1MgT0YgVVNFLCBEQVRBIE9SIFBST0ZJVFMsIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBORUdMSUdFTkNFIE9SXHJcbk9USEVSIFRPUlRJT1VTIEFDVElPTiwgQVJJU0lORyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1JcclxuUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuXHJcbnZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn07XHJcblxyXG5mdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxyXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICAgICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5mdW5jdGlvbiBfX3NwcmVhZEFycmF5KHRvLCBmcm9tLCBwYWNrKSB7XHJcbiAgICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgIGlmIChhciB8fCAhKGkgaW4gZnJvbSkpIHtcclxuICAgICAgICAgICAgaWYgKCFhcikgYXIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tLCAwLCBpKTtcclxuICAgICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xyXG59XG5cbmV4cG9ydCB7IF9fYXNzaWduLCBfX3JlYWQsIF9fcmVzdCwgX19zcHJlYWRBcnJheSwgX192YWx1ZXMgfTtcbiIsImltcG9ydCB7IEFjdGlvblR5cGVzIH0gZnJvbSAnLi90eXBlcy5qcyc7XG5cbnZhciBzdGFydCA9IEFjdGlvblR5cGVzLlN0YXJ0O1xudmFyIHN0b3AgPSBBY3Rpb25UeXBlcy5TdG9wO1xudmFyIHJhaXNlID0gQWN0aW9uVHlwZXMuUmFpc2U7XG52YXIgc2VuZCA9IEFjdGlvblR5cGVzLlNlbmQ7XG52YXIgY2FuY2VsID0gQWN0aW9uVHlwZXMuQ2FuY2VsO1xudmFyIG51bGxFdmVudCA9IEFjdGlvblR5cGVzLk51bGxFdmVudDtcbnZhciBhc3NpZ24gPSBBY3Rpb25UeXBlcy5Bc3NpZ247XG52YXIgYWZ0ZXIgPSBBY3Rpb25UeXBlcy5BZnRlcjtcbnZhciBkb25lU3RhdGUgPSBBY3Rpb25UeXBlcy5Eb25lU3RhdGU7XG52YXIgbG9nID0gQWN0aW9uVHlwZXMuTG9nO1xudmFyIGluaXQgPSBBY3Rpb25UeXBlcy5Jbml0O1xudmFyIGludm9rZSA9IEFjdGlvblR5cGVzLkludm9rZTtcbnZhciBlcnJvckV4ZWN1dGlvbiA9IEFjdGlvblR5cGVzLkVycm9yRXhlY3V0aW9uO1xudmFyIGVycm9yUGxhdGZvcm0gPSBBY3Rpb25UeXBlcy5FcnJvclBsYXRmb3JtO1xudmFyIGVycm9yID0gQWN0aW9uVHlwZXMuRXJyb3JDdXN0b207XG52YXIgdXBkYXRlID0gQWN0aW9uVHlwZXMuVXBkYXRlO1xudmFyIGNob29zZSA9IEFjdGlvblR5cGVzLkNob29zZTtcbnZhciBwdXJlID0gQWN0aW9uVHlwZXMuUHVyZTtcblxuZXhwb3J0IHsgYWZ0ZXIsIGFzc2lnbiwgY2FuY2VsLCBjaG9vc2UsIGRvbmVTdGF0ZSwgZXJyb3IsIGVycm9yRXhlY3V0aW9uLCBlcnJvclBsYXRmb3JtLCBpbml0LCBpbnZva2UsIGxvZywgbnVsbEV2ZW50LCBwdXJlLCByYWlzZSwgc2VuZCwgc3RhcnQsIHN0b3AsIHVwZGF0ZSB9O1xuIiwiaW1wb3J0IHsgX19hc3NpZ24sIF9fc3ByZWFkQXJyYXksIF9fcmVhZCwgX192YWx1ZXMgfSBmcm9tICcuL192aXJ0dWFsL190c2xpYi5qcyc7XG5pbXBvcnQgeyBTcGVjaWFsVGFyZ2V0cywgQWN0aW9uVHlwZXMgfSBmcm9tICcuL3R5cGVzLmpzJztcbmltcG9ydCB7IGluaXQsIHJhaXNlIGFzIHJhaXNlJDEsIHNlbmQgYXMgc2VuZCQxLCB1cGRhdGUsIGxvZyBhcyBsb2ckMSwgY2FuY2VsIGFzIGNhbmNlbCQxLCBhc3NpZ24gYXMgYXNzaWduJDEsIGVycm9yIGFzIGVycm9yJDEsIHN0b3AgYXMgc3RvcCQxLCBwdXJlIGFzIHB1cmUkMSwgY2hvb3NlIGFzIGNob29zZSQxIH0gZnJvbSAnLi9hY3Rpb25UeXBlcy5qcyc7XG5pbXBvcnQgKiBhcyBhY3Rpb25UeXBlcyBmcm9tICcuL2FjdGlvblR5cGVzLmpzJztcbmV4cG9ydCB7IGFjdGlvblR5cGVzIH07XG5pbXBvcnQgeyB0b1NDWE1MRXZlbnQsIGlzU3RyaW5nLCBpc0Z1bmN0aW9uLCB0b0V2ZW50T2JqZWN0LCBnZXRFdmVudFR5cGUsIHVwZGF0ZUNvbnRleHQsIGZsYXR0ZW4sIGlzQXJyYXksIHRvQXJyYXksIHRvR3VhcmQsIGV2YWx1YXRlR3VhcmQsIHdhcm4gfSBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7IElTX1BST0RVQ1RJT04gfSBmcm9tICcuL2Vudmlyb25tZW50LmpzJztcblxudmFyIGluaXRFdmVudCA9IC8qI19fUFVSRV9fKi90b1NDWE1MRXZlbnQoe1xuICB0eXBlOiBpbml0XG59KTtcbmZ1bmN0aW9uIGdldEFjdGlvbkZ1bmN0aW9uKGFjdGlvblR5cGUsIGFjdGlvbkZ1bmN0aW9uTWFwKSB7XG4gIHJldHVybiBhY3Rpb25GdW5jdGlvbk1hcCA/IGFjdGlvbkZ1bmN0aW9uTWFwW2FjdGlvblR5cGVdIHx8IHVuZGVmaW5lZCA6IHVuZGVmaW5lZDtcbn1cbmZ1bmN0aW9uIHRvQWN0aW9uT2JqZWN0KGFjdGlvbiwgYWN0aW9uRnVuY3Rpb25NYXApIHtcbiAgdmFyIGFjdGlvbk9iamVjdDtcblxuICBpZiAoaXNTdHJpbmcoYWN0aW9uKSB8fCB0eXBlb2YgYWN0aW9uID09PSAnbnVtYmVyJykge1xuICAgIHZhciBleGVjID0gZ2V0QWN0aW9uRnVuY3Rpb24oYWN0aW9uLCBhY3Rpb25GdW5jdGlvbk1hcCk7XG5cbiAgICBpZiAoaXNGdW5jdGlvbihleGVjKSkge1xuICAgICAgYWN0aW9uT2JqZWN0ID0ge1xuICAgICAgICB0eXBlOiBhY3Rpb24sXG4gICAgICAgIGV4ZWM6IGV4ZWNcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChleGVjKSB7XG4gICAgICBhY3Rpb25PYmplY3QgPSBleGVjO1xuICAgIH0gZWxzZSB7XG4gICAgICBhY3Rpb25PYmplY3QgPSB7XG4gICAgICAgIHR5cGU6IGFjdGlvbixcbiAgICAgICAgZXhlYzogdW5kZWZpbmVkXG4gICAgICB9O1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc0Z1bmN0aW9uKGFjdGlvbikpIHtcbiAgICBhY3Rpb25PYmplY3QgPSB7XG4gICAgICAvLyBDb252ZXJ0IGFjdGlvbiB0byBzdHJpbmcgaWYgdW5uYW1lZFxuICAgICAgdHlwZTogYWN0aW9uLm5hbWUgfHwgYWN0aW9uLnRvU3RyaW5nKCksXG4gICAgICBleGVjOiBhY3Rpb25cbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHZhciBleGVjID0gZ2V0QWN0aW9uRnVuY3Rpb24oYWN0aW9uLnR5cGUsIGFjdGlvbkZ1bmN0aW9uTWFwKTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGV4ZWMpKSB7XG4gICAgICBhY3Rpb25PYmplY3QgPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgYWN0aW9uKSwge1xuICAgICAgICBleGVjOiBleGVjXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGV4ZWMpIHtcbiAgICAgIHZhciBhY3Rpb25UeXBlID0gZXhlYy50eXBlIHx8IGFjdGlvbi50eXBlO1xuICAgICAgYWN0aW9uT2JqZWN0ID0gX19hc3NpZ24oX19hc3NpZ24oX19hc3NpZ24oe30sIGV4ZWMpLCBhY3Rpb24pLCB7XG4gICAgICAgIHR5cGU6IGFjdGlvblR5cGVcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBhY3Rpb25PYmplY3QgPSBhY3Rpb247XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGFjdGlvbk9iamVjdDtcbn1cbnZhciB0b0FjdGlvbk9iamVjdHMgPSBmdW5jdGlvbiAoYWN0aW9uLCBhY3Rpb25GdW5jdGlvbk1hcCkge1xuICBpZiAoIWFjdGlvbikge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHZhciBhY3Rpb25zID0gaXNBcnJheShhY3Rpb24pID8gYWN0aW9uIDogW2FjdGlvbl07XG4gIHJldHVybiBhY3Rpb25zLm1hcChmdW5jdGlvbiAoc3ViQWN0aW9uKSB7XG4gICAgcmV0dXJuIHRvQWN0aW9uT2JqZWN0KHN1YkFjdGlvbiwgYWN0aW9uRnVuY3Rpb25NYXApO1xuICB9KTtcbn07XG5mdW5jdGlvbiB0b0FjdGl2aXR5RGVmaW5pdGlvbihhY3Rpb24pIHtcbiAgdmFyIGFjdGlvbk9iamVjdCA9IHRvQWN0aW9uT2JqZWN0KGFjdGlvbik7XG4gIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7XG4gICAgaWQ6IGlzU3RyaW5nKGFjdGlvbikgPyBhY3Rpb24gOiBhY3Rpb25PYmplY3QuaWRcbiAgfSwgYWN0aW9uT2JqZWN0KSwge1xuICAgIHR5cGU6IGFjdGlvbk9iamVjdC50eXBlXG4gIH0pO1xufVxuLyoqXHJcbiAqIFJhaXNlcyBhbiBldmVudC4gVGhpcyBwbGFjZXMgdGhlIGV2ZW50IGluIHRoZSBpbnRlcm5hbCBldmVudCBxdWV1ZSwgc28gdGhhdFxyXG4gKiB0aGUgZXZlbnQgaXMgaW1tZWRpYXRlbHkgY29uc3VtZWQgYnkgdGhlIG1hY2hpbmUgaW4gdGhlIGN1cnJlbnQgc3RlcC5cclxuICpcclxuICogQHBhcmFtIGV2ZW50VHlwZSBUaGUgZXZlbnQgdG8gcmFpc2UuXHJcbiAqL1xuXG5mdW5jdGlvbiByYWlzZShldmVudCwgb3B0aW9ucykge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IHJhaXNlJDEsXG4gICAgZXZlbnQ6IHR5cGVvZiBldmVudCA9PT0gJ2Z1bmN0aW9uJyA/IGV2ZW50IDogdG9FdmVudE9iamVjdChldmVudCksXG4gICAgZGVsYXk6IG9wdGlvbnMgPyBvcHRpb25zLmRlbGF5IDogdW5kZWZpbmVkLFxuICAgIGlkOiBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuaWRcbiAgfTtcbn1cbmZ1bmN0aW9uIHJlc29sdmVSYWlzZShhY3Rpb24sIGN0eCwgX2V2ZW50LCBkZWxheXNNYXApIHtcbiAgdmFyIG1ldGEgPSB7XG4gICAgX2V2ZW50OiBfZXZlbnRcbiAgfTtcbiAgdmFyIHJlc29sdmVkRXZlbnQgPSB0b1NDWE1MRXZlbnQoaXNGdW5jdGlvbihhY3Rpb24uZXZlbnQpID8gYWN0aW9uLmV2ZW50KGN0eCwgX2V2ZW50LmRhdGEsIG1ldGEpIDogYWN0aW9uLmV2ZW50KTtcbiAgdmFyIHJlc29sdmVkRGVsYXk7XG5cbiAgaWYgKGlzU3RyaW5nKGFjdGlvbi5kZWxheSkpIHtcbiAgICB2YXIgY29uZmlnRGVsYXkgPSBkZWxheXNNYXAgJiYgZGVsYXlzTWFwW2FjdGlvbi5kZWxheV07XG4gICAgcmVzb2x2ZWREZWxheSA9IGlzRnVuY3Rpb24oY29uZmlnRGVsYXkpID8gY29uZmlnRGVsYXkoY3R4LCBfZXZlbnQuZGF0YSwgbWV0YSkgOiBjb25maWdEZWxheTtcbiAgfSBlbHNlIHtcbiAgICByZXNvbHZlZERlbGF5ID0gaXNGdW5jdGlvbihhY3Rpb24uZGVsYXkpID8gYWN0aW9uLmRlbGF5KGN0eCwgX2V2ZW50LmRhdGEsIG1ldGEpIDogYWN0aW9uLmRlbGF5O1xuICB9XG5cbiAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCBhY3Rpb24pLCB7XG4gICAgdHlwZTogcmFpc2UkMSxcbiAgICBfZXZlbnQ6IHJlc29sdmVkRXZlbnQsXG4gICAgZGVsYXk6IHJlc29sdmVkRGVsYXlcbiAgfSk7XG59XG4vKipcclxuICogU2VuZHMgYW4gZXZlbnQuIFRoaXMgcmV0dXJucyBhbiBhY3Rpb24gdGhhdCB3aWxsIGJlIHJlYWQgYnkgYW4gaW50ZXJwcmV0ZXIgdG9cclxuICogc2VuZCB0aGUgZXZlbnQgaW4gdGhlIG5leHQgc3RlcCwgYWZ0ZXIgdGhlIGN1cnJlbnQgc3RlcCBpcyBmaW5pc2hlZCBleGVjdXRpbmcuXHJcbiAqXHJcbiAqIEBkZXByZWNhdGVkIFVzZSB0aGUgYHNlbmRUbyguLi4pYCBhY3Rpb24gY3JlYXRvciBpbnN0ZWFkLlxyXG4gKlxyXG4gKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50IHRvIHNlbmQuXHJcbiAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgdG8gcGFzcyBpbnRvIHRoZSBzZW5kIGV2ZW50OlxyXG4gKiAgLSBgaWRgIC0gVGhlIHVuaXF1ZSBzZW5kIGV2ZW50IGlkZW50aWZpZXIgKHVzZWQgd2l0aCBgY2FuY2VsKClgKS5cclxuICogIC0gYGRlbGF5YCAtIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIGRlbGF5IHRoZSBzZW5kaW5nIG9mIHRoZSBldmVudC5cclxuICogIC0gYHRvYCAtIFRoZSB0YXJnZXQgb2YgdGhpcyBldmVudCAoYnkgZGVmYXVsdCwgdGhlIG1hY2hpbmUgdGhlIGV2ZW50IHdhcyBzZW50IGZyb20pLlxyXG4gKi9cblxuZnVuY3Rpb24gc2VuZChldmVudCwgb3B0aW9ucykge1xuICByZXR1cm4ge1xuICAgIHRvOiBvcHRpb25zID8gb3B0aW9ucy50byA6IHVuZGVmaW5lZCxcbiAgICB0eXBlOiBzZW5kJDEsXG4gICAgZXZlbnQ6IGlzRnVuY3Rpb24oZXZlbnQpID8gZXZlbnQgOiB0b0V2ZW50T2JqZWN0KGV2ZW50KSxcbiAgICBkZWxheTogb3B0aW9ucyA/IG9wdGlvbnMuZGVsYXkgOiB1bmRlZmluZWQsXG4gICAgLy8gVE9ETzogZG9uJ3QgYXV0by1nZW5lcmF0ZSBJRHMgaGVyZSBsaWtlIHRoYXRcbiAgICAvLyB0aGVyZSBpcyB0b28gYmlnIGNoYW5jZSBvZiB0aGUgSUQgY29sbGlzaW9uXG4gICAgaWQ6IG9wdGlvbnMgJiYgb3B0aW9ucy5pZCAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5pZCA6IGlzRnVuY3Rpb24oZXZlbnQpID8gZXZlbnQubmFtZSA6IGdldEV2ZW50VHlwZShldmVudClcbiAgfTtcbn1cbmZ1bmN0aW9uIHJlc29sdmVTZW5kKGFjdGlvbiwgY3R4LCBfZXZlbnQsIGRlbGF5c01hcCkge1xuICB2YXIgbWV0YSA9IHtcbiAgICBfZXZlbnQ6IF9ldmVudFxuICB9OyAvLyBUT0RPOiBoZWxwZXIgZnVuY3Rpb24gZm9yIHJlc29sdmluZyBFeHByXG5cbiAgdmFyIHJlc29sdmVkRXZlbnQgPSB0b1NDWE1MRXZlbnQoaXNGdW5jdGlvbihhY3Rpb24uZXZlbnQpID8gYWN0aW9uLmV2ZW50KGN0eCwgX2V2ZW50LmRhdGEsIG1ldGEpIDogYWN0aW9uLmV2ZW50KTtcbiAgdmFyIHJlc29sdmVkRGVsYXk7XG5cbiAgaWYgKGlzU3RyaW5nKGFjdGlvbi5kZWxheSkpIHtcbiAgICB2YXIgY29uZmlnRGVsYXkgPSBkZWxheXNNYXAgJiYgZGVsYXlzTWFwW2FjdGlvbi5kZWxheV07XG4gICAgcmVzb2x2ZWREZWxheSA9IGlzRnVuY3Rpb24oY29uZmlnRGVsYXkpID8gY29uZmlnRGVsYXkoY3R4LCBfZXZlbnQuZGF0YSwgbWV0YSkgOiBjb25maWdEZWxheTtcbiAgfSBlbHNlIHtcbiAgICByZXNvbHZlZERlbGF5ID0gaXNGdW5jdGlvbihhY3Rpb24uZGVsYXkpID8gYWN0aW9uLmRlbGF5KGN0eCwgX2V2ZW50LmRhdGEsIG1ldGEpIDogYWN0aW9uLmRlbGF5O1xuICB9XG5cbiAgdmFyIHJlc29sdmVkVGFyZ2V0ID0gaXNGdW5jdGlvbihhY3Rpb24udG8pID8gYWN0aW9uLnRvKGN0eCwgX2V2ZW50LmRhdGEsIG1ldGEpIDogYWN0aW9uLnRvO1xuICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIGFjdGlvbiksIHtcbiAgICB0bzogcmVzb2x2ZWRUYXJnZXQsXG4gICAgX2V2ZW50OiByZXNvbHZlZEV2ZW50LFxuICAgIGV2ZW50OiByZXNvbHZlZEV2ZW50LmRhdGEsXG4gICAgZGVsYXk6IHJlc29sdmVkRGVsYXlcbiAgfSk7XG59XG4vKipcclxuICogU2VuZHMgYW4gZXZlbnQgdG8gdGhpcyBtYWNoaW5lJ3MgcGFyZW50LlxyXG4gKlxyXG4gKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50IHRvIHNlbmQgdG8gdGhlIHBhcmVudCBtYWNoaW5lLlxyXG4gKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIHRvIHBhc3MgaW50byB0aGUgc2VuZCBldmVudC5cclxuICovXG5cbmZ1bmN0aW9uIHNlbmRQYXJlbnQoZXZlbnQsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIHNlbmQoZXZlbnQsIF9fYXNzaWduKF9fYXNzaWduKHt9LCBvcHRpb25zKSwge1xuICAgIHRvOiBTcGVjaWFsVGFyZ2V0cy5QYXJlbnRcbiAgfSkpO1xufVxuLyoqXHJcbiAqIFNlbmRzIGFuIGV2ZW50IHRvIGFuIGFjdG9yLlxyXG4gKlxyXG4gKiBAcGFyYW0gYWN0b3IgVGhlIGBBY3RvclJlZmAgdG8gc2VuZCB0aGUgZXZlbnQgdG8uXHJcbiAqIEBwYXJhbSBldmVudCBUaGUgZXZlbnQgdG8gc2VuZCwgb3IgYW4gZXhwcmVzc2lvbiB0aGF0IGV2YWx1YXRlcyB0byB0aGUgZXZlbnQgdG8gc2VuZFxyXG4gKiBAcGFyYW0gb3B0aW9ucyBTZW5kIGFjdGlvbiBvcHRpb25zXHJcbiAqIEByZXR1cm5zIEFuIFhTdGF0ZSBzZW5kIGFjdGlvbiBvYmplY3RcclxuICovXG5cbmZ1bmN0aW9uIHNlbmRUbyhhY3RvciwgZXZlbnQsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIHNlbmQoZXZlbnQsIF9fYXNzaWduKF9fYXNzaWduKHt9LCBvcHRpb25zKSwge1xuICAgIHRvOiBhY3RvclxuICB9KSk7XG59XG4vKipcclxuICogU2VuZHMgYW4gdXBkYXRlIGV2ZW50IHRvIHRoaXMgbWFjaGluZSdzIHBhcmVudC5cclxuICovXG5cbmZ1bmN0aW9uIHNlbmRVcGRhdGUoKSB7XG4gIHJldHVybiBzZW5kUGFyZW50KHVwZGF0ZSk7XG59XG4vKipcclxuICogU2VuZHMgYW4gZXZlbnQgYmFjayB0byB0aGUgc2VuZGVyIG9mIHRoZSBvcmlnaW5hbCBldmVudC5cclxuICpcclxuICogQHBhcmFtIGV2ZW50IFRoZSBldmVudCB0byBzZW5kIGJhY2sgdG8gdGhlIHNlbmRlclxyXG4gKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIHRvIHBhc3MgaW50byB0aGUgc2VuZCBldmVudFxyXG4gKi9cblxuZnVuY3Rpb24gcmVzcG9uZChldmVudCwgb3B0aW9ucykge1xuICByZXR1cm4gc2VuZChldmVudCwgX19hc3NpZ24oX19hc3NpZ24oe30sIG9wdGlvbnMpLCB7XG4gICAgdG86IGZ1bmN0aW9uIChfLCBfXywgX2EpIHtcbiAgICAgIHZhciBfZXZlbnQgPSBfYS5fZXZlbnQ7XG4gICAgICByZXR1cm4gX2V2ZW50Lm9yaWdpbjsgLy8gVE9ETzogaGFuZGxlIHdoZW4gX2V2ZW50Lm9yaWdpbiBpcyB1bmRlZmluZWRcbiAgICB9XG4gIH0pKTtcbn1cblxudmFyIGRlZmF1bHRMb2dFeHByID0gZnVuY3Rpb24gKGNvbnRleHQsIGV2ZW50KSB7XG4gIHJldHVybiB7XG4gICAgY29udGV4dDogY29udGV4dCxcbiAgICBldmVudDogZXZlbnRcbiAgfTtcbn07XG4vKipcclxuICpcclxuICogQHBhcmFtIGV4cHIgVGhlIGV4cHJlc3Npb24gZnVuY3Rpb24gdG8gZXZhbHVhdGUgd2hpY2ggd2lsbCBiZSBsb2dnZWQuXHJcbiAqICBUYWtlcyBpbiAyIGFyZ3VtZW50czpcclxuICogIC0gYGN0eGAgLSB0aGUgY3VycmVudCBzdGF0ZSBjb250ZXh0XHJcbiAqICAtIGBldmVudGAgLSB0aGUgZXZlbnQgdGhhdCBjYXVzZWQgdGhpcyBhY3Rpb24gdG8gYmUgZXhlY3V0ZWQuXHJcbiAqIEBwYXJhbSBsYWJlbCBUaGUgbGFiZWwgdG8gZ2l2ZSB0byB0aGUgbG9nZ2VkIGV4cHJlc3Npb24uXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGxvZyhleHByLCBsYWJlbCkge1xuICBpZiAoZXhwciA9PT0gdm9pZCAwKSB7XG4gICAgZXhwciA9IGRlZmF1bHRMb2dFeHByO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBsb2ckMSxcbiAgICBsYWJlbDogbGFiZWwsXG4gICAgZXhwcjogZXhwclxuICB9O1xufVxudmFyIHJlc29sdmVMb2cgPSBmdW5jdGlvbiAoYWN0aW9uLCBjdHgsIF9ldmVudCkge1xuICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIGFjdGlvbiksIHtcbiAgICB2YWx1ZTogaXNTdHJpbmcoYWN0aW9uLmV4cHIpID8gYWN0aW9uLmV4cHIgOiBhY3Rpb24uZXhwcihjdHgsIF9ldmVudC5kYXRhLCB7XG4gICAgICBfZXZlbnQ6IF9ldmVudFxuICAgIH0pXG4gIH0pO1xufTtcbi8qKlxyXG4gKiBDYW5jZWxzIGFuIGluLWZsaWdodCBgc2VuZCguLi4pYCBhY3Rpb24uIEEgY2FuY2VsZWQgc2VudCBhY3Rpb24gd2lsbCBub3RcclxuICogYmUgZXhlY3V0ZWQsIG5vciB3aWxsIGl0cyBldmVudCBiZSBzZW50LCB1bmxlc3MgaXQgaGFzIGFscmVhZHkgYmVlbiBzZW50XHJcbiAqIChlLmcuLCBpZiBgY2FuY2VsKC4uLilgIGlzIGNhbGxlZCBhZnRlciB0aGUgYHNlbmQoLi4uKWAgYWN0aW9uJ3MgYGRlbGF5YCkuXHJcbiAqXHJcbiAqIEBwYXJhbSBzZW5kSWQgVGhlIGBpZGAgb2YgdGhlIGBzZW5kKC4uLilgIGFjdGlvbiB0byBjYW5jZWwuXHJcbiAqL1xuXG52YXIgY2FuY2VsID0gZnVuY3Rpb24gKHNlbmRJZCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IGNhbmNlbCQxLFxuICAgIHNlbmRJZDogc2VuZElkXG4gIH07XG59O1xuLyoqXHJcbiAqIFN0YXJ0cyBhbiBhY3Rpdml0eS5cclxuICpcclxuICogQHBhcmFtIGFjdGl2aXR5IFRoZSBhY3Rpdml0eSB0byBzdGFydC5cclxuICovXG5cbmZ1bmN0aW9uIHN0YXJ0KGFjdGl2aXR5KSB7XG4gIHZhciBhY3Rpdml0eURlZiA9IHRvQWN0aXZpdHlEZWZpbml0aW9uKGFjdGl2aXR5KTtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5TdGFydCxcbiAgICBhY3Rpdml0eTogYWN0aXZpdHlEZWYsXG4gICAgZXhlYzogdW5kZWZpbmVkXG4gIH07XG59XG4vKipcclxuICogU3RvcHMgYW4gYWN0aXZpdHkuXHJcbiAqXHJcbiAqIEBwYXJhbSBhY3RvclJlZiBUaGUgYWN0aXZpdHkgdG8gc3RvcC5cclxuICovXG5cbmZ1bmN0aW9uIHN0b3AoYWN0b3JSZWYpIHtcbiAgdmFyIGFjdGl2aXR5ID0gaXNGdW5jdGlvbihhY3RvclJlZikgPyBhY3RvclJlZiA6IHRvQWN0aXZpdHlEZWZpbml0aW9uKGFjdG9yUmVmKTtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5TdG9wLFxuICAgIGFjdGl2aXR5OiBhY3Rpdml0eSxcbiAgICBleGVjOiB1bmRlZmluZWRcbiAgfTtcbn1cbmZ1bmN0aW9uIHJlc29sdmVTdG9wKGFjdGlvbiwgY29udGV4dCwgX2V2ZW50KSB7XG4gIHZhciBhY3RvclJlZk9yU3RyaW5nID0gaXNGdW5jdGlvbihhY3Rpb24uYWN0aXZpdHkpID8gYWN0aW9uLmFjdGl2aXR5KGNvbnRleHQsIF9ldmVudC5kYXRhKSA6IGFjdGlvbi5hY3Rpdml0eTtcbiAgdmFyIHJlc29sdmVkQWN0b3JSZWYgPSB0eXBlb2YgYWN0b3JSZWZPclN0cmluZyA9PT0gJ3N0cmluZycgPyB7XG4gICAgaWQ6IGFjdG9yUmVmT3JTdHJpbmdcbiAgfSA6IGFjdG9yUmVmT3JTdHJpbmc7XG4gIHZhciBhY3Rpb25PYmplY3QgPSB7XG4gICAgdHlwZTogQWN0aW9uVHlwZXMuU3RvcCxcbiAgICBhY3Rpdml0eTogcmVzb2x2ZWRBY3RvclJlZlxuICB9O1xuICByZXR1cm4gYWN0aW9uT2JqZWN0O1xufVxuLyoqXHJcbiAqIFVwZGF0ZXMgdGhlIGN1cnJlbnQgY29udGV4dCBvZiB0aGUgbWFjaGluZS5cclxuICpcclxuICogQHBhcmFtIGFzc2lnbm1lbnQgQW4gb2JqZWN0IHRoYXQgcmVwcmVzZW50cyB0aGUgcGFydGlhbCBjb250ZXh0IHRvIHVwZGF0ZS5cclxuICovXG5cbnZhciBhc3NpZ24gPSBmdW5jdGlvbiAoYXNzaWdubWVudCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IGFzc2lnbiQxLFxuICAgIGFzc2lnbm1lbnQ6IGFzc2lnbm1lbnRcbiAgfTtcbn07XG5mdW5jdGlvbiBpc0FjdGlvbk9iamVjdChhY3Rpb24pIHtcbiAgcmV0dXJuIHR5cGVvZiBhY3Rpb24gPT09ICdvYmplY3QnICYmICd0eXBlJyBpbiBhY3Rpb247XG59XG4vKipcclxuICogUmV0dXJucyBhbiBldmVudCB0eXBlIHRoYXQgcmVwcmVzZW50cyBhbiBpbXBsaWNpdCBldmVudCB0aGF0XHJcbiAqIGlzIHNlbnQgYWZ0ZXIgdGhlIHNwZWNpZmllZCBgZGVsYXlgLlxyXG4gKlxyXG4gKiBAcGFyYW0gZGVsYXlSZWYgVGhlIGRlbGF5IGluIG1pbGxpc2Vjb25kc1xyXG4gKiBAcGFyYW0gaWQgVGhlIHN0YXRlIG5vZGUgSUQgd2hlcmUgdGhpcyBldmVudCBpcyBoYW5kbGVkXHJcbiAqL1xuXG5mdW5jdGlvbiBhZnRlcihkZWxheVJlZiwgaWQpIHtcbiAgdmFyIGlkU3VmZml4ID0gaWQgPyBcIiNcIi5jb25jYXQoaWQpIDogJyc7XG4gIHJldHVybiBcIlwiLmNvbmNhdChBY3Rpb25UeXBlcy5BZnRlciwgXCIoXCIpLmNvbmNhdChkZWxheVJlZiwgXCIpXCIpLmNvbmNhdChpZFN1ZmZpeCk7XG59XG4vKipcclxuICogUmV0dXJucyBhbiBldmVudCB0aGF0IHJlcHJlc2VudHMgdGhhdCBhIGZpbmFsIHN0YXRlIG5vZGVcclxuICogaGFzIGJlZW4gcmVhY2hlZCBpbiB0aGUgcGFyZW50IHN0YXRlIG5vZGUuXHJcbiAqXHJcbiAqIEBwYXJhbSBpZCBUaGUgZmluYWwgc3RhdGUgbm9kZSdzIHBhcmVudCBzdGF0ZSBub2RlIGBpZGBcclxuICogQHBhcmFtIGRhdGEgVGhlIGRhdGEgdG8gcGFzcyBpbnRvIHRoZSBldmVudFxyXG4gKi9cblxuZnVuY3Rpb24gZG9uZShpZCwgZGF0YSkge1xuICB2YXIgdHlwZSA9IFwiXCIuY29uY2F0KEFjdGlvblR5cGVzLkRvbmVTdGF0ZSwgXCIuXCIpLmNvbmNhdChpZCk7XG4gIHZhciBldmVudE9iamVjdCA9IHtcbiAgICB0eXBlOiB0eXBlLFxuICAgIGRhdGE6IGRhdGFcbiAgfTtcblxuICBldmVudE9iamVjdC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdHlwZTtcbiAgfTtcblxuICByZXR1cm4gZXZlbnRPYmplY3Q7XG59XG4vKipcclxuICogUmV0dXJucyBhbiBldmVudCB0aGF0IHJlcHJlc2VudHMgdGhhdCBhbiBpbnZva2VkIHNlcnZpY2UgaGFzIHRlcm1pbmF0ZWQuXHJcbiAqXHJcbiAqIEFuIGludm9rZWQgc2VydmljZSBpcyB0ZXJtaW5hdGVkIHdoZW4gaXQgaGFzIHJlYWNoZWQgYSB0b3AtbGV2ZWwgZmluYWwgc3RhdGUgbm9kZSxcclxuICogYnV0IG5vdCB3aGVuIGl0IGlzIGNhbmNlbGVkLlxyXG4gKlxyXG4gKiBAcGFyYW0gaWQgVGhlIGZpbmFsIHN0YXRlIG5vZGUgSURcclxuICogQHBhcmFtIGRhdGEgVGhlIGRhdGEgdG8gcGFzcyBpbnRvIHRoZSBldmVudFxyXG4gKi9cblxuZnVuY3Rpb24gZG9uZUludm9rZShpZCwgZGF0YSkge1xuICB2YXIgdHlwZSA9IFwiXCIuY29uY2F0KEFjdGlvblR5cGVzLkRvbmVJbnZva2UsIFwiLlwiKS5jb25jYXQoaWQpO1xuICB2YXIgZXZlbnRPYmplY3QgPSB7XG4gICAgdHlwZTogdHlwZSxcbiAgICBkYXRhOiBkYXRhXG4gIH07XG5cbiAgZXZlbnRPYmplY3QudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHR5cGU7XG4gIH07XG5cbiAgcmV0dXJuIGV2ZW50T2JqZWN0O1xufVxuZnVuY3Rpb24gZXJyb3IoaWQsIGRhdGEpIHtcbiAgdmFyIHR5cGUgPSBcIlwiLmNvbmNhdChBY3Rpb25UeXBlcy5FcnJvclBsYXRmb3JtLCBcIi5cIikuY29uY2F0KGlkKTtcbiAgdmFyIGV2ZW50T2JqZWN0ID0ge1xuICAgIHR5cGU6IHR5cGUsXG4gICAgZGF0YTogZGF0YVxuICB9O1xuXG4gIGV2ZW50T2JqZWN0LnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0eXBlO1xuICB9O1xuXG4gIHJldHVybiBldmVudE9iamVjdDtcbn1cbmZ1bmN0aW9uIHB1cmUoZ2V0QWN0aW9ucykge1xuICByZXR1cm4ge1xuICAgIHR5cGU6IEFjdGlvblR5cGVzLlB1cmUsXG4gICAgZ2V0OiBnZXRBY3Rpb25zXG4gIH07XG59XG4vKipcclxuICogRm9yd2FyZHMgKHNlbmRzKSBhbiBldmVudCB0byBhIHNwZWNpZmllZCBzZXJ2aWNlLlxyXG4gKlxyXG4gKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgc2VydmljZSB0byBmb3J3YXJkIHRoZSBldmVudCB0by5cclxuICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyB0byBwYXNzIGludG8gdGhlIHNlbmQgYWN0aW9uIGNyZWF0b3IuXHJcbiAqL1xuXG5mdW5jdGlvbiBmb3J3YXJkVG8odGFyZ2V0LCBvcHRpb25zKSB7XG4gIGlmICghSVNfUFJPRFVDVElPTiAmJiAoIXRhcmdldCB8fCB0eXBlb2YgdGFyZ2V0ID09PSAnZnVuY3Rpb24nKSkge1xuICAgIHZhciBvcmlnaW5hbFRhcmdldF8xID0gdGFyZ2V0O1xuXG4gICAgdGFyZ2V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGFyZ3MgPSBbXTtcblxuICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVzb2x2ZWRUYXJnZXQgPSB0eXBlb2Ygb3JpZ2luYWxUYXJnZXRfMSA9PT0gJ2Z1bmN0aW9uJyA/IG9yaWdpbmFsVGFyZ2V0XzEuYXBwbHkodm9pZCAwLCBfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQoYXJncyksIGZhbHNlKSkgOiBvcmlnaW5hbFRhcmdldF8xO1xuXG4gICAgICBpZiAoIXJlc29sdmVkVGFyZ2V0KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkF0dGVtcHRlZCB0byBmb3J3YXJkIGV2ZW50IHRvIHVuZGVmaW5lZCBhY3Rvci4gVGhpcyByaXNrcyBhbiBpbmZpbml0ZSBsb29wIGluIHRoZSBzZW5kZXIuXCIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzb2x2ZWRUYXJnZXQ7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBzZW5kKGZ1bmN0aW9uIChfLCBldmVudCkge1xuICAgIHJldHVybiBldmVudDtcbiAgfSwgX19hc3NpZ24oX19hc3NpZ24oe30sIG9wdGlvbnMpLCB7XG4gICAgdG86IHRhcmdldFxuICB9KSk7XG59XG4vKipcclxuICogRXNjYWxhdGVzIGFuIGVycm9yIGJ5IHNlbmRpbmcgaXQgYXMgYW4gZXZlbnQgdG8gdGhpcyBtYWNoaW5lJ3MgcGFyZW50LlxyXG4gKlxyXG4gKiBAcGFyYW0gZXJyb3JEYXRhIFRoZSBlcnJvciBkYXRhIHRvIHNlbmQsIG9yIHRoZSBleHByZXNzaW9uIGZ1bmN0aW9uIHRoYXRcclxuICogdGFrZXMgaW4gdGhlIGBjb250ZXh0YCwgYGV2ZW50YCwgYW5kIGBtZXRhYCwgYW5kIHJldHVybnMgdGhlIGVycm9yIGRhdGEgdG8gc2VuZC5cclxuICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyB0byBwYXNzIGludG8gdGhlIHNlbmQgYWN0aW9uIGNyZWF0b3IuXHJcbiAqL1xuXG5mdW5jdGlvbiBlc2NhbGF0ZShlcnJvckRhdGEsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIHNlbmRQYXJlbnQoZnVuY3Rpb24gKGNvbnRleHQsIGV2ZW50LCBtZXRhKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6IGVycm9yJDEsXG4gICAgICBkYXRhOiBpc0Z1bmN0aW9uKGVycm9yRGF0YSkgPyBlcnJvckRhdGEoY29udGV4dCwgZXZlbnQsIG1ldGEpIDogZXJyb3JEYXRhXG4gICAgfTtcbiAgfSwgX19hc3NpZ24oX19hc3NpZ24oe30sIG9wdGlvbnMpLCB7XG4gICAgdG86IFNwZWNpYWxUYXJnZXRzLlBhcmVudFxuICB9KSk7XG59XG5mdW5jdGlvbiBjaG9vc2UoY29uZHMpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBBY3Rpb25UeXBlcy5DaG9vc2UsXG4gICAgY29uZHM6IGNvbmRzXG4gIH07XG59XG5cbnZhciBwbHVja0Fzc2lnbnMgPSBmdW5jdGlvbiAoYWN0aW9uQmxvY2tzKSB7XG4gIHZhciBlXzEsIF9hO1xuXG4gIHZhciBhc3NpZ25BY3Rpb25zID0gW107XG5cbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBhY3Rpb25CbG9ja3NfMSA9IF9fdmFsdWVzKGFjdGlvbkJsb2NrcyksIGFjdGlvbkJsb2Nrc18xXzEgPSBhY3Rpb25CbG9ja3NfMS5uZXh0KCk7ICFhY3Rpb25CbG9ja3NfMV8xLmRvbmU7IGFjdGlvbkJsb2Nrc18xXzEgPSBhY3Rpb25CbG9ja3NfMS5uZXh0KCkpIHtcbiAgICAgIHZhciBibG9jayA9IGFjdGlvbkJsb2Nrc18xXzEudmFsdWU7XG4gICAgICB2YXIgaSA9IDA7XG5cbiAgICAgIHdoaWxlIChpIDwgYmxvY2suYWN0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKGJsb2NrLmFjdGlvbnNbaV0udHlwZSA9PT0gYXNzaWduJDEpIHtcbiAgICAgICAgICBhc3NpZ25BY3Rpb25zLnB1c2goYmxvY2suYWN0aW9uc1tpXSk7XG4gICAgICAgICAgYmxvY2suYWN0aW9ucy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlXzFfMSkge1xuICAgIGVfMSA9IHtcbiAgICAgIGVycm9yOiBlXzFfMVxuICAgIH07XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChhY3Rpb25CbG9ja3NfMV8xICYmICFhY3Rpb25CbG9ja3NfMV8xLmRvbmUgJiYgKF9hID0gYWN0aW9uQmxvY2tzXzEucmV0dXJuKSkgX2EuY2FsbChhY3Rpb25CbG9ja3NfMSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYXNzaWduQWN0aW9ucztcbn07XG5cbmZ1bmN0aW9uIHJlc29sdmVBY3Rpb25zKG1hY2hpbmUsIGN1cnJlbnRTdGF0ZSwgY3VycmVudENvbnRleHQsIF9ldmVudCwgYWN0aW9uQmxvY2tzLCBwcmVkaWN0YWJsZUV4ZWMsIHByZXNlcnZlQWN0aW9uT3JkZXIpIHtcbiAgaWYgKHByZXNlcnZlQWN0aW9uT3JkZXIgPT09IHZvaWQgMCkge1xuICAgIHByZXNlcnZlQWN0aW9uT3JkZXIgPSBmYWxzZTtcbiAgfVxuXG4gIHZhciBhc3NpZ25BY3Rpb25zID0gcHJlc2VydmVBY3Rpb25PcmRlciA/IFtdIDogcGx1Y2tBc3NpZ25zKGFjdGlvbkJsb2Nrcyk7XG4gIHZhciB1cGRhdGVkQ29udGV4dCA9IGFzc2lnbkFjdGlvbnMubGVuZ3RoID8gdXBkYXRlQ29udGV4dChjdXJyZW50Q29udGV4dCwgX2V2ZW50LCBhc3NpZ25BY3Rpb25zLCBjdXJyZW50U3RhdGUpIDogY3VycmVudENvbnRleHQ7XG4gIHZhciBwcmVzZXJ2ZWRDb250ZXh0cyA9IHByZXNlcnZlQWN0aW9uT3JkZXIgPyBbY3VycmVudENvbnRleHRdIDogdW5kZWZpbmVkO1xuICB2YXIgZGVmZXJyZWRUb0Jsb2NrRW5kID0gW107XG5cbiAgZnVuY3Rpb24gaGFuZGxlQWN0aW9uKGJsb2NrVHlwZSwgYWN0aW9uT2JqZWN0KSB7XG4gICAgdmFyIF9hO1xuXG4gICAgc3dpdGNoIChhY3Rpb25PYmplY3QudHlwZSkge1xuICAgICAgY2FzZSByYWlzZSQxOlxuICAgICAgICB7XG4gICAgICAgICAgdmFyIHJhaXNlZEFjdGlvbiA9IHJlc29sdmVSYWlzZShhY3Rpb25PYmplY3QsIHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQsIG1hY2hpbmUub3B0aW9ucy5kZWxheXMpO1xuXG4gICAgICAgICAgaWYgKHByZWRpY3RhYmxlRXhlYyAmJiB0eXBlb2YgcmFpc2VkQWN0aW9uLmRlbGF5ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgcHJlZGljdGFibGVFeGVjKHJhaXNlZEFjdGlvbiwgdXBkYXRlZENvbnRleHQsIF9ldmVudCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHJhaXNlZEFjdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICBjYXNlIHNlbmQkMTpcbiAgICAgICAgdmFyIHNlbmRBY3Rpb24gPSByZXNvbHZlU2VuZChhY3Rpb25PYmplY3QsIHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQsIG1hY2hpbmUub3B0aW9ucy5kZWxheXMpOyAvLyBUT0RPOiBmaXggQWN0aW9uVHlwZXMuSW5pdFxuXG4gICAgICAgIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgICAgICAgIHZhciBjb25maWd1cmVkRGVsYXkgPSBhY3Rpb25PYmplY3QuZGVsYXk7IC8vIHdhcm4gYWZ0ZXIgcmVzb2x2aW5nIGFzIHdlIGNhbiBjcmVhdGUgYmV0dGVyIGNvbnRleHR1YWwgbWVzc2FnZSBoZXJlXG5cbiAgICAgICAgICB3YXJuKCFpc1N0cmluZyhjb25maWd1cmVkRGVsYXkpIHx8IHR5cGVvZiBzZW5kQWN0aW9uLmRlbGF5ID09PSAnbnVtYmVyJywgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICAgICAgICAgIFwiTm8gZGVsYXkgcmVmZXJlbmNlIGZvciBkZWxheSBleHByZXNzaW9uICdcIi5jb25jYXQoY29uZmlndXJlZERlbGF5LCBcIicgd2FzIGZvdW5kIG9uIG1hY2hpbmUgJ1wiKS5jb25jYXQobWFjaGluZS5pZCwgXCInXCIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcmVkaWN0YWJsZUV4ZWMgJiYgc2VuZEFjdGlvbi50byAhPT0gU3BlY2lhbFRhcmdldHMuSW50ZXJuYWwpIHtcbiAgICAgICAgICBpZiAoYmxvY2tUeXBlID09PSAnZW50cnknKSB7XG4gICAgICAgICAgICBkZWZlcnJlZFRvQmxvY2tFbmQucHVzaChzZW5kQWN0aW9uKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJlZGljdGFibGVFeGVjKHNlbmRBY3Rpb24sIHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZW5kQWN0aW9uO1xuXG4gICAgICBjYXNlIGxvZyQxOlxuICAgICAgICB7XG4gICAgICAgICAgdmFyIHJlc29sdmVkID0gcmVzb2x2ZUxvZyhhY3Rpb25PYmplY3QsIHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQpO1xuICAgICAgICAgIHByZWRpY3RhYmxlRXhlYyA9PT0gbnVsbCB8fCBwcmVkaWN0YWJsZUV4ZWMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHByZWRpY3RhYmxlRXhlYyhyZXNvbHZlZCwgdXBkYXRlZENvbnRleHQsIF9ldmVudCk7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmVkO1xuICAgICAgICB9XG5cbiAgICAgIGNhc2UgY2hvb3NlJDE6XG4gICAgICAgIHtcbiAgICAgICAgICB2YXIgY2hvb3NlQWN0aW9uID0gYWN0aW9uT2JqZWN0O1xuICAgICAgICAgIHZhciBtYXRjaGVkQWN0aW9ucyA9IChfYSA9IGNob29zZUFjdGlvbi5jb25kcy5maW5kKGZ1bmN0aW9uIChjb25kaXRpb24pIHtcbiAgICAgICAgICAgIHZhciBndWFyZCA9IHRvR3VhcmQoY29uZGl0aW9uLmNvbmQsIG1hY2hpbmUub3B0aW9ucy5ndWFyZHMpO1xuICAgICAgICAgICAgcmV0dXJuICFndWFyZCB8fCBldmFsdWF0ZUd1YXJkKG1hY2hpbmUsIGd1YXJkLCB1cGRhdGVkQ29udGV4dCwgX2V2ZW50LCAhcHJlZGljdGFibGVFeGVjID8gY3VycmVudFN0YXRlIDogdW5kZWZpbmVkKTtcbiAgICAgICAgICB9KSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmFjdGlvbnM7XG5cbiAgICAgICAgICBpZiAoIW1hdGNoZWRBY3Rpb25zKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIF9iID0gX19yZWFkKHJlc29sdmVBY3Rpb25zKG1hY2hpbmUsIGN1cnJlbnRTdGF0ZSwgdXBkYXRlZENvbnRleHQsIF9ldmVudCwgW3tcbiAgICAgICAgICAgIHR5cGU6IGJsb2NrVHlwZSxcbiAgICAgICAgICAgIGFjdGlvbnM6IHRvQWN0aW9uT2JqZWN0cyh0b0FycmF5KG1hdGNoZWRBY3Rpb25zKSwgbWFjaGluZS5vcHRpb25zLmFjdGlvbnMpXG4gICAgICAgICAgfV0sIHByZWRpY3RhYmxlRXhlYywgcHJlc2VydmVBY3Rpb25PcmRlciksIDIpLFxuICAgICAgICAgICAgICByZXNvbHZlZEFjdGlvbnNGcm9tQ2hvb3NlID0gX2JbMF0sXG4gICAgICAgICAgICAgIHJlc29sdmVkQ29udGV4dEZyb21DaG9vc2UgPSBfYlsxXTtcblxuICAgICAgICAgIHVwZGF0ZWRDb250ZXh0ID0gcmVzb2x2ZWRDb250ZXh0RnJvbUNob29zZTtcbiAgICAgICAgICBwcmVzZXJ2ZWRDb250ZXh0cyA9PT0gbnVsbCB8fCBwcmVzZXJ2ZWRDb250ZXh0cyA9PT0gdm9pZCAwID8gdm9pZCAwIDogcHJlc2VydmVkQ29udGV4dHMucHVzaCh1cGRhdGVkQ29udGV4dCk7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmVkQWN0aW9uc0Zyb21DaG9vc2U7XG4gICAgICAgIH1cblxuICAgICAgY2FzZSBwdXJlJDE6XG4gICAgICAgIHtcbiAgICAgICAgICB2YXIgbWF0Y2hlZEFjdGlvbnMgPSBhY3Rpb25PYmplY3QuZ2V0KHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQuZGF0YSk7XG5cbiAgICAgICAgICBpZiAoIW1hdGNoZWRBY3Rpb25zKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIF9jID0gX19yZWFkKHJlc29sdmVBY3Rpb25zKG1hY2hpbmUsIGN1cnJlbnRTdGF0ZSwgdXBkYXRlZENvbnRleHQsIF9ldmVudCwgW3tcbiAgICAgICAgICAgIHR5cGU6IGJsb2NrVHlwZSxcbiAgICAgICAgICAgIGFjdGlvbnM6IHRvQWN0aW9uT2JqZWN0cyh0b0FycmF5KG1hdGNoZWRBY3Rpb25zKSwgbWFjaGluZS5vcHRpb25zLmFjdGlvbnMpXG4gICAgICAgICAgfV0sIHByZWRpY3RhYmxlRXhlYywgcHJlc2VydmVBY3Rpb25PcmRlciksIDIpLFxuICAgICAgICAgICAgICByZXNvbHZlZEFjdGlvbnNGcm9tUHVyZSA9IF9jWzBdLFxuICAgICAgICAgICAgICByZXNvbHZlZENvbnRleHQgPSBfY1sxXTtcblxuICAgICAgICAgIHVwZGF0ZWRDb250ZXh0ID0gcmVzb2x2ZWRDb250ZXh0O1xuICAgICAgICAgIHByZXNlcnZlZENvbnRleHRzID09PSBudWxsIHx8IHByZXNlcnZlZENvbnRleHRzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwcmVzZXJ2ZWRDb250ZXh0cy5wdXNoKHVwZGF0ZWRDb250ZXh0KTtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZWRBY3Rpb25zRnJvbVB1cmU7XG4gICAgICAgIH1cblxuICAgICAgY2FzZSBzdG9wJDE6XG4gICAgICAgIHtcbiAgICAgICAgICB2YXIgcmVzb2x2ZWQgPSByZXNvbHZlU3RvcChhY3Rpb25PYmplY3QsIHVwZGF0ZWRDb250ZXh0LCBfZXZlbnQpO1xuICAgICAgICAgIHByZWRpY3RhYmxlRXhlYyA9PT0gbnVsbCB8fCBwcmVkaWN0YWJsZUV4ZWMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHByZWRpY3RhYmxlRXhlYyhyZXNvbHZlZCwgY3VycmVudENvbnRleHQsIF9ldmVudCk7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmVkO1xuICAgICAgICB9XG5cbiAgICAgIGNhc2UgYXNzaWduJDE6XG4gICAgICAgIHtcbiAgICAgICAgICB1cGRhdGVkQ29udGV4dCA9IHVwZGF0ZUNvbnRleHQodXBkYXRlZENvbnRleHQsIF9ldmVudCwgW2FjdGlvbk9iamVjdF0sICFwcmVkaWN0YWJsZUV4ZWMgPyBjdXJyZW50U3RhdGUgOiB1bmRlZmluZWQpO1xuICAgICAgICAgIHByZXNlcnZlZENvbnRleHRzID09PSBudWxsIHx8IHByZXNlcnZlZENvbnRleHRzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwcmVzZXJ2ZWRDb250ZXh0cy5wdXNoKHVwZGF0ZWRDb250ZXh0KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB2YXIgcmVzb2x2ZWRBY3Rpb25PYmplY3QgPSB0b0FjdGlvbk9iamVjdChhY3Rpb25PYmplY3QsIG1hY2hpbmUub3B0aW9ucy5hY3Rpb25zKTtcbiAgICAgICAgdmFyIGV4ZWNfMSA9IHJlc29sdmVkQWN0aW9uT2JqZWN0LmV4ZWM7XG5cbiAgICAgICAgaWYgKHByZWRpY3RhYmxlRXhlYykge1xuICAgICAgICAgIHByZWRpY3RhYmxlRXhlYyhyZXNvbHZlZEFjdGlvbk9iamVjdCwgdXBkYXRlZENvbnRleHQsIF9ldmVudCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXhlY18xICYmIHByZXNlcnZlZENvbnRleHRzKSB7XG4gICAgICAgICAgdmFyIGNvbnRleHRJbmRleF8xID0gcHJlc2VydmVkQ29udGV4dHMubGVuZ3RoIC0gMTtcblxuICAgICAgICAgIHZhciB3cmFwcGVkID0gX19hc3NpZ24oX19hc3NpZ24oe30sIHJlc29sdmVkQWN0aW9uT2JqZWN0KSwge1xuICAgICAgICAgICAgZXhlYzogZnVuY3Rpb24gKF9jdHgpIHtcbiAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBbXTtcblxuICAgICAgICAgICAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgIGFyZ3NbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBleGVjXzEuYXBwbHkodm9pZCAwLCBfX3NwcmVhZEFycmF5KFtwcmVzZXJ2ZWRDb250ZXh0c1tjb250ZXh0SW5kZXhfMV1dLCBfX3JlYWQoYXJncyksIGZhbHNlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXNvbHZlZEFjdGlvbk9iamVjdCA9IHdyYXBwZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzb2x2ZWRBY3Rpb25PYmplY3Q7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcHJvY2Vzc0Jsb2NrKGJsb2NrKSB7XG4gICAgdmFyIGVfMiwgX2E7XG5cbiAgICB2YXIgcmVzb2x2ZWRBY3Rpb25zID0gW107XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2IgPSBfX3ZhbHVlcyhibG9jay5hY3Rpb25zKSwgX2MgPSBfYi5uZXh0KCk7ICFfYy5kb25lOyBfYyA9IF9iLm5leHQoKSkge1xuICAgICAgICB2YXIgYWN0aW9uID0gX2MudmFsdWU7XG4gICAgICAgIHZhciByZXNvbHZlZCA9IGhhbmRsZUFjdGlvbihibG9jay50eXBlLCBhY3Rpb24pO1xuXG4gICAgICAgIGlmIChyZXNvbHZlZCkge1xuICAgICAgICAgIHJlc29sdmVkQWN0aW9ucyA9IHJlc29sdmVkQWN0aW9ucy5jb25jYXQocmVzb2x2ZWQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZV8yXzEpIHtcbiAgICAgIGVfMiA9IHtcbiAgICAgICAgZXJyb3I6IGVfMl8xXG4gICAgICB9O1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoX2MgJiYgIV9jLmRvbmUgJiYgKF9hID0gX2IucmV0dXJuKSkgX2EuY2FsbChfYik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoZV8yKSB0aHJvdyBlXzIuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZGVmZXJyZWRUb0Jsb2NrRW5kLmZvckVhY2goZnVuY3Rpb24gKGFjdGlvbikge1xuICAgICAgcHJlZGljdGFibGVFeGVjKGFjdGlvbiwgdXBkYXRlZENvbnRleHQsIF9ldmVudCk7XG4gICAgfSk7XG4gICAgZGVmZXJyZWRUb0Jsb2NrRW5kLmxlbmd0aCA9IDA7XG4gICAgcmV0dXJuIHJlc29sdmVkQWN0aW9ucztcbiAgfVxuXG4gIHZhciByZXNvbHZlZEFjdGlvbnMgPSBmbGF0dGVuKGFjdGlvbkJsb2Nrcy5tYXAocHJvY2Vzc0Jsb2NrKSk7XG4gIHJldHVybiBbcmVzb2x2ZWRBY3Rpb25zLCB1cGRhdGVkQ29udGV4dF07XG59XG5cbmV4cG9ydCB7IGFmdGVyLCBhc3NpZ24sIGNhbmNlbCwgY2hvb3NlLCBkb25lLCBkb25lSW52b2tlLCBlcnJvciwgZXNjYWxhdGUsIGZvcndhcmRUbywgZ2V0QWN0aW9uRnVuY3Rpb24sIGluaXRFdmVudCwgaXNBY3Rpb25PYmplY3QsIGxvZywgcHVyZSwgcmFpc2UsIHJlc29sdmVBY3Rpb25zLCByZXNvbHZlTG9nLCByZXNvbHZlUmFpc2UsIHJlc29sdmVTZW5kLCByZXNvbHZlU3RvcCwgcmVzcG9uZCwgc2VuZCwgc2VuZFBhcmVudCwgc2VuZFRvLCBzZW5kVXBkYXRlLCBzdGFydCwgc3RvcCwgdG9BY3Rpb25PYmplY3QsIHRvQWN0aW9uT2JqZWN0cywgdG9BY3Rpdml0eURlZmluaXRpb24gfTtcbiIsImltcG9ydCB7IGVycm9yLCBkb25lSW52b2tlIH0gZnJvbSAnLi9hY3Rpb25zLmpzJztcbmltcG9ydCB7IHRvQWN0b3JSZWYgfSBmcm9tICcuL0FjdG9yLmpzJztcbmltcG9ydCB7IHRvT2JzZXJ2ZXIgfSBmcm9tICcuL3V0aWxzLmpzJztcblxuLyoqXHJcbiAqIFJldHVybnMgYW4gYWN0b3IgYmVoYXZpb3IgZnJvbSBhIHJlZHVjZXIgYW5kIGl0cyBpbml0aWFsIHN0YXRlLlxyXG4gKlxyXG4gKiBAcGFyYW0gdHJhbnNpdGlvbiBUaGUgcHVyZSByZWR1Y2VyIHRoYXQgcmV0dXJucyB0aGUgbmV4dCBzdGF0ZSBnaXZlbiB0aGUgY3VycmVudCBzdGF0ZSBhbmQgZXZlbnQuXHJcbiAqIEBwYXJhbSBpbml0aWFsU3RhdGUgVGhlIGluaXRpYWwgc3RhdGUgb2YgdGhlIHJlZHVjZXIuXHJcbiAqIEByZXR1cm5zIEFuIGFjdG9yIGJlaGF2aW9yXHJcbiAqL1xuXG5mdW5jdGlvbiBmcm9tUmVkdWNlcih0cmFuc2l0aW9uLCBpbml0aWFsU3RhdGUpIHtcbiAgcmV0dXJuIHtcbiAgICB0cmFuc2l0aW9uOiB0cmFuc2l0aW9uLFxuICAgIGluaXRpYWxTdGF0ZTogaW5pdGlhbFN0YXRlXG4gIH07XG59XG5mdW5jdGlvbiBmcm9tUHJvbWlzZShwcm9taXNlRm4pIHtcbiAgdmFyIGluaXRpYWxTdGF0ZSA9IHtcbiAgICBlcnJvcjogdW5kZWZpbmVkLFxuICAgIGRhdGE6IHVuZGVmaW5lZCxcbiAgICBzdGF0dXM6ICdwZW5kaW5nJ1xuICB9O1xuICByZXR1cm4ge1xuICAgIHRyYW5zaXRpb246IGZ1bmN0aW9uIChzdGF0ZSwgZXZlbnQsIF9hKSB7XG4gICAgICB2YXIgcGFyZW50ID0gX2EucGFyZW50LFxuICAgICAgICAgIGlkID0gX2EuaWQsXG4gICAgICAgICAgb2JzZXJ2ZXJzID0gX2Eub2JzZXJ2ZXJzO1xuXG4gICAgICBzd2l0Y2ggKGV2ZW50LnR5cGUpIHtcbiAgICAgICAgY2FzZSAnZnVsZmlsbCc6XG4gICAgICAgICAgcGFyZW50ID09PSBudWxsIHx8IHBhcmVudCA9PT0gdm9pZCAwID8gdm9pZCAwIDogcGFyZW50LnNlbmQoZG9uZUludm9rZShpZCwgZXZlbnQuZGF0YSkpO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBlcnJvcjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgZGF0YTogZXZlbnQuZGF0YSxcbiAgICAgICAgICAgIHN0YXR1czogJ2Z1bGZpbGxlZCdcbiAgICAgICAgICB9O1xuXG4gICAgICAgIGNhc2UgJ3JlamVjdCc6XG4gICAgICAgICAgcGFyZW50ID09PSBudWxsIHx8IHBhcmVudCA9PT0gdm9pZCAwID8gdm9pZCAwIDogcGFyZW50LnNlbmQoZXJyb3IoaWQsIGV2ZW50LmVycm9yKSk7XG4gICAgICAgICAgb2JzZXJ2ZXJzLmZvckVhY2goZnVuY3Rpb24gKG9ic2VydmVyKSB7XG4gICAgICAgICAgICBvYnNlcnZlci5lcnJvcihldmVudC5lcnJvcik7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVycm9yOiBldmVudC5lcnJvcixcbiAgICAgICAgICAgIGRhdGE6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHN0YXR1czogJ3JlamVjdGVkJ1xuICAgICAgICAgIH07XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICB9XG4gICAgfSxcbiAgICBpbml0aWFsU3RhdGU6IGluaXRpYWxTdGF0ZSxcbiAgICBzdGFydDogZnVuY3Rpb24gKF9hKSB7XG4gICAgICB2YXIgc2VsZiA9IF9hLnNlbGY7XG4gICAgICBwcm9taXNlRm4oKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHNlbGYuc2VuZCh7XG4gICAgICAgICAgdHlwZTogJ2Z1bGZpbGwnLFxuICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgICAgfSk7XG4gICAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgIHNlbGYuc2VuZCh7XG4gICAgICAgICAgdHlwZTogJ3JlamVjdCcsXG4gICAgICAgICAgZXJyb3I6IHJlYXNvblxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGluaXRpYWxTdGF0ZTtcbiAgICB9XG4gIH07XG59XG5mdW5jdGlvbiBzcGF3bkJlaGF2aW9yKGJlaGF2aW9yLCBvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zID09PSB2b2lkIDApIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cblxuICB2YXIgc3RhdGUgPSBiZWhhdmlvci5pbml0aWFsU3RhdGU7XG4gIHZhciBvYnNlcnZlcnMgPSBuZXcgU2V0KCk7XG4gIHZhciBtYWlsYm94ID0gW107XG4gIHZhciBmbHVzaGluZyA9IGZhbHNlO1xuXG4gIHZhciBmbHVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoZmx1c2hpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmbHVzaGluZyA9IHRydWU7XG5cbiAgICB3aGlsZSAobWFpbGJveC5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgZXZlbnRfMSA9IG1haWxib3guc2hpZnQoKTtcbiAgICAgIHN0YXRlID0gYmVoYXZpb3IudHJhbnNpdGlvbihzdGF0ZSwgZXZlbnRfMSwgYWN0b3JDdHgpO1xuICAgICAgb2JzZXJ2ZXJzLmZvckVhY2goZnVuY3Rpb24gKG9ic2VydmVyKSB7XG4gICAgICAgIHJldHVybiBvYnNlcnZlci5uZXh0KHN0YXRlKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZsdXNoaW5nID0gZmFsc2U7XG4gIH07XG5cbiAgdmFyIGFjdG9yID0gdG9BY3RvclJlZih7XG4gICAgaWQ6IG9wdGlvbnMuaWQsXG4gICAgc2VuZDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBtYWlsYm94LnB1c2goZXZlbnQpO1xuICAgICAgZmx1c2goKTtcbiAgICB9LFxuICAgIGdldFNuYXBzaG90OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfSxcbiAgICBzdWJzY3JpYmU6IGZ1bmN0aW9uIChuZXh0LCBoYW5kbGVFcnJvciwgY29tcGxldGUpIHtcbiAgICAgIHZhciBvYnNlcnZlciA9IHRvT2JzZXJ2ZXIobmV4dCwgaGFuZGxlRXJyb3IsIGNvbXBsZXRlKTtcbiAgICAgIG9ic2VydmVycy5hZGQob2JzZXJ2ZXIpO1xuICAgICAgb2JzZXJ2ZXIubmV4dChzdGF0ZSk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIG9ic2VydmVycy5kZWxldGUob2JzZXJ2ZXIpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG4gIHZhciBhY3RvckN0eCA9IHtcbiAgICBwYXJlbnQ6IG9wdGlvbnMucGFyZW50LFxuICAgIHNlbGY6IGFjdG9yLFxuICAgIGlkOiBvcHRpb25zLmlkIHx8ICdhbm9ueW1vdXMnLFxuICAgIG9ic2VydmVyczogb2JzZXJ2ZXJzXG4gIH07XG4gIHN0YXRlID0gYmVoYXZpb3Iuc3RhcnQgPyBiZWhhdmlvci5zdGFydChhY3RvckN0eCkgOiBzdGF0ZTtcbiAgcmV0dXJuIGFjdG9yO1xufVxuXG5leHBvcnQgeyBmcm9tUHJvbWlzZSwgZnJvbVJlZHVjZXIsIHNwYXduQmVoYXZpb3IgfTtcbiIsInZhciBTVEFURV9ERUxJTUlURVIgPSAnLic7XG52YXIgRU1QVFlfQUNUSVZJVFlfTUFQID0ge307XG52YXIgREVGQVVMVF9HVUFSRF9UWVBFID0gJ3hzdGF0ZS5ndWFyZCc7XG52YXIgVEFSR0VUTEVTU19LRVkgPSAnJztcblxuZXhwb3J0IHsgREVGQVVMVF9HVUFSRF9UWVBFLCBFTVBUWV9BQ1RJVklUWV9NQVAsIFNUQVRFX0RFTElNSVRFUiwgVEFSR0VUTEVTU19LRVkgfTtcbiIsImltcG9ydCB7IElTX1BST0RVQ1RJT04gfSBmcm9tICcuL2Vudmlyb25tZW50LmpzJztcblxuZnVuY3Rpb24gZ2V0R2xvYmFsKCkge1xuICBpZiAodHlwZW9mIGdsb2JhbFRoaXMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGdsb2JhbFRoaXM7XG4gIH1cblxuICBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIHNlbGY7XG4gIH1cblxuICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gd2luZG93O1xuICB9XG5cbiAgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGdsb2JhbDtcbiAgfVxuXG4gIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgIGNvbnNvbGUud2FybignWFN0YXRlIGNvdWxkIG5vdCBmaW5kIGEgZ2xvYmFsIG9iamVjdCBpbiB0aGlzIGVudmlyb25tZW50LiBQbGVhc2UgbGV0IHRoZSBtYWludGFpbmVycyBrbm93IGFuZCByYWlzZSBhbiBpc3N1ZSBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vc3RhdGVseWFpL3hzdGF0ZS9pc3N1ZXMnKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXREZXZUb29scygpIHtcbiAgdmFyIGdsb2JhbCA9IGdldEdsb2JhbCgpO1xuXG4gIGlmIChnbG9iYWwgJiYgJ19feHN0YXRlX18nIGluIGdsb2JhbCkge1xuICAgIHJldHVybiBnbG9iYWwuX194c3RhdGVfXztcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyU2VydmljZShzZXJ2aWNlKSB7XG4gIGlmICghZ2V0R2xvYmFsKCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgZGV2VG9vbHMgPSBnZXREZXZUb29scygpO1xuXG4gIGlmIChkZXZUb29scykge1xuICAgIGRldlRvb2xzLnJlZ2lzdGVyKHNlcnZpY2UpO1xuICB9XG59XG5cbmV4cG9ydCB7IGdldEdsb2JhbCwgcmVnaXN0ZXJTZXJ2aWNlIH07XG4iLCJ2YXIgSVNfUFJPRFVDVElPTiA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbic7XG5cbmV4cG9ydCB7IElTX1BST0RVQ1RJT04gfTtcbiIsImltcG9ydCB7IF9fdmFsdWVzLCBfX3NwcmVhZEFycmF5LCBfX3JlYWQsIF9fYXNzaWduIH0gZnJvbSAnLi9fdmlydHVhbC9fdHNsaWIuanMnO1xuaW1wb3J0IHsgU3BlY2lhbFRhcmdldHMsIEFjdGlvblR5cGVzIH0gZnJvbSAnLi90eXBlcy5qcyc7XG5pbXBvcnQgeyBpc1N0YXRlQ29uZmlnLCBTdGF0ZSwgYmluZEFjdGlvblRvU3RhdGUgfSBmcm9tICcuL1N0YXRlLmpzJztcbmltcG9ydCB7IGVycm9yUGxhdGZvcm0sIHVwZGF0ZSwgZXJyb3IgYXMgZXJyb3IkMSwgbG9nLCBzdG9wLCBzdGFydCwgY2FuY2VsLCBzZW5kLCByYWlzZSB9IGZyb20gJy4vYWN0aW9uVHlwZXMuanMnO1xuaW1wb3J0IHsgaW5pdEV2ZW50LCBkb25lSW52b2tlLCB0b0FjdGlvbk9iamVjdHMsIHJlc29sdmVBY3Rpb25zLCBlcnJvciwgZ2V0QWN0aW9uRnVuY3Rpb24gfSBmcm9tICcuL2FjdGlvbnMuanMnO1xuaW1wb3J0IHsgSVNfUFJPRFVDVElPTiB9IGZyb20gJy4vZW52aXJvbm1lbnQuanMnO1xuaW1wb3J0IHsgd2FybiwgbWFwQ29udGV4dCwgdG9PYnNlcnZlciwgaXNGdW5jdGlvbiwgdG9TQ1hNTEV2ZW50LCBmbGF0dGVuLCBpc1JhaXNhYmxlQWN0aW9uLCBpc1Byb21pc2VMaWtlLCBpc09ic2VydmFibGUsIGlzTWFjaGluZSwgaXNCZWhhdmlvciwgcmVwb3J0VW5oYW5kbGVkRXhjZXB0aW9uT25JbnZvY2F0aW9uLCBzeW1ib2xPYnNlcnZhYmxlLCBpc0FycmF5LCB0b0V2ZW50T2JqZWN0LCBpc1N0cmluZywgaXNBY3RvciwgdG9JbnZva2VTb3VyY2UsIHVuaXF1ZUlkIH0gZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQgeyBTY2hlZHVsZXIgfSBmcm9tICcuL3NjaGVkdWxlci5qcyc7XG5pbXBvcnQgeyBjcmVhdGVEZWZlcnJlZEFjdG9yLCBpc1NwYXduZWRBY3RvciB9IGZyb20gJy4vQWN0b3IuanMnO1xuaW1wb3J0IHsgcmVnaXN0cnkgfSBmcm9tICcuL3JlZ2lzdHJ5LmpzJztcbmltcG9ydCB7IGdldEdsb2JhbCwgcmVnaXN0ZXJTZXJ2aWNlIH0gZnJvbSAnLi9kZXZUb29scy5qcyc7XG5pbXBvcnQgeyBwcm92aWRlLCBjb25zdW1lIH0gZnJvbSAnLi9zZXJ2aWNlU2NvcGUuanMnO1xuaW1wb3J0IHsgc3Bhd25CZWhhdmlvciB9IGZyb20gJy4vYmVoYXZpb3JzLmpzJztcblxudmFyIERFRkFVTFRfU1BBV05fT1BUSU9OUyA9IHtcbiAgc3luYzogZmFsc2UsXG4gIGF1dG9Gb3J3YXJkOiBmYWxzZVxufTtcbnZhciBJbnRlcnByZXRlclN0YXR1cztcblxuKGZ1bmN0aW9uIChJbnRlcnByZXRlclN0YXR1cykge1xuICBJbnRlcnByZXRlclN0YXR1c1tJbnRlcnByZXRlclN0YXR1c1tcIk5vdFN0YXJ0ZWRcIl0gPSAwXSA9IFwiTm90U3RhcnRlZFwiO1xuICBJbnRlcnByZXRlclN0YXR1c1tJbnRlcnByZXRlclN0YXR1c1tcIlJ1bm5pbmdcIl0gPSAxXSA9IFwiUnVubmluZ1wiO1xuICBJbnRlcnByZXRlclN0YXR1c1tJbnRlcnByZXRlclN0YXR1c1tcIlN0b3BwZWRcIl0gPSAyXSA9IFwiU3RvcHBlZFwiO1xufSkoSW50ZXJwcmV0ZXJTdGF0dXMgfHwgKEludGVycHJldGVyU3RhdHVzID0ge30pKTtcblxudmFyIEludGVycHJldGVyID1cbi8qI19fUFVSRV9fKi9cblxuLyoqIEBjbGFzcyAqL1xuZnVuY3Rpb24gKCkge1xuICAvKipcclxuICAgKiBDcmVhdGVzIGEgbmV3IEludGVycHJldGVyIGluc3RhbmNlIChpLmUuLCBzZXJ2aWNlKSBmb3IgdGhlIGdpdmVuIG1hY2hpbmUgd2l0aCB0aGUgcHJvdmlkZWQgb3B0aW9ucywgaWYgYW55LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIG1hY2hpbmUgVGhlIG1hY2hpbmUgdG8gYmUgaW50ZXJwcmV0ZWRcclxuICAgKiBAcGFyYW0gb3B0aW9ucyBJbnRlcnByZXRlciBvcHRpb25zXHJcbiAgICovXG4gIGZ1bmN0aW9uIEludGVycHJldGVyKG1hY2hpbmUsIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgICBvcHRpb25zID0gSW50ZXJwcmV0ZXIuZGVmYXVsdE9wdGlvbnM7XG4gICAgfVxuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHRoaXMubWFjaGluZSA9IG1hY2hpbmU7XG4gICAgdGhpcy5kZWxheWVkRXZlbnRzTWFwID0ge307XG4gICAgdGhpcy5saXN0ZW5lcnMgPSBuZXcgU2V0KCk7XG4gICAgdGhpcy5jb250ZXh0TGlzdGVuZXJzID0gbmV3IFNldCgpO1xuICAgIHRoaXMuc3RvcExpc3RlbmVycyA9IG5ldyBTZXQoKTtcbiAgICB0aGlzLmRvbmVMaXN0ZW5lcnMgPSBuZXcgU2V0KCk7XG4gICAgdGhpcy5ldmVudExpc3RlbmVycyA9IG5ldyBTZXQoKTtcbiAgICB0aGlzLnNlbmRMaXN0ZW5lcnMgPSBuZXcgU2V0KCk7XG4gICAgLyoqXHJcbiAgICAgKiBXaGV0aGVyIHRoZSBzZXJ2aWNlIGlzIHN0YXJ0ZWQuXHJcbiAgICAgKi9cblxuICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICB0aGlzLnN0YXR1cyA9IEludGVycHJldGVyU3RhdHVzLk5vdFN0YXJ0ZWQ7XG4gICAgdGhpcy5jaGlsZHJlbiA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmZvcndhcmRUbyA9IG5ldyBTZXQoKTtcbiAgICB0aGlzLl9vdXRnb2luZ1F1ZXVlID0gW107XG4gICAgLyoqXHJcbiAgICAgKiBBbGlhcyBmb3IgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnN0YXJ0XHJcbiAgICAgKi9cblxuICAgIHRoaXMuaW5pdCA9IHRoaXMuc3RhcnQ7XG4gICAgLyoqXHJcbiAgICAgKiBTZW5kcyBhbiBldmVudCB0byB0aGUgcnVubmluZyBpbnRlcnByZXRlciB0byB0cmlnZ2VyIGEgdHJhbnNpdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBBbiBhcnJheSBvZiBldmVudHMgKGJhdGNoZWQpIGNhbiBiZSBzZW50IGFzIHdlbGwsIHdoaWNoIHdpbGwgc2VuZCBhbGxcclxuICAgICAqIGJhdGNoZWQgZXZlbnRzIHRvIHRoZSBydW5uaW5nIGludGVycHJldGVyLiBUaGUgbGlzdGVuZXJzIHdpbGwgYmVcclxuICAgICAqIG5vdGlmaWVkIG9ubHkgKipvbmNlKiogd2hlbiBhbGwgZXZlbnRzIGFyZSBwcm9jZXNzZWQuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGV2ZW50IFRoZSBldmVudChzKSB0byBzZW5kXHJcbiAgICAgKi9cblxuICAgIHRoaXMuc2VuZCA9IGZ1bmN0aW9uIChldmVudCwgcGF5bG9hZCkge1xuICAgICAgaWYgKGlzQXJyYXkoZXZlbnQpKSB7XG4gICAgICAgIF90aGlzLmJhdGNoKGV2ZW50KTtcblxuICAgICAgICByZXR1cm4gX3RoaXMuc3RhdGU7XG4gICAgICB9XG5cbiAgICAgIHZhciBfZXZlbnQgPSB0b1NDWE1MRXZlbnQodG9FdmVudE9iamVjdChldmVudCwgcGF5bG9hZCkpO1xuXG4gICAgICBpZiAoX3RoaXMuc3RhdHVzID09PSBJbnRlcnByZXRlclN0YXR1cy5TdG9wcGVkKSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICAgICAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgICAgICAgd2FybihmYWxzZSwgXCJFdmVudCBcXFwiXCIuY29uY2F0KF9ldmVudC5uYW1lLCBcIlxcXCIgd2FzIHNlbnQgdG8gc3RvcHBlZCBzZXJ2aWNlIFxcXCJcIikuY29uY2F0KF90aGlzLm1hY2hpbmUuaWQsIFwiXFxcIi4gVGhpcyBzZXJ2aWNlIGhhcyBhbHJlYWR5IHJlYWNoZWQgaXRzIGZpbmFsIHN0YXRlLCBhbmQgd2lsbCBub3QgdHJhbnNpdGlvbi5cXG5FdmVudDogXCIpLmNvbmNhdChKU09OLnN0cmluZ2lmeShfZXZlbnQuZGF0YSkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBfdGhpcy5zdGF0ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKF90aGlzLnN0YXR1cyAhPT0gSW50ZXJwcmV0ZXJTdGF0dXMuUnVubmluZyAmJiAhX3RoaXMub3B0aW9ucy5kZWZlckV2ZW50cykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFdmVudCBcXFwiXCIuY29uY2F0KF9ldmVudC5uYW1lLCBcIlxcXCIgd2FzIHNlbnQgdG8gdW5pbml0aWFsaXplZCBzZXJ2aWNlIFxcXCJcIikuY29uY2F0KF90aGlzLm1hY2hpbmUuaWQgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICAgICAgICAsIFwiXFxcIi4gTWFrZSBzdXJlIC5zdGFydCgpIGlzIGNhbGxlZCBmb3IgdGhpcyBzZXJ2aWNlLCBvciBzZXQgeyBkZWZlckV2ZW50czogdHJ1ZSB9IGluIHRoZSBzZXJ2aWNlIG9wdGlvbnMuXFxuRXZlbnQ6IFwiKS5jb25jYXQoSlNPTi5zdHJpbmdpZnkoX2V2ZW50LmRhdGEpKSk7XG4gICAgICB9XG5cbiAgICAgIF90aGlzLnNjaGVkdWxlci5zY2hlZHVsZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIEZvcndhcmQgY29weSBvZiBldmVudCB0byBjaGlsZCBhY3RvcnNcbiAgICAgICAgX3RoaXMuZm9yd2FyZChfZXZlbnQpO1xuXG4gICAgICAgIHZhciBuZXh0U3RhdGUgPSBfdGhpcy5fbmV4dFN0YXRlKF9ldmVudCk7XG5cbiAgICAgICAgX3RoaXMudXBkYXRlKG5leHRTdGF0ZSwgX2V2ZW50KTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gX3RoaXMuX3N0YXRlOyAvLyBUT0RPOiBkZXByZWNhdGUgKHNob3VsZCByZXR1cm4gdm9pZClcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpzZW1pY29sb25cbiAgICB9O1xuXG4gICAgdGhpcy5zZW5kVG8gPSBmdW5jdGlvbiAoZXZlbnQsIHRvLCBpbW1lZGlhdGUpIHtcbiAgICAgIHZhciBpc1BhcmVudCA9IF90aGlzLnBhcmVudCAmJiAodG8gPT09IFNwZWNpYWxUYXJnZXRzLlBhcmVudCB8fCBfdGhpcy5wYXJlbnQuaWQgPT09IHRvKTtcbiAgICAgIHZhciB0YXJnZXQgPSBpc1BhcmVudCA/IF90aGlzLnBhcmVudCA6IGlzU3RyaW5nKHRvKSA/IHRvID09PSBTcGVjaWFsVGFyZ2V0cy5JbnRlcm5hbCA/IF90aGlzIDogX3RoaXMuY2hpbGRyZW4uZ2V0KHRvKSB8fCByZWdpc3RyeS5nZXQodG8pIDogaXNBY3Rvcih0bykgPyB0byA6IHVuZGVmaW5lZDtcblxuICAgICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgICAgaWYgKCFpc1BhcmVudCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuYWJsZSB0byBzZW5kIGV2ZW50IHRvIGNoaWxkICdcIi5jb25jYXQodG8sIFwiJyBmcm9tIHNlcnZpY2UgJ1wiKS5jb25jYXQoX3RoaXMuaWQsIFwiJy5cIikpO1xuICAgICAgICB9IC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1jb25zb2xlXG5cblxuICAgICAgICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICAgICAgICB3YXJuKGZhbHNlLCBcIlNlcnZpY2UgJ1wiLmNvbmNhdChfdGhpcy5pZCwgXCInIGhhcyBubyBwYXJlbnQ6IHVuYWJsZSB0byBzZW5kIGV2ZW50IFwiKS5jb25jYXQoZXZlbnQudHlwZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoJ21hY2hpbmUnIGluIHRhcmdldCkge1xuICAgICAgICAvLyBwZXJoYXBzIHRob3NlIGV2ZW50cyBzaG91bGQgYmUgcmVqZWN0ZWQgaW4gdGhlIHBhcmVudFxuICAgICAgICAvLyBidXQgYXRtIGl0IGRvZXNuJ3QgaGF2ZSBlYXN5IGFjY2VzcyB0byBhbGwgb2YgdGhlIGluZm9ybWF0aW9uIHRoYXQgaXMgcmVxdWlyZWQgdG8gZG8gaXQgcmVsaWFibHlcbiAgICAgICAgaWYgKF90aGlzLnN0YXR1cyAhPT0gSW50ZXJwcmV0ZXJTdGF0dXMuU3RvcHBlZCB8fCBfdGhpcy5wYXJlbnQgIT09IHRhcmdldCB8fCAvLyB3ZSBuZWVkIHRvIHNlbmQgZXZlbnRzIHRvIHRoZSBwYXJlbnQgZnJvbSBleGl0IGhhbmRsZXJzIG9mIGEgbWFjaGluZSB0aGF0IHJlYWNoZWQgaXRzIGZpbmFsIHN0YXRlXG4gICAgICAgIF90aGlzLnN0YXRlLmRvbmUpIHtcbiAgICAgICAgICAvLyBTZW5kIFNDWE1MIGV2ZW50cyB0byBtYWNoaW5lc1xuICAgICAgICAgIHZhciBzY3htbEV2ZW50ID0gX19hc3NpZ24oX19hc3NpZ24oe30sIGV2ZW50KSwge1xuICAgICAgICAgICAgbmFtZTogZXZlbnQubmFtZSA9PT0gZXJyb3IkMSA/IFwiXCIuY29uY2F0KGVycm9yKF90aGlzLmlkKSkgOiBldmVudC5uYW1lLFxuICAgICAgICAgICAgb3JpZ2luOiBfdGhpcy5zZXNzaW9uSWRcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGlmICghaW1tZWRpYXRlICYmIF90aGlzLm1hY2hpbmUuY29uZmlnLnByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzKSB7XG4gICAgICAgICAgICBfdGhpcy5fb3V0Z29pbmdRdWV1ZS5wdXNoKFt0YXJnZXQsIHNjeG1sRXZlbnRdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGFyZ2V0LnNlbmQoc2N4bWxFdmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBTZW5kIG5vcm1hbCBldmVudHMgdG8gb3RoZXIgdGFyZ2V0c1xuICAgICAgICBpZiAoIWltbWVkaWF0ZSAmJiBfdGhpcy5tYWNoaW5lLmNvbmZpZy5wcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50cykge1xuICAgICAgICAgIF90aGlzLl9vdXRnb2luZ1F1ZXVlLnB1c2goW3RhcmdldCwgZXZlbnQuZGF0YV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRhcmdldC5zZW5kKGV2ZW50LmRhdGEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMuX2V4ZWMgPSBmdW5jdGlvbiAoYWN0aW9uLCBjb250ZXh0LCBfZXZlbnQsIGFjdGlvbkZ1bmN0aW9uTWFwKSB7XG4gICAgICBpZiAoYWN0aW9uRnVuY3Rpb25NYXAgPT09IHZvaWQgMCkge1xuICAgICAgICBhY3Rpb25GdW5jdGlvbk1hcCA9IF90aGlzLm1hY2hpbmUub3B0aW9ucy5hY3Rpb25zO1xuICAgICAgfVxuXG4gICAgICB2YXIgYWN0aW9uT3JFeGVjID0gYWN0aW9uLmV4ZWMgfHwgZ2V0QWN0aW9uRnVuY3Rpb24oYWN0aW9uLnR5cGUsIGFjdGlvbkZ1bmN0aW9uTWFwKTtcbiAgICAgIHZhciBleGVjID0gaXNGdW5jdGlvbihhY3Rpb25PckV4ZWMpID8gYWN0aW9uT3JFeGVjIDogYWN0aW9uT3JFeGVjID8gYWN0aW9uT3JFeGVjLmV4ZWMgOiBhY3Rpb24uZXhlYztcblxuICAgICAgaWYgKGV4ZWMpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gZXhlYyhjb250ZXh0LCBfZXZlbnQuZGF0YSwgIV90aGlzLm1hY2hpbmUuY29uZmlnLnByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzID8ge1xuICAgICAgICAgICAgYWN0aW9uOiBhY3Rpb24sXG4gICAgICAgICAgICBzdGF0ZTogX3RoaXMuc3RhdGUsXG4gICAgICAgICAgICBfZXZlbnQ6IF9ldmVudFxuICAgICAgICAgIH0gOiB7XG4gICAgICAgICAgICBhY3Rpb246IGFjdGlvbixcbiAgICAgICAgICAgIF9ldmVudDogX2V2ZW50XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIGlmIChfdGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICAgIF90aGlzLnBhcmVudC5zZW5kKHtcbiAgICAgICAgICAgICAgdHlwZTogJ3hzdGF0ZS5lcnJvcicsXG4gICAgICAgICAgICAgIGRhdGE6IGVyclxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICAgICAgY2FzZSByYWlzZTpcbiAgICAgICAgICB7XG4gICAgICAgICAgICAvLyBpZiByYWlzZSBhY3Rpb24gcmVhY2hlZCB0aGUgaW50ZXJwcmV0ZXIgdGhlbiBpdCdzIGEgZGVsYXllZCBvbmVcbiAgICAgICAgICAgIHZhciBzZW5kQWN0aW9uXzEgPSBhY3Rpb247XG5cbiAgICAgICAgICAgIF90aGlzLmRlZmVyKHNlbmRBY3Rpb25fMSk7XG5cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICBjYXNlIHNlbmQ6XG4gICAgICAgICAgdmFyIHNlbmRBY3Rpb24gPSBhY3Rpb247XG5cbiAgICAgICAgICBpZiAodHlwZW9mIHNlbmRBY3Rpb24uZGVsYXkgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBfdGhpcy5kZWZlcihzZW5kQWN0aW9uKTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoc2VuZEFjdGlvbi50bykge1xuICAgICAgICAgICAgICBfdGhpcy5zZW5kVG8oc2VuZEFjdGlvbi5fZXZlbnQsIHNlbmRBY3Rpb24udG8sIF9ldmVudCA9PT0gaW5pdEV2ZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIF90aGlzLnNlbmQoc2VuZEFjdGlvbi5fZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgY2FuY2VsOlxuICAgICAgICAgIF90aGlzLmNhbmNlbChhY3Rpb24uc2VuZElkKTtcblxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2Ugc3RhcnQ6XG4gICAgICAgICAge1xuICAgICAgICAgICAgaWYgKF90aGlzLnN0YXR1cyAhPT0gSW50ZXJwcmV0ZXJTdGF0dXMuUnVubmluZykge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBhY3Rpdml0eSA9IGFjdGlvbi5hY3Rpdml0eTsgLy8gSWYgdGhlIGFjdGl2aXR5IHdpbGwgYmUgc3RvcHBlZCByaWdodCBhZnRlciBpdCdzIHN0YXJ0ZWRcbiAgICAgICAgICAgIC8vIChzdWNoIGFzIGluIHRyYW5zaWVudCBzdGF0ZXMpXG4gICAgICAgICAgICAvLyBkb24ndCBib3RoZXIgc3RhcnRpbmcgdGhlIGFjdGl2aXR5LlxuXG4gICAgICAgICAgICBpZiAoIC8vIGluIHY0IHdpdGggYHByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzYCBpbnZva2VzIGFyZSBjYWxsZWQgZWFnZXJseSB3aGVuIHRoZSBgdGhpcy5zdGF0ZWAgc3RpbGwgcG9pbnRzIHRvIHRoZSBwcmV2aW91cyBzdGF0ZVxuICAgICAgICAgICAgIV90aGlzLm1hY2hpbmUuY29uZmlnLnByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzICYmICFfdGhpcy5zdGF0ZS5hY3Rpdml0aWVzW2FjdGl2aXR5LmlkIHx8IGFjdGl2aXR5LnR5cGVdKSB7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSAvLyBJbnZva2VkIHNlcnZpY2VzXG5cblxuICAgICAgICAgICAgaWYgKGFjdGl2aXR5LnR5cGUgPT09IEFjdGlvblR5cGVzLkludm9rZSkge1xuICAgICAgICAgICAgICB2YXIgaW52b2tlU291cmNlID0gdG9JbnZva2VTb3VyY2UoYWN0aXZpdHkuc3JjKTtcbiAgICAgICAgICAgICAgdmFyIHNlcnZpY2VDcmVhdG9yID0gX3RoaXMubWFjaGluZS5vcHRpb25zLnNlcnZpY2VzID8gX3RoaXMubWFjaGluZS5vcHRpb25zLnNlcnZpY2VzW2ludm9rZVNvdXJjZS50eXBlXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgdmFyIGlkID0gYWN0aXZpdHkuaWQsXG4gICAgICAgICAgICAgICAgICBkYXRhID0gYWN0aXZpdHkuZGF0YTtcblxuICAgICAgICAgICAgICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICAgICAgICAgICAgICB3YXJuKCEoJ2ZvcndhcmQnIGluIGFjdGl2aXR5KSwgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICAgICAgICAgICAgICAgIFwiYGZvcndhcmRgIHByb3BlcnR5IGlzIGRlcHJlY2F0ZWQgKGZvdW5kIGluIGludm9jYXRpb24gb2YgJ1wiLmNvbmNhdChhY3Rpdml0eS5zcmMsIFwiJyBpbiBpbiBtYWNoaW5lICdcIikuY29uY2F0KF90aGlzLm1hY2hpbmUuaWQsIFwiJykuIFwiKSArIFwiUGxlYXNlIHVzZSBgYXV0b0ZvcndhcmRgIGluc3RlYWQuXCIpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdmFyIGF1dG9Gb3J3YXJkID0gJ2F1dG9Gb3J3YXJkJyBpbiBhY3Rpdml0eSA/IGFjdGl2aXR5LmF1dG9Gb3J3YXJkIDogISFhY3Rpdml0eS5mb3J3YXJkO1xuXG4gICAgICAgICAgICAgIGlmICghc2VydmljZUNyZWF0b3IpIHtcbiAgICAgICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tY29uc29sZVxuICAgICAgICAgICAgICAgIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgICAgICAgICAgICAgICAgd2FybihmYWxzZSwgXCJObyBzZXJ2aWNlIGZvdW5kIGZvciBpbnZvY2F0aW9uICdcIi5jb25jYXQoYWN0aXZpdHkuc3JjLCBcIicgaW4gbWFjaGluZSAnXCIpLmNvbmNhdChfdGhpcy5tYWNoaW5lLmlkLCBcIicuXCIpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB2YXIgcmVzb2x2ZWREYXRhID0gZGF0YSA/IG1hcENvbnRleHQoZGF0YSwgY29udGV4dCwgX2V2ZW50KSA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICBpZiAodHlwZW9mIHNlcnZpY2VDcmVhdG9yID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIC8vIFRPRE86IHdhcm5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB2YXIgc291cmNlID0gaXNGdW5jdGlvbihzZXJ2aWNlQ3JlYXRvcikgPyBzZXJ2aWNlQ3JlYXRvcihjb250ZXh0LCBfZXZlbnQuZGF0YSwge1xuICAgICAgICAgICAgICAgIGRhdGE6IHJlc29sdmVkRGF0YSxcbiAgICAgICAgICAgICAgICBzcmM6IGludm9rZVNvdXJjZSxcbiAgICAgICAgICAgICAgICBtZXRhOiBhY3Rpdml0eS5tZXRhXG4gICAgICAgICAgICAgIH0pIDogc2VydmljZUNyZWF0b3I7XG5cbiAgICAgICAgICAgICAgaWYgKCFzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiB3YXJuP1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHZhciBvcHRpb25zID0gdm9pZCAwO1xuXG4gICAgICAgICAgICAgIGlmIChpc01hY2hpbmUoc291cmNlKSkge1xuICAgICAgICAgICAgICAgIHNvdXJjZSA9IHJlc29sdmVkRGF0YSA/IHNvdXJjZS53aXRoQ29udGV4dChyZXNvbHZlZERhdGEpIDogc291cmNlO1xuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICBhdXRvRm9yd2FyZDogYXV0b0ZvcndhcmRcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgX3RoaXMuc3Bhd24oc291cmNlLCBpZCwgb3B0aW9ucyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBfdGhpcy5zcGF3bkFjdGl2aXR5KGFjdGl2aXR5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgIGNhc2Ugc3RvcDpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBfdGhpcy5zdG9wQ2hpbGQoYWN0aW9uLmFjdGl2aXR5LmlkKTtcblxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgbG9nOlxuICAgICAgICAgIHZhciBfYSA9IGFjdGlvbixcbiAgICAgICAgICAgICAgbGFiZWwgPSBfYS5sYWJlbCxcbiAgICAgICAgICAgICAgdmFsdWUgPSBfYS52YWx1ZTtcblxuICAgICAgICAgIGlmIChsYWJlbCkge1xuICAgICAgICAgICAgX3RoaXMubG9nZ2VyKGxhYmVsLCB2YWx1ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF90aGlzLmxvZ2dlcih2YWx1ZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICAgICAgICAgIHdhcm4oZmFsc2UsIFwiTm8gaW1wbGVtZW50YXRpb24gZm91bmQgZm9yIGFjdGlvbiB0eXBlICdcIi5jb25jYXQoYWN0aW9uLnR5cGUsIFwiJ1wiKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciByZXNvbHZlZE9wdGlvbnMgPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgSW50ZXJwcmV0ZXIuZGVmYXVsdE9wdGlvbnMpLCBvcHRpb25zKTtcblxuICAgIHZhciBjbG9jayA9IHJlc29sdmVkT3B0aW9ucy5jbG9jayxcbiAgICAgICAgbG9nZ2VyID0gcmVzb2x2ZWRPcHRpb25zLmxvZ2dlcixcbiAgICAgICAgcGFyZW50ID0gcmVzb2x2ZWRPcHRpb25zLnBhcmVudCxcbiAgICAgICAgaWQgPSByZXNvbHZlZE9wdGlvbnMuaWQ7XG4gICAgdmFyIHJlc29sdmVkSWQgPSBpZCAhPT0gdW5kZWZpbmVkID8gaWQgOiBtYWNoaW5lLmlkO1xuICAgIHRoaXMuaWQgPSByZXNvbHZlZElkO1xuICAgIHRoaXMubG9nZ2VyID0gbG9nZ2VyO1xuICAgIHRoaXMuY2xvY2sgPSBjbG9jaztcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICB0aGlzLm9wdGlvbnMgPSByZXNvbHZlZE9wdGlvbnM7XG4gICAgdGhpcy5zY2hlZHVsZXIgPSBuZXcgU2NoZWR1bGVyKHtcbiAgICAgIGRlZmVyRXZlbnRzOiB0aGlzLm9wdGlvbnMuZGVmZXJFdmVudHNcbiAgICB9KTtcbiAgICB0aGlzLnNlc3Npb25JZCA9IHJlZ2lzdHJ5LmJvb2tJZCgpO1xuICB9XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEludGVycHJldGVyLnByb3RvdHlwZSwgXCJpbml0aWFsU3RhdGVcIiwge1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgaWYgKHRoaXMuX2luaXRpYWxTdGF0ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5faW5pdGlhbFN0YXRlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJvdmlkZSh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIF90aGlzLl9pbml0aWFsU3RhdGUgPSBfdGhpcy5tYWNoaW5lLmluaXRpYWxTdGF0ZTtcbiAgICAgICAgcmV0dXJuIF90aGlzLl9pbml0aWFsU3RhdGU7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEludGVycHJldGVyLnByb3RvdHlwZSwgXCJzdGF0ZVwiLCB7XG4gICAgLyoqXHJcbiAgICAgKiBAZGVwcmVjYXRlZCBVc2UgYC5nZXRTbmFwc2hvdCgpYCBpbnN0ZWFkLlxyXG4gICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgICAgICAgd2Fybih0aGlzLnN0YXR1cyAhPT0gSW50ZXJwcmV0ZXJTdGF0dXMuTm90U3RhcnRlZCwgXCJBdHRlbXB0ZWQgdG8gcmVhZCBzdGF0ZSBmcm9tIHVuaW5pdGlhbGl6ZWQgc2VydmljZSAnXCIuY29uY2F0KHRoaXMuaWQsIFwiJy4gTWFrZSBzdXJlIHRoZSBzZXJ2aWNlIGlzIHN0YXJ0ZWQgZmlyc3QuXCIpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlO1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xuICAvKipcclxuICAgKiBFeGVjdXRlcyB0aGUgYWN0aW9ucyBvZiB0aGUgZ2l2ZW4gc3RhdGUsIHdpdGggdGhhdCBzdGF0ZSdzIGBjb250ZXh0YCBhbmQgYGV2ZW50YC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBzdGF0ZSBUaGUgc3RhdGUgd2hvc2UgYWN0aW9ucyB3aWxsIGJlIGV4ZWN1dGVkXHJcbiAgICogQHBhcmFtIGFjdGlvbnNDb25maWcgVGhlIGFjdGlvbiBpbXBsZW1lbnRhdGlvbnMgdG8gdXNlXHJcbiAgICovXG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLmV4ZWN1dGUgPSBmdW5jdGlvbiAoc3RhdGUsIGFjdGlvbnNDb25maWcpIHtcbiAgICB2YXIgZV8xLCBfYTtcblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBfYiA9IF9fdmFsdWVzKHN0YXRlLmFjdGlvbnMpLCBfYyA9IF9iLm5leHQoKTsgIV9jLmRvbmU7IF9jID0gX2IubmV4dCgpKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBfYy52YWx1ZTtcbiAgICAgICAgdGhpcy5leGVjKGFjdGlvbiwgc3RhdGUsIGFjdGlvbnNDb25maWcpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfMV8xKSB7XG4gICAgICBlXzEgPSB7XG4gICAgICAgIGVycm9yOiBlXzFfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKF9jICYmICFfYy5kb25lICYmIChfYSA9IF9iLnJldHVybikpIF9hLmNhbGwoX2IpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKHN0YXRlLCBfZXZlbnQpIHtcbiAgICB2YXIgZV8yLCBfYSwgZV8zLCBfYiwgZV80LCBfYywgZV81LCBfZDtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7IC8vIEF0dGFjaCBzZXNzaW9uIElEIHRvIHN0YXRlXG5cblxuICAgIHN0YXRlLl9zZXNzaW9uaWQgPSB0aGlzLnNlc3Npb25JZDsgLy8gVXBkYXRlIHN0YXRlXG5cbiAgICB0aGlzLl9zdGF0ZSA9IHN0YXRlOyAvLyBFeGVjdXRlIGFjdGlvbnNcblxuICAgIGlmICgoIXRoaXMubWFjaGluZS5jb25maWcucHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHMgfHwgLy8gdGhpcyBpcyBjdXJyZW50bHkgcmVxdWlyZWQgdG8gZXhlY3V0ZSBpbml0aWFsIGFjdGlvbnMgYXMgdGhlIGBpbml0aWFsU3RhdGVgIGdldHMgY2FjaGVkXG4gICAgLy8gd2UgY2FuJ3QganVzdCByZWNvbXB1dGUgaXQgKGFuZCBleGVjdXRlIGFjdGlvbnMgd2hpbGUgZG9pbmcgc28pIGJlY2F1c2Ugd2UgdHJ5IHRvIHByZXNlcnZlIGlkZW50aXR5IG9mIGFjdG9ycyBjcmVhdGVkIHdpdGhpbiBpbml0aWFsIGFzc2lnbnNcbiAgICBfZXZlbnQgPT09IGluaXRFdmVudCkgJiYgdGhpcy5vcHRpb25zLmV4ZWN1dGUpIHtcbiAgICAgIHRoaXMuZXhlY3V0ZSh0aGlzLnN0YXRlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGl0ZW0gPSB2b2lkIDA7XG5cbiAgICAgIHdoaWxlIChpdGVtID0gdGhpcy5fb3V0Z29pbmdRdWV1ZS5zaGlmdCgpKSB7XG4gICAgICAgIGl0ZW1bMF0uc2VuZChpdGVtWzFdKTtcbiAgICAgIH1cbiAgICB9IC8vIFVwZGF0ZSBjaGlsZHJlblxuXG5cbiAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICBfdGhpcy5zdGF0ZS5jaGlsZHJlbltjaGlsZC5pZF0gPSBjaGlsZDtcbiAgICB9KTsgLy8gRGV2IHRvb2xzXG5cbiAgICBpZiAodGhpcy5kZXZUb29scykge1xuICAgICAgdGhpcy5kZXZUb29scy5zZW5kKF9ldmVudC5kYXRhLCBzdGF0ZSk7XG4gICAgfSAvLyBFeGVjdXRlIGxpc3RlbmVyc1xuXG5cbiAgICBpZiAoc3RhdGUuZXZlbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAodmFyIF9lID0gX192YWx1ZXModGhpcy5ldmVudExpc3RlbmVycyksIF9mID0gX2UubmV4dCgpOyAhX2YuZG9uZTsgX2YgPSBfZS5uZXh0KCkpIHtcbiAgICAgICAgICB2YXIgbGlzdGVuZXIgPSBfZi52YWx1ZTtcbiAgICAgICAgICBsaXN0ZW5lcihzdGF0ZS5ldmVudCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVfMl8xKSB7XG4gICAgICAgIGVfMiA9IHtcbiAgICAgICAgICBlcnJvcjogZV8yXzFcbiAgICAgICAgfTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKF9mICYmICFfZi5kb25lICYmIChfYSA9IF9lLnJldHVybikpIF9hLmNhbGwoX2UpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIGlmIChlXzIpIHRocm93IGVfMi5lcnJvcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBfZyA9IF9fdmFsdWVzKHRoaXMubGlzdGVuZXJzKSwgX2ggPSBfZy5uZXh0KCk7ICFfaC5kb25lOyBfaCA9IF9nLm5leHQoKSkge1xuICAgICAgICB2YXIgbGlzdGVuZXIgPSBfaC52YWx1ZTtcbiAgICAgICAgbGlzdGVuZXIoc3RhdGUsIHN0YXRlLmV2ZW50KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzNfMSkge1xuICAgICAgZV8zID0ge1xuICAgICAgICBlcnJvcjogZV8zXzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfaCAmJiAhX2guZG9uZSAmJiAoX2IgPSBfZy5yZXR1cm4pKSBfYi5jYWxsKF9nKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzMpIHRocm93IGVfMy5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2ogPSBfX3ZhbHVlcyh0aGlzLmNvbnRleHRMaXN0ZW5lcnMpLCBfayA9IF9qLm5leHQoKTsgIV9rLmRvbmU7IF9rID0gX2oubmV4dCgpKSB7XG4gICAgICAgIHZhciBjb250ZXh0TGlzdGVuZXIgPSBfay52YWx1ZTtcbiAgICAgICAgY29udGV4dExpc3RlbmVyKHRoaXMuc3RhdGUuY29udGV4dCwgdGhpcy5zdGF0ZS5oaXN0b3J5ID8gdGhpcy5zdGF0ZS5oaXN0b3J5LmNvbnRleHQgOiB1bmRlZmluZWQpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfNF8xKSB7XG4gICAgICBlXzQgPSB7XG4gICAgICAgIGVycm9yOiBlXzRfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKF9rICYmICFfay5kb25lICYmIChfYyA9IF9qLnJldHVybikpIF9jLmNhbGwoX2opO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfNCkgdGhyb3cgZV80LmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnN0YXRlLmRvbmUpIHtcbiAgICAgIC8vIGdldCBmaW5hbCBjaGlsZCBzdGF0ZSBub2RlXG4gICAgICB2YXIgZmluYWxDaGlsZFN0YXRlTm9kZSA9IHN0YXRlLmNvbmZpZ3VyYXRpb24uZmluZChmdW5jdGlvbiAoc24pIHtcbiAgICAgICAgcmV0dXJuIHNuLnR5cGUgPT09ICdmaW5hbCcgJiYgc24ucGFyZW50ID09PSBfdGhpcy5tYWNoaW5lO1xuICAgICAgfSk7XG4gICAgICB2YXIgZG9uZURhdGEgPSBmaW5hbENoaWxkU3RhdGVOb2RlICYmIGZpbmFsQ2hpbGRTdGF0ZU5vZGUuZG9uZURhdGEgPyBtYXBDb250ZXh0KGZpbmFsQ2hpbGRTdGF0ZU5vZGUuZG9uZURhdGEsIHN0YXRlLmNvbnRleHQsIF9ldmVudCkgOiB1bmRlZmluZWQ7XG4gICAgICB0aGlzLl9kb25lRXZlbnQgPSBkb25lSW52b2tlKHRoaXMuaWQsIGRvbmVEYXRhKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yICh2YXIgX2wgPSBfX3ZhbHVlcyh0aGlzLmRvbmVMaXN0ZW5lcnMpLCBfbSA9IF9sLm5leHQoKTsgIV9tLmRvbmU7IF9tID0gX2wubmV4dCgpKSB7XG4gICAgICAgICAgdmFyIGxpc3RlbmVyID0gX20udmFsdWU7XG4gICAgICAgICAgbGlzdGVuZXIodGhpcy5fZG9uZUV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZV81XzEpIHtcbiAgICAgICAgZV81ID0ge1xuICAgICAgICAgIGVycm9yOiBlXzVfMVxuICAgICAgICB9O1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoX20gJiYgIV9tLmRvbmUgJiYgKF9kID0gX2wucmV0dXJuKSkgX2QuY2FsbChfbCk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgaWYgKGVfNSkgdGhyb3cgZV81LmVycm9yO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3N0b3AoKTtcblxuICAgICAgdGhpcy5fc3RvcENoaWxkcmVuKCk7XG5cbiAgICAgIHJlZ2lzdHJ5LmZyZWUodGhpcy5zZXNzaW9uSWQpO1xuICAgIH1cbiAgfTtcbiAgLypcclxuICAgKiBBZGRzIGEgbGlzdGVuZXIgdGhhdCBpcyBub3RpZmllZCB3aGVuZXZlciBhIHN0YXRlIHRyYW5zaXRpb24gaGFwcGVucy4gVGhlIGxpc3RlbmVyIGlzIGNhbGxlZCB3aXRoXHJcbiAgICogdGhlIG5leHQgc3RhdGUgYW5kIHRoZSBldmVudCBvYmplY3QgdGhhdCBjYXVzZWQgdGhlIHN0YXRlIHRyYW5zaXRpb24uXHJcbiAgICpcclxuICAgKiBAcGFyYW0gbGlzdGVuZXIgVGhlIHN0YXRlIGxpc3RlbmVyXHJcbiAgICovXG5cblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUub25UcmFuc2l0aW9uID0gZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgdGhpcy5saXN0ZW5lcnMuYWRkKGxpc3RlbmVyKTsgLy8gU2VuZCBjdXJyZW50IHN0YXRlIHRvIGxpc3RlbmVyXG5cbiAgICBpZiAodGhpcy5zdGF0dXMgPT09IEludGVycHJldGVyU3RhdHVzLlJ1bm5pbmcpIHtcbiAgICAgIGxpc3RlbmVyKHRoaXMuc3RhdGUsIHRoaXMuc3RhdGUuZXZlbnQpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5zdWJzY3JpYmUgPSBmdW5jdGlvbiAobmV4dExpc3RlbmVyT3JPYnNlcnZlciwgXywgLy8gVE9ETzogZXJyb3IgbGlzdGVuZXJcbiAgY29tcGxldGVMaXN0ZW5lcikge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgb2JzZXJ2ZXIgPSB0b09ic2VydmVyKG5leHRMaXN0ZW5lck9yT2JzZXJ2ZXIsIF8sIGNvbXBsZXRlTGlzdGVuZXIpO1xuICAgIHRoaXMubGlzdGVuZXJzLmFkZChvYnNlcnZlci5uZXh0KTsgLy8gU2VuZCBjdXJyZW50IHN0YXRlIHRvIGxpc3RlbmVyXG5cbiAgICBpZiAodGhpcy5zdGF0dXMgIT09IEludGVycHJldGVyU3RhdHVzLk5vdFN0YXJ0ZWQpIHtcbiAgICAgIG9ic2VydmVyLm5leHQodGhpcy5zdGF0ZSk7XG4gICAgfVxuXG4gICAgdmFyIGNvbXBsZXRlT25jZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIF90aGlzLmRvbmVMaXN0ZW5lcnMuZGVsZXRlKGNvbXBsZXRlT25jZSk7XG5cbiAgICAgIF90aGlzLnN0b3BMaXN0ZW5lcnMuZGVsZXRlKGNvbXBsZXRlT25jZSk7XG5cbiAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgfTtcblxuICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gSW50ZXJwcmV0ZXJTdGF0dXMuU3RvcHBlZCkge1xuICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vbkRvbmUoY29tcGxldGVPbmNlKTtcbiAgICAgIHRoaXMub25TdG9wKGNvbXBsZXRlT25jZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIF90aGlzLmxpc3RlbmVycy5kZWxldGUob2JzZXJ2ZXIubmV4dCk7XG5cbiAgICAgICAgX3RoaXMuZG9uZUxpc3RlbmVycy5kZWxldGUoY29tcGxldGVPbmNlKTtcblxuICAgICAgICBfdGhpcy5zdG9wTGlzdGVuZXJzLmRlbGV0ZShjb21wbGV0ZU9uY2UpO1xuICAgICAgfVxuICAgIH07XG4gIH07XG4gIC8qKlxyXG4gICAqIEFkZHMgYW4gZXZlbnQgbGlzdGVuZXIgdGhhdCBpcyBub3RpZmllZCB3aGVuZXZlciBhbiBldmVudCBpcyBzZW50IHRvIHRoZSBydW5uaW5nIGludGVycHJldGVyLlxyXG4gICAqIEBwYXJhbSBsaXN0ZW5lciBUaGUgZXZlbnQgbGlzdGVuZXJcclxuICAgKi9cblxuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5vbkV2ZW50ID0gZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgdGhpcy5ldmVudExpc3RlbmVycy5hZGQobGlzdGVuZXIpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICAvKipcclxuICAgKiBBZGRzIGFuIGV2ZW50IGxpc3RlbmVyIHRoYXQgaXMgbm90aWZpZWQgd2hlbmV2ZXIgYSBgc2VuZGAgZXZlbnQgb2NjdXJzLlxyXG4gICAqIEBwYXJhbSBsaXN0ZW5lciBUaGUgZXZlbnQgbGlzdGVuZXJcclxuICAgKi9cblxuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5vblNlbmQgPSBmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICB0aGlzLnNlbmRMaXN0ZW5lcnMuYWRkKGxpc3RlbmVyKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgLyoqXHJcbiAgICogQWRkcyBhIGNvbnRleHQgbGlzdGVuZXIgdGhhdCBpcyBub3RpZmllZCB3aGVuZXZlciB0aGUgc3RhdGUgY29udGV4dCBjaGFuZ2VzLlxyXG4gICAqIEBwYXJhbSBsaXN0ZW5lciBUaGUgY29udGV4dCBsaXN0ZW5lclxyXG4gICAqL1xuXG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLm9uQ2hhbmdlID0gZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgdGhpcy5jb250ZXh0TGlzdGVuZXJzLmFkZChsaXN0ZW5lcik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIC8qKlxyXG4gICAqIEFkZHMgYSBsaXN0ZW5lciB0aGF0IGlzIG5vdGlmaWVkIHdoZW4gdGhlIG1hY2hpbmUgaXMgc3RvcHBlZC5cclxuICAgKiBAcGFyYW0gbGlzdGVuZXIgVGhlIGxpc3RlbmVyXHJcbiAgICovXG5cblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUub25TdG9wID0gZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgdGhpcy5zdG9wTGlzdGVuZXJzLmFkZChsaXN0ZW5lcik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIC8qKlxyXG4gICAqIEFkZHMgYSBzdGF0ZSBsaXN0ZW5lciB0aGF0IGlzIG5vdGlmaWVkIHdoZW4gdGhlIHN0YXRlY2hhcnQgaGFzIHJlYWNoZWQgaXRzIGZpbmFsIHN0YXRlLlxyXG4gICAqIEBwYXJhbSBsaXN0ZW5lciBUaGUgc3RhdGUgbGlzdGVuZXJcclxuICAgKi9cblxuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5vbkRvbmUgPSBmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICBpZiAodGhpcy5zdGF0dXMgPT09IEludGVycHJldGVyU3RhdHVzLlN0b3BwZWQgJiYgdGhpcy5fZG9uZUV2ZW50KSB7XG4gICAgICBsaXN0ZW5lcih0aGlzLl9kb25lRXZlbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRvbmVMaXN0ZW5lcnMuYWRkKGxpc3RlbmVyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgLyoqXHJcbiAgICogUmVtb3ZlcyBhIGxpc3RlbmVyLlxyXG4gICAqIEBwYXJhbSBsaXN0ZW5lciBUaGUgbGlzdGVuZXIgdG8gcmVtb3ZlXHJcbiAgICovXG5cblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUub2ZmID0gZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgdGhpcy5saXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcbiAgICB0aGlzLmV2ZW50TGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcik7XG4gICAgdGhpcy5zZW5kTGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcik7XG4gICAgdGhpcy5zdG9wTGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcik7XG4gICAgdGhpcy5kb25lTGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcik7XG4gICAgdGhpcy5jb250ZXh0TGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIC8qKlxyXG4gICAqIFN0YXJ0cyB0aGUgaW50ZXJwcmV0ZXIgZnJvbSB0aGUgZ2l2ZW4gc3RhdGUsIG9yIHRoZSBpbml0aWFsIHN0YXRlLlxyXG4gICAqIEBwYXJhbSBpbml0aWFsU3RhdGUgVGhlIHN0YXRlIHRvIHN0YXJ0IHRoZSBzdGF0ZWNoYXJ0IGZyb21cclxuICAgKi9cblxuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uIChpbml0aWFsU3RhdGUpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSBJbnRlcnByZXRlclN0YXR1cy5SdW5uaW5nKSB7XG4gICAgICAvLyBEbyBub3QgcmVzdGFydCB0aGUgc2VydmljZSBpZiBpdCBpcyBhbHJlYWR5IHN0YXJ0ZWRcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gLy8geWVzLCBpdCdzIGEgaGFjayBidXQgd2UgbmVlZCB0aGUgcmVsYXRlZCBjYWNoZSB0byBiZSBwb3B1bGF0ZWQgZm9yIHNvbWUgdGhpbmdzIHRvIHdvcmsgKGxpa2UgZGVsYXllZCB0cmFuc2l0aW9ucylcbiAgICAvLyB0aGlzIGlzIHVzdWFsbHkgY2FsbGVkIGJ5IGBtYWNoaW5lLmdldEluaXRpYWxTdGF0ZWAgYnV0IGlmIHdlIHJlaHlkcmF0ZSBmcm9tIGEgc3RhdGUgd2UgbWlnaHQgYnlwYXNzIHRoaXMgY2FsbFxuICAgIC8vIHdlIGFsc28gZG9uJ3Qgd2FudCB0byBjYWxsIHRoaXMgbWV0aG9kIGhlcmUgYXMgaXQgcmVzb2x2ZXMgdGhlIGZ1bGwgaW5pdGlhbCBzdGF0ZSB3aGljaCBtaWdodCBpbnZvbHZlIGNhbGxpbmcgYXNzaWduIGFjdGlvbnNcbiAgICAvLyBhbmQgdGhhdCBjb3VsZCBwb3RlbnRpYWxseSBsZWFkIHRvIHNvbWUgdW53YW50ZWQgc2lkZS1lZmZlY3RzIChldmVuIHN1Y2ggYXMgY3JlYXRpbmcgc29tZSByb2d1ZSBhY3RvcnMpXG5cblxuICAgIHRoaXMubWFjaGluZS5faW5pdCgpO1xuXG4gICAgcmVnaXN0cnkucmVnaXN0ZXIodGhpcy5zZXNzaW9uSWQsIHRoaXMpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIHRoaXMuc3RhdHVzID0gSW50ZXJwcmV0ZXJTdGF0dXMuUnVubmluZztcbiAgICB2YXIgcmVzb2x2ZWRTdGF0ZSA9IGluaXRpYWxTdGF0ZSA9PT0gdW5kZWZpbmVkID8gdGhpcy5pbml0aWFsU3RhdGUgOiBwcm92aWRlKHRoaXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBpc1N0YXRlQ29uZmlnKGluaXRpYWxTdGF0ZSkgPyBfdGhpcy5tYWNoaW5lLnJlc29sdmVTdGF0ZShpbml0aWFsU3RhdGUpIDogX3RoaXMubWFjaGluZS5yZXNvbHZlU3RhdGUoU3RhdGUuZnJvbShpbml0aWFsU3RhdGUsIF90aGlzLm1hY2hpbmUuY29udGV4dCkpO1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5kZXZUb29scykge1xuICAgICAgdGhpcy5hdHRhY2hEZXYoKTtcbiAgICB9XG5cbiAgICB0aGlzLnNjaGVkdWxlci5pbml0aWFsaXplKGZ1bmN0aW9uICgpIHtcbiAgICAgIF90aGlzLnVwZGF0ZShyZXNvbHZlZFN0YXRlLCBpbml0RXZlbnQpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5fc3RvcENoaWxkcmVuID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIFRPRE86IHRoaW5rIGFib3V0IGNvbnZlcnRpbmcgdGhvc2UgdG8gYWN0aW9uc1xuICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgIGlmIChpc0Z1bmN0aW9uKGNoaWxkLnN0b3ApKSB7XG4gICAgICAgIGNoaWxkLnN0b3AoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLmNoaWxkcmVuLmNsZWFyKCk7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLl9zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBlXzYsIF9hLCBlXzcsIF9iLCBlXzgsIF9jLCBlXzksIF9kLCBlXzEwLCBfZTtcblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBfZiA9IF9fdmFsdWVzKHRoaXMubGlzdGVuZXJzKSwgX2cgPSBfZi5uZXh0KCk7ICFfZy5kb25lOyBfZyA9IF9mLm5leHQoKSkge1xuICAgICAgICB2YXIgbGlzdGVuZXIgPSBfZy52YWx1ZTtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlXzZfMSkge1xuICAgICAgZV82ID0ge1xuICAgICAgICBlcnJvcjogZV82XzFcbiAgICAgIH07XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfZyAmJiAhX2cuZG9uZSAmJiAoX2EgPSBfZi5yZXR1cm4pKSBfYS5jYWxsKF9mKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGlmIChlXzYpIHRocm93IGVfNi5lcnJvcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2ggPSBfX3ZhbHVlcyh0aGlzLnN0b3BMaXN0ZW5lcnMpLCBfaiA9IF9oLm5leHQoKTsgIV9qLmRvbmU7IF9qID0gX2gubmV4dCgpKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lciA9IF9qLnZhbHVlOyAvLyBjYWxsIGxpc3RlbmVyLCB0aGVuIHJlbW92ZVxuXG4gICAgICAgIGxpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuc3RvcExpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfN18xKSB7XG4gICAgICBlXzcgPSB7XG4gICAgICAgIGVycm9yOiBlXzdfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKF9qICYmICFfai5kb25lICYmIChfYiA9IF9oLnJldHVybikpIF9iLmNhbGwoX2gpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfNykgdGhyb3cgZV83LmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBfayA9IF9fdmFsdWVzKHRoaXMuY29udGV4dExpc3RlbmVycyksIF9sID0gX2submV4dCgpOyAhX2wuZG9uZTsgX2wgPSBfay5uZXh0KCkpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVyID0gX2wudmFsdWU7XG4gICAgICAgIHRoaXMuY29udGV4dExpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfOF8xKSB7XG4gICAgICBlXzggPSB7XG4gICAgICAgIGVycm9yOiBlXzhfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKF9sICYmICFfbC5kb25lICYmIChfYyA9IF9rLnJldHVybikpIF9jLmNhbGwoX2spO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfOCkgdGhyb3cgZV84LmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBfbSA9IF9fdmFsdWVzKHRoaXMuZG9uZUxpc3RlbmVycyksIF9vID0gX20ubmV4dCgpOyAhX28uZG9uZTsgX28gPSBfbS5uZXh0KCkpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVyID0gX28udmFsdWU7XG4gICAgICAgIHRoaXMuZG9uZUxpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfOV8xKSB7XG4gICAgICBlXzkgPSB7XG4gICAgICAgIGVycm9yOiBlXzlfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKF9vICYmICFfby5kb25lICYmIChfZCA9IF9tLnJldHVybikpIF9kLmNhbGwoX20pO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfOSkgdGhyb3cgZV85LmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghdGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgLy8gSW50ZXJwcmV0ZXIgYWxyZWFkeSBzdG9wcGVkOyBkbyBub3RoaW5nXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgdGhpcy5zdGF0dXMgPSBJbnRlcnByZXRlclN0YXR1cy5TdG9wcGVkO1xuICAgIHRoaXMuX2luaXRpYWxTdGF0ZSA9IHVuZGVmaW5lZDtcblxuICAgIHRyeSB7XG4gICAgICAvLyB3ZSBhcmUgZ29pbmcgdG8gc3RvcCB3aXRoaW4gdGhlIGN1cnJlbnQgc3luYyBmcmFtZVxuICAgICAgLy8gc28gd2UgY2FuIHNhZmVseSBqdXN0IGNhbmNlbCB0aGlzIGhlcmUgYXMgbm90aGluZyBhc3luYyBzaG91bGQgYmUgZmlyZWQgYW55d2F5XG4gICAgICBmb3IgKHZhciBfcCA9IF9fdmFsdWVzKE9iamVjdC5rZXlzKHRoaXMuZGVsYXllZEV2ZW50c01hcCkpLCBfcSA9IF9wLm5leHQoKTsgIV9xLmRvbmU7IF9xID0gX3AubmV4dCgpKSB7XG4gICAgICAgIHZhciBrZXkgPSBfcS52YWx1ZTtcbiAgICAgICAgdGhpcy5jbG9jay5jbGVhclRpbWVvdXQodGhpcy5kZWxheWVkRXZlbnRzTWFwW2tleV0pO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfMTBfMSkge1xuICAgICAgZV8xMCA9IHtcbiAgICAgICAgZXJyb3I6IGVfMTBfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKF9xICYmICFfcS5kb25lICYmIChfZSA9IF9wLnJldHVybikpIF9lLmNhbGwoX3ApO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfMTApIHRocm93IGVfMTAuZXJyb3I7XG4gICAgICB9XG4gICAgfSAvLyBjbGVhciBldmVyeXRoaW5nIHRoYXQgbWlnaHQgYmUgZW5xdWV1ZWRcblxuXG4gICAgdGhpcy5zY2hlZHVsZXIuY2xlYXIoKTtcbiAgICB0aGlzLnNjaGVkdWxlciA9IG5ldyBTY2hlZHVsZXIoe1xuICAgICAgZGVmZXJFdmVudHM6IHRoaXMub3B0aW9ucy5kZWZlckV2ZW50c1xuICAgIH0pO1xuICB9O1xuICAvKipcclxuICAgKiBTdG9wcyB0aGUgaW50ZXJwcmV0ZXIgYW5kIHVuc3Vic2NyaWJlIGFsbCBsaXN0ZW5lcnMuXHJcbiAgICpcclxuICAgKiBUaGlzIHdpbGwgYWxzbyBub3RpZnkgdGhlIGBvblN0b3BgIGxpc3RlbmVycy5cclxuICAgKi9cblxuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIFRPRE86IGFkZCB3YXJuaW5nIGZvciBzdG9wcGluZyBub24tcm9vdCBpbnRlcnByZXRlcnNcbiAgICB2YXIgX3RoaXMgPSB0aGlzOyAvLyBncmFiIHRoZSBjdXJyZW50IHNjaGVkdWxlciBhcyBpdCB3aWxsIGJlIHJlcGxhY2VkIGluIF9zdG9wXG5cblxuICAgIHZhciBzY2hlZHVsZXIgPSB0aGlzLnNjaGVkdWxlcjtcblxuICAgIHRoaXMuX3N0b3AoKTsgLy8gbGV0IHdoYXQgaXMgY3VycmVudGx5IHByb2Nlc3NlZCB0byBiZSBmaW5pc2hlZFxuXG5cbiAgICBzY2hlZHVsZXIuc2NoZWR1bGUoZnVuY3Rpb24gKCkge1xuICAgICAgLy8gaXQgZmVlbHMgd2VpcmQgdG8gaGFuZGxlIHRoaXMgaGVyZSBidXQgd2UgbmVlZCB0byBoYW5kbGUgdGhpcyBldmVuIHNsaWdodGx5IFwib3V0IG9mIGJhbmRcIlxuICAgICAgdmFyIF9ldmVudCA9IHRvU0NYTUxFdmVudCh7XG4gICAgICAgIHR5cGU6ICd4c3RhdGUuc3RvcCdcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgbmV4dFN0YXRlID0gcHJvdmlkZShfdGhpcywgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZXhpdEFjdGlvbnMgPSBmbGF0dGVuKF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChfdGhpcy5zdGF0ZS5jb25maWd1cmF0aW9uKSwgZmFsc2UpLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICByZXR1cm4gYi5vcmRlciAtIGEub3JkZXI7XG4gICAgICAgIH0pLm1hcChmdW5jdGlvbiAoc3RhdGVOb2RlKSB7XG4gICAgICAgICAgcmV0dXJuIHRvQWN0aW9uT2JqZWN0cyhzdGF0ZU5vZGUub25FeGl0LCBfdGhpcy5tYWNoaW5lLm9wdGlvbnMuYWN0aW9ucyk7XG4gICAgICAgIH0pKTtcblxuICAgICAgICB2YXIgX2EgPSBfX3JlYWQocmVzb2x2ZUFjdGlvbnMoX3RoaXMubWFjaGluZSwgX3RoaXMuc3RhdGUsIF90aGlzLnN0YXRlLmNvbnRleHQsIF9ldmVudCwgW3tcbiAgICAgICAgICB0eXBlOiAnZXhpdCcsXG4gICAgICAgICAgYWN0aW9uczogZXhpdEFjdGlvbnNcbiAgICAgICAgfV0sIF90aGlzLm1hY2hpbmUuY29uZmlnLnByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzID8gX3RoaXMuX2V4ZWMgOiB1bmRlZmluZWQsIF90aGlzLm1hY2hpbmUuY29uZmlnLnByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzIHx8IF90aGlzLm1hY2hpbmUuY29uZmlnLnByZXNlcnZlQWN0aW9uT3JkZXIpLCAyKSxcbiAgICAgICAgICAgIHJlc29sdmVkQWN0aW9ucyA9IF9hWzBdLFxuICAgICAgICAgICAgdXBkYXRlZENvbnRleHQgPSBfYVsxXTtcblxuICAgICAgICB2YXIgbmV3U3RhdGUgPSBuZXcgU3RhdGUoe1xuICAgICAgICAgIHZhbHVlOiBfdGhpcy5zdGF0ZS52YWx1ZSxcbiAgICAgICAgICBjb250ZXh0OiB1cGRhdGVkQ29udGV4dCxcbiAgICAgICAgICBfZXZlbnQ6IF9ldmVudCxcbiAgICAgICAgICBfc2Vzc2lvbmlkOiBfdGhpcy5zZXNzaW9uSWQsXG4gICAgICAgICAgaGlzdG9yeVZhbHVlOiB1bmRlZmluZWQsXG4gICAgICAgICAgaGlzdG9yeTogX3RoaXMuc3RhdGUsXG4gICAgICAgICAgYWN0aW9uczogcmVzb2x2ZWRBY3Rpb25zLmZpbHRlcihmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gIWlzUmFpc2FibGVBY3Rpb24oYWN0aW9uKTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBhY3Rpdml0aWVzOiB7fSxcbiAgICAgICAgICBldmVudHM6IFtdLFxuICAgICAgICAgIGNvbmZpZ3VyYXRpb246IFtdLFxuICAgICAgICAgIHRyYW5zaXRpb25zOiBbXSxcbiAgICAgICAgICBjaGlsZHJlbjoge30sXG4gICAgICAgICAgZG9uZTogX3RoaXMuc3RhdGUuZG9uZSxcbiAgICAgICAgICB0YWdzOiBfdGhpcy5zdGF0ZS50YWdzLFxuICAgICAgICAgIG1hY2hpbmU6IF90aGlzLm1hY2hpbmVcbiAgICAgICAgfSk7XG4gICAgICAgIG5ld1N0YXRlLmNoYW5nZWQgPSB0cnVlO1xuICAgICAgICByZXR1cm4gbmV3U3RhdGU7XG4gICAgICB9KTtcblxuICAgICAgX3RoaXMudXBkYXRlKG5leHRTdGF0ZSwgX2V2ZW50KTtcblxuICAgICAgX3RoaXMuX3N0b3BDaGlsZHJlbigpO1xuXG4gICAgICByZWdpc3RyeS5mcmVlKF90aGlzLnNlc3Npb25JZCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLmJhdGNoID0gZnVuY3Rpb24gKGV2ZW50cykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAodGhpcy5zdGF0dXMgPT09IEludGVycHJldGVyU3RhdHVzLk5vdFN0YXJ0ZWQgJiYgdGhpcy5vcHRpb25zLmRlZmVyRXZlbnRzKSB7XG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tY29uc29sZVxuICAgICAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgICAgIHdhcm4oZmFsc2UsIFwiXCIuY29uY2F0KGV2ZW50cy5sZW5ndGgsIFwiIGV2ZW50KHMpIHdlcmUgc2VudCB0byB1bmluaXRpYWxpemVkIHNlcnZpY2UgXFxcIlwiKS5jb25jYXQodGhpcy5tYWNoaW5lLmlkLCBcIlxcXCIgYW5kIGFyZSBkZWZlcnJlZC4gTWFrZSBzdXJlIC5zdGFydCgpIGlzIGNhbGxlZCBmb3IgdGhpcyBzZXJ2aWNlLlxcbkV2ZW50OiBcIikuY29uY2F0KEpTT04uc3RyaW5naWZ5KGV2ZW50KSkpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0dXMgIT09IEludGVycHJldGVyU3RhdHVzLlJ1bm5pbmcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvciggLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICAgICAgXCJcIi5jb25jYXQoZXZlbnRzLmxlbmd0aCwgXCIgZXZlbnQocykgd2VyZSBzZW50IHRvIHVuaW5pdGlhbGl6ZWQgc2VydmljZSBcXFwiXCIpLmNvbmNhdCh0aGlzLm1hY2hpbmUuaWQsIFwiXFxcIi4gTWFrZSBzdXJlIC5zdGFydCgpIGlzIGNhbGxlZCBmb3IgdGhpcyBzZXJ2aWNlLCBvciBzZXQgeyBkZWZlckV2ZW50czogdHJ1ZSB9IGluIHRoZSBzZXJ2aWNlIG9wdGlvbnMuXCIpKTtcbiAgICB9XG5cbiAgICBpZiAoIWV2ZW50cy5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZXhlYyA9ICEhdGhpcy5tYWNoaW5lLmNvbmZpZy5wcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50cyAmJiB0aGlzLl9leGVjO1xuICAgIHRoaXMuc2NoZWR1bGVyLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBlXzExLCBfYTtcblxuICAgICAgdmFyIG5leHRTdGF0ZSA9IF90aGlzLnN0YXRlO1xuICAgICAgdmFyIGJhdGNoQ2hhbmdlZCA9IGZhbHNlO1xuICAgICAgdmFyIGJhdGNoZWRBY3Rpb25zID0gW107XG5cbiAgICAgIHZhciBfbG9vcF8xID0gZnVuY3Rpb24gKGV2ZW50XzEpIHtcbiAgICAgICAgdmFyIF9ldmVudCA9IHRvU0NYTUxFdmVudChldmVudF8xKTtcblxuICAgICAgICBfdGhpcy5mb3J3YXJkKF9ldmVudCk7XG5cbiAgICAgICAgbmV4dFN0YXRlID0gcHJvdmlkZShfdGhpcywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBfdGhpcy5tYWNoaW5lLnRyYW5zaXRpb24obmV4dFN0YXRlLCBfZXZlbnQsIHVuZGVmaW5lZCwgZXhlYyB8fCB1bmRlZmluZWQpO1xuICAgICAgICB9KTtcbiAgICAgICAgYmF0Y2hlZEFjdGlvbnMucHVzaC5hcHBseShiYXRjaGVkQWN0aW9ucywgX19zcHJlYWRBcnJheShbXSwgX19yZWFkKF90aGlzLm1hY2hpbmUuY29uZmlnLnByZWRpY3RhYmxlQWN0aW9uQXJndW1lbnRzID8gbmV4dFN0YXRlLmFjdGlvbnMgOiBuZXh0U3RhdGUuYWN0aW9ucy5tYXAoZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICByZXR1cm4gYmluZEFjdGlvblRvU3RhdGUoYSwgbmV4dFN0YXRlKTtcbiAgICAgICAgfSkpLCBmYWxzZSkpO1xuICAgICAgICBiYXRjaENoYW5nZWQgPSBiYXRjaENoYW5nZWQgfHwgISFuZXh0U3RhdGUuY2hhbmdlZDtcbiAgICAgIH07XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAodmFyIGV2ZW50c18xID0gX192YWx1ZXMoZXZlbnRzKSwgZXZlbnRzXzFfMSA9IGV2ZW50c18xLm5leHQoKTsgIWV2ZW50c18xXzEuZG9uZTsgZXZlbnRzXzFfMSA9IGV2ZW50c18xLm5leHQoKSkge1xuICAgICAgICAgIHZhciBldmVudF8xID0gZXZlbnRzXzFfMS52YWx1ZTtcblxuICAgICAgICAgIF9sb29wXzEoZXZlbnRfMSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVfMTFfMSkge1xuICAgICAgICBlXzExID0ge1xuICAgICAgICAgIGVycm9yOiBlXzExXzFcbiAgICAgICAgfTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKGV2ZW50c18xXzEgJiYgIWV2ZW50c18xXzEuZG9uZSAmJiAoX2EgPSBldmVudHNfMS5yZXR1cm4pKSBfYS5jYWxsKGV2ZW50c18xKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBpZiAoZV8xMSkgdGhyb3cgZV8xMS5lcnJvcjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBuZXh0U3RhdGUuY2hhbmdlZCA9IGJhdGNoQ2hhbmdlZDtcbiAgICAgIG5leHRTdGF0ZS5hY3Rpb25zID0gYmF0Y2hlZEFjdGlvbnM7XG5cbiAgICAgIF90aGlzLnVwZGF0ZShuZXh0U3RhdGUsIHRvU0NYTUxFdmVudChldmVudHNbZXZlbnRzLmxlbmd0aCAtIDFdKSk7XG4gICAgfSk7XG4gIH07XG4gIC8qKlxyXG4gICAqIFJldHVybnMgYSBzZW5kIGZ1bmN0aW9uIGJvdW5kIHRvIHRoaXMgaW50ZXJwcmV0ZXIgaW5zdGFuY2UuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gZXZlbnQgVGhlIGV2ZW50IHRvIGJlIHNlbnQgYnkgdGhlIHNlbmRlci5cclxuICAgKi9cblxuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5zZW5kZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICByZXR1cm4gdGhpcy5zZW5kLmJpbmQodGhpcywgZXZlbnQpO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5fbmV4dFN0YXRlID0gZnVuY3Rpb24gKGV2ZW50LCBleGVjKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGlmIChleGVjID09PSB2b2lkIDApIHtcbiAgICAgIGV4ZWMgPSAhIXRoaXMubWFjaGluZS5jb25maWcucHJlZGljdGFibGVBY3Rpb25Bcmd1bWVudHMgJiYgdGhpcy5fZXhlYztcbiAgICB9XG5cbiAgICB2YXIgX2V2ZW50ID0gdG9TQ1hNTEV2ZW50KGV2ZW50KTtcblxuICAgIGlmIChfZXZlbnQubmFtZS5pbmRleE9mKGVycm9yUGxhdGZvcm0pID09PSAwICYmICF0aGlzLnN0YXRlLm5leHRFdmVudHMuc29tZShmdW5jdGlvbiAobmV4dEV2ZW50KSB7XG4gICAgICByZXR1cm4gbmV4dEV2ZW50LmluZGV4T2YoZXJyb3JQbGF0Zm9ybSkgPT09IDA7XG4gICAgfSkpIHtcbiAgICAgIHRocm93IF9ldmVudC5kYXRhLmRhdGE7XG4gICAgfVxuXG4gICAgdmFyIG5leHRTdGF0ZSA9IHByb3ZpZGUodGhpcywgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIF90aGlzLm1hY2hpbmUudHJhbnNpdGlvbihfdGhpcy5zdGF0ZSwgX2V2ZW50LCB1bmRlZmluZWQsIGV4ZWMgfHwgdW5kZWZpbmVkKTtcbiAgICB9KTtcbiAgICByZXR1cm4gbmV4dFN0YXRlO1xuICB9O1xuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBuZXh0IHN0YXRlIGdpdmVuIHRoZSBpbnRlcnByZXRlcidzIGN1cnJlbnQgc3RhdGUgYW5kIHRoZSBldmVudC5cclxuICAgKlxyXG4gICAqIFRoaXMgaXMgYSBwdXJlIG1ldGhvZCB0aGF0IGRvZXMgX25vdF8gdXBkYXRlIHRoZSBpbnRlcnByZXRlcidzIHN0YXRlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIGV2ZW50IFRoZSBldmVudCB0byBkZXRlcm1pbmUgdGhlIG5leHQgc3RhdGVcclxuICAgKi9cblxuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5uZXh0U3RhdGUgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICByZXR1cm4gdGhpcy5fbmV4dFN0YXRlKGV2ZW50LCBmYWxzZSk7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLmZvcndhcmQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgZV8xMiwgX2E7XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2IgPSBfX3ZhbHVlcyh0aGlzLmZvcndhcmRUbyksIF9jID0gX2IubmV4dCgpOyAhX2MuZG9uZTsgX2MgPSBfYi5uZXh0KCkpIHtcbiAgICAgICAgdmFyIGlkID0gX2MudmFsdWU7XG4gICAgICAgIHZhciBjaGlsZCA9IHRoaXMuY2hpbGRyZW4uZ2V0KGlkKTtcblxuICAgICAgICBpZiAoIWNoaWxkKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5hYmxlIHRvIGZvcndhcmQgZXZlbnQgJ1wiLmNvbmNhdChldmVudCwgXCInIGZyb20gaW50ZXJwcmV0ZXIgJ1wiKS5jb25jYXQodGhpcy5pZCwgXCInIHRvIG5vbmV4aXN0YW50IGNoaWxkICdcIikuY29uY2F0KGlkLCBcIicuXCIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNoaWxkLnNlbmQoZXZlbnQpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfMTJfMSkge1xuICAgICAgZV8xMiA9IHtcbiAgICAgICAgZXJyb3I6IGVfMTJfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKF9jICYmICFfYy5kb25lICYmIChfYSA9IF9iLnJldHVybikpIF9hLmNhbGwoX2IpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfMTIpIHRocm93IGVfMTIuZXJyb3I7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5kZWZlciA9IGZ1bmN0aW9uIChzZW5kQWN0aW9uKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciB0aW1lcklkID0gdGhpcy5jbG9jay5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICgndG8nIGluIHNlbmRBY3Rpb24gJiYgc2VuZEFjdGlvbi50bykge1xuICAgICAgICBfdGhpcy5zZW5kVG8oc2VuZEFjdGlvbi5fZXZlbnQsIHNlbmRBY3Rpb24udG8sIHRydWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX3RoaXMuc2VuZChzZW5kQWN0aW9uLl9ldmVudCk7XG4gICAgICB9XG4gICAgfSwgc2VuZEFjdGlvbi5kZWxheSk7XG5cbiAgICBpZiAoc2VuZEFjdGlvbi5pZCkge1xuICAgICAgdGhpcy5kZWxheWVkRXZlbnRzTWFwW3NlbmRBY3Rpb24uaWRdID0gdGltZXJJZDtcbiAgICB9XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLmNhbmNlbCA9IGZ1bmN0aW9uIChzZW5kSWQpIHtcbiAgICB0aGlzLmNsb2NrLmNsZWFyVGltZW91dCh0aGlzLmRlbGF5ZWRFdmVudHNNYXBbc2VuZElkXSk7XG4gICAgZGVsZXRlIHRoaXMuZGVsYXllZEV2ZW50c01hcFtzZW5kSWRdO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5leGVjID0gZnVuY3Rpb24gKGFjdGlvbiwgc3RhdGUsIGFjdGlvbkZ1bmN0aW9uTWFwKSB7XG4gICAgaWYgKGFjdGlvbkZ1bmN0aW9uTWFwID09PSB2b2lkIDApIHtcbiAgICAgIGFjdGlvbkZ1bmN0aW9uTWFwID0gdGhpcy5tYWNoaW5lLm9wdGlvbnMuYWN0aW9ucztcbiAgICB9XG5cbiAgICB0aGlzLl9leGVjKGFjdGlvbiwgc3RhdGUuY29udGV4dCwgc3RhdGUuX2V2ZW50LCBhY3Rpb25GdW5jdGlvbk1hcCk7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnJlbW92ZUNoaWxkID0gZnVuY3Rpb24gKGNoaWxkSWQpIHtcbiAgICB2YXIgX2E7XG5cbiAgICB0aGlzLmNoaWxkcmVuLmRlbGV0ZShjaGlsZElkKTtcbiAgICB0aGlzLmZvcndhcmRUby5kZWxldGUoY2hpbGRJZCk7IC8vIHRoaXMuc3RhdGUgbWlnaHQgbm90IGV4aXN0IGF0IHRoZSB0aW1lIHRoaXMgaXMgY2FsbGVkLFxuICAgIC8vIHN1Y2ggYXMgd2hlbiBhIGNoaWxkIGlzIGFkZGVkIHRoZW4gcmVtb3ZlZCB3aGlsZSBpbml0aWFsaXppbmcgdGhlIHN0YXRlXG5cbiAgICAoX2EgPSB0aGlzLnN0YXRlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdHJ1ZSA6IGRlbGV0ZSBfYS5jaGlsZHJlbltjaGlsZElkXTtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuc3RvcENoaWxkID0gZnVuY3Rpb24gKGNoaWxkSWQpIHtcbiAgICB2YXIgY2hpbGQgPSB0aGlzLmNoaWxkcmVuLmdldChjaGlsZElkKTtcblxuICAgIGlmICghY2hpbGQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnJlbW92ZUNoaWxkKGNoaWxkSWQpO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oY2hpbGQuc3RvcCkpIHtcbiAgICAgIGNoaWxkLnN0b3AoKTtcbiAgICB9XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnNwYXduID0gZnVuY3Rpb24gKGVudGl0eSwgbmFtZSwgb3B0aW9ucykge1xuICAgIGlmICh0aGlzLnN0YXR1cyAhPT0gSW50ZXJwcmV0ZXJTdGF0dXMuUnVubmluZykge1xuICAgICAgcmV0dXJuIGNyZWF0ZURlZmVycmVkQWN0b3IoZW50aXR5LCBuYW1lKTtcbiAgICB9XG5cbiAgICBpZiAoaXNQcm9taXNlTGlrZShlbnRpdHkpKSB7XG4gICAgICByZXR1cm4gdGhpcy5zcGF3blByb21pc2UoUHJvbWlzZS5yZXNvbHZlKGVudGl0eSksIG5hbWUpO1xuICAgIH0gZWxzZSBpZiAoaXNGdW5jdGlvbihlbnRpdHkpKSB7XG4gICAgICByZXR1cm4gdGhpcy5zcGF3bkNhbGxiYWNrKGVudGl0eSwgbmFtZSk7XG4gICAgfSBlbHNlIGlmIChpc1NwYXduZWRBY3RvcihlbnRpdHkpKSB7XG4gICAgICByZXR1cm4gdGhpcy5zcGF3bkFjdG9yKGVudGl0eSwgbmFtZSk7XG4gICAgfSBlbHNlIGlmIChpc09ic2VydmFibGUoZW50aXR5KSkge1xuICAgICAgcmV0dXJuIHRoaXMuc3Bhd25PYnNlcnZhYmxlKGVudGl0eSwgbmFtZSk7XG4gICAgfSBlbHNlIGlmIChpc01hY2hpbmUoZW50aXR5KSkge1xuICAgICAgcmV0dXJuIHRoaXMuc3Bhd25NYWNoaW5lKGVudGl0eSwgX19hc3NpZ24oX19hc3NpZ24oe30sIG9wdGlvbnMpLCB7XG4gICAgICAgIGlkOiBuYW1lXG4gICAgICB9KSk7XG4gICAgfSBlbHNlIGlmIChpc0JlaGF2aW9yKGVudGl0eSkpIHtcbiAgICAgIHJldHVybiB0aGlzLnNwYXduQmVoYXZpb3IoZW50aXR5LCBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5hYmxlIHRvIHNwYXduIGVudGl0eSBcXFwiXCIuY29uY2F0KG5hbWUsIFwiXFxcIiBvZiB0eXBlIFxcXCJcIikuY29uY2F0KHR5cGVvZiBlbnRpdHksIFwiXFxcIi5cIikpO1xuICAgIH1cbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuc3Bhd25NYWNoaW5lID0gZnVuY3Rpb24gKG1hY2hpbmUsIG9wdGlvbnMpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cblxuICAgIHZhciBjaGlsZFNlcnZpY2UgPSBuZXcgSW50ZXJwcmV0ZXIobWFjaGluZSwgX19hc3NpZ24oX19hc3NpZ24oe30sIHRoaXMub3B0aW9ucyksIHtcbiAgICAgIHBhcmVudDogdGhpcyxcbiAgICAgIGlkOiBvcHRpb25zLmlkIHx8IG1hY2hpbmUuaWRcbiAgICB9KSk7XG5cbiAgICB2YXIgcmVzb2x2ZWRPcHRpb25zID0gX19hc3NpZ24oX19hc3NpZ24oe30sIERFRkFVTFRfU1BBV05fT1BUSU9OUyksIG9wdGlvbnMpO1xuXG4gICAgaWYgKHJlc29sdmVkT3B0aW9ucy5zeW5jKSB7XG4gICAgICBjaGlsZFNlcnZpY2Uub25UcmFuc2l0aW9uKGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgICBfdGhpcy5zZW5kKHVwZGF0ZSwge1xuICAgICAgICAgIHN0YXRlOiBzdGF0ZSxcbiAgICAgICAgICBpZDogY2hpbGRTZXJ2aWNlLmlkXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdmFyIGFjdG9yID0gY2hpbGRTZXJ2aWNlO1xuICAgIHRoaXMuY2hpbGRyZW4uc2V0KGNoaWxkU2VydmljZS5pZCwgYWN0b3IpO1xuXG4gICAgaWYgKHJlc29sdmVkT3B0aW9ucy5hdXRvRm9yd2FyZCkge1xuICAgICAgdGhpcy5mb3J3YXJkVG8uYWRkKGNoaWxkU2VydmljZS5pZCk7XG4gICAgfVxuXG4gICAgY2hpbGRTZXJ2aWNlLm9uRG9uZShmdW5jdGlvbiAoZG9uZUV2ZW50KSB7XG4gICAgICBfdGhpcy5yZW1vdmVDaGlsZChjaGlsZFNlcnZpY2UuaWQpO1xuXG4gICAgICBfdGhpcy5zZW5kKHRvU0NYTUxFdmVudChkb25lRXZlbnQsIHtcbiAgICAgICAgb3JpZ2luOiBjaGlsZFNlcnZpY2UuaWRcbiAgICAgIH0pKTtcbiAgICB9KS5zdGFydCgpO1xuICAgIHJldHVybiBhY3RvcjtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuc3Bhd25CZWhhdmlvciA9IGZ1bmN0aW9uIChiZWhhdmlvciwgaWQpIHtcbiAgICB2YXIgYWN0b3JSZWYgPSBzcGF3bkJlaGF2aW9yKGJlaGF2aW9yLCB7XG4gICAgICBpZDogaWQsXG4gICAgICBwYXJlbnQ6IHRoaXNcbiAgICB9KTtcbiAgICB0aGlzLmNoaWxkcmVuLnNldChpZCwgYWN0b3JSZWYpO1xuICAgIHJldHVybiBhY3RvclJlZjtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuc3Bhd25Qcm9taXNlID0gZnVuY3Rpb24gKHByb21pc2UsIGlkKSB7XG4gICAgdmFyIF9hO1xuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBjYW5jZWxlZCA9IGZhbHNlO1xuICAgIHZhciByZXNvbHZlZERhdGE7XG4gICAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgaWYgKCFjYW5jZWxlZCkge1xuICAgICAgICByZXNvbHZlZERhdGEgPSByZXNwb25zZTtcblxuICAgICAgICBfdGhpcy5yZW1vdmVDaGlsZChpZCk7XG5cbiAgICAgICAgX3RoaXMuc2VuZCh0b1NDWE1MRXZlbnQoZG9uZUludm9rZShpZCwgcmVzcG9uc2UpLCB7XG4gICAgICAgICAgb3JpZ2luOiBpZFxuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgfSwgZnVuY3Rpb24gKGVycm9yRGF0YSkge1xuICAgICAgaWYgKCFjYW5jZWxlZCkge1xuICAgICAgICBfdGhpcy5yZW1vdmVDaGlsZChpZCk7XG5cbiAgICAgICAgdmFyIGVycm9yRXZlbnQgPSBlcnJvcihpZCwgZXJyb3JEYXRhKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIFNlbmQgXCJlcnJvci5wbGF0Zm9ybS5pZFwiIHRvIHRoaXMgKHBhcmVudCkuXG4gICAgICAgICAgX3RoaXMuc2VuZCh0b1NDWE1MRXZlbnQoZXJyb3JFdmVudCwge1xuICAgICAgICAgICAgb3JpZ2luOiBpZFxuICAgICAgICAgIH0pKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICByZXBvcnRVbmhhbmRsZWRFeGNlcHRpb25Pbkludm9jYXRpb24oZXJyb3JEYXRhLCBlcnJvciwgaWQpO1xuXG4gICAgICAgICAgaWYgKF90aGlzLmRldlRvb2xzKSB7XG4gICAgICAgICAgICBfdGhpcy5kZXZUb29scy5zZW5kKGVycm9yRXZlbnQsIF90aGlzLnN0YXRlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoX3RoaXMubWFjaGluZS5zdHJpY3QpIHtcbiAgICAgICAgICAgIC8vIGl0IHdvdWxkIGJlIGJldHRlciB0byBhbHdheXMgc3RvcCB0aGUgc3RhdGUgbWFjaGluZSBpZiB1bmhhbmRsZWRcbiAgICAgICAgICAgIC8vIGV4Y2VwdGlvbi9wcm9taXNlIHJlamVjdGlvbiBoYXBwZW5zIGJ1dCBiZWNhdXNlIHdlIGRvbid0IHdhbnQgdG9cbiAgICAgICAgICAgIC8vIGJyZWFrIGV4aXN0aW5nIGNvZGUgc28gZW5mb3JjZSBpdCBvbiBzdHJpY3QgbW9kZSBvbmx5IGVzcGVjaWFsbHkgc29cbiAgICAgICAgICAgIC8vIGJlY2F1c2UgZG9jdW1lbnRhdGlvbiBzYXlzIHRoYXQgb25FcnJvciBpcyBvcHRpb25hbFxuICAgICAgICAgICAgX3RoaXMuc3RvcCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBhY3RvciA9IChfYSA9IHtcbiAgICAgIGlkOiBpZCxcbiAgICAgIHNlbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICAgIH0sXG4gICAgICBzdWJzY3JpYmU6IGZ1bmN0aW9uIChuZXh0LCBoYW5kbGVFcnJvciwgY29tcGxldGUpIHtcbiAgICAgICAgdmFyIG9ic2VydmVyID0gdG9PYnNlcnZlcihuZXh0LCBoYW5kbGVFcnJvciwgY29tcGxldGUpO1xuICAgICAgICB2YXIgdW5zdWJzY3JpYmVkID0gZmFsc2U7XG4gICAgICAgIHByb21pc2UudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICBpZiAodW5zdWJzY3JpYmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgb2JzZXJ2ZXIubmV4dChyZXNwb25zZSk7XG5cbiAgICAgICAgICBpZiAodW5zdWJzY3JpYmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgIGlmICh1bnN1YnNjcmliZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBvYnNlcnZlci5lcnJvcihlcnIpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB1bnN1YnNjcmliZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuc3Vic2NyaWJlZCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSxcbiAgICAgIHN0b3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2FuY2VsZWQgPSB0cnVlO1xuICAgICAgfSxcbiAgICAgIHRvSlNPTjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlkOiBpZFxuICAgICAgICB9O1xuICAgICAgfSxcbiAgICAgIGdldFNuYXBzaG90OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiByZXNvbHZlZERhdGE7XG4gICAgICB9XG4gICAgfSwgX2Fbc3ltYm9sT2JzZXJ2YWJsZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LCBfYSk7XG4gICAgdGhpcy5jaGlsZHJlbi5zZXQoaWQsIGFjdG9yKTtcbiAgICByZXR1cm4gYWN0b3I7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnNwYXduQ2FsbGJhY2sgPSBmdW5jdGlvbiAoY2FsbGJhY2ssIGlkKSB7XG4gICAgdmFyIF9hO1xuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBjYW5jZWxlZCA9IGZhbHNlO1xuICAgIHZhciByZWNlaXZlcnMgPSBuZXcgU2V0KCk7XG4gICAgdmFyIGxpc3RlbmVycyA9IG5ldyBTZXQoKTtcbiAgICB2YXIgZW1pdHRlZDtcblxuICAgIHZhciByZWNlaXZlID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgIGVtaXR0ZWQgPSBlO1xuICAgICAgbGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgICAgIHJldHVybiBsaXN0ZW5lcihlKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoY2FuY2VsZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBfdGhpcy5zZW5kKHRvU0NYTUxFdmVudChlLCB7XG4gICAgICAgIG9yaWdpbjogaWRcbiAgICAgIH0pKTtcbiAgICB9O1xuXG4gICAgdmFyIGNhbGxiYWNrU3RvcDtcblxuICAgIHRyeSB7XG4gICAgICBjYWxsYmFja1N0b3AgPSBjYWxsYmFjayhyZWNlaXZlLCBmdW5jdGlvbiAobmV3TGlzdGVuZXIpIHtcbiAgICAgICAgcmVjZWl2ZXJzLmFkZChuZXdMaXN0ZW5lcik7XG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMuc2VuZChlcnJvcihpZCwgZXJyKSk7XG4gICAgfVxuXG4gICAgaWYgKGlzUHJvbWlzZUxpa2UoY2FsbGJhY2tTdG9wKSkge1xuICAgICAgLy8gaXQgdHVybmVkIG91dCB0byBiZSBhbiBhc3luYyBmdW5jdGlvbiwgY2FuJ3QgcmVsaWFibHkgY2hlY2sgdGhpcyBiZWZvcmUgY2FsbGluZyBgY2FsbGJhY2tgXG4gICAgICAvLyBiZWNhdXNlIHRyYW5zcGlsZWQgYXN5bmMgZnVuY3Rpb25zIGFyZSBub3QgcmVjb2duaXphYmxlXG4gICAgICByZXR1cm4gdGhpcy5zcGF3blByb21pc2UoY2FsbGJhY2tTdG9wLCBpZCk7XG4gICAgfVxuXG4gICAgdmFyIGFjdG9yID0gKF9hID0ge1xuICAgICAgaWQ6IGlkLFxuICAgICAgc2VuZDogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHJldHVybiByZWNlaXZlcnMuZm9yRWFjaChmdW5jdGlvbiAocmVjZWl2ZXIpIHtcbiAgICAgICAgICByZXR1cm4gcmVjZWl2ZXIoZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBzdWJzY3JpYmU6IGZ1bmN0aW9uIChuZXh0KSB7XG4gICAgICAgIHZhciBvYnNlcnZlciA9IHRvT2JzZXJ2ZXIobmV4dCk7XG4gICAgICAgIGxpc3RlbmVycy5hZGQob2JzZXJ2ZXIubmV4dCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxpc3RlbmVycy5kZWxldGUob2JzZXJ2ZXIubmV4dCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSxcbiAgICAgIHN0b3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY2FuY2VsZWQgPSB0cnVlO1xuXG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKGNhbGxiYWNrU3RvcCkpIHtcbiAgICAgICAgICBjYWxsYmFja1N0b3AoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHRvSlNPTjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlkOiBpZFxuICAgICAgICB9O1xuICAgICAgfSxcbiAgICAgIGdldFNuYXBzaG90OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBlbWl0dGVkO1xuICAgICAgfVxuICAgIH0sIF9hW3N5bWJvbE9ic2VydmFibGVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSwgX2EpO1xuICAgIHRoaXMuY2hpbGRyZW4uc2V0KGlkLCBhY3Rvcik7XG4gICAgcmV0dXJuIGFjdG9yO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5zcGF3bk9ic2VydmFibGUgPSBmdW5jdGlvbiAoc291cmNlLCBpZCkge1xuICAgIHZhciBfYTtcblxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgZW1pdHRlZDtcbiAgICB2YXIgc3Vic2NyaXB0aW9uID0gc291cmNlLnN1YnNjcmliZShmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIGVtaXR0ZWQgPSB2YWx1ZTtcblxuICAgICAgX3RoaXMuc2VuZCh0b1NDWE1MRXZlbnQodmFsdWUsIHtcbiAgICAgICAgb3JpZ2luOiBpZFxuICAgICAgfSkpO1xuICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIF90aGlzLnJlbW92ZUNoaWxkKGlkKTtcblxuICAgICAgX3RoaXMuc2VuZCh0b1NDWE1MRXZlbnQoZXJyb3IoaWQsIGVyciksIHtcbiAgICAgICAgb3JpZ2luOiBpZFxuICAgICAgfSkpO1xuICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgIF90aGlzLnJlbW92ZUNoaWxkKGlkKTtcblxuICAgICAgX3RoaXMuc2VuZCh0b1NDWE1MRXZlbnQoZG9uZUludm9rZShpZCksIHtcbiAgICAgICAgb3JpZ2luOiBpZFxuICAgICAgfSkpO1xuICAgIH0pO1xuICAgIHZhciBhY3RvciA9IChfYSA9IHtcbiAgICAgIGlkOiBpZCxcbiAgICAgIHNlbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICAgIH0sXG4gICAgICBzdWJzY3JpYmU6IGZ1bmN0aW9uIChuZXh0LCBoYW5kbGVFcnJvciwgY29tcGxldGUpIHtcbiAgICAgICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV4dCwgaGFuZGxlRXJyb3IsIGNvbXBsZXRlKTtcbiAgICAgIH0sXG4gICAgICBzdG9wOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIH0sXG4gICAgICBnZXRTbmFwc2hvdDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZW1pdHRlZDtcbiAgICAgIH0sXG4gICAgICB0b0pTT046IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpZDogaWRcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9LCBfYVtzeW1ib2xPYnNlcnZhYmxlXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sIF9hKTtcbiAgICB0aGlzLmNoaWxkcmVuLnNldChpZCwgYWN0b3IpO1xuICAgIHJldHVybiBhY3RvcjtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuc3Bhd25BY3RvciA9IGZ1bmN0aW9uIChhY3RvciwgbmFtZSkge1xuICAgIHRoaXMuY2hpbGRyZW4uc2V0KG5hbWUsIGFjdG9yKTtcbiAgICByZXR1cm4gYWN0b3I7XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnNwYXduQWN0aXZpdHkgPSBmdW5jdGlvbiAoYWN0aXZpdHkpIHtcbiAgICB2YXIgaW1wbGVtZW50YXRpb24gPSB0aGlzLm1hY2hpbmUub3B0aW9ucyAmJiB0aGlzLm1hY2hpbmUub3B0aW9ucy5hY3Rpdml0aWVzID8gdGhpcy5tYWNoaW5lLm9wdGlvbnMuYWN0aXZpdGllc1thY3Rpdml0eS50eXBlXSA6IHVuZGVmaW5lZDtcblxuICAgIGlmICghaW1wbGVtZW50YXRpb24pIHtcbiAgICAgIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgICAgICB3YXJuKGZhbHNlLCBcIk5vIGltcGxlbWVudGF0aW9uIGZvdW5kIGZvciBhY3Rpdml0eSAnXCIuY29uY2F0KGFjdGl2aXR5LnR5cGUsIFwiJ1wiKSk7XG4gICAgICB9IC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1jb25zb2xlXG5cblxuICAgICAgcmV0dXJuO1xuICAgIH0gLy8gU3RhcnQgaW1wbGVtZW50YXRpb25cblxuXG4gICAgdmFyIGRpc3Bvc2UgPSBpbXBsZW1lbnRhdGlvbih0aGlzLnN0YXRlLmNvbnRleHQsIGFjdGl2aXR5KTtcbiAgICB0aGlzLnNwYXduRWZmZWN0KGFjdGl2aXR5LmlkLCBkaXNwb3NlKTtcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuc3Bhd25FZmZlY3QgPSBmdW5jdGlvbiAoaWQsIGRpc3Bvc2UpIHtcbiAgICB2YXIgX2E7XG5cbiAgICB0aGlzLmNoaWxkcmVuLnNldChpZCwgKF9hID0ge1xuICAgICAgaWQ6IGlkLFxuICAgICAgc2VuZDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgICAgfSxcbiAgICAgIHN1YnNjcmliZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHVuc3Vic2NyaWJlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICBzdG9wOiBkaXNwb3NlIHx8IHVuZGVmaW5lZCxcbiAgICAgIGdldFNuYXBzaG90OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9LFxuICAgICAgdG9KU09OOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaWQ6IGlkXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSwgX2Fbc3ltYm9sT2JzZXJ2YWJsZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LCBfYSkpO1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZS5hdHRhY2hEZXYgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGdsb2JhbCA9IGdldEdsb2JhbCgpO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5kZXZUb29scyAmJiBnbG9iYWwpIHtcbiAgICAgIGlmIChnbG9iYWwuX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fXykge1xuICAgICAgICB2YXIgZGV2VG9vbHNPcHRpb25zID0gdHlwZW9mIHRoaXMub3B0aW9ucy5kZXZUb29scyA9PT0gJ29iamVjdCcgPyB0aGlzLm9wdGlvbnMuZGV2VG9vbHMgOiB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuZGV2VG9vbHMgPSBnbG9iYWwuX19SRURVWF9ERVZUT09MU19FWFRFTlNJT05fXy5jb25uZWN0KF9fYXNzaWduKF9fYXNzaWduKHtcbiAgICAgICAgICBuYW1lOiB0aGlzLmlkLFxuICAgICAgICAgIGF1dG9QYXVzZTogdHJ1ZSxcbiAgICAgICAgICBzdGF0ZVNhbml0aXplcjogZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB2YWx1ZTogc3RhdGUudmFsdWUsXG4gICAgICAgICAgICAgIGNvbnRleHQ6IHN0YXRlLmNvbnRleHQsXG4gICAgICAgICAgICAgIGFjdGlvbnM6IHN0YXRlLmFjdGlvbnNcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9LCBkZXZUb29sc09wdGlvbnMpLCB7XG4gICAgICAgICAgZmVhdHVyZXM6IF9fYXNzaWduKHtcbiAgICAgICAgICAgIGp1bXA6IGZhbHNlLFxuICAgICAgICAgICAgc2tpcDogZmFsc2VcbiAgICAgICAgICB9LCBkZXZUb29sc09wdGlvbnMgPyBkZXZUb29sc09wdGlvbnMuZmVhdHVyZXMgOiB1bmRlZmluZWQpXG4gICAgICAgIH0pLCB0aGlzLm1hY2hpbmUpO1xuICAgICAgICB0aGlzLmRldlRvb2xzLmluaXQodGhpcy5zdGF0ZSk7XG4gICAgICB9IC8vIGFkZCBYU3RhdGUtc3BlY2lmaWMgZGV2IHRvb2xpbmcgaG9va1xuXG5cbiAgICAgIHJlZ2lzdGVyU2VydmljZSh0aGlzKTtcbiAgICB9XG4gIH07XG5cbiAgSW50ZXJwcmV0ZXIucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IHRoaXMuaWRcbiAgICB9O1xuICB9O1xuXG4gIEludGVycHJldGVyLnByb3RvdHlwZVtzeW1ib2xPYnNlcnZhYmxlXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBJbnRlcnByZXRlci5wcm90b3R5cGUuZ2V0U25hcHNob3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdHVzID09PSBJbnRlcnByZXRlclN0YXR1cy5Ob3RTdGFydGVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbml0aWFsU3RhdGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3N0YXRlO1xuICB9O1xuICAvKipcclxuICAgKiBUaGUgZGVmYXVsdCBpbnRlcnByZXRlciBvcHRpb25zOlxyXG4gICAqXHJcbiAgICogLSBgY2xvY2tgIHVzZXMgdGhlIGdsb2JhbCBgc2V0VGltZW91dGAgYW5kIGBjbGVhclRpbWVvdXRgIGZ1bmN0aW9uc1xyXG4gICAqIC0gYGxvZ2dlcmAgdXNlcyB0aGUgZ2xvYmFsIGBjb25zb2xlLmxvZygpYCBtZXRob2RcclxuICAgKi9cblxuXG4gIEludGVycHJldGVyLmRlZmF1bHRPcHRpb25zID0ge1xuICAgIGV4ZWN1dGU6IHRydWUsXG4gICAgZGVmZXJFdmVudHM6IHRydWUsXG4gICAgY2xvY2s6IHtcbiAgICAgIHNldFRpbWVvdXQ6IGZ1bmN0aW9uIChmbiwgbXMpIHtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZm4sIG1zKTtcbiAgICAgIH0sXG4gICAgICBjbGVhclRpbWVvdXQ6IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KGlkKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGxvZ2dlcjogLyojX19QVVJFX18qL2NvbnNvbGUubG9nLmJpbmQoY29uc29sZSksXG4gICAgZGV2VG9vbHM6IGZhbHNlXG4gIH07XG4gIEludGVycHJldGVyLmludGVycHJldCA9IGludGVycHJldDtcbiAgcmV0dXJuIEludGVycHJldGVyO1xufSgpO1xuXG52YXIgcmVzb2x2ZVNwYXduT3B0aW9ucyA9IGZ1bmN0aW9uIChuYW1lT3JPcHRpb25zKSB7XG4gIGlmIChpc1N0cmluZyhuYW1lT3JPcHRpb25zKSkge1xuICAgIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgREVGQVVMVF9TUEFXTl9PUFRJT05TKSwge1xuICAgICAgbmFtZTogbmFtZU9yT3B0aW9uc1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKF9fYXNzaWduKHt9LCBERUZBVUxUX1NQQVdOX09QVElPTlMpLCB7XG4gICAgbmFtZTogdW5pcXVlSWQoKVxuICB9KSwgbmFtZU9yT3B0aW9ucyk7XG59O1xuXG5mdW5jdGlvbiBzcGF3bihlbnRpdHksIG5hbWVPck9wdGlvbnMpIHtcbiAgdmFyIHJlc29sdmVkT3B0aW9ucyA9IHJlc29sdmVTcGF3bk9wdGlvbnMobmFtZU9yT3B0aW9ucyk7XG4gIHJldHVybiBjb25zdW1lKGZ1bmN0aW9uIChzZXJ2aWNlKSB7XG4gICAgaWYgKCFJU19QUk9EVUNUSU9OKSB7XG4gICAgICB2YXIgaXNMYXp5RW50aXR5ID0gaXNNYWNoaW5lKGVudGl0eSkgfHwgaXNGdW5jdGlvbihlbnRpdHkpO1xuICAgICAgd2FybighIXNlcnZpY2UgfHwgaXNMYXp5RW50aXR5LCBcIkF0dGVtcHRlZCB0byBzcGF3biBhbiBBY3RvciAoSUQ6IFxcXCJcIi5jb25jYXQoaXNNYWNoaW5lKGVudGl0eSkgPyBlbnRpdHkuaWQgOiAndW5kZWZpbmVkJywgXCJcXFwiKSBvdXRzaWRlIG9mIGEgc2VydmljZS4gVGhpcyB3aWxsIGhhdmUgbm8gZWZmZWN0LlwiKSk7XG4gICAgfVxuXG4gICAgaWYgKHNlcnZpY2UpIHtcbiAgICAgIHJldHVybiBzZXJ2aWNlLnNwYXduKGVudGl0eSwgcmVzb2x2ZWRPcHRpb25zLm5hbWUsIHJlc29sdmVkT3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjcmVhdGVEZWZlcnJlZEFjdG9yKGVudGl0eSwgcmVzb2x2ZWRPcHRpb25zLm5hbWUpO1xuICAgIH1cbiAgfSk7XG59XG4vKipcclxuICogQ3JlYXRlcyBhIG5ldyBJbnRlcnByZXRlciBpbnN0YW5jZSBmb3IgdGhlIGdpdmVuIG1hY2hpbmUgd2l0aCB0aGUgcHJvdmlkZWQgb3B0aW9ucywgaWYgYW55LlxyXG4gKlxyXG4gKiBAcGFyYW0gbWFjaGluZSBUaGUgbWFjaGluZSB0byBpbnRlcnByZXRcclxuICogQHBhcmFtIG9wdGlvbnMgSW50ZXJwcmV0ZXIgb3B0aW9uc1xyXG4gKi9cblxuZnVuY3Rpb24gaW50ZXJwcmV0KG1hY2hpbmUsIG9wdGlvbnMpIHtcbiAgdmFyIGludGVycHJldGVyID0gbmV3IEludGVycHJldGVyKG1hY2hpbmUsIG9wdGlvbnMpO1xuICByZXR1cm4gaW50ZXJwcmV0ZXI7XG59XG5cbmV4cG9ydCB7IEludGVycHJldGVyLCBJbnRlcnByZXRlclN0YXR1cywgaW50ZXJwcmV0LCBzcGF3biB9O1xuIiwiaW1wb3J0IHsgX19hc3NpZ24sIF9fcmVzdCB9IGZyb20gJy4vX3ZpcnR1YWwvX3RzbGliLmpzJztcbmltcG9ydCAnLi90eXBlcy5qcyc7XG5pbXBvcnQgeyBpbnZva2UgfSBmcm9tICcuL2FjdGlvblR5cGVzLmpzJztcbmltcG9ydCAnLi91dGlscy5qcyc7XG5pbXBvcnQgJy4vZW52aXJvbm1lbnQuanMnO1xuXG5mdW5jdGlvbiB0b0ludm9rZVNvdXJjZShzcmMpIHtcbiAgaWYgKHR5cGVvZiBzcmMgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFyIHNpbXBsZVNyYyA9IHtcbiAgICAgIHR5cGU6IHNyY1xuICAgIH07XG5cbiAgICBzaW1wbGVTcmMudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gc3JjO1xuICAgIH07IC8vIHY0IGNvbXBhdCAtIFRPRE86IHJlbW92ZSBpbiB2NVxuXG5cbiAgICByZXR1cm4gc2ltcGxlU3JjO1xuICB9XG5cbiAgcmV0dXJuIHNyYztcbn1cbmZ1bmN0aW9uIHRvSW52b2tlRGVmaW5pdGlvbihpbnZva2VDb25maWcpIHtcbiAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHtcbiAgICB0eXBlOiBpbnZva2VcbiAgfSwgaW52b2tlQ29uZmlnKSwge1xuICAgIHRvSlNPTjogZnVuY3Rpb24gKCkge1xuICAgICAgaW52b2tlQ29uZmlnLm9uRG9uZTtcbiAgICAgICAgICBpbnZva2VDb25maWcub25FcnJvcjtcbiAgICAgICAgICB2YXIgaW52b2tlRGVmID0gX19yZXN0KGludm9rZUNvbmZpZywgW1wib25Eb25lXCIsIFwib25FcnJvclwiXSk7XG5cbiAgICAgIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgaW52b2tlRGVmKSwge1xuICAgICAgICB0eXBlOiBpbnZva2UsXG4gICAgICAgIHNyYzogdG9JbnZva2VTb3VyY2UoaW52b2tlQ29uZmlnLnNyYylcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCB7IHRvSW52b2tlRGVmaW5pdGlvbiwgdG9JbnZva2VTb3VyY2UgfTtcbiIsInZhciBjaGlsZHJlbiA9IC8qI19fUFVSRV9fKi9uZXcgTWFwKCk7XG52YXIgc2Vzc2lvbklkSW5kZXggPSAwO1xudmFyIHJlZ2lzdHJ5ID0ge1xuICBib29rSWQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gXCJ4OlwiLmNvbmNhdChzZXNzaW9uSWRJbmRleCsrKTtcbiAgfSxcbiAgcmVnaXN0ZXI6IGZ1bmN0aW9uIChpZCwgYWN0b3IpIHtcbiAgICBjaGlsZHJlbi5zZXQoaWQsIGFjdG9yKTtcbiAgICByZXR1cm4gaWQ7XG4gIH0sXG4gIGdldDogZnVuY3Rpb24gKGlkKSB7XG4gICAgcmV0dXJuIGNoaWxkcmVuLmdldChpZCk7XG4gIH0sXG4gIGZyZWU6IGZ1bmN0aW9uIChpZCkge1xuICAgIGNoaWxkcmVuLmRlbGV0ZShpZCk7XG4gIH1cbn07XG5cbmV4cG9ydCB7IHJlZ2lzdHJ5IH07XG4iLCJpbXBvcnQgeyBfX2Fzc2lnbiB9IGZyb20gJy4vX3ZpcnR1YWwvX3RzbGliLmpzJztcblxudmFyIGRlZmF1bHRPcHRpb25zID0ge1xuICBkZWZlckV2ZW50czogZmFsc2Vcbn07XG5cbnZhciBTY2hlZHVsZXIgPVxuLyojX19QVVJFX18qL1xuXG4vKiogQGNsYXNzICovXG5mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFNjaGVkdWxlcihvcHRpb25zKSB7XG4gICAgdGhpcy5wcm9jZXNzaW5nRXZlbnQgPSBmYWxzZTtcbiAgICB0aGlzLnF1ZXVlID0gW107XG4gICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIHRoaXMub3B0aW9ucyA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCBkZWZhdWx0T3B0aW9ucyksIG9wdGlvbnMpO1xuICB9XG5cbiAgU2NoZWR1bGVyLnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG5cbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIGlmICghdGhpcy5vcHRpb25zLmRlZmVyRXZlbnRzKSB7XG4gICAgICAgIHRoaXMuc2NoZWR1bGUoY2FsbGJhY2spO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMucHJvY2VzcyhjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgdGhpcy5mbHVzaEV2ZW50cygpO1xuICB9O1xuXG4gIFNjaGVkdWxlci5wcm90b3R5cGUuc2NoZWR1bGUgPSBmdW5jdGlvbiAodGFzaykge1xuICAgIGlmICghdGhpcy5pbml0aWFsaXplZCB8fCB0aGlzLnByb2Nlc3NpbmdFdmVudCkge1xuICAgICAgdGhpcy5xdWV1ZS5wdXNoKHRhc2spO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnF1ZXVlLmxlbmd0aCAhPT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFdmVudCBxdWV1ZSBzaG91bGQgYmUgZW1wdHkgd2hlbiBpdCBpcyBub3QgcHJvY2Vzc2luZyBldmVudHMnKTtcbiAgICB9XG5cbiAgICB0aGlzLnByb2Nlc3ModGFzayk7XG4gICAgdGhpcy5mbHVzaEV2ZW50cygpO1xuICB9O1xuXG4gIFNjaGVkdWxlci5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5xdWV1ZSA9IFtdO1xuICB9O1xuXG4gIFNjaGVkdWxlci5wcm90b3R5cGUuZmx1c2hFdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG5leHRDYWxsYmFjayA9IHRoaXMucXVldWUuc2hpZnQoKTtcblxuICAgIHdoaWxlIChuZXh0Q2FsbGJhY2spIHtcbiAgICAgIHRoaXMucHJvY2VzcyhuZXh0Q2FsbGJhY2spO1xuICAgICAgbmV4dENhbGxiYWNrID0gdGhpcy5xdWV1ZS5zaGlmdCgpO1xuICAgIH1cbiAgfTtcblxuICBTY2hlZHVsZXIucHJvdG90eXBlLnByb2Nlc3MgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICB0aGlzLnByb2Nlc3NpbmdFdmVudCA9IHRydWU7XG5cbiAgICB0cnkge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyB0aGVyZSBpcyBubyB1c2UgdG8ga2VlcCB0aGUgZnV0dXJlIGV2ZW50c1xuICAgICAgLy8gYXMgdGhlIHNpdHVhdGlvbiBpcyBub3QgYW55bW9yZSB0aGUgc2FtZVxuICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgdGhyb3cgZTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5wcm9jZXNzaW5nRXZlbnQgPSBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIFNjaGVkdWxlcjtcbn0oKTtcblxuZXhwb3J0IHsgU2NoZWR1bGVyIH07XG4iLCIvKipcclxuICogTWFpbnRhaW5zIGEgc3RhY2sgb2YgdGhlIGN1cnJlbnQgc2VydmljZSBpbiBzY29wZS5cclxuICogVGhpcyBpcyB1c2VkIHRvIHByb3ZpZGUgdGhlIGNvcnJlY3Qgc2VydmljZSB0byBzcGF3bigpLlxyXG4gKi9cbnZhciBzZXJ2aWNlU3RhY2sgPSBbXTtcbnZhciBwcm92aWRlID0gZnVuY3Rpb24gKHNlcnZpY2UsIGZuKSB7XG4gIHNlcnZpY2VTdGFjay5wdXNoKHNlcnZpY2UpO1xuICB2YXIgcmVzdWx0ID0gZm4oc2VydmljZSk7XG4gIHNlcnZpY2VTdGFjay5wb3AoKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgY29uc3VtZSA9IGZ1bmN0aW9uIChmbikge1xuICByZXR1cm4gZm4oc2VydmljZVN0YWNrW3NlcnZpY2VTdGFjay5sZW5ndGggLSAxXSk7XG59O1xuXG5leHBvcnQgeyBjb25zdW1lLCBwcm92aWRlIH07XG4iLCJpbXBvcnQgeyBfX3ZhbHVlcywgX19zcHJlYWRBcnJheSwgX19yZWFkIH0gZnJvbSAnLi9fdmlydHVhbC9fdHNsaWIuanMnO1xuaW1wb3J0IHsgZmxhdHRlbiB9IGZyb20gJy4vdXRpbHMuanMnO1xuXG52YXIgaXNMZWFmTm9kZSA9IGZ1bmN0aW9uIChzdGF0ZU5vZGUpIHtcbiAgcmV0dXJuIHN0YXRlTm9kZS50eXBlID09PSAnYXRvbWljJyB8fCBzdGF0ZU5vZGUudHlwZSA9PT0gJ2ZpbmFsJztcbn07XG5mdW5jdGlvbiBnZXRBbGxDaGlsZHJlbihzdGF0ZU5vZGUpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHN0YXRlTm9kZS5zdGF0ZXMpLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIHN0YXRlTm9kZS5zdGF0ZXNba2V5XTtcbiAgfSk7XG59XG5mdW5jdGlvbiBnZXRDaGlsZHJlbihzdGF0ZU5vZGUpIHtcbiAgcmV0dXJuIGdldEFsbENoaWxkcmVuKHN0YXRlTm9kZSkuZmlsdGVyKGZ1bmN0aW9uIChzbikge1xuICAgIHJldHVybiBzbi50eXBlICE9PSAnaGlzdG9yeSc7XG4gIH0pO1xufVxuZnVuY3Rpb24gZ2V0QWxsU3RhdGVOb2RlcyhzdGF0ZU5vZGUpIHtcbiAgdmFyIHN0YXRlTm9kZXMgPSBbc3RhdGVOb2RlXTtcblxuICBpZiAoaXNMZWFmTm9kZShzdGF0ZU5vZGUpKSB7XG4gICAgcmV0dXJuIHN0YXRlTm9kZXM7XG4gIH1cblxuICByZXR1cm4gc3RhdGVOb2Rlcy5jb25jYXQoZmxhdHRlbihnZXRDaGlsZHJlbihzdGF0ZU5vZGUpLm1hcChnZXRBbGxTdGF0ZU5vZGVzKSkpO1xufVxuZnVuY3Rpb24gZ2V0Q29uZmlndXJhdGlvbihwcmV2U3RhdGVOb2Rlcywgc3RhdGVOb2Rlcykge1xuICB2YXIgZV8xLCBfYSwgZV8yLCBfYiwgZV8zLCBfYywgZV80LCBfZDtcblxuICB2YXIgcHJldkNvbmZpZ3VyYXRpb24gPSBuZXcgU2V0KHByZXZTdGF0ZU5vZGVzKTtcbiAgdmFyIHByZXZBZGpMaXN0ID0gZ2V0QWRqTGlzdChwcmV2Q29uZmlndXJhdGlvbik7XG4gIHZhciBjb25maWd1cmF0aW9uID0gbmV3IFNldChzdGF0ZU5vZGVzKTtcblxuICB0cnkge1xuICAgIC8vIGFkZCBhbGwgYW5jZXN0b3JzXG4gICAgZm9yICh2YXIgY29uZmlndXJhdGlvbl8xID0gX192YWx1ZXMoY29uZmlndXJhdGlvbiksIGNvbmZpZ3VyYXRpb25fMV8xID0gY29uZmlndXJhdGlvbl8xLm5leHQoKTsgIWNvbmZpZ3VyYXRpb25fMV8xLmRvbmU7IGNvbmZpZ3VyYXRpb25fMV8xID0gY29uZmlndXJhdGlvbl8xLm5leHQoKSkge1xuICAgICAgdmFyIHMgPSBjb25maWd1cmF0aW9uXzFfMS52YWx1ZTtcbiAgICAgIHZhciBtID0gcy5wYXJlbnQ7XG5cbiAgICAgIHdoaWxlIChtICYmICFjb25maWd1cmF0aW9uLmhhcyhtKSkge1xuICAgICAgICBjb25maWd1cmF0aW9uLmFkZChtKTtcbiAgICAgICAgbSA9IG0ucGFyZW50O1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZV8xXzEpIHtcbiAgICBlXzEgPSB7XG4gICAgICBlcnJvcjogZV8xXzFcbiAgICB9O1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoY29uZmlndXJhdGlvbl8xXzEgJiYgIWNvbmZpZ3VyYXRpb25fMV8xLmRvbmUgJiYgKF9hID0gY29uZmlndXJhdGlvbl8xLnJldHVybikpIF9hLmNhbGwoY29uZmlndXJhdGlvbl8xKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yO1xuICAgIH1cbiAgfVxuXG4gIHZhciBhZGpMaXN0ID0gZ2V0QWRqTGlzdChjb25maWd1cmF0aW9uKTtcblxuICB0cnkge1xuICAgIC8vIGFkZCBkZXNjZW5kYW50c1xuICAgIGZvciAodmFyIGNvbmZpZ3VyYXRpb25fMiA9IF9fdmFsdWVzKGNvbmZpZ3VyYXRpb24pLCBjb25maWd1cmF0aW9uXzJfMSA9IGNvbmZpZ3VyYXRpb25fMi5uZXh0KCk7ICFjb25maWd1cmF0aW9uXzJfMS5kb25lOyBjb25maWd1cmF0aW9uXzJfMSA9IGNvbmZpZ3VyYXRpb25fMi5uZXh0KCkpIHtcbiAgICAgIHZhciBzID0gY29uZmlndXJhdGlvbl8yXzEudmFsdWU7IC8vIGlmIHByZXZpb3VzbHkgYWN0aXZlLCBhZGQgZXhpc3RpbmcgY2hpbGQgbm9kZXNcblxuICAgICAgaWYgKHMudHlwZSA9PT0gJ2NvbXBvdW5kJyAmJiAoIWFkakxpc3QuZ2V0KHMpIHx8ICFhZGpMaXN0LmdldChzKS5sZW5ndGgpKSB7XG4gICAgICAgIGlmIChwcmV2QWRqTGlzdC5nZXQocykpIHtcbiAgICAgICAgICBwcmV2QWRqTGlzdC5nZXQocykuZm9yRWFjaChmdW5jdGlvbiAoc24pIHtcbiAgICAgICAgICAgIHJldHVybiBjb25maWd1cmF0aW9uLmFkZChzbik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcy5pbml0aWFsU3RhdGVOb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChzbikge1xuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZ3VyYXRpb24uYWRkKHNuKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHMudHlwZSA9PT0gJ3BhcmFsbGVsJykge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmb3IgKHZhciBfZSA9IChlXzMgPSB2b2lkIDAsIF9fdmFsdWVzKGdldENoaWxkcmVuKHMpKSksIF9mID0gX2UubmV4dCgpOyAhX2YuZG9uZTsgX2YgPSBfZS5uZXh0KCkpIHtcbiAgICAgICAgICAgICAgdmFyIGNoaWxkID0gX2YudmFsdWU7XG5cbiAgICAgICAgICAgICAgaWYgKCFjb25maWd1cmF0aW9uLmhhcyhjaGlsZCkpIHtcbiAgICAgICAgICAgICAgICBjb25maWd1cmF0aW9uLmFkZChjaGlsZCk7XG5cbiAgICAgICAgICAgICAgICBpZiAocHJldkFkakxpc3QuZ2V0KGNoaWxkKSkge1xuICAgICAgICAgICAgICAgICAgcHJldkFkakxpc3QuZ2V0KGNoaWxkKS5mb3JFYWNoKGZ1bmN0aW9uIChzbikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29uZmlndXJhdGlvbi5hZGQoc24pO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGNoaWxkLmluaXRpYWxTdGF0ZU5vZGVzLmZvckVhY2goZnVuY3Rpb24gKHNuKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb25maWd1cmF0aW9uLmFkZChzbik7XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChlXzNfMSkge1xuICAgICAgICAgICAgZV8zID0ge1xuICAgICAgICAgICAgICBlcnJvcjogZV8zXzFcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGlmIChfZiAmJiAhX2YuZG9uZSAmJiAoX2MgPSBfZS5yZXR1cm4pKSBfYy5jYWxsKF9lKTtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgIGlmIChlXzMpIHRocm93IGVfMy5lcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVfMl8xKSB7XG4gICAgZV8yID0ge1xuICAgICAgZXJyb3I6IGVfMl8xXG4gICAgfTtcbiAgfSBmaW5hbGx5IHtcbiAgICB0cnkge1xuICAgICAgaWYgKGNvbmZpZ3VyYXRpb25fMl8xICYmICFjb25maWd1cmF0aW9uXzJfMS5kb25lICYmIChfYiA9IGNvbmZpZ3VyYXRpb25fMi5yZXR1cm4pKSBfYi5jYWxsKGNvbmZpZ3VyYXRpb25fMik7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChlXzIpIHRocm93IGVfMi5lcnJvcjtcbiAgICB9XG4gIH1cblxuICB0cnkge1xuICAgIC8vIGFkZCBhbGwgYW5jZXN0b3JzXG4gICAgZm9yICh2YXIgY29uZmlndXJhdGlvbl8zID0gX192YWx1ZXMoY29uZmlndXJhdGlvbiksIGNvbmZpZ3VyYXRpb25fM18xID0gY29uZmlndXJhdGlvbl8zLm5leHQoKTsgIWNvbmZpZ3VyYXRpb25fM18xLmRvbmU7IGNvbmZpZ3VyYXRpb25fM18xID0gY29uZmlndXJhdGlvbl8zLm5leHQoKSkge1xuICAgICAgdmFyIHMgPSBjb25maWd1cmF0aW9uXzNfMS52YWx1ZTtcbiAgICAgIHZhciBtID0gcy5wYXJlbnQ7XG5cbiAgICAgIHdoaWxlIChtICYmICFjb25maWd1cmF0aW9uLmhhcyhtKSkge1xuICAgICAgICBjb25maWd1cmF0aW9uLmFkZChtKTtcbiAgICAgICAgbSA9IG0ucGFyZW50O1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZV80XzEpIHtcbiAgICBlXzQgPSB7XG4gICAgICBlcnJvcjogZV80XzFcbiAgICB9O1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoY29uZmlndXJhdGlvbl8zXzEgJiYgIWNvbmZpZ3VyYXRpb25fM18xLmRvbmUgJiYgKF9kID0gY29uZmlndXJhdGlvbl8zLnJldHVybikpIF9kLmNhbGwoY29uZmlndXJhdGlvbl8zKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKGVfNCkgdGhyb3cgZV80LmVycm9yO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjb25maWd1cmF0aW9uO1xufVxuXG5mdW5jdGlvbiBnZXRWYWx1ZUZyb21BZGooYmFzZU5vZGUsIGFkakxpc3QpIHtcbiAgdmFyIGNoaWxkU3RhdGVOb2RlcyA9IGFkakxpc3QuZ2V0KGJhc2VOb2RlKTtcblxuICBpZiAoIWNoaWxkU3RhdGVOb2Rlcykge1xuICAgIHJldHVybiB7fTsgLy8gdG9kbzogZml4P1xuICB9XG5cbiAgaWYgKGJhc2VOb2RlLnR5cGUgPT09ICdjb21wb3VuZCcpIHtcbiAgICB2YXIgY2hpbGRTdGF0ZU5vZGUgPSBjaGlsZFN0YXRlTm9kZXNbMF07XG5cbiAgICBpZiAoY2hpbGRTdGF0ZU5vZGUpIHtcbiAgICAgIGlmIChpc0xlYWZOb2RlKGNoaWxkU3RhdGVOb2RlKSkge1xuICAgICAgICByZXR1cm4gY2hpbGRTdGF0ZU5vZGUua2V5O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9XG5cbiAgdmFyIHN0YXRlVmFsdWUgPSB7fTtcbiAgY2hpbGRTdGF0ZU5vZGVzLmZvckVhY2goZnVuY3Rpb24gKGNzbikge1xuICAgIHN0YXRlVmFsdWVbY3NuLmtleV0gPSBnZXRWYWx1ZUZyb21BZGooY3NuLCBhZGpMaXN0KTtcbiAgfSk7XG4gIHJldHVybiBzdGF0ZVZhbHVlO1xufVxuXG5mdW5jdGlvbiBnZXRBZGpMaXN0KGNvbmZpZ3VyYXRpb24pIHtcbiAgdmFyIGVfNSwgX2E7XG5cbiAgdmFyIGFkakxpc3QgPSBuZXcgTWFwKCk7XG5cbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBjb25maWd1cmF0aW9uXzQgPSBfX3ZhbHVlcyhjb25maWd1cmF0aW9uKSwgY29uZmlndXJhdGlvbl80XzEgPSBjb25maWd1cmF0aW9uXzQubmV4dCgpOyAhY29uZmlndXJhdGlvbl80XzEuZG9uZTsgY29uZmlndXJhdGlvbl80XzEgPSBjb25maWd1cmF0aW9uXzQubmV4dCgpKSB7XG4gICAgICB2YXIgcyA9IGNvbmZpZ3VyYXRpb25fNF8xLnZhbHVlO1xuXG4gICAgICBpZiAoIWFkakxpc3QuaGFzKHMpKSB7XG4gICAgICAgIGFkakxpc3Quc2V0KHMsIFtdKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHMucGFyZW50KSB7XG4gICAgICAgIGlmICghYWRqTGlzdC5oYXMocy5wYXJlbnQpKSB7XG4gICAgICAgICAgYWRqTGlzdC5zZXQocy5wYXJlbnQsIFtdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkakxpc3QuZ2V0KHMucGFyZW50KS5wdXNoKHMpO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZV81XzEpIHtcbiAgICBlXzUgPSB7XG4gICAgICBlcnJvcjogZV81XzFcbiAgICB9O1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoY29uZmlndXJhdGlvbl80XzEgJiYgIWNvbmZpZ3VyYXRpb25fNF8xLmRvbmUgJiYgKF9hID0gY29uZmlndXJhdGlvbl80LnJldHVybikpIF9hLmNhbGwoY29uZmlndXJhdGlvbl80KTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKGVfNSkgdGhyb3cgZV81LmVycm9yO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhZGpMaXN0O1xufVxuZnVuY3Rpb24gZ2V0VmFsdWUocm9vdE5vZGUsIGNvbmZpZ3VyYXRpb24pIHtcbiAgdmFyIGNvbmZpZyA9IGdldENvbmZpZ3VyYXRpb24oW3Jvb3ROb2RlXSwgY29uZmlndXJhdGlvbik7XG4gIHJldHVybiBnZXRWYWx1ZUZyb21BZGoocm9vdE5vZGUsIGdldEFkakxpc3QoY29uZmlnKSk7XG59XG5mdW5jdGlvbiBoYXMoaXRlcmFibGUsIGl0ZW0pIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoaXRlcmFibGUpKSB7XG4gICAgcmV0dXJuIGl0ZXJhYmxlLnNvbWUoZnVuY3Rpb24gKG1lbWJlcikge1xuICAgICAgcmV0dXJuIG1lbWJlciA9PT0gaXRlbTtcbiAgICB9KTtcbiAgfVxuXG4gIGlmIChpdGVyYWJsZSBpbnN0YW5jZW9mIFNldCkge1xuICAgIHJldHVybiBpdGVyYWJsZS5oYXMoaXRlbSk7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7IC8vIFRPRE86IGZpeFxufVxuZnVuY3Rpb24gbmV4dEV2ZW50cyhjb25maWd1cmF0aW9uKSB7XG4gIHJldHVybiBfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQobmV3IFNldChmbGF0dGVuKF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZChjb25maWd1cmF0aW9uLm1hcChmdW5jdGlvbiAoc24pIHtcbiAgICByZXR1cm4gc24ub3duRXZlbnRzO1xuICB9KSksIGZhbHNlKSkpKSwgZmFsc2UpO1xufVxuZnVuY3Rpb24gaXNJbkZpbmFsU3RhdGUoY29uZmlndXJhdGlvbiwgc3RhdGVOb2RlKSB7XG4gIGlmIChzdGF0ZU5vZGUudHlwZSA9PT0gJ2NvbXBvdW5kJykge1xuICAgIHJldHVybiBnZXRDaGlsZHJlbihzdGF0ZU5vZGUpLnNvbWUoZnVuY3Rpb24gKHMpIHtcbiAgICAgIHJldHVybiBzLnR5cGUgPT09ICdmaW5hbCcgJiYgaGFzKGNvbmZpZ3VyYXRpb24sIHMpO1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKHN0YXRlTm9kZS50eXBlID09PSAncGFyYWxsZWwnKSB7XG4gICAgcmV0dXJuIGdldENoaWxkcmVuKHN0YXRlTm9kZSkuZXZlcnkoZnVuY3Rpb24gKHNuKSB7XG4gICAgICByZXR1cm4gaXNJbkZpbmFsU3RhdGUoY29uZmlndXJhdGlvbiwgc24pO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuZnVuY3Rpb24gZ2V0TWV0YShjb25maWd1cmF0aW9uKSB7XG4gIGlmIChjb25maWd1cmF0aW9uID09PSB2b2lkIDApIHtcbiAgICBjb25maWd1cmF0aW9uID0gW107XG4gIH1cblxuICByZXR1cm4gY29uZmlndXJhdGlvbi5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgc3RhdGVOb2RlKSB7XG4gICAgaWYgKHN0YXRlTm9kZS5tZXRhICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGFjY1tzdGF0ZU5vZGUuaWRdID0gc3RhdGVOb2RlLm1ldGE7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFjYztcbiAgfSwge30pO1xufVxuZnVuY3Rpb24gZ2V0VGFnc0Zyb21Db25maWd1cmF0aW9uKGNvbmZpZ3VyYXRpb24pIHtcbiAgcmV0dXJuIG5ldyBTZXQoZmxhdHRlbihjb25maWd1cmF0aW9uLm1hcChmdW5jdGlvbiAoc24pIHtcbiAgICByZXR1cm4gc24udGFncztcbiAgfSkpKTtcbn1cblxuZXhwb3J0IHsgZ2V0QWRqTGlzdCwgZ2V0QWxsQ2hpbGRyZW4sIGdldEFsbFN0YXRlTm9kZXMsIGdldENoaWxkcmVuLCBnZXRDb25maWd1cmF0aW9uLCBnZXRNZXRhLCBnZXRUYWdzRnJvbUNvbmZpZ3VyYXRpb24sIGdldFZhbHVlLCBoYXMsIGlzSW5GaW5hbFN0YXRlLCBpc0xlYWZOb2RlLCBuZXh0RXZlbnRzIH07XG4iLCJ2YXIgQWN0aW9uVHlwZXM7XG5cbihmdW5jdGlvbiAoQWN0aW9uVHlwZXMpIHtcbiAgQWN0aW9uVHlwZXNbXCJTdGFydFwiXSA9IFwieHN0YXRlLnN0YXJ0XCI7XG4gIEFjdGlvblR5cGVzW1wiU3RvcFwiXSA9IFwieHN0YXRlLnN0b3BcIjtcbiAgQWN0aW9uVHlwZXNbXCJSYWlzZVwiXSA9IFwieHN0YXRlLnJhaXNlXCI7XG4gIEFjdGlvblR5cGVzW1wiU2VuZFwiXSA9IFwieHN0YXRlLnNlbmRcIjtcbiAgQWN0aW9uVHlwZXNbXCJDYW5jZWxcIl0gPSBcInhzdGF0ZS5jYW5jZWxcIjtcbiAgQWN0aW9uVHlwZXNbXCJOdWxsRXZlbnRcIl0gPSBcIlwiO1xuICBBY3Rpb25UeXBlc1tcIkFzc2lnblwiXSA9IFwieHN0YXRlLmFzc2lnblwiO1xuICBBY3Rpb25UeXBlc1tcIkFmdGVyXCJdID0gXCJ4c3RhdGUuYWZ0ZXJcIjtcbiAgQWN0aW9uVHlwZXNbXCJEb25lU3RhdGVcIl0gPSBcImRvbmUuc3RhdGVcIjtcbiAgQWN0aW9uVHlwZXNbXCJEb25lSW52b2tlXCJdID0gXCJkb25lLmludm9rZVwiO1xuICBBY3Rpb25UeXBlc1tcIkxvZ1wiXSA9IFwieHN0YXRlLmxvZ1wiO1xuICBBY3Rpb25UeXBlc1tcIkluaXRcIl0gPSBcInhzdGF0ZS5pbml0XCI7XG4gIEFjdGlvblR5cGVzW1wiSW52b2tlXCJdID0gXCJ4c3RhdGUuaW52b2tlXCI7XG4gIEFjdGlvblR5cGVzW1wiRXJyb3JFeGVjdXRpb25cIl0gPSBcImVycm9yLmV4ZWN1dGlvblwiO1xuICBBY3Rpb25UeXBlc1tcIkVycm9yQ29tbXVuaWNhdGlvblwiXSA9IFwiZXJyb3IuY29tbXVuaWNhdGlvblwiO1xuICBBY3Rpb25UeXBlc1tcIkVycm9yUGxhdGZvcm1cIl0gPSBcImVycm9yLnBsYXRmb3JtXCI7XG4gIEFjdGlvblR5cGVzW1wiRXJyb3JDdXN0b21cIl0gPSBcInhzdGF0ZS5lcnJvclwiO1xuICBBY3Rpb25UeXBlc1tcIlVwZGF0ZVwiXSA9IFwieHN0YXRlLnVwZGF0ZVwiO1xuICBBY3Rpb25UeXBlc1tcIlB1cmVcIl0gPSBcInhzdGF0ZS5wdXJlXCI7XG4gIEFjdGlvblR5cGVzW1wiQ2hvb3NlXCJdID0gXCJ4c3RhdGUuY2hvb3NlXCI7XG59KShBY3Rpb25UeXBlcyB8fCAoQWN0aW9uVHlwZXMgPSB7fSkpO1xuXG52YXIgU3BlY2lhbFRhcmdldHM7XG5cbihmdW5jdGlvbiAoU3BlY2lhbFRhcmdldHMpIHtcbiAgU3BlY2lhbFRhcmdldHNbXCJQYXJlbnRcIl0gPSBcIiNfcGFyZW50XCI7XG4gIFNwZWNpYWxUYXJnZXRzW1wiSW50ZXJuYWxcIl0gPSBcIiNfaW50ZXJuYWxcIjtcbn0pKFNwZWNpYWxUYXJnZXRzIHx8IChTcGVjaWFsVGFyZ2V0cyA9IHt9KSk7XG5cbmV4cG9ydCB7IEFjdGlvblR5cGVzLCBTcGVjaWFsVGFyZ2V0cyB9O1xuIiwiaW1wb3J0IHsgX192YWx1ZXMsIF9fc3ByZWFkQXJyYXksIF9fcmVhZCwgX19hc3NpZ24gfSBmcm9tICcuL192aXJ0dWFsL190c2xpYi5qcyc7XG5pbXBvcnQgeyBTcGVjaWFsVGFyZ2V0cyB9IGZyb20gJy4vdHlwZXMuanMnO1xuaW1wb3J0IHsgcmFpc2UsIHNlbmQgfSBmcm9tICcuL2FjdGlvblR5cGVzLmpzJztcbmltcG9ydCB7IERFRkFVTFRfR1VBUkRfVFlQRSwgVEFSR0VUTEVTU19LRVksIFNUQVRFX0RFTElNSVRFUiB9IGZyb20gJy4vY29uc3RhbnRzLmpzJztcbmltcG9ydCB7IElTX1BST0RVQ1RJT04gfSBmcm9tICcuL2Vudmlyb25tZW50LmpzJztcblxudmFyIF9hO1xuZnVuY3Rpb24ga2V5cyh2YWx1ZSkge1xuICByZXR1cm4gT2JqZWN0LmtleXModmFsdWUpO1xufVxuZnVuY3Rpb24gbWF0Y2hlc1N0YXRlKHBhcmVudFN0YXRlSWQsIGNoaWxkU3RhdGVJZCwgZGVsaW1pdGVyKSB7XG4gIGlmIChkZWxpbWl0ZXIgPT09IHZvaWQgMCkge1xuICAgIGRlbGltaXRlciA9IFNUQVRFX0RFTElNSVRFUjtcbiAgfVxuXG4gIHZhciBwYXJlbnRTdGF0ZVZhbHVlID0gdG9TdGF0ZVZhbHVlKHBhcmVudFN0YXRlSWQsIGRlbGltaXRlcik7XG4gIHZhciBjaGlsZFN0YXRlVmFsdWUgPSB0b1N0YXRlVmFsdWUoY2hpbGRTdGF0ZUlkLCBkZWxpbWl0ZXIpO1xuXG4gIGlmIChpc1N0cmluZyhjaGlsZFN0YXRlVmFsdWUpKSB7XG4gICAgaWYgKGlzU3RyaW5nKHBhcmVudFN0YXRlVmFsdWUpKSB7XG4gICAgICByZXR1cm4gY2hpbGRTdGF0ZVZhbHVlID09PSBwYXJlbnRTdGF0ZVZhbHVlO1xuICAgIH0gLy8gUGFyZW50IG1vcmUgc3BlY2lmaWMgdGhhbiBjaGlsZFxuXG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoaXNTdHJpbmcocGFyZW50U3RhdGVWYWx1ZSkpIHtcbiAgICByZXR1cm4gcGFyZW50U3RhdGVWYWx1ZSBpbiBjaGlsZFN0YXRlVmFsdWU7XG4gIH1cblxuICByZXR1cm4gT2JqZWN0LmtleXMocGFyZW50U3RhdGVWYWx1ZSkuZXZlcnkoZnVuY3Rpb24gKGtleSkge1xuICAgIGlmICghKGtleSBpbiBjaGlsZFN0YXRlVmFsdWUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hdGNoZXNTdGF0ZShwYXJlbnRTdGF0ZVZhbHVlW2tleV0sIGNoaWxkU3RhdGVWYWx1ZVtrZXldKTtcbiAgfSk7XG59XG5mdW5jdGlvbiBnZXRFdmVudFR5cGUoZXZlbnQpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaXNTdHJpbmcoZXZlbnQpIHx8IHR5cGVvZiBldmVudCA9PT0gJ251bWJlcicgPyBcIlwiLmNvbmNhdChldmVudCkgOiBldmVudC50eXBlO1xuICB9IGNhdGNoIChlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFdmVudHMgbXVzdCBiZSBzdHJpbmdzIG9yIG9iamVjdHMgd2l0aCBhIHN0cmluZyBldmVudC50eXBlIHByb3BlcnR5LicpO1xuICB9XG59XG5mdW5jdGlvbiBnZXRBY3Rpb25UeXBlKGFjdGlvbikge1xuICB0cnkge1xuICAgIHJldHVybiBpc1N0cmluZyhhY3Rpb24pIHx8IHR5cGVvZiBhY3Rpb24gPT09ICdudW1iZXInID8gXCJcIi5jb25jYXQoYWN0aW9uKSA6IGlzRnVuY3Rpb24oYWN0aW9uKSA/IGFjdGlvbi5uYW1lIDogYWN0aW9uLnR5cGU7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0FjdGlvbnMgbXVzdCBiZSBzdHJpbmdzIG9yIG9iamVjdHMgd2l0aCBhIHN0cmluZyBhY3Rpb24udHlwZSBwcm9wZXJ0eS4nKTtcbiAgfVxufVxuZnVuY3Rpb24gdG9TdGF0ZVBhdGgoc3RhdGVJZCwgZGVsaW1pdGVyKSB7XG4gIHRyeSB7XG4gICAgaWYgKGlzQXJyYXkoc3RhdGVJZCkpIHtcbiAgICAgIHJldHVybiBzdGF0ZUlkO1xuICAgIH1cblxuICAgIHJldHVybiBzdGF0ZUlkLnRvU3RyaW5nKCkuc3BsaXQoZGVsaW1pdGVyKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIidcIi5jb25jYXQoc3RhdGVJZCwgXCInIGlzIG5vdCBhIHZhbGlkIHN0YXRlIHBhdGguXCIpKTtcbiAgfVxufVxuZnVuY3Rpb24gaXNTdGF0ZUxpa2Uoc3RhdGUpIHtcbiAgcmV0dXJuIHR5cGVvZiBzdGF0ZSA9PT0gJ29iamVjdCcgJiYgJ3ZhbHVlJyBpbiBzdGF0ZSAmJiAnY29udGV4dCcgaW4gc3RhdGUgJiYgJ2V2ZW50JyBpbiBzdGF0ZSAmJiAnX2V2ZW50JyBpbiBzdGF0ZTtcbn1cbmZ1bmN0aW9uIHRvU3RhdGVWYWx1ZShzdGF0ZVZhbHVlLCBkZWxpbWl0ZXIpIHtcbiAgaWYgKGlzU3RhdGVMaWtlKHN0YXRlVmFsdWUpKSB7XG4gICAgcmV0dXJuIHN0YXRlVmFsdWUudmFsdWU7XG4gIH1cblxuICBpZiAoaXNBcnJheShzdGF0ZVZhbHVlKSkge1xuICAgIHJldHVybiBwYXRoVG9TdGF0ZVZhbHVlKHN0YXRlVmFsdWUpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBzdGF0ZVZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBzdGF0ZVZhbHVlO1xuICB9XG5cbiAgdmFyIHN0YXRlUGF0aCA9IHRvU3RhdGVQYXRoKHN0YXRlVmFsdWUsIGRlbGltaXRlcik7XG4gIHJldHVybiBwYXRoVG9TdGF0ZVZhbHVlKHN0YXRlUGF0aCk7XG59XG5mdW5jdGlvbiBwYXRoVG9TdGF0ZVZhbHVlKHN0YXRlUGF0aCkge1xuICBpZiAoc3RhdGVQYXRoLmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBzdGF0ZVBhdGhbMF07XG4gIH1cblxuICB2YXIgdmFsdWUgPSB7fTtcbiAgdmFyIG1hcmtlciA9IHZhbHVlO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhdGVQYXRoLmxlbmd0aCAtIDE7IGkrKykge1xuICAgIGlmIChpID09PSBzdGF0ZVBhdGgubGVuZ3RoIC0gMikge1xuICAgICAgbWFya2VyW3N0YXRlUGF0aFtpXV0gPSBzdGF0ZVBhdGhbaSArIDFdO1xuICAgIH0gZWxzZSB7XG4gICAgICBtYXJrZXJbc3RhdGVQYXRoW2ldXSA9IHt9O1xuICAgICAgbWFya2VyID0gbWFya2VyW3N0YXRlUGF0aFtpXV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufVxuZnVuY3Rpb24gbWFwVmFsdWVzKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKSB7XG4gIHZhciByZXN1bHQgPSB7fTtcbiAgdmFyIGNvbGxlY3Rpb25LZXlzID0gT2JqZWN0LmtleXMoY29sbGVjdGlvbik7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb2xsZWN0aW9uS2V5cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBrZXkgPSBjb2xsZWN0aW9uS2V5c1tpXTtcbiAgICByZXN1bHRba2V5XSA9IGl0ZXJhdGVlKGNvbGxlY3Rpb25ba2V5XSwga2V5LCBjb2xsZWN0aW9uLCBpKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtYXBGaWx0ZXJWYWx1ZXMoY29sbGVjdGlvbiwgaXRlcmF0ZWUsIHByZWRpY2F0ZSkge1xuICB2YXIgZV8xLCBfYTtcblxuICB2YXIgcmVzdWx0ID0ge307XG5cbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBfYiA9IF9fdmFsdWVzKE9iamVjdC5rZXlzKGNvbGxlY3Rpb24pKSwgX2MgPSBfYi5uZXh0KCk7ICFfYy5kb25lOyBfYyA9IF9iLm5leHQoKSkge1xuICAgICAgdmFyIGtleSA9IF9jLnZhbHVlO1xuICAgICAgdmFyIGl0ZW0gPSBjb2xsZWN0aW9uW2tleV07XG5cbiAgICAgIGlmICghcHJlZGljYXRlKGl0ZW0pKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICByZXN1bHRba2V5XSA9IGl0ZXJhdGVlKGl0ZW0sIGtleSwgY29sbGVjdGlvbik7XG4gICAgfVxuICB9IGNhdGNoIChlXzFfMSkge1xuICAgIGVfMSA9IHtcbiAgICAgIGVycm9yOiBlXzFfMVxuICAgIH07XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChfYyAmJiAhX2MuZG9uZSAmJiAoX2EgPSBfYi5yZXR1cm4pKSBfYS5jYWxsKF9iKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKGVfMSkgdGhyb3cgZV8xLmVycm9yO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG4vKipcclxuICogUmV0cmlldmVzIGEgdmFsdWUgYXQgdGhlIGdpdmVuIHBhdGguXHJcbiAqIEBwYXJhbSBwcm9wcyBUaGUgZGVlcCBwYXRoIHRvIHRoZSBwcm9wIG9mIHRoZSBkZXNpcmVkIHZhbHVlXHJcbiAqL1xuXG52YXIgcGF0aCA9IGZ1bmN0aW9uIChwcm9wcykge1xuICByZXR1cm4gZnVuY3Rpb24gKG9iamVjdCkge1xuICAgIHZhciBlXzIsIF9hO1xuXG4gICAgdmFyIHJlc3VsdCA9IG9iamVjdDtcblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBwcm9wc18xID0gX192YWx1ZXMocHJvcHMpLCBwcm9wc18xXzEgPSBwcm9wc18xLm5leHQoKTsgIXByb3BzXzFfMS5kb25lOyBwcm9wc18xXzEgPSBwcm9wc18xLm5leHQoKSkge1xuICAgICAgICB2YXIgcHJvcCA9IHByb3BzXzFfMS52YWx1ZTtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0W3Byb3BdO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfMl8xKSB7XG4gICAgICBlXzIgPSB7XG4gICAgICAgIGVycm9yOiBlXzJfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHByb3BzXzFfMSAmJiAhcHJvcHNfMV8xLmRvbmUgJiYgKF9hID0gcHJvcHNfMS5yZXR1cm4pKSBfYS5jYWxsKHByb3BzXzEpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfMikgdGhyb3cgZV8yLmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59O1xuLyoqXHJcbiAqIFJldHJpZXZlcyBhIHZhbHVlIGF0IHRoZSBnaXZlbiBwYXRoIHZpYSB0aGUgbmVzdGVkIGFjY2Vzc29yIHByb3AuXHJcbiAqIEBwYXJhbSBwcm9wcyBUaGUgZGVlcCBwYXRoIHRvIHRoZSBwcm9wIG9mIHRoZSBkZXNpcmVkIHZhbHVlXHJcbiAqL1xuXG5mdW5jdGlvbiBuZXN0ZWRQYXRoKHByb3BzLCBhY2Nlc3NvclByb3ApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgICB2YXIgZV8zLCBfYTtcblxuICAgIHZhciByZXN1bHQgPSBvYmplY3Q7XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgcHJvcHNfMiA9IF9fdmFsdWVzKHByb3BzKSwgcHJvcHNfMl8xID0gcHJvcHNfMi5uZXh0KCk7ICFwcm9wc18yXzEuZG9uZTsgcHJvcHNfMl8xID0gcHJvcHNfMi5uZXh0KCkpIHtcbiAgICAgICAgdmFyIHByb3AgPSBwcm9wc18yXzEudmFsdWU7XG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdFthY2Nlc3NvclByb3BdW3Byb3BdO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVfM18xKSB7XG4gICAgICBlXzMgPSB7XG4gICAgICAgIGVycm9yOiBlXzNfMVxuICAgICAgfTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHByb3BzXzJfMSAmJiAhcHJvcHNfMl8xLmRvbmUgJiYgKF9hID0gcHJvcHNfMi5yZXR1cm4pKSBfYS5jYWxsKHByb3BzXzIpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKGVfMykgdGhyb3cgZV8zLmVycm9yO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5mdW5jdGlvbiB0b1N0YXRlUGF0aHMoc3RhdGVWYWx1ZSkge1xuICBpZiAoIXN0YXRlVmFsdWUpIHtcbiAgICByZXR1cm4gW1tdXTtcbiAgfVxuXG4gIGlmIChpc1N0cmluZyhzdGF0ZVZhbHVlKSkge1xuICAgIHJldHVybiBbW3N0YXRlVmFsdWVdXTtcbiAgfVxuXG4gIHZhciByZXN1bHQgPSBmbGF0dGVuKE9iamVjdC5rZXlzKHN0YXRlVmFsdWUpLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgdmFyIHN1YlN0YXRlVmFsdWUgPSBzdGF0ZVZhbHVlW2tleV07XG5cbiAgICBpZiAodHlwZW9mIHN1YlN0YXRlVmFsdWUgIT09ICdzdHJpbmcnICYmICghc3ViU3RhdGVWYWx1ZSB8fCAhT2JqZWN0LmtleXMoc3ViU3RhdGVWYWx1ZSkubGVuZ3RoKSkge1xuICAgICAgcmV0dXJuIFtba2V5XV07XG4gICAgfVxuXG4gICAgcmV0dXJuIHRvU3RhdGVQYXRocyhzdGF0ZVZhbHVlW2tleV0pLm1hcChmdW5jdGlvbiAoc3ViUGF0aCkge1xuICAgICAgcmV0dXJuIFtrZXldLmNvbmNhdChzdWJQYXRoKTtcbiAgICB9KTtcbiAgfSkpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gcGF0aHNUb1N0YXRlVmFsdWUocGF0aHMpIHtcbiAgdmFyIGVfNCwgX2E7XG5cbiAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gIGlmIChwYXRocyAmJiBwYXRocy5sZW5ndGggPT09IDEgJiYgcGF0aHNbMF0ubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIHBhdGhzWzBdWzBdO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBwYXRoc18xID0gX192YWx1ZXMocGF0aHMpLCBwYXRoc18xXzEgPSBwYXRoc18xLm5leHQoKTsgIXBhdGhzXzFfMS5kb25lOyBwYXRoc18xXzEgPSBwYXRoc18xLm5leHQoKSkge1xuICAgICAgdmFyIGN1cnJlbnRQYXRoID0gcGF0aHNfMV8xLnZhbHVlO1xuICAgICAgdmFyIG1hcmtlciA9IHJlc3VsdDsgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnByZWZlci1mb3Itb2ZcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjdXJyZW50UGF0aC5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgc3ViUGF0aCA9IGN1cnJlbnRQYXRoW2ldO1xuXG4gICAgICAgIGlmIChpID09PSBjdXJyZW50UGF0aC5sZW5ndGggLSAyKSB7XG4gICAgICAgICAgbWFya2VyW3N1YlBhdGhdID0gY3VycmVudFBhdGhbaSArIDFdO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgbWFya2VyW3N1YlBhdGhdID0gbWFya2VyW3N1YlBhdGhdIHx8IHt9O1xuICAgICAgICBtYXJrZXIgPSBtYXJrZXJbc3ViUGF0aF07XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlXzRfMSkge1xuICAgIGVfNCA9IHtcbiAgICAgIGVycm9yOiBlXzRfMVxuICAgIH07XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChwYXRoc18xXzEgJiYgIXBhdGhzXzFfMS5kb25lICYmIChfYSA9IHBhdGhzXzEucmV0dXJuKSkgX2EuY2FsbChwYXRoc18xKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKGVfNCkgdGhyb3cgZV80LmVycm9yO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBmbGF0dGVuKGFycmF5KSB7XG4gIHZhciBfYTtcblxuICByZXR1cm4gKF9hID0gW10pLmNvbmNhdC5hcHBseShfYSwgX19zcHJlYWRBcnJheShbXSwgX19yZWFkKGFycmF5KSwgZmFsc2UpKTtcbn1cbmZ1bmN0aW9uIHRvQXJyYXlTdHJpY3QodmFsdWUpIHtcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIFt2YWx1ZV07XG59XG5mdW5jdGlvbiB0b0FycmF5KHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgcmV0dXJuIHRvQXJyYXlTdHJpY3QodmFsdWUpO1xufVxuZnVuY3Rpb24gbWFwQ29udGV4dChtYXBwZXIsIGNvbnRleHQsIF9ldmVudCkge1xuICB2YXIgZV81LCBfYTtcblxuICBpZiAoaXNGdW5jdGlvbihtYXBwZXIpKSB7XG4gICAgcmV0dXJuIG1hcHBlcihjb250ZXh0LCBfZXZlbnQuZGF0YSk7XG4gIH1cblxuICB2YXIgcmVzdWx0ID0ge307XG5cbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBfYiA9IF9fdmFsdWVzKE9iamVjdC5rZXlzKG1hcHBlcikpLCBfYyA9IF9iLm5leHQoKTsgIV9jLmRvbmU7IF9jID0gX2IubmV4dCgpKSB7XG4gICAgICB2YXIga2V5ID0gX2MudmFsdWU7XG4gICAgICB2YXIgc3ViTWFwcGVyID0gbWFwcGVyW2tleV07XG5cbiAgICAgIGlmIChpc0Z1bmN0aW9uKHN1Yk1hcHBlcikpIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSBzdWJNYXBwZXIoY29udGV4dCwgX2V2ZW50LmRhdGEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSBzdWJNYXBwZXI7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlXzVfMSkge1xuICAgIGVfNSA9IHtcbiAgICAgIGVycm9yOiBlXzVfMVxuICAgIH07XG4gIH0gZmluYWxseSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChfYyAmJiAhX2MuZG9uZSAmJiAoX2EgPSBfYi5yZXR1cm4pKSBfYS5jYWxsKF9iKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKGVfNSkgdGhyb3cgZV81LmVycm9yO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBpc0J1aWx0SW5FdmVudChldmVudFR5cGUpIHtcbiAgcmV0dXJuIC9eKGRvbmV8ZXJyb3IpXFwuLy50ZXN0KGV2ZW50VHlwZSk7XG59XG5mdW5jdGlvbiBpc1Byb21pc2VMaWtlKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSAvLyBDaGVjayBpZiBzaGFwZSBtYXRjaGVzIHRoZSBQcm9taXNlL0ErIHNwZWNpZmljYXRpb24gZm9yIGEgXCJ0aGVuYWJsZVwiLlxuXG5cbiAgaWYgKHZhbHVlICE9PSBudWxsICYmIChpc0Z1bmN0aW9uKHZhbHVlKSB8fCB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSAmJiBpc0Z1bmN0aW9uKHZhbHVlLnRoZW4pKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5mdW5jdGlvbiBpc0JlaGF2aW9yKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmICd0cmFuc2l0aW9uJyBpbiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUudHJhbnNpdGlvbiA9PT0gJ2Z1bmN0aW9uJztcbn1cbmZ1bmN0aW9uIHBhcnRpdGlvbihpdGVtcywgcHJlZGljYXRlKSB7XG4gIHZhciBlXzYsIF9hO1xuXG4gIHZhciBfYiA9IF9fcmVhZChbW10sIFtdXSwgMiksXG4gICAgICB0cnV0aHkgPSBfYlswXSxcbiAgICAgIGZhbHN5ID0gX2JbMV07XG5cbiAgdHJ5IHtcbiAgICBmb3IgKHZhciBpdGVtc18xID0gX192YWx1ZXMoaXRlbXMpLCBpdGVtc18xXzEgPSBpdGVtc18xLm5leHQoKTsgIWl0ZW1zXzFfMS5kb25lOyBpdGVtc18xXzEgPSBpdGVtc18xLm5leHQoKSkge1xuICAgICAgdmFyIGl0ZW0gPSBpdGVtc18xXzEudmFsdWU7XG5cbiAgICAgIGlmIChwcmVkaWNhdGUoaXRlbSkpIHtcbiAgICAgICAgdHJ1dGh5LnB1c2goaXRlbSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmYWxzeS5wdXNoKGl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZV82XzEpIHtcbiAgICBlXzYgPSB7XG4gICAgICBlcnJvcjogZV82XzFcbiAgICB9O1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoaXRlbXNfMV8xICYmICFpdGVtc18xXzEuZG9uZSAmJiAoX2EgPSBpdGVtc18xLnJldHVybikpIF9hLmNhbGwoaXRlbXNfMSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChlXzYpIHRocm93IGVfNi5lcnJvcjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gW3RydXRoeSwgZmFsc3ldO1xufVxuZnVuY3Rpb24gdXBkYXRlSGlzdG9yeVN0YXRlcyhoaXN0LCBzdGF0ZVZhbHVlKSB7XG4gIHJldHVybiBtYXBWYWx1ZXMoaGlzdC5zdGF0ZXMsIGZ1bmN0aW9uIChzdWJIaXN0LCBrZXkpIHtcbiAgICBpZiAoIXN1Ykhpc3QpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgdmFyIHN1YlN0YXRlVmFsdWUgPSAoaXNTdHJpbmcoc3RhdGVWYWx1ZSkgPyB1bmRlZmluZWQgOiBzdGF0ZVZhbHVlW2tleV0pIHx8IChzdWJIaXN0ID8gc3ViSGlzdC5jdXJyZW50IDogdW5kZWZpbmVkKTtcblxuICAgIGlmICghc3ViU3RhdGVWYWx1ZSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgY3VycmVudDogc3ViU3RhdGVWYWx1ZSxcbiAgICAgIHN0YXRlczogdXBkYXRlSGlzdG9yeVN0YXRlcyhzdWJIaXN0LCBzdWJTdGF0ZVZhbHVlKVxuICAgIH07XG4gIH0pO1xufVxuZnVuY3Rpb24gdXBkYXRlSGlzdG9yeVZhbHVlKGhpc3QsIHN0YXRlVmFsdWUpIHtcbiAgcmV0dXJuIHtcbiAgICBjdXJyZW50OiBzdGF0ZVZhbHVlLFxuICAgIHN0YXRlczogdXBkYXRlSGlzdG9yeVN0YXRlcyhoaXN0LCBzdGF0ZVZhbHVlKVxuICB9O1xufVxuZnVuY3Rpb24gdXBkYXRlQ29udGV4dChjb250ZXh0LCBfZXZlbnQsIGFzc2lnbkFjdGlvbnMsIHN0YXRlKSB7XG4gIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgIHdhcm4oISFjb250ZXh0LCAnQXR0ZW1wdGluZyB0byB1cGRhdGUgdW5kZWZpbmVkIGNvbnRleHQnKTtcbiAgfVxuXG4gIHZhciB1cGRhdGVkQ29udGV4dCA9IGNvbnRleHQgPyBhc3NpZ25BY3Rpb25zLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBhc3NpZ25BY3Rpb24pIHtcbiAgICB2YXIgZV83LCBfYTtcblxuICAgIHZhciBhc3NpZ25tZW50ID0gYXNzaWduQWN0aW9uLmFzc2lnbm1lbnQ7XG4gICAgdmFyIG1ldGEgPSB7XG4gICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICBhY3Rpb246IGFzc2lnbkFjdGlvbixcbiAgICAgIF9ldmVudDogX2V2ZW50XG4gICAgfTtcbiAgICB2YXIgcGFydGlhbFVwZGF0ZSA9IHt9O1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oYXNzaWdubWVudCkpIHtcbiAgICAgIHBhcnRpYWxVcGRhdGUgPSBhc3NpZ25tZW50KGFjYywgX2V2ZW50LmRhdGEsIG1ldGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKHZhciBfYiA9IF9fdmFsdWVzKE9iamVjdC5rZXlzKGFzc2lnbm1lbnQpKSwgX2MgPSBfYi5uZXh0KCk7ICFfYy5kb25lOyBfYyA9IF9iLm5leHQoKSkge1xuICAgICAgICAgIHZhciBrZXkgPSBfYy52YWx1ZTtcbiAgICAgICAgICB2YXIgcHJvcEFzc2lnbm1lbnQgPSBhc3NpZ25tZW50W2tleV07XG4gICAgICAgICAgcGFydGlhbFVwZGF0ZVtrZXldID0gaXNGdW5jdGlvbihwcm9wQXNzaWdubWVudCkgPyBwcm9wQXNzaWdubWVudChhY2MsIF9ldmVudC5kYXRhLCBtZXRhKSA6IHByb3BBc3NpZ25tZW50O1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlXzdfMSkge1xuICAgICAgICBlXzcgPSB7XG4gICAgICAgICAgZXJyb3I6IGVfN18xXG4gICAgICAgIH07XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChfYyAmJiAhX2MuZG9uZSAmJiAoX2EgPSBfYi5yZXR1cm4pKSBfYS5jYWxsKF9iKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBpZiAoZV83KSB0aHJvdyBlXzcuZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgYWNjLCBwYXJ0aWFsVXBkYXRlKTtcbiAgfSwgY29udGV4dCkgOiBjb250ZXh0O1xuICByZXR1cm4gdXBkYXRlZENvbnRleHQ7XG59IC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1lbXB0eVxuXG52YXIgd2FybiA9IGZ1bmN0aW9uICgpIHt9O1xuXG5pZiAoIUlTX1BST0RVQ1RJT04pIHtcbiAgd2FybiA9IGZ1bmN0aW9uIChjb25kaXRpb24sIG1lc3NhZ2UpIHtcbiAgICB2YXIgZXJyb3IgPSBjb25kaXRpb24gaW5zdGFuY2VvZiBFcnJvciA/IGNvbmRpdGlvbiA6IHVuZGVmaW5lZDtcblxuICAgIGlmICghZXJyb3IgJiYgY29uZGl0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGNvbnNvbGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIGFyZ3MgPSBbXCJXYXJuaW5nOiBcIi5jb25jYXQobWVzc2FnZSldO1xuXG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgYXJncy5wdXNoKGVycm9yKTtcbiAgICAgIH0gLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWNvbnNvbGVcblxuXG4gICAgICBjb25zb2xlLndhcm4uYXBwbHkoY29uc29sZSwgYXJncyk7XG4gICAgfVxuICB9O1xufVxuZnVuY3Rpb24gaXNBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWx1ZSk7XG59IC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpiYW4tdHlwZXNcblxuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nO1xufVxuZnVuY3Rpb24gaXNTdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZyc7XG59XG5mdW5jdGlvbiB0b0d1YXJkKGNvbmRpdGlvbiwgZ3VhcmRNYXApIHtcbiAgaWYgKCFjb25kaXRpb24pIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgaWYgKGlzU3RyaW5nKGNvbmRpdGlvbikpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogREVGQVVMVF9HVUFSRF9UWVBFLFxuICAgICAgbmFtZTogY29uZGl0aW9uLFxuICAgICAgcHJlZGljYXRlOiBndWFyZE1hcCA/IGd1YXJkTWFwW2NvbmRpdGlvbl0gOiB1bmRlZmluZWRcbiAgICB9O1xuICB9XG5cbiAgaWYgKGlzRnVuY3Rpb24oY29uZGl0aW9uKSkge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiBERUZBVUxUX0dVQVJEX1RZUEUsXG4gICAgICBuYW1lOiBjb25kaXRpb24ubmFtZSxcbiAgICAgIHByZWRpY2F0ZTogY29uZGl0aW9uXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBjb25kaXRpb247XG59XG5mdW5jdGlvbiBpc09ic2VydmFibGUodmFsdWUpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gJ3N1YnNjcmliZScgaW4gdmFsdWUgJiYgaXNGdW5jdGlvbih2YWx1ZS5zdWJzY3JpYmUpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG52YXIgc3ltYm9sT2JzZXJ2YWJsZSA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5vYnNlcnZhYmxlIHx8ICdAQG9ic2VydmFibGUnO1xufSgpOyAvLyBUT0RPOiB0byBiZSByZW1vdmVkIGluIHY1LCBsZWZ0IGl0IG91dCBqdXN0IHRvIG1pbmltaXplIHRoZSBzY29wZSBvZiB0aGUgY2hhbmdlIGFuZCBtYWludGFpbiBjb21wYXRpYmlsaXR5IHdpdGggb2xkZXIgdmVyc2lvbnMgb2YgaW50ZWdyYXRpb24gcGFhY2thZ2VzXG5cbnZhciBpbnRlcm9wU3ltYm9scyA9IChfYSA9IHt9LCBfYVtzeW1ib2xPYnNlcnZhYmxlXSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXM7XG59LCBfYVtTeW1ib2wub2JzZXJ2YWJsZV0gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzO1xufSwgX2EpO1xuZnVuY3Rpb24gaXNNYWNoaW5lKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmICdfX3hzdGF0ZW5vZGUnIGluIHZhbHVlO1xufVxuZnVuY3Rpb24gaXNBY3Rvcih2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUuc2VuZCA9PT0gJ2Z1bmN0aW9uJztcbn1cbnZhciB1bmlxdWVJZCA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIHZhciBjdXJyZW50SWQgPSAwO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGN1cnJlbnRJZCsrO1xuICAgIHJldHVybiBjdXJyZW50SWQudG9TdHJpbmcoMTYpO1xuICB9O1xufSgpO1xuZnVuY3Rpb24gdG9FdmVudE9iamVjdChldmVudCwgcGF5bG9hZCAvLyBpZD86IFRFdmVudFsndHlwZSddXG4pIHtcbiAgaWYgKGlzU3RyaW5nKGV2ZW50KSB8fCB0eXBlb2YgZXZlbnQgPT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIF9fYXNzaWduKHtcbiAgICAgIHR5cGU6IGV2ZW50XG4gICAgfSwgcGF5bG9hZCk7XG4gIH1cblxuICByZXR1cm4gZXZlbnQ7XG59XG5mdW5jdGlvbiB0b1NDWE1MRXZlbnQoZXZlbnQsIHNjeG1sRXZlbnQpIHtcbiAgaWYgKCFpc1N0cmluZyhldmVudCkgJiYgJyQkdHlwZScgaW4gZXZlbnQgJiYgZXZlbnQuJCR0eXBlID09PSAnc2N4bWwnKSB7XG4gICAgcmV0dXJuIGV2ZW50O1xuICB9XG5cbiAgdmFyIGV2ZW50T2JqZWN0ID0gdG9FdmVudE9iamVjdChldmVudCk7XG4gIHJldHVybiBfX2Fzc2lnbih7XG4gICAgbmFtZTogZXZlbnRPYmplY3QudHlwZSxcbiAgICBkYXRhOiBldmVudE9iamVjdCxcbiAgICAkJHR5cGU6ICdzY3htbCcsXG4gICAgdHlwZTogJ2V4dGVybmFsJ1xuICB9LCBzY3htbEV2ZW50KTtcbn1cbmZ1bmN0aW9uIHRvVHJhbnNpdGlvbkNvbmZpZ0FycmF5KGV2ZW50LCBjb25maWdMaWtlKSB7XG4gIHZhciB0cmFuc2l0aW9ucyA9IHRvQXJyYXlTdHJpY3QoY29uZmlnTGlrZSkubWFwKGZ1bmN0aW9uICh0cmFuc2l0aW9uTGlrZSkge1xuICAgIGlmICh0eXBlb2YgdHJhbnNpdGlvbkxpa2UgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiB0cmFuc2l0aW9uTGlrZSA9PT0gJ3N0cmluZycgfHwgaXNNYWNoaW5lKHRyYW5zaXRpb25MaWtlKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGFyZ2V0OiB0cmFuc2l0aW9uTGlrZSxcbiAgICAgICAgZXZlbnQ6IGV2ZW50XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgdHJhbnNpdGlvbkxpa2UpLCB7XG4gICAgICBldmVudDogZXZlbnRcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiB0cmFuc2l0aW9ucztcbn1cbmZ1bmN0aW9uIG5vcm1hbGl6ZVRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHRhcmdldCA9PT0gdW5kZWZpbmVkIHx8IHRhcmdldCA9PT0gVEFSR0VUTEVTU19LRVkpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcmV0dXJuIHRvQXJyYXkodGFyZ2V0KTtcbn1cbmZ1bmN0aW9uIHJlcG9ydFVuaGFuZGxlZEV4Y2VwdGlvbk9uSW52b2NhdGlvbihvcmlnaW5hbEVycm9yLCBjdXJyZW50RXJyb3IsIGlkKSB7XG4gIGlmICghSVNfUFJPRFVDVElPTikge1xuICAgIHZhciBvcmlnaW5hbFN0YWNrVHJhY2UgPSBvcmlnaW5hbEVycm9yLnN0YWNrID8gXCIgU3RhY2t0cmFjZSB3YXMgJ1wiLmNvbmNhdChvcmlnaW5hbEVycm9yLnN0YWNrLCBcIidcIikgOiAnJztcblxuICAgIGlmIChvcmlnaW5hbEVycm9yID09PSBjdXJyZW50RXJyb3IpIHtcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1jb25zb2xlXG4gICAgICBjb25zb2xlLmVycm9yKFwiTWlzc2luZyBvbkVycm9yIGhhbmRsZXIgZm9yIGludm9jYXRpb24gJ1wiLmNvbmNhdChpZCwgXCInLCBlcnJvciB3YXMgJ1wiKS5jb25jYXQob3JpZ2luYWxFcnJvciwgXCInLlwiKS5jb25jYXQob3JpZ2luYWxTdGFja1RyYWNlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBzdGFja1RyYWNlID0gY3VycmVudEVycm9yLnN0YWNrID8gXCIgU3RhY2t0cmFjZSB3YXMgJ1wiLmNvbmNhdChjdXJyZW50RXJyb3Iuc3RhY2ssIFwiJ1wiKSA6ICcnOyAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tY29uc29sZVxuXG4gICAgICBjb25zb2xlLmVycm9yKFwiTWlzc2luZyBvbkVycm9yIGhhbmRsZXIgYW5kL29yIHVuaGFuZGxlZCBleGNlcHRpb24vcHJvbWlzZSByZWplY3Rpb24gZm9yIGludm9jYXRpb24gJ1wiLmNvbmNhdChpZCwgXCInLiBcIikgKyBcIk9yaWdpbmFsIGVycm9yOiAnXCIuY29uY2F0KG9yaWdpbmFsRXJyb3IsIFwiJy4gXCIpLmNvbmNhdChvcmlnaW5hbFN0YWNrVHJhY2UsIFwiIEN1cnJlbnQgZXJyb3IgaXMgJ1wiKS5jb25jYXQoY3VycmVudEVycm9yLCBcIicuXCIpLmNvbmNhdChzdGFja1RyYWNlKSk7XG4gICAgfVxuICB9XG59XG5mdW5jdGlvbiBldmFsdWF0ZUd1YXJkKG1hY2hpbmUsIGd1YXJkLCBjb250ZXh0LCBfZXZlbnQsIHN0YXRlKSB7XG4gIHZhciBndWFyZHMgPSBtYWNoaW5lLm9wdGlvbnMuZ3VhcmRzO1xuICB2YXIgZ3VhcmRNZXRhID0ge1xuICAgIHN0YXRlOiBzdGF0ZSxcbiAgICBjb25kOiBndWFyZCxcbiAgICBfZXZlbnQ6IF9ldmVudFxuICB9OyAvLyBUT0RPOiBkbyBub3QgaGFyZGNvZGUhXG5cbiAgaWYgKGd1YXJkLnR5cGUgPT09IERFRkFVTFRfR1VBUkRfVFlQRSkge1xuICAgIHJldHVybiAoKGd1YXJkcyA9PT0gbnVsbCB8fCBndWFyZHMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGd1YXJkc1tndWFyZC5uYW1lXSkgfHwgZ3VhcmQucHJlZGljYXRlKShjb250ZXh0LCBfZXZlbnQuZGF0YSwgZ3VhcmRNZXRhKTtcbiAgfVxuXG4gIHZhciBjb25kRm4gPSBndWFyZHMgPT09IG51bGwgfHwgZ3VhcmRzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBndWFyZHNbZ3VhcmQudHlwZV07XG5cbiAgaWYgKCFjb25kRm4pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJHdWFyZCAnXCIuY29uY2F0KGd1YXJkLnR5cGUsIFwiJyBpcyBub3QgaW1wbGVtZW50ZWQgb24gbWFjaGluZSAnXCIpLmNvbmNhdChtYWNoaW5lLmlkLCBcIicuXCIpKTtcbiAgfVxuXG4gIHJldHVybiBjb25kRm4oY29udGV4dCwgX2V2ZW50LmRhdGEsIGd1YXJkTWV0YSk7XG59XG5mdW5jdGlvbiB0b0ludm9rZVNvdXJjZShzcmMpIHtcbiAgaWYgKHR5cGVvZiBzcmMgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6IHNyY1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gc3JjO1xufVxuZnVuY3Rpb24gdG9PYnNlcnZlcihuZXh0SGFuZGxlciwgZXJyb3JIYW5kbGVyLCBjb21wbGV0aW9uSGFuZGxlcikge1xuICB2YXIgbm9vcCA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gIHZhciBpc09ic2VydmVyID0gdHlwZW9mIG5leHRIYW5kbGVyID09PSAnb2JqZWN0JztcbiAgdmFyIHNlbGYgPSBpc09ic2VydmVyID8gbmV4dEhhbmRsZXIgOiBudWxsO1xuICByZXR1cm4ge1xuICAgIG5leHQ6ICgoaXNPYnNlcnZlciA/IG5leHRIYW5kbGVyLm5leHQgOiBuZXh0SGFuZGxlcikgfHwgbm9vcCkuYmluZChzZWxmKSxcbiAgICBlcnJvcjogKChpc09ic2VydmVyID8gbmV4dEhhbmRsZXIuZXJyb3IgOiBlcnJvckhhbmRsZXIpIHx8IG5vb3ApLmJpbmQoc2VsZiksXG4gICAgY29tcGxldGU6ICgoaXNPYnNlcnZlciA/IG5leHRIYW5kbGVyLmNvbXBsZXRlIDogY29tcGxldGlvbkhhbmRsZXIpIHx8IG5vb3ApLmJpbmQoc2VsZilcbiAgfTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUludm9rZUlkKHN0YXRlTm9kZUlkLCBpbmRleCkge1xuICByZXR1cm4gXCJcIi5jb25jYXQoc3RhdGVOb2RlSWQsIFwiOmludm9jYXRpb25bXCIpLmNvbmNhdChpbmRleCwgXCJdXCIpO1xufVxuZnVuY3Rpb24gaXNSYWlzYWJsZUFjdGlvbihhY3Rpb24pIHtcbiAgcmV0dXJuIChhY3Rpb24udHlwZSA9PT0gcmFpc2UgfHwgYWN0aW9uLnR5cGUgPT09IHNlbmQgJiYgYWN0aW9uLnRvID09PSBTcGVjaWFsVGFyZ2V0cy5JbnRlcm5hbCkgJiYgdHlwZW9mIGFjdGlvbi5kZWxheSAhPT0gJ251bWJlcic7XG59XG5cbmV4cG9ydCB7IGNyZWF0ZUludm9rZUlkLCBldmFsdWF0ZUd1YXJkLCBmbGF0dGVuLCBnZXRBY3Rpb25UeXBlLCBnZXRFdmVudFR5cGUsIGludGVyb3BTeW1ib2xzLCBpc0FjdG9yLCBpc0FycmF5LCBpc0JlaGF2aW9yLCBpc0J1aWx0SW5FdmVudCwgaXNGdW5jdGlvbiwgaXNNYWNoaW5lLCBpc09ic2VydmFibGUsIGlzUHJvbWlzZUxpa2UsIGlzUmFpc2FibGVBY3Rpb24sIGlzU3RhdGVMaWtlLCBpc1N0cmluZywga2V5cywgbWFwQ29udGV4dCwgbWFwRmlsdGVyVmFsdWVzLCBtYXBWYWx1ZXMsIG1hdGNoZXNTdGF0ZSwgbmVzdGVkUGF0aCwgbm9ybWFsaXplVGFyZ2V0LCBwYXJ0aXRpb24sIHBhdGgsIHBhdGhUb1N0YXRlVmFsdWUsIHBhdGhzVG9TdGF0ZVZhbHVlLCByZXBvcnRVbmhhbmRsZWRFeGNlcHRpb25Pbkludm9jYXRpb24sIHN5bWJvbE9ic2VydmFibGUsIHRvQXJyYXksIHRvQXJyYXlTdHJpY3QsIHRvRXZlbnRPYmplY3QsIHRvR3VhcmQsIHRvSW52b2tlU291cmNlLCB0b09ic2VydmVyLCB0b1NDWE1MRXZlbnQsIHRvU3RhdGVQYXRoLCB0b1N0YXRlUGF0aHMsIHRvU3RhdGVWYWx1ZSwgdG9UcmFuc2l0aW9uQ29uZmlnQXJyYXksIHVuaXF1ZUlkLCB1cGRhdGVDb250ZXh0LCB1cGRhdGVIaXN0b3J5U3RhdGVzLCB1cGRhdGVIaXN0b3J5VmFsdWUsIHdhcm4gfTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiaW1wb3J0IHsgYnV0dG9uTW9kdWxlIH0gZnJvbSBcIi4vQnV0dG9uTW9kdWxlLmpzXCI7XG5pbXBvcnQgRXZlbnRCdXMgZnJvbSBcIi4vRXZlbnRCdXMuanNcIjtcbmltcG9ydCBFdmVudE1vZHVsZSBmcm9tIFwiLi9FdmVudE1vZHVsZS5qc1wiO1xuaW1wb3J0IHsgaXNNb2JpbGVWaWV3LCBhZGRVc2VyQWdlbnRGbGFncyB9IGZyb20gXCIuL1VzZXJBZ2VudE1vZHVsZS5qc1wiO1xuaW1wb3J0IFwiLi90YWxrQnV0dG9uLmNzc1wiO1xuaW1wb3J0IFwiLi9tb2JpbGUuc2Nzc1wiO1xuaW1wb3J0IFwiLi9yZWN0YW5nbGVzLmNzc1wiO1xuKGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgY29uc3QgcGFnZVNjcmlwdCA9IHJlcXVpcmUoXCJyYXctbG9hZGVyIS4vQXVkaW9Nb2R1bGUuanNcIikuZGVmYXVsdDtcbiAgYWRkVXNlckFnZW50RmxhZ3MoKTtcbiAgRXZlbnRNb2R1bGUuaW5pdCgpO1xuICBzZXR1cEV2ZW50QnVzKCk7XG5cbiAgLy8gQ3JlYXRlIGEgTXV0YXRpb25PYnNlcnZlciB0byBsaXN0ZW4gZm9yIGNoYW5nZXMgdG8gdGhlIERPTVxuICB2YXIgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAobXV0YXRpb25zKSB7XG4gICAgLy8gQ2hlY2sgZWFjaCBtdXRhdGlvblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbXV0YXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbXV0YXRpb24gPSBtdXRhdGlvbnNbaV07XG5cbiAgICAgIC8vIElmIG5vZGVzIHdlcmUgYWRkZWQsIGNoZWNrIGVhY2ggb25lXG4gICAgICBpZiAobXV0YXRpb24uYWRkZWROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbXV0YXRpb24uYWRkZWROb2Rlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgIHZhciBub2RlID0gbXV0YXRpb24uYWRkZWROb2Rlc1tqXTtcblxuICAgICAgICAgIC8vIElmIHRoZSBub2RlIGlzIHRoZSBhcHByb3ByaWF0ZSBjb250YWluZXIgZWxlbWVudCwgYWRkIHRoZSBidXR0b24gYW5kIHN0b3Agb2JzZXJ2aW5nXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgbm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImRpdlwiICYmXG4gICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5jb250YWlucyhcImZpeGVkXCIpICYmXG4gICAgICAgICAgICBub2RlLmNsYXNzTGlzdC5jb250YWlucyhcImJvdHRvbS0xNlwiKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgdmFyIGZvb3RlciA9IG5vZGU7XG4gICAgICAgICAgICB2YXIgYnV0dG9uQ29udGFpbmVyID0gZm9vdGVyLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgICAgIFwiLnJlbGF0aXZlLmZsZXguZmxleC1jb2xcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChidXR0b25Db250YWluZXIpIHtcbiAgICAgICAgICAgICAgYWRkVGFsa0J1dHRvbihidXR0b25Db250YWluZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiTm8gYnV0dG9uIGNvbnRhaW5lciBmb3VuZCBpbiBmb290ZXJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWFubm90YXRlRE9NKCkpIHtcbiAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiUmVxdWlyZWQgZWxlbWVudHMgbm90IGZvdW5kIGluIERPTVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc01vYmlsZVZpZXcoKSkge1xuICAgICAgICAgICAgICBidXR0b25Nb2R1bGUuY3JlYXRlRXhpdEJ1dHRvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgZnVuY3Rpb24gc2V0dXBFdmVudEJ1cygpIHtcbiAgICAvLyBTZXR0aW5nIHRoZSBjb3JyZWN0IGNvbnRleHRcbiAgICBsZXQgY29udGV4dCA9IHdpbmRvdztcbiAgICBpZiAoR01faW5mby5zY3JpcHRIYW5kbGVyICE9PSBcIlVzZXJzY3JpcHRzXCIpIHtcbiAgICAgIGNvbnRleHQgPSB1bnNhZmVXaW5kb3c7XG4gICAgfVxuICAgIGNvbnRleHQuRXZlbnRCdXMgPSBFdmVudEJ1czsgLy8gTWFrZSB0aGUgRXZlbnRCdXMgYXZhaWxhYmxlIHRvIHRoZSBwYWdlIHNjcmlwdFxuICB9XG5cbiAgZnVuY3Rpb24gYW5ub3RhdGVET00oKSB7XG4gICAgLy8gQWRkIGlkIGF0dHJpYnV0ZXMgdG8gaW1wb3J0YW50IGVsZW1lbnRzXG4gICAgY29uc3QgZm91bmRQcm9tcHQgPSBhZGRJZFByb21wdFRleHRBcmVhKCk7XG4gICAgY29uc3QgZm91bmRGb290ZXIgPSBhZGRJZEZvb3RlcigpO1xuICAgIGNvbnN0IGZvdW5kQXVkaW9Db250cm9scyA9IGFkZElkQXVkaW9Db250cm9scygpO1xuICAgIGNvbnN0IGZvdW5kRXhwZXJpZW5jZXNCdXR0b24gPSBhZGRJZEV4cGVyaWVuY2VzQnV0dG9uKCk7XG4gICAgcmV0dXJuIChcbiAgICAgIGZvdW5kUHJvbXB0ICYmIGZvdW5kRm9vdGVyICYmIGZvdW5kQXVkaW9Db250cm9scyAmJiBmb3VuZEV4cGVyaWVuY2VzQnV0dG9uXG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZElkUHJvbXB0VGV4dEFyZWEoKSB7XG4gICAgdmFyIHRleHRhcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS1wcm9tcHRcIik7XG4gICAgaWYgKCF0ZXh0YXJlYSkge1xuICAgICAgLy8gRmluZCB0aGUgZmlyc3QgPHRleHRhcmVhPiBlbGVtZW50IGFuZCBnaXZlIGl0IGFuIGlkXG4gICAgICB2YXIgdGV4dGFyZWFFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInRleHRhcmVhXCIpO1xuICAgICAgaWYgKHRleHRhcmVhRWxlbWVudCkge1xuICAgICAgICB0ZXh0YXJlYUVsZW1lbnQuaWQgPSBcInNheXBpLXByb21wdFwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiTm8gPHRleHRhcmVhPiBlbGVtZW50IGZvdW5kXCIpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkSWRGb290ZXIoKSB7XG4gICAgLy8gRmluZCBhbGwgYXVkaW8gZWxlbWVudHMgb24gdGhlIHBhZ2VcbiAgICB2YXIgYXVkaW9FbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJhdWRpb1wiKTtcbiAgICB2YXIgZm91bmQgPSBmYWxzZTsgLy8gZGVmYXVsdCB0byBub3QgZm91bmRcblxuICAgIGF1ZGlvRWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoYXVkaW8pIHtcbiAgICAgIHZhciBwcmVjZWRpbmdEaXYgPSBhdWRpby5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuXG4gICAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGZvdW5kIGEgZGl2LCB3ZSBjYW4gc2tpcCBmdXJ0aGVyIGl0ZXJhdGlvbnNcbiAgICAgIGlmIChmb3VuZCkgcmV0dXJuO1xuXG4gICAgICAvLyBDaGVjayBpZiB0aGUgcHJlY2VkaW5nIGVsZW1lbnQgaXMgYSBkaXZcbiAgICAgIGlmIChwcmVjZWRpbmdEaXYgJiYgcHJlY2VkaW5nRGl2LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJkaXZcIikge1xuICAgICAgICAvLyBBc3NpZ24gYW4gSUQgdG8gdGhlIGRpdlxuICAgICAgICBwcmVjZWRpbmdEaXYuaWQgPSBcInNheXBpLWZvb3RlclwiO1xuICAgICAgICBmb3VuZCA9IHRydWU7IC8vIHNldCB0byBmb3VuZFxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGZvdW5kO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkSWRBdWRpb0NvbnRyb2xzKCkge1xuICAgIC8vIEZpbmQgYWxsIGF1ZGlvIGVsZW1lbnRzIG9uIHRoZSBwYWdlXG4gICAgdmFyIGF1ZGlvRWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiYXVkaW9cIik7XG4gICAgdmFyIGZvdW5kID0gZmFsc2U7IC8vIGRlZmF1bHQgdG8gbm90IGZvdW5kXG5cbiAgICBhdWRpb0VsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGF1ZGlvKSB7XG4gICAgICB2YXIgbmV4dERpdiA9IGF1ZGlvLm5leHRFbGVtZW50U2libGluZztcblxuICAgICAgLy8gSWYgd2UndmUgYWxyZWFkeSBmb3VuZCBhIGRpdiwgd2UgY2FuIHNraXAgZnVydGhlciBpdGVyYXRpb25zXG4gICAgICBpZiAoZm91bmQpIHJldHVybjtcblxuICAgICAgLy8gQ2hlY2sgaWYgdGhlIHByZWNlZGluZyBlbGVtZW50IGlzIGEgZGl2XG4gICAgICBpZiAobmV4dERpdiAmJiBuZXh0RGl2LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJkaXZcIikge1xuICAgICAgICAvLyBBc3NpZ24gYW4gSUQgdG8gdGhlIGRpdlxuICAgICAgICBuZXh0RGl2LmlkID0gXCJzYXlwaS1hdWRpby1jb250cm9sc1wiO1xuICAgICAgICBmb3VuZCA9IHRydWU7IC8vIHNldCB0byBmb3VuZFxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGZvdW5kO1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkSWRFeHBlcmllbmNlc0J1dHRvbigpIHtcbiAgICAvLyBGaW5kIGFsbCBhdWRpbyBlbGVtZW50cyBvbiB0aGUgcGFnZVxuICAgIHZhciBhdWRpb0NvbnRyb2xzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS1hdWRpby1jb250cm9sc1wiKTtcbiAgICBpZiAoYXVkaW9Db250cm9scykge1xuICAgICAgdmFyIG5leHRTaWIgPSBhdWRpb0NvbnRyb2xzLm5leHRFbGVtZW50U2libGluZztcbiAgICAgIC8vIENoZWNrIGlmIHRoZSBlbGVtZW50IGlzIGEgYnV0dG9uXG4gICAgICBpZiAobmV4dFNpYiAmJiBuZXh0U2liLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJidXR0b25cIikge1xuICAgICAgICAvLyBBc3NpZ24gYW4gSUQgdG8gdGhlIGRpdlxuICAgICAgICBuZXh0U2liLmlkID0gXCJzYXlwaS1leHBlcmllbmNlcy1idXR0b25cIjtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluamVjdFNjcmlwdChjYWxsYmFjaykge1xuICAgIHZhciBzY3JpcHRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICBzY3JpcHRFbGVtZW50LnR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiO1xuICAgIHNjcmlwdEVsZW1lbnQuaWQgPSBcInNheXBpLXNjcmlwdFwiO1xuICAgIHNjcmlwdEVsZW1lbnQudGV4dENvbnRlbnQgPSBwYWdlU2NyaXB0O1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0RWxlbWVudCk7XG5cbiAgICAvLyBDYWxsIHRoZSBjYWxsYmFjayBmdW5jdGlvbiBhZnRlciB0aGUgc2NyaXB0IGlzIGFkZGVkXG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZFRhbGtCdXR0b24oY29udGFpbmVyKSB7XG4gICAgLy8gY3JlYXRlIGEgY29udGFpbmluZyBkaXZcbiAgICB2YXIgcGFuZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHBhbmVsLmlkID0gXCJzYXlwaS1wYW5lbFwiO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChwYW5lbCk7XG5cbiAgICAvLyBDcmVhdGUgdGhlIHRhbGsgYnV0dG9uIHVzaW5nIEJ1dHRvbk1vZHVsZVxuICAgIGNvbnN0IGxhYmVsID1cbiAgICAgIFwiVGFsayAoSG9sZCBDb250cm9sICsgU3BhY2UgdG8gdXNlIGhvdGtleS4gRG91YmxlIGNsaWNrIHRvIHRvZ2dsZSBhdXRvLXN1Ym1pdCBvbi9vZmYpXCI7XG4gICAgdmFyIGJ1dHRvbiA9IGJ1dHRvbk1vZHVsZS5jcmVhdGVCdXR0b24oXCJcIiwgKCkgPT4ge30pOyAvLyBUaGUgY2FsbGJhY2sgaXMgZW1wdHkgZm9yIG5vdywgYnV0IHlvdSBjYW4gYWRkIGZ1bmN0aW9uYWxpdGllcyBpZiBuZWVkZWQuXG5cbiAgICBidXR0b24uaWQgPSBcInNheXBpLXRhbGtCdXR0b25cIjtcbiAgICBidXR0b24udHlwZSA9IFwiYnV0dG9uXCI7XG5cbiAgICAvLyBTZXQgQVJJQSBsYWJlbCBhbmQgdG9vbHRpcFxuICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIGxhYmVsKTtcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKFwidGl0bGVcIiwgbGFiZWwpO1xuXG4gICAgY29uc3QgY2xhc3NOYW1lcyA9XG4gICAgICBcInJlbGF0aXZlIGZsZXggbXQtMSBtYi0xIHJvdW5kZWQtZnVsbCBweC0yIHB5LTMgdGV4dC1jZW50ZXIgYmctY3JlYW0tNTUwIGhvdmVyOmJnLWNyZWFtLTY1MCBob3Zlcjp0ZXh0LWJyYW5kLWdyZWVuLTcwMCB0ZXh0LW11dGVkXCI7XG4gICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lcy5zcGxpdChcIiBcIikpO1xuXG4gICAgLy8gRW5hYmxlIGF1dG9zdWJtaXQgYnkgZGVmYXVsdFxuICAgIGJ1dHRvbi5kYXRhc2V0LmF1dG9zdWJtaXQgPSBcInRydWVcIjtcbiAgICBidXR0b24uY2xhc3NMaXN0LmFkZChcImF1dG9TdWJtaXRcIik7XG5cbiAgICBwYW5lbC5hcHBlbmRDaGlsZChidXR0b24pO1xuICAgIGJ1dHRvbk1vZHVsZS5hZGRUYWxrSWNvbihidXR0b24pO1xuXG4gICAgLy8gQ2FsbCB0aGUgZnVuY3Rpb24gdG8gaW5qZWN0IHRoZSBzY3JpcHQgYWZ0ZXIgdGhlIGJ1dHRvbiBoYXMgYmVlbiBhZGRlZFxuICAgIGluamVjdFNjcmlwdChyZWdpc3RlckF1ZGlvQnV0dG9uRXZlbnRzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlZ2lzdGVyQXVkaW9CdXR0b25FdmVudHMoKSB7XG4gICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXlwaS10YWxrQnV0dG9uXCIpO1xuXG4gICAgLy8gQXR0YWNoIHRoZSBldmVudCBsaXN0ZW5lcnNcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwibW91c2Vkb3duXCIsXG4gICAgICBFdmVudE1vZHVsZS5oYW5kbGVUYWxrTW91c2VEb3duLmJpbmQoRXZlbnRNb2R1bGUpXG4gICAgKTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwibW91c2V1cFwiLFxuICAgICAgRXZlbnRNb2R1bGUuaGFuZGxlVGFsa01vdXNlVXAuYmluZChFdmVudE1vZHVsZSlcbiAgICApO1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiZGJsY2xpY2tcIiwgKCkgPT5cbiAgICAgIEV2ZW50TW9kdWxlLmhhbmRsZVRhbGtEb3VibGVDbGljayhidXR0b24pXG4gICAgKTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgKGUpID0+XG4gICAgICBFdmVudE1vZHVsZS5oYW5kbGVUYWxrVG91Y2hTdGFydChidXR0b24sIGUpXG4gICAgKTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsICgpID0+XG4gICAgICBFdmVudE1vZHVsZS5oYW5kbGVUYWxrVG91Y2hFbmQoYnV0dG9uKVxuICAgICk7XG5cbiAgICBFdmVudE1vZHVsZS5yZWdpc3Rlck90aGVyQXVkaW9CdXR0b25FdmVudHMoYnV0dG9uKTtcbiAgICBFdmVudE1vZHVsZS5yZWdpc3RlckhvdGtleSgpO1xuICB9XG5cbiAgLy8gU3RhcnQgb2JzZXJ2aW5nIHRoZSBlbnRpcmUgZG9jdW1lbnQgZm9yIGNoYW5nZXMgdG8gY2hpbGQgbm9kZXMgYW5kIHN1YnRyZWVcbiAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudCwgeyBjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWUgfSk7XG59KSgpO1xuIl0sIm5hbWVzIjpbIkFuaW1hdGlvbk1vZHVsZSIsIl9jbGFzc0NhbGxDaGVjayIsIl9jcmVhdGVDbGFzcyIsImtleSIsInZhbHVlIiwic3RhcnRBbmltYXRpb24iLCJhbmltYXRpb24iLCJzdG9wT3RoZXJBbmltYXRpb25zIiwicmVjdGFuZ2xlcyIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsInJlY3RhbmdsZXNTZWxlY3RvciIsImZvckVhY2giLCJyZWN0IiwiY2xhc3NMaXN0IiwiYWRkIiwic3RvcEFuaW1hdGlvbiIsInJlbW92ZSIsInN0b3BBbGxBbmltYXRpb25zIiwiX3RoaXMiLCJ0YWxrQnV0dG9uQW5pbWF0aW9ucyIsImtlZXBBbmltYXRpb24iLCJfdGhpczIiLCJfZGVmaW5lUHJvcGVydHkiLCJkZWZhdWx0IiwiZXhpdE1vYmlsZU1vZGUiLCJpc01vYmlsZVZpZXciLCJFdmVudEJ1cyIsIkV2ZW50TW9kdWxlIiwiU3RhdGVNYWNoaW5lU2VydmljZSIsImV4aXRJY29uU1ZHIiwicmVjdGFuZ2xlc1NWRyIsInRhbGtJY29uU1ZHIiwiQnV0dG9uTW9kdWxlIiwicGxheUJ1dHRvbiIsImFjdG9yIiwiaGFuZGxlUGxheUJ1dHRvbkNsaWNrIiwiYmluZCIsInJlZ2lzdGVyT3RoZXJFdmVudHMiLCJvbiIsImhhbmRsZUF1dG9TdWJtaXQiLCJjcmVhdGVCdXR0b24iLCJsYWJlbCIsImNhbGxiYWNrIiwiYnV0dG9uIiwiY3JlYXRlRWxlbWVudCIsInRleHRDb250ZW50Iiwib25jbGljayIsInN0eWxlQnV0dG9uIiwic3R5bGVzIiwiaGFzT3duUHJvcGVydHkiLCJzdHlsZSIsImFkZFRhbGtJY29uIiwidXBkYXRlSWNvbkNvbnRlbnQiLCJ3aW5kb3ciLCJtYXRjaE1lZGlhIiwiYWRkTGlzdGVuZXIiLCJzZXR1cENsYXNzT2JzZXJ2ZXIiLCJpY29uQ29udGFpbmVyIiwiaW5uZXJIVE1MIiwidGFyZ2V0Tm9kZSIsImRvY3VtZW50RWxlbWVudCIsImNvbmZpZyIsImF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVGaWx0ZXIiLCJtdXRhdGlvbnNMaXN0Iiwib2JzZXJ2ZXIiLCJfaXRlcmF0b3IiLCJfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlciIsIl9zdGVwIiwicyIsIm4iLCJkb25lIiwibXV0YXRpb24iLCJ0eXBlIiwiYXR0cmlidXRlTmFtZSIsImNvbnRhaW5zIiwiZXJyIiwiZSIsImYiLCJNdXRhdGlvbk9ic2VydmVyIiwib2JzZXJ2ZSIsImNyZWF0ZUV4aXRCdXR0b24iLCJpZCIsImNsYXNzTmFtZSIsInNldEF0dHJpYnV0ZSIsImJvZHkiLCJhcHBlbmRDaGlsZCIsImNyZWF0ZVBsYXlCdXR0b24iLCJhZGRFdmVudExpc3RlbmVyIiwic2hvd1BsYXlCdXR0b24iLCJoaWRlUGxheUJ1dHRvbiIsInNlbmQiLCJlbWl0Iiwic2ltdWxhdGVGb3JtU3VibWl0IiwidGV4dGFyZWEiLCJnZXRFbGVtZW50QnlJZCIsImVudGVyRXZlbnQiLCJLZXlib2FyZEV2ZW50IiwiYnViYmxlcyIsImtleUNvZGUiLCJ3aGljaCIsImRpc3BhdGNoRXZlbnQiLCJ0YWxrQnV0dG9uIiwiZGF0YXNldCIsImF1dG9zdWJtaXQiLCJjb25zb2xlIiwibG9nIiwiYnV0dG9uTW9kdWxlIiwiRXZlbnRFbWl0dGVyIiwiVVNFUl9TUEVBS0lORyIsIlVTRVJfU1RPUFBFRF9TUEVBS0lORyIsIlVTRVJfRklOSVNIRURfU1BFQUtJTkciLCJUUkFOU0NSSUJJTkciLCJQSV9TUEVBS0lORyIsIlBJX1NUT1BQRURfU1BFQUtJTkciLCJQSV9GSU5JU0hFRF9TUEVBS0lORyIsIlBBVVNFIiwiUkVBRFkiLCJQTEFZIiwiaW5pdCIsInJlZ2lzdGVyU3RhdGVNYWNoaW5lRXZlbnRzIiwiY2xlYW51cCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJoYW5kbGVUcmFuc2NyaXB0aW9uUmVzcG9uc2UiLCJzaW11bGF0ZVR5cGluZyIsImVsZW1lbnQiLCJ0ZXh0Iiwid29yZHMiLCJzcGxpdCIsImkiLCJ0eXBlV29yZCIsImxlbmd0aCIsInNldE5hdGl2ZVZhbHVlIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibGFzdFZhbHVlIiwiZXZlbnQiLCJFdmVudCIsInRhcmdldCIsInNpbXVsYXRlZCIsInRyYWNrZXIiLCJfdmFsdWVUcmFja2VyIiwic2V0VmFsdWUiLCJoYW5kbGVUYWxrTW91c2VEb3duIiwiaGFuZGxlVGFsa01vdXNlVXAiLCJoYW5kbGVUYWxrRG91YmxlQ2xpY2siLCJ0b2dnbGUiLCJnZXRBdHRyaWJ1dGUiLCJoYW5kbGVUYWxrVG91Y2hTdGFydCIsInByZXZlbnREZWZhdWx0IiwiaGFuZGxlVGFsa1RvdWNoRW5kIiwicmVnaXN0ZXJPdGhlckF1ZGlvQnV0dG9uRXZlbnRzIiwiZXZlbnROYW1lIiwiZGV0YWlsIiwiX29iamVjdFNwcmVhZCIsIndhcm4iLCJjb25jYXQiLCJyZWdpc3RlckhvdGtleSIsImN0cmxEb3duIiwiY3RybEtleSIsImNvZGUiLCJpbnRlcnByZXQiLCJtYWNoaW5lIiwib25UcmFuc2l0aW9uIiwic3RhdGUiLCJzdGFydCIsImFwcFNlcnZlclVybCIsInByb2Nlc3MiLCJlbnYiLCJBUFBfU0VSVkVSX1VSTCIsImFwaVNlcnZlclVybCIsIkFQSV9TRVJWRVJfVVJMIiwidXBsb2FkQXVkaW8iLCJhdWRpb0Jsb2IiLCJmb3JtRGF0YSIsIkZvcm1EYXRhIiwiYXVkaW9GaWxlbmFtZSIsImFwcGVuZCIsImxhbmd1YWdlIiwibmF2aWdhdG9yIiwiZmV0Y2giLCJtZXRob2QiLCJ0aGVuIiwicmVzcG9uc2UiLCJvayIsIkVycm9yIiwic3RhdHVzVGV4dCIsImpzb24iLCJyZXNwb25zZUpzb24iLCJlcnJvciIsInRyYW5zY3JpcHQiLCJzdWJzdHJpbmciLCJ1c2VyUHJlZmVyZW5jZSIsIm1hdGNoZXMiLCJpc1NhZmFyaSIsInRlc3QiLCJ1c2VyQWdlbnQiLCJhZGRVc2VyQWdlbnRGbGFncyIsImlzRmlyZWZveEFuZHJvaWQiLCJjcmVhdGVNYWNoaW5lIiwiaW5pdGlhbCIsInN0YXRlcyIsImlkbGUiLCJkZXNjcmlwdGlvbiIsImVudHJ5IiwiY29uZCIsInVzZXJTcGVha2luZyIsInBhcmFtcyIsImV4aXQiLCJwYXVzZWQiLCJhY3Rpb25zIiwiaW50ZXJuYWwiLCJwaVNwZWFraW5nIiwidHJhbnNjcmliaW5nIiwibG9hZGluZyIsImVycm9ycyIsInRyYW5zY3JpYmVGYWlsZWQiLCJwcmVkaWN0YWJsZUFjdGlvbkFyZ3VtZW50cyIsInByZXNlcnZlQWN0aW9uT3JkZXIiLCJjb250ZXh0IiwiX3JlZiIsImFjdGlvbiIsIl9yZWYyIiwidHJhbnNjcmliZUF1ZGlvIiwiYmxvYiIsInRyYW5zY3JpcHRpb24iLCJhY3RpdmF0ZVRhbGtCdXR0b24iLCJkZWFjdGl2YXRlVGFsa0J1dHRvbiIsImFjcXVpcmVNaWNyb3Bob25lIiwic2VydmljZXMiLCJndWFyZHMiLCJ0b29TaG9ydEZvclVwbG9hZCIsImR1cmF0aW9uIiwibG9uZ0Vub3VnaEZvclVwbG9hZCIsImRlbGF5cyIsInBhZ2VTY3JpcHQiLCJyZXF1aXJlIiwic2V0dXBFdmVudEJ1cyIsIm11dGF0aW9ucyIsImFkZGVkTm9kZXMiLCJqIiwibm9kZSIsIm5vZGVOYW1lIiwidG9Mb3dlckNhc2UiLCJmb290ZXIiLCJidXR0b25Db250YWluZXIiLCJxdWVyeVNlbGVjdG9yIiwiYWRkVGFsa0J1dHRvbiIsImFubm90YXRlRE9NIiwiZGlzY29ubmVjdCIsIkdNX2luZm8iLCJzY3JpcHRIYW5kbGVyIiwidW5zYWZlV2luZG93IiwiZm91bmRQcm9tcHQiLCJhZGRJZFByb21wdFRleHRBcmVhIiwiZm91bmRGb290ZXIiLCJhZGRJZEZvb3RlciIsImZvdW5kQXVkaW9Db250cm9scyIsImFkZElkQXVkaW9Db250cm9scyIsImZvdW5kRXhwZXJpZW5jZXNCdXR0b24iLCJhZGRJZEV4cGVyaWVuY2VzQnV0dG9uIiwidGV4dGFyZWFFbGVtZW50IiwiYXVkaW9FbGVtZW50cyIsImZvdW5kIiwiYXVkaW8iLCJwcmVjZWRpbmdEaXYiLCJwcmV2aW91c0VsZW1lbnRTaWJsaW5nIiwidGFnTmFtZSIsIm5leHREaXYiLCJuZXh0RWxlbWVudFNpYmxpbmciLCJhdWRpb0NvbnRyb2xzIiwibmV4dFNpYiIsImluamVjdFNjcmlwdCIsInNjcmlwdEVsZW1lbnQiLCJjb250YWluZXIiLCJwYW5lbCIsImNsYXNzTmFtZXMiLCJyZWdpc3RlckF1ZGlvQnV0dG9uRXZlbnRzIiwiY2hpbGRMaXN0Iiwic3VidHJlZSJdLCJzb3VyY2VSb290IjoiIn0=